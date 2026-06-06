function statistics(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var eventHandler = new Object;
                var util = new win.Util(win,dom);
                var util_game = new win.Util_game(win,dom);
                var config_set = new win.config_set;
                var LS_game;
                var LS;
                var timerHash;
                var classname = "statistics";
                var myhash = {};
                var peid = postHash["peid"];
                var gtype = postHash["gtype"];
                var showtype = postHash["showtype"];
                var from = postHash["from"];
                var lastScoreObj = postHash["scoreObj"];
                var _mc = new Object;
                var lastJsonData = "";
                var lastScoreType = "";
                var nowStartGame = "";
                var hasRightPanel = false;
                var lastGameNum = null;
                _self.init = function() {
                    myhash["config_set"] = config_set;
                    myhash["util"] = util;
                    myhash["timerHash"] = timerHash;
                    config_set.init();
                    dom.getElementById("statistics_landScape").innerHTML = LS.get("analysisBlock");
                    if (from == "less1024") {
                        hasRightPanel = false;
                        _mc["statistics_btn_close"] = dom.getElementById("statistics_btn_close");
                        _mc["statistics_pop"] = dom.getElementById("statistics_pop");
                        _mc["es_result"] = dom.getElementById("es_result");
                        util.addEvent(_mc["statistics_btn_close"], "click", _self.clickEvent, {
                            "from": "close"
                        });
                        util.addEvent(_mc["statistics_pop"], "click", _self.clickEvent, {
                            "from": "close"
                        })
                    } else
                        hasRightPanel = true;
                    _self.createTimer();
                    _self.getData();
                    parentClass.dispatchEvent("setNowBodyLockStatus", true);
                    parentClass.dispatchEvent("upAnalysis_status", true)
                }
                ;
                _self.clickEvent = function(e, par) {
                    if (par) {
                        if (par.from == "close")
                            _self.closeStat()
                    } else
                        _self.closeStat()
                }
                ;
                _self.getData = function(isTimer) {
                    if (lastJsonData == "" || isTimer) {
                        var par = top.param;
                        par += "&p=get_analysis";
                        par += "&gtype=" + gtype;
                        par += "&peid=" + peid;
                        par += "&uid=" + top.userData.uid;
                        par += "&showtype=" + showtype;
                        par += "&type=getDataAnalysis";
                        par += "&from=" + from;
                        var getHTML = new HttpRequest;
                        getHTML.addEventListener("onError", _self.getDataError);
                        getHTML.addEventListener("LoadComplete", function(json) {
                            _self.getDataComplete(json)
                        });
                        getHTML.loadURL(top.m2_url, "POST", par)
                    } else
                        _self.getDataComplete(lastJsonData)
                }
                ;
                _self.getDataComplete = function(jsonData) {
                    var errorMsg = util.showConnectMsg(jsonData);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    lastJsonData = jsonData;
                    var parseJson = JSON.parse(jsonData);
                    var status = parseJson["status"];
                    var dataObj = parseJson["response"];
                    var scoreHash = dataObj["SCORE"];
                    var mode = dataObj["MODE"];
                    var match_h = dataObj["MATCH_H"];
                    var match_c = dataObj["MATCH_C"];
                    var type = dataObj["TYPE"];
                    var nowGame = dataObj["ANALYSIS_GAME"];
                    var scoreType = dataObj["SCORETYPE"];
                    var start_h = dataObj["START_H"];
                    var start_c = dataObj["START_C"];
                    var startGame = start_h * 1 + start_c * 1 + 1;
                    if (status == "success") {
                        lastScoreType = scoreType;
                        nowStartGame = startGame;
                        var tmpScoreHash = new Object;
                        var tmpNowGame = "";
                        if (lastScoreObj && lastScoreObj["scoreType"] == scoreType) {
                            var nowScoreHash = _self.setNowScoreHash(lastScoreObj);
                            tmpScoreHash = Object.assign({}, scoreHash, nowScoreHash);
                            tmpNowGame = lastScoreObj["nowGame"]
                        } else {
                            tmpScoreHash = scoreHash;
                            tmpNowGame = nowGame
                        }
                        var analysisGameNum = tmpNowGame;
                        if (startGame > 1) {
                            var showStartStr = LS_game.get("ES_Analysis_Start").replace(new RegExp("\\*START_H\\*","gi"), util_game.showTxt(start_h));
                            showStartStr = showStartStr.replace(new RegExp("\\*START_C\\*","gi"), util_game.showTxt(start_c));
                            if (get("start_game")) {
                                get("start_game").style.display = "";
                                get("start_game").innerHTML = util_game.showTxt(showStartStr)
                            }
                        } else if (get("start_game"))
                            get("start_game").style.display = "none";
                        top["analysisData"] = tmpScoreHash;
                        var gameObj = {
                            "gameHash": tmpScoreHash,
                            "scoreType": scoreType,
                            "startGame": startGame,
                            "nowGame": analysisGameNum
                        };
                        _self.parseData(gameObj)
                    }
                }
                ;
                _self.parseData = function(obj) {
                    console.log("parseData", obj.scoreType, ",gameHash", obj.gameHash);
                    var scoreTypeAry = new Array("MOBA-1","FPS-1","BASIC");
                    var gameHash = obj.gameHash;
                    var scoreType = lastScoreType != "" ? lastScoreType : obj.scoreType;
                    var startGame = obj.startGame;
                    var nowGame = obj.nowGame;
                    var finalHTML = "";
                    if (scoreType != obj.scoreType) {
                        console.log("parseData scoreType = ", scoreType, ", obj.scoreType = ", obj.scoreType, ",\u5169\u8005\u4e0d\u540c\uff0c\u4e0d\u9700\u66f4\u65b0!!!");
                        return
                    }
                    if (lastGameNum != nowGame) {
                        _self.showStatLoading(true, "page_on");
                        lastGameNum = nowGame
                    }
                    get("statistics_content").className = get("statistics_content").className.replace(/\b\S*ES_\S*\b/g, "").trim();
                    if (scoreTypeAry.indexOf(scoreType) != "-1")
                        util.addClass(get("statistics_content"), "ES_" + scoreType);
                    for (var s = 0; s < nowGame * 1; s++) {
                        var score_model = dom.getElementById("es_result_model").innerHTML;
                        var tmpGameNum = s + 1;
                        if (tmpGameNum < startGame)
                            continue;
                        var tmpGameNumStr = LS_game.get("ES_g" + tmpGameNum);
                        var tmpKey = "GAME" + tmpGameNum;
                        var tmpDurH = "-";
                        var tmpDurC = "-";
                        var tmpKillH = "-";
                        var tmpKillC = "-";
                        var useScoreH = "";
                        var useScoreC = "";
                        var liveStrCss = "";
                        var durStr = "";
                        if (gameHash[tmpKey]) {
                            var tmpGameH = gameHash[tmpKey]["GAME_H"];
                            var tmpGameC = gameHash[tmpKey]["GAME_C"];
                            var result = gameHash[tmpKey]["RESULT"];
                            if (scoreType == "MOBA-1") {
                                if (gameHash[tmpKey]["DUR_H"] && gameHash[tmpKey]["DUR_C"]) {
                                    tmpDurH = gameHash[tmpKey]["DUR_H"] * 1 < 10 ? "0" + gameHash[tmpKey]["DUR_H"] : gameHash[tmpKey]["DUR_H"];
                                    tmpDurC = gameHash[tmpKey]["DUR_C"] * 1 < 10 ? "0" + gameHash[tmpKey]["DUR_C"] : gameHash[tmpKey]["DUR_C"]
                                }
                                if (gameHash[tmpKey]["KILL_H"] && gameHash[tmpKey]["KILL_C"]) {
                                    tmpKillH = gameHash[tmpKey]["KILL_H"];
                                    tmpKillC = gameHash[tmpKey]["KILL_C"]
                                }
                                durStr = tmpDurH == "-" || tmpDurC == "-" ? "-" : tmpDurH + ":" + tmpDurC
                            }
                        } else {
                            var tmpGameH = "-";
                            var tmpGameC = "-";
                            var result = "N"
                        }
                        if (scoreType == "MOBA-1" && nowGame == tmpGameNum)
                            liveStrCss = "now";
                        if (scoreType.match(/MOBA|FPS/)) {
                            useScoreH = scoreType == "MOBA-1" ? tmpKillH : tmpGameH;
                            useScoreC = scoreType == "MOBA-1" ? tmpKillC : tmpGameC
                        }
                        if (result == "Y")
                            if (tmpGameH * 1 == tmpGameC * 1) {
                                score_model = score_model.replace(new RegExp("\\*RESULT_H\\*","gi"), util_game.showTxt("draw"));
                                score_model = score_model.replace(new RegExp("\\*RESULT_C\\*","gi"), util_game.showTxt("draw"))
                            } else if (tmpGameH * 1 > tmpGameC * 1) {
                                score_model = score_model.replace(new RegExp("\\*RESULT_H\\*","gi"), util_game.showTxt("win"));
                                score_model = score_model.replace(new RegExp("\\*RESULT_C\\*","gi"), util_game.showTxt("lose"))
                            } else if (tmpGameH * 1 < tmpGameC * 1) {
                                score_model = score_model.replace(new RegExp("\\*RESULT_H\\*","gi"), util_game.showTxt("lose"));
                                score_model = score_model.replace(new RegExp("\\*RESULT_C\\*","gi"), util_game.showTxt("win"))
                            }
                        score_model = score_model.replace(new RegExp("\\*LIVE\\*","gi"), util_game.showTxt(liveStrCss));
                        score_model = score_model.replace(new RegExp("\\*GAMENUM\\*","gi"), util_game.showTxt(tmpGameNumStr));
                        score_model = score_model.replace(new RegExp("\\*DUR_SCORE\\*","gi"), util_game.showTxt(durStr));
                        score_model = score_model.replace(new RegExp("\\*SCORE_H\\*","gi"), util_game.showTxt(util_game.limitScore(useScoreH)));
                        score_model = score_model.replace(new RegExp("\\*SCORE_C\\*","gi"), util_game.showTxt(util_game.limitScore(useScoreC)));
                        finalHTML += score_model
                    }
                    if (from == "less1024")
                        _mc["es_result"].innerHTML = finalHTML;
                    else
                        parentClass.dispatchEvent("parseRightAnalysis", {
                            "html": finalHTML
                        });
                    setTimeout(function() {
                        _self.showStatLoading(false, "page_on")
                    }, 500)
                }
                ;
                _self.createTimer = function() {
                    var _name = "analysisTimer";
                    var type = showtype == "live" ? "RB" : "FT";
                    if (timerHash[_name] != null)
                        return;
                    timerHash[_name] = new Timer(config_set.get("CONFIG_LIVE_GAME_ANALYSIS"));
                    timerHash[_name].setParentclass(_self);
                    timerHash[_name].init();
                    timerHash[_name].addEventListener("TimerEvent.TIMER", _self.timerRun);
                    timerHash[_name].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish);
                    timerHash[_name].startTimer()
                }
                ;
                _self.timerRun = function() {
                    _self.getData(true)
                }
                ;
                _self.clearTimer = function() {
                    if (timerHash != null) {
                        var _name = "analysisTimer";
                        if (timerHash[_name] != null) {
                            timerHash[_name].clearObj();
                            timerHash[_name].is_clear = true;
                            timerHash[_name] = null
                        }
                    }
                    return true
                }
                ;
                _self.showStatLoading = function(isShow, className) {
                    if (isShow)
                        util.addClass(get("statistics_loading"), className);
                    else
                        util.removeClass(get("statistics_loading"), className)
                }
                ;
                _self.closeStat = function(dontClear) {
                    if (!dontClear) {
                        lastJsonData = "";
                        lastScoreObj = null;
                        _self.clearTimer()
                    }
                    top["analysisData"] = null;
                    util.removeClass(dom.getElementById("statistics_show"), "on");
                    parentClass.dispatchEvent("removebodylock", {});
                    parentClass.dispatchEvent("setNowBodyLockStatus", false);
                    parentClass.dispatchEvent("upAnalysis_status", false)
                }
                ;
                _self.clearJsonData = function() {
                    lastJsonData = "";
                    lastScoreObj = null
                }
                ;
                _self.updateScoreObj = function(scoreObj) {
                    lastScoreObj = scoreObj
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    timerHash = parentClass.getThis("timerHash");
                    LS = parentClass.getThis("LS");
                    LS_code = parentClass.getThis("LS_code");
                    LS_game = parentClass.getThis("LS_game");
                    myhash["timerHash"] = timerHash;
                    myhash["LS"] = LS;
                    myhash["LS_game"] = LS_game;
                    myhash["LS_code"] = LS_code;
                    myhash["headerFrame"] = headerFrame
                }
                ;
                _self.setParam = function(par) {
                    postHash = par;
                    gtype = postHash["gtype"];
                    peid = postHash["peid"];
                    showtype = postHash["showtype"];
                    from = postHash["from"];
                    lastScoreObj = postHash["scoreObj"]
                }
                ;
                _self.getThis = function(varible) {
                    if (!myhash[varible]) {
                        var msg = "no myhash[" + varible + "]";
                        util.writeLog(classname, msg)
                    }
                    return myhash[varible]
                }
                ;
                _self.addEventListener = function(eventname, eventFunction) {
                    eventHandler[eventname] = eventFunction
                }
                ;
                _self.dispatchEvent = function(eventname, param) {
                    if (eventHandler[eventname])
                        eventHandler[eventname](param)
                }
                ;
                _self.updateAnalysisScore = function(scoreObj) {
                    if (top["analysisData"] != null && lastJsonData != "") {
                        console.log("parseData\u8cc7\u6599\u5206\u6790\u958b\uff0c\u66f4\u65b0\u6bd4\u5206");
                        var nowScoreHash = _self.setNowScoreHash(scoreObj);
                        var combineHash = Object.assign({}, top["analysisData"], nowScoreHash);
                        var gameObj = {
                            "gameHash": combineHash,
                            "scoreType": scoreObj.scoreType,
                            "startGame": nowStartGame,
                            "nowGame": scoreObj.nowGame
                        };
                        var parseJson = JSON.parse(lastJsonData);
                        parseJson["response"]["SCORE"] = combineHash;
                        lastJsonData = JSON.stringify(parseJson);
                        top["analysisData"] = combineHash;
                        _self.parseData(gameObj)
                    } else
                        console.log("\u8cc7\u6599\u5206\u6790\u6c92\u958b\uff0c\u4e0d\u66f4\u65b0\u6bd4\u5206")
                }
                ;
                _self.setNowScoreHash = function(obj) {
                    var ret = new Object;
                    var scoreHash = obj.score;
                    var nowGame = obj.nowGame;
                    if (nowGame * 1 > 0)
                        ret["GAME" + nowGame] = scoreHash;
                    return ret
                }
                ;
                function get(_id) {
                    if (hasRightPanel)
                        _id = "R_" + _id;
                    return dom.getElementById(_id)
                }
            }
            ;