<?php
/**
 * backfill_bet_hints.php — One-off / re-runnable settlement-metadata
 * backfill for legacy H5 bets placed before the api_v2.php place-bet
 * endpoint started persisting `wtype` / `rtype` / `spread` / `ptype`.
 *
 * Strategy:
 *   1) Pull bets where isResult=0 AND gtype='FT' AND wtype IS NULL AND
 *      gid NOT LIKE '%,%'.
 *   2) For each bet, read foot_match.team_h/team_c (English, from
 *      Odds-API.io) and parse the stored Chinese `betstr` using the
 *      patterns the H5 frontend produces (see sports/page.tsx
 *      buildRowOption + outcomeLabel).
 *   3) Resolve `rtype` either by direct English/Chinese substring match
 *      against team_h/team_c, or via the English↔Chinese alias map in
 *      api_v2.php::teamNameToChinese().
 *   4) UPDATE bet SET wtype/rtype/spread/ptype/ptype_en/chose_team. Do
 *      NOT touch result/isResult — settle_bets.php picks them up on the
 *      next cron pass.
 *
 * Trigger:
 *   CLI:  php backfill_bet_hints.php
 *   HTTP: GET /api/backfill-bets?key=cron2026
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

// --- Inline copy of api_v2.php::teamNameToChinese() -------------------------
// Kept in sync manually. If you update one map, update the other.
function teamNameToChinese(string $en): string {
    static $map = null;
    if ($map === null) {
        $map = [
            // CSL
            'shanghai port fc' => '上海海港', 'shanghai port' => '上海海港', 'shanghai sipg' => '上海海港',
            'shanghai shenhua fc' => '上海申花', 'shanghai shenhua' => '上海申花',
            'beijing guoan' => '北京国安',
            'tianjin jinmen tiger' => '天津津门虎', 'tianjin jinmen tiger fc' => '天津津门虎', 'tianjin teda' => '天津津门虎',
            'shandong taishan' => '山东泰山', 'shandong luneng' => '山东泰山',
            'wuhan three towns' => '武汉三镇',
            'chengdu rongcheng fc' => '成都蓉城', 'chengdu rongcheng' => '成都蓉城',
            'zhejiang fc' => '浙江队', 'zhejiang' => '浙江队', 'hangzhou greentown' => '浙江队',
            'henan' => '河南队', 'henan fc' => '河南队', 'henan jianye' => '河南队',
            'qingdao west coast fc' => '青岛西海岸', 'qingdao youth island' => '青岛西海岸',
            'qingdao hainiu fc' => '青岛海牛', 'qingdao hainiu' => '青岛海牛', 'qingdao jonoon' => '青岛海牛',
            'meizhou hakka' => '梅州客家', 'changchun yatai' => '长春亚泰',
            'shenzhen peng city' => '深圳新鹏城', 'yunnan yukun' => '云南玉昆',
            'dalian yingbo' => '大连英博', 'dalian zhixing' => '大连英博',
            // Serie A
            'ac milan' => 'AC米兰', 'acf fiorentina' => '佛罗伦萨', 'fiorentina' => '佛罗伦萨',
            'as roma' => '罗马', 'roma' => '罗马',
            'atalanta bc' => '亚特兰大', 'atalanta' => '亚特兰大',
            'bologna fc' => '博洛尼亚', 'bologna' => '博洛尼亚',
            'cagliari calcio' => '卡利亚里', 'cagliari' => '卡利亚里',
            'como 1907' => '科莫', 'como' => '科莫',
            'genoa cfc' => '热那亚', 'genoa' => '热那亚',
            'hellas verona' => '维罗纳', 'verona' => '维罗纳',
            'inter milano' => '国际米兰', 'inter' => '国际米兰', 'inter milan' => '国际米兰',
            'juventus turin' => '尤文图斯', 'juventus' => '尤文图斯',
            'lazio rome' => '拉齐奥', 'lazio' => '拉齐奥',
            'napoli' => '那不勒斯', 'ssc napoli' => '那不勒斯',
            'parma calcio' => '帕尔马', 'parma' => '帕尔马',
            'pisa sc' => '比萨', 'pisa' => '比萨',
            'sassuolo calcio' => '萨索洛', 'sassuolo' => '萨索洛',
            'torino fc' => '都灵', 'torino' => '都灵',
            'us cremonese' => '克雷莫纳', 'cremonese' => '克雷莫纳',
            'us lecce' => '莱切', 'lecce' => '莱切',
            'udinese calcio' => '乌迪内斯', 'udinese' => '乌迪内斯',
            'empoli' => '恩波利', 'salernitana' => '萨勒尼塔纳',
            // La Liga
            'real madrid' => '皇家马德里',
            'fc barcelona' => '巴塞罗那', 'barcelona' => '巴塞罗那',
            'atletico madrid' => '马德里竞技', 'club atletico de madrid' => '马德里竞技',
            'sevilla fc' => '塞维利亚', 'sevilla' => '塞维利亚',
            'valencia cf' => '瓦伦西亚', 'valencia' => '瓦伦西亚',
            'villarreal cf' => '比利亚雷亚尔', 'villarreal' => '比利亚雷亚尔',
            'rcd mallorca' => '马洛卡',
            'rayo vallecano' => '巴列卡诺',
            'real betis seville' => '皇家贝蒂斯', 'real betis' => '皇家贝蒂斯',
            'real oviedo' => '皇家奥维耶多',
            'real sociedad san sebastian' => '皇家社会', 'real sociedad' => '皇家社会',
            'athletic bilbao' => '毕尔巴鄂竞技', 'athletic club bilbao' => '毕尔巴鄂竞技',
            'rc celta de vigo' => '凯尔特', 'celta vigo' => '凯尔特',
            'real valladolid' => '巴拉多利德',
            'getafe cf' => '赫塔费', 'getafe' => '赫塔费',
            'deportivo alaves' => '阿拉维斯', 'alaves' => '阿拉维斯',
            'cd leganes' => '莱加内斯', 'leganes' => '莱加内斯',
            'ud las palmas' => '拉斯帕尔马斯', 'las palmas' => '拉斯帕尔马斯',
            'osasuna' => '奥萨苏纳', 'ca osasuna' => '奥萨苏纳',
            'ud almeria' => '阿尔梅里亚', 'almeria' => '阿尔梅里亚',
            'cd espanyol' => '西班牙人', 'espanyol' => '西班牙人',
            'girona fc' => '赫罗纳', 'girona' => '赫罗纳',
            // Premier League (sample)
            'manchester city' => '曼城', 'manchester united' => '曼联',
            'arsenal' => '阿森纳', 'liverpool' => '利物浦',
            'chelsea' => '切尔西', 'tottenham hotspur' => '热刺', 'tottenham' => '热刺',
            'newcastle united' => '纽卡斯尔', 'newcastle' => '纽卡斯尔',
            'aston villa' => '阿斯顿维拉', 'west ham united' => '西汉姆', 'west ham' => '西汉姆',
            'brighton hove albion' => '布莱顿', 'brighton' => '布莱顿',
            'crystal palace' => '水晶宫', 'everton' => '埃弗顿',
            'leicester city' => '莱斯特城', 'leicester' => '莱斯特城',
            'fulham' => '富勒姆', 'brentford' => '布伦特福德',
            'wolverhampton wanderers' => '狼队', 'wolves' => '狼队',
            'bournemouth' => '伯恩茅斯', 'afc bournemouth' => '伯恩茅斯',
            'ipswich town' => '伊普斯维奇', 'southampton' => '南安普顿',
            'nottingham forest' => '诺丁汉森林',
        ];
    }
    $key = strtolower(trim($en));
    return $map[$key] ?? '';
}

$DB_HOST   = '127.0.0.1';
$DB_USER   = 'root';
$DB_PASS   = '49f0863e9070';
$DB_MARKETS = 'db_markets';
$DB_CLIENT = 'db_client';

function log_(string $s): void {
    $ts = date('Y-m-d H:i:s');
    fwrite(STDERR, "[{$ts}] {$s}\n");
    if (PHP_SAPI !== 'cli') echo "[{$ts}] {$s}\n";
}

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
    log_('DB connect failed: ' . $e->getMessage());
    exit(1);
}

/**
 * Decide which side a Chinese label refers to. Reuses api_v2's
 * English↔Chinese team name map.
 */
function sideFromLabel(string $label, string $teamH, string $teamC): ?string {
    if ($label === '' || $label === null) return null;
    if ($teamH !== '' && stripos($label, $teamH) !== false) return 'H';
    if ($teamC !== '' && stripos($label, $teamC) !== false) return 'C';
    $hZh = teamNameToChinese($teamH);
    $cZh = teamNameToChinese($teamC);
    if ($hZh !== '' && mb_stripos($label, $hZh, 0, 'UTF-8') !== false) return 'H';
    if ($cZh !== '' && mb_stripos($label, $cZh, 0, 'UTF-8') !== false) return 'C';
    if (preg_match('/(主队|home|^\s*1\b)/iu', $label)) return 'H';
    if (preg_match('/(客队|away|^\s*2\b)/iu', $label)) return 'C';
    return null;
}

/**
 * Parse a stored betstr (Chinese outcome label) into (wtype, rtype,
 * spread, ptype_en). Returns null on inability.
 *
 * Patterns observed in legacy bets:
 *   - "<team> 胜"                    → ML
 *   - "和局" / "平局"                → ML / D
 *   - "半场 <team> 胜"               → HT_ML
 *   - "半场和"                       → HT_ML / D
 *   - "<team> [+-]N(\.N)?"           → SP
 *   - "半场 <team> [+-]N(\.N)?"      → HT_SP
 *   - "大 N" / "小 N"                → OU
 *   - "半场大 N" / "半场小 N"         → HT_OU
 *   - "两队进球 - 是" / "- 否"        → BTS
 *   - "半场两队进球 - 是" / "- 否"    → HT_BTS
 *   - "Home [+-]N" / "Away [+-]N"    → SP (legacy English)
 *   - "<比分>" "1:0" / "1-0"         → CS
 *   - "<team>"                       → ML (degenerate, single team name)
 */
function parseBetStr(string $betstr, string $teamH, string $teamC): array {
    $b = trim($betstr);
    if ($b === '') return ['wtype' => null];

    $isHt = (mb_strpos($b, '半场') === 0) || (mb_strpos($b, '上半场') === 0);
    // Strip the leading 半场 prefix for downstream matching while remembering it.
    $core = preg_replace('/^(上)?半场\s*/u', '', $b);

    // BTS
    if (preg_match('/(两队进球|双方进球)/u', $b)) {
        $isYes = (bool)preg_match('/(是|yes|Y\b)/iu', $b);
        $isNo  = (bool)preg_match('/(否|no|N\b)/iu', $b);
        if ($isYes || $isNo) {
            return [
                'wtype' => $isHt ? 'HT_BTS' : 'BTS',
                'rtype' => $isYes ? 'Y' : 'N',
                'spread' => null,
                'marketEn' => $isHt ? 'Both Teams To Score HT' : 'Both Teams To Score',
            ];
        }
    }

    // OU "大 2.5" / "小 N"
    if (preg_match('/^(?:大|高于|over)\s*([+-]?\d+(?:\.\d+)?)/iu', $core, $m)) {
        return [
            'wtype' => $isHt ? 'HT_OU' : 'OU',
            'rtype' => 'OVER',
            'spread' => (float)$m[1],
            'marketEn' => $isHt ? 'Totals HT' : 'Totals',
        ];
    }
    if (preg_match('/^(?:小|低于|under)\s*([+-]?\d+(?:\.\d+)?)/iu', $core, $m)) {
        return [
            'wtype' => $isHt ? 'HT_OU' : 'OU',
            'rtype' => 'UNDER',
            'spread' => (float)$m[1],
            'marketEn' => $isHt ? 'Totals HT' : 'Totals',
        ];
    }

    // SP with explicit numeric handicap (Chinese or English, with team).
    if (preg_match('/([+-]\d+(?:\.\d+)?)/u', $core, $m)) {
        $spread = (float)$m[1];
        $side = sideFromLabel($core, $teamH, $teamC);
        // English fallback: "Home" / "Away" tokens
        if ($side === null) {
            if (stripos($core, 'home') !== false) $side = 'H';
            elseif (stripos($core, 'away') !== false) $side = 'C';
        }
        if ($side !== null) {
            return [
                'wtype' => $isHt ? 'HT_SP' : 'SP',
                'rtype' => $side,
                'spread' => $spread,
                'marketEn' => $isHt ? 'Spread HT' : 'Spread',
            ];
        }
    }

    // ML — "<team> 胜" / "和局" / single team name
    if (preg_match('/(和局|平局|平|draw)/iu', $core)) {
        return [
            'wtype' => $isHt ? 'HT_ML' : 'ML',
            'rtype' => 'D',
            'spread' => null,
            'marketEn' => $isHt ? 'Half Time Result' : 'ML',
        ];
    }
    // Strip trailing 胜 / win marker
    $teamPart = preg_replace('/\s*(胜|赢|win|wins?)\s*$/iu', '', $core);
    $teamPart = trim($teamPart);
    $side = sideFromLabel($teamPart === '' ? $core : $teamPart, $teamH, $teamC);
    if ($side !== null) {
        return [
            'wtype' => $isHt ? 'HT_ML' : 'ML',
            'rtype' => $side,
            'spread' => null,
            'marketEn' => $isHt ? 'Half Time Result' : 'ML',
        ];
    }

    return ['wtype' => null];
}

// --- Run -------------------------------------------------------------

$rows = $pdoC->query("
    SELECT b.ID, b.gid, b.team_h AS bet_team_h, b.team_c AS bet_team_c, b.betstr, b.ptype, b.wtype
    FROM bet b
    WHERE b.isResult = 0
      AND b.gtype = 'FT'
      AND b.gid NOT LIKE '%,%'
      AND (b.wtype IS NULL OR b.rtype IS NULL)
    ORDER BY b.ID DESC
")->fetchAll();

log_('Candidates: ' . count($rows));

$updated = 0; $unresolved = 0;
foreach ($rows as $r) {
    $gid = (int)$r['gid'];
    $stm = $pdoS->prepare("SELECT team_h, team_c FROM foot_match WHERE gid = :g LIMIT 1");
    $stm->execute([':g' => $gid]);
    $fm = $stm->fetch();
    $teamH = $fm['team_h'] ?? $r['bet_team_h'] ?? '';
    $teamC = $fm['team_c'] ?? $r['bet_team_c'] ?? '';

    $hint = parseBetStr((string)$r['betstr'], (string)$teamH, (string)$teamC);
    if (empty($hint['wtype'])) {
        $unresolved++;
        log_("ID={$r['ID']} gid={$gid} betstr=" . substr($r['betstr'] ?? '', 0, 120) . " — could not resolve");
        continue;
    }

    $upd = $pdoC->prepare("UPDATE bet
        SET wtype = COALESCE(:w, wtype),
            rtype = COALESCE(:r, rtype),
            spread = COALESCE(:s, spread),
            ptype = COALESCE(:pt, ptype),
            ptype_en = COALESCE(:pe, ptype_en),
            chose_team = COALESCE(:ct, chose_team)
        WHERE ID = :id AND isResult = 0");
    $choseTeam = ($hint['rtype'] === 'H') ? 'H' : (($hint['rtype'] === 'C') ? 'C' : null);
    $upd->execute([
        ':w'  => $hint['wtype'],
        ':r'  => $hint['rtype'] ?? null,
        ':s'  => isset($hint['spread']) && $hint['spread'] !== null ? (string)$hint['spread'] : null,
        ':pt' => $r['ptype'] ?: ($hint['marketEn'] ?? null),
        ':pe' => $hint['marketEn'] ?? null,
        ':ct' => $choseTeam,
        ':id' => $r['ID'],
    ]);
    $updated++;
    log_("ID={$r['ID']} gid={$gid} → wtype={$hint['wtype']} rtype=" . ($hint['rtype'] ?? '-') . " spread=" . ($hint['spread'] ?? '-'));
}

log_("DONE: updated={$updated} unresolved={$unresolved} total=" . count($rows));

// Optional: force-expire stale fixture cache for explicit gids.
$forceGids = [];
if (PHP_SAPI === 'cli' && isset($argv[1])) {
    $forceGids = array_filter(array_map('intval', explode(',', $argv[1])));
} elseif (isset($_GET['expire'])) {
    $forceGids = array_filter(array_map('intval', explode(',', $_GET['expire'])));
}
if (!empty($forceGids)) {
    $in = implode(',', $forceGids);
    $n = $pdoS->exec("DELETE FROM foot_match_apisports WHERE gid IN ({$in})");
    log_("expired cache for gids ({$in}): {$n} row(s)");
}
