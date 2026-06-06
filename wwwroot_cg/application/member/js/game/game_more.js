function game_more(_win, _dom, _post){
	var classname = "game_more";
    var _self = this;
    var win = _win;
    var dom = _dom;
	var postHash = _post;
	var parentClass;
	var childClass;
	var eventHandler = new Object();
	var util = new win.Util(win,dom);
	var util_game = new win.Util_game(win,dom);
	var tv = new win.TV(win,dom);
	var mt = new win.MT(win,dom);
	var ratioChg = new win.ratioChgRule(win, dom);
    var config_set;
	var LS;
	var LS_game;
	var LS_code;
	var openHash = new Object();
	var defOpen = 20;
	var timerHash;
	var wtypeHash;
	var rtypeHash;
	var _xmlnode;
	var first_load = true;
	var gtype = null;
	var ecid = null;
	var peid = null;
	var nowGameNum = null;
	var nowBest = "N/A";
	var noMotherGame = false;
	var scoreType = null;
	var showtype = null;
	var isRB = null;
	var def_league = null;
	var def_team_h = null;
	var def_team_c = null;
	var def_ptype = null;
	var def_datetime = null;
	var back = null;
	var change_ary = util_game.getChangeAry();
	var pgBtns = new Array("pgf","pgl");
	var getDataComplete = null;
	var getXmlNode = null;
	var eventHandler = new Object();
	var config_ior = null;
	var isRBorRP = (postHash["showtype"]=="live" || (postHash["showtype"]=="parlay" && postHash["isRB"]=="Y"));
	var max_FS = 0;
	var H_LIST;
	var C_LIST;
	var title_sfs_team = "";
	var sfs_show_max = 5;
	var over640 = null;
	var width1024 = null;
	var scDataObj;
	var showMoreAry = new Object;
	showMoreAry["PD"] = false;
	showMoreAry["HPD"] = false;
	showMoreAry["RPD"] = false;
	showMoreAry["HRPD"] = false;
	showMoreAry["ET_RPD"] = false;
	showMoreAry["ET_HRPD"] = false;
	showMoreAry["SFS"] = false;
	var BS_disAry = new Array();
	var gid_rtype_ior = new Object();
	var chgColorIor = new Object();
	var MT_data = new Object();
	var pgAry = new Object;
	var stayinside = false; 
	pgAry["pgf"] = true;
	pgAry["pgl"] = false;
	var score_h = "";
	var score_c = "";
	var re_time = "";
	var isFantasy = "N";
	var fantasyObj = new Object;
	var clickHeadfilter = "";
	var lastClickTS = "";
	var pageFilterHash;
	var headerHash;

	var hasRightPanel = false;
	var hasForecast = false;
	var needShowTV = false;
	var firstInMore = true;

	var mother_gid = "";

	_self.parentClass = null;
	_self.util = util;
	_self.util_game = util_game;
	_self.tv = tv;
	_self.mt = mt;
	_self.paramHash = new Object();
	var myhash={};
	var pdSortHash = new Array();
	var pdHeadHash = new Array();
   	var pdIorHead = new Array();
	var pdDataHash = new Object();
	pdDataHash["clickHash"] = new Object();
	pdDataHash["ET_clickHash"] = new Object();
	pdDataHash["Court"] = "FT";
	pdDataHash["pdMode"] = "all";
	pdDataHash["ET_Court"] = "FT";
	pdDataHash["ET_pdMode"] = "all";
	var havePDAry = new Array("Main","Goals","Halves","All");
	var isChgPDMode = false;
	var hasClick = false;
	var CookieManager = new win.CookieManager();
	var clusterize_sw = false;
	var clusterize = null;
	var rowAry = new Array();
	var hObjClickHash = new Array();
	var iorClickHash = new Array();
	var lastJsonData = "";
	var lastJsonObj = new Object();
	var lastParseParam = new Array();
	var lastScoreObj = new Object();
	var nowAnalysisStatus = "";
	var ios = util.isIOS();
	var outerGameNum;

	var videoObj = null;
	
    _self.init = function(){}

    _self.reInit=function(_childClass, _classname, _wtypeHash, _rtypeHash, _getDataComplete, _getXmlNode){
		myhash["util"] = util;
		top.bet_className = classname;
		wtypeHash = _wtypeHash;
		rtypeHash = _rtypeHash;
		getDataComplete = _getDataComplete || _self.getDataComplete;
		getXmlNode = _getXmlNode || _self.getXmlNode;
		config_ior = config_set.get("CONFIG_IORATIO");
		util.addClass(dom.getElementById("body_content"), "bg_game_inner");
		util_game.init();
		_self.setPostParam();
		_self.addEvent();
		lastClickTS = util.getTimestamp();
		top["lastClickTS"] = lastClickTS;
		if(top.rightECID!=""){
			top.rightNowPlay = (top.choice_gtype == "es")?"ES":"TV";
			parentClass.dispatchEvent("resetRightTV", {});
		}
		if(top.choice_gtype.match(/ft|es/) || (top.choice_gtype=="bk" && showtype!="live")){
			setTimeout(function(){
				_self.pageFilter();
				if(top.choice_gtype=="es"){
					var gameLimit = _self.getGameLimit(nowBest);
					_self.hideFilter(gameLimit);
				}
			}, 500);
			win.addEventListener("resize", _self.filterScroll);
			win.addEventListener("resize", _self.chkScrollTop);
		}
		if(getView().viewportwidth >= 1024){
			firstInMore = false;
			var rightParam = new Object();
			rightParam["scFun"] = _self.getData;
			if(showtype == "live" && top.choice_gtype == "es"){
				if(nowGameNum != "N/A"){
					rightParam["analysisHash"] = {"gtype":top.choice_gtype,"peid":peid,"showtype":showtype,"scoreType":scoreType};
				}else {
					top.rightNowPlay = "";
				}
			}
			
			parentClass.dispatchEvent("loadRightScore", rightParam);
			dom.getElementById("right_show").scrollTop = 0;
		}else{
			_self.getData(true);
		}

		clusterize_sw = (gtype == "es" && false);
		

		_self.createTimer();
		
		win.addEventListener("resize", _self.windowResize);
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
		
		
		_self.initTV();
	
	}

	
	_self.getParentThis = function (varible) {
		return parentClass.getThis(varible);
	}
	
	_self.getThis=function(varible){
        if(!myhash[varible]) {
            var msg = "no myhash["+varible+"]";
            util.writeLog(classname, msg);
        }
        return myhash[varible];
	}

	_self.dispatchEvent = function (eventname, param) {
		if (eventHandler[eventname]) eventHandler[eventname](param);
	}
	
	_self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
	}

    _self.setParentclass = function(_parentclass){
		parentClass = _parentclass;
		_self.parentClass = parentClass;
		config_set = parentClass.getThis("config_set");
		timerHash = parentClass.getThis("timerHash");
		LS = parentClass.getThis("LS");
		LS_game = parentClass.getThis("LS_game");
		LS_code = parentClass.getThis("LS_code");
		myhash["LS"] = LS;
		myhash["LS_code"] = LS_code;
		myhash["config_set"] = config_set;
		myhash["timerHash"] = timerHash;
	}

	_self.exitEvent = function () {
		win.removeEventListener("resize", _self.windowResize);
		win.removeEventListener("resize", _self.filterScroll);
		win.removeEventListener("resize", _self.chkScrollTop);
		if(isRBorRP && getView().viewportwidth < 1024){
			var ret = tv.clearTV();
			if(ret){
				ret = mt.clearMT();
				if(ret) return true;
			}
		}else{
			return true;
		}
    }

	_self.initTV = function(){
		tv.init();
		tv.setParentclass(_self);

		mt.setGameID("");
		mt.setParentclass(_self);
	}

	_self.setPostParam = function(){
		gtype = postHash["gtype"];
		ecid = postHash["ecid"];
		peid = postHash["peid"];
		scoreType = postHash["scoreType"];
		lid = postHash["lid"];
		showtype = postHash["showtype"];
		isRB = postHash["isRB"];
		def_league = postHash["league"];
		def_team_h = postHash["team_h"];
		def_team_c = postHash["team_c"];
		def_score_h = postHash["score_h"];
		def_score_c = postHash["score_c"];
		def_retime = postHash["retime"];
		def_datetime = postHash["datetime"];
		def_ptype = postHash["ptype"];
		back = postHash["back"];
		nowGameNum = postHash["nowGameNum"];
		outerGameNum = postHash["nowGameNum"];
		nowBest = (postHash["nowBest"]!= "")?postHash["nowBest"]:"N/A";
		
		top.rightECID = (gtype=="ft")? postHash["ecid"]:postHash["gidm"];
		if(gtype == "es"){
			if(nowGameNum == "N/A")top.rightECID = "";
			else top.rightECID = peid;
		}
		top.rightGtype = top.choice_gtype;
		top.rightShowType = showtype;
		top.rightRB = postHash["isRB"];
	}

	_self.addEvent = function(){
		util.addEvent(get("btn_back"), "click", _self.backClick);
		util.addEvent(get("forecast_btn"), "click", _self.showForecast, {"gid":postHash["gid"],"league":def_league,"team_h":def_team_h,"team_c":def_team_c,"showtype":showtype,"ptype":def_ptype});
		_self.addEventListener("openTV", _self.openTV);
		_self.addEventListener("closeTV", _self.closeTV);
		_self.addEventListener("addbodylock", _self.addbodylock);
		_self.addEventListener("removebodylock", _self.removebodylock);
		_self.addEventListener("internetError", _self.internetError);
		_self.addEventListener("videoOnClick", _self.videoOnClick);
		_self.addEventListener("setNowBodyLockStatus", _self.setNowBodyLockStatus);
	}

	_self.internetError = function(param){
		parentClass.dispatchEvent("internetError", param);
	}

	_self.backClick = function(e){
		if(top.choice_gtype == "es")top.rightNowPlay = "";
		parentClass.dispatchEvent("backPage", {});
		parentClass.dispatchEvent("closeAnalysis",false);
	}

	_self.createTimer = function(){
		var _name = "moreTimer";
		var type = (showtype=="live")?"RB":"FT";
		if(timerHash[_name]!=null) return;
		timerHash[_name] = new Timer(config_set.get("CONFIG_GAME_MORE_"+type));
		timerHash[_name].setParentclass(_self);
		timerHash[_name].init();
		timerHash[_name].addEventListener("TimerEvent.TIMER", _self.timerRun);
		timerHash[_name].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish);
		timerHash[_name].startTimer();
	}

	_self.clearTimer=function(){
		if(timerHash!=null){
			var _name = "moreTimer";
			if(timerHash[_name]!=null){
				timerHash[_name].clearObj();
				timerHash[_name].is_clear = true;
				timerHash[_name]=null;
			}
		}
		return true;
	}

	_self.timerRun=function(count){
		echo("==========內層盤面Timer啟動中===========");
		_self.getData(false,true);
	}

	_self.timerFinish=function(count){

	}   

	_self.pageFilter=function(){
		_self.initFilterBtn();
		var _filter = dom.getElementById("filter_total");
		var _scroll = dom.getElementById("filter_scroll");
		var _left = dom.getElementById("filter_left");
		var _right = dom.getElementById("filter_right");
		if(_filter.clientWidth > _scroll.clientWidth){
			util.addClass(_right,"on");
			util.addEvent(_right,"click",util.move,{"click":_right ,"div":_scroll, "direction":"right", "opposite":_left});
		}
		var filterDragObj = {"tagName":"filter_inner","total":_filter,"scroll":_scroll};
		util.addEvent(_scroll,"scroll",_self.addScrollEvent,{"total":_filter ,"scroll":_scroll , "left":_left , "right":_right});				
		util.dragScroll(dom,"filter_scroll",_self.initFilterBtn,_self.removeFilterClick,filterDragObj);
	}

	_self.initFilterBtn = function(){
		for(var i=0; i< headerHash.length; i++){
			var filterObj = dom.getElementById(headerHash[i]+"_filter");
			util.addEvent(filterObj, "click", _self.clickPageFilter, {"pagefilter":headerHash[i]});
		}
	}

	_self.removeFilterClick = function(){
		for(var i=0; i< headerHash.length; i++){
			var filterObj = dom.getElementById(headerHash[i]+"_filter");
			util.removeEvent(filterObj, "click");
		}
	}

	_self.clickPageFilter=function(e,param){
		_self.showFilterLoading(true);
		get("div_nodata").style.display = "none";
		for(var i=0; i< headerHash.length; i++){
			var filterObj = dom.getElementById(headerHash[i]+"_filter");
			util.removeClass(filterObj,"on");
			if(param.pagefilter==headerHash[i]){
				util.addClass(filterObj,"on");
				clickHeadfilter = param.pagefilter;
				if(param.pagefilter=="Halves"){
					pdDataHash["Court"] = "HT";
					pdDataHash["ET_Court"] = "HT";
				}else {
					pdDataHash["Court"] = "FT";
					pdDataHash["ET_Court"] = "FT";
				}
				pdDataHash["pdMode"] = "all";
				pdDataHash["ET_pdMode"] = "all";
			}
		}
		if(clusterize_sw && clusterize){
			get("div_show").innerHTML = "";
			_self.clusterizeDestroy();
		} 
		lastClickTS = util.getTimestamp();
        top["lastClickTS"] = lastClickTS;
		openHash = new Object();
		gid_rtype_ior = new Object();
		chgColorIor = new Object();
		_self.getData(false);
	}

	_self.pageFilterHeader=function(_headerHash,_pageFilterHash){
		pageFilterHash = _pageFilterHash;
		headerHash = _headerHash;
	}

	_self.getData=function(OuterOpen,isTimer){
		if((!_xmlnode && (lastJsonData == "" || isTimer)) || _xmlnode){
			var isback = _self.chkIsBack();
			var ts = (lastClickTS && !isback)?lastClickTS:top["lastClickTS"];
			var filter = (clickHeadfilter)?clickHeadfilter:"Main";
			var par = top.param;
			par += "&p=get_game_more";
			par += "&gtype="+gtype;
			par += "&showtype="+showtype;
			par += "&ltype=" + top["userData"].ltype;
			par += "&isRB="+isRB;
			par += "&lid="+lid;
			par += "&specialClick="+top.specialClick;
			par += "&mode="+top.specialGame.mode;
			par += "&from=game_more";
			if(filter)par += "&filter="+filter;
			par += "&ts="+ts;
			if(gtype == "ft")par += "&ecid="+ecid;
			else if(gtype == "es"){
				par += "&outerGameNum="+outerGameNum;
				par += "&peid="+peid;
				par += "&type=getMore";
			}else {//其他球類
				par += "&gid="+ecid;
				par += "&type=getMore";
			}
			var getHTML = new HttpRequest();
			getHTML.addEventListener("onError", _self.getDataError);
			getHTML.addEventListener("LoadComplete", function(xml){
				getDataComplete(xml,OuterOpen);
			});
			getHTML.loadURL(top.m2_url, "POST", par);
		}else{
			getDataComplete(lastJsonData,OuterOpen,clickHeadfilter);
		}
		
	}

	_self.chkIsBack = function(){
		var obj = win._history[win._history.length-1];
		if(!obj.state.back)return false;
		else return true;
	}

	_self.getDataError=function(){

	}

	_self.getDataComplete = function(xml, OuterOpen){
		_self.paramHash["errorMsg"] = util.showConnectMsg(xml);
		if(util.alertConnectMsg(_self.paramHash["errorMsg"]))  return;

		if(util_game.chkXmlError(xml)) _self.checkHasGame(false);

		var xmdObj = new Object();
		xmlnode = util.parseXml(xml);
		_xmlnode = xmlnode;
		var tmpTS = xmlnode.Node(xmlnode.Root[0],"ts").innerHTML;
		if(lastClickTS != 0 && !util_game.checkTS(top["lastClickTS"], tmpTS, "get_game_more")) {
			console.log("[game_more][tmpTS]===>",tmpTS,"[top.lastClickTS]=====>",top["lastClickTS"],"ts錯誤!!!!!!不繼續執行");
			return;
		}

		var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
		var ecid = xmlnode.Node(xmlnode.Root[0],"ecid").innerHTML;
		var nowMode = xmlnode.Node(xmlnode.Root[0],"nowMode").innerHTML;
		var hasEC = xmlnode.Node(xmlnode.Root[0],"hasEC").innerHTML;
		var xml_ecid = xmlnode.Node(xmlnode.Root[0],"ecid").innerHTML;
		var FTscoreH = xmlnode.Node(xmlnode.Root[0],"FTscoreH").innerHTML;
		var FTscoreC = xmlnode.Node(xmlnode.Root[0],"FTscoreC").innerHTML;
		var ETscoreH = xmlnode.Node(xmlnode.Root[0],"ETscoreH").innerHTML;
		var ETscoreC = xmlnode.Node(xmlnode.Root[0],"ETscoreC").innerHTML;
		var allGameDisRB = xmlnode.Node(xmlnode.Root[0],"all_close").innerHTML;
		var game = xmlnode.Node(xmlnode.Root[0],"game", false);
		if(code == "Its not special"){
			_self.checkHasGame(false);
			if(top.rightECID != "")parentClass.dispatchEvent("noGameCheckLive", {"eventid_ph":"", "center_tv":""});
		}
		else if(code=="617"){ 
			var mainGame = null;
			var hasGame = false;
			var isFilterPtype = false;
			var _id,gdata,mode,master;
			var tmp_gid = (game[0])?xmlnode.Node(game[0],"gid").innerHTML:"";
			isFantasy = (game[0])?xmlnode.Node(game[0],"isFantasy").innerHTML:"N";
			var filter = xmlnode.Node(xmlnode.Root[0],"filter").innerHTML;
			clickHeadfilter = filter;

			var hasKeyFT = (FTscoreH && FTscoreC && FTscoreH!="" && FTscoreC!="");
			var hasKeyET = (ETscoreH && ETscoreC && ETscoreH!="" && ETscoreC!="");

			if(top.forecast_sw){
				if(hasKeyFT && hasKeyET){ //全場跟加時key完賽果
					if(dom.getElementById("forecast_btn"))dom.getElementById("forecast_btn").style.display = "none";
				}else{
					if(dom.getElementById("forecast_btn"))dom.getElementById("forecast_btn").style.display = "";
				}
			}else{
				if(dom.getElementById("forecast_btn"))dom.getElementById("forecast_btn").style.display = "none";
			} 

			if(isFantasy=="Y"){
				var gidfl = xmlnode.Node(game[0],"gidfl").innerHTML;
				var teamH_id = xmlnode.Node(game[0],"team_id_h").innerHTML;
				var teamC_id = xmlnode.Node(game[0],"team_id_c").innerHTML;
				_self.goToGetFantasyInfo(gidfl,tmp_gid,teamH_id,teamC_id);
				dom.getElementById("more_icon_info").style.display = "";
			}else {
				if(dom.getElementById("more_icon_info"))dom.getElementById("more_icon_info").style.display = "none";
			}
			if(game.length > 0){
				var gidHash = new Object();				
				for(var i=0; i<game.length; i++){
					gdata = game[i];
					_id = gdata.getAttribute("id");
					mode = gdata.getAttribute("mode");
					master = gdata.getAttribute("master");
					
					var gameOpen = xmlnode.Node(gdata, "gopen").innerHTML;

					if(hasEC== "Y" && mode != "") isFilterPtype = true; 

					if(hasEC!="Y" || (mode=="" && nowMode=="")){ 
						mode = "FT";
					}

					if(mode){
						if(hasEC=="Y" && nowMode==mode && master=="Y"){
							mainGame = game[i];
						}
						if(master=="Y" && nowMode==mode)mother_gid = _id.substr(3);
						
						if(gidHash[mode]==null){
							gidHash[mode] = new Array();
						}
						gidHash[mode].push(_id);
					}

				}

				if(mainGame==null)mainGame = game[0];
				top.resize_mainGame = mainGame;
				top.rightFrom = "game_more";

				var intoRB = _self.checkIntoRB(xmlnode, mainGame);
				if(intoRB) return;

				var game_mode = (hasEC=="Y")?nowMode:mode;
				var gopen = xmlnode.Node(game[0], "gopen").innerHTML;
                var Live = xmlnode.Node(game[0],"Live").innerHTML;
				scDataObj = _self.setScoreBoard(game_mode, mainGame, showtype, gopen, Live, OuterOpen, allGameDisRB,FTscoreH,FTscoreC);
				top.scDataObj = scDataObj;
				_self.parseScoreBoard(scDataObj);
				if(getView().viewportwidth >= 1024 && !top.fullscreen){
					parentClass.dispatchEvent("setRightLoading", {"isShow":true});
					parentClass.dispatchEvent("parseRightScoreBoard", scDataObj);
					parentClass.dispatchEvent("checkRightLive", {"xmlnode":xmlnode, "mainGame":mainGame, "from":"game_more"});
					get("watch_live").style.display = "none";
				}else{
					if(showtype=="live" || (showtype=="parlay" && isRB=="Y")){
						_self.checkLive(xmlnode, mainGame, tv, mt);
					}else{
						_self.checkLive(xmlnode, mainGame, tv, mt, "game_list");
					}
				}
				parentClass.dispatchEvent("setRightLoading", {"isShow":false});
				var SFSObj = _self.setGameSFS(mainGame);
				hasGame = _self.parseData({"id":ecid,"nowMode":nowMode,"gidHash":gidHash, "game":game, "SFSObj":SFSObj, "hasEC":hasEC, "isFilterPtype":isFilterPtype});
				_self.setScrollToTop();
				
			}else{
				var defObj = new Object();
                defObj.def_league = def_league;
                defObj.def_team_h = def_team_h;
                defObj.def_team_c = def_team_c;
				defObj.def_datetime = def_datetime;
				defObj.def_showtype = showtype;
				defObj.def_isRB = isRB;
                _self.parseNoGameScoreBoard(defObj);

				top.resize_mainGame = null; 
				top.scDataObj = null;
				

				var eventid_ph = xmlnode.Node(xmlnode.Root[0],"eventid_phone").innerHTML;
				var center_tv = xmlnode.Node(xmlnode.Root[0],"center_tv").innerHTML;
				var eventid_mt = xmlnode.Node(xmlnode.Root[0],"mt_id").innerHTML;
				var mtgtype = xmlnode.Node(xmlnode.Root[0],"mt_gtype").innerHTML;
				var mtspid = xmlnode.Node(xmlnode.Root[0],"mt_sid").innerHTML;
				var lineups = xmlnode.Node(xmlnode.Root[0],"mt_lineups").innerHTML;

				MT_data["gtype"] = mtgtype;
				MT_data["spid"] = mtspid;
				if(getView().viewportwidth >= 1024){
					parentClass.dispatchEvent("parseNoGameRightScoreBoard", defObj);
					parentClass.dispatchEvent("noGameCheckLive", {"eventid_ph":eventid_ph, "center_tv":center_tv,"eventid_mt":eventid_mt,"MT_data":MT_data,"lineups":lineups,"from":"game_more"});
				}else{
					_self.checkLiveProc(eventid_ph, center_tv, eventid_mt, MT_data, lineups, tv, mt);
				}

				dom.getElementById("forecast_btn").style.display = "none";
			}

			_self.checkHasGame(hasGame);
		
		}else if(back == "Y"){
			get("league").innerHTML = util_game.showTxt(def_league);		
			get("team_h").innerHTML = util_game.showTxt(def_team_h);
			get("team_c").innerHTML = util_game.showTxt(def_team_c);
			get("midfield").style.display ="none";
			if(showtype == "live" || (isRB == "Y" && top.choice_gtype == "ft")){
				get("pk_score").style.display="none";
				get("score_board").style.display = "";
				if(def_score_h&&def_score_c){
					get("score_h").innerHTML = util_game.showTxt(def_score_h);
					get("score_c").innerHTML = util_game.showTxt(def_score_c);
				}else{
					get("score_h").innerHTML = 0;
					get("score_c").innerHTML = 0;
				}
				get("re_time").innerHTML = util_game.showTxt(def_retime);
			}else{
				get("game_time").innerHTML = util_game.showTxt(def_datetime);
			}
		}
		if(top.choice_gtype=="ft")_self.showFilterLoading(false);
		parentClass.dispatchEvent("showLoading", { "isShow": false ,"from":classname});
	}

	_self.parseNoGameScoreBoard = function(obj){
		score_h = "";
		score_c = "";
		re_time = "";
		if(get("league"))get("league").innerHTML = util_game.showTxt(obj.def_league);		
		get("team_h").innerHTML = util_game.showTxt(obj.def_team_h);
		get("team_c").innerHTML = util_game.showTxt(obj.def_team_c);

		get("midfield").style.display ="none";
		if(obj.def_showtype == "live" || (obj.def_isRB == "Y" && top.choice_gtype == "ft")){
			if(get("pk_score"))get("pk_score").style.display="none";
			if(get("score_board"))get("score_board").style.display = "";
			if(get("score_h"))get("score_h").innerHTML = util_game.showTxt(score_h);
			if(get("score_c"))get("score_c").innerHTML = util_game.showTxt(score_c);
			if(get("re_time"))get("re_time").innerHTML = (re_time)?util_game.transRETIME(re_time,false,LS_game,nowMode):0;
		}else{
			
			if(get("game_time"))get("game_time").innerHTML = util_game.showTxt(obj.def_datetime);
		}
    }

	_self.checkIntoRB = function(xmlnode, mainGame){
		if(isRB=="Y")return false;
		var xml_isRB = util.getKeyValue(xmlnode,mainGame,"is_rb");
		var liveStr = (top.choice_gtype=="ft")? "Live" : "IS_LIVE";
		var live = util.getKeyValue(xmlnode,mainGame, liveStr);
		if(!top.go_to_rb){
			if(top.choice_showtype=="today"){
				if(top.specialClick != ""){
					if(showtype != "live" && xml_isRB=="Y" && live=="Y"){
						showtype = "live";
						_self.goToRB();
						if(!top.go_to_rb) top.go_to_rb=true;
						return true;
					}
				}else{
					if(xml_isRB=="Y" && live=="Y" && top.choice_filter!="RB"){
						echo("[game_more][checkIntoRB][today]isRB="+isRB+",live="+live+" ======> change to RB");
						_self.goToRB();
						if(!top.go_to_rb) top.go_to_rb=true;
						return true;
					}
				}
			}else if(top.choice_showtype=="parlay"){
				if(xml_isRB!=null){
					if(isRB!=xml_isRB && live=="Y" && top.choice_gtype=="ft"){
						echo("[game_more][checkIntoRB][parlay]isRB="+isRB+",xml_isRB="+xml_isRB+" ======> change to RB");
						_self.goToRB();
						if(!top.go_to_rb) top.go_to_rb=true;
						return true;
					}
				}
	
			}else if(top.choice_showtype=="mygame" || top.choice_showtype=="hot"){
				if(showtype == "today"){
					if(xml_isRB=="Y" && live=="Y"){
						echo("[game_more][checkIntoRB][today]isRB="+isRB+",live="+live+" ======> change to RB");
						showtype = "live";
						_self.goToRB();
						if(!top.go_to_rb) top.go_to_rb=true;
						return true;
					}
				}
			}else if(top.choice_showtype=="soon"){
				if(xml_isRB=="Y" && live=="Y"){
					echo("[game_more][checkIntoRB][today]isRB="+isRB+",live="+live+" ======> change to RB");
					showtype = "live";
					_self.goToRB();
					if(!top.go_to_rb) top.go_to_rb=true;
					return true;
				}
			}
		}

		top.go_to_rb = false;
		
		return false;
	}

	_self.goToRB = function(){
		var is_RB = "Y";
		var _postHash = new Object();
		var tmpShowType = "";
		var isSpecialGame = (top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs")?"Y":"N";
		if(top.choice_showtype == "mygame" || isSpecialGame == "Y")tmpShowType = showtype;
		else tmpShowType = "live";
		_postHash["gtype"] = top.choice_gtype;
		_postHash["showtype"] = tmpShowType;
		_postHash["isRB"] = is_RB;
		_postHash["ecid"] = ecid;
		_postHash["lid"] = postHash["lid"];
		_postHash["gid"] = postHash["gid"];
		_postHash["peid"] = postHash["peid"];
		_postHash["ptype"] = postHash["ptype"];
		_postHash["league"] = def_league;
		_postHash["team_h"] = def_team_h;
		_postHash["team_c"] = def_team_c;

		if(top.specialClick == "special")_postHash["specialClick"] = "special";

		var par = new Object();
		par["page"] = "game_more_"+top.choice_gtype.toUpperCase();
		par["post"] = "showtype="+tmpShowType+"&isRB="+is_RB;
		par["postHash"] = _postHash;
		par["isRB"] = is_RB;
		par["goToRB"] = "Y";
		par["history_pop"] = 1;
		par["extendsClass"] = "game_more";
		par["specialClick"] = top.specialClick;
		echo("[game_more][goToRB]", par);

		parentClass.dispatchEvent("bodyGoToPage", par);
	}

	_self.checkHasGame = function(hasGame){
		if(hasGame){
			get("div_show").style.display = "";
			get("div_nodata").style.display = "none";
		}else{
			if(top.resizePage == "game_more"){
				get("div_show").style.display = "none";
				get("div_nodata").style.display = "";
			}
			
		}
	}

	_self.parseData = function(param){
		var ecid = param.id;
		var nowMode = param.nowMode;
		var gidHash = param.gidHash;
		var game = param.game;
		var SFSObj = param.SFSObj;
		var hasEC = param.hasEC;
		var isFilterPtype = param.isFilterPtype;
		var hasGame = false;
		var dataObj = new Object();
		var MoreDEFINED_ROWHEIGHT = config_set.get("MoreDEFINED_ROWHEIGHT");
		if(top.choice_gtype=="bk" && showtype!="live"){
			clickHeadfilter = param.filter;
		}
		var _BLOCK_LIMIT_HEIGHT = 0;
		var blockHeight = new Array();
    	var blockNum = new Array();
		var tmpHeight = 0;
		var totalRowHeight = 0;
		var blockCount = 0;
		var viewport_height = getView().viewportheight;
		
		if(viewport_height <= 600){
			_BLOCK_LIMIT_HEIGHT = config_set.get("CLUSTERIZE_LIMIT_S"); 
		}else if(viewport_height > 600 && viewport_height <= 900){
			_BLOCK_LIMIT_HEIGHT = config_set.get("CLUSTERIZE_LIMIT_M"); 
		}else if(viewport_height > 900){
			_BLOCK_LIMIT_HEIGHT = config_set.get("CLUSTERIZE_LIMIT_L"); 
		}

		if(gidHash){
			nowMode = "FT";
			var wHash = wtypeHash[nowMode];
			var tmpScreen = dom.createElement("div");
			var cntWtype = 0;
			var chgheadisopen = false;
			var isBK_WM = false;
			var clickHash = new Object();
			var ior_ary = new Array();
			var hasPD = false;
			// echo("[wHash] = ",wHash);
			for(var a=0; a<wHash.length; a++){
				if(tmpHeight >= _BLOCK_LIMIT_HEIGHT && a!=0){
					blockHeight.push(tmpHeight);
					blockNum.push(blockCount);
					tmpHeight = 0;
					blockCount = 0;
					
				}
				if((top.choice_gtype=="ft" || (top.choice_gtype=="bk" && showtype!="live")) && clickHeadfilter!="All"){
					if(!pageFilterHash[clickHeadfilter].includes(wHash[a])) {
						continue;
					}
				}
				var tmp = wHash[a].split("_");
				var _mode = tmp[0];
				var wtype = tmp[1];
				var ET_str = (_mode=="ET" && util_game.checkWtypeIsPD(wtype) && top.choice_gtype == "ft")?"ET_":"";
				var lowWtype = wtype.toLowerCase();
				if(!gidHash[_mode]) continue;

				try{
					var parseHead = false;
					var head_id = "";
					var body_id = "";

					var wtypeForSW = util_game.changeWtypeForPD(top.choice_gtype,wtype,true);
					var isComplex = util_game.checkWtypeIsComplex(wtype);
					var all_close = true;
					var isMutiType = false; 
					var bs_ms = 0;
					var bm_ior_c = 0;
					var bm_ior_h = 0;
					for(var i=0; i<gidHash[_mode].length; i++){
						var _gid = gidHash[_mode][i];
						var gObj = game[_gid];

						if(gObj!=null){
							var gopen = xmlnode.Node(gObj,"gopen").innerHTML;
							var receive = xmlnode.Node(gObj,"recv").innerHTML;
							var h_receive = xmlnode.Node(gObj,"hrecv").innerHTML;
							var is_rb = xmlnode.Node(gObj,"is_rb").innerHTML;
							var hgopen = xmlnode.Node(gObj,"hgopen").innerHTML;
							var FT_h = xmlnode.Node(gObj,"score_h").innerHTML;
							var FT_c = xmlnode.Node(gObj,"score_c").innerHTML;
							var gid = xmlnode.Node(gObj,"gid").innerHTML;
							var sw_wtype = "";
							var new_wtype_sw = xmlnode.Node(gObj,"wtype");
							var PTW_BM = xmlnode.Node(gObj,"PTW", false);
							var WXP_BM = xmlnode.Node(gObj,"WXP", false);
							var RGA_TN = xmlnode.Node(gObj,"RGA", false);
							var RGOU_TN = xmlnode.Node(gObj,"RGOU", false);
							var RF_TN = xmlnode.Node(gObj,"RF", false);
							var PD_FT = xmlnode.Node(gObj,"PD", false);
							var RPD_FT = xmlnode.Node(gObj,"RPD", false);
							if(PTW_BM.length > 0 && wtype.indexOf("PTW")!=-1){
								for(var p=0; p<PTW_BM.length; p++){
									var ptw_wtype = PTW_BM[p].getAttribute("wtype");
									if(wtype==ptw_wtype){
										sw_wtype = xmlnode.Node(PTW_BM[p],"sw").innerHTML;
										bm_ior_h = xmlnode.Node(PTW_BM[p],"ior_h").innerHTML;
										bm_ior_c = xmlnode.Node(PTW_BM[p],"ior_c").innerHTML;
									}
								}
								if(sw_wtype=="")continue;
							}else if(WXP_BM.length > 0 && wtype.indexOf("WXP")!=-1){
								for(var w=0; w<WXP_BM.length; w++){
									var wxp_wtype = WXP_BM[w].getAttribute("wtype");
									if(wtype==wxp_wtype){
										sw_wtype = xmlnode.Node(WXP_BM[w],"sw").innerHTML;
										bm_ior_h = xmlnode.Node(WXP_BM[w],"ior_h").innerHTML;
										bm_ior_c = xmlnode.Node(WXP_BM[w],"ior_c").innerHTML;
									}
								}
								if(sw_wtype=="")continue;
							}else if(RGA_TN.length > 0 && wtype.indexOf("RGA")!=-1){
								for(var w=0; w<RGA_TN.length; w++){
									var wxp_wtype = RGA_TN[w].getAttribute("wtype");
									if(wtype==wxp_wtype){
										sw_wtype = xmlnode.Node(RGA_TN[w],"sw").innerHTML;
										ior_ary[_gid+"_"+wxp_wtype+"Y"] = xmlnode.Node(RGA_TN[w],"ior_Y").innerHTML;
										ior_ary[_gid+"_"+wxp_wtype+"N"] = xmlnode.Node(RGA_TN[w],"ior_N").innerHTML;
									}
								}
								if(sw_wtype=="")continue;
							}else if(RGOU_TN.length > 0 && wtype.indexOf("RGOU")!=-1){
								for(var w=0; w<RGOU_TN.length; w++){
									var wxp_wtype = RGOU_TN[w].getAttribute("wtype");
									if(wtype==wxp_wtype){
										sw_wtype = xmlnode.Node(RGOU_TN[w],"sw").innerHTML;
										ior_ary[_gid+"_"+wxp_wtype+"O"] = xmlnode.Node(RGOU_TN[w],"ior_O").innerHTML;
										ior_ary[_gid+"_"+wxp_wtype+"U"] = xmlnode.Node(RGOU_TN[w],"ior_U").innerHTML;
									}
								}
								if(sw_wtype=="")continue;
							}else if(RF_TN.length > 0 && wtype.indexOf("RF")!=-1){
								for(var w=0; w<RF_TN.length; w++){
									var wxp_wtype = RF_TN[w].getAttribute("wtype");
									if(wtype==wxp_wtype){
										sw_wtype = xmlnode.Node(RF_TN[w],"sw").innerHTML;
										ior_ary[_gid+"_"+wxp_wtype+"H"] = xmlnode.Node(RF_TN[w],"ior_h").innerHTML;
										ior_ary[_gid+"_"+wxp_wtype+"C"] = xmlnode.Node(RF_TN[w],"ior_c").innerHTML;
									}
								}
								if(sw_wtype=="")continue;
							}else if(PD_FT.length > 0 && util_game.checkWtypeIsPD(wtype)){
								pdDataHash[ET_str+"sw_PD"] = xmlnode.Node(PD_FT[0],"sw_PD").innerHTML;
								pdDataHash[ET_str+"sw_HPD"] = xmlnode.Node(PD_FT[0],"sw_HPD").innerHTML;
								pdDataHash[ET_str+"pd_rtypes"] = xmlnode.Node(PD_FT[0],"pd_rtypes").innerHTML;
								pdDataHash[ET_str+"hpd_rtypes"] = xmlnode.Node(PD_FT[0],"hpd_rtypes").innerHTML;
								if(pdDataHash[ET_str+"pd_rtypes"]=="" && pdDataHash[ET_str+"hpd_rtypes"]=="")continue;
								if(FT_h && FT_c){
									pdDataHash[ET_str+"scoreH"]=FT_h*1;
									pdDataHash[ET_str+"scoreC"]=FT_c*1;
								}else{
									pdDataHash[ET_str+"scoreH"]=0;
									pdDataHash[ET_str+"scoreC"]=0;
								}
								if(clickHeadfilter=="Halves" && pdDataHash[ET_str+"Court"]=="HT" && pdDataHash[ET_str+"sw_HPD"]=="N")continue;
								if(clickHeadfilter!="Halves" && pdDataHash[ET_str+"Court"]=="FT" && pdDataHash[ET_str+"sw_PD"]=="N" && pdDataHash[ET_str+"sw_HPD"]=="Y"){
									pdDataHash[ET_str+"Court"]="HT";
									continue;
								}
								pdDataHash[ET_str+"pd_strong"] = xmlnode.Node(PD_FT[0],"pd_strong").innerHTML;
								pdDataHash[ET_str+"hpd_strong"] = xmlnode.Node(PD_FT[0],"hpd_strong").innerHTML;
								pdDataHash[ET_str+"ft_allzero"] = true;
								var haveFTData = _self.setpdDataHash("ec"+ecid,pdDataHash[ET_str+"pd_rtypes"],"N",is_rb,"",ET_str);
								if(haveFTData){
									var FTcount = pdIorHead["ec"+ecid].length;
									for(var j=0;j<FTcount;j++){
										var ior = xmlnode.Node(PD_FT[0],"ior_"+pdIorHead["ec"+ecid][j]).innerHTML;
										pdDataHash[ET_str+"IOR_"+pdIorHead["ec"+ecid][j]] = ior;
										if((ior*1)>0)pdDataHash[ET_str+"ft_allzero"]=false;
									}								
								}
								pdDataHash[ET_str+"ht_allzero"] = true;
								var haveHTData = _self.setpdDataHash("ec"+ecid,pdDataHash[ET_str+"hpd_rtypes"],"Y",is_rb,"",ET_str);
								if(haveHTData){
									var HTcount = pdIorHead["ec"+ecid+"_H"].length;
									for(var j=0;j<HTcount;j++){
										var ior = xmlnode.Node(PD_FT[0],"ior_"+pdIorHead["ec"+ecid+"_H"][j]).innerHTML;
										pdDataHash[ET_str+"IOR_"+pdIorHead["ec"+ecid+"_H"][j]] = ior;
										if((ior*1)>0)pdDataHash[ET_str+"ht_allzero"]=false;
									}
								}
								if(clickHeadfilter=="Halves" && pdDataHash[ET_str+"Court"]=="HT" && pdDataHash[ET_str+"ht_allzero"])continue;
								if((hgopen=="N" || pdDataHash[ET_str+"sw_HPD"]=="N" || pdDataHash[ET_str+"ht_allzero"])&& wtype!="PD" && pdDataHash[ET_str+"Court"]=="HT"){
									wtype = wtype.substr(1);
									lowWtype = lowWtype.substr(1);
									parseHead=true;
									head_id = wtype+"_"+_mode+"_"+ecid;
									pdDataHash[ET_str+"Court"] = "FT";
								}
								if((!pdDataHash[ET_str+"ht_allzero"] && pdDataHash[ET_str+"sw_HPD"]=="Y") || (!pdDataHash[ET_str+"ft_allzero"] && pdDataHash[ET_str+"sw_PD"]=="Y"))hasPD = true;
								sw_wtype = pdDataHash[ET_str+"sw_"+wtype];
								if(pdDataHash[ET_str+"pdMode"]=="choice"){
									var halfStr =  (pdDataHash[ET_str+"Court"] == "HT")?"_H":"";
									var choiceObj = pdSortHash["ec"+ecid+halfStr];
									if(choiceObj && choiceObj["choice"] && util.in_array(choiceObj["choice"],choiceObj["All"])){
										pdDataHash[ET_str+"score"]=choiceObj["choice"];
									}else pdDataHash[ET_str+"score"] = pdDataHash[ET_str+"scoreH"]+"-"+pdDataHash[ET_str+"scoreC"];
								}else pdDataHash[ET_str+"score"]=pdDataHash[ET_str+"scoreH"]+"-"+pdDataHash[ET_str+"scoreC"];
								pdDataHash[ET_str+"is_rb"]=is_rb;
								pdDataHash[ET_str+"mode"]=_mode;
								pdDataHash[ET_str+"hgopen"]=hgopen;
							}else if(RPD_FT.length > 0 && util_game.checkWtypeIsPD(wtype)){
								if(showtype=="live")is_rb="Y";
								pdDataHash[ET_str+"sw_RPD"] = xmlnode.Node(RPD_FT[0],"sw_RPD").innerHTML;
								pdDataHash[ET_str+"sw_HRPD"] = xmlnode.Node(RPD_FT[0],"sw_HRPD").innerHTML;
								pdDataHash[ET_str+"pd_rtypes"] = xmlnode.Node(RPD_FT[0],"pd_rtypes").innerHTML;
								pdDataHash[ET_str+"hpd_rtypes"] = xmlnode.Node(RPD_FT[0],"hpd_rtypes").innerHTML;
								if(pdDataHash[ET_str+"pd_rtypes"]=="" && pdDataHash[ET_str+"hpd_rtypes"]=="")continue;
								if(FT_h && FT_c){
									pdDataHash[ET_str+"scoreH"]=FT_h*1;
									pdDataHash[ET_str+"scoreC"]=FT_c*1;
								}else{
									pdDataHash[ET_str+"scoreH"]=0;
									pdDataHash[ET_str+"scoreC"]=0;
								}
								if(clickHeadfilter=="Halves" && pdDataHash[ET_str+"Court"]=="HT" && pdDataHash[ET_str+"sw_HRPD"]=="N")continue;
								if(clickHeadfilter!="Halves" && pdDataHash[ET_str+"Court"]=="FT" && pdDataHash[ET_str+"sw_RPD"]=="N" && pdDataHash[ET_str+"sw_HRPD"]=="Y"){
									pdDataHash[ET_str+"Court"]="HT";
									continue;
								}
								pdDataHash[ET_str+"pd_strong"] = xmlnode.Node(RPD_FT[0],"pd_strong").innerHTML;
								pdDataHash[ET_str+"hpd_strong"] = xmlnode.Node(RPD_FT[0],"hpd_strong").innerHTML;
								pdDataHash[ET_str+"ft_allzero"] = true;
								var haveFTData = _self.setpdDataHash("ec"+ecid,pdDataHash[ET_str+"pd_rtypes"],"N",is_rb,"",ET_str);
								if(haveFTData){
									var FTcount = pdIorHead[ET_str+"ec"+ecid].length;
									for(var j=0;j<FTcount;j++){
										var ior = xmlnode.Node(RPD_FT[0],"ior_"+pdIorHead[ET_str+"ec"+ecid][j]).innerHTML;
										pdDataHash[ET_str+"IOR_"+pdIorHead[ET_str+"ec"+ecid][j]] = ior;
										if((ior*1)>0)pdDataHash[ET_str+"ft_allzero"]=false;
									}								
								}
								pdDataHash[ET_str+"ht_allzero"] = true;
								var haveHTData = _self.setpdDataHash("ec"+ecid,pdDataHash[ET_str+"hpd_rtypes"],"Y",is_rb,"",ET_str);
								if(haveHTData){
									var HTcount = pdIorHead[ET_str+"ec"+ecid+"_H"].length;
									for(var j=0;j<HTcount;j++){
										var ior = xmlnode.Node(RPD_FT[0],"ior_"+pdIorHead[ET_str+"ec"+ecid+"_H"][j]).innerHTML;
										pdDataHash[ET_str+"IOR_"+pdIorHead[ET_str+"ec"+ecid+"_H"][j]] = ior;
										if((ior*1)>0)pdDataHash[ET_str+"ht_allzero"]=false;
									}
								}
								if(clickHeadfilter=="Halves" && pdDataHash[ET_str+"Court"]=="HT" && pdDataHash[ET_str+"ht_allzero"])continue;
								if((hgopen=="N" || pdDataHash[ET_str+"sw_HRPD"]=="N" || pdDataHash[ET_str+"ht_allzero"])&& wtype!="RPD" && pdDataHash[ET_str+"Court"]=="HT"){
									wtype = wtype.substr(1);
									lowWtype = lowWtype.substr(1);
									parseHead=true;
									head_id = wtype+"_"+_mode+"_"+ecid;
									pdDataHash[ET_str+"Court"] = "FT";
								}
								if((!pdDataHash[ET_str+"ht_allzero"] && pdDataHash[ET_str+"sw_HRPD"]=="Y") || (!pdDataHash[ET_str+"ft_allzero"] && pdDataHash[ET_str+"sw_RPD"]=="Y"))hasPD = true;
								sw_wtype = pdDataHash[ET_str+"sw_"+wtype];
								if(pdDataHash[ET_str+"pdMode"]=="choice"){
									var halfStr =  (pdDataHash[ET_str+"Court"] == "HT")?"_H":"";
									var choiceObj = pdSortHash[ET_str+"ec"+ecid+halfStr];
									if(choiceObj && choiceObj["choice"] && util.in_array(choiceObj["choice"],choiceObj["All"])){
										pdDataHash[ET_str+"score"]=choiceObj["choice"];
									}else pdDataHash[ET_str+"score"] = pdDataHash[ET_str+"scoreH"]+"-"+pdDataHash[ET_str+"scoreC"];
								}else pdDataHash[ET_str+"score"]=pdDataHash[ET_str+"scoreH"]+"-"+pdDataHash[ET_str+"scoreC"];
								pdDataHash[ET_str+"is_rb"]=is_rb;
								pdDataHash[ET_str+"mode"]=_mode;
								pdDataHash[ET_str+"hgopen"]=hgopen;
							}else{
								if(new_wtype_sw.id && top.choice_gtype=="bk" && util_game.checkWtypeIsWM(new_wtype_sw.id)){
									var rtype_ior = xmlnode.Node(new_wtype_sw,"rtype",false);
									for(var w=0;w<rtype_ior.length;w++){
										if(ior_ary[_gid+"_"+rtype_ior[w].getAttribute("id")]==null){
											sw_wtype = "Y";
											ior_ary[_gid+"_"+rtype_ior[w].getAttribute("id")] = new_wtype_sw.childNodes[w].innerHTML;
										}
									}
								}else{
									sw_wtype = xmlnode.Node(gObj,"sw_"+wtypeForSW).innerHTML;
								}
							}

							var SFSGAME = xmlnode.Node(gObj,"SFSGAME").innerHTML;
							if(gopen!="Y") continue;
							if(showtype == "parlay"){	
								var sw_P3 = (is_rb=="Y")?xmlnode.Node(gObj,"sw_RP3").innerHTML:xmlnode.Node(gObj,"sw_P3").innerHTML;
								if(sw_P3 != "Y") continue;
							}
							if(wtype != "SFS" && !isComplex && (sw_wtype=="N" || sw_wtype==null)) continue;
							if(wtype == "SFS" && SFSGAME == undefined) continue;
							var isHalf = util_game.checkWtypeIsHalf_util(wtype);
							var ptype = xmlnode.Node(gObj,"ptype").innerHTML;
							var ptype_map = xmlnode.Node(gObj,"ptype_map").innerHTML;
							var important = xmlnode.Node(gObj,"important").innerHTML;
							var team_h = xmlnode.Node(gObj,"team_h").innerHTML;
							var team_c = xmlnode.Node(gObj,"team_c").innerHTML;
							var hgid = xmlnode.Node(gObj,"hgid").innerHTML;
							var gidm = xmlnode.Node(gObj,"gidm").innerHTML;
							var session = xmlnode.Node(gObj, "session").innerHTML;
							var tmp_gid = isHalf ? hgid : gid;
							var str_gid = isHalf ? "HGID" : "GID";
							var half = isHalf ? "Y" : "N";

							team_h = (isFilterPtype)?_self.transTeam(team_h,ptype,important):team_h;
							team_c = (isFilterPtype)?_self.transTeam(team_c,ptype,important):team_c;
							var tmp_ptype = _self.transPtype(ptype,hasEC,isFilterPtype);
							var tmp = xmlnode.Node(gObj, "ms").innerHTML;
							var ms = tmp.split("_")[1];
							
							if(top.choice_gtype == "bs" && wtype.match(/^R?MX$/g) && important != "Y") continue;
							if(top.choice_gtype == "bs" && important == "Y"){
								if(wtype.match(/^R?MX$/g)){
									session = ptype.substr(2).replace(/[\])}[{(]/g,"");
									lowWtype = (showtype == "live")?"rm":"m";
									parseHead = false;
									isMutiType = true;
									bs_ms++;
								}else{
									continue;
								}
							}

							if(ms!="" && top.choice_gtype != "ft"){ 
								team_h = team_h.replace(" - ("+session+")","");
								team_c = team_c.replace(" - ("+session+")","");
							}

							if(util_game.checkWtypeIsRF_TN(wtype)){
								lowWtype = "rf";
								session = LS_game.get("TN_"+wtype+"_header");
							}
							if(util_game.checkWtypeIsRGA_TN(wtype)){
								lowWtype = "rga";
								session = LS_game.get("TN_"+wtype+"_header");
							}
							if(util_game.checkWtypeIsRGOU_TN(wtype)){
								lowWtype = "rgou";
								session = LS_game.get("TN_"+wtype+"_header");
							}

							if(util_game.checkWtypeIsPTW_BM(wtype)){
								lowWtype = "ptw";
								session = LS_game.get("BM_"+wtype.replace("R","")+"_header");
							}
							if(util_game.checkWtypeIsWXP_BM(wtype)){
								lowWtype = "wxp";
								session = LS_game.get("BM_"+wtype.replace("R","")+"_header");
							}

							if(top.choice_gtype == "vb"){
								session = LS_game.get("VB_game_"+ms+"_set");
							}
							if(top.choice_gtype == "bk" && util_game.checkWtypeIsWM(wtype)){							
								var choice_model = "a";
								if(ms && ms != ""){
								 if(Number( ms ) < 3)choice_model = "b";
								 else choice_model = "c";
					 	 		}
								lowWtype += choice_model;
							  }
							if(top.choice_gtype == "ft" && (lowWtype == "hpd"||lowWtype == "hrpd") && clickHeadfilter!="Halves" && (pdDataHash[ET_str+"sw_RPD"]=="Y" || pdDataHash[ET_str+"sw_PD"]=="Y")){
								var hObj = "";
								parseHead=true;
								head_id = wtype.replace("H","")+"_"+_mode+"_"+ecid;
								if(openHash[head_id]==null){
									openHash[head_id] = (cntWtype>defOpen) ? false : true;
								}
								if(!pdDataHash[ET_str+"ht_allzero"])chgheadisopen = true;
							}
							if(!parseHead){
								var hObj = "";
								if(top.choice_gtype == "ft" && (clickHeadfilter=="Halves" || pdDataHash[ET_str+"sw_RPD"]=="N" || pdDataHash[ET_str+"sw_PD"]=="N") && util_game.checkWtypeIsPD(wtype)){
									hObj = get(ET_str+"header_"+lowWtype.replace("h","")).cloneNode(true);
									head_id = wtype.replace("H","")+"_"+_mode+"_"+ecid;
								}else {
									head_id = (isMutiType)? wtype+"_"+_mode+"_"+ecid+"_"+bs_ms:wtype+"_"+_mode+"_"+ecid;
									hObj = get(ET_str+"header_"+lowWtype).cloneNode(true);
								}
								var div_header = hObj.innerHTML;
								hObj.setAttribute("id", "head_"+head_id);
								if(isComplex)hObj.setAttribute("style", "display:none;");
								util.addEvent(hObj, "click", _self.clickHeader, {"id":head_id,"ecid":ecid,"mode":_mode,"wtype":wtype,"hasEC":hasEC});

								div_header = _self.parseMSHeader(div_header,wtype,ms,session);
								div_header = div_header.replace(new RegExp("\\\*MS\\\*","gi"), util_game.showTxt(ms));
								div_header = div_header.replace(new RegExp("\\\*SESSION\\\*","gi"), util_game.showTxt(session));
								div_header = div_header.replace(new RegExp("\\\*PTYPE\\\*","gi"), util_game.showTxt(tmp_ptype));
								div_header = div_header.replace(new RegExp("\\\*TEAM_H\\\*","gi"), util_game.showTxt(team_h));
								div_header = div_header.replace(new RegExp("\\\*TEAM_C\\\*","gi"), util_game.showTxt(team_c));

								if(hasEC == "Y" && _mode.match(/^(PKOU|PKR|RN)$/g)){
									div_header = div_header.replace(new RegExp("\\\*MSGSHOW\\\*","gi"), "");
								}else{
									div_header = div_header.replace(new RegExp("\\\*MSGSHOW\\\*","gi"), "none");
								}

								if(hasEC == "Y" && _mode.match(/^(ETRN|ETCN|RN|CN)$/g)){
									div_header = div_header.replace(new RegExp("\\\*SCORESHOW\\\*","gi"), "");
								}else{
									div_header = div_header.replace(new RegExp("\\\*SCORESHOW\\\*","gi"), "none");
								}

								if(util_game.checkWtypeIsF(wtype) || util_game.checkWtypeIsRF(wtype)) div_header = div_header.replace(new RegExp("\\\*INNING\\\*","gi"), LS_game.get("SK_"+wtype));

								if(top.choice_gtype == "ft"){
									var scoreObj = get("score_"+lowWtype);
									if(scoreObj!=null&&gObj!=null){
										if(lowWtype == "taru" || lowWtype == "tbru" || lowWtype == "tdru" || lowWtype == "teru")
										{
											var score_type = lowWtype.toUpperCase().substr(1,1);
											var _h = xmlnode.Node(gObj,"score_h_"+score_type+"_ot").innerHTML;
											var _c = xmlnode.Node(gObj,"score_c_"+score_type+"_ot").innerHTML;
										}
										else
										{
											var score_type = lowWtype.toUpperCase().substr(0,1);
											var _h = xmlnode.Node(gObj,"score_h_"+score_type).innerHTML;
											var _c = xmlnode.Node(gObj,"score_c_"+score_type).innerHTML;										
										}
										scoreObj = _h+" - "+_c;
										div_header = div_header.replace(new RegExp("\\\*SCORE_"+wtype+"\\\*","gi"), util_game.showTxt(scoreObj));
									}
									var scoreStr = (FT_h*1)+" - "+(FT_c*1);
									div_header = div_header.replace(new RegExp("\\\*SCORE_HC\\\*","gi"), util_game.showTxt(scoreStr));
								}

								hObj.innerHTML = div_header;
								tmpScreen.appendChild(hObj);
								if(!clusterize_sw)parseHead = true;
								cntWtype++;
								if(openHash[head_id]==null){
									openHash[head_id] = (cntWtype>defOpen) ? false : true;
								}

								if(!openHash[head_id]) hObj.classList.add("game_fold");

							}else if(parseHead && isComplex){
								cntWtype++;
							}
							if(top.choice_gtype=="ft" && util_game.checkWtypeIsPD(wtype)){//&& mother_gid==gid
								pdDataHash[ET_str+"gid"]=gid;
								pdDataHash[ET_str+"hgid"]=hgid;
								pdDataHash[ET_str+"ecid"]=ecid;
								pdDataHash[ET_str+"gidm"]=gidm;
								pdDataHash[ET_str+"team_h"]=team_h;
								pdDataHash[ET_str+"team_c"]=team_c;
								if(half=="Y"){
									pdDataHash[ET_str+"isHalf"]=half;
									_self.setpdDataHash("ec"+ecid,pdDataHash[ET_str+"hpd_rtypes"],half,is_rb,pdDataHash[ET_str+"score"],ET_str);
								}else{
									_self.setpdDataHash("ec"+ecid,pdDataHash[ET_str+"pd_rtypes"],half,is_rb,pdDataHash[ET_str+"score"],ET_str);
								}
							}
							
							var bodywtype = (top.choice_gtype=="ft" && (wtype=="HPD"||wtype=="HRPD"))?lowWtype.substr(1):lowWtype;	
							var bObj = get(ET_str+"body_"+bodywtype).cloneNode(true);
							var div_model = "";
							if(wtype == "SFS"){ 
								div_model = _self.parseSFS(SFSObj,bObj,tmp_gid,wtype,_mode,ecid,team_h,team_c,important,ptype,clickHash,gObj,gid,hasEC);
								all_close = false;
							}else{
								if(util_game.checkWtypeIsF(wtype)) div_model = get("model_f").innerHTML;
								else if(util_game.checkWtypeIsRF(wtype)) div_model = get("model_rf").innerHTML;
								else if(util_game.checkWtypeIsPD(wtype)) {
									if(wtype=="HPD" || wtype=="HRPD"){
										if(half=="N")div_model = div_model.replace(new RegExp("\\\*HALF_SW\\\*","gi"), "none");
										var div_pdMenu = (pdDataHash[ET_str+"Court"]=="HT")?get(ET_str+"model_PD_menu").innerHTML:"";
										var div_PDmodel =_self.getPDLayer(pdDataHash[ET_str+"hpd_strong"],wtype,ET_str);
										div_model = div_pdMenu+_self.getPDModel(ecid,div_PDmodel.innerHTML,half,pdDataHash[ET_str+"hpd_strong"],ET_str);
										if(pdDataHash[ET_str+"Court"]=="HT")div_model = div_model.replace(new RegExp("\\\*SHOW_HT\\\*","gi"), util_game.showTxt("on"));
										if(clickHeadfilter=="Halves" || pdDataHash[ET_str+"ft_allzero"])div_model = div_model.replace(new RegExp("\\\*FULL_SW\\\*","gi"), "none");
										if(pdDataHash[ET_str+"sw_"+wtype]!="Y"){
											div_model = div_model.replace(new RegExp("\\\*HALF_SW\\\*","gi"), "none");
										}
										if(showMoreAry[ET_str+wtype] && pdDataHash[ET_str+"pdMode"]=="all")div_model = div_model.replace(new RegExp("\\\*HSHOWMORE\\\*","gi"), util_game.showTxt("on"));
									}else {
										var div_pdMenu = (pdDataHash[ET_str+"Court"]=="FT")?get(ET_str+"model_PD_menu").innerHTML:"";
										var div_PDmodel =_self.getPDLayer(pdDataHash[ET_str+"pd_strong"],wtype,ET_str);
										div_model = div_pdMenu+_self.getPDModel(ecid,div_PDmodel.innerHTML,"N",pdDataHash[ET_str+"pd_strong"],ET_str);
										if(pdDataHash[ET_str+"Court"]=="FT")div_model = div_model.replace(new RegExp("\\\*SHOW_FT\\\*","gi"), util_game.showTxt("on"));
										if(pdDataHash[ET_str+"ht_allzero"])div_model = div_model.replace(new RegExp("\\\*HALF_SW\\\*","gi"), "none");
										if(hgopen=="N" || pdDataHash[ET_str+"sw_H"+wtype]=="N"){
											div_model = div_model.replace(new RegExp("\\\*HALF_SW\\\*","gi"), "none");
										}
										if(showMoreAry[ET_str+wtype] && pdDataHash[ET_str+"pdMode"]=="all")div_model = div_model.replace(new RegExp("\\\*SHOWMORE\\\*","gi"), util_game.showTxt("on"));
									}
								}else if(util_game.checkWtypeIsWM(wtype) && top.choice_gtype == "bk"){
									if(wtype.substr(0,1) == "R")div_model = get("model_rwm"+choice_model).innerHTML;
									else div_model = get("model_wm"+choice_model).innerHTML;
								}else div_model = get("model_"+lowWtype).innerHTML;
								if(top.choice_gtype == "ft" && util_game.checkWtypeIsPD(wtype)){
									var rb_str = (is_rb=="Y")?"R":"";
									body_id = "body_"+rb_str+"PD_"+_mode+"_"+ecid;
								}else body_id = (isMutiType)? "body_"+wtype+"_"+_mode+"_"+ecid+"_"+bs_ms:"body_"+wtype+"_"+_mode+"_"+ecid;
								bObj.setAttribute("id", body_id);
								bObj.setAttribute("name", body_id);
								if(isComplex)bObj.setAttribute("style", "display:none;");
								div_model = div_model.replace(new RegExp("\\\*GID\\\*","gi"), util_game.showTxt(tmp_gid));
								div_model = div_model.replace(new RegExp("\\\*ECID\\\*","gi"), util_game.showTxt(ecid));
								div_model = div_model.replace(new RegExp("\\\*MODE\\\*","gi"), util_game.showTxt(_mode));
								div_model = div_model.replace(new RegExp("\\\*HALF\\\*","gi"), util_game.showTxt(half));
								div_model = div_model.replace(new RegExp("\\\*WTYPE\\\*","gi"), util_game.showTxt(wtype));
								div_model = div_model.replace(new RegExp("\\\*TEAM_H\\\*","gi"), util_game.showTxt(team_h));
								div_model = div_model.replace(new RegExp("\\\*TEAM_C\\\*","gi"), util_game.showTxt(team_c));

								if(top.choice_gtype == "bk" && util_game.checkWtypeIsWM(wtype) && choice_model)var rtypes = rtypeHash[wtype+choice_model.toUpperCase()];
								else var rtypes = rtypeHash[wtype];
								var body_close = true;
								if(top.choice_gtype == "ft" && util_game.checkWtypeIsPD(wtype)){
									var halfStr =  (half == "Y")?"_H":"";
									var choiceObj = pdSortHash[ET_str+"ec"+ecid+halfStr];
									if(pdDataHash[ET_str+"pdMode"]=="choice"){
										var newHScore = pdDataHash[ET_str+"scoreH"];
										var newCScore = pdDataHash[ET_str+"scoreC"];
										if(choiceObj && choiceObj["choice"]!=""){
											var ScoreAry = choiceObj["choice"].split("-");
											newHScore=ScoreAry[0];
											newCScore=ScoreAry[1];
										}
										div_model = div_model.replace(new RegExp("\\\*SCORE_H\\\*","gi"), util_game.showTxt(newHScore));
										div_model = div_model.replace(new RegExp("\\\*SCORE_C\\\*","gi"), util_game.showTxt(newCScore));
										halfStr = (pdDataHash[ET_str+"Court"]=="HT")?"_H":"";
										var allObj = pdSortHash[ET_str+"ec"+ecid+halfStr]["All"];
										var nowScore = pdSortHash[ET_str+"ec"+ecid+halfStr]["choice"];
										var splitNowScore = nowScore.split("-");
										var HScore = splitNowScore[0];
										var CScore = splitNowScore[1];
										var forecastAddHScore = HScore*1+1;
										var forecastAddCScore = CScore*1+1;
										var forecastMinusHScore = HScore*1-1;
										var forecastMinusCScore = CScore*1-1;
										var filterTabAry = Array(forecastAddHScore+"-"+CScore , HScore+"-"+forecastAddCScore , forecastMinusHScore+"-"+CScore , HScore+"-"+forecastMinusCScore);
										var btnIDAry = Array("H_plus_"+str_gid , "C_plus_"+str_gid , "H_minus_"+str_gid , "C_minus_"+str_gid);
										var result = new Array();
										
										for(var t = 0;t < filterTabAry.length;t++){
											tmpScore = filterTabAry[t];
											result = allObj.indexOf(tmpScore);
											if(result == -1){
												var btnAry = btnIDAry[t].split("_");
												var btn_dis = ET_str+btnAry[0]+"_"+btnAry[1]+"_DIS";
												div_model = div_model.replace(new RegExp("\\\*"+btn_dis.toLowerCase()+"\\\*", "gi"), "disabled");
											}
										}
									}
									if(pdDataHash[ET_str+"Court"]=="HT") {
										div_model = div_model.replace(new RegExp("\\\*HT_SHOW\\\*","gi"), "");
										div_model = div_model.replace(new RegExp("\\\*FT_SHOW\\\*","gi"), "none");
									}else {
										div_model = div_model.replace(new RegExp("\\\*HT_SHOW\\\*","gi"), "none");
										div_model = div_model.replace(new RegExp("\\\*FT_SHOW\\\*","gi"), "");
									}
									if(wtype=="PD" || wtype=="RPD"){
										rtypes=pdIorHead[ET_str+"ec"+ecid];
										if(!rtypes){
											echo(wtype+">>pdIorHead["+ET_str+"ec"+ecid+"]:",rtypes);
											continue;
										}
									}else if(wtype=="HPD" || wtype=="HRPD"){
										rtypes=pdIorHead[ET_str+"ec"+ecid+"_H"];
										if(!rtypes){
											echo(wtype+">>pdIorHead["+ET_str+"ec"+ecid+"_H]:",rtypes);
											continue;
										}
									}
								}
								
								for(var k=0; k<rtypes.length; k++){
									var rtype = rtypes[k];
									if(showtype == "parlay")var strRatio = util_game.switchConRtype(util_game.transRtype2P(rtype));
									else {
										var strRatio = "";
										if(!util_game.checkWtypeIsWM(wtype))strRatio = util_game.switchConRtype(rtype);
									}
									if(strRatio!=""){
										var ratio = xmlnode.Node(gObj, strRatio).innerHTML;
										if(wtype!="W3" && util_game.checkWtypeIsR(wtype)){
											var strStrong = !isHalf ? "strong" : "hstrong";
											var strong = xmlnode.Node(gObj,strStrong).innerHTML;
											var HC = rtype.substr(-1,1);
											if(util_game.checkWtypeIsR(wtype)){
												if(ratio!=0){
													if(strong!=HC) ratio="+"+ratio;
													else ratio="-"+ratio;
												}
											}else{
												if(strong!=HC) ratio="";
											}
										}
										if(ratio) ratio = ratio.replace(/\s/g,"");
										div_model = div_model.replace(new RegExp("\\\*RATIO_"+rtype+"\\\*","gi"), util_game.showTxt(ratio));
									}

									if(isComplex){ 
										var retObj = _self.parseComplex(div_model,wtype,rtype,xmlnode,ratioChg,gObj,hObj,bObj,tmp_gid,ecid,_mode,important,ptype,clickHash,all_close,body_close,gid,hasEC);
										div_model = retObj["div_model"];
										all_close = retObj["all_close"];
										body_close = retObj["body_close"];
									}
									else{
										if(top.choice_gtype == "bm" && (lowWtype=="ptw" || lowWtype=="wxp")){
											var ior = rtype.substr(rtype.length-1,1)=="H"?bm_ior_h:bm_ior_c;
											ior = _self.chgOddIor(xmlnode,gObj, wtype, rtype, ior);
										}else if(top.choice_gtype == "tn" && (lowWtype=="rga" || lowWtype=="rgou" || lowWtype=="rf")){
											var ior = (ior_ary[_gid+"_"+rtype])?ior_ary[_gid+"_"+rtype]:0;
											ior = _self.chgOddIor(xmlnode,gObj, wtype, rtype, ior);
										}
										else if(showtype == "parlay"){	
											if(top.choice_gtype == "bk" && util_game.checkWtypeIsWM(wtype)){
												var ior = (ior_ary[_gid+"_"+util_game.transRtype2P(rtype)])?ior_ary[_gid+"_"+util_game.transRtype2P(rtype)]:0;
											}
											else var ior = xmlnode.Node(gObj,"ior_"+util_game.transRtype2P(rtype)).innerHTML;
										}
										else if(top.choice_gtype == "bk" && util_game.checkWtypeIsWM(wtype)){
											var ior = (ior_ary[_gid+"_"+rtype])?ior_ary[_gid+"_"+rtype]:0;
										}
										else{
											var ior = xmlnode.Node(gObj,"ior_"+rtype).innerHTML;
											ior = _self.chgOddIor(xmlnode,gObj, wtype, rtype, ior);
										}	

										if(isMutiType)ior_wtype = wtype.substr(0,wtype.length-1); 
										else if(top.choice_gtype == "ft" && wtype=="RC")ior_wtype = "SR";																
										else ior_wtype = wtype;
										ior = ratioChg.chgRatio(ior,ior_wtype);

										if(!util_game.checkWtypeIsPD(wtype)){
											var other_rtype = util_game.checkRtypeIor(rtype); 
											var self_ior = ior;									
											if(other_rtype!=null){  
													if(showtype == "parlay")var other_ior = xmlnode.Node(gObj,"ior_"+util_game.transRtype2P(other_rtype)).innerHTML;
													else var other_ior = xmlnode.Node(gObj,"ior_"+other_rtype).innerHTML;

													if(other_rtype*1==0||self_ior*1==0){

													}else{
															all_close = false;
													}
													
											}else{  												
													if(self_ior*1==0){

													}else{
															all_close = false;
													}
											}
										}else{
											var PDClose = (ior*1==0);
											if(!PDClose)all_close = false;		
										}

										var rtypeClose = (ior*1==0);
										var close_css = rtypeClose ? "lock" : "";
										if(rtypeClose != true){
											body_close = false;
											try{
												if(ior.substr(0,1) == "-") close_css = "odd_bl" 
											}catch(e){
												
											}
											if(hObj!="")hObj.style.display = "";
										}
										
										if(wtype=="PG") div_model = div_model.replace(new RegExp("\\\*PG\\\*","gi"), "pg");
										isBK_WM = _self.isBK_WM(top.choice_gtype,rtype);
										if(top.choice_gtype != "ft" && !all_close && ( other_rtype || rtype.match(/^(RM|HRM|M|HM)(H|N|C)$/g) || isBK_WM )){
											if(!isHalf){
												if(is_rb == "Y"){
													if(receive != "Y"){
														ior = 0;
														close_css = "lock";
													}
												}else{
													if(receive == "N"){
														ior = 0;
														close_css = "lock";
													}
												}
											}else{
												if(is_rb == "Y"){
													if(h_receive != "Y"){
														ior = 0;
														close_css = "lock";
													}
												}else{
													if(h_receive == "N"){
														ior = 0;
														close_css = "lock";
													}
												}
											}
										}
										var _CHOICE = rtype.substr(rtype.length-1, 1);
										if(util_game.checkWtypeIsF(wtype) || util_game.checkWtypeIsRF(wtype)) div_model = div_model.replace(new RegExp("\\\*RTYPE_"+_CHOICE+"\\\*","gi"), util_game.showTxt(rtype));
										div_model = div_model.replace(new RegExp("\\\*IORATIO_"+rtype+"\\\*","gi"), util_game.showTxt(ior));
										div_model = div_model.replace(new RegExp("\\\*CLOSE_"+rtype+"\\\*","gi"), util_game.showTxt(close_css));

										if(top.choice_gtype == "bs" && rtype.match(/^R?MN$/g) && !isMutiType){
											var dis_bet = "bet_"+tmp_gid+"_"+ecid+"_"+rtype;
											BS_disAry.push(dis_bet);
										} 

										if(!rtypeClose){
											var _name = "bet_"+tmp_gid+"_"+ecid+"_"+rtype;
											var _par = new Object();
											_par.gid = tmp_gid;
											_par.ecid = ecid;
											_par.showtype = top.choice_showtype;
											_par.gtype = top.choice_gtype.toUpperCase();
											_par.wtype = wtype;
											_par.rtype = rtype;
											_par.chose_team = _CHOICE;
											if(util_game.checkWtypeIsWM(wtype) || util_game.checkWtypeIsSingle2016(wtype) || util_game.checkWtypeIsDouble2016(wtype)
											   ||util_game.checkWtypeIsSingle2017(wtype) || wtype.match(/^H?R?PD(3|5|7)?$/g)|| wtype == "RDT"){
												   
												_par.chose_team = rtype;
											}
											_par.mode = _mode;
											_par.imp = important;
											_par.ptype = ptype;
											_par.gameObj = gObj;
											_par.session = session;
											_par.is_rb = isRB;
											_par.hasEC = hasEC;
											_par.myGame_gid = gid;
											_par.gidm = gidm;
											_par.ioratio = ior;
											var typeName = "";
											if(top.specialClick=="special")typeName = "special";
											if(top.choice_showtype=="mygame")typeName = "mygame";
											_par.f = util_game.checkBetFrom(typeName,"M");
											clickHash[_name] = _par;
											if(top.choice_gtype == "ft" && util_game.checkWtypeIsPD(wtype)){
												pdDataHash[ET_str+"clickHash"][_name] = _par;
											}
										}

										var chgColorID = "bet_"+tmp_gid+"_"+ecid+"_"+rtype;
										var isChg = (typeof(gid_rtype_ior[chgColorID]) != "undefined" && gid_rtype_ior[chgColorID] != ior && ior*1!=0 && gid_rtype_ior[chgColorID]*1!=0);
										chgColorIor[chgColorID]=isChg;
										gid_rtype_ior[chgColorID] = ior;

									}
								}
								if(top.choice_gtype == "ft" && util_game.checkWtypeIsPD(wtype)){
									if(all_close){
										if(isHalf){
											div_model = div_model.replace(new RegExp("\\\*HALF_SW\\\*","gi"), "none");
										}else {
											if(pdDataHash[ET_str+"ht_allzero"]){
												hObj.style.display = "none";
											}else{
												pdDataHash[ET_str+"Court"] = "HT";
											}
											div_model = div_model.replace(new RegExp("\\\*SHOW_HT\\\*","gi"), util_game.showTxt("on"));
											div_model = div_model.replace(new RegExp("\\\*FULL_SW\\\*","gi"), "none");
										}
									}
									if(pdDataHash[ET_str+"Court"]=="FT" && (lowWtype == "hpd"||lowWtype == "hrpd")) continue;
									else if(pdDataHash[ET_str+"Court"]=="HT" &&(lowWtype == "pd"||lowWtype == "rpd")) continue;
									if((pdDataHash[ET_str+"sw_"+wtype]=="Y" || pdDataHash[ET_str+"pdMode"]=="choice") && (!pdDataHash[ET_str+"ft_allzero"] || !pdDataHash[ET_str+"ht_allzero"])){
										body_close=false;
										all_close=false;
									}
								}
									
								if(body_close && !isComplex){
									div_model = "";
									if(isMutiType)hObj.style.display="none";
								}
							}

							bObj.innerHTML = div_model;
							bObj.style.display = openHash[head_id]? "" : "none";
							tmpScreen.appendChild(bObj);

							hasGame = true;

						}
						if(all_close){
							hObj.style.display = "none";
							bObj.style.display = "none";
							cntWtype--;
						}
						if(hObj.style.display != "none" && bObj.style.display != "none"){
							if(clusterize_sw){
								var tmpGame = dom.createElement("div");
								if(!parseHead){
									//header底下第一個玩法
									hObjClickHash.push({"id":head_id,"ecid":ecid,"mode":_mode,"wtype":wtype,"hasEC":hasEC});
									parseHead = true;
									tmpHeight += MoreDEFINED_ROWHEIGHT["WTYPE_FIX"];
									tmpHeight += MoreDEFINED_ROWHEIGHT["GAMEBORDER_FIX"];
									tmpHeight += MoreDEFINED_ROWHEIGHT["GAME_FIX_"+wtype];
									// console.log("[效能測試][",wtype,"][tmpHeight][",tmpHeight,"],[玩法Header+間距+Body] = ",MoreDEFINED_ROWHEIGHT["WTYPE_FIX"] + MoreDEFINED_ROWHEIGHT["GAMEBORDER_FIX"]+MoreDEFINED_ROWHEIGHT["GAME_FIX_"+wtype]);
									tmpGame.appendChild(hObj);
									tmpGame.appendChild(bObj);
								}else{
									util.addClass(bObj,"box_innbet_child");
									tmpHeight += MoreDEFINED_ROWHEIGHT["GAME_FIX_"+wtype];
									// console.log("[效能測試][",wtype,"][tmpHeight][",tmpHeight,"],[玩法Body] = ",MoreDEFINED_ROWHEIGHT["GAME_FIX_"+wtype]);
									tmpGame.appendChild(bObj);
								}
								blockCount++;
								
								rowAry.push("<div>"+tmpGame.innerHTML+"</div>");
							}
							
						}else if(hObj.style.display != "none" && bObj.style.display == "none"){
							if(clusterize_sw){
								var tmpGame = dom.createElement("div");
								if(!parseHead){
									hObjClickHash.push({"id":head_id,"ecid":ecid,"mode":_mode,"wtype":wtype,"hasEC":hasEC});
									parseHead = true;
									tmpHeight += MoreDEFINED_ROWHEIGHT["WTYPE_FIX"];
									
									// console.log("[效能測試][",wtype,"][tmpHeight][",tmpHeight,"],[玩法Header] = ",MoreDEFINED_ROWHEIGHT["WTYPE_FIX"]);

									hObj.classList.add("game_fold");
									tmpHeight += MoreDEFINED_ROWHEIGHT["WTYPEBORDER_FIX"];
									// console.log("[效能測試][",wtype,"][tmpHeight][",tmpHeight,"],[聯盟折疊間距] = ",MoreDEFINED_ROWHEIGHT["WTYPEBORDER_FIX"]);
									tmpGame.appendChild(hObj);
									tmpGame.appendChild(bObj);
									rowAry.push("<div>"+tmpGame.innerHTML+"</div>");
									blockCount++;
									
								}
							}
							
						}else{
							hObj.style.display = "none";
							bObj.remove();
						}
						
						
						
						if( hObj && hObj.style.display == ""){
							chgheadisopen = true;
						}
					}
				}catch(e){
					util.err("[game_more]wtype="+wtype+"\n"+e.toString());
				}
				
			}

			blockHeight.push(tmpHeight);
    		blockNum.push(blockCount);
			totalRowHeight = util.sumArrayVal(blockHeight);
			// console.log("[效能測試][totalRowHeight] = ",totalRowHeight);
			// console.log("[blockHeight] = ",blockHeight);
			// console.log("[blockNum] = ",blockNum);

			if(chgheadisopen){
				if(clusterize_sw){

					if(clusterize!=null){
						clusterize.update(rowAry, totalRowHeight, blockHeight, blockNum);
					}else{
						_self.useClusterize(totalRowHeight, blockHeight, blockNum);
					}
				}else{
					get("div_show").innerHTML = "";
					get("div_show").appendChild(tmpScreen);
				}
				
			}else{
				if(top.resizePage == "game_more"){
					get("div_show").style.display = "none";
					get("div_nodata").style.display = "";
					hasGame = false;
				}
				
			}

			chgColorIor = util_game.chgIorColor(dom, util, chgColorIor, CookieManager);

			for(var f=0; f<BS_disAry.length; f++){
				if(get(BS_disAry[f])!=null)get(BS_disAry[f]).style.display = "none";
			}

			_self.setTitleSFSClick();
			if(top.choice_gtype =="ft" && util.in_array(clickHeadfilter,havePDAry) && hasPD)_self.initPDbtn(ecid,game,hasEC);
			_self.addBetClick(clickHash);
			_self.addPGClick();
			util_game.initSelect(util);
		}

		return hasGame;
	}

	_self.parseJsonData = function(param,lastWtypeHeight){
		var parseID = param.id;
		var nowMode = param.nowMode;
		var gidHash = param.gidHash;
		var game = param.game;
		var gameHash = param.gameHash;
		var SFSObj = param.SFSObj;
		var hasEC = param.hasEC;
		var isFilterPtype = param.isFilterPtype;
		var hasGame = false;
		var dataObj = new Object();
		var MoreDEFINED_ROWHEIGHT = config_set.get("MoreDEFINED_ROWHEIGHT");
		if(clickHeadfilter == "")clickHeadfilter = "Main";
		var _BLOCK_LIMIT_HEIGHT = 0;
		var blockHeight = new Array();
    	var blockNum = new Array();
		var tmpHeight = 0;
		var totalRowHeight = 0;
		var blockCount = 0;
		var viewport_height = getView().viewportheight;
		var addHeight = (lastWtypeHeight)?lastWtypeHeight : 0;
		rowAry = new Array();
		
		
		if(viewport_height <= 600){
			_BLOCK_LIMIT_HEIGHT = config_set.get("CLUSTERIZE_LIMIT_S"); 
		}else if(viewport_height > 600 && viewport_height <= 900){
			_BLOCK_LIMIT_HEIGHT = config_set.get("CLUSTERIZE_LIMIT_M"); 
		}else if(viewport_height > 900){
			_BLOCK_LIMIT_HEIGHT = config_set.get("CLUSTERIZE_LIMIT_L"); 
		}
		if(gidHash){
			nowMode = "FT";
			var wHash = wtypeHash[nowMode];
			var tmpScreen = dom.createElement("div");
			var cntWtype = 0;
			var chgheadisopen = false;
			var isBK_WM = false;
			var clickHash = new Object();
			var ior_ary = new Array();
			var hasPD = false;
			var needFilter = ((top.choice_gtype=="ft" || (top.choice_gtype=="bk" && showtype!="live")) && clickHeadfilter!="All") || (top.choice_gtype=="es" && clickHeadfilter!="Main");
			for(var a=0; a<wHash.length; a++){
				if(tmpHeight >= _BLOCK_LIMIT_HEIGHT && a!=0){
					blockHeight.push(tmpHeight);
					blockNum.push(blockCount);
					tmpHeight = 0;
					blockCount = 0;
					
				}
				if(needFilter){
					if(!pageFilterHash[clickHeadfilter].includes(wHash[a])) {
						continue;
					}
				}
				var tmp = wHash[a].split("_");
				var gameType = "";
				var _mode = "";
				var wtype = "";
				if(tmp.length != 3){
					_mode = tmp[0];
					wtype = tmp[1];
				}else{
					_mode = tmp[0];
					gameType = tmp[1];
					wtype = tmp[2];
				}
				
				var splitWtype = wtype.split("^");
				var period = "";
				
				if(top.choice_gtype == "es"){
					period = splitWtype[0];
					wtype = splitWtype[1];
				}
				var wtypeStr = util_game.switchWtypeStr(wtype);
				var ET_str = (_mode=="ET" && util_game.checkWtypeIsPD(wtype) && top.choice_gtype == "ft")?"ET_":"";
				var lowWtype = wtype.toLowerCase();
				if(!gidHash[_mode]){
					// if(period != "")_self.hideFilterTab(_mode);
					continue;
				}
				
				try{
					var parseHead = false;
					var head_id = "";
					var body_id = "";

					var wtypeForSW = util_game.changeWtypeForPD(top.choice_gtype,wtype,true);
					var isComplex = util_game.checkWtypeIsComplex(wtype);
					var all_close = true;
					var isMutiType = false; 
					var bs_ms = 0;
					var bm_ior_c = 0;
					var bm_ior_h = 0;
					for(var i=0; i<gidHash[_mode].length; i++){
						var _gid = gidHash[_mode][i];
						var gObj = gameHash[_gid];

						if(gameType != ""){
							if(gObj["GAMETYPE"] != gameType)continue;
						}

						if(gObj!=null){
							var gopen = gObj["GOPEN"];
							var receive = gObj["RECV"];
							var h_receive = gObj["HRECV"];
							var is_rb = gObj["IS_RB"];
							var hgopen = gObj["HGOPEN"];
							var FT_h = gObj["SCORE_H"];
							var FT_c = gObj["SCORE_C"];
							var gid = gObj["GID"];
							var period_id = gObj["PERIOD_ID"];
							var sw_wtype = "";
							var playsData = gObj["PLAYS"];
							var wtypeRatioData = playsData[wtypeStr];
							if(top.choice_gtype == "bm"){
								if(wtypeStr=="PTW" && playsData[wtypeStr])wtypeRatioData = playsData[wtypeStr][wtype];
								else if(wtypeStr=="WXP" && playsData[wtypeStr])wtypeRatioData = playsData[wtypeStr][wtype];
							}else if(top.choice_gtype == "tn"){
								if(wtypeStr=="RGA" && playsData[wtypeStr])wtypeRatioData = playsData[wtypeStr][wtype];
								else if(wtypeStr=="RGOU" && playsData[wtypeStr])wtypeRatioData = playsData[wtypeStr][wtype];
								else if(wtypeStr=="RF" && playsData[wtypeStr])wtypeRatioData = playsData[wtypeStr][wtype];
							}else if(top.choice_gtype == "sk"){
								if(wtypeStr=="F" && playsData[wtypeStr])wtypeRatioData = playsData[wtypeStr][wtype];
							}
							
							if(period != "" && period != period_id)continue;
							if(!wtypeRatioData){
								continue;
							}
							sw_wtype = wtypeRatioData["SW_"+wtypeForSW.toUpperCase()];
							var SFSGAME = gObj["SFSGAME"];
							if(gopen!="Y") continue;
							if(showtype == "parlay"){
								var sw_P3 = (is_rb=="Y")?gObj["SW_RP3"]:gObj["SW_P3"];
								if(sw_P3 != "Y") continue;
							}
							if(wtype != "SFS" && !isComplex && (sw_wtype=="N" || sw_wtype==null)) continue;
							if(wtype == "SFS" && SFSGAME == undefined) continue;
							var isHalf = util_game.checkWtypeIsHalf_util(wtype);
							var ptype = gObj["PTYPE"];
							var ptype_map = gObj["PTYPE_MAP"];
							var important = gObj["IMP"];
							var team_h = gObj["TEAM_H"];
							var team_c = gObj["TEAM_C"];
							var hgid = gObj["HGID"];
							var gidm = gObj["GIDM"];
							var tmp_gid = isHalf ? hgid : gid;
							var str_gid = isHalf ? "HGID" : "GID";
							var half = isHalf ? "Y" : "N";

							team_h = (isFilterPtype)?_self.transTeam(team_h,ptype,important):team_h;
							team_c = (isFilterPtype)?_self.transTeam(team_c,ptype,important):team_c;
							if(ptype && ptype != "")var tmp_ptype = _self.transPtype(ptype,hasEC,isFilterPtype);
							var tmp = gObj["MS"];
							var ms = tmp.split("_")[1];
							var session = ms;//gObj["SESSION"];
							var session_str = "";
							if(session){
								session_str = LS_game.get(top.choice_gtype.toUpperCase()+"_game_"+ms+"_set");
							}
							if(top.choice_gtype == "bs" && wtype.match(/^R?MX$/g) && important != "Y") continue;
							if(top.choice_gtype == "bs" && important == "Y"){
								if(wtype.match(/^R?MX$/g)){
									session = ptype.substr(2).replace(/[\])}[{(]/g,"");
									session_str = session;
									lowWtype = (showtype == "live")?"rm":"m";
									parseHead = false;
									isMutiType = true;
									bs_ms++;
								}else{
									continue;
								}
							}

							if(ms!="" && top.choice_gtype != "ft"){ 
								team_h = team_h.replace(" - ("+session+")","");
								team_c = team_c.replace(" - ("+session+")","");
							}

							if(util_game.checkWtypeIsPTW_BM(wtype)){
								lowWtype = "ptw";
								session_str = LS_game.get("BM_"+wtype.replace("R","")+"_header");
							}else if(util_game.checkWtypeIsWXP_BM(wtype)){
								lowWtype = "wxp";
								session_str = LS_game.get("BM_"+wtype.replace("R","")+"_header");
							}else if(util_game.checkWtypeIsRF_TN(wtype)){
								lowWtype = "rf";
								session_str = LS_game.get("TN_"+wtype+"_header");
							}else if(util_game.checkWtypeIsRGA_TN(wtype)){
								lowWtype = "rga";
								session_str = LS_game.get("TN_"+wtype+"_header");
							}else if(util_game.checkWtypeIsRGOU_TN(wtype)){
								lowWtype = "rgou";
								session_str = LS_game.get("TN_"+wtype+"_header");
							}
							if(top.choice_gtype == "bk" && util_game.checkWtypeIsWM(wtype)){							
								var choice_model = "a";
								if(ms && ms != ""){
									if(Number( ms ) < 3)choice_model = "b";
									else choice_model = "c";
					 	 		}
								lowWtype += choice_model;
							}

							if(!parseHead){
								var hObj = "";
								if(top.choice_gtype == "ft" && (clickHeadfilter=="Halves" || pdDataHash[ET_str+"sw_RPD"]=="N" || pdDataHash[ET_str+"sw_PD"]=="N") && util_game.checkWtypeIsPD(wtype)){
									hObj = get(ET_str+"header_"+lowWtype.replace("h","")).cloneNode(true);
									head_id = wtype.replace("H","")+"_"+_mode+"_"+parseID;
								}else {
									head_id = (isMutiType)? wtype+"_"+_mode+"_"+parseID+"_"+bs_ms:wtype+"_"+_mode+"_"+parseID;
									hObj = get(ET_str+"header_"+lowWtype).cloneNode(true);
								}
								var div_header = hObj.innerHTML;
								if(period != ""){
									head_id += "_"+period;
									if(gameType!= "")head_id += "_"+gameType;
								}
								hObj.setAttribute("id", "head_"+head_id);
								if(isComplex)hObj.setAttribute("style", "display:none;");
								util.addEvent(hObj, "click", _self.clickHeader, {"id":head_id,"mode":_mode,"wtype":wtype,"hasEC":hasEC});

								div_header = _self.parseMSHeader(div_header,wtype,ms,session);
								if(period != ""){
									var period_str = "";
									if(period*1 > 1){
										if(_mode == "Match"){
											period_str = LS_game.get(_mode.toLowerCase()+"_"+period+"_ES") + " - ";
										}else{
											period_str = LS_game.get("ES_"+_mode.toLowerCase()) + " " + LS_game.get("game_"+gameType+"_ES") + LS_game.get("period_"+period+"_ES") + " - ";
										}
									}else{
										if(_mode != "Match"){
											if(gameType != "Specials")period_str = LS_game.get("ES_"+_mode.toLowerCase()) + " " + LS_game.get("game_"+gameType+"_ES") + " - ";
											else period_str = LS_game.get("ES_"+_mode.toLowerCase()) + " - ";
										}
									}
									
									div_header = div_header.replace(new RegExp("\\\*PERIOD\\\*","gi"), util_game.showTxt(period_str));
								}
								
								div_header = div_header.replace(new RegExp("\\\*MS\\\*","gi"), util_game.showTxt(ms));
								div_header = div_header.replace(new RegExp("\\\*SESSION\\\*","gi"), util_game.showTxt(session_str));
								div_header = div_header.replace(new RegExp("\\\*PTYPE\\\*","gi"), util_game.showTxt(tmp_ptype));
								div_header = div_header.replace(new RegExp("\\\*TEAM_H\\\*","gi"), util_game.showTxt(team_h));
								div_header = div_header.replace(new RegExp("\\\*TEAM_C\\\*","gi"), util_game.showTxt(team_c));

								if(hasEC == "Y" && _mode.match(/^(PKOU|PKR|RN)$/g)){
									div_header = div_header.replace(new RegExp("\\\*MSGSHOW\\\*","gi"), "");
								}else{
									div_header = div_header.replace(new RegExp("\\\*MSGSHOW\\\*","gi"), "none");
								}

								if(hasEC == "Y" && _mode.match(/^(ETRN|ETCN|RN|CN)$/g)){
									div_header = div_header.replace(new RegExp("\\\*SCORESHOW\\\*","gi"), "");
								}else{
									div_header = div_header.replace(new RegExp("\\\*SCORESHOW\\\*","gi"), "none");
								}

								if(util_game.checkWtypeIsF(wtype) || util_game.checkWtypeIsRF(wtype)) div_header = div_header.replace(new RegExp("\\\*INNING\\\*","gi"), LS_game.get("SK_"+wtype));

								if(top.choice_gtype == "ft"){
									var scoreObj = get("score_"+lowWtype);
									if(scoreObj!=null&&gObj!=null){
										if(lowWtype == "taru" || lowWtype == "tbru" || lowWtype == "tdru" || lowWtype == "teru")
										{
											var score_type = lowWtype.toUpperCase().substr(1,1);
											var _h = gObj["SCORE_H_"+score_type+"_OT"];
											var _c = gObj["SCORE_C_"+score_type+"_OT"];
										}
										else
										{
											var score_type = lowWtype.toUpperCase().substr(0,1);
											var _h = gObj["SCORE_H_"+score_type];
											var _c = gObj["SCORE_C_"+score_type];										
										}
										scoreObj = _h+" - "+_c;
										div_header = div_header.replace(new RegExp("\\\*SCORE_"+wtype+"\\\*","gi"), util_game.showTxt(scoreObj));
									}
									var scoreStr = (FT_h*1)+" - "+(FT_c*1);
									div_header = div_header.replace(new RegExp("\\\*SCORE_HC\\\*","gi"), util_game.showTxt(scoreStr));
								}
								hObj.innerHTML = div_header;
								tmpScreen.appendChild(hObj);
								if(!clusterize_sw)parseHead = true;
								cntWtype++;
								if(openHash[head_id]==null){
									openHash[head_id] = (cntWtype>defOpen) ? false : true;
								}

								if(!openHash[head_id]) hObj.classList.add("game_fold");

							}else if(parseHead && isComplex){
								cntWtype++;
							}
							if(top.choice_gtype=="ft" && util_game.checkWtypeIsPD(wtype)){//&& mother_gid==gid
								pdDataHash[ET_str+"gid"]=gid;
								pdDataHash[ET_str+"hgid"]=hgid;
								pdDataHash[ET_str+"ecid"]=parseID;
								pdDataHash[ET_str+"gidm"]=gidm;
								pdDataHash[ET_str+"team_h"]=team_h;
								pdDataHash[ET_str+"team_c"]=team_c;
								if(half=="Y"){
									pdDataHash[ET_str+"isHalf"]=half;
									_self.setpdDataHash("ec"+parseID,pdDataHash[ET_str+"hpd_rtypes"],half,is_rb,pdDataHash[ET_str+"score"],ET_str);
								}else{
									_self.setpdDataHash("ec"+parseID,pdDataHash[ET_str+"pd_rtypes"],half,is_rb,pdDataHash[ET_str+"score"],ET_str);
								}
							}
							
							var bodywtype = (top.choice_gtype=="ft" && (wtype=="HPD"||wtype=="HRPD"))?lowWtype.substr(1):lowWtype;	
							var bObj = get(ET_str+"body_"+bodywtype).cloneNode(true);
							var div_model = "";
							if(wtype == "SFS"){ 
								div_model = _self.parseSFS(SFSObj,bObj,tmp_gid,wtype,_mode,parseID,team_h,team_c,important,ptype,clickHash,gObj,gid,hasEC);
								all_close = false;
							}else{
								if(util_game.checkWtypeIsF(wtype)) div_model = get("model_f").innerHTML;
								else if(util_game.checkWtypeIsRF(wtype)) div_model = get("model_rf").innerHTML;
								else if(util_game.checkWtypeIsPD(wtype) && top.choice_gtype == "ft") {
									if(wtype=="HPD" || wtype=="HRPD"){
										if(half=="N")div_model = div_model.replace(new RegExp("\\\*HALF_SW\\\*","gi"), "none");
										var div_pdMenu = (pdDataHash[ET_str+"Court"]=="HT")?get(ET_str+"model_PD_menu").innerHTML:"";
										var div_PDmodel =_self.getPDLayer(pdDataHash[ET_str+"hpd_strong"],wtype,ET_str);
										div_model = div_pdMenu+_self.getPDModel(ecid,div_PDmodel.innerHTML,half,pdDataHash[ET_str+"hpd_strong"],ET_str);
										if(pdDataHash[ET_str+"Court"]=="HT")div_model = div_model.replace(new RegExp("\\\*SHOW_HT\\\*","gi"), util_game.showTxt("on"));
										if(clickHeadfilter=="Halves" || pdDataHash[ET_str+"ft_allzero"])div_model = div_model.replace(new RegExp("\\\*FULL_SW\\\*","gi"), "none");
										if(pdDataHash[ET_str+"sw_"+wtype]!="Y"){
											div_model = div_model.replace(new RegExp("\\\*HALF_SW\\\*","gi"), "none");
										}
										if(showMoreAry[ET_str+wtype] && pdDataHash[ET_str+"pdMode"]=="all")div_model = div_model.replace(new RegExp("\\\*HSHOWMORE\\\*","gi"), util_game.showTxt("on"));
									}else {
										var div_pdMenu = (pdDataHash[ET_str+"Court"]=="FT")?get(ET_str+"model_PD_menu").innerHTML:"";
										var div_PDmodel =_self.getPDLayer(pdDataHash[ET_str+"pd_strong"],wtype,ET_str);
										div_model = div_pdMenu+_self.getPDModel(ecid,div_PDmodel.innerHTML,"N",pdDataHash[ET_str+"pd_strong"],ET_str);
										if(pdDataHash[ET_str+"Court"]=="FT")div_model = div_model.replace(new RegExp("\\\*SHOW_FT\\\*","gi"), util_game.showTxt("on"));
										if(pdDataHash[ET_str+"ht_allzero"])div_model = div_model.replace(new RegExp("\\\*HALF_SW\\\*","gi"), "none");
										if(hgopen=="N" || pdDataHash[ET_str+"sw_H"+wtype]=="N"){
											div_model = div_model.replace(new RegExp("\\\*HALF_SW\\\*","gi"), "none");
										}
										if(showMoreAry[ET_str+wtype] && pdDataHash[ET_str+"pdMode"]=="all")div_model = div_model.replace(new RegExp("\\\*SHOWMORE\\\*","gi"), util_game.showTxt("on"));
									}
								}else if(util_game.checkWtypeIsWM(wtype) && top.choice_gtype == "bk"){
									if(wtype.substr(0,1) == "R")div_model = get("model_rwm"+choice_model).innerHTML;
									else div_model = get("model_wm"+choice_model).innerHTML;
								}else div_model = get("model_"+lowWtype).innerHTML;
								if(top.choice_gtype == "ft" && util_game.checkWtypeIsPD(wtype)){
									var rb_str = (is_rb=="Y")?"R":"";
									body_id = "body_"+rb_str+"PD_"+_mode+"_"+parseID;
								}else body_id = (isMutiType)? "body_"+wtype+"_"+_mode+"_"+parseID+"_"+bs_ms:"body_"+wtype+"_"+_mode+"_"+parseID;
								if(period != ""){
									body_id += "_"+period;
									if(gameType!= "")body_id += "_"+gameType;
								}
								bObj.setAttribute("id", body_id);
								bObj.setAttribute("name", body_id);
								if(isComplex)bObj.setAttribute("style", "display:none;");
								
								div_model = div_model.replace(new RegExp("\\\*GID\\\*","gi"), util_game.showTxt(tmp_gid));
								div_model = div_model.replace(new RegExp("\\\*ECID\\\*","gi"), util_game.showTxt(parseID));
								div_model = div_model.replace(new RegExp("\\\*MODE\\\*","gi"), util_game.showTxt(_mode));
								div_model = div_model.replace(new RegExp("\\\*HALF\\\*","gi"), util_game.showTxt(half));
								div_model = div_model.replace(new RegExp("\\\*WTYPE\\\*","gi"), util_game.showTxt(wtype));
								div_model = div_model.replace(new RegExp("\\\*TEAM_H\\\*","gi"), util_game.showTxt(team_h));
								div_model = div_model.replace(new RegExp("\\\*TEAM_C\\\*","gi"), util_game.showTxt(team_c));

								var rtypes = rtypeHash[wtype];
								if(top.choice_gtype == "bk" && util_game.checkWtypeIsWM(wtype) && choice_model)rtypes= rtypeHash[wtype+choice_model.toUpperCase()];
								
								var body_close = true;
								
								for(var k=0; k<rtypes.length; k++){
									var rtype = rtypes[k];
									var strRatio = "";
									if(showtype == "parlay"){
										strRatio = util_game.switchConRtype(util_game.transRtype2P(rtype));
									}else {
										if(!util_game.checkWtypeIsWM(wtype))strRatio = util_game.switchConRtype(rtype);
									}
									if(strRatio!=""){
										var ratio = wtypeRatioData[strRatio.toUpperCase()];
										if(wtype!="W3" && util_game.checkWtypeIsR(wtype)){
											var strStrong = !isHalf ? "STRONG" : "HSTRONG";
											var strong = gObj[strStrong];
											var HC = rtype.substr(-1,1);
											if(util_game.checkWtypeIsR(wtype)){
												if(ratio!=0){
													if(strong!=HC) ratio="+"+ratio;
													else ratio="-"+ratio;
												}
											}else{
												if(strong!=HC) ratio="";
											}
										}
										if(ratio) ratio = ratio.replace(/\s/g,"");
										// console.log("period = ",period,",ratio = ",ratio);
										if(top.choice_gtype == "es")ratio = util_game.transRatioStr(period,ratio);
										div_model = div_model.replace(new RegExp("\\\*RATIO_"+rtype+"\\\*","gi"), util_game.showTxt(ratio));
									}

									var ior = 0;
										if(showtype == "parlay"){
											var rtypeStr = 	rtype;
											if(top.choice_gtype == "ft")rtypeStr = util_game.transRtype2P(rtype);
											ior = wtypeRatioData["IOR_"+rtypeStr];
											if(ior==undefined)ior=0;
										}else{
											ior = wtypeRatioData["IOR_"+rtype];
											if(ior==undefined)ior=0;
											ior = _self.chgOddIorJson(playsData, wtype, rtype, ior,wtypeStr);
										}

										if(isMutiType)ior_wtype = wtype.substr(0,wtype.length-1); 
										else if(top.choice_gtype == "ft" && wtype=="RC")ior_wtype = "SR";																
										else ior_wtype = wtype;
										ior = ratioChg.chgRatio(ior,ior_wtype);

										if(!util_game.checkWtypeIsPD(wtype)){
											var other_rtype = util_game.checkRtypeIor(rtype); 
											var self_ior = ior;									
											if(other_rtype!=null){  
													if(showtype == "parlay")var other_ior = wtypeRatioData["ior_"+util_game.transRtype2P(other_rtype)];
													else var other_ior = wtypeRatioData["ior_"+other_rtype];

													if(other_rtype*1==0||self_ior*1==0){

													}else{
															all_close = false;
													}
													
											}else{  												
													if(self_ior*1==0){

													}else{
															all_close = false;
													}
											}
										}else{
											var PDClose = (ior*1==0);
											if(!PDClose)all_close = false;		
										}

										var rtypeClose = (ior*1==0);
										var close_css = rtypeClose ? "lock" : "";
										if(rtypeClose != true){
											body_close = false;
											try{
												if(ior.substr(0,1) == "-") close_css = "odd_bl" 
											}catch(e){
												
											}
											if(hObj!="")hObj.style.display = "";
										}
										if(wtype=="PG") div_model = div_model.replace(new RegExp("\\\*PG\\\*","gi"), "pg");
										isBK_WM = _self.isBK_WM(top.choice_gtype,rtype);
										if(top.choice_gtype != "ft" && !all_close && ( other_rtype || rtype.match(/^(RM|HRM|M|HM)(H|N|C)$/g) || isBK_WM )){
											if(!isHalf){
												if(is_rb == "Y"){
													if(receive != "Y"){
														ior = 0;
														close_css = "lock";
													}
												}else{
													if(receive == "N"){
														ior = 0;
														close_css = "lock";
													}
												}
											}else{
												if(is_rb == "Y"){
													if(h_receive != "Y"){
														ior = 0;
														close_css = "lock";
													}
												}else{
													if(h_receive == "N"){
														ior = 0;
														close_css = "lock";
													}
												}
											}
										}
										var _CHOICE = rtype.substr(rtype.length-1, 1);
										if(util_game.checkWtypeIsF(wtype) || util_game.checkWtypeIsRF(wtype)) div_model = div_model.replace(new RegExp("\\\*RTYPE_"+_CHOICE+"\\\*","gi"), util_game.showTxt(rtype));
										div_model = div_model.replace(new RegExp("\\\*IORATIO_"+rtype+"\\\*","gi"), util_game.showTxt(ior));
										div_model = div_model.replace(new RegExp("\\\*CLOSE_"+rtype+"\\\*","gi"), util_game.showTxt(close_css));

										if(top.choice_gtype == "bs" && rtype.match(/^R?MN$/g) && !isMutiType){
											var dis_bet = "bet_"+tmp_gid+"_"+parseID+"_"+rtype;
											BS_disAry.push(dis_bet);
										} 

										if(!rtypeClose){
											var _name = "bet_"+tmp_gid+"_"+parseID+"_"+rtype;
											var _par = new Object();
											_par.gid = tmp_gid;
											_par.ecid = parseID;
											_par.showtype = top.choice_showtype;
											_par.gtype = top.choice_gtype.toUpperCase();
											_par.wtype = wtype;
											_par.rtype = rtype;
											_par.chose_team = _CHOICE;
											if(util_game.checkWtypeIsWM(wtype) || util_game.checkWtypeIsSingle2016(wtype) || util_game.checkWtypeIsDouble2016(wtype)
											   ||util_game.checkWtypeIsSingle2017(wtype) || wtype.match(/^H?R?PD(3|5|7)?$/g)|| wtype == "RDT"){
												   
												_par.chose_team = rtype;
											}
											_par.mode = _mode;
											_par.imp = important;
											_par.ptype = ptype;
											_par.gameObj = gObj;
											_par.session = session;
											_par.is_rb = isRB;
											_par.hasEC = hasEC;
											_par.myGame_gid = gid;
											_par.gidm = gidm;
											_par.format = "json";
											_par.ioratio = ior;
											if(period_id != ""){
												_par.period = period_id;
												_par.gameType = gameType;
											}
											var typeName = "";
											if(top.specialClick=="special")typeName = "special";
											if(top.choice_showtype=="mygame")typeName = "mygame";
											_par.f = util_game.checkBetFrom(typeName,"M");
											clickHash[_name] = _par;
											if(top.choice_gtype == "ft" && util_game.checkWtypeIsPD(wtype)){
												pdDataHash[ET_str+"clickHash"][_name] = _par;
											}
										}

										var chgColorID = "bet_"+tmp_gid+"_"+parseID+"_"+rtype;
										var isChg = (typeof(gid_rtype_ior[chgColorID]) != "undefined" && gid_rtype_ior[chgColorID] != ior && ior*1!=0 && gid_rtype_ior[chgColorID]*1!=0);
										chgColorIor[chgColorID]=isChg;
										gid_rtype_ior[chgColorID] = ior;

									
								}
									
								if(body_close && !isComplex){
									div_model = "";
									if(isMutiType)hObj.style.display="none";
								}
							}

							bObj.innerHTML = div_model;
							bObj.style.display = openHash[head_id]? "" : "none";
							tmpScreen.appendChild(bObj);

							hasGame = true;

						}
						if(all_close){
							hObj.style.display = "none";
							bObj.style.display = "none";
							cntWtype--;
						}
						if(hObj.style.display != "none" && bObj.style.display != "none"){
							if(clusterize_sw){
								var tmpGame = dom.createElement("div");
								if(!parseHead){
									//header底下第一個玩法
									hObjClickHash.push({"id":head_id,"ecid":parseID,"mode":_mode,"wtype":wtype,"hasEC":hasEC});
									parseHead = true;
									tmpHeight += MoreDEFINED_ROWHEIGHT["WTYPE_FIX"];
									tmpHeight += MoreDEFINED_ROWHEIGHT["GAMEBORDER_FIX"];
									tmpHeight += MoreDEFINED_ROWHEIGHT["GAME_FIX_"+wtype];
									// console.log("[效能測試][",wtype,"][tmpHeight][",tmpHeight,"],[玩法Header+間距+Body] = ",MoreDEFINED_ROWHEIGHT["WTYPE_FIX"] + MoreDEFINED_ROWHEIGHT["GAMEBORDER_FIX"]+MoreDEFINED_ROWHEIGHT["GAME_FIX_"+wtype]);
									tmpGame.appendChild(hObj);
									tmpGame.appendChild(bObj);
								}else{
									util.addClass(bObj,"box_innbet_child");
									tmpHeight += MoreDEFINED_ROWHEIGHT["GAME_FIX_"+wtype];
									// console.log("[效能測試][",wtype,"][tmpHeight][",tmpHeight,"],[玩法Body] = ",MoreDEFINED_ROWHEIGHT["GAME_FIX_"+wtype]);
									tmpGame.appendChild(bObj);
								}
								blockCount++;
								
								rowAry.push("<div>"+tmpGame.innerHTML+"</div>");
							}
							
						}else if(hObj.style.display != "none" && bObj.style.display == "none"){
							if(clusterize_sw){
								var tmpGame = dom.createElement("div");
								if(!parseHead){
									hObjClickHash.push({"id":head_id,"ecid":parseID,"mode":_mode,"wtype":wtype,"hasEC":hasEC});
									parseHead = true;
									tmpHeight += MoreDEFINED_ROWHEIGHT["WTYPE_FIX"];
									
									// console.log("[效能測試][",wtype,"][tmpHeight][",tmpHeight,"],[玩法Header] = ",MoreDEFINED_ROWHEIGHT["WTYPE_FIX"]);

									hObj.classList.add("game_fold");
									tmpHeight += MoreDEFINED_ROWHEIGHT["WTYPEBORDER_FIX"];
									// console.log("[效能測試][",wtype,"][tmpHeight][",tmpHeight,"],[聯盟折疊間距] = ",MoreDEFINED_ROWHEIGHT["WTYPEBORDER_FIX"]);
									tmpGame.appendChild(hObj);
									tmpGame.appendChild(bObj);
									rowAry.push("<div>"+tmpGame.innerHTML+"</div>");
									blockCount++;
									
								}
							}
							
						}else{
							hObj.style.display = "none";
							bObj.remove();
						}
						
						
						
						if( hObj && hObj.style.display == ""){
							chgheadisopen = true;
						}
					}
				}catch(e){
					console.error("[game_more]wtype="+wtype+"\n"+e.stack);
				}
				
			}

			blockHeight.push(tmpHeight);
    		blockNum.push(blockCount);
			totalRowHeight = util.sumArrayVal(blockHeight);
			// console.log("[效能測試][totalRowHeight] = ",totalRowHeight);
			// console.log("[blockHeight] = ",blockHeight);
			// console.log("[blockNum] = ",blockNum);

			if(chgheadisopen){
				if(clusterize_sw){

					if(clusterize!=null){
						clusterize.update(rowAry, totalRowHeight, blockHeight, blockNum);
					}else{
						_self.useClusterize(totalRowHeight, blockHeight, blockNum);
					}
				}else{
					get("div_show").innerHTML = "";
					get("div_show").appendChild(tmpScreen);
				}
				
			}else{
				if(top.resizePage == "game_more"){
					get("div_show").style.display = "none";
					get("div_nodata").style.display = "";
					hasGame = false;
				}
				
			}

			chgColorIor = util_game.chgIorColor(dom, util, chgColorIor, CookieManager);

			for(var f=0; f<BS_disAry.length; f++){
				if(get(BS_disAry[f])!=null)get(BS_disAry[f]).style.display = "none";
			}
			dom.getElementById("body_show").scrollTop += addHeight;
			// console.log("body_show向上滾動",addHeight,"px,總共parse",cntWtype,"個玩法");
			_self.setTitleSFSClick();
			if(top.choice_gtype =="ft" && util.in_array(clickHeadfilter,havePDAry) && hasPD)_self.initPDbtn(ecid,game,hasEC);
			iorClickHash = clickHash;
			_self.addBetClick(clickHash);
			_self.addPGClick();
			util_game.initSelect(util);
		}

		return hasGame;
	}

	_self.hideFilterTab = function(game){
		var targetObj = dom.getElementById(game+"_filter");
		if(targetObj && targetObj.style.display != "none"){
			// console.log("隱藏",game);
			targetObj.style.display = "none";
		}
	}
	_self.useClusterize = function(total_h, _blockHeight, _blockNum){
		var tmpID = "body_show";
		clusterize = new Clusterize({
			scrollId: tmpID,
			contentId: 'div_show',
			rows_in_block: config_set.get("CLUSTERIZE_ROW"),
			blocks_in_cluster: config_set.get("CLUSTERIZE_BLOCKS"),
			block_limit_height_S: config_set.get("CLUSTERIZE_LIMIT_S"),
			block_limit_height_M: config_set.get("CLUSTERIZE_LIMIT_M"),
			block_limit_height_L: config_set.get("CLUSTERIZE_LIMIT_L"),
			callbacks: {
				clusterChanged: _self.changeFunc,
			  }
		});
		clusterize.update(rowAry, total_h, _blockHeight, _blockNum);
		
	}

	_self.changeFunc = function(){
		_self.addHeadClick(hObjClickHash);
		_self.addBetClick(iorClickHash);
		chgColorIor = util_game.chgIorColor(dom, util, chgColorIor, CookieManager);
		util_game.initSelect(util);
		
	}

	_self.parseMSHeader = function(div_header,wtype,ms,session){
		if(top.choice_gtype == "tn"){
			if(wtype.match(/^RE?$/g)){
				if(ms == "6" && session == "")div_header = "<tt><span>"+LS_game.get("title_r_main_TN")+"</span><i></i></tt>";
				else if(ms != "" && ms != undefined)div_header = "<tt><span>"+LS_game.get("title_r_1_TN")+"</span><i>*SESSION*</i></tt>";
			}
			if(wtype.match(/^R?OU$/g)){
				if(ms == "6" && session == "")div_header = "<tt><span>"+LS_game.get("title_ou_1_TN")+"</span><i></i></tt>";
				else if(ms != "" && ms != undefined)div_header = "<tt><span>"+LS_game.get("title_ou_1_TN")+"</span><i>*SESSION*</i></tt>";
			}
			if(wtype.match(/^R?EO$/g)){
				if(ms == "6" && session == "")div_header = "<tt><span>"+LS_game.get("title_eo_1_TN")+"</span><i></i></tt>";
				else if(ms != "" && ms != undefined)div_header = "<tt><span>"+LS_game.get("title_eo_1_TN")+"</span><i>*SESSION*</i></tt>";
			}
		}
		if(top.choice_gtype == "vb"){
			if(wtype.match(/^RE?$/g)){
				if(ms=="2") div_header = "<tt><span>"+LS_game.get("title_r_1_VB")+"</span><i></i></tt>";
				else if(ms != "" && ms != undefined)div_header = "<tt><span>"+LS_game.get("title_r_1_VB")+"</span><i>*SESSION*</i></tt>";
			}
			if(wtype.match(/^R?OU$/g)){
				if(ms=="2") div_header = "<tt><span>"+LS_game.get("title_ou_1_VB")+"</span><i></i></tt>";
				else if(ms != "" && ms != undefined)div_header = "<tt><span>"+LS_game.get("title_ou_1_VB")+"</span><i>*SESSION*</i></tt>";
			}
			if(wtype.match(/^R?EO$/g)){
				if(ms=="2") div_header = "<tt><span>"+LS_game.get("title_eo_1_VB")+"</span><i></i></tt>";
				else if(ms != "" && ms != undefined)div_header = "<tt><span>"+LS_game.get("title_eo_1_VB")+"</span><i>*SESSION*</i></tt>";
			}
		}
		if(top.choice_gtype == "bm" || top.choice_gtype == "tt"){
			if(wtype.match(/^RE?$/g)){
				if(ms=="1") div_header = "<tt><span>"+LS_game.get("title_r_1_TT")+"</span><i></i></tt>";									
				else if(ms != "" && ms != undefined)div_header = "<tt><span>"+LS_game.get("title_r_1_TT")+"</span><i>*SESSION*</i></tt>";
			}
			if(wtype.match(/^R?OU$/g)){
				if(ms=="1") div_header = "<tt><span>"+LS_game.get("title_ou_1_TT")+"</span><i></i></tt>";
				else if(ms != "" && ms != undefined)div_header = "<tt><span>"+LS_game.get("title_ou_1_TT")+"</span><i>*SESSION*</i></tt>";
			}
			if(wtype.match(/^R?EO$/g)){
				if(ms=="1") div_header = "<tt><span>"+LS_game.get("title_eo_1_TT")+"</span><i></i></tt>";
				else if(ms != "" && ms != undefined)div_header = "<tt><span>"+LS_game.get("title_eo_1_TT")+"</span><i>*SESSION*</i></tt>";
			}
		}
		return div_header;
	}

	_self.parseSFS = function(SFSObj,bObj,gid,wtype,_mode,ecid,team_h,team_c,important,ptype,clickHash,gObj,mygame_gid,hasEC){
		max_FS = SFSObj[gid]["MAXSFS"];
		SFSGAME= SFSObj[gid]["SFS"];
		S_LIST = SFSObj[gid]["STYPE_LIST"];
		H_LIST = SFSObj[gid]["H_LIST"];
		C_LIST = SFSObj[gid]["C_LIST"];

		var div_model = get("model_sfs").innerHTML;								
		var body_id = "body_"+wtype+"_"+_mode+"_"+ecid;
		bObj.setAttribute("id", body_id);
		bObj.setAttribute("name", body_id);
		div_model = div_model.replace(new RegExp("\\\*TEAM_H\\\*","gi"), util_game.showTxt(team_h));
		div_model = div_model.replace(new RegExp("\\\*TEAM_C\\\*","gi"), util_game.showTxt(team_c));
		var tmpModel = "";
		
		for(var i=0; i<max_FS; i++){
			var model_sfs_game = get("model_sfs_game").innerHTML;
			var hasNoGoal = false;
			var hasOther = false;
			var hasLast = false;
			for(var keys in S_LIST){									
				var stype = S_LIST[keys]; 
				var sgid = SFSGAME[stype]["SFS_GID"];
				var isH = (stype.indexOf("H") < 0);
				var FS_str = isH ? C_LIST[i]:H_LIST[i];
				var ior_val = SFSGAME[stype]["SFS_IOR_"+FS_str]; 
				var tmp_SFS_NAME = SFSGAME[stype]["SFS_NAME_"+FS_str]; 
				var tmp_SFS_teamid = SFSGAME[stype]["TEAM_ID_"+FS_str];

				if(tmp_SFS_teamid=="129602") hasNoGoal=true;
				if(tmp_SFS_teamid=="139490") hasOther=true;
				if(stype=="H20" && ior_val*1>0) hasLast=true;

				var HC = stype.substr(0,1);
				var close_css = (ior_val*1>0)? "" : "lock";
				ior_val = util_game.getIoratio(ior_val, null, "FS");

				model_sfs_game = model_sfs_game.replace(new RegExp("\\\*SFS_TEAM_NAME_"+HC+"\\\*","gi"), util_game.showTxt(tmp_SFS_NAME));
				model_sfs_game = model_sfs_game.replace(new RegExp("\\\*SFS_IORATIO_"+stype+"\\\*","gi"), util_game.showTxt(ior_val));
				model_sfs_game = model_sfs_game.replace(new RegExp("\\\*"+stype+"_GID\\\*","gi"), util_game.showTxt(sgid));
				model_sfs_game = model_sfs_game.replace(new RegExp("\\\*ECID\\\*","gi"), util_game.showTxt(ecid));
				model_sfs_game = model_sfs_game.replace(new RegExp("\\\*RTYPE_"+HC+"\\\*","gi"), util_game.showTxt(FS_str));
				model_sfs_game = model_sfs_game.replace(new RegExp("\\\*CLOSE_"+stype+"_"+FS_str+"\\\*","gi"),  close_css);

				var rtypeClose = (ior_val*1==0);
				if(!rtypeClose){
					var _name = "bet_"+sgid+"_"+ecid+"_"+FS_str;
					var _par = new Object();
					_par.showtype = top.choice_showtype;
					_par.gtype = top.choice_gtype.toUpperCase();
					_par.gid = sgid;
					_par.ecid = ecid;
					_par.rtype = FS_str;
					_par.ioratio = ior_val;
					_par.rtype_name = tmp_SFS_NAME;
					_par.gameObj = gObj;
					_par.bet_now = "SFS";

					_par.wtype = "FS";
					_par.chose_team = FS_str;
					_par.mode = _mode;
					_par.imp = important;
					_par.ptype = ptype;
					_par.is_rb = isRB;
					_par.hasEC = hasEC;
					_par.myGame_gid = mygame_gid;
					var typeName = "";
					if(top.specialClick=="special")typeName = "special";
					if(top.choice_showtype=="mygame")typeName = "mygame";
					_par.f = util_game.checkBetFrom(typeName,"M");
					clickHash[_name] = _par;
				}

				var chgColorID = "bet_"+sgid+"_"+ecid+"_"+FS_str;
				var isChg = (typeof(gid_rtype_ior[chgColorID]) != "undefined" && gid_rtype_ior[chgColorID] != ior_val && ior_val*1!=0 && gid_rtype_ior[chgColorID]*1!=0);
				chgColorIor[chgColorID]=isChg;
				gid_rtype_ior[chgColorID] = ior_val;

			}

			var nogoal_css = "";
			var other_css = "";
			if(hasNoGoal){
				nogoal_css = hasLast? "sfs_nogoal" : "sfs_none";
			}
			if(hasOther){
				other_css = "sfs_other";
			}

			model_sfs_game = model_sfs_game.replace(new RegExp("\\\*STY_NO_GOAL\\\*","gi"), nogoal_css);
			model_sfs_game = model_sfs_game.replace(new RegExp("\\\*STY_OTHER\\\*","gi"), other_css);

			tmpModel += model_sfs_game;	
		}
		div_model = div_model.replace(new RegExp("\\\*ECID\\\*","gi"), util_game.showTxt(ecid));
		div_model = div_model.replace(new RegExp("\\\*SFS_CONTENT\\\*","gi"), util_game.showTxt(tmpModel));

		return div_model;

	}

	_self.setTitleSFSClick = function(){
		var hObj = dom.getElementById("title_sfs_h_"+ecid);
		var cObj = dom.getElementById("title_sfs_c_"+ecid);

		if(hObj==null) return;
		var now_over640 = (getView().viewportwidth >= 640);

		if(over640!=now_over640){
			over640 = now_over640;

			if(over640){
				util.removeEvent(hObj, "click");
				util.removeEvent(cObj, "click");
			}else{
				util.addEvent(hObj, "click", _self.changeSFS, {"type":"h"});
				util.addEvent(cObj, "click", _self.changeSFS, {"type":"c"});
			}
			if(title_sfs_team==""){
				_self.changeSFS(null, {"type":"h"});
			}else{
				_self.initSFSMore(ecid, over640);
			}
			
		}else{
			_self.changeSFS(null, {"type":title_sfs_team});
			util.addEvent(hObj, "click", _self.changeSFS, {"type":"h"});
			util.addEvent(cObj, "click", _self.changeSFS, {"type":"c"});
			_self.initSFSMore(ecid, over640);
		}
		
	}

	_self.changeSFS = function(e, param){
		var obj = dom.getElementById("body_SFS_FT_"+ecid);
		if(obj==null) return;
		var hObj = dom.getElementById("title_sfs_h_"+ecid);
		var cObj = dom.getElementById("title_sfs_c_"+ecid);
		
		if(param.type=="h"){
			util.addClass(hObj, "on");
			util.removeClass(cObj, "on");
			util.removeClass(obj, "team_c");
			util.addClass(obj, "team_h");
		}else{
			util.removeClass(hObj, "on");
			util.addClass(cObj, "on");
			util.removeClass(obj, "team_h");
			util.addClass(obj, "team_c");
		}
		title_sfs_team = param.type;
		_self.initSFSMore(ecid, over640);
	}

	_self.initSFSMore = function(ecid, over640){
		
		var sfsObj = dom.getElementById("sfs_show_more_"+ecid);
		if(sfsObj==null) return;
		var isShow = false;

		if(over640){
			if(max_FS > sfs_show_max) isShow=true;
		}else{
			if(title_sfs_team=="h"){
				if(H_LIST.length > sfs_show_max) isShow=true;
			}else{
				if(C_LIST.length > sfs_show_max) isShow=true;
			}
		}
		
		if(isShow){
			var sfsDiv = dom.getElementById("body_SFS_FT_"+ecid);
			var tarDiv_id = "SFS_"+ecid;
			if(showMoreAry[tarDiv_id])sfsDiv.classList.add("on");
			if(!hasClick){
				sfsObj.style.display = "";
				util.addEvent(sfsObj, "click", _self.showMoreBtn, {"div":sfsDiv, "tarDiv_id":tarDiv_id, "moreBtn":sfsObj});
			}else {
				sfsObj.style.display = "none";
				util.removeEvent(sfsObj, "click");
			}
		}else{
			sfsObj.style.display = "none";
			util.removeEvent(sfsObj, "click");
		}

	}

	_self.windowResize = function(e){
		_self.setTitleSFSClick();
	}

	_self.setXML = function(xml){
		_xmlnode = xml;
	}

	_self.setJSON = function(jsonData){
		lastJsonData = jsonData;
		lastJsonObj = JSON.parse(lastJsonData);
	}

	_self.setVIDEOobj = function(obj){
		videoObj = obj;
	}

	_self.setScoreObj = function(scoreObj){
		lastScoreObj = scoreObj;
	}

	_self.setNowGameNum = function(nowGame){
		nowGameNum = nowGame;
	}

	_self.setNoMotherGame = function(noMother){
		noMotherGame = noMother;
	}

	_self.setScoreType = function(type){
		scoreType = type;
	}
	
	_self.setObj = function(obj){
		scDataObj = obj;
	}

	_self.setParseParam = function(param){
		lastParseParam = param;
	}

	_self.showMoreBtn = function(e, tarObj){
		var tarDiv = tarObj.div;
		var tarDiv_id = tarObj.tarDiv_id;
		if(tarDiv.classList.contains("on")){
			tarDiv.classList.remove("on");
			showMoreAry[tarDiv_id] = false;
		}else{
			tarDiv.classList.add("on");
			showMoreAry[tarDiv_id] = true;
			if(tarObj.moreBtn){
				hasClick = true;
				tarObj.moreBtn.style.display = "none";
			}
		}
	}
	

	_self.parseComplex = function(div_model,wtype,rtype,xmlnode,ratioChg,gObj,hObj,bObj,tmp_gid,ecid,_mode,important,ptype,clickHash,all_close,body_close,gid,hasEC){
		var complexWtype = rtype;
		var rtype_ary = util_game.getAllRtype(complexWtype);

		var body_close = true;

		for(var b=0; b<rtype_ary.length; b++){
			var complexRtype = rtype_ary[b];
			var ior = xmlnode.Node(gObj,"ior_"+complexRtype).innerHTML;
			var complex_sw = xmlnode.Node(gObj,"sw_"+complexWtype).innerHTML;
			ior = _self.chgOddIor(xmlnode,gObj, wtype, complexRtype, ior);
			ior = ratioChg.chgRatio(ior,wtype); 
			var rtypeClose = (ior*1==0);
			var close_css = rtypeClose ? "lock" : "";
			if(rtypeClose != true && complex_sw !="N"){
				all_close = false;
				body_close = false;
				try{
					if(ior.substr(0,1) == "-") close_css = "odd_bl" 
				}catch(e){
					
				}
				hObj.style.display = "";
				bObj.style.display = "";
			}
			div_model = div_model.replace(new RegExp("\\\*IORATIO_"+complexRtype+"\\\*","gi"), util_game.showTxt(ior));
			div_model = div_model.replace(new RegExp("\\\*CLOSE_"+complexRtype+"\\\*","gi"), util_game.showTxt(close_css));

			var _CHOICE = rtype.substr(rtype.length-1, 1);
			if(!rtypeClose){
				var _name = "bet_"+tmp_gid+"_"+ecid+"_"+complexRtype;
				var _par = new Object();
				_par.gid = tmp_gid;
				_par.ecid = ecid;
				_par.showtype = top.choice_showtype;
				_par.gtype = top.choice_gtype.toUpperCase();
				_par.wtype = complexWtype;
				_par.rtype = complexRtype;
				_par.chose_team = _CHOICE;
				if(util_game.checkWtypeIsWM(wtype) || util_game.checkWtypeIsSingle2016(wtype) || util_game.checkWtypeIsDouble2016(wtype)
				   ||util_game.checkWtypeIsSingle2017(wtype) || wtype.match(/^H?R?PD(3|5|7)?$/g)){
					_par.chose_team = complexRtype;
				}
				_par.mode = _mode;
				_par.imp = important;
				_par.ptype = ptype;
				_par.gameObj = gObj;
				_par.is_rb = isRB;
				_par.myGame_gid = gid;
				_par.hasEC = hasEC;
				_par.ioratio = ior;
				var typeName = "";
				if(top.specialClick=="special")typeName = "special";
				if(top.choice_showtype=="mygame")typeName = "mygame";
				_par.f = util_game.checkBetFrom(typeName,"M");
				clickHash[_name] = _par;
			}
			
			var chgColorID = "bet_"+tmp_gid+"_"+ecid+"_"+complexRtype;
			var isChg = (typeof(gid_rtype_ior[chgColorID]) != "undefined" && gid_rtype_ior[chgColorID] != ior && ior*1!=0 && gid_rtype_ior[chgColorID]*1!=0);
			chgColorIor[chgColorID]=isChg;
			gid_rtype_ior[chgColorID] = ior;

		}

		if(body_close){
			div_model = div_model.replace(new RegExp("\\\*"+complexWtype+"_"+tmp_gid+"\\\*","gi"), "none");
		}

		var retObj = new Object;
		retObj["div_model"] = div_model;
		retObj["all_close"] = all_close;
		retObj["body_close"] = body_close;
		return retObj;
	}

	_self.initPDbtn = function(ecid,game,hasEC){
		for(var x=0; x < game.length; x++){
			var master = game[x].getAttribute("master");
			var mode = game[x].getAttribute("mode");
			if(master!="Y")continue;
			if(hasEC!="N" && mode!="FT" && mode!="ET")continue;
			var ET_str = (mode=="ET")?"ET_":"";
			var _gid = xmlnode.Node(game[x],"GID").innerHTML;
			var _hgid = xmlnode.Node(game[x],"HGID").innerHTML;
			var _gidm = xmlnode.Node(game[x],"GIDM").innerHTML;
			var mode_all = get(ET_str+"tab_pd_all");
			var mode_choice = get(ET_str+"tab_pd_choice");
			if(pdDataHash[ET_str+"pdMode"]=="choice"){
				if(mode_choice)mode_choice.classList.add("on");
				if(mode_all)mode_all.classList.remove("on");
			}else {
				if(mode_choice)mode_choice.classList.remove("on");
				if(mode_all)mode_all.classList.add("on");
			}
			var icon_FT = dom.getElementById(ET_str+"icon_FT_"+ecid);
			var icon_HT = dom.getElementById(ET_str+"icon_HT_"+ecid);
			if(pdDataHash[ET_str+"Court"]=="HT" && icon_HT)icon_HT.classList.add("on");
			else if(icon_FT)icon_FT.classList.add("on");
			
			var _key = _gid;
			if(showtype == "live" || (showtype=="parlay" && pdDataHash[ET_str+"is_rb"]=="Y")) var pdAry = new Array("rpd","hrpd");
			else var pdAry = new Array("pd","hpd");
			var showWtype = (pdDataHash[ET_str+"Court"]=="FT")?pdAry[0].toUpperCase():pdAry[1].toUpperCase();
			if((pdDataHash[ET_str+"ht_allzero"] || pdDataHash[ET_str+"sw_"+pdAry[1].toUpperCase()]=="N") && icon_HT)icon_HT.style.display="none";
			var pdWtype = (pdDataHash[ET_str+"Court"]=="FT")?pdAry[0]:pdAry[1];
			if(showWtype.indexOf("H")!=-1)_key = _hgid;
			var tarDiv = dom.getElementById(ET_str+"div_"+showWtype+"_"+_key+"_"+ecid);
			var pdObj = dom.getElementById(ET_str+pdWtype+"_showMore_"+_key);
			if(showMoreAry[ET_str+showWtype])tarDiv.classList.add("on");
			var tarDiv_id = ET_str+showWtype;
			if(pdDataHash[ET_str+"pdMode"]=="all")util.addEvent(pdObj, "click", _self.showMoreBtn, {"div":tarDiv, "tarDiv_id":tarDiv_id});
			else if(pdDataHash[ET_str+"pdMode"]=="choice"){
				var btnIDAry = Array(ET_str+"H_plus_"+_key , ET_str+"C_plus_"+_key , ET_str+"H_minus_"+_key , ET_str+"C_minus_"+_key);
				for(var j=0;j<btnIDAry.length;j++){
					util.addEvent(dom.getElementById(btnIDAry[j]),"click", _self.clickPDCal,{"ecid":ecid,"id":btnIDAry[j],"wtype":showWtype,"game":game[x],"ET_str":ET_str,"hasEC":hasEC});
				}
			}
			util.addEvent(mode_all,"click", _self.chgPDMode,{"ecid":ecid,"hgid":_hgid,"chgMode":"all","pdAry":pdAry,"wtype":showWtype,"game":game[x],"ET_str":ET_str,"hasEC":hasEC});
			util.addEvent(mode_choice,"click", _self.chgPDMode,{"ecid":ecid,"hgid":_hgid,"chgMode":"choice","pdAry":pdAry,"wtype":showWtype,"game":game[x],"chgCourt":"Y","ET_str":ET_str,"hasEC":hasEC});
			util.addEvent(icon_FT, "click", _self.chgPDCourt, {"ecid":ecid,"court":"FT","pdAry":pdAry,"wtype":pdAry[0].toUpperCase(),"game":game[x],"chgCourt":"Y","ET_str":ET_str,"hasEC":hasEC});
			util.addEvent(icon_HT, "click", _self.chgPDCourt, {"ecid":ecid,"court":"HT","pdAry":pdAry,"wtype":pdAry[1].toUpperCase(),"game":game[x],"chgCourt":"Y","ET_str":ET_str,"hasEC":hasEC});	
		}
	}

	_self.setScoreBoard = function(nowMode, mainGame, showtype, gopen, Live, OuterOpen, allGameDisRB, FTscoreH, FTscoreC){
		if(mainGame!=null){
			var gidm = xmlnode.Node(mainGame,"gidm").innerHTML;
			var league = xmlnode.Node(mainGame,"league").innerHTML;
			var midfield = xmlnode.Node(mainGame,"midfield").innerHTML;	
			var team_h = xmlnode.Node(mainGame,"team_h").innerHTML;
			var team_c = xmlnode.Node(mainGame,"team_c").innerHTML;
			var ptype = xmlnode.Node(mainGame,"ptype").innerHTML;
			var ptype_id = xmlnode.Node(mainGame,"ptype_id").innerHTML;
			var limit_min = xmlnode.Node(mainGame,"limit_min").innerHTML; 
			
			
			var pfcolor_h = xmlnode.Node(mainGame,"pfcolor_h").innerHTML;
			var pfcolor_c = xmlnode.Node(mainGame,"pfcolor_c").innerHTML;
			var ptype_ary = new Array("0","779","780","781","835","821");
			if(util.in_array(ptype_id, ptype_ary) || (gidm == ecid)){
				re_time = xmlnode.Node(mainGame,"re_time").innerHTML;
				score_h = xmlnode.Node(mainGame,"score_h").innerHTML*1;
				score_c = xmlnode.Node(mainGame,"score_c").innerHTML*1;
			}else{
				team_h = team_h.replace(ptype,"");
				team_c = team_c.replace(ptype,"");
			}
			var score_new = xmlnode.Node(mainGame,"score_new").innerHTML;
			var redcard_h = xmlnode.Node(mainGame,"redcard_h").innerHTML;
			var redcard_c = xmlnode.Node(mainGame,"redcard_c").innerHTML;
	
			var datetime = xmlnode.Node(mainGame,"datetime").innerHTML; 
			if(datetime!=null&&datetime!=""){
				var tmpDate = datetime.split(" ")[0];
				var tmpTime = datetime.split(" ")[1];
				var str_M = tmpDate.split("-")[1]; 
				var str_D = tmpDate.split("-")[2]; 
				var str_H = tmpTime.split(":")[0];
				var str_Min = tmpTime.split(":")[1]; 
				var isToday = util_game.isToday(tmpDate);

				var diff = util.getTimeDiff(top["userData"].timetype);
				if(Math.abs(diff)>0){
					var _tmpDate = new Date(datetime.replace(/-/g,"/")); //safari 15.5版 2024-05-23 00:00:00 (會壞) 2024/05/23 00:00:00 (正常)
					var newDate = new Date(_tmpDate.getTime()+diff*60*60*1000);
					var newMonth = util.setZero(newDate.getMonth()+1);
					var newDay = util.setZero(newDate.getDate());
					var newHour = util.setZero(newDate.getHours());
					var newMin = util.setZero(newDate.getMinutes());
					if(newDay != str_D*1){ //跨天
						var newDatetime = (top.langx=="en-us")?newDay+" "+LS_game.get("mon_"+newMonth)+"<b></b>"+newHour+":"+newMin:newMonth+LS_game.get("mon_str")+newDay+LS_game.get("day_str")+"<b></b>"+newHour+":"+newMin;
					}else{
						var earlyDateTime = (top.langx=="en-us")?newDay+" "+LS_game.get("mon_"+newMonth)+"<b></b>"+newHour+":"+newMin:newMonth+LS_game.get("mon_str")+newDay+LS_game.get("day_str")+"<b></b>"+newHour+":"+newMin;
						var newDatetime =(isToday)? LS_game.get("showtype_today")+"<b></b>"+newHour+":"+newMin : earlyDateTime;
					}
				}else{
					var earlyDateTime = (top.langx=="en-us")?str_D+" "+LS_game.get("mon_"+str_M)+"<b></b>"+str_H+":"+str_Min:str_M+LS_game.get("mon_str")+str_D+LS_game.get("day_str")+"<b></b>"+str_H+":"+str_Min;
					var newDatetime =(isToday)? LS_game.get("showtype_today")+"<b></b>"+str_H+":"+str_Min : earlyDateTime;
				}
			}else{
				var newDatetime = "";
			}
	
			if(ptype && nowMode.match(/^(PKOU|PKR|ET)$/g)){
				team_h = team_h.replace(ptype,"");
				team_c = team_c.replace(ptype,"");
			}
	
			if(allGameDisRB == "Y" && (gidm != ecid)){
				team_h = team_h.replace(ptype,"");
				team_c = team_c.replace(ptype,"");
			}
	
			var obj = new Object();
			obj.mainGame = mainGame;
			obj.nowMode = nowMode;
			obj.gtype = "ft";
			obj.showtype = showtype;
			obj.isRB = isRB;
			obj.gopen = gopen;
			obj.Live = Live;
			obj.league = league;
			obj.midfield = midfield;
			obj.team_h = team_h;
			obj.team_c = team_c;
			obj.def_league = def_league;
			obj.def_team_h = def_team_h;
			obj.def_team_c = def_team_c;
			obj.score_h = score_h;
			obj.score_c = score_c;
			obj.score_new = score_new;
			obj.redcard_h = redcard_h;
			obj.redcard_c = redcard_c;
			obj.re_time = re_time;
			obj.limit_min = limit_min;
			obj.OuterOpen = OuterOpen;
			obj.newDatetime = newDatetime;
			obj.FTscoreH = FTscoreH;
			obj.FTscoreC = FTscoreC;
			obj.pfcolor_h = pfcolor_h;
			obj.pfcolor_c = pfcolor_c;

			return obj;
		}else{
			var obj = new Object();
			obj.def_league = def_league;
			obj.def_team_h = def_team_h;
			obj.def_team_c = def_team_c;

			return obj;
		}
	}

	_self.parseScoreBoard = function(obj,from){
		//console.log("[parseScoreBoard][obj]",obj,from);
		try{
			if(get("league"))get("league").innerHTML = (obj.league==null)?util_game.showTxt(obj.def_league):util_game.showTxt(obj.league);		
			get("midfield").style.display = (obj.midfield=="Y")? "" : "none";
			get("team_h").innerHTML = (obj.team_h==null)?util_game.showTxt(obj.def_team_h):util_game.showTxt(obj.team_h);
			get("team_c").innerHTML = (obj.team_c==null)?util_game.showTxt(obj.def_team_c):util_game.showTxt(obj.team_c);

			_self.setClothesColor(obj);

			if(obj.gtype=="ft" && obj.isForeCast=="Y"){
				var eventid_ph = xmlnode.Node(obj.mainGame,"eventid_phone").innerHTML;
				var hasTV = (typeof eventid_ph!="undefined" && eventid_ph!="" && eventid_ph!="0");
				if(hasTV){
					get("clothes_h").style.display = "";
					get("clothes_h_600").style.display = "";
					get("clothes_c").style.display = "";
					get("clothes_c_600").style.display = "";
				}else{
					get("clothes_h").style.display = "none";
					get("clothes_h_600").style.display = "none";
					get("clothes_c").style.display = "none";
					get("clothes_c_600").style.display = "none";
				}
			}
	
			if(obj.showtype == "parlay"){
				if(get("game_parlay"))get("game_parlay").innerHTML = util_game.showTxt(obj.limit_min);
				if(get("showPLimit"))get("showPLimit").style.display="";
			}
			var hasScore = (obj.showtype == "live" || (obj.isRB == "Y" && obj.gtype == "ft"));
			if(hasScore){
				if(from=="right_panel" || from=="forecast"){
					if(get("score_board")){
						if(get("score_board").classList.contains("box_scoboard_r")){
							var classStr = get("score_board").className;
							var newClassStr = classStr.replace("box_scoboard_r","box_scoboard");
							get("score_board").className = newClassStr;
						}
					}
				}
				get("score_h").style.display = "";
				get("score_c").style.display = "";
				get("redcard_h").style.display = "";
				get("redcard_c").style.display = "";
				get("pk_h").style.display = "";
				get("pk_c").style.display = "";
				if(get("dash_show"))get("dash_show").style.display = "";
				if(get("vs_show"))get("vs_show").style.display = "none";
				get("re_time").className = "text_time_go";
				if(obj.gopen == "N" && obj.Live == "N"){
					if(obj.OuterOpen){
						get("box_scostate").style.display="none";
						get("pk_score").style.display="none";
						get("score_board").style.display = "";
						get("score_h").innerHTML = "";
						get("score_c").innerHTML = "";
						stayinside = true;
					}else if(!stayinside){
						get("score_h").innerHTML = util_game.showTxt(obj.score_h);
						get("score_c").innerHTML = util_game.showTxt(obj.score_c);
					}
				}else{
					get("re_time").innerHTML = (obj.re_time)?util_game.transRETIME(obj.re_time,false,LS_game,obj.nowMode):0;
					get("score_h").innerHTML = util_game.showTxt(obj.score_h);
					get("score_c").innerHTML = util_game.showTxt(obj.score_c);
					if(obj.redcard_h*1 > 0){
						get("redcard_h").classList.add("on");
						get("redcard_h").innerHTML = obj.redcard_h*1;
					}
					else if(obj.redcard_h*1 <= 0){
						get("redcard_h").classList.remove("on");
						get("redcard_h").innerHTML = "";
					}
	
					if(obj.redcard_c*1 > 0){
						get("redcard_c").classList.add("on");
						get("redcard_c").innerHTML = obj.redcard_c*1;
					}
					else if(obj.redcard_c*1 <= 0){
						get("redcard_c").classList.remove("on");
						get("redcard_c").innerHTML = "";
					}
				
					if(get("pk_score")!=null)get("pk_score").style.display = "none";
					_self.setLastScore(obj.score_new, obj.score_h, obj.score_c); 
	
					if(obj.nowMode=="ET" && obj.FTscoreH && obj.FTscoreC){
						get("ET_mode").style.display="";
						get("ET_mode_scH").innerHTML = util_game.showTxt(obj.FTscoreH);
						get("ET_mode_scC").innerHTML = util_game.showTxt(obj.FTscoreC);
						}else{
						get("ET_mode").style.display="none";
						get("ET_mode_scH").innerHTML = "";
						get("ET_mode_scC").innerHTML = "";
					}
	
					_self.setPKScoreBoard(obj.nowMode, obj.mainGame, obj.nowGoal, obj.endGame, obj.pk_method, obj.from); 
		
					if(top.resizePage!="home")get("score_board").style.display = "";
				}
			}else{
				if(get("game_time"))get("game_time").innerHTML = util_game.showTxt(obj.newDatetime);
				if(from=="right_panel" || from=="forecast"){
					if(get("score_board")){
						get("score_board").style.display = "";
						if(get("score_board").classList.contains("box_scoboard")){
							var classStr = get("score_board").className;
							var newClassStr = classStr.replace("box_scoboard","box_scoboard_r");
							get("score_board").className = newClassStr;
						}
					}
	
					get("score_h").innerHTML = "";
					get("score_c").innerHTML = "";
					get("score_h").style.display = "none";
					get("score_c").style.display = "none";
					get("redcard_h").style.display = "none";
					get("redcard_c").style.display = "none";
					get("pk_h").style.display = "none";
					get("pk_c").style.display = "none";
					if(get("pk_score")!=null)get("pk_score").style.display = "none";
					if(get("dash_show"))get("dash_show").style.display = "none";
					if(get("vs_show"))get("vs_show").style.display = "";
	
					if(get("re_time")){
						get("re_time").className = "text_time";
						get("re_time").innerHTML = (obj.newDatetime)?util_game.showTxt(obj.newDatetime):0;
					}
				}
			}
		}catch(e){
			console.log("parseScoreBoard_FT error",e);
		}

	}

	_self.setClothesColor = function(obj){
		get("clothes_h").className = "icon_shirt";
		get("clothes_h_600").className = "icon_shirt";
		get("clothes_c").className = "icon_shirt";
		get("clothes_c_600").className = "icon_shirt";
		if(obj.pfcolor_h){
			util.addClass(get("clothes_h"),"pf_"+obj.pfcolor_h);
			util.addClass(get("clothes_h_600"),"pf_"+obj.pfcolor_h);
		}
		if(obj.pfcolor_c){
			util.addClass(get("clothes_c"),"pf_"+obj.pfcolor_c);
			util.addClass(get("clothes_c_600"),"pf_"+obj.pfcolor_c);
		}
	}
	

	_self.setPKScoreBoard = function(nowMode, mainGame, nowGoal, endGame, pk_method, from){
		if( nowMode.match(/^PK(R|OU)?$/g) ){
			var pkAry = ["sc_1st_H","sc_1st_C","sc_2nd_H","sc_2nd_C","sc_3th_H","sc_3th_C","sc_4th_H","sc_4th_C","sc_5th_H","sc_5th_C"];
			var rightPKAry = ["score_1_h","score_1_c","score_2_h","score_2_c","score_3_h","score_3_c","score_4_h","score_4_c","score_5_h","score_5_c"];
			var PK_Method = (from=="game_list")?pk_method:xmlnode.Node(mainGame,"PK_Method").innerHTML;
			var nowGoal = (from=="game_list")?nowGoal:xmlnode.Node(mainGame,"nowGoal").innerHTML;
			var nowKick = nowGoal.substr(-2,1);
			var nowSet = _self.getNowSet(nowGoal,nowKick);
			var endGame = (from=="game_list")?endGame:xmlnode.Node(mainGame,"endGame").innerHTML;
	
			var obj = new Object();
			obj.pkAry = pkAry;
			obj.rightPKAry = rightPKAry;
			obj.PK_Method = PK_Method;
			obj.nowKick = nowKick;
			obj.nowGoal = nowGoal;
			obj.nowSet = nowSet;
			obj.mainGame = mainGame;
			obj.endGame = endGame;
			obj.from = from;
			
			_self.parsePKScoreBoard(obj);
		}else{
			var pkTeam = new Array("pk_h","pk_c");
			for(var b=0;b<pkTeam.length;b++){
				if(get(pkTeam[b]).classList.contains("on"))get(pkTeam[b]).classList.remove("on");
			}
		}
	}	

	_self.parsePKScoreBoard = function(obj){
		re_time = LS_game.get("str_rps");
		get("re_time").innerHTML = re_time;

		var pkTeam = new Array("pk_h","pk_c");
		for(var b=0;b<pkTeam.length;b++){
			if(get(pkTeam[b]).classList.contains("on"))get(pkTeam[b]).classList.remove("on");
		}
		if(obj.nowKick!=null&&obj.nowKick!="")get("pk_"+obj.nowKick.toLowerCase()).classList.add("on");
	
		get("PK_Method").innerHTML = (obj.from=="game_list")?util_game.showTxt(obj.PK_Method):util_game.showTxt(LS_game.get("pk_method_"+obj.PK_Method));
		get("now_goal").innerHTML = util_game.showTxt(LS_game.get("str_"+obj.nowGoal));
	
		for(var i=0; i<obj.pkAry.length; i++){
			var scObj = obj.pkAry[i];
			var xml_scObj = (obj.from=="game_list")?obj.rightPKAry[i]:scObj;
			var sc = (scObj==obj.nowSet && obj.endGame!="Y")? "I" : xmlnode.Node(obj.mainGame,xml_scObj).innerHTML;
			var cls = _self.getScoreClass(sc);
			util.classFunc(get(scObj), ["rps_goal","rps_nogoal","rps_ing"], "remove");			
			util.classFunc(get(scObj), cls);
		}
		get("pk_score").style.display = "";
	}

	_self.addHeadClick = function(clickHash){
		for(var key in clickHash){
			try{
				var targetObj = get("head_"+clickHash[key]["id"]);
				util.addEvent(targetObj, "click", _self.clickHeader, clickHash[key]);
			}catch(e){

			}
		}
	}

	_self.addBetClick = function(clickHash){
		for(var _id in clickHash){
			try{
				var obj = get(_id);
				clickHash[_id]["targetObj"] = obj;
				util.addEvent(obj, "click", _self.clickIor, clickHash[_id]);
			}catch(e){
				util.err("[game_more][addBetClick]id="+_id+"\n"+e.toString());
			}
		}
	}
	
	_self.addPGClick = function(){
		for(var i=0; i<pgBtns.length; i++){
			var objF = dom.getElementById(pgBtns[i]+"_btn");
			if(objF){
				util.addEvent(objF, "click", _self.chgPG, {"type":pgBtns[i]});
				if(pgAry[pgBtns[i]])objF.classList.add("on");
			}
		}
	}

	_self.chgPG = function(e, param){
		for(var i=0; i<pgBtns.length; i++){
			dom.getElementById(pgBtns[i]+"_btn").classList.remove("on");
			dom.getElementById(pgBtns[i]+"_div").style.display = "none";	
			pgAry[pgBtns[i]] = false;		
		}
		pgAry[param.type] = true;
		dom.getElementById(param.type+"_btn").classList.add("on");
		dom.getElementById(param.type+"_div").style.display = "";
	}	

	_self.clickHeader = function(e, param){
		var head_obj = e.target;
		var head = dom.getElementById("head_"+param.id);
		var header_show = dom.getElementById("header_show");
		var body_show = dom.getElementById("body_show");
		var ary = dom.getElementsByName("body_"+param.id);
		var addHeight = 0;
		if(head_obj.id != "msgShow"){
			openHash[param.id] = !openHash[param.id];
			for(var i=0; i<ary.length; i++){
				ary[i].style.display = openHash[param.id]? "" : "none";
			}
			if(head.classList.contains("game_fold")) head.classList.remove("game_fold");
			else head.classList.add("game_fold");
			var openHead = dom.getElementById("div_show").getElementsByClassName("game_title_inn");
			for(var z=0; z<openHead.length; z++){
				if(openHead[z].style.display!="none") var lastHead = openHead[z];
			}
			if(head == lastHead){
				
				if(e.clientY + (head.clientHeight - e.offsetY) + ary[0].clientHeight > header_show.clientHeight + body_show.clientHeight){
					addHeight = ary[0].clientHeight;
					body_show.scrollTop += ary[0].clientHeight;
				}
			}

			if(clusterize_sw){
				_self.parseJsonData(lastParseParam,addHeight);
			}

		}else{
			if(param.hasEC == "Y"){
				var _msg = "";
				if(param.mode.match(/^(PKOU|PKR)$/g)) param.mode = "PK";
				if(param.mode == "PK" && param.wtype == "RE") _msg += "<li>" + LS_game.get("str_ExtraInfo_PKR_in")+ "</li>";
				else if(param.mode == "RN") _msg += "<li>" + LS_game.get("str_ExtraInfo_RN")+ "</li>";
				else _msg += "<li>" + LS_game.get("str_ExtraInfo_"+param.mode+"_in")+ "</li>";
				var _par = new Object();
				_par["_id"] = "info_pop"; 
				_par["title"] = "<li>" + LS_game.get("str_ExtraTitle_"+param.mode)+ "</li>";
				_par["msg"] = _msg;
				parentClass.dispatchEvent("showAlertMsg", _par);
			}
		}

		
	}

	_self.clickIor = function(e, param){
		var _size = util.countSize(top["bet_select"]);
		var isSpecialGame = (top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs")?"Y":"N";
		if(_size < 10 || util.in_object("ec_"+param.ecid, top["bet_viewdata"])){
			var obj = param.targetObj;
			top.betMode = "fast";
			var _par = new Object();

			var tmpShowType = "";
			if(top.choice_showtype == "mygame"){
				// if(top.choice_gtype=="ft"){
				// 	if(param.hasEC=="Y")tmpShowType = top["myGameHash"][top.choice_gtype][param.ecid]["showtype"];
				// 	else tmpShowType = top["myGameHash"][top.choice_gtype][param.gidm]["showtype"];
				// }else{
					tmpShowType = top["myGameHash"][top.choice_gtype][param.ecid]["showtype"];
				//}
			}else if(isSpecialGame == "Y"){
				tmpShowType = showtype;
			}else{
				tmpShowType = param.showtype;
			}
			if(param.period && param.period*1 >=1){
				_par.period = param.period;
				_par.nowGame = param.mode;
				_par.gameType = param.gameType;
			}
			_par.showtype = tmpShowType;
			_par.ecid = param.ecid;
			_par.gid = param.gid;
			_par.gtype = param.gtype;
			param.wtype = util_game.changeWtypeForPD(top.choice_gtype,param.wtype,false);
			if(param.rtype.match(/^RSC[A-O](Y|N)$/g)) param.wtype = param.rtype.substr(0,param.rtype.length-1);
			
			if(param.gtype=="BM" && (util_game.checkWtypeIsWXP_BM(param.wtype) || util_game.checkWtypeIsPTW_BM(param.wtype))){
                _par.wtype = param.wtype;
				_par.rtype = param.rtype;
			}else{
				_par.wtype = util_game.filterP(param.wtype,false);
				_par.rtype = util_game.filterP(param.rtype,false);
			}
			_par.chose_team = param.chose_team;
			_par.imp = param.imp;
			_par.ptype = param.ptype;
			_par.isFantasy = isFantasy;
			_par.fantasyObj = fantasyObj;
			_par.ioratio = param.ioratio;
			if(param.is_rb!=null) _par.is_rb = param.is_rb;
			if(param.session!="" && param.session !=null)_par.session = param.session;

			if(param.bet_now != null)_par.bet_now = param.bet_now;
			if(param.rtype_name != null)_par.rtype_name = param.rtype_name;
			if(top["openBets"] && !top["isOrderView"]) parentClass.dispatchEvent("clearBets",{});

			_par.f = param.f;

			var game_information = util_game.setSelect(dom,util,{"obj":obj, "paramHash":_par});
			if(!game_information.isRepeat){
				parentClass.dispatchEvent("showBetSlip",{"isShow":true, "xmlnode":getXmlNode(), "gameObj":param.gameObj, "paramHash":_par ,"isSameEcid": game_information.isSameEcid});
			}else{
				parentClass.dispatchEvent("reCalcBetslip", {"isRepeat":game_information.isRepeat});
			}
		}else{
			parentClass.dispatchEvent("showAlertMsg", { "target":"message_pop_nobtn", "msg":LS.get("order_limit"), "confirm":"N", "retFun": "" });
		}
	}

	_self.getXmlNode = function(){
        return _xmlnode;
    }


	_self.getNowSet = function(nowGoal,nowKick){
		var ret = "";
		if(nowGoal!="" && nowGoal!=null){
			var _set = nowGoal.substr(-1,1);
			switch(_set){
				case "A":
				case "F":
				case "K":
					ret = "sc_1st_"+nowKick;
					break;
				case "B":
				case "G":
				case "L":
					ret = "sc_2nd_"+nowKick;
					break;
				case "C":
				case "H":
				case "M":
					ret = "sc_3th_"+nowKick;
					break;
				case "D":
				case "I":
				case "N":
					ret = "sc_4th_"+nowKick;
					break;
				case "E":
				case "J":
				case "O":
					ret = "sc_5th_"+nowKick;
					break;
			}
		}
		return ret;
	}

	_self.getScoreClass = function(sc){
		var hash = new Object();
		hash["Y"] = "rps_goal";
		hash["N"] = "rps_nogoal";
		hash["I"] = "rps_ing";
		return hash[sc]? hash[sc] : "";
	}

	_self.setLastScore = function(score_new, score_h, score_c){
		if(score_new!=""){
			var sn = (score_new=="H")?"h":"c";
			if(get("score_h").classList.contains("last_goal"))get("score_h").classList.remove("last_goal");
			if(get("score_c").classList.contains("last_goal"))get("score_c").classList.remove("last_goal");
			get("score_"+sn).classList.add("last_goal");
		}
	}

	_self.setScrollToTop = function(){
		if(first_load){
			var srollTopVal = (ios)? -1:0;
			_self.chkScrollTop();
			first_load = false;
			_self.setScrollTop(srollTopVal);
		}
	}

	_self.setScrollTop = function(val){
		parentClass.dispatchEvent("setBodyScrollTop", {"value":val});
	}

	_self.transPtype=function(ptype,hasEC,isFilterPtype){
		var tmp_ptype = ptype;
		var base_ary = Array(" - "," -","- ","-");
		for(i=0; i<base_ary.length; i++){
			var base = base_ary[i]
			var pos = tmp_ptype.indexOf(base);
			if(pos==0){
				tmp_ptype = tmp_ptype.replace(base, "");
				break;
			}
		}
		if(tmp_ptype!="") tmp_ptype+=" - ";
		if(hasEC != "Y" || !isFilterPtype) tmp_ptype = "";
		return tmp_ptype;
	}

	_self.transTeam=function(team, ptype, imp){
		var ret = team;
		if(imp=="Y"){
			ret = ret.replace(ptype, "");
		}
		return ret;
	}

	_self.checkLive = function(xmlnode, main_game, tv, mt, from){

		var eventid_ph = util.getKeyValue(xmlnode,main_game,"eventid_phone");
		var center_tv = util.getKeyValue(xmlnode,main_game,"center_tv");
		var eventid_mt = util.getKeyValue(xmlnode,main_game,"mt_id");
		var mtgtype = util.getKeyValue(xmlnode,main_game,"mt_gtype");
		var mtspid = util.getKeyValue(xmlnode,main_game,"mt_sid");
		var lineups = util.getKeyValue(xmlnode,main_game,"mt_lineups");
		MT_data["gtype"] = mtgtype;
		MT_data["spid"] = mtspid;
        MT_data["datetime"] = util.getKeyValue(xmlnode,main_game,"datetime");
		MT_data["systime"] = util.getKeyValue(xmlnode,main_game,"systime");
		_self.checkLiveProc(eventid_ph, center_tv, eventid_mt, MT_data, lineups, tv, mt);
	}

	_self.checkLiveJson = function(videoObj, main_game, tv, mt, from){
        var eventid_ph = (videoObj)?videoObj["TV_ID"]:"";
        var center_tv = (videoObj)?videoObj["CENTER_TV"]:"";
        var eventid_mt = (videoObj)?videoObj["MT_ID"]:"";
        var mtgtype = (videoObj)?videoObj["MT_GTYPE"]:"";
        var mtspid = (videoObj)?videoObj["MT_SID"]:"";
        var lineups = (videoObj)?videoObj["MT_LINEUPS"]:"";

        MT_data["gtype"] = mtgtype;
        MT_data["spid"] = mtspid;
        var datetime = main_game["DATETIME"];
		var systime = main_game["SYSTIME"];
        MT_data["datetime"] = datetime;
        MT_data["systime"] = systime;
        _self.checkLiveProc(eventid_ph, center_tv, eventid_mt, MT_data, lineups, tv, mt);
    }

	_self.checkLiveProc = function(eventid_ph, center_tv, eventid_mt, MT_data, lineups, tv, mt){
		var isAllow = (MT_data.gtype!=null && MT_data.gtype!="")?mt.checkGtype(MT_data.gtype):false;

        var hasMT = (typeof eventid_mt!="undefined" && eventid_mt!="" && eventid_mt!="0" && isAllow);
		var hasTV = (typeof eventid_ph!="undefined" && eventid_ph!="" && eventid_ph!="0");
		var hasES = (top.rightGtype=="es" && top.rightECID!="" && top.rightNowPlay=="ES");
		var showTV = hasMT || hasTV || hasES;
		if(!hasTV && hasMT) top.rightNowPlay = "MT";
		if(!showTV)top.rightNowPlay = "";
		needShowTV = showTV;

		if(top.choice_gtype=="ft"){
			if(hasTV && top.resize_mainGame!=null){
				get("clothes_h").style.display = "";
				get("clothes_h_600").style.display = "";
				get("clothes_c").style.display = "";
				get("clothes_c_600").style.display = "";
			}else{
				get("clothes_h").style.display = "none";
				get("clothes_h_600").style.display = "none";
				get("clothes_c").style.display = "none";
				get("clothes_c_600").style.display = "none";
			}
		}

		if( (tv.getCenterTV()!=center_tv || tv.getEventid()!=eventid_ph || mt.getGameID()!=eventid_mt) && !hasES){
				if(getView().viewportwidth < 1024){
					if(hasTV && firstInMore){
						top.rightNowPlay="TV";
						firstInMore = false;
					}
					tv.setVariable({"center_tv":center_tv,"token":eventid_ph});
					tv.setVisible(showTV);
					if(!showTV)tv.clearTV();

					mt.init(MT_data,false); 	
					mt.setGameID(eventid_mt);
					if(hasMT){
						mt.setLinesup(lineups);					
						mt.setTvVisible(hasTV);
					}
	
					if(hasTV && !hasMT) mt.onlyTV();
					else mt.mtScroll();

					if(!isRBorRP)tv.setErrorTV({"msg":LS.get("event_not_start")});
				}else{
					console.trace("[more][checkLive]error");
				}

		}
        
    }

	function get(_id){
		if(hasRightPanel) _id ="R_"+_id;
		else if(hasForecast) _id="F_"+_id;
		return dom.getElementById(_id);
	}

	_self.chgOddIor=function(xmlnode, game, wtype, rtype, ior){
		
		if(!util.in_array(wtype.toLowerCase(), change_ary)){
			return ior;
		}

		var rtypes = rtypeHash[wtype];
		var orgHash = new Array();
		var eo_ary = new Array("eo","heo","reo","hreo","eoh","eoc","heoh","heoc");
	  	if(util_game.checkWtypeIsRSH(wtype.toLowerCase())){
		  	if(rtype.substr(0,3) == "RSH"){
			  orgHash[0] = xmlnode.Node(game,"ior_"+rtypes[0]).innerHTML;
				orgHash[1] = xmlnode.Node(game,"ior_"+rtypes[1]).innerHTML;
			}else{
				orgHash[0] = xmlnode.Node(game,"ior_"+rtypes[2]).innerHTML;
				orgHash[1] = xmlnode.Node(game,"ior_"+rtypes[3]).innerHTML;
			}
	  	}else{
			orgHash[0] = xmlnode.Node(game,"ior_"+rtypes[0]).innerHTML;
			orgHash[1] = xmlnode.Node(game,"ior_"+rtypes[1]).innerHTML;
		}

		if(util.in_array(wtype.toLowerCase(), eo_ary)){
			orgHash[0]-=1
			orgHash[1]-=1
			newHash = util_game.chgOddfIoratio(orgHash[0], orgHash[1], config_ior, "HK");
		}else{
			newHash = util_game.chgOddfIoratio(orgHash[0], orgHash[1],config_ior);
		}
		var i = (rtypes[0]==rtype)?0:1;
		if(util_game.checkWtypeIsRSH(wtype.toLowerCase())){
			if(rtype.substr(0,3) == "RSC"){
				i = (rtypes[2]==rtype)?0:1;
			}
		}
		return (util.in_array(wtype.toLowerCase(), eo_ary))?(newHash[i]*1+1):newHash[i];
	}

	_self.chgOddIorJson=function(game, wtype, rtype, ior, wtypeStr){
		
		if(!util.in_array(wtype.toLowerCase(), change_ary)){
			return ior;
		}

		var rtypes = rtypeHash[wtype];
		var orgHash = new Array();
		var eo_ary = new Array("eo","heo","reo","hreo","eoh","eoc","heoh","heoc");
	  	if(util_game.checkWtypeIsRSH(wtype.toLowerCase())){
		  	if(rtype.substr(0,3) == "RSH"){
			  orgHash[0] = game[wtypeStr]["IOR_"+rtypes];
				orgHash[1] = game[wtypeStr]["IOR_"+rtypes[1]];
			}else{
				orgHash[0] = game[wtypeStr]["IOR_"+rtypes[2]];
				orgHash[1] = game[wtypeStr]["IOR_"+rtypes[3]];
			}
	  	}else{
			orgHash[0] = game[wtypeStr]["IOR_"+rtypes[0]];
			orgHash[1] = game[wtypeStr]["IOR_"+rtypes[1]];
		}

		if(util.in_array(wtype.toLowerCase(), eo_ary)){
			orgHash[0]-=1
			orgHash[1]-=1
			newHash = util_game.chgOddfIoratio(orgHash[0], orgHash[1], config_ior, "HK");
		}else{
			newHash = util_game.chgOddfIoratio(orgHash[0], orgHash[1],config_ior);
		}
		var i = (rtypes[0]==rtype)?0:1;
		if(util_game.checkWtypeIsRSH(wtype.toLowerCase())){
			if(rtype.substr(0,3) == "RSC"){
				i = (rtypes[2]==rtype)?0:1;
			}
		}
		return (util.in_array(wtype.toLowerCase(), eo_ary))?(newHash[i]*1+1):newHash[i];
	}

	_self.removebodylock = function(){
		parentClass.dispatchEvent("removebodylock",{});
	}

	_self.addbodylock = function(){
		parentClass.dispatchEvent("addbodylock",{});
	}

	_self.setNowBodyLockStatus = function(status){
		parentClass.dispatchEvent("setNowBodyLockStatus",status);
	}

	_self.isBK_WM = function(gtype,rtype){
		var chk = false;
		var chgRtype = rtype.replace(/R/,"");
		if(gtype == "bk"){
			if(chgRtype.match(/^WMA(H|C)([1-5]|OV)$/g)){
				chk = true;
			}
			else if(chgRtype.match(/^WMB(H|C)(1|OV)$/g)){
				chk = true;
			}else if(chgRtype.match(/^WMC(OT|(H|C)OV)$/g)){
				chk = true;
			}else{
				if(chgRtype == "WMBOT"){
					chk = true;
				}
			}
			
		}
		return chk;
	}

	_self.openTV = function(e, param){
		tv.setLoadingTV(true);
		tv.openEvent(isRBorRP);
	}

	_self.closeTV = function(e, param){
		tv.closeEvent();
	}
	
	_self.getSortLS = function(langx){
		var hash = new Object();
		hash[langx] = "E";
		hash["zh-tw"] = "C";
		hash["zh-cn"] = "G";
		hash["en-us"] = "E";
		return hash[langx];
	}

	_self.setGameSFS=function(main_game){
		var tmp_Obj = new Array();
		var tmp_game = main_game;
		var xmdObj = new Object();
		xmdObj["SFSGAME"] = xmlnode.Node(tmp_game,"SFSGAME");
		var gid = xmlnode.Node(tmp_game,"GID").innerHTML;
	
		try{
			xmdObj["SFS"] = xmlnode.Node(xmdObj["SFSGAME"],"SFS");
			max_FS = 0;
			var sortLS = _self.getSortLS(top.langx);
			var SFSGAME = new Array();
			var S_LIST = new Array();
			var cnt_H = new Array();
			var cnt_C = new Array();
			var RTYPE_H = new Array();
			var RTYPE_C = new Array();

			for(var i=0; i<xmdObj["SFS"].length; i++){
					var tmp_sfs = xmdObj["SFS"][i];
					var SFStype = xmlnode.Node(tmp_sfs,"SFS_ID").innerHTML;
					S_LIST[S_LIST.length] = SFStype;
					SFSGAME[SFStype] = new Array();
					SFSGAME[SFStype]["SFS_GID"] = xmlnode.Node(tmp_sfs,"SFS_GID").innerHTML;
					SFSGAME[SFStype]["SFS_TITLE"] = xmlnode.Node(tmp_sfs,"SFS_PICTHER_"+sortLS);

					xmdObj["RTYPES"] = xmlnode.Node(tmp_sfs,"RTYPES");
					for(var j=0; j<xmdObj["RTYPES"].length; j++){

						var tmp_rtype = xmdObj["RTYPES"][j];
						var FSrtype = xmlnode.Node(tmp_rtype,"SFS_RTYPE").innerHTML;
						var FSteam = xmlnode.Node(xmdObj["RTYPES"][j],"SFS_NAME_"+sortLS).innerHTML;
						var FSior = xmlnode.Node(xmdObj["RTYPES"][j],"SFS_IOR").innerHTML; 
						var FSteam_id = xmlnode.Node(xmdObj["RTYPES"][j],"TEAM_ID").innerHTML; 

						SFSGAME[SFStype]["SFS_IOR_"+FSrtype] = FSior;
						SFSGAME[SFStype]["SFS_NAME_"+FSrtype] = FSteam;
						SFSGAME[SFStype]["TEAM_ID_"+FSrtype] = FSteam_id;

						if(SFStype.indexOf("H")!=-1){
							if(cnt_H[FSrtype]==undefined) cnt_H[FSrtype] = 0;
							cnt_H[FSrtype] += FSior*1;
						}

						if(SFStype.indexOf("C")!=-1){
							if(cnt_C[FSrtype]==undefined) cnt_C[FSrtype] = 0;
							cnt_C[FSrtype] += FSior*1;
						}

					}					
			}
		
			for(var r_key in cnt_H){
				if(cnt_H[r_key] > 0) RTYPE_H.push(r_key);
			}

			for(var r_key in cnt_C){
				if(cnt_C[r_key] > 0) RTYPE_C.push(r_key);
			}

			max_FS = (RTYPE_C.length > RTYPE_H.length)?RTYPE_C.length:RTYPE_H.length;

			tmp_Obj[gid] = new Array();
			tmp_Obj[gid]["STYPE_LIST"] = _self.sortStype(S_LIST);
			tmp_Obj[gid]["H_LIST"] = RTYPE_H;
			tmp_Obj[gid]["C_LIST"] = RTYPE_C;
			tmp_Obj[gid]["MAXSFS"] = max_FS
			tmp_Obj[gid]["SFS"] = SFSGAME;

		}catch(e){

		}

		return tmp_Obj;
	}

	_self.sortStype = function(S_LIST){
		S_LIST = new Array("H19","H204","H20","C19","C204","C20");
		var outObj = new Object();
		var match = {"H":"A","C":"B"};
		var cnt = {"H":0,"C":0};
		var tmp;
	
		for(var i=0 ;i<S_LIST.length;i++){
				tmp = S_LIST[i].substr(0,1);
	
				outObj[match[tmp]+(cnt[tmp]++)] = S_LIST[i];
		}
	
		return outObj;
	}

	_self.closeMTsub = function(){
		if(mt!=null) mt.closeMTsub();
	}

	_self.setHasRightPanel = function(){
		hasRightPanel = true;
	}

	_self.setHasForecast = function(){
		hasForecast = true;
	}


	_self.resizeEvent = function(width1024){
			if(width1024){
				if(top.choice_gtype == "es" && showtype == "live" && nowGameNum != "N/A" && scoreType != "N/A" && lastJsonObj["response"]["ALL_CLOSE"] != "Y" && !noMotherGame){
					_self.showAnalysisBtn(false);
					_self.setAnalysisBtnLight(true);
					parentClass.dispatchEvent("closeAnalysis",true);
					parentClass.dispatchEvent("getAnalysisData",{"gtype":"es","peid":peid,"showtype":showtype,"scoreType":scoreType,"scoreObj":lastScoreObj});
				}
				if(top.resize_mainGame==null){
					var eventid_ph = util.getKeyValue(_xmlnode,_xmlnode.Root[0],"eventid_phone");
					var center_tv = util.getKeyValue(_xmlnode,_xmlnode.Root[0],"center_tv");
					parentClass.dispatchEvent("noGameCheckLive", {"eventid_ph":eventid_ph, "center_tv":center_tv});
				}else{
					if(top.rightECID!="")parentClass.dispatchEvent("parseRightScoreBoard", scDataObj);
					if((showtype=="live"||(showtype=="parlay"&&isRB=="Y"))){
						if(top.rightGtype!="ft"){
							parentClass.dispatchEvent("checkRightLive", {"videoObj":videoObj,"mainGame":top.resize_mainGame,"format":"json"});
						}else{
							parentClass.dispatchEvent("checkRightLive", {"xmlnode":_xmlnode, "mainGame":top.resize_mainGame, "from":"game_more"});
						}
					}else{
						if(top.rightECID!=""){
							if(top.rightGtype!="ft"){
								parentClass.dispatchEvent("checkRightLive", {"videoObj":videoObj,"mainGame":top.resize_mainGame,"format":"json"});
							}else{
								parentClass.dispatchEvent("checkRightLive", {"xmlnode":_xmlnode, "mainGame":top.resize_mainGame, "from":"game_more"});
							}
						}else{
							parentClass.dispatchEvent("setRightLoading", {"isShow":false});
						} 
					}
				}
			
				if(top.rightNowPlay!="")parentClass.dispatchEvent("resizeMTEvent", {});
				if(top.rightNowPlay=="TV")_self.setTvPlaying("right");
				get("watch_live").style.display = "none";
			}else{
				if(top.choice_gtype == "es" && showtype == "live" && nowGameNum != "N/A" && scoreType != "N/A" && lastJsonObj["response"]["ALL_CLOSE"] != "Y" && !noMotherGame){
					_self.showAnalysisBtn(true);
					_self.showAnalysis(null,{"gtype":gtype,"peid":peid,"showtype":showtype,"scoreType":scoreType,"scoreObj":lastScoreObj});
				}
				if(top.resize_mainGame==null){
					var eventid_ph = util.getKeyValue(_xmlnode,_xmlnode.Root[0],"eventid_phone");
					var center_tv = util.getKeyValue(_xmlnode,_xmlnode.Root[0],"center_tv");
					_self.checkLiveProc(eventid_ph, center_tv, "", "", "", tv, mt);
				}else{
					if(top.rightGtype!="ft"){
						_self.checkLiveJson(videoObj, top.resize_mainGame, tv, mt);
					}else{
						_self.checkLive(_xmlnode, top.resize_mainGame, tv, mt);
					}
				}


				if(top.rightNowPlay!="")_self.resizeMTEvent();
				if(top.rightNowPlay=="TV")_self.setTvPlaying("more");
			}
	}

	_self.resizeMTEvent = function(){
		mt.resetOnmessage();
        get("watch_live").style.display = "none";
        if(top.rightNowPlay=="TV" && mt.getNowBox()!="tv_box"){
            setTimeout(mt.setBtnLight,300,"tv_btn");
        }
        else if(top.rightNowPlay=="MT" && mt.getNowBox()!="mt_box"){
            setTimeout(mt.setBtnLight,300,"mt_btn");
		}
		
		
        if(top.resizeMTSub!="")mt.setBtnLight(top.resizeMTSub);
        else if(top.resizeMTSub=="")mt.closeMTsub();

		if(top.choice_gtype != "es"){
			setTimeout(mt.collapseTV_resize,300,top.collapseClick);
			mt.timelineSwitch(top.resizeTimeClick);
		}
		
	}

	_self.setTvPlaying = function(nowShow){		
		if(nowShow=="right"){
			if(tv.getPlaying()){
				_self.resetTV();
				parentClass.dispatchEvent("rightResizeEvent", {"act":"defaultPlay"});
			}
		}else{
			var rightPlay = parentClass.chkTvPlaying();
			if(rightPlay){
				parentClass.dispatchEvent("resetRightTV", {});
				tv.defaultPlay();
			}
		}
	}

    _self.resetTV=function(){
        var isTVExist = tv.chkExist();
        if(isTVExist){
            var ret = tv.clearTV();
            if(ret){
                tv.resetVideo();
                if(mt)mt.clearMT();
            }
        }
	}	
	
	_self.showAlertMsg = function(param){
		parentClass.dispatchEvent("showAlertMsg", param);
	}

	_self.videoOnClick = function(){
		parentClass.dispatchEvent("videoOnClick", null);
	}	

	_self.myGameClose = function(){
		parentClass.dispatchEvent("bodyGoToPage", { "page": "home" });
		parentClass.dispatchEvent("showAlertMsg", { "target":"message_pop_nobtn", "msg":LS.get("myGame_backToHome"), "confirm":"N", "retFun": "" });
	}

	_self.AlertFantasyInfo = function(e, hash){
		parentClass.dispatchEvent("showFantasyInfo", hash);
	}
	
	_self.goToGetFantasyInfo = function(gidfl,gid,team_id_h,team_id_c){
		var urlParams = "";
		urlParams += "uid=" + top["userData"].uid;
		urlParams += "&langx=" + top.langx;
		urlParams += "&gidfl=" + gidfl;
		urlParams += "&mode=game_more";
		urlParams += "&team_id_h=" + team_id_h;
		urlParams += "&team_id_c=" + team_id_c;
		urlParams += "&gid=" + gid;
		urlParams = "p=get_fantasy_info&" + urlParams;
		var getHTML = new HttpRequest();
		getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete",_self.getFantasyInfoComplete);
		getHTML.loadURL(top.m2_url,"POST",urlParams);
	}

	_self.getFantasyInfoComplete = function(xml){
        var errorMsg = util.showConnectMsg(xml);
        if(util.alertConnectMsg(errorMsg))  return;
        xmlnode = util.parseXml(xml);
        var fantasyData = xmlnode.Node(xmlnode.Root[0],"FANTASY_DATA").innerHTML;
        var gidfl = xmlnode.Node(xmlnode.Root[0],"gidfl").innerHTML;
        var gid = xmlnode.Node(xmlnode.Root[0],"gid").innerHTML;
        var system_time = xmlnode.Node(xmlnode.Root[0],"system_time").innerHTML;
        var team_id_h = xmlnode.Node(xmlnode.Root[0],"team_id_h").innerHTML;
        var team_id_c = xmlnode.Node(xmlnode.Root[0],"team_id_c").innerHTML;
        if(fantasyData!="No Fantasy Data"){
            fantasyData = xmlnode.Node(xmlnode.Root[0],"FANTASY_DATA", false)[0];
            var fantasyGame1 = xmlnode.Node(fantasyData,"GAMEH", false)[0];
            var fantasyGame2 = xmlnode.Node(fantasyData,"GAMEC", false)[0];
            var fantasy_teamh = (team_id_h==fantasyGame1.getAttribute("TEAM_H_ID"))?"teamA":"teamB";
            var fantasy_teamc = (team_id_c==fantasyGame2.getAttribute("TEAM_H_ID"))?"teamC":"teamD";
            fantasyObj = {
                "system_time":system_time,
                "game1_datetime":fantasyGame1.getAttribute("DATETIME"),"game1_Leg":fantasyGame1.getAttribute("LEAGUE"),"teamA":fantasyGame1.getAttribute("TEAM_H"),"teamB":fantasyGame1.getAttribute("TEAM_C"),
                "game2_datetime":fantasyGame2.getAttribute("DATETIME"),"game2_Leg":fantasyGame2.getAttribute("LEAGUE"),"teamC":fantasyGame2.getAttribute("TEAM_H"),"teamD":fantasyGame2.getAttribute("TEAM_C"),
                "fantasy_teamh":fantasy_teamh,"fantasy_teamc":fantasy_teamc,"isToday":"Y"
            };
			util.addEvent(dom.getElementById("more_icon_info"), "click", _self.AlertFantasyInfo, fantasyObj);
        }else{
            util.addEvent(dom.getElementById("more_icon_info"), "click", _self.AlertFantasyInfo, {});
        }
    }

	_self.onMessageEvent = function(code){
		var cmds = code.split("|");
		var paramObj = new Object;

		switch(cmds[0]){
			case "002":
				mt.closeLoading(cmds[1],cmds[2]);
				break;
			case "006":
                if(cmds[1]=="init_perform")top.load_perform = true;
                if(cmds[1]=="init_betgenius")top.load_betgenius = true;
				if(tv.getPlaying()){
					tv.defaultPlayProc();
				}
				break;
			case "008":
                var hlsMsg = cmds[1].split(","); 
				paramObj["hls"] = hlsMsg[1];			
				tv.srcVideo(paramObj);
				break;
			case "010":
                var errorMsg = cmds[1].split(","); 
				paramObj["msg"] = errorMsg[1];
				tv.setErrorTV(paramObj);	
				break;
			case "012":
				var url = cmds[1]		
				tv.srcGliveFrame(url);
				break;	
			case "555":
				mt.showNoData(cmds[1],cmds[2]);
				break;	
		}
    }

	_self.showFilterLoading = function(isShow){
		var filter_loading = dom.getElementById("filter_loading");
		if(filter_loading){
			filter_loading.style.display = (isShow)?"":"none";
			if(isShow){
				util.addClass(filter_loading,"loading_on");
			}else{
				util.removeClass(filter_loading,"loading_on");
			}
		}
		
	}

	_self.filterScroll = function(e){
		var _filter = dom.getElementById("filter_total");
		var _scroll = dom.getElementById("filter_scroll");
		var _left = dom.getElementById("filter_left");
		var _right = dom.getElementById("filter_right");
		if(_filter && _scroll){
			if(_filter.clientWidth > _scroll.clientWidth){
			util.addClass(_right,"on");
			util.addEvent(_right,"click",util.move,{"click":_right ,"div":_scroll, "direction":"right", "opposite":_left});
		}else{
			util.removeClass(_right,"on");
			util.removeEvent(_right, "click");
		}
			util.addEvent(_scroll,"scroll",_self.addScrollEvent,{"total":_filter ,"scroll":_scroll , "left":_left , "right":_right});
		}
	}

		_self.chkScrollTop = function(e){
		if(ios && top.mobile == "Y" && first_load){
			parentClass.dispatchEvent("initScrollAnimation");
			var scrollTarget = dom.getElementById("scroll_html");
			if(scrollTarget.scrollTop != 0){
				scrollTarget.scrollTop = -1;
			}
		}
	}



	_self.addScrollEvent=function(e,param){
		var scroll = param.scroll.scrollLeft;
		top.tab_left_distance = scroll;
		var menuW = param.scroll.scrollWidth - param.scroll.clientWidth;

		if (scroll > 0) {
			util.addClass(param.left,"on");
		}  
		if (scroll == 0) {
			util.removeClass(param.left,"on");
		}
		if (scroll < menuW) {
			util.addClass(param.right,"on");
		}
		if (scroll >= menuW) {
			util.removeClass(param.right,"on");
		}
		if(param.total) util.initCheckScroll(param.total, param.scroll, param.left, param.right);
	}

	_self.showForecast = function(e,par){
		if(timerHash["moreTimer"] != null)timerHash["moreTimer"].stopTimer();
		if(top.rightShowTV && getView().viewportwidth >= 1024){
			if(timerHash["rightPanelTimer"] == null)parentClass.dispatchEvent("setRightTimer", "create");
			timerHash["rightPanelTimer"].startTimer();
		}
		par["from"] = "more";
		if(par.ptype!=""){
			par.team_h = par.team_h.replace(par.ptype, "");
			par.team_c = par.team_c.replace(par.ptype, "");
		}
		parentClass.dispatchEvent("showForecast",par);
	}

	_self.restartTimer = function(){
		_self.getData(false);
		if(timerHash["moreTimer"] != null)timerHash["moreTimer"].startTimer();
		if(timerHash["rightPanelTimer"] != null)timerHash["rightPanelTimer"].stopTimer();
	}

	_self.setEcid = function(id){
        ecid = id;
    }

	_self.showPDLoading = function(isShow,ET_str){
		var pd_loading = dom.getElementById(ET_str+"pd_loading");
		pd_loading.style.display = (isShow)?"":"none";
		if(isShow){
			isChgPDMode = true;
			util.addClass(pd_loading,"pd_loading_on");
		}else{
			isChgPDMode = false;
			util.removeClass(pd_loading,"pd_loading_on");
		}
	}

	_self.setpdDataHash = function(ecid,SortStr,isHalf,is_rb,choiceScore,ET_str){
        var tmpEC = ET_str+ecid;
        var half = (isHalf == "Y")?"_H":"";
        if(pdSortHash[tmpEC+half] == null)pdSortHash[tmpEC+half] = new Array();
        pdSortHash[tmpEC+half]["H"] = new Array();
        pdSortHash[tmpEC+half]["C"] = new Array();
        pdSortHash[tmpEC+half]["DRAW"] = new Array();
        pdSortHash[tmpEC+half]["All"] = new Array();
        if(pdSortHash[tmpEC+half]["choice"] == null){
			if(choiceScore=="")choiceScore=pdDataHash[ET_str+"scoreH"]+"-"+pdDataHash[ET_str+"scoreC"];
			pdSortHash[tmpEC+half]["choice"] = choiceScore;
		}

        pdHeadHash[tmpEC+half] = new Array();
        pdIorHead[tmpEC+half] = new Array();

        var tmpHeadStr = (isHalf == "Y")?"IOR_H":"IOR_";
        var tmpIorStr = (isHalf == "Y")?"H":"";
		if(showtype=="live")is_rb="Y";
        var splitSortStr = SortStr.split("#");
        for(var p=0;p<splitSortStr.length;p++){
			if(splitSortStr[p]=="")continue;
            var tmpScore = splitSortStr[p];
            var splitScore = tmpScore.split("-");
            var hScore = splitScore[0];
            var cScore = splitScore[1];
            var tmpHeadKey = (is_rb != "Y")? tmpHeadStr+"H"+hScore+"C"+cScore : tmpHeadStr+"RH"+hScore+"C"+cScore;
            var tmpIorKey = (is_rb != "Y")? tmpIorStr+"H"+hScore+"C"+cScore : tmpIorStr+"RH"+hScore+"C"+cScore;

            pdSortHash[tmpEC+half]["All"].push(tmpScore);
            pdHeadHash[tmpEC+half].push(tmpHeadKey);
            pdIorHead[tmpEC+half].push(tmpIorKey);
			if(hScore*1 > cScore*1)pdSortHash[tmpEC+half]["H"].push(tmpScore);
			else if(cScore*1 > hScore*1)pdSortHash[tmpEC+half]["C"].push(tmpScore);
			else pdSortHash[tmpEC+half]["DRAW"].push(tmpScore);
		}
		util_game.sortHash(pdSortHash[tmpEC+half]["H"],"positive");
		util_game.sortHash(pdSortHash[tmpEC+half]["C"],"reverse");
		util_game.sortHash(pdSortHash[tmpEC+half]["DRAW"],"positive");
		if(pdDataHash[ET_str+"pdMode"]=="choice" && choiceScore!=""){
			pdSortHash[tmpEC+half]["choice"] = choiceScore;
		}
        return true;
    }

	_self.getPDModel = function(ecid,tmpDiv,isHalf,strongMODEL,ET_str){
        var halfStr =  (isHalf == "Y")?"_H":"";
        var tmpHtml = tmpDiv;
		if(pdDataHash[ET_str+"pdMode"] == "choice"){
            tmpHtml = tmpHtml.replace(new RegExp("\\\*PD0\\\*","gi"), _self.transPDRtype(pdSortHash[ET_str+"ec"+ecid+halfStr]["choice"]));
        }else{
			var modelSet = new Object();
			modelSet["H"] = {"H":3,"DRAW":1,"C":1};
			modelSet["N"] = {"H":2,"DRAW":1,"C":2};
			modelSet["A"] = {"H":1,"DRAW":1,"C":3};
			var nowSet = modelSet[strongMODEL];
			var disPlayBtn = "none";
            for(var site in pdSortHash[ET_str+"ec"+ecid+halfStr]){
				if(site == "All" || site == "choice" )continue;
				//if(strongMODEL=="")continue;
                var tmpHash = pdSortHash[ET_str+"ec"+ecid+halfStr][site];
				var tmpLength = tmpHash.length;
				var rowNum = nowSet[site];
				if(tmpLength/rowNum > 5){
					disPlayBtn = "";
				}
                for(var no in tmpHash){
                    tmpHtml = tmpHtml.replace(new RegExp("\\\*"+ET_str+site+no+"_SHOW\\\*","gi"), "show");
                    tmpHtml = tmpHtml.replace(new RegExp("\\\*"+ET_str+site+"PD"+no+"_SCORE\\\*","gi"), tmpHash[no]);
                    tmpHtml = tmpHtml.replace(new RegExp("\\\*"+site+"PD"+no+"\\\*","gi"), _self.transPDRtype(tmpHash[no]));
                }
            }
			tmpHtml = tmpHtml.replace(new RegExp("\\\*DISPLAYBTN\\\*","gi"), disPlayBtn);
        }
        tmpDiv = tmpHtml;
        return tmpDiv;
    }

	_self.transPDRtype = function(score){
        var ret = "";
        var splitScore = score.split("-");
        ret = "H"+splitScore[0]+"C"+splitScore[1];
        return ret;
    }

	_self.chgPDCourt = function(e,obj){
		var ET_str = obj.ET_str;
		pdDataHash[ET_str+"Court"] = obj.court;
		var FT_wtype = obj.pdAry[0].toUpperCase();
		var HT_wtype = obj.pdAry[1].toUpperCase();
		showMoreAry[ET_str+FT_wtype] = false;
		showMoreAry[ET_str+HT_wtype] = false;
		var FT_icon = dom.getElementById(ET_str+"icon_FT_"+obj.ecid);
		var HT_icon = dom.getElementById(ET_str+"icon_HT_"+obj.ecid);
		if(obj.court=="HT"){
			FT_icon.classList.remove("on");
			HT_icon.classList.add("on");
			_self.parseTmpDataProc(obj);
		}else if(obj.court=="FT"){
			HT_icon.classList.remove("on");
			FT_icon.classList.add("on");
			_self.parseTmpDataProc(obj);
		}
    }

	_self.chgPDMode = function(e,obj){
		var ET_str = obj.ET_str;
		_self.showPDLoading(true,ET_str);
		pdDataHash[ET_str+"pdMode"] = obj.chgMode;
		var FT_wtype = obj.pdAry[0].toUpperCase();
		var HT_wtype = obj.pdAry[1].toUpperCase();
		showMoreAry[ET_str+FT_wtype] = false;
		showMoreAry[ET_str+HT_wtype] = false;
		var mode_all = get(ET_str+"tab_pd_all");
		var mode_choice = get(ET_str+"tab_pd_choice");
		var FT_icon = dom.getElementById(ET_str+"icon_FT_"+obj.ecid);
		var HT_icon = dom.getElementById(ET_str+"icon_HT_"+obj.ecid);
		var hgid = obj.hgid;
		//if(obj.chgMode == "choice"){
			if(top["bet_select"]["ec_"+ecid]){
				var rtype = top["bet_select"]["ec_"+ecid].split("_")[3];
				var bet_gid = top["bet_select"]["ec_"+ecid].split("_")[1];
				var isHalfIor = rtype.match(/^HR?H[1-2]?[0-9]C[1-2]?[0-9]/);
				if((isHalfIor && hgid==bet_gid && !pdDataHash[ET_str+"ht_allzero"]) || clickHeadfilter=="Halves" || pdDataHash[ET_str+"ft_allzero"]){
					pdDataHash[ET_str+"Court"] = "HT";
					FT_icon.classList.remove("on");
					HT_icon.classList.add("on");
					obj.wtype = HT_wtype;
				}else{
					pdDataHash[ET_str+"Court"] = "FT";
					HT_icon.classList.remove("on");
					FT_icon.classList.add("on");
					obj.wtype = FT_wtype;
				}
			}else{
				if((pdDataHash[ET_str+"sw_"+FT_wtype]=="Y" && !pdDataHash[ET_str+"ft_allzero"]) && clickHeadfilter!="Halves"){
					pdDataHash[ET_str+"Court"] = "FT";
					HT_icon.classList.remove("on");
					FT_icon.classList.add("on");
					obj.wtype = FT_wtype;
				}else if(pdDataHash[ET_str+"sw_"+HT_wtype]=="Y" && !pdDataHash[ET_str+"ht_allzero"]){
					pdDataHash[ET_str+"Court"] = "HT";
					FT_icon.classList.remove("on");
					HT_icon.classList.add("on");
					obj.wtype = HT_wtype;
				}
			}
			mode_all.classList.remove("on");
			mode_choice.classList.add("on");
			_self.parseTmpDataProc(obj);
	}

	_self.getPDLayer =function(_pd_strong,pd_wtype,ET_str){
		var _model ="";
		var strong = "";
		if(pdDataHash[ET_str+"pdMode"]=="choice"){
			_model = get(ET_str+"model_"+pd_wtype+"_CHOOSE").cloneNode(true);
			strong = "CHOOSE";
		}else{
			switch(_pd_strong){
				case "H":
					_model = get(ET_str+"model_"+pd_wtype+"_HOST").cloneNode(true);
					strong = "HOST";
					break;
				case "A":
					_model = get(ET_str+"model_"+pd_wtype+"_CUSTOMER").cloneNode(true);
					strong = "CUSTOMER";
					break;
				case "N":
					_model = get(ET_str+"model_"+pd_wtype+"_DRAW").cloneNode(true);
					strong = "DRAW";
					break;
				default:
					_model = get(ET_str+"model_"+pd_wtype+"_DRAW").cloneNode(true);
					break;
			}
		}
		return _model;
	}

	_self.parseTmpDataProc = function(obj){
		var ET_str = obj.ET_str;
        var ecid = pdDataHash[ET_str+"ecid"];
        var model = pdDataHash[ET_str+"Court"];
		var PDwtype = obj.wtype;
		var chgCourt = obj.chgCourt;
        var isHalf = (pdDataHash[ET_str+"isHalf"]=="Y"&&model=="HT")?"Y":"N";
        var halfStr =  (isHalf == "Y")?"_H":"";
		var _key = (model=="HT")?pdDataHash[ET_str+"hgid"]:pdDataHash[ET_str+"gid"];
        var strongMODEL = (isHalf == "N")?pdDataHash[ET_str+"pd_strong"]:pdDataHash[ET_str+"hpd_strong"];
		var div_pdMenu = get(ET_str+"model_PD_menu").innerHTML;
		var div_pdData = _self.getPDLayer(strongMODEL,PDwtype,ET_str);
        var tmpLayer = div_pdMenu+div_pdData.innerHTML;
		var RBstr = (pdDataHash[ET_str+"is_rb"]=="Y")?"R":"";
        var ratioObj = dom.getElementById("body_"+RBstr+"PD_"+pdDataHash[ET_str+"mode"]+"_"+ecid);
        var rAry = pdHeadHash[ET_str+"ec"+ecid+halfStr];

		tmpLayer = tmpLayer.replace(new RegExp("\\\*TEAM_H\\\*","gi"), util_game.showTxt(pdDataHash[ET_str+"team_h"]));
		tmpLayer = tmpLayer.replace(new RegExp("\\\*TEAM_C\\\*","gi"), util_game.showTxt(pdDataHash[ET_str+"team_c"]));
		tmpLayer = tmpLayer.replace(new RegExp("\\\*ECID\\\*","gi"), util_game.showTxt(pdDataHash[ET_str+"ecid"]));
		if(clickHeadfilter=="Halves")tmpLayer = tmpLayer.replace(new RegExp("\\\*FULL_SW\\\*","gi"), "none");
		if(isChgPDMode)tmpLayer = tmpLayer.replace(new RegExp("\\\*pd_loading_css\\\*","gi"), "pd_loading_on");
		if(pdDataHash[ET_str+"pdMode"] == "choice"){
			var nowScore = "0-0";
			if(chgCourt == "Y"){
				if(top["bet_select"]["ec_"+ecid]){
					var rtype = top["bet_select"]["ec_"+ecid].split("_")[3];
					var bet_gid = top["bet_select"]["ec_"+ecid].split("_")[1];
					var isPDrtype = rtype.match(/^H?R?H[1-2]?[0-9]C[1-2]?[0-9]/);
					if(isPDrtype && bet_gid==_key){
						nowScore = rtype.replace(/R/,"").replace(/H/,"").replace(/H/,"").replace(/C/,"-");
						if(!util.in_array(nowScore,pdSortHash[ET_str+"ec"+ecid+halfStr]["All"])){
							if(pdDataHash[ET_str+"scoreH"]+"" != "" && pdDataHash[ET_str+"scoreC"]+"" != ""){
								nowScore = pdDataHash[ET_str+"scoreH"]+"-"+pdDataHash[ET_str+"scoreC"];
							}
						}
					}else{
						if(pdDataHash[ET_str+"scoreH"]+"" != "" && pdDataHash[ET_str+"scoreC"]+"" != ""){
							nowScore = pdDataHash[ET_str+"scoreH"]+"-"+pdDataHash[ET_str+"scoreC"];
						}
					}
				}else{
					if(pdDataHash[ET_str+"scoreH"]+"" != "" && pdDataHash[ET_str+"scoreC"]+"" != ""){
						nowScore = pdDataHash[ET_str+"scoreH"]+"-"+pdDataHash[ET_str+"scoreC"];	
					}
				}
			}else{
				if(pdSortHash[ET_str+"ec"+ecid+halfStr] && pdSortHash[ET_str+"ec"+ecid+halfStr]["choice"] != ""){
					nowScore = pdSortHash[ET_str+"ec"+ecid+halfStr]["choice"];
				}
			}
			
			var targetRtype = pdDataHash[ET_str+"pd_rtypes"];
			if(model == "HT"){
				targetRtype = pdDataHash[ET_str+"hpd_rtypes"];
				tmpLayer = tmpLayer.replace(new RegExp("\\\*GID\\\*", "gi"), pdDataHash[ET_str+"hgid"]);
			}else{
				tmpLayer = tmpLayer.replace(new RegExp("\\\*GID\\\*", "gi"), pdDataHash[ET_str+"gid"]);
			}
			var splitScore = nowScore.split("-");
			var newHScore = splitScore[0];
			var newCScore = splitScore[1];
			tmpLayer = tmpLayer.replace(new RegExp("\\\*SCORE_H\\\*", "gi"), newHScore);
			tmpLayer = tmpLayer.replace(new RegExp("\\\*SCORE_C\\\*", "gi"), newCScore);
			_self.setpdDataHash("ec"+ecid,targetRtype,isHalf,pdDataHash[ET_str+"is_rb"],nowScore,ET_str);
		}else{
			if(isHalf=="Y"){
				_self.setpdDataHash("ec"+ecid,pdDataHash[ET_str+"hpd_rtypes"],"Y",pdDataHash[ET_str+"is_rb"],"",ET_str);
				tmpLayer = tmpLayer.replace(new RegExp("\\\*GID\\\*", "gi"), pdDataHash[ET_str+"hgid"]);
			}else{
				_self.setpdDataHash("ec"+ecid,pdDataHash[ET_str+"pd_rtypes"],"N",pdDataHash[ET_str+"is_rb"],"",ET_str);
				tmpLayer = tmpLayer.replace(new RegExp("\\\*GID\\\*", "gi"), pdDataHash[ET_str+"gid"]);
			}
		}
		if(pdDataHash[ET_str+"ht_allzero"]){
			tmpLayer = tmpLayer.replace(new RegExp("\\\*HALF_SW\\\*","gi"), "none");
			if(model == "HT")tmpLayer = tmpLayer.replace(new RegExp("\\\*ALLZERO\\\*", "gi"), "no_event_pd");
		}
		if(pdDataHash[ET_str+"ft_allzero"]){//&& model == "FT"
			tmpLayer = tmpLayer.replace(new RegExp("\\\*FULL_SW\\\*","gi"), "none");
			if(model == "FT")tmpLayer = tmpLayer.replace(new RegExp("\\\*ALLZERO\\\*", "gi"), "no_event_pd");
		}
		tmpLayer = _self.getPDModel(ecid,tmpLayer,isHalf,strongMODEL,ET_str);
        var tmpHTML = tmpLayer;
		tmpHTML = _self.initIorBtn(tmpHTML,obj.game,PDwtype,ET_str);
        ratioObj.innerHTML = tmpHTML;
        util_game.initSelect(util);
        var _xmdObj = new Object();
        _xmdObj["ec"] = _xmlnode.Node(_xmlnode.Root[0],"ec", false);
		var tmp_ec = _xmdObj["ec"];
		var ECID = pdDataHash[ET_str+"ecid"];
		var tmpObj = new Array();
		tmpObj[0] = tmp_ec;
		var game = _xmlnode.Node(_xmlnode.Root[0],"game", false);
		var nowGID = (isHalf == "Y")?pdDataHash[ET_str+"hgid"]:pdDataHash[ET_str+"gid"];
		_self.addBetClick(pdDataHash[ET_str+"clickHash"]);
		if(pdDataHash[ET_str+"pdMode"] == "choice")_self.chkPDLimit(ECID,nowGID,ET_str);
		if(isChgPDMode)_self.showPDLoading(false,ET_str);
		_self.initPDbtn(ECID,game,obj.hasEC);
    }

	_self.initIorBtn = function(div_model,tmpObj,wtype,ET_str){
		var ecid = pdDataHash[ET_str+"ecid"];
		var rtypes="";
		var gObj=tmpObj;
		if(wtype=="PD" || wtype=="RPD"){
			rtypes=pdIorHead[ET_str+"ec"+ecid];
		}else if(wtype=="HPD" || wtype=="HRPD"){
			rtypes=pdIorHead[ET_str+"ec"+ecid+"_H"];
		}
		for(var k=0; k<rtypes.length; k++){
			var rtype = rtypes[k];
			if(showtype == "parlay"){	
				var ior = xmlnode.Node(gObj,"ior_"+util_game.transRtype2P(rtype)).innerHTML;
			}else{
				var ior = xmlnode.Node(gObj,"ior_"+rtype).innerHTML;
				ior = _self.chgOddIor(xmlnode,gObj, wtype, rtype, ior);
			}
			ior_wtype = wtype;
			ior = ratioChg.chgRatio(ior,ior_wtype);
			var rtypeClose = (ior*1==0);
			var close_css = rtypeClose ? "lock" : "";
			var _CHOICE = rtype.substr(rtype.length-1, 1);
			if(util_game.checkWtypeIsF(wtype) || util_game.checkWtypeIsRF(wtype)) div_model = div_model.replace(new RegExp("\\\*RTYPE_"+_CHOICE+"\\\*","gi"), util_game.showTxt(rtype));
			div_model = div_model.replace(new RegExp("\\\*IORATIO_"+rtype+"\\\*","gi"), util_game.showTxt(ior));
			div_model = div_model.replace(new RegExp("\\\*CLOSE_"+rtype+"\\\*","gi"), util_game.showTxt(close_css));
		}
		return div_model;
	}

	_self.chkPDLimit = function(ecid,gid,ET_str){
        var halfStr = (pdDataHash[ET_str+"Court"]=="HT")?"_H":"";
        var allObj = pdSortHash[ET_str+"ec"+ecid+halfStr]["All"];
        var nowScore = pdSortHash[ET_str+"ec"+ecid+halfStr]["choice"];
        var splitNowScore = nowScore.split("-");
        var HScore = splitNowScore[0];
        var CScore = splitNowScore[1];
        var forecastAddHScore = HScore*1+1;
        var forecastAddCScore = CScore*1+1;
        var forecastMinusHScore = HScore*1-1;
        var forecastMinusCScore = CScore*1-1;
        var filterTabAry = Array(forecastAddHScore+"-"+CScore , HScore+"-"+forecastAddCScore , forecastMinusHScore+"-"+CScore , HScore+"-"+forecastMinusCScore);
        var btnIDAry = Array(ET_str+"H_plus_"+gid , ET_str+"C_plus_"+gid , ET_str+"H_minus_"+gid , ET_str+"C_minus_"+gid);
        var result = new Array();

        for(var t = 0;t < filterTabAry.length;t++){
			tmpScore = filterTabAry[t];
			result = allObj.indexOf(tmpScore);
			if(result == -1){
				dom.getElementById(btnIDAry[t]).disabled = true;
			}
        }
    }

	_self.clickPDCal = function(e,obj){
		var ecid = obj.ecid;
		var id = obj.id;
		var ET_str = obj.ET_str;
		id = id.replace(ET_str,"");
		var gid = id.split("_")[2];
		var hostVal = dom.getElementById(ET_str+"H_val_"+gid).value;
		var CustomerVal = dom.getElementById(ET_str+"C_val_"+gid).value;
		var model = pdDataHash[ET_str+"Court"];
		var halfStr = (model == "HT")?"_H":"";
		var nowScore = pdSortHash[ET_str+"ec"+ecid+halfStr]["choice"];
		var splitScore = nowScore.split("-");
		var hostScore = splitScore[0]*1;
		var customerScore = splitScore[1]*1;
		if(id.match(/plus/)){
			if(id.substr(0,1) == "C"){
				customerScore += 1;
				CustomerVal = customerScore;
			}else{
				hostScore += 1;
				hostVal = hostScore;
			}
		}else{
			if(id.substr(0,1) == "C"){
				customerScore -= 1;
				CustomerVal = customerScore;
			}else{
				hostScore -= 1;
				hostVal = hostScore;
			}
		}
		nowScore = hostScore + "-" + customerScore;
		pdSortHash[ET_str+"ec"+ecid+halfStr]["choice"] = nowScore;
		//console.log("pdSortHash[ET_str+ec"+ecid+halfStr+"] choice 新比分 = ",nowScore);
		_self.parseTmpDataProc(obj);
	}

	_self.showAnalysis = function(e,par){
		_self.setAnalysisBtnLight(true);
		parentClass.dispatchEvent("showAnalysis",par);
	}

	_self.showAnalysisBtn = function(sw){
		var statObj = dom.getElementById("statistics");
        if(statObj){
			statObj.style.display = (sw && scoreType != "N/A")?"":"none";
			var clickObj = dom.getElementById("statistics_btn");
			if(sw){
				util.addEvent(clickObj, "click", _self.showAnalysis ,{"gtype":gtype,"peid":peid,"showtype":showtype,"scoreType":scoreType});
			}
		}
		
    }

	_self.setAnalysisBtnLight = function(light){
		if(dom.getElementById("statistics_btn")){
			util.removeClass(dom.getElementById("statistics_btn"),"on");
			if(light)util.addClass(dom.getElementById("statistics_btn"),"on");
		}
	}

	_self.upAnalysis_status = function(status){
		nowAnalysisStatus = status;
		_self.setAnalysisBtnLight(nowAnalysisStatus);
	}

	_self.updateAnalysisScore = function(obj){
        if(nowAnalysisStatus)parentClass.dispatchEvent("updateAnalysisScore", { "scoreObj": obj});
    }

	_self.clusterizeDestroy = function(){
		clusterize.destroy();
		clusterize = null;
	}

	_self.hideFilter = function(limit){
        if(limit == 0)_self.hideFilterTab("Match");
        for(var l=7;l>limit;l--){
            _self.hideFilterTab("G"+l);
        }
    }

	_self.getGameLimit = function(mode){
        var modeAry = new Object();
        modeAry["Best of 1"] = 0;
        modeAry["Best of 2"] = 2;
        modeAry["Best of 3"] = 3;
        modeAry["Best of 4"] = 4;
        modeAry["Best of 5"] = 5;
        modeAry["Best of 7"] = 7;
        modeAry["Best of 9"] = 7;
        modeAry["Best of 11"] = 7;
        modeAry["First to 2"] = 0;
        modeAry["First to 3"] = 0;
        modeAry["First to 4"] = 0;
        modeAry["First to 5"] = 0;
        modeAry["N/A"] = 0;
        var ret = modeAry[mode];
        // console.log("gameLimit = ",ret);
        return ret;
    }
}
