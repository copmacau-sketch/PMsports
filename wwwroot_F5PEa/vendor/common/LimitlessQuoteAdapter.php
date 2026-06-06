<?php
/**
 * LimitlessQuoteAdapter — convert one limitless.show/api/quote `event`
 * into the exact `{bookmakers: {Bet365: [{name, odds:[rows]}]}}` shape that
 * OddsApiToCrownXml::buildR() already consumes, plus the `$event` array it
 * needs (id/home/away/date/league).
 *
 * Why an adapter (not a new XML writer): OddsApiToCrownXml already knows how
 * to fold the canonical market rows (ML/Spread/Totals/Double Chance/BTTS/
 * Half Time Result/Spread HT/Totals HT/Corners/Correct Score …) into Crown
 * r_cn XML.  limitless quote carries the SAME markets but in a different wire
 * shape (`odds.<key>.outcomes[] = {name, point, avgPrice, …}`), so we just
 * re-key it into the Odds-API.io row dialect and reuse the writer unchanged.
 *
 * Crucially, limitless' `correct_score` market DOES include away-win
 * scorelines (0-1, 0-2, 1-2 …) which Odds-API.io's Bet365 feed omitted —
 * that omission was why "阿森纳赢球的波胆" never rendered.
 *
 * limitless market key  → Crown market name (row dialect produced here)
 *   h2h               → ML                 {home, draw, away}
 *   draw_no_bet       → Draw No Bet        {home, away}
 *   double_chance     → Double Chance      {label, under}            (one row per outcome)
 *   btts              → Both Teams To Score {yes, no}
 *   spreads           → Spread             {hdp, home, away}         (main balanced line)
 *   totals            → Totals             {hdp, over, under}        (main balanced line)
 *   h2h_ht            → Half Time Result   {label, under}            (one row per outcome)
 *   spreads_ht        → Spread HT          {hdp, home, away}         (main)
 *   totals_ht         → Totals HT          {hdp, over, under}        (main)
 *   corners_spreads   → Corners Spread     {hdp, home, away}         (main)
 *   corners_totals    → Corners Totals     {hdp, over, under}        (main)
 *   correct_score     → Correct Score      {label, odds}             (ALL scorelines, incl. away)
 *
 * Markets without a Crown schema slot (team_totals_*, ht_ft, goalscorers,
 * shots, cards, fouls, outrights, …) are intentionally dropped — they were
 * never represented in r_cn under the Odds-API.io path either, so this is
 * not a regression.
 */
class LimitlessQuoteAdapter
{
    /** Price field to read from each limitless outcome. */
    const PRICE = 'avgPrice';

    /**
     * Minimum acceptable price on either side of an Asian-handicap line
     * before the *displayed* main line "jumps" (跳盘) to the next quarter.
     *
     * Book convention: hold the lowest-handicap (easiest) line as long as
     * neither side is priced shorter than this; once the favourite's price
     * would fall to/below ~1.75 (the 25/75-percentile point) the line is too
     * skewed, so we step to a deeper handicap where prices re-centre toward
     * even money.  We only ever RE-SELECT a line the upstream already quotes
     * — we never synthesise odds for a line upstream didn't send.
     *
     * Env-overridable via LIMITLESS_HANDICAP_JUMP_MIN.
     */
    const HANDICAP_JUMP_MIN = 1.75;

    /** Resolve the (env-overridable) handicap jump threshold. */
    private static function jumpMinPrice(): float
    {
        $v = getenv('LIMITLESS_HANDICAP_JUMP_MIN');
        return ($v !== false && is_numeric($v)) ? (float)$v : self::HANDICAP_JUMP_MIN;
    }

    /**
     * @return array  Odds-API.io-shaped event: id/home/away/date/league.
     */
    public static function toEvent(array $ev): array
    {
        return [
            'id'    => (string)($ev['oddsId'] ?? ''),
            'home'  => (string)($ev['homeTeam'] ?? ''),
            'away'  => (string)($ev['awayTeam'] ?? ''),
            'date'  => (string)($ev['commenceTime'] ?? ''),
            'league' => [
                'name' => (string)($ev['sportTitle'] ?? ''),
                'slug' => (string)($ev['sportKey'] ?? ''),
            ],
        ];
    }

    /**
     * Build the `{bookmakers: {Bet365: [ {name, odds:[...]} ]}}` payload.
     *
     * @param array $ev  one limitless quote event (must have head-to-head
     *                   homeTeam/awayTeam; outright events are not supported).
     */
    public static function toBookmaker(array $ev): array
    {
        $home = (string)($ev['homeTeam'] ?? '');
        $away = (string)($ev['awayTeam'] ?? '');
        $odds = is_array($ev['odds'] ?? null) ? $ev['odds'] : [];
        $markets = [];

        // --- ML (3-way) ---
        if ($row = self::threeWay($odds['h2h'] ?? null, $home, $away)) {
            $markets[] = ['name' => 'ML', 'odds' => [$row]];
        }

        // --- Draw No Bet (2-way) ---
        if (isset($odds['draw_no_bet'])) {
            $h = self::priceByTeam($odds['draw_no_bet'], $home);
            $a = self::priceByTeam($odds['draw_no_bet'], $away);
            if ($h > 0 || $a > 0) {
                $markets[] = ['name' => 'Draw No Bet', 'odds' => [['home' => $h, 'away' => $a]]];
            }
        }

        // --- Double Chance (label rows; writer matches by team prefix + draw) ---
        if ($rows = self::labelRows($odds['double_chance'] ?? null)) {
            $markets[] = ['name' => 'Double Chance', 'odds' => $rows];
        }

        // --- Both Teams To Score ---
        if ($row = self::yesNo($odds['btts'] ?? null)) {
            $markets[] = ['name' => 'Both Teams To Score', 'odds' => [$row]];
        }

        // --- Spread (main Asian handicap line) ---
        if ($row = self::mainHandicap($odds['spreads'] ?? null, $home, $away)) {
            $markets[] = ['name' => 'Spread', 'odds' => [$row]];
        }

        // --- Totals (main over/under line) ---
        if ($row = self::mainTotal($odds['totals'] ?? null)) {
            $markets[] = ['name' => 'Totals', 'odds' => [$row]];
        }

        // --- Half Time Result (label rows) ---
        if ($rows = self::htResultRows($odds['h2h_ht'] ?? null, $home, $away)) {
            $markets[] = ['name' => 'Half Time Result', 'odds' => $rows];
        }

        // --- Spread HT ---
        if ($row = self::mainHandicap($odds['spreads_ht'] ?? null, $home, $away)) {
            $markets[] = ['name' => 'Spread HT', 'odds' => [$row]];
        }

        // --- Totals HT ---
        if ($row = self::mainTotal($odds['totals_ht'] ?? null)) {
            $markets[] = ['name' => 'Totals HT', 'odds' => [$row]];
        }

        // --- Corners Spread ---
        if ($row = self::mainHandicap($odds['corners_spreads'] ?? null, $home, $away)) {
            $markets[] = ['name' => 'Corners Spread', 'odds' => [$row]];
        }

        // --- Corners Totals ---
        if ($row = self::mainTotal($odds['corners_totals'] ?? null)) {
            $markets[] = ['name' => 'Corners Totals', 'odds' => [$row]];
        }

        // --- Correct Score (ALL scorelines — the away-win fix) ---
        if ($rows = self::correctScoreRows($odds['correct_score'] ?? null)) {
            $markets[] = ['name' => 'Correct Score', 'odds' => $rows];
        }

        return ['bookmakers' => ['Bet365' => $markets]];
    }

    /**
     * Like toBookmaker() but keeps ALL handicap / total lines (not just the
     * main one) for the detail-view `/markets` endpoint. The list view + r_cn
     * + settlement still use the single-line toBookmaker(); this richer payload
     * is only consumed live by api_v2.php's market panel so users can pick
     * alternative Asian-handicap / over-under lines.
     */
    public static function toBookmakerFull(array $ev): array
    {
        $home = (string)($ev['homeTeam'] ?? '');
        $away = (string)($ev['awayTeam'] ?? '');
        $odds = is_array($ev['odds'] ?? null) ? $ev['odds'] : [];
        $markets = [];

        if ($row = self::threeWay($odds['h2h'] ?? null, $home, $away)) {
            $markets[] = ['name' => 'ML', 'odds' => [$row]];
        }
        if (isset($odds['draw_no_bet'])) {
            $h = self::priceByTeam($odds['draw_no_bet'], $home);
            $a = self::priceByTeam($odds['draw_no_bet'], $away);
            if ($h > 0 || $a > 0) {
                $markets[] = ['name' => 'Draw No Bet', 'odds' => [['home' => $h, 'away' => $a]]];
            }
        }
        if ($rows = self::labelRows($odds['double_chance'] ?? null)) {
            $markets[] = ['name' => 'Double Chance', 'odds' => $rows];
        }
        if ($row = self::yesNo($odds['btts'] ?? null)) {
            $markets[] = ['name' => 'Both Teams To Score', 'odds' => [$row]];
        }
        if ($rows = self::allHandicaps($odds['spreads'] ?? null, $home, $away)) {
            $markets[] = ['name' => 'Spread', 'odds' => $rows];
        }
        if ($rows = self::allTotals($odds['totals'] ?? null)) {
            $markets[] = ['name' => 'Totals', 'odds' => $rows];
        }
        if ($rows = self::htResultRows($odds['h2h_ht'] ?? null, $home, $away)) {
            $markets[] = ['name' => 'Half Time Result', 'odds' => $rows];
        }
        if ($rows = self::allHandicaps($odds['spreads_ht'] ?? null, $home, $away)) {
            $markets[] = ['name' => 'Spread HT', 'odds' => $rows];
        }
        if ($rows = self::allTotals($odds['totals_ht'] ?? null)) {
            $markets[] = ['name' => 'Totals HT', 'odds' => $rows];
        }
        if ($rows = self::allHandicaps($odds['corners_spreads'] ?? null, $home, $away)) {
            $markets[] = ['name' => 'Corners Spread', 'odds' => $rows];
        }
        if ($rows = self::allTotals($odds['corners_totals'] ?? null)) {
            $markets[] = ['name' => 'Corners Totals', 'odds' => $rows];
        }
        if ($row = self::yesNo($odds['btts_ht'] ?? null)) {
            $markets[] = ['name' => 'Both Teams To Score HT', 'odds' => [$row]];
        }
        if ($rows = self::correctScoreRows($odds['correct_score'] ?? null)) {
            $markets[] = ['name' => 'Correct Score', 'odds' => $rows];
        }

        return ['bookmakers' => ['Bet365' => $markets]];
    }

    // ------------------------------------------------------------------
    // market converters
    // ------------------------------------------------------------------

    /** outcomes[] -> {home, draw, away} matched by team name / "Draw". */
    private static function threeWay($market, string $home, string $away): ?array
    {
        $outs = self::outcomes($market);
        if (!$outs) return null;
        $h = $d = $a = 0.0;
        foreach ($outs as $o) {
            $name = (string)($o['name'] ?? '');
            $p = self::price($o);
            if (self::isDraw($name))            $d = $p;
            elseif (self::teamMatch($name, $home)) $h = $p;
            elseif (self::teamMatch($name, $away)) $a = $p;
        }
        if ($h <= 0 && $a <= 0 && $d <= 0) return null;
        return ['home' => $h, 'draw' => $d, 'away' => $a];
    }

    /** {yes, no} from a Yes/No market. */
    private static function yesNo($market): ?array
    {
        $outs = self::outcomes($market);
        if (!$outs) return null;
        $yes = $no = 0.0;
        foreach ($outs as $o) {
            $name = strtolower(trim((string)($o['name'] ?? '')));
            $p = self::price($o);
            if ($name === 'yes') $yes = $p;
            elseif ($name === 'no') $no = $p;
        }
        if ($yes <= 0 && $no <= 0) return null;
        return ['yes' => $yes, 'no' => $no];
    }

    /** Each outcome -> {label, under} (OddsApiToCrownXml DC reads `under`). */
    private static function labelRows($market): array
    {
        $outs = self::outcomes($market);
        $rows = [];
        foreach ($outs as $o) {
            $name = (string)($o['name'] ?? '');
            $p = self::price($o);
            if ($name === '' || $p <= 0) continue;
            $rows[] = ['label' => $name, 'under' => $p];
        }
        return $rows;
    }

    /** Half Time Result rows: {label, under}; label = team name or "Draw". */
    private static function htResultRows($market, string $home, string $away): array
    {
        $outs = self::outcomes($market);
        $rows = [];
        foreach ($outs as $o) {
            $name = (string)($o['name'] ?? '');
            $p = self::price($o);
            if ($name === '' || $p <= 0) continue;
            $rows[] = ['label' => $name, 'under' => $p];
        }
        return $rows;
    }

    /** Correct Score rows: {label:"h-a", odds}. Keeps EVERY scoreline. */
    private static function correctScoreRows($market): array
    {
        $outs = self::outcomes($market);
        $rows = [];
        foreach ($outs as $o) {
            $label = trim((string)($o['name'] ?? ''));
            $p = self::price($o);
            if (!preg_match('/^\d+\s*[-:]\s*\d+$/', $label) || $p <= 0) continue;
            // Normalise the separator to "-" so the writer's H{h}C{c} tag is stable.
            $label = preg_replace('/\s*[-:]\s*/', '-', $label);
            $rows[] = ['label' => $label, 'odds' => $p];
        }
        return $rows;
    }

    /**
     * Pick the main Asian-handicap line from a spreads-style market and return
     * {hdp, home, away}.  Outcome names look like "<Team> -1.25" / "<Team> 1".
     *
     * Pairing is keyed by the limitless `point` field, which (for spreads /
     * spreads_ht) is the SHARED home-perspective handicap on BOTH the home and
     * away outcome of a line — so "PSG -1.25"@point=-1.25 pairs cleanly with
     * "Arsenal 1.25"@point=-1.25.  Grouping by abs(name handicap) would instead
     * collide the +L and -L lines and yield a junk pair, so we must use point.
     * Among correctly-paired lines we choose the one with the most balanced
     * prices (closest to even money) = the book's main line.
     *
     * Corner handicaps expose a per-side `point` (home=-0.5, away=+0.5) and
     * carry a single line, so when no shared-point pair is found we fall back
     * to pairing the lone home/away outcomes directly.
     */
    private static function mainHandicap($market, string $home, string $away): ?array
    {
        $outs = self::outcomes($market);
        if (!$outs) return null;

        $homeMap = []; // pointKey => price
        $awayMap = []; // pointKey => price
        $hdpOf   = []; // pointKey => home-perspective hdp (float)
        $homeList = []; $awayList = []; // [hdp, price] for single-line fallback

        foreach ($outs as $o) {
            $name = (string)($o['name'] ?? '');
            $p = self::price($o);
            if ($p <= 0) continue;
            $nameHdp = preg_match('/([+-]?\d+(?:\.\d+)?)\s*$/u', $name, $m) ? (float)$m[1] : null;
            $point   = isset($o['point']) && $o['point'] !== null ? (float)$o['point'] : $nameHdp;
            if ($point === null) continue;
            $key = number_format($point, 2);
            if (self::teamMatch($name, $home)) {
                $homeMap[$key] = $p;
                $hdpOf[$key]   = $point; // home-perspective line
                $homeList[]    = [$nameHdp ?? $point, $p];
            } elseif (self::teamMatch($name, $away)) {
                $awayMap[$key] = $p;
                $awayList[]    = [$nameHdp ?? -$point, $p];
            }
        }

        // Candidate lines present on BOTH sides under the same (shared) point key.
        $cands = [];
        foreach ($homeMap as $key => $hp) {
            if (!isset($awayMap[$key])) continue;
            $cands[] = ['hdp' => (float)$hdpOf[$key], 'home' => $hp, 'away' => $awayMap[$key]];
        }
        if ($cands) {
            // 跳盘 (line-jump) selection.  Show the MOST BALANCED line
            // (prices closest to even money) among the lines on which neither
            // side has drifted below the jump threshold (~1.75 = the 25/75
            // percentile).  As the favourite's price on the current main line
            // drifts down past that threshold the line drops out of the fair
            // set and the next (deeper) line becomes the most-balanced pick —
            // i.e. the displayed handicap "jumps" a quarter ball, exactly the
            // book behaviour the user described.  When the ladder is thin /
            // all lines are skewed (no line clears the threshold) we fall back
            // to the most balanced line overall so we still surface the
            // upstream's best available quote — we NEVER synthesise a line.
            $th = self::jumpMinPrice();
            $fair = array_values(array_filter($cands, static function ($r) use ($th) {
                return min($r['home'], $r['away']) >= $th;
            }));
            $pool = $fair ?: $cands;
            usort($pool, static function ($a, $b) {
                return (abs($a['home'] - $a['away']) <=> abs($b['home'] - $b['away']))
                    ?: (abs($a['hdp']) <=> abs($b['hdp']));
            });
            return $pool[0];
        }

        // Fallback: single line with per-side points (corners) — pair the
        // lone home + away outcomes.
        if (count($homeList) === 1 && count($awayList) === 1) {
            return ['hdp' => (float)$homeList[0][0], 'home' => $homeList[0][1], 'away' => $awayList[0][1]];
        }
        return null;
    }

    /**
     * Pick the main Over/Under line from a totals-style market and return
     * {hdp, over, under}.  Group by point, choose the most balanced pair.
     */
    private static function mainTotal($market): ?array
    {
        $outs = self::outcomes($market);
        if (!$outs) return null;
        $lines = [];
        foreach ($outs as $o) {
            $name = strtolower(trim((string)($o['name'] ?? '')));
            $p = self::price($o);
            if ($p <= 0) continue;
            $point = isset($o['point']) && $o['point'] !== null
                   ? (float)$o['point']
                   : (preg_match('/(\d+(?:\.\d+)?)/', $name, $m) ? (float)$m[1] : null);
            if ($point === null) continue;
            $key = number_format($point, 2);
            if (!isset($lines[$key])) $lines[$key] = ['point' => $point, 'over' => 0.0, 'under' => 0.0];
            if (strpos($name, 'over') === 0)  $lines[$key]['over'] = $p;
            elseif (strpos($name, 'under') === 0) $lines[$key]['under'] = $p;
        }
        $best = null; $bestDiff = INF;
        foreach ($lines as $ln) {
            if ($ln['over'] <= 0 || $ln['under'] <= 0) continue;
            $diff = abs($ln['over'] - $ln['under']);
            if ($diff < $bestDiff) { $bestDiff = $diff; $best = $ln; }
        }
        if (!$best) return null;
        return ['hdp' => (float)$best['point'], 'over' => $best['over'], 'under' => $best['under']];
    }

    /**
     * Return EVERY Asian-handicap line as {hdp, home, away} rows (home-
     * perspective hdp), sorted ascending. Pairs the home and away outcomes by
     * the ABSOLUTE line value parsed from each outcome name — robust against
     * limitless' inconsistent `point` field (some lines store the away point
     * as the away-perspective +L, others as the shared home-perspective -L)
     * and the "<Away> +-N" rendering glitch on whole-number lines.
     */
    private static function allHandicaps($market, string $home, string $away): array
    {
        $outs = self::outcomes($market);
        if (!$outs) return [];
        $homeByAbs = []; // absKey => [hdp(home-perspective), price]
        $awayByAbs = []; // absKey => price
        foreach ($outs as $o) {
            $name = (string)($o['name'] ?? '');
            $p = self::price($o);
            if ($p <= 0) continue;
            $hdp = preg_match('/([+-]?\d+(?:\.\d+)?)\s*$/u', $name, $m) ? (float)$m[1] : null;
            if ($hdp === null) {
                $hdp = isset($o['point']) && $o['point'] !== null ? (float)$o['point'] : null;
            }
            if ($hdp === null) continue;
            $absKey = number_format(abs($hdp), 2);
            if (self::teamMatch($name, $home)) {
                if (!isset($homeByAbs[$absKey])) $homeByAbs[$absKey] = [$hdp, $p];
            } elseif (self::teamMatch($name, $away)) {
                if (!isset($awayByAbs[$absKey])) $awayByAbs[$absKey] = $p;
            }
        }
        $rows = [];
        foreach ($homeByAbs as $absKey => $hh) {
            if (!isset($awayByAbs[$absKey])) continue;
            $rows[] = ['hdp' => (float)$hh[0], 'home' => $hh[1], 'away' => $awayByAbs[$absKey]];
        }
        // Single-line fallback (e.g. corner handicaps with per-side points).
        if (!$rows && count($homeByAbs) === 1 && count($awayByAbs) === 1) {
            $hk = array_key_first($homeByAbs);
            $rows[] = ['hdp' => (float)$homeByAbs[$hk][0], 'home' => $homeByAbs[$hk][1], 'away' => reset($awayByAbs)];
        }
        // Order by closeness to the most balanced (main) line so a capped
        // detail-panel pill list surfaces the relevant lines first instead of
        // the deep -5 / -4 favourite lines.
        $anchor = self::balancedLine($rows, 'home', 'away');
        usort($rows, static function ($a, $b) use ($anchor) {
            return (abs($a['hdp'] - $anchor) <=> abs($b['hdp'] - $anchor)) ?: ($a['hdp'] <=> $b['hdp']);
        });
        return $rows;
    }

    /**
     * Return EVERY Over/Under line as {hdp, over, under} rows, sorted ascending.
     */
    private static function allTotals($market): array
    {
        $outs = self::outcomes($market);
        if (!$outs) return [];
        $lines = [];
        foreach ($outs as $o) {
            $name = strtolower(trim((string)($o['name'] ?? '')));
            $p = self::price($o);
            if ($p <= 0) continue;
            $point = isset($o['point']) && $o['point'] !== null
                   ? (float)$o['point']
                   : (preg_match('/(\d+(?:\.\d+)?)/', $name, $m) ? (float)$m[1] : null);
            if ($point === null) continue;
            $key = number_format($point, 2);
            if (!isset($lines[$key])) $lines[$key] = ['point' => $point, 'over' => 0.0, 'under' => 0.0];
            if (strpos($name, 'over') === 0)  $lines[$key]['over'] = $p;
            elseif (strpos($name, 'under') === 0) $lines[$key]['under'] = $p;
        }
        $rows = [];
        foreach ($lines as $ln) {
            if ($ln['over'] <= 0 || $ln['under'] <= 0) continue;
            $rows[] = ['hdp' => (float)$ln['point'], 'over' => $ln['over'], 'under' => $ln['under']];
        }
        // Order by closeness to the most balanced (main) line (see allHandicaps).
        $anchor = self::balancedLine($rows, 'over', 'under');
        usort($rows, static function ($a, $b) use ($anchor) {
            return (abs($a['hdp'] - $anchor) <=> abs($b['hdp'] - $anchor)) ?: ($a['hdp'] <=> $b['hdp']);
        });
        return $rows;
    }

    /** Return the hdp of the row whose two prices are closest (the main line). */
    private static function balancedLine(array $rows, string $ka, string $kb): float
    {
        $anchor = 0.0; $best = INF;
        foreach ($rows as $r) {
            $diff = abs((float)$r[$ka] - (float)$r[$kb]);
            if ($diff < $best) { $best = $diff; $anchor = (float)$r['hdp']; }
        }
        return $anchor;
    }

    // ------------------------------------------------------------------
    // primitives
    // ------------------------------------------------------------------

    private static function outcomes($market): array
    {
        if (!is_array($market)) return [];
        $outs = $market['outcomes'] ?? null;
        return is_array($outs) ? $outs : [];
    }

    private static function price(array $o): float
    {
        return (float)($o[self::PRICE] ?? 0);
    }

    private static function priceByTeam($market, string $team): float
    {
        foreach (self::outcomes($market) as $o) {
            if (self::teamMatch((string)($o['name'] ?? ''), $team)) return self::price($o);
        }
        return 0.0;
    }

    private static function isDraw(string $name): bool
    {
        $n = strtolower(trim($name));
        return $n === 'draw' || $n === 'x' || $n === 'tie';
    }

    /** Loose team-name equality: exact (case-insensitive) or prefix containment. */
    private static function teamMatch(string $candidate, string $team): bool
    {
        $c = strtolower(trim($candidate));
        $t = strtolower(trim($team));
        if ($c === '' || $t === '') return false;
        if ($c === $t) return true;
        return strpos($c, $t) !== false || strpos($t, $c) !== false;
    }
}
