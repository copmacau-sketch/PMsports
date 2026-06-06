function passcode(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util;
    var LS;
    var LS_code;
    var pwdAry = new Array;
    var chkAry = new Array;
    var rechk = false;
    var CookieManager;
    _self.classname = "passcode";
    _self.paramHash = new Object;
    var myhash = {};
    _self.init = function () {
        util.addEvent(dom.getElementById("toback"), "click", _self.toback);
        util.addEvent(dom.getElementById("back_login"), "click", _self.goToHome);
        util.addEvent(dom.getElementById("delpasscode"),
            "click", _self.delpasscode);
        util.addEvent(dom.getElementById("rm_btn"), "click", _self.rm_btn);
        util.addEvent(dom.getElementById("chg_btn"), "click", _self.chg_btn);
        util.addEvent(dom.getElementById("set_end"), "click", _self.goToHome);
        util.addEvent(dom.getElementById("delall"), "click", _self.reSet);
        for (var i = 0; i < 10; i++) util.addEvent(dom.getElementById("key_" + i), "click", _self.keyclick, {"val": i});
        _self.showDiv();
        parentClass.dispatchEvent("checkCount", {});
        if (top["userData"].newalertMsg == "Y") {
            delete top["userData"].newalertMsg;
            top["userData"].four_pwd = "new"
        }
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS_code = parentClass.getThis("LS_code");
        LS = parentClass.getThis("LS");
        CookieManager = parentClass.getThis("CookieManager")
    };
    _self.getThis = function (varible) {
        if (!myhash[varible]) {
            var msg = "no myhash[" + varible + "]";
            util.writeLog(classname, msg)
        }
        return myhash[varible]
    };
    _self.exitEvent = function () {
        return true
    };
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] =
            eventFunction
    };
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
    _self.toback = function () {
        parentClass.dispatchEvent("backPage", {})
    };
    _self.showDiv = function () {
        if (top["memSet"].passcode && top["memSet"].passcode.match(/^[0-9]{4}$/)) {
            dom.getElementById("oth_pass_lab").style.display = "";
            dom.getElementById("oth_pass_1").style.display = "";
            dom.getElementById("oth_pass_btn1").style.display = ""
        } else dom.getElementById("oth_pass_set").style.display = "";
        parentClass.dispatchEvent("loginFullLoading",
            {"isShow": false})
    };
    _self.onError = function () {
    };
    _self.keyclick = function (e, param) {
        dom.getElementById("code_err").style.display = "none";
        var tmpAry = !rechk ? pwdAry : chkAry;
        tmpAry.push(param.val);
        util.setObjectClass(dom.getElementById("li_" + tmpAry.length), "active");
        if (tmpAry.length == 4) if (!rechk) {
            rechk = true;
            dom.getElementById("intocode").style.display = "none";
            dom.getElementById("chkcode").style.display = "";
            dom.getElementById("delall").style.display = "";
            dom.getElementById("chkmsg").innerHTML = LS_code.get("4pwd_onepassd");
            _self.delall()
        } else if (pwdAry.join("") == chkAry.join("")) {
            _self.sendcode();
            dom.getElementById("oth_pass_set").style.display = "none";
            dom.getElementById("into_success").style.display = "";
            var passwd_safe = top["userData"].passwd_safe;
            CookieManager.set("UID", passwd_safe)
        } else {
            dom.getElementById("code_err").innerText = LS_code.get("4pwd_doubleCheck_fail");
            dom.getElementById("code_err").style.display = "";
            _self.delall();
            util.clearArray(chkAry)
        }
    };
    _self.delpasscode = function (e, param) {
        var tmpAry = !rechk ? pwdAry : chkAry;
        if (tmpAry.length > 0) {
            util.setObjectClass(dom.getElementById("li_" + tmpAry.length), "");
            tmpAry.pop()
        }
    };
    _self.delall = function () {
        dom.getElementById("intocode").style.display = "none";
        dom.getElementById("chkcode").style.display = "";
        dom.getElementById("delall").style.display = "";
        _self.clearStatus()
    };
    _self.clearStatus = function () {
        for (var i = 1; i <= 4; i++) util.setObjectClass(dom.getElementById("li_" + i), "")
    };
    _self.reSet = function () {
        dom.getElementById("chkmsg").innerHTML = LS_code.get("4pwd_fistcome");
        dom.getElementById("intocode").style.display =
            "";
        dom.getElementById("chkcode").style.display = "none";
        dom.getElementById("delall").style.display = "none";
        dom.getElementById("code_err").style.display = "none";
        util.clearArray(pwdAry);
        util.clearArray(chkAry);
        rechk = false;
        _self.clearStatus()
    };
    _self.sendcode = function () {
        action = "send";
        var code = '{"passcode":"' + pwdAry.join("") + '"}';
        var urlParams = "p=memSet";
        urlParams += "&" + top.param;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&val=" + code;
        urlParams += "&action=" + action;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError",
            _self.onError);
        getHTML.addEventListener("LoadComplete", _self.send_Complete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.send_Complete = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        top["memSet"].passcode = pwdAry.join("");
        _self.setPassCode()
    };
    _self.rm_btn = function () {
        parentClass.dispatchEvent("showAlertMsg", {
            "target": "C_alert_confirm",
            "msg": LS.get("4pwd_chkdel"),
            "confirm": "Y",
            "retFun": _self.rmalertMsg
        });
        dom.getElementById("C_popup_checkbox").style.display =
            "none"
    };
    _self.chg_btn = function () {
        dom.getElementById("oth_pass_lab").style.display = "none";
        dom.getElementById("oth_pass_set").style.display = ""
    };
    _self.rm_4pwd = function () {
        action = "send";
        CookieManager.set("now_passcode", "[del]");
        var code = '{"passcode":"[del]"}';
        var urlParams = "p=memSet";
        urlParams += "&" + top.param;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&val=" + code;
        urlParams += "&action=" + action;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete",
            _self.rm_4pwd_Complete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.rm_4pwd_Complete = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        top["userData"]["secondSet4pwd"] = null;
        top.memSet.passcode = "[del]";
        parentClass.dispatchEvent("showAlertMsg", {
            "target": "alert_ok",
            "msg": LS.get("4pwd_del"),
            "retFun": _self.goToHome
        })
    };
    _self.setPassCode = function () {
        var tmp_date = (new Date).toJSON().slice(0, 10);
        action = "SET";
        var urlParams = "";
        urlParams += "p=checkPassCode";
        urlParams +=
            "&" + top.param;
        urlParams += "&inputCode=" + top["userData"].passwd_safe + "|" + top["memSet"].passcode + "|" + top["userData"].mid + "|N|" + tmp_date;
        urlParams += "&action=" + action;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.encodePassCodeFinish);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.encodePassCodeFinish = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        var xmdObj = new Object;
        xmlnode =
            util.parseXml(xml);
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
        if (xmdObj["code"].innerHTML == "484") {
            var getPID = xmlnode.Node(xmlnode.Root[0], "data").innerHTML;
            CookieManager.set("PID", util.showTxt(encodeURIComponent(getPID)), 3650);
            CookieManager.set("UID", top["userData"].passwd_safe, 3650);
            top["userData"]["secondSet4pwd"] = "Y"
        }
    };
    _self.goToHome = function () {
        parentClass.dispatchEvent("bodyGoToPage", {"page": "home"})
    };
    _self.rmalertMsg = function (type) {
        if (type == "yes") {
            CookieManager.del("PID");
            CookieManager.del("UID");
            _self.rm_4pwd()
        }
    }
};