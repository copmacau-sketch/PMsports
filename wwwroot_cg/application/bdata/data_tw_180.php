<?php
header('Content-type: text/html;charset=utf-8');
$refreshTime = 180;//刷新时间
$refreshTime_one = 5;//单次刷新间隔时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once "include/config.php";
global $db_c,$db_s,$webdb,$curlTypes;
$types = $curlTypes["s180"];
do{

    $str = messageget();
    print_r(utf8_gbk("{$str}\n"));
    $isErr = false;
    $earlyDate = [1,2,3,4,5,6,7,"future"];
    foreach ($earlyDate as $n){
        foreach ($types as $k =>$v){
            $v["date"] = $n;
            if($n == "future"){
                $date = "未来";
            }else{
                $date = date("Y-m-d",strtotime("{$n} day"));
            }
            print_r(utf8_gbk($v["name"] . "[繁体][$date] 数据采集开始...\n"));
            $str = setMatchData($k, $v, "zh-tw","N",180);
            print_r(utf8_gbk($v["name"] . "[繁体][$date]" . $str . "\n"));

        }
        sleep($refreshTime_one);
    }
    /*$db_c->close();
    $db_s->close();*/
    sleep($refreshTime);

} while(true);
