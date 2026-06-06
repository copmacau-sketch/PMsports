function login_index(_win, _dom) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var classname = "login_index";
                var CookieManager = new win.CookieManager;
                var util = new win.Util(win,dom);
                var config_set = new win.config_set;
                var LS;
                var LS_code;
                var urgent = false;
                var maintain = false;
                var emergency = false;
                var loginFrame = null;
                var alertFrame = null;
                var systemFrame = null;
                var SerFrame = null;
                var pageHash = new Object;
                var failCount = new Object;
                var timerHash = new Object;
                var myhash = new Object;
                var eventHandler = new Object;
                var startTouchY = 0;
                var fixY = 15;
                var doublecount = 0;
                var global_protocol = dom.location.protocol.replace(":", "");
                var errorCount = 0;
                var errorTwice = false;
                var retryTimer;
                var cssRetFuncHash = new Object;
                var cssTotalCount = new Object;
                var cssFinishCount = new Object;
                var cache_html_sw = true;
                var ios = util.isIOS();
                var firstchgid = false;
                var box4pwd_notshow = "N";
                var first90height = null;
                var lastHeight = null;
                top["CookieManager2"] = CookieManager;
                top["userData"] = new Object;
                top["requestFailedCount"] = 0;
                top["requestHash"] = new Object;
                top["requestFailedHash"] = new Object;
                top["m2_url"] = util.getWebUrl() + "/transform.php";
                win._history = new Array;
                _self.init = function() {
                    if (ios)
                        util.addClass(dom.getElementsByTagName("html")[0], "ios_scroll");
                    myhash["util"] = util;
                    myhash["config_set"] = config_set;
                    myhash["CookieManager"] = CookieManager;
                    myhash[_self] = _self;
                    var CookieChk = CookieManager.get("CookieChk") ? CookieManager.get("CookieChk") : "";
                    if (top.cookieEncode == "Y")
                        if (CookieChk == "")
                            util.CookieChkProc("encode");
                        else
                            top.cookieEncode_sw = "Y";
                    else if (CookieChk != "")
                        util.CookieChkProc("decode");
                    else
                        top.cookieEncode_sw = "N";
                    CookieManager.set("protocolstr", global_protocol, 1);
                    if (top.sub_doubleLogin == "Y")
                        CookieManager.set("doubleLogin", "double_" + (new Date).getTime());
                    if (top.needsTrans) {
                        var master_IP = util.getProtocal() + "//" + top.needsTrans;
                        if (CookieManager.get("doubleLogin")) {
                            var sub_doubleLogin = "Y";
                            CookieManager.del("doubleLogin");
                            util.topGoToUrl(master_IP, {
                                "sub_doubleLogin": sub_doubleLogin
                            })
                        } else
                            util.topGoToUrl(master_IP);
                        return
                    }
                    win.addEventListener("message", _self.onMessage, false);
                    _self.loadFile();
                    config_set.init();
                    _self.chg_langx(top.ls);
                    if (win.addEventListener)
                        win.addEventListener("popstate", _self.popstate);
                    if (win.addEventListener)
                        win.addEventListener("orientationchange", _self.orientation);
                    if (win.addEventListener)
                        win.addEventListener("resize", _self.orientationBlur);
                    _self.addEventListener("retryLoop", _self.retryLoop);
                    _self.addEventListener("showAlertMsg", _self.showAlertMsg);
                    _self.addEventListener("hideAlertMsg", _self.hideAlertMsg);
                    _self.addEventListener("retryLastfail", _self.retryLastfail);
                    _self.addEventListener("retryComplete", _self.retryComplete);
                    _self.addEventListener("scrollsetTop", _self.scrollsetTop);
                    _self.addEventListener("systemreq", _self.systemreq);
                    _self.addEventListener("show_prepasscode", _self.show_prepasscode);
                    _self.addEventListener("show_forgotEvent", _self.show_forgotEvent);
                    _self.addEventListener("loginSuccess", _self.loginSuccess);
                    _self.addEventListener("browser_rule", _self.browser_rule);
                    _self.addEventListener("loginFullLoading", _self.loginFullLoading);
                    _self.addEventListener("showchg_id", _self.showchg_id);
                    _self.addEventListener("showchg_pwd", _self.showchg_pwd);
                    _self.addEventListener("show_back_login", _self.show_back_login);
                    _self.addEventListener("show_back_4pwd", _self.show_back_4pwd);
                    _self.addEventListener("removebodylock", _self.removebodylock);
                    _self.addEventListener("addbodylock", _self.addbodylock);
                    _self.addEventListener("login_help", _self.login_help);
                    _self.addEventListener("getIovationBlackBox", _self.getIovationBlackBox);
                    top["local_storage"] = _self.getLocalStorage();
                    if (top["local_storage"] == "initFail") {
                        document.getElementById("acc_show").classList.add("pass_outside");
                        _self.private();
                        return
                    }
                    if (top.mobile == "Y") {
                        var main = dom.getElementById("main");
                        main.classList.add("mobile");
                        if (ios) {
                            util.addEvent(dom.body, "touchend", _self.ios_blur);
                            util.addClass(main, "main_ios")
                        }
                    }
                    _self.clearSerTimer();
                    _self.createSerTimer();
                    _self.createNetTimer();
                    util.setParentclass(_self);
                    _self.SerrefreshPage()
                }
                ;
                _self.getParentThis = function(varible) {
                    return _self.getThis(_self)
                }
                ;
                _self.getThis = function(varible) {
                    if (!myhash[varible])
                        if (typeof varible == "string")
                            var msg = "no myhash[" + varible + "]";
                        else
                            var msg = "no myhash[" + JSON.stringify(varible) + "]";
                    return myhash[varible]
                }
                ;
                _self.addEventListener = function(eventname, eventFunction) {
                    eventHandler[eventname] = eventFunction
                }
                ;
                _self.dispatchEvent = function(eventname, param) {
                    if (eventHandler[eventname])
                        eventHandler[eventname](param)
                }
                ;
                _self.loadFile = function() {
                    var cuCookie = CookieManager.get("cu");
                    if (!cuCookie) {
                        CookieManager.set("cu", "N");
                        top["userData"].cu = "N"
                    }
                    if (top.cu_domain) {
                        var sc = document.createElement("iframe");
                        sc.id = "cu_ifr";
                        sc.style.display = "none";
                        sc.src = document.location.protocol + "//" + top.cu_domain + "/transform.php?p=loadDomain&type=cu&ver=" + _self.getRandom();
                        document.body.appendChild(sc);
                        cuTimer = setTimeout(_self.cuAbort, 5E3, sc)
                    }
                    var cuipv6Cookie = CookieManager.get("cuipv6");
                    if (!cuipv6Cookie) {
                        CookieManager.set("cuipv6", "N");
                        top["userData"].cuipv6 = "N"
                    }
                    if (top.cuipv6_domain) {
                        var cipv6 = document.createElement("iframe");
                        cipv6.id = "cuipv6_ifr";
                        cipv6.style.display = "none";
                        cipv6.src = document.location.protocol + "//" + top.cuipv6_domain + "/transform.php?p=loadDomain&type=cuipv6&ver=" + _self.getRandom();
                        document.body.appendChild(cipv6);
                        cuipv6Timer = setTimeout(_self.cuipv6Abort, 5E3, cipv6)
                    }
                    var ipv6Cookie = CookieManager.get("ipv6");
                    if (!ipv6Cookie) {
                        CookieManager.set("ipv6", "N");
                        top["userData"].ipv6 = "N"
                    }
                    if (top.ipv6_domain) {
                        var sipv6 = document.createElement("iframe");
                        sipv6.id = "ipv6_ifr";
                        sipv6.style.display = "none";
                        sipv6.src = document.location.protocol + "//" + top.ipv6_domain + "/transform.php?p=loadDomain&type=ipv6&ver=" + _self.getRandom();
                        document.body.appendChild(sipv6);
                        ipv6Timer = setTimeout(_self.ipv6Abort, 5E3, sipv6)
                    }
                }
                ;
                _self.checkIos15 = function() {
                    _self.checkHeight();
                    if (_self.is_ios15_safari())
                        util.addClass(dom.getElementsByTagName("html")[0], "ios15")
                }
                ;
                _self.checkHeight = function() {
                    if (!_self.is_ios15_safari())
                        return;
                    var ori = win.Math.abs(win.orientation);
                    if (ori == 0) {
                        var goInnerHeight = false;
                        var defined_h = config_set.get("IOS15");
                        var bodyObj = dom.documentElement || dom.body;
                        var c_height = bodyObj.clientHeight;
                        switch (c_height) {
                        case defined_h["PHONE_12+"]["TOP_HEIGHT"]:
                        case defined_h["PHONE_12+_MINI"]["TOP_HEIGHT"]:
                        case defined_h["PHONE_12+_PRO_MAX"]["TOP_HEIGHT"]:
                        case defined_h["PHONE_X+"]["TOP_HEIGHT"]:
                        case defined_h["PHONE_X+_PRO"]["TOP_HEIGHT"]:
                        case defined_h["PHONE_X+_PRO_MAX"]["TOP_HEIGHT"]:
                            goInnerHeight = true;
                            break;
                        case defined_h["PHONE_12+"]["BTM_HEIGHT"]:
                        case defined_h["PHONE_12+_MINI"]["BTM_HEIGHT"]:
                        case defined_h["PHONE_12+_PRO_MAX"]["BTM_HEIGHT"]:
                        case defined_h["PHONE_X+"]["BTM_HEIGHT"]:
                        case defined_h["PHONE_X+_PRO"]["BTM_HEIGHT"]:
                        case defined_h["PHONE_X+_PRO_MAX"]["BTM_HEIGHT"]:
                            goInnerHeight = false;
                            break
                        }
                        if (c_height < defined_h["PHONE_6+"]["HEIGHT"] || c_height == defined_h["PHONE_6+_PLUS"]["HEIGHT"]) {
                            goInnerHeight = false;
                            isHome = true
                        }
                        var absHeight = 0;
                        if (lastHeight != null) {
                            absHeight = win.Math.abs(lastHeight - c_height);
                            goInnerHeight = absHeight != 1
                        }
                        if (!isHome && goInnerHeight)
                            _self.chgHeight(win.innerHeight + "px");
                        else
                            _self.chgHeight("100vh")
                    } else if (ori == 90)
                        setTimeout(_self.chgHeight, 500, win.innerHeight + "px");
                    lastHeight = win.innerHeight
                }
                ;
                _self.is_ios15_safari = function() {
                    var agent = win.navigator.userAgent;
                    if (agent.indexOf("iPhone OS 15_0") != -1)
                        if (agent.indexOf("CriOS") == -1 && agent.indexOf("FxiOS") == -1 && agent.indexOf("QQ") == -1)
                            return true;
                    return false
                }
                ;
                _self.chgHeight = function(h) {
                    var obj = dom.getElementsByTagName("html")[0];
                    if (obj) {
                        obj.style.height = h;
                        obj.style.overflow = "hidden"
                    }
                }
                ;
                _self.cuAbort = function(sc) {
                    CookieManager.set("cu", "N");
                    top["userData"].cu = "N";
                    sc.src = "";
                    sc.parentNode.removeChild(sc)
                }
                ;
                _self.ipv6Abort = function(sipv6) {
                    CookieManager.set("ipv6", "N");
                    top["userData"].ipv6 = "N";
                    sipv6.src = "";
                    sipv6.parentNode.removeChild(sipv6)
                }
                ;
                _self.cuipv6Abort = function(cipv6) {
                    CookieManager.set("cuipv6", "N");
                    top["userData"].cuipv6 = "N";
                    cipv6.src = "";
                    cipv6.parentNode.removeChild(cipv6)
                }
                ;
                _self.chg_langx = function(ls) {
                    var lss = ls.toUpperCase();
                    if (lss == "US")
                        lss = "EN";
                    util.setObjectClass(dom.getElementById("main"), "main " + lss);
                    LS = _self.new_eval("new LS_" + ls + "();");
                    LS_code = _self.new_eval("new LS_code_" + ls + "();");
                    LS.init();
                    LS_code.init();
                    myhash["LS"] = LS;
                    myhash["LS_code"] = LS_code;
                    dom.getElementById("select_lea").innerHTML = LS_code.get("indexsubmit")
                }
                ;
                _self.new_eval = function(str) {
                    var fn = Function;
                    return (new fn("return " + str))()
                }
                ;
                _self.getLocalStorage = function() {
                    var tmp_storage = null;
                    try {
                        tmp_storage = window.localStorage ? window.localStorage : window.globalStorage[strDomain];
                        tmp_storage["init"] = "true"
                    } catch (e) {
                        return "initFail"
                    }
                    return tmp_storage
                }
                ;
                _self.private = function() {
                    _self.setLoadingVisible(true);
                    dom.getElementById("home_show").style.display = "none";
                    dom.getElementById("acc_show").style.display = "none";
                    dom.getElementById("chgAcc_show").style.display = "none";
                    _self.goToPage("acc_show", "private", function() {
                        loginFrame = new win.private_page(win,dom,null);
                        myhash["loginFrame"] = loginFrame;
                        loginFrame.setParentclass(_self);
                        loginFrame.init();
                        dom.getElementById("acc_show").style.display = ""
                    }, {})
                }
                ;
                _self.goToPage = function(target, page, retFun, param) {
                    clearTimeout(retryTimer);
                    if (!failCount[page])
                        failCount[page] = 0;
                    var page_name = target + "_" + page + "_" + top.ver;
                    var tmpKey = page_name + "_" + util.getTimestamp();
                    cssRetFuncHash[tmpKey] = new Object;
                    cssRetFuncHash[tmpKey].func = retFun;
                    cssRetFuncHash[tmpKey].param = param;
                    var ht = new win.HttpRequestRetry(win.HttpRequest,config_set.get("RETRY_TIME"),config_set.get("RETRY_LIMIT"),null);
                    ht.setParentclass(_self);
                    ht.addEventListener("onError", _self.onError);
                    ht.addEventListener("LoadComplete", function(html) {
                        var errorMsg = util.showConnectMsg(html);
                        if (util.alertConnectMsg(errorMsg))
                            return;
                        top["Requesterrorcount"] = 1;
                        top["Requesttime"] = null;
                        failCount[page] = 0;
                        var tempHtml = new win.parseHTML(html);
                        var dbody = tempHtml.getTag("div")[0];
                        var alink = tempHtml.getTag("link");
                        var scp = tempHtml.getTag("script");
                        var ts = "";
                        if (!dbody)
                            try {
                                var errHash = JSON.parse(html);
                                if (util.chkErrorMsg(errHash, LS_code))
                                    return
                            } catch (e) {
                                util.err("[load html error]" + page, e);
                                return
                            }
                        var jsObj = new Object;
                        for (var j = 0; j < scp.length; j++) {
                            _self.createJS({
                                "page": page,
                                "scpt": scp[j]
                            });
                            jsObj[page + "_" + j] = scp[j]
                        }
                        cssFinishCount[tmpKey] = 0;
                        cssTotalCount[tmpKey] = alink.length;
                        var ver = top.ver;
                        var cssObj = new Object;
                        for (i = 0; i < alink.length; i++) {
                            _self.createCSS({
                                "page": page,
                                "pageKey": tmpKey,
                                "link": alink[i],
                                "ver": ver,
                                "ts": ts
                            });
                            cssObj[page + "_" + i] = alink[i]
                        }
                        pageHash[page_name] = new Object;
                        pageHash[page_name]["script"] = jsObj;
                        pageHash[page_name]["style"] = cssObj;
                        dbody.innerHTML = _self.load_art(dbody.innerHTML, artjson, top.langx);
                        pageHash[page_name]["html"] = dbody.innerHTML;
                        dom.getElementById(target).innerHTML = dbody.innerHTML;
                        _self.createTitle();
                        _self.clearDuplicate()
                    });
                    if (cache_html_sw && pageHash[page_name]) {
                        var pageName = page;
                        cssFinishCount[tmpKey] = 0;
                        cssTotalCount[tmpKey] = util.countSize(pageHash[page_name]["style"]);
                        for (var key in pageHash[page_name]["script"])
                            _self.createJS({
                                "page": pageName,
                                "scpt": pageHash[page_name]["script"][key]
                            });
                        for (var key in pageHash[page_name]["style"])
                            _self.createCSS({
                                "page": pageName,
                                "pageKey": tmpKey,
                                "link": pageHash[page_name]["style"][key],
                                "ver": top.ver,
                                "ts": param.nowTS
                            });
                        dom.getElementById(target).innerHTML = pageHash[page_name]["html"]
                    } else {
                        var _post = "p=" + page + "&ver=" + top.ver + "&langx=" + top.langx;
                        if (top["userData"].uid != "")
                            _post += "&uid=" + top["userData"].uid;
                        if (param.post)
                            _post += "&" + param.post;
                        ht.loadURL(top.m2_url, "POST", _post)
                    }
                }
                ;
                _self.clearDuplicate = function() {
                    var ori_head = dom.getElementsByTagName("head")[0].children;
                    var sty_len = ori_head.length;
                    var classHash = new Array;
                    for (var i = sty_len - 1; i >= 0; i--) {
                        var realID = ori_head[i].id;
                        if (util.in_array(realID, classHash) && ori_head[i].tagName != "META")
                            ori_head[i].parentNode.removeChild(ori_head[i]);
                        classHash.push(realID)
                    }
                }
                ;
                _self.createTitle = function() {
                    try {
                        var title = dom.createElement("title");
                        title.innerHTML = "Welcome";
                        dom.getElementsByTagName("head")[0].appendChild(title)
                    } catch (e) {
                        util.err("[" + classname + "]", e)
                    }
                }
                ;
                _self.createJS = function(param) {
                    try {
                        var scpt = dom.createElement("script");
                        var tarScpt = param["scpt"];
                        if (tarScpt.src)
                            scpt.src = tarScpt.src;
                        else {
                            scpt.innerHTML = tarScpt.innerHTML;
                            scpt.setAttribute("id", param["page"] + "JS");
                            scpt.setAttribute("name", param["page"])
                        }
                        dom.getElementsByTagName("head")[0].appendChild(scpt)
                    } catch (e) {
                        util.err("[" + classname + "]", e)
                    }
                }
                ;
                _self.createCSS = function(param) {
                    try {
                        var _link = dom.createElement("link");
                        var tarLink = param["link"];
                        if (tarLink.href) {
                            _link.setAttribute("id", param["page"] + "CS_" + (i + 1));
                            _link.setAttribute("name", param["page"]);
                            _link.rel = "stylesheet";
                            _link.type = "text/css";
                            util.addEvent(_link, "load", _self.cssLoad, {
                                "page": param["pageKey"],
                                "ts": param["ts"]
                            });
                            util.addEvent(_link, "error", _self.retryCss, {
                                "page": param["page"],
                                "pageKey": param["pageKey"],
                                "link": param["link"],
                                "ver": param["ver"],
                                "ts": param["ts"]
                            });
                            var tmp_protocol = tarLink.href.split(":")[0];
                            var _url = tarLink.href.split(":")[1];
                            var new_url = tarLink.href;
                            if (tmp_protocol != global_protocol) {
                                new_url = global_protocol + ":" + _url;
                                CookieManager.set("protocolstr", global_protocol, 1)
                            }
                            var ver = "?ver=" + param["ver"];
                            _link.href = new_url + ver
                        }
                        dom.getElementsByTagName("head")[0].appendChild(_link)
                    } catch (e) {
                        util.err("[" + classname + "]", e)
                    }
                }
                ;
                _self.cssLoad = function(e, param) {
                    cssFinishCount[param["page"]]++;
                    if (cssFinishCount[param["page"]] == cssTotalCount[param["page"]]) {
                        if (cssRetFuncHash[param["page"]] && cssRetFuncHash[param["page"]]["func"])
                            cssRetFuncHash[param["page"]]["func"](cssRetFuncHash[param["page"]]["param"], param["ts"]);
                        delete cssRetFuncHash[param["page"]]
                    }
                }
                ;
                _self.retryCss = function(e, param) {
                    _self.createCSS({
                        "page": param.page,
                        "pageKey": param.pageKey,
                        "link": param.link,
                        "ver": param.ver,
                        "ts": param.ts
                    })
                }
                ;
                _self.load_art = function(doc, artjson, langx) {
                    if (langx == "")
                        langx = "zh-tw";
                    var json = artjson;
                    var bod = doc;
                    for (var key in json)
                        bod = bod.replace(new RegExp("\\*" + key + "\\*","gi"), json[key]);
                    doc = bod;
                    return doc
                }
                ;
                _self.loginFullLoading = function(param) {
                    _self.setLoadingVisible(param.isShow)
                }
                ;
                _self.setLoadingVisible = function(isShow) {
                    if (dom.getElementById("body_loading"))
                        dom.getElementById("body_loading").style.display = "none";
                    dom.getElementById("loading").style.display = isShow ? "" : "none"
                }
                ;
                _self.ios_blur = function(e) {
                    util.addEvent(dom.body, "touchstart", _self.touchstartEvent, {
                        passive: false
                    });
                    util.addEvent(dom.body, "touchmove", _self.doOnTouchMove);
                    if (top.moving)
                        return;
                    else if (e.target.tagName != "INPUT") {
                        var now_focus = dom.activeElement;
                        if (now_focus.tagName == "INPUT" && e.target.dataset.system != "ios12")
                            now_focus.blur()
                    }
                }
                ;
                _self.doOnTouchMove = function(e) {
                    var nowTouchY = e.touches[0].clientY;
                    top.moving = startTouchY < nowTouchY - fixY || startTouchY > nowTouchY + fixY
                }
                ;
                _self.touchstartEvent = function(event) {
                    startTouchY = event.touches[0].clientY;
                    top.moving = false;
                    if (event.touches.length > 1)
                        event.preventDefault()
                }
                ;
                _self.createSerTimer = function() {
                    if (timerHash["SerTimer"] != null)
                        return;
                    timerHash["SerTimer"] = new Timer(config_set.get("CONFIG_FIX"));
                    timerHash["SerTimer"].setParentclass(_self);
                    timerHash["SerTimer"].init();
                    timerHash["SerTimer"].dont_clear = true;
                    timerHash["SerTimer"].addEventListener("TimerEvent.TIMER", _self.SerrefreshPage);
                    timerHash["SerTimer"].startTimer();
                    myhash["timerHash"] = timerHash
                }
                ;
                _self.SerrefreshPage = function() {
                    var urlParams = "";
                    urlParams += "&langx=" + top.langx;
                    urlParams += "&login=N";
                    urlParams = "p=service_mainget&ver=" + top.ver + "&" + urlParams;
                    var getHTML = new win.HttpRequestRetry(win.HttpRequest,config_set.get("RETRY_TIME"),config_set.get("RETRY_LIMIT"),null);
                    getHTML.setParentclass(_self);
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", function(xml) {
                        var errorMsg = util.showConnectMsg(xml);
                        if (util.alertConnectMsg(errorMsg))
                            return;
                        _self.SerrefreshPageComplete(xml)
                    });
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.SerrefreshPageComplete = function(msg) {
                    var msgObj = new Object;
                    var xmlnode = util.parseXml(msg);
                    var code = xmlnode.Node(xmlnode.Root[0], "code").innerHTML;
                    var fix_sw = config_set.get("CONFIG_FIX_CHECK");
                    if (!fix_sw)
                        return;
                    if (code == "619") {
                        msgObj["maintain_sw"] = xmlnode.Node(xmlnode.Root[0], "maintain_sw").innerHTML;
                        msgObj["maintain_time"] = xmlnode.Node(xmlnode.Root[0], "maintain_time").innerHTML;
                        msgObj["clean_data_sw"] = xmlnode.Node(xmlnode.Root[0], "clean_data_sw").innerHTML;
                        msgObj["myGame_sw"] = xmlnode.Node(xmlnode.Root[0], "myGame_sw").innerHTML;
                        msgObj["urgent_sw"] = xmlnode.Node(xmlnode.Root[0], "urgent_sw").innerHTML;
                        msgObj["emergency_sw"] = xmlnode.Node(xmlnode.Root[0], "emergency_sw").innerHTML;
                        msgObj["clean_data_time"] = xmlnode.Node(xmlnode.Root[0], "clean_data_time").innerHTML;
                        msgObj["isException"] = xmlnode.Node(xmlnode.Root[0], "isException").innerHTML;
                        msgObj["code"] = xmlnode.Node(xmlnode.Root[0], "code").innerHTML;
                        msgObj["fix_sw"] = fix_sw;
                        msgObj["hometext"] = _self.getNowPage();
                        var CookieChk = CookieManager.get("CookieChk") ? CookieManager.get("CookieChk") : "";
                        if (CookieChk != "")
                            top.cookieEncode_sw = "Y";
                        else
                            top.cookieEncode_sw = "N";
                        if (msgObj["isException"] == "Y") {
                            dom.getElementById("maintain_show").className = "";
                            dom.getElementById("maintain_show").innerHTML = "";
                            if (SerFrame != null)
                                SerFrame = null;
                            if (loginFrame == null)
                                _self.chk_acc();
                            return
                        }
                        console.log(msgObj);
                        if (msgObj["maintain_sw"] == "Y" || msgObj["emergency_sw"] == "Y" || msgObj["clean_data_sw"] == "Y" || msgObj["urgent_sw"] == "Y") {
                            if (SerFrame == null)
                                if (msgObj["maintain_sw"] == "Y" || msgObj["emergency_sw"] == "Y" || msgObj["urgent_sw"] == "Y") {
                                    dom.getElementById("acc_show").style.display = "none";
                                    _self.goToPage("maintain_show", "service_main", function(_post) {
                                        SerFrame = new win.service_main(win,dom,_post);
                                        SerFrame.setParentclass(_self);
                                        SerFrame.init()
                                    }, msgObj)
                                } else {
                                    if (loginFrame == null)
                                        if (_CHDomain.uid == "" || _CHDomain.uid == null || _CHDomain.uid == undefined)
                                            _self.chk_acc()
                                }
                            else
                                SerFrame.Serchk(msgObj);
                            if (msgObj["maintain_sw"] == "Y")
                                maintain = true;
                            else if (msgObj["emergency_sw"] == "Y")
                                emergency = true
                        } else {
                            if (urgent || maintain || emergency) {
                                util.goToIndex();
                                return
                            }
                            if (loginFrame == null)
                                _self.chk_acc()
                        }
                    }
                }
                ;
                _self.clearSerTimer = function() {
                    if (timerHash != null)
                        if (timerHash["SerTimer"] != null) {
                            timerHash["SerTimer"].clearObj();
                            timerHash["SerTimer"].is_clear = true;
                            timerHash["SerTimer"] = null
                        }
                    return true
                }
                ;
                _self.chk_acc = function() {
                    top["login_4pwd_sw"] = login_4pwd_sw;
                    top["errorCount"] = errorCount;
                    top["errorTwice"] = errorTwice;
                    if (top["login_4pwd_sw"] == "Y" && CookieManager.get("PID") && top.aspenbet != "Y")
                        if (CookieManager.get("UID") && !CookieManager.get("previous_langx")) {
                            console.log("[login_index_chk_acc]");
                            action = "GETSW";
                            keycode = CookieManager.get("PID");
                            var urlParams = "";
                            urlParams += "p=checkPassCode";
                            if (top.param)
                                urlParams += "&" + top.param;
                            urlParams += "&keycode=" + keycode;
                            urlParams += "&action=" + action;
                            var getHTML = new HttpRequest;
                            getHTML.addEventListener("LoadComplete", function(xml) {
                                var errorMsg = util.showConnectMsg(xml);
                                if (util.alertConnectMsg(errorMsg))
                                    return;
                                var xmdObj = new Object;
                                xmlnode = util.parseXml(xml);
                                xmdObj["sw"] = xmlnode.Node(xmlnode.Root[0], "sw");
                                if (xmdObj["sw"].innerHTML == "N") {
                                    document.getElementById("acc_show").classList.add("pass_outside");
                                    _self.show_prepasscode()
                                } else {
                                    top["errorTwice"] = true;
                                    CookieManager.set("error1", "error1", 3650);
                                    _self.show_back_login()
                                }
                            });
                            getHTML.loadURL(top.m2_url, "POST", urlParams);
                            return
                        } else {
                            _self.showLogin();
                            CookieManager.del("previous_langx")
                        }
                    else
                        _self.showLogin()
                }
                ;
                _self.showLogin = function(errMsg) {
                    _self.setLoadingVisible(true);
                    dom.getElementById("home_show").style.display = "none";
                    dom.getElementById("acc_show").style.display = "none";
                    dom.getElementById("chgAcc_show").style.display = "none";
                    dom.getElementById("sysreq_show").style.display = "none";
                    _self.goToPage("alert_show", "alert_msg", function() {
                        try {
                            alertFrame = new win.alert_msg(win,dom);
                            alertFrame.setParentclass(_self);
                            alertFrame.init();
                            _self.chkDoubleLogin()
                        } catch (e) {
                            util.err("[alert_msg]", e)
                        }
                    }, {});
                    _self.goToPage("system_show", "system_msg", function() {
                        try {
                            systemFrame = new win.system_msg(win,dom);
                            systemFrame.setParentclass(_self);
                            systemFrame.init()
                        } catch (e) {
                            util.err("[system_msg]", e)
                        }
                    }, {});
                    _self.goToPage("acc_show", "login", function() {
                        loginFrame = new win.login(win,dom,null);
                        myhash["loginFrame"] = loginFrame;
                        loginFrame.setParentclass(_self);
                        loginFrame.init();
                        if (errMsg)
                            loginFrame.system_error(errMsg);
                        dom.getElementById("acc_show").style.display = "";
                        _self.chkDoubleLogin()
                    }, {});
                    _self.goToPage("icon_all", "icon_all", function() {}, {})
                }
                ;
                _self.login_help = function() {
                    _self.clearSerTimer();
                    _self.setLoadingVisible(true);
                    dom.getElementById("home_show").style.display = "none";
                    dom.getElementById("acc_show").style.display = "none";
                    dom.getElementById("chgAcc_show").style.display = "none";
                    _self.goToPage("chgAcc_show", "first_login_help", function() {
                        loginFrame = new win.first_login_help(win,dom,null);
                        myhash["loginFrame"] = loginFrame;
                        loginFrame.setParentclass(_self);
                        loginFrame.init();
                        dom.getElementById("chgAcc_show").style.display = ""
                    }, {})
                }
                ;
                _self.show_prepasscode = function() {
                    _self.setLoadingVisible(true);
                    dom.getElementById("chgAcc_show").style.display = "none";
                    dom.getElementById("home_show").style.display = "none";
                    dom.getElementById("acc_show").style.display = "none";
                    dom.getElementById("sysreq_show").style.display = "none";
                    _self.goToPage("alert_show", "alert_msg", function() {
                        try {
                            alertFrame = new win.alert_msg(win,dom);
                            alertFrame.setParentclass(_self);
                            alertFrame.init();
                            _self.chkDoubleLogin()
                        } catch (e) {
                            util.err("[alert_msg]", e)
                        }
                    }, {});
                    _self.goToPage("system_show", "system_msg", function() {
                        try {
                            systemFrame = new win.system_msg(win,dom);
                            systemFrame.setParentclass(_self);
                            systemFrame.init()
                        } catch (e) {
                            util.err("[system_msg]", e)
                        }
                    }, {});
                    _self.goToPage("acc_show", "prepasscode", function() {
                        loginFrame = new win.prepasscode(win,dom,null);
                        myhash["loginFrame"] = loginFrame;
                        loginFrame.setParentclass(_self);
                        loginFrame.init();
                        dom.getElementById("acc_show").style.display = "";
                        _self.chkDoubleLogin()
                    }, {});
                    _self.goToPage("icon_all", "icon_all", function() {}, {})
                }
                ;
                _self.show_forgotEvent = function() {
                    top.param = "ver=" + top.ver + "&langx=" + top.langx;
                    _self.setLoadingVisible(true);
                    dom.getElementById("home_show").style.display = "none";
                    dom.getElementById("acc_show").style.display = "none";
                    dom.getElementById("chgAcc_show").style.display = "none";
                    _self.goToPage("chgAcc_show", "forgot_pwd", function() {
                        loginFrame = new win.forgot_pwd(win,dom,null);
                        myhash["loginFrame"] = loginFrame;
                        loginFrame.setParentclass(_self);
                        loginFrame.init();
                        dom.getElementById("chgAcc_show").style.display = ""
                    }, {})
                }
                ;
                _self.show_back_login = function(param) {
                    var errMsg = "";
                    var acc_show = dom.getElementById("acc_show");
                    util.removeClass(acc_show, "pass_outside");
                    if (param)
                        errMsg = param.errMsg;
                    if (errMsg != "")
                        _self.showLogin(errMsg);
                    else
                        _self.showLogin()
                }
                ;
                _self.show_back_4pwd = function() {
                    dom.getElementById("sysreq_show").style.display = "none";
                    _self.show_prepasscode()
                }
                ;
                _self.chkDoubleLogin = function() {
                    doublecount++;
                    if (doublecount >= 2) {
                        if (CookieManager.get("doubleLogin")) {
                            var usedTime = _self.getDoubleLoginTs();
                            if (usedTime < 10)
                                _self.doubleLoginChk()
                        } else
                            _self.setLoadingVisible(false);
                        CookieManager.del("doubleLogin")
                    }
                }
                ;
                _self.getDoubleLoginTs = function() {
                    var tmpAry = CookieManager.get("doubleLogin").split("_");
                    var tmpTs = (new Date).getTime() - tmpAry[1];
                    var ret = tmpTs / 1E3;
                    return ret
                }
                ;
                _self.doubleLoginChk = function() {
                    _self.showAlertMsg({
                        "target": "alert_kick",
                        "msg": "",
                        "retFun": _self.afterDoubleLogin
                    });
                    _self.addbodylock()
                }
                ;
                _self.afterDoubleLogin = function() {
                    _self.setLoadingVisible(false);
                    _self.removebodylock()
                }
                ;
                _self.addbodylock = function() {
                    dom.getElementById("body_show").classList.add("scroll_lock");
                    dom.body.classList.add("scroll_lock")
                }
                ;
                _self.removebodylock = function(param) {
                    dom.getElementById("body_show").classList.remove("scroll_lock");
                    dom.body.removeAttribute("style");
                    dom.body.classList.remove("scroll_lock");
                    try {
                        if (param.type == "no")
                            if (param.px != null)
                                _self.setScrollTop({
                                    "value": param.px
                                })
                    } catch (e) {}
                }
                ;
                _self.setScrollTop = function(obj) {
                    dom.documentElement.scrollTop = obj.value;
                    dom.body.scrollTop = obj.value
                }
                ;
                _self.loginSuccess = function() {
                    if (top["userData"].msg == "104" && top["userData"].four_pwd == "new") {
                        firstcode = null;
                        firstchgid = false
                    } else if (top["userData"].msg == "104")
                        firstcode = null;
                    top["userData"].msg = "";
                    loginSuccess = true;
                    CookieManager.del("choice_lea_" + top["userData"].mid);
                    dom.getElementById("acc_show").style.display = "none";
                    dom.getElementById("chgAcc_show").style.display = "none";
                    _self.setLoadingVisible(true);
                    _self.chkFourPwdProc()
                }
                ;
                _self.chkFourPwdProc = function() {
                    dom.getElementById("acc_show").classList.remove("pass_outside");
                    if (top["userData"].four_pwd != "" && (_CHDomain.uid == "" || _CHDomain.uid == null || _CHDomain.uid == undefined))
                        if (!maintain && !emergency && !urgent) {
                            dom.getElementById("maintain_show").style.display = "none";
                            if (top["userData"].four_pwd == "new" && !firstchgid)
                                if (top["userData"].abox4pwd_notshow != "Y") {
                                    _self.scrollsetTop();
                                    _self.setLoadingVisible(false);
                                    top["RequestRetry"] = true;
                                    _self.showAlertMsg({
                                        "target": "C_alert_confirm",
                                        "msg": LS.get("4pwd_new"),
                                        "confirm": "Y",
                                        "retFun": _self.newalertMsg
                                    })
                                } else {
                                    _self.checkbox_noshow();
                                    _self.checkDomain()
                                }
                            else if (top["userData"].four_pwd == "second") {
                                _self.scrollsetTop();
                                _self.setLoadingVisible(false);
                                top["RequestRetry"] = true;
                                _self.showAlertMsg({
                                    "target": "C_alert_confirm",
                                    "msg": LS.get("4pwd_second"),
                                    "confirm": "Y",
                                    "retFun": _self.alertMsg
                                });
                                dom.getElementById("C_popup_checkbox").style.display = "none"
                            } else if (top["userData"].four_pwd == "errorTwice")
                                _self.checkDomain();
                            else {
                                dom.getElementById("maintain_show").style.display = "";
                                _self.checkDomain()
                            }
                        }
                }
                ;
                _self.newalertMsg = function(type) {
                    dom.getElementById("msg_popup").classList.remove("on");
                    _self.loginFullLoading({
                        "isShow": true
                    });
                    if (type == "yes") {
                        top["userData"].newalertMsg = "Y";
                        top["userData"].msg = "goToPasscode";
                        newFourPwd = "Y"
                    } else if (type == "no") {
                        CookieManager.del("PID");
                        CookieManager.del("UID")
                    }
                    if (dom.getElementById("C_confirm_chk").checked == true)
                        _self.checkbox_noshow();
                    else {
                        box4pwd_notshow = "N";
                        CookieManager.set("box4pwd_notshow_" + top["userData"].mid, top["userData"].mid + "_" + box4pwd_notshow)
                    }
                    _self.checkDomain();
                    top["RequestRetry"] = null
                }
                ;
                _self.alertMsg = function(type) {
                    dom.getElementById("msg_popup").classList.remove("on");
                    _self.loginFullLoading({
                        "isShow": true
                    });
                    if (type == "yes") {
                        top["userData"].secondSet4pwd = "Y";
                        top["userData"].msg = "setPasscode";
                        newFourPwd = "Y";
                        _self.setPassCode(_self.checkDomain)
                    } else if (type == "no") {
                        CookieManager.del("PID");
                        CookieManager.del("UID")
                    }
                    box4pwd_notshow = "N";
                    CookieManager.set("box4pwd_notshow_" + top["userData"].mid, top["userData"].mid + "_" + box4pwd_notshow);
                    _self.checkDomain();
                    top["RequestRetry"] = null
                }
                ;
                _self.checkbox_noshow = function() {
                    box4pwd_notshow = "Y";
                    CookieManager.set("box4pwd_notshow_" + top["userData"].mid, top["userData"].mid + "_" + box4pwd_notshow)
                }
                ;
                _self.checkDomain = function() {
                    var urlParams = "";
                    urlParams += "username=" + top["userData"].username;
                    urlParams += "&uid=" + top["userData"].uid;
                    urlParams += "&langx=" + top.langx;
                    urlParams += "&code=663";
                    urlParams = "p=check_login_domain&ver=" + top.ver + "&" + urlParams;
                    var getHTML = new win.HttpRequestRetry(win.HttpRequest,config_set.get("RETRY_TIME"),config_set.get("RETRY_LIMIT"),null);
                    getHTML.setParentclass(_self);
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", function(xml) {
                        var errorMsg = util.showConnectMsg(xml);
                        if (util.alertConnectMsg(errorMsg))
                            return;
                        xmlnode = util.parseXml(xml);
                        var code = xmlnode.Node(xmlnode.Root[0], "code").innerHTML;
                        if (code == "664") {
                            var _url = "";
                            var new_domain = xmlnode.Node(xmlnode.Root[0], "new_domain").innerHTML;
                            var now_mode = xmlnode.Node(xmlnode.Root[0], "now_mode").innerHTML;
                            top["userData"].langx = top.langx;
                            top["userData"].iovationCnt = top.iovationCount;
                            if (now_mode == "Y")
                                if (new_domain != "") {
                                    top["Requesttime"] = "Y";
                                    var _url = util.getProtocal() + "//" + new_domain;
                                    util.topGoToUrl(_url, top["userData"]);
                                    return
                                } else
                                    _self.goToHomePage();
                            else
                                _self.goToHomePage()
                        }
                    });
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.setPassCode = function(retFun) {
                    var tmp_date = (new Date).toJSON().slice(0, 10);
                    action = "SET";
                    var urlParams = "";
                    urlParams += "p=checkPassCode";
                    if (top.param)
                        urlParams += "&" + top.param;
                    urlParams += "&inputCode=" + top["userData"].passwd_safe + "|" + top["memSet"].passcode + "|" + top["userData"].mid + "|N|" + tmp_date;
                    urlParams += "&action=" + action;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", function(xml) {
                        _self.encodePassCodeFinish(xml);
                        retFun()
                    });
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.encodePassCodeFinish = function(xml) {
                    var errorMsg = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    var xmdObj = new Object;
                    xmlnode = util.parseXml(xml);
                    xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
                    if (xmdObj["code"].innerHTML == "484" && top.aspenbet != "Y") {
                        var getPID = xmlnode.Node(xmlnode.Root[0], "data").innerHTML;
                        CookieManager.set("PID", encodeURIComponent(getPID), 3650);
                        CookieManager.set("UID", top["userData"].passwd_safe, 3650);
                        top["userData"]["secondSet4pwd"] = "Y"
                    }
                }
                ;
                _self.goToHomePage = function() {
                    var _url = util.getWebUrl();
                    util.topGoToUrl(_url, top["userData"])
                }
                ;
                _self.createNetTimer = function() {
                    if (timerHash["NetCheckTimer"] != null)
                        return;
                    timerHash["NetCheckTimer"] = new Timer(config_set.get("CONFIG_NETWORK_CHECK"));
                    timerHash["NetCheckTimer"].setParentclass(_self);
                    timerHash["NetCheckTimer"].init();
                    timerHash["NetCheckTimer"].dont_clear = true;
                    timerHash["NetCheckTimer"].addEventListener("TimerEvent.TIMER", _self.networkCheck);
                    timerHash["NetCheckTimer"].startTimer();
                    myhash["timerHash"] = timerHash
                }
                ;
                _self.stopNetTimer = function() {
                    timerHash["NetCheckTimer"].stopTimer()
                }
                ;
                _self.popstate = function(e) {
                    _self.pushHistory(null, "", "")
                }
                ;
                _self.pushHistory = function(state, title, page) {
                    try {
                        win.history.pushState(top["userData"], title, util.getWebUrl());
                        if (page != "") {
                            backcount = 0;
                            win._history.push({
                                "state": util.clone(state),
                                "page": page
                            })
                        }
                    } catch (e) {
                        util.err("[pushHistory]", e)
                    }
                }
                ;
                _self.orientation = function() {
                    _self.mobileBlur()
                }
                ;
                _self.scrollsetTop = function() {
                    _self.mobileBlur()
                }
                ;
                _self.mobileBlur = function() {
                    if (top.mobile == "Y") {
                        var tmpOrientation = win.Math.abs(win.orientation);
                        var tmpAgent = window.navigator.userAgent;
                        if (tmpAgent.indexOf("iPad") != -1)
                            if (tmpOrientation == 90)
                                _self.removebodylock();
                        var mainObj = dom.getElementById("main");
                        var oldmainObj = mainObj.className;
                        var lls = top.ls;
                        if (lls == "us")
                            lls = "en";
                        if (!ios) {
                            dom.activeElement.blur();
                            var orientationTurn = win.Math.abs(win.orientation);
                            if (dom.activeElement.tagName != "INPUT" && orientationTurn == 90)
                                if (!first90height)
                                    setTimeout(_self.first90, 500);
                            mainObj.className = "main_height" + " " + lls.toUpperCase() + " mobile"
                        } else
                            mainObj.className = "main_height" + " " + lls.toUpperCase() + " main_ios mobile";
                        setTimeout(_self.classchang, 500, mainObj, oldmainObj)
                    }
                }
                ;
                _self.orientationBlur = function(e) {}
                ;
                _self.getNowPage = function() {
                    var tmpPage = "";
                    if (win._history.length != 0)
                        tmpPage = win._history[win._history.length - 1].page;
                    return tmpPage
                }
                ;
                _self.showAlertMsg = function(param) {
                    alertFrame.showMsg(param)
                }
                ;
                _self.hideAlertMsg = function(param) {
                    alertFrame.clearMsg(param)
                }
                ;
                _self.networkCheck = function() {
                    if (top["requestFailedCount"] >= config_set.get("RETRY_LIMIT")) {
                        _self.retryLastfail();
                        _self.stopNetTimer();
                        return
                    }
                    if (util.countSize(top["requestFailedHash"]) != 0) {
                        _self.stopNetTimer();
                        _self.showSystemMsg({
                            "target": "C_alert_ok_system",
                            "msg": LS.get("connect_retry"),
                            "retFun": _self.startNetTimer
                        })
                    } else
                        top["requestFailedCount"] = 0
                }
                ;
                _self.retryLoop = function(params) {
                    if (dom.getElementById("C_ok_btn_system"))
                        dom.getElementById("C_ok_btn_system").innerHTML = LS.get("connect_again");
                    util.removeClass(dom.getElementById("alert_confirm"), "on");
                    util.removeClass(dom.getElementById("C_alert_confirm"), "on");
                    retryMethod.push(params.method);
                    retryParams.push(params.params);
                    retryFun.push(params.fun);
                    retryParentclass.push(params.Parentclass);
                    retryFrame.push(params.frame);
                    if (top["Requesttime"] == null) {
                        _self.showSystemMsg({
                            "target": "C_alert_ok_system",
                            "msg": LS.get("connect_retry"),
                            "retFun": _self.reQuest
                        });
                        top["Requesttime"] = "Y"
                    }
                }
                ;
                _self.retryLastfail = function() {
                    if (dom.getElementById("C_ok_btn_system"))
                        dom.getElementById("C_ok_btn_system").innerHTML = LS.get("connect_ok");
                    _self.showSystemMsg({
                        "target": "C_alert_ok_system",
                        "msg": LS.get("connect_fail"),
                        "retFun": util.goToIndex
                    })
                }
                ;
                _self.retryComplete = function() {
                    retryMethod = new Array;
                    retryParams = new Array;
                    retryFun = new Array;
                    retryParentclass = new Array;
                    retryFrame = new Array
                }
                ;
                _self.showSystemMsg = function(param) {
                    systemFrame.showMsg(param)
                }
                ;
                _self.systemreq = function(data) {
                    top.param = "ver=" + top.ver + "&langx=" + top.langx;
                    _self.setLoadingVisible(true);
                    dom.getElementById("home_show").style.display = "none";
                    dom.getElementById("acc_show").style.display = "none";
                    dom.getElementById("sysreq_show").style.display = "none";
                    _self.goToPage("sysreq_show", data.act, function() {
                        if (data.act == "ip_guide")
                            loginFrame = new win.ip_guide(win,dom,null);
                        else
                            loginFrame = new win.system_req(win,dom,null);
                        myhash["loginFrame"] = loginFrame;
                        loginFrame.setParentclass(_self);
                        loginFrame.init();
                        dom.getElementById("sysreq_show").style.display = ""
                    }, {})
                }
                ;
                _self.browser_rule = function() {
                    _self.setLoadingVisible(true);
                    dom.getElementById("home_show").style.display = "none";
                    dom.getElementById("acc_show").style.display = "none";
                    _self.goToPage("acc_show", "browser_rule", function() {
                        loginFrame = new win.browser_rule(win,dom,null);
                        myhash["loginFrame"] = loginFrame;
                        loginFrame.setParentclass(_self);
                        loginFrame.init();
                        dom.getElementById("acc_show").style.display = ""
                    }, {})
                }
                ;
                _self.showchg_id = function() {
                    _self.setLoadingVisible(true);
                    firstchgid = true;
                    dom.getElementById("home_show").style.display = "none";
                    dom.getElementById("acc_show").style.display = "none";
                    dom.getElementById("chgAcc_show").style.display = "none";
                    firstcode = false;
                    _self.goToPage("chgAcc_show", "chg_id", function() {
                        loginFrame = new win.chg_id(win,dom,null);
                        myhash["loginFrame"] = loginFrame;
                        loginFrame.setParentclass(_self);
                        loginFrame.init();
                        dom.getElementById("chgAcc_show").style.display = ""
                    }, {})
                }
                ;
                _self.showchg_pwd = function(param) {
                    firstchgid = false;
                    firstcode = null;
                    _self.clearSerTimer();
                    _self.setLoadingVisible(true);
                    dom.getElementById("home_show").style.display = "none";
                    dom.getElementById("acc_show").style.display = "none";
                    dom.getElementById("chgAcc_show").style.display = "none";
                    _self.goToPage("chgAcc_show", "chg_pwd", function() {
                        loginFrame = new win.chg_pwd(win,dom,param);
                        myhash["loginFrame"] = loginFrame;
                        loginFrame.setParentclass(_self);
                        loginFrame.init()
                    }, {})
                }
                ;
                _self.checkIsGame = function(_url) {
                    var ary = new Array("home","game_list","game_more","league_index","league_filter");
                    var isGame = false;
                    for (var j = 0; j < ary.length; j++)
                        if (_url.indexOf(ary[j]) != -1) {
                            isGame = true;
                            break
                        }
                    return isGame
                }
                ;
                _self.onMessage = function(event) {
                    var code = event.data;
                    switch (code) {
                    case "CUIPV6_OK":
                        var cuipv6Ifr = dom.getElementById("cuipv6_ifr");
                        CookieManager.set("cuipv6", "Y");
                        top["userData"].cuipv6 = "Y";
                        clearTimeout(cuipv6Timer);
                        cuipv6Ifr.parentNode.removeChild(cuipv6Ifr);
                        break;
                    case "CU_OK":
                        var cuIfr = dom.getElementById("cu_ifr");
                        CookieManager.set("cu", "Y");
                        top["userData"].cu = "Y";
                        clearTimeout(cuTimer);
                        cuIfr.parentNode.removeChild(cuIfr);
                        break;
                    case "IPV6_OK":
                        var ipv6Ifr = dom.getElementById("ipv6_ifr");
                        CookieManager.set("ipv6", "Y");
                        top["userData"].ipv6 = "Y";
                        clearTimeout(ipv6Timer);
                        ipv6Ifr.parentNode.removeChild(ipv6Ifr);
                        break;
                    default:
                        break
                    }
                }
                ;
                _self.onError = function(e) {
                    console.error(e)
                }
                ;
                _self.getIovationBlackBox = function() {
                    if (iovationURL != "" && top.blackbox == "") {
                        CookieManager.set("loadBB", "Y");
                        top.iovationCount += 1;
                        var p = document.location.protocol;
                        p = p.replace(":", "");
                        iovation_Proxy = iovation_Proxy.replace("https", "");
                        iovation_Proxy = iovation_Proxy.replace("http", "");
                        iovationURL = p + iovation_Proxy + "/iovation/vindex.html?webProtocal=" + p + "&webDomain=" + document.domain;
                        var iovationFrame = document.createElement("iframe");
                        iovationFrame.id = "SI2_func";
                        iovationFrame.style.display = "none";
                        iovationFrame.src = iovationURL;
                        document.body.appendChild(iovationFrame);
                        setTimeout(_self.iovationAbort, 1E4, iovationFrame)
                    }
                }
                ;
                _self.iovationAbort = function(iovationFrame) {
                    iovationFrame.parentNode.removeChild(iovationFrame)
                }
                ;
                _self.getRandom = function(x) {
                    return Math.floor(Math.random() * 1E7)
                }
            }
            ;