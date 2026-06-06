#!/usr/bin/env python3
"""Ingest fixtures + odds from odds-api.io for the 7 top European football
leagues into ``data/oddsapi.sqlite``.

Usage:
    ODDS_API_KEY=xxxxx python3 scripts/ingest_oddsapi.py
    python3 scripts/ingest_oddsapi.py --api-key xxxxx --bookmakers Bet365,1xbet
    python3 scripts/ingest_oddsapi.py --skip-odds   # fixtures only (cheap)
    python3 scripts/ingest_oddsapi.py --leagues england-premier-league

Defaults:
    leagues    = the 7 leagues requested (EPL/Serie A/La Liga/Ligue 1/Bundesliga/UCL/UEL)
    bookmakers = Bet365 (single book; cheapest in terms of payload size)

The script is idempotent: each event is upserted by ``id``, and each market
row is upserted by ``(event_id, bookmaker, market_name)``. Run it on a cron
or systemd timer to refresh.

Quota notes (odds-api.io v3):
    - /v3/events  is cheap (one call per league)
    - /v3/odds    is one call per event id; we batch sequentially and respect
                  a small inter-call delay so we don't hammer the upstream.
    - We only fetch /v3/odds for events with status in {pending, inplay}; we
      still upsert settled events so the UI can show scores/recent results.

Dependencies: stdlib only (urllib + sqlite3 + json + argparse). No new
packages added to backend/requirements.txt.
"""
from __future__ import annotations

import argparse
import difflib
import json
import os
import re
import ssl
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Iterable

# Allow `python3 scripts/ingest_oddsapi.py` from any cwd.
REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "backend"))

from app import oddsdb  # noqa: E402

API_BASE = "https://api.odds-api.io/v3"


def _build_ssl_context() -> ssl.SSLContext:
    """Build an SSL context that actually trusts public CAs.

    macOS Python.org installs ship without the system trust store wired
    up; ``ssl.create_default_context()`` then fails with
    ``CERTIFICATE_VERIFY_FAILED``. We work around this by, in order:

      1. SSL_CERT_FILE env var (lets ops override).
      2. certifi's bundle if importable.
      3. Whatever the platform default ends up being.
    """
    cafile = os.environ.get("SSL_CERT_FILE")
    if not cafile:
        try:
            import certifi  # type: ignore
            cafile = certifi.where()
        except ImportError:
            cafile = None
    return ssl.create_default_context(cafile=cafile)


_SSL_CTX = _build_ssl_context()

# Slug -> human label. Used for logging only; the league name we store
# comes from the API response so it stays authoritative.
DEFAULT_LEAGUES: dict[str, str] = {
    "england-premier-league":                     "Premier League",
    "italy-serie-a":                              "Serie A",
    "spain-laliga":                               "La Liga",
    "france-ligue-1":                             "Ligue 1",
    "germany-bundesliga":                         "Bundesliga",
    "international-clubs-uefa-champions-league":  "UEFA Champions League",
    "international-clubs-uefa-europa-league":     "UEFA Europa League",
}

# Active statuses whose odds we want to pull. ``settled`` is upserted as a
# fixture but we skip the /v3/odds call for it to save quota.
ACTIVE_STATUSES = {"pending", "inplay", "live"}


class IngestError(RuntimeError):
    pass


# ---------------------------------------------------------------------------
# api-sports.io (a.k.a. API-Football) cross-reference.
#
# Each odds-api.io league_slug maps to one api-sports.io league_id. The
# season uses api-sports' convention: 2025 == European 2025-2026 season.
# ---------------------------------------------------------------------------
APISPORTS_BASE = "https://v3.football.api-sports.io"
APISPORTS_LEAGUE_IDS: dict[str, int] = {
    "england-premier-league":                     39,
    "italy-serie-a":                              135,
    "spain-laliga":                               140,
    "france-ligue-1":                             61,
    "germany-bundesliga":                         78,
    "international-clubs-uefa-champions-league":  2,
    "international-clubs-uefa-europa-league":     3,
}
APISPORTS_DEFAULT_SEASON = 2025  # 2025-2026

# Acceptance thresholds for the fuzzy fixture match.
APISPORTS_TIME_WINDOW_S   = 18 * 3600   # accept fixtures within ±18h of kickoff
APISPORTS_MIN_TEAM_SIM    = 0.5         # per-team similarity floor
APISPORTS_MIN_OVERALL_SIM = 0.7         # combined (home+away)/2 floor

# Manual aliases for team names where stripping suffixes still leaves a
# mismatch — e.g. "Wolverhampton Wanderers" (odds-api) vs "Wolves"
# (api-sports). Keys are the *normalised* (lowercase, no suffix) form.
_TEAM_ALIASES: dict[str, str] = {
    "wolverhampton wanderers": "wolves",
    "wolverhampton":            "wolves",
    "spurs":                    "tottenham",
    "tottenham hotspur":        "tottenham",
    "manchester united":        "manchester united",
    "manchester city":          "manchester city",
    "leeds united":             "leeds",
    "newcastle united":         "newcastle",
    "brighton & hove albion":   "brighton",
    "brighton hove albion":     "brighton",
    "leicester city":           "leicester",
    "real betis seville":       "real betis",
    "real sociedad san sebastian": "real sociedad",
    "espanyol barcelona":       "espanyol",
    "juventus turin":           "juventus",
    "lazio rome":               "lazio",
    "inter milano":             "inter",
    "ssc napoli":               "napoli",
    "rc celta de vigo":         "celta vigo",
    "paris saint-germain":      "paris saint germain",
    "as saint-etienne":         "saint etienne",
    "saint-etienne":            "saint etienne",
    "borussia dortmund":        "dortmund",
}

_TEAM_SUFFIX_RE = re.compile(
    # Club-type designators we drop on both sides before comparing. Note
    # this also catches `Calcio` (Parma Calcio / Sassuolo Calcio / Udinese
    # Calcio in Serie A) and `Hellas` as a prefix for Verona.
    r"\b(?:FC|AFC|CF|BC|SC|AC|AS|RC|RCD|SSC|ACF|UD|VfL|VFL|OGC|US|CFC|HC|TSV|FK|IFK"
    r"|Calcio|Hellas)\b",
    re.IGNORECASE,
)
_TEAM_YEAR_RE  = re.compile(r"\b(?:18|19|20)\d{2}\b")
_TEAM_PAREN_RE = re.compile(r"\([^)]*\)")
_TEAM_PUNCT_RE = re.compile(r"[^\w\s\-']")


def _strip_diacritics(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if not unicodedata.combining(c))


def _normalize_team(s: str | None) -> str:
    """Lowercase, no diacritics, suffix-stripped canonical form.

    Examples (odds-api → normalised):
        "AFC Bournemouth"          -> "bournemouth"
        "Arsenal FC"               -> "arsenal"
        "Tottenham Hotspur"        -> "tottenham"          (via alias)
        "Wolverhampton Wanderers"  -> "wolves"             (via alias)
        "Real Sociedad San Sebastian" -> "real sociedad"   (via alias)
    """
    if not s:
        return ""
    out = _strip_diacritics(s)
    out = _TEAM_PAREN_RE.sub("", out)
    out = _TEAM_SUFFIX_RE.sub(" ", out)
    out = _TEAM_YEAR_RE.sub(" ", out)
    out = _TEAM_PUNCT_RE.sub(" ", out)
    out = re.sub(r"\s+", " ", out).strip().lower()
    return _TEAM_ALIASES.get(out, out)


def _team_similarity(a: str | None, b: str | None) -> float:
    """0..1 similarity tolerant to suffix / word-order differences."""
    a = _normalize_team(a)
    b = _normalize_team(b)
    if not a or not b:
        return 0.0
    if a == b:
        return 1.0
    ta, tb = set(a.split()), set(b.split())
    if ta & tb:
        # Token-set overlap is the cleanest signal when both sides share
        # at least one word ("Tottenham Hotspur" / "Tottenham").
        return len(ta & tb) / max(len(ta), len(tb))
    return difflib.SequenceMatcher(None, a, b).ratio()


def _apisports_get(path: str, params: dict, api_key: str, *, timeout: float = 15.0) -> object:
    qs = urllib.parse.urlencode(params, doseq=True)
    url = f"{APISPORTS_BASE}{path}?{qs}"
    req = urllib.request.Request(
        url,
        headers={
            "x-apisports-key": api_key,
            "User-Agent": "crown-explorer/oddsapi-ingest",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=_SSL_CTX) as resp:
            body = resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise IngestError(f"api-sports HTTP {e.code} on {path}: {body[:200]}") from e
    except urllib.error.URLError as e:
        raise IngestError(f"api-sports network error on {path}: {e}") from e
    try:
        return json.loads(body)
    except json.JSONDecodeError as e:
        raise IngestError(f"api-sports non-JSON on {path}: {body[:200]}") from e


def fetch_apisports_fixtures(api_key: str, league_id: int, season: int) -> list[dict]:
    """All fixtures for a given league + season from api-sports.io."""
    data = _apisports_get(
        "/fixtures",
        {"league": league_id, "season": season},
        api_key,
    )
    if not isinstance(data, dict):
        raise IngestError(f"api-sports fixtures: unexpected payload type {type(data).__name__}")
    errors = data.get("errors")
    if errors:
        # api-sports.io returns 200 + an "errors" map for auth / rate-limit issues.
        raise IngestError(f"api-sports fixtures: errors={errors}")
    response = data.get("response") or []
    if not isinstance(response, list):
        raise IngestError(f"api-sports fixtures: response is {type(response).__name__}")
    return response


def link_apisports_fixtures(
    conn,
    api_key: str,
    season: int,
    *,
    verbose: bool = True,
) -> dict:
    """Cross-reference every odds_event row with an api-sports.io fixture.

    For each league we've ingested, fetches the full season's fixtures once
    (cheap — one /fixtures call per league), then iterates the events and
    finds the best matching fixture by:

        1. League slug → api-sports league_id (static table)
        2. Date window: |kickoff_apisports - commence_ts| <= 18h
        3. Team similarity: sim(home_odds, home_apisports) and
                            sim(away_odds, away_apisports) both >= 0.5,
                            and their average >= 0.7

    Writes the matched ``fixture.id`` into ``apisports_fixture_id`` and the
    matched ``fixture.date`` into ``apisports_match_iso`` for audit.

    Returns a small stats dict suitable for merging into the run summary.
    """
    league_slugs = [r["league_slug"] for r in conn.execute(
        "SELECT DISTINCT league_slug FROM odds_event"
    ).fetchall()]
    if not league_slugs:
        return {"linked": 0, "skipped": 0, "checked": 0, "leagues_fetched": 0}

    fixtures_by_league: dict[str, list[dict]] = {}
    for slug in league_slugs:
        lid = APISPORTS_LEAGUE_IDS.get(slug)
        if not lid:
            if verbose:
                print(f"  [apisports] {slug}: no league_id mapping, skipped")
            continue
        try:
            fixtures = fetch_apisports_fixtures(api_key, lid, season)
        except IngestError as e:
            if verbose:
                print(f"  [apisports] {slug}: {e}", file=sys.stderr)
            continue
        fixtures_by_league[slug] = fixtures
        if verbose:
            print(f"  [apisports] {slug} (league={lid}, season={season}): {len(fixtures)} fixtures")

    events = list(conn.execute(
        "SELECT id, league_slug, home, away, commence_ts FROM odds_event"
    ).fetchall())

    linked = 0
    skipped = 0
    for ev in events:
        fixtures = fixtures_by_league.get(ev["league_slug"]) or []
        if not fixtures:
            skipped += 1
            continue

        # Pre-filter by time window if we know the kickoff.
        t0 = (ev["commence_ts"] or 0) - APISPORTS_TIME_WINDOW_S
        t1 = (ev["commence_ts"] or 0) + APISPORTS_TIME_WINDOW_S
        candidates: list[dict] = []
        for fx in fixtures:
            iso = ((fx.get("fixture") or {}).get("date"))
            ts = _iso_to_epoch(iso)
            if ev["commence_ts"] and ts is not None and not (t0 <= ts <= t1):
                continue
            candidates.append(fx)

        best_score = 0.0
        best_match: tuple[int, str] | None = None
        for fx in candidates:
            teams = fx.get("teams") or {}
            h = (teams.get("home") or {}).get("name")
            a = (teams.get("away") or {}).get("name")
            s_h = _team_similarity(ev["home"], h)
            s_a = _team_similarity(ev["away"], a)
            if s_h < APISPORTS_MIN_TEAM_SIM or s_a < APISPORTS_MIN_TEAM_SIM:
                continue
            score = (s_h + s_a) / 2
            if score > best_score:
                best_score = score
                best_match = (int((fx.get("fixture") or {}).get("id")),
                              (fx.get("fixture") or {}).get("date"))

        if best_match and best_score >= APISPORTS_MIN_OVERALL_SIM:
            conn.execute(
                """
                UPDATE odds_event
                   SET apisports_fixture_id = ?,
                       apisports_match_iso  = ?
                 WHERE id = ?
                """,
                (best_match[0], best_match[1], ev["id"]),
            )
            linked += 1
        else:
            skipped += 1

    conn.commit()
    return {
        "linked":          linked,
        "skipped":         skipped,
        "checked":         len(events),
        "leagues_fetched": len(fixtures_by_league),
    }


# ---------------------------------------------------------------------------
# HTTP

def _http_get(path: str, params: dict, *, timeout: float = 15.0) -> object:
    qs = urllib.parse.urlencode(params, doseq=True)
    url = f"{API_BASE}{path}?{qs}"
    req = urllib.request.Request(url, headers={"User-Agent": "crown-explorer/oddsapi-ingest"})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=_SSL_CTX) as resp:
            body = resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:                              # noqa: PERF203
        body = e.read().decode("utf-8", errors="replace")
        raise IngestError(f"HTTP {e.code} from {path}: {body[:300]}") from e
    except urllib.error.URLError as e:
        raise IngestError(f"network error on {path}: {e}") from e
    try:
        return json.loads(body)
    except json.JSONDecodeError as e:
        raise IngestError(f"non-JSON from {path}: {body[:200]}") from e


# ---------------------------------------------------------------------------
# API helpers

def fetch_events(api_key: str, league_slug: str, *, limit: int = 200) -> list[dict]:
    """Return all events for a league (pending + inplay + settled)."""
    data = _http_get(
        "/events",
        {
            "apiKey": api_key,
            "sport": "football",
            "league": league_slug,
            "limit": limit,
        },
    )
    if isinstance(data, dict) and "error" in data:
        raise IngestError(f"events error for {league_slug}: {data['error']}")
    if not isinstance(data, list):
        raise IngestError(f"unexpected events payload for {league_slug}: {type(data).__name__}")
    return data


def fetch_odds(api_key: str, event_id: int, bookmakers: list[str]) -> dict:
    data = _http_get(
        "/odds",
        {
            "apiKey": api_key,
            "eventId": event_id,
            "bookmakers": ",".join(bookmakers),
        },
    )
    if isinstance(data, dict) and "error" in data:
        raise IngestError(f"odds error for event {event_id}: {data['error']}")
    if not isinstance(data, dict):
        raise IngestError(f"unexpected odds payload for event {event_id}: {type(data).__name__}")
    return data


# ---------------------------------------------------------------------------
# Upserts

def _iso_to_epoch(iso: str | None) -> int | None:
    if not iso:
        return None
    # Python 3.11 supports trailing Z directly; older versions need manual strip.
    s = iso.replace("Z", "+00:00") if iso.endswith("Z") else iso
    try:
        from datetime import datetime
        return int(datetime.fromisoformat(s).timestamp())
    except ValueError:
        return None


def upsert_event(conn, ev: dict, league_slug: str) -> None:
    scores = ev.get("scores") or {}
    sh = scores.get("home")
    sa = scores.get("away")
    conn.execute(
        """
        INSERT INTO odds_event (
            id, sport_slug, league_slug, league_name,
            home, away, home_id, away_id,
            commence_iso, commence_ts, status,
            score_home, score_away, raw_json, fetched_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            sport_slug     = excluded.sport_slug,
            league_slug    = excluded.league_slug,
            league_name    = excluded.league_name,
            home           = excluded.home,
            away           = excluded.away,
            home_id        = excluded.home_id,
            away_id        = excluded.away_id,
            commence_iso   = excluded.commence_iso,
            commence_ts    = excluded.commence_ts,
            status         = excluded.status,
            score_home     = excluded.score_home,
            score_away     = excluded.score_away,
            raw_json       = excluded.raw_json,
            fetched_at     = excluded.fetched_at
        """,
        (
            ev["id"],
            (ev.get("sport") or {}).get("slug") or "football",
            league_slug,
            (ev.get("league") or {}).get("name"),
            ev.get("home"),
            ev.get("away"),
            ev.get("homeId"),
            ev.get("awayId"),
            ev.get("date"),
            _iso_to_epoch(ev.get("date")),
            ev.get("status"),
            sh if isinstance(sh, int) else None,
            sa if isinstance(sa, int) else None,
            json.dumps(ev, ensure_ascii=False),
            int(time.time()),
        ),
    )


def upsert_markets(conn, event_id: int, bookmakers_dict: dict) -> int:
    """Each bookmaker entry maps to a list of {name, updatedAt, odds[]}.
    Returns count of rows upserted.
    """
    count = 0
    for book, markets in (bookmakers_dict or {}).items():
        if not isinstance(markets, list):
            continue
        for m in markets:
            if not isinstance(m, dict) or not m.get("name"):
                continue
            updated_iso = m.get("updatedAt")
            # NOTE: market_id is INTEGER PRIMARY KEY AUTOINCREMENT, so it is
            # *not* set in the INSERT — sqlite assigns the next id (000001,
            # 000002, ...). On conflict against the UNIQUE (event_id,
            # bookmaker, market_name) tuple we update in place, preserving
            # the original market_id so client-stored IDs stay valid.
            conn.execute(
                """
                INSERT INTO odds_market (
                    event_id, bookmaker, market_name,
                    odds_json, updated_at_iso, updated_at_ts
                ) VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(event_id, bookmaker, market_name) DO UPDATE SET
                    odds_json      = excluded.odds_json,
                    updated_at_iso = excluded.updated_at_iso,
                    updated_at_ts  = excluded.updated_at_ts
                """,
                (
                    event_id,
                    book,
                    m["name"],
                    json.dumps(m.get("odds") or [], ensure_ascii=False),
                    updated_iso,
                    _iso_to_epoch(updated_iso),
                ),
            )
            count += 1
    return count


# ---------------------------------------------------------------------------
# Main pipeline

def run(
    api_key: str,
    leagues: Iterable[str],
    bookmakers: list[str],
    *,
    skip_odds: bool = False,
    odds_delay: float = 0.4,
    verbose: bool = True,
    apisports_key: str | None = None,
    apisports_season: int = APISPORTS_DEFAULT_SEASON,
) -> dict:
    stats = {
        "leagues":            0,
        "events_upserted":    0,
        "events_active":      0,
        "odds_calls":         0,
        "markets_upserted":   0,
        "apisports_linked":   0,
        "apisports_skipped":  0,
        "apisports_checked":  0,
        "errors":             [],
    }
    conn = oddsdb.connect_rw()
    try:
        conn.execute("BEGIN")
        for slug in leagues:
            stats["leagues"] += 1
            try:
                events = fetch_events(api_key, slug)
            except IngestError as e:
                msg = f"[{slug}] events failed: {e}"
                stats["errors"].append(msg)
                if verbose:
                    print(msg, file=sys.stderr)
                continue
            if verbose:
                print(f"[{slug}] fetched {len(events)} events")
            for ev in events:
                upsert_event(conn, ev, slug)
                stats["events_upserted"] += 1
        conn.commit()

        if not skip_odds:
            # Second pass: pull odds for active events only. We re-read from the
            # DB so a partial earlier crash still gets its odds backfilled.
            rows = conn.execute(
                """
                SELECT id FROM odds_event
                WHERE league_slug IN ({})
                  AND status IN ({})
                ORDER BY commence_ts
                """.format(
                    ",".join("?" for _ in leagues),
                    ",".join("?" for _ in ACTIVE_STATUSES),
                ),
                (*leagues, *ACTIVE_STATUSES),
            ).fetchall()
            stats["events_active"] = len(rows)
            for i, r in enumerate(rows):
                eid = r["id"]
                try:
                    odds = fetch_odds(api_key, eid, bookmakers)
                except IngestError as e:
                    msg = f"[event {eid}] odds failed: {e}"
                    stats["errors"].append(msg)
                    if verbose:
                        print(msg, file=sys.stderr)
                    continue
                stats["odds_calls"] += 1
                with conn:
                    count = upsert_markets(conn, eid, odds.get("bookmakers") or {})
                stats["markets_upserted"] += count
                if verbose:
                    print(f"  ({i+1}/{len(rows)}) event {eid}: +{count} markets")
                time.sleep(odds_delay)

        # Third pass: cross-reference api-sports.io fixture ids. Cheap
        # (one call per league); does *not* depend on the odds-api odds
        # call so we run it regardless of --skip-odds when a key is set.
        if apisports_key:
            try:
                link_stats = link_apisports_fixtures(
                    conn, apisports_key, apisports_season, verbose=verbose,
                )
                stats["apisports_linked"]  = link_stats["linked"]
                stats["apisports_skipped"] = link_stats["skipped"]
                stats["apisports_checked"] = link_stats["checked"]
                if verbose:
                    print(
                        f"  [apisports] linked {link_stats['linked']}/{link_stats['checked']} events "
                        f"(skipped {link_stats['skipped']}, leagues fetched {link_stats['leagues_fetched']})"
                    )
            except IngestError as e:
                msg = f"[apisports] linking failed: {e}"
                stats["errors"].append(msg)
                if verbose:
                    print(msg, file=sys.stderr)
    finally:
        conn.close()
    return stats


def main() -> int:
    p = argparse.ArgumentParser(description="Ingest odds-api.io into oddsapi.sqlite")
    p.add_argument("--api-key", default=os.environ.get("ODDS_API_KEY"),
                   help="odds-api.io API key (or env ODDS_API_KEY)")
    p.add_argument("--leagues", default=",".join(DEFAULT_LEAGUES),
                   help="comma-separated list of league slugs")
    p.add_argument("--bookmakers", default="Bet365",
                   help="comma-separated list of bookmaker names (must match /v3/bookmakers)")
    p.add_argument("--skip-odds", action="store_true",
                   help="only refresh fixtures, skip the /v3/odds calls")
    p.add_argument("--odds-delay", type=float, default=0.4,
                   help="seconds to sleep between /v3/odds calls (default 0.4)")
    p.add_argument("--apisports-key", default=os.environ.get("APISPORTS_KEY"),
                   help="api-sports.io API key for fixture cross-reference (env APISPORTS_KEY)")
    p.add_argument("--apisports-season", type=int, default=APISPORTS_DEFAULT_SEASON,
                   help=f"api-sports.io season year (default {APISPORTS_DEFAULT_SEASON} = 2025-2026)")
    args = p.parse_args()

    if not args.api_key:
        print("error: --api-key or ODDS_API_KEY required", file=sys.stderr)
        return 2

    leagues = [s.strip() for s in args.leagues.split(",") if s.strip()]
    bookmakers = [s.strip() for s in args.bookmakers.split(",") if s.strip()]
    if not leagues:
        print("error: no leagues", file=sys.stderr)
        return 2
    if not bookmakers and not args.skip_odds:
        print("error: --bookmakers required unless --skip-odds", file=sys.stderr)
        return 2

    print(f"DB: {oddsdb.DB_PATH}")
    print(f"Leagues: {leagues}")
    print(f"Bookmakers: {bookmakers}")
    if args.apisports_key:
        print(f"api-sports.io linking: ON (season={args.apisports_season})")
    else:
        print("api-sports.io linking: OFF (no --apisports-key / APISPORTS_KEY)")
    stats = run(
        api_key=args.api_key,
        leagues=leagues,
        bookmakers=bookmakers,
        skip_odds=args.skip_odds,
        odds_delay=args.odds_delay,
        apisports_key=args.apisports_key,
        apisports_season=args.apisports_season,
    )
    print("---- summary ----")
    print(json.dumps(stats, indent=2, ensure_ascii=False))
    return 0 if not stats["errors"] else 1


if __name__ == "__main__":
    sys.exit(main())
