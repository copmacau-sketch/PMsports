"""GET /api/messages/* — announcement / push viewer."""
from __future__ import annotations

from fastapi import APIRouter, Query

from ..db import fetch_all, fetch_one
from ..masking import mask_rows

router = APIRouter()


@router.get("")
def list_messages(
    q: str | None = Query(None, description="text search"),
    lang: str = Query("zh", regex="^(zh|tw|en)$"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    reveal: bool = False,
) -> dict:
    body_col = {"zh": "message", "tw": "message_tw", "en": "message_en"}[lang]
    where: list[str] = ["isdelete = 0 OR isdelete IS NULL"]
    params: list = []
    if q:
        like = f"%{q}%"
        where.append(f"({body_col} LIKE ? OR name LIKE ?)")
        params += [like, like]
    where_sql = "WHERE " + " AND ".join(where)

    rows = fetch_all(
        f"""
        SELECT id, name, ndate, ntime, dqtime, type, level,
               readcount, isAlert, tel,
               {body_col} AS body
        FROM message
        {where_sql}
        ORDER BY ntime DESC
        LIMIT ? OFFSET ?
        """,
        tuple(params + [limit, offset]),
    )
    total = fetch_one(
        f"SELECT COUNT(*) AS n FROM message {where_sql}", tuple(params)
    )["n"]
    return {"total": total, "items": mask_rows(rows, reveal)}
