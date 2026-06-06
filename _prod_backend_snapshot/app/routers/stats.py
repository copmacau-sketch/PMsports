"""GET /api/stats/* — overview KPIs and time-series for the dashboard."""
from __future__ import annotations

from fastapi import APIRouter

from ..db import fetch_all, fetch_one, fetch_scalar
from ..enums import GTYPE, decode

router = APIRouter()


@router.get("/overview")
def overview() -> dict:
    counts = {
        "admins":            fetch_scalar("SELECT COUNT(*) FROM admin"),
        "agents":            fetch_scalar("SELECT COUNT(*) FROM rank"),
        "members":           fetch_scalar("SELECT COUNT(*) FROM member"),
        "bets":              fetch_scalar("SELECT COUNT(*) FROM bet"),
        "credit_log_rows":   fetch_scalar("SELECT COUNT(*) FROM credit_log"),
        "messages":          fetch_scalar("SELECT COUNT(*) FROM message"),
        "member_record_rows":
            fetch_scalar("SELECT COUNT(*) FROM member_record"),
    }
    totals = fetch_one(
        """
        SELECT ROUND(SUM(CAST(bet_golds AS REAL)),2)    AS bet_total,
               ROUND(SUM(CAST(valid_gold AS REAL)),2)   AS valid_total,
               ROUND(SUM(CAST(mem_result AS REAL)),2)   AS member_pnl,
               ROUND(SUM(CAST(ag_result  AS REAL)),2)   AS ag_pnl,
               ROUND(SUM(CAST(co_result  AS REAL)),2)   AS co_pnl,
               ROUND(SUM(CAST(d0_result  AS REAL)),2)   AS d0_pnl,
               MIN(bet_time)                            AS first_bet_ts,
               MAX(bet_time)                            AS last_bet_ts
        FROM bet
        """
    ) or {}
    return {"counts": counts, "bet_totals": totals}


@router.get("/bets_by_day")
def bets_by_day(limit: int = 90) -> list[dict]:
    rows = fetch_all(
        """
        SELECT date(bet_time, 'unixepoch')              AS day,
               COUNT(*)                                 AS bets,
               ROUND(SUM(CAST(bet_golds AS REAL)), 2)   AS bet_total,
               ROUND(SUM(CAST(mem_result AS REAL)), 2)  AS member_pnl
        FROM bet
        WHERE bet_time IS NOT NULL AND bet_time > 0
        GROUP BY day
        ORDER BY day DESC
        LIMIT ?
        """,
        (limit,),
    )
    rows.reverse()
    return rows


@router.get("/bets_by_gtype")
def bets_by_gtype() -> list[dict]:
    rows = fetch_all(
        """
        SELECT gtype,
               COUNT(*)                                 AS bets,
               ROUND(SUM(CAST(bet_golds AS REAL)), 2)   AS bet_total,
               ROUND(SUM(CAST(mem_result AS REAL)), 2)  AS member_pnl
        FROM bet
        GROUP BY gtype
        ORDER BY bets DESC
        """
    )
    for r in rows:
        r["gtype_label"] = decode(GTYPE, r["gtype"]) or r["gtype"]
    return rows


@router.get("/top_members")
def top_members(limit: int = 10) -> list[dict]:
    return fetch_all(
        """
        SELECT m_name                                   AS member,
               COUNT(*)                                 AS bets,
               ROUND(SUM(CAST(bet_golds AS REAL)), 2)   AS bet_total,
               ROUND(SUM(CAST(mem_result AS REAL)), 2)  AS member_pnl
        FROM bet
        GROUP BY m_name
        ORDER BY bet_total DESC
        LIMIT ?
        """,
        (limit,),
    )
