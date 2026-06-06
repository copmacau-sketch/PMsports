<?php
/**
 * api_v2.php — JSON API serving odds data from MySQL (db_markets).
 *
 * Replaces crown-explorer FastAPI for the Next.js H5 frontend.
 * Endpoints:
 *   GET /api/external/leagues
 *   GET /api/external/events
 *   GET /api/external/events/{id}
 *   GET /api/external/events/{id}/markets
 *   GET /health
 *   POST /api/auth/login
 *   GET  /api/auth/me
 *   POST /api/auth/logout
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// /dev/shm cache shared with the FastAPI oddsapi_ws bridge.  Defined at
// the top of the file because the place-bet route handler runs early
// (line ~436) and calls readWsLiveSnapshot() — which references this
// constant — well before the rest of the file's top-level statements.
// Defining it later means PHP treats CG_WS_CACHE_DIR as the literal
// string "CG_WS_CACHE_DIR" inside that handler, breaking the cache read
// and rejecting every in-play bet with market_closed.
define('CG_WS_CACHE_DIR', '/dev/shm/oddsapi_live');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- DB connection -----------------------------------------------------------
$dbHost = '127.0.0.1';
$dbUser = 'root';
$dbPass = '49f0863e9070';
$dbName = 'db_markets';
$dbClient = 'db_client';

try {
    $pdo = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'db_connect_failed']);
    exit;
}

// --- Exchange rate helper (cached, 1-hour TTL) --------------------------------
// Fetches live USD-based rates from open.er-api.com (free, no key).
// USDT is pegged ≈1 USD, so we treat 1 USDT = 1 USD for conversion.
// Member currency (HKD/RMB/USD) is converted to USDT using: amount / rate_to_usd.
function getExchangeRates() {
    $cacheFile = sys_get_temp_dir() . '/crown_fx_rates.json';
    $ttl = 3600; // 1 hour
    if (is_file($cacheFile) && (time() - filemtime($cacheFile)) < $ttl) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        if ($cached && !empty($cached['rates'])) return $cached;
    }
    // Fetch from open.er-api.com (USD base)
    $ctx = stream_context_create(['http' => ['timeout' => 8]]);
    $json = @file_get_contents('https://open.er-api.com/v6/latest/USD', false, $ctx);
    if ($json) {
        $data = json_decode($json, true);
        if ($data && ($data['result'] ?? '') === 'success' && !empty($data['rates'])) {
            $rates = $data['rates'];
            $result = [
                'base' => 'USD',
                'updated' => $data['time_last_update_utc'] ?? date('c'),
                'rates' => [
                    'USD'  => 1.0,
                    'USDT' => 1.0,  // pegged
                    'RMB'  => (float)($rates['CNY'] ?? 7.24),
                    'CNY'  => (float)($rates['CNY'] ?? 7.24),
                    'HKD'  => (float)($rates['HKD'] ?? 7.82),
                    'EUR'  => (float)($rates['EUR'] ?? 0.92),
                    'GBP'  => (float)($rates['GBP'] ?? 0.79),
                    'MYR'  => (float)($rates['MYR'] ?? 4.47),
                    'SGD'  => (float)($rates['SGD'] ?? 1.33),
                    'THB'  => (float)($rates['THB'] ?? 33.5),
                    'VND'  => (float)($rates['VND'] ?? 25400),
                    'IDR'  => (float)($rates['IDR'] ?? 16200),
                    'KRW'  => (float)($rates['KRW'] ?? 1370),
                    'JPY'  => (float)($rates['JPY'] ?? 157),
                ],
            ];
            @file_put_contents($cacheFile, json_encode($result));
            return $result;
        }
    }
    // Fallback: use hardcoded rates if API fails
    return [
        'base' => 'USD',
        'updated' => date('c'),
        'rates' => [
            'USD' => 1.0, 'USDT' => 1.0, 'RMB' => 7.24, 'CNY' => 7.24,
            'HKD' => 7.82, 'EUR' => 0.92, 'GBP' => 0.79, 'MYR' => 4.47,
        ],
        'fallback' => true,
    ];
}

// Convert an amount from member currency to USDT
function toUSDT($amount, $currency) {
    $fx = getExchangeRates();
    $cur = strtoupper($currency ?: 'RMB');
    if ($cur === 'USDT' || $cur === 'USD') return round($amount, 2);
    $rateToUsd = (float)($fx['rates'][$cur] ?? $fx['rates']['RMB'] ?? 7.24);
    if ($rateToUsd <= 0) $rateToUsd = 1;
    return round($amount / $rateToUsd, 2);
}

// Convert USDT amount to member native currency
function fromUSDT($amountUsdt, $currency) {
    $fx = getExchangeRates();
    $cur = strtoupper($currency ?: 'RMB');
    if ($cur === 'USDT' || $cur === 'USD') return round($amountUsdt, 2);
    $rateToUsd = (float)($fx['rates'][$cur] ?? $fx['rates']['RMB'] ?? 7.24);
    if ($rateToUsd <= 0) $rateToUsd = 1;
    return round($amountUsdt * $rateToUsd, 2);
}

// --- Routing -----------------------------------------------------------------
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Strip /api/external prefix
$route = preg_replace('#^/api/external#', '', $path);

// --- /api/settle — trigger settle_bets.php from HTTP ---
if ($path === '/api/settle') {
    if (($_GET['key'] ?? '') !== 'cron2026') {
        http_response_code(403);
        echo json_encode(['detail' => 'forbidden']);
        exit;
    }
    header('Content-Type: text/plain; charset=utf-8');
    $script = __DIR__ . '/settle_bets.php';
    if (!is_file($script)) { echo "settle_bets.php missing\n"; exit; }
    // Spawn synchronously, stream output
    @set_time_limit(120);
    $cmd = "php " . escapeshellarg($script) . " 2>&1";
    passthru($cmd);
    exit;
}

// Health check
if ($path === '/health') {
    echo json_encode(['ok' => true, 'service' => 'crown-gold-api-v2']);
    exit;
}

// GET /api/exchange-rates — return current exchange rates
if ($path === '/api/exchange-rates') {
    $fx = getExchangeRates();
    echo json_encode($fx);
    exit;
}

// Auth stubs (for frontend compatibility)
if ($path === '/api/auth/me') {
    session_start();
    $memberId = $_SESSION['uid'] ?? null;
    if (!$memberId) {
        http_response_code(401);
        echo json_encode(['detail' => 'not authenticated']);
        exit;
    }
    try {
        $pdoC = new PDO("mysql:host={$dbHost};dbname={$dbClient};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $stmt = $pdoC->prepare("SELECT id, name, loginname, status, credit, balance_credit, currency FROM member WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $memberId]);
        $member = $stmt->fetch();
        if (!$member) {
            session_destroy();
            http_response_code(401);
            echo json_encode(['detail' => 'not authenticated']);
            exit;
        }
        $dbCredit = (float)($member['credit'] ?? 0);
        $dbBalance = (float)($member['balance_credit'] ?? 0);
        $memCurrency = strtoupper($member['currency'] ?? $_SESSION['currency'] ?? 'RMB');
        $_SESSION['credit_balance'] = $dbBalance;
        $_SESSION['currency'] = $memCurrency;
        $fx = getExchangeRates();
        echo json_encode([
            'user' => [
                'id' => (int)$member['id'],
                'username' => $member['loginname'] ?: $member['name'],
                'wallet_address' => null,
                'agent_id' => null,
                'is_agent' => false,
                'must_change' => false,
                'status' => 'active',
                'created_at' => date('c'),
                'is_credit' => true,
                'currency' => $memCurrency,
                'credit_balance' => toUSDT($dbBalance, $memCurrency),
                'credit_balance_raw' => $dbBalance,
                'credit_limit' => toUSDT($dbCredit, $memCurrency),
                'credit_limit_raw' => $dbCredit,
                'fx_rate' => (float)($fx['rates'][$memCurrency] ?? 1),
                'fx_updated' => $fx['updated'] ?? '',
            ],
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['detail' => 'auth error']);
    }
    exit;
}
if ($path === '/api/auth/login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?: [];
    $username = $body['username'] ?? '';
    $password = $body['password'] ?? '';
    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'detail' => 'missing credentials']);
        exit;
    }
    // Verify against db_client.member using Crown's md5(md5()) scheme
    try {
        $pdoC = new PDO("mysql:host={$dbHost};dbname={$dbClient};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $hash = md5(md5($password));
        $stmt = $pdoC->prepare("SELECT id, name, loginname, status, credit, balance_credit, pwddate, pw, currency FROM member WHERE (loginname = :u OR (loginname IS NULL AND name = :u)) AND passwd = :p LIMIT 1");
        $stmt->execute([':u' => $username, ':p' => $hash]);
        $member = $stmt->fetch();
        if (!$member) {
            http_response_code(401);
            echo json_encode(['ok' => false, 'detail' => 'invalid credentials']);
            exit;
        }
        // First-login checks (mirrors legacy Login.php behaviour)
        $mustChange = false;
        $changeReason = '';
        if (empty($member['loginname'])) {
            // Never set a login account — force user to create one
            $mustChange = true;
            $changeReason = 'set_loginname';
        } elseif (empty($member['pwddate']) || (time() - (int)$member['pwddate']) > 30 * 24 * 3600) {
            // Password not changed in 30+ days
            $mustChange = true;
            $changeReason = 'change_password';
        }
        // Set a simple session cookie
        session_start();
        $_SESSION['uid'] = $member['id'];
        $_SESSION['username'] = $member['loginname'] ?: $member['name'];
        $_SESSION['must_change'] = $mustChange;
        $_SESSION['change_reason'] = $changeReason;
        $dbCredit = (float)($member['credit'] ?? 0);
        $dbBalance = (float)($member['balance_credit'] ?? 0);
        $memCurrency = strtoupper($member['currency'] ?? 'RMB');
        $_SESSION['credit_balance'] = $dbBalance;
        $_SESSION['currency'] = $memCurrency;
        $_SESSION['bets'] = [];
        $fx = getExchangeRates();
        echo json_encode([
            'ok' => true,
            'must_change' => $mustChange,
            'change_reason' => $changeReason,
            'user' => [
                'id' => (int)$member['id'],
                'username' => $member['loginname'] ?: $member['name'],
                'wallet_address' => null,
                'agent_id' => null,
                'is_agent' => false,
                'must_change' => $mustChange,
                'status' => 'active',
                'created_at' => date('c'),
                'is_credit' => true,
                'currency' => $memCurrency,
                'credit_balance' => toUSDT($dbBalance, $memCurrency),
                'credit_balance_raw' => $dbBalance,
                'credit_limit' => toUSDT($dbCredit, $memCurrency),
                'credit_limit_raw' => $dbCredit,
                'fx_rate' => (float)($fx['rates'][$memCurrency] ?? 1),
                'fx_updated' => $fx['updated'] ?? '',
            ],
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'detail' => 'auth error']);
    }
    exit;
}
if ($path === '/api/auth/logout') {
    session_start();
    session_destroy();
    echo json_encode(['ok' => true]);
    exit;
}
// POST /api/auth/set-loginname — first login: set login account name
if ($path === '/api/auth/set-loginname' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    if (empty($_SESSION['uid'])) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'detail' => 'not authenticated']);
        exit;
    }
    $body = json_decode(file_get_contents('php://input'), true) ?: [];
    $newLogin = trim($body['loginname'] ?? '');
    if (empty($newLogin) || !preg_match('/^[A-Za-z0-9][A-Za-z0-9_]{3,11}$/', $newLogin)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'detail' => '登入帐号格式不正确（4-12位，字母或数字开头，仅字母/数字/下划线）']);
        exit;
    }
    try {
        $pdoC = new PDO("mysql:host={$dbHost};dbname={$dbClient};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        // Check uniqueness
        $chk = $pdoC->prepare("SELECT id FROM member WHERE name = :n OR loginname = :n LIMIT 1");
        $chk->execute([':n' => $newLogin]);
        if ($chk->fetch()) {
            http_response_code(409);
            echo json_encode(['ok' => false, 'detail' => '该登入帐号已被使用']);
            exit;
        }
        $upd = $pdoC->prepare("UPDATE member SET loginname = :ln WHERE id = :id");
        $upd->execute([':ln' => $newLogin, ':id' => $_SESSION['uid']]);
        $_SESSION['username'] = $newLogin;
        $_SESSION['must_change'] = false;
        $_SESSION['change_reason'] = '';
        echo json_encode(['ok' => true, 'username' => $newLogin]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'detail' => 'db error']);
    }
    exit;
}
// POST /api/auth/change-pwd — forced password change (30-day expiry or first login)
if ($path === '/api/auth/change-pwd' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    if (empty($_SESSION['uid'])) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'detail' => 'not authenticated']);
        exit;
    }
    $body = json_decode(file_get_contents('php://input'), true) ?: [];
    $oldPwd = $body['old_password'] ?? '';
    $newPwd = $body['new_password'] ?? '';
    if (empty($oldPwd) || empty($newPwd)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'detail' => '请填写旧密码和新密码']);
        exit;
    }
    if (!preg_match('/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,12}$/', $newPwd)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'detail' => '新密码格式不正确（6-12位，需含字母和数字）']);
        exit;
    }
    try {
        $pdoC = new PDO("mysql:host={$dbHost};dbname={$dbClient};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $stmt = $pdoC->prepare("SELECT passwd, name, loginname FROM member WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $_SESSION['uid']]);
        $row = $stmt->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'detail' => 'member not found']);
            exit;
        }
        $oldHash = md5(md5($oldPwd));
        if ($oldHash !== $row['passwd']) {
            http_response_code(403);
            echo json_encode(['ok' => false, 'detail' => '旧密码不正确']);
            exit;
        }
        $newHash = md5(md5($newPwd));
        if ($newHash === $row['passwd']) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'detail' => '新密码不能与旧密码相同']);
            exit;
        }
        if ($newPwd === $row['name'] || $newPwd === $row['loginname']) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'detail' => '新密码不能与帐号名相同']);
            exit;
        }
        $upd = $pdoC->prepare("UPDATE member SET passwd = :p, pw = :pw, pwddate = :t WHERE id = :id");
        $upd->execute([':p' => $newHash, ':pw' => $newPwd, ':t' => time(), ':id' => $_SESSION['uid']]);
        $_SESSION['must_change'] = false;
        $_SESSION['change_reason'] = '';
        echo json_encode(['ok' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'detail' => 'db error']);
    }
    exit;
}
if ($path === '/api/credit/me') {
    session_start();
    if (empty($_SESSION['uid'])) {
        http_response_code(401);
        echo json_encode(['detail' => 'not authenticated']);
        exit;
    }
    // Read fresh credit from database
    try {
        $pdoC = new PDO("mysql:host={$dbHost};dbname={$dbClient};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $stmt = $pdoC->prepare("SELECT credit, balance_credit, currency FROM member WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $_SESSION['uid']]);
        $row = $stmt->fetch();
        $dbCredit = (float)($row['credit'] ?? 0);
        $dbBalance = (float)($row['balance_credit'] ?? 0);
        $memCurrency = strtoupper($row['currency'] ?? $_SESSION['currency'] ?? 'RMB');
        $_SESSION['credit_balance'] = $dbBalance;
        $_SESSION['currency'] = $memCurrency;
    } catch (PDOException $e) {
        $dbCredit = 0;
        $dbBalance = (float)($_SESSION['credit_balance'] ?? 0);
        $memCurrency = $_SESSION['currency'] ?? 'RMB';
    }
    $fx = getExchangeRates();
    echo json_encode([
        'username' => $_SESSION['username'] ?? '',
        'is_credit' => true,
        'currency' => $memCurrency,
        'credit_balance' => toUSDT($dbBalance, $memCurrency),
        'credit_balance_raw' => $dbBalance,
        'credit_limit' => toUSDT($dbCredit, $memCurrency),
        'credit_limit_raw' => $dbCredit,
        'fx_rate' => (float)($fx['rates'][$memCurrency] ?? 1),
    ]);
    exit;
}
if ($path === '/api/pmppm/place-bet' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    if (empty($_SESSION['uid'])) {
        http_response_code(401);
        echo json_encode(['detail' => 'not authenticated']);
        exit;
    }
    $body = json_decode(file_get_contents('php://input'), true) ?: [];
    $odds = (float)($body['odds'] ?? 0);
    // Multi-currency: accept stake_amount + stake_currency (USDT or RMB).
    // Fall back to legacy amount_usdt for backward compatibility.
    $stakeCurrency = strtoupper((string)($body['stake_currency'] ?? ''));
    $stakeAmount   = (float)($body['stake_amount'] ?? 0);
    if ($stakeAmount > 0 && in_array($stakeCurrency, ['USDT', 'RMB'], true)) {
        $amount = toUSDT($stakeAmount, $stakeCurrency); // USDT equivalent for bet_golds storage
    } else {
        // Legacy: amount_usdt treated as USDT
        $stakeAmount   = (float)($body['amount_usdt'] ?? 0);
        $stakeCurrency = 'USDT';
        $amount        = $stakeAmount;
    }
    if ($amount <= 0 || $odds <= 0) {
        http_response_code(400);
        echo json_encode(['detail' => 'invalid amount or odds']);
        exit;
    }

    // --- Phase-closed betting validation (single-event bets only) -----------
    // Parlay bets carry a comma-separated event_id; their per-leg validation
    // is more complex and is left to a follow-up.  For single bets we
    // enforce: (a) phase matches the server's view (closed/transitioned →
    // reject), (b) the chosen market exists in the current source-of-truth
    // (WS cache for in-play, r_cn for pre-match), and (c) the submitted price
    // matches the current price within tolerance.
    //
    // The validated phase is later passed to the INSERT as `bet_phase`.
    $validatedPhase = null;
    $eventIdRaw = (string)($body['event_id'] ?? '');
    $isParlayEvent = (strpos($eventIdRaw, ',') !== false);
    if (!$isParlayEvent && $eventIdRaw !== '') {
        $gidNum = (int)$eventIdRaw;
        if ($gidNum > 0) {
            try {
                $vStmt = $pdo->prepare(
                    "SELECT m.gid, m.status, m.is_inball, m.`datetime`,
                            m.league, m.team_h, m.team_c,
                            x.r_cn
                     FROM foot_match m
                     LEFT JOIN foot_match_xml x ON x.gid = m.gid
                     WHERE m.gid = :g LIMIT 1");
                $vStmt->execute([':g' => $gidNum]);
                $vRow = $vStmt->fetch();
            } catch (PDOException $e) {
                error_log('place-bet phase lookup failed: ' . $e->getMessage());
                $vRow = false;
            }
            if (!$vRow) {
                // Not a foot_match gid — almost certainly an outright /
                // futures event (FIFA world-cup-winner, qualification
                // bracket, etc.), whose event_ids live in a different
                // namespace and are validated downstream by the
                // legacy place-bet handler.  Outrights have no in-play
                // concept (they're always "pre" until the tournament
                // ends), so the phase / market / price checks below
                // don't apply.  Skip the rest of this block and let
                // the legacy code path proceed.
                error_log("place-bet phase check skipped: event_id={$gidNum} not in foot_match (likely outright/futures)");
                goto _phase_validation_done;
            }
            $vCtx = activeOddsContext($vRow);
            $vClaimedPhase = (string)($body['phase'] ?? '');

            // Closed → reject unconditionally
            if ($vCtx['phase'] === 'closed' || empty($vCtx['markets'])) {
                http_response_code(409);
                error_log("place-bet rejected: market_closed gid={$gidNum} phase={$vCtx['phase']}");
                echo json_encode([
                    'detail'  => 'market_closed',
                    'phase'   => $vCtx['phase'],
                    'gid'     => $gidNum,
                ]);
                exit;
            }

            // Phase mismatch (only enforced if frontend opted in by sending phase)
            if ($vClaimedPhase !== '' && in_array($vClaimedPhase, ['pre','inplay'], true)
                && $vClaimedPhase !== $vCtx['phase']) {
                http_response_code(409);
                error_log("place-bet rejected: phase_transitioned gid={$gidNum} expected={$vClaimedPhase} current={$vCtx['phase']}");
                echo json_encode([
                    'detail'   => 'phase_transitioned',
                    'expected' => $vClaimedPhase,
                    'current'  => $vCtx['phase'],
                    'gid'      => $gidNum,
                ]);
                exit;
            }

            // Locate market line and check price.  Prefer canonical
            // 6-digit market_id (sent by frontend as 'market_id'); fall
            // back to market_name only when frontend didn't supply one.
            $vMarketId    = (string)($body['market_id'] ?? '');
            $vMarketName  = (string)($body['market_name'] ?? '');
            $vOutcomeF    = (string)($body['outcome_field'] ?? '');
            $vOutcomeL    = (isset($body['outcome_line']) && $body['outcome_line'] !== '' && $body['outcome_line'] !== null)
                ? (float)$body['outcome_line'] : null;
            $line = locateMarketLine($vCtx['markets'], $vMarketName, $vOutcomeF, $vOutcomeL, $vMarketId);
            if (!$line) {
                http_response_code(409);
                error_log("place-bet rejected: market_not_open gid={$gidNum} market_id={$vMarketId} market={$vMarketName} field={$vOutcomeF} line=" . ($vOutcomeL ?? 'null'));
                echo json_encode([
                    'detail'        => 'market_not_open',
                    'phase'         => $vCtx['phase'],
                    'gid'           => $gidNum,
                    'market_id'     => $vMarketId,
                    'market_name'   => $vMarketName,
                    'outcome_field' => $vOutcomeF,
                ]);
                exit;
            }
            $tolerance = max(0.005, $line['price'] * 0.005);
            if (abs($line['price'] - $odds) > $tolerance) {
                http_response_code(409);
                error_log("place-bet rejected: odds_changed gid={$gidNum} submitted={$odds} current={$line['price']}");
                echo json_encode([
                    'detail'    => 'odds_changed',
                    'phase'     => $vCtx['phase'],
                    'gid'       => $gidNum,
                    'submitted' => $odds,
                    'current'   => $line['price'],
                ]);
                exit;
            }
            $validatedPhase = $vCtx['phase'];
            _phase_validation_done:
        }
    }
    // For parlay or unknown gid we currently skip phase validation; future
    // work: iterate parlay legs and validate each.

    // Read fresh balance from database
    try {
        $pdoC0 = new PDO("mysql:host={$dbHost};dbname={$dbClient};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $stmt0 = $pdoC0->prepare("SELECT balance_credit FROM member WHERE id = :id LIMIT 1");
        $stmt0->execute([':id' => $_SESSION['uid']]);
        $row0 = $stmt0->fetch();
        $_SESSION['credit_balance'] = (float)($row0['balance_credit'] ?? 0);
    } catch (PDOException $e) {
        // fall through with session value
    }
    // Convert to member's native currency for balance comparison
    $memCurrency = $_SESSION['currency'] ?? 'RMB';
    $amountNative = fromUSDT($amount, $memCurrency);
    if ($amountNative > (float)$_SESSION['credit_balance']) {
        http_response_code(400);
        echo json_encode(['detail' => 'insufficient credit']);
        exit;
    }
    $_SESSION['credit_balance'] = (float)$_SESSION['credit_balance'] - $amountNative;
    // Update DB balance atomically
    try {
        $pdoC0->prepare("UPDATE member SET balance_credit = balance_credit - :amt WHERE id = :id AND balance_credit >= :amt")
            ->execute([':amt' => $amountNative, ':id' => $_SESSION['uid']]);
    } catch (PDOException $e) {
        error_log('balance UPDATE failed: ' . $e->getMessage());
    }

    // --- Write to db_client.bet for agents/d0/admin visibility ---
    try {
        $pdoC = new PDO("mysql:host={$dbHost};dbname={$dbClient};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);

        $eventId = (string)($body['event_id'] ?? '');
        $marketName = (string)($body['market_name'] ?? '');
        $outcomeLabel = (string)($body['outcome_label'] ?? '');
        $winGold = round($amount * $odds, 2);

        // Lookup event from db_markets.foot_match
        $league = ''; $teamH = ''; $teamC = ''; $matchTime = 0;
        if ($eventId && strpos($eventId, ',') === false) {
            $evStmt = $pdo->prepare("SELECT league, team_h, team_c, `datetime` FROM foot_match WHERE gid = :gid LIMIT 1");
            $evStmt->execute([':gid' => $eventId]);
            $ev = $evStmt->fetch();
            if ($ev) {
                $league = $ev['league'] ?: '';
                $teamH = $ev['team_h'] ?: '';
                $teamC = $ev['team_c'] ?: '';
                $matchTime = (int)($ev['datetime'] ?: 0);
            }
        }

        // Get member info — include ltype/config so we can compute rebate fields.
        // member.ltype is a char (A/B/C/D); rank.config keys use numeric 1..4.
        $memStmt = $pdoC->prepare("SELECT name, loginname, nid, ltype, config FROM member WHERE id = :id LIMIT 1");
        $memStmt->execute([':id' => $_SESSION['uid']]);
        $memInfo = $memStmt->fetch();
        // IMPORTANT: bet.m_name MUST match member.name (NOT loginname). The
        // legacy /d0/, /admin/, /agents/ panels select/update bets by joining
        // bet.m_name = member.name (see vendor/common/Bet.php:1719 and
        // vendor/contorller/admin/BetList.php). Using loginname here would
        // hide the bet from those panels and break edit/cancel/settlement.
        $mName = $memInfo ? $memInfo['name'] : ($_SESSION['username'] ?? '');
        $nid = $memInfo['nid'] ?? '';
        $ltypeMap = ['A' => 1, 'B' => 2, 'C' => 3, 'D' => 4];
        $memLtype = $ltypeMap[strtoupper((string)($memInfo['ltype'] ?? 'D'))] ?? 4;
        $memConfig = $memInfo['config'] ?? null;

        // Get agent hierarchy from rank using nid prefix.
        // Hierarchy levels: d0=48, co=64, su=80, ag=96 (verified against existing bets)
        $agName = null; $suName = null; $coName = null; $d0Name = null;
        $agConfig = null; $suConfig = null; $coConfig = null; $d0Config = null;
        $agWinloss = 0.0; $suWinloss = 0.0; $coWinloss = 0.0; $d0Winloss = 0.0;
        if (strlen($nid) >= 96) {
            $rankStmt = $pdoC->prepare("SELECT name, LENGTH(nid) as nid_len, winloss, config FROM `rank` WHERE :n LIKE CONCAT(nid, '%') ORDER BY LENGTH(nid) ASC");
            $rankStmt->execute([':n' => $nid]);
            $ranks = $rankStmt->fetchAll();
            foreach ($ranks as $r) {
                $len = (int)$r['nid_len'];
                if ($len == 48)      { $d0Name = $r['name']; $d0Config = $r['config']; $d0Winloss = (float)($r['winloss'] ?? 0); }
                elseif ($len == 64)  { $coName = $r['name']; $coConfig = $r['config']; $coWinloss = (float)($r['winloss'] ?? 0); }
                elseif ($len == 80)  { $suName = $r['name']; $suConfig = $r['config']; $suWinloss = (float)($r['winloss'] ?? 0); }
                elseif ($len == 96)  { $agName = $r['name']; $agConfig = $r['config']; $agWinloss = (float)($r['winloss'] ?? 0); }
            }
        }

        // Generate ticket_id
        $ticketId = 'DT' . date('YmdHis') . rand(100, 999);

        // Determine showtype and chose_team
        $showtype = 'today';
        $choseTeam = null;
        if (stripos($outcomeLabel, $teamH) !== false) $choseTeam = 'H';
        elseif (stripos($outcomeLabel, $teamC) !== false) $choseTeam = 'C';

        // Parse wtype/rtype/spread for automatic settlement.
        // Priority: (1) explicit hints from frontend (`market_id` like
        // `main_spread`/`main_ml`/... + `outcome_field` + `outcome_line`),
        // (2) fall back to text parsing of market_name/outcome_label.
        $marketId = (string)($body['market_id'] ?? '');
        $isParlay = ($marketId === 'PARLAY');
        $outcomeField = isset($body['outcome_field']) && $body['outcome_field'] !== null
            ? (string)$body['outcome_field'] : '';
        $outcomeLine  = isset($body['outcome_line']) && $body['outcome_line'] !== null && $body['outcome_line'] !== ''
            ? (float)$body['outcome_line'] : null;
        $parsed = parseSettlementHints(
            $marketName, $outcomeLabel, $teamH, $teamC, $isParlay,
            $marketId, $outcomeField, $outcomeLine
        );
        $wtype  = $parsed['wtype'];
        $rtype  = $parsed['rtype'];
        $spread = $parsed['spread'];
        $betstr = mb_substr($outcomeLabel, 0, 480);
        // Refine chose_team using the explicit field hint when text-match failed.
        if ($choseTeam === null) {
            if ($outcomeField === 'home') $choseTeam = 'H';
            elseif ($outcomeField === 'away') $choseTeam = 'C';
            elseif ($rtype === 'H') $choseTeam = 'H';
            elseif ($rtype === 'C') $choseTeam = 'C';
        }

        // --- Compute rebate (turn_rate) and commission (point) splits ---
        // Each level's `war` rate is keyed by gtype + rebate_key + ltype in its config JSON.
        // Each level's `point` is the increment of its winloss over the level immediately below it
        // (ag is the base — `ag_point` is the agent's own commission share against the member).
        $rebateKey = rebateKeyForWtype($wtype ?? '', $isParlay);
        $memTurnRate = warFromConfig($memConfig, 'FT', $rebateKey, $memLtype);
        $agTurnRate  = warFromConfig($agConfig,  'FT', $rebateKey, $memLtype);
        $suTurnRate  = warFromConfig($suConfig,  'FT', $rebateKey, $memLtype);
        $coTurnRate  = warFromConfig($coConfig,  'FT', $rebateKey, $memLtype);
        $d0TurnRate  = warFromConfig($d0Config,  'FT', $rebateKey, $memLtype);
        $agPoint = $agWinloss;
        $suPoint = max(0.0, $suWinloss - $agWinloss);
        $coPoint = max(0.0, $coWinloss - $suWinloss);
        $d0Point = max(0.0, $d0Winloss - $coWinloss);

        // `bet_phase` records whether the bet was placed during pre-match
        // or in-play.  $validatedPhase is set by the phase validation block
        // above for single bets.  Parlay bets currently default to 'pre'
        // (the column has DEFAULT 'pre' at the schema level too).
        $betPhase = $validatedPhase ?? 'pre';

        $ins = $pdoC->prepare("INSERT INTO bet
            (m_name, pay_type, m_date, bet_time, `datetime`, ticket_id, gid, gtype,
             bet_golds, win_gold, league, team_h, team_c, ptype, ptype_en, ioratio,
             wtype, rtype, spread, betstr, bet_phase,
             showtype, odd_f_type, chose_team, nid, strong,
             ag_name, su_name, co_name, d0_name,
             mem_turn_rate, ag_turn_rate, su_turn_rate, co_turn_rate, d0_turn_rate,
             ag_point, su_point, co_point, d0_point,
             bet_ip, currency, result, isResult, status, cancel)
            VALUES
            (:m_name, 1, :m_date, :bet_time, :datetime, :ticket_id, :gid, 'FT',
             :bet_golds, :win_gold, :league, :team_h, :team_c, :ptype, :ptype_en, :ioratio,
             :wtype, :rtype, :spread, :betstr, :bet_phase,
             :showtype, 'H', :chose_team, :nid, 'H',
             :ag_name, :su_name, :co_name, :d0_name,
             :mem_tr, :ag_tr, :su_tr, :co_tr, :d0_tr,
             :ag_pt, :su_pt, :co_pt, :d0_pt,
             :bet_ip, 'USDT', 'T', 0, 0, 0)");
        $ins->execute([
            ':m_name' => $mName,
            ':m_date' => date('Y-m-d'),
            ':bet_time' => time(),
            ':datetime' => $matchTime,
            ':ticket_id' => $ticketId,
            ':gid' => $eventId,
            ':bet_golds' => (string)$amount,
            ':win_gold' => (string)$winGold,
            ':league' => $league,
            ':team_h' => $teamH,
            ':team_c' => $teamC,
            ':ptype' => $marketName,
            ':ptype_en' => $parsed['marketEn'] ?? $marketName,
            ':ioratio' => (string)$odds,
            ':wtype' => $wtype,
            ':rtype' => $rtype,
            ':spread' => $spread !== null ? (string)$spread : null,
            ':betstr' => $betstr,
            ':bet_phase' => $betPhase,
            ':showtype' => $showtype,
            ':chose_team' => $choseTeam,
            ':nid' => $nid,
            ':ag_name' => $agName,
            ':su_name' => $suName,
            ':co_name' => $coName,
            ':d0_name' => $d0Name,
            ':mem_tr' => $memTurnRate,
            ':ag_tr'  => $agTurnRate,
            ':su_tr'  => $suTurnRate,
            ':co_tr'  => $coTurnRate,
            ':d0_tr'  => $d0TurnRate,
            ':ag_pt'  => $agPoint,
            ':su_pt'  => $suPoint,
            ':co_pt'  => $coPoint,
            ':d0_pt'  => $d0Point,
            ':bet_ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        ]);
        $dbBetId = $pdoC->lastInsertId();
    } catch (PDOException $e) {
        // DB write failure is non-fatal; session bet still counts
        error_log('place-bet INSERT failed: ' . $e->getMessage());
        $dbBetId = 0;
    }

    // Session-based record (kept for backward compat)
    $betId = $dbBetId ?: (count($_SESSION['bets'] ?? []) + 1);
    $bet = [
        'id' => (int)$betId,
        'event_id' => $eventId,
        'market_id' => (string)($body['market_id'] ?? ''),
        'market_name' => $marketName,
        'outcome_index' => (int)($body['outcome_index'] ?? 0),
        'outcome_label' => $outcomeLabel,
        'amount_usdt' => $amount,
        'promised_odds' => $odds,
        'promised_payout' => $winGold,
        'status' => 'open',
        'payout_usdt' => 0,
        'created_at' => date('c'),
    ];
    $_SESSION['bets'][] = $bet;

    $newBalanceNative = (float)$_SESSION['credit_balance'];
    $newBalanceUsdt = toUSDT($newBalanceNative, $memCurrency);
    $fx = getExchangeRates();
    echo json_encode([
        'ok' => true,
        'bet_id' => (int)$betId,
        'new_balance' => $newBalanceUsdt,
        'new_balance_raw' => $newBalanceNative,
        'currency' => $memCurrency,
        'stake_currency' => $stakeCurrency,
        'stake_amount' => $stakeAmount,
        'stake_as_usdt' => $amount,
        'stake_deducted_native' => $amountNative,
        'fx_rate' => (float)($fx['rates'][$memCurrency] ?? 1),
        'promised_payout' => $bet['promised_payout'],
        'outcome_label' => $bet['outcome_label'],
        'market_name' => $bet['market_name'],
    ]);
    exit;
}
if ($path === '/api/bets') {
    // Crown-style bet rows for the legacy "我的·订单与战绩" page (BetsResp format).
    session_start();
    if (empty($_SESSION['uid'])) {
        http_response_code(401);
        echo json_encode(['detail' => 'not authenticated']);
        exit;
    }
    $q = $_GET;
    $gtype = isset($q['gtype']) ? strtoupper($q['gtype']) : '';
    $ptype = isset($q['ptype']) ? $q['ptype'] : '';
    $rtype = isset($q['rtype']) ? $q['rtype'] : '';
    $limit = isset($q['limit']) ? max(1, min(200, (int)$q['limit'])) : 50;
    $offset = isset($q['offset']) ? max(0, (int)$q['offset']) : 0;
    $onlyUnresolved = !empty($q['only_unresolved']);
    $onlyInball = !empty($q['only_inball']);
    $onlyCancelled = !empty($q['only_cancelled']);
    $onlyEdited = !empty($q['only_edited']);

    try {
        $pdoC = new PDO("mysql:host={$dbHost};dbname={$dbClient};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        // Resolve bet.m_name from member.id (not from session.username).
        // Legacy /d0/, /admin/, /agents/ writes bet.m_name = member.name, so we
        // must compare against member.name regardless of whether the user
        // logged in via loginname or legacy name. See vendor/common/Bet.php:1719.
        $memN = $pdoC->prepare("SELECT name FROM member WHERE id = :id LIMIT 1");
        $memN->execute([':id' => (int)$_SESSION['uid']]);
        $memRow = $memN->fetch();
        $username = $memRow ? $memRow['name'] : ($_SESSION['username'] ?? '');
        $where = ['m_name = :u'];
        $params = [':u' => $username];
        if ($gtype !== '') { $where[] = 'gtype = :gtype'; $params[':gtype'] = $gtype; }
        if ($ptype !== '') { $where[] = 'ptype = :ptype'; $params[':ptype'] = $ptype; }
        if ($rtype !== '') { $where[] = 'rtype = :rtype'; $params[':rtype'] = $rtype; }
        if ($onlyUnresolved) { $where[] = 'isResult = 0'; }
        if ($onlyInball) { $where[] = "rb = 'Y'"; }
        if ($onlyCancelled) { $where[] = 'cancel = 1'; }
        if ($onlyEdited) { $where[] = 'isEdit = 1'; }
        $whereSql = implode(' AND ', $where);

        $cntStmt = $pdoC->prepare("SELECT COUNT(*) FROM bet WHERE {$whereSql}");
        $cntStmt->execute($params);
        $total = (int)$cntStmt->fetchColumn();

        // betstr / chose_team / ptype_en surface the actual outcome direction
        // (Crown writes the picked team / over-under / handicap label into betstr
        // at place-bet time; chose_team is H|C|null).  Without these the frontend
        // can only render team_h vs team_c + wtype, which loses information like
        // "卡塔尔 to win the cup" or "Match A 主胜 / Match B 客胜" for parlays.
        $sql = "SELECT ID, m_name, bet_time, gtype, ptype, ptype_en, wtype, rtype, league,
                       team_h, team_c, spread, ioratio, score, org_score,
                       bet_golds, valid_gold, mem_result, result, isResult, status, cancel,
                       danger, inball, isEdit, edit_type, edit_name,
                       ticket_id, bet_ip, currency, betstr, chose_team
                FROM bet WHERE {$whereSql}
                ORDER BY ID DESC LIMIT {$limit} OFFSET {$offset}";
        $stmt = $pdoC->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $gtypeLabels = ['FT'=>'足球','BK'=>'篮球','TN'=>'网球','BS'=>'棒球','VB'=>'排球','TT'=>'乒乓球','SK'=>'斯诺克','BM'=>'羽毛球','OP'=>'其他','ES'=>'电竞','SP'=>'冠军'];
        $items = [];
        foreach ($rows as $r) {
            $r['ID'] = (int)$r['ID'];
            $r['bet_time'] = $r['bet_time'] !== null ? (int)$r['bet_time'] : null;
            $r['isResult'] = $r['isResult'] !== null ? (int)$r['isResult'] : null;
            $r['status'] = $r['status'] !== null ? (int)$r['status'] : null;
            $r['cancel'] = $r['cancel'] !== null ? (int)$r['cancel'] : null;
            $r['danger'] = $r['danger'] !== null ? (int)$r['danger'] : null;
            $r['isEdit'] = $r['isEdit'] !== null ? (int)$r['isEdit'] : null;
            $r['edit_type'] = $r['edit_type'] !== null ? (int)$r['edit_type'] : null;
            $r['gtype_label'] = isset($gtypeLabels[$r['gtype']]) ? $gtypeLabels[$r['gtype']] : $r['gtype'];
            $r['ptype_label'] = $r['ptype'];
            $r['wtype_label'] = $r['wtype'];
            $items[] = $r;
        }

        echo json_encode(['total' => $total, 'items' => $items]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['total' => 0, 'items' => [], 'error' => 'db error']);
    }
    exit;
}
if ($path === '/api/pmppm/my-bets') {
    session_start();
    if (empty($_SESSION['uid'])) {
        http_response_code(401);
        echo json_encode(['detail' => 'not authenticated']);
        exit;
    }
    // Read from db_client.bet for persistence across sessions
    $bets = [];
    try {
        $pdoC = new PDO("mysql:host={$dbHost};dbname={$dbClient};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        // Resolve bet.m_name from member.id (legacy convention; see /api/bets).
        $memN = $pdoC->prepare("SELECT name FROM member WHERE id = :id LIMIT 1");
        $memN->execute([':id' => (int)$_SESSION['uid']]);
        $memRow = $memN->fetch();
        $username = $memRow ? $memRow['name'] : ($_SESSION['username'] ?? '');
        $stmt = $pdoC->prepare("SELECT ID, gid, ptype, chose_team, team_h, team_c, bet_golds, win_gold, ioratio, bet_time, result, cancel FROM bet WHERE m_name = :u ORDER BY ID DESC LIMIT 50");
        $stmt->execute([':u' => $username]);
        $rows = $stmt->fetchAll();
        foreach ($rows as $r) {
            $status = 'open';
            if ((int)$r['cancel'] === 1) $status = 'cancelled';
            elseif ($r['result'] === 'W') $status = 'won';
            elseif ($r['result'] === 'L') $status = 'lost';
            $bets[] = [
                'id' => (int)$r['ID'],
                'event_id' => $r['gid'],
                'market_id' => '',
                'market_name' => $r['ptype'] ?: '',
                'outcome_index' => 0,
                'outcome_label' => ($r['chose_team'] === 'H' ? $r['team_h'] : ($r['chose_team'] === 'C' ? $r['team_c'] : ($r['team_h'].' vs '.$r['team_c']))),
                'amount_usdt' => (float)$r['bet_golds'],
                'promised_odds' => (float)$r['ioratio'],
                'promised_payout' => (float)$r['win_gold'],
                'status' => $status,
                'payout_usdt' => 0,
                'created_at' => date('c', (int)$r['bet_time']),
            ];
        }
    } catch (PDOException $e) {
        // Fallback to session
        $bets = array_values($_SESSION['bets'] ?? []);
    }
    echo json_encode(['ok' => true, 'bets' => $bets]);
    exit;
}

// --- odds-api.io live fetch ------------------------------------------------
define('ODDS_API_KEY', 'f13e2d297eb9e7006113eeca5f95682e3da7a5d39581e0ee7681c5abbd28e3b9');
define('ODDS_API_BASE', 'https://api.odds-api.io/v3');

// Simple file-based cache for odds-api.io responses (avoid hammering upstream).
// Cache dir: /tmp/crown_odds_cache/
define('ODDS_CACHE_DIR', '/tmp/crown_odds_cache');
define('ODDS_CACHE_TTL', 120); // seconds

function oddsApiCacheGet(string $key): ?string {
    $file = ODDS_CACHE_DIR . '/' . md5($key) . '.json';
    if (!file_exists($file)) return null;
    if (time() - filemtime($file) > ODDS_CACHE_TTL) { @unlink($file); return null; }
    return file_get_contents($file);
}

function oddsApiCachePut(string $key, string $json): void {
    if (!is_dir(ODDS_CACHE_DIR)) @mkdir(ODDS_CACHE_DIR, 0777, true);
    file_put_contents(ODDS_CACHE_DIR . '/' . md5($key) . '.json', $json);
}

/**
 * Fetch all prematch markets for a given event from odds-api.io.
 * Returns the raw decoded JSON or null on failure.
 */
function fetchOddsApiMarkets(int $eventId, string $bookmaker = 'Bet365'): ?array {
    $cacheKey = "odds_{$eventId}_{$bookmaker}";
    $cached = oddsApiCacheGet($cacheKey);
    if ($cached !== null) {
        $data = json_decode($cached, true);
        if ($data) return $data;
    }
    $url = ODDS_API_BASE . '/odds?' . http_build_query([
        'apiKey' => ODDS_API_KEY,
        'eventId' => $eventId,
        'bookmakers' => $bookmaker,
    ]);
    $ctx = stream_context_create([
        'http' => [
            'timeout' => 10,
            'header' => "User-Agent: crown-gold-api-v2\r\n",
        ],
        'ssl' => ['verify_peer' => true, 'verify_peer_name' => true],
    ]);
    $body = @file_get_contents($url, false, $ctx);
    if ($body === false) return null;
    $data = json_decode($body, true);
    if (!is_array($data) || isset($data['error'])) return null;
    oddsApiCachePut($cacheKey, $body);
    return $data;
}

/**
 * Map our settlement wtype + bet context to the legacy rebate key
 * (R / RE / M / DT / RDT) that indexes into rank.config[$gtype][$key_$ltype].
 *
 * R   = pre-match handicap / over-under / odd-even   (carries 退水)
 * RE  = in-play handicap / over-under / odd-even     (carries 退水)
 * M   = pre/in-play ML / parlay                       (no 退水 per current config)
 * DT  = other pre-match (DNB, DC, BTS, CS …)         (no 退水)
 * RDT = other in-play                                (no 退水)
 */
function rebateKeyForWtype(string $wtype, bool $isParlay = false): string {
    if ($isParlay) return 'M';
    $w = strtoupper($wtype);
    if ($w === 'PARLAY' || $w === 'ML' || $w === '1X2' || $w === 'HT_ML') return 'M';
    if ($w === 'SP' || $w === 'OU' || $w === 'OE') return 'R';
    if ($w === 'HT_SP' || $w === 'HT_OU') return 'R';
    // DNB, DC, BTS, HT_BTS, CS, and unknowns → DT
    return 'DT';
}

/**
 * Pull `war` (rebate %) from a member/rank `config` JSON string for the given
 * gtype (FT/BK/OP), rebate key (R/RE/M/DT/RDT) and ltype number (1..4).
 * Falls back to 0 if any layer is missing.
 */
function warFromConfig(?string $configJson, string $gtype, string $key, int $ltype): float {
    if (!$configJson) return 0.0;
    $cfg = json_decode($configJson, true);
    if (!is_array($cfg)) return 0.0;
    $g = in_array($gtype, ['FT', 'BK'], true) ? $gtype : 'OP';
    $row = $cfg[$g]['data'][$key . '_' . $ltype] ?? null;
    if (!is_array($row)) return 0.0;
    return (float)($row['war'] ?? 0);
}

/**
 * English → Simplified-Chinese team-name lookup for use in settlement
 * fallbacks. Mirrors the most-frequent entries in the H5 frontend's
 * lib/i18n-teams.ts so that PHP can substring-match Chinese outcome
 * labels (e.g. "皇家马德里") against English team names stored in
 * foot_match.team_h / team_c (e.g. "Real Madrid").
 *
 * Only the leagues we actively settle (CSL, Serie A, La Liga, EPL, UCL,
 * UEL, Bundesliga, Ligue 1) are populated here. Add more entries as
 * needed; matching is case-insensitive on the English side.
 */
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
            // Premier League (small sample — extend as needed)
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

/**
 * Resolve a `main_<key>` market click into wtype/rtype/spread directly,
 * using the canonical `outcome_field` and `outcome_line` posted by the
 * H5 frontend (no text parsing needed).
 *
 * Returns the standard parseSettlementHints array shape; wtype=null
 * means "couldn't resolve" so the caller should fall back to text parse.
 */
function resolveMainOddsHint(string $key, string $field, ?float $line): array {
    $f = strtolower($field);
    $sideHC = function(string $f): ?string {
        if ($f === 'home' || $f === 'h' || $f === '1') return 'H';
        if ($f === 'away' || $f === 'c' || $f === '2') return 'C';
        return null;
    };
    $sideHCD = function(string $f): ?string {
        if ($f === 'home' || $f === 'h' || $f === '1') return 'H';
        if ($f === 'away' || $f === 'c' || $f === '2') return 'C';
        if ($f === 'draw' || $f === 'd' || $f === 'x') return 'D';
        return null;
    };
    $sideOU = function(string $f): ?string {
        if ($f === 'over'  || $f === 'o') return 'OVER';
        if ($f === 'under' || $f === 'u') return 'UNDER';
        return null;
    };
    $sideYN = function(string $f): ?string {
        if ($f === 'yes' || $f === 'y') return 'Y';
        if ($f === 'no'  || $f === 'n') return 'N';
        return null;
    };
    $sideDC = function(string $f): ?string {
        if ($f === '1x' || $f === 'hd' || $f === 'hx') return 'HD';
        if ($f === 'x2' || $f === 'cd' || $f === 'xc') return 'CD';
        if ($f === '12' || $f === 'hc') return 'HC';
        return null;
    };

    switch (strtolower($key)) {
        case 'ml':
            $r = $sideHCD($f);
            return ['wtype' => $r === null ? null : 'ML',     'rtype' => $r, 'spread' => null, 'marketEn' => 'ML'];
        case 'html':
            $r = $sideHCD($f);
            return ['wtype' => $r === null ? null : 'HT_ML',  'rtype' => $r, 'spread' => null, 'marketEn' => 'Half Time Result'];
        case 'spread':
        case 'sp':
            $r = $sideHC($f);
            return ['wtype' => $r === null ? null : 'SP',     'rtype' => $r, 'spread' => $line, 'marketEn' => 'Spread'];
        case 'htsp':
            $r = $sideHC($f);
            return ['wtype' => $r === null ? null : 'HT_SP',  'rtype' => $r, 'spread' => $line, 'marketEn' => 'Spread HT'];
        case 'ou':
            $r = $sideOU($f);
            return ['wtype' => $r === null ? null : 'OU',     'rtype' => $r, 'spread' => $line, 'marketEn' => 'Totals'];
        case 'htou':
            $r = $sideOU($f);
            return ['wtype' => $r === null ? null : 'HT_OU',  'rtype' => $r, 'spread' => $line, 'marketEn' => 'Totals HT'];
        case 'btts':
            $r = $sideYN($f);
            return ['wtype' => $r === null ? null : 'BTS',    'rtype' => $r, 'spread' => null, 'marketEn' => 'Both Teams To Score'];
        case 'bttsht':
            $r = $sideYN($f);
            return ['wtype' => $r === null ? null : 'HT_BTS', 'rtype' => $r, 'spread' => null, 'marketEn' => 'Both Teams To Score HT'];
        case 'dc':
            $r = $sideDC($f);
            return ['wtype' => $r === null ? null : 'DC',     'rtype' => $r, 'spread' => null, 'marketEn' => 'Double Chance'];
        case 'dnb':
            $r = $sideHC($f);
            return ['wtype' => $r === null ? null : 'DNB',    'rtype' => $r, 'spread' => null, 'marketEn' => 'Draw No Bet'];
        case 'corners':
            // Settlement of corners requires corner counts which api-sports
            // does not expose for free tier. Mark wtype=CORNERS so the
            // bet is recognised by /admin/ but settle_bets leaves it for
            // manual grading.
            $r = $sideOU($f);
            return ['wtype' => $r === null ? null : 'CORNERS', 'rtype' => $r, 'spread' => $line, 'marketEn' => 'Corners Totals'];
        default:
            return ['wtype' => null, 'rtype' => null, 'spread' => null, 'marketEn' => null];
    }
}

/**
 * Map a market_name (English from Odds-API.io OR translated Chinese label)
 * + outcome_label into the legacy wtype/rtype/spread tuple used by the
 * settlement engine in settle_bets.php.
 *
 * When `$marketId` starts with `main_` (the H5 frontend's main_odds row
 * clicks: main_ml / main_spread / main_ou / main_btts / main_dc / main_dnb
 * / main_html / main_htsp / main_htou / main_bttsht / main_corners), we
 * resolve wtype/rtype directly from `$outcomeField` + `$outcomeLine` and
 * skip the Chinese / English text parsing entirely. This is the reliable
 * path because the frontend already knows the canonical side (home/away/
 * draw/over/under/yes/no/1x/x2/12) and numeric handicap line.
 *
 * Returns: ['wtype' => string|null, 'rtype' => string|null,
 *           'spread' => float|null, 'marketEn' => string|null]
 */
function parseSettlementHints(
    string $marketName,
    string $outcomeLabel,
    string $teamH,
    string $teamC,
    bool $isParlay = false,
    string $marketId = '',
    string $outcomeField = '',
    ?float $outcomeLine = null
): array {
    if ($isParlay) {
        return ['wtype' => 'PARLAY', 'rtype' => null, 'spread' => null, 'marketEn' => 'PARLAY'];
    }
    // Fast path for main_odds row clicks. The market_id encodes the market
    // type (e.g. `main_spread`) and outcome_field encodes the side. Both are
    // produced by buildRowOption() in sports/page.tsx.
    if ($marketId !== '' && strncmp($marketId, 'main_', 5) === 0) {
        $key = substr($marketId, 5); // ml | spread | ou | btts | html | htsp | htou | bttsht | dc | dnb | corners
        $hint = resolveMainOddsHint($key, $outcomeField, $outcomeLine);
        if ($hint['wtype'] !== null) return $hint;
        // fall through to text parsing if we couldn't resolve
    }
    // Normalize market name to canonical English token
    $cnToEn = [
        '胜平负' => 'ML', '独赢' => 'ML', '主胜负' => 'ML',
        '和局退款' => 'Draw No Bet', '不平局' => 'Draw No Bet',
        '双重机会' => 'Double Chance',
        '亚洲让球' => 'Spread', '让球' => 'Spread', '欧式让球' => 'European Handicap', '另选亚洲让球' => 'Spread',
        '上半场让球' => 'Spread HT', '上半场亚洲让球' => 'Spread HT', '半场让球' => 'Spread HT',
        '总进球大小' => 'Totals', '大小' => 'Totals',
        '上半场总进球大小' => 'Totals HT', '半场大小' => 'Totals HT',
        '进球大小' => 'Goals Over/Under', '另选总进球' => 'Totals', '另选进球线' => 'Totals',
        '上半场进球线' => 'Totals HT', '总进球单双' => 'Total Goals Odd/Even',
        '上半场胜负' => 'Half Time Result', '半场胜负' => 'Half Time Result', '半场独赢' => 'Half Time Result',
        '半场 / 全场' => 'Half Time / Full Time',
        '下半场胜负' => 'Second Half Result',
        '双方进球' => 'Both Teams To Score', '两队进球' => 'Both Teams To Score',
        '上半场双方进球' => 'Both Teams To Score HT', '半场两队进球' => 'Both Teams To Score HT',
        '下半场双方进球' => 'Both Teams To Score 2H',
        '正确比分' => 'Correct Score',
        '角球大小' => 'Corners Totals',
    ];
    $en = $cnToEn[trim($marketName)] ?? trim($marketName);
    $enLower = strtolower($en);
    $ol = trim($outcomeLabel);
    $olLower = mb_strtolower($ol, 'UTF-8');

    $wtype = null; $rtype = null; $spread = null;

    // Helper closures
    $matchTeam = function(string $label) use ($teamH, $teamC, $outcomeField): ?string {
        // (0) Authoritative hint from frontend.
        $fLower = strtolower($outcomeField);
        if ($fLower === 'home' || $fLower === 'h' || $fLower === '1') return 'H';
        if ($fLower === 'away' || $fLower === 'c' || $fLower === '2') return 'C';
        if ($fLower === 'draw' || $fLower === 'd' || $fLower === 'x') return 'D';
        // (1) Direct English substring match on label.
        if ($teamH !== '' && stripos($label, $teamH) !== false) return 'H';
        if ($teamC !== '' && stripos($label, $teamC) !== false) return 'C';
        // (2) Chinese alias of the English team name.
        $teamHzh = teamNameToChinese($teamH);
        $teamCzh = teamNameToChinese($teamC);
        if ($teamHzh !== '' && mb_stripos($label, $teamHzh, 0, 'UTF-8') !== false) return 'H';
        if ($teamCzh !== '' && mb_stripos($label, $teamCzh, 0, 'UTF-8') !== false) return 'C';
        // (3) Last-resort textual cues.
        $l = mb_strtolower($label, 'UTF-8');
        if (preg_match('/(主队|home|^1\b)/u', $l)) return 'H';
        if (preg_match('/(客队|away|^2\b)/u', $l)) return 'C';
        return null;
    };
    $extractNumber = function(string $s): ?float {
        if (preg_match('/[+-]?\d+(?:\.\d+)?/', $s, $m)) return (float)$m[0];
        return null;
    };

    if (in_array($enLower, ['ml','1x2','match winner','match result','full time result'], true)) {
        $wtype = 'ML';
        if (preg_match('/(draw|和局|平局|tie|^x$)/iu', $olLower)) $rtype = 'D';
        else $rtype = $matchTeam($ol);
    } elseif (strpos($enLower, 'half time result') !== false) {
        $wtype = 'HT_ML';
        if (preg_match('/(draw|和局|平局|tie|^x$)/iu', $olLower)) $rtype = 'D';
        else $rtype = $matchTeam($ol);
    } elseif (strpos($enLower, 'draw no bet') !== false) {
        $wtype = 'DNB';
        $rtype = $matchTeam($ol);
    } elseif (strpos($enLower, 'double chance') !== false) {
        $wtype = 'DC';
        $hasDraw = preg_match('/(draw|和|平|x)/iu', $olLower);
        $tH = ($teamH !== '' && stripos($ol, $teamH) !== false);
        $tC = ($teamC !== '' && stripos($ol, $teamC) !== false);
        if ($tH && $tC) $rtype = 'HC';
        elseif ($hasDraw && $tH) $rtype = 'HD';
        elseif ($hasDraw && $tC) $rtype = 'CD';
        elseif ($hasDraw) $rtype = preg_match('/2|away|客/iu', $olLower) ? 'CD' : 'HD';
        else $rtype = 'HC';
    } elseif (strpos($enLower, 'spread ht') !== false || strpos($enLower, '1st half handicap') !== false) {
        $wtype = 'HT_SP';
        $rtype = $matchTeam($ol);
        $spread = $extractNumber($ol);
    } elseif (strpos($enLower, 'spread') !== false || strpos($enLower, 'handicap') !== false) {
        $wtype = 'SP';
        $rtype = $matchTeam($ol);
        $spread = $extractNumber($ol);
    } elseif (strpos($enLower, 'totals ht') !== false
              || strpos($enLower, '1st half goal line') !== false
              || strpos($enLower, '1st half totals') !== false) {
        $wtype = 'HT_OU';
        if (preg_match('/(over|大|高于)/iu', $olLower)) $rtype = 'OVER';
        elseif (preg_match('/(under|小|低于)/iu', $olLower)) $rtype = 'UNDER';
        $spread = $extractNumber($ol);
    } elseif (strpos($enLower, 'total') !== false || strpos($enLower, 'over/under') !== false || strpos($enLower, 'goal line') !== false) {
        if (strpos($enLower, 'odd/even') !== false || strpos($enLower, 'odd or even') !== false) {
            $wtype = 'OE';
            if (preg_match('/(odd|单)/iu', $olLower))  $rtype = 'ODD';
            if (preg_match('/(even|双)/iu', $olLower)) $rtype = 'EVEN';
        } else {
            $wtype = 'OU';
            if (preg_match('/(over|大|高于)/iu', $olLower)) $rtype = 'OVER';
            elseif (preg_match('/(under|小|低于)/iu', $olLower)) $rtype = 'UNDER';
            $spread = $extractNumber($ol);
        }
    } elseif (strpos($enLower, 'both teams to score ht') !== false) {
        $wtype = 'HT_BTS';
        $rtype = preg_match('/(yes|是)/iu', $olLower) ? 'Y' : 'N';
    } elseif (strpos($enLower, 'both teams to score') !== false) {
        $wtype = 'BTS';
        $rtype = preg_match('/(yes|是)/iu', $olLower) ? 'Y' : 'N';
    } elseif (strpos($enLower, 'correct score') !== false) {
        $wtype = 'CS';
        if (preg_match('/(\d+)\s*[-:：]\s*(\d+)/', $ol, $m)) $rtype = $m[1] . ':' . $m[2];
    }
    return ['wtype' => $wtype, 'rtype' => $rtype, 'spread' => $spread, 'marketEn' => $en];
}

/**
 * Transform odds-api.io /v3/odds response into our standard bookmakers format.
 */
function transformOddsApiToBookmakers(array $apiData): array {
    $result = [];
    $bookmakers = $apiData['bookmakers'] ?? [];
    if (!is_array($bookmakers)) return [];
    foreach ($bookmakers as $bookName => $markets) {
        if (!is_array($markets)) continue;
        $transformed = [];
        $idx = 1;
        foreach ($markets as $m) {
            if (!is_array($m) || empty($m['name'])) continue;
            $transformed[] = [
                'market_id' => sprintf('%06d', $idx),
                'market_id_int' => $idx,
                'market_name' => $m['name'],
                'odds' => $m['odds'] ?? [],
                'updated_at_iso' => $m['updatedAt'] ?? null,
                'updated_at_ts' => !empty($m['updatedAt']) ? (int)strtotime($m['updatedAt']) : time(),
            ];
            $idx++;
        }
        $result[] = [
            'bookmaker' => $bookName,
            'markets' => $transformed,
            'market_count' => count($transformed),
        ];
    }
    return $result;
}

// --- Lid range for ingested data ---
define('LID_MIN', 101);
define('LID_MAX', 109);

// --- League slug mapping -----------------------------------------------------
function lidToSlug(int $lid): string {
    $map = [
        101 => 'england-premier-league',
        102 => 'italy-serie-a',
        103 => 'spain-la-liga',
        104 => 'france-ligue-1',
        105 => 'germany-bundesliga',
        106 => 'champions-league',
        107 => 'europa-league',
        108 => 'world-cup',
        109 => 'china-chinese-super-league',
    ];
    return $map[$lid] ?? "league-{$lid}";
}

function slugToLid(string $slug): ?int {
    $map = [
        'england-premier-league' => 101,
        'italy-serie-a' => 102,
        'spain-la-liga' => 103,
        'france-ligue-1' => 104,
        'germany-bundesliga' => 105,
        'champions-league' => 106,
        'europa-league' => 107,
        'world-cup' => 108,
        'china-chinese-super-league' => 109,
    ];
    return $map[$slug] ?? null;
}

function datetimeToEpoch($dt): int {
    // foot_match.datetime is bigint (epoch seconds)
    return (int)$dt;
}

function matchStatus(array $row): string {
    // status: 0=open, 1=in-play, etc.
    $st = (int)($row['status'] ?? 0);
    if ($st === 1) return 'inplay';
    if ((int)($row['is_inball'] ?? 0) === 1) return 'settled';
    if (isset($row['score_h'], $row['score_c']) && $row['score_h'] !== null && $row['score_c'] !== null) return 'inplay';
    $ts = (int)($row['datetime'] ?? 0);
    if ($ts > 0 && $ts > time()) return 'pending';
    if ($ts > 0 && $ts <= time()) return 'inplay';
    return 'pending';
}

/**
 * Extract score fields from a foot_match row for the events API.
 * Prefers final scores when match is finished, falls back to live scores.
 */
function extractScores(array $row): array {
    $isFinished = ((int)($row['is_inball'] ?? 0) === 1);
    $scoreH = null; $scoreA = null; $scoreHht = null; $scoreAht = null;
    if ($isFinished) {
        if ($row['inball_h'] !== null) $scoreH = (int)$row['inball_h'];
        if ($row['inball_c'] !== null) $scoreA = (int)$row['inball_c'];
    } else {
        if (isset($row['score_h']) && $row['score_h'] !== null) $scoreH = (int)$row['score_h'];
        if (isset($row['score_c']) && $row['score_c'] !== null) $scoreA = (int)$row['score_c'];
    }
    if (isset($row['inball_h_hr']) && $row['inball_h_hr'] !== null && $row['inball_h_hr'] !== '') $scoreHht = (int)$row['inball_h_hr'];
    if (isset($row['inball_c_hr']) && $row['inball_c_hr'] !== null && $row['inball_c_hr'] !== '') $scoreAht = (int)$row['inball_c_hr'];
    return [
        'score_home' => $scoreH,
        'score_away' => $scoreA,
        'score_home_ht' => $scoreHht,
        'score_away_ht' => $scoreAht,
        'is_finished' => $isFinished,
    ];
}

// --- Parse r_cn XML into market arrays ----------------------------------------
function parseRcnMarkets(string $rCnEncoded): array {
    // r_cn is base64(gzdeflate(xml))
    $xml = @gzinflate(base64_decode($rCnEncoded));
    if ($xml === false || empty($xml)) return [];

    $markets = [];
    $tag = function(string $name) use ($xml) {
        if (preg_match('#<' . $name . '>([^<]*)</' . $name . '>#i', $xml, $m)) return trim($m[1]);
        return null;
    };

    // ML (1X2 Moneyline) — tags: ior_MH, ior_MC, ior_MN
    $mlH = $tag('ior_MH'); $mlC = $tag('ior_MC'); $mlN = $tag('ior_MN');
    if ($mlH !== null && (float)$mlH > 0) {
        $markets[] = ['market_name' => 'ML',
            'odds' => [['home' => (float)$mlH, 'draw' => (float)$mlN, 'away' => (float)$mlC]]];
    }

    // Spread (Asian Handicap) — ior_REH, ior_REC, ratio_re
    $rh = $tag('ior_REH'); $rc = $tag('ior_REC'); $rl = $tag('ratio_re');
    if ($rh !== null && (float)$rh > 0) {
        $markets[] = ['market_name' => 'Spread',
            'odds' => [['hdp' => (float)($rl ?? 0), 'home' => (float)$rh, 'away' => (float)$rc]]];
    }

    // Totals — ior_OUH (over), ior_OUC (under), ratio_o
    $ouh = $tag('ior_OUH'); $ouc = $tag('ior_OUC'); $oul = $tag('ratio_o');
    if ($ouh !== null && (float)$ouh > 0) {
        $markets[] = ['market_name' => 'Totals',
            'odds' => [['hdp' => (float)($oul ?? 2.5), 'over' => (float)$ouh, 'under' => (float)$ouc]]];
    }

    // Half Time Result — ior_HMH, ior_HMC, ior_HMN
    $hmh = $tag('ior_HMH'); $hmc = $tag('ior_HMC'); $hmn = $tag('ior_HMN');
    if ($hmh !== null && (float)$hmh > 0) {
        $markets[] = ['market_name' => 'Half Time Result',
            'odds' => [['home' => (float)$hmh, 'draw' => (float)$hmn, 'away' => (float)$hmc]]];
    }

    // Half Time Spread — ior_HRH, ior_HRC, hratio
    $hrh = $tag('ior_HRH'); $hrc = $tag('ior_HRC'); $hrl = $tag('hratio');
    if ($hrh !== null && (float)$hrh > 0) {
        $markets[] = ['market_name' => 'Spread HT',
            'odds' => [['hdp' => (float)($hrl ?? 0), 'home' => (float)$hrh, 'away' => (float)$hrc]]];
    }

    // Half Time Totals — ior_HOUH, ior_HOUC, ratio_ho
    $houh = $tag('ior_HOUH'); $houc = $tag('ior_HOUC'); $houl = $tag('ratio_ho');
    if ($houh !== null && (float)$houh > 0) {
        $markets[] = ['market_name' => 'Totals HT',
            'odds' => [['hdp' => (float)($houl ?? 1.25), 'over' => (float)$houh, 'under' => (float)$houc]]];
    }

    // Corners Totals — ior_AOUO (over), ior_AOUU (under), ratio_aouo
    $coh = $tag('ior_AOUO'); $cou = $tag('ior_AOUU'); $col = $tag('ratio_aouo');
    if ($coh !== null && (float)$coh > 0) {
        $markets[] = ['market_name' => 'Corners Totals',
            'odds' => [['hdp' => (float)($col ?? 9.5), 'over' => (float)$coh, 'under' => (float)$cou]]];
    }

    // Double Chance — DC block.  Writer (OddsApiToCrownXml::blockMain)
    // emits ior_DCHN (1X home-or-draw), ior_DCCN (X2 away-or-draw —
    // tag is C-then-N, not N-then-C), ior_DCHC (12 home-or-away).
    // Earlier code read ior_DCNC and silently lost the X2 leg.
    $dcHN = $tag('ior_DCHN'); $dcHC = $tag('ior_DCHC'); $dcCN = $tag('ior_DCCN');
    if ($dcHN !== null && (float)$dcHN > 0) {
        $markets[] = ['market_name' => 'Double Chance', 'odds' => [
            ['label' => 'Home or Draw', 'under' => (float)$dcHN],
            ['label' => 'Home or Away', 'under' => (float)$dcHC],
            ['label' => 'Draw or Away', 'under' => (float)$dcCN],
        ]];
    }

    // Correct Score — <PD> block.  Writer (OddsApiToCrownXml::
    // blockCorrectScore) emits one <ior_HhCc>price</ior_HhCc> tag per
    // scoreline (e.g. <ior_H1C0>5.5</ior_H1C0> for 1-0).  Earlier this
    // regex looked for <S1_0> style tags that never exist, so Correct
    // Score was silently dropped from every match's market list.
    if (preg_match('#<PD>(.*?)</PD>#si', $xml, $pdM)) {
        $scoreOdds = [];
        if (preg_match_all('#<ior_H(\d+)C(\d+)>([\d.]+)</ior_H\1C\2>#i', $pdM[1], $sM, PREG_SET_ORDER)) {
            foreach ($sM as $sm) {
                $odds = (float)$sm[3];
                if ($odds > 0) $scoreOdds[] = ['label' => "{$sm[1]}-{$sm[2]}", 'odds' => $odds];
            }
        }
        if (!empty($scoreOdds)) {
            $markets[] = ['market_name' => 'Correct Score', 'odds' => $scoreOdds];
        }
    }

    // Draw No Bet — ior_BHH (home), ior_BHC (away).  Written by
    // OddsApiToCrownXml::blockDrawNoBet() when upstream "Draw No Bet" present.
    $bhH = $tag('ior_BHH'); $bhC = $tag('ior_BHC');
    if ($bhH !== null && (float)$bhH > 0) {
        $markets[] = ['market_name' => 'Draw No Bet',
            'odds' => [['home' => (float)$bhH, 'away' => (float)$bhC]]];
    }

    // Both Teams To Score — ior_TSY (yes), ior_TSN (no).
    $tsY = $tag('ior_TSY'); $tsN = $tag('ior_TSN');
    if ($tsY !== null && (float)$tsY > 0) {
        $markets[] = ['market_name' => 'Both Teams To Score',
            'odds' => [['yes' => (float)$tsY, 'no' => (float)$tsN]]];
    }

    // Both Teams To Score HT — ior_HTSY (yes), ior_HTSN (no).
    $htsY = $tag('ior_HTSY'); $htsN = $tag('ior_HTSN');
    if ($htsY !== null && (float)$htsY > 0) {
        $markets[] = ['market_name' => 'Both Teams To Score HT',
            'odds' => [['yes' => (float)$htsY, 'no' => (float)$htsN]]];
    }

    // ---- Extended markets (2026-05-24) ---------------------------------
    // Writer: OddsApiToCrownXml::blockExtended().  Multi-row markets use
    // a `|`-row / `#`-field delimited list inside <X_LIST> tags; single-row
    // markets use ior_/ratio_ tag pairs same as the legacy main blocks.

    // Anytime Goalscorer — 进球者 — list of {player_name, odds}
    $agsList = $tag('AGS_LIST');
    if ($agsList !== null && $agsList !== '') {
        $rows = [];
        foreach (explode('|', $agsList) as $cell) {
            $parts = explode('#', $cell);
            if (count($parts) < 2) continue;
            $name = html_entity_decode($parts[0], ENT_QUOTES | ENT_XML1, 'UTF-8');
            $odds = (float)$parts[1];
            if ($name === '' || $odds <= 0) continue;
            $rows[] = ['label' => $name, 'odds' => $odds];
        }
        if (!empty($rows)) $markets[] = ['market_name' => 'Anytime Goalscorer', 'odds' => $rows];
    }

    // Bookings Totals — 黄牌大小 — single line (hdp, over, under)
    $btlO = $tag('ior_BTLO'); $btlU = $tag('ior_BTLU'); $btlL = $tag('ratio_btl');
    if ($btlO !== null && (float)$btlO > 0) {
        $markets[] = ['market_name' => 'Bookings Totals',
            'odds' => [['hdp' => (float)($btlL ?? 0), 'over' => (float)$btlO, 'under' => (float)$btlU]]];
    }

    // Bookings Spread — 黄牌让球 — single line (hdp, home, away)
    $bspH = $tag('ior_BSPH'); $bspC = $tag('ior_BSPC'); $bspL = $tag('ratio_bsp');
    if ($bspH !== null && (float)$bspH > 0) {
        $markets[] = ['market_name' => 'Bookings Spread',
            'odds' => [['hdp' => (float)($bspL ?? 0), 'home' => (float)$bspH, 'away' => (float)$bspC]]];
    }

    // Corners Spread — 角球让球 — single line (hdp, home, away)
    $cspH = $tag('ior_CSPH'); $cspC = $tag('ior_CSPC'); $cspL = $tag('ratio_csp');
    if ($cspH !== null && (float)$cspH > 0) {
        $markets[] = ['market_name' => 'Corners Spread',
            'odds' => [['hdp' => (float)($cspL ?? 0), 'home' => (float)$cspH, 'away' => (float)$cspC]]];
    }

    // Alternative Goal Line — 进阶大小 — multi-row (hdp, over, under)
    $aglList = $tag('AGL_LIST');
    if ($aglList !== null && $aglList !== '') {
        $rows = [];
        foreach (explode('|', $aglList) as $cell) {
            $parts = explode('#', $cell);
            if (count($parts) < 3) continue;
            $rows[] = ['hdp' => (float)$parts[0], 'over' => (float)$parts[1], 'under' => (float)$parts[2]];
        }
        if (!empty($rows)) $markets[] = ['market_name' => 'Alternative Goal Line', 'odds' => $rows];
    }

    // Alternative Total Goals — 进阶总进球 — multi-row (hdp, over, under)
    $atgList = $tag('ATG_LIST');
    if ($atgList !== null && $atgList !== '') {
        $rows = [];
        foreach (explode('|', $atgList) as $cell) {
            $parts = explode('#', $cell);
            if (count($parts) < 3) continue;
            $rows[] = ['hdp' => (float)$parts[0], 'over' => (float)$parts[1], 'under' => (float)$parts[2]];
        }
        if (!empty($rows)) $markets[] = ['market_name' => 'Alternative Total Goals', 'odds' => $rows];
    }

    // European Handicap — 欧洲让球 — multi-row (hdp, home, draw, away)
    $w3mList = $tag('W3M_LIST');
    if ($w3mList !== null && $w3mList !== '') {
        $rows = [];
        foreach (explode('|', $w3mList) as $cell) {
            $parts = explode('#', $cell);
            if (count($parts) < 4) continue;
            $rows[] = [
                'hdp'  => (float)$parts[0],
                'home' => (float)$parts[1],
                'draw' => (float)$parts[2],
                'away' => (float)$parts[3],
            ];
        }
        if (!empty($rows)) $markets[] = ['market_name' => 'European Handicap', 'odds' => $rows];
    }

    $result = [];
    foreach ($markets as $i => $m) {
        $result[] = [
            'market_id' => sprintf('%06d', $i + 1),
            'market_id_int' => $i + 1,
            'market_name' => $m['market_name'],
            'odds' => $m['odds'],
            'updated_at_iso' => date('c'),
            'updated_at_ts' => time(),
        ];
    }
    return $result;
}

// --- Cached market_count (lazy populated by /markets endpoint) -----------
// Each match has up to ~62 distinct markets in odds-api; the events list
// SQL row only carries the 7-9 markets we can extract from r_cn locally,
// so the displayed "{N} ›" count would be misleadingly tiny without this
// cache. The /markets endpoint writes the real count after fetching live
// odds-api data; the events list reads it back here. Cache is JSON in
// /tmp with a 12h TTL — adequate for typical bookmaking lifecycles where
// market lists rarely change once published.
function _cgMarketCountCachePath(): string { return '/tmp/cg_market_count_cache.json'; }
function _cgMarketCountCacheRead(): array {
    $f = _cgMarketCountCachePath();
    if (!is_file($f)) return [];
    $raw = @file_get_contents($f);
    if ($raw === false || $raw === '') return [];
    $d = json_decode($raw, true);
    return is_array($d) ? $d : [];
}
function cgMarketCountWrite(int $gid, int $count): void {
    if ($gid <= 0 || $count <= 0) return;
    $cache = _cgMarketCountCacheRead();
    $cache[(string)$gid] = ['count' => $count, 'ts' => time()];
    @file_put_contents(_cgMarketCountCachePath(), json_encode($cache), LOCK_EX);
}
function cgMarketCountRead(int $gid, int $fallback): int {
    $cache = _cgMarketCountCacheRead();
    $key = (string)$gid;
    if (isset($cache[$key]) && is_array($cache[$key])) {
        $entry = $cache[$key];
        $ts = (int)($entry['ts'] ?? 0);
        if ($ts > 0 && (time() - $ts) < 43200) {
            $cnt = (int)($entry['count'] ?? 0);
            if ($cnt > 0) return $cnt;
        }
    }
    return $fallback;
}

// --- Inline main odds for list view ------------------------------------------
//
// Dispatch by match state:
//   - in-play (status=1 AND is_inball=0): project from /dev/shm/oddsapi_live
//     cache populated by the Node WS relay daemon.  Returns null if the
//     daemon hasn't pushed this gid yet — strict WS-only invariant.
//   - settled  (is_inball=1):  null (match finished, no odds to show)
//   - pre-match (status=0):    parse the cron-populated r_cn XML
//                              (5-min snapshot from Odds-API.io /v3/odds)
//
// `$row` carries `status`, `is_inball`, and optionally `r_cn` from the
// /events SQL.  When this is called from /events/{id}/markets (detail
// view) we pass an empty r_cn and only the in-play branch fires.
function mainOddsForRow(array $row): ?array {
    if ((int)($row['is_inball'] ?? 0) === 1) {
        return null; // match finished
    }
    if ((int)($row['status'] ?? 0) === 1) {
        // In-play (滚球): WS-only.  Read the merged snapshot the relay
        // wrote and project the 9-column inline shape out of it.
        $gid = (int)($row['gid'] ?? 0);
        if ($gid <= 0) return null;
        return extractMainOddsFromWsCache($gid);
    }
    // Pre-match: cron-driven r_cn snapshot is fine.
    return extractMainOddsForList($row['r_cn'] ?? '');
}

// --- Phase-closed betting framework -----------------------------------------
// Returns 'pre' | 'inplay' | 'closed' for a foot_match row.  A ±5-minute
// "guard band" around kickoff is closed even if `status` hasn't flipped yet —
// Crown's `status` flag lags upstream by up to ~3 min in practice, and we
// must not accept pre-match prices once the ball is rolling.
//
// The row must carry `is_inball`, `status`, and `datetime` (kickoff epoch).
function computePhase(array $row): string {
    if ((int)($row['is_inball'] ?? 0) === 1) return 'closed';
    $kickoff = (int)($row['datetime'] ?? 0);
    if ($kickoff <= 0) return 'closed';      // unknown kickoff → safe close

    $now    = time();
    $status = (int)($row['status'] ?? 0);
    $gid    = (int)($row['gid'] ?? 0);

    // Transition guard: ±5 min around kickoff with the local `status` flag
    // still 0.  The ingest cron only flips status=0→1 every 2 min, so there
    // is a window where the ball is rolling upstream but our DB hasn't
    // caught up.  During that window the r_cn pre-match snapshot is stale
    // and must NOT be hit.  However, if the WS bridge has already pushed a
    // live snapshot for this gid, those prices ARE fresh and we can safely
    // treat the match as in-play; otherwise fall back to a safe close.
    if ($now >= $kickoff - 300 && $now <= $kickoff + 300 && $status === 0) {
        $snap = $gid > 0 ? readWsLiveSnapshot($gid) : null;
        if (is_array($snap) && !empty($snap['markets'])) return 'inplay';
        return 'closed';
    }
    if ($now >= $kickoff || $status === 1) return 'inplay';
    return 'pre';
}

// Single source of truth for "what markets are bookable for this gid right
// now".  Returned shape: ['phase' => str, 'markets' => array, 'ts' => int].
// `markets` is in the same canonical shape parseRcnMarkets() emits — each
// item is ['market_name' => str, 'odds' => [...]].
//
// Invariants enforced here (must not be bypassed by callers):
//   - phase=pre     → markets come from r_cn ONLY, never WS cache
//   - phase=inplay  → markets come from /dev/shm WS snapshot ONLY, never r_cn
//                     or REST (REST may serve stale prices)
//   - phase=closed  → markets is always []
function activeOddsContext(array $row): array {
    $phase = computePhase($row);
    if ($phase === 'closed') {
        return ['phase' => 'closed', 'markets' => [], 'ts' => 0];
    }
    $gid = (int)($row['gid'] ?? 0);
    if ($phase === 'inplay') {
        $snap = $gid > 0 ? readWsLiveSnapshot($gid) : null;
        $mkts = (is_array($snap) && !empty($snap['markets'])) ? $snap['markets'] : [];
        // Normalize to parseRcnMarkets() shape so downstream is source-agnostic.
        $norm = [];
        foreach ($mkts as $m) {
            if (!is_array($m) || empty($m['name'])) continue;
            $norm[] = [
                'market_name' => (string)$m['name'],
                'odds'        => is_array($m['odds'] ?? null) ? $m['odds'] : [],
            ];
        }
        return [
            'phase'   => 'inplay',
            'markets' => $norm,
            'ts'      => (int)($snap['updated_at_ts'] ?? time()),
        ];
    }
    // phase === 'pre'
    return [
        'phase'   => 'pre',
        'markets' => parseRcnMarkets((string)($row['r_cn'] ?? '')),
        'ts'      => time(),
    ];
}

// Locate the specific odds row inside a market list and return
// ['price' => float, 'market_name' => str, 'outcome' => str] or null.
//
// `$marketName`  — canonical market name as parseRcnMarkets() emits:
//                  ML / Spread / Totals / Half Time Result / Spread HT /
//                  Totals HT / Corners Totals / Double Chance / Correct Score /
//                  Draw No Bet / Both Teams To Score / Both Teams To Score HT
// `$outcomeField` — which leg the bet is on: home/away/draw/over/under/yes/no
//                   or a Correct Score label like "2-1" / Double Chance "1X".
// `$outcomeLine`  — handicap line for Spread/Totals (e.g. 0.5, -1.25);
//                   null/0 when irrelevant.
// Map the H5 list-view's semantic market_id (e.g. "main_ou", "main_spread")
// to the canonical market_name parseRcnMarkets / WS cache emit.  The
// detail-page flow sends the 6-digit canonical id ("000003") instead, which
// `locateMarketLine` matches via `m.market_id` directly — this table is only
// for the inline list-view button path (buildRowOption in sports/page.tsx).
function semanticMarketIdToName(string $marketId): string {
    $map = [
        'main_ml'      => 'ML',
        'main_spread'  => 'Spread',
        'main_ou'      => 'Totals',
        'main_html'    => 'Half Time Result',
        'main_htsp'    => 'Spread HT',
        'main_htou'    => 'Totals HT',
        'main_btts'    => 'Both Teams To Score',
        'main_bttsht'  => 'Both Teams To Score HT',
        'main_dc'      => 'Double Chance',
        'main_dnb'     => 'Draw No Bet',
        'main_corners' => 'Corners Totals',
    ];
    return $map[$marketId] ?? '';
}

function locateMarketLine(array $markets, string $marketName, string $outcomeField, ?float $outcomeLine, string $marketId = ''): ?array {
    $marketName = trim($marketName);
    $marketId = trim($marketId);
    $outcomeField = strtolower(trim($outcomeField));
    // The frontend has two market_id flavours: the detail screen sends
    // the 6-digit canonical id (e.g. "000003"), while the list-view
    // inline buttons send a semantic key (e.g. "main_ou").  Resolve the
    // semantic key into a canonical market_name we can match by.
    $semanticName = ($marketId !== '') ? semanticMarketIdToName($marketId) : '';
    foreach ($markets as $m) {
        if (!is_array($m)) continue;
        $mid = (string)($m['market_id'] ?? '');
        $mname = (string)($m['market_name'] ?? '');
        $matchesId       = ($marketId !== '' && $mid === $marketId);
        $matchesSemantic = ($semanticName !== '' && strcasecmp($mname, $semanticName) === 0);
        $matchesName     = ($marketId === '' && strcasecmp($mname, $marketName) === 0);
        if (!$matchesId && !$matchesSemantic && !$matchesName) continue;
        $rows = is_array($m['odds'] ?? null) ? $m['odds'] : [];
        foreach ($rows as $r) {
            if (!is_array($r)) continue;
            // For Spread/Totals/Spread HT/Totals HT, the hdp/line must match
            // (within 1e-3) when caller provides one.
            if ($outcomeLine !== null && isset($r['hdp'])) {
                if (abs((float)$r['hdp'] - $outcomeLine) > 0.001) continue;
            }
            // Direct field hit (home/away/draw/over/under/yes/no)
            if ($outcomeField !== '' && isset($r[$outcomeField]) && (float)$r[$outcomeField] > 0) {
                return [
                    'price'       => (float)$r[$outcomeField],
                    'market_name' => $marketName,
                    'outcome'     => $outcomeField,
                ];
            }
            // Label match (Correct Score "2-1", Double Chance "Home or Draw")
            $label = strtolower((string)($r['label'] ?? ''));
            if ($label !== '' && $outcomeField !== '' && strpos($label, $outcomeField) !== false) {
                $price = (float)($r['odds'] ?? $r['under'] ?? $r['home'] ?? 0);
                if ($price > 0) {
                    return [
                        'price'       => $price,
                        'market_name' => $marketName,
                        'outcome'     => (string)($r['label'] ?? $outcomeField),
                    ];
                }
            }
        }
    }
    return null;
}

// Read the per-event snapshot the WS relay daemon wrote to /dev/shm
// and project our 9-column main_odds shape out of the bookmakers/markets
// tree.  Returns null if the file is missing — the daemon hasn't pushed
// this gid yet.
//
// File format (from deploy/pmppm-com/ws-relay/server.js):
//   {
//     "type": "updated", "id": "61301247", "bookie": "Bet365", "seq": …,
//     "markets": [
//       { "name": "ML",       "odds": [{home,draw,away}] },
//       { "name": "Spread",   "odds": [{hdp,home,away}] },
//       { "name": "Totals",   "odds": [{hdp,over,under}] },
//       …
//     ]
//   }
// CG_WS_CACHE_DIR is defined at the top of the file (must be reachable
// from the place-bet handler that runs before this point in execution).

function readWsLiveSnapshot(int $gid): ?array {
    $file = CG_WS_CACHE_DIR . '/' . $gid . '.json';
    if (!is_file($file)) return null;
    $raw = @file_get_contents($file);
    if ($raw === false || $raw === '') return null;
    $data = json_decode($raw, true);
    if (!is_array($data)) return null;
    return $data;
}

function extractMainOddsFromWsCache(int $gid): ?array {
    $snap = readWsLiveSnapshot($gid);
    if (!$snap) return null;
    $markets = $snap['markets'] ?? null;
    if (!is_array($markets) || empty($markets)) return null;
    // Index by canonical market name.
    $byName = [];
    foreach ($markets as $m) {
        if (!is_array($m) || empty($m['name'])) continue;
        $byName[(string)$m['name']] = $m['odds'] ?? [];
    }
    $firstRow = function(string $name) use ($byName): array {
        $rows = $byName[$name] ?? [];
        return is_array($rows) && !empty($rows) && is_array($rows[0]) ? $rows[0] : [];
    };
    $num = function($v): float {
        if ($v === null || $v === '') return 0.0;
        if (is_numeric($v)) return (float)$v;
        return 0.0;
    };

    $ml      = $firstRow('ML');
    $spread  = $firstRow('Spread');
    $totals  = $firstRow('Totals');
    $dnb     = $firstRow('Draw No Bet');
    $btts    = $firstRow('Both Teams To Score');
    $htMl    = $firstRow('Half Time Result');
    $htSp    = $firstRow('Spread HT');
    $htOu    = $firstRow('Totals HT');
    $htBtts  = $firstRow('Both Teams To Score HT');
    $corners = $firstRow('Corners Totals');

    $mH = $num($ml['home']  ?? 0); $mN = $num($ml['draw'] ?? 0); $mC = $num($ml['away'] ?? 0);
    $reH = $num($spread['home'] ?? 0); $reC = $num($spread['away'] ?? 0);
    $reLine = $num($spread['hdp'] ?? 0);
    $ouO = $num($totals['over'] ?? 0); $ouU = $num($totals['under'] ?? 0);
    $ouL = $num($totals['hdp'] ?? 0);

    if ($mH <= 0 && $reH <= 0 && $ouO <= 0) {
        // Nothing useful yet — the WS hasn't filled the main markets.
        return null;
    }

    $out = [
        're_h'     => $reH, 're_line' => $reLine, 're_c'     => $reC,
        'ou_over'  => $ouO, 'ou_line' => $ouL,    'ou_under' => $ouU,
        'm_h'      => $mH,  'm_n'     => $mN,     'm_c'      => $mC,
    ];

    $tsY = $num($btts['yes'] ?? 0); $tsN = $num($btts['no'] ?? 0);
    if ($tsY > 0) { $out['btts_yes'] = $tsY; $out['btts_no'] = $tsN; }

    // Half Time Result: 3 rows {label, under} where label is "1"/"X"/"2"
    // or a team name.  Map to ht_h/ht_n/ht_c using the same hack as
    // OddsApiToCrownXml::blockHalfTime — first row → home, second → draw,
    // third → away.  When the upstream is well-formed this matches.
    $htRows = $byName['Half Time Result'] ?? [];
    if (is_array($htRows) && count($htRows) >= 3) {
        $hmH = $num($htRows[0]['under'] ?? $htRows[0]['home'] ?? 0);
        $hmN = $num($htRows[1]['under'] ?? $htRows[1]['draw'] ?? 0);
        $hmC = $num($htRows[2]['under'] ?? $htRows[2]['away'] ?? 0);
        if ($hmH > 0) { $out['ht_h'] = $hmH; $out['ht_n'] = $hmN; $out['ht_c'] = $hmC; }
    } elseif (!empty($htMl)) {
        $hmH = $num($htMl['home'] ?? 0); $hmN = $num($htMl['draw'] ?? 0); $hmC = $num($htMl['away'] ?? 0);
        if ($hmH > 0) { $out['ht_h'] = $hmH; $out['ht_n'] = $hmN; $out['ht_c'] = $hmC; }
    }

    $hrH = $num($htSp['home'] ?? 0); $hrC = $num($htSp['away'] ?? 0);
    $hrL = $num($htSp['hdp'] ?? 0);
    if ($hrH > 0) { $out['reh_h'] = $hrH; $out['reh_line'] = $hrL; $out['reh_c'] = $hrC; }

    $hoO = $num($htOu['over'] ?? 0); $hoU = $num($htOu['under'] ?? 0);
    $hoL = $num($htOu['hdp'] ?? 0);
    if ($hoO > 0) { $out['ouh_over'] = $hoO; $out['ouh_line'] = $hoL; $out['ouh_under'] = $hoU; }

    // Double Chance: 3 rows with "label" + "under".  Label is "Home or
    // Draw" / "Home or Away" / "Draw or Away" with team prefix.  Match
    // by checking which label contains "Draw" and which doesn't.
    $dcRows = $byName['Double Chance'] ?? [];
    if (is_array($dcRows) && count($dcRows) >= 3) {
        $byLabel = [];
        foreach ($dcRows as $r) {
            if (!is_array($r)) continue;
            $label = strtolower((string)($r['label'] ?? ''));
            $byLabel[$label] = $num($r['under'] ?? 0);
        }
        // We can't always tell which is "Home or Draw" vs "Draw or Away"
        // without team name prefixes; rely on positional fallback if the
        // label parse fails.
        $dc1x = 0.0; $dcx2 = 0.0; $dc12 = 0.0;
        foreach ($byLabel as $lbl => $price) {
            $hasDraw = strpos($lbl, 'draw') !== false;
            if (!$hasDraw) { $dc12 = $price; continue; }
            // contains 'draw' — either 1X or X2.  Heuristic: if 'draw' is
            // the second token (e.g. "home or draw"), it's 1X; if first
            // (e.g. "draw or away"), it's X2.
            $pos = strpos($lbl, 'draw');
            if ($pos !== false && $pos < 4) $dcx2 = $price;
            else $dc1x = $price;
        }
        if ($dc1x <= 0 && $dcx2 <= 0 && count($dcRows) >= 3) {
            // Fallback: positional 1X / 12 / X2 (matches Odds-API.io's
            // common emission order).
            $dc1x = $num($dcRows[0]['under'] ?? 0);
            $dc12 = $num($dcRows[1]['under'] ?? 0);
            $dcx2 = $num($dcRows[2]['under'] ?? 0);
        }
        if ($dc1x > 0) { $out['dc_1x'] = $dc1x; $out['dc_x2'] = $dcx2; $out['dc_12'] = $dc12; }
    }

    $dnbH = $num($dnb['home'] ?? 0); $dnbC = $num($dnb['away'] ?? 0);
    if ($dnbH > 0) { $out['dnb_h'] = $dnbH; $out['dnb_c'] = $dnbC; }

    $coO = $num($corners['over'] ?? 0); $coU = $num($corners['under'] ?? 0);
    $coL = $num($corners['hdp'] ?? 0);
    if ($coO > 0) { $out['corners_over'] = $coO; $out['corners_line'] = $coL; $out['corners_under'] = $coU; }

    $btHtY = $num($htBtts['yes'] ?? 0); $btHtN = $num($htBtts['no'] ?? 0);
    if ($btHtY > 0) { $out['btts_ht_yes'] = $btHtY; $out['btts_ht_no'] = $btHtN; }

    return $out;
}

function extractMainOddsForList(string $rCnEncoded): ?array {
    if (empty($rCnEncoded)) return null;
    $xml = @gzinflate(base64_decode($rCnEncoded));
    if ($xml === false || empty($xml)) return null;
    $g = function(string $tag) use ($xml): float {
        return preg_match('#<' . $tag . '>([^<]+)</' . $tag . '>#i', $xml, $m) ? (float)trim($m[1]) : 0.0;
    };
    $reH = $g('ior_REH'); $reC = $g('ior_REC'); $reLine = $g('ratio_re');
    $ouO = $g('ior_OUH'); $ouU = $g('ior_OUC'); $ouL = $g('ratio_o');
    $mH  = $g('ior_MH');  $mN  = $g('ior_MN');  $mC   = $g('ior_MC');
    $tsY = $g('ior_TSY'); $tsN = $g('ior_TSN');
    $hmH = $g('ior_HMH'); $hmN = $g('ior_HMN'); $hmC = $g('ior_HMC');
    $hrH = $g('ior_HRH'); $hrC = $g('ior_HRC'); $hrL = $g('hratio');
    $hoO = $g('ior_HOUH'); $hoU = $g('ior_HOUC'); $hoL = $g('ratio_ho');
    // DC: ior_DCCN holds X2 (writer convention is C-then-N, see
    // parseRcnMarkets() above).  DNB: writer emits ior_BHH/ior_BHC, not
    // ior_DNBH/ior_DNBC — earlier this function read the latter and
    // always returned dnb_h=dnb_c=0 in the inline list view.
    $dcHN = $g('ior_DCHN'); $dcHC = $g('ior_DCHC'); $dcCN = $g('ior_DCCN');
    $dnbH = $g('ior_BHH'); $dnbC = $g('ior_BHC');
    $coO = $g('ior_AOUO'); $coU = $g('ior_AOUU'); $coL = $g('ratio_aouo');
    $btHtY = $g('ior_HTSY'); $btHtN = $g('ior_HTSN');
    if ($reH <= 0 && $ouO <= 0 && $mH <= 0) return null;
    $out = [
        're_h'     => $reH,  're_line' => $reLine, 're_c'     => $reC,
        'ou_over'  => $ouO,  'ou_line' => $ouL,    'ou_under' => $ouU,
        'm_h'      => $mH,   'm_n'     => $mN,     'm_c'      => $mC,
    ];
    if ($tsY > 0)  { $out['btts_yes'] = $tsY; $out['btts_no'] = $tsN; }
    if ($hmH > 0)  { $out['ht_h'] = $hmH; $out['ht_n'] = $hmN; $out['ht_c'] = $hmC; }
    if ($hrH > 0)  { $out['reh_h'] = $hrH; $out['reh_line'] = $hrL; $out['reh_c'] = $hrC; }
    if ($hoO > 0)  { $out['ouh_over'] = $hoO; $out['ouh_line'] = $hoL; $out['ouh_under'] = $hoU; }
    if ($dcHN > 0) { $out['dc_1x'] = $dcHN; $out['dc_x2'] = $dcCN; $out['dc_12'] = $dcHC; }
    if ($dnbH > 0) { $out['dnb_h'] = $dnbH; $out['dnb_c'] = $dnbC; }
    if ($coO > 0)  { $out['corners_over'] = $coO; $out['corners_line'] = $coL; $out['corners_under'] = $coU; }
    if ($btHtY > 0){ $out['btts_ht_yes'] = $btHtY; $out['btts_ht_no'] = $btHtN; }
    return $out;
}

// =============================================================================
// api-sports.io v3 helpers (statistics, events, h2h, standings, stream stub)
// -----------------------------------------------------------------------------
// All five endpoints share a 30s on-disk cache so repeated polls (statistics
// refresh every 15s while a match is in-play, events every 10s) don't burn
// the 100-req/day api-sports.io quota. The football fixture mapping
// (gid → fixture_id, team flip) is reused from db_markets.foot_match_apisports.
// =============================================================================
define('APISPORTS_KEY',  '967679e7c3c625a64081afc93b7fb1bf');
define('APISPORTS_BASE', 'https://v3.football.api-sports.io');
define('APISPORTS_CACHE_DIR', '/tmp/crown_apisports_cache');
define('APISPORTS_CACHE_TTL', 30); // seconds

function apisportsCacheGet(string $key): ?array {
    $f = APISPORTS_CACHE_DIR . '/' . md5($key) . '.json';
    if (!file_exists($f)) return null;
    if (time() - filemtime($f) > APISPORTS_CACHE_TTL) { @unlink($f); return null; }
    $j = file_get_contents($f);
    $d = json_decode($j, true);
    return is_array($d) ? $d : null;
}
function apisportsCachePut(string $key, array $data): void {
    if (!is_dir(APISPORTS_CACHE_DIR)) @mkdir(APISPORTS_CACHE_DIR, 0777, true);
    file_put_contents(APISPORTS_CACHE_DIR . '/' . md5($key) . '.json', json_encode($data));
}
function apisportsGet(string $relUrl): ?array {
    $cacheKey = "apisports_{$relUrl}";
    $cached = apisportsCacheGet($cacheKey);
    if ($cached !== null) return $cached;
    $url = APISPORTS_BASE . $relUrl;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['x-apisports-key: ' . APISPORTS_KEY],
        CURLOPT_TIMEOUT => 8,
        CURLOPT_CONNECTTIMEOUT => 4,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($resp === false || $code !== 200) return null;
    $data = json_decode($resp, true);
    if (!is_array($data)) return null;
    $out = $data['response'] ?? [];
    apisportsCachePut($cacheKey, $out);
    return $out;
}

/**
 * Resolve a Crown gid → api-sports fixture_id using the foot_match_apisports
 * cache populated by settle_bets.php. Returns ['fixture_id'=>int,'flipped'=>bool]
 * or null if the gid hasn't been mapped yet (i.e. the match never had a bet
 * settle pass over it).
 */
function resolveApisportsFixture(PDO $pdo, int $gid): ?array {
    $st = $pdo->prepare('SELECT fixture_id, last_status FROM foot_match_apisports WHERE gid = :g LIMIT 1');
    $st->execute([':g' => $gid]);
    $r = $st->fetch();
    if (!$r) return null;
    return [
        'fixture_id' => (int)$r['fixture_id'],
        'last_status' => $r['last_status'] ?? null,
    ];
}

// ---------- Lazy fuzzy mapping (gid → api-sports fixture_id) ---------------
// settle_bets.php only caches mappings for bets it has actually settled, so a
// fresh user browsing live matches almost never gets a cache hit. Mirror the
// settle_bets fuzzy-match logic here so the sidebar widgets populate on
// first reveal.
function _norm_team(string $name): string {
    $n = mb_strtolower($name, 'UTF-8');
    $n = preg_replace('/\bfc\b|\bcf\b|\bsc\b|\bac\b|\bclub\b|\bfootball\b|\bsoccer\b/u', ' ', $n);
    $n = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $n);
    $n = preg_replace('/\s+/', ' ', trim($n));
    return _csl_canonicalize($n);
}

/**
 * Bridge api-sports.io legacy CSL names with odds-api.io modern names.
 *
 * api-sports.io still emits pre-rebrand names ("SHANGHAI SIPG", "Henan
 * Jianye", "Hangzhou Greentown", "Tianjin Teda", "Shandong Luneng",
 * "Qingdao Jonoon"...) while odds-api.io ships the current names. The
 * generic Jaccard+Levenshtein matcher scores most of these pairs below
 * the 70 threshold, so we substring-rewrite known legacy fragments to
 * their modern counterparts before similarity is computed.
 */
function _csl_canonicalize(string $n): string {
    static $aliases = [
        // Phrases first (longer wins over shorter substrings).
        'hangzhou greentown' => 'zhejiang',
        'youth island'       => 'west coast',
        'better city'        => 'rongcheng',
        'shenyang urban'     => 'liaoning tieren',
        // Single tokens
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
function _team_sim(string $a, string $b): int {
    $na = _norm_team($a); $nb = _norm_team($b);
    if ($na === '' || $nb === '') return 0;
    if ($na === $nb) return 100;
    $aset = array_unique(explode(' ', $na));
    $bset = array_unique(explode(' ', $nb));
    $inter = count(array_intersect($aset, $bset));
    $union = count(array_unique(array_merge($aset, $bset)));
    $jac = $union > 0 ? $inter / $union : 0;
    $lev = levenshtein($na, $nb);
    $maxlen = max(strlen($na), strlen($nb));
    $levSim = $maxlen > 0 ? 1 - ($lev / $maxlen) : 0;
    return (int)round(($jac * 0.6 + $levSim * 0.4) * 100);
}
function resolveApisportsFixtureLazy(PDO $pdo, int $gid): ?array {
    // Cache hit?
    $hit = resolveApisportsFixture($pdo, $gid);
    if ($hit) return $hit;

    // Need the Crown match to know team names + date
    $st = $pdo->prepare('SELECT gid, team_h, team_c, datetime FROM foot_match WHERE gid = :g LIMIT 1');
    $st->execute([':g' => $gid]);
    $m = $st->fetch();
    if (!$m || empty($m['team_h']) || empty($m['team_c'])) return null;

    $teamH = $m['team_h']; $teamC = $m['team_c'];
    $ts = (int)$m['datetime'];
    // Only consider matches within ±1 day of upstream kickoff
    $datesToTry = [
        date('Y-m-d', $ts),
        date('Y-m-d', $ts - 86400),
        date('Y-m-d', $ts + 86400),
    ];

    $best = null; $bestScore = 0; $bestFlipped = false;
    foreach (array_unique($datesToTry) as $d) {
        $resp = apisportsGet('/fixtures?date=' . $d);
        if (!is_array($resp)) continue;
        foreach ($resp as $fx) {
            $fxHome = $fx['teams']['home']['name'] ?? '';
            $fxAway = $fx['teams']['away']['name'] ?? '';
            // Normal orientation
            $sH = _team_sim($teamH, $fxHome);
            $sA = _team_sim($teamC, $fxAway);
            $score = (int)round(($sH + $sA) / 2);
            if ($score > $bestScore) {
                $bestScore = $score;
                $best = $fx;
                $bestFlipped = false;
            }
            // Flipped
            $sH2 = _team_sim($teamH, $fxAway);
            $sA2 = _team_sim($teamC, $fxHome);
            $score2 = (int)round((($sH2 + $sA2) / 2) * 0.95);
            if ($score2 > $bestScore) {
                $bestScore = $score2;
                $best = $fx;
                $bestFlipped = true;
            }
        }
    }
    if (!$best || $bestScore < 70) return null;

    $fixtureId = (int)($best['fixture']['id'] ?? 0);
    if ($fixtureId === 0) return null;
    $status = $best['fixture']['status']['short'] ?? 'NS';

    // Persist for future lookups
    try {
        $ins = $pdo->prepare(
            'INSERT INTO foot_match_apisports (gid, fixture_id, confidence, last_status, last_synced_at) ' .
            'VALUES (:g,:f,:c,:s,:t) ' .
            'ON DUPLICATE KEY UPDATE fixture_id=VALUES(fixture_id), confidence=VALUES(confidence), ' .
            'last_status=VALUES(last_status), last_synced_at=VALUES(last_synced_at)'
        );
        $ins->execute([
            ':g' => $gid,
            ':f' => $fixtureId,
            ':c' => $bestScore,
            ':s' => $status,
            ':t' => time(),
        ]);
    } catch (Throwable $e) {
        // Table may not exist yet (e.g. settle_bets.php never ran). Best-effort
        // create-or-ignore; if it still fails we just return without caching
        // so the widget keeps working off the live response.
        try {
            $pdo->exec('CREATE TABLE IF NOT EXISTS foot_match_apisports (
                gid INT NOT NULL PRIMARY KEY,
                fixture_id INT NOT NULL,
                confidence INT DEFAULT 100,
                last_status VARCHAR(8) DEFAULT NULL,
                last_synced_at INT DEFAULT NULL
            )');
        } catch (Throwable $e2) { /* swallow */ }
    }
    return ['fixture_id' => $fixtureId, 'last_status' => $status];
}

// =============================================================================
// New right-sidebar widget handlers — all under /api/external/match/...
// and /api/external/league/.../standings.
// Defined BEFORE the existing /leagues, /events handlers so the regexes
// don't accidentally swallow the new shapes.
// =============================================================================

// GET /api/external/match/{gid}/stream
if (preg_match('#^/match/(\d+)/stream$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    // Stream URLs are licensed per-bookmaker; we don't have an upstream feed
    // wired in yet, so we always return a placeholder. The frontend renders
    // a "暂未提供" message in this case.
    echo json_encode(['ok' => true, 'url' => null, 'reason' => 'unavailable']);
    exit;
}

// GET /api/external/match/{gid}/tracker
if (preg_match('#^/match/(\d+)/tracker$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    // Same story for the tracker SVG widget — we can plug a third-party iframe
    // here later. Returning null lets the frontend fall back to a static
    // pitch SVG placeholder.
    echo json_encode(['ok' => true, 'widget_url' => null]);
    exit;
}

// GET /api/external/match/{gid}/statistics
if (preg_match('#^/match/(\d+)/statistics$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $gid = (int)$m[1];
    $map = resolveApisportsFixtureLazy($pdo, $gid);
    if (!$map) { echo json_encode(['ok' => true, 'mapped' => false, 'teams' => []]); exit; }
    $stats = apisportsGet('/fixtures/statistics?fixture=' . $map['fixture_id']);
    if ($stats === null) { http_response_code(502); echo json_encode(['detail' => 'apisports_unreachable']); exit; }
    // Normalise into [{team:{id,name,logo}, stats:[{type,value}]}]
    $teams = [];
    foreach ($stats as $row) {
        $teams[] = [
            'team' => [
                'id' => $row['team']['id'] ?? null,
                'name' => $row['team']['name'] ?? null,
                'logo' => $row['team']['logo'] ?? null,
            ],
            'stats' => array_map(function ($s) {
                return ['type' => $s['type'] ?? '', 'value' => $s['value']];
            }, $row['statistics'] ?? []),
        ];
    }
    echo json_encode(['ok' => true, 'mapped' => true, 'teams' => $teams]);
    exit;
}

// GET /api/external/match/{gid}/events
if (preg_match('#^/match/(\d+)/events$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $gid = (int)$m[1];
    $map = resolveApisportsFixtureLazy($pdo, $gid);
    if (!$map) { echo json_encode(['ok' => true, 'mapped' => false, 'events' => []]); exit; }
    $events = apisportsGet('/fixtures/events?fixture=' . $map['fixture_id']);
    if ($events === null) { http_response_code(502); echo json_encode(['detail' => 'apisports_unreachable']); exit; }
    $out = [];
    foreach ($events as $ev) {
        $out[] = [
            'minute' => $ev['time']['elapsed'] ?? null,
            'extra'  => $ev['time']['extra'] ?? null,
            'team'   => $ev['team']['name'] ?? null,
            'team_id'=> $ev['team']['id'] ?? null,
            'player' => $ev['player']['name'] ?? null,
            'assist' => $ev['assist']['name'] ?? null,
            'type'   => $ev['type'] ?? '',
            'detail' => $ev['detail'] ?? '',
            'comments' => $ev['comments'] ?? null,
        ];
    }
    echo json_encode(['ok' => true, 'mapped' => true, 'events' => $out]);
    exit;
}

// GET /api/external/match/{gid}/lineups
// ---------------------------------------------------------------------------
// Tactical lineup data: starting XI + formation + grid positions for both
// teams. Source is api-sports.io `/fixtures/lineups?fixture=...` which
// returns `grid="row:col"` coordinates (row 1=GK, 2=DEF, 3=MID, 4=FWD).
// The frontend uses these to draw a 22-dot SVG pitch view ("战术" tab) —
// see TacticalCard in sports/page.tsx. This replaces the disabled
// Sportradar tracker stub; with Sportradar widgets being commercial-only
// and Sofascore's API gated behind anti-bot Cloudflare, this self-hosted
// SVG view is the only achievable in-house tactical visualisation.
if (preg_match('#^/match/(\d+)/lineups$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $gid = (int)$m[1];
    $map = resolveApisportsFixtureLazy($pdo, $gid);
    if (!$map) { echo json_encode(['ok' => true, 'mapped' => false, 'teams' => []]); exit; }
    $resp = apisportsGet('/fixtures/lineups?fixture=' . $map['fixture_id']);
    if ($resp === null) { http_response_code(502); echo json_encode(['detail' => 'apisports_unreachable']); exit; }
    $teams = [];
    foreach ($resp as $t) {
        $simplifyPlayer = function ($p) {
            $pl = $p['player'] ?? [];
            return [
                'id'     => $pl['id'] ?? null,
                'number' => $pl['number'] ?? null,
                'name'   => $pl['name'] ?? '',
                'pos'    => $pl['pos'] ?? null,    // G | D | M | F
                'grid'   => $pl['grid'] ?? null,   // "row:col"
            ];
        };
        $teams[] = [
            'team'      => $t['team'] ?? null,
            'formation' => $t['formation'] ?? null,
            'coach'     => $t['coach'] ?? null,
            'startXI'      => array_map($simplifyPlayer, $t['startXI'] ?? []),
            'substitutes'  => array_map($simplifyPlayer, $t['substitutes'] ?? []),
        ];
    }
    echo json_encode(['ok' => true, 'mapped' => true, 'teams' => $teams]);
    exit;
}

// GET /api/external/match/{gid}/h2h?last=10
if (preg_match('#^/match/(\d+)/h2h$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $gid = (int)$m[1];
    $last = max(1, min(20, (int)($_GET['last'] ?? 10)));
    $map = resolveApisportsFixtureLazy($pdo, $gid);
    if (!$map) { echo json_encode(['ok' => true, 'mapped' => false, 'h2h' => [], 'home_form' => [], 'away_form' => []]); exit; }
    // Fetch the fixture so we know team ids
    $fx = apisportsGet('/fixtures?id=' . $map['fixture_id']);
    if (!$fx || empty($fx[0])) { echo json_encode(['ok' => true, 'mapped' => false, 'h2h' => []]); exit; }
    $homeId = $fx[0]['teams']['home']['id'] ?? null;
    $awayId = $fx[0]['teams']['away']['id'] ?? null;
    $leagueId = $fx[0]['league']['id'] ?? null;
    $season   = $fx[0]['league']['season'] ?? null;
    if (!$homeId || !$awayId) { echo json_encode(['ok' => true, 'mapped' => false, 'h2h' => []]); exit; }
    $h2hRaw = apisportsGet("/fixtures/headtohead?h2h={$homeId}-{$awayId}&last={$last}");
    $homeFormRaw = apisportsGet("/fixtures?team={$homeId}&last=5");
    $awayFormRaw = apisportsGet("/fixtures?team={$awayId}&last=5");
    $simplify = function ($f) {
        return [
            'fixture_id' => $f['fixture']['id'] ?? null,
            'date_iso'   => $f['fixture']['date'] ?? null,
            'league'     => $f['league']['name'] ?? null,
            'venue'      => $f['fixture']['venue']['name'] ?? null,
            'home'       => $f['teams']['home']['name'] ?? null,
            'away'       => $f['teams']['away']['name'] ?? null,
            'home_id'    => $f['teams']['home']['id'] ?? null,
            'away_id'    => $f['teams']['away']['id'] ?? null,
            'home_winner'=> $f['teams']['home']['winner'] ?? null,
            'away_winner'=> $f['teams']['away']['winner'] ?? null,
            'score_home' => $f['goals']['home'] ?? null,
            'score_away' => $f['goals']['away'] ?? null,
        ];
    };
    echo json_encode([
        'ok' => true,
        'mapped' => true,
        'home' => ['id' => $homeId, 'name' => $fx[0]['teams']['home']['name'] ?? null],
        'away' => ['id' => $awayId, 'name' => $fx[0]['teams']['away']['name'] ?? null],
        'league_id' => $leagueId,
        'season'    => $season,
        'h2h' => array_map($simplify, $h2hRaw ?: []),
        'home_form' => array_map($simplify, $homeFormRaw ?: []),
        'away_form' => array_map($simplify, $awayFormRaw ?: []),
    ]);
    exit;
}

// GET /api/external/match/{gid}/standings
if (preg_match('#^/match/(\d+)/standings$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $gid = (int)$m[1];
    $map = resolveApisportsFixtureLazy($pdo, $gid);
    if (!$map) { echo json_encode(['ok' => true, 'mapped' => false, 'league' => null, 'standings' => []]); exit; }
    $fx = apisportsGet('/fixtures?id=' . $map['fixture_id']);
    if (!$fx || empty($fx[0])) { echo json_encode(['ok' => true, 'mapped' => false, 'standings' => []]); exit; }
    $leagueId = $fx[0]['league']['id'] ?? null;
    $season   = $fx[0]['league']['season'] ?? null;
    $leagueName = $fx[0]['league']['name'] ?? null;
    if (!$leagueId || !$season) { echo json_encode(['ok' => true, 'mapped' => false, 'standings' => []]); exit; }
    $st = apisportsGet("/standings?league={$leagueId}&season={$season}");
    // Response shape: [{league:{id,name,country,standings:[[row,row...]]}}]
    $rows = [];
    if (!empty($st[0]['league']['standings'][0])) {
        foreach ($st[0]['league']['standings'][0] as $r) {
            $rows[] = [
                'rank'       => $r['rank'] ?? null,
                'team_id'    => $r['team']['id'] ?? null,
                'team_name'  => $r['team']['name'] ?? null,
                'team_logo'  => $r['team']['logo'] ?? null,
                'played'     => $r['all']['played'] ?? null,
                'win'        => $r['all']['win'] ?? null,
                'draw'       => $r['all']['draw'] ?? null,
                'lose'       => $r['all']['lose'] ?? null,
                'goals_for'  => $r['all']['goals']['for'] ?? null,
                'goals_against' => $r['all']['goals']['against'] ?? null,
                'goals_diff' => $r['goalsDiff'] ?? null,
                'points'     => $r['points'] ?? null,
                'form'       => $r['form'] ?? null,
                'group'      => $r['group'] ?? null,
            ];
        }
    }
    echo json_encode([
        'ok' => true,
        'mapped' => true,
        'league_id' => $leagueId,
        'season' => $season,
        'league_name' => $leagueName,
        'home_team_id' => $fx[0]['teams']['home']['id'] ?? null,
        'away_team_id' => $fx[0]['teams']['away']['id'] ?? null,
        'standings' => $rows,
    ]);
    exit;
}

// --- API Handlers ------------------------------------------------------------

// GET /api/external/leagues
if ($route === '/leagues' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare("
        SELECT lid, league,
               COUNT(*) AS events,
               SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS active,
               SUM(CASE WHEN datetime < UNIX_TIMESTAMP() THEN 1 ELSE 0 END) AS settled,
               MIN(datetime) AS first_ts,
               MAX(datetime) AS last_ts
        FROM foot_match
        WHERE lid BETWEEN :min AND :max
        GROUP BY lid, league
        ORDER BY events DESC, lid
    ");
    $stmt->execute([':min' => LID_MIN, ':max' => LID_MAX]);
    $rows = $stmt->fetchAll();
    $items = [];
    foreach ($rows as $r) {
        $items[] = [
            'league_slug' => lidToSlug((int)$r['lid']),
            'league_name' => $r['league'],
            'events' => (int)$r['events'],
            'active' => (int)$r['active'],
            'settled' => (int)$r['settled'],
            'first_ts' => $r['first_ts'] ? (int)$r['first_ts'] : null,
            'last_ts' => $r['last_ts'] ? (int)$r['last_ts'] : null,
        ];
    }
    echo json_encode(['total' => count($items), 'items' => $items]);
    exit;
}

// GET /api/external/events/{id}/markets
if (preg_match('#^/events/(\d+)/markets$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $gid = (int)$m[1];
    $stmt = $pdo->prepare("
        SELECT m.gid, m.lid, m.league, m.team_h, m.team_c, m.datetime, m.status,
               m.score_h, m.score_c, m.inball_h, m.inball_c, m.inball_h_hr, m.inball_c_hr, m.is_inball,
               x.r_cn
        FROM foot_match m
        LEFT JOIN foot_match_xml x ON x.gid = m.gid
        WHERE m.gid = :gid AND m.lid BETWEEN :min AND :max
        LIMIT 1
    ");
    $stmt->execute([':gid' => $gid, ':min' => LID_MIN, ':max' => LID_MAX]);
    $row = $stmt->fetch();
    if (!$row) {
        http_response_code(404);
        echo json_encode(['detail' => 'event not found']);
        exit;
    }
    $ts = datetimeToEpoch($row['datetime']);
    $scoreInfo = extractScores($row);
    $event = [
        'id' => (int)$row['gid'],
        'sport_slug' => 'football',
        'league_slug' => lidToSlug((int)$row['lid']),
        'league_name' => $row['league'],
        'home' => $row['team_h'],
        'away' => $row['team_c'],
        'home_id' => $row['team_h'],
        'away_id' => $row['team_c'],
        'commence_iso' => date('c', $ts),
        'commence_ts' => $ts,
        'status' => matchStatus($row),
        'score_home' => $scoreInfo['score_home'],
        'score_away' => $scoreInfo['score_away'],
        'score_home_ht' => $scoreInfo['score_home_ht'],
        'score_away_ht' => $scoreInfo['score_away_ht'],
        'is_finished' => $scoreInfo['is_finished'],
        'fetched_at' => time(),
        'apisports_fixture_id' => null,
        'apisports_match_iso' => null,
    ];

    // Try live fetch from odds-api.io first (all 60+ markets).
    // Falls back to r_cn XML (7 markets) if the upstream call fails.
    $apiData = fetchOddsApiMarkets($gid);
    if ($apiData !== null) {
        $allBookmakers = transformOddsApiToBookmakers($apiData);
        $totalMarkets = 0;
        foreach ($allBookmakers as $b) $totalMarkets += $b['market_count'];
        $event['market_count'] = $totalMarkets;
        cgMarketCountWrite($gid, $totalMarkets);
        echo json_encode([
            'event' => $event,
            'bookmakers' => $allBookmakers,
            'total_markets' => $totalMarkets,
        ]);
        exit;
    }

    // Fallback: parse r_cn XML from MySQL
    $bookmarkets = [];
    if (!empty($row['r_cn'])) {
        $bookmarkets = parseRcnMarkets($row['r_cn']);
    }

    $event['market_count'] = count($bookmarkets);

    echo json_encode([
        'event' => $event,
        'bookmakers' => [
            ['bookmaker' => 'Bet365', 'markets' => $bookmarkets, 'market_count' => count($bookmarkets)],
        ],
        'total_markets' => count($bookmarkets),
    ]);
    exit;
}

// GET /api/external/events/{id}
if (preg_match('#^/events/(\d+)$#', $route, $m) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $gid = (int)$m[1];
    $stmt = $pdo->prepare("
        SELECT m.gid, m.lid, m.league, m.team_h, m.team_c, m.datetime, m.status,
               m.score_h, m.score_c, m.inball_h, m.inball_c, m.inball_h_hr, m.inball_c_hr, m.is_inball,
               (SELECT COUNT(*) FROM foot_match_xml x WHERE x.gid = m.gid AND x.r_cn IS NOT NULL) AS has_xml
        FROM foot_match m
        WHERE m.gid = :gid AND m.lid BETWEEN :min AND :max
        LIMIT 1
    ");
    $stmt->execute([':gid' => $gid, ':min' => LID_MIN, ':max' => LID_MAX]);
    $row = $stmt->fetch();
    if (!$row) {
        http_response_code(404);
        echo json_encode(['detail' => 'event not found']);
        exit;
    }
    $ts = datetimeToEpoch($row['datetime']);
    $scoreInfo = extractScores($row);
    echo json_encode([
        'id' => (int)$row['gid'],
        'sport_slug' => 'football',
        'league_slug' => lidToSlug((int)$row['lid']),
        'league_name' => $row['league'],
        'home' => $row['team_h'],
        'away' => $row['team_c'],
        'home_id' => $row['team_h'],
        'away_id' => $row['team_c'],
        'commence_iso' => date('c', $ts),
        'commence_ts' => $ts,
        'status' => matchStatus($row),
        'score_home' => $scoreInfo['score_home'],
        'score_away' => $scoreInfo['score_away'],
        'score_home_ht' => $scoreInfo['score_home_ht'],
        'score_away_ht' => $scoreInfo['score_away_ht'],
        'is_finished' => $scoreInfo['is_finished'],
        'fetched_at' => time(),
        'market_count' => (int)$row['has_xml'] > 0 ? 7 : 0,
        'apisports_fixture_id' => null,
        'apisports_match_iso' => null,
    ]);
    exit;
}

// GET /api/external/events
if ($route === '/events' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $league = $_GET['league'] ?? null;
    $status = $_GET['status'] ?? null;
    $q = $_GET['q'] ?? null;
    $onlyActive = ($_GET['only_active'] ?? '') === 'true';
    $limit = min(500, max(1, (int)($_GET['limit'] ?? 100)));
    $offset = max(0, (int)($_GET['offset'] ?? 0));

    $where = ['m.lid BETWEEN :min AND :max'];
    $params = [':min' => LID_MIN, ':max' => LID_MAX];

    if ($league) {
        $lid = slugToLid($league);
        if ($lid) {
            $where[] = 'm.lid = :lid';
            $params[':lid'] = $lid;
        }
    }
    if ($q) {
        $where[] = "(m.team_h LIKE :q OR m.team_c LIKE :q OR m.league LIKE :q)";
        $params[':q'] = "%{$q}%";
    }

    $whereSql = implode(' AND ', $where);

    $stmt = $pdo->prepare("
        SELECT m.gid, m.lid, m.league, m.team_h, m.team_c, m.datetime, m.status,
               m.score_h, m.score_c, m.inball_h, m.inball_c, m.inball_h_hr, m.inball_c_hr, m.is_inball,
               x.r_cn
        FROM foot_match m
        LEFT JOIN foot_match_xml x ON x.gid = m.gid
        WHERE {$whereSql}
        ORDER BY m.datetime ASC, m.gid ASC
        LIMIT :limit OFFSET :offset
    ");
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();

    // Total count
    $stmtC = $pdo->prepare("SELECT COUNT(*) AS n FROM foot_match m WHERE {$whereSql}");
    foreach ($params as $k => $v) $stmtC->bindValue($k, $v);
    $stmtC->execute();
    $total = (int)$stmtC->fetch()['n'];

    $items = [];
    foreach ($rows as $r) {
        $ts = datetimeToEpoch($r['datetime']);
        // In-play (滚球) reads from the WS relay's /dev/shm cache; pre-match
        // reads the cron r_cn snapshot.  See mainOddsForRow() above.
        $mainOdds = mainOddsForRow($r);
        $scoreInfo = extractScores($r);
        $items[] = [
            'id' => (int)$r['gid'],
            'sport_slug' => 'football',
            'league_slug' => lidToSlug((int)$r['lid']),
            'league_name' => $r['league'],
            'home' => $r['team_h'],
            'away' => $r['team_c'],
            'home_id' => $r['team_h'],
            'away_id' => $r['team_c'],
            'commence_iso' => date('c', $ts),
            'commence_ts' => $ts,
            'status' => matchStatus($r),
            'score_home' => $scoreInfo['score_home'],
            'score_away' => $scoreInfo['score_away'],
            'score_home_ht' => $scoreInfo['score_home_ht'],
            'score_away_ht' => $scoreInfo['score_away_ht'],
            'is_finished' => $scoreInfo['is_finished'],
            'fetched_at' => time(),
            'market_count' => cgMarketCountRead((int)$r['gid'], count(parseRcnMarkets($r['r_cn'] ?? '')) > 0 ? 60 : 0),
            'main_odds' => $mainOdds,
            'apisports_fixture_id' => null,
            'apisports_match_iso' => null,
        ];
    }

    echo json_encode(['total' => $total, 'items' => $items]);
    exit;
}

// Fallback
http_response_code(404);
echo json_encode(['detail' => 'not found', 'path' => $path, 'route' => $route]);
