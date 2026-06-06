<?php
/**
 * translate_names.php — backfill the English→Chinese display-name cache
 * (db_sports.name_cn_cache) used by the H5 sports list so team / league
 * names render in Chinese instead of a mix of English/Chinese.
 *
 * This is the ONLY writer of the cache. api_v2.php / FastAPI only READ it
 * (no translation on the request path). The H5 frontend's curated
 * dictionary still wins at display time; this fills the long tail.
 *
 * Strategy: collect the distinct team_h / team_c / league strings of the
 * matches users can actually see (recent + upcoming window), skip the ones
 * already cached or already Chinese, and machine-translate the rest ONE at
 * a time through NameTranslator (pluggable provider), rate-limited and
 * capped per run so the cron stays short. Unsuccessful names are simply
 * left for the next run (the frontend shows English for them until then).
 *
 * Usage:
 *   php translate_names.php                       # window backfill (default)
 *   php translate_names.php --all                 # ignore time window (full)
 *   php translate_names.php --max=800             # cap names per run (def 400)
 *   php translate_names.php --window-days=14      # upcoming window (def 10)
 *   php translate_names.php --only=teams|leagues  # restrict kind
 *   php translate_names.php --dry-run             # translate + log, no writes
 *
 * Cron (every 5 min, offset so it doesn't collide with the odds ingest):
 *   3-59/5 * * * * www-data /usr/bin/php .../translate_names.php >> /var/log/translate-names.log 2>&1
 *
 * Provider via env (see NameTranslator):
 *   TRANSLATE_PROVIDER=google_free|google|deepl|libre|none  TRANSLATE_API_KEY=…
 */

date_default_timezone_set('Asia/Shanghai');
require_once __DIR__ . '/../../vendor/common/NameTranslator.php';

function tn_log(string $m): void { fwrite(STDERR, '[' . date('H:i:s') . "] {$m}\n"); }

// ---- args -----------------------------------------------------------------
$opts = [];
foreach ($argv ?? [] as $a) {
    if (preg_match('/^--([a-z0-9-]+)(?:=(.*))?$/i', (string)$a, $m)) {
        $opts[strtolower($m[1])] = $m[2] ?? true;
    }
}
$dryRun     = !empty($opts['dry-run']);
$all        = !empty($opts['all']);
$maxPerRun  = isset($opts['max']) ? max(1, (int)$opts['max']) : 400;
$windowDays = isset($opts['window-days']) ? max(1, (int)$opts['window-days']) : 10;
$only       = isset($opts['only']) ? strtolower((string)$opts['only']) : '';  // '', 'teams', 'leagues'

// ---- DB --------------------------------------------------------------------
$host = getenv('CG_DB_HOST') ?: '127.0.0.1';
$user = getenv('CG_DB_USER') ?: 'root';
$pass = getenv('CG_DB_PASS') ?: '49f0863e9070';
$name = getenv('CG_DB_NAME') ?: 'db_sports';
try {
    $pdo = new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    tn_log('FATAL: cannot reach db_sports: ' . $e->getMessage());
    exit(1);
}

$provider = strtolower((string)(getenv('TRANSLATE_PROVIDER') ?: 'google_free'));
tn_log("=== translate_names start (provider={$provider} dryRun=" . ($dryRun ? 'Y' : 'N')
     . " all=" . ($all ? 'Y' : 'N') . " max={$maxPerRun} window={$windowDays}d only=" . ($only ?: 'both') . ") ===");

NameTranslator::ensureTable($pdo);

// ---- collect candidate names ----------------------------------------------
// kind map: name_en => 'team' | 'league'  (last write wins on the rare
// collision; `kind` is informational only).
$cands = [];

$wantTeams   = ($only !== 'leagues');
$wantLeagues = ($only !== 'teams');

if ($all) {
    $sql = "SELECT DISTINCT team_h, team_c, league FROM foot_match";
    $rows = $pdo->query($sql)->fetchAll();
} else {
    $now = time();
    $lo  = $now - 2 * 86400;            // include just-finished (still listed)
    $hi  = $now + $windowDays * 86400;  // upcoming window
    $stmt = $pdo->prepare(
        "SELECT DISTINCT team_h, team_c, league FROM foot_match WHERE datetime BETWEEN :lo AND :hi"
    );
    $stmt->execute([':lo' => $lo, ':hi' => $hi]);
    $rows = $stmt->fetchAll();
}

foreach ($rows as $r) {
    if ($wantTeams) {
        foreach (['team_h', 'team_c'] as $col) {
            $v = trim((string)($r[$col] ?? ''));
            if ($v !== '' && !NameTranslator::isChinese($v)) $cands[$v] = 'team';
        }
    }
    if ($wantLeagues) {
        $v = trim((string)($r['league'] ?? ''));
        // Many league strings are ALREADY Chinese (registry name_cn) — skip.
        if ($v !== '' && !NameTranslator::isChinese($v)) {
            if (!isset($cands[$v])) $cands[$v] = 'league';
        }
    }
}

$totalCands = count($cands);
if ($totalCands === 0) {
    tn_log('no English names to translate in window — nothing to do.');
    exit(0);
}

// ---- skip already-cached ---------------------------------------------------
$have = NameTranslator::lookup($pdo, array_keys($cands));
$todo = [];
foreach ($cands as $en => $kind) {
    if (!isset($have[$en])) $todo[$en] = $kind;
}
tn_log("candidates={$totalCands} cached=" . count($have) . " todo=" . count($todo));

// ---- translate (rate-limited, capped) --------------------------------------
$done = 0; $fail = 0; $processed = 0;
foreach ($todo as $en => $kind) {
    if ($processed >= $maxPerRun) break;
    $processed++;
    $cn = NameTranslator::translate($en);
    if ($cn !== null && trim($cn) !== '') {
        if (!$dryRun) NameTranslator::store($pdo, $en, $cn, $kind, $provider);
        $done++;
        if ($done <= 12) tn_log("  [{$kind}] {$en}  →  {$cn}");
    } else {
        $fail++;
    }
    // Gentle pacing so the key-less endpoint isn't hammered / rate-limited.
    usleep(120000); // 120ms
}

tn_log("=== done: translated {$done}, failed {$fail}, remaining "
     . max(0, count($todo) - $processed) . " (will retry next run) ===");
exit(0);
