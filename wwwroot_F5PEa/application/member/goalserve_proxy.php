<?php
/**
 * Goalserve 稳定代理 (Smart Cache Proxy)
 * - TTL 缓存：无论多少浏览器在轮询，对上游最多 ~1 次/秒，杜绝 429/500。
 * - 文件锁：防止并发惊群 (thundering herd)。
 * - Stale-while-error：上游失败 (429/500) 时继续返回上一份有效数据，UI 不闪错。
 * - 校验 ASP.NET 挑战页 (__VIEWSTATE) 视为失败。
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store');

// 仅允许字母数字 key，避免路径注入
$apiKey = isset($_GET['key']) ? preg_replace('/[^a-z0-9]/i', '', $_GET['key']) : '3416f409c2584c9e081c08debf8ab4bb';

// feed 类型：odds = 滚球/赔率，live = 比分事件
$type = isset($_GET['type']) && $_GET['type'] === 'live' ? 'live' : 'odds';
if ($type === 'live') {
    $url = "https://www.goalserve.com/getfeed/{$apiKey}/soccernew/live?json=1";
} else {
    $url = "https://www.goalserve.com/getfeed/{$apiKey}/getodds/soccer?cat=soccer_10&json=1";
}

$cacheFile = sys_get_temp_dir() . "/gs_{$type}_{$apiKey}.json";
$lockFile  = $cacheFile . '.lock';
$cacheTtl  = 1.0; // 秒：缓存有效期，决定上游刷新节奏

// 1) 缓存仍新鲜 -> 直接返回，不打上游
if (is_file($cacheFile) && (microtime(true) - filemtime($cacheFile)) < $cacheTtl) {
    readfile($cacheFile);
    exit;
}

// 2) 抢锁：只有一个进程去拉上游，其余直接吃缓存
$fp = fopen($lockFile, 'c');
$gotLock = $fp && flock($fp, LOCK_EX | LOCK_NB);

if ($gotLock) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_setopt($ch, CURLOPT_ENCODING, "");
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    // 手动兜底解压 GZIP
    if ($response && substr($response, 0, 2) === "\x1f\x8b") {
        $d = @gzdecode($response);
        if ($d !== false) $response = $d;
    }

    // 校验：必须是 JSON ( { 开头 ) 且不含 ASP.NET 挑战页标记
    $isValid = ($httpCode === 200 && $response
        && $response[0] === '{'
        && strpos($response, '__VIEWSTATE') === false);

    if ($isValid) {
        file_put_contents($cacheFile, $response, LOCK_EX);
        flock($fp, LOCK_UN);
        fclose($fp);
        echo $response;
        exit;
    }

    flock($fp, LOCK_UN);
    fclose($fp);

    // 上游失败：有旧缓存就继续用旧的 (stale-while-error)
    if (is_file($cacheFile)) {
        readfile($cacheFile);
        exit;
    }

    // 完全无缓存才报错
    $preview = mb_convert_encoding(substr((string)$response, 0, 300), 'UTF-8', 'UTF-8,GBK,GB2312,ISO-8859-1');
    echo json_encode([
        'error' => 'Upstream fetch failed and no cache available',
        'code' => $httpCode,
        'curl_error' => $curlError,
        'preview' => $preview,
        'scores' => ['category' => []],
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 3) 没抢到锁（别人正在拉）：直接返回现有缓存
if ($fp) fclose($fp);
if (is_file($cacheFile)) {
    readfile($cacheFile);
} else {
    echo json_encode(['scores' => ['category' => []], 'note' => 'warming up'], JSON_UNESCAPED_UNICODE);
}

