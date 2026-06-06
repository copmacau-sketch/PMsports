function chg_id(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var CookieManager = new win.CookieManager;
    var LS;
    var abox4pwd_notshow = new Array;
    var scrolltag = "N";
    var classname = "chg_id";
    var myhash = {};
    _self.init = function () {
        dom.getElementById("show_username").innerHTML = top["userData"].passwd_safe;
        util.addEvent(dom.getElementById("check_name"), "click", _self.check_name);
        util.addEvent(dom.getElementById("login_btn"),
            "click", _self.chg_name);
        util.addEvent(dom.getElementById("cancel_btn"), "click", _self.cancel_btn);
        util.addEvent(dom.getElementById("username"), "focusin", _self.inputfocuschk, {"target": "username"});
        util.addEvent(dom.getElementById("username"), "focusout", _self.inputBlur, {"target": "username"});
        util.addEvent(dom.getElementById("cghid_help"), "click", _self.cghid_help);
        util.addEvent(dom.getElementById("chgid_dele"), "click", _self.chgid_dele);
        parentClass.dispatchEvent("loginFullLoading", {"isShow": false})
    };
    _self.setParentclass =
        function (_parentclass) {
            parentClass = _parentclass;
            util = parentClass.getThis("util");
            LS = parentClass.getThis("LS");
            LS_code = parentClass.getThis("LS_code")
        };
    _self.getThis = function (varible) {
        if (!myhash[varible]) {
            var msg = "no myhash[" + varible + "]";
            util.writeLog(classname, msg)
        }
        return myhash[varible]
    };
    _self.onkeyup = function (e) {
        if (e.keyCode) {
            dom.getElementById("check_name").className = "btn_choose";
            if (e.keyCode == 8) dom.getElementById("icon_status").className = ""
        }
        if (dom.getElementById("username").value == "") dom.getElementById("check_name").className =
            "btn_choose unable"
    };
    _self.inputfocuschk = function (e, param) {
        util.chkuc(_self.inputFocus, param)
    };
    _self.inputFocus = function (param) {
        util.addClass(document.body, "keyin_scroll");
        util.addEvent(dom.getElementById("username"), "keyup", _self.onkeyup);
        if (param.target == "username") {
            if (dom.getElementById("lab_login").className == "error lab_input") {
                dom.getElementById("icon_status").style.display = "";
                var username = dom.getElementById("username");
                username.selectionStart = 0;
                username.selectionEnd = username.value.length
            } else dom.getElementById("icon_status").style.display =
                "none";
            dom.getElementById("lab_login").classList.add("on")
        }
    };
    _self.inputBlur = function (e, param) {
        _self.orientation();
        util.removeClass(document.body, "keyin_scroll");
        if (param.target == "username") {
            dom.getElementById("lab_login").classList.remove("on");
            if (dom.getElementById("lab_login").className == "error lab_input") dom.getElementById("icon_status").style.display = ""; else dom.getElementById("lab_login").className = "lab_input"
        }
    };
    _self.exitEvent = function () {
        return true
    };
    _self.addEventListener = function (eventname,
                                       eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
    _self.check_name = function () {
        var urlParams = "";
        urlParams += "username=" + top["userData"].username;
        urlParams += "&chk_name=" + dom.getElementById("username").value;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams = "p=mem_chk&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.connectComplete = function (msg) {
        var errorMsg = util.showConnectMsg(msg);
        if (util.alertConnectMsg(errorMsg)) return;
        var msg_arr = msg.split(";");
        var chk_Acc = xmlnode.Node(xmlnode.Root[0], "msg").innerHTML;
        var type = xmlnode.Node(xmlnode.Root[0], "type").innerHTML;
        dom.getElementById("icon_status").style.display = "";
        dom.getElementById("chgid_text_error").style.display = "";
        dom.getElementById("check_name").className =
            "btn_choose unable";
        if (chk_Acc == "N") {
            dom.getElementById("chgid_text_error").innerHTML = util.showTxt(type);
            dom.getElementById("chgid_text_error").className = "text_msg";
            dom.getElementById("icon_status").className = "icon_status";
            dom.getElementById("lab_login").className = "lab_input"
        } else if (chk_Acc == "L") {
            if (dom.getElementById("username").value == "") dom.getElementById("chgid_text_error").innerHTML = LS_code.get("chgid_error"); else dom.getElementById("chgid_text_error").innerHTML = LS_code.get("chgid_error_rule");
            var e = dom.getElementById("username").value.replace(/\s*/g, "");
            dom.getElementById("username").value = e;
            dom.getElementById("chgid_text_error").className = "text_msg error";
            dom.getElementById("icon_status").className = "icon_status error";
            dom.getElementById("lab_login").className = "error lab_input"
        } else if (chk_Acc == "Y") {
            dom.getElementById("chgid_text_error").innerHTML = LS_code.get("chgid_error_duplicate");
            dom.getElementById("chgid_text_error").className = "text_msg error";
            dom.getElementById("icon_status").className =
                "icon_status error";
            dom.getElementById("lab_login").className = "error lab_input"
        }
    };
    _self.onError = function () {
    };
    _self.chg_name = function () {
        util.removeEvent(dom.getElementById("login_btn"), "click");
        var urlParams = "";
        urlParams += "username=" + top["userData"].username;
        urlParams += "&chk_name=" + dom.getElementById("username").value;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams = "p=chg_passwd_safe&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError",
            _self.onError);
        getHTML.addEventListener("LoadComplete", _self.chg_Name_ConnectComplete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.getMemSet = function () {
        var par = "";
        par += "p=memSet";
        par += "&langx=" + top.langx;
        par += "&uid=" + top["userData"].uid;
        par += "&action=check";
        var hr = new HttpRequest;
        hr.addEventListener("LoadComplete", _self.getMemSetFinish);
        hr.loadURL(top.m2_url, "POST", par)
    };
    _self.getMemSetFinish = function (data) {
        var errorMsg = util.showConnectMsg(data);
        if (util.alertConnectMsg(errorMsg)) return;
        if (data !=
            "") {
            try {
                var memSet = JSON.parse(data);
                var odds_length = top["userData"].odd_f.split(",");
                top["memSet"] = memSet;
                if (memSet.odd_f_type) for (var i = 0; i < odds_length.length; i++) if (odds_length[i] == memSet.odd_f_type) top["userData"].odd_f_type = memSet.odd_f_type
            } catch (e) {
            }
            _self.chg_Complete()
        }
    };
    _self.chg_Name_ConnectComplete = function (msg) {
        var errorMsg = util.showConnectMsg(msg);
        var acc_Used = xmlnode.Node(xmlnode.Root[0], "msg").innerHTML;
        console.log("acc_Used", acc_Used);
        if (util.alertConnectMsg(errorMsg)) return;
        if (acc_Used !=
            "N") {
            util.addEvent(dom.getElementById("login_btn"), "click", _self.chg_name);
            dom.getElementById("icon_status").style.display = "";
            if (document.getElementById("username").value == "") {
                dom.getElementById("chgid_text_error").innerHTML = LS_code.get("chgid_error");
                dom.getElementById("icon_status").className = ""
            } else if (acc_Used == "L") {
                var e = dom.getElementById("username").value.replace(/\s*/g, "");
                dom.getElementById("username").value = e;
                dom.getElementById("chgid_text_error").innerHTML = LS_code.get("chgid_error_rule");
                dom.getElementById("icon_status").className = "icon_status error"
            } else if (acc_Used == "Y") {
                dom.getElementById("chgid_text_error").innerHTML = LS_code.get("chgid_error_duplicate");
                dom.getElementById("icon_status").className = "icon_status error"
            } else if (acc_Used == "P") {
                dom.getElementById("chgid_text_error").innerHTML = LS_code.get("chgid_error_passwd");
                dom.getElementById("icon_status").className = "icon_status error"
            }
            dom.getElementById("chgid_text_error").style.display = "";
            dom.getElementById("chgid_text_error").className =
                "text_msg error";
            dom.getElementById("check_name").className = "btn_choose unable";
            dom.getElementById("lab_login").className = "error lab_input"
        } else _self.getMemSet()
    };
    _self.chg_Complete = function () {
        var inputUID = top["userData"].passwd_safe.toLowerCase().trim();
        var cookieUID = CookieManager.get("PID") ? CookieManager.get("UID").toLowerCase().trim() : "";
        if (CookieManager.get("box4pwd_notshow_" + top["userData"].mid) != null) abox4pwd_notshow = CookieManager.get("box4pwd_notshow_" + top["userData"].mid).split("_");
        if (!top["memSet"].passcode &&
            CookieManager.get("PID") || !top["memSet"].passcode && !CookieManager.get("PID") || !top["memSet"].passcode || top["memSet"].passcode == "[del]" || top["memSet"].passcode == "[del1]") {
            if (abox4pwd_notshow[1] != "Y") top["userData"].four_pwd = "new"
        } else if (top["memSet"].passcode && !CookieManager.get("PID") || (CookieManager.get("UID") != top["userData"].passwd_safe || !CookieManager.get("UID"))) {
            if (abox4pwd_notshow[1] != "Y") top["userData"].four_pwd = "second"
        } else if (top["errorTwice"] && cookieUID == inputUID) top["userData"].four_pwd =
            "errorTwice";
        if (top.mobile != "Y") parentClass.dispatchEvent("showAlertMsg", {
            "target": "C_alert_ok",
            "msg": LS_code.get("chgid_complete"),
            "confirm": "N",
            "retFun": _self.go_Chg_Pwd
        }); else parentClass.dispatchEvent("showAlertMsg", {
            "target": "alert_OK",
            "msg": LS_code.get("chgid_complete"),
            "confirm": "N",
            "retFun": _self.go_Chg_Pwd
        })
    };
    _self.go_Chg_Pwd = function () {
        console.log(top["userData"].four_pwd);
        if (top["userData"].msg == "104") _self.gotologin(); else {
            top["userData"].passwd_safe = dom.getElementById("username").value;
            parentClass.dispatchEvent("showchg_pwd", {})
        }
    };
    _self.gotologin = function () {
        parentClass.dispatchEvent("loginFullLoading", {"isShow": true});
        parentClass.dispatchEvent("SerrefreshPage");
        parentClass.dispatchEvent("createSerTimer", {});
        _self.loginchk()
    };
    _self.loginchk = function () {
        parentClass.dispatchEvent("loginSuccess", {});
        parentClass.dispatchEvent("checkCount", {});
        top["userData"].passwd_safe = dom.getElementById("username").value;
        if (CookieManager.get("PID")) CookieManager.del("PID");
        if (CookieManager.get("UID")) CookieManager.del("UID")
    };
    _self.cancel_btn = function () {
        parentClass.dispatchEvent("SerrefreshPage");
        parentClass.dispatchEvent("show_back_login", {});
        parentClass.dispatchEvent("createSerTimer", {});
        top["userData"].uid = ""
    };
    _self.cghid_help = function () {
        parentClass.dispatchEvent("login_help")
    };
    _self.chgid_dele = function () {
        document.getElementById("username").value = ""
    };
    _self.orientation = function () {
        parentClass.dispatchEvent("scrollsetTop", {})
    }
};