<?php
/**
 * Goalserve Logo 代理 + 磁盘缓存
 * - logo 基本是静态资源：每个 id 抓一次后永久缓存到磁盘，之后不再打上游 -> 几乎不会触发 1次/秒限制。
 * - 上游限流保护：两次上游请求之间强制 >= 1.1 秒（全局时间戳 + 文件锁）。
 *
 * 用法:
 *   JSON:  goalserve_logo.php?type=teams&ids=9002,9240
 *          goalserve_logo.php?type=leagues&ids=1151
 *   图片:  goalserve_logo.php?type=teams&id=9002&img=1   -> 直接返回 PNG (适合 <img src>)
 *
 * type(category): leagues | teams | players
 * sport: 默认 soccer
 */

$API_KEY = 'c74967accb6a4acc791908de6ecd0c8e';
$RATE_GAP = 1.1; // 秒：两次上游请求最小间隔

$sport = isset($_GET['sport']) ? preg_replace('/[^a-z_]/i', '', $_GET['sport']) : 'soccer';
$type  = isset($_GET['type'])  ? preg_replace('/[^a-z]/i', '', $_GET['type'])  : 'teams';
if (!in_array($type, ['leagues', 'teams', 'players'], true)) $type = 'teams';

// 收集请求的 id（支持 ids=逗号分隔 或 单个 id）
$idsParam = isset($_GET['ids']) ? $_GET['ids'] : (isset($_GET['id']) ? $_GET['id'] : '');
$ids = array_values(array_filter(array_map(function ($x) {
    return preg_replace('/[^0-9]/', '', $x);
}, explode(',', $idsParam)), function ($x) { return $x !== ''; }));

if (empty($ids)) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(400);
    echo json_encode(['error' => 'missing ids/id param']);
    exit;
}

$cacheDir = sys_get_temp_dir() . '/gs_logos';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0775, true);

$cachePath = function ($id) use ($cacheDir, $sport, $type) {
    return $cacheDir . "/{$sport}_{$type}_{$id}.b64";
};

// 读取已缓存，找出缺失的 id
$result = [];   // id => base64
$missing = [];
foreach ($ids as $id) {
    $p = $cachePath($id);
    if (is_file($p)) {
        $result[$id] = file_get_contents($p);
    } else {
        $missing[] = $id;
    }
}

// 有缺失才打上游（一次请求可批量取多个 id）
if (!empty($missing)) {
    $tsFile = $cacheDir . '/.last_fetch';
    $lockFp = fopen($cacheDir . '/.fetch.lock', 'c');
    if ($lockFp && flock($lockFp, LOCK_EX)) {
        // 全局限流：与上次上游请求间隔 >= RATE_GAP
        $last = is_file($tsFile) ? (float)file_get_contents($tsFile) : 0.0;
        $wait = $RATE_GAP - (microtime(true) - $last);
        if ($wait > 0 && $wait < 3) usleep((int)($wait * 1e6));

        $url = "http://data2.goalserve.com:8084/api/v1/logotips/{$sport}/{$type}?k={$API_KEY}&ids=" . implode(',', $missing);
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 12);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
        $resp = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        file_put_contents($tsFile, (string)microtime(true));

        if ($code === 200 && $resp) {
            $arr = json_decode($resp, true);
            if (is_array($arr)) {
                foreach ($arr as $item) {
                    if (isset($item['id'], $item['base64'])) {
                        $id = (string)$item['id'];
                        $result[$id] = $item['base64'];
                        @file_put_contents($cachePath($id), $item['base64']); // 永久缓存
                    }
                }
            }
        }
        flock($lockFp, LOCK_UN);
    }
    if ($lockFp) fclose($lockFp);
}

// 图片模式：直接吐 PNG（取第一个命中的 id）
if (isset($_GET['img'])) {
    $first = $ids[0];
    if (isset($result[$first]) && $result[$first] !== '') {
        $bin = base64_decode($result[$first]);
        if ($bin !== false) {
            header('Content-Type: image/png');
            header('Cache-Control: public, max-age=604800'); // 浏览器缓存 7 天
            echo $bin;
            exit;
        }
    }
    // 没有数据 -> 1x1 透明占位
    header('Content-Type: image/png');
    echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC');
    exit;
}

// JSON 模式
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$out = [];
foreach ($ids as $id) {
    $out[] = ['id' => (int)$id, 'base64' => isset($result[$id]) ? $result[$id] : null];
}
echo json_encode($out, JSON_UNESCAPED_SLASHES);
