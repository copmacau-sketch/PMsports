"""WebSocket bridge: odds-api.io  →  in-memory pub/sub  →  /api/external/ws.

odds-api.io enforces *one connection per API key* — multiple browser
clients therefore can't each open their own upstream connection. Instead
we:

    1. Open a single persistent connection to ``wss://api.odds-api.io/v3/ws``
       on FastAPI startup and keep it alive (with exp-backoff reconnect).
    2. Fan every upstream message out to a set of in-process subscriber
       queues — one per browser WebSocket client of /api/external/ws.
    3. Persist incoming ``created`` / ``updated`` messages into
       ``oddsapi.sqlite`` so the REST snapshot stays warm even when no
       browser is connected.

Latency budget: upstream → bridge → browser is bounded by a single
asyncio queue hop and one ``websocket.send()`` call, so end-to-end
push latency on the LAN side stays sub-millisecond. The remaining
latency is whatever odds-api.io's edge → our origin RTT happens to be.
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import pathlib
import ssl
import time
import urllib.parse
import urllib.request
from contextlib import suppress
from typing import Iterable

import certifi
import websockets

from . import oddsdb

log = logging.getLogger("oddsapi_ws")

# 2026-05-30: live (滚球) odds source switched from odds-api.io to limitless.
# limitless pushes a firehose of `snapshot` (pre-match) + `tick` (live) frames;
# see limitless_ws_adapter for the wire-shape translation.
UPSTREAM_URL = "wss://limitless.show/ws/quote"

# REST endpoints used only by the startup warmup pass.  The WS feed is
# the long-running source of truth — REST just seeds /dev/shm so the
# WS-only invariant has something to serve immediately after a restart,
# without having to wait for upstream price updates on every event.
REST_API_BASE = "https://api.odds-api.io/v3"
WARMUP_BOOKMAKER = "Bet365"  # matches PHP's fetchOddsApiMarkets() default

# Periodic re-warm interval for live events.  Must be < WS_CACHE_STALE_AFTER_SEC
# (default 120 s in routers/external.py) so the cache mtime never crosses
# the freshness threshold during a normal upstream tick gap.
PERIODIC_REWARM_SEC = int(os.environ.get("ODDSAPI_REWARM_SEC") or 45)

# /dev/shm cache shared with the Crown-Gold PHP api_v2.php — that backend
# reads `/dev/shm/oddsapi_live/{eventId}.json` for the in-play (滚球)
# WS-only invariant.  Both this FastAPI bridge AND a separate Node
# ws-relay used to maintain *competing* upstream connections to
# odds-api.io with the same API key, which forces them to kick each
# other off (per upstream rule "new connection closes older one").
# The Node relay has been disabled; this FastAPI bridge is now the sole
# upstream client and writes the same JSON format the Node relay used to,
# so /h5/sports.html (which goes through PHP) and /sports (which goes
# through this FastAPI process directly) both see consistent data.
WS_SHM_CACHE_DIR = pathlib.Path(os.environ.get("WS_SHM_CACHE_DIR") or "/dev/shm/oddsapi_live")

# Per-event full multi-line market book consumed by FastAPI's /markets endpoint
# (``_load_limitless_markets``) and PHP's ``fetchLimitlessMarkets`` for the
# detail view / place-bet validation. The cron ``ingest_limitless.php``
# rewrites this directory every minute as a freshness backstop, but the WS
# bridge now also writes here on EVERY tick so the file is at most one
# upstream tick (≪1s) stale instead of waiting on cron.
LIMITLESS_MK_DIR = pathlib.Path(os.environ.get("LIMITLESS_MK_DIR") or "/dev/shm/crown_limitless_mk")

# Default subscription strategy.  Pre-2026-05-28 this was a 9-league
# whitelist hard-coded here.  After the registry-driven catalog rollout
# the WS bridge subscribes to the entire football firehose (no
# ``leagues=`` URL parameter) so any league the PHP ingest registers
# with priority<=PRIORITY_WARMUP_THRESHOLD gets in-play push coverage
# automatically — no per-league code change needed.
#
# Legacy behaviour can be restored by setting
# ``ODDSAPI_WS_LEAGUES=england-premier-league,...`` in the environment
# (handled by ``build_from_env``).
DEFAULT_LEAGUES: tuple[str, ...] = ()

# Maximum priority for events seeded via REST warmup.  Going wider than
# major (≤50) on warmup means ~7000+ events × 2 REST hits each at
# startup — plenty to trip rate limits.  WS deltas still cover anything
# upstream actually pushes regardless of this cap; warmup is just for
# pre-match snapshot freshness right after a deploy.
PRIORITY_WARMUP_THRESHOLD = int(os.environ.get("ODDSAPI_WS_WARMUP_PRIORITY") or 50)

# How often the in-play subscription pinner re-queries foot_match for
# the current in-play gid set.  When the set differs from the active
# subscription we close the upstream socket so ``_run_forever`` reopens
# it with the new ``events=`` filter.  60 s matches the live-only ingest
# cron cadence — we never wait more than ~60 s after Crown flips
# status=0→1 to start receiving WS pushes for a newly-live match.
PIN_REFRESH_SEC = int(os.environ.get("ODDSAPI_WS_PIN_SEC") or 60)

# How often the mtime-refresh background task touches /dev/shm files for
# events in the pin set.  Must be < routers/external.py's
# ``WS_CACHE_STALE_AFTER_SEC`` (default 120 s) or low-activity in-play
# matches go stale on the FastAPI /events endpoint while their data is
# still the freshest snapshot we have.  See ``_refresh_pinned_mtimes``.
MTIME_REFRESH_SEC = int(os.environ.get("ODDSAPI_WS_MTIME_REFRESH_SEC") or 60)


class OddsApiWS:
    """Singleton bridge. ``app.state.odds_ws`` should be set to one of these
    on startup. ``await bridge.start()`` kicks off the upstream loop in a
    background task; ``await bridge.stop()`` cancels it gracefully.
    """

    def __init__(
        self,
        api_key: str,
        *,
        leagues: Iterable[str] = DEFAULT_LEAGUES,
        sport: str = "football",
        markets: str | None = None,
        ssl_context: ssl.SSLContext | None = None,
    ) -> None:
        self._api_key = api_key
        self._leagues = list(leagues)
        self._sport = sport
        self._markets = markets
        self._ssl = ssl_context or ssl.create_default_context(cafile=certifi.where())

        # Pub/sub state
        self._subs: set[asyncio.Queue[dict]] = set()
        self._subs_lock = asyncio.Lock()

        # Lifecycle
        self._task: asyncio.Task | None = None
        self._stop = asyncio.Event()

        # Last-seen cursor for resync_required handling
        self._last_seq: int | None = None

        # In-memory accumulator: event_id -> latest merged payload.  We
        # merge every incoming `updated` market by name on top of the
        # previous snapshot so the /dev/shm cache file always carries the
        # most recent value for *every* market we've ever seen, not just
        # the ones that ticked in the latest delta.  Mirrors the Node
        # relay's mergeSnapshot() — keep semantics in lockstep.
        self._snapshots: dict[str, dict] = {}
        # Tracks the disk mtime of LIMITLESS_MK_DIR/<eid>.json at the moment
        # we last wrote it ourselves (or last seeded from it). When the cron
        # ``ingest_limitless.php`` overwrites the file underneath us, the
        # on-disk mtime advances beyond our recorded value, and the next
        # tick re-seeds from disk before merging — otherwise our in-memory
        # accumulator would silently regress the cron's richer snapshot.
        self._snapshot_mtimes: dict[str, float] = {}

        # In-play subscription pinning state.  ``_desired_events`` is the
        # gid set the pinner wants subscribed; ``_active_events`` is what
        # the currently-open WS connection actually subscribed to.  When
        # they differ the pinner closes ``_current_ws`` so the
        # ``_run_forever`` loop reopens the connection with a fresh URL
        # built from the new desired set.  Empty desired set ⇒ fall back
        # to the legacy ``leagues=`` / firehose path so the bridge stays
        # connected at all times (pre-match price ticks still flow into
        # /dev/shm for the major-league warmup pool).
        self._desired_events: tuple[str, ...] = ()
        self._active_events: tuple[str, ...] = ()
        self._current_ws: websockets.WebSocketClientProtocol | None = None

        # Bookkeeping for the /api/external/ws/status endpoint
        self.connected: bool = False
        self.reconnects: int = 0
        self.messages_received: int = 0
        self.messages_dispatched: int = 0
        self.last_message_at: float | None = None

    # ---- lifecycle -------------------------------------------------------

    async def start(self) -> None:
        if self._task and not self._task.done():
            return
        self._stop.clear()
        # Ensure the /dev/shm cache dir exists before the first message
        # lands — so PHP doesn't 404 the very first /events/{id}/markets
        # call after a fresh deploy.
        _ensure_shm_cache_dir()
        # Populate the initial in-play pin set BEFORE opening the WS
        # connection so the very first subscribe URL already targets
        # foot_match's current in-play gids.  Without this we'd burst-
        # subscribe to whatever the legacy fallback chooses (firehose),
        # then reconnect ~PIN_REFRESH_SEC later — wasted upstream RTT
        # plus a brief window where lower-tier matches get no pushes.
        # 2026-05-30 limitless cutover: the odds-api.io REST warmup /
        # periodic-rewarm / in-play `events=` pin tasks below all hit
        # odds-api.io endpoints that no longer apply.  limitless instead
        # pushes a single firehose of `snapshot` (pre-match) + `tick`
        # (live) frames covering every event, so we keep ONE persistent
        # connection with no `events=` filter and let the adapter fan
        # each frame into /dev/shm.  The disabled tasks are retained
        # (commented) so the odds-api.io path can be restored quickly.
        # asyncio.create_task(self._warmup_from_rest(), name="oddsapi-ws-warmup")
        # asyncio.create_task(self._periodic_rewarm(), name="oddsapi-ws-rewarm")
        # asyncio.create_task(self._subscription_pinner(), name="oddsapi-ws-pinner")
        # Cache mtime refresher — keeps FastAPI's WS_CACHE_STALE_AFTER_SEC
        # check happy for events that aren't ticking right now but are
        # still actively subscribed.  See _refresh_pinned_mtimes.
        asyncio.create_task(self._refresh_pinned_mtimes(), name="oddsapi-ws-mtime")
        self._task = asyncio.create_task(self._run_forever(), name="oddsapi-ws-bridge")
        if self._desired_events:
            log.info(
                "oddsapi-ws bridge starting (in-play pin events=%d)",
                len(self._desired_events),
            )
        elif self._leagues:
            log.info("oddsapi-ws bridge starting (leagues=%s)", ",".join(self._leagues))
        else:
            log.info("oddsapi-ws bridge starting (full firehose, warmup priority<=%d)",
                     PRIORITY_WARMUP_THRESHOLD)

    async def stop(self) -> None:
        self._stop.set()
        if self._task:
            self._task.cancel()
            with suppress(asyncio.CancelledError):
                await self._task
            self._task = None
        log.info("oddsapi-ws bridge stopped")

    # ---- subscriber API --------------------------------------------------

    async def subscribe(self) -> asyncio.Queue[dict]:
        """Get a fresh queue that will receive every upstream message.

        Each browser WebSocket gets its own queue so a slow client can't
        block the broadcast — its queue just fills up and we drop oldest.
        """
        q: asyncio.Queue[dict] = asyncio.Queue(maxsize=512)
        async with self._subs_lock:
            self._subs.add(q)
        return q

    async def unsubscribe(self, q: asyncio.Queue[dict]) -> None:
        async with self._subs_lock:
            self._subs.discard(q)

    def _warmup_targets(self) -> list[str]:
        """Slug list to seed via REST.  Filters by priority so the
        startup warmup doesn't fire ~7000 events × 2 REST hits each
        against odds-api.io (rate-limit territory).  Falls back to
        ``self._leagues`` when the registry is unreachable.
        """
        if self._leagues:
            return list(self._leagues)
        try:
            from . import mysqldb
            return [
                r["slug"]
                for r in mysqldb.registry_rows()
                if int(r.get("priority") or 100) <= PRIORITY_WARMUP_THRESHOLD
            ]
        except Exception as e:                                          # noqa: BLE001
            log.warning("warmup target lookup failed (registry unreachable?): %s", e)
            return []

    # ---- internals -------------------------------------------------------

    def _build_url(self) -> str:
        # limitless /ws/quote firehose: no auth/filter params needed — it
        # streams snapshot + live ticks for all events on the bare URL.
        # (An optional `?events=<id,...>` filter exists but yields only a
        # one-shot `update` frame, not the continuous tick stream we want.)
        self._active_events = ()
        return UPSTREAM_URL

    async def _run_forever(self) -> None:
        backoff = 1.0
        while not self._stop.is_set():
            try:
                await self._run_once()
                # Clean exit (server closed) — small fixed delay, then retry.
                backoff = 1.0
            except asyncio.CancelledError:
                raise
            except Exception as e:                                  # noqa: BLE001
                log.warning("oddsapi-ws upstream error: %s", e)
            self.connected = False
            self.reconnects += 1
            # Exp backoff capped at 60s so we don't hammer odds-api.io.
            await self._sleep_or_stop(backoff)
            backoff = min(backoff * 1.7, 60.0)

    async def _sleep_or_stop(self, seconds: float) -> None:
        try:
            await asyncio.wait_for(self._stop.wait(), timeout=seconds)
        except asyncio.TimeoutError:
            pass

    async def _run_once(self) -> None:
        url = self._build_url()
        if self._active_events:
            log.info(
                "oddsapi-ws connecting (events pin=%d%s)",
                len(self._active_events),
                f", resume seq={self._last_seq}" if self._last_seq is not None else "",
            )
        else:
            log.info("oddsapi-ws connecting%s",
                     f" (resume seq={self._last_seq})" if self._last_seq is not None else "")
        async with websockets.connect(
            url,
            ssl=self._ssl,
            ping_interval=20,
            ping_timeout=20,
            max_size=2 ** 20,  # 1 MiB — odds payloads stay well below
        ) as ws:
            self.connected = True
            self._current_ws = ws
            log.info("oddsapi-ws connected (ws layer up)")
            try:
                async for raw in ws:
                    if self._stop.is_set():
                        break
                    self.messages_received += 1
                    self.last_message_at = time.time()
                    try:
                        msg = json.loads(raw)
                    except (TypeError, ValueError):
                        log.debug("non-JSON upstream frame, dropping")
                        continue
                    try:
                        await self._handle(msg)
                    except Exception as e:
                        # A malformed frame must never break the read loop —
                        # that would force a reconnect and leave /dev/shm
                        # stale.  Drop the bad frame and keep consuming.
                        log.warning("oddsapi-ws frame handler error (dropped): %s", e)
                        continue
            finally:
                self._current_ws = None

    async def _handle(self, msg: dict) -> None:
        # ── limitless /ws/quote handler ──
        # Frame types: 'snapshot' (initial full book), 'tick'/'update'
        # (live deltas), 'heartbeat' (ignore).  Each carries data.markets
        # keyed by an internal id; the adapter regroups by Crown oddsId
        # and re-keys into the odds-api.io row dialect that _merge_snapshot
        # + _write_shm_cache already understand.
        mtype = msg.get("type")
        if mtype in ("snapshot", "tick", "update"):
            data = msg.get("data") or {}
            limitless_markets = data.get("markets") or {}
            if not limitless_markets:
                return
            from .limitless_ws_adapter import translate_limitless_ws_to_oddsapi
            crown_msgs = translate_limitless_ws_to_oddsapi(limitless_markets)
            for crown_msg in crown_msgs:
                eid = crown_msg["id"]
                # (Re-)seed in-memory snapshot from disk when:
                #   a) this is the first tick we've seen for this event in
                #      the current process, OR
                #   b) the cron rewrote LIMITLESS_MK_DIR/<eid>.json after
                #      our last write — bumping disk mtime past our
                #      recorded mtime. Without this, the next tick would
                #      use stale in-memory state and silently regress the
                #      cron's richer snapshot.
                seed_path = LIMITLESS_MK_DIR / f"{eid}.json"
                disk_mtime = 0.0
                try:
                    disk_mtime = seed_path.stat().st_mtime
                except OSError:
                    pass
                last_local = self._snapshot_mtimes.get(eid, 0.0)
                if eid not in self._snapshots or disk_mtime > last_local + 0.1:
                    seeded = _seed_snapshot_from_disk(eid)
                    if seeded is not None:
                        self._snapshots[eid] = seeded
                        self._snapshot_mtimes[eid] = disk_mtime or time.time()
                    elif eid not in self._snapshots:
                        self._snapshots[eid] = {}
                merged = _merge_snapshot(self._snapshots.get(eid) or None, crown_msg)
                self._snapshots[eid] = merged
                # Two writes per tick — small (<10kB), tmpfs-backed, atomic
                # rename so the readers see either old or new, never partial:
                #   1. /dev/shm/oddsapi_live/<eid>.json — list-view main_odds
                #   2. /dev/shm/crown_limitless_mk/<eid>.json — detail-view
                #      full multi-line market book. Bypasses the per-minute
                #      ingest_limitless.php cron so the detail page and
                #      place-bet validator see the same sub-second price the
                #      WS subscribers do.
                await asyncio.to_thread(_write_shm_cache, eid, merged)
                await asyncio.to_thread(_write_limitless_mk, eid, merged)
                try:
                    self._snapshot_mtimes[eid] = seed_path.stat().st_mtime
                except OSError:
                    self._snapshot_mtimes[eid] = time.time()
                if not self._subs:
                    continue
                async with self._subs_lock:
                    subs = list(self._subs)
                for q in subs:
                    if q.full():
                        with suppress(asyncio.QueueEmpty):
                            q.get_nowait()
                    with suppress(asyncio.QueueFull):
                        q.put_nowait(merged)
                        self.messages_dispatched += 1
            return
        # heartbeat / unknown frame types: nothing to do.
        return

    async def _handle_oddsapi_legacy(self, msg: dict) -> None:
        # Retained (dead) for quick rollback to the odds-api.io feed.
        mtype = msg.get("type")
        if mtype == "welcome":
            log.info("oddsapi-ws welcome: filter=%s", msg.get("status_filter"))
        elif mtype == "resync_required":
            # Upstream tells us our resume cursor (``lastSeq``) is too old
            # — typical reason: ``replay_limit_exceeded`` after a long-idle
            # reconnect.  Pre-2026-05-28 we'd react by wiping /dev/shm and
            # ``_snapshots`` so the cache couldn't serve stale data.  That
            # made sense with the firehose subscription (anything we cared
            # about would re-tick within seconds) but with the in-play
            # ``events=`` pin filter many low-activity matches go 5-10+
            # minutes between ticks — so wiping the cache leaves the
            # H5 frontend rendering "🔒 滚球盘口暂未推送" for already-
            # in-play events until the upstream gets around to a tick.
            #
            # New strategy: keep what we have (it's the freshest snapshot
            # we know about), reset ``_last_seq`` so the next reconnect
            # doesn't loop the same replay-too-old failure, and kick off
            # a REST re-seed of the pinned set so any events that DID get
            # wiped pre-fix repopulate within ~5 s.
            log.warning(
                "oddsapi-ws resync_required: %s — keeping cache, re-seeding %d pinned events",
                msg.get("reason"),
                len(self._desired_events),
            )
            self._last_seq = None
            if self._desired_events:
                asyncio.create_task(
                    self._warmup_event_ids(list(self._desired_events), force=True),
                    name="oddsapi-ws-resync-warmup",
                )
            return  # don't fan-out resync messages

        seq = msg.get("seq")
        if isinstance(seq, int):
            self._last_seq = seq

        # `deleted` / `no_markets` — drop the cached snapshot so PHP's
        # WS-only invariant flips that row to "盘口暂未开放".
        if mtype in {"deleted", "no_markets"}:
            eid = str(msg.get("id") or "")
            if eid:
                self._snapshots.pop(eid, None)
                await asyncio.to_thread(_remove_shm_cache, eid)

        # Persist deltas to /dev/shm/oddsapi_live (PHP + FastAPI in-play
        # source of truth).  As of 2026-05-24 the oddsapi.sqlite write
        # path is *disabled* — no router or PHP page reads from that DB
        # anymore (verified by grep across the codebase + comment at the
        # top of routers/external.py), so the writes were pure dead
        # weight + occasional lock contention with the now-broken cron
        # ingest.  Re-enable by uncommenting the `_persist_delta` call
        # below if the SQLite path needs to come back as a fallback.
        if mtype in {"updated", "created"}:
            eid = str(msg.get("id") or "")
            if eid:
                merged = _merge_snapshot(self._snapshots.get(eid), msg)
                self._snapshots[eid] = merged
                # Run in a thread so the asyncio loop never blocks on
                # disk I/O — keeps the upstream → fanout latency at
                # sub-millisecond as advertised in the module docstring.
                await asyncio.to_thread(_write_shm_cache, eid, merged)
            # ── dead-code: SQLite snapshot writer ──
            # try:
            #     await asyncio.to_thread(_persist_delta, msg)
            # except Exception as e:                                # noqa: BLE001
            #     log.warning("persist delta failed: %s", e)

        # Fan-out to subscribers (best-effort; drop oldest on overflow).
        if not self._subs:
            return
        async with self._subs_lock:
            subs = list(self._subs)
        for q in subs:
            if q.full():
                with suppress(asyncio.QueueEmpty):
                    q.get_nowait()
            with suppress(asyncio.QueueFull):
                q.put_nowait(msg)
                self.messages_dispatched += 1

    # ---- REST warmup -----------------------------------------------------

    async def _warmup_from_rest(self) -> None:
        """Seed /dev/shm with the current REST snapshot for every league.

        odds-api.io's WS only pushes deltas — events whose prices aren't
        changing right now won't generate a snapshot for hours.  After a
        FastAPI restart that leaves /dev/shm largely empty, which means
        PHP's WS-only invariant (`extractMainOddsFromWsCache`) returns
        null and the H5 frontend shows "盘口暂未开放" even for events
        that DO have stable upstream prices.

        The warmup pulls /v3/events for each league, then /v3/odds for
        each event, and feeds the response through the same
        ``_merge_snapshot`` / ``_write_shm_cache`` pipeline as live WS
        messages.  Future WS deltas merge on top of this seed.

        Total work is ~8 leagues × ~10 events × 2 HTTP calls = ~160
        REST hits per startup.  Done in background so the WS loop isn't
        blocked.
        """
        # Give the WS loop a couple of seconds to land its first batch of
        # `created` messages — that way we don't redundantly warmup events
        # the WS already covered with a fresher payload.
        await self._sleep_or_stop(2.0)

        total_events = 0
        total_seeded = 0
        targets = self._warmup_targets()
        log.info("oddsapi-ws warmup: %d target leagues", len(targets))
        for league in targets:
            if self._stop.is_set():
                break
            try:
                events = await asyncio.to_thread(
                    _rest_events, self._api_key, self._sport, league
                )
            except Exception as e:  # noqa: BLE001
                log.warning("warmup: list events failed league=%s: %s", league, e)
                continue
            total_events += len(events)
            for ev in events:
                if self._stop.is_set():
                    break
                eid = str(ev.get("id") or "")
                if not eid:
                    continue
                # Skip events the WS already pushed — its delta is newer
                # than anything we'd pull from REST right now.
                if eid in self._snapshots:
                    continue
                try:
                    odds = await asyncio.to_thread(
                        _rest_event_odds, self._api_key, eid, WARMUP_BOOKMAKER
                    )
                except Exception as e:  # noqa: BLE001
                    log.debug("warmup: odds failed eid=%s: %s", eid, e)
                    continue
                if not odds:
                    continue
                bookmakers = odds.get("bookmakers") or {}
                for bookie, markets in bookmakers.items():
                    if not isinstance(markets, list) or not markets:
                        continue
                    # Synthesize a WS-shaped payload.  Tag with type
                    # 'warmup' so _persist_delta could skip it later if
                    # desired (currently it accepts updated/created only
                    # and our type=warmup is ignored — exactly what we
                    # want; sqlite is populated by the ingest cron).
                    msg = {
                        "type":    "warmup",
                        "id":      eid,
                        "bookie":  bookie,
                        "markets": markets,
                    }
                    merged = _merge_snapshot(self._snapshots.get(eid), msg)
                    self._snapshots[eid] = merged
                    await asyncio.to_thread(_write_shm_cache, eid, merged)
                    total_seeded += 1
                # Gentle pacing so we don't trip odds-api.io rate limits.
                await asyncio.sleep(0.05)
        log.info(
            "oddsapi-ws warmup done: events=%d seeded=%d",
            total_events, total_seeded
        )

    async def _periodic_rewarm(self) -> None:
        """Re-fetch REST snapshots for events that are currently live upstream.

        The WS feed only pushes price *deltas* — for matches where the
        upstream price hasn't ticked for a few minutes (typical on lower
        leagues or sleepy in-play moments), the cache mtime drifts past
        WS_CACHE_STALE_AFTER_SEC (120 s) and ``_read_shm_cache`` starts
        returning None.  The frontend then renders "滚球盘口暂未推送"
        for an event that does in fact have valid (if static) upstream
        prices.

        This loop wakes every ``PERIODIC_REWARM_SEC`` seconds, asks
        ``/v3/events`` for the current live event list per league, and
        re-pulls ``/v3/odds`` for any event that's gone stale.  Same
        write path as the startup warmup — the WS delta handler keeps
        merging on top, so this task only fires the REST fallback when
        WS hasn't.
        """
        # Stagger initial run so we don't slam REST right after warmup.
        await self._sleep_or_stop(PERIODIC_REWARM_SEC)
        while not self._stop.is_set():
            stale_threshold = time.time() - max(1, PERIODIC_REWARM_SEC - 5)
            refreshed = 0
            targets = self._warmup_targets()
            for league in targets:
                if self._stop.is_set():
                    break
                try:
                    events = await asyncio.to_thread(
                        _rest_events, self._api_key, self._sport, league
                    )
                except Exception as e:  # noqa: BLE001
                    log.debug("rewarm: list events failed league=%s: %s", league, e)
                    continue
                for ev in events:
                    if self._stop.is_set():
                        break
                    if (ev.get("status") or "").lower() not in ("live", "inplay"):
                        continue
                    eid = str(ev.get("id") or "")
                    if not eid:
                        continue
                    # Skip events whose cache file is already fresh — the WS
                    # delta path covered them recently and a REST hit would
                    # just waste an upstream call.
                    f = WS_SHM_CACHE_DIR / f"{eid}.json"
                    try:
                        mtime = f.stat().st_mtime
                    except OSError:
                        mtime = 0.0
                    if mtime > stale_threshold:
                        continue
                    try:
                        odds = await asyncio.to_thread(
                            _rest_event_odds, self._api_key, eid, WARMUP_BOOKMAKER
                        )
                    except Exception as e:  # noqa: BLE001
                        log.debug("rewarm: odds failed eid=%s: %s", eid, e)
                        continue
                    if not odds:
                        continue
                    bookmakers = odds.get("bookmakers") or {}
                    for bookie, markets in bookmakers.items():
                        if not isinstance(markets, list) or not markets:
                            continue
                        msg = {
                            "type":    "rewarm",
                            "id":      eid,
                            "bookie":  bookie,
                            "markets": markets,
                        }
                        merged = _merge_snapshot(self._snapshots.get(eid), msg)
                        self._snapshots[eid] = merged
                        await asyncio.to_thread(_write_shm_cache, eid, merged)
                        refreshed += 1
                    await asyncio.sleep(0.05)
            if refreshed:
                log.info("oddsapi-ws periodic rewarm refreshed=%d", refreshed)
            await self._sleep_or_stop(PERIODIC_REWARM_SEC)

    # ---- in-play subscription pinner -------------------------------------

    async def _subscription_pinner(self) -> None:
        """Re-query foot_match every ``PIN_REFRESH_SEC`` for the current
        in-play gid set and force a reconnect when it differs from the
        currently-active subscription.

        Why this exists
        ---------------
        odds-api.io's ``events=`` filter is the only reliable way to make
        the WS push deltas for *every* in-play match — the firehose
        default concentrates on major-bookie events (~25 globally at any
        moment).  Without the pin, lower-tier in-play matches (Iraqi
        League / Iceland 1.deild / Italy Serie C playoffs / etc.) never
        receive a single ``updated`` frame, so the H5 frontend renders
        "🔒 滚球盘口暂未推送" forever.  We close ``_current_ws`` to
        trigger ``_run_forever``'s reconnect path; the next ``_run_once``
        rebuilds the URL with the updated ``_desired_events`` snapshot.

        Edge cases handled
        ------------------
        * Empty in-play set (off-peak hours)  → keep current subscription
          (don't reconnect just to subscribe to nothing — that would
          force the legacy leagues= / firehose fallback for no benefit).
        * Newly-pinned events                  → spawn a one-shot REST
          warmup so /dev/shm has data the moment the H5 frontend asks,
          instead of waiting 30-60 s for the first upstream tick.
        * Removed events (settled / cancelled) → drop their cached
          snapshots so memory doesn't grow without bound across
          long-running daemon uptime.
        """
        # Stagger the first pinner tick so we let the warmup pass land
        # its initial REST seed before reconnecting on a different URL.
        await self._sleep_or_stop(PIN_REFRESH_SEC)
        while not self._stop.is_set():
            try:
                from . import mysqldb
                eids = await asyncio.to_thread(mysqldb.in_play_event_ids)
                new_set = tuple(sorted(set(eids)))
            except Exception as e:                                  # noqa: BLE001
                log.warning("oddsapi-ws pinner query failed: %s", e)
                await self._sleep_or_stop(PIN_REFRESH_SEC)
                continue

            if not new_set:
                # Off-peak / DB blip — leave current subscription alone.
                # If it's already empty we stay on legacy fallback; if
                # it's non-empty we keep serving the last in-play set
                # until something interesting comes back.
                await self._sleep_or_stop(PIN_REFRESH_SEC)
                continue

            if new_set != self._desired_events:
                old_set = set(self._desired_events)
                added = sorted(set(new_set) - old_set)
                removed = sorted(old_set - set(new_set))
                self._desired_events = new_set
                log.info(
                    "oddsapi-ws pin set changed: total=%d added=%d removed=%d",
                    len(new_set), len(added), len(removed),
                )
                # Drop stale snapshots so we don't leak memory across
                # long uptime (matches that finished hours ago).
                for eid in removed:
                    self._snapshots.pop(eid, None)
                # Subscription scope is about to change — the sequence
                # cursor from the previous scope is meaningless to the
                # new one.  Clearing it prevents upstream from rejecting
                # the reconnect with ``replay_limit_exceeded`` (which
                # used to trigger a /dev/shm wipe and several minutes of
                # blank H5 odds for low-activity matches).
                self._last_seq = None
                # Trigger reconnect — closing the live websocket makes
                # ``async for raw in ws`` exit cleanly and ``_run_forever``
                # immediately re-enters _run_once with the new URL.
                if self._current_ws is not None:
                    with suppress(Exception):
                        await self._current_ws.close()
                # Seed /dev/shm for newly-added events via REST so PHP
                # has data ready before the first WS delta arrives.
                # ``force=True`` ensures we re-pull even if a stale
                # snapshot from a previous in-play session still lives
                # in ``_snapshots`` (rare but possible if a gid drops
                # out of the pin set and comes back).
                if added:
                    asyncio.create_task(
                        self._warmup_event_ids(added, force=True),
                        name=f"oddsapi-ws-pin-warmup-{int(time.time())}",
                    )
            await self._sleep_or_stop(PIN_REFRESH_SEC)

    async def _warmup_event_ids(self, eids: list[str], *, force: bool = False) -> None:
        """REST-pull /v3/odds for each pinned event id.

        Default (``force=False``) skips events whose in-memory snapshot
        already exists — the live WS delta path is fresher than anything
        REST would return.  Called from the pinner on newly-added gids.

        ``force=True`` ignores the snapshot check and re-pulls every
        eid.  Used on ``resync_required`` (to re-seed events that may
        have lost their disk cache pre-2026-05-28) and at startup.
        Without this seed, the H5 frontend would render
        "盘口暂未推送" for the event until the upstream WS happens to
        emit its next tick (typically 30-90 s of dead air for lower-
        tier matches; up to several minutes for off-peak hours).
        """
        seeded = 0
        skipped_recent = 0
        for eid in eids:
            if self._stop.is_set():
                break
            # If WS already pushed a snapshot for this eid, skip — the
            # delta is fresher than anything we'd pull from REST right now.
            if not force and eid in self._snapshots:
                skipped_recent += 1
                continue
            try:
                odds = await asyncio.to_thread(
                    _rest_event_odds, self._api_key, eid, WARMUP_BOOKMAKER
                )
            except Exception as e:                                  # noqa: BLE001
                log.debug("pin warmup: odds failed eid=%s: %s", eid, e)
                continue
            if not odds:
                continue
            bookmakers = odds.get("bookmakers") or {}
            for bookie, markets in bookmakers.items():
                if not isinstance(markets, list) or not markets:
                    continue
                msg = {
                    "type":    "warmup",
                    "id":      eid,
                    "bookie":  bookie,
                    "markets": markets,
                }
                merged = _merge_snapshot(self._snapshots.get(eid), msg)
                self._snapshots[eid] = merged
                await asyncio.to_thread(_write_shm_cache, eid, merged)
                seeded += 1
            # Gentle pacing so a burst of 50+ added events doesn't trip
            # odds-api.io rate limits.
            await asyncio.sleep(0.1)
        if seeded or skipped_recent:
            log.info(
                "oddsapi-ws pin warmup: seeded=%d skipped(ws-fresh)=%d",
                seeded, skipped_recent,
            )

    # ---- cache-mtime keepalive -------------------------------------------

    async def _refresh_pinned_mtimes(self) -> None:
        """Bump the mtime of every pinned event's /dev/shm cache file.

        Why this exists
        ---------------
        ``routers/external.py:_read_shm_cache`` treats cache files older
        than ``WS_CACHE_STALE_AFTER_SEC`` (default 120 s) as stale and
        returns ``None``, which makes the FastAPI ``/api/external/events``
        handler emit ``main_odds=null`` → H5 frontend renders
        "🔒 滚球盘口暂未推送".

        Lower-tier in-play matches (USL2, Iceland 1.deild, Brazil women
        copas, etc.) genuinely don't get upstream price ticks more than
        once every few minutes — so their cache mtime drifts past 120 s
        while the on-disk data IS still the freshest snapshot available.

        Since we hold an active ``events=`` subscription for every gid in
        ``_desired_events``, "no recent tick" semantically means "no new
        price upstream" (not "we lost the feed").  Bumping the mtime is
        therefore a correct way to signal "we've verified this is still
        the latest" — no upstream RTT or REST quota cost.

        Safety guards
        -------------
        * Skip if ``self.connected is False`` — WS layer down, we can't
          truthfully claim the snapshot is fresh.
        * Skip if no message received in the last 5 minutes — defensive
          against a silently-broken socket that hasn't tripped our
          reconnect path yet.
        """
        # Stagger initial run so we don't race the startup REST warmup.
        await self._sleep_or_stop(MTIME_REFRESH_SEC)
        while not self._stop.is_set():
            now = time.time()
            ok_to_bump = (
                self.connected
                and self.last_message_at is not None
                and (now - self.last_message_at) <= 300
            )
            if ok_to_bump and self._desired_events:
                bumped = await asyncio.to_thread(
                    _touch_pinned_files, tuple(self._desired_events)
                )
                if bumped:
                    log.debug("oddsapi-ws bumped mtime for %d pinned files", bumped)
            await self._sleep_or_stop(MTIME_REFRESH_SEC)


# ---------------------------------------------------------------------------
# /dev/shm cache helpers — written in worker threads so the asyncio loop
# never blocks on disk I/O.  All three are no-ops on permission errors so
# a misconfigured CACHE_DIR doesn't crash the bridge.

def _ensure_shm_cache_dir() -> None:
    """Create WS_SHM_CACHE_DIR if it isn't already there.  Safe to call
    on every write — observed in production that the dir can be wiped
    out from under us between ws-relay restarts.
    """
    try:
        WS_SHM_CACHE_DIR.mkdir(parents=True, exist_ok=True, mode=0o775)
    except OSError as e:
        log.warning("shm cache mkdir failed: %s", e)


_MULTILINE_NAMES = frozenset({
    "Spread", "Totals",
    "Spread HT", "Totals HT",
    "Corners Spread", "Corners Totals",
})


def _merge_snapshot(prev: dict | None, nxt: dict) -> dict:
    """Merge `nxt`'s markets into `prev` by market name.

    odds-api.io's WS sends only the markets that *changed* in each
    `updated` message.  PHP's `wsCacheToBookmakers()` projects the
    cached payload directly into the bookmakers list it returns, so if
    we wrote only the changed markets we'd lose unchanged ones on the
    next tick.  Accumulate by name; latest write wins.

    For multi-line markets (Spread / Totals / Spread HT / Totals HT /
    Corners Spread / Corners Totals) limitless ticks each handicap line
    separately, so we deep-merge the `odds` rows by ``hdp``: prior lines
    are preserved when not ticked, and ticked lines overwrite their
    same-hdp predecessor.  Without this, the detail-view loses every
    alternative Asian-handicap / over-under line the instant a single line
    re-prices.
    """
    if prev is None:
        # First time we see this event — clone enough so callers can't
        # mutate our internal copy.
        markets = list(nxt.get("markets") or [])
        out = dict(nxt)
        out["markets"] = markets
        return out
    by_name: dict[str, dict] = {}
    for m in (prev.get("markets") or []):
        if isinstance(m, dict) and m.get("name"):
            by_name[m["name"]] = m
    for m in (nxt.get("markets") or []):
        if not (isinstance(m, dict) and m.get("name")):
            continue
        name = m["name"]
        if name in _MULTILINE_NAMES and name in by_name:
            prev_rows = list(by_name[name].get("odds") or [])
            new_rows = list(m.get("odds") or [])
            seen_hdp: dict = {}
            merged_rows: list = []
            # New rows first so they take priority for same-hdp lines.
            for row in new_rows:
                if isinstance(row, dict):
                    seen_hdp[row.get("hdp")] = True
                    merged_rows.append(row)
            for row in prev_rows:
                if isinstance(row, dict) and row.get("hdp") not in seen_hdp:
                    merged_rows.append(row)
            by_name[name] = {"name": name, "odds": merged_rows}
        else:
            by_name[name] = m
    out = {**prev, **nxt}
    out["markets"] = list(by_name.values())
    return out


def _write_shm_cache(eid: str, msg: dict) -> None:
    """Atomically write the merged snapshot to /dev/shm.  PHP picks up
    the file via `wsCacheToBookmakers($gid)` for in-play markets.
    """
    if not eid:
        return
    target = WS_SHM_CACHE_DIR / f"{eid}.json"
    tmp = target.with_suffix(f".json.tmp.{os.getpid()}")
    payload = json.dumps(msg, ensure_ascii=False)
    for attempt in range(2):
        try:
            tmp.write_text(payload, encoding="utf-8")
            tmp.replace(target)
            return
        except FileNotFoundError:
            with suppress(Exception):
                tmp.unlink()
            if attempt == 0:
                _ensure_shm_cache_dir()
                continue
            log.warning("shm cache write failed (FNF) for %s", eid)
            return
        except OSError as e:
            with suppress(Exception):
                tmp.unlink()
            log.warning("shm cache write failed for %s: %s", eid, e)
            return


def _remove_shm_cache(eid: str) -> None:
    """Drop a cache file (event marked deleted / no_markets upstream)."""
    if not eid:
        return
    with suppress(FileNotFoundError, OSError):
        (WS_SHM_CACHE_DIR / f"{eid}.json").unlink()


def _ensure_limitless_mk_dir() -> None:
    """Create LIMITLESS_MK_DIR if missing.  tmpfs is wiped on reboot so this
    can be called cheaply on every write."""
    try:
        LIMITLESS_MK_DIR.mkdir(parents=True, exist_ok=True, mode=0o775)
    except OSError as e:
        log.warning("limitless mk mkdir failed: %s", e)


def _seed_snapshot_from_disk(eid: str) -> dict | None:
    """Re-hydrate ``self._snapshots[eid]`` from the on-disk full-book file
    so the very first tick after a process restart doesn't clobber the
    cron-built multi-line market book with a single-market delta.

    Returns the in-memory snapshot shape (``{"id", "markets": [...]}``)
    expected by ``_merge_snapshot`` / ``_write_*``.  Returns ``None`` when
    the disk file is missing or unreadable; the caller treats that as a
    cold start (no prior state) and merges from the tick alone.
    """
    if not eid:
        return None
    f = LIMITLESS_MK_DIR / f"{eid}.json"
    try:
        raw = f.read_text(encoding="utf-8")
    except (OSError, FileNotFoundError):
        return None
    try:
        data = json.loads(raw)
    except ValueError:
        return None
    if not isinstance(data, dict):
        return None
    books = data.get("bookmakers") or {}
    markets = books.get("Bet365")
    if markets is None:
        # cron file format: bookmakers may have a single key with any name.
        for v in books.values():
            if isinstance(v, list):
                markets = v
                break
    if not isinstance(markets, list) or not markets:
        return None
    return {
        "type":    "snapshot",
        "id":      eid,
        "bookie":  "Bet365 (no latency)",
        "markets": markets,
    }


# Cached www-data uid/gid lookup; -1 means "couldn't resolve, skip chown".
# We resolve once per process to avoid hitting nss on every WS tick.
_WWW_DATA_UID: int = -1
_WWW_DATA_GID: int = -1


def _resolve_www_data_ids() -> None:
    """Populate ``_WWW_DATA_UID`` / ``_WWW_DATA_GID`` once. Failure is fatal
    only for the chown step (caller falls back to a chmod-only relax)."""
    global _WWW_DATA_UID, _WWW_DATA_GID
    if _WWW_DATA_UID != -1:
        return
    try:
        import pwd
        import grp
        _WWW_DATA_UID = pwd.getpwnam("www-data").pw_uid
        _WWW_DATA_GID = grp.getgrnam("www-data").gr_gid
    except (KeyError, ImportError):
        _WWW_DATA_UID = -2  # explicit "looked up and missing"
        _WWW_DATA_GID = -2


def _chown_to_www_data(p: pathlib.Path) -> None:
    """Best-effort: chown ``p`` to www-data:www-data and chmod 0o664 so the
    PHP cron (running as www-data) can later overwrite it. Non-fatal — when
    we're not running as root or www-data doesn't exist, we silently widen
    the mode bits to 0o666 instead so the cron can still rewrite via the
    group/other write bit on the parent dir.
    """
    _resolve_www_data_ids()
    with suppress(Exception):
        if _WWW_DATA_UID >= 0:
            os.chown(p, _WWW_DATA_UID, _WWW_DATA_GID)
            os.chmod(p, 0o664)
        else:
            # Fallback: world-writable so the cron can overwrite even
            # without ownership match.  /dev/shm is local-only so the
            # security exposure is minimal.
            os.chmod(p, 0o666)


def _write_limitless_mk(eid: str, msg: dict) -> None:
    """Atomically write the merged snapshot in ``LIMITLESS_MK_DIR/<eid>.json``
    using the ``{"bookmakers": {"Bet365": [markets...]}}`` shape expected by
    ``_load_limitless_markets`` and PHP ``fetchLimitlessMarkets``.

    This makes the detail-view multi-line market book sub-second fresh: every
    upstream tick rewrites this file instead of waiting on the per-minute
    ingest_limitless.php cron.
    """
    if not eid:
        return
    markets = msg.get("markets") or []
    payload = {
        "bookmakers": {"Bet365": markets},
        "ts": int(time.time()),
    }
    target = LIMITLESS_MK_DIR / f"{eid}.json"
    tmp = target.with_suffix(f".json.tmp.{os.getpid()}")
    blob = json.dumps(payload, ensure_ascii=False)
    for attempt in range(2):
        try:
            tmp.write_text(blob, encoding="utf-8")
            tmp.replace(target)
            # Make the file overwriteable by the PHP cron's www-data process.
            # Without this, FastAPI (running as root) leaves files owned by
            # root with mode 0644, so the per-minute ingest_limitless.php cron
            # silently fails to refresh them (file_put_contents returns false
            # on permission denied).  Result: cache ages out across the entire
            # subscription set, and api_v2.php sees stale prices.  See
            # progress.txt 2026-05-30 entry for the diagnosis trail.
            _chown_to_www_data(target)
            return
        except FileNotFoundError:
            with suppress(Exception):
                tmp.unlink()
            if attempt == 0:
                _ensure_limitless_mk_dir()
                continue
            log.warning("limitless mk write failed (FNF) for %s", eid)
            return
        except OSError as e:
            with suppress(Exception):
                tmp.unlink()
            log.warning("limitless mk write failed for %s: %s", eid, e)
            return


def _touch_pinned_files(eids: tuple[str, ...]) -> int:
    """Bump mtime to "now" for every existing cache file in ``eids``.

    Returns the count of files actually touched.  Missing files are
    silently skipped — the pin set can include events whose REST warmup
    hasn't completed yet (or returned no bookmaker data), and we
    shouldn't fail noisily for those.

    Caller (``OddsApiWS._refresh_pinned_mtimes``) guarantees the WS
    connection is alive and recently active, so bumping mtime is
    semantically equivalent to "we've re-verified that this is the
    freshest snapshot upstream has told us about".
    """
    bumped = 0
    for eid in eids:
        p = WS_SHM_CACHE_DIR / f"{eid}.json"
        try:
            os.utime(p, None)  # set both atime + mtime to current time
            bumped += 1
        except (FileNotFoundError, OSError):
            continue
    return bumped


def _clear_shm_cache() -> None:
    """Wipe every *.json file in the cache dir (resync_required path)."""
    if not WS_SHM_CACHE_DIR.exists():
        return
    for f in WS_SHM_CACHE_DIR.glob("*.json"):
        with suppress(OSError):
            f.unlink()


# ---------------------------------------------------------------------------
# Persistence helper — runs in a thread so we don't block the asyncio loop.

def _persist_delta(msg: dict) -> None:
    """Upsert a single ``updated`` / ``created`` payload into odds_market.

    The shape mirrors what the ingest script writes via ``upsert_markets``,
    only here we already know the bookmaker (msg['bookie']) and event id
    (msg['id']). We *don't* try to upsert the event row — that's the
    ingest script's job (it has league + commence_ts metadata which the
    WS payload lacks).
    """
    eid_raw = msg.get("id")
    bookie = msg.get("bookie")
    markets = msg.get("markets") or []
    if not eid_raw or not bookie or not isinstance(markets, list):
        return
    try:
        event_id = int(eid_raw)
    except (TypeError, ValueError):
        return

    conn = oddsdb.connect_rw()
    try:
        with conn:
            for m in markets:
                if not isinstance(m, dict) or not m.get("name"):
                    continue
                updated_iso = m.get("updatedAt")
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
                        bookie,
                        m["name"],
                        json.dumps(m.get("odds") or [], ensure_ascii=False),
                        updated_iso,
                        _iso_to_epoch(updated_iso),
                    ),
                )
    finally:
        conn.close()


def _iso_to_epoch(iso: str | None) -> int | None:
    if not iso:
        return None
    s = iso.replace("Z", "+00:00") if iso.endswith("Z") else iso
    try:
        from datetime import datetime
        return int(datetime.fromisoformat(s).timestamp())
    except ValueError:
        return None


# ---------------------------------------------------------------------------
# REST helpers used by ``_warmup_from_rest``.  Run inside ``asyncio.to_thread``
# so they don't block the asyncio loop.  All errors propagate to the caller
# which logs & continues.

def _rest_events(api_key: str, sport: str, league: str) -> list[dict]:
    """GET /v3/events — returns the list of events for ``league``."""
    url = REST_API_BASE + "/events?" + urllib.parse.urlencode({
        "apiKey": api_key, "sport": sport, "league": league,
    })
    req = urllib.request.Request(url, headers={"User-Agent": "crown-explorer-warmup"})
    with urllib.request.urlopen(req, timeout=15) as r:
        data = json.loads(r.read())
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ("events", "data", "items"):
            v = data.get(key)
            if isinstance(v, list):
                return v
    return []


def _rest_event_odds(api_key: str, event_id: str, bookmakers: str) -> dict | None:
    """GET /v3/odds — returns the full bookmakers/markets tree for one event."""
    url = REST_API_BASE + "/odds?" + urllib.parse.urlencode({
        "apiKey": api_key, "eventId": event_id, "bookmakers": bookmakers,
    })
    req = urllib.request.Request(url, headers={"User-Agent": "crown-explorer-warmup"})
    with urllib.request.urlopen(req, timeout=15) as r:
        data = json.loads(r.read())
    return data if isinstance(data, dict) else None


def build_from_env() -> OddsApiWS | None:
    """Factory — returns None if no key is configured (so the API process
    can still boot without odds-api.io WS in dev environments).
    """
    # 2026-06-04: Goalserve-only cutover.  Setting ODDSAPI_WS_DISABLE=1
    # turns the limitless/odds-api.io upstream bridge off entirely so the
    # process maintains no non-Goalserve upstream connection.  Reversible:
    # unset the env var and restart pmppm-com-api.
    if (os.environ.get("ODDSAPI_WS_DISABLE") or "").strip().lower() in ("1", "true", "yes"):
        log.info("oddsapi_ws disabled via ODDSAPI_WS_DISABLE — limitless bridge off")
        return None
    # 2026-05-30: limitless /ws/quote needs no API key.  We keep reading
    # ODDS_API_KEY only for backward-compat env detection but no longer
    # require it — the bridge always starts so 滚球 odds flow from limitless.
    key = os.environ.get("ODDS_API_KEY") or "limitless"
    leagues_env = (os.environ.get("ODDSAPI_WS_LEAGUES") or "").strip()
    # Two ways to opt into the full firehose:
    #   * Unset / empty env → DEFAULT_LEAGUES (now an empty tuple)
    #   * Explicitly set to "*" or "all" → also empty list
    if leagues_env in ("", "*", "all"):
        leagues: list[str] = list(DEFAULT_LEAGUES)
    else:
        leagues = [s.strip() for s in leagues_env.split(",") if s.strip()]
    return OddsApiWS(key, leagues=leagues)
