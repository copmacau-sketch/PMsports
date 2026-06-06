<?php
/**
 * Transform 数据采集
 */

class TransformAG
{
    private $url = '';//采集地址
    private $curl = '';//curl类
    private $langx = '';//语言
    private $cookie = '';//cookie
    private $globalPost = [];//全局post参数
    private $web = [];//可用的UID集
    private $ltype = 3;
    private $ver = "";//版本号
    private $login_layer;

    /**
     * Transform constructor.
     * @param $url 采集网址
     * @param $langx 语言
     */
    public function __construct($url="",$langx="zh-cn",$ver="",$login_layer="mem")
    {
        $this->url = $url;
        $this->langx  = $langx;
        $this->curl = new Curl_HTTP_Client();
        $this->curl->set_user_agent("Mozilla/5.0 (Windows NT 6.1; Win64; x64)");
        if(!empty($url)){
            $this->curl->set_referrer($url);
        }
        $this->ver = empty($ver) ? date("Y-m-d-H")."_e2a70f7b-3ed5-ad58-".date("md")."-271au2576be7" : $ver;
        $this->globalPost = [
            "p" => "",
            "ver" => $this->ver,
            "langx" => $this->langx
        ];
        $this->login_layer = $login_layer;
    }



    /**
     * 随机选取可用的采集账号
     * @param $webdb
     * @param $type after:后端采集账号组,front:前端采集账号组
     * @return false|mixed
     */
    public function randUser(){
        global $db_s;
        $table = Constant::S_AGUID;
        $rs = $db_s->select("SELECT * FROM {$table} WHERE `status`=1");
        $arr = [];
        if($rs){
            $key = rand(0,count($rs)-1);
            $this->setDefaultWeb($rs[$key]);
        }else{
            print_r("curl name null\n");
        }
    }
	
	 public function gETCookie(){
        global $db_s;
        $table = Constant::S_AGUID;
        $rs = $db_s->select("SELECT cookie FROM {$table} WHERE `status`=1");
        if($rs){
             $this->cookie=$rs[0]["cookie"];
        }else{
            print_r("curl name null\n");
        }
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
		$this->curl->include_response_headers(true);
        if(!empty($this->cookie)){
            $this->curl->set_cookie($this->cookie);
        }
        $this->curl->set_referrer($this->web["url"]);
		//print_r($post);
		//echo $this->url."/transform.php?ver=".$post['ver'];
		//echo $this->url."/transform.php?ver=".$post['ver'];exit;
        $xml=$this->curl->send_post_data($this->url."/transform.php?ver=version-05-15",$post,"",10);
		//echo $xml;
        return $xml;
    }
	
	
	    /**
     * @param array $post post参数
     * @return bool|string
     */
    public function curlXmlC($post=[]){
		
		$this->gETCookie();
		//echo $this->cookie;exit;
       	if(!empty($this->cookie)){
            $this->curl->set_cookie($this->cookie);
        }
        $this->curl->set_referrer($this->web["url"]);
		//print_r($post);
		//echo $this->url."/transform.php?ver=".$post['ver'];
		//echo $this->url."/transform.php?ver=".$post['ver'];exit;
        $xml=$this->curl->send_post_data($this->url."/transform.php?ver=version-05-15",$post,"",10);
		//echo $xml;
        return $xml;
    }

    /**
     * 关闭curl
     */
    public function close(){
        $this->curl->close();
    }

    public function xmlOrArray(){

    }

    /**
     * 采集线路检测
     * @param string $url 网址
     */
    public function chkUrl($url=""){
        if(empty($url)){
            $url = $this->url;
        }
        $html = $this->curl->send_post_data($url,["detection"=>"Y"],"",10);
        preg_match("/\<tt id=\"reg_time_zh\">(.*?)\<\/tt>/s",$html,$wh_date);//页面内部是否维护
        if(isset($wh_date[1])){
            return ["status"=>"ok","maintain_sw"=>"Y","maintain_time"=>$wh_date[1]];
        }

        $html = $this->curl->send_post_data($url."/index.php",["detection"=>"Y"],"",10);
        if(strpos($html,'top.ver') !== false){
            preg_match("/top\.ver = \'(.*?)\'/is",$html,$vers);
            $ver = isset($vers[1]) ? $vers[1] : "";
            return ["status"=>"ok","ver"=>$ver];
        }

        if(strpos($html,'return document.location.protocol;') !== false){ //添加网址协议
            $this->url = str_replace("http://","https://",$this->url);
            preg_match("/top\.ver = \'(.*?)\'/is",$html,$vers);
            $ver = isset($vers[1]) ? $vers[1] : "";
            return ["status"=>"ok","ver"=>$ver];
        }
        return ["status"=>"error"];

    }

    /**
     * 登陆验证 获取UID
     * @param $user 用户名
     * @param $pwd 密码
     * @return string[]
     */
    public function login($user,$pwd){
        $ary = $this->globalPost;
        $ary["p"] = "login_chk";
        $ary["username"] = $user;
        $ary["login_layer"] = $this->login_layer;
        $ary["pwd"] = $pwd;
        $ary["pwd_safe"] = "none";
        $ary["uid"] ="";
        $ary["auto"] = "GZECIC";
        $json =  $this->curlXml($ary);
		//echo $json;
		
		
		preg_match_all( '/Set-Cookie: ([^}]*);/', $json, $matches);
		//print_r($matches);
		$cookiesT = $matches[1][0];
		$cookiestmp=explode(";",$cookiesT);
		$cookies=$cookiestmp[0];
		//print_r($cookies);
		preg_match_all('/{([^}]*)}/', $json, $matches);
		$uidjson=$matches[0][0];
		
		//print_r($cookies);
		//echo ($uidjson);exit;
		 
        $arr = json_decode($uidjson,true);
	//	print_r($arr);
        $res = [];
        if($arr["code"]=="102"){
            if($arr["status"]=="success"){
                $res["status"] = "success";
                $res["uid"] = $arr["uid"];
                $res["layer_id"] = $arr["layer_id"];
                $res["user_id"] = $arr["user_id"];
				$res["cookies"]=$cookies;
            }else{
                $res["status"] = "error";
                $res["msg"] = "账号或密码错误";
            }
        }else if($arr["code"]=="201" && isset($arr["is_check"]) && $arr["is_check"]=="Y"){
            $res["status"] = "error";
            $res["msg"] = "需要验证码";
        }else{
            $res["status"] = "error";
            $res["msg"] = "链接失败!!";
        }

        return $res;

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
        $xml =  $this->curlXmlC($ary);
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
    public function get_online_mem(){
       	$ary = $this->globalPost;
        $ary["p"] = "get_online_mem";
        $ary["uid"] = $this->web["uid"];
        $ary["login_layer"] = $this->login_layer;
        $ary["layer_id"] = $this->web["layer_id"];
        $ary["chk_mem"] = "Y";
		
		/*$ary["p"] = "get_online_mem";
$ary["ver"] = "version-12-12";
$ary["uid"] = "74f89c08m11159099l698291232xw";
$ary["login_layer"] = "ag";
$ary["layer_id"] = "8399284";
$ary["chk_mem"] = "N";*/
		unset($ary['langx']);
        $arr = json_decode($this->curlXmlC($ary),true);
		//print_r($ary);exit;
        if(isset($arr["memCount"])){
            return ["status"=>"success"];
        }else{
            return ["status"=>"error"];
        }
        //change: credit
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
        $ary["lid"] = isset($p["lid"]) ? $p["lid"] : "";
        $ary["action"] = isset($p["action"]) ? $p["action"] : "clickCoupon";
        $ary["sorttype"] = isset($p["sorttype"]) ? strtoupper($p["sorttype"]) : "L";
        $ary["specialClick"] = isset($p["specialClick"]) ? $p["specialClick"] : "";
        $ary["target"] = isset($p["target"]) ? $p["target"] : "";
        $ary["langx"] = $langx;
        $ary["ts"] = get_total_millisecond();//时间戳:毫秒

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
        $xml = $this->curlXmlC($ary);
        if($ary["showtype"]=="pd"){
            print_r($xml);exit;
        }
        return $xml;
    }

    /**
     * 读取官网数据
     * @param array $p
     * @return bool|string|string[]
     */
    public function get_curl_data($p=[]){
        $this->randFrontCurlUser();
        if(!isset($this->web["uid"]) || empty($this->web["uid"])){
            return ["status"=>"error","msg"=>"UID为空"];
        }
        $ary = $p;
        $ary["p"] = $p["p"];
        $ary["ver"] = $this->globalPost["ver"];
        $ary["uid"] = $this->web["uid"];
        $xml = $this->curlXmlC($ary);
        //print_r($xml);exit;
        return $xml;
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
        return $xml = $this->curlXmlC($ary);
    }

    /**
     * 账号解封
     */
    public function longerr_Edit($mid){
        $ary = [
            "p" => "longerr_Edit",
            "login_layer" => "ag",
			"ver" => $this->ver,
            "uid" => $this->web["uid"],
            "langx" => "zh-cn",
            "level" => "members",
            "user_id"=> $mid,
            "pay_type" => 0
        ];
		
        return $this->curlXmlC($ary);
    }

    public function get_result($p,$langx="zh-cn"){
        $date = date("Y-m-d",time()-$p["time"]);
        if($date == date("Y-m-d")){
           // $date = "today";
        }
        //$date = "2021-11-30";
        //print_r($date);exit;
        $ary = [
            "p" => "get_result",
            "login_layer" => "ag",
            "uid" => $this->web["uid"],
			//"uid"=>'375ecb01m8441880l418549422xw',
            "ver" => empty($this->web["ver"]) ? "version-05-15" : $this->web["ver"],
			//"ver" =>'version-02-02',
            "langx" => $langx,
            "session" => "",
            "gtype" => $p["gtype"],
            "date" => $date,
            "league_id" => "all"
        ];
//print_r($ary);
        return $this->curlXmlC($ary);
    }
	

/**
     * @throws RedisException
     */
    public function get_resultsfs($p, $langx = "en-us")
    {
		$langx='en-us';
		$p["time"]=10*3600;
        $date = date("Y-m-d", time() - $p["time"]);
        if ($date == date("Y-m-d")) {
          //  $date = "today";
        }
		//print_r($p);exit;
        $ary = [
            "p" => "get_result_FS",
            "login_layer" => "ag",
            "uid" => $this->web["uid"],
           	"ver" => empty($this->web["ver"]) ? "version-05-15" : $this->web["ver"],
            "langx" => $langx,
            "session" => "",
            "gtype" => $p["gtype"],
            "date" => $date,
            "league_id" => "all"
        ];
		//print_r($ary);exit;
        return $this->curlXmlC($ary);
    }


    public function get_curl_ad_data($_p){
        $this->randUser();
        if(!isset($this->web["uid"])){
            return json_encode(["status"=>"error","code"=>"4X011","msg"=>"线路不通"]);
        }
        $_p["login_layer"] = "ag";
        $_p["uid"] = $this->web["uid"];
        $_p["ver"] = empty($this->web["ver"]) ? "version-05-15" : $this->web["ver"];
        $json = $this->curlXmlC($_p);
        if($json == "curl name null"){
            return json_encode(["status"=>"error","code"=>"4X011","msg"=>"curl name null"]);
        }
        return $json;
    }

}