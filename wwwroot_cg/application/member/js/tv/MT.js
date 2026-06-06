function MT(_win, _dom) {
                var _self = this;
                var parentClass;
                var win = _win;
                var dom = _dom;
                var util;
                var LS;
                var TIMEZONE = "America:New_York";
                var widget3_ary = new Array("FT");
                var target_gtype = "";
                var target_spid = "";
                var target_datetime = "";
                var target_systime = "";
                var KEYID = "2370877a0ce04fbfdc9678dae41d4210";
                var GAMEID = "";
                var agent = win.navigator.userAgent;
                var iconAry = new Object;
                iconAry["ALL"] = new Array("tv_btn","mt_btn","statistic_btn","team_btn","comment_btn","htoh_btn","livetable_btn","pointBypoint_btn","boxscore_btn","probabilities_btn");
                iconAry["FT"] = new Array("tv_btn","mt_btn","statistic_btn","team_btn","comment_btn","htoh_btn","livetable_btn");
                iconAry["BK"] = new Array("tv_btn","mt_btn","statistic_btn","comment_btn","htoh_btn","livetable_btn");
                iconAry["TN"] = new Array("tv_btn","mt_btn","statistic_btn","comment_btn","htoh_btn","livetable_btn","pointBypoint_btn");
                iconAry["BM"] = new Array("tv_btn","mt_btn","statistic_btn","htoh_btn","livetable_btn");
                iconAry["RL"] = new Array("tv_btn","mt_btn","statistic_btn","comment_btn","htoh_btn","livetable_btn");
                iconAry["DA"] = new Array("tv_btn","mt_btn","statistic_btn","comment_btn","htoh_btn","livetable_btn");
                iconAry["IH"] = new Array("tv_btn","mt_btn","statistic_btn","comment_btn","htoh_btn","livetable_btn");
                iconAry["BS"] = new Array("tv_btn","mt_btn","statistic_btn","comment_btn","htoh_btn","livetable_btn","boxscore_btn","probabilities_btn");
                iconAry["VB"] = new Array("tv_btn","mt_btn","statistic_btn","comment_btn","htoh_btn","livetable_btn");
                iconAry["TT"] = new Array("tv_btn","mt_btn","statistic_btn","comment_btn","htoh_btn","livetable_btn");
                iconAry["SK"] = new Array("tv_btn","mt_btn","statistic_btn","comment_btn","htoh_btn","livetable_btn");
                iconAry["AF"] = new Array("tv_btn","mt_btn","statistic_btn","comment_btn","htoh_btn","livetable_btn","boxscore_btn","probabilities_btn");
                var timeClick = false;
                var timeLineOpen = false;
                var collapseClick = true;
                var relateClick = false;
                var nowBox = "tv_box";
                var noTV = false;
                var onlyTV = false;
                var light_ary = new Array("tv_btn","mt_btn");
                var mt_sub_ary = new Array("statistic_btn","team_btn","comment_btn","htoh_btn","livetable_btn","pointBypoint_btn","boxscore_btn","probabilities_btn");
                var sb = 0;
                var isLoading = false;
                var lineups_sw = false;
                var cmdHash = null;
                var allow_gtype = new Array("FT","BK","TN","BM","RL","DA","IH","BS","VB","TT","SK","AF");
                var eventHandler = new Object;
                var chkAgent = new win.check_agent(win,dom);
                var mt_pop_visible = false;
                var mt_pop_full = false;
                var sub_title = "";
                var _showRight = false;
                var mainTimestamp;
                var subTimestamp;
                var LMT3_sw = true;
                var myhash = {};
                var sub_NoData = false;
                _self.init = function(mt_data, showRight) {
                    _showRight = showRight;
                    target_gtype = mt_data.gtype;
                    target_spid = mt_data.spid;
                    target_datetime = mt_data.datetime;
                    target_systime = mt_data.systime;
                    nowBox = "tv_box";
                    _self.setMTicon(mt_data.gtype);
                    _self.setIconVisible(mt_data.gtype);
                    _self.setClickEvent();
                    cmdHash = HashFunction();
                    win.addEventListener("resize", _self.mtScroll);
                    win.addEventListener("orientationchange", _self.orientation)
                }
                ;
                _self.resetOnmessage = function() {}
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    util = parentClass.getThis("util");
                    LS = parentClass.getThis("LS")
                }
                ;
                _self.getThis = function(varible) {
                    if (!myhash[varible]) {
                        var msg = "no myhash[" + varible + "]";
                        util.writeLog("MT", msg)
                    }
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
                _self.setClickEvent = function() {
                    util.addEvent(_get("timeline_btn"), "click", _self.openTimeLine);
                    util.addEvent(_get("mt_pop_mask"), "click", _self.closeMTsub);
                    util.addEvent(_get("mt_sub_close"), "click", _self.closeMTsub);
                    util.addEvent(_get("collapse_btn"), "click", _self.collapseTV)
                }
                ;
                _self.fullMtPop = function(e, closeMtPop) {
                    echo("[MT][fullMtPop]" + e.target.getAttribute("type"));
                    if (e.target.getAttribute("type") == "mt_close")
                        return;
                    mt_pop_full = !mt_pop_full;
                    _get("box_popup").classList.remove("on");
                    if (mt_pop_full)
                        _get("box_popup").classList.add("on")
                }
                ;
                _self.closeLoading = function(name, ts, totalHeight) {
                    if (name == "mt_pop_loading") {
                        if (_showRight && target_gtype == "FT")
                            if (!sub_NoData && totalHeight >= 378)
                                _get("mt_sub").style.height = totalHeight + "px";
                            else if (sub_NoData)
                                _get("mt_sub").style.height = "0px";
                        echo(subTimestamp, "[subTimestamp]");
                        if (ts == subTimestamp)
                            _get(name).style.display = "none";
                        util.removeClass(_get("mt_sub"), "white_bg")
                    } else if (name == "mt_loading") {
                        echo(mainTimestamp, "[mainTimestamp]");
                        if (ts == mainTimestamp)
                            _get(name).style.display = "none"
                    }
                    if (nowBox != "tv_box" && collapseClick) {
                        _self.timelineVisible(true);
                        isLoading = false
                    }
                }
                ;
                _self.openloading = function(name) {
                    var loading_ary = new Array("mt_loading","mt_pop_loading");
                    _get(name).style.display = ""
                }
                ;
                _self.chgMode = function(mode) {
                    var par = "";
                    var ts = (new Date).getTime();
                    var mtData = new Object;
                    mtData = {
                        Mode: mode,
                        KeyID: KEYID,
                        GameID: GAMEID,
                        Gtype: target_gtype,
                        SpID: target_spid,
                        TimeZone: TIMEZONE,
                        Cross: util.getWebUrl(),
                        Status: timeLineOpen ? "open" : "close",
                        NeedsHeader: "Y",
                        Lang: top.ls,
                        Lmt3: target_gtype != "FT" ? LMT3_sw : false
                    };
                   //par += "&uid=hz16g0v5m36399395l4955128b1";
		par += "&uid=" + top.uid2;
	   // par += "&uid=r401e43om35684895l4887624b1";
		par += "&langx=" + top["userData"].langx;
		par += "&username=" + top["userData"].username;
		par += "&version=" + "";
		var url = util.getProtocal() + "//" + top.mt_domain  + "/transform.php?p=getDataMT" + par;
                    var mainStream = "";
                    if (mode.indexOf("lmt") != -1) {
                        mainStream = "mt_main";
                        mainTimestamp = ts.toString()
                    } else {
                        mainStream = "mt_sub";
                        _self.showNoData(false);
                        subTimestamp = ts.toString();
                        if (!mt_pop_visible)
                            _self.openMTsub();
                        else
                            _get("mt_pop_title").innerHTML = sub_title
                    }
                    _get(mainStream).onload = function() {
                        try {
                            echo("load success!!" + "[\u50b3\u905e\u8cc7\u6599]  ==> 456|" + JSON.stringify(mtData));
                            if (mainStream != "mt_main") {
                                var tmpOrientation = win.Math.abs(win.orientation);
                                _get(mainStream).contentWindow.postMessage("456|" + JSON.stringify(mtData) + "|" + subTimestamp + "|" + _showRight, "*");
                                if (tmpOrientation == 90)
                                    _get(mainStream).contentWindow.postMessage("789|addClass|", "*")
                            } else
                                _get(mainStream).contentWindow.postMessage("456|" + JSON.stringify(mtData) + "|" + mainTimestamp + "|" + _showRight, "*")
                        } catch (e) {}
                    }
                    ;
                    _get(mainStream).contentWindow.location = url;
                    if (mode.indexOf("close") != -1) {
                        try {
                            _get(mainStream).contentWindow.location.replace("about:blank")
                        } catch (e) {
                            console.log(e)
                        }
                        if (mainStream == "mt_sub")
                            if (mt_pop_visible) {
                                _self.setMtPopVisible(false);
                                _self.clearBtnLight()
                            }
                    }
                }
                ;
                _self.openMTsub = function() {
                    parentClass.dispatchEvent("addbodylock", {});
                    _self.setMtPopVisible(true);
                    _get("mt_pop_title").innerHTML = sub_title;
                    _get("mt_sub").classList.add("white_bg")
                }
                ;
                _self.setMtPopVisible = function(isShow) {
                    mt_pop_visible = isShow;
                    _get("mt_pop").classList.remove("on");
                    if (isShow)
                        _get("mt_pop").classList.add("on")
                }
                ;
                _self.closeMTsub = function(act) {
                    if (mt_pop_visible)
                        _self.chgMode("sub_close");
                    _get("box_popup").classList.remove("on");
                    _self.setMtPopVisible(false);
                    mt_pop_full = false;
                    mt_pop_visible = false;
                    top.resizeMTSub = "";
                    _self.clearBtnLight();
                    parentClass.dispatchEvent("removebodylock", {})
                }
                ;
                _self.checkMTsubIsOpen = function() {
                    var sub_dis = _get("mt_pop").style.display;
                    if (sub_dis == "")
                        _self.closeMTsub()
                }
                ;
                _self.setLinesup = function(sw) {
                    lineups_sw = sw == "Y" && target_gtype == "FT" ? true : false
                }
                ;
                _self.setIconVisible = function(gtype) {
                    for (var i = 0; i < iconAry["ALL"].length; i++)
                        _get(iconAry["ALL"][i]).style.display = "none";
                    if (collapseClick && nowBox != "tv_box" && !isLoading)
                        _self.timelineVisible(true);
                    var targetAry = iconAry[gtype] ? iconAry[gtype] : iconAry["ALL"];
                    for (var i = 0; i < targetAry.length; i++) {
                        _get(targetAry[i]).style.display = "";
                        util.addEvent(_get(targetAry[i]), "click", _self.clickBtn, _get(targetAry[i]))
                    }
                }
                ;
                _self.setMtSubDefProc = function() {
                    var subSelect = "R_htoh_btn";
                    var isRP3 = top.rightShowType == "parlay" && top.rightRB == "Y";
                    if (top.rightShowType == "live" || isRP3)
                        subSelect = "R_statistic_btn";
                    setTimeout(_self.setBtnLight, 300, subSelect)
                }
                ;
                _self.setTvVisible = function(isShow) {
                    var addClass, removeClass, addLight = "";
                    console.log("[MT][isShow] = ", isShow);
                    if (isShow == "same") {
                        addLight = "";
                        if (GAMEID != "" && nowBox != "mt_box" && top.rightNowPlay == "MT") {
                            _self.boxSwitch("mt_box");
                            setTimeout(_self.setBtnLight, 300, "mt_btn")
                        }
                    } else if (isShow) {
                        if (_get("mt_btn") && top.rightNowPlay != "MT")
                            _get("mt_btn").classList.remove("on");
                        _self.timelineVisible(false);
                        noTV = false;
                        console.log(nowBox, "[nowBox]");
                        if (nowBox != "mt_box") {
                            _self.boxSwitch("tv_box");
                            addLight = "on";
                            setTimeout(_self.setBtnLight, 300, "tv_btn")
                        }
                    } else {
                        noTV = true;
                        addLight = "";
                        if (GAMEID != "" && nowBox != "mt_box") {
                            _self.boxSwitch("mt_box");
                            setTimeout(_self.setBtnLight, 300, "mt_btn")
                        }
                    }
                    if (top.nowWidth == "over1024" && top.rightGtype == "ft")
                        _self.setMtSubDefProc(lineups_sw);
                    if (addLight != "")
                        _get("tv_btn").classList.add(addLight);
                    _get("tv_btn").style.display = isShow ? "" : "none";
                    _self.checkLineups(lineups_sw)
                }
                ;
                _self.setMtSubDefProc = function(sw) {
                    var lineUp_sw = sw;
                    var subSelect = "R_htoh_btn";
                    var isRP3 = top.rightShowType == "parlay" && top.rightRB == "Y";
                    var isComingSoon = false;
                    if (top.rightShowType == "today" || top.rightShowType == "early" || top.rightShowType == "parlay")
                        isComingSoon = _self.chkGameStatus();
                    if (isComingSoon && lineUp_sw)
                        subSelect = "R_team_btn";
                    if (top.rightShowType == "live" || isRP3)
                        subSelect = "R_statistic_btn";
                    top.resizeMTSub = subSelect;
                    setTimeout(_self.setBtnLight, 300, subSelect)
                }
                ;
                _self.chkGameStatus = function() {
                    var coming_soon = false;
                    var nowTS = parseInt((new Date(target_systime)).getTime() / 1E3);
                    var splitDatetime = target_datetime.split(" ");
                    var gameTime = splitDatetime[1];
                    var splitTime = gameTime.split(":");
                    var hour = parseInt(splitTime[0]);
                    var min = parseInt(splitTime[1]);
                    var splitYMD = splitDatetime[0].split("-");
                    var year = parseInt(splitYMD[0]);
                    var month = parseInt(splitYMD[1]) - 1;
                    var day = parseInt(splitYMD[2]);
                    var targetTime = (new Date(year,month,day,hour,min - 30)).getTime() / 1E3;
                    console.log("[nowTS] = ", nowTS, ",[targetTime] = ", targetTime);
                    if (nowTS > targetTime)
                        coming_soon = true;
                    return coming_soon
                }
                ;
                _self.clickBtn = function(mouseEvent, targetObj) {
                    if (targetObj.id.indexOf("tv_btn") != -1) {
                        top.collapseClick = true;
                        _self.chgCollapseClass(true);
                        top.rightNowPlay = "TV"
                    } else if (targetObj.id.indexOf("mt_btn") != -1) {
                        top.collapseClick = true;
                        _self.chgCollapseClass(true);
                        top.rightNowPlay = "MT"
                    } else
                        top.resizeMTSub = targetObj.id;
                    _self.setBtnLight(targetObj.id)
                }
                ;
                _self.setBtnLight = function(btn) {
                    if (btn.indexOf("R_") != -1)
                        btn = btn.substr(2, btn.length - 2);
                    if (util.in_array(btn, light_ary))
                        for (var i = 0; i < light_ary.length; i++)
                            _get(light_ary[i]).classList.remove("on");
                    else if (util.in_array(btn, mt_sub_ary))
                        for (var a = 0; a < mt_sub_ary.length; a++)
                            _get(mt_sub_ary[a]).classList.remove("on");
                    sub_NoData = false;
                    switch (btn) {
                    case "tv_btn":
                    case "R_tv_btn":
                        _self.timelineVisible(false);
                        if (timeLineOpen && !collapseClick)
                            _self.openTimeLine();
                        parentClass.dispatchEvent("openTV", {
                            "from": "tv_btn"
                        });
                        _self.boxSwitch("tv_box");
                        _get(btn).classList.add("on");
                        break;
                    case "mt_btn":
                    case "R_mt_btn":
                        _self.openloading("mt_loading");
                        isLoading = true;
                        _self.timelineVisible(false);
                        if (timeLineOpen && !collapseClick)
                            _self.openTimeLine();
                        _self.switchMode("pitch");
                        _get(btn).classList.add("on");
                        break;
                    case "statistic_btn":
                    case "R_statistic_btn":
                        _self.openloading("mt_pop_loading");
                        _self.switchMode("statistic");
                        _get(btn).classList.add("on");
                        if (_get("no_pop_data"))
                            _get("no_pop_data").style.display = "none";
                        if (_get("mt_sub") && _showRight)
                            _get("mt_sub").style.height = "378px";
                        break;
                    case "comment_btn":
                    case "R_comment_btn":
                        _self.openloading("mt_pop_loading");
                        _self.switchMode("comment");
                        _get(btn).classList.add("on");
                        if (_get("no_pop_data"))
                            _get("no_pop_data").style.display = "none";
                        if (_get("mt_sub") && _showRight)
                            _get("mt_sub").style.height = "378px";
                        break;
                    case "team_btn":
                    case "R_team_btn":
                        _self.openloading("mt_pop_loading");
                        _self.switchMode("team");
                        _get(btn).classList.add("on");
                        if (_get("no_pop_data"))
                            _get("no_pop_data").style.display = "none";
                        if (_get("mt_sub") && _showRight)
                            _get("mt_sub").style.height = "378px";
                        break;
                    case "htoh_btn":
                    case "R_htoh_btn":
                        _self.openloading("mt_pop_loading");
                        _self.switchMode("htoh");
                        _get(btn).classList.add("on");
                        if (_get("no_pop_data"))
                            _get("no_pop_data").style.display = "none";
                        if (_get("mt_sub") && _showRight)
                            _get("mt_sub").style.height = "378px";
                        break;
                    case "livetable_btn":
                    case "R_livetable_btn":
                        _self.openloading("mt_pop_loading");
                        _self.switchMode("livetable");
                        _get(btn).classList.add("on");
                        if (_get("no_pop_data"))
                            _get("no_pop_data").style.display = "none";
                        if (_get("mt_sub") && _showRight)
                            _get("mt_sub").style.height = "378px";
                        break;
                    case "pointBypoint_btn":
                    case "R_pointBypoint_btn":
                        _self.openloading("mt_pop_loading");
                        _self.switchMode("pointByPoint");
                        _get(btn).classList.add("on");
                        if (_get("no_pop_data"))
                            _get("no_pop_data").style.display = "none";
                        if (_get("mt_sub") && _showRight)
                            _get("mt_sub").style.height = "378px";
                        break;
                    case "probabilities_btn":
                    case "R_probabilities_btn":
                        _self.openloading("mt_pop_loading");
                        _self.switchMode("probabilities");
                        _get(btn).classList.add("on");
                        if (_get("no_pop_data"))
                            _get("no_pop_data").style.display = "none";
                        if (_get("mt_sub") && _showRight)
                            _get("mt_sub").style.height = "378px";
                        break;
                    case "boxscore_btn":
                    case "R_boxscore_btn":
                        var scoreBtn = "boxScore";
                        _self.openloading("mt_pop_loading");
                        if (target_gtype == "AF")
                            scoreBtn = "boxscore";
                        _self.switchMode(scoreBtn);
                        _get(btn).classList.add("on");
                        if (_get("no_pop_data"))
                            _get("no_pop_data").style.display = "none";
                        if (_get("mt_sub") && _showRight)
                            _get("mt_sub").style.height = "378px";
                        break
                    }
                }
                ;
                _self.clearBtnLight = function() {
                    for (var i = 0; i < mt_sub_ary.length; i++)
                        if (_get(mt_sub_ary[i]))
                            _get(mt_sub_ary[i]).classList.remove("on")
                }
                ;
                _self.setMTicon = function(gtype) {
                    _get("mt_icon").className = "icon_match_" + gtype
                }
                ;
                _self.setKeyID = function(id) {
                    KEYID = id
                }
                ;
                _self.setGameID = function(id) {
                    GAMEID = id;
                    onlyTV = false
                }
                ;
                _self.getGameID = function() {
                    return GAMEID
                }
                ;
                _self.getNowBox = function() {
                    return nowBox
                }
                ;
                _self.setNowBox = function(_state) {
                    nowBox = _state == "MT" ? "mt_box" : "tv_box"
                }
                ;
                _self.boxSwitch = function(box_id) {
                    var boxAry = new Array("tv_box","mt_box");
                    for (var i = 0; i < boxAry.length; i++)
                        _get(boxAry[i]).style.display = "none";
                    _get(box_id).style.display = "";
                    if (box_id.indexOf("tv") != -1 && nowBox == "mt_box")
                        _self.chgMode("lmt_close");
                    else if (box_id.indexOf("mt") != -1 && nowBox == "tv_box")
                        parentClass.dispatchEvent("closeTV", null);
                    if (!collapseClick) {
                        collapseClick = true;
                        _self.chgCollapseClass(collapseClick)
                    }
                    nowBox = box_id;
                    if (!onlyTV && nowBox == "tv_box")
                        _self.timelineVisible(false)
                }
                ;
                _self.closeAllbox = function() {
                    var boxAry = new Array("tv_box","mt_box");
                    for (var i = 0; i < boxAry.length; i++)
                        _get(boxAry[i]).style.display = "none";
                    _get("timeline_btn").style.display = "none"
                }
                ;
                _self.switchMode = function(mode) {
                    if (util.in_array(target_gtype, widget3_ary))
                        switch (mode) {
                        case "pitch":
                            _self.boxSwitch("mt_box");
                            _self.chgMode("match.lmtCustom");
                            break;
                        case "statistic":
                            sub_title = LS.get("MT_Statistics");
                            _self.chgMode("match.statistics");
                            break;
                        case "comment":
                            sub_title = LS.get("MT_Commentary");
                            _self.chgMode("match.commentary");
                            break;
                        case "team":
                            sub_title = LS.get("MT_LineUps");
                            _self.chgMode("match.lineups");
                            break;
                        case "htoh":
                            sub_title = LS.get("MT_HeadToHead");
                            _self.chgMode("match.headTohead");
                            break;
                        case "livetable":
                            sub_title = LS.get("MT_LeagueTable");
                            _self.chgMode("season.liveTable");
                            break
                        }
                    else if (LMT3_sw)
                        switch (mode) {
                        case "pitch":
                            _self.boxSwitch("mt_box");
                            _self.chgMode("match.lmtPlus");
                            break;
                        case "statistic":
                            sub_title = LS.get("MT_Statistics");
                            _self.chgMode("statistics");
                            break;
                        case "comment":
                            sub_title = LS.get("MT_Commentary");
                            _self.chgMode("timeline");
                            break;
                        case "team":
                            sub_title = LS.get("MT_LineUps");
                            _self.chgMode("lineups");
                            break;
                        case "htoh":
                            sub_title = LS.get("MT_HeadToHead");
                            _self.chgMode("headToHead");
                            break;
                        case "livetable":
                            sub_title = LS.get("MT_LeagueTable");
                            _self.chgMode("standings");
                            break;
                        case "pointByPoint":
                            sub_title = LS.get("MT_PointByPoint");
                            _self.chgMode("pointByPoint");
                            break;
                        case "probabilities":
                            sub_title = LS.get("MT_probabilities");
                            _self.chgMode("probabilities");
                            break;
                        case "boxScore":
                            sub_title = LS.get("MT_boxscore");
                            _self.chgMode("boxScore");
                            break;
                        case "boxscore":
                            sub_title = LS.get("MT_boxscore");
                            _self.chgMode("boxscore");
                            break
                        }
                    else
                        switch (mode) {
                        case "pitch":
                            _self.boxSwitch("mt_box");
                            _self.chgMode("widgets.lmts");
                            break;
                        case "statistic":
                            sub_title = LS.get("MT_Statistics");
                            _self.chgMode("widgets.matchstats");
                            break;
                        case "comment":
                            sub_title = LS.get("MT_Commentary");
                            _self.chgMode("widgets.matchcommentary");
                            break;
                        case "team":
                            sub_title = LS.get("MT_LineUps");
                            _self.chgMode("widgets.matchlineups");
                            break;
                        case "htoh":
                            sub_title = LS.get("MT_HeadToHead");
                            _self.chgMode("widgets.matchhead2head");
                            break;
                        case "livetable":
                            if (target_gtype == "TN") {
                                sub_title = LS.get("MT_Ranking");
                                _self.chgMode("widgets.tennisranking")
                            } else {
                                sub_title = LS.get("MT_LeagueTable");
                                _self.chgMode("widgets.livetable")
                            }
                            break
                        }
                }
                ;
                _self.openTimeLine = function(from) {
                    _self.timelineSwitch(!timeClick);
                    if (from != "collapseTV")
                        top.resizeTimeClick = !timeClick;
                    timeClick = !timeClick;
                    echo("openTimeLine\u5b8c\uff0ctimeClick\uff1a" + timeClick + "====top.resizeTimeClick\uff1a" + top.resizeTimeClick)
                }
                ;
                _self.timelineSwitch = function(isShow) {
                    var addClass, removeClass = "";
                    if (isShow) {
                        addClass = "timeline_btn_on";
                        removeClass = "timeline_btn_off";
                        timeLineOpen = true
                    } else {
                        addClass = "timeline_btn_off";
                        removeClass = "timeline_btn_on";
                        timeLineOpen = false
                    }
                    _get("timeline_btn").classList.add(addClass);
                    _get("timeline_btn").classList.remove(removeClass)
                }
                ;
                _self.timelineVisible = function(isShow) {
                    _get("timeline_btn").style.display = isShow ? "" : "none"
                }
                ;
                _self.setTimelineClass = function(act, className) {}
                ;
                _self.setTimelineBtnClass = function(className) {
                    _get("timeline_btn").className = className
                }
                ;
                _self.setMtBoxClass = function(act, className) {
                    if (act == "add")
                        _get("mt_box").classList.add(className);
                    else
                        _get("mt_box").classList.remove(className)
                }
                ;
                _self.collapseTV = function(e, param) {
                    var addClass = "";
                    collapseClick = !collapseClick;
                    top.collapseClick = util.clone(collapseClick);
                    if (collapseClick) {
                        if (!noTV)
                            top.rightNowPlay = "TV";
                        addClass = "on";
                        if (top.rightNowPlay == "TV" && !noTV) {
                            nowBox = "tv_box";
                            _get("tv_btn").classList.add("on");
                            if (_get("mt_btn"))
                                _get("mt_btn").classList.remove("on")
                        }
                        _self.boxSwitch(nowBox);
                        _self.chgMode("lmt_close");
                        if (!onlyTV && nowBox != "tv_box")
                            _self.timelineVisible(true);
                        if (nowBox.indexOf("mt") != -1)
                            _self.setBtnLight("mt_btn");
                        else
                            parentClass.dispatchEvent("openTV", null)
                    } else {
                        addClass = "off";
                        _self.closeAllbox();
                        _self.timelineVisible(false);
                        try {
                            _get("mt_main").contentWindow.postMessage("123|timelineclose|" + target_gtype, "*")
                        } catch (e) {
                            console.log(e)
                        }
                        if (nowBox.indexOf("mt") != -1)
                            _self.chgMode("lmt_close");
                        else
                            parentClass.dispatchEvent("closeTV", null)
                    }
                    _get("collapse_btn").classList.remove("on");
                    _get("collapse_btn").classList.remove("off");
                    _get("collapse_btn").classList.add(addClass)
                }
                ;
                _self.chgCollapseClass = function(act) {
                    if (act) {
                        addClass = "on";
                        removeClass = "off"
                    } else {
                        addClass = "off";
                        removeClass = "on"
                    }
                    _get("collapse_btn").classList.add(addClass);
                    _get("collapse_btn").classList.remove(removeClass)
                }
                ;
                _self.openRelateDiv = function() {
                    var addClass, removeClass = "";
                    if (relateClick) {
                        addClass = "arrow_close";
                        removeClass = "arrow_open"
                    } else {
                        addClass = "arrow_open";
                        removeClass = "arrow_close"
                    }
                    _get("relating_arrow").classList.add(addClass);
                    _get("relating_arrow").classList.remove(removeClass);
                    _get("relating_content").style.display = !relateClick ? "" : "none";
                    relateClick = !relateClick
                }
                ;
                _self.setShowRight = function(show) {
                    if (show)
                        _showRight = true;
                    else
                        _showRight = false
                }
                ;
                _self.onlyTV = function() {
                    for (var i = 0; i < iconAry["ALL"].length; i++)
                        _get(iconAry["ALL"][i]).style.display = "none";
                    _get("tv_btn").style.display = "";
                    util.removeClass(_get("mt_left"), "on");
                    util.removeClass(_get("mt_right"), "on");
                    _self.checkLineups(false);
                    _self.timelineVisible(false);
                    _self.timelineSwitch(false);
                    onlyTV = true;
                    lineups_sw = false;
                    top.rightNowPlay = "TV";
                    _self.setBtnLight("tv_btn");
                    if (nowBox.indexOf("mt") != -1) {
                        _self.boxSwitch("tv_box");
                        _self.chgMode("lmt_close")
                    }
                    if (mt_pop_visible)
                        _self.closeMTsub()
                }
                ;
                function _get(_id) {
                    if (_showRight)
                        _id = "R_" + _id;
                    return dom.getElementById(_id)
                }
                function showError(msg) {
                    console.error(msg);
                    _self.setLoadingTV(false)
                }
                function writeLog(msg) {
                    var _url = "/lib/write_log.php";
                    var param = "";
                    param += "user=" + top["userData"].username;
                    param += "&msg=" + encodeURIComponent(msg);
                    var hr = new HttpRequest;
                    hr.addEventListener("LoadComplete", null);
                    hr.loadURL(_url, "POST", param)
                }
                function checkCasino() {
                    var domain = document.domain;
                    var casino = domain.split(".")[0];
                    if (casino.indexOf("cro666") != -1)
                        return true;
                    return false
                }
                function checkNowIsTest() {
                    var domain = document.domain;
                    if (domain.indexOf("61.14.172.219") != -1)
                        return true;
                    return false
                }
                function showLS(code) {
                    return LS.get(code)
                }
                function receiveMessageFromMyframe(event) {
                    var cmds = event.data.split("|");
                    if (cmdHash[cmds[0]] != null)
                        cmdHash[cmds[0]](cmds[1], cmds[2])
                }
                var HashFunction = function() {
                    var Hash = [];
                    Hash["002"] = function(name, ts) {
                        _self.closeLoading(name, ts)
                    }
                    ;
                    Hash["555"] = function(status, ts) {
                        _self.showNoData(status, ts)
                    }
                    ;
                    return Hash
                };
                _self.showNoData = function(status, ts) {
                    if (!ts) {
                        if (!status && _get("no_pop_data"))
                            _get("no_pop_data").style.display = "none"
                    } else if (ts == subTimestamp)
                        if (status) {
                            sub_NoData = true;
                            _get("no_pop_data").style.display = "";
                            _get("mt_sub").style.height = "0px"
                        }
                }
                ;
                _self.writeLog = function(msg) {
                    writeLog(msg)
                }
                ;
                _self.echo = function(msg) {
                    echo(msg)
                }
                ;
                _self.checkGtype = function(gtype) {
                    return util.in_array(gtype, allow_gtype)
                }
                ;
                _self.clearMT = function() {
                    console.log("<=======\u6e05\u9664MT=======>");
                    GAMEID = "";
                    nowBox = "tv_box";
                    collapseClick = true;
                    timeClick = false;
                    lineups_sw = false;
                    top.collapseClick = true;
                    top.resizeTimeClick = false;
                    top.resizeMTSub = "";
                    _self.timelineSwitch(false);
                    _self.closeMTsub("dontClear");
                    try {
                        _get("mt_main").contentWindow.location.replace("about:blank");
                        _get("mt_sub").contentWindow.location.replace("about:blank")
                    } catch (e) {
                        console.log(e)
                    }
                    return true
                }
                ;
                _self.checkLineups = function(isShow) {
                    if (target_gtype == "FT" && _get("team_btn"))
                        _get("team_btn").style.display = isShow ? "" : "none"
                }
                ;
                _self.mtScroll = function(e) {
                    if (!onlyTV) {
                        var _mt = _get("mt_total");
                        var _scroll = _get("mt_scroll");
                        var _left = _get("mt_left");
                        var _right = _get("mt_right");
                        if (_mt && _scroll) {
                            if (_mt.clientWidth > _scroll.clientWidth) {
                                util.addClass(_right, "on");
                                util.removeClass(_left, "on");
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
                                "total": _mt,
                                "scroll": _scroll,
                                "left": _left,
                                "right": _right
                            })
                        }
                    }
                }
                ;
                _self.isSafari = function() {
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.indexOf("safari") != -1)
                        if (ua.indexOf("chrome") > -1)
                            return false;
                        else
                            return true
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
                _self.collapseTV_resize = function(isOpen) {
                    var addClass = "";
                    collapseClick = top.collapseClick;
                    if (isOpen) {
                        addClass = "on";
                        if (top.rightNowPlay == "TV" && !noTV) {
                            nowBox = "tv_box";
                            _get("tv_btn").classList.add("on")
                        }
                        _self.boxSwitch(nowBox);
                        if (!onlyTV && nowBox != "tv_box")
                            _self.timelineVisible(true);
                        if (nowBox.indexOf("mt") != -1)
                            _self.setBtnLight("mt_btn");
                        else
                            parentClass.dispatchEvent("openTV", null)
                    } else {
                        addClass = "off";
                        _self.closeAllbox();
                        _self.timelineVisible(false);
                        timeClick = top.resizeTimeClick;
                        if (nowBox.indexOf("mt") != -1)
                            _self.chgMode("lmt_close");
                        else
                            parentClass.dispatchEvent("closeTV", null)
                    }
                    _get("collapse_btn").classList.remove("on");
                    _get("collapse_btn").classList.remove("off");
                    _get("collapse_btn").classList.add(addClass);
                    var tmpOrientation = win.Math.abs(win.orientation);
                    if (getView().viewportwidth >= 1024 || tmpOrientation == 90) {
                        if (dom.getElementById("R_watch_live"))
                            dom.getElementById("R_watch_live").style.display = ""
                    } else if (dom.getElementById("watch_live"))
                        dom.getElementById("watch_live").style.display = ""
                }
                ;
                _self.orientation = function() {
                    var tmpOrientation = win.Math.abs(win.orientation);
                    if (getView().viewportwidth >= 1024 || tmpOrientation == 90)
                        _get("mt_sub").contentWindow.postMessage("789|addClass|", "*");
                    else
                        _get("mt_sub").contentWindow.postMessage("789|removeClass|", "*");
                    var isSafari = _self.isSafari();
                    if (isSafari)
                        _self.mtScroll()
                }
                ;
                _self.chkExist = function() {
                    echo("[chkExist]", _get("mt_main"));
                    return _get("mt_main") != null
                }
            }
            ;