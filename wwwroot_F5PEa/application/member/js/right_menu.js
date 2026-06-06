 function right_menu(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var eventHandler = new Object;
                var util = new win.Util(win,dom);
                var _mc = new Object;
                var config_set;
                var CookieManager = new win.CookieManager;
                var odds_ary = new Array("H","M","I","E");
                var langx_ary = new Array("zh-cn","zh-tw","en-us");
                var timetype_ary = new Array("sysTime","devTime");
                var _count = 0;
                var Ary = new Array;
                var savechk = "";
                var firstLoad = false;
                var chg_lang_sw = "Y";
                var chg_odds_sw = "Y";
                var chg_timetype_sw = "Y";
                var ver_ary = "";
                var classname = "right_menu";
                var myhash = {};
                var noRunCash = false;
                var oldCredit = "";
                _self.paramHash = new Object;
                _self.init = function() {
                    top.showCredit = true;
                    _mc["right_creditlogs"] = dom.getElementById("right_creditlogs");
                    _mc["rightM_result"] = dom.getElementById("rightM_result");
                    _mc["rightM_result"].style.display = "";
                    _mc["selec_oddstype"] = dom.getElementById("selec_oddstype");
                    _mc["selec_language"] = dom.getElementById("selec_language");
                    _mc["selec_timetype"] = dom.getElementById("selec_timetype");
                    _mc["odds_dropdown"] = dom.getElementById("odds_dropdown");
                    _mc["langx_dropdown"] = dom.getElementById("langx_dropdown");
                    _mc["timetype_dropdown"] = dom.getElementById("timetype_dropdown");
                    _mc["acc_show_eye"] = dom.getElementById("acc_show_eye");
                    _mc["acc_currency"] = dom.getElementById("acc_currency");
                    _mc["acc_credit"] = dom.getElementById("acc_credit");
                    _mc["acc_money"] = dom.getElementById("acc_money");
                    _mc["acc_username"] = dom.getElementById("acc_username");
                    _mc["iorType_switch"] = dom.getElementById("iorType_switch");
                    _mc["iorType_set"] = dom.getElementById("iorType_set");
                    _mc["right_app"] = dom.getElementById("right_app");
                    _mc["right_tv"] = dom.getElementById("right_tv");
                    util.addEvent(_mc["acc_show_eye"], "click", _self.clickHideCash);
                    util.addEvent(_mc["rightM_result"], "click", _self.goToResult);
                    util.addEvent(dom.getElementById("right_message"), "click", _self.chgPage, {
                        "page": "message"
                    });
                    util.addEvent(dom.getElementById("rightM_history"), "click", _self.chgPage, {
                        "page": "history_data"
                    });
                    util.addEvent(_mc["right_creditlogs"], "click", _self.chgPage, {
                        "page": "credit_logs"
                    });
                    util.addEvent(dom.getElementById("right_help_change_pwd"), "click", _self.chgPage, {
                        "page": "help_change_pwd"
                    });
                    util.addEvent(dom.getElementById("right_account_set"), "click", _self.chgPage, {
                        "page": "account_set"
                    });
                    util.addEvent(dom.getElementById("right_help_4pwd_login"), "click", _self.chgPage, {
                        "page": "passcode"
                    });
                    util.addEvent(dom.getElementById("right_set_mail"), "click", _self.chgPage, {
                        "page": "help_set_mail"
                    });
                    util.addEvent(dom.getElementById("right_help_faq"), "click", _self.chgPage, {
                        "page": "help_faq"
                    });
                    util.addEvent(dom.getElementById("right_features_new"), "click", _self.chgPage, {
                        "page": "features"
                    });
                    util.addEvent(dom.getElementById("right_help_odds"), "click", _self.chgPage, {
                        "page": "help_odds"
                    });
                    util.addEvent(dom.getElementById("right_help_term"), "click", _self.chgPage, {
                        "page": "help_term"
                    });
                    util.addEvent(dom.getElementById("right_contactus"), "click", _self.chgPage, {
                        "page": "contactus"
                    });
                    util.addEvent(_mc["right_tv"], "click", _self.chgPage, {
                        "page": "list_tv"
                    });
                    util.addEvent(dom.getElementById("right_rules_general"), "click", _self.chgPage, {
                        "page": "rules_general"
                    });
                    util.addEvent(dom.getElementById("right_help_sys"), "click", _self.chgPage, {
                        "page": "help_sys"
                    });
                    util.addEvent(_mc["iorType_set"], "click", _self.setIorChgClick);
                    var iorChgSw = CookieManager.get("iorChgSw");
                    if (iorChgSw == "N")
                        _mc["iorType_set"].checked = false;
                    else
                        _mc["iorType_set"].checked = true;
                    util.addEvent(dom.getElementById("right_logout"), "click", _self.logout);
                    for (var odd = 0; odd < odds_ary.length; odd++)
                        util.addEvent(dom.getElementById(odds_ary[odd] + "_odds"), "click", _self.chgOdds, odds_ary[odd]);
                    for (var ls = 0; ls < langx_ary.length; ls++)
                        util.addEvent(dom.getElementById("pc_langx_" + langx_ary[ls]), "click", _self.choice, langx_ary[ls]);
                    for (var t = 0; t < timetype_ary.length; t++)
                        util.addEvent(dom.getElementById("selec_" + timetype_ary[t]), "click", _self.choiceTime, timetype_ary[t]);
                    top.newWinObj_result = null;
                    if (top.mobile != "Y") {
                        util.addEvent(dom.getElementById("chg_language"), "click", _self.chgLanguage);
                        util.addEvent(dom.getElementById("odds_type"), "click", _self.clickOddBtn);
                        util.addEvent(dom.getElementById("chg_timetype"), "click", _self.chgTimetype)
                    } else {
                        util.addEvent(_mc["langx_dropdown"], "change", _self.chgLangxHandler);
                        util.addEvent(dom.getElementById("odds_dropdown"), "change", _self.chgOddsHandler);
                        util.addEvent(_mc["langx_dropdown"], "blur", _self.rightMenuSelectBlur);
                        util.addEvent(dom.getElementById("odds_dropdown"), "blur", _self.rightMenuSelectBlur);
                        util.addEvent(_mc["timetype_dropdown"], "change", _self.chgTimetypeHandler);
                        util.addEvent(_mc["timetype_dropdown"], "blur", _self.rightMenuSelectBlur)
                    }
                    var ios = util.isIOS();
                    if (top.isapp == "N" && !ios && top.mobile != "N") {
                        _mc["right_app"].style.display = "";
                        util.addEvent(_mc["right_app"], "click", _self.chgdownloadPage)
                    }
                    if (top.impchk == "Y" || top.perchk == "Y")
                        _self.messg(top.impchk, top.perchk);
                    if (top["userData"].enable == "S" || top.clean_data_sw == "Y")
                        _self.rightTVoff(true);
                    dom.getElementById(top.langx).style.display = "";
                    dom.getElementById("icon_" + top.langx).style.display = "";
                    dom.getElementById(top["userData"].odd_f_type).style.display = "";
                    if (dom.getElementById(top["userData"].timetype))
                        dom.getElementById(top["userData"].timetype).style.display = "";
                    _mc["odds_dropdown"].options.length = 0;
                    var oddBox = top["userData"].odd_f.split(",");
                    for (var i = 0; i < oddBox.length; i++) {
                        var tmpOdd = new Option(LS.get("oddf_" + oddBox[i]),oddBox[i] + "_odds",false,false);
                        _mc["odds_dropdown"].options.add(tmpOdd);
                        dom.getElementById("selec_" + oddBox[i]).style.display = ""
                    }
                    _mc["odds_dropdown"].value = top["userData"].odd_f_type + "_odds";
                    _mc["langx_dropdown"].value = "langx_" + top.userData.langx;
                    _mc["timetype_dropdown"].value = "time_" + top.userData.timetype;
                    parentClass.dispatchEvent("auto_update", {})
                }
                ;
                _self.chgdownloadPage = function(e) {
                    headerFrame.closeRightPanel();
                    var urlParams = "";
                    urlParams += "uid=" + top["userData"].uid;
                    urlParams += "&langx=" + top.langx;
                    urlParams = "p=guide_HGApp&ver=" + top.ver + "&" + urlParams;
                    window.open(top.m2_url + "?" + urlParams)
                }
                ;
                _self.rightMenuSelectBlur = function() {
                    parentClass.dispatchEvent("scrollsetTop")
                }
                ;
                _self.chgLanguage = function() {
                    util.removeClass(_mc["selec_oddstype"], "on");
                    util.removeClass(_mc["selec_timetype"], "on");
                    dom.getElementById("pc_langx_" + top.userData.langx).checked = "true";
                    if (chg_lang_sw == "Y")
                        util.addClass(_mc["selec_language"], "on");
                    else
                        chg_lang_sw = "Y";
                    _self.langxOddSelected("selec_language", "lang_focus")
                }
                ;
                _self.chgLangxHandler = function() {
                    var myselect = document.getElementById("langx_dropdown");
                    var index = myselect.selectedIndex;
                    var tmp_langx;
                    tmp_langx = myselect.options[index].value.split("_");
                    _self.choice("", tmp_langx[1])
                }
                ;
                _self.chgTimetypeHandler = function() {
                    var myselect = document.getElementById("timetype_dropdown");
                    var index = myselect.selectedIndex;
                    var tmp_timetype;
                    tmp_timetype = myselect.options[index].value.split("_");
                    _self.choiceTime("", tmp_timetype[1])
                }
                ;
                _self.choice = function(e, param) {
                    if (top["userData"].langx == param) {
                        _mc["selec_language"].classList.remove("on");
                        chg_lang_sw = "N"
                    } else {
                        for (var i = 0; i < langx_ary.length; i++) {
                            document.getElementById(langx_ary[i]).style.display = "none";
                            document.getElementById("icon_" + langx_ary[i]).style.display = "none"
                        }
                        document.getElementById("icon_" + param).style.display = "";
                        document.getElementById(param).style.display = "";
                        _mc["selec_language"].className = "box_popup_selec";
                        _history.length = 0;
                        top["userData"].langx = param;
                        parentClass.dispatchEvent("clearAllOpenWindow");
                        if (top["userData"].newalertMsg == "Y") {
                            delete top["userData"].newalertMsg;
                            top["userData"].four_pwd = "new"
                        }
                        util.topGoToUrl(location, top["userData"])
                    }
                }
                ;
                _self.chgTimetype = function() {
                    util.removeClass(_mc["selec_language"], "on");
                    util.removeClass(_mc["selec_oddstype"], "on");
                    dom.getElementById("pc_" + top.userData.timetype).checked = "true";
                    for (var i = 0; i < timetype_ary.length; i++)
                        util.removeClass(dom.getElementById("selec_" + timetype_ary[i]), "on");
                    if (chg_timetype_sw == "Y")
                        util.addClass(_mc["selec_timetype"], "on");
                    else
                        chg_timetype_sw = "Y";
                    _self.langxOddSelected("selec_timetype", "timetype_focus");
                    util.addClass(dom.getElementById("selec_" + top.userData.timetype), "on")
                }
                ;
                _self.choiceTime = function(e, param) {
                    if (top["userData"].timetype == param) {
                        _mc["selec_timetype"].classList.remove("on");
                        chg_timetype_sw = "N"
                    } else {
                        for (var i = 0; i < timetype_ary.length; i++)
                            dom.getElementById(timetype_ary[i]).style.display = "none";
                        dom.getElementById(param).style.display = "";
                        top["userData"].timetype = param;
                        _self.sendTimetype(top["userData"].timetype);
                        echo("[right_menu] \u76ee\u524dTimetype\u662f : " + param);
                        parentClass.dispatchEvent("setFooterTimetype", {});
                        parentClass.dispatchEvent("updateTime", {})
                    }
                }
                ;
                _self.sendTimetype = function(timetype) {
                    var action = "send";
                    var code = '{"timetype":"' + timetype + '"}';
                    var urlParams = "p=memSet";
                    urlParams += "&" + top.param;
                    urlParams += "&uid=" + top["userData"].uid;
                    urlParams += "&val=" + code;
                    urlParams += "&action=" + action;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.sendTimetypeComplete);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.sendTimetypeComplete = function(xml) {
                    var errorMsg = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    top["memSet"].timetype = top["userData"].timetype
                }
                ;
                _self.chgOddsHandler = function() {
                    var myselect = document.getElementById("odds_dropdown");
                    var index = myselect.selectedIndex;
                    var tmp_langx;
                    tmp_langx = myselect.options[index].value.split("_");
                    _self.chgOdds("", tmp_langx[0])
                }
                ;
                _self.chgPage = function(e, param) {
                    util.removeClass(_mc["selec_language"], "on");
                    util.removeClass(_mc["selec_oddstype"], "on");
                    if (param.page == "help_set_mail") {
                        if (!CookieManager.get("out_enabled_lock"))
                            CookieManager.set("out_enabled_lock", "N");
                        var obj = win._history[win._history.length - 1];
                        if (obj.page == "help_set_mail")
                            win._history.pop()
                    } else if (param.page == "rules_general" || param.page == "features")
                        param.noCache = "Y";
                    else if (param.page == "list_tv") {
                        param.type = "list_tv";
                        param.specialClick = "";
                        param.outrightsClick = ""
                    }
                    parentClass.dispatchEvent("hideAlertMsg", {
                        "use": "noPopMainClear"
                    });
                    parentClass.dispatchEvent("closeLeagueSetting");
                    param.retFun = _self.changePageComplete;
                    parentClass.dispatchEvent("bodyGoToPage", param);
                    headerFrame.closeRightPanel()
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    headerFrame = parentClass.getThis("headerFrame");
                    LS_code = parentClass.getThis("LS_code");
                    config_set = parentClass.getThis("config_set")
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
                _self.messg = function(msgImpchk, msgPerchk) {
                    if (msgImpchk == "Y" || msgPerchk == "Y")
                        dom.getElementById("right_mess_new").className = "dot_red on";
                    else
                        dom.getElementById("right_mess_new").className = "dot_red"
                }
                ;
                _self.logout = function() {
                    util.goToIndex()
                }
                ;
                _self.clickOddBtn = function() {
                    util.removeClass(_mc["selec_language"], "on");
                    util.removeClass(_mc["selec_timetype"], "on");
                    if (top["userData"].enable != "S") {
                        if (chg_odds_sw == "Y")
                            _mc["selec_oddstype"].classList.add("on");
                        else
                            chg_odds_sw = "Y";
                        _self.langxOddSelected("selec_oddstype", "parent_selec_odds");
                        dom.getElementById(top["userData"].odd_f_type + "_odds").checked = "true"
                    }
                }
                ;
                _self.chgOdds = function(e, param) {
                    for (var i = 0; i < odds_ary.length; i++)
                        document.getElementById(odds_ary[i]).style.display = "none";
                    document.getElementById(param).style.display = "";
                    chg_odds_sw = "N";
                    top["userData"].odd_f_type = param;
                    _mc["selec_oddstype"].classList.remove("on");
                    parentClass.dispatchEvent("Chg_odds", top["userData"].odd_f_type);
                    _self.sendodd_f_type(top["userData"].odd_f_type)
                }
                ;
                _self.sendodd_f_type = function(param) {
                    var code = '{"odd_f_type":"' + param + '"}';
                    var urlParams = "";
                    urlParams += "uid=" + top["userData"].uid;
                    urlParams += "&val=" + code;
                    urlParams += "&langx=" + top.langx;
                    urlParams += "&action=send";
                    urlParams = "p=memSet&ver=" + top.ver + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.send_Complete);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.send_Complete = function(xml) {
                    var errorMsg = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    CookieManager.set("odd_f_type_" + top["userData"].mid, top["userData"].odd_f_type, 3650);
                    top["memSet"].odd_f_type = top["userData"].odd_f_type
                }
                ;
                _self.clickHideCash = function() {
                    _self.hideCash(true)
                }
                ;
                _self.hideCash = function(isClick) {
                    if (_mc["acc_show_eye"].className == "btn_eye") {
                        if (!top.showCredit)
                            top.showCredit = true;
                        _mc["acc_show_eye"].classList.add("off");
                        noRunCash = true;
                        if (isClick)
                            parentClass.dispatchEvent("reloadCredit", {
                                "key": "cash"
                            })
                    } else {
                        if (top.showCredit)
                            top.showCredit = false;
                        noRunCash = false;
                        _mc["acc_show_eye"].classList.remove("off");
                        _mc["acc_credit"].innerHTML = "\u2022\u2022\u2022\u2022\u2022";
                        _mc["acc_currency"].innerHTML = ""
                    }
                    if (isClick)
                        parentClass.dispatchEvent("hideCash", {
                            "from": "right_menu"
                        })
                }
                ;
                _self.chgcredit = function(nowcredit) {
                    var returnObj = new Array;
                    var tmpObj = new Object;
                    if (oldCredit == "")
                        oldCredit = nowcredit != null ? nowcredit : top["userData"].maxcredit;
                    var _oldCash = util.trans_thousand(oldCredit);
                    if (_mc["acc_show_eye"].className == "btn_eye off") {
                        if (nowcredit != null)
                            top["userData"].maxcredit = nowcredit;
                        if (_oldCash != util.trans_thousand(top["userData"].maxcredit) && _oldCash != "" && !noRunCash && _mc["acc_credit"].innerHTML != "\u2022\u2022\u2022\u2022\u2022") {
                            var tmpCredit = oldCredit.replace(/[,]+/g, "");
                            savechk = util.showTxt(parseFloat(tmpCredit));
                            tmpObj = {
                                "savechk": savechk,
                                "maxcredit": parseFloat(top["userData"].maxcredit),
                                "currency": _mc["acc_currency"],
                                "credit": _mc["acc_credit"],
                                "money": "acc_money",
                                "Ary": Ary,
                                "count": _count,
                                "removeFun": _self.removeMoneyCss
                            };
                            returnObj = util.chgCreditAnimation(tmpObj);
                            Ary = returnObj["Ary"];
                            _count = returnObj["count"]
                        } else {
                            noRunCash = false;
                            _mc["acc_credit"].innerHTML = util.trans_thousand(top["userData"].maxcredit);
                            _mc["acc_currency"].innerHTML = util.showTxt(top["userData"].currency);
                            top["orderinfo"]["date"] = ""
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
                        if (_mc["right_creditlogs"])
                            if (top["userData"].pay_type != 1 && _mc["right_creditlogs"].parentNode)
                                _mc["right_creditlogs"].parentNode.removeChild(_mc["right_creditlogs"]);
                            else
                                _mc["right_creditlogs"].style.display = "";
                        _mc["acc_username"].innerHTML = util.showTxt(top["userData"].passwd_safe);
                        if (savechk == "")
                            savechk = parseFloat(top["userData"].maxcredit);
                        _self.chgcredit()
                    }
                    if (!firstLoad) {
                        oldCredit = top["userData"].maxcredit;
                        parentClass.dispatchEvent("checkCount", {});
                        firstLoad = true
                    }
                }
                ;
                _self.langxOddSelected = function(classId, focusId) {
                    dom.getElementById(focusId).tabIndex = 1;
                    setTimeout(_self.langxOddFocus, 300, focusId);
                    util.addEvent(dom.getElementById(focusId), "blur", _self.langxOddBlur, {
                        "id": classId
                    })
                }
                ;
                _self.langxOddFocus = function(focus_id) {
                    dom.getElementById(focus_id).focus()
                }
                ;
                _self.langxOddBlur = function(e, param) {
                    dom.getElementById(param.id).classList.remove("on")
                }
                ;
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
                        echo(e)
                    }
                    top.newWinObj_result.focus();
                    parentClass.dispatchEvent("closePCResult")
                }
                ;
                _self.setIorChgClick = function(e) {
                    _self.setIorChg(true, "")
                }
                ;
                _self.setIorChg = function(isClick, iorChgSw) {
                    if (isClick) {
                        iorChgSw = CookieManager.get("iorChgSw");
                        if (iorChgSw == "N") {
                            _mc["iorType_set"].checked = true;
                            if (isClick)
                                parentClass.dispatchEvent("setIorChg", {
                                    "from": "right_menu",
                                    "sw": "Y"
                                })
                        } else {
                            _mc["iorType_set"].checked = false;
                            if (isClick)
                                parentClass.dispatchEvent("setIorChg", {
                                    "from": "right_menu",
                                    "sw": "N"
                                })
                        }
                    } else if (iorChgSw == "N")
                        _mc["iorType_set"].checked = false;
                    else if (iorChgSw == "Y")
                        _mc["iorType_set"].checked = true
                }
                ;
                _self.removeMoneyCss = function() {
                    util.removeClass(_mc["acc_money"], "ani_credit_add")
                }
                ;
                _self.rightTVoff = function(is_off) {
                    if (is_off)
                        util.addClass(_mc["right_tv"], "off");
                    else
                        util.removeClass(_mc["right_tv"], "off")
                }
            }
            