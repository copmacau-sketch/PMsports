function message(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var _mc = new Object;
    var _select_date = "-4";
    var _important = "0";
    var CookieManager = new win.CookieManager;
    var setCookie = new Object;
    var scrolltag = "N";
    setCookie[0] = "Gen_cookie";
    setCookie[1] = "Imp_cookie";
    setCookie[2] = "Per_cookie";
    var t_important = _important;
    _self.classname = "message";
    _self.init = function () {
        _mc["message_selectclear_btn"] = dom.getElementById("message_selectclear_btn");
        _mc["message_clear_btn"] = dom.getElementById("message_clear_btn");
        _mc["message_back_btn"] = dom.getElementById("message_back_btn");
        _mc["message_search_btn"] = dom.getElementById("message_search_btn");
        _mc["message_select"] = dom.getElementById("message_select");
        _mc["message_text"] = dom.getElementById("message_text");
        _mc["message_noinfo"] = dom.getElementById("message_noinfo");
        _mc["message_all"] = dom.getElementById("message_all");
        _mc["message_today"] = dom.getElementById("message_today");
        _mc["message_oldtoday"] =
            dom.getElementById("message_oldtoday");
        _mc["message_General"] = dom.getElementById("message_General");
        _mc["message_Important"] = dom.getElementById("message_Important");
        _mc["message_Personal"] = dom.getElementById("message_Personal");
        _mc["message_enterbox"] = dom.getElementById("message_enterbox");
        util.addEvent(_mc["message_selectclear_btn"], "click", _self.message_clear, {"date": "selectclear"});
        util.addEvent(_mc["message_clear_btn"], "click", _self.message_clear, {"date": "clear"});
        util.addEvent(_mc["message_back_btn"],
            "click", _self.message_back);
        util.addEvent(_mc["message_search_btn"], "click", _self.message_searchopen);
        util.addEvent(_mc["message_all"], "click", _self.message_date_btn, {"date": "all", "num": "-4"});
        util.addEvent(_mc["message_today"], "click", _self.message_date_btn, {"date": "today", "num": "0"});
        util.addEvent(_mc["message_oldtoday"], "click", _self.message_date_btn, {"date": "oldtoday", "num": "-1"});
        util.addEvent(_mc["message_General"], "click", _self.message_msg_btn, {"msg": "General", "num": "0"});
        util.addEvent(_mc["message_Important"],
            "click", _self.message_msg_btn, {"msg": "Important", "num": "1"});
        util.addEvent(_mc["message_Personal"], "click", _self.message_msg_btn, {"msg": "Personal", "num": "2"});
        util.addEvent(_mc["message_text"], "focusin", _self.message_text_btn);
        util.addEvent(_mc["message_text"], "keyup", _self.message_text_returnbtn);
        util.addEvent(_mc["message_text"], "focusout", _self.message_text_blur_btn);
        if (window.event) _mc["message_text"].onkeypress = function () {
            key_value(event)
        }; else _mc["message_text"].onkeypress = function (event) {
            key_value(event)
        };
        if (top.impchk == "Y") _self.setCount(top.impchk, "Important");
        if (top.perchk == "Y") _self.setCount(top.perchk, "Personal");
        _self.getdata()
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS")
    };
    _self.getThis = function (varible) {
        if (!myhash[varible]) {
            var msg = "no myhash[" + varible + "]";
            util.writeLog(classname, msg)
        }
        return myhash[varible]
    };
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent =
        function (eventname, param) {
            if (eventHandler[eventname]) eventHandler[eventname](param)
        };
    _self.getdata = function () {
        var urlParams = "";
        var _substr = "";
        if (_mc["message_text"].value != "") _substr = "&find=" + _mc["message_text"].value;
        urlParams += "username=" + top["userData"].username;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&select_date=" + _select_date + _substr;
        urlParams += "&t_important=" + _important;
        urlParams = "p=messageget&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.loadmsgComplete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.loadmsgComplete = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        var xmdObj = new Object;
        var xmlnode = util.parseXml(xml);
        xmdObj["game"] = xmlnode.Node(xmlnode.Root[0], "game", false);
        max_id = xmlnode.Node(xmlnode.Root[0], "max_id").innerHTML;
        var message_showmsg = dom.getElementById("message_showmsg");
        var SampleTable =
            dom.getElementById("message_msg");
        var tpl = new fastTemplate_a1;
        tpl.init(SampleTable);
        for (var i = 0; i < xmdObj["game"].length; i++) {
            var adddate = xmlnode.Node(xmdObj["game"][i], "adddate").innerHTML;
            var msg = xmlnode.Node(xmdObj["game"][i], "msg").innerHTML;
            tpl.addBlock("tr");
            tpl.replace("*ADDDATE*", util.showTxt(adddate));
            tpl.replace("*MSG*", util.showTxt(msg))
        }
        if (xmdObj["game"].length > 0) {
            message_showmsg.style.display = "";
            message_showmsg.innerHTML = tpl.fastPrint();
            _mc["message_noinfo"].style.display = "none"
        } else {
            message_showmsg.style.display =
                "none";
            message_showmsg.innerHTML = "";
            _mc["message_noinfo"].style.display = ""
        }
        parentClass.dispatchEvent("showLoading", {"isShow": false});
        _self.getcookie()
    };
    _self.getcookie = function () {
        if (setCookie[t_important] != "Per_cookie") {
            var cookieValue = "";
            var cookiestr = CookieManager.get(setCookie[t_important] + "_" + top["userData"].mid);
            if (cookiestr) {
                var splitcookie = cookiestr.split("_");
                if (splitcookie[1] == top["userData"].mid) cookieValue = splitcookie[0]
            }
            if (max_id * 1 > cookieValue * 1) {
                cookievalue = max_id + "_" + top["userData"].mid;
                CookieManager.set(setCookie[t_important] + "_" + top["userData"].mid, cookievalue)
            }
        }
    };
    _self.setCount = function (count, name) {
        if (count * 1 == 0 || count == "") {
            if (_mc["message_" + name].className != "active") _mc["message_" + name].className = ""
        } else _mc["message_" + name].className = "on"
    };
    _self.onError = function () {
    };
    _self.message_clear = function (mouseEvent, date) {
        if (date.date == "clear") {
            _mc["message_search_btn"].classList.remove("on");
            _mc["message_select"].style.display = "none";
            _mc["message_text"].value = "";
            _self.getdata()
        } else {
            _mc["message_text"].value =
                "";
            _self.getdata()
        }
    };
    _self.message_back = function () {
        parentClass.dispatchEvent("backPage", {})
    };
    _self.message_searchopen = function () {
        if (_mc["message_select"].style.display == "") {
            _mc["message_search_btn"].classList.remove("on");
            _mc["message_select"].style.display = "none"
        } else {
            _mc["message_search_btn"].classList.add("on");
            _mc["message_select"].style.display = ""
        }
    };
    _self.message_text_btn = function (e) {
        util.addClass(document.body, "keyin_scroll");
        util.addClass(_mc["message_enterbox"], "on")
    };
    _self.message_text_returnbtn =
        function (e) {
            if (e.keyCode == 0) charCode = event.which; else charCode = event.keyCode ? event.keyCode : event.which;
            if (charCode == "13") document.activeElement.blur()
        };
    _self.message_text_blur_btn = function () {
        _self.orientation();
        util.removeClass(document.body, "keyin_scroll");
        util.removeClass(_mc["message_enterbox"], "on")
    };

    function key_value(evt) {
        var key = window.event ? evt.keyCode : evt.which;
        if (key == "13") _self.getdata()
    }

    _self.message_date_btn = function (mouseEvent, date) {
        dom.getElementById("message_showmsg").innerHTML = "";
        _self.restSelDay("message_" + date.date);
        _select_date = date.num;
        top._selectchk = date.num;
        _self.getdata()
    };
    _self.message_msg_btn = function (mouseEvent, msg) {
        var readyet = false;
        if (msg.msg == "Important") {
            if (top.impchk != "N") readyet = true;
            top.impchk = "N"
        } else if (msg.msg == "Personal") {
            if (top.perchk != "N") readyet = true;
            top.perchk = "N"
        }
        if (top.impchk == "N" && top.perchk == "N" && readyet) parentClass.dispatchEvent("resetmsg", {});
        dom.getElementById("message_showmsg").innerHTML = "";
        _self.restSelImportant("message_" + msg.msg);
        if (top._selectchk ==
            "-4") _self.restSelDay("message_all"); else if (top._selectchk == "0") _self.restSelDay("message_today"); else if (top._selectchk == "-1") _self.restSelDay("message_oldtoday");
        _important = msg.num;
        t_important = _important;
        _self.getdata()
    };
    _self.restSelDay = function (btn_name) {
        _mc["message_all"].className = "";
        _mc["message_today"].className = "";
        _mc["message_oldtoday"].className = "";
        _mc[btn_name].className = "active"
    };
    _self.restSelImportant = function (btn_name) {
        _mc["message_General"].className = "";
        if (_mc["message_Important"].className !=
            "on") _mc["message_Important"].className = "";
        if (_mc["message_Personal"].className != "on") _mc["message_Personal"].className = "";
        _mc[btn_name].className = "active"
    };
    _self.orientation = function () {
        parentClass.dispatchEvent("scrollsetTop", {})
    };
    _self.exitEvent = function () {
        return true
    }
};