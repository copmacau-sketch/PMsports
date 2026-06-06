function forecast(_win, _dom, _post) {
    console.log('预测')
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    console.log('数据1',win)
    console.log('数据',_post,this)
    var parentClass;
    var eventHandler = new Object();
    var util = new win.Util(win, dom);
    var util_game = new win.Util_game(win,dom);
    var config_set  = new config_set_new2;
    var LS_game;
    var LS;
    var timerHash;
    var _name = "forecastTimer";
    var classname = "forecast";
    var myhash={};
    var scoreFrameForeccast = null;
    var gid = postHash["gid"];
    var leagueName = postHash["league"];
    var teamH = postHash["team_h"];
    var teamC = postHash["team_c"];
    var from = postHash["from"];
    var showtype = postHash["showtype"];
    var bet_showtype = postHash["bet_showtype"];
    var nowScore = "0:0";
    var winM_Range = new Object();
    var winL_Range = new Object();
    var lossM_Range = new Object();
    var lossL_Range = new Object();
    var maxScore_h = 5;
    var maxScore_c = 5;
    var tabAry = new Array("FT","HT","ET","ETHT");
    var danAry_normal = new Array();
    var timerObj = new Object();
    var now_id = "";
    var now_type = "FT";
    var chkMode = "";
    var gid_FT = "";
    var hgid_HT = "";
    var gid_ET = "";
    var hgid_ET = "";
    var nowScore_h = 0;
    var nowScore_c = 0;
    var tmp_scoreLen = 0;
    var needReload = true;
    var oriTable = "";
    var oriScoreBoard = "";
    var _systime = "";
    var score_h_FT = "";
    var score_c_FT = "";
    var score_h_ET = "";
    var score_c_ET = "";
    var gidAry = new Object();
    var resultHash = new Object();
    var wagers_data = new Array();
    // let wagers_data = JSON.parse(localStorage.getItem('jsonData'));
    // var wagers_data=localStorage.getItem('jsonData');
    console.log('调试0-获取存储数据',wagers_data)
    var firstCenter = false;

    //=== 交易狀況Function移植 ===
    var _nowPage = 1;
    var _pageCount = 10;
    //==========================

    //=== 內層參數宣告 ===
    var _showtype = "";
    var _isRB = "N";
    var _lid = ""; //從交易狀況點擊的待補
    var _retime = "";
    var _datetime = "";
    var _ecid = "";
    var _gidm = "";
    var _gid = "";
    var _cmdInRB = 0;
    var mainGame_Live = "N";
    var lastScrollTop = 0;
    var lastScrollLeft = 0;
    var _hasEC = "N";
    var _Live = "N";
    var nowSession = "";
    //==================

    _self.init = function () {
        _self.showNoData(false);
        now_type = "FT";

        myhash["config_set"] = config_set;
        myhash["util"] = util;
        parentClass.dispatchEvent("showLoading", {"isShow":false});
        console.log("进入展示")
        //_self.showForecastLoading(true,"page_on");

        gidAry["FT"] = new Object();

        config_set.init();
        console.log("关闭1")
        util.addEvent(dom.getElementById("btn_close"), "click", _self.closeForecast, {"restartTimer":"Y"});
        console.log("关闭2")
        util.addEvent(dom.getElementById("close_mask"), "click", _self.closeForecast, {"restartTimer":"Y"});
        util.addEvent(dom.getElementById("fore_allsports"), "click", _self.showViewMore);
        util.addEvent(dom.getElementById("icon_knowMore"), "click", _self.showKnowMore);
        util.addEvent(dom.getElementById("knowMore_close"), "click", _self.closeKnowMore);


        dom.getElementById("forecast_title").innerHTML = util.showTxt(leagueName.toLowerCase());
        // dom.getElementById("forecast_teamH").innerHTML = teamH;
        // dom.getElementById("forecast_teamC").innerHTML = teamC;
        dom.getElementById("nowTab").innerHTML = util.showTxt(dom.getElementById("tab_FT").innerHTML);
        dom.getElementById("fore_knowMore").innerHTML = dom.getElementById("knowMore").innerHTML;
        dom.getElementById("fore_landScape").innerHTML = dom.getElementById("landScape").innerHTML;
        dom.getElementById("fore_nodata").innerHTML = dom.getElementById("fore_nodata_str").innerHTML;

        //重開滾軸置頂
        dom.getElementById("forecast_content").scrollTop = 0;

        //時節頁籤
        _self.setTab();

        //重置計分板
        _self.resetScore();

        //計分板
        _self.loadScore();

        //重置預測賽果表格
        _self.resetTable();

        _self.createTimer();
        parentClass.dispatchEvent("removeBodyShowClass");
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        timerHash = parentClass.getThis("timerHash");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_game = parentClass.getThis("LS_game");
        headerFrame = parentClass.getThis("headerFrame");
        myhash["timerHash"] = timerHash;
        myhash["LS"] = LS;
        myhash["LS_game"] = LS_game;
        myhash["LS_code"] = LS_code;
        myhash["headerFrame"] = headerFrame;
    }

    _self.setParam = function(par){
        console.log("调试21-->forecast",par)
        postHash = par;
        scoreFrameForeccast = null;
        gid = postHash["gid"];
        leagueName = postHash["league"];
        teamH = postHash["team_h"];
        teamC = postHash["team_c"];
        from = postHash["from"];
        showtype = postHash["showtype"];
        bet_showtype = postHash["bet_showtype"];
        nowScore = "0:0";
        winM_Range = new Object();
        winL_Range = new Object();
        lossM_Range = new Object();
        lossL_Range = new Object();
        maxScore_h = 5;
        maxScore_c = 5;
        danAry_normal = new Array();
        timerObj = new Object();
        now_id = "";
        now_type = "FT";
        gid_FT = "";
        hgid_HT = "";
        gid_ET = "";
        hgid_ET = "";
        nowScore_h = 0;
        nowScore_c = 0;
        tmp_scoreLen = 0;
        needReload = true;
        _nowPage = 1;
        _pageCount = 10;
        _showtype = "";
        _isRB = "N";
        _lid = "";
        _retime = "";
        _datetime = "";
        _ecid = "";
        _gidm = "";
        _gid = "";
        _hasEC = "N";
        _cmdInRB = 0;
        mainGame_Live = "N";
        _Live = "N";
        _systime = "";
        score_h_FT = "";
        score_c_FT = "";
        score_h_ET = "";
        score_c_ET = "";
        lastScrollTop = 0;
        lastScrollLeft = 0;
        firstCenter = false;
        gidAry = new Object();
        resultHash = new Object();
        wagers_data = new Array();
        // console.log('wagers_data2',wagers_data)
    }

    _self.getThis = function (varible) {
        if(!myhash[varible]) {
            var msg = "no myhash["+varible+"]";
            util.writeLog(classname, msg);
        }
        return myhash[varible];
    }
    // _self.setParam(postHash)

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }

    //投注記錄、所有盤口
    _self.setTab=function(){
        console.log(tabAry)
        for(var i=0;i<tabAry.length;i++){
            var tabObj = dom.getElementById("tab_"+tabAry[i]);
            util.removeClass(tabObj,"on");
            var tabStr = tabObj.innerHTML;
            util.addEvent(dom.getElementById("tab_"+tabAry[i]), "click", _self.clickTab, {"type":tabAry[i],"name":tabStr});
        }
        util.addClass(dom.getElementById("tab_FT"),"on");
    }

    _self.clickTab=function(e,par){
        needReload = true;
        firstCenter = false;
        lastScrollTop = 0;
        lastScrollLeft = 0;
        if(dom.getElementById("form_table")){
            dom.getElementById("form_table").scrollTop = 0;
            dom.getElementById("form_table").scrollLeft = 0;
        }
        _self.showForecastLoading(true,"time_on");
        _self.showNoData(false);
        for(var i=0;i<tabAry.length;i++){
            util.removeClass(dom.getElementById("tab_"+tabAry[i]),"on");
        }
        var tabObj = dom.getElementById("tab_"+par.type);
        util.addClass(tabObj,"on");
        dom.getElementById("nowTab").innerHTML = par.name;
        now_type = par.type;

        if(par.type=="FT"){
            now_id = gid_FT;
        }else if(par.type=="HT"){
            now_id = hgid_FT;
        }else if(par.type=="ET"){
            now_id = gid_ET;
        }else if(par.type=="ETHT"){
            now_id = hgid_ET;
        }

        if(now_type == "FT" || now_type == "HT"){
            nowScore_h = score_h_FT*1;
            nowScore_c = score_c_FT*1;
        }else{
            nowScore_h = score_h_ET*1;
            nowScore_c = score_c_ET*1;
        }

        _self.getScoreRec(now_id);
    }

    //投注記錄、所有盤口
    _self.setBtnVisible=function(wagers_data,from,id){


        if(wagers_data.length>0){
            dom.getElementById("mybets").style.display = "";
            dom.getElementById("allmarket").style.display = "";
        }else{
            dom.getElementById("mybets").style.display = "none";
            dom.getElementById("allmarket").style.display = "none";
        }

        util.addEvent(dom.getElementById("allmarket"), "click", _self.goToMore); //所有盤口(去內層盤面)
        util.addEvent(dom.getElementById("mybets"), "click", _self.goToWagers); //投注記錄(去交易狀況)
        if(from=="more"){
            dom.getElementById("allmarket").style.display = "none";
            util.removeEvent(dom.getElementById("allmarket"), "click");
        }else if(from=="wagers"){
            dom.getElementById("mybets").style.display = "none";
            util.removeEvent(dom.getElementById("mybets"), "click");
        }
    }

    //計分板
    _self.loadScore = function(){
        console.log("計分板-->>>>>>>>>>>>>>>>>>>>forecast")
        var param = new Object();
        param["postHash"] = {"gtype":"ft"};
        param["extendsClass"] = "forecast";
        param["parentClass"] = _self;

        var ev_gtype = "game_more";
        var extendsClassPage = _self.new_eval(param["extendsClass"]);
        var extendsClassObj = new extendsClassPage(win,dom,param.postHash);
        scoreFrameForeccast = util.extendsClass(extendsClassObj, _self.new_eval(ev_gtype), win, dom, param["postHash"]);
        var parantClass = (param.parentClass!=null)?param.parentClass:_self;
        scoreFrameForeccast.setParentclass(parantClass);
        scoreFrameForeccast.setHasRightPanelByfalse();
        scoreFrameForeccast.setHasForecast();
        _self.getData();
    }
    _self.setHasForecast = function () {
        hasForecast = true
    };
    _self.setHasRightPanelByfalse = function () {
        hasRightPanel =false
    };
    _self.resetScore = function(){
        dom.getElementById("fore_score").innerHTML = oriScoreBoard;
    }

    _self.saveLastPosition = function(){
        lastScrollTop = dom.getElementById("form_table").scrollTop;
        lastScrollLeft = dom.getElementById("form_table").scrollLeft;
    }

    _self.getData = function(){
        var par = top.param;

        par += "&p=get_game_more";
        par += "&gtype=ft";
        par += "&showtype="+showtype;
        par += "&ltype=" + top["userData"].ltype;
        par += "&isRB=N"; //判斷滾過用，預測賽果沒過關，所以帶N
        par += "&ecid=";
        par += "&gid="+gid;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.getDataError);
        getHTML.addEventListener("LoadComplete", function(xml){
            _self.getDataComplete(xml);
        });
        getHTML.loadURL(top.m2_url, "POST", par);
    }

    _self.getDataComplete = function(xml){

        xmlnode = util.parseXml(xml);
        _xmlnode = xmlnode;
        gidAry["FT"] = new Object();
        _self.saveLastPosition();
        var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
        var nowMode = xmlnode.Node(xmlnode.Root[0],"nowMode").innerHTML;
        var hasEC = xmlnode.Node(xmlnode.Root[0],"hasEC").innerHTML;
        var game = xmlnode.Node(xmlnode.Root[0],"game", false);
        var allGameDisRB = xmlnode.Node(xmlnode.Root[0],"all_close").innerHTML;
        _showtype = _self.transShowtype(xmlnode.Node(xmlnode.Root[0],"showtype").innerHTML);
        var ecid = xmlnode.Node(xmlnode.Root[0],"ecid").innerHTML;
        var FT_gid = xmlnode.Node(xmlnode.Root[0], "FT_gid");
        var gidAry_FT = xmlnode.Node(FT_gid, "gid", false);
        var FTscoreH = xmlnode.Node(xmlnode.Root[0],"FTscoreH").innerHTML;
        var FTscoreC = xmlnode.Node(xmlnode.Root[0],"FTscoreC").innerHTML;
        var HT_isResult = xmlnode.Node(xmlnode.Root[0],"HT_isResult").innerHTML;
        var FT_isResult = xmlnode.Node(xmlnode.Root[0],"FT_isResult").innerHTML;
        _cmdInRB = xmlnode.Node(xmlnode.Root[0],"cmd_inRB").innerHTML;

        var hasTK = false;
        if(gidAry["FT"]){
            for(var v=0;v<gidAry_FT.length;v++){
                var gidObj = gidAry_FT[v];
                var tmp_gid_FT = gidObj.getAttribute("id");
                var tmp_hgid_FT = tmp_gid_FT*1+1+"";
                var isMaster = gidObj.getAttribute("master");
                if(isMaster=="Y")gid_FT = tmp_gid_FT;
                if(gid_FT==""){ //如果FT_gid取到空的
                    if(from=="wagers"){ //從交易狀況點，判斷w_ms決定gid是上半還是全場，再反推回去
                        if(top["forecastData"] && top["forecastData"]["FT"] && top["forecastData"]["FT"][gid]){
                            var w_ms = top["forecastData"]["FT"][gid][0]["w_ms"];
                            if(w_ms!=null && w_ms!="") gid_FT = gid*1-1; //傳進來的是上半gid
                            else gid_FT = gid; //傳進來的是全場gid
                        }
                    }else{
                        gid_FT = xmlnode.Node(game[0], "gid").innerHTML;
                    }
                }
                var tmpHgid = gid_FT*1+1;
                hgid_FT = tmpHgid+"";

                if(top["forecastData"] && top["forecastData"]["FT"]){
                    if(top["forecastData"]["FT"][tmp_gid_FT] || top["forecastData"]["FT"][tmp_hgid_FT]) hasTK = true;
                }
                console.log("调试>>>>>>>>>>>>>>>>-->gid_FT",gid_FT)
                if(!gidAry["FT"][gid_FT]) gidAry["FT"][gid_FT] = new Array();
                if(!gidAry["FT"][hgid_FT]) gidAry["FT"][hgid_FT] = new Array();
                if(!util.in_array(tmp_gid_FT,gidAry["FT"][gid_FT])) gidAry["FT"][gid_FT].push(tmp_gid_FT);
                if(!util.in_array(tmp_hgid_FT,gidAry["FT"][hgid_FT])) gidAry["FT"][hgid_FT].push(tmp_hgid_FT);
            }
        }


        if(code=="617"){
            var mainGame = null;
            var gdata,mode,master;
            var hasET = false;
            var gopen_ET = "";
            var hgopen_ET = "";
            var Live_ET = "";
            var HLive_ET = "";

            if(game.length > 0){

                for(var i=0; i<game.length; i++){
                    gdata = game[i];
                    mode = gdata.getAttribute("mode");
                    master = gdata.getAttribute("master");

                    if(mode=="ET" && master=="Y" && hasEC=="Y") {
                        hasET = true;
                        gopen_ET = xmlnode.Node(gdata, "gopen").innerHTML;
                        hgopen_ET = xmlnode.Node(gdata, "hgopen").innerHTML;
                        Live_ET = xmlnode.Node(gdata,"Live").innerHTML;
                        HLive_ET = xmlnode.Node(gdata,"hlive").innerHTML;
                        gid_ET = xmlnode.Node(gdata, "gid").innerHTML;
                        hgid_ET = xmlnode.Node(gdata, "hgid").innerHTML;
                        score_h_ET = xmlnode.Node(gdata, "score_h").innerHTML;
                        score_c_ET = xmlnode.Node(gdata, "score_c").innerHTML;
                    }

                    if(mode=="FT" && master=="Y"){
                        gid_FT = xmlnode.Node(gdata, "gid").innerHTML;
                        hgid_FT = xmlnode.Node(gdata, "hgid").innerHTML;
                        score_h_FT = (FTscoreH!=null&&FTscoreH!="")?FTscoreH:xmlnode.Node(gdata, "score_h").innerHTML;
                        score_c_FT = (FTscoreC!=null&&FTscoreC!="")?FTscoreC:xmlnode.Node(gdata, "score_c").innerHTML;
                    }

                    if(gidAry["FT"]){
                        if(hasET){
                            var ET_gid = xmlnode.Node(xmlnode.Root[0], "ET_gid");
                            var gidAry_ET = xmlnode.Node(ET_gid, "gid", false);
                            for(var z=0;z<gidAry_ET.length;z++){
                                var gidObj = gidAry_ET[z];
                                var tmp_gid_ET = gidObj.getAttribute("id");
                                var tmp_hgid_ET = tmp_gid_ET*1+1+"";
                                var isMaster = gidObj.getAttribute("master");
                                if(isMaster=="Y")gid_ET = tmp_gid_ET;
                                var tmpHgid = gid_ET*1+1;
                                hgid_ET = tmpHgid+"";

                                if(!gidAry["FT"][gid_ET]) gidAry["FT"][gid_ET] = new Array();
                                if(!gidAry["FT"][hgid_ET]) gidAry["FT"][hgid_ET] = new Array();
                                if(!util.in_array(tmp_gid_ET,gidAry["FT"][gid_ET])) gidAry["FT"][gid_ET].push(tmp_gid_ET);
                                if(!util.in_array(tmp_hgid_ET,gidAry["FT"][hgid_ET])) gidAry["FT"][hgid_ET].push(tmp_hgid_ET);
                            }
                        }

                        var tmpGid = xmlnode.Node(gdata, "gid").innerHTML;
                        var tmpHgid = xmlnode.Node(gdata, "hgid").innerHTML;
                        if(!gidAry["FT"][tmpGid])gidAry["FT"][tmpGid] = new Array();
                        if(!gidAry["FT"][tmpHgid])gidAry["FT"][tmpHgid] = new Array();
                        if(!util.in_array(tmpGid,gidAry["FT"][tmpGid])) gidAry["FT"][tmpGid].push(tmpGid);
                        if(!util.in_array(tmpHgid,gidAry["FT"][tmpHgid])) gidAry["FT"][tmpHgid].push(tmpHgid);
                    }

                    if(hasEC!="Y" || (mode=="" && nowMode=="")){
                        mode = "FT";
                    }

                    if(mode){
                        if(hasEC=="Y" && nowMode==mode && master=="Y"){
                            mainGame = game[i];
                        }
                    }
                }

                if(mainGame==null) mainGame = game[0];
                _isRB = xmlnode.Node(mainGame, "is_rb").innerHTML;
                _lid = xmlnode.Node(mainGame, "lid").innerHTML;
                _retime = xmlnode.Node(mainGame, "re_time").innerHTML;
                _datetime = xmlnode.Node(mainGame, "datetime").innerHTML;
                _ecid = ecid;
                _gidm = xmlnode.Node(mainGame, "gidm").innerHTML;
                _gid = xmlnode.Node(mainGame, "gid").innerHTML;
                _hgid = xmlnode.Node(mainGame, "hgid").innerHTML;
                mainGame_Live = xmlnode.Node(mainGame, "Live").innerHTML;
                _self.parseTeam(mainGame, xmlnode,ecid);
                _hasEC = (hasEC)?hasEC:"N";

                var intoRB = _self.checkIntoRB(xmlnode, mainGame);
                if(intoRB) return;

                var game_mode = (hasEC=="Y")?nowMode:mode;
                chkMode = (game_mode!="")?game_mode:"";
                var gopen = xmlnode.Node(game[0], "gopen").innerHTML;
                var Live = xmlnode.Node(game[0],"Live").innerHTML;
                var OuterOpen = true;
                _Live = Live;
                console.log("调试11进入->",scoreFrameForeccast)
                scoreFrameForeccast.setEcid(ecid);
                var scDataObj = scoreFrameForeccast.setScoreBoard(game_mode, mainGame, _showtype, gopen, Live, OuterOpen, allGameDisRB,FTscoreH,FTscoreC);
                scDataObj.isForeCast = "Y";
                if(dom.getElementById("WS_team_h"))dom.getElementById("WS_team_h").innerHTML = (scDataObj.team_h==null)?util_game.showTxt(scDataObj.def_team_h):util_game.showTxt(scDataObj.team_h);
                if(dom.getElementById("WS_team_h"))dom.getElementById("WS_team_c").innerHTML = (scDataObj.team_c==null)?util_game.showTxt(scDataObj.def_team_c):util_game.showTxt(scDataObj.team_c);
                scoreFrameForeccast.parseScoreBoard(scDataObj, "forecast");


                for(var s=0;s<tabAry.length;s++){
                    var tabObj = dom.getElementById("tab_"+tabAry[s]);
                    tabObj.style.display = "";
                }

                //加時/加時上半頁籤會在控端有勾起滾球勾才會出現
                if(hasET){
                    if(showtype!="live"){
                        dom.getElementById("tab_ET").style.display = (gopen_ET=="Y")? "":"none";
                        dom.getElementById("tab_ETHT").style.display = (hgopen_ET=="Y")? "":"none";
                    }else{
                        dom.getElementById("tab_ET").style.display = (Live_ET=="Y")? "":"none";
                        dom.getElementById("tab_ETHT").style.display = (HLive_ET=="Y")? "":"none";
                    }
                }else{
                    dom.getElementById("tab_ET").style.display = "none";
                    dom.getElementById("tab_ETHT").style.display = "none";
                }

                if(FT_isResult == "Y"){ //全場已key完
                    dom.getElementById("tab_HT").style.display = "none";
                    dom.getElementById("tab_FT").style.display = "none";
                    if(hasET){
                        if(now_type=="FT"){
                            if(dom.getElementById("tab_ET").style.display==""){
                                dom.getElementById("tab_ET").click();
                                return;
                            }else{
                                _self.showNoData(true);
                            }
                        }
                    }else{
                        //nodata
                        if(nowMode.match("PK")){
                            _self.showNoData(true,nowMode);
                            _self.showForecastLoading(false,"time_on");
                            _self.showForecastLoading(false,"page_on");
                            return;
                        }else _self.showNoData(true);
                    }
                }else if(HT_isResult == "Y"){ //上半已key完
                    dom.getElementById("tab_HT").style.display = "none";
                    if(now_type=="HT"){
                        dom.getElementById("tab_FT").click();
                        return;
                    }
                }else{
                    dom.getElementById("tab_HT").style.display = "";
                    dom.getElementById("tab_FT").style.display = "";
                }

                //頁籤停留在加時上半 這時滾球勾勾掉的話 需幫帶去預設的全場頁籤
                if(now_type=="ETHT"||now_type=="ET"){
                    if(showtype!="live"){
                        var closeET = (now_type=="ET" && gopen_ET!="Y");
                        var closeETHT = (now_type=="ETHT" && hgopen_ET!="Y");
                    }else{
                        var closeET = (now_type=="ET" && Live_ET!="Y");
                        var closeETHT = (now_type=="ETHT" && HLive_ET!="Y");
                    }

                    if(closeETHT){
                        if(FTscoreH==""&&FTscoreC==""){
                            dom.getElementById("tab_FT").click();
                            return;
                        }else if(!closeET){
                            dom.getElementById("tab_ET").click();
                            return;
                        }else{
                            _self.showNoData(true);
                        }
                    }else if(closeET){
                        if(FTscoreH==""&&FTscoreC==""){
                            dom.getElementById("tab_FT").click();
                            return;
                        }else{
                            _self.showNoData(true);
                        }
                    }
                }


                if(now_type == "FT" || now_type == "HT"){
                    nowScore_h = score_h_FT*1;
                    nowScore_c = score_c_FT*1;
                }else{
                    nowScore_h = score_h_ET*1;
                    nowScore_c = score_c_ET*1;
                }

                if(now_type == "FT"){
                    now_id = gid_FT;
                }else if(now_type == "HT"){
                    now_id = hgid_FT;
                }else if(now_type == "ET"){
                    now_id = gid_ET;
                }else if(now_type == "ETHT"){
                    now_id = hgid_ET;
                }
                if(_ecid == top.rightECID && top.rightShowTV){
                    parentClass.dispatchEvent("parseRightScoreBoard",scDataObj);
                }
                if(now_id=="") now_id=gid;
                _self.getScoreRec(now_id);
            }else{
                _self.showNoData(true);
                _self.showForecastLoading(false,"time_on");
                _self.showForecastLoading(false,"page_on");
            }
        }
    }

    _self.showNoData = function(isShow,nowMode){
        var mode = (nowMode)?nowMode:"normal";
        if(mode.match("PK")){
            dom.getElementById("fore_nodata_context").innerHTML = LS_game.get("noData");
        }
        dom.getElementById("forecast_content").style.display=(isShow)?"none":"";
        dom.getElementById("fore_nodata").style.display=(isShow)?"":"none";

        if(isShow)_self.clearTimer();
    }

    _self.checkIntoRB = function(xmlnode, mainGame){
        var xml_isRB = xmlnode.Node(mainGame,"is_rb").innerHTML;
        var live = xmlnode.Node(mainGame,"Live").innerHTML;
        if(!top.go_to_rb){
            if(showtype=="today"){
                if(top.specialClick != ""){
                    if(showtype != "live" && xml_isRB=="Y" && live=="Y"){
                        //console.log("賽事進入滾球");
                        showtype = "live";
                        _self.getData();
                        if(!top.go_to_rb) top.go_to_rb=true;
                        return true;
                    }
                }else{
                    if(xml_isRB=="Y" && live=="Y"){
                        showtype = "live";
                        _self.getData();
                        if(!top.go_to_rb) top.go_to_rb=true;
                        return true;
                    }
                }
            }else if(top.choice_showtype=="mygame"){
                if(showtype == "today"){
                    if(xml_isRB=="Y" && live=="Y"){
                        showtype = "live";
                        _self.getData();
                        if(!top.go_to_rb) top.go_to_rb=true;
                        return true;
                    }
                }
            }
        }

        top.go_to_rb = false;

        return false;
    }

    _self.parseTeam = function(mainGame, xmlnode , id){
        console.log(">>>>>>>>>>>gggggggggggggggggggg>",teamH)
        console.log(">>>>>>>>>>>gggggggggggggggggggg>",teamC)
        console.log(">>>>>>>>>>>gggggggggggggggggggg>",mainGame)
        var team_h = teamH;
        var team_c = teamC;
        var tmp_ecid = id;
        if(mainGame!=null){
            team_h = xmlnode.Node(mainGame,"team_h").innerHTML;
            team_c = xmlnode.Node(mainGame,"team_c").innerHTML;
            ptype = xmlnode.Node(mainGame,"ptype").innerHTML;
            var gidm = xmlnode.Node(mainGame,"gidm").innerHTML;
            if(tmp_ecid != gidm){
                team_h = team_h.replace(ptype, "");
                team_c = team_c.replace(ptype, "");
            }
        }
        dom.getElementById("forecast_teamH").innerHTML = util.showTxt(team_h);
        dom.getElementById("forecast_teamC").innerHTML = util.showTxt(team_c);
    }

    _self.getScoreRec = function(gid){
        var par = top.param;
        par += "&p=get_game_more";
        par += "&gtype=ft";
        par += "&gid="+gid;
        par += "&isForecast=Y";
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.getDataError);
        getHTML.addEventListener("LoadComplete", function(xml){
            _self.getScoreRecComplete(xml);
        });
        getHTML.loadURL(top.m2_url, "POST", par);
    }

    _self.getScoreRecComplete = function(xml){
        _self.saveLastPosition();
        _self.showForecastLoading(false,"time_on");
        _self.showForecastLoading(false,"page_on");

        xmlnode = util.parseXml(xml);
        _xmlnode = xmlnode;

        var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
        _systime = xmlnode.Node(xmlnode.Root[0],"systime").innerHTML;
        var gtype = xmlnode.Node(xmlnode.Root[0],"gtype").innerHTML;
        var score_gid = xmlnode.Node(xmlnode.Root[0],"gid").innerHTML;
        var score = xmlnode.Node(xmlnode.Root[0],"score", false);
        var scoreArray = new Array();
        var games = {};
        // console.log("》》》》》》》》》小毛驴》》》》》》》》》》》》》》》",xml)
        if(code=="631"){
            if(score.length > 0){
                for(var i=0; i<score.length; i++){
                    sdata = score[i];
                    var datetime = xmlnode.Node(sdata, "datetime").innerHTML;
                    var result_h = xmlnode.Node(sdata, "result_h").innerHTML;
                    var result_c = xmlnode.Node(sdata, "result_c").innerHTML;

                    //games["710640"] = {scoreArray:[{datetime:"2023-02-12 23:46:00",result_h:"1",result_c:"0"},{datetime:"2023-02-13 05:03:23",result_h:"2",result_c:"1"}]};
                    scoreData = {"datetime":datetime,"result_h":result_h,"result_c":result_c};
                    scoreArray.push(scoreData);
                    if(games[score_gid]==null)games[score_gid] = new Object();
                    games[score_gid]["scoreArray"] = scoreArray;
                }

                if(now_type=="FT"||now_type=="HT"){
                    if(score_h_FT==null||score_h_FT=="")score_h_FT = result_h;
                    if(score_c_FT==null||score_c_FT=="")score_c_FT = result_c;
                    nowScore_h = score_h_FT*1;
                    nowScore_c = score_c_FT*1;
                }else{
                    if(score_h_ET==null||score_h_ET=="")score_h_ET = result_h;
                    if(score_c_ET==null||score_c_ET=="")score_c_ET = result_c;
                    nowScore_h = score_h_ET*1;
                    nowScore_c = score_c_ET*1;
                }
            }else{
                games[score_gid] = {scoreArray:[]};
            }


            var tmpSession = _retime.split("^")[0];
            if((scoreArray.length!=tmp_scoreLen) || needReload || (tmpSession!=nowSession)){
                //輸贏預測
                _self.loadResult(games,now_id);

                needReload = false;
            }
            tmp_scoreLen = scoreArray.length;
        }
    }

    //輸贏預測
    _self.loadResult = function(games,gid){
        console.log("预测计算")
        var tickets = [];
        var ticketsLen = 0;
        nowSession = _retime.split("^")[0];
        if(gidAry["FT"] && gidAry["FT"][gid]){
            var tmpAry = gidAry["FT"][gid];
            for(var x=0;x<tmpAry.length;x++){
                var tmpGid = tmpAry[x];
                if(top["forecastData"] && top["forecastData"]["FT"] && top["forecastData"]["FT"][tmpGid]){
                    var tmpTicketsLen = top["forecastData"]["FT"][tmpGid].length;
                    for(var a=0; a<tmpTicketsLen; a++){
                        var wagersData = top["forecastData"]["FT"][tmpGid][a];
                        var param = new Object();
                        param["id"] = _self.replaceOU(util.showTxt(wagersData["w_id"]));
                        param["gtype"] = wagersData["gtype"];
                        param["gid"] = wagersData["gid"];
                        param["wtype"] = wagersData["bet_wtype"];
                        param["rtype"] = wagersData["rtype"];
                        param["type"] = wagersData["chose_team"];
                        param["concede"] = wagersData["spread"]
                        if(wagersData["strong"]=="N" && wagersData["bet_wtype"] == "RE"){
                            console.log("预测》》》》》》》》》》》》》计算",wagersData["concede"])
                            param["concede"] = wagersData["concede"];
                        }
                        param["ratio"] = wagersData["ratio"];
                        param["adddate"] = wagersData["adddate"];
                        param["ioratio"] = wagersData["ioratio"];
                        param["gold"] = wagersData["bet_golds"];
                        param["result"] = wagersData["result"];
                        param["odd_f"] = wagersData["odd_f"];
                        param["ball_act"] = wagersData["ballact"];
                        param["ball_map"] = wagersData["ball_map"];
                        param["code_value"] = wagersData["code_value"];
                        param["ptype"] = wagersData["ptype"];
                        tickets.push(param);
                    }
                }
            }
            ticketsLen = tickets.length;
        }

        _self.resetTable();

        //單數加4排、雙數加3排
        if(nowScore_h>=3 && maxScore_h - nowScore_h <= 2){
            if(nowScore_h%2==0){ //雙數加3排
                var newMaxScore = nowScore_h+3;
            }else{ //單數加4排
                var newMaxScore = nowScore_h+4;
            }
            var diff = newMaxScore - maxScore_h;
            _self.expandColumn(diff,maxScore_h,maxScore_c,"h");
            maxScore_h = newMaxScore;
        }
        if(nowScore_c>=3 && maxScore_c - nowScore_c <= 2){
            if(nowScore_c%2==0){ //雙數加3排
                var newMaxScore = nowScore_c+3;
            }else{ //單數加4排
                var newMaxScore = nowScore_c+4;
            }
            var diff = newMaxScore - maxScore_c;
            _self.expandColumn(diff,maxScore_c,maxScore_h,"c");
            maxScore_c = newMaxScore;
        }

        var scores = [];
        for(var i=0; i<=maxScore_h; i++){
            for(var j=0; j<=maxScore_c; j++){
                scores.push(i+":"+j);
            }
        }

        var result = new Result();
        resultHash = result.getResult(scores, tickets, games);
        _self.calResult(resultHash);
        // console.log('所有比方：》》》》》》》》》》》》',resultHash)
        //============== 整理單子容器 ============
        //全部單子(包含子盤)
        var allTickets = new Array();
        if(gidAry["FT"][gid]){
            // console.log(gidAry["FT"],'allTickets11111111111111')
            // console.log(gid,'allTickets2222222')
            // console.log(gidAry["FT"][gid],'allTickets')
            var tmpAry = gidAry["FT"][gid];
            for(var x=0;x<tmpAry.length;x++){
                var tmpGid = tmpAry[x];
                console.log(tmpGid,'tmpGid')
                if(top["forecastData"] && top["forecastData"]["FT"]){
                    if(!top["forecastData"]["FT"][tmpGid]){
                        console.log('if')
                        continue;
                    }else{
                        console.log('else')
                        var tmpData = top["forecastData"]["FT"][tmpGid];
                        allTickets = allTickets.concat(tmpData);
                    }
                }
            }
            allTickets.sort((a, b) => a.adddate < b.adddate ? 1 : -1);
        }

        // 濾掉不計算的玩法
         console.log(allTickets,'allTickets')
        wagers_data = new Array();
        
        for(var c=0;c<allTickets.length;c++){
             console.log('>>>>>>>>>allTickets>>>>start>>>>>>>',allTickets)
            var w_id = allTickets[c]["w_id"];
            var t_id = _self.replaceOU(util.showTxt(w_id));
			console.log(t_id);
            if(resultHash && resultHash["0:0"] && resultHash["0:0"]["tickets"] && resultHash["0:0"]["tickets"][t_id]){
				console.log(resultHash);
                if(resultHash["0:0"]["tickets"][t_id].result == "not calculate" && resultHash["0:0"]["tickets"][t_id].display=="none"){
                    continue;
                }
            }
            wagers_data.push(allTickets[c]);
            console.log('wagers_data>>>>>>>>>end>>>>>>>>>>',wagers_data)
        }
        // =======================================


        nowScore = nowScore_h+":"+nowScore_c;
        var nowScoreInd = scores.indexOf(nowScore);

        for(var scKey in resultHash){
            var ind = scores.indexOf(scKey);
            var tmp = scKey.split(":");
            var score_h = tmp[0]*1;
            var score_c = tmp[1]*1;
            var scTitleObj_h = dom.getElementById("form_h_"+score_h);
            var scTitleObj_c = dom.getElementById("form_c_"+score_c);
            var score = tmp[0]+"_"+tmp[1];
            var scObj = dom.getElementById("fore_"+score);
            var val = resultHash[scKey]["wingold"]*1;

            scObj.className = "";
            var isZero = (val == 0);
            var isWinM = (val>winM_Range["S"] && val<=winM_Range["E"]);
            var isWinL = (val>=winL_Range["S"] && val<=winL_Range["E"]);
            var isLossM = (val<lossM_Range["S"] && val>=lossM_Range["E"]);
            var isLossL = (val<=lossL_Range["S"] && val>=lossL_Range["E"]);
            if(isZero) scObj.className = "";
            else if(isWinM) util.addClass(scObj,"winMore");
            else if(isWinL) util.addClass(scObj,"winLess");
            else if(isLossM) util.addClass(scObj,"lossMore");
            else if(isLossL) util.addClass(scObj,"lossLess");


            if(showtype!="live"){
                if(_cmdInRB==1){ //今日賽事進開賽時間，沒勾滾球勾
                    util.addClass(scObj,"past");
                }
            }else{
                if(mainGame_Live == "N"){
                    util.addClass(scObj,"past");
                }else{
                    var tmpRetime = _retime.split("^");
                    if(wagers_data.length>0){
                        var isPastFT = ((chkMode =="ET" || chkMode =="PKR" || chkMode =="PKOU") && (now_type=="FT" || now_type=="HT"));
                        var isPastHT = ((tmpRetime[0]=="HT"||tmpRetime[0]=="2H") && now_type=="HT");
                        var isPastETHT = (chkMode =="ET" && (tmpRetime[0]=="HT"||tmpRetime[0]=="2H") && now_type=="ETHT");
                        if(isPastFT || isPastHT || isPastETHT){
                            util.addClass(scObj,"past");
                        }
                        else{
                            if(score_h<nowScore_h || score_c<nowScore_c){
                                util.addClass(scObj,"past"); //過去比分
                            }else if(ind==nowScoreInd){
                                util.addClass(scObj,"on"); //現在比分
                                if(scTitleObj_h) util.addClass(scTitleObj_h,"on");
                                if(scTitleObj_c) util.addClass(scTitleObj_c,"on");
                            }
                        }
                    }else{
                        if(score_h<nowScore_h || score_c<nowScore_c){
                            util.addClass(scObj,"past"); //過去比分
                        }
                    }
                }
            }



            var tVal = _self.transVal(val,top.langx);
            scObj.innerHTML = util.showTxt(tVal);
        }

        //當下場次為滾球且有下注時會有目前比分置中的按鈕
        if(wagers_data.length>0 && showtype=="live"){
            //console.log("置中鈕新增點擊事件");
            dom.getElementById("btn_position").style.display = "";
            util.addEvent(dom.getElementById("btn_position"), "click", _self.setCenter);
            if(!firstCenter){
                _self.setCenter();
                firstCenter = true;
            }
        }else{
            //console.log("置中鈕移除點擊事件");
            dom.getElementById("btn_position").style.display = "none";
            util.removeEvent(dom.getElementById("btn_position"), "click");
        }

        //現有投注
        console.log('_self.doParseTodayWagers函数调用参数',wagers_data,now_id)
        
        _self.doParseTodayWagers(wagers_data,now_id);
       //  _self.doParseTodayWagers(wagers,now_id);

        //投注記錄、所有盤口
        _self.setBtnVisible(wagers_data,from,now_id);
		// _self.setBtnVisible(wagers,from,now_id);
    }

    _self.resetTable = function(){
        maxScore_h = 5;
        maxScore_c = 5;
        dom.getElementById("form_table").innerHTML = oriTable;
        dom.getElementById("form_table").scrollTop = lastScrollTop;
        dom.getElementById("form_table").scrollLeft = lastScrollLeft;
        dom.getElementById("form_table").style = "--score_h: 6;--score_c: 6;";
    }

    _self.expandColumn = function(addCnt,score_x,score_y,type){
        var form_table = dom.getElementById("form_table");
        var _form = dom.getElementById("form_"+type);
        var form_result = dom.getElementById("form_result");
        for(var i=0; i<addCnt; i++){
            score_x++;
            var newScore = document.createElement("div");
            newScore.id = "form_"+type+"_"+score_x;
            var textnode=document.createTextNode(score_x);
            newScore.appendChild(textnode);
            _form.appendChild(newScore);
            if(type=="h"){
                form_table.style = "--score_h: "+(score_x+1)+";--score_c: "+(score_y+1)+";";
            }else if(type=="c"){
                form_table.style = "--score_h: "+(score_y+1)+";--score_c: "+(score_x+1)+";";
            }

            for(var j=0; j<=score_y; j++){
                var targetColumn = (type=="h")?dom.getElementById("fore_"+(score_x-1)+"_"+j):dom.getElementById("fore_"+j+"_"+(score_x-1));
                var newColumn = document.createElement("div");
                if(type=="h"){
                    newColumn.id = "fore_"+score_x+"_"+j;
                    form_result.insertBefore(newColumn,targetColumn.nextSibling);
                }else{
                    newColumn.id = "fore_"+j+"_"+score_x;
                    form_result.appendChild(newColumn);
                }
            }
        }
    }

    _self.calResult = function(hash){
        console.log('遍历所有可能的比分')
        var maxW = 0;
        var maxL = 0;
        var minW = 0;
        var minL = 0;
        for(var scKey in hash){
            var val = hash[scKey]["wingold"]*1;
            if(val > 0){
                if(maxW==0) maxW = val;
                if(minW==0) minW = val;
                if(val > maxW) maxW = val;
                if(val < minW) minW = val;
            }else{
                if(maxL==0) maxL = val;
                if(minL==0) minL = val;
                if(val < maxL) maxL = val;
                if(val > minL) minL = val;
            }
        }
        var middleW = (maxW - minW) / 2;
        var middleL = (Math.abs(maxL) - Math.abs(minL)) / 2;

        winM_Range["S"] = (maxW - middleW);
        winM_Range["E"] = maxW;

        winL_Range["S"] = minW;
        winL_Range["E"] = (minW + middleW);

        lossM_Range["S"] = (Math.abs(maxL) - middleL)*-1;
        lossM_Range["E"] = maxL;

        lossL_Range["S"] = minL;
        lossL_Range["E"] = (Math.abs(minL) + middleL)*-1;

    }

    _self.transVal = function(val,langx){
        var ret = "";
        var isNegative = false;
        if(val<0) isNegative = true;
        var absVal = Math.abs(val);
        if(langx=="en-us"){
            if(absVal>=100000 && absVal<1000000){
                val = absVal/1000;
                ret = (Math.floor(val * 10) / 10).toFixed(1)+LS.get("gold_k");
            }else if(absVal>=1000000 && absVal<1000000000){
                val = absVal/1000000;
                ret = (Math.floor(val * 10) / 10).toFixed(1)+LS.get("gold_m");
            }else if(absVal>=1000000000){
                val = absVal/1000000000;
                ret = (Math.floor(val * 10) / 10).toFixed(1)+LS.get("gold_b");
            }else{
                if(val!=0){
                    val = absVal;
                    ret = util.addComma(Math.floor(val));
                }else{
                    ret = 0;
                }
            }
        }else{
            if(absVal>=100000 && absVal<10000000){
                val = absVal/10000;
                ret = (Math.floor(val * 10) / 10).toFixed(1)+LS.get("gold_10k");
            }else if(absVal>=10000000 && absVal<100000000){
                val = absVal/10000;
                ret = Math.floor(val)+LS.get("gold_10k");
            }else if(absVal>=100000000 && absVal<100000000000){
                val = absVal/100000000;
                ret = (Math.floor(val * 10) / 10).toFixed(1)+LS.get("gold_100m");
            }else if(absVal>=100000000000){
                val = absVal/100000000;
                ret = Math.floor(val)+LS.get("gold_100m");
            }else{
                if(val!=0){
                    val = absVal;
                    ret = util.addComma(Math.floor(val));
                }else{
                    ret = 0;
                }
            }
        }

        if(isNegative) ret = "-"+ret;

        return ret;
    }

    _self.setCenter = function(e,par){
        //console.log("nowScore:",nowScore);
        var score = nowScore;
        var nowScore_h = score.split(":")[0]*1;
        var nowScore_c = score.split(":")[1]*1;
        var table = dom.getElementById("form_table");
        var target = dom.getElementById("fore_"+nowScore_h+"_"+nowScore_c);

        table.scrollTop = target.offsetTop - (table.offsetHeight / 2) - table.offsetTop + (target.offsetHeight / 2);
        table.scrollLeft = target.offsetLeft - (table.offsetWidth / 2) - table.offsetLeft + (target.offsetWidth / 2);
    }

    _self.new_eval = function(str){
        var fn = Function;
        return new fn('return '+str)();
    }

    _self.createTimer=function(){
        var ret = _self.clearTimer();
        if(ret){
            var type = (showtype=="live")?"RB":"FT";
            if(timerHash[_name]!=null) return;
            timerHash[_name] = new Timer(config_set.get("CONFIG_GAME_MORE_"+type));
            timerHash[_name].setParentclass(_self);
            timerHash[_name].dont_clear = true;
            timerHash[_name].init();
            timerHash[_name].addEventListener("TimerEvent.TIMER", _self.timerRun);
            timerHash[_name].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish);
            timerHash[_name].startTimer();
        }
    }

    _self.startTimer=function(){
        if(timerHash[_name]==null){
            return;
        }
        if(!timerHash[_name].isRunning()){
            timerHash[_name].startTimer();
        }
    }

    _self.stopTimer=function(){
        if(timerHash[_name]==null){
            return;
        }
        timerHash[_name].stopTimer();
    }

    _self.clearTimer=function(){
        if(timerHash!=null){
            if(timerHash[_name]!=null){
                timerHash[_name].clearObj();
                timerHash[_name].is_clear = true;
                timerHash[_name]=null;
            }
        }
        return true;
    }

    _self.timerRun=function(){
        var par = new Object();
        par.restartTimer = "Y";
        if(top.forecast_sw)_self.getData();
        else {}
        // _self.closeForecast(null,par);
    }

    _self.timerFinish=function(){}

    _self.goToMore=function(){
        parentClass.dispatchEvent("removebodylock",{});
        console.log("关闭4")
        _self.closeForecast();
        var tarObj = postHash;
        var lid = _lid;
        var param = new Object();
        var _postHash = new Object();
        var isSpecialGame = (top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs")?"Y":"N";
        //if(new Date(_datetime.replace(/-/g,"/")) < new Date(_systime.replace(/-/g,"/")))_showtype = "live";
        if(_isRB == null)_isRB = (_showtype == "live")?"Y":"N";

        if(top.specialClick == "special")_postHash["specialClick"] = top.specialClick;

        _postHash["gtype"] = "ft";
        _postHash["showtype"] = showtype;

        top.choice_showtype = _postHash["showtype"];
        top.choice_gtype = _postHash["gtype"];

        _postHash["isRB"] = _isRB;
        _postHash["lid"] = lid;

        _postHash["league"] = leagueName;
        _postHash["team_h"] = teamH;
        _postHash["team_c"] = teamC;
        _postHash["score_h"] = (tarObj.score_h!=null)?tarObj.score_h:"0";
        _postHash["score_c"] = (tarObj.score_c!=null)?tarObj.score_c:"0";
        _postHash["retime"] = _retime;
        _postHash["datetime"] = _datetime;
        _postHash["allmarket"] = "Y";

        if(top.specialClick != ""){
            _postHash["specialClick"] = top.specialClick;
            param["specialClick"] = top.specialClick;
        }

        param["post"] = "showtype="+_postHash["showtype"]+"&isRB="+_isRB;

        _postHash["ecid"] = _ecid;
        _postHash["gidm"] = _gidm;
        _postHash["gid"] = _gid;
        param["page"] = "game_more_FT";

        param["postHash"] = _postHash;
        param["isRB"] = _isRB;
        param["isMyGame"] = (top.choice_showtype=="mygame")?"Y":"N";
        param["extendsClass"] = "game_more";
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.goToWagers=function(){
        console.log("关闭5")
        _self.closeForecast();
        var par = new Object();
        par["page"] = "today_wagers";
        par["type"] = "today_wagers";
        headerFrame.goPage(null,par);
    }

    //現有投注
    _self.doParseTodayWagers=function(wagers_data,gid){
        console.log('遍历投注记录数组',gid)
        var ratioForm = new win.ratioForm_Single_rule();
        var code = top["forecastData"]["code"];
        console.log('code',code)
        // if(code == "undefined"){
            var wagersData = wagers_data;
            console.log(wagers_data,'投注记录')
            var tmp_screen = "";
            var from = 0;
            var limit = _nowPage * _pageCount;
            var totalLength = (wagersData!=null)?wagersData.length:0;
            console.log(totalLength,'投注记录数组')
            if(totalLength >= 1){
                console.log(totalLength,'投注')
                _self.showNoTodayWagers(false);

                if(limit > totalLength)	limit = totalLength;
                console.log(limit)
                 console.log(totalLength)
                for(var i=from; i<limit; i++){
                    var div_model = "";
                    var team_ratio = "";
                    var gid_new = wagersData[i]["gid"];
                    var w_id = wagersData[i]["w_id"];
                    var t_id = _self.replaceOU(util.showTxt(w_id));
                    var addtime = wagersData[i]["addtime"];
                    var oddf_type = wagersData[i]["oddf_type"];
                    // var gtype = "足球";
                    var w_ms = wagersData[i]["w_ms"];
                    // var wtype = "";
                    // if(wagersData[i]["wtype"] == "R"){
                    //     wtype ="让球";
                    // }
                    // var bet_wtype = wagersData[i]["wtype"];//玩法
                    var gtype = wagersData[i]["gtype"];
                    var wtype = wagersData[i]["wtype"];
                    var bet_wtype = wagersData[i]["bet_wtype"];//玩法

                    if(bet_wtype=="RP" || bet_wtype=="P" || bet_wtype=="FS") continue;
                    var gold = wagersData[i]["bet_golds"];
                    var win_gold = wagersData[i]["win_gold"];
                    var ballact = wagersData[i]["ballact"];
                    var league = wagersData[i]["league"];
                    var team_h_show = wagersData[i]["team_h_show"];
                    var team_c_show = wagersData[i]["team_c_show"];
                    var team_h_ratio = wagersData[i]["team_h_ratio"];
                    var team_c_ratio = wagersData[i]["team_c_ratio"];
                    var org_score = wagersData[i]["org_score"];
                    var score = wagersData[i]["score"];
                    var result = wagersData[i]["result"];
                  //  if(wagersData[i]["chose_team"] == "C"){
                     //      result = wagersData[i]["team_c"];
                    //   }
                   //    if(wagersData[i]["chose_team"] == "H"){
                   //        result = wagersData[i]["team_h"];
                   //    }
                    var spread = wagersData[i]["spread"];
                    var strong = wagersData[i]["strong"];
                    var pname = wagersData[i]["pname"];
                    var ioratio = wagersData[i]["ioratio"];
                    var dg = wagersData[i]["dg"];
                    var dg_str = wagersData[i]["dg_str"];
                    var ball_act_class = wagersData[i]["ball_act_class"];
                    var ball_act_ret = wagersData[i]["ball_act_ret"];
                    win_gold = util.showTxt(win_gold);
                    gold = util.showTxt(gold);

                    div_model = dom.getElementById("fore_normal_model").innerHTML;

                    div_model = div_model.replace("<XMP>","").replace("</XMP>","").replace("<xmp>","").replace("</xmp>","");
                    div_model = div_model.replace(/\*TID\*/g,util.showTxt(t_id));
                    div_model = div_model.replace(/\*W_ID\*/g,util.showTxt(w_id));
                    div_model = div_model.replace(/\*ADDTIME\*/g,util.showTxt(addtime));
                    if(bet_wtype == "P") {
                        div_model = div_model.replace(/\*ODDF_TYPE\*/g, "");
                    }else{
                        div_model = div_model.replace(/\*ODDF_TYPE\*/g,util.showTxt(oddf_type));
                    }
                    div_model = div_model.replace(/\*GTYPE\*/g,util.showTxt(gtype));
                    div_model = div_model.replace(/\*W_MS\*/g,util.showTxt(w_ms));
                    div_model = div_model.replace(/\*WTYPE\*/g,util.showTxt(wtype));
                    div_model = div_model.replace(/\*LEAGUE\*/g,util.showTxt(league));
                    div_model = div_model.replace(/\*TEAM_H_SHOW\*/g,util.showTxt(team_h_show));
                    div_model = div_model.replace(/\*TEAM_C_SHOW\*/g,util.showTxt(team_c_show));
                    if(team_h_show == "" && team_c_show == ""){
                        div_model = div_model.replace(/\*TEAM_ACT\*/g,"display:none;");
                    }else{
                        div_model = div_model.replace(/\*TEAM_ACT\*/g,"display:;");
                    }
                    console.log("调试6", w_id,t_id);

                    if (bet_wtype == undefined){
                        // bet_wtype = wagersData[i]["wtype"];//todo
                        bet_wtype = "RE";
                    }

                    if(util_game.checkWtypeIsR(bet_wtype)){
                        var color = "word_yellow";
                        if(bet_wtype == "W3")color = "word_red";
                        div_model = div_model.replace(/\*TEAM_H_RATIO\*/g,"");
                        div_model = div_model.replace(/\*TEAM_C_RATIO\*/g,"");
                        div_model = div_model.replace(/\*CHOICE_CON_CLASS\*/g,color);
                            team_ratio = team_h_ratio!=''?team_h_ratio:team_c_ratio;
                        // console.log('>>>>>>>zuizhong1111111111111d>>>>>>>',team_h_ratio)
                        // console.log('>>>>>>>zuizhong1222222221d>>>>>>>',team_c_ratio)
                        // team_ratio = spread;
                        if(team_ratio!=0){
                            if(strong=="Y")team_ratio = "-"+team_ratio;
                            else team_ratio = "+"+team_ratio;
                        }
                    }else{
                        div_model = div_model.replace(/\*TEAM_H_RATIO\*/g,util.showTxt(team_h_ratio));
                        div_model = div_model.replace(/\*TEAM_C_RATIO\*/g,util.showTxt(team_c_ratio));
                        div_model = div_model.replace(/\*CHOICE_CON_CLASS\*/g,"word_red");
                    }
                    div_model = div_model.replace(/\*ORG_SCORE\*/g,util.showTxt(org_score));
                    div_model = div_model.replace(/\*SCORE\*/g,util.showTxt(score));
                    div_model = div_model.replace(/\*PNAME\*/g,util.showTxt(pname));
                    div_model = div_model.replace(/\*IORATIO\*/g,ioratio<0?"<font class='word_blue'>"+ratioForm.chgForm_Single_ratio(ioratio,bet_wtype)+"</font>":ratioForm.chgForm_Single_ratio(ioratio,bet_wtype));
                    if(ball_act_ret == "" ){
                        div_model = div_model.replace(/\*DG_CANCEL\*/g,"display:none;");
                        div_model = div_model.replace(/\*DG_STR\*/g,'');
                        div_model = div_model.replace(/\*BALL_ACT\*/g,"display:none;");
                        div_model = div_model.replace(/\*BALL_ACT_CLASS\*/g,"");
                        div_model = div_model.replace(/\*BALL_ACT_RET\*/g,"");
                    }else{
                        if(dg=="Y" && ball_act_class!="word_yellow"){
                            div_model = div_model.replace(/\*DG_CANCEL\*/g,"display:;");
                            div_model = div_model.replace(/\*DG_STR\*/g,util.showTxt(dg_str));
                            div_model = div_model.replace(/\*BALL_ACT\*/g,"display:;");
                            div_model = div_model.replace(/\*BALL_ACT_CLASS\*/g,"word_red");
                            div_model = div_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(ball_act_ret));
                        }else{
                            if (ball_act_class=="word_yellow" && ballact > "0"){
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

                    if(util.checkWtypeIsOU(bet_wtype)){
                        // console.log(result,'>>>>>>>zuizhongd>>>>>>>')
                        var choice_blank = result.indexOf(" ");
                        var choice_str = result.substr(0,choice_blank);
                        var choice_con = result.substr(choice_blank,result.length-1);
                        console.log(choice_str,'>>>>>>>zuizhong1111111111111d>>>>>>>')
                        console.log(choice_con,'>>>>>>>zuizhongd222222222222>>>>>>>')
                        div_model = div_model.replace(/\*CHOICE_TEAM\*/g,util.showTxt(choice_str));
                        div_model = div_model.replace(/\*CHOICE_CON\*/g,util.showTxt(choice_con));
                        // div_model = div_model.replace(/\*CHOICE_TEAM\*/g,util.showTxt(result));
                        // div_model = div_model.replace(/\*CHOICE_CON\*/g,team_ratio);
                    }else if(bet_wtype=="W3"){
                        var choiceAry = result.split(" ");
                        var choice_con = choiceAry[choiceAry.length-1];
                        var choice_str = result.split(choice_con)[0];
                        div_model = div_model.replace(/\*CHOICE_TEAM\*/g,util.showTxt(choice_str));
                        div_model = div_model.replace(/\*CHOICE_CON\*/g,util.showTxt(choice_con));
                        console.log(choice_str,'>>>>>>>zuizhong444441d>>>>>>>')
                        console.log(choice_con,'>>>>>>>zuizhongd24444444442>>>>>>>')
                    }else{
                        div_model = div_model.replace(/\*CHOICE_TEAM\*/g,util.showTxt(result));
                        div_model = div_model.replace(/\*CHOICE_CON\*/g,team_ratio);
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
                    div_model = div_model.replace(/\*DIS_APN\*/g,"display:none;");
                    div_model = div_model.replace(/\*DIS_TITLE\*/g,"display:none;");

                    tmp_screen += div_model;
                }
                console.log("><<<<<<<<<<<<<<<tmp_screen>>>>>>>>>>>>>>",tmp_screen);
                dom.getElementById("fore_wagers").innerHTML = tmp_screen;

                var totalPage = Math.ceil(totalLength / _pageCount);
                if(_nowPage >= totalPage) dom.getElementById("fore_allsports").style.display = "none";
            }else{
                _self.showNoTodayWagers(true);
            }
        // }else{
         //    _self.showNoTodayWagers(true);
        // }
    }

    _self.showNoTodayWagers=function(isShow){
        console.log('投注记录是否显示',isShow)
        if(isShow){
            dom.getElementById("fore_wagers").style.display = "none";
            dom.getElementById("fore_allsports").style.display = "none";
            dom.getElementById("fore_betlist").style.display = "none";
            dom.getElementById("fore_note").style.display = "none";
        }else{
            dom.getElementById("fore_wagers").style.display = "";
            dom.getElementById("fore_allsports").style.display = "";
            dom.getElementById("fore_betlist").style.display = "";
            dom.getElementById("fore_note").style.display = "";
        }
    }

    _self.replaceOU=function(txt){
        txt = txt.replace(/OU/g,"");
        txt = txt.replace(/DT/g,"");
        txt = txt.replace(/P3/g,"");
        return txt;
    }

    _self.showViewMore=function(){
        _nowPage++;
        _self.doParseTodayWagers(wagers_data,now_id);
    }

    _self.showKnowMore=function(){
        util.addClass(dom.getElementById("know_content"),"on");
    }

    _self.closeKnowMore=function(){
        util.removeClass(dom.getElementById("know_content"),"on");
    }

    _self.transShowtype = function(showtype){
        var hash = new Object();
        hash[showtype] = showtype;
        hash["RB"] = "live";
        hash["FT"] = "today";
        hash["FU"] = "early";
        hash["EM"] = "early";
        return hash[showtype];
    }

    _self.showForecastLoading = function(isShow,className){
        //console.log("[showForecastLoading]",isShow,className);
        if(isShow){
            util.addClass(dom.getElementById("fore_loading"),className);
        }else{
            util.removeClass(dom.getElementById("fore_loading"),className);
        }
    }

    _self.updateForecast = function(){
        needReload = true;
        _self.getScoreRec(now_id);
    }

    _self.closeForecast=function(e,par){
        console.trace("---forecast.js========關閉預測賽果========",par);
        _self.clearTimer();
        _self.closeKnowMore();
        util.removeClass(dom.getElementById("forecast_show"), "on");
        util.removeClass(dom.getElementById("body_show"), "scroll_lock");
        if (!top.forecast_sw) parentClass.dispatchEvent("resetForecast", {});
        if (par && par.restartTimer == "Y") parentClass.dispatchEvent("restartTimer", {})
    }

    _self.setOriTable = function(){
        oriTable = dom.getElementById("form_table").innerHTML;
    }

    _self.setOriScoreBoard = function(){
        oriScoreBoard = dom.getElementById("fore_score").innerHTML;
    }

    _self.setEcid = function (id) {
        ecid = id
    }
}
function config_set_new2() {
    var _self = this;
    var parentClass;
    var ConfigAry;
    _self.init = function () {
        ConfigAry = _self.set()
    };
    _self.set = function () {
        var ary = new Object;
        ary["CONFIG_BASE"] = 1E3;
        ary["GTYPEARY"] = new Array("FT", "BK", "TN", "VB", "BM", "TT", "BS", "SK", "OP");
        ary["SHOWTYPEARY"] = new Array("live", "today", "early");
        ary["RTYPEARY"] = new Array("rb", "r", "r");
        ary["RMB"] = new Array("10", "100", "500");
        ary["HKD"] = new Array("100", "500", "1,000");
        ary["USD"] = new Array("10", "50", "100");
        ary["MYR"] = new Array("50", "200", "500");
        ary["SGD"] =
            new Array("20", "50", "100");
        ary["THB"] = new Array("50", "1,000", "2,000");
        ary["GBP"] = new Array("10", "50", "100");
        ary["JPY"] = new Array("500", "1,000", "5,000");
        ary["EUR"] = new Array("10", "50", "100");
        ary["IDR"] = new Array("100,000", "250,000", "500,000");
        ary["RETRY_LIMIT"] = 4;
        ary["RETRY_TIME"] = 5E3;
        ary["AD_TIME"] = 5E3;
        ary["RESEND_TIME"] = 5E3;
        ary["CLASSIFIER_DEFAULT_OPEN"] = 10;
        ary["CLASSIFIER_LEAGUE_LIMIT"] = 8;
        ary["CONFIG_NETWORK_CHECK"] = 120 * ary["CONFIG_BASE"];
        ary["CONFIG_MYGAME_CHECK"] = 120 * ary["CONFIG_BASE"];
        ary["CONFIG_MEMBER_CREDIT"] =
            180 * ary["CONFIG_BASE"];
        ary["CONFIG_MEMBER_ONLINE"] = 180 * ary["CONFIG_BASE"];
        ary["CONFIG_SPECIAL_COUNT"] = 90 * ary["CONFIG_BASE"];
        ary["CONFIG_LEAGUE_COUNT"] = 90 * ary["CONFIG_BASE"];
        ary["CONFIG_LEAGUE_LIST"] = 90 * ary["CONFIG_BASE"];
        ary["CONFIG_GAME_MORE_RB"] = 10 * ary["CONFIG_BASE"];
        ary["CONFIG_GAME_MORE_FT"] = 90 * ary["CONFIG_BASE"];
        ary["CONFIG_MSG_COUNT"] = 180 * ary["CONFIG_BASE"];
        ary["CONFIG_GAME_MORE"] = 90 * ary["CONFIG_BASE"];
        ary["CONFIG_LIVE_LEAGUE_LIST"] = 10 * ary["CONFIG_BASE"];
        ary["CONFIG_LIVE_GAME_LIST"] = 20 * ary["CONFIG_BASE"];
        ary["CONFIG_GAME_LIST"] = 60 * ary["CONFIG_BASE"];
        ary["CONFIG_PARLAY_GAME_LIST"] = 30 * ary["CONFIG_BASE"];
        ary["CONFIG_MYGAME_GAME_LIST"] = 30 * ary["CONFIG_BASE"];
        ary["CONFIG_MYGAME_DEL_COOKIE"] = 300 * ary["CONFIG_BASE"];
        ary["TAB_BLOCK_SW"] = true;
        ary["CONFIG_LIVE_GAME_MORE"] = 10 * ary["CONFIG_BASE"];
        ary["CONFIG_ORDER_VIEW"] = 10 * ary["CONFIG_BASE"];
        ary["CONFIG_TODAY_WAGERS"] = 90 * ary["CONFIG_BASE"];
        ary["CONFIG_DANGEROUS"] = 5 * ary["CONFIG_BASE"];
        ary["CONFIG_BETHOLD"] = ary["CONFIG_BASE"];
        ary["CONFIG_IORATIO"] = 2;
        ary["CONFIG_SFS_COUNT"] =
            5;
        ary["CONFIG_BETGOLD_LENGTH"] = 10;
        ary["CONFIG_FIX_CHECK"] = true;
        ary["CONFIG_LOGIN_DOMAIN_CHECK"] = true;
        ary["CONFIG_FIX"] = 20 * ary["CONFIG_BASE"];
        ary["CONFIG_MEM_ONLINE"] = 180 * ary["CONFIG_BASE"];
        ary["CONFIG_IP_ENABLE"] = false;
        ary["CONFIG_LIST_TV"] = 90 * ary["CONFIG_BASE"];
        ary["CONFIG_DELAY_TIME"] = ary["CONFIG_BASE"];
        ary["CONFIG_DOMAIN"] = 60 * ary["CONFIG_BASE"];
        ary["CONFIG_RIGHT_PANEL"] = 60 * ary["CONFIG_BASE"];
        ary["CONFIG_CHECK_VERSION"] = 60 * ary["CONFIG_BASE"];
        ary["CONFIG_GET_SYSTEMTIME"] = 20 * ary["CONFIG_BASE"];
        ary["LAZY_SW"] =
            true;
        ary["LAZY_COUNT"] = 2;
        ary["LAZY_COUNT_BIG_PAGE"] = 20;
        ary["CLUSTERIZE_SW"] = true;
        ary["CLUSTERIZE_ROW"] = 3;
        ary["CLUSTERIZE_BLOCKS"] = 2;
        ary["CLUSTERIZE_LIMIT_S"] = 600;
        ary["CLUSTERIZE_LIMIT_M"] = 800;
        ary["CLUSTERIZE_LIMIT_L"] = 1300;
        ary["DEFINED_ROWHEIGHT"] = new Array;
        ary["DEFINED_ROWHEIGHT"]["LEAGUE_FIX"] = 56;
        ary["DEFINED_ROWHEIGHT"]["GAME_FIX"] = 224;
        ary["DEFINED_ROWHEIGHT"]["OBTMENU_FIX"] = 49;
        ary["DEFINED_ROWHEIGHT"]["LEAGUEBORDER_FIX"] = 8;
        ary["DEFINED_ROWHEIGHT"]["GAMEBORDER_FIX"] = 2;
        ary["DEFINED_ROWHEIGHT"]["PK_FIX"] =
            40;
        ary["DEFINED_ROWHEIGHT"]["BOTTOM_MARGIN"] = 16;
        ary["PAGELIMIT"] = 5;
        ary["CLOSELEGLIMIT"] = 15;
        ary["PAGE_SW"] = false;
        ary["PAGE_SETTING_MORE"] = 5;
        ary["PAGE_SETTING_LESS"] = 3;
        ary["IOS15"] = new Array;
        ary["IOS15"]["PHONE_12+"] = new Object;
        ary["IOS15"]["PHONE_12+"]["TOP_HEIGHT"] = 663;
        ary["IOS15"]["PHONE_12+"]["BTM_HEIGHT"] = 664;
        ary["IOS15"]["PHONE_12+_MINI"] = new Object;
        ary["IOS15"]["PHONE_12+_MINI"]["TOP_HEIGHT"] = 628;
        ary["IOS15"]["PHONE_12+_MINI"]["BTM_HEIGHT"] = 629;
        ary["IOS15"]["PHONE_12+_PRO_MAX"] = new Object;
        ary["IOS15"]["PHONE_12+_PRO_MAX"]["TOP_HEIGHT"] =
            745;
        ary["IOS15"]["PHONE_12+_PRO_MAX"]["BTM_HEIGHT"] = 746;
        ary["IOS15"]["PHONE_X+"] = new Object;
        ary["IOS15"]["PHONE_X+"]["TOP_HEIGHT"] = 714;
        ary["IOS15"]["PHONE_X+"]["BTM_HEIGHT"] = 715;
        ary["IOS15"]["PHONE_X+_PRO"] = new Object;
        ary["IOS15"]["PHONE_X+_PRO"]["TOP_HEIGHT"] = 634;
        ary["IOS15"]["PHONE_X+_PRO"]["BTM_HEIGHT"] = 635;
        ary["IOS15"]["PHONE_X+_PRO_MAX"] = new Object;
        ary["IOS15"]["PHONE_X+_PRO_MAX"]["TOP_HEIGHT"] = 718;
        ary["IOS15"]["PHONE_X+_PRO_MAX"]["BTM_HEIGHT"] = 719;
        ary["IOS15"]["PHONE_6+"] = new Object;
        ary["IOS15"]["PHONE_6+"]["HEIGHT"] =
            625;
        ary["IOS15"]["PHONE_6+_PLUS"] = new Object;
        ary["IOS15"]["PHONE_6+_PLUS"]["HEIGHT"] = 694;
        return ary
    };
    _self.get = function (_key) {
        return ConfigAry[_key]
    }
};