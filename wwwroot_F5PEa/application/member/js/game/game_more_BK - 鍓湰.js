function game_more_BK(_win, _dom, _post){ //extends game_more
    var classname = "game_more_BK";
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var util;
    var util_game;
    var tv;
    var mt;
    var LS_game;
    var _xmlnode;
    var scDataObj;
    var over1024 = (getView().viewportwidth >= 1024);
    var util_game = new win.Util_game(win,dom);

    var wtypeFun = new Object();
    var rtypeFun = new Object();
    
    var wtypeHash = new Array();
    var rtypeHash = new Object();

    var showtype = postHash["showtype"];
    var def_league = postHash["league"];
    var def_team_h = postHash["team_h"];
    var def_team_c = postHash["team_c"];
    var def_retime = postHash["retime"];
    var def_datetime = postHash["datetime"];

    var hasRightPanel = false;
    var score_H_FT = "";
    var score_A_FT = "";
    var t_count = "";
    var se_now_end_str = "";//最後節數狀態

    //console.log(postHash, "game_more_BK");
    
    _self.init = function(){
        LS_game = eval("new LS_game_"+ls+"();");
        LS_game.init();
        _self.initFun();
        _self.getHash();
        _self.reInit(_self, classname, wtypeHash, rtypeHash, _self.getDataComplete, _self.getXmlNode);
    
        parentClass = _self._super.parentClass;
        util = _self._super.util;
        util_game = _self._super.util_game;
        tv = _self._super.tv;
        mt = _self._super.mt;

    }

    _self.initFun = function(){
        wtypeFun["live"] = _self.getWtypeRB;
        wtypeFun["today"] = _self.getWtypeFT;
        wtypeFun["early"] = wtypeFun["today"];
        wtypeFun["parlay"] = wtypeFun["today"];

        rtypeFun["live"] = _self.getRtypeRB;
        rtypeFun["today"] = _self.getRtypeFT;
        rtypeFun["early"] = rtypeFun["today"];
        rtypeFun["parlay"] = rtypeFun["today"];
    }

    _self.getHash = function(){
        try{
            wtypeHash = wtypeFun[showtype]();
            rtypeHash = rtypeFun[showtype]();
        }catch(e){}
    }

    _self.getWtypeRB = function(){
        var ary = new Object();
        ary["FT"] = _self.getWtypeRB_FT();
        return ary;
    }

    _self.getWtypeFT = function(){
        var ary = new Object();
        ary["FT"] = _self.getWtypeFT_FT();
        return ary;
    }

    _self.getWtypeRB_FT = function(){
        var ary = new Array();
        ary.push("0_RE");
        ary.push("0_ROU");
        ary.push("0_ROUH");
        ary.push("0_ROUC");
        ary.push("1_RE");
        ary.push("1_ROU");
        ary.push("1_ROUH");
        ary.push("1_ROUC");
        ary.push("3_RE");
        ary.push("3_ROU");
        ary.push("3_ROUH");
        ary.push("3_ROUC");
        ary.push("4_RE");
        ary.push("4_ROU");
        ary.push("4_ROUH");
        ary.push("4_ROUC");
        ary.push("5_RE");
        ary.push("5_ROU");
        ary.push("5_ROUH");
        ary.push("5_ROUC");
        ary.push("6_RE");
        ary.push("6_ROU");
        ary.push("6_ROUH");
        ary.push("6_ROUC");
        ary.push("2_RE");
        ary.push("2_ROU");
        ary.push("2_ROUH");
        ary.push("2_ROUC");

        ary.push("0_RM");
        ary.push("1_RM");
        ary.push("2_RM");
        ary.push("3_RM");
        ary.push("4_RM");
        ary.push("5_RM");
        ary.push("6_RM");

        ary.push("0_REO");
        ary.push("1_REO");   
        ary.push("2_REO");  
        ary.push("3_REO");
        ary.push("4_REO");
        ary.push("5_REO");
        ary.push("6_REO");

        ary.push("0_RPDH");
        ary.push("0_RPDC");

        return ary;
    }    

    _self.getRtypeRB = function(){
        var ary = new Object();
        ary["RE"] = new Array("REH","REC");
		ary["ROU"] = new Array("ROUH","ROUC");		
		ary["ROUH"] = new Array("ROUHO","ROUHU");
		ary["ROUC"] = new Array("ROUCO","ROUCU");
		ary["RPDH"] = new Array("RPDH0","RPDH1","RPDH2","RPDH3","RPDH4");
		ary["RPDC"] = new Array("RPDC0","RPDC1","RPDC2","RPDC3","RPDC4");
		ary["RM"] = new Array("RMH","RMC");
		ary["REO"] = new Array("REOO","REOE");
        return ary;
    }

    _self.getWtypeFT_FT = function(){
        var ary = new Array();
        ary.push("0_R");
        ary.push("0_OU");
        ary.push("0_OUH");
        ary.push("0_OUC");
        ary.push("1_R");
        ary.push("1_OU");
        ary.push("1_OUH");
        ary.push("1_OUC");
        ary.push("3_R");
        ary.push("3_OU");
        ary.push("3_OUH");
        ary.push("3_OUC");
        ary.push("4_R");
        ary.push("4_OU");
        ary.push("4_OUH");
        ary.push("4_OUC");
        ary.push("5_R");
        ary.push("5_OU");
        ary.push("5_OUH");
        ary.push("5_OUC");
        ary.push("6_R");
        ary.push("6_OU");
        ary.push("6_OUH");
        ary.push("6_OUC");
        ary.push("2_R");
        ary.push("2_OU");
        ary.push("2_OUH");
        ary.push("2_OUC");

        ary.push("0_M");
        ary.push("1_M");
        ary.push("2_M");
        ary.push("3_M");
        ary.push("4_M");
        ary.push("5_M");
        ary.push("6_M");

        ary.push("0_EO");        
        ary.push("1_EO");   
        ary.push("2_EO"); 
        ary.push("3_EO");
        ary.push("4_EO");
        ary.push("5_EO");
        ary.push("6_EO");

        ary.push("0_PDH");
        ary.push("0_PDC");
        return ary;
    }

    _self.getRtypeFT = function(){
        var ary = new Object();
        ary["R"] = new Array("RH","RC");
		ary["OU"] = new Array("OUH","OUC");		
		ary["OUH"] = new Array("OUHO","OUHU");
		ary["OUC"] = new Array("OUCO","OUCU");
		ary["PDH"] = new Array("PDH0","PDH1","PDH2","PDH3","PDH4");
		ary["PDC"] = new Array("PDC0","PDC1","PDC2","PDC3","PDC4");
		ary["M"] = new Array("MH","MC");
		ary["EO"] = new Array("EOO","EOE");
        return ary;
    }

    _self.getXmlNode = function(){
        return _xmlnode;
    }

	_self.getDataComplete = function(xml, OuterOpen){ 
        //console.log(OuterOpen,"[BK][OuterOpen]");       
        parentClass.dispatchEvent("showLoading", { "isShow": false });
		_self.paramHash["errorMsg"] = util.showConnectMsg(xml);
		if(util.alertConnectMsg(_self.paramHash["errorMsg"]))  return;
		
		var xmdObj = new Object();
		xmlnode = util.parseXml(xml);
        _xmlnode = xmlnode;
        _self.setXML(xmlnode);

		var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
        var game = xmlnode.Node(xmlnode.Root[0],"game", false);
        if(code == "Its not special"){
			//非特殊賽事,秀狗圖
			_self.checkHasGame(false);
		}
		else if(code=="615"){
            
			var mainGame = null;
			var hasGame = false;
			var _id,gdata;
			
			// echo("game.length="+game.length);
			if(game.length > 0){
				var gidHash = new Object();

				for(var i=0; i<game.length; i++){   
                    var tmp = xmlnode.Node(game[i], "ms").innerHTML;
                    var gidm = xmlnode.Node(game[i],"gidm").innerHTML;
                    var ms = (tmp!="" && tmp!=null)?tmp.split("_")[1]:"0";                
                    gdata = game[i];
                    _id = gdata.getAttribute("id");

					if(gidHash[ms]==null){
						gidHash[ms] = new Array();
                    }
					gidHash[ms].push(_id);

				}//end for i
	
                mainGame = game[0];
                if(showtype=="live")top.resize_mainGame = mainGame;

                var intoRB = _self.checkIntoRB(xmlnode, mainGame);
				if(intoRB) return;

                var gopen = xmlnode.Node(game[0], "gopen").innerHTML;
                var Live = xmlnode.Node(game[0],"Live").innerHTML;
                scDataObj = _self.setScoreBoard(mainGame, showtype, gopen, Live, OuterOpen, LS_game);//2020-11-26 Ricky 補 LS_game
                _self.setObj(scDataObj);
                _self.parseScoreBoard(scDataObj);
                //_self.parseScoreBoard(nowMode, mainGame, showtype, gopen, Live, OuterOpen);

				if(showtype=="live"){
                    if(getView().viewportwidth >= 1024){
                        parentClass.dispatchEvent("parseRightScoreBoard", scDataObj);
                        parentClass.dispatchEvent("checkRightLive", {"xmlnode":xmlnode, "mainGame":mainGame});//call right panel show TV
                        parentClass.dispatchEvent("setRightLoading", {"isShow":false});
					}else{
						_self.checkLive(xmlnode, mainGame, tv, mt);
					}
				}

                hasGame = _self.parseData(gidm, "FT", gidHash, game);

				_self.setScrollToTop();
				
            }else{// game.length = 0，只parse聯盟＆隊名
                // console.log("game.length = 0");
                get("league").innerHTML = util_game.showTxt(def_league);		
                get("team_h").innerHTML = util_game.showTxt(def_team_h);
                get("team_c").innerHTML = util_game.showTxt(def_team_c);
                //console.log("結算賽果");
                get("midfield").style.display ="none";
                if(showtype == "live"){
                    get("se_now").innerHTML = util_game.showTxt(se_now_end_str);
                    //2294.全球類滾球-內層盤面-從內層切到其他畫面ex:交易狀況，等到賽事收掉且key完賽果後 再次點擊控制板的“體育”和上一頁，聯盟和隊伍名稱會空白，記分板會顯示出所有節數 (同c1 bug 774)
                    //>>>只要在內層關盤結算 計分板時間就會多出現一行
                    get("t_count").innerHTML = util_game.showTxt(t_count);
                    get("sc_FT_H").innerHTML = util_game.showTxt(score_H_FT);
                    get("sc_FT_A").innerHTML = util_game.showTxt(score_A_FT);
                    if(score_H_FT==""){  //key賽果後 進入內層
                        get("box_sco_bk").style.display="none";
                        get("box_sco_point").style.display="none";
                    }else{     //留在內層 key賽果後 顯示
                        get("box_sco_bk").style.display="";
                        get("box_sco_point").style.display="";
                    }
                }else{
                    get("game_time").innerHTML = util_game.showTxt(def_datetime);
                }

                var eventid_ph = xmlnode.Node(xmlnode.Root[0],"eventid_phone").innerHTML;
                var center_tv = xmlnode.Node(xmlnode.Root[0],"center_tv").innerHTML;
                if(getView().viewportwidth >= 1024){
					//parentClass.dispatchEvent("resetRightTV", {});
                    //parentClass.dispatchEvent("setRightVisible", {"isShow":false});
                    parentClass.dispatchEvent("noGameCheckLive", {"eventid_ph":eventid_ph, "center_tv":center_tv});
				}else{

					_self.checkLiveProc(eventid_ph, center_tv, "", "", "", tv, mt);

					// var showTV = (eventid_ph!="" && typeof eventid_ph!="undefined");
					// tv.setVariable({"center_tv":center_tv,"token":eventid_ph});
					// tv.setVisible(showTV);
					// mt.onlyTV();
                }
            }//end if game
            
			_self.checkHasGame(hasGame);
		
        }
        if(top.choice_showtype=="live"||top.choice_showtype=="parlay"||((top.choice_showtype=="today"||top.choice_showtype=="early")&&top.choice_rtype!="fs")){
            util.addEvent(get("relating_box"), "click", _self.showRelateInfo);
            get("relating_box").style.display = "";
        }

		parentClass.dispatchEvent("showLoading", { "isShow": false });
    }
    
	_self.setScoreBoard = function(mainGame, showtype, gopen, Live, OuterOpen, LS_game){//2020-11-26 Ricky 補 LS_game
		if(mainGame!=null){
			var league = xmlnode.Node(mainGame,"league").innerHTML;
			var midfield = xmlnode.Node(mainGame,"midfield").innerHTML;		
			var team_h = xmlnode.Node(mainGame,"team_h").innerHTML;
            var team_c = xmlnode.Node(mainGame,"team_c").innerHTML;
            var limit_min =  xmlnode.Node(mainGame,"limit_min").innerHTML; //過關串數顯示

            t_count = xmlnode.Node(mainGame,"t_count").innerHTML;
            if(isNaN(t_count)||t_count<0)t_count=0;
            var TimeM= Math.floor(t_count/60);
            var TimeS= t_count%60;
            if(TimeM<10)TimeM="0"+TimeM;
            if(TimeS<10)TimeS="0"+TimeS;
            t_count = TimeM+":"+TimeS

            //當前時節顯示
            var se_now = xmlnode.Node(mainGame,"se_now").innerHTML;
            var se_now_str = "";
            if(se_now == "HT") se_now_str = "1H";
            else if(se_now == "H2") se_now_str = "2H";
            else se_now_str = se_now;

            if(se_now)var se_num = se_now.substr(1,1)*1;
            if(se_now == "HT") se_num = 1;
            var se_type = xmlnode.Node(mainGame,"se_type").innerHTML;

            //全場分數
            score_H_FT = xmlnode.Node(mainGame,"sc_FT_H").innerHTML*1;
            score_A_FT = xmlnode.Node(mainGame,"sc_FT_A").innerHTML*1;

            var HalfTime = xmlnode.Node(mainGame,"HalfTime").innerHTML;

            var datetime = xmlnode.Node(mainGame,"datetime").innerHTML; //2019-11-04 23:59:00
            var tmpDate = datetime.split(" ")[0];//2019-11-04
            var tmpTime = datetime.split(" ")[1];//23:59:00
            var str_M = tmpDate.split("-")[1]; //11
            var str_D = tmpDate.split("-")[2]; //04
            var str_H = tmpTime.split(":")[0];//23
            var str_Min = tmpTime.split(":")[1]; //59
            var isToday = util_game.isToday(tmpDate);
            var newDatetime =(isToday)? str_H+":"+str_Min : str_D+" / "+str_M+"<b></b>"+str_H+":"+str_Min; // 04 / 11 23:59
            
            var obj = new Object();
            obj.mainGame = mainGame;
            obj.LS_game = LS_game;
            obj.gtype = "bk";
            obj.showtype = showtype;
            obj.gopen = gopen;
            obj.Live = Live;
            obj.league = league;
            obj.midfield = midfield;
            obj.team_h = team_h;
            obj.team_c = team_c;
            obj.def_league = def_league;
            obj.def_team_h = def_team_h;
            obj.def_team_c = def_team_c;
            obj.t_count = t_count;
            obj.se_now_str = se_now_str;
            obj.se_type = se_type;
            obj.se_now = se_now;
            obj.se_num = se_num;
            obj.score_H_FT = score_H_FT;
            obj.score_A_FT = score_A_FT;
            obj.HalfTime = HalfTime;
            obj.limit_min = limit_min;
            obj.OuterOpen = OuterOpen;
            obj.newDatetime = newDatetime;

            return obj;
        }
    } 

    _self.parseScoreBoard = function(obj){
		if(get("league"))get("league").innerHTML = (obj.league==null)?util_game.showTxt(obj.def_league):util_game.showTxt(obj.league);
        if(get("midfield")) get("midfield").style.display = (obj.midfield=="Y")? "" : "none";
        get("team_h").innerHTML = (obj.team_h==null)?util_game.showTxt(obj.def_team_h):util_game.showTxt(obj.team_h);
        get("team_c").innerHTML = (obj.team_c==null)?util_game.showTxt(obj.def_team_c):util_game.showTxt(obj.team_c);
        
        if(obj.gopen != "N" && obj.showtype == "parlay"){               
            if(get("game_parlay"))get("game_parlay").innerHTML = util_game.showTxt(obj.limit_min);
            if(get("showPLimit"))get("showPLimit").style.display="";
        }

        if(obj.showtype == "live"){
            if(obj.gopen == "N" && obj.Live == "N"){
                if(obj.OuterOpen){
                    get("box_scostate").style.display="none";
                    get("box_sco_bk").style.display="none";
                    get("box_sco_point").style.display="none";
                }
            }else{
                get("t_count").innerHTML = util_game.showTxt(obj.t_count);
                get("se_now").innerHTML = util_game.showTxt(obj.LS_game.get("BK_"+obj.se_now_str));

                if(obj.se_type == "Halves"){ //半場
                    if(obj.se_now == "OT") obj.se_num = 3;
                    var half_data = new Array("sc_H1","sc_H2","sc_OT");
                    //上、下半場分數
                    for(var c=0;c<half_data.length;c++){
                        if(get(half_data[c]+"_H").classList.contains("on"))get(half_data[c]+"_H").classList.remove("on");
                        if(get(half_data[c]+"_A").classList.contains("on"))get(half_data[c]+"_A").classList.remove("on");
                        if(get("320_"+half_data[c]).classList.contains("on"))get("320_"+half_data[c]).classList.remove("on");
                        var score_H = util_game.showTxt(xmlnode.Node(obj.mainGame,half_data[c]+"_H").innerHTML);
                        var score_A = util_game.showTxt(xmlnode.Node(obj.mainGame,half_data[c]+"_A").innerHTML);
                        if(c<obj.se_num){
                            get(half_data[c]+"_H").innerHTML = score_H;
                            get(half_data[c]+"_A").innerHTML = score_A;
                            get("320_"+half_data[c]+"_H").innerHTML = score_H;
                            get("320_"+half_data[c]+"_A").innerHTML = score_A;
                            get("320_"+half_data[c]).style.display = "";
                        }else{
                            get(half_data[c]+"_H").innerHTML = "";
                            get(half_data[c]+"_A").innerHTML = "";
                            get("320_"+half_data[c]+"_H").innerHTML = "";
                            get("320_"+half_data[c]+"_A").innerHTML = "";
                            get("320_"+half_data[c]).style.display = "none";
                        }
                    }

                }else{
                    if(obj.se_now == "OT") obj.se_num = 5;
                    var sc_data = new Array("sc_Q1","sc_Q2","sc_Q3","sc_Q4","sc_OT","sc_H1","sc_H2");
                    //時節、加時分數
                    for(var x=0;x<sc_data.length;x++){
                        if(get(sc_data[x]+"_H").classList.contains("on"))get(sc_data[x]+"_H").classList.remove("on");
                        if(get(sc_data[x]+"_A").classList.contains("on"))get(sc_data[x]+"_A").classList.remove("on");
                        if(get("320_"+sc_data[x]).classList.contains("on"))get("320_"+sc_data[x]).classList.remove("on");
                        var score_H = util_game.showTxt(xmlnode.Node(obj.mainGame,sc_data[x]+"_H").innerHTML);
                        var score_A = util_game.showTxt(xmlnode.Node(obj.mainGame,sc_data[x]+"_A").innerHTML);
                        if(x<obj.se_num){
                            get(sc_data[x]+"_H").innerHTML = score_H;
                            get(sc_data[x]+"_A").innerHTML = score_A;
                            get("320_"+sc_data[x]+"_H").innerHTML = score_H;
                            get("320_"+sc_data[x]+"_A").innerHTML = score_A;
                            get("320_"+sc_data[x]).style.display = "";
                        }else{
                            get(sc_data[x]+"_H").innerHTML = "";
                            get(sc_data[x]+"_A").innerHTML = "";
                            get("320_"+sc_data[x]+"_H").innerHTML = "";
                            get("320_"+sc_data[x]+"_A").innerHTML = "";
                            get("320_"+sc_data[x]).style.display = "none";
                        }
                    }
                    get("sc_H1_H").innerHTML = util_game.showTxt(xmlnode.Node(obj.mainGame,"sc_H1_H").innerHTML);
                    get("sc_H1_A").innerHTML = util_game.showTxt(xmlnode.Node(obj.mainGame,"sc_H1_A").innerHTML);
                    if(obj.se_num<=2){
                        get("sc_H2_H").innerHTML = "";
                        get("sc_H2_A").innerHTML = "";
                    }else{
                        get("sc_H2_H").innerHTML = util_game.showTxt(xmlnode.Node(obj.mainGame,"sc_H2_H").innerHTML);
                        get("sc_H2_A").innerHTML = util_game.showTxt(xmlnode.Node(obj.mainGame,"sc_H2_A").innerHTML);
                    }
                }

                get("sc_FT_H").innerHTML = util_game.showTxt(obj.score_H_FT);
                get("sc_FT_A").innerHTML = util_game.showTxt(obj.score_A_FT);

                if (obj.se_type == "Halves") { //半場模式
                    get("div_matches").classList.add("half");         
                }else{
                    if(get("div_matches").classList.contains("half"))get("div_matches").classList.remove("half");
                    if((obj.se_now == "Q1" || obj.se_now == "Q2") && obj.HalfTime != "Y"){
                        get("sc_H1_H").classList.add("on");
                        get("sc_H1_A").classList.add("on");
                    }else if((obj.se_now == "Q3" || obj.se_now == "Q4") && obj.HalfTime != "Y"){
                        get("sc_H2_H").classList.add("on");
                        get("sc_H2_A").classList.add("on");
                    } 
                }
            
                //當前節數亮色 aaaaaa
                alert("member");
                if(obj.se_now == "HT") obj.se_now = "H1";

                if(obj.HalfTime == "Y"){
                    se_now_end_str = obj.LS_game.get("BK_score_Half");
                    get("se_now").innerHTML = se_now_end_str;
                    get("t_count").innerHTML = "";
                }else{
                    if(get("sc_"+obj.se_now+"_H"))get("sc_"+obj.se_now+"_H").classList.add("on");
                    if(get("sc_"+obj.se_now+"_A"))get("sc_"+obj.se_now+"_A").classList.add("on");
                    if(get("320_sc_"+obj.se_now))get("320_sc_"+obj.se_now).classList.add("on");
                    if(obj.se_now == "OT")get("320_sc_H2").classList.add("on");                   
                }     
                
                if(top.resizePage!="home")get("div_matches").style.display = "";
            }                
        }else{
            // get("game_time").innerHTML = util_game.showTxt(obj.newDatetime);
        }
    }    

	_self.parseScoreBoard_old = function(nowMode, mainGame, showtype, gopen, Live, OuterOpen){
		if(mainGame!=null){
			var league = xmlnode.Node(mainGame,"league").innerHTML;
			var midfield = xmlnode.Node(mainGame,"midfield").innerHTML;		
			var team_h = xmlnode.Node(mainGame,"team_h").innerHTML;
            var team_c = xmlnode.Node(mainGame,"team_c").innerHTML;

			get("league").innerHTML = (league==null)?util_game.showTxt(def_league):util_game.showTxt(league);		
			get("midfield").style.display = (midfield=="Y")? "" : "none";
			get("team_h").innerHTML = (team_h==null)?util_game.showTxt(def_team_h):util_game.showTxt(team_h);
			get("team_c").innerHTML = (team_c==null)?util_game.showTxt(def_team_c):util_game.showTxt(team_c);
            
            
            //過關串數顯示
            if(gopen != "N" && top.choice_showtype == "parlay"){
                var limit_min =  xmlnode.Node(mainGame,"limit_min").innerHTML;
                get("game_parlay").innerHTML = util_game.showTxt(limit_min);
                get("showPLimit").style.display="";
            }

			if(showtype == "live"){
                if(gopen == "N" && Live == "N"){
                    //console.log("dont parse ScoreBoard");
                    if(OuterOpen){
                        //console.log("is OuterOpen");
                        get("box_scostate").style.display="none";
                        get("box_sco_bk").style.display="none";
                        get("box_sco_point").style.display="none";
                    }
                    //get("sc_game_H").innerHTML = "";
                    //get("sc_game_A").innerHTML = "";
                }else{
                    t_count = xmlnode.Node(mainGame,"t_count").innerHTML;
                    if(isNaN(t_count)||t_count<0)t_count=0;
                    var TimeM= Math.floor(t_count/60);
                    var TimeS= t_count%60;
                    if(TimeM<10)TimeM="0"+TimeM;
                    if(TimeS<10)TimeS="0"+TimeS;
                    t_count = TimeM+":"+TimeS
                    get("t_count").innerHTML = util_game.showTxt(t_count);

                    //當前時節顯示
                    var se_now = xmlnode.Node(mainGame,"se_now").innerHTML;
                    var se_now_str = "";
                    if(se_now == "HT") se_now_str = "1H";
                    else if(se_now == "H2") se_now_str = "2H";
                    else se_now_str = se_now;
                    se_now_end_str = util_game.showTxt(LS_game.get("BK_"+se_now_str));
                    get("se_now").innerHTML = se_now_end_str;

                    var sc_data = new Array("sc_Q1","sc_Q2","sc_Q3","sc_Q4","sc_OT","sc_H1","sc_H2");
                    var half_data = new Array("sc_H1","sc_H2","sc_OT");
                    var se_num = se_now.substr(1,1)*1;
                    if(se_now == "HT") se_num = 1;
                    var se_type = xmlnode.Node(mainGame,"se_type").innerHTML;

                    if(se_type == "Halves"){ //半場
                        if(se_now == "OT") se_num = 3;
                        //上、下半場分數
                        for(var c=0;c<half_data.length;c++){
                            if(get(half_data[c]+"_H").classList.contains("on"))get(half_data[c]+"_H").classList.remove("on");
                            if(get(half_data[c]+"_A").classList.contains("on"))get(half_data[c]+"_A").classList.remove("on");
                            if(get("320_"+half_data[c]).classList.contains("on"))get("320_"+half_data[c]).classList.remove("on");
                            var score_H = util_game.showTxt(xmlnode.Node(mainGame,half_data[c]+"_H").innerHTML);
                            var score_A = util_game.showTxt(xmlnode.Node(mainGame,half_data[c]+"_A").innerHTML);
                            if(c<se_num){
                                get(half_data[c]+"_H").innerHTML = score_H;
                                get(half_data[c]+"_A").innerHTML = score_A;
                                get("320_"+half_data[c]+"_H").innerHTML = score_H;
                                get("320_"+half_data[c]+"_A").innerHTML = score_A;
                                get("320_"+half_data[c]).style.display = "";
                            }else{
                                get(half_data[c]+"_H").innerHTML = "";
                                get(half_data[c]+"_A").innerHTML = "";
                                get("320_"+half_data[c]+"_H").innerHTML = "";
                                get("320_"+half_data[c]+"_A").innerHTML = "";
                                get("320_"+half_data[c]).style.display = "none";
                            }
                        }

                    }else{
                        if(se_now == "OT") se_num = 5;
                        //時節、加時分數
                        for(var x=0;x<sc_data.length;x++){
                            if(get(sc_data[x]+"_H").classList.contains("on"))get(sc_data[x]+"_H").classList.remove("on");
                            if(get(sc_data[x]+"_A").classList.contains("on"))get(sc_data[x]+"_A").classList.remove("on");
                            if(get("320_"+sc_data[x]).classList.contains("on"))get("320_"+sc_data[x]).classList.remove("on");
                            var score_H = util_game.showTxt(xmlnode.Node(mainGame,sc_data[x]+"_H").innerHTML);
                            var score_A = util_game.showTxt(xmlnode.Node(mainGame,sc_data[x]+"_A").innerHTML);
                            if(x<se_num){
                                get(sc_data[x]+"_H").innerHTML = score_H;
                                get(sc_data[x]+"_A").innerHTML = score_A;
                                get("320_"+sc_data[x]+"_H").innerHTML = score_H;
                                get("320_"+sc_data[x]+"_A").innerHTML = score_A;
                                get("320_"+sc_data[x]).style.display = "";
                            }else{
                                get(sc_data[x]+"_H").innerHTML = "";
                                get(sc_data[x]+"_A").innerHTML = "";
                                get("320_"+sc_data[x]+"_H").innerHTML = "";
                                get("320_"+sc_data[x]+"_A").innerHTML = "";
                                get("320_"+sc_data[x]).style.display = "none";
                            }
                        }
                        get("sc_H1_H").innerHTML = util_game.showTxt(xmlnode.Node(mainGame,"sc_H1_H").innerHTML);
                        get("sc_H1_A").innerHTML = util_game.showTxt(xmlnode.Node(mainGame,"sc_H1_A").innerHTML);
                        if(se_num<=2){
                            get("sc_H2_H").innerHTML = "";
                            get("sc_H2_A").innerHTML = "";
                        }else{
                            get("sc_H2_H").innerHTML = util_game.showTxt(xmlnode.Node(mainGame,"sc_H2_H").innerHTML);
                            get("sc_H2_A").innerHTML = util_game.showTxt(xmlnode.Node(mainGame,"sc_H2_A").innerHTML);
                        }
                    }

                    //全場分數
                    score_H_FT = xmlnode.Node(mainGame,"sc_FT_H").innerHTML*1;
                    score_A_FT = xmlnode.Node(mainGame,"sc_FT_A").innerHTML*1;
                    get("sc_FT_H").innerHTML = util_game.showTxt(score_H_FT);
                    get("sc_FT_A").innerHTML = util_game.showTxt(score_A_FT);

                    var HalfTime = xmlnode.Node(mainGame,"HalfTime").innerHTML;

                    if (se_type == "Halves") { //半場模式
                        get("div_matches").classList.add("half");         
                    }else{
                        if(get("div_matches").classList.contains("half"))get("div_matches").classList.remove("half");
                        if((se_now == "Q1" || se_now == "Q2") && HalfTime != "Y"){
                            get("sc_H1_H").classList.add("on");
                            get("sc_H1_A").classList.add("on");
                        }else if((se_now == "Q3" || se_now == "Q4") && HalfTime != "Y"){
                            get("sc_H2_H").classList.add("on");
                            get("sc_H2_A").classList.add("on");
                        } 
                    }
                
                    //當前節數亮色
                    if(se_now == "HT") se_now = "H1";

                    if(HalfTime == "Y"){
                        se_now_end_str = LS_game.get("BK_score_Half");
                        get("se_now").innerHTML = se_now_end_str;
                        get("t_count").innerHTML = "";
                    }else{
                        if(get("sc_"+se_now+"_H"))get("sc_"+se_now+"_H").classList.add("on");
                        if(get("sc_"+se_now+"_A"))get("sc_"+se_now+"_A").classList.add("on");
                        if(get("320_sc_"+se_now))get("320_sc_"+se_now).classList.add("on");
                        if(se_now == "OT")get("320_sc_H2").classList.add("on");                   
                    }                    
                    //==========================================old=========================================
                    // var t_count = xmlnode.Node(mainGame,"t_count").innerHTML;
                    // if(isNaN(t_count)||t_count<0)t_count=0;
                    // var TimeM= Math.floor(t_count/60);
                    // var TimeS= t_count%60;
                    // if(TimeM<10)TimeM="0"+TimeM;
                    // if(TimeS<10)TimeS="0"+TimeS;
                    // t_count = TimeM+":"+TimeS
                    // get("t_count").innerHTML = t_count;
    
                    // //當前時節顯示
                    // var se_now = xmlnode.Node(mainGame,"se_now").innerHTML;
                    // var se_now_str = "";
                    // if(se_now == "HT") se_now_str = "1H";
                    // else if(se_now == "H2") se_now_str = "2H";
                    // else se_now_str = se_now;
                    // get("se_now").innerHTML = LS_game.get("BK_"+se_now_str);
    
                    // var sc_data = new Array("sc_Q1","sc_Q2","sc_Q3","sc_Q4","sc_OT");
                    // var half_data = new Array("sc_H1","sc_H2");
                    // var se_num = se_now.substr(1,1)*1;
                    // if(se_now.substr(1,1) == "T") se_num = 5;
                    
                    // //時節、加時分數
                    // for(var x=0;x<sc_data.length;x++){
                    //     var score_H = xmlnode.Node(mainGame,sc_data[x]+"_H").innerHTML;
                    //     var score_A = xmlnode.Node(mainGame,sc_data[x]+"_A").innerHTML;
                    //     if(x<se_num){
                    //         get(sc_data[x]+"_H").innerHTML = score_H;
                    //         get(sc_data[x]+"_A").innerHTML = score_A;
                    //         get("320_"+sc_data[x]+"_H").innerHTML = score_H;
                    //         get("320_"+sc_data[x]+"_A").innerHTML = score_A;
                    //     }else{
                    //         get(sc_data[x]+"_H").innerHTML = "";
                    //         get(sc_data[x]+"_A").innerHTML = "";
                    //         get("320_"+sc_data[x]+"_H").innerHTML = "";
                    //         get("320_"+sc_data[x]+"_A").innerHTML = "";
                    //         get("320_"+sc_data[x]).style.display = "none";
                    //     }
                    // }
    
                    // //上、下半場分數
                    // for(var c=0;c<half_data.length;c++){
                    //     var score_H = xmlnode.Node(mainGame,half_data[c]+"_H").innerHTML;
                    //     var score_A = xmlnode.Node(mainGame,half_data[c]+"_A").innerHTML;
                    //     get(half_data[c]+"_H").innerHTML = score_H;
                    //     get(half_data[c]+"_A").innerHTML = score_A;
                    //     get("320_"+half_data[c]+"_H").innerHTML = score_H;
                    //     get("320_"+half_data[c]+"_A").innerHTML = score_A;
                    // }
                    // if(se_now != "H2" && se_now != "OT"){
                    //     get("sc_H2_H").innerHTML = "";
                    //     get("sc_H2_A").innerHTML = "";
                    //     get("320_sc_H2_H").innerHTML = "";
                    //     get("320_sc_H2_A").innerHTML = "";
                    //     get("320_sc_H2").style.display = "none";
                    //     get("sc_OT_H").innerHTML = "";
                    //     get("sc_OT_A").innerHTML = "";
                    //     get("320_sc_OT_H").innerHTML = "";
                    //     get("320_sc_OT_A").innerHTML = "";
                    //     get("320_sc_OT").style.display = "none";
                    // }
                    // else if(se_now != "OT"){
                    //     get("sc_OT_H").innerHTML = "";
                    //     get("sc_OT_A").innerHTML = "";
                    //     get("320_sc_OT_H").innerHTML = "";
                    //     get("320_sc_OT_A").innerHTML = "";
                    //     get("320_sc_OT").style.display = "none";
                    // }
    
                    // //全場分數
                    // var score_H_FT = xmlnode.Node(mainGame,"sc_FT_H").innerHTML*1;
                    // var score_A_FT = xmlnode.Node(mainGame,"sc_FT_A").innerHTML*1;
                    // get("sc_FT_H").innerHTML = score_H_FT;
                    // get("sc_FT_A").innerHTML = score_A_FT;
    
                    // var se_type = xmlnode.Node(mainGame,"se_type").innerHTML;
                    // var HalfTime = xmlnode.Node(mainGame,"HalfTime").innerHTML;
    
                    // if(HalfTime == "Y"){
                    //     var tmpAry = new Array("sc_Q1","sc_Q2","sc_Q3","sc_Q4","sc_H1","sc_H2","sc_OT");
                    //     for(var n=0;n<tmpAry.length;n++){
                    //         if(get(tmpAry[n]+"_H").classList.contains("on"))get(tmpAry[n]+"_H").classList.remove("on");
                    //         if(get(tmpAry[n]+"_A").classList.contains("on"))get(tmpAry[n]+"_A").classList.remove("on");
                    //         if(get("320_"+tmpAry[n]).classList.contains("on"))get("320_"+tmpAry[n]).classList.remove("on");
                    //     }
                    //     get("se_now").innerHTML = LS_game.get("BK_score_Half");
                    //     get("t_count").innerHTML = "";
                    //     if (se_type != "Halves"){
                    //         get("320_sc_H1").style.display = "none";
                    //         get("320_sc_H2").style.display = "none";
                    //     }
    
                    // }else{
                    //     if (se_type == "Halves") { //半場模式
                    //         get("div_matches").classList.add("half"); 
        
                    //         //當前節數亮色
                    //         var tmpHalfAry = new Array("sc_H1","sc_H2","sc_OT");
                    //         for(var y=0;y<tmpHalfAry.length;y++){
                    //             if(get(tmpHalfAry[y]+"_H").classList.contains("on"))get(tmpHalfAry[y]+"_H").classList.remove("on");
                    //             if(get(tmpHalfAry[y]+"_A").classList.contains("on"))get(tmpHalfAry[y]+"_A").classList.remove("on");
                    //             if(get("320_"+tmpHalfAry[y]).classList.contains("on"))get("320_"+tmpHalfAry[y]).classList.remove("on");
                    //         }
                    //         if(se_now == "HT"){
                    //             get("sc_H1_H").classList.add("on");
                    //             get("sc_H1_A").classList.add("on");
                    //             get("320_sc_H1").classList.add("on");
                    //         }else if(se_now == "H2"){
                    //             get("sc_H2_H").classList.add("on");
                    //             get("sc_H2_A").classList.add("on");
                    //             get("320_sc_H2").classList.add("on");
                    //         }else if(se_now == "OT"){
                    //             get("sc_OT_H").classList.add("on");
                    //             get("sc_OT_A").classList.add("on");
                    //             get("320_sc_OT").classList.add("on");
                    //         }
        
                    //     }else{
                    //         if(get("div_matches").classList.contains("half"))get("div_matches").classList.remove("half");
        
                    //         //當前節數亮色
                    //         for(var v=0;v<sc_data.length;v++){
                    //             if(get(sc_data[v]+"_H").classList.contains("on"))get(sc_data[v]+"_H").classList.remove("on");
                    //             if(get(sc_data[v]+"_A").classList.contains("on"))get(sc_data[v]+"_A").classList.remove("on");
                    //             if(get("320_"+sc_data[v]).classList.contains("on"))get("320_"+sc_data[v]).classList.remove("on");
                    //         }
                    //         get(sc_data[se_num-1]+"_H").classList.add("on");
                    //         get(sc_data[se_num-1]+"_A").classList.add("on");
                    //         get("320_"+sc_data[se_num-1]).style.display = "";
                    //         get("320_"+sc_data[se_num-1]).classList.add("on");
        
                    //         get("320_sc_H1").style.display = "none";
                    //         get("320_sc_H2").style.display = "none";
                    //     }
                    // }
                }                
			}else{
                var datetime = xmlnode.Node(mainGame,"datetime").innerHTML; //2019-11-04 23:59:00
                var tmpDate = datetime.split(" ")[0];//2019-11-04
                var tmpTime = datetime.split(" ")[1];//23:59:00
                var str_M = tmpDate.split("-")[1]; //11
                var str_D = tmpDate.split("-")[2]; //04
                var str_H = tmpTime.split(":")[0];//23
                var str_Min = tmpTime.split(":")[1]; //59
                var isToday = util_game.isToday(tmpDate);
                var newDatetime =(isToday)? str_H+":"+str_Min : str_D+" / "+str_M+"<b></b>"+str_H+":"+str_Min; // 04 / 11 23:59
                get("game_time").innerHTML = util_game.showTxt(newDatetime);
            }
        }
    } 
    
    _self.setVisibleQuarters=function(type,num,isShow){
        for(var p=1; p<=num; p++){
                //get("sc_"+type+p).style.display = (isShow)?"":"none";
                //get("sc_"+type+p+"_H").style.display = (isShow)?"":"none";
                //get("sc_"+type+p+"_A").style.display = (isShow)?"":"none";
                get("320_sc_"+type+p).style.display = (isShow)?"":"none";
                if(get("sc_"+type+p+"_H").classList.contains("on"))get("sc_"+type+p+"_H").classList.remove("on");
                if(get("sc_"+type+p+"_A").classList.contains("on"))get("sc_"+type+p+"_H").classList.remove("on");
                if(get("320_sc_"+type+p).classList.contains("on"))get("320_sc_"+type+p).classList.remove("on");
        }
    }

    function get(_id){
        if(hasRightPanel) _id ="R_"+_id;
		return dom.getElementById(_id);
    }

    _self.setHasRightPanel = function(){
		hasRightPanel = true;
	}
}