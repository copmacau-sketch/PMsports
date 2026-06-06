  function game_more_BK(_win, _dom, _post) {
                var classname = "game_more_BK";
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var tv;
                var mt;
                var LS_game;
                var _xmlnode;
                var scDataObj;
                var over1024 = getView().viewportwidth >= 1024;
                var util = new win.Util(win,dom);
                var util_game = new win.Util_game(win,dom);
                var team_RegExp = new RegExp(" - \([^\)]+\)");
                var wtypeFun = new Object;
                var rtypeFun = new Object;
                var pageFilterFun = new Object;
                var wtypeHash = new Array;
                var rtypeHash = new Object;
                var pageFilterHash = new Object;
                var headerHash = new Array;
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
                var se_now_end_str = "";
                _self.init = function() {
                    LS_game = _self.new_eval("new LS_game_" + ls + "();");
                    LS_game.init();
                    _self.initFun();
                    _self.getHash();
                    _self.pageFilterHeader(headerHash, pageFilterHash);
                    _self.reInit(_self, classname, wtypeHash, rtypeHash, _self.getDataComplete, _self.getXmlNode);
                    parentClass = _self._super.parentClass;
                    util = _self._super.util;
                    util_game = _self._super.util_game;
                    tv = _self._super.tv;
                    mt = _self._super.mt
                }
                ;
                _self.initFun = function() {
                    wtypeFun["live"] = _self.getWtypeRB;
                    wtypeFun["today"] = _self.getWtypeFT;
                    wtypeFun["early"] = wtypeFun["today"];
                    wtypeFun["parlay"] = wtypeFun["today"];
                    rtypeFun["live"] = _self.getRtypeRB;
                    rtypeFun["today"] = _self.getRtypeFT;
                    rtypeFun["early"] = rtypeFun["today"];
                    rtypeFun["parlay"] = rtypeFun["today"];
                    pageFilterFun["today"] = _self.getFilterHeaderFT;
                    pageFilterFun["early"] = pageFilterFun["today"];
                    pageFilterFun["parlay"] = pageFilterFun["today"]
                }
                ;
                _self.getHash = function() {
                    try {
                        wtypeHash = wtypeFun[showtype]();
                        rtypeHash = rtypeFun[showtype]();
                        pageFilterHash = pageFilterFun[showtype]();
                        headerHash = new Array("Main","Match","Halves","Quarters","Others","All")
                    } catch (e) {}
                }
                ;
                _self.getWtypeRB = function() {
                    var ary = new Object;
                    ary["FT"] = _self.getWtypeRB_FT();
                    return ary
                }
                ;
                _self.getFilterHeaderFT = function() {
                    var ary = new Object;
                    ary["Main"] = new Array("0_R","0_OU","0_OUH","0_OUC","1_R","1_OU","1_OUH","1_OUC","3_R","3_OU","3_OUH","3_OUC","4_R","4_OU","4_OUH","4_OUC","5_R","5_OU","5_OUH","5_OUC","6_R","6_OU","6_OUH","6_OUC","2_R","2_OU","2_OUH","2_OUC","0_M","1_M","2_M","3_M","4_M","5_M","6_M","0_EO","1_EO","2_EO","3_EO","4_EO","5_EO","6_EO","0_WM","1_WM","3_WM");
                    ary["Match"] = new Array("0_R","0_OU","0_OUH","0_OUC","0_M","0_EO","0_WM");
                    ary["Halves"] = new Array("1_R","1_OU","1_OUH","1_OUC","2_R","2_OU","2_OUH","2_OUC","1_M","2_M","1_EO","2_EO","1_WM","2_WM");
                    ary["Quarters"] = new Array("3_R","3_OU","3_OUH","3_OUC","4_R","4_OU","4_OUH","4_OUC","5_R","5_OU","5_OUH","5_OUC","6_R","6_OU","6_OUH","6_OUC","3_M","4_M","5_M","6_M","3_EO","4_EO","5_EO","6_EO","3_WM","4_WM","5_WM","6_WM");
                    ary["Others"] = new Array("0_PDH","0_PDC");
                    ary["All"] = new Array("0_R","0_OU","0_WM","0_OUH","0_OUC","1_R","1_OU","1_WM","1_OUH","1_OUC","3_R","3_OU","3_WM","3_OUH","3_OUC","4_R","4_OU","4_WM","4_OUH","4_OUC","5_R","5_OU","5_WM","5_OUH","5_OUC","6_R","6_OU","6_WM","6_OUH","6_OUC","2_R","2_OU","2_WM","2_OUH","2_OUC","0_M","1_M","2_M","3_M","4_M","5_M","6_M","0_EO","1_EO","2_EO","3_EO","4_EO","5_EO","6_EO","0_PDH","0_PDC");
                    return ary
                }
                ;
                _self.getWtypeFT = function() {
                    var ary = new Object;
                    ary["FT"] = _self.getWtypeFT_FT();
                    return ary
                }
                ;
                _self.getWtypeRB_FT = function() {
                    var ary = new Array;
                    ary.push("0_RE");
                    ary.push("0_ROU");
                    ary.push("0_RWM");
                    ary.push("0_ROUH");
                    ary.push("0_ROUC");
                    ary.push("1_RE");
                    ary.push("1_ROU");
                    ary.push("1_RWM");
                    ary.push("1_ROUH");
                    ary.push("1_ROUC");
                    ary.push("3_RE");
                    ary.push("3_ROU");
                    ary.push("3_RWM");
                    ary.push("3_ROUH");
                    ary.push("3_ROUC");
                    ary.push("4_RE");
                    ary.push("4_ROU");
                    ary.push("4_RWM");
                    ary.push("4_ROUH");
                    ary.push("4_ROUC");
                    ary.push("5_RE");
                    ary.push("5_ROU");
                    ary.push("5_RWM");
                    ary.push("5_ROUH");
                    ary.push("5_ROUC");
                    ary.push("6_RE");
                    ary.push("6_ROU");
                    ary.push("6_RWM");
                    ary.push("6_ROUH");
                    ary.push("6_ROUC");
                    ary.push("2_RE");
                    ary.push("2_ROU");
                    ary.push("2_RWM");
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
                    return ary
                }
                ;
                _self.getRtypeRB = function() {
                    var ary = new Object;
                    ary["RE"] = new Array("REH","REC");
                    ary["ROU"] = new Array("ROUH","ROUC");
                    ary["ROUH"] = new Array("ROUHO","ROUHU");
                    ary["ROUC"] = new Array("ROUCO","ROUCU");
                    ary["RPDH"] = new Array("RPDH0","RPDH1","RPDH2","RPDH3","RPDH4");
                    ary["RPDC"] = new Array("RPDC0","RPDC1","RPDC2","RPDC3","RPDC4");
                    ary["RM"] = new Array("RMH","RMC");
                    ary["REO"] = new Array("REOO","REOE");
                    ary["RWMA"] = new Array("RWMAH1","RWMAC1","RWMAH2","RWMAC2","RWMAH3","RWMAC3","RWMAH4","RWMAC4","RWMAH5","RWMAC5","RWMAHOV","RWMACOV");
                    ary["RWMB"] = new Array("RWMBH1","RWMBC1","RWMBHOV","RWMBCOV","RWMBOT");
                    ary["RWMC"] = new Array("RWMCHOV","RWMCCOV","RWMCOT");
                    return ary
                }
                ;
                _self.getWtypeFT_FT = function() {
                    var ary = new Array;
                    ary.push("0_R");
                    ary.push("0_OU");
                    ary.push("0_WM");
                    ary.push("0_OUH");
                    ary.push("0_OUC");
                    ary.push("1_R");
                    ary.push("1_OU");
                    ary.push("1_WM");
                    ary.push("1_OUH");
                    ary.push("1_OUC");
                    ary.push("3_R");
                    ary.push("3_OU");
                    ary.push("3_WM");
                    ary.push("3_OUH");
                    ary.push("3_OUC");
                    ary.push("4_R");
                    ary.push("4_OU");
                    ary.push("4_WM");
                    ary.push("4_OUH");
                    ary.push("4_OUC");
                    ary.push("5_R");
                    ary.push("5_OU");
                    ary.push("5_WM");
                    ary.push("5_OUH");
                    ary.push("5_OUC");
                    ary.push("6_R");
                    ary.push("6_OU");
                    ary.push("6_WM");
                    ary.push("6_OUH");
                    ary.push("6_OUC");
                    ary.push("2_R");
                    ary.push("2_OU");
                    ary.push("2_WM");
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
                    return ary
                }
                ;
                _self.getRtypeFT = function() {
                    var ary = new Object;
                    ary["R"] = new Array("RH","RC");
                    ary["OU"] = new Array("OUH","OUC");
                    ary["OUH"] = new Array("OUHO","OUHU");
                    ary["OUC"] = new Array("OUCO","OUCU");
                    ary["PDH"] = new Array("PDH0","PDH1","PDH2","PDH3","PDH4");
                    ary["PDC"] = new Array("PDC0","PDC1","PDC2","PDC3","PDC4");
                    ary["M"] = new Array("MH","MC");
                    ary["EO"] = new Array("EOO","EOE");
                    ary["WMA"] = new Array("WMAH1","WMAC1","WMAH2","WMAC2","WMAH3","WMAC3","WMAH4","WMAC4","WMAH5","WMAC5","WMAHOV","WMACOV");
                    ary["WMB"] = new Array("WMBH1","WMBC1","WMBHOV","WMBCOV","WMBOT");
                    ary["WMC"] = new Array("WMCHOV","WMCCOV","WMCOT");
                    return ary
                }
                ;
                _self.getXmlNode = function() {
                    return _xmlnode
                }
                ;
                _self.getDataComplete = function(jsonData, OuterOpen, nowfilter) {
                    var errorMsg = util.showConnectMsg(jsonData);
                    if (util.alertConnectMsg(errorMsg)) {
                        parentClass.dispatchEvent("showLoading", {"isShow": false});
                        return;
                    }
                    var parseJson;
                    try {
                        parseJson = JSON.parse(jsonData);
                    } catch (e) {
                        console.log("[game_more_BK][getDataComplete] response not valid JSON", e);
                        _self.checkHasGame(false);
                        parentClass.dispatchEvent("showLoading", {"isShow": false});
                        if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("setRightLoading", {"isShow": false});
                        return;
                    }
                    var code = parseJson["code"];
                    if (code == "Its not special") {
                        _self.checkHasGame(false);
                        if (top.rightECID != "")
                            parentClass.dispatchEvent("noGameCheckLive", {
                                "eventid_ph": "",
                                "center_tv": ""
                            });
                        parentClass.dispatchEvent("showLoading", {"isShow": false});
                        return
                    }
                    var status = parseJson["status"];
                    var dataObj = parseJson["response"];
                    var gameObj = dataObj && dataObj["GAMES"] ? dataObj["GAMES"] : null;
                    if (!dataObj || !gameObj) {
                        _self.checkHasGame(false);
                        parentClass.dispatchEvent("showLoading", {"isShow": false});
                        if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("setRightLoading", {"isShow": false});
                        return;
                    }
                    var scoreObj = new Array;
                    var videoObj = parseJson["response"]["VIDEO"];
                    var phpData = parseJson["phpData"];
                    var game = new Array;
                    var gameHash = new Array;
                    var mainGame = null;
                    if (status == "success") {
                        _self.setJSON(jsonData);
                        _self.setVIDEOobj(videoObj);
                        for (var g = 0; g < util.countSize(gameObj); g++) {
                            var tmpGameObj = gameObj["GAME" + g];
                            game.push(tmpGameObj);
                            if (tmpGameObj["IS_MASTER"] == "Y") {
                                mainGame = tmpGameObj;
                                scoreObj = mainGame["SCORE"]
                            }
                        }
                        if (mainGame == null)
                            mainGame = gameObj["GAME0"];
                        var filter = nowfilter ? nowfilter : phpData["filter"];
                        var tmpTS = dataObj["ts"];
                        var gidm = mainGame["GIDM"];
                        var hasGame = false;
                        var _id, gdata;
                        if (game.length > 0) {
                            var gidHash = new Object;
                            for (var i = 0; i < game.length; i++) {
                                var tmp_ms = game[i]["MS"];
                                var ms = tmp_ms != "" && tmp_ms != null ? tmp_ms.split("_")[1] : "0";
                                gdata = game[i];
                                _id = gdata["GID"];
                                if (gidHash[ms] == null)
                                    gidHash[ms] = new Array;
                                gameHash[_id] = gdata;
                                gidHash[ms].push(_id)
                            }
                            top.resize_mainGame = mainGame;
                            top.rightFrom = "game_more";
                            var intoRB = _self.checkIntoRB(null, mainGame);
                            if (intoRB)
                                return;
                            var gopen = mainGame["GOPEN"];
                            var Live = mainGame["IS_LIVE"];
                            scDataObj = _self.setScoreBoard(mainGame, showtype, gopen, Live, OuterOpen, LS_game, scoreObj);
                            top.scDataObj = scDataObj;
                            _self.setObj(scDataObj);
                            _self.parseScoreBoard(scDataObj, "More");
                            if (getView().viewportwidth >= 1024) {
                                parentClass.dispatchEvent("parseRightScoreBoard", scDataObj);
                                parentClass.dispatchEvent("checkRightLive", {
                                    "videoObj": videoObj,
                                    "mainGame": mainGame,
                                    "format": "json"
                                });
                                parentClass.dispatchEvent("setRightLoading", {
                                    "isShow": false
                                })
                            } else if (showtype == "live")
                                _self.checkLiveJson(videoObj, mainGame, tv, mt);
                            else
                                _self.checkLiveJson(videoObj, mainGame, tv, mt, "game_more");
                            var parseParam = {
                                "id": gidm,
                                "nowMode": "FT",
                                "gidHash": gidHash,
                                "game": game,
                                "ts": tmpTS,
                                "gameHash": gameHash
                            };
                            _self.setParseParam(parseParam);
                            if (dataObj["ALL_CLOSE"] != "Y")
                                hasGame = _self.parseJsonData(parseParam);
                            else
                                hasGame = false;
                            _self.setScrollToTop()
                        } else {
                            var defObj = new Object;
                            defObj.def_league = def_league;
                            defObj.def_team_h = def_team_h;
                            defObj.def_team_c = def_team_c;
                            defObj.def_datetime = def_datetime;
                            defObj.def_best = def_best;
                            _self.parseNoGameScoreBoard(defObj);
                            top.resize_mainGame = null;
                            top.scDataObj = null;
                            var eventid_ph = videoObj["TV_ID"];
                            var center_tv = videoObj["CENTER_TV"];
                            var eventid_mt = videoObj["MT_ID"];
                            var mtgtype = videoObj["MT_GTYPE"];
                            var mtspid = videoObj["MT_SID"];
                            var lineups = videoObj["MT_LINEUPS"];
                            var MT_data = new Object;
                            MT_data["gtype"] = mtgtype;
                            MT_data["spid"] = mtspid;
                            if (getView().viewportwidth >= 1024) {
                                parentClass.dispatchEvent("parseNoGameRightScoreBoard", defObj);
                                parentClass.dispatchEvent("noGameCheckLive", {
                                    "eventid_ph": eventid_ph,
                                    "center_tv": center_tv,
                                    "eventid_mt": eventid_mt,
                                    "MT_data": MT_data,
                                    "lineups": lineups,
                                    "from": "game_more"
                                })
                            } else
                                _self.checkLiveProc(eventid_ph, center_tv, eventid_mt, MT_data, lineups, tv, mt)
                        }
                        _self.checkHasGame(hasGame)
                    } else {
                        var defObj = new Object;
                        defObj.def_league = def_league;
                        defObj.def_team_h = def_team_h;
                        defObj.def_team_c = def_team_c;
                        defObj.def_datetime = def_datetime;
                        _self.parseNoGameScoreBoard(defObj);
                        top.resize_mainGame = null;
                        top.scDataObj = null
                    }
                    if (top.choice_gtype == "bk" && showtype != "live")
                        setTimeout(_self.showFilterLoading, 300, false);
                    parentClass.dispatchEvent("showLoading", {
                        "isShow": false,
                        "from": classname
                    })
                }
                ;
                _self.parseNoGameScoreBoard = function(obj) {
                    score_H_FT = "";
                    score_A_FT = "";
                    t_count = "";
                    se_now_end_str = "";
                    if (get("league"))
                        get("league").innerHTML = util_game.showTxt(obj.def_league);
                    get("team_h").innerHTML = util_game.showTxt(obj.def_team_h);
                    get("team_c").innerHTML = util_game.showTxt(obj.def_team_c);
                    get("midfield").style.display = "none";
                    if (showtype == "live") {
                        get("se_now").innerHTML = util_game.showTxt(se_now_end_str);
                        get("t_count").innerHTML = util_game.showTxt(t_count);
                        get("sc_FT_H").innerHTML = util_game.showTxt(score_H_FT);
                        get("sc_FT_A").innerHTML = util_game.showTxt(score_A_FT);
                        if (score_H_FT == "") {
                            get("box_sco_bk").style.display = "none";
                            get("box_sco_point").style.display = "none"
                        } else {
                            get("box_sco_bk").style.display = "";
                            get("box_sco_point").style.display = ""
                        }
                    } else
                        get("game_time").innerHTML = util_game.showTxt(obj.def_datetime)
                }
                ;
                _self.setScoreBoard = function(mainGame, showtype, gopen, Live, OuterOpen, LS_game, scoreObj) {
                    if (mainGame != null) {
                        var league = mainGame["LEAGUE"];
                        var midfield = mainGame["MIDFIELD"];
                        var team_h = mainGame["TEAM_H"];
                        var team_c = mainGame["TEAM_C"];
                        var limit_min = mainGame["LIMIT_MIN"];
                        var HalfTime = mainGame["HALFTIME"];
                        t_count = mainGame["T_COUNT"];
                        if (isNaN(t_count) || t_count < 0)
                            t_count = 0;
                        var TimeM = Math.floor(t_count / 60);
                        var TimeS = t_count % 60;
                        if (TimeM < 10)
                            TimeM = "0" + TimeM;
                        if (TimeS < 10)
                            TimeS = "0" + TimeS;
                        t_count = TimeM + ":" + TimeS;
                        var se_now = mainGame["SE_NOW"];
                        var se_now_str = "";
                        if (se_now == "HT")
                            se_now_str = "1H";
                        else if (se_now == "H2")
                            se_now_str = "2H";
                        else
                            se_now_str = se_now;
                        var se_num = 0;
                        if (se_now)
                            se_num = se_now.substr(1, 1) * 1;
                        if (se_now == "HT")
                            se_num = 1;
                        var se_type = mainGame["SE_TYPE"];
                        var sw_3x3 = mainGame["SW_3X3"] ? mainGame["SW_3X3"] : "N";
                        if (sw_3x3 == "Y") {
                            get("div_matches").classList.add("bk_3x3");
                            if (HalfTime == "Y")
                                get("div_matches").classList.add("bk_3x3_HT");
                            else
                                get("div_matches").classList.remove("bk_3x3_HT")
                        } else {
                            get("div_matches").classList.remove("bk_3x3");
                            get("div_matches").classList.remove("bk_3x3_HT")
                        }
                        if (scoreObj) {
                            score_H_FT = scoreObj["SC_FT_H"];
                            score_A_FT = scoreObj["SC_FT_A"]
                        }
                        var datetime = mainGame["DATETIME"];
                        var tmpDate = datetime.split(" ")[0];
                        var tmpTime = datetime.split(" ")[1];
                        var str_M = tmpDate.split("-")[1];
                        var str_D = tmpDate.split("-")[2];
                        var str_H = tmpTime.split(":")[0];
                        var str_Min = tmpTime.split(":")[1];
                        var isToday = util_game.isToday(tmpDate);
                        var diff = util.getTimeDiff(top["userData"].timetype);
                        if (Math.abs(diff) > 0) {
                            var _tmpDate = new Date(datetime.replace(/-/g, "/"));
                            var newDate = new Date(_tmpDate.getTime() + diff * 60 * 60 * 1E3);
                            var newMonth = util.setZero(newDate.getMonth() + 1);
                            var newDay = util.setZero(newDate.getDate());
                            var newHour = util.setZero(newDate.getHours());
                            var newMin = util.setZero(newDate.getMinutes());
                            if (newDay != str_D * 1)
                                var newDatetime = top.langx == "en-us" ? newDay + " " + LS_game.get("mon_" + newMonth) + "<b></b>" + newHour + ":" + newMin : newMonth + LS_game.get("mon_str") + newDay + LS_game.get("day_str") + "<b></b>" + newHour + ":" + newMin;
                            else {
                                var earlyDateTime = top.langx == "en-us" ? newDay + " " + LS_game.get("mon_" + newMonth) + "<b></b>" + newHour + ":" + newMin : newMonth + LS_game.get("mon_str") + newDay + LS_game.get("day_str") + "<b></b>" + newHour + ":" + newMin;
                                var newDatetime = isToday ? LS_game.get("showtype_today") + "<b></b>" + newHour + ":" + newMin : earlyDateTime
                            }
                        } else {
                            var earlyDateTime = top.langx == "en-us" ? str_D + " " + LS_game.get("mon_" + str_M) + "<b></b>" + str_H + ":" + str_Min : str_M + LS_game.get("mon_str") + str_D + LS_game.get("day_str") + "<b></b>" + str_H + ":" + str_Min;
                            var newDatetime = isToday ? LS_game.get("showtype_today") + "<b></b>" + str_H + ":" + str_Min : earlyDateTime
                        }
                        var obj = new Object;
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
                        obj.sw_3x3 = sw_3x3;
                        obj.scoreObj = scoreObj;
                        return obj
                    } else {
                        var obj = new Object;
                        obj.def_league = def_league;
                        obj.def_team_h = def_team_h;
                        obj.def_team_c = def_team_c;
                        return obj
                    }
                }
                ;
                _self.parseScoreBoard = function(obj, from) {
                    try {
                        if (get("league"))
                            get("league").innerHTML = obj.league == null ? util_game.showTxt(obj.def_league) : util_game.showTxt(obj.league);
                        if (get("midfield"))
                            get("midfield").style.display = obj.midfield == "Y" ? "" : "none";
                        var check_h = obj.team_h == null ? util_game.showTxt(obj.def_team_h) : util_game.showTxt(obj.team_h);
                        var check_c = obj.team_c == null ? util_game.showTxt(obj.def_team_c) : util_game.showTxt(obj.team_c);
                        get("team_h").innerHTML = check_h.toString().replace(team_RegExp, "");
                        get("team_c").innerHTML = check_c.toString().replace(team_RegExp, "");
                        if (obj.gopen != "N" && obj.showtype == "parlay") {
                            if (get("game_parlay"))
                                get("game_parlay").innerHTML = util_game.showTxt(obj.limit_min);
                            if (get("showPLimit"))
                                get("showPLimit").style.display = ""
                        }
                        if (obj.showtype == "live") {
                            var sw_3x3 = obj.sw_3x3 ? obj.sw_3x3 : "N";
                            if (sw_3x3 == "Y") {
                                get("div_matches").classList.add("bk_3x3");
                                if (obj.HalfTime == "Y")
                                    get("div_matches").classList.add("bk_3x3_HT");
                                else
                                    get("div_matches").classList.remove("bk_3x3_HT")
                            } else {
                                get("div_matches").classList.remove("bk_3x3");
                                get("div_matches").classList.remove("bk_3x3_HT")
                            }
                            if (obj.gopen == "N" && obj.Live == "N") {
                                if (obj.OuterOpen) {
                                    get("box_scostate").style.display = "none";
                                    get("box_sco_bk").style.display = "none";
                                    get("box_sco_point").style.display = "none"
                                }
                            } else {
                                get("t_count").innerHTML = util_game.showTxt(obj.t_count);
                                get("se_now").innerHTML = util_game.showTxt(obj.LS_game.get("BK_" + obj.se_now_str));
                                if (obj.se_type == "Halves") {
                                    if (obj.se_now == "OT")
                                        obj.se_num = 3;
                                    var half_data = new Array("sc_H1","sc_H2","sc_OT");
                                    for (var c = 0; c < half_data.length; c++) {
                                        if (get(half_data[c] + "_H").classList.contains("on"))
                                            get(half_data[c] + "_H").classList.remove("on");
                                        if (get(half_data[c] + "_A").classList.contains("on"))
                                            get(half_data[c] + "_A").classList.remove("on");
                                        if (get("320_" + half_data[c]).classList.contains("on"))
                                            get("320_" + half_data[c]).classList.remove("on");
                                        var score_H = util_game.showTxt(obj.scoreObj[half_data[c].toUpperCase() + "_H"]);
                                        var score_A = util_game.showTxt(obj.scoreObj[half_data[c].toUpperCase() + "_A"]);
                                        if (c < obj.se_num) {
                                            get(half_data[c] + "_H").innerHTML = score_H;
                                            get(half_data[c] + "_A").innerHTML = score_A;
                                            get("320_" + half_data[c] + "_H").innerHTML = score_H;
                                            get("320_" + half_data[c] + "_A").innerHTML = score_A;
                                            get("320_" + half_data[c]).style.display = ""
                                        } else {
                                            get(half_data[c] + "_H").innerHTML = "";
                                            get(half_data[c] + "_A").innerHTML = "";
                                            get("320_" + half_data[c] + "_H").innerHTML = "";
                                            get("320_" + half_data[c] + "_A").innerHTML = "";
                                            get("320_" + half_data[c]).style.display = "none"
                                        }
                                    }
                                } else {
                                    if (obj.se_now == "OT")
                                        obj.se_num = 5;
                                    var sc_data = new Array("sc_Q1","sc_Q2","sc_Q3","sc_Q4","sc_OT","sc_H1","sc_H2");
                                    for (var x = 0; x < sc_data.length; x++) {
                                        if (get(sc_data[x] + "_H").classList.contains("on"))
                                            get(sc_data[x] + "_H").classList.remove("on");
                                        if (get(sc_data[x] + "_A").classList.contains("on"))
                                            get(sc_data[x] + "_A").classList.remove("on");
                                        if (get("320_" + sc_data[x]).classList.contains("on"))
                                            get("320_" + sc_data[x]).classList.remove("on");
                                        var score_H = util_game.showTxt(obj.scoreObj[sc_data[x].toUpperCase() + "_H"]);
                                        var score_A = util_game.showTxt(obj.scoreObj[sc_data[x].toUpperCase() + "_A"]);
                                        if (x < obj.se_num) {
                                            get(sc_data[x] + "_H").innerHTML = score_H;
                                            get(sc_data[x] + "_A").innerHTML = score_A;
                                            get("320_" + sc_data[x] + "_H").innerHTML = score_H;
                                            get("320_" + sc_data[x] + "_A").innerHTML = score_A;
                                            get("320_" + sc_data[x]).style.display = ""
                                        } else {
                                            get(sc_data[x] + "_H").innerHTML = "";
                                            get(sc_data[x] + "_A").innerHTML = "";
                                            get("320_" + sc_data[x] + "_H").innerHTML = "";
                                            get("320_" + sc_data[x] + "_A").innerHTML = "";
                                            get("320_" + sc_data[x]).style.display = "none"
                                        }
                                    }
                                    get("sc_H1_H").innerHTML = util_game.showTxt(obj.scoreObj["SC_H1_H"]);
                                    get("sc_H1_A").innerHTML = util_game.showTxt(obj.scoreObj["SC_H1_A"]);
                                    if (obj.se_num <= 2) {
                                        get("sc_H2_H").innerHTML = "";
                                        get("sc_H2_A").innerHTML = ""
                                    } else {
                                        get("sc_H2_H").innerHTML = util_game.showTxt(obj.scoreObj["SC_H2_H"]);
                                        get("sc_H2_A").innerHTML = util_game.showTxt(obj.scoreObj["SC_H2_A"])
                                    }
                                }
                                get("sc_FT_H").innerHTML = util_game.showTxt(obj.score_H_FT);
                                get("sc_FT_A").innerHTML = util_game.showTxt(obj.score_A_FT);
                                if (obj.se_type == "Halves")
                                    get("div_matches").classList.add("half");
                                else {
                                    if (get("div_matches").classList.contains("half"))
                                        get("div_matches").classList.remove("half");
                                    if ((obj.se_now == "Q1" || obj.se_now == "Q2") && obj.HalfTime != "Y") {
                                        get("sc_H1_H").classList.add("on");
                                        get("sc_H1_A").classList.add("on")
                                    } else if ((obj.se_now == "Q3" || obj.se_now == "Q4") && obj.HalfTime != "Y") {
                                        get("sc_H2_H").classList.add("on");
                                        get("sc_H2_A").classList.add("on")
                                    }
                                }
                                if (obj.se_now == "HT")
                                    obj.se_now = "H1";
                                if (obj.HalfTime == "Y") {
                                    se_now_end_str = obj.LS_game.get("BK_score_Half");
                                    get("se_now").innerHTML = se_now_end_str;
                                    get("t_count").innerHTML = ""
                                } else {
                                    if (get("sc_" + obj.se_now + "_H"))
                                        get("sc_" + obj.se_now + "_H").classList.add("on");
                                    if (get("sc_" + obj.se_now + "_A"))
                                        get("sc_" + obj.se_now + "_A").classList.add("on");
                                    if (get("320_sc_" + obj.se_now))
                                        get("320_sc_" + obj.se_now).classList.add("on");
                                    if (obj.se_now == "OT")
                                        get("320_sc_H2").classList.add("on")
                                }
                                if (top.resizePage != "home")
                                    get("div_matches").style.display = ""
                            }
                        } else {
                            if (top.resizePage != "home")
                                get("div_matches").style.display = "";
                            if (get("game_time"))
                                get("game_time").innerHTML = util_game.showTxt(obj.newDatetime)
                        }
                    } catch (e) {
                        console.log("parseScoreBoard_BK error", e)
                    }
                }
                ;
                _self.setVisibleQuarters = function(type, num, isShow) {
                    for (var p = 1; p <= num; p++) {
                        get("320_sc_" + type + p).style.display = isShow ? "" : "none";
                        if (get("sc_" + type + p + "_H").classList.contains("on"))
                            get("sc_" + type + p + "_H").classList.remove("on");
                        if (get("sc_" + type + p + "_A").classList.contains("on"))
                            get("sc_" + type + p + "_H").classList.remove("on");
                        if (get("320_sc_" + type + p).classList.contains("on"))
                            get("320_sc_" + type + p).classList.remove("on")
                    }
                }
                ;
                function get(_id) {
                    if (hasRightPanel)
                        _id = "R_" + _id;
                    return dom.getElementById(_id)
                }
                _self.setHasRightPanel = function() {
                    hasRightPanel = true
                }
                ;
                _self.new_eval = function(str) {
                    var fn = Function;
                    return (new fn("return " + str))()
                }
            }
            ;