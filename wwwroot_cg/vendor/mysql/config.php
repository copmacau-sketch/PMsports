<?php
include_once "mysql.class.php";
$db_user = 'root';
$db_pwd = '49f0863e9070';

//用户库
$database_c =  'db_client';
unset($db_client);
$db_c =  DB::getInstance('127.0.0.1',$db_user,$db_pwd,'utf8',$database_c);

//赛事库
unset($db_markets);
$database_s =  'db_markets';
$db_s =  DB::getInstance('127.0.0.1',$db_user,$db_pwd,'utf8',$database_s);

