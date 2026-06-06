<?php
header('Content-type: text/html;charset=utf-8');
$refreshTime = 180;//刷新时间
$refreshTime_one = 5;//单次刷新间隔时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once "include/config.php";
global $db_c,$db_s,$webdb,$curlTypes,$gtypes;
do{
    foreach ($gtypes as $k =>$v){
        if(strtoupper($v) != "FS") {
            print_r(utf8_gbk($v . "[英文] 冠军采集开始...\n"));
            $str = setFSMatchData($k, "en-us");
            print_r(utf8_gbk($v . "[英文]" . $str . "\n"));
        }

    }
    sleep($refreshTime);

} while(true);
