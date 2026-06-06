 function game_more_TT(_win, _dom, _post) {
                var classname = "game_more_TT";
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
                var wtypeHash = new Array;
                var rtypeHash = new Object;
                var showtype = postHash["showtype"];
                var def_league = postHash["league"];
                var def_team_h = postHash["team_h"];
                var def_team_c = postHash["team_c"];
                var def_retime = postHash["retime"];
                var def_datetime = postHash["datetime"];
                var hasRightPanel = false;
                var total_H = "";
                var total_A = "";
                var sc_game_H = "";
                var sc_game_A = "";
                var set_name = "";
                _self.init = function() {
                    LS_game = _self.new_eval("new LS_game_" + ls + "();");
                    LS_game.init();
                    _self.initFun();
                    _self.getHash();
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
                    rtypeFun["parlay"] = rtypeFun["today"]
                }
                ;
                _self.getHash = function() {
                    try {
                        wtypeHash = wtypeFun[showtype]();
                        rtypeHash = rtypeFun[showtype]()
                    } catch (e) {}
                }
                ;
                _self.getWtypeRB = function() {
                    var ary = new Object;
                    ary["FT"] = _self.getWtypeRB_FT();
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
                    ary.push("1_RE");
                    ary.push("0_RE");
                    ary.push("0_RM");
                    ary.push("2_RE");
                    ary.push("2_ROU");
                    ary.push("2_RM");
                    ary.push("2_ROUH");
                    ary.push("2_ROUC");
                    ary.push("3_RE");
                    ary.push("3_ROU");
                    ary.push("3_RM");
                    ary.push("3_ROUH");
                    ary.push("3_ROUC");
                    ary.push("4_RE");
                    ary.push("4_ROU");
                    ary.push("4_RM");
                    ary.push("4_ROUH");
                    ary.push("4_ROUC");
                    ary.push("5_RE");
                    ary.push("5_ROU");
                    ary.push("5_RM");
                    ary.push("5_ROUH");
                    ary.push("5_ROUC");
                    ary.push("6_RE");
                    ary.push("6_ROU");
                    ary.push("6_RM");
                    ary.push("6_ROUH");
                    ary.push("6_ROUC");
                    ary.push("7_RE");
                    ary.push("7_ROU");
                    ary.push("7_RM");
                    ary.push("7_ROUH");
                    ary.push("7_ROUC");
                    ary.push("8_RE");
                    ary.push("8_ROU");
                    ary.push("8_RM");
                    ary.push("8_ROUH");
                    ary.push("8_ROUC");
                    ary.push("0_ROUH");
                    ary.push("0_ROUC");
                    ary.push("1_ROU");
                    ary.push("0_ROU");
                    ary.push("1_REO");
                    ary.push("0_REO");
                    ary.push("2_REO");
                    ary.push("3_REO");
                    ary.push("4_REO");
                    ary.push("5_REO");
                    ary.push("6_REO");
                    ary.push("7_REO");
                    ary.push("8_REO");
                    ary.push("0_RPD5");
                    ary.push("0_RPD7");
                    return ary
                }
                ;
                _self.getRtypeRB = function() {
                    var ary = new Object;
                    ary["RE"] = new Array("REH","REC");
                    ary["ROU"] = new Array("ROUH","ROUC");
                    ary["ROUH"] = new Array("ROUHO","ROUHU");
                    ary["ROUC"] = new Array("ROUCO","ROUCU");
                    ary["RPD5"] = new Array("RPD530","RPD531","RPD532","RPD503","RPD513","RPD523");
                    ary["RPD7"] = new Array("RPD740","RPD741","RPD742","RPD743","RPD704","RPD714","RPD724","RPD734");
                    ary["RM"] = new Array("RMH","RMC");
                    ary["REO"] = new Array("REOO","REOE");
                    return ary
                }
                ;
                _self.getWtypeFT_FT = function() {
                    var ary = new Array;
                    ary.push("0_M");
                    ary.push("0_R");
                    ary.push("1_R");
                    ary.push("1_OU");
                    ary.push("2_R");
                    ary.push("2_M");
                    ary.push("2_OU");
                    ary.push("2_OUH");
                    ary.push("2_OUC");
                    ary.push("3_R");
                    ary.push("3_M");
                    ary.push("3_OU");
                    ary.push("3_OUH");
                    ary.push("3_OUC");
                    ary.push("4_R");
                    ary.push("4_M");
                    ary.push("4_OU");
                    ary.push("4_OUH");
                    ary.push("4_OUC");
                    ary.push("5_R");
                    ary.push("5_M");
                    ary.push("5_OU");
                    ary.push("5_OUH");
                    ary.push("5_OUC");
                    ary.push("6_R");
                    ary.push("6_M");
                    ary.push("6_OU");
                    ary.push("6_OUH");
                    ary.push("6_OUC");
                    ary.push("7_R");
                    ary.push("7_M");
                    ary.push("7_OU");
                    ary.push("7_OUH");
                    ary.push("7_OUC");
                    ary.push("8_R");
                    ary.push("8_M");
                    ary.push("8_OU");
                    ary.push("8_OUH");
                    ary.push("8_OUC");
                    ary.push("0_OU");
                    ary.push("0_OUH");
                    ary.push("0_OUC");
                    ary.push("0_EO");
                    ary.push("1_EO");
                    ary.push("2_EO");
                    ary.push("3_EO");
                    ary.push("4_EO");
                    ary.push("5_EO");
                    ary.push("6_EO");
                    ary.push("7_EO");
                    ary.push("8_EO");
                    ary.push("0_PD5");
                    ary.push("0_PD7");
                    return ary
                }
                ;
                _self.getRtypeFT = function() {
                    var ary = new Object;
                    ary["R"] = new Array("RH","RC");
                    ary["OU"] = new Array("OUH","OUC");
                    ary["OUH"] = new Array("OUHO","OUHU");
                    ary["OUC"] = new Array("OUCO","OUCU");
                    ary["PD5"] = new Array("PD530","PD531","PD532","PD503","PD513","PD523");
                    ary["PD7"] = new Array("PD740","PD741","PD742","PD743","PD704","PD714","PD724","PD734");
                    ary["M"] = new Array("MH","MC");
                    ary["EO"] = new Array("EOO","EOE");
                    return ary
                }
                ;
                _self.getXmlNode = function() {
                    return _xmlnode
                }
                ;
                _self.getDataComplete = function(jsonData, OuterOpen, nowfilter) {
                    var errorMsg = util.showConnectMsg(jsonData);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    var parseJson = JSON.parse(jsonData);
                    var code = parseJson["code"];
                    if (code == "Its not special") {
                        _self.checkHasGame(false);
                        if (top.rightECID != "")
                            parentClass.dispatchEvent("noGameCheckLive", {
                                "eventid_ph": "",
                                "center_tv": ""
                            });
                        exit
                    }
                    var status = parseJson["status"];
                    var dataObj = parseJson["response"];
                    var gameObj = parseJson["response"]["GAMES"];
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
                        var _id, gdata, playData;
                        if (game.length > 0) {
                            var gidHash = new Object;
                            for (var i = 0; i < game.length; i++) {
                                var tmp_ms = game[i]["MS"];
                                var gidm = game[i]["GIDM"];
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
                    parentClass.dispatchEvent("showLoading", {
                        "isShow": false,
                        "from": classname
                    })
                }
                ;
                _self.parseNoGameScoreBoard = function(obj) {
                    sc_game_H = "";
                    sc_game_A = "";
                    total_H = "";
                    total_A = "";
                    set_name = "";
                    if (get("league"))
                        get("league").innerHTML = util_game.showTxt(obj.def_league);
                    get("team_h").innerHTML = util_game.showTxt(obj.def_team_h);
                    get("team_c").innerHTML = util_game.showTxt(obj.def_team_c);
                    get("midfield").style.display = "none";
                    var serveTeam = new Array("serve_h","serve_c");
                    for (var b = 0; b < serveTeam.length; b++)
                        if (get(serveTeam[b]).classList.contains("on"))
                            get(serveTeam[b]).classList.remove("on");
                    var set_ary = new Array("sc_1st","sc_2nd","sc_3th","sc_4th","sc_5th","sc_6th","sc_7th","sc_8th");
                    for (var x = 0; x < set_ary.length; x++) {
                        get(set_ary[x]).style.display = "none";
                        get("320_" + set_ary[x]).style.display = "none";
                        get(set_ary[x] + "_H").style.display = "none";
                        get(set_ary[x] + "_A").style.display = "none"
                    }
                    if (showtype == "live") {
                        get("set_name").innerHTML = util_game.showTxt(set_name);
                        get("sc_game_H").innerHTML = util_game.showTxt(sc_game_H);
                        get("sc_game_A").innerHTML = util_game.showTxt(sc_game_A);
                        get("total_H").innerHTML = util_game.showTxt(total_H);
                        get("total_A").innerHTML = util_game.showTxt(total_A);
                        if (sc_game_H == "") {
                            get("box_sco_tt").style.display = "none";
                            get("box_sco_point").style.display = "none"
                        } else {
                            get("box_sco_tt").style.display = "";
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
                        var best = mainGame["BEST"];
                        var max_set = best.substr(best.length - 1, 1) * 1;
                        if (scoreObj) {
                            sc_game_H = scoreObj["SC_GAME_H"] * 1;
                            sc_game_A = scoreObj["SC_GAME_A"] * 1
                        }
                        var server_sw = mainGame["SERVE"];
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
                        obj.gtype = "tt";
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
                        obj.max_set = max_set;
                        obj.sc_game_H = sc_game_H;
                        obj.sc_game_A = sc_game_A;
                        obj.server_sw = server_sw;
                        obj.limit_min = limit_min;
                        obj.OuterOpen = OuterOpen;
                        obj.newDatetime = newDatetime;
                        obj.scoreObj = scoreObj;
                        return obj
                    }
                }
                ;
                _self.parseScoreBoard = function(obj) {
                    try {
                        if (get("league"))
                            get("league").innerHTML = obj.league == null ? util_game.showTxt(obj.def_league) : util_game.showTxt(obj.league);
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
                        if (obj.showtype == "live")
                            if (obj.gopen == "N" && obj.Live == "N") {
                                if (obj.OuterOpen) {
                                    get("box_scostate").style.display = "none";
                                    get("box_sco_tt").style.display = "none";
                                    get("box_sco_point").style.display = "none"
                                }
                            } else {
                                var set_ary = new Array("sc_1st","sc_2nd","sc_3th","sc_4th","sc_5th","sc_6th","sc_7th","sc_8th");
                                for (var d = 0; d < set_ary.length; d++) {
                                    if (get(set_ary[d]).classList.contains("last"))
                                        get(set_ary[d]).classList.remove("last");
                                    if (get(set_ary[d] + "_H").classList.contains("last"))
                                        get(set_ary[d] + "_H").classList.remove("last");
                                    if (get(set_ary[d] + "_A").classList.contains("last"))
                                        get(set_ary[d] + "_A").classList.remove("last")
                                }
                                if (obj.max_set == 5) {
                                    get(set_ary[obj.max_set]).classList.add("last");
                                    get(set_ary[obj.max_set] + "_H").classList.add("last");
                                    get(set_ary[obj.max_set] + "_A").classList.add("last");
                                    for (var x = obj.max_set + 1; x < set_ary.length; x++) {
                                        get(set_ary[x]).style.display = "none";
                                        get("320_" + set_ary[x]).style.display = "none";
                                        get(set_ary[x] + "_H").style.display = "none";
                                        get(set_ary[x] + "_A").style.display = "none"
                                    }
                                } else {
                                    get(set_ary[obj.max_set]).classList.add("last");
                                    get(set_ary[obj.max_set] + "_H").classList.add("last");
                                    get(set_ary[obj.max_set] + "_A").classList.add("last");
                                    for (var x = 0; x < set_ary.length; x++) {
                                        get(set_ary[x]).style.display = "";
                                        get("320_" + set_ary[x]).style.display = "";
                                        get(set_ary[x] + "_H").style.display = "";
                                        get(set_ary[x] + "_A").style.display = ""
                                    }
                                }
                                sc_game_H = obj.sc_game_H == "" ? "0" : util_game.util_AdvToA(obj.sc_game_H) * 1;
                                sc_game_A = obj.sc_game_A == "" ? "0" : util_game.util_AdvToA(obj.sc_game_A) * 1;
                                get("sc_game_H").innerHTML = util_game.showTxt(sc_game_H);
                                get("sc_game_A").innerHTML = util_game.showTxt(sc_game_A);
                                var se_now = Number(sc_game_H) + Number(sc_game_A) + 1;
                                if (se_now >= obj.max_set && obj.max_set > 0)
                                    se_now = obj.max_set;
                                var sc_now_H = obj.scoreObj[set_ary[se_now - 1].toUpperCase() + "_H"];
                                var sc_now_A = obj.scoreObj[set_ary[se_now - 1].toUpperCase() + "_A"];
                                var range = Math.abs(sc_now_A - sc_now_H);
                                var isDeuce = range == 2;
                                var deuce_over = (sc_now_H > 11 || sc_now_A > 11) && isDeuce;
                                var normal_over = (sc_now_H == 11 || sc_now_A == 11) && range > 1;
                                game_over = false;
                                if (deuce_over || normal_over) {
                                    sc_now_H = 0;
                                    sc_now_A = 0;
                                    game_over = true
                                }
                                sc_now_H = sc_now_H == "" ? "0" : sc_now_H;
                                sc_now_A = sc_now_A == "" ? "0" : sc_now_A;
                                var serveTeam = new Array("serve_h","serve_c");
                                for (var b = 0; b < serveTeam.length; b++)
                                    if (get(serveTeam[b]).classList.contains("on"))
                                        get(serveTeam[b]).classList.remove("on");
                                if (obj.server_sw != "2") {
                                    var team = obj.server_sw == "0" ? "h" : "c";
                                    get("serve_" + team).classList.add("on")
                                }
                                total_H = 0;
                                total_A = 0;
                                var i = 1;
                                for (var t = 0; t < set_ary.length; t++) {
                                    var _name = set_ary[t];
                                    var sc_H = util_game.showTxt(obj.scoreObj[_name.toUpperCase() + "_H"] * 1);
                                    var sc_A = util_game.showTxt(obj.scoreObj[_name.toUpperCase() + "_A"] * 1);
                                    if (t == 7) {
                                        sc_H = 0;
                                        sc_A = 0
                                    }
                                    if (obj.max_set == "7")
                                        if (se_now == "7" && game_over != false)
                                            se_now = 8;
                                    if (obj.max_set == "5")
                                        if (se_now == "5" && game_over != false)
                                            se_now = 6;
                                    get("320_" + _name).style.display = "none";
                                    var se_640 = se_now;
                                    var se_320 = se_now - 1;
                                    if (t < se_640) {
                                        get(_name + "_H").innerHTML = sc_H;
                                        get(_name + "_A").innerHTML = sc_A
                                    } else {
                                        get(_name + "_H").innerHTML = "";
                                        get(_name + "_A").innerHTML = ""
                                    }
                                    if (t < se_320) {
                                        get("320_" + _name).style.display = "";
                                        get("320_" + _name + "_H").innerHTML = sc_H;
                                        get("320_" + _name + "_A").innerHTML = sc_A
                                    } else
                                        get("320_" + _name).style.display = "none";
                                    total_H += sc_H;
                                    total_A += sc_A;
                                    if (get(_name + "_H").classList.contains("on"))
                                        get(_name + "_H").classList.remove("on");
                                    if (get(_name + "_A").classList.contains("on"))
                                        get(_name + "_A").classList.remove("on");
                                    if (get("320_" + _name).classList.contains("on"))
                                        get("320_" + _name).classList.remove("on")
                                }
                                get("total_H").innerHTML = util_game.showTxt(total_H);
                                get("total_A").innerHTML = util_game.showTxt(total_A);
                                get(set_ary[se_now - 1] + "_H").classList.add("on");
                                get(set_ary[se_now - 1] + "_A").classList.add("on");
                                get("320_" + set_ary[se_now - 1]).classList.add("on");
                                var nowSet = sc_game_H * 1 + sc_game_A * 1;
                                if (se_now > obj.max_set)
                                    se_now = obj.max_set;
                                set_name = util_game.showTxt(obj.LS_game.get("TT_" + se_now + "_nowPlay")) + " / " + util_game.showTxt(obj.max_set);
                                get("set_name").innerHTML = set_name;
                                if (top.resizePage != "home")
                                    get("div_matches").style.display = ""
                            }
                        else {
                            if (top.resizePage != "home")
                                get("div_matches").style.display = "";
                            get("game_time").innerHTML = util_game.showTxt(obj.newDatetime)
                        }
                    } catch (e) {
                        console.log("parseScoreBoard_TN error", e)
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