function today_wagers(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util;
    var ratioForm;
    var LS_code;
    var _mc = new Object;
    var tag = "\u2022";
    var xmlnode;
    var config_set;
    var timerHash;
    var gtype_array = new Array("ALL", "FT", "BK", "TN", "VB", "BM", "TT", "BS", "SK", "OP", "FS");
    var _amout_gold = 0;
    var _nowPage = 1;
    var _pageCount = 10;
    var danAry_normal = new Array;
    var danAry_parlay = new Array;
    var bhold_normal = new Array;
    var bhold_parlay = new Array;
    var wid_ary =
        new Array;
    var gidfl_ary = new Array;
    var tid_ary = new Array;
    var fantasyInfoObj;
    var fantasyInfoIconObj;
    var util_game = new win.Util_game(win, dom);
    var classname = "today_wagers";
    var myhash = {};
    var nowTS = 0;
    var lastTS = 0;
    var twGtype = "ALL";
    var clickMore = false;
    var clickMore_height = 0;
    _self.init = function () {
        _mc["allsports"] = document.getElementById("allsports");
        _mc["amout_gold"] = dom.getElementById("amout_gold");
        _mc["total_accounts"] = document.getElementById("total_accounts");
        _mc["backtop"] = dom.getElementById("backtop");
        _mc["tool_backtop"] = dom.getElementById("tool_backtop");
        _mc["noTodayWagers"] = dom.getElementById("noTodayWagers");
        _mc["title_creditlogs"] = dom.getElementById("title_creditlogs");
        _mc["body_show"] = dom.getElementById("body_show");
        _mc["div_show"] = dom.getElementById("div_show");
        util.addEvent(_mc["title_creditlogs"], "click", _self.chgPage, {"page": "credit_logs"});
        util.addEvent(dom.getElementById("title_history"), "click", _self.chgPage, {"page": "history_data"});
        util.addEvent(_mc["backtop"], "click", _self.backTop);
        if (top.mobile != "Y") {
            _mc["pc_gtype_sel_div"] = dom.getElementById("pc_gtype_sel_div");
            util.addEvent(_mc["pc_gtype_sel_div"], "click", _self.initGtypeSelect)
        } else {
            _mc["gtype_sel"] = dom.getElementById("gtype_sel");
            util.addEvent(_mc["gtype_sel"], "blur", _self.selectBlur);
            util.addEvent(_mc["gtype_sel"], "change", _self.chgGtype)
        }
        util.addEvent(_mc["allsports"], "click", _self.showViewMore);
        util.addEvent(dom.getElementById("backpage"), "click", _self.toBack);
        _self.clearTimer();
        _self.createTimer();
        parentClass.dispatchEvent("setBottomon",
            {});
        _self.loadTodayWager();
        if (top.mobile == "N") util.addEvent(_mc["body_show"], "scroll", _self.roll, _self.getNowPage());
        win.addEventListener("orientationchange", _self.orientationChange);
        util.selectresizeblur(_self.orientationChange)
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS_code = parentClass.getThis("LS_code");
        config_set = parentClass.getThis("config_set");
        LS = parentClass.getThis("LS");
        timerHash = parentClass.getThis("timerHash")
    };
    _self.getThis =
        function (varible) {
            if (!myhash[varible]) {
                var msg = "no myhash[" + varible + "]";
                util.writeLog(classname, msg)
            }
            return myhash[varible]
        };
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
    _self.chgPage = function (e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.initGtypeSelect = function (e, param) {
        if (_mc["pc_gtype_sel_div"].classList.contains("on")) util.removeClass(_mc["pc_gtype_sel_div"],
            "on"); else {
            util.addClass(_mc["pc_gtype_sel_div"], "on");
            util.pcDropdowns("pc_gtype_sel_div", "pc_gtype_sel_ul")
        }
        var gtypeTxt = dom.getElementById("gtypeTxt").innerHTML;
        for (var i = 0; i < gtype_array.length; i++) {
            var gtypeObj = dom.getElementById(gtype_array[i]);
            util.removeClass(gtypeObj, "on");
            if (gtypeTxt == gtypeObj.innerHTML) util.addClass(gtypeObj, "on");
            util.addEvent(gtypeObj, "click", _self.chgGtype, {"id": gtype_array[i]})
        }
    };
    _self.selectBlur = function () {
        parentClass.dispatchEvent("scrollsetTop")
    };
    _self.toBack = function () {
        parentClass.dispatchEvent("backPage",
            {})
    };
    _self.chgGtype = function (e, param) {
        if (top.mobile != "Y") twGtype = param.id; else twGtype = _mc["gtype_sel"].value;
        dom.getElementById("gtypeTxt").innerHTML = e.target.innerHTML;
        _self.chgGtypeLoading(true);
        _self.loadTodayWager({"action": "chgGtype"})
    };
    _self.backTop = function (e, param) {
        _mc["body_show"].scrollTop = 0
    };
    _self.showViewMore = function () {
        clickMore = true;
        clickMore_height = _mc["body_show"].scrollTop;
        _nowPage++;
        _self.doParseTodayWagers()
    };
    _self.langx2LS = function (langx) {
        var lang_str = "";
        switch (langx) {
            case "zh-cn":
                lang_str =
                    "g";
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
    };
    _self.createTimer = function () {
        var _name = "todayTimer";
        if (timerHash[_name] != null) return;
        timerHash[_name] = new Timer(config_set.get("CONFIG_TODAY_WAGERS"));
        timerHash[_name].setParentclass(_self);
        timerHash[_name].init();
        timerHash[_name].addEventListener("TimerEvent.TIMER", _self.timerRun);
        timerHash[_name].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish);
        timerHash[_name].startTimer()
    };
    _self.clearTimer =
        function () {
            if (timerHash != null) {
                var _name = "todayTimer";
                if (timerHash[_name] != null) {
                    timerHash[_name].clearObj();
                    timerHash[_name].is_clear = true;
                    timerHash[_name] = null
                }
            }
            return true
        };
    _self.timerRun = function (count) {
        _self.loadTodayWager()
    };
    _self.timerFinish = function (count) {
    };
    _self.loadTodayWager = function (param) {
        nowTS = util.getTimestamp();
        lastTS = param && param.action == "chgGtype" ? nowTS : top["lastClickTS"];
        if (top["wagersSecond"] != 0 && top["wagers_oldTS"] != 0 && twGtype == top.wagerGtype) {
            var diff_s = Math.abs(nowTS - top["wagers_oldTS"]);
            if (diff_s < top["wagersSecond"] * 1E3) {
                xmlnode = top["wagers_xmlnode"];
                if (_mc["title_creditlogs"]) {
                    pay_type = top["userData"].pay_type;
                    if (pay_type != "1" && _mc["title_creditlogs"].parentNode) _mc["title_creditlogs"].parentNode.removeChild(_mc["title_creditlogs"]); else _mc["title_creditlogs"].style = ""
                }
                _self.doParseTodayWagers();
                return
            }
        }
        top.wagerGtype = twGtype;
        var urlParams = "";
        urlParams += "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&LS=" + _self.langx2LS(langx);
        urlParams += "&selGtype=" + twGtype;
        urlParams += "&chk_cw=N";
        urlParams += "&ts=" + lastTS;
        urlParams = "p=get_today_wagers&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.loadTodayWagerComplete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.onError = function () {
    };
    _self.loadTodayWagerComplete = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        xmlnode = util.parseXml(xml);
        top["wagers_xmlnode"] = xmlnode;
        var xmdObj =
            new Object;
        top["fantasyHash"] = new Object;
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
        var pay_type = xmlnode.Node(xmlnode.Root[0], "pay_type").innerHTML;
        var tmpTS = xmlnode.Node(xmlnode.Root[0], "ts").innerHTML;
        if (!util_game.checkTS(lastTS, tmpTS, "get_today_wagers")) {
            console.log("[today_wagers][tmpTS]===>", tmpTS, "[lastTS]=====>", lastTS, "ts\u932f\u8aa4!!!!!!\u4e0d\u7e7c\u7e8c\u57f7\u884c");
            return
        }
        top["wagers_oldTS"] = util.getTimestamp();
        if (_mc["title_creditlogs"]) if (pay_type != 1 && _mc["title_creditlogs"].parentNode) _mc["title_creditlogs"].parentNode.removeChild(_mc["title_creditlogs"]);
        else _mc["title_creditlogs"].style = "";
        var wagers_count = xmlnode.Node(xmlnode.Root[0], "count").innerHTML;
        var nowPage = _self.getNowPage();
        if (xmdObj["code"].innerHTML == "todaywagers") {
            var bodyPage = parentClass.lastBodyPage();
            if (_mc["div_show"] == null || nowPage != "today_wagers" && bodyPage != "today_wagers") return;
            _mc["div_show"].innerHTML = "";
            _amout_gold = 0;
            _self.doParseTodayWagers()
        }
        parentClass.dispatchEvent("showLoading", {"isShow": false});
        parentClass.dispatchEvent("setRightLoading", false);
        util.addEvent(_mc["body_show"],
            "scroll", _self.roll, _self.getNowPage())
    };
    _self.doParseTodayWagers = function () {
        var ratioForm = new win.ratioForm_Single_rule;
        var k = 1;
        var xmdObj = new Object;
        gidfl_ary = new Array;
        tid_ary = new Array;
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
        if (xmdObj["code"].innerHTML == "todaywagers") {
            xmdObj["amout_gold"] = xmlnode.Node(xmlnode.Root[0], "amout_gold").innerHTML;
            xmdObj["wagers"] = xmlnode.Node(xmlnode.Root[0], "wagers", false);
            var tmp_screen = "";
            var from = 0;
            var limit = _nowPage * _pageCount;
            var totalLength = xmdObj["wagers"].length;
            if (totalLength >= 1) {
                _self.showNoTodayWagers(false);
                if (limit > totalLength) limit = totalLength;
                _amout_gold = xmdObj["amout_gold"];
                for (var i = from; i < limit; i++) {
                    var gidfl = 0;
                    var gid = 0;
                    var team_id_h = "";
                    var team_id_c = "";
                    xmdObj["wagers_sub"] = xmlnode.Node(xmdObj["wagers"][i], "wagers_sub", false);
                    w_id = xmlnode.Node(xmdObj["wagers"][i], "w_id").innerHTML;
                    t_id = _self.replaceOU(util.showTxt(w_id));
                    addtime = xmlnode.Node(xmdObj["wagers"][i], "addtime").innerHTML;
                    oddf_type = xmlnode.Node(xmdObj["wagers"][i], "oddf_type").innerHTML;
                    gtype = xmlnode.Node(xmdObj["wagers"][i], "gtype").innerHTML;
                    bet_gtype = xmlnode.Node(xmdObj["wagers"][i], "bet_gtype").innerHTML;
                    gidfl = xmlnode.Node(xmdObj["wagers"][i], "gidfl").innerHTML;
                    gid = xmlnode.Node(xmdObj["wagers"][i], "gid").innerHTML;
                    w_ms = xmlnode.Node(xmdObj["wagers"][i], "w_ms").innerHTML;
                    wtype = xmlnode.Node(xmdObj["wagers"][i], "wtype").innerHTML;
                    bet_wtype = xmlnode.Node(xmdObj["wagers"][i], "bet_wtype").innerHTML;
                    gold = xmlnode.Node(xmdObj["wagers"][i], "gold").innerHTML;
                    win_gold = xmlnode.Node(xmdObj["wagers"][i],
                        "win_gold").innerHTML;
                    win_gold = util.showTxt(win_gold);
                    gold = util.showTxt(gold);
                    main_ball_act_ret = xmlnode.Node(xmdObj["wagers"][i], "main_ball_act_ret").innerHTML;
                    main_ball_act_class = xmlnode.Node(xmdObj["wagers"][i], "main_ball_act_class").innerHTML;
                    cancel_line = xmlnode.Node(xmdObj["wagers"][i], "cancel_line").innerHTML;
                    delaysec = xmlnode.Node(xmdObj["wagers"][i], "delaysec").innerHTML;
                    isballact = xmlnode.Node(xmdObj["wagers"][i], "ballact").innerHTML;
                    var div_model = "";
                    if (xmdObj["wagers_sub"].length >= 1) {
                        var p_display =
                            dom.getElementById("p_display").innerHTML;
                        var p_title_model = dom.getElementById("p_title_model").innerHTML;
                        p_title_model = p_title_model.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>", "");
                        p_title_model = p_title_model.replace(/\*NUM\*/g, xmdObj["wagers_sub"].length);
                        ball_act_ret = xmlnode.Node(xmdObj["wagers"][i], "ball_act_ret").innerHTML;
                        ball_act_class = xmlnode.Node(xmdObj["wagers"][i], "ball_act_class").innerHTML;
                        dg = xmlnode.Node(xmdObj["wagers"][i], "dg").innerHTML;
                        dg_str = xmlnode.Node(xmdObj["wagers"][i],
                            "dg_str").innerHTML;
                        p_display = p_display.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>", "");
                        p_display = p_display.replace(/\*TID\*/g, t_id);
                        p_display = p_display.replace(/\*P_TITLE\*/g, p_title_model);
                        var p_tmp_screen = "";
                        issubdelaysec = false;
                        for (var j = 0; j < xmdObj["wagers_sub"].length; j++) {
                            league = xmlnode.Node(xmdObj["wagers_sub"][j], "league").innerHTML;
                            team_h_show = xmlnode.Node(xmdObj["wagers_sub"][j], "team_h_show").innerHTML;
                            team_c_show = xmlnode.Node(xmdObj["wagers_sub"][j], "team_c_show").innerHTML;
                            team_h_ratio = xmlnode.Node(xmdObj["wagers_sub"][j], "team_h_ratio").innerHTML;
                            team_c_ratio = xmlnode.Node(xmdObj["wagers_sub"][j], "team_c_ratio").innerHTML;
                            ratio = xmlnode.Node(xmdObj["wagers_sub"][j], "ratio").innerHTML;
                            org_score = xmlnode.Node(xmdObj["wagers_sub"][j], "org_score").innerHTML;
                            score = xmlnode.Node(xmdObj["wagers_sub"][j], "score").innerHTML;
                            result = xmlnode.Node(xmdObj["wagers_sub"][j], "result").innerHTML;
                            pname = xmlnode.Node(xmdObj["wagers_sub"][j], "pname").innerHTML;
                            ioratio = xmlnode.Node(xmdObj["wagers_sub"][j],
                                "ioratio").innerHTML;
                            sub_delaysec = xmlnode.Node(xmdObj["wagers_sub"][j], "sub_delaysec").innerHTML;
                            p_ball_act_class = xmlnode.Node(xmdObj["wagers_sub"][j], "p_ball_act_class").innerHTML;
                            date = xmlnode.Node(xmdObj["wagers_sub"][j], "date").innerHTML;
                            wtype_sub = xmlnode.Node(xmdObj["wagers_sub"][j], "wtype_sub").innerHTML;
                            p_wtype = xmlnode.Node(xmdObj["wagers_sub"][j], "p_wtype").innerHTML;
                            ms_sub = xmlnode.Node(xmdObj["wagers_sub"][j], "ms_sub").innerHTML;
                            p_strong = xmlnode.Node(xmdObj["wagers_sub"][j], "strong").innerHTML;
                            if (bet_gtype != "FT" && sub_delaysec > 0) issubdelaysec = true;
                            if (date != "") {
                                var data_str = date.split("-");
                                data_st = data_str[1].trim() + "-" + data_str[0].trim();
                                tmp_league = data_st == "" ? league : data_st + " " + league
                            } else tmp_league = league;
                            var p_details_model = dom.getElementById("p_details_model").innerHTML;
                            p_details_model = p_details_model.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>", "");
                            p_details_model = p_details_model.replace(/\*TID\*/g, util.showTxt(t_id));
                            p_details_model = p_details_model.replace(/\*GTYPE\*/g,
                                util.showTxt(gtype));
                            p_details_model = p_details_model.replace(/\*W_MS\*/g, util.showTxt(ms_sub));
                            p_details_model = p_details_model.replace(/\*WTYPE\*/g, util.showTxt(wtype_sub));
                            p_details_model = p_details_model.replace(/\*LEAGUE\*/g, util.showTxt(tmp_league));
                            p_details_model = p_details_model.replace(/\*TEAM_H_SHOW\*/g, util.showTxt(team_h_show));
                            p_details_model = p_details_model.replace(/\*TEAM_C_SHOW\*/g, util.showTxt(team_c_show));
                            if (team_h_show == "" && team_c_show == "") p_details_model = p_details_model.replace(/\*TEAM_ACT\*/g,
                                "display:none;"); else p_details_model = p_details_model.replace(/\*TEAM_ACT\*/g, "display:;");
                            var team_ratio = "";
                            if (util_game.checkWtypeIsR(p_wtype)) {
                                var color = "word_yellow";
                                if (p_wtype == "W3") color = "word_red";
                                p_details_model = p_details_model.replace(/\*TEAM_H_RATIO\*/g, "");
                                p_details_model = p_details_model.replace(/\*TEAM_C_RATIO\*/g, "");
                                p_details_model = p_details_model.replace(/\*CHOICE_CON_CLASS\*/g, color);
                                team_ratio = team_h_ratio != "" ? team_h_ratio : team_c_ratio;
                                if (team_ratio != 0) if (p_strong == "Y") team_ratio =
                                    "-" + team_ratio; else team_ratio = "+" + team_ratio
                            } else {
                                p_details_model = p_details_model.replace(/\*TEAM_H_RATIO\*/g, util.showTxt(team_h_ratio));
                                p_details_model = p_details_model.replace(/\*TEAM_C_RATIO\*/g, util.showTxt(team_c_ratio));
                                p_details_model = p_details_model.replace(/\*CHOICE_CON_CLASS\*/g, "word_red")
                            }
                            p_details_model = p_details_model.replace(/\*ORG_SCORE\*/g, util.showTxt(org_score));
                            p_details_model = p_details_model.replace(/\*SCORE\*/g, util.showTxt(score));
                            if (p_ball_act_class == "cancel") p_details_model =
                                p_details_model.replace(/\*ANNOUCEMENT\*/g, "word_delline");
                            if (util.checkWtypeIsOU(p_wtype)) {
                                var choice_blank = result.indexOf(" ");
                                var choice_str = result.substr(0, choice_blank);
                                var choice_con = result.substr(choice_blank, result.length - 1);
                                p_details_model = p_details_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(choice_str));
                                p_details_model = p_details_model.replace(/\*CHOICE_CON\*/g, util.showTxt(choice_con))
                            } else if (p_wtype == "W3") {
                                var choiceAry = result.split(" ");
                                var choice_con = choiceAry[choiceAry.length - 1];
                                var choice_str = result.split(choice_con)[0];
                                p_details_model = p_details_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(choice_str));
                                p_details_model = p_details_model.replace(/\*CHOICE_CON\*/g, util.showTxt(choice_con))
                            } else {
                                p_details_model = p_details_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(result));
                                p_details_model = p_details_model.replace(/\*CHOICE_CON\*/g, team_ratio)
                            }
                            p_details_model = p_details_model.replace(/\*PNAME\*/g, util.showTxt(pname));
                            p_details_model = p_details_model.replace(/\*IORATIO\*/g, util.showTxt(ratioForm.chgForm_Single_ratio(ioratio,
                                p_wtype)));
                            p_tmp_screen += p_details_model
                        }
                        p_display = p_display.replace(/\*P_CONTENT\*/g, util.showTxt(p_tmp_screen));
                        var p_bottom_model = dom.getElementById("p_bottom_model").innerHTML;
                        p_bottom_model = p_bottom_model.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>", "");
                        p_bottom_model = p_bottom_model.replace(/\*TID\*/g, util.showTxt(t_id));
                        p_bottom_model = p_bottom_model.replace(/\*W_ID\*/g, util.showTxt(w_id));
                        p_bottom_model = p_bottom_model.replace(/\*ADDTIME\*/g, util.showTxt(addtime));
                        if (bet_wtype == "P") p_bottom_model = p_bottom_model.replace(/\*ODDF_TYPE\*/g, ""); else p_bottom_model = p_bottom_model.replace(/\*ODDF_TYPE\*/g, util.showTxt(oddf_type));
                        p_display = p_display.replace(/\*P_CONTENT\*/g, cancel_line == "cancel" ? "word_delline" : "");
                        if (main_ball_act_ret == "") {
                            p_bottom_model = p_bottom_model.replace(/\*DG_CANCEL\*/g, "display:none;");
                            p_bottom_model = p_bottom_model.replace(/\*DG_STR\*/g, "");
                            if (ball_act_ret == "") {
                                p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g, "display:none;");
                                p_bottom_model =
                                    p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g, "");
                                p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_RET\*/g, "")
                            } else {
                                p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g, "display:;");
                                p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g, util.showTxt(ball_act_class));
                                p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(ball_act_ret))
                            }
                        } else {
                            if (dg == "Y" && ball_act_class != "word_yellow") {
                                p_bottom_model = p_bottom_model.replace(/\*DG_CANCEL\*/g, "display:;");
                                p_bottom_model = p_bottom_model.replace(/\*DG_STR\*/g,
                                    util.showTxt(dg_str));
                                p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g, "display:;");
                                p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g, "word_red")
                            } else {
                                p_bottom_model = p_bottom_model.replace(/\*DG_CANCEL\*/g, "display:none;");
                                p_bottom_model = p_bottom_model.replace(/\*DG_STR\*/g, "");
                                p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g, "display:;");
                                p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g, util.showTxt(main_ball_act_class))
                            }
                            p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_RET\*/g,
                                util.showTxt(main_ball_act_ret))
                        }
                        if (ball_act_class == "word_yellow" && issubdelaysec) {
                            if (!util.in_array(t_id, bhold_parlay)) bhold_parlay.push(t_id)
                        } else if (ball_act_class == "word_yellow") if (!util.in_array(t_id, danAry_parlay)) danAry_parlay.push(t_id);
                        if (!isNaN(win_gold * 1)) p_bottom_model = p_bottom_model.replace(/\*WIN_GOLD\*/g, win_gold == "-" ? "0" : util.showTxt(util.trans_thousand(win_gold))); else p_bottom_model = p_bottom_model.replace(/\*WIN_GOLD\*/g, win_gold == "-" ? "0" : util.showTxt(win_gold));
                        if (!isNaN(gold * 1)) p_bottom_model =
                            p_bottom_model.replace(/\*GOLD\*/g, gold == "-" ? "0" : util.showTxt(ratioForm.formatNumber(gold, 2, true))); else p_bottom_model = p_bottom_model.replace(/\*GOLD\*/g, gold == "-" ? "0" : util.showTxt(gold));
                        p_display = p_display.replace(/\*P_BOTTOM\*/g, p_bottom_model);
                        div_model += p_display
                    } else {
                        league = xmlnode.Node(xmdObj["wagers"][i], "league").innerHTML;
                        team_h_show = xmlnode.Node(xmdObj["wagers"][i], "team_h_show").innerHTML;
                        team_c_show = xmlnode.Node(xmdObj["wagers"][i], "team_c_show").innerHTML;
                        team_h_ratio = xmlnode.Node(xmdObj["wagers"][i],
                            "team_h_ratio").innerHTML;
                        team_c_ratio = xmlnode.Node(xmdObj["wagers"][i], "team_c_ratio").innerHTML;
                        ratio = xmlnode.Node(xmdObj["wagers"][i], "ratio").innerHTML;
                        org_score = xmlnode.Node(xmdObj["wagers"][i], "org_score").innerHTML;
                        score = xmlnode.Node(xmdObj["wagers"][i], "score").innerHTML;
                        result = xmlnode.Node(xmdObj["wagers"][i], "result").innerHTML;
                        strong = xmlnode.Node(xmdObj["wagers"][i], "strong").innerHTML;
                        pname = xmlnode.Node(xmdObj["wagers"][i], "pname").innerHTML;
                        ioratio = xmlnode.Node(xmdObj["wagers"][i], "ioratio").innerHTML;
                        showtype = xmlnode.Node(xmdObj["wagers"][i], "showtype").innerHTML;
                        bet_showtype = xmlnode.Node(xmdObj["wagers"][i], "bet_showtype").innerHTML;
                        dg = xmlnode.Node(xmdObj["wagers"][i], "dg").innerHTML;
                        dg_str = xmlnode.Node(xmdObj["wagers"][i], "dg_str").innerHTML;
                        ball_act_class = xmlnode.Node(xmdObj["wagers"][i], "ball_act_class").innerHTML;
                        ball_act_ret = xmlnode.Node(xmdObj["wagers"][i], "ball_act_ret").innerHTML;
                        div_model = dom.getElementById("normal_model").innerHTML;
                        div_model = div_model.replace("<XMP>", "").replace("</XMP>",
                            "").replace("<xmp>", "").replace("</xmp>", "");
                        div_model = div_model.replace(/\*TID\*/g, util.showTxt(t_id));
                        div_model = div_model.replace(/\*W_ID\*/g, util.showTxt(w_id));
                        div_model = div_model.replace(/\*GID\*/g, util.showTxt(gid));
                        if (!tid_ary[t_id] && bet_wtype != "FS" && bet_gtype == "FT") tid_ary[t_id] = {
                            "gid": gid,
                            "league": league,
                            "team_h": team_h_show,
                            "team_c": team_c_show,
                            "showtype": showtype,
                            "bet_showtype": bet_showtype
                        };
                        div_model = div_model.replace(/\*ADDTIME\*/g, util.showTxt(addtime));
                        if (gidfl != 0) {
                            team_id_h = xmlnode.Node(xmdObj["wagers"][i],
                                "team_id_h").innerHTML;
                            team_id_c = xmlnode.Node(xmdObj["wagers"][i], "team_id_c").innerHTML;
                            if (!gidfl_ary[gidfl]) {
                                gidfl_ary[gidfl] = {"team_id_h": team_id_h, "team_id_c": team_id_c, "gid": gid};
                                div_model = div_model.replace(/\*GIDFL\*/g, util.showTxt(gidfl))
                            } else {
                                var key = gidfl + "_" + k;
                                gidfl_ary[key] = {"team_id_h": team_id_h, "team_id_c": team_id_c, "gid": gid};
                                div_model = div_model.replace(/\*GIDFL\*/g, util.showTxt(key));
                                k++
                            }
                        }
                        if (bet_wtype == "P") div_model = div_model.replace(/\*ODDF_TYPE\*/g, ""); else div_model = div_model.replace(/\*ODDF_TYPE\*/g,
                            util.showTxt(oddf_type));
                        div_model = div_model.replace(/\*GTYPE\*/g, util.showTxt(gtype));
                        div_model = div_model.replace(/\*W_MS\*/g, util.showTxt(w_ms));
                        div_model = div_model.replace(/\*WTYPE\*/g, util.showTxt(wtype));
                        div_model = div_model.replace(/\*LEAGUE\*/g, util.showTxt(league));
                        div_model = div_model.replace(/\*TEAM_H_SHOW\*/g, util.showTxt(team_h_show));
                        div_model = div_model.replace(/\*TEAM_C_SHOW\*/g, util.showTxt(team_c_show));
                        if (team_h_show == "" && team_c_show == "") div_model = div_model.replace(/\*TEAM_ACT\*/g,
                            "display:none;"); else div_model = div_model.replace(/\*TEAM_ACT\*/g, "display:;");
                        var team_ratio = "";
                        if (util_game.checkWtypeIsR(bet_wtype)) {
                            var color = "word_yellow";
                            if (bet_wtype == "W3") color = "word_red";
                            div_model = div_model.replace(/\*TEAM_H_RATIO\*/g, "");
                            div_model = div_model.replace(/\*TEAM_C_RATIO\*/g, "");
                            div_model = div_model.replace(/\*CHOICE_CON_CLASS\*/g, color);
                            team_ratio = team_h_ratio != "" ? team_h_ratio : team_c_ratio;
                            if (team_ratio != 0) if (strong == "Y") team_ratio = "-" + team_ratio; else team_ratio = "+" + team_ratio
                        } else {
                            div_model =
                                div_model.replace(/\*TEAM_H_RATIO\*/g, util.showTxt(team_h_ratio));
                            div_model = div_model.replace(/\*TEAM_C_RATIO\*/g, util.showTxt(team_c_ratio));
                            div_model = div_model.replace(/\*CHOICE_CON_CLASS\*/g, "word_red")
                        }
                        div_model = div_model.replace(/\*ORG_SCORE\*/g, util.showTxt(org_score));
                        div_model = div_model.replace(/\*SCORE\*/g, util.showTxt(score));
                        div_model = div_model.replace(/\*PNAME\*/g, util.showTxt(pname));
                        div_model = div_model.replace(/\*IORATIO\*/g, ioratio < 0 ? "<font class='word_blue'>" + ratioForm.chgForm_Single_ratio(ioratio,
                            bet_wtype) + "</font>" : ratioForm.chgForm_Single_ratio(ioratio, bet_wtype));
                        if (ball_act_ret == "") {
                            div_model = div_model.replace(/\*DG_CANCEL\*/g, "display:none;");
                            div_model = div_model.replace(/\*DG_STR\*/g, "");
                            div_model = div_model.replace(/\*BALL_ACT\*/g, "display:none;");
                            div_model = div_model.replace(/\*BALL_ACT_CLASS\*/g, "");
                            div_model = div_model.replace(/\*BALL_ACT_RET\*/g, "")
                        } else if (dg == "Y" && ball_act_class != "word_yellow") {
                            div_model = div_model.replace(/\*DG_CANCEL\*/g, "display:;");
                            div_model = div_model.replace(/\*DG_STR\*/g,
                                util.showTxt(dg_str));
                            div_model = div_model.replace(/\*BALL_ACT\*/g, "display:;");
                            div_model = div_model.replace(/\*BALL_ACT_CLASS\*/g, "word_red");
                            div_model = div_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(ball_act_ret))
                        } else {
                            if (ball_act_class == "word_yellow" && isballact > "0") {
                                if (!util.in_array(t_id, danAry_normal)) danAry_normal.push(t_id)
                            } else if (ball_act_class == "word_yellow") if (!util.in_array(t_id, bhold_normal)) bhold_normal.push(t_id);
                            div_model = div_model.replace(/\*DG_CANCEL\*/g, "display:none;");
                            div_model =
                                div_model.replace(/\*DG_STR\*/g, "");
                            div_model = div_model.replace(/\*BALL_ACT\*/g, "display:;");
                            div_model = div_model.replace(/\*BALL_ACT_CLASS\*/g, util.showTxt(ball_act_class));
                            div_model = div_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(ball_act_ret))
                        }
                        if (util.checkWtypeIsOU(bet_wtype)) {
                            var choice_blank = result.indexOf(" ");
                            var choice_str = result.substr(0, choice_blank);
                            var choice_con = result.substr(choice_blank, result.length - 1);
                            div_model = div_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(choice_str));
                            div_model =
                                div_model.replace(/\*CHOICE_CON\*/g, util.showTxt(choice_con))
                        } else if (bet_wtype == "W3") {
                            var choiceAry = result.split(" ");
                            var choice_con = choiceAry[choiceAry.length - 1];
                            var choice_str = result.split(choice_con)[0];
                            div_model = div_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(choice_str));
                            div_model = div_model.replace(/\*CHOICE_CON\*/g, util.showTxt(choice_con))
                        } else {
                            div_model = div_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(result));
                            div_model = div_model.replace(/\*CHOICE_CON\*/g, team_ratio)
                        }
                        if (!isNaN(win_gold *
                            1)) div_model = div_model.replace(/\*WIN_GOLD\*/g, win_gold == "-" ? "0" : util.showTxt(util.trans_thousand(win_gold))); else div_model = div_model.replace(/\*WIN_GOLD\*/g, win_gold == "-" ? "0" : util.showTxt(win_gold));
                        if (!isNaN(gold * 1)) div_model = div_model.replace(/\*GOLD\*/g, gold == "-" ? "0" : util.showTxt(ratioForm.formatNumber(gold, 2, true))); else div_model = div_model.replace(/\*GOLD\*/g, gold == "-" ? "0" : util.showTxt(gold))
                    }
                    var cancel_apn = xmlnode.Node(xmdObj["wagers"][i], "cancel_apn").innerHTML;
                    if (cancel_apn != "") {
                        if (!util.in_array(t_id,
                            wid_ary)) wid_ary.push(t_id + "[can_apn]" + cancel_apn);
                        div_model = div_model.replace(/\*DIS_APN\*/g, "")
                    } else div_model = div_model.replace(/\*DIS_APN\*/g, "display:none;");
                    tmp_screen += div_model
                }
                _mc["amout_gold"].innerHTML = util.showTxt(_amout_gold);
                _mc["div_show"].innerHTML = tmp_screen;
                var totalPage = Math.ceil(totalLength / _pageCount);
                if (_nowPage >= totalPage) _mc["allsports"].style.display = "none"
            } else _self.showNoTodayWagers(true);
            _self.chgGtypeLoading(false);
            for (var i = 0; i < wid_ary.length; i++) {
                var allmsg = wid_ary[i].split("[can_apn]");
                _mc["cancel_reason_" + allmsg[0]] = dom.getElementById("cancel_reason_" + allmsg[0]);
                util.addEvent(_mc["cancel_reason_" + allmsg[0]], "click", _self.icon, {
                    "tid": allmsg[0],
                    "msg": allmsg[1]
                })
            }
            for (var t_id in tid_ary) {
                foreObj = dom.getElementById("btn_forecast_" + t_id);
                if (top.forecast_sw && top["userData"].enable != "S" && top.clean_data_sw != "Y") {
                    foreObj.style.display = "";
                    util.addEvent(foreObj, "click", _self.showForecast, tid_ary[t_id])
                } else {
                    foreObj.style.display = "none";
                    util.removeEvent(foreObj, "click")
                }
            }
            for (var id in gidfl_ary) {
                fantasyInfoObj =
                    dom.getElementById("div_icon_info_" + id);
                fantasyInfoIconObj = dom.getElementById("div_icon_info_i_" + id);
                fantasyInfoObj.style.display = "";
                util.addEvent(fantasyInfoIconObj, "click", _self.goToGetFantasyInfo, {
                    "gidfl": id,
                    "gid": gidfl_ary[id]["gid"],
                    "team_id_h": gidfl_ary[id]["team_id_h"],
                    "team_id_c": gidfl_ary[id]["team_id_c"],
                    "mode": "todaywagers"
                })
            }
            if (danAry_normal.length > 0 || danAry_parlay.length > 0) _self.createDangerTimer(); else _self.clearDangerTimer();
            if (bhold_normal.length > 0 || bhold_parlay.length > 0) _self.createbetholdTimer();
            else _self.clearbetholdTimer()
        }
        _self.orientationChange();
        parentClass.dispatchEvent("showLoading", {"isShow": false})
    };
    _self.goToGetFantasyInfo = function (e, data) {
        parentClass.dispatchEvent("getFantasyInfoProc", data)
    };
    _self.icon = function (e, param) {
        var par = new Object;
        par["_id"] = "info_pop";
        par["title"] = "<li>" + LS_code.get("todat_wagers_magtitle") + "</li>";
        par["msg"] = LS.get("ticket_id_str") + param.tid + "<br>" + param.msg;
        parentClass.dispatchEvent("showAlertMsg", par)
    };
    _self.createDangerTimer = function () {
        _self.clearDangerTimer();
        timerHash["dg"] = new Timer(config_set.get("CONFIG_DANGEROUS"));
        timerHash["dg"].setParentclass(_self);
        timerHash["dg"].init();
        timerHash["dg"].addEventListener("TimerEvent.TIMER", _self.dgTimerRun);
        timerHash["dg"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.dgTimerFinish);
        timerHash["dg"].startTimer()
    };
    _self.clearDangerTimer = function () {
        if (timerHash["dg"] != null) {
            timerHash["dg"].clearObj();
            timerHash["dg"] = null
        }
        return true
    };
    _self.dgTimerRun = function (count) {
        _self.checkDanger()
    };
    _self.dgTimerFinish = function () {
    };
    _self.checkDanger = function () {
        if (danAry_normal.length == 0 && danAry_parlay.length == 0) {
            _self.clearDangerTimer();
            return
        }
        var urlParams = "";
        urlParams += "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&type=xml";
        urlParams += "&from=todaywagers";
        urlParams += "&tid=" + danAry_normal.join(",");
        urlParams += "&p3_tid=" + danAry_parlay.join(",");
        urlParams = "p=get_dangerous&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.checkDangerFinish);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.checkDangerFinish = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        var xmlnode = util.parseXml(xml);
        var tickets = xmlnode.Node(xmlnode.Root[0], "tickets");
        var ticket = xmlnode.Node(tickets, "ticket", false);
        for (var i = 0; i < ticket.length; i++) {
            var obj = ticket[i];
            var tid = obj.getAttribute("id");
            var _status = util.showTxt(obj.innerHTML);
            var ret = _self.chgDangerStatus(tid, _status);
            if (!ret) {
                _self.loadTodayWager();
                break
            }
        }
    };
    _self.chgDangerStatus =
        function (tid, _status) {
            var bg_sty = "";
            var msg_sty = "";
            var msg = "";
            var normalPos = danAry_normal.indexOf(tid);
            var parlayPos = danAry_parlay.indexOf(tid);
            switch (_status) {
                case "A":
                    top["wagers_oldTS"] = 0;
                    msg_sty = "word_green";
                    msg = "";
                    var msgObj = dom.getElementById("dg_" + tid);
                    util.setObjectClass(msgObj, msg_sty);
                    msgObj.innerHTML = LS.get("today_wager_A");
                    if (danAry_normal.indexOf(tid) != -1) danAry_normal.splice(normalPos, 1);
                    if (danAry_parlay.indexOf(tid) != -1) danAry_parlay.splice(parlayPos, 1);
                    break;
                case "R":
                    top["wagers_oldTS"] =
                        0;
                    _self.clearDangerTimer();
                    _self.clearTimer();
                    _self.createTimer();
                    if (danAry_normal.indexOf(tid) != -1) danAry_normal.splice(normalPos, 1);
                    if (danAry_parlay.indexOf(tid) != -1) danAry_parlay.splice(parlayPos, 1);
                    return false;
                    break;
                case "N":
                default:
                    break
            }
            return true
        };
    _self.showNoTodayWagers = function (isOk) {
        if (isOk) {
            _mc["noTodayWagers"].style.display = "";
            _mc["allsports"].style.display = "none";
            _mc["total_accounts"].style.display = "none";
            _mc["tool_backtop"].style.display = "none"
        } else {
            _mc["noTodayWagers"].style.display =
                "none";
            _mc["allsports"].style.display = "";
            _mc["total_accounts"].style.display = ""
        }
    };
    _self.replaceOU = function (txt) {
        txt = txt.replace(/OU/g, "");
        txt = txt.replace(/DT/g, "");
        txt = txt.replace(/P3/g, "");
        return txt
    };
    _self.roll = function (e, target) {
        if (clickMore) {
            _mc["body_show"].scrollTop = clickMore_height;
            clickMore = false
        }
        var body_h = _mc["body_show"].scrollHeight;
        var view_h = _mc["body_show"].clientHeight;
        var now_h = _mc["body_show"].scrollTop;
        if (target == "today_wagers" && body_h - view_h >= 10) {
            _mc["tool_backtop"].style.display =
                "";
            if (body_h - (view_h + now_h) <= 80) parentClass.dispatchEvent("rollBottom", {
                "page": "today_wagers",
                "isBottom": true
            }); else parentClass.dispatchEvent("rollBottom", {"page": "today_wagers", "isBottom": false})
        }
    };
    _self.getNowPage = function () {
        var tmpPage = "";
        if (win._history.length != 0) tmpPage = win._history[win._history.length - 1].page;
        return tmpPage
    };
    _self.orientationChange = function () {
        var orientation = win.Math.abs(win.orientation);
        if (orientation == 90 || orientation == 0) _self.orientation()
    };
    _self.orientation = function () {
        var body_h =
            _mc["body_show"].scrollHeight;
        var view_h = _mc["body_show"].clientHeight;
        _mc["tool_backtop"].style.display = body_h - view_h >= 10 ? "" : "none"
    };
    _self.exitEvent = function () {
        win.removeEventListener("orientationchange", _self.orientationChange);
        win.removeEventListener("resize", _self.orientationChange);
        return true
    };
    _self.orientationblur = function () {
        if (document.activeElement.tagName == "SELECT") dom.activeElement.blur()
    };
    _self.chgGtypeLoading = function (isShow) {
        if (isShow) {
            _mc["tool_backtop"].style.display = "none";
            _mc["noTodayWagers"].style.display =
                "none";
            _mc["allsports"].style.display = "none";
            _mc["div_show"].style.display = "none";
            dom.getElementById("info_box").style.display = "none";
            dom.getElementById("load").style.display = ""
        } else {
            _mc["div_show"].style.display = "";
            dom.getElementById("info_box").style.display = "";
            dom.getElementById("load").style.display = "none"
        }
    };
    _self.createbetholdTimer = function () {
        _self.clearbetholdTimer();
        echo("bethold createTimer");
        timerHash["bhold"] = new Timer(config_set.get("CONFIG_BETHOLD"));
        timerHash["bhold"].setParentclass(_self);
        timerHash["bhold"].init();
        timerHash["bhold"].addEventListener("TimerEvent.TIMER", _self.betholdTimerRun);
        timerHash["bhold"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.betholdTimerFinish);
        timerHash["bhold"].startTimer()
    };
    _self.clearbetholdTimer = function () {
        if (timerHash["bhold"] != null) {
            timerHash["bhold"].clearObj();
            timerHash["bhold"] = null
        }
        return true
    };
    _self.betholdTimerRun = function (count) {
        _self.checkbethold()
    };
    _self.betholdTimerFinish = function () {
    };
    _self.checkbethold = function () {
        if (bhold_normal.length ==
            0 && bhold_parlay.length == 0) {
            _self.clearbetholdTimer();
            return
        }
        var urlParams = "";
        urlParams += "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&type=xml";
        urlParams += "&from=todaywagers";
        urlParams += "&tid=" + bhold_normal.join(",");
        urlParams += "&p3_tid=" + bhold_parlay.join(",");
        urlParams = "p=get_bethold&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.checkbetholdFinish);
        getHTML.loadURL(top.m2_url, "POST",
            urlParams)
    };
    _self.checkbetholdFinish = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        var xmlnode = util.parseXml(xml);
        var tickets = xmlnode.Node(xmlnode.Root[0], "tickets");
        var ticket = xmlnode.Node(tickets, "ticket", false);
        for (var i = 0; i < ticket.length; i++) {
            var obj = ticket[i];
            var tid = obj.getAttribute("id");
            var _status = util.showTxt(obj.innerHTML);
            var ret = _self.chgbetholdStatus(tid, _status);
            if (!ret) {
                _self.loadTodayWager();
                break
            }
        }
    };
    _self.chgbetholdStatus = function (tid,
                                       _status) {
        var bg_sty = "";
        var msg_sty = "";
        var msg = "";
        var normalPos = bhold_normal.indexOf(tid);
        var parlayPos = bhold_parlay.indexOf(tid);
        switch (_status) {
            case "A":
                top["wagers_oldTS"] = 0;
                msg_sty = "word_green";
                msg = "";
                try {
                    var msgObj = dom.getElementById("dg_" + tid);
                    util.setObjectClass(msgObj, msg_sty);
                    msgObj.innerHTML = LS.get("today_wager_A")
                } catch (e) {
                }
                if (bhold_normal.indexOf(tid) != -1) bhold_normal.splice(normalPos, 1);
                if (bhold_parlay.indexOf(tid) != -1) bhold_parlay.splice(parlayPos, 1);
                break;
            case "V":
                top["wagers_oldTS"] =
                    0;
                _self.clearbetholdTimer();
                _self.clearTimer();
                _self.createTimer();
                if (bhold_normal.indexOf(tid) != -1) bhold_normal.splice(normalPos, 1);
                if (bhold_parlay.indexOf(tid) != -1) bhold_parlay.splice(parlayPos, 1);
                return false;
                break;
            case "N":
            default:
                break
        }
        return true
    };
    _self.showForecast = function (e, par) {
        if (timerHash["todayTimer"] != null) timerHash["todayTimer"].stopTimer();
        if (timerHash["dg"] != null) timerHash["dg"].stopTimer();
        par["from"] = "wagers";
        parentClass.dispatchEvent("showForecast", par)
    };
    _self.restartTimer = function () {
        _self.loadTodayWager();
        if (timerHash["todayTimer"] != null) timerHash["todayTimer"].startTimer();
        if (timerHash["dg"] != null) timerHash["dg"].startTimer()
    }
};