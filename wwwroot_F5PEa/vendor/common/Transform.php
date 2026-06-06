<?php
/**
 * Transform 数据采集
 */

class Transform
{
    private $url = '';//采集地址
    private $curl = '';//curl类
    private $langx = '';//语言
    private $cookie = '';//cookie
    private $globalPost = [];//全局post参数
    public $web = [];//可用的UID集
    private $ltype = 3;
    private $ver = "";//版本号
    private $dbc;
    private $dbs;

    /**
     * Transform constructor.
     * @param $url 采集网址
     * @param $langx 语言
     */
    public function __construct($url="",$langx="zh-cn")
    {
        global $db_c,$db_s;
        $this->url = $url;
        $this->langx  = $langx;
        $this->curl = new Curl_HTTP_Client();
        $this->curl->set_user_agent("Mozilla/5.0 (Windows NT 6.1; Win64; x64)");
        $this->ver = date("Y-m-d-H")."_e2a70f7b-3ed5-ad58-".date("md")."-271au2576be7";
        $this->globalPost = [
            "p" => "",
            "ver" => $this->ver,
            "langx" => $this->langx
        ];
        $this->dbc = $db_c;
        $this->dbs = $db_s;
    }

    /**
     * 随机获取前台采集账号
     */
    public function randFrontCurlUser(){
        global $webdb;
        $this->randUser("front");
    }

    /**
     * 随机选取可用的采集账号
     * @param $webdb
     * @param $type after:后端采集账号组,front:前端采集账号组
     * @return false|mixed
     */
    public function randUser($type="after",$level=0){
        global $default_ip;

        /*if($type=="front"){//前端采集条用数据库
            $rs = $this->dbc->select("SELECT * FROM ".Constant::S_CONFIG." WHERE `id`=1","Row");
            $json = unserialize($rs[$type]);
        }else{*/
            global $webdb;$json = unserialize($webdb)[$type];
        //}
        
        /*$rs = $this->dbc->select("SELECT * FROM ".Constant::S_CONFIG." WHERE `id`=1","Row");
        $json = unserialize($rs[$type]);*/
        $ip_num = explode(".",$default_ip);
        $us = array_column($json,"user");
        $okAry = [];
        switch ($level){
            case 180:
                $json = array_slice(array_reverse($json),0,4);
                break;
            case 60:
                $json = array_slice(array_reverse($json),4,4);
                break;
            default:
                $json = array_slice($json,0,count($json)-8);
                break;
        }

        foreach ($json as $k => $v){
            if($v["status"]=="ok"){
                $okAry[] = $v;
            }
        }

        if(count($okAry)==0){
            //print_r("无可执行的采集UID\n");exit;
            throw new Exception("无可执行的采集UID");
        }

        $key = rand(0,count($okAry)-1);
        $cs = $okAry[$key];
        $num = array_search($cs["user"],$us);
        $cs["ip"] = $ip_num[0].".".$ip_num[1].".".$ip_num[2].".".($ip_num[3]+$num);
        $this->setDefaultWeb($cs);
    }

    /**
     * 设置默认采集账号
     * @param $conn 采集账号配置
     */
    public function setDefaultWeb($conn){
        $this->web = $conn;
        $this->url = $conn["url"];
        if(!empty($conn["ver"])){//设置版本
            $this->ver = $conn["ver"];
            $this->globalPost["ver"] = $conn["ver"];
        }
        
    }



    /**
     * 获取Xml节点值
     * @param $xml
     * @param $str
     * @return mixed
     */
    public function getXmlNode($xml,$str){
        preg_match("/\<{$str}>(.*?)\<\/{$str}>/is",$xml,$arr);
        return isset($arr[1]) ? rtrim($arr[1]) : "";
    }

    /**
     * @param array $post post参数
     * @return bool|string
     */
    public function curlXml($post=[]){
        if(!empty($this->cookie)){
            $this->curl->set_cookie($this->cookie);
        }

        $this->curl->set_referrer($this->url);
        if(!empty($this->web["ip"])){
            $headers = [
                //'CLIENT-IP:'.$this->web["ip"],
                //'X-FORWARDED-FOR:'.$this->web["ip"],
            ];
            $this->curl->set_header($headers);
        }

        $xml=$this->curl->send_post_data($this->url."/transform.php",$post,"",10);

        /*if(strpos($xml,"doubleLogin") !== false){
            sleep(1);
            $this->randUser();
            $post["uid"] = $this->web["uid"];
            return $this->curlXml($post);
        }else{
            return $xml;
        }*/

        return $xml;
    }

    /**
     * 关闭curl
     */
    public function close(){
        //$this->curl->close();
    }

    public function messageget($langx="zh-cn"){
        $ary = $this->globalPost;
        $ary["p"] = "messageget";
        $ary["uid"] = $this->web["uid"];
        $ary["langx"] = $langx;
        $ary["username"] = $this->web["user"];
        $ary["select_date"] = -4;
        $ary["t_important"] = 0;
        $xml = $this->curlXml($ary);
        preg_match_all("/\<game id=\"(.*?)\">(.*?)\<\/game>/is",$xml,$msg);
        $arr = [];
        if(isset($msg[2]) && count($msg[2])>0){
            foreach ($msg[2] as $k => $v){
                $msg = $this->getXmlNode($v,"msg");
                $dd = [
                    "adddate" => $this->getXmlNode($v,"adddate"),
                    "msg" => $msg,
                    "sha1" => sha1($msg)
                ];
                $arr[] = $dd;
            }
        }
        return $arr;
    }

    /**
     * 采集线路检测
     * @param string $url 网址
     */
    public function chkUrl($url=""){
        if(empty($url)){
            $url = $this->url;
        }
        //$url = 'http://199.26.100.226';
        $html = $this->curl->send_post_data($url."/index.php",["detection"=>"Y"],"",5);

        if(strpos($html,'id="scroll_body"') !== false){
            preg_match("/top\.ver = \'(.*?)\'/is",$html,$vers);
            $ver = isset($vers[1]) ? $vers[1] : "";
            return ["status"=>"ok","ver"=>$ver];
        }
        //<tt id="reg_time_zh">2021年11月4日13:00:00~18:00:00</tt>
        preg_match("/\<tt id=\"reg_time_zh\">(.*?)\<\/tt>/is",$html,$wh);

      /*  if(isset($wh[1]) && !empty($wh[1])){ //系统维护
            $a = ["年","月","日"];
            $b = ["-","-"," "];
            $maintain_time = str_replace($a,$b,$wh[1]);
            return [
                "status"=>"ok",
                "maintain_sw" => "Y",
                "maintain_time" => $maintain_time
            ];
        }*/


        /*if(strpos($html,'return document.location.protocol;') !== false){ //添加网址协议
            $this->url = str_replace("http://","https://",$this->url);
            preg_match("/top\.ver = \'(.*?)\'/is",$html,$vers);
            $ver = isset($vers[1]) ? $vers[1] : "";
            return ["status"=>"ok","ver"=>$ver];
        }*/
        return ["status"=>"error"];

    }

    /**
     * 登陆验证 获取UID1
     * @param $user 用户名
     * @param $pwd 密码
     * @return string[]
     */
    public function login($user,$pwd){
        $ary = $this->globalPost;
        $ary["p"] = "chk_login";
        $ary["username"] = $user;
        $ary["password"] = $pwd;
        $ary["app"] = "N";
        $ary["auto"] = "IAIHGD";
		$ary["blackbox"]="";
		$ary["userAgent"]='';
        $xml =  $this->curlXml($ary);
        $this->close();
        preg_match("/\<status>(.*?)\<\/status>/is",$xml,$status);
        if(count($status)==2 && $status[1] == 200){
            $arr = ["status"=>"ok"];
            //<mid>23925249</mid><uid>xw4p71t0m23925249l83211b1</uid><domain></domain>
            $arr["mid"] = $this->getXmlNode($xml,"mid");
            $arr["uid"] = $this->getXmlNode($xml,"uid");
            $url = $this->getXmlNode($xml,"domain");
            $arr["url"] = empty($url) ? $this->url : $url;
            $arr["url"] = $_SERVER['HTTP_HOST'];
        }else{
            $arr = ["status"=>"error"];
            preg_match("/\<msg>(.*?)\<\/msg>/is",$xml,$msgs);
            if(isset($msgs[1])){
                $arr["msg"] = "[code:{$msgs[1]}]";
                switch ($msgs[1]){
                    case "101":
                    case "103":
                        $arr["msg"].= $this->getXmlNode($xml,"code_message");
                        break;
                    case "102":
                        $arr["msg"].= "密码错误次数过多。";
                        break;
                    case "105":
                        $arr["msg"].= "帐号或密码不正确。";
                        break;
                    case "107"://网路过慢，请重新登入
                        $this->login($user,$pwd);
                        break;
                }
            }else{
                $arr["msg"] = "登陆失败,请检查线路或者账号密码。";
            }
        }
        return $arr;
    }

    public function get_game_more($p=[],$langx="zh-cn"){
        $ary = $this->globalPost;
        $ary["p"] = "get_game_more";
        $ary["uid"] = $this->web["uid"];
        $ary["langx"] = $langx;
        $ary["showtype"] = isset($p["showtype"]) ? $p["showtype"] : "today";
        /*$ary["rtype"] = isset($p["rtype"]) ? strtolower($p["rtype"]) : "r";*/
        $ary["gtype"] = isset($p["gtype"]) ? strtolower($p["gtype"]) : "ft";
        $ary["ltype"] = $this->ltype;

        $ary["lid"] = $p["lid"];
        $ary["isRB"] = $p["isRB"];
        $ary["specialClick"] = "";
		$ary["mode"]="NORMAL";
		$ary["filter"]="Main";
		$ary["from"]="game_more";
        switch (strtoupper($p["gtype"])){
            case "FT":
            case "FU":
                $ary["ecid"] = $p["ecid"];
                break;
            default:
			//	$ary["type"] = 'getMore';
			//	$ary["peid"] = $p["peid"];
                $ary["gid"] = $p["gid"];
                break;
        }
if($ary["gtype"]=='es'){
			$ary["type"] = 'getMore';
			$ary["peid"] = $p["peid"];
		}
        $xml = $this->curlXml($ary);
		$arr = @json_decode($xml, 1);
				
        if (json_last_error() == JSON_ERROR_NONE)
        {
			$arr = $arr['response'] ?? [];
			$obj = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><serverresponse></serverresponse>');

			arr2xml($arr, $obj);

			return $obj -> asXML();
		}
		
        return $xml;
    }

    /**
     * 获取采集线路
     * @param string $login
     * @return bool|string
     */
    public function service_mainget($login="Y"){
        $ary = $this->globalPost;
        $ary["login"] = $login;
        $ary["p"] = "service_mainget";
        $xml =  $this->curlXml($ary);
        return $xml;
    }

    /*public function check_login_domain(){
        $ary = $this->globalPost;
        $ary["p"] = "check_login_domain";
        $ary["username"] = "";
        $ary["code"] = 663;
        $ary["uid"] = $this->web["uid"];
        $ary["mid"] = $this->web["mid"];
    }*/

    /**
     * 获取账号金额/判断uid是否失效
     */
    public function get_member_data(){
        $ary = $this->globalPost;
        $ary["p"] = "get_member_data";
        $ary["uid"] = $this->web["uid"];
        $ary["change"] = "credit";
        $xml = $this->curlXml($ary);
        return $xml;
        //change: credit
    }

    /**
     * 冠军league列表
     * @param $gtype
     * @param string $langx
     * @return bool|string
     */
    public function get_league_list_FS($gtype,$langx="zh-cn"){
        $ary = $this->globalPost;
        $ary["p"] = "get_league_list_FS";
        $ary["langx"] = $langx;
        $ary["uid"] = $this->web["uid"];
        $ary["gtype"] = $gtype;
        $ary["FS"] = "Y";
        $ary["showtype"] = "fu";
        $ary["specialClick"] = "";
        $xml = $this->curlXml($ary);
        return $xml;
    }

    /**
     * 冠军赛事接收
     * @param $gtype
     * @param $gid
     * @param $langx
     * @param string $date
     * @return bool|string
     */
    public function get_game_list_FS($gtype,$gid,$langx,$date=''){
        $ary = $this->globalPost;
        $ary["p"] = "get_game_list_FS";
        $ary["langx"] = $langx;
        $ary["uid"] = $this->web["uid"];
        $ary["gtype"] = $gtype;
        $ary["showtype"] = "FU";
        $ary["rtype"] = "fs";
        $ary["league_id"] = $gid;
        $ary["date"] = $date;
        $ary["special"] = "";
        return $this->curlXml($ary);
    }

    /**
     * 赛事数据采集
     * @param array $p
     * @param string $langx
     * @return bool|string
     */
    public function get_game_list($p=[],$langx="zh-cn"){
        $ary = $this->globalPost;

        $ary["p"] = "get_game_list";
        $ary["uid"] = $this->web["uid"];
        $ary["p3type"] = isset($p["p3type"]) ? $p["p3type"] : "";
        $ary["date"] = isset($p["date"]) ? $p["date"] : "";
        $ary["showtype"] = isset($p["showtype"]) ? $p["showtype"] : "today";
        $ary["rtype"] = isset($p["rtype"]) ? strtolower($p["rtype"]) : "r";
        $ary["gtype"] = isset($p["gtype"]) ? strtolower($p["gtype"]) : "ft";
        $ary["ltype"] = $this->ltype;
		$ary["filter"]="";
		$ary["cupFantasy"]="N";
        if(isset($p["lid"])){$ary["lid"] = $p["lid"];}
        if(isset($p["action"])){$ary["action"] = "clickCoupon";}
        $ary["sorttype"] = isset($p["sorttype"]) ? strtoupper($p["sorttype"]) : "L";
        $ary["specialClick"] = isset($p["specialClick"]) ? $p["specialClick"] : "";
        if(isset($p["target"])){$ary["target"] = $p["target"];}
        $ary["langx"] = $langx;
        $ary["isFantasy"] = "N";
        $ary["ts"] = get_timestamp_millisecond();//时间戳:毫秒

        //获取lib
        $leagueAry = [];
        $leagueAry["gtype"] = strtoupper($ary["gtype"]);
        $leagueAry["showtype"] = "ft";
        $leagueAry["date"] = $ary["date"];
        $leagueAry["nocp"] = "N";
        switch ($ary["showtype"]){
            case "today":
                $leagueXml = $this->get_league_list_All($leagueAry);
                preg_match("/\<coupon id='1'>(.*?)\<\/coupon>/is",$leagueXml,$matchs);
                if(count($matchs)>0){
                    $ary["lid"] = $this->getXmlNode($matchs[1],"lid");
                }

                break;
            case "parlay"://过关
                $leagueAry["showtype"] = "p3";
                $leagueXml = $this->get_league_list_All($leagueAry);
                switch ($ary["gtype"]){
                    case "ft":
                        preg_match("/\<coupon id='2'>(.*?)\<\/coupon>/is",$leagueXml,$matchs);
                        break;
                    default:
                        preg_match("/\<coupon id='1'>(.*?)\<\/coupon>/is",$leagueXml,$matchs);
                        break;
                }

                if(count($matchs)>0){
                    $ary["lid"] = $this->getXmlNode($matchs[1],"lid");
                }
                break;
            case "early"://早盘
                $leagueAry["showtype"] = "fu";
                $leagueXml = $this->get_league_list_All($leagueAry);
                preg_match("/\<coupon id='1'>(.*?)\<\/coupon>/is",$leagueXml,$matchs);
                if(count($matchs)>0){
                    $ary["lid"] = $this->getXmlNode($matchs[1],"lid");
                }
                break;
        }
        $xml = $this->curlXml($ary);
		
        if($ary["showtype"]=="pd"){
            print_r($xml);exit;
        }
		
        $arr = @json_decode($xml, 1);

        if (json_last_error() == JSON_ERROR_NONE)
        {
			$arr = $arr['response'] ?? [];
			$obj = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><serverresponse></serverresponse>');

			arr2xml($arr, $obj);

			return $obj -> asXML();
		}
		
        return $xml;
    }

    /**
     * 读取官网数据
     * @param array $p
     * @return bool|string|string[]
     */
    public function get_curl_data($p=[]){
        $tryLimit = 3;
        $triedUid = [];
        for($i=0; $i<$tryLimit; $i++){
            try{
                $this->randFrontCurlUser();
            }catch (Exception $e){
                return ["code"=>"error","status"=>"error","msg"=>$e->getMessage()];
            }

            $uid = $this->web["uid"] ?? "";
            if(empty($uid)){
                continue;
            }
            if(isset($triedUid[$uid])){
                continue;
            }
            $triedUid[$uid] = true;

            $ary = $p;
            $ary["p"] = $p["p"];
            $ary["ver"] = $this->globalPost["ver"];
            $ary["uid"] = $uid;

            $xml = $this->curlXml($ary);
            if(!empty($xml)){
                return $xml;
            }
        }

        return ["code"=>"error","status"=>"error","msg"=>"网络错误请稍后再试"];
    }

    /**
     * 联盟列表采集
     * @param array $p
     * @return bool|string
     */
    public function get_league_list_All($p=[]){
        $ary = $this->globalPost;
        $ary["p"] = "get_league_list_All";
        $ary["uid"] = $this->web["uid"];
        $ary["gtype"] = isset($p["gtype"]) ? $p["gtype"] : "FT";
        $ary["showtype"] = isset($p["showtype"]) ? strtolower($p["showtype"]) : "ft";
        $ary["date"] = isset($p["date"]) ? $p["date"] : "all";
        $ary["nocp"] = isset($p["nocp"]) ? $p["nocp"] : "N";
        $ary["FS"] = isset($p["FS"]) ? $p["FS"] : "N";
        return $xml = $this->curlXml($ary);
    }

    public function get_result(){
        /*login_layer: su
uid: 5133e19bm1610314l95363647xw
langx: zh-cn
ver: version-02-05
p: get_result
session:
gtype: FT
date: 2021-4-8
league_id: all*/
        $ary = [
            "p" => "get_result",
            "login_layer" => "ag",
            "uid" => $this->web["uid"],
            "ver" => "version-03-05",
            "langx" => "zh-cn",
            "session" => "",
            "gtype" => "FT",
            "date" => "2021-4-8",
            "league_id" => "all"
        ];

        $this->curl->set_referrer($this->url);
        $xml=$this->curl->send_post_data("https://ag.hga030.com/transform.php",$ary,"",10);
        print_r($xml);exit;
        return $xml = $this->curlXml($ary);
    }
}

// 将数组转换成XML格式的函数
function arr2xml($arr, &$xml)
{
    foreach ($arr as $k => $v)
    {
		$gid = $v['GID'] ?? 0;
        if ($gid && preg_match('/GAME([\d_]+)/', $k))
        {
            $k = 'GAME';
        }
        if (is_array($v))
        {
            if (!is_numeric($k))
            {
                $sub = $xml -> addChild("$k");
                if ($gid)
                {
                    $sub -> addAttribute('id', 'gid'.$gid);
                }
                arr2xml($v, $sub);
            }
            else
            {
                arr2xml($v, $xml);
            }
        }
        else
        {
            $xml -> addChild("$k", htmlspecialchars("$v"));
        }
    }
}
