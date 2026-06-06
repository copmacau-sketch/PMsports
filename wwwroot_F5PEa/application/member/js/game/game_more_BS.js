function game_more_BS(_win, _dom, _post) {
    var classname = "game_more_BS";
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var util;
    var util_game;
    var tv;
    var mt;
    var LS_game;
    var _xmlnode;
    var scDataObj;
    var over1024 = getView().viewportwidth >= 1024;
    var util_game = new win.Util_game(win, dom);
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
    var game_H = "";
    var game_A = "";
    var out_count = "";
    var gameCount = 0;
    var game_half = "";
    var base_icon_list = "";
    _self.init = function () {
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
    };
    _self.initFun = function () {
        wtypeFun["live"] = _self.getWtypeRB;
        wtypeFun["today"] = _self.getWtypeFT;
        wtypeFun["early"] = wtypeFun["today"];
        wtypeFun["parlay"] = wtypeFun["today"];
        rtypeFun["live"] = _self.getRtypeRB;
        rtypeFun["today"] = _self.getRtypeFT;
        rtypeFun["early"] = rtypeFun["today"];
        rtypeFun["parlay"] = rtypeFun["today"]
    };
    _self.getHash = function () {
        try {
            wtypeHash = wtypeFun[showtype]();
            rtypeHash = rtypeFun[showtype]()
        } catch (e) {
        }
    };
    _self.getWtypeRB = function () {
        var ary = new Object;
        ary["FT"] = _self.getWtypeRB_FT();
        return ary
    };
    _self.getWtypeFT = function () {
        var ary = new Object;
        ary["FT"] = _self.getWtypeFT_FT();
        return ary
    };
    _self.getWtypeRB_FT = function () {
        var ary = new Array;
        ary.push("FT_RMX");
        ary.push("FT_RE");
        ary.push("FT_ROU");
        ary.push("FT_ROUH");
        ary.push("FT_ROUC");
        ary.push("FT_RM");
        ary.push("FT_REO");
        ary.push("FT_RWM");
        ary.push("FT_ROT");
        ary.push("FT_HRE");
        ary.push("FT_HROU");
        ary.push("FT_HRUH");
        ary.push("FT_HRUC");
        ary.push("FT_HRM");
        ary.push("FT_HREO");
        ary.push("FT_HRWM");
        return ary
    };
    _self.getRtypeRB = function () {
        var ary = new Object;
        ary["RMX"] = new Array("RMH", "RMC", "RMN");
        ary["RE"] = new Array("REH", "REC");
        ary["ROU"] = new Array("ROUH", "ROUC");
        ary["ROUH"] = new Array("ROUHO", "ROUHU");
        ary["ROUC"] = new Array("ROUCO", "ROUCU");
        ary["RM"] = new Array("RMH", "RMC", "RMN");
        ary["REO"] = new Array("REOO", "REOE");
        ary["RWM"] = new Array("RWMH1", "RWMH2", "RWMH3", "RWMH4", "RWMH0", "RWMC1", "RWMC2", "RWMC3", "RWMC4");
        ary["ROT"] = new Array("ROTY", "ROTN");
        ary["HRE"] = new Array("HREH", "HREC");
        ary["HROU"] = new Array("HROUH", "HROUC");
        ary["HRUH"] = new Array("HRUHO", "HRUHU");
        ary["HRUC"] = new Array("HRUCO", "HRUCU");
        ary["HRM"] = new Array("HRMH", "HRMC", "HRMN");
        ary["HREO"] = new Array("HREOO", "HREOE");
        ary["HRWM"] = new Array("HRWMH1", "HRWMH2", "HRWMH3", "HRWMH4", "HRWMH0", "HRWMC1", "HRWMC2", "HRWMC3", "HRWMC4");
        return ary
    };
    _self.getWtypeFT_FT = function () {
        var ary = new Array;
        ary.push("FT_MX");
        ary.push("FT_R");
        ary.push("FT_OU");
        ary.push("FT_OUH");
        ary.push("FT_OUC");
        ary.push("FT_M");
        ary.push("FT_EO");
        ary.push("FT_WM");
        ary.push("FT_OT");
        ary.push("FT_HR");
        ary.push("FT_HOU");
        ary.push("FT_HOUH");
        ary.push("FT_HOUC");
        ary.push("FT_HM");
        ary.push("FT_HEO");
        ary.push("FT_HWM");
        return ary
    };
    _self.getRtypeFT = function () {
        var ary = new Object;
        ary["MX"] = new Array("MH", "MC", "MN");
        ary["R"] = new Array("RH", "RC");
        ary["OU"] = new Array("OUH", "OUC");
        ary["OUH"] = new Array("OUHO", "OUHU");
        ary["OUC"] = new Array("OUCO", "OUCU");
        ary["M"] = new Array("MH", "MC", "MN");
        ary["EO"] = new Array("EOO", "EOE");
        ary["WM"] = new Array("WMH1", "WMH2", "WMH3", "WMH4", "WMH0",
            "WMC1", "WMC2", "WMC3", "WMC4");
        ary["OT"] = new Array("OTY", "OTN");
        ary["HR"] = new Array("HRH", "HRC");
        ary["HOU"] = new Array("HOUH", "HOUC");
        ary["HOUH"] = new Array("HOUHO", "HOUHU");
        ary["HOUC"] = new Array("HOUCO", "HOUCU");
        ary["HM"] = new Array("HMH", "HMC", "HMN");
        ary["HEO"] = new Array("HEOO", "HEOE");
        ary["HWM"] = new Array("HWMH1", "HWMH2", "HWMH3", "HWMH4", "HWMH0", "HWMC1", "HWMC2", "HWMC3", "HWMC4");
        return ary
    };
    _self.getXmlNode = function () {
        return _xmlnode
    };
    _self.getDataComplete = function (xml, OuterOpen) {
        _self.paramHash["errorMsg"] =
            util.showConnectMsg(xml);
        if (util.alertConnectMsg(_self.paramHash["errorMsg"])) return;
        var xmdObj = new Object;
        xmlnode = util.parseXml(xml);
        _xmlnode = xmlnode;
        _self.setXML(xmlnode);
        var code = xmlnode.Node(xmlnode.Root[0], "code").innerHTML;
        var game = xmlnode.Node(xmlnode.Root[0], "game", false);
        if (code == "Its not special") {
            _self.checkHasGame(false);
            if (top.rightECID != "") parentClass.dispatchEvent("noGameCheckLive", {"eventid_ph": "", "center_tv": ""})
        } else if (code == "615") {
            var mainGame = null;
            var hasGame = false;
            var _id, gdata,
                mode;
            if (game.length > 0) {
                var gidHash = new Object;
                for (var i = 0; i < game.length; i++) {
                    var tmp = xmlnode.Node(game[i], "ms").innerHTML;
                    var gidm = xmlnode.Node(game[i], "gidm").innerHTML;
                    var ms = tmp != "" && tmp != null ? tmp.split("_")[1] : "0";
                    gdata = game[i];
                    _id = gdata.getAttribute("id");
                    mode = "FT";
                    if (gidHash[mode] == null) gidHash[mode] = new Array;
                    gidHash[mode].push(_id)
                }
                mainGame = game[0];
                top.resize_mainGame = mainGame;
                top.rightFrom = "game_more";
                var intoRB = _self.checkIntoRB(xmlnode, mainGame);
                if (intoRB) return;
                var gopen = xmlnode.Node(game[0],
                    "gopen").innerHTML;
                var Live = xmlnode.Node(game[0], "Live").innerHTML;
                scDataObj = _self.setScoreBoard(mainGame, showtype, gopen, Live, OuterOpen, LS_game);
                top.scDataObj = scDataObj;
                _self.setObj(scDataObj);
                _self.parseScoreBoard(scDataObj);
                if (getView().viewportwidth >= 1024) {
                    parentClass.dispatchEvent("parseRightScoreBoard", scDataObj);
                    parentClass.dispatchEvent("checkRightLive", {"xmlnode": xmlnode, "mainGame": mainGame});
                    parentClass.dispatchEvent("setRightLoading", {"isShow": false})
                } else if (showtype == "live") _self.checkLive(xmlnode,
                    mainGame, tv, mt); else _self.checkLive(xmlnode, mainGame, tv, mt, "game_list");
                hasGame = _self.parseData({"id": gidm, "nowMode": "FT", "gidHash": gidHash, "game": game});
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
                var eventid_ph = xmlnode.Node(xmlnode.Root[0], "eventid_phone").innerHTML;
                var center_tv = xmlnode.Node(xmlnode.Root[0],
                    "center_tv").innerHTML;
                if (getView().viewportwidth >= 1024) {
                    parentClass.dispatchEvent("parseNoGameRightScoreBoard", defObj);
                    parentClass.dispatchEvent("noGameCheckLive", {
                        "eventid_ph": eventid_ph,
                        "center_tv": center_tv,
                        "from": "game_more"
                    })
                } else _self.checkLiveProc(eventid_ph, center_tv, "", "", "", tv, mt)
            }
            _self.checkHasGame(hasGame)
        }
        parentClass.dispatchEvent("showLoading", {"isShow": false, "from": classname})
    };
    _self.parseNoGameScoreBoard = function (obj) {
        game_half = "";
        gameCount = 0;
        base_icon_list = "";
        game_H = "";
        game_A = "";
        out_count = "";
        if (get("league")) get("league").innerHTML = util_game.showTxt(obj.def_league);
        get("team_h").innerHTML = util_game.showTxt(obj.def_team_h);
        get("team_c").innerHTML = util_game.showTxt(obj.def_team_c);
        get("midfield").style.display = "none";
        var serveTeam = new Array("serve_h", "serve_c");
        for (var b = 0; b < serveTeam.length; b++) if (get(serveTeam[b]).classList.contains("on")) get(serveTeam[b]).classList.remove("on");
        if (showtype == "live") {
            get("box_sco_bs").style.display = "none";
            get("game_half").className = game_half;
            get("game_count").innerHTML = gameCount;
            get("base_icon").className = "icon_bs_base bs_NNN";
            if (base_icon_list != 0) get("base_icon").classList.add(base_icon_list);
            get("out_count").innerHTML = util_game.showTxt(out_count);
            get("sc_game_H").innerHTML = util_game.showTxt(game_H);
            get("sc_game_A").innerHTML = util_game.showTxt(game_A)
        } else get("game_time").innerHTML = util_game.showTxt(obj.def_datetime)
    };
    _self.setScoreBoard = function (mainGame, showtype, gopen, Live, OuterOpen, LS_game) {
        if (mainGame != null) {
            var league = xmlnode.Node(mainGame,
                "league").innerHTML;
            var midfield = xmlnode.Node(mainGame, "midfield").innerHTML;
            var team_h = xmlnode.Node(mainGame, "team_h").innerHTML;
            var team_c = xmlnode.Node(mainGame, "team_c").innerHTML;
            var limit_min = xmlnode.Node(mainGame, "limit_min").innerHTML;
            var part = xmlnode.Node(mainGame, "part").innerHTML;
            game_H = xmlnode.Node(mainGame, "sc_game_H").innerHTML * 1;
            game_A = xmlnode.Node(mainGame, "sc_game_A").innerHTML * 1;
            var overT_H = xmlnode.Node(mainGame, "sc_ot_H").innerHTML * 1;
            var overT_A = xmlnode.Node(mainGame, "sc_ot_A").innerHTML *
                1;
            var over_H = xmlnode.Node(mainGame, "sc_ov_H").innerHTML * 1;
            var over_A = xmlnode.Node(mainGame, "sc_ov_A").innerHTML * 1;
            out_count = xmlnode.Node(mainGame, "outCount").innerHTML * 1;
            var base_1B = xmlnode.Node(mainGame, "base_1B").innerHTML;
            var base_2B = xmlnode.Node(mainGame, "base_2B").innerHTML;
            var base_3B = xmlnode.Node(mainGame, "base_3B").innerHTML;
            var datetime = xmlnode.Node(mainGame, "datetime").innerHTML;
            var tmpDate = datetime.split(" ")[0];
            var tmpTime = datetime.split(" ")[1];
            var str_M = tmpDate.split("-")[1];
            var str_D =
                tmpDate.split("-")[2];
            var str_H = tmpTime.split(":")[0];
            var str_Min = tmpTime.split(":")[1];
            var isToday = util_game.isToday(tmpDate);
            var newDatetime = isToday ? str_H + ":" + str_Min : str_D + " / " + str_M + "<b></b>" + str_H + ":" + str_Min;
            var obj = new Object;
            obj.mainGame = mainGame;
            obj.gtype = "bs";
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
            obj.part = part;
            obj.game_H =
                game_H;
            obj.game_A = game_A;
            obj.overT_H = overT_H;
            obj.overT_A = overT_A;
            obj.over_H = over_H;
            obj.over_A = over_A;
            obj.out_count = out_count;
            obj.base_1B = base_1B;
            obj.base_2B = base_2B;
            obj.base_3B = base_3B;
            obj.limit_min = limit_min;
            obj.OuterOpen = OuterOpen;
            obj.newDatetime = newDatetime;
            return obj
        }
    };
    _self.parseScoreBoard = function (obj) {
        try {
            if (get("league")) get("league").innerHTML = obj.league == null ? util_game.showTxt(obj.def_league) : util_game.showTxt(obj.league);
            get("midfield").style.display = obj.midfield == "Y" ? "" : "none";
            var check_h =
                obj.team_h == null ? util_game.showTxt(obj.def_team_h) : util_game.showTxt(obj.team_h);
            var check_c = obj.team_c == null ? util_game.showTxt(obj.def_team_c) : util_game.showTxt(obj.team_c);
            get("team_h").innerHTML = check_h.toString().replace(team_RegExp, "");
            get("team_c").innerHTML = check_c.toString().replace(team_RegExp, "");
            if (obj.gopen != "N" && obj.showtype == "parlay") {
                if (get("game_parlay")) get("game_parlay").innerHTML = util_game.showTxt(obj.limit_min);
                if (get("showPLimit")) get("showPLimit").style.display = ""
            }
            if (obj.showtype ==
                "live") if (obj.gopen == "N" && obj.Live == "N") {
                if (obj.OuterOpen) {
                    get("box_scostate").style.display = "none";
                    get("box_sco_bs").style.display = "none";
                    get("box_sco_point").style.display = "none"
                }
            } else {
                if (obj.part != "Straight") {
                    var gameRound = obj.part.split(" ");
                    gameCount = gameRound[2].replace("st", "").replace("nd", "").replace("rd", "").replace("th", "");
                    var gameHalf = gameRound[0].toUpperCase()
                } else {
                    gameCount = 1;
                    var gameHalf = "TOP"
                }
                if (gameHalf == "TOP") {
                    game_half = "icon_bs_up";
                    get("game_half").className = "icon_bs_up"
                } else if (gameHalf ==
                    "BOTTOM") {
                    game_half = "icon_bs_down";
                    get("game_half").className = "icon_bs_down"
                }
                get("game_count").innerHTML = util_game.showTxt(gameCount);
                var sc_data = new Array("1st", "2nd", "3th", "4th", "5th", "6th", "7th", "8th", "9th");
                for (var t = 0; t < sc_data.length; t++) {
                    var _name = "sc_" + sc_data[t];
                    var sc_H = util_game.showTxt(xmlnode.Node(obj.mainGame, _name + "_H").innerHTML * 1);
                    var sc_A = util_game.showTxt(xmlnode.Node(obj.mainGame, _name + "_A").innerHTML * 1);
                    if (t < gameCount) {
                        get(_name + "_H").innerHTML = sc_H;
                        get(_name + "_A").innerHTML =
                            sc_A
                    } else {
                        get(_name + "_H").innerHTML = "";
                        get(_name + "_A").innerHTML = ""
                    }
                    if (get(_name + "_H").classList.contains("on")) get(_name + "_H").classList.remove("on");
                    if (get(_name + "_A").classList.contains("on")) get(_name + "_A").classList.remove("on");
                    if (get("sc_ov_H").classList.contains("on")) get("sc_ov_H").classList.remove("on");
                    if (get("sc_ov_A").classList.contains("on")) get("sc_ov_A").classList.remove("on")
                }
                if (gameCount < 10) {
                    get("sc_" + sc_data[gameCount - 1] + "_H").classList.add("on");
                    get("sc_" + sc_data[gameCount - 1] +
                        "_A").classList.add("on")
                } else {
                    get("sc_ov_H").classList.add("on");
                    get("sc_ov_A").classList.add("on")
                }
                get("sc_game_H").innerHTML = util_game.showTxt(obj.game_H);
                get("sc_game_A").innerHTML = util_game.showTxt(obj.game_A);
                get("sc_ov_H").innerHTML = util_game.showTxt(obj.overT_H * 1 + obj.over_H * 1);
                get("sc_ov_A").innerHTML = util_game.showTxt(obj.overT_A * 1 + obj.over_A * 1);
                get("out_count").innerHTML = util_game.showTxt(obj.out_count);
                var serveTeam = new Array("serve_h", "serve_c");
                for (var b = 0; b < serveTeam.length; b++) if (get(serveTeam[b]).classList.contains("on")) get(serveTeam[b]).classList.remove("on");
                var team = gameHalf == "BOTTOM" ? "h" : "c";
                get("serve_" + team).classList.add("on");
                get("base_icon").className = "icon_bs_base bs_NNN";
                get("base_icon").classList.add("bs_" + obj.base_1B + obj.base_2B + obj.base_3B);
                if (top.resizePage != "home") get("div_matches").style.display = ""
            } else {
                if (top.resizePage != "home") get("div_matches").style.display = "";
                get("game_time").innerHTML = util_game.showTxt(obj.newDatetime)
            }
        } catch (e) {
            console.log("parseScoreBoard_BS error", e)
        }
    };
    _self.parseScoreBoard_old = function (nowMode, mainGame, showtype,
                                          gopen, Live, OuterOpen) {
        if (mainGame != null) {
            var league = xmlnode.Node(mainGame, "league").innerHTML;
            var midfield = xmlnode.Node(mainGame, "midfield").innerHTML;
            var team_h = xmlnode.Node(mainGame, "team_h").innerHTML;
            var team_c = xmlnode.Node(mainGame, "team_c").innerHTML;
            get("league").innerHTML = league == null ? util_game.showTxt(def_league) : util_game.showTxt(league);
            get("midfield").style.display = midfield == "Y" ? "" : "none";
            get("team_h").innerHTML = team_h == null ? util_game.showTxt(def_team_h) : util_game.showTxt(team_h);
            get("team_c").innerHTML =
                team_c == null ? util_game.showTxt(def_team_c) : util_game.showTxt(team_c);
            if (gopen != "N" && top.choice_showtype == "parlay") {
                var limit_min = xmlnode.Node(mainGame, "limit_min").innerHTML;
                get("game_parlay").innerHTML = util_game.showTxt(limit_min);
                get("showPLimit").style.display = ""
            }
            if (showtype == "live") if (gopen == "N" && Live == "N") {
                if (OuterOpen) {
                    get("box_scostate").style.display = "none";
                    get("box_sco_bs").style.display = "none";
                    get("box_sco_point").style.display = "none"
                }
            } else {
                var part = xmlnode.Node(mainGame, "part").innerHTML;
                if (part != "Straight") {
                    var gameRound = part.split(" ");
                    gameCount = gameRound[2].replace("st", "").replace("nd", "").replace("rd", "").replace("th", "");
                    var gameHalf = gameRound[0].toUpperCase()
                } else {
                    gameCount = 1;
                    var gameHalf = "TOP"
                }
                if (gameHalf == "TOP") {
                    game_half = "icon_bs_up";
                    get("game_half").className = "icon_bs_up"
                } else if (gameHalf == "BOTTOM") {
                    game_half = "icon_bs_down";
                    get("game_half").className = "icon_bs_down"
                }
                get("game_count").innerHTML = util_game.showTxt(gameCount);
                var sc_data = new Array("1st", "2nd", "3th", "4th", "5th",
                    "6th", "7th", "8th", "9th");
                for (var t = 0; t < sc_data.length; t++) {
                    var _name = "sc_" + sc_data[t];
                    var sc_H = xmlnode.Node(mainGame, _name + "_H").innerHTML * 1;
                    var sc_A = xmlnode.Node(mainGame, _name + "_A").innerHTML * 1;
                    if (t < gameCount) {
                        get(_name + "_H").innerHTML = util_game.showTxt(sc_H);
                        get(_name + "_A").innerHTML = util_game.showTxt(sc_A)
                    } else {
                        get(_name + "_H").innerHTML = "";
                        get(_name + "_A").innerHTML = ""
                    }
                    if (get(_name + "_H").classList.contains("on")) get(_name + "_H").classList.remove("on");
                    if (get(_name + "_A").classList.contains("on")) get(_name +
                        "_A").classList.remove("on");
                    if (get("sc_ov_H").classList.contains("on")) get("sc_ov_H").classList.remove("on");
                    if (get("sc_ov_A").classList.contains("on")) get("sc_ov_A").classList.remove("on")
                }
                if (gameCount < 10) {
                    get("sc_" + sc_data[gameCount - 1] + "_H").classList.add("on");
                    get("sc_" + sc_data[gameCount - 1] + "_A").classList.add("on")
                } else {
                    get("sc_ov_H").classList.add("on");
                    get("sc_ov_A").classList.add("on")
                }
                game_H = xmlnode.Node(mainGame, "sc_game_H").innerHTML * 1;
                game_A = xmlnode.Node(mainGame, "sc_game_A").innerHTML *
                    1;
                get("sc_game_H").innerHTML = util_game.showTxt(game_H);
                get("sc_game_A").innerHTML = util_game.showTxt(game_A);
                var overT_H = util_game.showTxt(xmlnode.Node(mainGame, "sc_ot_H").innerHTML * 1);
                var overT_A = util_game.showTxt(xmlnode.Node(mainGame, "sc_ot_A").innerHTML * 1);
                var over_H = util_game.showTxt(xmlnode.Node(mainGame, "sc_ov_H").innerHTML * 1);
                var over_A = util_game.showTxt(xmlnode.Node(mainGame, "sc_ov_A").innerHTML * 1);
                get("sc_ov_H").innerHTML = overT_H + over_H;
                get("sc_ov_A").innerHTML = overT_A + over_A;
                out_count = xmlnode.Node(mainGame,
                    "outCount").innerHTML * 1;
                get("out_count").innerHTML = util_game.showTxt(out_count);
                var serveTeam = new Array("serve_h", "serve_c");
                for (var b = 0; b < serveTeam.length; b++) if (get(serveTeam[b]).classList.contains("on")) get(serveTeam[b]).classList.remove("on");
                var team = gameHalf == "BOTTOM" ? "h" : "c";
                get("serve_" + team).classList.add("on");
                var base_1B = xmlnode.Node(mainGame, "base_1B").innerHTML;
                var base_2B = xmlnode.Node(mainGame, "base_2B").innerHTML;
                var base_3B = xmlnode.Node(mainGame, "base_3B").innerHTML;
                get("base_icon").className =
                    "icon_bs_base bs_NNN";
                base_icon_list = "bs_" + base_1B + base_2B + base_3B;
                get("base_icon").classList.add("bs_" + base_1B + base_2B + base_3B)
            } else {
                var datetime = xmlnode.Node(mainGame, "datetime").innerHTML;
                var tmpDate = datetime.split(" ")[0];
                var tmpTime = datetime.split(" ")[1];
                var str_M = tmpDate.split("-")[1];
                var str_D = tmpDate.split("-")[2];
                var str_H = tmpTime.split(":")[0];
                var str_Min = tmpTime.split(":")[1];
                var isToday = util_game.isToday(tmpDate);
                var newDatetime = isToday ? str_H + ":" + str_Min : str_D + " / " + str_M + "<b></b>" + str_H +
                    ":" + str_Min;
                get("game_time").innerHTML = util_game.showTxt(newDatetime)
            }
        }
    };

    function get(_id) {
        if (hasRightPanel) _id = "R_" + _id;
        return dom.getElementById(_id)
    }

    _self.setHasRightPanel = function () {
        hasRightPanel = true
    };
    _self.new_eval = function (str) {
        var fn = Function;
        return (new fn("return " + str))()
    }
};