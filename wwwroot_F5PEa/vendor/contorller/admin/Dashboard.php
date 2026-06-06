<?php
/**
 * 后台仪表盘类
 */
class Dashboard extends Base
{
    public function __construct($_p = [])
    {
        parent::__construct($_p);
    }

    /**
     * 首界面仪表盘
     * @param $userArr
     * @param string $login_layer
     * @return array|false|string[]
     */
    public function mainDashboard($login_layer=""){
        if(empty($login_layer)){
            $login_layer = $this->login_layer;
        }

        $layer = $login_layer;
        $nid = $this->sup["nid"];
        $id = $this->sup["id"];
        //$time = msectime();
        $arr = self::sum_amounts($layer,"tp",$nid);//本期新增各层级数
        //$time1 = msectime() - $time;
       // print_r($time1."ms===");
        $enables = self::sum_enables($layer,"all",false,$nid);
        //$time1 = msectime() - $time;
        //print_r($time1."ms===");
        $arr = array_merge($arr,$enables);
        if($login_layer == Constant::AD || $login_layer == Constant::ADS){
            $arr = array_merge($arr,self::sum_matchs(),self::sum_bets($nid));//赛程概要 注单状态
            //$time1 = msectime() - $time;
            //print_r($time1."ms");
        }else{
            $arr["dashboard_chart"] = "Y";

            $arr["this_period"] = [
                "show" => "Y",
                "this_period" => "",//2022/09/05 - 2022/10/02
                "remaining_days" => 30,
                "completed_days" => 0
            ];
            $tp = date_between("tp");
            $tp_start = strtotime(date("Y-m-d",strtotime($tp["start"])));
            $tp_end = strtotime(date("Y-m-d",strtotime($tp["end"])));
            $arr["this_period"]["this_period"] = date("Y/m/d",$tp_start)." - ".date("Y/m/d",$tp_end);
            $arr["this_period"]["remaining_days"] = round(abs($tp_end-strtotime(date("Y-m-d")))/86400)+1;
            $arr["this_period"]["completed_days"] = round(abs(strtotime(date("Y-m-d"))-$tp_start)/86400) ;

            $lv_maxredit = $this->sup["credit"] - $this->usedCredit($this->login_layer,$this->sup["nid"]);
            if($lv_maxredit<0){
                $lv_maxredit = 0;
            }
            $arr["lastdate"] = empty($this->user["pwddate"]) ? "-" : date("Y-m-d",$this->user["pwddate"]);
            $arr["logindate"]= date("Y-m-d H:i:s",$this->user["logindate"]);
            $arr["now_maxcredit"] = $this->sup["credit"];
            $arr["lv_maxcredit"] = $lv_maxredit;
        }
        return $arr;
    }

    /**
     * 下级账号的状态统计
     * @param string $layer 层级
     * @param string $type 查询类型
     * @param false $isCredit 是否查询额度
     * @param $nid 账号nid编码
     * @return array
     */
    public static function sum_enables($layer="ads",$type="all",$isCredit=false,$nid=""){
        global $db_c,$tables;
        $field = "SUM(IF(`status`=1,1,0))  AS `Y`,SUM(IF(`status`=2,1,0)) AS `N`,SUM(IF(`status`=3,1,0)) AS `pri_Y`,SUM(IF(`status`=4,1,0)) AS `pri_N`";
        if($layer != Constant::ADS && $isCredit){
            $field .= ",SUM(IF(`status`=1,`credit`,0))  AS `Y_Credit`,SUM(IF(`status`=2,`credit`,0)) AS `N_Credit`,SUM(IF(`status`=3,`credit`,0)) AS `pri_Y_Credit`,SUM(IF(`status`=4,`credit`,0)) AS `pri_N_Credit`";
        }
        $where = "`nid` LIKE '{$nid}_%' AND `isMaster`=0";
        $arr = [];

        if($type == "all"){
            switch ($layer){
                case Constant::ADS:
                    $rs = $db_c->select("SELECT {$field} FROM {$tables[Constant::AD]["t"]} WHERE {$where} AND `level`=1","Row");
                    $arr["ad_enable_N"] = empty($rs["N"]) ? "0" : $rs["N"];//公司:停用
                    $arr["ad_enable_Y"] = empty($rs["Y"]) ? "0" : $rs["Y"];//公司:启用
                    $arr["ad_pri_N"] = empty($rs["pri_N"]) ? "0" : $rs["pri_N"];//公司:禁止登入
                    $arr["ad_pri_Y"] = empty($rs["pri_Y"]) ? "0" : $rs["pri_Y"];//公司:只能看账
                case Constant::AD:
                    $rs = $db_c->select("SELECT {$field} FROM {$tables[Constant::D0]["t"]} WHERE {$where} AND `level`=4","Row");
                    $arr["d0_enable_N"] = empty($rs["N"]) ? "0" : $rs["N"];//登0:停用
                    $arr["d0_enable_Y"] = empty($rs["Y"]) ? "0" : $rs["Y"];//登0:启用
                    $arr["d0_pri_N"] = empty($rs["pri_N"]) ? "0" : $rs["pri_N"];//登0:禁止登入
                    $arr["d0_pri_Y"] = empty($rs["pri_Y"]) ? "0" : $rs["pri_Y"];//登0:只能看账
                    if($isCredit){
                        $arr["d0_enable_N_credit"] = empty($rs["N_Credit"]) ? "0" : $rs["N_Credit"];//登0:停用
                        $arr["d0_enable_Y_credit"] = empty($rs["Y_Credit"]) ? "0" : $rs["Y_Credit"];//登0:启用
                        $arr["d0_pri_N_credit"] = empty($rs["pri_N_Credit"]) ? "0" : $rs["pri_N_Credit"];//登0:禁止登入
                        $arr["d0_pri_Y_credit"] = empty($rs["pri_Y_Credit"]) ? "0" : $rs["pri_Y_Credit"];//登0:只能看账
                    }
                case Constant::D0:
                    $rs = $db_c->select("SELECT {$field} FROM {$tables[Constant::CO]["t"]} WHERE {$where} AND `level`=3","Row");
                    $arr["co_enable_N"] = empty($rs["N"]) ? "0" : $rs["N"];//登0:停用
                    $arr["co_enable_Y"] = empty($rs["Y"]) ? "0" : $rs["Y"];//登0:启用
                    $arr["co_pri_N"] = empty($rs["pri_N"]) ? "0" : $rs["pri_N"];//登0:禁止登入
                    $arr["co_pri_Y"] = empty($rs["pri_Y"]) ? "0" : $rs["pri_Y"];//登0:只能看账
                    if($isCredit){
                        $arr["co_enable_N_credit"] = empty($rs["N_Credit"]) ? "0" : $rs["N_Credit"];//登0:停用
                        $arr["co_enable_Y_credit"] = empty($rs["Y_Credit"]) ? "0" : $rs["Y_Credit"];//登0:启用
                        $arr["co_pri_N_credit"] = empty($rs["pri_N_Credit"]) ? "0" : $rs["pri_N_Credit"];//登0:禁止登入
                        $arr["co_pri_Y_credit"] = empty($rs["pri_Y_Credit"]) ? "0" : $rs["pri_Y_Credit"];//登0:只能看账
                    }
                case Constant::CO:
                    $rs = $db_c->select("SELECT {$field} FROM {$tables[Constant::SU]["t"]} WHERE {$where} AND `level`=2","Row");
                    $arr["su_enable_N"] = empty($rs["N"]) ? "0" : $rs["N"];//登0:停用
                    $arr["su_enable_Y"] = empty($rs["Y"]) ? "0" : $rs["Y"];//登0:启用
                    $arr["su_pri_N"] = empty($rs["pri_N"]) ? "0" : $rs["pri_N"];//登0:禁止登入
                    $arr["su_pri_Y"] = empty($rs["pri_Y"]) ? "0" : $rs["pri_Y"];//登0:只能看账
                    if($isCredit){
                        $arr["su_enable_N_credit"] = empty($rs["N_Credit"]) ? "0" : $rs["N_Credit"];//登0:停用
                        $arr["su_enable_Y_credit"] = empty($rs["Y_Credit"]) ? "0" : $rs["Y_Credit"];//登0:启用
                        $arr["su_pri_N_credit"] = empty($rs["pri_N_Credit"]) ? "0" : $rs["pri_N_Credit"];//登0:禁止登入
                        $arr["su_pri_Y_credit"] = empty($rs["pri_Y_Credit"]) ? "0" : $rs["pri_Y_Credit"];//登0:只能看账
                    }
                case Constant::SU:
                    $rs = $db_c->select("SELECT {$field} FROM {$tables[Constant::AG]["t"]} WHERE {$where} AND `level`=1","Row");
                    $arr["a_enable_N"] = empty($rs["N"]) ? "0" : $rs["N"];//登0:停用
                    $arr["a_enable_Y"] = empty($rs["Y"]) ? "0" : $rs["Y"];//登0:启用
                    $arr["a_pri_N"] = empty($rs["pri_N"]) ? "0" : $rs["pri_N"];//登0:禁止登入
                    $arr["a_pri_Y"] = empty($rs["pri_Y"]) ? "0" : $rs["pri_Y"];//登0:只能看账
                    if($isCredit){
                        $arr["a_enable_N_credit"] = empty($rs["N_Credit"]) ? "0" : $rs["N_Credit"];//登0:停用
                        $arr["a_enable_Y_credit"] = empty($rs["Y_Credit"]) ? "0" : $rs["Y_Credit"];//登0:启用
                        $arr["a_pri_N_credit"] = empty($rs["pri_N_Credit"]) ? "0" : $rs["pri_N_Credit"];//登0:禁止登入
                        $arr["a_pri_Y_credit"] = empty($rs["pri_Y_Credit"]) ? "0" : $rs["pri_Y_Credit"];//登0:只能看账
                    }
                case Constant::AG:
                    $rs = $db_c->select("SELECT {$field} FROM {$tables[Constant::MEM]["t"]} WHERE `nid` LIKE '{$nid}_%'","Row");
                    $arr["m_enable_N"] = empty($rs["N"]) ? "0" : $rs["N"];//登0:停用
                    $arr["m_enable_Y"] = empty($rs["Y"]) ? "0" : $rs["Y"];//登0:启用
                    $arr["m_pri_N"] = empty($rs["pri_N"]) ? "0" : $rs["pri_N"];//登0:禁止登入
                    $arr["m_pri_Y"] = empty($rs["pri_Y"]) ? "0" : $rs["pri_Y"];//登0:只能看账
                    if($isCredit){
                        $arr["m_enable_N_credit"] = empty($rs["N_Credit"]) ? "0" : $rs["N_Credit"];//登0:停用
                        $arr["m_enable_Y_credit"] = empty($rs["Y_Credit"]) ? "0" : $rs["Y_Credit"];//登0:启用
                        $arr["m_pri_N_credit"] = empty($rs["pri_N_Credit"]) ? "0" : $rs["pri_N_Credit"];//登0:禁止登入
                        $arr["m_pri_Y_credit"] = empty($rs["pri_Y_Credit"]) ? "0" : $rs["pri_Y_Credit"];//登0:只能看账
                    }
            }
        }else{
            $table = $tables[Constant::MEM]["t"];
            switch ($layer){
                case Constant::AD:
                    $table = $tables[Constant::AD]["t"];
                    $where .= " AND `level`=1";
                    break;
                case Constant::D0:
                    $table = $tables[Constant::D0]["t"];
                    $where .= " AND `level`=4";
                    break;
                case Constant::CO:
                    $table = $tables[Constant::CO]["t"];
                    $where .= " AND `level`=3";
                    break;
                case Constant::SU:
                    $table = $tables[Constant::SU]["t"];
                    $where .= " AND `level`=2";
                    break;
                case Constant::AG:
                    $table = $tables[Constant::AG]["t"];
                    $where .= " AND `level`=1";
                    break;
                case Constant::MEM:
                    $where = "`nid` LIKE '{$nid}_%'";
                    break;
            }

            $rs = $rs = $db_c->select("SELECT {$field} FROM {$table} WHERE {$where}","Row");
            $arr["under_enable_N"] = empty($rs["N"]) ? "0" : $rs["N"];//停用
            $arr["under_enable_Y"] = empty($rs["Y"]) ? "0" : $rs["Y"];//启用
            $arr["under_pri_N"] = empty($rs["pri_N"]) ? "0" : $rs["pri_N"];//禁止登入
            $arr["under_pri_Y"] = empty($rs["pri_Y"]) ? "0" : $rs["pri_Y"];//只能看账
            if($isCredit){
                $arr["under_enable_N_credit"] = empty($rs["N_Credit"]) ? 0 : $rs["N_Credit"];//停用
                $arr["under_enable_Y_credit"] = empty($rs["Y_Credit"]) ? 0 : $rs["Y_Credit"];//启用
                $arr["under_pri_N_credit"] = empty($rs["pri_N_Credit"]) ? 0 : $rs["pri_N_Credit"];//禁止登入
                $arr["under_pri_Y_credit"] = empty($rs["pri_Y_Credit"]) ? 0 : $rs["pri_Y_Credit"];//只能看账
            }

        }
        return $arr;
    }

    /**
     * 区间日期内 新增各级人数
     * @param string $layer 层级
     * @param string $date_type 日期区间
     * @param $nid nid编码
     * @return array
     */
    public static function sum_amounts($layer="ads",$date_type="tp",$nid=""){
        global $tables,$db_c;
        $between = date_between($date_type);//本期日期
        $start = strtotime($between["start"]);
        $end = strtotime($between["end"]);
        $where = "`nid` LIKE '{$nid}%' AND `isMaster`=0 AND `adddate` BETWEEN '{$start}' AND '{$end}'";
        $data = [];
        $id = "`id`";
        $filed = "`isMaster` AS `master`";
        switch ($layer){
            case Constant::ADS://超管
                $table = $tables[Constant::AD]["t"];
                $where1 = $where." AND `level`=1";
                $data["amount_ad"] = strval($db_c->getCount($table,$id,$where1));
                if(empty($data["amount_ad"])) $data["amount_ad"] = "0";
            case Constant::AD://公司
                /*$where2 = $where." AND `level`=4";
                $table = $tables[Constant::D0]["t"];
                $data["amount_d0"] = strval($db_c->getCount($table,$id,$where2));*/
                $filed.= ",SUM(IF(`level`=4,1,0)) AS `amount_d0`";
                $data["amount_d0"] = 0;
            case Constant::D0:
                /*$where3 = $where." AND `level`=3";
                $table = $tables[Constant::CO]["t"];
                $data["amount_co"] = strval($db_c->getCount($table,$id,$where3));*/
                $filed.= ",SUM(IF(`level`=3,1,0)) AS `amount_co`";
                $data["amount_co"] = 0;
            case Constant::CO:
                /*$where4 = $where." AND `level`=2";
                $table = $tables[Constant::SU]["t"];
                $data["amount_su"] = strval($db_c->getCount($table,$id,$where4));*/
                $filed.= ",SUM(IF(`level`=2,1,0)) AS `amount_su`";
                $data["amount_su"] = 0;
            case Constant::SU:
                /*$where5 = $where." AND `level`=1";
                $table = $tables[Constant::AG]["t"];
                $data["amount_ag"] = strval($db_c->getCount($table,$id,$where5));*/
                $filed.= ",SUM(IF(`level`=1,1,0)) AS `amount_ag`";
                $data["amount_ag"] = 0;
                //print_r("SELECT {$filed} FROM".Constant::T_RANK." WHERE {$where}");exit;
                $rs = $db_c->select("SELECT {$filed} FROM".Constant::T_RANK." WHERE {$where}","Row");
                if($rs){
                    if(isset($rs["amount_d0"])){$data["amount_d0"] = empty($rs["amount_d0"]) ? 0 : $rs["amount_d0"];}
                    if(isset($rs["amount_co"])){$data["amount_co"] = empty($rs["amount_co"]) ? 0 : $rs["amount_co"];}
                    if(isset($rs["amount_su"])){$data["amount_su"] = empty($rs["amount_su"]) ? 0 : $rs["amount_su"];}
                    if(isset($rs["amount_ag"])){$data["amount_ag"] = empty($rs["amount_ag"]) ? 0 : $rs["amount_ag"];}
                }

            case Constant::AG:
                $table = $tables[Constant::MEM]["t"];
                $where = "`nid` LIKE '{$nid}_%' AND `adddate` BETWEEN '{$start}' AND '{$end}'";
                $data["amount_mem"] = strval($db_c->getCount($table,$id,$where));
                //if(empty($data["amount_mem"])) $data["amount_mem"] = "0";
        }

        return $data;
    }

    /**
     * 注单状态查询
     * @param $nid
     * @return mixed
     */
    public static function sum_bets($nid){
        global $sport_tables,$db_s;
        $arr["bets"] = [];
        $arr["bets_yes"] = [];
        $to = date_between("today");//今日
        $to_start = strtotime($to["start"]);
        $to_end = strtotime($to["end"]);
        $yes =  date_between("yes");//昨日
        $yes_start = strtotime($yes["start"]);
        $yes_end = strtotime($yes["end"]);
        $bettable = Constant::T_BET;
        foreach ($sport_tables as $k => $v){
            $gtype = gtypeOrName($v["name"],"N");
            $green = $db_s->select("SELECT COUNT(`ID`) AS `cou`,SUM(`bet_golds`) AS `money` FROM {$bettable} WHERE `bet_time` BETWEEN '{$to_start}' AND '{$to_end}' AND `nid` LIKE '{$nid}_%' AND `isResult`=1 AND `gtype`='{$gtype}'","Row");
            $red = $db_s->select("SELECT COUNT(`ID`) AS `cou`,SUM(`bet_golds`) AS `money` FROM {$bettable} WHERE `bet_time` BETWEEN '{$to_start}' AND '{$to_end}' AND `nid` LIKE '{$nid}_%' AND `isResult`=0 AND `gtype`='{$gtype}'","Row");

            $arr["bets"][$k]["num"]["green"] = empty($green["cou"]) ? 0 : $green["cou"];
            $arr["bets"][$k]["num"]["red"] = empty($red["cou"]) ? 0 : $red["cou"];

            $arr["bets"][$k]["money"]["green"] = empty($green["money"]) ? 0 : $green["money"];
            $arr["bets"][$k]["money"]["red"] = empty($red["money"]) ? 0 :$red["money"];

            $yes_green = $db_s->select("SELECT COUNT(`ID`) AS `cou`,SUM(`bet_golds`) AS `money` FROM {$bettable} WHERE `bet_time` BETWEEN '{$yes_start}' AND '{$yes_end}' AND `nid` LIKE '{$nid}_%' AND `isResult`=1 AND `gtype`='{$gtype}'","Row");
            $yes_red = $db_s->select("SELECT COUNT(`ID`) AS `cou`,SUM(`bet_golds`) AS `money` FROM {$bettable} WHERE `bet_time` BETWEEN '{$yes_start}' AND '{$yes_end}' AND `nid` LIKE '{$nid}_%' AND `isResult`=0 AND `gtype`='{$gtype}'","Row");
            $arr["bets_yes"][$k]["num"]["green"] = empty($yes_green["cou"]) ? 0 :$yes_green["cou"];
            $arr["bets_yes"][$k]["num"]["red"] = empty($yes_red["cou"]) ? 0 :$yes_red["cou"];

            $arr["bets_yes"][$k]["money"]["green"] = empty($yes_green["money"]) ? 0 :$yes_green["money"];
            $arr["bets_yes"][$k]["money"]["red"] = empty($yes_red["money"]) ? 0 :$yes_red["money"];
        }

        return $arr;
    }

    /**
     * 赛程概要
     * @return mixed
     */
    public static function sum_matchs(){
        global $sport_tables,$db_s;
        $arr["matchs"] = [];
        $arr["matchs_yes"] = [];
        $arr["game_over_yn"] = [];
        $to = date_between("today");//今日
        $today_date = date("Y-m-d", strtotime($to["start"]));
        $yes =  date_between("yes");//昨日
        $yes_date = date("Y-m-d", strtotime($yes["start"]));
        $gid = "`gid`";
        foreach ($sport_tables as $k => $v) {
            $time = time();
            $matchTable = $v["table"];
            if($k=="FS"){
                $arr["game_over_yn"][$k]["to"]["RESULT_N"] = $arr["matchs"][$k]["red"] = 0;
                $arr["game_over_yn"][$k]["to"]["RESULT_Y"] = $arr["matchs"][$k]["green"] = 0;
                $arr["game_over_yn"][$k]["yes"]["RESULT_N"] = $arr["matchs_yes"][$k]["red"] = 0;
                $arr["game_over_yn"][$k]["yes"]["RESULT_Y"] = $arr["matchs_yes"][$k]["green"] = 0;
            }else{
                $sql = "SELECT SUM(IF(`is_inball`=0,1,0)) AS `red`,SUM(IF(`is_inball`=1,1,0)) AS `green` FROM {$matchTable} WHERE ";

                $sql_today = "{$sql} `m_date` = '{$today_date}'";
                $rs = $db_s->select($sql_today,"Row");
                $arr["game_over_yn"][$k]["to"]["RESULT_N"] = $arr["matchs"][$k]["red"] = !empty($rs["red"]) ? (int)$rs["red"] : 0;
                $arr["game_over_yn"][$k]["to"]["RESULT_Y"] = $arr["matchs"][$k]["green"] = !empty($rs["green"]) ? (int)$rs["green"] : 0;

                $sql_yes = "{$sql} `m_date` = '{$yes_date}'";
                $rs1 = $db_s->select($sql_yes,"Row");
                
                $arr["game_over_yn"][$k]["yes"]["RESULT_N"] = $arr["matchs_yes"][$k]["red"] = !empty($rs1["red"]) ? (int)$rs1["red"] : 0;
                $arr["game_over_yn"][$k]["yes"]["RESULT_Y"] = $arr["matchs_yes"][$k]["green"] = !empty($rs1["green"]) ? (int)$rs1["green"] : 0;
            }
        }

        return $arr;
    }
}