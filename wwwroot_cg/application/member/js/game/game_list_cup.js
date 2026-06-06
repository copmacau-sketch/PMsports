function game_list_cup(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var classname = "game_list_cup";
    var parentClass;
    var childClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var util_game = new win.Util_game(win, dom);
    var CookieManager = new win.CookieManager;
    var config_set;
    var LS;
    var LS_game;
    var _mc = new Object;
    var openHash = new Object;
    var openHash2 = new Object;
    var clickedHash = new Object;
    var orientationobj = new Object;
    var orientationgid = new Array;
    var orientationxml =
        new Object;
    var timerHash;
    var GameInfo;
    var GameRatio;
    var OBT;
    var PK;
    var IOR;
    var _xmlnode;
    var _xmlnodeFS;
    var hasPD = false;
    var closeGameMovieStandard = 2;
    var _lastOBT_tab = null;
    var _lastOBT_div = null;
    var _lastOBT_close = null;
    var _lastCourt_tab = null;
    var _lastPK = new Object;
    var _lastPKset = new Object;
    var nowOBT_count = new Object;
    var mainModel = new Object;
    var keepLeg = "";
    var keepLegID = "";
    var totalLeg = new Array;
    var myLeg = new Object;
    var ptype_str = new Object;
    var ec_chg = false;
    var ecid_array = new Array;
    ptype_str["1"] = "ET";
    ptype_str["2"] = "PK";
    ptype_str["3"] = "PK";
    var OBT_transHT = new Object;
    OBT_transHT["RE"] = "HRE";
    OBT_transHT["ROU"] = "HROU";
    OBT_transHT["R"] = "HR";
    OBT_transHT["OU"] = "HOU";
    OBT_transHT["ETRE"] = "ETHRE";
    OBT_transHT["ETROU"] = "ETHROU";
    var showOBT = new Array("HT", "FT", "ET");
    var OBT_notShowAry = new Array("ET", "PK");
    var OBT_needsR = new Array("CN", "RN", "WI", "ET", "PK");
    var OBTAry = new Array("R", "OU", "CN", "RN", "WI", "ET", "PK");
    var OBT_ETAry = new Array("CN", "RN");
    var OBT_rb_Ary = new Object;
    OBT_rb_Ary["R"] = "RE";
    OBT_rb_Ary["OU"] =
        "ROU";
    var OBT_loop = new Array("RE", "HRE", "ROU", "HROU", "R", "HR", "OU", "HOU", "WI", "MIX", "HMIX");
    var getMainIor = new Array("RE", "HRE", "ROU", "HROU", "R", "HR", "OU", "HOU");
    var TAB_ary = new Array("main", "pd");
    var specialShowtype = new Array("special", "fantasy");
    _self.paramHash = new Object;
    _self.paramHash["lid"] = postHash["lid"];
    _self.paramHash["action"] = postHash["action"];
    var swHash = new Object;
    var isP3_R = new Object;
    var config_ior = null;
    var needsTransWtype = new Array("RG", "RPX", "RSH", "RSC", "RNC", "RNB", "RF");
    var sort_type =
        "L";
    var chgSort = false;
    var rightChgSort = false;
    var ecidScrollHash = new Object;
    var obtScrollHash = new Object;
    var menuScrollHash = new Object;
    var gid_rtype_ior = new Object;
    var chgColorIor = new Object;
    var chgColorID;
    var rbP3_ECID = new Array;
    var regexpHash = new Object;
    var rowAry = new Array;
    var lastNowModel = new Object;
    var OBT_closed = "";
    var firstLoadObt = true;
    var mainIor = new Object;
    var FantasyDataHash = new Object;
    var firstLoad = true;
    var isIOS = util.isIOS();
    var nowTS = null;
    var defHash = new Object;
    var tmpOBTModelHash = new Object;
    var isRB_OBT = new Object;
    var worker_sw = true;
    var _worker;
    var obt_xml;
    var group_xml;
    var halfAry = new Object;
    var FantasyAry = new Array;
    var page_sw = false;
    var page_no = 1;
    var pageTotal;
    var pageObj = null;
    var RESIZE = false;
    var _totalPage = 0;
    var clusterize_sw = false;
    var clusterize = null;
    var _lastOBTHeight = 0;
    var isClickOBT = false;
    var obtRequestAry = new Array;
    var blockHeight, blockNum;
    var nowGameHash = new Object;
    var nowOBTGameHash = new Object;
    top["nowTs"] = "";
    top["pageTs"] = new Object;
    var writeLog_sw = true;
    var _log = "";
    var tsAry =
        new Object;
    var lastECID;
    var lastECID_scroll = false;
    var hasGet = false;
    var first_no_tvmt = false;
    var scDataObj;
    var rightPlay = false;
    var my_ecidAry = new Array;
    var my_rightTV = new Object;
    var my_rightTVAry = new Array;
    var sportFrame = null;
    var newTS = 0;
    var oldTS = 0;
    var oldRtype = "";
    var lastClickTS = postHash["nowTS"];
    var first_OBTMenuBtn = true;
    var first_Clusterize = true;
    var MixObtRtype = new Object;
    var OBT_Needs_Parse = false;
    var gid_count_min = 4;
    var gid_count_max = 6;
    var more_param_obj = new Object;
    var OBT_LIVE_MIX_wtype = new Array("RE",
        "ROU");
    var OBT_MIX_wtype = new Array("R", "OU");
    var OBT_LIVE_HMIX_wtype = new Array("HRE", "HROU");
    var OBT_HMIX_wtype = new Array("HR", "HOU");
    var OBT_mix_Ary = new Array("R", "OU", "HR", "HOU", "RE", "ROU", "HRE", "HROU");
    OBT_transHT["MIX"] = "HMIX";
    OBT_transHT["ETMIX"] = "ETHMIX";
    var nowOBTMix_count = new Object;
    var OBT_WI_count = new Object;
    var OBT_TQ_count = new Object;
    var AD = new win.AD(win, dom);
    var isAndroidPC = false;
    var resizeWinnerCnt = 0;
    var resizeZeroCnt = 0;
    var winnerListAry = new Array;
    var winnerXml;
    var is_first_choise =
        true;
    var sort_gpAry = new Array;
    var sort_partiHash = new Object;
    var gpHash = new Object;
    var partiHash = new Object;
    var rtypeHash = new Object;
    var KEYID = "2370877a0ce04fbfdc9678dae41d4210";
    var winner_empty = false;
    var game_empty = false;
    var fs_empty = false;
    var betLeagueName = "";
    var firstLoadWidget = true;
    var keepSeasonID = "";
    var keepTeamUID = "";
    var needRename = true;
    var reload = false;
    var widget_loadDone = false;
    var hasWidget = false;
    var myhash = {};
    _self.init = function () {
        echo("worker throw")
    };
    _self.reInit = function (_childClass, _classname,
                             _GameInfo, _GameRatio, _OBT, _PK, _IOR) {
        top.isLeagued = false;
        top.bet_className = classname;
        _self.addEventListener("backPage", _self.backClick);
        _self.addEventListener("startTimer", _self.startTimer);
        _self.addEventListener("clearTimer", _self.clearTimer);
        _self.addEventListener("internetError", _self.internetError);
        _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("getModel", _self.getModel);
        _self.addEventListener("reloadTeam",
            _self.reloadTeam);
        _self.addEventListener("retryLoop", _self.retryLoop);
        _self.addEventListener("retryLastfail", _self.retryLastfail);
        _self.addEventListener("retryComplete", _self.retryComplete);
        _self.addEventListener("getSpecialData", _self.getSpecialData);
        _self.addEventListener("showGameLoading", _self.showGameLoading);
        _self.addEventListener("clearGameTimer", _self.clearGameTimer);
        _self.addEventListener("createGameTimer", _self.createGameTimer);
        _self.addEventListener("initBackCount", _self.initBackCount);
        util.setParentclass(_self);
        childClass = _childClass;
        GameInfo = _GameInfo;
        GameRatio = _GameRatio;
        OBT = _OBT;
        PK = _PK;
        IOR = _IOR;
        classname = _classname;
        util_game.init();
        config_ior = config_set.get("CONFIG_IORATIO");
        clusterize_sw = false;
        page_sw = config_set.get("PAGE_SW");
        top["notShowLeg"] = new Object;
        top["notShowLegGame"] = new Object;
        top["showPDmore"] = new Object;
        _self.loadWinnerList();
        _self.loadSport();
        top.rightRB = "";
        if (getView().viewportwidth < 1024) parentClass.dispatchEvent("resetRightTV", {});
        util.addEvent(_mc["back_btn"],
            "click", _self.backClick);
        _lastOBT_tab = null;
        _lastOBT_div = null;
        _lastOBT_close = null;
        _lastCourt_tab = null;
        _lastPK = new Object;
        _lastPKset = new Object;
        keepLeg = "";
        keepLegID = "";
        top["showOBT"] = "";
        win.addEventListener("orientationchange", _self.orientationchange);
        cmdHash = HashFunction();
        if (worker_sw && window.Worker) {
            var workerpage = top.minify_sw == "Y" ? "worker.min.js" : "worker.js";
            _worker = new Worker("/js/game/" + workerpage + "?ver=" + top.ver);
            _worker.addEventListener("message", _self.workerThrough, false)
        }
    };

    function receiveMessageFromMyframe(event) {
        var cmds =
            event.data.split("|");
        if (cmdHash[cmds[0]] != null) cmdHash[cmds[0]](cmds[1])
    }

    var HashFunction = function () {
        var Hash = [];
        Hash["002"] = function (name) {
            _self.closeLoading(name)
        };
        Hash["004"] = function (name) {
            if (top.specialGame.isTeam) {
                var heights = name.split("_");
                var leaderH = heights[0] * 1;
                var infoH = heights[1] * 1;
                var totalHeight = 0;
                if (getView().viewportwidth < 640) totalHeight = leaderH + infoH + 16 + 2 + 2; else if (leaderH > infoH) totalHeight = leaderH + 2; else totalHeight = infoH + 2;
                document.getElementById("widgetFrame").style.height = totalHeight +
                    "px"
            } else document.getElementById("widgetFrame").style.height = name + "px"
        };
        return Hash
    };
    _self.closeLoading = function (name) {
        if (dom.getElementById(name)) dom.getElementById(name).style.display = "none";
        if (name == "mt_loading" || name == "mt_pop_loading") if (dom.getElementById("R_" + name)) dom.getElementById("R_" + name).style.display = "none"
    };
    _self.backClick = function (e) {
        var param = new Object;
        param.retFun = null;
        parentClass.dispatchEvent("backPage", param);
        record_distance = new Array
    };
    _self.getThis = function (varible) {
        if (!myhash[varible]) {
            var msg =
                "no myhash[" + varible + "]";
            util.writeLog(classname, msg)
        }
        return myhash[varible]
    };
    _self.getParentThis = function (varible) {
        return parentClass.getThis(varible)
    };
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        config_set = parentClass.getThis("config_set");
        timerHash = parentClass.getThis("timerHash");
        LS = parentClass.getThis("LS");
        LS_game = parentClass.getThis("LS_game");
        headerFrame = parentClass.getThis("headerFrame");
        myhash["config_set"] = config_set;
        myhash["timerHash"] = timerHash;
        myhash["LS"] = LS;
        myhash["headerFrame"] = headerFrame
    };
    _self.createWinnerTimer = function () {
        if (timerHash["winnerTimer"] != null) return;
        var sec = _self.getTimerSec();
        timerHash["winnerTimer"] = new Timer(sec);
        timerHash["winnerTimer"].setParentclass(_self);
        timerHash["winnerTimer"].init();
        timerHash["winnerTimer"].addEventListener("TimerEvent.TIMER",
            _self.loadWinnerList);
        timerHash["winnerTimer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.gameTimerFinish);
        timerHash["winnerTimer"].startTimer()
    };
    _self.winnerTimerFinish = function () {
    };
    _self.loadTeamMenu = function () {
        top.loadTeam_done = false;
        if (top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] == null || top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] == 0) {
            if (top["specialGame"]["CUP_TEAM_ARY"].length == 0) {
                winner_empty = true;
                game_empty = true;
                fs_empty = true;
                top.loadTeam_done = true;
                _self.showNoData(true);
                try {
                    sportFrame.setTitle("special", {"title": ""})
                } catch (e) {
                    console.log(e)
                }
                if (dom.getElementById("cup_touch_div_320")) dom.getElementById("cup_touch_div_320").style.display = "none";
                if (dom.getElementById("cup_touch_div_640")) dom.getElementById("cup_touch_div_640").style.display = "none";
                if (dom.getElementById("winner_show")) dom.getElementById("winner_show").style.display = "none";
                if (dom.getElementById("team_menu_show")) dom.getElementById("team_menu_show").style.display = "none";
                if (dom.getElementById("widget_show")) dom.getElementById("widget_show").style.display =
                    "none";
                if (dom.getElementById("title_fs")) dom.getElementById("title_fs").style.display = "none";
                if (dom.getElementById("cup_fs_show")) dom.getElementById("cup_fs_show").style.display = "none";
                if (dom.getElementById("btn_all_fs")) dom.getElementById("btn_all_fs").style.display = "none";
                _self.showGameLoading(false)
            } else {
                reload = true;
                parentClass.dispatchEvent("showLoading", {"isShow": true});
                win._history.pop();
                var par = new Object;
                par.team_id = top["specialGame"]["CUP_TEAM_ARY"][0];
                _self.reloadTeam(par)
            }
            return
        } else {
            if (dom.getElementById("team_menu_show")) dom.getElementById("team_menu_show").style.display =
                "";
            var teamCount = top["specialGame"]["CUP_TEAM_ARY"].length;
            if (teamCount > 0) {
                var tmp_body_screen = "";
                for (var i = 0; i < teamCount; i++) {
                    var team_id = top["specialGame"]["CUP_TEAM_ARY"][i];
                    var team_name = top["specialGame"]["CUP_TEAM_NAME"][team_id];
                    if (team_name == null || team_name == "") continue;
                    var flag_class = top["specialGame"]["CUP_TEAM_FLAG"][team_id];
                    var model_menu_body = dom.getElementById("team_menu_model").innerHTML;
                    model_menu_body = model_menu_body.replace(/\*FLAG_CLASS\*/g, util.showTxt(flag_class));
                    model_menu_body =
                        model_menu_body.replace(/\*TEAMID\*/g, util.showTxt(team_id));
                    model_menu_body = model_menu_body.replace(/\*TEAMNAME\*/g, util.showTxt(team_name));
                    tmp_body_screen += model_menu_body
                }
                dom.getElementById("team_total").innerHTML = tmp_body_screen;
                dom.getElementById("team_menu_show").style.display = "";
                for (var i = 0; i < teamCount; i++) {
                    var team_id = top["specialGame"]["CUP_TEAM_ARY"][i];
                    if (dom.getElementById("symbol_" + team_id)) util.removeClass(dom.getElementById("symbol_" + team_id), "on")
                }
                if (dom.getElementById("symbol_" +
                    top.specialGame.choice_teamID)) util.addClass(dom.getElementById("symbol_" + top.specialGame.choice_teamID), "on");
                _self.initTeamBtn();
                var _team = dom.getElementById("team_total");
                var _scroll = dom.getElementById("team_scroll");
                var _left = dom.getElementById("team_left");
                var _right = dom.getElementById("team_right");
                var ret = false;
                if (_team.clientWidth > _scroll.clientWidth) {
                    util.addClass(_right, "on");
                    util.addEvent(_right, "click", util.move, {
                        "click": _right,
                        "div": _scroll,
                        "direction": "right",
                        "opposite": _left
                    })
                }
                util.addEvent(_scroll,
                    "scroll", _self.addScrollEvent, {
                        "total": _team,
                        "scroll": _scroll,
                        "left": _left,
                        "right": _right
                    });
                if (dom.getElementById("symbol_" + top.specialGame.choice_teamID) == null) dom.getElementById("team_menu_show").style.display = "none"; else ret = setTimeout(_self.getTeamDistance, 1E3, _scroll);
                util.dragScroll(dom, "team_scroll", _self.initTeamBtn, _self.removeTeamClick, {"tagName": "team"})
            } else {
                dom.getElementById("team_menu_show").style.display = "none";
                return
            }
        }
    };
    _self.initTeamBtn = function () {
        var teamCount = top["specialGame"]["CUP_TEAM_ARY"].length;
        for (var i = 0; i < teamCount; i++) {
            var team_id = top["specialGame"]["CUP_TEAM_ARY"][i];
            if (dom.getElementById("symbol_" + team_id)) util.addEvent(dom.getElementById("symbol_" + team_id), "click", _self.chgTeam, {
                "team_id": team_id,
                "rtype": "r"
            })
        }
    };
    _self.removeTeamClick = function () {
        var teamCount = top["specialGame"]["CUP_TEAM_ARY"].length;
        for (var i = 0; i < teamCount; i++) {
            var team_id = top["specialGame"]["CUP_TEAM_ARY"][i];
            if (dom.getElementById("symbol_" + team_id)) util.removeEvent(dom.getElementById("symbol_" + team_id), "click")
        }
    };
    _self.reloadTeam = function (par) {
        par.back = "Y";
        _self.chgTeam(null, par)
    };
    _self.chgTeam = function (e, par) {
        top.specialGame.choice_teamID = par.team_id;
        if (par.rtype) top.choice_rtype = par.rtype;
        nowTS = util.getTimestamp();
        top["lastClickTS"] = nowTS;
        if (dom.getElementById("symbol_" + par.team_id)) {
            getGtypePosition = dom.getElementById("symbol_" + par.team_id).offsetLeft;
            top.left_distance = getGtypePosition
        }
        var param = new Object;
        param["page"] = "game_list_SP";
        param["extendsClass"] = "game_list_cup";
        param["showtype"] = top.choice_showtype;
        param["type"] = top.choice_showtype;
        var postHash = new Object;
        postHash["gtype"] = top.choice_gtype;
        postHash["showtype"] = top.choice_showtype;
        postHash["rtype"] = top.choice_rtype;
        postHash["specialTitle"] = top.specialGame.title;
        postHash["specialClick"] = top.specialClick;
        postHash["outrightsClick"] = top.outrightsClick;
        postHash["nowTS"] = nowTS;
        postHash["kind"] = "teams";
        postHash["team_id"] = top.specialGame.choice_teamID;
        param["post"] = "gtype=" + top.choice_gtype + "&showtype=" + top.choice_showtype + "&rtype=" + top.choice_rtype;
        param["nowTS"] = nowTS;
        param["postHash"] = postHash;
        if (par.back == "Y") param["back"] = "Y";
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.chgTeamCss = function (teamID) {
        dom.getElementById("head_league").className = "head_league cup";
        var teamCount = top["specialGame"]["CUP_TEAM_ARY"].length;
        for (var i = 0; i < teamCount; i++) {
            var team_id = top["specialGame"]["CUP_TEAM_ARY"][i];
            util.removeClass(dom.getElementById("symbol_" + team_id), "on")
        }
        util.addClass(dom.getElementById("symbol_" + teamID), "on")
    };
    _self.addScrollEvent =
        function (e, param) {
            var scroll = param.scroll.scrollLeft;
            var menuW = param.scroll.scrollWidth - param.scroll.clientWidth;
            if (scroll > 0) util.addClass(param.left, "on");
            if (scroll == 0) util.removeClass(param.left, "on");
            if (scroll < menuW) util.addClass(param.right, "on");
            if (scroll >= menuW) util.removeClass(param.right, "on");
            if (param.total) util.initCheckScroll(param.total, param.scroll, param.left, param.right)
        };
    _self.getTeamDistance = function (_scroll) {
        var div = dom.getElementById("symbol_" + top.specialGame.choice_teamID);
        var half_ball_div_width =
            dom.getElementById("symbol_" + top.specialGame.choice_teamID).clientWidth / 2;
        var ret = false;
        top.left_distance = div.offsetLeft;
        if (is_first_choise) ret = _self.move_menu(_scroll.clientWidth, half_ball_div_width, _scroll);
        is_first_choise = false;
        top.loadTeam_done = true;
        if (top.loadTeam_done) _self.showGameLoading(false);
        return ret
    };
    _self.move_menu = function (scroll, half_ball_div_width, scrollObj) {
        var scroll_width = scroll;
        var dif = scroll_width - (top.left_distance + half_ball_div_width);
        var ret = false;
        if (dif < 0) {
            if (dif < 0) dif =
                -dif;
            scrollObj.scrollLeft += dif + scroll_width / 2;
            ret = true
        } else if (dif > 0 && top.left_distance + half_ball_div_width > scroll_width / 2 && top.left_distance + half_ball_div_width < scroll_width) {
            scrollObj.scrollLeft += top.left_distance + half_ball_div_width - scroll_width / 2;
            ret = true
        }
        return ret
    };
    _self.chkGameLoading = function () {
        var loadAD_done = top.specialGame.isHL && top.loadAD_done && closed;
        var loadTeam_done = top.specialGame.isTeam && top.loadTeam_done && closed;
        if (loadAD_done || loadTeam_done) _self.showGameLoading(false)
    };
    _self.loadAD =
        function () {
            top.loadAD_done = false;
            var ios = _self.isIOS();
            if (top.isapp == "N" && !ios && top.mobile != "N") isAndroidPC = true; else isAndroidPC = false;
            isAndroidPC = true;
            dom.getElementById("cup_touch_div_320").style.display = isAndroidPC ? "" : "none";
            dom.getElementById("cup_touch_div_640").style.display = isAndroidPC ? "" : "none";
            AD.setParentclass(parentClass);
            AD.setAutoPlaySec(1E4);
            AD.setTimeout(isAndroidPC)
        };
    _self.isIOS = function () {
        var ret = false;
        var ag = navigator.userAgent;
        if (ag.indexOf("iPhone") != -1 || ag.indexOf("iPad") != -1) ret =
            true;
        return ret
    };
    _self.loadWinnerList = function () {
        _self.getCupData_FS("MAIN")
    };
    _self.LoadWinnerComplete = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) {
            dom.getElementById("div_winner").style.display = "none";
            return
        }
        top.specialGame.winnerXml = util.parseXml(xml)
    };
    _self.parseWinnerList = function (xml) {
        var winnerDiv = dom.getElementById("winner_show");
        var xmlnode = xml;
        var xmdObj = new Object;
        var moreAry = new Array;
        xmdObj["game"] = xmlnode.Node(xmlnode.Root[0], "game", false);
        if (xmdObj["game"].length >
            0) {
            winner_empty = false;
            var tmp_body_screen = "";
            var teamCount = 0;
            var zeroCount = 0;
            var hideCount = 0;
            var ior_all_zero = true;
            for (var i = 0; i < xmdObj["game"].length; i++) {
                var tmp_game = xmdObj["game"][i];
                var gid = xmlnode.Node(tmp_game, "gid").innerHTML;
                var gopen = xmlnode.Node(tmp_game, "gopen").innerHTML;
                xmdObj["rtypes"] = xmlnode.Node(tmp_game, "rtypes", false);
                for (var k = 0; k < xmdObj["rtypes"].length; k++) {
                    teamCount++;
                    var team_id = xmdObj["rtypes"][k].getAttribute("team_id");
                    if (top.specialGame.isHL) {
                        season_id = top.betradar_season;
                        team_uid = "";
                        if (season_id != keepSeasonID) firstLoadWidget = true;
                        keepSeasonID = season_id;
                        keepTeamUID = team_uid
                    } else if (team_id == top.specialGame.choice_teamID) {
                        season_id = xmdObj["rtypes"][k].getAttribute("season_id");
                        team_uid = xmdObj["rtypes"][k].getAttribute("team_uid");
                        if (season_id != keepSeasonID || team_uid != keepTeamUID) firstLoadWidget = true;
                        keepSeasonID = season_id;
                        keepTeamUID = team_uid
                    } else firstLoadWidget = false;
                    if (top.specialGame.widget_sw == "Y") {
                        if (season_id != "" || team_uid != "") dom.getElementById("widget_show").style.display =
                            ""; else dom.getElementById("widget_show").style.display = "none";
                        if (firstLoadWidget) {
                            firstLoadWidget = false;
                            if (season_id != "" || team_uid != "") _self.loadTeamWidget(season_id, team_uid); else {
                                dom.getElementById("widgetFrame").style.display = "none";
                                dom.getElementById("widget_show").style.display = "none"
                            }
                        }
                    } else {
                        keepSeasonID = "";
                        keepTeamUID = "";
                        dom.getElementById("widget_show").style.display = "none"
                    }
                    moreAry.push(team_id);
                    var image_id = xmdObj["rtypes"][k].getAttribute("image_id");
                    var rtype = xmlnode.Node(xmdObj["rtypes"][k],
                        "rtype").innerHTML;
                    var team = xmlnode.Node(xmdObj["rtypes"][k], "teams").innerHTML;
                    var ioratio = gopen == "N" ? "" : xmlnode.Node(xmdObj["rtypes"][k], "ioratio").innerHTML;
                    top["specialGame"]["CUP_TEAM_NAME"][team_id] = team;
                    top["specialGame"]["CUP_TEAM_FLAG"][team_id] = image_id;
                    if (top.specialGame.isTeam && team_id != top.specialGame.choice_teamID) continue;
                    if (ioratio * 1 == 0) if (top.specialGame.isTeam) ioratio = ""; else {
                        zeroCount++;
                        continue
                    } else ior_all_zero = false;
                    var model_game_body = dom.getElementById("winner_model").innerHTML;
                    model_game_body = model_game_body.replace(/\*FLAG_CLASS\*/g, util.showTxt(image_id));
                    model_game_body = model_game_body.replace(/\*RTYPE\*/g, util.showTxt(rtype));
                    model_game_body = model_game_body.replace(/\*WINNER_TEAM\*/g, util.showTxt(team));
                    model_game_body = model_game_body.replace(/\*IOR_WINNER\*/g, util.showTxt(util_game.getIoratio(ioratio, null, "FS")));
                    model_game_body = model_game_body.replace(/\*GID\*/g, util.showTxt(gid));
                    model_game_body = model_game_body.replace(/\*ECID\*/g, util.showTxt(gid));
                    tmp_body_screen +=
                        model_game_body
                }
            }
            if (top.specialGame.isTeam && top.specialGame.choice_teamID != "" && !util.in_array(top.specialGame.choice_teamID, moreAry) && top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] != null) {
                var team_id = top.specialGame.choice_teamID;
                var image_id = top["specialGame"]["CUP_TEAM_FLAG"][team_id];
                var team = top["specialGame"]["CUP_TEAM_NAME"][team_id];
                var ioratio = "";
                var model_game_body = dom.getElementById("winner_model").innerHTML;
                model_game_body = model_game_body.replace(/\*FLAG_CLASS\*/g, util.showTxt(image_id));
                model_game_body = model_game_body.replace(/\*WINNER_TEAM\*/g, util.showTxt(team));
                model_game_body = model_game_body.replace(/\*IOR_WINNER\*/g, util.showTxt(util_game.getIoratio(ioratio, null, "FS")));
                tmp_body_screen += model_game_body
            }
            if (top.specialGame.isTeam && (top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] == null || top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] == 0)) {
                if (top["specialGame"]["CUP_TEAM_ARY"].length == 0) {
                    winner_empty = true;
                    game_empty = true;
                    fs_empty = true;
                    _self.showNoData(true);
                    try {
                        sportFrame.setTitle("special", {"title": ""})
                    } catch (e) {
                        console.log(e)
                    }
                    if (dom.getElementById("cup_touch_div_320")) dom.getElementById("cup_touch_div_320").style.display = "none";
                    if (dom.getElementById("cup_touch_div_640")) dom.getElementById("cup_touch_div_640").style.display = "none";
                    if (dom.getElementById("winner_show")) dom.getElementById("winner_show").style.display = "none";
                    if (dom.getElementById("team_menu_show")) dom.getElementById("team_menu_show").style.display = "none";
                    if (dom.getElementById("widget_show")) dom.getElementById("widget_show").style.display =
                        "none";
                    if (dom.getElementById("title_fs")) dom.getElementById("title_fs").style.display = "none";
                    if (dom.getElementById("cup_fs_show")) dom.getElementById("cup_fs_show").style.display = "none";
                    if (dom.getElementById("btn_all_fs")) dom.getElementById("btn_all_fs").style.display = "none";
                    _self.showGameLoading(false)
                } else {
                    reload = true;
                    parentClass.dispatchEvent("showLoading", {"isShow": true});
                    win._history.pop();
                    var par = new Object;
                    par.team_id = top["specialGame"]["CUP_TEAM_ARY"][0];
                    _self.reloadTeam(par)
                }
                return
            } else {
                if (top.specialGame.isTeam) dom.getElementById("team_menu_show").style.display =
                    "";
                dom.getElementById("winner_scroll").innerHTML = tmp_body_screen;
                var season_id = "";
                var team_uid = "";
                winnerListAry = new Array;
                for (var j = 0; j < xmdObj["game"].length; j++) {
                    var tmp_game = xmdObj["game"][j];
                    var gid = xmlnode.Node(tmp_game, "gid").innerHTML;
                    var gopen = xmlnode.Node(tmp_game, "gopen").innerHTML;
                    if (gopen == "N") if (top.specialGame.isHL) {
                        winner_empty = true;
                        dom.getElementById("winner_scroll").innerHTML = "";
                        dom.getElementById("winner_show").style.display = "none";
                        return
                    } else continue;
                    dom.getElementById("winner_show").style.display =
                        "";
                    xmdObj["rtypes"] = xmlnode.Node(tmp_game, "rtypes", false);
                    for (var z = 0; z < xmdObj["rtypes"].length; z++) {
                        var team_id = xmdObj["rtypes"][z].getAttribute("team_id");
                        if (top.specialGame.isTeam && team_id != top.specialGame.choice_teamID) continue;
                        if ((top.specialGame.choice_teamID == "" || top.specialGame.choice_teamID == null) && util.in_array(team_id, top["specialGame"]["CUP_TEAM_ARY"])) top.specialGame.choice_teamID = team_id;
                        var rtype = xmlnode.Node(xmdObj["rtypes"][z], "rtype").innerHTML;
                        var rtype_name = xmlnode.Node(xmdObj["rtypes"][z],
                            "teams").innerHTML;
                        var ioratio = xmlnode.Node(xmdObj["rtypes"][z], "ioratio").innerHTML;
                        var btnObj = dom.getElementById("cup_btn_" + gid + "_" + gid + "_" + rtype);
                        var nameObj = dom.getElementById("cup_name_" + gid + "_" + gid + "_" + rtype);
                        var betObj = dom.getElementById("cup_bet_" + gid + "_" + gid + "_" + rtype);
                        if (!util_game.checkIoratio(ioratio)) {
                            if (betObj) util.removeEvent(betObj, "click");
                            continue
                        }
                        var obj = new Object;
                        winnerListAry.push("cup_bet_" + gid + "_" + gid + "_" + rtype);
                        obj.gtype = top.choice_gtype;
                        obj.showtype = top.choice_showtype;
                        obj.gid =
                            gid;
                        obj.ecid = gid;
                        obj.rtype = rtype;
                        obj.ioratio = ioratio;
                        obj.rtype_name = rtype_name;
                        obj.team_id = team_id;
                        obj.gameObj = tmp_game;
                        var typeName = "";
                        if (top.specialClick == "special") typeName = "special";
                        if (top.outrightsClick == "outrights") typeName = "outrights";
                        obj.f = util_game.checkBetFrom(typeName, "R");
                        util.addEvent(betObj, "click", _self.clickWinnerList, obj);
                        if (top["specialGame"]["team_sw"] == "N") util.addClass(btnObj, "off"); else if (top["specialGame"]["CUP_TEAM"][team_id] == null || top["specialGame"]["CUP_TEAM"][team_id] ==
                            0) {
                            if (top.specialGame.isHL) {
                                hideCount++;
                                btnObj.style.display = "none"
                            }
                            util.addClass(btnObj, "off")
                        } else {
                            util.removeClass(btnObj, "off");
                            util.addEvent(nameObj, "click", _self.goToTeam, {"team_id": team_id})
                        }
                    }
                }
                util_game.initSelect(util);
                if (ior_all_zero && top.specialGame.isHL) {
                    winner_empty = true;
                    winnerDiv.style.display = "none";
                    return
                }
                util.dragScroll(dom, "winner_scroll", null, null, {"tagName": "winner"});
                var totalCnt = zeroCount + hideCount;
                resizeWinnerCnt = teamCount;
                resizeZeroCnt = totalCnt;
                if (teamCount - totalCnt == 0) {
                    winner_empty =
                        true;
                    winnerDiv.style.display = "none"
                } else if (teamCount - totalCnt <= 4) util.addClass(winnerDiv, "less_show4"); else {
                    util.removeClass(winnerDiv, "less_show4");
                    if (top.specialGame.isHL) {
                        if (getView().viewportwidth >= 840) dom.getElementById("cup_show_more").style.display = teamCount - totalCnt > 16 ? "" : "none"; else if (getView().viewportwidth >= 640) dom.getElementById("cup_show_more").style.display = teamCount - totalCnt > 12 ? "" : "none"; else dom.getElementById("cup_show_more").style.display = "none";
                        util.addEvent(dom.getElementById("cup_show_more"),
                            "click", _self.showWinnerMore, winnerDiv)
                    }
                }
            }
        } else {
            winner_empty = true;
            if (top.specialGame.isTeam) dom.getElementById("widget_show").style.display = "none";
            dom.getElementById("winner_show").style.display = "none";
            return
        }
        if (top.specialGame.winner_sw != "Y" && top.specialGame.isHL) {
            winner_empty = true;
            winnerDiv.style.display = "none";
            return
        }
    };
    _self.clickWinnerList = function (e, obj) {
        var clickObj = e.target;
        for (var i = 0; i < winnerListAry.length; i++) {
            if (winnerListAry[i] == clickObj.id) continue;
            util.removeClass(dom.getElementById(winnerListAry[i]),
                "on")
        }
        if (clickObj.classList.contains("on")) util.removeClass(clickObj, "on"); else util.addClass(clickObj, "on");
        _self.showBetEventFS("click", obj)
    };
    _self.showWinnerMore = function (e, tarObj) {
        if (tarObj.classList.contains("on")) util.removeClass(tarObj, "on"); else util.addClass(tarObj, "on")
    };
    _self.initTab = function () {
        var _mainGameTab = dom.getElementById("cup_main");
        var _pdTab = dom.getElementById("cup_pd");
        util.addEvent(_mainGameTab, "click", _self.chgTab, {"rtype": "r"});
        util.addEvent(_pdTab, "click", _self.chgTab, {"rtype": "pd"})
    };
    _self.chgTab = function (e, param) {
        top.choice_rtype = param.rtype;
        first_OBTMenuBtn = true;
        top["showOBT"] = "";
        _self.chgTabCss(top.choice_rtype);
        if (clusterize_sw && clusterize && param.rtype == "pd") _self.clusterizeDestroy();
        dom.getElementById("div_show").innerHTML = "";
        var cup_game_show = dom.getElementById("cup_game_show");
        _self.showGameLoading(true, "cup");
        _self.getData();
        if (top.choice_rtype == "pd") {
            util.removeClass(cup_game_show, "cup_event_line");
            dom.getElementById("title_fs").style.display = "none";
            dom.getElementById("cup_fs_show").style.display =
                "none";
            dom.getElementById("btn_all_fs").style.display = "none"
        } else {
            util.addClass(cup_game_show, "cup_event_line");
            if (dom.getElementById("cup_fs_show") && dom.getElementById("cup_fs_show").innerHTML != "") {
                dom.getElementById("title_fs").style.display = "";
                dom.getElementById("cup_fs_show").style.display = "";
                dom.getElementById("btn_all_fs").style.display = ""
            }
        }
    };
    _self.goToSpecialFS = function (e) {
        sportFrame.chgTab_league(e, {
            "kind": "fs", "rtype": "fs", "showtype": "early", "page": "league_index", "specialClick": "special",
            "from": "btn_all_fs"
        })
    };
    _self.loadGroupList = function () {
        _self.getCupData_FS("GROUP")
    };
    _self.getCupData_FS = function (type) {
        nowTS = util_game.getTimestamp();
        var param = "";
        var ts = lastClickTS ? lastClickTS : top["lastClickTS"];
        var gtype = top.choice_gtype != "" ? top.choice_gtype.toUpperCase() : postHash["gtype"].toUpperCase();
        param += top.param;
        param += "&p=get_cup_list_FS";
        if (postHash["url_param"]) param += "&" + postHash["url_param"];
        param += "&gtype=" + gtype;
        param += "&cuptype=" + type;
        param += "&special=" + top.specialClick;
        param += "&team_id=" +
            top.specialGame.choice_teamID;
        if (top.specialClick == "special") param += "&fs_count=" + top.specialGame.FS;
        param += "&ts=" + ts;
        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), null);
        hr.setParentclass(childClass);
        hr.addEventListener("onError", _self.onError);
        if (type == "MAIN") hr.addEventListener("LoadComplete", _self.LoadWinnerComplete); else hr.addEventListener("LoadComplete", _self.LoadGroupComplete);
        hr.loadURL(top.m2_url, "POST", param)
    };
    _self.LoadGroupComplete =
        function (xml) {
            var errorMsg = util.showConnectMsg(xml);
            if (util.alertConnectMsg(errorMsg)) {
                dom.getElementById("div_winner").style.display = "none";
                return
            }
            var xmlnode = util.parseXml(xml);
            group_xml = xmlnode;
            var xmdObj = new Object;
            var tmpGPAry = new Array;
            xmdObj["Group"] = xmlnode.Node(xmlnode.Root[0], "Group", false);
            for (var i = 0; i < xmdObj["Group"].length; i++) {
                var tmp_Group = xmdObj["Group"][i];
                var groupID = tmp_Group.getAttribute("id");
                var groupName_c = tmp_Group.getAttribute("name_c");
                var groupName_g = tmp_Group.getAttribute("name_g");
                var groupName_e = tmp_Group.getAttribute("name_e");
                xmdObj["Participant"] = xmlnode.Node(tmp_Group, "Participant", false);
                gpHash[groupID] = new Object;
                gpHash[groupID]["id"] = groupID;
                gpHash[groupID]["groupName_c"] = groupName_c;
                gpHash[groupID]["groupName_g"] = groupName_g;
                gpHash[groupID]["groupName_e"] = groupName_e;
                tmpGPAry.push(groupID);
                sort_partiHash[groupID] = new Object;
                var partiAry = new Array;
                for (var k = 0; k < xmdObj["Participant"].length; k++) {
                    var tmp_parti = xmdObj["Participant"][k];
                    var partiID = tmp_parti.getAttribute("id");
                    var team_id = tmp_parti.getAttribute("team_id");
                    var image_id = tmp_parti.getAttribute("image_id");
                    var team_name_c = tmp_parti.getAttribute("team_name_c");
                    var team_name_g = tmp_parti.getAttribute("team_name_g");
                    var team_name_e = tmp_parti.getAttribute("team_name_e");
                    partiHash[partiID] = new Object;
                    partiHash[partiID]["team_id"] = team_id;
                    partiHash[partiID]["image_id"] = image_id;
                    partiHash[partiID]["team_name_c"] = team_name_c;
                    partiHash[partiID]["team_name_g"] = team_name_g;
                    partiHash[partiID]["team_name_e"] = team_name_e;
                    partiAry.push(partiID)
                }
                sort_partiHash[groupID] = partiAry
            }
            sort_gpAry = tmpGPAry;
            _self.getData();
            return
        };
    _self.goToTeam = function (e, obj) {
        top.specialGame.choice_teamID = obj.team_id;
        var par = new Object;
        par.kind = "teams";
        par.rtype = "r";
        par.showtype = "today";
        par.specialClick = "special";
        par.team_id = top.specialGame.choice_teamID;
        if (!top.specialGame.isTeam) sportFrame.chgTab_league("click", par)
    };
    _self.loadTeamWidget = function (season_id, team_uid) {
        widget_loadDone = false;
        hasWidget = true;
        if (dom.getElementById("loading_info")) dom.getElementById("loading_info").style.display =
            "";
        if (dom.getElementById("loading_leader")) dom.getElementById("loading_leader").style.display = "";
        if (dom.getElementById("loading_preview")) dom.getElementById("loading_preview").style.display = "";
        var par = "";
        var ts = (new Date).getTime();
        var cupData = new Object;
        var from = top.specialGame.isHL ? "highlights" : "teams";
        cupData = {KeyID: KEYID, Gtype: "FT", Lang: top.langx, season_id: season_id, team_uid: team_uid, from: from};
        par += "&uid=" + top["userData"].uid;
        par += "&langx=" + top["userData"].langx;
        par += "&username=" + top["userData"].username;
        par += "&version=" + top.ver;
        var url = util.getProtocal() + "//" + top.mt_domain + "/transform.php?p=getDataCUP" + par;
        mainTimestamp = ts.toString();
        dom.getElementById("widget_show").style.display = "";
        dom.getElementById("widgetFrame").style.display = "";
        dom.getElementById("widgetFrame").onload = function () {
            try {
                echo("load success!!" + "[\u50b3\u905e\u8cc7\u6599]  ==> 456|" + JSON.stringify(cupData));
                dom.getElementById("widgetFrame").contentWindow.postMessage("456|" + JSON.stringify(cupData) + "|" + mainTimestamp, "*")
            } catch (e) {
            }
        };
        dom.getElementById("widgetFrame").contentWindow.location = url
    };
    _self.createSportMenuBak = function () {
        var parentDiv = dom.getElementById("body_show_bak");
        var orgObj = dom.getElementById("sport_content");
        var bakObj = dom.getElementById("sport_content_bak");
        if (bakObj == null) {
            bakObj = dom.createElement("div");
            bakObj.setAttribute("id", "sport_content_bak");
            bakObj.style.display = "none";
            orgObj.parentNode.prepend(bakObj)
        }
    };
    _self.loadSport = function () {
        var param = new Object;
        var ts = lastClickTS ? lastClickTS : top["lastClickTS"];
        param["page"] = "sport_menu";
        param["target"] = "sport_content";
        param["postHash"] = {
            "type": "game",
            "gtype": top.choice_gtype,
            "showtype": top.choice_showtype,
            "rtype": top.choice_rtype,
            "ts": ts
        };
        param["useDefineParent"] = "Y";
        param["parentClass"] = childClass;
        param["retChild"] = _self.retChildSport;
        param["post"] = "gtype=" + top.choice_gtype + "&showtype=" + top.choice_showtype + "&rtype=" + top.choice_rtype;
        param["nowTS"] = ts;
        parentClass.dispatchEvent("goToPage", param)
    };
    _self.retChildSport = function (childObj) {
        sportFrame = childObj;
        try {
            if (top.specialClick == "special") {
                if (top.specialGame.title != "") postHash.specialTitle = top.specialGame.title;
                sportFrame.setTitle("special", {"title": top.specialGame.title});
                sportFrame.showSportMenu({"isShow": false});
                sportFrame.showTeamMenu({"isShow": false});
                if (top.specialGame.isTeam) sportFrame.showTeamMenu({"isShow": true});
                sportFrame.showSelectSort({"isShow": false})
            }
        } catch (e) {
        }
        var obj = win._history[win._history.length - 1];
        _mc["game_loading"] = dom.getElementById("game_loading");
        var chk = _self.chkIsGame();
        if (chk) {
            _self.getModel({"needGet": true});
            _self.createWinnerTimer();
            _self.createGameTimer()
        }
    };
    _self.sportRename = function () {
        var orgObj = dom.getElementById("sport_content");
        var bakObj = dom.getElementById("sport_content_bak");
        if (orgObj == null || orgObj.tagName == null || bakObj == null || bakObj.tagName == null) return;
        var orgName = "sport_content";
        var bakName = "sport_content_bak";
        orgObj.setAttribute("id", bakName);
        bakObj.setAttribute("id", orgName);
        dom.getElementById("sport_content").style.display = "";
        dom.getElementById("sport_content_bak").style.display =
            "none";
        dom.getElementById("sport_content_bak").parentNode.removeChild(dom.getElementById("sport_content_bak"))
    };
    _self.bodyRename = function () {
        var par = new Object;
        par._id = "body_show";
        par.dom = dom;
        parentClass.dispatchEvent("specialRename", par)
    };
    _self.chkIsGame = function () {
        var obj = win._history[win._history.length - 1];
        if (!obj.state.back) return true; else if (obj.page.indexOf("game_list") != -1 || obj.page.indexOf("game_more") != -1) return true; else return false
    };
    _self.initBackCount = function () {
        parentClass.dispatchEvent("initBackCount")
    };
    _self.startTimer = function () {
        if (sportFrame) sportFrame.startTimer()
    };
    _self.clearTimer = function () {
        if (sportFrame) sportFrame.clearTimer()
    };
    _self.internetError = function () {
    };
    _self.bodyGoToPage = function (param) {
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.showAlertMsg = function (param) {
        parentClass.dispatchEvent("showAlertMsg", param)
    };
    _self.retryLoop = function (param) {
        parentClass.dispatchEvent("retryLoop", param)
    };
    _self.retryLastfail = function () {
        parentClass.dispatchEvent("retryLastfail")
    };
    _self.retryComplete =
        function () {
            parentClass.dispatchEvent("retryComplete")
        };
    _self.chgTabCss = function (_rtype) {
        for (var i = 0; i < TAB_ary.length; i++) {
            var tmpObj = dom.getElementById("cup_" + TAB_ary[i]);
            if (tmpObj != null) util.removeClass(tmpObj, "on")
        }
        var tmpRtype = _rtype != "pd" && _rtype != "rpd" ? "main" : "pd";
        var obj = dom.getElementById("cup_" + tmpRtype);
        if (obj) util.addClass(obj, "on")
    };
    _self.useClusterize = function (total_h, _blockHeight, _blockNum) {
        clusterize = new Clusterize({
            scrollId: "body_show",
            contentId: "div_show",
            rows_in_block: config_set.get("CLUSTERIZE_ROW"),
            blocks_in_cluster: config_set.get("CLUSTERIZE_BLOCKS"),
            block_limit_height_S: config_set.get("CLUSTERIZE_LIMIT_S"),
            block_limit_height_M: config_set.get("CLUSTERIZE_LIMIT_M"),
            block_limit_height_L: config_set.get("CLUSTERIZE_LIMIT_L"),
            callbacks: {clusterChanged: _self.changeFunc}
        });
        clusterize.update(rowAry, total_h, _blockHeight, _blockNum)
    };
    _self.changeFunc = function () {
        clusterChg = true;
        if (OBT_closed != "" && top.choice_gtype == "ft") _self.close_obt_proc(OBT_closed);
        var _xmdObj = new Object;
        var tmpEcAry = new Object;
        var tmpMenuAry =
            new Object;
        _xmdObj["ec"] = _xmlnode.Node(_xmlnode.Root[0], "ec", false);
        var _s, _e;
        _s = 0;
        _e = _xmdObj["ec"].length;
        if (top.choice_gtype == "ft") _self.setRP3Ary(_xmdObj, _s, _e);
        _self.initLeague(FantasyAry);
        _self.initInfoBtn(_xmlnode, _xmdObj["ec"]);
        _self.initIorBtn(_xmlnode, _xmdObj["ec"]);
        if (top.specialGame.isHL) _self.initGroupBtn(group_xml);
        if (!hasPD && top.choice_gtype == "ft") _self.initOBTMenuBtn(_xmlnode, _xmdObj["ec"]); else _self.initPDbtn(_xmlnode, _xmdObj["ec"]);
        for (var j = _s; j < _e; j++) {
            var tmp_ec = _xmdObj["ec"][j];
            var ECID = tmp_ec.getAttribute("id").replace(/ec/, "");
            tmpEcAry[ECID] = ecidScrollHash[ECID] ? ecidScrollHash[ECID] : 0;
            tmpMenuAry[ECID] = menuScrollHash[ECID] ? menuScrollHash[ECID] : 0
        }
        _self.loadScroll(tmpEcAry, tmpMenuAry);
        chgColorIor = util_game.chgIorColor(dom, util, chgColorIor);
        util_game.initSelect(util);
        _self.showGameLoading(false)
    };
    _self.updateOBTRowData = function (action, _html) {
        var _ECID = top["showOBT"].split("_")[0];
        var pageIndex = top["showOBT"].split("_")[2];
        var gameIndex = top["showOBT"].split("_")[3];
        if (action ==
            "add") {
            var clone_show = dom.getElementById("clone_obt_show");
            clone_show.innerHTML = _html;
            _lastOBTHeight = clone_show.offsetHeight * 1;
            blockHeight[pageIndex] += _lastOBTHeight;
            clone_show.innerHTML = "";
            var tmpGameStr = rowAry[gameIndex];
            var tmpGame = dom.createElement("div");
            tmpGame.innerHTML = tmpGameStr;
            var objids = ",div_OBT_show_" + _ECID + ",OBT_close_" + _ECID + ",";
            var ary = util.getObjAry(tmpGame, objids);
            if (ary["div_OBT_show_" + _ECID] && ary["OBT_close_" + _ECID]) {
                ary["OBT_close_" + _ECID].style.display = "";
                ary["div_OBT_show_" +
                _ECID].style.display = "";
                ary["div_OBT_show_" + _ECID].innerHTML = _html;
                rowAry[gameIndex] = tmpGame.innerHTML
            }
        } else if (action == "remove") {
            blockHeight[pageIndex] -= _lastOBTHeight;
            clusterize.updateDOM(pageIndex, _lastOBTHeight * -1);
            var tmpGameStr = rowAry[gameIndex];
            var tmpGame = dom.createElement("div");
            tmpGame.innerHTML = util_game.showTxt(tmpGameStr);
            var objids = ",div_OBT_show_" + _ECID + ",OBT_close_" + _ECID + ",";
            var ary = util.getObjAry(tmpGame, objids);
            if (ary["div_OBT_show_" + _ECID] && ary["OBT_close_" + _ECID]) {
                ary["OBT_close_" +
                _ECID].style.display = "none";
                ary["div_OBT_show_" + _ECID].style.display = "none";
                ary["div_OBT_show_" + _ECID].innerHTML = "";
                rowAry[gameIndex] = tmpGame.innerHTML
            }
            _lastOBTHeight = 0
        }
        var total_height = util.sumArrayVal(blockHeight);
        clusterize.updateRowHeight(rowAry, total_height, blockHeight)
    };
    var _body = dom.getElementById("body_show");
    var isScrolled = false;
    _self.lockHorizontalScroll = function () {
        util.addEvent(_body, "touchstart", _self.touchStart);
        util.addEvent(_body, "touchmove", _self.tocuchMove);
        util.addEvent(_body, "touchend",
            _self.tocuchEnd)
    };
    _self.removeTouch = function () {
        util.removeEvent(_body, "touchstart", _self.touchStart);
        util.removeEvent(_body, "touchmove", _self.tocuchMove);
        util.removeEvent(_body, "touchend", _self.tocuchEnd)
    };
    var touchStartPosY = 0;
    var touchTarget = null;
    _self.touchStart = function (e) {
        var start_touch = e.touches[0];
        touchStartPosY = Number(start_touch.pageY);
        var tarObj = e.target;
        touchTarget = _self.getParent(tarObj);
        if (touchTarget == null) return;
        var tmpID = touchTarget.getAttribute("id");
        var needScroll = tmpID != null && (tmpID.indexOf("ratioShow") !=
            -1 || tmpID.indexOf("div_OBT_menu") != -1);
        if (needScroll && touchTarget.classList.contains("box_lebet_lock")) touchTarget.classList.remove("box_lebet_lock")
    };
    _self.getParent = function (targetObj) {
        var tmpObj = targetObj;
        if (typeof tmpObj.getAttribute == "undefined") return null;
        var tmpID = tmpObj.getAttribute("id");
        var isStop = tmpID != null && (tmpID.indexOf("ratioShow") != -1 || tmpID.indexOf("mainShow") != -1 || tmpID.indexOf("div_OBT_menu") != -1 || tmpID.indexOf("div_show") != -1);
        if (!isStop) return _self.getParent(tmpObj.parentNode);
        return tmpObj
    };
    _self.tocuchMove = function (e) {
        if (!isScrolled) {
            var diffY = touchStartPosY * 1 - e.touches[0].pageY * 1;
            var vertical = Math.abs(diffY) > 50;
            var tmpID = touchTarget.getAttribute("id");
            var needScroll = tmpID != null && (tmpID.indexOf("ratioShow") != -1 || tmpID.indexOf("div_OBT_menu") != -1);
            if (needScroll && vertical && !touchTarget.classList.contains("box_lebet_lock")) {
                touchTarget.classList.add("box_lebet_lock");
                isScrolled = true
            }
        }
    };
    _self.tocuchEnd = function (e) {
        isScrolled = false
    };
    _self.getTimerSec = function () {
        var isSpecialGame =
            top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        var st = isSpecialGame == "Y" ? "special" : top.choice_showtype;
        var hash = new Object;
        hash[st] = 6E5;
        hash["live"] = config_set.get("CONFIG_LIVE_GAME_LIST");
        hash["today"] = config_set.get("CONFIG_GAME_LIST");
        hash["early"] = hash["today"];
        hash["parlay"] = config_set.get("CONFIG_PARLAY_GAME_LIST");
        hash["mygame"] = config_set.get("CONFIG_MYGAME_GAME_LIST");
        hash["special"] = config_set.get("CONFIG_LIVE_GAME_LIST");
        return hash[st]
    };
    _self.createGameTimer =
        function () {
            parentClass.dispatchEvent("resetHeaderTimer", "clear");
            if (timerHash["gameTimer"] != null) return;
            var sec = _self.getTimerSec();
            echo("[game_list][createGameTimer]sec=" + sec);
            timerHash["gameTimer"] = new Timer(sec);
            timerHash["gameTimer"].setParentclass(_self);
            timerHash["gameTimer"].init();
            timerHash["gameTimer"].addEventListener("TimerEvent.TIMER", _self.gameTimerRun);
            timerHash["gameTimer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.gameTimerFinish);
            timerHash["gameTimer"].startTimer()
        };
    _self.clearGameTimer =
        function () {
            if (timerHash != null) if (timerHash["gameTimer"] != null) {
                timerHash["gameTimer"].clearObj();
                timerHash["gameTimer"].is_clear = true;
                timerHash["gameTimer"] = null
            }
            return true
        };
    _self.gameTimerRun = function (count) {
        if (top.specialClick == "special") sportFrame.getSpecCount("get_game_list"); else if (postHash["rtype"] == "fs") _self.getData_FS(); else _self.getData()
    };
    _self.getSpecialData = function () {
        if (postHash["rtype"] == "fs") _self.getData_FS(); else {
            if (top.specialGame.isTeam && top.specialGame.team_sw != "Y") {
                winner_empty =
                    true;
                game_empty = true;
                fs_empty = true;
                _self.showNoData(true);
                if (dom.getElementById("cup_touch_div_320")) dom.getElementById("cup_touch_div_320").style.display = "none";
                if (dom.getElementById("cup_touch_div_640")) dom.getElementById("cup_touch_div_640").style.display = "none";
                if (dom.getElementById("winner_show")) dom.getElementById("winner_show").style.display = "none";
                if (dom.getElementById("team_menu_show")) dom.getElementById("team_menu_show").style.display = "none";
                if (dom.getElementById("widget_show")) dom.getElementById("widget_show").style.display =
                    "none";
                if (dom.getElementById("title_fs")) dom.getElementById("title_fs").style.display = "none";
                if (dom.getElementById("cup_fs_show")) dom.getElementById("cup_fs_show").style.display = "none";
                if (dom.getElementById("btn_all_fs")) dom.getElementById("btn_all_fs").style.display = "none";
                _self.showGameLoading(false);
                return
            }
            if (top.specialGame.isTeam && (top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] == null || top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] == 0)) if (top["specialGame"]["CUP_TEAM_ARY"].length ==
                0) {
                winner_empty = true;
                game_empty = true;
                fs_empty = true;
                _self.showNoData(true);
                try {
                    sportFrame.setTitle("special", {"title": ""})
                } catch (e) {
                    console.log(e)
                }
                if (dom.getElementById("cup_touch_div_320")) dom.getElementById("cup_touch_div_320").style.display = "none";
                if (dom.getElementById("cup_touch_div_640")) dom.getElementById("cup_touch_div_640").style.display = "none";
                if (dom.getElementById("winner_show")) dom.getElementById("winner_show").style.display = "none";
                if (dom.getElementById("team_menu_show")) dom.getElementById("team_menu_show").style.display =
                    "none";
                if (dom.getElementById("widget_show")) dom.getElementById("widget_show").style.display = "none";
                if (dom.getElementById("title_fs")) dom.getElementById("title_fs").style.display = "none";
                if (dom.getElementById("cup_fs_show")) dom.getElementById("cup_fs_show").style.display = "none";
                if (dom.getElementById("btn_all_fs")) dom.getElementById("btn_all_fs").style.display = "none";
                _self.showGameLoading(false)
            } else {
                _self.parseWinnerList(top.specialGame.winnerXml);
                _self.loadTeamMenu();
                if (top.choice_rtype != "pd") _self.getData_FS();
                _self.getData()
            } else {
                _self.parseWinnerList(top.specialGame.winnerXml);
                if (top.specialGame.isTeam) _self.loadTeamMenu();
                if (top.choice_rtype != "pd") _self.getData_FS();
                if (top.specialGame.isHL) _self.loadGroupList(); else _self.getData()
            }
        }
    };
    _self.gameTimerFinish = function (count) {
    };
    _self.getModel = function (_par) {
        if (_par.postHash) postHash = _par.postHash;
        if (page_sw) page_no = 1;
        if (clusterize_sw && clusterize) _self.clusterizeDestroy();
        _self.showGameLoading(true);
        var tab_block_sw = config_set.get("TAB_BLOCK_SW");
        if (tab_block_sw) {
            newTS =
                util_game.getTimestamp();
            var sec_diff = Math.abs(newTS - oldTS);
            var min = 300;
            var max = 600;
            var randomTime = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!_par.kind) if (sec_diff < 3E3 && oldRtype == top.choice_rtype) {
                setTimeout(_self.showGameLoading, randomTime, false);
                return
            } else {
                oldTS = newTS;
                oldRtype = top.choice_rtype
            }
        }
        dom.getElementById("main_content").style.display = "";
        firstLoad = true;
        first_no_tvmt = false;
        first_OBTMenuBtn = true;
        first_Clusterize = true;
        top["notShowLeg"] = new Object;
        top["notShowLegGame"] = new Object;
        clickedHash =
            new Object;
        _self.chgTabCss(top.choice_rtype);
        var param = new Object;
        var showtype = _par.showtype ? _par.showtype : top.choice_showtype;
        var rtype = _par.rtype ? _par.rtype : top.choice_rtype;
        var isSpecial = top.specialClick != "" ? "Y" : "N";
        var isFantasy = top.specialGame.isFantasy ? "Y" : "N";
        var isHL = top.specialGame.isHL ? "Y" : "N";
        var isTeam = top.specialGame.isTeam ? "Y" : "N";
        param["post"] = "gtype=" + top.choice_gtype + "&showtype=" + showtype + "&rtype=" + rtype + "&isSpecial=" + isSpecial + "&isFantasy=" + isFantasy + "&isHL=" + isHL + "&isTeam=" + isTeam;
        param["page"] = "gameModel";
        param["target"] = "main_content";
        param["retFun"] = function () {
            if (postHash["rtype"] == "fs") _self.getModelComplete_FS(_par); else _self.getModelComplete(_par)
        };
        param["noCache"] = "Y";
        parentClass.dispatchEvent("goToPage", param)
    };
    _self.getModelComplete = function (par) {
        if (page_sw && !isIOS) {
            pageObj = new pagination(win, dom);
            pageObj.setParentclass(this);
            pageObj.init();
            pageObj.bindBtn(_self.goPage)
        }
        if (top.specialGame.isHL) _self.loadAD();
        _self.parseWinnerList(top.specialGame.winnerXml);
        if (top.specialGame.isTeam) _self.loadTeamMenu();
        _self.initTab();
        _self.getData_FS();
        if (par.needGet) {
            top.rightNowPlay = "";
            top.showOBT = "";
            top.rightGtype = top.choice_gtype;
            top.rightShowType = top.choice_showtype;
            if (top.choice_rtype.indexOf("pd") == -1 && getView().viewportwidth >= 1024) {
                if (top.specialGame.isHL && top.choice_rtype != "pd") parentClass.dispatchEvent("loadRightScore", {"scFun": _self.loadGroupList}); else parentClass.dispatchEvent("loadRightScore", {"scFun": _self.getData});
                dom.getElementById("right_show").scrollTop = 0
            } else if (top.specialGame.isHL && top.choice_rtype !=
                "pd") _self.loadGroupList(); else _self.getData()
        }
    };
    _self.getNowPage = function () {
        var tmpPage = "";
        if (win._history.length != 0) tmpPage = win._history[win._history.length - 1].page;
        return tmpPage
    };
    _self.getData = function () {
        if (page_sw) var tmpPageNo = isIOS ? 0 : page_no;
        parentClass.dispatchEvent("initMyGame", {});
        nowTS = util_game.getTimestamp();
        var tmp_date = postHash["date"];
        if (tmp_date == null) tmp_date = "";
        var isSpecial = top.specialClick ? top.specialClick : "";
        var isFantasy = postHash["kind"] == "fantasy" ? "Y" : "N";
        var param = "";
        var ts =
            lastClickTS ? lastClickTS : top["lastClickTS"];
        var gtype = top.choice_gtype != "" ? top.choice_gtype : postHash["gtype"];
        var team_id = top.specialGame.isTeam ? top.specialGame.choice_teamID : "";
        sort_type = top["specialGame"]["period"] == "IN" ? "T" : "L";
        param += top.param;
        param += "&p=get_cup_list";
        param += "&p3type=" + (postHash["p3type"] || "");
        param += "&date=" + tmp_date;
        if (postHash["url_param"]) param += "&" + postHash["url_param"];
        param += "&gtype=" + gtype;
        param += "&showtype=" + top.choice_showtype;
        param += "&rtype=" + top.choice_rtype;
        param +=
            "&ltype=" + top["userData"].ltype;
        if (_self.paramHash["lid"]) param += "&lid=" + _self.paramHash["lid"];
        if (_self.paramHash["action"]) param += "&action=" + _self.paramHash["action"];
        param += "&sorttype=" + sort_type;
        param += "&specialClick=" + isSpecial;
        param += "&isFantasy=" + isFantasy;
        param += "&team_id=" + team_id;
        param += "&ts=" + ts;
        if (page_sw) param += "&page_no=" + tmpPageNo;
        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), null);
        hr.setParentclass(childClass);
        hr.addEventListener("onError",
            _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadGameComplete);
        hr.loadURL(top.m2_url, "POST", param)
    };
    _self.LoadGameComplete = function (xml) {
        if (top.checkBackPage == "checking") {
            top.checkBackPage = "";
            return
        }
        var tmp_xml;
        _self.paramHash["errorMsg"] = util.showConnectMsg(xml);
        if (util.alertConnectMsg(_self.paramHash["errorMsg"])) {
            _self.showNoData(true);
            _self.showGameLoading(false);
            parentClass.dispatchEvent("showLoading", {"isShow": false});
            return
        }
        if (top.specialClick == "special") if (top.choice_rtype == "fs") return;
        tmp_xml = util.parseXml(xml);
        _xmlnode = tmp_xml;
        var ecObj = _xmlnode.Node(_xmlnode.Root[0], "ec", false);
        var nowShowtype = _xmlnode.Node(_xmlnode.Root[0], "nowShowtype").innerHTML;
        _self.parseData(tmp_xml);
        if (top.specialClick != "") {
            if (!util.in_array(nowShowtype, specialShowtype)) return
        } else if (nowShowtype != top.choice_showtype) return
    };
    _self.parseData = function (xmlnode) {
        var _header = "";
        var xmdObj = new Object;
        xmdObj["ec"] = xmlnode.Node(xmlnode.Root[0], "ec", false);
        var specialTitle = top.specialGame.title;
        var tmpTS = xmlnode.Node(xmlnode.Root[0],
            "ts").innerHTML;
        var tmpMyGameRtype = xmlnode.Node(xmlnode.Root[0], "mygame_rtype").innerHTML;
        var chkMyGameRtype = top.choice_showtype == "mygame" && top.choice_rtype != tmpMyGameRtype;
        var isALL = postHash["lid"] == "";
        if (postHash["headertype"] != null) switch (postHash["headertype"]) {
            case "coupon":
                _header = postHash["headername"];
                break;
            case "mycoupon":
                _header = LS.get(postHash["headertype"]);
                break;
            case "league":
                _header = postHash["headername"];
                if (!isIOS || !isALL) sportFrame.showSelectSort({"isShow": false});
                break;
            default:
                _header =
                    postHash["headername"];
                break
        }
        try {
            if (top.specialClick == "special") {
                if (top.specialGame.title != "") postHash.specialTitle = top.specialGame.title;
                sportFrame.setTitle("special", {"title": specialTitle});
                sportFrame.showSportMenu({"isShow": false});
                sportFrame.showTeamMenu({"isShow": false});
                if (top.specialGame.isTeam) sportFrame.showTeamMenu({"isShow": true});
                sportFrame.showSelectSort({"isShow": false})
            }
        } catch (e) {
        }
        if (top.specialGame.isTeam && top.specialGame.team_sw != "Y") {
            winner_empty = true;
            game_empty = true;
            fs_empty = true;
            _self.showNoData(true);
            if (dom.getElementById("cup_touch_div_320")) dom.getElementById("cup_touch_div_320").style.display = "none";
            if (dom.getElementById("cup_touch_div_640")) dom.getElementById("cup_touch_div_640").style.display = "none";
            if (dom.getElementById("winner_show")) dom.getElementById("winner_show").style.display = "none";
            if (dom.getElementById("team_menu_show")) dom.getElementById("team_menu_show").style.display = "none";
            if (dom.getElementById("widget_show")) dom.getElementById("widget_show").style.display =
                "none";
            if (dom.getElementById("title_fs")) dom.getElementById("title_fs").style.display = "none";
            if (dom.getElementById("cup_fs_show")) dom.getElementById("cup_fs_show").style.display = "none";
            if (dom.getElementById("btn_all_fs")) dom.getElementById("btn_all_fs").style.display = "none";
            _self.showGameLoading(false);
            parentClass.dispatchEvent("showLoading", {"isShow": false});
            return
        }
        if (top.specialGame.isTeam && (top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] == null || top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] ==
            0)) if (top["specialGame"]["CUP_TEAM_ARY"].length == 0) {
            parentClass.dispatchEvent("showLoading", {"isShow": false});
            return
        }
        if (xmdObj["ec"].length > 0) {
            game_empty = false;
            _self.showNoData(false);
            var showScroll = dom.getElementById("body_show");
            util.addEvent(showScroll, "scroll", _self.obtFirstCheck)
        } else {
            top["showOBT"] = "";
            game_empty = true;
            _self.showNoData(true);
            _self.noDataProc();
            return
        }
        if (worker_sw && window.Worker) {
            _self.workerPost(_worker, {"action": "getCupData", "xml": _xmlnode, "group_xml": group_xml});
            return
        }
    };
    _self.obtFirstCheck =
        function (e) {
            if (first_OBTMenuBtn) first_OBTMenuBtn = false
        };
    _self.getScDataObj = function (tmp_game, mainGame, showtype) {
        var obj = new Object;
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        var nowShowtype = showtype ? showtype : top.choice_showtype;
        obj.mainGame = mainGame;
        obj.LS_game = LS_game;
        obj.nowMode = tmp_game["now_model"];
        obj.gtype = top.choice_gtype;
        if (nowShowtype == "mygame" || isSpecialGame == "Y") obj.showtype = util_game.transMyGameShowtype(tmp_game["myGame"]); else obj.showtype =
            nowShowtype;
        obj.isRB = tmp_game["is_rb"] ? tmp_game["is_rb"] : "";
        obj.gopen = "Y";
        obj.Live = "Y";
        obj.league = tmp_game["league"];
        obj.team_h = tmp_game["team_h"];
        obj.team_c = tmp_game["team_c"];
        obj.def_league = tmp_game["league"];
        obj.def_team_h = tmp_game["team_h"];
        obj.def_team_c = tmp_game["team_c"];
        obj.limit_min = tmp_game["par_minlimit"];
        obj.OuterOpen = "Y";
        if (tmp_game["datetime"] != null && tmp_game["datetime"] != "") {
            var gmt = new Date(tmp_game["systime"].replace(/-/g, "/"));
            var now_m = parseInt(gmt.getMonth() + 1);
            var game_m = parseInt(tmp_game["datetime"].split("-")[0]);
            if (now_m > game_m) gmt.setFullYear(gmt.getFullYear() + 1);
            var y = gmt.getFullYear();
            var tmpDate = tmp_game["datetime"].split(" ")[0];
            var tmpTime = tmp_game["datetime"].split(" ")[1];
            tmpTime = _self.get24Hours(y + "-" + tmp_game["datetime"]);
            var str_M = tmpDate.split("-")[0];
            var str_D = tmpDate.split("-")[1];
            var str_H = tmpTime.split(":")[0];
            var str_Min = tmpTime.split(":")[1];
            var isToday = util_game.isToday(y + "-" + tmpDate);
            obj.newDatetime = isToday ? str_H + ":" + str_Min : str_D + " / " + str_M + "<b></b>" + tmpTime
        } else obj.newDatetime = "";
        obj.from = "game_list";
        obj.ptype = tmp_game["ptype"];
        if (top.choice_gtype == "ft") if (obj.team_h.indexOf("[Mid]") != -1 || obj.team_h.indexOf("[\u4e2d]") != -1) {
            obj.team_h = _self.replaceMidfield(obj.team_h);
            obj.midfield = "Y"
        } else obj.midfield = "N"; else {
            obj.midfield = tmp_game["midfield"].indexOf("[Mid]") != -1 || tmp_game["midfield"].indexOf("[\u4e2d]") != -1 ? "Y" : "N";
            if (obj.ptype != "") {
                obj.team_h = obj.team_h + obj.ptype;
                obj.def_team_h = obj.def_team_h + obj.ptype;
                obj.team_c = obj.team_c + obj.ptype;
                obj.def_team_c = obj.def_team_c + obj.ptype
            }
        }
        switch (top.choice_gtype) {
            case "ft":
                obj.score_h =
                    tmp_game["score_h"];
                obj.score_c = tmp_game["score_c"];
                obj.score_new = "";
                obj.redcard_h = tmp_game["redcard_h"];
                obj.redcard_c = tmp_game["redcard_c"];
                obj.re_time = tmp_game["retimeset"];
                obj.nowGoal = tmp_game["nowset"];
                obj.endGame = tmp_game["end_game"];
                obj.pk_method = tmp_game["pk_method"];
                obj.FTscoreH = tmp_game["ft_scroe_h"];
                obj.FTscoreC = tmp_game["ft_scroe_c"];
                obj.pfcolor_h = tmp_game["pfcolor_h"];
                obj.pfcolor_c = tmp_game["pfcolor_c"];
                if (obj.ptype != null && obj.nowMode.match(/^(PK|PKOU|PKR|ET)$/g)) {
                    obj.team_h = obj.team_h.split(" ")[0];
                    obj.team_c = obj.team_c.split(" ")[0]
                }
                break;
            case "bk":
                var t_count = tmp_game["lasttime"];
                if (isNaN(t_count) || t_count < 0) t_count = 0;
                var TimeM = Math.floor(t_count / 60);
                var TimeS = t_count % 60;
                if (TimeM < 10) TimeM = "0" + TimeM;
                if (TimeS < 10) TimeS = "0" + TimeS;
                t_count = TimeM + ":" + TimeS;
                obj.t_count = t_count;
                var se_now = "";
                if (tmp_game["now_model"] == "QT") se_now = tmp_game["ms_se"]; else if (tmp_game["now_model"] == "HV") se_now = tmp_game["half_se"]; else if (tmp_game["now_model"] == "OT") se_now = "OT";
                var se_now_str = "";
                if (se_now == "HT") se_now_str =
                    "1H"; else if (se_now == "H2") se_now_str = "2H"; else se_now_str = se_now;
                obj.se_now_str = se_now_str;
                obj.se_now = se_now;
                var se_num = se_now != "" ? se_now.substr(1, 1) * 1 : "";
                if (se_now == "HT") se_num = 1;
                obj.se_num = se_num;
                var bk_model = tmp_game["now_model"];
                var se_str = new Object;
                se_str["QT"] = "Quarters";
                se_str["HV"] = "Halves";
                se_str["OT"] = "OT";
                obj.se_type = tmp_game["se_type"];
                obj.HalfTime = tmp_game["halftime"];
                obj.score_H_FT = tmp_game["score_h"];
                obj.score_A_FT = tmp_game["score_c"];
                break;
            case "bs":
                obj.part = tmp_game["part"];
                obj.game_H =
                    tmp_game["score_h"];
                obj.game_A = tmp_game["score_c"];
                obj.overT_H = tmp_game["sc_ot_h"];
                obj.overT_A = tmp_game["sc_ot_a"];
                obj.over_H = tmp_game["sc_ov_h"];
                obj.over_A = tmp_game["sc_ov_a"];
                obj.out_count = tmp_game["outcount"];
                obj.base_1B = tmp_game["base_1b"];
                obj.base_2B = tmp_game["base_2b"];
                obj.base_3B = tmp_game["base_3b"];
                break;
            case "bm":
                var best = tmp_game["best"];
                var playSet = best.split(" ");
                var max_set = playSet[2] * 1;
                var playDeuce = playSet[3] != null;
                obj.max_set = max_set;
                obj.playDeuce = playDeuce;
                obj.sc_game_H = tmp_game["scoreseth"];
                obj.sc_game_A = tmp_game["scoresetc"];
                obj.server_sw = tmp_game["nowserver"];
                break;
            case "op":
                obj.score_h = tmp_game["score_h"];
                obj.score_c = tmp_game["score_c"];
                break;
            case "sk":
                obj.score_h = tmp_game["score_h"];
                obj.score_c = tmp_game["score_c"];
                obj.best = tmp_game["best"];
                obj.mode = tmp_game["best_mode"].split(" ");
                break;
            case "tn":
                var best = tmp_game["best"];
                var max_set = best.substr(best.length - 1, 1) * 1;
                obj.max_set = max_set;
                obj.sc_set_H = tmp_game["scoreseth"];
                obj.sc_set_A = tmp_game["scoresetc"];
                obj.server_sw = tmp_game["nowserver"];
                obj.sc_game_H = tmp_game["scorepointh"];
                obj.sc_game_A = tmp_game["scorepointc"];
                obj.w_delay = tmp_game["showdelay"];
                break;
            case "tt":
            case "vb":
                var best = tmp_game["best"];
                var max_set = best.substr(best.length - 1, 1) * 1;
                obj.max_set = max_set;
                obj.sc_game_H = tmp_game["scoreseth"];
                obj.sc_game_A = tmp_game["scoresetc"];
                obj.server_sw = tmp_game["nowserver"];
                break;
            default:
                obj.score_h = tmp_game["score_h"];
                obj.score_c = tmp_game["score_c"];
                obj.score_new = "";
                obj.redcard_h = tmp_game["redcard_h"];
                obj.redcard_c = tmp_game["redcard_c"];
                obj.re_time =
                    tmp_game["retimeset"];
                break
        }
        return obj
    };
    _self.workerPost = function (WORKER, parObj) {
        var xml = parObj["xml"];
        var groupXml = parObj["group_xml"];
        var GameHash = util_game.convertNodeToHashForGame(xml.Root[0]);
        if (groupXml != null) {
            var groupHash = util_game.convertNodeToHashForGroupGame(groupXml.Root[0]);
            var groupDataHash = groupHash["obj"]
        }
        var dataHash = GameHash["obj"];
        var xmlHash = GameHash["xmlObj"];
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        var rightTV = new Object;
        var rightMT = new Object;
        var tv_ecidAry = new Object;
        var mt_ecidAry = new Object;
        var nowShowtype = _xmlnode.Node(xml.Root[0], "nowShowtype").innerHTML;
        my_rightTVAry = new Array;
        for (var _key in dataHash) {
            var tmp_game = dataHash[_key];
            if (nowShowtype != "parlay") {
                var ior_ary = [["reh", "rec"], ["rouh", "rouc"], ["hreh", "hrec"], ["hrouh", "hrouc"], ["rouho", "rouhu"], ["rouco", "roucu"], ["rshy", "rshn"], ["rscy", "rscn"], ["rh", "rc"], ["ouh", "ouc"], ["hrh", "hrc"], ["houh", "houc"]];
                for (var k = 0; k < ior_ary.length; k++) {
                    var tmpAry = ior_ary[k];
                    if (tmp_game["ior_" + tmpAry[0]] != "" && tmp_game["ior_" + tmpAry[1]] != "") {
                        var ior_h = tmp_game["ior_" + tmpAry[0]];
                        var ior_c = tmp_game["ior_" + tmpAry[1]];
                        var hash_hc = util_game.chgOddfIoratio(ior_h, ior_c, config_ior);
                        if (!isNaN(hash_hc[0])) dataHash[_key]["ior_" + tmpAry[0]] = hash_hc[0];
                        if (!isNaN(hash_hc[1])) dataHash[_key]["ior_" + tmpAry[1]] = hash_hc[1]
                    }
                }
            }
            if (!first_no_tvmt && !top.choice_rtype.match("pd")) {
                var ecid = tmp_game["ecid"];
                var ph_sw = tmp_game["tv_ph_sw"];
                var eventid = tmp_game["eventid"];
                var mtid = tmp_game["mt_id"];
                var hasTV = typeof eventid != "undefined" && eventid != "" && eventid != "0" && ph_sw == "Y";
                var hasMT = typeof mtid != "undefined" && mtid != "" && mtid != "0";
                var isRB = tmp_game["is_rb"] == "Y" && nowShowtype == "parlay" || nowShowtype == "live" ? "Y" : "N";
                if (nowShowtype == "mygame" || top.specialClick != "") {
                    var tmpShowType = util_game.transMyGameShowtype(tmp_game["myGame"]);
                    if (tmpShowType == "live") isRB = "Y"
                } else var tmpShowType = nowShowtype;
                if (hasTV) {
                    if (rightTV["ecid"] == "" || rightTV["ecid"] == undefined) {
                        rightTV["key"] = _key;
                        rightTV["ecid"] = ecid;
                        rightTV["data"] =
                            tmp_game;
                        rightTV["hasTV"] = hasTV;
                        rightTV["hasMT"] = hasMT;
                        rightTV["isRB"] = isRB;
                        rightTV["rightShowType"] = tmpShowType
                    }
                    tv_ecidAry[tmp_game["ecid"]] = true
                }
                if (hasMT) {
                    if (rightMT["ecid"] == "" || rightMT["ecid"] == undefined) {
                        rightMT["key"] = _key;
                        rightMT["ecid"] = ecid;
                        rightMT["data"] = tmp_game;
                        rightMT["hasTV"] = hasTV;
                        rightMT["hasMT"] = hasMT;
                        rightMT["isRB"] = isRB;
                        rightMT["rightShowType"] = tmpShowType
                    }
                    mt_ecidAry[tmp_game["ecid"]] = true
                }
                if (hasTV || hasMT) {
                    my_rightTV[tmp_game["ecid"]] = new Object;
                    my_rightTV[tmp_game["ecid"]]["key"] =
                        _key;
                    my_rightTV[tmp_game["ecid"]]["ecid"] = ecid;
                    my_rightTV[tmp_game["ecid"]]["data"] = tmp_game;
                    my_rightTV[tmp_game["ecid"]]["hasTV"] = hasTV;
                    my_rightTV[tmp_game["ecid"]]["hasMT"] = hasMT;
                    my_rightTV[tmp_game["ecid"]]["isRB"] = isRB;
                    my_rightTV[tmp_game["ecid"]]["rightShowType"] = tmpShowType;
                    my_rightTV[tmp_game["ecid"]]["dataHash"] = dataHash;
                    my_rightTV[tmp_game["ecid"]]["xmlHash"] = xmlHash;
                    my_rightTVAry.push(tmp_game["ecid"])
                }
            }
        }
        nowGameHash = util.clone(dataHash);
        if (!first_no_tvmt && !top.choice_rtype.match("pd")) if (top.rightNowPlay ==
            "") {
            if (top.rightECID != "") parentClass.dispatchEvent("resetRightTV", {});
            if (rightTV["ecid"] != "" && rightTV["ecid"] != undefined) {
                top.rightECID = rightTV["ecid"];
                top.rightGtype = top.choice_gtype;
                top.rightNowPlay = "TV";
                top.rightRB = rightTV["isRB"];
                top.rightShowType = rightTV["rightShowType"];
                parentClass.dispatchEvent("setRightLoading", {"isShow": true});
                if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("setRightTVDefaultPlay", rightTV)
            } else if (rightMT["ecid"] != "" && rightMT["ecid"] != undefined) {
                top.rightECID =
                    rightMT["ecid"];
                top.rightGtype = top.choice_gtype;
                top.rightNowPlay = "MT";
                top.rightRB = rightMT["isRB"];
                top.rightShowType = rightMT["rightShowType"];
                parentClass.dispatchEvent("setRightLoading", {"isShow": true});
                if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("setRightTVDefaultPlay", rightMT)
            } else {
                first_no_tvmt = true;
                top.rightNowPlay = "";
                top.rightECID = "";
                top.rightGtype = "";
                top.rightRB = "";
                top.rightShowType = "";
                parentClass.dispatchEvent("setRightVisible", {"isShow": false})
            }
        } else if (top.rightNowPlay == "TV") if (!tv_ecidAry[top.rightECID]) if (rightTV["ecid"] ==
            undefined || rightTV["ecid"] == "") if (rightMT["ecid"] != undefined && rightMT["ecid"] != "") {
            top.rightECID = rightMT["ecid"];
            top.rightGtype = top.choice_gtype;
            top.rightNowPlay = "MT";
            top.rightRB = rightMT["isRB"];
            top.rightShowType = rightMT["rightShowType"];
            parentClass.dispatchEvent("setRightLoading", {"isShow": true});
            if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("checkRightLive", {
                "xmlnode": _xmlnode,
                "mainGame": xmlHash[rightMT["key"]],
                "from": "game_list"
            })
        } else {
            first_no_tvmt = true;
            top.rightECID = "";
            top.rightGtype =
                "";
            top.rightNowPlay = "";
            top.rightRB = "";
            top.rightShowType = "";
            if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("setRightLoading", {"isShow": true});
            parentClass.dispatchEvent("setRightVisible", {"isShow": false});
            parentClass.dispatchEvent("resetRightTV", {})
        } else {
            top.rightECID = rightTV["ecid"];
            top.rightGtype = top.choice_gtype;
            top.rightRB = rightTV["isRB"];
            top.rightShowType = rightTV["rightShowType"];
            parentClass.dispatchEvent("setRightLoading", {"isShow": true});
            if (getView().viewportwidth >= 1024) {
                parentClass.dispatchEvent("resetRightTV",
                    {});
                parentClass.dispatchEvent("setRightTVDefaultPlay", rightTV)
            }
        } else {
            _self.setRightScore(dataHash, xmlHash);
            if (top.rightRB != my_rightTV[top.rightECID]["isRB"]) {
                top.rightRB = my_rightTV[top.rightECID]["isRB"];
                parentClass.dispatchEvent("setRightLoading", {"isShow": true});
                parentClass.dispatchEvent("resetRightTV", {})
            }
            if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("checkRightLive", {
                "xmlnode": _xmlnode,
                "mainGame": xmlHash["ec" + top.rightECID],
                "from": "game_list"
            })
        } else if (top.rightNowPlay == "MT") if (!mt_ecidAry[top.rightECID]) if (tv_ecidAry[top.rightECID]) {
            top.rightNowPlay =
                "TV";
            if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("checkRightLive", {
                "xmlnode": _xmlnode,
                "mainGame": xmlHash["ec" + top.rightECID],
                "from": "game_list"
            })
        } else if (rightTV["ecid"] == undefined) {
            first_no_tvmt = true;
            top.rightECID = "";
            top.rightGtype = "";
            top.rightNowPlay = "";
            top.rightRB = "";
            top.rightShowType = "";
            if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("setRightLoading", {"isShow": true});
            parentClass.dispatchEvent("setRightVisible", {"isShow": false});
            parentClass.dispatchEvent("resetRightTV",
                {})
        } else {
            top.rightECID = rightTV["ecid"];
            top.rightGtype = top.choice_gtype;
            top.rightRB = rightTV["isRB"];
            top.rightShowType = rightTV["rightShowType"];
            parentClass.dispatchEvent("setRightLoading", {"isShow": true});
            if (getView().viewportwidth >= 1024) {
                parentClass.dispatchEvent("resetRightTV", {});
                parentClass.dispatchEvent("setRightTVDefaultPlay", rightTV)
            }
        } else {
            if (top.rightRB != my_rightTV[top.rightECID]["isRB"]) {
                top.rightRB = my_rightTV[top.rightECID]["isRB"];
                parentClass.dispatchEvent("setRightLoading", {"isShow": true});
                parentClass.dispatchEvent("resetRightTV", {})
            }
            if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("checkRightLive", {
                "xmlnode": _xmlnode,
                "mainGame": xmlHash["ec" + top.rightECID],
                "from": "game_list"
            })
        }
        if (xmlHash["ec" + top.rightECID] != null) if (!top.choice_rtype.match("pd")) {
            top.resize_mainGame = xmlHash["ec" + top.rightECID];
            top.rightFrom = "game_list"
        }
        if (top.rightECID != "") if (dataHash["ec" + top.rightECID] != null && xmlHash["ec" + top.rightECID] != null && !top.choice_rtype.match("pd")) {
            parentClass.dispatchEvent("setRightTimer",
                "stop");
            if (top.rightNowPlay != "") _self.setRightScore(dataHash, xmlHash, nowShowtype)
        } else if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("setRightTimer", "start");
        if (scDataObj) top.scDataObj = scDataObj;
        var div_model = dom.getElementById("div_model");
        var infoModel = dom.getElementById("left_info");
        var infoModel_R = dom.getElementById("left_info_R");
        var PDModel = dom.getElementById("PD_info");
        var RPDModel = dom.getElementById("RPD_info");
        var obtModel = null;
        hasPD = top.choice_rtype.indexOf("pd") != -1;
        var choice_info =
            hasPD ? PDModel : infoModel;
        if (!hasPD && top.choice_gtype == "ft") obtModel = dom.getElementById("model_OBT");
        if (hasPD || getView().viewportwidth >= 1024 || isIOS) clusterize_sw = false;
        var _sourceData = new Object;
        var nowLS = _self.langx2LS(top.langx);
        _sourceData["gameObj"] = dataHash;
        _sourceData["groupObj"] = groupDataHash;
        _sourceData["sort_gpAry"] = sort_gpAry;
        _sourceData["sort_partiHash"] = sort_partiHash;
        _sourceData["gpHash"] = gpHash;
        _sourceData["partiHash"] = partiHash;
        _sourceData["nowLS"] = nowLS;
        _sourceData["isHL"] = top.specialGame.isHL ?
            true : false;
        _sourceData["isTeam"] = top.specialGame.isTeam ? true : false;
        _sourceData["hasPD"] = hasPD;
        _sourceData["div_model"] = div_model != null ? div_model.innerHTML : "";
        _sourceData["choice_info"] = choice_info != null ? choice_info.innerHTML : "";
        _sourceData["choice_info_R"] = infoModel_R != null ? infoModel_R.innerHTML : "";
        _sourceData["PDModel"] = PDModel != null ? PDModel.innerHTML : "";
        _sourceData["RPDModel"] = RPDModel != null ? RPDModel.innerHTML : "";
        _sourceData["obtModel"] = obtModel != null ? obtModel.innerHTML : "";
        _sourceData["model_HT"] =
            dom.getElementById("model_HT") ? dom.getElementById("model_HT").innerHTML : "";
        _sourceData["model_FT"] = dom.getElementById("model_FT") ? dom.getElementById("model_FT").innerHTML : "";
        _sourceData["model_ET"] = dom.getElementById("model_ET") ? dom.getElementById("model_ET").innerHTML : "";
        _sourceData["model_PK"] = dom.getElementById("model_PK") ? dom.getElementById("model_PK").innerHTML : "";
        _sourceData["model_RPD"] = dom.getElementById("model_RPD") ? dom.getElementById("model_RPD").innerHTML : "";
        _sourceData["model_HT_R"] = dom.getElementById("model_HT_R") ?
            dom.getElementById("model_HT_R").innerHTML : "";
        _sourceData["model_PD"] = dom.getElementById("model_PD") ? dom.getElementById("model_PD").innerHTML : "";
        _sourceData["model_OBT"] = dom.getElementById("model_OBT") ? dom.getElementById("model_OBT").innerHTML : "";
        _sourceData["model_GROUP"] = dom.getElementById("model_GROUP") ? dom.getElementById("model_GROUP").innerHTML : "";
        _sourceData["group_model_body"] = dom.getElementById("group_model_body") ? dom.getElementById("group_model_body").innerHTML : "";
        _sourceData["needsTransWtype"] =
            needsTransWtype;
        _sourceData["LS"] = _self.new_eval("LS_" + top.ls).toString();
        _sourceData["LS_game"] = _self.new_eval("LS_game_" + top.ls).toString();
        _sourceData["util"] = _self.new_eval("Util").toString();
        _sourceData["util_game"] = _self.new_eval("Util_game").toString();
        _sourceData["ratioChgRule"] = _self.new_eval("ratioChgRule").toString();
        _sourceData["GameRatio"] = GameRatio;
        _sourceData["GameInfo"] = GameInfo;
        _sourceData["PK"] = PK;
        _sourceData["choice_showtype"] = nowShowtype;
        _sourceData["specialClick"] = top.specialClick;
        _sourceData["choice_rtype"] = top.choice_rtype;
        _sourceData["choice_gtype"] = top.choice_gtype;
        _sourceData["showPDmore"] = top.showPDmore;
        if (chgSort) top.showOBT = "";
        _sourceData["showOBT"] = top.showOBT;
        _sourceData["_lastOBT_div"] = _lastOBT_div != null && !chgSort ? _lastOBT_div.innerHTML : "";
        _sourceData["_lastOBT_div_ECID"] = _lastOBT_div != null && !chgSort ? _lastOBT_div.getAttribute("id").split("_")[3] : "";
        _sourceData["_lastOBTHeight"] = _lastOBTHeight;
        _sourceData["headertype"] = postHash["headertype"];
        _sourceData["filterLid"] =
            postHash["lid"];
        _sourceData["_lastPK"] = _lastPK;
        _sourceData["_lastPKset"] = _lastPKset;
        _sourceData["isIOS"] = isIOS;
        if (chgSort && parObj["action"] != "leagueChg") {
            top["notShowLeg"] = new Object;
            top["notShowLegGame"] = new Object
        }
        _sourceData["notShowLegGame"] = top["notShowLegGame"];
        _sourceData["notShowLeg"] = top["notShowLeg"];
        _sourceData["gameAry"] = GameHash["ary"];
        _sourceData["action"] = parObj["action"];
        _sourceData["CLUSTERIZE_ROW"] = config_set.get("CLUSTERIZE_ROW");
        _sourceData["DEFINED_ROWHEIGHT"] = config_set.get("DEFINED_ROWHEIGHT");
        _sourceData["CLUSTERIZE_LIMIT_S"] = config_set.get("CLUSTERIZE_LIMIT_S");
        _sourceData["CLUSTERIZE_LIMIT_M"] = config_set.get("CLUSTERIZE_LIMIT_M");
        _sourceData["CLUSTERIZE_LIMIT_L"] = config_set.get("CLUSTERIZE_LIMIT_L");
        _sourceData["viewport_height"] = getView().viewportheight;
        _sourceData["CLUSTERIZE_SW"] = clusterize_sw;
        _sourceData["sort_type"] = sort_type;
        _sourceData["isMyGame"] = nowShowtype == "mygame" || top.specialClick != "" && !top.specialGame.isFantasy ? "mygame" : "";
        _sourceData["cup_period"] = top.specialGame.period;
        var _post = new Object;
        _post["cmd"] = "parseData";
        _post["sourceData"] = _sourceData;
        WORKER.postMessage(_post)
    };
    _self.setRightScore = function (dataHash, xmlHash, showtype) {
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        var nowShowtype = showtype ? showtype : top.choice_showtype;
        scDataObj = _self.getScDataObj(dataHash["ec" + top.rightECID], xmlHash["ec" + top.rightECID], showtype);
        if (getView().viewportwidth >= 1024) parentClass.dispatchEvent("parseRightScoreBoard", scDataObj);
        if ((nowShowtype == "mygame" || isSpecialGame == "Y") && top.choice_gtype != "ft") setTimeout(_self.closeRightLoadingSlowly, "500")
    };
    _self.langx2LS = function (langx) {
        if (langx == "zh-tw") return "c";
        if (langx == "zh-cn") return "g";
        if (langx == "en-us") return "e"
    };
    _self.workerThrough = function (e) {
        var ret = e.data;
        if (ret == "tooMuchCMD") {
            echo("tooMuchCMD");
            return
        }
        if (ret["action"] == "getData" || ret["action"] == "getCupData") _self.workerRefreshResponse(e); else if (ret["action"] == "leagueChg" || ret["action"] == "leagueOthersChg") _self.workerLeagueChg(e)
    };
    _self.workerRefreshResponse = function (e) {
        var ret = e.data;
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        var tmpEcAry = new Object;
        var tmpMenuAry = new Object;
        myLeg = new Object;
        totalLeg = ret["totalLeg"];
        myLeg = ret["myLeg"];
        var gameContent = ret["tmpDiv"];
        if (top.specialClick == "special") {
            var nowModelShowtype = top.game_model.split("_")[1];
            if (gameContent == "") return;
            if (nowModelShowtype == "today" && !top.specialGame.isFantasy) return;
            if (nowModelShowtype == "mygame" && top.specialGame.isFantasy) return
        }
        FantasyAry =
            ret["FantasyAry"];
        var delLidAry = ret["delLidAry"];
        for (d = 0; d < delLidAry.length; d++) delete top["notShowLeg"][delLidAry[d]];
        if (totalLeg.length == 0 && delLidAry.length != 0) {
            _self.showNoData(true);
            _self.showGameLoading(false);
            parentClass.dispatchEvent("showLoading", {"isShow": false});
            return
        }
        top["showPDmore"] = ret["showPDmore"];
        total_parlay_limit = ret["total_parlay_limit"];
        sportFrame.setGameParlayLimit({"parlay_limit_min": total_parlay_limit});
        _self.chooseOBT(ret["showOBT"]);
        if (ret["_lastOBT_div_ECID"] != "") {
            _lastOBT_div =
                dom.createElement("div");
            _lastOBT_div.setAttribute("id", "div_OBT_show_" + ret["_lastOBT_div_ECID"]);
            _lastOBT_div.innerHTML = ret["_lastOBT_div"]
        }
        _lastPK = ret["_lastPK"];
        _lastPKset = ret["_lastPKset"];
        var xmdObj = new Object;
        xmdObj["ec"] = _xmlnode.Node(_xmlnode.Root[0], "ec", false);
        var _s, _e;
        _s = 0;
        _e = xmdObj["ec"].length;
        _self.setRP3Ary(xmdObj, _s, _e);
        if (!chgSort) _self.saveScroll();
        if (clusterize_sw) {
            rowAry.length = 0;
            rowAry = ret["rowAry"];
            blockHeight = ret["blockHeight"];
            blockNum = ret["blockNum"];
            var total_height = ret["totalRowHeight"];
            if (clusterize != null) clusterize.update(rowAry, total_height, blockHeight, blockNum); else _self.useClusterize(total_height, blockHeight, blockNum);
            if (firstLoad && !isIOS) _self.lockHorizontalScroll();
            chgSort = false;
            parentClass.dispatchEvent("showLoading", {"isShow": false});
            if (clusterChg) {
                firstLoad = false;
                clusterChg = false;
                return
            }
            firstLoad = false
        } else {
            var tmpRet = _self.parseGameList(ret);
            if (top.rightNowPlay == "TV" || top.rightNowPlay == "MT") {
                if (document.getElementById("icon_tv_" + top.rightECID) && getView().viewportwidth >=
                    1024) document.getElementById("icon_tv_" + top.rightECID).classList.add("now")
            } else if (top.rightNowPlay == "" && top.choice_showtype == "parlay") if (document.getElementById("icon_tv_" + top.rightECID) && getView().viewportwidth >= 1024) document.getElementById("icon_tv_" + top.rightECID).classList.add("now");
            if (tmpRet) {
                _self.initLeague(FantasyAry);
                _self.initInfoBtn(_xmlnode, xmdObj["ec"]);
                _self.initIorBtn(_xmlnode, xmdObj["ec"]);
                if (top.specialGame.isHL) _self.initGroupBtn(group_xml)
            }
            chgSort = false;
            if (!hasPD) _self.initOBTMenuBtn(_xmlnode,
                xmdObj["ec"]); else _self.initPDbtn(_xmlnode, xmdObj["ec"]);
            for (var j = _s; j < _e; j++) {
                var tmp_ec = xmdObj["ec"][j];
                var ECID = tmp_ec.getAttribute("id").replace(/ec/, "");
                tmpEcAry[ECID] = ecidScrollHash[ECID] ? ecidScrollHash[ECID] : 0;
                tmpMenuAry[ECID] = menuScrollHash[ECID] ? menuScrollHash[ECID] : 0
            }
            _self.loadScroll(tmpEcAry, tmpMenuAry);
            chgColorIor = util_game.chgIorColor(dom, util, chgColorIor);
            util_game.initSelect(util);
            if (!isIOS) if (page_sw) {
                _totalPage = _xmlnode.Node(_xmlnode.Root[0], "pageCount").innerHTML;
                _self.showPagination(_totalPage,
                    RESIZE)
            }
            _self.showGameLoading(false);
            parentClass.dispatchEvent("showLoading", {"isShow": false});
            if (top.choice_showtype == "mygame" || isSpecialGame == "Y" || top.choice_showtype == "parlay" || rightChgSort) {
                rightChgSort = false;
                setTimeout(_self.closeRightLoadingSlowly, "500")
            } else parentClass.dispatchEvent("setRightLoading", {"isShow": false});
            if (page_sw) RESIZE = false
        }
    };
    _self.initGroupBtn = function (xmlnode) {
        var xmdObj = new Object;
        xmdObj["Group"] = xmlnode.Node(xmlnode.Root[0], "Group", false);
        var ls = _self.langx2LS(top.langx);
        for (var a = 0; a < xmdObj["Group"].length; a++) {
            var tmp_Group = xmdObj["Group"][a];
            var groupName = tmp_Group.getAttribute("name_" + ls);
            xmdObj["Participant"] = xmlnode.Node(tmp_Group, "Participant", false);
            if (xmdObj["Participant"].length < 4) continue; else for (var b = 0; b < xmdObj["Participant"].length; b++) {
                var tmp_parti = xmdObj["Participant"][b];
                xmdObj["rtypes"] = xmlnode.Node(tmp_parti, "rtypes", false);
                var partiName = tmp_parti.getAttribute("team_name_" + ls);
                var team_id = tmp_parti.getAttribute("team_id");
                var teamObj = dom.getElementById("group_team_" +
                    team_id);
                if (teamObj != null) if (top["specialGame"]["CUP_TEAM"][team_id] == null || top["specialGame"]["CUP_TEAM"][team_id] == 0 || top["specialGame"]["team_sw"] == "N") {
                    util.addClass(teamObj, "off");
                    util.removeEvent(teamObj, "click")
                } else {
                    util.removeClass(teamObj, "off");
                    util.addEvent(teamObj, "click", _self.goToTeam, {"team_id": team_id})
                } else continue;
                for (var c = 0; c < xmdObj["rtypes"].length; c++) {
                    var gid = xmlnode.Node(xmdObj["rtypes"][c], "gid").innerHTML;
                    var result = xmlnode.Node(xmdObj["rtypes"][c], "result").innerHTML;
                    var rtype = xmlnode.Node(xmdObj["rtypes"][c], "rtype").innerHTML;
                    var ioratio = xmlnode.Node(xmdObj["rtypes"][c], "ioratio").innerHTML;
                    var rtype_name = xmdObj["rtypes"][c].getAttribute("item_name_" + ls);
                    var obj = dom.getElementById("group_bet_" + gid + "_" + gid + "_" + rtype);
                    if (!util_game.checkIoratio(ioratio)) {
                        util.removeEvent(obj, "click");
                        continue
                    }
                    obj.gtype = top.choice_gtype;
                    obj.showtype = top.choice_showtype;
                    obj.gid = gid;
                    obj.ecid = gid;
                    obj.rtype = rtype;
                    obj.ioratio = ioratio;
                    obj.rtype_name = rtype_name;
                    obj.mode = "group";
                    obj.betLeagueName =
                        betLeagueName;
                    obj.gameObj = tmp_Group;
                    var typeName = "";
                    if (top.specialClick == "special") typeName = "special";
                    if (top.outrightsClick == "outrights") typeName = "outrights";
                    obj.f = util_game.checkBetFrom(typeName, "R");
                    util.addEvent(obj, "click", _self.showBetEventFS, obj)
                }
            }
        }
    };
    _self.workerLeagueChg = function (e) {
        echo("workerLeagueChg");
        var ret = e.data;
        total_parlay_limit = ret["total_parlay_limit"];
        sportFrame.setGameParlayLimit({"parlay_limit_min": total_parlay_limit});
        _self.saveScroll();
        if (clusterize_sw) {
            rowAry.length = 0;
            rowAry =
                ret["rowAry"];
            blockHeight = ret["blockHeight"];
            blockNum = ret["blockNum"];
            var total_height = ret["totalRowHeight"];
            if (clusterize != null) clusterize.update(rowAry, total_height, blockHeight, blockNum)
        } else {
            var tmpEcAry = new Object;
            var tmpMenuAry = new Object;
            myLeg = new Object;
            totalLeg = ret["totalLeg"];
            myLeg = ret["myLeg"];
            top["showPDmore"] = ret["showPDmore"];
            total_parlay_limit = ret["total_parlay_limit"];
            _self.chooseOBT(ret["showOBT"]);
            if (ret["_lastOBT_div_ECID"] != "") {
                _lastOBT_div = dom.createElement("div");
                _lastOBT_div.setAttribute("id",
                    "div_OBT_show_" + ret["_lastOBT_div_ECID"]);
                _lastOBT_div.innerHTML = ret["_lastOBT_div"]
            }
            _lastPK = ret["_lastPK"];
            _lastPKset = ret["_lastPKset"];
            var xmdObj = new Object;
            xmdObj["ec"] = _xmlnode.Node(_xmlnode.Root[0], "ec", false);
            var _s, _e;
            _s = 0;
            _e = xmdObj["ec"].length;
            if (top.choice_gtype == "ft") _self.setRP3Ary(xmdObj, _s, _e);
            var tmpRet = _self.parseGameList(ret);
            if (tmpRet) {
                _self.initLeague();
                _self.initInfoBtn(_xmlnode, xmdObj["ec"]);
                _self.initIorBtn(_xmlnode, xmdObj["ec"])
            }
            if (!hasPD) _self.initOBTMenuBtn(_xmlnode, xmdObj["ec"]);
            else _self.initPDbtn(_xmlnode, xmdObj["ec"]);
            for (var j = _s; j < _e; j++) {
                var tmp_ec = xmdObj["ec"][j];
                var ECID = tmp_ec.getAttribute("id").replace(/ec/, "");
                tmpEcAry[ECID] = ecidScrollHash[ECID] ? ecidScrollHash[ECID] : 0;
                tmpMenuAry[ECID] = menuScrollHash[ECID] ? menuScrollHash[ECID] : 0
            }
            _self.loadScroll(tmpEcAry, tmpMenuAry);
            chgColorIor = util_game.chgIorColor(dom, util, chgColorIor);
            util_game.initSelect(util);
            if (!isIOS) if (page_sw) {
                _totalPage = _xmlnode.Node(_xmlnode.Root[0], "pageCount").innerHTML;
                _self.showPagination(_totalPage,
                    RESIZE)
            }
            _self.showGameLoading(false);
            if (page_sw) RESIZE = false
        }
    };
    _self.chooseOBT = function (_showOBT) {
        if (top["showOBT"] && _showOBT != top["showOBT"]) {
            var tmpECID = top["showOBT"].split("_")[0];
            var tmpModel = top["showOBT"].split("_")[1];
            var menuObj = dom.getElementById("div_OBT_menu_" + tmpECID);
            var pageIndex = top["showOBT"].split("_")[2];
            var gameIndex = top["showOBT"].split("_")[3];
            var isEarly = top["showOBT"].split("_")[4];
            var tmp_model = tmpModel.indexOf("ET") != -1 && tmpModel != "ET" ? tmpModel.replace("ET", "") : tmpModel;
            var objids = ",OBT_" + tmp_model + ",";
            var ary = util.getObjAry(menuObj, objids);
            var _par = new Object;
            _par["obj"] = ary["OBT_" + tmp_model];
            _par["ECID"] = tmpECID;
            _par["model"] = tmpModel;
            _par["pageIndex"] = pageIndex;
            _par["gameIndex"] = gameIndex;
            _par["isEarly"] = isEarly;
            _self.chgDiv(null, _par)
        }
    };
    _self.setRP3Ary = function (xmdObj, _start, _end) {
        rbP3_ECID = util.clearArray(rbP3_ECID);
        util.clearObject(isP3_R);
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        for (var j = _start; j <
        _end; j++) {
            var tmp_ec = xmdObj["ec"][j];
            var ECID = tmp_ec.getAttribute("id").replace(/ec/, "");
            var myGameShowtype = tmp_ec.getAttribute("myGame");
            if (!hasPD) rbP3_ECID.push(ECID);
            xmdObj["game"] = _xmlnode.Node(tmp_ec, "game", false);
            var game_length = xmdObj["game"].length;
            for (var x = 0; x < game_length; x++) {
                var tmp_game = xmdObj["game"][x];
                var _gid = _xmlnode.Node(tmp_game, "GID").innerHTML;
                var is_rb = _xmlnode.Node(tmp_game, "IS_RB").innerHTML;
                var nowModel = _xmlnode.Node(tmp_game, "NOW_MODEL").innerHTML;
                var tmpLayer = _self.getRatioLayer(nowModel,
                    is_rb).cloneNode(true);
                if (!tmpLayer) continue;
                var tmp_ecid = ECID;
                if (hasPD) {
                    tmp_ecid = _gid + "_" + ECID;
                    rbP3_ECID.push(tmp_ecid)
                }
                isP3_R[tmp_ecid] = is_rb == "Y" || top.choice_showtype == "live" || (top.choice_showtype == "mygame" || isSpecialGame == "Y") && (nowModel == "RPD" || myGameShowtype == "rb")
            }
        }
    };
    _self.parseGameList = function (_ret) {
        var div_show = dom.getElementById("div_show");
        div_show.innerHTML = _ret["tmpDiv"];
        return true
    };
    _self.saveScroll = function () {
        ecidScrollHash = _self.getScroll("ratioShow", ecidScrollHash);
        menuScrollHash =
            _self.getScroll("div_OBT_menu", menuScrollHash);
        obtScrollHash = _self.getScroll("ratioShow_OBT", obtScrollHash)
    };
    _self.loadScroll = function (tmpEcAry, tmpMenuAry) {
        ecidScrollHash = _self.setScroll("ratioShow", tmpEcAry);
        menuScrollHash = _self.setScroll("div_OBT_menu", tmpMenuAry);
        if (top.showOBT != "" && top.showOBT.split("_")[1].indexOf("MIX") != -1) obtScrollHash = _self.setScroll("table_obt_bet", obtScrollHash); else obtScrollHash = _self.setScroll("ratioShow_OBT", obtScrollHash)
    };
    _self.refreshHideScrollBar = function () {
        for (i =
                 0; i < ecid_array.length; i++) {
            var gameObj = dom.getElementById("game_" + ecid_array[i]);
            if (gameObj) util.addClass(gameObj, "update")
        }
        if (top["showOBT"]) {
            var tmpECID = top["showOBT"].split("_")[0];
            var obtObj = dom.getElementById("div_OBT_show_" + tmpECID);
            if (obtObj) util.addClass(obtObj, "update")
        }
    };
    _self.refreshDisplayScrollBar = function () {
        for (i = 0; i < ecid_array.length; i++) {
            var gameObj = dom.getElementById("game_" + ecid_array[i]);
            var obtObj = dom.getElementById("div_OBT_show_" + ecid_array[i]);
            if (gameObj) util.removeClass(gameObj,
                "update");
            if (obtObj) util.removeClass(obtObj, "update")
        }
    };
    _self.getScroll = function (_name, hash) {
        if (_name == "ratioShow_OBT" && top.showOBT != "" && top.showOBT.split("_")[1].indexOf("MIX") != -1) for (var ecid in hash) for (var wtype in hash[ecid]) {
            var obj = dom.getElementById("table_obt_bet_" + wtype.toLowerCase());
            if (obj && !top.notShowLegGame[ecid]) hash[ecid][wtype] = obj.scrollLeft; else delete hash[ecid]
        } else for (var ecid in hash) {
            var obj = dom.getElementById(_name + "_" + ecid);
            if (obj && !top.notShowLegGame[ecid]) hash[ecid] =
                obj.scrollLeft; else delete hash[ecid]
        }
        return hash
    };
    _self.setScroll = function (_name, hash) {
        if (_name == "table_obt_bet") for (var ecid in hash) for (var wtype in hash[ecid]) {
            var obj = dom.getElementById(_name + "_" + wtype.toLowerCase());
            if (obj) obj.scrollLeft = hash[ecid][wtype]
        } else for (var ecid in hash) {
            var obj = dom.getElementById(_name + "_" + ecid);
            if (obj) obj.scrollLeft = hash[ecid]
        }
        return hash
    };
    _self.obt_menu_move = function (obj_obt, ecid) {
        var obj = obj_obt;
        var menu_id = ecid;
        var menu = dom.getElementById("div_OBT_menu_" + menu_id);
        var obt_close = dom.getElementById("OBT_close_" + menu_id);
        var distance = obj.offsetLeft ? obj.offsetLeft : 0;
        if (obj.classList.contains("on")) var relative_pos_left = obj.getBoundingClientRect().left;
        if (relative_pos_left + obj.clientWidth - 8 < dom.body.clientWidth - obt_close.clientWidth) return;
        if (!relative_pos_left && dom.body.clientWidth - obt_close.clientWidth > obj.offsetLeft + obj.clientWidth) return;
        menu.scrollLeft = distance
    };
    _self.replaceMidfield = function (vals) {
        return vals.replace("[Mid]", "").replace("[\u4e2d]", "")
    };
    _self.addZero =
        function (val) {
            var n = parseInt(val);
            return n < 10 ? "0" + n : n.toString()
        };
    _self.transDate = function (xml_datetime, sys_time, hasPD) {
        var ret = "";
        var tmpdate = xml_datetime.split(" ");
        var xml_date = tmpdate[0];
        var gmt = new Date(sys_time.replace(/-/g, "/"));
        var now_m = parseInt(gmt.getMonth() + 1);
        var now_date = _self.addZero(now_m) + "-" + _self.addZero(gmt.getDate());
        var game_m = parseInt(xml_date.split("-")[0]);
        if (now_m > game_m) gmt.setFullYear(gmt.getFullYear() + 1);
        var y = gmt.getFullYear();
        var hm = _self.get24Hours(y + "-" + xml_datetime);
        if (top.choice_showtype == "today" || xml_date == now_date) if (hasPD) ret = LS.get("datetime_today") + "<br>" + hm; else ret = LS.get("datetime_today") + " " + hm; else {
            var w = (new Date(y + "-" + xml_date)).getDay();
            var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            var str_w = week[w] ? LS_game.get("game_" + week[w]) : "";
            var dt_ary = xml_datetime.split(" ");
            var d_ary = dt_ary[0].split("-");
            if (hasPD) ret = d_ary[1] + " / " + d_ary[0] + "<br>" + hm; else {
                ret = d_ary[1] + " / " + d_ary[0] + "   " + hm;
                ret = str_w + " " + ret
            }
        }
        return ret
    };
    _self.get24Hours = function (datetime) {
        var ret =
            "";
        try {
            var tmp = datetime.replace(/-/g, "/");
            tmp = tmp.replace(/a/g, " am").replace(/p/g, " pm");
            var h = (new Date(tmp)).getHours();
            var str_h = parseInt(h) < 10 ? "0" + h : h;
            var tmpd = datetime.split(" ");
            var tmph = tmpd[1].split(":");
            ret = str_h + ":" + tmph[1];
            ret = ret.replace(/a/gi, "").replace(/p/gi, "")
        } catch (e) {
        }
        return ret
    };
    _self.showNoData = function (isShow) {
        var div_show = dom.getElementById("div_show");
        var title_main = dom.getElementById("title_main");
        var cup_tab = dom.getElementById("cup_tab");
        var divNoData_pd = dom.getElementById("div_nodata_pd");
        var divNoData = dom.getElementById("div_nodata");
        var isNoData = top.specialGame.isHL ? winner_empty && game_empty && fs_empty : game_empty && fs_empty;
        if (isShow) {
            if (game_empty) {
                div_show.innerHTML = "";
                div_show.style.display = "none";
                dom.getElementById("cup_game_show").style.display = "none"
            }
            if (top.choice_rtype == "pd") {
                if (divNoData_pd) divNoData_pd.style.display = "";
                if (divNoData) divNoData.style.display = "none";
                title_main.style.display = "";
                cup_tab.style.display = "";
                dom.getElementById("cup_game_show").style.display = ""
            } else {
                if (divNoData_pd) divNoData_pd.style.display =
                    "none";
                if (isNoData) if (divNoData) divNoData.style.display = "";
                if (game_empty) {
                    title_main.style.display = "none";
                    cup_tab.style.display = "none"
                }
            }
            if (top.specialClick == "special" && top.specialGame.Total_Count == 0) sportFrame.setTitle("special", {"title": top.specialGame.title})
        } else {
            if (divNoData) divNoData.style.display = "none";
            if (divNoData_pd) divNoData_pd.style.display = "none";
            div_show.style.display = "";
            title_main.style.display = "";
            cup_tab.style.display = "";
            dom.getElementById("cup_game_show").style.display = ""
        }
    };
    _self.getRatioLayer =
        function (_name, is_rb) {
            var tmpName = _name == "HT" && is_rb == "N" ? "HT_R" : _name;
            var tarObj = dom.getElementById("model_" + tmpName);
            if (tarObj != null) return tarObj; else console.log("[game_list][getRatioLayer] _name=", _name, "is_rb=", is_rb)
        };
    _self.initLeague = function (FantasyAry) {
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        var league_limit = 16;
        var tmp_league_limit = 0;
        for (var i = 0; i < totalLeg.length; i++) {
            var tarObj = dom.getElementById("LEG_" + totalLeg[i]);
            if (top["notShowLeg"][totalLeg[i]] ==
                null || chgSort) if (tmp_league_limit >= league_limit) {
                top["notShowLeg"][totalLeg[i]] = true;
                for (var j = 0; j < myLeg[totalLeg[i]].length; j++) {
                    var obj = dom.getElementById("game_" + myLeg[totalLeg[i]][j]);
                    top["notShowLegGame"][myLeg[totalLeg[i]][j]] = myLeg[totalLeg[i]][j];
                    if (!clusterize_sw && obj) obj.style.display = "none"
                }
            } else {
                top["notShowLeg"][totalLeg[i]] = false;
                tmp_league_limit += 1
            }
            util.addEvent(tarObj, "click", _self.showLeg, totalLeg[i])
        }
        if (util.countSize(top["notShowLegGame"]) != 0) {
            notShowPage = new Object;
            for (var key in top["notShowLegGame"]) {
                var obj =
                    dom.getElementById("game_" + key);
                if (obj) obj.style.display = "none"
            }
        }
        if (top.choice_showtype == "parlay" || top.choice_showtype == "mygame" || isSpecialGame == "Y") for (var j = 0; j < rbP3_ECID.length; j++) {
            var _ecid = rbP3_ECID[j];
            if (isP3_R[_ecid]) {
                var obj = dom.getElementById("game_" + _ecid);
                if (obj) util.addClass(obj, "live_lebet")
            }
        }
    };
    _self.showLeg = function (e, _name) {
        if (e.target.id.indexOf("LEG_") != -1 || e.target.id.indexOf("lea_") != -1) {
            for (var i = 0; i < myLeg[_name].length; i++) {
                var obj = dom.getElementById("game_" + myLeg[_name][i]);
                if (!top["notShowLeg"][_name]) {
                    top["notShowLegGame"][myLeg[_name][i]] = myLeg[_name][i];
                    if (!clusterize_sw && obj) obj.style.display = "none"
                } else {
                    delete top["notShowLegGame"][myLeg[_name][i]];
                    if (!clusterize_sw && obj) {
                        obj.style.display = "";
                        document.getElementById("ratioShow_" + myLeg[_name][i]).scrollLeft = 0
                    }
                }
            }
            top["notShowLeg"][_name] = !top["notShowLeg"][_name];
            if (clusterize_sw) if (top.choice_gtype == "ft") _self.workerPost(_worker, {
                "action": "leagueChg",
                "xml": _xmlnode
            }); else _self.workerPostOthers(_worker, {
                "action": "leagueOthersChg",
                "xml": _xmlnode
            })
        }
    };
    _self.initInfoBtn = function (xmlnode, ecObj) {
        var myGameShowtype = "";
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        if (ecid_array.length > 0) ecid_array = new Array;
        if (my_ecidAry.length > 0) my_ecidAry = new Array;
        var tmpGameObj = util_game.convertNodeToHashForGame(xmlnode.Root[0]);
        var system_time = xmlnode.Node(xmlnode.Root[0], "system_time").innerHTML;
        var tmpShowType = "";
        for (var j = 0; j < ecObj.length; j++) {
            var mainScore = "";
            var extraScore = "";
            var tmp_ec =
                ecObj[j];
            var hasEC = tmp_ec.getAttribute("hasEC");
            var ECID = tmp_ec.getAttribute("id").replace(/ec/, "");
            if (top.choice_showtype == "mygame" || isSpecialGame == "Y") myGameShowtype = tmp_ec.getAttribute("mygame");
            var right_game_obj = tmpGameObj["obj"][tmp_ec.getAttribute("id")];
            ecid_array.push(ECID);
            var tmp_game = xmlnode.Node(tmp_ec, "game", false)[0];
            var ptype_map = xmlnode.Node(tmp_game, "ptype_map").innerHTML;
            var ptype = xmlnode.Node(tmp_game, "ptype").innerHTML;
            var _gid = xmlnode.Node(tmp_game, "GID").innerHTML;
            var _gidm =
                xmlnode.Node(tmp_game, "GIDM").innerHTML;
            var isRB = xmlnode.Node(tmp_game, "IS_RB").innerHTML;
            var LID = xmlnode.Node(tmp_game, "LID").innerHTML;
            if (isRB == null) isRB = top.choice_showtype == "live" || (top.choice_showtype == "mygame" || isSpecialGame == "Y") && myGameShowtype == "rb" ? "Y" : "N";
            var more_league = xmlnode.Node(tmp_game, "league").innerHTML;
            betLeagueName = more_league;
            var more_team_h = xmlnode.Node(tmp_game, "team_h").innerHTML;
            more_team_h = more_team_h.replace(" [Mid]", "").replace(" [\u4e2d]", "");
            var more_team_c = xmlnode.Node(tmp_game,
                "team_c").innerHTML;
            var more_score_h = xmlnode.Node(tmp_game, "score_h").innerHTML;
            var more_score_c = xmlnode.Node(tmp_game, "score_c").innerHTML;
            var xml_datetime = xmlnode.Node(tmp_game, "datetime").innerHTML;
            var sys_time = xmlnode.Node(tmp_game, "systime").innerHTML;
            var isFantasy = xmlnode.Node(tmp_game, "ISFANTASY").innerHTML;
            var fantasyObj = new Object;
            var isToday = _self.isToady(xml_datetime, sys_time);
            var xml_retimeset = xmlnode.Node(tmp_game, "RETIMESET").innerHTML;
            var hasPD = top.choice_rtype.indexOf("pd") != -1;
            if (top.choice_showtype ==
                "parlay" && isRB != "Y") var more_retime = _self.transDate(xml_datetime, sys_time, hasPD); else var more_retime = xml_retimeset ? util_game.transRETIME(xml_retimeset, hasPD, LS_game) : 0;
            if (!hasPD) var more_datetime = _self.transDate(xml_datetime, sys_time, hasPD);
            var moreBtn;
            if (!hasPD) {
                var infoObj = dom.getElementById("mainShow_" + ECID);
                var objids = ",div_icon_info,more,";
                var ary = util.getObjAry(infoObj, objids);
                moreBtn = ary["more"];
                if (ptype_str[ptype_map] == "PK" || ptype_str[ptype_map] == "ET") {
                    var FT_score_h = xmlnode.Node(tmp_game,
                        "FT_SCROE_H").innerHTML;
                    var FT_score_c = xmlnode.Node(tmp_game, "FT_SCROE_C").innerHTML;
                    var ET_score_h = xmlnode.Node(tmp_game, "ET_SCROE_H").innerHTML;
                    var ET_score_c = xmlnode.Node(tmp_game, "ET_SCROE_C").innerHTML;
                    if (FT_score_h != "" && FT_score_c) mainScore = FT_score_h + " - " + FT_score_c;
                    if (ET_score_h != "" && ET_score_c) extraScore = ET_score_h + " - " + ET_score_c;
                    if (top.mobile != "Y") ary["div_icon_info"].classList.add("info_on");
                    util.addEvent(ary["div_icon_info"], "click", _self.showExtraInfo, {
                        "ptype": ptype_str[ptype_map],
                        "hasEC": hasEC, "mainScore": mainScore, "extraScore": extraScore
                    })
                } else if (isFantasy == "Y") {
                    if (top.mobile != "Y" && ary["div_icon_info"]) ary["div_icon_info"].classList.add("info_on");
                    var teamH_id = xmlnode.Node(tmp_game, "TEAM_H_ID").innerHTML;
                    var teamC_id = xmlnode.Node(tmp_game, "TEAM_C_ID").innerHTML;
                    var fantasyData = xmlnode.Node(tmp_game, "FANTASY_DATA").innerHTML;
                    FantasyDataHash["ec" + ECID] = new Object;
                    FantasyDataHash["ec" + ECID]["isFantasy"] = "Y";
                    if (fantasyData != "No Fantasy Data") {
                        fantasyData = xmlnode.Node(tmp_game,
                            "FANTASY_DATA", false)[0];
                        var fantasyGame1 = xmlnode.Node(fantasyData, "GAMEH", false)[0];
                        var fantasyGame2 = xmlnode.Node(fantasyData, "GAMEC", false)[0];
                        var fantasy_teamh = teamH_id == fantasyGame1.getAttribute("TEAM_H_ID") ? "teamA" : "teamB";
                        var fantasy_teamc = teamC_id == fantasyGame2.getAttribute("TEAM_H_ID") ? "teamC" : "teamD";
                        fantasyObj = {
                            "system_time": system_time,
                            "game1_datetime": fantasyGame1.getAttribute("DATETIME"),
                            "game1_Leg": fantasyGame1.getAttribute("LEAGUE"),
                            "teamA": fantasyGame1.getAttribute("TEAM_H"),
                            "teamB": fantasyGame1.getAttribute("TEAM_C"),
                            "game2_datetime": fantasyGame2.getAttribute("DATETIME"),
                            "game2_Leg": fantasyGame2.getAttribute("LEAGUE"),
                            "teamC": fantasyGame2.getAttribute("TEAM_H"),
                            "teamD": fantasyGame2.getAttribute("TEAM_C"),
                            "fantasy_teamh": fantasy_teamh,
                            "fantasy_teamc": fantasy_teamc,
                            "isToday": isToday
                        };
                        FantasyDataHash["ec" + ECID]["fantasyObj"] = fantasyObj;
                        util.addEvent(ary["div_icon_info"], "click", _self.AlertFantasyInfo, fantasyObj)
                    } else {
                        FantasyDataHash["ec" + ECID]["fantasyObj"] = "";
                        util.addEvent(ary["div_icon_info"], "click", _self.AlertFantasyInfo,
                            {"system_time": system_time, "isToday": isToday})
                    }
                }
            } else {
                var pd_key = _gid + "_" + ECID;
                moreBtn = dom.getElementById("mainPDshow_" + pd_key)
            }
            var moreID = "";
            if (top.choice_gtype == "ft") {
                moreID = ECID;
                if (hasEC == "N") myGameID = _gid; else myGameID = ECID
            } else {
                moreID = _gid;
                myGameID = _gidm
            }
            if (top.forecast_sw && top.choice_showtype != "mygame") {
                if (dom.getElementById("icon_forecast_" + myGameID)) dom.getElementById("icon_forecast_" + myGameID).style.display = ""
            } else if (dom.getElementById("icon_forecast_" + myGameID)) dom.getElementById("icon_forecast_" +
                myGameID).style.display = "none";
            if (top.choice_showtype == "parlay" || top.specialClick == "special") if (isRB == "Y") tmpShowType = "live"; else tmpShowType = isToday == "Y" ? "today" : "early"; else tmpShowType = top.choice_showtype;
            _self.updateMyGame(myGameID, xml_datetime, tmpShowType);
            my_ecidAry.push(myGameID);
            more_param_obj[moreID] = {
                "gameObj": right_game_obj,
                "mainGame": tmp_game,
                "ECID": moreID,
                "isRB": isRB,
                "league": more_league,
                "team_h": more_team_h,
                "team_c": more_team_c,
                "retime": more_retime,
                "datetime": more_datetime,
                "score_h": more_score_h,
                "score_c": more_score_c,
                "gidm": _gidm,
                "lid": LID,
                "FT_scroe_H": FT_score_h,
                "FT_scroe_C": FT_score_c,
                "myGameShowtype": myGameShowtype,
                "hasEC": hasEC,
                "myGameID": myGameID,
                "isToday": isToday,
                "gid": _gid,
                "showtype": tmpShowType,
                "ptype": ptype
            };
            util.addEvent(moreBtn, "click", _self.clickMore, more_param_obj[moreID])
        }
        _self.checkMyGame(my_ecidAry);
        _self.starShow(top.myGame_sw)
    };
    _self.initIorBtn = function (xmlnode, ecObj) {
        var xmdObj = new Object;
        top["transWtype"] = new Object;
        var gtype_setAry = new Array("bk", "bs", "bm", "tt", "vb",
            "tn", "sk");
        var myGameShowtype = "";
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        for (var j = 0; j < ecObj.length; j++) {
            var tmp_ec = ecObj[j];
            var ECID = tmp_ec.getAttribute("id").replace(/ec/, "");
            var hasEC = tmp_ec.getAttribute("hasEC");
            if (top.choice_showtype == "mygame" || isSpecialGame == "Y") myGameShowtype = tmp_ec.getAttribute("myGame");
            xmdObj["game"] = xmlnode.Node(tmp_ec, "game", false);
            for (var x = 0; x < xmdObj["game"].length; x++) {
                var tmp_game = xmdObj["game"][x];
                var gid =
                    xmlnode.Node(tmp_game, "GID").innerHTML;
                var gid2 = xmlnode.Node(tmp_game, "GID2").innerHTML;
                var hgid = xmlnode.Node(tmp_game, "HGID").innerHTML;
                var is_rb = xmlnode.Node(tmp_game, "IS_RB").innerHTML;
                var _ptype = util_game.showTxt(xmlnode.Node(tmp_game, "ptype").innerHTML);
                var _imp = util_game.showTxt(xmlnode.Node(tmp_game, "important").innerHTML);
                var tmp_rtype = "";
                if (top.choice_showtype == "mygame" || isSpecialGame == "Y") if (hasPD) tmp_rtype = myGameShowtype != "rb" ? "pd" : "rpd"; else tmp_rtype = myGameShowtype != "rb" ? "r" : "rb"; else tmp_rtype =
                    top.choice_rtype;
                if (hasPD && top.choice_showtype == "parlay") tmp_rtype = "p3pd";
                var wtype_ary = IOR[tmp_rtype];
                var gidAry = new Array;
                if (gid) gidAry.push(gid);
                if (gid2) gidAry.push(gid2);
                if (hgid) gidAry.push(hgid);
                if (util_game.in_array(top.choice_gtype, gtype_setAry)) {
                    var half_gid = xmlnode.Node(tmp_game, "HALF_GID").innerHTML;
                    var ms_gid = xmlnode.Node(tmp_game, "MS_GID").innerHTML;
                    var point_gid = xmlnode.Node(tmp_game, "POINT_GID").innerHTML;
                    if (half_gid) gidAry.push(half_gid);
                    if (ms_gid) gidAry.push(ms_gid);
                    if (point_gid) gidAry.push(point_gid)
                }
                for (var _wtype in wtype_ary) for (var a =
                    0; a < wtype_ary[_wtype].length; a++) {
                    var _rtype = wtype_ary[_wtype][a];
                    var obj = null;
                    var _gid = null;
                    var nowWtype = "";
                    var nowRtype = "";
                    for (var i = 0; i < gidAry.length; i++) {
                        var tmp_gid = gidAry[i];
                        if (tmp_gid) {
                            obj = _self.getIorObj(tmp_gid, ECID, _rtype, false);
                            if (obj) {
                                _gid = gidAry[i];
                                if (util.in_array(_wtype, needsTransWtype)) {
                                    var tmpWtype = util_game.showTxt(xmlnode.Node(tmp_game, "WTYPE_" + _wtype.toUpperCase()).innerHTML);
                                    top["transWtype"]["ec_" + ECID] = tmpWtype;
                                    nowWtype = _wtype.replace(new RegExp(_wtype, "gi"), tmpWtype);
                                    nowRtype =
                                        _rtype.replace(new RegExp(_wtype, "gi"), tmpWtype)
                                } else {
                                    nowWtype = _wtype;
                                    nowRtype = _rtype
                                }
                                if (_gid != null && ECID != null && nowRtype != null) {
                                    var isRB = xmlnode.Node(tmp_game, "is_rb").innerHTML;
                                    var iorRtype = nowRtype.toUpperCase();
                                    var chg_ior = nowGameHash["ec" + ECID]["ior_" + iorRtype.toLowerCase()];
                                    chgColorID = "bet_" + _gid + "_" + ECID + "_" + nowRtype;
                                    var isChg = typeof gid_rtype_ior[chgColorID] != "undefined" && gid_rtype_ior[chgColorID] != chg_ior && chg_ior * 1 != 0 && gid_rtype_ior[chgColorID] * 1 != 0;
                                    chgColorIor[chgColorID] = isChg;
                                    gid_rtype_ior[chgColorID] =
                                        chg_ior
                                }
                                if (obj) {
                                    var MSorPOINT = "";
                                    if (top.choice_gtype == "bs") _ptype = "";
                                    if (top.choice_gtype == "bs") _imp = "";
                                    if (util_game.in_array(top.choice_gtype, gtype_setAry)) {
                                        if (ms_gid && _gid == ms_gid) MSorPOINT = "MS";
                                        if (point_gid && _gid == point_gid) MSorPOINT = "POINT";
                                        if (half_gid && _gid == half_gid) MSorPOINT = "HALF"
                                    }
                                    if (top.choice_gtype == "bs" && MSorPOINT == "MS") {
                                        var _ms = xmlnode.Node(tmp_game, "MS_SE").innerHTML;
                                        _ptype = LS_game.get("BS_game_" + _ms + "_set");
                                        _imp = "Y"
                                    }
                                    obj.MSorPOINT = MSorPOINT;
                                    obj.gtype = top.choice_gtype;
                                    var tmpShowType = "";
                                    if (top.choice_showtype == "mygame") if (top.choice_gtype == "ft") if (hasEC == "Y") tmpShowType = top["myGameHash"][top.choice_gtype][ECID]["showtype"]; else tmpShowType = top["myGameHash"][top.choice_gtype][gid]["showtype"]; else tmpShowType = top["myGameHash"][top.choice_gtype][ECID]["showtype"]; else if (isSpecialGame == "Y") {
                                        tmpShowType = top.choice_showtype;
                                        switch (myGameShowtype) {
                                            case "rb":
                                                tmpShowType = "live";
                                                break;
                                            case "fu":
                                            case "em":
                                                tmpShowType = "early";
                                                break
                                        }
                                    } else tmpShowType = top.choice_showtype;
                                    obj.showtype = tmpShowType;
                                    obj.gid = _gid;
                                    obj.ecid = ECID;
                                    obj.rtype = nowRtype;
                                    obj.wtype = nowWtype;
                                    obj.chose_team = nowRtype.substr(nowRtype.length - 1, 1);
                                    if (util.in_array(_wtype, needsTransWtype)) obj.remain_rtype = _rtype;
                                    if (util_game.checkWtypeIsSingle2016(nowWtype) || util_game.checkWtypeIsDouble2016(nowWtype) || util_game.checkWtypeIsSingle2017(nowWtype)) {
                                        obj.chose_team = nowRtype;
                                        obj.remain_rtype = _rtype
                                    }
                                    obj.is_rb = is_rb;
                                    obj.imp = _imp;
                                    obj.ptype = _ptype;
                                    obj.gameObj = tmp_game;
                                    var typeName = "";
                                    if (top.specialClick == "special") typeName = "special";
                                    obj.f =
                                        util_game.checkBetFrom(typeName, "R");
                                    util.addEvent(obj, "click", _self.showBetEvent, obj)
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    _self.getIorObj = function (gid, ecid, rtype, isOBT) {
        var _name = (isOBT ? "OBT_" : "") + "bet_" + gid + "_" + ecid + "_" + rtype;
        return dom.getElementById(_name)
    };
    _self.showPagination = function (_total, resize) {
        pageTotal = _total;
        if (page_no > pageTotal * 1) page_no = pageTotal * 1;
        pageObj.updateTotal(_total);
        if (_total * 1 == 1) pageObj.showPageDiv(false); else {
            pageObj.showPageDiv(true);
            pageObj.chgStyle("page_" + (win.Math.abs(win.orientation) == 0 ? "3" :
                "5"));
            pageObj.setBright(page_no, resize)
        }
    };
    _self.goPage = function (e, parObj) {
        _self.showGameLoading(true);
        var div_show = dom.getElementById("div_show");
        if (parObj["key"] == "next") page_no++; else if (parObj["key"] == "prev") page_no--; else page_no = parObj["val"];
        if (page_no <= 0) page_no = 1;
        if (page_no > pageTotal * 1) page_no = pageTotal * 1;
        div_show.innerHTML = "";
        parentClass.dispatchEvent("backToTop", {});
        _self.getData()
    };
    _self.initPDbtn = function (xmlnode, ecObj) {
        for (var j = 0; j < ecObj.length; j++) {
            var tmp_ec = ecObj[j];
            var ECID = tmp_ec.getAttribute("id").replace(/ec/,
                "");
            var gameObj = xmlnode.Node(tmp_ec, "game", false)[0];
            var _gid = xmlnode.Node(gameObj, "GID").innerHTML;
            var _key = _gid + "_" + ECID;
            var pdObj = dom.getElementById("div_PD_" + _key);
            var objids = ",pd_show_more_" + _key + ",";
            var ary = util.getObjAry(pdObj, objids);
            if (top["showPDmore"][_key]) util.addClass(pdObj, "on");
            util.addEvent(ary["pd_show_more_" + _key], "click", _self.showPDMore, {"div": pdObj, "keys": _key})
        }
    };
    _self.showPDMore = function (e, tarObj) {
        var tarDiv = tarObj.div;
        if (tarDiv.classList.contains("on")) util.removeClass(tarDiv,
            "on"); else util.addClass(tarDiv, "on");
        top["showPDmore"][tarObj.keys] = tarDiv.classList.contains("on")
    };
    _self.initOBTMenuBtn = function (xmlnode, ecObj) {
        var obtData = new Object;
        nowOBTMix_count = new Object;
        var noECData = true;
        var myGameShowtype = "";
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        for (var j = 0; j < ecObj.length; j++) {
            var tmp_ec = ecObj[j];
            var hasEC = tmp_ec.getAttribute("hasEC");
            var ECID = tmp_ec.getAttribute("id").replace(/ec/, "");
            if (top.choice_showtype ==
                "mygame" || isSpecialGame == "Y") myGameShowtype = tmp_ec.getAttribute("myGame");
            var tmp_game = xmlnode.Node(tmp_ec, "game", false)[0];
            var nowModel = xmlnode.Node(tmp_game, "NOW_MODEL").innerHTML;
            var dateTime = xmlnode.Node(tmp_game, "datetime").innerHTML;
            var sysTime = xmlnode.Node(tmp_game, "SYSTIME").innerHTML;
            var dateTime_split = dateTime.split(" ");
            var game_date = dateTime_split[0];
            var gmt = new Date(sysTime.replace(/-/g, "/"));
            var now_m = parseInt(gmt.getMonth() + 1);
            var now_date = _self.addZero(now_m) + "-" + _self.addZero(gmt.getDate());
            var getEarlyGame = "N";
            var isMyGameEarly = top.choice_showtype == "mygame" && myGameShowtype.match(/fu|em/);
            var isSpecialEarly = isSpecialGame == "Y" && myGameShowtype.match(/fu|em/);
            var isSpecialFantasy = top.specialClick != "" && top.specialGame.isFantasy;
            if (game_date != now_date && (isSpecialEarly || isMyGameEarly || isSpecialFantasy)) getEarlyGame = "Y";
            lastECID = ECID;
            var is_rb = isP3_R[ECID] ? "Y" : "N";
            var hasChgMode = tmpOBTModelHash[ECID] != nowModel && !(tmpOBTModelHash[ECID] == "HT" && nowModel == "FT");
            if (hasChgMode || isRB_OBT[ECID] != is_rb) _self.close_obt_proc(ECID);
            tmpOBTModelHash[ECID] = nowModel;
            isRB_OBT[ECID] = is_rb;
            if (hasEC == "Y" && nowModel != "PK") {
                noECData = false;
                var tmp_gid = xmlnode.Node(tmp_game, "GID").innerHTML;
                mainIor["gid_" + tmp_gid] = new Object;
                var menuObj = dom.getElementById("div_OBT_menu_" + ECID);
                if (!clusterize_sw && !menuObj) continue;
                var pageIndex = menuObj ? menuObj.getAttribute("data-page") : 0;
                var gameIndex = menuObj ? menuObj.getAttribute("data-gameindex") : 0;
                var objids = top.choice_showtype.match(/live|parlay/) ? ",OBT_RE,OBT_ROU," : ",OBT_R,OBT_OU,";
                if (top.choice_showtype ==
                    "mygame" || isSpecialGame == "Y") objids = myGameShowtype == "rb" ? ",OBT_RE,OBT_ROU," : ",OBT_R,OBT_OU,";
                objids += "OBT_MIX,OBT_ETMIX,OBT_CN,OBT_RN,OBT_WI,OBT_ET,OBT_PK,";
                var ary = util.getObjAry(menuObj, objids);
                var OBT_count = 0;
                nowOBT_count[ECID] = new Object;
                nowOBTMix_count[ECID] = new Object;
                var hasOne = false;
                OBT_WI_count[ECID] = 0;
                OBT_TQ_count[ECID] = 0;
                for (var i = 0; i < OBTAry.length; i++) {
                    var OBTcount = "";
                    var tmp_type = "";
                    if (OBTAry[i] == "WI") {
                        var TQcount = xmlnode.Node(tmp_ec, "TQ_COUNT").innerHTML;
                        var WIcount = xmlnode.Node(tmp_ec,
                            "WI_COUNT").innerHTML;
                        if (WIcount * 1 != 0) {
                            OBTcount = WIcount;
                            OBT_WI_count[ECID] = OBTcount * 1
                        } else if (TQcount * 1 != 0) {
                            OBTcount = TQcount;
                            OBT_TQ_count[ECID] = OBTcount * 1
                        }
                    } else OBTcount = xmlnode.Node(tmp_ec, OBTAry[i] + "_COUNT").innerHTML;
                    nowOBT_count[ECID][OBTAry[i]] = OBTcount;
                    if (OBTAry[i] == "R" || OBTAry[i] == "OU") nowOBTMix_count[ECID][OBTAry[i]] = OBTcount;
                    var tmp_type = top.choice_showtype.match(/live|parlay/) && OBT_rb_Ary[OBTAry[i]] != null ? OBT_rb_Ary[OBTAry[i]] : OBTAry[i];
                    if (top.choice_showtype == "mygame" || isSpecialGame == "Y") tmp_type =
                        myGameShowtype == "rb" && OBT_rb_Ary[OBTAry[i]] != null ? OBT_rb_Ary[OBTAry[i]] : OBTAry[i];
                    if (getMainIor.indexOf(tmp_type) != -1) {
                        var iorH = xmlnode.Node(tmp_ec, "IOR_" + tmp_type + "H").innerHTML;
                        var iorC = xmlnode.Node(tmp_ec, "IOR_" + tmp_type + "C").innerHTML;
                        mainIor["gid_" + tmp_gid]["IOR_" + tmp_type + "H"] = iorH;
                        mainIor["gid_" + tmp_gid]["IOR_" + tmp_type + "C"] = iorC;
                        var iorH_HT = xmlnode.Node(tmp_ec, "IOR_H" + tmp_type + "H").innerHTML;
                        var iorC_HT = xmlnode.Node(tmp_ec, "IOR_H" + tmp_type + "C").innerHTML;
                        mainIor["gid_" + tmp_gid]["IOR_H" + tmp_type +
                        "H"] = iorH_HT;
                        mainIor["gid_" + tmp_gid]["IOR_H" + tmp_type + "C"] = iorC_HT;
                        if (OBT_mix_Ary.indexOf(tmp_type) != -1) if (tmp_type.indexOf("OU") != -1) {
                            var ratioO = xmlnode.Node(tmp_ec, "RATIO_" + tmp_type + "O").innerHTML;
                            var ratioU = xmlnode.Node(tmp_ec, "RATIO_" + tmp_type + "U").innerHTML;
                            var ratioO_HT = xmlnode.Node(tmp_ec, "RATIO_H" + tmp_type + "O").innerHTML;
                            var ratioU_HT = xmlnode.Node(tmp_ec, "RATIO_H" + tmp_type + "U").innerHTML;
                            mainIor["gid_" + tmp_gid]["RATIO_H" + tmp_type + "O"] = ratioO_HT;
                            mainIor["gid_" + tmp_gid]["RATIO_H" + tmp_type + "U"] =
                                ratioU_HT;
                            mainIor["gid_" + tmp_gid]["RATIO_" + tmp_type + "O"] = ratioO;
                            mainIor["gid_" + tmp_gid]["RATIO_" + tmp_type + "U"] = ratioU
                        } else {
                            var ratioR = xmlnode.Node(tmp_ec, "RATIO_" + tmp_type).innerHTML;
                            var ratioR_HT = xmlnode.Node(tmp_ec, "RATIO_H" + tmp_type).innerHTML;
                            mainIor["gid_" + tmp_gid]["RATIO_" + tmp_type] = ratioR;
                            mainIor["gid_" + tmp_gid]["RATIO_H" + tmp_type] = ratioR_HT
                        }
                    }
                    if (OBTcount != null && OBTcount * 1 != 0 && ary["OBT_" + tmp_type] != null) {
                        var isMyGameR = top.choice_showtype == "mygame" && myGameShowtype != "rb";
                        var isParlayR = top.choice_showtype ==
                            "parlay" && is_rb == "N";
                        var isSpecialR = isSpecialGame == "Y" && is_rb == "N";
                        if ((isMyGameR || isParlayR || isSpecialR) && util.in_array(tmp_type, OBT_notShowAry)) {
                            ary["OBT_" + tmp_type].style.display = "none";
                            continue
                        }
                        hasOne = true;
                        if (OBT_mix_Ary.indexOf(tmp_type) != -1) {
                            ary["OBT_MIX"].style.display = "";
                            MixObtRtype[ECID] = tmp_type;
                            tmp_type = "MIX"
                        } else ary["OBT_" + tmp_type].style.display = "";
                        if (nowModel == "ET" && OBT_ETAry.indexOf(tmp_type) != -1) {
                            var newMode = nowModel + tmp_type;
                            ary["OBT_" + tmp_type].innerHTML = util_game.showTxt(LS_game.get(newMode))
                        }
                        OBT_count++
                    }
                    var click_type =
                        tmp_type;
                    if (nowModel == "ET") click_type = "ET" + tmp_type;
                    util.addEvent(ary["OBT_" + tmp_type], "click", _self.chgDiv, {
                        "obj": ary["OBT_" + tmp_type],
                        "ECID": ECID,
                        "model": click_type,
                        "pageIndex": pageIndex,
                        "gameIndex": gameIndex,
                        "isEarly": getEarlyGame,
                        "myGameShowtype": myGameShowtype
                    });
                    if (top.choice_gtype == "ft" && first_OBTMenuBtn) if (OBTcount != 0) if (util.countSize(obtData) == 0) obtData = {
                        "obj": ary["OBT_" + tmp_type],
                        "ECID": ECID,
                        "model": click_type,
                        "pageIndex": pageIndex,
                        "gameIndex": gameIndex,
                        "isEarly": getEarlyGame,
                        "myGameShowtype": myGameShowtype
                    }
                }
                var obtObj =
                    dom.getElementById("div_OBT_" + ECID);
                if (obtObj) obtObj.style.display = hasOne ? "" : "none";
                var dragParam = new Object;
                dragParam["tagName"] = ECID;
                dragParam["nowModel"] = nowModel;
                dragParam["isEarly"] = getEarlyGame;
                dragParam["myGameShowtype"] = myGameShowtype;
                if (top.mobile == "N") util.dragScroll(dom, "div_OBT_menu_" + ECID, _self.addOBTClick, _self.removeOBTClick, dragParam)
            }
        }
        if (lastNowModel[ECID]) if (lastNowModel[ECID] != nowModel && !(lastNowModel[ECID] == "HT" && nowModel == "FT")) _self.close_obt_proc(ECID);
        lastNowModel[ECID] = nowModel;
        if (noECData) top["showOBT"] = "";
        if (!first_OBTMenuBtn && top["showOBT"] != "" && !nowOBTMix_count[top["showOBT"].split("_")[0]]) top["showOBT"] = "";
        if (top["showOBT"] != null && top["showOBT"] != "") {
            var tmpECID = top["showOBT"].split("_")[0];
            var tmpModel = top["showOBT"].split("_")[1];
            var pageIndex = top["showOBT"].split("_")[2];
            var gameIndex = top["showOBT"].split("_")[3];
            var _par = new Object;
            var menuObj = dom.getElementById("div_OBT_menu_" + tmpECID);
            if (tmpModel.match(/\bH/) || tmpModel.match(/\bETH/)) {
                var FullMode = tmpModel.replace(/\bH/,
                    "");
                FullMode = FullMode.replace(/\bETH/, "");
                var _HTmodel = tmpModel.replace(/ET/, "");
                var objids = ",OBT_" + FullMode + ",";
                var ary = util.getObjAry(menuObj, objids);
                if (ary["OBT_" + FullMode] != null) util.addClass(ary["OBT_" + FullMode], "on");
                _lastOBT_tab = ary["OBT_" + FullMode];
                var showObj = dom.getElementById("div_OBT_show_" + tmpECID);
                var objids2 = ",COURT_" + _HTmodel + ",";
                var ary2 = util.getObjAry(showObj, objids2);
                _par["obj"] = ary2["COURT_" + _HTmodel];
                _par["ECID"] = tmpECID;
                _par["chose_model"] = tmpModel;
                _par["pageIndex"] = pageIndex;
                _par["gameIndex"] = gameIndex;
                try {
                    _par["isEarly"] = top["showOBT"].split("_")[4]
                } catch (e) {
                    console.log(e)
                }
                _self.chgCourt(null, _par)
            } else {
                var tmp_model = tmpModel.indexOf("ET") != -1 && tmpModel != "ET" ? tmpModel.replace("ET", "") : tmpModel;
                var objids = ",OBT_" + tmp_model + ",";
                var ary = util.getObjAry(menuObj, objids);
                var _par = new Object;
                _par["obj"] = ary["OBT_" + tmp_model];
                _par["ECID"] = tmpECID;
                _par["model"] = tmpModel;
                _par["pageIndex"] = pageIndex;
                _par["gameIndex"] = gameIndex;
                try {
                    _par["isEarly"] = top["showOBT"].split("_")[4]
                } catch (e) {
                    console.log(e)
                }
                _self.chgDiv(null,
                    _par)
            }
        }
        if (top.choice_gtype == "ft" && top.showOBT == "" && obtData["obj"] != undefined && obtData["ECID"] != undefined) if (first_OBTMenuBtn) _self.chgDiv("default", obtData);
        if (clusterize_sw && first_Clusterize) first_Clusterize = false; else first_OBTMenuBtn = false
    };
    _self.close_obt_proc = function (ecid) {
        var divOBT = dom.getElementById("div_OBT_show_" + ecid);
        var OBT_close = dom.getElementById("OBT_close_" + ecid);
        if (divOBT) {
            var isShowOBT = divOBT.style.display == "";
            if (isShowOBT) _self.closeOBT(null, {
                "closeObj": divOBT, "closeBtn": OBT_close,
                "ECID": ecid
            })
        }
    };
    _self.getOBTCount = function (xmlnode, gameObj) {
        var _count = 0;
        var nowModel = xmlnode.Node(gameObj, "NOW_MODEL").innerHTML;
        var hasEC = xmlnode.Node(gameObj, "ECID").innerHTML != "" ? "Y" : "N";
        if (hasEC == "Y" && nowModel != "PK") for (var i = 0; i < OBTAry.length; i++) {
            var OBTcount = xmlnode.Node(gameObj, OBTAry[i] + "_COUNT").innerHTML;
            if (OBTcount * 1 != 0) _count++
        }
        return _count
    };
    _self.initOBT = function () {
        if (_lastOBT_div != null && _lastOBT_close != null) {
            var tmpObj = dom.getElementById(_lastOBT_div.getAttribute("id"));
            if (tmpObj) {
                _lastCourt_tab =
                    null;
                tmpObj.innerHTML = "";
                tmpObj.style.display = "none";
                _lastOBT_close.style.display = "none";
                util.removeEvent(_lastOBT_close, "click")
            }
            var tmpECID = _lastOBT_div.getAttribute("id").split("_")[3];
            var menuShow = dom.getElementById("div_OBT_menu_" + tmpECID);
            if (menuShow) util.removeClass(menuShow, "on");
            OBT_closed = tmpECID
        }
    };
    _self.chgDiv = function (MouseClick, hash) {
        isClickOBT = MouseClick != null;
        var nowOBT_Model = top["showOBT"].split("_")[1];
        var nowOBT_ECID = top["showOBT"].split("_")[0];
        if (MouseClick != null) util.clearObject(obtScrollHash);
        if (_lastOBT_div != null) {
            var tmpECID = _lastOBT_div.getAttribute("id").split("_")[3];
            if (tmpECID != hash["ECID"] && isClickOBT && clusterize_sw) _self.updateOBTRowData("remove", "")
        }
        if (isClickOBT) _self.initOBT();
        var tarObj = hash["obj"];
        var tarECID = hash["ECID"];
        var model = hash["model"];
        var isEarly = hash["isEarly"];
        ec_chg = tarECID != nowOBT_ECID;
        if (ec_chg && nowOBT_ECID != "") {
            var last_OBT = dom.getElementById("div_OBT_show_" + nowOBT_ECID);
            var last_OBT_close = dom.getElementById("OBT_close_" + nowOBT_ECID);
            if (last_OBT && last_OBT_close) _self.closeOBT(null,
                {"closeObj": last_OBT, "closeBtn": last_OBT_close, "ECID": nowOBT_ECID})
        }
        if (_lastOBT_tab != null) util.removeClass(_lastOBT_tab, "on");
        if (tarObj != null) util.addClass(tarObj, "on");
        _lastOBT_tab = tarObj;
        if (model != nowOBT_Model && tarECID == nowOBT_ECID) {
            _lastCourt_tab = null;
            if (_lastOBT_tab && top["showOBT"] != "") _self.obt_menu_move(_lastOBT_tab, nowOBT_ECID)
        }
        if (MouseClick != null) _self.showOBTLoading(tarECID, true);
        var modelCount = _self.getNowOBTcount(tarECID, model);
        var divOBT = dom.getElementById("div_OBT_show_" + tarECID);
        if (modelCount *
            1 != 0) {
            if (mainModel[tarECID] != "PK") {
                top["showOBT"] = tarECID + "_" + model + "_" + hash["pageIndex"] + "_" + hash["gameIndex"] + "_" + isEarly;
                if (divOBT != null) _self.getOBT(model, tarECID, isClickOBT, isEarly, MouseClick)
            }
        } else {
            var OBT_close = dom.getElementById("OBT_close_" + tarECID);
            _self.closeOBT(null, {"closeObj": divOBT, "closeBtn": OBT_close, "ECID": tarECID})
        }
    };
    _self.getOBT = function (model, ecid, _isClickOBT, isEarly, MouseClick) {
        if (top["showOBT"] == "") return;
        nowTS = util_game.getTimestamp();
        var isSpecialGame = top.specialClick != "" &&
        !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        var param = "";
        param += top.param;
        param += "&p=get_game_OBT";
        if (postHash["url_param"]) param += "&" + postHash["url_param"];
        var is_rb = isP3_R[ecid] ? "Y" : "N";
        var tmpShowType = "";
        if (isSpecialGame == "Y") {
            tmpShowType = top.choice_showtype;
            if (isEarly == "Y") tmpShowType = "early"; else if (is_rb == "Y") tmpShowType = "live"
        } else tmpShowType = top.choice_showtype;
        var isETWI = "N";
        param += "&gtype=" + top.choice_gtype;
        param += "&showtype=" + tmpShowType;
        param += "&isSpecial=" + top.specialClick;
        param += "&isEarly=" + isEarly;
        if (model.indexOf("MIX") != -1) {
            mixModel = MixObtRtype[ecid] + "|" + model;
            param += "&model=" + mixModel
        } else if (model.indexOf("WI") != -1) {
            if (OBT_WI_count[ecid] * 1 >= 1) param += "&model=WI"; else param += "&model=TQ";
            if (model == "ETWI") isETWI = "Y"
        } else param += "&model=" + model;
        param += "&isETWI=" + isETWI;
        param += "&ecid=" + ecid;
        param += "&ltype=" + top["userData"].ltype;
        param += "&is_rb=" + is_rb;
        param += "&ts=" + nowTS;
        if (_isClickOBT) {
            param += "&isClick=Y";
            OBT_Needs_Parse = true
        }
        if (MouseClick == "rmStar") param += "&act=" +
            MouseClick;
        var _len = obtRequestAry.length;
        if (_len != 0) while (_len-- > 0) {
            var req = obtRequestAry.shift();
            if (req["ecid"] == ecid) {
                _self.showOBTLoading(req["ecid"], false);
                req["request"].abort()
            }
        }
        var hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), null);
        var hrObj = new Object;
        hrObj["request"] = hr;
        hrObj["ecid"] = ecid;
        obtRequestAry.push(hrObj);
        hr.setParentclass(childClass);
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("onAbort", _self.OBTAbort);
        hr.addEventListener("LoadComplete", function (xml) {
            _self.LoadOBTComplete(xml, model, ecid, _isClickOBT)
        });
        hr.loadURL(top.m2_url, "POST", param)
    };
    _self.onError = function (e) {
        console.log("onError!! ");
        timerHash["gameTimer"].startTimer()
    };
    _self.OBTAbort = function (req) {
        echo("OBTAbort!!");
        timerHash["gameTimer"].startTimer()
    };
    _self.LoadOBTComplete = function (xml, model, tarECID, _isClickOBT) {
        if (timerHash["gameTimer"] != null) timerHash["gameTimer"].startTimer();
        _self.paramHash["errorMsg"] = util.showConnectMsg(xml);
        if (util.alertConnectMsg(_self.paramHash["errorMsg"])) return;
        obt_xml = util.parseXml(xml);
        var tmpTS = obt_xml.Node(obt_xml.Root[0], "ts").innerHTML;
        if (!util_game.checkTS(nowTS, tmpTS, "get_game_OBT")) {
            console.log("nowTS:" + nowTS + " tmpTS:" + tmpTS + " ts\u932f\u8aa4!!!!!!\u4e0d\u7e7c\u7e8c\u57f7\u884c");
            return
        }
        if (timerHash["gameTimer"] != null) timerHash["gameTimer"].stopTimer();
        if (_isClickOBT || OBT_Needs_Parse) _self.parseOBTData(obt_xml); else _self.reAddOBTFunc(model, tarECID)
    };
    _self.parseOBTData = function (xmlnode) {
        echo("parseOBTData");
        OBT_Needs_Parse = false;
        var tmpEcAry = new Object;
        var xmdObj = new Object;
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        var code = xmlnode.Node(xmlnode.Root[0], "code").innerHTML;
        var ecid = xmlnode.Node(xmlnode.Root[0], "ecid", false)[0].innerHTML;
        var model = xmlnode.Node(xmlnode.Root[0], "model", false)[0].innerHTML;
        var nowOBT_ECID = top["showOBT"].split("_")[0];
        var nowOBT_Model = top["showOBT"].split("_")[1];
        var _len = obtRequestAry.length;
        var i = 0;
        var OBT_MIX_Model = OBT_MIX_wtype;
        while (_len-- > 0) if (obtRequestAry[i]["ecid"] ==
            ecid) obtRequestAry = util.aryRemove(obtRequestAry, i);
        if (ecid != nowOBT_ECID || model != nowOBT_Model && model != null) {
            if (ecid != nowOBT_ECID) _self.close_obt_proc(ecid);
            _self.showOBTLoading(ecid, false);
            return
        }
        if (code == "noData") {
            var _ecid = xmlnode.Node(xmlnode.Root[0], "ecid").innerHTML;
            var divOBT = dom.getElementById("div_OBT_show_" + _ecid);
            var OBT_close = dom.getElementById("OBT_close_" + _ecid);
            if (divOBT) {
                var isShowOBT = divOBT.style.display == "";
                if (isShowOBT) _self.closeOBT(null, {"closeObj": divOBT, "closeBtn": OBT_close, "ECID": _ecid})
            }
            echo("OBT no data");
            _self.showOBTLoading(_ecid, false);
            return
        }
        xmdObj["ec"] = xmlnode.Node(xmlnode.Root[0], "ec", false);
        xmdObj["game"] = xmlnode.Node(xmdObj["ec"][0], "game", false);
        var TEAM_H = xmlnode.Node(xmdObj["game"][0], "TEAM_H").innerHTML;
        var TEAM_C = xmlnode.Node(xmdObj["game"][0], "TEAM_C").innerHTML;
        var STRONG = xmlnode.Node(xmdObj["game"][0], "STRONG").innerHTML;
        var HSTRONG = xmlnode.Node(xmdObj["game"][0], "HSTRONG").innerHTML;
        var PTYPE = xmlnode.Node(xmdObj["game"][0], "PTYPE").innerHTML;
        var div_show = dom.getElementById("div_OBT_show_" +
            ecid);
        if (div_show == null) return;
        tmpEcAry[ecid] = obtScrollHash[ecid] ? obtScrollHash[ecid] : 0;
        var menuShow = dom.getElementById("div_OBT_menu_" + ecid);
        util.addClass(menuShow, "on");
        if (model.indexOf("ET") != -1 && model != "ET") {
            model = model.replace(/ET/, "");
            if (OBT_ETAry.indexOf(model) != -1) model = "ET" + model
        }
        var is_rb = isP3_R[ecid] ? "Y" : "N";
        if (top["choice_showtype"] != "live" && is_rb == "N") {
            var goFT = _self.getCourtOpen(xmdObj["game"], "FT");
            var goHT = _self.getCourtOpen(xmdObj["game"], "HT");
            if (!goFT && goHT && OBT_transHT[model] !=
                null) {
                var pageIndex = top["showOBT"].split("_")[2];
                var gameIndex = top["showOBT"].split("_")[3];
                var isEarly = top["showOBT"].split("_")[4];
                model = OBT_transHT[model];
                top["showOBT"] = ecid + "_" + model + "_" + pageIndex + "_" + gameIndex + "_" + isEarly
            }
        }
        var OBT_model = _self.getOBTLayer(ecid, model);
        var tmpOBT_model;
        var tmpDiv = "";
        halfAry = new Object;
        if (util.in_array(model, OBT_loop)) {
            var tpl = new fastTemplate_a1;
            tpl.init(OBT_model.cloneNode(true))
        } else tmpOBT_model = OBT_model.cloneNode(true);
        if (model.indexOf("MIX") != -1) {
            TEAM_H =
                TEAM_H.replace(PTYPE, "");
            TEAM_H = TEAM_H.replace("[Mid]", "").replace("[\u4e2d]", "");
            TEAM_C = TEAM_C.replace(PTYPE, "");
            TEAM_C = TEAM_C.replace("[Mid]", "").replace("[\u4e2d]", "");
            var STRONG_TAG = model.match(/HMIX/) ? "STRONG_" + HSTRONG : "STRONG_" + STRONG;
            var nowShowRtype = xmlnode.Node(xmlnode.Root[0], "nowShowRtype", false)[0].innerHTML;
            tpl.addBlock("OBT_TEAM_" + model);
            tpl.replace(new RegExp("\\*TEAM_H\\*", "gi"), util_game.showTxt(TEAM_H));
            tpl.replace(new RegExp("\\*TEAM_C\\*", "gi"), util_game.showTxt(TEAM_C));
            tpl.replace(new RegExp("\\*" + STRONG_TAG + "\\*", "i"), "strong_team");
            tpl.addBlock("OBT_MORE_" + model);
            tpl.replace(new RegExp("\\*ECID\\*", "gi"), util_game.showTxt(ecid));
            if (is_rb == "N") for (var w = 0; w < OBT_MIX_wtype.length; w++) if (nowOBTMix_count[ecid] && nowOBTMix_count[ecid][OBT_MIX_wtype[w]] == 0) {
                tpl.addBlock("OBT_" + model + OBT_MIX_wtype[w] + "_EMPTY");
                tpl.replace(new RegExp("\\*TABLE_EMPTY\\*", "gi"), "table_empty")
            }
        }
        var GameHash = util_game.convertNodeToHashForOBTGame(xmlnode.Root[0]);
        var dataHash = GameHash["obj"];
        var gidCount = 0;
        for (var tmpECID in dataHash) for (var _key in dataHash[tmpECID]) {
            var tmp_game = dataHash[tmpECID][_key];
            var _gid = tmp_game["gid"];
            gidCount++;
            if (gid_count_max - gidCount < 0) continue;
            if (mainIor["gid_" + _gid] != null) for (var ior_key in mainIor["gid_" + _gid]) dataHash[tmpECID][_key][ior_key.toLowerCase()] = util_game.showTxt(mainIor["gid_" + _gid][ior_key]);
            var eo_ary = [["REOO", "REOE"], ["HREOO", "HREOE"]];
            for (var e = 0; e < eo_ary.length; e++) {
                var tmpAry = eo_ary[e];
                if (tmp_game["ior_" + tmpAry[0].toLowerCase()] && tmp_game["ior_" +
                tmpAry[1].toLowerCase()]) {
                    var ior_h = tmp_game["ior_" + tmpAry[0].toLowerCase()] * 1 - 1;
                    var ior_c = tmp_game["ior_" + tmpAry[1].toLowerCase()] * 1 - 1;
                    var hash_hc = util_game.chgOddfIoratio(ior_h, ior_c, config_ior, "HK");
                    if (!isNaN(hash_hc[0])) dataHash[tmpECID][_key]["ior_" + tmpAry[0].toLowerCase()] = hash_hc[0] * 1 + 1;
                    if (!isNaN(hash_hc[1])) dataHash[tmpECID][_key]["ior_" + tmpAry[1].toLowerCase()] = hash_hc[1] * 1 + 1
                }
            }
            if (top.choice_showtype != "parlay") {
                var ior_ary = [["REH", "REC"], ["ROUH", "ROUC"], ["HREH", "HREC"], ["HROUH", "HROUC"], ["RNCH",
                    "RNCC"], ["RNBH", "RNBC"], ["RSHY", "RSHN"], ["RSCY", "RSCN"], ["RH", "RC"], ["OUH", "OUC"], ["HRH", "HRC"], ["HOUH", "HOUC"]];
                for (var k = 0; k < ior_ary.length; k++) {
                    var tmpAry = ior_ary[k];
                    if (tmp_game["ior_" + tmpAry[0].toLowerCase()] && tmp_game["ior_" + tmpAry[1].toLowerCase()]) {
                        var ior_h = tmp_game["ior_" + tmpAry[0].toLowerCase()];
                        var ior_c = tmp_game["ior_" + tmpAry[1].toLowerCase()];
                        var hash_hc = util_game.chgOddfIoratio(ior_h, ior_c, config_ior);
                        if (!isNaN(hash_hc[0])) dataHash[tmpECID][_key]["ior_" + tmpAry[0].toLowerCase()] = hash_hc[0] *
                            1;
                        if (!isNaN(hash_hc[1])) dataHash[tmpECID][_key]["ior_" + tmpAry[1].toLowerCase()] = hash_hc[1] * 1
                    }
                }
            }
            if (model.indexOf("MIX") != -1) {
                obtScrollHash[ecid] = new Object;
                tmpEcAry[ecid] = new Object;
                for (r = 0; r < OBT_MIX_wtype.length; r++) {
                    var tmpRtype = "";
                    if (top.choice_showtype == "mygame" && top["myGameHash"][top.choice_gtype][tmpECID] != null) tmpRtype = top["myGameHash"][top.choice_gtype][tmpECID]["showtype"] == "live" ? "rb" : "r"; else if (isSpecialGame == "Y") tmpRtype = is_rb == "Y" ? "rb" : "r"; else tmpRtype = top.choice_rtype;
                    OBT_MIX_Model =
                        tmpRtype == "rb" ? OBT_LIVE_MIX_wtype : OBT_MIX_wtype;
                    tmpEcAry[ecid][OBT_MIX_Model[r]] = obtScrollHash[ecid][OBT_MIX_Model[r]] ? obtScrollHash[ecid][OBT_MIX_Model[r]] : 0;
                    tpl.addBlock("OBT" + model.toUpperCase() + OBT_MIX_Model[r]);
                    var rAry = OBT[model + "_" + tmpRtype];
                    for (var i = 0; i < rAry.length; i++) {
                        var keys = rAry[i];
                        var vals = tmp_game[keys.toLowerCase()];
                        vals = _self.checkRatioR(keys, vals, tmp_game);
                        vals = _self.checkRatioOU(keys, vals, tmp_game);
                        if (keys.indexOf("GID") != -1 && model.match(/\bH/)) vals = tmp_game["hgid"]; else if (keys.indexOf("IOR") !=
                            -1) {
                            var tag = keys.split("_")[1];
                            vals = util_game.getIoratio(vals, null, tag);
                            vals = util_game.showTxt(vals);
                            var closeKey = "CLOSE_" + tag;
                            tpl.replace(new RegExp("\\*" + closeKey + "\\*", "i"), util_game.showTxt(util_game.lockIor(vals)))
                        }
                        tpl.replace(new RegExp("\\*" + keys + "\\*", "gi"), util_game.showTxt(vals))
                    }
                }
            } else if (util.in_array(model, OBT_loop)) {
                if (model.match(/\bH/) && tmp_game["hnike"] == "N") continue;
                tpl.addBlock("OBT" + model.toUpperCase());
                var tmpRtype = "";
                if (top.choice_showtype == "mygame" && top["myGameHash"][top.choice_gtype][tmpECID] !=
                    null) tmpRtype = top["myGameHash"][top.choice_gtype][tmpECID]["showtype"] == "live" ? "rb" : "r"; else if (isSpecialGame == "Y") tmpRtype = is_rb == "Y" ? "rb" : "r"; else tmpRtype = top.choice_rtype;
                var rAry = OBT[model + "_" + tmpRtype];
                for (var i = 0; i < rAry.length; i++) {
                    var keys = rAry[i];
                    var vals = tmp_game[keys.toLowerCase()];
                    vals = _self.checkRatioR(keys, vals, tmp_game);
                    vals = _self.checkRatioOU(keys, vals, tmp_game);
                    if (keys.indexOf("GID") != -1 && model.match(/\bH/)) vals = tmp_game["hgid"]; else if (keys.indexOf("TEAM") != -1) {
                        var ptype = tmp_game["ptype"];
                        vals = vals.replace(ptype, "");
                        vals = vals.replace("[Mid]", "").replace("[\u4e2d]", "")
                    } else if (keys.indexOf("IOR") != -1) {
                        var tag = keys.split("_")[1];
                        vals = util_game.getIoratio(vals, null, tag);
                        vals = util_game.showTxt(vals);
                        var closeKey = "CLOSE_" + tag;
                        tpl.replace(new RegExp("\\*" + closeKey + "\\*", "i"), util_game.showTxt(util_game.lockIor(vals)))
                    }
                    tpl.replace(new RegExp("\\*" + keys + "\\*", "gi"), util_game.showTxt(vals))
                }
            } else {
                var tmpRtype = "";
                if (top.choice_showtype == "mygame" && top["myGameHash"][top.choice_gtype][tmpECID] !=
                    null) tmpRtype = top["myGameHash"][top.choice_gtype][tmpECID]["showtype"] == "live" ? "rb" : "r"; else if (isSpecialGame == "Y") tmpRtype = is_rb == "Y" ? "rb" : "r"; else tmpRtype = top.choice_rtype;
                var rAry = OBT[model + "_" + tmpRtype];
                for (var i = 0; i < rAry.length; i++) {
                    var keys = rAry[i];
                    var vals = tmp_game[keys.toLowerCase()];
                    vals = _self.checkRatioR(keys, vals, tmp_game);
                    vals = _self.checkRatioOU(keys, vals, tmp_game);
                    if (keys.indexOf("TEAM") != -1) {
                        var ptype = tmp_game["ptype"];
                        vals = vals.replace(ptype, "");
                        if (keys == "TEAM_H") vals = vals.replace("[Mid]",
                            "").replace("[\u4e2d]", "")
                    } else if (keys.indexOf("STRONG") != -1) {
                        var tag = keys.split("_")[1];
                        var strong = tmp_game["strong"];
                        vals = tag == strong ? "strong_team" : ""
                    } else if (keys.indexOf("IOR") != -1) {
                        var tag = keys.split("_")[1];
                        vals = util_game.getIoratio(vals, null, tag);
                        vals = util_game.showTxt(vals);
                        var closeKey = "CLOSE_" + tag;
                        tmpOBT_model.innerHTML = tmpOBT_model.innerHTML.replace(new RegExp("\\*" + closeKey + "\\*", "i"), util_game.showTxt(util_game.lockIor(vals)))
                    } else if (keys.indexOf("LASTESTSCORE") != -1) vals = vals !=
                    "" ? "last_goal" : ""; else if (keys.indexOf("WTYPE") != -1) vals = LS_game.get("str_" + vals);
                    tmpOBT_model.innerHTML = tmpOBT_model.innerHTML.replace(new RegExp("\\*" + keys + "\\*", "gi"), util_game.showTxt(vals))
                }
                tmpDiv += tmpOBT_model.innerHTML
            }
        }
        if (model.indexOf("MIX") != -1 && gidCount - gid_count_min < 0) {
            var needAddCount = gid_count_min - gidCount;
            for (var k = 1; k <= needAddCount; k++) for (var l = 0; l < OBT_MIX_Model.length; l++) {
                tpl.addBlock("OBT" + model.toUpperCase() + OBT_MIX_Model[l]);
                tpl.replace(new RegExp("\\*GID\\*", "i"), util_game.showTxt(ecid +
                    "_" + k));
                tpl.replace(new RegExp("\\*OBT_BLANK\\*", "i"), "odd_empty")
            }
        }
        nowOBTGameHash = util.clone(dataHash);
        if (util.in_array(model, OBT_loop)) {
            tmpDiv = tpl.fastPrint();
            var needHT = false;
            var is_rb = isP3_R[ecid] ? "Y" : "N";
            if (top.choice_showtype != "live" && is_rb == "N") needHT = _self.getCourtOpen(xmdObj["game"], "HT"); else needHT = !_self.getHNIKE(xmdObj["game"]);
            var isShow = !needHT ? "style='display:none'" : "";
            tmpDiv = tmpDiv.replace(new RegExp("\\*OBT_HALF_DISPLAY\\*", "gi"), util_game.showTxt(isShow))
        }
        div_show.innerHTML =
            tmpDiv;
        _lastOBT_div = div_show.cloneNode(true);
        div_show.style.display = "";
        if (model.indexOf("RN") != -1) {
            var _extra = dom.getElementById("div_OBT_RN_icon_" + ecid);
            if (top.mobile != "Y") _extra.classList.add("info_on");
            util.addEvent(_extra, "click", _self.showExtraInfo, {
                "ptype": "RN",
                "hasEC": "N",
                "mainScore": "",
                "extraScore": ""
            })
        }
        var btn_close = dom.getElementById("OBT_close_" + ecid);
        var btn_more = dom.getElementById("OBT_more_" + ecid);
        btn_close.style.display = "";
        _lastOBT_close = btn_close;
        util.addEvent(btn_close, "click", _self.closeOBT,
            {"closeObj": div_show, "closeBtn": btn_close, "ECID": ecid});
        if (model.indexOf("MIX") != -1) util.addEvent(btn_more, "click", _self.clickMore, more_param_obj[ecid]);
        _self.initOBTIorBtn(xmlnode, xmdObj["ec"]);
        _self.initOBTChgCourt(xmlnode, xmdObj["ec"], div_show);
        _self.chkHideHalf(halfAry);
        if (model.indexOf("MIX") != -1) obtScrollHash = _self.setScroll("table_obt_bet", tmpEcAry); else obtScrollHash = _self.setScroll("ratioShow_OBT", tmpEcAry);
        chgColorIor = util_game.chgIorColor(dom, util, chgColorIor);
        util_game.initSelect(util);
        if (OBT_closed != "" || firstLoadObt) {
            var obt_loading = dom.getElementById("OBT_loading_" + ecid);
            util.addClass(obt_loading, "obt_chg")
        }
        OBT_closed = "";
        if (firstLoadObt) firstLoadObt = false;
        if (isClickOBT && clusterize_sw) _self.updateOBTRowData("add", div_show.innerHTML);
        var obj_obt = dom.getElementsByClassName("btn_menu_obt on")[0];
        if (ec_chg && obj_obt) {
            _self.obt_menu_move(obj_obt, ecid);
            ec_chg = false
        }
        if (lastECID_scroll) {
            dom.getElementById("body_show").scrollTop = dom.getElementById("body_show").scrollHeight;
            lastECID_scroll =
                false
        }
        _self.showOBTLoading(ecid, false)
    };
    _self.reAddOBTFunc = function (_MODEL, _ECID) {
        var xmdObj = new Object;
        var tmpEcAry = new Object;
        var div_show = dom.getElementById("div_OBT_show_" + _ECID);
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        var is_rb = isP3_R[_ECID] ? "Y" : "N";
        if (div_show == null) return;
        var OBT_MIX_Model = OBT_MIX_wtype;
        var _len = obtRequestAry.length;
        var i = 0;
        while (_len-- > 0) if (obtRequestAry[i]["ecid"] == _ECID) obtRequestAry = util.aryRemove(obtRequestAry,
            i);
        xmdObj["ec"] = obt_xml.Node(obt_xml.Root[0], "ec", false);
        xmdObj["game"] = obt_xml.Node(xmdObj["ec"][0], "game", false);
        var TEAM_H = xmlnode.Node(xmdObj["game"][0], "TEAM_H").innerHTML;
        var TEAM_C = xmlnode.Node(xmdObj["game"][0], "TEAM_C").innerHTML;
        var STRONG = xmlnode.Node(xmdObj["game"][0], "STRONG").innerHTML;
        var HSTRONG = xmlnode.Node(xmdObj["game"][0], "HSTRONG").innerHTML;
        var PTYPE = xmlnode.Node(xmdObj["game"][0], "PTYPE").innerHTML;
        if (_MODEL.indexOf("ET") != -1 && _MODEL != "ET") {
            _MODEL = _MODEL.replace(/ET/, "");
            if (OBT_ETAry.indexOf(_MODEL) !=
                -1) _MODEL = "ET" + _MODEL
        }
        var OBT_model = _self.getOBTLayer(_ECID, _MODEL);
        var tmpOBT_model;
        var tmpDiv = "";
        halfAry = new Object;
        if (util.in_array(_MODEL, OBT_loop)) {
            var tpl = new fastTemplate_a1;
            tpl.init(OBT_model.cloneNode(true))
        } else tmpOBT_model = OBT_model.cloneNode(true);
        if (_MODEL.indexOf("MIX") != -1) {
            TEAM_H = TEAM_H.replace(PTYPE, "");
            TEAM_H = TEAM_H.replace("[Mid]", "").replace("[\u4e2d]", "");
            TEAM_C = TEAM_C.replace(PTYPE, "");
            TEAM_C = TEAM_C.replace("[Mid]", "").replace("[\u4e2d]", "");
            var STRONG_TAG = _MODEL.match(/HMIX/) ?
                "STRONG_" + HSTRONG : "STRONG_" + STRONG;
            var nowShowRtype = xmlnode.Node(xmlnode.Root[0], "nowShowRtype", false)[0].innerHTML;
            tpl.addBlock("OBT_TEAM_" + _MODEL);
            tpl.replace(new RegExp("\\*TEAM_H\\*", "gi"), util_game.showTxt(TEAM_H));
            tpl.replace(new RegExp("\\*TEAM_C\\*", "gi"), util_game.showTxt(TEAM_C));
            tpl.replace(new RegExp("\\*" + STRONG_TAG + "\\*", "i"), "strong_team");
            tpl.addBlock("OBT_MORE_" + _MODEL);
            tpl.replace(new RegExp("\\*ECID\\*", "gi"), util_game.showTxt(_ECID));
            if (is_rb == "N") for (var w = 0; w <
            OBT_MIX_wtype.length; w++) if (nowOBTMix_count[_ECID] && nowOBTMix_count[_ECID][OBT_MIX_wtype[w]] == 0) {
                tpl.addBlock("OBT_" + _MODEL + OBT_MIX_wtype[w] + "_EMPTY");
                tpl.replace(new RegExp("\\*TABLE_EMPTY\\*", "gi"), "table_empty")
            }
        }
        var GameHash = util_game.convertNodeToHashForOBTGame(obt_xml.Root[0]);
        var dataHash = GameHash["obj"];
        var gidCount = 0;
        for (var tmpECID in dataHash) for (var _key in dataHash[tmpECID]) {
            var tmp_game = dataHash[tmpECID][_key];
            var _gid = tmp_game["gid"];
            gidCount++;
            if (gid_count_max - gidCount < 0) continue;
            if (mainIor["gid_" + _gid] != null) for (var ior_key in mainIor["gid_" + _gid]) dataHash[tmpECID][_key][ior_key.toLowerCase()] = util_game.showTxt(mainIor["gid_" + _gid][ior_key]);
            var eo_ary = [["REOO", "REOE"], ["HREOO", "HREOE"]];
            for (var e = 0; e < eo_ary.length; e++) {
                var tmpAry = eo_ary[e];
                if (tmp_game["ior_" + tmpAry[0].toLowerCase()] && tmp_game["ior_" + tmpAry[1].toLowerCase()]) {
                    var ior_h = tmp_game["ior_" + tmpAry[0].toLowerCase()] * 1 - 1;
                    var ior_c = tmp_game["ior_" + tmpAry[1].toLowerCase()] * 1 - 1;
                    var hash_hc = util_game.chgOddfIoratio(ior_h,
                        ior_c, config_ior, "HK");
                    if (!isNaN(hash_hc[0])) dataHash[tmpECID][_key]["ior_" + tmpAry[0].toLowerCase()] = hash_hc[0] * 1 + 1;
                    if (!isNaN(hash_hc[1])) dataHash[tmpECID][_key]["ior_" + tmpAry[1].toLowerCase()] = hash_hc[1] * 1 + 1
                }
            }
            if (top.choice_showtype != "parlay") {
                var ior_ary = [["REH", "REC"], ["ROUH", "ROUC"], ["HREH", "HREC"], ["HROUH", "HROUC"], ["RNCH", "RNCC"], ["RNBH", "RNBC"], ["RSHY", "RSHN"], ["RSCY", "RSCN"], ["RH", "RC"], ["OUH", "OUC"], ["HRH", "HRC"], ["HOUH", "HOUC"]];
                for (var k = 0; k < ior_ary.length; k++) {
                    var tmpAry = ior_ary[k];
                    if (tmp_game["ior_" +
                    tmpAry[0].toLowerCase()] && tmp_game["ior_" + tmpAry[1].toLowerCase()]) {
                        var ior_h = tmp_game["ior_" + tmpAry[0].toLowerCase()];
                        var ior_c = tmp_game["ior_" + tmpAry[1].toLowerCase()];
                        var hash_hc = util_game.chgOddfIoratio(ior_h, ior_c, config_ior);
                        if (!isNaN(hash_hc[0])) dataHash[tmpECID][_key]["ior_" + tmpAry[0].toLowerCase()] = hash_hc[0] * 1;
                        if (!isNaN(hash_hc[1])) dataHash[tmpECID][_key]["ior_" + tmpAry[1].toLowerCase()] = hash_hc[1] * 1
                    }
                }
            }
            if (_MODEL.indexOf("MIX") != -1) {
                tmpEcAry[_ECID] = new Object;
                for (r = 0; r < OBT_MIX_wtype.length; r++) {
                    var tmpRtype =
                        "";
                    if (top.choice_showtype == "mygame" && top["myGameHash"][top.choice_gtype][tmpECID] != null) tmpRtype = top["myGameHash"][top.choice_gtype][tmpECID]["showtype"] == "live" ? "rb" : "r"; else if (isSpecialGame == "Y") tmpRtype = is_rb == "Y" ? "rb" : "r"; else tmpRtype = top.choice_rtype;
                    OBT_MIX_Model = tmpRtype == "rb" ? OBT_LIVE_MIX_wtype : OBT_MIX_wtype;
                    tmpEcAry[_ECID][OBT_MIX_Model[r]] = obtScrollHash[_ECID] && obtScrollHash[_ECID][OBT_MIX_Model[r]] ? obtScrollHash[_ECID][OBT_MIX_Model[r]] : 0;
                    tpl.addBlock("OBT" + _MODEL.toUpperCase() + OBT_MIX_Model[r]);
                    var rAry = OBT[_MODEL + "_" + tmpRtype];
                    for (var i = 0; i < rAry.length; i++) {
                        var keys = rAry[i];
                        var vals = tmp_game[keys.toLowerCase()];
                        vals = _self.checkRatioR(keys, vals, tmp_game);
                        vals = _self.checkRatioOU(keys, vals, tmp_game);
                        if (keys.indexOf("GID") != -1 && _MODEL.match(/\bH/)) vals = tmp_game["hgid"]; else if (keys.indexOf("STRONG") != -1) {
                            var tag = keys.split("_")[1];
                            var strong = tmp_game["strong"];
                            vals = tag == strong ? "strong_team" : ""
                        } else if (keys.indexOf("IOR") != -1) {
                            var tag = keys.split("_")[1];
                            vals = util_game.getIoratio(vals, null, tag);
                            vals = util_game.showTxt(vals);
                            var closeKey = "CLOSE_" + tag;
                            tpl.replace(new RegExp("\\*" + closeKey + "\\*", "i"), util_game.showTxt(util_game.lockIor(vals)))
                        }
                        tpl.replace(new RegExp("\\*" + keys + "\\*", "gi"), util_game.showTxt(vals))
                    }
                }
            } else if (util.in_array(_MODEL, OBT_loop)) {
                if (_MODEL.match(/\bH/) && tmp_game["hnike"] == "N") continue;
                tpl.addBlock("OBT" + _MODEL.toUpperCase());
                var tmpRtype = "";
                if (top.choice_showtype == "mygame" && top["myGameHash"][top.choice_gtype][tmpECID] != null) tmpRtype = top["myGameHash"][top.choice_gtype][tmpECID]["showtype"] ==
                "live" ? "rb" : "r"; else if (isSpecialGame == "Y") tmpRtype = is_rb == "Y" ? "rb" : "r"; else tmpRtype = top.choice_rtype;
                var rAry = OBT[_MODEL + "_" + tmpRtype];
                for (var i = 0; i < rAry.length; i++) {
                    var keys = rAry[i];
                    var vals = tmp_game[keys.toLowerCase()];
                    vals = _self.checkRatioR(keys, vals, tmp_game);
                    vals = _self.checkRatioOU(keys, vals, tmp_game);
                    if (keys.indexOf("GID") != -1 && _MODEL.match(/\bH/)) vals = tmp_game["hgid"]; else if (keys.indexOf("TEAM") != -1) {
                        var ptype = tmp_game["ptype"];
                        vals = vals.replace(ptype, "");
                        vals = vals.replace("[Mid]", "").replace("[\u4e2d]",
                            "")
                    } else if (keys.indexOf("IOR") != -1) {
                        var tag = keys.split("_")[1];
                        vals = util_game.getIoratio(vals, null, tag);
                        vals = util_game.showTxt(vals);
                        var closeKey = "CLOSE_" + tag;
                        tpl.replace(new RegExp("\\*" + closeKey + "\\*", "i"), util_game.showTxt(util_game.lockIor(vals)))
                    }
                    tpl.replace(new RegExp("\\*" + keys + "\\*", "gi"), util_game.showTxt(vals))
                }
            } else {
                var tmpRtype = "";
                if (top.choice_showtype == "mygame" && top["myGameHash"][top.choice_gtype][tmpECID] != null) tmpRtype = top["myGameHash"][top.choice_gtype][tmpECID]["showtype"] ==
                "live" ? "rb" : "r"; else if (isSpecialGame == "Y") tmpRtype = is_rb == "Y" ? "rb" : "r"; else tmpRtype = top.choice_rtype;
                var rAry = OBT[_MODEL + "_" + tmpRtype];
                for (var i = 0; i < rAry.length; i++) {
                    var keys = rAry[i];
                    var vals = tmp_game[keys.toLowerCase()];
                    vals = _self.checkRatioR(keys, vals, tmp_game);
                    vals = _self.checkRatioOU(keys, vals, tmp_game);
                    if (keys.indexOf("TEAM") != -1) {
                        var ptype = tmp_game["ptype"];
                        vals = vals.replace(ptype, "");
                        if (keys == "TEAM_H") vals = vals.replace("[Mid]", "").replace("[\u4e2d]", "")
                    } else if (keys.indexOf("STRONG") != -1) {
                        var tag =
                            keys.split("_")[1];
                        var strong = tmp_game["strong"];
                        vals = tag == strong ? "strong_team" : ""
                    } else if (keys.indexOf("IOR") != -1) {
                        var tag = keys.split("_")[1];
                        vals = util_game.getIoratio(vals, null, tag);
                        vals = util_game.showTxt(vals);
                        var closeKey = "CLOSE_" + tag;
                        tmpOBT_model.innerHTML = tmpOBT_model.innerHTML.replace(new RegExp("\\*" + closeKey + "\\*", "i"), util_game.showTxt(util_game.lockIor(vals)))
                    } else if (keys.indexOf("LASTESTSCORE") != -1) vals = vals != "" ? "last_goal" : ""; else if (keys.indexOf("WTYPE") != -1) vals = LS_game.get("str_" +
                        vals);
                    tmpOBT_model.innerHTML = tmpOBT_model.innerHTML.replace(new RegExp("\\*" + keys + "\\*", "gi"), util_game.showTxt(vals))
                }
                tmpDiv += tmpOBT_model.innerHTML
            }
        }
        if (_MODEL.indexOf("MIX") != -1 && gidCount - gid_count_min < 0) {
            var needAddCount = gid_count_min - gidCount;
            for (var k = 1; k <= needAddCount; k++) for (var l = 0; l < OBT_MIX_Model.length; l++) {
                tpl.addBlock("OBT" + _MODEL.toUpperCase() + OBT_MIX_Model[l]);
                tpl.replace(new RegExp("\\*GID\\*", "i"), util_game.showTxt(_ECID + "_" + k));
                tpl.replace(new RegExp("\\*OBT_BLANK\\*",
                    "i"), "odd_empty")
            }
        }
        nowOBTGameHash = util.clone(dataHash);
        if (util.in_array(_MODEL, OBT_loop)) {
            tmpDiv = tpl.fastPrint();
            var needHT = false;
            var is_rb = isP3_R[_ECID] ? "Y" : "N";
            if (top.choice_showtype != "live" && is_rb == "N") needHT = _self.getCourtOpen(xmdObj["game"], "HT"); else needHT = !_self.getHNIKE(xmdObj["game"]);
            var isShow = !needHT ? "style='display:none'" : "";
            tmpDiv = tmpDiv.replace(new RegExp("\\*OBT_HALF_DISPLAY\\*", "gi"), util_game.showTxt(isShow))
        }
        div_show.innerHTML = tmpDiv;
        _lastOBT_div = div_show.cloneNode(true);
        if (_MODEL.indexOf("RN") !=
            -1) {
            var _extra = dom.getElementById("div_OBT_RN_icon_" + _ECID);
            if (top.mobile != "Y") _extra.classList.add("info_on");
            util.addEvent(_extra, "click", _self.showExtraInfo, {
                "ptype": "RN",
                "hasEC": "N",
                "mainScore": "",
                "extraScore": ""
            })
        }
        var btn_close = dom.getElementById("OBT_close_" + _ECID);
        var btn_more = dom.getElementById("OBT_more_" + _ECID);
        btn_close.style.display = "";
        _lastOBT_close = btn_close;
        util.addEvent(btn_close, "click", _self.closeOBT, {"closeObj": div_show, "closeBtn": btn_close, "ECID": _ECID});
        if (_MODEL.indexOf("MIX") !=
            -1) util.addEvent(btn_more, "click", _self.clickMore, more_param_obj[_ECID]);
        _self.initOBTIorBtn(obt_xml, xmdObj["ec"]);
        _self.initOBTChgCourt(obt_xml, xmdObj["ec"], div_show);
        _self.chkHideHalf(halfAry);
        if (_MODEL.indexOf("MIX") != -1) obtScrollHash = _self.setScroll("table_obt_bet", tmpEcAry); else {
            tmpEcAry[_ECID] = obtScrollHash[_ECID] ? obtScrollHash[_ECID] : 0;
            obtScrollHash = _self.setScroll("ratioShow_OBT", tmpEcAry)
        }
        chgColorIor = util_game.chgIorColor(dom, util, chgColorIor);
        util_game.initSelect(util);
        OBT_closed = ""
    };
    _self.getNowOBTcount =
        function (_ecid, model) {
            var transHash = new Object;
            transHash["RE"] = "R";
            transHash["ROU"] = "OU";
            transHash["HRE"] = "R";
            transHash["HROU"] = "OU";
            transHash["ETR"] = "R";
            transHash["ETRE"] = "R";
            transHash["ETOU"] = "OU";
            transHash["ETROU"] = "OU";
            transHash["ETPK"] = "PK";
            var tmpModel = transHash[model] != null ? transHash[model] : model;
            return nowOBT_count[_ecid][tmpModel]
        };
    _self.showOBTLoading = function (_ECID, isShow) {
        var obt_loading = dom.getElementById("OBT_loading_" + _ECID);
        obt_loading.style.display = isShow ? "" : "none";
        var tmpECID = null;
        if (_lastOBT_div != null) tmpECID = _lastOBT_div.getAttribute("id").split("_")[3];
        if (_lastOBT_div != null && _lastOBT_div.innerHTML != "" && tmpECID == _ECID) if (isShow) util.addClass(obt_loading, "obt_chg"); else util.removeClass(obt_loading, "obt_chg")
    };
    _self.setHideHalf = function (ecid, model, xmlnode, tmp_game_copy, halfAry) {
        if (model.match(/CN|RN/)) {
            var hgid = xmlnode.Node(tmp_game_copy, "HGID").innerHTML;
            var HT_FT = xmlnode.Node(tmp_game_copy, "HT_FT").innerHTML;
            halfAry[hgid + "_" + ecid] = HT_FT
        }
    };
    _self.chkHideHalf = function (halfAry) {
        var ary =
            new Array("HROU", "HREO");
        for (var hgid_ecid in halfAry) {
            var isShow = halfAry[hgid_ecid] == "FT" ? "none" : "";
            for (var i = 0; i < ary.length; i++) {
                var wtype = ary[i];
                var obj = dom.getElementById("OBT_" + hgid_ecid + "_" + wtype);
                if (obj) obj.style.display = isShow
            }
        }
    };
    _self.initOBTIorBtn = function (xmlnode, ecObj) {
        var xmdObj = new Object;
        for (var j = 0; j < ecObj.length; j++) {
            var tmp_ec = ecObj[j];
            var ECID = tmp_ec.getAttribute("id").replace(/ec/, "");
            var model = xmlnode.Node(tmp_ec, "model").innerHTML;
            var low_model = model.toLowerCase();
            xmdObj["game"] =
                xmlnode.Node(tmp_ec, "game", false);
            if (top["choice_showtype"] != "live") {
                var goFT = _self.getCourtOpen(xmdObj["game"], "FT");
                var goHT = _self.getCourtOpen(xmdObj["game"], "HT");
                if (!goFT && goHT && OBT_transHT[model] != null) model = OBT_transHT[model]
            }
            var is_rb = isP3_R[ECID] ? "Y" : "N";
            for (var x = 0; x < xmdObj["game"].length; x++) {
                var tmp_game = xmdObj["game"][x];
                var gid = xmlnode.Node(tmp_game, "GID").innerHTML;
                var gid2 = xmlnode.Node(tmp_game, "GID2").innerHTML;
                var hgid = xmlnode.Node(tmp_game, "HGID").innerHTML;
                var _ptype = util_game.showTxt(xmlnode.Node(tmp_game,
                    "ptype").innerHTML);
                var _imp = util_game.showTxt(xmlnode.Node(tmp_game, "important").innerHTML);
                var isRP3 = top.choice_showtype == "parlay" && is_rb == "Y";
                var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
                var ior_key = "";
                var isMyGameRB = top.choice_showtype == "mygame" && top["myGameHash"][top.choice_gtype][ECID]["showtype"] == "live";
                if ((top.choice_showtype == "live" || isRP3 || isMyGameRB || isSpecialGame == "Y" && is_rb == "Y") && util.in_array(model, OBT_needsR)) ior_key = "OBT_r" + model.toLowerCase();
                else if (top.choice_showtype == "parlay" && !isRP3 && util.in_array(model, OBT_needsR)) ior_key = "OBT_" + model.toLowerCase() + "_p"; else ior_key = "OBT_" + model.toLowerCase();
                if (ior_key.indexOf("mix") != -1) {
                    var mix_wtype_ary = new Array;
                    if (model.match(/HMIX/)) mix_wtype_ary = OBT_LIVE_MIX_wtype.indexOf(MixObtRtype[ECID]) != -1 ? OBT_LIVE_HMIX_wtype : OBT_HMIX_wtype; else mix_wtype_ary = OBT_LIVE_MIX_wtype.indexOf(MixObtRtype[ECID]) != -1 ? OBT_LIVE_MIX_wtype : OBT_MIX_wtype;
                    for (var w = 0; w < mix_wtype_ary.length; w++) {
                        ior_key = "OBT_" + mix_wtype_ary[w].toLowerCase();
                        var wtype_ary = IOR[ior_key];
                        for (var _wtype in wtype_ary) for (var a = 0; a < wtype_ary[_wtype].length; a++) {
                            var _rtype = wtype_ary[_wtype][a];
                            var gidAry = new Array(gid, hgid);
                            if (gid2 != null) gidAry.push(gid2);
                            var obj = null;
                            var _gid = null;
                            var nowWtype = "";
                            var nowRtype = "";
                            for (var i = 0; i < gidAry.length; i++) {
                                obj = _self.getIorObj(gidAry[i], ECID, _rtype, true);
                                if (obj) {
                                    _gid = gidAry[i];
                                    break
                                }
                            }
                            if (util.in_array(_wtype, needsTransWtype)) {
                                if (model.indexOf("ET") != -1 && model != "ET") model = model.replace(/ET/, "");
                                var getType = model.indexOf("PK") !=
                                -1 || model == "ET" ? _wtype.toUpperCase() : model.toUpperCase();
                                var tmpWtype = util_game.showTxt(xmlnode.Node(tmp_game, "WTYPE_" + getType).innerHTML);
                                nowWtype = _wtype.replace(new RegExp(_wtype, "gi"), tmpWtype);
                                nowRtype = _rtype.replace(new RegExp(_wtype, "gi"), tmpWtype)
                            } else {
                                nowWtype = _wtype;
                                nowRtype = _rtype
                            }
                            if (_gid != null && ECID != null && nowRtype != null) {
                                var chg_ior = nowOBTGameHash[ECID][gid]["ior_" + _rtype.toLowerCase()];
                                chgColorID = "OBT_bet_" + _gid + "_" + ECID + "_" + _rtype;
                                var isChg = typeof gid_rtype_ior[chgColorID] != "undefined" &&
                                    gid_rtype_ior[chgColorID] != chg_ior && chg_ior * 1 != 0 && gid_rtype_ior[chgColorID] * 1 != 0 && !isClickOBT;
                                chgColorIor[chgColorID] = isChg;
                                gid_rtype_ior[chgColorID] = chg_ior
                            }
                            if (obj) {
                                obj.gtype = top.choice_gtype;
                                var tmpShowType = "";
                                if (top.choice_showtype == "mygame") tmpShowType = top["myGameHash"][top.choice_gtype][ECID]["showtype"]; else if (isSpecialGame == "Y") {
                                    var myGameShowtype = more_param_obj[ECID].myGameShowtype;
                                    tmpShowType = top.choice_showtype;
                                    switch (myGameShowtype) {
                                        case "rb":
                                            tmpShowType = "live";
                                            break;
                                        case "fu":
                                        case "em":
                                            tmpShowType =
                                                "early";
                                            break
                                    }
                                } else tmpShowType = top.choice_showtype;
                                obj.showtype = tmpShowType;
                                obj.gid = _gid;
                                obj.ecid = ECID;
                                obj.rtype = nowRtype;
                                obj.wtype = nowWtype;
                                obj.chose_team = nowRtype.substr(nowRtype.length - 1, 1);
                                if (util.in_array(_wtype, needsTransWtype)) obj.remain_rtype = _rtype;
                                if (util_game.checkWtypeIsSingle2016(nowWtype) || util_game.checkWtypeIsDouble2016(nowWtype) || util_game.checkWtypeIsSingle2017(nowWtype)) obj.chose_team = nowRtype;
                                obj.is_rb = is_rb;
                                obj.imp = _imp;
                                obj.ptype = _ptype;
                                obj.gameObj = tmp_game;
                                var typeName = "";
                                if (top.specialClick ==
                                    "special") typeName = "special";
                                if (top.choice_showtype == "mygame") typeName = "mygame";
                                obj.f = util_game.checkBetFrom(typeName, "O");
                                util.addEvent(obj, "click", _self.showBetEvent, obj)
                            }
                        }
                    }
                } else {
                    var wtype_ary = IOR[ior_key];
                    for (var _wtype in wtype_ary) for (var a = 0; a < wtype_ary[_wtype].length; a++) {
                        var _rtype = wtype_ary[_wtype][a];
                        var gidAry = new Array(gid, hgid);
                        if (gid2 != null) gidAry.push(gid2);
                        var obj = null;
                        var _gid = null;
                        var nowWtype = "";
                        var nowRtype = "";
                        for (var i = 0; i < gidAry.length; i++) {
                            obj = _self.getIorObj(gidAry[i], ECID,
                                _rtype, true);
                            if (obj) {
                                _gid = gidAry[i];
                                break
                            }
                        }
                        if (util.in_array(_wtype, needsTransWtype)) {
                            if (model.indexOf("ET") != -1 && model != "ET") model = model.replace(/ET/, "");
                            var getType = model.indexOf("PK") != -1 || model == "ET" ? _wtype.toUpperCase() : model.toUpperCase();
                            var tmpWtype = util_game.showTxt(xmlnode.Node(tmp_game, "WTYPE_" + getType).innerHTML);
                            nowWtype = _wtype.replace(new RegExp(_wtype, "gi"), tmpWtype);
                            nowRtype = _rtype.replace(new RegExp(_wtype, "gi"), tmpWtype)
                        } else {
                            nowWtype = _wtype;
                            nowRtype = _rtype
                        }
                        if (_gid != null && ECID != null &&
                            nowRtype != null) {
                            var chg_ior = nowOBTGameHash[ECID][gid]["ior_" + _rtype.toLowerCase()];
                            chgColorID = "OBT_bet_" + _gid + "_" + ECID + "_" + _rtype;
                            var isChg = typeof gid_rtype_ior[chgColorID] != "undefined" && gid_rtype_ior[chgColorID] != chg_ior && chg_ior * 1 != 0 && gid_rtype_ior[chgColorID] * 1 != 0 && !isClickOBT;
                            chgColorIor[chgColorID] = isChg;
                            gid_rtype_ior[chgColorID] = chg_ior
                        }
                        if (obj) {
                            obj.gtype = top.choice_gtype;
                            var tmpShowType = "";
                            if (top.choice_showtype == "mygame") tmpShowType = top["myGameHash"][top.choice_gtype][ECID]["showtype"]; else if (isSpecialGame ==
                                "Y") {
                                var myGameShowtype = more_param_obj[ECID].myGameShowtype;
                                tmpShowType = top.choice_showtype;
                                switch (myGameShowtype) {
                                    case "rb":
                                        tmpShowType = "live";
                                        break;
                                    case "fu":
                                    case "em":
                                        tmpShowType = "early";
                                        break
                                }
                            } else tmpShowType = top.choice_showtype;
                            obj.showtype = tmpShowType;
                            obj.gid = _gid;
                            obj.ecid = ECID;
                            obj.rtype = nowRtype;
                            obj.wtype = nowWtype;
                            obj.chose_team = nowRtype.substr(nowRtype.length - 1, 1);
                            if (util.in_array(_wtype, needsTransWtype)) obj.remain_rtype = _rtype;
                            if (util_game.checkWtypeIsSingle2016(nowWtype) || util_game.checkWtypeIsDouble2016(nowWtype) ||
                                util_game.checkWtypeIsSingle2017(nowWtype)) obj.chose_team = nowRtype;
                            obj.is_rb = is_rb;
                            obj.imp = _imp;
                            obj.ptype = _ptype;
                            obj.gameObj = tmp_game;
                            var typeName = "";
                            if (top.specialClick == "special") typeName = "special";
                            if (top.choice_showtype == "mygame") typeName = "mygame";
                            obj.f = util_game.checkBetFrom(typeName, "O");
                            util.addEvent(obj, "click", _self.showBetEvent, obj)
                        }
                    }
                }
            }
        }
    };
    _self.getOBTLayer = function (ecid, _name) {
        var is_rb = isP3_R[ecid];
        var type = _name.toUpperCase();
        var strR = top.choice_showtype == "parlay" && !is_rb && type.match(/CN|RN/) ?
            type + "_R" : type;
        var isMyGameR = top.choice_showtype == "mygame" && top["myGameHash"][top.choice_gtype][ecid]["showtype"] != "live";
        var isMyGameLive = top.choice_showtype == "mygame" && top["myGameHash"][top.choice_gtype][ecid]["showtype"] == "live";
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        if ((isMyGameR || isSpecialGame == "Y" && !is_rb) && type.match(/RN|WI|CN/)) var strR = type + "_R";
        if (type.indexOf("MIX") != -1 && (isMyGameLive || isSpecialGame == "Y" && is_rb)) var strR = type +
            "_live";
        return dom.getElementById("model_OBT_" + strR)
    };
    _self.closeOBT = function (MouseClick, tarObj) {
        OBT_closed = tarObj["ECID"];
        if (clusterize_sw) _self.updateOBTRowData("remove", "");
        top["showOBT"] = "";
        var menuShow = dom.getElementById("div_OBT_menu_" + tarObj["ECID"]);
        util.removeClass(menuShow, "on");
        util.removeEvent(tarObj["closeBtn"], "click");
        if (_lastOBT_tab != null) util.removeClass(_lastOBT_tab, "on");
        if (tarObj["closeBtn"] != null) tarObj["closeBtn"].style.display = "none";
        if (tarObj["closeObj"] != null) tarObj["closeObj"].style.display =
            "none";
        _lastOBT_tab = null;
        _lastOBT_div = null;
        _self.showOBTLoading(tarObj["ECID"], false)
    };
    _self.initCourt = function () {
        if (_lastOBT_div != null) {
            _lastOBT_div.innerHTML = "";
            _lastOBT_div.style.display = "none"
        }
    };
    _self.getCourtOpen = function (gameObj, _courtMode) {
        var hash = new Object;
        hash["FT"] = new Array("REH", "REC", "ROUH", "ROUC", "RH", "RC", "OUH", "OUC");
        hash["HT"] = new Array("HREH", "HREC", "HROUH", "HROUC", "HRH", "HRC", "HOUH", "HOUC");
        var Court = hash[_courtMode];
        for (var i = 0; i < gameObj.length; i++) {
            var tmp_game = gameObj[i];
            var _gid =
                _xmlnode.Node(tmp_game, "GID").innerHTML;
            for (var a = 0; a < Court.length; a++) {
                var _val = "";
                if (mainIor["gid_" + _gid]) _val = mainIor["gid_" + _gid]["IOR_" + Court[a]]; else _val = _xmlnode.Node(tmp_game, "IOR_" + Court[a]).innerHTML;
                if (_xmlnode.Node(tmp_game, "IOR_" + Court[a], false).length != 0 && _val != "" && _val * 1 != 0) return true
            }
        }
        return false
    };
    _self.getHNIKE = function (gameObj) {
        for (var i = 0; i < gameObj.length; i++) {
            var tmp_game = gameObj[i];
            var _hnike = _xmlnode.Node(tmp_game, "HNIKE").innerHTML;
            if (_hnike == "Y") return false
        }
        return true
    };
    _self.initOBTChgCourt = function (xmlnode, ecObj, divShow) {
        var tmp_ec = ecObj[0];
        var ECID = tmp_ec.getAttribute("id").replace(/ec/, "");
        var model = xmlnode.Node(tmp_ec, "model").innerHTML.toUpperCase();
        var menuObj = dom.getElementById("div_OBT_show_" + ECID);
        if (menuObj == null) return;
        var pageIndex = top["showOBT"].split("_")[2];
        var gameIndex = top["showOBT"].split("_")[3];
        var isEarly = top["showOBT"].split("_")[4];
        var objidsAry = new Object;
        objidsAry["RE"] = ",COURT_RE,COURT_HRE,";
        objidsAry["ROU"] = ",COURT_ROU,COURT_HROU,";
        objidsAry["R"] =
            ",COURT_R,COURT_HR,";
        objidsAry["OU"] = ",COURT_OU,COURT_HOU,";
        objidsAry["MIX"] = ",COURT_MIX,COURT_HMIX,";
        var courtAry = new Object;
        courtAry["RE"] = new Array("RE", "HRE");
        courtAry["ROU"] = new Array("ROU", "HROU");
        courtAry["R"] = new Array("R", "HR");
        courtAry["OU"] = new Array("OU", "HOU");
        courtAry["MIX"] = new Array("MIX", "HMIX");
        var _model = model.replace(/H/, "").replace(/ET/, "");
        var isET = model.indexOf("ET") != -1;
        var objids = objidsAry[_model];
        var CourtAry = courtAry[_model];
        var ary = util.getObjAry(menuObj, objids);
        var gameObj =
            xmlnode.Node(tmp_ec, "game", false);
        var is_rb = isP3_R[ECID] ? "Y" : "N";
        if (CourtAry) {
            for (var i = 0; i < CourtAry.length; i++) {
                var chose_model = isET ? "ET" + CourtAry[i] : CourtAry[i];
                util.addEvent(ary["COURT_" + CourtAry[i]], "click", _self.chgCourt, {
                    "obj": ary["COURT_" + CourtAry[i]],
                    "ECID": ECID,
                    "chose_model": chose_model,
                    "pageIndex": pageIndex,
                    "gameIndex": gameIndex,
                    "isEarly": isEarly
                })
            }
            if (top.choice_showtype != "live" && is_rb == "N") {
                var needFT = _self.getCourtOpen(gameObj, "FT");
                var needHT = _self.getCourtOpen(gameObj, "HT");
                ary["COURT_" +
                CourtAry[0]].style.display = needFT ? "" : "none";
                ary["COURT_" + CourtAry[1]].style.display = needHT ? "" : "none";
                if (_lastCourt_tab == null) if (!needFT && needHT) {
                    _lastCourt_tab = ary["COURT_" + CourtAry[1]];
                    top["showOBT"] = ECID + "_" + CourtAry[1] + "_" + pageIndex + "_" + gameIndex + "_" + isEarly
                } else {
                    _lastCourt_tab = ary["COURT_" + CourtAry[0]];
                    top["showOBT"] = ECID + "_" + CourtAry[0] + "_" + pageIndex + "_" + gameIndex + "_" + isEarly
                }
                var lastTab_id = _lastCourt_tab.getAttribute("id");
                var isHalf = lastTab_id.split("_")[1].match(/\bH/);
                if (!needHT && isHalf ||
                    !needFT && !isHalf) {
                    _self.close_obt_proc(ECID);
                    _lastOBT_close.style.display = "none";
                    menuObj.style.display = "none";
                    _lastOBT_close = null;
                    if (!needFT && !isHalf) _lastCourt_tab = ary["COURT_" + CourtAry[1]]; else _lastCourt_tab = ary["COURT_" + CourtAry[0]]
                }
            } else {
                var hideHT = _self.getHNIKE(gameObj);
                ary["COURT_" + CourtAry[1]].style.display = hideHT ? "none" : "";
                if (_lastCourt_tab == null) _lastCourt_tab = ary["COURT_" + CourtAry[0]];
                var lastTab_id = _lastCourt_tab.getAttribute("id");
                var isHalf = lastTab_id.split("_")[1].match(/\bH/);
                if (hideHT &&
                    isHalf) {
                    _self.close_obt_proc(ECID);
                    _lastOBT_close.style.display = "none";
                    menuObj.style.display = "none";
                    _lastOBT_close = null;
                    _lastCourt_tab = ary["COURT_" + CourtAry[0]]
                }
            }
        }
    };
    _self.chgCourt = function (evt, hash) {
        isClickOBT = evt != null;
        var tarObj = hash["obj"];
        var tarECID = hash["ECID"];
        var courtname = top["showOBT"];
        var isEarly = hash["isEarly"];
        if (_lastCourt_tab != null) util.removeClass(_lastCourt_tab, "on");
        if (tarObj) util.addClass(tarObj, "on");
        _lastCourt_tab = tarObj;
        var chose_model = hash["chose_model"];
        if (evt != null) _self.showOBTLoading(tarECID,
            true);
        _self.getOBT(chose_model, tarECID, isClickOBT, isEarly);
        top["showOBT"] = tarECID + "_" + chose_model + "_" + hash["pageIndex"] + "_" + hash["gameIndex"] + "_" + hash["isEarly"]
    };
    _self.getModelComplete_FS = function (par) {
        if (par.action == "click") openHash = new Object;
        if (par.needGet) _self.getData_FS(); else _self.parseData_FS(_xmlnode)
    };
    _self.getData_FS = function () {
        var param = "";
        var gtype = top.choice_gtype != "" ? top.choice_gtype.toUpperCase() : postHash["gtype"].toUpperCase();
        param += top.param;
        param += "&p=get_game_list_FS";
        if (postHash["url_param"]) param +=
            "&" + postHash["url_param"];
        param += "&gtype=" + gtype;
        var showtypeTrans = new Object;
        showtypeTrans["today"] = "FT";
        showtypeTrans["early"] = "FU";
        showtypeTrans["live"] = "RB";
        if (top.specialClick == "special" || top.outrightsClick == "outrights") param += "&search=all"; else param += "&showtype=" + showtypeTrans[top.choice_showtype];
        param += "&rtype=" + top.choice_rtype;
        if (_self.paramHash["lid"]) param += "&league_id=" + _self.paramHash["lid"];
        param += "&date=" + (postHash["date"] || "");
        param += "&special=" + top.specialClick;
        if (top.specialClick ==
            "special") param += "&fs_count=" + top.specialGame.FS;
        var team_id = "";
        if (top.specialGame.isTeam && top.specialGame.choice_teamID != "") team_id = top.specialGame.choice_teamID;
        param += "&team_id=" + team_id;
        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), null);
        hr.setParentclass(childClass);
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadGameComplete_FS);
        hr.loadURL(top.m2_url, "POST", param)
    };
    _self.LoadGameComplete_FS = function (xml) {
        var tmp_xml;
        _self.paramHash["errorMsg"] = util.showConnectMsg(xml);
        if (util.alertConnectMsg(_self.paramHash["errorMsg"])) return;
        tmp_xml = util.parseXml(xml);
        _xmlnodeFS = tmp_xml;
        if (top.specialGame.isTeam && (top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] == null || top["specialGame"]["CUP_TEAM"][top.specialGame.choice_teamID] == 0)) if (top["specialGame"]["CUP_TEAM_ARY"].length == 0) return;
        _self.parseData_FS(_xmlnodeFS)
    };
    _self.parseData_FS = function (xmlnode) {
        var div_show = dom.getElementById("cup_fs_show");
        var xmdObj =
            new Object;
        var codeAry = new Array("607", "619", "621", "627");
        if (top.specialGame.isTeam && top.specialGame.team_sw != "Y") {
            winner_empty = true;
            game_empty = true;
            fs_empty = true;
            _self.showNoData(true);
            if (dom.getElementById("cup_touch_div_320")) dom.getElementById("cup_touch_div_320").style.display = "none";
            if (dom.getElementById("cup_touch_div_640")) dom.getElementById("cup_touch_div_640").style.display = "none";
            if (dom.getElementById("winner_show")) dom.getElementById("winner_show").style.display = "none";
            if (dom.getElementById("team_menu_show")) dom.getElementById("team_menu_show").style.display =
                "none";
            if (dom.getElementById("widget_show")) dom.getElementById("widget_show").style.display = "none";
            if (dom.getElementById("title_fs")) dom.getElementById("title_fs").style.display = "none";
            if (dom.getElementById("cup_fs_show")) dom.getElementById("cup_fs_show").style.display = "none";
            if (dom.getElementById("btn_all_fs")) dom.getElementById("btn_all_fs").style.display = "none";
            _self.showGameLoading(false);
            parentClass.dispatchEvent("showLoading", {"isShow": false});
            return
        }
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0],
            "code");
        if (xmdObj["code"].innerHTML == "noSpecialGameData") {
            fs_empty = true;
            sportFrame.showSportMenu({"isShow": false});
            div_show.innerHTML = "";
            var title_fs = dom.getElementById("title_fs");
            var btn_all_fs = dom.getElementById("btn_all_fs");
            div_show.style.display = "none";
            title_fs.style.display = "none";
            btn_all_fs.style.display = "none";
            sportFrame.setTitle("special", {"title": top.specialGame.title});
            return
        }
        if (util.in_array(xmdObj["code"].innerHTML, codeAry)) {
            var zero_ary = new Array;
            var zeroObj = new Object;
            var needHideGid =
                new Array;
            xmdObj["game"] = xmlnode.Node(xmlnode.Root[0], "game", false);
            sportFrame.showSportMenu({"isShow": false});
            if (xmdObj["game"].length > 0) {
                fs_empty = false;
                if (dom.getElementById("title_fs")) dom.getElementById("title_fs").style.display = "";
                var close_count = 0;
                for (var i = 0; i < xmdObj["game"].length; i++) {
                    var sw_gopen = xmlnode.Node(xmdObj["game"][i], "gopen").innerHTML;
                    if (sw_gopen == "Y") {
                        dom.getElementById("cup_fs_show").style.display = "";
                        dom.getElementById("title_fs").style.display = "";
                        dom.getElementById("btn_all_fs").style.display =
                            "";
                        break
                    } else close_count++
                }
                if (close_count == xmdObj["game"].length) {
                    fs_empty = true;
                    div_show.innerHTML = "";
                    var title_fs = dom.getElementById("title_fs");
                    var btn_all_fs = dom.getElementById("btn_all_fs");
                    div_show.style.display = "none";
                    title_fs.style.display = "none";
                    btn_all_fs.style.display = "none";
                    if (top.specialClick == "special") sportFrame.setTitle("special", {"title": top.specialGame.title}); else sportFrame.setTitle("league", {
                        "gtype": top.choice_gtype,
                        "league": LS.get("showtype_fs")
                    });
                    return
                }
            } else {
                fs_empty = true;
                div_show.innerHTML = "";
                var title_fs = dom.getElementById("title_fs");
                var btn_all_fs = dom.getElementById("btn_all_fs");
                div_show.style.display = "none";
                title_fs.style.display = "none";
                btn_all_fs.style.display = "none";
                if (top.specialClick == "special") sportFrame.setTitle("special", {"title": top.specialGame.title}); else sportFrame.setTitle("league", {
                    "gtype": top.choice_gtype,
                    "league": LS.get("showtype_fs")
                });
                return
            }
            for (var _gid in swHash) if (xmdObj["game"]["gid" + _gid] == null) swHash[_gid] = null;
            var tmp_screen = "";
            var fs_lastTime =
                "";
            var fs_lastLeague = "";
            var fs_def_open = 0;
            var cup_fs_len = 0;
            if (top.specialGame.isHL) cup_fs_len = xmdObj["game"].length < 5 ? xmdObj["game"].length : 5;
            if (top.specialGame.isTeam) cup_fs_len = xmdObj["game"].length;
            var dontShowGid = new Array;
            for (var n = 0; n < cup_fs_len; n++) {
                var tmp_game = xmdObj["game"][n];
                var gid = xmlnode.Node(tmp_game, "gid").innerHTML;
                xmdObj["rtypes"] = xmlnode.Node(tmp_game, "rtypes", false);
                for (var s = 0; s < xmdObj["rtypes"].length; s++) {
                    var team_id = xmdObj["rtypes"][s].getAttribute("team_id");
                    var ioratio =
                        xmlnode.Node(xmdObj["rtypes"][s], "ioratio").innerHTML;
                    if (ioratio * 1 == 0) if (top.specialGame.isTeam && team_id == top.specialGame.choice_teamID) dontShowGid.push(gid)
                }
            }
            for (var j = 0; j < cup_fs_len; j++) {
                fs_def_open++;
                var tmp_game = xmdObj["game"][j];
                var gid = xmlnode.Node(tmp_game, "gid").innerHTML;
                if (util.in_array(gid, dontShowGid)) {
                    fs_def_open--;
                    continue
                }
                xmdObj["gtype"] = xmlnode.Node(tmp_game, "FStype");
                var gtype = xmlnode.Node(tmp_game, "FStype").innerHTML;
                if (util.in_array(gtype, config_set.get("GTYPEARY"))) {
                    var tmp_body_screen =
                        "";
                    var zeroCount = 0;
                    var ior_all_zero = true;
                    xmdObj["rtypes"] = xmlnode.Node(tmp_game, "rtypes", false);
                    for (var k = 0; k < xmdObj["rtypes"].length; k++) {
                        var team_id = xmdObj["rtypes"][k].getAttribute("team_id");
                        var ioratio = xmlnode.Node(xmdObj["rtypes"][k], "ioratio").innerHTML;
                        var rtype = xmlnode.Node(xmdObj["rtypes"][k], "rtype").innerHTML;
                        if (ioratio * 1 == 0) {
                            if (top.specialGame.isTeam && team_id == top.specialGame.choice_teamID) continue;
                            zero_ary.push("bet_" + gid + "_" + gid + "_" + rtype);
                            zeroCount++
                        } else ior_all_zero = false;
                        if (gid !=
                            null && rtype != null) {
                            chgColorID = "bet_" + gid + "_" + gid + "_" + rtype;
                            var isChg = typeof gid_rtype_ior[chgColorID] != "undefined" && gid_rtype_ior[chgColorID] != ioratio && ioratio * 1 != 0 && gid_rtype_ior[chgColorID] * 1 != 0;
                            chgColorIor[chgColorID] = isChg;
                            gid_rtype_ior[chgColorID] = ioratio
                        }
                        var model_game_body = dom.getElementById("model_game_body").innerHTML;
                        model_game_body = model_game_body.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>", "");
                        model_game_body = model_game_body.replace(/\*RTYPE\*/g, util.showTxt(xmlnode.Node(xmdObj["rtypes"][k],
                            "rtype").innerHTML));
                        model_game_body = model_game_body.replace(/\*RTYPE_NAME\*/g, util.showTxt(xmlnode.Node(xmdObj["rtypes"][k], "teams").innerHTML));
                        model_game_body = model_game_body.replace(/\*IORATIO\*/g, util.showTxt(util_game.getIoratio(ioratio, null, "FS")));
                        model_game_body = model_game_body.replace(/\*GID\*/g, util.showTxt(xmlnode.Node(tmp_game, "gid").innerHTML));
                        model_game_body = model_game_body.replace(/\*ECID\*/g, util.showTxt(xmlnode.Node(tmp_game, "gid").innerHTML));
                        tmp_body_screen += model_game_body
                    }
                    var model_game_head =
                        dom.getElementById("model_game_head").innerHTML;
                    model_game_head = model_game_head.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>", "");
                    if (ior_all_zero) {
                        fs_def_open--;
                        if (!clickedHash[gid]) openHash["game_movie_" + gid] = false;
                        needHideGid.push(gid)
                    }
                    var open_limit = top.specialGame.isHL ? 6 : 4;
                    var body_display = fs_def_open < open_limit && !ior_all_zero ? "" : "none";
                    if (openHash["game_movie_" + gid] == null) if (body_display == "none") openHash["game_movie_" + gid] = false; else openHash["game_movie_" + gid] =
                        true;
                    var _league = xmlnode.Node(tmp_game, "league").innerHTML;
                    var _datetime = xmlnode.Node(tmp_game, "datetime").innerHTML;
                    var title_display = "";
                    if (fs_lastTime == _datetime && fs_lastLeague == _league) title_display = "none";
                    if (!ior_all_zero) fs_lastTime = _datetime;
                    fs_lastLeague = _league;
                    if (swHash[gid] != null) body_display = swHash[gid];
                    zeroObj[gid] = zeroCount;
                    model_game_head = model_game_head.replace(/\*GAME_TITLE_DISPLAY\*/g, util.showTxt(title_display));
                    model_game_head = model_game_head.replace(/\*GAME_LEAGUE_NAME\*/g, util.showTxt(_league));
                    model_game_head = model_game_head.replace(/\*GAME_DATETIME\*/g, util.showTxt(util.transDateFS(_datetime)));
                    model_game_head = model_game_head.replace(/\*GAME_BODY_DISPLAY\*/g, util.showTxt(body_display));
                    model_game_head = model_game_head.replace(/\*GAME_BODY_CONTENT\*/g, util.showTxt(tmp_body_screen));
                    model_game_head = model_game_head.replace(/\*TEAM_NAME\*/g, util.showTxt(xmlnode.Node(tmp_game, "teamsname").innerHTML));
                    model_game_head = model_game_head.replace(/\*GID\*/g, util.showTxt(xmlnode.Node(tmp_game, "gid").innerHTML));
                    tmp_screen += model_game_head
                }
            }
            div_show.innerHTML = tmp_screen;
            for (var k = 0; k < cup_fs_len; k++) {
                var tmp_game = xmdObj["game"][k];
                var gtype = xmlnode.Node(tmp_game, "FStype").innerHTML;
                var last_game = xmdObj["game"][cup_fs_len - 1];
                if (util.in_array(gtype, config_set.get("GTYPEARY"))) {
                    var gid = xmlnode.Node(tmp_game, "gid").innerHTML;
                    if (util.in_array(gid, dontShowGid)) continue;
                    var last_gid = xmlnode.Node(last_game, "gid").innerHTML;
                    _mc["game_head_" + gid] = dom.getElementById("game_head_" + gid);
                    _mc["game_movie_" + gid] = dom.getElementById("game_movie_" +
                        gid);
                    _mc["fs_show_more_" + gid] = dom.getElementById("fs_show_more_" + gid);
                    _mc["game_head_" + gid].data = gid;
                    util.addEvent(_mc["game_head_" + gid], "click", _self.playMovie, {
                        "body": _mc["game_movie_" + gid],
                        "gid": gid,
                        "LastGid": last_gid
                    });
                    if (openHash["game_movie_" + gid] != null) if (!openHash["game_movie_" + gid]) if (k < 3 && !clickedHash[gid] && !util.in_array(gid, needHideGid)) {
                        openHash["game_movie_" + gid] = true;
                        _mc["game_movie_" + gid].style.display = ""
                    } else _mc["game_movie_" + gid].style.display = "none"; else _mc["game_movie_" + gid].style.display =
                        "";
                    xmdObj["rtypes"] = xmlnode.Node(tmp_game, "rtypes", false);
                    orientationgid.push(gid);
                    orientationxml[gid] = xmlnode.Node(tmp_game, "rtypes", false);
                    orientationobj = zeroObj;
                    if (top.specialGame.isHL) if (getView().viewportwidth < 640) _mc["fs_show_more_" + gid].style.display = xmdObj["rtypes"].length - zeroObj[gid] > 4 ? "" : "none"; else _mc["fs_show_more_" + gid].style.display = xmdObj["rtypes"].length - zeroObj[gid] > 8 ? "" : "none"; else if (getView().viewportwidth < 640) _mc["fs_show_more_" + gid].style.display = xmdObj["rtypes"].length - zeroObj[gid] >
                    12 ? "" : "none"; else _mc["fs_show_more_" + gid].style.display = xmdObj["rtypes"].length - zeroObj[gid] > 24 ? "" : "none";
                    if (!openHash2["game_movie_" + gid]) util.removeClass(_mc["game_movie_" + gid], "on"); else util.addClass(_mc["game_movie_" + gid], "on");
                    util.addEvent(_mc["fs_show_more_" + gid], "click", _self.showFSMore, _mc["game_movie_" + gid]);
                    for (var a = 0; a < xmdObj["rtypes"].length; a++) {
                        var rtype = xmlnode.Node(xmdObj["rtypes"][a], "rtype").innerHTML;
                        var rtype_name = xmlnode.Node(xmdObj["rtypes"][a], "teams").innerHTML;
                        var ioratio =
                            xmlnode.Node(xmdObj["rtypes"][a], "ioratio").innerHTML;
                        if (!util_game.checkIoratio(ioratio)) continue;
                        var obj = dom.getElementById("bet_" + gid + "_" + gid + "_" + rtype);
                        obj.gtype = top.choice_gtype;
                        obj.showtype = top.choice_showtype;
                        obj.gid = gid;
                        obj.ecid = gid;
                        obj.rtype = rtype;
                        obj.ioratio = ioratio;
                        obj.rtype_name = rtype_name;
                        obj.gameObj = tmp_game;
                        var typeName = "";
                        if (top.specialClick == "special") typeName = "special";
                        if (top.outrightsClick == "outrights") typeName = "outrights";
                        obj.f = util_game.checkBetFrom(typeName, "R");
                        util.addEvent(obj,
                            "click", _self.showBetEventFS, obj)
                    }
                }
            }
            for (var i = 0; i < zero_ary.length; i++) {
                var _id = zero_ary[i];
                var obj = dom.getElementById(_id);
                obj.style.display = "none"
            }
            var ioratio_closeCount = 0;
            for (var k = 0; k < cup_fs_len; k++) {
                var tmp_game = xmdObj["game"][k];
                var gid = xmlnode.Node(tmp_game, "gid").innerHTML;
                if (util.in_array(gid, dontShowGid)) {
                    ioratio_closeCount++;
                    continue
                }
                var all_close = true;
                var ior_div = _mc["game_movie_" + gid].children[0];
                for (var j = 0; j < ior_div.children.length; j++) if (ior_div.children[j].style.display == "") {
                    all_close =
                        false;
                    break
                }
                if (all_close) {
                    dom.getElementById("title_fs_" + gid).style.display = "none";
                    _mc["game_head_" + gid].style.display = "none";
                    _mc["game_movie_" + gid].style.display = "none";
                    ioratio_closeCount++
                }
            }
            if (ioratio_closeCount == xmdObj["game"].length) {
                fs_empty = true;
                _self.showNoData(true);
                div_show.innerHTML = "";
                var title_fs = dom.getElementById("title_fs");
                var btn_all_fs = dom.getElementById("btn_all_fs");
                div_show.style.display = "none";
                title_fs.style.display = "none";
                btn_all_fs.style.display = "none";
                if (top.specialClick ==
                    "special") sportFrame.setTitle("special", {"title": top.specialGame.title}); else sportFrame.setTitle("league", {
                    "gtype": top.choice_gtype,
                    "league": LS.get("showtype_fs")
                });
                return
            } else dom.getElementById("div_nodata").style.display = "none";
            chgColorIor = util_game.chgIorColor(dom, util, chgColorIor);
            util_game.initSelect(util);
            if (top.specialClick == "special") sportFrame.setTitle("special", {"title": top.specialGame.title}); else sportFrame.setTitle("league", {
                "gtype": top.choice_gtype,
                "league": LS.get("showtype_fs")
            });
            util.addEvent(dom.getElementById("btn_all_fs"), "click", _self.goToSpecialFS)
        }
    };
    _self.playMovie = function (e, targetObj) {
        var gid = targetObj.gid;
        var game_body = targetObj.body;
        var last_gid = targetObj.LastGid;
        var body_show = dom.getElementById("body_show");
        var title_fs = dom.getElementById("title_fs_" + gid);
        var game_head = dom.getElementById("game_head_" + gid);
        var targetPosition = 0;
        clickedHash[gid] = true;
        if (openHash[game_body.id] == null) if (game_body.style.display == "none") {
            openHash[game_body.id] = true;
            game_body.style.display =
                ""
        } else {
            openHash[game_body.id] = false;
            game_body.style.display = "none"
        } else {
            if (openHash[game_body.id]) openHash[game_body.id] = false; else if (!openHash[game_body.id]) openHash[game_body.id] = true;
            game_body.style.display = !openHash[game_body.id] ? "none" : ""
        }
        if (title_fs.style.display == "none") targetPosition = game_head.offsetTop; else targetPosition = title_fs.offsetTop;
        if (game_body.style.display == "" && game_body.id == "game_movie_" + last_gid) _self.goToTargetPosition(body_show, targetPosition)
    };
    _self.goToTargetPosition = function (target,
                                         px) {
        var cup_fs_show = dom.getElementById("cup_fs_show");
        target.scrollTop = px + cup_fs_show.offsetTop
    };
    _self.showFSMore = function (e, tarObj) {
        if (openHash2[tarObj.id] == null) openHash2[tarObj.id] = true; else if (openHash2[tarObj.id]) openHash2[tarObj.id] = false; else if (!openHash2[tarObj.id]) openHash2[tarObj.id] = true;
        if (!openHash2[tarObj.id]) util.removeClass(tarObj, "on"); else util.addClass(tarObj, "on")
    };
    _self.initCheckScroll = function (totalObj, divObj, leftObj, rightObj) {
        var total_w = totalObj.clientWidth;
        var menu_w = divObj.clientWidth;
        var scroll_w = divObj.scrollLeft;
        if (total_w > menu_w) {
            if (scroll_w != 0) util.addClass(leftObj, "on");
            if (scroll_w != menu_w) util.addClass(rightObj, "on")
        } else {
            if (leftObj.classList.contains("on")) {
                util.removeClass(leftObj, "on");
                util.removeEvent(leftObj, "click")
            }
            if (rightObj.classList.contains("on")) {
                util.removeClass(rightObj, "on");
                util.removeEvent(rightObj, "click")
            }
        }
        if (leftObj.classList.contains("on")) util.addEvent(leftObj, "click", _self.move, {
            "click": leftObj,
            "div": divObj,
            "direction": "left",
            "opposite": rightObj
        });
        if (rightObj.classList.contains("on")) util.addEvent(rightObj, "click", _self.move, {
            "click": rightObj,
            "div": divObj,
            "direction": "right",
            "opposite": leftObj
        })
    };
    _self.move = function (e, hash) {
        var clickObj = hash.click;
        var divObj = hash.div;
        var movePix = divObj.clientWidth;
        var move = hash.direction == "right" ? movePix : movePix * -1;
        _self.checkScrolltoShow(clickObj, hash.direction, hash.opposite, divObj, move)
    };
    _self.checkScrolltoShow = function (clickObj, _dir, _oppositeObj, divObj, move) {
        var dirAry = new Object;
        dirAry["left"] = "right";
        dirAry["right"] = "left";
        if (!_oppositeObj.classList.contains("on")) {
            util.addClass(_oppositeObj, "on");
            util.addEvent(_oppositeObj, "click", _self.move, {
                "click": _oppositeObj,
                "div": divObj,
                "direction": dirAry[_dir],
                "opposite": clickObj
            })
        }
        var sl = divObj.scrollLeft + move;
        divObj.scrollLeft += move;
        if (_dir == "right") {
            var scroll_w = sl + divObj.clientWidth;
            if (scroll_w >= divObj.scrollWidth) util.removeClass(clickObj, "on")
        } else if (sl <= 0) util.removeClass(clickObj, "on")
    };
    _self.setData = function (_name, count) {
        if (count * 1 <= 0) _mc["symbol_" +
        _name].style.display = "none"; else _mc["symbol_" + _name].style.display = ""
    };
    _self.showExtraInfo = function (e, hash) {
        var ptype = hash.ptype;
        var hasEC = hash.hasEC;
        var _main = hash.mainScore;
        var _extra = hash.extraScore;
        var dots = top["userData"].langx == "en-us" ? "." : "\u3002";
        var _msg = "";
        _msg += "<li>" + LS_game.get("str_ExtraInfo_" + ptype) + "</li>";
        if (hasEC == "Y") {
            if (_main != "" && _extra == "") _msg += "<li>" + LS_game.get("str_ExtraScore_FULL") + _main + dots + "</li>";
            if (_extra != "") _msg += "<li>" + LS_game.get("str_ExtraScore_ET") + _extra + dots +
                "</li>"
        }
        var _par = new Object;
        _par["_id"] = "info_pop";
        _par["title"] = "<li>" + LS_game.get("str_ExtraTitle_" + ptype) + "</li>";
        _par["msg"] = _msg;
        parentClass.dispatchEvent("showAlertMsg", _par)
    };
    _self.AlertFantasyInfo = function (e, hash) {
        parentClass.dispatchEvent("showFantasyInfo", hash)
    };
    _self.clickMore = function (MouseEvent, tarObj) {
        var obj = MouseEvent.target;
        var playDone = false;
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        if (obj.id.indexOf("icon_tv_") != -1) if (getView().viewportwidth >=
            1024) {
            if (dom.getElementById("R_tv_error_msg")) dom.getElementById("R_tv_error_msg").innerHTML = "";
            if (top.choice_gtype == "ft" && top.choice_showtype == "parlay" && tarObj.isRB == "Y") {
                parentClass.dispatchEvent("setRightLoading", {"isShow": true});
                parentClass.dispatchEvent("loadRightScore", {"scFun": _self.playRightTV, "tarObj": tarObj, "obj": obj});
                parentClass.dispatchEvent("setRightLoading", {"isShow": false})
            } else {
                parentClass.dispatchEvent("setRightLoading", {"isShow": true});
                var tmpShowtype = util_game.transMyGameShowtype(tarObj.myGameShowtype);
                if ((top.choice_showtype == "mygame" || isSpecialGame == "Y") && top.rightShowType != tmpShowtype && top.choice_gtype != "ft") {
                    top.rightShowType = tmpShowtype;
                    playDone = parentClass.dispatchEvent("loadRightScore", {
                        "scFun": _self.playRightTV,
                        "tarObj": tarObj,
                        "obj": obj
                    });
                    if (playDone) parentClass.dispatchEvent("setRightLoading", {"isShow": false})
                } else {
                    playDone = _self.playRightTV(tarObj, obj);
                    if (playDone) parentClass.dispatchEvent("setRightLoading", {"isShow": false})
                }
            }
        } else _self.showMore(tarObj); else if (obj.id.indexOf("star_") !=
            -1 && top.myGame_sw) _self.setMyGame(tarObj, obj); else if (obj.id.indexOf("icon_forecast_") != -1) _self.showForecast(tarObj); else _self.showMore(tarObj)
    };
    _self.playRightTV = function (tarObj, obj) {
        top["pageTS"]["rightTV"] = util.getTimestamp();
        var _ecid = tarObj.ECID;
        var gidm = tarObj.gidm;
        var tmpID = top.choice_gtype == "ft" ? _ecid : gidm;
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        if (top.rightECID != "") parentClass.dispatchEvent("resetRightTV", {});
        var lastObj = document.getElementById("icon_tv_" +
            top.rightECID);
        if (lastObj && top.rightECID != tmpID) {
            lastObj.classList.remove("now");
            obj.classList.add("now")
        } else if (top.rightECID == "") obj.classList.add("now");
        top.rightECID = tmpID;
        top.rightGtype = top.choice_gtype;
        top.rightRB = tarObj.isRB;
        if (top.choice_showtype == "mygame" || isSpecialGame == "Y") top.rightShowType = util_game.transMyGameShowtype(tarObj.myGameShowtype);
        var mt_icon = dom.getElementById("R_mt_btn");
        if (obj.className.indexOf("icon_tv") != -1) {
            top.rightNowPlay = "TV";
            if (mt_icon) mt_icon.classList.remove("on")
        } else if (obj.className.indexOf("icon_match") !=
            -1) {
            top.rightNowPlay = "MT";
            if (mt_icon) mt_icon.classList.add("on")
        }
        scDataObj = _self.getScDataObj(tarObj.gameObj, tarObj.mainGame);
        top.scDataObj = scDataObj;
        top.resize_mainGame = tarObj.mainGame;
        top.rightFrom = "game_list";
        parentClass.dispatchEvent("parseRightScoreBoard", scDataObj);
        echo("[game_list][scDataObj]:", scDataObj);
        parentClass.dispatchEvent("checkRightLive", {
            "xmlnode": _xmlnode,
            "mainGame": scDataObj["mainGame"],
            "from": "game_list"
        });
        if (top.rightNowPlay == "TV" && (top.choice_showtype == "live" || top.choice_showtype ==
            "parlay" && tarObj.isRB == "Y" || (top.choice_showtype == "mygame" || isSpecialGame == "Y") && tarObj.myGameShowtype == "rb")) parentClass.dispatchEvent("playRightTV", {});
        dom.getElementById("right_show").scrollTop = 0;
        first_no_tvmt = false;
        return true
    };
    _self.showMore = function (tarObj) {
        console.log("[showMore][tarObj]:", tarObj);
        var _ecid = tarObj.ECID;
        var _gidm = tarObj.gidm;
        var lid = tarObj.lid;
        var isRB = tarObj.isRB != null ? tarObj.isRB : "N";
        var param = new Object;
        var choiceGtype = top.choice_gtype.toUpperCase();
        var _postHash = new Object;
        var tmpID = top.choice_gtype == "ft" ? _ecid : _gidm;
        var _myGameShowtype = util_game.transMyGameShowtype(tarObj.myGameShowtype);
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        top.rightRB = isRB;
        if (top.specialClick == "special") _postHash["specialClick"] = top.specialClick;
        _postHash["gtype"] = top.choice_gtype;
        _postHash["showtype"] = top.choice_showtype == "mygame" || isSpecialGame == "Y" ? _myGameShowtype : top.choice_showtype;
        _postHash["isRB"] = isRB;
        _postHash["lid"] = lid;
        _postHash["isFantasy"] =
            tarObj.isFantasy;
        _postHash["fantasyObj"] = tarObj.fantasyObj;
        _postHash["league"] = tarObj.league;
        _postHash["team_h"] = tarObj.team_h;
        _postHash["team_c"] = tarObj.team_c;
        _postHash["score_h"] = tarObj.score_h;
        _postHash["score_c"] = tarObj.score_c;
        _postHash["retime"] = tarObj.retime;
        _postHash["datetime"] = tarObj.datetime;
        _postHash["gid"] = tarObj.gid;
        if (top.choice_showtype == "mygame" || isSpecialGame == "Y") param["post"] = "showtype=" + _myGameShowtype + "&isRB=" + isRB; else param["post"] = "showtype=" + top.choice_showtype + "&isRB=" +
            isRB;
        _postHash["ecid"] = _ecid;
        _postHash["gidm"] = _gidm;
        param["page"] = "game_more_" + choiceGtype;
        param["postHash"] = _postHash;
        param["isRB"] = isRB;
        param["isMyGame"] = top.choice_showtype == "mygame" ? "Y" : "N";
        param["extendsClass"] = "game_more";
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.showGameLoading = function (isShow, mode) {
        _mc["game_loading"].style.display = isShow ? "" : "none";
        if (isShow) if (mode == "cup") util.addClass(_mc["game_loading"], "loading_cup_on"); else util.addClass(_mc["game_loading"], "loading_on");
        else {
            var loadAD_done = top.specialGame.isHL && top.loadAD_done;
            var loadTeam_done = top.specialGame.isTeam && top.loadTeam_done;
            if (loadAD_done || loadTeam_done) {
                util.removeClass(_mc["game_loading"], "loading_on");
                util.removeClass(_mc["game_loading"], "loading_cup_on")
            }
        }
        var goRename = top.specialGame.isTeam ? needRename && !isShow && loadTeam_done : needRename && !isShow;
        if (needRename && !isShow) {
            _self.bodyRename();
            needRename = false;
            top.chgBodyDone = true
        }
    };
    _self.showBetEvent = function (MouseEvent, tarObj) {
        var _size = util.countSize(top["bet_select"]);
        if (_size < 10 || util.in_object("ec_" + tarObj.ecid, top["bet_viewdata"])) {
            top.betMode = "fast";
            var _par = new Object;
            _par.showtype = tarObj.showtype;
            _par.ecid = tarObj.ecid;
            if (FantasyDataHash["ec" + tarObj.ecid] != null) {
                _par.isFantasy = FantasyDataHash["ec" + tarObj.ecid]["isFantasy"];
                _par.fantasyObj = FantasyDataHash["ec" + tarObj.ecid]["fantasyObj"]
            } else {
                _par.isFantasy = "N";
                _par.fantasyObj = ""
            }
            _par.gid = tarObj.gid;
            _par.wtype = util_game.filterP(tarObj.wtype, false);
            _par.rtype = util_game.filterP(tarObj.rtype, false);
            _par.gtype =
                tarObj.gtype.toUpperCase();
            _par.chose_team = tarObj.chose_team;
            _par.imp = tarObj.imp;
            _par.isFromOutside = "Y";
            if (tarObj.is_rb != null) _par.is_rb = tarObj.is_rb;
            _par.ptype = tarObj.ptype;
            _par.f = tarObj.f;
            _par.MSorPOINT = tarObj.MSorPOINT;
            echo(_par, "showBetEvent");
            if (top["openBets"] && !top["isOrderView"]) parentClass.dispatchEvent("clearBets", {});
            if (tarObj.remain_rtype != null) _par.remain_rtype = tarObj.remain_rtype;
            var game_information = util_game.setSelect(dom, util, {"obj": tarObj, "paramHash": _par});
            if (!game_information.isRepeat) parentClass.dispatchEvent("showBetSlip",
                {
                    "isShow": true,
                    "xmlnode": _xmlnode,
                    "gameObj": tarObj.gameObj,
                    "paramHash": _par,
                    "isSameEcid": game_information.isSameEcid
                }); else {
                if (top.isSameGame.indexOf(_par.ecid) == -1) top.isSameGame.push(_par.ecid);
                parentClass.dispatchEvent("reCalcBetslip", {"isRepeat": game_information.isRepeat})
            }
        } else parentClass.dispatchEvent("showAlertMsg", {
            "target": "message_pop_nobtn",
            "msg": LS.get("order_limit"),
            "confirm": "N",
            "retFun": ""
        })
    };
    _self.showBetEventFS = function (MouseEvent, tarObj) {
        var _size = util.countSize(top["bet_select"]);
        if (_size < 10 || util.in_object("ec_" + tarObj.ecid, top["bet_viewdata"])) {
            top.betMode = "fast";
            var _par = new Object;
            _par.showtype = tarObj.showtype;
            _par.gid = tarObj.gid;
            _par.ecid = tarObj.ecid;
            _par.gtype = tarObj.gtype.toUpperCase();
            _par.rtype = tarObj.rtype;
            _par.rtype_name = tarObj.rtype_name;
            _par.ioratio = tarObj.ioratio;
            _par.bet_now = "FS";
            _par.isFromOutside = "Y";
            _par.f = tarObj.f;
            if (tarObj.mode) _par.mode = tarObj.mode;
            if (tarObj.betLeagueName) _par.betLeagueName = tarObj.betLeagueName;
            echo(_par, "showBetEvent");
            if (top["openBets"] &&
                !top["isOrderView"]) parentClass.dispatchEvent("clearBets", {});
            var game_information = util_game.setSelect(dom, util, {"obj": tarObj, "paramHash": _par});
            if (!game_information.isRepeat) parentClass.dispatchEvent("showBetSlip", {
                "isShow": true,
                "xmlnode": _xmlnode,
                "gameObj": tarObj.gameObj,
                "paramHash": _par,
                "isSameEcid": game_information.isSameEcid
            }); else parentClass.dispatchEvent("reCalcBetslip", {"isRepeat": game_information.isRepeat})
        } else parentClass.dispatchEvent("showAlertMsg", {
            "target": "message_pop_nobtn", "msg": LS.get("order_limit"),
            "confirm": "N", "retFun": ""
        })
    };
    _self.replacePtype = function (ptype) {
        var tmp_ptype = ptype;
        var base_ary = Array(" - ", " -", "- ", "-");
        for (i = 0; i < base_ary.length; i++) {
            var base = base_ary[i];
            var pos = tmp_ptype.indexOf(base);
            if (pos == 0) {
                tmp_ptype = tmp_ptype.replace(base, "");
                break
            }
        }
        return tmp_ptype
    };
    _self.checkRatioR = function (keys, vals, tmp_game_copy) {
        if (keys.match(/[HALF|MS|POINT]_RATIO_RE?[H|C]$/g)) {
            var HForMS = keys.split("_")[0];
            var tag = keys.split("_")[2];
            var tagWtype = tag.substring(0, tag.length - 1);
            var _strRatio = HForMS +
                "_RATIO_" + tagWtype;
            var ratio = tmp_game_copy[_strRatio.toLowerCase()];
            var _strStrong = HForMS + "_STRONG";
            var strong = tmp_game_copy[_strStrong.toLowerCase()];
            vals = ratio;
            if (ratio != 0) vals = ((new RegExp(strong + "$")).test(tag) ? "-" : "+") + ratio;
            if (vals) vals = vals.replace(/\s/g, "")
        } else if (keys.match(/^RATIO_H?RE?[H|C]$/g)) {
            var tag = keys.split("_")[1];
            var strH = /^H/.test(tag) ? "H" : "";
            var tagWtype = tag.substring(0, tag.length - 1);
            var _strRatio = "RATIO_" + tagWtype;
            var ratio = tmp_game_copy[_strRatio.toLowerCase()];
            var _strStrong =
                strH + "STRONG";
            var strong = tmp_game_copy[_strStrong.toLowerCase()];
            vals = ratio;
            if (ratio != 0) vals = ((new RegExp(strong + "$")).test(tag) ? "-" : "+") + ratio;
            if (vals) vals = vals.replace(/\s/g, "")
        }
        return vals
    };
    _self.checkRatioOU = function (keys, vals, tmp_game_copy) {
        if (keys.match(/^RATIO_H?R?OU[O|U]$/g) || keys.match(/^RATIO_R?OU[H|C][O|U]$/g) || keys.match(/[HALF|MS|POINT]?_RATIO_R?OU[H|C]?[O|U]$/g)) {
            if (vals) vals = vals.replace(/U/, "").replace(/O/, "");
            if (vals) vals = vals.replace(/\s/g, "")
        }
        return vals
    };
    _self.orientationchange =
        function () {
            var orientation = win.Math.abs(win.orientation);
            if (orientation == 90 || orientation == 0) {
                if (page_sw) RESIZE = true;
                if (postHash["rtype"] == "fs") if (navigator.userAgent.indexOf("MIX") > -1 || !isIOS) setTimeout(_self.orientation90or0, 250); else setTimeout(_self.orientation90or0, 50);
                if (page_sw && !isIOS) _self.showPagination(_totalPage, true)
            }
        };
    _self.winnerListResize = function (width) {
        if (top.specialGame.isHL) {
            dom.getElementById("winner_scroll").scrollLeft = 0;
            if (width == "840") dom.getElementById("cup_show_more").style.display =
                resizeWinnerCnt - resizeZeroCnt > 16 ? "" : "none"; else if (width == "640") dom.getElementById("cup_show_more").style.display = resizeWinnerCnt - resizeZeroCnt > 12 ? "" : "none"; else dom.getElementById("cup_show_more").style.display = "none"
        }
    };
    _self.orientation90or0 = function () {
        for (var k = 0; k < orientationgid.length; k++) {
            _mc["fs_show_more_" + orientationgid[k]] = dom.getElementById("fs_show_more_" + orientationgid[k]);
            if (top.specialGame.isHL) if (getView().viewportwidth < 640) _mc["fs_show_more_" + orientationgid[k]].style.display = orientationxml[orientationgid[k]].length -
            orientationobj[orientationgid[k]] > 4 ? "" : "none"; else _mc["fs_show_more_" + orientationgid[k]].style.display = orientationxml[orientationgid[k]].length - orientationobj[orientationgid[k]] > 8 ? "" : "none"; else if (getView().viewportwidth < 640) _mc["fs_show_more_" + orientationgid[k]].style.display = orientationxml[orientationgid[k]].length - orientationobj[orientationgid[k]] > 12 ? "" : "none"; else _mc["fs_show_more_" + orientationgid[k]].style.display = orientationxml[orientationgid[k]].length - orientationobj[orientationgid[k]] >
            24 ? "" : "none"
        }
    };
    _self.exitEvent = function () {
        parentClass.dispatchEvent("resetHeaderTimer", "create");
        win.removeEventListener("orientationchange", _self.orientationchange);
        if (clusterize_sw && clusterize) _self.clusterizeDestroy();
        if (worker_sw && window.Worker) _worker.postMessage({"cmd": "closeWorker"});
        return true
    };
    _self.clusterizeDestroy = function () {
        clusterize.destroy();
        clusterize = null
    };

    function get(_id) {
        return dom.getElementById(_id)
    }

    _self.resizeEvent = function (width1024) {
        var isSpecialGame = top.specialClick !=
        "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        if (width1024) {
            if (top.rightECID != "") {
                if (top.choice_rtype == "fs" || top.choice_rtype.match("pd")) scDataObj = top.scDataObj;
                parentClass.dispatchEvent("parseRightScoreBoard", scDataObj)
            }
            if (top.rightECID != "") parentClass.dispatchEvent("checkRightLive", {
                "xmlnode": _xmlnode,
                "mainGame": top.resize_mainGame,
                "from": "game_list"
            });
            echo("\u544a\u8a34\u6211\u73fe\u5728rightPlay\u7684\u503c\uff1a", rightPlay);
            if (rightPlay) parentClass.dispatchEvent("rightResizeEvent",
                {"act": "defalutPlay"});
            setTimeout(_self.closeRightLoadingSlowly, "500");
            if (document.getElementById("icon_tv_" + top.rightECID)) document.getElementById("icon_tv_" + top.rightECID).classList.add("now")
        } else {
            rightPlay = parentClass.chkTvPlaying();
            if (top.rightNowPlay != "MT") parentClass.dispatchEvent("resetRightTV", {});
            if (document.getElementById("icon_tv_" + top.rightECID)) document.getElementById("icon_tv_" + top.rightECID).classList.remove("now")
        }
    };
    _self.closeRightLoadingSlowly = function () {
        parentClass.dispatchEvent("setRightLoading",
            {"isShow": false})
    };
    _self.obtScroll = function (e) {
        var xmdObj = new Object;
        xmdObj["ec"] = _xmlnode.Node(_xmlnode.Root[0], "ec", false);
        for (var j = 0; j < xmdObj["ec"].length; j++) {
            var tmp_ec = xmdObj["ec"][j];
            var ECID = tmp_ec.getAttribute("id").replace(/ec/, "");
            var menuObj = dom.getElementById("div_OBT_menu_" + ECID);
            if (!menuObj) continue;
            var tarObj = dom.getElementById("OBT_total_" + ECID);
            var leftObj = dom.getElementById("OBT_left_" + ECID);
            var rightObj = dom.getElementById("OBT_right_" + ECID);
            _self.initCheckScroll(tarObj, menuObj,
                leftObj, rightObj)
        }
    };
    _self.addOBTClick = function (param) {
        var ECID = param.tagName;
        var nowModel = param.nowModel;
        var getEarlyGame = param.isEarly;
        var myGameShowtype = param.myGameShowtype;
        var isSpecialGame = top.specialClick != "" && !top.specialGame.isFantasy && top.choice_rtype != "fs" ? "Y" : "N";
        var menuObj = dom.getElementById("div_OBT_menu_" + ECID);
        var objids = top.choice_showtype.match(/live|parlay/) ? ",OBT_RE,OBT_ROU," : ",OBT_R,OBT_OU,";
        objids += ",OBT_MIX,OBT_CN,OBT_RN,OBT_WI,OBT_ET,OBT_PK,";
        var pageIndex = menuObj ? menuObj.getAttribute("data-page") :
            0;
        var gameIndex = menuObj ? menuObj.getAttribute("data-gameindex") : 0;
        var ary = util.getObjAry(menuObj, objids);
        for (var i = 0; i < OBTAry.length; i++) {
            var tmp_type = top.choice_showtype.match(/live|parlay/) && OBT_rb_Ary[OBTAry[i]] != null ? OBT_rb_Ary[OBTAry[i]] : OBTAry[i];
            if (top.choice_showtype == "mygame" || isSpecialGame == "Y") tmp_type = myGameShowtype == "rb" && OBT_rb_Ary[OBTAry[i]] != null ? OBT_rb_Ary[OBTAry[i]] : OBTAry[i];
            if (OBT_mix_Ary.indexOf(tmp_type) != -1) {
                MixObtRtype[ECID] = tmp_type;
                tmp_type = "MIX"
            }
            var click_type = tmp_type;
            if (nowModel ==
                "ET") click_type = "ET" + tmp_type;
            util.addEvent(ary["OBT_" + tmp_type], "click", _self.chgDiv, {
                "obj": ary["OBT_" + tmp_type],
                "ECID": ECID,
                "model": click_type,
                "pageIndex": pageIndex,
                "gameIndex": gameIndex,
                "isEarly": getEarlyGame
            })
        }
    };
    _self.removeOBTClick = function (param) {
        var ECID = param.tagName;
        var menuObj = dom.getElementById("div_OBT_menu_" + ECID);
        var objids = top.choice_showtype.match(/live|parlay/) ? ",OBT_RE,OBT_ROU," : ",OBT_R,OBT_OU,";
        objids += ",OBT_MIX,OBT_CN,OBT_RN,OBT_WI,OBT_ET,OBT_PK,";
        var ary = util.getObjAry(menuObj,
            objids);
        for (var i = 0; i < OBTAry.length; i++) {
            var tmp_type = top.choice_showtype.match(/live|parlay/) && OBT_rb_Ary[OBTAry[i]] != null ? OBT_rb_Ary[OBTAry[i]] : OBTAry[i];
            if (OBT_mix_Ary.indexOf(tmp_type) != -1) tmp_type = "MIX";
            if (ary["OBT_" + tmp_type]) util.removeEvent(ary["OBT_" + tmp_type], "click")
        }
    };
    _self.setMyGame = function (tarObj, obj) {
        var ecidHash = top["myGameHash"][top.choice_gtype];
        var myGameCnt = util.countSize(ecidHash);
        var tmpShowType = "";
        parentClass.dispatchEvent("showGreenBtnProc", true);
        if (!ecidHash[tarObj.myGameID]) {
            if (myGameCnt >=
                25) {
                parentClass.dispatchEvent("showAlertMsg", {
                    "target": "message_pop_nobtn",
                    "msg": LS.get("addMyGame_block"),
                    "confirm": "N",
                    "retFun": ""
                });
                return
            }
            ecidHash[tarObj.myGameID] = new Object;
            if (top.choice_showtype == "parlay" || top.specialClick == "special") if (tarObj.isRB == "Y") tmpShowType = "live"; else tmpShowType = tarObj.isToday == "Y" ? "today" : "early"; else tmpShowType = top.choice_showtype;
            ecidHash[tarObj.myGameID]["showtype"] = tmpShowType;
            if (obj) util.addClass(obj, "on");
            parentClass.dispatchEvent("showAlertMsg", {
                "target": "message_pop_nobtn",
                "msg": LS.get("addMyGame_success"), "confirm": "N", "retFun": ""
            });
            parentClass.dispatchEvent("addMyEventAnimation", {"action": "add"})
        } else {
            delete ecidHash[tarObj.myGameID];
            var allZero = util.chkAllMyGameHash(true);
            if (allZero) parentClass.dispatchEvent("showGreenBtnProc", false);
            if (obj) util.removeClass(obj, "on");
            parentClass.dispatchEvent("addMyEventAnimation", {"action": "remove"})
        }
        util.setMyGameCookie(CookieManager, ecidHash, top.choice_gtype)
    };
    _self.checkMyGame = function (ecid_ary) {
        var ecidHash = top["myGameHash"][top.choice_gtype];
        for (var ecid in ecidHash) if (ecid_ary.indexOf(ecid) == -1) {
            if (top.choice_showtype == "mygame" && !top.choice_rtype.match("pd")) util.delMyGameHash(ecidHash, ecid, config_set)
        } else {
            if (ecidHash[ecid]["ts"] != null && ecidHash[ecid]["ts"] != "") {
                ecidHash[ecid]["ts"] = "";
                _self.getMyGameCnt()
            }
            if (dom.getElementById("star_" + ecid)) util.addClass(dom.getElementById("star_" + ecid), "on")
        }
        util.setMyGameCookie(CookieManager, ecidHash, top.choice_gtype);
        var allZero = util.chkAllMyGameHash(true);
        if (allZero) parentClass.dispatchEvent("showGreenBtnProc",
            false)
    };
    _self.myGameClose = function () {
        parentClass.dispatchEvent("bodyGoToPage", {"page": "home"});
        parentClass.dispatchEvent("showAlertMsg", {
            "target": "message_pop_nobtn",
            "msg": LS.get("myGame_backToHome"),
            "confirm": "N",
            "retFun": ""
        });
        parentClass.dispatchEvent("hideAlertMsg", {"use": "noPopAllClear"})
    };
    _self.starShow = function (isShow) {
        var starObj = dom.querySelectorAll(".box_star");
        for (var i = 0; i < starObj.length; i++) starObj[i].style.display = isShow ? "" : "none"
    };
    _self.getMyGameCnt = function () {
        if (sportFrame != null) sportFrame.getMyGameData()
    };
    _self.noDataProc = function () {
        _self.showGameLoading(false);
        if (!reload) parentClass.dispatchEvent("showLoading", {"isShow": false});
        if (top.choice_rtype.indexOf("pd") == -1) {
            if (top.rightECID != "") parentClass.dispatchEvent("resetRightTV", {});
            parentClass.dispatchEvent("setRightLoading", {"isShow": false});
            parentClass.dispatchEvent("setRightVisible", {"isShow": false});
            top.rightNowPlay = "";
            top.rightECID = "";
            top.rightGtype = ""
        }
        if (top.rightECID != "") parentClass.dispatchEvent("setRightTimer", "start")
    };
    _self.updateMyGame =
        function (ecid, gameDate, showtype) {
            var ecidHash = top["myGameHash"][top.choice_gtype];
            if (ecidHash[ecid] != null) if (ecidHash[ecid]["showtype"] != showtype) ecidHash[ecid]["showtype"] = showtype;
            util.setMyGameCookie(CookieManager, ecidHash, top.choice_gtype)
        };
    _self.isToady = function (xml_datetime, sys_time) {
        var isToday = "N";
        if (xml_datetime != null && xml_datetime != "") try {
            var tmpdate = xml_datetime.split(" ");
            var tmpdate = tmpdate[0];
            var gmt = new Date(sys_time.replace(/-/g, "/"));
            var now_m = parseInt(gmt.getMonth() + 1);
            var game_m =
                parseInt(tmpdate.split("-")[0]);
            if (now_m > game_m) gmt.setFullYear(gmt.getFullYear() + 1);
            var y = gmt.getFullYear();
            tmpdate = y + "-" + tmpdate;
            isToday = util_game.isToday(tmpdate) ? "Y" : "N"
        } catch (e) {
            console.log(e)
        }
        return isToday
    };
    _self.tabScroll = function (e) {
        var _total = dom.getElementById("tab_total");
        var _scroll = dom.getElementById("tab_scroll");
        var _left = dom.getElementById("tab_left");
        var _right = dom.getElementById("tab_right");
        if (_total.clientWidth > _scroll.clientWidth) {
            util.addClass(_right, "on");
            util.addEvent(_right,
                "click", util.move, {"click": _right, "div": _scroll, "direction": "right", "opposite": _left})
        } else {
            util.removeClass(_right, "on");
            util.removeEvent(_right, "click")
        }
        util.addEvent(_scroll, "scroll", _self.addScrollEvent, {
            "total": _total,
            "scroll": _scroll,
            "left": _left,
            "right": _right
        });
        if (_scroll.clientWidth != 0) top.tab_scroll_clientWidth = _scroll.clientWidth;
        if (_total.clientWidth != 0) top.tab_total_clientWidth = _total.clientWidth
    };
    _self.new_eval = function (str) {
        var fn = Function;
        return (new fn("return " + str))()
    };
    _self.onMessageEvent =
        function (code) {
            var cmds = code.split("|");
            var name = cmds[1];
            switch (cmds[0]) {
                case "S002":
                    _self.closeLoading(name);
                    break;
                case "S004":
                    if (top.specialGame.isTeam) {
                        var heights = name.split("_");
                        var leaderH = heights[0] * 1;
                        var infoH = heights[1] * 1;
                        var totalHeight = 0;
                        if (getView().viewportwidth < 640) totalHeight = leaderH + infoH + 16 + 2 + 2; else if (leaderH > infoH) totalHeight = leaderH + 2; else totalHeight = infoH + 2;
                        document.getElementById("widgetFrame").style.height = totalHeight + "px"
                    } else document.getElementById("widgetFrame").style.height =
                        name + "px";
                    break
            }
        };
    _self.showForecast = function (par) {
        if (timerHash["gameTimer"] != null) timerHash["gameTimer"].stopTimer();
        if (top.rightShowTV && getView().viewportwidth >= 1024) {
            if (timerHash["rightPanelTimer"] == null) parentClass.dispatchEvent("setRightTimer", "create");
            timerHash["rightPanelTimer"].startTimer()
        }
        par["from"] = "game_list";
        if (par.ptype != "") {
            par.team_h = par.team_h.replace(par.ptype, "");
            par.team_c = par.team_c.replace(par.ptype, "")
        }
        parentClass.dispatchEvent("showForecast", par)
    };
    _self.restartTimer = function () {
        _self.getData();
        top.rightFrom = "game_list";
        if (timerHash["gameTimer"] != null) timerHash["gameTimer"].startTimer();
        if (timerHash["rightPanelTimer"] != null) timerHash["rightPanelTimer"].stopTimer()
    }
};