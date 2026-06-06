function help_set_mail(_win, _dom, _post) {
    var _self = this;
    var _mc = new Object;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var LS_code;
    var action;
    var is_set = false;
    var config_set;
    var forbid = false;
    var forbidnAry = new Array;
    var forbidObj = new Object;
    var scrolltag = "N";
    var chksend;
    var CookieManager = new win.CookieManager;
    var classname = "help_set_mail";
    var myhash = {};
    _self.init = function () {
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
        _self.addEventListener("retryLoop", _self.retryLoop);
        _self.addEventListener("retryLastfail", _self.retryLastfail);
        _self.addEventListener("retryComplete", _self.retryComplete);
        action = "init";
        dom.getElementById("popup_checkbox").style.display = "none";
        _mc["set_Email"] = dom.getElementById("set_Email");
        _mc["cancel_set"] = dom.getElementById("cancel_set");
        _mc["getVerify"] = dom.getElementById("getVerify");
        _mc["set1_text_error"] = dom.getElementById("set1_text_error");
        _mc["emailclear_btn"] = dom.getElementById("emailclear_btn");
        _mc["acc_myVerify_dele"] = dom.getElementById("acc_myVerify_dele");
        util.addEvent(_mc["set_Email"], "focusin", _self.inputfocuschk, {"gtype": "set_Email"});
        util.addEvent(_mc["set_Email"], "focusout", _self.inputBlur, {"gtype": "set_Email"});
        util.addEvent(_mc["cancel_set"], "click", _self.closeEvent);
        util.addEvent(_mc["getVerify"], "click", _self.loadSetting, _mc["getVerify"]);
        util.addEvent(_mc["emailclear_btn"], "click", _self.emailclear, {"click": "emailclear"});
        util.addEvent(_mc["acc_myVerify_dele"], "click", _self.emailclear, {"click": "acc_myVerify"});
        _mc["myEmail"] = dom.getElementById("myEmail");
        _mc["myVerify"] = dom.getElementById("myVerify");
        _mc["getVerify2"] = dom.getElementById("getVerify2");
        _mc["set2_text_error"] = dom.getElementById("set2_text_error");
        _mc["chkVerify"] = dom.getElementById("chkVerify");
        _mc["reset_mail"] = dom.getElementById("reset_mail");
        _mc["cancel_verify"] = dom.getElementById("cancel_verify");
        _mc["codeclear_btn"] = dom.getElementById("codeclear_btn");
        util.addEvent(_mc["myVerify"], "focusin", _self.inputfocuschk, {"gtype": "myVerify"});
        util.addEvent(_mc["myVerify"], "focusout", _self.inputBlur, {"gtype": "myVerify"});
        util.addEvent(_mc["getVerify2"], "click", _self.loadSetting, _mc["getVerify2"]);
        util.addEvent(_mc["chkVerify"], "click", _self.loadSetting, _mc["chkVerify"]);
        util.addEvent(_mc["reset_mail"], "click", _self.changeView);
        util.addEvent(_mc["cancel_verify"], "click", _self.Show_cancel);
        util.addEvent(_mc["codeclear_btn"], "click", _self.codeclear);
        _mc["Email_done"] =
            dom.getElementById("Email_done");
        _mc["reset_mail_done"] = dom.getElementById("reset_mail_done");
        _mc["remove"] = dom.getElementById("remove");
        util.addEvent(_mc["reset_mail_done"], "click", _self.changeView);
        util.addEvent(_mc["remove"], "click", _self.Show_del);
        _mc["add_Email"] = dom.getElementById("add_Email");
        util.addEvent(_mc["add_Email"], "click", _self.changeView);
        _self.changeDiv("div_set_email");
        _self.loadSetting();
        util.addEvent(dom.getElementById("toback"), "click", _self.toback)
    };
    _self.inputfocuschk = function (e,
                                    param) {
        util.chkuc(_self.inputFocus, param)
    };
    _self.inputFocus = function (param) {
        util.addClass(document.body, "keyin_scroll");
        if (param.gtype == "set_Email") {
            util.addEvent(dom.body, "keyup", _self.keyboard_set, {"target": _mc["getVerify"], "status": "add"});
            if (dom.getElementById("set_err_Email").className == "error lab_input") {
                var set_Email = document.getElementById("set_Email");
                set_Email.selectionStart = 0;
                set_Email.selectionEnd = set_Email.value.length
            }
            dom.getElementById("set_err_Email").classList.add("on")
        } else if (param.gtype ==
            "myVerify") {
            util.addEvent(dom.body, "keyup", _self.keyboard_set, {"target": _mc["chkVerify"], "status": "add"});
            if (dom.getElementById("err_myVerify").className == "error lab_input") {
                var myVerify = document.getElementById("myVerify");
                myVerify.selectionStart = 0;
                myVerify.selectionEnd = myVerify.value.length
            }
            dom.getElementById("err_myVerify").classList.add("on")
        }
    };
    _self.inputBlur = function (e, param) {
        _self.orientation();
        util.removeClass(document.body, "keyin_scroll");
        if (param.gtype == "set_Email") {
            util.addEvent(dom.body,
                "keyup", _self.keyboard_set, {"target": _mc["getVerify"], "status": "remove"});
            dom.getElementById("set_err_Email").classList.remove("on");
            if (dom.getElementById("set_err_Email").className != "error lab_input") dom.getElementById("set_err_Email").className = "lab_input"
        } else if (param.gtype == "myVerify") {
            util.addEvent(dom.body, "keyup", _self.keyboard_set, {"target": _mc["chkVerify"], "status": "remove"});
            dom.getElementById("err_myVerify").classList.remove("on");
            if (dom.getElementById("err_myVerify").className != "error lab_input") dom.getElementById("err_myVerify").className =
                "lab_input"
        }
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        LS_code = parentClass.getThis("LS_code");
        config_set = parentClass.getThis("config_set");
        LS = parentClass.getThis("LS")
    };
    _self.getParentThis = function (varible) {
        return parentClass.getThis(varible)
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
    _self.showAlertMsg = function (param) {
        parentClass.dispatchEvent("showAlertMsg", param)
    };
    _self.bodyGoToPage = function (param) {
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.chgPage = function (e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.retryLoop = function (param) {
        parentClass.dispatchEvent("retryLoop", param)
    };
    _self.retryLastfail = function () {
        parentClass.dispatchEvent("retryLastfail")
    };
    _self.retryComplete = function () {
        parentClass.dispatchEvent("retryComplete")
    };
    _self.keyboard_set = function (e, obj) {
        if (obj.status == "remove") return; else if (obj.status == "add" && top.mobile != "Y") if (e.keyCode == 13 && obj.target) obj.target.click()
    };
    _self.loadSetting = function (e, from_obj) {
        var setEmail = "";
        var emailRule = /[\x00-\xff]+@[\x00-\xff]+\.com(?:\.[\x00-\xff]+|)$/;
        if (from_obj == _mc["getVerify"] || from_obj == _mc["getVerify2"]) {
            action = "getVerify";
            if (from_obj != _mc["getVerify2"]) setEmail = _mc["set_Email"].value; else setEmail =
                _mc["myEmail"].innerHTML;
            if (CookieManager.get("out_enabled_lock")) CookieManager.del("out_enabled_lock")
        } else if (from_obj == _mc["chkVerify"]) {
            action = "chkVerify";
            setEmail = _mc["myEmail"].innerHTML;
            if (_mc["myVerify"].value == "") dom.getElementById("err_myVerify").className = "error lab_input"; else dom.getElementById("err_myVerify").className = "lab_input"
        } else if (from_obj == "goremove") action = "remove";
        if ((action == "getVerify" || action == "chkVerify") && (!setEmail.match(emailRule) || setEmail.match(/\s/) || setEmail.length <=
            0)) {
            _mc["set1_text_error"].style.display = "";
            _mc["set1_text_error"].innerHTML = LS_code.get("mail_error1");
            dom.getElementById("set_err_Email").className = "error lab_input";
            return false
        } else if (setEmail.match("@gmail.com")) {
            _mc["set1_text_error"].style.display = "";
            _mc["set1_text_error"].innerHTML = LS_code.get("mail_gmail");
            dom.getElementById("set_err_Email").className = "error lab_input";
            return false
        }
        chksend = action;
        var param = "";
        param += top.param;
        param += "&p=get_set_mail";
        param += "&action=" + action;
        param += "&setEmail=" +
            setEmail;
        param += "&myVerify=" + dom.getElementById("myVerify").value;
        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), null);
        hr.setParentclass(_self);
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.loadSettingComplete);
        hr.loadURL(top.m2_url, "POST", param)
    };
    _self.emailclear = function (e, param) {
        if (param.click == "emailclear") _mc["set_Email"].value = ""; else if (param.click == "acc_myVerify") _mc["myVerify"].value = ""
    };
    _self.codeclear =
        function () {
            _mc["myVerify"].value = ""
        };
    _self.closeEvent = function () {
        parentClass.dispatchEvent("closeConfirmExit", {});
        if (is_set) {
            dom.getElementById("div_set_email").style.display = "none";
            dom.getElementById("div_set_done").style.display = ""
        } else parentClass.dispatchEvent("backPage", {})
    };
    _self.loadSettingComplete = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        parentClass.dispatchEvent("showLoading", {"isShow": false});
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        xmlnode = util.parseXml(xml);
        var xmdObj = new Object;
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
        if (xmdObj["code"].innerHTML == "607") {
            var err_msg = xmlnode.Node(xmlnode.Root[0], "err_msg").innerHTML;
            var alert_msg = xmlnode.Node(xmlnode.Root[0], "alert_msg").innerHTML;
            var done_msg = xmlnode.Node(xmlnode.Root[0], "done_msg").innerHTML;
            var view = xmlnode.Node(xmlnode.Root[0], "view").innerHTML;
            var email = xmlnode.Node(xmlnode.Root[0], "email").innerHTML;
            var enabled = xmlnode.Node(xmlnode.Root[0], "enabled").innerHTML;
            if (enabled == "S") CookieManager.set("enabled_lock", "Y"); else if (!enabled) CookieManager.del("enabled_lock");
            if (view != null && view != "") {
                if (err_msg != LS_code.get("mail_lock")) _self.changeDiv(view);
                if (alert_msg != "") setTimeout(_self.alertShow(alert_msg), 50);
                if (done_msg != "") {
                    parentClass.dispatchEvent("showAlertMsg", {
                        "target": "alert_OK",
                        "msg": LS_code.get("mail_complete"),
                        "confirm": "N",
                        "retFun": ""
                    });
                    parentClass.dispatchEvent("closeConfirmExit", {})
                }
                if (err_msg != LS_code.get("mail_lock")) _mc["myEmail"].innerHTML =
                    util.showTxt(email);
                if (err_msg != "") {
                    if (view == "div_set_verify") {
                        _mc["set2_text_error"].innerHTML = util.showTxt(err_msg);
                        _mc["set2_text_error"].style.display = "";
                        dom.getElementById("err_myVerify").className = "error lab_input";
                        parentClass.dispatchEvent("showLoading", {"isShow": false})
                    } else if (view == "div_set_email") {
                        _mc["set1_text_error"].style.display = "";
                        _mc["set1_text_error"].innerHTML = err_msg;
                        dom.getElementById("set_err_Email").className = "error lab_input";
                        if (enabled != "") {
                            parentClass.dispatchEvent("showAlertMsg",
                                {
                                    "target": "alert_OK",
                                    "msg": LS_code.get("mail_disable"),
                                    "confirm": "N",
                                    "retFun": _self.toback
                                });
                            if (CookieManager.get("enabled_lock") && !CookieManager.get("out_enabled_lock")) parentClass.dispatchEvent("closeConfirmExit", {}); else CookieManager.del("out_enabled_lock");
                            CookieManager.del("enabled_lock")
                        }
                    }
                    return false
                }
                if (chksend != "getVerify") _mc["Email_done"].innerHTML = util.showTxt(email)
            }
        }
    };
    _self.changeView = function () {
        dom.getElementById("err_myVerify").className = "lab_input";
        dom.getElementById("myVerify").value =
            "";
        dom.getElementById("myEmail").innerHTML = "";
        dom.getElementById("set_err_Email").className = "lab_input";
        _self.changeDiv("div_set_email")
    };
    _self.changeDiv = function (divID) {
        _mc["set_Email"].value = "";
        _mc["set2_text_error"].style.display = "none";
        _mc["set1_text_error"].style.display = "none";
        var allDiv = ["div_set_email", "div_set_verify", "div_set_done", "div_rm_done"];
        for (var i = 0; i < allDiv.length; i++) dom.getElementById(allDiv[i]).style.display = "none";
        if (divID != "") try {
            dom.getElementById(divID).style.display = ""
        } catch (e) {
        }
        if (divID ==
            "div_set_done") is_set = true;
        if (divID == "div_rm_done") is_set = false;
        if (divID == "div_set_verify") _self.InitSetConfirmExit()
    };
    _self.InitSetConfirmExit = function () {
        var obj = new Object;
        obj["Alert"] = {"target": "C_alert_confirm", "msg": LS_code.get("mail_cancel"), "mode": "Y"};
        parentClass.dispatchEvent("SetConfirmExit", obj);
        dom.getElementById("C_popup_checkbox").style.display = "none"
    };
    _self.Show_cancel = function () {
        parentClass.dispatchEvent("showAlertMsg", {
            "target": "C_alert_confirm", "msg": LS_code.get("mail_cancel"), "confirm": "Y",
            "retFun": _self.goCancel
        });
        dom.getElementById("C_popup_checkbox").style.display = "none"
    };
    _self.Show_del = function () {
        parentClass.dispatchEvent("showAlertMsg", {
            "target": "C_alert_confirm",
            "msg": LS_code.get("mail_delete"),
            "confirm": "Y",
            "retFun": _self.goDel
        });
        dom.getElementById("C_popup_checkbox").style.display = "none"
    };
    _self.alertShow = function () {
        parentClass.dispatchEvent("showAlertMsg", {"target": "message_pop", "msg": LS_code.get("mail_pop")})
    };
    _self.goCancel = function (type) {
        if (type != "no") {
            parentClass.dispatchEvent("closeConfirmExit",
                {});
            parentClass.dispatchEvent("backPage", {})
        }
    };
    _self.goDel = function (type) {
        if (type != "no") {
            dom.getElementById("div_set_done").style.display = "none";
            dom.getElementById("div_rm_done").style.display = "";
            _self.loadSetting("", "goremove")
        }
    };
    _self.toback = function () {
        parentClass.dispatchEvent("backPage", {})
    };
    _self.orientation = function () {
        parentClass.dispatchEvent("scrollsetTop", {})
    };
    _self.exitEvent = function () {
        return true
    }
};