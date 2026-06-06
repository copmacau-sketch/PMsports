function chg_pwd(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var CookieManager = new win.CookieManager;
    var LS;
    var settime;
    var LS_code;
    var msg_arr = "";
    var NUMS = /[0-9]+/;
    var A_Z = /[a-zA-Z]+/;
    var abox4pwd_notshow = new Array;
    var arr_block_string = new Array("abc111", "abc222", "abc333", "abc444", "abc555", "abc666", "abc777", "abc888", "abc999", "abc000", "111abc", "222abc", "333abc", "444abc", "555abc", "666abc", "777abc",
        "888abc", "999abc", "000abc", "abc123", "123abc", "aaa123", "123aaa", "aaa1234", "1234aaa", "aa1234", "1234aa", "aa12345", "12345aa", "bbb123", "123bbb", "bbb1234", "1234bbb", "bb1234", "1234bb", "bb12345", "12345bb", "ccc123", "123ccc", "ccc1234", "1234ccc", "cc1234", "1234cc", "cc12345", "12345cc", "qwe123", "123qwe", "qwe1234", "1234qwe", "qwe12345", "12345qwe");
    var classname = "chg_pwd";
    var myhash = {};
    _self.init = function () {
        parentClass.dispatchEvent("loginFullLoading", {"isShow": false});
        util.addEvent(dom.getElementById("greenBtn"),
            "click", _self.greenBtn);
        util.addEvent(dom.getElementById("cancel"), "click", _self.cancel);
        util.addEvent(dom.getElementById("cancleBtn"), "click", _self.cancleBtn);
        util.addEvent(dom.getElementById("password"), "focusout", _self.inputBlur, {"target": "password"});
        util.addEvent(dom.getElementById("REpassword"), "focusout", _self.inputBlur, {"target": "REpassword"});
        util.addEvent(dom.getElementById("currentpwd_rd_dele"), "click", _self.allclear, {"click": "currentpwd"});
        util.addEvent(dom.getElementById("newpwd_rd_dele"),
            "click", _self.allclear, {"click": "newpwd"});
        util.addEvent(dom.getElementById("confirmpwd_rd_dele"), "click", _self.allclear, {"click": "confirmpwd"});
        util.addEvent(dom.getElementById("password"), "focusin", _self.inputfocuschk, {"target": "password"});
        util.addEvent(dom.getElementById("REpassword"), "focusin", _self.inputfocuschk, {"target": "REpassword"});
        parentClass.dispatchEvent("showAlertMsg", {
            "target": "C_alert_ok",
            "msg": LS.get("pls_chg_pwd"),
            "retFun": _self.openon
        })
    };
    _self.setParentclass = function (_parentclass) {
        parentClass =
            _parentclass;
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
    _self.inputfocuschk = function (e, param) {
        util.chkuc(_self.inputFocus, param)
    };
    _self.inputFocus = function (param) {
        util.addClass(document.body, "keyin_scroll");
        if (param.target == "password") {
            if (dom.getElementById("newpwd").className == "error lab_input") {
                var password =
                    document.getElementById("password");
                password.selectionStart = 0;
                password.selectionEnd = password.value.length
            }
            dom.getElementById("newpwd").classList.add("on")
        } else if (param.target == "REpassword") {
            if (dom.getElementById("confirmpwd").className == "error lab_input") {
                var REpassword = document.getElementById("REpassword");
                REpassword.selectionStart = 0;
                REpassword.selectionEnd = REpassword.value.length
            }
            dom.getElementById("confirmpwd").classList.add("on")
        }
    };
    _self.openon = function () {
        dom.getElementById("chgAcc_show").style.display =
            ""
    };
    _self.inputBlur = function (e, param) {
        _self.orientation();
        util.removeClass(document.body, "keyin_scroll");
        if (param.target == "password") {
            dom.getElementById("newpwd").classList.remove("on");
            if (dom.getElementById("newpwd").className != "error lab_input") dom.getElementById("newpwd").className = "lab_input"
        } else if (param.target == "REpassword") {
            dom.getElementById("confirmpwd").classList.remove("on");
            if (dom.getElementById("confirmpwd").className != "error lab_input") dom.getElementById("confirmpwd").className = "lab_input"
        }
    };
    _self.exitEvent = function () {
        return true
    };
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
    _self.greenBtn = function () {
        util.removeEvent(dom.getElementById("greenBtn"), "click");
        _self.chkAllpwd_step()
    };
    _self.chkAllpwd_step = function () {
        var str_char = 0;
        var arr_char = new Array;
        var str_len = dom.getElementById("password").value.length;
        for (var i = 0; i < str_len; i++) {
            var tmp_str =
                dom.getElementById("password").value.substr(i, 1);
            if (tmp_str.match(/[A-Za-z]/)) str_char++;
            arr_char[tmp_str] = true
        }
        dom.getElementById("chgpwd_text_error").style.display = "";
        var obj_ids = new Array("currentpwd", "newpwd", "confirmpwd");
        for (var i = 0; i < obj_ids.length; i++) dom.getElementById(obj_ids[i]).className = "lab_input";
        var errStr = "";
        var errAry = new Array;
        if (dom.getElementById("password").value == "" || dom.getElementById("REpassword").value == "") if (dom.getElementById("password").value == "") {
            errStr = "changepwd_password";
            errAry.push("newpwd")
        } else {
            if (dom.getElementById("REpassword").value == "") {
                errStr = "changepwd_REpassword";
                errAry.push("confirmpwd")
            }
        } else if (dom.getElementById("password").value != dom.getElementById("REpassword").value) {
            errStr = "changepwd_REpassworderror";
            errAry.push("newpwd");
            errAry.push("confirmpwd")
        } else if (top["userData"].passwd == dom.getElementById("password").value) {
            errStr = "changepwd_passworderror";
            errAry.push("currentpwd");
            errAry.push("newpwd");
            errAry.push("confirmpwd")
        } else if (dom.getElementById("password").value.length <
            6 || dom.getElementById("password").value.length > 12 || !util.checkVal(dom.getElementById("password").value)) {
            errStr = "rule_error_5";
            errAry.push("newpwd")
        } else if (Object.keys(arr_char).length <= 2 || arr_block_string.indexOf(dom.getElementById("password").value.toLowerCase()) >= 0) {
            errStr = "rule_error_3";
            errAry.push("newpwd")
        } else if (dom.getElementById("password").value.toLowerCase() == top["userData"].passwd_safe.toLowerCase()) {
            errStr = "chgid_error_passwd";
            errAry.push("newpwd")
        } else {
            dom.getElementById("chgpwd_text_error").style.display =
                "none";
            _self.chgnewpwd()
        }
        if (errAry.length != 0 && errStr != "") {
            util.addEvent(dom.getElementById("greenBtn"), "click", _self.greenBtn);
            for (var z = 0; z < errAry.length; z++) util.setObjectClass(dom.getElementById(errAry[z]), "error lab_input");
            dom.getElementById("chgpwd_text_error").innerHTML = LS_code.get(errStr)
        }
    };
    _self.chgnewpwd = function () {
        var urlParams = "";
        urlParams += "username=" + top["userData"].username;
        urlParams += "&old_password=" + dom.getElementById("oldpassword").value;
        urlParams += "&new_password=" + dom.getElementById("password").value;
        urlParams += "&chg_password=" + dom.getElementById("REpassword").value;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams = "p=chg_newpwd&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.connectComplete = function (msg) {
        var errorMsg = util.showConnectMsg(msg);
        if (util.alertConnectMsg(errorMsg)) return;
        var xmdObj = new Object;
        var xmlnode = util.parseXml(msg);
        xmdObj["status"] = xmlnode.Node(xmlnode.Root[0],
            "status");
        xmdObj["err"] = xmlnode.Node(xmlnode.Root[0], "err");
        if (xmdObj["status"].innerHTML == "error") {
            util.addEvent(dom.getElementById("greenBtn"), "click", _self.greenBtn);
            dom.getElementById("chgpwd_text_error").style.display = "";
            var obj_ids = new Array("currentpwd", "newpwd", "confirmpwd");
            for (var i = 0; i < obj_ids.length; i++) dom.getElementById(obj_ids[i]).className = "lab_input";
            var errStr = "";
            var errAry = new Array;
            switch (xmdObj["err"].innerHTML) {
                case "411":
                    errStr = "changepwd_password";
                    errAry.push("newpwd");
                    break;
                case "412":
                    errStr = "changepwd_REpassword";
                    errAry.push("confirmpwd");
                    break;
                case "413":
                    errStr = "changepwd_REpassworderror";
                    errAry.push("newpwd");
                    errAry.push("confirmpwd");
                    break;
                case "414":
                    errStr = "changepwd_passworderror";
                    errAry.push("currentpwd");
                    errAry.push("newpwd");
                    errAry.push("confirmpwd");
                    break;
                case "415":
                    errStr = "rule_error_5";
                    errAry.push("newpwd");
                    break;
                case "416":
                case "417":
                    errStr = "rule_error_3";
                    errAry.push("newpwd");
                    break;
                case "418":
                    errStr = "changepwd_oldpassworderror";
                    errAry.push("currentpwd");
                    break;
                case "419":
                    errStr = "chgid_error_passwd";
                    errAry.push("newpwd");
                    break;
                default:
                    errStr = "error";
                    errAry.push("currentpwd");
                    errAry.push("newpwd");
                    errAry.push("confirmpwd");
                    break
            }
            if (errAry.length != 0 && errStr != "") {
                for (var z = 0; z < errAry.length; z++) util.setObjectClass(dom.getElementById(errAry[z]), "error lab_input");
                dom.getElementById("chgpwd_text_error").innerHTML = LS_code.get(errStr)
            }
        } else {
            dom.getElementById("chgpwd_text_error").style.display = "none";
            _self.getMemSet()
        }
    };
    _self.getMemSet = function () {
        var par =
            "";
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
        if (data != "") try {
            var memSet = JSON.parse(data);
            var odds_length = top["userData"].odd_f.split(",");
            top["memSet"] = memSet;
            if (memSet.odd_f_type) for (var i = 0; i < odds_length.length; i++) if (odds_length[i] ==
                memSet.odd_f_type) top["userData"].odd_f_type = memSet.odd_f_type
        } catch (e) {
        }
        var inputUID = top["userData"].passwd_safe.toLowerCase().trim();
        var cookieUID = CookieManager.get("PID") ? CookieManager.get("UID").toLowerCase().trim() : "";
        if (CookieManager.get("box4pwd_notshow_" + top["userData"].mid) != null) abox4pwd_notshow = CookieManager.get("box4pwd_notshow_" + top["userData"].mid).split("_");
        if (!top["memSet"].passcode && CookieManager.get("PID") || !top["memSet"].passcode && !CookieManager.get("PID") || !top["memSet"].passcode ||
            top["memSet"].passcode == "[del]" || top["memSet"].passcode == "[del1]") {
            if (abox4pwd_notshow[1] != "Y") top["userData"].four_pwd = "new"
        } else if (top["memSet"].passcode && !CookieManager.get("PID") || (CookieManager.get("UID") != top["userData"].passwd_safe || !CookieManager.get("UID"))) {
            if (abox4pwd_notshow[1] != "Y") top["userData"].four_pwd = "second"
        } else if (top["errorTwice"] && cookieUID == inputUID) top["userData"].four_pwd = "errorTwice";
        top["userData"].passwd = "";
        parentClass.dispatchEvent("showAlertMsg", {
            "target": "C_alert_ok",
            "msg": LS_code.get("changepwd_passwordcomplete"), "retFun": _self.loginSuccess_New
        })
    };
    _self.onError = function () {
    };
    _self.cancel = function () {
        parentClass.dispatchEvent("showAlertMsg", {
            "target": "C_alert_confirm",
            "msg": LS_code.get("changepwd_stop"),
            "confirm": "Y",
            "retFun": _self.alertMsg
        });
        document.getElementById("C_popup_checkbox").style.display = "none"
    };
    _self.alertMsg = function (type) {
        if (type == "yes") {
            parentClass.dispatchEvent("SerrefreshPage");
            parentClass.dispatchEvent("createSerTimer", {});
            parentClass.dispatchEvent("show_back_login",
                {})
        }
    };
    _self.loginSuccess_New = function () {
        parentClass.dispatchEvent("loginFullLoading", {"isShow": true});
        top["userData"].four_pwd = "new";
        _self.del4pwd(top["userData"].uid);
        parentClass.dispatchEvent("loginSuccess", {})
    };
    _self.loginSuccess = function (type) {
        parentClass.dispatchEvent("loginFullLoading", {"isShow": true});
        if (top["userData"].msg == "106") {
            top["userData"].msg = "";
            top["userData"].four_pwd = "new"
        }
        _self.del4pwd(top["userData"].uid);
        parentClass.dispatchEvent("loginSuccess", {})
    };
    _self.del4pwd = function (uid) {
        top["memSet"].passcode =
            "[del1]";
        var urlParams = "";
        urlParams += "uid=" + uid;
        urlParams += "&action=send";
        urlParams += "&langx=" + top.langx;
        urlParams += "&val=" + JSON.stringify(top["memSet"]);
        urlParams = "p=memSet&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.send_Complete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.send_Complete = function () {
        CookieManager.del("PID");
        CookieManager.del("UID")
    };
    _self.loginchk = function () {
        parentClass.dispatchEvent("loginSuccess",
            {})
    };
    _self.allclear = function (e, param) {
        if (param.click == "newpwd") dom.getElementById("password").value = ""; else if (param.click == "confirmpwd") dom.getElementById("REpassword").value = ""
    };
    _self.orientation = function () {
        parentClass.dispatchEvent("scrollsetTop", {})
    }
};