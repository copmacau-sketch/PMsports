#!/usr/bin/env bash
# migrate_to_sqlite.sh
#
# One-shot: spin up an *isolated* mysqld 5.7, attach the snapshot,
# mysqldump -> rewrite as SQLite-compatible -> import into data/crown.sqlite,
# then tear the mysqld down. Nothing is written back to the snapshot.
#
# Requirements: mysqld, mysql, mysqldump, sqlite3 in PATH.
#
# Safe to re-run: data/crown.sqlite is rebuilt from scratch each time.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="/Volumes/T7/Crown/db_client"
DATA_DIR="$ROOT/data"
MYSQL_DATADIR="$DATA_DIR/_mysql_datadir"
SOCK="$DATA_DIR/_mysql.sock"
PID="$DATA_DIR/_mysql.pid"
ERRLOG="$DATA_DIR/_mysql.err"
SQL_DUMP="$DATA_DIR/_dump.sql"
SQLITE_DB="$DATA_DIR/crown.sqlite"
PORT=0   # disable networking entirely; socket only

log() { printf '\033[36m[migrate]\033[0m %s\n' "$*"; }

cleanup() {
  if [[ -f "$PID" ]]; then
    log "shutting down isolated mysqld"
    mysqladmin --socket="$SOCK" -uroot shutdown 2>/dev/null || \
      kill "$(cat "$PID")" 2>/dev/null || true
    sleep 1
  fi
  rm -f "$SOCK" "$PID"
}
trap cleanup EXIT

# --- preflight ---
for bin in mysqld mysql mysqldump mysqladmin sqlite3; do
  command -v "$bin" >/dev/null || { echo "missing: $bin"; exit 1; }
done
[[ -d "$SRC" ]] || { echo "snapshot not found: $SRC"; exit 1; }

log "(re)preparing isolated datadir at $MYSQL_DATADIR"
rm -rf "$MYSQL_DATADIR" "$SQL_DUMP" "$SQLITE_DB"
mkdir -p "$MYSQL_DATADIR"

log "initialising mysqld system tables"
mysqld --initialize-insecure \
       --datadir="$MYSQL_DATADIR" \
       --explicit_defaults_for_timestamp \
       --log-error="$ERRLOG" >/dev/null

log "copying snapshot into datadir (read-only source, copy-only)"
cp -R "$SRC" "$MYSQL_DATADIR/db_client"

log "starting isolated mysqld (socket only, networking off)"
mysqld --datadir="$MYSQL_DATADIR" \
       --socket="$SOCK" \
       --pid-file="$PID" \
       --port="$PORT" \
       --skip-networking \
       --skip-grant-tables \
       --log-error="$ERRLOG" \
       --secure-file-priv="" &
# wait for ready
for i in {1..30}; do
  if mysqladmin --socket="$SOCK" -uroot ping >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done
mysqladmin --socket="$SOCK" -uroot ping >/dev/null

log "mysql version:"
mysql --socket="$SOCK" -uroot -e "SELECT VERSION();"

log "running myisamchk via CHECK TABLE (read-only)"
mysql --socket="$SOCK" -uroot db_client -e "SHOW TABLES;" | tail -n +2 | \
  while read -r t; do
    mysql --socket="$SOCK" -uroot db_client -e "CHECK TABLE \`$t\`;" >/dev/null
  done

log "dumping schema + data"
mysqldump --socket="$SOCK" -uroot \
          --skip-extended-insert \
          --skip-add-locks \
          --compact \
          --no-create-db \
          --hex-blob \
          --default-character-set=utf8 \
          --compatible=ansi \
          db_client > "$SQL_DUMP"

log "sql dump size: $(wc -c < "$SQL_DUMP" | awk '{print $1}') bytes"

log "rewriting MySQL DDL -> SQLite DDL"
python3 "$ROOT/scripts/rewrite_dump_for_sqlite.py" "$SQL_DUMP" "$SQL_DUMP.sqlite.sql"

log "importing into SQLite at $SQLITE_DB"
sqlite3 "$SQLITE_DB" <<EOF
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = OFF;
.read $SQL_DUMP.sqlite.sql
EOF

log "verifying row counts"
python3 - <<EOF
import sqlite3, pathlib
db = sqlite3.connect("$SQLITE_DB")
for (t,) in db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"):
    n = db.execute(f'SELECT COUNT(*) FROM "{t}"').fetchone()[0]
    print(f"  {t:<22} {n:>10} rows")
EOF

log "done -> $SQLITE_DB"
