function forgot_pwd(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util;
    var LS;
    var LS_code;
    var action = "";
    var emailRule = /[\x00-\xff]+@[\x00-\xff]+\.com(?:\.[\x00-\xff]+|)$/;
    var time = "";
    var scrolltag = "N";
    var CookieManager = new win.CookieManager;
    var arr_block_string = new Array("abc111", "abc222", "abc333", "abc444", "abc555", "abc666", "abc777", "abc888", "abc999", "abc000", "111abc", "222abc", "333abc", "444abc", "555abc", "666abc", "777abc",
        "888abc", "999abc", "000abc", "abc123", "123abc", "aaa123", "123aaa", "aaa1234", "1234aaa", "aa1234", "1234aa", "aa12345", "12345aa", "bbb123", "123bbb", "bbb1234", "1234bbb", "bb1234", "1234bb", "bb12345", "12345bb", "ccc123", "123ccc", "ccc1234", "1234ccc", "cc1234", "1234cc", "cc12345", "12345cc", "qwe123", "123qwe", "qwe1234", "1234qwe", "qwe12345", "12345qwe");
    var classname = "forgot_pwd";
    var myhash = {};
    _self.init = function () {
        parentClass.dispatchEvent("loginFullLoading", {"isShow": false});
        util.addEvent(dom.getElementById("getVerify"),
            "click", _self.getVerify);
        util.addEvent(dom.getElementById("cancel_set"), "click", _self.cancel_set);
        util.addEvent(dom.getElementById("chkVerify"), "click", _self.chkVerify);
        util.addEvent(dom.getElementById("cancel_verify"), "click", _self.cancel_verify);
        util.addEvent(dom.getElementById("getVerify2"), "click", _self.getVerify2);
        util.addEvent(dom.getElementById("cancel_y"), "click", _self.cancel_y);
        util.addEvent(dom.getElementById("cancel_n"), "click", _self.cancel_n);
        util.addEvent(dom.getElementById("cancel_setPwd"),
            "click", _self.cancel_setPwd);
        util.addEvent(dom.getElementById("set_Pwd"), "click", _self.set_Pwd);
        util.addEvent(dom.getElementById("continue_btn"), "click", _self.continue_btn);
        util.addEvent(dom.getElementById("username_dele"), "click", _self.input_del, {"target": "username"});
        util.addEvent(dom.getElementById("set_Email_dele"), "click", _self.input_del, {"target": "set_Email"});
        util.addEvent(dom.getElementById("myVerify_dele"), "click", _self.input_del, {"target": "myVerify"});
        util.addEvent(dom.getElementById("passwords_dele"),
            "click", _self.input_del, {"target": "passwords"});
        util.addEvent(dom.getElementById("pwd_chk_dele"), "click", _self.input_del, {"target": "pwd_chk"});
        util.addEvent(dom.getElementById("username"), "focusout", _self.inputBlur, {
            "target": "username",
            "labName": "lab_user"
        });
        util.addEvent(dom.getElementById("set_Email"), "focusout", _self.inputBlur, {
            "target": "set_Email",
            "labName": "lab_email"
        });
        util.addEvent(dom.getElementById("myVerify"), "focusout", _self.inputBlur, {
            "target": "myVerify",
            "labName": "lab_verify"
        });
        util.addEvent(dom.getElementById("passwords"),
            "focusout", _self.inputBlur, {"target": "passwords", "labName": "passwords_lab"});
        util.addEvent(dom.getElementById("pwd_chk"), "focusout", _self.inputBlur, {
            "target": "pwd_chk",
            "labName": "pwd_chk_lab"
        });
        util.addEvent(dom.getElementById("username"), "focusin", _self.inputfocuschk, {
            "target": "username",
            "labName": "lab_user"
        });
        util.addEvent(dom.getElementById("set_Email"), "focusin", _self.inputfocuschk, {
            "target": "set_Email",
            "labName": "lab_email"
        });
        util.addEvent(dom.getElementById("myVerify"), "focusin", _self.inputfocuschk,
            {"target": "myVerify", "labName": "lab_verify"});
        util.addEvent(dom.getElementById("passwords"), "focusin", _self.inputfocuschk, {
            "target": "passwords",
            "labName": "passwords_lab"
        });
        util.addEvent(dom.getElementById("pwd_chk"), "focusin", _self.inputfocuschk, {
            "target": "pwd_chk",
            "labName": "pwd_chk_lab"
        })
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code")
    };
    _self.getThis = function (varible) {
        if (!myhash[varible]) {
            var msg =
                "no myhash[" + varible + "]";
            util.writeLog(classname, msg)
        }
        return myhash[varible]
    };
    _self.exitEvent = function () {
        return true
    };
    _self.inputfocuschk = function (e, param) {
        util.chkuc(_self.inputFocus, param)
    };
    _self.inputFocus = function (param) {
        util.addClass(document.body, "keyin_scroll");
        _self.keyboardEvent(param, "add");
        if (dom.getElementById(param.labName).className == "error lab_input") {
            var focusObj = dom.getElementById(param.target);
            focusObj.selectionStart = 0;
            focusObj.selectionEnd = focusObj.value.length
        }
        dom.getElementById(param.labName).classList.add("on")
    };
    _self.inputBlur = function (e, param) {
        _self.orientation();
        _self.keyboardEvent(param, "remove");
        util.removeClass(document.body, "keyin_scroll");
        dom.getElementById(param.labName).classList.remove("on");
        if (dom.getElementById(param.labName).className != "error lab_input") dom.getElementById(param.labName).className = "lab_input"
    };
    _self.keyboardEvent = function (param, status) {
        if (status == "add") if (param.target == "username" || param.target == "set_Email") util.addEvent(dom.body, "keyup", _self.keyboard_set, {
            "target": dom.getElementById("getVerify"),
            "status": "add"
        }); else if (param.target == "passwords" || param.target == "pwd_chk") util.addEvent(dom.body, "keyup", _self.keyboard_set, {
            "target": dom.getElementById("set_Pwd"),
            "status": "add"
        }); else util.addEvent(dom.body, "keyup", _self.keyboard_set, {
            "target": dom.getElementById("chkVerify"),
            "status": "add"
        }); else util.removeEvent(dom.body, "keyup")
    };
    _self.keyboard_set = function (e, obj) {
        if (obj.status == "add" && top.mobile != "Y") if (e.keyCode == 13 && obj.target) obj.target.click()
    };
    _self.addEventListener = function (eventname,
                                       eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
  /*  _self.getVerify = function () {
        var email = dom.getElementById("set_Email").value;
        var usertag = dom.getElementById("username").value;
        dom.getElementById("lab_email").className = "lab_input";
        dom.getElementById("lab_user").className = "lab_input";
        if (email.match(emailRule) && usertag != "") {
            dom.getElementById("forgot_pwd_msg_error").style.display = "none";
            _self.chk_email()
        } else {
            dom.getElementById("forgot_pwd_msg_error").style.display =
                "";
            if (!email.match(emailRule) && usertag != "" && email != "" || email == "" && usertag != "") {
                dom.getElementById("forgot_pwd_msg_error").innerHTML = LS_code.get("pls_enter_email");
                dom.getElementById("lab_email").className = "error lab_input"
            } else if (email.match(emailRule) && usertag == "") {
                dom.getElementById("forgot_pwd_msg_error").innerHTML = LS_code.get("pls_enter_usertag");
                dom.getElementById("lab_user").className = "error lab_input"
            } else {
                dom.getElementById("forgot_pwd_msg_error").innerHTML = LS_code.get("pls_enter_usertag");
                if (email != "") dom.getElementById("lab_email").className = "error lab_input";
                dom.getElementById("lab_user").className = "error lab_input"
            }
        }
		
	/*_self.getVerify = function() {
  var email = dom.getElementById("set_Email").value;
  var usertag = dom.getElementById("username").value;
  dom.getElementById("lab_email").className = "lab_input";
  dom.getElementById("lab_user").className = "lab_input";
  if (!isNaN(email) && usertag !== "") {
    dom.getElementById("forgot_pwd_msg_error").style.display = "none";
    _self.chk_email();
  } else {
    dom.getElementById("forgot_pwd_msg_error").style.display = "";
    if ((!isNaN(email) && usertag !== "" && email !== "") || (email === "" && usertag !== "")) {
      // email error
      dom.getElementById("forgot_pwd_msg_error").innerHTML = LS.get("pls_enter_email");
      dom.getElementById("lab_email").className = "error lab_input";
    } else if (!isNaN(email) && usertag === "") {
      // username error
      dom.getElementById("forgot_pwd_msg_error").innerHTML = LS.get("pls_enter_usertag");
      dom.getElementById("lab_user").className = "error lab_input";
    } else {
      dom.getElementById("forgot_pwd_msg_error").innerHTML = LS.get("pls_enter_usertag");
      if (email !== "") {
        dom.getElementById("lab_email").className = "error lab_input";
      }
      dom.getElementById("lab_user").className = "error lab_input";
    }
  }	*/
		
   // };
   _self.getVerify = function () {
    var email = dom.getElementById("set_Email").value.trim(); 
    var usertag = dom.getElementById("username").value.trim(); 
    dom.getElementById("lab_email").className = "lab_input";
    dom.getElementById("lab_user").className = "lab_input";
    if (email !== "" && usertag !== "") {
        dom.getElementById("forgot_pwd_msg_error").style.display = "none";
        _self.chk_email(); 
    } else {
        dom.getElementById("forgot_pwd_msg_error").style.display = "";
        if (email === "" && usertag !== "") {
            dom.getElementById("forgot_pwd_msg_error").innerHTML = LS_code.get("pls_enter_email1111");
            dom.getElementById("lab_email").className = "error lab_input";
        } else if (email !== "" && usertag === "") {
           dom.getElementById("forgot_pwd_msg_error").innerHTML = LS_code.get("pls_enter_usertag");
            dom.getElementById("lab_user").className = "error lab_input";
        } else {
            dom.getElementById("forgot_pwd_msg_error").innerHTML = LS_code.get("pls_enter_email_and_usertag");
            dom.getElementById("lab_email").className = "error lab_input";
            dom.getElementById("lab_user").className = "error lab_input";
        }

    }

};
    _self.cancel_set = function () {
        parentClass.dispatchEvent("show_back_login", {})
    };
    _self.chk_email = function () {
        action = "1";
        var urlParams = "";
        urlParams += "username=" + top.username.value;
        urlParams += "&email=" + top.set_Email.value;
        urlParams += "&langx=" + top.langx;
        urlParams += "&action=" + action;
        urlParams = "p=chk_email&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError",
            _self.onError);
        getHTML.addEventListener("LoadComplete", _self.email_Complete);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.email_Complete = function (data) {
        var errorMsg = util.showConnectMsg(data);
        if (util.alertConnectMsg(errorMsg)) return;
        var JsonObj = (new Function("return " + data + ";"))();
        if (JsonObj.err_msg != "") {
            dom.getElementById("forgot_pwd_msg_error").innerHTML = util.showTxt(JsonObj.err_msg);
            dom.getElementById("forgot_pwd_msg_error").style.display = "";
            dom.getElementById("lab_email").className = "error lab_input";
            dom.getElementById("lab_user").className = "error lab_input";
            if (dom.getElementById("div_set_email").style.display == "none") {
                dom.getElementById("verify_show_info").innerHTML = util.showTxt(JsonObj.err_msg);
                dom.getElementById("verify_show_info").style.display = ""
            }
        } else {
            dom.getElementById("forgot_pwd_msg_error").style.display = "none";
            dom.getElementById("lab_email").className = "lab_input";
            dom.getElementById("lab_user").className = "lab_input";
            /*dom.getElementById("div_set_email").style.display = "none";
            dom.getElementById("div_set_verify").style.display =
                "";
            dom.getElementById("message_ok_bef").innerHTML = LS.get("determine");*/
            parentClass.dispatchEvent("showAlertMsg", {
                "target": "message_pop_bef",
                "msg": LS_code.get("verify_sent_ok")
            })
        }
    };
    _self.onError = function () {
    };
    _self.chkVerify = function () {
        if (dom.getElementById("myVerify").value == "") {
            dom.getElementById("verify_show_info").style.display = "";
            dom.getElementById("lab_verify").className = "error lab_input"
        } else {
            action = "2";
            var urlParams = "";
            urlParams += "username=" + top.username.value;
            urlParams += "&email=" + top.set_Email.value;
            urlParams += "&verify_code=" + dom.getElementById("myVerify").value;
            urlParams += "&langx=" + top.langx;
            urlParams += "&action=" + action;
            urlParams += "&time=" + time;
            urlParams = "p=chk_email&ver=" + top.ver + "&" + urlParams;
            var getHTML = new HttpRequest;
            getHTML.addEventListener("onError", _self.onError);
            getHTML.addEventListener("LoadComplete", _self.verify_Complete);
            getHTML.loadURL(top.m2_url, "POST", urlParams)
        }
    };
    _self.cancel_verify = function () {
        parentClass.dispatchEvent("showAlertMsg", {
            "target": "C_alert_confirm", "msg": LS_code.get("verify_cancel"),
            "confirm": "Y", "retFun": _self.verifyMsg
        });
        dom.getElementById("C_popup_checkbox").style.display = "none"
    };
    _self.verifyMsg = function (type) {
        if (type == "yes") parentClass.dispatchEvent("show_back_login", {})
    };
    _self.getVerify2 = function () {
        _self.chk_email();
        if (dom.getElementById("lab_verify").className != "error lab_input") dom.getElementById("lab_verify").className = "lab_input"
    };
    _self.cancel_y = function () {
        parentClass.dispatchEvent("show_back_login", {})
    };
    _self.cancel_n = function () {
        dom.getElementById("cancel_box").style.display =
            "none"
    };
    _self.verify_Complete = function (data) {
        var errorMsg = util.showConnectMsg(data);
        if (util.alertConnectMsg(errorMsg)) return;
        var JsonObj = (new Function("return " + data + ";"))();
        time = JsonObj.time;
        if (JsonObj.err_msg != "") {
            dom.getElementById("lab_verify").className = "error lab_input";
            dom.getElementById("verify_show_info").style.display = "";
            dom.getElementById("verify_show_info").innerHTML = util.showTxt(JsonObj.err_msg)
        } else {
            dom.getElementById("lab_verify").className = "lab_input";
            dom.getElementById("verify_show_info").style.display =
                "none";
            dom.getElementById("div_set_verify").style.display = "none";
            dom.getElementById("div_set_pwd").style.display = ""
        }
    };
    _self.cancel_setPwd = function () {
        _self.cancel_verify()
    };
    _self.set_Pwd = function () {
        var passwords = dom.getElementById("passwords").value;
        var pwd_chk = dom.getElementById("pwd_chk").value;
        var str_char = 0;
        var arr_char = new Array;
        var str_len = passwords.length;
        for (var i = 0; i < str_len; i++) {
            var tmp_str = passwords.substr(i, 1);
            if (tmp_str.match(/[A-Za-z]/)) str_char++;
            arr_char[tmp_str] = true
        }
        dom.getElementById("pwd_show_info").style.display =
            "";
        var obj_ids = new Array("passwords_lab", "pwd_chk_lab");
        for (var i = 0; i < obj_ids.length; i++) dom.getElementById(obj_ids[i]).className = "lab_input";
        var errStr = "";
        var errAry = new Array;
        if (passwords == "" || pwd_chk == "") {
            if (passwords == "") {
                errStr = "pls_enter_passwords";
                errAry.push("passwords_lab")
            }
            if (pwd_chk == "") {
                errStr = "pls_enter_pwd_chk";
                errAry.push("pwd_chk_lab")
            }
        } else if (passwords.length < 6 || passwords.length > 12 || !util.checkVal(passwords)) {
            errStr = "pwd_rule_error5";
            errAry.push("passwords_lab")
        } else if (passwords !=
            pwd_chk) {
            errStr = "pwd_chk_error";
            errAry.push("passwords_lab");
            errAry.push("pwd_chk_lab")
        } else if (Object.keys(arr_char).length <= 2 || arr_block_string.indexOf(passwords.toLowerCase()) >= 0) {
            errStr = "rule_error_3";
            errAry.push("passwords_lab")
        } else if (passwords.toLowerCase() == dom.getElementById("username").value.toLowerCase()) {
            errStr = "chgid_error_passwd";
            errAry.push("passwords_lab")
        } else {
            dom.getElementById("pwd_show_info").style.display = "none";
            action = "3";
            var urlParams = "";
            urlParams += "username=" + top.username.value;
            urlParams += "&email=" + top.set_Email.value;
            urlParams += "&verify_code=" + dom.getElementById("myVerify").value;
            urlParams += "&passwords=" + passwords;
            urlParams += "&pass_chk=" + pwd_chk;
            urlParams += "&langx=" + top.langx;
            urlParams += "&action=" + action;
            urlParams += "&time=" + time;
            urlParams = "p=chk_email&ver=" + top.ver + "&" + urlParams;
            var getHTML = new HttpRequest;
            getHTML.addEventListener("onError", _self.onError);
            getHTML.addEventListener("LoadComplete", _self.passwords_Complete);
            getHTML.loadURL(top.m2_url, "POST", urlParams)
        }
        if (errAry.length !=
            0 && errStr != "") {
            for (var z = 0; z < errAry.length; z++) util.setObjectClass(dom.getElementById(errAry[z]), "error lab_input");
            dom.getElementById("pwd_show_info").innerHTML = LS_code.get(errStr)
        }
    };
    _self.passwords_Complete = function (data) {
        var errorMsg = util.showConnectMsg(data);
        if (util.alertConnectMsg(errorMsg)) return;
        var JsonObj = (new Function("return " + data + ";"))();
        if (JsonObj.err_msg != "") {
            dom.getElementById("pwd_show_info").style.display = "";
            dom.getElementById("pwd_chk_lab").className = "lab_input";
            dom.getElementById("passwords_lab").className =
                "error lab_input";
            if (JsonObj.err_msg == "416") dom.getElementById("pwd_show_info").innerHTML = LS_code.get("pwd_rule_error3"); else if (JsonObj.err_msg == "417") dom.getElementById("pwd_show_info").innerHTML = LS_code.get("pwd_rule_error4"); else if (JsonObj.err_msg == "418") dom.getElementById("pwd_show_info").innerHTML = LS_code.get("chgid_error_passwd"); else dom.getElementById("pwd_show_info").innerHTML = LS_code.get("pwd_rule_error")
        } else {
            dom.getElementById("pwd_show_info").style.display = "none";
            dom.getElementById("pwd_chk").className =
                "lab_input";
            dom.getElementById("passwords").className = "lab_input";
            dom.getElementById("pwd_show_info").style.display = "none";
            dom.getElementById("div_set_pwd").style.display = "none";
            dom.getElementById("div_set_done").style.display = ""
        }
        if (CookieManager.get("PID") != null) CookieManager.del("PID");
        if (CookieManager.get("UID") != null) CookieManager.del("UID")
    };
    _self.continue_btn = function () {
        parentClass.dispatchEvent("show_back_login", {})
    };
    _self.input_del = function (e, param) {
        dom.getElementById(param.target).value =
            null
    };
    _self.orientation = function () {
        parentClass.dispatchEvent("scrollsetTop", {})
    }
};