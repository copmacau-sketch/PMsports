<?php
/**
 * ingest_odds_api.php — 拉 Odds-API.io (赔率) + api-sports.io (赛果)，
 * 转成 Crown XML，UPSERT 到 db_markets.foot_match + foot_match_xml。
 *
 * 替代旧爬虫 (bdata/include/function.php:setMatchData)。原爬虫从 Crown 上游
 * 拉 XML，本脚本从两个公开 API 拉 JSON 然后由 OddsApiToCrownXml 重组成同样
 * 格式的 XML，再走相同的入库逻辑 — 这样 SPA 前端无需任何改动。
 *
 * 用法：
 *   php ingest_odds_api.php                 # 全量 (events + odds + scores)
 *   php ingest_odds_api.php --live-only     # 只拉滚球比分，更新 score_h/c, is_inball
 *   php ingest_odds_api.php --dry-run       # 不写库，只打日志
 *   php ingest_odds_api.php --league=england-premier-league   # 单联赛
 *
 * 推荐 cron:
 *   每 5 分钟  php /path/to/ingest_odds_api.php
 *   每 1 分钟  php /path/to/ingest_odds_api.php --live-only
 */

// 用项目自带 bootstrap：定义 ROOT_PATH/VENDOR 并把 $db_s/$db_c 装进全局作用域。
// include/config.php 会一路 include 到 vendor/mysql/config.php，
// 后者在 cwd=include 时才能解析相对路径 mysql.class.php — 所以这里 chdir。
chdir(__DIR__ . '/include');
require_once __DIR__ . '/include/config.php';
chdir(__DIR__);
require_once VENDOR . '/common/OddsApiToCrownXml.php';
global $db_s, $db_c;

// Crown 原系统所有时间字段都用东八区呈现 (m_date/m_time + datetime epoch
// 都按这个时区写)，否则 SPA 列表页/排序/今日分组会跨日错位。
date_default_timezone_set('Asia/Shanghai');

// ============================================================
// 配置
// ============================================================
define('ODDS_KEY',   getenv('ODDS_API_KEY')  ?: 'f13e2d297eb9e7006113eeca5f95682e3da7a5d39581e0ee7681c5abbd28e3b9');
define('SPORTS_KEY', getenv('APISPORTS_KEY') ?: '967679e7c3c625a64081afc93b7fb1bf');
define('ODDS_BASE',   'https://api.odds-api.io/v3');
define('SPORTS_BASE', 'https://v3.football.api-sports.io');

/** 目标联赛 slug → [中文名, api-sports league_id, 内部 lid]。
 *  lid 是写入 foot_match.lid 的 int，需稳定；选了 10x 段方便和真实数据区分。 */
$LEAGUES = [
    'england-premier-league'                    => ['英超',     39,  101],
    'italy-serie-a'                             => ['意甲',     135, 102],
    'spain-laliga'                              => ['西甲',     140, 103],
    'france-ligue-1'                            => ['法甲',     61,  104],
    'germany-bundesliga'                        => ['德甲',     78,  105],
    'international-clubs-uefa-champions-league' => ['欧冠杯',   2,   106],
    'international-clubs-uefa-europa-league'    => ['欧联杯',   3,   107],
    'international-world-cup'                   => ['世界杯',   1,   108],
    'china-chinese-super-league'                => ['中超',     169, 109],
];

// ============================================================
// CLI 参数
// ============================================================
$opts = parseArgs($argv ?? []);
$liveOnly = !empty($opts['live-only']);
$dryRun   = !empty($opts['dry-run']);
$singleLeague = $opts['league'] ?? null;

logmsg("=== ingest start (liveOnly=" . ($liveOnly?'Y':'N') . " dryRun=" . ($dryRun?'Y':'N') . ") ===");

// ============================================================
// 1) 拉 Odds-API.io 事件
// ============================================================
$allEvents = [];
if (!$liveOnly) {
    $targetSlugs = $singleLeague ? [$singleLeague] : array_keys($LEAGUES);
    foreach (['pending', 'live'] as $status) {
        $params = ['apiKey' => ODDS_KEY, 'sport' => 'football', 'status' => $status, 'bookmaker' => 'Bet365'];
        $url = ODDS_BASE . '/events?' . http_build_query($params);
        $resp = httpGet($url);
        if (!is_array($resp)) { logmsg("WARN: events $status returned non-array"); continue; }
        foreach ($resp as $e) {
            $slug = $e['league']['slug'] ?? '';
            if (!in_array($slug, $targetSlugs, true)) continue;
            $allEvents[(int)$e['id']] = $e;
        }
        logmsg("events status=$status: kept " . count($resp) . " filtered to " . count($allEvents));
    }
} else {
    // live-only 模式：直接从 DB 拉当天比赛 gid，更新比分；不拉 Odds-API
    $today = date('Y-m-d');
    $rs = $db_s->select("SELECT gid, team_h, team_c, m_date FROM db_markets.foot_match WHERE m_date='{$today}'");
    foreach ($rs as $row) {
        $allEvents[(int)$row['gid']] = [
            'id'   => (int)$row['gid'],
            'home' => $row['team_h'],
            'away' => $row['team_c'],
            'date' => $row['m_date'] . 'T00:00:00Z', // 占位
        ];
    }
    logmsg("live-only mode: loaded " . count($allEvents) . " matches for today from DB");
}

if (empty($allEvents)) {
    logmsg("nothing to do; exit");
    exit(0);
}

// ============================================================
// 2) 拉 Odds-API.io 赔率 (并发 batch=10)
// ============================================================
$oddsMap = [];   // event_id => odds response
if (!$liveOnly) {
    $urls = [];
    foreach ($allEvents as $eid => $_) {
        $urls[$eid] = ODDS_BASE . '/odds?' . http_build_query([
            'apiKey' => ODDS_KEY, 'eventId' => $eid, 'bookmakers' => 'Bet365',
        ]);
    }
    foreach (array_chunk($urls, 10, true) as $chunk) {
        foreach (httpGetMulti($chunk) as $eid => $r) {
            if (is_array($r)) $oddsMap[$eid] = $r;
        }
        usleep(300000);
    }
    logmsg("odds fetched for " . count($oddsMap) . "/" . count($allEvents) . " events");
}

// ============================================================
// 3) 拉 api-sports.io 实时比分 + 当日赛事，建模糊匹配索引
// ============================================================
$scoreIdx = []; // "home_norm|away_norm" => fixture
$liveFix = httpGet(SPORTS_BASE . '/fixtures?live=all', ['x-apisports-key: ' . SPORTS_KEY])['response'] ?? [];
$todayFix = httpGet(SPORTS_BASE . '/fixtures?' . http_build_query(['date' => date('Y-m-d')]),
                    ['x-apisports-key: ' . SPORTS_KEY])['response'] ?? [];
foreach (array_merge($liveFix, $todayFix) as $fx) {
    $h = $fx['teams']['home']['name'] ?? ''; $a = $fx['teams']['away']['name'] ?? '';
    if (!$h || !$a) continue;
    $scoreIdx[normalizeTeam($h) . '|' . normalizeTeam($a)] = $fx;
}
logmsg("api-sports: live=" . count($liveFix) . " today=" . count($todayFix) . " indexed=" . count($scoreIdx));

// ============================================================
// 4) 逐事件转换 + UPSERT
// ============================================================
$builder = new OddsApiToCrownXml();
$ftIns = $ftUpd = $xmlIns = $xmlUpd = 0;

foreach ($allEvents as $eid => $ev) {
    $slug = $ev['league']['slug'] ?? '';
    $meta = $LEAGUES[$slug] ?? null;
    if (!$meta && !$liveOnly) { logmsg("skip $eid: unknown league $slug"); continue; }
    [$leagueZh, $sportsLid, $lid] = $meta ?? ['', 0, 0];

    // --- 时间字段 ---
    $ts = isset($ev['date']) ? strtotime($ev['date']) : time();
    $mDate = date('Y-m-d', $ts);
    $hour  = (int)date('H', $ts);
    $mTime = date('H:i', $ts) . ($hour >= 12 ? 'p' : 'a');

    // --- 模糊匹配 api-sports 拿比分 ---
    $home = (string)($ev['home'] ?? '');
    $away = (string)($ev['away'] ?? '');
    $fix = $scoreIdx[normalizeTeam($home) . '|' . normalizeTeam($away)] ?? null;
    if (!$fix) {
        // 退而求其次：双向相似度
        foreach ($scoreIdx as $k => $f) {
            [$kh, $ka] = explode('|', $k, 2);
            similar_text(normalizeTeam($home), $kh, $hp);
            similar_text(normalizeTeam($away), $ka, $ap);
            if ($hp >= 70 && $ap >= 70) { $fix = $f; break; }
        }
    }
    $scoreH = $fix['goals']['home'] ?? null;
    $scoreC = $fix['goals']['away'] ?? null;
    $fxShort = $fix['fixture']['status']['short'] ?? '';
    $isLive = in_array($fxShort, ['1H','2H','HT','ET','P','LIVE'], true) ? 1 : 0;
    $isFinished = in_array($fxShort, ['FT','AET','PEN'], true) ? 1 : 0;

    // Defense-in-depth: trust odds-api.io's own event status when the
    // api-sports lookup didn't find a fixture (CSL especially: rebrand
    // names diverge so completely that even the alias map can miss new
    // 升降班 we haven't catalogued yet, and matches that haven't reached
    // api-sports' indexed `date=` snapshot don't appear in $scoreIdx at all).
    // Without this, a match can be live on the upstream and never light up
    // on the H5 滚球 tab because is_inball stays 0 forever.
    $evStatus = (string)($ev['status'] ?? '');
    if (!$fix) {
        if ($evStatus === 'live') $isLive = 1;
        elseif (in_array($evStatus, ['settled','finished','closed'], true)) $isFinished = 1;
    }

    // 滚球时合并到 event status，让 builder 能正确产生 is_rb=Y
    if ($isLive) $ev['status'] = 'live';
    elseif ($isFinished) $ev['status'] = 'settled';

    // 把比分塞到 event 里供 XML 头部使用
    if ($scoreH !== null) $ev['scores'] = ['home' => $scoreH, 'away' => $scoreC];

    // --- 生成 XML 并编码 ---
    $oddsResp = $oddsMap[$eid] ?? null;
    if (!$liveOnly && $oddsResp) {
        $xmlStr = $builder->buildR($ev, $oddsResp, 'Bet365', 'zh-cn', $lid);
        $encoded = base64_encode(gzdeflate($xmlStr));
    } else {
        $xmlStr = ''; $encoded = '';
    }

    // --- foot_match UPSERT ---
    //
    // Crown legacy field semantics (consumed by api_v2.php::matchStatus +
    // ::extractScores and by settle_bets.php finalisation):
    //   status     = 1  → 比赛已开始 (in-play OR finished); 0 → 未开赛
    //   is_inball  = 1  → 已结球 (终场), inball_h/c 是终场比分
    //   score_h/c  = 实时比分 (滚球过程中持续更新)
    //   inball_h/c = 终场比分 (settle_bets.php 在终场后写入)
    // The earlier code had is_inball/status swapped — that pushed live CSL
    // matches into the "settled" branch of extractScores so score_home came
    // out null and is_finished=true while is_inball=1.
    $fields = [
        'gid'      => $eid,
        'gidm'     => $eid,
        'ecid'     => $eid,
        'lid'      => $lid,
        'datetime' => $ts,
        'm_date'   => $mDate,
        'm_time'   => $mTime,
        'league'    => $leagueZh,
        'league_tw' => $leagueZh,
        'league_en' => $ev['league']['name'] ?? '',
        'team_h'    => $home,
        'team_h_tw' => $home,
        'team_h_en' => $home,
        'team_c'    => $away,
        'team_c_tw' => $away,
        'team_c_en' => $away,
        'gnum_h'    => (int)($ev['homeId'] ?? 0),
        'gnum_c'    => (int)($ev['awayId'] ?? 0),
        'score_h'   => $scoreH,
        'score_c'   => $scoreC,
        'is_score'  => ($scoreH !== null) ? 1 : 0,
        'is_inball' => $isFinished,                 // 1 only when match is finished
        'is_hr_inball' => $isFinished,
        'status'    => ($isLive || $isFinished) ? 1 : 0,  // 1 once the match has kicked off
        'fopen'     => 1,
        'master'    => 'Y',
    ];
    if ($isFinished) {
        // Mirror what settle_bets.php writes when a match closes.
        $fields['inball_h'] = $scoreH;
        $fields['inball_c'] = $scoreC;
    }

    // In live-only mode the synthetic $ev has no league/slug/date, so the
    // full-row UPSERT would blow away lid/league/datetime/team names with
    // empty fallbacks (especially `lid=0`, `league=''`) — that would in
    // turn make /api/external/events drop the row because the API filters
    // on `lid BETWEEN 101 AND 109`. Strip metadata fields so live-only
    // only touches the score / status columns we actually have fresh
    // data for.
    if ($liveOnly) {
        foreach (['gidm','ecid','lid','datetime','m_date','m_time','league',
                  'league_tw','league_en','team_h','team_h_tw','team_h_en',
                  'team_c','team_c_tw','team_c_en','gnum_h','gnum_c',
                  'fopen','master'] as $skip) {
            unset($fields[$skip]);
        }
    }

    if ($dryRun) {
        logmsg("[dry] foot_match gid=$eid $home vs $away score=$scoreH-$scoreC live=$isLive");
    } else {
        $isNew = upsertFootMatch($db_s, $fields);
        $isNew ? $ftIns++ : $ftUpd++;
    }

    // --- foot_match_xml UPSERT (只在有 XML 时) ---
    if (!$liveOnly && $encoded !== '') {
        $xmlFields = [
            'gid'       => $eid,
            'm_date'    => $mDate,
            'r_cn'      => $encoded,
            'r_tw'      => $encoded,  // MVP: 三语用同一份英文 XML
            'r_en'      => $encoded,
            'is_r'      => 1,
            'r_up_time' => time(),
            'r_display' => 0,
        ];
        if ($dryRun) {
            logmsg("[dry] foot_match_xml gid=$eid xml=" . strlen($encoded) . "B");
        } else {
            $isNew = upsertFootMatchXml($db_s, $xmlFields);
            $isNew ? $xmlIns++ : $xmlUpd++;
        }
    }
}

logmsg("=== done: foot_match +$ftIns ~$ftUpd ; foot_match_xml +$xmlIns ~$xmlUpd ===");
exit(0);

// ============================================================
// helpers
// ============================================================

function parseArgs(array $argv): array
{
    $out = [];
    foreach ($argv as $a) {
        if (substr($a, 0, 2) !== '--') continue;
        $kv = substr($a, 2);
        if (strpos($kv, '=') !== false) {
            [$k, $v] = explode('=', $kv, 2);
            $out[$k] = $v;
        } else {
            $out[$kv] = true;
        }
    }
    return $out;
}

function logmsg(string $m): void { fwrite(STDERR, '[' . date('H:i:s') . "] $m\n"); }

function httpGet(string $url, array $headers = [])
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20,
        CURLOPT_SSL_VERIFYPEER => false, CURLOPT_HTTPHEADER => $headers,
    ]);
    $r = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 400) { logmsg("HTTP $code $url"); return null; }
    return json_decode($r, true);
}

function httpGetMulti(array $urls, array $headers = []): array
{
    $mh = curl_multi_init();
    $chs = [];
    foreach ($urls as $k => $u) {
        $c = curl_init($u);
        curl_setopt_array($c, [
            CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20,
            CURLOPT_SSL_VERIFYPEER => false, CURLOPT_HTTPHEADER => $headers,
        ]);
        curl_multi_add_handle($mh, $c);
        $chs[$k] = $c;
    }
    $running = 0;
    do {
        curl_multi_exec($mh, $running);
        curl_multi_select($mh, 0.5);
    } while ($running > 0);
    $out = [];
    foreach ($chs as $k => $c) {
        $out[$k] = json_decode(curl_multi_getcontent($c), true);
        curl_multi_remove_handle($mh, $c);
        curl_close($c);
    }
    curl_multi_close($mh);
    return $out;
}

function normalizeTeam(string $name): string
{
    $name = mb_strtolower(trim($name));
    $name = preg_replace('/\b(fc|cf|sc|ac|as|ss|afc|ssc|rcd|rc|us|og|1\.\s*fc)\b/i', '', $name);
    $name = preg_replace('/[^a-z0-9\s]/', '', $name);
    $name = trim(preg_replace('/\s+/', ' ', $name));
    return cslCanonicalizeIngest($name);
}

/**
 * Bridge api-sports.io legacy CSL names with odds-api.io modern names.
 * Mirror of api_v2.php::_csl_canonicalize and settle_bets.php::cslCanonicalize —
 * keep all three maps in lockstep.
 *
 * api-sports.io ships pre-rebrand names ("SHANGHAI SIPG", "Henan Jianye",
 * "Hangzhou Greentown", "Tianjin Teda", "Shandong Luneng", "Qingdao
 * Jonoon"...) while odds-api.io ships current names. Without this canon
 * step, the score-index lookup in step 3 misses CSL matches and they
 * never get `is_inball=1` even when odds-api itself says status=live.
 */
function cslCanonicalizeIngest(string $n): string
{
    static $aliases = [
        // Phrases first (longer wins over shorter substrings).
        'hangzhou greentown' => 'zhejiang',
        'youth island'       => 'west coast',
        'better city'        => 'rongcheng',
        'shenyang urban'     => 'liaoning tieren',
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

/**
 * REPLACE INTO 风格的 UPSERT（MyISAM 无事务但 PRIMARY KEY 唯一即可保证）。
 * @return bool true 如果是新插入
 */
function upsertFootMatch($db_s, array $fields): bool
{
    $gid = (int)$fields['gid'];
    $exists = $db_s->select("SELECT 1 FROM db_markets.foot_match WHERE gid={$gid} LIMIT 1", 'Row');
    if ($exists) {
        $set = [];
        foreach ($fields as $k => $v) {
            if ($k === 'gid') continue;
            $val = is_null($v) ? 'NULL' : "'" . addslashes((string)$v) . "'";
            $set[] = "`$k`={$val}";
        }
        $db_s->execSql("UPDATE db_markets.foot_match SET " . implode(',', $set) . " WHERE gid={$gid}");
        return false;
    }
    $cols = [];
    $vals = [];
    foreach ($fields as $k => $v) {
        $cols[] = "`$k`";
        $vals[] = is_null($v) ? 'NULL' : "'" . addslashes((string)$v) . "'";
    }
    $db_s->execSql("INSERT INTO db_markets.foot_match (" . implode(',', $cols)
                 . ") VALUES (" . implode(',', $vals) . ")");
    return true;
}

function upsertFootMatchXml($db_s, array $fields): bool
{
    $gid = (int)$fields['gid'];
    $exists = $db_s->select("SELECT 1 FROM db_markets.foot_match_xml WHERE gid={$gid} LIMIT 1", 'Row');
    if ($exists) {
        $set = [];
        foreach ($fields as $k => $v) {
            if ($k === 'gid') continue;
            $val = is_null($v) ? 'NULL' : "'" . addslashes((string)$v) . "'";
            $set[] = "`$k`={$val}";
        }
        $db_s->execSql("UPDATE db_markets.foot_match_xml SET " . implode(',', $set) . " WHERE gid={$gid}");
        return false;
    }
    $cols = [];
    $vals = [];
    foreach ($fields as $k => $v) {
        $cols[] = "`$k`";
        $vals[] = is_null($v) ? 'NULL' : "'" . addslashes((string)$v) . "'";
    }
    $db_s->execSql("INSERT INTO db_markets.foot_match_xml (" . implode(',', $cols)
                 . ") VALUES (" . implode(',', $vals) . ")");
    return true;
}
