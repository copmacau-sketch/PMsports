function announcement(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util;
    var LS;
    var ann_ver = "202209";
    var ann_sw = "N";
    var betHold_sw = "N";
    var CookieManager = new win.CookieManager;
    var _mc = new Object;
    var classname = "announcement";
    var myhash = {};
    _self.init = function () {
        document.getElementById("body_show").classList.add("scroll_lock");
        parentClass.dispatchEvent("showLoading", {"isShow": false});
        document.getElementById("home_show").removeAttribute("style");
        if (document.getElementById("home_touch_div_320")) document.getElementById("home_touch_div_320").classList.remove("sideshow_hide");
        if (document.getElementById("home_touch_div_640")) document.getElementById("home_touch_div_640").classList.remove("sideshow_hide");
        if (document.getElementById("home_touch_div_320_ios")) document.getElementById("home_touch_div_320_ios").classList.remove("sideshow_hide");
        if (document.getElementById("home_touch_div_640_ios")) document.getElementById("home_touch_div_640_ios").classList.remove("sideshow_hide");
        util.addEvent(dom.getElementById("goPage"), "click", _self.close_btn, {
            "btn": "goPage",
            "page": "features",
            "data": "data_7"
        });
        util.addEvent(dom.getElementById("close_btn"), "click", _self.close_btn, {"btn": "close"});
        util.addEvent(dom.getElementById("close_btn1"), "click", _self.close_btn, {"btn": "close1"});
        util.addEvent(dom.getElementById("close_ann"), "click", _self.close_btn, {"btn": "close"})
    };
    _self.goToNewFun = function (e, param) {
        _self.close_btn(e, {"btn": "close"});
        _self.chgPage(e, param)
    };
    _self.chgPage = function (e,
                              param) {
        parentClass.dispatchEvent("bodyGoToPage", param)
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
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
    _self.close_btn = function (e, param) {
        _self.hide_announcement(param);
        parentClass.dispatchEvent("annlock", {"sw": false});
        parentClass.dispatchEvent("removebodylock", {})
    };
    _self.showCloseBtn = function () {
        document.getElementById("close_btn1").style.display = ""
    };
    _self.roll = function () {
        if (document.getElementById("ann_scroll01").scrollTop > 0) document.getElementById("ann_title01").classList.add("active"); else document.getElementById("ann_title01").classList.remove("active")
    };
    _self.ann_message = function () {
        var urlParams = "";
        urlParams += "username=" + top["userData"].username;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&select_date=-4";
        urlParams += "&t_important=4";
        urlParams = "p=messageget&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.connectComplete = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        var xmlnode = util.parseXml(xml);
        var ann_msg = util.showTxt(xmlnode.Node(xmlnode.Root[0], "annmsg").innerHTML);
        var msg_id = util.showTxt(xmlnode.Node(xmlnode.Root[0], "id").innerHTML);
        if (ann_msg != "") ann_sw = "Y"; else ann_sw = "N";
        _self.show_announcement(ann_msg)
    };
    _self.show_announcement = function (msg) {
        document.getElementById("announcement_show").className = "popup on";
        show_sw = top.notice_sw == "Y" && CookieManager.get("announcement_" + top["userData"].mid + "_" + ann_ver) == null ? "Y" : "N";
        if (ann_sw == "Y") {
            parentClass.dispatchEvent("addbodylock");
            dom.getElementById("notice").style.display = "none";
            dom.getElementById("show_ann").style.display = "none";
            dom.getElementById("ann").style.display = "";
            dom.getElementById("now_msg").innerHTML = util.showTxt(msg)
        } else if (show_sw == "Y") {
            parentClass.dispatchEvent("addbodylock");
            dom.getElementById("notice").style.display = "none";
            dom.getElementById("show_ann").classList.add("on");
            dom.getElementById("show_ann").style.display = ""
        } else {
            parentClass.dispatchEvent("annlock", {"sw": false});
            parentClass.dispatchEvent("removebodylock", {});
            document.getElementById("announcement_show").className = "popup";
            dom.getElementById("notice").style.display = "none";
            dom.getElementById("show_ann").style.display = "none";
            dom.getElementById("ann").style.display = "none"
        }
        parentClass.dispatchEvent("checkCount", {})
    };
    _self.hide_announcement = function (param) {
        if (param.btn == "close" || param.btn == "goPage") {
            dom.getElementById("show_ann").style.display = "none";
            dom.getElementById("announcement_show").className = "popup";
            CookieManager.set("announcement_" + top["userData"].mid + "_" + ann_ver, top["userData"].mid + "_N");
            if (param.btn == "goPage") parentClass.dispatchEvent("bodyGoToPage", param);
            _self.ann_message()
        } else if (param.btn == "close1") {
            dom.getElementById("ann").style.display = "none";
            dom.getElementById("announcement_show").className = "popup"
        }
    }
};