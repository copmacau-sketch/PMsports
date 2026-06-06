/**
 * Browser client for `/api/external/ws` — the WebSocket bridge to
 * odds-api.io that the FastAPI backend operates on our behalf.
 *
 * Why a thin wrapper rather than raw `WebSocket`?
 *   1. Auto-reconnect with capped exponential backoff (so the UI doesn't
 *      go silent if the backend redeploys or the network blips).
 *   2. Single shared connection — multiple React components can subscribe
 *      via `addListener()` without each opening their own socket.
 *   3. Filtered subscription via `?eventIds=` is computed from the
 *      currently-selected match, so we only get the deltas we care about.
 *
 * Wire format (server → client):
 *
 *   { type: "hello",   filter: ["61301247"], server_ts: 17790... }
 *   { type: "updated", id: "61301247", bookie: "Bet365",
 *       seq: 482917, timestamp: 1779..., server_ts: 1779...,
 *       markets: [{ name: "ML", odds: [{home,draw,away}], updatedAt }] }
 *   { type: "created" | "deleted" | "no_markets" | "resync_required" }
 *
 * Latency ≈ upstream odds-api.io edge → our origin → Cloudflare → browser.
 */

export type OddsWsMessage =
  | OddsWsHello
  | OddsWsUpdate
  | OddsWsCreated
  | OddsWsDeleted
  | OddsWsNoMarkets
  | OddsWsResync
  | OddsWsError;

export interface OddsWsHello {
  type: "hello";
  filter: string[] | null;
  server_ts: number;
}

export interface OddsWsUpdate {
  type: "updated" | "created";
  id: string;          // event_id (string in WS payload, matches OddsEvent.id stringified)
  bookie: string;
  seq?: number;
  timestamp?: number;  // upstream epoch seconds
  server_ts: number;   // backend epoch ms when relayed
  url?: string;
  markets: Array<{
    name: string;                                  // market_name, e.g. "ML"
    updatedAt?: string | null;
    odds: Array<Record<string, string | number | null>>;
  }>;
}

export type OddsWsCreated = Omit<OddsWsUpdate, "type"> & { type: "created" };
export interface OddsWsDeleted   { type: "deleted";        id: string; server_ts: number }
export interface OddsWsNoMarkets { type: "no_markets";     id: string; server_ts: number }
export interface OddsWsResync    { type: "resync_required"; reason: string; server_ts: number }
export interface OddsWsError     { type: "error";          error:  string }

type Listener = (msg: OddsWsMessage) => void;

export class OddsWsClient {
  private url: string;
  private ws: WebSocket | null = null;
  private listeners: Set<Listener> = new Set();
  private closed: boolean = false;
  private retryMs: number = 500;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  // Tracks the upstream connection state for status badges in the UI.
  public connected: boolean = false;
  public lastMessageAt: number | null = null;

  constructor(opts: { eventIds?: string[]; pathBase?: string } = {}) {
    const { eventIds, pathBase = "" } = opts;
    const proto = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss" : "ws";
    const host = typeof window !== "undefined" ? window.location.host : "";
    const base = pathBase || `${proto}://${host}`;
    const qs = eventIds && eventIds.length ? `?eventIds=${encodeURIComponent(eventIds.join(","))}` : "";
    this.url = `${base}/api/external/ws${qs}`;
  }

  // ---- public API -------------------------------------------------------

  start(): void {
    if (this.ws || this.closed) return;
    this.openSocket();
  }

  close(): void {
    this.closed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    if (this.ws) {
      try { this.ws.close(); } catch {}
      this.ws = null;
    }
    this.listeners.clear();
  }

  addListener(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // ---- internals --------------------------------------------------------

  private openSocket(): void {
    try {
      this.ws = new WebSocket(this.url);
    } catch (err) {
      this.scheduleReconnect();
      return;
    }
    this.ws.onopen = () => {
      this.connected = true;
      this.retryMs = 500; // reset backoff on successful connect
    };
    this.ws.onmessage = (ev) => {
      this.lastMessageAt = Date.now();
      let msg: OddsWsMessage | null = null;
      try {
        msg = JSON.parse(ev.data) as OddsWsMessage;
      } catch {
        return;
      }
      for (const fn of this.listeners) {
        try { fn(msg); } catch (err) { /* listener errors must not break the bus */ console.error("oddsWs listener error", err); }
      }
    };
    this.ws.onerror = () => { /* let onclose handle reconnect */ };
    this.ws.onclose = () => {
      this.connected = false;
      this.ws = null;
      if (!this.closed) this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (this.closed || this.reconnectTimer) return;
    const delay = this.retryMs;
    this.retryMs = Math.min(this.retryMs * 1.7, 15_000);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.openSocket();
    }, delay);
  }
}
