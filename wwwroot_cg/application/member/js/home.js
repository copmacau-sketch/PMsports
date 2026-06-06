function home(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var classname = "home";
                var postHash = _post;
                var parentClass;
                var eventHandler = new Object;
                var config_set;
                var timerHash;
                var LS;
                var pos = 0;
                var nowAD = 1;
                var totalAD = 0;
                var presentAD = 0;
                var firstTouch = false;
                var firstin = false;
                var touchStartPos = 0;
                var touch = null;
                var touchPoint = 5;
                var adtimer;
                var aryAD = new Array;
                var cleanTime = false;
                var _mc = new Object;
                var util = new win.Util(win,dom);
                var AD = new win.AD(win,dom);
                var swiper = null;
                var page_sw = false;
                var isAndroidPC = false;
                _self.classname = "home";
                var myhash = {};
                var filterHash = new Object;
                _self.paramHash = new Object;
                _self.init = function() {
                    _mc["homeShow"] = dom.getElementById("homeShow");
                    _mc["homePageShow"] = dom.getElementById("homePageShow");
                    _mc["ViewOnly"] = document.getElementById("ViewOnly");
                    if (top["userData"].enable == "S")
                        _mc["ViewOnly"].style.display = "";
                    else if (top.homePage_sw == "Y") {
                        _mc["homePageShow"].style.display = "";
                        util.addClass(dom.getElementById("body_content"), "wrap_sport_bg")
                    } else
                        _mc["homeShow"].style.display = "";
                    _self.addEventListener("chgPage", _self.chgPage);
                    _mc["game_live"] = dom.getElementById("game_live");
                    _mc["game_today"] = dom.getElementById("game_today");
                    _mc["game_early"] = dom.getElementById("game_early");
                    _mc["div_cleandata"] = document.getElementById("div_cleandata");
                    _mc["home_game_live"] = dom.getElementById("home_game_live");
                    _mc["home_game_today"] = dom.getElementById("home_game_today");
                    _mc["home_game_early"] = dom.getElementById("home_game_early");
                    _mc["home_touch_div_320"] = dom.getElementById("home_touch_div_320");
                    _mc["home_touch_div_640"] = dom.getElementById("home_touch_div_640");
                    _mc["home_touch_div_320_ios"] = dom.getElementById("home_touch_div_320_ios");
                    _mc["home_touch_div_640_ios"] = dom.getElementById("home_touch_div_640_ios");
                    _mc["view_history"] = dom.getElementById("view_history");
                    _mc["view_todaywagers"] = dom.getElementById("view_todaywagers");
                    _mc["info_4pwd_640"] = dom.getElementById("info_4pwd_640");
                    _mc["set_4pwd_640"] = dom.getElementById("set_4pwd_640");
                    _mc["info_4pwd_320"] = dom.getElementById("info_4pwd_320");
                    _mc["set_4pwd_320"] = dom.getElementById("set_4pwd_320");
                    _mc["live_nodata"] = dom.getElementById("live_nodata");
                    _mc["today_nodata"] = dom.getElementById("today_nodata");
                    _mc["early_nodata"] = dom.getElementById("early_nodata");
                    _mc["old_game_live"] = dom.getElementById("old_game_live");
                    _mc["home_sport"] = dom.getElementById("home_sport");
                    _mc["old_home_game_live"] = dom.getElementById("old_home_game_live");
                    _mc["home_app"] = dom.getElementById("home_app");
                    _mc["es_sp_banner"] = dom.getElementById("es_sp_banner");
                    _mc["es_sp_tab"] = dom.getElementById("es_sp_tab");
                    util.addEvent(_mc["view_history"], "click", _self.chgPage, {
                        "page": "history_data"
                    });
                    util.addEvent(_mc["view_todaywagers"], "click", _self.chgPage, {
                        "page": "today_wagers"
                    });
                    page_sw = config_set.get("PAGE_SW");
                    var ios = _self.isIOS();
                    var _body = dom.getElementById("body_show");
                    if (page_sw)
                        util.addClass(_body, "league_page");
                    for (i = 0; i < config_set.get("GTYPEARY").length; i++) {
                        gtype = config_set.get("GTYPEARY")[i].toLowerCase();
                        for (var w = 0; w < config_set.get("SHOWTYPEARY").length; w++) {
                            var type = config_set.get("SHOWTYPEARY")[w];
                            var rtype = config_set.get("RTYPEARY")[w];
                            var _name = gtype + "_" + type + "_league";
                            _mc[_name] = dom.getElementById(_name);
                            _mc["h_" + _name] = dom.getElementById("h_" + _name);
                            var _par = new Object;
                            _par.extends = "";
                            if (page_sw)
                                _par.page = "league_index";
                            else {
                                var needLeague = !ios && top.mobile == "Y" && gtype == "ft" && type == "today" || type == "early";
                                if (type == "live" || !needLeague) {
                                    _par.page = "game_list_" + gtype.toUpperCase();
                                    _par.extends = "game_list"
                                } else
                                    _par.page = "league_index"
                            }
                            _par.gtype = gtype;
                            _par.showtype = type;
                            _par.rtype = rtype;
                            util.addEvent(_mc[_name], "click", _self.intoGame, _par);
                            util.addEvent(_mc["h_" + _name], "click", _self.intoGame, _par);
                            if (type == "live") {
                                _mc["old_" + _name] = dom.getElementById("old_" + _name);
                                util.addEvent(_mc["old_" + _name], "click", _self.intoGame, _par)
                            }
                        }
                    }
                    util.setParentclass(parentClass);
                    if (top.isapp == "N" && !ios && top.mobile != "N")
                        isAndroidPC = true;
                    else
                        isAndroidPC = false;
                    _mc["home_app"].style.display = isAndroidPC ? "" : "none";
                    if (isAndroidPC)
                        util.addEvent(_mc["home_app"], "click", _self.chgdownloadPage);
                    _mc["home_touch_div_320"].style.display = isAndroidPC ? "" : "none";
                    _mc["home_touch_div_640"].style.display = isAndroidPC ? "" : "none";
                    _mc["home_touch_div_320_ios"].style.display = isAndroidPC ? "none" : "";
                    _mc["home_touch_div_640_ios"].style.display = isAndroidPC ? "none" : "";
                    AD.setParentclass(parentClass);
                    AD.setTimeout(isAndroidPC);
                    if (top["homefirst"]) {
                        dom.getElementById("home_touch_div_320").classList.remove("sideshow_hide");
                        dom.getElementById("home_touch_div_640").classList.remove("sideshow_hide");
                        dom.getElementById("home_touch_div_320_ios").classList.remove("sideshow_hide");
                        dom.getElementById("home_touch_div_640_ios").classList.remove("sideshow_hide")
                    }
                    parentClass.dispatchEvent("membercashchk", {});
                    _self.firstMemData();
                    _self.addEventListener("addSPESEvent", _self.addSPESEvent);
                    _self.addEventListener("removeSPESEvent", _self.removeSPESEvent);
                    win.addEventListener("resize", _self.checkScroll)
                }
                ;
                _self.chgdownloadPage = function(e) {
                    var urlParams = "";
                    urlParams += "uid=" + top["userData"].uid;
                    urlParams += "&langx=" + top.langx;
                    urlParams = "p=guide_HGApp&ver=" + top.ver + "&" + urlParams;
                    window.open(top.m2_url + "?" + urlParams)
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    LS = parentClass.getThis("LS");
                    config_set = parentClass.getThis("config_set");
                    timerHash = parentClass.getThis("timerHash")
                }
                ;
                _self.getThis = function(varible) {
                    if (!myhash[varible]) {
                        var msg = "no myhash[" + varible + "]";
                        util.writeLog(classname, msg)
                    }
                    return myhash[varible]
                }
                ;
                _self.chgPage = function(e, param) {
                    param.retFun = _self.changePageComplete;
                    parentClass.dispatchEvent("bodyGoToPage", param)
                }
                ;
                _self.clickfun = function(param) {
                    if (param == "info_4pwd_320" || param == "AD_innart04_320" || param == "AD_innart04_640" || param == "info_4pwd_640")
                        _self.chgPage("click", {
                            "page": "features"
                        });
                    else if (param == "set_4pwd_320" || param == "set_4pwd_640")
                        _self.chgPage("click", {
                            "page": "passcode"
                        });
                    else if (param == "dl_google_320" || param == "dl_google_640")
                        _self.chgPage("click", {
                            "page": "help_download"
                        })
                }
                ;
                _self.addEventListener = function(eventname, eventFunction) {
                    eventHandler[eventname] = eventFunction
                }
                ;
                _self.removeAD = function(_id) {
                    var ad_len = _mc["animate_div"].children.length;
                    var adObj = document.getElementById("ADslide0" + ad_len + "BTN");
                    var adObj1 = document.getElementById("AD_innart" + _id);
                    adObj.parentNode.removeChild(adObj);
                    adObj1.parentNode.removeChild(adObj1);
                    aryAD.splice(aryAD.indexOf(_id), 1);
                    if (_id == "01") {
                        var oldLast = document.getElementById("AD_innart" + aryAD[aryAD.length - 1]);
                        aryAD.splice(aryAD.length - 1, 1);
                        oldLast.parentNode.removeChild(oldLast);
                        var newLast = document.getElementById("animate_div").firstChild.nextElementSibling.cloneNode(true);
                        newLast.id = "AD_innart0" + (aryAD[aryAD.length - 1] * 1 + 1);
                        aryAD.push("0" + (aryAD[aryAD.length - 1] * 1 + 1));
                        document.getElementById("animate_div").appendChild(newLast)
                    }
                }
                ;
                _self.touchstart = function(e) {
                    var start_touch = e.touches[0];
                    touchStartPos = Number(start_touch.pageX);
                    firstTouch = true
                }
                ;
                _self.touchmove = function(e) {
                    var diff = touchStartPos * 1 - e.touches[0].pageX * 1;
                    if (isUCBrowser() && Math.abs(diff) >= 10)
                        e.preventDefault();
                    touch = e.touches[0];
                    if (timerHash["ADTimer"] != null)
                        _self.clearADTimer()
                }
                ;
                _self.touchend = function(e) {
                    if (!touch)
                        return;
                    _mc["animate_div"].className = "inner ADs" + nowAD + " innerAnimation";
                    var x = Number(touch.pageX);
                    var y = Number(touch.pageY);
                    var diffPos = touchStartPos - x;
                    var ad_Count = aryAD.length - 1;
                    var loop_btn = false;
                    if (firstTouch) {
                        if (diffPos <= touchPoint * -1)
                            if (nowAD == 1 && loop_btn == true)
                                nowAD = ad_Count + 1;
                            else
                                nowAD--;
                        else if (diffPos >= touchPoint) {
                            if (nowAD == ad_Count + 1 && loop_btn == true) {
                                nowAD = 1;
                                _mc["animate_div"].className = "inner ADs" + nowAD
                            }
                            nowAD++
                        }
                        if (loop_btn == false) {
                            if (nowAD >= ad_Count)
                                nowAD = ad_Count;
                            if (nowAD < 1)
                                nowAD = 1
                        }
                        if (nowAD == ad_Count + 1)
                            if (diffPos >= touchPoint && loop_btn == true) {
                                _mc["animate_div"].className = "inner ADs" + nowAD + " innerAnimation";
                                setTimeout(function() {
                                    nowAD = 1;
                                    _mc["animate_div"].className = "inner ADs1";
                                    _self.clearADTimer();
                                    _self.createADTimer()
                                }, 500)
                            } else {
                                if (diffPos <= touchPoint * -1) {
                                    _mc["animate_div"].className = "inner ADs" + nowAD;
                                    setTimeout(function() {
                                        nowAD = ad_Count;
                                        _mc["animate_div"].className = "inner ADs" + ad_Count + " innerAnimation";
                                        _self.clearADTimer();
                                        _self.createADTimer()
                                    }, 100)
                                }
                            }
                        else {
                            _mc["animate_div"].className = "inner ADs" + nowAD + " innerAnimation";
                            _self.createADTimer()
                        }
                    }
                    firstTouch = false;
                    touch = null
                }
                ;
                _self.createLeaTimer = function() {
                    if (timerHash["leaTimer"] != null)
                        return;
                    timerHash["leaTimer"] = new Timer(config_set.get("CONFIG_LEAGUE_COUNT"));
                    timerHash["leaTimer"].setParentclass(_self);
                    timerHash["leaTimer"].init();
                    timerHash["leaTimer"].addEventListener("TimerEvent.TIMER", _self.leaTimerRun);
                    timerHash["leaTimer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.leaTimerFinish);
                    timerHash["leaTimer"].startTimer()
                }
                ;
                _self.createCdTimer = function() {
                    if (timerHash["cdTimer"] != null)
                        return;
                    timerHash["cdTimer"] = new Timer(config_set.get("CONFIG_FIX"));
                    timerHash["cdTimer"].addEventListener("TimerEvent.TIMER", _self.cdTimerRun);
                    timerHash["cdTimer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.cdTimerFinish);
                    timerHash["cdTimer"].startTimer()
                }
                ;
                _self.clearTimer = function() {
                    _self.clearLeaTimer();
                    return true
                }
                ;
                _self.clearLeaTimer = function() {
                    if (timerHash != null)
                        if (timerHash["leaTimer"] != null) {
                            timerHash["leaTimer"].clearObj();
                            timerHash["leaTimer"].is_clear = true;
                            timerHash["leaTimer"] = null
                        }
                    return true
                }
                ;
                _self.leaTimerRun = function(count) {
                    _self.reloadLeagueCount()
                }
                ;
                _self.leaTimerFinish = function(count) {}
                ;
                _self.showCleanData = function(isShow) {
                    var ret = !isShow ? "" : "none";
                    _mc["game_live"].style.display = ret;
                    _mc["game_today"].style.display = ret;
                    _mc["game_early"].style.display = ret;
                    _mc["div_cleandata"].style.display = isShow ? "" : "none"
                }
                ;
                _self.showViewOnly = function(isShow) {
                    var ret = !isShow && !cleanTime ? "" : "none";
                    var homePageAry = new Array("homeShow","homePageShow");
                    if (top["userData"].enable == "S")
                        for (var i = 0; i < homePageAry.length; i++)
                            _mc[homePageAry[i]].style.display = ret;
                    else {
                        var homeObj = top.homePage_sw == "Y" ? _mc["homePageShow"] : _mc["homeShow"];
                        homeObj.style.display = ""
                    }
                    _mc["ViewOnly"].style.display = isShow ? "" : "none"
                }
                ;
                _self.intoGame = function(mouseEvent, targetObj) {
                    _self.clearLeaTimer();
                    nowTS = util.getTimestamp();
                    targetObj.nowTS = nowTS;
                    top["lastClickTS"] = nowTS;
                    top.choice_gtype = targetObj.gtype;
                    top.choice_showtype = targetObj.showtype;
                    top.choice_rtype = targetObj.rtype;
                    var nowFilter = "";
                    if (targetObj.showtype == "today") {
                        var _gtype = targetObj.gtype.toUpperCase();
                        if (_gtype == "FT" || _gtype == "ES") {
                            nowFilter = "FT";
                            top.choice_filter = "FT"
                        } else {
                            nowFilter = "MIX";
                            top.choice_filter = "MIX"
                        }
                        parentClass.dispatchEvent("updateNowFilter", nowFilter)
                    }
                    var postHash = new Object;
                    var param = new Object;
                    postHash["gtype"] = top.choice_gtype;
                    postHash["showtype"] = top.choice_showtype;
                    postHash["rtype"] = top.choice_rtype;
                    postHash["nowTS"] = targetObj.nowTS;
                    postHash["kind"] = "game";
                    var isSP = "";
                    if (targetObj.specialClick != "" && targetObj.specialClick != undefined) {
                        postHash["specialClick"] = targetObj.specialClick;
                        postHash["specialTitle"] = targetObj.specialTitle;
                        param["mode"] = targetObj.mode;
                        param["specialClick"] = targetObj.specialClick;
                        param["specialTitle"] = targetObj.specialTitle;
                        isSP = "special";
                        top.specialClick = "special"
                    }
                    param["page"] = targetObj.page;
                    param["post"] = "gtype=" + top.choice_gtype + "&showtype=" + top.choice_showtype + "&rtype=" + top.choice_rtype;
                    param["postHash"] = postHash;
                    param["nowTS"] = targetObj.nowTS;
                    if (targetObj.extends != "")
                        param["extendsClass"] = targetObj.extends;
                    parentClass.dispatchEvent("chgHeadCss", {
                        "showtype": top.choice_showtype,
                        "type": isSP
                    });
                    parentClass.dispatchEvent("bodyGoToPage", param)
                }
                ;
                _self.firstMemData = function() {
                    _self.reloadLeagueCount();
                    if (presentAD > 1)
                        _self.createADTimer()
                }
                ;
                _self.reloadLeagueCount = function() {
                    top["pageTS"][classname] = util.getTimestamp();
                    var urlParams = "";
                    urlParams += "sorttype=league";
                    urlParams += "&date=ALL";
                    urlParams += "&ltype=" + top["userData"].ltype;
                    urlParams += "&mode=home";
                    urlParams += "&ts=" + top["pageTS"][classname];
                    urlParams = "p=get_league_count&" + top.param + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.reloadLeagueCountComplete);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.reloadLeagueCountComplete = function(xml) {
                    _self.paramHash["errorMsg"] = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(_self.paramHash["errorMsg"]))
                        return;
                    var tmpTS = xmlnode.Node(xmlnode.Root[0], "ts").innerHTML;
                    if (!util.checkTS(top["pageTS"][classname], tmpTS, "get_league_count"))
                        return;
                    var chgMode = false;
                    var xmdObj = new Object;
                    var countHash = new Object;
                    countHash["All"] = 0;
                    countHash["live"] = 0;
                    xmlnode = util.parseXml(xml);
                    xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
                    xmdObj["homePage_sw"] = xmlnode.Node(xmlnode.Root[0], "homePage_sw");
                    if (xmdObj["homePage_sw"].innerHTML != top.homePage_sw) {
                        parentClass.dispatchEvent("showLoading", {
                            "isShow": true
                        });
                        chgMode = true;
                        top.homePage_sw = xmdObj["homePage_sw"].innerHTML;
                        if (top["userData"].enable == "S")
                            _mc["ViewOnly"].style.display = "";
                        else if (xmdObj["homePage_sw"].innerHTML == "Y") {
                            if(_mc["homePageShow"]) _mc["homePageShow"].style.display = "";
                            if(_mc["homeShow"]) _mc["homeShow"].style.display = "none"
                        } else {
                            if(_mc["homePageShow"]) _mc["homePageShow"].style.display = "none";
                            if(_mc["homeShow"]) _mc["homeShow"].style.display = ""
                        }
                    }
                    xmdObj["game"] = xmlnode.Node(xmlnode.Root[0], "game");
                    var filterTab = new Array("FT","RB","MIX","Next1","Next6");
                    if (xmdObj["code"].innerHTML == "601") {
                        for (var i = 0; i < xmdObj["game"].length; i++) {
                            gtype = xmlnode.Node(xmdObj["game"][i], "gtype").innerHTML;
                            _gtype = gtype.toLowerCase();
                            if (util.in_array(gtype, config_set.get("GTYPEARY")))
                                for (var z = 0; z < config_set.get("SHOWTYPEARY").length; z++) {
                                    var type = config_set.get("SHOWTYPEARY")[z];
                                    var _type = util.switchShowType(type, true);
                                    var count = util.showTxt(xmlnode.Node(xmdObj["game"][i], _type + "_count").innerHTML) * 1;
                                    var fs_count = 0;
                                    if (_type != "RB") {
                                        fs_count = util.showTxt(xmlnode.Node(xmdObj["game"][i], "FS_" + _type + "_count").innerHTML) * 1;
                                        if (isNaN(fs_count))
                                            fs_count = 0
                                    }
                                    if (type.match(/today/) && top.specialClick == "")
                                        for (var f = 0; f < filterTab.length; f++)
                                            if (xmlnode.Node(xmdObj["game"][i], filterTab[f]) && xmlnode.Node(xmdObj["game"][i], filterTab[f] + "_count").innerHTML * 1 > 0) {
                                                if (filterHash[gtype] == null)
                                                    filterHash[gtype] = new Object;
                                                filterHash[gtype][filterTab[f]] = xmlnode.Node(xmdObj["game"][i], filterTab[f] + "_count").innerHTML * 1
                                            }
                                    var type_count = count + fs_count;
                                    if (gtype == top["bannerGtype"])
                                        if (type == "today") {
                                            parentClass.dispatchEvent("chkBannerCount", type_count);
                                            AD.bannerGameCount(type_count)
                                        }
                                    if (gtype == "ES" && type_count > 0)
                                        if (top.specialGame.gtype == "ES" && top.specialGame.Total_Count > 0 && top.specialGame.mode == "NORMAL")
                                            _self.addSPESEvent();
                                        else
                                            _self.removeSPESEvent();
                                    var countStr = type_count > 999 ? "999+" : type_count;
                                    if (xmdObj["homePage_sw"].innerHTML == "Y") {
                                        if (type_count > 0) {
                                            _mc["home_sport"].style.display = "";
                                            if (type == "live") {
                                                countHash["live"] += type_count;
                                                _mc["old_home_game_live"].style.display = "";
                                                _mc["old_game_live"].style.display = "";
                                                _self.setData("old_" + _gtype + "_" + type, type_count);
                                                var liveCount = countStr == "999+" ? "999" : countStr;
                                                if (dom.getElementById("old_" + _gtype + "_live_count"))
                                                    dom.getElementById("old_" + _gtype + "_live_count").innerHTML = util.showTxt(liveCount)
                                            }
                                        }
                                        _self.setData("h_" + _gtype + "_" + type, type_count);
                                        if (dom.getElementById(gtype + "_" + type + "_count"))
                                            dom.getElementById(gtype + "_" + type + "_count").innerHTML = util.showTxt(countStr);
                                        if (countHash[gtype] == null)
                                            countHash[gtype] = type_count;
                                        else
                                            countHash[gtype] += type_count;
                                        countHash["All"] += type_count
                                    } else {
                                        var _showEl = dom.getElementById(gtype + "_show");
                                        if(_showEl) _showEl.style.display = "none";
                                        _self.setData(_gtype + "_" + type, type_count);
                                        if (countHash[type] == null)
                                            countHash[type] = 0;
                                        countHash[type] += count * 1;
                                        countHash[type] += fs_count * 1
                                    }
                                }
                        }
                        _self.sportScroll();
                        _self.checkNoData(countHash)
                    }
                    if (top["homefirst"] == null) {
                        parentClass.dispatchEvent("checkCount", {});
                        top["homefirst"] = true
                    } else if (!chgMode)
                        parentClass.dispatchEvent("showLoading", {
                            "isShow": false
                        });
                    else
                        setTimeout(function() {
                            parentClass.dispatchEvent("showLoading", {
                                "isShow": false
                            })
                        }, 1E3)
                }
                ;
                _self.setData = function(_name, count) {
                    var _el = _mc[_name + "_league"];
                    if (!_el) return;
                    if (count * 1 <= 0)
                        _el.style.display = "none";
                    else
                        _el.style.display = ""
                }
                ;
                _self.checkNoData = function(hash) {
                    for (var key in hash)
                        if (top.homePage_sw == "Y")
                            if (key == "All") {
                                var div_nodata = document.getElementById("page_nodata");
                                if (div_nodata != null)
                                    div_nodata.style.display = hash[key] * 1 == 0 ? "" : "none";
                                if (hash[key] * 1 == 0)
                                    _mc["home_sport"].style.display = "none"
                            } else if (key == "live") {
                                if (hash[key] * 1 == 0) {
                                    _mc["old_home_game_live"].style.display = "none";
                                    _mc["old_game_live"].style.display = "none"
                                } else {
                                    var _kEl = dom.getElementById(key + "_show");
                                    if(_kEl) _kEl.style.display = hash[key] * 1 <= 0 ? "none" : "";
                                }
                            } else {
                                var _kEl = dom.getElementById(key + "_show");
                                if(_kEl) _kEl.style.display = hash[key] * 1 <= 0 ? "none" : "";
                            }
                        else {
                            if(_mc["home_sport"]) _mc["home_sport"].style.display = "none";
                            var div_nodata = document.getElementById(key + "_nodata");
                            if (div_nodata != null)
                                div_nodata.style.display = hash[key] * 1 <= 0 ? "" : "none"
                        }
                }
                ;
                _self.setAD = function() {
                    _mc["touch_div"] = document.getElementById("touch_div");
                    _mc["info_4pwd_640"] = document.getElementById("info_4pwd_640");
                    _mc["set_4pwd_640"] = document.getElementById("set_4pwd_640");
                    _mc["info_4pwd_320"] = document.getElementById("info_4pwd_320");
                    _mc["set_4pwd_320"] = document.getElementById("set_4pwd_320")
                }
                ;
                _self.checkNotice = function() {
                    _top["noticeOpen"] = false;
                    var hide_notice = getLocalStorageItem("hide_notice190522");
                    var agent = window.navigator.userAgent;
                    if (_top["NoticeShow"] != "N" && hide_notice != "Y" && agent.indexOf("Windows Phone") == -1) {
                        var tmp_agnet = agent.toLowerCase();
                        if (tmp_agnet.indexOf("iphone") != -1 || isIPad()) {
                            if (_top["app"] == "Y")
                                return false;
                            return true
                        } else
                            return false
                    }
                    return false
                }
                ;
                _self.adTimer = function() {
                    var countAD = aryAD.length;
                    var ad_Count = countAD - 1;
                    if (nowAD > countAD)
                        nowAD = 1;
                    else if (nowAD < 1)
                        nowAD = countAD;
                    nowAD++;
                    _mc["animate_div"].className = "inner ADs" + nowAD + " innerAnimation";
                    if (nowAD == ad_Count + 1)
                        setTimeout(function() {
                            nowAD = 1;
                            _mc["animate_div"].className = "inner ADs1";
                            _self.clearADTimer();
                            _self.createADTimer()
                        }, 500)
                }
                ;
                _self.createADTimer = function() {
                    if (_.timerObj == null)
                        _.timerObj = new Object;
                    if (_.timerObj["ADTimer"] != null)
                        return;
                    _.timerObj["ADTimer"] = new Timer(3E3);
                    _.timerObj["ADTimer"].setParentclass(_self);
                    _.timerObj["ADTimer"].init();
                    _.timerObj["ADTimer"].addEventListener("TimerEvent.TIMER", _self.adTimer);
                    _.timerObj["ADTimer"].startTimer()
                }
                ;
                _self.clearADTimer = function() {
                    if (_.timerObj != null)
                        if (_.timerObj["ADTimer"] != null) {
                            _.timerObj["ADTimer"].clearObj();
                            _.timerObj["ADTimer"].is_clear = true;
                            _.timerObj["ADTimer"] = null
                        }
                    return true
                }
                ;
                _self.goToRulesPage = function() {
                    _self.clearTimer();
                    var url = "tpl/" + _top["userData"].langx + "/help_new_game.html";
                    loadHtml_loading(url, true)
                }
                ;
                _self.isIOS = function() {
                    var ret = false;
                    var ag = navigator.userAgent;
                    if (ag.indexOf("iPhone") != -1 || ag.indexOf("iPad") != -1)
                        ret = true;
                    return ret
                }
                ;
                _self.onError = function(txt) {
                    console.log(txt)
                }
                ;
                _self.addSportClick = function() {
                    for (i = 0; i < config_set.get("GTYPEARY").length; i++) {
                        var gtype = config_set.get("GTYPEARY")[i].toLowerCase();
                        var _name = "old_" + gtype + "_live_league";
                        _mc[_name] = dom.getElementById(_name);
                        var _par = new Object;
                        _par.extends = "";
                        if (page_sw)
                            _par.page = "league_index";
                        else {
                            _par.page = "game_list_" + gtype.toUpperCase();
                            _par.extends = "game_list"
                        }
                        _par.gtype = gtype;
                        _par.showtype = "live";
                        _par.rtype = "rb";
                        if (_mc[_name])
                            util.addEvent(_mc[_name], "click", _self.intoGame, _par)
                    }
                }
                ;
                _self.removeSportClick = function() {
                    for (i = 0; i < config_set.get("GTYPEARY").length; i++) {
                        gtype = config_set.get("GTYPEARY")[i].toLowerCase();
                        var _name = "old_" + gtype + "_live_league";
                        _mc[_name] = dom.getElementById(_name);
                        if (_mc[_name])
                            util.removeEvent(_mc[_name], "click")
                    }
                }
                ;
                _self.sportScroll = function(e) {
                    var _sport = dom.getElementById("sport_total");
                    var _scroll = dom.getElementById("sport_scroll");
                    var _left = dom.getElementById("sport_left");
                    var _right = dom.getElementById("sport_right");
                    if (_sport && _scroll) {
                        if (_sport.clientWidth > _scroll.clientWidth) {
                            util.addClass(_right, "on");
                            util.addEvent(_right, "click", util.move, {
                                "click": _right,
                                "div": _scroll,
                                "direction": "right",
                                "opposite": _left
                            })
                        } else {
                            util.removeClass(_right, "on");
                            util.removeEvent(_right, "click")
                        }
                        util.addEvent(_scroll, "scroll", _self.addScrollEvent, {
                            "total": _sport,
                            "scroll": _scroll,
                            "left": _left,
                            "right": _right
                        });
                        util.dragScroll(dom, "sport_scroll", _self.addSportClick, _self.removeSportClick, {
                            "tagName": "gtype"
                        })
                    }
                }
                ;
                _self.checkScroll = function(e) {
                    var _sport = dom.getElementById("sport_total");
                    var _scroll = dom.getElementById("sport_scroll");
                    var _left = dom.getElementById("sport_left");
                    var _right = dom.getElementById("sport_right");
                    if (_sport && _scroll)
                        if (_sport.clientWidth > _scroll.clientWidth) {
                            util.addClass(_right, "on");
                            util.addEvent(_right, "click", util.move, {
                                "click": _right,
                                "div": _scroll,
                                "direction": "right",
                                "opposite": _left
                            })
                        } else {
                            util.removeClass(_right, "on");
                            util.removeEvent(_right, "click")
                        }
                }
                ;
                _self.addScrollEvent = function(e, param) {
                    var scroll = param.scroll.scrollLeft;
                    var menuW = param.scroll.scrollWidth - param.scroll.clientWidth;
                    if (scroll > 0)
                        util.addClass(param.left, "on");
                    if (scroll == 0)
                        util.removeClass(param.left, "on");
                    if (scroll < menuW)
                        util.addClass(param.right, "on");
                    if (scroll >= menuW)
                        util.removeClass(param.right, "on");
                    if (param.total)
                        util.initCheckScroll(param.total, param.scroll, param.left, param.right)
                }
                ;
                _self.addSPESEvent = function() {
                    util.removeClass(_mc["es_sp_banner"], "no_event");
                    util.removeClass(_mc["es_sp_tab"], "no_event");
                    var _par = new Object;
                    _par["extends"] = "game_list";
                    _par["page"] = "game_list_" + top.specialGame.gtype;
                    _par["showtype"] = "today";
                    _par["type"] = "today";
                    _par["rtype"] = "r";
                    _par["gtype"] = top.specialGame.gtype.toLowerCase();
                    _par["mode"] = top.specialGame.mode;
                    _par["specialClick"] = "special";
                    _par["specialTitle"] = top.specialGame.title;
                    util.addEvent(_mc["es_sp_banner"], "click", _self.intoGame, _par);
                    util.addEvent(_mc["es_sp_tab"], "click", _self.intoGame, _par)
                }
                ;
                _self.removeSPESEvent = function() {
                    util.addClass(_mc["es_sp_banner"], "no_event");
                    util.addClass(_mc["es_sp_tab"], "no_event");
                    util.removeEvent(_mc["es_sp_banner"], "click");
                    util.removeEvent(_mc["es_sp_tab"], "click")
                }
                ;
                _self.bannerGameCount = function(count) {
                    AD.bannerGameCount(count)
                }
            }
            ;