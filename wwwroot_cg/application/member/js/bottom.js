function bottom(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var eventHandler = new Object;
                var util = new win.Util(win,dom);
                var LS_code;
                var control = new Array("menu_sport","menu_tv","menu_betslip","menu_myGame","menu_todaywagers");
                var _mc = new Object;
                var timerObj = new Object;
                var tag = "\u2022";
                var config_set;
                var addAnimation = null;
                var act = "";
                var firstLoad = false;
                _self.paramHash = new Object;
                var classname = "bottom";
                var myhash = {};
                var savechk = "";
                var noRunCash = false;
                var myGameTotalCount = 0;
                var Ary = new Array;
                var lastTotalBet = 0;
                var oldCredit = "";
                var count = 0;
                var addBetSlip = false;
                _self.init = function() {
                    _mc["menu_sport"] = dom.getElementById("menu_sport");
                    _mc["menu_tv"] = dom.getElementById("menu_tv");
                    _mc["menu_betslip"] = dom.getElementById("menu_betslip");
                    _mc["menu_history"] = dom.getElementById("menu_history");
                    _mc["menu_todaywagers"] = dom.getElementById("menu_todaywagers");
                    _mc["menu_myGame"] = dom.getElementById("menu_myGame");
                    _mc["wager_count"] = dom.getElementById("wager_count");
                    _mc["bet_select_count"] = dom.getElementById("bet_select_count");
                    _mc["bet_select_ior"] = dom.getElementById("bet_select_ior");
                    _mc["menu_myGame_dot"] = dom.getElementById("menu_myGame_dot");
                    _mc["menu_acc_page"] = dom.getElementById("menu_acc_page");
                    _mc["menu_acc_credit"] = dom.getElementById("menu_acc_credit");
                    _mc["menu_myGame_num"] = dom.getElementById("menu_myGame_num");
                    _mc["menu_todaywagers"] = dom.getElementById("menu_todaywagers");
                    if (_mc["menu_sport"])
                        _mc["menu_sport"].url = "home";
                    if (_mc["menu_tv"])
                        _mc["menu_tv"].url = "list_tv";
                    if (_mc["menu_myGame"])
                        _mc["menu_myGame"].url = "mygame";
                    if (_mc["menu_todaywagers"])
                        _mc["menu_todaywagers"].url = "today_wagers";
                    util.addEvent(_mc["menu_sport"], "click", _self.chgPage, _mc["menu_sport"]);
                    util.addEvent(_mc["menu_tv"], "click", _self.chgPage, _mc["menu_tv"]);
                    util.addEvent(_mc["menu_betslip"], "click", _self.showBetSlip, _mc["menu_betslip"]);
                    util.addEvent(_mc["menu_history"], "click", _self.chgPage, _mc["menu_history"]);
                    util.addEvent(_mc["menu_todaywagers"], "click", _self.chgPage, _mc["menu_todaywagers"]);
                    util.addEvent(_mc["menu_myGame"], "click", _self.chgPage, _mc["menu_myGame"]);
                    util.addEvent(_mc["menu_acc_page"], "click", _self.showRightPanel);
                    if (top.impchk == "Y" || top.perchk == "Y")
                        _self.messg(top.impchk, top.perchk);
                    if (!firstLoad) {
                        myGameTotalCount = util.getMyGameTotalCount("all");
                        if (myGameTotalCount * 1 > 99)
                            myGameTotalCount = "99+";
                        _mc["menu_myGame_num"].innerHTML = myGameTotalCount == 0 ? "" : myGameTotalCount;
                        oldCredit = top["userData"].maxcredit;
                        parentClass.dispatchEvent("checkCount", {});
                        firstLoad = true
                    }
                }
                ;
                _self.showRightPanel = function() {
                    parentClass.dispatchEvent("showRightPanel")
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
							var tmpCredit = 0;
							if (oldCredit) {
								tmpCredit = oldCredit.replace(/[,]+/g, "");
							}
                            
                            savechk = util.showTxt(parseFloat(tmpCredit));
                            tmpObj = {
                                "savechk": savechk,
                                "maxcredit": parseFloat(top["userData"].maxcredit),
                                "currency": "",
                                "credit": _mc["menu_acc_credit"],
                                "money": "menu_acc_page",
                                "Ary": Ary,
                                "count": count,
                                "removeFun": _self.removeMoneyCss
                            };
                            returnObj = util.chgCreditAnimation(tmpObj);
                            Ary = returnObj["Ary"];
                            count = returnObj["count"]
                        } else {
                            noRunCash = false;
                            var _maxcredit = util.trans_thousand(top["userData"].maxcredit);
                            if (top["userData"].maxcredit * 1 > 99999 && top["userData"].maxcredit * 1 <= 999999999)
                                _maxcredit = util.transThousand(Math.floor(top["userData"].maxcredit), 0);
                            else if (top["userData"].maxcredit * 1 > 999999999)
                                _maxcredit = "\u2022\u2022\u2022\u2022\u2022";
                            _mc["menu_acc_credit"].innerHTML = _maxcredit
                        }
                        oldCredit = top["userData"].maxcredit
                    }
                }
                ;
				
                _self.hideCash = function() {
                    if (top.showCredit)
                        noRunCash = true;
                    else {
                        noRunCash = false;
                        _mc["menu_acc_credit"].innerHTML = "\u2022\u2022\u2022\u2022\u2022"
                    }
                }
                ;
                _self.chgPage = function(e, tarObj) {
                    top.specialClick = "";
                    top.BackTag = "N";
                    var nowTS = util.getTimestamp();
                    top["lastClickTS"] = nowTS;
                    var _param = new Object;
                    _param.page = tarObj.url;
                    _param.retFun = _self.changePageComplete;
                    _param.nowTS = nowTS;
                    if (tarObj.url == "home")
                        if (top["lastSportAll"].page != "home") {
                            top["lastSportAll"].back = "N";
                            top["lastSportAll"].nowTS = nowTS;
                            top["lastSportAll"].postHash.nowTS = nowTS;
                            var tmp_showtype = top["lastSportAll"].showtype;
                            if (top["lastSportAll"].postHash.specialClick == "special") {
                                top.specialClick = "special";
                                tmp_showtype = "special"
                            }
                            if (top["lastSportAll"].isMyGame == "Y")
                                tmp_showtype = "mygame";
                            parentClass.dispatchEvent("chgHeadCss", {
                                "showtype": tmp_showtype
                            });
                            _param = top["lastSportAll"]
                        } else
                            parentClass.dispatchEvent("SerrefreshPage");
                    if (tarObj.url == "mygame")
                        parentClass.dispatchEvent("goToMygame", {});
                    else {
                        _self.chgBottomCss(tarObj.id);
                        parentClass.dispatchEvent("bodyGoToPage", _param)
                    }
                }
                ;
                _self.chgBottomCss = function(_id) {
                    var lastIsMyGame = top["lastSportAll"].isMyGame == "Y" || top["lastSportAll"].showtype == "mygame" ? "Y" : "N";
                    if (_id)
                        for (var i = 0; i < control.length; i++)
                            util.removeClass(_mc[control[i]], "on");
                    switch (_id) {
                    case "list_tv":
                        _id = "menu_tv";
                        break;
                    case "mygame":
                        _id = "menu_myGame";
                        util.addClass(_mc["menu_sport"], "on");
                        break;
                    case "history_data":
                    case "history_view":
                    case "credit_logs":
                    case "today_wagers":
                        _id = "menu_todaywagers";
                        break
                    }
                    if (lastIsMyGame == "Y" && _id == "menu_sport")
                        util.addClass(_mc["menu_myGame"], "on");
                    if (_mc[_id])
                        util.addClass(_mc[_id], "on")
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    config_set = parentClass.getThis("config_set");
                    timerHash = parentClass.getThis("timerHash");
                    LS = parentClass.getThis("LS")
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
                _self.showBetSlip = function(mouseEvent, targetObj) {
                    var orientation = util.getRotation();
                    var isRotated = orientation == 90;
                    if (isRotated && top["openBets"])
                        return;
                    top.betMode = "total";
                    parentClass.dispatchEvent("showNowCredit", {
                        "isShow": true
                    });
                    parentClass.dispatchEvent("showBetSlip", {
                        "isShow": true
                    })
                }
                ;
                _self.setTodayWagersCount = function(num) {
					if (!num) {
						num = 0;
					}
                    _mc["wager_count"].style.display = "";
                    util.removeClass(_mc["wager_count"], "on");
					var tznum = num * 1 > 99 ? "99+" : num * 1;
					if (!tznum) {
						tznum = 0;
					}
                    _mc["wager_count"].innerHTML = tznum;
                    if (num * 1 > 0) {
                        util.addClass(_mc["menu_todaywagers"], "wager_exist");
                        util.addClass(_mc["wager_count"], "on");
                        if (num * 1 > lastTotalBet * 1)
                            util.setTimeoutClass("menu_todaywagers", "wager_add", "add", _self.removeBetClass, 700)
                    } else
                        util.removeClass(_mc["menu_todaywagers"], "wager_exist");
                    lastTotalBet = num
                }
                ;
                _self.removeBetClass = function() {
                    util.removeClass(_mc["menu_todaywagers"], "wager_add")
                }
                ;
                _self.setBetSelectCount = function(_count) {
                    if (_count * 1 > 0)
                        util.addClass(_mc["menu_betslip"], "betslip_exist");
                    else
                        util.removeClass(_mc["menu_betslip"], "betslip_exist");
                    var old_count = _mc["bet_select_count"].innerHTML;
                    if (_count * 1 > old_count * 1)
                        if (old_count * 1 == 0)
                            util.setTimeoutClass("menu_betslip", "betslip_add", "add", _self.removeBetSelectAddClass, 600);
                        else
                            addBetSlip = true;
                    _mc["bet_select_count"].innerHTML = util.showTxt(_count)
                }
                ;
                _self.setBetSelectIor = function(_ior) {
                    util.removeClass(_mc["menu_betslip"], "betslip_loop");
                    if (_ior != LS.get("betslip_txt")) {
                        setTimeout(_self.addBetSelectLoopClass, 300);
                        _mc["bet_select_ior"].innerHTML = util.showTxt(_ior);
                        top["mini_bet_ior"] = _ior
                    } else
                        _mc["bet_select_ior"].innerHTML = "";
                    console.log("=======> [setBetSelectIor][addBetSlip:" + addBetSlip + "]");
                    if (addBetSlip) {
                        util.addClass(_mc["menu_betslip"], "betslip_add");
                        addBetSlip = false
                    }
                    setTimeout(_self.removeBetSelectAddClass, 600)
                }
                ;
                _self.addAnimation = function() {
                    clearTimeout(addAnimation);
                    util.removeClass(_mc["menu_myGame"], "mygame_ani0");
                    util.removeClass(_mc["menu_myGame"], "mygame_ani");
                    setTimeout(_self.delayAdd, 50)
                }
                ;
                _self.delayAdd = function() {
                    act = "add";
                    var _myGameTotalCount = top.choice_showtype == "mygame" ? myGameTotalCount : util.getMyGameTotalCount("all");
                    if (_myGameTotalCount == 1) {
                        util.addClass(_mc["menu_myGame"], "mygame_ani0");
                        _mc["menu_myGame_num"].innerHTML = _myGameTotalCount
                    } else {
                        util.addClass(_mc["menu_myGame"], "mygame_ani");
                        if (_myGameTotalCount * 1 > 99)
                            _myGameTotalCount = "99+";
                        _mc["menu_myGame_num"].innerHTML = _myGameTotalCount
                    }
                    addAnimation = setTimeout(_self.removeMyEventsClass, 700, act)
                }
                ;
                _self.removeAnimation = function() {
                    clearTimeout(addAnimation);
                    util.removeClass(_mc["menu_myGame"], "mygame_ani0");
                    util.removeClass(_mc["menu_myGame"], "mygame_ani");
                    setTimeout(_self.delayRemove, 50)
                }
                ;
                _self.delayRemove = function() {
                    act = "remove";
                    var _myGameTotalCount = top.choice_showtype == "mygame" ? myGameTotalCount : util.getMyGameTotalCount("all");
                    if (_myGameTotalCount == 0)
                        _mc["menu_myGame_num"].innerHTML = "";
                    else {
                        if (_myGameTotalCount * 1 > 99)
                            _myGameTotalCount = "99+";
                        _mc["menu_myGame_num"].innerHTML = _myGameTotalCount
                    }
                }
                ;
                _self.removeMyEventsClass = function(action) {
                    if (action == "add") {
                        util.removeClass(_mc["menu_myGame"], "mygame_ani0");
                        util.removeClass(_mc["menu_myGame"], "mygame_ani")
                    }
                }
                ;
                _self.showGreenBtn = function(show) {
                    if (!show)
                        util.removeClass(_mc["menu_myGame_dot"], "on");
                    else
                        util.addClass(_mc["menu_myGame_dot"], "on")
                }
                ;
                _self.showMyGame = function(show) {
                    if (!show) {
                        util.addClass(_mc["menu_myGame"], "mygame_off");
                        _mc["menu_myGame_num"].innerHTML = ""
                    } else {
                        util.removeClass(_mc["menu_myGame"], "mygame_off");
                        myGameTotalCount = util.getMyGameTotalCount("all");
                        if (myGameTotalCount * 1 > 99)
                            myGameTotalCount = "99+";
                        _mc["menu_myGame_num"].innerHTML = myGameTotalCount == 0 ? "" : myGameTotalCount
                    }
                }
                ;
                _self.removeBetSelectAddClass = function() {
                    util.removeClass(_mc["menu_betslip"], "betslip_add")
                }
                ;
                _self.addBetSelectLoopClass = function() {
                    util.addClass(_mc["menu_betslip"], "betslip_loop")
                }
                ;
                _self.removeMoneyCss = function() {
                    util.removeClass(_mc["menu_acc_page"], "ani_credit_add")
                }
                ;
                _self.messg = function(msgImpchk, msgPerchk) {
                    if (msgImpchk == "Y" || msgPerchk == "Y")
                        dom.getElementById("menu_myAcc_new").className = "dot_red on";
                    else
                        dom.getElementById("menu_myAcc_new").className = "dot_red"
                }
                ;
                _self.myGamePageCount = function(count) {
                    myGameTotalCount = count;
                    _self.delayRemove()
                }
            }
            ;