function league_index(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var classname = "league_index";
                var parentClass;
                var childClass;
                var eventHandler = new Object;
                var load_count = 2;
                var load_now_count = 0;
                var gtype = "";
                var showtype = "";
                var timerHash = null;
                var sportFrame = null;
                var leagueFrame = null;
                var LS;
                var util = new win.Util(win,dom);
                var LEGTAB_ary = new Array("game","fs");
                var lastClickTS = postHash["nowTS"];
                var myhash = {};
                var isDraging = false;
                var es_tabHash = new Array("main","lol","dota","cs","kog","val","wr","ml","star2","pubg","aov","ove","rs","rl","star","war","cro","cod","ff","aoe","aoe2","pu","al","others");
                var tmp_choice_lid = "";
                _self.init = function(_childClass, _classname) {
                    childClass = _childClass;
                    classname = _classname ? _classname : classname;
                    top.isLeagued = true;
                    top["choice_lid"] = "";
                    var max = win._history.length;
                    if (max >= 2 && top.BackTag == "Y") {
                        try {
                            top.choice_gtype = win._history[max - 1].state.postHash.gtype
                        } catch (e) {}
                        top.BackTag = "N"
                    }
                    load_now_count = 0;
                    gtype = top.choice_gtype;
                    showtype = top.choice_showtype;
                    _self.addEventListener("showLoading", _self.showLoading);
                    _self.addEventListener("showLeagueVisible", _self.showLeagueVisible);
                    _self.addEventListener("backPage", _self.backPage);
                    _self.addEventListener("startTimer", _self.startTimer);
                    _self.addEventListener("clearTimer", _self.clearTimer);
                    _self.addEventListener("internetError", _self.internetError);
                    _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
                    _self.addEventListener("showAlertMsg", _self.showAlertMsg);
                    _self.addEventListener("showDateOption", _self.showDateOption);
                    _self.addEventListener("showDate", _self.showDate);
                    _self.addEventListener("retryLoop", _self.retryLoop);
                    _self.addEventListener("retryLastfail", _self.retryLastfail);
                    _self.addEventListener("retryComplete", _self.retryComplete);
                    _self.addEventListener("setTitle", _self.setTitle);
                    _self.addEventListener("checkSpecialGameCount", _self.checkSpecialGameCount);
                    _self.addEventListener("showDateLoading", _self.showDateLoading);
                    _self.addEventListener("chgTabLoading", _self.chgTabLoading);
                    _self.addEventListener("loadFsTab", _self.loadLeague);
                    _self.addEventListener("showLeagueNoData", _self.showLeagueNoData);
                    _self.addEventListener("getPageCount", _self.getPageCount);
                    _self.addEventListener("classifierDate", _self.classifierDate);
                    _self.loadSport()
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
                _self.getParentThis = function(varible) {
                    return parentClass.getThis(varible)
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
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    timerHash = parentClass.getThis("timerHash");
                    LS = parentClass.getThis("LS");
                    headerFrame = parentClass.getThis("headerFrame");
                    LS_code = parentClass.getThis("LS_code");
                    myhash["timerHash"] = timerHash;
                    myhash["LS"] = LS;
                    myhash["headerFrame"] = headerFrame;
                    myhash["LS_code"] = LS_code
                }
                ;
                _self.backPage = function(param) {
                    top.BackTag = "Y";
                    parentClass.dispatchEvent("backPage", param)
                }
                ;
                _self.loadSport = function() {
                    var param = new Object;
                    var isback = _self.chkIsBack();
                    var ts = lastClickTS && !isback ? lastClickTS : top["lastClickTS"];
                    param["page"] = "sport_menu";
                    param["target"] = "sport_content";
                    param["retFun"] = _self.loadComplete;
                    param["postHash"] = {
                        "type": "league",
                        "gtype": postHash["gtype"],
                        "showtype": postHash["showtype"],
                        "rtype": top.choice_rtype,
                        "ts": ts
                    };
                    param["useDefineParent"] = "Y";
                    param["parentClass"] = _self;
                    param["retChild"] = _self.retChildSport;
                    param["post"] = "gtype=" + postHash["gtype"] + "&showtype=" + postHash["showtype"] + "&rtype=" + top.choice_rtype;
                    param["nowTS"] = ts;
                    parentClass.dispatchEvent("goToPage", param)
                }
                ;
                _self.chkIsBack = function() {
                    var obj = win._history[win._history.length - 1];
                    if (!obj.state.back)
                        return false;
                    else
                        return true
                }
                ;
                _self.loadLeague = function(par) {
                    var hisObj = win._history[win._history.length - 1];
                    _self.showLeagueLoading(true);
                    var tmp_gtype = "";
                    var rtype = "r";
                    if (!top.isLeagued && hisObj.state.back != "Y")
                        return;
                    var isFS = top.outrightsClick == "outrights" || hisObj.state.back == "Y" && hisObj.state.postHash.rtype == "fs";
                    if (isFS)
                        gtype = "fs";
                    if (par && par.mode == "autoGoToFS")
                        gtype = "fs";
                    if (top.choice_rtype == "fs")
                        gtype = "fs";
                    if (gtype == "fs") {
                        tmp_gtype = "FS";
                        rtype = "fs"
                    } else {
                        tmp_gtype = "All";
                        if (gtype == "ft" && showtype == "parlay")
                            rtype = "rb"
                    }
                    dom.getElementById("main_content").style.display = "none";
                    var param = new Object;
                    param["page"] = "league_list_" + tmp_gtype;
                    param["target"] = "main_content";
                    param["retFun"] = _self.loadComplete;
                    param["useDefineParent"] = "Y";
                    param["parentClass"] = _self;
                    param["retChild"] = _self.retChildLeague;
                    param["post"] = "gtype=" + postHash["gtype"] + "&showtype=" + postHash["showtype"] + "&rtype=" + rtype;
                    param["nowTS"] = lastClickTS;
                    postHash["nowTS"] = lastClickTS;
                    if (par == "clickTab")
                        postHash["clickTab"] = "Y";
                    if (tmp_gtype == "All") {
                        var isback = hisObj.state.isClickTab == "Y" && hisObj.state.back == "Y";
                        var isClickTab = par == "clickTab" || isback ? "Y" : "N";
                        param["post"] += "&isClickTab=" + isClickTab
                    }
                    param["postHash"] = postHash;
                    param["noCache"] = "Y";
                    parentClass.dispatchEvent("goToPage", param)
                }
                ;
                _self.loadComplete = function() {
                    load_now_count++;
                    var isback = _self.chkIsBack();
                    if (!isback && lastClickTS != 0 && !util.checkTS(top.lastClickTS, lastClickTS, "league_index")) {
                        console.log("[league_index][\u4e0d\u7e7c\u7e8c\u57f7\u884c][nowTS]=>", top.lastClickTS, "[tmpTS]=>", lastClickTS);
                        return
                    }
                    if (load_now_count == 1)
                        _self.loadLeague();
                    if (load_now_count >= load_count) {
                        dom.getElementById("main_content").style.display = "";
                        if (top.outrightsClick != "outrights") {
                            _self.initTab();
                            var fs_tab = dom.getElementById("league_tab_fs");
                            var game_tab = dom.getElementById("league_tab_game");
                            if (top.choice_rtype == "fs") {
                                if (fs_tab)
                                    util.addClass(fs_tab, "on");
                                if (game_tab)
                                    util.removeClass(game_tab, "on")
                            } else if (top.choice_rtype == "r" || top.choice_rtype == "rb") {
                                if (fs_tab)
                                    util.removeClass(fs_tab, "on");
                                if (game_tab)
                                    util.addClass(game_tab, "on")
                            }
                            parentClass.dispatchEvent("setRightLoading", false);
                            util.dragScroll(dom, "tab_scroll", _self.addTabClick, _self.removeTabClick, {
                                "tagName": "tab"
                            })
                        }
                    }
                }
                ;
                _self.showLoading = function() {
                    parentClass.dispatchEvent("showLoading", {
                        "isShow": false
                    })
                }
                ;
                _self.checkSpecialGameCount = function() {
                    sportFrame.getSpecCount("get_league_list")
                }
                ;
                _self.setTitle = function(par) {
                    var title = "";
                    if (par.title)
                        title = par.title;
                    sportFrame.setTitle(par.mode, {
                        "title": title
                    })
                }
                ;
                _self.initTab = function() {
                    var league_tab_game = dom.getElementById("league_tab_game");
                    var league_tab_fs = dom.getElementById("league_tab_fs");
                    if (league_tab_fs)
                        league_tab_fs.style.display = top.choice_showtype == "parlay" || top.choice_gtype == "es" ? "none" : "";
                    var league_tab_fantasy = dom.getElementById("league_tab_fantasy");
                    if (top.choice_showtype.match(/today|early/) && league_tab_fantasy && top.choice_gtype == "ft") {
                        console.log("\u6709\u5922\u5e7b\u8cfd\u4e8b\uff0c\u986f\u793a\u5922\u5e7b\u8cfd\u4e8bTab");
                        var chgModelTs = util.getTimestamp();
                        league_tab_fantasy.style.display = "";
                        util.addEvent(league_tab_fantasy, "click", _self.goToGameList, {
                            "rtype": "r",
                            "isFantasy": "Y",
                            "ts": chgModelTs,
                            "isLeaguePage": "Y"
                        })
                    } else
                        league_tab_fantasy.style.display = "none";
                    util.addEvent(league_tab_game, "click", _self.chgTab_league, {
                        "target": "game",
                        "rtype": "r"
                    });
                    util.addEvent(league_tab_fs, "click", _self.chgTab_league, {
                        "target": "fs",
                        "rtype": "fs"
                    })
                }
                ;
                _self.addTabClick = function() {
                    isDraging = false
                }
                ;
                _self.chgTab_league = function(e, par) {
                    if (isDraging) {
                        console.log("\u62d6\u66f3\u4e2d\u4e0d\u57f7\u884c!!!!");
                        return
                    }
                    if (lastClickTS != 0 && !util.checkTS(lastClickTS, top["lastClickTS"], "chgTab_league")) {
                        console.log("[chgTab_league][\u6846\u67b6\u9084\u662f\u820a\u7684][\u5c07hash\u7684\u503c \u6307\u904e\u53bb]=>[\u65b0]", top.lastClickTS, "[\u820a]=>", lastClickTS);
                        lastClickTS = top["lastClickTS"];
                        postHash["gtype"] = top["choice_gtype"];
                        postHash["rtype"] = top["choice_rtype"]
                    }
                    var transRtype = "";
                    for (var i = 0; i < LEGTAB_ary.length; i++) {
                        var obj = dom.getElementById("league_tab_" + LEGTAB_ary[i]);
                        if (obj.classList.contains("on"))
                            obj.classList.remove("on")
                    }
                    dom.getElementById("league_tab_" + par.target).classList.add("on");
                    if (top.choice_gtype == "ft" && top.choice_showtype == "parlay")
                        transRtype = "rb";
                    else
                        transRtype = par.rtype;
                    top.choice_rtype = transRtype;
                    gtype = par.target == "fs" ? par.target : top.choice_gtype;
                    dom.getElementById("sel_date").style.display = par.target == "fs" || top.choice_showtype == "today" ? "none" : "";
                    _self.loadLeague("clickTab");
                    if (par.target == "game") {
                        sportFrame.setDateIconInit();
                        top.choice_filter = top.choice_showtype == "early" ? "FU" : "FT";
                        if (top.choice_showtype == "today")
                            parentClass.dispatchEvent("showTimeGMT", true)
                    } else if (par.target == "fs") {
                        top.choice_filter = "FS";
                        if (top.choice_showtype == "today")
                            parentClass.dispatchEvent("showTimeGMT", false)
                    }
                    var historyHash = "";
                    historyHash = JSON.parse(JSON.stringify(win._history[win._history.length - 1]));
                    var stateHash = historyHash.state.post.split("&");
                    stateHash[2] = "rtype=" + transRtype;
                    historyHash.state.post = stateHash.join("&");
                    historyHash.state.postHash.rtype = transRtype;
                    historyHash.state.isClickTab = "Y";
                    delete historyHash.state.back;
                    dom.getElementById("select_lea").style.display = "none";
                    dom.getElementById("message_pop_nobtn").classList.remove("high_set");
                    if (top["CookieManager2"].get("all_choice_league"))
                        top["CookieManager2"].del("all_choice_league");
                    win._history.push(historyHash);
                    parentClass.dispatchEvent("initBackCount", {})
                }
                ;
                _self.retChildSport = function(childObj) {
                    sportFrame = childObj
                }
                ;
                _self.retChildLeague = function(childObj) {
                    leagueFrame = childObj
                }
                ;
                _self.showLeagueVisible = function(param) {
                    _self.showLeagueLoading(param.isShow)
                }
                ;
                _self.showLeagueLoading = function(isShow) {
                    if (dom.getElementById("league_loading"))
                        dom.getElementById("league_loading").style.display = isShow ? "" : "none"
                }
                ;
                _self.showDateLoading = function(param) {
                    dom.getElementById("date_loading").style.display = param.isShow ? "" : "none";
                    if (param.isShow)
                        util.addClass(dom.getElementById("date_loading"), "loading_on");
                    else
                        setTimeout(function() {
                            util.removeClass(dom.getElementById("date_loading"), "loading_on")
                        }, 300)
                }
                ;
                _self.chgTabLoading = function(param) {
                    dom.getElementById("chgTab_loading").style.display = param.isShow ? "" : "none";
                    if (param.isShow)
                        util.addClass(dom.getElementById("chgTab_loading"), "loading_on");
                    else
                        util.removeClass(dom.getElementById("chgTab_loading"), "loading_on")
                }
                ;
                _self.startTimer = function() {
                    if (sportFrame)
                        sportFrame.startTimer();
                    if (leagueFrame)
                        leagueFrame.startTimer()
                }
                ;
                _self.clearTimer = function() {
                    if (sportFrame)
                        sportFrame.clearTimer();
                    if (leagueFrame)
                        leagueFrame.clearTimer()
                }
                ;
                _self.internetError = function(param) {
                    parentClass.dispatchEvent("internetError", param)
                }
                ;
                _self.bodyGoToPage = function(param) {
                    parentClass.dispatchEvent("bodyGoToPage", param)
                }
                ;
                _self.showAlertMsg = function(param) {
                    parentClass.dispatchEvent("showAlertMsg", param)
                }
                ;
                _self.retryLoop = function(param) {
                    parentClass.dispatchEvent("retryLoop", param)
                }
                ;
                _self.retryLastfail = function() {
                    parentClass.dispatchEvent("retryLastfail")
                }
                ;
                _self.retryComplete = function() {
                    parentClass.dispatchEvent("retryComplete")
                }
                ;
                _self.showDateOption = function(_par) {
                    var dateIcon = dom.getElementById("sel_date");
                    if (dateIcon != null)
                        dateIcon.style.display = _par.isShow ? "" : "none";
                    _self.showDate(_par)
                }
                ;
                _self.showDate = function(_par) {
                    try {
                        leagueFrame.showDate(_par.isShow)
                    } catch (e) {}
                }
                ;
                _self.getDateIconStatus = function() {
                    try {
                        return sportFrame.getDateIconStatus()
                    } catch (e) {
                        return false
                    }
                }
                ;
                _self.getLastPageParam = function(postHash) {
                    return parentClass.getLastPageParam(postHash)
                }
                ;
                _self.exitEvent = function() {
                    dom.getElementById("select_lea").style.display = "none";
                    dom.getElementById("message_pop_nobtn").classList.remove("high_set");
                    return true
                }
                ;
                _self.removeTabClick = function() {
                    isDraging = true
                }
                ;
                _self.goToGameList = function(e, par) {
                    var rtype = par.rtype;
                    var isFantasy = par.isFantasy;
                    var ts = par.ts;
                    var isLeagued = par.isLeaguePage;
                    var param = new Object;
                    var choiceGtype = top.choice_gtype.toUpperCase();
                    var postHash = new Object;
                    postHash["gtype"] = top.choice_gtype;
                    postHash["showtype"] = top.choice_showtype;
                    postHash["rtype"] = rtype;
                    postHash["isFantasy"] = isFantasy;
                    postHash["ts"] = ts;
                    postHash["isLeagued"] = isLeagued;
                    top.lastClickTS = ts;
                    top.choice_filter = "FANTASY";
                    top.choice_rtype = rtype;
                    top.specialGame.isFantasy = true;
                    param["page"] = "game_list_" + choiceGtype;
                    param["extendsClass"] = "game_list";
                    param["post"] = "gtype=" + top.choice_gtype + "&showtype=" + top.choice_showtype + "&rtype=" + rtype + "&ts=" + ts;
                    param["postHash"] = postHash;
                    parentClass.dispatchEvent("bodyGoToPage", param)
                }
                ;
                _self.showLeagueNoData = function(_par) {
                    try {
                        if (leagueFrame)
                            leagueFrame.showLeagueNoData()
                    } catch (e) {}
                }
                ;
                _self.getPageCount = function(classifierDateHash) {
                    var par = "p=get_page_count";
                    var team_id = "";
                    var tmp_date = "";
                    par += "&" + top.param;
                    par += "&gtype=" + top.choice_gtype;
                    par += "&showtype=" + top.choice_showtype;
                    var filter = top.choice_showtype == "today" ? "MIX" : top.choice_filter;
                    par += "&filter=" + filter;
                    par += "&ltype=" + top["userData"].ltype;
                    par += "&team_id=" + team_id;
                    par += "&specialClick=" + top.specialClick;
                    par += "&p3type=" + (top.p3type || "");
                    par += "&sorttype=" + top.choice_sorttype;
                    par += "&date=" + tmp_date;
                    par += "&from=league_list_All";
                    tmp_choice_lid = classifierDateHash ? classifierDateHash[top.choice_date] : "";
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.getPageCountComplete);
                    getHTML.loadURL(top.m2_url, "POST", par)
                }
                ;
                _self.getPageCountComplete = function(xml) {
                    var pageCountHash = new Object;
                    var tabHash = es_tabHash;
                    pageCntHash = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(pageCntHash))
                        return;
                    xmlnode = util.parseXml(xml);
                    var xmdObj = new Object;
                    var dataStatus = xmlnode.Node(xmlnode.Root[0], "dataStatus").innerHTML;
                    if (dataStatus == "N") {
                        console.log("Server\u6c92\u50b3\u4efb\u4f55\u8cc7\u6599\u56de\u4f86!!!!");
                        return
                    }
                    if (top.choice_showtype)
                        xmdObj = xmlnode.Node(xmlnode.Root[0], "pgcount", false);
                    for (var key = 0; key < xmdObj.length; key++) {
                        var lid = xmdObj[key].getAttribute("id");
                        if (top.specialClick == "" && tmp_choice_lid != "") {
                            var tmp_lid = "," + tmp_choice_lid + ",";
                            if (tmp_lid.indexOf("," + lid + ",") == -1)
                                continue
                        }
                        for (var i = 0; i < tabHash.length; i++) {
                            var tmp_count = xmlnode.Node(xmdObj[key], tabHash[i].toUpperCase()).innerHTML;
                            if (tmp_count == undefined)
                                continue;
                            if (pageCountHash[tabHash[i]])
                                pageCountHash[tabHash[i]] += parseInt(tmp_count);
                            else
                                pageCountHash[tabHash[i]] = parseInt(tmp_count)
                        }
                    }
                    if (dataStatus == "Y" || dataStatus == "noData")
                        _self.showPageProc(pageCountHash)
                }
                ;
                _self.showPageProc = function(pageCnt) {
                    if (postHash["back"] != "Y" && postHash["nowClickTabTs"] && postHash["nowClickTabTs"] != "")
                        if (postHash["nowClickTabTs"] != top["specialGame"]["clickTabTs"]) {
                            console.log("showPageProc TS\u4e0d\u540c\uff0c\u963b\u64cb!!!! [ts] = ", postHash["nowClickTabTs"], "top\u503cts = ", top["specialGame"]["clickTabTs"]);
                            return
                        }
                    pageCountHash = pageCnt;
                    var ES_MenuCount = 0;
                    for (var t = 0; t < es_tabHash.length; t++) {
                        var tmpTab = dom.getElementById("leg_ES_tab_" + es_tabHash[t]);
                        if (tmpTab)
                            if (pageCountHash[es_tabHash[t]] == 0 || isNaN(pageCountHash[es_tabHash[t]]))
                                tmpTab.style.display = "none";
                            else {
                                ES_MenuCount++;
                                tmpTab.style.display = ""
                            }
                    }
                    if (top.choice_gtype == "es") {
                        leagueFrame.setTabEvent();
                        leagueFrame.showLeagueData();
                        if (ES_MenuCount <= 2) {
                            leagueFrame.setMainCount(0);
                            leagueFrame.showESTab(false);
                            _self.showLoading();
                            _self.showDateLoading(false);
                            _self.showLeagueLoading(false);
                            return
                        } else {
                            leagueFrame.setMainCount(ES_MenuCount);
                            leagueFrame.showESTab(true);
                            leagueFrame.filterScroll("leg_ES_tab")
                        }
                    }
                    _self.showLoading();
                    _self.showDateLoading(false);
                    _self.showLeagueLoading(false);
                    setTimeout(leagueFrame.filterScroll, 1E3, "leg_ES_tab")
                }
            }
            ;