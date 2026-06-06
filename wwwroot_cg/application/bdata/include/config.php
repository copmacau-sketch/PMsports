<?php
header("Content-type: text/html; charset=utf-8");
define('ROOT_PATH', dirname(dirname(dirname(dirname(__FILE__)))));
define('INCLUDE_DIR',__DIR__);
if (!defined('ROOT_PATH')) exit('invalid request');
$app_contorller =  "bdata";
define('VIEW',ROOT_PATH."/view/".$app_contorller);//模板文件夹
define('STATICS',ROOT_PATH."/static/".$app_contorller);//static 文件夹
define('VENDOR',ROOT_PATH."/vendor");//vendor 文件夹
include_once VENDOR."/common.php";
include_once "function.php";
