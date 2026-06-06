<?php
include_once "./include/config.php";
global $db_s,$db_c,$langx,$illegal,$ls_ary,$ls_code_ary,$ls_game_ary,$artjson;
$_p = $_POST;
$dateH =  date("Y-m-d-H");
$date = date("Y-m-d H:i:s");
$md = date("md");
$ymd = date("Y-m-d");
$ynj = date("Y-n-j");
$PHP_domain = $_SERVER['HTTP_HOST'];
$ls = "cn";
switch ($langx){
    case "zh-cn":
        $ls = "cn";
        break;
    case "zh-tw":
        $ls = "tw";
        break;
    case "en-us":
        $ls = "us";
        break;
}
$ver = "-3ed5-iovation-{$md}-95881ae5676be8";
// $ver = "{$dateH}_e2a70f7b-3ed5-ad58-{$md}-688en1576be7";
// -3ed5-history-1102-9999995576be7
$js = "\ntop.ver = '{$ver}';\n";
$css = "";
$jsAry = [];
$xml = new A2Xml();

$code = unserialize(IS_NORMAL);
/*$xmlTypeAry = ['service_mainget','chk_login'];//p参数输出xml类型
if(in_array($_p["p"],$xmlTypeAry)){
    header('Content-Type: text/xml');
}*/
$cheUIDAry = [
    "chg_newpwd","help_chg_safepwd","messageget","get_member_data","mem_online",
    "get_history_data","get_history_view","get_todaywagers_count","get_today_wagers",
    "get_dangerous","get_bethold","FS_order_view","Total_order_view","Other_order_view",
    "FT_order_view","FT_bet","Other_bet","Total_bet","FS_bet","get_account_set","get_credit_logs"
];
if(in_array($_p["p"],$cheUIDAry)){ //需要uid验证
    $bs = new Base($_p);
    $guid = $bs->getUID();
    if($guid["status"] == "error"){
        $arr["code"] = "error";
        $arr["msg"] = $guid["msg"];
        exit($xml->toXml($arr));
    }

}
switch ($_p["p"]) {
    case 'system_msg':
        $js .= "var artjson = {
                \"ART_lang\": \"{$artjson["ART_lang"]}\",
                \"ART_msg_btn_no\": \"{$artjson["ART_msg_btn_no"]}\",
                \"ART_msg_btn_yes\": \"{$artjson["ART_msg_btn_yes"]}\",
                \"ART_msg_noshow\": \"{$artjson["ART_msg_noshow"]}\",
                \"ART_title_kick\": \"{$artjson["ART_title_kick"]}\",
                \"ART_msg_btn_ok\": \"{$artjson["ART_msg_btn_ok"]}\",
                \"ART_toast_btn_ok\": \"{$artjson["ART_toast_btn_ok"]}\",
            };\n";
        $jsAry = [
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/{$_p["p"]}.js"
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
	case 'service_main':
		$jsAry = [
			"js/lib/xmlNode.js",
			"js/lib/Util.js",
			"js/lib/fastTemplate_a1.js",
			"js/lib/HttpRequest.js",
			"js/lib/HttpRequestRetry.js",
			"js/service_main.js"
		];
		$js .= '
			var artjson = {
				"ART_cleardata_title": "'.$artjson["ART_cleardata_title"].'",
				"ART_cleardata_text1": "'.$artjson["ART_cleardata_text1"].'",
				"ART_cleardata_text2": "'.$artjson["ART_cleardata_text2"].'",

			}
		';
		$fileDir = "tpl/member/service_main.html";
		break;
	case 'service_mainget':
        header('Content-Type: text/xml');
        $con_table = Constant::T_CONFIG_DEFAULT;
        $conn = $db_c->select("SELECT * FROM {$con_table} WHERE `id`>0 LIMIT 1","Row");
        $maintain_sw = isset($conn["website"]) && $conn["website"]==1 ? "Y"  : "N";//是否维护
        $clean_data_sw = 'N';
        $maintain_time = $conn["webstr"];
		$all_domains = "{$PHP_domain}@3.25.180.205:8080";
	$xmlArr = [
			"code" => 619,
			"urgent_sw"=>"N",
			"emergency_sw"=>"N",
			"maintain_sw"=>"N",
			"maintain_time" => "{$maintain_time}",
			"clean_data_sw" => "N",
			"clean_data_time" => "{$date}",
			"exceptions_ip" => "@{$all_domains}@",
			"masterNewDomain_ip" => "{$all_domains}@",
			"masterNewDomainY_ip"=> "{$all_domains}@",
			"now_time" => "{$date}",
            "myGame_sw" => "Y",
            "forecast_sw" => "Y",
			"isException" => "N",
			"gmt" => "8"
		];
		exit($xml->toXml($xmlArr));
	case 'alert_msg':
		$js .= "var artjson = {
			\"ART_lang\": \"{$artjson["ART_lang"]}\",
			\"ART_msg_btn_no\": \"{$artjson["ART_msg_btn_no"]}\",
			\"ART_msg_btn_yes\": \"{$artjson["ART_msg_btn_yes"]}\",

			\"ART_msg_noshow\": \"{$artjson["ART_msg_noshow"]}\",

			\"ART_title_kick\": \"{$artjson["ART_title_kick"]}\",

			\"ART_msg_btn_ok\": \"{$artjson["ART_msg_btn_ok"]}\",
			\"ART_toast_btn_ok\": \"{$artjson["ART_toast_btn_ok"]}\",
		};";
		$jsAry = ["js/lib/Timer.js"];
		$fileDir = "tpl/member/alert_msg.html";
		break;
    case 'mem_message':
		//echo '';die;
        $acc = new Account($_p);
        exit($acc->get_alert_msg());
        break;
    case 'set_message':
        $acc = new Account($_p);
        exit($acc->set_alert_msg());
        break;
	case 'login':
		// repro: iovation 风控域名已下线，置空跳过该流程
		$js .= "
		var iovation_Proxy= '';
		var iovationURL= '';
		top.iovationKey = 'IDICBD';
		top.aspenbet = 'N';
		top.blackBoxStatus = 'Y';
		top.blackbox = 'disabled';
		var artjson = {
			\"ART_lang\": \"{$artjson["ART_lang"]}\",
			\"ART_login_cn\": \"简体版\",
			\"ART_login_tw\": \"繁體版\",
			\"ART_login_en\": \"ENGLISH\",

			\"ART_login_id\": \"{$artjson["ART_login_id"]}\",
			\"ART_login_pwd\": \"{$artjson["ART_login_pwd"]}\",

			\"ART_login_btn_login\": \"{$artjson["ART_login_btn_login"]}\",
			\"ART_login_remeber\": \"{$artjson["ART_login_remeber"]}\",
			\"ART_login_forgot\": \"{$artjson["ART_login_forgot"]}\",
			\"ART_login_btn_passcode\": \"{$artjson["ART_login_btn_passcode"]}\",
			\"ART_login_btn_oldsite\": \"{$artjson["ART_login_btn_oldsite"]}\",
			
            \"ART_login_brower_title\": \"{$artjson["ART_login_brower_title"]}\",
            \"ART_login_chrome\": \"{$artjson["ART_login_chrome"]}\",
            \"ART_login_safari\": \"{$artjson["ART_login_safari"]}\",
            \"ART_login_firefox\": \"{$artjson["ART_login_firefox"]}\",
            \"ART_login_brower_text_1\": \"{$artjson["ART_login_brower_text_1"]}\",
            \"ART_login_brower_text_btn\": \"{$artjson["ART_login_brower_text_btn"]}\",
            \"ART_login_brower_text_2\": \"{$artjson["ART_login_brower_text_2"]}\",
		};
		";
		$jsAry = [
			"js/lib/parseHTML.js",
			"js/lib/xmlNode.js",
			"js/lib/Util.js",
			"js/login.js",
			"js/lib/HttpRequest.js",
			"js/lib/HttpRequestRetry.js",
			"js/lib/CookieManager.js"
		];
		$fileDir = "tpl/member/login.html";
		break;
	case 'forgot_pwd':
		$js .= '
			var artjson = {
			    "ART_lang": "'.$artjson["ART_lang"].'",
			    "ART_forgot_title": "'.$artjson["ART_forgot_title"].'",

			    "ART_forgot_text1": "'.$artjson["ART_forgot_text1"].'",
			    "ART_forgot_text2": "'.$artjson["ART_forgot_text2"].'",
			    "ART_forgot_text3": "'.$artjson["ART_forgot_text3"].'",
			    "ART_forgot_inp_id": "'.$artjson["ART_forgot_inp_id"].'",
			    "ART_forgot_inp_email": "'.$artjson["ART_forgot_inp_email"].'",
			    "ART_forgot_btn_cancel": "'.$artjson["ART_forgot_btn_cancel"].'",
			    "ART_forgot_btn_next": "'.$artjson["ART_forgot_btn_next"].'",
			    "ART_forgot_btn_submit": "'.$artjson["ART_forgot_btn_submit"].'",

			    "ART_forgot_text4": "'.$artjson["ART_forgot_text4"].'",
			    "ART_forgot_inp_safecode": "'.$artjson["ART_forgot_inp_safecode"].'",
			    "ART_forgot_error": "'.$artjson["ART_forgot_error"].'",
			    "ART_forgot_btn_resent": "'.$artjson["ART_forgot_btn_resent"].'",

			    "ART_forgot_text5": "'.$artjson["ART_forgot_text5"].'",
			    "ART_forgot_inp_pwd": "'.$artjson["ART_forgot_inp_pwd"].'",
			    "ART_forgot_inp_repwd": "'.$artjson["ART_forgot_inp_repwd"].'",

			    "ART_forgot_text6": "'.$artjson["ART_forgot_text6"].'",
			    "ART_forgot_btn_gologin": "'.$artjson["ART_forgot_btn_gologin"].'",

			};
		';
		$jsAry = [
			"js/lib/parseHTML.js",
			"js/lib/xmlNode.js",
			"js/lib/Util.js",
			"js/forgot_pwd.js",
		];
		$fileDir = "tpl/member/forgot_pwd.html";
		break;
    case 'chg_id':
        $js .= "
			var artjson = {
                \"ART_lang\": \"{$artjson["ART_lang"]}\",
                \"ART_chgid_title\": \"{$artjson["ART_chgid_title"]}\",
                \"ART_chgid_hello\": \"您好\",
    
                \"ART_chgid_text1\": \"{$artjson["ART_chgid_text1"]}\",
                \"ART_chgid_text2\": \"{$artjson["ART_chgid_text2"]}\",
                \"ART_chgid_text3\": \"{$artjson["ART_chgid_text3"]}\",
                \"ART_chgid_text4\": \"{$artjson["ART_chgid_text4"]}\",
    
                \"ART_chgid_inp_id\": \"{$artjson["ART_chgid_inp_id"]}\",
                \"ART_chgid_btn_check\": \"{$artjson["ART_chgid_btn_check"]}\",
    
                \"ART_chgid_text5\": \"{$artjson["ART_chgid_text5"]}\",
                \"ART_chgid_text6\": \"{$artjson["ART_chgid_text6"]}\",
    
                \"ART_chgid_btn_cancel\": \"{$artjson["ART_chgid_btn_cancel"]}\",
                \"ART_chgid_btn_submit\": \"{$artjson["ART_chgid_btn_submit"]}\",
    
            }
		";
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/CookieManager.js"
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
	case 'icon_all':
		$fileDir = "tpl/member/icon_all.html";
		break;
    case 'chk_login':
        //header('Content-Type: text/xml');
        if($code["code"]==2){ exit("CheckIOSapp error");}

        if(!isset($_SESSION["login_time"])){
            $_SESSION["login_time"] = time();
            $_SESSION["login_num"] = 1;//次数
            $_SESSION["no_login"] = "N";
        }else{
            if($_SESSION["no_login"] == "Y"){ //3分钟后登陆
                if(time()-$_SESSION["login_time"] > 3 *60){ //解除登陆
                    $_SESSION["login_time"] = time();
                    $_SESSION["login_num"] = 1;//次数
                    $_SESSION["no_login"] = "N";
                }else{
                    $xmlArr = [
                        "code"=>"101",
                        "action"=>"login",
                        "status" => "error",
                        "status_code" => $ls_code_ary["4X006"]
                    ];
                    exit($xml->toXml($xmlArr));
                }
            }

            if(time() - $_SESSION["login_time"] <= 3){ //3秒内
                if($_SESSION["login_num"]>5){//访问5次以上禁止登陆
                    $xmlArr = [
                        "code"=>"101",
                        "action"=>"login",
                        "status" => "error",
                        "status_code" => $ls_code_ary["4X006"]
                    ];
                    $_SESSION["no_login"] = "Y";
                    exit($xml->toXml($xmlArr));
                }else{//5次内记录访问次数
                    $_SESSION["login_num"] += 1;
                }

            }else{//超出3秒恢复初始值
                $_SESSION["login_time"] = time();
                $_SESSION["login_num"] = 1;//次数
            }
        }
        $_p["pwd"] = isset($_p["password"]) ? $_p["password"] : "";
		$login = new Login($_p);
        $xmlArr = $login->getLogin();
		exit($xml->toXml($xmlArr));
		break;
    case 'get_out':
        $login = new Login($_p);
        $login->get_out();
        exit("ok");
        break;
	case "chk_email":
	    if($_p["action"] == 1){
            $email = new ChkEmail($_p);
            $sta = $email->vaildateEmail();
            if($sta["status"]=="error"){
                $xmlArr["err_msg"] = $sta["msg"];
                if (is_numeric($_p["email"]) && preg_match("/^1[3456789]{1}\d{9}$/", $_p["email"])){
                    $xmlArr = [
                        "alert_msg" => "",
                        "done_msg" => "",
                        "err_msg" => "",
                        "time" => 0,
                        "view" => "",
                    ];
                    $set = $email->setData();
                    if($set["status"]=="error"){
                        $xmlArr["err_msg"] = $sta["msg"];
                    }else{
                        $xmlArr["err_msg"] = "";
                    }
                }else{
                   // $xmlArr["err_msg"] = "电话格式错误";
				   $xmlArr["err_msg"] = "超过输入字符长度";
                }
                exit(json_encode($xmlArr));
            }else{
                $xmlArr = [
                    "alert_msg" => "",
                    "done_msg" => "",
                    "err_msg" => "",
                    "time" => 0,
                    "view" => "",
                ];
                $set = $email->setData();
                if($set["status"]=="error"){
                    $xmlArr["err_msg"] = $sta["msg"];
                }else{
                    $xmlArr["err_msg"] = "";
                }
            }
            exit(json_encode($xmlArr));
        }else{
	        $xmlArr = ["code"=>"error","msg"=>""];
            exit($xml->toXml($xmlArr));
        }
		break;
    case "chg_pwd":
        $js .= "
			var artjson = {
                \"ART_log_chgpwd\" : \"{$artjson["ART_log_chgpwd"]}\",
                \"ART_log_chgpwd_text_1\" : \"{$artjson["ART_log_chgpwd_text_1"]}\",
                \"ART_log_chgpwd_text_2\": \"{$artjson["ART_log_chgpwd_text_2"]}\",
                \"ART_log_chgpwd_text_3\": \"{$artjson["ART_log_chgpwd_text_3"]}\",
                \"ART_log_chgpwd_text_4\": \"{$artjson["ART_log_chgpwd_text_4"]}\",
                \"ART_log_chgpwd_text_5\": \"{$artjson["ART_log_chgpwd_text_5"]}\",
            
                \"ART_log_inp_nowpwd\": \"{$artjson["ART_log_inp_nowpwd"]}\",
                \"ART_log_inp_newpwd\": \"{$artjson["ART_log_inp_newpwd"]}\",
                \"ART_log_inp_repwd\": \"{$artjson["ART_log_inp_repwd"]}\",
            
                \"ART_log_btn_cancel\": \"{$artjson["ART_log_btn_cancel"]}\",
                \"ART_log_btn_submit\": \"{$artjson["ART_log_btn_submit"]}\",
            }
		";
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js"
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "chg_newpwd":
    case "help_chg_safepwd":
        $acc = new Account($_p);
        $xmlArr = $acc->setPwd();
        header('Content-Type: text/xml');
        exit($xml->toXml($xmlArr));
        break;
    case "mem_chk":
        $acc = new Account($_p);
        $chk = $acc->chk_mem();
        if($chk["status"]=="error"){
            exit("{$chk["code"]};{$chk["msg"]}");
        }
        exit("N;{$ls_code_ary["chgid_ok"]}");
        break;
    case "mem_online"://检测是否在线
        $bs = new Base($_p);
        $guid = $bs->getUID();
        if($guid["status"] == "error"){
            $arr["code"] = "error";
            $arr["msg"] = $guid["msg"];
        }else{
            $arr["msg"] = "OK";
            $bs->chg_member_credit($guid["user"]);
        }
        header('Content-Type: text/xml');
        exit($xml->toXml($arr));
        break;
    case "chg_passwd_safe":
        header('Content-Type: text/xml');
        $acc = new Account($_p);
        $chk = $acc->setLoginName();
        if($chk["status"]=="error"){
            $arr = [
                'code' => $chk["code"],
                'msg' =>$chk["msg"]
            ];
            exit($xml->toXml($arr));
        }
        $arr = [
            'code' => '',
            'msg' => 'N',
            'str_user' => $ls_code_ary["chgid_ok"],
            'chg_long_user' => $ls_code_ary["chgid_complete"],
            'str_user_noDate' => ''
        ];
        exit($xml->toXml($arr));
        break;
    case "get_version":
        $arr = [
            "code" => 666,
            "ver" =>  $ver,
            "site"=>"EN1"
        ];
        header('Content-Type: text/xml');
        exit($xml->toXml($arr));
        break;
    case "home":
        $js .= '
            var artjson = {
				//WEBP
				"ART_img_event_0": "srcset=\"../../images/img_sideshow_0_cn.webp?2024v1\" type=\"image/webp\"",
                "ART_img_ioc2024": "srcset=\"../../images/img_ioc2024_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_timeset": "srcset=\"../../images/img_timeset_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_newPD": "srcset=\"../../images/img_newPD_cn.webp?202406v2\" type=\"image/webp\"",
                "ART_img_filters": "srcset=\"../../images/img_filters_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_forecast": "srcset=\"../../images/img_forecast_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_event_3": "srcset=\"../../images/img_sideshow_3_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_mygame": "srcset=\"../../images/img_mygame_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_event_5": "srcset=\"../../images/img_sideshow_5_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_appdw": "srcset=\"../../images/img_appdw_cn.webp?2024v2\" type=\"image/webp\"",
                "ART_img_liveTV": "srcset=\"../../images/img_liveTV_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_hotgame": "srcset=\"../../images/img_hotgame_cn.webp?2024v0\" type=\"image/webp\"",
               "ART_img_esport": "srcset=\"../../images/img_esport_cn.webp?2025v0\" type=\"image/webp\"",
			   
				"ART_home_sports": "'.$artjson["ART_home_sports"].'",
				
				"ART_home_inplay_n": "'.$artjson["ART_home_inplay_n"].'",
				"ART_home_today_n": "'.$artjson["ART_home_today_n"].'",
				"ART_home_early_n": "'.$artjson["ART_home_early_n"].'",
				
                "ART_home_lang": "'.$artjson["ART_lang"].'",
                "ART_pic_lang": "'.$artjson["ART_pic_lang"].'",
                "ART_home_inplay": "'.$artjson["ART_home_inplay"].'",
                "ART_home_today": "'.$artjson["ART_home_today"].'",
                "ART_home_early": "'.$artjson["ART_home_early"].'",
                "ART_home_nodata": "'.$artjson["ART_home_nodata"].'",
            
                "ART_home_ft": "'.$artjson["ART_home_ft"].'",
                "ART_home_bk": "'.$artjson["ART_home_bk"].'",
                "ART_home_tn": "'.$artjson["ART_home_tn"].'",
                "ART_home_vb": "'.$artjson["ART_home_vb"].'",
                "ART_home_bm": "'.$artjson["ART_home_bm"].'",
                "ART_home_tt": "'.$artjson["ART_home_tt"].'",
                "ART_home_bs": "'.$artjson["ART_home_bs"].'",
                "ART_home_sk": "'.$artjson["ART_home_sk"].'",
                "ART_home_op": "'.$artjson["ART_home_op"].'",
				"ART_home_es": "'.$artjson["ART_home_es"].'",
                "ART_game_new": "'.$artjson["ART_game_new"].'",
				
                "ART_home_view_text1": "'.$artjson["ART_home_view_text1"].'“",
                "ART_home_view_text2": "'.$artjson["ART_home_view_text2"].'",
                "ART_home_view_text3": "'.$artjson["ART_home_view_text3"].'",
                "ART_home_view_text4": "'.$artjson["ART_home_view_text4"].'",
                "ART_home_view_text5": "'.$artjson["ART_home_view_text5"].'",
                "ART_home_view_text6": "'.$artjson["ART_home_view_text6"].'",
                "ART_home_view_text7": "'.$artjson["ART_home_view_text7"].'",
            }
        ';
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/runall.js",
            "js/lib/runandroid.js",
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/AD.js",
            "js/{$_p["p"]}.js",
            "js/lib/strict.min.js"
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "bottom":
        $js .= '
            var artjson = {
                "ART_bottom_sport": "'.$artjson["ART_bottom_sport"].'",
                "ART_bottom_schedule": "'.$artjson["ART_bottom_schedule"].'",
                "ART_bottom_betslip": "'.$artjson["ART_bottom_betslip"].'",
                "ART_bottom_statement": "'.$artjson["ART_bottom_statement"].'",
                "ART_bottom_openbet": "'.$artjson["ART_bottom_openbet"].'",
                "ART_bottom_mybets": "'.$artjson["ART_bottom_mybets"].'",
                "ART_bottom_mygame": "'.$artjson["ART_bottom_mygame"].'",
                "ART_text_new": "'.$artjson["ART_text_new"].'",
                "ART_bottom_myright": "'.$artjson["ART_bottom_myright"].'",
            }
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js"
        ];

        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
		//底页
    case "footer":
        $js .= '           
			var footer_artjson = {
			      "ART_title_relate": "'.$artjson["ART_title_relate"].'",
				  "ART_game_gmt4": "'.$artjson["ART_game_gmt4"].'",
				  "ART_footer_language": "'.$artjson["ART_footer_language"].'",
				  "ART_lan_tw": "'.$artjson["ART_lan_tw"].'",
				  "ART_lan_cn": "'.$artjson["ART_lan_cn"].'",
				  "ART_lan_en": "'.$artjson["ART_lan_en"].'",
				  "ART_footer_feature": "'.$artjson["ART_footer_feature"].'",
				  "ART_footer_rule": "'.$artjson["ART_footer_rule"].'",
				  "ART_footer_system": "'.$artjson["ART_footer_system"].'",
				  "ART_footer_term": "'.$artjson["ART_footer_term"].'",
				  "ART_footer_phone": "'.$artjson["ART_footer_phone"].'",
				  "ART_footer_email": "'.$artjson["ART_footer_email"].'",
				  "ART_footer_copyright": "'.$artjson["ART_footer_copyright"].'",
				  
				  "ART_footer_copyright": "'.$artjson["ART_footer_copyright"].'",
				  "ART_footer_copyright": "'.$artjson["ART_footer_copyright"].'",
				  "ART_footer_copyright": "'.$artjson["ART_footer_copyright"].'",
                  "ART_footer_app": "'.$artjson["ART_footer_app"].'",
				  "ART_footer_time": "'.$artjson["ART_footer_time"].'",
				  "ART_time_sys": "'.$artjson["ART_time_sys"].'",
				  "ART_time_dev": "'.$artjson["ART_time_dev"].'",

				  "ART_footer_hot": "'.$artjson["ART_footer_hot"].'",
				  "ART_footer_today": "'.$artjson["ART_footer_today"].'",
				  "ART_footer_soon": "'.$artjson["ART_footer_soon"].'",
				  "ART_footer_early": "'.$artjson["ART_footer_early"].'",
				  "ART_footer_outrights": "'.$artjson["ART_footer_outrights"].'",
				  "ART_footer_liveTV": "'.$artjson["ART_footer_liveTV"].'",
				  "ART_footer_faq": "'.$artjson["ART_footer_faq"].'",
				  "ART_footer_inplay": "'.$artjson["ART_footer_inplay"].'",    
				  "ART_footer_relate": "'.$artjson["ART_footer_relate"].'",    

			}
        ';
        $jsAry = [
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "order":
        $js .= '
            var artjson = {
                "ART_order_lang": "'.$artjson["ART_order_lang"].'",
                "ART_order_complete": "'.$artjson["ART_order_complete"].'",
                "ART_order_removeItem": "'.$artjson["ART_order_removeItem"].'",
                "ART_order_rememberAmount": "'.$artjson["ART_order_rememberAmount"].'",
                "ART_order_addOrder": "'.$artjson["ART_order_addOrder"].'",
                "ART_order_betting": "'.$artjson["ART_order_betting"].'",
                "ART_order_processing": "'.$artjson["ART_order_processing"].'",
                "ART_order_rememberItem": "'.$artjson["ART_order_rememberItem"].'",
                "ART_order_confirm": "'.$artjson["ART_order_confirm"].'",
                "ART_order_getAmount": "'.$artjson["ART_order_getAmount"].'",
                "ART_order_setAmount": "'.$artjson["ART_order_setAmount"].'",
                "ART_order_toWin": "'.$artjson["ART_order_toWin"].'",
                "ART_order_rotateBet": "'.$artjson["ART_order_rotateBet"].'",
                "ART_order_removeAllItem": "'.$artjson["ART_order_removeAllItem"].'",
                "ART_order_stake": "'.$artjson["ART_order_stake"].'",
                "ART_order_rotateView": "'.$artjson["ART_order_rotateView"].'",
                "ART_order_order": "'.$artjson["ART_order_order"].'",
                "ART_order_in": "'.$artjson["ART_order_in"].'",
                "ART_order_removeAll": "'.$artjson["ART_order_removeAll"].'",
                "ART_order_parlay": "'.$artjson["ART_order_parlay"].'",
                "ART_order_singleOrder": "'.$artjson["ART_order_singleOrder"].'",
                "ART_order_null": "'.$artjson["ART_order_null"].'",
                "ART_order_total": "'.$artjson["ART_order_total"].'",
                "ART_order_estimate": "'.$artjson["ART_order_estimate"].'",
                "ART_order_betlist": "'.$artjson["ART_order_betlist"].'",
                "ART_order_multiple": "'.$artjson["ART_order_multiple"].'",
                "ART_order_setOrder": "'.$artjson["ART_order_setOrder"].'",
                "ART_order_setOdd": "'.$artjson["ART_order_setOdd"].'",
                "ART_order_bestOdd": "'.$artjson["ART_order_bestOdd"].'",
                "ART_order_fantasy": "'.$artjson["ART_order_fantasy"].'",
                "ART_order_input": "输入下注金额",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/lib/ratioChgRule.js",
            "js/lib/Util_game.js",
            "js/lib/self_keyboard.js",
            "js/order/order.js",
            "js/order/Total_order.js",
            "js/order/FT_bet.js",
            "js/order/FS_bet.js",
            "js/order/Other_bet.js",
            "js/order/Total_bet.js",
            "js/order/FS_bet.js",

            "js/lib/CookieManager.js",
            "js/lib/scrollPreventOutside.js"
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "header":
        $js .= '
            var artjson = {
                "ART_header_inplay": "'.$artjson["ART_header_inplay"].'",
                "ART_header_upcoming": "'.$artjson["ART_header_upcoming"].'",
                "ART_header_today": "'.$artjson["ART_header_today"].'",
                "ART_header_early": "'.$artjson["ART_header_early"].'",
                "ART_header_outrights": "'.$artjson["ART_header_outrights"].'",
                "ART_header_parlay": "'.$artjson["ART_header_parlay"].'",                
            
                "ART_bottom_schedule": "'.$artjson["ART_bottom_schedule"].'",
                "ART_bottom_openbet": "'.$artjson["ART_bottom_openbet"].'",
                "ART_bottom_mygame": "'.$artjson["ART_bottom_mygame"].'",
                "ART_bottom_mybets": "'.$artjson["ART_bottom_mybets"].'",
                "ART_bottom_statement": "'.$artjson["ART_bottom_statement"].'",
                "ART_header_soon": "'.$artjson["ART_header_soon"].'",
				"ART_header_hot": "'.$artjson["ART_header_hot"].'",
                "ART_text_new": "'.$artjson["ART_text_new"].'",
				
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js"
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "right_panel":
        $js .= '
            var artjson = {
                "ART_lang": "'.$artjson["ART_lang"].'",
                "ART_pic_lang": "'.$artjson["ART_pic_lang"].'",
                
				
				//WEBP
                "ART_img_event_0": "srcset=\"../../images/img_sideshow_0_cn.webp?2024v1\" type=\"image/webp\"",
                "ART_img_ioc2024": "srcset=\"../../images/img_ioc2024_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_timeset": "srcset=\"../../images/img_timeset_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_newPD": "srcset=\"../../images/img_newPD_cn.webp?202406v2\" type=\"image/webp\"",
                "ART_img_filters": "srcset=\"../../images/img_filters_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_forecast": "srcset=\"../../images/img_forecast_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_event_3": "srcset=\"../../images/img_sideshow_3_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_mygame": "srcset=\"../../images/img_mygame_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_event_5": "srcset=\"../../images/img_sideshow_5_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_appdw": "srcset=\"../../images/img_appdw_cn.webp?2024v2\" type=\"image/webp\"",
                "ART_img_liveTV": "srcset=\"../../images/img_liveTV_cn.webp?2024v0\" type=\"image/webp\"",
                "ART_img_hotgame": "srcset=\"../../images/img_hotgame_cn.webp?2024v0\" type=\"image/webp\"",
				"ART_img_esport": "srcset=\"../../images/img_esport_cn.webp?2025v0\" type=\"image/webp\"",
			
            };
        ';
        $jsAry = [
            "js/conf/config_set.js",
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            "js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/betgenius.js",
            "js/tv/check_agent.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
		
    case "right_menu":
        $js .= '
            var artjson = {
				"ART_acc_tv": "'.$artjson["ART_acc_tv"].'",
                "ART_acc_history": "'.$artjson["ART_acc_history"].'",
                "ART_acc_creditlog": "'.$artjson["ART_acc_creditlog"].'",
                "ART_acc_messages": "'.$artjson["ART_acc_messages"].'",
                "ART_acc_set": "'.$artjson["ART_acc_set"].'",
                "ART_acc_language": "'.$artjson["ART_acc_language"].'",
                "ART_lan_tw": "'.$artjson["ART_lan_tw"].'",
                "ART_lan_cn": "'.$artjson["ART_lan_cn"].'",
                "ART_lan_en": "'.$artjson["ART_lan_en"].'",
                "ART_acc_market": "'.$artjson["ART_acc_market"].'",
                "ART_market_hk": "'.$artjson["ART_market_hk"].'",
                "ART_market_ml": "'.$artjson["ART_market_ml"].'",
                "ART_market_in": "'.$artjson["ART_market_in"].'",
                "ART_market_eu": "'.$artjson["ART_market_eu"].'",
                "ART_acc_changepwd": "'.$artjson["ART_acc_changepwd"].'",
                "ART_acc_passcode": "'.$artjson["ART_acc_passcode"].'",
                "ART_acc_active": "'.$artjson["ART_acc_active"].'",
                "ART_acc_pwdrecovery": "'.$artjson["ART_acc_pwdrecovery"].'",
                "ART_acc_setting": "'.$artjson["ART_acc_setting"].'",
                "ART_acc_support": "'.$artjson["ART_acc_support"].'",
                "ART_acc_feature": "'.$artjson["ART_acc_feature"].'",
                "ART_acc_odds": "'.$artjson["ART_acc_odds"].'",
                "ART_acc_rule": "'.$artjson["ART_acc_rule"].'",
                "ART_acc_term": "'.$artjson["ART_acc_term"].'",
                "ART_acc_fix": "'.$artjson["ART_acc_fix"].'",
                "ART_acc_contact": "'.$artjson["ART_acc_contact"].'",
                "ART_acc_logout": "'.$artjson["ART_acc_logout"].'",
                "ART_acc_system": "'.$artjson["ART_acc_system"].'",
                "ART_acc_result": "'.$artjson["ART_acc_result"].'",
				"ART_acc_faq": "'.$artjson["ART_acc_faq"].'",
				"ART_acc_time": "'.$artjson["ART_acc_time"].'",
				"ART_time_sys": "'.$artjson["ART_time_sys"].'",
				"ART_time_dev": "'.$artjson["ART_time_dev"].'",
				"ART_acc_oddupdate": "'.$artjson["ART_acc_oddupdate"].'",
				"ART_oddupdate_note": "'.$artjson["ART_oddupdate_note"].'",
				
            }
        ';
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js"
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
        		//常见问题
	case "help_faq":
		$js .= '
        var artjson = {
		 "ART_faq": "'.$artjson["ART_faq"].'",
		 "ART_date": "'.$artjson["ART_date"].'",
		 "ART_faq_acc": "'.$artjson["ART_faq_acc"].'",
		 "ART_faq_acc_q1": "'.$artjson["ART_faq_acc_q1"].'",
		 "ART_faq_acc_a1": "'.$artjson["ART_faq_acc_a1"].'",
		 "ART_faq_acc_q2": "'.$artjson["ART_faq_acc_q2"].'",
		 "ART_faq_acc_a2": "'.$artjson["ART_faq_acc_a2"].'",
		 "ART_faq_acc_q3": "'.$artjson["ART_faq_acc_q3"].'",
		 "ART_faq_acc_a3": "'.$artjson["ART_faq_acc_a3"].'",
		 "ART_faq_acc_q4": "'.$artjson["ART_faq_acc_q4"].'",
		 "ART_faq_acc_a4": "'.$artjson["ART_faq_acc_a4"].'",
		 "ART_faq_acc_q5": "'.$artjson["ART_faq_acc_q5"].'",
		 "ART_faq_acc_a5": "'.$artjson["ART_faq_acc_a5"].'",
		 "ART_faq_acc_q6": "'.$artjson["ART_faq_acc_q6"].'",
		 "ART_faq_acc_a6": "'.$artjson["ART_faq_acc_a6"].'",
		 
		 "ART_faq_bets": "'.$artjson["ART_faq_bets"].'",  
         "ART_faq_bets_q1": "'.$artjson["ART_faq_bets_q1"].'",  
         "ART_faq_bets_a1": "'.$artjson["ART_faq_bets_a1"].'",  
         "ART_faq_bets_q2": "'.$artjson["ART_faq_bets_q2"].'",  
         "ART_faq_bets_a2": "'.$artjson["ART_faq_bets_a2"].'",  
         "ART_faq_bets_q3": "'.$artjson["ART_faq_bets_q3"].'",  
         "ART_faq_bets_a3": "'.$artjson["ART_faq_bets_a3"].'",  
         "ART_faq_bets_q4": "'.$artjson["ART_faq_bets_q4"].'",  
         "ART_faq_bets_a4": "'.$artjson["ART_faq_bets_a4"].'",  
         "ART_faq_bets_q5": "'.$artjson["ART_faq_bets_q5"].'",  
         "ART_faq_bets_a5": "'.$artjson["ART_faq_bets_a5"].'",  
         "ART_faq_bets_q6": "'.$artjson["ART_faq_bets_q6"].'",  
         "ART_faq_bets_a6": "'.$artjson["ART_faq_bets_a6"].'",  
         "ART_faq_bets_q7": "'.$artjson["ART_faq_bets_q7"].'",  
         "ART_faq_bets_a7": "'.$artjson["ART_faq_bets_a7"].'",  
         "ART_faq_bets_q8": "'.$artjson["ART_faq_bets_q8"].'",  
         "ART_faq_bets_a8": "'.$artjson["ART_faq_bets_a8"].'",  
         "ART_faq_bets_q9": "'.$artjson["ART_faq_bets_q9"].'",  
         "ART_faq_bets_a9": "'.$artjson["ART_faq_bets_a9"].'",  
         "ART_faq_bets_q10": "'.$artjson["ART_faq_bets_q10"].'",
		 "ART_faq_bets_a10_1": "'.$artjson["ART_faq_bets_a10_1"].'",
		 "ART_faq_bets_a10_2": "'.$artjson["ART_faq_bets_a10_2"].'",
		 
		 "ART_faq_bets_q11": "'.$artjson["ART_faq_bets_q11"].'",  
         "ART_faq_bets_a11": "'.$artjson["ART_faq_bets_a11"].'",  
         "ART_faq_bets_q12": "'.$artjson["ART_faq_bets_q12"].'",  
         "ART_faq_bets_a12": "'.$artjson["ART_faq_bets_a12"].'",
		 "ART_faq_bets_q13": "'.$artjson["ART_faq_bets_q13"].'",
		 "ART_faq_bets_a13": "'.$artjson["ART_faq_bets_a13"].'",
		 
		 "ART_faq_bets_a4_1": "'.$artjson["ART_faq_bets_a4_1"].'",
		 "ART_faq_bets_a4_2": "'.$artjson["ART_faq_bets_a4_2"].'",
		 "ART_faq_bets_a4_3": "'.$artjson["ART_faq_bets_a4_3"].'",
		 "ART_faq_bets_a4_4": "'.$artjson["ART_faq_bets_a4_4"].'",
		 "ART_faq_bets_a4_5_1": "'.$artjson["ART_faq_bets_a4_5_1"].'",
		 "ART_faq_bets_a4_5_2": "'.$artjson["ART_faq_bets_a4_5_2"].'",
		 "ART_faq_bets_a4_5_3": "'.$artjson["ART_faq_bets_a4_5_3"].'",
		 
		 "ART_faq_crd": "'.$artjson["ART_faq_crd"].'",
		 "ART_faq_crd_q1": "'.$artjson["ART_faq_crd_q1"].'",
		 "ART_faq_crd_a1": "'.$artjson["ART_faq_crd_a1"].'",
		 "ART_faq_crd_q2": "'.$artjson["ART_faq_crd_q2"].'",
		 "ART_faq_crd_a2": "'.$artjson["ART_faq_crd_a2"].'",
		 
		 "ART_faq_odds": "'.$artjson["ART_faq_odds"].'",
		 "ART_faq_odds_q1": "'.$artjson["ART_faq_odds_q1"].'",
		 "ART_faq_odds_a1_1": "'.$artjson["ART_faq_odds_a1_1"].'",
		 "ART_faq_odds_a1_2": "'.$artjson["ART_faq_odds_a1_2"].'",
		 "ART_faq_odds_a1_3": "'.$artjson["ART_faq_odds_a1_3"].'",
		 "ART_faq_odds_q2": "'.$artjson["ART_faq_odds_q2"].'",
		 "ART_faq_odds_a2": "'.$artjson["ART_faq_odds_a2"].'",
		 
		 "ART_faq_cxl": "'.$artjson["ART_faq_cxl"].'",
		 "ART_faq_cxl_q1": "'.$artjson["ART_faq_cxl_q1"].'",
		 "ART_faq_cxl_q2": "'.$artjson["ART_faq_cxl_q2"].'",
		 "ART_faq_cxl_q3": "'.$artjson["ART_faq_cxl_q3"].'",
		 "ART_faq_cxl_q4": "'.$artjson["ART_faq_cxl_q4"].'",
		 "ART_faq_cxl_q5": "'.$artjson["ART_faq_cxl_q5"].'",
		 "ART_faq_cxl_q6": "'.$artjson["ART_faq_cxl_q6"].'",
		 "ART_faq_cxl_q7": "'.$artjson["ART_faq_cxl_q7"].'",
		 "ART_faq_cxl_a1": "'.$artjson["ART_faq_cxl_a1"].'",
		 "ART_faq_cxl_a2": "'.$artjson["ART_faq_cxl_a2"].'",
		 "ART_faq_cxl_a3": "'.$artjson["ART_faq_cxl_a3"].'",
		 "ART_faq_cxl_a4": "'.$artjson["ART_faq_cxl_a4"].'",
		 "ART_faq_cxl_a5": "'.$artjson["ART_faq_cxl_a5"].'",
		 "ART_faq_cxl_a6": "'.$artjson["ART_faq_cxl_a6"].'",
		 "ART_faq_cxl_a7": "'.$artjson["ART_faq_cxl_a7"].'",
		 
		 "ART_faq_fs": "'.$artjson["ART_faq_fs"].'",
		 "ART_faq_fs_q1": "'.$artjson["ART_faq_fs_q1"].'",
		 "ART_faq_fs_q2": "'.$artjson["ART_faq_fs_q2"].'",
		 "ART_faq_fs_a1": "'.$artjson["ART_faq_fs_a1"].'",
		 "ART_faq_fs_a2": "'.$artjson["ART_faq_fs_a2"].'",
		 "ART_faq_fs_a2_1": "'.$artjson["ART_faq_fs_a2_1"].'",
		 "ART_faq_fs_a2_2": "'.$artjson["ART_faq_fs_a2_2"].'",
		 "ART_faq_fs_a2_3": "'.$artjson["ART_faq_fs_a2_3"].'",
		 "ART_faq_fs_a2_4": "'.$artjson["ART_faq_fs_a2_4"].'",
		 "ART_faq_fs_a2_5": "'.$artjson["ART_faq_fs_a2_5"].'",
		 "ART_faq_fs_a2_6": "'.$artjson["ART_faq_fs_a2_6"].'",
		 "ART_faq_fs_a2_7": "'.$artjson["ART_faq_fs_a2_7"].'",
		 
		  "ART_faq_rslt": "'.$artjson["ART_faq_rslt"].'",
		  "ART_faq_rslt_q1": "'.$artjson["ART_faq_rslt_q1"].'",
		  "ART_faq_rslt_q2": "'.$artjson["ART_faq_rslt_q2"].'",
		  "ART_faq_rslt_q3": "'.$artjson["ART_faq_rslt_q3"].'",
		  "ART_faq_rslt_q4": "'.$artjson["ART_faq_rslt_q4"].'",
		  "ART_faq_rslt_a1": "'.$artjson["ART_faq_rslt_a1"].'",
		  "ART_faq_rslt_a2": "'.$artjson["ART_faq_rslt_a2"].'",
		  "ART_faq_rslt_a3": "'.$artjson["ART_faq_rslt_a3"].'",
		  "ART_faq_rslt_a4": "'.$artjson["ART_faq_rslt_a4"].'",
				  
		 "ART_faq_web": "'.$artjson["ART_faq_web"].'",
		 "ART_faq_web_q1": "'.$artjson["ART_faq_web_q1"].'",
		 "ART_faq_web_q2": "'.$artjson["ART_faq_web_q2"].'",
		 "ART_faq_web_a1": "'.$artjson["ART_faq_web_a1"].'",
		 "ART_faq_web_a2": "'.$artjson["ART_faq_web_a2"].'",
		 
		 "ART_faq_tv": "'.$artjson["ART_faq_tv"].'",
		 "ART_faq_tv_q1": "'.$artjson["ART_faq_tv_q1"].'",
		 "ART_faq_tv_q2": "'.$artjson["ART_faq_tv_q2"].'",
		 "ART_faq_tv_q3": "'.$artjson["ART_faq_tv_q3"].'",
		 "ART_faq_tv_q4": "'.$artjson["ART_faq_tv_q4"].'",
		 "ART_faq_tv_q5": "'.$artjson["ART_faq_tv_q5"].'",
		 "ART_faq_tv_q6": "'.$artjson["ART_faq_tv_q6"].'",
		 "ART_faq_tv_q7": "'.$artjson["ART_faq_tv_q7"].'",
		 "ART_faq_tv_a1": "'.$artjson["ART_faq_tv_a1"].'",
		 "ART_faq_tv_a2": "'.$artjson["ART_faq_tv_a2"].'",
		 "ART_faq_tv_a3": "'.$artjson["ART_faq_tv_a3"].'",
		 "ART_faq_tv_a4": "'.$artjson["ART_faq_tv_a4"].'",
		 "ART_faq_tv_a5": "'.$artjson["ART_faq_tv_a5"].'",
		 "ART_faq_tv_a6": "'.$artjson["ART_faq_tv_a6"].'",
		 "ART_faq_tv_a7": "'.$artjson["ART_faq_tv_a7"].'",
		 
		 "ART_faq_parlay": "'.$artjson["ART_faq_cxl"].'",
		 "ART_faq_parlay_q1": "'.$artjson["ART_faq_parlay_q1"].'",
		 "ART_faq_parlay_q2": "'.$artjson["ART_faq_parlay_q2"].'",
		 "ART_faq_parlay_a1": "'.$artjson["ART_faq_parlay_a1"].'",
		 "ART_faq_parlay_a2": "'.$artjson["ART_faq_parlay_a2"].'",
		 
		 "ART_faq_app": "'.$artjson["ART_faq_app"].'",
		 "ART_faq_app_q1": "'.$artjson["ART_faq_app_q1"].'",
		 "ART_faq_app_a1": "'.$artjson["ART_faq_app_a1"].'",
		 "ART_faq_app_q2": "'.$artjson["ART_faq_app_q2"].'",
		 "ART_faq_app_a2_1": "'.$artjson["ART_faq_app_a2_1"].'",
		 "ART_faq_app_a2_2": "'.$artjson["ART_faq_app_a2_2"].'",
		 "ART_faq_app_a2_3": "'.$artjson["ART_faq_app_a2_3"].'",
		 
		 "ART_faq_oth": "'.$artjson["ART_faq_oth"].'",
		 "ART_faq_oth_q1": "'.$artjson["ART_faq_oth_q1"].'",
		 "ART_faq_oth_a1": "'.$artjson["ART_faq_oth_a1"].'",
		 
            };
        ';
         $jsAry = [
           "js/lib/Util.js",
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "announcement":
        $js .= '
            var artjson = {
                "ART_ann_title": "'.$artjson["ART_ann_title"].'",
                "ART_ann_txt01": "'.$artjson["ART_ann_txt01"].'",
                "ART_ann_txt02": "'.$artjson["ART_ann_txt02"].'",
                "ART_ann_immediate": "'.$artjson["ART_ann_immediate"].'",
                "ART_ann_ok": "'.$artjson["ART_ann_ok"].'",
                "ART_ann_lang": "'.$artjson["ART_ann_lang"].'",
                "ART_features_title01": "'.$artjson["ART_features_title01"].'",
                "ART_features_txt01_1": "'.$artjson["ART_features_txt01_1"].'",
                "ART_features_txt01_2": "'.$artjson["ART_features_txt01_2"].'",
                "ART_features_txt01_3": "'.$artjson["ART_features_txt01_3"].'",
                "ART_features_title02": "'.$artjson["ART_features_title02"].'",
                "ART_features_txt02_1": "'.$artjson["ART_features_txt02_1"].'",
                "ART_features_title03": "'.$artjson["ART_features_title03"].'",
                "ART_features_txt03_1": "'.$artjson["ART_features_txt03_1"].'",
                "ART_features_title04": "'.$artjson["ART_features_title04"].'",
                "ART_features_txt04_1": "'.$artjson["ART_features_txt04_1"].'",
                "ART_features_title05": "'.$artjson["ART_features_title05"].'",
                "ART_features_txt05_1": "'.$artjson["ART_features_txt05_1"].'",
                "ART_features_title06": "'.$artjson["ART_features_title06"].'",
                "ART_features_txt06_1": "'.$artjson["ART_features_txt06_1"].'",
                "ART_ann_btn": "'.$artjson["ART_ann_btn"].'",
            
                "ART_ann_bethold": "'.$artjson["ART_ann_bethold"].'",
                "ART_ann_bethold_title": "'.$artjson["ART_ann_bethold_title"].'",
                "ART_ann_bethold_txt": "'.$artjson["ART_ann_bethold_txt"].'",

                "ART_forecast_title": "'.$artjson["ART_forecast_title"].'",
                "ART_ann_forecast_tx01": "'.$artjson["ART_ann_forecast_tx01"].'",
                "ART_ann_forecast_tx02": "'.$artjson["ART_ann_forecast_tx02"].'",
                "ART_ann_ok_btn": "'.$artjson["ART_ann_ok_btn"].'",
                "ART_ann_got_btn": "'.$artjson["ART_ann_got_btn"].'",

                "ART_features_txt01": "'.$artjson["ART_ann_title"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js"
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
		
	case "system_req":	
    case "help_sys":
        $js .= '
            var artjson = {
                "ART_lang": "'.$artjson["ART_lang"].'",
                
                
                "ART_sys_text_1": "'.$artjson["ART_sys_text_1"].'",
                "ART_sys_tb_a_1_2": "'.$artjson["ART_sys_tb_a_1_2"].'",
                
                "ART_sys_title": "'.$artjson["ART_sys_title"].'",
                "ART_sys_title": "'.$artjson["ART_sys_title"].'",
            
                "ART_sys_subtitle_a": "'.$artjson["ART_sys_subtitle_a"].'",
                "ART_sys_tb_a_1_1": "'.$artjson["ART_sys_tb_a_1_1"].'",
                "ART_sys_tb_a_1_1": "'.$artjson["ART_sys_tb_a_1_1"].'",
                "ART_sys_tb_a_2_1": "'.$artjson["ART_sys_tb_a_2_1"].'",
                "ART_sys_tb_a_2_2": "'.$artjson["ART_sys_tb_a_2_2"].'",
                "ART_sys_tb_a_3_1": "'.$artjson["ART_sys_tb_a_3_1"].'",
                "ART_sys_tb_a_3_2": "'.$artjson["ART_sys_tb_a_3_2"].'",
            
                "ART_sys_subtitle_b": "'.$artjson["ART_sys_subtitle_b"].'",
                "ART_sys_tb_b_1_1": "'.$artjson["ART_sys_tb_b_1_1"].'",
                "ART_sys_tb_b_1_2": "'.$artjson["ART_sys_tb_b_1_2"].'",
                "ART_sys_tb_b_2_1": "'.$artjson["ART_sys_tb_b_2_1"].'",
                "ART_sys_tb_b_2_2": "'.$artjson["ART_sys_tb_b_2_2"].'",
                "ART_sys_tb_b_3_1": "'.$artjson["ART_sys_tb_b_3_1"].'",
                "ART_sys_tb_b_3_2": "'.$artjson["ART_sys_tb_b_3_2"].'",
            
                "ART_sys_tb_c_1_1": "'.$artjson["ART_sys_tb_c_1_1"].'",
                "ART_sys_tb_c_1_2": "'.$artjson["ART_sys_tb_c_1_2"].'",
                "ART_sys_tb_c_2_1": "'.$artjson["ART_sys_tb_c_2_1"].'",
                "ART_sys_tb_c_2_2": "'.$artjson["ART_sys_tb_c_2_2"].'",
                "ART_sys_tb_c_3_1": "'.$artjson["ART_sys_tb_c_3_1"].'",
                "ART_sys_tb_c_3_2": "'.$artjson["ART_sys_tb_c_3_2"].'",
                "ART_sys_tb_c_4_1": "'.$artjson["ART_sys_tb_c_4_1"].'",
                "ART_sys_tb_c_4_2": "'.$artjson["ART_sys_tb_c_4_2"].'",
            
                "ART_sys_subtitle_d": "'.$artjson["ART_sys_subtitle_d"].'",
                "ART_sys_tb_d_1_1": "'.$artjson["ART_sys_tb_d_1_1"].'",
                "ART_sys_tb_d_1_2": "'.$artjson["ART_sys_tb_d_1_2"].'",
                "ART_sys_tb_d_2_1": "'.$artjson["ART_sys_tb_d_2_1"].'",
                "ART_sys_tb_d_2_2": "'.$artjson["ART_sys_tb_d_2_2"].'",
                "ART_sys_tb_d_3_1": "'.$artjson["ART_sys_tb_d_3_1"].'",
                "ART_sys_tb_d_3_2": "'.$artjson["ART_sys_tb_d_3_2"].'",
            
                "ART_sys_subtitle_e": "'.$artjson["ART_sys_subtitle_e"].'",
                "ART_sys_tb_e_1_1": "'.$artjson["ART_sys_tb_e_1_1"].'",
                "ART_sys_tb_e_1_2": "'.$artjson["ART_sys_tb_e_1_2"].'",
                "ART_sys_tb_e_2_1": "'.$artjson["ART_sys_tb_e_2_1"].'e",
                "ART_sys_tb_e_2_2": "'.$artjson["ART_sys_tb_e_2_2"].'",
                "ART_sys_tb_e_3_1": "'.$artjson["ART_sys_tb_e_3_1"].'",
                "ART_sys_tb_e_3_2": "'.$artjson["ART_sys_tb_e_3_2"].'",
            
                "ART_sys_tb_f_1_1": "'.$artjson["ART_sys_tb_f_1_1"].'",
                "ART_sys_tb_f_1_2": "'.$artjson["ART_sys_tb_f_1_2"].'",
                "ART_sys_tb_f_2_1": "'.$artjson["ART_sys_tb_f_2_1"].'",
                "ART_sys_tb_f_2_2": "'.$artjson["ART_sys_tb_f_2_2"].'",
                "ART_sys_tb_f_3_1": "'.$artjson["ART_sys_tb_f_3_1"].'",
                "ART_sys_tb_f_3_2": "'.$artjson["ART_sys_tb_f_3_2"].'",
                "ART_sys_tb_f_4_1": "'.$artjson["ART_sys_tb_f_4_1"].'",
                "ART_sys_tb_f_4_2": "'.$artjson["ART_sys_tb_f_4_2"].'",
            
                "ART_sys_subtitle_g": "'.$artjson["ART_sys_subtitle_g"].'",
                "ART_sys_text_2": "'.$artjson["ART_sys_text_2"].'",
				"ART_sys_btn": "'.$artjson["ART_sys_btn"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js"
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "passcode":
        $js .= '
            var artjson = {
                "ART_passcode_title": "'.$artjson["ART_passcode_title"].'",
                "ART_passcode_enter": "'.$artjson["ART_passcode_enter"].'",
                "ART_passcode_check": "'.$artjson["ART_passcode_check"].'",
                "ART_passcode_set": "'.$artjson["ART_passcode_set"].'",
                "ART_passcode_reset": "'.$artjson["ART_passcode_reset"].'",
                "ART_passcode_err": "'.$artjson["ART_passcode_err"].'",
                "ART_passcode_close": "'.$artjson["ART_passcode_close"].'",
                "ART_passcode_delete": "'.$artjson["ART_passcode_delete"].'",
                "ART_passcode_success": "'.$artjson["ART_passcode_success"].'",
                "ART_passcode_succtxt": "'.$artjson["ART_passcode_succtxt"].'",
                "ART_passcode_nextset": "'.$artjson["ART_passcode_nextset"].'",
                "ART_passcode_ok": "'.$artjson["ART_passcode_ok"].'",
                "ART_passcode_txt01": "'.$artjson["ART_passcode_txt01"].'",
                "ART_passcode_txt02": "'.$artjson["ART_passcode_txt02"].'",
                "ART_passcode_txt03": "'.$artjson["ART_passcode_txt03"].'",
                "ART_passcode_txt04": "'.$artjson["ART_passcode_txt04"].'",
                "ART_passcode_remove": "'.$artjson["ART_passcode_remove"].'",
                "ART_passcode_edit": "'.$artjson["ART_passcode_edit"].'",
                "ART_passcode_no": "'.$artjson["ART_passcode_no"].'",
                "ART_passcode_yes": "'.$artjson["ART_passcode_yes"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js"
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
     case "sport_menu":
        $js .= '
            var artjson = {
				/*电子竞技*/
				"ART_ES_all": "'.$artjson["ART_ES_all"].'",
				"ART_ES_Highlights": "'.$artjson["ART_ES_Highlights"].'",
				"ART_ES_INPLAY": "'.$artjson["ART_ES_INPLAY"].'",
				"ART_ES_LOL": "'.$artjson["ART_ES_LOL"].'",
				"ART_ES_DOTA": "'.$artjson["ART_ES_DOTA"].'",
				"ART_ES_CS": "'.$artjson["ART_ES_CS"].'",
				"ART_ES_KOG": "'.$artjson["ART_ES_KOG"].'",
				"ART_ES_VAL": "'.$artjson["ART_ES_VAL"].'",
				"ART_ES_WR": "'.$artjson["ART_ES_WR"].'",
				"ART_ES_ML": "'.$artjson["ART_ES_ML"].'",
				"ART_ES_STAR2": "'.$artjson["ART_ES_STAR2"].'",
				"ART_ES_PUBG": "'.$artjson["ART_ES_PUBG"].'",
				"ART_ES_AOV": "'.$artjson["ART_ES_AOV"].'",
				"ART_ES_OVE": "'.$artjson["ART_ES_OVE"].'",
				"ART_ES_RS": "'.$artjson["ART_ES_RS"].'",
				"ART_ES_RL": "'.$artjson["ART_ES_RL"].'",
				"ART_ES_STAR": "'.$artjson["ART_ES_STAR"].'",
				"ART_ES_WAR": "'.$artjson["ART_ES_WAR"].'",
				"ART_ES_CRO": "'.$artjson["ART_ES_CRO"].'",
				"ART_ES_COD": "'.$artjson["ART_ES_COD"].'",
				"ART_ES_FF": "'.$artjson["ART_ES_FF"].'",
				"ART_ES_AOE": "'.$artjson["ART_ES_AOE"].'",
				"ART_ES_AOE2": "'.$artjson["ART_ES_AOE2"].'",
				"ART_ES_PU": "'.$artjson["ART_ES_PU"].'",
				"ART_ES_AL": "'.$artjson["ART_ES_AL"].'",
				"AART_ES_OTHERS": "'.$artjson["ART_ES_OTHERS"].'",
				"ART_note_FS": "'.$artjson["ART_note_FS"].'",
				
				
                "ART_lang": "'.$artjson["ART_lang"].'",
                "ART_ball_ft": "'.$artjson["ART_ball_ft"].'",
                "ART_ball_bk": "'.$artjson["ART_ball_bk"].'",
                "ART_ball_tn": "'.$artjson["ART_ball_tn"].'",
                "ART_ball_vb": "'.$artjson["ART_ball_vb"].'",
                "ART_ball_bm": "'.$artjson["ART_ball_bm"].'",
                "ART_ball_tt": "'.$artjson["ART_ball_tt"].'",
                "ART_ball_bs": "'.$artjson["ART_ball_bs"].'",
                "ART_ball_sk": "'.$artjson["ART_ball_sk"].'",
                "ART_ball_op": "'.$artjson["ART_ball_op"].'",
				"ART_ball_es": "'.$artjson["ART_ball_es"].'",
				"ART_title_league": "'.$artjson["ART_title_league"].'",
				"ART_game_new": "'.$artjson["ART_game_new"].'",

				"ART_btn_prestart": "'.$artjson["ART_btn_prestart"].'",
				"ART_btn_all": "'.$artjson["ART_btn_all"].'",
				"ART_btn_next1": "'.$artjson["ART_btn_next1"].'",
				"ART_btn_next6": "'.$artjson["ART_btn_next6"].'",
                
                "ART_btn_highlights": "精选",
                "ART_btn_inplay": "'.$artjson["ART_btn_inplay"].'",
                "ART_btn_matches": "'.$artjson["ART_btn_matches"].'",
                "ART_btn_teams": "队伍",
                "ART_btn_FS": "'.$artjson["ART_btn_FS"].'",
                "ART_btn_FC": "'.$artjson["ART_btn_FC"].'",
				
				"ART_tag_mainmarket": "'.$artjson["ART_tag_mainmarket"].'",
				"ART_tag_RNOU": "'.$artjson["ART_tag_RNOU"].'",
				"ART_tag_CN": "'.$artjson["ART_tag_CN"].'",
				"ART_tag_RN": "'.$artjson["ART_tag_RN"].'",
				"ART_tag_PD": "'.$artjson["ART_tag_PD"].'",
				"ART_tag_SFS": "'.$artjson["ART_tag_SFS"].'",
				"ART_tag_MOUA": "'.$artjson["ART_tag_MOUA"].'",
				"ART_tag_FC": "'.$artjson["ART_tag_FC"].'",
				          
                "ART_btn_mainmarket": "'.$artjson["ART_btn_mainmarket"].'",
                "ART_btn_PD": "'.$artjson["ART_btn_PD"].'",
            
                "ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
            }
        ';
        $jsAry = [
            "js/conf/config_set.js",
            "js/lib/Util.js",
            "js/lib/Timer.js",
            "js/lib/parseHTML.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/xmlNode.js",
            "js/game/{$_p["p"]}.js"
        ];
        $fileDir = "tpl/game/{$_p["p"]}.html";
        break;
		
    case "league_index":
        $jsAry = [
            "js/lib/Util.js",
            "js/game/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
		//奖杯
		case "league_setting":
    case "league_filter_All":
        $jsAry = [
            "js/conf/config_set.js",
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/parseHTML.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/xmlNode.js",
            "js/game/{$_p["p"]}.js",
        ];
        $js .= '
        var artjson = {           
            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
			"ART_btn_allmatche": "'.$artjson["ART_btn_allmatche"].'",
			"ART_title_sporttype": "'.$artjson["ART_title_sporttype"].'",
			"ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
	        "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
		    "ART_btn_submit": "'.$artjson["ART_btn_submit"].'",
				 
        }
        ';
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
		//预测
    case "forecast":
        $jsAry = [
            "js/conf/config_set.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/ratioForm_Single_rule.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/Result.js",			
            "js/{$_p["p"]}.js",
            "js/game/game_more.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            "js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/betgenius.js",
            "js/tv/check_agent.js",
			
        ];
        $js .= '
            var artjson = {
			"ART_fore_teamH": "'.$artjson["ART_fore_teamH"].'",
		    "ART_fore_teamC": "'.$artjson["ART_fore_teamC"].'",
            "ART_lang": "TW",

            "ART_fore_nodata": "賽事已結束",

            //時節頁籤
            "ART_fore_fulltime": "全場",
            "ART_fore_half1": "上半場",
            "ART_fore_et": "加時",
            "ART_fore_ethalf1": "加時<b></b>上半場",

            //輸贏預測表格
            "ART_fore_title": "贏輸預測",
            "ART_fore_note": "注：贏輸預測功能只能提供您當下所投注的部分玩法的總贏輸額的預測而非包括全部的玩法且只能當做一個參考而已。 如欲查詢確切的贏輸額，請查看各玩法的單筆注單。那些之後被拒收或被取消的單子在10分鐘後才會被排除在輸贏預測的計算內。",

            //Score Board
            "ART_game_et_ft": "全場:&nbsp;",

            //現有投注
            "ART_fore_nowbet": "現有投注",
            "ART_fore_bet": "投注金額: ",
            "ART_fore_towin": "可贏金額: ",
            "ART_fore_more": "顯示更多",

            //其他按鈕畫面
            "ART_fore_allmarket": "所有盤口",
            "ART_fore_mybets": "投注記錄",
            "ART_fore_landscape": "請把您的設備轉為直立以便使用贏輸預測",

            //瞭解更多
            "ART_fore_learnMore": "了解更多",
            "ART_fore_learnMore_a": "什麼是贏輸預測？",
            "ART_fore_learnMore_a_1": "贏輸預測是一個能夠讓您以不同的比分組合預測所有潛在和已確定的贏輸額的功能。",
            "ART_fore_learnMore_b": "玩法",
            "ART_fore_learnMore_b_1": "贏輸預測包含以下的玩法：",
            "ART_fore_learnMore_b_FT": "全場",
            "ART_fore_learnMore_b_FT_1": "讓球",
            "ART_fore_learnMore_b_FT_2": "大/小",
            "ART_fore_learnMore_b_FT_3": "獨贏",
            "ART_fore_learnMore_b_FT_4": "波膽",
            "ART_fore_learnMore_b_FT_5": "總進球數",
            "ART_fore_learnMore_b_FT_6": "雙方球隊進球",
            "ART_fore_learnMore_b_FT_7": "球隊進球數: '."'Team 1 Name'".' - 大/小",
            "ART_fore_learnMore_b_FT_8": "球隊進球數: '."'Team 2 Name'".' - 大/小",
            "ART_fore_learnMore_b_FT_9": "單/雙",
            "ART_fore_learnMore_b_FT_10": "淨勝球數",
            "ART_fore_learnMore_b_FT_11": "雙重機會",
            "ART_fore_learnMore_b_FT_12": "零失球",
            "ART_fore_learnMore_b_FT_13": "零失球獲勝",
            "ART_fore_learnMore_b_FT_14": "三項讓球投注",

            "ART_fore_learnMore_b_1st": "上半場",
            "ART_fore_learnMore_b_1st_1": "讓球 - 上半場",
            "ART_fore_learnMore_b_1st_2": "大/小 - 上半場",
            "ART_fore_learnMore_b_1st_3": "獨贏 - 上半場",
            "ART_fore_learnMore_b_1st_4": "波膽 - 上半場",
            "ART_fore_learnMore_b_1st_5": "總進球數 - 上半場",
            "ART_fore_learnMore_b_1st_6": "雙方球隊進球 - 上半場",
            "ART_fore_learnMore_b_1st_7": "球隊進球數: '."'Team 1 Name'".' - 大/小 - 上半場",
            "ART_fore_learnMore_b_1st_8": "球隊進球數: '."'Team 2 Name'".' - 大/小 - 上半場",
            "ART_fore_learnMore_b_1st_9": "單/雙 - 上半場",
            "ART_fore_learnMore_b_2": "其他玩法的投注將不包含在贏輸預測功能的計算內。",};
            ';
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
		
		case "statistics":
        $jsAry = [
            "js/conf/config_set.js",
            "js/lib/parseHTML.js",
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/ratioForm_Single_rule.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",			
            "js/{$_p["p"]}.js",
			
        ];
         $js .= '
             
			  
           ';              
        $fileDir = "tpl/member/statistics.html";
        break;

		/*冠军盘*/	
	case "league_list_All":
   
        switch ($_p["gtype"]){	
            case "es":
			case "tt":
			case "sk":
			case "bm":
		    case "tn":
			case "op":
			case "bs":
			case "vb":
		    case "bk":
            case "ft":
			
                switch ($_p["showtype"]){
					
					 
					
					
                    case "today":
                        $hmtlName = "league_list_today_FT";
                        $js .= '
                            var artjson = {
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
                                "ART_btn_submit": "'.$artjson["ART_btn_submit"].'",
                                "ART_game_gmt4": "'.$artjson["ART_game_gmt4"].'",
                            };
                        ';
                        break;
						
                    case "early":
					
                     
						$hmtlName = "league_list_early_ALL";
						
	 
						
                        $js .= '
                            var artjson = {
                                "ART_game_datenodata": "'.$artjson["ART_game_datenodata"].'",
                                "ART_date_today": "'.$artjson["ART_game_today"].'",
                                "ART_date_alldate": "'.$artjson["ART_date_alldate"].'",
                                "ART_date_future": "'.$artjson["ART_date_future"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
                                "ART_btn_submit": "'.$artjson["ART_btn_submit"].'",
                            };
                        ';
                        break;
                   					
                    case "parlay":
                   
						$hmtlName = "league_list_early_ALL";
                        $js .= '
                            var artjson = {
                                "ART_game_datenodata": "'.$artjson["ART_game_datenodata"].'",
								"ART_date_today": "'.$artjson["ART_date_today"].'",
                                "ART_date_alldate": "'.$artjson["ART_date_alldate"].'",
                                "ART_date_future": "'.$artjson["ART_date_future"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
                                "ART_btn_submit": "'.$artjson["ART_btn_submit"].'",
                            };
                        ';
                        break;
						
						
					case "hot":
					case "soon":
                    case "live":
                        $hmtlName = "league_list_live_FT";
                        $js .= '
                            var artjson = {
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_live_AZ"].'",
                                "ART_btn_allmatche": "'.$artjson["ART_btn_allmatche"].'",
                                "ART_btn_submit": "'.$artjson["ART_btn_submit"].'",
                            };
                        ';
                        break;
                }
                break;
            
        }
        $jsAry = [
            "js/conf/config_set.js",
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/Util_league.js",
            "js/lib/parseHTML.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/xmlNode.js",
            "js/game/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/game/{$hmtlName}.html";
		
        break;
	
	
	
    case "league_list_FS":
        switch ($_p["gtype"]){	
            case "es":
		    case "tn":
			case "op":
			case "bs":
			case "vb":
		    case "bk":
            case "ft":
                switch ($_p["showtype"]){
					
                    case "today":
                        $hmtlName = "league_list_today_FT";
                        $js .= '
                            var artjson = {
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
                                "ART_btn_submit": "'.$artjson["ART_btn_submit"].'",
                                "ART_game_gmt4": "'.$artjson["ART_game_gmt4"].'",
                            };
                        ';
                        break;
						
                    case "early":
					
                      $hmtlName = "league_list_early_FT";
						//$hmtlName = "league_list_early_ALL";
						
	 
						
                        $js .= '
                            var artjson = {
                                "ART_game_datenodata": "'.$artjson["ART_game_datenodata"].'",
                                "ART_date_today": "'.$artjson["ART_game_today"].'",
                                "ART_date_alldate": "'.$artjson["ART_date_alldate"].'",
                                "ART_date_future": "'.$artjson["ART_date_future"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
                                "ART_btn_submit": "'.$artjson["ART_btn_submit"].'",
                            };
                        ';
                        break;
                   					
                    case "parlay":
                   
						$hmtlName = "league_list_live_FT";
                        $js .= '
                            var artjson = {
                                "ART_game_datenodata": "'.$artjson["ART_game_datenodata"].'",
								"ART_date_today": "'.$artjson["ART_date_today"].'",
                                "ART_date_alldate": "'.$artjson["ART_date_alldate"].'",
                                "ART_date_future": "'.$artjson["ART_date_future"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
                                "ART_btn_submit": "'.$artjson["ART_btn_submit"].'",
                            };
                        ';
                        break;
						
						
					case "hot":
					case "soon":
                    case "live":
                        $hmtlName = "league_list_live_FT";
                        $js .= '
                            var artjson = {
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_live_AZ"].'",
                                "ART_btn_allmatche": "'.$artjson["ART_btn_allmatche"].'",
                                "ART_btn_submit": "'.$artjson["ART_btn_submit"].'",
                            };
                        ';
                        break;
                }
                break;
            default:
                switch ($_p["showtype"]){
			     
                   case "today":
                       $hmtlName = "league_list_today_All";
                       $js .= '
                            var artjson = {
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
                                "ART_game_gmt4": "'.$artjson["ART_game_gmt4"].'",
                            };
                        ';
                        break;
					
                    case "early":
                      $hmtlName = "league_list_early_ALL";
					
                        $js .= '
                            var artjson = {
                                "ART_game_datenodata": "'.$artjson["ART_game_datenodata"].'",
                                "ART_date_alldate": "'.$artjson["ART_date_alldate"].'",
                                "ART_date_future": "'.$artjson["ART_date_future"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
                            };
                        ';
                        break;
					
                   case "parlay":
                        $hmtlName = "league_list_parlay_All";
                        $js .= '
                            var artjson = {
                                "ART_game_datenodata": "'.$artjson["ART_game_datenodata"].'",
                                "ART_date_today": "'.$artjson["ART_date_today"].'",
                                "ART_date_alldate": "'.$artjson["ART_date_alldate"].'",
                                "ART_date_future": "'.$artjson["ART_date_future"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
                            };
                        ';
                        break;
					case "hot":
					case "soon":
                    case "live":
                        $hmtlName = "league_list_live_All";
                        $js .= '
                            var artjson = {
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_coupon_popular": "'.$artjson["ART_coupon_popular"].'",
                                "ART_coupon_AZ": "'.$artjson["ART_coupon_AZ"].'",
                            };
                        ';
                        break;
                }
                break;
        }
        $jsAry = [
            "js/conf/config_set.js",
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/Util_league.js",
            "js/lib/parseHTML.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/xmlNode.js",
            "js/game/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/game/{$hmtlName}.html";
		
        break;
    case "check_login_domain"://检测新域名
        /*
        p: check_login_domain
        ver: 2021-06-18-01_en10f7b-3ed5-ad58-0617-871ae5576be7
        username: cbq80609
        uid: kxiqqy0wm24375445l134829b1
        langx: zh-cn
        code: 663
        */
        $arr=[
            "code" => 664,
            "new_domain" =>"no",
            "now_mode" => "N",
            "login_mid" => ""
        ];
        exit($xml->toXml($arr));
        break;
    case "list_tv":
        $js .= '
            var artjson = {
                "ATR_ball_all": "'.$artjson["ATR_ball_all"].'",
                "ATR_ball_ft": "'.$artjson["ATR_ball_ft"].'",
                "ATR_ball_bk": "'.$artjson["ATR_ball_bk"].'",
                "ATR_ball_tn": "'.$artjson["ATR_ball_tn"].'",
                "ATR_ball_vb": "'.$artjson["ATR_ball_vb"].'",
                "ATR_ball_bm": "'.$artjson["ATR_ball_bm"].'",
                "ATR_ball_tt": "'.$artjson["ATR_ball_tt"].'",
                "ATR_ball_bs": "'.$artjson["ATR_ball_bs"].'",
                "ATR_ball_sk": "'.$artjson["ATR_ball_sk"].'",
                "ATR_ball_op": "'.$artjson["ATR_ball_op"].'",
                "ART_game_sched": "'.$artjson["ART_game_sched"].'",
                "ART_date_alldate": "'.$artjson["ART_date_alldate"].'",
                "ART_date_future": "'.$artjson["ART_date_future"].'",
                "ART_game_datenodata": "'.$artjson["ART_game_datenodata"].'",
            };
        ';
        $jsAry = [
            "js/conf/config_set.js",
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "history_data":
        $js .= '
            var artjson = {
                "ART_hisdata_titlebtn01": "'.$artjson["ART_hisdata_titlebtn01"].'",
                "ART_hisdata_titlebtn02": "'.$artjson["ART_hisdata_titlebtn02"].'",
                "ART_hisdata_titlebtn03": "'.$artjson["ART_hisdata_titlebtn03"].'",
                "ART_hisdata_title": "'.$artjson["ART_hisdata_title"].'",
                "ART_hisdata_allsports": "'.$artjson["ART_hisdata_allsports"].'",
                "ART_hisdata_ft": "'.$artjson["ART_hisdata_ft"].'",
                "ART_hisdata_bk": "'.$artjson["ART_hisdata_bk"].'",
				"ART_hisdata_es": "'.$artjson["ART_hisdata_es"].'",
                "ART_hisdata_tn": "'.$artjson["ART_hisdata_tn"].'",
                "ART_hisdata_vb": "'.$artjson["ART_hisdata_vb"].'",
                "ART_hisdata_bm": "'.$artjson["ART_hisdata_bm"].'",
                "ART_hisdata_tt": "'.$artjson["ART_hisdata_tt"].'",
                "ART_hisdata_bs": "'.$artjson["ART_hisdata_bs"].'",
                "ART_hisdata_sk": "'.$artjson["ART_hisdata_sk"].'",
                "ART_hisdata_op": "'.$artjson["ART_hisdata_op"].'",
                "ART_hisdata_fs": "'.$artjson["ART_hisdata_fs"].'",
                "ART_hisdata_date": "'.$artjson["ART_hisdata_date"].'",
                "ART_hisdata_bet": "'.$artjson["ART_hisdata_bet"].'",
                "ART_hisdata_stake": "'.$artjson["ART_hisdata_stake"].'",
                "ART_hisdata_winloss": "'.$artjson["ART_hisdata_winloss"].'",
                "ART_hisdata_total": "'.$artjson["ART_hisdata_total"].'",
                "ART_hisdata_nodata": "'.$artjson["ART_hisdata_nodata"].'",
                "ART_hisdata_more": "'.$artjson["ART_hisdata_more"].'",
                "ART_hisdata_backtop": "'.$artjson["ART_hisdata_backtop"].'",
				"ART_hisdata_from": "'.$artjson["ART_hisdata_from"].'",
				"ART_hisdata_to": "'.$artjson["ART_hisdata_to"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "history_view":
        $js .= '
            var artjson = {
                "ART_hisview_lang": "'.$artjson["ART_hisview_lang"].'",
                "ART_hisview_titlebtn01": "'.$artjson["ART_hisview_titlebtn01"].'",
                "ART_hisview_titlebtn02": "'.$artjson["ART_hisview_titlebtn02"].'",
                "ART_hisview_titlebtn03": "'.$artjson["ART_hisview_titlebtn03"].'",
                "ART_hisview_title": "'.$artjson["ART_hisview_title"].'",
                "ART_hisview_allsports": "'.$artjson["ART_hisview_allsports"].'",
                "ART_hisview_ft": "'.$artjson["ART_hisview_ft"].'",
                "ART_hisview_bk": "'.$artjson["ART_hisview_bk"].'",
				"ART_hisview_es": "'.$artjson["ART_hisview_es"].'",
                "ART_hisview_tn": "'.$artjson["ART_hisview_tn"].'",
                "ART_hisview_vb": "'.$artjson["ART_hisview_vb"].'",
                "ART_hisview_bm": "'.$artjson["ART_hisview_bm"].'",
                "ART_hisview_tt": "'.$artjson["ART_hisview_tt"].'",
                "ART_hisview_bs": "'.$artjson["ART_hisview_bs"].'",
                "ART_hisview_sk": "'.$artjson["ART_hisview_sk"].'",
                "ART_hisview_op": "'.$artjson["ART_hisview_op"].'",
                "ART_hisview_fs": "'.$artjson["ART_hisview_op"].'",
                "ART_hisview_bet": "'.$artjson["ART_hisview_bet"].'",
                "ART_hisview_winloss": "'.$artjson["ART_hisview_winloss"].'",
                "ART_hisview_parlay": "'.$artjson["ART_hisview_parlay"].'",
                "ART_hisview_in": "'.$artjson["ART_hisview_in"].'",
                "ART_hisview_total": "'.$artjson["ART_hisview_total"].'",
                "ART_hisview_nodata": "'.$artjson["ART_hisview_nodata"].'",
                "ART_hisview_more": "'.$artjson["AART_hisview_more"].'",
                "ART_hisview_backtop": "'.$artjson["ART_hisview_backtop"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/lib/ratioForm_Single_rule.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "today_wagers":
        $js .= '
            var artjson = {
                "ART_today_titlebtn01": "'.$artjson["ART_today_titlebtn01"].'",
                "ART_today_titlebtn02": "'.$artjson["ART_today_titlebtn02"].'",
                "ART_today_titlebtn03": "'.$artjson["ART_today_titlebtn03"].'",
                "ART_today_allsports": "'.$artjson["ART_today_allsports"].'",
                "ART_today_ft": "'.$artjson["ART_today_ft"].'",
				"ART_today_es": "'.$artjson["ART_today_es"].'",
                "ART_today_bk": "'.$artjson["ART_today_bk"].'",
                "ART_today_tn": "'.$artjson["ART_today_tn"].'",
                "ART_today_vb": "'.$artjson["ART_today_vb"].'",
                "ART_today_bm": "'.$artjson["ART_today_bm"].'",
                "ART_today_tt": "'.$artjson["ART_today_tt"].'",
                "ART_today_bs": "'.$artjson["ART_today_bs"].'",
                "ART_today_sk": "'.$artjson["ART_today_sk"].'",
                "ART_today_op": "'.$artjson["ART_today_op"].'",
                "ART_today_fs": "'.$artjson["ART_today_fs"].'",
                "ART_today_bet": "'.$artjson["ART_today_bet"].'",
                "ART_today_towin": "'.$artjson["ART_today_towin"].'",
                "ART_today_parlay": "'.$artjson["ART_today_parlay"].'",
                "ART_today_inclass": "'.$artjson["ART_today_inclass"].'",
                "ART_today_in": "'.$artjson["ART_today_in"].'",
                "ART_today_total": "'.$artjson["ART_today_total"].'",
                "ART_today_nodata": "'.$artjson["ART_today_nodata"].'",
                "ART_today_more": "'.$artjson["ART_today_more"].'",
                "ART_today_backtop": "'.$artjson["ART_today_backtop"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/lib/ratioForm_Single_rule.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "credit_logs":
        $js .= '
            var artjson = {
                "ART_creditlogs_nodata":"'.$artjson["ART_creditlogs_lag"].'",
                "ART_creditlogs_lag": "'.$artjson["ART_creditlogs_lag"].'",
                "ART_creditlogs_titlebtn01": "'.$artjson["ART_creditlogs_titlebtn01"].'",
                "ART_creditlogs_titlebtn02": "'.$artjson["ART_creditlogs_titlebtn02"].'",
                "ART_creditlogs_titlebtn03": "'.$artjson["ART_creditlogs_titlebtn03"].'",
                "ART_creditlogs_title": "'.$artjson["ART_creditlogs_title"].'",
                "ART_creditlogs_select01": "'.$artjson["ART_creditlogs_select01"].'",
                "ART_creditlogs_select02": "'.$artjson["ART_creditlogs_select02"].'",
                "ART_creditlogs_select03": "'.$artjson["ART_creditlogs_select03"].'",
                "ART_creditlogs_select04": "'.$artjson["ART_creditlogs_select04"].'",
                "ART_creditlogs_date": "'.$artjson["ART_creditlogs_date"].'",
                "ART_creditlogs_Balance": "'.$artjson["ART_creditlogs_Balance"].'",
                "ART_creditlogs_Deposit": "'.$artjson["ART_creditlogs_Deposit"].'",
                "ART_creditlogs_Withdrawal": "'.$artjson["ART_creditlogs_Withdrawal"].'",
                "ART_creditlogs_D": "'.$artjson["ART_creditlogs_D"].'",
                "ART_creditlogs_W": "'.$artjson["ART_creditlogs_W"].'",
                "ART_creditlogs_NewBalance": "'.$artjson["ART_creditlogs_NewBalance"].'",
                "ART_creditlogs_NewBalance": "'.$artjson["ART_creditlogs_NewBalance"].'",
                "ART_creditlogs_more": "'.$artjson["ART_creditlogs_more"].'",
                "ART_creditlogs_backtop": "'.$artjson["ART_creditlogs_backtop"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "get_credit_logs":
        $acc = new Account($_p);
        $json = $acc->get_mem_creditlogs();
        exit(json_encode($json));
        break;
    case "message":
        $js .= '
            var artjson = {
                "ART_message_title": "'.$artjson["ART_message_title"].'",
                "ART_message_search": "'.$artjson["ART_message_search"].'",
                "ART_message_cancel": "'.$artjson["ART_message_cancel"].'",
                "ART_message_normal": "'.$artjson["ART_message_normal"].'",
                "ART_message_important": "'.$artjson["ART_message_important"].'",
                "ART_message_personal": "'.$artjson["ART_message_personal"].'",
                "ART_message_all": "'.$artjson["ART_message_all"].'",
                "ART_message_today": "'.$artjson["ART_message_today"].'",
                "ART_message_yeaterday": "'.$artjson["ART_message_yeaterday"].'",
                "ART_message_nodata": "'.$artjson["ART_message_nodata"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "help_change_pwd":
        $js .= '
            var artjson = {
                "ART_lang": "'.$artjson["ART_lang"].'",
                "ART_hp_chgpwd": "'.$artjson["ART_hp_chgpwd"].'",
                "ART_hp_chgpwd_text_1": "'.$artjson["ART_hp_chgpwd_text_1"].'",
                "ART_hp_chgpwd_text_2": "'.$artjson["ART_hp_chgpwd_text_2"].'",
                "ART_hp_chgpwd_text_3": "'.$artjson["ART_hp_chgpwd_text_3"].'",
                "ART_hp_chgpwd_text_4": "'.$artjson["ART_hp_chgpwd_text_4"].'",
                "ART_hp_chgpwd_text_5": "'.$artjson["ART_hp_chgpwd_text_5"].'",
                "ART_hp_inp_nowpwd": "'.$artjson["ART_hp_inp_nowpwd"].'",
                "ART_hp_inp_newpwd": "'.$artjson["ART_hp_inp_newpwd"].'",
                "ART_hp_inp_repwd": "'.$artjson["ART_hp_inp_repwd"].'",
                "ART_hp_btn_cancel": "'.$artjson["ART_hp_btn_cancel"].'",
                "ART_hp_btn_submit": "'.$artjson["ART_hp_btn_submit"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "account_set":
        $js .= '
            var artjson = {
                "ART_accset_detailset": "'.$artjson["ART_accset_detailset"].'",
                "ART_accset_soccer": "'.$artjson["ART_accset_soccer"].'",
                "ART_accset_basketball": "'.$artjson["ART_accset_basketball"].'",
                "ART_accset_othersports": "'.$artjson["ART_accset_othersports"].'",
                "ART_accset_outright01": "'.$artjson["ART_accset_outright01"].'",
                "ART_accset_type": "'.$artjson["ART_accset_type"].'",
                "ART_accset_singlemax": "'.$artjson["ART_accset_singlemax"].'",
                "ART_accset_betmax": "'.$artjson["ART_accset_betmax"].'",
                "ART_accset_hdouoe": "'.$artjson["ART_accset_hdouoe"].'",
                "ART_accset_rehdouoe": "'.$artjson["ART_accset_rehdouoe"].'",
                "ART_accset_1x2": "'.$artjson["ART_accset_1x2"].'",
                "ART_accset_1x2bk": "'.$artjson["ART_accset_1x2bk"].'",
                "ART_accset_other": "'.$artjson["ART_accset_other"].'",
                "ART_accset_reother": "'.$artjson["ART_accset_reother"].'",
                "ART_accset_outright02": "'.$artjson["ART_accset_outright02"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
		//新功能
    case "features":
        $data = isset($_p["data"]) ? $_p["data"] : "data_0";
        $js .= '
            var artjson = {
                "ART_features_title": "'.$artjson["ART_features_title"].'",
                "ART_features_seltitle": "'.$artjson["ART_features_seltitle"].'",
                "ART_features_lang": "'.$artjson["ART_features_lang"].'",
                "ART_features_title00": "'.$artjson["ART_features_title00"].'",
                "ART_features_title01": "'.$artjson["ART_features_title01"].'",
                "ART_features_txt01_1": "'.$artjson["ART_features_txt01_1"].'",
                "ART_features_txt01_2": "'.$artjson["ART_features_txt01_2"].'",
                "ART_features_txt01_3": "'.$artjson["ART_features_txt01_3"].'",  
                "ART_features_title02": "'.$artjson["ART_features_title02"].'",
                "ART_features_txt02": "'.$artjson["ART_features_txt02"].'",
                "ART_features_title03": "'.$artjson["ART_features_title03"].'",
                "ART_features_txt03_1": "'.$artjson["ART_features_txt03_1"].'",
                "ART_features_txt03_2": "'.$artjson["ART_features_txt03_2"].'",
                "ART_features_title04": "'.$artjson["ART_features_title04"].'",
                "ART_features_txt04_1": "'.$artjson["ART_features_txt04_1"].'",
                "ART_features_txt04_2": "'.$artjson["ART_features_txt04_2"].'",
                "ART_features_txt04_3": "'.$artjson["ART_features_txt04_3"].'",
                "ART_features_txt04_4": "'.$artjson["ART_features_txt04_4"].'",
                "ART_features_txt04_5": "'.$artjson["ART_features_txt04_5"].'",
                "ART_features_txt04_6": "'.$artjson["ART_features_txt04_6"].'",
                "ART_features_txt04_7": "'.$artjson["ART_features_txt04_7"].'",
                "ART_features_title05": "'.$artjson["ART_features_title05"].'",
                "ART_features_txt05": "'.$artjson["ART_features_txt05"].'",
                "ART_features_title06": "'.$artjson["ART_features_title06"].'",
                "ART_features_txt06": "'.$artjson["ART_features_txt06"].'",

                "ART_features_title08": "'.$artjson["ART_features_title08"].'",
                "ART_features_txt08_1": "'.$artjson["ART_features_txt08_1"].'",
                "ART_features_txt08_2": "'.$artjson["ART_features_txt08_2"].'",
                "ART_features_txt08_3": "'.$artjson["ART_features_txt08_3"].'",
                "ART_features_txt08_4": "'.$artjson["ART_features_txt08_4"].'",
                "ART_features_txt08_5": "'.$artjson["ART_features_txt08_5"].'",
                "ART_features_txt08_6": "'.$artjson["ART_features_txt08_6"].'",
                "ART_features_txt08_7": "'.$artjson["ART_features_txt08_7"].'",
                "ART_features_txt08_8": "'.$artjson["ART_features_txt08_8"].'",
                "ART_features_txt08_9": "'.$artjson["ART_features_txt08_9"].'",
                "ART_features_txt08_10": "'.$artjson["ART_features_txt08_10"].'",
                "ART_features_txt08_11": "'.$artjson["ART_features_txt08_11"].'",
                "ART_features_txt08_12": "'.$artjson["ART_features_txt08_12"].'",
                "ART_features_txt08_13": "'.$artjson["ART_features_txt08_13"].'",
                "ART_features_txt08_14": "'.$artjson["ART_features_txt08_14"].'",
                "ART_features_txt08_15": "'.$artjson["ART_features_txt08_15"].'",
                "ART_features_txt08_16": "'.$artjson["ART_features_txt08_16"].'",
                "ART_features_txt08_17": "'.$artjson["ART_features_txt08_17"].'",
                "ART_features_txt08_18": "'.$artjson["ART_features_txt08_18"].'",
                "ART_features_txt08_19": "'.$artjson["ART_features_txt08_19"].'",
                "ART_features_txt08_20": "'.$artjson["ART_features_txt08_20"].'",
                "ART_features_txt08_21": "'.$artjson["ART_features_txt08_21"].'",
                "ART_features_txt08_22": "'.$artjson["ART_features_txt08_22"].'",
                "ART_features_txt08_23": "'.$artjson["ART_features_txt08_23"].'",
                "ART_features_txt08_24": "'.$artjson["ART_features_txt08_24"].'",
                "ART_features_txt08_25": "'.$artjson["ART_features_txt08_25"].'",
                "ART_features_txt08_26": "'.$artjson["ART_features_txt08_26"].'",
                "ART_features_txt08_27": "'.$artjson["ART_features_txt08_27"].'",
                "ART_features_txt08_28": "'.$artjson["ART_features_txt08_28"].'",
                "ART_features_txt08_29": "'.$artjson["ART_features_txt08_29"].'",
                "ART_features_txt08_30": "'.$artjson["ART_features_txt08_30"].'",
                "ART_features_txt08_31": "'.$artjson["ART_features_txt08_31"].'",
                "ART_features_txt08_32": "'.$artjson["ART_features_txt08_32"].'",
                "ART_features_txt08_33": "'.$artjson["ART_features_txt08_33"].'",
                "ART_features_title09": "'.$artjson["ART_features_title09"].'",
				"ART_features_txt09_1": "'.$artjson["ART_features_txt09_1"].'",
				"ART_features_txt09_2": "'.$artjson["ART_features_txt09_2"].'",
				"ART_features_title10": "'.$artjson["ART_features_title10"].'",
				"ART_features_txt10_1": "'.$artjson["ART_features_txt10_1"].'",
				"ART_features_txt10_2": "'.$artjson["ART_features_txt10_2"].'",
				"ART_features_txt10_3": "'.$artjson["ART_features_txt10_3"].'",
				"ART_features_title11": "'.$artjson["ART_features_title11"].'",
				"ART_features_txt11_1": "'.$artjson["ART_features_txt11_1"].'",
				"ART_features_txt11_2": "'.$artjson["ART_features_txt11_2"].'",
				"ART_features_txt11_3": "'.$artjson["ART_features_txt11_3"].'",
				"ART_features_txt00": "'.$artjson["ART_features_txt00"].'",
				"ART_features_txt01": "'.$artjson["ART_features_txt01"].'",
				
            };
            
        ';
        $js.= "var _data ='{$data}';";
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "help_odds":
        $js .= '
            var artjson = {
                "ART_hp_odds_lang": "'.$artjson["ART_hp_odds_lang"].'",
                "ART_hp_odds": "'.$artjson["ART_hp_odds"].'",
            
                "ART_hp_odds_type": "'.$artjson["ART_hp_odds_type"].'",
                "ART_hp_odds_amount": "'.$artjson["ART_hp_odds_amount"].'",
                "ART_hp_odds_odds": "'.$artjson["ART_hp_odds_odds"].'",
                "ART_hp_odds_win": "'.$artjson["ART_hp_odds_win"].'",
                "ART_hp_odds_lose": "'.$artjson["ART_hp_odds_lose"].'",
            
                "ART_hp_odds_hk": "'.$artjson["ART_hp_odds_hk"].'",
                "ART_hp_odds_ml": "'.$artjson["ART_hp_odds_ml"].'",
                "ART_hp_odds_in": "'.$artjson["ART_hp_odds_in"].'",
                "ART_hp_odds_eu": "'.$artjson["ART_hp_odds_eu"].'",
            
                "ART_hp_odds_form": "'.$artjson["ART_hp_odds_form"].'",
                "ART_hp_odds_hk_odds": "'.$artjson["ART_hp_odds_hk_odds"].'",
                "ART_hp_odds_ml_odds": "'.$artjson["ART_hp_odds_ml_odds"].'",
                "ART_hp_odds_in_odds": "'.$artjson["ART_hp_odds_in_odds"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "rules_general":
        include_once "include/rules.php";
        $_p["ball"] = isset($_p["ball"]) ? $_p["ball"] : "general";
        $js.=rules($_p["langx"],$_p["ball"],$artjson);

        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/rules_{$_p["ball"]}.html";
        break;
    case "help_term":
        $js .= '
            var artjson = {
                "ART_hp_term": "'.$artjson["ART_hp_term"].'",
                "ART_hp_term_a": "'.$artjson["ART_hp_term_a"].'",
                "ART_hp_term_a_1": "'.$artjson["ART_hp_term_a_1"].'",
                "ART_hp_term_a_2": "'.$artjson["ART_hp_term_a_2"].'",            
                "ART_hp_term_b": "'.$artjson["ART_hp_term_b"].'",
                "ART_hp_term_b_1": "'.$artjson["ART_hp_term_b_1"].'",
                "ART_hp_term_b_2": "'.$artjson["ART_hp_term_b_2"].'",
                "ART_hp_term_b_3": "'.$artjson["ART_hp_term_b_3"].'",
                "ART_hp_term_b_4": "'.$artjson["ART_hp_term_b_4"].'",            
                "ART_hp_term_c": "'.$artjson["ART_hp_term_c"].'",
                "ART_hp_term_c_1": "'.$artjson["ART_hp_term_c_1"].'",
                "ART_hp_term_c_2": "'.$artjson["ART_hp_term_c_2"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "contactus":
        $js .= '
            var artjson = {
                "ART_hp_contact": "'.$artjson["ART_hp_contact"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
		//简易密码
    case "prepasscode":
        // repro: iovation 风控域名已下线，置空跳过该流程
        $js .= "
        var iovation_Proxy= '';
        var iovationURL= '';
        top.iovationKey = 'IDICBD';
        top.blackBoxStatus = 'Y';
        top.blackbox = 'disabled';
        ";
        $js .= '
            var artjson = {
                "ART_prepass_hello": "'.$artjson["ART_prepass_hello"].'",
                "ART_prepass_enter": "'.$artjson["ART_prepass_enter"].'",
                "ART_prepass_err": "'.$artjson["ART_prepass_err"].'",
                "ART_prepass_login": "'.$artjson["ART_prepass_login"].'",
                "ART_prepass_delete": "'.$artjson["ART_prepass_delete"].'",
                "ART_lang": "CN",
                "ART_prepass_brower_title": "我们推荐使用以下浏览器以获得最佳使用体验:",
                "ART_prepass_chrome": "Chrome",
                "ART_prepass_safari": "Safari",
                "ART_prepass_firefox": "火狐",
                "ART_prepass_brower_text_1": "如果您在使用本网站遇到任何问题，请查看我们列出的浏览器和系统的",
                "ART_prepass_brower_text_btn": "最低需求",
                "ART_prepass_brower_text_2": "。",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "get_systemTime":
        header('Content-Type: text/xml');
        $arr = [
            "systemtime" => date("Y-m-d H:i:s"),
            "systimestamp" => time()
        ];
        exit($xml->toXml($arr));
        break;
    case "messageget"://弹出公告
        header('Content-Type: text/xml');
        $acc = new Account($_p);
        $xml = $acc->messageget();
        // SPA's connectComplete (index_3.js) expects <annmsg> and <id> at root level for announcement.
        // If absent, accessing .innerHTML throws TypeError, blocking checkCount and login completion.
        if (is_string($xml) && strpos($xml, '<annmsg') === false) {
            $xml = preg_replace('#</serverresponse>#', '<annmsg></annmsg><id>0</id></serverresponse>', $xml, 1);
        }
        exit($xml);
        break;
    case "get_member_data"://会员资料
        header('Content-Type: text/xml');
        $acc = new Account($_p);
        $arr = $acc->get_member_data();
        exit($xml->toXml($arr));
        break;
    case "checkPassCode"://设置简易密码
        $acc = new Account($_p);
        $arr = $acc->set_passcode();
        exit($xml->toXml($arr));
        break;	
    case "help_set_mail":
        $js .= '
            var artjson = {
                "ART_lang": "'.$artjson["ART_lang"].'",
                "ART_hp_setmail": "'.$artjson["ART_hp_setmail"].'",
    
                "ART_hp_setmail_1_text": "'.$artjson["ART_hp_setmail_1_text"].'",
                "ART_hp_email": "'.$artjson["ART_hp_email"].'",
                "ART_hp_btn_cancel": "'.$artjson["ART_hp_btn_cancel"].'",
                "ART_hp_btn_next": "'.$artjson["ART_hp_btn_next"].'",
    
                "ART_hp_setmail_2_text": "'.$artjson["ART_hp_setmail_2_text"].'",
                "ART_hp_safecode": "'.$artjson["ART_hp_safecode"].'",
                "ART_hp_btn_resent": "'.$artjson["ART_hp_btn_resent"].'",
                "ART_hp_btn_submit": "'.$artjson["ART_hp_btn_submit"].'",
    
                "ART_hp_setmail_notice": "'.$artjson["ART_hp_setmail_notice"].'",
                "ART_hp_setmail_3_text": "'.$artjson["ART_hp_setmail_3_text"].'",
    
                "ART_hp_setmail_delemsg": "'.$artjson["ART_hp_setmail_delemsg"].'",
                "ART_hp_btn_addmail": "'.$artjson["ART_hp_btn_addmail"].'",
            };
        ';
        $jsAry = [
            "js/lib/parseHTML.js",
            "js/lib/xmlNode.js",
            "js/lib/Util.js",
            "js/{$_p["p"]}.js",
            "js/lib/CookieManager.js",
        ];
        $fileDir = "tpl/member/{$_p["p"]}.html";
        break;
    case "memSet":
        $acc = new Account($_p);
        $arr = $acc->memSet();
        exit(json_encode($arr));
        break;

    case "gameModel":
        if($_p["rtype"]=="fs"){
            $game_model = "all_game_fs";
            $game_art = "all_game_fs";
            $js .= '
                var artjson = {
                    "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                    "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                    "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                };
            ';
        } else {
			
            if ($_p["isSpecial"] == "Y"){
                if ($_p["isHL"] == "Y"){					
                    $game_model = "cup_highlights_game";
                }else if($_p["isTeam"] == "Y"){
                    $game_model = "cup_team_gamee";
                }else if($_p["isFantasy"] == "Y"){					
                    $game_model = "ft_today_game";					
                } else if($_p["isStandings"] == "Y"){					
                    $game_model = "cup_standings_game";					
                }
				else{
                    if ($_p["rtype"] == "rb" || $_p["rtype"] == "r" || $_p["rtype"] == "fantasy"){
                        $game_model = "{$_p["gtype"]}_mygame_game";
                    }else{
                        $game_model = "{$_p["gtype"]}_mygame_game_{$_p["rtype"]}";
                    }
                }
                $game_art = $game_model;
            }else{
                if ($_p["rtype"] == "rb" || $_p["rtype"] == "r" || $_p["rtype"] == "fantasy"){
                    $game_model = "{$_p["gtype"]}_{$_p["showtype"]}_game";
                }else{
                    if ($_p["showtype"] == "live"){
                        $rtype = substr($_p["rtype"],1);
                    }else{
                        $rtype = $_p["rtype"];
                    }
                   $game_model = "{$_p["gtype"]}_{$_p["showtype"]}_game_{$rtype}";
				   
                }
                $game_art = $game_model;
            }
		if ($_p["gtype"] == "es") {
    $showtype_mapping = [
        "hot"   => "es_hot_game",
		"live"   => "es_live_game",
		"soon"   => "es_today_game",
		"early"   => "es_early_game",
        "today" => "es_today_game",
        "parlay"=> "es_today_game",
        "mygame"=> "es_today_game",
    ];
    $game_model = $showtype_mapping[$_p["showtype"]] ?? null;
    $game_art = $game_model;
}
      
	  if ($_p["gtype"] == "ft" && $_p["rtype"] == "rnou") {
    $showtype_mapping = [
        "hot"   => "ft_live_game_rnou",
		"live"   => "ft_live_game_rnou",
		"soon"   => "ft_live_game_rnou",
		"early"   => "ft_early_game_rnou",
        "today" => "ft_live_game_rnou",
        "parlay"=> "ft_live_game_rnou",
        "mygame"=> "ft_live_game_rnou",
    ];
    $game_model = $showtype_mapping[$_p["showtype"]] ?? null;
    $game_art = $game_model;
}
   if ($_p["gtype"] == "ft" && $_p["rtype"] == "pd" && $_p["isSpecial"] == "Y" && $_p["isFantasy"] == "Y") {
    $showtype_mapping = [
        
        "today" => "ft_today_game_pd",
        
    ];
    $game_model = $showtype_mapping[$_p["showtype"]] ?? null;
    $game_art = $game_model;
}
 if ($_p["gtype"] == "ft" && $_p["rtype"] == "moua" && $_p["isSpecial"] == "Y" && $_p["isFantasy"] == "Y") {
    $showtype_mapping = [
        
        "today" => "ft_today_game_moua",
        
    ];
    $game_model = $showtype_mapping[$_p["showtype"]] ?? null;
    $game_art = $game_model;
}
/*p: gameModel
ver: -3ed5-iovation-0506-95881ae5676be2
langx: zh-cn
uid: 2339e83dd274c9bacd6e8d93835ca0e136ba947f1be21b7d8a69058fbe3e1a3c
gtype: ft
showtype: today
rtype: pd
isSpecial: Y
isFantasy: Y*/
			//$game_model = "{$_p["gtype"]}_{$_p["showtype"]}_game";
			/*FT今日，早盘*/
            switch ($_p["gtype"]){
				case "es":
                case "ft":
                    switch ($_p["showtype"]){
						case "soon":
                        case "hot":					    
                        case "today":
                        case "early":
                            $js .= '
                            var artjson = {
								//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
								
								
								
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",								          
                                "ART_game_r": "'.$artjson["ART_game_r"].'",
                                "ART_game_ou": "'.$artjson["ART_game_ou"].'",
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_ts": "'.$artjson["ART_game_ts"].'",
                                "ART_game_eo": "'.$artjson["ART_game_eo"].'",
                                //新加
								"ART_obt_pd": "'.$artjson["ART_obt_pd"].'",
								"ART_obt_mix_re": "'.$artjson["ART_obt_mix_re"].'",
								"ART_obt_mix_rou": "'.$artjson["ART_obt_mix_rou"].'",
								"ART_obt_more": "'.$artjson["ART_obt_more"].'",
								"ART_game_rnc": "'.$artjson["ART_game_rnc"].'",
								"ART_game_re": "'.$artjson["ART_game_re"].'",
                                "ART_game_rou": "'.$artjson["ART_game_rou"].'",
								"ART_obt_otpoint": "'.$artjson["ART_obt_otpoint"].'",
								"ART_game_rm2": "'.$artjson["ART_game_rm2"].'",
								"ART_game_1h": "'.$artjson["ART_game_1h"].'",
								"ART_game_rm": "'.$artjson["ART_game_rm"].'",
								"ART_game_reo": "'.$artjson["ART_game_reo"].'",
								"ART_game_rm1": "'.$artjson["ART_game_rm1"].'",
								"ART_obt_sfs": "'.$artjson["ART_obt_sfs"].'",
								"ART_obt_rn_eo": "'.$artjson["ART_obt_rn_eo"].'",
								"ART_obt_rn_note": "'.$artjson["ART_obt_rn_note"].'",
								"ART_obt_cn_eo": "'.$artjson["ART_obt_cn_eo"].'",
								"ART_game_rts": "'.$artjson["ART_game_rts"].'",
								"ART_game_rg": "'.$artjson["ART_game_rg"].'",
								"ART_game_rouh": "'.$artjson["ART_game_rouh"].'",
								"ART_game_rouc": "'.$artjson["ART_game_rouc"].'",
								"ART_game_none": "'.$artjson["ART_game_none"].'",
								
								"ART_obt_cn_re": "'.$artjson["ART_obt_cn_re"].'",
								"ART_obt_cn_rou": "'.$artjson["ART_obt_cn_rou"].'",
								"ART_obt_cn_rnc": "'.$artjson["ART_obt_cn_rnc"].'",
								"ART_obt_cn_reo": "'.$artjson["ART_obt_cn_reo"].'",																
								"ART_obt_rn_rou": "'.$artjson["ART_obt_rn_rou"].'",
								"ART_obt_rn_rnb": "'.$artjson["ART_obt_rn_rnb"].'",
								"ART_obt_rn_reo": "'.$artjson["ART_obt_rn_reo"].'",
								
								
								//
								"ART_game_player": "'.$artjson["ART_game_player"].'",
								"ART_game_anytime": "'.$artjson["ART_game_anytime"].'",
								"ART_game_1st": "'.$artjson["ART_game_1st"].'",
								"ART_game_last": "'.$artjson["ART_game_last"].'",
								
								
								"ART_obt_mix": "'.$artjson["ART_obt_mix"].'",
                                "ART_obt_r": "'.$artjson["ART_obt_r"].'",
                                "ART_obt_ou": "'.$artjson["ART_obt_ou"].'",
                                "ART_obt_cn": "'.$artjson["ART_obt_cn"].'",
                                "ART_obt_rn": "'.$artjson["ART_obt_rn"].'",
                                "ART_obt_wi": "'.$artjson["ART_obt_wi"].'",
								"ART_obt_mix_more": "'.$artjson["ART_obt_mix_more"].'",
                            
                                "ART_obt_cn_r": "'.$artjson["ART_obt_cn_r"].'",
                                "ART_obt_cn_ou": "'.$artjson["ART_obt_cn_ou"].'",
                                "ART_obt_cn_m": "'.$artjson["ART_obt_cn_m"].'",
                            
                                "ART_obt_rn_r": "'.$artjson["ART_obt_rn_r"].'",
                                "ART_obt_rn_ou": "'.$artjson["ART_obt_rn_ou"].'",
                                "ART_obt_rn_m": "'.$artjson["ART_obt_rn_m"].'",
                            
                                "ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                                "ART_game_half1": "'.$artjson["ART_game_half1"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                                "ART_game_odd": "'.$artjson["ART_game_odd"].'",
                                "ART_game_even": "'.$artjson["ART_game_even"].'",
                                "ART_game_yes": "'.$artjson["ART_game_yes"].'",
                                "ART_game_no": "'.$artjson["ART_game_no"].'",
                                "ART_game_draw": "'.$artjson["ART_game_draw"].'",
                                "ART_game_otpoint": "'.$artjson["ART_game_otpoint"].'",
                            
                                "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                                "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            }
                        ';
                            break;
							/*FT滚球*/
						
                        case "live":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
								//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",

                                "ART_game_re": "'.$artjson["ART_game_re"].'",
                                "ART_game_rou": "'.$artjson["ART_game_rou"].'",
                                "ART_game_rm": "'.$artjson["ART_game_rm"].'",
                                "ART_game_rg": "'.$artjson["ART_game_rg"].'",
                                "ART_game_rts": "'.$artjson["ART_game_rts"].'",
                                "ART_game_reo": "'.$artjson["ART_game_reo"].'",
                                "ART_game_rouh": "'.$artjson["ART_game_rouh"].'",
                                "ART_game_rouc": "'.$artjson["ART_game_rouc"].'",
                                "ART_game_rps": "'.$artjson["ART_game_rps"].'",
								//新加
								"ART_obt_pd": "'.$artjson["ART_obt_pd"].'",
								"ART_obt_mix_re": "'.$artjson["ART_obt_mix_re"].'",
								"ART_obt_mix_rou": "'.$artjson["ART_obt_mix_rou"].'",
								"ART_obt_more": "'.$artjson["ART_obt_more"].'",
								"ART_game_rnc": "'.$artjson["ART_game_rnc"].'",
								"ART_obt_otpoint": "'.$artjson["ART_obt_otpoint"].'",
								"ART_game_rm2": "'.$artjson["ART_game_rm2"].'",
								"ART_game_1h": "'.$artjson["ART_game_1h"].'",
								"ART_obt_cn_re": "'.$artjson["ART_obt_cn_re"].'",
								"ART_game_rm1": "'.$artjson["ART_game_rm1"].'",
								"ART_obt_nodata": "'.$artjson["ART_obt_nodata"].'",
								"ART_obt_rn_note": "'.$artjson["ART_obt_rn_note"].'",
								"ART_obt_pk_rou": "'.$artjson["ART_obt_pk_rou"].'",
								
								"ART_obt_et_re": "'.$artjson["ART_obt_et_re"].'",
								"ART_obt_et_rou": "'.$artjson["ART_obt_et_rou"].'",
								"ART_obt_et_rm": "'.$artjson["ART_obt_et_rm"].'",
								"ART_obt_et_reo": "'.$artjson["ART_obt_et_reo"].'",
								"ART_obt_et_note": "'.$artjson["ART_obt_et_note"].'",
								
								"ART_game_rsh": "'.$artjson["ART_game_rsh"].'",
								"ART_game_rsh_goal": "'.$artjson["ART_game_rsh_goal"].'",
								"ART_game_rsh_nogoal": "'.$artjson["ART_game_rsh_nogoal"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
								
								"ART_game_draw_obt": "'.$artjson["ART_game_draw_obt"].'",
								"ART_obt_pk_note_2_1": "'.$artjson["ART_obt_pk_note_2_1"].'",
								"ART_obt_pk_note_2_2": "'.$artjson["ART_obt_pk_note_2_2"].'",
								"ART_obt_pk_note_1": "'.$artjson["ART_obt_pk_note_1"].'",
								"ART_game_rnb": "'.$artjson["ART_game_rnb"].'",
                            
							    "ART_obt_mix": "'.$artjson["ART_obt_mix"].'",
                                "ART_obt_re": "'.$artjson["ART_obt_re"].'",
                                "ART_obt_rou": "'.$artjson["ART_obt_rou"].'",
                                "ART_obt_cn": "'.$artjson["ART_obt_cn"].'",
                                "ART_obt_rn": "'.$artjson["ART_obt_rn"].'",
                                "ART_obt_wi": "'.$artjson["ART_obt_wi"].'",
                                "ART_obt_et": "'.$artjson["ART_obt_et"].'",
                                "ART_obt_pk": "'.$artjson["ART_obt_pk"].'",
								"ART_obt_mix_more": "'.$artjson["ART_obt_mix_more"].'",
                            
                                "ART_obt_cn_rou": "'.$artjson["ART_obt_cn_rou"].'",
                                "ART_obt_cn_rnc": "'.$artjson["ART_obt_cn_rnc"].'",
                                "ART_obt_cn_reo": "'.$artjson["ART_obt_cn_reo"].'",
                            
                                "ART_obt_rn_rou": "'.$artjson["ART_obt_rn_rou"].'",
                                "ART_obt_rn_rnb": "'.$artjson["ART_obt_rn_rnb"].'",
                                "ART_obt_rn_reo": "'.$artjson["ART_obt_rn_reo"].'",
                                "ART_obt_rn_rm": "'.$artjson["ART_obt_rn_rm"].'",
                                "ART_obt_rn_re": "'.$artjson["ART_obt_rn_re"].'",
                            
                                "ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                                "ART_game_half1": "'.$artjson["ART_game_half1"].'",
                                "ART_game_et": "'.$artjson["ART_game_et"].'",
                                "ART_game_ethalf1": "'.$artjson["ART_game_ethalf1"].'",
                                "ART_game_pk": "'.$artjson["ART_game_pk"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                                "ART_game_odd": "'.$artjson["ART_game_odd"].'",
                                "ART_game_even": "'.$artjson["ART_game_even"].'",
                                "ART_game_yes": "'.$artjson["ART_game_yes"].'",
                                "ART_game_no": "'.$artjson["ART_game_no"].'",
                                "ART_game_goal": "'.$artjson["ART_game_goal"].'",
                                "ART_game_nogoal": "'.$artjson["ART_game_nogoal"].'",
                                "ART_game_draw": "'.$artjson["ART_game_draw"].'",
                                "ART_game_none": "'.$artjson["ART_game_none"].'",
                                "ART_game_otpoint": "'.$artjson["ART_game_otpoint"].'",
                            
                                "ART_game_rps_goal": "'.$artjson["ART_game_rps_goal"].'",
                                "ART_game_rps_nogoal": "'.$artjson["ART_game_rps_nogoal"].'",
                            
                                "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                                "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
								"ART_win": "'.$artjson["ART_win"].'",
                            }
                        ';
                            break;
							/*FT过关*/
                        case "parlay":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
								//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
								//新加
								"ART_obt_pd": "'.$artjson["ART_obt_pd"].'",
								"ART_obt_mix_re": "'.$artjson["ART_obt_mix_re"].'",
								"ART_obt_mix_rou": "'.$artjson["ART_obt_mix_rou"].'",
								"ART_obt_more": "'.$artjson["ART_obt_more"].'",
								"ART_game_rnc": "'.$artjson["ART_game_rnc"].'",
								"ART_obt_otpoint": "'.$artjson["ART_obt_otpoint"].'",
								"ART_game_rm2": "'.$artjson["ART_game_rm2"].'",
								"ART_game_1h": "'.$artjson["ART_game_1h"].'",
								"ART_game_player": "'.$artjson["ART_game_player"].'",
								"ART_game_anytime": "'.$artjson["ART_game_anytime"].'",
								"ART_game_1st": "'.$artjson["ART_game_1st"].'",
								"ART_game_last": "'.$artjson["ART_game_last"].'",
								"ART_game_rm1": "'.$artjson["ART_game_rm1"].'",
                                "ART_obt_sfs": "'.$artjson["ART_obt_sfs"].'",
								"ART_obt_rn_eo": "'.$artjson["ART_obt_rn_eo"].'",
								"ART_obt_rn_note": "'.$artjson["ART_obt_rn_note"].'",
								"ART_obt_cn_eo": "'.$artjson["ART_obt_cn_eo"].'",
								"ART_obt_cn_re": "'.$artjson["ART_obt_cn_re"].'",
								"ART_game_rsh": "'.$artjson["ART_game_rsh"].'",
								"ART_game_rsh_goal": "'.$artjson["ART_game_rsh_goal"].'",
								"ART_game_rsh_nogoal": "'.$artjson["ART_game_rsh_nogoal"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_obt": "'.$artjson["ART_game_draw_obt"].'",
								"ART_obt_pk_note_2_1": "'.$artjson["ART_obt_pk_note_2_1"].'",
								"ART_obt_pk_note_2_2": "'.$artjson["ART_obt_pk_note_2_2"].'",
								"ART_obt_pk_note_1": "'.$artjson["ART_obt_pk_note_1"].'",
								"ART_obt_et_note": "'.$artjson["ART_obt_et_note"].'",
								"ART_game_rnb": "'.$artjson["ART_game_rnb"].'",
								 
                                //in-play
                                "ART_game_re": "'.$artjson["ART_game_re"].'",
                                "ART_game_rou": "'.$artjson["ART_game_rou"].'",
                                "ART_game_rm": "'.$artjson["ART_game_rm"].'",
                                "ART_game_rg": "'.$artjson["ART_game_rg"].'",
                                "ART_game_rts": "'.$artjson["ART_game_rts"].'",
                                "ART_game_reo": "'.$artjson["ART_game_reo"].'",
                                "ART_game_rouh": "'.$artjson["ART_game_rouh"].'",
                                "ART_game_rouc": "'.$artjson["ART_game_rouc"].'",
                                "ART_game_rps": "'.$artjson["ART_game_rps"].'",
                            
                                //today early
                                "ART_game_r": "'.$artjson["ART_game_r"].'",
                                "ART_game_ou": "'.$artjson["ART_game_ou"].'",
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_ts": "'.$artjson["ART_game_ts"].'",
                                "ART_game_eo": "'.$artjson["ART_game_eo"].'",
                            
							    "ART_obt_mix": "'.$artjson["ART_obt_mix"].'",
                                "ART_obt_re": "'.$artjson["ART_obt_re"].'",
                                "ART_obt_rou": "'.$artjson["ART_obt_rou"].'",
                                "ART_obt_cn": "'.$artjson["ART_obt_cn"].'",
                                "ART_obt_rn": "'.$artjson["ART_obt_rn"].'",
                                "ART_obt_wi": "'.$artjson["ART_obt_wi"].'",
                                "ART_obt_et": "'.$artjson["ART_obt_et"].'",
                                "ART_obt_pk": "'.$artjson["ART_obt_pk"].'",
								"ART_obt_mix_more": "'.$artjson["ART_obt_mix_more"].'",
                            
                                //in-play
                                "ART_obt_cn_rou": "'.$artjson["ART_obt_cn_rou"].'",
                                "ART_obt_cn_rnc": "'.$artjson["ART_obt_cn_rnc"].'",
                                "ART_obt_cn_reo": "'.$artjson["ART_obt_cn_reo"].'",
                                //today early
                                "ART_obt_cn_r": "'.$artjson["ART_obt_cn_r"].'",
                                "ART_obt_cn_ou": "'.$artjson["ART_obt_cn_ou"].'",
                                "ART_obt_cn_m": "'.$artjson["ART_obt_cn_m"].'",
                            
                                //in-play
                                "ART_obt_rn_rou": "'.$artjson["ART_obt_rn_rou"].'",
                                "ART_obt_rn_rnb": "'.$artjson["ART_obt_rn_rnb"].'",
                                "ART_obt_rn_reo": "'.$artjson["ART_obt_rn_reo"].'",
                                "ART_obt_rn_rm": "'.$artjson["ART_obt_rn_rm"].'",
                                "ART_obt_rn_re": "'.$artjson["ART_obt_rn_re"].'",
                                //today early
                                "ART_obt_rn_r": "'.$artjson["ART_obt_rn_r"].'",
                                "ART_obt_rn_ou": "'.$artjson["ART_obt_rn_ou"].'",
                                "ART_obt_rn_m": "'.$artjson["ART_obt_rn_m"].'",
                            
                                //in-play
                                "ART_obt_et_re": "'.$artjson["ART_obt_et_re"].'",
                                "ART_obt_et_rou": "'.$artjson["ART_obt_et_rou"].'",
                                "ART_obt_et_rm": "'.$artjson["ART_obt_et_rm"].'",
                                "ART_obt_et_rg": "'.$artjson["ART_obt_et_rg"].'",
                                "ART_obt_et_rts": "'.$artjson["ART_obt_et_rts"].'",
                            
                                //in-play
                                "ART_obt_pk_re": "'.$artjson["ART_obt_pk_re"].'",
                                "ART_obt_pk_rou": "'.$artjson["ART_obt_pk_rou"].'",
                                "ART_obt_pk_rm": "'.$artjson["ART_obt_pk_rm"].'",
                                "ART_obt_pk_rs": "'.$artjson["ART_obt_pk_rs"].'",
                                "ART_obt_pk_rts": "'.$artjson["ART_obt_pk_rts"].'",
                            
                                "ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                                "ART_game_half1": "'.$artjson["ART_game_half1"].'",
                                "ART_game_et": "'.$artjson["ART_game_et"].'",
                                "ART_game_ethalf1": "'.$artjson["ART_game_ethalf1"].'",
                                "ART_game_pk": "'.$artjson["ART_game_pk"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                                "ART_game_odd": "'.$artjson["ART_game_odd"].'",
                                "ART_game_even": "'.$artjson["ART_game_even"].'",
                                "ART_game_yes": "'.$artjson["ART_game_yes"].'",
                                "ART_game_no": "'.$artjson["ART_game_no"].'",
                                "ART_game_goal": "'.$artjson["ART_game_goal"].'",
                                "ART_game_nogoal": "'.$artjson["ART_game_nogoal"].'",
                                "ART_game_draw": "'.$artjson["ART_game_draw"].'",
                                "ART_game_none": "'.$artjson["ART_game_none"].'",
                                "ART_game_otpoint": "'.$artjson["ART_game_otpoint"].'",
                            
                                "ART_game_rps_goal": "'.$artjson["ART_game_rps_goal"].'",
                                "ART_game_rps_nogoal": "'.$artjson["ART_game_rps_nogoal"].'",
                            
                                "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                                "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            }
                        ';
                            break;
							/*我的赛事*/
                        case "mygame":
                            switch ($langx){
                                case "en-us":
                                    $js.='
                                    var artjson = {
                                        "ART_lang": "EN",
                                        "ART_game_nodata": "There are no events available.",
                                        "ART_game_mygame1": "Selecting the above icon, for any event, will add it to the ",
                                        "ART_game_mygame2": "MY EVENTS",
                                        "ART_game_mygame3": " section. Here, you can group and easily access all the events you are interested in.",
                                        "ART_game_3in1": "in",
                                    
                                        //in-play
                                        "ART_game_re": "Handicap",
                                        "ART_game_rou": "Goals O/U",
                                        "ART_game_rm": "1 X 2",
                                        "ART_game_rg": "Next Goal",
                                        "ART_game_rts": "Both Teams<br>to Score",
                                        "ART_game_reo": "Goals Odd /<br>Even",
                                        "ART_game_rouh": "Team 1 <br> Goals",
                                        "ART_game_rouc": "Team 2 <br> Goals",
                                        "ART_game_rps": "Next Penalty",
										//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
										 //新加
									    "ART_obt_pd": "Correct Score",
										"ART_obt_mix_re": "Handicap",
								        "ART_obt_mix_rou": "Goals: Over / Under",
								        "ART_obt_more": "View All Markets",
										"ART_game_rnc": "Next Corner",
										"ART_obt_otpoint": "Any Other Score",
										"ART_game_rm2": "",
										"ART_game_1h": "1H",
										"ART_obt_cn_re": "Handicap",
										"ART_game_player": "Player Name",
								        "ART_game_anytime": "Anytime",
								        "ART_game_1st": "1st",
								        "ART_game_last": "Last",
										"ART_game_rm1": "1x2&O/U",
										"ART_obt_sfs": "Goalscorer",
										"ART_obt_rn_eo": "O/E",
										"ART_obt_cn_eo": "O/E",
										"ART_game_rsh": "Next Penalty",
								        "ART_game_rsh_goal": "Goal",
								        "ART_game_rsh_nogoal": "noGoal",
								        "ART_game_teamH": "1",
								        "ART_game_teamC": "2",
								        "ART_game_draw_obt": "X",
								        "ART_obt_pk_note_2_1": "Full Time score is",
								        "ART_obt_pk_note_2_2": " 。",
										"ART_obt_pk_note_1": "'.$artjson["ART_obt_pk_note_1"].'",
										"ART_obt_et_re": "'.$artjson["ART_obt_et_re"].'",
							         	"ART_obt_et_rou": "'.$artjson["ART_obt_et_rou"].'",
							        	"ART_obt_et_rm": "'.$artjson["ART_obt_et_rm"].'",
							        	"ART_obt_et_reo": "'.$artjson["ART_obt_et_reo"].'",
						        		"ART_obt_et_note": "'.$artjson["ART_obt_et_note"].'",
										"ART_game_rnb": "'.$artjson["ART_game_rnb"].'",
								       
                                        //today early
                                        "ART_game_r": "Handicap",
                                        "ART_game_ou": "Goals O/U",
                                        "ART_game_m": "1 X 2",
                                        "ART_game_ts": "Both Teams<br>to Score",
                                        "ART_game_eo": "Goals Odd /<br>Even",
                                         
										"ART_obt_mix": "HDP &O/U",
                                        "ART_obt_re": "Handicaps",
                                        "ART_obt_rou": "Goals O/U",
                                        "ART_obt_r": "Handicaps",
                                        "ART_obt_ou": "Goals O/U",
                                        "ART_obt_cn": "Corners",
                                        "ART_obt_rn": "Bookings",
                                        "ART_obt_wi": "Winner / To Qualify",
                                        "ART_obt_et": "Extra Time",
                                        "ART_obt_pk": "Penalty Shootout",
										"ART_obt_mix_more": "View All Markets",
                                    
                                        //in-play
                                        "ART_obt_cn_rou": "Corners <br> O/U",
                                        "ART_obt_cn_rnc": "Next Corner",
                                        "ART_obt_cn_reo": "Corners <br> O/E",
                                        //today early
                                        "ART_obt_cn_r": "Corners<br>Handicap",
                                        "ART_obt_cn_ou":"Corners<br>O/U",
                                        "ART_obt_cn_m": "Corners<br>1 X 2",
                                    
                                        //in-play
                                        "ART_obt_rn_rou": "Bookings<br>O/U",
                                        "ART_obt_rn_rnb": "Next<br>Booking",
                                        "ART_obt_rn_reo": "Bookings<br>O/E",
                                        "ART_obt_rn_rm": "Bookings<br>1 X 2",
                                        "ART_obt_rn_re": "Bookings<br>Handicap",
                                        //today early
                                        "ART_obt_rn_r": "Bookings<br>Handicap",
                                        "ART_obt_rn_ou": "Bookings<br>O/U",
                                        "ART_obt_rn_m": "Bookings<br>1 X 2",
                                    
                                        //in-play
                                        "ART_obt_et_re": "Handicap",
                                        "ART_obt_et_rou": "Goals<br>O/U",
                                        "ART_obt_et_rm": "1 X 2",
                                        "ART_obt_et_rg": "Next Goal",
                                        "ART_obt_et_rts": "Both Teams<br>to Score",
                                    
                                        //in-play
                                        "ART_obt_pk_re": "Handicap",
                                        "ART_obt_pk_rou": "Goals<br>O/U",
                                        "ART_obt_pk_rm": "1 X 2",
                                        "ART_obt_pk_rs": "Next Penalty",
                                        "ART_obt_pk_rts": "Both Teams<br>to Score",
                                    
                                        "ART_game_fulltime": "Full Time",
                                        "ART_game_half1": "1st Half",
                                        "ART_game_et": "ET",
                                        "ART_game_ethalf1": "ET 1st Half",
                                        "ART_game_pk": "Pens",
                                    
                                        "ART_game_over": "O",
                                        "ART_game_under": "U",
                                        "ART_game_odd": "Odd",
                                        "ART_game_even": "Even",
                                        "ART_game_yes": "Yes",
                                        "ART_game_no": "No",
                                        "ART_game_goal": "Goal",
                                        "ART_game_nogoal": "No Goal",
                                        "ART_game_draw": "Draw",
                                        "ART_game_none": "None",
                                        "ART_game_otpoint": "Any Other Score",
                                    
                                        "ART_game_rps_goal": "Score",
                                        "ART_game_rps_nogoal": "Miss",
										"ART_obt_rn_note": "'.$artjson["ART_obt_rn_note"].'",
                                    
                                        "ART_btn_viewless": "VIEW LESS",
                                        "ART_btn_viewmore": "VIEW MORE",
                                    }
                                    ';
                                    break;
                                case "zh-tw":
                                    $js.= '
                                    var artjson = {
                                        "ART_lang": "TW",
                                        "ART_game_nodata": "目前沒有任何賽事。",
                                        "ART_game_mygame1": "選擇上面的圖標，會將其添加到",
                                        "ART_game_mygame2": "我的賽事",
                                        "ART_game_mygame3": "中。您可以對其進行分組並輕鬆訪問您感興趣的所有賽事。",
                                        "ART_game_3in1": "串",
										"ART_obt_rn_note": "'.$artjson["ART_obt_rn_note"].'",
                                    
                                        //in-play
                                        "ART_game_re": "讓球",
                                        "ART_game_rou": "得分大小",
                                        "ART_game_rm": "獨贏",
                                        "ART_game_rg": "下一個進球",
                                        "ART_game_rts": "雙方球隊進球",
                                        "ART_game_reo": "進球:單 / 雙",
                                        "ART_game_rouh": "隊伍1進球",
                                        "ART_game_rouc": "隊伍2進球",
                                        "ART_game_rps": "下一個點球",
                                    
                                        //today early
                                        "ART_game_r": "讓球",
                                        "ART_game_ou": "得分大小",
                                        "ART_game_m": "獨贏",
                                        "ART_game_ts": "雙方球隊進球",
                                        "ART_game_eo": "進球:單 / 雙",
                                    
									    "ART_obt_mix": "讓球&大/小",
                                        "ART_obt_re": "讓球",
                                        "ART_obt_rou": "得分大小",
                                        "ART_obt_r": "讓球",
                                        "ART_obt_ou": "得分大小",
                                        "ART_obt_cn": "角球",
                                        "ART_obt_rn": "罰牌數",
                                        "ART_obt_wi": "冠軍/晉級",
                                        "ART_obt_et": "加時賽",
                                        "ART_obt_pk": "點球",
										"ART_obt_mix_more": "所有玩法",
										//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
										//新加
										"ART_obt_pd": "波膽",  
										"ART_obt_mix_re": "讓球",  
                                        "ART_obt_mix_rou": "進球: 大/小",  
                                        "ART_obt_more": "所有玩法",  
                                        "ART_game_rnc": "下個角球",  
                                        "ART_obt_otpoint": "其他比分",  
                                        "ART_game_rm2": "",  
                                        "ART_game_1h": "上半場",  
                                        "ART_obt_cn_re": "讓球",  
                                        "ART_game_player": "球員",  
                                        "ART_game_anytime": "任何時間",  
                                        "ART_game_1st": "最先",  
                                        "ART_game_last": "最後",  
                                        "ART_game_rm1": "獨贏&進球",  
                                        "ART_obt_sfs": "球員進球",  
                                        "ART_obt_rn_eo": "單/雙",
										"ART_obt_cn_eo": "單/雙",
										"ART_game_rsh": "下個進球",  
                                        "ART_game_rsh_goal": "進球",  
                                        "ART_game_rsh_nogoal": "沒進",  
                                        "ART_game_teamH": "主",  
                                        "ART_game_teamC": "客",  
                                        "ART_game_draw_obt": "和",  
                                        "ART_obt_pk_note_2_1": "全場比分是",  
                                        "ART_obt_pk_note_2_2": " 。",  
                                        "ART_obt_pk_note_1": "'.$artjson["ART_obt_pk_note_1"].'",
										"ART_obt_et_re": "'.$artjson["ART_obt_et_re"].'",
							        	"ART_obt_et_rou": "'.$artjson["ART_obt_et_rou"].'",
							        	"ART_obt_et_rm": "'.$artjson["ART_obt_et_rm"].'",
							        	"ART_obt_et_reo": "'.$artjson["ART_obt_et_reo"].'",
							        	"ART_obt_et_note": "'.$artjson["ART_obt_et_note"].'",
										"ART_game_rnb": "'.$artjson["ART_game_rnb"].'",



                                        
                                    
                                        //in-play
                                        "ART_obt_cn_rou": "角球 大/小",
                                        "ART_obt_cn_rnc": "下一個角球",
                                        "ART_obt_cn_reo": "角球 單/雙",
                                        //today early
                                        "ART_obt_cn_r": "角球 讓分",
                                        "ART_obt_cn_ou": "角球 大/小",
                                        "ART_obt_cn_m": "角球 獨贏",
                                    
                                        //in-play
                                        "ART_obt_rn_rou": "罰牌數 大/小",
                                        "ART_obt_rn_rnb": "下一個罰牌數",
                                        "ART_obt_rn_reo": "罰牌數 單/雙",
                                        "ART_obt_rn_rm": "罰牌數 獨贏",
                                        "ART_obt_rn_re": "罰牌數 讓球",
                                        //today early
                                        "ART_obt_rn_r": "罰牌數 讓分",
                                        "ART_obt_rn_ou": "罰牌數 大/小",
                                        "ART_obt_rn_m": "罰牌數 獨贏",
                                    
                                        //in-play
                                        "ART_obt_et_re": "讓球",
                                        "ART_obt_et_rou": "得分大小",
                                        "ART_obt_et_rm": "獨贏",
                                        "ART_obt_et_rg": "下一個進球",
                                        "ART_obt_et_rts": "雙方球隊進球",
                                    
                                        //in-play
                                        "ART_obt_pk_re": "讓球",
                                        "ART_obt_pk_rou": "得分大小",
                                        "ART_obt_pk_rm": "獨贏",
                                        "ART_obt_pk_rs": "下一個點球",
                                        "ART_obt_pk_rts": "雙方球隊進球",
                                    
                                        "ART_game_fulltime": "全場",
                                        "ART_game_half1": "上半場",
                                        "ART_game_et": "加時",
                                        "ART_game_ethalf1": "加時上半場",
                                        "ART_game_pk": "點球大戰",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                        "ART_game_odd": "單",
                                        "ART_game_even": "雙",
                                        "ART_game_yes": "是",
                                        "ART_game_no": "否",
                                        "ART_game_goal": "進球",
                                        "ART_game_nogoal": "沒進",
                                        "ART_game_draw": "和",
                                        "ART_game_none": "無",
                                        "ART_game_otpoint": "其它比分",
                                    
                                        "ART_game_rps_goal": "進球",
                                        "ART_game_rps_nogoal": "沒進",
                                    
                                        "ART_btn_viewless": "少量顯示",
                                        "ART_btn_viewmore": "顯示更多",
                                    }
                                    ';
                                    break;
                                default:
                                    $js .= '
                                    var artjson = {
                                        "ART_lang": "CN",
                                        "ART_game_nodata": "目前没有任何赛事。",
                                        "ART_game_mygame1": "选择上面的图标，会将其添加到",
                                        "ART_game_mygame2": "我的赛事",
                                        "ART_game_mygame3": "中。您可以对其进行分组并轻松访问您感兴趣的所有赛事。",
                                        "ART_game_3in1": "串",
										"ART_obt_rn_note": "'.$artjson["ART_obt_rn_note"].'",
                                    
                                        //in-play
                                        "ART_game_re": "让球",
                                        "ART_game_rou": "得分大小",
                                        "ART_game_rm": "独赢",
                                        "ART_game_rg": "下一个进球",
                                        "ART_game_rts": "双方球队进球",
                                        "ART_game_reo": "进球:单 / 双",
                                        "ART_game_rouh": "队伍1进球",
                                        "ART_game_rouc": "队伍2进球",
                                        "ART_game_rps": "下一个点球",
                                    
                                        //today early
                                        "ART_game_r": "让球",
                                        "ART_game_ou": "得分大小",
                                        "ART_game_m": "独赢",
                                        "ART_game_ts": "双方球队进球",
                                        "ART_game_eo": "进球:单 / 双",
                                        
										"ART_obt_mix": "让球&大/小",
                                        "ART_obt_re": "让球",
                                        "ART_obt_rou": "得分大小",
                                        "ART_obt_r": "让球",
                                        "ART_obt_ou": "得分大小",
                                        "ART_obt_cn": "角球",
                                        "ART_obt_rn": "罚牌数",
                                        "ART_obt_wi": "冠军/晋级",
                                        "ART_obt_et": "加时赛",
                                        "ART_obt_pk": "点球",
										"ART_obt_mix_more": "所有玩法",
										
                                    
                                        //in-play
                                        "ART_obt_cn_rou": "角球 大/小",
                                        "ART_obt_cn_rnc": "下一个角球",
                                        "ART_obt_cn_reo": "角球 单/双",
                                        //today early
                                        "ART_obt_cn_r": "角球 让分",
                                        "ART_obt_cn_ou": "角球 大/小",
                                        "ART_obt_cn_m": "角球 独赢",
                                    
                                        //in-play
                                        "ART_obt_rn_rou": "罚牌数 大/小",
                                        "ART_obt_rn_rnb": "下一个罚牌数",
                                        "ART_obt_rn_reo": "罚牌数 单/双",
                                        "ART_obt_rn_rm": "罚牌数 独赢",
                                        "ART_obt_rn_re": "罚牌数 让球",
                                        //today early
                                        "ART_obt_rn_r": "罚牌数 让分",
                                        "ART_obt_rn_ou": "罚牌数 大/小",
                                        "ART_obt_rn_m": "罚牌数 独赢",
                                    
                                        //in-play
                                        "ART_obt_et_re": "让球",
                                        "ART_obt_et_rou": "得分大小",
                                        "ART_obt_et_rm": "独赢",
                                        "ART_obt_et_rg": "下一个进球",
                                        "ART_obt_et_rts": "双方球队进球",
                                    
                                        //in-play
                                        "ART_obt_pk_re": "让球",
                                        "ART_obt_pk_rou": "得分大小",
                                        "ART_obt_pk_rm": "独赢",
                                        "ART_obt_pk_rs": "下一个点球",
                                        "ART_obt_pk_rts": "双方球队进球",
                                    
                                        "ART_game_fulltime": "全场",
                                        "ART_game_half1": "上半场",
                                        "ART_game_et": "加时",
                                        "ART_game_ethalf1": "加时上半场",
                                        "ART_game_pk": "点球大战",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                        "ART_game_odd": "单",
                                        "ART_game_even": "双",
                                        "ART_game_yes": "是",
                                        "ART_game_no": "否",
                                        "ART_game_goal": "进球",
                                        "ART_game_nogoal": "没进",
                                        "ART_game_draw": "和",
                                        "ART_game_none": "无",
                                        "ART_game_otpoint": "其它比分",
                                    
                                        "ART_game_rps_goal": "进球",
                                        "ART_game_rps_nogoal": "没进",
                                    //新加
									    //新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
									    "ART_obt_pd": "波胆",
										"ART_obt_mix_re": "让球",
								        "ART_obt_mix_rou": "进球: 大/小",
								        "ART_obt_more": "所有玩法",
										"ART_game_rnc": "下个角球",
										"ART_obt_otpoint": "其他比分",
										"ART_game_rm2": "",
										"ART_game_1h": "上半场",
										"ART_obt_cn_re": "让球",
										"ART_game_player": "球员",
								        "ART_game_anytime": "任何时间",
								        "ART_game_1st": "最先",
								        "ART_game_last": "最后",
										"ART_game_rm1": "独赢&进球",
										"ART_obt_sfs": "球员进球",
										"ART_obt_rn_eo": "单/双",
										"ART_obt_cn_eo": "单/双",
										"ART_game_rsh": "下个进球",
								        "ART_game_rsh_goal": "进球",
								        "ART_game_rsh_nogoal": "没进",
								        "ART_game_teamH": "主",
								        "ART_game_teamC": "客",
								        "ART_game_draw_obt": "和",
								        "ART_obt_pk_note_2_1": "全场比分是",
								        "ART_obt_pk_note_2_2": " 。",
								        "ART_obt_pk_note_1": "'.$artjson["ART_obt_pk_note_1"].'",
										"ART_obt_et_re": "'.$artjson["ART_obt_et_re"].'",
								        "ART_obt_et_rou": "'.$artjson["ART_obt_et_rou"].'",
							        	"ART_obt_et_rm": "'.$artjson["ART_obt_et_rm"].'",
							        	"ART_obt_et_reo": "'.$artjson["ART_obt_et_reo"].'",
							        	"ART_obt_et_note": "'.$artjson["ART_obt_et_note"].'",
										"ART_game_rnb": "'.$artjson["ART_game_rnb"].'",
										
										
                                        "ART_btn_viewless": "少量显示",
                                        "ART_btn_viewmore": "显示更多",
                                    }
                                    ';
                                    break;
                            }
                            break;
                    }
                    break;
					//篮球外盘
                case "bk":
                    switch ($_p["showtype"]){
						case "soon":
						case "hot":
                        case "today":
                        case "early":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",

                                "ART_game_re": "'.$artjson["ART_game_r"].'",
                                "ART_game_rou": "'.$artjson["ART_game_ou"].'",
                                "ART_game_rouh": "'.$artjson["ART_game_ouh"].'",
                                "ART_game_rouc": "'.$artjson["ART_game_ouc"].'",
                            
                                "ART_game_r": "'.$artjson["ART_game_r"].'",
                                "ART_game_ou": "'.$artjson["ART_game_ou"].'",
                                "ART_game_ouh": "'.$artjson["ART_game_ouh"].'",
                                "ART_game_ouc": "'.$artjson["ART_game_ouc"].'",
                            
                                "ART_game_half1": "'.$artjson["ART_game_half1"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                            };
                        ';
                            break;
                        case "live":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            
                                "ART_game_re": "'.$artjson["ART_game_r"].'",
                                "ART_game_rou": "'.$artjson["ART_game_ou"].'",
                                "ART_game_rouh": "'.$artjson["ART_game_ouh"].'",
                                "ART_game_rouc": "'.$artjson["ART_game_ouc"].'",
                            
                                "ART_game_half1": "'.$artjson["ART_game_half1"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                            };
                        ';
                            break;
						
                        case "parlay":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            
                                "ART_game_r": "'.$artjson["ART_game_r"].'",
                                "ART_game_ou": "'.$artjson["ART_game_bk_ou"].'",
                                "ART_game_ouh": "'.$artjson["ART_game_ouh"].'",
                                "ART_game_ouc": "'.$artjson["ART_game_ouc"].'",
                            
                                "ART_game_half1": "'.$artjson["ART_game_half1"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                            };
                        ';
                            break;
                        case "mygame":
                            switch ($langx){
                                case "en-us":
                                    $js.='
                                    var artjson = {
                                        "ART_lang": "EN",
                                        "ART_game_nodata": "There are no events available.",
                                        "ART_game_mygame1": "Selecting the above icon, for any event, will add it to the ",
                                        "ART_game_mygame2": "MY EVENTS",
                                        "ART_game_mygame3": " section. Here, you can group and easily access all the events you are interested in.",
                                    
                                        "ART_game_re": "Handicap",
                                        "ART_game_rou": "Total Points",
                                        "ART_game_rouh": "Team 1<br>Points",
                                        "ART_game_rouc": "Team 2<br>Points",
                                    
                                        "ART_game_r": "Handicap",
                                        "ART_game_ou": "Total Points",
                                        "ART_game_ouh": "Team 1<br>Points",
                                        "ART_game_ouc": "Team 2<br>Points",
                                    
                                        "ART_game_half1": "1st Half",
                                    
                                        "ART_game_over": "O",
                                        "ART_game_under": "U",
                                    }
                                    ';
                                    break;
                                case "zh-tw":
                                    $js.= '
                                    var artjson = {
                                        "ART_lang": "TW",
                                        "ART_game_nodata": "目前沒有任何賽事。",
                                        "ART_game_mygame1": "選擇上面的圖標，會將其添加到",
                                        "ART_game_mygame2": "我的賽事",
                                        "ART_game_mygame3": "中。您可以對其進行分組並輕鬆訪問您感興趣的所有賽事。",
                                        "ART_game_nodata": "目前沒有任何賽事。",
                                    
                                        "ART_game_re": "讓球",
                                        "ART_game_rou": "總分",
                                        "ART_game_rouh": "第1隊得分",
                                        "ART_game_rouc": "第2隊得分",
                                    
                                        "ART_game_r": "讓球",
                                        "ART_game_ou": "總分",
                                        "ART_game_ouh": "第1隊得分",
                                        "ART_game_ouc": "第2隊得分",
                                    
                                        "ART_game_half1": "上半場",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                    }
                                    ';
                                    break;
                                default:
                                    $js .= '
                                    var artjson = {
                                        "ART_lang": "CN",
                                        "ART_game_nodata": "目前没有任何赛事。",
                                        "ART_game_mygame1": "选择上面的图标，会将其添加到",
                                        "ART_game_mygame2": "我的赛事",
                                        "ART_game_mygame3": "中。您可以对其进行分组并轻松访问您感兴趣的所有赛事。",
                                    
                                        "ART_game_re": "让球",
                                        "ART_game_rou": "总分",
                                        "ART_game_rouh": "第1队得分",
                                        "ART_game_rouc": "第2队得分",
                                    
                                        "ART_game_r": "让球",
                                        "ART_game_ou": "总分",
                                        "ART_game_ouh": "第1队得分",
                                        "ART_game_ouc": "第2队得分",
                                    
                                        "ART_game_half1": "上半场",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                    }
                                    ';
                                    break;
                            }
                            break;
                    }
                    break;
					//棒球外盘
                case "bs":
                    switch ($_p["showtype"]){
						case "soon":
						case "hot":
                        case "today":
                        case "early":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                              
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_r": "'.$artjson["ART_game_r"].'",
                                "ART_game_ou": "'.$artjson["ART_game_bs_ou"].'",
                                "ART_game_ouh": "'.$artjson["ART_game_ouh"].'",
                                "ART_game_ouc": "'.$artjson["ART_game_ouc"].'",
								"ART_game_rm": "'.$artjson["ART_game_m"].'",
                                "ART_game_re": "'.$artjson["ART_game_r"].'",
                                "ART_game_rou": "'.$artjson["ART_game_bs_ou"].'",
                                "ART_game_rouh": "'.$artjson["ART_game_ouh"].'",
                                "ART_game_rouc": "'.$artjson["ART_game_ouc"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                            
                                "ART_game_out": "'.$artjson["ART_game_out"].'",
                                "ART_game_draw": "'.$artjson["ART_game_draw"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
                            };
                        ';
                            break;
                        case "live":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                              
                                "ART_game_rm": "'.$artjson["ART_game_m"].'",
                                "ART_game_re": "'.$artjson["ART_game_r"].'",
                                "ART_game_rou": "'.$artjson["ART_game_bs_ou"].'",
                                "ART_game_rouh": "'.$artjson["ART_game_ouh"].'",
                                "ART_game_rouc": "'.$artjson["ART_game_ouc"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                            
                                "ART_game_out": "'.$artjson["ART_game_out"].'",
                                "ART_game_draw": "'.$artjson["ART_game_draw"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
                            };
                        ';
                            break;
                        case "parlay":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_r": "'.$artjson["ART_game_r"].'",
                                "ART_game_ou": "'.$artjson["ART_game_bs_ou"].'",
                                "ART_game_ouh": "'.$artjson["ART_game_ouh"].'",
                                "ART_game_ouc": "'.$artjson["ART_game_ouc"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                            
                                "ART_game_out": "'.$artjson["ART_game_out"].'",
                                "ART_game_draw": "'.$artjson["ART_game_draw"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
                            };
                        ';
                            break;
                        case "mygame":
                            switch ($langx){
                                case "en-us":
                                    $js.='
                                    var artjson = {
                                        "ART_lang": "EN",
                                        "ART_game_nodata": "There are no events available.",
                                        "ART_game_mygame1": "Selecting the above icon, for any event, will add it to the ",
                                        "ART_game_mygame2": "MY EVENTS",
                                        "ART_game_mygame3": " section. Here, you can group and easily access all the events you are interested in.",
                                    
                                        "ART_game_rm": "Money Line",
                                        "ART_game_re": "Handicap",
                                        "ART_game_rou": "Total Runs",
                                        "ART_game_rouh": "Team 1 Runs",
                                        "ART_game_rouc": "Team 2 Runs",
                                    
                                        "ART_game_m": "Money Line",
                                        "ART_game_r": "Handicap",
                                        "ART_game_ou": "Total Runs",
                                        "ART_game_ouh": "Team 1 Runs",
                                        "ART_game_ouc": "Team 2 Runs",
                                    
                                        "ART_game_over": "O",
                                        "ART_game_under": "U",
                                        "ART_game_draw": "Draw",
                                        "ART_game_out": "Out:",
                                    }
                                    ';
                                    break;
                                case "zh-tw":
                                    $js.= '
                                    var artjson = {
                                        "ART_lang": "TW",
                                        "ART_game_nodata": "目前沒有任何賽事。",
                                        "ART_game_mygame1": "選擇上面的圖標，會將其添加到",
                                        "ART_game_mygame2": "我的賽事",
                                        "ART_game_mygame3": "中。您可以對其進行分組並輕鬆訪問您感興趣的所有賽事。",
                                        "ART_game_3in1": "串",
                                    
                                        "ART_game_rm": "獨贏",
                                        "ART_game_re": "讓球",
                                        "ART_game_rou": "總得分",
                                        "ART_game_rouh": "第1隊得分",
                                        "ART_game_rouc": "第2隊得分",
                                    
                                        "ART_game_m": "獨贏",
                                        "ART_game_r": "讓球",
                                        "ART_game_ou": "總得分",
                                        "ART_game_ouh": "第1隊得分",
                                        "ART_game_ouc": "第2隊得分",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                        "ART_game_draw": "平手",
                                    
                                        "ART_game_out": "出局:",
                                    }
                                    ';
                                    break;
                                default:
                                    $js .= '
                                    var artjson = {
                                        "ART_lang": "CN",
                                        "ART_game_nodata": "目前没有任何赛事。",
                                        "ART_game_mygame1": "选择上面的图标，会将其添加到",
                                        "ART_game_mygame2": "我的赛事",
                                        "ART_game_mygame3": "中。您可以对其进行分组并轻松访问您感兴趣的所有赛事。",
                                    
                                        "ART_game_rm": "独赢",
                                        "ART_game_re": "让球",
                                        "ART_game_rou": "总得分",
                                        "ART_game_rouh": "第1队得分",
                                        "ART_game_rouc": "第2队得分",
                                    
                                        "ART_game_m": "独赢",
                                        "ART_game_r": "让球",
                                        "ART_game_ou": "总得分",
                                        "ART_game_ouh": "第1队得分",
                                        "ART_game_ouc": "第2队得分",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                        "ART_game_draw": "平手",
                                        "ART_game_out": "出局:",
                                    }
                                    ';
                                    break;
                            }
                            break;
                    }
                    break;
					
                case "vb":
                    switch ($_p["showtype"]){
						case "soon":
						case "hot":
                        case "today":
                        case "early":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_r": "'.$artjson["ART_game_r_game"].'",
                                "ART_game_r_point": "'.$artjson["ART_game_re_point"].'", 
								"ART_game_rm": "'.$artjson["ART_game_m"].'",
                                "ART_game_re": "'.$artjson["ART_game_r_game"].'",
                                "ART_game_re_point": "'.$artjson["ART_game_re_point"].'", 
								
                            };
                        ';
                            break;
                        case "live":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            
                                "ART_game_rm": "'.$artjson["ART_game_m"].'",
                                "ART_game_re": "'.$artjson["ART_game_r_game"].'",
                                "ART_game_re_point": "'.$artjson["ART_game_re_point"].'", 
								
                            };
                        ';
                            break;
                        case "parlay":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_r": "'.$artjson["ART_game_r_game"].'",
                                "ART_game_r_point": "'.$artjson["ART_game_re_point"].'", 
								
                            };
                        ';
                            break;
                        case "mygame":
                            switch ($langx){
                                case "en-us":
                                    $js.='
                                    var artjson = {
                                        "ART_lang": "EN",
                                        "ART_game_nodata": "There are no events available.",
                                        "ART_game_mygame1": "Selecting the above icon, for any event, will add it to the ",
                                        "ART_game_mygame2": "MY EVENTS",
                                        "ART_game_mygame3": " section. Here, you can group and easily access all the events you are interested in.",
                                    
                                        "ART_game_rm": "Money Line",
                                        "ART_game_re": "Game Handicap",
                                        "ART_game_re_point": "Point Handicap",
                                    
                                        "ART_game_m": "Money Line",
                                        "ART_game_r": "Game Handicap",
                                        "ART_game_r_point": "Point Handicap",
                                    }
                                    ';
                                    break;
                                case "zh-tw":
                                    $js.= '
                                    var artjson = {
                                        "ART_lang": "TW",
                                        "ART_game_nodata": "目前沒有任何賽事",
                                        "ART_game_mygame1": "選擇上面的圖標，會將其添加到",
                                        "ART_game_mygame2": "我的賽事",
                                        "ART_game_mygame3": "中。您可以對其進行分組並輕鬆訪問您感興趣的所有賽事。",
                                        "ART_game_3in1": "串",
                                    
                                        "ART_game_rm": "獨贏",
                                        "ART_game_re": "讓局",
                                        "ART_game_re_point": "讓分",
                                    
                                        "ART_game_m": "獨贏",
                                        "ART_game_r": "讓局",
                                        "ART_game_r_point": "讓分",
                                    }
                                    ';
                                    break;
                                default:
                                    $js .= '
                                    var artjson = {
                                        "ART_lang": "CN",
                                        "ART_game_nodata": "目前没有任何赛事。",
                                        "ART_game_mygame1": "选择上面的图标，会将其添加到",
                                        "ART_game_mygame2": "我的赛事",
                                        "ART_game_mygame3": "中。您可以对其进行分组并轻松访问您感兴趣的所有赛事。",
                                    
                                        "ART_game_rm": "独赢",
                                        "ART_game_re": "让局",
                                        "ART_game_re_point": "让分",
                                    
                                        "ART_game_m": "独赢",
                                        "ART_game_r": "让局",
                                        "ART_game_r_point": "让分",
                                    }
                                    ';
                                    break;
                            }
                            break;
                    }
                    break;
					//网球外盘
                case "tn":
                    switch ($_p["showtype"]){
						case "soon":
						case "hot":
                        case "today":
                        case "early":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            
                            
                                "ART_game_rm": "'.$artjson["ART_game_rm"].'",
                                "ART_game_re": "'.$artjson["ART_game_re"].'",
                                "ART_game_rou": "'.$artjson["ART_game_rou"].'",
                                "ART_game_re_game": "'.$artjson["ART_game_re_game"].'",
                                "ART_game_rga": "'.$artjson["ART_game_rga"].'",
                                
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_r": "'.$artjson["ART_game_tn_r"].'",
                                "ART_game_r_game": "'.$artjson["ART_game_r_game"].'",
                            
                                "ART_game_ou": "'.$artjson["ART_game_tn_ou"].'",
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                                "ART_game_yes": "'.$artjson["ART_game_yes"].'",
	                            "ART_game_no": "'.$artjson["ART_game_no"].'",
                            };
                        ';
                            break;
                        case "live":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            
                                "ART_game_rm": "'.$artjson["ART_game_rm"].'",
                                "ART_game_re": "'.$artjson["ART_game_tn_r"].'",
                                "ART_game_rou": "'.$artjson["ART_game_rou"].'",
                                "ART_game_re_game": "'.$artjson["ART_game_re_game"].'",
                                "ART_game_rga": "'.$artjson["ART_game_rga"].'",
                                
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_r": "'.$artjson["ART_game_tn_r"].'",
                                "ART_game_r_game": "'.$artjson["ART_game_r_game"].'",
                            
                                "ART_game_ou": "'.$artjson["ART_game_tn_ou"].'",
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                                "ART_game_yes": "'.$artjson["ART_game_yes"].'",
	                            "ART_game_no": "'.$artjson["ART_game_no"].'",
                            };
                        ';
                            break;
                        case "parlay":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            
                                "ART_game_rm": "'.$artjson["ART_game_rm"].'",
                                "ART_game_re": "'.$artjson["ART_game_re"].'",
                                "ART_game_rou": "'.$artjson["ART_game_rou"].'",
                                "ART_game_re_game": "'.$artjson["ART_game_re_game"].'",
                                "ART_game_rga": "'.$artjson["ART_game_rga"].'",
                                
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_r": "'.$artjson["ART_game_tn_r"].'",
                                "ART_game_r_game": "'.$artjson["ART_game_r_game"].'",
                            
                                "ART_game_ou": "'.$artjson["ART_game_tn_ou"].'",
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                                "ART_game_yes": "'.$artjson["ART_game_yes"].'",
	                            "ART_game_no": "'.$artjson["ART_game_no"].'",
                            };
                        ';
                            break;
                        case "mygame":
                            switch ($langx){
                                case "en-us":
                                    $js.='
                                    var artjson = {
                                        "ART_lang": "EN",
                                        "ART_game_nodata": "There are no events available.",
                                        "ART_game_mygame1": "Selecting the above icon, for any event, will add it to the ",
                                        "ART_game_mygame2": "MY EVENTS",
                                        "ART_game_mygame3": " section. Here, you can group and easily access all the events you are interested in.",
                                    
                                        "ART_game_rm": "Money Line",
                                        "ART_game_re": "Set Handicap",
                                        "ART_game_rou": "Total Games",
                                        "ART_game_re_game": "Game Handicap",
                                    
                                        "ART_game_m": "Money Line",
                                        "ART_game_r": "Set Handicap",
                                        "ART_game_r_game": "Game Handicap",
                                        "ART_game_ou": "Total Games",
                                    
                                        "ART_game_over": "O",
                                        "ART_game_under": "U",
                                    }
                                    ';
                                    break;
                                case "zh-tw":
                                    $js.= '
                                    var artjson = {
                                        "ART_lang": "TW",
                                        "ART_game_nodata": "目前沒有任何賽事",
                                        "ART_game_mygame1": "選擇上面的圖標，會將其添加到",
                                        "ART_game_mygame2": "我的賽事",
                                        "ART_game_mygame3": "中。您可以對其進行分組並輕鬆訪問您感興趣的所有賽事。",
                                        "ART_game_3in1": "串",
                                    
                                        "ART_game_rm": "獨贏",
                                        "ART_game_re": "讓盤",
                                        "ART_game_rou": "總局數",
                                        "ART_game_re_game": "讓局",
                                    
                                        "ART_game_m": "獨贏",
                                        "ART_game_r": "讓盤",
                                        "ART_game_r_game": "讓局",
                                        "ART_game_ou": "總局數",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                    }
                                    ';
                                    break;
                                default:
                                    $js .= '
                                    var artjson = {
                                        "ART_lang": "CN",
                                        "ART_game_nodata": "目前没有任何赛事。",
                                        "ART_game_mygame1": "选择上面的图标，会将其添加到",
                                        "ART_game_mygame2": "我的赛事",
                                        "ART_game_mygame3": "中。您可以对其进行分组并轻松访问您感兴趣的所有赛事。",
                                    
                                        "ART_game_rm": "独赢",
                                        "ART_game_re": "让盘",
                                        "ART_game_rou": "总局数",
                                        "ART_game_re_game": "让局",
                                    
                                        "ART_game_m": "独赢",
                                        "ART_game_r": "让盘",
                                        "ART_game_r_game": "让局",
                                        "ART_game_ou": "总局数",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                    }
                                    ';
                                    break;
                            }
                            break;
                    }
                    break;
                case "op":
				case "es":
                    switch ($_p["showtype"]){
						case "soon":
						case "hot":
                        case "today":
                        case "early":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_time_live": "'.$artjson["ART_time_live"].'",
                                "ART_game_re": "'.$artjson["ART_game_r"].'",
                                "ART_game_rm": "'.$artjson["ART_game_m"].'",
                                "ART_game_rou": "'.$artjson["ART_game_op_ou"].'",
                                "ART_game_reo": "'.$artjson["ART_game_op_eo"].'",
                                "ART_game_r": "'.$artjson["ART_game_r"].'",
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_ou": "'.$artjson["ART_game_op_ou"].'",
                                "ART_game_eo": "'.$artjson["ART_game_op_eo"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                                "ART_game_odd": "'.$artjson["ART_game_odd"].'",
                                "ART_game_even": "'.$artjson["ART_game_even"].'",
                                "ART_game_draw": "'.$artjson["ART_game_bs_draw"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
                            };
                        ';
                            break;
                        case "live":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_time_live": "'.$artjson["ART_time_live"].'",
                                "ART_game_re": "'.$artjson["ART_game_r"].'",
                                "ART_game_rm": "'.$artjson["ART_game_m"].'",
                                "ART_game_rou": "'.$artjson["ART_game_op_ou"].'",
                                "ART_game_reo": "'.$artjson["ART_game_op_eo"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                                "ART_game_odd": "'.$artjson["ART_game_odd"].'",
                                "ART_game_even": "'.$artjson["ART_game_even"].'",
                                "ART_game_draw": "'.$artjson["ART_game_bs_draw"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
                            };
                        ';
                            break;
                        case "parlay":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            
                                "ART_game_r": "'.$artjson["ART_game_r"].'",
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_ou": "'.$artjson["ART_game_op_ou"].'",
                                "ART_game_eo": "'.$artjson["ART_game_op_eo"].'",
                            
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                                "ART_game_odd": "'.$artjson["ART_game_odd"].'",
                                "ART_game_even": "'.$artjson["ART_game_even"].'",
                                "ART_game_draw": "'.$artjson["ART_game_bs_draw"].'",
								"ART_game_teamH": "'.$artjson["ART_game_teamH"].'",
								"ART_game_teamC": "'.$artjson["ART_game_teamC"].'",
								"ART_game_draw_X": "'.$artjson["ART_game_draw_X"].'",
								"ART_game_none_X": "'.$artjson["ART_game_none_X"].'",
                            };
                        ';
                            break;
                        case "mygame":
                            switch ($langx){
                                case "en-us":
                                    $js.='
                                    var artjson = {
                                        "ART_lang": "EN",
                                        "ART_game_nodata": "There are no events available.",
                                        "ART_game_mygame1": "Selecting the above icon, for any event, will add it to the ",
                                        "ART_game_mygame2": "MY EVENTS",
                                        "ART_game_mygame3": " section. Here, you can group and easily access all the events you are interested in.",
                                    
                                        "ART_time_live": "LIVE",
                                    
                                        "ART_game_re": "Handicap",
                                        "ART_game_rm": "1 X 2",
                                        "ART_game_rou": "Over / Under",
                                        "ART_game_reo": "Odd / Even",
                                    
                                        "ART_game_r": "Handicap",
                                        "ART_game_m": "1 X 2",
                                        "ART_game_ou": "Over / Under",
                                        "ART_game_eo": "Odd / Even",
                                    
                                        "ART_game_over": "O",
                                        "ART_game_under": "U",
                                        "ART_game_odd": "Odd",
                                        "ART_game_even": "Even",
                                        "ART_game_draw": "Draw",
                                    }
                                    ';
                                    break;
                                case "zh-tw":
                                    $js.= '
                                    var artjson = {
                                        "ART_lang": "TW",
                                        "ART_game_nodata": "目前沒有任何賽事。",
                                        "ART_game_mygame1": "選擇上面的圖標，會將其添加到",
                                        "ART_game_mygame2": "我的賽事",
                                        "ART_game_mygame3": "中。您可以對其進行分組並輕鬆訪問您感興趣的所有賽事。",
                                        "ART_game_3in1": "串",
                                    
                                        "ART_time_live": "滾球",
                                    
                                        "ART_game_re": "讓球",
                                        "ART_game_rm": "獨贏",
                                        "ART_game_rou": "大 / 小",
                                        "ART_game_reo": "單 / 雙",
                                    
                                        "ART_game_r": "讓球",
                                        "ART_game_m": "獨贏",
                                        "ART_game_ou": "大 / 小",
                                        "ART_game_eo": "單 / 雙",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                        "ART_game_odd": "單",
                                        "ART_game_even": "雙",
                                        "ART_game_draw": "平手",
                                    }
                                    ';
                                    break;
                                default:
                                    $js .= '
                                    var artjson = {
                                        "ART_lang": "CN",
                                        "ART_game_nodata": "目前没有任何赛事。",
                                        "ART_game_mygame1": "选择上面的图标，会将其添加到",
                                        "ART_game_mygame2": "我的赛事",
                                        "ART_game_mygame3": "中。您可以对其进行分组并轻松访问您感兴趣的所有赛事。",
                                    
                                        "ART_time_live": "滚球",
                                    
                                        "ART_game_re": "让球",
                                        "ART_game_rm": "独赢",
                                        "ART_game_rou": "大 / 小",
                                        "ART_game_reo": "单 / 双",
                                    
                                        "ART_game_r": "让球",
                                        "ART_game_m": "独赢",
                                        "ART_game_ou": "大 / 小",
                                        "ART_game_eo": "单 / 双",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                        "ART_game_odd": "单",
                                        "ART_game_even": "双",
                                        "ART_game_draw": "平手",
                                    }
                                    ';
                                    break;
                            }
                            break;
                    }
                    break;
                case "bm":
                case "tt":
                    switch ($_p["showtype"]){
						case "soon":
						case "hot":
                     //   case "today":
                        case "early":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            
                                "ART_game_m": "'.$artjson["ART_game_rm"].'",
                                "ART_game_r": "'.$artjson["ART_game_r_game"].'",
                                "ART_game_r_point": "'.$artjson["ART_game_re_point"].'",
                            };
                        ';
                            break;
							case "today":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_game_rptw": "'.$artjson["ART_game_rptw"].'",
                                "ART_game_rm": "'.$artjson["ART_game_rm"].'",
                                "ART_game_re": "'.$artjson["ART_game_r_game"].'",
                                "ART_game_re_point": "'.$artjson["ART_game_re_point"].'",
								"ART_game_rou": "'.$artjson["ART_game_rou"].'",
								
                            
                                "ART_game_m": "'.$artjson["ART_game_rm"].'",
                                "ART_game_r": "'.$artjson["ART_game_r_game"].'",
                                "ART_game_r_point": "'.$artjson["ART_game_re_point"].'",
                                "ART_game_ou": "'.$artjson["ART_game_ou"].'",
                            };
                        ';
                            break;	
							
                        case "live":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_game_rptw": "'.$artjson["ART_game_rptw"].'",
                                "ART_game_rm": "'.$artjson["ART_game_rm"].'",
                                "ART_game_re": "'.$artjson["ART_game_r_game"].'",
                                "ART_game_re_point": "'.$artjson["ART_game_re_point"].'",
								"ART_game_rou": "'.$artjson["ART_game_rou"].'",
                            };
                        ';
                            break;
                        case "parlay":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            
                                "ART_game_m": "'.$artjson["ART_game_rm"].'",
                                "ART_game_e": "'.$artjson["ART_game_r_game"].'",
                                "ART_game_r_point": "'.$artjson["ART_game_re_point"].'",
								"ART_game_r": "'.$artjson["ART_game_r"].'",
								"ART_game_ou": "'.$artjson["ART_game_ou"].'",
								
                            };
                        ';
                            break;
                        case "mygame":
                            switch ($langx){
                                case "en-us":
                                    $js.='
                                    var artjson = {
                                        "ART_lang": "EN",
                                        "ART_game_nodata": "There are no events available.",
                                        "ART_game_mygame1": "Selecting the above icon, for any event, will add it to the ",
                                        "ART_game_mygame2": "MY EVENTS",
                                        "ART_game_mygame3": " section. Here, you can group and easily access all the events you are interested in.",
                                    
                                        "ART_time_live": "LIVE",
                                    
                                        "ART_game_re": "Handicap",
                                        "ART_game_rm": "1 X 2",
                                        "ART_game_rou": "Over / Under",
                                        "ART_game_reo": "Odd / Even",
                                    
                                        "ART_game_r": "Handicap",
                                        "ART_game_m": "1 X 2",
                                        "ART_game_ou": "Over / Under",
                                        "ART_game_eo": "Odd / Even",
                                    
                                        "ART_game_over": "O",
                                        "ART_game_under": "U",
                                        "ART_game_odd": "Odd",
                                        "ART_game_even": "Even",
                                        "ART_game_draw": "Draw",
                                    }
                                    ';
                                    break;
                                case "zh-tw":
                                    $js.= '
                                    var artjson = {
                                        "ART_lang": "TW",
                                        "ART_game_nodata": "目前沒有任何賽事。",
                                        "ART_game_mygame1": "選擇上面的圖標，會將其添加到",
                                        "ART_game_mygame2": "我的賽事",
                                        "ART_game_mygame3": "中。您可以對其進行分組並輕鬆訪問您感興趣的所有賽事。",
                                        "ART_game_3in1": "串",
                                    
                                        "ART_game_rm": "獨贏",
                                        "ART_game_re": "讓局",
                                        "ART_game_re_point": "讓分",
                                    
                                        "ART_game_m": "獨贏",
                                        "ART_game_r": "讓局",
                                        "ART_game_r_point": "讓分",
                                    }
                                    ';
                                    break;
                                default:
                                    $js .= '
                                    var artjson = {
                                        "ART_lang": "CN",
                                        "ART_game_nodata": "目前没有任何赛事。",
                                        "ART_game_mygame1": "选择上面的图标，会将其添加到",
                                        "ART_game_mygame2": "我的赛事",
                                        "ART_game_mygame3": "中。您可以对其进行分组并轻松访问您感兴趣的所有赛事。",
                                    
                                        "ART_game_rm": "独赢",
                                        "ART_game_re": "让局",
                                        "ART_game_re_point": "让分",
                                    
                                        "ART_game_m": "独赢",
                                        "ART_game_r": "让局",
                                        "ART_game_r_point": "让分",
                                    }
                                    ';
                                    break;
                            }
                            break;
                    }
                    break;
                case "sk":
                    switch ($_p["showtype"]){
						case "soon":
						case "hot":
                        case "today":
                        case "early":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_r": "'.$artjson["ART_game_r"].'",
                                "ART_game_ou": "'.$artjson["ART_game_ou"].'", 
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
								"ART_game_rm": "'.$artjson["ART_game_m"].'",
                                "ART_game_re": "'.$artjson["ART_game_r"].'",
                                "ART_game_rou": "'.$artjson["ART_game_ou"].'", 
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                            };
                        ';
                            break;

                        case "live":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            
                                "ART_game_rm": "'.$artjson["ART_game_m"].'",
                                "ART_game_re": "'.$artjson["ART_game_r"].'",
                                "ART_game_rou": "'.$artjson["ART_game_ou"].'", 
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                            };
                        ';
                            break;
                        case "parlay":
                            $js .= '
                            var artjson = {
                                "ART_lang": "'.$artjson["ART_lang"].'",
                                "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                                "ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            
                                "ART_game_rm": "'.$artjson["ART_game_m"].'",
                                "ART_game_re": "'.$artjson["ART_game_r"].'",
                                "ART_game_rou": "'.$artjson["ART_game_ou"].'", 
                                "ART_game_m": "'.$artjson["ART_game_m"].'",
                                "ART_game_r": "'.$artjson["ART_game_r"].'",
                                "ART_game_ou": "'.$artjson["ART_game_ou"].'", 
                                "ART_game_over": "'.$artjson["ART_game_over"].'",
                                "ART_game_under": "'.$artjson["ART_game_under"].'",
                            };
                        ';
                            break;
                        case "mygame":
                            switch ($langx){
                                case "en-us":
                                    $js.='
                                    var artjson = {
                                        "ART_lang": "EN",
                                        "ART_game_nodata": "There are no events available.",
                                        "ART_game_mygame1": "Selecting the above icon, for any event, will add it to the ",
                                        "ART_game_mygame2": "MY EVENTS",
                                        "ART_game_mygame3": " section. Here, you can group and easily access all the events you are interested in.",
                                    
                                        "ART_game_rm": "Money Line",
                                        "ART_game_re": "Handicap",
                                        "ART_game_rou": "Over / Under",
                                    
                                        "ART_game_m": "Money Line",
                                        "ART_game_r": "Handicap",
                                        "ART_game_ou": "Over / Under",
                                    
                                        "ART_game_over": "O",
                                        "ART_game_under": "U",
                                    }
                                    ';
                                    break;
                                case "zh-tw":
                                    $js.= '
                                    var artjson = {
                                        "ART_lang": "TW",
                                        "ART_game_nodata": "目前沒有任何賽事。",
                                        "ART_game_mygame1": "選擇上面的圖標，會將其添加到",
                                        "ART_game_mygame2": "我的賽事",
                                        "ART_game_mygame3": "中。您可以對其進行分組並輕鬆訪問您感興趣的所有賽事。",
                                        "ART_game_3in1": "串",
                                    
                                        "ART_game_rm": "獨贏",
                                        "ART_game_re": "讓局",
                                        "ART_game_rou": "總局數",
                                    
                                        "ART_game_m": "獨贏",
                                        "ART_game_r": "讓局",
                                        "ART_game_ou": "總局數",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                    }
                                    ';
                                    break;
                                default:
                                    $js .= '
                                    var artjson = {
                                        "ART_lang": "CN",
                                        "ART_game_nodata": "目前没有任何赛事。",
                                        "ART_game_mygame1": "选择上面的图标，会将其添加到",
                                        "ART_game_mygame2": "我的赛事",
                                        "ART_game_mygame3": "中。您可以对其进行分组并轻松访问您感兴趣的所有赛事。",
                                    
                                        "ART_game_rm": "独赢",
                                        "ART_game_re": "让局",
                                        "ART_game_rou": "总局数",
                                    
                                        "ART_game_m": "独赢",
                                        "ART_game_r": "让局",
                                        "ART_game_ou": "总局数",
                                    
                                        "ART_game_over": "大",
                                        "ART_game_under": "小",
                                    }
                                    ';
                                    break;
                            }
                            break;
                    }
                    break;

            }
        }

        $js .= "top.ver = '{$ver}';\n";
		
        $js .= "top.game_model = '{$game_model}';\n";
        $fileDir = "tpl/member/{$game_model}.html";
        break;
		
    case "right_score":
        $game_more = strtoupper($_p["gtype"]);
		
		switch ($_p["showtype"]){
			case "live":
			switch ($_p["gtype"]){
			case "es":
                $js .= '
                    var artjson = {
                        "ART_win": "'.$artjson["ART_win"].'",
						
						
						
                    }
                ';
		}
		}
        switch ($_p["gtype"]){
			
            case "ft":
                $js .= '
                    var artjson = {
                        "ART_game_et_ft": "'.$artjson["ART_game_et_ft"].'",
						
						
						
                    }
                ';
            case "bk":
                $js .= '
                    var artjson = {
                        "ART_scrbk_q1": "'.$artjson["ART_scrbk_q1"].'",
                        "ART_scrbk_q2": "'.$artjson["ART_scrbk_q2"].'",
                        "ART_scrbk_q3": "'.$artjson["ART_scrbk_q3"].'",
                        "ART_scrbk_q4": "'.$artjson["ART_scrbk_q4"].'",
                        "ART_scrbk_ot": "'.$artjson["ART_scrbk_ot"].'",
                        "ART_scrbk_h1": "'.$artjson["ART_scrbk_h1"].'",
                        "ART_scrbk_h2": "'.$artjson["ART_scrbk_h2"].'",
                        // 下半场
                        "ART_scrbk_sh2": "'.$artjson["ART_scrbk_h2"].'",
                    
                        "ART_scrbk_sq1": "'.$artjson["ART_scrbk_sq1"].'",
                        "ART_scrbk_sq2": "'.$artjson["ART_scrbk_sq2"].'",
                        "ART_scrbk_sq3": "'.$artjson["ART_scrbk_sq3"].'",
                        "ART_scrbk_sq4": "'.$artjson["ART_scrbk_sq4"].'",
                        "ART_scrbk_sh1": "'.$artjson["ART_scrbk_sh1"].'",
                        "ART_scrbk_sh1": "'.$artjson["ART_scrbk_sh1"].'",
                        "ART_scrbk_sot": "'.$artjson["ART_scrbk_sot"].'",
                    };
                ';
                break;
            case "tn":
                $js .= '
                    var artjson = {
                        "ART_game_stop": "'.$artjson["ART_game_stop"].'",
                        "ART_scrtn_set": "'.$artjson["ART_scrtn_set"].'",
                        "ART_scrtn_tot": "'.$artjson["ART_scrtn_tot"].'",
                        "ART_scrtn_game": "'.$artjson["ART_scrtn_game"].'",
                    }
                ';
                break;
            case "bs":
                $js .= '
                    var artjson = {
                        "ART_scrbs_ot": "'.$artjson["ART_scrbs_ot"].'",
	                    "ART_scrbs_out": "'.$artjson["ART_scrbs_out"].'",
                    }
                ';
                break;
            case "bm":
                $js .= '
                    var artjson = {
                        "ART_game_stop": "'.$artjson["ART_game_stop"].'",
                        "ART_scrbm_set": "'.$artjson["ART_scrbm_set"].'",
                        "ART_scrbm_tot": "'.$artjson["ART_scrbm_tot"].'",
                    }
                ';
                break;
            case "vb":
                $js .= '
                    var artjson = {
                        "ART_game_stop": "'.$artjson["ART_game_stop"].'",
                        "ART_scrvb_set": "'.$artjson["ART_scrvb_set"].'",
                        "ART_scrvb_tot": "'.$artjson["ART_scrvb_tot"].'",
                    }
                ';
                break;
            case "tt":
                $js .= '
                    var artjson = {
                        "ART_game_stop": "'.$artjson["ART_game_stop"].'",
                        "ART_scrtt_tot": "'.$artjson["ART_game_stop"].'",
                        "ART_scrtt_game": "'.$artjson["ART_game_stop"].'",
                    }
                ';
                break;
				
            case "op":
                $js .= '
                    var artjson = {
                        "ART_scrop_time": "'.$artjson["ART_scrop_time"].'",
                    }
                ';
                break;
        }
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/parseHTML.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/xmlNode.js",
            "js/lib/fastTemplate_a1.js",
            "js/game/game_more.js",
            "js/game/game_more_{$game_more}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            "js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/betgenius.js",
            "js/tv/check_agent.js",
        ];
        $fileName = $_p["gtype"]."_right_score";
        $fileDir = "tpl/member/{$fileName}.html";
        break;
    case "game_list_FT":
    case "game_list_BK":
    case "game_list_TN":
    case "game_list_VB":
    case "game_list_BS":
    case "game_list_BM":
    case "game_list_TT":
    case "game_list_SK":
    case "game_list_OP":
	case "game_list_ES":
        $jsAry = [
            "js/lib/ratioChgRule.js",
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/parseHTML.js",
            "js/lib/AD.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/xmlNode.js",
            "js/lib/pagination.js",
            "js/lib/Clusterize.js",
            "js/game/game_list.js",
            "js/game/{$_p["p"]}.js"
			
        ];
        $fileDir = "tpl/game/{$_p["p"]}.html";
        break;
    case "game_list_SP":
        $jsAry = [
            "js/lib/ratioChgRule.js",
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/parseHTML.js",
            "js/lib/AD.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/xmlNode.js",
            "js/lib/pagination.js",
            "js/lib/Clusterize.js",
            "js/game/game_list.js",
            "js/game/game_list_cup.js",
            "js/game/{$_p["p"]}.js"
        ];
        $fileDir = "tpl/game/{$_p["p"]}.html";
        break;
    case "game_more_FT":
        //$js.="top.ver = '{$ver}';\n";
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/ratioChgRule.js",
            "js/lib/xmlNode.js",
            "js/game/game_more.js",
            "js/game/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
          //  "js/tv/script_MT.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/betgenius.js",
            "js/tv/check_agent.js",
        ];
		
		//滚球过关内盘
        switch ($_p["showtype"]){

            case "live":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
                                "ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                        //Score Board
                            "ART_game_et_ft": "全場:&nbsp;",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
							
                            //玩法
                            "ART_game_re": "讓球",
                            "ART_game_rou": "大 / 小",
                            "ART_game_rm": "獨贏",
                            "ART_game_rpd": "波膽",
                            "ART_game_rps": "點球大戰",
                        
                            "ART_game_taru": "5 分鐘盤口: 開場 - 04:59 分鐘 - 大 / 小",
                            "ART_game_tbru": "5 分鐘盤口: 05:00 - 09:59 分鐘 - 大 / 小",
                            "ART_game_tcru": "5 分鐘盤口: 10:00 分鐘 - 半場 - 大 / 小",
                            "ART_game_tdru": "5 分鐘盤口: 下半場開始 - 19:59 分鐘 - 大 / 小",
                            "ART_game_teru": "5 分鐘盤口: 20:00 - 24:59 分鐘 - 大 / 小",
                        
                            "ART_game_are": "15 分鐘盤口: 開場 - 14:59 分鐘 - 讓球",
                            "ART_game_bre": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 讓球",
                            "ART_game_cre": "15 分鐘盤口: 30:00 分鐘 - 半場 - 讓球",
                            "ART_game_dre": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 讓球",
                            "ART_game_ere": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 讓球",
                            "ART_game_fre": "15 分鐘盤口: 75:00 分鐘 - 全場 - 讓球",
                        
                            "ART_game_arou": "15 分鐘盤口: 開場 - 14:59 分鐘 - 大 / 小",
                            "ART_game_brou": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 大 / 小",
                            "ART_game_crou": "15 分鐘盤口: 30:00 分鐘 - 半場 - 大 / 小",
                            "ART_game_drou": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 大 / 小",
                            "ART_game_erou": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 大 / 小",
                            "ART_game_frou": "15 分鐘盤口: 75:00 分鐘 - 全場 - 大 / 小",
                        
                            "ART_game_arm": "15 分鐘盤口: 開場 - 14:59 分鐘 - 獨贏",
                            "ART_game_brm": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 獨贏",
                            "ART_game_crm": "15 分鐘盤口: 30:00 分鐘 - 半場 - 獨贏",
                            "ART_game_drm": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 獨贏",
                            "ART_game_erm": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 獨贏",
                            "ART_game_frm": "15 分鐘盤口: 75:00 分鐘 - 全場 - 獨贏",
                        
                            "ART_game_rt": "總進球數",
                            "ART_game_rts": "雙方球隊進球",
                            "ART_game_rouhc": "球隊進球數:",
                            "ART_game_roe": "單 / 雙",
                        
                            "ART_game_arg": "第一個進球",
                            "ART_game_brg": "第二個進球",
                            "ART_game_crg": "第三個進球",
                            "ART_game_drg": "第四個進球",
                            "ART_game_erg": "第五個進球",
                            "ART_game_frg": "第六個進球",
                            "ART_game_grg": "第七個進球",
                            "ART_game_hrg": "第八個進球",
                            "ART_game_irg": "第九個進球",
                            "ART_game_jrg": "第十個進球",
                            "ART_game_krg": "第十一個進球",
                            "ART_game_lrg": "第十二個進球",
                            "ART_game_mrg": "第十三個進球",
                            "ART_game_nrg": "第十四個進球",
                            "ART_game_org": "第十五個進球",
                        
                            "ART_game_rf": "半場 / 全場",
                            "ART_game_rwm": "凈勝球數",
                            "ART_game_rdc": "雙重機會",
                            "ART_game_rcs": "零失球",
                            "ART_game_rwn": "零失球獲勝",
                            "ART_game_rmou": "獨贏 & 進球 大 / 小",
                            "ART_game_rmts": "獨贏 & 雙方球隊進球",
                            "ART_game_rout": "進球 大 / 小 & 雙方球隊進球",
                            "ART_game_rmpg": "獨贏 & 最先進球",
                        
                            "ART_game_rnc1": "第一個角球",
                            "ART_game_rnc2": "第二個角球",
                            "ART_game_rnc3": "第三個角球",
                            "ART_game_rnc4": "第四個角球",
                            "ART_game_rnc5": "第五個角球",
                            "ART_game_rnc6": "第六個角球",
                            "ART_game_rnc7": "第七個角球",
                            "ART_game_rnc8": "第八個角球",
                            "ART_game_rnc9": "第九個角球",
                            "ART_game_rnca": "第十個角球",
                            "ART_game_rncb": "第十一個角球",
                            "ART_game_rncc": "第十二個角球",
                            "ART_game_rncd": "第十三個角球",
                            "ART_game_rnce": "第十四個角球",
                            "ART_game_rncf": "第十五個角球",
                            "ART_game_rncg": "第十六個角球",
                            "ART_game_rnch": "第十七個角球",
                            "ART_game_rnci": "第十八個角球",
                            "ART_game_rncj": "第十九個角球",
                            "ART_game_rnck": "第二十個角球",
                            "ART_game_rncl": "第二十一個角球",
                            "ART_game_rncm": "第二十二個角球",
                            "ART_game_rncn": "第二十三個角球",
                            "ART_game_rnco": "第二十四個角球",
                            "ART_game_rncp": "第二十五個角球",
                            "ART_game_rncq": "第二十六個角球",
                            "ART_game_rncr": "第二十七個角球",
                            "ART_game_rncs": "第二十八個角球",
                            "ART_game_rnct": "第二十九個角球",
                            "ART_game_rncu": "第三十個角球",
                        
                            "ART_game_rnba": "第一張罰牌",
                            "ART_game_rnbb": "第二張罰牌",
                            "ART_game_rnbc": "第三張罰牌",
                            "ART_game_rnbd": "第四張罰牌",
                            "ART_game_rnbe": "第五張罰牌",
                            "ART_game_rnbf": "第六張罰牌",
                            "ART_game_rnbg": "第七張罰牌",
                            "ART_game_rnbh": "第八張罰牌",
                            "ART_game_rnbi": "第九張罰牌",
                            "ART_game_rnbj": "第十張罰牌",
                            "ART_game_rnbk": "第十一張罰牌",
                            "ART_game_rnbl": "第十二張罰牌",
                            "ART_game_rnbm": "第十三張罰牌",
                            "ART_game_rnbn": "第十四張罰牌",
                            "ART_game_rnbo": "第十五張罰牌",
                        
                            "ART_game_rhg": "最多進球的半場",
                            "ART_game_rmg": "最多進球的半場 - 獨贏",
                            "ART_game_rsb": "雙半場進球",
                            "ART_game_rt3g": "首個進球時間-3項",
                            "ART_game_rt1g": "首個進球時間",
                            "ART_game_rdu": "雙重機會 & 進球 大 / 小",
                            "ART_game_rds": "雙重機會 & 雙方球隊進球",
                            "ART_game_rdg": "雙重機會 & 最先進球",
                            "ART_game_roue": "進球 大 / 小 & 進球 單 / 雙",
                            "ART_game_roup": "進球 大 / 小 & 最先進球",
                            "ART_game_rwe": "贏得任一半場",
                            "ART_game_rwb": "贏得所有半場",
                            "ART_game_rot": "加時賽",
                        
                        
                            "ART_game_rsha": "第一個點球大戰",
                            "ART_game_rshb": "第二個點球大戰",
                            "ART_game_rshc": "第三個點球大戰",
                            "ART_game_rshd": "第四個點球大戰",
                            "ART_game_rshe": "第五個點球大戰",
                            "ART_game_rshf": "第六個點球大戰",
                            "ART_game_rshg": "第七個點球大戰",
                            "ART_game_rshh": "第八個點球大戰",
                            "ART_game_rshi": "第九個點球大戰",
                            "ART_game_rshj": "第十個點球大戰",
                            "ART_game_rshk": "第十一個點球大戰",
                            "ART_game_rshl": "第十二個點球大戰",
                            "ART_game_rshm": "第十三個點球大戰",
                            "ART_game_rshn": "第十四個點球大戰",
                            "ART_game_rsho": "第十五個點球大戰",
                        
                            "ART_game_rpxa": "點球大戰 - 第一回合",
                            "ART_game_rpxb": "點球大戰 - 第二回合",
                            "ART_game_rpxc": "點球大戰 - 第三回合",
                            "ART_game_rpxd": "點球大戰 - 第四回合",
                            "ART_game_rpxe": "點球大戰 - 第五回合",
                            "ART_game_rpxf": "點球大戰 - 第六回合",
                            "ART_game_rpxg": "點球大戰 - 第七回合",
                            "ART_game_rpxh": "點球大戰 - 第八回合",
                            "ART_game_rpxi": "點球大戰 - 第九回合",
                            "ART_game_rpxj": "點球大戰 - 第十回合",
                            "ART_game_rpxk": "點球大戰 - 第十一回合",
                            "ART_game_rpxl": "點球大戰 - 第十二回合",
                            "ART_game_rpxm": "點球大戰 - 第十三回合",
                            "ART_game_rpxn": "點球大戰 - 第十四回合",
                            "ART_game_rpxo": "點球大戰 - 第十五回合",
                            "ART_game_rpf": "點球大戰 - 最後結束回合",
                        
                            "ART_game_o_u": "- 大 / 小",
                            "ART_game_o_e": "- 單 / 雙",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_goal": "進球",
                            "ART_game_nogoal": "無進球",
                            "ART_game_draw": "和局",
                            "ART_game_none": "無",
                            "ART_game_otpoint": "其它比分",
                            "ART_game_7up": "7或以上",
                            "ART_game_3up": "3或以上",
                            "ART_game_rgnogoal": "無進球",
                        
                            "ART_game_rwm1": "凈勝1球",
                            "ART_game_rwm2": "凈勝2球",
                            "ART_game_rwm3": "凈勝3球",
                            "ART_game_rwm4up": "凈勝4球或更多",
                            "ART_game_rwm3up": "凈勝3球或更多",
                            "ART_game_rwm_draw": "任何進球和局",
                            "ART_game_rwm_nogoal": "沒進球",
                        
                            "ART_game_1st_goal": "最先進球",
                        
                            "ART_game_rt3g_b26": "第26分鐘或之前",
                            "ART_game_rt3g_a27": "第27分鐘或之後",
                            "ART_game_rt3g_nogoal": "無進球",
                        
                            "ART_game_rg1g1": "上半場開始 - 14:59分鐘",
                            "ART_game_rg1g2": "15:00 - 29:59分鐘",
                            "ART_game_rg1g3": "30:00分鐘 - 半場",
                            "ART_game_rg1g4": "下半場開始 - 59:59分鐘",
                            "ART_game_rg1g5": "60:00 - 74:59分鐘",
                            "ART_game_rg1g6": "75:00 分鐘  - 全場",
                            "ART_game_rg1gn": "無進球",
                        
                            "ART_game_rpf3": "第三輪",
                            "ART_game_rpf4": "第四輪",
                            "ART_game_rpf5": "第五輪",
                            "ART_game_rpf6": "第六輪或之後",
                        
                        //時節
                            "ART_game_half1": "上半場",
                            "ART_game_half2": "下半場",

                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                        //Score Board
                            "ART_game_et_ft": "Full Time:&nbsp;",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                            //玩法
                            "ART_game_re": "Handicap",
                            "ART_game_rou": "Over / Under",
                            "ART_game_rm": "1 X 2",
                            "ART_game_rpd": "Correct Score",
                            "ART_game_rps": "Penalty Shootout",
                        
                            "ART_game_taru": "5 Minute Markets: Start of ET - 04:59 Mins - Over / Under",
                            "ART_game_tbru": "5 Minute Markets: 05:00 - 09:59 Mins - Over / Under",
                            "ART_game_tcru": "5 Minute Markets: 10:00 - Half Time - Over / Under",
                            "ART_game_tdru": "5 Minute Markets: Start of 2nd Half - 19:59 Mins - Over / Under",
                            "ART_game_teru": "5 Minute Markets: 20:00 - 24:59 Mins - Over / Under",
                        
                            "ART_game_are": "15 Minute Markets: Start of Match - 14:59 Mins - Handicap",
                            "ART_game_bre": "15 Minute Markets: 15:00 - 29:59 Mins - Handicap",
                            "ART_game_cre": "15 Minute Markets: 30:00 Mins - Half Time - Handicap",
                            "ART_game_dre": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - Handicap",
                            "ART_game_ere": "15 Minute Markets: 60:00 - 74:59 Mins - Handicap",
                            "ART_game_fre": "15 Minute Markets: 75:00 Mins - Full Time - Handicap",
                        
                            "ART_game_arou": "15 Minute Markets: Start of Match - 14:59 Mins - Over / Under",
                            "ART_game_brou": "15 Minute Markets: 15:00 - 29:59 Mins - Over / Under",
                            "ART_game_crou": "15 Minute Markets: 30:00 Mins - Half Time - Over / Under",
                            "ART_game_drou": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - Over / Under",
                            "ART_game_erou": "15 Minute Markets: 60:00 - 74:59 Mins - Over / Under",
                            "ART_game_frou": "15 Minute Markets: 75:00 Mins - Full Time - Over / Under",
                        
                            "ART_game_arm": "15 Minute Markets: Start of Match - 14:59 Mins - 1 X 2",
                            "ART_game_brm": "15 Minute Markets: 15:00 - 29:59 Mins - 1 X 2",
                            "ART_game_crm": "15 Minute Markets: 30:00 Mins - Half Time - 1 X 2",
                            "ART_game_drm": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - 1 X 2",
                            "ART_game_erm": "15 Minute Markets: 60:00 - 74:59 Mins - 1 X 2",
                            "ART_game_frm": "15 Minute Markets: 75:00 Mins - Full Time - 1 X 2",
                        
                            "ART_game_rt": "Total Goals",
                            "ART_game_rts": "Both Teams to Score",
                            "ART_game_rouhc": "Team Goals:",
                            "ART_game_roe": "Odd / Even",
                        
                            "ART_game_arg": "1st Goal",
                            "ART_game_brg": "2nd Goal",
                            "ART_game_crg": "3rd Goal",
                            "ART_game_drg": "4th Goal",
                            "ART_game_erg": "5th Goal",
                            "ART_game_frg": "6th Goal",
                            "ART_game_grg": "7th Goal",
                            "ART_game_hrg": "8th Goal",
                            "ART_game_irg": "9th Goal",
                            "ART_game_jrg": "10th Goal",
                            "ART_game_krg": "11th Goal",
                            "ART_game_lrg": "12th Goal",
                            "ART_game_mrg": "13th Goal",
                            "ART_game_nrg": "14th Goal",
                            "ART_game_org": "15th Goal",
                        
                            "ART_game_rf": "Half Time / Full Time",
                            "ART_game_rwm": "Winning Margin",
                            "ART_game_rdc": "Double Chance",
                            "ART_game_rcs": "Clean Sheet",
                            "ART_game_rwn": "To Win to Nil",
                            "ART_game_rmou": "1 X 2 & Goals O / U",
                            "ART_game_rmts": "1 X 2 & Both Teams to Score",
                            "ART_game_rout": "Goals O / U & Both Teams to Score",
                            "ART_game_rmpg": "1 X 2 & 1st Team to Score",
                        
                            "ART_game_rnc1": "1st Corner",
                            "ART_game_rnc2": "2nd Corner",
                            "ART_game_rnc3": "3rd Corner",
                            "ART_game_rnc4": "4th Corner",
                            "ART_game_rnc5": "5th Corner",
                            "ART_game_rnc6": "6th Corner",
                            "ART_game_rnc7": "7th Corner",
                            "ART_game_rnc8": "8th Corner",
                            "ART_game_rnc9": "9th Corner",
                            "ART_game_rnca": "10th Corner",
                            "ART_game_rncb": "11th Corner",
                            "ART_game_rncc": "12th Corner",
                            "ART_game_rncd": "13th Corner",
                            "ART_game_rnce": "14th Corner",
                            "ART_game_rncf": "15th Corner",
                            "ART_game_rncg": "16th Corner",
                            "ART_game_rnch": "17th Corner",
                            "ART_game_rnci": "18th Corner",
                            "ART_game_rncj": "19th Corner",
                            "ART_game_rnck": "20th Corner",
                            "ART_game_rncl": "21st Corner",
                            "ART_game_rncm": "22nd Corner",
                            "ART_game_rncn": "23rd Corner",
                            "ART_game_rnco": "24th Corner",
                            "ART_game_rncp": "25th Corner",
                            "ART_game_rncq": "26th Corner",
                            "ART_game_rncr": "27th Corner",
                            "ART_game_rncs": "28th Corner",
                            "ART_game_rnct": "29th Corner",
                            "ART_game_rncu": "30th Corner",
                        
                            "ART_game_rnba": "1st Booking",
                            "ART_game_rnbb": "2nd Booking",
                            "ART_game_rnbc": "3rd Booking",
                            "ART_game_rnbd": "4th Booking",
                            "ART_game_rnbe": "5th Booking",
                            "ART_game_rnbf": "6th Booking",
                            "ART_game_rnbg": "7th Booking",
                            "ART_game_rnbh": "8th Booking",
                            "ART_game_rnbi": "9th Booking",
                            "ART_game_rnbj": "10th Booking",
                            "ART_game_rnbk": "11th Booking",
                            "ART_game_rnbl": "12th Booking",
                            "ART_game_rnbm": "13th Booking",
                            "ART_game_rnbn": "14th Booking",
                            "ART_game_rnbo": "15th Booking",
                        
                            "ART_game_rhg": "Half with Most Goals",
                            "ART_game_rmg": "Half with Most Goals - 1 X 2",
                            "ART_game_rsb": "To Score in Both Halves",
                            "ART_game_rt3g": "Time of 1st Goal - 3-Way",
                            "ART_game_rt1g": "Time of 1st Goal",
                            "ART_game_rdu": "Double Chance & Goals O / U",
                            "ART_game_rds": "Double Chance & Both Teams to Score",
                            "ART_game_rdg": "Double Chance & 1st Team to Score",
                            "ART_game_roue": "Goals O / U & Goals Odd / Even",
                            "ART_game_roup": "Goals O / U & 1st Team to Score",
                            "ART_game_rwe": "To Win Either Half",
                            "ART_game_rwb": "To Win Both Halves",
                            "ART_game_rot": "Extra Time",
                        
                            "ART_game_rsha": "1st Penalty (Shootout)",
                            "ART_game_rshb": "2nd Penalty (Shootout)",
                            "ART_game_rshc": "3rd Penalty (Shootout)",
                            "ART_game_rshd": "4th Penalty (Shootout)",
                            "ART_game_rshe": "5th Penalty (Shootout)",
                            "ART_game_rshf": "6th Penalty (Shootout)",
                            "ART_game_rshg": "7th Penalty (Shootout)",
                            "ART_game_rshh": "8th Penalty (Shootout)",
                            "ART_game_rshi": "9th Penalty (Shootout)",
                            "ART_game_rshj": "10th Penalty (Shootout)",
                            "ART_game_rshk": "11th Penalty (Shootout)",
                            "ART_game_rshl": "12th Penalty (Shootout)",
                            "ART_game_rshm": "13th Penalty (Shootout)",
                            "ART_game_rshn": "14th Penalty (Shootout)",
                            "ART_game_rsho": "15th Penalty (Shootout)",
                        
                            "ART_game_rpxa": "Penalty Shootout - Round 1",
                            "ART_game_rpxb": "Penalty Shootout - Round 2",
                            "ART_game_rpxc": "Penalty Shootout - Round 3",
                            "ART_game_rpxd": "Penalty Shootout - Round 4",
                            "ART_game_rpxe": "Penalty Shootout - Round 5",
                            "ART_game_rpxf": "Penalty Shootout - Round 6",
                            "ART_game_rpxg": "Penalty Shootout - Round 7",
                            "ART_game_rpxh": "Penalty Shootout - Round 8",
                            "ART_game_rpxi": "Penalty Shootout - Round 9",
                            "ART_game_rpxj": "Penalty Shootout - Round 10",
                            "ART_game_rpxk": "Penalty Shootout - Round 11",
                            "ART_game_rpxl": "Penalty Shootout - Round 12",
                            "ART_game_rpxm": "Penalty Shootout - Round 13",
                            "ART_game_rpxn": "Penalty Shootout - Round 14",
                            "ART_game_rpxo": "Penalty Shootout - Round 15",
                            "ART_game_rpf": "Penalty Shootout - Finishing Round",
                        
                            "ART_game_o_u": "- Over / Under",
                            "ART_game_o_e": "- Odd / Even",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                            "ART_game_yes": "Yes",
                            "ART_game_no": "No",
                            "ART_game_goal": "Goal",
                            "ART_game_nogoal": "No Goal",
                            "ART_game_draw": "Draw",
                            "ART_game_otpoint": "Any Other Score",
                            "ART_game_7up": "7 or More",
                            "ART_game_3up": "3 or More",
                            "ART_game_rgnogoal": "No Goal",
                        
                            "ART_game_rwm1": "Win by 1 Goal",
                            "ART_game_rwm2": "Win by 2 Goals",
                            "ART_game_rwm3": "Win by 3 Goals",
                            "ART_game_rwm4up": "Win by 4 or More Goals",
                            "ART_game_rwm3up": "Win by 3 or More Goals",
                            "ART_game_rwm_draw": "Score Draw",
                            "ART_game_rwm_nogoal": "No Goal",
                        
                            "ART_game_1st_goal": "1st to Score",
                        
                            "ART_game_rt3g_b26": "Up to and including the 26 Minute",
                            "ART_game_rt3g_a27": "27 Minute onwards",
                            "ART_game_rt3g_nogoal": "No Goal",
                        
                            "ART_game_rg1g1": "Start of 1st Half - 14:59 Mins",
                            "ART_game_rg1g2": "15:00 - 29:59 Mins",
                            "ART_game_rg1g3": "30:00 Mins - Half Time",
                            "ART_game_rg1g4": "Start of 2nd Half - 59:59 Mins",
                            "ART_game_rg1g5": "60:00 - 74:59 Mins",
                            "ART_game_rg1g6": "75:00 Mins  - Full Time",
                            "ART_game_rg1gn": "No Goal",
                        
                            "ART_game_rpf3": "3rd Round",
                            "ART_game_rpf4": "4th Round",
                            "ART_game_rpf5": "5th Round",
                            "ART_game_rpf6": "6th Round or Later",
                        
                        //時節
                            "ART_game_half1": "1st Half",
                            "ART_game_half2": "2nd Half",
                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                        //Score Board
                            "ART_game_et_ft": "全场:&nbsp;",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                            //玩法
                            "ART_game_re": "让球",
                            "ART_game_rou": "大 / 小",
                            "ART_game_rm": "独赢",
                            "ART_game_rpd": "波胆",
                            "ART_game_rps": "点球大战",
                        
                            "ART_game_taru": "5 分钟盘口: 开场 - 04:59 分钟 - 大 / 小",
                            "ART_game_tbru": "5 分钟盘口: 05:00 - 09:59 分钟 - 大 / 小",
                            "ART_game_tcru": "5 分钟盘口: 10:00 分钟 - 半场 - 大 / 小",
                            "ART_game_tdru": "5 分钟盘口: 下半场开始 - 19:59 分钟 - 大 / 小",
                            "ART_game_teru": "5 分钟盘口: 20:00 - 24:59 分钟 - 大 / 小",
                        
                            "ART_game_are": "15 分钟盘口: 开场 - 14:59 分钟 - 让球",
                            "ART_game_bre": "15 分钟盘口: 15:00 - 29:59 分钟 - 让球",
                            "ART_game_cre": "15 分钟盘口: 30:00 分钟 - 半场 - 让球",
                            "ART_game_dre": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 让球",
                            "ART_game_ere": "15 分钟盘口: 60:00 - 74:59 分钟 - 让球",
                            "ART_game_fre": "15 分钟盘口: 75:00 分钟 - 全场 - 让球",
                        
                            "ART_game_arou": "15 分钟盘口: 开场 - 14:59 分钟 - 大 / 小",
                            "ART_game_brou": "15 分钟盘口: 15:00 - 29:59 分钟 - 大 / 小",
                            "ART_game_crou": "15 分钟盘口: 30:00 分钟 - 半场 - 大 / 小",
                            "ART_game_drou": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 大 / 小",
                            "ART_game_erou": "15 分钟盘口: 60:00 - 74:59 分钟 - 大 / 小",
                            "ART_game_frou": "15 分钟盘口: 75:00 分钟 - 全场 - 大 / 小",
                        
                            "ART_game_arm": "15 分钟盘口: 开场 - 14:59 分钟 - 独赢",
                            "ART_game_brm": "15 分钟盘口: 15:00 - 29:59 分钟 - 独赢",
                            "ART_game_crm": "15 分钟盘口: 30:00 分钟 - 半场 - 独赢",
                            "ART_game_drm": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 独赢",
                            "ART_game_erm": "15 分钟盘口: 60:00 - 74:59 分钟 - 独赢",
                            "ART_game_frm": "15 分钟盘口: 75:00 分钟 - 全场 - 独赢",
                        
                            "ART_game_rt": "总进球数",
                            "ART_game_rts": "双方球队进球",
                            "ART_game_rouhc": "球队进球数:",
                            "ART_game_roe": "单 / 双",
                        
                            "ART_game_arg": "第一个进球",
                            "ART_game_brg": "第二个进球",
                            "ART_game_crg": "第三个进球",
                            "ART_game_drg": "第四个进球",
                            "ART_game_erg": "第五个进球",
                            "ART_game_frg": "第六个进球",
                            "ART_game_grg": "第七个进球",
                            "ART_game_hrg": "第八个进球",
                            "ART_game_irg": "第九个进球",
                            "ART_game_jrg": "第十个进球",
                            "ART_game_krg": "第十一个进球",
                            "ART_game_lrg": "第十二个进球",
                            "ART_game_mrg": "第十三个进球",
                            "ART_game_nrg": "第十四个进球",
                            "ART_game_org": "第十五个进球",
                        
                            "ART_game_rf": "半场 / 全场",
                            "ART_game_rwm": "净胜球数",
                            "ART_game_rdc": "双重机会",
                            "ART_game_rcs": "零失球",
                            "ART_game_rwn": "零失球获胜",
                            "ART_game_rmou": "独赢 & 进球 大 / 小",
                            "ART_game_rmts": "独赢 & 双方球队进球",
                            "ART_game_rout": "进球 大 / 小 & 双方球队进球",
                            "ART_game_rmpg": "独赢 & 最先进球",
                        
                            "ART_game_rnc1": "第一个角球",
                            "ART_game_rnc2": "第二个角球",
                            "ART_game_rnc3": "第三个角球",
                            "ART_game_rnc4": "第四个角球",
                            "ART_game_rnc5": "第五个角球",
                            "ART_game_rnc6": "第六个角球",
                            "ART_game_rnc7": "第七个角球",
                            "ART_game_rnc8": "第八个角球",
                            "ART_game_rnc9": "第九个角球",
                            "ART_game_rnca": "第十个角球",
                            "ART_game_rncb": "第十一个角球",
                            "ART_game_rncc": "第十二个角球",
                            "ART_game_rncd": "第十三个角球",
                            "ART_game_rnce": "第十四个角球",
                            "ART_game_rncf": "第十五个角球",
                            "ART_game_rncg": "第十六个角球",
                            "ART_game_rnch": "第十七个角球",
                            "ART_game_rnci": "第十八个角球",
                            "ART_game_rncj": "第十九个角球",
                            "ART_game_rnck": "第二十个角球",
                            "ART_game_rncl": "第二十一个角球",
                            "ART_game_rncm": "第二十二个角球",
                            "ART_game_rncn": "第二十三个角球",
                            "ART_game_rnco": "第二十四个角球",
                            "ART_game_rncp": "第二十五个角球",
                            "ART_game_rncq": "第二十六个角球",
                            "ART_game_rncr": "第二十七个角球",
                            "ART_game_rncs": "第二十八个角球",
                            "ART_game_rnct": "第二十九个角球",
                            "ART_game_rncu": "第三十个角球",
                        
                            "ART_game_rnba": "第一张罚牌",
                            "ART_game_rnbb": "第二张罚牌",
                            "ART_game_rnbc": "第三张罚牌",
                            "ART_game_rnbd": "第四张罚牌",
                            "ART_game_rnbe": "第五张罚牌",
                            "ART_game_rnbf": "第六张罚牌",
                            "ART_game_rnbg": "第七张罚牌",
                            "ART_game_rnbh": "第八张罚牌",
                            "ART_game_rnbi": "第九张罚牌",
                            "ART_game_rnbj": "第十张罚牌",
                            "ART_game_rnbk": "第十一张罚牌",
                            "ART_game_rnbl": "第十二张罚牌",
                            "ART_game_rnbm": "第十三张罚牌",
                            "ART_game_rnbn": "第十四张罚牌",
                            "ART_game_rnbo": "第十五张罚牌",
                        
                            "ART_game_rhg": "最多进球的半场",
                            "ART_game_rmg": "最多进球的半场 - 独赢",
                            "ART_game_rsb": "双半场进球",
                            "ART_game_rt3g": "首个进球时间-3项",
                            "ART_game_rt1g": "首个进球时间",
                            "ART_game_rdu": "双重机会 & 进球 大 / 小",
                            "ART_game_rds": "双重机会 & 双方球队进球",
                            "ART_game_rdg": "双重机会 & 最先进球",
                            "ART_game_roue": "进球 大 / 小 & 进球 单 / 双",
                            "ART_game_roup": "进球 大 / 小 & 最先进球",
                            "ART_game_rwe": "赢得任一半场",
                            "ART_game_rwb": "赢得所有半场",
                            "ART_game_rot": "加时赛",
                        
                        
                            "ART_game_rsha": "第一个点球大战",
                            "ART_game_rshb": "第二个点球大战",
                            "ART_game_rshc": "第三个点球大战",
                            "ART_game_rshd": "第四个点球大战",
                            "ART_game_rshe": "第五个点球大战",
                            "ART_game_rshf": "第六个点球大战",
                            "ART_game_rshg": "第七个点球大战",
                            "ART_game_rshh": "第八个点球大战",
                            "ART_game_rshi": "第九个点球大战",
                            "ART_game_rshj": "第十个点球大战",
                            "ART_game_rshk": "第十一个点球大战",
                            "ART_game_rshl": "第十二个点球大战",
                            "ART_game_rshm": "第十三个点球大战",
                            "ART_game_rshn": "第十四个点球大战",
                            "ART_game_rsho": "第十五个点球大战",
                        
                            "ART_game_rpxa": "点球大战 - 第一回合",
                            "ART_game_rpxb": "点球大战 - 第二回合",
                            "ART_game_rpxc": "点球大战 - 第三回合",
                            "ART_game_rpxd": "点球大战 - 第四回合",
                            "ART_game_rpxe": "点球大战 - 第五回合",
                            "ART_game_rpxf": "点球大战 - 第六回合",
                            "ART_game_rpxg": "点球大战 - 第七回合",
                            "ART_game_rpxh": "点球大战 - 第八回合",
                            "ART_game_rpxi": "点球大战 - 第九回合",
                            "ART_game_rpxj": "点球大战 - 第十回合",
                            "ART_game_rpxk": "点球大战 - 第十一回合",
                            "ART_game_rpxl": "点球大战 - 第十二回合",
                            "ART_game_rpxm": "点球大战 - 第十三回合",
                            "ART_game_rpxn": "点球大战 - 第十四回合",
                            "ART_game_rpxo": "点球大战 - 第十五回合",
                            "ART_game_rpf": "点球大战 - 最后结束回合",
                        
                            "ART_game_o_u": "- 大 / 小",
                            "ART_game_o_e": "- 单 / 双",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_goal": "进球",
                            "ART_game_nogoal": "无进球",
                            "ART_game_draw": "和局",
                            "ART_game_none": "无",
                            "ART_game_otpoint": "其它比分",
                            "ART_game_7up": "7或以上",
                            "ART_game_3up": "3或以上",
                            "ART_game_rgnogoal": "无进球",
                        
                            "ART_game_rwm1": "净胜1球",
                            "ART_game_rwm2": "净胜2球",
                            "ART_game_rwm3": "净胜3球",
                            "ART_game_rwm4up": "净胜4球或更多",
                            "ART_game_rwm3up": "净胜3球或更多",
                            "ART_game_rwm_draw": "任何进球和局",
                            "ART_game_rwm_nogoal": "没进球",
                        
                            "ART_game_1st_goal": "最先进球",
                        
                            "ART_game_rt3g_b26": "第26分钟或之前",
                            "ART_game_rt3g_a27": "第27分钟或之后",
                            "ART_game_rt3g_nogoal": "无进球",
                        
                            "ART_game_rg1g1": "上半场开始 - 14:59分钟",
                            "ART_game_rg1g2": "15:00 - 29:59分钟",
                            "ART_game_rg1g3": "30:00分钟 - 半场",
                            "ART_game_rg1g4": "下半场开始 - 59:59分钟",
                            "ART_game_rg1g5": "60:00 - 74:59分钟",
                            "ART_game_rg1g6": "75:00 分钟  - 全场",
                            "ART_game_rg1gn": "无进球",
                        
                            "ART_game_rpf3": "第三轮",
                            "ART_game_rpf4": "第四轮",
                            "ART_game_rpf5": "第五轮",
                            "ART_game_rpf6": "第六轮或之后",
                        
                        //时节
                            "ART_game_half1": "上半场",
                            "ART_game_half2": "下半场",

                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
            default:
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_r": "讓球",
                            "ART_game_ou": "大 / 小",
                            "ART_game_m": "獨贏",
                            "ART_game_pd": "波膽",
                        
                            "ART_game_ar": "15 分鐘盤口: 開場 - 14:59 分鐘 - 讓球",
                            "ART_game_br": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 讓球",
                            "ART_game_cr": "15 分鐘盤口: 30:00 分鐘 - 半場 - 讓球",
                            "ART_game_dr": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 讓球",
                            "ART_game_er": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 讓球",
                            "ART_game_fr": "15 分鐘盤口: 75:00 分鐘 - 全場 - 讓球",
                        
                            "ART_game_aou": "15 分鐘盤口: 開場 - 14:59 分鐘 - 大 / 小",
                            "ART_game_bou": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 大 / 小",
                            "ART_game_cou": "15 分鐘盤口: 30:00 分鐘 - 半場 - 大 / 小",
                            "ART_game_dou": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 大 / 小",
                            "ART_game_eou": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 大 / 小",
                            "ART_game_fou": "15 分鐘盤口: 75:00 分鐘 - 全場 - 大 / 小",
                        
                            "ART_game_am": "15 分鐘盤口: 開場 - 14:59 分鐘 - 獨贏",
                            "ART_game_bm": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 獨贏",
                            "ART_game_cm": "15 分鐘盤口: 30:00 分鐘 - 半場 - 獨贏",
                            "ART_game_dm": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 獨贏",
                            "ART_game_em": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 獨贏",
                            "ART_game_fm": "15 分鐘盤口: 75:00 分鐘 - 全場 - 獨贏",
                        
                            "ART_game_t": "總進球數",
                            "ART_game_ts": "雙方球隊進球",
                            "ART_game_ouhc": "球隊進球數:",
                            "ART_game_eo": "單 / 雙",
                            "ART_game_pg": "最先 / 最後進球",
                        
                            "ART_game_f": "半場 / 全場",
                            "ART_game_wm": "凈勝球數",
                            "ART_game_dc": "雙重機會",
                            "ART_game_mw": "勝出方法",
                            "ART_game_mq": "晉級方法",
                            "ART_game_sfs": "球員進球",
                            "ART_game_cs": "零失球",
                            "ART_game_wn": "零失球獲勝",
                            "ART_game_mou": "獨贏 & 進球 大 / 小",
                            "ART_game_mts": "獨贏 & 雙方球隊進球",
                            "ART_game_out": "進球 大 / 小 & 雙方球隊進球",
                            "ART_game_mpg": "獨贏 & 最先進球",
                            "ART_game_cn": "最先 / 最後角球",
                            "ART_game_cd": "第一張 / 最後一張罰牌",
                            "ART_game_rcd": "紅卡 (球員)",
                            "ART_game_f2g": "先進2球的一方",
                            "ART_game_f3g": "先進3球的一方",
                        
                            "ART_game_hg": "最多進球的半場",
                            "ART_game_mg": "最多進球的半場 - 獨贏",
                            "ART_game_sb": "雙半場進球",
                            "ART_game_fg": "首個進球方式",
                            "ART_game_t3g": "首個進球時間-3項",
                            "ART_game_t1g": "首個進球時間",
                            "ART_game_og": "烏龍球",
                            "ART_game_du": "雙重機會 & 進球 大 / 小",
                            "ART_game_ds": "雙重機會 & 雙方球隊進球",
                            "ART_game_dg": "雙重機會 & 最先進球",
                            "ART_game_oue": "進球 大 / 小 & 進球 單 / 雙",
                            "ART_game_oup": "進球 大 / 小 & 最先進球",
                            "ART_game_w3": "三項讓球投註",
                            "ART_game_bh": "落後反超獲勝",
                            "ART_game_we": "贏得任一半場",
                            "ART_game_wb": "贏得所有半場",
                            "ART_game_tk": "開球球隊",
                            "ART_game_pa": "點球榮獲（除開點球大戰）",
                            "ART_game_ot": "加時賽",
                            "ART_game_st": "最先 / 最後替補",
                            "ART_game_rc": "最先 / 最後任意球",
                            "ART_game_yc": "最先 / 最後界外球",
                            "ART_game_ga": "最先 / 最後球門球",
                            "ART_game_os": "最先 / 最後越位",
                        
                            "ART_game_o_u": "- 大 / 小",
                            "ART_game_o_e": "- 單 / 雙",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_nogoal": "無進球",
                            "ART_game_draw": "和局",
                            "ART_game_otpoint": "其它比分",
                            "ART_game_7up": "7或以上",
                            "ART_game_3up": "3或以上",
                        
                            "ART_game_wm1": "凈勝1球",
                            "ART_game_wm2": "凈勝2球",
                            "ART_game_wm3": "凈勝3球",
                            "ART_game_wm4up": "凈勝4球或更多",
                            "ART_game_wm_draw": "任何進球和局",
                        
                            "ART_game_1st_goal": "最先進球",
                        
                            "ART_game_sfs19": "最先進球",
                            "ART_game_sfs20": "最後進球",
                        
                            "ART_game_90mins": "90分鐘",
                            "ART_game_extime": "加時賽",
                            "ART_game_pktime": "點球大戰",
                            "ART_game_anytime": "任何時間",
                        
                            "ART_game_rt3g_b26": "第26分鐘或之前",
                            "ART_game_rt3g_a27": "第27分鐘或之後",
                            "ART_game_rt3g_nogoal": "無進球",
                        
                            "ART_game_rg1g1": "上半場開始 - 14:59分鐘",
                            "ART_game_rg1g2": "15:00 - 29:59分鐘",
                            "ART_game_rg1g3": "30:00分鐘 - 半場",
                            "ART_game_rg1g4": "下半場開始 - 59:59分鐘",
                            "ART_game_rg1g5": "60:00 - 74:59分鐘",
                            "ART_game_rg1g6": "75:00 分鐘  - 全場",
                            "ART_game_rg1gn": "無進球",
                        
                            "ART_game_fgs": "射門",
                            "ART_game_fgh": "頭球",
                            "ART_game_fgn": "無進球",
                            "ART_game_fgp": "點球",
                            "ART_game_fgf": "自由球",
                            "ART_game_fgo": "烏龍球",
                        
                            "ART_game_1st_pg": "最先進球",
                            "ART_game_last_pg": "最後進球",
                            "ART_game_1st_cn": "最先角球",
                            "ART_game_last_cn": "最後角球",
                            "ART_game_1st_cd": "第一張",
                            "ART_game_last_cd": "最後一張",
                            "ART_game_1st_st": "最先替補",
                            "ART_game_last_st": "最後替補",
                            "ART_game_1st_rc": "最先任意球",
                            "ART_game_last_rc": "最後任意球",
                            "ART_game_1st_yc": "最先界外球",
                            "ART_game_last_yc": "最後界外球",
                            "ART_game_1st_ga": "最先球門球",
                            "ART_game_last_ga": "最後球門球",
                            "ART_game_1st_os": "最先越位",
                            "ART_game_last_os": "最後越位",
                        
                        //時節
                            "ART_game_half1": "上半場",
                            "ART_game_half2": "下半場",
                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_r": "Handicap",
                            "ART_game_ou": "Over / Under",
                            "ART_game_m": "1 X 2",
                            "ART_game_pd": "Correct Score",
                        
                            "ART_game_ar": "15 Minute Markets: Start of Match - 14:59 Mins - Handicap",
                            "ART_game_br": "15 Minute Markets: 15:00 - 29:59 Mins - Handicap",
                            "ART_game_cr": "15 Minute Markets: 30:00 Mins - Half Time - Handicap",
                            "ART_game_dr": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - Handicap",
                            "ART_game_er": "15 Minute Markets: 60:00 - 74:59 Mins - Handicap",
                            "ART_game_fr": "15 Minute Markets: 75:00 Mins - Full Time - Handicap",
                        
                            "ART_game_aou": "15 Minute Markets: Start of Match - 14:59 Mins - Over / Under",
                            "ART_game_bou": "15 Minute Markets: 15:00 - 29:59 Mins - Over / Under",
                            "ART_game_cou": "15 Minute Markets: 30:00 Mins - Half Time - Over / Under",
                            "ART_game_dou": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - Over / Under",
                            "ART_game_eou": "15 Minute Markets: 60:00 - 74:59 Mins - Over / Under",
                            "ART_game_fou": "15 Minute Markets: 75:00 Mins - Full Time - Over / Under",
                        
                            "ART_game_am": "15 Minute Markets: Start of Match - 14:59 Mins - 1 X 2",
                            "ART_game_bm": "15 Minute Markets: 15:00 - 29:59 Mins - 1 X 2",
                            "ART_game_cm": "15 Minute Markets: 30:00 Mins - Half Time - 1 X 2",
                            "ART_game_dm": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - 1 X 2",
                            "ART_game_em": "15 Minute Markets: 60:00 - 74:59 Mins - 1 X 2",
                            "ART_game_fm": "15 Minute Markets: 75:00 Mins - Full Time - 1 X 2",
                        
                            "ART_game_t": "Total Goals",
                            "ART_game_ts": "Both Teams to Score",
                            "ART_game_ouhc": "Team Goals:",
                            "ART_game_eo": "Odd / Even",
                            "ART_game_pg": "First / Last Goal",
                        
                            "ART_game_f": "Half Time / Full Time",
                            "ART_game_wm": "Winning Margin",
                            "ART_game_dc": "Double Chance",
                            "ART_game_mw": "Winning Method",
                            "ART_game_mq": "Qualifying Method",
                            "ART_game_sfs": "Player to Score",
                            "ART_game_cs": "Clean Sheet",
                            "ART_game_wn": "To Win to Nil",
                            "ART_game_mou": "1 X 2 & Goals O / U",
                            "ART_game_mts": "1 X 2 & Both Teams to Score",
                            "ART_game_out": "Goals O / U & Both Teams to Score",
                            "ART_game_mpg": "1 X 2 & 1st Team to Score",
                            "ART_game_cn": "First / Last Corner",
                            "ART_game_cd": "First / Last Booking",
                            "ART_game_rcd": "Red Card (Player)",
                            "ART_game_f2g": "Race to 2 Goals",
                            "ART_game_f3g": "Race to 3 Goals",
                        
                            "ART_game_hg": "Half with Most Goals",
                            "ART_game_mg": "Half with Most Goals - 1 X 2",
                            "ART_game_sb": "To Score in Both Halves",
                            "ART_game_fg": "First Goal Method",
                            "ART_game_t3g": "Time of 1st Goal - 3-Way",
                            "ART_game_t1g": "Time of 1st Goal",
                            "ART_game_og": "Own Goal",
                            "ART_game_du": "Double Chance & Goals O / U",
                            "ART_game_ds": "Double Chance & Both Teams to Score",
                            "ART_game_dg": "Double Chance & 1st Team to Score",
                            "ART_game_oue": "Goals O / U & Goals Odd / Even",
                            "ART_game_oup": "Goals O / U & 1st Team to Score",
                            "ART_game_w3": "3-Way Handicap",
                            "ART_game_bh": "To Win from Behind",
                            "ART_game_we": "To Win Either Half",
                            "ART_game_wb": "To Win Both Halves",
                            "ART_game_tk": "Team to Kick Off",
                            "ART_game_pa": "Penalty Awarded (Excluding Penalty Shootout)",
                            "ART_game_ot": "Extra Time",
                            "ART_game_st": "First / Last Substitution",
                            "ART_game_rc": "First / Last Free Kick",
                            "ART_game_yc": "First / Last Throw In",
                            "ART_game_ga": "First / Last Goal Kick",
                            "ART_game_os": "First / Last Offside",
                        
                            "ART_game_o_u": "- Over / Under",
                            "ART_game_o_e": "- Odd / Even",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                            "ART_game_yes": "Yes",
                            "ART_game_no": "No",
                            "ART_game_goal": "Goal",
                            "ART_game_nogoal": "No Goal",
                            "ART_game_draw": "Draw",
                            "ART_game_otpoint": "Any Other Score",
                            "ART_game_7up": "7 or More",
                            "ART_game_3up": "3 or More",
                        
                            "ART_game_wm1": "Win by 1 Goal",
                            "ART_game_wm2": "Win by 2 Goals",
                            "ART_game_wm3": "Win by 3 Goals",
                            "ART_game_wm4up": "Win by 4 or More Goals",
                            "ART_game_wm_draw": "Score Draw",
                        
                            "ART_game_1st_goal": "1st to Score",
                        
                            "ART_game_sfs19": "1st",
                            "ART_game_sfs20": "Last",
                        
                            "ART_game_90mins": "90 Mins",
                            "ART_game_extime": "Extra Time",
                            "ART_game_pktime": "Penalties",
                            "ART_game_anytime": "Anytime",
                        
                            "ART_game_rt3g_b26": "Up to and including the 26th Minute",
                            "ART_game_rt3g_a27": "27 Minute onwards",
                            "ART_game_rt3g_nogoal": "No Goal",
                        
                            "ART_game_rg1g1": "Start of 1st Half - 14:59 Mins",
                            "ART_game_rg1g2": "15:00 - 29:59 Mins",
                            "ART_game_rg1g3": "30:00 Mins - Half Time",
                            "ART_game_rg1g4": "Start of 2nd Half - 59:59 Mins",
                            "ART_game_rg1g5": "60:00 - 74:59 Mins",
                            "ART_game_rg1g6": "75:00 Mins  - Full Time",
                            "ART_game_rg1gn": "No Goal",
                        
                            "ART_game_fgs": "Shot",
                            "ART_game_fgh": "Header",
                            "ART_game_fgn": "No Goal",
                            "ART_game_fgp": "Penalty",
                            "ART_game_fgf": "Free Kick",
                            "ART_game_fgo": "Own Goal",
                        
                            "ART_game_1st_pg": "First Goal",
                            "ART_game_last_pg": "Last Goal",
                            "ART_game_1st_cn": "First Corner",
                            "ART_game_last_cn": "Last Corner",
                            "ART_game_1st_cd": "First Booking",
                            "ART_game_last_cd": "Last Booking",
                            "ART_game_1st_st": "First Substitution",
                            "ART_game_last_st": "Last Substitution",
                            "ART_game_1st_rc": "First Free Kick",
                            "ART_game_last_rc": "Last Free Kick",
                            "ART_game_1st_yc": "First Throw",
                            "ART_game_last_yc": "Last Throw",
                            "ART_game_1st_ga": "First Goal Kick",
                            "ART_game_last_ga": "Last Goal Kick",
                            "ART_game_1st_os": "First Offside",
                            "ART_game_last_os": "Last Offside",
                        
                        //時節
                            "ART_game_half1": "1st Half",
                            "ART_game_half2": "2nd Half",
                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_r": "让球",
                            "ART_game_ou": "大 / 小",
                            "ART_game_m": "独赢",
                            "ART_game_pd": "波胆",
                        
                            "ART_game_ar": "15 分钟盘口: 开场 - 14:59 分钟 - 让球",
                            "ART_game_br": "15 分钟盘口: 15:00 - 29:59 分钟 - 让球",
                            "ART_game_cr": "15 分钟盘口: 30:00 分钟 - 半场 - 让球",
                            "ART_game_dr": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 让球",
                            "ART_game_er": "15 分钟盘口: 60:00 - 74:59 分钟 - 让球",
                            "ART_game_fr": "15 分钟盘口: 75:00 分钟 - 全场 - 让球",
                        
                            "ART_game_aou": "15 分钟盘口: 开场 - 14:59 分钟 - 大 / 小",
                            "ART_game_bou": "15 分钟盘口: 15:00 - 29:59 分钟 - 大 / 小",
                            "ART_game_cou": "15 分钟盘口: 30:00 分钟 - 半场 - 大 / 小",
                            "ART_game_dou": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 大 / 小",
                            "ART_game_eou": "15 分钟盘口: 60:00 - 74:59 分钟 - 大 / 小",
                            "ART_game_fou": "15 分钟盘口: 75:00 分钟 - 全场 - 大 / 小",
                        
                            "ART_game_am": "15 分钟盘口: 开场 - 14:59 分钟 - 独赢",
                            "ART_game_bm": "15 分钟盘口: 15:00 - 29:59 分钟 - 独赢",
                            "ART_game_cm": "15 分钟盘口: 30:00 分钟 - 半场 - 独赢",
                            "ART_game_dm": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 独赢",
                            "ART_game_em": "15 分钟盘口: 60:00 - 74:59 分钟 - 独赢",
                            "ART_game_fm": "15 分钟盘口: 75:00 分钟 - 全场 - 独赢",
                        
                            "ART_game_t": "总进球数",
                            "ART_game_ts": "双方球队进球",
                            "ART_game_ouhc": "球队进球数:",
                            "ART_game_eo": "单 / 双",
                            "ART_game_pg": "最先 / 最后进球",
                        
                            "ART_game_f": "半场 / 全场",
                            "ART_game_wm": "净胜球数",
                            "ART_game_dc": "双重机会",
                            "ART_game_mw": "胜出方法",
                            "ART_game_mq": "晋级方法",
                            "ART_game_sfs": "球员进球",
                            "ART_game_cs": "零失球",
                            "ART_game_wn": "零失球获胜",
                            "ART_game_mou": "独赢 & 进球 大 / 小",
                            "ART_game_mts": "独赢 & 双方球队进球",
                            "ART_game_out": "进球 大 / 小 & 双方球队进球",
                            "ART_game_mpg": "独赢 & 最先进球",
                            "ART_game_cn": "最先 / 最后角球",
                            "ART_game_cd": "第一张 / 最后一张罚牌",
                            "ART_game_rcd": "红卡 (球员)",
                            "ART_game_f2g": "先进2球的一方",
                            "ART_game_f3g": "先进3球的一方",
                        
                            "ART_game_hg": "最多进球的半场",
                            "ART_game_mg": "最多进球的半场 - 独赢",
                            "ART_game_sb": "双半场进球",
                            "ART_game_fg": "首个进球方式",
                            "ART_game_t3g": "首个进球时间-3项",
                            "ART_game_t1g": "首个进球时间",
                            "ART_game_og": "乌龙球",
                            "ART_game_du": "双重机会 & 进球 大 / 小",
                            "ART_game_ds": "双重机会 & 双方球队进球",
                            "ART_game_dg": "双重机会 & 最先进球",
                            "ART_game_oue": "进球 大 / 小 & 进球 单 / 双",
                            "ART_game_oup": "进球 大 / 小 & 最先进球",
                            "ART_game_w3": "三项让球投注",
                            "ART_game_bh": "落后反超获胜",
                            "ART_game_we": "赢得任一半场",
                            "ART_game_wb": "赢得所有半场",
                            "ART_game_tk": "开球球队",
                            "ART_game_pa": "点球荣获（除开点球大战）",
                            "ART_game_ot": "加时赛",
                            "ART_game_st": "最先 / 最后替补",
                            "ART_game_rc": "最先 / 最后任意球",
                            "ART_game_yc": "最先 / 最后界外球",
                            "ART_game_ga": "最先 / 最后球门球",
                            "ART_game_os": "最先 / 最后越位",
                        
                            "ART_game_o_u": "- 大 / 小",
                            "ART_game_o_e": "- 单 / 双",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_nogoal": "无进球",
                            "ART_game_draw": "和局",
                            "ART_game_otpoint": "其它比分",
                            "ART_game_7up": "7或以上",
                            "ART_game_3up": "3或以上",
                        
                            "ART_game_wm1": "净胜1球",
                            "ART_game_wm2": "净胜2球",
                            "ART_game_wm3": "净胜3球",
                            "ART_game_wm4up": "净胜4球或更多",
                            "ART_game_wm_draw": "任何进球和局",
                        
                            "ART_game_1st_goal": "最先进球",
                        
                            "ART_game_sfs19": "最先进球",
                            "ART_game_sfs20": "最后进球",
                        
                            "ART_game_90mins": "90分钟",
                            "ART_game_extime": "加时赛",
                            "ART_game_pktime": "点球大战",
                            "ART_game_anytime": "任何时间",
                        
                            "ART_game_rt3g_b26": "第26分钟或之前",
                            "ART_game_rt3g_a27": "第27分钟或之后",
                            "ART_game_rt3g_nogoal": "无进球",
                        
                            "ART_game_rg1g1": "上半场开始 - 14:59分钟",
                            "ART_game_rg1g2": "15:00 - 29:59分钟",
                            "ART_game_rg1g3": "30:00分钟 - 半场",
                            "ART_game_rg1g4": "下半场开始 - 59:59分钟",
                            "ART_game_rg1g5": "60:00 - 74:59分钟",
                            "ART_game_rg1g6": "75:00 分钟  - 全场",
                            "ART_game_rg1gn": "无进球",
                        
                            "ART_game_fgs": "射门",
                            "ART_game_fgh": "头球",
                            "ART_game_fgn": "无进球",
                            "ART_game_fgp": "点球",
                            "ART_game_fgf": "自由球",
                            "ART_game_fgo": "乌龙球",
                        
                            "ART_game_1st_pg": "最先进球",
                            "ART_game_last_pg": "最后进球",
                            "ART_game_1st_cn": "最先角球",
                            "ART_game_last_cn": "最后角球",
                            "ART_game_1st_cd": "第一张",
                            "ART_game_last_cd": "最后一张",
                            "ART_game_1st_st": "最先替补",
                            "ART_game_last_st": "最后替补",
                            "ART_game_1st_rc": "最先任意球",
                            "ART_game_last_rc": "最后任意球",
                            "ART_game_1st_yc": "最先界外球",
                            "ART_game_last_yc": "最后界外球",
                            "ART_game_1st_ga": "最先球门球",
                            "ART_game_last_ga": "最后球门球",
                            "ART_game_1st_os": "最先越位",
                            "ART_game_last_os": "最后越位",
                        
                        //时节
                            "ART_game_half1": "上半场",
                            "ART_game_half2": "下半场",
                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
				
				
		
				
        }
		/*综合过关内盘滚球ft*/
  switch ($_p["isRB"] == "Y"){
			case "parlay":
         //   case "live":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
                                "ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                        //Score Board
                            "ART_game_et_ft": "全場:&nbsp;",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
							
                            //玩法
                            "ART_game_re": "讓球",
                            "ART_game_rou": "大 / 小",
                            "ART_game_rm": "獨贏",
                            "ART_game_rpd": "波膽",
                            "ART_game_rps": "點球大戰",
                        
                            "ART_game_taru": "5 分鐘盤口: 開場 - 04:59 分鐘 - 大 / 小",
                            "ART_game_tbru": "5 分鐘盤口: 05:00 - 09:59 分鐘 - 大 / 小",
                            "ART_game_tcru": "5 分鐘盤口: 10:00 分鐘 - 半場 - 大 / 小",
                            "ART_game_tdru": "5 分鐘盤口: 下半場開始 - 19:59 分鐘 - 大 / 小",
                            "ART_game_teru": "5 分鐘盤口: 20:00 - 24:59 分鐘 - 大 / 小",
                        
                            "ART_game_are": "15 分鐘盤口: 開場 - 14:59 分鐘 - 讓球",
                            "ART_game_bre": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 讓球",
                            "ART_game_cre": "15 分鐘盤口: 30:00 分鐘 - 半場 - 讓球",
                            "ART_game_dre": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 讓球",
                            "ART_game_ere": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 讓球",
                            "ART_game_fre": "15 分鐘盤口: 75:00 分鐘 - 全場 - 讓球",
                        
                            "ART_game_arou": "15 分鐘盤口: 開場 - 14:59 分鐘 - 大 / 小",
                            "ART_game_brou": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 大 / 小",
                            "ART_game_crou": "15 分鐘盤口: 30:00 分鐘 - 半場 - 大 / 小",
                            "ART_game_drou": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 大 / 小",
                            "ART_game_erou": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 大 / 小",
                            "ART_game_frou": "15 分鐘盤口: 75:00 分鐘 - 全場 - 大 / 小",
                        
                            "ART_game_arm": "15 分鐘盤口: 開場 - 14:59 分鐘 - 獨贏",
                            "ART_game_brm": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 獨贏",
                            "ART_game_crm": "15 分鐘盤口: 30:00 分鐘 - 半場 - 獨贏",
                            "ART_game_drm": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 獨贏",
                            "ART_game_erm": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 獨贏",
                            "ART_game_frm": "15 分鐘盤口: 75:00 分鐘 - 全場 - 獨贏",
                        
                            "ART_game_rt": "總進球數",
                            "ART_game_rts": "雙方球隊進球",
                            "ART_game_rouhc": "球隊進球數:",
                            "ART_game_roe": "單 / 雙",
                        
                            "ART_game_arg": "第一個進球",
                            "ART_game_brg": "第二個進球",
                            "ART_game_crg": "第三個進球",
                            "ART_game_drg": "第四個進球",
                            "ART_game_erg": "第五個進球",
                            "ART_game_frg": "第六個進球",
                            "ART_game_grg": "第七個進球",
                            "ART_game_hrg": "第八個進球",
                            "ART_game_irg": "第九個進球",
                            "ART_game_jrg": "第十個進球",
                            "ART_game_krg": "第十一個進球",
                            "ART_game_lrg": "第十二個進球",
                            "ART_game_mrg": "第十三個進球",
                            "ART_game_nrg": "第十四個進球",
                            "ART_game_org": "第十五個進球",
                        
                            "ART_game_rf": "半場 / 全場",
                            "ART_game_rwm": "凈勝球數",
                            "ART_game_rdc": "雙重機會",
                            "ART_game_rcs": "零失球",
                            "ART_game_rwn": "零失球獲勝",
                            "ART_game_rmou": "獨贏 & 進球 大 / 小",
                            "ART_game_rmts": "獨贏 & 雙方球隊進球",
                            "ART_game_rout": "進球 大 / 小 & 雙方球隊進球",
                            "ART_game_rmpg": "獨贏 & 最先進球",
                        
                            "ART_game_rnc1": "第一個角球",
                            "ART_game_rnc2": "第二個角球",
                            "ART_game_rnc3": "第三個角球",
                            "ART_game_rnc4": "第四個角球",
                            "ART_game_rnc5": "第五個角球",
                            "ART_game_rnc6": "第六個角球",
                            "ART_game_rnc7": "第七個角球",
                            "ART_game_rnc8": "第八個角球",
                            "ART_game_rnc9": "第九個角球",
                            "ART_game_rnca": "第十個角球",
                            "ART_game_rncb": "第十一個角球",
                            "ART_game_rncc": "第十二個角球",
                            "ART_game_rncd": "第十三個角球",
                            "ART_game_rnce": "第十四個角球",
                            "ART_game_rncf": "第十五個角球",
                            "ART_game_rncg": "第十六個角球",
                            "ART_game_rnch": "第十七個角球",
                            "ART_game_rnci": "第十八個角球",
                            "ART_game_rncj": "第十九個角球",
                            "ART_game_rnck": "第二十個角球",
                            "ART_game_rncl": "第二十一個角球",
                            "ART_game_rncm": "第二十二個角球",
                            "ART_game_rncn": "第二十三個角球",
                            "ART_game_rnco": "第二十四個角球",
                            "ART_game_rncp": "第二十五個角球",
                            "ART_game_rncq": "第二十六個角球",
                            "ART_game_rncr": "第二十七個角球",
                            "ART_game_rncs": "第二十八個角球",
                            "ART_game_rnct": "第二十九個角球",
                            "ART_game_rncu": "第三十個角球",
                        
                            "ART_game_rnba": "第一張罰牌",
                            "ART_game_rnbb": "第二張罰牌",
                            "ART_game_rnbc": "第三張罰牌",
                            "ART_game_rnbd": "第四張罰牌",
                            "ART_game_rnbe": "第五張罰牌",
                            "ART_game_rnbf": "第六張罰牌",
                            "ART_game_rnbg": "第七張罰牌",
                            "ART_game_rnbh": "第八張罰牌",
                            "ART_game_rnbi": "第九張罰牌",
                            "ART_game_rnbj": "第十張罰牌",
                            "ART_game_rnbk": "第十一張罰牌",
                            "ART_game_rnbl": "第十二張罰牌",
                            "ART_game_rnbm": "第十三張罰牌",
                            "ART_game_rnbn": "第十四張罰牌",
                            "ART_game_rnbo": "第十五張罰牌",
                        
                            "ART_game_rhg": "最多進球的半場",
                            "ART_game_rmg": "最多進球的半場 - 獨贏",
                            "ART_game_rsb": "雙半場進球",
                            "ART_game_rt3g": "首個進球時間-3項",
                            "ART_game_rt1g": "首個進球時間",
                            "ART_game_rdu": "雙重機會 & 進球 大 / 小",
                            "ART_game_rds": "雙重機會 & 雙方球隊進球",
                            "ART_game_rdg": "雙重機會 & 最先進球",
                            "ART_game_roue": "進球 大 / 小 & 進球 單 / 雙",
                            "ART_game_roup": "進球 大 / 小 & 最先進球",
                            "ART_game_rwe": "贏得任一半場",
                            "ART_game_rwb": "贏得所有半場",
                            "ART_game_rot": "加時賽",
                        
                        
                            "ART_game_rsha": "第一個點球大戰",
                            "ART_game_rshb": "第二個點球大戰",
                            "ART_game_rshc": "第三個點球大戰",
                            "ART_game_rshd": "第四個點球大戰",
                            "ART_game_rshe": "第五個點球大戰",
                            "ART_game_rshf": "第六個點球大戰",
                            "ART_game_rshg": "第七個點球大戰",
                            "ART_game_rshh": "第八個點球大戰",
                            "ART_game_rshi": "第九個點球大戰",
                            "ART_game_rshj": "第十個點球大戰",
                            "ART_game_rshk": "第十一個點球大戰",
                            "ART_game_rshl": "第十二個點球大戰",
                            "ART_game_rshm": "第十三個點球大戰",
                            "ART_game_rshn": "第十四個點球大戰",
                            "ART_game_rsho": "第十五個點球大戰",
                        
                            "ART_game_rpxa": "點球大戰 - 第一回合",
                            "ART_game_rpxb": "點球大戰 - 第二回合",
                            "ART_game_rpxc": "點球大戰 - 第三回合",
                            "ART_game_rpxd": "點球大戰 - 第四回合",
                            "ART_game_rpxe": "點球大戰 - 第五回合",
                            "ART_game_rpxf": "點球大戰 - 第六回合",
                            "ART_game_rpxg": "點球大戰 - 第七回合",
                            "ART_game_rpxh": "點球大戰 - 第八回合",
                            "ART_game_rpxi": "點球大戰 - 第九回合",
                            "ART_game_rpxj": "點球大戰 - 第十回合",
                            "ART_game_rpxk": "點球大戰 - 第十一回合",
                            "ART_game_rpxl": "點球大戰 - 第十二回合",
                            "ART_game_rpxm": "點球大戰 - 第十三回合",
                            "ART_game_rpxn": "點球大戰 - 第十四回合",
                            "ART_game_rpxo": "點球大戰 - 第十五回合",
                            "ART_game_rpf": "點球大戰 - 最後結束回合",
                        
                            "ART_game_o_u": "- 大 / 小",
                            "ART_game_o_e": "- 單 / 雙",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_goal": "進球",
                            "ART_game_nogoal": "無進球",
                            "ART_game_draw": "和局",
                            "ART_game_none": "無",
                            "ART_game_otpoint": "其它比分",
                            "ART_game_7up": "7或以上",
                            "ART_game_3up": "3或以上",
                            "ART_game_rgnogoal": "無進球",
                        
                            "ART_game_rwm1": "凈勝1球",
                            "ART_game_rwm2": "凈勝2球",
                            "ART_game_rwm3": "凈勝3球",
                            "ART_game_rwm4up": "凈勝4球或更多",
                            "ART_game_rwm3up": "凈勝3球或更多",
                            "ART_game_rwm_draw": "任何進球和局",
                            "ART_game_rwm_nogoal": "沒進球",
                        
                            "ART_game_1st_goal": "最先進球",
                        
                            "ART_game_rt3g_b26": "第26分鐘或之前",
                            "ART_game_rt3g_a27": "第27分鐘或之後",
                            "ART_game_rt3g_nogoal": "無進球",
                        
                            "ART_game_rg1g1": "上半場開始 - 14:59分鐘",
                            "ART_game_rg1g2": "15:00 - 29:59分鐘",
                            "ART_game_rg1g3": "30:00分鐘 - 半場",
                            "ART_game_rg1g4": "下半場開始 - 59:59分鐘",
                            "ART_game_rg1g5": "60:00 - 74:59分鐘",
                            "ART_game_rg1g6": "75:00 分鐘  - 全場",
                            "ART_game_rg1gn": "無進球",
                        
                            "ART_game_rpf3": "第三輪",
                            "ART_game_rpf4": "第四輪",
                            "ART_game_rpf5": "第五輪",
                            "ART_game_rpf6": "第六輪或之後",
                        
                        //時節
                            "ART_game_half1": "上半場",
                            "ART_game_half2": "下半場",

                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                        //Score Board
                            "ART_game_et_ft": "Full Time:&nbsp;",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                            //玩法
                            "ART_game_re": "Handicap",
                            "ART_game_rou": "Over / Under",
                            "ART_game_rm": "1 X 2",
                            "ART_game_rpd": "Correct Score",
                            "ART_game_rps": "Penalty Shootout",
                        
                            "ART_game_taru": "5 Minute Markets: Start of ET - 04:59 Mins - Over / Under",
                            "ART_game_tbru": "5 Minute Markets: 05:00 - 09:59 Mins - Over / Under",
                            "ART_game_tcru": "5 Minute Markets: 10:00 - Half Time - Over / Under",
                            "ART_game_tdru": "5 Minute Markets: Start of 2nd Half - 19:59 Mins - Over / Under",
                            "ART_game_teru": "5 Minute Markets: 20:00 - 24:59 Mins - Over / Under",
                        
                            "ART_game_are": "15 Minute Markets: Start of Match - 14:59 Mins - Handicap",
                            "ART_game_bre": "15 Minute Markets: 15:00 - 29:59 Mins - Handicap",
                            "ART_game_cre": "15 Minute Markets: 30:00 Mins - Half Time - Handicap",
                            "ART_game_dre": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - Handicap",
                            "ART_game_ere": "15 Minute Markets: 60:00 - 74:59 Mins - Handicap",
                            "ART_game_fre": "15 Minute Markets: 75:00 Mins - Full Time - Handicap",
                        
                            "ART_game_arou": "15 Minute Markets: Start of Match - 14:59 Mins - Over / Under",
                            "ART_game_brou": "15 Minute Markets: 15:00 - 29:59 Mins - Over / Under",
                            "ART_game_crou": "15 Minute Markets: 30:00 Mins - Half Time - Over / Under",
                            "ART_game_drou": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - Over / Under",
                            "ART_game_erou": "15 Minute Markets: 60:00 - 74:59 Mins - Over / Under",
                            "ART_game_frou": "15 Minute Markets: 75:00 Mins - Full Time - Over / Under",
                        
                            "ART_game_arm": "15 Minute Markets: Start of Match - 14:59 Mins - 1 X 2",
                            "ART_game_brm": "15 Minute Markets: 15:00 - 29:59 Mins - 1 X 2",
                            "ART_game_crm": "15 Minute Markets: 30:00 Mins - Half Time - 1 X 2",
                            "ART_game_drm": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - 1 X 2",
                            "ART_game_erm": "15 Minute Markets: 60:00 - 74:59 Mins - 1 X 2",
                            "ART_game_frm": "15 Minute Markets: 75:00 Mins - Full Time - 1 X 2",
                        
                            "ART_game_rt": "Total Goals",
                            "ART_game_rts": "Both Teams to Score",
                            "ART_game_rouhc": "Team Goals:",
                            "ART_game_roe": "Odd / Even",
                        
                            "ART_game_arg": "1st Goal",
                            "ART_game_brg": "2nd Goal",
                            "ART_game_crg": "3rd Goal",
                            "ART_game_drg": "4th Goal",
                            "ART_game_erg": "5th Goal",
                            "ART_game_frg": "6th Goal",
                            "ART_game_grg": "7th Goal",
                            "ART_game_hrg": "8th Goal",
                            "ART_game_irg": "9th Goal",
                            "ART_game_jrg": "10th Goal",
                            "ART_game_krg": "11th Goal",
                            "ART_game_lrg": "12th Goal",
                            "ART_game_mrg": "13th Goal",
                            "ART_game_nrg": "14th Goal",
                            "ART_game_org": "15th Goal",
                        
                            "ART_game_rf": "Half Time / Full Time",
                            "ART_game_rwm": "Winning Margin",
                            "ART_game_rdc": "Double Chance",
                            "ART_game_rcs": "Clean Sheet",
                            "ART_game_rwn": "To Win to Nil",
                            "ART_game_rmou": "1 X 2 & Goals O / U",
                            "ART_game_rmts": "1 X 2 & Both Teams to Score",
                            "ART_game_rout": "Goals O / U & Both Teams to Score",
                            "ART_game_rmpg": "1 X 2 & 1st Team to Score",
                        
                            "ART_game_rnc1": "1st Corner",
                            "ART_game_rnc2": "2nd Corner",
                            "ART_game_rnc3": "3rd Corner",
                            "ART_game_rnc4": "4th Corner",
                            "ART_game_rnc5": "5th Corner",
                            "ART_game_rnc6": "6th Corner",
                            "ART_game_rnc7": "7th Corner",
                            "ART_game_rnc8": "8th Corner",
                            "ART_game_rnc9": "9th Corner",
                            "ART_game_rnca": "10th Corner",
                            "ART_game_rncb": "11th Corner",
                            "ART_game_rncc": "12th Corner",
                            "ART_game_rncd": "13th Corner",
                            "ART_game_rnce": "14th Corner",
                            "ART_game_rncf": "15th Corner",
                            "ART_game_rncg": "16th Corner",
                            "ART_game_rnch": "17th Corner",
                            "ART_game_rnci": "18th Corner",
                            "ART_game_rncj": "19th Corner",
                            "ART_game_rnck": "20th Corner",
                            "ART_game_rncl": "21st Corner",
                            "ART_game_rncm": "22nd Corner",
                            "ART_game_rncn": "23rd Corner",
                            "ART_game_rnco": "24th Corner",
                            "ART_game_rncp": "25th Corner",
                            "ART_game_rncq": "26th Corner",
                            "ART_game_rncr": "27th Corner",
                            "ART_game_rncs": "28th Corner",
                            "ART_game_rnct": "29th Corner",
                            "ART_game_rncu": "30th Corner",
                        
                            "ART_game_rnba": "1st Booking",
                            "ART_game_rnbb": "2nd Booking",
                            "ART_game_rnbc": "3rd Booking",
                            "ART_game_rnbd": "4th Booking",
                            "ART_game_rnbe": "5th Booking",
                            "ART_game_rnbf": "6th Booking",
                            "ART_game_rnbg": "7th Booking",
                            "ART_game_rnbh": "8th Booking",
                            "ART_game_rnbi": "9th Booking",
                            "ART_game_rnbj": "10th Booking",
                            "ART_game_rnbk": "11th Booking",
                            "ART_game_rnbl": "12th Booking",
                            "ART_game_rnbm": "13th Booking",
                            "ART_game_rnbn": "14th Booking",
                            "ART_game_rnbo": "15th Booking",
                        
                            "ART_game_rhg": "Half with Most Goals",
                            "ART_game_rmg": "Half with Most Goals - 1 X 2",
                            "ART_game_rsb": "To Score in Both Halves",
                            "ART_game_rt3g": "Time of 1st Goal - 3-Way",
                            "ART_game_rt1g": "Time of 1st Goal",
                            "ART_game_rdu": "Double Chance & Goals O / U",
                            "ART_game_rds": "Double Chance & Both Teams to Score",
                            "ART_game_rdg": "Double Chance & 1st Team to Score",
                            "ART_game_roue": "Goals O / U & Goals Odd / Even",
                            "ART_game_roup": "Goals O / U & 1st Team to Score",
                            "ART_game_rwe": "To Win Either Half",
                            "ART_game_rwb": "To Win Both Halves",
                            "ART_game_rot": "Extra Time",
                        
                            "ART_game_rsha": "1st Penalty (Shootout)",
                            "ART_game_rshb": "2nd Penalty (Shootout)",
                            "ART_game_rshc": "3rd Penalty (Shootout)",
                            "ART_game_rshd": "4th Penalty (Shootout)",
                            "ART_game_rshe": "5th Penalty (Shootout)",
                            "ART_game_rshf": "6th Penalty (Shootout)",
                            "ART_game_rshg": "7th Penalty (Shootout)",
                            "ART_game_rshh": "8th Penalty (Shootout)",
                            "ART_game_rshi": "9th Penalty (Shootout)",
                            "ART_game_rshj": "10th Penalty (Shootout)",
                            "ART_game_rshk": "11th Penalty (Shootout)",
                            "ART_game_rshl": "12th Penalty (Shootout)",
                            "ART_game_rshm": "13th Penalty (Shootout)",
                            "ART_game_rshn": "14th Penalty (Shootout)",
                            "ART_game_rsho": "15th Penalty (Shootout)",
                        
                            "ART_game_rpxa": "Penalty Shootout - Round 1",
                            "ART_game_rpxb": "Penalty Shootout - Round 2",
                            "ART_game_rpxc": "Penalty Shootout - Round 3",
                            "ART_game_rpxd": "Penalty Shootout - Round 4",
                            "ART_game_rpxe": "Penalty Shootout - Round 5",
                            "ART_game_rpxf": "Penalty Shootout - Round 6",
                            "ART_game_rpxg": "Penalty Shootout - Round 7",
                            "ART_game_rpxh": "Penalty Shootout - Round 8",
                            "ART_game_rpxi": "Penalty Shootout - Round 9",
                            "ART_game_rpxj": "Penalty Shootout - Round 10",
                            "ART_game_rpxk": "Penalty Shootout - Round 11",
                            "ART_game_rpxl": "Penalty Shootout - Round 12",
                            "ART_game_rpxm": "Penalty Shootout - Round 13",
                            "ART_game_rpxn": "Penalty Shootout - Round 14",
                            "ART_game_rpxo": "Penalty Shootout - Round 15",
                            "ART_game_rpf": "Penalty Shootout - Finishing Round",
                        
                            "ART_game_o_u": "- Over / Under",
                            "ART_game_o_e": "- Odd / Even",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                            "ART_game_yes": "Yes",
                            "ART_game_no": "No",
                            "ART_game_goal": "Goal",
                            "ART_game_nogoal": "No Goal",
                            "ART_game_draw": "Draw",
                            "ART_game_otpoint": "Any Other Score",
                            "ART_game_7up": "7 or More",
                            "ART_game_3up": "3 or More",
                            "ART_game_rgnogoal": "No Goal",
                        
                            "ART_game_rwm1": "Win by 1 Goal",
                            "ART_game_rwm2": "Win by 2 Goals",
                            "ART_game_rwm3": "Win by 3 Goals",
                            "ART_game_rwm4up": "Win by 4 or More Goals",
                            "ART_game_rwm3up": "Win by 3 or More Goals",
                            "ART_game_rwm_draw": "Score Draw",
                            "ART_game_rwm_nogoal": "No Goal",
                        
                            "ART_game_1st_goal": "1st to Score",
                        
                            "ART_game_rt3g_b26": "Up to and including the 26 Minute",
                            "ART_game_rt3g_a27": "27 Minute onwards",
                            "ART_game_rt3g_nogoal": "No Goal",
                        
                            "ART_game_rg1g1": "Start of 1st Half - 14:59 Mins",
                            "ART_game_rg1g2": "15:00 - 29:59 Mins",
                            "ART_game_rg1g3": "30:00 Mins - Half Time",
                            "ART_game_rg1g4": "Start of 2nd Half - 59:59 Mins",
                            "ART_game_rg1g5": "60:00 - 74:59 Mins",
                            "ART_game_rg1g6": "75:00 Mins  - Full Time",
                            "ART_game_rg1gn": "No Goal",
                        
                            "ART_game_rpf3": "3rd Round",
                            "ART_game_rpf4": "4th Round",
                            "ART_game_rpf5": "5th Round",
                            "ART_game_rpf6": "6th Round or Later",
                        
                        //時節
                            "ART_game_half1": "1st Half",
                            "ART_game_half2": "2nd Half",
                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                        //Score Board
                            "ART_game_et_ft": "全场:&nbsp;",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                            //玩法
                            "ART_game_re": "让球",
                            "ART_game_rou": "大 / 小",
                            "ART_game_rm": "独赢",
                            "ART_game_rpd": "波胆",
                            "ART_game_rps": "点球大战",
                        
                            "ART_game_taru": "5 分钟盘口: 开场 - 04:59 分钟 - 大 / 小",
                            "ART_game_tbru": "5 分钟盘口: 05:00 - 09:59 分钟 - 大 / 小",
                            "ART_game_tcru": "5 分钟盘口: 10:00 分钟 - 半场 - 大 / 小",
                            "ART_game_tdru": "5 分钟盘口: 下半场开始 - 19:59 分钟 - 大 / 小",
                            "ART_game_teru": "5 分钟盘口: 20:00 - 24:59 分钟 - 大 / 小",
                        
                            "ART_game_are": "15 分钟盘口: 开场 - 14:59 分钟 - 让球",
                            "ART_game_bre": "15 分钟盘口: 15:00 - 29:59 分钟 - 让球",
                            "ART_game_cre": "15 分钟盘口: 30:00 分钟 - 半场 - 让球",
                            "ART_game_dre": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 让球",
                            "ART_game_ere": "15 分钟盘口: 60:00 - 74:59 分钟 - 让球",
                            "ART_game_fre": "15 分钟盘口: 75:00 分钟 - 全场 - 让球",
                        
                            "ART_game_arou": "15 分钟盘口: 开场 - 14:59 分钟 - 大 / 小",
                            "ART_game_brou": "15 分钟盘口: 15:00 - 29:59 分钟 - 大 / 小",
                            "ART_game_crou": "15 分钟盘口: 30:00 分钟 - 半场 - 大 / 小",
                            "ART_game_drou": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 大 / 小",
                            "ART_game_erou": "15 分钟盘口: 60:00 - 74:59 分钟 - 大 / 小",
                            "ART_game_frou": "15 分钟盘口: 75:00 分钟 - 全场 - 大 / 小",
                        
                            "ART_game_arm": "15 分钟盘口: 开场 - 14:59 分钟 - 独赢",
                            "ART_game_brm": "15 分钟盘口: 15:00 - 29:59 分钟 - 独赢",
                            "ART_game_crm": "15 分钟盘口: 30:00 分钟 - 半场 - 独赢",
                            "ART_game_drm": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 独赢",
                            "ART_game_erm": "15 分钟盘口: 60:00 - 74:59 分钟 - 独赢",
                            "ART_game_frm": "15 分钟盘口: 75:00 分钟 - 全场 - 独赢",
                        
                            "ART_game_rt": "总进球数",
                            "ART_game_rts": "双方球队进球",
                            "ART_game_rouhc": "球队进球数:",
                            "ART_game_roe": "单 / 双",
                        
                            "ART_game_arg": "第一个进球",
                            "ART_game_brg": "第二个进球",
                            "ART_game_crg": "第三个进球",
                            "ART_game_drg": "第四个进球",
                            "ART_game_erg": "第五个进球",
                            "ART_game_frg": "第六个进球",
                            "ART_game_grg": "第七个进球",
                            "ART_game_hrg": "第八个进球",
                            "ART_game_irg": "第九个进球",
                            "ART_game_jrg": "第十个进球",
                            "ART_game_krg": "第十一个进球",
                            "ART_game_lrg": "第十二个进球",
                            "ART_game_mrg": "第十三个进球",
                            "ART_game_nrg": "第十四个进球",
                            "ART_game_org": "第十五个进球",
                        
                            "ART_game_rf": "半场 / 全场",
                            "ART_game_rwm": "净胜球数",
                            "ART_game_rdc": "双重机会",
                            "ART_game_rcs": "零失球",
                            "ART_game_rwn": "零失球获胜",
                            "ART_game_rmou": "独赢 & 进球 大 / 小",
                            "ART_game_rmts": "独赢 & 双方球队进球",
                            "ART_game_rout": "进球 大 / 小 & 双方球队进球",
                            "ART_game_rmpg": "独赢 & 最先进球",
                        
                            "ART_game_rnc1": "第一个角球",
                            "ART_game_rnc2": "第二个角球",
                            "ART_game_rnc3": "第三个角球",
                            "ART_game_rnc4": "第四个角球",
                            "ART_game_rnc5": "第五个角球",
                            "ART_game_rnc6": "第六个角球",
                            "ART_game_rnc7": "第七个角球",
                            "ART_game_rnc8": "第八个角球",
                            "ART_game_rnc9": "第九个角球",
                            "ART_game_rnca": "第十个角球",
                            "ART_game_rncb": "第十一个角球",
                            "ART_game_rncc": "第十二个角球",
                            "ART_game_rncd": "第十三个角球",
                            "ART_game_rnce": "第十四个角球",
                            "ART_game_rncf": "第十五个角球",
                            "ART_game_rncg": "第十六个角球",
                            "ART_game_rnch": "第十七个角球",
                            "ART_game_rnci": "第十八个角球",
                            "ART_game_rncj": "第十九个角球",
                            "ART_game_rnck": "第二十个角球",
                            "ART_game_rncl": "第二十一个角球",
                            "ART_game_rncm": "第二十二个角球",
                            "ART_game_rncn": "第二十三个角球",
                            "ART_game_rnco": "第二十四个角球",
                            "ART_game_rncp": "第二十五个角球",
                            "ART_game_rncq": "第二十六个角球",
                            "ART_game_rncr": "第二十七个角球",
                            "ART_game_rncs": "第二十八个角球",
                            "ART_game_rnct": "第二十九个角球",
                            "ART_game_rncu": "第三十个角球",
                        
                            "ART_game_rnba": "第一张罚牌",
                            "ART_game_rnbb": "第二张罚牌",
                            "ART_game_rnbc": "第三张罚牌",
                            "ART_game_rnbd": "第四张罚牌",
                            "ART_game_rnbe": "第五张罚牌",
                            "ART_game_rnbf": "第六张罚牌",
                            "ART_game_rnbg": "第七张罚牌",
                            "ART_game_rnbh": "第八张罚牌",
                            "ART_game_rnbi": "第九张罚牌",
                            "ART_game_rnbj": "第十张罚牌",
                            "ART_game_rnbk": "第十一张罚牌",
                            "ART_game_rnbl": "第十二张罚牌",
                            "ART_game_rnbm": "第十三张罚牌",
                            "ART_game_rnbn": "第十四张罚牌",
                            "ART_game_rnbo": "第十五张罚牌",
                        
                            "ART_game_rhg": "最多进球的半场",
                            "ART_game_rmg": "最多进球的半场 - 独赢",
                            "ART_game_rsb": "双半场进球",
                            "ART_game_rt3g": "首个进球时间-3项",
                            "ART_game_rt1g": "首个进球时间",
                            "ART_game_rdu": "双重机会 & 进球 大 / 小",
                            "ART_game_rds": "双重机会 & 双方球队进球",
                            "ART_game_rdg": "双重机会 & 最先进球",
                            "ART_game_roue": "进球 大 / 小 & 进球 单 / 双",
                            "ART_game_roup": "进球 大 / 小 & 最先进球",
                            "ART_game_rwe": "赢得任一半场",
                            "ART_game_rwb": "赢得所有半场",
                            "ART_game_rot": "加时赛",
                        
                        
                            "ART_game_rsha": "第一个点球大战",
                            "ART_game_rshb": "第二个点球大战",
                            "ART_game_rshc": "第三个点球大战",
                            "ART_game_rshd": "第四个点球大战",
                            "ART_game_rshe": "第五个点球大战",
                            "ART_game_rshf": "第六个点球大战",
                            "ART_game_rshg": "第七个点球大战",
                            "ART_game_rshh": "第八个点球大战",
                            "ART_game_rshi": "第九个点球大战",
                            "ART_game_rshj": "第十个点球大战",
                            "ART_game_rshk": "第十一个点球大战",
                            "ART_game_rshl": "第十二个点球大战",
                            "ART_game_rshm": "第十三个点球大战",
                            "ART_game_rshn": "第十四个点球大战",
                            "ART_game_rsho": "第十五个点球大战",
                        
                            "ART_game_rpxa": "点球大战 - 第一回合",
                            "ART_game_rpxb": "点球大战 - 第二回合",
                            "ART_game_rpxc": "点球大战 - 第三回合",
                            "ART_game_rpxd": "点球大战 - 第四回合",
                            "ART_game_rpxe": "点球大战 - 第五回合",
                            "ART_game_rpxf": "点球大战 - 第六回合",
                            "ART_game_rpxg": "点球大战 - 第七回合",
                            "ART_game_rpxh": "点球大战 - 第八回合",
                            "ART_game_rpxi": "点球大战 - 第九回合",
                            "ART_game_rpxj": "点球大战 - 第十回合",
                            "ART_game_rpxk": "点球大战 - 第十一回合",
                            "ART_game_rpxl": "点球大战 - 第十二回合",
                            "ART_game_rpxm": "点球大战 - 第十三回合",
                            "ART_game_rpxn": "点球大战 - 第十四回合",
                            "ART_game_rpxo": "点球大战 - 第十五回合",
                            "ART_game_rpf": "点球大战 - 最后结束回合",
                        
                            "ART_game_o_u": "- 大 / 小",
                            "ART_game_o_e": "- 单 / 双",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_goal": "进球",
                            "ART_game_nogoal": "无进球",
                            "ART_game_draw": "和局",
                            "ART_game_none": "无",
                            "ART_game_otpoint": "其它比分",
                            "ART_game_7up": "7或以上",
                            "ART_game_3up": "3或以上",
                            "ART_game_rgnogoal": "无进球",
                        
                            "ART_game_rwm1": "净胜1球",
                            "ART_game_rwm2": "净胜2球",
                            "ART_game_rwm3": "净胜3球",
                            "ART_game_rwm4up": "净胜4球或更多",
                            "ART_game_rwm3up": "净胜3球或更多",
                            "ART_game_rwm_draw": "任何进球和局",
                            "ART_game_rwm_nogoal": "没进球",
                        
                            "ART_game_1st_goal": "最先进球",
                        
                            "ART_game_rt3g_b26": "第26分钟或之前",
                            "ART_game_rt3g_a27": "第27分钟或之后",
                            "ART_game_rt3g_nogoal": "无进球",
                        
                            "ART_game_rg1g1": "上半场开始 - 14:59分钟",
                            "ART_game_rg1g2": "15:00 - 29:59分钟",
                            "ART_game_rg1g3": "30:00分钟 - 半场",
                            "ART_game_rg1g4": "下半场开始 - 59:59分钟",
                            "ART_game_rg1g5": "60:00 - 74:59分钟",
                            "ART_game_rg1g6": "75:00 分钟  - 全场",
                            "ART_game_rg1gn": "无进球",
                        
                            "ART_game_rpf3": "第三轮",
                            "ART_game_rpf4": "第四轮",
                            "ART_game_rpf5": "第五轮",
                            "ART_game_rpf6": "第六轮或之后",
                        
                        //时节
                            "ART_game_half1": "上半场",
                            "ART_game_half2": "下半场",

                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
            default:
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_r": "讓球",
                            "ART_game_ou": "大 / 小",
                            "ART_game_m": "獨贏",
                            "ART_game_pd": "波膽",
                        
                            "ART_game_ar": "15 分鐘盤口: 開場 - 14:59 分鐘 - 讓球",
                            "ART_game_br": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 讓球",
                            "ART_game_cr": "15 分鐘盤口: 30:00 分鐘 - 半場 - 讓球",
                            "ART_game_dr": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 讓球",
                            "ART_game_er": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 讓球",
                            "ART_game_fr": "15 分鐘盤口: 75:00 分鐘 - 全場 - 讓球",
                        
                            "ART_game_aou": "15 分鐘盤口: 開場 - 14:59 分鐘 - 大 / 小",
                            "ART_game_bou": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 大 / 小",
                            "ART_game_cou": "15 分鐘盤口: 30:00 分鐘 - 半場 - 大 / 小",
                            "ART_game_dou": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 大 / 小",
                            "ART_game_eou": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 大 / 小",
                            "ART_game_fou": "15 分鐘盤口: 75:00 分鐘 - 全場 - 大 / 小",
                        
                            "ART_game_am": "15 分鐘盤口: 開場 - 14:59 分鐘 - 獨贏",
                            "ART_game_bm": "15 分鐘盤口: 15:00 - 29:59 分鐘 - 獨贏",
                            "ART_game_cm": "15 分鐘盤口: 30:00 分鐘 - 半場 - 獨贏",
                            "ART_game_dm": "15 分鐘盤口: 下半場開始 - 59:59 分鐘 - 獨贏",
                            "ART_game_em": "15 分鐘盤口: 60:00 - 74:59 分鐘 - 獨贏",
                            "ART_game_fm": "15 分鐘盤口: 75:00 分鐘 - 全場 - 獨贏",
                        
                            "ART_game_t": "總進球數",
                            "ART_game_ts": "雙方球隊進球",
                            "ART_game_ouhc": "球隊進球數:",
                            "ART_game_eo": "單 / 雙",
                            "ART_game_pg": "最先 / 最後進球",
                        
                            "ART_game_f": "半場 / 全場",
                            "ART_game_wm": "凈勝球數",
                            "ART_game_dc": "雙重機會",
                            "ART_game_mw": "勝出方法",
                            "ART_game_mq": "晉級方法",
                            "ART_game_sfs": "球員進球",
                            "ART_game_cs": "零失球",
                            "ART_game_wn": "零失球獲勝",
                            "ART_game_mou": "獨贏 & 進球 大 / 小",
                            "ART_game_mts": "獨贏 & 雙方球隊進球",
                            "ART_game_out": "進球 大 / 小 & 雙方球隊進球",
                            "ART_game_mpg": "獨贏 & 最先進球",
                            "ART_game_cn": "最先 / 最後角球",
                            "ART_game_cd": "第一張 / 最後一張罰牌",
                            "ART_game_rcd": "紅卡 (球員)",
                            "ART_game_f2g": "先進2球的一方",
                            "ART_game_f3g": "先進3球的一方",
                        
                            "ART_game_hg": "最多進球的半場",
                            "ART_game_mg": "最多進球的半場 - 獨贏",
                            "ART_game_sb": "雙半場進球",
                            "ART_game_fg": "首個進球方式",
                            "ART_game_t3g": "首個進球時間-3項",
                            "ART_game_t1g": "首個進球時間",
                            "ART_game_og": "烏龍球",
                            "ART_game_du": "雙重機會 & 進球 大 / 小",
                            "ART_game_ds": "雙重機會 & 雙方球隊進球",
                            "ART_game_dg": "雙重機會 & 最先進球",
                            "ART_game_oue": "進球 大 / 小 & 進球 單 / 雙",
                            "ART_game_oup": "進球 大 / 小 & 最先進球",
                            "ART_game_w3": "三項讓球投註",
                            "ART_game_bh": "落後反超獲勝",
                            "ART_game_we": "贏得任一半場",
                            "ART_game_wb": "贏得所有半場",
                            "ART_game_tk": "開球球隊",
                            "ART_game_pa": "點球榮獲（除開點球大戰）",
                            "ART_game_ot": "加時賽",
                            "ART_game_st": "最先 / 最後替補",
                            "ART_game_rc": "最先 / 最後任意球",
                            "ART_game_yc": "最先 / 最後界外球",
                            "ART_game_ga": "最先 / 最後球門球",
                            "ART_game_os": "最先 / 最後越位",
                        
                            "ART_game_o_u": "- 大 / 小",
                            "ART_game_o_e": "- 單 / 雙",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_nogoal": "無進球",
                            "ART_game_draw": "和局",
                            "ART_game_otpoint": "其它比分",
                            "ART_game_7up": "7或以上",
                            "ART_game_3up": "3或以上",
                        
                            "ART_game_wm1": "凈勝1球",
                            "ART_game_wm2": "凈勝2球",
                            "ART_game_wm3": "凈勝3球",
                            "ART_game_wm4up": "凈勝4球或更多",
                            "ART_game_wm_draw": "任何進球和局",
                        
                            "ART_game_1st_goal": "最先進球",
                        
                            "ART_game_sfs19": "最先進球",
                            "ART_game_sfs20": "最後進球",
                        
                            "ART_game_90mins": "90分鐘",
                            "ART_game_extime": "加時賽",
                            "ART_game_pktime": "點球大戰",
                            "ART_game_anytime": "任何時間",
                        
                            "ART_game_rt3g_b26": "第26分鐘或之前",
                            "ART_game_rt3g_a27": "第27分鐘或之後",
                            "ART_game_rt3g_nogoal": "無進球",
                        
                            "ART_game_rg1g1": "上半場開始 - 14:59分鐘",
                            "ART_game_rg1g2": "15:00 - 29:59分鐘",
                            "ART_game_rg1g3": "30:00分鐘 - 半場",
                            "ART_game_rg1g4": "下半場開始 - 59:59分鐘",
                            "ART_game_rg1g5": "60:00 - 74:59分鐘",
                            "ART_game_rg1g6": "75:00 分鐘  - 全場",
                            "ART_game_rg1gn": "無進球",
                        
                            "ART_game_fgs": "射門",
                            "ART_game_fgh": "頭球",
                            "ART_game_fgn": "無進球",
                            "ART_game_fgp": "點球",
                            "ART_game_fgf": "自由球",
                            "ART_game_fgo": "烏龍球",
                        
                            "ART_game_1st_pg": "最先進球",
                            "ART_game_last_pg": "最後進球",
                            "ART_game_1st_cn": "最先角球",
                            "ART_game_last_cn": "最後角球",
                            "ART_game_1st_cd": "第一張",
                            "ART_game_last_cd": "最後一張",
                            "ART_game_1st_st": "最先替補",
                            "ART_game_last_st": "最後替補",
                            "ART_game_1st_rc": "最先任意球",
                            "ART_game_last_rc": "最後任意球",
                            "ART_game_1st_yc": "最先界外球",
                            "ART_game_last_yc": "最後界外球",
                            "ART_game_1st_ga": "最先球門球",
                            "ART_game_last_ga": "最後球門球",
                            "ART_game_1st_os": "最先越位",
                            "ART_game_last_os": "最後越位",
                        
                        //時節
                            "ART_game_half1": "上半場",
                            "ART_game_half2": "下半場",
                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_r": "Handicap",
                            "ART_game_ou": "Over / Under",
                            "ART_game_m": "1 X 2",
                            "ART_game_pd": "Correct Score",
                        
                            "ART_game_ar": "15 Minute Markets: Start of Match - 14:59 Mins - Handicap",
                            "ART_game_br": "15 Minute Markets: 15:00 - 29:59 Mins - Handicap",
                            "ART_game_cr": "15 Minute Markets: 30:00 Mins - Half Time - Handicap",
                            "ART_game_dr": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - Handicap",
                            "ART_game_er": "15 Minute Markets: 60:00 - 74:59 Mins - Handicap",
                            "ART_game_fr": "15 Minute Markets: 75:00 Mins - Full Time - Handicap",
                        
                            "ART_game_aou": "15 Minute Markets: Start of Match - 14:59 Mins - Over / Under",
                            "ART_game_bou": "15 Minute Markets: 15:00 - 29:59 Mins - Over / Under",
                            "ART_game_cou": "15 Minute Markets: 30:00 Mins - Half Time - Over / Under",
                            "ART_game_dou": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - Over / Under",
                            "ART_game_eou": "15 Minute Markets: 60:00 - 74:59 Mins - Over / Under",
                            "ART_game_fou": "15 Minute Markets: 75:00 Mins - Full Time - Over / Under",
                        
                            "ART_game_am": "15 Minute Markets: Start of Match - 14:59 Mins - 1 X 2",
                            "ART_game_bm": "15 Minute Markets: 15:00 - 29:59 Mins - 1 X 2",
                            "ART_game_cm": "15 Minute Markets: 30:00 Mins - Half Time - 1 X 2",
                            "ART_game_dm": "15 Minute Markets: Start of 2nd Half - 59:59 Mins - 1 X 2",
                            "ART_game_em": "15 Minute Markets: 60:00 - 74:59 Mins - 1 X 2",
                            "ART_game_fm": "15 Minute Markets: 75:00 Mins - Full Time - 1 X 2",
                        
                            "ART_game_t": "Total Goals",
                            "ART_game_ts": "Both Teams to Score",
                            "ART_game_ouhc": "Team Goals:",
                            "ART_game_eo": "Odd / Even",
                            "ART_game_pg": "First / Last Goal",
                        
                            "ART_game_f": "Half Time / Full Time",
                            "ART_game_wm": "Winning Margin",
                            "ART_game_dc": "Double Chance",
                            "ART_game_mw": "Winning Method",
                            "ART_game_mq": "Qualifying Method",
                            "ART_game_sfs": "Player to Score",
                            "ART_game_cs": "Clean Sheet",
                            "ART_game_wn": "To Win to Nil",
                            "ART_game_mou": "1 X 2 & Goals O / U",
                            "ART_game_mts": "1 X 2 & Both Teams to Score",
                            "ART_game_out": "Goals O / U & Both Teams to Score",
                            "ART_game_mpg": "1 X 2 & 1st Team to Score",
                            "ART_game_cn": "First / Last Corner",
                            "ART_game_cd": "First / Last Booking",
                            "ART_game_rcd": "Red Card (Player)",
                            "ART_game_f2g": "Race to 2 Goals",
                            "ART_game_f3g": "Race to 3 Goals",
                        
                            "ART_game_hg": "Half with Most Goals",
                            "ART_game_mg": "Half with Most Goals - 1 X 2",
                            "ART_game_sb": "To Score in Both Halves",
                            "ART_game_fg": "First Goal Method",
                            "ART_game_t3g": "Time of 1st Goal - 3-Way",
                            "ART_game_t1g": "Time of 1st Goal",
                            "ART_game_og": "Own Goal",
                            "ART_game_du": "Double Chance & Goals O / U",
                            "ART_game_ds": "Double Chance & Both Teams to Score",
                            "ART_game_dg": "Double Chance & 1st Team to Score",
                            "ART_game_oue": "Goals O / U & Goals Odd / Even",
                            "ART_game_oup": "Goals O / U & 1st Team to Score",
                            "ART_game_w3": "3-Way Handicap",
                            "ART_game_bh": "To Win from Behind",
                            "ART_game_we": "To Win Either Half",
                            "ART_game_wb": "To Win Both Halves",
                            "ART_game_tk": "Team to Kick Off",
                            "ART_game_pa": "Penalty Awarded (Excluding Penalty Shootout)",
                            "ART_game_ot": "Extra Time",
                            "ART_game_st": "First / Last Substitution",
                            "ART_game_rc": "First / Last Free Kick",
                            "ART_game_yc": "First / Last Throw In",
                            "ART_game_ga": "First / Last Goal Kick",
                            "ART_game_os": "First / Last Offside",
                        
                            "ART_game_o_u": "- Over / Under",
                            "ART_game_o_e": "- Odd / Even",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                            "ART_game_yes": "Yes",
                            "ART_game_no": "No",
                            "ART_game_goal": "Goal",
                            "ART_game_nogoal": "No Goal",
                            "ART_game_draw": "Draw",
                            "ART_game_otpoint": "Any Other Score",
                            "ART_game_7up": "7 or More",
                            "ART_game_3up": "3 or More",
                        
                            "ART_game_wm1": "Win by 1 Goal",
                            "ART_game_wm2": "Win by 2 Goals",
                            "ART_game_wm3": "Win by 3 Goals",
                            "ART_game_wm4up": "Win by 4 or More Goals",
                            "ART_game_wm_draw": "Score Draw",
                        
                            "ART_game_1st_goal": "1st to Score",
                        
                            "ART_game_sfs19": "1st",
                            "ART_game_sfs20": "Last",
                        
                            "ART_game_90mins": "90 Mins",
                            "ART_game_extime": "Extra Time",
                            "ART_game_pktime": "Penalties",
                            "ART_game_anytime": "Anytime",
                        
                            "ART_game_rt3g_b26": "Up to and including the 26th Minute",
                            "ART_game_rt3g_a27": "27 Minute onwards",
                            "ART_game_rt3g_nogoal": "No Goal",
                        
                            "ART_game_rg1g1": "Start of 1st Half - 14:59 Mins",
                            "ART_game_rg1g2": "15:00 - 29:59 Mins",
                            "ART_game_rg1g3": "30:00 Mins - Half Time",
                            "ART_game_rg1g4": "Start of 2nd Half - 59:59 Mins",
                            "ART_game_rg1g5": "60:00 - 74:59 Mins",
                            "ART_game_rg1g6": "75:00 Mins  - Full Time",
                            "ART_game_rg1gn": "No Goal",
                        
                            "ART_game_fgs": "Shot",
                            "ART_game_fgh": "Header",
                            "ART_game_fgn": "No Goal",
                            "ART_game_fgp": "Penalty",
                            "ART_game_fgf": "Free Kick",
                            "ART_game_fgo": "Own Goal",
                        
                            "ART_game_1st_pg": "First Goal",
                            "ART_game_last_pg": "Last Goal",
                            "ART_game_1st_cn": "First Corner",
                            "ART_game_last_cn": "Last Corner",
                            "ART_game_1st_cd": "First Booking",
                            "ART_game_last_cd": "Last Booking",
                            "ART_game_1st_st": "First Substitution",
                            "ART_game_last_st": "Last Substitution",
                            "ART_game_1st_rc": "First Free Kick",
                            "ART_game_last_rc": "Last Free Kick",
                            "ART_game_1st_yc": "First Throw",
                            "ART_game_last_yc": "Last Throw",
                            "ART_game_1st_ga": "First Goal Kick",
                            "ART_game_last_ga": "Last Goal Kick",
                            "ART_game_1st_os": "First Offside",
                            "ART_game_last_os": "Last Offside",
                        
                        //時節
                            "ART_game_half1": "1st Half",
                            "ART_game_half2": "2nd Half",
                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
							//新PD
								"ART_game_viewless": "'.$artjson["ART_game_viewless"].'",
								"ART_game_viewall": "'.$artjson["ART_game_viewall"].'",
								"ART_pdview_list": "'.$artjson["ART_pdview_list"].'",
								"ART_pdview_score": "'.$artjson["ART_pdview_score"].'",
								"ART_game_oddprice": "'.$artjson["ART_game_oddprice"].'",
								"ART_game_fulltime": "'.$artjson["ART_game_fulltime"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_r": "让球",
                            "ART_game_ou": "大 / 小",
                            "ART_game_m": "独赢",
                            "ART_game_pd": "波胆",
                        
                            "ART_game_ar": "15 分钟盘口: 开场 - 14:59 分钟 - 让球",
                            "ART_game_br": "15 分钟盘口: 15:00 - 29:59 分钟 - 让球",
                            "ART_game_cr": "15 分钟盘口: 30:00 分钟 - 半场 - 让球",
                            "ART_game_dr": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 让球",
                            "ART_game_er": "15 分钟盘口: 60:00 - 74:59 分钟 - 让球",
                            "ART_game_fr": "15 分钟盘口: 75:00 分钟 - 全场 - 让球",
                        
                            "ART_game_aou": "15 分钟盘口: 开场 - 14:59 分钟 - 大 / 小",
                            "ART_game_bou": "15 分钟盘口: 15:00 - 29:59 分钟 - 大 / 小",
                            "ART_game_cou": "15 分钟盘口: 30:00 分钟 - 半场 - 大 / 小",
                            "ART_game_dou": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 大 / 小",
                            "ART_game_eou": "15 分钟盘口: 60:00 - 74:59 分钟 - 大 / 小",
                            "ART_game_fou": "15 分钟盘口: 75:00 分钟 - 全场 - 大 / 小",
                        
                            "ART_game_am": "15 分钟盘口: 开场 - 14:59 分钟 - 独赢",
                            "ART_game_bm": "15 分钟盘口: 15:00 - 29:59 分钟 - 独赢",
                            "ART_game_cm": "15 分钟盘口: 30:00 分钟 - 半场 - 独赢",
                            "ART_game_dm": "15 分钟盘口: 下半场开始 - 59:59 分钟 - 独赢",
                            "ART_game_em": "15 分钟盘口: 60:00 - 74:59 分钟 - 独赢",
                            "ART_game_fm": "15 分钟盘口: 75:00 分钟 - 全场 - 独赢",
                        
                            "ART_game_t": "总进球数",
                            "ART_game_ts": "双方球队进球",
                            "ART_game_ouhc": "球队进球数:",
                            "ART_game_eo": "单 / 双",
                            "ART_game_pg": "最先 / 最后进球",
                        
                            "ART_game_f": "半场 / 全场",
                            "ART_game_wm": "净胜球数",
                            "ART_game_dc": "双重机会",
                            "ART_game_mw": "胜出方法",
                            "ART_game_mq": "晋级方法",
                            "ART_game_sfs": "球员进球",
                            "ART_game_cs": "零失球",
                            "ART_game_wn": "零失球获胜",
                            "ART_game_mou": "独赢 & 进球 大 / 小",
                            "ART_game_mts": "独赢 & 双方球队进球",
                            "ART_game_out": "进球 大 / 小 & 双方球队进球",
                            "ART_game_mpg": "独赢 & 最先进球",
                            "ART_game_cn": "最先 / 最后角球",
                            "ART_game_cd": "第一张 / 最后一张罚牌",
                            "ART_game_rcd": "红卡 (球员)",
                            "ART_game_f2g": "先进2球的一方",
                            "ART_game_f3g": "先进3球的一方",
                        
                            "ART_game_hg": "最多进球的半场",
                            "ART_game_mg": "最多进球的半场 - 独赢",
                            "ART_game_sb": "双半场进球",
                            "ART_game_fg": "首个进球方式",
                            "ART_game_t3g": "首个进球时间-3项",
                            "ART_game_t1g": "首个进球时间",
                            "ART_game_og": "乌龙球",
                            "ART_game_du": "双重机会 & 进球 大 / 小",
                            "ART_game_ds": "双重机会 & 双方球队进球",
                            "ART_game_dg": "双重机会 & 最先进球",
                            "ART_game_oue": "进球 大 / 小 & 进球 单 / 双",
                            "ART_game_oup": "进球 大 / 小 & 最先进球",
                            "ART_game_w3": "三项让球投注",
                            "ART_game_bh": "落后反超获胜",
                            "ART_game_we": "赢得任一半场",
                            "ART_game_wb": "赢得所有半场",
                            "ART_game_tk": "开球球队",
                            "ART_game_pa": "点球荣获（除开点球大战）",
                            "ART_game_ot": "加时赛",
                            "ART_game_st": "最先 / 最后替补",
                            "ART_game_rc": "最先 / 最后任意球",
                            "ART_game_yc": "最先 / 最后界外球",
                            "ART_game_ga": "最先 / 最后球门球",
                            "ART_game_os": "最先 / 最后越位",
                        
                            "ART_game_o_u": "- 大 / 小",
                            "ART_game_o_e": "- 单 / 双",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_nogoal": "无进球",
                            "ART_game_draw": "和局",
                            "ART_game_otpoint": "其它比分",
                            "ART_game_7up": "7或以上",
                            "ART_game_3up": "3或以上",
                        
                            "ART_game_wm1": "净胜1球",
                            "ART_game_wm2": "净胜2球",
                            "ART_game_wm3": "净胜3球",
                            "ART_game_wm4up": "净胜4球或更多",
                            "ART_game_wm_draw": "任何进球和局",
                        
                            "ART_game_1st_goal": "最先进球",
                        
                            "ART_game_sfs19": "最先进球",
                            "ART_game_sfs20": "最后进球",
                        
                            "ART_game_90mins": "90分钟",
                            "ART_game_extime": "加时赛",
                            "ART_game_pktime": "点球大战",
                            "ART_game_anytime": "任何时间",
                        
                            "ART_game_rt3g_b26": "第26分钟或之前",
                            "ART_game_rt3g_a27": "第27分钟或之后",
                            "ART_game_rt3g_nogoal": "无进球",
                        
                            "ART_game_rg1g1": "上半场开始 - 14:59分钟",
                            "ART_game_rg1g2": "15:00 - 29:59分钟",
                            "ART_game_rg1g3": "30:00分钟 - 半场",
                            "ART_game_rg1g4": "下半场开始 - 59:59分钟",
                            "ART_game_rg1g5": "60:00 - 74:59分钟",
                            "ART_game_rg1g6": "75:00 分钟  - 全场",
                            "ART_game_rg1gn": "无进球",
                        
                            "ART_game_fgs": "射门",
                            "ART_game_fgh": "头球",
                            "ART_game_fgn": "无进球",
                            "ART_game_fgp": "点球",
                            "ART_game_fgf": "自由球",
                            "ART_game_fgo": "乌龙球",
                        
                            "ART_game_1st_pg": "最先进球",
                            "ART_game_last_pg": "最后进球",
                            "ART_game_1st_cn": "最先角球",
                            "ART_game_last_cn": "最后角球",
                            "ART_game_1st_cd": "第一张",
                            "ART_game_last_cd": "最后一张",
                            "ART_game_1st_st": "最先替补",
                            "ART_game_last_st": "最后替补",
                            "ART_game_1st_rc": "最先任意球",
                            "ART_game_last_rc": "最后任意球",
                            "ART_game_1st_yc": "最先界外球",
                            "ART_game_last_yc": "最后界外球",
                            "ART_game_1st_ga": "最先球门球",
                            "ART_game_last_ga": "最后球门球",
                            "ART_game_1st_os": "最先越位",
                            "ART_game_last_os": "最后越位",
                        
                        //时节
                            "ART_game_half1": "上半场",
                            "ART_game_half2": "下半场",
                        
                        //other
                            "ART_btn_viewless": "'.$artjson["ART_btn_viewless"].'",
                            "ART_btn_viewmore": "'.$artjson["ART_btn_viewmore"].'",
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
				
				
		
				
        }

    //    $showtype = strtolower($_p["showtype"]);
     //   $fileDir = "tpl/member/ft_{$showtype}_game_more.html";
	 $showtype = strtolower($_p["showtype"]);
if ($_p["isRB"] == "Y") {
    $fileDir = "tpl/member/ft_live_game_more.html";	
} else {
    $fileDir = "tpl/member/ft_{$showtype}_game_more.html";
}

        break;
    case "game_more_BK":
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/ratioChgRule.js",
            "js/lib/xmlNode.js",
            "js/game/game_more.js",
            "js/game/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            //"js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/check_agent.js",
        ];
        switch ($_p["showtype"]){
            case "live":
                $js.='
                var artjson = {
                    "ART_lang": "'.$artjson["ART_lang"].'",
                    "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
					"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",

                    //玩法filters
                    "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                    "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                    "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                    "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                    "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                    "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                    "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                    "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                    "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                    
                    "ART_bk_filter_main": "'.$artjson["ART_bk_filter_main"].'",
                    "ART_bk_filter_match": "'.$artjson["ART_bk_filter_match"].'",
                    "ART_bk_filter_halves": "'.$artjson["ART_bk_filter_halves"].'",
                    "ART_bk_filter_quaters": "'.$artjson["ART_bk_filter_quaters"].'",
                    "ART_bk_filter_others": "'.$artjson["ART_bk_filter_others"].'",
                    "ART_bk_filter_all": "'.$artjson["ART_ft_filter_all"].'",

                    //Score Board
                    "ART_scrbk_q1": "'.$artjson["ART_scrbk_q1"].'",
                    "ART_scrbk_q2": "'.$artjson["ART_scrbk_q2"].'",
                    "ART_scrbk_q3": "'.$artjson["ART_scrbk_q3"].'",
                    "ART_scrbk_q4": "'.$artjson["ART_scrbk_q4"].'",
                    "ART_scrbk_ot": "'.$artjson["ART_scrbk_ot"].'",
                    "ART_scrbk_h1": "'.$artjson["ART_scrbk_h1"].'",
                    "ART_scrbk_h2": "'.$artjson["ART_scrbk_h2"].'",
                
                    "ART_scrbk_sq1": "'.$artjson["ART_scrbk_sq1"].'",
                    "ART_scrbk_sq2": "'.$artjson["ART_scrbk_sq2"].'",
                    "ART_scrbk_sq3": "'.$artjson["ART_scrbk_sq3"].'",
                    "ART_scrbk_sq4": "'.$artjson["ART_scrbk_sq4"].'",
                    "ART_scrbk_sh1": "'.$artjson["ART_scrbk_sh1"].'",
                    "ART_scrbk_sh2": "'.$artjson["ART_scrbk_sh2"].'",
                    "ART_scrbk_sot": "'.$artjson["ART_scrbk_sot"].'",
                
                    //MT
                    "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
                
                    //玩法
                    "ART_game_re": "'.$artjson["ART_game_r"].'",
                    "ART_game_rou": "'.$artjson["ART_game_ou_bk"].'",
                    "ART_game_rouhc": "'.$artjson["ART_game_ouhc_bk"].'",
                    "ART_game_rm": "'.$artjson["ART_game_m_bk"].'",
                    "ART_game_reo": "'.$artjson["ART_game_eo_bk"].'",
                
                    "ART_game_o_u": "'.$artjson["ART_game_o_u_bk"].'",
                    "ART_game_p_d": "'.$artjson["ART_game_p_d_bk"].'",
                
                //odd box
                    "ART_game_over": "'.$artjson["ART_game_over_bk"].'",
                    "ART_game_under": "'.$artjson["ART_game_under_bk"].'",
                    "ART_game_odd": "'.$artjson["ART_game_odd_bk"].'",
                    "ART_game_even": "'.$artjson["ART_game_even_bk"].'",
                
                    "ART_game_rpd0": "'.$artjson["ART_game_pd0_bk"].'",
                    "ART_game_rpd1": "'.$artjson["ART_game_pd1_bk"].'",
                    "ART_game_rpd2": "'.$artjson["ART_game_pd2_bk"].'",
                    "ART_game_rpd3": "'.$artjson["ART_game_pd3_bk"].'",
                    "ART_game_rpd4": "'.$artjson["ART_game_pd4_bk"].'",
                
                //other
                    "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                    "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",

                    //净胜球数
                    "ART_game_rwm": "'.$artjson["ART_game_rwm"].'",
                    "ART_game_rwma1": "'.$artjson["ART_game_rwma1"].'",
                    "ART_game_rwma2": "'.$artjson["ART_game_rwma2"].'",
                    "ART_game_rwma3": "'.$artjson["ART_game_rwma3"].'",
                    "ART_game_rwma4": "'.$artjson["ART_game_rwma4"].'",
                    "ART_game_rwma5": "'.$artjson["ART_game_rwma5"].'",
                    "ART_game_rwmaov": "'.$artjson["ART_game_rwmaov"].'",
                    "ART_game_rwmcov": "'.$artjson["ART_game_rwmcov"].'",
                    "ART_game_rwmot": "'.$artjson["ART_game_rwmot"].'",
					"ART_game_rwmb1": "'.$artjson["ART_game_rwmb1"].'",
					"ART_game_rwmbov": "'.$artjson["ART_game_rwmbov"].'",
                }
                ';
                break;
            default:
                $js.= '
                var artjson = {
                    "ART_lang": "'.$artjson["ART_lang"].'",
                    "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                    "ART_game_r": "'.$artjson["ART_game_r"].'",
                    "ART_game_ou": "'.$artjson["ART_game_ou_bk"].'",
                    "ART_game_ouhc": "'.$artjson["ART_game_ouhc_bk"].'",
                    "ART_game_m": "'.$artjson["ART_game_m_bk"].'",
                    "ART_game_eo": "'.$artjson["ART_game_eo_bk"].'",
					"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",

                    //玩法filters
                    "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                    "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                    "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                    "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                    "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                    "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                    "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                    "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                    "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",

                    "ART_bk_filter_main": "'.$artjson["ART_bk_filter_main"].'",
                    "ART_bk_filter_match": "'.$artjson["ART_bk_filter_match"].'",
                    "ART_bk_filter_halves": "'.$artjson["ART_bk_filter_halves"].'",
                    "ART_bk_filter_quaters": "'.$artjson["ART_bk_filter_quaters"].'",
                    "ART_bk_filter_others": "'.$artjson["ART_bk_filter_others"].'",
                    "ART_bk_filter_all": "'.$artjson["ART_ft_filter_all"].'",

                    //Score Board
                    "ART_scrbk_q1": "'.$artjson["ART_scrbk_q1"].'",
                    "ART_scrbk_q2": "'.$artjson["ART_scrbk_q2"].'",
                    "ART_scrbk_q3": "'.$artjson["ART_scrbk_q3"].'",
                    "ART_scrbk_q4": "'.$artjson["ART_scrbk_q4"].'",
                    "ART_scrbk_ot": "'.$artjson["ART_scrbk_ot"].'",
                    "ART_scrbk_h1": "'.$artjson["ART_scrbk_h1"].'",
                    "ART_scrbk_h2": "'.$artjson["ART_scrbk_h2"].'",
                
                    "ART_scrbk_sq1": "'.$artjson["ART_scrbk_sq1"].'",
                    "ART_scrbk_sq2": "'.$artjson["ART_scrbk_sq2"].'",
                    "ART_scrbk_sq3": "'.$artjson["ART_scrbk_sq3"].'",
                    "ART_scrbk_sq4": "'.$artjson["ART_scrbk_sq4"].'",
                    "ART_scrbk_sh1": "'.$artjson["ART_scrbk_sh1"].'",
                    "ART_scrbk_sh2": "'.$artjson["ART_scrbk_sh2"].'",
                    "ART_scrbk_sot": "'.$artjson["ART_scrbk_sot"].'",
                
                    //MT
                    "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
                
                    //玩法
                    "ART_game_re": "'.$artjson["ART_game_r"].'",
                    "ART_game_rou": "'.$artjson["ART_game_ou_bk"].'",
                    "ART_game_rouhc": "'.$artjson["ART_game_ouhc_bk"].'",
                    "ART_game_rm": "'.$artjson["ART_game_m_bk"].'",
                    "ART_game_reo": "'.$artjson["ART_game_eo_bk"].'",
                
                    "ART_game_o_u": "'.$artjson["ART_game_o_u_bk"].'",
                    "ART_game_p_d": "'.$artjson["ART_game_p_d_bk"].'",
                    "ART_game_over": "'.$artjson["ART_game_over_bk"].'",
                    "ART_game_under": "'.$artjson["ART_game_under_bk"].'",
                    "ART_game_odd": "'.$artjson["ART_game_odd_bk"].'",
                    "ART_game_even": "'.$artjson["ART_game_even_bk"].'",
                    "ART_game_pd0": "'.$artjson["ART_game_pd0_bk"].'",
                    "ART_game_pd1": "'.$artjson["ART_game_pd1_bk"].'",
                    "ART_game_pd2": "'.$artjson["ART_game_pd2_bk"].'",
                    "ART_game_pd3": "'.$artjson["ART_game_pd3_bk"].'",
                    "ART_game_pd4": "'.$artjson["ART_game_pd4_bk"].'",
                    "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                    "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                    
                    //净胜球数
                    "ART_game_rwm": "'.$artjson["ART_game_rwm"].'",
                    "ART_game_rwma1": "'.$artjson["ART_game_rwma1"].'",
                    "ART_game_rwma2": "'.$artjson["ART_game_rwma2"].'",
                    "ART_game_rwma3": "'.$artjson["ART_game_rwma3"].'",
                    "ART_game_rwma4": "'.$artjson["ART_game_rwma4"].'",
                    "ART_game_rwma5": "'.$artjson["ART_game_rwma5"].'",
                    "ART_game_rwmaov": "'.$artjson["ART_game_rwmaov"].'",
                    "ART_game_rwmcov": "'.$artjson["ART_game_rwmcov"].'",
                    "ART_game_rwmot": "'.$artjson["ART_game_rwmot"].'",
					"ART_game_rwmb1": "'.$artjson["ART_game_rwmb1"].'",
					"ART_game_rwmbov": "'.$artjson["ART_game_rwmbov"].'",
                }
                ';
                break;
        }
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tpl/member/bk_{$showtype}_game_more.html";
        break;
    case "game_more_TN":
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/ratioChgRule.js",
            "js/lib/xmlNode.js",
            "js/game/game_more.js",
            "js/game/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            //"js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/check_agent.js",
        ];
        switch ($_p["showtype"]){
            case "live":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            "ART_game_stop": "停盤",
                            "ART_scrtn_set": "盤數",
                            "ART_scrtn_tot": "分數",
                            "ART_scrtn_game": "局數",
                        
                            //玩法
                            "ART_game_rf": "獨贏",
                            "ART_game_rga": "以對手15/30贏局",
                            "ART_game_rgou": "總分: 大/小",
                            "ART_game_rm": "獨贏",
                            "ART_game_re": "讓盤",
                            "ART_game_rou": "總盤數: 大 / 小",
                            "ART_game_rouhc": "球員局數:",
                            "ART_game_reo": "總盤數: 單 / 雙",
                            "ART_game_rpd3": "波膽(3盤)",
                            "ART_game_rpd5": "波膽(5盤)",
                        
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_yes": "是",
                            "ART_game_no": "否",
                            "ART_game_over5.5": "大 5.5",
                            "ART_game_under5.5": "小 5.5",

                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            "ART_game_stop": "Play Suspended",
                            "ART_scrtn_set": "Sets",
                            "ART_scrtn_tot": "Points",
                            "ART_scrtn_game": "Games",
                            //玩法
                            "ART_game_rf": "Money Line",
                            "ART_game_rga": "Game at 15/30",
                            "ART_game_rgou": "Total Points: Over / Under",
                            "ART_game_rm": "Money Line",
                            "ART_game_re": "Set Handicap",
                            "ART_game_rou": "Total Sets: Over / Under",
                            "ART_game_rouhc": "Player Games:",
                            "ART_game_reo": "Total Sets: Odd / Even",
                            "ART_game_rpd3": "Match Correct Score (3 Sets)",
                            "ART_game_rpd5": "Match Correct Score (5 Sets)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                            //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                            "ART_game_yes": "Yes",
                            "ART_game_no": "No",
                            "ART_game_over5.5": "O 5.5",
                            "ART_game_under5.5": "U 5.5",	
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            "ART_game_stop": "停盘",
                            "ART_scrtn_set": "盘数",
                            "ART_scrtn_tot": "分数",
                            "ART_scrtn_game": "局数",
                        
                            //玩法
                            "ART_game_rf": "独赢",
                            "ART_game_rga": "以對手15/30贏局",
                            "ART_game_rgou": "總分: 大/小",
                            "ART_game_rga": "以对手15/30赢局",
                            "ART_game_rgou": "总分: 大/小",
                            "ART_game_rm": "独赢",
                            "ART_game_re": "让盘",
                            "ART_game_rou": "总盘数: 大 / 小",
                            "ART_game_rouhc": "球员局数:",
                            "ART_game_reo": "总盘数: 单 / 双",
                            "ART_game_rpd3": "波胆(3盘)",
                            "ART_game_rpd5": "波胆(5盘)",
                        
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            "ART_game_yes": "是",
                            "ART_game_no": "否",
                            "ART_game_over5.5": "大 5.5",
                            "ART_game_under5.5": "小 5.5",
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
            default:
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "獨贏",
                            "ART_game_r": "讓盤",
                            "ART_game_ou": "總盤數: 大 / 小",
                            "ART_game_ouhc": "球員局數:",
                            "ART_game_eo": "總盤數: 單 / 雙",
                            "ART_game_pd3": "波膽(3盤)",
                            "ART_game_pd5": "波膽(5盤)",
                            
                            "ART_game_o_u": "- 大 / 小",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                        
                        //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "Money Line",
                            "ART_game_r": "Set Handicap",
                            "ART_game_ou": "Total Sets: Over / Under",
                            "ART_game_ouhc": "Player Games:",
                            "ART_game_eo": "Total Sets: Odd / Even",
                            "ART_game_pd3": "Match Correct Score (3 Sets)",
                            "ART_game_pd5": "Match Correct Score (5 Sets)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                        //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "独赢",
                            "ART_game_r": "让盘",
                            "ART_game_ou": "总盘数: 大 / 小",
                            "ART_game_ouhc": "球员局数:",
                            "ART_game_eo": "总盘数: 单 / 双",
                            "ART_game_pd3": "波胆(3盘)",
                            "ART_game_pd5": "波胆(5盘)",
                            
                            "ART_game_o_u": "- 大 / 小",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                        
                        //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
        }
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tpl/member/tn_{$showtype}_game_more.html";
        break;
    case "game_more_VB":
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/ratioChgRule.js",
            "js/lib/xmlNode.js",
            "js/game/game_more.js",
            "js/game/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            //"js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/check_agent.js",
        ];
        switch ($_p["showtype"]){
            case "live":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            "ART_game_stop": "停盤",
                            "ART_scrvb_set": "局數",
                            "ART_scrvb_tot": "分數",
                        //玩法
                            "ART_game_rm": "獨贏",
                            "ART_game_re": "讓局",
                            "ART_game_rouhc": "球隊得分:",
                            "ART_game_rou": "總局數: 大 / 小",
                            "ART_game_reo": "總局數: 單 / 雙",
                            "ART_game_rpd3": "波膽(3局)",
                            "ART_game_rpd5": "波膽(5局)",
                        
                            "ART_game_o_u": "- 大 / 小",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",

                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            "ART_game_stop": "Play Suspended",
                            "ART_scrvb_set": "Sets",
                            "ART_scrvb_tot": "Points",
                        //玩法
                            "ART_game_rm": "Money Line",
                            "ART_game_re": "Set Handicap",
                            "ART_game_rouhc": "Team Points:",
                            "ART_game_rou": "Total Sets: Over / Under",
                            "ART_game_reo": "Total Sets: Odd / Even",
                            "ART_game_rpd3": "Match Correct Score (3 Sets)",
                            "ART_game_rpd5": "Match Correct Score (5 Sets)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            "ART_game_stop": "停盘",
                            "ART_scrvb_set": "局数",
                            "ART_scrvb_tot": "分数",
                        //玩法
                            "ART_game_rm": "独赢",
                            "ART_game_re": "让局",
                            "ART_game_rouhc": "球队得分:",
                            "ART_game_rou": "总局数: 大 / 小",
                            "ART_game_reo": "总局数: 单 / 双",
                            "ART_game_rpd3": "波胆(3局)",
                            "ART_game_rpd5": "波胆(5局)",
                        
                            "ART_game_o_u": "- 大 / 小",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
            default:
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "獨贏",
                            "ART_game_r": "讓局",
                            "ART_game_ou": "總局數: 大 / 小",
                            "ART_game_ouhc": "球隊得分:",
                            "ART_game_eo": "總局數: 單 / 雙",
                            "ART_game_pd3": "波膽(3局)",
                            "ART_game_pd5": "波膽(5局)",
                            
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                        
                        //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "Money Line",
                            "ART_game_r": "Set Handicap",
                            "ART_game_ou": "Total Sets: Over / Under",
                            "ART_game_ouhc": "Team Points:",
                            "ART_game_eo": "Total Sets: Odd / Even",
                            "ART_game_pd3": "Match Correct Score (3 Sets)",
                            "ART_game_pd5": "Match Correct Score (5 Sets)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                            //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "独赢",
                            "ART_game_r": "让局",
                            "ART_game_ou": "总局数: 大 / 小",
                            "ART_game_ouhc": "球队得分:",
                            "ART_game_eo": "总局数: 单 / 双",
                            "ART_game_pd3": "波胆(3局)",
                            "ART_game_pd5": "波胆(5局)",
                            
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
        }
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tpl/member/vb_{$showtype}_game_more.html";
        break;
    case "game_more_BS":
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/ratioChgRule.js",
            "js/lib/xmlNode.js",
            "js/game/game_more.js",
            "js/game/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            //"js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/betgenius.js",
            "js/tv/check_agent.js",
        ];
        switch ($_p["showtype"]){
            case "live":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //Score Board
                            "ART_scrbs_ot": "加時",
                            "ART_scrbs_out": "出局:",
                        
                            //玩法
                            "ART_game_rm": "獨贏",
                            "ART_game_re": "讓球",
                            "ART_game_rou": "總得分: 大 / 小",
                            "ART_game_rouhc": "球隊得分:",
                            "ART_game_reo": "總得分: 單 / 雙",
                            "ART_game_rwm": "凈勝球數",
                            "ART_game_rot": "加時",
                            "ART_game_hrm": "主客和",
                        
                            "ART_game_rpd3": "波膽(3局)",
                            "ART_game_rpd5": "波膽(5局)",
                        
                            "ART_game_o_u": "- 大 / 小",
                        
                            "ART_game_half1": "首5局",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_draw": "和局",
                        
                            "ART_game_rwm1": "贏得1分",
                            "ART_game_rwm2": "贏得2分",
                            "ART_game_rwm3": "贏得3分",
                            "ART_game_rwm4up": "贏得4分或更多",

                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //Score Board
                            "ART_scrbs_ot": "OT",
                            "ART_scrbs_out": "Out:",
                            //玩法
                            "ART_game_rm": "Money Line",
                            "ART_game_re": "Handicap",
                            "ART_game_rou": "Total Runs: Over / Under",
                            "ART_game_rouhc": "Team Runs:",
                            "ART_game_reo": "Total Runs: Odd / Even",
                            "ART_game_rwm": "Winning Margin ",
                            "ART_game_rot": "Overtime",
                            "ART_game_hrm": "1 X 2",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                            "ART_game_half1": "1st 5 Innings",
                        
                            //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                            "ART_game_yes": "Yes",
                            "ART_game_no": "No",
                            "ART_game_draw": "Draw",
                        
                            "ART_game_rwm1": "Win by 1 Run",
                            "ART_game_rwm2": "Win by 2 Runs",
                            "ART_game_rwm3": "Win by 3 Runs",
                            "ART_game_rwm4up": "Win by 4 or More Runs",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //Score Board
                            "ART_scrbs_ot": "加时",
                            "ART_scrbs_out": "出局:",
                        
                            //玩法
                            "ART_game_rm": "独赢",
                            "ART_game_re": "让球",
                            "ART_game_rou": "总得分: 大 / 小",
                            "ART_game_rouhc": "球队得分:",
                            "ART_game_reo": "总得分: 单 / 双",
                            "ART_game_rwm": "净胜球数",
                            "ART_game_rot": "加时",
                            "ART_game_hrm": "主客和",
                        
                            "ART_game_rpd3": "波胆(3局)",
                            "ART_game_rpd5": "波胆(5局)",
                        
                            "ART_game_o_u": "- 大 / 小",
                        
                            "ART_game_half1": "首5局",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_draw": "和局",
                        
                            "ART_game_rwm1": "赢得1分",
                            "ART_game_rwm2": "赢得2分",
                            "ART_game_rwm3": "赢得3分",
                            "ART_game_rwm4up": "赢得4分或更多",
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
            default:
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "獨贏",
                            "ART_game_r": "讓球",
                            "ART_game_ou": "總得分: 大 / 小",
                            "ART_game_ouhc": "球隊得分:",
                            "ART_game_eo": "總得分: 單 / 雙",
                            "ART_game_wm": "凈勝球數",
                            "ART_game_ot": "加時",
                            "ART_game_hm": "主客和",
                        
                            "ART_game_o_u": "- 大 / 小",
                            "ART_game_half1": "首5局",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_draw": "和局",
                        
                            "ART_game_rwm1": "贏得1分",
                            "ART_game_rwm2": "贏得2分",
                            "ART_game_rwm3": "贏得3分",
                            "ART_game_rwm4up": "贏得4分或更多",
                        
                        //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "Money Line",
                            "ART_game_r": "Handicap",
                            "ART_game_ou": "Total Runs: Over / Under",
                            "ART_game_ouhc": "Team Runs:",
                            "ART_game_eo": "Total Runs: Odd / Even",
                            "ART_game_wm": "Winning Margin",
                            "ART_game_ot": "Overtime",
                            "ART_game_hm": "1 X 2",
                        
                            "ART_game_o_u": "-  Over / Under",
                            "ART_game_half1": "1st 5 Innings",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                            "ART_game_yes": "Yes",
                            "ART_game_no": "No",
                            "ART_game_draw": "Draw",
                        
                            "ART_game_rwm1": "Win by 1 Run",
                            "ART_game_rwm2": "Win by 2 Runs",
                            "ART_game_rwm3": "Win by 3 Runs",
                            "ART_game_rwm4up": "Win by 4 or More Runs",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "独赢",
                            "ART_game_r": "让球",
                            "ART_game_ou": "总得分: 大 / 小",
                            "ART_game_ouhc": "球队得分:",
                            "ART_game_eo": "总得分: 单 / 双",
                            "ART_game_wm": "净胜球数",
                            "ART_game_ot": "加时",
                            "ART_game_hm": "主客和",
                        
                            "ART_game_o_u": "- 大 / 小",
                            "ART_game_half1": "首5局",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            "ART_game_yes": "是",
                            "ART_game_no": "不是",
                            "ART_game_draw": "和局",
                        
                            "ART_game_rwm1": "赢得1分",
                            "ART_game_rwm2": "赢得2分",
                            "ART_game_rwm3": "赢得3分",
                            "ART_game_rwm4up": "赢得4分或更多",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
        }
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tpl/member/bs_{$showtype}_game_more.html";
        break;
    case "game_more_BM":
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/ratioChgRule.js",
            "js/lib/xmlNode.js",
            "js/game/game_more.js",
            "js/game/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            //"js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/check_agent.js",
        ];
        switch ($_p["showtype"]){
            case "live":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            "ART_game_stop": "停盤",
                            "ART_scrbm_set": "局數",
                            "ART_scrbm_tot": "分數",
                            
                            //玩法
                            "ART_game_rm": "獨贏",
                            "ART_game_re": "讓局",
                            "ART_game_rou": "總局數: 大 / 小",
                            "ART_game_rouhc": "球員得分:",
                            "ART_game_reo": "總局數: 單 / 雙",
                            "ART_game_rpd3": "波膽(3局)",
                            "ART_game_rpd5": "波膽(5局)",
                        
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",

                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //Score Board
                            "ART_game_stop": "Play Suspended",
                            "ART_scrbm_set": "Games",
                            "ART_scrbm_tot": "Points",
                        //玩法
                            "ART_game_rm": "Money Line",
                            "ART_game_re": "Game Handicap",
                            "ART_game_rou": "Total Games: Over / Under",
                            "ART_game_rouhc": "Player Points:",
                            "ART_game_reo": "Total Games: Odd / Even",
                            "ART_game_rpd3": "Match Correct Score (3 Games)",
                            "ART_game_rpd5": "Match Correct Score (5 Games)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            "ART_game_stop": "停盘",
                            "ART_scrbm_set": "局数",
                            "ART_scrbm_tot": "分数",
                            
                            //玩法
                            "ART_game_rm": "独赢",
                            "ART_game_re": "让局",
                            "ART_game_rou": "总局数: 大 / 小",
                            "ART_game_rouhc": "球员得分:",
                            "ART_game_reo": "总局数: 单 / 双",
                            "ART_game_rpd3": "波胆(3局)",
                            "ART_game_rpd5": "波胆(5局)",
                        
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
            default:
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "獨贏",
                            "ART_game_r": "讓局",
                            "ART_game_ou": "總局數: 大 / 小",
                            "ART_game_ouhc": "球員得分:",
                            "ART_game_eo": "總局數: 單 / 雙",
                            "ART_game_pd3": "波膽(3局)",
                            "ART_game_pd5": "波膽(5局)",
                            
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                        
                        //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "Money Line",
                            "ART_game_r": "Game Handicap",
                            "ART_game_ou": "Total Games: Over / Under",
                            "ART_game_ouhc": "Player Points:",
                            "ART_game_eo": "Total Games: Odd / Even",
                            "ART_game_pd3": "Match Correct Score (3 Games)",
                            "ART_game_pd5": "Match Correct Score (5 Games)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                            //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "独赢",
                            "ART_game_r": "让局",
                            "ART_game_ou": "总局数: 大 / 小",
                            "ART_game_ouhc": "球员得分:",
                            "ART_game_eo": "总局数: 单 / 双",
                            "ART_game_pd3": "波胆(3局)",
                            "ART_game_pd5": "波胆(5局)",
                            
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
        }
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tpl/member/bm_{$showtype}_game_more.html";
        break;
    case "game_more_SK":
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/ratioChgRule.js",
            "js/lib/xmlNode.js",
            "js/game/game_more.js",
            "js/game/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            //"js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/check_agent.js",
        ];
        switch ($_p["showtype"]){
            case "live":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            "ART_game_rm": "獨贏",
                            "ART_game_re": "讓局",
                            "ART_game_rou": "總局數: 大 / 小",
                            "ART_game_reo": "總局數: 單 / 雙",
                            "ART_game_rf": "獨贏",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",

                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //Score Board
                            "ART_game_rm": "Money Line",
                            "ART_game_re": "Frame Handicap",
                            "ART_game_rou": "Total Frames: Over / Under",
                            "ART_game_reo": "Total Frames: Odd / Even",
                            "ART_game_rf": "Money Line",
                        
                            //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            "ART_game_rm": "独赢",
                            "ART_game_re": "让局",
                            "ART_game_rou": "总局数: 大 / 小",
                            "ART_game_reo": "总局数: 单 / 双",
                            "ART_game_rf": "独赢",
                        
                        //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
            default:
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "獨贏",
                            "ART_game_r": "讓局",
                            "ART_game_ou": "總局數: 大 / 小",
                            "ART_game_eo": "總局數: 單 / 雙",
                            "ART_game_f": "獨贏",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                        
                        //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "Money Line",
                            "ART_game_r": "Frame Handicap",
                            "ART_game_ou": "Total Frames: Over / Under",
                            "ART_game_eo": "Total Frames: Odd / Even",
                            "ART_game_f": "Money Line",
                            
                            //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                            //玩法filters
                            "ART_ft_filter_popular": "'.$artjson["ART_ft_filter_popular"].'",
                            "ART_ft_filter_hou": "'.$artjson["ART_ft_filter_hou"].'",
                            "ART_ft_filter_goals": "'.$artjson["ART_ft_filter_goals"].'",
                            "ART_ft_filter_halves": "'.$artjson["ART_ft_filter_halves"].'",
                            "ART_ft_filter_intervals": "'.$artjson["ART_ft_filter_intervals"].'",
                            "ART_ft_filter_corners": "'.$artjson["ART_ft_filter_corners"].'",
                            "ART_ft_filter_booking": "'.$artjson["ART_ft_filter_booking"].'",
                            "ART_ft_filter_others": "'.$artjson["ART_ft_filter_others"].'",
                            "ART_ft_filter_all": "'.$artjson["ART_ft_filter_all"].'",
                            //玩法
                            "ART_game_m": "独赢",
                            "ART_game_r": "让局",
                            "ART_game_ou": "总局数: 大 / 小",
                            "ART_game_eo": "总局数: 单 / 双",
                            "ART_game_f": "独赢",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
        }
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tpl/member/sk_{$showtype}_game_more.html";
        break;
    case "game_more_TT":
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/ratioChgRule.js",
            "js/lib/xmlNode.js",
            "js/game/game_more.js",
            "js/game/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            //"js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/check_agent.js",
        ];
        switch ($_p["showtype"]){
            case "live":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            "ART_game_stop": "停盤",
                            "ART_scrtt_tot": "分數",
                            "ART_scrtt_game": "局數",
                            
                            //玩法
                            "ART_game_rm": "獨贏",
                            "ART_game_re": "讓局",
                            "ART_game_rou": "總局數: 大 / 小",
                            "ART_game_rouhc": "球員得分:",
                            "ART_game_reo": "總局數: 單 / 雙",
                            "ART_game_rpd5": "波膽(5局)",
                            "ART_game_rpd7": "波膽(7局)",
                        
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",

                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            "ART_game_stop": "Play Suspended",
                            "ART_scrtt_tot": "Points",
                            "ART_scrtt_game": "Games",
                            
                            //玩法
                            "ART_game_rm": "Money Line",
                            "ART_game_re": "Game Handicap",
                            "ART_game_rou": "Total Games: Over / Under",
                            "ART_game_rouhc": "Player Points:",
                            "ART_game_reo": "Total Games: Odd / Even",
                            "ART_game_rpd5": "Match Correct Score (5 Games)",
                            "ART_game_rpd7": "Match Correct Score (7 Games)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                            //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            "ART_game_stop": "停盘",
                            "ART_scrtt_tot": "分数",
                            "ART_scrtt_game": "局数",
                            
                            //玩法
                            "ART_game_rm": "独赢",
                            "ART_game_re": "让局",
                            "ART_game_rou": "总局数: 大 / 小",
                            "ART_game_rouhc": "球员得分:",
                            "ART_game_reo": "总局数: 单 / 双",
                            "ART_game_rpd5": "波胆(5局)",
                            "ART_game_rpd7": "波胆(7局)",
                        
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
            default:
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            //玩法
                            "ART_game_m": "獨贏",
                            "ART_game_r": "讓局",
                            "ART_game_ou": "總局數: 大 / 小",
                            "ART_game_ouhc": "球員得分:",
                            "ART_game_eo": "總局數: 單 / 雙",
                            "ART_game_pd5": "波膽(5局)",
                            "ART_game_pd7": "波膽(7局)",
                            
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                        
                        //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            //玩法
                            "ART_game_m": "Money Line",
                            "ART_game_r": "Game Handicap",
                            "ART_game_ou": "Total Games: Over / Under",
                            "ART_game_ouhc": "Player Points:",
                            "ART_game_eo": "Total Games: Odd / Even",
                            "ART_game_pd5": "Match Correct Score (5 Games)",
                            "ART_game_pd7": "Match Correct Score (7 Games)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            //玩法
                            "ART_game_m": "独赢",
                            "ART_game_r": "让局",
                            "ART_game_ou": "总局数: 大 / 小",
                            "ART_game_ouhc": "球员得分:",
                            "ART_game_eo": "总局数: 单 / 双",
                            "ART_game_pd5": "波胆(5局)",
                            "ART_game_pd7": "波胆(7局)",
                            
                            "ART_game_o_u": "- 大 / 小",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
        }
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tpl/member/tt_{$showtype}_game_more.html";
        break;
    case "game_more_OP":
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/ratioChgRule.js",
            "js/lib/xmlNode.js",
            "js/game/game_more.js",
            "js/game/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            //"js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/betgenius.js",
            "js/tv/check_agent.js",
        ];
        switch ($_p["showtype"]){
            case "live":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            "ART_scrop_time": "滾球",
                            //玩法
                            "ART_game_re": "讓球",
                            "ART_game_rm": "獨贏",
                            "ART_game_rou": "大 / 小",
                            "ART_game_reo": "單 / 雙",
                        
                            "ART_game_half1": "上半場",
                            
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_draw": "和局",

                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            "ART_game_stop": "Play Suspended",
                            "ART_scrtt_tot": "Points",
                            "ART_scrtt_game": "Games",
                            
                            //玩法
                            "ART_game_rm": "Money Line",
                            "ART_game_re": "Game Handicap",
                            "ART_game_rou": "Total Games: Over / Under",
                            "ART_game_rouhc": "Player Points:",
                            "ART_game_reo": "Total Games: Odd / Even",
                            "ART_game_rpd5": "Match Correct Score (5 Games)",
                            "ART_game_rpd7": "Match Correct Score (7 Games)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                            //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            "ART_scrop_time": "滚球",
                            //玩法
                                "ART_game_re": "让球",
                                "ART_game_rm": "独赢",
                                "ART_game_rou": "大 / 小",
                                "ART_game_reo": "单 / 双",
                            
                                "ART_game_half1": "上半场",
                            
                            //odd box
                                "ART_game_over": "大",
                                "ART_game_under": "小",
                                "ART_game_odd": "单",
                                "ART_game_even": "双",
                                "ART_game_draw": "和局",
                            
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
            default:
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            //玩法
                            "ART_game_r": "讓球",
                            "ART_game_m": "獨贏",
                            "ART_game_ou": "大 / 小",
                            "ART_game_eo": "單 / 雙",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_draw": "和局",
                        
                        //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            //玩法
                            "ART_game_m": "Money Line",
                            "ART_game_r": "Game Handicap",
                            "ART_game_ou": "Total Games: Over / Under",
                            "ART_game_ouhc": "Player Points:",
                            "ART_game_eo": "Total Games: Odd / Even",
                            "ART_game_pd5": "Match Correct Score (5 Games)",
                            "ART_game_pd7": "Match Correct Score (7 Games)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            //玩法
                            "ART_game_r": "让球",
                            "ART_game_m": "独赢",
                            "ART_game_ou": "大 / 小",
                            "ART_game_eo": "单 / 双",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            "ART_game_draw": "和局",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
        }
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tpl/member/op_{$showtype}_game_more.html";
        break;
	case "game_more_ES":
        $jsAry = [
            "js/lib/Util.js",
            "js/lib/Util_game.js",
            "js/lib/HttpRequest.js",
            "js/lib/HttpRequestRetry.js",
            "js/lib/fastTemplate_a1.js",
            "js/lib/ratioChgRule.js",
            "js/lib/xmlNode.js",
            "js/game/game_more.js",
            "js/game/{$_p["p"]}.js",
            "js/tv/TV.js",
            "js/tv/hls.min.js",
            "js/tv/MT.js",
            "js/tv/perform.js",
            "js/tv/img.js",
            "js/tv/unas.js",
            "js/tv/betradar.js",
            "js/tv/betgenius.js",
            "js/tv/check_agent.js",
        ]; 
	
        switch ($_p["showtype"]){
            case "live":
			case "soon":
			case "hot":
			case "early":
			case "today":
			case "parlay":
			case "mygame":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
							 //Score board
                "ART_win": "勝率 %",
    
                //玩法filters
                "ART_es_filter_all": "所有盤口",
                "ART_es_filter_match": "比賽",
                "ART_es_filter_game1": "第1局",
                "ART_es_filter_game2": "第2局",
                "ART_es_filter_game3": "第3局",
                "ART_es_filter_game4": "第4局",
                "ART_es_filter_game5": "第5局",
                "ART_es_filter_game6": "第6局",
                "ART_es_filter_game7": "第7局",
                           
                            "ART_scrop_time": "滾球",
                            //玩法
                            "ART_game_re": "讓球",
                            "ART_game_rm": "獨贏",
                            "ART_game_rou": "大 / 小",
                            "ART_game_reo": "單 / 雙",
                        
                            "ART_game_half1": "上半場",
                            
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_draw": "和局",

                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            "ART_game_stop": "Play Suspended",
                            "ART_scrtt_tot": "Points",
                            "ART_scrtt_game": "Games",
							
							//Score board
                "ART_win": "Win %",

                //玩法filters
                "ART_es_filter_all": "ALL MARKETS",
                "ART_es_filter_match": "MATCH",
                "ART_es_filter_game1": "GAME 1",
                "ART_es_filter_game2": "GAME 2",
                "ART_es_filter_game3": "GAME 3",
                "ART_es_filter_game4": "GAME 4",
                "ART_es_filter_game5": "GAME 5",
                "ART_es_filter_game6": "GAME 6",
                "ART_es_filter_game7": "GAME 7",
                       
                            //玩法
                            "ART_game_rm": "Money Line",
                            "ART_game_re": "Game Handicap",
                            "ART_game_rou": "Total Games: Over / Under",
                            "ART_game_rouhc": "Player Points:",
                            "ART_game_reo": "Total Games: Odd / Even",
                            "ART_game_rpd5": "Match Correct Score (5 Games)",
                            "ART_game_rpd7": "Match Correct Score (7 Games)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                            //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
                            "ART_game_nomtpop": "'.$artjson["ART_game_nomtpop"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            "ART_scrop_time": "滚球",
							//Score board
                "ART_win": "胜率 %",

                //玩法filters
                "ART_es_filter_all": "所有盘口",
                "ART_es_filter_match": "比赛",
                "ART_es_filter_game1": "第1局",
                "ART_es_filter_game2": "第2局",
                "ART_es_filter_game3": "第3局",
                "ART_es_filter_game4": "第4局",
                "ART_es_filter_game5": "第5局",
                "ART_es_filter_game6": "第6局",
                "ART_es_filter_game7": "第7局",
				
				
                            //玩法
                                "ART_game_re": "让球",
                                "ART_game_rm": "独赢",
                                "ART_game_rou": "大 / 小",
                                "ART_game_reo": "单 / 双",
                            
                                "ART_game_half1": "上半场",
                            
                            //odd box
                                "ART_game_over": "大",
                                "ART_game_under": "小",
                                "ART_game_odd": "单",
                                "ART_game_even": "双",
                                "ART_game_draw": "和局",
                            
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
            default:
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            //玩法
                            "ART_game_r": "讓球",
                            "ART_game_m": "獨贏",
                            "ART_game_ou": "大 / 小",
                            "ART_game_eo": "單 / 雙",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "單",
                            "ART_game_even": "雙",
                            "ART_game_draw": "和局",
                        
                        //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            //玩法
                            "ART_game_m": "Money Line",
                            "ART_game_r": "Game Handicap",
                            "ART_game_ou": "Total Games: Over / Under",
                            "ART_game_ouhc": "Player Points:",
                            "ART_game_eo": "Total Games: Odd / Even",
                            "ART_game_pd5": "Match Correct Score (5 Games)",
                            "ART_game_pd7": "Match Correct Score (7 Games)",
                        
                            "ART_game_o_u": "-  Over / Under",
                        
                        //odd box
                            "ART_game_over": "Over",
                            "ART_game_under": "Under",
                            "ART_game_odd": "Odd",
                            "ART_game_even": "Even",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                    default:
                        $js.= '
                        var artjson = {
                            "ART_lang": "'.$artjson["ART_lang"].'",
                            "ART_game_nodata": "'.$artjson["ART_game_nodata"].'",
							"ART_game_3in1": "'.$artjson["ART_game_3in1"].'",
                        
                            //玩法
                            "ART_game_r": "让球",
                            "ART_game_m": "独赢",
                            "ART_game_ou": "大 / 小",
                            "ART_game_eo": "单 / 双",
                        
                            //odd box
                            "ART_game_over": "大",
                            "ART_game_under": "小",
                            "ART_game_odd": "单",
                            "ART_game_even": "双",
                            "ART_game_draw": "和局",
                        
                            //other
                            "ART_title_relate": "'.$artjson["ART_title_relate"].'",
                            "ART_text_relate_text": "'.$artjson["ART_text_relate_text"].'",
                         }
                        ';
                        break;
                }
                break;
        }
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tpl/member/es_{$showtype}_game_more.html";
        break;
        
        
    case "get_betradar":
    case "get_perform":
    case "get_img":
    case "get_mygame":
    case "get_betgenius":
        // 上游已不可达，直接返回空 XML 避免阻塞
        header('Content-Type: text/xml');
        exit($xml->toXml(["code"=>"666","count"=>"0"]));
        break;
    case "get_cup_list":
    case "get_cup_list_FS":
    case "get_specialGame_count":
    case "get_league_count":
    case "get_page_count":
    case "get_game_list":
    case "get_league_list_All":
    case "get_game_more":
    case "get_league_list_FS":
    case "get_game_list_FS":
    case "get_list_tv":
    case "get_game_OBT":
	case "get_analysis":
        header('Content-Type: text/xml');

        // --- DbBridge: serve from db_markets.foot_match + foot_match_xml (replaces CatalogBridge JSON path) ---
        // 由 application/bdata/ingest_odds_api.php 负责入库 (Odds-API.io + api-football.io)
        $dbActions = ['get_league_count','get_page_count','get_game_list','get_league_list_All','get_game_more'];
        if (in_array($_p['p'], $dbActions)) {
            require_once __DIR__ . '/tools/DbBridge.php';
            global $db_s;
            $bridge = new DbBridge($db_s);
            if ($bridge->hasData()) {
                $bridgeXml = null;
                switch ($_p['p']) {
                    case 'get_league_count':    $bridgeXml = $bridge->getLeagueCount($_p);    break;
                    case 'get_page_count':      $bridgeXml = $bridge->getPageCount($_p);      break;
                    case 'get_game_list':       $bridgeXml = $bridge->getGameList($_p);       break;
                    case 'get_league_list_All': $bridgeXml = $bridge->getLeagueListAll($_p);  break;
                    case 'get_game_more':       $bridgeXml = $bridge->getGameMore($_p);       break;
                }
                if ($bridgeXml) {
                    // insertLog 需要登陆 session 才能成功 (依赖 member_record.gid)，
                    // 匿名访问 (curl 测试 / 健康检查) 时会抛 PDOException。这里
                    // 不 fatal — 即便日志写入失败也要把 XML 数据返给前端。
                    try { (new Base($_p))->insertLog("赛事页面(db)"); }
                    catch (\Throwable $e) { error_log("DbBridge insertLog skip: " . $e->getMessage()); }
                    exit($bridgeXml);
                }
            }
        }
        // --- End DbBridge ---

        // --- Fast-fallback: 跳过慢上游 curl（~1s/次），直接返回空数据 ---
        // 上游服务器已不可达/不需要，所有非 DbBridge 的 action 立即返回
        // emptySpecial XML，避免 SPA 加载阻塞。
        $_reqTS = isset($_p["ts"]) ? $_p["ts"] : "";
        $emptySpecial = [
            "code"=>"601","count"=>"0","title"=>"","gtype"=>"",
            "ts"=>$_reqTS,
            "homePage_sw"=>"N",
            "SPRB"=>"0","SPFU"=>"0","SPFT"=>"0","SPEM"=>"0","FS"=>"0",
            "SPCUPFantasy"=>"0","SPFantasy"=>"0","Fantasy_leg"=>"",
            "SPCUP_MAIN"=>"0","group_count"=>"0",
            "FS_cup_team"=>"","FT_cup_team"=>"",
            "mode"=>"N","highlights_sw"=>"N","team_sw"=>"N",
            "standings_sw"=>"N","period"=>"","feed_sw"=>"N",
            "season_id"=>"","gameCountMode"=>"",
            "cup_featureEvent_sw"=>"N","cup_standings_sw"=>"N",
            "cup_winnerWidget_sw"=>"N","cup_secondaryBanner_sw"=>"N",
            "cup_tournamentOverview_sw"=>"N","cup_postToFrontend_sw"=>"N",
            "cup_tabSort"=>"",
            "game"=>[]
        ];
        try { (new Base($_p))->insertLog("赛事页面"); } catch (\Throwable $e) {}
        exit($xml->toXml($emptySpecial));
        break;
    case "get_history_data"://账户历史

        header('Content-Type: text/xml');
        $bet = new Bet($_p);
        $xmls = $bet->get_history_data();
        exit($xmls);
        break;
    case "history_switch":
    case "get_history_view":
        header('Content-Type: text/xml');
        $bet = new Bet($_p);
        $xmls = $bet->get_history_view();
        exit($xmls);
        break;
    case "get_todaywagers_count":
        header('Content-Type: text/xml');
        $bet = new Bet($_p);
        $arr = $bet->get_todaywagers_count();
        exit($xml->toXml($arr));
        break;

	/*case "get_today_wagers":  
    $bet = new Bet($_p);  
    $xmlString = $bet->get_today_wagers();  
    $outputFormat = isset($_p['format']) && in_array($_p['format'], ['xml', 'json']) ? $_p['format'] : 'xml';  
    if ($outputFormat === 'json') {  
        $xmlString = htmlspecialchars_decode($xmlString, ENT_QUOTES); 
        $xmlString = preg_replace('/&(?!amp;|lt;|gt;|quot;|apos;)/', '&amp;', $xmlString); // 将未转义的 & 替换为 &amp;
        $xml = simplexml_load_string($xmlString);  
        if ($xml === false) {
            header('Content-Type: application/json');
            exit(json_encode(['error' => 'Invalid XML format']));
        }
        $json = json_encode($xml);  
        header('Content-Type: application/json');  
        exit($json);  
    } else {  
        header('Content-Type: text/xml');  
        exit($xmlString);  
    }  
    break;*/
	case "get_today_wagers":  
    $bet = new Bet($_p);
    $xmlString = '';
    try {
        $xmlString = $bet->get_today_wagers();
    } catch (Throwable $e) {
        $outputFormat = isset($_p['format']) && in_array($_p['format'], ['xml', 'json']) ? $_p['format'] : 'xml';
        if ($outputFormat === 'json') {
            header('Content-Type: application/json');
            exit(json_encode(['code' => 'error', 'msg' => 'get_today_wagers failed', 'status' => 'error']));
        }
        $xmlString = '<?xml version="1.0" encoding="UTF-8"?><serverresponse><code>error</code><msg>get_today_wagers failed</msg></serverresponse>';
    }
    if ($xmlString === '' || $xmlString === false) {
        $outputFormat = isset($_p['format']) && in_array($_p['format'], ['xml', 'json']) ? $_p['format'] : 'xml';
        if ($outputFormat === 'json') {
            header('Content-Type: application/json');
            exit(json_encode(['code' => 'todaywagers', 'count' => 0, 'amout_gold' => '0', 'wagers' => [], 'pay_type' => '', 'status' => 'success']));
        }
        $xmlString = '<?xml version="1.0" encoding="UTF-8"?><serverresponse><code>todaywagers</code><amout_gold>0</amout_gold><count>0</count><pay_type></pay_type></serverresponse>';
    }
    $outputFormat = isset($_p['format']) && in_array($_p['format'], ['xml', 'json']) ? $_p['format'] : 'xml';  
    // 预处理XML字符串 - 更严格的转义处理
    $xmlString = htmlspecialchars_decode($xmlString, ENT_QUOTES);
    // 替换所有未转义的 & 为 &amp;
    $xmlString = preg_replace('/&(?!amp;|lt;|gt;|quot;|apos;|#x[0-9a-fA-F]+;|#[0-9]+;)/', '&amp;', $xmlString);
    if ($outputFormat === 'json') {  
        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($xmlString);  
        if ($xml === false) {
            $errors = libxml_get_errors();
            libxml_clear_errors();
            header('Content-Type: application/json');
            exit(json_encode(['code' => 'error', 'msg' => 'Invalid XML format', 'status' => 'error', 'count' => 0, 'amout_gold' => '0']));
        }
        libxml_clear_errors();
        $json = json_encode($xml);  
        header('Content-Type: application/json');  
        exit($json);  
    } else {  
        // 对于XML输出，同样需要验证
        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($xmlString);
        if ($xml === false) {
            $errors = libxml_get_errors();
            // 返回格式良好的错误响应
            $errorXml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><error/>');
            $errorXml->addChild('message', 'Invalid XML format');
            foreach ($errors as $error) {
                $errorNode = $errorXml->addChild('detail');
                $errorNode->addChild('line', $error->line);
                $errorNode->addChild('column', $error->column);
                $errorNode->addChild('message', trim($error->message));
            }
            header('Content-Type: text/xml');  
            exit($errorXml->asXML());
        }
        libxml_clear_errors();   
        header('Content-Type: text/xml');  
        exit($xmlString);  
    }  
    break;

    case "get_dangerous"://滚球确认注单查询
    case "get_bethold":
        header('Content-Type: text/xml');
        $bet = new Bet($_p);
        $xml = $bet->get_dangerous();
        exit($xml);
        break;
    case "FS_order_view":
    case "Total_order_view":
    case "Other_order_view":
    case "FT_order_view":
        header('Content-Type: text/xml');
        //需要查询玩家资料
        $tf = new Transform();
        $xx =  $tf->get_curl_data($_p);
        if(empty($xx)){
            $arr = ["status"=>"error","msg"=>"暂无数据"];
        }else{
            if(isset($xx["status"]) && $xx["status"]=="error"){
                $arr = $xx;
            }
        }

        if(isset($arr)){
            exit($xml->toXml($arr));
        }else{
            $bet = new Bet($_p);
            $xmls = $bet->order_view($xx);
            /*$code = getXmlNode($xmls,"code");
            $arr = ["code"=>"connectFail","errormsg"=>"暂无数据"];
            exit($xml->toXml($arr));
            if(empty($code)){
                $arr = ["status"=>"error","msg"=>"暂无数据"];
                exit($xml->toXml($arr));
            }*/
           exit($xmls);
        }
        break;
		
    case "FT_bet":
        //需要查询玩家资料
        $tf = new Transform();
        header('Content-Type: text/xml');
        $parr = [
            "p" => "FT_order_view",
            "uid" => $_p["uid"],
            "langx" => $_p["langx"],
            "odd_f_type" => $_p["odd_f_type"],
            "gid" => $_p["gid"],
            "gtype" => $_p["gtype"],
            "wtype" => $_p["wtype"],
            "chose_team" => $_p["chose_team"]
        ];
        $xx =  $tf->get_curl_data($parr);
        if(empty($xx)){
            $arr = ["code"=>"570"];
        }else{
            if(isset($xx["status"]) && $xx["status"]=="error"){
                $arr = $xx;
            }
        }
        $order = new Bet($parr);
        $view_xml = $order->order_view($xx);
        $arr = $order->All_bet($view_xml,$_p);
        exit($xml->toXml($arr));
        break;
    case "Other_bet":
        //需要查询玩家资料
        $tf = new Transform();
        header('Content-Type: text/xml');
        $parr = [
            "p" => "Other_order_view",
            "uid" => $_p["uid"],
            "langx" => $_p["langx"],
            "odd_f_type" => $_p["odd_f_type"],
            "gid" => $_p["gid"],
            "gtype" => $_p["gtype"],
            "wtype" => $_p["wtype"],
            "chose_team" => $_p["chose_team"]
        ];
        $xx =  $tf->get_curl_data($parr);
        if(empty($xx)){
            $arr = ["code"=>"570"];
        }else{
            if(isset($xx["status"]) && $xx["status"]=="error"){
                $arr = $xx;
            }
        }
        $order = new Bet($parr);
        $view_xml = $order->order_view($xx);
        $arr = $order->All_bet($view_xml,$_p);
        exit($xml->toXml($arr));
        break;
    case "FS_bet":
        $tf = new Transform();
        header('Content-Type: text/xml');
        $parr = [
            "p" => "FS_order_view",
            "uid" => $_p["uid"],
            "langx" => $_p["langx"],
            "odd_f_type" => $_p["odd_f_type"],
            "gid" => $_p["gid"],
            "gtype" => $_p["gtype"],
            "wtype" => $_p["wtype"],
            "rtype" => $_p["rtype"]
        ];
        $xx =  $tf->get_curl_data($parr);
        if(empty($xx)){
            $arr = ["code"=>"570"];
        }else{
            if(isset($xx["status"]) && $xx["status"]=="error"){
                $arr = $xx;
            }
        }
        $order = new Bet($parr);
        $view_xml = $order->order_view($xx);
        $arr = $order->FS_bet($view_xml,$_p);
        exit($xml->toXml($arr));
        break;
    case "Total_bet":
        header('Content-Type: text/xml');
      /*$fp = fopen("ss.xml","r");
        $str = fread($fp,filesize("ss.xml"));//指定读取大小，这里把整个文件内容读取出来
        fclose($fp);
        print_r($str);exit;*/
        $isOk = 0;
        $tf = new Transform();
        $teamCount = $_p["teamCount"];
        $success = "";//成功注单
        $fail = "";//错误注单
        $delay = "";//延迟注单
        if($teamCount>0){
            $xxs = [];
            for ($tc = 0; $tc < $teamCount; $tc++) {
                $arr = [];
                $post = $_p;
                $bp = $_p["bp_{$tc}"];
                $pp = explode("!", $bp);
                $parr = [
                    "p" => "Other_order_view",
                    "uid" => $_p["uid"],
                    "langx" => $_p["langx"],
                    "odd_f_type" => $_p["odd_f_type"],
                    "gid" => $pp[2],
                    "gtype" => $pp[3],
                    "wtype" => $pp[4],
                    "chose_team" => $pp[6]
                ];
                $failErrorAry = [
                  "gid" => $pp[2],
                  "gtype" => $pp[3]
                ];
                if (strtoupper($pp[3]) == "FT") {
                    $parr["p"] = "FT_order_view";
                }

                $xx = $tf->get_curl_data($parr);
                $xxs[] = $xx;
                if (empty($xx)) {
                    $arr = ["code" => "555", "errormsg" => "1X009", "errorvalue" => "读取失败"];
                    $isOk++;
                } else {
                    if (isset($xx["status"]) && $xx["status"] == "error") {
                        $arr = $xx;
                        $arr["code"] = "555";
                        $arr["errorvalue"] = $xx["msg"];
                        $arr["errormsg"] = $xx["msg"];
                        $isOk++;
                    }
                }

                if(count($arr)>0){
                    $fail.= "<betslip id='gid_{$pp[2]}'>";
                    foreach ($failErrorAry as $k =>$v){
                        $fail .= "<{$k}>{$v}</{$k}>";
                    }

                    foreach ($arr as $k => $v) {
                        if ($k != 'nowcredit' && !isset($failErrorAry[$k])) {
                            $fail .= "<{$k}>{$v}</{$k}>";
                        }
                    }
                    $fail .= "</betslip>";
                    continue;
                }

                $code = $tf->getXmlNode($xx, "code");
                if (empty($code) || $code != "501") {
                    $arr = [
                        "code" => $code,
                        "errormsg" => $tf->getXmlNode($xx, "errormsg"),
                        "errorvalue" => $code,
                        "gid"=>$pp[2],
                        "dates" => $tf->getXmlNode($xx, "dates"),
                        "systime" => $tf->getXmlNode($xx, "systime")
                    ];
                    $isOk++;
                }

                if(count($arr)>0){
                    $fail.= "<betslip id='gid_{$pp[2]}'>";
                    foreach ($failErrorAry as $k =>$v){
                        $fail .= "<{$k}>{$v}</{$k}>";
                    }
                    foreach ($arr as $k => $v) {
                        if ($k != 'nowcredit' && !isset($failErrorAry[$k])) {
                            $fail .= "<{$k}>{$v}</{$k}>";
                        }
                    }
                    $fail .= "</betslip>";
                    continue;
                }

                $bet = new Bet($parr);

                $post["golds"] = $pp[1];
                $post["gid"] = $pp[2];
                $post["gtype"] = $pp[3];
                $post["wtype"] = $pp[4];
                $post["rtype"] = $pp[5];
                $post["chose_team"] = $pp[6];
                $post["ioratio"] = $pp[7];
                $post["con"] = $pp[8];
                $post["ratio"] = $pp[9];
                $post["isRB"] = $pp[10];
                $post["imp"] = $pp[11];
                $view_xml = $bet->order_view($xx);
                $arr = $bet->All_bet($view_xml, $post);
                if($arr["code"]!="560"){
                    $fail.= "<betslip id='gid_{$pp[2]}'>";
                    foreach ($failErrorAry as $k =>$v){
                        $fail .= "<{$k}>{$v}</{$k}>";
                    }
                    foreach ($arr as $k => $v) {
                        if ($k != 'nowcredit' && !isset($failErrorAry[$k])) {
                            $fail .= "<{$k}>{$v}</{$k}>";
                        }
                    }
                    $fail .= "</betslip>";
                }else{
                    $success .= "<betslip id='gid_{$pp[2]}'>";
                    foreach ($arr as $k => $v) {
                        if ($k != 'nowcredit') {
                            $success .= "<{$k}>{$v}</{$k}>";
                        }
                    }
                    $success .= "</betslip>";
                }


            }
        }
        if(!empty($success)){//成功注单
            $success = "<success>{$success}</success>";
        }

        if(!empty($fail)){//下注失败注单
            $fail = "<fail>{$fail}</fail>";
        }
        $success.= $fail;


        //串关下注
        $arr = [];
        $success.= "<parlay>";
        if(!isset($_p["bp_p3"])){
            $success.= "noBet";
            if($isOk == $teamCount){//所有单注都错误
                $arr = [];
                $arr["code"] = 555;
                $arr["errorvalue"] = $arr["errormsg"];
                $arr["errormsg"] = "betError000";
                exit($xml->toXml($arr));
            }
        }else{
            $bet = new Bet($_p);
            $bp_p3 = $_p["bp_p3"];
            //10cc97f7c046cc4c881629158e09002f70234daecacdf38a8edba6979baecba8@P3@1@FT@4914247!MH!H!0!1340!1.33!2021-07-19^4914257!PRH!H!0!-50!1.93!2021-07-19^4921824!HPOUC!H!1!50!1.92!2021-07-19^4903056!HPOUC!H!1!0!1.89!2021-07-19^@100@
            $bps = explode("@",$bp_p3);
            $arr = $bet->All_bet_p3();


            if(is_array($arr)){
                if($arr["errormsg"]=="1X034"){
                    $success.= "<code>555</code>";
                    $success.= "<errormsg>1X034</errormsg>";
                    foreach ($arr["errorGame"] as $gg){
                        $success.="<errorGame>{$gg}</errorGame>";
                    }
                }else {
                    $xml_arr = $xml->toXml($arr);
                    $success .= $tf->getXmlNode($xml_arr, "serverresponse");

                }
                $success.="<gtype>{$bps[3]}</gtype>";
                $isOk++;

            }else{
                $success.= $arr;
            }


        }
        $success.= "</parlay>";
        $bs = new Base($_p);
        $urs = $bs->getUID();
        $nowcredit = 0;
        if($urs["status"]=="success"){
            $nowcredit = $urs["user"]["balance_credit"];
        }
        $xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $xml.= "<serverresponse>";
        $xml.= "<nowcredit>{$nowcredit}</nowcredit>";
        $xml.= $success;
        $xml.= "</serverresponse>";
        exit($xml);
        break;
    case "get_account_set":
        header('Content-Type: text/xml');
        $order = new Order($_p);
        $arr = $order->get_account_set();
        exit($xml->toXml($arr));
        break;
    default:
        echo $_p["p"];
        //error_400();exit;
        break;
}


foreach ($jsAry as $v){
    $js .= getFileTxt($v);
    $js .= "\n";
}

$cdnUrl = "http://".$PHP_domain;//cdn地址把图片和样式存在cdn
$html = getFileTxt($fileDir);
$html = str_replace('{PHPDOMAIN}',$PHP_domain,$html);
$html = str_replace('{JS}',$js,$html);
$html = str_replace('{CDNURL}',$css,$html);
print_r($html);exit;