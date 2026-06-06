"""SQLite connection helper. Opens the database read-only via URI mode so
that the app physically cannot mutate the snapshot.
"""
from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

DB_PATH = Path(
    os.environ.get(
        "CROWN_DB_PATH",
        str(Path(__file__).resolve().parents[2] / "data" / "crown.sqlite"),
    )
)


def _connect() -> sqlite3.Connection:
    if not DB_PATH.exists():
        raise FileNotFoundError(
            f"crown.sqlite not found at {DB_PATH}. "
            f"Run scripts/migrate_to_sqlite.sh first."
        )
    uri = f"file:{DB_PATH}?mode=ro"
    conn = sqlite3.connect(uri, uri=True, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    # be polite with large scans (member_record has 24k rows)
    conn.execute("PRAGMA query_only = ON;")
    conn.execute("PRAGMA temp_store = MEMORY;")
    return conn


@contextmanager
def get_conn() -> Iterator[sqlite3.Connection]:
    conn = _connect()
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
