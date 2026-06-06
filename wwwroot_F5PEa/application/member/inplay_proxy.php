<?php
/**
 * Goalserve In-Play 滚球赔率代理 (private-key / IP 白名单源)
 * 源: http://inplay.goalserve.com/inplay-soccer.gz  (gzip JSON, 每秒刷新, 按服务器IP授权)
 *
 * - 1 秒 TTL 缓存 + 文件锁：无论多少浏览器轮询，对上游最多 ~1 次/秒。
 * - 服务端 gzip 解压，直接吐 JSON 给浏览器。
 * - Stale-while-error：上游抖动时继续返回上一份有效数据，UI 不闪错。
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store');

$SPORT = isset($_GET['sport']) ? preg_replace('/[^a-z]/i', '', $_GET['sport']) : 'soccer';
$URL   = "http://inplay.goalserve.com/inplay-{$SPORT}.gz";
$TTL   = 1.0;

$cacheFile = sys_get_temp_dir() . "/gs_inplay_{$SPORT}.json";
$lockFile  = $cacheFile . '.lock';

// 1) 新鲜缓存直接返回
if (is_file($cacheFile) && (microtime(true) - filemtime($cacheFile)) < $TTL) {
    readfile($cacheFile);
    exit;
}

// 2) 抢锁拉上游
$fp = fopen($lockFile, 'c');
$gotLock = $fp && flock($fp, LOCK_EX | LOCK_NB);

if ($gotLock) {
    $ch = curl_init($URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
    $raw = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    // 解压 gzip
    $json = $raw;
    if ($raw && substr($raw, 0, 2) === "\x1f\x8b") {
        $d = @gzdecode($raw);
        if ($d !== false) $json = $d;
    }

    $isValid = ($code === 200 && $json && ($json[0] === '{' || $json[0] === '['));

    if ($isValid) {
        file_put_contents($cacheFile, $json, LOCK_EX);
        flock($fp, LOCK_UN);
        fclose($fp);
        echo $json;
        exit;
    }

    flock($fp, LOCK_UN);
    fclose($fp);

    if (is_file($cacheFile)) { readfile($cacheFile); exit; }

    echo json_encode([
        'error' => 'inplay upstream failed and no cache',
        'code' => $code,
        'curl_error' => $err,
        'events' => [],
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 3) 没抢到锁 -> 返回现有缓存
if ($fp) fclose($fp);
if (is_file($cacheFile)) {
    readfile($cacheFile);
} else {
    echo json_encode(['events' => [], 'note' => 'warming up'], JSON_UNESCAPED_UNICODE);
}
