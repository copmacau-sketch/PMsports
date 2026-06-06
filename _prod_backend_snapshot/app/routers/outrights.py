"""GET /api/external/outrights — futures / outrights from the-odds-api.com.

The odds-api.io feed used by the rest of /api/external/* does not expose
outright (championship/winner) markets for soccer. We complement it here
with a thin caching proxy in front of the-odds-api.com which DOES carry
those markets — although only for a small set of dedicated sport keys
(``soccer_fifa_world_cup_winner``, the four golf majors, NFL Super Bowl,
NBA / NHL / MLB championship winners, US Presidential Election).

Endpoints:
    GET /api/external/outrights              — index (one row per cached event)
    GET /api/external/outrights/{sport_key}  — full bookmaker breakdown

The ``THEODDSAPI_KEY`` env var is required; without it the endpoints
return an empty list with ``"available": False`` so the frontend can
gracefully fall back to the "待开放" state.

Caching is in-memory only — a single uvicorn worker keeps a dict keyed
by sport_key with a 30-minute TTL. That keeps the upstream quota usage
deterministic (1 call / sport / 30 min) regardless of how many H5 users
we serve.
"""
from __future__ import annotations

import json
import logging
import os
import ssl
import time
import urllib.parse
import urllib.request
from typing import Any

import certifi
from fastapi import APIRouter, HTTPException, Query

from .. import mysqldb

log = logging.getLogger("outrights")
router = APIRouter()

# ---------------------------------------------------------------------------
# Config

THEODDSAPI_BASE = "https://api.the-odds-api.com/v4"
DEFAULT_SPORT_KEYS = (
    # Soccer is the only one we currently surface in the frontend, but the
    # other entries make this endpoint useful for the cross-sport futures
    # tab we may add later. Keep the list explicit so we never accidentally
    # call sport keys that have_outrights:false (which would burn quota).
    "soccer_fifa_world_cup_winner",
)

CACHE_TTL_SEC = 30 * 60  # 30 minutes
HTTP_TIMEOUT_SEC = 10

_cache: dict[str, tuple[float, dict]] = {}
_ssl_ctx = ssl.create_default_context(cafile=certifi.where())


# ---------------------------------------------------------------------------
# HTTP helpers

def _api_key() -> str | None:
    return os.environ.get("THEODDSAPI_KEY") or None


def _http_get(path: str, params: dict[str, Any]) -> Any:
    qs = urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
    url = f"{THEODDSAPI_BASE}{path}?{qs}"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT_SEC, context=_ssl_ctx) as resp:
        body = resp.read()
        remaining = resp.headers.get("x-requests-remaining")
        used = resp.headers.get("x-requests-used")
        log.info(
            "the-odds-api %s %s remaining=%s used=%s",
            path, resp.status, remaining, used,
        )
        return json.loads(body.decode("utf-8") or "[]")


# ---------------------------------------------------------------------------
# Aggregation. We collapse N bookmakers into a single sorted list keyed
# by outcome name with the *best* (lowest implied prob — i.e. highest
# decimal odds) price across books, and a per-bookmaker breakdown for
# users who want to compare. The frontend currently uses only the
# aggregate, but the breakdown comes for free and avoids a second call.

def _aggregate_outrights(event: dict) -> dict | None:
    bms = event.get("bookmakers") or []
    if not bms:
        return None
    # outcome_name → {"price": best, "bookmaker": str, "all": {bm: price}}
    agg: dict[str, dict] = {}
    bookmakers_seen: list[str] = []
    for bm in bms:
        bm_key = bm.get("key") or bm.get("title") or "?"
        bm_title = bm.get("title") or bm_key
        bookmakers_seen.append(bm_title)
        for mkt in bm.get("markets") or []:
            # the-odds-api.com emits two related keys for outrights:
            #   - "outrights"     — back-side prices
            #   - "outrights_lay" — lay-side prices (Betfair only)
            # We consume only the back side; lay would invert the
            # interpretation and confuse users.
            if mkt.get("key") != "outrights":
                continue
            for o in mkt.get("outcomes") or []:
                name = o.get("name")
                price = o.get("price")
                if not name or not isinstance(price, (int, float)) or price <= 0:
                    continue
                cur = agg.setdefault(name, {"price": 0.0, "bookmaker": bm_title, "all": {}})
                cur["all"][bm_title] = float(price)
                if float(price) > cur["price"]:
                    cur["price"] = float(price)
                    cur["bookmaker"] = bm_title
    if not agg:
        return None
    outcomes = [
        {
            "name": name,
            "price": round(v["price"], 3),
            "bookmaker": v["bookmaker"],
            "books": v["all"],
        }
        for name, v in agg.items()
    ]
    # Cheapest favourite first (lowest decimal price = most likely winner)
    outcomes.sort(key=lambda x: x["price"])
    return {
        "id":            event.get("id"),
        "sport_key":     event.get("sport_key"),
        "sport_title":   event.get("sport_title"),
        "commence_time": event.get("commence_time"),
        "bookmakers":    sorted(set(bookmakers_seen)),
        "outcomes":      outcomes,
        "outcome_count": len(outcomes),
    }


def _apply_world_cup_filter(payload: dict) -> dict:
    """Filter ``soccer_fifa_world_cup_winner`` outcomes down to teams
    that actually appear in Crown's fixture list (lid=108) and stamp a
    ``group`` letter on each surviving outcome.

    Bookmakers carry roughly 54 outright candidates, including longshots
    that didn't qualify (Italy, Denmark, Poland, Bolivia, Jamaica,
    Kosovo).  Crown is the source of truth for what's in the tournament,
    so we drop anything we can't map back to a Crown team.

    Other sport keys pass through unmodified.
    """
    if payload.get("sport_key") != "soccer_fifa_world_cup_winner":
        return payload
    try:
        wc = mysqldb.world_cup_groups()
    except Exception as e:                                            # noqa: BLE001
        log.warning("world_cup_groups() failed; passing through unfiltered: %s", e)
        return payload
    team_to_group = wc.get("team_to_group") or {}
    if not team_to_group:
        return payload

    new_events: list[dict] = []
    for ev in payload.get("events") or []:
        kept: list[dict] = []
        for o in ev.get("outcomes") or []:
            canon = mysqldb.normalize_outright_team(str(o.get("name") or ""))
            grp = team_to_group.get(canon)
            if not grp:
                continue
            o = dict(o)
            o["canonical_name"] = canon
            o["group"] = grp
            kept.append(o)
        if not kept:
            continue
        ev = dict(ev)
        ev["outcomes"] = kept
        ev["outcome_count"] = len(kept)
        ev["groups"] = wc.get("groups")
        new_events.append(ev)
    payload = dict(payload)
    payload["events"] = new_events
    payload["available"] = bool(new_events)
    return payload


def _fetch_sport(sport_key: str) -> dict:
    """Returns the cached (or fresh) aggregated outright payload for one
    sport key. Cache miss / stale → upstream call. Upstream failure with
    an existing cache entry → return the stale entry plus a warning."""
    now = time.time()
    cached = _cache.get(sport_key)
    if cached and now - cached[0] < CACHE_TTL_SEC:
        return cached[1]

    api_key = _api_key()
    if not api_key:
        # No upstream — surface a clear "not configured" payload so the
        # frontend can render the 待开放 state instead of an error.
        empty = {
            "sport_key": sport_key,
            "available": False,
            "reason":    "THEODDSAPI_KEY not set",
            "events":    [],
            "fetched_at": int(now),
        }
        _cache[sport_key] = (now, empty)
        return empty

    try:
        raw = _http_get(
            f"/sports/{sport_key}/odds/",
            {
                "apiKey":      api_key,
                "regions":     "eu,uk",
                "markets":     "outrights",
                "oddsFormat":  "decimal",
            },
        )
    except Exception as e:                                          # noqa: BLE001
        log.warning("the-odds-api fetch failed for %s: %s", sport_key, e)
        if cached:
            stale = dict(cached[1])
            stale["stale"] = True
            return stale
        return {
            "sport_key": sport_key,
            "available": False,
            "reason":    f"upstream error: {e}",
            "events":    [],
            "fetched_at": int(now),
        }

    if not isinstance(raw, list):
        raw = []
    events = []
    for ev in raw:
        if not isinstance(ev, dict):
            continue
        agg = _aggregate_outrights(ev)
        if agg:
            events.append(agg)
    payload = {
        "sport_key":  sport_key,
        "available":  bool(events),
        "events":     events,
        "fetched_at": int(now),
    }
    payload = _apply_world_cup_filter(payload)
    _cache[sport_key] = (now, payload)
    return payload


# ---------------------------------------------------------------------------
# HTTP routes

@router.get("/outrights")
def list_outrights(
    sport_keys: str | None = Query(
        None,
        description=(
            "comma-separated sport_keys to fetch. Defaults to the curated "
            "list ({}) which covers the FIFA World Cup winner."
        ).format(",".join(DEFAULT_SPORT_KEYS)),
    ),
) -> dict:
    keys: list[str]
    if sport_keys:
        keys = [s.strip() for s in sport_keys.split(",") if s.strip()]
    else:
        keys = list(DEFAULT_SPORT_KEYS)

    items: list[dict] = []
    for sk in keys:
        payload = _fetch_sport(sk)
        for ev in payload.get("events", []):
            items.append(ev)

    return {
        "items":      items,
        "total":      len(items),
        "sport_keys": keys,
        "available":  any(_cache.get(sk, (0, {}))[1].get("available") for sk in keys),
    }


@router.get("/outrights/{sport_key}")
def get_outright(sport_key: str) -> dict:
    payload = _fetch_sport(sport_key)
    if not payload.get("available") and not payload.get("events"):
        # Still 200 — this is a soft "not available", not an error.
        return payload
    return payload


# ---------------------------------------------------------------------------
# Crown sfs_match outright catalog (RETIRED 2026-05-24).
#
# Briefly exposed via /api/external/sfs/outrights{?lid=} to render Crown's
# full operator-facing outright market list (Top Goalscorer, Group X
# Winner / To Qualify, To Reach Final/Semi/Quarter, per-team Top
# Goalscorer + Stage of Elimination, Winning Group, etc.) under the
# headline /outrights "Winner" card.  Removed because the underlying
# `db_sports.sfs_match` table is a frozen MyISAM dump from March 2026 —
# no current ingest pipeline writes to it (the new `ingest_odds_api.php`
# cron and the WS bridge both only touch `foot_match` + `foot_match_xml`,
# per `.notes/progress.txt`).  Serving those stale prices to bettors
# would invite arbitrage.
#
# The `mysqldb.crown_outrights()` helper is kept dormant: it's pure
# (read-only, in-process cache) and useful as a reference for the data
# shape if we ever wire a live outright feed and want to re-expose the
# catalog.  See git history for the matching frontend components
# (`CrownOutrightCatalogView` / `CrownOutrightSection`
# / `CrownOutrightMarketCard`).
