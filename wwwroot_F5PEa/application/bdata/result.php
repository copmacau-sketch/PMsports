<?php
header('Content-type: text/html;charset=utf-8');
$refreshTime = 60;//刷新时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once "include/config.php";
global $db_c, $db_s, $webdb, $curlTypes;
do {
	/*print_r(date("Y-m-d H:i:s"));*/
    $num = 0;
    $time = time();
    print_r(utf8_gbk("注单结算开始....\n"));
    $r = new Result();
    $r->setBetLeagueNull();
    $num = $r->getBet();
    $time = time() - $time;
    print_r(utf8_gbk("共结算{$num}条,用时{$time}秒\n\n"));

    $time = time();
    print_r(utf8_gbk("过关注单结算开始....\n"));
    $r = new Result();
    $r->setBetLeagueNull("P3");
    $num = $r->getBetP3();
    $time = time() - $time;
    print_r(utf8_gbk("共结算{$num}条,用时{$time}秒\n\n"));

    $time = time();
    print_r(utf8_gbk("冠军注单结算开始....\n"));
    $r = new Result();
    $num = $r->getBetFS();
    $time = time() - $time;
    print_r(utf8_gbk("共结算{$num}条,用时{$time}秒\n\n"));
    sleep($refreshTime);
} while (true);