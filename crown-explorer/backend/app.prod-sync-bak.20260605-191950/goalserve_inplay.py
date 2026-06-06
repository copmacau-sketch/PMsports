"""Goalserve In-Play ingestion.

Polls the IP-whitelisted Goalserve In-Play feed
(``http://inplay.goalserve.com/inplay-soccer.gz``) and projects every live
soccer event into the exact ``OddsEvent`` / ``main_odds`` shape the H5
frontend already consumes — so 滚球 cards render with no frontend change.

Design notes
------------
* **Goalserve id == gid.**  We use Goalserve's ``info.id`` directly as the
  event id; there is no separate Crown id space and no mapping table.
* **One upstream request at a time.**  A single server-side poller hits
  Goalserve at ``GS_POLL_INTERVAL`` (default 1.5s) regardless of how many
  browsers are connected.  Goalserve rate-limits to ~1 req/s and replies
  ``{"status":"429"}`` when exceeded, so we back off exponentially on 429.
  Browsers poll the ``/dev/shm``-backed endpoint at <1s — cheap and local.
* **Snapshot files** live in ``/dev/shm/goalserve_live/{id}.json`` (mirrors
  the existing ``/dev/shm/oddsapi_live`` pattern).  Each file is a full
  normalized event incl. ``main_odds`` and a private ``_markets`` blob for
  the detail endpoint.  Files for events that drop out of the feed are
  pruned after ``GS_STALE_GRACE`` seconds.

Run standalone for systemd::

    python -m app.goalserve_inplay
"""
from __future__ import annotations

import asyncio
import gzip
import json
import logging
import os
import re
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

log = logging.getLogger("goalserve_inplay")

# --------------------------------------------------------------------------
# Config (env-overridable)
GS_INPLAY_URL = os.environ.get("GS_INPLAY_URL", "http://inplay.goalserve.com/inplay-soccer.gz")
GS_LIVE_DIR = Path(os.environ.get("GS_LIVE_DIR", "/dev/shm/goalserve_live"))
GS_POLL_INTERVAL = float(os.environ.get("GS_POLL_INTERVAL", "3.0"))
GS_STALE_GRACE = float(os.environ.get("GS_STALE_GRACE", "90"))
GS_HTTP_TIMEOUT = float(os.environ.get("GS_HTTP_TIMEOUT", "10"))
GS_MAX_BACKOFF = float(os.environ.get("GS_MAX_BACKOFF", "30"))
# When the WS client is publishing, the REST poller stays standby — it skips
# its upstream fetch as long as the WS index is fresher than this many
# seconds.  Set GS_REST_STANDBY=0 to disable (always poll).
GS_WS_FRESH_THRESHOLD = float(os.environ.get("GS_WS_FRESH_THRESHOLD", "8"))
GS_REST_STANDBY = os.environ.get("GS_REST_STANDBY", "1").strip().lower() not in ("0", "false", "no", "")


def _enabled() -> bool:
    return os.environ.get("GS_INPLAY_ENABLE", "1").strip().lower() not in ("0", "false", "no", "")


# --------------------------------------------------------------------------
# Market mapping — Goalserve market id -> canonical name consumed by
# external._main_odds_from_ws_snap().  Keep names byte-identical to that
# helper's `by_name` keys.
GS_CANON: "dict[int, str]" = {
    1777: "ML",                 # Fulltime Result (1X2)
    12: "Spread",               # Asian Handicap (signed)
    90008: "Totals",            # Over/Under Line
    10563: "Draw No Bet",
    10115: "Double Chance",
    27: "Half Time Result",     # 1x2 (1st Half)
    29: "Spread HT",            # Asian Handicap (1st Half)
    90009: "Totals HT",         # Over/Under Line (1st Half)
    520: "Corners Totals",      # Total Corners
    10001: "Correct Score",         # "Final Score" = full-time scoreline (波胆)
    10565: "Both Teams To Score",   # BTTS (full time)
    317: "Both Teams To Score HT",  # BTTS (1st Half)
}

# Canonical names rendered inline on the list card; everything else is an
# "extra market" surfaced via the +N badge / detail page.
_INLINED = {
    "ML", "Spread", "Totals", "Draw No Bet", "Both Teams To Score",
    "Half Time Result", "Double Chance", "Spread HT", "Totals HT",
    "Corners Totals",
}

# period -> api-sports-style short code (frontend live ticker understands these)
_PERIOD_SHORT = {
    "1st half": "1H", "first half": "1H",
    "half time": "HT", "halftime": "HT",
    "2nd half": "2H", "second half": "2H",
    "extra time": "ET", "1st extra": "ET", "2nd extra": "ET",
    "penalties": "P", "penalty shootout": "P",
}


def _f(v) -> float:
    """Coerce to float for *prices* — clamps non-positive to 0 (suspended)."""
    try:
        f = float(v)
        return f if f > 0 else 0.0
    except (TypeError, ValueError):
        return 0.0


def _hdp(v) -> float:
    """Coerce to float for *handicaps* — preserves negative values
    (home-perspective signing).  Empty / non-numeric → 0.0."""
    if v in (None, ""):
        return 0.0
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def _participants(market: dict) -> "list[dict]":
    """Return participant dicts as a list (object-keyed in the feed)."""
    parts = market.get("participants") or {}
    if isinstance(parts, dict):
        return [p for p in parts.values() if isinstance(p, dict)]
    if isinstance(parts, list):
        return [p for p in parts if isinstance(p, dict)]
    return []


def _price(p: dict, market_suspended: bool) -> float:
    if market_suspended or str(p.get("suspend")) == "1":
        return 0.0
    return _f(p.get("value_eu"))


def _by_role(parts: "list[dict]") -> "dict[str, dict]":
    """Index participants by their (lowercased) name role."""
    out: "dict[str, dict]" = {}
    for p in parts:
        role = str(p.get("name") or p.get("short_name") or "").strip().lower()
        if role and role not in out:
            out[role] = p
    return out


def _canon_row(canon_name: str, market: dict) -> "list[dict]":
    """Translate a Goalserve market into the canonical odds-row list shape
    consumed by _main_odds_from_ws_snap (keys: home/draw/away/over/under/
    yes/no/hdp/label)."""
    susp = str(market.get("suspend")) == "1"
    parts = _participants(market)
    role = _by_role(parts)

    def pr(name: str) -> float:
        p = role.get(name)
        return _price(p, susp) if p else 0.0

    if canon_name in ("ML",):
        return [{"home": pr("home"), "draw": pr("draw"), "away": pr("away")}]

    if canon_name == "Half Time Result":
        # consumer indexes rows[0..2]; emit one row per outcome
        return [
            {"home": pr("home")},
            {"draw": pr("draw")},
            {"away": pr("away")},
        ]

    if canon_name in ("Spread", "Spread HT"):
        home = role.get("home") or {}
        away = role.get("away") or {}
        hdp = home.get("handicap")
        if hdp is None and away.get("handicap") is not None:
            try:
                hdp = -float(away["handicap"])
            except (TypeError, ValueError):
                hdp = away.get("handicap")
        return [{
            "home": _price(home, susp) if home else 0.0,
            "away": _price(away, susp) if away else 0.0,
            "hdp": _hdp(hdp),
        }]

    if canon_name in ("Totals", "Totals HT", "Corners Totals"):
        over = role.get("over") or {}
        under = role.get("under") or {}
        line = over.get("handicap")
        if line is None:
            line = under.get("handicap")
        return [{
            "over": _price(over, susp) if over else 0.0,
            "under": _price(under, susp) if under else 0.0,
            "hdp": _hdp(line),
        }]

    if canon_name == "Draw No Bet":
        return [{"home": pr("home"), "away": pr("away")}]

    if canon_name in ("Both Teams To Score", "Both Teams To Score HT"):
        return [{"yes": pr("yes"), "no": pr("no")}]

    if canon_name == "Correct Score":
        # Outcomes arrive as "H:A" scorelines (e.g. "2:1").  Emit one row per
        # scoreline with a "H-A" label — the shape build_rcn() turns into the
        # <PD><ior_HhCc> tags the r_cn parser / PHP already render as 波胆.
        rows: "list[dict]" = []
        for p in parts:
            nm = str(p.get("name") or p.get("short_name") or "").strip()
            mm = re.match(r"^(\d+)\s*[:\-]\s*(\d+)$", nm)
            if not mm:
                continue
            price = _price(p, susp)
            if price > 0:
                rows.append({"label": f"{mm.group(1)}-{mm.group(2)}", "price": price})
        return rows

    if canon_name == "Double Chance":
        rows = []
        for p in parts:
            rows.append({
                "label": str(p.get("name") or ""),
                "under": _price(p, susp),
            })
        return rows

    # default passthrough — one row per participant
    return [{"label": str(p.get("name") or ""), "price": _price(p, susp)} for p in parts]


def _passthrough_market(gs_key: str, market: dict) -> dict:
    """Generic OddsMarket-shape projection for the detail endpoint."""
    susp = str(market.get("suspend")) == "1"
    odds = []
    for p in _participants(market):
        row = {
            "selection": p.get("name"),
            "price": _price(p, susp),
        }
        if p.get("handicap") not in (None, ""):
            row["handicap"] = p.get("handicap")
        odds.append(row)
    try:
        mid_int = int(gs_key)
    except (TypeError, ValueError):
        mid_int = 0
    return {
        "market_id": str(gs_key).zfill(6),
        "market_id_int": mid_int,
        "market_name": market.get("name") or str(gs_key),
        "odds": odds,
        "updated_at_iso": None,
        "updated_at_ts": None,
    }


def _iso_from_ts(ts) -> "str | None":
    try:
        return datetime.fromtimestamp(int(ts), tz=timezone.utc).isoformat()
    except (TypeError, ValueError, OSError):
        return None


def normalize_event(gsid: str, ev: dict) -> "dict | None":
    """Project one Goalserve event into the OddsEvent snapshot dict."""
    if not isinstance(ev, dict):
        return None
    info = ev.get("info") or {}
    ti = ev.get("team_info") or {}
    core = ev.get("core") or {}
    odds = ev.get("odds") or {}

    try:
        ev_id = int(info.get("id") or gsid)
    except (TypeError, ValueError):
        return None

    home = (ti.get("home") or {}).get("name") or (info.get("name") or " vs ").split(" vs ")[0]
    away = (ti.get("away") or {}).get("name") or ((info.get("name") or " vs ").split(" vs ") + [""])[1]

    score = str(info.get("score") or "")
    sh = sa = None
    if ":" in score:
        a, _, b = score.partition(":")
        try:
            sh, sa = int(a), int(b)
        except ValueError:
            sh = sa = None

    finished = str(core.get("finished")) == "1"
    period = str(info.get("period") or "")
    status_short = _PERIOD_SHORT.get(period.strip().lower(), period or None)
    try:
        elapsed = int(info.get("minute")) if str(info.get("minute") or "").isdigit() else None
    except (TypeError, ValueError):
        elapsed = None

    # ---- markets ----
    canon_markets: "list[dict]" = []
    bookmaker_markets: "list[dict]" = []
    extra: "list[dict]" = []
    for gs_key, market in odds.items():
        if not isinstance(market, dict):
            continue
        try:
            mid_int = int(market.get("id") or gs_key)
        except (TypeError, ValueError):
            mid_int = None
        canon = GS_CANON.get(mid_int) if mid_int is not None else None
        if canon:
            canon_markets.append({"name": canon, "odds": _canon_row(canon, market)})
        bookmaker_markets.append(_passthrough_market(str(market.get("id") or gs_key), market))
        nm = market.get("name") or canon or str(gs_key)
        if (canon or nm) not in _INLINED:
            extra.append({"name": nm, "outcomes": len(_participants(market))})

    # main_odds via the shared projection — imported lazily to avoid a
    # circular import at module load (external imports nothing from here).
    from .routers.external import _main_odds_from_ws_snap
    mo = _main_odds_from_ws_snap({"markets": canon_markets})
    if not (mo and any(mo.values())):
        mo = None

    # Live stats — corners / cards / fouls / shots — passed in via
    # ``info["_stats"]`` (Goalserve WS `stats` dict).  Each key is a
    # ``[home, away]`` int pair.  Keys: c=corners, y=yellow, r=red,
    # f=fouls, s=shots-on-target, o=offsides, p=penalties, t=throw-ins,
    # g=goals (often stale, prefer cms), a=attacks, h1=first-half goals.
    def _pair(stats: dict, k: str):
        v = stats.get(k) if isinstance(stats, dict) else None
        if isinstance(v, list) and len(v) >= 2:
            try:
                return int(v[0]), int(v[1])
            except (TypeError, ValueError):
                return None, None
        return None, None
    _st = info.get("_stats")
    yc_h, yc_a = _pair(_st, "y")
    rc_h, rc_a = _pair(_st, "r")
    co_h, co_a = _pair(_st, "c")
    fo_h, fo_a = _pair(_st, "f")
    sh_h, sh_a = _pair(_st, "s")
    # Half-time score from first-half goals (`h1`).  Only populate once
    # half-time has actually been reached — during the first half `h1`
    # equals the running score, and exposing it as the HT score would make
    # the HT-market expiry / display logic believe half-time already passed.
    _past_ht = (
        (status_short or "").upper() in ("HT", "2H", "ET", "BT", "INT", "FT", "AET", "PEN")
        or (elapsed is not None and elapsed >= 45)
    )
    ht_h, ht_a = _pair(_st, "h1") if _past_ht else (None, None)

    now = int(time.time())
    snap = {
        "id": ev_id,
        "sport_slug": "soccer",
        "league_slug": str(info.get("league_id") or ""),
        "league_name": info.get("league"),
        "league_cn": None, "home_cn": None, "away_cn": None,
        "home": home, "away": away,
        "home_id": home, "away_id": away,
        "commence_iso": _iso_from_ts(info.get("start_ts_utc") or info.get("start_ts")),
        "commence_ts": int(info.get("start_ts_utc") or info.get("start_ts") or 0) or None,
        "status": "finished" if finished else "inplay",
        "score_home": sh, "score_away": sa,
        "score_home_ht": ht_h, "score_away_ht": ht_a,
        "is_finished": finished,
        "fetched_at": now,
        "market_count": len(bookmaker_markets),
        "apisports_fixture_id": None,
        "apisports_match_iso": None,
        "apisports_stats_seen_at": now if _st else None,
        "elapsed_minute": elapsed,
        "status_short": status_short,
        "yc_home": yc_h, "yc_away": yc_a,
        "rc_home": rc_h, "rc_away": rc_a,
        "corners_home": co_h, "corners_away": co_a,
        "fouls_home": fo_h,   "fouls_away": fo_a,
        "shots_home": sh_h,   "shots_away": sh_a,
        "main_odds": mo,
        "extra_markets": extra,
        # private — not surfaced on the list; consumed by /markets endpoint
        "_markets": bookmaker_markets,
        "_bm": None,
        "_gs": {
            "mid": info.get("mid"),
            "bet365id": info.get("bet365id"),
            "state": info.get("state"),
            "seconds": info.get("seconds"),
            "period": period,
        },
        "_updated_ts": now,
    }
    return snap


def _extract_events(payload: dict) -> "dict[str, dict]":
    if isinstance(payload, dict) and isinstance(payload.get("events"), dict):
        return payload["events"]
    return {}


# --------------------------------------------------------------------------
# Read helpers (used by the router)
def read_event_full(gid: int) -> "dict | None":
    p = GS_LIVE_DIR / f"{int(gid)}.json"
    try:
        with p.open("rb") as fh:
            return json.load(fh)
    except (FileNotFoundError, ValueError, OSError):
        return None


def list_events(include_finished: bool = False) -> "list[dict]":
    out: "list[dict]" = []
    try:
        files = list(GS_LIVE_DIR.glob("*.json"))
    except OSError:
        return out
    for f in files:
        if f.name.startswith("_"):
            continue
        try:
            with f.open("rb") as fh:
                snap = json.load(fh)
        except (ValueError, OSError):
            continue
        if not include_finished and snap.get("is_finished"):
            continue
        public = {k: v for k, v in snap.items() if not k.startswith("_")}
        out.append(public)
    out.sort(key=lambda e: (e.get("league_name") or "", e.get("id") or 0))
    return out


class RateLimited(Exception):
    pass


class GoalserveInplayPoller:
    def __init__(self) -> None:
        self._task: "asyncio.Task | None" = None
        self._stop = False
        self._backoff = 0.0
        self.last_ok_ts: "float | None" = None
        self.last_event_count = 0
        self.consecutive_429 = 0

    # -- fetch (blocking; run via to_thread) --
    def _fetch(self) -> dict:
        req = urllib.request.Request(GS_INPLAY_URL, headers={"User-Agent": "crown-gold/goalserve"})
        try:
            with urllib.request.urlopen(req, timeout=GS_HTTP_TIMEOUT) as resp:
                raw = resp.read()
        except urllib.error.HTTPError as e:
            if e.code == 429:
                raise RateLimited("HTTP 429")
            raise
        try:
            data = gzip.decompress(raw)
        except (OSError, EOFError):
            data = raw
        try:
            payload = json.loads(data)
        except ValueError:
            raise RateLimited("non-JSON body (likely rate-limit page)")
        if isinstance(payload, dict) and str(payload.get("status")) == "429":
            raise RateLimited("body status 429")
        return payload

    def _ensure_dir(self) -> None:
        try:
            GS_LIVE_DIR.mkdir(parents=True, exist_ok=True)
            os.chmod(GS_LIVE_DIR, 0o775)
        except OSError:
            pass

    def _write_snapshot(self, payload: dict) -> int:
        self._ensure_dir()
        events = _extract_events(payload)
        seen: "set[str]" = set()
        index: "list[dict]" = []
        for gsid, ev in events.items():
            snap = normalize_event(gsid, ev)
            if not snap:
                continue
            fid = str(snap["id"])
            seen.add(fid)
            tmp = GS_LIVE_DIR / f".{fid}.json.tmp"
            dst = GS_LIVE_DIR / f"{fid}.json"
            try:
                with tmp.open("w", encoding="utf-8") as fh:
                    json.dump(snap, fh, ensure_ascii=False, separators=(",", ":"))
                os.replace(tmp, dst)
            except OSError as e:
                log.warning("write %s failed: %s", dst, e)
                continue
            # Optional DB hook — gated by GS_DB_WRITE.  Failures must NOT
            # affect the snapshot pipeline (display has to keep working).
            try:
                from . import goalserve_dbwriter as _gw
                if _gw.GS_DB_WRITE:
                    _gw.upsert_event(snap)
            except Exception as e:  # noqa: BLE001
                log.warning("dbwriter upsert %s failed: %s", fid, e)
            index.append({
                "id": snap["id"], "league_name": snap["league_name"],
                "home": snap["home"], "away": snap["away"],
                "score_home": snap["score_home"], "score_away": snap["score_away"],
                "status": snap["status"], "elapsed_minute": snap["elapsed_minute"],
                "has_odds": snap["main_odds"] is not None,
            })
        # index
        try:
            itmp = GS_LIVE_DIR / "._index.json.tmp"
            with itmp.open("w", encoding="utf-8") as fh:
                json.dump({"updated_ts": int(time.time()), "count": len(index),
                           "source": "rest",
                           "bm": payload.get("bm"), "events": index},
                          fh, ensure_ascii=False, separators=(",", ":"))
            os.replace(itmp, GS_LIVE_DIR / "_index.json")
        except OSError:
            pass
        # prune stale files (events that left the feed)
        now = time.time()
        for f in GS_LIVE_DIR.glob("*.json"):
            if f.name.startswith("_") or f.stem in seen:
                continue
            try:
                if now - f.stat().st_mtime > GS_STALE_GRACE:
                    f.unlink()
            except OSError:
                pass
        return len(seen)

    def _ws_is_fresh(self) -> bool:
        """Return True iff the WS client has written a recent index entry —
        in that case we stay standby and skip the upstream fetch."""
        if not GS_REST_STANDBY:
            return False
        try:
            with (GS_LIVE_DIR / "_index.json").open("rb") as fh:
                idx = json.load(fh)
        except (OSError, ValueError):
            return False
        if str(idx.get("source")) != "ws":
            return False
        ws_ts = float(idx.get("ws_updated_ts") or 0)
        if ws_ts <= 0:
            return False
        if not idx.get("ws_connected"):
            return False
        return (time.time() - ws_ts) < GS_WS_FRESH_THRESHOLD

    async def _run(self) -> None:
        log.info("goalserve in-play poller starting url=%s interval=%.2fs dir=%s",
                 GS_INPLAY_URL, GS_POLL_INTERVAL, GS_LIVE_DIR)
        while not self._stop:
            if self._ws_is_fresh():
                # WS is the primary source — sit out this cycle.
                await asyncio.sleep(GS_POLL_INTERVAL)
                continue
            try:
                payload = await asyncio.to_thread(self._fetch)
            except RateLimited as e:
                self.consecutive_429 += 1
                # linear growth so a single 429 only costs one extra interval
                self._backoff = min(GS_MAX_BACKOFF, (self._backoff or 0.0) + GS_POLL_INTERVAL)
                log.warning("rate-limited (%s) — backing off %.1fs", e, self._backoff)
                await asyncio.sleep(self._backoff)
                continue
            except Exception as e:  # noqa: BLE001 — keep the loop alive
                log.warning("fetch failed: %s", e)
                await asyncio.sleep(min(GS_MAX_BACKOFF, GS_POLL_INTERVAL * 2))
                continue
            self.consecutive_429 = 0
            self._backoff = 0.0
            try:
                n = await asyncio.to_thread(self._write_snapshot, payload)
                self.last_ok_ts = time.time()
                self.last_event_count = n
            except Exception as e:  # noqa: BLE001
                log.warning("write_snapshot failed: %s", e)
            await asyncio.sleep(GS_POLL_INTERVAL)
        log.info("goalserve in-play poller stopped")

    async def start(self) -> None:
        if self._task is None:
            self._stop = False
            self._task = asyncio.create_task(self._run())

    async def stop(self) -> None:
        self._stop = True
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except (asyncio.CancelledError, Exception):  # noqa: BLE001
                pass
            self._task = None

    async def run_forever(self) -> None:
        await self._run()


def build_from_env() -> "GoalserveInplayPoller | None":
    if not _enabled():
        log.info("goalserve in-play poller disabled (GS_INPLAY_ENABLE=0)")
        return None
    return GoalserveInplayPoller()


def main() -> None:
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    poller = GoalserveInplayPoller()
    try:
        asyncio.run(poller.run_forever())
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
