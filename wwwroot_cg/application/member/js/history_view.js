function history_view(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var LS_code;
    var xmlnode;
    var _mc = new Object;
    var tag = "\u2022";
    var gtype_array = new Array("ALL","FT", "BK", "TN", "VB", "BM", "TT", "BS", "SK", "OP", "FS");
    var wid_ary = new Array;
    var gidfl_ary = new Array;
    var _pageCount = 10;
    var _nowPage = 1;
    var allDateValueAry = new Array;
    var fantasyInfoObj;
    var fantasyInfoIconObj;
    var _scrollHeightLimit = 225;
    var haveData =
        "";
    var classname = "history_view";
    var myhash = {};
    var util_game = new win.Util_game(win, dom);
    var clickMore = false;
    var clickMore_height = 0;
    _self.init = function () {
        _mc["total_accounts"] = document.getElementById("total_accounts");
        _mc["amout_gold"] = dom.getElementById("amout_gold");
        _mc["amout_win_gold"] = dom.getElementById("amout_win_gold");
        _mc["tool_backtop"] = dom.getElementById("tool_backtop");
        _mc["noHistoryView"] = dom.getElementById("noHistoryView");
        _mc["allsports"] = document.getElementById("allsports");
        _mc["body_show"] =
            dom.getElementById("body_show");
        _mc["dateTxt"] = dom.getElementById("dateTxt");
        _mc["gtypeTxt"] = dom.getElementById("gtypeTxt");
        _mc["div_show"] = dom.getElementById("div_show");
        _mc["title_creditlogs"] = dom.getElementById("title_creditlogs");
        util.addEvent(_mc["title_creditlogs"], "click", _self.chgPage, {"page": "credit_logs"});
        util.addEvent(dom.getElementById("title_todaywagers"), "click", _self.chgPage, {"page": "today_wagers"});
        _mc["pc_date_sel_div"] = dom.getElementById("pc_date_sel_div");
        _mc["pc_gtype_sel_div"] =
            dom.getElementById("pc_gtype_sel_div");
        _mc["date_sel"] = dom.getElementById("date_sel");
        _mc["gtype_sel"] = dom.getElementById("gtype_sel");
        if (top.mobile != "Y") {
            util.addEvent(_mc["pc_date_sel_div"], "click", _self.initDateSelect);
            util.addEvent(_mc["pc_gtype_sel_div"], "click", _self.initGtypeSelect)
        } else {
            util.addEvent(_mc["gtype_sel"], "change", _self.phGtypeSelect);
            util.addEvent(_mc["date_sel"], "change", _self.phDateSelect);
            util.addEvent(_mc["gtype_sel"], "blur", _self.selectBlur);
            util.addEvent(_mc["date_sel"],
                "blur", _self.selectBlur)
        }
        util.addEvent(_mc["allsports"], "click", _self.showViewMore);
        util.addEvent(_mc["tool_backtop"], "click", _self.backTop);
        util.addEvent(dom.getElementById("backpage"), "click", _self.toBack);
        _self.loadHistory();
        _self.chkGtype();
        win.addEventListener("orientationchange", _self.orientationChange);
        util.selectresizeblur(_self.orientationChange)
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        LS_code = parentClass.getThis("LS_code");
        LS = parentClass.getThis("LS")
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
    _self.selectBlur = function () {
        parentClass.dispatchEvent("scrollsetTop")
    };
    _self.initGtypeSelect = function (e, param) {
        if (_mc["pc_gtype_sel_div"].classList.contains("on")) util.removeClass(_mc["pc_gtype_sel_div"],
            "on"); else {
            util.addClass(_mc["pc_gtype_sel_div"], "on");
            util.pcDropdowns("pc_gtype_sel_div", "pc_gtype_sel_ul")
        }
        for (var i = 0; i < gtype_array.length; i++) {
            var gtypeObj = dom.getElementById(gtype_array[i]);
            util.removeClass(gtypeObj, "on");
            if (_mc["gtypeTxt"].innerHTML == gtypeObj.innerHTML) util.addClass(gtypeObj, "on");
            util.addEvent(gtypeObj, "click", _self.chgGtype)
        }
    };
    _self.initDateSelect = function (e, param) {
        if (_mc["pc_date_sel_div"].classList.contains("on")) util.removeClass(_mc["pc_date_sel_div"], "on"); else {
            util.addClass(_mc["pc_date_sel_div"],
                "on");
            util.pcDropdowns("pc_date_sel_div", "pc_date_sel_ul")
        }
        for (var i = 0; i < allDateValueAry.length; i++) {
            var dateObj = dom.getElementById(allDateValueAry[i]);
            util.removeClass(dateObj, "on");
            if (_mc["dateTxt"].innerHTML == dateObj.innerHTML) util.addClass(dateObj, "on");
            util.addEvent(dateObj, "click", _self.chgDate)
        }
    };
    _self.chgGtype = function (e, param) {
        top.viewGtype = e.target.id;
        _mc["gtype_sel"].value = e.target.id;
        _mc["gtypeTxt"].innerHTML = util.showTxt(e.target.innerHTML);
        _self.chgLoading(true);
        _self.loadHistory()
    };
    _self.phGtypeSelect = function (e, param) {
        for (var i = 0; i < gtype_array.length; i++) if (_mc["gtype_sel"].value == e.target[i].value) _mc["gtypeTxt"].innerHTML = util.showTxt(e.target[i].innerHTML);
        top.viewGtype = _mc["gtype_sel"].value;
        _self.loadHistory()
    };
    _self.chgDate = function (e, param) {
        top.viewDate = e.target.id;
        _mc["dateTxt"].innerHTML = util.showTxt(e.target.innerHTML);
        _self.chgLoading(true);
        _self.loadHistory()
    };
    _self.phDateSelect = function () {
        top.viewDate = _mc["date_sel"].value;
        _self.loadHistory()
    };
    _self.chgPage = function (e,
                              param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.toBack = function () {
        parentClass.dispatchEvent("backPage", {})
    };
    _self.showViewMore = function () {
        clickMore = true;
        clickMore_height = _mc["body_show"].scrollTop;
        _nowPage++;
        _self.doParseHistory()
    };
    _self.loadHistory = function () {
        var urlParams = "";
        urlParams += "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&LS=c";
        urlParams += "&today_gmt=" + top.viewDate;
        urlParams += "&gtype=" + top.viewGtype;
        urlParams +=
            "&tmp_flag=Y";
        urlParams = "p=history_switch&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.loadHistoryComplete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.loadHistoryComplete = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        xmlnode = util.parseXml(xml);
        top["fantasyHash"] = new Object;
        _mc["div_show"].innerHTML = "";
        _amout_gold = 0;
        _amout_win_gold = 0;
        _nowPage = 1;
        util.addEvent(_mc["body_show"],
            "scroll", _self.roll);
        parentClass.dispatchEvent("showLoading", {"isShow": false});
        _self.doParseHistory()
    };
    _self.doParseHistory = function () {
        var ratioForm = new win.ratioForm_Single_rule;
        var xmdObj = new Object;
        var k = 1;
        gidfl_ary = new Array;
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
        var pay_type = xmlnode.Node(xmlnode.Root[0], "pay_type").innerHTML;
        if (_mc["title_creditlogs"]) if (pay_type != 1 && _mc["title_creditlogs"].parentNode) _mc["title_creditlogs"].parentNode.removeChild(_mc["title_creditlogs"]); else _mc["title_creditlogs"].style =
            "";
        if (xmdObj["code"].innerHTML == "609") {
            xmdObj["amout_gold"] = xmlnode.Node(xmlnode.Root[0], "amout_gold").innerHTML;
            xmdObj["wagers"] = xmlnode.Node(xmlnode.Root[0], "wagers", false);
            xmdObj["selDate"] = xmlnode.Node(xmlnode.Root[0], "selDate").innerHTML;
            xmdObj["selGtype"] = xmlnode.Node(xmlnode.Root[0], "selGtype").innerHTML;
            xmdObj["allDateValue"] = xmlnode.Node(xmlnode.Root[0], "allDateValue").innerHTML;
            xmdObj["allDateShow"] = xmlnode.Node(xmlnode.Root[0], "allDateShow").innerHTML;
            var tmp_screen = "";
            var from = (_nowPage -
                1) * _pageCount;
            var limit = _nowPage * _pageCount;
            var t_id = "";
            var totalLength = xmdObj["wagers"].length;
            if (totalLength >= 1) {
                _self.showNoHistory(false);
                if (limit > totalLength) limit = totalLength;
                for (var i = from; i < limit; i++) {
                    var gidfl = 0;
                    var gid = 0;
                    var team_id_h = "";
                    var team_id_c = "";
                    xmdObj["wagers_sub"] = xmlnode.Node(xmdObj["wagers"][i], "wagers_sub", false);
                    w_id = xmlnode.Node(xmdObj["wagers"][i], "w_id").innerHTML;
                    addtime = xmlnode.Node(xmdObj["wagers"][i], "addtime").innerHTML;
                    oddf_type = xmlnode.Node(xmdObj["wagers"][i], "oddf_type").innerHTML;
                    gtype = xmlnode.Node(xmdObj["wagers"][i], "gtype").innerHTML;
                    gidfl = xmlnode.Node(xmdObj["wagers"][i], "gidfl").innerHTML;
                    gid = xmlnode.Node(xmdObj["wagers"][i], "gid").innerHTML;
                    gtype_tag = xmlnode.Node(xmdObj["wagers"][i], "gtype_tag").innerHTML;
                    w_ms = xmlnode.Node(xmdObj["wagers"][i], "w_ms").innerHTML;
                    wtype = xmlnode.Node(xmdObj["wagers"][i], "wtype").innerHTML;
                    result_data = xmlnode.Node(xmdObj["wagers"][i], "result_data").innerHTML;
                    bet_wtype = xmlnode.Node(xmdObj["wagers"][i], "bet_wtype").innerHTML;
                    gold = xmlnode.Node(xmdObj["wagers"][i],"gold").innerHTML;
                    gpush = win_gold = xmlnode.Node(xmdObj["wagers"][i], "win_gold").innerHTML;
                    ppush = xmlnode.Node(xmdObj["wagers"][i], "push").innerHTML;
                    win_gold = util.showTxt(win_gold);
                    gold = util.showTxt(gold);
                    main_ball_act_ret = xmlnode.Node(xmdObj["wagers"][i], "main_ball_act_ret").innerHTML;
                    main_ball_act_class = xmlnode.Node(xmdObj["wagers"][i], "main_ball_act_class").innerHTML;
                    dg_str = xmlnode.Node(xmdObj["wagers"][i], "dg_str").innerHTML;
                    _amout_gold += gold * 1;
                    if (!isNaN(win_gold.replace(/,/g, "") * 1)) _amout_win_gold += win_gold.replace(/,/g,"") * 1;
                    var div_model = "";
                    if (xmdObj["wagers_sub"].length >= 1) {
                        t_id = w_id.substr(1);
                        var p_title_model = dom.getElementById("p_title_model").innerHTML;
                        p_title_model = p_title_model.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>", "");
                        p_title_model = p_title_model.replace(/\*NUM\*/g, util.showTxt(xmdObj["wagers_sub"].length));
                        div_model += p_title_model;
                        var p_tmp_screen = "";
                        for (var j = 0; j < xmdObj["wagers_sub"].length; j++) {
                            league = xmlnode.Node(xmdObj["wagers_sub"][j], "league").innerHTML;
                            team_h_show =
                                xmlnode.Node(xmdObj["wagers_sub"][j], "team_h_show").innerHTML;
                            team_c_show = xmlnode.Node(xmdObj["wagers_sub"][j], "team_c_show").innerHTML;
                            team_h_ratio = xmlnode.Node(xmdObj["wagers_sub"][j], "team_h_ratio").innerHTML;
                            team_c_ratio = xmlnode.Node(xmdObj["wagers_sub"][j], "team_c_ratio").innerHTML;
                            ratio = xmlnode.Node(xmdObj["wagers_sub"][j], "ratio").innerHTML;
                            org_score = xmlnode.Node(xmdObj["wagers_sub"][j], "org_score").innerHTML;
                            score = xmlnode.Node(xmdObj["wagers_sub"][j], "score").innerHTML;
                            result = xmlnode.Node(xmdObj["wagers_sub"][j],
                                "result").innerHTML;
                            pname = xmlnode.Node(xmdObj["wagers_sub"][j], "pname").innerHTML;
                            ioratio = xmlnode.Node(xmdObj["wagers_sub"][j], "ioratio").innerHTML;
                            ball_act_class = xmlnode.Node(xmdObj["wagers_sub"][j], "ball_act_class").innerHTML;
                            ball_act_ret = xmlnode.Node(xmdObj["wagers_sub"][j], "ball_act_ret").innerHTML;
                            result_team = xmlnode.Node(xmdObj["wagers_sub"][j], "result_team").innerHTML;
                            result_data = xmlnode.Node(xmdObj["wagers_sub"][j], "result_data").innerHTML;
                            date = xmlnode.Node(xmdObj["wagers_sub"][j], "date").innerHTML;
                            wtype_sub = xmlnode.Node(xmdObj["wagers_sub"][j], "wtype_sub").innerHTML;
                            p_wtype = xmlnode.Node(xmdObj["wagers_sub"][j], "p_wtype").innerHTML;
                            ms_sub = xmlnode.Node(xmdObj["wagers_sub"][j], "ms_sub").innerHTML;
                            p_strong = xmlnode.Node(xmdObj["wagers_sub"][j], "strong").innerHTML;
                            if (date != "") {
                                var data_str = date.split("-");
                                data_st = data_str[1].trim() + "-" + data_str[0].trim();
                                tmp_league = data_st == "" ? league : data_st + " " + league
                            } else tmp_league = league;
                            var p_details_model = dom.getElementById("p_details_model").innerHTML;
                            p_details_model =
                                p_details_model.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>", "");
                            p_details_model = p_details_model.replace(/\*GTYPE\*/g, util.showTxt(gtype));
                            p_details_model = p_details_model.replace(/\*W_MS\*/g, util.showTxt(ms_sub));
                            p_details_model = p_details_model.replace(/\*WTYPE\*/g, util.showTxt(wtype_sub));
                            p_details_model = p_details_model.replace(/\*LEAGUE\*/g, util.showTxt(tmp_league));
                            p_details_model = p_details_model.replace(/\*TEAM_H_SHOW\*/g, util.showTxt(team_h_show));
                            p_details_model =
                                p_details_model.replace(/\*TEAM_C_SHOW\*/g, util.showTxt(team_c_show));
                            if (team_h_show == "" && team_c_show == "") p_details_model = p_details_model.replace(/\*TEAM_ACT\*/g, "display:none;"); else p_details_model = p_details_model.replace(/\*TEAM_ACT\*/g, "display:;");
                            var team_ratio = "";
                            if (util_game.checkWtypeIsR(p_wtype)) {
                                var color = "word_yellow";
                                if (p_wtype == "W3") color = "word_red";
                                p_details_model = p_details_model.replace(/\*TEAM_H_RATIO\*/g, "");
                                p_details_model = p_details_model.replace(/\*TEAM_C_RATIO\*/g, "");
                                p_details_model =
                                    p_details_model.replace(/\*CHOICE_CON_CLASS\*/g, color);
                                team_ratio = team_h_ratio != "" ? team_h_ratio : team_c_ratio;
						
                                if (team_ratio != 0) if (p_strong == "Y") team_ratio = "+" + team_ratio; else team_ratio = "-" + team_ratio
                            } else {
                                p_details_model = p_details_model.replace(/\*TEAM_H_RATIO\*/g, util.showTxt(team_h_ratio));
                                p_details_model = p_details_model.replace(/\*TEAM_C_RATIO\*/g, util.showTxt(team_c_ratio));
                                p_details_model = p_details_model.replace(/\*CHOICE_CON_CLASS\*/g, "word_red")
                            }
                            p_details_model = p_details_model.replace(/\*ORG_SCORE\*/g,
                                util.showTxt(org_score) + " ");
                            p_details_model = p_details_model.replace(/\*SCORE\*/g, util.showTxt(score));
                            if (ball_act_class == "word_red") p_details_model = p_details_model.replace(/\*ANNOUCEMENT\*/g, "word_delline");
                            if (util.checkWtypeIsOU(p_wtype)) {
                                var choice_blank = result.indexOf(" ");
                                var choice_str = result.substr(0, choice_blank);
                                var choice_con = result.substr(choice_blank, result.length - 1);
                                p_details_model = p_details_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(choice_str));
                                p_details_model = p_details_model.replace(/\*CHOICE_CON\*/g,
                                    util.showTxt(choice_con))
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
                            p_details_model =
                                p_details_model.replace(/\*PNAME\*/g, util.showTxt(pname));
                            p_details_model = p_details_model.replace(/\*IORATIO\*/g, util.showTxt(ratioForm.chgForm_Single_ratio(ioratio, p_wtype)));
                            if (gtype_tag == "SK" && p_wtype.indexOf("F") == "0") result_data = wtype_sub + "\t" + ms_sub + "\uff1a" + result_team;
                            if (ball_act_class == "word_red") p_details_model = p_details_model.replace(/\*RESULT_DATA\*/g, ""); else p_details_model = p_details_model.replace(/\*RESULT_DATA\*/g, util.showTxt(result_data));
                            p_tmp_screen += p_details_model
                        }
                        div_model += p_tmp_screen;
                        var p_bottom_model = dom.getElementById("p_bottom_model").innerHTML;
                        p_bottom_model = p_bottom_model.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>", "");
                        p_bottom_model = p_bottom_model.replace(/\*TID\*/g, util.showTxt(w_id));
                        p_bottom_model = p_bottom_model.replace(/\*W_ID\*/g, util.showTxt(w_id));
                        p_bottom_model = p_bottom_model.replace(/\*ADDTIME\*/g, util.showTxt(addtime));
                        if (bet_wtype == "P") p_bottom_model = p_bottom_model.replace(/\*ODDF_TYPE\*/g, ""); else p_bottom_model =
                            p_bottom_model.replace(/\*ODDF_TYPE\*/g, util.showTxt(oddf_type));
                        if (main_ball_act_ret == "") {
                            p_bottom_model = p_bottom_model.replace(/\*DG_CANCEL\*/g, "display:none;");
                            p_bottom_model = p_bottom_model.replace(/\*DG_STR\*/g, "");
                            p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g, "display:none;");
                            p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g, "");
                            p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_RET\*/g, "")
                        } else if (main_ball_act_class == "word_green" && win_gold != "-" && isNaN(Math.abs(win_gold))) {
                            p_bottom_model =
                                p_bottom_model.replace(/\*DG_CANCEL\*/g, "");
                            p_bottom_model = p_bottom_model.replace(/\*DG_STR\*/g, util.showTxt(main_ball_act_ret));
                            p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g, "display:;");
                            p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g, "word_red");
                            p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(dg_str) + " - " + util.showTxt(win_gold))
                        } else {
                            p_bottom_model = p_bottom_model.replace(/\*DG_CANCEL\*/g, "display:none;");
                            p_bottom_model = p_bottom_model.replace(/\*DG_STR\*/g,
                                "");
                            p_bottom_model = p_bottom_model.replace(/\*BALL_ACT\*/g, "display:;");
                            p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_CLASS\*/g, util.showTxt(main_ball_act_class));
                            p_bottom_model = p_bottom_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(main_ball_act_ret))
                        }
                        p_bottom_model = p_bottom_model.replace(/\*GOLD\*/g, util.showTxt(gold));
                        p_bottom_model = p_bottom_model.replace(/\*WIN_GOLD_STYLE\*/g, util.showTxt(_self.changeStyleGold(win_gold)));
                        if(ppush !== '投注平局') ppush = ""+ppush;
                        p_bottom_model = p_bottom_model.replace(/\*GPUSH\*/g, util.showTxt(ppush))
                        if (!isNaN(win_gold * 1)) if (win_gold * 1 == 0) p_bottom_model = p_bottom_model.replace(/\*WIN_GOLD\*/g,
                            gpush); else p_bottom_model = p_bottom_model.replace(/\*WIN_GOLD\*/g, win_gold == "-" ? "0" : util.showTxt(ratioForm.formatNumber(win_gold, 2, true))); else p_bottom_model = p_bottom_model.replace(/\*WIN_GOLD\*/g, win_gold == "-" ? "0" : util.showTxt(win_gold));
                        div_model += p_bottom_model
                    } else {
                        t_id = w_id.substr(2);
                        league = xmlnode.Node(xmdObj["wagers"][i], "league").innerHTML;
                        team_h_show = xmlnode.Node(xmdObj["wagers"][i], "team_h_show").innerHTML;
                        team_c_show = xmlnode.Node(xmdObj["wagers"][i], "team_c_show").innerHTML;
                        team_h_ratio =
                            xmlnode.Node(xmdObj["wagers"][i], "team_h_ratio").innerHTML;
                        team_c_ratio = xmlnode.Node(xmdObj["wagers"][i], "team_c_ratio").innerHTML;
                        ratio = xmlnode.Node(xmdObj["wagers"][i], "ratio").innerHTML;
                        org_score = xmlnode.Node(xmdObj["wagers"][i], "org_score").innerHTML;
                        score = xmlnode.Node(xmdObj["wagers"][i], "score").innerHTML;
                        result = xmlnode.Node(xmdObj["wagers"][i], "result").innerHTML;
                        strong = xmlnode.Node(xmdObj["wagers"][i], "strong").innerHTML;
                        pname = xmlnode.Node(xmdObj["wagers"][i], "pname").innerHTML;
                        ioratio = xmlnode.Node(xmdObj["wagers"][i],
                            "ioratio").innerHTML;
                        ball_act_class = xmlnode.Node(xmdObj["wagers"][i], "ball_act_class").innerHTML;
                        ball_act_ret = xmlnode.Node(xmdObj["wagers"][i], "ball_act_ret").innerHTML;
                        result_data = xmlnode.Node(xmdObj["wagers"][i], "result_data").innerHTML;
                        dg = xmlnode.Node(xmdObj["wagers"][i], "dg").innerHTML;
                        dg_str = xmlnode.Node(xmdObj["wagers"][i], "dg_str").innerHTML;
                        div_model = dom.getElementById("normal_model").innerHTML;
                        div_model = div_model.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>",
                            "");
                        div_model = div_model.replace(/\*TID\*/g, util.showTxt(w_id));
                        div_model = div_model.replace(/\*W_ID\*/g, util.showTxt(w_id));
                        div_model = div_model.replace(/\*ADDTIME\*/g, util.showTxt(addtime));
                        if (gidfl != 0) {
                            team_id_h = xmlnode.Node(xmdObj["wagers"][i], "team_id_h").innerHTML;
                            team_id_c = xmlnode.Node(xmdObj["wagers"][i], "team_id_c").innerHTML;
                            if (!gidfl_ary[gidfl]) {
                                gidfl_ary[gidfl] = {"team_id_h": team_id_h, "team_id_c": team_id_c, "gid": gid};
                                div_model = div_model.replace(/\*GIDFL\*/g, util.showTxt(gidfl))
                            } else {
                                var key =
                                    gidfl + "_" + k;
                                gidfl_ary[key] = {"team_id_h": team_id_h, "team_id_c": team_id_c, "gid": gid};
                                div_model = div_model.replace(/\*GIDFL\*/g, util.showTxt(key));
                                k++
                            }
                        }
                        if (bet_wtype == "P") div_model = div_model.replace(/\*ODDF_TYPE\*/g, ""); else div_model = div_model.replace(/\*ODDF_TYPE\*/g, util.showTxt(oddf_type));
                        div_model = div_model.replace(/\*GTYPE\*/g, util.showTxt(gtype));
                        div_model = div_model.replace(/\*W_MS\*/g, util.showTxt(w_ms));
                        div_model = div_model.replace(/\*WTYPE\*/g, util.showTxt(wtype));
                        div_model = div_model.replace(/\*LEAGUE\*/g,
                            util.showTxt(league));
                        div_model = div_model.replace(/\*TEAM_H_SHOW\*/g, util.showTxt(team_h_show));
                        div_model = div_model.replace(/\*TEAM_C_SHOW\*/g, util.showTxt(team_c_show));
                        if (team_h_show == "" && team_c_show == "") div_model = div_model.replace(/\*TEAM_ACT\*/g, "display:none;"); else div_model = div_model.replace(/\*TEAM_ACT\*/g, "display:;");
                        var team_ratio = "";
                        if (util_game.checkWtypeIsR(bet_wtype)) {
                            var color = "word_yellow";
                            if (bet_wtype == "W3") color = "word_red";
                            div_model = div_model.replace(/\*TEAM_H_RATIO\*/g, "");
                            div_model =
                                div_model.replace(/\*TEAM_C_RATIO\*/g, "");
                            div_model = div_model.replace(/\*CHOICE_CON_CLASS\*/g, color);
                            team_ratio = team_h_ratio != "" ? team_h_ratio : team_c_ratio;
                            if (team_ratio != 0) if (strong == "Y") team_ratio = "-" + team_ratio; else team_ratio = "+" + team_ratio
                        } else {
                            div_model = div_model.replace(/\*TEAM_H_RATIO\*/g, util.showTxt(team_h_ratio));
                            div_model = div_model.replace(/\*TEAM_C_RATIO\*/g, util.showTxt(team_c_ratio));
                            div_model = div_model.replace(/\*CHOICE_CON_CLASS\*/g, "word_red")
                        }
                        div_model = div_model.replace(/\*ORG_SCORE\*/g,
                            util.showTxt(org_score));
                        div_model = div_model.replace(/\*SCORE\*/g, util.showTxt(score));
                        if (util.checkWtypeIsOU(bet_wtype)) {
                            var choice_blank = result.indexOf(" ");
                            var choice_str = result.substr(0, choice_blank);
                            var choice_con = result.substr(choice_blank, result.length - 1);
                            div_model = div_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(choice_str));
                            div_model = div_model.replace(/\*CHOICE_CON\*/g, util.showTxt(choice_con))
                        } else if (bet_wtype == "W3") {
                            var choiceAry = result.split(" ");
                            var choice_con = choiceAry[choiceAry.length -
                            1];
                            var choice_str = result.split(choice_con)[0];
                            div_model = div_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(choice_str));
                            div_model = div_model.replace(/\*CHOICE_CON\*/g, util.showTxt(choice_con))
                        } else {
                            div_model = div_model.replace(/\*CHOICE_TEAM\*/g, util.showTxt(result));
                            div_model = div_model.replace(/\*CHOICE_CON\*/g, team_ratio)
                        }
                        div_model = div_model.replace(/\*PNAME\*/g, util.showTxt(pname));
                        div_model = div_model.replace(/\*IORATIO\*/g, ioratio * 1 < 0 ? "<font class='word_blue'>" + util.showTxt(ratioForm.chgForm_Single_ratio(ioratio,
                            bet_wtype)) + "</font>" : util.showTxt(ratioForm.chgForm_Single_ratio(ioratio, bet_wtype)));
                        if (ball_act_ret == "") {
                            div_model = div_model.replace(/\*DG_CANCEL\*/g, "display:none;");
                            div_model = div_model.replace(/\*DG_STR\*/g, "");
                            div_model = div_model.replace(/\*BALL_ACT\*/g, "display:none;");
                            div_model = div_model.replace(/\*BALL_ACT_CLASS\*/g, "");
                            div_model = div_model.replace(/\*BALL_ACT_RET\*/g, "")
                        } else {
                            if (dg == "Y") {
                                div_model = div_model.replace(/\*DG_CANCEL\*/g, "");
                                div_model = div_model.replace(/\*DG_STR\*/g, util.showTxt(dg_str))
                            } else {
                                div_model =
                                    div_model.replace(/\*DG_CANCEL\*/g, "display:none;");
                                div_model = div_model.replace(/\*DG_STR\*/g, "")
                            }
                            div_model = div_model.replace(/\*BALL_ACT\*/g, "display:;");
                            div_model = div_model.replace(/\*BALL_ACT_CLASS\*/g, util.showTxt(ball_act_class));
                            div_model = div_model.replace(/\*BALL_ACT_RET\*/g, util.showTxt(ball_act_ret))
                        }
                        div_model = div_model.replace(/\*GOLD\*/g, gold);
                        div_model = div_model.replace(/\*WIN_GOLD_STYLE\*/g, util.showTxt(_self.changeStyleGold(win_gold)));
                        if(ppush !== '投注平局') ppush = ""+ppush;
                        div_model = div_model.replace(/\*GPUSH\*/g, ppush);
                        if (!isNaN(win_gold * 1)) if (win_gold * 1 == 0) div_model =
                            div_model.replace(/\*WIN_GOLD\*/g, util.showTxt(gpush)); else div_model = div_model.replace(/\*WIN_GOLD\*/g, win_gold == "-" ? "0" : util.showTxt(ratioForm.formatNumber(win_gold, 2, true))); else div_model = div_model.replace(/\*WIN_GOLD\*/g, win_gold == "-" ? "0" : util.showTxt(win_gold));
                        if (ball_act_class == "word_red") div_model = div_model.replace(/\*RESULT_DATA\*/g, ""); else div_model = div_model.replace(/\*RESULT_DATA\*/g, util.showTxt(result_data))
                    }
                    div_model = div_model.replace(/\*T_ID\*/g, t_id);
                    var cancel_apn = util.showTxt(xmlnode.Node(xmdObj["wagers"][i],
                        "cancel_apn").innerHTML);
                    if (win_gold != "") {
                        if (win_gold * 1 == 0) div_model = div_model.replace(/\*DIS_PUSH\*/g, "");
                        else div_model = div_model.replace(/\*DIS_PUSH\*/g, "display:none;");
                    } else div_model = div_model.replace(/\*DIS_PUSH\*/g, "display:none;");
                    if (cancel_apn != "") {
                        if (!util.in_array(w_id, wid_ary)) wid_ary.push(w_id + "[can_apn]" + cancel_apn);
                        div_model = div_model.replace(/\*DIS_APN\*/g, "")
                    } else div_model = div_model.replace(/\*DIS_APN\*/g, "display:none;");
                    if (ball_act_class == "word_red") div_model = div_model.replace(/\*RESULT_DATA\*/g, ""); else div_model = div_model.replace(/\*RESULT_DATA\*/g, util.showTxt(result_data));
                    tmp_screen += div_model
                }
                var tmpGold = ratioForm.formatNumber(_amout_gold, 2, true);
                var tmpWinGold = ratioForm.formatNumber(_amout_win_gold,
                    2, true);
                _mc["amout_gold"].innerHTML = util.showTxt(util.formatThousand(tmpGold));
                if (tmpWinGold * 1 == 0) _mc["amout_win_gold"].innerHTML = "<font color=black>" + util.showTxt(tmpWinGold) + "</font>"; else _mc["amout_win_gold"].innerHTML = util.showTxt(util.formatThousand(tmpWinGold));
                if (tmpWinGold * 1 > 0) util.setObjectClass(_mc["amout_win_gold"], "word_lightgreen"); else if (tmpWinGold * 1 == 0) util.setObjectClass(_mc["amout_win_gold"], "word_white"); else util.setObjectClass(_mc["amout_win_gold"], "word_lightred");
                _mc["div_show"].innerHTML +=
                    tmp_screen;
                var totalPage = Math.ceil(totalLength / _pageCount);
                if (_nowPage >= totalPage) _mc["allsports"].style.display = "none"
            } else _self.showNoHistory(true);
            _self.orientationChange();
            _self.chgLoading(false);
            var tmpLi = "";
            allDateValueAry = xmdObj["allDateValue"].split("|");
            var allDateShowAry = xmdObj["allDateShow"].split("|");
            for (var i = 0; i < allDateValueAry.length; i++) tmpLi += "<li id=" + allDateValueAry[i] + ">" + allDateShowAry[i] + "</li>";
            dom.getElementById("pc_date_sel_ul").innerHTML = tmpLi;
            if (_mc["date_sel"].options.length ==
                0) for (var i = 0; i < allDateValueAry.length; i++) if (allDateValueAry[i] == xmdObj["selDate"]) {
                var new_option = new Option(allDateShowAry[i], allDateValueAry[i], "", true);
                _mc["date_sel"].options.add(new_option)
            } else {
                var new_option = new Option(allDateShowAry[i], allDateValueAry[i]);
                _mc["date_sel"].options.add(new_option)
            }
            try {
                _mc["dateTxt"].innerHTML = util.showTxt(dom.getElementById(xmdObj["selDate"]).innerHTML)
            } catch (e) {
            }
            for (var i = 0; i < wid_ary.length; i++) {
                var allmsg = wid_ary[i].split("[can_apn]");
                _mc["cancel_reason_" +
                allmsg[0]] = dom.getElementById("cancel_reason_" + allmsg[0]);
                util.addEvent(_mc["cancel_reason_" + allmsg[0]], "click", _self.icon, {
                    "tid": allmsg[0],
                    "msg": allmsg[1]
                })
            }
            for (var id in gidfl_ary) {
                fantasyInfoObj = dom.getElementById("div_icon_info_" + id);
                fantasyInfoIconObj = dom.getElementById("div_icon_info_i_" + id);
				if (fantasyInfoObj) {
					fantasyInfoObj.style.display = "";
					util.addEvent(fantasyInfoIconObj, "click", _self.goToGetFantasyInfo, {
						"gidfl": id,
						"gid": gidfl_ary[id]["gid"],
						"team_id_h": gidfl_ary[id]["team_id_h"],
						"team_id_c": gidfl_ary[id]["team_id_c"],
						"mode": "history"
					})
				}
					
            }
        }
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
    _self.showNoHistory = function (isOk) {
        haveData = isOk;
        if (isOk) {
            _mc["noHistoryView"].style.display =
                "";
            _mc["total_accounts"].style.display = "none";
            _mc["tool_backtop"].style.display = "none";
            _mc["allsports"].style.display = "none"
        } else {
            _mc["noHistoryView"].style.display = "none";
            _mc["total_accounts"].style.display = "";
            _mc["allsports"].style.display = ""
        }
    };
    _self.changeStyleGold = function (gold) {
        var _style = "word_green";
        if ("" + gold == "-" || gold * 1 == 0) _style = "wager_none_gold"; else if (gold * 1 < 0 || isNaN(gold)) _style = "word_red";
        return _style
    };
    _self.backTop = function (e, param) {
        _mc["body_show"].scrollTop = 0
    };
    _self.roll = function () {
        if (clickMore) {
            _mc["body_show"].scrollTop =
                clickMore_height;
            clickMore = false
        }
        var body_h = _mc["body_show"].scrollHeight;
        var view_h = _mc["body_show"].clientHeight;
        var now_h = _mc["body_show"].scrollTop;
        if (!haveData) {
            _mc["tool_backtop"].style.display = "";
            if (body_h - (view_h + now_h) <= 80) parentClass.dispatchEvent("rollBottom", {
                "page": "history_view",
                "isBottom": true
            }); else parentClass.dispatchEvent("rollBottom", {"page": "history_view", "isBottom": false})
        }
    };
    _self.chkGtype = function () {
        var gtypeTag = top.viewGtype;
        _mc["gtype_sel"].value = gtypeTag;
        _mc["gtypeTxt"].innerHTML =
            util.showTxt(document.getElementById(gtypeTag).innerHTML)
    };
    _self.orientationChange = function () {
        var orientation = win.Math.abs(win.orientation);
        if (orientation == 90 || orientation == 0) _self.orientation()
    };
    _self.orientation = function () {
        var body_h = _mc["body_show"].scrollHeight;
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
    _self.chgLoading = function (isShow) {
        if (isShow) {
            _mc["tool_backtop"].style.display = "none";
            _mc["noHistoryView"].style.display = "none";
            _mc["allsports"].style.display = "none";
            _mc["div_show"].style.display = "none";
            dom.getElementById("info_box").style.display = "none";
            dom.getElementById("load").style.display = ""
        } else {
            _mc["div_show"].style.display = "";
            dom.getElementById("info_box").style.display = "";
            dom.getElementById("load").style.display = "none"
        }
    }
};