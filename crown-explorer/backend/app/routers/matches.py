"""GET /api/matches/* — match-level aggregations on top of the bet ledger.

Crown's snapshot has no native "match" table; matches are reconstructed by
grouping the `bet` rows on `(m_date, gnum_h, gnum_c)`. `gnum_h` is Crown's
upstream host-side match number and is unique per match per day, so we use
it as the public `match_id`.

Two endpoints:
  - `GET  /api/matches`                       list / filter matches
  - `GET  /api/matches/{match_id}/markets`    expand markets for one match
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from ..db import fetch_all, fetch_one
from ..enums import GTYPE, PTYPE, WTYPE, decode

router = APIRouter()


# Columns that describe a match. Pulled with MAX/MIN so the GROUP BY is happy
# even when individual bets disagree on (e.g.) score timestamps.
_MATCH_COLS = """
    b.gnum_h                           AS match_id,
    b.gtype                            AS sport_code,
    MAX(b.m_date)                      AS m_date,
    MAX(b.league)                      AS league,
    MAX(b.league_tw)                   AS league_tw,
    MAX(b.league_en)                   AS league_en,
    MAX(b.team_h)                      AS team_h,
    MAX(b.team_c)                      AS team_c,
    MAX(b.team_h_tw)                   AS team_h_tw,
    MAX(b.team_c_tw)                   AS team_c_tw,
    MAX(b.team_h_en)                   AS team_h_en,
    MAX(b.team_c_en)                   AS team_c_en,
    MAX(b.gnum_h)                      AS gnum_h,
    MAX(b.gnum_c)                      AS gnum_c,
    MIN(b.bet_time)                    AS first_bet_ts,
    MAX(b.bet_time)                    AS last_bet_ts,
    MAX(b.score)                       AS score,
    MAX(b.org_score)                   AS org_score,
    MAX(b.isResult)                    AS is_resolved,
    COUNT(*)                           AS bets,
    ROUND(SUM(CAST(b.bet_golds AS REAL)), 2)  AS stake_total
"""


@router.get("")
def list_matches(
    gtype: str | None = Query(None, description="sport code: FT/BK/TN/..."),
    league: str | None = Query(None, description="ILIKE filter on league names"),
    q: str | None = Query(None, description="free-text on team/league"),
    only_open: bool = Query(False, description="exclude already-resolved matches"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
) -> dict:
    where: list[str] = ["b.gnum_h IS NOT NULL", "b.gnum_h <> ''"]
    params: list = []
    if gtype:
        where.append("b.gtype = ?")
        params.append(gtype)
    if league:
        where.append(
            "(b.league LIKE ? OR b.league_tw LIKE ? OR b.league_en LIKE ?)"
        )
        like = f"%{league}%"
        params += [like, like, like]
    if q:
        like = f"%{q}%"
        where.append(
            "(b.league LIKE ? OR b.team_h LIKE ? OR b.team_c LIKE ?"
            " OR b.team_h_tw LIKE ? OR b.team_c_tw LIKE ?"
            " OR b.team_h_en LIKE ? OR b.team_c_en LIKE ?)"
        )
        params += [like] * 7
    where_sql = "WHERE " + " AND ".join(where)
    having_sql = ""
    if only_open:
        having_sql = "HAVING MAX(b.isResult) = 0 OR MAX(b.isResult) IS NULL"

    rows = fetch_all(
        f"""
        SELECT {_MATCH_COLS}
        FROM bet b
        {where_sql}
        GROUP BY b.gnum_h
        {having_sql}
        ORDER BY first_bet_ts DESC, match_id DESC
        LIMIT ? OFFSET ?
        """,
        tuple(params + [limit, offset]),
    )

    # market_count requires a second pass; keep it simple — one query, joined
    # back on the chosen page of match ids.
    if rows:
        ids = [r["match_id"] for r in rows]
        placeholders = ",".join("?" for _ in ids)
        market_counts = {
            r["match_id"]: r["markets"]
            for r in fetch_all(
                f"""
                SELECT gnum_h AS match_id,
                       COUNT(DISTINCT (wtype || '|' || COALESCE(ptype,'')
                                       || '|' || COALESCE(spread,'')))
                           AS markets
                FROM bet
                WHERE gnum_h IN ({placeholders})
                GROUP BY gnum_h
                """,
                tuple(ids),
            )
        }
    else:
        market_counts = {}

    total = fetch_one(
        f"""
        SELECT COUNT(*) AS n FROM (
            SELECT 1 FROM bet b
            {where_sql}
            GROUP BY b.gnum_h
            {having_sql}
        )
        """,
        tuple(params),
    )["n"]

    for r in rows:
        r["sport_label"] = decode(GTYPE, r.get("sport_code")) or r.get("sport_code")
        r["market_count"] = market_counts.get(r["match_id"], 0)
        r["is_resolved"] = bool(r.get("is_resolved"))

    return {"total": total, "items": rows}


@router.get("/{match_id}")
def get_match(match_id: str) -> dict:
    row = fetch_one(
        f"""
        SELECT {_MATCH_COLS}
        FROM bet b
        WHERE b.gnum_h = ?
        GROUP BY b.gnum_h
        """,
        (match_id,),
    )
    if not row:
        raise HTTPException(status_code=404, detail="match not found")
    row["sport_label"] = decode(GTYPE, row.get("sport_code")) or row.get("sport_code")
    row["is_resolved"] = bool(row.get("is_resolved"))
    return row


@router.get("/{match_id}/markets")
def list_markets(match_id: str) -> dict:
    match = fetch_one(
        f"""
        SELECT {_MATCH_COLS}
        FROM bet b
        WHERE b.gnum_h = ?
        GROUP BY b.gnum_h
        """,
        (match_id,),
    )
    if not match:
        raise HTTPException(status_code=404, detail="match not found")
    match["sport_label"] = decode(GTYPE, match.get("sport_code")) or match.get("sport_code")
    match["is_resolved"] = bool(match.get("is_resolved"))

    # For each (wtype, ptype, spread) tuple, take the latest ioratio (i.e. the
    # odds attached to the most recent bet placed on this market) so the UI
    # gets a single representative price.
    rows = fetch_all(
        """
        SELECT m.wtype, m.ptype, m.spread,
               b.ioratio AS latest_ioratio,
               m.bets, m.stake_total
        FROM (
            SELECT wtype,
                   COALESCE(ptype, '') AS ptype,
                   COALESCE(spread, '') AS spread,
                   MAX(bet_time)                    AS last_ts,
                   COUNT(*)                         AS bets,
                   ROUND(SUM(CAST(bet_golds AS REAL)), 2) AS stake_total
            FROM bet
            WHERE gnum_h = ?
            GROUP BY wtype, COALESCE(ptype, ''), COALESCE(spread, '')
        ) m
        JOIN bet b
          ON b.gnum_h = ?
         AND b.wtype = m.wtype
         AND COALESCE(b.ptype, '') = m.ptype
         AND COALESCE(b.spread, '') = m.spread
         AND b.bet_time = m.last_ts
        GROUP BY m.wtype, m.ptype, m.spread
        ORDER BY m.bets DESC, m.wtype, m.ptype, m.spread
        """,
        (match_id, match_id),
    )

    items: list[dict] = []
    for r in rows:
        items.append(
            {
                "market_id": f"{r['wtype']}|{r['ptype']}|{r['spread']}",
                "wtype": r["wtype"],
                "wtype_label": decode(WTYPE, r["wtype"]) or r["wtype"],
                "ptype": r["ptype"] or None,
                "ptype_label": decode(PTYPE, r["ptype"]) if r["ptype"] else None,
                "spread": r["spread"] or None,
                "latest_ioratio": _to_float(r["latest_ioratio"]),
                "bets": r["bets"],
                "stake_total": r["stake_total"],
            }
        )

    return {"match": match, "items": items, "total": len(items)}


def _to_float(v) -> float | None:
    if v is None or v == "":
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None
