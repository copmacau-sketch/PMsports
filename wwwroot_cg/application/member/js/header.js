 function header(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var eventHandler = new Object;
                var util = new win.Util(win,dom);
                var _mc = new Object;
                var header = new Array("home_page","special_page","live_page","soon_page","today_page","early_page","outrights_page","parlay_page","header_tv","header_myGame","header_todaywagers","hot_page");
                var gtype_ary;
                var notNeedLegAry = new Array("live","today","mygame","hot","soon");
                var filterTab = new Array("FT","RB","MIX","Next1","Next6");
                var other_page = new Array("home","list_tv","today_wagers","history_data","history_view","credit_logs","features","rules_general");
                var langx_ary = new Array("zh-cn","zh-tw","en-us");
                var odds_ary = new Array("H","M","I","E");
                var defGtype = "FT";
                var savechk = "";
                var count = 0;
                var Ary = new Array;
                var config_set;
                var LS;
                var page_sw = false;
                var firstLoad = false;
                var cashcheck = false;
                var basetime = "";
                var datetime = "";
                var timeAry = [];
                var stimer = 0;
                var addAnimation = null;
                var nowTS = null;
                var mygame_bottom = false;
                var countXml = new Object;
                var headToSport = "N";
                var type_count = 0;
                _self.paramHash = new Object;
                var classname = "header";
                var myhash = {};
                var noRunCash = false;
                var nowFilter = "";
                var lastPage = null;
                var isIOS = util.isIOS();
                if (!top.systemtime)
                    top.systemtime = "";
                var myGameTotalCount = 0;
                var lastTotalBet = 0;
                var oldCredit = "";
                _self.init = function() {
                    top.showCredit = true;
                    page_sw = config_set.get("PAGE_SW");
                    _self.addEventListener("showAlertMsg", _self.showAlertMsg);
                    _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
                    _self.addEventListener("retryLoop", _self.retryLoop);
                    _self.addEventListener("retryLastfail", _self.retryLastfail);
                    _self.addEventListener("retryComplete", _self.retryComplete);
                    _self.addEventListener("doGoToMyGame", _self.doGoToMyGame);
                    gtype_ary = config_set.get("GTYPEARY");
                    _mc["home_page"] = dom.getElementById("home_page");
                    _mc["home_page"].url = "home";
                    _mc["home_page"].type = "home";
                    _mc["special_page"] = dom.getElementById("special_page");
                    _mc["special_page"].type = "today";
                    _mc["special_page"].url = "league_index";
                    _mc["special_page"].showtype = "today";
                    _mc["special_page"].specialClick = "special";
                    _mc["live_page"] = dom.getElementById("live_page");
                    _mc["live_page"].type = "live";
                    if (page_sw)
                        _mc["live_page"].url = "league_index";
                    _mc["live_page"].showtype = "live";
                    _mc["soon_page"] = dom.getElementById("soon_page");
                    _mc["soon_page"].type = "soon";
                    _mc["soon_page"].showtype = "soon";
                    _mc["hot_page"] = dom.getElementById("hot_page");
                    _mc["hot_page"].type = "hot";
                    _mc["hot_page"].showtype = "hot";
                    _mc["today_page"] = dom.getElementById("today_page");
                    _mc["today_page"].type = "today";
                    _mc["today_page"].showtype = "today";
                    _mc["early_page"] = dom.getElementById("early_page");
                    _mc["early_page"].type = "early";
                    _mc["early_page"].url = "league_index";
                    _mc["early_page"].showtype = "early";
                    _mc["outrights_page"] = dom.getElementById("outrights_page");
                    _mc["outrights_page"].type = "outrights";
                    _mc["outrights_page"].url = "league_index";
                    _mc["outrights_page"].showtype = "outrights";
                    _mc["outrights_page"].outrightsClick = "outrights";
                    _mc["parlay_page"] = dom.getElementById("parlay_page");
                    _mc["parlay_page"].type = "parlay";
                    _mc["parlay_page"].url = "league_index";
                    _mc["parlay_page"].showtype = "parlay";
                    _mc["myAcc_page"] = dom.getElementById("myAcc_page");
                    _mc["wager_count"] = dom.getElementById("pc_wager_count");
                    _mc["header_tv"] = dom.getElementById("header_tv");
                    _mc["header_tv"].url = "list_tv";
                    _mc["header_tv"].type = "list_tv";
                    _mc["header_myGame"] = dom.getElementById("header_myGame");
                    _mc["header_myGame"].url = "mygame";
                    _mc["header_myGame"].showtype = "mygame";
                    _mc["header_myGame"].type = "mygame";
                    _mc["header_myGame_dot"] = dom.getElementById("header_myGame_dot");
                    _mc["header_historydata"] = dom.getElementById("header_historydata");
                    _mc["header_historydata"].url = "history_data";
                    _mc["header_historydata"].type = "history_data";
                    _mc["header_todaywagers"] = dom.getElementById("header_todaywagers");
                    _mc["header_todaywagers"].url = "today_wagers";
                    _mc["header_todaywagers"].type = "today_wagers";
                    _mc["header_credit"] = dom.getElementById("header_credit");
					_mc["menu_acc_credit"] = dom.getElementById("menu_acc_credit");
					
                    _mc["header_currency"] = dom.getElementById("header_currency");
                    _mc["header_myGame_num"] = dom.getElementById("header_myGame_num");
                    _mc["header_money"] = dom.getElementById("header_money");
                    util.setParentclass(parentClass);
                    var headerDragObj = {
                        "tagName": "header",
                        "total": dom.getElementById("showtype_total"),
                        "scroll": dom.getElementById("showtype_scroll")
                    };
                    util.dragScroll(dom, "showtype_scroll", _self.initHeaderBtn, _self.removeHeaderClick, headerDragObj);
                    if (top.specialGame.SW) {
                        _self.createSpecialChkTimer();
                        _self.getSpecCount()
                    }
                    _self.createWCTimer();
                    _self.getTodayWagersCount();
					
					setInterval(function (){
						_self.getTodayWagersCount();
						//_self.chgcredit();
					}, 3000);
					
					setInterval(function (){
						var urlParams = "";
						urlParams = "p=get_member_data&" + top.param + "&change=" + key;
						var getHTML = new HttpRequest;
						getHTML.addEventListener("onError", _self.onError);
						getHTML.addEventListener("LoadComplete", _self.updateMemData);
						getHTML.loadURL(top.m2_url, "POST", urlParams);
					}, 5000);
					
					
                    _self.initHeaderBtn();
                    _self.chgHeadCss("home");
                    if (top.impchk == "Y" || top.perchk == "Y")
                        _self.messg(top.impchk, top.perchk);
                    win.addEventListener("resize", _self.showtypeScroll)
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    config_set = parentClass.getThis("config_set");
                    timerHash = parentClass.getThis("timerHash");
                    LS = parentClass.getThis("LS");
                    LS_code = parentClass.getThis("LS_code")
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
                _self.showAlertMsg = function(param) {
                    parentClass.dispatchEvent("showAlertMsg", param)
                }
                ;
                _self.bodyGoToPage = function(param) {
                    parentClass.dispatchEvent("bodyGoToPage", param)
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
                _self.setDefRtype = function(gtype, showtype) {
                    var hash = new Object;
                    hash[showtype] = "r";
                    hash["live"] = "rb";
                    hash["today"] = "r";
                    hash["early"] = hash["today"];
                    hash["hot"] = hash["today"];
                    hash["soon"] = hash["today"];
                    hash["parlay"] = gtype == "ft" ? hash["live"] : hash["today"];
                    return hash[showtype]
                }
                ;
                _self.createSpecialChkTimer = function() {
                    if (timerHash["specTimer"] != null)
                        return;
                    timerHash["specTimer"] = new Timer(config_set.get("CONFIG_SPECIAL_COUNT"));
                    timerHash["specTimer"].setParentclass(_self);
                    timerHash["specTimer"].init();
                    timerHash["specTimer"].dont_clear = true;
                    timerHash["specTimer"].addEventListener("TimerEvent.TIMER", _self.checkSpecial);
                    timerHash["specTimer"].startTimer()
                }
                ;
                _self.clearSpecTimer = function() {
                    if (timerHash != null)
                        if (timerHash["specTimer"] != null) {
                            timerHash["specTimer"].clearObj();
                            timerHash["specTimer"].is_clear = true;
                            timerHash["specTimer"] = null
                        }
                    return true
                }
                ;
                _self.checkSpecial = function() {
                    _self.getSpecCount()
                }
                ;
                _self.checkSpecialBack = function() {
                    var SPtitle = document.getElementById("special_page");
                    if (top.specialGame["Total_Count"] == 0 && SPtitle.style.display == "none" && top.specialClick == "special") {
                        top.clickBackPage = "specialBack";
                        parentClass.dispatchEvent("backPage", {
                            "retFun": null
                        })
                    }
                }
                ;
                _self.getSpecCount = function(par) {
                    var urlParams = "";
                    urlParams = "p=get_specialGame_count&" + top.param + "&mode=header_check";
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", function(xml) {
                        _self.getSpecCountComplete(xml, par)
                    });
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.getSpecCountComplete = function(xml, par) {
                    echo("======loadSpecialGameCountComplete======");
                    var xmdObj = new Object;
                    xmlnode = util.parseXml(xml);
                    xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code").innerHTML;
                    xmdObj["title"] = xmlnode.Node(xmlnode.Root[0], "title").innerHTML;
                    xmdObj["gtype"] = xmlnode.Node(xmlnode.Root[0], "gtype").innerHTML;
                    xmdObj["SPRB"] = xmlnode.Node(xmlnode.Root[0], "SPRB").innerHTML;
                    xmdObj["SPFU"] = xmlnode.Node(xmlnode.Root[0], "SPFU").innerHTML;
                    xmdObj["SPFT"] = xmlnode.Node(xmlnode.Root[0], "SPFT").innerHTML;
                    xmdObj["SPEM"] = xmlnode.Node(xmlnode.Root[0], "SPEM").innerHTML;
                    xmdObj["FS"] = xmlnode.Node(xmlnode.Root[0], "FS").innerHTML;
                    xmdObj["SPCUPFantasy"] = xmlnode.Node(xmlnode.Root[0], "SPCUPFantasy").innerHTML;
                    xmdObj["SPFantasy"] = xmlnode.Node(xmlnode.Root[0], "SPFantasy").innerHTML;
                    xmdObj["Fantasy_leg"] = xmlnode.Node(xmlnode.Root[0], "Fantasy_leg").innerHTML;
                    xmdObj["SPCUP_MAIN"] = xmlnode.Node(xmlnode.Root[0], "SPCUP_MAIN").innerHTML;
                    xmdObj["group_count"] = xmlnode.Node(xmlnode.Root[0], "group_count").innerHTML;
                    xmdObj["FS_cup_team"] = xmlnode.Node(xmlnode.Root[0], "FS_cup_team");
                    xmdObj["FT_cup_team"] = xmlnode.Node(xmlnode.Root[0], "FT_cup_team");
                    xmdObj["mode"] = xmlnode.Node(xmlnode.Root[0], "mode").innerHTML;
                    xmdObj["highlights_sw"] = xmlnode.Node(xmlnode.Root[0], "highlights_sw").innerHTML;
                    xmdObj["team_sw"] = xmlnode.Node(xmlnode.Root[0], "team_sw").innerHTML;
                    xmdObj["standings_sw"] = xmlnode.Node(xmlnode.Root[0], "standings_sw").innerHTML;
                    xmdObj["period"] = xmlnode.Node(xmlnode.Root[0], "period").innerHTML;
                    xmdObj["feed_sw"] = xmlnode.Node(xmlnode.Root[0], "feed_sw").innerHTML;
                    xmdObj["season_id"] = xmlnode.Node(xmlnode.Root[0], "season_id").innerHTML;
                    xmdObj["gameCountMode"] = xmlnode.Node(xmlnode.Root[0], "gameCountMode").innerHTML;
                    xmdObj["cup_featureEvent_sw"] = xmlnode.Node(xmlnode.Root[0], "cup_featureEvent_sw").innerHTML;
                    xmdObj["cup_standings_sw"] = xmlnode.Node(xmlnode.Root[0], "cup_standings_sw").innerHTML;
                    xmdObj["cup_winnerWidget_sw"] = xmlnode.Node(xmlnode.Root[0], "cup_winnerWidget_sw").innerHTML;
                    xmdObj["cup_secondaryBanner_sw"] = xmlnode.Node(xmlnode.Root[0], "cup_secondaryBanner_sw").innerHTML;
                    xmdObj["cup_tournamentOverview_sw"] = xmlnode.Node(xmlnode.Root[0], "cup_tournamentOverview_sw").innerHTML;
                    xmdObj["cup_postToFrontend_sw"] = xmlnode.Node(xmlnode.Root[0], "cup_postToFrontend_sw").innerHTML;
                    xmdObj["cup_tabSort"] = xmlnode.Node(xmlnode.Root[0], "cup_tabSort").innerHTML;
                    xmdObj["cup_MainLid"] = xmlnode.Node(xmlnode.Root[0], "cup_MainLid").innerHTML;
                    xmdObj["cup_hl_items"] = xmlnode.Node(xmlnode.Root[0], "cup_hl_items").innerHTML;
                    xmdObj["SPHLGame"] = xmlnode.Node(xmlnode.Root[0], "SPHLGame").innerHTML;
                    var notCup = xmdObj["gameCountMode"] == "CUP" && xmdObj["mode"] == "CUP" && xmdObj["SPCUP_MAIN"] == "0";
                    var notNormal = xmdObj["gameCountMode"] == "NORMAL" && xmdObj["mode"] == "NORMAL" && xmdObj["SPCUP_MAIN"] == "1";
                    if (top.specialClick == "special") {
                        if (xmdObj["gameCountMode"] != xmdObj["mode"] || notCup || notNormal) {
                            echo("[header]\u8cc7\u6599\u6709\u4e0d\u540c\u6b65==> notCup:" + notCup + "=== notNormal:" + notNormal);
                            xmdObj["title"] = top.specialTitle;
                            xmdObj["SPRB"] = top["specialGame"]["RB"];
                            xmdObj["SPFT"] = top["specialGame"]["FT"];
                            xmdObj["SPFU"] = top["specialGame"]["FU"];
                            xmdObj["SPEM"] = top["specialGame"]["EM"];
                            xmdObj["FS"] = top["specialGame"]["FS"];
                            if (top["specialGame"]["mode"] == "CUP")
                                xmdObj["SPCUPFantasy"] = top["specialGame"]["Fantasy"];
                            else
                                xmdObj["SPFantasy"] = top["specialGame"]["Fantasy"];
                            xmdObj["SPCUP_MAIN"] = top["specialGame"]["CUP_MAIN"];
                            xmdObj["group_count"] = top["specialGame"]["CUP_GROUP_count"];
                            xmdObj["mode"] = top["specialGame"]["mode"];
                            xmdObj["highlights_sw"] = top["specialGame"]["highlights_sw"];
                            xmdObj["team_sw"] = top["specialGame"]["team_sw"];
                            xmdObj["standings_sw"] = top["specialGame"]["standings_sw"];
                            xmdObj["period"] = top["specialGame"]["period"];
                            xmdObj["feed_sw"] = top["specialGame"]["feed_sw"];
                            xmdObj["season_id"] = top.betradar_season;
                            xmdObj["cup_featureEvent_sw"] = top["specialGame"]["cup_featureEvent_sw"];
                            xmdObj["cup_standings_sw"] = top["specialGame"]["cup_standings_sw"];
                            xmdObj["cup_winnerWidget_sw"] = top["specialGame"]["cup_winnerWidget_sw"];
                            xmdObj["cup_secondaryBanner_sw"] = top["specialGame"]["cup_secondaryBanner_sw"];
                            xmdObj["cup_tournamentOverview_sw"] = top["specialGame"]["cup_tournamentOverview_sw"];
                            xmdObj["cup_postToFrontend_sw"] = top["specialGame"]["cup_postToFrontend_sw"];
                            xmdObj["cup_tabSort"] = top["specialGame"]["cup_tabSort"];
                            xmdObj["cup_MainLid"] = top["specialGame"]["cup_MainLid"];
                            xmdObj["cup_hl_items"] = top["specialGame"]["cup_hl_items"];
                            xmdObj["SPHLGame"] = top["specialGame"]["SPHLGame"]
                        }
                        top.specialTitle = xmdObj["title"]
                    } else {
                        top.specialTitle = xmdObj["title"];
                        if (xmdObj["gameCountMode"] != xmdObj["mode"]) {
                            _self.showSpecialTitle({
                                "isShow": false
                            });
                            return
                        }
                    }
                    top.betradar_season = xmdObj["season_id"] ? xmdObj["season_id"] : "";
                    if (top.specialGame.mode != "" && top.specialGame.mode != xmdObj["mode"] && top.specialClick == "special") {
                        win._history.pop();
                        top.specialGame.mode = xmdObj["mode"];
                        var par = new Object;
                        par["page"] = "league_index";
                        par["showtype"] = "today";
                        par["type"] = "today";
                        par["specialClick"] = "special";
                        par["outrightsClick"] = "";
                        _self.goPage(null, par);
                        return
                    }
                    if (top.specialClick == "special" && xmdObj["gtype"] != "")
                        top.choice_gtype = xmdObj["gtype"].toLowerCase();
                    top["specialGame"]["gtype"] = xmdObj["gtype"];
                    top["specialGame"]["FantasyLID"] = xmdObj["Fantasy_leg"];
                    top["specialGame"]["RB"] = xmdObj["SPRB"];
                    top["specialGame"]["FT"] = xmdObj["SPFT"];
                    top["specialGame"]["FU"] = xmdObj["SPFU"];
                    top["specialGame"]["EM"] = xmdObj["SPEM"];
                    top["specialGame"]["FTFU"] = xmdObj["SPFU"] * 1 + xmdObj["SPFT"] * 1;
                    top["specialGame"]["FS"] = xmdObj["FS"];
                    if (xmdObj["mode"] == "CUP") {
                        top["specialGame"]["Fantasy"] = xmdObj["SPCUPFantasy"];
                        top["specialGame"]["Total_Count"] = xmdObj["SPRB"] * 1 + xmdObj["FS"] * 1 + top["specialGame"]["FTFU"] * 1 + xmdObj["SPEM"] * 1 + top["specialGame"]["Fantasy"] * 1
                    } else {
                        top["specialGame"]["Fantasy"] = xmdObj["SPFantasy"];
                        top["specialGame"]["Total_Count"] = xmdObj["SPRB"] * 1 + xmdObj["FS"] * 1 + top["specialGame"]["FTFU"] * 1 + xmdObj["SPEM"] * 1
                    }
                    top["specialGame"]["title"] = xmdObj["title"];
                    top["specialGame"]["CUP_MAIN"] = xmdObj["SPCUP_MAIN"];
                    top["specialGame"]["CUP_GROUP_count"] = xmdObj["group_count"];
                    top["specialGame"]["CUP_TEAM"] = new Object;
                    top["specialGame"]["CUP_TEAM_ARY"] = new Array;
                    var CUP_TEAM = new Object;
                    var all_team_fs = new Object;
                    if (xmdObj["code"] != "noFS") {
                        all_team_fs = xmlnode.Node(xmdObj["FS_cup_team"], "team", false);
                        var gameFSCount = all_team_fs.length > 0 ? all_team_fs.length : 0;
                        for (var z = 0; z < gameFSCount; z++) {
                            var tmp_team_fs = all_team_fs[z];
                            if (tmp_team_fs) {
                                var fs_team_id = tmp_team_fs.getAttribute("id");
                                var fs_count = tmp_team_fs.innerHTML;
                                CUP_TEAM["t" + fs_team_id] = fs_count * 1
                            }
                        }
                    }
                    var all_team_ft = new Object;
                    all_team_ft = xmlnode.Node(xmdObj["FT_cup_team"], "team", false);
                    var gameFTCount = all_team_ft.length > 0 ? all_team_ft.length : 0;
                    for (var y = 0; y < gameFTCount; y++) {
                        var tmp_team_ft = all_team_ft[y];
                        if (tmp_team_ft) {
                            var ft_team_id = tmp_team_ft.getAttribute("id");
                            var ft_count = tmp_team_ft.innerHTML;
                            if (CUP_TEAM["t" + ft_team_id])
                                CUP_TEAM["t" + ft_team_id] += ft_count * 1
                        }
                    }
                    for (var key in CUP_TEAM) {
                        top["specialGame"]["CUP_TEAM"][key] = CUP_TEAM[key];
                        allCnt = CUP_TEAM[key];
                        if (allCnt != 0)
                            top["specialGame"]["CUP_TEAM_ARY"].push(key)
                    }
                    top["specialGame"]["mode"] = xmdObj["mode"];
                    top["specialGame"]["highlights_sw"] = xmdObj["highlights_sw"];
                    top["specialGame"]["team_sw"] = xmdObj["team_sw"];
                    top["specialGame"]["standings_sw"] = xmdObj["standings_sw"];
                    top["specialGame"]["period"] = xmdObj["period"];
                    top["specialGame"]["feed_sw"] = xmdObj["feed_sw"];
                    top["specialGame"]["cup_featureEvent_sw"] = xmdObj["cup_featureEvent_sw"];
                    top["specialGame"]["cup_standings_sw"] = xmdObj["cup_standings_sw"];
                    top["specialGame"]["cup_winnerWidget_sw"] = xmdObj["cup_winnerWidget_sw"];
                    top["specialGame"]["cup_secondaryBanner_sw"] = xmdObj["cup_secondaryBanner_sw"];
                    top["specialGame"]["cup_tournamentOverview_sw"] = xmdObj["cup_tournamentOverview_sw"];
                    top["specialGame"]["cup_postToFrontend_sw"] = xmdObj["cup_postToFrontend_sw"];
                    top["specialGame"]["cup_tabSort"] = xmdObj["cup_tabSort"];
                    top["specialGame"]["cup_MainLid"] = xmdObj["cup_MainLid"];
                    top["specialGame"]["cup_hl_items"] = xmdObj["cup_hl_items"];
                    top["specialGame"]["SPHLGame"] = xmdObj["SPHLGame"];
                    var showCUP = (top["specialGame"]["Total_Count"] > 0 || top["specialGame"]["CUP_GROUP_count"] > 0 && (top.specialGame.standings_sw == "Y" || top.specialGame.cup_standings_sw == "Y" && top.specialGame.period == "IN")) && top["specialGame"]["cup_postToFrontend_sw"] && top["specialGame"]["cup_postToFrontend_sw"] == "Y" && top.specialGame.mode == "CUP";
                    var showNORMAL = top["specialGame"]["Total_Count"] > 0 && top.specialGame.mode == "NORMAL";
                    if (showCUP || showNORMAL) {
                        _self.showSpecialTitle({
                            "isShow": true,
                            "name": xmdObj["title"]
                        });
                        if (showNORMAL && xmdObj["gtype"] == "ES")
                            parentClass.dispatchEvent("addSPESEvent", xmdObj["title"]);
                        else
                            parentClass.dispatchEvent("removeSPESEvent")
                    } else
                        _self.showSpecialTitle({
                            "isShow": false
                        });
                    if (par) {
                        if (par.nowTS != top.lastClickTS)
                            return;
                        par.specialTitle = xmdObj["title"];
                        par.gtype = xmdObj["gtype"];
                        _self.checkSport(par)
                    }
                    _self.showtypeScroll()
                }
                ;
                _self.hideTitleProc = function() {
                    echo("\u6a21\u5f0f\u4e0d\u540c\uff0c\u6536\u6389header\uff0c\u5c0e\u56de\u9996\u9801");
                    _self.showSpecialTitle({
                        "isShow": false
                    });
                    var par = new Object;
                    par["page"] = "home";
                    par["type"] = "home";
                    par["specialClick"] = "";
                    par["outrightsClick"] = "";
                    _self.goPage(null, par)
                }
                ;
                _self.getLeaCount = function(par) {
                    var urlParams = "p=get_league_count";
                    urlParams += "&" + top.param;
                    urlParams += "&sorttype=league";
                    urlParams += "&date=ALL";
                    urlParams += "&mode=header";
                    urlParams += "&ts=" + par.nowTS;
                    urlParams += "&ltype=" + top["userData"].ltype;
                    if (par.showtype == "outrights")
                        urlParams += "&showtype=fs";
                    else
                        urlParams += "&showtype=" + top.choice_showtype;
                    hr = new win.HttpRequestRetry(win.HttpRequest,config_set.get("RETRY_TIME"),config_set.get("RETRY_LIMIT"),null);
                    hr.setParentclass(parentClass);
                    hr.addEventListener("onError", _self.onError);
                    hr.addEventListener("LoadComplete", function(xml) {
                        _self.getLeaCountComplete(xml, par)
                    });
                    hr.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.getLeaCountComplete = function(xml, par) {
                    countXml = xml;
                    var errorMsg = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    var xmdObj = new Object;
                    var countHash = new Object;
                    var filterHash = new Object;
                    xmlnode = util.parseXml(xml);
                    xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
                    xmdObj["game"] = xmlnode.Node(xmlnode.Root[0], "game");
                    var tmpTS = xmlnode.Node(xmlnode.Root[0], "ts").innerHTML;
                    if (!util.checkTS(top.lastClickTS, tmpTS, "get_league_count")) {
                        echo(par, "[get_league_count][\u4e0d\u7e7c\u7e8c\u57f7\u884c][nowTS]=>", top.lastClickTS, "[tmpTS]=>", tmpTS);
                        return
                    }
                    if (xmdObj["code"].innerHTML == "601") {
                        type_count = 0;
                        headToSport = "Y";
                        if (top.mobile == "Y" && !isIOS && top.choice_gtype == "ft" && top.choice_showtype == "today")
                            top.choice_filter = "MIX";
                        for (var i = 0; i < xmdObj["game"].length; i++) {
                            gtype = xmlnode.Node(xmdObj["game"][i], "gtype").innerHTML;
                            _gtype = gtype.toLowerCase();
                            if (util.in_array(gtype, gtype_ary)) {
                                var type = top.choice_showtype;
                                if (top.choice_showtype == "today" && top.choice_filter == "MIX")
                                    type = "mixft";
                                var _type = util.switchShowType(type, true);
                                var count = xmlnode.Node(xmdObj["game"][i], _type + "_count").innerHTML * 1;
                                var fs_count = 0;
                                if (type.match(/today/) && top.specialClick == "") {
                                    if (top.choice_gtype != "ft" && top.choice_gtype != "es")
                                        filterTab = new Array("MIX","FT","RB","Next1","Next6");
                                    for (var f = 0; f < filterTab.length; f++)
                                        if (xmlnode.Node(xmdObj["game"][i], filterTab[f]) && xmlnode.Node(xmdObj["game"][i], filterTab[f] + "_count").innerHTML * 1 > 0) {
                                            if (filterHash[gtype] == null)
                                                filterHash[gtype] = new Object;
                                            filterHash[gtype][filterTab[f]] = xmlnode.Node(xmdObj["game"][i], filterTab[f] + "_count").innerHTML * 1
                                        }
                                }
                                if (isNaN(count))
                                    count = 0;
                                if (top.outrightsClick == "outrights") {
                                    fs_ft_count = xmlnode.Node(xmdObj["game"][i], "FS_FT_count").innerHTML * 1;
                                    fs_fu_count = xmlnode.Node(xmdObj["game"][i], "FS_FU_count").innerHTML * 1;
                                    if (isNaN(fs_ft_count))
                                        fs_ft_count = 0;
                                    if (isNaN(fs_fu_count))
                                        fs_fu_count = 0;
                                    var total_count = fs_ft_count + fs_fu_count;
                                    if (total_count > 0)
                                        type_count += total_count;
                                    fs_count = fs_fu_count
                                } else {
                                    if (!_type.match("RB|P3|NEXT1|FT")) {
                                        fs_count = xmlnode.Node(xmdObj["game"][i], "FS_" + _type + "_count").innerHTML * 1;
                                        if (isNaN(fs_count))
                                            fs_count = 0
                                    }
                                    var total_count = count + fs_count;
                                    if (total_count > 0)
                                        type_count += total_count
                                }
                                if (gtype == top["bannerGtype"])
                                    if (type == "today")
                                        parentClass.dispatchEvent("chkBannerCount", count + fs_count);
                                    else {
                                        var ft_count = xmlnode.Node(xmdObj["game"][i], "FT_count").innerHTML * 1;
                                        if (isNaN(ft_count))
                                            ft_count = 0;
                                        var fs_ft_count = xmlnode.Node(xmdObj["game"][i], "FS_FT_count").innerHTML * 1;
                                        if (isNaN(fs_ft_count))
                                            fs_ft_count = 0;
                                        parentClass.dispatchEvent("chkBannerCount", ft_count + fs_ft_count)
                                    }
                                if (total_count > 0)
                                    countHash[_gtype] = total_count
                            }
                        }
                    }
                    _self.checkSport(par, countHash, filterHash)
                }
                ;
                _self.headerToSport = function() {
                    if (top.specialClick != "")
                        return "N";
                    if (headToSport != "N") {
                        if (headToSport == "Y") {
                            headToSport = "H";
                            return "Y"
                        }
                        return headToSport
                    } else
                        return headToSport
                }
                ;
                _self.noHeaderToSport = function() {
                    headToSport = "N"
                }
                ;
                _self.headerLegXmlData = function() {
                    return countXml
                }
                ;
                _self.typeCount = function() {
                    return type_count
                }
                ;
                _self.getMyGameData = function(par) {
                    var countHash = new Object;
                    for (var i = 0; i < gtype_ary.length; i++) {
                        var _gtype = gtype_ary[i].toLowerCase();
                        var ecidHash = top["myGameHash"][_gtype];
                        var myGameCnt = util.countSize(ecidHash);
                        if (myGameCnt == 0)
                            total_count = 0;
                        else {
                            var isNoData = true;
                            for (var ecid in ecidHash)
                                if (ecidHash[ecid]["ts"] == null || ecidHash[ecid]["ts"] == "") {
                                    isNoData = false;
                                    total_count = myGameCnt;
                                    break
                                }
                            if (isNoData)
                                total_count = 0
                        }
                        if (isNaN(myGameCnt))
                            total_count = 0;
                        if (total_count > 0)
                            countHash[_gtype] = total_count
                    }
                    _self.checkSport(par, countHash)
                }
                ;
                _self.checkSport = function(par, countHash, filterHash=Array()) {
                    top.specialGame.isFantasy = false;
                    top.specialGame.isHL = false;
                    top.specialGame.isTeam = false;
                    top.specialGame.isStandings = false;
                    top.specialGame.cup_page = "";
                    top.nowPDMode = top.choice_rtype.match(/pd/) ? "choice" : "all";
                    var org_gtype = top.choice_gtype;
                    var tmpGtype = org_gtype.toUpperCase();
                    if (par.specialClick == "special") {
                        top.specialClick = "special";
                        if (par.gtype != "")
                            top.choice_gtype = par.gtype.toLowerCase()
                    } else {
                        top.specialClick = "";
                        if (!countHash[org_gtype])
                            if (filterHash[tmpGtype]) {
                                if (nowFilter == "" || top.choice_filter == "")
                                    if (org_gtype != "ft" && org_gtype != "es")
                                        if (top.choice_showtype == "today")
                                            top.choice_filter = "MIX";
                                        else
                                            top.choice_filter = top.choice_showtype == "early" ? "FU" : "FT";
                                    else
                                        top.choice_filter = top.choice_showtype == "early" ? "FU" : "FT";
                                if (filterHash[tmpGtype][top.choice_filter])
                                    type_count = filterHash[tmpGtype][top.choice_filter] * 1;
                                nowFilter = top.choice_filter;
                                echo("[header][\u4eca\u65e5\u6c92\u6709", tmpGtype, "\uff0c\u4f46\u6709\u5176\u4ed6\u904e\u6ffe\u9801\u7c64][nowFilter] = ", nowFilter, ",[type_count] = ", type_count)
                            } else
                                for (var i = 0; i < gtype_ary.length; i++) {
                                    var _gtype = gtype_ary[i].toLowerCase();
                                    if (countHash[_gtype]) {
                                        top.choice_gtype = _gtype;
                                        top.hasChgGtype = true;
                                        top.choice_date = "all";
                                        echo("[header][checkSport]change gtype===>" + org_gtype + " to " + top.choice_gtype);
                                        break
                                    }
                                }
                        else {
                            top.hasChgGtype = false;
                            if (filterHash[tmpGtype]) {
                                if (nowFilter == "" || top.choice_filter == "")
                                    if (org_gtype != "ft" && org_gtype != "es")
                                        if (top.choice_showtype == "today")
                                            top.choice_filter = "MIX";
                                        else
                                            top.choice_filter = top.choice_showtype == "early" ? "FU" : "FT";
                                    else
                                        top.choice_filter = top.choice_showtype == "early" ? "FU" : "FT";
                                nowFilter = top.choice_filter;
                                if (filterHash[tmpGtype][top.choice_filter])
                                    type_count = filterHash[tmpGtype][top.choice_filter] * 1;
                                echo("[header][\u7403\u985e\u6c92\u8b8a][nowFilter] = ", nowFilter, ",[type_count] = ", type_count)
                            }
                        }
                    }
                    if (par.type == "live" && defGtype != top.choice_gtype)
                        parentClass.dispatchEvent("hideAlertMsg", {
                            "use": "noPopAllClear"
                        });
                    else
                        parentClass.dispatchEvent("hideAlertMsg", {
                            "use": "noPopMainClear"
                        });
                    defGtype = top.choice_gtype;
                    if (par.type != "outrights")
                        top.choice_rtype = _self.setDefRtype(top.choice_gtype, top.choice_showtype);
                    if (page_sw) {
                        top.isLeagued = true;
                        par["page"] = "league_index"
                    } else {
                        if (top.mobile == "Y" && !isIOS && defGtype == "ft")
                            notNeedLegAry = new Array("live","mygame","hot","soon");
                        else
                            notNeedLegAry = new Array("live","today","mygame","hot","soon");
                        if (notNeedLegAry.indexOf(par.type) != -1) {
                            par["page"] = "game_list_" + top.choice_gtype.toUpperCase();
                            top.isLeagued = false;
                            par["extendsClass"] = "game_list"
                        } else {
                            top.isLeagued = true;
                            par["page"] = "league_index"
                        }
                    }
                    var postHash = new Object;
                    postHash["gtype"] = top.choice_gtype;
                    if (top.specialClick == "special")
                        if (par.from != "pic") {
                            top.choice_showtype = "today";
                            top.choice_rtype = "r";
                            if (top.specialGame.highlights_sw == "Y" && top["specialGame"]["highlights_sw"] == "Y" && (top.specialGame.SPHLGame > 0 || top.specialGame.cup_standings_sw == "Y" && top["specialGame"]["period"] == "IN" && top.specialGame.CUP_GROUP_count > 0 || top.specialGame.FS > 0 && top.specialGame.cup_hl_items != "" || top["specialGame"]["CUP_TEAM_ARY"].length != 0 && top.specialGame.cup_winnerWidget_sw == "Y" && top.specialGame.SPHLGame == 0 && top.specialGame.cup_hl_items == "")) {
                                top.specialGame.isHL = true;
                                top.specialGame.cup_page = "HL";
                                postHash["kind"] = "highlights";
                                par["page"] = "game_list_SP";
                                par["extendsClass"] = "game_list_cup"
                            } else if (top.specialGame.RB > 0 || top.specialGame.FTFU > 0) {
                                postHash["kind"] = "game";
                                par["page"] = "game_list_" + top.choice_gtype.toUpperCase();
                                par["extendsClass"] = "game_list";
                                top.specialGame.cup_page = "game"
                            } else if (top.specialGame.team_sw == "Y" && top["specialGame"]["CUP_TEAM_ARY"].length > 0) {
                                top.specialGame.isTeam = true;
                                top.specialGame.cup_page = "teams";
                                postHash["kind"] = "teams";
                                par["page"] = "game_list_SP";
                                par["extendsClass"] = "game_list_cup"
                            } else if (top.specialGame.FS > 0) {
                                postHash["kind"] = "fs";
                                par["page"] = "game_list_" + top.choice_gtype.toUpperCase();
                                par["extendsClass"] = "game_list";
                                top.specialGame.cup_page = "fs";
                                top.choice_showtype = "early";
                                top.choice_rtype = "fs"
                            } else if (top.specialGame.standings_sw == "Y" && top.specialGame.CUP_GROUP_count > 0) {
                                top.specialGame.isStandings = true;
                                top.specialGame.cup_page = "standings";
                                postHash["kind"] = "standings";
                                par["page"] = "game_list_SP";
                                par["extendsClass"] = "game_list_cup"
                            } else {
                                postHash["kind"] = "game";
                                par["page"] = "game_list_" + top.choice_gtype.toUpperCase();
                                par["extendsClass"] = "game_list";
                                top.specialGame.cup_page = "game"
                            }
                            if (top.specialGame.mode != "CUP") {
                                top.specialGame.isHL = false;
                                top.specialGame.isTeam = false;
                                top.specialGame.isStandings = false;
                                top.specialGame.cup_page = "";
                                top.choice_showtype = "today";
                                top.choice_rtype = "r";
                                par["page"] = "game_list_" + top.choice_gtype.toUpperCase();
                                par["extendsClass"] = "game_list";
                                postHash["kind"] = "game";
                                if (top.specialGame.RB == "0" && top.specialGame.FTFU == "0") {
                                    top.choice_showtype = "early";
                                    top.choice_rtype = "fs";
                                    top.isLeagued = false;
                                    par["page"] = "game_list_" + top.choice_gtype.toUpperCase();
                                    par["extendsClass"] = "game_list";
                                    postHash["kind"] = "fs";
                                    if (top.specialGame.FS == "0" && top.choice_gtype == "ft") {
                                        top.choice_showtype = "today";
                                        top.choice_rtype = "r";
                                        top.specialGame.isFantasy = true;
                                        postHash["target"] = "fantasy";
                                        postHash["kind"] = "fantasy";
                                        par["target"] = "fantasy";
                                        par["page"] = "game_list_" + top.choice_gtype.toUpperCase();
                                        par["extendsClass"] = "game_list"
                                    }
                                }
                            }
                        } else {
                            _self.chgHeadCss(par.showtype, "special");
                            if (par.kind == "fs") {
                                top.choice_showtype = "early";
                                top.choice_rtype = "fs";
                                top.isLeagued = false;
                                par["page"] = "game_list_" + top.choice_gtype.toUpperCase();
                                par["extendsClass"] = "game_list";
                                postHash["kind"] = "fs"
                            } else {
                                top.choice_showtype = "today";
                                top.choice_rtype = "r";
                                if (top.specialGame.highlights_sw == "Y") {
                                    top.specialGame.isHL = true;
                                    top.specialGame.cup_page = "HL";
                                    postHash["kind"] = "highlights";
                                    par["page"] = "game_list_SP";
                                    par["extendsClass"] = "game_list_cup"
                                } else {
                                    postHash["kind"] = "game";
                                    par["page"] = "game_list_" + top.choice_gtype.toUpperCase();
                                    par["extendsClass"] = "game_list"
                                }
                            }
                        }
                    postHash["showtype"] = top.choice_showtype;
                    postHash["rtype"] = top.choice_rtype;
                    postHash["nowTS"] = par.nowTS;
                    par["post"] = "gtype=" + top.choice_gtype + "&showtype=" + top.choice_showtype + "&rtype=" + top.choice_rtype;
                    postHash["specialClick"] = par["specialClick"];
                    postHash["specialTitle"] = par["specialTitle"] ? par["specialTitle"] : "";
                    par["postHash"] = postHash;
                    par["type"] = top.outrightsClick == "outrights" ? "outrights" : top.choice_showtype;
                    par["rtype"] = top.choice_rtype;
                    par["showtype"] = top.outrightsClick == "outrights" ? "outrights" : top.choice_showtype;
                    par["mode"] = top.specialGame.mode;
                    parentClass.dispatchEvent("bodyGoToPage", par)
                }
                ;
                _self.goPage = function(e, par) {
                    top["showOBT"] = "";
                    if (lastPage != par.showtype) {
                        top.choice_sorttype = "L";
                        lastPage = par.showtype
                    }
                    top.specialGame.choice_teamID = "";
                    top.choice_filter = "";
                    parentClass.dispatchEvent("closeLeagueSetting");
                    if (!top.myGame_sw && par.showtype == "mygame" && !_mc["header_myGame"].classList.contains("off")) {
                        parentClass.dispatchEvent("showAlertMsg", {
                            "target": "message_pop_nobtn",
                            "msg": LS.get("myGame_close"),
                            "confirm": "N",
                            "retFun": ""
                        });
                        return
                    }
                    top.BackTag = "N";
                    parentClass.dispatchEvent("showLoading", {
                        "isShow": true
                    });
                    if (par.specialClick != "")
                        top.specialClick = par.specialClick;
                    else
                        top.specialClick = "";
                    if (par.outrightsClick != "")
                        top.outrightsClick = par.outrightsClick;
                    else
                        top.outrightsClick = "";
                    nowTS = util.getTimestamp();
                    par.nowTS = nowTS;
                    top["lastClickTS"] = nowTS;
                    var isOutrights = "";
                    if (par.showtype == "outrights") {
                        top.choice_showtype = "early";
                        top.choice_rtype = "fs";
                        isOutrights = "outrights"
                    } else
                        top.choice_showtype = par.showtype != null ? par.showtype : top.choice_showtype;
                    nowFilter = top.choice_showtype == "early" ? "FU" : "FT";
                    if (!util.in_array(par.type, other_page))
                        if (par.specialClick == "special") {
                            _self.chgHeadCss(par.showtype, "special");
                            par.isClick = true;
                            _self.getSpecCount(par)
                        } else {
                            _self.chgHeadCss(par.showtype, isOutrights);
                            if (par.showtype == "mygame" || mygame_bottom) {
                                parentClass.dispatchEvent("chgBottomCss", {
                                    "showtype": par.showtype
                                });
                                _self.getMyGameData(par);
                                mygame_bottom = false
                            } else
                                _self.getLeaCount(par)
                        }
                    else {
                        if (par.page == "home") {
                            parentClass.dispatchEvent("hideAlertMsg", {
                                "use": "noPopAllClear"
                            });
                            par.rightLoading = "slowlyClose";
                            if (top.rightECID != "")
                                parentClass.dispatchEvent("setRightLoading", {
                                    "isShow": true
                                })
                        } else
                            parentClass.dispatchEvent("hideAlertMsg", {
                                "use": "noPopMainClear"
                            });
                        parentClass.dispatchEvent("membercashchk");
                        parentClass.dispatchEvent("bodyGoToPage", par)
                    }
                }
                ;
                _self.getNowFilter = function() {
                    return nowFilter
                }
                ;
                _self.updateNowFilter = function(filter) {
                    nowFilter = filter
                }
                ;
                _self.updateTypeCount = function(count) {
                    type_count = count
                }
                ;
                _self.chgHeadCss = function(_id, type) {
                    var pageType = "";
                    pageType = type ? type : "";
                    if (top.specialClick != "" && pageType == "special")
                        _id = "special";
                    if (top.outrightsClick == "outrights" && pageType == "outrights")
                        _id = "outrights";
                    for (var i = 0; i < header.length; i++)
                        dom.getElementById(header[i]).classList.remove("on");
                    switch (_id) {
                    case "home":
                        _id = "home_page";
                        break;
                    case "special":
                        _id = "special_page";
                        break;
                    case "outrights":
                        _id = "outrights_page";
                        break;
                    case "live":
                        _id = "live_page";
                        break;
                    case "soon":
                        _id = "soon_page";
                        break;
                    case "hot":
                        _id = "hot_page";
                        break;
                    case "today":
                        _id = "today_page";
                        break;
                    case "early":
                        _id = "early_page";
                        break;
                    case "parlay":
                        _id = "parlay_page";
                        break;
                    case "list_tv":
                        _id = "header_tv";
                        break;
                    case "mygame":
                        _id = "header_myGame";
                        break;
                    case "today_wagers":
                    case "history_data":
                    case "history_view":
                    case "credit_logs":
                        _id = "header_todaywagers";
                        break;
                    default:
                        break
                    }
                    var obj = dom.getElementById(_id);
                    if (obj)
                        obj.classList.add("on")
                }
                ;
                _self.setRightPanel = function() {
                    _mc["myAcc_show"] = dom.getElementById("myAcc_show");
                    _mc["right_mask"] = dom.getElementById("right_mask");
                    _mc["myAcc_close"] = dom.getElementById("myAcc_close");
                    util.addEvent(_mc["myAcc_page"], "click", _self.showRightPanel);
                    util.addEvent(_mc["right_mask"], "click", _self.closeRightPanel);
                    util.addEvent(_mc["myAcc_close"], "click", _self.closeRightPanel)
                }
                ;
                _self.showRightPanel = function() {
                    document.body.style.overflow = "hidden";
                    if (top["userData"].enable == "S")
                        document.getElementById("odds_dropdown").disabled = true;
                    else
                        document.getElementById("odds_dropdown").disabled = false;
                    _mc["myAcc_show"].classList.add("on");
                    parentClass.dispatchEvent("addbodylock", {});
                    parentClass.dispatchEvent("setNowBodyLockStatus", true);
                    if (top.memSet.passcode != undefined && top.memSet.passcode != "[del]" && top.memSet.passcode != "[del1]")
                        dom.getElementById("4pwd_active").style.display = "";
                    else
                        dom.getElementById("4pwd_active").style.display = "none";
                    var timetype_ary = new Array("sysTime","devTime");
                    for (var i = 0; i < timetype_ary.length; i++)
                        dom.getElementById(timetype_ary[i]).style.display = "none";
                    dom.getElementById(top["userData"].timetype).style.display = "";
                    dom.getElementById("timetype_dropdown").value = "time_" + top.userData.timetype;
                    util.removeClass(document.getElementById("selec_language"), "on");
                    util.removeClass(document.getElementById("selec_oddstype"), "on");
                    dom.getElementById("right_box_content").scrollTop = 0
                }
                ;
                _self.closeRightPanel = function() {
                    parentClass.dispatchEvent("removebodylock", {});
                    parentClass.dispatchEvent("setNowBodyLockStatus", false);
                    _mc["myAcc_show"].classList.remove("on")
                }
                ;
                _self.showSpecialTitle = function(param) {
                    var special_page = document.getElementById("special_page");
                    var home_show = dom.getElementById("home_show");
                    if (param.isShow && param.name != "") {
                        if (top.specialGame.mode == "CUP")
                            util.addClass(home_show, "event_cup");
                        var par = new Object;
                        special_page.innerHTML = util.showTxt(param.name);
                        special_page.style.display = "";
                        par["page"] = "league_index";
                        par["showtype"] = "live";
                        par["type"] = "live";
                        par["specialClick"] = "special";
                        util.addEvent(special_page, "click", _self.goPage, par)
                    } else {
                        util.removeClass(home_show, "event_cup");
                        special_page.style.display = "none";
                        util.removeEvent(special_page, "click")
                    }
                }
                ;
                _self.messg = function(msgImpchk, msgPerchk) {
                    if (msgImpchk == "Y" || msgPerchk == "Y")
                        dom.getElementById("myAcc_new").className = "dot_red on";
                    else
                        dom.getElementById("myAcc_new").className = "dot_red"
                }
                ;
                _self.showtypeScroll = function(e) {
                    var _showtype = dom.getElementById("showtype_total");
                    var _scroll = dom.getElementById("showtype_scroll");
                    var _left = dom.getElementById("showtype_left");
                    var _right = dom.getElementById("showtype_right");
                    if (_showtype.clientWidth > _scroll.clientWidth) {
                        util.addClass(_right, "on");
                        util.addEvent(_right, "click", util.move, {
                            "click": _right,
                            "div": _scroll,
                            "direction": "right",
                            "opposite": _left
                        })
                    } else {
                        util.removeClass(_right, "on");
                        util.removeEvent(_right, "click")
                    }
                    util.addEvent(_scroll, "scroll", _self.addScrollEvent, {
                        "total": _showtype,
                        "scroll": _scroll,
                        "left": _left,
                        "right": _right
                    })
                }
                ;
                _self.addScrollEvent = function(e, param) {
                    var scroll = param.scroll.scrollLeft;
                    var menuW = param.scroll.scrollWidth - param.scroll.clientWidth;
                    if (scroll > 0)
                        util.addClass(param.left, "on");
                    if (scroll == 0)
                        util.removeClass(param.left, "on");
                    if (scroll < menuW && menuW - scroll > 1)
                        util.addClass(param.right, "on");
                    if (scroll >= menuW)
                        util.removeClass(param.right, "on");
                    if (param.total)
                        util.initCheckScroll(param.total, param.scroll, param.left, param.right)
                }
                ;
                _self.createWCTimer = function() {
                    _self.clearWCTimer();
                    timerHash["wagerCount"] = new Timer(config_set.get("CONFIG_TODAY_WAGERS"));
                    timerHash["wagerCount"].setParentclass(_self);
                    timerHash["wagerCount"].dont_clear = true;
                    timerHash["wagerCount"].init();
                    timerHash["wagerCount"].addEventListener("TimerEvent.TIMER", _self.getTodayWagersCount);
                    timerHash["wagerCount"].startTimer()
                }
                ;
                _self.clearWCTimer = function() {
                    if (timerHash["wagerCount"] != null) {
                        timerHash["wagerCount"].clearObj();
                        timerHash["wagerCount"] = null
                    }
                    return true
                }
                ;
                _self.getTodayWagersCount = function() {
                    top["delayReason"] = new Object;
                    var urlParams = "";
                    urlParams += "uid=" + top["userData"].uid;
                    urlParams += "&langx=" + top.langx;
                    urlParams += "&LS=" + _self.langx2LS(top.langx);
                    urlParams += "&selGtype=ALL";
                    urlParams += "&chk_cw=N";
                    urlParams += "&ts=" + top["lastClickTS"];
                    urlParams += "&format=json";
                    urlParams = "p=get_today_wagers&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.getTodayWagersCountComplete);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
				_self.updateMemData = function(xml) {
                    memparamHash = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(memparamHash))
                        return;
                    var xmdObj = new Object;
                    xmlnode = util.parseXml(xml);
                    xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
                    if (xmdObj["code"].innerHTML == "get_member_data" || xmdObj["code"].innerHTML == "get_all_data") {
						//console.log("maxcredit------"+xmlnode.Node(xmlnode.Root[0], "maxcredit").innerHTML);
						_self.chgcredit(xmlnode.Node(xmlnode.Root[0], "maxcredit").innerHTML);
						//top["userData"].maxcredit = xmlnode.Node(xmlnode.Root[0], "maxcredit").innerHTML;
                    }
                };
                _self.langx2LS = function(langx) {
                    var lang_str = "";
                    switch (langx) {
                    case "zh-cn":
                        lang_str = "g";
                        break;
                    case "en-us":
                        lang_str = "e";
                        break;
                    case "zh-tw":
                        lang_str = "c";
                        break;
                    default:
                        break
                    }
                    return lang_str
                }
                ;
                _self.getTodayWagersCountComplete = function(jsonStr) {
                    top["forecastData"] = new Object;
                    var jsonData = JSON.parse(jsonStr);
                    var code = jsonData["code"];
                    top["forecastData"]["code"] = code;
                    var totalCount = "";
                    if (code == "todaywagers") {
                        if (jsonData["allGidAry"]) {
                            if (top["delayReason"]["ALL"] == null)
                                top["delayReason"]["ALL"] = "";
                            for (var _gtype in jsonData["allGidAry"]) {
                                top["delayReason"]["ALL"] += _gtype + "|";
                                for (var _key in jsonData["allGidAry"][_gtype])
                                    if (_key == jsonData["allGidAry"][_gtype].length - 1)
                                        top["delayReason"]["ALL"] += jsonData["allGidAry"][_gtype][_key] + "@";
                                    else
                                        top["delayReason"]["ALL"] += jsonData["allGidAry"][_gtype][_key] + ","
                            }
                        }
                        parentClass.dispatchEvent("loadDelayReason");
                        var wagersData = jsonData["wagers"];
                        var totalLength = 0;
						if (wagersData) {
							totalLength = wagersData.length;
						}
						
						
                        for (var i = 0; i < totalLength; i++) {
                            var bet_wtype = wagersData[i]["bet_wtype"];
                            var bet_gtype = wagersData[i]["bet_gtype"];
                            var gid = wagersData[i]["gid"];
                            var w_id = wagersData[i]["w_id"];
                            if (top["forecastData"][bet_gtype] == null)
                                top["forecastData"][bet_gtype] = new Object;
                            if (top["forecastData"][bet_gtype][gid] == null) {
                                top["forecastData"][bet_gtype][gid] = new Array;
                                if (bet_wtype == "RP" || bet_wtype == "P" || bet_wtype == "FS")
                                    continue;
                                top["forecastData"][bet_gtype][gid].push(wagersData[i])
                            } else {
                                var tmpLen = top["forecastData"][bet_gtype][gid].length;
                                var isRepeat = false;
                                for (var a = 0; a < tmpLen; a++)
                                    if (top["forecastData"][bet_gtype][gid][a]["w_id"] == w_id) {
                                        isRepeat = true;
                                        top["forecastData"][bet_gtype][gid][a] = wagersData[i]
                                    }
                                if (!isRepeat)
                                    top["forecastData"][bet_gtype][gid].push(wagersData[i])
                            }
                        }
                        totalCount = jsonData["count"];
                        _self.setTodayWagersCount(totalCount);
                        parentClass.dispatchEvent("setBottomTodayWagers", {
                            "num": totalCount
                        });
                        if (dom.getElementById("forecast_show").classList.contains("on"))
                            parentClass.dispatchEvent("updateForecast", {})
                    }
                }
                ;
                _self.setTodayWagersCount = function(num) {
                    _mc["wager_count"].style.display = "";
                    util.removeClass(_mc["wager_count"], "on");
                    _mc["wager_count"].innerHTML = num * 1 > 99 ? "99+" : num * 1;
                    if (num * 1 > 0) {
                        util.addClass(_mc["header_todaywagers"], "wager_exist");
                        util.addClass(_mc["wager_count"], "on");
                        if (num * 1 > lastTotalBet * 1)
                            util.setTimeoutClass("header_todaywagers", "wager_add", "add", _self.removeBetClass, 700)
                    } else
                        util.removeClass(_mc["header_todaywagers"], "wager_exist");
                    lastTotalBet = num
                }
                ;
                _self.removeBetClass = function() {
                    util.removeClass(_mc["header_todaywagers"], "wager_add")
                }
                ;
               _self.chgcredit = function(nowcredit) {
                    var returnObj = new Array;
                    var tmpObj = new Object;
                    if (oldCredit == "")
                        oldCredit = nowcredit != null ? nowcredit : top["userData"].maxcredit;
                    var _oldCash = util.trans_thousand(oldCredit);
                    if (top.showCredit) {
                        if (nowcredit != null)
                            top["userData"].maxcredit = nowcredit;
                        if (_oldCash != util.trans_thousand(top["userData"].maxcredit) && _oldCash != "" && !noRunCash) {
                            var tmpCredit = oldCredit.replace(/[,]+/g, "");
                            savechk = util.showTxt(parseFloat(tmpCredit));
                            tmpObj = {
                                "savechk": savechk,
                                "maxcredit": parseFloat(top["userData"].maxcredit),
                                "currency": _mc["header_currency"],
                                "credit": _mc["header_credit"],
                                "money": "header_money",
                                "Ary": Ary,
                                "count": count,
                                "removeFun": _self.removeMoneyCss
                            };
                            returnObj = util.chgCreditAnimation(tmpObj);
                            Ary = returnObj["Ary"];
                            count = returnObj["count"]
                        }/* else {
                            noRunCash = false;
                            var _maxcredit = util.trans_thousand(top["userData"].maxcredit);
                            if (top["userData"].maxcredit * 1 > 99999 && top["userData"].maxcredit * 1 <= 999999999)
                                _maxcredit = util.transThousand(Math.floor(top["userData"].maxcredit), 0);
                            else if (top["userData"].maxcredit * 1 > 999999999)
                                _maxcredit = "\u2022\u2022\u2022\u2022\u2022";
                            _mc["header_credit"].innerHTML = _maxcredit;
							_mc["menu_acc_credit"].innerHTML = _maxcredit;	
                          _mc["header_currency"].innerHTML = util.showTxt(top["userData"].currency);
                            top["orderinfo"]["date"] = ""
                        }*/
						 else {
    noRunCash = false;
    var _maxcredit = util.trans_thousand(top["userData"].maxcredit);
    if (top["userData"].maxcredit * 1 > 99999 && top["userData"].maxcredit * 1 <= 999999999)
        _maxcredit = util.transThousand(Math.floor(top["userData"].maxcredit), 0);
    else if (top["userData"].maxcredit * 1 > 999999999)
        _maxcredit = "\u2022\u2022\u2022\u2022\u2022";
 
    // 妫€鏌ュ苟璁剧疆 _mc["header_credit"]
    if (_mc["header_credit"]) {
        _mc["header_credit"].innerHTML = _maxcredit;
    } else {
        console.error('Element _mc["header_credit"] is not found');
    }
 
    // 妫€鏌ュ苟璁剧疆 _mc["menu_acc_credit"]
    if (_mc["menu_acc_credit"]) {
        _mc["menu_acc_credit"].innerHTML = _maxcredit;
    } else {
        console.error('Element _mc["menu_acc_credit"] is not found');
    }
 
    // 妫€鏌ュ苟璁剧疆 _mc["header_currency"]
    if (_mc["header_currency"]) {
        _mc["header_currency"].innerHTML = util.showTxt(top["userData"].currency);
    } else {
        console.error('Element _mc["header_currency"] is not found');
    }
 
    top["orderinfo"]["date"] = "";
}
                        oldCredit = top["userData"].maxcredit
                    }

					
                }
                ; 
				
                _self.cashdata = function(xml) {
                    _self.paramHash["errorMsg"] = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(_self.paramHash["errorMsg"]))
                        return;
                    var xmdObj = new Object;
                    xmlnode = util.parseXml(xml);
                    xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
                    if (xmdObj["code"].innerHTML == "get_credit_data" || xmdObj["code"].innerHTML == "get_all_data") {
                        top["userData"].maxcredit = xmlnode.Node(xmlnode.Root[0], "maxcredit").innerHTML;
                        top["userData"].currency = xmlnode.Node(xmlnode.Root[0], "currency").innerHTML;
                        top["userData"].pay_type = xmlnode.Node(xmlnode.Root[0], "pay_type").innerHTML;
                        if (top["userData"]["oldCredit"] == null)
                            top["userData"]["oldCredit"] = xmlnode.Node(xmlnode.Root[0], "maxcredit").innerHTML;
                        maxcredit = util.trans_thousand(top["userData"].maxcredit);
                        if (savechk == "") {
                            savechk = parseFloat(top["userData"].maxcredit);
                            cashcheck = true
                        }
                        _self.chgcredit()
                    }
                    if (!firstLoad) {
                        _self.showtypeScroll();
                        myGameTotalCount = util.getMyGameTotalCount("all");
                        if (myGameTotalCount * 1 > 99)
                            myGameTotalCount = "99+";
                        _mc["header_myGame_num"].innerHTML = myGameTotalCount == 0 ? "" : myGameTotalCount;
                        oldCredit = top["userData"].maxcredit;
                        parentClass.dispatchEvent("checkCount", {});
                        firstLoad = true
                    }
                }
                ;
                _self.initHeaderBtn = function() {
                    for (var i = 0; i < header.length; i++) {
                        var par = new Object;
                        var key = header[i];
                        par["page"] = _mc[key].url;
                        par["showtype"] = _mc[key].showtype;
                        par["type"] = _mc[key].type;
                        par["specialClick"] = _mc[key].specialClick ? "special" : "";
                        par["outrightsClick"] = _mc[key].outrightsClick ? "outrights" : "";
                        util.addEvent(_mc[key], "click", _self.goPage, par)
                    }
                }
                ;
                _self.doGoToMyGame = function() {
                    mygame_bottom = true;
                    _mc["header_myGame"].click()
                }
                ;
                _self.removeHeaderClick = function() {
                    for (var i = 0; i < header.length; i++) {
                        var key = header[i];
                        util.removeEvent(_mc[key], "click")
                    }
                }
                ;
                _self.onError = function() {
                    echo("get system time error.")
                }
                ;
                _self.addAnimation = function() {
                    clearTimeout(addAnimation);
                    util.removeClass(_mc["header_myGame"], "mygame_ani0");
                    util.removeClass(_mc["header_myGame"], "mygame_ani");
                    setTimeout(_self.delayAdd, 50)
                }
                ;
                _self.delayAdd = function() {
                    act = "add";
                    var _myGameTotalCount = top.choice_showtype == "mygame" ? myGameTotalCount : util.getMyGameTotalCount("all");
                    if (_myGameTotalCount == 1) {
                        util.addClass(_mc["header_myGame"], "mygame_ani0");
                        _mc["header_myGame_num"].innerHTML = _myGameTotalCount
                    } else {
                        util.addClass(_mc["header_myGame"], "mygame_ani");
                        if (_myGameTotalCount * 1 > 99)
                            _myGameTotalCount = "99+";
                        _mc["header_myGame_num"].innerHTML = _myGameTotalCount
                    }
                    addAnimation = setTimeout(_self.removeMyEventsClass, 700, act)
                }
                ;
                _self.removeAnimation = function() {
                    clearTimeout(addAnimation);
                    util.removeClass(_mc["header_myGame"], "mygame_ani0");
                    util.removeClass(_mc["header_myGame"], "mygame_ani");
                    setTimeout(_self.delayRemove, 50)
                }
                ;
                _self.delayRemove = function() {
                    act = "remove";
                    var _myGameTotalCount = top.choice_showtype == "mygame" ? myGameTotalCount : util.getMyGameTotalCount("all");
                    if (_myGameTotalCount == 0)
                        _mc["header_myGame_num"].innerHTML = "";
                    else {
                        if (_myGameTotalCount * 1 > 99)
                            _myGameTotalCount = "99+";
                        _mc["header_myGame_num"].innerHTML = _myGameTotalCount
                    }
                }
                ;
                _self.removeMyEventsClass = function(action) {
                    if (action == "add") {
                        util.removeClass(_mc["header_myGame"], "mygame_ani0");
                        util.removeClass(_mc["header_myGame"], "mygame_ani")
                    }
                }
                ;
                _self.showGreenBtn = function(show) {
                    if (!show)
                        util.removeClass(_mc["header_myGame_dot"], "on");
                    else
                        util.addClass(_mc["header_myGame_dot"], "on")
                }
                ;
                _self.showMyGame = function(show) {
                    if (!show) {
                        util.addClass(_mc["header_myGame"], "mygame_off");
                        _mc["header_myGame_num"].innerHTML = ""
                    } else {
                        myGameTotalCount = util.getMyGameTotalCount("all");
                        if (myGameTotalCount * 1 > 99)
                            myGameTotalCount = "99+";
                        _mc["header_myGame_num"].innerHTML = myGameTotalCount == 0 ? "" : myGameTotalCount;
                        util.removeClass(_mc["header_myGame"], "mygame_off")
                    }
                }
                ;
                _self.hideCash = function(isClick) {
                    if (top.showCredit)
                        noRunCash = true;
                    else {
                        noRunCash = false;
                        _mc["header_credit"].innerHTML = "\u2022\u2022\u2022\u2022\u2022";
						_mc["menu_acc_credit"].innerHTML = "\u2022\u2022\u2022\u2022\u2022";
                        _mc["header_currency"].innerHTML = util.showTxt(top["userData"].currency)
                    }
                }
                ;
                _self.removeMoneyCss = function() {
                    util.removeClass(_mc["header_money"], "ani_credit_add")
                }
                ;
                _self.myGamePageCount = function(count) {
                    myGameTotalCount = count;
                    _self.delayRemove()
                }
            }
            ;