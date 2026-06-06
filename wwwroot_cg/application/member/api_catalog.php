<?php
/**
 * api_catalog.php — JSON API for match catalog
 *
 * GET ?action=all           全部数据
 * GET ?action=leagues       联赛列表
 * GET ?action=matches       全部比赛 (可选 &league=slug &status=live|pending|finished)
 * GET ?action=match&id=XXX  单场比赛
 * GET ?action=live          仅滚球比赛
 * GET ?action=refresh       强制重新拉取 (慎用，消耗 API 额度)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=30');

define('DATA_DIR', __DIR__ . '/data');
$catalogFile = DATA_DIR . '/catalog.json';

// If catalog doesn't exist or is stale (>10min), try building it
if (!file_exists($catalogFile) || (time() - filemtime($catalogFile) > 600)) {
    $buildScript = __DIR__ . '/tools/build_catalog.php';
    if (file_exists($buildScript)) {
        exec("php $buildScript 2>/dev/null &");
    }
}

$action = $_GET['action'] ?? 'all';

if (!file_exists($catalogFile)) {
    echo json_encode(['error' => 'Catalog not ready, building...', 'retry_after' => 30]);
    exit;
}

$catalog = json_decode(file_get_contents($catalogFile), true);
if (!$catalog) {
    echo json_encode(['error' => 'Invalid catalog data']);
    exit;
}

switch ($action) {
    case 'all':
        echo json_encode($catalog, JSON_UNESCAPED_UNICODE);
        break;

    case 'leagues':
        echo json_encode([
            'updated_at' => $catalog['updated_at'],
            'leagues'    => $catalog['leagues'],
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'matches':
        $matches = $catalog['matches'];
        // Filter by league
        if (!empty($_GET['league'])) {
            $slug = $_GET['league'];
            $matches = array_values(array_filter($matches, fn($m) => $m['league_slug'] === $slug));
        }
        // Filter by status
        if (!empty($_GET['status'])) {
            $status = $_GET['status'];
            $matches = array_values(array_filter($matches, fn($m) => $m['status'] === $status));
        }
        echo json_encode([
            'updated_at' => $catalog['updated_at'],
            'count'      => count($matches),
            'matches'    => $matches,
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'match':
        $id = $_GET['id'] ?? '';
        $found = null;
        foreach ($catalog['matches'] as $m) {
            if ($m['id'] === $id) { $found = $m; break; }
        }
        if ($found) {
            echo json_encode($found, JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Match not found', 'id' => $id]);
        }
        break;

    case 'live':
        $live = array_values(array_filter($catalog['matches'], fn($m) => $m['status'] === 'live'));
        echo json_encode([
            'updated_at' => $catalog['updated_at'],
            'count'      => count($live),
            'matches'    => $live,
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'refresh':
        $buildScript = __DIR__ . '/tools/build_catalog.php';
        $output = [];
        exec("php $buildScript 2>&1", $output, $ret);
        echo json_encode([
            'status'  => $ret === 0 ? 'ok' : 'error',
            'output'  => implode("\n", array_slice($output, -10)),
        ], JSON_UNESCAPED_UNICODE);
        break;

    default:
        echo json_encode(['error' => 'Unknown action', 'valid' => ['all','leagues','matches','match','live','refresh']]);
}
