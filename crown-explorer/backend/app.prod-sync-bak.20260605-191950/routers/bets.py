"""GET /api/bets/* — bet browser with multi-axis filtering."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from ..db import fetch_all, fetch_one
from ..enums import GTYPE, PTYPE, WTYPE, decode
from ..masking import mask_row, mask_rows

router = APIRouter()


@router.get("")
def list_bets(
    q: str | None = Query(None, description="member / league text search"),
    gtype: str | None = None,
    ptype: str | None = Query(None, description="Y=full game, N=first half"),
    rtype: str | None = None,
    only_unresolved: bool = False,
    only_inball: bool = False,
    only_cancelled: bool = False,
    only_edited: bool = False,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    reveal: bool = False,
) -> dict:
    where: list[str] = []
    params: list = []
    if q:
        like = f"%{q}%"
        where.append(
            "(m_name LIKE ? OR league LIKE ? OR team_h LIKE ? OR team_c LIKE ?)"
        )
        params += [like, like, like, like]
    if gtype:
        where.append("gtype = ?")
        params.append(gtype)
    if ptype:
        where.append("ptype = ?")
        params.append(ptype)
    if rtype:
        where.append("rtype = ?")
        params.append(rtype)
    if only_unresolved:
        where.append("(isResult = 0 OR isResult IS NULL)")
    if only_inball:
        where.append("inball IS NOT NULL AND inball <> ''")
    if only_cancelled:
        where.append("cancel = 1")
    if only_edited:
        where.append("isEdit = 1")
    where_sql = "WHERE " + " AND ".join(where) if where else ""

    items = fetch_all(
        f"""
        SELECT ID, m_name, bet_time, gtype, ptype, wtype, rtype, league,
               team_h, team_c, spread, ioratio, score, org_score,
               bet_golds, valid_gold, mem_result,
               result, isResult, status, cancel, danger, inball,
               isEdit, edit_type, edit_name, ticket_id, bet_ip, currency
        FROM bet
        {where_sql}
        ORDER BY bet_time DESC
        LIMIT ? OFFSET ?
        """,
        tuple(params + [limit, offset]),
    )
    total = fetch_one(
        f"SELECT COUNT(*) AS n FROM bet {where_sql}", tuple(params)
    )["n"]
    for r in items:
        r["gtype_label"] = decode(GTYPE, r["gtype"]) or r["gtype"]
        r["ptype_label"] = decode(PTYPE, r["ptype"]) or r["ptype"]
        r["wtype_label"] = decode(WTYPE, r["wtype"]) or r["wtype"]
    return {"total": total, "items": mask_rows(items, reveal)}


@router.get("/{bet_id}")
def get_bet(bet_id: int, reveal: bool = False) -> dict:
    row = fetch_one('SELECT * FROM bet WHERE "ID" = ?', (bet_id,))
    if not row:
        raise HTTPException(status_code=404, detail="bet not found")
    row["gtype_label"] = decode(GTYPE, row.get("gtype")) or row.get("gtype")
    row["ptype_label"] = decode(PTYPE, row.get("ptype")) or row.get("ptype")
    row["wtype_label"] = decode(WTYPE, row.get("wtype")) or row.get("wtype")
    # if this bet has a corresponding parlay row, attach the legs
    if row.get("rtype") and row["rtype"].lower().startswith("parlay") \
            or row.get("ptype_id"):
        legs = fetch_all(
            "SELECT * FROM bet_p3 WHERE ticket_id = ?",
            (row.get("ticket_id"),),
        )
        if legs:
            row["legs"] = legs
    return mask_row(row, reveal)
