function Other_bet(_win, _dom) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var parentClass;
                var classname = "Other_bet.js";
                var timerHash;
                var config_set;
                var _mc = new Object;
                var util = new win.Util(win,dom);
                var util_game = new win.Util_game(win,dom);
                var tid = "";
                var t_active = "";
                var startTouchY = 0;
                var fixY = 5;
                var bethold_tid = 0;
                var uni_key = "";
                var tmp_bet_select = new Object;
                var tmp_bet_select_more = new Object;
                _self.paramHash = new Object;
                _self.init = function() {
                    _mc["bet_show"] = dom.getElementById("bet_show");
                    _mc["finish_model"] = dom.getElementById("finish_model");
                    util_game.init()
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    LS = parentClass.getThis("LS");
                    LS_game = parentClass.getThis("LS_game");
                    LS_code = parentClass.getThis("LS_code");
                    timerHash = parentClass.getThis("timerHash");
                    config_set = parentClass.getThis("config_set")
                }
                ;
                _self.bet = function(datas) {
                    _self.paramHash = util.mergeHash(_self.paramHash, datas);
                    var keys = _self.paramHash["gtype"] + "_" + _self.paramHash["gid"] + "_" + _self.paramHash["wtype"].toUpperCase() + "_" + _self.paramHash["rtype"].toUpperCase() + "_" + _self.paramHash["chose_team"].toUpperCase();
                    top["betHash"][keys] = new Object;
                    top["betHash"][keys].gid = _self.paramHash["gid"];
                    top["betHash"][keys].gtype = _self.paramHash["gtype"];
                    top["betHash"][keys].wtype = _self.paramHash["wtype"].toUpperCase();
                    top["betHash"][keys].rtype = _self.paramHash["rtype"].toUpperCase();
                    top["betHash"][keys].showtype = _self.paramHash["showtype"];
                    var urlParams = "";
                    urlParams += "odd_f_type=" + top["userData"].odd_f_type;
                    urlParams += "&golds=" + _self.paramHash["golds"];
                    urlParams += "&gid=" + _self.paramHash["gid"];
                    urlParams += "&gtype=" + _self.paramHash["gtype"];
                    urlParams += "&wtype=" + _self.paramHash["wtype"].toUpperCase();
                    urlParams += "&rtype=" + _self.paramHash["rtype"].toUpperCase();
                    urlParams += "&chose_team=" + _self.paramHash["chose_team"];
                    urlParams += "&ioratio=" + _self.paramHash["ioratio"];
                    urlParams += "&con=" + _self.paramHash["con"];
                    urlParams += "&ratio=" + _self.paramHash["ratio"];
                    urlParams += "&autoOdd=" + _self.paramHash["autoOdd"];
                    urlParams += "&timestamp=" + util_game.getTimestamp();
                    urlParams += "&timestamp2=" + _self.paramHash["orderviewTS"];
                    urlParams += "&isRB=" + (util_game.isRBWtype(_self.paramHash["wtype"]) ? "Y" : "N");
                    urlParams += "&imp=" + _self.paramHash["imp"];
                    urlParams += "&ptype=" + _self.paramHash["ptype"];
                    if (top.userData.pay_type == 1)
                        urlParams += "&isYesterday=" + "N";
                    else
                        urlParams += "&isYesterday=" + (_self.paramHash["gameDateStr"] == "yesterday" ? "Y" : "N");
                    urlParams += "&f=1" + _self.paramHash["f"];
                    urlParams = "p=Other_bet&" + top.param + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onBetError);
                    getHTML.addEventListener("LoadComplete", _self.betFinish);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.delay_bet = function() {
                    var urlParams = "";
                    urlParams += "odd_f_type=" + top["userData"].odd_f_type;
                    urlParams += "&gid=" + _self.paramHash["gid"];
                    urlParams += "&gtype=" + _self.paramHash["gtype"];
                    urlParams += "&ticket_id=" + tid;
                    urlParams += "&active=" + t_active;
                    urlParams += "&autoOdd=" + _self.paramHash["autoOdd"];
                    urlParams += "&timestamp=" + util_game.getTimestamp();
                    urlParams += "&timestamp2=" + _self.paramHash["delayTS"];
                    urlParams += "&isRB=" + (util_game.isRBWtype(_self.paramHash["wtype"]) ? "Y" : "N");
                    urlParams += "&imp=" + _self.paramHash["imp"];
                    urlParams += "&ptype=" + _self.paramHash["ptype"];
                    if (top["betHash"] != null)
                        for (var keys in top["betHash"]) {
                            urlParams += "&wtype=" + top["betHash"][keys].wtype;
                            urlParams += "&rtype=" + top["betHash"][keys].rtype
                        }
                    if (top.userData.pay_type == 1)
                        urlParams += "&isYesterday=" + "N";
                    else
                        urlParams += "&isYesterday=" + (_self.paramHash["gameDateStr"] == "yesterday" ? "Y" : "N");
                    urlParams = "p=Other_bet&" + top.param + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onBetError);
                    getHTML.addEventListener("LoadComplete", _self.betFinish);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.onBetError = function() {
                    parentClass.dispatchEvent("showUnStableMsg", {})
                }
                ;
                _self.delayFinish = function() {
                    if (timerHash != null)
                        if (timerHash["delay_timer"] != null) {
                            timerHash["delay_timer"].clearObj();
                            timerHash["delay_timer"] = null
                        }
                }
                ;
                _self.betFinish = function(xml) {
                    var xmdObj = new Object;
                    var isbethold = "";
                    var xmlnode = util.parseXml(xml);
                    xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
                    try {
                        if (xmdObj["code"].innerHTML == "560") {
                            var tmpDiv, choiceModel, tmpFinishList;
                            choiceModel = dom.getElementById("fast_finish");
                            tmpFinishList = choiceModel.cloneNode(true);
                            var finalBet = _mc["finish_model"].cloneNode(true);
                            finalBet.innerHTML = finalBet.innerHTML.replace(new RegExp("\\*FINISH_LIST\\*","gi"), tmpFinishList.innerHTML);
                            tmpDiv = finalBet.innerHTML;
                            _mc["bet_show"].innerHTML = tmpDiv;
                            _mc["bet_finish_menutype"] = document.getElementById("bet_finish_menutype");
                            _mc["bet_finish_score"] = document.getElementById("bet_finish_score");
                            _mc["bet_finish_league"] = document.getElementById("bet_finish_league");
                            _mc["bet_finish_team_h"] = document.getElementById("bet_finish_team_h");
                            _mc["bet_finish_team_c"] = document.getElementById("bet_finish_team_c");
                            _mc["bet_finish_con"] = document.getElementById("bet_finish_con");
                            _mc["bet_finish_con_c"] = document.getElementById("bet_finish_con_c");
                            _mc["bet_finish_chose_team"] = document.getElementById("bet_finish_chose_team");
                            _mc["bet_finish_chose_con"] = document.getElementById("bet_finish_chose_con");
                            _mc["bet_finish_ior"] = document.getElementById("bet_finish_ior");
                            _mc["bet_finish_tid"] = document.getElementById("bet_finish_tid");
                            _mc["bet_finish_gold"] = document.getElementById("bet_finish_gold");
                            _mc["bet_finish_win_gold"] = document.getElementById("bet_finish_win_gold");
                            _mc["bet_finish_bethold"] = document.getElementById("bet_finish_dg");
                            _mc["div_lastBetOption"] = document.getElementById("div_lastBetOption");
                            _mc["div_lastBetOption_txt"] = document.getElementById("div_lastBetOption_txt");
                            _mc["orderMsg_div"] = document.getElementById("orderMsg_div");
                            _mc["orderMsg"] = document.getElementById("orderMsg");
                            _self.SelectBetClose();
                            _mc["div_lastBetOption_txt"].innerHTML = LS.get("lastBetOption_fast");
                            util.addEvent(_mc["div_lastBetOption"], "click", _self.reBet, _mc["div_lastBetOption"]);
                            var server_gid = xmlnode.Node(xmlnode.Root[0], "gid").innerHTML;
                            var server_gtype = xmlnode.Node(xmlnode.Root[0], "gtype").innerHTML;
                            var server_wtype = xmlnode.Node(xmlnode.Root[0], "wtype").innerHTML;
                            var server_rtype = xmlnode.Node(xmlnode.Root[0], "rtype").innerHTML;
                            var server_type = xmlnode.Node(xmlnode.Root[0], "type").innerHTML;
                            var peid = xmlnode.Node(xmlnode.Root[0], "peid").innerHTML;
                            var period = xmlnode.Node(xmlnode.Root[0], "period").innerHTML;
                            var competitionext = xmlnode.Node(xmlnode.Root[0], "competitionext").innerHTML;
                            var gamenum = xmlnode.Node(xmlnode.Root[0], "gamenum").innerHTML;
                            var keys = server_gtype + "_" + server_gid + "_" + server_wtype + "_" + server_rtype + "_" + server_type;
                            if (top["betHash"][keys] == null)
                                return;
                            var periodHash = {
                                "period": period,
                                "gameType": competitionext,
                                "nowGame": "G" + gamenum
                            };
                            var objids = ",order_close,finishBtn_show,";
                            var ary = util.getObjAry(_mc["bet_show"], objids);
                            util.addEvent(ary["finishBtn_show"], "click", parentClass.closeBet, true);
                            util.addEvent(ary["order_close"], "click", parentClass.fastPrint, _mc["bet_show"]);
                            util.addClass(_mc["bet_show"], "receipt");
                            var getMenuHash = new Object;
                            getMenuHash.gid = server_gid;
                            getMenuHash.showtype = top["betHash"][keys].showtype;
                            getMenuHash.gtype = server_gtype;
                            getMenuHash.wtype = server_wtype;
                            getMenuHash.rtype = server_rtype;
                            getMenuHash.ms = xmlnode.Node(xmlnode.Root[0], "ms").innerHTML;
                            getMenuHash.team_h = xmlnode.Node(xmlnode.Root[0], "team_h").innerHTML;
                            getMenuHash.team_c = xmlnode.Node(xmlnode.Root[0], "team_c").innerHTML;
                            getMenuHash.imp = xmlnode.Node(xmlnode.Root[0], "imp").innerHTML;
                            getMenuHash.ptype = xmlnode.Node(xmlnode.Root[0], "ptype").innerHTML;
                            var wagersInfo = util_game.get_wtype_name(LS_game, getMenuHash.gid, getMenuHash.showtype, getMenuHash.gtype, getMenuHash.wtype, getMenuHash.rtype, getMenuHash.ms, getMenuHash.team_h, getMenuHash.team_c, getMenuHash.imp, getMenuHash.ptype, periodHash);
                            var FTmenutype = wagersInfo["menutype"];
                            _mc["bet_finish_tid"].innerHTML = util.showTxt(util_game.getTicketType(server_wtype)) + util.showTxt(xmlnode.Node(xmlnode.Root[0], "ticket_id").innerHTML);
                            _mc["bet_finish_menutype"].innerHTML = util.showTxt(FTmenutype);
                            var score_h = util.showTxt(xmlnode.Node(xmlnode.Root[0], "score_h").innerHTML) * 1;
                            var score_c = util.showTxt(xmlnode.Node(xmlnode.Root[0], "score_c").innerHTML) * 1;
                            var score = "";
                            if (isNaN(score_h) || isNaN(score_c))
                                score = "";
                            else
                                score = "(" + score_h + " - " + score_c + ")";
                            if (server_wtype == "SP")
                                server_wtype = util_game.changeRtypetoWtypeSP(server_rtype);
                            _mc["bet_finish_score"].innerHTML = "";
                            _mc["bet_finish_score"].style.display = "none";
                            _mc["bet_finish_league"].innerHTML = util.showTxt(xmlnode.Node(xmlnode.Root[0], "league").innerHTML);
                            var imp = util.showTxt(xmlnode.Node(xmlnode.Root[0], "imp").innerHTML);
                            var ptype = util.showTxt(xmlnode.Node(xmlnode.Root[0], "ptype").innerHTML);
                            var team_h = util.showTxt(xmlnode.Node(xmlnode.Root[0], "team_h").innerHTML);
                            var team_c = util.showTxt(xmlnode.Node(xmlnode.Root[0], "team_c").innerHTML);
                            if (imp == "Y") {
                                team_h = team_h.replace(ptype, "");
                                team_c = team_c.replace(ptype, "")
                            } else {
                                team_h = team_h;
                                team_c = team_c
                            }
                            _mc["bet_finish_team_h"].innerHTML = team_h;
                            _mc["bet_finish_team_c"].innerHTML = team_c;
                            var strong = util.showTxt(xmlnode.Node(xmlnode.Root[0], "strong").innerHTML);
                            var strObj = new Object;
                            if (server_type == "N")
                                server_type = "H";
                            strObj["H_Y"] = "H";
                            strObj["C_N"] = "H";
                            strObj["C_Y"] = "C";
                            strObj["H_N"] = "C";
                            strong = strObj[server_type + "_" + strong];
                            var ratio = xmlnode.Node(xmlnode.Root[0], "spread").innerHTML;
                            var conObj = util_game.getConcedeStr(server_wtype, strong, ratio, false);
                            if (util_game.checkWtypeIsR(server_wtype)) {
                                _mc["bet_finish_con"].innerHTML = "";
                                _mc["bet_finish_con_c"].innerHTML = "";
                                _mc["bet_finish_con"].style.display = "none";
                                _mc["bet_finish_con_c"].style.display = "none";
                                _mc["bet_finish_chose_con"].className = "word_yellow"
                            } else {
                                _mc["bet_finish_con"].innerHTML = util.showTxt(conObj["bet_finish_con"]);
                                _mc["bet_finish_con_c"].innerHTML = util.showTxt(conObj["bet_finish_con_c"])
                            }
                            try {
                                isbethold = xmlnode.Node(xmlnode.Root[0], "delaysec").innerHTML;
                                _mc["orderMsg_div"].style.display = "";
                                if (isbethold > 0) {
                                    _mc["bet_finish_bethold"].className = "status_word word_yellow";
                                    _mc["orderMsg_div"].className = "ord_msg ord_levelmsg bg_yellow";
                                    var msgli = document.createElement("li");
                                    msgli.innerHTML = LS_code.get("bet_pending");
                                    _mc["orderMsg"].appendChild(msgli);
                                    ticket_id = xmlnode.Node(xmlnode.Root[0], "ticket_id").innerHTML;
                                    bethold_tid = ticket_id;
                                    _self.checkbethold();
                                    _self.createbetholdTimer(ticket_id)
                                } else {
                                    _mc["orderMsg_div"].style.display = "";
                                    _mc["orderMsg_div"].className = "ord_msg ord_levelmsg bg_green";
                                    var msgli = document.createElement("li");
                                    msgli.innerHTML = LS_code.get("bet_success");
                                    _mc["orderMsg"].appendChild(msgli);
                                    _mc["bet_finish_bethold"].className = "status_word word_green"
                                }
                            } catch (e) {
                                console.log(e)
                            }
                            var chose_team;
                            var _rtype = server_rtype.toLowerCase();
                            var newRtype = util_game.switchTeamName(server_wtype, server_rtype);
                            if (typeof newRtype != "undefined")
                                _rtype = newRtype;
                            if (server_gtype.toUpperCase() == "BS" && util_game.checkWtypeIsWM(_self.paramHash["keepwtype"]))
                                chose_team = LS_game.get(_rtype + "_" + server_gtype.toLowerCase());
                            else if (LS_game.get(_rtype) == "") {
                                var Ftype = "_F_RF_DC_RDC_";
                                var isRGA = util_game.checkWtypeIsRGA_TN(_self.paramHash["wtype"].toUpperCase());
                                var isRGOU = util_game.checkWtypeIsRGOU_TN(_self.paramHash["wtype"].toUpperCase());
                                if (Ftype.indexOf("_" + _self.paramHash["wtype"].toUpperCase() + "_") >= 0) {
                                    f1 = _self.paramHash["rtype"].toUpperCase().replace(_self.paramHash["wtype"].toUpperCase(), "").substr(0, 1);
                                    f2 = _self.paramHash["rtype"].toUpperCase().replace(_self.paramHash["wtype"].toUpperCase(), "").substr(1, 1);
                                    chose_team = "";
                                    if (f1 == "N")
                                        chose_team += LS_game.get("mn");
                                    else {
                                        var choose = xmlnode.Node(xmlnode.Root[0], "team_" + f1.toLowerCase()).innerHTML;
                                        if (imp == "Y")
                                            choose = choose.replace(ptype, "");
                                        chose_team += choose;
                                        _self.paramHash["show_team"] = true
                                    }
                                    chose_team += " / ";
                                    if (f2 == "N")
                                        chose_team += LS_game.get("mn");
                                    else {
                                        var choose = xmlnode.Node(xmlnode.Root[0], "team_" + f2.toLowerCase()).innerHTML;
                                        if (imp == "Y")
                                            choose = choose.replace(ptype, "");
                                        chose_team += choose;
                                        _self.paramHash["show_team"] = true
                                    }
                                } else if (isRGA || isRGOU)
                                    chose_team = LS_game.get(_self.paramHash["chose_team"]);
                                else {
                                    var tmp_type = server_type.substr(-1, 1);
                                    var choose = xmlnode.Node(xmlnode.Root[0], "team_" + tmp_type.toLowerCase()).innerHTML;
                                    if (imp == "Y")
                                        choose = choose.replace(ptype, "");
                                    chose_team = choose
                                }
                            } else {
                                var team_h = xmlnode.Node(xmlnode.Root[0], "team_h").innerHTML;
                                var team_c = xmlnode.Node(xmlnode.Root[0], "team_c").innerHTML;
                                chose_team = LS_game.get(_rtype);
                                chose_team = chose_team.replace(/\*TEAM_H\*/g, util.showTxt(team_h));
                                chose_team = chose_team.replace(/\*TEAM_C\*/g, util.showTxt(team_c));
                                if (imp == "Y") {
                                    var re = new RegExp(ptype,"g");
                                    chose_team = chose_team.replace(re, "")
                                }
                            }
                            var tmp_team = "";
                            var get_team = util_game.getTeamWM(_rtype.toUpperCase());
                            if (get_team != null) {
                                tmp_team = util.showTxt(xmlnode.Node(xmlnode.Root[0], "team_" + get_team).innerHTML) + " - ";
                                if (imp == "Y")
                                    tmp_team = tmp_team.replace(ptype, "")
                            }
                            _mc["bet_finish_chose_team"].innerHTML = tmp_team + util.showTxt(chose_team);					
                            var ratioR = xmlnode.Node(xmlnode.Root[0], "spread").innerHTML;
                            if(ratioR == ""){
                                ratioR = xmlnode.Node(xmlnode.Root[0], "ratio").innerHTML;
                            }
                            if (!util_game.checkWtypeIsOU(server_wtype) && server_wtype != "W3")
                                if (util_game.checkWtypeIsR(server_wtype)) {
                                    var _abs = "";
                                    var chose = server_type;
                                    if (chose == "N")
                                        chose = "H";
                                    if (ratioR != 0)
                                        if (strong == chose)
                                            _abs = "-";
                                        else
                                            _abs = "+";
                                    _mc["bet_finish_chose_con"].innerHTML = _abs + util.showTxt(ratioR);
                                    _mc["bet_finish_chose_con"].style.display = ""
                                } else {
                                    _mc["bet_finish_chose_con"].innerHTML = "";
                                    _mc["bet_finish_chose_con"].style.display = "none"
                                }
                            else {
                                var _abs = "";
                                if (_self.paramHash["keepwtype"] == "W3") {
                                    var chose = server_type;
                                    if (chose == "N")
                                        chose = "H";
                                    if (strong == chose)
                                        _abs = "-";
                                    else
                                        _abs = "+"
                                }
                                _mc["bet_finish_chose_con"].innerHTML = _abs + util.showTxt(ratioR);
                                _mc["bet_finish_chose_con"].style.display = ""
                            }
                            var bet_wtype = util_game.chgTwtype(server_wtype, server_rtype);
                            var tmp_ior = util.showTxt(util_game.getIoratio(xmlnode.Node(xmlnode.Root[0], "ioratio").innerHTML, null, bet_wtype));
                            var tmp_gold = xmlnode.Node(xmlnode.Root[0], "gold").innerHTML;
                            var baseIorClass = util_game.checkIorClass(tmp_ior);
                            _mc["bet_finish_ior"].innerHTML = tmp_ior;
                            _mc["bet_finish_ior"].className = baseIorClass;
                            _mc["bet_finish_gold"].innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(tmp_gold)));
                            _mc["bet_finish_win_gold"].innerHTML = util.showTxt(util.formatThousand(util_game.calcWindGold(tmp_gold, tmp_ior, server_wtype, server_gtype)));
                            var nowCredit = xmlnode.Node(xmlnode.Root[0], "nowcredit").innerHTML;
                            top["userData"].maxcredit = nowCredit;
                            if (top["orderinfo"]["date"] == "yesterday")
                                top["userData"].yesterdayCredit = nowCredit;
                            parentClass.dispatchEvent("clearOVTimer", {});
                            parentClass.dispatchEvent("bettingMask", false);
                            _self.delayFinish();
                            _self.lockFastScroll();
                            parentClass.dispatchEvent("reloadCredit", nowCredit);
                            parentClass.dispatchEvent("setBottomon", {});
                            top["wagers_oldTS"] = 0;
                            var wagersParam = util.getWagersParam(xmlnode, _mc, wagersInfo);
                            if (typeof util.transTodayWagers == "function")
                                util.transTodayWagers(wagersParam, LS_game)
                        } else {
                            xmdObj["errormsg"] = xmlnode.Node(xmlnode.Root[0], "errormsg");
                            var msg = xmdObj["errormsg"].innerHTML;
                            if (xmdObj["code"].innerHTML == "570") {
                                msg = "betError016";
                                tid = xmlnode.Node(xmlnode.Root[0], "ticket_id").innerHTML;
                                t_active = xmlnode.Node(xmlnode.Root[0], "active").innerHTML;
                                _self.paramHash["delayTS"] = xmlnode.Node(xmlnode.Root[0], "timestamp").innerHTML;
                                if (timerHash["delay_timer"] == null) {
                                    timerHash["delay_timer"] = new Timer(config_set.get("CONFIG_DELAY_TIME"),1);
                                    timerHash["delay_timer"].setParentclass(_self);
                                    timerHash["delay_timer"].init()
                                }
                                timerHash["delay_timer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.delay_bet);
                                timerHash["delay_timer"].startTimer();
                                parentClass.dispatchEvent("showDelayLoading", true);
                                return
                            } else {
                                parentClass.dispatchEvent("clearOVTimer", {});
                                parentClass.dispatchEvent("createOVTimer", {})
                            }
                            var tmp = "";
                            var org = "";
                            if (msg == "1X020" || msg == "1X019") {
                                tmp = util.formatThousand(xmlnode.Node(xmlnode.Root[0], "errorvalue").innerHTML);
                                org = "max"
                            }
                            if (util_game.isOverSingleCredit(msg) || util_game.isLessSingleCredit(msg))
                                tmp = LS.get(top["userData"].currency) + " " + util.formatThousand(xmlnode.Node(xmlnode.Root[0], "errorvalue").innerHTML * 1);
                            if (msg == "1X017") {
                                msg = "error_mem_max";
                                tmp = util.formatThousand(xmlnode.Node(xmlnode.Root[0], "errorvalue").innerHTML * 1);
                                org = "error_mem_max1"
                            }
                            parentClass.dispatchEvent("setIsFromBet", true);
                            parentClass.dispatchEvent("setSingleErrorCode", msg);
                            parentClass.setSingleErrorMsg(msg, tmp, org);
                            if (!util_game.onlyOrderLevel(msg))
                                parentClass.dispatchEvent("showSingleErrorMsg", true);
                            if (msg == "1X001")
                                parentClass.dispatchEvent("fastCalcEvent", false);
                            parentClass.dispatchEvent("orderView", {});
                            parentClass.dispatchEvent("bettingMask", false);
                            parentClass.dispatchEvent("showOrderMsg", true);
                            top["betting"] = false
                        }
                    } catch (e) {
                        console.log(e)
                    }
                    top["betting"] = false
                }
                ;
                _self.lockFastScroll = function() {
                    util.addEvent(_mc["bet_show"], "touchstart", _self.touchstartEvent);
                    try {
                        util.addEvent(_mc["bet_show"], "touchmove", _self.preventScroll)
                    } catch (e) {
                        console.log(e)
                    }
                }
                ;
                _self.touchstartEvent = function(e) {
                    startTouchY = e.touches[0].clientY;
                    if (e.touches.length > 1)
                        e.preventDefault()
                }
                ;
                _self.preventScroll = function(e) {
                    var nowTouchY = e.touches[0].clientY;
                    if (startTouchY < nowTouchY - fixY || startTouchY > nowTouchY + fixY) {
                        e.stopPropagation();
                        e.preventDefault()
                    }
                }
                ;
                _self.SelectBetClose = function() {
                    if (top["bet_select_more"] != null) {
                        tmp_bet_select_more = top["bet_select_more"];
                        for (var key in top["bet_select_more"]) {
                            var tmpObj_more = dom.getElementById(tmp_bet_select_more[key]);
                            top["bet_select_more"] = new Object;
                            if (tmpObj_more != null) {
                                util.removeClass(tmpObj_more, "on");
                                util.removeClass(tmpObj_more, "odd_chg")
                            }
                        }
                    }
                    for (var key in top["bet_select"]) {
                        tmp_bet_select = top["bet_select"];
                        var tmp = top["bet_select"][key].split("_");
                        if (tmp[3].match("RF")) {
                            var chose_team = tmp[3].substr(tmp[3].length - 1, 1);
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"][key] && top["transWtype"][key][tmpWtype])
                                if (tmpWtype == top["transWtype"][key][tmpWtype])
                                    tmp[3] = chose_team == "H" ? "RFH" : "RFC"
                        }
                        if (tmp[3].match(/^(RGA)[A-E][0-5][0-9](Y|N)$/g)) {
                            var chose_team = tmp[3].substr(tmp[3].length - 1, 1);
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"][key] && top["transWtype"][key][tmpWtype])
                                if (tmpWtype == top["transWtype"][key][tmpWtype])
                                    tmp[3] = chose_team == "Y" ? "RGAY" : "RGAN"
                        }
                        if (tmp[3].match(/^(RPTW)[A-E][0-5][0-9](H|C)$/g)) {
                            var chose_team = tmp[3].substr(tmp[3].length - 1, 1);
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"][key] && top["transWtype"][key][tmpWtype])
                                if (tmpWtype == top["transWtype"][key][tmpWtype])
                                    tmp[3] = chose_team == "H" ? "RPTWH" : "RPTWC"
                        }
                        if (tmp[3].match(/^(RWXP)[A-E][0-1](0|5)(H|C)$/g)) {
                            var chose_team = tmp[3].substr(tmp[3].length - 1, 1);
                            var tmpWtype = tmp[3].substr(0, tmp[3].length - 1);
                            if (top["transWtype"] && top["transWtype"][key] && top["transWtype"][key][tmpWtype])
                                if (tmpWtype == top["transWtype"][key][tmpWtype])
                                    tmp[3] = chose_team == "H" ? "RWXPH" : "RWXPC"
                        }
                        var targetName = tmp[0] + "_" + tmp[1] + "_" + tmp[2] + "_" + tmp[3];
                        var tmpObj = dom.getElementById(targetName);
                        var OBTobj = dom.getElementById("OBT_" + targetName);
                        top["bet_select"] = new Object;
                        if (OBTobj != null) {
                            util.removeClass(OBTobj, "on");
                            util.removeClass(OBTobj, "odd_chg")
                        }
                        if (tmpObj != null) {
                            util.removeClass(tmpObj, "on");
                            util.removeClass(tmpObj, "odd_chg")
                        }
                    }
                }
                ;
                _self.reBet = function(mouseClick, tarObj) {
                    top["bet_select"] = tmp_bet_select;
                    top["bet_select_more"] = tmp_bet_select_more;
                    parentClass.dispatchEvent("reBet", {})
                }
                ;
                _self.createbetholdTimer = function(tid) {
                    if (tid == 0)
                        return;
                    uni_key = util_game.getTimestamp();
                    if (!util.in_object(uni_key, top["betholdTid_hash"]))
                        top["betholdTid_hash"][uni_key] = tid;
                    if (!util.in_object(uni_key, top["betholdstatus_hash"]))
                        top["betholdstatus_hash"][uni_key] = "isReceipt";
                    for (var _key in top["betholdstatus_hash"])
                        if (timerHash["betholdTimer_" + _key] != null) {
                            top["betholdstatus_hash"][_key] = "isToast";
                            timerHash["betholdTimer_" + _key]._status = "isToast"
                        }
                    bethold_tid = tid;
                    if (timerHash["betholdTimer_" + uni_key] != null)
                        return;
                    timerHash["betholdTimer_" + uni_key] = new Timer(config_set.get("CONFIG_BETHOLD"));
                    timerHash["betholdTimer_" + uni_key].setParentclass(_self);
                    timerHash["betholdTimer_" + uni_key].init();
                    timerHash["betholdTimer_" + uni_key].dont_clear = true;
                    timerHash["betholdTimer_" + uni_key]._status = "isReceipt";
                    timerHash["betholdTimer_" + uni_key].addEventListener("TimerEvent.TIMER", _self.betholdTimerRun);
                    timerHash["betholdTimer_" + uni_key].addEventListener("TimerEvent.TIMER_COMPLETE", _self.betholdTimerFinish);
                    timerHash["betholdTimer_" + uni_key].startTimer()
                }
                ;
                _self.clearbetholdTimer = function(xml_key) {
                    if (xml_key == "all") {
                        for (var _key in top["betholdTid_hash"])
                            if (timerHash["betholdTimer_" + _key] != null) {
                                timerHash["betholdTimer_" + _key].clearObj();
                                timerHash["betholdTimer_" + _key] = null
                            }
                        return true
                    }
                    if (timerHash["betholdTimer_" + xml_key] != null) {
                        timerHash["betholdTimer_" + xml_key].clearObj();
                        timerHash["betholdTimer_" + xml_key] = null
                    }
                    bethold_tid = 0;
                    return true
                }
                ;
                _self.betholdTimerRun = function(count) {
                    _self.checkbethold()
                }
                ;
                _self.checkbethold = function() {
                    var urlParams = "";
                    urlParams += "type=xml";
                    urlParams += "&from=bet";
                    urlParams += "&tid=" + bethold_tid;
                    urlParams += "&uni_key=" + uni_key;
                    urlParams = "p=get_bethold&" + top.param + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.checkbetholdFinish);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.checkbetholdFinish = function(xml) {
                    var xmlnode = util.parseXml(xml);
                    var tickets = xmlnode.Node(xmlnode.Root[0], "tickets");
                    var xml_key = xmlnode.Node(xmlnode.Root[0], "uni_key").innerHTML;
                    var ticket = xmlnode.Node(tickets, "ticket", false);
                    if (ticket[bethold_tid] != null) {
                        var _status = util.showTxt(ticket[bethold_tid].innerHTML);
                        _self.chgbetholdstatus(xml_key, _status)
                    }
                }
                ;
                _self.chgbetholdstatus = function(xml_key, _status) {
                    if (top["openBets"]) {
                        var str_sty = "";
                        var str_code = "";
                        switch (_status) {
                        case "A":
                            str_sty = "status_word word_green";
                            body_sty = "bg_green";
                            str_code = "bet_success";
                            _self.clearbetholdTimer(xml_key);
                            break;
                        case "V":
                            str_sty = "status_word word_red";
                            body_sty = "bg_red";
                            str_code = "bet_rejected";
                            if (top["betholdstatus_hash"][xml_key] == "isToast") {
                                parentClass.dispatchEvent("showAlertMsg", {
                                    "target": "message_pop_nobtn",
                                    "msg": LS_code.get("1more_rejected_toast"),
                                    "confirm": "N",
                                    "retFun": ""
                                });
                                for (var _key in top["betholdstatus_hash"])
                                    if (timerHash["betholdTimer_" + _key] != null && timerHash["betholdTimer_" + _key]._status == "isToast") {
                                        timerHash["betholdTimer_" + _key].clearObj();
                                        timerHash["betholdTimer_" + _key] = null
                                    }
                                return
                            } else if (top["betholdstatus_hash"][xml_key] == "isReceipt" && top["isOrderView"]) {
                                parentClass.dispatchEvent("showAlertMsg", {
                                    "target": "message_pop_nobtn",
                                    "msg": LS_code.get("1more_rejected_toast"),
                                    "confirm": "N",
                                    "retFun": ""
                                });
                                _self.clearbetholdTimer(xml_key)
                            } else
                                _self.clearbetholdTimer(xml_key);
                            if (_self.paramHash["gameDateStr"] == "yesterday" && top.userData.pay_type == 0)
                                parentClass.dispatchEvent("reloadCredit", top.userData.yesterdayCredit);
                            else
                                parentClass.dispatchEvent("reloadCredit");
                            break;
                        case "N":
                        default:
                            str_sty = "status_word word_yellow";
                            body_sty = "bg_yellow";
                            str_code = "bet_pending";
                            break
                        }
                        _mc["bet_finish_bethold"].className = str_sty;
                        _mc["orderMsg_div"].className = "ord_msg ord_levelmsg " + body_sty;
                        var msgli = document.createElement("li");
                        msgli.innerHTML = util.showTxt(LS_code.get(str_code));
                        _mc["orderMsg"].innerHTML = "";
                        _mc["orderMsg"].appendChild(msgli)
                    } else
                        switch (_status) {
                        case "V":
                            parentClass.dispatchEvent("showAlertMsg", {
                                "target": "message_pop_nobtn",
                                "msg": LS_code.get("1more_rejected_toast"),
                                "confirm": "N",
                                "retFun": ""
                            });
                            _self.clearbetholdTimer("all");
                            if (_self.paramHash["gameDateStr"] == "yesterday" && top.userData.pay_type == 0)
                                parentClass.dispatchEvent("reloadCredit", top.userData.yesterdayCredit);
                            else
                                parentClass.dispatchEvent("reloadCredit");
                            break;
                        case "A":
                            _self.clearbetholdTimer(xml_key);
                            break;
                        case "N":
                        default:
                            break
                        }
                }
            }
            ;