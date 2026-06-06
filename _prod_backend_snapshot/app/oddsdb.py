"""SQLite connection helper for the odds-api.io snapshot.

Unlike ``db.py`` (which is read-only over the Crown forensic snapshot), this
database is populated by ``scripts/ingest_oddsapi.py`` and refreshed on a
schedule. The API process still opens it read-only so the FastAPI app can
never mutate the data it serves; the ingest script opens it read-write.

Schema (created lazily by ``init_schema()`` so the ingest script can run on
a fresh checkout):

    odds_event
        id                    INTEGER PRIMARY KEY        -- upstream event id
        sport_slug            TEXT                       -- e.g. 'football'
        league_slug           TEXT                       -- e.g. 'england-premier-league'
        league_name           TEXT
        home                  TEXT
        away                  TEXT
        home_id               INTEGER
        away_id               INTEGER
        commence_iso          TEXT                       -- ISO-8601 UTC kickoff
        commence_ts           INTEGER                    -- epoch seconds (sortable)
        status                TEXT                       -- pending / inplay / settled
        score_home            INTEGER
        score_away            INTEGER
        raw_json              TEXT                       -- last /v3/events payload
        fetched_at            INTEGER                    -- epoch of last refresh
        apisports_fixture_id  INTEGER                    -- api-sports.io fixture.id (fuzzy-matched)
        apisports_match_iso   TEXT                       -- api-sports.io kickoff iso, for audit

    odds_market
        market_id       INTEGER PRIMARY KEY AUTOINCREMENT  -- 1, 2, 3, ...
        event_id        INTEGER  REFERENCES odds_event(id)
        bookmaker       TEXT
        market_name     TEXT
        odds_json       TEXT                       -- raw ``odds`` array
        updated_at_iso  TEXT
        updated_at_ts   INTEGER
        UNIQUE (event_id, bookmaker, market_name)

The ``market_id`` is exposed by the API as a zero-padded 6-digit string
(e.g. ``"000001"``) — handy as a stable, human-friendly handle that is
unique across the whole DB and never reused (AUTOINCREMENT guarantee).

Indexes are scoped to the columns the API actually filters on.
"""
from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

DB_PATH = Path(
    os.environ.get(
        "ODDSAPI_DB_PATH",
        str(Path(__file__).resolve().parents[2] / "data" / "oddsapi.sqlite"),
    )
)


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS odds_event (
    id                    INTEGER PRIMARY KEY,
    sport_slug            TEXT NOT NULL,
    league_slug           TEXT NOT NULL,
    league_name           TEXT,
    home                  TEXT,
    away                  TEXT,
    home_id               INTEGER,
    away_id               INTEGER,
    commence_iso          TEXT,
    commence_ts           INTEGER,
    status                TEXT,
    score_home            INTEGER,
    score_away            INTEGER,
    raw_json              TEXT,
    fetched_at            INTEGER NOT NULL,
    apisports_fixture_id  INTEGER,
    apisports_match_iso   TEXT
);

CREATE INDEX IF NOT EXISTS idx_odds_event_league_ts
    ON odds_event (league_slug, commence_ts);
CREATE INDEX IF NOT EXISTS idx_odds_event_status
    ON odds_event (status);
-- idx_odds_event_apisports is created by _apply_migrations(): for legacy
-- databases the column doesn't exist yet at SCHEMA_SQL execution time, so
-- the index has to be created *after* the ALTER TABLE ADD COLUMN pass.

CREATE TABLE IF NOT EXISTS odds_market (
    market_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id        INTEGER NOT NULL,
    bookmaker       TEXT    NOT NULL,
    market_name     TEXT    NOT NULL,
    odds_json       TEXT,
    updated_at_iso  TEXT,
    updated_at_ts   INTEGER,
    UNIQUE (event_id, bookmaker, market_name),
    FOREIGN KEY (event_id) REFERENCES odds_event(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_odds_market_event
    ON odds_market (event_id);
"""


def _apply_migrations(conn: sqlite3.Connection) -> None:
    """Idempotent forward migrations for already-populated databases.

    SQLite's ``CREATE TABLE IF NOT EXISTS`` does *not* add columns to an
    existing table, so when new columns get appended to ``SCHEMA_SQL`` we
    need a separate ``ALTER TABLE`` pass. This helper is safe to call any
    number of times — each branch is guarded by a ``PRAGMA table_info``
    lookup.
    """
    cols = {r["name"] for r in conn.execute("PRAGMA table_info(odds_event)").fetchall()}
    if "apisports_fixture_id" not in cols:
        conn.execute("ALTER TABLE odds_event ADD COLUMN apisports_fixture_id INTEGER")
    if "apisports_match_iso" not in cols:
        conn.execute("ALTER TABLE odds_event ADD COLUMN apisports_match_iso TEXT")
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_odds_event_apisports "
        "ON odds_event (apisports_fixture_id)"
    )


def _connect_ro() -> sqlite3.Connection:
    """Open the DB read-only for the API process. If the file doesn't exist
    yet (i.e. ingest hasn't run), we still return a connection to an
    in-memory empty DB so the API endpoints return empty lists instead of
    500-ing. The schema is applied so the queries don't fail.
    """
    if DB_PATH.exists():
        uri = f"file:{DB_PATH}?mode=ro"
        conn = sqlite3.connect(uri, uri=True, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA query_only = ON;")
        return conn

    # Graceful fallback: empty in-memory DB with schema applied.
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA_SQL)
    return conn


def connect_rw() -> sqlite3.Connection:
    """Open the DB read-write for the ingest script. Creates parent dir +
    schema if needed, then runs forward migrations so older databases
    pick up newly-added columns automatically.
    """
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA_SQL)
    _apply_migrations(conn)
    conn.commit()
    return conn


@contextmanager
def get_conn() -> Iterator[sqlite3.Connection]:
    conn = _connect_ro()
    try:
        yield conn
    finally:
        conn.close()


def fetch_all(sql: str, params: tuple = ()) -> list[dict]:
    with get_conn() as c:
        return [dict(r) for r in c.execute(sql, params).fetchall()]


def fetch_one(sql: str, params: tuple = ()) -> dict | None:
    with get_conn() as c:
        row = c.execute(sql, params).fetchone()
        return dict(row) if row else None


def fetch_scalar(sql: str, params: tuple = ()):
    with get_conn() as c:
        row = c.execute(sql, params).fetchone()
        return row[0] if row else None
