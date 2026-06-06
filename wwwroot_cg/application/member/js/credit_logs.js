function credit_logs(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var _mc = new Object;
    var _nowPage = 1;
    var _pageCount = 30;
    var date_type;
    var dateValueAry = new Array("d_07", "d_14", "d_21", "d_28");
    _self.init = function () {
        date_type = 7;
        _mc["allsports"] = document.getElementById("allsports");
        _mc["backtop"] = dom.getElementById("backtop");
        _mc["tool_backtop"] = dom.getElementById("tool_backtop");
        _mc["no_creditlogs"] =
            dom.getElementById("no_creditlogs");
        _mc["div_show"] = dom.getElementById("div_show");
        _mc["body_show"] = dom.getElementById("body_show");
        util.addEvent(dom.getElementById("title_todaywagers"), "click", _self.chgPage, {"page": "today_wagers"});
        util.addEvent(dom.getElementById("title_history"), "click", _self.chgPage, {"page": "history_data"});
        util.addEvent(_mc["backtop"], "click", _self.backTop);
        util.addEvent(dom.getElementById("backpage"), "click", _self.toBack);
        if (top.mobile != "Y") {
            _mc["pc_date_sel_div"] = dom.getElementById("pc_date_sel_div");
            util.addEvent(_mc["pc_date_sel_div"], "click", _self.initDateSelect)
        } else {
            _mc["date_sel"] = dom.getElementById("date_sel");
            util.addEvent(_mc["date_sel"], "blur", _self.selectBlur);
            util.addEvent(_mc["date_sel"], "change", _self.dateChange)
        }
        util.addEvent(_mc["allsports"], "click", _self.showViewMore);
        util.addEvent(_mc["body_show"], "scroll", _self.roll, _self.getNowPage());
        _self.loadCreditLog();
        win.addEventListener("orientationchange", _self.orientationChange);
        util.selectresizeblur(_self.orientationChange)
    };
    _self.initDateSelect =
        function (e) {
            if (_mc["pc_date_sel_div"].classList.contains("on")) util.removeClass(_mc["pc_date_sel_div"], "on"); else {
                util.addClass(_mc["pc_date_sel_div"], "on");
                util.pcDropdowns("pc_date_sel_div", "pc_date_sel")
            }
            var dateTxt = dom.getElementById("dateTxt");
            switch (e.target.id) {
                case "d_07":
                    dateTxt.innerHTML = util.showTxt(dom.getElementById("d_07").innerHTML);
                    break;
                case "d_14":
                    dateTxt.innerHTML = util.showTxt(dom.getElementById("d_14").innerHTML);
                    break;
                case "d_21":
                    dateTxt.innerHTML = util.showTxt(dom.getElementById("d_21").innerHTML);
                    break;
                case "d_28":
                    dateTxt.innerHTML = util.showTxt(dom.getElementById("d_28").innerHTML);
                    break;
                default:
                    break
            }
            util.pcDropdowns("pc_date_sel_div", "pc_date_sel");
            for (var i = 0; i < dateValueAry.length; i++) {
                var dateObj = dom.getElementById(dateValueAry[i]);
                util.removeClass(dateObj, "on");
                if (dateTxt.innerHTML == dateObj.innerHTML) util.addClass(dateObj, "on")
            }
            util.addEvent(dom.getElementById("d_07"), "click", _self.dateClickChg, {"id": 7});
            util.addEvent(dom.getElementById("d_14"), "click", _self.dateClickChg, {"id": 14});
            util.addEvent(dom.getElementById("d_21"),
                "click", _self.dateClickChg, {"id": 21});
            util.addEvent(dom.getElementById("d_28"), "click", _self.dateClickChg, {"id": 28})
        };
    _self.dateClickChg = function (e, param) {
        date_type = param.id;
        _self.loadCreditLog()
    };
    _self.selectBlur = function () {
        parentClass.dispatchEvent("scrollsetTop")
    };
    _self.dateChange = function (e) {
        date_type = e.target.value;
        _self.loadCreditLog()
    };
    _self.loadCreditLog = function () {
        var urlParams = "";
        urlParams += "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&selDate=" + date_type;
        urlParams =
            "p=get_credit_logs&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.loadCreditComplete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.loadCreditComplete = function (data) {
        var errorMsg = util.showConnectMsg(data);
        if (util.alertConnectMsg(errorMsg)) return;
        var json_data = JSON.parse(data);
        var tmp_screen = "";
        var from = 0;
        var limit = _nowPage * _pageCount;
        var totalLength = json_data["length"];
        _mc["tool_backtop"].style.display =
            "none";
        if (totalLength > limit) _mc["allsports"].style.display = ""; else _mc["allsports"].style.display = "none";
        if (limit > totalLength) limit = totalLength;
        if (totalLength >= 1) {
            _self.showNoCreditLogs(false);
            var SampleTable = document.getElementById("template_model2");
            var tpl = new fastTemplate_a1;
            tpl.init(SampleTable);
            for (var i = from; i < limit; i++) {
                gdate = json_data[i]["adddate"];
                payway = json_data[i]["payway"];
                gold = json_data[i]["gold"];
                user_cash = json_data[i]["cash"];
                tpl.addBlock("tr");
                var _date = gdate.split(" ");
                var data_name =
                    _date[0].substr(_date[0].indexOf("-") + 1);
                tpl.replace("*DATE*", util.showTxt(_date[0]));
                tpl.replace("*DATE_NAME*", util.showTxt(data_name));
                tpl.replace("*TIME_NAME*", util.showTxt(_date[1]));
                if (payway == 1) {
                    var tmp_balance = user_cash * 1 - gold * 1;
                    tpl.replace("*BALANCE*", util.showTxt(util.trans_thousand(tmp_balance.toFixed(2))));
                    tpl.replace("*GOLD*", util.showTxt(util.trans_thousand(gold)));
                    tpl.replace("*DEPOSIT*", util.showTxt(util.trans_thousand(gold)));
                    tpl.replace("*WITHDRAW*", "-")
                } else if (payway == -1) {
                    var tmp_balance =
                        user_cash * 1 + gold * 1;
                    tpl.replace("*BALANCE*", util.showTxt(util.trans_thousand(tmp_balance.toFixed(2))));
                    tpl.replace("*GOLD*", "-" + util.showTxt(util.trans_thousand(gold)));
                    tpl.replace("*WITHDRAW*", "-" + util.showTxt(util.trans_thousand(gold)));
                    tpl.replace("*DEPOSIT*", "-")
                }
                tpl.replace("*NEWBALANCE*", util.showTxt(util.trans_thousand(user_cash)))
            }
            var tmpDiv = tpl.fastPrint();
            _mc["div_show"].innerHTML = tmpDiv
        } else {
            _mc["div_show"].innerHTML = "";
            _self.showNoCreditLogs(true)
        }
        parentClass.dispatchEvent("showLoading",
            {"isShow": false})
    };
    _self.onError = function () {
        console.log("get_credit_logs fail")
    };
    _self.getNowPage = function () {
        var tmpPage = "";
        if (win._history.length != 0) tmpPage = win._history[win._history.length - 1].page;
        return tmpPage
    };
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
    _self.chgPage = function (e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage",
            param)
    };
    _self.toBack = function () {
        parentClass.dispatchEvent("backPage", {})
    };
    _self.showViewMore = function () {
        _nowPage++;
        _self.loadCreditLog()
    };
    _self.backTop = function (e, param) {
        _mc["body_show"].scrollTop = 0
    };
    _self.roll = function (e, target) {
        var body_h = _mc["body_show"].scrollHeight;
        var view_h = _mc["body_show"].clientHeight;
        var now_h = _mc["body_show"].scrollTop;
        if (target == "credit_logs") {
            _mc["tool_backtop"].style.display = "";
            if (body_h - (view_h + now_h) <= 80) parentClass.dispatchEvent("rollBottom", {
                "page": "credit_logs",
                "isBottom": true
            }); else parentClass.dispatchEvent("rollBottom", {"page": "credit_logs", "isBottom": false})
        }
    };
    _self.orientationChange = function () {
        var orientation = win.Math.abs(win.orientation);
        if (orientation == 90 || orientation == 0) setTimeout(function () {
            var body_h = _mc["body_show"].scrollHeight;
            var view_h = _mc["body_show"].clientHeight;
            _mc["tool_backtop"].style.display = body_h - view_h >= 10 ? "" : "none"
        }, 500)
    };
    _self.exitEvent = function () {
        win.removeEventListener("orientationchange", _self.orientationChange);
        win.removeEventListener("resize",
            _self.orientationChange);
        return true
    };
    _self.orientationblur = function () {
        if (document.activeElement.tagName == "SELECT") dom.activeElement.blur()
    };
    _self.showNoCreditLogs = function (isOk) {
        if (isOk) {
            _mc["no_creditlogs"].style.display = "";
            _mc["tool_backtop"].style.display = "none"
        } else _mc["no_creditlogs"].style.display = "none"
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass
    }
};