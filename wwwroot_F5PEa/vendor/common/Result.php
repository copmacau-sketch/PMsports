<?php


class Result
{
    protected $gtypeAry = [];
    protected $bet_table;
    protected $bet_p3_table;
    protected $dbc;
    protected $dbs;
    protected $ut;
    protected $isHGID = ["FT","BS","OP"];

    public function __construct()
    {
        global $sport_tables,$db_s,$db_c;
        $this->gtypeAry = $sport_tables;
        $this->bet_table = Constant::T_BET;
        $this->bet_p3_table = Constant::T_BET_P3;
        $this->dbc = $db_c;
        $this->dbs = $db_s;
        $this->ut = new Util_game();
    }

    /**
     * 冠军|最先/最后球员进球 结算
     * @param string $where
     * @return int
     */
    public function getBetFS($where=""){
        $num = 0;
        $bet = $this->dbc->select("SELECT * FROM {$this->bet_table} WHERE `isResult`=0 AND `wtype`='FS' {$where}");
        if($bet){
            $sfsTable = Constant::S_SP;
            foreach ($bet as $k => $v){
                $res = $this->dbc->select("SELECT * FROM {$sfsTable} WHERE `result`='Y' AND `gid`='{$v["gid"]}' AND `rtype`='{$v["rtype"]}'","Row");
                if($res){
                    if($res["win"] == "Y"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }

                    $wingold = 0;//输赢金额
                    $valid_gold = 0;//有效金额
                    $cancel = 0;//赛事是否取消
                    $mem_result = 0;//会员退水后输赢金额
                    $mem_win_gold = 0;//会员退水前输赢
                    $agent_result = 0;
                    $ag_result = 0;//代理结果
                    $su_result = 0;//总代结果
                    $co_result = 0;//股东结果
                    $d0_result = 0;//分公司结果

                    $isTurnBetGold = "N";//是否退还本金 Y:需要,N:不需要
                    switch ($sta) {
                        case "W"://赢
                            $wingold = $v["win_gold"];
                            $valid_gold = $wingold;
                            $isTurnBetGold = "Y";
                            break;
                        case "L"://输
                            $wingold = 0 - $v["bet_golds"];
                            $valid_gold = $v["bet_golds"];
                            break;
                    }
                    $mem_win_gold = $wingold;
                    $mem_turn_rate = $valid_gold * floatval($v["mem_turn_rate"]) / 100;//会员退水金额 = 有效金额*会员退水%
                    $mem_result = $wingold + $mem_turn_rate;//会员结果 = 输赢金额 + 会员退水金额
                    //print_r($mem_result);exit;
                    if ($mem_result > 0) { //赢表示还需要退还现金玩家的本金
                        $pay_gold = $v["bet_golds"] + $mem_result;
                    } else {
                        $pay_gold = $mem_turn_rate;
                    }
                    $agent_result = $mem_result + ($v["ag_turn_rate"] - $v["mem_turn_rate"]) * $valid_gold / 100;//上交金额 = 会员结果 + (代理商退水%-会员退水%)*有效金额
                    $ag_result = $agent_result * (100 - $v["ag_point"]) / 100; //代理结果 = 上级输赢 * (100-代理占成%)
                    //总代理结果 = 代理输赢*(100%-代理占成%-总代理占成%) + (总代退水% - 代理退水%)*有效金额
                    $su_result = $agent_result * (100 - $v["ag_point"] - $v["su_point"]) / 100 + ($v["su_turn_rate"] - $v["ag_turn_rate"]) * $valid_gold / 100;
                    //股东结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                    $co_result = $agent_result * (100 - $v["ag_point"] - $v["su_point"] - $v["co_point"]) / 100 + ($v["co_turn_rate"] - $v["su_turn_rate"]) * $valid_gold / 100;
                    //分公司结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                    $d0_result = $agent_result * (100 - $v["ag_point"] - $v["su_point"] - $v["co_point"] - $v["d0_point"]) / 100 + ($v["d0_turn_rate"] - $v["co_turn_rate"]) * $valid_gold / 100;

                    $up = [
                        "valid_gold" => round($valid_gold,4),//有效金额
                        "mem_result" => round($mem_result,4),//会员退水后输赢
                        "mem_win_gold" => round($mem_win_gold,4),//会员退水前输赢
                        "agent_result" => round($agent_result,4),
                        "ag_result" => round($ag_result,4),
                        "su_result" => round($su_result,4),
                        "co_result" => round($co_result,4),
                        "d0_result" => round($d0_result,4),
                        "inball" => "{$res["sfs_id"]}|{$res["sgid"]}",
                        "isResult" => 1,
                        "result" => $sta
                    ];
                    $this->dbc->beginTransaction();
                    try{
                        $this->dbc->update($this->bet_table,$up,"`ID`={$v["ID"]}");
                        if($pay_gold>0 && !empty($sta)){//现金玩家更新金额
                            $memTable = Constant::T_MEMBER;
                            $pay = round($pay_gold,2);
                            $this->set_credit_logs($v["nid"],$pay);
                            $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$pay}),`balance_credit`=(`balance_credit`+{$pay}) WHERE `nid`='{$v["nid"]}' AND `pay_type`=1";
                            $this->dbc->execSql($sql);
                        }
                        $this->dbc->commit();
                    }catch (\Exception $e){
                        $this->dbc->rollback();
                        throw $e;
                    }

                    $num++;
                }
            }
        }

        return $num;
    }

    /**
     * 入库现金额度记录日志
     * @param $nid
     * @param $cash 现金额度
     * @param $old_cash 旧额度
     */
    public function set_credit_logs($nid,$cash){
        $memTable = Constant::T_MEMBER;
        $mem = $this->dbc->select("SELECT * FROM {$memTable} WHERE `nid`='{$nid}' AND `pay_type`=1","Row");
        if($mem) {
            $insert = [
                "nid" => $nid,
                "type" => $cash > 0 ? "Y" : "N",
                "old_cash" => $mem["credit"],
              //  "cash" => $cash,				
              //  "new_cash" => $mem["credit"] + $cash,
			    "cash" => round($cash, 2),  // 只保留小数点后两位  
                "new_cash" => $mem["credit"] + round($cash, 2), 
                "usertype" => "结算",
                "logintime" => time(),
                "s_name" => $mem["name"]
            ];
            $this->dbc->insert(Constant::T_CREDIT_LOG, $insert);
        }
    }

    /**
     * 过关注单
     * @param string $where
     */
    public function getBetP3($where=""){
        $sql_p3 = "SELECT * FROM {$this->bet_table} WHERE `isResult`=0  AND `wtype`='P3' {$where}";
        $bet_p3 = $this->dbc->select($sql_p3);
        $num = 0;
        if($bet_p3) {
            foreach ($bet_p3 as $v){
                $sql = "SELECT `gid`,`gtype` FROM {$this->bet_p3_table} WHERE `isResult`=0 AND `danger` IN (0,3) AND `p3id`='{$v["ID"]}'";
                $bet = $this->dbc->select($sql);
                if($bet) {
                    $this->betResult($bet);
                }
                $num += $this->p3_Result($v);
            }
        }

        return $num;
    }

    /**
     * 过关注单结算入库
     * @param $b
     * @return int
     */
    public function p3_Result($b){
        $num = 0;
        $rs = $this->dbc->select("SELECT * FROM {$this->bet_p3_table} WHERE `p3id`='{$b["ID"]}'");
        if($rs){
            $isResultAll = "ok";
            $isWin = "W";
            $ior = 1;
            foreach ($rs as $v){
                if($v["isResult"] == 1){
                    switch ($v["result"]){
                        case "W":
                            $ior *= $v["ioratio"];
                            break;
                        case "HW":
                            $ior *= 1 + ($v["ioratio"] - 1)*0.5;
                            break;
                        case "L":
                            $isWin = "L";
                            break;
                        case "HL":
                            $ior *= 0.5;
                            break;
                    }

                }else{
                    $isResultAll = "no";
                }
            }

            if($isResultAll=="ok"){
                $this->dbc->beginTransaction();
                try{
                    if($isWin == "W"){
                        $wingold = $b["bet_golds"] * ($ior - 1);
                        $valid_gold = $wingold;
                    }else{
                        $wingold = 0 - $b["bet_golds"];
                        $valid_gold = $b["bet_golds"];
                    }
                    $mem_win_gold = $wingold;
                    //print_r($b["ID"]."--".$valid_gold."--".$b["mem_turn_rate"]);exit;
                    $mem_turn_rate = $valid_gold * floatval($b["mem_turn_rate"]) / 100;//会员退水金额 = 有效金额*会员退水%
                    $mem_result = $wingold + $mem_turn_rate;//会员结果 = 输赢金额 + 会员退水金额
                    if ($mem_result > 0) { //赢表示还需要退还现金玩家的本金
                        $pay_gold = $b["bet_golds"] + $mem_result;
                    } else {
                        $pay_gold = $mem_turn_rate;
                    }

                    $agent_result = $mem_result + ($b["ag_turn_rate"] - $b["mem_turn_rate"]) * $valid_gold / 100;//上交金额 = 会员结果 + (代理商退水%-会员退水%)*有效金额
                    $ag_result = $agent_result * (100 - $b["ag_point"]) / 100; //代理结果 = 上级输赢 * (100-代理占成%)
                    //总代理结果 = 代理输赢*(100%-代理占成%-总代理占成%) + (总代退水% - 代理退水%)*有效金额
                    $su_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"]) / 100 + ($b["su_turn_rate"] - $b["ag_turn_rate"]) * $valid_gold / 100;
                    //股东结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                    $co_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"] - $b["co_point"]) / 100 + ($b["co_turn_rate"] - $b["su_turn_rate"]) * $valid_gold / 100;
                    //分公司结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                    $d0_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"] - $b["co_point"] - $b["d0_point"]) / 100 + ($b["d0_turn_rate"] - $b["co_turn_rate"]) * $valid_gold / 100;
                    $up = [
                        "valid_gold" => round($valid_gold,4),//有效金额
                        "mem_result" => round($mem_result,4),//会员退水后输赢
                        "mem_win_gold" => round($mem_win_gold,4),//会员退水前输赢
                        "agent_result" => round($agent_result,4),
                        "ag_result" => round($ag_result,4),
                        "su_result" => round($su_result,4),
                        "co_result" => round($co_result,4),
                        "d0_result" => round($d0_result,4),
                        "isResult" => 1,
                        "result" => $isWin=="W" ? "W" : "L"
                    ];
                     $this->dbc->update($this->bet_table,$up,"`ID`={$b["ID"]}");
                  
                            $memTable = Constant::T_MEMBER;
                            
                                if($pay_gold>0){ //现金玩家更新金额
                                    $pay = round($pay_gold,2);
                                    $this->set_credit_logs($b["nid"],$pay);
                                    $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$pay}),`balance_credit`=(`balance_credit`+{$pay}) WHERE `nid`='{$b["nid"]}' AND `pay_type`=1";
                                    $this->dbc->execSql($sql);
                                }
							
                    $this->dbc->commit();
                    $num = 1;
                }catch (\Exception $e){
                    print_r($e->getMessage());
                    print_r("\n");
                    $this->dbc->rollback();
                }

            }

        }

        return $num;
    }

    /**
     * 检测注单中存在队名为空，并且补上
     * @param string $betTableType
     */
    public function setBetLeagueNull($betTableType=""){
        $betTable = $this->bet_table;
        if(strtoupper($betTableType) == "P3"){
            $betTable = $this->bet_p3_table;
        }
        $where = "`league` IS NULL OR `league_tw` IS NULL OR `league_en` IS NULL OR `league`='' OR `league_tw`='' OR `league_en`=''";
        $sql = "SELECT `gid`,`gtype` FROM {$betTable} WHERE {$where} GROUP BY `gid`";
        $stmt = $this->dbc->select($sql);
        if($stmt){

            foreach ($stmt as $v){
                $gtype = strtoupper($v["gtype"]);
                $gid = $v["gid"];
                $table = $this->gtypeAry[$gtype]["table"];
                $m = $this->dbc->select("SELECT * FROM {$table} WHERE `gid`='{$gid}'","Row");
                if(!$m && in_array($gtype,$this->isHGID)) { //存在上半gid
                    $m = $this->dbc->select("SELECT * FROM {$table} WHERE `hgid`='{$gid}'","Row");
                }

                if($m){
                    $up = [
                        "league" => $m["league"],
                        "league_tw" => $m["league_tw"],
                        "league_en" => $m["league_en"],
                        "team_h" => $m["team_h"],
                        "team_c" => $m["team_c"],
                        "team_h_tw" => $m["team_h_tw"],
                        "team_c_tw" => $m["team_c_tw"],
                        "team_h_en" => $m["team_h_en"],
                        "team_c_en" => $m["team_c_en"],
                        "ptype" => $m["ptype"],
                        "ptype_tw" => $m["ptype_tw"],
                        "ptype_en" => $m["ptype_en"],
                        "ptype_id" => $m["ptype_id"],
                    ];

                    $this->dbc->update($betTable,$up,"`gid`='{$gid}'");
                }
            }
        }
    }

    /**
     * 普通注单结算
     * @param string $where
     * @return int
     */
    public function getBet($where=""){
        $sql = "SELECT `gid`,`gtype` FROM {$this->bet_table} WHERE `isResult`=0 AND `danger` IN (0,3) AND `wtype`<>'P3' {$where}";//未结算且已经确认的滚球
        $bet = $this->dbc->select($sql);
        $num = 0;
        if($bet) {
            $num = $this->betResult($bet);
        }

        //未通过的滚球注单结算
        $sql = "SELECT `ID`,`bet_golds`,`nid` FROM {$this->bet_table} WHERE `isResult`=0 AND `danger`=2 AND `wtype`<>'P3'";
        $bet3 = $this->dbc->select($sql);

        if($bet3){
            foreach ($bet3 as $v){
                $this->dbc->beginTransaction();
                try{
                    $up = [
                        //"status" => $m["status"],
                        "valid_gold" => 0,//有效金额
                        "mem_result" => 0,//会员退水后输赢
                        "mem_win_gold" => 0,//会员退水前输赢
                        "agent_result" => 0,
                        "ag_result" => 0,
                        "su_result" => 0,
                        "co_result" => 0,
                        "d0_result" => 0,
                        "status" => 12,//取消注单
                        "cancel" => 1,
                        "isResult" => 1,
                        "result" => "T"
                    ];
                    $this->dbc->update($this->bet_table,$up,"`ID`={$v["ID"]}");
                    $memTable = Constant::T_MEMBER;
                    $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$v["bet_golds"]}),`balance_credit`=(`balance_credit`+{$v["bet_golds"]}) WHERE `nid`='{$v["nid"]}' AND `pay_type`=1";
                    $this->dbc->execSql($sql);
                    $this->dbc->commit();
                }catch (\Exception $e){
                    print_r($e->getMessage());
                    print_r("\n");
                    $this->dbc->rollback();
                }
            }
        }
        return $num;
    }

    public function betResult($bet){
        $num = 0;
        $betGidAry = [];
        if($bet) {
            $betGidAry = $this->betGidAry($bet);
        }

        if(count($betGidAry)>0){
            foreach ($betGidAry as $gtype => $gids){
                $table = $this->gtypeAry[$gtype]["table"];

                foreach ($gids as $gid){
                    if(!ctype_digit((string)$gid)){
                        error_log("[Result::betResult] skip malformed gid: ".var_export($gid,true)." gtype={$gtype}");
                        continue;
                    }
                    $match = $this->getMatch($table,$gid,$gtype);

                    if(count($match)>0){
                        if($match["status"]>0) {//非正常注单
                            $up_p3 = [
                                "status" => $match["status"],
                                "isResult" => 1,
                                "cancel" => 1,
                                "result" => "T"
                            ];
                            $this->dbc->update($this->bet_p3_table,$up_p3,"`gid`='{$gid}'");//串关表处理

                            //单注处理
                            $up = [
                                "status" => $match["status"],
                                "valid_gold" => 0,//有效金额
                                "mem_result" => 0,//退水后输赢
                                "mem_win_gold" => 0,//退水前输赢
                                "agent_result" => 0,
                                "ag_result" => 0,
                                "su_result" => 0,
                                "co_result" => 0,
                                "d0_result" => 0,
                                "cancel" => 1,
                                "isResult" => 1,
                                "result" => "T"
                            ];
                            $this->dbc->update($this->bet_table,$up,"`gid`='{$gid}'");

                        }else{
                            $bets = $this->dbc->select("SELECT * FROM {$this->bet_table} WHERE `gid`='{$match["gid"]}' AND `isResult`=0");

                            if($bets){

                                foreach ($bets as $v){
                                    $sta =  $this->Result($match,$v);
                                    if($sta["status"] == "ok"){
                                        $num++;
                                    }elseif($sta["status"] == "error"){
                                        print_r($sta["msg"]);
                                    }
                                }
                            }
                            //过关注单 - 单注结算
                            $betp3 = $this->dbc->select("SELECT * FROM {$this->bet_p3_table} WHERE `gid`='{$match["gid"]}' AND `isResult`=0");
                            if($betp3){

                                foreach ($betp3 as $v){
                                    $sta =  $this->Result($match,$v,"p3");
                                    if($sta["status"] == "ok"){
                                        $num++;
                                    }elseif($sta["status"] == "error"){
                                        print_r($sta["msg"]);
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }

        return $num;
    }

    /**
     * 赛事查询
     * @param $table
     * @param $gid
     * @param string $gtype
     * @param string $isLiveInball 滚球是否结束，Y:未结束,N:结束
     * @return array|null
     */
    public function getMatch($table,$gid,$gtype="FT",$isLiveInball="N"){
        $filed = "`strong`,`status`";
        if($isLiveInball=="N"){
            $where = " AND `is_inball`=1";
            if(in_array($gtype,$this->isHGID)) {
                $filed .= ",`inball_h`,`inball_c`,`inball_h_hr`,`inball_c_hr`,`inball_more`,`is_inball`";
            }else{
                $filed .= ",`inball_h`,`inball_c`,`inball_more`,`is_inball`";
            }
        }else{
            $where = " AND `score_h` >= 0";
            $filed .= "`score_h` AS `inball_h`,`score_c` AS `inball_c`,`is_inball`";
        }
        $r = $this->dbs->select("SELECT `gid`,`strong`,{$filed} FROM {$table} WHERE `gid`='{$gid}' {$where}","Row");
        if(!$r && in_array($gtype,$this->isHGID)){ //存在上半gid
            $r = $this->dbs->select("SELECT `hgid` AS `gid`,`hstrong` AS `strong`,{$filed} FROM {$table} WHERE `hgid`='{$gid}'","Row");
        }

        if(!$r){
            $r = [];
        }

        return $r;
    }

    /**
     * 归类注单的GID
     * @param $bet
     * @return array
     */
    public function betGidAry($bet){
        $betGidAry = [];
        if($bet){
            foreach ($bet as $v){
                if(!isset($betGidAry[$v["gtype"]])){
                    $betGidAry[$v["gtype"]] = [];
                }
                if(!in_array($v["gid"],$betGidAry[$v["gtype"]])) {
                    $betGidAry[$v["gtype"]][] = $v["gid"];
                }
            }

        }

        return $betGidAry;
    }




    /**
     * 注单结算
     * @param $m
     * @param $b
     * @param string $betType
     * @return array|mixed|string[]
     */
    public function Result($m,$b,$betType="bet"){
        $num = 0;
        $sta = "";//T:退还,W:赢,L:输,HW:赢一半,HL:输一半
        $up = [];
        $betType = strtolower($betType);
        $this->dbc->beginTransaction();
        try{
            $pay_gold = 0;//现金额度
            if($m["status"]>0){//非正常注单
                if($betType=="bet"){
                    $up = [
                        "status" => $m["status"],
                        "valid_gold" => 0,//有效金额
                        "mem_result" => 0,//退水后输赢
                        "mem_win_gold" => 0,//退水前输赢
                        "agent_result" => 0,
                        "ag_result" => 0,
                        "su_result" => 0,
                        "co_result" => 0,
                        "d0_result" => 0,
                        "cancel" => 1,
                        "isResult" => 1,
                        "result" => "T"
                    ];
                    $this->dbc->update($this->bet_table,$up,"`ID`={$b["ID"]}");
                }else{
                    $up = [
                        "status" => $m["status"],
                        "isResult" => 1,
                        "cancel" => 1,
                        "result" => "T"
                    ];
                    $this->dbc->update($this->bet_p3_table,$up,"`ID`={$b["ID"]}");
                }
                $pay_gold = $b["bet_golds"];
                $sta = "T";//退还
            }else {
                $inball = "";
                $ballH = $m["inball_h"];
                $ballC = $m["inball_c"];
                $ballH_hr = "";
                $ballC_hr = "";
                if (isset($m["inball_h_hr"]) && isset($m["inball_c_hr"])) {
                    $ballH_hr = $m["inball_h_hr"];
                    $ballC_hr = $m["inball_c_hr"];
                }
                $more = [];
                $rs_more = [];
                if (!empty($m["inball_more"])) {
                    $more = unserialize($m["inball_more"]);
                    $rs_more = isset($more["rs_more"]) ? $more["rs_more"] : "";
                }
                $rtype = strtoupper($b["rtype"]);
                $spread = $b["spread"];
                $strong = strtoupper($b["strong"]);
                $wtype = strtoupper($b["wtype"]);
                $gtype = strtoupper($b["gtype"]);
                $score = $b["score"];
                $chose_team = strtoupper($b["chose_team"]);

                switch ($wtype) {
                    /*独赢类 - 开始*/
                    case "M":
                    case "RM":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getM($ballH, $ballC, $rtype);
                        }
                        break;
                    case "HM":
                    case "HRM":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getM($ballH_hr, $ballC_hr, $rtype);
                        }
                        break;
                    /*15分钟 独赢 - 开始*/
                    case "AM":
                    case "ARM":
                        if (isset($more["AGMH"]) && isset($more["AGMC"]) && is_numeric($more["AGMH"]) && is_numeric($more["AGMC"])) {
                            $h = $more["AGMH"];
                            $c = $more["AGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    case "BM":
                    case "BRM":
                        if (isset($more["BGMH"]) && isset($more["BGMC"]) && is_numeric($more["BGMH"]) && is_numeric($more["BGMC"])) {
                            $h = $more["BGMH"];
                            $c = $more["BGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    case "CM":
                    case "CRM":
                        if (isset($more["CGMH"]) && isset($more["CGMC"]) && is_numeric($more["CGMH"]) && is_numeric($more["CGMC"])) {
                            $h = $more["CGMH"];
                            $c = $more["CGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    case "DM":
                    case "DRM":
                        if (isset($more["DGMH"]) && isset($more["DGMC"]) && is_numeric($more["DGMH"]) && is_numeric($more["DGMC"])) {
                            $h = $more["DGMH"];
                            $c = $more["DGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    case "EM":
                    case "ERM":
                        if (isset($more["EGMH"]) && isset($more["EGMC"]) && is_numeric($more["EGMH"]) && is_numeric($more["EGMC"])) {
                            $h = $more["EGMH"];
                            $c = $more["EGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    case "FM":
                    case "FRM":
                        if (isset($more["FGMH"]) && isset($more["FGMC"]) && is_numeric($more["FGMH"]) && is_numeric($more["FGMC"])) {
                            $h = $more["FGMH"];
                            $c = $more["FGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    /*15分钟 独赢 - 结束*/

                    case "MG"://最多进球的半场 - 独赢
                    case "RMG":
                    case "HG":
                    case "RHG":
                        if (is_numeric($ballH) && is_numeric($ballC)
                            && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $h = $ballH_hr + $ballC_hr;//上半场
                            $c = $ballH + $ballC - $h;//下半场
                            $inball = $ballH.":".$ballC."@".$ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    /*独赢类 - 结束*/

                    /*让球类 - 开始*/
                    case "R":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $ballC . ":" . $ballH;
                            }*/
                            $sta = $this->getR($ballH, $ballC,$strong,$rtype,$spread);
                        }
                        break;
                    case "HR":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $ballC_hr . ":" . $ballH_hr;
                            }*/
                            $sta = $this->getR($ballH_hr, $ballC_hr,$strong,$rtype,$spread);
                        }
                        break;
                    case "RE":
                        if(empty($score) && $gtype<>"FT"){
                            $score = "0:0";
                        }
                        if (!empty($score) && is_numeric($ballH) && is_numeric($ballC)) {
                            $scoreAry = explode(":", $score);
                            if (count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                                /*switch ($strong) {
                                    case "H":*/
                                $h = $ballH - $scoreAry[0];
                                $c = $ballC - $scoreAry[1];
                                /*        break;
                                    default://主客交换比分
                                        $h = $ballC - $scoreAry[0];
                                        $c = $ballH - $scoreAry[1];
                                        break;
                                }*/
                                $inball = $ballH . ":" . $ballC;
                                /*if(strtoupper($strong) == "C") {
                                    $inball = $ballC . ":" . $ballH;
                                }*/

                                $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                            }

                        }

                        break;
                    case "HRE":

                        if(empty($score) && $gtype<>"FT"){
                            $score = "0:0";
                        }
                        if($gtype=="FT" && empty($score)){
                            $score = "0:0";
                        }
                        if (!empty($score) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $scoreAry = explode(":", $score);
                            if (count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                                /*switch ($strong) {
                                    case "H":*/
                                $h = $ballH_hr - $scoreAry[0];
                                $c = $ballC_hr - $scoreAry[1];
                                /*    break;
                                default://主客交换比分
                                    $h = $ballC_hr - $scoreAry[0];
                                    $c = $ballH_hr - $scoreAry[1];
                                    break;
                            }*/
                                $inball = $ballH_hr . ":" . $ballC_hr;
                                /*if(strtoupper($strong) == "C") {
                                    $inball = $ballC_hr . ":" . $ballH_hr;
                                }*/
                                $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                                //print_r($sta);exit;
                            }

                        }
                        break;
                    /*15分钟 让球 - 开始*/
                    case "AR":
                        if (isset($more["AGMH"]) && isset($more["AGMC"]) && is_numeric($more["AGMH"]) && is_numeric($more["AGMC"])) {
                            $h = $more["AGMH"];
                            $c = $more["AGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "ARE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["AGMH"]) && isset($more["AGMC"])
                            && is_numeric($more["AGMH"]) && is_numeric($more["AGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            $h = $more["AGMH"] - $scoreAry[0];
                            $c = $more["AGMC"] - $scoreAry[1];
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["AGMH"] - $scoreAry[0];
                                    $c = $more["AGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["AGMC"] - $scoreAry[0];
                                    $c = $more["AGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $inball = $more["AGMH"] . ":" . $more["AGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["AGMC"] . ":" . $more["AGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "BR":
                        if (isset($more["BGMH"]) && isset($more["BGMC"]) && is_numeric($more["BGMH"]) && is_numeric($more["BGMC"])) {
                            $h = $more["BGMH"];
                            $c = $more["BGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "BRE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["BGMH"]) && isset($more["BGMC"])
                            && is_numeric($more["BGMH"]) && is_numeric($more["BGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["BGMH"] - $scoreAry[0];
                                    $c = $more["BGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["BGMC"] - $scoreAry[0];
                                    $c = $more["BGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $h = $more["BGMH"] - $scoreAry[0];
                            $c = $more["BGMC"] - $scoreAry[1];
                            $inball = $more["BGMH"] . ":" . $more["BGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["BGMC"] . ":" . $more["BGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "CR":
                        if (isset($more["CGMH"]) && isset($more["CGMC"]) && is_numeric($more["CGMH"]) && is_numeric($more["CGMC"])) {
                            $h = $more["CGMH"];
                            $c = $more["CGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "CRE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["CGMH"]) && isset($more["CGMC"])
                            && is_numeric($more["CGMH"]) && is_numeric($more["CGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["CGMH"] - $scoreAry[0];
                                    $c = $more["CGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["CGMC"] - $scoreAry[0];
                                    $c = $more["CGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $h = $more["CGMH"] - $scoreAry[0];
                            $c = $more["CGMC"] - $scoreAry[1];
                            $inball = $more["CGMH"] . ":" . $more["CGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["CGMC"] . ":" . $more["CGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "DR":
                        if (isset($more["DGMH"]) && isset($more["DGMC"]) && is_numeric($more["DGMH"]) && is_numeric($more["DGMC"])) {
                            $h = $more["DGMH"];
                            $c = $more["DGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "DRE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["DGMH"]) && isset($more["DGMC"])
                            && is_numeric($more["DGMH"]) && is_numeric($more["DGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["DGMH"] - $scoreAry[0];
                                    $c = $more["DGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["DGMC"] - $scoreAry[0];
                                    $c = $more["DGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $h = $more["DGMH"] - $scoreAry[0];
                            $c = $more["DGMC"] - $scoreAry[1];
                            $inball = $more["DGMH"] . ":" . $more["DGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["DGMC"] . ":" . $more["DGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "ER":
                        if (isset($more["EGMH"]) && isset($more["EGMC"]) && is_numeric($more["EGMH"]) && is_numeric($more["EGMC"])) {
                            $h = $more["EGMH"];
                            $c = $more["EGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "ERE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["EGMH"]) && isset($more["EGMC"])
                            && is_numeric($more["EGMH"]) && is_numeric($more["EGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["EGMH"] - $scoreAry[0];
                                    $c = $more["EGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["EGMC"] - $scoreAry[0];
                                    $c = $more["EGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $h = $more["EGMH"] - $scoreAry[0];
                            $c = $more["EGMC"] - $scoreAry[1];
                            $inball = $more["EGMH"] . ":" . $more["EGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["EGMC"] . ":" . $more["EGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "FR":
                        if (isset($more["FGMH"]) && isset($more["FGMC"]) && is_numeric($more["FGMH"]) && is_numeric($more["FGMC"])) {
                            $h = $more["FGMH"];
                            $c = $more["FGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "FRE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["FGMH"]) && isset($more["FGMC"])
                            && is_numeric($more["FGMH"]) && is_numeric($more["FGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["FGMH"] - $scoreAry[0];
                                    $c = $more["FGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["FGMC"] - $scoreAry[0];
                                    $c = $more["FGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $h = $more["FGMH"] - $scoreAry[0];
                            $c = $more["FGMC"] - $scoreAry[1];
                            $inball = $more["FGMH"] . ":" . $more["FGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["FGMC"] . ":" . $more["FGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    /*15分钟 让球 - 结束*/

                    //三项让球投注
                    case "W3":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            if(strtoupper($strong) == "C") {
                                $inball = $ballC . ":" . $ballH;
                            }
                            switch ($rtype){
                                case "W3H"://主队赢
                                    switch ($spread){
                                        case 1://主队让一球半
                                            $sta = $this->getR($ballH,$ballC,$strong,"RH","1.5");
                                            break;
                                        case 2://主队受让一球半
                                            $sta = $this->getR($ballH,$ballC,$strong,"RC","1.5");
                                            break;
                                    }
                                    break;
                                case "W3C"://客队赢
                                    switch ($spread){
                                        case 1://客队受让半球
                                            $sta = $this->getR($ballH,$ballC,$strong,"RC","0.5");
                                            break;
                                        case 2://客队让二球半
                                            $sta = $this->getR($ballH,$ballC,$strong,"RC","2.5");
                                            break;
                                    }
                                    break;
                                case "W3N"://和局
                                    if(strtoupper($strong) == "C") {
                                        $ballH = $ballH + $ballC;
                                        $ballC = $ballH - $ballC;
                                        $ballH = $ballH - $ballC;
                                    }
                                    switch ($spread){
                                        case 1://主场净胜一球
                                            if($ballH-$ballC == 1){
                                                $sta = "W";
                                            }else{
                                                $sta = "L";
                                            }
                                            break;
                                        case 2://客场净胜二球
                                            if($ballC-$ballH == 2){
                                                $sta = "W";
                                            }else{
                                                $sta = "L";
                                            }
                                            break;
                                    }
                                    break;
                            }
                        }
                        break;
                    /*让球类 - 结束*/

                    /*大小类 - 开始*/
                    case "OU":
                    case "ROU":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getOU($ballH,$ballC,$rtype,$spread);
                        }
                        break;
                    case "HOU":
                    case "HROU":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getOU($ballH_hr,$ballC_hr,$rtype,$spread);
                        }
                        break;
                    case "OUH"://主队进球 大小
                    case "ROUH"://滚球
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getOU($ballH,0,$rtype,$spread);
                        }
                        break;
                    case "OUC"://客队进球 大小
                    case "ROUC"://滚球
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getOU(0,$ballC,$rtype,$spread);
                        }
                        break;
                    case "HOUH"://主队进球 上半 大小
                    case "HRUH"://滚球
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getOU($ballH_hr,0,$rtype,$spread);
                        }
                        break;
                    case "HOUC"://客队进球 上半 大小
                    case "HRUC"://滚球
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getOU(0,$ballC_hr,$rtype,$spread);
                        }
                        break;
                    case "AOU"://15分钟盘口 大小
                    case "AROU"://滚球
                    case "TARU"://5分钟盘口：开始 - 04:59 分钟 - 大 / 小 加时赛
                        if (isset($more["AGMH"]) && isset($more["AGMC"]) && is_numeric($more["AGMH"]) && is_numeric($more["AGMC"])) {
                            $inball = $more["AGMH"] . ":" . $more["AGMC"];

                            $sta = $this->getOU($more["AGMH"],$more["AGMC"],$rtype,$spread);
                        }
                        break;
                    case "BOU"://15分钟盘口 大小
                    case "BROU"://滚球
                    case "TBRU"://5分钟盘口：05:00 - 09:59 分钟 - 大 / 小 加时赛
                        if (isset($more["BGMH"]) && isset($more["BGMC"]) && is_numeric($more["BGMH"]) && is_numeric($more["BGMC"])) {
                            $inball = $more["BGMH"] . ":" . $more["BGMC"];
                            $sta = $this->getOU($more["BGMH"],$more["BGMC"],$rtype,$spread);
                        }
                        break;
                    case "COU"://15分钟盘口 大小
                    case "CROU":
                        $scoreAry = explode(":", $score);
                        if (isset($more["CGMH"]) && isset($more["CGMC"]) && is_numeric($more["CGMH"]) && is_numeric($more["CGMC"])) {
                            $inball = $more["CGMH"] . ":" . $more["CGMC"];
                            $sta = $this->getOU($more["CGMH"],$more["CGMC"],$rtype,$spread);
                        }
                        break;
                    case "DOU"://15分钟盘口 大小
                    case "DROU"://滚球
                    case "TDRU"://5分钟盘口：下半场开始 - 19:59分钟  - 大 / 小 加时赛
                        $scoreAry = explode(":", $score);
                        if (isset($more["DGMH"]) && isset($more["DGMC"]) && is_numeric($more["DGMH"]) && is_numeric($more["DGMC"])) {
                            $inball = $more["DGMH"] . ":" . $more["DGMC"];
                            $sta = $this->getOU($more["DGMH"],$more["DGMC"],$rtype,$spread);
                        }
                        break;
                    case "EOU"://15分钟盘口 大小
                    case "EROU"://滚球
                    case "TERU"://5分钟盘口：20:00 - 24:59分钟 - 大 / 小 加时赛
                        $scoreAry = explode(":", $score);
                        if (isset($more["EGMH"]) && isset($more["EGMC"]) && is_numeric($more["EGMH"]) && is_numeric($more["EGMC"])) {
                            $inball = $more["EGMH"] . ":" . $more["EGMC"];
                            $sta = $this->getOU($more["EGMH"],$more["EGMC"],$rtype,$spread);
                        }
                        break;
                    case "FOU"://15分钟盘口 大小
                    case "FROU":
                        $scoreAry = explode(":", $score);
                        if (isset($more["FGMH"]) && isset($more["FGMC"]) && is_numeric($more["FGMH"]) && is_numeric($more["FGMC"])) {
                            $inball = $more["FGMH"] . ":" . $more["FGMC"];
                            $sta = $this->getOU($more["FGMH"],$more["FGMC"],$rtype,$spread);
                        }
                        break;
                    /*大小类 - 结束*/

                    /*单双/进球数类 - 开始*/
                    case "T":
                    case "RT":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getT($ballH,$ballC,$rtype);
                        }
                        break;
                    case "HT":
                    case "HRT":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getT($ballH_hr,$ballC_hr,$rtype);
                        }
                        break;
                    /*单双/进球数类 - 结束*/
                    /*其他玩法 和比分有关 - 开始*/
                    case "TS"://双方球队进球
                    case "RTS"://双方球队进球 滚球
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getTS($ballH,$ballC,$rtype);
                        }
                        break;
                    case "HTS"://双方球队进球 上半场
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getTS($ballH_hr,$ballC_hr,$rtype);
                        }
                        break;
                    case "RTS2"://双方球队进球 下半场
                        if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $h = $ballH - $ballH_hr;
                            $c = $ballC - $ballC_hr;
                            $inball = $h . ":" . $c;
                            $sta = $this->getTS($h,$c,$rtype);
                        }
                        break;
                    case "F"://半全场
                    case "RF":
                        if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH . ":" . $ballC."@". $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getF($ballH,$ballC,$ballH_hr,$ballC_hr,$rtype,$wtype);
                        }
                        break;

                    case "PD":
                    case "RPD":
                    case "PD3":
                    case "RPD3":
                    case "PD5":
                    case "RPD5":
                    case "PD7":
                    case "RPD7":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getPD($ballH,$ballC,$rtype,$wtype,$gtype);
                        }
                        break;
                    case "HPD":
                    case "HRPD":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getPD($ballH_hr,$ballC_hr,$rtype,$wtype);
                        }
                        break;
                    case "WM"://净胜球数
                    case "RWM":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getWM($ballH,$ballC,$rtype,$wtype,$gtype);
                        }
                        break;
                    case "HWM":
                    case "HRWM":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getWM($ballH_hr,$ballC_hr,$rtype,$wtype,$gtype);
                        }
                        break;
                    case "DC"://双重机会
                    case "RDC":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getDC($ballH,$ballC,$rtype);
                        }
                        break;
                    case "WE"://赢得任一半场
                    case "RWE":
                        if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH . ":" . $ballC."@". $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getWE($ballH,$ballC,$ballH_hr,$ballC_hr,$rtype);
                        }
                        break;
                    case "WB"://赢得所有半场
                    case "RWB":
                        if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH . ":" . $ballC."@". $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getWB($ballH,$ballC,$ballH_hr,$ballC_hr,$rtype);
                        }
                        break;
                    case "CS"://零失球
                    case "RCS":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getCS($ballH,$ballC,$rtype);
                        }
                        break;
                    case "WN"://零失球获胜
                    case "RWN":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getWN($ballH,$ballC,$rtype);
                        }
                        break;
                    case "SB"://双半场进球
                    case "RSB":
                        if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH . ":" . $ballC."@". $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getSB($ballH,$ballC,$ballH_hr,$ballC_hr,$rtype);
                        }
                        break;
                    case "MOUA"://独赢 & 进球 大 / 小1.5
                    case "RMUA":
                    case "MOUB"://独赢 & 进球 大 / 小2.5
                    case "RMUB":
                    case "MOUC"://独赢 & 进球 大 / 小3.5
                    case "RMUC":
                    case "MOUD"://独赢 & 进球 大 / 小4.5
                    case "RMUD":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getMOU($ballH,$ballC,$rtype);
                        }
                        break;
                    case "MTS"://独赢 & 双方球队进球
                    case "RMTS":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getMTS($ballH,$ballC,$rtype);
                        }
                        break;
                    case "MPG"://独赢 & 最先进球
                    case "RMPG":
                        if (is_numeric($ballH) && is_numeric($ballC) && !empty($rs_more["PGF_type"])){
                            $inball = $ballH . ":" . $ballC."@PGF|".$rs_more["PGF_type"];
                            $sta = $this->getMPG($ballH,$ballC,$rtype,$rs_more["PGF_type"]);
                        }
                        break;
                    case "OUTA"://进球 大 / 小 1.5 & 双方球队进球
                    case "RUTA":
                    case "OUTB"://进球 大 / 小 2.5 & 双方球队进球
                    case "RUTB":
                    case "OUTC"://进球 大 / 小 3.5 & 双方球队进球
                    case "RUTC":
                    case "OUTD"://进球 大 / 小 3.5 & 双方球队进球
                    case "RUTD":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getOUT($ballH,$ballC,$rtype);
                        }
                        break;
                    case "OUEA"://进球 大 / 小 1.5 & 进球 单 / 双
                    case "RUEA":
                    case "OUEB"://进球 大 / 小 2.5 & 进球 单 / 双
                    case "RUEB":
                    case "OUEC"://进球 大 / 小 3.5 & 进球 单 / 双
                    case "RUEC":
                    case "OUED"://进球 大 / 小 4.5 & 进球 单 / 双
                    case "RUED":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getOUE($ballH,$ballC,$rtype);
                        }
                        break;
                    case "OUPA"://进球 大 / 小 1.5 & 最先进球
                    case "RUPA":
                    case "OUPB"://进球 大 / 小 2.5 & 最先进球
                    case "RUPB":
                    case "OUPC"://进球 大 / 小 3.5 & 最先进球
                    case "RUPC":
                    case "OUPD"://进球 大 / 小 4.5 & 最先进球
                    case "RUPD":
                        if (is_numeric($ballH) && is_numeric($ballC) && !empty($rs_more["PGF_type"])){
                            $inball = $ballH . ":" . $ballC."@PGF|".$rs_more["PGF_type"];
                            $sta = $this->getOUP($ballH,$ballC,$rtype,$rs_more["PGF_type"]);
                        }
                        break;
                    case "DUA"://双重机会 & 进球 大 / 小 1.5
                    case "RDUA":
                    case "DUB"://双重机会 & 进球 大 / 小 2.5
                    case "RDUB":
                    case "DUC"://双重机会 & 进球 大 / 小 3.5
                    case "RDUC":
                    case "DUD"://双重机会 & 进球 大 / 小 4.5
                    case "RDUD":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getDU($ballH,$ballC,$rtype);
                        }
                        break;
                    case "DS"://双重机会 & 双方球队进球
                    case "RDS":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getDS($ballH,$ballC,$rtype);
                        }
                        break;
                    case "DG"://双重机会 & 最先进球
                    case "RDG":
                        if (is_numeric($ballH) && is_numeric($ballC) && !empty($rs_more["PGF_type"])){
                            $inball = $ballH . ":" . $ballC."@PGF|".$rs_more["PGF_type"];
                            $sta = $this->getDG($ballH,$ballC,$rtype,$rs_more["PGF_type"]);
                        }
                        break;


                    /*其他玩法 和比分有关 - 结束*/

                    /*其他玩法 和比分无关 - 开始*/
                    case "BH"://落后反超获胜
                        if ($m["is_inball"] == 1) {//表示该赛事已有结果
                            if(isset($rs_more["BH_type"]) && !empty($rs_more["BH_type"])){
                                $inball = "BH|".$rs_more["BH_type"];
                                if("BH".strtoupper($rs_more["BH_type"]) == strtoupper($rtype)){
                                    $sta = "W";
                                }else{
                                    $sta = "L";
                                }
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "SP":
                        if ($m["is_inball"] == 1 && !empty($more)) {//表示该赛事已有结果
                            $ary = $this->getSP($rs_more,$rtype);
                            $sta = $ary["sta"];
                            $inball = $ary["inball"];
                        }
                        break;
                    case "F2G"://先进2球的一方
                        if ($m["is_inball"] == 1 && !empty($rs_more["F2G_type"])) {
                            $inball = "F2G|".$rs_more["F2G_type"];
                            switch (strtoupper($rs_more["F2G_type"])){
                                case "H":
                                    if($rtype == "F2GH"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                                case "C":
                                    if($rtype == "F2GC"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                                case "N":
                                    if($rtype == "F2GN"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                            }
                        }
                        break;
                    case "F3G"://先进3球的一方
                        if ($m["is_inball"] == 1 && !empty($rs_more["F3G_type"])) {
                            $inball = "F3G|".$rs_more["F3G_type"];
                            switch (strtoupper($rs_more["F3G_type"])){
                                case "H":
                                    if($rtype == "F3GH"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                                case "C":
                                    if($rtype == "F3GC"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                                case "N":
                                    if($rtype == "F3GN"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                            }
                        }
                        break;
                    case "FG"://首个进球方式
                        if ($m["is_inball"] == 1 && !empty($rs_more["FG_type"])) {
                            $inball = "FG|" . $rs_more["FG_type"];
                            if(strtoupper($rtype) == "FG".strtoupper($rs_more["FG_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "T1G"://首个进球时间
                    case "RT1G":
                        if ($m["is_inball"] == 1 && !empty($rs_more["T1G_type"])) {
                            $inball = "T1G|" . $rs_more["T1G_type"];
                            $rtype = str_replace("R","",$rtype);
                            if(strtoupper($rtype) == "T1G".strtoupper($rs_more["T1G_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "T3G"://首个进球时间 -3项
                    case "RT3G":
                        if ($m["is_inball"] == 1 && !empty($rs_more["T3G_type"])) {
                            $inball = "T3G|" . $rs_more["T3G_type"];
                            $rtype = str_replace("R","",$rtype);
                            if(strtoupper($rtype) == "T3G".strtoupper($rs_more["T3G_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "TK"://开球球队
                        if ($m["is_inball"] == 1 && !empty($rs_more["TK_type"])) {
                            $inball = "TK|" . $rs_more["TK_type"];
                            if(strtoupper($rtype) == "TK".strtoupper($rs_more["TK_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "PA"://点球荣获（除开点球大战)
                        if ($m["is_inball"] == 1 && !empty($rs_more["PA_type"])) {
                            $inball = "PA|" . $rs_more["PA_type"];
                            if(strtoupper($rtype) == "PA".strtoupper($rs_more["PA_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "RCD"://红卡(球员)
                        if ($m["is_inball"] == 1 && !empty($rs_more["RCD_type"])) {
                            $inball = "RCD|" . $rs_more["RCD_type"];
                            $sss = str_replace(["Y","N"],["H","C"],strtoupper($rs_more["RCD_type"]));
                            if(strtoupper($rtype) == "RCD".$sss){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "OG"://乌龙球
                        if ($m["is_inball"] == 1 && !empty($rs_more["OG_type"])) {
                            $inball = "OG|" . $rs_more["OG_type"];
                            if(strtoupper($rtype) == "OG".strtoupper($rs_more["OG_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "OT"://加时赛
                    case "ROT":
                        if ($m["is_inball"] == 1 && !empty($rs_more["OT_type"])) {
                            $inball = "OT|" . $rs_more["OT_type"];
                            $rtype = str_replace("R","",strtoupper($rtype));//去除滚球前面的R
                            if($rtype == "OT".strtoupper($rs_more["OT_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "MW"://胜出方法
                    case "HMW":
                    case "RMW":
                    case "HRMW":
                        if ($m["is_inball"] == 1 && !empty($rs_more["WM_type"])) {
                            $inball = "MW|" . $rs_more["MW_type"];
                            if(strtoupper($rtype) == "MW".strtoupper($rs_more["MW_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "MQ"://晋级方法
                        if ($m["is_inball"] == 1 && !empty($rs_more["MQ_type"])) {
                            $inball = "MQ|" . $rs_more["MQ_type"];
                            if(strtoupper($rtype) == "MQ".strtoupper($rs_more["MQ_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "RPS"://点球大战
                        if ($m["is_inball"] == 1 && !empty($rs_more["RPS_type"])) {
                            $inball = "RPS|" . $rs_more["RPS_type"];
                            if(strtoupper($rtype) == "RPS".strtoupper($rs_more["RPS_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "RPF"://点球大战 - 最后结束回合
                        if ($m["is_inball"] == 1 && !empty($rs_more["RPF_type"])) {
                            $inball = "RPF|" . $rs_more["RPF_type"];
                            if(strtoupper($rtype) == "RPF".strtoupper($rs_more["RPF_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "ARG"://第一个进球
                    case "BRG"://第二个进球
                    case "CRG"://第三个进球
                    case "DRG"://第四个进球
                    case "ERG"://第五个进球
                    case "FRG"://第六个进球
                    case "GRG"://第七个进球
                    case "HRG"://第八个进球
                    case "IRG"://第九个进球
                    case "JRG"://第十个进球
                    case "KRG"://第十一个进球
                    case "LRG"://第十二个进球
                    case "MRG"://第十三个进球
                    case "NRG"://第十四个进球
                    case "ORG"://第十五个进球
                        if ($m["is_inball"] == 1) {
                            $type = "{$wtype}_type";
                            if(!empty($rs_more[$type])) {
                                $inball = "{$wtype}|" . $rs_more[$type];
                                if (strtoupper($rtype) == $wtype . strtoupper($rs_more[$type])) {
                                    $sta = "W";
                                } else {
                                    $sta = "L";
                                }
                            }/*else{
                                $inball = "{$wtype}|N";
                                if (strtoupper($rtype) == $wtype ."N") {
                                    $sta = "W";
                                } else {
                                    $sta = "L";
                                }
                            }*/
                        }
                        break;
                    case "RPXA"://点球大战 - 第一回合
                    case "RPXB"://点球大战 - 第二回合
                    case "RPXC"://点球大战 - 第三回合
                    case "RPXD"://点球大战 - 第四回合
                    case "RPXE"://点球大战 - 第五回合
                    case "RPXF"://点球大战 - 第六回合
                    case "RPXG"://点球大战 - 第七回合
                    case "RPXH"://点球大战 - 第八回合
                    case "RPXI"://点球大战 - 第九回合
                    case "RPXJ"://点球大战 - 第十回合
                    case "RPXK"://点球大战 - 第十一回合
                    case "RPXL"://点球大战 - 第十二回合
                    case "RPXM"://点球大战 - 第十三回合
                    case "RPXN"://点球大战 - 第十四回合
                    case "RPXO"://点球大战 - 第十五回合
                        $keyH = "RSH".str_replace("RPX","",$wtype);
                        $keyC = "RSC".str_replace("RPX","",$wtype);
                        $keyN = "RSN".str_replace("RPX","",$wtype);
                        if ($m["is_inball"] == 1 && !empty($rs_more["{$keyH}_type"]) && !empty($rs_more["{$keyC}_type"])) {
                            $yyn = strtoupper($rs_more["{$keyH}_type"].$rs_more["{$keyC}_type"]);
                            $inball = "{$keyH}|" . $rs_more["{$keyH}_type"]."@{$keyC}|" . $rs_more["{$keyC}_type"];
                            if(strpos($yyn,"P")!==false){ //无点球
                                if(strtoupper($rs_more["{$keyH}_type"]) == "P" && $rtype == $wtype."H"){
                                    $sta = "T";
                                }
                                if(strtoupper($rs_more["{$keyC}_type"]) == "P" && $rtype == $wtype."C"){
                                    $sta = "T";
                                }
                            }else{
                                switch ($yyn){
                                    case "YY"://主客都进球
                                        if($rtype == $wtype."N"){
                                            $sta = "L";
                                        }else{
                                            $sta = "W";
                                        }
                                        break;
                                    case "YN"://主-进球 客-无进球
                                        if($rtype == $wtype."H"){
                                            $sta = "W";
                                        }else{
                                            $sta = "L";
                                        }
                                        break;
                                    case "NY"://主-无进球 客-进球
                                        if($rtype == $wtype."C"){
                                            $sta = "W";
                                        }else{
                                            $sta = "L";
                                        }
                                        break;
                                    case "NN"://都无进球
                                        if($rtype == $wtype."N"){
                                            $sta = "W";
                                        }else{
                                            $sta = "L";
                                        }
                                        break;
                                }
                            }
                        }
                        break;

                    case "RTW"://点球大战 - 净胜球数
                        if ($m["is_inball"] == 1 && !empty($rs_more["RPF_type"])) {
                            $inball = "RTW|" . $rs_more["RTW_type"];
                            if(strtoupper($rtype) == "RTW".strtoupper($rs_more["RTW_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;

                        break;
                    case "RNBA"://第一张罚牌
                    case "RNBB"://第二张罚牌
                    case "RNBC"://第三张罚牌
                    case "RNBD"://第四张罚牌
                    case "RNBE"://第五张罚牌
                    case "RNBF"://第六张罚牌
                    case "RNBG"://第七张罚牌
                    case "RNBH"://第八张罚牌
                    case "RNBI"://第九张罚牌
                    case "RNBJ"://第十张罚牌
                    case "RNBK"://第十一张罚牌
                    case "RNBL"://第十二张罚牌
                    case "RNBM"://第十三张罚牌
                    case "RNBN"://第十四张罚牌
                    case "RNBO"://第十五张罚牌
                        if($m["is_inball"] == 1 && isset($rs_more[$wtype."_type"]) && !empty($rs_more[$wtype."_type"])){
                            $inball = $wtype."|".$rs_more[$wtype."_type"];
                            if(strtoupper($rs_more[$wtype."_type"]) == "P"){//无角球
                                $sta = "T";
                            }else if($wtype.$rs_more[$wtype."_type"] == $rtype){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "RNC1"://第一個角球
                    case "RNC2"://第二個角球
                    case "RNC3"://第三個角球
                    case "RNC4"://第四個角球
                    case "RNC5"://第五個角球
                    case "RNC6"://第六個角球
                    case "RNC7"://第七個角球
                    case "RNC8"://第八個角球
                    case "RNC9"://第九個角球
                    case "RNCA"://第十個角球
                    case "RNCB"://第十一個角球
                    case "RNCC"://第十二個角球
                    case "RNCD"://第十三個角球
                    case "RNCE"://第十四個角球
                    case "RNCF"://第十五個角球
                    case "RNCG"://第十六個角球
                    case "RNCH"://第十七個角球
                    case "RNCI"://第十八個角球
                    case "RNCJ"://第十九個角球
                    case "RNCK"://第二十個角球
                    case "RNCL"://第二十一個角球
                    case "RNCM"://第二十二個角球
                    case "RNCN"://第二十三個角球
                    case "RNCO"://第二十四個角球
                    case "RNCP"://第二十五個角球
                    case "RNCQ"://第二十六個角球
                    case "RNCR"://第二十七個角球
                    case "RNCS"://第二十八個角球
                    case "RNCT"://第二十九個角球
                    case "RNCU"://第三十個角球
                        if($m["is_inball"] == 1 && isset($rs_more[$wtype."_type"]) && !empty($rs_more[$wtype."_type"])){
                            $inball = $wtype."|".$rs_more[$wtype."_type"];
                            if(strtoupper($rs_more[$wtype."_type"]) == "P"){//无角球
                                $sta = "T";
                            }else if($wtype.$rs_more[$wtype."_type"] == $rtype){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "RSHA"://第一个点球大战 主队
                    case "RSHB"://第二个点球大战 主队
                    case "RSHC"://第三个点球大战 主队
                    case "RSHD"://第四个点球大战 主队
                    case "RSHE"://第五个点球大战 主队
                    case "RSHF"://第六个点球大战 主队
                    case "RSHG"://第七个点球大战 主队
                    case "RSHH"://第八个点球大战 主队
                    case "RSHI"://第九个点球大战 主队
                    case "RSHJ"://第十个点球大战 主队
                    case "RSHk"://第十一个点球大战 主队
                    case "RSHL"://第十二个点球大战 主队
                    case "RSHM"://第十三个点球大战 主队
                    case "RSHN"://第十四个点球大战 主队
                    case "RSHO"://第十五个点球大战 主队
                        if ($m["is_inball"] == 1 && !empty($rs_more["{$wtype}_type"])) {
                            $inball = $wtype."|".$rs_more[$wtype."_type"];
                            $rs_type = strtoupper($rs_more["{$wtype}_type"]);
                            if($rs_type=="P"){//无点球
                                $sta = "T";
                            }else if($wtype.$rs_type == $rtype){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    /*其他玩法 和比分无关 - 结束*/

                    /*网球 特殊结算 - start*/
                    //$rs_more
                    default:
                        switch ($gtype){
                            case "TN":
                                $rfs = ["RFA","RFB","RFC","RFD","RFE"];//网球 第某盘 第某局
                                foreach ($rfs as $rf){
                                    if(strpos($wtype,$rf)!==false){
                                        if($m["is_inball"] == 1 && !empty($rs_more[$rf])){
                                            $num = intval(str_replace($rf,"",$wtype))-1;
                                            $in_type = $rs_more[$rf][$num]["type"];
                                            $inball = $wtype."|".$in_type;
                                            if($in_type == "N/A"){
                                                $sta = "T";
                                            }else{
                                                if($rtype==$wtype.$in_type){
                                                    $sta = "W";
                                                }else{
                                                    $sta = "L";
                                                }
                                            }

                                        }
                                    }
                                }
                                break;
                            case "SK":
                                $f = [];
                                for($n=1;$n<=35;$n++){
                                    if($n<10){
                                        $f[] = "F0".$n;
                                    }else{
                                        $f[] = "F".$n;
                                    }
                                }

                                $wtype = str_replace("RF","F",$wtype);

                                if(in_array($wtype,$f)){
                                    if($m["is_inball"] == 1 && !empty($rs_more[$wtype."_type"])){
                                        $inball = $wtype."|".$rs_more[$wtype."_type"];
                                        $rtype  = str_replace("RF","F",$rtype);
                                        switch ($rs_more[$wtype."_type"]){
                                            case "H":
                                                if($rtype==$wtype."H"){
                                                    $sta = "W";
                                                }else{
                                                    $sta = "L";
                                                }
                                                break;
                                            case "C":
                                                if($rtype==$wtype."C"){
                                                    $sta = "W";
                                                }else{
                                                    $sta = "L";
                                                }
                                                break;
                                        }
                                    }
                                }
                                break;
                        }


                        break;
                    /*网球 特殊结算 - end*/
                }

                if(!empty($sta)) {
                    if($betType=="bet") {
                        $wingold = 0;//输赢金额
                        $valid_gold = 0;//有效金额
                        $cancel = 0;//赛事是否取消
                        $mem_result = 0;//会员退水后金额
                        $mem_win_gold = 0;//退水前输赢金额
                        $agent_result = 0;
                        $ag_result = 0;//代理结果
                        $su_result = 0;//总代结果
                        $co_result = 0;//股东结果
                        $d0_result = 0;//分公司结果

                        if ($sta == "T") { //退还/和局
                            if ($m["status"] > 0) { //赛事取消
                                $cancel = 1;
                            }
                            $pay_gold = $b["bet_golds"];
                        } else {
                            $isTurnBetGold = "N";//是否退还本金 Y:需要,N:不需要
                            switch (strtoupper($sta)) {
                                case "W"://赢
                                    $wingold = $b["win_gold"];
                                    $valid_gold = $wingold;
                                    $isTurnBetGold = "Y";
                                    break;
                                case "L"://输
                                    $wingold = 0 - $b["bet_golds"];
                                    $valid_gold = $b["bet_golds"];
                                    switch ($b["odd_f_type"]) {
                                        case 'M'://马来盘
                                        case "I"://印尼盘
                                            if($b["ioratio"]<0){ 
                                                $wingold = $b["bet_golds"]*$b["ioratio"];
                                            }
                                            break;
                                    }
                                    break;
                                case "HW"://赢一半
                                    $wingold = $b["win_gold"] * 0.5;
                                    $valid_gold = $wingold;
                                    $isTurnBetGold = "Y";
                                    break;
                                case "HL"://输一半
                                    $wingold = 0 - $b["bet_golds"] * 0.5;
                                    $valid_gold = $b["bet_golds"] * 0.5;
                                    switch ($b["odd_f_type"]) {
                                        case 'M'://马来盘
                                        case "I"://印尼盘
                                            if($b["ioratio"]<0){ 
                                                $wingold = $b["bet_golds"]*$b["ioratio"]*0.5;
                                            }
                                            break;
                                    }
                                    break;
                            }
                            $mem_win_gold = $wingold;
                            //print_r($b["ID"]."--".$valid_gold."--".$b["mem_turn_rate"]);exit;
                            $mem_turn_rate = $valid_gold * floatval($b["mem_turn_rate"]) / 100;//会员退水金额 = 有效金额*会员退水%
                            $mem_result = $wingold + $mem_turn_rate;//会员结果 = 输赢金额 + 会员退水金额
                            //print_r($mem_result);exit;
                            if ($mem_result > 0) { //赢表示还需要退还现金玩家的本金
                                $pay_gold = $b["bet_golds"] + $mem_result;
                            } else {
                                if(strtoupper($sta)=="HL"){ //输一半 退还一半的现金额度
                                    $pay_gold = $valid_gold + $mem_turn_rate;
                                }else{
                                    $pay_gold = $mem_turn_rate;
                                }

                            }
						
							
                            $agent_result = $mem_result + ($b["ag_turn_rate"] - $b["mem_turn_rate"]) * $valid_gold / 100;//上交金额 = 会员结果 + (代理商退水%-会员退水%)*有效金额
                            $ag_result = $agent_result * (100 - $b["ag_point"]) / 100; //代理结果 = 上级输赢 * (100-代理占成%)
                            //总代理结果 = 代理输赢*(100%-代理占成%-总代理占成%) + (总代退水% - 代理退水%)*有效金额
                            $su_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"]) / 100 + ($b["su_turn_rate"] - $b["ag_turn_rate"]) * $valid_gold / 100;
                            //股东结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                            $co_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"] - $b["co_point"]) / 100 + ($b["co_turn_rate"] - $b["su_turn_rate"]) * $valid_gold / 100;
                            //分公司结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                            $d0_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"] - $b["co_point"] - $b["d0_point"]) / 100 + ($b["d0_turn_rate"] - $b["co_turn_rate"]) * $valid_gold / 100;
                        }


                        $up = [
                            "status" => $m["status"],
                            "valid_gold" => round($valid_gold,4),//有效金额
                            "mem_result" => round($mem_result,4),//退水后输赢
                            "mem_win_gold" => round($mem_win_gold,4),//退水前输赢
                            "agent_result" => round($agent_result,4),
                            "ag_result" => round($ag_result,4),
                            "su_result" => round($su_result,4),
                            "co_result" => round($co_result,4),
                            "d0_result" => round($d0_result,4),
                            "inball" => $inball,
                            "isResult" => 1,
                            "result" => $sta
                        ];
                        /*if($b["ID"]==75920){
                            print_r($up);exit;
                        }*/
                        $this->dbc->update($this->bet_table,$up,"`ID`={$b["ID"]}");
                    }else{//串关表
                        $up = [
                            "status" => $m["status"],
                            "isResult" => 1,
                            "inball" => $inball,
                            "result" => $sta
                        ];
                        $this->dbc->update($this->bet_p3_table,$up,"`ID`={$b["ID"]}");
                    }
                }
            }
            if($pay_gold>0 && !empty($sta)){//现金玩家更新金额
                $memTable = Constant::T_MEMBER;
                $pay = round($pay_gold,2);
                $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$pay}),`balance_credit`=(`balance_credit`+{$pay}) WHERE `nid`='{$b["nid"]}' AND `pay_type`=1";
                $this->set_credit_logs($b["nid"],$pay);
                $this->dbc->execSql($sql);
            }

            $this->dbc->commit();
            if(!empty($sta)){
                return ["status"=>"ok"];
            }else{
                return ["status"=>"no"];
            }

        }catch (\Exception $e){
            $this->dbc->rollback();
            return ["status"=>"error","msg"=>$e->getMessage()];
        }


        return $num;
    }

    /**
     * 最先/最后 后台结算
     * @param $_type0
     * @param $rtype
     * @return string[]
     */
    public function getSP_AD($_type0,$rtype){
        $sta = "";
        $inball = "";
        if(!empty($_type0)){
            $rtype = strtoupper($rtype);
            $pgfAry = ["PGFH","PGFC","PGFN"];//最先进球
            $pglAry = ["PGLH","PGLC","PGLN"];//最后进球
            if(in_array($rtype,$pgfAry)){
                $inball = "PGF|".$_type0;
                $pgf = strtoupper($_type0);
                switch ($rtype){
                    case "PGFH":
                        if($pgf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "PGFC":
                        if($pgf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "PGFN":
                        if($pgf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$pglAry)){
                $inball = "PGL|".$_type0;
                $pgf = strtoupper($_type0);
                switch ($rtype){
                    case "PGLH":
                        if($pgf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "PGLC":
                        if($pgf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "PGLN":
                        if($pgf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }

            $stfAry = ["STFH","STFC","STFN"];//最先越位球员
            $stlAry = ["STLH","STLC","STLN"];//最后越位球员

            if(in_array($rtype,$stfAry)){
                $inball = "STF|".$_type0;
                $stf = strtoupper($_type0);
                switch ($rtype){
                    case "STFH":
                        if($stf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "STFC":
                        if($stf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "STFN":
                        if($stf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$stlAry)){
                $inball = "STL|".$_type0;
                $stf = strtoupper($_type0);
                switch ($rtype){
                    case "STLH":
                        if($stf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "STLC":
                        if($stf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "STLN":
                        if($stf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }

            $cnfAry = ["CNFH","CNFC","CNFN"];//第一颗角球
            $cnlAry = ["CNLH","CNLC","CNLN"];//最后一颗角球

            if(in_array($rtype,$cnfAry)){
                $inball = "CNF|".$_type0;
                $cnf = strtoupper($_type0);
                switch ($rtype){
                    case "CNFH":
                        if($cnf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CNFC":
                        if($cnf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CNFN":
                        if($cnf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$cnlAry)){
                $inball = "CNL|".$_type0;
                $cnf = strtoupper($_type0);
                switch ($rtype){
                    case "CNLH":
                        if($cnf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CNLC":
                        if($cnf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CNLN":
                        if($cnf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }
                //print_r($cnf."==".$sta."==".$rtype);exit;
                return ["sta"=>$sta,"inball"=>$inball];
            }

            $cdfAry = ["CDFH","CDFC","CDFN"];//第一张罚牌
            $cdlAry = ["CDLH","CDLC","CDLN"];//最后一张罚牌
            if(in_array($rtype,$cdfAry)){
                $inball = "CDF|".$_type0;
                $cdf = strtoupper($_type0);
                switch ($rtype){
                    case "CDFH":
                        if($cdf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CDFC":
                        if($cdf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CDFN":
                        if($cdf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$cdlAry)){
                $inball = "CDL|".$_type0;
                $cdf = strtoupper($_type0);
                switch ($rtype){
                    case "CDLH":
                        if($cdf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CDLC":
                        if($cdf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CDLN":
                        if($cdf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }

            $rcfAry = ["RCFH","RCFC"];//最先任意球
            $rclAry = ["RCLH","RCLC"];//最后任意球
            if(in_array($rtype,$rcfAry)){
                $inball = "RCF|".$_type0;
                $rcf = strtoupper($_type0);
                switch ($rtype){
                    case "RCFH":
                        if($rcf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "RCFC":
                        if($rcf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "RCFN":
                        if($rcf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$rclAry)){
                $inball = "RCL|".$_type0;
                $rcf = strtoupper($_type0);
                switch ($rtype){
                    case "RCLH":
                        if($rcf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "RCLC":
                        if($rcf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "RCLN":
                        if($rcf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }

            $ycfAry = ["YCFH","YCFC"];//第一张黄卡
            $yclAry = ["YCLH","YCLC"];//最后一张黄卡
            if(in_array($rtype,$ycfAry)){
                $inball = "YCF|".$_type0;
                $ycf = strtoupper($_type0);
                switch ($rtype){
                    case "YCFH":
                        if($ycf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "YCFC":
                        if($ycf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "YCFN":
                        if($ycf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$yclAry)){
                $inball = "YCL|".$_type0;
                $ycf = strtoupper($_type0);
                switch ($rtype){
                    case "YCLH":
                        if($ycf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "YCLC":
                        if($ycf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "YCLN":
                        if($ycf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }


            $gafAry = ["GAFH","GAFC"];//最先球门球
            $galAry = ["GALH","GALC"];//最后球门球
            if(in_array($rtype,$gafAry)){
                $inball = "GAF|".$_type0;
                $gaf = strtoupper($_type0);
                switch ($rtype){
                    case "GAFH":
                        if($gaf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "GAFC":
                        if($gaf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "GAFN":
                        if($gaf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$galAry)){
                $inball = "GAL|".$_type0;
                $gaf = strtoupper($_type0);
                switch ($rtype){
                    case "GALH":
                        if($gaf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "GALC":
                        if($gaf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "GALN":
                        if($gaf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
        }

        return ["sta"=>$sta,"inball"=>$inball];
    }

    /**
     * 最先/最后
     * @param $more
     * @param $rtype
     * @return string
     */
    public function getSP($rs_more,$rtype){
        $sta = "";
        $rtype = strtoupper($rtype);
        $pgfAry = ["PGFH","PGFC","PGFN"];//最先进球
        $pglAry = ["PGLH","PGLC","PGLN"];//最后进球
        $inball = "";
        if(isset($rs_more["PGF_type"]) && !empty($rs_more["PGF_type"])  && in_array($rtype,$pgfAry)){
            $inball = "PGF|".$rs_more["PGF_type"];
            $pgf = strtoupper($rs_more["PGF_type"]);
            switch ($rtype){
                case "PGFH":
                    if($pgf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "PGFC":
                    if($pgf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "PGFN":
                    if($pgf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["PGL_type"]) && !empty($rs_more["PGL_type"]) && in_array($rtype,$pglAry)){
            $inball = "PGL|".$rs_more["PGL_type"];
            $pgf = strtoupper($rs_more["PGL_type"]);
            switch ($rtype){
                case "PGLH":
                    if($pgf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "PGLC":
                    if($pgf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "PGLN":
                    if($pgf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }

        $stfAry = ["STFH","STFC","STFN"];//最先越位球员
        $stlAry = ["STLH","STLC","STLN"];//最后越位球员

        if(isset($rs_more["STF_type"]) && !empty($rs_more["STF_type"]) && in_array($rtype,$stfAry)){
            $inball = "STF|".$rs_more["STF_type"];
            $stf = strtoupper($rs_more["STF_type"]);
            switch ($rtype){
                case "STFH":
                    if($stf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "STFC":
                    if($stf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "STFN":
                    if($stf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["STL_type"]) && !empty($rs_more["STL_type"]) && in_array($rtype,$stlAry)){
            $inball = "STL|".$rs_more["STL_type"];
            $stf = strtoupper($rs_more["STL_type"]);
            switch ($rtype){
                case "STLH":
                    if($stf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "STLC":
                    if($stf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "STLN":
                    if($stf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }

        $cnfAry = ["CNFH","CNFC","CNFN"];//第一颗角球
        $cnlAry = ["CNLH","CNLC","CNLN"];//最后一颗角球

        if(isset($rs_more["CNF_type"]) && !empty($rs_more["CNF_type"]) && in_array($rtype,$cnfAry)){
            $inball = "CNF|".$rs_more["CNF_type"];
            $cnf = strtoupper($rs_more["CNF_type"]);
            switch ($rtype){
                case "CNFH":
                    if($cnf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CNFC":
                    if($cnf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CNFN":
                    if($cnf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["CNL_type"]) && !empty($rs_more["CNL_type"]) && in_array($rtype,$cnlAry)){
            $inball = "CNL|".$rs_more["CNL_type"];
            $cnf = strtoupper($rs_more["CNL_type"]);
            switch ($rtype){
                case "CNLH":
                    if($cnf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CNLC":
                    if($cnf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CNLN":
                    if($cnf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }
            //print_r($cnf."==".$sta."==".$rtype);exit;
            return ["sta"=>$sta,"inball"=>$inball];
        }

        $cdfAry = ["CDFH","CDFC","CDFN"];//第一张罚牌
        $cdlAry = ["CDLH","CDLC","CDLN"];//最后一张罚牌
        if(isset($rs_more["CDF_type"]) && !empty($rs_more["CDF_type"]) && in_array($rtype,$cdfAry)){
            $inball = "CDF|".$rs_more["CDF_type"];
            $cdf = strtoupper($rs_more["CDF_type"]);
            switch ($rtype){
                case "CDFH":
                    if($cdf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CDFC":
                    if($cdf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CDFN":
                    if($cdf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["CDL_type"]) && !empty($rs_more["CDL_type"]) && in_array($rtype,$cdlAry)){
            $inball = "CDL|".$rs_more["CDL_type"];
            $cdf = strtoupper($rs_more["CDL_type"]);
            switch ($rtype){
                case "CDLH":
                    if($cdf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CDLC":
                    if($cdf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CDLN":
                    if($cdf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }

        $rcfAry = ["RCFH","RCFC"];//最先任意球
        $rclAry = ["RCLH","RCLC"];//最后任意球
        if(isset($rs_more["RCF_type"]) && !empty($rs_more["RCF_type"]) && in_array($rtype,$rcfAry)){
            $inball = "RCF|".$rs_more["RCF_type"];
            $rcf = strtoupper($rs_more["RCF_type"]);
            switch ($rtype){
                case "RCFH":
                    if($rcf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "RCFC":
                    if($rcf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "RCFN":
                    if($rcf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["RCL_type"]) && !empty($rs_more["RCL_type"]) && in_array($rtype,$rclAry)){
            $inball = "RCL|".$rs_more["RCL_type"];
            $rcf = strtoupper($rs_more["RCL_type"]);
            switch ($rtype){
                case "RCLH":
                    if($rcf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "RCLC":
                    if($rcf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "RCLN":
                    if($rcf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }

        $ycfAry = ["YCFH","YCFC"];//第一张黄卡
        $yclAry = ["YCLH","YCLC"];//最后一张黄卡
        if(isset($rs_more["YCF_type"]) && !empty($rs_more["YCF_type"]) && in_array($rtype,$ycfAry)){
            $inball = "YCF|".$rs_more["YCF_type"];
            $ycf = strtoupper($rs_more["YCF_type"]);
            switch ($rtype){
                case "YCFH":
                    if($ycf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "YCFC":
                    if($ycf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "YCFN":
                    if($ycf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["YCL_type"]) && !empty($rs_more["YCL_type"]) && in_array($rtype,$yclAry)){
            $inball = "YCL|".$rs_more["YCL_type"];
            $ycf = strtoupper($rs_more["YCL_type"]);
            switch ($rtype){
                case "YCLH":
                    if($ycf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "YCLC":
                    if($ycf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "YCLN":
                    if($ycf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }


        $gafAry = ["GAFH","GAFC"];//最先球门球
        $galAry = ["GALH","GALC"];//最后球门球
        if(isset($rs_more["GAF_type"]) && !empty($rs_more["GAF_type"]) && in_array($rtype,$gafAry)){
            $inball = "GAF|".$rs_more["GAF_type"];
            $gaf = strtoupper($rs_more["GAF_type"]);
            switch ($rtype){
                case "GAFH":
                    if($gaf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "GAFC":
                    if($gaf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "GAFN":
                    if($gaf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["GAL_type"]) && !empty($rs_more["GAL_type"]) && in_array($rtype,$galAry)){
            $inball = "GAL|".$rs_more["GAL_type"];
            $gaf = strtoupper($rs_more["GAL_type"]);
            switch ($rtype){
                case "GALH":
                    if($gaf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "GALC":
                    if($gaf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "GALN":
                    if($gaf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }


        return ["sta"=>$sta,"inball"=>$inball];
    }

    /**
     * 进球 大 / 小 & 最先进球
     * @param $h
     * @param $c
     * @param $rtype
     * @param $mtype
     * @return string
     */
    public function getOUP($h,$c,$rtype,$mtype){
        $rtype = strtoupper($rtype);
        $mtype = strtoupper($mtype);
        $sta = "";
        $sum = $h + $c;
        switch ($rtype){
            //进球 大 / 小 1.5 & 最先进球
            case "OUPAOH":
            case "RUPAOH":
                if($sum>1.5 && $mtype=="HOME"){
                    $sta = "W";
                }
                break;
            case "OUPAOC":
            case "RUPAOC":
                if($sum>1.5 && $mtype=="AWAY"){
                    $sta = "W";
                }
                break;
            case "OUPAUH":
            case "RUPAUH":
                if($sum<1.5 && $mtype=="HOME"){
                    $sta = "W";
                }
                break;
            case "OUPAUC":
            case "RUPAUC":
                if($sum<1.5 && $mtype=="AWAY"){
                    $sta = "W";
                }
                break;

            //进球 大 / 小 2.5 & 最先进球
            case "OUPBOH":
            case "RUPBOH":
                if($sum>2.5 && $mtype=="HOME"){
                    $sta = "W";
                }
                break;
            case "OUPBOC":
            case "RUPBOC":
                if($sum>2.5 && $mtype=="AWAY"){
                    $sta = "W";
                }
                break;
            case "OUPBUH":
            case "RUPBUH":
                if($sum<2.5 && $mtype=="HOME"){
                    $sta = "W";
                }
                break;
            case "OUPBUC":
            case "RUPBUC":
                if($sum<2.5 && $mtype=="AWAY"){
                    $sta = "W";
                }
                break;

            //进球 大 / 小 3.5 & 最先进球
            case "OUPCOH":
            case "RUPCOH":
                if($sum>3.5 && $mtype=="HOME"){
                    $sta = "W";
                }
                break;
            case "OUPCOC":
            case "RUPCOC":
                if($sum>3.5 && $mtype=="AWAY"){
                    $sta = "W";
                }
                break;
            case "OUPCUH":
            case "RUPCUH":
                if($sum<3.5 && $mtype=="HOME"){
                    $sta = "W";
                }
                break;
            case "OUPCUC":
            case "RUPCUC":
                if($sum<3.5 && $mtype=="AWAY"){
                    $sta = "W";
                }
                break;

            //进球 大 / 小 4.5 & 最先进球
            case "OUPDOH":
            case "RUPDOH":
                if($sum>4.5 && $mtype=="HOME"){
                    $sta = "W";
                }
                break;
            case "OUPDOC":
            case "RUPDOC":
                if($sum>4.5 && $mtype=="AWAY"){
                    $sta = "W";
                }
                break;
            case "OUPDUH":
            case "RUPDUH":
                if($sum<4.5 && $mtype=="HOME"){
                    $sta = "W";
                }
                break;
            case "OUPDUC":
            case "RUPDUC":
                if($sum<4.5 && $mtype=="AWAY"){
                    $sta = "W";
                }
                break;
        }
        return $sta;
    }

    /**
     * 双重机会 & 最先进球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getDG($h,$c,$rtype,$mtype){
        $rtype = strtoupper($rtype);
        $mtype = strtoupper($mtype);
        $rtype = str_replace("R","",$rtype);//去除滚球前的R
        $sta = "";
        $kk = $h- $c;
        switch ($rtype){
            case "DGHH":
                if(($kk>0 || $kk==0) && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DGHC":
                if(($kk>0 || $kk==0) && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DGCH":
                if(($kk<0 || $kk==0) && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DGCC":
                if(($kk<0 || $kk==0) && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DGSH":
                if($kk!=0 && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DGSC":
                if($kk!=0 && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 双重机会 & 双方球队进球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getDS($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $rtype = str_replace("R","",$rtype);//去除滚球前的R
        $sta = "";
        $kk = $h- $c;
        switch ($rtype){
            case "DSHY":
                if(($kk>0 || $kk==0) && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DSHN":
                if(($kk>0 || $kk==0) && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DSCY":
                if(($kk<0 || $kk==0) && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DSCN":
                if(($kk<0 || $kk==0) && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DSSY":
                if($kk!=0 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DSSN":
                if($kk!=0 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 独赢 & 最先进球
     * @param $h
     * @param $c
     * @param $rtype
     * @param $mtype
     * @return string
     */
    public function getMPG($h,$c,$rtype,$mtype){
        $rtype = strtoupper($rtype);
        $mtype = strtoupper($mtype);
        $rtype = str_replace("R","",$rtype);//去除滚球前的R
        $kk = $h- $c;
        $sta = "";
        switch ($rtype){
            case "MPGHH":
                if($kk>0 && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MPGHC":
                if($kk>0 && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MPGCH":
                if($kk<0 && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MPGCC":
                if($kk<0 && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MPGNH":
                if($kk==0 && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MPGNC":
                if($kk==0 && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 双重机会 & 进球 大 / 小
     * @param $h
     * @param $c
     * @param $rtype
     */
    public function getDU($h,$c,$rtype)
    {
        $rtype = strtoupper($rtype);
        $rtype = str_replace("R","",$rtype);//去除滚球前的R
        $sum = $h + $c;
        $kk  = $h - $c;
        $sta = "";
        switch ($rtype) {
            //双重机会 & 进球 大 / 小 1.5
            case "DUAHO":
                if(($kk>0 || $kk == 0) && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUAHU":
                if(($kk>0 || $kk == 0) && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUACO":
                if(($kk<0 || $kk == 0) && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUACU":
                if(($kk<0 || $kk == 0) && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUASO":
                if($kk != 0 && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUASU":
                if($kk != 0 && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //双重机会 & 进球 大 / 小 2.5
            case "DUBHO":
                if(($kk>0 || $kk == 0) && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUBHU":
                if(($kk>0 || $kk == 0) && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUBCO":
                if(($kk<0 || $kk == 0) && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUBCU":
                if(($kk<0 || $kk == 0) && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUBSO":
                if($kk != 0 && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUBSU":
                if($kk != 0 && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //双重机会 & 进球 大 / 小 3.5
            case "DUCHO":
                if(($kk>0 || $kk == 0) && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUCHU":
                if(($kk>0 || $kk == 0) && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUCCO":
                if(($kk<0 || $kk == 0) && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUCCU":
                if(($kk<0 || $kk == 0) && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUCSO":
                if($kk != 0 && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUCSU":
                if($kk != 0 && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //双重机会 & 进球 大 / 小 4.5
            case "DUDHO":
                if(($kk>0 || $kk == 0) && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUDHU":
                if(($kk>0 || $kk == 0) && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUDCO":
                if(($kk<0 || $kk == 0) && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUDCU":
                if(($kk<0 || $kk == 0) && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUDSO":
                if($kk != 0 && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUDSU":
                if($kk != 0 && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 进球 大 / 小 & 进球 单 / 双
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getOUE($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $sum = $h + $c;
        $sta = "";
        switch ($rtype) {
            //进球 大 / 小 1.5 & 进球 单 / 双
            case "OUEAOO":
            case "RUEAOO":
                if($sum>1.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEAUO":
            case "RUEAUO":
                if($sum<1.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEAOE":
            case "RUEAOE":
                if($sum>1.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEAUE":
            case "RUEAUE":
                if($sum<1.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 2.5 & 进球 单 / 双
            case "OUEBOO":
            case "RUEBOO":
                if($sum>2.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEBUO":
            case "RUEBUO":
                if($sum<2.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEBOE":
            case "RUEBOE":
                if($sum>2.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEBUE":
            case "RUEBUE":
                if($sum<2.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 3.5 & 进球 单 / 双
            case "OUECOO":
            case "RUECOO":
                if($sum>3.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUECUO":
            case "RUECUO":
                if($sum<3.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUECOE":
            case "RUECOE":
                if($sum>3.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUECUE":
            case "RUECUE":
                if($sum<3.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 4.5 & 进球 单 / 双
            case "OUEDOO":
            case "RUEDOO":
                if($sum>4.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEDUO":
            case "RUEDUO":
                if($sum<4.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEDOE":
            case "RUEDOE":
                if($sum>4.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEDUE":
            case "RUEDUE":
                if($sum<4.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 进球 大 / 小 & 双方球队进球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getOUT($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $sum = $h + $c;
        $sta = "";
        switch ($rtype){
            //进球 大 / 小 1.5 & 双方球队进球
            case "OUTAOY":
            case "RUTAOY":
                if($sum>1.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTAON":
            case "RUTAON":
                if($sum>1.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTAUY":
            case "RUTAUY":
                if($sum<1.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTAUN":
            case "RUTAUN":
                if($sum<1.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 2.5 & 双方球队进球
            case "OUTBOY":
            case "RUTBOY":
                if($sum>2.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTBON":
            case "RUTBON":
                if($sum>2.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTBUY":
            case "RUTBUY":
                if($sum<2.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTBUN":
            case "RUTBUN":
                if($sum<2.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 3.5 & 双方球队进球
            case "OUTCOY":
            case "RUTCOY":
                if($sum>3.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTCON":
            case "RUTCON":
                if($sum>3.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTCUY":
            case "RUTCUY":
                if($sum<3.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTCUN":
            case "RUTCUN":
                if($sum<3.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 4.5 & 双方球队进球
            case "OUTDOY":
            case "RUTDOY":
                if($sum>4.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTDON":
            case "RUTDON":
                if($sum>4.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTDUY":
            case "RUTDUY":
                if($sum<4.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTDUN":
            case "RUTDUN":
                if($sum<4.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 独赢 & 双方球队进球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getMTS($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $kk  = $h - $c;
        $sum = $h + $c;
        $sta = "";
        $rtype = str_replace("R","",$rtype);//去除滚球前的R
        switch ($rtype){
            case "MTSHY":
                if($kk>0 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MTSHN":
                if($kk>0 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MTSCY":
                if($kk<0 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MTSCN":
                if($kk<0 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MTSNY":
                if($kk==0 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MTSNN":
                if($kk==0 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 独赢 & 进球 大 / 小
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getMOU($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $kk  = $h - $c;
        $sum = $h + $c;
        $sta = "";
        switch ($rtype){
            //独赢 & 进球 大 / 小 1.5
            case "MOUAHO":
            case "RMUAHO":
                if($kk>0 && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUAHU":
            case "RMUAHU":
                if($kk>0 && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUACO":
            case "RMUACO":
                if($kk<0 && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUACU":
            case "RMUACU":
                if($kk<0 && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUANO":
            case "RMUANO":
                if($kk==0 && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUANU":
            case "RMUANU":
                if($kk==0 && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //独赢 & 进球 大 / 小 2.5
            case "MOUBHO":
            case "RMUBHO":
                if($kk>0 && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUBHU":
            case "RMUBHU":
                if($kk>0 && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUBCO":
            case "RMUBCO":
                if($kk<0 && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUBCU":
            case "RMUBCU":
                if($kk<0 && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUBNO":
            case "RMUBNO":
                if($kk==0 && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUBNU":
            case "RMUBNU":
                if($kk==0 && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //独赢 & 进球 大 / 小 3.5
            case "MOUCHO":
            case "RMUCHO":
                if($kk>0 && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUCHU":
            case "RMUCHU":
                if($kk>0 && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUCCO":
            case "RMUCCO":
                if($kk<0 && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUCCU":
            case "RMUCCU":
                if($kk<0 && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUCNO":
            case "RMUCNO":
                if($kk==0 && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUCNU":
            case "RMUCNU":
                if($kk==0 && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //独赢 & 进球 大 / 小 4.5
            case "MOUDHO":
            case "RMUDHO":
                if($kk>0 && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUDHU":
            case "RMUDHU":
                if($kk>0 && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUDCO":
            case "RMUDCO":
                if($kk<0 && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUDCU":
            case "RMUDCU":
                if($kk<0 && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUDNO":
            case "RMUDNO":
                if($kk==0 && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUDNU":
            case "RMUDNU":
                if($kk==0 && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 双半场进球
     * @param $h
     * @param $c
     * @param $h_hr
     * @param $c_hr
     * @param $rtype
     * @return string
     */
    public function getSB($h,$c,$h_hr,$c_hr,$rtype){
        $rtype = strtoupper($rtype);
        $h1 = $h - $h_hr;
        $c1 = $c - $c_hr;
        $hAry = ["SBH","RSBH"];
        $cAry = ["SBC","RSBC"];
        $sta = "";
        if(in_array($rtype,$hAry)){
            if($h1>0 && $h_hr>0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif(in_array($rtype,$cAry)){
            if($c1>0 && $c_hr>0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 零失球获胜
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getWN($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $hAry = ["WNH","RWNH"];
        $cAry = ["WNC","RWNC"];
        $sta = "";
        if(in_array($rtype,$hAry)){//主队零失球获胜
            if($c==0 && $h>$c){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif(in_array($rtype,$cAry)){
            if($h==0 && $c>$h){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 零失球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getCS($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $hAry = ["CSH","RCSH"];
        $cAry = ["CSC","RCSC"];
        $sta = "";
        if(in_array($rtype,$hAry)){//主队零失球
            if($c==0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif(in_array($rtype,$cAry)){
            if($h==0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 赢得所有半场
     * @param $h
     * @param $c
     * @param $h_hr
     * @param $c_hr
     * @param $rtype
     * @return string
     */
    public function getWB($h,$c,$h_hr,$c_hr,$rtype){
        $h1 = $h_hr - $c_hr;
        $h2 = ($h-$h_hr) - ($c-$c_hr);
        $hAry = ["WBH","RWBH"];
        $cAry = ["WBC","RWBC"];
        $rtype = strtoupper($rtype);
        $sta = "";
        if(in_array($rtype,$hAry)){
            if($h1>0 && $h2>0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif(in_array($rtype,$cAry)){
            if($h1<0 && $h2<0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 赢得任一半场
     * @param $h
     * @param $c
     * @param $h_hr
     * @param $c_hr
     * @param $rtype
     * @return string
     */
    public function getWE($h,$c,$h_hr,$c_hr,$rtype){
        $h1 = $h_hr - $c_hr;
        $h2 = ($h-$h_hr) - ($c-$c_hr);
        $hAry = ["WEH","RWEH"];
        $cAry = ["WEC","RWEC"];
        $rtype = strtoupper($rtype);
        $sta = "";
        if(in_array($rtype,$hAry)){
            if($h1>0 || $h2>0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif(in_array($rtype,$cAry)){
            if($h1<0 || $h2<0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 双重机会
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getDC($h,$c,$rtype){
        $sta = "";
        $rtype = strtoupper($rtype);
        $hn = ["DCHN","RDCHN"];//主/和
        $cn = ["DCCN","RDCCN"];//客/和
        $hc = ["DCHC","RDCHC"];//主/客
        $kk = $h - $c;
        if($kk>0){
            if(in_array($rtype,$hn) || in_array($rtype,$hc)){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif($kk<0){
            if(in_array($rtype,$cn) || in_array($rtype,$hc)){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }else{
            if(in_array($rtype,$hn) || in_array($rtype,$cn)){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 净胜球数
     * @param $h
     * @param $c
     * @param $rtype
     * @param $wtype
     * @param $gtype
     * @return string
     */
    public function getWM($h,$c,$rtype,$wtype,$gtype){
        $rtype = strtoupper($rtype);
        $wtype = strtoupper($wtype);
        $gtype = strtoupper($gtype);
        $num = 3;
        if($gtype == "BS"){
            $num = 4;
        }

        $kk = $h - $c;
        $_rtype = "";
        if($h == 0 && $c == 0){
            $_rtype = 0;
        }else{
            if($kk>0){//主队净胜
                if($kk<=$num) {
                    $_rtype = "H" . $kk;
                }else{
                    $_rtype = "HOV";
                }
            }else if($kk<0){//客队净胜
                if(abs($kk)<=$num) {
                    $_rtype = "C" . abs($kk);
                }else{
                    $_rtype = "COV";
                }
            }else{
                $_rtype = "N";
            }
        }
        if($wtype.$_rtype == $rtype){
            $sta = "W";
        }else{
            $sta = "L";
        }

        return $sta;
    }

    /**
     * 波胆
     * @param $h
     * @param $c
     * @param $rtype
     * @param $wtype
     * @param $gtype
     * @return string
     */
    public function getPD($h,$c,$rtype,$wtype,$gtype="FT"){
        $sta = "";
        $rtype = strtoupper($rtype);
        $wtype = strtoupper($wtype);
        $gtype = strtoupper($gtype);
        switch ($gtype){
            case "BK":
                $rtype = str_replace("R","",$rtype);//滚球去掉"R"
                $pdh = ["PDH0","PDH1","PDH2","PDH3","PDH4"];
                $pdc = ["PDC0","PDC1","PDC2","PDC3","PDC4"];
                if(in_array($rtype,$pdh)){
                    $str = "PDH".substr($h,-1,1);
                    if($str == $rtype){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if(in_array($rtype,$pdc)){
                    $str = "PDC".substr($h,-1,1);
                    if($str == $rtype){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }
                break;
            case "BM":
            case "VB":
            case "TT":
                $str = $wtype.$h.$c;
                if($rtype == $str){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            default:
                $hc = "H{$h}C{$c}";
                switch ($wtype){
                    case "RPD":
                        $rtype = str_replace("R","",$rtype);
                        break;
                    case "HRPD":
                        $rtype = str_replace("R","",$rtype);
                        break;
                }
                /*print_r($hc);
                print_r($rtype);*/
                if($wtype=="HPD" || $wtype=="HRPD"){//上半
                    if($h>10 || $c>10){//HOVH substr("HROVH",2) = "OVH"
                        $hv = ["OVH","HOVH"];
                        if(in_array($rtype,$hv)){
                            $sta = "W";
                        }else{
                            $sta = "L";
                        }
                    }else{
                        if($rtype == $hc){
                            $sta = "W";
                        }else{
                            $sta = "L";
                        }
                    }
                }else{
                    if($h>20 || $c>20){//OVH substr("ROVH",2) = "OVH"
                        if($rtype=="OVH"){
                            $sta = "W";
                        }else{
                            $sta = "L";
                        }
                    }else{
                        if($rtype == $hc){
                            $sta = "W";
                        }else{
                            $sta = "L";
                        }
                    }
                }
                /*print_r($sta);exit;*/
                break;
        }


        return $sta;

    }

    /**
     * 半全场
     * @param $h
     * @param $c
     * @param $h_hr
     * @param $c_hr
     * @param $rtype
     * @param $wtype
     * @return string
     */
    public function getF($h,$c,$h_hr,$c_hr,$rtype,$wtype){
        $sta = "";
        $rtype = strtoupper($rtype);
        $wtype = strtoupper($wtype);
        $str = "";
        $h1 = $h_hr - $c_hr;//上半场 主队 - 客队
        $h2 = $h - $c;//全场  主队 - 客队

        //上半场
        if($h1>0){ //主队赢
            $str.= "H";
        }elseif($h1<0){//客队赢
            $str.= "C";
        }else{ //和
            $str.= "N";
        }

        //全场
        if($h2>0){ //主队赢
            $str.= "H";
        }elseif($h2<0){//客队赢
            $str.= "C";
        }else{ //和
            $str.= "N";
        }

        if($rtype == $wtype.$str){
            $sta = "W";
        }else{
            $sta = "L";
        }

        return $sta;
    }

    /**
     * 双方球队进球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getTS($h,$c,$rtype){
        $sta = "";
        $rtype = strtoupper($rtype);
        $y = ["TSY","RTSY","HTSY","RTS2Y"];
        $n = ["TSN","RTSN","HTSN","RTS2N"];
        if($h>0 && $c>0){
            if(in_array($rtype,$y)){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }else{
            if(in_array($rtype,$n)){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }



    /**
     * 单双/入球数
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getT($h,$c,$rtype){
        $sum = $h + $c;
        $sta = "";
        switch (strtoupper($rtype)){
            case "ODD"://单
            case "HODD"://单 - 上半
            case "RODD"://滚球 单
            case "HRODD"://滚球 单 - 上半
                if($sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "EVEN"://双
            case "HEVEN"://双 - 上半
            case "REVEN"://滚球 双
            case "HREVEN"://滚球 双 - 上半
                if($sum%2==1){
                    $sta = "L";
                }else{
                    $sta = "W";
                }
                break;
            case "0~1":
            case "R0~1":
                if($sum>=0 && $sum<=1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "2~3":
            case "R2~3":
                if($sum>=2 && $sum<=3){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "4~6":
            case "R4~6":
                if($sum>=4 && $sum<=6){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OVER":
            case "ROVER":
                if($sum>=7){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "HT0":
            case "HRT0":
                if($sum==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "HT1":
            case "HRT1":
                if($sum==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "HT2":
            case "HRT2":
                if($sum==2){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "HTOV":
            case "HRTOV":
                if($sum>=3){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 大小类
     * @param $h 主队比分
     * @param $c 客队比分
     * @param $rtype
     * @param $spread
     * @return string
     */
    public function getOU($h,$c,$rtype,$spread){
        $o = [
            "OUC","HOUC","ROUC","HROUC",
            "AOUO","BOUO","COUO","DOUO","EOUO","FOUO",
            "AROUO","BROUO","CROUO","DROUO","EROUO","FROUO",
            "OUHO","OUCO","HOUHO","HOUCO",
            "ROUHO","ROUCO","HRUHO","HRUCO",
            "TARUO","TBRUO","TDRUO","TERUO",//5分钟盘口 大
        ];

        $u = [
            "OUH","HOUH","ROUH","HROUH",
            "AOUU","BOUU","COUU","DOUU","EOUU","FOUU",
            "AROUU","BROUU","CROUU","DROUU","EROUU","FROUU",
            "OUHU","OUCU","HOUHU","HOUCU",
            "ROUHU","ROUCU","HRUHU","HRUCU",
            "TARUU","TBRUU","TDRUU","TERUU",//5分钟盘口 小
        ];
        $sta = "";
        $spread = str_replace(" ","",$spread);
        $radioAry = explode("/",$spread);
        $rtype = strtoupper($rtype);
        $sum = $h + $c;
        if(count($radioAry) == 1){
            $ra1 = $radioAry[0];
            $kk = $sum - $ra1;
            if($kk>0){
                if(in_array($rtype,$o)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
            }elseif($kk<0){
                if(in_array($rtype,$u)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
            }else{
                $sta = "T";
            }
        }else{
            $ra1 = $radioAry[0];
            $ra2 = $radioAry[1];
            if(ceil($ra1) == $ra1){// 0/0.5
                $kk = $sum - $ra1;
                if($kk>0){
                    if(in_array($rtype,$o)){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if($kk<0){
                    if(in_array($rtype,$u)){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    if(in_array($rtype,$o)){
                        $sta = "HL";
                    }else{
                        $sta = "HW";
                    }
                }
            }else{// 0.5/1
                $kk = $sum - $ra2;
                if($kk>0){
                    if(in_array($rtype,$o)){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if($kk<0){
                    if(in_array($rtype,$u)){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    if(in_array($rtype,$o)){
                        $sta = "HW";
                    }else{
                        $sta = "HL";
                    }
                }
            }
        }

        return $sta;
    }



    /**
     * 让球类
     * @param $h 主队比分
     * @param $c 客队比分
     * @param $strong H:主客比分,C:客主交换比分
     * @param $rtype
     * @param $spread
     * @return string
     */
    public function getR($h,$c,$strong,$rtype,$spread){
        $sta = "T";
        $spread = str_replace(" ","",$spread);
        $radioAry = explode("/",$spread);
        $rtype = strtoupper($rtype);
        $_strong = strtoupper($strong);
        if(strtoupper($_strong) == "C"){//客让主
            $k = $c - $h;
        }else{
            $k = $h - $c;
        }

        $rh = [
            "RH","REH","HRH","HREH",
            "ARH","AREH","BRH","BREH","CRH","CREH","DRH","DREH","ERH","EREH","FRH","FREH"
        ];
        $rc = [
            "RC","REC","HRC","HREC",
            "ARC","AREC","BRC","BREC","CRC","CREC","DRC","DREC","ERC","EREC","FRC","FREC"
        ];

        if(in_array($rtype,$rh)){ //主队
            $chose_team = "H";
        }else{
            $chose_team = "C";
        }

        $strong = "N";
        if ($_strong == "H") {
            if ($chose_team == "H") {
                $strong = "Y";
            } else {
                $strong = "N";
            }
        } else {
            if ($chose_team == "C") {
                $strong = "Y";
            } else {
                $strong = "N";
            }
        }

        if(count($radioAry)==1){
            $ra1 = $radioAry[0];
            $kk = $k - $ra1;

            if(strpos($ra1,".5") !== false){//让半
                //只有大于或小于0 不会存在等于0
                if($kk>0){
                    if($strong=="Y"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    if($strong=="N"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }
            }else{ //让整

                if($kk>0){
                    if($strong=="Y"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if($kk<0){
                    if($strong=="N"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    $sta = "T";
                }
            }

        }else{ // 0/0.5
            $ra1 = $radioAry[0];
            $ra2 = $radioAry[1];

            if(strpos($ra2,".5") !== false) {// 让整/让半(0/0.5)
                $kk = $k - $ra1;
                if($kk>0){
                    if($strong=="Y"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if($kk<0){
                    if($strong=="N"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    if($strong=="Y"){
                        $sta = "HL";//输一半
                    }else{
                        $sta = "HW";//赢一半
                    }
                }
            }else{ // 让半/让整(0.5/1)
                $kk = $k - $ra2;
                if($kk>0){
                    if($strong=="Y"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if($kk<0){
                    if($strong=="N"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    if($strong=="Y"){
                        $sta = "HW";//赢一半
                    }else{
                        $sta = "HL";//输一半
                    }
                }
            }
        }

        return $sta;
    }

    /**
     * 独赢类
     * @param $h 主队比分
     * @param $c 客队比分
     * @param $r rtype
     * @return string
     */
    public function getM($h,$c,$r){
        $h = intval($h);
        $c = intval($c);
        $r = strtoupper($r);
        $s = "T";//T:和,W:赢,L:输

        //主队赢
        $mh = [
            "MH","HMH",
            "RMH","HRMH",
            //15分钟
            "AMH","BMH","CMH","DMH","EMH","FMH",
            "ARMH","BRMH","CRMH","DRMH","ERMH","FRMH",
            //进球最多半场
            "MGH","RMGH","HGH","RHGH"
        ];

        //客队赢
        $mc = [
            "MC","HMC",
            "RMC","HRMC",
            "AMC","BMC","CMC","DMC","EMC","FMC",
            "ARMC","BRMC","CRMC","DRMC","ERMC","FRMC",
            "MGC","RMGC","HGC","RHGC"
        ];

        //和局
        $mn = [
            "MN","HMN",
            "RMN","HRMN",
            "AMN","BMN","CMN","DMN","EMN","FMN",
            "ARMN","BRMN","CRMN","DRMN","ERMN","FRMN",
            "MGN","RMGN",
        ];

        $hgAry = ["HGH","RHGH","HGC","RHGC"];
        $k = $h - $c;
        if($k>0){
            if(in_array($r,$mh)){
                $s = "W";
            }else{
                $s = "L";
            }
        }elseif($k<0){
            if(in_array($r,$mc)){
                $s = "W";
            }else{
                $s = "L";
            }
        }else{
            if(in_array($r,$hgAry)){ //最多进球的半场 和局视为无效
                $s = "T";
            }else{
                if(in_array($r,$mn)){
                    $s = "W";
                }else{
                    $s = "L";
                }
            }

        }

        return $s;
    }



}
