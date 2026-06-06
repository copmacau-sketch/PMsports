<?php
/**
 * settle_bets.php — Automatic bet settlement via API-Sports.io
 *
 * Flow:
 *   1) Pull unsettled bets (db_client.bet WHERE isResult=0) — group by gid
 *   2) Look up foot_match (team_h/team_c are English from Odds-API.io)
 *   3) Fuzzy-match team names against API-Sports.io fixtures (cached in foot_match_apisports)
 *   4) Cache fixture_id once matched (avoid repeated API calls)
 *   5) Pull score + status from API-Sports.io (live or final)
 *   6) Update foot_match.score_h/c (live) and inball_h/c, inball_h_hr/c_hr, is_inball (final)
 *   7) Settle bets whose match is FT/AET/PEN — calculate W/L/T per bet's wtype/rtype/spread
 *   8) Atomically update bet row + member.balance_credit on win/refund
 *
 * Trigger:
 *   CLI:  php settle_bets.php
 *   HTTP: GET /api/settle?key=cron2026
 *
 * Cron (every 5 min):
 *   (slash-star-slash 5)  *  *  *  *  php /home/.../settle_bets.php  >> /var/log/settle_bets.log 2>&1
 */

if (PHP_SAPI !== 'cli') {
    header('Content-Type: text/plain; charset=utf-8');
    if (($_GET['key'] ?? '') !== 'cron2026') {
        http_response_code(403);
        echo "forbidden\n";
        exit;
    }
}

date_default_timezone_set('Asia/Shanghai');

// ---------- Config ----------
$DB_HOST   = '127.0.0.1';
$DB_USER   = 'root';
$DB_PASS   = '49f0863e9070';
$DB_MARKETS = 'db_markets';
$DB_CLIENT = 'db_client';
$API_KEY   = '967679e7c3c625a64081afc93b7fb1bf';
$API_BASE  = 'https://v3.football.api-sports.io';

// Lookback window for unsettled bets (don't try to settle ancient bets repeatedly)
$LOOKBACK_DAYS = 14;

// ---------- Logging ----------
function logmsg(string $msg): void {
    $ts = date('Y-m-d H:i:s');
    fwrite(STDERR, "[{$ts}] {$msg}\n");
    if (PHP_SAPI !== 'cli') echo "[{$ts}] {$msg}\n";
}

// ---------- DB ----------
try {
    $pdoS = new PDO("mysql:host={$DB_HOST};dbname={$DB_MARKETS};charset=utf8mb4", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdoC = new PDO("mysql:host={$DB_HOST};dbname={$DB_CLIENT};charset=utf8mb4", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    logmsg("DB connect failed: " . $e->getMessage());
    exit(1);
}

// Ensure mapping/cache table exists in db_markets
$pdoS->exec("
    CREATE TABLE IF NOT EXISTS foot_match_apisports (
        gid INT NOT NULL PRIMARY KEY,
        fixture_id INT NOT NULL,
        confidence INT DEFAULT 100,
        last_status VARCHAR(10) DEFAULT 'NS',
        last_synced_at INT NOT NULL DEFAULT 0,
        INDEX idx_fixture (fixture_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
");

// ---------- Team name normalization & fuzzy match ----------
function normalizeTeamName(string $name): string {
    $n = mb_strtolower(trim($name), 'UTF-8');
    // strip diacritics best-effort
    $n = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $n) ?: $n;
    $n = strtolower($n);
    // Strip common club affixes and year markers. Token-level matching means
    // each entry is a standalone word that gets dropped before similarity.
    // Italian clubs: ACF (Fiorentina), AS (Roma), AC (Milan), SS (Lazio),
    //                BC (Atalanta), CFC (Genoa), SSC (Napoli).
    // Spanish:       CD/CF/RCD/RC/UD/CA/SD (clubs), SAD (sociedad anonima).
    // English:       AFC/FC/CF/CFC/SFC/SC/BFC.
    // Generic:       FK, BK, OFK, FBC, IF, FF, SK, SK, SV.
    $stopwords = [
        'fc','cf','sc','rc','ac','acf','as','us','ssc','ss','bsc','afc','sfc','cfc','bfc','bc','fbc','sd',
        'cd','rcd','ud','ca','aek','asd','asg','sad','sk','sv','svw','if','ff','bk','fk','ofk',
        'club','football','calcio','de','del','la','el','do','do as',
        'town','city','united','utd',
        '07','08','1899','1900','1893','1909','1907','04','05',
    ];
    $n = preg_replace('/[^a-z0-9 ]+/', ' ', $n);
    $tokens = preg_split('/\s+/', trim($n));
    $tokens = array_filter($tokens, fn($t) => $t !== '' && !in_array($t, $stopwords, true));
    return cslCanonicalize(implode(' ', $tokens));
}

/**
 * Bridge api-sports.io legacy CSL names with odds-api.io modern names.
 * Mirror of api_v2.php::_csl_canonicalize — keep both maps in lockstep.
 *
 * api-sports.io ships pre-rebrand names ("SHANGHAI SIPG", "Henan Jianye",
 * "Hangzhou Greentown", "Tianjin Teda", "Shandong Luneng", "Qingdao
 * Jonoon"...) while odds-api.io ships current names. Generic Jaccard +
 * Levenshtein scores most of these pairs <70, so we substring-rewrite
 * known legacy fragments to their modern counterparts before similarity.
 */
function cslCanonicalize(string $n): string {
    static $aliases = [
        // Phrases first (longer wins over shorter).
        'hangzhou greentown' => 'zhejiang',
        'youth island'       => 'west coast',
        'better city'        => 'rongcheng',
        'shenyang urban'     => 'liaoning tieren',
        // Strip city suffixes that odds-api.io appends but api-sports.io
        // omits (Italian/German/Spanish naming conventions).
        'lazio rome'    => 'lazio',
        'inter milano'  => 'inter',
        'inter milan'   => 'inter',
        'juventus turin'=> 'juventus',
        'real madrid'   => 'real madrid',  // explicit no-op (sanity)
        'real betis seville' => 'real betis',
        'real sociedad san sebastian' => 'real sociedad',
        // Single tokens.
        'sipg'    => 'port',
        'jianye'  => '',
        'hangzhou'=> 'zhejiang',
        'teda'    => 'jinmen tiger',
        'luneng'  => 'taishan',
        'jonoon'  => 'hainiu',
        'zhixing' => 'yingbo',
    ];
    foreach ($aliases as $from => $to) {
        if (strpos($n, $from) !== false) $n = str_replace($from, $to, $n);
    }
    return preg_replace('/\s+/', ' ', trim($n));
}

function teamSimilarity(string $a, string $b): int {
    $na = normalizeTeamName($a);
    $nb = normalizeTeamName($b);
    if ($na === '' || $nb === '') return 0;
    if ($na === $nb) return 100;
    // token overlap
    $ta = array_unique(explode(' ', $na));
    $tb = array_unique(explode(' ', $nb));
    $overlap = count(array_intersect($ta, $tb));
    $union = count(array_unique(array_merge($ta, $tb)));
    $jaccard = $union > 0 ? ($overlap / $union) : 0;
    // substring containment
    $contain = (strpos($na, $nb) !== false || strpos($nb, $na) !== false) ? 0.6 : 0;
    // Levenshtein on shortest
    $maxLen = max(strlen($na), strlen($nb));
    $lev = $maxLen > 0 ? max(0, 1 - levenshtein($na, $nb) / $maxLen) : 0;
    $score = max($jaccard, $contain, $lev * 0.85);
    return (int)round($score * 100);
}

// ---------- HTTP to API-Sports.io ----------
function apiSportsGet(string $url, string $apiKey): ?array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => ['x-apisports-key: ' . $apiKey],
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code !== 200 || !$resp) return null;
    $data = json_decode($resp, true);
    if (!is_array($data)) return null;
    return $data['response'] ?? [];
}

// Cache: API-Sports.io fixtures by date (YYYY-MM-DD) for 5 min
$FIX_CACHE = [];
function fetchFixturesByDate(string $date, string $apiKey, string $apiBase): array {
    global $FIX_CACHE;
    if (isset($FIX_CACHE[$date])) return $FIX_CACHE[$date];
    $url = $apiBase . '/fixtures?' . http_build_query(['date' => $date]);
    $data = apiSportsGet($url, $apiKey) ?? [];
    $FIX_CACHE[$date] = $data;
    logmsg("API-Sports fixtures date={$date} count=" . count($data));
    return $data;
}

function fetchFixtureById(int $fixtureId, string $apiKey, string $apiBase): ?array {
    $url = $apiBase . '/fixtures?' . http_build_query(['id' => $fixtureId]);
    $data = apiSportsGet($url, $apiKey) ?? [];
    return $data[0] ?? null;
}

// ---------- Match lookup ----------
function findFixtureForMatch(array $match, array $fixtures): ?array {
    $bestScore = 0;
    $best = null;
    $teamH = $match['team_h'] ?? '';
    $teamC = $match['team_c'] ?? '';
    foreach ($fixtures as $fx) {
        $fxHome = $fx['teams']['home']['name'] ?? '';
        $fxAway = $fx['teams']['away']['name'] ?? '';
        // Same orientation
        $sH = teamSimilarity($teamH, $fxHome);
        $sA = teamSimilarity($teamC, $fxAway);
        $score = (int)round(($sH + $sA) / 2);
        if ($score > $bestScore) {
            $bestScore = $score;
            $best = ['fixture' => $fx, 'score' => $score, 'flipped' => false];
        }
        // Some sources flip home/away — try too, but penalise
        $sH2 = teamSimilarity($teamH, $fxAway);
        $sA2 = teamSimilarity($teamC, $fxHome);
        $score2 = (int)round((($sH2 + $sA2) / 2) * 0.95);
        if ($score2 > $bestScore) {
            $bestScore = $score2;
            $best = ['fixture' => $fx, 'score' => $score2, 'flipped' => true];
        }
    }
    if ($best === null || $bestScore < 70) return null;
    return $best;
}

// ---------- foot_match update ----------
function applyScoresToFootMatch(PDO $pdoS, int $gid, array $fx, bool $flipped): void {
    $shortStatus = $fx['fixture']['status']['short'] ?? 'NS';
    $isFinished  = in_array($shortStatus, ['FT', 'AET', 'PEN'], true);
    $isCancelled = in_array($shortStatus, ['CANC', 'ABD', 'AWD', 'WO', 'PST'], true);

    $h = $fx['goals']['home'] ?? null;
    $c = $fx['goals']['away'] ?? null;
    $hHt = $fx['score']['halftime']['home'] ?? null;
    $cHt = $fx['score']['halftime']['away'] ?? null;
    if ($flipped) { [$h, $c] = [$c, $h]; [$hHt, $cHt] = [$cHt, $hHt]; }

    $up = [];
    $set = [];
    if ($h !== null && $c !== null) {
        $up[':sh'] = (int)$h; $set[] = '`score_h` = :sh';
        $up[':sc'] = (int)$c; $set[] = '`score_c` = :sc';
        $up[':isS'] = 1;      $set[] = '`is_score` = :isS';
    }
    if ($isFinished) {
        $up[':ih'] = (int)$h;     $set[] = '`inball_h` = :ih';
        $up[':ic'] = (int)$c;     $set[] = '`inball_c` = :ic';
        if ($hHt !== null) { $up[':ihhr'] = (string)(int)$hHt; $set[] = '`inball_h_hr` = :ihhr'; }
        if ($cHt !== null) { $up[':ichr'] = (string)(int)$cHt; $set[] = '`inball_c_hr` = :ichr'; }
        $up[':inb'] = 1; $set[] = '`is_inball` = :inb';
    }
    if ($isCancelled) {
        // status>0 in legacy means abnormal; flag for void settlement
        $up[':st'] = 99; $set[] = '`status` = :st';
    }
    if (empty($set)) return;
    $up[':gid'] = $gid;
    $sql = "UPDATE foot_match SET " . implode(', ', $set) . " WHERE gid = :gid";
    $pdoS->prepare($sql)->execute($up);
}

// ---------- Bet settlement core ----------
/**
 * Decide single-leg result by wtype/rtype/spread + scores.
 * Return: 'W' | 'L' | 'HW' | 'HL' | 'T' (T=void/refund) | null (unknown — skip)
 */
function gradeBet(array $bet, array $fx, bool $flipped): ?string {
    $h = $fx['goals']['home'] ?? null;
    $c = $fx['goals']['away'] ?? null;
    $hHt = $fx['score']['halftime']['home'] ?? null;
    $cHt = $fx['score']['halftime']['away'] ?? null;
    if ($flipped) { [$h, $c] = [$c, $h]; [$hHt, $cHt] = [$cHt, $hHt]; }
    if ($h === null || $c === null) return null;

    $wtype  = strtoupper((string)($bet['wtype']  ?? ''));
    $rtype  = strtoupper((string)($bet['rtype']  ?? ''));
    $spread = $bet['spread'] !== null && $bet['spread'] !== '' ? (float)$bet['spread'] : null;

    // Resolve target half
    $isHt = in_array($wtype, ['HT_ML','HT_SP','HT_OU','HT_BTS'], true);
    if ($isHt) {
        if ($hHt === null || $cHt === null) return null;
        $H = (int)$hHt; $C = (int)$cHt;
    } else {
        $H = (int)$h; $C = (int)$c;
    }
    $total = $H + $C;
    $homeWin = $H > $C; $awayWin = $C > $H; $draw = $H === $C;

    switch ($wtype) {
        // Match winner (3-way, includes Draw)
        case '1X2':
        case 'ML':
        case 'HT_ML':
            if ($rtype === 'H') return $homeWin ? 'W' : 'L';
            if ($rtype === 'C') return $awayWin ? 'W' : 'L';
            if ($rtype === 'D') return $draw    ? 'W' : 'L';
            return null;

        // Draw No Bet (2-way; draw refunds)
        case 'DNB':
            if ($draw) return 'T';
            if ($rtype === 'H') return $homeWin ? 'W' : 'L';
            if ($rtype === 'C') return $awayWin ? 'W' : 'L';
            return null;

        // Asian Handicap / Spread (supports half/quarter lines)
        // spread is from chosen team's perspective (e.g. -1.5 means team gives 1.5)
        case 'SP':
        case 'HT_SP':
            if ($spread === null) return null;
            $myGoals  = $rtype === 'H' ? $H : ($rtype === 'C' ? $C : null);
            $oppGoals = $rtype === 'H' ? $C : ($rtype === 'C' ? $H : null);
            if ($myGoals === null) return null;
            $diff = ($myGoals + $spread) - $oppGoals;
            // quarter line (e.g. -0.25 / +0.75) — frontend posts a single value, treat as full
            if ($diff > 0.25)        return 'W';
            elseif ($diff > 0)       return 'HW';
            elseif (abs($diff) < 1e-9) return 'T';
            elseif ($diff < -0.25)   return 'L';
            else                     return 'HL';

        // Over / Under totals
        case 'OU':
        case 'HT_OU':
            if ($spread === null) return null;
            $diff = $total - $spread;
            $isOver = $rtype === 'OVER';
            if (abs($diff) < 1e-9) return 'T';
            if ($diff > 0.25)        return $isOver ? 'W' : 'L';
            elseif ($diff > 0)       return $isOver ? 'HW' : 'HL';
            elseif ($diff < -0.25)   return $isOver ? 'L' : 'W';
            else                     return $isOver ? 'HL' : 'HW';

        // Double Chance: HD=1X (home or draw), CD=X2 (draw or away), HC=12 (home or away)
        case 'DC':
            if ($rtype === 'HD') return ($homeWin || $draw)    ? 'W' : 'L';
            if ($rtype === 'CD') return ($awayWin || $draw)    ? 'W' : 'L';
            if ($rtype === 'HC') return ($homeWin || $awayWin) ? 'W' : 'L';
            return null;

        // Both Teams To Score
        case 'BTS':
        case 'HT_BTS':
            $bts = ($H > 0 && $C > 0);
            if ($rtype === 'Y') return $bts ? 'W' : 'L';
            if ($rtype === 'N') return $bts ? 'L' : 'W';
            return null;

        // Correct Score — rtype like "1:0" or "1-0"
        case 'CS':
            $rtype = str_replace('-', ':', $rtype);
            $parts = explode(':', $rtype);
            if (count($parts) !== 2) return null;
            $rH = (int)$parts[0]; $rC = (int)$parts[1];
            return ($rH === $H && $rC === $C) ? 'W' : 'L';

        // Total Goals Odd/Even
        case 'OE':
            $isOdd = ($total % 2 === 1);
            if ($rtype === 'ODD')  return $isOdd ? 'W' : 'L';
            if ($rtype === 'EVEN') return $isOdd ? 'L' : 'W';
            return null;

        default:
            return null; // unknown — leave for manual review
    }
}

/**
 * Apply grade to bet row + adjust member credit.
 *
 * Implements the legacy 退水 (rebate) + multi-level commission split from
 * vendor/common/Result.php so that:
 *   - member_result = win_gold + valid_gold * mem_turn_rate%
 *   - upper layers absorb the difference of their turn_rate vs the lower layer
 *   - each layer's `point` is the commission share they retain on the chain
 *   - 退水 is paid out to the member even on losses (war% of valid_gold)
 */
function applyGrade(PDO $pdoC, array $bet, string $grade, string $inballStr): bool {
    $betGold = (float)$bet['bet_golds'];
    $odds    = (float)$bet['ioratio'];

    // 退水/占成 fields written by api_v2.php at place-bet time.
    $memTr = (float)($bet['mem_turn_rate'] ?? 0);
    $agTr  = (float)($bet['ag_turn_rate']  ?? 0);
    $suTr  = (float)($bet['su_turn_rate']  ?? 0);
    $coTr  = (float)($bet['co_turn_rate']  ?? 0);
    $d0Tr  = (float)($bet['d0_turn_rate']  ?? 0);
    $agPt  = (float)($bet['ag_point'] ?? 0);
    $suPt  = (float)($bet['su_point'] ?? 0);
    $coPt  = (float)($bet['co_point'] ?? 0);
    $d0Pt  = (float)($bet['d0_point'] ?? 0);

    // Per-grade win amount + effective (valid) gold + half-loss refund.
    $winGold = 0.0; $valid = 0.0; $cancel = 0; $halfRefund = 0.0;
    switch ($grade) {
        case 'W':  $winGold = $betGold * ($odds - 1);     $valid = $betGold; break;
        case 'HW': $winGold = $betGold * ($odds - 1) / 2; $valid = $betGold; break;
        case 'HL': $winGold = -$betGold / 2; $valid = $betGold; $halfRefund = $betGold / 2; break;
        case 'L':  $winGold = -$betGold;     $valid = $betGold; break;
        case 'T':  $winGold = 0; $valid = 0; $cancel = 1; break;
        default:   return false;
    }

    // --- 退水/分层结果 (vendor/common/Result.php) ---
    $memTurnAmt = $valid * $memTr / 100;            // 会员退水金额
    $memResult  = $winGold + $memTurnAmt;            // 会员结果(含退水)

    // Payback to member's credit:
    //   T (void)  → full refund of stake.
    //   W / HW    → stake + win + 退水.
    //   HL        → half stake refund + 退水 (rebate still applies on valid_gold).
    //   L         → 退水 only (if any).
    if ($grade === 'T') {
        $payback = $betGold;
    } elseif ($memResult > 0) {
        $payback = $betGold + $memResult;
    } else {
        // Lost (full or half): refund any half-stake portion + the rebate amount.
        $payback = $halfRefund + max(0.0, $memTurnAmt);
    }

    // Upstream chain (matches Result.php formulas)
    $agentResult = $memResult + ($agTr - $memTr) * $valid / 100;
    $agResult    = $agentResult * (100 - $agPt) / 100;
    $suResult    = $agentResult * (100 - $agPt - $suPt) / 100
                 + ($suTr - $agTr) * $valid / 100;
    $coResult    = $agentResult * (100 - $agPt - $suPt - $coPt) / 100
                 + ($coTr - $suTr) * $valid / 100;
    $d0Result    = $agentResult * (100 - $agPt - $suPt - $coPt - $d0Pt) / 100
                 + ($d0Tr - $coTr) * $valid / 100;

    $up = [
        ':vg'    => round($valid, 4),
        ':mr'    => round($memResult, 4),
        ':mw'    => round($winGold, 4),
        ':agr'   => round($agentResult, 4),
        ':agres' => round($agResult, 4),
        ':sures' => round($suResult, 4),
        ':cores' => round($coResult, 4),
        ':d0res' => round($d0Result, 4),
        ':res'   => $grade,
        ':ir'    => 1,
        ':cn'    => $cancel,
        ':in'    => $inballStr,
        ':id'    => $bet['ID'],
    ];
    $pdoC->beginTransaction();
    try {
        $pdoC->prepare("UPDATE bet SET
                        valid_gold=:vg, mem_result=:mr, mem_win_gold=:mw,
                        agent_result=:agr, ag_result=:agres,
                        su_result=:sures, co_result=:cores, d0_result=:d0res,
                        result=:res, isResult=:ir, cancel=:cn, inball=:in
                        WHERE ID=:id AND isResult=0")->execute($up);
        if ($payback > 0 && !empty($bet['nid'])) {
            $stmt = $pdoC->prepare("UPDATE member SET credit = credit + :p, balance_credit = balance_credit + :p
                                    WHERE nid = :nid AND pay_type = 1");
            $stmt->execute([':p' => round($payback, 2), ':nid' => $bet['nid']]);
            // credit_log
            $log = $pdoC->prepare("SELECT credit, name FROM member WHERE nid = :nid AND pay_type = 1 LIMIT 1");
            $log->execute([':nid' => $bet['nid']]);
            $mem = $log->fetch();
            if ($mem) {
                $pdoC->prepare("INSERT INTO credit_log (nid, type, old_cash, cash, new_cash, usertype, logintime, s_name)
                                VALUES (:nid, 'Y', :oc, :c, :nc, '结算', :t, :sn)")->execute([
                    ':nid' => $bet['nid'],
                    ':oc'  => $mem['credit'] - round($payback, 2),
                    ':c'   => round($payback, 2),
                    ':nc'  => $mem['credit'],
                    ':t'   => time(),
                    ':sn'  => $mem['name'],
                ]);
            }
        }
        $pdoC->commit();
        return true;
    } catch (PDOException $e) {
        $pdoC->rollBack();
        logmsg("applyGrade rollback ID={$bet['ID']}: " . $e->getMessage());
        return false;
    }
}

// ---------- Main ----------
$now = time();
$cutoffOldest = $now - $LOOKBACK_DAYS * 86400;
$cutoffFuture = $now + 6 * 3600; // include matches that may have just kicked off

// Pull unique gids (skip parlay multi-gid for now)
$stmt = $pdoC->prepare("
    SELECT DISTINCT gid FROM bet
    WHERE isResult = 0
      AND gid NOT LIKE '%,%'
      AND gtype = 'FT'
      AND `datetime` BETWEEN :a AND :b
      AND bet_time >= :c
");
$stmt->execute([':a' => 0, ':b' => $cutoffFuture, ':c' => $cutoffOldest]);
$gids = array_column($stmt->fetchAll(), 'gid');
logmsg("Unsettled gids: " . count($gids));

$settled = 0; $matched = 0; $skipped = 0;

foreach ($gids as $gid) {
    $gid = (int)$gid;
    // foot_match
    $m = $pdoS->prepare("SELECT gid, team_h, team_c, league, `datetime`, status, score_h, score_c,
                                inball_h, inball_c, is_inball
                          FROM foot_match WHERE gid = :gid LIMIT 1");
    $m->execute([':gid' => $gid]);
    $match = $m->fetch();
    if (!$match) { logmsg("gid={$gid} not in foot_match — skip"); $skipped++; continue; }
    if (empty($match['team_h']) || empty($match['team_c'])) { $skipped++; continue; }

    // Cached fixture mapping?
    $cs = $pdoS->prepare("SELECT * FROM foot_match_apisports WHERE gid = :gid LIMIT 1");
    $cs->execute([':gid' => $gid]);
    $cache = $cs->fetch();

    $fx = null; $flipped = false;
    if ($cache && $cache['fixture_id'] > 0) {
        // Expire low-confidence or long-NS cache entries so the fuzzy search
        // gets a chance to find a better fixture. Heuristics:
        //   - confidence <90 AND match kicked off >30min ago → likely wrong fixture
        //   - last_status NS AND match kicked off >6h ago    → fixture wasn't this match
        $staleConf = ((int)$cache['confidence'] < 90) && ((int)$match['datetime'] < $now - 1800);
        $staleStatus = ($cache['last_status'] === 'NS') && ((int)$match['datetime'] < $now - 6 * 3600);
        if ($staleConf || $staleStatus) {
            logmsg("gid={$gid} expiring stale cache fixture={$cache['fixture_id']} conf={$cache['confidence']} status={$cache['last_status']} reason=" . ($staleConf ? 'low_conf' : 'long_ns'));
            $pdoS->prepare("DELETE FROM foot_match_apisports WHERE gid = :g")->execute([':g' => $gid]);
            $cache = null;
        } else {
            // Re-fetch to get current status/scores
            $fx = fetchFixtureById((int)$cache['fixture_id'], $API_KEY, $API_BASE);
            if (!$fx) { logmsg("gid={$gid} cached fixture {$cache['fixture_id']} not retrievable"); }
        }
    }

    if (!$fx) {
        // Search by date — try ±1 day to account for timezone
        $matchTs = (int)$match['datetime'];
        $dates = [date('Y-m-d', $matchTs), date('Y-m-d', $matchTs - 86400), date('Y-m-d', $matchTs + 86400)];
        $dates = array_values(array_unique($dates));
        $bestPick = null;
        foreach ($dates as $d) {
            $fixtures = fetchFixturesByDate($d, $API_KEY, $API_BASE);
            if (empty($fixtures)) continue;
            $pick = findFixtureForMatch($match, $fixtures);
            if ($pick && (!$bestPick || $pick['score'] > $bestPick['score'])) {
                $bestPick = $pick;
            }
        }
        if ($bestPick) {
            $fx = $bestPick['fixture'];
            $flipped = $bestPick['flipped'];
            // cache
            $pdoS->prepare("INSERT INTO foot_match_apisports (gid, fixture_id, confidence, last_status, last_synced_at)
                            VALUES (:g,:f,:c,:s,:t)
                            ON DUPLICATE KEY UPDATE fixture_id=VALUES(fixture_id),confidence=VALUES(confidence),
                                last_status=VALUES(last_status), last_synced_at=VALUES(last_synced_at)")
                  ->execute([
                      ':g' => $gid,
                      ':f' => (int)($fx['fixture']['id'] ?? 0),
                      ':c' => $bestPick['score'],
                      ':s' => $fx['fixture']['status']['short'] ?? 'NS',
                      ':t' => $now,
                  ]);
            logmsg("gid={$gid} matched fixture={$fx['fixture']['id']} score={$bestPick['score']} flipped=" . ($flipped?'1':'0') . " — {$match['team_h']} vs {$match['team_c']} ↔ {$fx['teams']['home']['name']} vs {$fx['teams']['away']['name']}");
            $matched++;
        } else {
            logmsg("gid={$gid} no fixture match — {$match['team_h']} vs {$match['team_c']}");
            $skipped++;
            continue;
        }
    } else {
        // re-using cache — figure out flipped from stored teams
        $sH = teamSimilarity($match['team_h'], $fx['teams']['home']['name'] ?? '');
        $sH2 = teamSimilarity($match['team_h'], $fx['teams']['away']['name'] ?? '');
        $flipped = $sH2 > $sH;
        $pdoS->prepare("UPDATE foot_match_apisports SET last_status = :s, last_synced_at = :t WHERE gid = :g")
              ->execute([':s' => $fx['fixture']['status']['short'] ?? 'NS', ':t' => $now, ':g' => $gid]);
    }

    // Update foot_match scores (for UI live display + final settlement reference)
    applyScoresToFootMatch($pdoS, $gid, $fx, $flipped);

    // Settle bets only if final
    $shortStatus = $fx['fixture']['status']['short'] ?? 'NS';
    $isFinished  = in_array($shortStatus, ['FT', 'AET', 'PEN'], true);
    $isVoidable  = in_array($shortStatus, ['CANC', 'ABD', 'AWD', 'WO', 'PST'], true);

    if (!$isFinished && !$isVoidable) continue;

    $h = $fx['goals']['home'] ?? null; $c = $fx['goals']['away'] ?? null;
    if ($flipped) { [$h, $c] = [$c, $h]; }
    $inballStr = ($h !== null && $c !== null) ? ((int)$h . ':' . (int)$c) : '';

    // Pull all unsettled single-leg bets for this gid
    $bs = $pdoC->prepare("SELECT * FROM bet WHERE gid = :g AND isResult = 0 AND gid NOT LIKE '%,%' LIMIT 200");
    $bs->execute([':g' => (string)$gid]);
    $bets = $bs->fetchAll();

    foreach ($bets as $bet) {
        $grade = $isVoidable ? 'T' : gradeBet($bet, $fx, $flipped);
        if ($grade === null) {
            logmsg("bet ID={$bet['ID']} gid={$gid} unknown wtype={$bet['wtype']}/rtype={$bet['rtype']} — skip");
            continue;
        }
        if (applyGrade($pdoC, $bet, $grade, $inballStr)) {
            $settled++;
            logmsg("bet ID={$bet['ID']} gid={$gid} graded={$grade} score={$inballStr}");
        }
    }
}

logmsg("DONE: matched={$matched} settled={$settled} skipped={$skipped} gids=" . count($gids));
exit(0);
