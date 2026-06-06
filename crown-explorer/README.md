# Crown Explorer

Read-only forensic / analytical viewer for the `db_client` MyISAM snapshot
located at `/Volumes/T7/Crown/db_client/`.

> **Scope:** strictly read-only data exploration. No bet-creation, no
> credit-mutation, no password recovery, no replay of the operational
> platform. The backend is bound to `127.0.0.1`; do not expose to the
> network.

## Architecture

```
.MYD/.frm  --(scripts/migrate_to_sqlite.sh)-->  data/crown.sqlite    (read-only)
                                                       \
odds-api.io  --(scripts/ingest_oddsapi.py)---->  data/oddsapi.sqlite (refreshable)
                                                       |
                                                 FastAPI (127.0.0.1:8787)
                                                       |
                                            +----------+----------+
                                            |                     |
                                  Next.js (127.0.0.1:3000)   PmPm v3 H5 prototype
                                  crown explorer UI          (127.0.0.1:3001, separate repo)
```

The FastAPI app exposes two parallel namespaces, distinguished by data
origin so frontends can mix-and-match without ID collisions:

| Prefix             | DB                  | Source           | Notes                                  |
| ------------------ | ------------------- | ---------------- | -------------------------------------- |
| `/api/stats`, `/api/agents`, `/api/members`, `/api/bets`, `/api/cashflow`, `/api/messages`, `/api/matches` | `crown.sqlite`      | db_client dump   | Read-only forensic snapshot.            |
| `/api/external/*`  | `oddsapi.sqlite`    | odds-api.io v3   | Refreshable; live odds, no PII.         |

## Layout

- `data/`        — generated SQLite files (gitignored): `crown.sqlite`, `oddsapi.sqlite`
- `scripts/`     — `migrate_to_sqlite.sh` (Crown one-shot) + `ingest_oddsapi.py` (odds-api refresh)
- `backend/`     — FastAPI app (Python 3.11)
- `frontend/`    — Next.js 15 (TypeScript, shadcn/ui, Tailwind)

## Quick start

```bash
# 1) one-time migration  (requires local mysqld 5.7 binary; uses an isolated datadir)
bash scripts/migrate_to_sqlite.sh

# 2) backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8787 --reload

# 3) frontend
cd frontend && pnpm install && pnpm dev
```

## odds-api.io ingest

`scripts/ingest_oddsapi.py` calls the odds-api.io v3 REST API and upserts
fixtures + odds into `data/oddsapi.sqlite`. Defaults to the 7 top European
football competitions (EPL, Serie A, La Liga, Ligue 1, Bundesliga, UCL,
UEL) sourced from `Bet365`. Idempotent — run on a cron / timer.

```bash
# First run (or refresh):
ODDS_API_KEY=xxxxx python3 scripts/ingest_oddsapi.py

# Other useful flags:
python3 scripts/ingest_oddsapi.py --skip-odds      # fixtures only (cheap)
python3 scripts/ingest_oddsapi.py --leagues england-premier-league
python3 scripts/ingest_oddsapi.py --bookmakers Bet365,1xbet
```

Schema (created automatically on first run):

- `odds_event(id PRIMARY KEY, sport_slug, league_slug, league_name,
  home, away, commence_iso, commence_ts, status, score_home, score_away,
  raw_json, fetched_at)`
- `odds_market(market_id INTEGER PRIMARY KEY AUTOINCREMENT, event_id,
  bookmaker, market_name, odds_json, updated_at_iso, updated_at_ts,
  UNIQUE(event_id, bookmaker, market_name))`

The API exposes `market_id` as a 6-digit zero-padded string (e.g.
`"000001"`) for human-friendly handles; sqlite AUTOINCREMENT guarantees
the id is never reused even if a market disappears upstream.

Team and league names are stored **verbatim** in English (the upstream
spelling, e.g. `"Arsenal FC"`, `"England - Premier League"`). Translation
to simplified Chinese is a pure frontend concern; see e.g.
`src/lib/i18n-teams.ts` in the PmPm v3 H5 prototype.

## Sensitive fields

The following columns are masked by default in API responses and require
`?reveal=true` plus a logged audit entry to inspect in clear:

`passwd`, `pw`, `passcode`, `passcodeMD5`, `loginip`, `setloginip`, `email`,
`setip`, `seturl`, `logurl`.
