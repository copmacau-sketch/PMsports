<?php
require_once '/tmp/wwwroot_F5PEa/vendor/common/OddsApiToCrownXml.php';
$oddsJson = json_decode(file_get_contents('/tmp/notes/fixture_odds_61301267.json'), true);
$eventsJson = json_decode(file_get_contents('/tmp/notes/fixture_events_epl.json'), true);
$event = null;
foreach ($eventsJson as $e) { if ((int)$e['id'] === 61301267) { $event = $e; break; } }
if (!$event) { fwrite(STDERR, "[FAIL] event not found\n"); exit(1); }
$builder = new OddsApiToCrownXml();
$xml = $builder->buildR($event, $oddsJson, 'Bet365', 'zh-cn');
echo 'Event: ' . $event['home'] . ' vs ' . $event['away'] . PHP_EOL;
echo 'XML length: ' . strlen($xml) . ' bytes' . PHP_EOL;
$tags = ['<sw_M>Y</sw_M>','<sw_RE>Y</sw_RE>','<sw_OU>Y</sw_OU>','<sw_DC>Y</sw_DC>',
         '<sw_TS>Y</sw_TS>','<sw_HM>Y</sw_HM>','<sw_HR>Y</sw_HR>','<sw_HOU>Y</sw_HOU>',
         '<sw_PD>Y</sw_PD>','<sw_HTS>Y</sw_HTS>','<sw_W3>Y</sw_W3>','<sw_BH>Y</sw_BH>'];
$missing = [];
foreach ($tags as $t) if (strpos($xml, $t) === false) $missing[] = $t;
echo 'Missing: ' . (empty($missing) ? 'NONE OK' : implode(',', $missing)) . PHP_EOL;
file_put_contents('/tmp/notes/generated_r_cn.xml', $xml);
$enc = base64_encode(gzdeflate($xml));
$dec = gzinflate(base64_decode($enc));
echo 'Encoded len: ' . strlen($enc) . PHP_EOL;
echo 'Roundtrip: ' . ($dec === $xml ? 'OK' : 'FAIL') . PHP_EOL;
preg_match_all('/<ior_H\d+C\d+>/', $xml, $m);
echo 'CorrectScore outcomes: ' . count($m[0]) . PHP_EOL;
