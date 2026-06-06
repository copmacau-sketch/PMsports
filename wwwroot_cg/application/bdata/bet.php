<?php
header('Content-type: text/html;charset=utf-8');
include_once "include/config.php";
global $db_c,$db_s,$webdb,$curlTypes;
//https://www.hga025.com/app/member/FT_order/FT_order_all.php?gold=50&autoOdd=Y&uid=p1joqehtm23833844l52133b1&langx=zh-cn&active=1&line_type=3&gid=4766651&type=H&gnum=11656&concede=0&radio=0&ioradio=0.59&gmax_single=20000&gmin_single=50&singlecredit=1100000&singleorder=330000&restsinglecredit=0&wagerstotal=1100000&restcredit=100&pay_type=1&odd_f_type=H&wtype=RE&rtype=REH&gametype={GAMETYPE}&=10&imp=N&ptype=&timestamp2=d81d7c44126c940ddd5b720875ca6d4e&timestamp=1617070161939
$curl = new Curl_HTTP_Client();
$curl->set_user_agent("Mozilla/5.0 (Windows NT 6.1; Win64; x64)");
//gamePoint_23833844=2021-03-29%2A0%2A0; _gat_UA-75448111-1=1; login_23833844=1617071476
$curlDB = curl_rand_user($webdb,"after");
if($curlDB) {
    //$curlDB["pcurl"],$curlDB["uid"],$curlDB["mid"]
    $url = "http://w986.hga030.com/app/member/FT_order/FT_order_all.php?";
    $post =  [
        "gid" => 4763415,
        "uid" => "p1joqehtm23833844l52133b1",
        "odd_f_type"=>"H",
        "type"=>"C",
        "gnum"=>21017,
        "strong"=>"C",
        "langx"=>"zh-cn",
        "ptype"=>"",
        "imp"=>"N",
        "rtype"=>"RC",
        "wtype"=>"R"
    ];

    $html = $curl->send_post_data($url,$post,"",5);
    $html = str_replace("script","",$html);

    preg_match("/\<input type=\"hidden\" name=\"timestamp2\" value=\"(.*?)\">/is",$html,$timestamp2);

    $time = explode (" ", microtime() );
    $time = $time [1] . ($time [0] * 1000);
    $time2 = explode ( ".", $time );
    $time = $time2 [0];

    $p = [
        "gold"=>100,
        "autoOdd"=>"Y",
        "uid"=>"p1joqehtm23833844l52133b1",
        "langx"=>"zh-cn",
        "active"=>1,
        "line_type"=>3,
        "gid"=>4763415,
        "type"=>"C",
        "gnum"=>21017,
        "concede"=>0,
        "radio"=>0,
        "ioradio"=>0.76,
        "gmax_single"=>20000,
        "gmin_single"=>50,
        "singlecredit"=>1100000,
        "singleorder"=>330000,
        "restsinglecredit"=>0,
        "wagerstotal"=>1100000,
        "restcredit"=>100,
        "pay_type"=>1,
        "odd_f_type"=>"H",
        "wtype"=>"R",
        "rtype"=>"RC",
        "gametype"=>'{GAMETYPE}',
        ""=>10,
        "imp"=>"N",
        "ptype"=>"",
        "timestamp2"=>$timestamp2[1],
        "timestamp"=>$time

    ];

    $ss = $curl->send_post_data($url,$p,"",5);
    $ss = str_replace("script","",$ss);
    print_r($ss);exit;
}
?>
<form name="LAYOUTFORM" action="/app/member/FT_order/FT_order_all.php" method="post" onsubmit="return false">
<div class="ord_main">
   <div class="ord_DIV">

     <!--div class="ord_returnBTN">返回体育项目</div-->

		<!--注单文字区-->
		<div class="ord_betAreaG">
		<h1>单一投注</h1>

	    	<!--普通注单--><!--一般状态ord_betArea 比分改变时ord_betArea_C-->
			<div id="ord_bet" class="ord_betArea">



				<!-- Module -->

		    	<!-- model_HM -->
		    	<div id="model_HM" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{TEAM_S} @ <span id="ioradio_id_HM" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


				<!-- model_DT -->
		    	<div id="model_DT" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{RADIO_S} @ <span id="ioradio_id_DT" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>

		        <!-- model_F -->
		    	<div id="model_F" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
					</ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{RADIO_A} @ <span id="ioradio_id_F" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>

		        <!-- model_FS -->
		    	<div id="model_FS" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">{FSTYPE}</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">(滚球) 让球</li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">卡利体育会  @ <span id="ioradio_id_FS" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_HOU -->
		    	<div id="model_HOU" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_STR}</tt> <tt class="RedWord fatWord">{CONCEDE_OK}</tt> @ <span id="ioradio_id_HOU" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_HPD -->
		    	<div id="model_HPD" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{RADIO_S}{RADIO_A} @ <span id="ioradio_id_HPD" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_HR -->
		    	<div id="model_HR" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			           <li class="dark_BrownWord">卡利体育会  <tt class="RedWord fatWord">0.5</tt><tt class="ord_vWordNO"> v </tt>柏斯度  <tt class="RedWord fatWord"></tt></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">卡利体育会  @ <span id="ioradio_id_HR" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_HROU -->
		    	<div id="model_HROU" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度  <span class="BlueWord">(1:1)</span></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_STR}</tt> <tt class="RedWord fatWord">{CONCEDE_OK}</tt> @ <span id="ioradio_id_HROU" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_HRPD -->
		    	<div id="model_HRPD" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{RADIO_S}{RADIO_A} @ <span id="ioradio_id_HRPD" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_M -->
		    	<div id="model_M" style="display:none;">
			        <ul class="ord_betArea_wordTop">
		        		<!-- 2016-12-14 足球多type所有細單改位罝顯示  -->
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{TEAM_S} @ <span id="ioradio_id_M" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_M15 -->
		    	<div id="model_M15" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{TEAM_S}</tt> @ <span id="ioradio_id_M15" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_OU -->
		    	<div id="model_OU" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度  <span style="{DISPLAY_SCORE}" class="BlueWord">(1:1)</span></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_STR}</tt> <tt class="RedWord fatWord">{CONCEDE_OK}</tt> @ <span id="ioradio_id_OU" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_OU15 -->
		    	<div id="model_OU15" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_STR}</tt> <tt class="RedWord fatWord">{CONCEDE_OK}</tt> @ <span id="ioradio_id_OU15" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_OUHC -->
		    	<div id="model_OUHC" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_STR}</tt> <tt class="RedWord fatWord">{CONCEDE_OK}</tt> @ <span id="ioradio_id_OUHC" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>



				<!-- model_PD -->
		    	<div id="model_PD" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<!-- 2016-12-14 足球多type所有細單改位罝顯示  -->
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{RADIO_S}{RADIO_A} @ <span id="ioradio_id_PD" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_R -->
		    	<div id="model_R" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会  <tt class="RedWord fatWord">0.5</tt><tt class="ord_vWordNO"> v </tt>柏斯度  <tt class="RedWord fatWord"></tt></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">卡利体育会  @ <span id="ioradio_id_R" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_R15 -->
		    	<div id="model_R15" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord"><tt>卡利体育会 </tt> <tt class="redFatWord fatWord">0.5</tt><tt class="ord_vWordNO"> v </tt><tt>柏斯度 </tt> <tt class="redFatWord fatWord"></tt></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>卡利体育会 </tt> @ <span id="ioradio_id_R15" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_RE -->
		    	<div id="model_RE" style="">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会  <tt class="RedWord fatWord">0.5</tt><tt class="ord_vWordNO"> v </tt>柏斯度  <tt class="RedWord fatWord"></tt> <span class="BlueWord">(1:1)</span></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">卡利体育会  @ <span id="ioradio_id_RE" class="ord_scChange">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_RE15 -->
		    	<div id="model_RE15" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord"><tt>卡利体育会 </tt> <tt class="redFatWord fatWord">0.5</tt><tt class="ord_vWordNO"> v </tt><tt>柏斯度 </tt> <tt class="redFatWord fatWord"></tt></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>卡利体育会 </tt> @ <span id="ioradio_id_RE15" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_RM -->
		    	<div id="model_RM" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度  </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{TEAM_S} @ <span id="ioradio_id_RM" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_RM15 -->
		    	<div id="model_RM15" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{TEAM_S}</tt> @ <span id="ioradio_id_RM15" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_ROU -->
		    	<div id="model_ROU" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度  <span class="BlueWord">(1:1)</span></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_STR}</tt> <tt class="RedWord fatWord">{CONCEDE_OK}</tt> @ <span id="ioradio_id_ROU" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_ROU15 -->
		    	<div id="model_ROU15" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度  <span class="BlueWord">(1:1)</span></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_STR}</tt> <tt class="RedWord fatWord">{CONCEDE_OK}</tt> @ <span id="ioradio_id_ROU15" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_ROUHC -->
		    	<div id="model_ROUHC" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度  <span class="BlueWord">(1:1)</span></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_STR}</tt> <tt class="RedWord fatWord">{CONCEDE_OK}</tt> @ <span id="ioradio_id_ROUHC" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_HRE -->
		    	<div id="model_HRE" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会  <tt class="RedWord fatWord">0.5</tt><tt class="ord_vWordNO"> v </tt>柏斯度  <tt class="RedWord fatWord"></tt> <span class="BlueWord">(1:1)</span></li>
		            </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">卡利体育会  @ <span id="ioradio_id_HRE" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_HRM -->
		    	<div id="model_HRM" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度  <tt class="RedWord fatWord">{RADIO_OK}</tt> </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{TEAM_S} @ <span id="ioradio_id_HRM" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_RPD -->
		    	<div id="model_RPD" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{RADIO_S}{RADIO_A} @ <span id="ioradio_id_RPD" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_SINGLE -->
		    	<div id="model_SINGLE" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_STR}</tt> @ <span id="ioradio_id_SINGLE" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_SP -->
		    	<div id="model_SP" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_A}</tt> @ <span id="ioradio_id_SP" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_T -->
		    	<div id="model_T" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度  <tt class="RedWord fatWord">{RADIO_STR}</tt></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">{RADIO_S} @ <span id="ioradio_id_T" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_W3 -->
		    	<div id="model_W3" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWord">v</tt>柏斯度 </li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin">卡利体育会  <tt class="RedWord fatWord">{RADIO_OK}</tt> @ <span id="ioradio_id_W3" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>


		        <!-- model_DOUBLE -->
		    	<div id="model_DOUBLE" style="display:none;">
			        <ul class="ord_betArea_wordTop">
			        	<li class="BlueWord">(滚球) 让球</li>
			            <li class="light_BrownWord upperWord">哥伦比亚甲组联赛</li>
			            <li class="dark_BrownWord">卡利体育会 <tt class="ord_vWordNO"> v </tt>柏斯度  <span class="BlueWord" style="{DISPLAY_SCORE}">(1:1)</span></li>
			        </ul>
			        <ul class="ord_betArea_wordBottom">
			        	<li class="dark_BrownWord no_margin"><tt>{RADIO_STR}</tt> @ <span id="ioradio_id_DOUBLE" class="redFatWord">1.08</span></li>
			        </ul>
		        </div>



		    </div>












	        <!--注单功能区-->
	        <div class="ord_betFuntion">
	    	<!--手动输入数字-->
	    	<div class="ord_enterNUMG">
	        	<div class="ord_NUM noFloat"><input id="gold" name="gold" type="text" placeholder="投注额" onkeypress="return CheckKey(event)" onkeyup="return CountWinGold()" size="8" maxlength="10"><span class="ord_delBTN" id="order_delBTN"></span></div>
	            <div class="ord_SUM"><span class="ord_SUM_L">可赢金额:</span><span id="pc" class="ord_SUM_R">0.00</span></div>

	        </div>

	    	<!--按钮输入数字-->
	    	<div class="ord_enterBTNG noFloat">
	        	<span id="moenyBTN_01" class="">100</span><span id="moenyBTN_02" class="">200</span><span id="moenyBTN_03" class="">500</span><span id="moenyBTN_04" class="">1,000</span><span id="moenyBTN_05" class="">2,500</span><span id="moenyBTN_06" class="">5,000</span>
	        </div>

	        <!--错误警告-->
	        <div id="ord_warn" class="ord_warnG" style="display: none;"><span class="day_text"></span></div>

	        <!--确定下注区-->
	        <div class="ord_TotalAreaG">
	        	<span id="Submit" class="ord_betBTN" onclick="CountWinGold();return SubChk();">确定交易</span><!--字数两行ord_betBTN02  不能按ord_betBTN_off-->
	            <span id="btnCancel" name="btnCancel" class="ord_cancalBTN" onclick="parent.close_bet();">取消</span>

	            <table cellspacing="0" cellpadding="0" class="ord_TotalTXT">
	              <tbody><tr>
	                <td width="40%">单注最低:</td>
	                <td width="60%" class="Word_Toright">50</td>
	              </tr>
	              <tr>
	                <td>单注最高:</td>
	                <td class="Word_Toright">27,770</td>
	              </tr>
	            </tbody></table>
	        </div>

	        <!--自动接受更好赔率-->
	        <div class="ord_AutoOddG noFloat">
	        	<input id="autoOdd" name="autoOdd" onclick="onclickReloadAutoOdd()" value="Y" class="ord_checkBox" type="checkbox"><span>自动接受较佳赔率</span>
	        </div>
	    </div>

	</div>





    <!--交易遮罩-->
    <div id="confirm_div" class="ord_DIV_Mask" style="display:none" onkeypress="SumbitCheckKey(event)" tabindex="1">
    	<!--交易确认单-->
    	<div id="ord_conf" class="ord_confirmation">
        <h1>投注确认</h1>
        <ul>
        	<li>交易金额: <tt id="confirm_gold" class="dark_BrownWord">50.00</tt></li>
        	<li>可赢金额: <tt id="confirm_wingold" class="GreenWord">45.00</tt></li>
            <li id="confirm_msg">确定进行下注吗?</li>
        </ul>
        <div class="ord_miniBTNG">
        <span id="confirm_bet" onclick="betConfirmEvent();" class="ord_betBTN">确定下注</span>
        <span id="confirm_cancel" onclick="cancelConfirmEvent();" class="ord_cancalBTN">取消</span>
        </div>
        </div>

    </div>
<?
/*gold=50
autoOdd=Y
uid=p1joqehtm23833844l52133b1
langx=zh-cn
active=1
line_type=3
gid=4766651
type=H
gnum=11656
concede=0
radio=0
ioradio=0.59
gmax_single=20000
gmin_single=50
singlecredit=1100000
singleorder=330000
restsinglecredit=0
wagerstotal=1100000
restcredit=100
pay_type=1
odd_f_type=H
wtype=RE
rtype=REH
gametype={GAMETYPE}
=10
imp=N
ptype=
timestamp2=d81d7c44126c940ddd5b720875ca6d4e
f8e41ccfdbb1b352ec4e4a4363f11c69
timestamp=1617070161939*/
//gid=4760563&uid=p1joqehtm23833844l52133b1&odd_f_type=H&type=C&gnum=11085&strong=&langx=zh-cn&ptype=&imp=N&rtype=REC&wtype=RE
//'gid=4760563&amp;uid=p1joqehtm23833844l52133b1&amp;odd_f_type=H&amp;type=H&amp;gnum=11086&amp;strong=&amp;langx=zh-cn&amp;ptype=&amp;imp=N&amp;rtype=REH&amp;wtype=RE','REH^4760563');" title="卡利体育会">1.00</a>
?>


    <input type="hidden" name="uid" value="p1joqehtm23833844l52133b1">
	<input type="hidden" name="langx" value="zh-cn">
	<input type="hidden" name="active" value="1">
	<input type="hidden" name="line_type" value="3">
	<input type="hidden" name="gid" value="4760563">
	<input type="hidden" name="type" value="H">
	<input type="hidden" name="gnum" value="11086">

	<!--<input type="hidden" name="concede_h" value="{CONCEDE_H}">
	<input type="hidden" name="radio_h" value="0.5">
	<input type="hidden" id="ioradio_r_h" name="ioradio_r_h" value="1.08">-->
	<input type="hidden" name="concede" value="1">
	<input type="hidden" name="radio" value="100">
	<input type="hidden" id="ioradio_all" name="ioradio" value="1.08">

	<input type="hidden" name="gmax_single" id="gmax_single" value="27770">
	<input type="hidden" name="gmin_single" value="50">
	<input type="hidden" name="singlecredit" value="1100000">
	<input type="hidden" name="singleorder" value="330000">
	<input type="hidden" name="restsinglecredit" value="0">
	<input type="hidden" name="wagerstotal" value="1100000">
	<input type="hidden" name="restcredit" value="50">
	<input type="hidden" name="pay_type" value="1">
	<input type="hidden" name="odd_f_type" value="H">
	<input type="hidden" name="wtype" value="RE">

	<input type="hidden" name="rtype" value="REH">
	<input type="hidden" name="gametype" value="{GAMETYPE}">

    <input style="display:none;" type="checkbox" id="checkOrder" onclick="onclickReloadTime()" value="10">
    <div id="gWager" style="display: none;position: absolute;"></div>



    <!-- 2016-12-14 足球多type所有细单改位罝显示  -->
    <input type="hidden" name="imp" value="N">
	<input type="hidden" name="ptype" value="">
	<input type="hidden" name="timestamp2" value="628bb2b6d374d128b09bf5cccb856a90">



    </div>
</div>
</form>

