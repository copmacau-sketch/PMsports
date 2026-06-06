<?php
ini_set("display_errors","yes");
header('Content-type: text/html;charset=utf-8');

$refreshTime = 3;//刷新时间

set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php';
global $db_s,$db_c;
$table = Constant::S_AGUID;

do{

    $ad_url = ["https://ag.hg0088.com","https://ag.hga030.com","https://ag.hga025.com","https://ag.hga008.com"];
	$sql = "select * from {$table} limit 0,1";
    $bet = $db_s->select($sql);
//print_r();exit;
    $ver = $bet[0]['ver'];
    $langx = "zh-cn";
    $login_layer = "ag";
    $url = "";
    //检测能打开的网址
    foreach ($ad_url as $k => $v){
        $tf = new TransformAG($v,$langx,$ver,$login_layer);
        $isUrl = $tf->chkUrl($v);
        //$tf->close();
        if($isUrl["status"]=="ok"){
            $url = $v;
            break;
        }
    }
    $rTime = 10;
    if(!empty($url)) {

        

        $webstr = '';
        $website = 0;
        $rs = $db_s->select("SELECT * FROM {$table}");
        foreach ($rs as $k => $v) {
            $tf = new TransformAG($url, $langx, $ver, $login_layer);
            $str = "账号:{$v["username"]}";
            $uid = $v["uid"];
            $user_id = $v["user_id"];
            $layer_id = $v["layer_id"];
            $status = 1;
            $msg = "ok";
            /*检测线路 -- 开始*/
            $isUrl = $tf->chkUrl($url);
            /*if($isUrl["status"]=="error"){
                $status = 2;
                $msg = "登3网址无法打开";
                setCurlTable($v["id"],$url,$uid,$user_id,$layer_id,$status,$msg,$ver);
                $str .= " 结果:{$msg}";
                getPrint($str);
                continue;
            }else{*/
            if (isset($isUrl["maintain_sw"]) && $isUrl["maintain_sw"] == "Y") {
                $status = 2;
                $msg = "系统维护";
                setCurlTable($v["id"], $url, $uid, $user_id, $layer_id, $status, $msg, $ver);
                $str .= " 结果:{$msg}";
                $rTime = 60;
                $webstr = $isUrl["maintain_time"];
                $website = 1;
                getPrint($str);
                break;
            }
            //更新版本号
            if (!empty($isUrl["ver"])) {
                $ver = $isUrl["ver"];
            }
            //}

            //设置默认采集账号配置为当前账号配置
            $tf->setDefaultWeb($v);


            /*检测UID -- 开始*/
            $xml = $tf->get_online_mem();//访问用户资料用于检测登陆是否失效

            if ($xml["status"] == "success") {
                $status = 1;
                $msg = "ok";
                $str .= " 结果:无需更新1";
                setCurlTable($v["id"], $url, $uid, $user_id, $layer_id, $status, $msg, $ver);
                getPrint($str);
                continue;
            }else{
            /*检测UID -- 结束*/
            //登陆验证
            $arr = $tf->login($v["username"], $v["password"]);
			
			//print_r($arr);
			
            if ($arr["status"] == "error") {
                $f[$k]["status"] = $arr["msg"];
                $status = 2;
                $msg = $arr["msg"];
                $str .= " 结果:{$arr["msg"]}2";
                setCurlTable($v["id"], $url, $uid, $user_id, $layer_id, $status, $msg, $ver);
                getPrint($str);
                continue;
            } else {
                $status = 1;
                $msg = "ok";
                $str .= " 结果:无需更新3";

                $user_id = $arr["user_id"];
                $layer_id = $arr["layer_id"];
                $uid = $arr["uid"];
				$cookies=$arr["cookies"];
                setCurlTable($v["id"], $url, $uid, $user_id, $layer_id, $status, $msg, $ver,$cookies);
                getPrint($str);
            }
			}


        }
    }else{
        getPrint("所有网址都无法打开");
    }
    sleep($rTime);
}while (true);

function getPrint($str){
    global $refreshTime;
    //$str = iconv("UTF-8","gbk//TRANSLIT",$str);
    print_r($str."\n");
    sleep($refreshTime);
}


function setCurlTable($id,$url,$uid,$user_id,$layer_id,$status=1,$msg="ok",$ver='',$cookies=''){
    global $table,$db_s;
    $up = [
        "uid" => $uid,
        "url" => $url,
        "ver" => $ver,
        "status" => $status,
        "msg" => $msg,
        "user_id" => $user_id,
        "layer_id" => $layer_id,
    ];
	
	if($cookies!=""){
			$up["cookie"] = $cookies;
	}
    $db_s->update($table,$up,"`id`={$id}");
}

function rovmeScript($str){
    $a = [
        "script",
        "form"
    ];

    return str_replace($a,"",$str);
}
?>