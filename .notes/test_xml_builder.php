<?php
/**
 * 本地烟雾测试：用 fixture_odds_61301267.json + Brighton vs Manchester United
 * 跑一遍 OddsApiToCrownXml，dump 生成的 r_cn XML 长度 / 关键标签覆盖情况。
 */
require_once __DIR__ . '/../wwwroot_F5PEa/vendor/common/OddsApiToCrownXml.php';

$oddsJson = json_decode(file_get_contents(__DIR__ . '/fixture_odds_61301267.json'), true);
$eventsJson = json_decode(file_get_contents(__DIR__ . '/fixture_events_epl.json'), true);

// 从 events 找到这场比赛
$event = null;
foreach ($eventsJson as $e) {
    if ((int)$e['id'] === 61301267) { $event = $e; break; }
}
if (!$event) {
    fwrite(STDERR, "[FAIL] event 61301267 not found in fixture\n");
    exit(1);
}

$builder = new OddsApiToCrownXml();
$xml = $builder->buildR($event, $oddsJson, 'Bet365', 'zh-cn');

echo "Event: {$event['home']} vs {$event['away']} ({$event['date']})\n";
echo "Generated XML length: " . strlen($xml) . " bytes\n";

// 关键标签覆盖检查
$mustHave = ['<sw_M>Y</sw_M>', '<sw_RE>Y</sw_RE>', '<sw_OU>Y</sw_OU>',
             '<sw_DC>Y</sw_DC>', '<sw_TS>Y</sw_TS>', '<sw_HM>Y</sw_HM>',
             '<sw_HR>Y</sw_HR>', '<sw_HOU>Y</sw_HOU>', '<sw_PD>Y</sw_PD>'];
$missing = [];
foreach ($mustHave as $tag) {
    if (strpos($xml, $tag) === false) $missing[] = $tag;
}
echo "Required tags missing: " . (empty($missing) ? "NONE ✓" : implode(', ', $missing)) . "\n";

// dump 完整 XML 到文件方便人工核查
file_put_contents(__DIR__ . '/generated_r_cn_test.xml', $xml);
echo "Full XML written to .notes/generated_r_cn_test.xml\n";

// 验证 base64+gzdeflate 编解码一致性
$encoded = base64_encode(gzdeflate($xml));
$decoded = gzinflate(base64_decode($encoded));
echo "Encoded length: " . strlen($encoded) . " bytes\n";
echo "Roundtrip OK: " . ($decoded === $xml ? "YES ✓" : "NO ✗") . "\n";

// 摘取波胆赔率行数
preg_match_all('/<ior_H\d+C\d+>([\d\.]+)<\/ior_H\d+C\d+>/', $xml, $m);
echo "Correct Score outcomes: " . count($m[0]) . "\n";
