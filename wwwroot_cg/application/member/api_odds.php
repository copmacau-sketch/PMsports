<?php
/**
 * 盘口 API 入口 — 对接 Odds-API.io / api-sports.io
 * 前端 AJAX 调用，返回 JSON
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// 加载 DB + 公共
$rootDir = realpath(__DIR__ . '/../../');
include_once $rootDir . '/vendor/mysql/config.php';
include_once $rootDir . '/vendor/common/OddsApiAdapter.php';

$ODDS_KEY   = 'f13e2d297eb9e7006113eeca5f95682e3da7a5d39581e0ee7681c5abbd28e3b9';
$SPORTS_KEY = '967679e7c3c625a64081afc93b7fb1bf';

$adapter = new OddsApiAdapter($ODDS_KEY, $SPORTS_KEY);

$action = $_REQUEST['action'] ?? '';
$gtype  = $_REQUEST['gtype']  ?? 'ft';

try {
    switch ($action) {
        case 'leagues':
            $data = $adapter->getLeagues($gtype);
            echo json_encode(['code' => 200, 'data' => array_values($data)]);
            break;

        case 'events':
            $league = $_REQUEST['league'] ?? '';
            $data = $adapter->getEventsWithOdds($gtype, $league);
            echo json_encode(['code' => 200, 'data' => $data]);
            break;

        case 'odds':
            $eventId = $_REQUEST['eventId'] ?? '';
            if (empty($eventId)) {
                echo json_encode(['code' => 400, 'msg' => 'eventId required']);
                break;
            }
            $data = $adapter->getOdds($eventId);
            echo json_encode(['code' => 200, 'data' => $data]);
            break;

        case 'live':
            $data = $adapter->getLiveScores();
            echo json_encode(['code' => 200, 'data' => $data]);
            break;

        case 'results':
            $date = $_REQUEST['date'] ?? date('Y-m-d');
            $data = $adapter->getTodayResults($date);
            echo json_encode(['code' => 200, 'data' => $data]);
            break;

        default:
            echo json_encode(['code' => 400, 'msg' => 'unknown action: ' . $action]);
    }
} catch (Throwable $e) {
    echo json_encode(['code' => 500, 'msg' => $e->getMessage()]);
}
