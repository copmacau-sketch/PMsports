function today_wagers(_win, _dom, _post){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object();
    var util;
    var ratioForm;
    var LS_code;
    var _mc = new Object();
    var tag = "•";
	var xmlnode;
	var config_set;

    var gtype_array = new Array("ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS","ES");//todaywagers,cncelwagers,history
    var _amout_gold = 0;
    var _nowPage = 1;
	var _pageCount = 10;
	var danAry_normal = new Array();
	var danAry_parlay = new Array();
	var bhold_normal = new Array();
	var bhold_parlay = new Array();
    var wid_ary = new Array();
    var amout_goldObj;
    var total_accountsObj;
	var bottom_topObj;
	var tool_backtop;//用來隱藏回到頂端
	var noTodayWagersObj;
	var sportsdropdownObj;
	var allsportsObj;
    var timerObj = new Object();
	var util_game = new win.Util_game(win, dom);

    _self.init=function(){
        //console.log("today_wagers OK");
		//parentClass.dispatchEvent("showLoading", {"isShow":false});

		allsportsObj = document.getElementById("allsports");
        amout_goldObj = dom.getElementById("amout_gold");
        total_accountsObj = document.getElementById("total_accounts");
		bottom_topObj = dom.getElementById("backtop");
		tool_backtop = dom.getElementById("tool_backtop");
		noTodayWagersObj = dom.getElementById("noTodayWagers");
		util.addEvent(dom.getElementById("title_creditlogs"), "click", _self.chgPage, { "page": "credit_logs" });//切換現金
        util.addEvent(dom.getElementById("title_history"), "click", _self.chgPage, { "page": "history_data" });//切換帳戶歷史
		util.addEvent(bottom_topObj, "click", _self.backTop);//回到頂端
		if(top.mobile!="Y"){ // PC
			util.addEvent(dom.getElementById("pc_gtype_sel_div"), "click", _self.initGtypeSelect);
		}else{ //PH
			sportsdropdownObj = dom.getElementById("gtype_sel");
			util.addEvent(sportsdropdownObj, "blur", _self.selectBlur);
			util.addEvent(sportsdropdownObj, "change", _self.chgGtype); //球類拉霸
		}
		util.addEvent(allsportsObj, "click", _self.showViewMore); //顯示更多
        util.addEvent(dom.getElementById("backpage"), "click", _self.toBack);//回上頁
		top.wagerGtype = "ALL";
		_self.clearTimer();
		_self.createTimer();
		_self.loadTodayWager();

		if(top.mobile == "N"){
			util.addEvent(dom.getElementById("body_show"), "scroll", _self.roll,_self.getNowPage());
		}
		
		win.addEventListener("orientationchange", _self.orientationChange);
		//1459.ios-畫面大於640-交易狀況/帳戶歷史-點擊過所有運動的拉霸收起後,轉動畫面拉霸會跟著展開
		//2481.ios13-UC瀏覽器-所有拉霸點開後會馬上收起
		util.selectresizeblur(_self.orientationChange);
    }
    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
		util = parentClass.getThis("util");
		LS_code = parentClass.getThis("LS_code");
		config_set = parentClass.getThis("config_set");
		LS = parentClass.getThis("LS")
        //ratioForm = parentClass.getThis("ratioForm_Single_rule"); 
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

    _self.chgPage = function (e, param) {
		if(param.page == "history_data"){//歷史 header & bottom 亮色
			if (dom.getElementById("menu_history")) {
				dom.getElementById("menu_history").classList.add("on");
			}
			
			dom.getElementById("menu_todaywagers").classList.remove("on");
			dom.getElementById("header_todaywagers").classList.remove("on");
			dom.getElementById("header_historydata").classList.add("on");
		}else{//跑 現金額度修改紀錄 歷史&交易 不亮色
			if (dom.getElementById("menu_history")) {
				dom.getElementById("menu_history").classList.remove("on");
			}
			
			dom.getElementById("menu_todaywagers").classList.remove("on");
			dom.getElementById("header_todaywagers").classList.remove("on");
			dom.getElementById("header_historydata").classList.remove("on");
		}
		
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.initGtypeSelect = function (e, param) {
		var obj = dom.getElementById("pc_gtype_sel_div");
        if (obj.classList.contains("on")){
            obj.classList.remove("on");
        }else{
            obj.classList.add("on");
        	util.pcDropdowns("pc_gtype_sel_div","pc_gtype_sel_ul");//(class控制,focus目標)  PC下拉選單class開關 => on
		}
		var gtypeTxt = dom.getElementById("gtypeTxt").innerHTML;
        for(var i=0; i< gtype_array.length; i++){
			var gtypeObj = dom.getElementById(gtype_array[i]);
			if(gtypeTxt==gtypeObj.innerHTML){
				gtypeObj.classList.add("on");//目前選擇gtype加上on
			}else if(gtypeObj.classList.contains("on")){
				gtypeObj.classList.remove("on");//刪除之前選擇gtype的on
			}
			util.addEvent(gtypeObj, "click", _self.chgGtype, {"id":gtype_array[i]});
		}	
	}
	
	_self.selectBlur = function(){
		parentClass.dispatchEvent("scrollsetTop");
	}

	_self.toBack = function () {
        parentClass.dispatchEvent("backPage", {});
	};

    _self.chgGtype = function (e,param) {
		//parentClass.dispatchEvent("scrollsetTop");
		if(top.mobile!="Y"){//PC
			top.wagerGtype = param.id;
		}else{
			top.wagerGtype = dom.getElementById("gtype_sel").value;
		}
		dom.getElementById("gtypeTxt").innerHTML = e.target.innerHTML;
		_self.chgGtypeLoading(true);//2020-11-26 Q2 160.交易狀況/帳戶歷史內外層-切換日期或球類時，拉霸下方幫加罩loading（因單量多會等一陣子才換過去)
        _self.loadTodayWager();
    }   

    _self.backTop = function (e, param) {
		document.getElementById("body_show").scrollTop = 0;
    }    

	_self.showViewMore=function(){
		_nowPage++;
		_self.doParseTodayWagers();
	}

	_self.langx2LS = function(langx){
		if(langx == "zh-tw")return "c";
		if(langx == "zh-cn")return "g";
		if(langx == "en-us")return "e";
	}

	_self.createTimer = function(){
		//console.log("todayTimer Create");
		var _name = "todayTimer";
		if(timerHash[_name]!=null) return;
		timerHash[_name] = new Timer(config_set.get("CONFIG_TODAY_WAGERS"));
		timerHash[_name].setParentclass(_self);
		timerHash[_name].init();
		timerHash[_name].addEventListener("TimerEvent.TIMER", _self.timerRun);
		timerHash[_name].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish);
		timerHash[_name].startTimer();
	}

	_self.clearTimer=function(){
		if(timerHash!=null){
			var _name = "todayTimer";
			if(timerHash[_name]!=null){
				timerHash[_name].clearObj();
				timerHash[_name].is_clear = true;
				timerHash[_name]=null;
			}
		}
		return true;
	}

	_self.timerRun=function(count){
		_self.loadTodayWager();
	}

	_self.timerFinish=function(count){

	} 

	_self.loadTodayWager=function(){
        var urlParams = "";
        urlParams += "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&LS=" + _self.langx2LS(langx);
        urlParams += "&selGtype=" + top.wagerGtype; //先預設ALL
        urlParams += "&chk_cw=N"; //先預設"N"
        //urlParams = "p=get_today_wagers&ver=" + top.ver + "&" + urlParams;
        urlParams = "p=get_today_wagers&" + urlParams;
        
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete",_self.loadTodayWagerComplete);
		getHTML.loadURL(top.m2_url,"POST",urlParams);
    }
   
    _self.onError=function(){
        //console.log("get_today_wagers fail");
    }    

	_self.loadTodayWagerComplete=function(xml){		
		var errorMsg = util.showConnectMsg(xml);
		if(util.alertConnectMsg(errorMsg))  return;
		xmlnode=util.parseXml(xml);		
		var xmdObj = new Object();
		
		xmdObj["code"] = xmlnode.Node(xmlnode.Root[0],"code");
		var pay_type = xmlnode.Node(xmlnode.Root[0],"pay_type").innerHTML;
		var title_creditlogs = dom.getElementById("title_creditlogs");
		if(title_creditlogs){
			if(pay_type != 1 && title_creditlogs.parentNode)title_creditlogs.parentNode.removeChild(title_creditlogs);
			else title_creditlogs.style = "";
		}
		// 2017-10-05 CRM-236加強版手機 - menu的count計時器關閉,由此處更新筆數
		var wagers_count = xmlnode.Node(xmlnode.Root[0],"count").innerHTML;

		if(xmdObj["code"].innerHTML == "todaywagers"){
			
				div_show = dom.getElementById("div_show");
				
				if(div_show==null) return;
				div_show.innerHTML = "";
				
				// for(var k=0; k< danAry_normal.length; k++){
				// 	var divObj = dom.getElementById("div_"+danAry_normal[k]);
                //     util.removeEvent(divObj, "click");
				// }
				// danAry_normal.length = 0;	
				
				// for(var k=0; k< danAry_parlay.length; k++){
				// 	var divObj = dom.getElementById("div_"+danAry_parlay[k]);
                //     util.removeEvent(divObj, "click");
				// }
				// danAry_parlay.length = 0;
				
				_amout_gold = 0;
				
				_self.doParseTodayWagers();
		}
		parentClass.dispatchEvent("showLoading", {"isShow":false});
		util.addEvent(dom.getElementById("body_show"), "scroll", _self.roll,_self.getNowPage());
	}
	
	_self.doParseTodayWagers=function(){
        var ratioForm = new win.ratioForm_Single_rule();

		var xmdObj = new Object();
		xmdObj["code"] = xmlnode.Node(xmlnode.Root[0],"code");
		//console.log(xmdObj["code"]);
		if(xmdObj["code"].innerHTML == "todaywagers"){

			xmdObj["amout_gold"] = xmlnode.Node(xmlnode.Root[0],"amout_gold").innerHTML;
			xmdObj["wagers"] = xmlnode.Node(xmlnode.Root[0],"wagers",false);
			
			var tmp_screen = "";
			var from = 0;
			var limit = _nowPage * _pageCount;
			var totalLength = xmdObj["wagers"].length;
			//console.log("_pageCount:"+_pageCount);
			//console.log("_nowPage:"+_nowPage);
			//console.log("limit:"+limit);
			console.log(totalLength);
			if(totalLength >= 1){//
				_self.showNoTodayWagers(false);
				
				if(limit > totalLength)	limit = totalLength;
				_amout_gold=xmdObj["amout_gold"];
				for(var i=from; i<limit; i++){
					xmdObj["wagers_sub"] = xmlnode.Node(xmdObj["wagers"][i],"wagers_sub",false);
					
					w_id = xmlnode.Node(xmdObj["wagers"][i],"w_id").innerHTML;
					t_id = _self.replaceOU(util.showTxt(w_id));
					addtime = xmlnode.Node(xmdObj["wagers"][i],"addtime").innerHTML;
					oddf_type = xmlnode.Node(xmdObj["wagers"][i],"oddf_type").innerHTML;
					gtype = xmlnode.Node(xmdObj["wagers"][i],"gtype").innerHTML;
					w_ms = xmlnode.Node(xmdObj["wagers"][i],"w_ms").innerHTML;
					wtype = xmlnode.Node(xmdObj["wagers"][i],"wtype").innerHTML;
					//Ricky 2017-07-21 CRM-230 單盤（without spread）玩法賠率的四捨五入邏輯（會員端）
					bet_wtype = xmlnode.Node(xmdObj["wagers"][i],"bet_wtype").innerHTML;
					gold = xmlnode.Node(xmdObj["wagers"][i],"gold").innerHTML;
					win_gold = xmlnode.Node(xmdObj["wagers"][i],"win_gold").innerHTML;
					win_gold = util.showTxt(win_gold);
					gold = util.showTxt(gold);
					main_ball_act_ret = xmlnode.Node(xmdObj["wagers"][i],"main_ball_act_ret").innerHTML;
					main_ball_act_class = xmlnode.Node(xmdObj["wagers"][i],"main_ball_act_class").innerHTML;
					cancel_line = xmlnode.Node(xmdObj["wagers"][i],"cancel_line").innerHTML;	
					delaysec = xmlnode.Node(xmdObj["wagers"][i],"delaysec").innerHTML;
					isballact = xmlnode.Node(xmdObj["wagers"][i],"ballact").innerHTML;
					var div_model = "";
					if(xmdObj["wagers_sub"].length >= 1){//P
						var p_display = dom.getElementById("p_display").innerHTML;
						var p_title_model = dom.getElementById("p_title_model").innerHTML;
						p_title_model = p_title_model.replace("<XMP>","").replace("</XMP>","").replace("<xmp>","").replace("</xmp>","");
						p_title_model = p_title_model.replace(/\*NUM\*/g,xmdObj["wagers_sub"].length);
						ball_act_ret = xmlnode.Node(xmdObj["wagers"][i],"ball_act_ret").innerHTML;
						ball_act_class = xmlnode.Node(xmdObj["wagers"][i],"ball_act_class").innerHTML;
						//2020-05-05 2499.交易狀況-危險球單(單一投注&過關)-當有取消原因時，危險球確認會消失不見帳戶歷史相同狀況，危險球確認有出現，但取消原因會消失>>同c1 bug 區(786)
						dg = xmlnode.Node(xmdObj["wagers"][i],"dg").innerHTML;
						dg_str = xmlnode.Node(xmdObj["wagers"][i],"dg_str").innerHTML;

						p_display = p_display.replace("<XMP>","").replace("</XMP>","").replace("<xmp>","").replace("</xmp>","");
						p_display = p_display.replace(/\*TID\*/g, t_id);
						p_display = p_display.replace(/\*P_TITLE\*/g, p_title_model);
						
						var p_tmp_screen = "";
						for(var j=0; j<xmdObj["wagers_sub"].length; j++){
							league = xmlnode.Node(xmdObj["wagers_sub"][j],"league").innerHTML;
							team_h_show = xmlnode.Node(xmdObj["wagers_sub"][j],"team_h_show").innerHTML;
							team_c_show = xmlnode.Node(xmdObj["wagers_sub"][j],"team_c_show").innerHTML;
							team_h_ratio = xmlnode.Node(xmdObj["wagers_sub"][j],"team_h_ratio").innerHTML;
							team_c_ratio = xmlnode.Node(xmdObj["wagers_sub"][j],"team_c_ratio").innerHTML;
							ratio = xmlnode.Node(xmdObj["wagers_sub"][j],"ratio").innerHTML;
							org_score = xmlnode.Node(xmdObj["wagers_sub"][j],"org_score").innerHTML;
							score = xmlnode.Node(xmdObj["wagers_sub"][j],"score").innerHTML;
							result = xmlnode.Node(xmdObj["wagers_sub"][j],"result").innerHTML;
							pname = xmlnode.Node(xmdObj["wagers_sub"][j],"pname").innerHTML;
							ioratio = xmlnode.Node(xmdObj["wagers_sub"][j],"ioratio").innerHTML;
							p_ball_act_class = xmlnode.Node(xmdObj["wagers_sub"][j],"p_ball_act_class").innerHTML;
							date = xmlnode.Node(xmdObj["wagers_sub"][j],"date").innerHTML;							
							wtype_sub = xmlnode.Node(xmdObj["wagers_sub"][j],"wtype_sub").innerHTML;
							//Ricky 2017-07-21 CRM-230 單盤（without spread）玩法賠率的四捨五入邏輯（會員端）
							p_wtype = xmlnode.Node(xmdObj["wagers_sub"][j],"p_wtype").innerHTML;
							ms_sub = xmlnode.Node(xmdObj["wagers_sub"][j],"ms_sub").innerHTML;
							p_strong=xmlnode.Node(xmdObj["wagers_sub"][j],"strong").innerHTML;
							if(date != ""){
								var data_str = date.split("-");
								data_st = data_str[1].trim()+"-"+data_str[0].trim();
								tmp_league = (data_st == "")?league:(data_st+" "+league);
							}else{
								tmp_league = league;
							}
							var p_details_model = dom.getElementById("p_details_model").innerHTML;
							p_details_model = p_details_model.replace("<XMP>","").replace("</XMP>","").replace("<xmp>","").replace("</xmp>","");
							p_details_model = p_details_model.replace(/\*TID\*/g,util.showTxt(t_id));
							p_details_model = p_details_model.replace(/\*GTYPE\*/g,util.showTxt(gtype));
							p_details_model = p_details_model.replace(/\*W_MS\*/g,util.showTxt(ms_sub));
							p_details_model = p_details_model.replace(/\*WTYPE\*/g,util.showTxt(wtype_sub));
							p_details_model = p_details_model.replace(/\*LEAGUE\*/g,util.showTxt(tmp_league));
							p_details_model = p_details_model.replace(/\*TEAM_H_SHOW\*/g,util.showTxt(team_h_show));
							p_details_model = p_details_model.replace(/\*TEAM_C_SHOW\*/g,util.showTxt(team_c_show));
							
							if (team_h_show == "" && team_c_show == "") p_details_model = p_details_model.replace(/\*TEAM_ACT\*/g,
                                "display:none;");
                            else p_details_model = p_details_model.replace(/\*TEAM_ACT\*/g, "display:;");
                            var team_ratio = "";
						
                            //if (util_game.checkWtypeIsR(p_wtype)) {
                                var color = "word_yellow";
                                if (p_wtype == "W3") color = "word_red";
                                p_details_model = p_details_model.replace(/\*TEAM_H_RATIO\*/g, "");
                                p_details_model = p_details_model.replace(/\*TEAM_C_RATIO\*/g, "");
                                p_details_model = p_details_model.replace(/\*CHOICE_CON_CLASS\*/g, color);
                                team_ratio = team_h_ratio != "" ? team_h_ratio : team_c_ratio;
                                if (team_ratio != 0)
                                    if (p_strong == "Y") team_ratio = "+" + team_ratio;
                                    else team_ratio = "-" + team_ratio
                            //} else {
                             //   p_details_model = p_details_model.replace(/\*TEAM_H_RATIO\*/g, util.showTxt(team_h_ratio));
                              //  p_details_model = p_details_model.replace(/\*TEAM_C_RATIO\*/g, util.showTxt(team_c_ratio));
                              //  p_details_model = p_details_model.replace(/\*CHOICE_CON_CLASS\*/g, "word_red")
                          //  }*/
							//p_details_model = p_details_model.replace(/\*TEAM_H_RATIO\*/g,util.showTxt(team_h_ratio));
							//p_details_model = p_details_model.replace(/\*TEAM_C_RATIO\*/g,util.showTxt(team_c_ratio));
							p_details_model = p_details_model.replace(/\*ORG_SCORE\*/g,util.showTxt(org_score));
							p_details_model = p_details_model.replace(/\*SCORE\*/g,util.showTxt(score));
							
							if (p_ball_act_class=="cancel"){
								p_details_model = p_details_model.replace(/\*ANNOUCEMENT\*/g,"word_delline");
							}

							// 2017-11-24 CRM-236加強版手機 - 209.交易狀況/取消單/帳戶歷史-有球頭的玩法，球頭要秀紅色的
							if(util.checkWtypeIsOU(p_wtype)){
								var choice_blank = result.indexOf(" ");
								var choice_str = result.substr(0,choice_blank);
								var choice_con = result.substr(choice_blank,result.length-1);
								p_details_model = p_details_model.replace(/\*CHOICE_TEAM\*/g,util.showTxt(choice_str));
								p_details_model = p_details_model.replace(/\*CHOICE_CON\*/g,util.showTxt(choice_con));
							}else if(p_wtype=="W3"){
								//var choice_str = result.substr(0,result.length-2);
								//var choice_con = result.substr(result.length-2,result.length);
								//問題1512. 當球頭是10以上時，截取不完全
								var choiceAry = result.split(" ");
								var choice_con = choiceAry[choiceAry.length-1];
								var choice_str = result.split(choice_con)[0];
								p_details_model = p_details_model.replace(/\*CHOICE_TEAM\*/g,util.showTxt(choice_str));
								p_details_model = p_details_model.replace(/\*CHOICE_CON\*/g,util.showTxt(choice_con));
							}else{
								p_details_model = p_details_model.replace(/\*CHOICE_TEAM\*/g,util.showTxt(result));
								//p_details_model = p_details_model.replace(/\*CHOICE_CON\*/g,"");
								p_details_model = p_details_model.replace(/\*CHOICE_CON\*/g, team_ratio)
							}
							

							p_details_model = p_details_model.replace(/\*PNAME\*/g,util.showTxt(pname));
							//Ricky 2017-07-20 CRM-230 單盤（without spread）玩法賠率的四捨五入邏輯（會員端）
							p_details_model = p_details_model.replace(/\*IORATIO\*/g,util.showTxt(ratioForm.chgForm_Single_ratio(ioratio,p_wtype)));
							p_tmp_screen += p_details_model;
						}		
						p_display = p_display.replace(/\*P_CONTENT\*/g, util.showTxt(p_tmp_screen));
						
						var p_bottom_model = dom.getElementById("p_bottom_model").innerHTML;
						p_bottom_model = p_bottom_model.replace("<XMP>","").replace("</XMP>","").replace("<xmp>","").replace("</xmp>","");
						p_bottom_model = p_bottom_model.replace(/\*TID\*/g,util.showTxt(t_id));
						p_bottom_model = p_bottom_model.replace(/\*W_ID\*/g,util.showTxt(w_id));
						p_bottom_model = p_bottom_model.replace(/\*ADDTIME\*/g,util.showTxt(addtime));
						// 2545.交易狀況、帳戶歷史-全球類過關單多顯示下注盤口 （同c1 bug 608)
						if(bet_wtype == "P"){
							p_bottom_model = p_bottom_model.replace(/\*ODDF_TYPE\*/g,"");
						}else{
							p_bottom_model = p_bottom_model.replace(/\*ODDF_TYPE\*/g,util.showTxt(oddf_type));
						}

						p_display = p_display.replace(/\*P_CONTENT\*/g,(cancel_line=="cancel")?"word_delline":"");
						
						if(main_ball_act_ret == ""){
								p_bottom_model = p_bottom_model.replace(/\*DG_CANCEL\*/g,"display:none;");
								p_bottom_model = p_bottom_model.replace(/\*DG_STR\*/g,"");
							if(ball_act_ret == "" ){
								p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g,"display:none;");
								p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g,"");
								p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_RET\*/g,"");
							}else{
								p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g,"display:;");
								p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g,util.showTxt(ball_act_class));
								p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(ball_act_ret));
							}
						}else{
							//2020-05-05 2499.交易狀況-危險球單(單一投注&過關)-當有取消原因時，危險球確認會消失不見帳戶歷史相同狀況，危險球確認有出現，但取消原因會消失>>同c1 bug 區(786)
							if(dg=="Y" && ball_act_class!="word_yellow"){
								p_bottom_model = p_bottom_model.replace(/\*DG_CANCEL\*/g,"display:;");
								p_bottom_model = p_bottom_model.replace(/\*DG_STR\*/g,util.showTxt(dg_str));
								p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g,"display:;");
								p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g,"word_red");
							}else{
								p_bottom_model = p_bottom_model.replace(/\*DG_CANCEL\*/g,"display:none;");
								p_bottom_model = p_bottom_model.replace(/\*DG_STR\*/g,"");
								p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g,"display:;");
								p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g,util.showTxt(main_ball_act_class));
							}
							p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(main_ball_act_ret));
						}
						if(delaysec == "0" && isballact == "0" ){//暫時修改
							ball_act_class == "";
							ball_act_ret =="";
						}
						else if (ball_act_class=="word_yellow" && isballact > 0){
							if(!util.in_array(t_id,danAry_parlay)) danAry_parlay.push(t_id);							
						}
						else if (ball_act_class=="word_yellow" ){
							if(!util.in_array(t_id,bhold_parlay)) bhold_parlay.push(t_id);
						}
						if (!isNaN(win_gold*1)){
     				  		p_bottom_model = p_bottom_model.replace(/\*WIN_GOLD\*/g,(win_gold == "-")?"0":util.showTxt(util.trans_thousand(win_gold)));
     				 	}else{
      			  			p_bottom_model = p_bottom_model.replace(/\*WIN_GOLD\*/g,(win_gold == "-")?"0":util.showTxt(win_gold));
     			  		}
     			  		if (!isNaN(gold*1)){
     				  		p_bottom_model = p_bottom_model.replace(/\*GOLD\*/g,(gold == "-")?"0":util.showTxt(ratioForm.formatNumber(gold,2,true)));
     				 	}else{
      			  			p_bottom_model = p_bottom_model.replace(/\*GOLD\*/g,(gold == "-")?"0":util.showTxt(gold));
						}
						p_display = p_display.replace(/\*P_BOTTOM\*/g, p_bottom_model);
						div_model += p_display;
					}else{
						league = xmlnode.Node(xmdObj["wagers"][i],"league").innerHTML;
						team_h_show = xmlnode.Node(xmdObj["wagers"][i],"team_h_show").innerHTML;
						team_c_show = xmlnode.Node(xmdObj["wagers"][i],"team_c_show").innerHTML;
						team_h_ratio = xmlnode.Node(xmdObj["wagers"][i],"team_h_ratio").innerHTML;
						team_c_ratio = xmlnode.Node(xmdObj["wagers"][i],"team_c_ratio").innerHTML;
						ratio = xmlnode.Node(xmdObj["wagers"][i],"ratio").innerHTML;
						org_score = xmlnode.Node(xmdObj["wagers"][i],"org_score").innerHTML;
						score = xmlnode.Node(xmdObj["wagers"][i],"score").innerHTML;
						strong = xmlnode.Node(xmdObj["wagers"][i], "strong").innerHTML;
						result = xmlnode.Node(xmdObj["wagers"][i],"result").innerHTML;
						pname = xmlnode.Node(xmdObj["wagers"][i],"pname").innerHTML;
						ioratio = xmlnode.Node(xmdObj["wagers"][i],"ioratio").innerHTML;
						//2020-05-05 2499.交易狀況-危險球單(單一投注&過關)-當有取消原因時，危險球確認會消失不見帳戶歷史相同狀況，危險球確認有出現，但取消原因會消失>>同c1 bug 區(786)
						dg = xmlnode.Node(xmdObj["wagers"][i],"dg").innerHTML;
						dg_str = xmlnode.Node(xmdObj["wagers"][i],"dg_str").innerHTML;
						ball_act_class = xmlnode.Node(xmdObj["wagers"][i],"ball_act_class").innerHTML;
						ball_act_ret = xmlnode.Node(xmdObj["wagers"][i],"ball_act_ret").innerHTML;
						bet_gtype = xmlnode.Node(xmdObj["wagers"][i], "bet_gtype").innerHTML;

 


						div_model = dom.getElementById("normal_model").innerHTML;
						div_model = div_model.replace("<XMP>","").replace("</XMP>","").replace("<xmp>","").replace("</xmp>","");
						div_model = div_model.replace(/\*TID\*/g,util.showTxt(t_id));
						div_model = div_model.replace(/\*W_ID\*/g,util.showTxt(w_id));
						div_model = div_model.replace(/\*ADDTIME\*/g,util.showTxt(addtime));
						// 2545.交易狀況、帳戶歷史-全球類過關單多顯示下注盤口 （同c1 bug 608)
						if(bet_wtype == "P"){
							div_model = div_model.replace(/\*ODDF_TYPE\*/g,"");
						}else{
							div_model = div_model.replace(/\*ODDF_TYPE\*/g,util.showTxt(oddf_type));
						}
						div_model = div_model.replace(/\*GTYPE\*/g,util.showTxt(gtype));
						div_model = div_model.replace(/\*W_MS\*/g,util.showTxt(w_ms));
						div_model = div_model.replace(/\*WTYPE\*/g,util.showTxt(wtype));
						div_model = div_model.replace(/\*LEAGUE\*/g,util.showTxt(league));
						div_model = div_model.replace(/\*TEAM_H_SHOW\*/g,util.showTxt(team_h_show));
						div_model = div_model.replace(/\*TEAM_C_SHOW\*/g,util.showTxt(team_c_show));
						if (team_h_show == "" && team_c_show == "") div_model = div_model.replace(/\*TEAM_ACT\*/g, "display:none;");
                        else div_model = div_model.replace(/\*TEAM_ACT\*/g, "display:;");
						if (bet_gtype == "FT") {

        div_model = div_model.replace(/\*ODDF_TYPES\*/g, "display:");

    } else {

        div_model = div_model.replace(/\*ODDF_TYPES\*/g, "display:none;");

    }
                        var team_ratio = "";
                        if (util_game.checkWtypeIsR(bet_wtype)) {
                            var color = "word_yellow";
                            if (bet_wtype == "W3") color = "word_red";
                            div_model = div_model.replace(/\*TEAM_H_RATIO\*/g, "");
                            div_model = div_model.replace(/\*TEAM_C_RATIO\*/g, "");
                            div_model = div_model.replace(/\*CHOICE_CON_CLASS\*/g, color);
                            team_ratio = team_h_ratio != "" ? team_h_ratio :
                                team_c_ratio;
                            if (team_ratio != 0)
                                if (strong == "Y") team_ratio = "-" + team_ratio;
                                else team_ratio = "+" + team_ratio
                        } else {
                            div_model = div_model.replace(/\*TEAM_H_RATIO\*/g, util.showTxt(team_h_ratio));
                            div_model = div_model.replace(/\*TEAM_C_RATIO\*/g, util.showTxt(team_c_ratio));
                            div_model = div_model.replace(/\*CHOICE_CON_CLASS\*/g, "word_red")
                        }
						div_model = div_model.replace(/\*ORG_SCORE\*/g,util.showTxt(org_score));
						div_model = div_model.replace(/\*SCORE\*/g,util.showTxt(score));
					
										
						div_model = div_model.replace(/\*PNAME\*/g,util.showTxt(pname));
						//Ricky 2017-07-20 CRM-230 單盤（without spread）玩法賠率的四捨五入邏輯（會員端）
						div_model = div_model.replace(/\*IORATIO\*/g,ioratio<0?"<font class='word_blue'>"+ratioForm.chgForm_Single_ratio(ioratio,bet_wtype)+"</font>":ratioForm.chgForm_Single_ratio(ioratio,bet_wtype));
						if(ball_act_ret == "" ){
							//2020-05-05 2499.交易狀況-危險球單(單一投注&過關)-當有取消原因時，危險球確認會消失不見帳戶歷史相同狀況，危險球確認有出現，但取消原因會消失>>同c1 bug 區(786)
							div_model = div_model.replace(/\*DG_CANCEL\*/g,"display:none;");
							div_model = div_model.replace(/\*DG_STR\*/g,'');
							div_model = div_model.replace(/\*BALL_ACT\*/g,"display:none;");
							div_model = div_model.replace(/\*BALL_ACT_CLASS\*/g,"");
							div_model = div_model.replace(/\*BALL_ACT_RET\*/g,"");
						}else{ 
							//2020-05-05 2499.交易狀況-危險球單(單一投注&過關)-當有取消原因時，危險球確認會消失不見帳戶歷史相同狀況，危險球確認有出現，但取消原因會消失>>同c1 bug 區(786)
							if(dg=="Y" && ball_act_class!="word_yellow"){
								div_model = div_model.replace(/\*DG_CANCEL\*/g,"display:;");
								div_model = div_model.replace(/\*DG_STR\*/g,util.showTxt(dg_str));
								div_model = div_model.replace(/\*BALL_ACT\*/g,"display:;");
								div_model = div_model.replace(/\*BALL_ACT_CLASS\*/g,"word_red");
								div_model = div_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(ball_act_ret));
							}else{
								if (ball_act_class=="word_yellow" && isballact > "0"){
									if(!util.in_array(t_id,danAry_normal)) danAry_normal.push(t_id);
								}
								else if (ball_act_class=="word_yellow" ){
									if(!util.in_array(t_id,bhold_normal)) bhold_normal.push(t_id);
								}
								div_model = div_model.replace(/\*DG_CANCEL\*/g,"display:none;");
								div_model = div_model.replace(/\*DG_STR\*/g,'');
								div_model = div_model.replace(/\*BALL_ACT\*/g,"display:;");
								div_model = div_model.replace(/\*BALL_ACT_CLASS\*/g,util.showTxt(ball_act_class));
								div_model = div_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(ball_act_ret));
							}
						}

						// 2017-11-24 CRM-236加強版手機 - 209.交易狀況/取消單/帳戶歷史-有球頭的玩法，球頭要秀紅色的
						if (util.checkWtypeIsOU(bet_wtype)) {
                            var choice_blank = result.indexOf(" ");
                            var choice_str = result.substr(0, choice_blank);
                            var choice_con = result.substr(choice_blank,
                                result.length - 1);
                            div_model = div_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(choice_str));
                            div_model = div_model.replace(/\*CHOICE_CON\*/g, util.showTxt(choice_con))
                        } else if (bet_wtype == "W3") {
                            var choiceAry = result.split(" ");
                            var choice_con = choiceAry[choiceAry.length - 1];
                            var choice_str = result.split(choice_con)[0];
                            div_model = div_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(choice_str));
                            div_model = div_model.replace(/\*CHOICE_CON\*/g, util.showTxt(choice_con))
                        } else {
                            div_model = div_model.replace(/\*CHOICE_TEAM\*/g,
                                util.showTxt(result));
                            div_model = div_model.replace(/\*CHOICE_CON\*/g, team_ratio)
                        }
						
						if (!isNaN(win_gold*1)){
     				  		div_model = div_model.replace(/\*WIN_GOLD\*/g,(win_gold == "-")?"0":util.showTxt(util.trans_thousand(win_gold)));
						}else{
								div_model = div_model.replace(/\*WIN_GOLD\*/g,(win_gold == "-")?"0":util.showTxt(win_gold));
						}
     			  		if (!isNaN(gold*1)){
     				  		div_model = div_model.replace(/\*GOLD\*/g,(gold == "-")?"0":util.showTxt(ratioForm.formatNumber(gold,2,true)));
     				 	}else{
      			  			div_model = div_model.replace(/\*GOLD\*/g,(gold == "-")?"0":util.showTxt(gold));
     			  		}
					}

					//2019-11-22 238.交易狀況、帳戶歷史-當有取消原因有公告沒有出現I圖示
					var cancel_apn = xmlnode.Node(xmdObj["wagers"][i],"cancel_apn").innerHTML;
					//try{
						if(cancel_apn!=""){
							if(!util.in_array(t_id,wid_ary)) wid_ary.push(t_id+"[can_apn]"+cancel_apn);
							div_model = div_model.replace(/\*DIS_APN\*/g,"");
							//div_model = div_model.replace(/\*APN_DATA\*/g,cancel_apn);
						}else{
							div_model = div_model.replace(/\*DIS_APN\*/g,"display:none;");
							//div_model = div_model.replace(/\*APN_DATA\*/g,"");
						}
					//}catch(e){

					//}

					tmp_screen += div_model;
				}
				amout_goldObj.innerHTML = util.showTxt(_amout_gold);
				
				div_show.innerHTML = tmp_screen;
								
				var totalPage = Math.ceil(totalLength / _pageCount);
				if(_nowPage >= totalPage)	allsportsObj.style.display = "none";
			}else{
				_self.showNoTodayWagers(true);
			}
			
			_self.chgGtypeLoading(false);//2020-11-26 Q2 160.交易狀況/帳戶歷史內外層-切換日期或球類時，拉霸下方幫加罩loading（因單量多會等一陣子才換過去)

			for(var i = 0 ; i < wid_ary.length; i++){
				var allmsg = wid_ary[i].split("[can_apn]");
				_mc["cancel_reason_"+allmsg[0]] = dom.getElementById("cancel_reason_"+allmsg[0]);
				util.addEvent(_mc["cancel_reason_"+allmsg[0]], "click", _self.icon,{"tid":allmsg[0],"msg":allmsg[1]});
			}

			//2017.05.08 PMO-51 改變危險球注單標記 Leslie
			if(danAry_normal.length >0 || danAry_parlay.length >0 ){
					_self.createDangerTimer();
			}else{
					_self.clearDangerTimer();
			}
			//console.log(bhold_normal.length,"bholdlength" , bhold_parlay.length , "parlaylength");
			if(bhold_normal.length>0 || bhold_parlay.length>0){
				_self.createbetholdTimer();
			}
			else{
				_self.clearbetholdTimer();
			}
			
		}
		_self.orientationChange();
        parentClass.dispatchEvent("showLoading", {"isShow":false});
	}
	
	_self.icon = function(e,param){
		var par = new Object();
		par["_id"] = "info_pop";
		par["title"] = "<li>" + LS_code.get("todat_wagers_magtitle")+ "</li>";
		par["msg"] = LS.get("ticket_id_str")+param.tid+"<br>"+param.msg;
		parentClass.dispatchEvent("showAlertMsg", par);
	}
    
    //============ 危險球相關 ============
	_self.createDangerTimer=function(){
		_self.clearDangerTimer();
		//console.log("dg createTimer");
		timerObj["dg"] = new Timer(config_set.get("CONFIG_DANGEROUS"));
        timerObj["dg"].setParentclass(_self);
        timerObj["dg"].dont_clear = true; //設定為不清除timer
		timerObj["dg"].init();
		timerObj["dg"].addEventListener("TimerEvent.TIMER", _self.dgTimerRun);
		timerObj["dg"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.dgTimerFinish);
		timerObj["dg"].startTimer();
		
	}
	
	_self.clearDangerTimer=function(){
        //console.log("dg clearTimer");
		if(timerObj["dg"]!=null){
				timerObj["dg"].clearObj();
				timerObj["dg"]=null;
		}
		return true;
	}
	
	_self.dgTimerRun=function(count){
		//console.log("dgTimerRun");
		_self.checkDanger();
	}
	
	_self.dgTimerFinish=function(){
		
	}
	
	_self.checkDanger=function(){
		//console.log(danAry_parlay.length,"parlay",danAry_normal.length,"normal");
        if(danAry_normal.length==0 && danAry_parlay.length==0){
			_self.clearDangerTimer();
			return;
		}
		//console.log("passchkdanger");
        var urlParams = "";
        //var isP = "N";
        urlParams += "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;        
        urlParams += "&type=xml";
        urlParams += "&from=todaywagers";
		urlParams += "&tid=" + danAry_normal.join(",");
		urlParams += "&p3_tid=" + danAry_parlay.join(",");
        //urlParams += "&isP=" + isP;
        //urlParams = "p=get_dangerous&ver=" + top.ver + "&" + urlParams;
        urlParams = "p=get_dangerous&" + urlParams;

        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.checkDangerFinish);
        getHTML.loadURL(top.m2_url, "POST", urlParams);
	}
	
	_self.checkDangerFinish=function(xml){
		//danAry_normal.length=0;
		//danAry_parlay.length=0;
		var errorMsg = util.showConnectMsg(xml);
		if(util.alertConnectMsg(errorMsg))  return;
		var xmlnode = util.parseXml(xml);
		var tickets = xmlnode.Node(xmlnode.Root[0],"tickets");
		var ticket = xmlnode.Node(tickets,"ticket", false);
		//console.log(tickets,"dgtickets");
		//console.log(ticket,"dgticket");
		for(var i=0; i<ticket.length; i++){
				var obj = ticket[i];
				var tid = obj.getAttribute("id");
				var _status = util.showTxt(obj.innerHTML);
				var ret = _self.chgDangerStatus(tid, _status);
				if(!ret){
					// 2017-12-05 CRM-236加強版手機 - 336.交易狀況-危險球待確認的單子點單子上的刷新 當已是投注失敗的狀況點刷新是沒有作用的
					_self.loadTodayWager();
					break;
				} 
		}
			
	}
	
	_self.chgDangerStatus=function(tid, _status){
		var bg_sty = "";
		var msg_sty = "";
		var msg = "";
		var normalPos = danAry_normal.indexOf(tid);
		var parlayPos = danAry_parlay.indexOf(tid);
		//console.log(_status);
		switch(_status){
				case "A": //已確認
						msg_sty = "word_green";
						msg = "";						
						
						var msgObj = dom.getElementById("dg_"+tid);
						util.setObjectClass(msgObj, msg_sty);
						msgObj.innerHTML = LS.get("today_wager_A"); //待語系檔補上
						
						if(danAry_normal.indexOf(tid)!=-1)danAry_normal.splice(normalPos,1);
						if(danAry_parlay.indexOf(tid)!=-1)danAry_parlay.splice(parlayPos,1);

						break;
				case "R": //被拒絕						
						_self.clearDangerTimer();
						_self.clearTimer();
						_self.createTimer();

						if(danAry_normal.indexOf(tid)!=-1)danAry_normal.splice(normalPos,1);
						if(danAry_parlay.indexOf(tid)!=-1)danAry_parlay.splice(parlayPos,1);

						return false;
						break;
				case "N": //確認中
						//danAry.push(tid);
				default:
						break;
		}
		
		return true;
			
	}
    //============ 危險球相關 ============

	_self.showNoTodayWagers=function(isOk){
		if(isOk){
			noTodayWagersObj.style.display = "";
			allsportsObj.style.display = "none";
            total_accountsObj.style.display = "none";
			tool_backtop.style.display = "none";
		}else{
			noTodayWagersObj.style.display = "none";
			allsportsObj.style.display = "";
            total_accountsObj.style.display = "";
			//bottom_topObj.style.display = "";
		}
	} 
  
	_self.replaceOU=function(txt){
		txt = txt.replace(/OU/g,"");
		txt = txt.replace(/DT/g,"");
		txt = txt.replace(/P3/g,"");
		return txt;
	}
	
	_self.roll = function(e, target){
		var body_h = document.getElementById("body_show").scrollHeight;  //body height
		var view_h = document.getElementById("body_show").clientHeight;  //view height
		var now_h = document.getElementById('body_show').scrollTop;      //目前scroll位置
		if(target == "today_wagers" && (body_h - view_h >= 10)){
			tool_backtop.style.display = "";
			if(body_h - (view_h+now_h) <= 80 ){//目前scroll在底部 (80 "移置頂部按鈕"的高度)
				parentClass.dispatchEvent("rollBottom", {"page":"today_wagers","isBottom":true});
			}else{
				//console.log("false");
				parentClass.dispatchEvent("rollBottom", {"page":"today_wagers","isBottom":false});
			}
		}
			
	}

	_self.getNowPage = function(){
        var tmpPage = "";
        if(win._history.length!=0){
            tmpPage = win._history[win._history.length-1].page;
        }
        return tmpPage;
    }

	_self.orientationChange = function(){
		if(top.mobile=="Y")tool_backtop.style.display = "none";
		var orientation = win.Math.abs(win.orientation);
		if(orientation==90||orientation==0){
			_self.orientation();
		}
	};

	_self.orientation = function(){
		var body_h = document.getElementById("body_show").scrollHeight;  //body height
		var view_h = document.getElementById("body_show").clientHeight;  //view height
		// 2019-12-16 將檢測範圍縮小 避免差距過大而未顯示
		tool_backtop.style.display = (body_h - view_h >= 10)?"":"none";
	}

	_self.exitEvent=function(){
		win.removeEventListener("orientationchange", _self.orientationChange);
		win.removeEventListener("resize", _self.orientationChange);
		return true;
	};
	
	_self.orientationblur = function(){
		if(document.activeElement.tagName == "SELECT")dom.activeElement.blur();
	}

	_self.chgGtypeLoading=function(isShow){//2020-11-26 Q2 160.交易狀況/帳戶歷史內外層-切換日期或球類時，拉霸下方幫加罩loading（因單量多會等一陣子才換過去)
		if(isShow){
			tool_backtop.style.display = "none";//回到頂部 趴資料中隱藏
			noTodayWagersObj.style.display = "none";//無賽事圖 趴資料中隱藏
			allsportsObj.style.display = "none";//顯示更多 趴資料中隱藏
			dom.getElementById("div_show").style.display = "none";//趴資料中隱藏
			dom.getElementById("info_box").style.display = "none";//總金額欄 趴資料中隱藏
			dom.getElementById("load").style.display = "";//打開loading
		}else{
			dom.getElementById("div_show").style.display = "";//交易單量 啪完資料開啟
			dom.getElementById("info_box").style.display = "";//總金額欄 啪完資料開啟
			dom.getElementById("load").style.display = "none";//關閉loading
		}
	}
	_self.createbetholdTimer=function(){
		_self.clearbetholdTimer();
		//console.log("dg createTimer");
		timerObj["bhold"] = new Timer(config_set.get("CONFIG_BETHOLD"));
        timerObj["bhold"].setParentclass(_self);
        timerObj["bhold"].dont_clear = true; //設定為不清除timer
		timerObj["bhold"].init();
		timerObj["bhold"].addEventListener("TimerEvent.TIMER", _self.betholdTimerRun);
		timerObj["bhold"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.betholdTimerFinish);
		timerObj["bhold"].startTimer();
		
	}
	_self.clearbetholdTimer=function(){
        //console.log("dg clearTimer");
		if(timerObj["bhold"]!=null){
				timerObj["bhold"].clearObj();
				timerObj["bhold"]=null;
		}
		return true;
	}
	
	_self.betholdTimerRun=function(count){
		//console.log("dgTimerRun");
		_self.checkbethold();
	}
	
	_self.betholdTimerFinish=function(){
		
	}
	
	_self.checkbethold=function(){
		//console.log("checkbetholdwagers");
        if(bhold_normal.length==0 && bhold_parlay.length==0){
			_self.clearbetholdTimer();
			return;
		}

        var urlParams = "";
        //var isP = "N";
        urlParams += "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;        
        urlParams += "&type=xml";
        urlParams += "&from=todaywagers";
		urlParams += "&tid=" + bhold_normal.join(",");
		urlParams += "&p3_tid=" + bhold_parlay.join(",");
        //urlParams += "&isP=" + isP;
        //urlParams = "p=get_dangerous&ver=" + top.ver + "&" + urlParams;
        urlParams = "p=get_bethold&" + urlParams;

        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.checkbetholdFinish);
        getHTML.loadURL(top.m2_url, "POST", urlParams);
	}
	
	_self.checkbetholdFinish=function(xml){
		//danAry_normal.length=0;
		//danAry_parlay.length=0;
		var errorMsg = util.showConnectMsg(xml);
		if(util.alertConnectMsg(errorMsg))  return;
		var xmlnode = util.parseXml(xml);
		var tickets = xmlnode.Node(xmlnode.Root[0],"tickets");
		var ticket = xmlnode.Node(tickets,"ticket", false);

		for(var i=0; i<ticket.length; i++){
				var obj = ticket[i];
				var tid = obj.getAttribute("id");
				var _status = util.showTxt(obj.innerHTML);
				var ret = _self.chgbetholdStatus(tid, _status);
				if(!ret){
					// 2017-12-05 CRM-236加強版手機 - 336.交易狀況-危險球待確認的單子點單子上的刷新 當已是投注失敗的狀況點刷新是沒有作用的
					_self.loadTodayWager();
					break;
				} 
		}
			
	}
	
	_self.chgbetholdStatus=function(tid, _status){
		var bg_sty = "";
		var msg_sty = "";
		var msg = "";
		var normalPos = bhold_normal.indexOf(tid);
		var parlayPos = bhold_parlay.indexOf(tid);
		switch(_status){
				case "A": //已確認
						msg_sty = "word_green";
						msg = "";						
						
						var msgObj = dom.getElementById("dg_"+tid);
						util.setObjectClass(msgObj, msg_sty);
						msgObj.innerHTML = LS.get("today_wager_A"); //待語系檔補上
						
						if(bhold_normal.indexOf(tid)!=-1)bhold_normal.splice(normalPos,1);
						if(bhold_parlay.indexOf(tid)!=-1)bhold_parlay.splice(parlayPos,1);

						break;
				case "V": //被拒絕						
						_self.clearbetholdTimer();
						_self.clearTimer();
						_self.createTimer();

						if(bhold_normal.indexOf(tid)!=-1)bhold_normal.splice(normalPos,1);
						if(bhold_parlay.indexOf(tid)!=-1)bhold_parlay.splice(parlayPos,1);

						return false;
						break;
				case "N": //確認中
						//danAry.push(tid);
				default:
						break;
		}
		
		return true;
			
	}
	}
