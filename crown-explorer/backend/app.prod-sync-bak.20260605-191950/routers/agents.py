"""GET /api/agents/* — agent tree (D0 → D1 → D2 → D3) explorer."""
from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException, Query

from ..db import fetch_all, fetch_one
from ..enums import RANK_LEVEL
from ..masking import mask_row, mask_rows

router = APIRouter()


@router.get("")
def list_agents(
    level: int | None = Query(None, ge=1, le=4),
    reveal: bool = False,
) -> list[dict]:
    sql = (
        "SELECT id, nid, name, loginname, level, status, isout, credit, "
        "       winloss, dfwinloss, pay_type, currency, manager_uid, pri, "
        "       loginip, email, adddate, lastdate "
        "FROM rank "
    )
    params: tuple = ()
    if level is not None:
        sql += " WHERE level = ? "
        params = (level,)
    sql += " ORDER BY level, name"
    rows = fetch_all(sql, params)
    for r in rows:
        r["level_label"] = RANK_LEVEL.get(r["level"])
    return mask_rows(rows, reveal)


@router.get("/{agent_id}")
def get_agent(agent_id: int, reveal: bool = False) -> dict:
    row = fetch_one("SELECT * FROM rank WHERE id = ?", (agent_id,))
    if not row:
        raise HTTPException(status_code=404, detail="agent not found")
    # parse the giant `special` JSON limit configuration so the frontend
    # doesn't have to handle the string form
    for k in ("special", "config"):
        if row.get(k):
            try:
                row[k] = json.loads(row[k])
            except (ValueError, TypeError):
                pass
    row["level_label"] = RANK_LEVEL.get(row.get("level"))
    return mask_row(row, reveal)


@router.get("/{agent_id}/members")
def members_under(agent_id: int, reveal: bool = False) -> list[dict]:
    """Members whose chain includes this agent (matched by name on any
    of ag/su/co/d0)."""
    agent = fetch_one("SELECT name FROM rank WHERE id = ?", (agent_id,))
    if not agent:
        raise HTTPException(status_code=404, detail="agent not found")
    name = agent["name"]
    rows = fetch_all(
        """
        SELECT id, nid, name, loginname, status, isout, credit,
               balance_credit, currency, pay_type, ag, su, co, d0,
               loginip, email, adddate, lastdate
        FROM member
        WHERE ag = ? OR su = ? OR co = ? OR d0 = ?
        ORDER BY lastdate DESC
        """,
        (name, name, name, name),
    )
    return mask_rows(rows, reveal)
