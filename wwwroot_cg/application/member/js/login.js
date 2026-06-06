function login(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var LS_code;
    var isClick = false;
    var CookieManager = new win.CookieManager;
    var login_4pwd_sw = "Y";
    var abox4pwd_notshow = "";
    top["memSet"] = new Object;
    var _mc = new Object;
    var abox4pwd_notshow = new Array;
    top.isback4pwd = false;
    var classname = "login";
    var myhash = {};
    var langxHash = new Object;
    langxHash["tw"] = "zh-tw";
    langxHash["cn"] = "zh-cn";
    langxHash["en"] =
        "en-us";
    langxHash["us"] = "en-us";
    _self.init = function () {
        parentClass.dispatchEvent("getIovationBlackBox");
        _mc["lang_tw"] = dom.getElementById("lang_tw");
        _mc["lang_cn"] = dom.getElementById("lang_cn");
        _mc["lang_en"] = dom.getElementById("lang_en");
        _mc["browse_chr"] = dom.getElementById("browse_chr");
        _mc["browse_saf"] = dom.getElementById("browse_saf");
        _mc["browse_fox"] = dom.getElementById("browse_fox");
        _mc["systemreq"] = dom.getElementById("systemreq");
        _mc["ip_guide"] = dom.getElementById("ip_guide");
        _mc["btn_login"] =
            dom.getElementById("btn_login");
        _mc["btn_forgot"] = dom.getElementById("btn_forgot");
        _mc["btn_pwd4"] = dom.getElementById("btn_pwd4");
        _mc["usr"] = dom.getElementById("usr");
        _mc["pwd"] = dom.getElementById("pwd");
        _mc["usr_dele"] = dom.getElementById("usr_dele");
        _mc["pwd_dele"] = dom.getElementById("pwd_dele");
        _mc["usr_lab"] = dom.getElementById("usr_lab");
        _mc["pwd_lab"] = dom.getElementById("pwd_lab");
        _mc["text_error"] = dom.getElementById("text_error");
        _mc["remember"] = dom.getElementById("remember");
        _mc["ip_run"] = dom.getElementById("ip_run");
        _mc["run_ip"] = dom.getElementById("run_ip");
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
        _self.addEventListener("retryLoop", _self.retryLoop);
        _self.addEventListener("retryLastfail", _self.retryLastfail);
        _self.addEventListener("login4pwdRetryComplete", _self.login4pwdRetryComplete);
        _self.addEventListener("retryComplete", _self.retryComplete);
        util.addEvent(_mc["lang_tw"], "click", _self.chgLangx, {"langx": "tw"});
        util.addEvent(_mc["lang_cn"],
            "click", _self.chgLangx, {"langx": "cn"});
        util.addEvent(_mc["lang_en"], "click", _self.chgLangx, {"langx": "en"});
        util.addEvent(_mc["browse_chr"], "click", _self.browsedownload, {"browse": "chrome"});
        util.addEvent(_mc["browse_saf"], "click", _self.browsedownload, {"browse": "safari"});
        util.addEvent(_mc["browse_fox"], "click", _self.browsedownload, {"browse": "firefox"});
        util.addEvent(_mc["systemreq"], "click", _self.systemrequire);
        util.addEvent(_mc["ip_guide"], "click", _self.goToip_guide);
        util.addEvent(_mc["btn_login"],
            "click", _self.loginEvent);
        util.addEvent(_mc["btn_forgot"], "click", _self.forgotEvent);
        util.addEvent(_mc["btn_pwd4"], "click", _self.pwd4Event);
        util.addEvent(_mc["usr"], "focusin", _self.inputfocuschk, {"target": "usr", "labName": "usr_lab"});
        util.addEvent(_mc["usr"], "focusout", _self.inputBlur, {"target": "usr", "labName": "usr_lab"});
        util.addEvent(_mc["pwd"], "focusin", _self.inputfocuschk, {"target": "pwd", "labName": "pwd_lab"});
        util.addEvent(_mc["pwd"], "focusout", _self.inputBlur, {"target": "pwd", "labName": "pwd_lab"});
        util.addEvent(_mc["usr_dele"], "click", _self.usrorpwd_dele, {"click": "usr"});
        util.addEvent(_mc["pwd_dele"], "click", _self.usrorpwd_dele, {"click": "pwd"});
        if (navigator.userAgent.indexOf("Firefox") >= 0) {
            _mc["usr"].onkeypress = function (e) {
                keyupForFireFox(e)
            };
            _mc["pwd"].onkeypress = function (e) {
                keyupForFireFox(e)
            }
        } else {
            util.addEvent(_mc["usr"], "keyup", _self.keyupEventHandler);
            util.addEvent(_mc["pwd"], "keyup", _self.keyupEventHandler)
        }
        if (top.aspenbet != "Y") {
            if (top.isapp != "Y") _mc["ip_run"].href = top.chg_ad_ph; else _mc["ip_run"].href =
                "#";
            _mc["run_ip"].innerHTML = util.showTxt(top.ad_ip);
            if (top.chg_ad_ph == "http://") _mc["ip_run"].className = "no_ip"; else _mc["ip_run"].className = ""
        }
        _self.chk_acc();
        _self.chgLangxColor(top.ls);
        if (typeof autoLogin != "undefined") autoLogin()
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
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
    _self.chgLangx = function (e, param) {
        if (top["errorTwice"]) CookieManager.set("toperrorTwice", "true");
        if (top.cookieEncode_sw == "Y" && top.cookieEncode == "Y") CookieManager.set("CookieChk",
            "Y");
        _self.chgLangxColor(param.langx);
        top.ls = param.langx;
        top["userData"].langx = langxHash[param.langx];
        CookieManager.set("previous_langx", param.langx);
        CookieManager.set("chg_langx", langxHash[param.langx]);
        if (top["errorCount"] != 0) CookieManager.set("errorCount", top["errorCount"]);
        if (top["errorTwice"] == true) CookieManager.set("error1", "error1");
        util.goToIndex()
    };
    _self.chgLangxColor = function (name) {
        if (name == "us") name = "en";
        util.removeClass(_mc["lang_tw"], "on");
        util.removeClass(_mc["lang_en"], "on");
        util.removeClass(_mc["lang_cn"],
            "on");
        util.addClass(_mc["lang_" + name], "on")
    };
    _self.loginEvent = function (e) {
        _self.avoid_double_login(true);
        _self.doLogin()
    };
    _self.inputfocuschk = function (e, param) {
        util.chkuc(_self.inputFocus, param)
    };
    _self.inputFocus = function (param) {
        util.addClass(dom.body, "keyin_scroll");
        lastfocus = param.labName;
        var obj = dom.getElementById(param.labName);
        if (obj.className == "error lab_input") {
            var focusObj = dom.getElementById(param.target);
            focusObj.selectionStart = 0;
            focusObj.selectionEnd = focusObj.value.length
        }
        util.addClass(dom.getElementById(param.labName),
            "on")
    };
    _self.inputBlur = function (e, param) {
        _self.orientation();
        util.removeClass(document.body, "keyin_scroll");
        util.removeClass(dom.getElementById(param.labName), "on");
        if (document.getElementById(param.labName).className != "error lab_input") document.getElementById(param.labName).className = "lab_input"
    };
    _self.doLogin = function () {
        var username = _mc["usr"].value;
        var password = _mc["pwd"].value.trim();
        var ua = btoa(navigator.userAgent);
        _mc["pwd"].value = password;
        _mc["usr_lab"].className = "lab_input";
        _mc["pwd_lab"].className =
            "lab_input";
        if (username == "" || password == "") {
            _mc["text_error"].style.display = "";
            var errObj = null;
            var errStr = "";
            if (username == "") {
                errObj = _mc["usr_lab"];
                errStr = LS_code.get("login_usr")
            } else {
                errObj = _mc["pwd_lab"];
                errStr = LS_code.get("login_pwd")
            }
            util.addClass(errObj, "error");
            _mc["text_error"].innerHTML = errStr;
            _self.avoid_double_login(false)
        } else if (!util.checkVal(password)) {
            _mc["text_error"].style.display = "";
            var errStr = "";
            errStr = LS_code.get("login_error");
            util.addClass(_mc["usr_lab"], "error");
            util.addClass(_mc["pwd_lab"],
                "error");
            _mc["text_error"].innerHTML = errStr;
            _self.avoid_double_login(false)
        } else {
            if (!isClick) {
                isClick = true;
                var par = "";
                par += "p=chk_login";
                par += "&langx=" + top.langx;
                par += "&ver=" + top.ver;
                par += "&username=" + dom.getElementById("usr").value;
                par += "&password=" + dom.getElementById("pwd").value;
                par += "&app=" + top.isapp;
                par += "&auto=" + top.iovationKey;
                par += "&blackbox=" + top.blackbox;
                par += "&userAgent=" + ua;
                var hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), "loginFrame");
                hr.setParentclass(_self);
                hr.addEventListener("onError", _self.loginError);
                hr.addEventListener("LoadComplete", _self.loginComplete);
                hr.loadURL(top.m2_url, "POST", par)
            }
            var isRemember = _mc["remember"].checked;
            if (isRemember) CookieManager.set("loginuser", username); else CookieManager.del("loginuser")
        }
    };
    _self.loginComplete = function (xml) {
        isClick = false;
        if (xml.indexOf("CheckIOSapp error") != -1) {
            alert("Attention! Illegally logining.");
            return
        }
        if (xml == "") _self.system_error(LS_code.get("errorLogin"));
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        try {
            xmlnode = util.parseXml(xml);
            var status = xmlnode.Node(xmlnode.Root[0], "status").innerHTML;
            var msg = xmlnode.Node(xmlnode.Root[0], "msg").innerHTML;
            var username = xmlnode.Node(xmlnode.Root[0], "username").innerHTML;
            var mid = xmlnode.Node(xmlnode.Root[0], "mid").innerHTML;
            var uid = xmlnode.Node(xmlnode.Root[0], "uid").innerHTML;
            var ltype = xmlnode.Node(xmlnode.Root[0], "ltype").innerHTML;
            var currency = xmlnode.Node(xmlnode.Root[0], "currency").innerHTML;
            var odd_f = xmlnode.Node(xmlnode.Root[0],
                "odd_f").innerHTML;
            var domain = xmlnode.Node(xmlnode.Root[0], "domain").innerHTML;
            var pay_type = xmlnode.Node(xmlnode.Root[0], "pay_type").innerHTML;
            var passwd_safe = _mc["usr"].value;
            var code_message = xmlnode.Node(xmlnode.Root[0], "code_message").innerHTML;
            var blackBoxStatus = xmlnode.Node(xmlnode.Root[0], "blackBoxStatus").innerHTML
        } catch (e) {
            _self.system_error(LS_code.get("errorLogin"));
            return
        }
        if (status == "200") {
            top["userData"].uid = uid;
            top["userData"].pay_type = pay_type;
            top["userData"].username = username;
            top["userData"].passwd_safe =
                passwd_safe;
            top["userData"].mid = mid;
            top["userData"].ltype = ltype;
            top["userData"].currency = currency;
            top["userData"].odd_f = odd_f;
            top["userData"].domain = domain;
            top["userData"].blackBoxStatus = blackBoxStatus;
            top.param = "uid=" + top["userData"].uid + "&ver=" + top.ver + "&langx=" + top.langx;
            top["userData"].odd_f_type = "H";
            var odds_length = top["userData"].odd_f.split(",");
            if (CookieManager.get("odd_f_type_" + top["userData"].mid)) for (var i = 0; i < odds_length.length; i++) if (odds_length[i] == CookieManager.get("odd_f_type_" + top["userData"].mid)) top["userData"].odd_f_type =
                CookieManager.get("odd_f_type_" + top["userData"].mid);
            if (msg == "100") {
                top["errorCode"] = undefined;
                if (_self.chg_site()) parentClass.dispatchEvent("browser_rule", {}); else {
                    parentClass.dispatchEvent("loginFullLoading", {"isShow": true});
                    action = "check";
                    var urlParams = "";
                    urlParams += "uid=" + top["userData"].uid;
                    urlParams += "&langx=" + top.langx;
                    urlParams += "&action=" + action;
                    urlParams = "p=memSet&ver=" + top.ver + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("LoadComplete", _self.check_Complete);
                    getHTML.loadURL(top.m2_url,
                        "POST", urlParams)
                }
            } else if (msg == "109") {
                top["userData"].passwd = _mc["pwd"].value;
                parentClass.dispatchEvent("showchg_id", {})
            } else if (msg == "104") {
                top["userData"].msg = msg;
                parentClass.dispatchEvent("showchg_id", {})
            } else if (msg == "106") {
                top["userData"].passwd = _mc["pwd"].value;
                parentClass.dispatchEvent("showchg_pwd", {})
            }
        } else if (status == "error") {
            _mc["text_error"].style.display = "";
            if (msg == "101") {
                _mc["text_error"].innerHTML = util.showTxt(code_message);
                _self.show4PwdBtn(false)
            } else if (msg == "102") {
                _mc["text_error"].innerHTML =
                    LS_code.get("4pwd_block");
                _self.show4PwdBtn(false)
            } else if (msg == "103") {
                _mc["usr_lab"].className = "error lab_input";
                _mc["pwd_lab"].className = "error lab_input";
                _mc["text_error"].innerHTML = util.showTxt(code_message)
            } else if (msg == "105") {
                _mc["pwd_lab"].className = "error lab_input";
                _mc["usr_lab"].className = "error lab_input";
                _mc["text_error"].innerHTML = LS_code.get("login_error")
            } else if (msg == "107") _mc["text_error"].innerHTML = LS_code.get("login_internalerror"); else if (msg == "108") _mc["text_error"].innerHTML =
                LS_code.get("login_lock")
        } else _self.system_error(LS_code.get("errorLogin"));
        _self.avoid_double_login(false)
    };
    _self.show4PwdBtn = function (show) {
        if (!show) {
            if (_mc["btn_pwd4"]) _mc["btn_pwd4"].style.display = "none";
            if (top.aspenbet != "Y") {
                CookieManager.del("PID");
                CookieManager.del("UID")
            }
        } else _mc["btn_pwd4"].style.display = ""
    };
    _self.loginError = function () {
        show_Errmsg(top["connect_retry"]);
        _self.avoid_double_login(false)
    };
    _self.system_error = function (errMsg) {
        var msg = null;
        if (errMsg) msg = errMsg; else return;
        _mc["text_error"].style.display =
            "";
        _mc["text_error"].innerHTML = util.showTxt(msg)
    };
    _self.avoid_double_login = function (remove) {
        if (remove) {
            util.removeEvent(_mc["btn_login"], "click");
            util.removeEvent(_mc["pwd"], "keyup");
            util.removeEvent(_mc["usr"], "keyup")
        } else {
            util.addEvent(_mc["btn_login"], "click", _self.loginEvent);
            util.addEvent(_mc["pwd"], "keyup", _self.keyupEventHandler);
            util.addEvent(_mc["usr"], "keyup", _self.keyupEventHandler)
        }
    };
    _self.check_Complete = function (msg) {
        var errorMsg = util.showConnectMsg(msg);
        if (util.alertConnectMsg(errorMsg)) return;
        if (msg != "") try {
            var memSet = JSON.parse(msg);
            var odds_length = top["userData"].odd_f.split(",");
            top["memSet"] = memSet;
            if (memSet.odd_f_type) for (var i = 0; i < odds_length.length; i++) if (odds_length[i] == memSet.odd_f_type) top["userData"].odd_f_type = memSet.odd_f_type
        } catch (e) {
        }
        if (top["userData"]["secondSet4pwd"] == "Y") _self.setPassCode();
        var inputUID = top["userData"].passwd_safe.toLowerCase().trim();
        var cookieUID = CookieManager.get("PID") ? CookieManager.get("UID").toLowerCase().trim() : "";
        if (CookieManager.get("box4pwd_notshow_" +
            top["userData"].mid) != null) abox4pwd_notshow = CookieManager.get("box4pwd_notshow_" + top["userData"].mid).split("_");
        if (!top["memSet"].passcode && CookieManager.get("PID") || !top["memSet"].passcode && !CookieManager.get("PID") || !top["memSet"].passcode || top["memSet"].passcode == "[del]" || top["memSet"].passcode == "[del1]") {
            top["userData"].four_pwd = "new";
            top["userData"].abox4pwd_notshow = abox4pwd_notshow[1]
        } else if (top["memSet"].passcode && !CookieManager.get("PID") || (CookieManager.get("UID") != top["userData"].passwd_safe ||
            !CookieManager.get("UID"))) {
            top["userData"].four_pwd = "second";
            top["userData"].abox4pwd_notshow = abox4pwd_notshow[1]
        } else if (top["errorTwice"] && cookieUID == inputUID) {
            top["userData"].four_pwd = "errorTwice";
            _self.setErrorTwice()
        }
        CookieManager.del("error1");
        parentClass.dispatchEvent("loginSuccess", {});
        if (CookieManager.get("toperrorTwice")) {
            top["errorTwice"] = false;
            CookieManager.del("toperrorTwice")
        }
        _self.avoid_double_login(false)
    };
    _self.show_Errmsg = function (msg) {
        isClick = false
    };
    _self.forgotEvent = function (e,
                                  param) {
        parentClass.dispatchEvent("show_forgotEvent", {})
    };
    _self.pwd4Event = function (e, param) {
        if (CookieManager.get("PID") == null && CookieManager.get("now_passcode")) {
            _mc["btn_pwd4"].style.display = "none";
            _mc["text_error"].style.display = "";
            _mc["text_error"].innerHTML = LS_code.get("4pwd_removedAlready");
            CookieManager.del("now_passcode")
        } else if (CookieManager.get("PID") == null) {
            _mc["btn_pwd4"].style.display = "none";
            _mc["text_error"].style.display = "";
            _mc["text_error"].innerHTML = LS_code.get("4pwd_db_fail")
        } else {
            document.getElementById("acc_show").classList.add("pass_outside");
            parentClass.dispatchEvent("show_prepasscode", {})
        }
    };
    _self.chk_acc = function () {
        if (CookieManager.get("previous_langx")) CookieManager.del("previous_langx");
        if (CookieManager.get("chg_langx")) CookieManager.del("chg_langx");
        if (CookieManager.get("errorCount")) {
            top["errorCount"] = CookieManager.get("errorCount");
            CookieManager.del("errorCount")
        }
        if (CookieManager.get("toperrorTwice")) {
            top["errorTwice"] = CookieManager.get("toperrorTwice");
            CookieManager.del("toperrorTwice")
        }
        top["login_4pwd_sw"] = login_4pwd_sw;
        if (CookieManager.get("loginuser") !=
            null) {
            _mc["usr"].value = CookieManager.get("loginuser");
            _mc["remember"].checked = true;
            _mc["usr_lab"].className = "lab_input"
        }
        if (top["errorCode"] == "995" || top["errorCode"] == "996" || top["errorCode"] == "997" || top["errorCode"] == "998" || top["errorCode"] == "999") {
            var errStr = "";
            _mc["text_error"].style.display = "";
            switch (top["errorCode"]) {
                case "995":
                    errStr = LS_code.get("4pwd_chg_pwd");
                    break;
                case "996":
                    errStr = LS_code.get("4pwd_db_fail");
                    break;
                case "997":
                    errStr = LS_code.get("4pwd_removedAlready");
                    break;
                case "998":
                    errStr =
                        LS_code.get("4pwd_block");
                    break;
                case "999":
                    errStr = LS_code.get("4pwd_fail_twice");
                    inputCode = "";
                    break
            }
            _mc["text_error"].innerHTML = errStr
        }
        var error = CookieManager.get("error1");
        if (top["errorTwice"] && CookieManager.get("PID") != null && error == null) {
            _mc["text_error"].style.display = "";
            _mc["text_error"].innerHTML = LS_code.get("4pwd_fail_twice")
        }
        if (CookieManager.get("PID") != null && CookieManager.get("UID") != null && !top["errorTwice"] && top["userData"].msg != "101" && top.aspenbet != "Y") _self.show4PwdBtn(true); else _self.show4PwdBtn(false);
        if (top["userData"].msg == "101") {
            _mc["text_error"].style.display = "";
            _mc["text_error"].innerHTML = util.showTxt(top["userData"].code_message)
        }
    };
    _self.setPassCode = function () {
        var tmp_date = (new Date).toJSON().slice(0, 10);
        action = "SET";
        var urlParams = "";
        urlParams += "p=checkPassCode";
        urlParams += "&" + top.param;
        urlParams += "&inputCode=" + top["userData"].passwd_safe + "|" + top["memSet"].passcode + "|" + top["userData"].mid + "|N|" + tmp_date;
        urlParams += "&action=" + action;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError",
            _self.onError);
        getHTML.addEventListener("LoadComplete", _self.encodePassCodeFinish);
        getHTML.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.encodePassCodeFinish = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        var xmdObj = new Object;
        xmlnode = util.parseXml(xml);
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
        if (xmdObj["code"].innerHTML == "484" && top.aspenbet != "Y") {
            var getPID = xmlnode.Node(xmlnode.Root[0], "data").innerHTML;
            CookieManager.set("PID", encodeURIComponent(getPID),
                3650);
            CookieManager.set("UID", top["userData"].passwd_safe, 3650);
            top["userData"]["secondSet4pwd"] = "Y"
        }
    };
    _self.chg_site = function () {
        var ret = false;
        var userAgent = navigator.userAgent;
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        var isIE11 = userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) ret = true;
        return ret
    };
    _self.usrorpwd_dele = function (e, param) {
        if (param.click == "usr") _mc["usr"].value = ""; else if (param.click == "pwd") _mc["pwd"].value = ""
    };

    function keyupForFireFox(e) {
        var key =
            window.event ? e.keyCode : e.which;
        if (key == "13") {
            _self.avoid_double_login(true);
            _self.loginEvent();
            dom.activeElement.blur()
        }
    }

    _self.keyupEventHandler = function (e, param) {
        if (e.keyCode == 0) charCode = event.which; else charCode = event.keyCode ? event.keyCode : event.which;
        if (charCode == "13") {
            _self.avoid_double_login(true);
            _self.loginEvent();
            dom.activeElement.blur()
        }
    };
    _self.setErrorTwice = function () {
        var keycode = CookieManager.get("PID");
        var par = "";
        par += "p=checkPassCode";
        par += "&" + top.param;
        par += "&inputCode=N";
        par += "&keycode=" +
            keycode;
        par += "&action=SETSW";
        var hr = new HttpRequest;
        hr.addEventListener("LoadComplete", function (xml) {
            var errorMsg = util.showConnectMsg(xml);
            if (util.alertConnectMsg(errorMsg)) return;
            var xmdObj = new Object;
            xmlnode = util.parseXml(xml);
            xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
            if (xmdObj["code"].innerHTML == "484") {
                var getPID = xmlnode.Node(xmlnode.Root[0], "data").innerHTML;
                CookieManager.set("PID", util.showTxt(encodeURIComponent(getPID)), 3650);
                CookieManager.set("UID", top["userData"].passwd_safe, 3650)
            }
        });
        hr.loadURL(top.m2_url, "POST", par)
    };
    _self.orientation = function () {
        parentClass.dispatchEvent("scrollsetTop", {})
    };
    _self.exitEvent = function () {
        return true
    };
    _self.browsedownload = function (e, param) {
        if (top.isapp != "Y") if (param.browse == "chrome") window.open("https://www.google.com/chrome", "_blank"); else if (param.browse == "uc") window.open("http://www.ucweb.com/", "_blank"); else if (param.browse == "safari") window.open("https://support.apple.com/downloads/safari", "_blank"); else if (param.browse == "firefox") window.open("https://www.mozilla.org/en-US/",
            "_blank")
    };
    _self.systemrequire = function () {
        parentClass.dispatchEvent("systemreq", {"act": "system_req"})
    };
    _self.goToip_guide = function () {
        parentClass.dispatchEvent("systemreq", {"act": "ip_guide"})
    };
    _self.iovationChkCount = function () {
        top.iovationCount += 1
    }
};