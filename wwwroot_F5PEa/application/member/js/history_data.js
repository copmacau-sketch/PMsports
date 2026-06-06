function history_data(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var eventHandler = new Object;
                var util = new win.Util(win,dom);
                var LS_code;
                var _mc = new Object;
                var tag = "\u2022";
                var gtype_array = new Array("ALL","FT","BK","ES","TN","VB","BM","TT","BS","SK","OP","FS");
                var isAll = false;
                var actionAry = new Array;
                var savedate;
                var tmpSelectStart = "";
                var tmpSelectEnd = "";
                var date_ary_hash = new Array;
                var SelectStart = "";
                var SelectEnd = "";
                var li_Hash = "";
                var option_Hash = "";
                var dateStart = "";
                var dateEnd = "";
                var history_data_sw = "Y";
                var isFilter = "";
                var classname = "history_data";
                var myhash = {};
                _self.init = function() {
                    top.dataGtype = "ALL";
                    _mc["backtop"] = dom.getElementById("backtop");
                    _mc["tool_backtop"] = dom.getElementById("tool_backtop");
                    _mc["noHistoryData"] = dom.getElementById("noHistoryData");
                    _mc["more_date"] = dom.getElementById("more_date");
                    _mc["title_creditlogs"] = dom.getElementById("title_creditlogs");
                    _mc["gtypeTxt"] = dom.getElementById("gtypeTxt");
                    _mc["body_show"] = util.getScrollDom(util.isIOS());
                    _mc["div_show"] = dom.getElementById("div_show");
                    _mc["date_Start_ul"] = dom.getElementById("date_Start_ul");
                    _mc["date_End_ul"] = dom.getElementById("date_End_ul");
                    _mc["date_rangStart_span"] = dom.getElementById("date_rangStart_span");
                    _mc["date_rangEnd_span"] = dom.getElementById("date_rangEnd_span");
                    _mc["rangSearch"] = dom.getElementById("rangSearch");
                    _mc["ph_rangSearch"] = dom.getElementById("ph_rangSearch");
                    _mc["tool_date_select"] = dom.getElementById("tool_date_select");
                    _mc["pc_gtype_sel_div"] = dom.getElementById("pc_gtype_sel_div");
                    _mc["ph_tool_date_select"] = dom.getElementById("ph_tool_date_select");
                    _mc["ph_date_rangStart_span"] = dom.getElementById("ph_date_rangStart_span");
                    _mc["ph_date_rangEnd_span"] = dom.getElementById("ph_date_rangEnd_span");
                    _mc["range_selStart"] = dom.getElementById("range_selStart");
                    _mc["range_selEnd"] = dom.getElementById("range_selEnd");
                    _mc["gtype_sel"] = dom.getElementById("gtype_sel");
                    util.addEvent(_mc["title_creditlogs"], "click", _self.chgPage, {
                        "page": "credit_logs"
                    });
                    util.addEvent(dom.getElementById("title_todaywagers"), "click", _self.chgPage, {
                        "page": "today_wagers"
                    });
                    if (top.mobile != "Y") {
                        util.addEvent(_mc["pc_gtype_sel_div"], "click", _self.initGtypeSelect);
                        util.addEvent(_mc["date_rangStart_span"], "click", _self.selectDate, {
                            "target": "Start"
                        });
                        util.addEvent(_mc["date_rangEnd_span"], "click", _self.selectDate, {
                            "target": "End"
                        });
                        util.addEvent(_mc["rangSearch"], "click", _self.search)
                    } else {
                        util.addEvent(_mc["gtype_sel"], "blur", _self.selectblur);
                        util.addEvent(_mc["gtype_sel"], "change", _self.phGtypeSelect);
                        util.addEvent(_mc["range_selStart"], "change", _self.phSelectDateChg, {
                            "target": "Start"
                        });
                        util.addEvent(_mc["range_selEnd"], "change", _self.phSelectDateChg, {
                            "target": "End"
                        });
                        util.addEvent(_mc["ph_rangSearch"], "click", _self.search)
                    }
                    util.addEvent(dom.getElementById("more_date"), "click", _self.loadAllHistory);
                    util.addEvent(_mc["backtop"], "click", _self.backTop);
                    util.addEvent(dom.getElementById("backpage"), "click", _self.toBack);
                    _self.loadHistory();
                    if (top.mobile == "N")
                        util.addEvent(_mc["body_show"], "scroll", _self.roll, _self.getNowPage());
                    win.addEventListener("orientationchange", _self.orientationChange);
                    util.selectresizeblur(_self.orientationChange)
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    util = parentClass.getThis("util");
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
                _self.initGtypeSelect = function(e, param) {
                    if (_mc["pc_gtype_sel_div"].classList.contains("on"))
                        util.removeClass(_mc["pc_gtype_sel_div"], "on");
                    else {
                        util.addClass(_mc["pc_gtype_sel_div"], "on");
                        util.pcDropdowns("pc_gtype_sel_div", "pc_gtype_sel_ul")
                    }
                    for (var i = 0; i < gtype_array.length; i++) {
                        var gtypeObj = dom.getElementById(gtype_array[i]);
                        util.removeClass(gtypeObj, "on");
                        if (_mc["gtypeTxt"] == gtypeObj.innerHTML)
                            util.addClass(gtypeObj, "on");
                        util.addEvent(gtypeObj, "click", _self.chgGtype)
                    }
                }
                ;
                _self.selectblur = function() {
                    parentClass.dispatchEvent("scrollsetTop")
                }
                ;
                _self.phGtypeSelect = function(e, param) {
                    var chk = _self.checkDate();
                    if (!chk) {
                        _mc["gtype_sel"].value = top.dataGtype;
                        return
                    }
                    for (var i = 0; i < gtype_array.length; i++)
                        if (_mc["gtype_sel"].value == e.target[i].value)
                            _mc["gtypeTxt"].innerHTML = util.showTxt(e.target[i].innerHTML);
                    top.dataGtype = _mc["gtype_sel"].value;
                    _self.chgGtypeLoading(true);
                    _self.loadHistory()
                }
                ;
                _self.chgGtype = function(e, param) {
                    var chk = _self.checkDate();
                    if (!chk)
                        return;
                    top.dataGtype = e.target.id;
                    _mc["gtype_sel"].value = e.target.id;
                    _mc["gtypeTxt"].innerHTML = util.showTxt(e.target.innerHTML);
                    _self.chgGtypeLoading(true);
                    _self.loadHistory()
                }
                ;
                _self.chgPage = function(e, param) {
                    param.retFun = _self.changePageComplete;
                    parentClass.dispatchEvent("bodyGoToPage", param)
                }
                ;
                _self.toBack = function() {
                    parentClass.dispatchEvent("backPage", {})
                }
                ;
                _self.loadAllHistory = function() {
                    dom.getElementById("more_date").style.display = "none";
                    if (top.mobile != "Y") {
                        dateStartTxt = dom.getElementById("dateStart").innerHTML;
                        dateEndTxt = dom.getElementById("dateEnd").innerHTML;
                        lightDateStart = dom.getElementById("date_Start_ul").children[date_ary_hash.indexOf(dateStartTxt)];
                        lightDateEnd = dom.getElementById("date_End_ul").children[date_ary_hash.indexOf(dateEndTxt)];
                        util.removeClass(lightDateStart, "on");
                        util.removeClass(lightDateEnd, "on")
                    }
                    isAll = true;
                    _self.loadHistory();
                    var eventAction = "scroll";
                    if (util.isIOS())
                        eventAction = "touchmove";
                    util.addEvent(_mc["body_show"], eventAction, _self.roll, _self.getNowPage())
                }
                ;
                _self.search = function() {
                    var chk = _self.checkDate();
                    if (!chk)
                        return;
                    isAll = false;
                    _self.chgGtypeLoading(true);
                    _self.loadHistory()
                }
                ;
                _self.loadHistory = function() {
                    var urlParams = "";
                    isFilter = "N";
                    urlParams += "uid=" + top["userData"].uid;
                    urlParams += "&langx=" + top.langx;
                    urlParams += "&gtype=" + top.dataGtype;
                    urlParams += "&isAll=" + (isAll ? "Y" : "N");
                    urlParams += "&startdate=" + SelectStart;
                    urlParams += "&enddate=" + SelectEnd;
                    if (!isAll) {
                        isFilter = "Y";
                        urlParams += "&filter=Y"
                    } else
                        urlParams += "&filter=N";
                    urlParams = "p=get_history_data&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.loadHistoryComplete);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.loadHistoryComplete = function(xml) {
                    var errorMsg = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    actionAry = new Array;
                    var xmdObj = new Object;
                    var xmlnode = util.parseXml(xml);
                    var tmpLi = "";
                    var tmpOption = "";
                    xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
                    var pay_type = xmlnode.Node(xmlnode.Root[0], "pay_type").innerHTML;
                    if (_mc["title_creditlogs"])
                        if (pay_type != 1 && _mc["title_creditlogs"].parentNode)
                            _mc["title_creditlogs"].parentNode.removeChild(_mc["title_creditlogs"]);
                        else
                            _mc["title_creditlogs"].style = "";
                    if (xmdObj["code"].innerHTML == "607") {
                        history_data_sw = "Y";
                        _self.showNoHistoryData(false);
                        _mc["tool_date_select"].style.display = "";
                        _mc["ph_tool_date_select"].style.display = "";
                        xmdObj["total_gold"] = xmlnode.Node(xmlnode.Root[0], "total_gold").innerHTML;
                        xmdObj["total_vgold"] = xmlnode.Node(xmlnode.Root[0], "total_vgold").innerHTML;
                        xmdObj["total_winloss"] = xmlnode.Node(xmlnode.Root[0], "total_winloss").innerHTML;
                        xmdObj["total_winloss_class"] = xmlnode.Node(xmlnode.Root[0], "total_winloss_class").innerHTML;
                        xmdObj["history"] = xmlnode.Node(xmlnode.Root[0], "history", false);
                        xmdObj["dateBar"] = xmlnode.Node(xmlnode.Root[0], "dateBar").innerHTML;
                        xmdObj["history_view_day"] = xmlnode.Node(xmlnode.Root[0], "history_view_day").innerHTML;
                        date_ary_hash = xmdObj["dateBar"].split("|");
                        date_ary_hash = date_ary_hash.reverse();
                        if (dom.getElementById("template_model") != null) {
                            var SampleTable = dom.getElementById("template_model");
                            var tpl = new fastTemplate_a1;
                            tpl.init(SampleTable)
                        } else
                            return;
                        if (xmdObj["history"].length == 8 && isFilter == "Y" || isAll || xmdObj["history_view_day"] == 8)
                            _mc["more_date"].style.display = "none";
						
						for (var i = 0; i < xmdObj["history"].length; i++) {
    var date = xmlnode.Node(xmdObj["history"][i], "date").innerHTML;
    var date_name = xmlnode.Node(xmdObj["history"][i], "date_name").innerHTML;
    var date_class = xmlnode.Node(xmdObj["history"][i], "date_class").innerHTML;
    var gold = xmlnode.Node(xmdObj["history"][i], "gold").innerHTML;
    gold = util.showTxt(gold);
    var vgold = xmlnode.Node(xmdObj["history"][i], "vgold").innerHTML;
    var winloss = xmlnode.Node(xmdObj["history"][i], "winloss").innerHTML;
    var winloss_class = xmlnode.Node(xmdObj["history"][i], "winloss_class").innerHTML;
    tpl.addBlock("tr");
var _date = date_name.split(" ");
   /* var formattedDate = _date[0].replace(/(\d+)月/, function(match, month) {
        return parseInt(month, 10) + "月";
    });
	
	/*var formattedDate = formattedDateMonth.replace(/(\d+)日/, function(match, day) {
	    return parseInt(day, 10) + "日";		
    });*/
    tpl.replace("*DATE*", util.showTxt(date));
   // tpl.replace("*DATE_NAME*", util.showTxt(formattedDate));
	tpl.replace("*DATE_NAME*", util.showTxt(_date[0]));// 这里改回来
    tpl.replace("*WEEK_NAME*", util.showTxt(_date[1]));
    tpl.replace(/\*DATE_CLASS\*/g, util.showTxt(date_class));
    tpl.replace("*GOLD*", util.showTxt(gold));
    tpl.replace("*VGOLD*", util.showTxt(vgold));
    var showTotal = winloss;
    if (showTotal != "-")
        if (showTotal == 0)
            showTotal = "<font>" + util.showTxt(winloss) + "</font>";
    tpl.replace("*WINLOSS*", util.showTxt(showTotal));
    tpl.replace("*WINLOSS_CLASS*", util.showTxt(winloss_class));
    dateEnd = xmlnode.Node(xmdObj["history"][0], "date").innerHTML;
    dateStart = xmlnode.Node(xmdObj["history"][xmdObj["history"].length - 1], "date").innerHTML;

						
						
						
           /*             for (var i = 0; i < xmdObj["history"].length; i++) {
                            var date = xmlnode.Node(xmdObj["history"][i], "date").innerHTML;
                            var date_name = xmlnode.Node(xmdObj["history"][i], "date_name").innerHTML;
                            var date_class = xmlnode.Node(xmdObj["history"][i], "date_class").innerHTML;
                            var gold = xmlnode.Node(xmdObj["history"][i], "gold").innerHTML;
                            gold = util.showTxt(gold);
                            var vgold = xmlnode.Node(xmdObj["history"][i], "vgold").innerHTML;
                            var winloss = xmlnode.Node(xmdObj["history"][i], "winloss").innerHTML;
                            var winloss_class = xmlnode.Node(xmdObj["history"][i], "winloss_class").innerHTML;
                            tpl.addBlock("tr");
                            var _date = date_name.split(" ");							
                            tpl.replace("*DATE*", util.showTxt(date));
                            tpl.replace("*DATE_NAME*", util.showTxt(_date[0]));
                            tpl.replace("*WEEK_NAME*", util.showTxt(_date[1]));
                            tpl.replace(/\*DATE_CLASS\*/		/*g, util.showTxt(date_class));
                            tpl.replace("*GOLD*", util.showTxt(gold));
                            tpl.replace("*VGOLD*", util.showTxt(vgold));
                            var showTotal = winloss;
                            if (showTotal != "-")
                                if (showTotal == 0)
                                    showTotal = "<font>" + util.showTxt(winloss) + "</font>";
                            tpl.replace("*WINLOSS*", util.showTxt(showTotal));
                            tpl.replace("*WINLOSS_CLASS*", util.showTxt(winloss_class));
                            dateEnd = xmlnode.Node(xmdObj["history"][0], "date").innerHTML;
                            dateStart = xmlnode.Node(xmdObj["history"][xmdObj["history"].length - 1], "date").innerHTML;*/
                            if (gold != "-")
                                actionAry.push(date)
                        }
                        var tmpDiv = tpl.fastPrint();
                        tmpDiv = tmpDiv.replace("*TOTAL_GOLD*", util.showTxt(xmdObj["total_gold"]));
                        tmpDiv = tmpDiv.replace("*TOTAL_VGOLD*", util.showTxt(xmdObj["total_vgold"]));
                        var showTotal = xmdObj["total_winloss"];
                        if (xmdObj["total_winloss"] != "")
                            if (xmdObj["total_winloss"] * 1 == 0)
                                showTotal = "<font color=black>" + util.showTxt(xmdObj["total_winloss"]) + "</font>";
                        tmpDiv = tmpDiv.replace("*TOTAL_WINLOSS*", util.showTxt(showTotal));
                        tmpDiv = tmpDiv.replace("*TOTAL_WINLOSS_CLASS*", util.showTxt(xmdObj["total_winloss_class"]));
                        if (xmdObj["history"].length > 0) {
                            _mc["div_show"].innerHTML = tmpDiv;
                            if (li_Hash == "" || option_Hash == "")
                                if (top.mobile == "Y") {
                                    for (var j = 0; j < date_ary_hash.length; j++)
                                        tmpOption += "<option id=" + date_ary_hash[j] + " value=" + date_ary_hash[j] + ">" + date_ary_hash[j] + "</option>";
                                    _mc["range_selStart"].innerHTML = tmpOption;
                                    _mc["range_selEnd"].innerHTML = tmpOption;
                                    option_Hash = tmpOption
                                } else {
                                    for (var j = 0; j < date_ary_hash.length; j++)
                                        tmpLi += "<li id=li_" + date_ary_hash[j] + ">" + date_ary_hash[j] + "</li>";
                                    _mc["date_Start_ul"].innerHTML = tmpLi;
                                    _mc["date_End_ul"].innerHTML = tmpLi;
                                    li_Hash = tmpLi;
                                    for (var i = 0; i < date_ary_hash.length; i++) {
                                        var liStartObj = dom.getElementById("date_Start_ul").children[i];
                                        var liEndObj = dom.getElementById("date_End_ul").children[i];
                                        util.addEvent(liStartObj, "click", _self.clickDate, {
                                            "date": date_ary_hash[i],
                                            "from": "Start"
                                        });
                                        util.addEvent(liEndObj, "click", _self.clickDate, {
                                            "date": date_ary_hash[i],
                                            "from": "End"
                                        })
                                    }
                                }
                            if (SelectStart == "")
                                SelectStart = dateStart;
                            if (SelectEnd == "")
                                SelectEnd = dateEnd;
                            if (isAll) {
                                SelectStart = dateStart;
                                SelectEnd = dateEnd
                            }
                            if (top.mobile != "Y") {
                                dom.getElementById("dateStart").innerHTML = util.showTxt(SelectStart);
                                dom.getElementById("dateEnd").innerHTML = util.showTxt(SelectEnd)
                            } else {
                                dom.getElementById("range_selStart").children[date_ary_hash.indexOf(SelectStart)].selected = "selected";
                                dom.getElementById("range_selEnd").children[date_ary_hash.indexOf(SelectEnd)].selected = "selected"
                            }
                        } else
                            _mc["div_show"].innerHTML = "";
                        for (var j = 0; j < actionAry.length; j++) {
                            var trObj = dom.getElementById("tr_" + actionAry[j]);
                            trObj.childNodes[1].className = "date word_bold";
                            top.viewGtype = top.dataGtype;
                            util.addEvent(trObj, "click", _self.goToHistoryView, {
                                "page": "history_view",
                                "viewDate": actionAry[j]
                            })
                        }
                    }
                    if (xmdObj["code"].innerHTML == "MSG") {
                        history_data_sw = "N";
                        _self.showNoHistoryData(true);
                        _mc["tool_date_select"].style.display = "none";
                        _mc["ph_tool_date_select"].style.display = "none";
                        _mc["div_show"].innerHTML = ""
                    }
                    _self.chgGtypeLoading(false);
                    _self.orientationChange();
                    parentClass.dispatchEvent("showLoading", {
                        "isShow": false
                    })
                }
                ;
                _self.clickDate = function(e, param) {
                    var target = dom.getElementById("date" + param.from);
                    var date_span = dom.getElementById("date_rang" + param.from + "_span");
                    var clickObj = null;
                    var lastClickObj = null;
                    var dateTxt = "";
                    var lightDate = null;
                    dateTxt = param.from == "Start" ? dom.getElementById("dateStart").innerHTML : dom.getElementById("dateEnd").innerHTML;
                    lightDate = dom.getElementById("date_" + param.from + "_ul").children[date_ary_hash.indexOf(dateTxt)];
                    if (param.from == "Start") {
                        if (tmpSelectStart != "") {
                            lastClickObj = dom.getElementById("date_Start_ul").children[date_ary_hash.indexOf(tmpSelectStart)];
                            util.removeClass(lastClickObj, "on")
                        } else
                            util.removeClass(lightDate, "on");
                        clickObj = dom.getElementById("date_Start_ul").children[date_ary_hash.indexOf(param.date)];
                        tmpSelectStart = param.date;
                        SelectStart = param.date
                    } else {
                        if (tmpSelectEnd != "") {
                            lastClickObj = dom.getElementById("date_End_ul").children[date_ary_hash.indexOf(tmpSelectEnd)];
                            util.removeClass(lastClickObj, "on")
                        } else
                            util.removeClass(lightDate, "on");
                        clickObj = dom.getElementById("date_End_ul").children[date_ary_hash.indexOf(param.date)];
                        tmpSelectEnd = param.date;
                        SelectEnd = param.date
                    }
                    util.addClass(clickObj, "on");
                    target.innerHTML = util.showTxt(param.date);
                    util.removeClass(date_span, "on")
                }
                ;
                _self.selectDate = function(e, param) {
                    var obj_id = "";
                    var ul_id = "";
                    var dateTxt = "";
                    var lightDate = null;
                    var obj_id = "date_rang" + param.target + "_span";
                    var ul_id = "date_" + param.target + "_ul";
                    dateTxt = param.target == "Start" ? dom.getElementById("dateStart").innerHTML : dom.getElementById("dateEnd").innerHTML;
                    lightDate = dom.getElementById("date_" + param.target + "_ul").children[date_ary_hash.indexOf(dateTxt)];
                    util.addClass(lightDate, "on");
                    util.pcDropdowns(obj_id, ul_id);
                    if (param.target == "End")
                        tmpSelectEnd = dateTxt;
                    else
                        tmpSelectStart = dateTxt;
                    util.removeClass(dom.getElementById(obj_id), "on");
                    util.addClass(dom.getElementById(obj_id), "on")
                }
                ;
                _self.phSelectDateChg = function(e, param) {
                    var obj = dom.getElementById("range_sel" + param.target);
                    var index = obj.selectedIndex;
                    var val = obj.options[index].value;
                    if (param.target == "Start")
                        SelectStart = val;
                    else
                        SelectEnd = val
                }
                ;
                _self.checkDate = function() {
                    var EndTS = "";
                    var StartTS = "";
                    StartTS = new Date(SelectStart);
                    EndTS = new Date(SelectEnd);
                    if (history_data_sw == "Y" && StartTS > EndTS) {
                        parentClass.dispatchEvent("showAlertMsg", {
                            "target": "message_pop",
                            "msg": LS_code.get("history_pop")
                        });
                        return false
                    }
                    return true
                }
                ;
                _self.showNoHistoryData = function(isOk) {
                    if (isOk) {
                        _mc["noHistoryData"].style.display = "";
                        _mc["tool_backtop"].style.display = "none";
                        _mc["more_date"].style.display = "none"
                    } else {
                        _mc["noHistoryData"].style.display = "none";
                        _mc["more_date"].style.display = ""
                    }
                }
                ;
                _self.goToHistoryView = function(e, param) {
                    top.viewDate = param.viewDate;
                    parentClass.dispatchEvent("bodyGoToPage", param)
                }
                ;
                _self.backTop = function(e, param) {
                    parentClass.dispatchEvent("initScrollAnimation", {
                        "action": "scrollTop"
                    });
                    util.backTopProc()
                }
                ;
                _self.roll = function(e, target) {
                    var body_h = _mc["body_show"].scrollHeight;
                    var view_h = _mc["body_show"].clientHeight;
                    var now_h = _mc["body_show"].scrollTop;
                    if (target == "history_data") {
                        _mc["tool_backtop"].style.display = "";
                        if (body_h - (view_h + now_h) <= 80)
                            parentClass.dispatchEvent("rollBottom", {
                                "page": "history_data",
                                "isBottom": true
                            });
                        else
                            parentClass.dispatchEvent("rollBottom", {
                                "page": "history_data",
                                "isBottom": false
                            })
                    }
                }
                ;
                _self.getNowPage = function() {
                    var tmpPage = "";
                    if (win._history.length != 0)
                        tmpPage = win._history[win._history.length - 1].page;
                    return tmpPage
                }
                ;
                _self.orientationChange = function() {
                    var orientation = win.Math.abs(win.orientation);
                    if (orientation == 90 || orientation == 0)
                        setTimeout(function() {
                            var body_h = _mc["body_show"].scrollHeight;
                            var view_h = _mc["body_show"].clientHeight;
                            _mc["tool_backtop"].style.display = body_h - view_h >= 10 ? "" : "none"
                        }, 500)
                }
                ;
                _self.exitEvent = function() {
                    win.removeEventListener("orientationchange", _self.orientationChange);
                    win.removeEventListener("resize", _self.orientationChange);
                    return true
                }
                ;
                _self.orientationblur = function() {
                    if (document.activeElement.tagName == "SELECT")
                        dom.activeElement.blur()
                }
                ;
                _self.chgGtypeLoading = function(isShow) {
                    if (isShow) {
                        _mc["tool_backtop"].style.display = "none";
                        _mc["noHistoryData"].style.display = "none";
                        _mc["div_show"].style.display = "none";
                        dom.getElementById("load").style.display = ""
                    } else {
                        _mc["div_show"].style.display = "";
                        dom.getElementById("load").style.display = "none"
                    }
                }
            }
            ;