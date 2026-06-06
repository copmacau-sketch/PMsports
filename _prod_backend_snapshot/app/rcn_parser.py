"""Python port of ``parseRcnMarkets()`` in api_v2.php.

The Crown legacy r_cn column is ``base64(gzdeflate(xml))`` where the
XML is Crown's flat tag soup — see
``vendor/common/OddsApiToCrownXml.php`` for the writer side and
``wwwroot_F5PEa/application/member/api_v2.php::parseRcnMarkets`` for the
PHP reader we mirror here.

The shape we return matches the PHP version so the FastAPI handlers can
project ``main_odds`` and ``extra_markets`` with identical logic:

    [
        {
            "market_id": "000001",
            "market_id_int": 1,
            "market_name": "ML",
            "odds": [{"home": 1.85, "draw": 3.50, "away": 4.20}],
            "updated_at_iso": "2026-05-24T03:21:00+00:00",
            "updated_at_ts":  1779593460,
        },
        …
    ]
"""
from __future__ import annotations

import base64
import datetime as _dt
import html
import re
import time
import zlib


def _gz_inflate(buf: bytes) -> bytes:
    """Decode the gzdeflate output PHP wrote.

    PHP's gzdeflate is raw deflate (no zlib header/checksum), so we
    pass wbits=-15 to ``zlib.decompress``.
    """
    return zlib.decompress(buf, -15)


def _tag(xml: str, name: str) -> str | None:
    """Mirror of the closure ``$tag`` in parseRcnMarkets()."""
    m = re.search(rf"<{name}>([^<]*)</{name}>", xml, re.IGNORECASE)
    return m.group(1).strip() if m else None


def _f(s: str | None) -> float:
    if s is None:
        return 0.0
    try:
        return float(s)
    except (TypeError, ValueError):
        return 0.0


def parse_rcn_markets(r_cn_encoded: str | None) -> list[dict]:
    """Decode ``r_cn`` and return the canonical markets list.

    Empty/garbled payloads yield ``[]`` rather than raising.
    """
    if not r_cn_encoded:
        return []
    try:
        xml = _gz_inflate(base64.b64decode(r_cn_encoded)).decode("utf-8", errors="replace")
    except Exception:  # noqa: BLE001
        return []
    if not xml:
        return []

    markets: list[dict] = []

    # <ratio_re>/<hratio> are stored ABSOLUTE; <strong>=H means the home team
    # gives the handicap (home-perspective line is NEGATIVE). Restore the sign
    # so the home leg is signed and settlement/display match reality. Mirror of
    # api_v2.php parseRcnMarkets().
    strong = (_tag(xml, "strong") or "").strip().upper()

    def _sign_home(line: float) -> float:
        return -line if strong == "H" else line

    # ML (1X2) — ior_MH / ior_MC / ior_MN
    ml_h = _f(_tag(xml, "ior_MH"))
    ml_c = _f(_tag(xml, "ior_MC"))
    ml_n = _f(_tag(xml, "ior_MN"))
    if ml_h > 0:
        markets.append({
            "market_name": "ML",
            "odds": [{"home": ml_h, "draw": ml_n, "away": ml_c}],
        })

    # Spread — ior_REH / ior_REC + ratio_re
    sp_h = _f(_tag(xml, "ior_REH"))
    sp_c = _f(_tag(xml, "ior_REC"))
    sp_l = _f(_tag(xml, "ratio_re"))
    if sp_h > 0:
        markets.append({
            "market_name": "Spread",
            "odds": [{"hdp": _sign_home(sp_l), "home": sp_h, "away": sp_c}],
        })

    # Totals — ior_OUH / ior_OUC + ratio_o
    ou_o = _f(_tag(xml, "ior_OUH"))
    ou_u = _f(_tag(xml, "ior_OUC"))
    ou_l = _f(_tag(xml, "ratio_o"))
    if ou_o > 0:
        markets.append({
            "market_name": "Totals",
            "odds": [{"hdp": ou_l or 2.5, "over": ou_o, "under": ou_u}],
        })

    # Half-Time ML
    htm_h = _f(_tag(xml, "ior_HMH"))
    htm_c = _f(_tag(xml, "ior_HMC"))
    htm_n = _f(_tag(xml, "ior_HMN"))
    if htm_h > 0:
        markets.append({
            "market_name": "Half Time Result",
            "odds": [{"home": htm_h, "draw": htm_n, "away": htm_c}],
        })

    # Half-Time Spread
    hsp_h = _f(_tag(xml, "ior_HRH"))
    hsp_c = _f(_tag(xml, "ior_HRC"))
    hsp_l = _f(_tag(xml, "hratio"))
    if hsp_h > 0:
        markets.append({
            "market_name": "Spread HT",
            "odds": [{"hdp": _sign_home(hsp_l), "home": hsp_h, "away": hsp_c}],
        })

    # Half-Time Totals
    hou_o = _f(_tag(xml, "ior_HOUH"))
    hou_u = _f(_tag(xml, "ior_HOUC"))
    hou_l = _f(_tag(xml, "ratio_ho"))
    if hou_o > 0:
        markets.append({
            "market_name": "Totals HT",
            "odds": [{"hdp": hou_l or 1.25, "over": hou_o, "under": hou_u}],
        })

    # Corners Totals
    co_o = _f(_tag(xml, "ior_AOUO"))
    co_u = _f(_tag(xml, "ior_AOUU"))
    co_l = _f(_tag(xml, "ratio_aouo"))
    if co_o > 0:
        markets.append({
            "market_name": "Corners Totals",
            "odds": [{"hdp": co_l or 9.5, "over": co_o, "under": co_u}],
        })

    # Double Chance — writer (OddsApiToCrownXml::blockMain) emits
    # ``ior_DCHN`` (1X home-or-draw), ``ior_DCCN`` (X2 away-or-draw — note
    # the Crown tag is C-then-N, not N-then-C), ``ior_DCHC`` (12 home-or-
    # away).  Historic versions of this parser read ``ior_DCNC`` which
    # never exists in the XML, so the X2 leg silently defaulted to 0 for
    # every match.
    dc_hn = _f(_tag(xml, "ior_DCHN"))
    dc_hc = _f(_tag(xml, "ior_DCHC"))
    dc_cn = _f(_tag(xml, "ior_DCCN"))
    if dc_hn > 0:
        markets.append({
            "market_name": "Double Chance",
            "odds": [
                {"label": "Home or Draw", "under": dc_hn},
                {"label": "Home or Away", "under": dc_hc},
                {"label": "Draw or Away", "under": dc_cn},
            ],
        })

    # Correct Score — <PD> block.  Writer
    # (OddsApiToCrownXml::blockCorrectScore) emits one ``<ior_HhCc>price``
    # tag per scoreline (e.g. ``<ior_H1C0>5.5</ior_H1C0>`` for a 1-0
    # result).  Earlier this regex looked for ``<S1_0>`` style tags that
    # never exist, so Correct Score was silently dropped from every
    # match's market list — every league capped at 11 markets despite
    # upstream Odds-API.io returning 23+ correct-score outcomes.
    pd_block = re.search(r"<PD>(.*?)</PD>", xml, re.IGNORECASE | re.DOTALL)
    if pd_block:
        score_rows: list[dict] = []
        for m in re.finditer(r"<ior_H(\d+)C(\d+)>([\d.]+)</ior_H\1C\2>",
                             pd_block.group(1), re.IGNORECASE):
            price = _f(m.group(3))
            if price > 0:
                score_rows.append({
                    "label": f"{m.group(1)}-{m.group(2)}",
                    "odds": price,
                })
        if score_rows:
            markets.append({"market_name": "Correct Score", "odds": score_rows})

    # Draw No Bet — ior_BHH / ior_BHC
    bh_h = _f(_tag(xml, "ior_BHH"))
    bh_c = _f(_tag(xml, "ior_BHC"))
    if bh_h > 0:
        markets.append({
            "market_name": "Draw No Bet",
            "odds": [{"home": bh_h, "away": bh_c}],
        })

    # Both Teams To Score — ior_TSY / ior_TSN
    ts_y = _f(_tag(xml, "ior_TSY"))
    ts_n = _f(_tag(xml, "ior_TSN"))
    if ts_y > 0:
        markets.append({
            "market_name": "Both Teams To Score",
            "odds": [{"yes": ts_y, "no": ts_n}],
        })

    # Both Teams To Score HT — ior_HTSY / ior_HTSN
    hts_y = _f(_tag(xml, "ior_HTSY"))
    hts_n = _f(_tag(xml, "ior_HTSN"))
    if hts_y > 0:
        markets.append({
            "market_name": "Both Teams To Score HT",
            "odds": [{"yes": hts_y, "no": hts_n}],
        })

    # ---- Extended markets (2026-05-24) -------------------------------------
    # Writer: OddsApiToCrownXml::blockExtended().  Multi-row markets use
    # `|`-row / `#`-field delimited list inside <X_LIST> tags; single-row
    # markets use ior_/ratio_ tag pairs.  Keep this in lockstep with the PHP
    # `parseRcnMarkets()` reader in api_v2.php.
    def _parse_list_rows(list_str: str, n_fields: int) -> list[list[str]]:
        rows = []
        for cell in list_str.split("|"):
            parts = cell.split("#")
            if len(parts) < n_fields:
                continue
            rows.append(parts)
        return rows

    # Anytime Goalscorer — list of {player, odds}
    ags_list = _tag(xml, "AGS_LIST")
    if ags_list:
        ags_rows = []
        for parts in _parse_list_rows(ags_list, 2):
            name = html.unescape(parts[0]).strip()
            price = _f(parts[1])
            if not name or price <= 0:
                continue
            ags_rows.append({"label": name, "odds": price})
        if ags_rows:
            markets.append({"market_name": "Anytime Goalscorer", "odds": ags_rows})

    # Bookings Totals — single line
    btl_o = _f(_tag(xml, "ior_BTLO"))
    btl_u = _f(_tag(xml, "ior_BTLU"))
    btl_l = _f(_tag(xml, "ratio_btl"))
    if btl_o > 0:
        markets.append({
            "market_name": "Bookings Totals",
            "odds": [{"hdp": btl_l, "over": btl_o, "under": btl_u}],
        })

    # Bookings Spread — single line
    bsp_h = _f(_tag(xml, "ior_BSPH"))
    bsp_c = _f(_tag(xml, "ior_BSPC"))
    bsp_l = _f(_tag(xml, "ratio_bsp"))
    if bsp_h > 0:
        markets.append({
            "market_name": "Bookings Spread",
            "odds": [{"hdp": bsp_l, "home": bsp_h, "away": bsp_c}],
        })

    # Corners Spread — single line
    csp_h = _f(_tag(xml, "ior_CSPH"))
    csp_c = _f(_tag(xml, "ior_CSPC"))
    csp_l = _f(_tag(xml, "ratio_csp"))
    if csp_h > 0:
        markets.append({
            "market_name": "Corners Spread",
            "odds": [{"hdp": csp_l, "home": csp_h, "away": csp_c}],
        })

    # Alternative Goal Line — multi-row over/under
    agl_list = _tag(xml, "AGL_LIST")
    if agl_list:
        agl_rows = []
        for parts in _parse_list_rows(agl_list, 3):
            agl_rows.append({"hdp": _f(parts[0]), "over": _f(parts[1]), "under": _f(parts[2])})
        if agl_rows:
            markets.append({"market_name": "Alternative Goal Line", "odds": agl_rows})

    # Alternative Total Goals — multi-row over/under
    atg_list = _tag(xml, "ATG_LIST")
    if atg_list:
        atg_rows = []
        for parts in _parse_list_rows(atg_list, 3):
            atg_rows.append({"hdp": _f(parts[0]), "over": _f(parts[1]), "under": _f(parts[2])})
        if atg_rows:
            markets.append({"market_name": "Alternative Total Goals", "odds": atg_rows})

    # European Handicap — multi-row 3-way
    w3m_list = _tag(xml, "W3M_LIST")
    if w3m_list:
        w3_rows = []
        for parts in _parse_list_rows(w3m_list, 4):
            w3_rows.append({
                "hdp":  _f(parts[0]),
                "home": _f(parts[1]),
                "draw": _f(parts[2]),
                "away": _f(parts[3]),
            })
        if w3_rows:
            markets.append({"market_name": "European Handicap", "odds": w3_rows})

    now_iso = _dt.datetime.now(_dt.timezone.utc).isoformat(timespec="seconds")
    now_ts = int(time.time())
    out: list[dict] = []
    for i, m in enumerate(markets, start=1):
        out.append({
            "market_id":     f"{i:06d}",
            "market_id_int": i,
            # Emit both `name` (WS-style, used by _main_odds_from_ws_snap)
            # AND `market_name` (PHP-parseRcnMarkets-style, used by the
            # detail endpoint).  They are always the same string; carry
            # both so downstream code doesn't have to know which it gets.
            "name":          m["market_name"],
            "market_name":   m["market_name"],
            "odds":          m["odds"],
            "updated_at_iso": now_iso,
            "updated_at_ts":  now_ts,
        })
    return out
