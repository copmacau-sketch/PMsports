#!/usr/bin/env python3
"""Idempotent, anchored patch for goalserve_inplay.py.

Adds the live betting cutoff (close full-time board 5' before FT, close
1st-half board 5' before HT) plus a degenerate-1X2 guard, applied at the
single snapshot chokepoint normalize_event() (shared by the WS relay and the
REST poller) and reinforced in apply_ladder_correction() so the full-time
cutoff is not undone by ladder-cache restoration.

Usage:
    python3 _patch_gs_cutoff.py [TARGET_FILE]

Default TARGET_FILE = /opt/pmppm-com/api/backend/app/goalserve_inplay.py
The script verifies every anchor occurs exactly once; if any anchor is
missing it aborts WITHOUT writing, so production is never corrupted.
A timestamped .bak is written before any change.
"""
import io
import os
import py_compile
import shutil
import sys
import time

TARGET = sys.argv[1] if len(sys.argv) > 1 else "/opt/pmppm-com/api/backend/app/goalserve_inplay.py"

SENTINEL = "_betting_cutoffs"  # idempotency marker

HELPERS = '''# --------------------------------------------------------------------------
# Live betting cutoff + degenerate-1X2 guard.
#
# Goalserve keeps the 1X2 (market 1777) and other full-time markets open even
# when a result is all but decided, quoting degenerate prices (favourite near
# 1.00, long-shots clamped to the feed ceiling near 51) WITHOUT setting the
# per-market suspend flag.   Two rules close these so the board never offers a
# dead price:
#   * time cutoff  -- full-time markets close 5 min before the 90-min whistle
#                     (minute >= 85 in the 2nd half); 1st-half markets close
#                     5 min before the 45-min whistle (minute >= 40 in 1H).
#   * degenerate   -- a 1X2 whose favourite is <= GS_DEGEN_FAV_MAX, or any of
#                     whose legs reaches the GS_DEGEN_CEILING ceiling, is dead
#                     and gets suspended outright.
GS_FT_CUTOFF_MIN = int(os.environ.get("GS_FT_CUTOFF_MIN", "85"))
GS_HT_CUTOFF_MIN = int(os.environ.get("GS_HT_CUTOFF_MIN", "40"))
GS_DEGEN_FAV_MAX = float(os.environ.get("GS_DEGEN_FAV_MAX", "1.01"))
GS_DEGEN_CEILING = float(os.environ.get("GS_DEGEN_CEILING", "50"))


def _lead_minute(v):
    """Leading integer minute, tolerant of stoppage forms like 45+2."""
    s = str(v if v is not None else "").strip()
    num = ""
    for ch in s:
        if ch.isdigit():
            num += ch
        else:
            break
    return int(num) if num else None


def _is_first_half_market(name):
    """True for 1st-half / half-time markets (settle at the HT whistle).
    2nd-half markets settle at full time and count as full-time markets."""
    n = (name or "").lower()
    if "2nd half" in n or "second half" in n:
        return False
    return (
        "1st half" in n or "first half" in n or "half time" in n
        or "halftime" in n or "(1h)" in n
    )


def _betting_cutoffs(status_short, minute):
    """Return (full_time_closed, first_half_closed) for the live cutoff rule."""
    full = ht = False
    mn = _lead_minute(minute)
    if mn is None:
        return full, ht
    # Goalserve half label is unreliable here (every live match reports
    # "1H"); the minute is a continuous match clock, so the windows are
    # clock-based: 1st-half board closes in [40,45]; full-time board closes
    # from 85 onward (both 5 min before their whistle).
    if GS_HT_CUTOFF_MIN <= mn <= 45:
        ht = True
    if mn >= GS_FT_CUTOFF_MIN:
        full = True
    return full, ht


def _is_degenerate_1x2(market):
    """Detect a dead 1X2 from the raw Goalserve market dict: favourite leg
    <= GS_DEGEN_FAV_MAX, or any active leg at/over GS_DEGEN_CEILING."""
    vals = []
    for p in _participants(market):
        if str(p.get("suspend")) == "1":
            continue
        try:
            v = float(p.get("value_eu"))
        except (TypeError, ValueError):
            continue
        if v > 0:
            vals.append(v)
    if len(vals) < 2:
        return False
    return min(vals) <= GS_DEGEN_FAV_MAX or max(vals) >= GS_DEGEN_CEILING


'''

# Each entry: (description, old, new)
REPLACEMENTS = [
    (
        "R1: insert helpers before normalize_event",
        'def normalize_event(gsid: str, ev: dict) -> "dict | None":\n'
        '    """Project one Goalserve event into the OddsEvent snapshot dict."""',
        HELPERS +
        'def normalize_event(gsid: str, ev: dict) -> "dict | None":\n'
        '    """Project one Goalserve event into the OddsEvent snapshot dict."""',
    ),
    (
        "R2: compute cutoff flags before the markets loop",
        '    extra: "list[dict]" = []\n'
        '    for gs_key, market in odds.items():',
        '    extra: "list[dict]" = []\n'
        '    _full_cutoff, _ht_cutoff = _betting_cutoffs(status_short, info.get("minute"))\n'
        '    for gs_key, market in odds.items():',
    ),
    (
        "R3: reorder name resolution + apply suspend on cutoff/degenerate",
        '        canon = GS_CANON.get(mid_int) if mid_int is not None else None\n'
        '        if canon:\n'
        '            canon_markets.append({"name": canon, "odds": _canon_row(canon, market)})\n'
        '        bookmaker_markets.append(_passthrough_market(str(market.get("id") or gs_key), market))\n'
        '        _mi = mid_int if isinstance(mid_int, int) else 0\n'
        '        nm = (market.get("name") or canon\n'
        '              or GS_NAME_CACHE.get(_mi) or GS_STATIC_NAMES.get(_mi)\n'
        '              or str(gs_key))\n'
        '        if (canon or nm) not in _INLINED:\n'
        '            extra.append({"name": nm, "outcomes": len(_participants(market))})',
        '        canon = GS_CANON.get(mid_int) if mid_int is not None else None\n'
        '        _mi = mid_int if isinstance(mid_int, int) else 0\n'
        '        nm = (market.get("name") or canon\n'
        '              or GS_NAME_CACHE.get(_mi) or GS_STATIC_NAMES.get(_mi)\n'
        '              or str(gs_key))\n'
        '        # Live betting cutoff + degenerate-1X2 guard: flag the raw market\n'
        '        # suspended so _canon_row / _passthrough_market zero its prices, which\n'
        '        # keeps the display main_odds and the /markets bet source in agreement.\n'
        '        _fh = _is_first_half_market(nm)\n'
        '        if ((_ht_cutoff and _fh)\n'
        '                or (_full_cutoff and not _fh)\n'
        '                or (mid_int == 1777 and _is_degenerate_1x2(market))):\n'
        '            market = {**market, "suspend": "1"}\n'
        '        if canon:\n'
        '            canon_markets.append({"name": canon, "odds": _canon_row(canon, market)})\n'
        '        bookmaker_markets.append(_passthrough_market(str(market.get("id") or gs_key), market))\n'
        '        if (canon or nm) not in _INLINED:\n'
        '            extra.append({"name": nm, "outcomes": len(_participants(market))})',
    ),
    (
        "R4: persist cutoff flags on the snapshot",
        '        "main_odds": mo,\n'
        '        "extra_markets": extra,',
        '        "main_odds": mo,\n'
        '        "_betting_cutoff": {"ft": _full_cutoff, "ht": _ht_cutoff},\n'
        '        "extra_markets": extra,',
    ),
    (
        "R5: ladder-correction guard (no Plan A restore after FT cutoff)",
        '    mo = snap.get("main_odds")\n'
        '    cached = LADDER_MAIN_CACHE.get(gid)\n'
        '    fresh = bool(cached and (time.time() - cached.get("_ts", 0)) < GS_LADDER_TTL)\n'
        '    cmo = cached["mo"] if fresh else {}',
        '    mo = snap.get("main_odds")\n'
        '    cached = LADDER_MAIN_CACHE.get(gid)\n'
        '    fresh = bool(cached and (time.time() - cached.get("_ts", 0)) < GS_LADDER_TTL)\n'
        '    cmo = cached["mo"] if fresh else {}\n'
        '\n'
        '    # Live betting cutoff: once the full-time board has closed, never restore\n'
        '    # (Plan A) or re-merge cached full-time ladder lines.\n'
        '    _bc = snap.get("_betting_cutoff") or {}\n'
        '    _ft_closed = bool(_bc.get("ft"))\n'
        '    if _ft_closed and isinstance(mo, dict):\n'
        '        for _a, _b, _ln in _LADDER_GROUPS:\n'
        '            mo.pop(_a, None)\n'
        '            mo.pop(_b, None)\n'
        '            mo.pop(_ln, None)\n'
        '        cmo = {}',
    ),
    (
        "R6: skip cached-ladder detail merge after FT cutoff",
        '    cached_m = LADDER_MARKETS_CACHE.get(gid)\n'
        '    if cached_m and (time.time() - cached_m.get("_ts", 0)) < GS_LADDER_TTL:',
        '    cached_m = LADDER_MARKETS_CACHE.get(gid)\n'
        '    if cached_m and not _ft_closed and (time.time() - cached_m.get("_ts", 0)) < GS_LADDER_TTL:',
    ),
]


def main():
    if not os.path.isfile(TARGET):
        print("ABORT: target not found:", TARGET)
        return 2
    with io.open(TARGET, "r", encoding="utf-8") as fh:
        src = fh.read()

    if SENTINEL in src:
        print("SKIP: already patched (sentinel present):", TARGET)
        return 0

    # verify every anchor occurs exactly once
    for desc, old, _new in REPLACEMENTS:
        c = src.count(old)
        if c != 1:
            print("ABORT: anchor count != 1 (got %d) for %s" % (c, desc))
            return 3

    out = src
    for _desc, old, new in REPLACEMENTS:
        out = out.replace(old, new, 1)

    bak = "%s.bak-cutoff-%s" % (TARGET, time.strftime("%Y%m%d-%H%M%S"))
    shutil.copy2(TARGET, bak)
    tmp = TARGET + ".tmp-cutoff"
    with io.open(tmp, "w", encoding="utf-8") as fh:
        fh.write(out)
    # syntax check before swapping in
    try:
        py_compile.compile(tmp, doraise=True)
    except py_compile.PyCompileError as e:
        print("ABORT: patched file failed to compile:\n", e)
        os.remove(tmp)
        return 4
    os.replace(tmp, TARGET)
    print("OK: patched", TARGET)
    print("backup:", bak)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
