function league_list_FS(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var classname = "league_list_FS";
    var parentClass;
    var childClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var util_game = new win.Util_game(win, dom);
    var config_set = new win.config_set;
    var LS;
    var timerHash;
    var defaultOpen = 10;
    var openHash = new Object;
    var select_league = new Object;
    var date_min = 1;
    var date_max = 7;
    var league_limit = 8;
    var lastClickTS = postHash["nowTS"];
    var clickTab = postHash["clickTab"];
    var _name = "leagueTimer";
    var showtypeTrans = new Object;
    showtypeTrans["today"] = "ft";
    showtypeTrans["early"] = "fu";
    _self.paramHash = new Object;
    var orien = "";
    var myhash = {};
    _self.init = function () {
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
        _self.addEventListener("retryLoop", _self.retryLoop);
        _self.addEventListener("retryLastfail", _self.retryLastfail);
        _self.addEventListener("retryComplete", _self.retryComplete);
        config_set.init();
        if (showtypeTrans[top.choice_showtype] !=
            undefined && top.specialClick == "") {
            var isback = _self.chkIsBack();
            if (!isback && lastClickTS != 0 && !util.checkTS(top.lastClickTS, lastClickTS, "league_list_FS")) {
                console.log("[league_list_FS][\u4e0d\u7e7c\u7e8c\u57f7\u884c][nowTS]=>", top.lastClickTS, "[tmpTS]=>", lastClickTS);
                return
            }
            _self.getData();
            _self.showGMT();
            _self.createTimer();
            win.addEventListener("orientationchange", _self.orientationchange)
        }
    };
    _self.getThis = function (varible) {
        if (!myhash[varible]) {
            var msg = "no myhash[" + varible + "]";
            util.writeLog(classname,
                msg)
        }
        return myhash[varible]
    };
    _self.chkIsBack = function () {
        var obj = win._history[win._history.length - 1];
        if (!obj.state.back) return false; else return true
    };
    _self.getParentThis = function (varible) {
        return parentClass.getParentThis(varible)
    };
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        timerHash = parentClass.getThis("timerHash");
        headerFrame = parentClass.getThis("headerFrame");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code")
    };
    _self.showAlertMsg = function (param) {
        parentClass.dispatchEvent("showAlertMsg", param)
    };
    _self.bodyGoToPage = function (param) {
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
    _self.createTimer = function () {
        var ret = _self.clearTimer();
        if (ret) {
            if (timerHash[_name] != null) return;
            timerHash[_name] = new Timer(config_set.get("CONFIG_LEAGUE_LIST"));
            timerHash[_name].setParentclass(_self);
            timerHash[_name].init();
            timerHash[_name].addEventListener("TimerEvent.TIMER", _self.getData);
            timerHash[_name].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish);
            timerHash[_name].startTimer()
        }
    };
    _self.startTimer = function () {
        if (timerHash[_name] == null) return;
        timerHash[_name].startTimer()
    };
    _self.clearTimer =
        function () {
            if (timerHash != null) if (timerHash[_name] != null) {
                timerHash[_name].clearObj();
                timerHash[_name].is_clear = true;
                timerHash[_name] = null
            }
            return true
        };
    _self.timerFinish = function (count) {
    };
    _self.getData = function () {
        top.choice_rtype = "fs";
        if (postHash.gtype != top.choice_gtype) {
            console.log(postHash.gtype, "\u7403\u985e\u4e0d\u540c\u6b65 \u4e0d\u8f09\u5165\u8cc7\u6599,", top.choice_gtype, "[top.choice_gtype]");
            return
        }
        if (postHash.gtype != "") var gtype = postHash.gtype.toUpperCase(); else var gtype = top.choice_gtype !=
        "" ? top.choice_gtype.toUpperCase() : postHash["gtype"].toUpperCase();
        top["choice_leagueTab"] = "get_league_list_FS";
        var urlParams = "p=get_league_list_FS";
        urlParams += "&" + top.param;
        urlParams += "&gtype=" + gtype;
        urlParams += "&FS=Y";
        urlParams += "&ts=" + top.lastClickTS;
        if (clickTab == "Y") urlParams += "&clickTab=" + clickTab;
        urlParams += "&showtype=" + showtypeTrans[top.choice_showtype];
        urlParams += "&specialClick=" + top["specialClick"];
        urlParams += "&outrightsClick=" + top.outrightsClick;
        var hrFS = new win.HttpRequestRetry(win.HttpRequest,
            config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), null);
        hrFS.setParentclass(parentClass);
        hrFS.addEventListener("onError", _self.onError);
        hrFS.addEventListener("LoadComplete", _self.LoadLeagueComplete);
        hrFS.loadURL(top.m2_url, "POST", urlParams)
    };
    _self.onError = function (err) {
        console.log(err);
        _self.showNoData(true);
        parentClass.dispatchEvent("showLeagueVisible", {"isShow": false});
        parentClass.dispatchEvent("showLoading", {"isShow": false});
    };
    _self._closeLoadingNoData = function () {
        _self.showNoData(true);
        parentClass.dispatchEvent("showLeagueVisible", {"isShow": false});
        parentClass.dispatchEvent("showLoading", {"isShow": false});
    };
    _self.LoadLeagueComplete = function (xml) {
        orien = xml;
        var tmp_xml;
        if (top.checkBackPage == "checking") {
            top.checkBackPage = "";
            return
        }
        _self.paramHash["errorMsg"] = util.showConnectMsg(xml);
        if (util.alertConnectMsg(_self.paramHash["errorMsg"])) {
            _self._closeLoadingNoData();
            return;
        }
        try {
            tmp_xml = util.parseXml(xml);
        } catch (e) {
            console.log("[league_list_FS][LoadLeagueComplete] parseXml error", e);
            _self._closeLoadingNoData();
            return;
        }
        try {
            var root = tmp_xml.Root && tmp_xml.Root[0];
            if (!root) {
                _self._closeLoadingNoData();
                return;
            }
            var codeNode = tmp_xml.Node(root, "code");
            var tmpCode = (codeNode && codeNode.innerHTML) ? codeNode.innerHTML : "";
            var expectCode = (top["choice_leagueTab"] || "get_league_list_FS").toUpperCase();
            if (tmpCode.toUpperCase() !== expectCode) {
                _self._closeLoadingNoData();
                return;
            }
            var tsNode = tmp_xml.Node(root, "ts");
            var ts = (tsNode && tsNode.innerHTML) ? tsNode.innerHTML : "0";
            var isback = _self.chkIsBack();
            if (!isback && ts != 0 && !util.checkTS(ts, top.lastClickTS, "get_league_list_fs")) {
                console.log("[get_league_list_fs][\u4e0d\u7e7c\u7e8c\u57f7\u884c][nowTS]=>", top.lastClickTS, "[tmpTS]=>", ts);
                _self._closeLoadingNoData();
                return;
            }
            _self.parseLeagueFT(tmp_xml);
            if (top.choice_showtype == "early" && dom.getElementById("nodata_text"))
                dom.getElementById("nodata_text").innerHTML = LS_code.get("alldateno");
            parentClass.dispatchEvent("showLoading");
        } catch (e) {
            console.log("[league_list_FS][LoadLeagueComplete] error", e);
            _self._closeLoadingNoData();
        }
    };
    _self.parseLeagueFT = function (xmlnode) {
        top.isLeagued = true;
        var classifier = xmlnode.Node(xmlnode.Root[0], "classifier");
        var isHeader = headerFrame.headerToSport();
        var headerNoData = false;
        if (isHeader != "N") {
            var game_count = headerFrame.typeCount();
            if (game_count == 0) headerNoData = true
        }
        if (!classifier.innerHTML || headerNoData) _self.showNoData(true); else {
            _self.showClassifier(xmlnode, classifier);
            _self.showNoData(false)
        }
        parentClass.dispatchEvent("showDateOption",
            {"isShow": false});
        parentClass.dispatchEvent("showLeagueVisible", {"isShow": false})
    };
    _self.replaceLayerScreen = function (lid, league) {
        var tmp = "";
        var div_model = dom.getElementById("div_model").innerHTML;
        div_model = div_model.replace("<XMP>", "").replace("</XMP>", "").replace("<xmp>", "").replace("</xmp>", "");
        div_model = div_model.replace(/\*LEAGUE_ID\*/g, "lid_" + util.showTxt(lid));
        div_model = div_model.replace(/\*LEAGUE_NAME\*/g, util.showTxt(league));
        tmp += div_model;
        return tmp
    };
    _self.showClassifier = function (xmlnode,
                                     classifier) {
        if (!classifier.innerHTML) return;
        var region = xmlnode.Node(classifier, "region", false);
        if (region.length > 0) {
            var hasAZ = false;
            var tmpScreen = "";
            var headAry = new Array;
            var leaAry = new Array;
            if (top.langx == "zh-tw" || top.langx == "zh-cn") region = _self.sortRegionByChinese(region);
            for (var i = 0; i < region.length; i++) {
                var obj = region[i];
                var sorttype = obj.getAttribute("sorttype");
                if (!hasAZ && sorttype == "name") {
                    var model_az = dom.getElementById("model_az").innerHTML;
                    tmpScreen += model_az;
                    hasAZ = true
                }
                tmpScreen += _self.parseClassifier(obj,
                    i, headAry, leaAry)
            }
            var classifierDiv = dom.getElementById("div_classifier");
            classifierDiv.innerHTML = util.showTxt(tmpScreen);
            classifierDiv.style.display = "";
            dom.getElementById("select_lea").style.display = "none";
            util.addClass(classifierDiv, "fs_league");
            _self.hideChkBox();
            _self.addHeadClick(headAry);
            _self.addLeagueClick(leaAry)
        }
    };
    _self.sortRegionByChinese = function (sortData) {
        var nameHash = new Array;
        var newSortData = new Array;
        for (var i = 0; i < sortData.length; i++) {
            var obj = sortData[i];
            var name = obj.getAttribute("name");
            var sorttype = obj.getAttribute("sorttype");
            if (sorttype != "name") newSortData.push(obj); else nameHash[i] = name
        }
        nameHash = nameHash.sort(function compareFunction(item1, item2) {
            return item1.localeCompare(item2, "zh-CN-u-co-pinyin")
        });
        for (var j = 0; j < nameHash.length; j++) for (var z = 0; z < sortData.length; z++) {
            var obj = sortData[z];
            var name = obj.getAttribute("name");
            if (nameHash[j] == name) newSortData.push(obj)
        }
        return newSortData
    };
    _self.hideChkBox = function () {
        var objs = dom.getElementsByName("chkbox_league");
        for (var i = 0; i < objs.length; i++) objs[i].style.display =
            "none"
    };
    _self.addHeadClick = function (ary) {
        for (var i = 0; i < ary.length; i++) try {
            var _id = ary[i];
            var obj = dom.getElementById("region_head_" + _id);
            util.addEvent(obj, "click", _self.clickHead, {"id": _id})
        } catch (e) {
        }
    };
    _self.addLeagueClick = function (ary) {
        for (var i = 0; i < ary.length; i++) try {
            var _gtype = top.choice_gtype.toUpperCase();
            var data = ary[i].split("_");
            var _id = data[0];
            var isToday = data[1];
            util.addEvent(dom.getElementById("league_" + _id), "click", _self.intoGameList, {
                "lid": _id,
                "rtype": "fs",
                "isToday": isToday
            })
        } catch (e) {
        }
    };
    _self.clickHead = function (e, param) {
        var rid = param.id;
        openHash[rid] = !openHash[rid];
        dom.getElementById("region_body_" + rid).style.display = openHash[rid] ? "" : "none"
    };
    _self.parseClassifier = function (region, i, headHash, leaAry) {
        var model_region = dom.getElementById("model_region").innerHTML;
        var region_id = region.getAttribute("id");
        var region_name = region.getAttribute("name");
        var region_sort = region.getAttribute("t_sort");
        var flag_class = region.getAttribute("flag_class");
        var leagues = xmlnode.Node(region, "league", false);
        var isOpen = i < defaultOpen;
        headHash.push(region_id);
        if (openHash[region_id] == null) openHash[region_id] = isOpen;
        model_region = model_region.replace(new RegExp("\\*REGION_ID\\*", "gi"), util_game.showTxt(region_id));
        model_region = model_region.replace(new RegExp("\\*REGION_NAME\\*", "gi"), util_game.showTxt(region_name));
        model_region = model_region.replace(new RegExp("\\*DEFAULT_OPEN\\*", "gi"), openHash[region_id] ? "" : "none");
        model_region = model_region.replace(new RegExp("\\*FLAG_CLASS\\*", "gi"), util_game.showTxt(flag_class));
        tmpLeague = "";
        for (var i = 0; i < leagues.length; i++) {
            var league = leagues[i];
            var model_league = dom.getElementById("model_league").innerHTML;
            var isToday = league.getAttribute("isToday");
            var lid = league.getAttribute("id");
            var league_name = league.getAttribute("name");
            leaAry.push(lid + "_" + isToday);
            model_league = model_league.replace(new RegExp("\\*LEAGUE_ID\\*", "gi"), util_game.showTxt(lid));
            model_league = model_league.replace(new RegExp("\\*LEAGUE_NAME\\*", "gi"), util_game.showTxt(league_name));
            tmpLeague += model_league
        }
        model_region =
            model_region.replace(new RegExp("\\*LEAGUE_COUNTENT\\*", "gi"), util_game.showTxt(tmpLeague));
        return model_region
    };
    _self.showGMT = function () {
        var obj = dom.getElementById("div_gmt");
        if (obj) obj.style.display = postHash["showtype"] == "today" ? "" : "none"
    };
    _self.showNoData = function (isShow) {
        if (isShow) {
            dom.getElementById("div_nodata").style.display = "";
            dom.getElementById("div_hasdata").style.display = "none";
            dom.getElementById("div_classifier").innerHTML = "";
            dom.getElementById("div_coupon").innerHTML = ""
        } else {
            dom.getElementById("div_nodata").style.display =
                "none";
            dom.getElementById("div_hasdata").style.display = ""
        }
    };
    _self.intoGameList = function (mouseEvent, _par) {
        echo(_par);
        var showtype = top.choice_showtype;
        var postHash = new Object;
        postHash["gtype"] = top.choice_gtype;
        postHash["showtype"] = showtype;
        postHash["rtype"] = _par.rtype;
        postHash["lid"] = _par.lid;
        postHash["isToday"] = _par.isToday;
        postHash["specialClick"] = top.specialClick;
        postHash["outrightsClick"] = top.outrightsClick;
        var param = new Object;
        param["page"] = "game_list_" + top.choice_gtype.toUpperCase();
        param["extendsClass"] =
            "game_list";
        param["post"] = "gtype=" + top.choice_gtype + "&showtype=" + showtype + "&lid=" + _par.lid + "&rtype=fs";
        param["postHash"] = postHash;
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.orientationchange = function () {
        var orientation = win.Math.abs(win.orientation)
    };
    _self.exitEvent = function () {
        win.removeEventListener("orientationchange", _self.orientationchange);
        return true
    }
};