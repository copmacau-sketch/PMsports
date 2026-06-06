<?php
header('Content-type: text/html;charset=utf-8');
$refreshTime = 5;//刷新时间
$refreshTime_err = 3;
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once "include/config.php";
global $db_c, $db_s, $webdb, $curlTypes;
$types = $curlTypes["s5"];
foreach ($types as $k => $v) {
    print_r(utf8_gbk( $v["name"] . "[简体] 数据采集开始...\n"));
    $str = setMatchData($k, $v, "zh-cn", "Y");
    print_r(utf8_gbk( $v["name"] . "[简体]" . $str . "\n"));
    sleep(1);
    print_r(utf8_gbk( $v["name"] . "[繁体] 数据采集开始...\n"));
    $str = setMatchData($k, $v, "zh-tw", "Y");
    print_r(utf8_gbk( $v["name"] . "[繁体]" . $str . "\n"));
    sleep(1);
    print_r(utf8_gbk(  $v["name"] . "[英文] 数据采集开始...\n"));
    $str = setMatchData($k, $v, "en-us", "Y");
    print_r(utf8_gbk( $v["name"] . "[英文]" . $str . "\n"));
    sleep(1);
}
exit;

