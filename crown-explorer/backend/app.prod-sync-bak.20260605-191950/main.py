"""Crown Explorer — read-only API.

Bound to 127.0.0.1 by default. Do not expose to a network.
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import goalserve_inplay, goalserve_inplay_ws, goalserve_pregame, oddsapi_ws
from .routers import agents, bets, cashflow, external, goalserve, matches, members, messages, outrights, stats

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the odds-api.io WS bridge if a key is configured. The bridge is
    # a singleton — one upstream connection fans out to N browser clients
    # of /api/external/ws (odds-api.io enforces one connection per key).
    bridge = oddsapi_ws.build_from_env()
    app.state.odds_ws = bridge
    if bridge:
        await bridge.start()
    # Goalserve In-Play WS — primary realtime source.  Writes the same
    # /dev/shm/goalserve_live snapshots as the REST poller.
    gs_ws = goalserve_inplay_ws.build_from_env()
    app.state.gs_ws = gs_ws
    if gs_ws:
        await gs_ws.start()
    # Goalserve In-Play REST poller — standby fallback.  Skips upstream
    # fetches while the WS index is fresh.
    gs_poller = goalserve_inplay.build_from_env()
    app.state.gs_poller = gs_poller
    if gs_poller:
        await gs_poller.start()
    # Goalserve Pregame poller — getfeed odds-comparison for not-started
    # matches → /dev/shm/goalserve_pregame.
    gsp_poller = goalserve_pregame.build_from_env()
    app.state.gsp_poller = gsp_poller
    if gsp_poller:
        await gsp_poller.start()
    try:
        yield
    finally:
        if bridge:
            await bridge.stop()
        if gs_ws:
            await gs_ws.stop()
        if gs_poller:
            await gs_poller.stop()
        if gsp_poller:
            await gsp_poller.stop()


app = FastAPI(
    title="Crown Explorer",
    description="Read-only forensic viewer for the db_client snapshot.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url=None,
    redirect_slashes=False,
    lifespan=lifespan,
)

# Next.js dev servers: crown-explorer on :3000, PmPm v3 H5 prototype on :3001.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health() -> dict:
    return {"ok": True, "service": "crown-explorer"}


app.include_router(stats.router, prefix="/api/stats", tags=["stats"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(members.router, prefix="/api/members", tags=["members"])
app.include_router(bets.router, prefix="/api/bets", tags=["bets"])
app.include_router(cashflow.router, prefix="/api/cashflow", tags=["cashflow"])
app.include_router(messages.router, prefix="/api/messages", tags=["messages"])
app.include_router(matches.router, prefix="/api/matches", tags=["matches"])
app.include_router(external.router, prefix="/api/external", tags=["external"])
app.include_router(goalserve.router, prefix="/api/external", tags=["goalserve"])
app.include_router(outrights.router, prefix="/api/external", tags=["outrights"])
