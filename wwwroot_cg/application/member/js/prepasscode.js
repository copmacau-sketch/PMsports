function prepasscode(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var LS;
    var LS_code;
    var keep_key = new Array;
    var isClick = false;
    var CookieManager = new win.CookieManager;
    var _mc = new Object;
    var username = "";
    var keycode = "";
    var codeCount = 0;
    var inputCode = "";
    top.isback4pwd = true;
    _self.paramHash = new Object;
    _self.paramHash["errorMsg"] = "";
    var classname = "prepasscode";
    var myhash = {};
    _self.init = function () {
        parentClass.dispatchEvent("getIovationBlackBox");
        _mc["user_name"] = document.getElementById("user_name");
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
        _self.addEventListener("retryLoop", _self.retryLoop);
        _self.addEventListener("retryLastfail", _self.retryLastfail);
        _self.addEventListener("login4pwdRetryComplete", _self.login4pwdRetryComplete);
        _self.addEventListener("retryComplete", _self.retryComplete);
        util.addEvent(dom.getElementById("browse_chr"), "click", _self.browsedownload, {"browse": "chrome"});
        util.addEvent(dom.getElementById("browse_saf"), "click", _self.browsedownload, {"browse": "safari"});
        util.addEvent(dom.getElementById("browse_fox"), "click", _self.browsedownload, {"browse": "firefox"});
        util.addEvent(dom.getElementById("systemreq"), "click", _self.systemrequire);
        util.addEvent(dom.getElementById("ip_guide"), "click", _self.goToip_guide);
        util.addEvent(dom.getElementById("delpasscode"), "click", _self.delEventHandler);
        util.addEvent(dom.getElementById("back_login"), "click", _self.goToNormal);
        for (var i =
            1; i <= 4; i++) _mc["empty_" + i] = document.getElementById("empty_" + i);
        for (var i = 0; i < 10; i++) {
            _mc["num_" + i] = document.getElementById("num_" + i);
            _mc["num_" + i].val = i;
            _self.setTouchStart(_mc["num_" + i], i)
        }
        if (top.isapp != "Y") dom.getElementById("ip_run").href = top.chg_ad_ph; else dom.getElementById("ip_run").href = "#";
        dom.getElementById("run_ip").innerHTML = util.showTxt(top.ad_ip);
        if (top.chg_ad_ph == "http://") dom.getElementById("ip_run").className = "img_ip no_ip"; else dom.getElementById("ip_run").className = "";
        username = CookieManager.get("UID");
        keycode = CookieManager.get("PID");
        top["userData"].alias = username;
        _mc["user_name"].innerHTML = util.showTxt(username);
        _self.reSet()
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        config_set = parentClass.getThis("config_set");
        LS_code = parentClass.getThis("LS_code")
    };
    _self.showAlertMsg = function (param) {
        parentClass.dispatchEvent("showAlertMsg", param)
    };
    _self.bodyGoToPage = function (param) {
        parentClass.dispatchEvent("bodyGoToPage",
            param)
    };
    _self.setTouchStart = function (obj, val) {
        util.addEvent(obj, "click", function (e) {
            _self.setVal(val)
        })
    };
    _self.setVal = function (val) {
        if (codeCount == 0) {
            _self.setErrorMsg("");
            _self.showErrorMsg(false)
        }
        if (codeCount < 4) {
            codeCount++;
            inputCode += val;
            _mc["empty_" + codeCount].classList.add("active");
            _mc["empty_" + codeCount].classList.remove("empty")
        }
        if (codeCount == 4) {
            codeCount++;
            _self.chkPassCode()
        }
    };
    _self.reSet = function () {
        for (var i = 1; i <= 4; i++) {
            _mc["empty_" + i].classList.remove("active");
            _mc["empty_" + i].classList.add("empty")
        }
        codeCount =
            0;
        inputCode = "";
        _self.setErrorMsg("");
        _self.showErrorMsg(false)
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
    _self.exitEvent = function () {
        util.echo("xxx exit");
        return true
    };
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
    _self.back_login = function () {
        parentClass.dispatchEvent("show_back_login", {})
    };
    _self.show_Errmsg = function (msg) {
        isClick = false;
        dom.getElementById("oth_pass_err").style.display = ""
    };
    _self.retryLoop = function (param) {
        parentClass.dispatchEvent("retryLoop", param)
    };
    _self.retryLastfail = function () {
        parentClass.dispatchEvent("retryLastfail")
    };
    _self.login4pwdRetryComplete = function () {
        parentClass.dispatchEvent("login4pwdRetryComplete")
    };
    _self.retryComplete = function () {
        parentClass.dispatchEvent("retryComplete")
    };
    _self.chkPassCode =
        function () {
            var tmp_date = (new Date).toJSON().slice(0, 10);
            action = "GET";
            var urlParams = "";
            urlParams += "p=checkPassCode";
            if (top.param) urlParams += "&" + top.param;
            urlParams += "&inputCode=" + inputCode;
            urlParams += "&keycode=" + keycode;
            urlParams += "&action=" + action;
            var getHTML = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), "loginFrame");
            getHTML.setParentclass(_self);
            getHTML.addEventListener("onError", _self.onError);
            getHTML.addEventListener("LoadComplete", _self.checkPassCodeComplete);
            getHTML.loadURL(top.m2_url, "POST", urlParams)
        };
    _self.checkPassCodeComplete = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        var xmdObj = new Object;
        xmlnode = util.parseXml(xml);
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
        if (xmdObj["code"].innerHTML == "666") {
            _self._connetToServer();
            return
        } else {
            var errorCode = xmdObj["code"].innerHTML;
            var errorMsg = "";
            switch (errorCode) {
                case "990":
                    errorMsg = LS_code.get("user_stop");
                    break;
                case "991":
                    errorMsg = LS_code.get("user_forbid");
                    break;
                case "995":
                    errorMsg = LS_code.get("4pwd_chg_pwd");
                    break;
                case "996":
                    errorMsg = LS_code.get("4pwd_db_fail");
                    break;
                case "997":
                    errorMsg = LS_code.get("4pwd_removedAlready");
                    break;
                case "998":
                    errorMsg = LS_code.get("4pwd_block");
                    break;
                case "999":
                    errorMsg = LS_code.get("4pwd_login_fail");
                    inputCode = "";
                    break
            }
            if (errorCode == "995" || errorCode == "996" || errorCode == "997" || errorCode == "990" || errorCode == "991") {
                CookieManager.del("PID");
                CookieManager.del("UID");
                top["errorCount"] = 0;
                top["errorCode"] = errorCode;
                if (errorCode ==
                    "990" || errorCode == "991") parentClass.dispatchEvent("show_back_login", {"errMsg": errorMsg}); else parentClass.dispatchEvent("show_back_login", {});
                return
            } else if (errorCode == "998") {
                top["errorCount"] = 0;
                top["errorCode"] = errorCode;
                CookieManager.del("PID");
                CookieManager.del("UID");
                parentClass.dispatchEvent("show_back_login", {});
                return
            }
            top["errorCount"]++;
            if (top["errorCount"] == 2) {
                top["errorTwice"] = true;
                if (top["errorCount"] == 2) {
                    top["errorCount"] = 0;
                    var par = "";
                    par += "p=checkPassCode";
                    if (top.param) par += "&" + top.param;
                    par += "&inputCode=Y";
                    par += "&keycode=" + keycode;
                    par += "&action=SETSW";
                    var hr = new HttpRequest;
                    hr.addEventListener("LoadComplete", function (xml) {
                        var errorMsg = util.showConnectMsg(xml);
                        if (util.alertConnectMsg(errorMsg)) return;
                        var xmdObj = new Object;
                        xmlnode = util.parseXml(xml);
                        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
                        if (xmdObj["code"].innerHTML == "484" && top.aspenbet != "Y") {
                            var getPID = xmlnode.Node(xmlnode.Root[0], "data").innerHTML;
                            CookieManager.set("PID", encodeURIComponent(getPID), 3650);
                            CookieManager.set("UID",
                                username, 3650)
                        }
                    });
                    hr.loadURL(top.m2_url, "POST", par)
                }
                top["errorCode"] = errorCode;
                parentClass.dispatchEvent("show_back_login", {});
                return
            }
            for (var i = 1; i <= 4; i++) {
                _mc["empty_" + i].classList.remove("active");
                _mc["empty_" + i].classList.add("empty")
            }
            _self.setErrorMsg(errorMsg);
            _self.showErrorMsg(true);
            codeCount = 0
        }
    };
    _self.showErrorMsg = function (isShow) {
        dom.getElementById("oth_pass_err").style.display = isShow ? "" : "none"
    };
    _self.setErrorMsg = function (msg) {
        dom.getElementById("oth_pass_err").innerHTML = util.showTxt(msg)
    };
    _self.turnToNormal = function (afterFunc) {
        parentClass.dispatchEvent("showLoading", {})
    };
    _self._connetToServer = function () {
        var ua = btoa(navigator.userAgent);
        parentClass.dispatchEvent("loginFullLoading", {"isShow": true});
        isClick = true;
        var par = "";
        par += "p=chk_login";
        par += "&langx=" + top.langx;
        par += "&ver=" + top.ver;
        par += "&is4pwd=Y";
        par += "&keycode=" + keycode;
        par += "&app=N";
        par += "&auto=" + top.iovationKey;
        par += "&blackbox=" + top.blackbox;
        par += "&userAgent=" + ua;
        var hr = new HttpRequest;
        hr.addEventListener("onError", function () {
            show_Errmsg(top["connect_retry"])
        });
        hr.addEventListener("LoadComplete", _self.connectComplete);
        hr.loadURL(top.m2_url, "POST", par)
    };
    _self.connectComplete = function (xml) {
        if (xml.indexOf("CheckIOSapp error") != -1) {
            alert("Attention! Illegally logining.");
            return
        }
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg)) return;
        if (CookieManager.get("doubleLogin")) CookieManager.del("doubleLogin");
        isClick = false;
        xmlnode = util.parseXml(xml);
        var odd_f = xmlnode.Node(xmlnode.Root[0], "odd_f").innerHTML;
        top["userData"].status = xmlnode.Node(xmlnode.Root[0],
            "status").innerHTML;
        top["userData"].msg = xmlnode.Node(xmlnode.Root[0], "msg").innerHTML;
        top["userData"].code_message = xmlnode.Node(xmlnode.Root[0], "code_message").innerHTML;
        top["userData"].username = xmlnode.Node(xmlnode.Root[0], "username").innerHTML;
        top["userData"].mid = xmlnode.Node(xmlnode.Root[0], "mid").innerHTML;
        top["userData"].uid = xmlnode.Node(xmlnode.Root[0], "uid").innerHTML;
        top["userData"].ltype = xmlnode.Node(xmlnode.Root[0], "ltype").innerHTML;
        top["userData"].currency = xmlnode.Node(xmlnode.Root[0],
            "currency").innerHTML;
        top["userData"].odd_f = xmlnode.Node(xmlnode.Root[0], "odd_f").innerHTML;
        top["userData"].domain = xmlnode.Node(xmlnode.Root[0], "domain").innerHTML;
        top["userData"].passwd_safe = xmlnode.Node(xmlnode.Root[0], "passwd_safe").innerHTML;
        top["userData"].blackBoxStatus = xmlnode.Node(xmlnode.Root[0], "blackBoxStatus").innerHTML;
        top.param = "uid=" + top["userData"].uid + "&ver=" + top.ver + "&langx=" + top.langx;
        top["userData"].odd_f_type = "H";
        var odds_length = top["userData"].odd_f.split(",");
        if (CookieManager.get("odd_f_type_" +
            top["userData"].mid)) for (var i = 0; i < odds_length.length; i++) if (odds_length[i] == CookieManager.get("odd_f_type_" + top["userData"].mid)) top["userData"].odd_f_type = CookieManager.get("odd_f_type_" + top["userData"].mid);
        if (top["userData"].status == "200") if (top["userData"].msg == "100") if (_self.chg_site()) parentClass.dispatchEvent("browser_rule", {}); else {
            _self.getMemSet();
            return
        } else if (top["userData"].msg == "106") {
            parentClass.dispatchEvent("showchg_pwd", {"isFromPasscode": "Y"});
            return
        }
        var errorMsg = "";
        if (top["userData"].code_message !=
            null && typeof top["userData"].code_message != "undefined" && top["userData"].code_message != "") {
            errorMsg = top["userData"].code_message;
            if (top["userData"].msg == "101") {
                parentClass.dispatchEvent("show_back_login", {});
                return
            }
            if (top["userData"].msg == "108") {
                errorMsg = LS_code.get("login_lock");
                parentClass.dispatchEvent("show_back_login", {"errMsg": errorMsg})
            }
        } else {
            errorMsg = LS_code.get("errorLogin");
            parentClass.dispatchEvent("show_back_login", {"errMsg": errorMsg})
        }
        return
    };
    _self.getMemSet = function () {
        var par = "";
        par +=
            "p=memSet";
        par += "&langx=" + top.langx;
        par += "&uid=" + top["userData"].uid;
        par += "&action=check";
        var hr = new HttpRequest;
        hr.addEventListener("onError", function () {
            show_Errmsg(top["connect_retry"])
        });
        hr.addEventListener("LoadComplete", _self.getMemSetFinish);
        hr.loadURL(top.m2_url, "POST", par)
    };
    _self.getMemSetFinish = function (data) {
        _self.paramHash["errorMsg"] = util.showConnectMsg(data);
        if (util.alertConnectMsg(_self.paramHash["errorMsg"])) return;
        if (data != "") try {
            var memSet = JSON.parse(data);
            var odds_length = top["userData"].odd_f.split(",");
            top["memSet"] = memSet;
            if (memSet.odd_f_type) for (var i = 0; i < odds_length.length; i++) if (odds_length[i] == memSet.odd_f_type) top["userData"].odd_f_type = memSet.odd_f_type
        } catch (e) {
        }
        parentClass.dispatchEvent("loginSuccess", {})
    };
    _self.delEventHandler = function () {
        if (_mc["empty_" + codeCount]) {
            inputCode = inputCode.substring(0, inputCode.length - 1);
            _mc["empty_" + codeCount].classList.add("empty");
            _mc["empty_" + codeCount].classList.remove("active");
            codeCount--
        }
    };
    _self.goToNormal = function () {
        parentClass.dispatchEvent("show_back_login",
            {})
    };
    _self.chg_site = function () {
        var ret = false;
        var userAgent = navigator.userAgent;
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        var isIE11 = userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) ret = true;
        return ret
    };
    _self.browsedownload = function (e, param) {
        if (top.isapp != "Y") if (param.browse == "chrome") window.open("https://www.google.com/chrome", "_blank"); else if (param.browse == "uc") window.open("http://www.ucweb.com/", "_blank"); else if (param.browse == "safari") window.open("https://support.apple.com/downloads/safari",
            "_blank"); else if (param.browse == "firefox") window.open("https://www.mozilla.org/en-US/", "_blank")
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