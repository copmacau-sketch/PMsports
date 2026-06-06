  function game_more_OP(_win, _dom, _post) {
                var classname = "game_more_OP";
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
                var score_h = "";
                var score_c = "";
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
                    ary.push("FT_RE");
                    ary.push("FT_ROU");
                    ary.push("FT_RM");
                    ary.push("FT_REO");
                    ary.push("FT_HRE");
                    ary.push("FT_HROU");
                    ary.push("FT_HRM");
                    ary.push("FT_HREO");
                    return ary
                }
                ;
                _self.getRtypeRB = function() {
                    var ary = new Object;
                    ary["RE"] = new Array("REH","REC");
                    ary["ROU"] = new Array("ROUH","ROUC");
                    ary["RM"] = new Array("RMH","RMC","RMN");
                    ary["REO"] = new Array("REOO","REOE");
                    ary["HRE"] = new Array("HREH","HREC");
                    ary["HROU"] = new Array("HROUH","HROUC");
                    ary["HRM"] = new Array("HRMH","HRMC","HRMN");
                    ary["HREO"] = new Array("HREOO","HREOE");
                    return ary
                }
                ;
                _self.getWtypeFT_FT = function() {
                    var ary = new Array;
                    ary.push("FT_R");
                    ary.push("FT_OU");
                    ary.push("FT_M");
                    ary.push("FT_EO");
                    return ary
                }
                ;
                _self.getRtypeFT = function() {
                    var ary = new Object;
                    ary["R"] = new Array("RH","RC");
                    ary["OU"] = new Array("OUH","OUC");
                    ary["M"] = new Array("MH","MC","MN");
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
                        return
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
                            if (tmpGameObj["IS_MASTER"] == "Y")
                                mainGame = tmpGameObj
                        }
                        if (mainGame == null)
                            mainGame = gameObj["GAME0"];
                        var filter = nowfilter ? nowfilter : phpData["filter"];
                        var tmpTS = dataObj["ts"];
                        var gidm = mainGame["GIDM"];
                        var hasGame = false;
                        var _id, gdata, playData, mode;
                        if (game.length > 0) {
                            var gidHash = new Object;
                            for (var i = 0; i < game.length; i++) {
                                var tmp_ms = game[i]["MS"];
                                var gidm = game[i]["GIDM"];
                                var ms = tmp_ms != "" && tmp_ms != null ? tmp_ms.split("_")[1] : "0";
                                gdata = game[i];
                                _id = gdata["GID"];
                                mode = "FT";
                                if (gidHash[mode] == null)
                                    gidHash[mode] = new Array;
                                gameHash[_id] = gdata;
                                gidHash[mode].push(_id)
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
                    score_h = "";
                    score_c = "";
                    if (get("league"))
                        get("league").innerHTML = util_game.showTxt(obj.def_league);
                    get("team_h").innerHTML = util_game.showTxt(obj.def_team_h);
                    get("team_c").innerHTML = util_game.showTxt(obj.def_team_c);
                    get("midfield").style.display = "none";
                    if (showtype == "live") {
                        get("score_h").innerHTML = util_game.showTxt(score_h);
                        get("score_c").innerHTML = util_game.showTxt(score_c)
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
                        score_h = mainGame["SCORE_H"] * 1;
                        score_c = mainGame["SCORE_C"] * 1;
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
                        obj.gtype = "op";
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
                        obj.score_h = score_h;
                        obj.score_c = score_c;
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
                        get("team_h").innerHTML = obj.team_h == null ? util_game.showTxt(obj.def_team_h) : util_game.showTxt(obj.team_h);
                        get("team_c").innerHTML = obj.team_c == null ? util_game.showTxt(obj.def_team_c) : util_game.showTxt(obj.team_c);
                        if (obj.gopen != "N" && obj.showtype == "parlay") {
                            if (get("game_parlay"))
                                get("game_parlay").innerHTML = util_game.showTxt(obj.limit_min);
                            if (get("showPLimit"))
                                get("showPLimit").style.display = ""
                        }
                        if (obj.showtype == "live")
                            if (obj.gopen == "N" && obj.Live == "N") {
                                if (obj.OuterOpen)
                                    get("box_scostate").style.display = "none"
                            } else {
                                get("score_h").innerHTML = util_game.showTxt(obj.score_h);
                                get("score_c").innerHTML = util_game.showTxt(obj.score_c);
                                if (top.resizePage != "home")
                                    get("div_matches").style.display = ""
                            }
                        else {
                            if (top.resizePage != "home")
                                get("div_matches").style.display = "";
                            get("game_time").innerHTML = util_game.showTxt(obj.newDatetime)
                        }
                    } catch (e) {
                        console.log("parseScoreBoard_OP error", e)
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