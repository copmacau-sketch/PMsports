 function footer(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var util = new win.Util(win,dom);
                var _mc = new Object;
                var langx_ary = new Array("zh-cn","zh-tw","en-us");
                var timetype_ary = new Array("sysTime","devTime");
                var chg_lang_sw = "Y";
                var chg_timetype_sw = "Y";
                var classname = "footer";
                var LS;
                var myhash = {};
                var todayTimeAry = new Array("history_data","today_wagers","history_view","message","credit_logs","list_tv");
                var stimer = 0;
                var basetime = "";
                var datetime = "";
                var timeAry = [];
                var config_set;
                var page = "";
                var pageTS = 0;
                var footerPage_ary = new Array("footer_live","footer_hot","footer_today","footer_soon","footer_early","footer_outrights","footer_tv","footer_features_new","footer_help_faq","footer_help_sys","footer_help_term","footer_rules_general");
                _self.paramHash = new Object;
                _self.init = function() {
                    _mc["footer_langx_dropdown"] = dom.getElementById("footer_langx_dropdown");
                    _mc["footer_selec_language"] = dom.getElementById("footer_selec_language");
                    _mc["footer_timetype_dropdown"] = dom.getElementById("footer_timetype_dropdown");
                    _mc["footer_selec_timetype"] = dom.getElementById("footer_selec_timetype");
                    _mc["footer_relating_title"] = dom.getElementById("footer_relating_title");
                    _mc["footer_relating_box"] = dom.getElementById("footer_relating_box");
                    _mc["footer_app"] = dom.getElementById("footer_app");
                    _mc["footer_live"] = dom.getElementById("footer_live");
                    _mc["footer_live"].type = "live";
                    _mc["footer_live"].showtype = "live";
                    _mc["footer_soon"] = dom.getElementById("footer_soon");
                    _mc["footer_soon"].type = "soon";
                    _mc["footer_soon"].showtype = "soon";
                    _mc["footer_hot"] = dom.getElementById("footer_hot");
                    _mc["footer_hot"].type = "hot";
                    _mc["footer_hot"].showtype = "hot";
                    _mc["footer_today"] = dom.getElementById("footer_today");
                    _mc["footer_today"].type = "today";
                    _mc["footer_today"].showtype = "today";
                    _mc["footer_early"] = dom.getElementById("footer_early");
                    _mc["footer_early"].type = "early";
                    _mc["footer_early"].url = "league_index";
                    _mc["footer_early"].showtype = "early";
                    _mc["footer_outrights"] = dom.getElementById("footer_outrights");
                    _mc["footer_outrights"].type = "outrights";
                    _mc["footer_outrights"].url = "league_index";
                    _mc["footer_outrights"].showtype = "outrights";
                    _mc["footer_outrights"].outrightsClick = "outrights";
                    _mc["footer_tv"] = dom.getElementById("footer_tv");
                    _mc["footer_tv"].url = "list_tv";
                    _mc["footer_tv"].type = "list_tv";
                    _mc["footer_features_new"] = dom.getElementById("footer_features_new");
                    _mc["footer_features_new"].url = "features";
                    _mc["footer_help_faq"] = dom.getElementById("footer_help_faq");
                    _mc["footer_help_faq"].url = "help_faq";
                    _mc["footer_help_sys"] = dom.getElementById("footer_help_sys");
                    _mc["footer_help_sys"].url = "help_sys";
                    _mc["footer_help_term"] = dom.getElementById("footer_help_term");
                    _mc["footer_help_term"].url = "help_term";
                    _mc["footer_rules_general"] = dom.getElementById("footer_rules_general");
                    _mc["footer_rules_general"].url = "rules_general";
                    dom.getElementById("footer_icon_" + top.langx).style.display = "";
                    dom.getElementById("footer_" + top.langx).style.display = "";
                    if (dom.getElementById("footer_" + top.userData.timetype))
                        dom.getElementById("footer_" + top.userData.timetype).style.display = "";
                    util.addEvent(_mc["footer_relating_box"], "click", _self.showInfo, {
                        "id": "relating_title",
                        "content": "relating_content"
                    });
                    if (top.mobile != "Y") {
                        util.addEvent(dom.getElementById("footer_chg_language"), "click", _self.chgLanguage);
                        for (var ls = 0; ls < langx_ary.length; ls++)
                            util.addEvent(dom.getElementById("footer_selec_" + langx_ary[ls]), "click", _self.choice, langx_ary[ls]);
                        util.addEvent(dom.getElementById("footer_timetype"), "click", _self.chgTimetype);
                        for (var t = 0; t < timetype_ary.length; t++)
                            util.addEvent(dom.getElementById("footer_selec_" + timetype_ary[t]), "click", _self.choiceTime, timetype_ary[t])
                    } else {
                        util.addEvent(_mc["footer_langx_dropdown"], "change", _self.chgLangxHandler);
                        util.addEvent(_mc["footer_langx_dropdown"], "blur", _self.rightMenuSelectBlur);
                        _mc["footer_langx_dropdown"].value = "langx_" + top.userData.langx;
                        util.addEvent(_mc["footer_timetype_dropdown"], "change", _self.chgTimetypeHandler);
                        util.addEvent(_mc["footer_timetype_dropdown"], "blur", _self.rightMenuSelectBlur);
                        _mc["footer_timetype_dropdown"].value = "time_" + top.userData.timetype
                    }
                    if (win._history.length > 0) {
                        var his_obj = _self.getNowPageObj();
                        page = his_obj.page;
                        var _showtype = his_obj.state.showtype;
                        var is_showGMT = (page == "league_index" || page.indexOf("game_list") != -1 && top.specialClick == "") && (_showtype == "today" && top.choice_rtype != "fs" || _showtype == "hot" || _showtype == "parlay" && his_obj.state.postHash.couponKey == "str_coupon_today") || util.in_array(page, todayTimeAry);
                        if (is_showGMT) {
                            _self.createSTTimer();
                            _self.setFooterTimer();
                            pageTS = his_obj.state.nowTS;
                            dom.addEventListener("visibilitychange", _self.browserVisble);
                            if (page == "today_wagers" || page.indexOf("history") != -1 || page == "credit_logs")
                                dom.getElementById("timeZone_msg").innerHTML = LS.get("timeZone_wagers");
                            else if (page == "message")
                                dom.getElementById("timeZone_msg").innerHTML = LS.get("timeZone_message");
                            else
                                dom.getElementById("timeZone_msg").innerHTML = LS.get("timeZone_game");
                            if (top.choice_rtype != "fs")
                                _self.showTimeGMT(true)
                        } else
                            _self.showTimeGMT(false)
                    }
                    _self.initFooterBtn();
                    var ios = util.isIOS();
                    if (top.isapp == "N" && !ios && top.mobile != "N") {
                        _mc["footer_app"].style.display = "";
                        util.addEvent(_mc["footer_app"], "click", _self.chgdownloadPage)
                    }
                }
                ;
                _self.showTimeGMT = function(show) {
                    dom.getElementById("today_notice").style.display = show ? "" : "none"
                }
                ;
                _self.chgdownloadPage = function(e) {
                    var urlParams = "";
                    urlParams += "uid=" + top["userData"].uid;
                    urlParams += "&langx=" + top.langx;
                    urlParams = "p=guide_HGApp&ver=" + top.ver + "&" + urlParams;
                    window.open(top.m2_url + "?" + urlParams)
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    config_set = parentClass.getThis("config_set");
                    timerHash = parentClass.getThis("timerHash");
                    LS = parentClass.getThis("LS");
                    myhash["LS"] = LS
                }
                ;
                _self.initFooterBtn = function() {
                    echo("\u521d\u59cb\u5316footer\u6309\u9215!!");
                    var otherPage = new Array("footer_features_new","footer_help_faq","footer_help_sys","footer_help_term","footer_rules_general");
                    for (var i = 0; i < footerPage_ary.length; i++) {
                        var par = new Object;
                        var key = footerPage_ary[i];
                        par["page"] = _mc[key].url;
                        par["showtype"] = _mc[key].showtype;
                        par["type"] = _mc[key].type;
                        par["specialClick"] = _mc[key].specialClick ? "special" : "";
                        par["outrightsClick"] = _mc[key].outrightsClick ? "outrights" : "";
                        par["isOtherPage"] = otherPage.indexOf(key) != -1 ? "Y" : "N";
                        util.addEvent(_mc[key], "click", _self.chgPage, par)
                    }
                }
                ;
                _self.chgPage = function(e, param) {
                    util.removeClass(_mc["footer_selec_language"], "on");
                    parentClass.dispatchEvent("footerChgPage", param)
                }
                ;
                _self.chgLanguage = function() {
                    dom.getElementById("footer_langx_" + top.userData.langx).checked = "true";
                    for (var i = 0; i < langx_ary.length; i++)
                        util.removeClass(dom.getElementById("footer_selec_" + langx_ary[i]), "on");
                    util.addClass(dom.getElementById("footer_selec_" + top["userData"].langx), "on");
                    if (chg_lang_sw == "Y")
                        util.addClass(_mc["footer_selec_language"], "on");
                    else
                        chg_lang_sw = "Y";
                    _self.langxOddSelected("footer_selec_language", "footer_lang_focus")
                }
                ;
                _self.chgLangxHandler = function() {
                    var myselect = dom.getElementById("footer_langx_dropdown");
                    var index = myselect.selectedIndex;
                    var tmp_langx;
                    tmp_langx = myselect.options[index].value.split("_");
                    _self.choice("", tmp_langx[1])
                }
                ;
                _self.chgTimetypeHandler = function() {
                    var myselect = dom.getElementById("footer_timetype_dropdown");
                    var index = myselect.selectedIndex;
                    var tmp_timetype;
                    tmp_timetype = myselect.options[index].value.split("_");
                    _self.choiceTime("", tmp_timetype[1])
                }
                ;
                _self.choice = function(e, param) {
                    if (top["userData"].langx == param) {
                        _mc["footer_selec_language"].classList.remove("on");
                        chg_lang_sw = "N"
                    } else {
                        for (var i = 0; i < langx_ary.length; i++) {
                            dom.getElementById("footer_" + langx_ary[i]).style.display = "none";
                            dom.getElementById("footer_icon_" + langx_ary[i]).style.display = "none"
                        }
                        dom.getElementById("footer_icon_" + param).style.display = "";
                        dom.getElementById("footer_" + param).style.display = "";
                        _mc["footer_selec_language"].className = "box_popup_selec";
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
                    dom.getElementById("footer_timetype_" + top.userData.timetype).checked = "true";
                    for (var i = 0; i < timetype_ary.length; i++)
                        util.removeClass(dom.getElementById("footer_selec_" + timetype_ary[i]), "on");
                    if (chg_timetype_sw == "Y")
                        util.addClass(_mc["footer_selec_timetype"], "on");
                    else
                        chg_timetype_sw = "Y";
                    util.addClass(dom.getElementById("footer_selec_" + top.userData.timetype), "on");
                    _self.langxOddSelected("footer_selec_timetype", "footer_timetype_focus")
                }
                ;
                _self.choiceTime = function(e, param) {
                    if (top["userData"].timetype == param) {
                        _mc["footer_selec_timetype"].classList.remove("on");
                        chg_timetype_sw = "N"
                    } else {
                        for (var i = 0; i < timetype_ary.length; i++)
                            dom.getElementById("footer_" + timetype_ary[i]).style.display = "none";
                        dom.getElementById("footer_" + param).style.display = "";
                        _mc["footer_selec_timetype"].className = "box_popup_selec";
                        top["userData"].timetype = param;
                        _self.sendTimetype(top["userData"].timetype);
                        parentClass.dispatchEvent("updateTime", {});
                        echo("[footer] \u76ee\u524dTimetype\u662f : " + param)
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
                _self.setTimetype = function(timetype) {
                    for (var i = 0; i < timetype_ary.length; i++)
                        dom.getElementById("footer_" + timetype_ary[i]).style.display = "none";
                    dom.getElementById("footer_" + timetype).style.display = "";
                    _mc["footer_timetype_dropdown"].value = "time_" + timetype
                }
                ;
                _self.rightMenuSelectBlur = function() {
                    parentClass.dispatchEvent("scrollsetTop")
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
                _self.langxOddBlur = function(e, param) {
                    dom.getElementById(param.id).classList.remove("on")
                }
                ;
                _self.langxOddFocus = function(focus_id) {
                    dom.getElementById(focus_id).focus()
                }
                ;
                _self.showInfo = function(e, param) {
                    var _par = new Object;
                    _par["_id"] = "info_pop";
                    _par["title"] = "<li>" + LS.get(param.id) + "</li>";
                    _par["msg"] = LS.get(param.content);
                    parentClass.dispatchEvent("showAlertMsg", _par)
                }
                ;
                _self.getNowPageObj = function() {
                    var tmpObj = new Object;
                    if (win._history.length != 0)
                        tmpObj = win._history[win._history.length - 1];
                    return tmpObj
                }
                ;
                _self.createSTTimer = function() {
                    _self.clearSTTimer();
                    timerHash["getSysTime"] = new Timer(config_set.get("CONFIG_GET_SYSTEMTIME"));
                    timerHash["getSysTime"].setParentclass(_self);
                    timerHash["getSysTime"].dont_clear = true;
                    timerHash["getSysTime"].init();
                    timerHash["getSysTime"].addEventListener("TimerEvent.TIMER", _self.getSystemTime);
                    timerHash["getSysTime"].startTimer()
                }
                ;
                _self.clearSTTimer = function() {
                    if (timerHash["getSysTime"] != null) {
                        timerHash["getSysTime"].clearObj();
                        timerHash["getSysTime"] = null
                    }
                    return true
                }
                ;
                _self.browserVisble = function() {
                    if (dom.visibilityState === "visble")
                        _self.getSystemTime()
                }
                ;
                _self.setFooterTimer = function() {
                    _self.getSystemTime()
                }
                ;
                _self.getSystemTime = function() {
                    var urlParams = "";
                    urlParams += "&uid=" + top["userData"].uid;
                    urlParams += "&langx=" + top.langx;
                    urlParams = "p=get_systemTime&ver=" + top.ver + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.getSystemTimeComplete);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.getSystemTimeComplete = function(xml) {
                    var errorMsg = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    xmlnode = util.parseXml(xml);
                    var sysDateTime = xmlnode.Node(xmlnode.Root[0], "systemtime").innerHTML;
                    var systemTimer = sysDateTime.split(" ");
                    top.systemtime = sysDateTime;
                    datetime = systemTimer[1];
                    _self.startTime(datetime)
                }
                ;
                _self.startTime = function(sysTimer) {
                    basetime = sysTimer;
                    _self.showTime(basetime);
                    _self.stopTimer();
                    stimer = setInterval(_self.runTimer, 1E3)
                }
                ;
                _self.showTime = function(time) {
                    var showObj = document.getElementById("footer_time");
                    var his_obj = _self.getNowPageObj();
                    if (showObj && pageTS == his_obj.state.nowTS && page == his_obj.page)
                        showObj.innerHTML = time;
                    else
                        _self.stopTimer()
                }
                ;
                _self.runTimer = function() {
                    _self.splitTimer();
                    for (var i = timeAry.length - 1; i >= 0; i--) {
                        var t = parseInt(timeAry[i]);
                        t++;
                        var isbreak = false;
                        var base = i == 0 ? 24 : 60;
                        if (t >= base)
                            t = 0;
                        else
                            isbreak = true;
                        timeAry[i] = _self.checkTime(t);
                        if (isbreak)
                            break
                    }
                    basetime = timeAry.join(":");
                    _self.showTime(basetime)
                }
                ;
                _self.stopTimer = function() {
                    if (stimer > 0)
                        clearInterval(stimer)
                }
                ;
                _self.splitTimer = function() {
                    if (datetime != "") {
                        basetime = datetime;
                        datetime = ""
                    }
                    timeAry = basetime.split(":")
                }
                ;
                _self.checkTime = function(val) {
                    return parseInt(val) < 10 ? "0" + val : val
                }
            }
            ;