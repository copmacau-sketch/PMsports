<?php
/**
 * oddsapi.php — Odds-API.io 数据采集守护脚本
 *
 * 替代 data5/data10/data60.php（它们依赖无法访问的 hga0405.com 数据接口）。
 * 本脚本通过 Odds-API.io + api-sports.io 拉取赛事+赔率+实时比分，
 * 写入 application/member/data/catalog.json，供前端 api_catalog.php 消费。
 *
 * 刷新策略：
 *   全量（含赔率+赛程）：每 FULL_INTERVAL 秒一次
 *   仅实时比分（--live-only）：每 LIVE_INTERVAL 秒一次
 *
 * 由 crown_gold_collector.py supervisor 管理，自动重启。
 */

set_time_limit(0);
ini_set('memory_limit', '256M');

define('FULL_INTERVAL', 300);  // 5 分钟全量刷新
define('LIVE_INTERVAL', 60);   // 60 秒比分刷新
define('BUILD_SCRIPT',
    realpath(__DIR__ . '/../../application/member/tools/build_catalog.php'));

$start = $argv[1] ?? 'start';

if (!file_exists(BUILD_SCRIPT)) {
    echo "[ERROR] build_catalog.php not found at " . BUILD_SCRIPT . "\n";
    exit(1);
}

echo "[INFO] oddsapi daemon started (build=" . BUILD_SCRIPT . ")\n";
echo "[INFO] full_interval=" . FULL_INTERVAL . "s  live_interval=" . LIVE_INTERVAL . "s\n";

$lastFull = 0;
$cycle    = 0;

while ($start !== 'stop') {
    $now = time();
    $cycle++;

    if ($now - $lastFull >= FULL_INTERVAL) {
        // ── 全量：赔率 + 赛程 + 比分 ──────────────────────────────────────
        echo "[" . date('H:i:s') . "] cycle={$cycle} FULL rebuild\n";
        $t0  = microtime(true);
        $cmd = "php " . escapeshellarg(BUILD_SCRIPT) . " 2>&1";
        passthru($cmd, $rc);
        $elapsed = round(microtime(true) - $t0, 1);
        echo "[" . date('H:i:s') . "] full done rc={$rc} elapsed={$elapsed}s\n";
        $lastFull = time();
    } else {
        // ── 仅实时比分 ───────────────────────────────────────────────────
        echo "[" . date('H:i:s') . "] cycle={$cycle} live-only update\n";
        $t0  = microtime(true);
        $cmd = "php " . escapeshellarg(BUILD_SCRIPT) . " --live-only 2>&1";
        passthru($cmd, $rc);
        $elapsed = round(microtime(true) - $t0, 1);
        echo "[" . date('H:i:s') . "] live done rc={$rc} elapsed={$elapsed}s\n";
    }

    sleep(LIVE_INTERVAL);
}

echo "[INFO] oddsapi daemon stopped\n";
