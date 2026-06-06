<?php
header('Content-type: text/html;charset=utf-8');
include_once "include/config.php";
global $db_s,$copy_day,$match_ary,$db_c;
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
do {
    $hi = intval(date("Hi"));
    if ($hi > 0 && $hi < 20) {//每日00:00~00:20
        //清除30天前的注单数据
        $b30 = date("Y-m-d", strtotime("-30 day"));
        $tbet = Constant::T_BET;
        $db_c->delete($tbet, "`m_date`<'{$b30}'");
        $db_c->select("REPAIR TABLE {$tbet}");
        $db_c->select("OPTIMIZE TABLE {$tbet}");

        $tbetp3 = Constant::T_BET_P3;
        $db_c->delete($tbetp3, "`m_date`<'{$b30}'");
        $db_c->select("REPAIR TABLE {$tbetp3}");
        $db_c->select("OPTIMIZE TABLE {$tbetp3}");

        //清除7天前日志
        $record_table = [Constant::T_MEMBER_RECORD, Constant::T_MEMBER_LOGIN_LOG, Constant::T_RANK_RECORD, Constant::T_RANK_LOGIN_LOG, Constant::T_ADMIN_RECORD, Constant::T_ADMIN_LOGIN_LOG];
        $where = "`logintime`<" . strtotime(date("Y-m-d", strtotime("-7 day")));
        foreach ($record_table as $t) {
            $db_c->delete($t, $where);
            $db_c->select("REPAIR TABLE {$t}");
            $db_c->select("OPTIMIZE TABLE {$t}");
        }

        //删除N天前的xml数据
        foreach ($match_ary as $k => $v) {
            $start = date("Y-m-d", strtotime("-{$copy_day} day"));
            $table = $v["table_xml"];
            print_r("{$v["name"]} => [清除{$start}]前赛事XML数据 开始\n");
            $del = "DELETE `x` FROM {$table} AS `x` LEFT JOIN {$v["table"]} AS `f` ON `x`.`gid`=`f`.`gid` WHERE `f`.`m_date`<'{$start}'";
            $db_s->execSql($del);
            $db_s->select("REPAIR TABLE {$table}");
            $db_s->select("OPTIMIZE TABLE {$table}");
            print_r("{$v["name"]} => [清除{$start}]赛事XML数据 结束\n\n");
            sleep(3);
        }
    }
    sleep(60);
} while(true);
