<?php
header("Content-type: text/html; charset=utf-8");
define('ROOT_PATH', dirname(dirname(dirname(dirname(__FILE__)))));
define('INCLUDE_DIR',__DIR__);
if (!defined('ROOT_PATH')) exit('invalid request');
$app_contorller =  "member";
define('VENDOR',ROOT_PATH."/vendor");//vendor 文件夹
include_once VENDOR."/member.config.php";

global $db_c;
global $db_s;
$langx = "zh-cn";
$ls = "cn";
$coo = $_COOKIE;
if(isset($_REQUEST['langx'])){
    $langx = $_REQUEST["langx"];
}else{
    if(isset($coo["chg_langx"])){
        $langx = $coo["chg_langx"];
    }
}
$_POST["langx"] = $langx;
//$langx = "en-us";


//会员绑定IP
$uid=isset($_REQUEST['uid']) ? $_REQUEST['uid'] : "";
if(!empty($uid)){
    $memTable = Constant::T_MEMBER;
    $memRow = $db_c->select("SELECT `setip`,`seturl` FROM {$memTable} WHERE `uid`='{$uid}'","Row");
    if($memRow){
        $setip = $memRow['setip'];
        $seturl = $memRow['seturl'];

        if(preg_match("/(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])/s",$setip)){
            $_SERVER['REMOTE_ADDR']=$setip;
        }

        if(preg_match("/(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/s",$seturl)){
            $_SERVER['HTTP_HOST']=$seturl;
        }
    }
}

