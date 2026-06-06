"""Goalserve In-Play read endpoints.

Serves the ``/dev/shm/goalserve_live`` snapshots written by
``app.goalserve_inplay`` in the same ``OddsEvent`` / markets shape the H5
frontend already consumes.  Mounted under ``/api/external`` so the routes
are ``/api/external/gs/events`` etc.

Browsers may poll ``/gs/events`` at sub-second cadence — every request is a
cheap local ``/dev/shm`` read; the single upstream Goalserve fetch is owned
by the poller daemon.
"""
from __future__ import annotations

import json
import time
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query, Request

from .. import goalserve_inplay as gs
from .. import goalserve_pregame as gsp

router = APIRouter()


@router.get("/gs/health")
def gs_health(request: Request) -> dict:
    idx_path = gs.GS_LIVE_DIR / "_index.json"
    try:
        with idx_path.open("rb") as fh:
            idx = json.load(fh)
    except (FileNotFoundError, ValueError, OSError):
        idx = None
    age = time.time() - (idx.get("updated_ts") or 0) if idx else None
    # pregame index
    pre = {"ok": False}
    try:
        with (gsp.GS_PREGAME_DIR / "_index.json").open("rb") as fh:
            pidx = json.load(fh)
        page = time.time() - (pidx.get("updated_ts") or 0)
        pre = {"ok": page < 60, "age_sec": round(page, 1), "count": pidx.get("count")}
    except (FileNotFoundError, ValueError, OSError):
        pass
    # WS client status (when wired by lifespan)
    ws_state: dict = {"enabled": False}
    gs_ws = getattr(request.app.state, "gs_ws", None)
    if gs_ws is not None:
        try:
            ws_state = gs_ws.health()
        except Exception as e:  # noqa: BLE001
            ws_state = {"enabled": True, "error": str(e)}
    inplay_ok = (age is not None and age < 30) or bool(ws_state.get("connected"))
    return {
        "ok": inplay_ok,
        "inplay": {
            "updated_ts": (idx or {}).get("updated_ts"),
            "age_sec": round(age, 1) if age is not None else None,
            "count": (idx or {}).get("count"),
            "bm": (idx or {}).get("bm"),
            "source": (idx or {}).get("source"),
            "dir": str(gs.GS_LIVE_DIR),
        },
        "ws": ws_state,
        "pregame": pre,
    }


@router.get("/gs/events")
def gs_events(
    include_finished: bool = Query(False),
    phase: str = Query("all", pattern="^(all|live|pre)$"),
    q: "str | None" = Query(None),
    limit: int = Query(2000, ge=1, le=5000),
) -> dict:
    live = gs.list_events(include_finished=include_finished) if phase in ("all", "live") else []
    pre = gsp.list_events() if phase in ("all", "pre") else []
    # in-play wins over pregame for the same Goalserve id (a match that just
    # kicked off can momentarily exist in both feeds).
    live_ids = {e.get("id") for e in live}
    pre = [e for e in pre if e.get("id") not in live_ids]
    items = live + pre
    if q:
        ql = q.strip().lower()
        items = [
            e for e in items
            if ql in (e.get("home") or "").lower()
            or ql in (e.get("away") or "").lower()
            or ql in (e.get("league_name") or "").lower()
        ]
    return {"total": len(items), "items": items[:limit]}


@router.get("/gs/events/{gid}")
def gs_event(gid: int) -> dict:
    snap = gs.read_event_full(gid) or gsp.read_event_full(gid)
    if not snap:
        raise HTTPException(status_code=404, detail="event not found")
    return {k: v for k, v in snap.items() if not k.startswith("_")}


@router.get("/gs/events/{gid}/markets")
def gs_event_markets(gid: int) -> dict:
    snap = gs.read_event_full(gid) or gsp.read_event_full(gid)
    if not snap:
        raise HTTPException(status_code=404, detail="event not found")
    markets = snap.get("_markets") or []
    bm = snap.get("_bm") or "bet365"
    event = {k: v for k, v in snap.items() if not k.startswith("_")}
    finished = bool(snap.get("is_finished"))
    bookmakers = [] if finished else [{
        "bookmaker": bm,
        "market_count": len(markets),
        "markets": markets,
    }]
    return {
        "event": event,
        "bookmakers": bookmakers,
        "total_markets": 0 if finished else len(markets),
        "source": "finished" if finished else "goalserve_inplay",
    }
