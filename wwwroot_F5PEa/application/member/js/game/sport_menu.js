function sport_menu(_win, _dom, _post){
    var _self = this;
    var win = _win;
    var dom = _dom;
	var postHash = _post;
	var classname = "sport_menu";
	var parentClass;
	var childClass;
	var LS;
	var eventHandler = new Object();
	var config_set = new win.config_set();
	var CookieManager = new win.CookieManager();
	var util = new win.Util(win,dom);
	var timerHash;
	var timer = null;
	var gtype_ary;
	var sort_type = "L";
	var open_date = false;
	var is_first_choise = true;
	var page_sw = false;
	var getSpecData = null;
	var nowModelShowtype = "";
	var nowTS = postHash["ts"];
	var backPageCheckCount = 0;
	var newTS = 0;
	var oldTS = 0;
	var oldRtype = "";
	var myhash={};
	var tabHash = new Array("main","rnou","cn","rn","pd","sfs","moua","fantasy");
	var es_tabHash = new Array("main","sprb","lol","dota","cs","kog","val","wr","ml","star2","pubg","aov","ove","rs","rl","star","war","cro","cod","ff","aoe","aoe2","pu","al","others");
	var mainCount = 0;
	var showData = true;
	var notNeedLegAry = new Array("live","today","mygame","hot","soon");
	var filterTab = new Array("FT","RB","MIX","NEXT1","NEXT6","FT_FANTASY");
	var lastRtype = "";
	var nowHideTab = new Array();
	var leagueTab_Ary = new Array("league_tab_prestart","league_tab_rb","league_tab_mix","league_tab_next1","league_tab_next6","league_tab_fantasy","league_tab_fs");
	var nowFilter = "";
	var isDraging = false;
	var filterHash = new Object();
	var singelLegHash = new Object();
	var type_count = 0;
	var chgFilter = false;
	var isIOS = util.isIOS();
	var filterTagName = "";
	var mygameFilterScroll = 0;

    _self.init = function(){
		myhash["config_set"] = config_set;
		_self.addEventListener("showAlertMsg", _self.showAlertMsg);
		_self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
		_self.addEventListener("retryLoop", _self.retryLoop);
        _self.addEventListener("retryLastfail", _self.retryLastfail);
		_self.addEventListener("retryComplete", _self.retryComplete);
		config_set.init();
		page_sw = config_set.get("PAGE_SW");
		gtype_ary = config_set.get("GTYPEARY");

		_self.initheader();
		_self.chgSportCss(top.choice_gtype);
		// _self.setSortType();
		_self.setIcon();
		if((top.choice_gtype == "ft" || (top.choice_gtype == "es" && top.specialClick=="")) && top.choice_showtype != "mygame" && postHash["rtype"] != "fs")_self.getPageCount("game_list");
		if(top.choice_showtype=="mygame"){
			dom.getElementById("back_btn").style.display = "";
			_self.getMyGameData();
		}else if(top.specialClick == "special" && top.clickBackPage=="click"){
			if(top.specialGame["Total_Count"]==0){
				_self.backPageCheck();
			}else{
				top.checkBackPage="nocheck";
				top.clickBackPage="";
			}
		}else{
			if(top.specialClick == ""){
				var isHeader = headerFrame.headerToSport();
				if(isHeader=="Y"){
					_self.headerSportData();
				}else{
					_self.getData();
				}
				_self.createTimer();
			}
		}
		filterTagName = _self.selectFilterTagName();
		util.addEvent(dom.getElementById("back_btn"), "click", _self.backClick);
		util.addEvent(dom.getElementById("sel_sort"), "click", _self.chgSortType);
		if(!top.specialGame.isFantasy)util.addEvent(dom.getElementById("goToLegPage"), "click", _self.goToLegPage);
		win.addEventListener("resize", _self.sportScroll);
		win.addEventListener("resize", _self.resizeFilterScroll);
		
		if(postHash["isLeagued"] && postHash["isLeagued"]=="Y"){
			var defPage = "fantasy";
			var par = {"rtype":top.choice_rtype,"filterPage":defPage};
			_self.tabLight(par);
		}else{
			if(top.specialClick == "special" || top.choice_showtype.match(/today|parlay|early/)){
				var defRtype = (top.choice_rtype)?top.choice_rtype : "r";
				var defPage = (top.choice_showtype.match(/early|parlay/))?"game":util.switchFilterType(top.choice_filter);
				var par = {"rtype":defRtype,"filterPage":defPage};
				_self.tabLight(par);
			}
		}
		
    }

	_self.getParentThis = function (varible) {
		return parentClass.getThis(varible);
	}

	
	_self.dispatchEvent = function (eventname, param) {
		if (eventHandler[eventname]) eventHandler[eventname](param);
	}

	_self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }
	

    _self.setParentclass = function(_parentclass){
		parentClass = _parentclass;
		timerHash = parentClass.getThis("timerHash");
		headerFrame = parentClass.getThis("headerFrame");
		LS = parentClass.getThis("LS");
		myhash["timerHash"] = timerHash;
		myhash["headerFrame"] = headerFrame;
		myhash["LS"] = LS;
	}

	_self.showAlertMsg = function(param){
		parentClass.dispatchEvent("showAlertMsg", param);
	}

	_self.bodyGoToPage = function(param){
		parentClass.dispatchEvent("bodyGoToPage", param);
	}

	_self.retryLoop = function(param){
		parentClass.dispatchEvent("retryLoop", param);
    }
    
    _self.retryLastfail = function(){
		parentClass.dispatchEvent("retryLastfail");
    }

	_self.retryComplete = function(){
		parentClass.dispatchEvent("retryComplete");
	}

	_self.chgSortType = function(e, param){
		parentClass.dispatchEvent("showLegSetting");
	}

	_self.initheader = function(){
		var param = new Object;
		param.showtype = top.choice_showtype;
		param.gtype = top.choice_gtype;
		_self.setTitle("header",param);
	}

	// _self.setSortType = function(){
	// 	var cls = "";
	// 	if(page_sw){
	// 		if(sort_type=="T"){
	// 			cls = "sort_time";
	// 		}else{
	// 			cls = "sort_cup";
	// 		}
	// 	}else{
	// 		if(top.choice_showtype=="live"){
	// 			cls = "cup";
	// 		}else{
	// 			if(sort_type=="T"){
	// 				cls = "sort_time";
	// 			}else{
	// 				cls = "sort_cup";
	// 			}
	// 		}
	// 	}
	// 	util.setObjectClass(dom.getElementById("icon_sort"), "icon_"+cls);
	// }

	_self.getPageCount = function(from){
		parentClass.dispatchEvent("getPgCnt",from);
	}

	_self.setIcon = function(){
		var rtype = top.choice_rtype;
		var isLeagued = top.isLeagued;
		var isFU_P3 = (postHash["showtype"]=="early"||postHash["showtype"]=="parlay");
		if(top.choice_gtype == "ft" && postHash["showtype"]=="today"){
			util.addClass(dom.getElementById("league_tab"),"sort_today");
		}
		dom.getElementById("sel_date").style.display = "none";
		if(postHash["type"]=="league"){
			dom.getElementById("sel_sort").style.display = "none";
			if(top.specialClick == "special")dom.getElementById("league_tab").style.display = "";
			else if(top.outrightsClick=="outrights")dom.getElementById("league_tab").style.display = "none";
			else if(top.specialGame.isFantasy){
				dom.getElementById("sel_sort").style.display = "none";
				dom.getElementById("league_tab").style.display = "";
			}
			else dom.getElementById("league_tab").style.display = (postHash["showtype"].match(/live|soon|hot/))?"none":"";
			if(isFU_P3 && top.specialClick != "special" && top.outrightsClick!="outrights"){
				dom.getElementById("sel_date").style.display = "";
				var date_icon = dom.getElementById("date_icon");
				util.addEvent(dom.getElementById("sel_date"), "click", _self.dateShow, null);
			}
		}else if(rtype=="fs" && (top.specialClick != "special")){
			dom.getElementById("sel_sort").style.display = "none";
			dom.getElementById("league_tab").style.display = (top.choice_filter == "FS" && top.choice_showtype.match(/early/) && top.outrightsClick != "outrights")?"":"none";
		}else{
			if(top.specialClick == "special"){
				var needHideSort = ((top.choice_gtype=="es" && top.choice_rtype=="r" && top.specialClick!="")|| top.specialGame.isHL || top.specialGame.isStandings || top.specialGame.isTeam || top.specialGame.isFantasy || top.choice_rtype == "fs");
				dom.getElementById("league_tab").style.display = "";
				dom.getElementById("sel_sort").style.display = (needHideSort)?"none":"";
			}else if(top.choice_showtype=="mygame"){
				dom.getElementById("sel_sort").style.display = "none";
				dom.getElementById("league_tab").style.display = "none";
			}else if(top.specialGame.isFantasy){
				dom.getElementById("sel_sort").style.display = "none";
				dom.getElementById("league_tab").style.display = "";
			}else{
				dom.getElementById("sel_sort").style.display = "";
				if(!top.choice_showtype.match(/live|hot|soon/))dom.getElementById("league_tab").style.display = "";
				else dom.getElementById("league_tab").style.display = "none";
				// if(!top.choice_showtype.match(/live|soon|hot/))dom.getElementById("league_tab").style.display = "";
			}
			_self.setTabEvent();
		}
		_self.setTabVisible();
	}

	_self.setTabEvent = function(){
		var _tabHash = (top.choice_gtype=="es")?es_tabHash:tabHash;
		var tmpRtype = "rb";
		var SPorMYGAME_str = "";
		if(top.specialGame.gtype=="ES" && top.specialClick!="")SPorMYGAME_str="SP";
		else if(top.choice_gtype=="es" && top.choice_showtype=="mygame")SPorMYGAME_str="MY";
		var isES = (top.choice_gtype=="es")?SPorMYGAME_str+"ES_":"";
		nowShowtype = (top.choice_showtype=="live")?"r":"";
		for(var t=0; t<_tabHash.length; t++){
			var tmpTab = dom.getElementById(isES+"tab_"+_tabHash[t]);
			if((nowShowtype == "r" || top.choice_showtype == "parlay") && (_tabHash[t].match(/sfs|fantasy/)))continue;
			//tmpTab.style.display = "";
			if(_tabHash[t] == "main")tmpRtype = _self.setDefRtype(top.choice_gtype, top.choice_showtype);
			else tmpRtype = nowShowtype+_tabHash[t];
			util.addEvent(tmpTab, "click", _self.chgTab, {"rtype":tmpRtype});
		}
	}

	_self.setTabVisible = function(countHash){
		var noCnt = (typeof(countHash)!="undefined" && (isNaN(countHash[top.choice_gtype]) || countHash[top.choice_gtype]==0) );
		
		var allZero = util.chkAllMyGameHash(true);
		var isMyGameHide = (top.choice_showtype=="mygame" && allZero);
		var mainZero = (top.choice_gtype=="ft" && mainCount == 0 && !showData);
		var isHide = (postHash["type"]=="league" || top.choice_rtype=="fs" || top.choice_gtype!="ft" || noCnt || isMyGameHide  || mainZero 
		|| (top.specialClick != "" && (top.specialGame.isFantasy || top.specialGame.isHL || top.specialGame.isTeam || top.specialGame.isStandings)));
		dom.getElementById("total_tab").style.display = (isHide? "none" : "");
		// _self.showFantasyMessage(top.specialGame.isFantasy);
		dom.getElementById("ES_tab").style.display = (top.specialClick=="" && top.choice_gtype=="es" && !top.isLeagued && top.choice_showtype!="mygame" && mainCount > 0)? "" : "none";
		// dom.getElementById("SPES_tab").style.display = (top.choice_gtype=="es" && top.specialClick!="" && mainCount > 0 && top.specialGame.mode=="NORMAL")? "" : "none";
	}

	_self.setMainCount = function(count){
		if(count==undefined)count=0;
		mainCount = count;
	}

	_self.setShowDataSw = function(sw){
		if(sw==undefined)sw=false;
		showData = sw;
	}

	_self.setDefRtype = function(gtype, showtype){
        var hash = new Object();
        hash[showtype] = "r";
        hash["live"] = "rb";
        hash["today"] = "r";
        hash["early"] = hash["today"];
        hash["parlay"] = (gtype=="ft")?hash["live"]:hash["today"];
        return hash[showtype];
    }

	_self.dateShow = function(e, tarObj){
		parentClass.dispatchEvent("showDate", {"isShow":_self.setDateIconStatus()});
	}

	_self.setDateIconInit = function(){
		dom.getElementById("date_icon").classList.remove("on");
		open_date = false;
	}

	_self.setDateIconStatus = function(){
		var tarDiv = dom.getElementById("date_icon");
		if(tarDiv.classList.contains("on")){
			tarDiv.classList.remove("on");
			open_date = false;
		}else{
			tarDiv.classList.add("on");
			open_date = true;
		}
		return open_date;
	}

	_self.getDateIconStatus = function(){
		return open_date;
	}

	_self.showSportMenu = function(_par){
		dom.getElementById("sport_menu").style.display = (_par.isShow)?"":"none";
	}

	_self.hideFilterTab = function(type){
		dom.getElementById("league_tab_"+type).style.display = "none";
	}

	_self.showFantasyMessage = function(show){
		dom.getElementById("fantasy_message").style.display = (show)?"":"none";
	}

	_self.showTeamMenu = function(_par){
		dom.getElementById("team_menu").style.display = (_par.isShow)?"":"none";
	}

	_self.showSelectSort = function(_par){
		dom.getElementById("sel_sort").style.display = (_par.isShow)?"":"none";
	}

	_self.setGameParlayLimit = function(_par){
		var onlyP = (postHash["showtype"]=="parlay" && !isLeagued && !postHash["action"].match(/choice_league|clickCoupon/))?true:false;
		if(dom.getElementById("game_parlay"))dom.getElementById("game_parlay").innerHTML = util.showTxt(_par.parlay_limit_min);
		dom.getElementById("showPLimit").style.display = (onlyP)?"":"none";
	}

	_self.setTitle=function(mode, _par){
		var total_league_title = dom.getElementById("total_league_title");
		var league_title = dom.getElementById("league_title");
		var showtype_now = dom.getElementById("showtype_now");
		var gtype_now = dom.getElementById("gtype_now");
		var league_gtype = dom.getElementById("league_gtype");
		var total_league_icon = dom.getElementById("total_league_icon");
		var league_icon = dom.getElementById("league_icon");
		var league_name = dom.getElementById("league_name");
		
		total_league_icon.style.display = (top.isLeagued || top.specialClick != "")?"none":"";
		league_icon.style.display = (top.isLeagued)?"none":"";

		if(mode=="total"){
				if(total_league_title)total_league_title.style.display = "none";
				if(league_title)league_title.style.display = "";
				if(league_gtype){
					if(!_par.league && postHash["isLeagued"] != "Y")util.addClass(league_gtype,"show_league");
					league_gtype.innerHTML = util.showTxt(LS.get("gtype_"+_par.gtype));
				}
				if(top.specialClick == "" && league_name && !top.specialGame.isFantasy){
					var showStr = LS.get(_par.showtype);
					if(_par.showtype == "hot"){
						util.addClass(league_name,"event_hot");
					}else{
						util.removeClass(league_name,"event_hot");
					}
					
					if(_par.couponKey && _par.couponKey != ""){
						if(_par.couponKey.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2} week[1-7]{1}$/))showStr = LS.get("str_coupon_date");
						else showStr = LS.get(_par.couponKey);
					}else if(_par.league && _par.league != ""){
						showStr = _par.league;
					}else {
						if(top.choice_filter == "FANTASY")showStr = ""
					}
					league_name.innerHTML = util.showTxt(showStr);
					_self.initTab();
					util.dragScroll(dom,"tab_scroll",_self.addTabClick,_self.removeTabClick,{"tagName":"tab"});
				}
				if(top.specialGame.isFantasy){
					var showStr = LS.get(_par.showtype);
					if(league_name){
						if(_par.couponKey && _par.couponKey != ""){
							if(_par.couponKey.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2} week[1-7]{1}$/))showStr = LS.get("str_coupon_date");
							else showStr = LS.get(_par.couponKey);
						}
						league_name.innerHTML = util.showTxt(showStr);
					}
					//util.addClass(dom.getElementById("goToLegPage"),"disable");
					if(postHash["isLeagued"] == "Y"){
						league_icon.style.display = "none";
						if(league_gtype){
							league_gtype.innerHTML = util.showTxt(LS.get("showtype_"+_par.showtype));
						}
						if(league_name)league_name.innerHTML = LS.get("gtype_"+_par.gtype);
					}
				}else util.removeClass(dom.getElementById("goToLegPage"),"disable");
				
		}else if(mode=="header"){
			if(total_league_title){
				//total_league_title.style.display = (_par.showtype == "mygame")?"none":"";
				total_league_title.style.display = "";
			}
			if(_par.showtype == "mygame") dom.getElementById("total_league_icon").style.display = "none";
			if(league_title)league_title.style.display = "none";
			if(showtype_now)showtype_now.innerHTML = (top.outrightsClick=="outrights")?util.showTxt(LS.get("showtype_outrights")):util.showTxt(LS.get("showtype_"+_par.showtype));
			if(gtype_now){
				var showStr = "";
				if(_par.showtype == "hot"){
					util.addClass(gtype_now,"event_hot");
					showStr = LS.get(_par.showtype);
				}
				else{
					util.removeClass(gtype_now,"event_hot");
					showStr = LS.get("gtype_"+_par.gtype);
				}
				gtype_now.innerHTML = util.showTxt(showStr);
			}
			if(top.specialClick == "" && league_name){
				if(_par.showtype == "hot"){
					util.addClass(league_name,"event_hot");
				}
				else util.removeClass(league_name,"event_hot");
				league_name.innerHTML = util.showTxt(LS.get(_par.showtype));
				_self.initTab();
				util.dragScroll(dom,"tab_scroll",_self.addTabClick,_self.removeTabClick,{"tagName":"tab"});
			}
			if(postHash["isLeagued"] == "Y" && top.specialGame.isFantasy){
				league_icon.style.display = "none";
				if(league_gtype){
					league_gtype.innerHTML = util.showTxt(LS.get(_par.showtype));
					util.addClass(dom.getElementById("goToLegPage"),"disable");
				}
				if(league_name)league_name.innerHTML = LS.get("gtype_"+_par.gtype);
			}
			if(top.outrightsClick=="outrights" || top.isLeagued)util.addClass(dom.getElementById("league_now"),"disable");
			
		}else if(mode=="special"){
			if(total_league_title)total_league_title.style.display = "";
			if(league_title)league_title.style.display = "none";
			if(showtype_now)showtype_now.style.display = "none";
			if(gtype_now)gtype_now.innerHTML = util.showTxt(_par.title);
			if(_par.league)return;

			_self.initTab();
			util.dragScroll(dom,"tab_scroll",_self.addTabClick,_self.removeTabClick,{"tagName":"tab"});

		}else if(mode=="mygame"){
			util.addClass(dom.getElementById("league_now"),"disable");
			dom.getElementById("total_league_icon").style.display = "none";
			if(total_league_title)total_league_title.style.display = "";
			if(league_title)league_title.style.display = "none";
			if(showtype_now)showtype_now.innerHTML = util.showTxt(LS.get("showtype_"+_par.showtype));
			if(gtype_now)gtype_now.innerHTML = util.showTxt(LS.get("gtype_"+_par.gtype));
		}else{
			util.removeClass(dom.getElementById("goToLegPage"),"disable");
			if(total_league_title)total_league_title.style.display = "none";
			if(league_title)league_title.style.display = "";
			if(league_gtype){
				if(!_par.league)util.addClass(league_gtype,"show_league");
				league_gtype.innerHTML = util.showTxt(LS.get("gtype_"+_par.gtype));	
			}
			if(league_name){
				var tmpLegName = _par.league;
				if(top.choice_filter == "FS" && postHash["headername"] && postHash["headername"] != ""){
					tmpLegName = postHash["headername"];
				}
				league_name.innerHTML = util.showTxt(tmpLegName);
			}
		}
	}

	_self.setScroll = function(_left,_right,_scroll,_total){
		var left = dom.getElementById(_left);
		var right = dom.getElementById(_right);
		var scroll = dom.getElementById(_scroll);
		var total = dom.getElementById(_total);
		
		if(total && scroll){
			if(total.clientWidth > scroll.clientWidth){
				if(top.tab_scroll_clientWidth==0 && top.tab_total_clientWidth==0){
					util.addClass(right,"on");
					util.addEvent(right,"click",util.move,{"click":right ,"div":scroll, "direction":"right", "opposite":left});
				}
			}else {
				util.removeClass(right,"on");
				util.removeEvent(right, "click");
			}
			util.addEvent(scroll,"scroll",_self.addScrollEvent,{"total":total ,"scroll":scroll , "left":left , "right":right});
	
			if(scroll.clientWidth!=0)top.tab_scroll_clientWidth = scroll.clientWidth;
			if(total.clientWidth!=0)top.tab_total_clientWidth = total.clientWidth;
		}
		top.loadTab_done = true;
	}

	_self.initTab = function(){
		var league_tab_rb = dom.getElementById("league_tab_rb");
		var league_tab_game = dom.getElementById("league_tab_game");
		var league_tab_fs = dom.getElementById("league_tab_fs");
		var league_tab_fantasy = dom.getElementById("league_tab_fantasy");
		var league_tab_highlights= dom.getElementById("league_tab_highlights");
		var league_tab_teams= dom.getElementById("league_tab_teams");
		var league_tab_standings= dom.getElementById("league_tab_standings");
		var left = dom.getElementById("tab_left");
		var right = dom.getElementById("tab_right");
		var scroll = dom.getElementById("tab_scroll");
		var total = dom.getElementById("tab_total");
		
		if(top.tab_total_clientWidth > top.tab_scroll_clientWidth){
			if(total.clientWidth < scroll.clientWidth){
				util.removeClass(right,"on");
				util.removeEvent(right, "click");
			}else{
				util.addClass(right,"on");
				util.addEvent(right,"click",util.move,{"click":right ,"div":scroll, "direction":"right", "opposite":left});
				util.addEvent(scroll,"scroll",_self.addScrollEvent,{"total":total ,"scroll":scroll , "left":left , "right":right});
			}
		}
		setTimeout(_self.setScroll,100,"tab_left","tab_right","tab_scroll","tab_total");
		
		if(top.specialClick == "special"){
			for(var l=0; l < leagueTab_Ary.length; l++){
				var targetTab = dom.getElementById(leagueTab_Ary[l]);
				if(targetTab)targetTab.style.display = "none";
			}
			if(league_tab_rb)league_tab_rb.style.display = "none";
			if(league_tab_game && (((top.specialGame.RB>0 || top.specialGame.FTFU>0)&& top.specialGame.mode=="CUP") || top.specialGame.mode=="NORMAL")){
				league_tab_game.style.display = "";
				var _rtype = (top.choice_gtype=="es")?top.choice_rtype:"r";
				util.addEvent(league_tab_game, "click", _self.chgTab_league, {"kind":"game", "rtype":_rtype ,"showtype":"today","specialClick":"special"});
			}else league_tab_game.style.display = "none";
			if(league_tab_fs && ((top.specialGame.FS>0 && top.specialGame.mode=="CUP") || (top.specialGame.mode=="NORMAL" && top.choice_gtype!="es"))){
				league_tab_fs.style.display = "";
				util.addEvent(league_tab_fs, "click", _self.chgTab_league, {"kind":"fs", "rtype":"fs","showtype":"early", "page":"league_index" ,"specialClick":"special"});
			}else league_tab_fs.style.display = "none";
			if(top.choice_gtype=="ft" && league_tab_fantasy && ((top.specialGame.Fantasy>0 && top.specialGame.mode=="CUP") || top.specialGame.mode=="NORMAL")){
				league_tab_fantasy.style.display = "";
				util.addEvent(league_tab_fantasy, "click", _self.chgTab_league, {"kind":"fantasy", "rtype":"r","showtype":"today" ,"specialClick":"special"});
			}else league_tab_fantasy.style.display = "none";
			if(top.specialGame.mode=="CUP"){
				if(league_tab_highlights && top.specialGame.highlights_sw=="Y" && top["specialGame"]["highlights_sw"]=="Y" && (top.specialGame.SPHLGame >0 || (top.specialGame.cup_standings_sw=="Y" && top["specialGame"]["period"]=="IN" && top.specialGame.CUP_GROUP_count>0) || (top.specialGame.FS>0 && top.specialGame.cup_hl_items!="") || (top["specialGame"]["CUP_TEAM_ARY"].length!=0 && top.specialGame.cup_winnerWidget_sw=="Y" && top.specialGame.SPHLGame ==0 && top.specialGame.cup_hl_items==""))){
					league_tab_highlights.style.display = "";
					util.addEvent(league_tab_highlights, "click", _self.chgTab_league, {"kind":"highlights", "rtype":"r","showtype":"today","specialClick":"special"});
				}else league_tab_highlights.style.display = "none";
				if(league_tab_teams && top.specialGame.team_sw=="Y" && top["specialGame"]["CUP_TEAM_ARY"].length>0){
					league_tab_teams.style.display = "";
					util.addEvent(league_tab_teams, "click", _self.chgTab_league, {"kind":"teams", "rtype":"r","showtype":"today","specialClick":"special"});
				}else league_tab_teams.style.display = "none";
				if(league_tab_standings && top.specialGame.standings_sw=="Y" && top.specialGame.CUP_GROUP_count>0){
					league_tab_standings.style.display = "";
					util.addEvent(league_tab_standings, "click", _self.chgTab_league, {"kind":"standings", "rtype":"r","showtype":"today","specialClick":"special"});
				}else league_tab_standings.style.display = "none";
			}
		}else{
			for(var l=0; l < leagueTab_Ary.length; l++){
				var targetTab = dom.getElementById(leagueTab_Ary[l]);
				if(top.isLeagued || postHash["isLeagued"] == "Y"){
					if(targetTab)targetTab.style.display = "none";
				}else{
					if(top.choice_showtype.match(/today/)){
						if(leagueTab_Ary[l]){
							var tmpPage = leagueTab_Ary[l].split("_")[2];
							if(nowHideTab.indexOf(tmpPage) != -1){
								// echo(tmpPage,"沒有賽事，隱藏起來!!!");
								continue;
							}
							targetTab.style.display = "";
							util.addEvent(targetTab, "click", _self.chgTab_league, {"kind":"game", "rtype":"r" ,"showtype":"today","filterPage":tmpPage,"singelLegHash":singelLegHash});
						}
						if(league_tab_game)league_tab_game.style.display="none";
						if(league_tab_fs)league_tab_fs.style.display="none";
					}else{
						if(targetTab)targetTab.style.display = "none";
					}
				}
			}
			if(top.choice_showtype.match(/early|parlay|today/)){
				if(league_tab_game){
					if(top.choice_showtype.match(/early|parlay/) || (top.isLeagued && top.choice_showtype == "today"))league_tab_game.style.display="";
					var _rtype = (top.choice_showtype == "parlay" && top.choice_gtype == "ft")?"rb":"r";
					if(postHash["isLeagued"] == "Y"){
						util.addEvent(league_tab_game, "click", _self.goToLegPage,{"rtype":"r"});
					}else{
						util.addEvent(league_tab_game, "click", _self.chgTab_league, {"kind":"game", "rtype":_rtype ,"showtype":top.choice_showtype,"filterPage":top.choice_showtype,"singelLegHash":singelLegHash});
					}
				}
			}
			if(top.choice_showtype.match(/today|early/) && nowHideTab.indexOf("fantasy") == -1 && league_tab_fantasy && top.choice_gtype == "ft"){
				if(postHash["action"] != "clickCoupon" && top.fantasy_lid != "" && postHash["lid"] && postHash["lid"].indexOf(top.fantasy_lid) != -1){
					// echo("選到的聯盟包含夢幻聯盟，隱藏夢幻賽頁籤");
					league_tab_fantasy.style.display="none";
				}else{
					// echo("顯示夢幻賽事頁籤");
					league_tab_fantasy.style.display="";
					util.addEvent(league_tab_fantasy, "click", _self.chgTab_league, {"kind":"fantasy", "rtype":"r","showtype":top.choice_showtype,"filterPage":"fantasy","singelLegHash":singelLegHash});
				}
			}else league_tab_fantasy.style.display="none";
			if(top.choice_showtype.match(/early|today/) && league_tab_fs && top.choice_gtype!="es"){
				if(top.choice_showtype == "early" || postHash["isLeagued"] == "Y")league_tab_fs.style.display="";
				if(postHash["isLeagued"] == "Y"){
					util.addEvent(league_tab_fs, "click", _self.goToLegPage,{"rtype":"fs"});
				}else{
					util.addEvent(league_tab_fs, "click", _self.chgTab_league, {"kind":"fs", "rtype":"fs","showtype":"early","filterPage":"fs","singelLegHash":singelLegHash});
				}
			}else league_tab_fs.style.display="none";
			
		}
	}

	_self.setPostHash = function(hash){
		singelLegHash = hash;
		_self.initTab();
	}

	_self.chgTab_league = function(e, par){
		if(isDraging){
			echo("拖曳中不執行!!!!");
			return;
		}
		_self.showFantasyMessage(false);
		top.loadTab_done = false;
		if(top.specialGame.mode == "CUP" && top.specialClick != ""){
			nowTS = util.getTimestamp();
			top["specialGame"]["clickTabTs"] = nowTS;
			top.lastClickTS = nowTS;
			par.nowClickTabTs = nowTS;
		}
		top["notShowLegGame"] = new Object();
		top["notShowLeg"] = new Object();
		if(top.choice_showtype == "today"){
			parentClass.dispatchEvent("set_first_no_tvmt",false);
		}
		parentClass.dispatchEvent("setPDtabVisible",false);
		var tab_block_sw = config_set.get("TAB_BLOCK_SW");
		if(tab_block_sw && top.specialGame.mode=="CUP"){
			newTS = util.getTimestamp();	
			var sec_diff = Math.abs(newTS-oldTS);
			if(!top.chgBodyDone){
				echo("按太快了");
				if(sec_diff>5000){
					oldTS = newTS;
					top.chgBodyDone=true;
				}
				return;
			}else{
				oldTS = newTS;
				oldRtype = top.choice_rtype;
			}
		}
		if(par.filterPage){
			lastRtype = top.choice_rtype;
			nowFilter = util.switchFilterType(par.filterPage);
			headerFrame.updateNowFilter(nowFilter);
			headerFrame.updateTypeCount(filterHash[top.choice_gtype.toUpperCase()][nowFilter.toUpperCase()]*1);
			top.choice_filter = nowFilter;
		}
		var act = (par.act)?par.act:"";
		if(e.type == "click" && par.kind == "fs")par["action"] = e.type;
		clearTimeout(getSpecData);
		_self.isFantasyPage(par.kind);
		
        par.nowTS = nowTS;
		top.showOBT = "";
		top.choice_rtype = par.rtype;
		top.choice_showtype = par.showtype;
		_self.tabLight(par);
		_self.setIcon();
		_self.showTab(false);
		_self.showESTab(false);
		parentClass.dispatchEvent("clearGameTimer");
		parentClass.dispatchEvent("createGameTimer");
		if(act==""){
			if(top.specialGame.mode=="CUP" && par.kind!="highlights")dom.getElementById("body_show").scrollTop=0;
			parentClass.dispatchEvent("showGameLoading",true);
		}
		if((top.choice_gtype == "ft" || top.choice_gtype == "es") && top.choice_showtype != "mygame" && par.kind != "fs"){
			chgFilter = true;
			if(top.specialGame.mode != "CUP" && (top.specialClick=="special" && top.choice_gtype!="es"))_self.getPageCount("game_list");
		}
		if(top.specialClick=="special")_self.getSpecCount("chkCount",par);
		else{
			 _self.chgTab(null,{"rtype":par.rtype,"filter":par.filterPage,"singelLegHash":par.singelLegHash});
		}
	}

	_self.closeGameLoading = function(isShow){
		parentClass.dispatchEvent("showGameLoading",false);
	}

	_self.showTab = function(show){
		dom.getElementById("total_tab").style.display=(show)?"":"none";
		if(show && chgFilter){
			chgFilter = false;
			dom.getElementById("filter_scroll").scrollLeft = 0;
		}
		_self.showFantasyMessage(top.specialGame.isFantasy);
	}

	_self.showESTab = function(show){
		dom.getElementById("ES_tab").style.display=(show)?"":"none";
		if(show && chgFilter){
			chgFilter = false;
			dom.getElementById("ES_tab_scroll").scrollLeft = 0;
		}
	}

	_self.showSPESTab = function(show){
		dom.getElementById("SPES_tab").style.display=(show)?"":"none";
		if(show && chgFilter){
			chgFilter = false;
			dom.getElementById("SPES_tab_scroll").scrollLeft = 0;
		}
	}

	_self.isFantasyPage = function(kind){
		var kindAry = new Array("highlights","fantasy","teams","standings");
		var nameAry = new Array("isHL","isFantasy","isTeam","isStandings");
		for(var i=0;i<nameAry.length;i++){
			top["specialGame"][nameAry[i]] = false;
			if(kind==kindAry[i]) top["specialGame"][nameAry[i]] = true;
		}
	}

	_self.chkGtype = function(gtype){
		if((postHash["gtype"] != gtype) && gtype != ""){
			postHash["gtype"] = gtype;
			return true;
		}else{
			return false;
		}
	}

	_self.getSpecCount = function(mode,par){
			var urlParams = "";
			var param = top.param;
			if(mode)param+="&mode="+mode;
			if(par)param += "&ts="+par.nowTS;
            urlParams = "p=get_specialGame_count&" + param;
            var getHTML = new HttpRequest();
            getHTML.addEventListener("onError", _self.onError);
            getHTML.addEventListener("LoadComplete", function(xml){
                _self.getSpecCountComplete(xml,mode, par);
            });
            getHTML.loadURL(top.m2_url, "POST", urlParams);
    }

    _self.getSpecCountComplete = function(xml,mode,par){
            var xmdObj = new Object();
			var needsGetModel = false;
            xmlnode = util.parseXml(xml);
			
			var tmpTS = xmlnode.Node(xmlnode.Root[0],"ts").innerHTML;
			if(!util.checkTS(nowTS, tmpTS, "get_specialGame_count")&& tmpTS){
				echo("[getSpecCountComplete]ts不同，被return掉了");
				return;
			}
			var chgCUPPeriod = false;
			xmdObj["code"] = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
            //xmdObj["total_count"] = xmlnode.Node(xmlnode.Root[0],"total_count").innerHTML;
            xmdObj["title"] = xmlnode.Node(xmlnode.Root[0],"title").innerHTML;
            xmdObj["SPRB"] = xmlnode.Node(xmlnode.Root[0],"SPRB").innerHTML;
            xmdObj["SPFU"] = xmlnode.Node(xmlnode.Root[0],"SPFU").innerHTML;
			xmdObj["SPFT"] = xmlnode.Node(xmlnode.Root[0],"SPFT").innerHTML;
			xmdObj["SPEM"] = xmlnode.Node(xmlnode.Root[0],"SPEM").innerHTML;
            xmdObj["FS"] = xmlnode.Node(xmlnode.Root[0],"FS").innerHTML;
			xmdObj["SPCUPFantasy"] = xmlnode.Node(xmlnode.Root[0],"SPCUPFantasy").innerHTML;
			xmdObj["SPFantasy"] = xmlnode.Node(xmlnode.Root[0],"SPFantasy").innerHTML;
			xmdObj["gtype"] = xmlnode.Node(xmlnode.Root[0],"gtype").innerHTML;
			xmdObj["Fantasy_leg"] = xmlnode.Node(xmlnode.Root[0],"Fantasy_leg").innerHTML;
			xmdObj["SPCUP_MAIN"] = xmlnode.Node(xmlnode.Root[0],"SPCUP_MAIN").innerHTML;
			xmdObj["group_count"] = xmlnode.Node(xmlnode.Root[0],"group_count").innerHTML;
			xmdObj["FS_cup_team"] = xmlnode.Node(xmlnode.Root[0],"FS_cup_team");
			xmdObj["FT_cup_team"] = xmlnode.Node(xmlnode.Root[0],"FT_cup_team");
			xmdObj["mode"] = xmlnode.Node(xmlnode.Root[0],"mode").innerHTML;
			xmdObj["highlights_sw"] = xmlnode.Node(xmlnode.Root[0],"highlights_sw").innerHTML;
			xmdObj["team_sw"] = xmlnode.Node(xmlnode.Root[0],"team_sw").innerHTML;
			xmdObj["standings_sw"] = xmlnode.Node(xmlnode.Root[0],"standings_sw").innerHTML;
			xmdObj["period"] = xmlnode.Node(xmlnode.Root[0],"period").innerHTML;
			xmdObj["feed_sw"] = xmlnode.Node(xmlnode.Root[0],"feed_sw").innerHTML;
			xmdObj["season_id"] = xmlnode.Node(xmlnode.Root[0],"season_id").innerHTML;
			xmdObj["gameCountMode"] = xmlnode.Node(xmlnode.Root[0],"gameCountMode").innerHTML;
			xmdObj["cup_featureEvent_sw"] = xmlnode.Node(xmlnode.Root[0],"cup_featureEvent_sw").innerHTML;
			xmdObj["cup_standings_sw"] = xmlnode.Node(xmlnode.Root[0],"cup_standings_sw").innerHTML;
			xmdObj["cup_winnerWidget_sw"] = xmlnode.Node(xmlnode.Root[0],"cup_winnerWidget_sw").innerHTML;
			xmdObj["cup_secondaryBanner_sw"] = xmlnode.Node(xmlnode.Root[0],"cup_secondaryBanner_sw").innerHTML;
			xmdObj["cup_tournamentOverview_sw"] = xmlnode.Node(xmlnode.Root[0],"cup_tournamentOverview_sw").innerHTML;
			xmdObj["cup_postToFrontend_sw"] = xmlnode.Node(xmlnode.Root[0],"cup_postToFrontend_sw").innerHTML;
			xmdObj["cup_tabSort"] = xmlnode.Node(xmlnode.Root[0],"cup_tabSort").innerHTML;
			xmdObj["cup_MainLid"] = xmlnode.Node(xmlnode.Root[0],"cup_MainLid").innerHTML;
			xmdObj["cup_hl_items"] = xmlnode.Node(xmlnode.Root[0],"cup_hl_items").innerHTML;
			xmdObj["SPHLGame"] = xmlnode.Node(xmlnode.Root[0],"SPHLGame").innerHTML;
			if(xmdObj["gameCountMode"]!=xmdObj["mode"]){
				return;
			}
			top.specialTitle = xmdObj["title"];
			//top.SP_CUP_TEAM = xmdObj["CUP_TEAM"];
			top.betradar_season = (xmdObj["season_id"])?xmdObj["season_id"]:"";

			if(top.specialGame.mode!="" && top.specialGame.mode!=xmdObj["mode"] && top.specialClick=="special"){ 
				win._history.pop();
				top.specialGame.mode = xmdObj["mode"];
				var par = new Object();
				par["page"] = "league_index";
				par["showtype"] = "today";
				par["type"] = "today";
				par["specialClick"] = "special";
				par["outrightsClick"] = "";
				headerFrame.goPage(null,par);
				return;
			} 

			top.choice_gtype = (xmdObj["gtype"].toLowerCase() != "")?xmdObj["gtype"].toLowerCase():postHash["gtype"];
			if(top.specialClick=="")top.showGtype[top.choice_showtype] = top.choice_gtype;
			top["specialGame"]["gtype"] = xmdObj["gtype"];
			top["specialGame"]["FantasyLID"] = xmdObj["Fantasy_leg"];
			top["specialGame"]["RB"] = xmdObj["SPRB"];
			top["specialGame"]["FT"] = xmdObj["SPFT"];
            top["specialGame"]["FU"] = xmdObj["SPFU"];
			top["specialGame"]["EM"] = xmdObj["SPEM"];
            top["specialGame"]["FTFU"] = (xmdObj["SPFT"]*1)+(xmdObj["SPFU"]*1);
            top["specialGame"]["FS"] = xmdObj["FS"];
            if(xmdObj["mode"]=="CUP"){
				top["specialGame"]["Fantasy"] = xmdObj["SPCUPFantasy"];
				top["specialGame"]["Total_Count"] = (xmdObj["SPRB"]*1)+(xmdObj["FS"]*1)+(top["specialGame"]["FTFU"]*1)+(xmdObj["SPEM"]*1)+(top["specialGame"]["Fantasy"]*1);
			}else {
				top["specialGame"]["Fantasy"] = xmdObj["SPFantasy"];
				top["specialGame"]["Total_Count"] = (xmdObj["SPRB"]*1)+(xmdObj["FS"]*1)+(top["specialGame"]["FTFU"]*1)+(xmdObj["SPEM"]*1);
			}
            top["specialGame"]["title"] = xmdObj["title"];
			top["specialGame"]["CUP_MAIN"] = xmdObj["SPCUP_MAIN"];
			top["specialGame"]["CUP_GROUP_count"] = xmdObj["group_count"];
			top["specialGame"]["CUP_TEAM"] = new Object();
			top["specialGame"]["CUP_TEAM_ARY"] = new Array();

			var CUP_TEAM = new Object();
            var all_team_fs = new Object();
			if(xmdObj["code"]!="noFS"){
				all_team_fs = xmlnode.Node(xmdObj["FS_cup_team"],"team",false);
				var gameFSCount = (all_team_fs.length>0)?all_team_fs.length:0;
				for(var z=0; z<gameFSCount; z++){
					var tmp_team_fs = all_team_fs[z];
					if(tmp_team_fs){
						var fs_team_id = tmp_team_fs.getAttribute("id");
						var fs_count = tmp_team_fs.innerHTML;
						CUP_TEAM["t"+fs_team_id]=fs_count*1;
					}
				}
			}
            var all_team_ft = new Object();
            all_team_ft = xmlnode.Node(xmdObj["FT_cup_team"],"team",false);
            var gameFTCount = (all_team_ft.length>0)?all_team_ft.length:0;
            for(var y=0; y<gameFTCount; y++){
                var tmp_team_ft = all_team_ft[y];
                if(tmp_team_ft){
                    var ft_team_id = tmp_team_ft.getAttribute("id");
                    var ft_count = tmp_team_ft.innerHTML;
                    if(CUP_TEAM["t"+ft_team_id])CUP_TEAM["t"+ft_team_id]+=ft_count*1;
                }
            }

			for(var key in CUP_TEAM){
				top["specialGame"]["CUP_TEAM"][key] = CUP_TEAM[key];
				allCnt = CUP_TEAM[key];
                if(allCnt!=0)top["specialGame"]["CUP_TEAM_ARY"].push(key);
			}

			top["specialGame"]["mode"] = xmdObj["mode"];
			top["specialGame"]["highlights_sw"] = xmdObj["highlights_sw"];
			top["specialGame"]["team_sw"] = xmdObj["team_sw"];
			top["specialGame"]["standings_sw"] = xmdObj["standings_sw"];
			if((top["specialGame"]["period"]=="IN" || top["specialGame"]["period"]=="PRE") && (xmdObj["period"]=="IN" || xmdObj["period"]=="PRE")){
				if(top["specialGame"]["period"]!=xmdObj["period"])chgCUPPeriod=true;
			}
			top["specialGame"]["period"] = xmdObj["period"];
			top["specialGame"]["feed_sw"] = xmdObj["feed_sw"];
			top["specialGame"]["cup_featureEvent_sw"] = xmdObj["cup_featureEvent_sw"];
            top["specialGame"]["cup_standings_sw"] = xmdObj["cup_standings_sw"];
            top["specialGame"]["cup_winnerWidget_sw"] = xmdObj["cup_winnerWidget_sw"];
            top["specialGame"]["cup_secondaryBanner_sw"] = xmdObj["cup_secondaryBanner_sw"];
            top["specialGame"]["cup_tournamentOverview_sw"] = xmdObj["cup_tournamentOverview_sw"];
            top["specialGame"]["cup_postToFrontend_sw"] = xmdObj["cup_postToFrontend_sw"];
			top["specialGame"]["cup_tabSort"] = xmdObj["cup_tabSort"];
			top["specialGame"]["cup_MainLid"] = xmdObj["cup_MainLid"];
			top["specialGame"]["cup_hl_items"] = xmdObj["cup_hl_items"];
			top["specialGame"]["SPHLGame"] = xmdObj["SPHLGame"];

			var showCUP = ((top["specialGame"]["Total_Count"]>0 || (top["specialGame"]["CUP_GROUP_count"]>0 && (top.specialGame.standings_sw=="Y" || (top.specialGame.cup_standings_sw=="Y" && top.specialGame.period=="IN")))) && top["specialGame"]["cup_postToFrontend_sw"]=="Y" && top.specialGame.mode=="CUP");
            var showNORMAL = (top["specialGame"]["Total_Count"]>0 && top.specialGame.mode=="NORMAL");
			if(showCUP || showNORMAL){
                headerFrame.showSpecialTitle({"isShow":true ,"name": xmdObj["title"]});
            }else{
                headerFrame.showSpecialTitle({"isShow":false});
            }
			needsGetModel = _self.chkGtype(xmdObj["gtype"].toLowerCase());

			if(par){
				if(top.choice_rtype != par.rtype){
					echo("rtype錯誤 直接中斷");
					return;
				}
				par.specialTitle = xmdObj["title"];
				
				if(top.specialGame.mode=="CUP")needsGetModel = true;
				if(needsGetModel || par.kind=="highlights" || par.kind=="teams" || par.kind=="standings"){
					if(par.kind=="teams" && top["specialGame"]["CUP_TEAM_ARY"].length==0 && top.extendsClass=="game_list_cup"){
						parentClass.dispatchEvent("getSpecialData",{});
					}else{
						if(chgCUPPeriod && top.specialGame.isHL){
							var obj = {"kind":"highlights", "rtype":"r","showtype":"today","specialClick":"special"};
							_self.chgTab_league("click",obj);
							return;
						}
						_self.goToSpecial(par);
					}
				}else {
					_self.getSpecModel(par);
				}
			}
			if(mode == "get_game_list" || mode == "get_league_list"){
				nowModelShowtype = top.game_model.split("_")[1];
				var needsGetTrueModel = false;			
				if(top.choice_rtype == "fs"){
					nowModelRtype = top.game_model.split("_")[2];
					if(nowModelRtype != top.choice_rtype)needsGetTrueModel = true;
				}
				else{
					if(nowModelShowtype == "today" && !top.specialGame.isFantasy){
						needsGetTrueModel = true;
					}
					if(nowModelShowtype == "mygame" && top.specialGame.isFantasy){
						needsGetTrueModel = true;
					}
				}
				if(mode == "get_game_list" && needsGetTrueModel){
					echo("model錯誤,校正model showtype");
					var param = new Object();
					var kind = "";
					
					switch(top.choice_showtype){
						case "early":
							kind = "fs";
							break;
						case "today":
							kind = "game";
							break;
						case "live":
							kind = "rb";
							break;
					}
					if(top.specialGame.isFantasy)kind="fantasy";
					param["rtype"] = top.choice_rtype;
					param["showtype"] = top.choice_showtype;
					param["kind"] = kind;
					param["specialTitle"] = top.specialGame.title;
					param["action"] = "click";
					_self.getSpecModel(param);
				}

				if(top.specialGame.mode=="CUP"){
					var league_tab_highlights = dom.getElementById("league_tab_highlights");
					if(top["specialGame"]["highlights_sw"]=="Y" && (top.specialGame.SPHLGame >0 || (top.specialGame.FS>0 && top.specialGame.cup_hl_items!="") || (top.specialGame.cup_standings_sw=="Y" && top["specialGame"]["period"]=="IN" && top.specialGame.CUP_GROUP_count>0) || (top["specialGame"]["CUP_TEAM_ARY"].length!=0 && top.specialGame.cup_winnerWidget_sw=="Y"))){
						league_tab_highlights.style.display="";
						util.addEvent(league_tab_highlights, "click", _self.chgTab_league, {"kind":"highlights", "rtype":"r","showtype":"today","specialClick":"special"});
					}else league_tab_highlights.style.display="none";

					var league_tab_game = dom.getElementById("league_tab_game");
					if(top.specialGame.RB>0 || top.specialGame.FTFU>0){
						league_tab_game.style.display="";
						util.addEvent(league_tab_game, "click", _self.chgTab_league, {"kind":"game", "rtype":"r" ,"showtype":"today","specialClick":"special"});
					}else league_tab_game.style.display="none";
				
					var league_tab_teams = dom.getElementById("league_tab_teams");
					if(top["specialGame"]["team_sw"]=="Y" && top["specialGame"]["CUP_TEAM_ARY"].length>0){
						league_tab_teams.style.display="";
						util.addEvent(league_tab_teams, "click", _self.chgTab_league, {"kind":"teams", "rtype":"r","showtype":"today","specialClick":"special"});
					}else league_tab_teams.style.display="none";

					var league_tab_fs = dom.getElementById("league_tab_fs");
					if(top.specialGame.FS>0){
						league_tab_fs.style.display="";
						util.addEvent(league_tab_fs, "click", _self.chgTab_league, {"kind":"fs", "rtype":"fs","showtype":"early", "page":"league_index" ,"specialClick":"special"});
					}else league_tab_fs.style.display="none";

					var league_tab_standings = dom.getElementById("league_tab_standings");
					if(top["specialGame"]["standings_sw"]=="Y" && top.specialGame.CUP_GROUP_count>0){
						league_tab_standings.style.display="";
						util.addEvent(league_tab_standings, "click", _self.chgTab_league, {"kind":"standings", "rtype":"r","showtype":"today","specialClick":"special"});
					}else league_tab_standings.style.display="none";

					if(chgCUPPeriod && top.specialGame.isHL){
						var obj = {"kind":"highlights", "rtype":"r","showtype":"today","specialClick":"special"};
						_self.chgTab_league("click",obj);
						return;
					}
				}

				if(needsGetModel){
					var _par = _self.parSet();
					_self.isFantasyPage(_par.kind);
					_self.goToSpecial(_par);
				}
				else if(mode == "get_league_list")return;
				else parentClass.dispatchEvent("getSpecialData",{});
			}
			// var filterDragObj = {"tagName":"filter_out","total":dom.getElementById("filter_total"),"scroll":dom.getElementById("filter_scroll")};
			// util.dragScroll(dom,"filter_scroll",_self.setTabEvent,_self.removeTabEvent,filterDragObj);
	}

	_self.getSpecModel = function(par){
			var needGet = true;
			var postHash = new Object();
			par["needGet"] = needGet;

			postHash["gtype"] = top.choice_gtype;
			postHash["showtype"] = par.showtype;
			postHash["rtype"] = par.rtype;
			postHash["specialClick"] = par.specialClick;
			postHash["specialTitle"] = par.specialTitle;
			postHash["kind"] = par.kind;
			if(par.nowClickTabTs){
				postHash["nowClickTabTs"] = par.nowClickTabTs;
			}
			var historyHash = "";
			historyHash = JSON.parse(JSON.stringify(win._history[win._history.length-1])); 
			var stateHash = historyHash.state.post.split("&");
			stateHash[1] = "showtype="+par.showtype;
			stateHash[2] = "rtype="+par.rtype;

			historyHash.state.post = stateHash.join("&");
			historyHash.state.postHash = util.clone(postHash);
			historyHash.state.rtype = par.rtype;
			historyHash.state.showtype = par.showtype;
			historyHash.state.specialClick = par.specialClick;
			historyHash.state.specialTitle = par.specialTitle;
			historyHash.state.type = par.showtype;
			top["lastSportAll"] = historyHash.state;
			win._history.push(historyHash);
			par.postHash = postHash;
			parentClass.dispatchEvent("initBackCount",{});
			parentClass.dispatchEvent("getModel", par);
	}

	_self.goToSpecial = function(par){
		var postHash = new Object();
		var showtype = (par.showtype)?par.showtype:top.choice_showtype;
		var rtype = (par.rtype)?par.rtype:top.choice_rtype;
		var specialClick = (par.specialClick)?par["specialClick"]:top.specialClick;
		var specialTitle = (par.specialTitle)?par["specialTitle"]:top.specialGame.title;
		var kind =  (par["kind"])?par["kind"]:postHash["kind"];

        postHash["gtype"] = top.choice_gtype;
        postHash["showtype"] = showtype;
        postHash["rtype"] = rtype;
        postHash["specialClick"] = specialClick;
		postHash["specialTitle"] = specialTitle;
		postHash["kind"] = kind;
		if(par.nowClickTabTs){
			postHash["nowClickTabTs"] = par.nowClickTabTs;
		}

        par["post"] = "gtype="+top.choice_gtype+"&showtype="+showtype+"&rtype="+rtype;
		if(par.kind=="highlights" || par.kind=="teams" || par.kind=="standings"){
			par["page"] = "game_list_SP";
			par["extendsClass"] = "game_list_cup";
			if(par.kind=="teams"){
				postHash["team_id"] = top.specialGame.choice_teamID;
				top.specialGame.isTeam = true;
				top.specialGame.cup_page = "teams";
			}else if(par.kind=="standings"){
				top.specialGame.isStandings = true;
				top.specialGame.cup_page = "standings";
			}else{
				top.specialGame.isHL = true;
				top.specialGame.cup_page = "HL";
			}
		}else{
			if(par.kind=="fs")top.specialGame.cup_page = "fs";
			else if(par.kind=="fantasy")top.specialGame.cup_page = "fantasy";
			else top.specialGame.cup_page = "game";
			par["page"] = "game_list_"+top.choice_gtype.toUpperCase();
			par["extendsClass"] = "game_list";
		}
		par["postHash"] = postHash;
		par["mode"] = top.specialGame.mode;
        parentClass.dispatchEvent("bodyGoToPage", par);
	}

	_self.parSet = function(){
			var par = new Object();
			par["specialTitle"] = top.specialGame.title;
			top.choice_showtype = "today";
			top.choice_rtype = "r";
			par["page"] = "game_list_SP";
			par["extendsClass"] = "game_list_cup";
			top.specialGame.isHL = true;
			top.specialGame.cup_page = "HL";
			par["kind"] = "highlights";

			if(top.specialGame.mode != "CUP"){
				top.specialGame.isHL = false;
				top.specialGame.isTeam = false;
				top.specialGame.isStandings = false;
				top.specialGame.cup_page = "";
				top.choice_showtype = "today";
				top.choice_rtype = "r";
				par["page"] = "game_list_"+top.choice_gtype.toUpperCase();
				par["extendsClass"] = "game_list";
				par["kind"] = "today";
	
				if(top.specialGame.RB == "0" && top.specialGame.FTFU == "0"){
					top.choice_showtype = "early";
					top.choice_rtype = "fs";
					par["page"] = "game_list_"+top.choice_gtype.toUpperCase();
					par["extendsClass"] = "game_list";
					par["kind"] = "fs";
					if(top.specialGame.FS == "0" && top.choice_gtype == "ft"){
						top.choice_showtype = "today";
						top.choice_rtype = "r";
						top.specialGame.isFantasy = true;
						postHash["kind"] = "fantasy";
						par["kind"] = "fantasy";
						par["page"] = "game_list_"+top.choice_gtype.toUpperCase();
						par["extendsClass"] = "game_list";
					}
				}
			}
			par["mode"] = top.specialGame.mode;

		return par;
	}

	_self.tabLight = function(par){
		var rtype = par.rtype;
		if(top.choice_gtype=="es" && top.specialClick!="")rtype = "game";
		var filter = par.filterPage;
		var tab_ary = new Array("league_tab_rb","league_tab_game","league_tab_fs","league_tab_fantasy","league_tab_highlights","league_tab_teams","league_tab_teams","league_tab_standings","league_tab_prestart","league_tab_mix","league_tab_next1","league_tab_next6");
		for(var t=0;t<tab_ary.length;t++){
			if(dom.getElementById(tab_ary[t]))dom.getElementById(tab_ary[t]).classList.remove("on");
		}
		if(rtype.match(/r|rb|pd/))rtype = "game";
		if(top.specialGame.isFantasy)rtype = "fantasy";
		if(top.specialGame.isHL)rtype = "highlights";
		if(top.specialGame.isTeam)rtype = "teams";
		if(top.specialGame.isStandings)rtype = "standings";
		if(top.specialClick == "" && !top.isLeagued && dom.getElementById("league_tab_"+filter)){
			dom.getElementById("league_tab_"+filter).classList.add("on");
			// echo("將filterTab亮色",filter);
		}
		else{
			// echo("將rtype亮色",rtype);
			if(dom.getElementById("league_tab_"+rtype))dom.getElementById("league_tab_"+rtype).classList.add("on");
		}
	}

	_self.chgTab = function(e, param){
		var chgModelTs = util.getTimestamp();
		top.chgModelTs = chgModelTs;
		top.choice_rtype = param.rtype;
		top.nowPDMode = (top.choice_rtype.match(/pd/))?"choice":"all";
		if(top.specialGame.SW && top.specialClick == "special")_self.getSpecCount("chkCount");
		if(param.rtype != "fs" && (top.choice_gtype == "ft" || (top.choice_gtype == "es" && top.specialClick=="")) && top.choice_showtype != "mygame"){
			_self.getPageCount("game_list");
		}
		if(top.choice_gtype == "ft"){
			parentClass.dispatchEvent("clearHTECID");
			parentClass.dispatchEvent("clearSFSTeam");
		}
		if(top.choice_gtype == "es" && top.rightECID!=""){
			parentClass.dispatchEvent("set_first_no_tvmt",false);
			parentClass.dispatchEvent("set_statisticsID","");
		}
		if(top.choice_showtype=="mygame" && top.choice_gtype=="es"){
			var _scroll = dom.getElementById("MYES_tab_scroll").scrollLeft;
			parentClass.dispatchEvent("setMyGameEStabScroll",_scroll);
		}
		
		if(param.filter){
			if(!top.isLeagued && (lastRtype != param.rtype)){
				// echo("Model不同，需重新載!!");
				postHash["rtype"] = param.rtype;
				postHash["type"] = param.filter;
				if(param.singelLegHash){
					postHash["headername"] = param.singelLegHash["headername"];
					postHash["headertype"] = param.singelLegHash["headertype"];
					postHash["lid"] = param.singelLegHash["lid"];
					postHash["field"] = param.singelLegHash["field"];
					postHash["date"] = param.singelLegHash["date"];
				}
				parentClass.dispatchEvent("getModel", {"needGet":true,"chgModelTs":chgModelTs,"postHash":postHash});
			}else{
				if(param.filter == "fs")parentClass.dispatchEvent("getData_FS");
				else {
					if(top.isLeagued && param.filter == "fantasy"){
						// echo("從選擇聯盟直接點進夢幻賽事盤面!!");
						var par =  {"rtype":"fantasy","isFantasy":"Y","ts":chgModelTs,"isLeaguePage":"Y"};
						_self.goToGameList(par);
					}
					else{
						parentClass.dispatchEvent("chgFilterPage",chgModelTs);
					}
				}
			}
		}else parentClass.dispatchEvent("getModel", {"needGet":true,"chgModelTs":chgModelTs});
		lastRtype = param.rtype;
	}

	_self.chgTabCss = function(_rtype){
        var _tabHash = (top.choice_gtype=="es")?es_tabHash:TAB_ary;
		var SPorMYGAME_str = "";
		if(top.specialGame.gtype=="ES" && top.specialClick!="")SPorMYGAME_str="SP";
		else if(top.choice_gtype=="es" && top.choice_showtype=="mygame")SPorMYGAME_str="MY";
		var isES = (top.choice_gtype=="es")?SPorMYGAME_str+"ES_":"";
        for(var i=0; i < _tabHash.length; i++){
			var tmpObj = dom.getElementById(isES+"tab_"+_tabHash[i]);
			if(tmpObj!=null) util.removeClass(tmpObj, "on");
		}
		var tmpRtype = "main";
		if(_rtype != "r" &&  _rtype != "rb"){
			if(top.choice_showtype == "live"){
				tmpRtype = _rtype.slice(1);
			}else{
				tmpRtype = _rtype;
			}
		}
		var obj = dom.getElementById(isES+"tab_"+tmpRtype);
        if(obj) util.addClass(obj, "on");
    }

	_self.backClick = function(e, param){
		top.BackTag = "Y";
		parentClass.dispatchEvent("backPage", {});
	}

	_self.createTimer=function(){
		if(timer!=null) return;
		timer = new Timer(config_set.get("CONFIG_LEAGUE_COUNT"));
		timer.setParentclass(_self);
		timer.init();
		timer.addEventListener("TimerEvent.TIMER", _self.getData);
		timer.addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish);
		timer.startTimer();
		timerHash["sportTimer"] = timer;
	}

	_self.startTimer=function(){
		if(timer==null) return;
		timer.startTimer();
	}

	_self.clearTimer=function(){
		if(timerHash!=null){
			if(timer!=null){
				timer.clearObj();
				timer.is_clear = true;
				timer=null;
			}
		}
		return true;
	}

	_self.timerFinish=function(count){ }   

	_self.getData=function(){
		headerFrame.noHeaderToSport();
		var urlParams = "p=get_league_count";
		urlParams += "&" + top.param;
		urlParams += "&sorttype=league";
		urlParams += "&date=ALL";
		urlParams += "&mode=sport_menu";
		urlParams += "&ts="+nowTS;
		urlParams += "&ltype=" + top["userData"].ltype;

        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"),null);
        hr.setParentclass(parentClass);
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.getDataComplete);
        hr.loadURL(top.m2_url, "POST", urlParams);
	}

	_self.onError=function(){

	}

	_self.getDataComplete=function(xml){
			var errorMsg = util.showConnectMsg(xml);
			if(util.alertConnectMsg(errorMsg))  return;
			var xmdObj = new Object();
			var countHash = new Object();
			xmlnode = util.parseXml(xml);
			if(top.specialClick == "special"){
				_self.clearTimer();
				echo("=== 特殊賽事不跑get_league_count , 清除timer ===");
				return;
			}
			xmdObj["code"] = xmlnode.Node(xmlnode.Root[0],"code");
			xmdObj["game"] = xmlnode.Node(xmlnode.Root[0],"game");
			var tmpTS = xmlnode.Node(xmlnode.Root[0],"ts").innerHTML;
			if(!util.checkTS(nowTS, tmpTS, "get_league_count")) return;
			if(xmdObj["code"].innerHTML=="601"){
					var noGame = true;
					if(top.isLeagued && top.choice_showtype=="today"){
						top.choice_filter = "MIX";
					}
					for(var i=0; i<xmdObj["game"].length; i++){
							gtype = xmlnode.Node(xmdObj["game"][i],"gtype").innerHTML;
							_gtype = gtype.toLowerCase();

							if(util.in_array(gtype, gtype_ary)){
								var type = top.choice_showtype;
								if(top.choice_showtype=="today"){
									switch(top.choice_filter){
										case "RB":
											type = "live";
											break;
										case "Next1":
											type = "n1";
											break;
										case "Next6":
											type = "n6";
											break;
										case "MIX":
											type = "mixft";
											break;
									}
								}
									var _type = util.switchShowType(type,true);
									var count = xmlnode.Node(xmdObj["game"][i],_type+"_count").innerHTML*1;
									if(!top.isLeagued && top.choice_showtype.match(/today|early|parlay/) && top.specialClick == ""){
										if(type == "early")filterTab = new Array("FU","FS_FU","FU_FANTASY");
										else if(type == "parlay")filterTab = new Array("FT");
										else if(!top.choice_gtype.match(/ft|es/) && type == "today")filterTab = new Array("MIX","FT","RB","NEXT1","NEXT6");
										if(filterHash[gtype] == null){
											filterHash[gtype] = new Object();
											filterHash[gtype]["count"] = 0;
										}else{
											if(filterHash[gtype])filterHash[gtype]["count"] = 0;
										}
										for(var f=0;f<filterTab.length;f++){
											if(xmlnode.Node(xmdObj["game"][i],filterTab[f]) && xmlnode.Node(xmdObj["game"][i],filterTab[f]+"_count").innerHTML*1 > 0){
												
												filterHash[gtype][filterTab[f]] = xmlnode.Node(xmdObj["game"][i],filterTab[f]+"_count").innerHTML*1;
												filterHash[gtype]["count"] += filterHash[gtype][filterTab[f]];
											}else{
												if(top.choice_gtype == _gtype){
													//隱藏沒數量的Tab
													filterHash[gtype][filterTab[f]] = 0;
													//var targetTab = util.switchFilterType(filterTab[f]);
													//nowHideTab.push(targetTab);
													//echo("隱藏league_tab_"+targetTab);
													//if(dom.getElementById("league_tab_"+targetTab))dom.getElementById("league_tab_"+targetTab).style.display = "none";
												}
											}
										}
									}
									var fs_count = 0;
									if(isNaN(count)) count=0;
									
									if(top.outrightsClick=="outrights"){
										fs_ft_count = xmlnode.Node(xmdObj["game"][i],"FS_FT_count").innerHTML*1;
										fs_fu_count = xmlnode.Node(xmdObj["game"][i],"FS_FU_count").innerHTML*1;
										var total_count = (fs_ft_count+fs_fu_count);
										fs_count  = fs_fu_count;
									}else{
										if(_type.match("NEXT1|FT|HOT|MIX|NEXT6")){
											if(top.choice_showtype=="today")fs_count = xmlnode.Node(xmdObj["game"][i],"FS_FT_count").innerHTML*1;
										}else if(!_type.match("RB|P3")) fs_count = xmlnode.Node(xmdObj["game"][i],"FS_"+_type+"_count").innerHTML*1;
										if(isNaN(fs_count)) fs_count=0;
										var total_count = (count+fs_count);
										if(filterHash[gtype] && filterHash[gtype]["count"] > 0){
											total_count += filterHash[gtype]["count"];
											// echo("[",gtype,"][count] = ",filterHash[gtype]["count"]);
										}
									}
									if(gtype == top["bannerGtype"]){
										if(type=="today"){
											parentClass.dispatchEvent("chkBannerCount",(count+fs_count));
										}else{
											var ft_count = xmlnode.Node(xmdObj["game"][i],"FT_count").innerHTML*1;
											if(isNaN(ft_count)) ft_count=0;
											var fs_ft_count = xmlnode.Node(xmdObj["game"][i],"FS_FT_count").innerHTML*1;
											if(isNaN(fs_ft_count)) fs_ft_count=0;
											parentClass.dispatchEvent("chkBannerCount",(ft_count+fs_ft_count));
										}
									}
									_self.setData(_gtype,total_count);
									if(total_count>0){
										countHash[_gtype] = total_count;
										noGame = false;
									}else if(gtype=="ES"){
										dom.getElementById("ES_tab").style.display="none";
										if(dom.getElementById("MYES_tab"))dom.getElementById("MYES_tab").style.display="none";
										dom.getElementById("SPES_tab").style.display="none";
									}
							}
					}
					if(noGame)dom.getElementById("head_league").style.display="none";
					else dom.getElementById("head_league").style.display="";
					backPageCheckCount++;
					var is_chk = _self.checkSport(countHash,backPageCheckCount,filterHash);
					if(!is_chk) return;
					var mainZero = (top.choice_gtype=="ft" && mainCount == 0 && !showData);
					if(!mainZero)_self.setTabVisible(countHash);
					var _sport = dom.getElementById("sport_total");
					var _scroll = dom.getElementById("sport_scroll");
					var _left = dom.getElementById("sport_left");
					var _right = dom.getElementById("sport_right");
					var ret = false;
					
					if(_sport.clientWidth > _scroll.clientWidth){
						util.addClass(_right,"on");
						util.addEvent(_right,"click",util.move,{"click":_right ,"div":_scroll, "direction":"right", "opposite":_left});
					}
					util.addEvent(_scroll,"scroll",_self.addScrollEvent,{"total":_sport ,"scroll":_scroll , "left":_left , "right":_right});
					ret = _self.getGtypeDistance(_scroll);

					util.dragScroll(dom,"sport_scroll",_self.initGtypeBtn,_self.removeGtypeClick,{"tagName":"gtype"});
					// var filterDragObj = {"tagName":"filter_out","total":dom.getElementById("filter_total"),"scroll":dom.getElementById("filter_scroll")};
					// util.dragScroll(dom,"filter_scroll",_self.setTabEvent,_self.removeTabEvent,filterDragObj);
			}
	}

	_self.removeTabEvent = function(){
		var _tabHash = (top.choice_gtype=="es")?es_tabHash:tabHash;
		var SPorMYGAME_str = "";
		if(top.specialGame.gtype=="ES" && top.specialClick!="")SPorMYGAME_str="SP";
		else if(top.choice_gtype=="es" && top.choice_showtype=="mygame")SPorMYGAME_str="MY";
		var isES = (top.choice_gtype=="es")?SPorMYGAME_str+"ES_":"";
		for(var i=0; i< _tabHash.length; i++){
			var tmpTab = dom.getElementById(isES+"tab_"+_tabHash[i]);
			if(tmpTab)util.removeEvent(tmpTab, "click");
		}
	}

	_self.headerSportData=function(){
		LegXml = headerFrame.headerLegXmlData();
		_self.getDataComplete(LegXml);
	}

	_self.getMyGameData=function(){
		var countHash = new Object();
		var noGame = true;
		var total_count = 0;
		for(var i=0; i<gtype_ary.length; i++){
			var _gtype = gtype_ary[i].toLowerCase();
			var ecidHash = top["myGameHash"][_gtype];
			var myGameCnt = util.countSize(ecidHash);
			if(myGameCnt==0){
				total_count = 0;
			}else{
				var isNoData = true;
				for(var ecid in ecidHash){
					if(ecidHash[ecid]["ts"]==null || ecidHash[ecid]["ts"]==""){
						isNoData=false;
						total_count = myGameCnt;
						break;
					}
				}
				if(isNoData){
					total_count = 0;
				}
			}

			if(isNaN(myGameCnt)) total_count=0;
			_self.setData(_gtype,total_count);

			if(total_count>0){
				countHash[_gtype] = total_count;
				noGame = false;
			}	
		}
		if(noGame){
			dom.getElementById("sport_menu").style.display="none";
			dom.getElementById("total_tab").style.display="none";
			dom.getElementById("ES_tab").style.display="none";
			if(dom.getElementById("MYES_tab"))dom.getElementById("MYES_tab").style.display="none";
			dom.getElementById("SPES_tab").style.display="none";
			dom.getElementById("showtype_now").innerHTML = "";
			dom.getElementById("gtype_now").innerHTML = util.showTxt(LS.get("showtype_mygame"));
		}else{
			dom.getElementById("head_league").style.display="";
		} 
		backPageCheckCount++;
		var is_chk = _self.checkSport(countHash,backPageCheckCount);
		if(!is_chk) return;
		_self.setTabVisible(countHash);
		var _sport = dom.getElementById("sport_total");
		var _scroll = dom.getElementById("sport_scroll");
		var _left = dom.getElementById("sport_left");
		var _right = dom.getElementById("sport_right");
		var ret = false;
		
		if(_sport.clientWidth > _scroll.clientWidth){
			util.addClass(_right,"on");
			util.addEvent(_right,"click",util.move,{"click":_right ,"div":_scroll, "direction":"right", "opposite":_left});
		}
		util.addEvent(_scroll,"scroll",_self.addScrollEvent,{"total":_sport ,"scroll":_scroll , "left":_left , "right":_right});				
		ret = _self.getGtypeDistance(_scroll);
		if(top.choice_gtype == "ft"){
			_self.filterScroll("filter");
		}else if(top.choice_gtype == "es" && !top.isLeagued && top.specialClick==""){
			var filterTag = (top.choice_showtype=="mygame")?"MYES_tab":"ES_tab";
			_self.filterScroll(filterTag);
		}else if(top.specialGame.gtype=="ES" && top.specialClick!=""){
			_self.filterScroll("SPES_tab");
		}
		// var filterDragObj = {"tagName":"filter_out","total":dom.getElementById("filter_total"),"scroll":dom.getElementById("filter_scroll")};
		// util.dragScroll(dom,"filter_scroll",_self.setTabEvent,_self.removeTabEvent,filterDragObj);
		util.dragScroll(dom,"sport_scroll",_self.initGtypeBtn,_self.removeGtypeClick,{"tagName":"gtype"});
	}

	_self.addScrollEvent=function(e,param){
		var scroll = param.scroll.scrollLeft;
		top.tab_left_distance = scroll;
		var devicePixelRatio = window.devicePixelRatio || 1;
		var pixecl = (devicePixelRatio==2)?1:0;
		var menuW = param.scroll.scrollWidth - param.scroll.clientWidth - pixecl;
		
		if(top.choice_gtype == "es" && top.choice_showtype=="mygame"){
			mygameFilterScroll = Math.ceil(scroll)+pixecl;
		}
		if (scroll > 0) {
			util.addClass(param.left,"on");
		}  
		if (scroll == 0) {
			util.removeClass(param.left,"on");
		}
		if (scroll < menuW) {
			util.addClass(param.right,"on");
		}
		if (Math.ceil(scroll) >= menuW) {
			util.removeClass(param.right,"on");
		}
		if(param.total) util.initCheckScroll(param.total, param.scroll, param.left, param.right);
	}

	
	_self.getGtypeDistance=function(_scroll){
		var div = dom.getElementById("symbol_"+top.choice_gtype);
		var ret = false;
		if(div==null){
			is_first_choise = false;
			return ret;
		}
		var half_ball_div_width = dom.getElementById("symbol_"+top.choice_gtype).clientWidth/2;
		top.left_distance= div.offsetLeft;
		if(is_first_choise){
			ret = _self.move_menu(_scroll.clientWidth,half_ball_div_width,_scroll);
		}
		is_first_choise = false;
		return ret;
	}

	_self.move_menu=function(scroll,half_ball_div_width,scrollObj){
		var scroll_width = scroll;
		var dif = scroll_width - (top.left_distance + half_ball_div_width);
		var ret = false;
        if( dif < 0){
            if(dif < 0)dif = -dif;
			scrollObj.scrollLeft += dif + (scroll_width / 2);
			ret = true;
		}
        else if(dif > 0 && top.left_distance + half_ball_div_width> scroll_width/2 && top.left_distance + half_ball_div_width <scroll_width){
			scrollObj.scrollLeft += top.left_distance + half_ball_div_width - (scroll_width / 2);
			ret = true;
		}
		return ret;
    }
	_self.checkSport = function(countHash , backPageCheckCount ,filterHash=Array()){
		var obj = win._history[win._history.length - 1];
		var countSize = util.countSize(countHash);
		var tmpGtype = top.choice_gtype.toUpperCase();
		if(top.choice_showtype == "today" && !top.isLeagued && nowFilter == ""){
			nowFilter = headerFrame.getNowFilter();
		}
		// echo("從header取到的nowFilter = ",nowFilter);
		lastRtype = top.choice_rtype;
		if (top.clickBackPage=="click"&& countSize != 0){
			if (!countHash[top.choice_gtype]){
				top.checkBackPage="checking";
				_self.backPageCheck();
				if (win._history.length == 1){
					return false;
				}
			}else if (countHash[top.choice_gtype] && backPageCheckCount > 1){ 
				top.clickBackPage="";
				backPageCheckCount = 0;
				top.choice_date = "all";
				_self.setBackPageGame(obj);
				return false;
			}else{ 				
				top.clickBackPage="";
				top.checkBackPage="nocheck";
				return true;
			}
		}else{
			top.clickBackPage="";
			top.checkBackPage="nocheck";
			if(!countHash[top.choice_gtype]){
				// if(filterHash[tmpGtype] && util.countSize(filterHash[tmpGtype]) > 0){
                //     for(var tab in filterHash[tmpGtype]){
                //         top.choice_gtype = tmpGtype.toLowerCase();
                //         if(tab != "count" && nowFilter == ""){
				// 			echo("塞入所選頁籤:",tab);
				// 			top.choice_filter = tab;

				// 			var par = {"rtype":lastRtype,"filterPage":util.switchFilterType(tab)};
				// 			_self.tabLight(par);
				// 			var type_count = filterHash[tmpGtype][tab]*1;
				// 			_self.setData(top.choice_gtype,type_count);
				// 			echo("[sport_menu][",tmpGtype,"]有過濾頁籤的盤面,[type_count] = ",type_count,",[choice_filter] = ",top.choice_filter,",[球類] = ",top.choice_gtype);
				// 			break;
				// 		}
                //     }
                // }else{
					if(filterHash[tmpGtype] && filterHash[tmpGtype]["count"]*1 > 0){
						if(nowFilter == "" || top.choice_filter == ""){
							if(top.choice_gtype != "ft" && top.choice_gtype != "es"){
								if(top.choice_showtype == "today")top.choice_filter = "MIX";
								else{
									top.choice_filter = (top.choice_showtype == "early")?"FU":"FT";
								}
							}else{
								top.choice_filter = (top.choice_showtype == "early")?"FU":"FT";
							}
						}
						if(filterHash[tmpGtype][top.choice_filter])type_count = filterHash[tmpGtype][top.choice_filter]*1;
						nowFilter = top.choice_filter;
						// echo("[sport_menu][球類改變][nowFilter] = ",nowFilter,",[type_count] = ",type_count);
					}else{
						for(var i=0; i<gtype_ary.length; i++){
							var _gtype = gtype_ary[i].toLowerCase();
							if(countHash[_gtype]){
								top.choice_gtype=_gtype;
								if(top.specialClick=="")top.showGtype[top.choice_showtype]=_gtype;
								top.choice_date = "all";
								echo("[sport_menu][checkSport]change gtype===>"+top.choice_gtype);
								_self.chgGtype(null,{"gtype":_gtype});
								return false;
							}
						}
						if(top.choice_showtype=="soon")parentClass.dispatchEvent("showLeagueNoData");
					}
				// }
			}else{
				if(filterHash[tmpGtype]){
					var showtype_str = "";
					var fs_str = "";
					if(nowFilter == "FANTASY")showtype_str = (top.choice_showtype == "today")?"FT_":"FU_";
					else if(nowFilter == "FS")fs_str = (top.choice_showtype == "today")?"_FT":"_FU";

					if(top.choice_showtype == "today" && postHash["action"] && postHash["action"] != "" && top.choice_filter != ""){
						// echo("從今日選擇聯盟點進去 動作 = ",postHash["action"],",top.choice_filter = ",top.choice_filter);
						var par = {"rtype":lastRtype,"filterPage":util.switchFilterType(top.choice_filter)};
						_self.tabLight(par);
					}else{
						if(postHash["rtype"] == "fs"){
							top.choice_filter = "FS";
							nowFilter = "FS";
							_self.tabLight({"rtype":"fs","filterPage":"fs"});
						}else{
							if(postHash["isLeagued"] != "Y"){
								if(nowFilter == "" || top.choice_filter == ""){
									if(top.choice_gtype != "ft" && top.choice_gtype != "es"){
										if(top.choice_showtype == "today")top.choice_filter = "MIX";
										else{
											top.choice_filter = (top.choice_showtype == "early")?"FU":"FT";
										}
									}else{
										top.choice_filter = (top.choice_showtype == "early")?"FU":"FT";
									}
								}
								nowFilter = top.choice_filter;
								
								if(filterHash[tmpGtype][top.choice_filter])type_count = filterHash[tmpGtype][top.choice_filter]*1;
								var tmpTab = nowFilter;
								if((top.choice_showtype == "parlay" && nowFilter == "FT") || (top.choice_showtype == "early" && nowFilter == "FU")){
									tmpTab = top.choice_showtype+"_game";
								}else if(top.choice_showtype == "today" && top.mobile == "Y" && !isIOS && top.choice_gtype == "ft"){
									tmpTab = "FT";
								}
								var par = {"rtype":lastRtype,"filterPage":util.switchFilterType(tmpTab)};
								_self.tabLight(par);
								// echo("[sport_menu][球類沒變][nowFilter] = ",nowFilter,",[type_count] = ",type_count);
							}
						}				
					}
                }
			}
			return true;
		}
	}

	_self.setBackPageGame=function(obj){
		getGtypePosition = dom.getElementById("symbol_" + top.choice_gtype).offsetLeft;
		  top.left_distance = getGtypePosition;
		  _self.chgSportCss(top.choice_gtype);
		  top.hasChgGtype = true ;
		  var param = new Object();
		  if(obj.state.extendsClass!= undefined) param["extendsClass"] = "game_list";
		  param["page"] = obj.state.page;
		  param["showtype"] = top.choice_showtype;
		  param["type"] = top.choice_showtype;
		  param["back"] = "Y";
		  param["post"] = obj.state.post;
		  param["postHash"] = obj.state.postHash;
		  parentClass.dispatchEvent("bodyGoToPage", param);
	}

	_self.backPageCheck=function(){
		var obj = win._history[win._history.length-1];
		var hash = obj.state;
			while(win._history.length>1){
				obj = win._history[win._history.length-1];
				hash = obj.state;
				var isGame = _self.isGame(obj.page);
				if(!isGame){
					break;
				}else if(top.specialClick=="special"||hash.specialClick=="special"){
					var spTitle= document.getElementById("special_page");
					if(top.specialGame["Total_Count"]==0 ||spTitle.style.display=="none"){
						win._history.pop();
					}else{
						break;
					}
				}else if(top.outrightsClick=="outrights"||hash.showtype=="outrights"){
					if(hash.postHash.gtype==top.choice_gtype && hash.postHash.showtype==top.choice_showtype){
						win._history.pop();
					}else{
						break;
					}
				}else{ 
					if(hash.postHash.gtype==top.choice_gtype && hash.postHash.showtype==top.choice_showtype){
						win._history.pop();
					}else{
						break;
					}
				}
		}
			obj = win._history[win._history.length-1];
			hash = obj.state;
			var isGame = _self.isGame(obj.page);
			if(obj.page=="home"){
				if(obj.page == "home")backcount = 0;
				top.checkBackPage="nocheck"
				top.clickBackPage="";
				top.specialClick = "";
                hash.page = obj.page;
                hash.back = "Y";
				parentClass.dispatchEvent("bodyGoToPage",hash);
				return;
			}else{
				if(!isGame){
					top.checkBackPage="nocheck"
					top.clickBackPage="";
					top.backPageTrans = "Y";
					top.choice_showtype="";
					hash.page = obj.page;
                    hash.back = "Y";
					parentClass.dispatchEvent("bodyGoToPage",hash);
					return;
				}else{
					try{
						if(hash.showtype){
							if(hash.isMyGame=="Y")top.choice_showtype = "mygame";
							else top.choice_showtype = hash.showtype;
						}
						if(hash.postHash.rtype)top.choice_rtype = hash.postHash.rtype;
						if(hash.postHash.gtype)top.choice_gtype = hash.postHash.gtype;
						if(hash.postHash)hash.postHash.back = "Y";

						if(hash.postHash.specialClick == "special")top.specialClick = hash.postHash.specialClick;
						else top.specialClick = "";

						if(hash.outrightsClick == "outrights"||hash.postHash.outrightsClick == "outrights"){
							top.outrightsClick = "outrights";
							top.choice_showtype = "early";
						}else{
							top.outrightsClick = "";
						}

						if(hash.postHash.kind && hash.postHash.kind == "fantasy")top.specialGame.isFantasy = true;
						else top.specialGame.isFantasy = false;
					}catch(e){echo("sport遊戲檢查錯誤",e)};
						hash.page = obj.page;
						hash.back = "Y";

					if(top.choice_showtype=="mygame"){
						_self.getMyGameData();
					}else if(top.specialClick!="special"){
						_self.getData();
					}else if(top.specialClick=="special"){
						top.checkBackPage="nocheck"
						top.clickBackPage="";
						backPageCheckCount = 0;
						top.choice_date = "all";
						_self.setBackPageGame(obj);
					}
				}
			}
	}

	_self.isGame=function(page){
		if(page.indexOf("game_list")!=-1 || page.indexOf("game_more")!=-1 || page.indexOf("league_index")!=-1 )return true;
		else return false;
	}

	_self.setData=function(_name, count){
		// if(top.choice_filter == "FANTASY" && _name != "ft")return;
		if(dom.getElementById("symbol_"+_name)){
			dom.getElementById("symbol_"+_name).style.display = (count*1<=0 || isNaN(count)) ? "none" : "";
			util.addEvent(dom.getElementById("symbol_"+_name), "click", _self.chgGtype, {"gtype":_name});
		}
	}

	_self.goToGameList = function(par){
		var rtype = par.rtype;
		var isFantasy = par.isFantasy;
		var ts = par.ts;
		var isLeagued = par.isLeaguePage;
        var param = new Object();
        var choiceGtype = top.choice_gtype.toUpperCase();
		var postHash = new Object();
        postHash["gtype"] = top.choice_gtype;
        postHash["showtype"] = top.choice_showtype;
		postHash["rtype"] = rtype;
        //postHash["lid"] = top.specialGame.FantasyLID;
		postHash["isFantasy"] = isFantasy;
        postHash["ts"] = ts;
		postHash["isLeagued"] = isLeagued;
		top.lastClickTS = ts;

        param["page"] = "game_list_"+choiceGtype;
        param["extendsClass"] = "game_list";
        param["post"] = "gtype="+top.choice_gtype+"&showtype="+top.choice_showtype+"&rtype="+ rtype + "&ts="+ts;
        param["postHash"] = postHash;
		parentClass.dispatchEvent("bodyGoToPage", param);
	}

	_self.chgGtype=function(e,par){
		if(!top.isLeagued && top.choice_showtype.match(/today|early|parlay/))_self.checkFilter(par.gtype);
		nowTS = util.getTimestamp();
        top["lastClickTS"] = nowTS;
		getGtypePosition = dom.getElementById("symbol_"+par.gtype).offsetLeft;
		top.left_distance = getGtypePosition;
		_self.chgSportCss(par.gtype);
		if(top.choice_gtype!=par.gtype){
			top.choice_date = "all";
			echo("[sport_menu][chgGtype]"+top.choice_gtype+"!="+par.gtype+"======>"+top.choice_date);
		}
		if(top.choice_showtype == "today"){
			if(par.gtype!="ft" && par.gtype!="es")top.choice_filter = "MIX";
			else top.choice_filter = "FT";
			headerFrame.updateNowFilter(top.choice_filter);
		}else top.choice_filter = "";
		top.specialGame.isFantasy = false;
		top.hasChgGtype = (par.gtype!=top.choice_gtype)?true:false;
		top.choice_gtype = par.gtype;
		if(top.outrightsClick=="outrights"){
			top.showGtype["fs"] = par.gtype;
		}else {
			if(top.specialClick=="")top.showGtype[top.choice_showtype]=par.gtype;
		}
		top.choice_rtype = (top.choice_showtype=="live" || (top.choice_gtype=="ft"&&top.choice_showtype=="parlay") )?"rb":"r";
		if(top.outrightsClick=="outrights")top.choice_rtype = "fs";
		var param = new Object();
		if(page_sw){
			param["page"] = "league_index";
		}else{
			if(top.mobile == "Y" && !isIOS && par.gtype == "ft")notNeedLegAry = new Array("live","mygame","hot","soon");
            else notNeedLegAry = new Array("live","today","mygame","hot","soon");
			var notLeaguePage = notNeedLegAry.indexOf(top.choice_showtype) != -1;
			param["page"] = (notLeaguePage)?"game_list_"+par.gtype.toUpperCase():"league_index";
			if(notLeaguePage) param["extendsClass"] = "game_list";
		}
		
		param["showtype"] = top.choice_showtype;
		param["type"] = top.choice_showtype;
		var postHash = new Object();
        postHash["gtype"] = top.choice_gtype;
        postHash["showtype"] = top.choice_showtype;
		postHash["rtype"] = top.choice_rtype;
		postHash["outrightsClick"] = top.outrightsClick;
		postHash["nowTS"] = nowTS;
        param["post"] = "gtype="+top.choice_gtype+"&showtype="+top.choice_showtype+"&rtype="+top.choice_rtype;
		param["nowTS"] = nowTS;
		param["postHash"] = postHash;
		parentClass.dispatchEvent("bodyGoToPage",param);
	}

	_self.checkFilter = function(gtype){
		if(filterHash[gtype.toUpperCase()] && !filterHash[gtype.toUpperCase()][top.choice_filter]){
			// echo(gtype,"這個球類沒有",top.choice_filter,"過濾頁籤!!");
			for(var filterType in filterHash[gtype.toUpperCase()]){
				if(filterType != "count" && filterHash[gtype.toUpperCase()][filterType] * 1 > 0){
					// echo("更換choice_filter = ",filterType);
					top.choice_filter = filterType;
					break;
				}
			}
		}else{
			// echo("過濾頁籤容器=",filterHash[gtype.toUpperCase()]);
			// echo("這個球類有過濾頁籤，繼續沿用過濾頁籤:",top.choice_filter);
			return true;
		}
	}

	_self.chgGameList = function(){
		var param = new Object();
		var _gtype = top.choice_gtype.toUpperCase();
		param["page"] = "game_list_"+_gtype;
		param["showtype"] = top.choice_showtype;
		param["type"] = top.choice_showtype;
		var postHash = new Object();
        postHash["gtype"] = top.choice_gtype;
        postHash["showtype"] = top.choice_showtype;
		postHash["rtype"] = top.choice_rtype;
        param["post"] = "gtype="+top.choice_gtype+"&showtype="+top.choice_showtype+"&rtype="+top.choice_rtype;
        param["postHash"] = postHash;
		param["extendsClass"] = "game_list";
		parentClass.dispatchEvent("bodyGoToPage",param);
	}

	_self.chgSportCss = function(gtype){
		if(top.specialGame.mode=="CUP" && top.specialClick=="special"){
			dom.getElementById("head_league").className = "head_league cup";
		}else{
			for(var i=0; i<gtype_ary.length; i++){
				dom.getElementById("symbol_"+gtype_ary[i].toLowerCase()).classList.remove("on");
			}
			var obj = dom.getElementById("symbol_"+gtype);
			if(obj) obj.classList.add("on");
			dom.getElementById("head_league").className = "head_league "+gtype;
		}
    }
	
	_self.orientationchange = function(){
		var orientation = win.Math.abs(win.orientation);
		if(orientation==90||orientation==0){
			_self.getData();
		}
	};

	_self.exitEvent=function(){
		win.removeEventListener("orientationchange", _self.orientationchange);
		return true;
	}
	
    _self.sportScroll = function(e){
		var _sport = dom.getElementById("sport_total");
		var _scroll = dom.getElementById("sport_scroll");
		var _left = dom.getElementById("sport_left");
		var _right = dom.getElementById("sport_right");
		
		if(_sport && _scroll){
			if(_sport.clientWidth > _scroll.clientWidth){
			util.addClass(_right,"on");
			util.addEvent(_right,"click",util.move,{"click":_right ,"div":_scroll, "direction":"right", "opposite":_left});
		}else{
			util.removeClass(_right,"on");
			util.removeEvent(_right, "click");
		}
			util.addEvent(_scroll,"scroll",_self.addScrollEvent,{"total":_sport ,"scroll":_scroll , "left":_left , "right":_right});
		}
		
	}
	
	_self.resizeFilterScroll = function(e){
		_self.filterScroll(filterTagName);
	}

	_self.filterScroll = function(filterTag){
		var filter_total = dom.getElementById(filterTag+"_total");
		var filter_scroll = dom.getElementById(filterTag+"_scroll");
		var filter_left = dom.getElementById(filterTag+"_left");
		var filter_right = dom.getElementById(filterTag+"_right");
		if(filter_total && filter_scroll){
			// echo("filterScroll [filter_total] = ",filter_total.clientWidth,",[filter_scroll] = ",filter_scroll.clientWidth,",[scrollLeft] = ",filter_scroll.scrollLeft);
			var noRight = false;
			if(top.choice_showtype=="mygame" && top.choice_gtype=="es"){
				if((mygameFilterScroll+filter_scroll.clientWidth) >= filter_total.clientWidth){
					noRight = true;
				}
				_self.setDragScroll(filterTag);
			}
			if(filter_total.clientWidth > (filter_scroll.clientWidth + Math.ceil(filter_scroll.scrollLeft)) && !noRight){
				util.addClass(filter_right,"on");
				util.addEvent(filter_right,"click",util.move,{"click":filter_right ,"div":filter_scroll, "direction":"right", "opposite":filter_left});
			}else{
				util.removeClass(filter_right,"on");
				util.removeEvent(filter_right, "click");
			}
			util.addEvent(filter_scroll,"scroll",_self.addScrollEvent,{"total":filter_total ,"scroll":filter_scroll , "left":filter_left , "right":filter_right});
		}
	}

	_self.initGtypeBtn = function(){
		for(var i=0; i<gtype_ary.length; i++){
			var _gtype = gtype_ary[i].toLowerCase();
			if(dom.getElementById("symbol_"+_gtype))util.addEvent(dom.getElementById("symbol_"+_gtype), "click", _self.chgGtype, {"gtype":_gtype});
		}
	}

	_self.removeGtypeClick = function(){
		for(var i=0; i<gtype_ary.length; i++){
			var _gtype = gtype_ary[i].toLowerCase();
			if(dom.getElementById("symbol_"+_gtype))util.removeEvent(dom.getElementById("symbol_"+_gtype), "click");
		}
	}

	_self.addTabClick = function(){
		isDraging = false;
	}

	_self.goToLegPage = function(e,par){
		var tmp_choice_filter = (top.choice_showtype == "early")?"FU":"FT";
		switch(top.choice_showtype){
			case "parlay":
				top.choice_rtype = (top.choice_gtype == "ft")?"rb":"r";
				break;
			case "live":
				top.choice_rtype = "rb";
				break;
			default:
				top.choice_rtype = "r";
				break;
		}
		headerFrame.updateNowFilter(tmp_choice_filter);
		if(par && par.rtype == "fs"){
			top.choice_rtype = "fs";
		}
		if(top.choice_showtype != "today")top.choice_filter = "";
		top.specialGame.isFantasy = false;
		parentClass.dispatchEvent("showLeagueFilter");
	}
	
	_self.removeTabClick = function(){
		isDraging = true;
	}	

	_self.setDragScroll = function(filterTag){
		var _total = dom.getElementById(filterTag+"_total");
		var _scroll = dom.getElementById(filterTag+"_scroll");
        var filterDragObj = {"tagName":filterTag+"_out","total":_total,"scroll":_scroll};
        util.dragScroll(dom,filterTag+"_scroll",_self.setTabEvent,_self.removeTabEvent,filterDragObj);
    }

	_self.selectFilterTagName = function(){
		var _filterTagName="";
		if(top.choice_gtype=="ft"){
			_filterTagName = "filter";
		}else if(top.choice_gtype=="es" && !top.isLeagued && top.specialClick==""){
			_filterTagName = (top.choice_showtype=="mygame")?"MYES_tab":"ES_tab";
		}else if(top.specialGame.gtype=="ES" && top.specialClick!=""){
			_filterTagName = "SPES_tab";
		}
		return _filterTagName;
	}

}
