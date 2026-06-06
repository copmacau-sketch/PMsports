"""GET /api/external/* — read-only views over data/oddsapi.sqlite.

Populated by ``scripts/ingest_oddsapi.py`` (which calls odds-api.io). The
shape is deliberately kept distinct from /api/matches (Crown bet ledger
aggregations) so frontends can mix-and-match the two sources without ID
collisions:

    /api/matches/...               match_id  = Crown gnum_h (int as text)
    /api/external/events/...       event_id  = odds-api.io upstream id (int)

Endpoints:
    GET /api/external/leagues
    GET /api/external/events
    GET /api/external/events/{event_id}
    GET /api/external/events/{event_id}/markets
"""
from __future__ import annotations

import asyncio
import json
import logging
import re
import time
from contextlib import suppress

from fastapi import APIRouter, HTTPException, Query, Request, WebSocket, WebSocketDisconnect

# After the 2026-05-24 "PHP cron 主、Python cron 退阶" migration the
# /events, /events/{id}, /events/{id}/markets, and /leagues endpoints
# read directly from Crown's MySQL ``db_sports`` schema instead of
# ``oddsapi.sqlite``.  The legacy ``oddsdb`` (sqlite) module is no
# longer imported — see ``mysqldb`` for the connection layer and
# ``rcn_parser`` for the Python port of api_v2.php::parseRcnMarkets().
from .. import mysqldb
from ..rcn_parser import parse_rcn_markets

def _normalise_event(row: "dict") -> None:
    """Mutate `row` in place so the H5 frontend always sees a consistent
    `is_finished` flag + the half-time score placeholders.

    The status text itself is set authoritatively by
    ``mysqldb.derive_status`` (which already applies the LIVE_WINDOW
    cron-lag heuristic before we get here), so this helper no longer
    second-guesses it — the previous status-promotion block was dead
    code, because by the time we run, `status` is already either
    "settled"/"inplay"/"pending" with the same LIVE_WINDOW logic baked
    in.  See ``mysqldb.is_inplay_event`` for the canonical in-play
    predicate.
    """
    raw = (row.get("status") or "").lower()
    row["is_finished"] = (raw == "settled")
    # Half-time scores aren't stored in our sqlite snapshot today; keep
    # the keys present so the H5 OddsEvent typedef stays satisfied.
    row.setdefault("score_home_ht", None)
    row.setdefault("score_away_ht", None)

log = logging.getLogger("external")
router = APIRouter()


# ---------------------------------------------------------------------------
# main_odds helpers — extract key market values for the list-card display.

_KEY_MARKETS = (
    "Spread", "ML", "Totals",
    "Both Teams To Score", "Both Teams to Score",
    "Half Time Result",
    "Spread HT", "Totals HT",
    "Both Teams To Score HT", "Both Teams to Score HT",
    "Double Chance", "Draw No Bet",
    # Corners — `Corners Totals` is the main over/under line. Frontend
    # consumes it as corners_over / corners_line / corners_under; without
    # this entry the 主要玩法 row hides the corner column entirely.
    "Corners Totals",
)

# Markets that share the structured key columns above. Used to compute the
# "+N 更多盘口" badge by excluding them from the extras-counter.
_INLINED_MARKETS = frozenset(_KEY_MARKETS)

# Shared with the FastAPI WS bridge (oddsapi_ws.py) and the PHP api_v2.php
# in-play handler.  When a match is in-play (status=inplay/live) we
# *strictly* serve `main_odds` and bookmakers from this directory rather
# than from oddsapi.sqlite.  The SQLite snapshot accumulates pre-match
# prices that don't get superseded the moment a match goes live, which
# would let stale numbers leak into the 滚球 view and worse, into bets.
import os as _os
import pathlib as _pathlib
WS_SHM_CACHE_DIR = _pathlib.Path(_os.environ.get("WS_SHM_CACHE_DIR") or "/dev/shm/oddsapi_live")


WS_CACHE_STALE_AFTER_SEC = int(_os.environ.get("WS_CACHE_STALE_AFTER_SEC") or 120)

# Full multi-line market book (limitless.show), written every 2 min by
# ingest_limitless.php to a tmpfs dir. r_cn only carries the single MAIN line
# per market; this file carries EVERY Asian-handicap / over-under line so the
# detail panel can offer alternative lines. Read here (no network); fall back
# to r_cn when the file is absent or stale.
LIMITLESS_MK_DIR = _pathlib.Path(_os.environ.get("LIMITLESS_MK_DIR") or "/dev/shm/crown_limitless_mk")
LIMITLESS_MK_TTL_SEC = int(_os.environ.get("LIMITLESS_MK_TTL_SEC") or 240)

# Goalserve pregame snapshots — the full bookmaker_markets list (all markets
# from the getodds XML, not just the canonical subset in r_cn).  Used by both
# list_events (market_count) and list_markets (detail panel).
GS_PREGAME_DIR = _pathlib.Path(_os.environ.get("GS_PREGAME_DIR") or "/dev/shm/goalserve_pregame")
GS_PREGAME_MK_TTL_SEC = int(_os.environ.get("GS_PREGAME_MK_TTL_SEC") or 120)


def _load_limitless_markets(event_id: int) -> list[dict]:
    """Read the cron-built full-market payload for one gid and project it into
    the canonical market-list shape (same as ``parse_rcn_markets`` output).
    Returns ``[]`` when the file is missing or older than the TTL."""
    f = LIMITLESS_MK_DIR / f"{event_id}.json"
    try:
        st = f.stat()
    except OSError:
        return []
    if (time.time() - st.st_mtime) > LIMITLESS_MK_TTL_SEC:
        return []
    try:
        data = json.loads(f.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return []
    books = (data or {}).get("bookmakers") or {}
    raw = books.get("Bet365")
    if raw is None:
        raw = next(iter(books.values()), [])
    now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    now_ts = int(time.time())
    out: list[dict] = []
    for i, m in enumerate(raw or [], start=1):
        if not isinstance(m, dict) or not m.get("name"):
            continue
        out.append({
            "market_id":      f"{i:06d}",
            "market_id_int":  i,
            "name":           m["name"],
            "market_name":    m["name"],
            "odds":           m.get("odds") or [],
            "updated_at_iso": now_iso,
            "updated_at_ts":  now_ts,
        })
    return out


def _load_pregame_markets(event_id: int) -> list[dict]:
    """Read the Goalserve pregame snapshot and return the full ``_markets``
    list (all bookmaker markets from the getodds XML).  Returns ``[]`` when
    the snap is missing or older than the TTL.

    The snap is written by ``goalserve_pregame.GoalservePregamePoller`` into
    ``/dev/shm/goalserve_pregame/{gid}.json`` every ~15s.  Each item in
    ``_markets`` already carries ``market_id``, ``market_id_int``,
    ``market_name``, ``odds``, ``updated_at_iso``, ``updated_at_ts``.
    We normalise them to also carry the ``name`` key that downstream code
    expects (matching ``_load_limitless_markets`` output shape).
    """
    f = GS_PREGAME_DIR / f"{event_id}.json"
    try:
        st = f.stat()
    except OSError:
        return []
    if (time.time() - st.st_mtime) > GS_PREGAME_MK_TTL_SEC:
        return []
    try:
        data = json.loads(f.read_bytes())
    except (OSError, ValueError):
        return []
    raw = (data or {}).get("_markets")
    if not isinstance(raw, list):
        return []
    now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    now_ts = int(time.time())
    out: list[dict] = []
    for i, m in enumerate(raw, start=1):
        if not isinstance(m, dict):
            continue
        mname = m.get("market_name") or m.get("name") or ""
        if not mname:
            continue
        odds = m.get("odds") or []
        # Skip markets where all outcomes are suspended (price=0)
        if odds and all(
            (isinstance(o, dict) and not o.get("price"))
            for o in odds
        ):
            continue
        out.append({
            "market_id":      m.get("market_id") or f"{i:06d}",
            "market_id_int":  m.get("market_id_int") or i,
            "name":           mname,
            "market_name":    mname,
            "odds":           odds,
            "updated_at_iso": m.get("updated_at_iso") or now_iso,
            "updated_at_ts":  m.get("updated_at_ts") or now_ts,
        })
    return out


def _pregame_market_count(event_id: int) -> int:
    """Quick read of the pregame snap to get the real market_count.
    Returns 0 when the snap is missing/stale."""
    f = GS_PREGAME_DIR / f"{event_id}.json"
    try:
        st = f.stat()
    except OSError:
        return 0
    if (time.time() - st.st_mtime) > GS_PREGAME_MK_TTL_SEC:
        return 0
    try:
        data = json.loads(f.read_bytes())
    except (OSError, ValueError):
        return 0
    return int((data or {}).get("market_count") or 0)


# Wall-clock minutes after kickoff at which the first half is almost certainly
# over (45 regulation + ~5 min stoppage buffer). Used as a fallback HT-expiry
# signal when the inball_h_hr / inball_c_hr (halftime score) columns haven't
# been written yet.  Conservative: real HT happens ~50 min into kickoff for
# most matches.
HT_EXPIRY_AFTER_KICKOFF_SEC = 50 * 60

_CORRECT_SCORE_LABEL_RE = re.compile(r"^\s*(\d+)\s*[-:]\s*(\d+)\s*$")


def _is_ht_market_name(name: str) -> bool:
    """Return True when ``name`` denotes a first-half-only market whose
    outcome is locked the moment the first half ends (so it shouldn't be
    bookable in the second half).

    Matches Crown's canonical market_name shapes used by both the limitless
    adapter and ``parseRcnMarkets``:
        - ``"Half Time Result"``
        - any ``"<base> HT"`` suffix (Spread HT, Totals HT, Corners Spread HT,
          Corners Totals HT, Both Teams To Score HT, Correct Score HT, …)
        - ``"1st Half ..."`` / ``"First Half ..."`` variants the upstream
          occasionally emits.
    """
    if not name:
        return False
    s = name.strip().lower()
    if s == "half time result":
        return True
    if s.endswith(" ht") or s.endswith(" half time"):
        return True
    if s.startswith("1st half ") or s.startswith("first half "):
        return True
    return False


def _is_first_half_over(event: dict) -> bool:
    """Decide whether the first half of an in-play match has ended.

    Three independent signals (any one suffices, listed in order of
    authority):
      1. api-sports.io ``status.short`` reports HT, 2H, ET, FT, AET, or
         PEN — the most accurate signal because it comes from the live
         broadcast feed.  Available when the ``--live-only`` cron has
         seen this fixture in api-sports.io's coverage.
      2. ``inball_h_hr`` / ``inball_c_hr`` populated — half-time score
         column, written by Crown's score ingest only after HT.
      3. Wall-clock elapsed since kickoff > ``HT_EXPIRY_AFTER_KICKOFF_SEC``
         (~50 min) — fallback for matches outside api-sports' coverage.

    Pre-match and settled events are out of scope and return False.
    """
    if not _is_inplay_row(event):
        return False
    short = (event.get("status_short") or "").upper()
    if short in {"HT", "2H", "ET", "BT", "INT", "FT", "AET", "PEN"}:
        return True
    sh_ht = event.get("score_home_ht")
    sa_ht = event.get("score_away_ht")
    if sh_ht is not None or sa_ht is not None:
        return True
    cts = event.get("commence_ts")
    try:
        cts = int(cts) if cts is not None else None
    except (TypeError, ValueError):
        cts = None
    if cts and (time.time() - cts) > HT_EXPIRY_AFTER_KICKOFF_SEC:
        return True
    return False


def _filter_expired_ht_markets(event: dict, markets: list[dict]) -> list[dict]:
    """Strip first-half-only markets once the first half is over. These
    markets settle at half-time, so leaving them bookable in the second
    half would let users place bets on already-determined outcomes —
    either a guaranteed loss (impossible line) or a guaranteed win
    (already-cleared spread). Same defensive copy pattern as the
    Correct Score filter.
    """
    if not markets:
        return markets
    if not _is_first_half_over(event):
        return markets
    out: list[dict] = []
    for m in markets:
        if not isinstance(m, dict):
            out.append(m)
            continue
        name = str(m.get("market_name") or m.get("name") or "")
        if _is_ht_market_name(name):
            continue  # drop entire market — outcome is locked
        out.append(m)
    return out


def _filter_impossible_correct_score(event: dict, markets: list[dict]) -> list[dict]:
    """Drop Correct Score outcomes that are mathematically impossible given
    the current live score (you can't *un-score* a goal). For pre-match,
    settled, or zero-zero matches every scoreline is still possible, so this
    helper short-circuits to the input list.

    Mutates a *copy* of the affected market so callers don't see surprises
    upstream. Markets without a numeric "<H>-<A>" label (e.g. "Any Other
    Home Win") fall through unmodified — better to leak one harmless row
    than to silently drop labelled-bucket fallbacks.
    """
    if not markets:
        return markets
    sh = event.get("score_home")
    sa = event.get("score_away")
    if sh is None or sa is None:
        return markets
    try:
        sh = int(sh)
        sa = int(sa)
    except (TypeError, ValueError):
        return markets
    if sh <= 0 and sa <= 0:
        return markets  # nothing is impossible yet
    out: list[dict] = []
    for m in markets:
        if not isinstance(m, dict):
            out.append(m)
            continue
        name = str(m.get("market_name") or m.get("name") or "").strip()
        n_lower = name.lower()
        # Only the FT correct-score grid: HT / 1H / 2H variants use a
        # different score baseline (halftime / second-half goals scored)
        # so it's wrong to filter them against the full-match score we
        # have here. If we ever surface HT correct score we can add a
        # parallel helper that takes (score_home_ht, score_away_ht).
        is_ft_correct_score = (
            n_lower == "correct score"
            or n_lower.startswith("correct score ft")
            or n_lower == "correct score full time"
        )
        if not is_ft_correct_score:
            out.append(m)
            continue
        odds = m.get("odds") or []
        kept: list = []
        dropped = 0
        for r in odds:
            if not isinstance(r, dict):
                kept.append(r)
                continue
            label = str(r.get("label") or r.get("score") or "")
            mt = _CORRECT_SCORE_LABEL_RE.match(label)
            if not mt:
                kept.append(r)
                continue
            h_final = int(mt.group(1))
            a_final = int(mt.group(2))
            if h_final < sh or a_final < sa:
                dropped += 1
                continue
            kept.append(r)
        if not kept:
            # Whole market becomes impossible (unusual: live score beyond every
            # listed line). Drop the entire market rather than emit an empty
            # block that would render as "no outcomes" in the UI.
            continue
        new_m = dict(m)
        new_m["odds"] = kept
        out.append(new_m)
    return out


def _read_shm_cache(event_id: int) -> dict | None:
    """Read the latest merged WS snapshot for a single event.  Returns
    None if the file is missing (relay hasn't pushed this event yet),
    malformed, OR stale (mtime older than ``WS_CACHE_STALE_AFTER_SEC``).

    The freshness check protects the WS-only invariant from a class of
    failure where the ws-relay daemon dies mid-day: cache files persist
    on /dev/shm but stop being refreshed, so without this check the
    backend would happily serve hour-old "live" prices.  Threshold is
    intentionally generous (~2 min) because the upstream feed's
    bulk-snapshot cycle is ~38 s and we don't want to flap during the
    normal reconnect gaps documented in the ws-relay deploy notes.
    """
    f = WS_SHM_CACHE_DIR / f"{event_id}.json"
    try:
        st = f.stat()
    except (FileNotFoundError, IsADirectoryError, OSError):
        return None
    if time.time() - st.st_mtime > WS_CACHE_STALE_AFTER_SEC:
        return None
    try:
        with f.open("rb") as fp:
            return json.loads(fp.read())
    except (FileNotFoundError, IsADirectoryError):
        return None
    except (OSError, json.JSONDecodeError):
        return None


def _is_inplay_row(row: dict) -> bool:
    """Thin alias so existing call sites keep reading; the canonical
    in-play predicate lives in ``mysqldb.is_inplay_event``.
    """
    return mysqldb.is_inplay_event(row)


def _main_odds_from_ws_snap(snap: dict) -> dict:
    """Project a /dev/shm WS snapshot's `markets` list into the 9-column
    `main_odds` shape consumed by the H5 frontend's list view.  Mirrors
    PHP's `extractMainOddsFromWsCache()` and the TypeScript twin
    `projectMainOddsFromWs()` — keep all three in lockstep.
    """
    by_name: dict[str, list[dict]] = {}
    for m in (snap.get("markets") or []):
        if isinstance(m, dict) and m.get("name"):
            by_name[m["name"]] = list(m.get("odds") or [])

    def first(name: str) -> dict:
        rows = by_name.get(name) or []
        return rows[0] if rows and isinstance(rows[0], dict) else {}

    mo: dict = {}
    if "ML" in by_name:
        r = first("ML")
        mo["m_h"] = _get_float(r, "home")
        mo["m_n"] = _get_float(r, "draw")
        mo["m_c"] = _get_float(r, "away")
    if "Spread" in by_name:
        r = first("Spread")
        mo["re_h"]    = _get_float(r, "home")
        mo["re_c"]    = _get_float(r, "away")
        mo["re_line"] = r.get("hdp") or 0
    if "Totals" in by_name:
        r = first("Totals")
        mo["ou_over"]  = _get_float(r, "over")
        mo["ou_under"] = _get_float(r, "under")
        mo["ou_line"]  = r.get("hdp") or 0
    if "Draw No Bet" in by_name:
        r = first("Draw No Bet")
        mo["dnb_h"] = _get_float(r, "home")
        mo["dnb_c"] = _get_float(r, "away")
    btts_key = "Both Teams To Score" if "Both Teams To Score" in by_name else (
        "Both Teams to Score" if "Both Teams to Score" in by_name else None
    )
    if btts_key:
        r = first(btts_key)
        mo["btts_yes"] = _get_float(r, "yes")
        mo["btts_no"]  = _get_float(r, "no")
    if "Spread HT" in by_name:
        r = first("Spread HT")
        mo["reh_h"]    = _get_float(r, "home")
        mo["reh_c"]    = _get_float(r, "away")
        mo["reh_line"] = r.get("hdp") or 0
    if "Totals HT" in by_name:
        r = first("Totals HT")
        mo["ouh_over"]  = _get_float(r, "over")
        mo["ouh_under"] = _get_float(r, "under")
        mo["ouh_line"]  = r.get("hdp") or 0
    if "Half Time Result" in by_name:
        rows = by_name["Half Time Result"]
        if len(rows) >= 3:
            mo["ht_h"] = _get_float(rows[0], "home") or _get_float(rows[0], "under")
            mo["ht_n"] = _get_float(rows[1], "draw") or _get_float(rows[1], "under")
            mo["ht_c"] = _get_float(rows[2], "away") or _get_float(rows[2], "under")
    btts_ht_key = "Both Teams To Score HT" if "Both Teams To Score HT" in by_name else (
        "Both Teams to Score HT" if "Both Teams to Score HT" in by_name else None
    )
    if btts_ht_key:
        r = first(btts_ht_key)
        mo["btts_ht_yes"] = _get_float(r, "yes")
        mo["btts_ht_no"]  = _get_float(r, "no")
    if "Double Chance" in by_name:
        for o in by_name["Double Chance"]:
            if not isinstance(o, dict):
                continue
            lbl = str(o.get("label") or "").lower()
            price = _get_float(o, "under") or _get_float(o, "home") or _get_float(o, "over")
            if " or draw" in lbl and "dc_1x" not in mo:
                mo["dc_1x"] = price
            elif "draw or " in lbl and "dc_x2" not in mo:
                mo["dc_x2"] = price
            elif " or " in lbl and "draw" not in lbl and "dc_12" not in mo:
                mo["dc_12"] = price
    if "Corners Totals" in by_name:
        r = first("Corners Totals")
        mo["corners_over"]  = _get_float(r, "over")
        mo["corners_under"] = _get_float(r, "under")
        mo["corners_line"]  = r.get("hdp") or 0
    return mo


def _get_float(d: dict, key: str) -> float:
    v = d.get(key)
    if v is None:
        return 0.0
    try:
        f = float(v)
        return f if f > 0 else 0.0
    except (TypeError, ValueError):
        return 0.0


def _load_rcn_markets(event_ids: list[int]) -> "dict[int, list[dict]]":
    """Batch-load r_cn blobs from MySQL and decode each into the canonical
    market list.  Replaces the sqlite ``odds_market`` scan with a single
    ``IN`` query against ``foot_match_xml`` followed by per-event XML
    parse in Python.

    Returns ``{gid: parser_output}`` — empty dict when no event_ids
    given.  Missing/garbled r_cn for an event maps to ``[]``.
    """
    if not event_ids:
        return {}
    placeholders = ",".join(["%s"] * len(event_ids))
    rows = mysqldb.fetch_all(
        f"SELECT gid, r_cn FROM foot_match_xml WHERE gid IN ({placeholders})",
        tuple(event_ids),
    )
    out: "dict[int, list[dict]]" = {}
    for r in rows:
        gid = int(r["gid"])
        out[gid] = parse_rcn_markets(r.get("r_cn") or "")
    return out


def _batch_main_odds(event_ids: list[int]) -> "dict[int, dict]":
    """Build the 9-column inline ``main_odds`` shape for every event_id by
    decoding r_cn from MySQL.

    ``_main_odds_from_ws_snap`` is reused unchanged — the parser emits
    each market with ``name`` + ``odds``, matching the WS-cache shape
    that helper consumes.
    """
    markets_by_event = _load_rcn_markets(event_ids)
    result: "dict[int, dict]" = {}
    for gid, markets in markets_by_event.items():
        if not markets:
            continue
        mo = _main_odds_from_ws_snap({"markets": markets})
        if mo and any(mo.values()):
            result[gid] = mo
    return result


def _batch_extra_markets(event_ids: list[int]) -> "dict[int, list[dict]]":
    """For each event, return list of (name, outcome count) for markets
    NOT in ``_INLINED_MARKETS`` — used by the H5 frontend's
    "+N 更多盘口" badge.

    Same source as ``_batch_main_odds`` (single MySQL+r_cn load).
    """
    markets_by_event = _load_rcn_markets(event_ids)
    out: "dict[int, list[dict]]" = {}
    for gid, markets in markets_by_event.items():
        extras = [
            {"name": m["name"], "outcomes": len(m.get("odds") or [])}
            for m in markets
            if isinstance(m, dict) and m.get("name") and m["name"] not in _INLINED_MARKETS
        ]
        if extras:
            out[gid] = extras
    return out


# ---------------------------------------------------------------------------
# Leagues

@router.get("/leagues")
def list_leagues() -> dict:
    """Distinct league_slug + name + counts. Useful for populating filters.

    Reads MySQL ``foot_match`` and projects each ``lid`` through
    ``mysqldb.lid_to_slug``.  Status counts derive from
    ``status``/``is_inball`` Crown columns since the MySQL schema
    doesn't carry the sqlite ``status`` text directly.
    """
    rows = mysqldb.fetch_all(
        f"""
        SELECT lid,
               MAX(league)                                              AS league_name,
               COUNT(*)                                                 AS events,
               SUM(CASE WHEN is_inball = 1 THEN 1 ELSE 0 END)           AS settled,
               SUM(CASE WHEN is_inball = 0 THEN 1 ELSE 0 END)           AS active,
               MIN(`datetime`)                                          AS first_ts,
               MAX(`datetime`)                                          AS last_ts
        FROM foot_match
        WHERE {mysqldb.enabled_lids_sql()}
        GROUP BY lid
        ORDER BY active DESC, events DESC, lid
        """
    )
    items = []
    for r in rows:
        items.append({
            "league_slug": mysqldb.lid_to_slug(r.get("lid")),
            "league_name": r.get("league_name"),
            "events":      int(r.get("events") or 0),
            "active":      int(r.get("active") or 0),
            "settled":     int(r.get("settled") or 0),
            "first_ts":    int(r.get("first_ts") or 0) or None,
            "last_ts":     int(r.get("last_ts") or 0) or None,
        })
    return {"items": items, "total": len(items)}


@router.get("/leagues/daily_counts")
def list_leagues_daily_counts() -> dict:
    """Returns active match counts grouped by league and local date string (YYYY-MM-DD)."""
    rows = mysqldb.fetch_all(
        f"""
        SELECT lid,
               DATE_FORMAT(FROM_UNIXTIME(`datetime`), '%%Y-%%m-%%d') AS date_key,
               COUNT(*) AS active_count
        FROM foot_match
        WHERE {mysqldb.enabled_lids_sql()} AND is_inball = 0
        GROUP BY lid, date_key
        """
    )
    counts_map = {}
    for r in rows:
        slug = mysqldb.lid_to_slug(r.get("lid"))
        if not slug:
            continue
        if slug not in counts_map:
            counts_map[slug] = {}
        counts_map[slug][r.get("date_key")] = int(r.get("active_count") or 0)
    return {"counts": counts_map}


_CATALOG_TIER_MAP = {"top": 1, "core": 10, "major": 50, "all": 999}


@router.get("/leagues/catalog")
def list_leagues_catalog(tier: str | None = Query(None)) -> dict:
    """Region → country → leagues tree consumed by the H5 DiscoverScreen.

    Mirrors PHP `LeagueRegistry::getCatalog()` so pmppm.com/sports
    (FastAPI route) and /h5/sports (Apache PHP route) return the same
    payload shape.  ``tier`` filters by max priority — top=1 (UCL/UEL/WC),
    core=10 (legacy 9), major=50 (~80 mainstream), all=∞.
    """
    max_priority = _CATALOG_TIER_MAP.get((tier or "").lower())
    payload = mysqldb.build_catalog(max_priority)
    if tier:
        payload["tier"] = tier
    return payload


@router.get("/leagues/search")
def search_leagues(
    q: str = Query("", description="free-text search across slug/name_en/name_cn/country"),
    limit: int = Query(30, ge=1, le=100),
) -> dict:
    """Free-text registry lookup.  Matches PHP `LeagueRegistry::search()`."""
    rows = mysqldb.search_registry(q, limit)
    items = [{
        "lid":          int(r["lid"]),
        "slug":         r["slug"],
        "name_en":      r.get("name_en"),
        "name_cn":      r.get("name_cn") or "",
        "region":       r.get("region"),
        "country":      r.get("country"),
        "flag":         r.get("flag") or "",
        "priority":     int(r.get("priority") or 100),
        "events_count": int(r.get("events_count") or 0),
    } for r in rows]
    return {"items": items, "total": len(items), "q": q}


# ---------------------------------------------------------------------------
# Events

_MYSQL_EVENT_COLS = """
    m.gid, m.lid, m.league, m.team_h, m.team_c,
    m.team_h_en, m.team_c_en,
    m.gnum_h, m.gnum_c,
    m.`datetime`, m.status, m.is_inball,
    m.score_h, m.score_c, m.inball_h, m.inball_c,
    m.inball_h_hr, m.inball_c_hr,
    m.apisports_elapsed, m.apisports_status, m.apisports_seen_at
"""

_WC_LID = 108


def _mysql_row_to_event(r: dict) -> dict:
    """Project a ``foot_match`` row into the API event shape that the
    sqlite-based code used to emit.  Status derivation mirrors
    ``mysqldb.derive_status``.
    """
    ts = int(r.get("datetime") or 0)
    derived = mysqldb.derive_status(r)
    is_finished = (int(r.get("is_inball") or 0) == 1)
    score_h = r.get("inball_h") if is_finished else r.get("score_h")
    score_a = r.get("inball_c") if is_finished else r.get("score_c")
    # World Cup fixtures: derive group letter from union-find on the
    # fixture graph (Crown's foot_match has no group column).  Other
    # leagues leave `group` as None so the frontend can decide whether
    # to render group headers at all.
    group_label = None
    if int(r.get("lid") or 0) == _WC_LID:
        try:
            t2g = mysqldb.world_cup_groups().get("team_to_group") or {}
            group_label = (
                t2g.get((r.get("team_h_en") or "").strip())
                or t2g.get((r.get("team_c_en") or "").strip())
            )
        except Exception:                                            # noqa: BLE001
            group_label = None
    return {
        "id":            int(r["gid"]),
        "sport_slug":    "football",
        "league_slug":   mysqldb.lid_to_slug(r.get("lid")),
        "league_name":   r.get("league"),
        "home":          r.get("team_h"),
        "away":          r.get("team_c"),
        "home_id":       str(r.get("gnum_h")) if r.get("gnum_h") else r.get("team_h"),
        "away_id":       str(r.get("gnum_c")) if r.get("gnum_c") else r.get("team_c"),
        "commence_iso":  time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(ts)) if ts else None,
        "commence_ts":   ts,
        "status":        derived,
        "score_home":    int(score_h) if score_h is not None else None,
        "score_away":    int(score_a) if score_a is not None else None,
        "score_home_ht": int(r["inball_h_hr"]) if r.get("inball_h_hr") not in (None, "") else None,
        "score_away_ht": int(r["inball_c_hr"]) if r.get("inball_c_hr") not in (None, "") else None,
        # Authoritative game-state from api-sports.io, written by the
        # `--live-only` cron.  When present, the H5 frontend prefers these
        # over the `commence_ts` wall-clock heuristic in formatLiveTicker
        # so HT / 45+' / 90+' transitions match reality.  `apisports_seen_at`
        # lets the frontend down-grade to wall-clock if the value is stale
        # (e.g. cron stopped writing).
        "elapsed_minute":     (int(r["apisports_elapsed"])
                                if r.get("apisports_elapsed") not in (None, "") else None),
        "status_short":       (str(r["apisports_status"])
                                if r.get("apisports_status") not in (None, "") else None),
        "apisports_seen_at":  (int(r["apisports_seen_at"])
                                if r.get("apisports_seen_at") not in (None, "") else None),
        "group":         group_label,
        "fetched_at":    int(time.time()),
        "apisports_fixture_id": None,
        "apisports_match_iso":  None,
    }


# Crown ``status`` string → MySQL WHERE clauses for the ``status=`` filter
# parameter on /events.  Kept in one place so /events and /events/{id}
# can agree on what "settled" / "inplay" mean against the MySQL schema.
def _status_filter_sql(status_param: str) -> str:
    if status_param == "pending":
        return "m.is_inball = 0 AND m.status = 0"
    if status_param in ("inplay", "live"):
        return "m.is_inball = 0 AND m.status = 1"
    if status_param in ("settled", "cancelled"):
        return "m.is_inball = 1"
    return "1=1"


@router.get("/events")
def list_events(
    league: str | None = Query(None, description="filter by league_slug"),
    status: str | None = Query(None, description="pending / inplay / settled / cancelled"),
    q: str | None = Query(None, description="free-text on home/away/league_name"),
    min_ts: int | None = Query(None, description="only events with commence_ts >= this"),
    max_ts: int | None = Query(None, description="only events with commence_ts <= this"),
    only_active: bool = Query(False, description="shorthand for status in pending/inplay/live"),
    limit: int = Query(100, ge=1, le=2000),
    offset: int = Query(0, ge=0),
) -> dict:
    where: list[str] = [mysqldb.enabled_lids_sql("m.")]
    params: list = []
    if league:
        lid = mysqldb.slug_to_lid(league)
        if lid is None:
            # Unknown league_slug → return empty rather than 500
            return {"total": 0, "items": []}
        where.append("m.lid = %s")
        params.append(lid)
    if status:
        where.append("(" + _status_filter_sql(status) + ")")
    if only_active:
        # is_inball=0 alone isn't enough — Crown occasionally leaves
        # rows with status=0/is_inball=0 but a kickoff hours in the past
        # (cron didn't get the settlement signal).  Without the
        # LIVE_WINDOW guard those "zombie" rows would surface here and
        # the frontend's first-item-wins selectedMatch logic would
        # latch onto one, locking the betslip for every match in the
        # list.  Mirror H5's eventStatus() 3h window.
        where.append("m.is_inball = 0")
        where.append(f"m.`datetime` > (UNIX_TIMESTAMP() - {mysqldb.LIVE_WINDOW_SEC})")
    if min_ts is not None:
        where.append("m.`datetime` >= %s")
        params.append(min_ts)
    if max_ts is not None:
        where.append("m.`datetime` <= %s")
        params.append(max_ts)
    if q:
        where.append("(m.team_h LIKE %s OR m.team_c LIKE %s OR m.league LIKE %s)")
        like = f"%{q}%"
        params += [like, like, like]
    where_sql = "WHERE " + " AND ".join(where)

    raw_rows = mysqldb.fetch_all(
        f"""
        SELECT {_MYSQL_EVENT_COLS}
        FROM foot_match m
        {where_sql}
        ORDER BY m.is_inball ASC,
                 (m.status = 1) DESC,
                 m.`datetime` ASC,
                 m.gid ASC
        LIMIT %s OFFSET %s
        """,
        tuple(params + [limit, offset]),
    )
    total_row = mysqldb.fetch_one(
        f"SELECT COUNT(*) AS n FROM foot_match m {where_sql}",
        tuple(params),
    )
    total = int(total_row["n"]) if total_row else 0
    rows = [_mysql_row_to_event(r) for r in raw_rows]
    # Normalise BEFORE deciding the data source so `_is_inplay_row`
    # sees the same status the frontend will.  Done in its own pass
    # because the next step needs to know which rows go to /dev/shm vs
    # r_cn so we can skip the wasted r_cn query for in-play rows.
    for row in rows:
        _normalise_event(row)
    # r_cn is loaded for every row: pre-match/settled rows consume it as
    # their canonical source, and in-play rows use it as a FALLBACK when
    # the /dev/shm WS cache is missing/stale (the limitless ws/quote bridge
    # doesn't reliably push every live gid, but ingest_limitless.php still
    # refreshes r_cn with the same live odds every 2 min).
    markets_by_event = _load_rcn_markets([r["id"] for r in rows])
    sqlite_mo = {
        gid: _main_odds_from_ws_snap({"markets": ms})
        for gid, ms in markets_by_event.items() if ms
    }
    ex_map = {
        gid: [
            {"name": m["name"], "outcomes": len(m.get("odds") or [])}
            for m in ms
            if isinstance(m, dict) and m.get("name") and m["name"] not in _INLINED_MARKETS
        ]
        for gid, ms in markets_by_event.items()
    }
    for row in rows:
        if _is_inplay_row(row):
            # In-play: prefer the /dev/shm WS snapshot; fall back to the
            # r_cn snapshot when the relay hasn't pushed this gid (the
            # limitless ws/quote bridge doesn't cover every live match).
            # ingest_limitless.php keeps r_cn current with the same live
            # odds every 2 min, so this surfaces 滚球 instead of an empty row.
            snap = _read_shm_cache(row["id"])
            ws_mo = _main_odds_from_ws_snap(snap) if snap else None
            if snap and ws_mo and any(ws_mo.values()):
                row["main_odds"] = ws_mo
                ws_markets = snap.get("markets") or []
                row["market_count"] = sum(
                    1 for m in ws_markets if isinstance(m, dict) and m.get("name")
                )
                # The +N badge counts only "extra" (non-inlined) markets
                # so users can drill in to the detail panel; rebuild
                # from the WS payload.
                row["extra_markets"] = [
                    {"name": m["name"], "outcomes": len(m.get("odds") or [])}
                    for m in ws_markets
                    if isinstance(m, dict) and m.get("name") and m["name"] not in _INLINED_MARKETS
                ]
            else:
                mo = sqlite_mo.get(row["id"])
                row["main_odds"] = mo if mo and any(mo.values()) else None
                row["extra_markets"] = ex_map.get(row["id"], [])
                row["market_count"] = len(markets_by_event.get(row["id"]) or [])
        else:
            # Pre-match (pending) — r_cn snapshot is canonical for main_odds.
            # Settled / cancelled — r_cn still has the closing prices
            # but they're not bookable; that's enforced separately by
            # the place-bet handler's activeOddsContext check.
            mo = sqlite_mo.get(row["id"])
            row["main_odds"] = mo if mo and any(mo.values()) else None
            row["extra_markets"] = ex_map.get(row["id"], [])
            # market_count: prefer the pregame snap (has ALL markets from the
            # Goalserve getodds XML) over the r_cn parse (limited canonical
            # subset).  Also update extra_markets from the snap when available.
            pre_count = _pregame_market_count(row["id"])
            if pre_count > 0:
                row["market_count"] = pre_count
                # Rebuild extra_markets from the pregame snap so the "+N"
                # badge reflects the real non-inlined market count.
                pre_mk = _load_pregame_markets(row["id"])
                if pre_mk:
                    row["extra_markets"] = [
                        {"name": m["name"], "outcomes": len(m.get("odds") or [])}
                        for m in pre_mk
                        if isinstance(m, dict) and m.get("name") and m["name"] not in _INLINED_MARKETS
                    ]
            else:
                row["market_count"] = len(markets_by_event.get(row["id"]) or [])
    return {"total": total, "items": rows}


@router.get("/events/{event_id}")
def get_event(event_id: int) -> dict:
    raw = mysqldb.fetch_one(
        f"""
        SELECT {_MYSQL_EVENT_COLS}
        FROM foot_match m
        WHERE m.gid = %s
        """,
        (event_id,),
    )
    if not raw:
        raise HTTPException(status_code=404, detail="event not found")
    row = _mysql_row_to_event(raw)
    mo_map = _batch_main_odds([row["id"]])
    mo = mo_map.get(row["id"])
    row["main_odds"] = mo if mo and any(mo.values()) else None
    ex_map = _batch_extra_markets([row["id"]])
    row["extra_markets"] = ex_map.get(row["id"], [])
    _normalise_event(row)
    return row


# ---------------------------------------------------------------------------
# Markets

@router.get("/events/{event_id}/markets")
def list_markets(event_id: int) -> dict:
    """Return markets grouped by bookmaker, with the raw ``odds`` array
    decoded to JSON so the frontend can render whatever variant it
    understands without re-parsing strings.

    Source dispatch by status (WS-only invariant for in-play):
      * settled / cancelled → empty bookmakers + ``source="finished"``
      * inplay / live       → /dev/shm WS cache only (``source="ws_live"``)
                              — pre-match prices must not leak through
                              and accidentally be bookable.
      * pre-match (pending) → MySQL ``r_cn`` (``source="r_cn_snapshot"``)
    """
    raw = mysqldb.fetch_one(
        f"""
        SELECT {_MYSQL_EVENT_COLS}
        FROM foot_match m
        WHERE m.gid = %s
        """,
        (event_id,),
    )
    if not raw:
        raise HTTPException(status_code=404, detail="event not found")
    event = _mysql_row_to_event(raw)
    _normalise_event(event)

    if event.get("is_finished"):
        return {"event": event, "bookmakers": [], "total_markets": 0, "source": "finished"}

    # Prefer the full multi-line limitless book (every handicap / total line)
    # written by ingest_limitless.php. Falls back to the WS snapshot / single-
    # line r_cn below when unavailable. For in-play matches we keep the
    # "ws_live" source label so the frontend treats the lines as bookable
    # (the WS-only invariant is about freshness, and this file is ≤2 min old).
    full = _load_limitless_markets(event_id)
    if full:
        full = _filter_expired_ht_markets(event, full)
        full = _filter_impossible_correct_score(event, full)
        return {
            "event":         event,
            "bookmakers":    [{"bookmaker": "Bet365", "markets": full, "market_count": len(full)}],
            "total_markets": len(full),
            "source":        "ws_live" if _is_inplay_row(event) else "r_cn_snapshot",
        }

    if _is_inplay_row(event):
        # Prefer the /dev/shm WS snapshot; if it's missing/empty (the
        # limitless ws/quote bridge doesn't push every live gid) fall
        # through to the r_cn path below, which ingest_limitless.php keeps
        # current with the same live odds every 2 min.
        snap = _read_shm_cache(event_id)
        ws_markets = (snap.get("markets") or []) if snap else []
        markets = []
        if snap:
            bookie = str(snap.get("bookie") or "Bet365")
            for idx, m in enumerate(ws_markets, start=1):
                if not isinstance(m, dict) or not m.get("name"):
                    continue
                updated_iso = m.get("updatedAt")
                markets.append({
                    "market_id":     f"{idx:06d}",
                    "market_id_int": idx,
                    "market_name":   m["name"],
                    "odds":          m.get("odds") or [],
                    "updated_at_iso": updated_iso,
                    "updated_at_ts":  _iso_to_epoch(updated_iso),
                })
        if markets:
            markets = _filter_expired_ht_markets(event, markets)
            markets = _filter_impossible_correct_score(event, markets)
            bookmakers = [{"bookmaker": bookie, "markets": markets, "market_count": len(markets)}]
            return {
                "event":         event,
                "bookmakers":    bookmakers,
                "total_markets": len(markets),
                "source":        "ws_live",
            }
        # else: drop into the r_cn path below (source="r_cn_snapshot")

    # Goalserve pregame full-market snapshot — contains ALL markets from the
    # getodds XML (typically 15-25 for World Cup / major leagues), not just
    # the ~12 canonical markets that build_rcn() writes into r_cn.
    pregame = _load_pregame_markets(event_id)
    if pregame:
        pregame = _filter_expired_ht_markets(event, pregame)
        pregame = _filter_impossible_correct_score(event, pregame)
        return {
            "event":         event,
            "bookmakers":    [{"bookmaker": "Bet365", "markets": pregame, "market_count": len(pregame)}],
            "total_markets": len(pregame),
            "source":        "r_cn_snapshot",
        }

    # Pre-match path — read r_cn from MySQL and decode.  The parser
    # emits a single canonical market list (matches what Crown PHP
    # ingest writes via OddsApiToCrownXml), so we surface it under the
    # single ``"Bet365"`` bookmaker key.  Multi-book pre-match views are
    # not currently produced by the upstream ingest (it writes one
    # bookmaker into r_cn); restore them by parsing additional snapshots
    # if that requirement returns.
    xml_row = mysqldb.fetch_one(
        "SELECT r_cn FROM foot_match_xml WHERE gid = %s",
        (event_id,),
    )
    markets = parse_rcn_markets((xml_row or {}).get("r_cn") or "")
    markets = _filter_expired_ht_markets(event, markets)
    markets = _filter_impossible_correct_score(event, markets)
    # Source label drives the H5 frontend's bookability gate:
    # `stalePrematch = isInplay && source !== "ws_live"` locks in-play bets.
    # Since the limitless cutover, ingest_limitless.php refreshes r_cn with
    # LIVE odds every 2 min, so an in-play match served from r_cn carries
    # current, bookable prices — label it "ws_live" so betting isn't locked.
    # Pre-match keeps "r_cn_snapshot" (already bookable; isInplay=false).
    src = "ws_live" if _is_inplay_row(event) else "r_cn_snapshot"
    if not markets:
        return {
            "event": event,
            "bookmakers": [],
            "total_markets": 0,
            "source": src,
        }
    bookmakers = [{
        "bookmaker":    "Bet365",
        "markets":      markets,
        "market_count": len(markets),
    }]
    return {
        "event": event,
        "bookmakers": bookmakers,
        "total_markets": len(markets),
        "source": src,
    }


def _iso_to_epoch(iso: str | None) -> int | None:
    """Parse an ISO-8601 string (with optional `Z` UTC suffix) into a
    Unix epoch second.  Used by the in-play markets path to attach an
    `updated_at_ts` to each WS-derived market for the H5 frontend's
    "x秒前更新" badge.
    """
    if not iso:
        return None
    s = iso.replace("Z", "+00:00") if iso.endswith("Z") else iso
    try:
        from datetime import datetime
        return int(datetime.fromisoformat(s).timestamp())
    except ValueError:
        return None


# ---------------------------------------------------------------------------
# WebSocket — push odds-api.io updates to the browser.

@router.get("/ws/status")
def ws_status(request: Request) -> dict:
    """Diagnostics for the upstream WS bridge: is it connected, how many
    messages has it relayed, when was the last message?"""
    bridge = getattr(request.app.state, "odds_ws", None)
    if bridge is None:
        return {"enabled": False, "reason": "ODDS_API_KEY not set on backend"}
    return {
        "enabled":             True,
        "connected":           bridge.connected,
        "reconnects":          bridge.reconnects,
        "messages_received":   bridge.messages_received,
        "messages_dispatched": bridge.messages_dispatched,
        "last_message_at":     bridge.last_message_at,
        "subscribers":         len(bridge._subs),  # noqa: SLF001
    }


@router.websocket("/ws")
async def ws_endpoint(
    ws: WebSocket,
    eventIds: str | None = Query(None, description="comma-separated event ids to filter"),
):
    """Browser-facing WebSocket. Pushes upstream odds-api.io ``updated`` /
    ``created`` / ``deleted`` / ``no_markets`` messages, optionally
    filtered by event id.

    Wire format mirrors the upstream payload (see odds-api.io WS docs)
    plus a ``server_ts`` ms timestamp for client-side latency tracking.
    """
    bridge = getattr(ws.app.state, "odds_ws", None)
    if bridge is None:
        await ws.accept()
        await ws.send_json({"type": "error", "error": "ws_bridge_disabled"})
        await ws.close(code=1011)
        return

    # Parse the optional event-id filter once.
    filter_ids: set[str] | None = None
    if eventIds:
        filter_ids = {s.strip() for s in eventIds.split(",") if s.strip()}

    await ws.accept()
    q = await bridge.subscribe()
    log.info("ws client connected (filter=%s, subs=%d)", filter_ids, len(bridge._subs))  # noqa: SLF001

    # Initial hello so the client knows the pipe is alive.
    import time
    await ws.send_json({
        "type":      "hello",
        "filter":    sorted(filter_ids) if filter_ids else None,
        "server_ts": int(time.time() * 1000),
    })

    try:
        # Two concurrent tasks: relay upstream → client, and read client →
        # upstream (so we notice a disconnect quickly).
        # Heartbeat: Cloudflare drops idle WS at ~100s. When the upstream is
        # quiet (no matching tick for the filter) we send a tiny `ping` every
        # 25s so the connection stays warm and the browser keeps `wsConnected`
        # truthy.
        async def relay():
            while True:
                try:
                    msg = await asyncio.wait_for(q.get(), timeout=25.0)
                except asyncio.TimeoutError:
                    await ws.send_json({
                        "type":      "ping",
                        "server_ts": int(time.time() * 1000),
                    })
                    continue
                if filter_ids is not None and str(msg.get("id") or "") not in filter_ids:
                    continue
                msg = dict(msg)
                msg["server_ts"] = int(time.time() * 1000)
                await ws.send_json(msg)

        async def reader():
            # We don't expect any inbound messages — just want to know
            # when the client closes the socket.
            while True:
                await ws.receive_text()

        relay_t  = asyncio.create_task(relay())
        reader_t = asyncio.create_task(reader())
        done, pending = await asyncio.wait(
            {relay_t, reader_t},
            return_when=asyncio.FIRST_COMPLETED,
        )
        for t in pending:
            t.cancel()
            with suppress(asyncio.CancelledError):
                await t
        for t in done:
            exc = t.exception()
            if exc:
                raise exc
    except WebSocketDisconnect:
        pass
    except Exception as e:                                          # noqa: BLE001
        log.warning("ws relay error: %s", e)
    finally:
        await bridge.unsubscribe(q)
        with suppress(Exception):
            await ws.close()
