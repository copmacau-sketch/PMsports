function help_change_pwd(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHand = new Object;
    var util = new win.Util(win, dom);
    var LS_code;
    var NUMS = /[0-9]+/;
    var A_Z = /[a-zA-Z]+/;
    var CookieManager = new win.CookieManager;
    var emailchk;
    var arr_block_string = new Array("abc111", "abc222", "abc333", "abc444", "abc555", "abc666", "abc777", "abc888", "abc999", "abc000", "111abc", "222abc", "333abc", "444abc", "555abc", "666abc", "777abc", "888abc", "999abc", "000abc", "abc123", "123abc",
        "aaa123", "123aaa", "aaa1234", "1234aaa", "aa1234", "1234aa", "aa12345", "12345aa", "bbb123", "123bbb", "bbb1234", "1234bbb", "bb1234", "1234bb", "bb12345", "12345bb", "ccc123", "123ccc", "ccc1234", "1234ccc", "cc1234", "1234cc", "cc12345", "12345cc", "qwe123", "123qwe", "qwe1234", "1234qwe", "qwe12345", "12345qwe");
    var classname = "help_change_pwd";
    var myhash = {};
    _self.init = function () {
        util.addEvent(dom.getElementById("toback"), "click", _self.toback);
        util.addEvent(dom.getElementById("cancel"), "click", _self.cancel);
        util.addEvent(dom.getElementById("greenBtn"),
            "click", _self.greenBtn);
        if (top.mobile != "Y") util.addEvent(dom.body, "keyup", _self.keyboard_set);
        util.addEvent(dom.getElementById("oldpassword"), "focusin", _self.inputfocuschk, {"target": "oldpassword"});
        util.addEvent(dom.getElementById("password"), "focusin", _self.inputfocuschk, {"target": "password"});
        util.addEvent(dom.getElementById("REpassword"), "focusin", _self.inputfocuschk, {"target": "REpassword"});
        util.addEvent(dom.getElementById("oldpassword"), "focusout", _self.stayword, {"target": "oldpassword"});
        util.addEvent(dom.getElementById("password"),
            "focusout", _self.stayword, {"target": "password"});
        util.addEvent(dom.getElementById("REpassword"), "focusout", _self.stayword, {"target": "REpassword"});
        util.addEvent(dom.getElementById("currentpwd_dele"), "click", _self.allclear, {"click": "currentpwd"});
        util.addEvent(dom.getElementById("newpwd_dele"), "click", _self.allclear, {"click": "newpwd"});
        util.addEvent(dom.getElementById("confirmpwd_dele"), "click", _self.allclear, {"click": "confirmpwd"});
        dom.getElementById("popup_checkbox").style.display = "none";
        dom.getElementById("chgpswBtnBox").style.display =
            "";
        parentClass.dispatchEvent("showLoading", {"isShow": false})
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        LS_code = parentClass.getThis("LS_code");
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
        eventHand[eventname] = eventFunction
    };
    _self.dispatchEvent = function (eventname,
                                    param) {
        if (eventHand[eventname]) eventHand[eventname](param)
    };
    _self.greenBtn = function () {
        _self.chkAllpwd_step()
    };
    _self.keyboard_set = function (e) {
        if (e.keyCode == 13) dom.getElementById("greenBtn").click()
    };
    _self.clickinput = function (param) {
        dom.body.scrollTop = param;
        window.pageYOffset = param;
        dom.documentElement.scrollTop = param;
        dom.getElementById("body_show").scrollTop = param
    };
    _self.inputfocuschk = function (e, param) {
        util.chkuc(_self.inputFocus, param)
    };
    _self.inputFocus = function (param) {
        util.addClass(dom.body, "keyin_scroll");
        if (param.target == "oldpassword") {
            if (dom.getElementById("currentpwd").className == "error lab_input") {
                var oldpassword = dom.getElementById("oldpassword");
                oldpassword.selectionStart = 0;
                oldpassword.selectionEnd = oldpassword.value.length
            }
            dom.getElementById("currentpwd").classList.add("on");
            util.chkuc(_self.clickinput, dom.getElementById("currentpwd").offsetTop)
        } else if (param.target == "password") {
            if (dom.getElementById("newpwd").className == "error lab_input") {
                var password = dom.getElementById("password");
                password.selectionStart =
                    0;
                password.selectionEnd = password.value.length
            }
            dom.getElementById("newpwd").classList.add("on");
            util.chkuc(_self.clickinput, dom.getElementById("newpwd").offsetTop)
        } else if (param.target == "REpassword") {
            if (dom.getElementById("confirmpwd").className == "error lab_input") {
                var REpassword = dom.getElementById("REpassword");
                REpassword.selectionStart = 0;
                REpassword.selectionEnd = REpassword.value.length
            }
            dom.getElementById("confirmpwd").classList.add("on");
            util.chkuc(_self.clickinput, dom.getElementById("confirmpwd").offsetTop)
        }
    };
    _self.stayword = function (e, param) {
        _self.orientation();
        setTimeout(_self.removebodyclass, 1);
        if (param.target == "oldpassword") {
            dom.getElementById("currentpwd").classList.remove("on");
            if (dom.getElementById("currentpwd").className != "error lab_input") dom.getElementById("currentpwd").className = "lab_input"
        } else if (param.target == "password") {
            dom.getElementById("newpwd").classList.remove("on");
            if (dom.getElementById("newpwd").className != "error lab_input") dom.getElementById("newpwd").className = "lab_input"
        } else if (param.target ==
            "REpassword") {
            dom.getElementById("confirmpwd").classList.remove("on");
            if (dom.getElementById("confirmpwd").className != "error lab_input") dom.getElementById("confirmpwd").className = "lab_input"
        }
    };
    _self.removebodyclass = function () {
        if (dom.activeElement.tagName != "INPUT") util.removeClass(dom.body, "keyin_scroll")
    };
    _self.chkAllpwd_step = function () {
        var str_char = 0;
        var arr_char = new Array;
        var str_len = dom.getElementById("password").value.length;
        for (var i = 0; i < str_len; i++) {
            var tmp_str = dom.getElementById("password").value.substr(i,
                1);
            if (tmp_str.match(/[A-Za-z]/)) str_char++;
            arr_char[tmp_str] = true
        }
        var obj_ids = new Array("currentpwd", "newpwd", "confirmpwd");
        for (var i = 0; i < obj_ids.length; i++) dom.getElementById(obj_ids[i]).className = "lab_input";
        var errStr = "";
        var errAry = new Array;
        if (dom.getElementById("oldpassword").value == "") {
            dom.getElementById("accpwd_text_error").style.display = "";
            errStr = "changepwd_oldpassword";
            errAry.push("currentpwd")
        } else {
            dom.getElementById("accpwd_text_error").style.display = "";
            if (!util.checkVal(dom.getElementById("oldpassword").value)) {
                errStr =
                    "changepwd_oldpassworderror";
                errAry.push("currentpwd")
            } else _self.chgnewpwd()
        }
        if (errAry.length != 0 && errStr != "") {
            for (var z = 0; z < errAry.length; z++) util.setObjectClass(dom.getElementById(errAry[z]), "error lab_input");
            dom.getElementById("accpwd_text_error").innerHTML = LS_code.get(errStr)
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
        urlParams = "p=help_chg_safepwd&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.connectComplete = function (msg) {
        var errorMsg = util.showConnectMsg(msg);
        if (util.alertConnectMsg(errorMsg)) return;
        var xmdObj =
            new Object;
        var xmlnode = util.parseXml(msg);
        xmdObj["status"] = xmlnode.Node(xmlnode.Root[0], "status");
        xmdObj["err"] = xmlnode.Node(xmlnode.Root[0], "err");
        xmdObj["email"] = xmlnode.Node(xmlnode.Root[0], "email");
        if (xmdObj["status"].innerHTML == "error") {
            dom.getElementById("accpwd_text_error").style.display = "";
            var obj_ids = new Array("currentpwd", "newpwd", "confirmpwd");
            for (var i = 0; i < obj_ids.length; i++) dom.getElementById(obj_ids[i]).className = "lab_input";
            var errStr = "";
            var errAry = new Array;
            switch (xmdObj["err"].innerHTML) {
                case "411":
                    errStr =
                        "changepwd_password";
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
                dom.getElementById("accpwd_text_error").innerHTML = LS_code.get(errStr)
            }
        } else {
            dom.getElementById("accpwd_text_error").style.display = "none";
            util.removeEvent(dom.body, "keyup");
            parentClass.dispatchEvent("showAlertMsg", {
                "target": "alert_OK",
                "msg": LS_code.get("changepwd_passwordcomplete"),
                "confirm": "N",
                "retFun": _self.back
            });
            dom.getElementById("currentpwd").className = "lab_input";
            dom.getElementById("newpwd").className = "lab_input";
            dom.getElementById("confirmpwd").className = "lab_input";
            dom.getElementById("chgpswBtnBox").style.display = "";
            emailchk = xmdObj["email"].innerHTML;
            _self.del4pwd(top["userData"].uid)
        }
    };
    _self.onError = function () {
    };
    _self.cancel = function () {
        parentClass.dispatchEvent("showAlertMsg",
            {
                "target": "C_alert_confirm",
                "msg": LS_code.get("changepwd_stop"),
                "confirm": "Y",
                "retFun": _self.cancel_back
            });
        dom.getElementById("C_popup_checkbox").style.display = "none"
    };
    _self.cancel_back = function (type) {
        if (type == "yes") parentClass.dispatchEvent("backPage", {})
    };
    _self.toback = function () {
        parentClass.dispatchEvent("backPage", {})
    };
    _self.back = function (type) {
        if (type != "no") if (emailchk == "Y") parentClass.dispatchEvent("bodyGoToPage", {"page": "home"}); else parentClass.dispatchEvent("showAlertMsg", {
            "target": "alert_confirm",
            "msg": LS_code.get("changeemail_page"), "confirm": "Y", "retFun": _self.emailchg
        })
    };
    _self.emailchg = function (type) {
        if (type != "no") parentClass.dispatchEvent("bodyGoToPage", {"page": "help_set_mail"}); else parentClass.dispatchEvent("bodyGoToPage", {"page": "home"})
    };
    _self.allclear = function (e, param) {
        if (param.click == "currentpwd") dom.getElementById("oldpassword").value = ""; else if (param.click == "newpwd") dom.getElementById("password").value = ""; else if (param.click == "confirmpwd") dom.getElementById("REpassword").value =
            ""
    };
    _self.del4pwd = function (uid) {
        top["userData"]["secondSet4pwd"] = null;
        top["memSet"].passcode = "[del1]";
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
    _self.send_Complete = function (xml) {
        var errorMsg =
            util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        CookieManager.del("PID");
        CookieManager.del("UID")
    };
    _self.orientation = function () {
        parentClass.dispatchEvent("scrollsetTop", {})
    };
    _self.exitEvent = function () {
        return true
    }
};