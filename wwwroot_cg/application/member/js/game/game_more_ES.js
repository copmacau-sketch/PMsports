 function game_more_ES(_win, _dom, _post) {
                var classname = "game_more_ES";
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var tv;
                var mt;
                var LS_game;
                var xmlnode = null;
                var scDataObj;
                var over1024 = getView().viewportwidth >= 1024;
                var util = new win.Util(win,dom);
                var util_game = new win.Util_game(win,dom);
                var team_RegExp = new RegExp(" - \([^\)]+\)");
                var gameMaxCount = 7;
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
                var def_best = postHash["nowBest"];
                var hasRightPanel = false;
                var score_H_FT = "";
                var score_A_FT = "";
                var t_count = "";
                var se_now_end_str = "";
                var filterAryHash = new Object;
                filterAryHash["RB"] = new Object;
                filterAryHash["FT"] = new Object;
                var lastRate = new Array;
                var lastIor = new Array;
                var lastGameNum = "";
                var showRateChgStr = "";
                var lastRateChg = 0;
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
                    pageFilterFun["live"] = _self.getFilterHeaderRB;
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
                        headerHash = new Array("Main","Match","G1","G2","G3","G4","G5","G6","G7")
                    } catch (e) {}
                }
                ;
                _self.getWtypeRB = function() {
                    var ary = new Object;
                    ary["FT"] = _self.getWtype(true);
                    return ary
                }
                ;
                _self.getFilterHeaderRB = function() {
                    var ary = new Object;
                    ary["Main"] = wtypeFun["live"];
                    ary["Match"] = filterAryHash["RB"]["match"];
                    for (var c = 1; c <= gameMaxCount; c++)
                        ary["G" + c] = filterAryHash["RB"]["G" + c];
                    return ary
                }
                ;
                _self.getFilterHeaderFT = function() {
                    var ary = new Object;
                    ary["Main"] = wtypeFun["today"];
                    ary["Match"] = filterAryHash["FT"]["match"];
                    for (var c = 1; c <= gameMaxCount; c++)
                        ary["G" + c] = filterAryHash["FT"]["G" + c];
                    return ary
                }
                ;
                _self.getWtypeFT = function() {
                    var ary = new Object;
                    ary["FT"] = _self.getWtype(false);
                    return ary
                }
                ;
                _self.getWtype = function(isRB) {
                    var ary = new Array;
                    var MainWtype = _self.getMainGameWtype();
                    var SubWtype = _self.getSubGameWtype();
                    for (var key in MainWtype) {
                        var tmpWtype = "";
                        if (isRB) {
                            if (filterAryHash["RB"]["match"] == null)
                                filterAryHash["RB"]["match"] = new Array;
                            var splitWtype = MainWtype[key].split("^");
                            if (splitWtype[1] == "R")
                                tmpWtype = splitWtype[0] + "^RE";
                            else
                                tmpWtype = splitWtype[0] + "^R" + splitWtype[1]
                        } else {
                            if (filterAryHash["FT"]["match"] == null)
                                filterAryHash["FT"]["match"] = new Array;
                            tmpWtype = MainWtype[key]
                        }
                        tmpWtype = "Match_" + tmpWtype;
                        ary.push(tmpWtype);
                        var showtype = isRB ? "RB" : "FT";
                        filterAryHash[showtype]["match"].push(tmpWtype)
                    }
                    for (var c = 1; c <= gameMaxCount; c++)
                        for (var key in SubWtype) {
                            var tmpWtype = "";
                            if (isRB) {
                                if (filterAryHash["RB"]["G" + c] == null)
                                    filterAryHash["RB"]["G" + c] = new Array;
                                var splitKey = SubWtype[key].split("^");
                                if (splitKey[1] == "R")
                                    tmpWtype = "G" + c + "_" + splitKey[0] + "^RE";
                                else
                                    tmpWtype = "G" + c + "_" + splitKey[0] + "^R" + splitKey[1]
                            } else {
                                if (filterAryHash["FT"]["G" + c] == null)
                                    filterAryHash["FT"]["G" + c] = new Array;
                                tmpWtype = "G" + c + "_" + SubWtype[key]
                            }
                            ary.push(tmpWtype);
                            var showtype = isRB ? "RB" : "FT";
                            filterAryHash[showtype]["G" + c].push(tmpWtype)
                        }
                    return ary
                }
                ;
                _self.getMainGameWtype = function() {
                    var ary = new Array("1^M","1^R","1^OU","1^EO","2^OU","3^M","3^R","3^OU","3^EO","4^OU","4^EO","5^OU","5^EO","6^M","6^R","6^OU","6^EO","7^OU","7^EO","8^OU","8^EO","9^M","9^R","9^OU","9^EO","10^M","10^R","10^OU","10^EO","11^M","11^R","11^OU","11^EO","12^M","12^R","12^OU","12^EO","13^M","13^R","13^OU","13^EO","14^OU","14^EO","15^OU","15^EO");
                    return ary
                }
                ;
                _self.getSubGameWtype = function() {
                    var ary = new Array("Specials_1^M","Specials_1^R","Specials_1^OU","Specials_1^EO","M10_1^M","M10_1^R","M10_1^OU","M10_1^EO","M20_1^M","M20_1^R","M20_1^OU","M20_1^EO","HT_1^M","HT_1^R","HT_1^OU","HT_1^EO","Specials_2^OU","M10_2^OU","M20_2^OU","HT_2^OU","Specials_3^M","Specials_3^R","Specials_3^OU","Specials_3^EO","M10_3^M","M10_3^R","M10_3^OU","M10_3^EO","M20_3^M","M20_3^R","M20_3^OU","M20_3^EO","HT_3^M","HT_3^R","HT_3^OU","HT_3^EO","Specials_4^OU","Specials_4^EO","Specials_5^OU","Specials_5^EO","M10_4^OU","M10_4^EO","M10_5^OU","M10_5^EO","M20_4^OU","M20_4^EO","M20_5^OU","M20_5^EO","HT_4^OU","HT_4^EO","HT_5^OU","HT_5^EO","Specials_6^M","Specials_6^R","Specials_6^OU","Specials_6^EO","M10_6^M","M10_6^R","M10_6^OU","M10_6^EO","M20_6^M","M20_6^R","M20_6^OU","M20_6^EO","HT_6^M","HT_6^R","HT_6^OU","HT_6^EO","Specials_7^OU","Specials_7^EO","Specials_8^OU","Specials_8^EO","M10_7^OU","M10_7^EO","M10_8^OU","M10_8^EO","M20_7^OU","M20_7^EO","M20_8^OU","M20_8^EO","HT_7^OU","HT_7^EO","HT_8^OU","HT_8^EO","Specials_9^M","Specials_9^R","Specials_9^OU","Specials_9^EO","M10_9^M","M10_9^R","M10_9^OU","M10_9^EO","M20_9^M","M20_9^R","M20_9^OU","M20_9^EO","HT_9^M","HT_9^R","HT_9^OU","HT_9^EO","Specials_10^M","Specials_10^R","Specials_10^OU","Specials_10^EO","M10_10^M","M10_10^R","M10_10^OU","M10_10^EO","M20_10^M","M20_10^R","M20_10^OU","M20_10^EO","HT_10^M","HT_10^R","HT_10^OU","HT_10^EO","Specials_11^M","Specials_11^R","Specials_11^OU","Specials_11^EO","M10_11^M","M10_11^R","M10_11^OU","M10_11^EO","M20_11^M","M20_11^R","M20_11^OU","M20_11^EO","HT_11^M","HT_11^R","HT_11^OU","HT_11^EO","Specials_12^M","Specials_12^R","Specials_12^OU","Specials_12^EO","M10_12^M","M10_12^R","M10_12^OU","M10_12^EO","M20_12^M","M20_12^R","M20_12^OU","M20_12^EO","HT_12^M","HT_12^R","HT_12^OU","HT_12^EO","Specials_13^M","Specials_13^R","Specials_13^OU","Specials_13^EO","M10_13^M","M10_13^R","M10_13^OU","M10_13^EO","M20_13^M","M20_13^R","M20_13^OU","M20_13^EO","HT_13^M","HT_13^R","HT_13^OU","HT_13^EO","Specials_14^OU","Specials_14^EO","Specials_15^OU","Specials_15^EO","M10_14^OU","M10_14^EO","M10_15^OU","M10_15^EO","M20_14^OU","M20_14^EO","M20_15^OU","M20_15^EO","HT_14^OU","HT_14^EO","HT_15^OU","HT_15^EO");
                    return ary
                }
                ;
                _self.getRtypeRB = function() {
                    var ary = new Object;
                    ary["RM"] = new Array("RMH","RMC");
                    ary["RE"] = new Array("REH","REC");
                    ary["ROU"] = new Array("ROUH","ROUC");
                    ary["REO"] = new Array("REOE","REOO");
                    return ary
                }
                ;
                _self.getRtypeFT = function() {
                    var ary = new Object;
                    ary["M"] = new Array("MH","MC");
                    ary["R"] = new Array("RH","RC");
                    ary["OU"] = new Array("OUH","OUC");
                    ary["EO"] = new Array("EOO","EOE");
                    return ary
                }
                ;
                _self.getXmlNode = function() {
                    return xmlnode
                }
                ;
                _self.getDataComplete = function(jsonData, OuterOpen, nowfilter) {
                    var errorMsg = util.showConnectMsg(jsonData);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    lastJsonData = jsonData;
                    var subGameSortKey = new Array("Specials","M10","M20","HT");
                    var parseJson = JSON.parse(jsonData);
                    var code = parseJson["code"];
                    if (code == "Its not special") {
                        _self.setNowGameNum("N/A");
                        _self.checkHasGame(false);
                        parentClass.dispatchEvent("closeAnalysis");
                        top.rightNowPlay = "";
                        _self.showAnalysisBtn(false);
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
                    var scoreObj = parseJson["response"]["SCORE"];
                    var phpData = parseJson["phpData"];
                    var game = new Array;
                    var gameHash = new Array;
                    var mainGame = null;
                    var mainPlayIor = null;
                    var noMotherGame = false;
                    if (status == "success") {
                        _self.setJSON(jsonData);
                        var gameLimit = _self.getGameLimit(dataObj["MODE"]);
                        _self.hideFilter(gameLimit);
                        for (var g = 0; g < util.countSize(gameObj); g++) {
                            var tmpGameObj = gameObj["GAME" + g];
                            game.push(tmpGameObj);
                            if (tmpGameObj["GAMETYPE"] == "Match" && tmpGameObj["IS_MASTER"] == "Y" && tmpGameObj["PERIOD_ID"] == "1")
                                mainGame = tmpGameObj
                        }
                        if (mainGame == null) {
                            mainGame = gameObj["GAME0"];
                            noMotherGame = true
                        }
                        _self.setNoMotherGame(noMotherGame);
                        var filter = nowfilter ? nowfilter : phpData["filter"];
                        var outerGameNum = phpData["outerGameNum"];
                        var tmpTS = dataObj["ts"];
                        var nowGame = isNaN(dataObj["NOWGAME"] * 1) ? dataObj["NOWGAME"] : "G" + dataObj["NOWGAME"];
                        var mode = dataObj["MODE"];
                        var matchScoreH = dataObj["MATCH_H"];
                        var matchScoreC = dataObj["MATCH_C"];
                        var scoreType = dataObj["SCORETYPE"];
                        var peid = dataObj["PARENT_ID"];
                        var type = dataObj["TYPE"];
                        var nowStatus = dataObj["NOWSTATUS"];
                        var color_h = dataObj["COLOR_H"];
                        var color_c = dataObj["COLOR_C"];
                        var start_h = dataObj["START_H"];
                        var start_c = dataObj["START_C"];
                        var showStartStr = "";
                        var analysisGameNum = scoreObj["ANALYSIS_GAME"] * 1;
                        if (mode != "N/A") {
                            var replaceMode = mode.replace(" ", "_").replace(" ", "_");
                            var gameModeStr = LS_game.get("ES_" + replaceMode)
                        } else
                            var gameModeStr = "";
                        _self.setNowGameNum(nowGame);
                        _self.setScoreType(scoreType);
                        if (start_h * 1 + start_c * 1 + 1 > 1) {
                            showStartStr = LS_game.get("ES_Start").replace(new RegExp("\\*START_H\\*","gi"), util_game.showTxt(start_h));
                            showStartStr = showStartStr.replace(new RegExp("\\*START_C\\*","gi"), util_game.showTxt(start_c))
                        }
                        type = util.chgGameType(type);
                        var ior_m_h = "0";
                        var ior_m_c = "0";
                        var hasGame = false;
                        var _id, gdata, playData;
                        if (game.length > 0 && scoreObj) {
                            var gidHash = new Object;
                            var m_key_h = showtype == "live" ? "IOR_RMH" : "IOR_MH";
                            var m_key_c = showtype == "live" ? "IOR_RMC" : "IOR_MC";
                            var game_h = scoreObj["GAME_H"];
                            var game_c = scoreObj["GAME_C"];
                            var dur_h = scoreObj["DUR_H"];
                            var dur_c = scoreObj["DUR_C"];
                            var kill_h = scoreObj["KILL_H"];
                            var kill_c = scoreObj["KILL_C"];
                            var subScoreH = scoreType == "MOBA-1" ? kill_h : game_h;
                            var subScoreC = scoreType == "MOBA-1" ? kill_c : game_c;
                            mainPlayIor = mainGame["PLAYS"];
                            var mainIorCanUse = mainGame["GOPEN"] == "Y" && mainGame["RECV"].match(/Y|S/) && mainPlayIor["M"][m_key_h] * 1 > 0 && mainPlayIor["M"][m_key_c] * 1 > 0;
                            if (mainIorCanUse && (nowGame == "N/A" || showtype != "live")) {
                                ior_m_h = mainPlayIor["M"][m_key_h];
                                ior_m_c = mainPlayIor["M"][m_key_c]
                            }
                            for (var i = 0; i < game.length; i++) {
                                gdata = game[i];
                                _id = gdata["GID"];
                                var gameNum = "Match";
                                if (gidHash[gameNum] == null)
                                    gidHash[gameNum] = new Array;
                                if (game[i]["GAMETYPE"] == "Match") {
                                    gidHash[gameNum].push(_id);
                                    gameHash[_id] = gdata
                                }
                            }
                            for (var k = 0; k < subGameSortKey.length; k++)
                                for (var i = 0; i < game.length; i++) {
                                    gdata = game[i];
                                    _id = gdata["GID"];
                                    playData = gdata["PLAYS"];
                                    var iorCanUse = gdata["GOPEN"] == "Y" && gdata["RECV"] == "Y" && playData["M"][m_key_h] * 1 > 0 && playData["M"][m_key_c] * 1 > 0;
                                    if (gdata["GAMETYPE"] == subGameSortKey[k]) {
                                        var gameNum = "G" + gdata["GAMENUM"];
                                        if (gidHash[gameNum] == null)
                                            gidHash[gameNum] = new Array;
                                        gidHash[gameNum].push(_id);
                                        gameHash[_id] = gdata;
                                        if (iorCanUse && showtype == "live" && nowGame == gameNum && gdata["GAMETYPE"] == "Specials" && gdata["PERIOD_ID"] == "1")
                                            if (gdata["IS_MASTER"] == "Y") {
                                                ior_m_h = playData["M"][m_key_h];
                                                ior_m_c = playData["M"][m_key_c]
                                            }
                                    }
                                }
                            top.resize_mainGame = mainGame;
                            top.rightFrom = "game_more";
                            var intoRB = _self.checkIntoRB(xmlnode, mainGame);
                            if (intoRB)
                                return;
                            var gopen = mainGame["GOPEN"];
                            var Live = mainGame["IS_LIVE"];
                            scDataObj = _self.setScoreBoard(mainGame, showtype, gopen, Live, OuterOpen, LS_game);
                            scDataObj["matchScoreH"] = matchScoreH;
                            scDataObj["matchScoreC"] = matchScoreC;
                            scDataObj["subScoreH"] = subScoreH;
                            scDataObj["subScoreC"] = subScoreC;
                            scDataObj["gameType"] = gameModeStr;
                            scDataObj["color_h"] = color_h;
                            scDataObj["color_c"] = color_c;
                            scDataObj["nowGame"] = nowGame;
                            scDataObj["nowGameStr"] = LS_game.get("ES_" + nowGame.toLowerCase());
                            scDataObj["ior_m_h"] = ior_m_h;
                            scDataObj["ior_m_c"] = ior_m_c;
                            scDataObj["scoreType"] = scoreType;
                            scDataObj["type"] = type;
                            scDataObj["mode"] = mode;
                            scDataObj["nowStatus"] = nowStatus;
                            scDataObj["statusStr"] = LS_game.get("ES_" + nowStatus);
                            scDataObj["showStartStr"] = showStartStr;
                            if (mode == "N/A")
                                if (nowGame == "N/A")
                                    scDataObj["showLive"] = LS_game.get("re");
                            var analysisHash = {
                                "score": scoreObj,
                                "nowGame": analysisGameNum,
                                "scoreType": scoreType
                            };
                            parentClass.dispatchEvent("updateScoreObj", analysisHash);
                            if (lastGameNum != nowGame) {
                                lastGameNum = nowGame;
                                _self.resetRate();
                                parentClass.dispatchEvent("resetRate")
                            }
                            var notNeedAnalysis = outerGameNum == "N/A" && OuterOpen;
                            if (getView().viewportwidth >= 1024) {
                                _self.showAnalysisBtn(false);
                                if (showtype == "live" && nowGame != "N/A" && scoreType != "N/A" && dataObj["ALL_CLOSE"] != "Y" && !noMotherGame)
                                    if (notNeedAnalysis) {
                                        echo("\u5916\u5c64\u9ede\u9032\u4f86\u6642\u9084\u662f\u4e0d\u9700\u8981\u8cc7\u6599\u5206\u6790\u7684\u72c0\u614b\uff0c\u5148\u95dc\u9589\u5206\u6790");
                                        parentClass.dispatchEvent("closeAnalysis");
                                        top["analysisData"] = null;
                                        top.rightNowPlay = "";
                                        top.rightECID = ""
                                    } else {
                                        top.rightNowPlay = "ES";
                                        top.rightECID = peid;
                                        parentClass.dispatchEvent("parseRightScoreBoard", scDataObj);
                                        if (!OuterOpen)
                                            parentClass.dispatchEvent("chkAnalysis", {
                                                "gtype": "es",
                                                "peid": peid,
                                                "showtype": showtype,
                                                "scoreType": scoreType
                                            })
                                    }
                                else {
                                    parentClass.dispatchEvent("closeAnalysis");
                                    top["analysisData"] = null;
                                    top.rightNowPlay = "";
                                    top.rightECID = ""
                                }
                                parentClass.dispatchEvent("checkRightLive", {
                                    "videoObj": null,
                                    "mainGame": mainGame,
                                    "format": "json"
                                });
                                parentClass.dispatchEvent("setRightLoading", {
                                    "isShow": false
                                })
                            } else if (showtype == "live" && nowGame != "N/A" && scoreType != "N/A" && dataObj["ALL_CLOSE"] != "Y" && !noMotherGame) {
                                top.rightNowPlay = "ES";
                                top.rightECID = peid;
                                _self.showAnalysisBtn(true);
                                _self.checkLive(null, mainGame, tv, mt)
                            } else {
                                parentClass.dispatchEvent("closeAnalysis");
                                top.rightNowPlay = "";
                                top.rightECID = "";
                                _self.showAnalysisBtn(false);
                                _self.checkLive(null, mainGame, tv, mt, "game_more")
                            }
                            top.scDataObj = scDataObj;
                            _self.setObj(scDataObj);
                            _self.parseScoreBoard(scDataObj);
                            _self.setScoreObj(analysisHash);
                            _self.updateAnalysisScore(analysisHash);
                            var parseParam = {
                                "id": peid,
                                "nowMode": "FT",
                                "gidHash": gidHash,
                                "game": game,
                                "ts": tmpTS,
                                "gameHash": gameHash
                            };
                            _self.setParseParam(parseParam);
                            if (dataObj["ALL_CLOSE"] != "Y")
                                hasGame = _self.parseJsonData(parseParam);
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
                            top.scDataObj = null
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
                    setTimeout(_self.showFilterLoading, 300, false);
                    parentClass.dispatchEvent("showLoading", {
                        "isShow": false,
                        "from": classname
                    })
                }
                ;
                _self.parseNoGameScoreBoard = function(obj) {
                    try {
                        if (get("league"))
                            get("league").innerHTML = util_game.showTxt(obj.def_league);
                        get("team_h").innerHTML = util_game.showTxt(obj.def_team_h);
                        get("team_c").innerHTML = util_game.showTxt(obj.def_team_c);
                        get("midfield").style.display = "none"
                    } catch (e) {
                        console.log("parseNoGameScoreBoard error", e)
                    }
                }
                ;
                _self.setScoreBoard = function(mainGame, showtype, gopen, Live, OuterOpen, LS_game) {
                    if (mainGame != null) {
                        var league = mainGame["LEAGUE"];
                        var midfield = mainGame["MIDFIELD"];
                        var team_h = mainGame["TEAM_H"];
                        var team_c = mainGame["TEAM_C"];
                        var limit_min = mainGame["LIMIT_MIN"];
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
                        obj.gtype = "es";
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
                        obj.limit_min = limit_min;
                        obj.OuterOpen = OuterOpen;
                        obj.newDatetime = newDatetime;
                        return obj
                    }
                }
                ;
                _self.getColorNum = function(color) {
                    var colorAry = new Array;
                    colorAry["C00000"] = "1";
                    colorAry["E8120A"] = "2";
                    colorAry["FFC000"] = "3";
                    colorAry["00C417"] = "4";
                    colorAry["2588D8"] = "5";
                    colorAry["196F9E"] = "6";
                    return colorAry[color] ? colorAry[color] : ""
                }
                ;
                _self.chkRate = function(newRate, oldRate) {
                    if (newRate[0] != oldRate[0])
                        ret = Math.round(newRate[0] * 100 - oldRate[0] * 100);
                    else
                        ret = false;
                    return ret
                }
                ;
                _self.resetRate = function() {
                    lastRate = new Array;
                    lastIor = new Array;
                    showRateChgStr = ""
                }
                ;
                _self.parseScoreBoard = function(obj) {
                    try {
                        if (get("league"))
                            get("league").innerHTML = obj.league == null ? util_game.showTxt(obj.def_league) : util_game.showTxt(obj.league);
                        get("midfield").style.display = obj.midfield == "Y" ? "" : "none";
                        get("team_h").innerHTML = obj.team_h == null ? util_game.showTxt(obj.def_team_h) : util_game.showTxt(obj.team_h);
                        get("team_c").innerHTML = obj.team_c == null ? util_game.showTxt(obj.def_team_c) : util_game.showTxt(obj.team_c);
                        get("gameType").innerHTML = util_game.showTxt(obj.gameType);
                        get("div_matches").className = "";
                        get("box_scostate").className = "";
                        util.addClass(get("box_scostate"), "box_score");
                        util.addClass(get("div_matches"), "box_scoboard");
                        util.addClass(get("div_matches"), "es");
                        util.addClass(get("div_matches"), "ES_" + obj.scoreType);
                        util.addClass(get("div_matches"), obj.type);
                        var transColor_h = _self.getColorNum(obj.color_h);
                        var transColor_c = _self.getColorNum(obj.color_c);
                        if (transColor_h != "" && transColor_c != "") {
                            util.addClass(get("div_matches"), "colorH_" + transColor_h);
                            util.addClass(get("div_matches"), "colorC_" + transColor_c)
                        }
                        if (obj.gopen != "N" && obj.showtype == "parlay") {
                            if (get("game_parlay"))
                                get("game_parlay").innerHTML = util_game.showTxt(obj.limit_min);
                            if (get("showPLimit"))
                                get("showPLimit").style.display = ""
                        }
                        var showRate = util_game.calcWinRate(obj.ior_m_h, obj.ior_m_c);
                        var rateObj = get("div_rate");
                        var cloneRateObj = get("div_rate_model").cloneNode(true);
                        if (!showRate) {
                            lastRate = new Array;
                            lastIor = new Array;
                            showRateChgStr = "";
                            lastRateChg = 0;
                            rateObj.style.display = "none"
                        } else {
                            var newIor = new Array;
                            var chgRate = false;
                            newIor[0] = obj.ior_m_h;
                            newIor[1] = obj.ior_m_c;
                            if (lastIor.length != 0)
                                if (JSON.stringify(newIor) != JSON.stringify(lastIor)) {
                                    chgRate = _self.chkRate(showRate, lastRate);
                                    lastRateChg = chgRate * 1;
                                    showRateChgStr = chgRate ? Math.abs(chgRate) + "%" : ""
                                }
                            lastRate = showRate;
                            lastIor[0] = obj.ior_m_h;
                            lastIor[1] = obj.ior_m_c;
                            if (obj.nowGame && obj.nowGame != "") {
                                rateObj.style.display = "";
                                cloneRateObj.innerHTML = cloneRateObj.innerHTML.replace(new RegExp("\\*WIN_RATE_H\\*","gi"), util_game.showTxt(Math.round(showRate[0] * 100)));
                                cloneRateObj.innerHTML = cloneRateObj.innerHTML.replace(new RegExp("\\*WIN_RATE_C\\*","gi"), util_game.showTxt(Math.round(showRate[1] * 100)));
                                cloneRateObj.innerHTML = cloneRateObj.innerHTML.replace(new RegExp("\\*NOW_PERIOD\\*","gi"), util_game.showTxt(obj.nowGameStr));
                                cloneRateObj.innerHTML = cloneRateObj.innerHTML.replace(new RegExp("\\*RATE_CHANGE\\*","gi"), util_game.showTxt(showRateChgStr));
                                if (lastRateChg * 1 < 0) {
                                    cloneRateObj.innerHTML = cloneRateObj.innerHTML.replace(new RegExp("\\*RATE_H_CLASS\\*","gi"), util_game.showTxt("text_down"));
                                    cloneRateObj.innerHTML = cloneRateObj.innerHTML.replace(new RegExp("\\*RATE_C_CLASS\\*","gi"), util_game.showTxt("text_up"))
                                } else {
                                    cloneRateObj.innerHTML = cloneRateObj.innerHTML.replace(new RegExp("\\*RATE_H_CLASS\\*","gi"), util_game.showTxt("text_up"));
                                    cloneRateObj.innerHTML = cloneRateObj.innerHTML.replace(new RegExp("\\*RATE_C_CLASS\\*","gi"), util_game.showTxt("text_down"))
                                }
                                rateObj.innerHTML = cloneRateObj.innerHTML
                            }
                        }
                        if (obj.showtype == "live") {
                            var showNowGame = obj.nowGameStr;
                            if (obj.showLive && obj.showLive != "")
                                showNowGame = obj.showLive;
                            get("nowGame").innerHTML = util_game.showTxt(showNowGame);
                            get("nowGame").style.display = "";
                            if (obj.mode != "N/A" && obj.scoreType != "N/A") {
                                get("icon_v").style.display = "none";
                                get("matchScoreH").innerHTML = util_game.showTxt(util_game.limitScore(obj.matchScoreH));
                                get("matchScoreC").innerHTML = util_game.showTxt(util_game.limitScore(obj.matchScoreC));
                                if (obj.nowGame != "N/A")
                                    if (obj.nowStatus == "N") {
                                        get("nowStatus").style.display = "none";
                                        get("subScore").style.display = "";
                                        get("subScoreH").innerHTML = util_game.showTxt(util_game.limitScore(obj.subScoreH));
                                        get("subScoreC").innerHTML = util_game.showTxt(util_game.limitScore(obj.subScoreC));
                                        if (obj.scoreType == "BASIC")
                                            util.addClass(get("box_scostate"), "box_score_2row")
                                    } else if (obj.statusStr != "") {
                                        get("subScore").style.display = "none";
                                        get("nowStatus").innerHTML = util_game.showTxt(obj.statusStr);
                                        get("nowStatus").style.display = ""
                                    } else {
                                        util.addClass(get("box_scostate"), "box_score_2row");
                                        get("nowStatus").style.display = "none"
                                    }
                                else {
                                    get("nowGame").style.display = "none";
                                    get("subScore").style.display = "none";
                                    if (obj.statusStr != "") {
                                        get("nowStatus").innerHTML = util_game.showTxt(obj.statusStr);
                                        get("nowStatus").style.display = ""
                                    } else {
                                        util.addClass(get("box_scostate"), "box_score_2row");
                                        get("nowStatus").style.display = "none"
                                    }
                                }
                            } else {
                                if (obj.scoreType == "N/A") {
                                    get("gameType").innerHTML = LS_game.get("re");
                                    get("nowGame").style.display = "none"
                                }
                                get("icon_v").style.display = "";
                                get("matchScoreH").innerHTML = "";
                                get("matchScoreC").innerHTML = "";
                                get("subScore").style.display = "none";
                                if (obj.statusStr != "") {
                                    get("nowStatus").innerHTML = util_game.showTxt(obj.statusStr);
                                    get("nowStatus").style.display = ""
                                } else {
                                    util.addClass(get("box_scostate"), "box_score_2row");
                                    get("nowStatus").style.display = "none"
                                }
                            }
                        } else {
                            get("icon_v").style.display = "";
                            get("game_time").innerHTML = util_game.showTxt(obj.newDatetime);
                            get("scoreBoard_start").innerHTML = obj.showStartStr;
                            if (obj.showStartStr == "")
                                util.addClass(get("box_scostate"), "box_score_2row")
                        }
                    } catch (e) {
                        console.log("parseScoreBoard_ES error", e)
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