function list_tv(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var LS, timerHash;
                var eventHandler = new Object;
                var config_set = new win.config_set;
                var util_game = new win.Util_game(win,dom);
                var util = new win.Util(win,dom);
                var date = "ALL";
                var gtype = "ALL";
                var all_date = new Array("ALL","0","1","2","3","4","5","6");
                var all_gtype = new Array("ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP");
                var first_sw = true;
                var is_first_choise = true;
                var classname = "list_tv";
                var myhash = {};
                _self.init = function() {
                    if (postHash) {
                        gtype = postHash["gtype"].toUpperCase();
                        _self.lightGtype(gtype)
                    }
                    _self.initBtn();
                    util.dragScroll(dom, "sport_scroll", _self.initGtypeBtn, _self.removeGtypeClick, {
                        "tagName": "gtype"
                    });
                    util.dragScroll(dom, "list_scroll", _self.initDateBtn, _self.removeDateClick, {
                        "tagName": "date"
                    });
                    var _sport = dom.getElementById("sport_total");
                    var sport_scroll = dom.getElementById("sport_scroll");
                    var sport_left = dom.getElementById("sport_left");
                    var sport_right = dom.getElementById("sport_right");
                    if (_sport.clientWidth > sport_scroll.clientWidth) {
                        util.addClass(sport_right, "on");
                        util.addEvent(sport_right, "click", util.move, {
                            "click": sport_right,
                            "div": sport_scroll,
                            "direction": "right",
                            "opposite": sport_left
                        })
                    }
                    util.addEvent(sport_scroll, "scroll", _self.addScrollEvent, {
                        "total": _sport,
                        "scroll": sport_scroll,
                        "left": sport_left,
                        "right": sport_right
                    });
                    var _list = dom.getElementById("list_total");
                    var list_scroll = dom.getElementById("list_scroll");
                    var list_left = dom.getElementById("list_left");
                    var list_right = dom.getElementById("list_right");
                    if (_list.clientWidth > list_scroll.clientWidth) {
                        util.addClass(list_right, "on");
                        util.addEvent(list_right, "click", util.move, {
                            "click": list_right,
                            "div": list_scroll,
                            "direction": "right",
                            "opposite": list_left
                        })
                    }
                    util.addEvent(list_scroll, "scroll", _self.addScrollEvent, {
                        "total": _list,
                        "scroll": list_scroll,
                        "left": list_left,
                        "right": list_right
                    });
                    win.addEventListener("resize", _self.listTVScroll);
                    util.addEvent(dom.getElementById("back_btn"), "click", _self.backClick);
                    if (first_sw) {
                        _self.getData();
                        first_sw = false
                    }
                    _self.createTimer()
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    timerHash = parentClass.getThis("timerHash");
                    LS = parentClass.getThis("LS")
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
                _self.exitEvent = function() {
                    var ret = _self.clearTimer();
                    if (ret)
                        return true
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
                _self.initBtn = function() {
                    _self.initDateBtn();
                    _self.initGtypeBtn()
                }
                ;
                _self.initDateBtn = function() {
                    for (var i = 0; i < all_date.length; i++) {
                        var obj = dom.getElementById("btn_date_" + all_date[i]);
                        util.addEvent(obj, "click", _self.dateEvent, {
                            "date": all_date[i]
                        })
                    }
                }
                ;
                _self.initGtypeBtn = function() {
                    for (var i = 0; i < all_gtype.length; i++) {
                        var obj = dom.getElementById("symbol_" + all_gtype[i]);
                        util.addEvent(obj, "click", _self.gtypeEvent, {
                            "gtype": all_gtype[i]
                        })
                    }
                }
                ;
                _self.initDateLight = function() {
                    for (var i = 0; i < all_date.length; i++) {
                        var obj = dom.getElementById("btn_date_" + all_date[i]);
                        util.removeClass(obj, "on")
                    }
                }
                ;
                _self.initGtypeLight = function() {
                    for (var i = 0; i < all_gtype.length; i++) {
                        var obj = dom.getElementById("symbol_" + all_gtype[i]);
                        util.removeClass(obj, "on")
                    }
                }
                ;
                _self.dateEvent = function(e, param) {
                    date = param["date"];
                    _self.showLoading(true);
                    _self.initDateLight();
                    var tarObj = dom.getElementById("btn_date_" + param["date"]);
                    util.addClass(tarObj, "on");
                    _self.getData()
                }
                ;
                _self.gtypeEvent = function(e, param) {
                    var par = new Object;
                    par["page"] = "list_tv";
                    par["type"] = "list_tv";
                    par["postHash"] = {
                        "gtype": param["gtype"]
                    };
                    parentClass.dispatchEvent("bodyGoToPage", par)
                }
                ;
                _self.lightGtype = function(choice_gtype) {
                    _self.initGtypeLight();
                    var lower_gtype = choice_gtype.toLowerCase();
                    var tarObj = dom.getElementById("symbol_" + choice_gtype);
                    dom.getElementById("head_league").className = "head_league " + lower_gtype;
                    dom.getElementById("gtype_now").innerHTML = util_game.showTxt(LS.get("gtype_" + lower_gtype));
                    util.addClass(tarObj, "on")
                }
                ;
                _self.move = function(e, hash) {
                    var clickObj = hash.click;
                    var divObj = hash.div;
                    var movePix = divObj.clientWidth;
                    var move = hash.direction == "right" ? movePix : movePix * -1;
                    _self.checkScrolltoShow(clickObj, hash.direction, hash.opposite, divObj, move)
                }
                ;
                _self.checkScrolltoShow = function(clickObj, _dir, _oppositeObj, divObj, move) {
                    var dirAry = new Object;
                    dirAry["left"] = "right";
                    dirAry["right"] = "left";
                    if (!_oppositeObj.classList.contains("on")) {
                        _oppositeObj.classList.add("on");
                        util.addEvent(_oppositeObj, "click", _self.move, {
                            "click": _oppositeObj,
                            "div": divObj,
                            "direction": dirAry[_dir],
                            "opposite": clickObj
                        })
                    }
                    var sl = divObj.scrollLeft + move;
                    divObj.scrollLeft += move;
                    if (_dir == "right") {
                        var scroll_w = sl + divObj.clientWidth;
                        if (scroll_w >= divObj.scrollWidth && clickObj.classList.contains("on"))
                            clickObj.classList.remove("on")
                    } else if (sl <= 0 && clickObj.classList.contains("on"))
                        clickObj.classList.remove("on")
                }
                ;
                _self.run = function() {
                    _self.getData()
                }
                ;
                _self.getData = function() {
                    var urlParams = "";
                    urlParams += "uid=" + top["userData"].uid;
                    urlParams += "&langx=" + top.langx;
                    urlParams += "&gtype=" + gtype;
                    urlParams += "&date=" + date;
                    urlParams += "&device=phone";
                    urlParams += "&ts=" + top["lastClickTS"];
                    urlParams = "p=get_list_tv&ver=" + top.ver + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onErrormsg);
                    getHTML.addEventListener("LoadComplete", _self.loadComplete);
                    getHTML.loadURL(top.m2_url, "POST", urlParams);
                    top["choice_list_tv_gtype"] = gtype
                }
                ;
                _self.loadComplete = function(xml) {
                    var errorMsg = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    var xmlnode = util.parseXml(xml);
                    var code = xmlnode.Node(xmlnode.Root[0], "code").innerHTML;
                    var select_date = xmlnode.Node(xmlnode.Root[0], "select_date").innerHTML;
                    var dates = xmlnode.Node(xmlnode.Root[0], "dates", false);
                    var thisweek = xmlnode.Node(xmlnode.Root[0], "thisweek", false);
                    var _sport = dom.getElementById("sport_total");
                    var _scroll = dom.getElementById("sport_scroll");
                    var _right = dom.getElementById("sport_right");
                    var _left = dom.getElementById("sport_left");
                    var tmpTS = xmlnode.Node(xmlnode.Root[0], "ts").innerHTML;
                    if (!util_game.checkTS(top["lastClickTS"], tmpTS, "list_tv")) {
                        console.log("[list_tv][tmpTS]===>", tmpTS, "[top.lastClickTS]=====>", top["lastClickTS"], "ts\u932f\u8aa4!!!!!!\u4e0d\u7e7c\u7e8c\u57f7\u884c");
                        return
                    }
                    _self.initDateBar(dates, thisweek, select_date);
                    if (code == "success") {
                        var tv_count = xmlnode.Node(xmlnode.Root[0], "tv_count").innerHTML;
                        var date = xmlnode.Node(xmlnode.Root[0], "date", false);
                        var div_show = document.getElementById("div_show");
                        var tmp_screen = "";
                        var tmp_date = "";
                        var dataHash = new Object;
                        var save = new Object;
                        div_show.innerHTML = "";
                        var showDateCount = 0;
                        for (var j = 0; j < date.length; j++) {
                            var dateObj = date[j];
                            var ymd = dateObj.getAttribute("id");
                            var week = dateObj.getAttribute("value");
                            var isShow = dateObj.getAttribute("display");
                            if (isShow == "N")
                                continue;
                            var tmp = ymd.split("-");
                            var game_date = tmp[2] + " / " + tmp[1];
                            var div_chkmodel = document.getElementById("chkmodel").innerHTML;
                            if (date.length > 1 || select_date != ymd) {
                                var date_model = document.getElementById("date_model").innerHTML;
                                date_model = date_model.replace(/\*DATE\*/g, util_game.showTxt(week));
                                date_model = date_model.replace(/\*DATE2\*/g, util_game.showTxt(game_date));
                                tmp_date += date_model
                            }
                            div_chkmodel = div_chkmodel.replace(/\*DATE_CONTENT\*/g, tmp_date);
                            var games = xmlnode.Node(dateObj, "game", false);
                            for (var i = 0; i < games.length; i++) {
                                var obj = games[i];
                                var div_model = document.getElementById("div_model").innerHTML;
                                var gtype = obj.getAttribute("gtype");
                                var gid = obj.getAttribute("gid");
                                var center_tv = obj.getAttribute("center_tv");
                                var isRB = obj.getAttribute("isRB");
                                var time = xmlnode.Node(obj, "time").innerHTML;
                                var league = xmlnode.Node(obj, "league").innerHTML;
                                var team_h = xmlnode.Node(obj, "team_h").innerHTML;
                                var team_c = xmlnode.Node(obj, "team_c").innerHTML;
                                var eventid = xmlnode.Node(obj, "eventid").innerHTML;
                                var isR = isRB == "Y" ? "N" : "Y";
                                team_h = _self.replaceMidfield(team_h);
                                var gtypegid = util_game.showTxt(gtype) + "_" + util_game.showTxt(gid);
                                if (dataHash[gtypegid])
                                    continue;
                                else
                                    dataHash[gtypegid] = true;
                                div_model = div_model.replace(/\*GID\*/g, util_game.showTxt(gtypegid));
                                div_model = div_model.replace(/\*RB_STYLE\*/gi, isRB == "Y" ? "on" : "");
                                var diff = util.getTimeDiff(top["userData"].timetype);
                                if (Math.abs(diff) > 0) {
                                    if (time) {
                                        var dateStr = ymd + " " + time;
                                        var tmpDate = new Date(dateStr.replace(/-/g, "/"));
                                        var newDate = new Date(tmpDate.getTime() + diff * 60 * 60 * 1E3);
                                        var newMonth = util.setZero(newDate.getMonth() + 1);
                                        var newDay = util.setZero(newDate.getDate());
                                        var newHour = util.setZero(newDate.getHours());
                                        var newMin = util.setZero(newDate.getMinutes());
                                        if (newDay != tmp[2] * 1) {
                                            div_model = div_model.replace(/\*DATE_STYLE\*/g, "");
                                            div_model = div_model.replace(/\*DAY\*/g, util_game.showTxt(newDay));
                                            div_model = div_model.replace(/\*MONTH\*/g, util_game.showTxt(newMonth))
                                        } else
                                            div_model = div_model.replace(/\*DATE_STYLE\*/g, "none");
                                        var parseTime = newHour + ":" + newMin;
                                        div_model = div_model.replace(/\*TIME\*/gi, util_game.showTxt(parseTime))
                                    }
                                } else {
                                    div_model = div_model.replace(/\*DATE_STYLE\*/g, "none");
                                    div_model = div_model.replace(/\*TIME\*/gi, util_game.showTxt(_self.get_time(time)))
                                }
                                div_model = div_model.replace(/\*GTYPE\*/g, util_game.showTxt(gtype).toLowerCase());
                                div_model = div_model.replace(/\*TEAM\*/g, util_game.showTxt(team_h) + " vs " + util_game.showTxt(team_c));
                                tmp_screen += div_model
                            }
                            div_chkmodel = div_chkmodel.replace(/\*GAME_CONTENT\*/g, tmp_screen);
                            save[showDateCount] = div_chkmodel;
                            showDateCount++;
                            tmp_date = "";
                            tmp_screen = ""
                        }
                        var allsave = "";
                        for (var i = 0; i < Object.keys(save).length; i++)
                            allsave += save[i];
                        div_show.innerHTML = allsave;
                        if (allsave == "" || tv_count == "0")
                            _self.showNodata(true);
                        else {
                            _self.showNodata(false);
                            for (var j = 0; j < date.length; j++) {
                                var dateObj = date[j];
                                var isShow = dateObj.getAttribute("display");
                                if (isShow == "N")
                                    continue;
                                var games = xmlnode.Node(dateObj, "game", false);
                                for (var i = 0; i < games.length; i++) {
                                    var obj = games[i];
                                    var gtype = obj.getAttribute("gtype");
                                    var gid = obj.getAttribute("gid");
                                    var ecid = xmlnode.Node(obj, "ecid").innerHTML;
                                    var league = xmlnode.Node(obj, "league").innerHTML;
                                    var lid = xmlnode.Node(obj, "lid").innerHTML;
                                    var showtype = xmlnode.Node(obj, "showtype").innerHTML;
                                    var ptype = xmlnode.Node(obj, "ptype").innerHTML;
                                    var imp = xmlnode.Node(obj, "imp").innerHTML;
                                    var team_h = xmlnode.Node(obj, "team_h").innerHTML;
                                    var team_c = xmlnode.Node(obj, "team_c").innerHTML;
                                    var isRB = obj.getAttribute("isRB");
                                    var gidm = xmlnode.Node(obj, "gidm").innerHTML;
                                    var more = document.getElementById("tv_" + gtype + "_" + gid);
                                    more.ecid = ecid;
                                    more.gid = gid;
                                    more.gtype = gtype;
                                    more.league = league;
                                    more.lid = lid;
                                    more.showtype = showtype;
                                    more.ptype = ptype;
                                    more.imp = imp;
                                    more.isRB = isRB;
                                    more.team_h = team_h;
                                    more.team_c = team_c;
                                    more.gidm = gidm;
                                    more.gid = gid;
                                    util.addEvent(dom.getElementById("tv_" + gtype + "_" + gid), "click", _self.showMoreGame, more)
                                }
                            }
                        }
                    } else {
                        _self.showNodata(true);
                        var msg = xmlnode.Node(xmlnode.Root[0], "msg").innerHTML;
                        alert(msg)
                    }
                    _self.getGtypeDistance(_scroll);
                    _self.showLoading(false);
                    dom.getElementById("div_show").style.display = "";
                    if (top.rightECID != "")
                        parentClass.dispatchEvent("setRightLoading", false);
                    parentClass.dispatchEvent("showLoading", {
                        "isShow": false
                    })
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
                _self.getGtypeDistance = function(_scroll) {
                    var div = dom.getElementById("symbol_" + top.choice_list_tv_gtype);
                    var half_ball_div_width = dom.getElementById("symbol_" + top.choice_list_tv_gtype).clientWidth / 2;
                    top.left_distance = div.offsetLeft;
                    if (is_first_choise)
                        _self.move_menu(_scroll.clientWidth, half_ball_div_width, _scroll);
                    is_first_choise = false
                }
                ;
                _self.move_menu = function(scroll, half_ball_div_width, scrollObj) {
                    var scroll_width = scroll;
                    var dif = scroll_width - (top.left_distance + half_ball_div_width);
                    if (dif < 0) {
                        if (dif < 0)
                            dif = -dif;
                        scrollObj.scrollLeft += dif + scroll_width / 2
                    } else if (dif > 0 && top.left_distance + half_ball_div_width > scroll_width / 2 && top.left_distance + half_ball_div_width < scroll_width)
                        scrollObj.scrollLeft += top.left_distance + half_ball_div_width - scroll_width / 2
                }
                ;
                _self.showLoading = function(isShow) {
                    dom.getElementById("sched_loading").style.display = isShow ? "" : "none"
                }
                ;
                _self.onErrormsg = function(xml) {
                    console.log(xml)
                }
                ;
                _self.showNodata = function(isNodata) {
                    document.getElementById("div_show").style.display = isNodata ? "none" : "";
                    document.getElementById("div_nodata").style.display = isNodata ? "" : "none"
                }
                ;
                _self.initDateBar = function(date, dataAry, sel_date) {
                    var list_tvid = new Array("btn_date_0","btn_date_1","btn_date_2","btn_date_3","btn_date_4","btn_date_5","btn_date_6");
                    var list_tvweek = new Array("date1_week","date2_week","date3_week","date4_week","date5_week","date6_week","date7_week");
                    var list_tvdate = new Array("date1_date","date2_date","date3_date","date4_date","date5_date","date6_date","date7_date");
                    var list_tvmonth = new Array("date1_month","date2_month","date3_month","date4_month","date5_month","date6_month","date7_month");
                    for (var j = 0; j < dataAry.length; j++) {
                        document.getElementById(list_tvid[j]).value = j;
                        document.getElementById(list_tvweek[j]).innerHTML = util_game.showTxt(dataAry[j].getAttribute("value"));
                        document.getElementById(list_tvdate[j]).innerHTML = util_game.showTxt(parseInt(dataAry[j].getAttribute("name")).toString());
                        document.getElementById(list_tvmonth[j]).innerHTML = util_game.showTxt(dataAry[j].getAttribute("id"))
                    }
                    date = sel_date
                }
                ;
                _self.showMoreGame = function(e, targetObj) {
                    var ret = _self.clearTimer();
                    if (ret) {
                        var isRB = targetObj.isRB != null ? targetObj.isRB : "N";
                        var paramHash = new Object;
                        var more = "game_more_" + targetObj.gtype;
                        var param = new Object;
                        _showtype = targetObj.showtype.toLowerCase();
                        _gtype = targetObj.gtype.toLowerCase();
                        var _type = util.switchShowType(_showtype);
                        top.choice_showtype = _type;
                        top.choice_gtype = _gtype;
                        paramHash["league"] = targetObj.league;
                        paramHash["ecid"] = targetObj.gtype == "FT" ? targetObj.ecid : targetObj.gid;
                        paramHash["isRB"] = isRB;
                        paramHash["gtype"] = _gtype;
                        paramHash["showtype"] = _type;
                        paramHash["team_h"] = targetObj.team_h;
                        paramHash["team_c"] = targetObj.team_c;
                        paramHash["gidm"] = targetObj.gidm;
                        paramHash["gid"] = targetObj.gid;
                        param["page"] = more;
                        param["extendsClass"] = "game_more";
                        param["post"] = "gtype=" + _gtype + "&showtype=" + _type + "&isRB=" + isRB;
                        param["isRB"] = isRB;
                        param["postHash"] = paramHash;
                        parentClass.dispatchEvent("bodyGoToPage", param)
                    }
                }
                ;
                _self.replaceMidfield = function(vals) {
                    return vals.replace("[Mid]", "").replace("[\u4e2d]", "")
                }
                ;
                _self.showDis = function(isShow) {
                    var dis = isShow == "Y" ? "" : "none";
                    var ret = "style='display:" + dis + ";'";
                    return ret
                }
                ;
                _self.get_time = function(time) {
                    var ret = "";
                    if (time) {
                        var temp = time.split(":");
                        temp.pop();
                        ret = temp.join(":")
                    }
                    return ret
                }
                ;
                _self.createTimer = function() {
                    config_set.init();
                    if (timerHash["TVTimer"] != null)
                        return;
                    timerHash["TVTimer"] = new Timer(config_set.get("CONFIG_LIST_TV"));
                    timerHash["TVTimer"].setParentclass(_self);
                    timerHash["TVTimer"].init();
                    timerHash["TVTimer"].addEventListener("TimerEvent.TIMER", _self.run);
                    timerHash["TVTimer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.run);
                    timerHash["TVTimer"].startTimer()
                }
                ;
                _self.clearTimer = function() {
                    if (timerHash != null)
                        if (timerHash["TVTimer"] != null) {
                            timerHash["TVTimer"].clearObj();
                            timerHash["TVTimer"] = null
                        }
                    return true
                }
                ;
                _self.listTVScroll = function(e) {
                    var _sport = dom.getElementById("sport_total");
                    var sport_scroll = dom.getElementById("sport_scroll");
                    var sport_left = dom.getElementById("sport_left");
                    var sport_right = dom.getElementById("sport_right");
                    if (_sport && sport_scroll) {
                        if (_sport.clientWidth > sport_scroll.clientWidth) {
                            util.addClass(sport_right, "on");
                            util.addEvent(sport_right, "click", util.move, {
                                "click": sport_right,
                                "div": sport_scroll,
                                "direction": "right",
                                "opposite": sport_left
                            })
                        } else {
                            util.removeClass(sport_right, "on");
                            util.removeEvent(sport_right, "click")
                        }
                        util.addEvent(sport_scroll, "scroll", _self.addScrollEvent, {
                            "total": _sport,
                            "scroll": sport_scroll,
                            "left": sport_left,
                            "right": sport_right
                        })
                    }
                    var _list = dom.getElementById("list_total");
                    var list_scroll = dom.getElementById("list_scroll");
                    var list_left = dom.getElementById("list_left");
                    var list_right = dom.getElementById("list_right");
                    if (_list && list_scroll) {
                        if (_list.clientWidth > list_scroll.clientWidth) {
                            util.addClass(list_right, "on");
                            util.addEvent(list_right, "click", util.move, {
                                "click": list_right,
                                "div": list_scroll,
                                "direction": "right",
                                "opposite": list_left
                            })
                        } else {
                            util.removeClass(list_right, "on");
                            util.removeEvent(list_right, "click")
                        }
                        util.addEvent(list_scroll, "scroll", _self.addScrollEvent, {
                            "total": _list,
                            "scroll": list_scroll,
                            "left": list_left,
                            "right": list_right
                        })
                    }
                }
                ;
                _self.backClick = function(e, param) {
                    top.BackTag = "Y";
                    parentClass.dispatchEvent("backPage", {})
                }
                ;
                _self.dragScroll = function(dom) {
                    var _document = dom;
                    var mousemove = "mousemove";
                    var mouseup = "mouseup";
                    var mousedown = "mousedown";
                    var mouseleave = "mouseleave";
                    var EventListener = "EventListener";
                    var addEventListener = "add" + EventListener;
                    var removeEventListener = "remove" + EventListener;
                    var newScrollX, newScrollY;
                    var isDown = false;
                    var isMoving = false;
                    var dragged = [];
                    for (i = 0; i < dragged.length; ) {
                        el = dragged[i++];
                        el = el.container || el;
                        el[removeEventListener](mousedown, el.md, 0);
                        _document.getElementById("sport_menu")[removeEventListener](mouseup, el.mu, 0);
                        _document.getElementById("sport_menu")[removeEventListener](mousemove, el.mm, 0)
                    }
                    dragged = [].slice.call(_document.getElementsByClassName("dragscroll"));
                    for (i = 0; i < dragged.length; )
                        (function(el, lastClientX, lastClientY, pushed, scroller, cont) {
                            (cont = el.container || el)[addEventListener](mousedown, cont.md = function(e) {
                                echo("mousedown");
                                isDown = true;
                                if (!el.hasAttribute("nochilddrag") || _document.elementFromPoint(e.pageX, e.pageY) == cont) {
                                    pushed = 1;
                                    lastClientX = e.clientX;
                                    lastClientY = e.clientY;
                                    e.preventDefault()
                                }
                            }
                            , 0);
                            _document.getElementById("sport_menu")[addEventListener](mouseup, cont.mu = function() {
                                echo("mouseup");
                                isMoving = false;
                                isDown = false;
                                setTimeout(_self.initGtypeBtn, 100);
                                pushed = 0
                            }
                            , 0);
                            _document.getElementById("sport_menu")[addEventListener](mouseleave, cont.mlv = function() {
                                echo("mouseleave");
                                isMoving = false;
                                isDown = false;
                                _self.initGtypeBtn()
                            }
                            , 0);
                            _document.getElementById("sport_menu")[addEventListener](mousemove, cont.mm = function(e) {
                                if (!isDown)
                                    return;
                                isMoving = true;
                                if (isMoving)
                                    for (var z = 0; z < all_gtype.length; z++) {
                                        var obj = dom.getElementById("symbol_" + all_gtype[z]);
                                        util.removeEvent(obj, "click")
                                    }
                                if (pushed) {
                                    (scroller = el.scroller || el).scrollLeft -= newScrollX = -lastClientX + (lastClientX = e.clientX);
                                    scroller.scrollTop -= newScrollY = -lastClientY + (lastClientY = e.clientY);
                                    if (el == _document.body) {
                                        (scroller = _document.documentElement).scrollLeft -= newScrollX;
                                        scroller.scrollTop -= newScrollY
                                    }
                                }
                            }
                            , 0)
                        }
                        )(dragged[i++])
                }
                ;
                _self.removeGtypeClick = function() {
                    for (var z = 0; z < all_gtype.length; z++) {
                        var obj = dom.getElementById("symbol_" + all_gtype[z]);
                        util.removeEvent(obj, "click")
                    }
                }
                ;
                _self.removeDateClick = function() {
                    for (var i = 0; i < all_date.length; i++) {
                        var obj = dom.getElementById("btn_date_" + all_date[i]);
                        util.removeEvent(obj, "click")
                    }
                }
            }
            ;