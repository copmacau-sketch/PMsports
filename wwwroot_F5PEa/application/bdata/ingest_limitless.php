<?php
/**
 * ingest_limitless.php — pull odds from limitless.show/api/quote (SOLE odds
 * source) and UPSERT them into db_sports.foot_match + foot_match_xml as Crown
 * r_cn XML, reusing OddsApiToCrownXml + LeagueRegistry + the same upsert path
 * as the legacy ingest_odds_api.php.
 *
 * WHY: Odds-API.io's Bet365 "Correct Score" feed only carried home-win + draw
 * scorelines, so away-team winning 波胆 (e.g. 阿森纳赢球的 0-1/0-2/1-2) never
 * rendered.  limitless.show/api/quote aggregates the full scoreline set, so we
 * switch the entire odds catalogue to it.  Coverage is intentionally limited
 * to the head-to-head matches limitless curates (~12 right now); outright
 * events in the quote are skipped (the sfs outright catalogue owns those).
 *
 * Score / status finalisation is NOT done here — the legacy
 * `ingest_odds_api.php --live-only` cron (api-sports.io) keeps updating live
 * score_h/score_c/is_inball, and settle_bets.php (limitless oracle) finalises
 * results.  This script only writes odds + match metadata + a kickoff-derived
 * `status`, and deliberately never touches the score columns so it cannot
 * stomp fresh in-play scores.
 *
 * Usage:
 *   php ingest_limitless.php                 # fetch + upsert
 *   php ingest_limitless.php --dry-run       # fetch + log, no DB writes
 *   php ingest_limitless.php --probe-file=/tmp/q.json --gid=69339514
 *                                            # DB-free: dump parsed markets
 *
 * Cron (replaces the Odds-API.io odds tiers; live-only score cron stays):
 *   slash-star-slash 2  www-data /usr/bin/php .../ingest_limitless.php >> /var/log/odds-ingest.log 2>&1
 */

date_default_timezone_set('Asia/Shanghai');

define('QUOTE_URL', getenv('LIMITLESS_QUOTE_URL') ?: 'https://limitless.show/api/quote');

// ------------------------------------------------------------------
// CLI args
// ------------------------------------------------------------------
$opts = ingest_parse_args($argv ?? []);
$dryRun    = !empty($opts['dry-run']);
$probeFile = $opts['probe-file'] ?? null;
$probeGid  = isset($opts['gid']) ? (string)$opts['gid'] : null;

// ------------------------------------------------------------------
// DB-free probe mode: build XML for one event from a saved quote JSON and
// print the parsed market summary (no config.php / DB bootstrap).
// ------------------------------------------------------------------
if ($probeFile !== null) {
    require_once __DIR__ . '/../../vendor/common/OddsApiToCrownXml.php';
    require_once __DIR__ . '/../../vendor/common/LimitlessQuoteAdapter.php';
    $raw = json_decode((string)file_get_contents($probeFile), true);
    $events = $raw['events'] ?? [];
    $builder = new OddsApiToCrownXml();
    foreach ($events as $ev) {
        if ($probeGid !== null && (string)($ev['oddsId'] ?? '') !== $probeGid) continue;
        if (empty($ev['homeTeam']) || empty($ev['awayTeam'])) continue;
        $event = LimitlessQuoteAdapter::toEvent($ev);
        $odds  = LimitlessQuoteAdapter::toBookmaker($ev);
        $xml = $builder->buildR($event, $odds, 'Bet365', 'zh-cn', 0);
        ingest_probe_dump($event, $odds, $xml);
        if ($probeGid !== null) break;
    }
    exit(0);
}

// ------------------------------------------------------------------
// Normal mode: full bootstrap (mirrors ingest_odds_api.php).
// ------------------------------------------------------------------
chdir(__DIR__ . '/include');
require_once __DIR__ . '/include/config.php';
chdir(__DIR__);
require_once VENDOR . '/common/OddsApiToCrownXml.php';
require_once VENDOR . '/common/LeagueRegistry.php';
require_once VENDOR . '/common/LimitlessQuoteAdapter.php';
global $db_s, $db_c;

$cgDbHost = getenv('CG_DB_HOST') ?: '127.0.0.1';
$cgDbUser = getenv('CG_DB_USER') ?: 'root';
$cgDbPass = getenv('CG_DB_PASS') ?: '49f0863e9070';
$cgDbName = getenv('CG_DB_NAME') ?: 'db_sports';
try {
    $pdoLR = new PDO("mysql:host={$cgDbHost};dbname={$cgDbName};charset=utf8mb4",
                     $cgDbUser, $cgDbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    fwrite(STDERR, "FATAL: ingest cannot reach db_sports for LeagueRegistry: " . $e->getMessage() . "\n");
    exit(1);
}

ingest_log("=== limitless ingest start (dryRun=" . ($dryRun ? 'Y' : 'N') . ") ===");

$quote = ingest_http_get(QUOTE_URL);
if (!is_array($quote) || empty($quote['events'])) {
    ingest_log("FATAL: limitless quote returned no events");
    exit(1);
}
$events = $quote['events'];
ingest_log("limitless quote: events=" . count($events)
    . " activeMarkets=" . ($quote['activeMarketsCount'] ?? '?')
    . " cacheAgeSec=" . ($quote['cacheAgeSec'] ?? '?'));

$builder = new OddsApiToCrownXml();
$ftIns = $ftUpd = $xmlIns = $xmlUpd = $skipped = 0;
$now = time();

// Per-gid full-market cache for api_v2.php's detail panel. r_cn only carries
// the single main line per market; this dir carries EVERY handicap / total
// line via LimitlessQuoteAdapter::toBookmakerFull(). Lives on tmpfs so it
// survives PHP-FPM PrivateTmp and is cheap to rewrite each tick.
define('LIMITLESS_MK_DIR', getenv('LIMITLESS_MK_DIR') ?: '/dev/shm/crown_limitless_mk');
if (!$dryRun && !is_dir(LIMITLESS_MK_DIR)) @mkdir(LIMITLESS_MK_DIR, 0775, true);
$mkWritten = 0;

foreach ($events as $ev) {
    $gid  = (string)($ev['oddsId'] ?? '');
    $home = (string)($ev['homeTeam'] ?? '');
    $away = (string)($ev['awayTeam'] ?? '');
    $slug = (string)($ev['sportKey'] ?? '');

    // Skip outright / non head-to-head events (no team pair).
    if ($gid === '' || $home === '' || $away === '') { $skipped++; continue; }
    if ($slug === '') { ingest_log("skip {$gid}: empty sportKey"); $skipped++; continue; }

    // League metadata via the registry (creates the row on first sight).
    $reg = LeagueRegistry::resolveOrCreate($pdoLR, $slug, [
        'name_en' => (string)($ev['sportTitle'] ?? ''),
    ]);
    $lid      = (int)$reg['lid'];
    $leagueZh = (string)($reg['name_cn'] ?: $reg['name_en']);
    if (!$lid) { ingest_log("skip {$gid}: unable to resolve lid for slug={$slug}"); $skipped++; continue; }

    // Time fields (commenceTime is UTC; date() renders in Asia/Shanghai).
    $ts    = $ev['commenceTime'] ? strtotime($ev['commenceTime']) : $now;
    $mDate = date('Y-m-d', $ts);
    $hour  = (int)date('H', $ts);
    $mTime = date('H:i', $ts) . ($hour >= 12 ? 'p' : 'a');

    // Build r_cn XML from the adapted markets.
    $event   = LimitlessQuoteAdapter::toEvent($ev);
    $oddsResp = LimitlessQuoteAdapter::toBookmaker($ev);
    $xmlStr  = $builder->buildR($event, $oddsResp, 'Bet365', 'zh-cn', $lid);
    $encoded = base64_encode(gzdeflate($xmlStr));

    // Conservative status: 1 once kicked off, else 0. We do NOT write score
    // columns or is_inball here — the --live-only api-sports cron and
    // settle_bets.php own those, and writing them blank would stomp live data.
    $kickedOff = ($ts <= $now) ? 1 : 0;

    $fields = [
        'gid'       => $gid,
        'gidm'      => $gid,
        'ecid'      => $gid,
        'lid'       => $lid,
        'datetime'  => $ts,
        'm_date'    => $mDate,
        'm_time'    => $mTime,
        'league'    => $leagueZh,
        'league_tw' => $leagueZh,
        'league_en' => (string)($ev['sportTitle'] ?? ''),
        'team_h'    => $home,
        'team_h_tw' => $home,
        'team_h_en' => $home,
        'team_c'    => $away,
        'team_c_tw' => $away,
        'team_c_en' => $away,
        'status'    => $kickedOff,
        'fopen'     => 1,
        'master'    => 'Y',
    ];

    if ($dryRun) {
        ingest_log("[dry] foot_match gid={$gid} [{$slug}] {$home} vs {$away} lid={$lid} xml=" . strlen($encoded) . "B");
    } else {
        $isNew = ingest_upsert($db_s, 'db_sports.foot_match', $fields, (int)$gid);
        $isNew ? $ftIns++ : $ftUpd++;
        $xmlFields = [
            'gid'       => $gid,
            'm_date'    => $mDate,
            'r_cn'      => $encoded,
            'r_tw'      => $encoded,
            'r_en'      => $encoded,
            'is_r'      => 1,
            'r_up_time' => time(),
            'r_display' => 0,
        ];
        $isNew = ingest_upsert($db_s, 'db_sports.foot_match_xml', $xmlFields, (int)$gid);
        $isNew ? $xmlIns++ : $xmlUpd++;

        // Write the full multi-line market book for api_v2.php's detail panel.
        $full = LimitlessQuoteAdapter::toBookmakerFull($ev);
        if (@file_put_contents(LIMITLESS_MK_DIR . '/' . $gid . '.json', json_encode($full), LOCK_EX) !== false) {
            $mkWritten++;
        }
    }
}

ingest_log("=== done: foot_match +{$ftIns} ~{$ftUpd} ; foot_match_xml +{$xmlIns} ~{$xmlUpd} ; mk {$mkWritten} ; skipped {$skipped} ===");
exit(0);

// ==================================================================
// helpers
// ==================================================================

function ingest_parse_args(array $argv): array
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

function ingest_log(string $m): void { fwrite(STDERR, '[' . date('H:i:s') . "] {$m}\n"); }

function ingest_http_get(string $url, array $headers = [])
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_USERAGENT      => 'crown-gold-ingest/1.0',
    ]);
    $r = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 400 || $r === false) { ingest_log("HTTP {$code} {$url}"); return null; }
    return json_decode($r, true);
}

/** REPLACE-style UPSERT keyed by gid (MyISAM, no transactions). @return bool isNew */
function ingest_upsert($db_s, string $table, array $fields, int $gid): bool
{
    $exists = $db_s->select("SELECT 1 FROM {$table} WHERE gid={$gid} LIMIT 1", 'Row');
    if ($exists) {
        $set = [];
        foreach ($fields as $k => $v) {
            if ($k === 'gid') continue;
            $set[] = "`{$k}`=" . (is_null($v) ? 'NULL' : "'" . addslashes((string)$v) . "'");
        }
        $db_s->execSql("UPDATE {$table} SET " . implode(',', $set) . " WHERE gid={$gid}");
        return false;
    }
    $cols = $vals = [];
    foreach ($fields as $k => $v) {
        $cols[] = "`{$k}`";
        $vals[] = is_null($v) ? 'NULL' : "'" . addslashes((string)$v) . "'";
    }
    $db_s->execSql("INSERT INTO {$table} (" . implode(',', $cols) . ") VALUES (" . implode(',', $vals) . ")");
    return true;
}

/** Probe-mode pretty printer: decode the r_cn XML and summarise key markets. */
function ingest_probe_dump(array $event, array $odds, string $xml): void
{
    $home = $event['home']; $away = $event['away'];
    echo "=== {$home} vs {$away} (gid={$event['id']}, league={$event['league']['slug']}) ===\n";
    $markets = $odds['bookmakers']['Bet365'] ?? [];
    echo "adapted markets: " . implode(', ', array_map(fn($m) => $m['name'], $markets)) . "\n";

    // Correct Score buckets (home / draw / away), the away-win fix.
    foreach ($markets as $m) {
        if ($m['name'] !== 'Correct Score') continue;
        $hw = $dr = $aw = [];
        foreach ($m['odds'] as $r) {
            if (!preg_match('/^(\d+)-(\d+)$/', $r['label'], $g)) continue;
            $h = (int)$g[1]; $a = (int)$g[2];
            $cell = "{$r['label']}@{$r['odds']}";
            if ($h > $a) $hw[] = $cell; elseif ($h < $a) $aw[] = $cell; else $dr[] = $cell;
        }
        echo "Correct Score: home-win=" . count($hw) . " draw=" . count($dr) . " AWAY-win=" . count($aw) . "\n";
        echo "  away scorelines: " . implode(' ', $aw) . "\n";
    }

    // Confirm the <PD> block carries away ior_H0Cx tags after XML build.
    if (preg_match('#<PD>(.*?)</PD>#si', $xml, $pd)) {
        preg_match_all('#<ior_H(\d+)C(\d+)>#i', $pd[1], $tags, PREG_SET_ORDER);
        $awayTags = array_filter($tags, fn($t) => (int)$t[1] < (int)$t[2]);
        echo "PD block ior tags: total=" . count($tags) . " away(H<C)=" . count($awayTags) . "\n";
    } else {
        echo "PD block: ABSENT\n";
    }
    echo "\n";
}
