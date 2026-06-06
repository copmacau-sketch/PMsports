"""limitless.show /ws/quote  →  legacy odds-api.io WS message shape.

The FastAPI bridge (``oddsapi_ws.py``) historically consumed odds-api.io WS
frames of the shape::

    {"type": "updated", "id": "<eventId>", "bookie": "Bet365 (no latency)",
     "markets": [ {"name": "Spread", "odds": [{"hdp": -0.25, "home": 2.0, ...}]}, ...]}

and merged them into ``/dev/shm/oddsapi_live/{eventId}.json`` for the in-play
(滚球) view.  limitless pushes a *different* wire shape::

    {"type": "snapshot"|"tick"|"update",
     "data": {"markets": {"<key>": {"oddsId": "...", "marketType": "spreads",
                                     "outcomeLabels": [...], "probs": [...],
                                     "line": -1.75}, ...}}}

This module groups the limitless markets by ``oddsId`` and re-keys each into
the odds-api.io row dialect so the existing ``_merge_snapshot`` /
``_write_shm_cache`` path keeps working unchanged.  Crucially limitless'
``correct_score`` carries the full scoreline grid (incl. away wins), which is
exactly the omission that made 客胜波胆 disappear once a match went live.

limitless probs are implied probabilities; decimal price = round(1/prob, 3).
"""
from __future__ import annotations

import re


def _price(prob) -> float:
    try:
        p = float(prob)
    except (TypeError, ValueError):
        return 0.0
    return round(1.0 / p, 3) if p > 0 else 0.0


def _eid_of(market: dict) -> str:
    """Resolve the Crown/odds-api event id for one limitless market.

    Prefers the explicit ``oddsId`` field; falls back to parsing the
    ``live:<eventId>:<markettype>`` marketId form used by in-play ticks.
    """
    eid = str(market.get("oddsId") or "").strip()
    if eid:
        return eid
    parts = str(market.get("marketId") or "").split(":")
    if len(parts) >= 3 and parts[1].isdigit():
        return parts[1]
    return ""


def translate_limitless_ws_to_oddsapi(limitless_markets: dict) -> list[dict]:
    """Translate one frame's ``data.markets`` dict into a list of odds-api.io
    shaped per-event messages ready for ``_merge_snapshot``.
    """
    by_eid: dict[str, list[dict]] = {}
    for m in limitless_markets.values():
        if not isinstance(m, dict):
            continue
        eid = _eid_of(m)
        if not eid:
            continue
        by_eid.setdefault(eid, []).append(m)

    out: list[dict] = []
    for eid, markets in by_eid.items():
        crown_markets: list[dict] = []
        for m in markets:
            # Per-market translation is wrapped so a single malformed market
            # (e.g. a 2-way market that arrives with only one outcome) can
            # never raise and discard the WHOLE frame.  That exact failure —
            # ``list index out of range`` on prices[1] — was crashing the
            # upstream read loop every few minutes, forcing a reconnect and
            # leaving /dev/shm stale so the 滚球 view showed no odds.
            try:
                mtype = m.get("marketType")
                labels = m.get("outcomeLabels") or []
                probs = m.get("probs") or []
                line = m.get("line")
                if not labels or not probs or len(labels) != len(probs):
                    continue
                prices = [_price(p) for p in probs]

                def get_price(*needles: str) -> float:
                    for i, lab in enumerate(labels):
                        low = str(lab).lower()
                        if any(n == low or n in low for n in needles):
                            return prices[i]
                    return 0.0

                if mtype == "h2h":
                    h = get_price("home") or prices[0]
                    d = get_price("draw", "tie", "x")
                    a = get_price("away") or prices[-1]
                    crown_markets.append({"name": "ML", "odds": [{"home": h, "draw": d, "away": a}]})

                elif mtype == "draw_no_bet":
                    if len(prices) < 2:
                        continue
                    crown_markets.append({"name": "Draw No Bet",
                                          "odds": [{"home": prices[0], "away": prices[1]}]})

                elif mtype == "btts":
                    crown_markets.append({"name": "Both Teams To Score",
                                          "odds": [{"yes": get_price("yes"), "no": get_price("no")}]})

                elif mtype in ("spreads", "spreads_ht", "corners_spreads"):
                    if len(prices) < 2:
                        continue
                    name = {"spreads": "Spread", "spreads_ht": "Spread HT",
                            "corners_spreads": "Corners Spread"}[mtype]
                    hdp = float(line) if line is not None else 0.0
                    crown_markets.append({"name": name,
                                          "odds": [{"hdp": hdp, "home": prices[0], "away": prices[1]}]})

                elif mtype in ("totals", "totals_ht", "corners_totals"):
                    if len(prices) < 2:
                        continue
                    name = {"totals": "Totals", "totals_ht": "Totals HT",
                            "corners_totals": "Corners Totals"}[mtype]
                    hdp = float(line) if line is not None else 0.0
                    over = get_price("over") or prices[0]
                    under = get_price("under") or prices[1]
                    crown_markets.append({"name": name,
                                          "odds": [{"hdp": hdp, "over": over, "under": under}]})

                elif mtype in ("h2h_ht", "double_chance"):
                    name = "Half Time Result" if mtype == "h2h_ht" else "Double Chance"
                    crown_markets.append({"name": name,
                                          "odds": [{"label": str(labels[i]), "under": prices[i]}
                                                   for i in range(len(labels))]})

                elif mtype == "correct_score":
                    rows = []
                    for i, lab in enumerate(labels):
                        lbl = re.sub(r"\s*[-:]\s*", "-", str(lab).replace(" ", ""))
                        rows.append({"label": lbl, "odds": prices[i]})
                    crown_markets.append({"name": "Correct Score", "odds": rows})
            except (IndexError, KeyError, TypeError, ValueError):
                # Skip this single market; keep the rest of the frame intact.
                continue

        if crown_markets:
            out.append({
                "type": "updated",
                "id": eid,
                "bookie": "Bet365 (no latency)",
                "markets": _coalesce_multiline(crown_markets),
            })
    return out


# Markets where limitless ticks each handicap/total line as its own message;
# we group them into ONE crown market entry whose `odds` array carries all
# lines so the downstream snapshot retains every alternative line instead of
# clobbering them by `name`. Markets NOT listed here (ML / DNB / BTTS /
# Correct Score / Double Chance / Half Time Result) ship a complete outcome
# set in every tick and are merged by latest-wins on `name`.
_MULTILINE_MARKETS = frozenset({
    "Spread", "Totals",
    "Spread HT", "Totals HT",
    "Corners Spread", "Corners Totals",
})


def _coalesce_multiline(markets: list[dict]) -> list[dict]:
    """Collapse repeated multi-line markets (Spread/Totals/…) into one entry
    per name, concatenating their ``odds`` rows. Single-line markets pass
    through unchanged. Rows are deduplicated by ``hdp`` (last write wins),
    which mirrors how limitless ticks supersede a stale price on the same line.
    """
    seen: dict[str, dict] = {}
    out: list[dict] = []
    for m in markets:
        name = m.get("name")
        if name in _MULTILINE_MARKETS:
            existing = seen.get(name)
            if existing is None:
                existing = {"name": name, "odds": []}
                seen[name] = existing
                out.append(existing)
            for row in (m.get("odds") or []):
                if not isinstance(row, dict):
                    continue
                hdp = row.get("hdp")
                # Replace any prior row with the same hdp; else append.
                kept = []
                replaced = False
                for prev in existing["odds"]:
                    if isinstance(prev, dict) and prev.get("hdp") == hdp:
                        kept.append(row)
                        replaced = True
                    else:
                        kept.append(prev)
                if not replaced:
                    kept.append(row)
                existing["odds"] = kept
        else:
            out.append(m)
    return out
