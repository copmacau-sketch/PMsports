function right_panel(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var eventHandler = new Object;
                var util = new win.Util(win,dom);
                var util_game = new win.Util_game(win,dom);
                var tv = new win.TV(win,dom);
                var mt = new win.MT(win,dom);
                var config_set = new win.config_set;
                var LS_game;
                var LS;
                var _mc = new Object;
                var MT_data = new Object;
                var timerHash;
                var ecid;
                var isRBorRP;
                var scoreFrame = null;
                var _name = "rightPanelTimer";
                var _nameRB = "rightPanelTimerRB";
                var last_time_gtype = "";
                var last_time_showtype = "";
                var reloadScore = false;
                var totalAD = 4;
                var rightPlay = false;
                var classname = "right_panel";
                var myhash = {};
                var bannerGame = 0;
                var addEventBannerGame = false;
                var accessGoToGame = true;
                _self.init = function() {
                    myhash["config_set"] = config_set;
                    myhash["util"] = util;
                    _self.createIframe();
                    parentClass.dispatchEvent("showLoading", {
                        "isShow": false
                    });
                    _self.addEventListener("openTV", _self.openTV);
                    _self.addEventListener("closeTV", _self.closeTV);
                    _self.addEventListener("videoOnClick", _self.videoOnClick);
                    _self.addEventListener("showAlertMsg", _self.showAlertMsg);
                    _mc["rightP_newbanner"] = dom.getElementById("rightP_" + top["bannerGtype"]);
                    _mc["right_content"] = dom.getElementById("right_content");
                    _mc["R_watch_live"] = dom.getElementById("R_watch_live");
                    _mc["R_loading"] = dom.getElementById("R_loading");
                    _mc["rightP_myGame"] = dom.getElementById("rightP_myGame");
                    _mc["rightP_timeset"] = dom.getElementById("rightP_timeset");
                    _mc["rightP_hotgame"] = dom.getElementById("rightP_hotgame");
                    util.addEvent(_mc["rightP_hotgame"], "click", _self.goToHotGame);
                    _mc["rightP_result"] = document.getElementById("rightP_result");
                    util.addEvent(_mc["rightP_result"], "click", _self.goToResult);
                    util.addEvent(_mc["rightP_myGame"], "click", _self.chgPage, {
                        "page": "features",
                        "data": "data_1"
                    });
                    util.addEvent(_mc["rightP_timeset"], "click", _self.chgPage, {
                        "page": "features",
                        "data": "data_12"
                    });
                    for (var i = 1; i <= totalAD; i++) {
                        _mc["R_innart0" + i] = document.getElementById("R_innart0" + i);
                        util.addEvent(_mc["R_innart0" + i], "click", _self.chgPage, {
                            "page": "features"
                        })
                    }
                    var showCUP = (top["specialGame"]["Total_Count"] > 0 || top["specialGame"]["CUP_GROUP_count"] > 0 && (top.specialGame.standings_sw == "Y" || top.specialGame.cup_standings_sw == "Y" && top.specialGame.period == "IN")) && top["specialGame"]["cup_postToFrontend_sw"] == "Y" && top.specialGame.mode == "CUP";
                    _mc["rightP_forecast"] = document.getElementById("rightP_forecast");
                    util.addEvent(_mc["rightP_forecast"], "click", _self.chgPage, {
                        "page": "features",
                        "data": "data_7"
                    });
                    _mc["R_dl_innart"] = dom.getElementById("R_dl_innart");
                    _mc["R_dl_google"] = dom.getElementById("R_dl_google");
                    _mc["R_btn_store"] = dom.getElementById("R_btn_store");
                    var isIOS = util.isIOS();
                    if (top.isapp == "N" && !isIOS && top.mobile != "N") {
                        _mc["R_dl_innart"].style.display = "";
                        util.addEvent(_mc["R_dl_google"], "click", _self.chgDownloadPage);
                        util.addEvent(_mc["R_btn_store"], "click", _self.goToGoogle)
                    } else {
                        _mc["R_dl_innart"].style.display = "none";
                        util.removeEvent(_mc["R_dl_google"], "click");
                        util.removeEvent(_mc["R_btn_store"], "click")
                    }
                    config_set.init();
                    _self.createTimer();
                    parentClass.dispatchEvent("checkCount", {});
                    _self.bannerGameCount(parentClass.bannerCount())
                }
                ;
                _self.goToSpecialPage = function(e, param) {
                    var nowTS = util.getTimestamp();
                    top["lastClickTS"] = nowTS;
                    param.nowTS = nowTS;
                    var hasCUP = top.specialGame.mode == "CUP";
                    if (top["specialGame"]["Total_Count"] != "0" && hasCUP)
                        parentClass.dispatchEvent("goToSpecialPage", param)
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
                    myhash["LS_code"] = LS_code
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
                _self.createTimer = function() {
                    var ret = _self.clearTimer();
                    if (ret) {
                        if (timerHash[_name] == null) {
                            timerHash[_name] = new Timer(config_set.get("CONFIG_RIGHT_PANEL"));
                            timerHash[_name].setParentclass(_self);
                            timerHash[_name].dont_clear = true;
                            timerHash[_name].init();
                            timerHash[_name].addEventListener("TimerEvent.TIMER", _self.timerRun);
                            timerHash[_name].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish)
                        }
                        if (timerHash[_nameRB] == null) {
                            timerHash[_nameRB] = new Timer(config_set.get("CONFIG_RIGHT_PANEL_LIVE"));
                            timerHash[_nameRB].setParentclass(_self);
                            timerHash[_nameRB].dont_clear = true;
                            timerHash[_nameRB].init();
                            timerHash[_nameRB].addEventListener("TimerEvent.TIMER", _self.timerRun);
                            timerHash[_nameRB].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish)
                        }
                    }
                }
                ;
                _self.startTimer = function() {
                    if (top.rightRB == "Y") {
                        if (timerHash[_nameRB] == null) {
                            _self.createTimer();
                            return
                        }
                        if (!timerHash[_nameRB].isRunning())
                            timerHash[_nameRB].startTimer()
                    } else {
                        if (timerHash[_name] == null) {
                            _self.createTimer();
                            return
                        }
                        if (!timerHash[_name].isRunning())
                            timerHash[_name].startTimer()
                    }
                }
                ;
                _self.stopTimer = function() {
                    if (timerHash[_name] != null)
                        timerHash[_name].stopTimer();
                    if (timerHash[_nameRB] != null)
                        timerHash[_nameRB].stopTimer()
                }
                ;
                _self.clearTimer = function() {
                    if (timerHash != null) {
                        if (timerHash[_name] != null) {
                            timerHash[_name].clearObj();
                            timerHash[_name].is_clear = true;
                            timerHash[_name] = null
                        }
                        if (timerHash[_nameRB] != null) {
                            timerHash[_nameRB].clearObj();
                            timerHash[_nameRB].is_clear = true;
                            timerHash[_nameRB] = null
                        }
                    }
                    return true
                }
                ;
                _self.timerRun = function(count) {
                    if (getView().viewportwidth >= 1024)
                        _self.getData()
                }
                ;
                _self.timerFinish = function(count) {}
                ;
                _self.initTV = function() {
                    tv.init(true);
                    tv.setParentclass(_self);
                    mt.setGameID("");
                    mt.setParentclass(_self)
                }
                ;
                _self.loadRightScore = function(par) {
                    util.setObjectClass(_mc["right_content"], top.choice_gtype);
                    var isTVExist = tv.chkExist();
                    var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
                    if (!isTVExist)
                        _self.initTV();
                    if (last_time_gtype != top.rightGtype || last_time_showtype != top.rightShowType || par.reload == "Y") {
                        last_time_gtype = top.rightGtype;
                        last_time_showtype = top.rightShowType;
                        reloadScore = true
                    } else
                        reloadScore = false;
                    if (reloadScore) {
                        if (top.rightECID != "")
                            _self.setRightLoading(true);
                        var isOther = top.resizePage == "other" || top.choice_rtype == "fs" && top.rightECID != "" || (top.choice_showtype.match(/mygame|today|hot|soon/) || isSpecialGame == "Y") && top.rightECID != "";
                        par.scoreGtype = isOther && top.rightGtype != null ? top.rightGtype : top.choice_gtype;
                        par.scoreShowType = isOther && top.rightShowType != null ? top.rightShowType : top.choice_showtype;
                        _self.loadScore(par)
                    } else if (par.tarObj && par.obj)
                        par.scFun(par.tarObj, par.obj);
                    else {
                        if (par.scFun)
                            if (par.scParam)
                                par.scFun("", par.scParam);
                            else
                                par.scFun(true);
                        if (par.analysisHash)
                            parentClass.dispatchEvent("getAnalysisData", par.analysisHash)
                    }
                }
                ;
                _self.loadScore = function(par) {
                    var tmpGtype = par.scoreGtype;
                    var tmpShowType = par.scoreShowType;
                    var param = new Object;
                    param["page"] = "right_score";
                    param["target"] = "right_content";
                    param["retFun"] = _self.loadScoreComplete;
                    if (par.scFun)
                        param["scFun"] = par.scFun;
                    if (par.scParam)
                        param["scParam"] = par.scParam;
                    if (par.tarObj)
                        param["tarObj"] = par.tarObj;
                    if (par.obj)
                        param["obj"] = par.obj;
                    if (par.analysisHash)
                        param["analysisHash"] = par.analysisHash;
                    param["scoreGtype"] = tmpGtype;
                    param["postHash"] = {
                        "gtype": tmpGtype,
                        "showtype": tmpShowType
                    };
                    param["extendsClass"] = "right_panel";
                    param["parentClass"] = _self;
                    param["post"] = "gtype=" + tmpGtype + "&showtype=" + tmpShowType;
                    parentClass.dispatchEvent("goToPage", param)
                }
                ;
                _self.loadScoreComplete = function(param) {
                    var ev_gtype = param.scoreGtype == "ft" ? "game_more" : "game_more_" + param.scoreGtype.toUpperCase();
                    var extendsClassPage = _self.new_eval(param["extendsClass"]);
                    var extendsClassObj = new extendsClassPage(win,dom,param.postHash);
                    scoreFrame = util.extendsClass(extendsClassObj, _self.new_eval(ev_gtype), win, dom, param["postHash"]);
                    var parantClass = param.parentClass != null ? param.parentClass : _self;
                    scoreFrame.setParentclass(parantClass);
                    scoreFrame.setHasRightPanel();
                    if (param.scFun)
                        if (param.tarObj && param.obj)
                            param.scFun(param.tarObj, param.obj);
                        else if (param.scParam)
                            param.scFun("", param.scParam);
                        else
                            param.scFun(true);
                    if (param.analysisHash)
                        parentClass.dispatchEvent("getAnalysisData", param.analysisHash)
                }
                ;
                _self.getData = function(OuterOpen, tvPlay) {
                    var _gid = "";
                    if (top.resize_mainGame != undefined)
                        if (top.rightGtype != "ft")
                            _gid = util.getKeyValue(null, top.resize_mainGame, "gid");
                        else
                            _gid = xmlnode.Node(top.resize_mainGame, "gid").innerHTML;
                    var par = top.param;
                    par += "&p=get_game_more";
                    par += "&from=right_panel";
                    par += "&gtype=" + top.rightGtype;
                    var tmpShowType = "";
                    if (top.rightShowType == "mygame")
                        tmpShowType = top["myGameHash"][top.rightGtype][top.rightECID]["showtype"];
                    else
                        tmpShowType = top.rightShowType;
                    par += "&showtype=" + tmpShowType;
                    par += "&ltype=" + top["userData"].ltype;
                    par += "&isRB=" + top.rightRB;
                    if (top.rightGtype == "ft")
                        par += "&ecid=" + top.rightECID;
                    else
                        par += "&gid=" + _gid;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.getDataError);
                    getHTML.addEventListener("LoadComplete", function(xml) {
                        _self.getDataComplete(xml, tvPlay)
                    });
                    getHTML.loadURL(top.m2_url, "POST", par)
                }
                ;
                _self.getDataError = function() {}
                ;
                _self.getDataComplete = function(data, tvPlay) {
                    var isJson = top.rightGtype != "ft" ? true : false;
                    var tmpShowType = "";
                    if (top.rightShowType == "mygame")
                        tmpShowType = top["myGameHash"][top.rightGtype][top.rightECID]["showtype"];
                    else
                        tmpShowType = top.rightShowType;
                    var showtype = tmpShowType;
                    if (isJson) {
                        var jsonData = data;
                        var parseJson = JSON.parse(jsonData);
                        var status = parseJson["status"];
                        var gameObj = parseJson["response"]["GAMES"];
                        var scoreObj = new Array;
                        var videoObj = parseJson["response"]["VIDEO"];
                        var phpData = parseJson["phpData"];
                        var game = new Array;
                        var mainGame = null;
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
                        if (status == "success")
                            if (game.length > 0) {
                                top.resize_mainGame = mainGame;
                                top.rightFrom = "game_more";
                                var gopen = mainGame["GOPEN"];
                                var Live = mainGame["IS_LIVE"];
                                var scDataObj = scoreFrame.setScoreBoard(mainGame, showtype, gopen, Live, OuterOpen, LS_game, scoreObj);
                                top.scDataObj = scDataObj;
                                if (!top.rightAllClosed)
                                    scoreFrame.parseScoreBoard(scDataObj, "right_panel");
                                _self.checkLiveJson(videoObj, mainGame, "right_panel")
                            } else if (getView().viewportwidth >= 1024) {
                                var eventid_ph = videoObj["TV_ID"];
                                var center_tv = videoObj["CENTER_TV"];
                                var eventid_mt = videoObj["MT_ID"];
                                var mtgtype = videoObj["MT_GTYPE"];
                                var mtspid = videoObj["MT_SID"];
                                var lineups = videoObj["MT_LINEUPS"];
                                MT_data["gtype"] = mtgtype;
                                MT_data["spid"] = mtspid;
                                _self.noGameCheckLive(eventid_ph, center_tv, eventid_mt, MT_data, lineups, "right_panel")
                            }
                    } else {
                        var xml = data;
                        xmlnode = util.parseXml(xml);
                        _xmlnode = xmlnode;
                        var code = xmlnode.Node(xmlnode.Root[0], "code").innerHTML;
                        var nowMode = xmlnode.Node(xmlnode.Root[0], "nowMode").innerHTML;
                        var hasEC = xmlnode.Node(xmlnode.Root[0], "hasEC").innerHTML;
                        var game = xmlnode.Node(xmlnode.Root[0], "game", false);
                        var allGameDisRB = xmlnode.Node(xmlnode.Root[0], "all_close").innerHTML;
                        if (code == "617") {
                            var mainGame = null;
                            var _id, gdata, mode, master;
                            if (game.length > 0) {
                                for (var i = 0; i < game.length; i++) {
                                    gdata = game[i];
                                    _id = gdata.getAttribute("id");
                                    mode = gdata.getAttribute("mode");
                                    master = gdata.getAttribute("master");
                                    if (hasEC != "Y" || mode == "" && nowMode == "")
                                        mode = "FT";
                                    if (mode)
                                        if (hasEC == "Y" && nowMode == mode && master == "Y")
                                            mainGame = game[i]
                                }
                                if (mainGame == null)
                                    mainGame = game[0];
                                top.resize_mainGame = mainGame;
                                top.rightFrom = "game_more";
                                var game_mode = hasEC == "Y" ? nowMode : mode;
                                var gopen = xmlnode.Node(game[0], "gopen").innerHTML;
                                var Live = xmlnode.Node(game[0], "Live").innerHTML;
                                var OuterOpen = false;
                                var scDataObj = scoreFrame.setScoreBoard(game_mode, mainGame, showtype, gopen, Live, OuterOpen, allGameDisRB);
                                scDataObj.isRB = top.rightRB;
                                top.scDataObj = scDataObj;
                                if (!top.rightAllClosed)
                                    scoreFrame.parseScoreBoard(scDataObj, "right_panel");
                                _self.checkLive(xmlnode, mainGame, "right_panel")
                            } else if (getView().viewportwidth >= 1024) {
                                var eventid_ph = xmlnode.Node(xmlnode.Root[0], "eventid_phone").innerHTML;
                                var center_tv = xmlnode.Node(xmlnode.Root[0], "center_tv").innerHTML;
                                var eventid_mt = xmlnode.Node(xmlnode.Root[0], "mt_id").innerHTML;
                                var mtgtype = xmlnode.Node(xmlnode.Root[0], "mt_gtype").innerHTML;
                                var mtspid = xmlnode.Node(xmlnode.Root[0], "mt_sid").innerHTML;
                                var lineups = xmlnode.Node(xmlnode.Root[0], "mt_lineups").innerHTML;
                                MT_data["gtype"] = mtgtype;
                                MT_data["spid"] = mtspid;
                                _self.noGameCheckLive(eventid_ph, center_tv, eventid_mt, MT_data, lineups, "right_panel")
                            }
                        }
                    }
                    if (tvPlay)
                        _self.resizeEvent("defaultPlay");
                    _self.setRightLoading(false);
                    parentClass.dispatchEvent("showLoading", {
                        "isShow": false
                    })
                }
                ;
                _self.checkLive = function(xmlnode, main_game, from) {
                    var tagName = top.rightFrom == "game_list" ? "eventid" : "eventid_phone";
                    var spid = top.rightFrom == "game_list" ? "mt_spid" : "mt_sid";
                    var eventid_ph = util.getKeyValue(xmlnode, main_game, tagName);
                    var center_tv = util.getKeyValue(xmlnode, main_game, "center_tv");
                    var eventid_mt = util.getKeyValue(xmlnode, main_game, "mt_id");
                    var mtgtype = util.getKeyValue(xmlnode, main_game, "mt_gtype");
                    var mtspid = util.getKeyValue(xmlnode, main_game, spid);
                    var lineups = util.getKeyValue(xmlnode, main_game, "mt_lineups");
                    var ph_sw = util.getKeyValue(xmlnode, main_game, "tv_ph_sw");
                    var scoreType = util.getKeyValue(xmlnode, main_game, "scoreType");
                    var myShowtype = util.getKeyValue(xmlnode, main_game, "mygame");
                    var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
                    if (typeof eventid_mt == "undefined")
                        eventid_mt = "";
                    if (ph_sw == null || ph_sw == "" || ph_sw == undefined)
                        ph_sw = "Y";
                    if (ph_sw == "N")
                        eventid_ph = "";
                    MT_data["gtype"] = mtgtype;
                    MT_data["spid"] = mtspid;
                    var datetime = util.getKeyValue(xmlnode, main_game, "datetime");
                    var systime = util.getKeyValue(xmlnode, main_game, "systime");
                    if (systime)
                        datetime = _self.getGameDate(datetime, systime);
                    MT_data["datetime"] = datetime;
                    MT_data["systime"] = systime;
                    MT_data["scoreType"] = scoreType;
                    MT_data["myShowtype"] = myShowtype ? util.switchShowType(myShowtype, false) : top.choice_showtype;
                    isRBorRP = top.rightShowType == "live" || (top.rightShowType == "today" || top.rightShowType == "parlay" || top.choice_showtype == "mygame" || isSpecialGame == "Y") && top.rightRB == "Y" ? true : false;
                    _self.checkLiveProc(eventid_ph, center_tv, eventid_mt, MT_data, lineups, ph_sw, tv, mt, from)
                }
                ;
                _self.checkLiveJson = function(videoObj, main_game, from) {
                    var eventid_ph = videoObj ? videoObj["TV_ID"] : "";
                    var center_tv = videoObj ? videoObj["CENTER_TV"] : "";
                    var eventid_mt = videoObj ? videoObj["MT_ID"] : "";
                    var mtgtype = videoObj ? videoObj["MT_GTYPE"] : "";
                    var mtspid = videoObj ? videoObj["MT_SID"] : "";
                    var lineups = videoObj ? videoObj["MT_LINEUPS"] : "";
                    var ph_sw = videoObj ? videoObj["TV_PH_SW"] : "";
                    var scoreType = main_game["SCORETYPE"];
                    var myShowtype = main_game["SHOWTYPE"];
                    var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
                    if (typeof eventid_mt == "undefined")
                        eventid_mt = "";
                    if (ph_sw == null || ph_sw == "" || ph_sw == undefined)
                        ph_sw = "Y";
                    if (ph_sw == "N")
                        eventid_ph = "";
                    MT_data["gtype"] = mtgtype;
                    MT_data["spid"] = mtspid;
                    var datetime = main_game["DATETIME"];
                    var systime = main_game["SYSTIME"];
                    if (systime)
                        datetime = _self.getGameDate(datetime, systime);
                    MT_data["datetime"] = datetime;
                    MT_data["systime"] = systime;
                    MT_data["scoreType"] = scoreType;
                    MT_data["myShowtype"] = myShowtype ? util.switchShowType(myShowtype, false) : top.choice_showtype;
                    isRBorRP = top.rightShowType == "live" || (top.rightShowType == "today" || top.rightShowType == "parlay" || top.choice_showtype == "mygame" || isSpecialGame == "Y") && top.rightRB == "Y" ? true : false;
                    _self.checkLiveProc(eventid_ph, center_tv, eventid_mt, MT_data, lineups, ph_sw, tv, mt, from)
                }
                ;
                _self.noGameCheckLive = function(eventid_ph, center_tv, eventid_mt, MT_data, lineups, from) {
                    var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
                    isRBorRP = top.rightShowType == "live" || (top.rightShowType == "parlay" || top.choice_showtype == "mygame" || isSpecialGame == "Y") && top.rightRB == "Y" ? true : false;
                    _self.checkLiveProc(eventid_ph, center_tv, eventid_mt, MT_data, lineups, "Y", tv, mt, from)
                }
                ;
                _self.checkLiveProc = function(eventid_ph, center_tv, eventid_mt, MT_data, lineups, ph_sw, tv, mt, from) {
                    var isAllow = MT_data != null && MT_data.gtype != null && MT_data.gtype != "" ? mt.checkGtype(MT_data.gtype) : false;
                    var hasMT = typeof eventid_mt != "undefined" && eventid_mt != "" && eventid_mt != "0" && isAllow;
                    var hasTV = typeof eventid_ph != "undefined" && eventid_ph != "" && eventid_ph != "0" && ph_sw == "Y";
                    var hasES = top.rightGtype == "es" && top.rightECID != "" && top.rightNowPlay == "ES";
                    var showTV = hasMT || hasTV || hasES;
                    if (!hasTV && hasMT)
                        top.rightNowPlay = "MT";
                    top.rightShowTV = showTV;
                    if (!showTV) {
                        _self.setRightLoading(false);
                        _self.setVisible(false)
                    }
                    if (top.rightGtype == "ft")
                        if (hasTV && top.resize_mainGame != null) {
                            if (from == "game_more") {
                                if (dom.getElementById("clothes_h"))
                                    dom.getElementById("clothes_h").style.display = "";
                                if (dom.getElementById("clothes_h_600"))
                                    dom.getElementById("clothes_h_600").style.display = "";
                                if (dom.getElementById("clothes_c"))
                                    dom.getElementById("clothes_c").style.display = "";
                                if (dom.getElementById("clothes_c_600"))
                                    dom.getElementById("clothes_c_600").style.display = ""
                            }
                            if (get("clothes_h"))
                                get("clothes_h").style.display = "";
                            if (get("clothes_h_600"))
                                get("clothes_h_600").style.display = "";
                            if (get("clothes_c"))
                                get("clothes_c").style.display = "";
                            if (get("clothes_c_600"))
                                get("clothes_c_600").style.display = ""
                        } else {
                            if (from == "game_more") {
                                if (dom.getElementById("clothes_h"))
                                    dom.getElementById("clothes_h").style.display = "none";
                                if (dom.getElementById("clothes_h_600"))
                                    dom.getElementById("clothes_h_600").style.display = "none";
                                if (dom.getElementById("clothes_c"))
                                    dom.getElementById("clothes_c").style.display = "none";
                                if (dom.getElementById("clothes_c_600"))
                                    dom.getElementById("clothes_c_600").style.display = "none"
                            }
                            if (get("clothes_h"))
                                get("clothes_h").style.display = "none";
                            if (get("clothes_h_600"))
                                get("clothes_h_600").style.display = "none";
                            if (get("clothes_c"))
                                get("clothes_c").style.display = "none";
                            if (get("clothes_c_600"))
                                get("clothes_c_600").style.display = "none"
                        }
                    if ((tv.getCenterTV() != center_tv || tv.getEventid() != eventid_ph || mt.getGameID() != eventid_mt || hasES) && !top.rightAllClosed) {
                        var tmpOrientation = win.Math.abs(win.orientation);
                        if (getView().viewportwidth >= 1024 || tmpOrientation == 90) {
                            if (center_tv == top.old_center_tv && eventid_ph == top.old_token && top.rightNowPlay == "MT" && top.resizePage == "other")
                                var sameTV = "same";
                            echo("[right_checkLive][center_tv]:" + center_tv + "====[rightECID]:" + top.rightECID);
                            tv.setVariable({
                                "center_tv": center_tv,
                                "token": eventid_ph
                            });
                            if (top.rightGtype != "es")
                                tv.setVisible(showTV);
                            if (!showTV) {
                                _self.resetRightTV();
                                _self.setRightLoading(false);
                                _self.setVisible(false);
                                if (from == "right_panel")
                                    top.rightAllClosed = true;
                                return
                            }
                            if (mt.getGameID() != eventid_mt) {
                                mt.init(MT_data, true);
                                mt.setGameID(eventid_mt)
                            }
                            if (hasMT) {
                                mt.setLinesup(lineups);
                                if (sameTV == "same")
                                    mt.setTvVisible(sameTV);
                                else
                                    mt.setTvVisible(hasTV)
                            }
                            if (hasTV && !hasMT) {
                                mt.setShowRight(true);
                                mt.onlyTV()
                            } else
                                mt.mtScroll();
                            if (from != "right_panel") {
                                var nowPage = _self.getNowPage();
                                echo("[right_panel][resizePage]:" + top.resizePage + "[nowPage]:" + nowPage);
                                if (top.resizePage != "home" && nowPage != "home")
                                    _self.setVisible(true);
                                if (isRBorRP)
                                    setTimeout(_self.closeRightLoadingSlowly, "500")
                            }
                            if (!isRBorRP) {
                                top["pageTS"]["rightTV"] = util.getTimestamp();
                                tv.setLoadingTV(true);
                                tv.setErrorTV({
                                    "msg": LS.get("event_not_start"),
                                    "closeLoading": "N"
                                });
                                setTimeout(_self.setErrorTVSlowly, "1000")
                            }
                        } else
                            console.trace("[right][checkLive]error")
                    } else {
                        setTimeout(_self.closeRightLoadingSlowly, "500");
                        if (!isRBorRP)
                            tv.setErrorTV({
                                "msg": LS.get("event_not_start")
                            })
                    }
                }
                ;
                _self.setErrorTVSlowly = function() {
                    if (top.rightRB != "Y") {
                        tv.setLoadingTV(false);
                        _self.setRightLoading(false)
                    }
                }
                ;
                _self.closeRightLoadingSlowly = function() {
                    parentClass.dispatchEvent("setRightLoading", {
                        "isShow": false
                    })
                }
                ;
                _self.resetRightTV = function() {
                    var isTVExist = tv.chkExist();
                    if (isTVExist) {
                        var ret = tv.clearTV();
                        if (ret) {
                            tv.resetVideo();
                            if (mt.chkExist()) {
                                mt.chgCollapseClass(true);
                                mt.clearMT()
                            }
                        }
                    }
                }
                ;
                _self.setRightLoading = function(isShow) {
                    if (isShow)
                        util.addClass(_mc["R_loading"], "on_loading");
                    else
                        util.removeClass(_mc["R_loading"], "on_loading")
                }
                ;
                _self.setVisible = function(isShow) {
                    if (isShow) {
                        if (dom.getElementById("R_score_board"))
                            dom.getElementById("R_score_board").style.display = "";
                        if (dom.getElementById("R_div_matches"))
                            dom.getElementById("R_div_matches").style.display = "";
                        if (top.choice_gtype != "es")
                            _mc["R_watch_live"].style.display = "";
                        else
                            _mc["R_watch_live"].style.display = "none"
                    } else {
                        if (dom.getElementById("R_score_board"))
                            dom.getElementById("R_score_board").style.display = "none";
                        if (dom.getElementById("R_div_matches"))
                            dom.getElementById("R_div_matches").style.display = "none";
                        _mc["R_watch_live"].style.display = "none"
                    }
                }
                ;
                _self.parseRightScoreBoard = function(obj) {
                    scoreFrame.parseScoreBoard(obj, "right_panel")
                }
                ;
                _self.parseRightAnalysis = function(obj) {
                    dom.getElementById("R_es_result").innerHTML = obj.html
                }
                ;
                _self.showRightAnalysis = function(sw) {
                    dom.getElementById("R_statistics_content").style.display = sw ? "" : "none"
                }
                ;
                _self.parseNoGameRightScoreBoard = function(obj) {
                    scoreFrame.parseNoGameScoreBoard(obj)
                }
                ;
                _self.resizeEvent = function(act) {
                    switch (act) {
                    case "clear":
                        tv.clearTV();
                        tv.resetVideo();
                        break;
                    case "defaultPlay":
                        tv.defaultPlay();
                        break;
                    case "play":
                        tv.play();
                        break;
                    case "pause":
                        tv.pause();
                        break;
                    default:
                        tv.defaultPlay();
                        break
                    }
                }
                ;
                _self.chkTvPlaying = function() {
                    return tv.getPlaying()
                }
                ;
                _self.getGameDate = function(xml_datetime, sys_time) {
                    var ret = "";
                    var year = "";
                    var tmpdate = xml_datetime.split(" ");
                    var xml_date = tmpdate[0];
                    var gmt = new Date(sys_time.replace(/-/g, "/"));
                    var now_m = parseInt(gmt.getMonth() + 1);
                    var split_xml_date = xml_date.split("-");
                    var game_m = parseInt(split_xml_date[0]);
                    if (now_m > game_m)
                        gmt.setFullYear(gmt.getFullYear() + 1);
                    if (split_xml_date.length == 2)
                        year = gmt.getFullYear() + "-";
                    var gameTime = year + xml_datetime;
                    ret = _self.get24Hours(gameTime);
                    return ret
                }
                ;
                _self.get24Hours = function(datetime) {
                    var ret = "";
                    var tmp = datetime.replace(/-/g, "/");
                    var split_datetime = datetime.split(" ");
                    tmp = tmp.replace(/a/g, " am").replace(/p/g, " pm");
                    var getTime = new Date(tmp);
                    var h = getTime.getHours();
                    var m = getTime.getMinutes();
                    ret = split_datetime[0] + " " + h + ":" + m + ":00";
                    return ret
                }
                ;
                _self.setTVDefaultPlay = function(obj) {
                    var center_tv = top.choice_gtype != "ft" ? obj["data"]["CENTER_TV"] : obj["data"]["center_tv"];
                    var eventid_ph = top.choice_gtype != "ft" ? obj["data"]["EVENTID"] : obj["data"]["eventid"];
                    var eventid_mt = top.choice_gtype != "ft" ? obj["data"]["MT_ID"] : obj["data"]["mt_id"];
                    var mtgtype = top.choice_gtype != "ft" ? obj["data"]["MT_GTYPE"] : obj["data"]["mt_gtype"];
                    var mtspid = top.choice_gtype != "ft" ? obj["data"]["MT_SPID"] : obj["data"]["mt_spid"];
                    var lineups = top.choice_gtype != "ft" ? obj["data"]["MT_LINEUPS"] : obj["data"]["mt_lineups"];
                    var hasTV = obj["hasTV"];
                    var hasMT = obj["hasMT"];
                    var hasES = obj["hasES"];
                    var isRB = obj["isRB"];
                    isRBorRP = isRB == "Y" ? true : false;
                    var showTV = hasMT || hasTV;
                    top.rightShowTV = showTV;
                    MT_data["gtype"] = mtgtype;
                    MT_data["spid"] = mtspid;
                    var _datetime = top.choice_gtype != "ft" ? obj["data"]["DATETIME"] : obj["data"]["datetime"];
                    var _systime = top.choice_gtype != "ft" ? obj["data"]["SYSTIME"] : obj["data"]["systime"];
                    MT_data["datetime"] = _self.getGameDate(_datetime, _systime);
                    MT_data["systime"] = _systime;
                    if (top.choice_gtype == "ft")
                        if (hasTV) {
                            get("clothes_h").style.display = "";
                            get("clothes_h_600").style.display = "";
                            get("clothes_c").style.display = "";
                            get("clothes_c_600").style.display = ""
                        } else {
                            get("clothes_h").style.display = "none";
                            get("clothes_h_600").style.display = "none";
                            get("clothes_c").style.display = "none";
                            get("clothes_c_600").style.display = "none"
                        }
                    if (getView().viewportwidth >= 1024) {
                        if (top.choice_gtype != "es") {
                            tv.setVariable({
                                "center_tv": center_tv,
                                "token": eventid_ph
                            });
                            tv.setVisible(showTV);
                            mt.init(MT_data, true)
                        }
                        if (hasMT) {
                            mt.setLinesup(lineups);
                            mt.setGameID(eventid_mt);
                            mt.setTvVisible(hasTV)
                        }
                        if (hasTV && !hasMT)
                            mt.onlyTV();
                        else
                            mt.mtScroll();
                        var nowPage = _self.getNowPage();
                        echo("[right_panel][resizePage]:" + top.resizePage + "[nowPage]:" + nowPage);
                        if (top.resizePage != "home" && nowPage != "home")
                            _self.setVisible(true);
                        if (!isRBorRP)
                            tv.setErrorTV({
                                "msg": LS.get("event_not_start")
                            })
                    } else
                        console.trace("[right][setTVDefaultPlay]error")
                }
                ;
                _self.openTV = function(e, param) {
                    if (e && e.from == "tv_btn") {
                        tv.setLoadingTV(true);
                        tv.openEvent(isRBorRP);
                        setTimeout(_self.closeLoadingTVSlowly, "1000")
                    } else
                        tv.openEvent(isRBorRP)
                }
                ;
                _self.closeLoadingTVSlowly = function() {
                    if (top.rightRB == "N")
                        tv.setLoadingTV(false)
                }
                ;
                _self.closeTV = function(e, param) {
                    tv.closeEvent()
                }
                ;
                _self.playRightTV = function() {
                    mt.chgCollapseClass(top.collapseClick);
                    tv.defaultPlay()
                }
                ;
                _self.resizeMTEvent = function() {
                    mt.resetOnmessage();
                    get("watch_live").style.display = "none";
                    if (top.rightNowPlay == "TV" && mt.getNowBox() != "tv_box")
                        setTimeout(mt.setBtnLight, 300, "tv_btn");
                    else if (top.rightNowPlay == "MT" && mt.getNowBox() != "mt_box")
                        setTimeout(mt.setBtnLight, 300, "mt_btn");
                    if (top.resizeMTSub != "")
                        mt.setBtnLight(top.resizeMTSub);
                    else if (top.resizeMTSub == "")
                        mt.closeMTsub();
                    if (top.choice_gtype != "es") {
                        setTimeout(mt.collapseTV_resize, 300, top.collapseClick);
                        mt.timelineSwitch(top.resizeTimeClick)
                    }
                }
                ;
                _self.chkRightScore = function() {
                    return _mc["right_content"].innerHTML != ""
                }
                ;
                _self.showRightMsg = function(isShowMsg) {
                    if (isShowMsg) {
                        dom.getElementById("R_close_alert_msg").style.display = "";
                        dom.getElementById("R_info_pop").style.display = ""
                    } else {
                        dom.getElementById("R_close_alert_msg").style.display = "none";
                        dom.getElementById("R_info_pop").style.display = "none"
                    }
                }
                ;
                _self.chgPage = function(e, param) {
                    if (param.page == "features")
                        top["lastClickTS"] = util.getTimestamp();
                    parentClass.dispatchEvent("hideAlertMsg", {
                        "use": "noPopMainClear"
                    });
                    param.noCache = "Y";
                    parentClass.dispatchEvent("bodyGoToPage", param)
                }
                ;
                _self.intoGame = function(e) {
                    headerFrame.noHeaderToSport();
                    var GameObj = {
                        "page": "game_list_" + top["bannerGtype"],
                        "extends": "game_list",
                        "gtype": top["bannerGtype"].toLowerCase(),
                        "showtype": "today",
                        "rtype": "r"
                    };
                    top.showGtype["today"] = top["bannerGtype"].toLowerCase();
                    top.choice_filter = "FT";
                    parentClass.dispatchEvent("intoGame", GameObj)
                }
                ;
                _self.goToHotGame = function(e) {
                    headerFrame.noHeaderToSport();
                    top.choice_gtype = top.showGtype["hot"];
                    var GameObj = {
                        "page": "game_list_" + top.choice_gtype.toUpperCase(),
                        "extends": "game_list",
                        "gtype": top.choice_gtype,
                        "showtype": "hot",
                        "rtype": "r"
                    };
                    top.choice_filter = "";
                    parentClass.dispatchEvent("intoGame", GameObj)
                }
                ;
                _self.bannerGameCount = function(count) {
                    bannerGame = count * 1;
                    accessGoToGame = top.clean_data_sw != "Y" && top.userData.enable != "S" ? true : false;
                    if (accessGoToGame) {
                        if (bannerGame > 0) {
                            util.removeClass(_mc["rightP_newbanner"], "no_event");
                            if (!addEventBannerGame) {
                                util.addEvent(_mc["rightP_newbanner"], "click", _self.intoGame);
                                addEventBannerGame = true
                            }
                        } else {
                            util.addClass(_mc["rightP_newbanner"], "no_event");
                            util.removeEvent(_mc["rightP_newbanner"], "click");
                            addEventBannerGame = false
                        }
                        util.removeClass(_mc["rightP_hotgame"], "no_event");
                        util.addEvent(_mc["rightP_hotgame"], "click", _self.goToHotGame)
                    } else {
                        util.addClass(_mc["rightP_hotgame"], "no_event");
                        util.addClass(_mc["rightP_newbanner"], "no_event");
                        util.removeEvent(_mc["rightP_newbanner"], "click");
                        util.removeEvent(_mc["rightP_hotgame"], "click");
                        addEventBannerGame = false
                    }
                }
                ;
                _self.showBannerCUP = function(isShow) {
                    accessGoToGame = top.clean_data_sw != "Y" && top.userData.enable != "S" ? true : false;
                    if (accessGoToGame)
                        if (isShow) {
                            util.removeClass(_mc["rightP_2025CUP"], "no_event");
                            if (top.specialGame.SW)
                                util.addEvent(_mc["rightP_2025CUP"], "click", _self.goToSpecialPage, {
                                    "specialClick": "special",
                                    "type": "live",
                                    "page": "league_index",
                                    "showtype": "live",
                                    "rtype": "rb",
                                    "from": "pic",
                                    "kind": "highlights"
                                })
                        } else {
                            util.addClass(_mc["rightP_2025CUP"], "no_event");
                            util.removeEvent(_mc["rightP_2025CUP"], "click")
                        }
                    else {
                        util.addClass(_mc["rightP_2025CUP"], "no_event");
                        util.removeEvent(_mc["rightP_2025CUP"], "click")
                    }
                }
                ;
                _self.chgDownloadPage = function() {
                    var urlParams = "";
                    urlParams += "uid=" + top["userData"].uid;
                    urlParams += "&langx=" + top.langx;
                    urlParams = "p=guide_HGApp&ver=" + top.ver + "&" + urlParams;
                    window.open(top.m2_url + "?" + urlParams)
                }
                ;
                _self.goToGoogle = function() {
                    window.open("https://play.google.com/store/apps/details?id=com.hg0088.sib")
                }
                ;
                _self.createIframe = function() {
                    var main = dom.createElement("iframe");
                    main.id = "R_mt_main";
                    main.className = "mt_main";
                    main.scrolling = "no";
                    dom.getElementById("R_mt_show").appendChild(main);
                    var sub = dom.createElement("iframe");
                    sub.id = "R_mt_sub";
                    sub.scrolling = "no";
                    dom.getElementById("R_content_popup").appendChild(sub)
                }
                ;
                _self.setTVPlaying = function(isPlay) {
                    rightPlay = isPlay
                }
                ;
                _self.getTVPlaying = function() {
                    return rightPlay
                }
                ;
                _self.videoOnClick = function() {
                    parentClass.dispatchEvent("videoOnClick", null)
                }
                ;
                _self.getNowPage = function() {
                    var tmpPage = "";
                    if (win._history.length != 0)
                        tmpPage = win._history[win._history.length - 1].page;
                    return tmpPage
                }
                ;
                function get(_id) {
                    return dom.getElementById("R_" + _id)
                }
                _self.goToResult = function() {
                    var par = "";
                    par += "uid=" + top["userData"].uid;
                    par += "&langx=" + top.langx;
                    par += "&mem_status=" + top["userData"].enable;
                    par += "&protocol=" + dom.location.protocol.replace(":", "");
                    var goUrl = "";
                    goUrl = dom.location.protocol + "//" + top.oldSite + "/app/member/account/index.php?" + par;
                    var WHtype = "width=900,height=650,status=no,location=no";
                    try {
                        top.newWinObj_result = window.open(goUrl, "account", WHtype)
                    } catch (e) {
                        console.log(e)
                    }
                    top.newWinObj_result.focus();
                    parentClass.dispatchEvent("closePCResult")
                }
                ;
                _self.showAlertMsg = function(param) {
                    parentClass.dispatchEvent("showAlertMsg", param)
                }
                ;
                _self.new_eval = function(str) {
                    var fn = Function;
                    return (new fn("return " + str))()
                }
                ;
                _self.onMessageEvent = function(code) {
                    var cmds = code.split("|");
                    var paramObj = new Object;
                    switch (cmds[0]) {
                    case "002":
                        mt.closeLoading(cmds[1], cmds[2], cmds[3]);
                        break;
                    case "006":
                        if (cmds[1] == "init_perform")
                            top.load_perform = true;
                        if (cmds[1] == "init_betgenius")
                            top.load_betgenius = true;
                        if (tv.getPlaying())
                            tv.defaultPlayProc();
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
                    case "555":
                        mt.showNoData(cmds[1], cmds[2]);
                        break
                    }
                }
                ;
                _self.resetRate = function() {
                    if (scoreFrame)
                        scoreFrame.resetRate()
                }
            }
            ;