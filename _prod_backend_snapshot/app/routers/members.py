"""GET /api/members/* — list + composite detail view per member."""
from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException, Query

from ..db import fetch_all, fetch_one
from ..masking import mask_row, mask_rows

router = APIRouter()


@router.get("")
def list_members(
    q: str | None = Query(None, description="search by loginname/name"),
    ag: str | None = None,
    su: str | None = None,
    co: str | None = None,
    d0: str | None = None,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    reveal: bool = False,
) -> dict:
    where: list[str] = []
    params: list = []
    if q:
        where.append("(loginname LIKE ? OR name LIKE ?)")
        like = f"%{q}%"
        params += [like, like]
    for col, val in (("ag", ag), ("su", su), ("co", co), ("d0", d0)):
        if val:
            where.append(f"{col} = ?")
            params.append(val)
    where_sql = ("WHERE " + " AND ".join(where)) if where else ""

    rows = fetch_all(
        f"""
        SELECT id, nid, name, loginname, status, isout, credit, balance_credit,
               currency, pay_type, ag, su, co, d0, loginip, email,
               adddate, lastdate
        FROM member
        {where_sql}
        ORDER BY lastdate DESC
        LIMIT ? OFFSET ?
        """,
        tuple(params + [limit, offset]),
    )
    total = fetch_one(
        f"SELECT COUNT(*) AS n FROM member {where_sql}", tuple(params)
    )["n"]
    return {"total": total, "items": mask_rows(rows, reveal)}


@router.get("/{member_id}")
def get_member(member_id: int, reveal: bool = False) -> dict:
    row = fetch_one("SELECT * FROM member WHERE id = ?", (member_id,))
    if not row:
        raise HTTPException(status_code=404, detail="member not found")
    if row.get("config"):
        try:
            row["config"] = json.loads(row["config"])
        except (ValueError, TypeError):
            pass
    return mask_row(row, reveal)


@router.get("/{member_id}/login_log")
def member_login_log(member_id: int, reveal: bool = False) -> list[dict]:
    nid = _resolve_nid(member_id)
    rows = fetch_all(
        """
        SELECT id, logintime, loginip, loginurl, ip_address
        FROM member_login_log
        WHERE nid = ?
        ORDER BY logintime DESC
        LIMIT 500
        """,
        (nid,),
    )
    return mask_rows(rows, reveal)


@router.get("/{member_id}/record")
def member_record(member_id: int, reveal: bool = False,
                  limit: int = Query(200, ge=1, le=2000),
                  offset: int = Query(0, ge=0)) -> dict:
    nid = _resolve_nid(member_id)
    items = fetch_all(
        """
        SELECT id, info, loginip, logintime
        FROM member_record
        WHERE nid = ?
        ORDER BY logintime DESC
        LIMIT ? OFFSET ?
        """,
        (nid, limit, offset),
    )
    total = fetch_one(
        "SELECT COUNT(*) AS n FROM member_record WHERE nid = ?", (nid,)
    )["n"]
    return {"total": total, "items": mask_rows(items, reveal)}


@router.get("/{member_id}/cashflow")
def member_cashflow(member_id: int) -> list[dict]:
    nid = _resolve_nid(member_id)
    return fetch_all(
        """
        SELECT id, s_name, ss_name, type, old_cash, new_cash, cash,
               usertype, logintime
        FROM credit_log
        WHERE nid = ?
        ORDER BY CAST(logintime AS INTEGER) DESC
        LIMIT 1000
        """,
        (nid,),
    )


@router.get("/{member_id}/bets")
def member_bets(member_id: int,
                limit: int = Query(200, ge=1, le=1000),
                offset: int = Query(0, ge=0)) -> dict:
    row = fetch_one("SELECT name FROM member WHERE id = ?", (member_id,))
    if not row:
        raise HTTPException(status_code=404, detail="member not found")
    name = row["name"]
    items = fetch_all(
        """
        SELECT ID, m_name, bet_time, gtype, league, team_h, team_c,
               wtype, rtype, ptype, spread, ioratio, score,
               bet_golds, valid_gold, mem_result, result, status, cancel,
               isResult, inball, ticket_id
        FROM bet
        WHERE m_name = ?
        ORDER BY bet_time DESC
        LIMIT ? OFFSET ?
        """,
        (name, limit, offset),
    )
    total = fetch_one(
        "SELECT COUNT(*) AS n FROM bet WHERE m_name = ?", (name,)
    )["n"]
    return {"total": total, "items": items}


def _resolve_nid(member_id: int) -> str:
    row = fetch_one("SELECT nid FROM member WHERE id = ?", (member_id,))
    if not row:
        raise HTTPException(status_code=404, detail="member not found")
    return row["nid"]
