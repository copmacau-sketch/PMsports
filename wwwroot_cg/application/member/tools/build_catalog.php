#!/usr/bin/env php
<?php
/**
 * build_catalog.php — 从 Odds-API 拉取8个联赛的赛事+赔率，
 * 从 api-sports.io 拉取实时比分并模糊匹配队名。
 * 输出: data/catalog.json
 *
 * 用法: php build_catalog.php [--live-only]
 *   --live-only: 只更新实时比分，不重新拉赔率（省API额度）
 *
 * 建议 cron:
 *   every-5-min: php /path/to/build_catalog.php          (全量)
 *   every-1-min: php /path/to/build_catalog.php --live-only (只更新比分)
 */

define('BASE_DIR', dirname(__DIR__));
define('DATA_DIR', BASE_DIR . '/data');

if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0755, true);

// API Keys
$ODDS_KEY   = 'f13e2d297eb9e7006113eeca5f95682e3da7a5d39581e0ee7681c5abbd28e3b9';
$SPORTS_KEY = '967679e7c3c625a64081afc93b7fb1bf';

// 8 target leagues: slug => [中文名, api-sports league ID]
$LEAGUES = [
    'england-premier-league' => ['英超', 39],
    'italy-serie-a'          => ['意甲', 135],
    'spain-laliga'           => ['西甲', 140],
    'france-ligue-1'         => ['法甲', 61],
    'germany-bundesliga'     => ['德甲', 78],
    'international-clubs-uefa-champions-league' => ['欧冠杯', 2],
    'international-clubs-uefa-europa-league'    => ['欧联杯', 3],
    'international-world-cup' => ['世界杯', 1],
    'china-chinese-super-league' => ['中超', 169],
];

$liveOnly = in_array('--live-only', $argv ?? []);

// ============================================================
// HTTP helpers
// ============================================================
function httpGet($url, $headers = []) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER     => $headers,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 400) {
        fwrite(STDERR, "[WARN] HTTP $code for $url\n");
        return null;
    }
    return json_decode($resp, true);
}

function httpGetMulti($urls, $headers = []) {
    $mh = curl_multi_init();
    $handles = [];
    foreach ($urls as $key => $url) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 20,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER     => $headers,
        ]);
        curl_multi_add_handle($mh, $ch);
        $handles[$key] = $ch;
    }
    $running = 0;
    do { curl_multi_exec($mh, $running); curl_multi_select($mh, 0.5); } while ($running > 0);
    $results = [];
    foreach ($handles as $key => $ch) {
        $resp = curl_multi_getcontent($ch);
        $results[$key] = json_decode($resp, true);
        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);
    }
    curl_multi_close($mh);
    return $results;
}

// ============================================================
// Fuzzy team name matcher
// ============================================================
function normalizeTeam($name) {
    $name = mb_strtolower(trim($name));
    // Remove common suffixes
    $name = preg_replace('/\b(fc|cf|sc|ac|as|ss|afc|ssc|rcd|rc|us|og|1\.\s*fc)\b/i', '', $name);
    // Remove punctuation
    $name = preg_replace('/[^a-z0-9\s]/', '', $name);
    return trim(preg_replace('/\s+/', ' ', $name));
}

function fuzzyMatch($needle, $haystack) {
    $n = normalizeTeam($needle);
    $best = null;
    $bestScore = 0;

    foreach ($haystack as $key => $candidate) {
        $c = normalizeTeam($candidate);

        // Exact match
        if ($n === $c) return $key;

        // Contains
        if (strpos($c, $n) !== false || strpos($n, $c) !== false) {
            $score = 90;
        } else {
            // Levenshtein on shorter strings
            $maxLen = max(strlen($n), strlen($c));
            if ($maxLen > 40) continue; // skip very long names
            $dist = levenshtein($n, $c);
            $score = (1 - $dist / $maxLen) * 100;
        }

        if ($score > $bestScore) {
            $bestScore = $score;
            $best = $key;
        }
    }

    return ($bestScore >= 60) ? $best : null;
}

// ============================================================
// STEP 1: Load existing catalog (for ID persistence)
// ============================================================
$catalogFile = DATA_DIR . '/catalog.json';
$existing = [];
if (file_exists($catalogFile)) {
    $existing = json_decode(file_get_contents($catalogFile), true) ?: [];
}
$existingMatches = $existing['matches'] ?? [];
$idMap = []; // odds_api_event_id => internal_id
foreach ($existingMatches as $m) {
    if (isset($m['odds_api_id'])) {
        $idMap[$m['odds_api_id']] = $m['id'];
    }
}
$nextId = 1;
if (!empty($idMap)) {
    $nextId = max(array_map('intval', $idMap)) + 1;
}

// ============================================================
// STEP 2: Fetch events from Odds-API
// ============================================================
$allMatches = [];

if (!$liveOnly) {
    $oddsBase = 'https://api.odds-api.io/v3';

    // Fetch ALL football events in one request, then filter locally
    fwrite(STDERR, "[INFO] Fetching all football events ...\n");
    $url = $oddsBase . '/events?' . http_build_query([
        'apiKey'    => $ODDS_KEY,
        'sport'     => 'football',
        'status'    => 'pending',
        'bookmaker' => 'Bet365',
    ]);
    $allEvents = httpGet($url);
    if (!is_array($allEvents)) $allEvents = [];
    fwrite(STDERR, "[INFO] Got " . count($allEvents) . " total football events\n");

    // Also fetch live events
    $url2 = $oddsBase . '/events?' . http_build_query([
        'apiKey'    => $ODDS_KEY,
        'sport'     => 'football',
        'status'    => 'live',
        'bookmaker' => 'Bet365',
    ]);
    $liveEvents = httpGet($url2);
    if (is_array($liveEvents)) {
        $allEvents = array_merge($allEvents, $liveEvents);
        fwrite(STDERR, "[INFO] Got " . count($liveEvents) . " live events\n");
    }

    // Filter to target leagues only
    $targetSlugs = array_keys($LEAGUES);
    foreach ($allEvents as $ev) {
        $oddsId = $ev['id'] ?? null;
        $leagueSlug = $ev['league']['slug'] ?? '';
        if (!$oddsId || !in_array($leagueSlug, $targetSlugs)) continue;

        $zhName = $LEAGUES[$leagueSlug][0];

        // Assign or reuse internal ID
        if (isset($idMap[$oddsId])) {
            $internalId = $idMap[$oddsId];
        } else {
            $internalId = $nextId++;
            $idMap[$oddsId] = $internalId;
        }

        $match = [
            'id'             => str_pad($internalId, 7, '0', STR_PAD_LEFT),
            'odds_api_id'    => $oddsId,
            'league_slug'    => $leagueSlug,
            'league'         => $ev['league']['name'] ?? $leagueSlug,
            'league_zh'      => $zhName,
            'home'           => $ev['home'] ?? '',
            'away'           => $ev['away'] ?? '',
            'commence_time'  => $ev['date'] ?? '',
            'status'         => $ev['status'] ?? 'pending',
            'scores'         => $ev['scores'] ?? null,
            'odds'           => null,
            'live'           => null,
        ];
        $allMatches[$oddsId] = $match;
    }
    fwrite(STDERR, "[INFO] Filtered to " . count($allMatches) . " matches in target leagues\n");

    // ============================================================
    // STEP 3: Fetch odds (batch by league, using /odds endpoint)
    // ============================================================
    fwrite(STDERR, "[INFO] Fetching odds ...\n");
    $oddsUrls = [];
    foreach ($allMatches as $oddsId => $m) {
        $oddsUrls[$oddsId] = $oddsBase . '/odds?' . http_build_query([
            'apiKey'     => $ODDS_KEY,
            'eventId'    => $oddsId,
            'bookmakers' => 'Bet365',
        ]);
    }

    // Batch in groups of 10
    $chunks = array_chunk($oddsUrls, 10, true);
    foreach ($chunks as $chunk) {
        $results = httpGetMulti($chunk);
        foreach ($results as $oddsId => $data) {
            if (!is_array($data)) continue;
            $bookmakers = $data['bookmakers'] ?? [];
            $markets = [];
            // Format: {"Bet365": [{"name":"ML","odds":[{...}]}, {"name":"Spread",...}]}
            $bet365 = $bookmakers['Bet365'] ?? (is_array($bookmakers) ? reset($bookmakers) : []);
            if (!is_array($bet365)) $bet365 = [];
            foreach ($bet365 as $mkt) {
                $mktName = $mkt['name'] ?? '';
                $rawOdds = $mkt['odds'] ?? [];
                if (!empty($rawOdds) && !empty($mktName)) {
                    $markets[$mktName] = $rawOdds;
                }
            }
            if (!empty($markets)) {
                $allMatches[$oddsId]['odds'] = $markets;
            }
        }
        usleep(300000); // 300ms between batches
    }
} else {
    // Live-only mode: reuse existing matches
    foreach ($existingMatches as $m) {
        $allMatches[$m['odds_api_id']] = $m;
    }
}

// ============================================================
// STEP 4: Fetch live scores from api-sports.io + fuzzy match
// ============================================================
fwrite(STDERR, "[INFO] Fetching live scores from api-sports.io ...\n");

$sportsBase = 'https://v3.football.api-sports.io';
$liveData = httpGet(
    $sportsBase . '/fixtures?live=all',
    ['x-apisports-key: ' . $SPORTS_KEY]
);
$liveFixtures = $liveData['response'] ?? [];
fwrite(STDERR, "[INFO] Got " . count($liveFixtures) . " live fixtures\n");

// Also fetch today's fixtures for teams that are about to start
$todayData = httpGet(
    $sportsBase . '/fixtures?' . http_build_query(['date' => date('Y-m-d')]),
    ['x-apisports-key: ' . $SPORTS_KEY]
);
$todayFixtures = $todayData['response'] ?? [];
fwrite(STDERR, "[INFO] Got " . count($todayFixtures) . " today fixtures\n");

// Build lookup: normalized team name => fixture data
$sportsLookup = []; // "home_normalized|away_normalized" => fixture
foreach (array_merge($liveFixtures, $todayFixtures) as $fix) {
    $home = $fix['teams']['home']['name'] ?? '';
    $away = $fix['teams']['away']['name'] ?? '';
    $key = normalizeTeam($home) . '|' . normalizeTeam($away);
    $sportsLookup[$key] = $fix;
}

// Match each catalog entry
$matchedCount = 0;
foreach ($allMatches as $oddsId => &$match) {
    $homeNorm = normalizeTeam($match['home']);
    $awayNorm = normalizeTeam($match['away']);
    $directKey = $homeNorm . '|' . $awayNorm;

    $fix = null;
    if (isset($sportsLookup[$directKey])) {
        $fix = $sportsLookup[$directKey];
    } else {
        // Fuzzy match home team against all fixtures
        $homeNames = [];
        foreach ($sportsLookup as $k => $f) {
            $parts = explode('|', $k);
            $homeNames[$k] = $parts[0] ?? '';
        }
        $bestKey = null;
        foreach ($sportsLookup as $k => $f) {
            $parts = explode('|', $k);
            $fHome = $parts[0] ?? '';
            $fAway = $parts[1] ?? '';
            // Both teams must roughly match
            $homeSim = similar_text($homeNorm, $fHome, $hp);
            $awaySim = similar_text($awayNorm, $fAway, $ap);
            if ($hp >= 60 && $ap >= 60) {
                $fix = $f;
                break;
            }
        }
    }

    if ($fix) {
        $matchedCount++;
        $goals = $fix['goals'] ?? [];
        $score = $fix['score'] ?? [];
        $status = $fix['fixture']['status'] ?? [];
        $match['live'] = [
            'home_score' => $goals['home'] ?? 0,
            'away_score' => $goals['away'] ?? 0,
            'minute'     => $status['elapsed'] ?? 0,
            'status'     => $status['short'] ?? 'NS', // 1H, 2H, HT, FT, NS, etc.
            'halftime'   => $score['halftime'] ?? null,
        ];
        // Override status if live
        $shortStatus = $status['short'] ?? '';
        if (in_array($shortStatus, ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'])) {
            $match['status'] = 'live';
        } elseif (in_array($shortStatus, ['FT', 'AET', 'PEN'])) {
            $match['status'] = 'finished';
        }
    }
}
unset($match);
fwrite(STDERR, "[INFO] Matched $matchedCount fixtures with live scores\n");

// ============================================================
// STEP 5: Write catalog.json
// ============================================================
$catalog = [
    'updated_at' => gmdate('Y-m-d\TH:i:s\Z'),
    'leagues'    => [],
    'matches'    => array_values($allMatches),
    'stats'      => [
        'total_matches' => count($allMatches),
        'live_matched'  => $matchedCount,
        'live_fixtures' => count($liveFixtures),
    ],
];

// Build league summary
foreach ($LEAGUES as $slug => [$zh, $sid]) {
    $leagueMatches = array_filter($allMatches, fn($m) => $m['league_slug'] === $slug);
    $catalog['leagues'][] = [
        'slug'       => $slug,
        'name_zh'    => $zh,
        'sports_id'  => $sid,
        'count'      => count($leagueMatches),
        'live_count' => count(array_filter($leagueMatches, fn($m) => $m['status'] === 'live')),
    ];
}

$json = json_encode($catalog, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
file_put_contents($catalogFile, $json);
$size = strlen($json);
fwrite(STDERR, "[DONE] Wrote $catalogFile ($size bytes, " . count($allMatches) . " matches)\n");
