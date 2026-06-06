<?php
// 覆盖 wwwroot_F5PEa/vendor/mysql/config.php
// 通过 docker-compose 的 bind mount 注入到容器，原始源码不修改
include_once "mysql.class.php";

$db_host = getenv('DB_HOST') ?: 'mysql';
$db_user = getenv('DB_USER') ?: 'root';
$db_pwd  = getenv('DB_PASS') ?: '49f0863e9070';

// 用户库
$database_c = getenv('DB_NAME_CLIENT') ?: 'db_client';
unset($db_client);
$db_c = DB::getInstance($db_host, $db_user, $db_pwd, 'utf8', $database_c);

// 赛事库
unset($db_sports);
$database_s = getenv('DB_NAME_SPORTS') ?: 'db_sports';
$db_s = DB::getInstance($db_host, $db_user, $db_pwd, 'utf8', $database_s);
