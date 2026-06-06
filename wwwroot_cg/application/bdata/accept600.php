<?php
header('Content-type: text/html;charset=utf-8');
$refreshTime = 600;//刷新时间
$refreshTime_err = 60;
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once "include/config.php";
global $db_c,$db_s,$webdb,$curlTypes;
$langx_ary = ["zh-cn"=>"简体","zh-tw"=>"繁体","en-us"=>"英文"];
do{

    $types = $curlTypes["a600"];
    $isErr = false;
    foreach ($types as $k => $v) {
        foreach ($langx_ary as $langx => $langName) {
            $str = setAcceptDataAG($v, $langx);
            if ($str) {
                print_r(utf8_gbk($langName." => ".$v["name"] . $str . "\n"));
                sleep(1);
            } else {
                $isErr = true;
            }
        }
    }
    /*$db_c->close();
    $db_s->close();*/
    if($isErr){
        sleep($refreshTime_err);
    }else{
        sleep($refreshTime);
    }

} while(true);
