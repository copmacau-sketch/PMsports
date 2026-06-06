"""Write Goalserve events into Crown's money pipeline (foot_match + r_cn).

This is the keystone of the "replace limitless with Goalserve" cutover. By
landing every Goalserve event (keyed by its Goalserve id as ``gid``) into
``db_sports.foot_match`` + ``foot_match_xml.r_cn`` + a ``foot_league`` row, the
ENTIRE existing stack works unchanged:

* **Display** — both ``/sports`` (FastAPI ``/events``) and ``/h5`` (PHP
  ``api_v2.php``) read events from ``foot_match`` and markets from ``r_cn``.
* **Place-bet** — ``api_v2.php`` validates odds via
  ``fetchFastApiOddsContext($gid)`` → FastAPI ``/events/{gid}/markets`` (which
  reads the same ``r_cn``), and requires the gid to exist in ``foot_match``
  (else it hits the outright bypass and skips validation).
* **Settlement** — handled separately (see ``settle_bets.php`` Goalserve
  branch) off the scores we write here.

r_cn format (mirrors ``OddsApiToCrownXml.php`` / ``rcn_parser.py``):
``base64(gzdeflate(xml))`` where xml is Crown's flat ``<ior_*>`` tag soup. We
build it straight from the ``main_odds`` dict the pollers already project, so
there is exactly one odds projection shared by display + betting.

SAFETY: ``GS_DB_WRITE`` gates ALL writes (default OFF). With it off this module
is import-safe and ``upsert_event`` is a no-op that still returns the row it
*would* have written (used by the dry-run test + the pollers' optional hook).

lid scheme: Goalserve leagues get ``lid = GS_LID_BASE + goalserve_league_id``
(default base 800000) and a lazily-upserted ``foot_league`` row (enabled=1) so
the lid whitelist (``enabled_lids_sql`` / ``cgLidFilterSql``) lets them through.
"""
from __future__ import annotations

import base64
import logging
import os
import time
import zlib

log = logging.getLogger("goalserve_dbwriter")

GS_DB_WRITE = os.environ.get("GS_DB_WRITE", "0").strip().lower() in ("1", "true", "yes")
GS_LID_BASE = int(os.environ.get("GS_LID_BASE", "800000"))
GS_MAXGOLD = int(os.environ.get("GS_MAXGOLD", "100000"))

import re as _re

# Esports (simulated FIFA / eFootball) leagues — Goalserve names them
# "Esoccer Battle - 8 mins play", "Esoccer H2H GG League - 8 mins play",
# "Esoccer GT Leagues – 12 mins play", etc.  These are NOT real football and
# are hidden from the product.  Match is case-insensitive on the league name.
_ESPORTS_RE = _re.compile(
    r"(e-?soccer|e-?football|esports?|cyber|\bgt leagues\b|mins?\s+play)",
    _re.IGNORECASE,
)


def is_esports_league(name: "str | None") -> bool:
    """True when the league name looks like an esports / simulated-football
    competition that should be hidden everywhere."""
    return bool(name and _ESPORTS_RE.search(name))


def _n(v) -> float:
    try:
        f = float(v)
        return f if f > 0 else 0.0
    except (TypeError, ValueError):
        return 0.0


def _add(parts: list, tag: str, val) -> None:
    parts.append(f"<{tag}>{val}</{tag}>")


def build_rcn(main_odds: "dict | None") -> str:
    """Encode a ``main_odds`` projection into Crown's base64(gzdeflate(xml))
    r_cn payload. Returns "" when there are no priceable markets.

    Tag map is the inverse of ``rcn_parser.parse_rcn_markets`` so the round
    trip is loss-free for the markets Crown surfaces.
    """
    mo = main_odds or {}
    parts: list[str] = ["<game>"]

    # Spread sign: re_line is signed home-perspective. Crown stores ABSOLUTE
    # ratio_re + a single <strong> (H = home gives handicap → negative home
    # line). Derive strong from the full-time spread; HT spread shares it.
    re_h = _n(mo.get("re_h"))
    re_line = mo.get("re_line")
    strong = ""
    if re_h > 0 and re_line is not None:
        strong = "H" if float(re_line) < 0 else "C"
    if strong:
        _add(parts, "strong", strong)

    # ML
    if _n(mo.get("m_h")) > 0:
        _add(parts, "ior_MH", _n(mo.get("m_h")))
        _add(parts, "ior_MC", _n(mo.get("m_c")))
        _add(parts, "ior_MN", _n(mo.get("m_n")))
    # Spread
    if re_h > 0:
        _add(parts, "ratio_re", abs(float(re_line or 0)))
        _add(parts, "ior_REH", re_h)
        _add(parts, "ior_REC", _n(mo.get("re_c")))
    # Totals
    if _n(mo.get("ou_over")) > 0:
        _add(parts, "ratio_o", _n(mo.get("ou_line")) or 2.5)
        _add(parts, "ior_OUH", _n(mo.get("ou_over")))
        _add(parts, "ior_OUC", _n(mo.get("ou_under")))
    # Half Time Result — `_main_odds_from_ws_snap` emits ht_h/ht_n/ht_c
    if _n(mo.get("ht_h")) > 0:
        _add(parts, "ior_HMH", _n(mo.get("ht_h")))
        _add(parts, "ior_HMC", _n(mo.get("ht_c")))
        _add(parts, "ior_HMN", _n(mo.get("ht_n")))
    # Spread HT
    if _n(mo.get("reh_h")) > 0:
        rehl = mo.get("reh_line")
        # If FT strong unknown, derive from HT line so the sign is still right.
        if not strong and rehl is not None:
            _add(parts, "strong", "H" if float(rehl) < 0 else "C")
        _add(parts, "hratio", abs(float(rehl or 0)))
        _add(parts, "ior_HRH", _n(mo.get("reh_h")))
        _add(parts, "ior_HRC", _n(mo.get("reh_c")))
    # Totals HT — `_main_odds_from_ws_snap` emits ouh_over/ouh_under/ouh_line
    if _n(mo.get("ouh_over")) > 0:
        _add(parts, "ratio_ho", _n(mo.get("ouh_line")) or 1.25)
        _add(parts, "ior_HOUH", _n(mo.get("ouh_over")))
        _add(parts, "ior_HOUC", _n(mo.get("ouh_under")))
    # Draw No Bet
    if _n(mo.get("dnb_h")) > 0:
        _add(parts, "ior_BHH", _n(mo.get("dnb_h")))
        _add(parts, "ior_BHC", _n(mo.get("dnb_c")))
    # Both Teams To Score
    if _n(mo.get("btts_yes")) > 0:
        _add(parts, "ior_TSY", _n(mo.get("btts_yes")))
        _add(parts, "ior_TSN", _n(mo.get("btts_no")))
    # Both Teams To Score HT
    if _n(mo.get("btts_ht_yes")) > 0:
        _add(parts, "ior_HTSY", _n(mo.get("btts_ht_yes")))
        _add(parts, "ior_HTSN", _n(mo.get("btts_ht_no")))
    # Double Chance
    if _n(mo.get("dc_1x")) > 0:
        _add(parts, "ior_DCHN", _n(mo.get("dc_1x")))
        _add(parts, "ior_DCHC", _n(mo.get("dc_12")))
        _add(parts, "ior_DCCN", _n(mo.get("dc_x2")))
    # Corners Totals
    if _n(mo.get("corners_over")) > 0:
        _add(parts, "ratio_aouo", _n(mo.get("corners_line")) or 9.5)
        _add(parts, "ior_AOUO", _n(mo.get("corners_over")))
        _add(parts, "ior_AOUU", _n(mo.get("corners_under")))
    # Correct Score (波胆) — <PD> block of <ior_HhCc>price tags, the inverse
    # of rcn_parser / PHP's PD parser.  Labels arrive as "H-A".
    cs = mo.get("cs")
    if isinstance(cs, list):
        cs_tags: list[str] = []
        for row in cs:
            if not isinstance(row, dict):
                continue
            m = _re.match(r"^(\d+)-(\d+)$", str(row.get("label") or ""))
            price = _n(row.get("price"))
            if m and price > 0:
                cs_tags.append(f"<ior_H{m.group(1)}C{m.group(2)}>{price}</ior_H{m.group(1)}C{m.group(2)}>")
        if cs_tags:
            parts.append("<PD>" + "".join(cs_tags) + "</PD>")

    parts.append("</game>")
    # nothing but the wrapper → no markets
    if len(parts) <= 2:
        return ""
    xml = "".join(parts)
    co = zlib.compressobj(9, zlib.DEFLATED, -15)
    raw = co.compress(xml.encode("utf-8")) + co.flush()
    return base64.b64encode(raw).decode("ascii")


def lid_for(snap: dict) -> int:
    raw = str(snap.get("league_slug") or "").strip()
    try:
        return GS_LID_BASE + int(raw)
    except ValueError:
        # non-numeric slug → stable hash into a high band
        return GS_LID_BASE + 500000 + (abs(hash(raw)) % 100000)


def foot_match_values(snap: dict) -> dict:
    """Build the column→value map for a foot_match upsert."""
    lid = lid_for(snap)
    ts = int(snap.get("commence_ts") or 0)
    status_txt = (snap.get("status") or "").lower()
    is_inplay = status_txt in ("inplay", "live")
    is_finished = bool(snap.get("is_finished"))
    home = snap.get("home") or ""
    away = snap.get("away") or ""
    league = snap.get("league_name") or ""
    sh = snap.get("score_home")
    sc = snap.get("score_away")
    has_score = sh is not None and sc is not None
    strong = ""
    rcn = build_rcn(snap.get("main_odds"))
    # recover strong written into r_cn for the row's `strong` column
    mo = snap.get("main_odds") or {}
    if _n(mo.get("re_h")) > 0 and mo.get("re_line") is not None:
        strong = "H" if float(mo["re_line"]) < 0 else "C"
    lt = time.gmtime(ts) if ts else time.gmtime()
    out = {
        "gid": int(snap["id"]),
        "lid": lid,
        "datetime": ts,
        "league": league[:100],
        "league_en": league[:100],
        "team_h": home[:100],
        "team_c": away[:100],
        "team_h_en": home[:100],
        "team_c_en": away[:100],
        "m_date": time.strftime("%Y-%m-%d", lt),
        "m_time": time.strftime("%H:%M", lt),
        "status": 1 if is_inplay else 0,
        "is_inball": 1 if is_finished else 0,
        "is_score": 1 if has_score else 0,
        "score_h": int(sh) if has_score else None,
        "score_c": int(sc) if has_score else None,
        "inball_h": int(sh) if has_score else None,
        "inball_c": int(sc) if has_score else None,
        "strong": strong,
        "maxgold": GS_MAXGOLD,
        "display": 1,
        "fopen": 1,
        "cancel": 0,
        "_r_cn": rcn,
    }
    # Live stats — corners / cards / fouls / shots.  These mirror the
    # ``apisports_*`` columns Crown's stats cron normally populates, so
    # both FastAPI (list_events) and the H5 frontend pick them up
    # unchanged.  We only set them when the snapshot actually carries
    # the stat (so we don't clobber an apisports-supplied value with
    # NULL for the same gid).
    stat_map = (
        ("yc_home",      "apisports_yc_h"),
        ("yc_away",      "apisports_yc_c"),
        ("rc_home",      "apisports_rc_h"),
        ("rc_away",      "apisports_rc_c"),
        ("corners_home", "apisports_corners_h"),
        ("corners_away", "apisports_corners_c"),
        ("fouls_home",   "apisports_fouls_h"),
        ("fouls_away",   "apisports_fouls_c"),
        ("shots_home",   "apisports_shots_h"),
        ("shots_away",   "apisports_shots_c"),
    )
    any_stat = False
    for src, dst in stat_map:
        v = snap.get(src)
        if v is None:
            continue
        try:
            out[dst] = int(v)
            any_stat = True
        except (TypeError, ValueError):
            pass
    if any_stat:
        # Bypasses the FastAPI staleness gate (`_APISPORTS_STATS_MAX_AGE_SEC`).
        out["apisports_stats_seen_at"] = snap.get("apisports_stats_seen_at") or int(time.time())
    # Elapsed minute + status period + HT score — full game-state parity
    # with the api-sports `--live-only` cron, so once api-sports is retired
    # the live ticker, HT-market expiry and HT-correct-score settlement all
    # work off Goalserve alone.  `_mysql_row_to_event` reads these columns.
    now_ts = int(time.time())
    if snap.get("elapsed_minute") is not None:
        try:
            out["apisports_elapsed"] = int(snap["elapsed_minute"])
            out["apisports_seen_at"] = now_ts
        except (TypeError, ValueError):
            pass
    if snap.get("status_short"):
        out["apisports_status"] = str(snap["status_short"])[:8]
        out["apisports_seen_at"] = now_ts
    sh_ht = snap.get("score_home_ht")
    sa_ht = snap.get("score_away_ht")
    if sh_ht is not None and sa_ht is not None:
        try:
            out["apisports_score_ht_h"] = int(sh_ht)
            out["apisports_score_ht_c"] = int(sa_ht)
        except (TypeError, ValueError):
            pass
    return out


def foot_league_values(snap: dict) -> dict:
    lid = lid_for(snap)
    raw = str(snap.get("league_slug") or "").strip()
    name = snap.get("league_name") or f"Goalserve {raw}"
    # Esports leagues are tracked but DISABLED so the enabled-lid whitelist
    # (enabled_lids_sql / cgLidFilterSql) hides every match under them in both
    # FastAPI (/events) and PHP (api_v2.php).
    enabled = 0 if is_esports_league(name) else 1
    return {
        "lid": lid,
        "slug": f"gs-{raw}" if raw else f"gs-lid-{lid}",
        "name_en": name[:100],
        "name_cn": "",
        "region": "other",
        "country": "other",
        "flag": "",
        "priority": 80,
        "enabled": enabled,
    }


def upsert_event(snap: dict, *, dry_run: "bool | None" = None) -> dict:
    """Upsert one Goalserve event into foot_match + foot_match_xml + foot_league.

    Returns ``{"fm": <foot_match values>, "fl": <foot_league values>,
    "wrote": bool}``.  When writes are disabled (``GS_DB_WRITE`` off or
    ``dry_run=True``) nothing touches the DB.
    """
    fm = foot_match_values(snap)
    fl = foot_league_values(snap)
    do_write = GS_DB_WRITE if dry_run is None else (not dry_run)
    if not do_write:
        return {"fm": fm, "fl": fl, "wrote": False}

    from . import mysqldb
    rcn = fm.pop("_r_cn", "")
    # foot_league upsert — always done so esports leagues get flipped to
    # enabled=0 (which hides their matches via the lid whitelist).
    fl_cols = list(fl.keys())
    fl_ph = ",".join(["%s"] * len(fl_cols))
    fl_upd = ",".join(f"{c}=VALUES({c})" for c in fl_cols if c != "lid")
    mysqldb.execute(
        f"INSERT INTO foot_league ({','.join(fl_cols)}) VALUES ({fl_ph}) "
        f"ON DUPLICATE KEY UPDATE {fl_upd}",
        tuple(fl[c] for c in fl_cols),
    )
    # Esports: skip the foot_match / r_cn writes entirely.  The disabled
    # league row above already hides any pre-existing matches.
    if int(fl.get("enabled", 1)) == 0:
        fm["_r_cn"] = rcn
        return {"fm": fm, "fl": fl, "wrote": False, "skipped": "esports"}
    # foot_match upsert
    fm_cols = list(fm.keys())
    fm_ph = ",".join(["%s"] * len(fm_cols))
    fm_upd = ",".join(f"`{c}`=VALUES(`{c}`)" for c in fm_cols if c != "gid")
    mysqldb.execute(
        f"INSERT INTO foot_match ({','.join('`'+c+'`' for c in fm_cols)}) "
        f"VALUES ({fm_ph}) ON DUPLICATE KEY UPDATE {fm_upd}",
        tuple(fm[c] for c in fm_cols),
    )
    # r_cn upsert
    if rcn:
        mysqldb.execute(
            "INSERT INTO foot_match_xml (gid, m_date, r_cn, is_r, r_up_time, r_display) "
            "VALUES (%s,%s,%s,1,%s,1) "
            "ON DUPLICATE KEY UPDATE r_cn=VALUES(r_cn), is_r=1, "
            "r_up_time=VALUES(r_up_time), r_display=1",
            (fm["gid"], fm["m_date"], rcn, int(time.time())),
        )
    fm["_r_cn"] = rcn
    return {"fm": fm, "fl": fl, "wrote": True}


def finalize_stale_gs(
    *,
    silence_sec: int = 900,
    min_age_sec: int = 7200,
    elapsed_min: int = 85,
) -> int:
    """Flip finished-but-unfinalised Goalserve matches to ``is_inball=1``.

    Goalserve drops finished matches from the live feed *without* always
    sending an FT (`stp` 7/8) frame, so they get stuck at ``status=1,
    is_inball=0`` ("zombies") and never settle.  ``inball_h/c`` already
    track the last live score on every write (see ``foot_match_values``),
    so finalisation only needs to set ``is_inball`` and copy the HT score
    into ``inball_h_hr/c_hr`` for half-time-market settlement.

    A row is finalised only when it has gone *silent* (``apisports_seen_at``
    older than ``silence_sec`` — the GS feed stopped touching it) AND it
    either kicked off > ``min_age_sec`` ago OR was last seen at/near
    full-time (``apisports_elapsed >= elapsed_min``).  The caller MUST gate
    this on overall feed health (a recent WS message) so a connection
    outage can't mass-finalise genuinely-live matches.  Returns rows
    affected.
    """
    if not GS_DB_WRITE:
        return 0
    from . import mysqldb

    now = int(time.time())
    sql = (
        "UPDATE foot_match SET "
        "  is_inball = 1, is_hr_inball = 1, "
        "  inball_h_hr = COALESCE(inball_h_hr, apisports_score_ht_h), "
        "  inball_c_hr = COALESCE(inball_c_hr, apisports_score_ht_c) "
        "WHERE lid >= %s AND status = 1 AND is_inball = 0 "
        "  AND score_h IS NOT NULL AND score_c IS NOT NULL "
        "  AND apisports_seen_at IS NOT NULL AND apisports_seen_at < %s "
        "  AND ( (`datetime` > 0 AND `datetime` < %s) "
        "        OR (apisports_elapsed IS NOT NULL AND apisports_elapsed >= %s) )"
    )
    try:
        return int(mysqldb.execute(
            sql,
            (GS_LID_BASE, now - int(silence_sec), now - int(min_age_sec), int(elapsed_min)),
        ) or 0)
    except Exception as e:  # noqa: BLE001
        log.warning("finalize_stale_gs failed: %s", e)
        return 0


# --------------------------------------------------------------------------
# Pregame settlement writeback — finalise pregame foot_match rows from the
# Goalserve livescore (``soccernew``) feed.
#
# WHY: pregame bets are placed on the odds-comparison feed's match id
# (``getodds`` ``id`` ~6.5M == foot_match.gid).  Once a match kicks off it
# leaves the pregame set and the IN-PLAY feed owns it under a DIFFERENT id
# (~134M), so the in-play finalizer (``finalize_stale_gs``) only ever flips
# the 134M row.  The 6.5M pregame row never gets a final score → pregame
# bets can be placed but never auto-settle (settle_bets.php PRIORITY-0 keys
# on ``foot_match[gid].is_inball=1`` + ``inball_h/c``).
#
# The livescore feed (``soccernew/home`` and the dated ``soccernew/d-N``
# backstops) shares the SAME id space as ``getodds`` (verified: id range
# 6.4M–7M, id∩getodds large), so we join in-feed ``match@id`` directly to
# ``foot_match.gid`` — an exact key, no fuzzy name matching — and write the
# final score back onto the pregame row.
#
# MONEY-PATH SAFETY:
#  * Prefer the ``<ft score="[h-c]">`` child (the 90-minute / regulation
#    score Crown's 1X2 / handicap / totals settle on).  For ET / penalty
#    statuses WITHOUT an ``<ft>`` child we SKIP (the ``goals`` attribute is
#    end-of-ET and would mis-grade) rather than guess.
#  * HT score only from the authoritative ``<ht score>`` child; absent → HT
#    left NULL so settle_bets conservatively skips HT bets (never mis-grades).
#  * UPDATE is guarded by ``lid >= GS_LID_BASE`` (Goalserve rows only) and
#    ``is_inball = 0`` (idempotent — a finalised row is never rewritten).

# Goalserve livescore status tokens that mean "match over at full time".
_GS_FT_STATUSES = {"ft", "full time"}
# Statuses that ended in extra time / penalties — only finalise these when
# a <ft> child gives the 90-minute score (see SAFETY note above).
_GS_ET_STATUSES = {"aet", "pen.", "pen", "after et", "after extra time", "a.e.t.", "a.e.t", "ap"}
_GS_SCORE_RE = _re.compile(r"(\d+)\s*-\s*(\d+)")


def _parse_bracket_score(s) -> "tuple[int | None, int | None]":
    """Parse a Goalserve ``<ft>``/``<ht>`` ``score="[h-c]"`` attribute."""
    if not s:
        return (None, None)
    m = _GS_SCORE_RE.search(str(s))
    if not m:
        return (None, None)
    return (int(m.group(1)), int(m.group(2)))


def _goals_int(el) -> "int | None":
    if el is None:
        return None
    v = el.get("goals")
    try:
        return int(v) if v not in (None, "") else None
    except (TypeError, ValueError):
        return None


def finalize_results_from_livescore(xml_bytes: bytes) -> dict:
    """Write final (and HT) scores from a Goalserve ``soccernew`` XML payload
    back onto the matching pregame ``foot_match`` rows (gid == feed match id).

    Returns ``{"finished", "finalized", "skipped_et", "errors", "wrote"}``.
    No-op (``wrote=False``) when ``GS_DB_WRITE`` is off.
    """
    if not GS_DB_WRITE:
        return {"finished": 0, "finalized": 0, "skipped_et": 0, "errors": 0, "wrote": False}
    import xml.etree.ElementTree as ET
    from . import mysqldb

    try:
        root = ET.fromstring(xml_bytes)
    except Exception as e:  # noqa: BLE001
        log.warning("finalize_results: xml parse failed: %s", e)
        return {"finished": 0, "finalized": 0, "skipped_et": 0, "errors": 1, "wrote": True}

    finished = finalized = skipped_et = errors = 0
    for m in root.iter("match"):
        status = (m.get("status") or "").strip().lower()
        is_ft = status in _GS_FT_STATUSES
        is_et = status in _GS_ET_STATUSES
        if not (is_ft or is_et):
            continue
        try:
            gid = int(m.get("id"))
        except (TypeError, ValueError):
            continue
        finished += 1

        # FT (90-minute) score: prefer the <ft> child; for plain full-time
        # the localteam/visitorteam goals are the 90-min score too.
        fh = fc = None
        ftn = m.find("ft")
        if ftn is not None:
            fh, fc = _parse_bracket_score(ftn.get("score"))
        if (fh is None or fc is None) and status in ("ft", "full time"):
            fh = _goals_int(m.find("localteam"))
            fc = _goals_int(m.find("visitorteam"))
        if fh is None or fc is None:
            # ET/penalty with no <ft> child → don't guess (would mis-grade).
            if is_et:
                skipped_et += 1
            continue

        # HT score: authoritative <ht> child only.
        hh = hc = None
        htn = m.find("ht")
        if htn is not None:
            hh, hc = _parse_bracket_score(htn.get("score"))

        try:
            if hh is not None and hc is not None:
                n = mysqldb.execute(
                    "UPDATE foot_match SET is_inball=1, is_score=1, status=1, "
                    "  score_h=%s, score_c=%s, inball_h=%s, inball_c=%s, "
                    "  is_hr_inball=1, inball_h_hr=%s, inball_c_hr=%s "
                    "WHERE gid=%s AND lid>=%s AND is_inball=0",
                    (fh, fc, fh, fc, hh, hc, gid, GS_LID_BASE),
                )
            else:
                n = mysqldb.execute(
                    "UPDATE foot_match SET is_inball=1, is_score=1, status=1, "
                    "  score_h=%s, score_c=%s, inball_h=%s, inball_c=%s "
                    "WHERE gid=%s AND lid>=%s AND is_inball=0",
                    (fh, fc, fh, fc, gid, GS_LID_BASE),
                )
            if int(n or 0) > 0:
                finalized += 1
                log.info("finalize pregame gid=%s ft=%s-%s ht=%s-%s status=%s",
                         gid, fh, fc, hh, hc, status)
        except Exception as e:  # noqa: BLE001
            errors += 1
            log.warning("finalize_results gid=%s failed: %s", gid, e)

    return {"finished": finished, "finalized": finalized,
            "skipped_et": skipped_et, "errors": errors, "wrote": True}


# Common team-name suffixes that Goalserve's pregame XML and in-play WS feeds
# disagree on (one feed strips them, the other keeps them).  Stripping these
# before grouping lets the dedup catch "Ballard" vs "Ballard FC" pairs.
_TEAM_SUFFIX_RE = _re.compile(
    r"\s*\b(fc|ac|sc|cf|cd|fk|sk|sv|vfb|vfl|tsv|bv|aff|cff|sff|fff|"
    r"u\d{2}|reserves|reserve|women|w|\(w\))\b\.?\s*",
    _re.IGNORECASE,
)


def _norm_team(name: "str | None") -> str:
    """Normalise a Goalserve team name for duplicate matching.

    Strips common club suffixes (FC/AC/SC/...), age-group / women markers,
    parenthetical annotations, and collapses whitespace.  Returned value is
    lowercase, ASCII-folded best-effort, and used purely as a grouping key.
    """
    if not name:
        return ""
    s = str(name).lower().strip()
    s = _TEAM_SUFFIX_RE.sub(" ", s)
    s = _re.sub(r"\([^)]*\)", " ", s)  # drop "(reserves)" etc.
    s = _re.sub(r"[^a-z0-9\u4e00-\u9fff]+", " ", s)
    s = _re.sub(r"\s+", " ", s).strip()
    return s


def _bet_count_for_gid(gid: int) -> int:
    """Return the number of Crown user bets referencing ``gid``.

    The dedup pass uses this as a safety guard: a match row with at least
    one bet is preserved even when it is the lower-quality duplicate, so
    settlement can still find it.  Crown bets live in the sibling
    ``db_client.bet`` schema; we do a fully-qualified SELECT so the same
    MySQL connection can reach across.
    """
    from . import mysqldb
    try:
        row = mysqldb.fetch_one(
            "SELECT COUNT(*) AS n FROM db_client.bet WHERE gid = %s",
            (str(gid),),
        )
        return int((row or {}).get("n") or 0)
    except Exception as e:  # noqa: BLE001
        log.warning("bet count lookup for gid=%s failed: %s", gid, e)
        # Fail safe: treat as "has bets" so we never delete on lookup error.
        return 1


def _signal_score(row: dict) -> tuple:
    """Rank a foot_match row by how much live data it carries.

    Higher tuple = more authoritative.  Used by ``dedupe_gs_pairs`` to pick
    the survivor inside each duplicate cluster: the one with actual scores
    + Crown ``status=1`` + a recent ``apisports_seen_at`` wins, the empty
    pregame skeleton loses.
    """
    has_score = 1 if (row.get("score_h") is not None and row.get("score_c") is not None) else 0
    started = 1 if int(row.get("status") or 0) == 1 else 0
    apsh = (row.get("apisports_status") or "").strip().upper()
    has_live_status = 1 if apsh and apsh not in ("NS", "TBD", "PST", "CANC") else 0
    seen_at = int(row.get("apisports_seen_at") or 0)
    return (has_score, started, has_live_status, seen_at, int(row.get("gid") or 0))


def dedupe_gs_pairs(*, dry_run: bool = False, lookback_sec: int = 86400 * 3) -> dict:
    """Remove duplicate Goalserve foot_match rows for the same physical match.

    Goalserve uses two competition-id spaces — pregame XML (low ids like
    1437) and in-play WS (high ids like 13104) — for the same league, and
    the same physical match gets a different ``gid`` in each feed.  The
    dbwriter happily upserts both, so the user sees two cards in the live
    tab: one with real scores, one empty skeleton riding the cron-lag
    branch in ``derive_status``.

    For each ``(norm_team_h, norm_team_c, datetime)`` cluster with > 1 row
    we keep the row with the strongest live-data signal (see
    ``_signal_score``) and delete the rest from ``foot_match`` +
    ``foot_match_xml``.  Rows referenced by an existing ``db_client.bet``
    are NEVER deleted (would break settlement).

    Returns a dict ``{groups, deleted, kept_for_bets, errors}`` for logs.

    RETIRED BY DEFAULT (2026-06): the fuzzy pregame↔inplay name match is
    replaced by a time-based decoupling — a Goalserve pregame row's book
    closes ``GS_PREGAME_CLOSE_LEAD_SEC`` before kickoff (enforced at the
    serve/bet layer in routers/external.py), and the in-play row stands
    alone under its own gid.  No row is deleted by name similarity, which
    eliminated the risk of deleting a legitimate independent row when two
    games shared normalised team names.  Re-enable the old behaviour with
    ``GS_DEDUPE_BY_NAME=1`` only if a concrete duplicate-card case needs it.
    """
    if not GS_DB_WRITE:
        return {"groups": 0, "deleted": 0, "kept_for_bets": 0, "errors": 0}
    if os.environ.get("GS_DEDUPE_BY_NAME", "0").strip().lower() not in ("1", "true", "yes"):
        return {"groups": 0, "deleted": 0, "kept_for_bets": 0, "errors": 0, "disabled": True}
    from . import mysqldb

    now = int(time.time())
    floor = now - int(lookback_sec)
    rows = mysqldb.fetch_all(
        "SELECT gid, lid, team_h, team_c, `datetime`, score_h, score_c, "
        "       status, is_inball, apisports_status, apisports_seen_at "
        "FROM foot_match "
        "WHERE lid >= %s AND `datetime` > %s",
        (GS_LID_BASE, floor),
    )

    # Bucket by (norm_h, norm_c, datetime).  Identical kickoff timestamp is
    # required so we don't merge unrelated games that happen to share team
    # names across competitions.
    buckets: dict[tuple, list[dict]] = {}
    for r in rows:
        key = (_norm_team(r.get("team_h")), _norm_team(r.get("team_c")), int(r.get("datetime") or 0))
        if not key[0] or not key[1] or not key[2]:
            continue
        buckets.setdefault(key, []).append(r)

    deleted = 0
    kept_for_bets = 0
    errors = 0
    groups = 0
    for key, members in buckets.items():
        if len(members) < 2:
            continue
        groups += 1
        # Highest signal first → survivor is members[0].
        members.sort(key=_signal_score, reverse=True)
        keeper = members[0]
        for victim in members[1:]:
            vgid = int(victim["gid"])
            # Safety: never delete a row that has bets against it.
            if _bet_count_for_gid(vgid) > 0:
                kept_for_bets += 1
                log.info(
                    "dedup skip gid=%s lid=%s (has bets); keeping despite duplicate of gid=%s",
                    vgid, victim.get("lid"), keeper.get("gid"),
                )
                continue
            if dry_run:
                log.info(
                    "dedup DRY victim gid=%s lid=%s -> keeper gid=%s lid=%s (%s vs %s @ %s)",
                    vgid, victim.get("lid"), keeper.get("gid"), keeper.get("lid"),
                    victim.get("team_h"), victim.get("team_c"), key[2],
                )
                deleted += 1
                continue
            try:
                mysqldb.execute("DELETE FROM foot_match_xml WHERE gid = %s", (vgid,))
                mysqldb.execute("DELETE FROM foot_match WHERE gid = %s", (vgid,))
                deleted += 1
            except Exception as e:  # noqa: BLE001
                errors += 1
                log.warning("dedup delete gid=%s failed: %s", vgid, e)
    return {
        "groups": groups,
        "deleted": deleted,
        "kept_for_bets": kept_for_bets,
        "errors": errors,
    }


def _selftest() -> None:
    """Round-trip a sample main_odds through build_rcn → parse_rcn_markets."""
    from .rcn_parser import parse_rcn_markets
    sample = {
        "m_h": 5.75, "m_n": 4.75, "m_c": 1.48,
        "re_h": 3.45, "re_c": 1.30, "re_line": -0.25,
        "ou_over": 1.91, "ou_under": 1.91, "ou_line": 2.5,
        "btts_yes": 2.05, "btts_no": 1.70,
        "reh_h": 2.30, "reh_c": 1.60, "reh_line": -0.25,
        "dc_1x": 2.62, "dc_12": 1.18, "dc_x2": 1.12,
        "dnb_h": 4.0, "dnb_c": 1.22,
    }
    rcn = build_rcn(sample)
    print("r_cn length:", len(rcn))
    markets = parse_rcn_markets(rcn)
    for m in markets:
        print(f"  {m['market_name']:24} {m['odds'][0] if m['odds'] else m['odds']}")
    print(f"\n{len(markets)} markets round-tripped")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    _selftest()
