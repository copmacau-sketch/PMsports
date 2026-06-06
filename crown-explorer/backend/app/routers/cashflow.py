"""GET /api/cashflow/* — credit_log explorer."""
from __future__ import annotations

from fastapi import APIRouter, Query

from ..db import fetch_all, fetch_one

router = APIRouter()


@router.get("")
def list_cashflow(
    q: str | None = Query(None, description="search nid / s_name / ss_name"),
    usertype: str | None = None,
    op_type: str | None = Query(None, description="credit_log.type code"),
    limit: int = Query(200, ge=1, le=2000),
    offset: int = Query(0, ge=0),
) -> dict:
    where: list[str] = []
    params: list = []
    if q:
        like = f"%{q}%"
        where.append("(nid LIKE ? OR s_name LIKE ? OR ss_name LIKE ?)")
        params += [like, like, like]
    if usertype:
        where.append("usertype = ?")
        params.append(usertype)
    if op_type:
        where.append("type = ?")
        params.append(op_type)
    where_sql = "WHERE " + " AND ".join(where) if where else ""

    items = fetch_all(
        f"""
        SELECT id, nid, s_name, ss_name, type, old_cash, new_cash, cash,
               usertype, logintime
        FROM credit_log
        {where_sql}
        ORDER BY CAST(logintime AS INTEGER) DESC
        LIMIT ? OFFSET ?
        """,
        tuple(params + [limit, offset]),
    )
    total = fetch_one(
        f"SELECT COUNT(*) AS n FROM credit_log {where_sql}",
        tuple(params),
    )["n"]
    return {"total": total, "items": items}


@router.get("/summary")
def summary() -> dict:
    by_type = fetch_all(
        """
        SELECT type,
               COUNT(*) AS n,
               ROUND(SUM(CAST(cash AS REAL)), 2) AS total
        FROM credit_log
        GROUP BY type
        ORDER BY n DESC
        """
    )
    by_usertype = fetch_all(
        """
        SELECT usertype,
               COUNT(*) AS n,
               ROUND(SUM(CAST(cash AS REAL)), 2) AS total
        FROM credit_log
        GROUP BY usertype
        ORDER BY n DESC
        """
    )
    range_ = fetch_one(
        """
        SELECT MIN(CAST(logintime AS INTEGER)) AS first_ts,
               MAX(CAST(logintime AS INTEGER)) AS last_ts
        FROM credit_log
        """
    )
    return {
        "by_type": by_type,
        "by_usertype": by_usertype,
        "range": range_,
    }
