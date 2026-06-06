<?php
header('Content-type: text/html;charset=utf-8');

$refreshTime = 60;//刷新时间
$refreshTime_err = 10;
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去

include_once "include/config.php";
global $db_c,$db_s,$webdb,$curlTypes;
$types = $curlTypes["s60"];
foreach ($types as $k =>$v){
    print_r(utf8_gbk($v["name"] . "[简体] 数据采集开始...\n"));
    $str = setMatchData($k, $v,"zh-cn","N",60);
    print_r(utf8_gbk($v["name"] . "[简体]" . $str . "\n"));
}
exit;
