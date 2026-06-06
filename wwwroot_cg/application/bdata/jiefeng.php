<?php
header('Content-type: text/html;charset=utf-8');
$refreshTime = 3*60;//刷新时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once "include/config.php";
global $db_c, $db_s, $webdb, $curlTypes;

do {
    print_r("============解封检查[START]============\n");
    $is = "NO";
    $tmem = Constant::S_CONFIG;
    $rs = $db_s->select("SELECT * FROM {$tmem}","Row");
    $f = unserialize($rs["front"]);
    $a = unserialize($rs["after"]);
    $tf = new TransformAG();
    $tf->randUser();
    foreach($f as $k => $v){//前
        if(strpos($v["status"],"101")!==false){
            $is = "OK";

            $re = json_decode($tf->longerr_Edit($v["mid"]),true);
            if(isset($re["status"]) && $re["status"]!="error"){
                print_r("账号:{$v["user"]} 解封成功!\n");
            }else{
                print_r("账号:{$v["user"]} 解封失败![{$re["msg"]}]\n");
            }
        }
    }

    foreach($a as $k => $v){//后
        if(strpos($v["status"],"101")!==false){
            $is = "OK";
            $tf = new TransformAG();
            $tf->randUser();
            $re = json_decode($tf->longerr_Edit($v["mid"]),true);
            print_r("账号:{$v["user"]} {$re["msg"]}\n");

        }
    }
    if($is=="NO"){
        print_r("暂无需要解封的账号\n");
    }
    print_r("============解封检查[ END ]============\n\n");
    sleep($refreshTime);

} while (true);

