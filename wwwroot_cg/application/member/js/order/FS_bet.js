function FS_bet(_win, _dom) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var parentClass;
                var classname = "FS_bet.js";
                var timerHash;
                var config_set;
                var _mc = new Object;
                var util = new win.Util(win,dom);
                var util_game = new win.Util_game(win,dom);
                var startTouchY = 0;
                var fixY = 5;
                var tmp_bet_select = new Object;
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
                    var keys = _self.paramHash["gtype"] + "_" + _self.paramHash["gid"] + "_" + _self.paramHash["keepwtype"].toUpperCase() + "_" + _self.paramHash["rtype"].toUpperCase();
                    top["betHash"][keys] = new Object;
                    top["betHash"][keys].gid = _self.paramHash["gid"];
                    top["betHash"][keys].gtype = _self.paramHash["gtype"];
                    top["betHash"][keys].wtype = _self.paramHash["keepwtype"].toUpperCase();
                    top["betHash"][keys].rtype = _self.paramHash["rtype"].toUpperCase();
                    top["betHash"][keys].showtype = _self.paramHash["showtype"];
                    var urlParams = "";
                    urlParams += "odd_f_type=" + top["userData"].odd_f_type;
                    urlParams += "&golds=" + _self.paramHash["golds"];
                    urlParams += "&gid=" + _self.paramHash["gid"];
                    urlParams += "&gtype=" + _self.paramHash["gtype"];
                    urlParams += "&wtype=" + _self.paramHash["keepwtype"].toUpperCase();
                    urlParams += "&rtype=" + _self.paramHash["rtype"].toUpperCase();
                    urlParams += "&ioratio=" + _self.paramHash["ioratio"];
                    urlParams += "&autoOdd=" + _self.paramHash["autoOdd"];
                    urlParams += "&timestamp=" + util_game.getTimestamp();
                    urlParams += "&timestamp2=" + _self.paramHash["orderviewTS"];
                    urlParams += "&f=1" + _self.paramHash["f"];
                    urlParams = "p=FS_bet&" + top.param + "&" + urlParams;
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
                _self.betFinish = function(xml) {
                    var xmdObj = new Object;
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
                            _mc["bet_finish_dg"] = document.getElementById("bet_finish_dg");
                            _mc["bet_finish_teamData"] = document.getElementById("bet_finish_teamData");
                            _mc["div_lastBetOption"] = document.getElementById("div_lastBetOption");
                            _mc["div_lastBetOption_txt"] = document.getElementById("div_lastBetOption_txt");
                            _mc["orderMsg_div"] = document.getElementById("orderMsg_div");
                            _mc["orderMsg"] = document.getElementById("orderMsg");
                            _self.SelectBetClose();
                            _mc["bet_finish_teamData"].style.display = "none";
                            _mc["div_lastBetOption_txt"].innerHTML = LS.get("lastBetOption_fast");
                            util.addEvent(_mc["div_lastBetOption"], "click", _self.reBet, _mc["div_lastBetOption"]);
                            var server_gid = xmlnode.Node(xmlnode.Root[0], "gid").innerHTML;
                            var server_gtype = xmlnode.Node(xmlnode.Root[0], "gtype").innerHTML;
                            var server_wtype = xmlnode.Node(xmlnode.Root[0], "wtype").innerHTML;
                            var server_rtype = xmlnode.Node(xmlnode.Root[0], "rtype").innerHTML;
                            var keys = server_gtype + "_" + server_gid + "_" + server_wtype + "_" + server_rtype;
                            if (top["betHash"][keys] == null)
                                return;
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
                            getMenuHash.ms = "";
                            getMenuHash.team_h = "";
                            getMenuHash.team_c = "";
                            getMenuHash.imp = "";
                            getMenuHash.ptype = "";
                            var wagersInfo = util_game.get_wtype_name(LS_game, getMenuHash.gid, getMenuHash.showtype, getMenuHash.gtype, getMenuHash.wtype, getMenuHash.rtype, getMenuHash.ms, getMenuHash.team_h, getMenuHash.team_c, getMenuHash.imp, getMenuHash.ptype);
                            var FTmenutype = wagersInfo["menutype"];
                            _mc["bet_finish_tid"].innerHTML = util.showTxt(util_game.getTicketType(server_wtype)) + util.showTxt(xmlnode.Node(xmlnode.Root[0], "ticket_id").innerHTML);
                            _mc["bet_finish_menutype"].innerHTML = util.showTxt(FTmenutype);
                            _mc["bet_finish_score"].style.display = "none";
                            var rtypename = "";
                            var _subTitle = xmlnode.Node(xmlnode.Root[0], "teamname").innerHTML;
                            var _subPlayType = xmlnode.Node(xmlnode.Root[0], "stype_name").innerHTML;
                            if (_self.paramHash["bet_now"] == "FS")
                                rtypename = util.showTxt(_subTitle);
                            else if (_self.paramHash["bet_now"] == "SFS")
                                rtypename = util.showTxt(_subTitle) + " " + util.showTxt(_subPlayType);
                            var tmp_league = xmlnode.Node(xmlnode.Root[0], "league").innerHTML + " " + rtypename;
                            _mc["bet_finish_league"].innerHTML = util.showTxt(tmp_league);
                            wagersInfo["league"] = xmlnode.Node(xmlnode.Root[0], "league").innerHTML + " - " + rtypename;
                            try {
                                _mc["orderMsg_div"].style.display = "";
                                _mc["orderMsg_div"].className = "ord_msg ord_levelmsg bg_green";
                                var msgli = document.createElement("li");
                                msgli.innerHTML = LS_code.get("bet_success");
                                _mc["orderMsg"].appendChild(msgli);
                                _mc["bet_finish_dg"].className = "status_word word_green"
                            } catch (e) {
                                console.log(e)
                            }
                            _mc["bet_finish_chose_team"].innerHTML = util.showTxt(xmlnode.Node(xmlnode.Root[0], "rtype_name").innerHTML);
                            _mc["bet_finish_chose_con"].style.display = "none";
                            var tmp_ior = util.showTxt(util_game.getIoratio(xmlnode.Node(xmlnode.Root[0], "ioratio").innerHTML, null, "FS"));
                            var tmp_gold = xmlnode.Node(xmlnode.Root[0], "gold").innerHTML;
                            var baseIorClass = util_game.checkIorClass(tmp_ior);
                            _mc["bet_finish_ior"].innerHTML = tmp_ior;
                            _mc["bet_finish_ior"].className = baseIorClass;
                            _mc["bet_finish_gold"].innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(tmp_gold)));
                            _mc["bet_finish_win_gold"].innerHTML = util.showTxt(util.formatThousand(util_game.calcWindGold(tmp_gold, tmp_ior, server_wtype, server_gtype)));
                            var nowCredit = xmlnode.Node(xmlnode.Root[0], "nowcredit").innerHTML;
                            top["userData"].maxcredit = nowCredit;
                            parentClass.dispatchEvent("reloadCredit", nowCredit);
                            parentClass.dispatchEvent("setBottomon", {});
                            parentClass.dispatchEvent("clearOVTimer", {});
                            parentClass.dispatchEvent("bettingMask", false);
                            _self.lockFastScroll();
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
                            parentClass.dispatchEvent("showOrderMsg", true)
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
                _self.SelectBetClose = function() {
                    for (var key in top["bet_select"]) {
                        tmp_bet_select = top["bet_select"];
                        var tmpObj = dom.getElementById(top["bet_select"][key]);
                        var cupObj = dom.getElementById("cup_" + top["bet_select"][key]);
                        var groupObj = dom.getElementById("group_" + top["bet_select"][key]);
                        top["bet_select"] = new Object;
                        if (tmpObj != null) {
                            util.removeClass(tmpObj, "on");
                            util.removeClass(tmpObj, "odd_chg")
                        }
                        if (cupObj != null) {
                            util.removeClass(cupObj, "on");
                            util.removeClass(cupObj, "odd_chg")
                        }
                        if (groupObj != null) {
                            util.removeClass(groupObj, "on");
                            util.removeClass(groupObj, "odd_chg")
                        }
                    }
                }
                ;
                _self.reBet = function(mouseClick, tarObj) {
                    top["bet_select"] = tmp_bet_select;
                    parentClass.dispatchEvent("reBet", {})
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
            }
            ;