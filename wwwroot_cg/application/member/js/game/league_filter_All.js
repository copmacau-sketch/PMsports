function league_filter_All(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var classname = "league_filter_All";
    var parentClass;
    var childClass;
    var eventHandler = new Object;
    var util = new win.Util(win,dom);
    var util_game = new win.Util_game(win,dom);
    var config_set = new win.config_set;
    var CookieManager = new win.CookieManager;
    var _mid = top["userData"].mid;
    var LS;
    var LS_game;
    var timerHash;
    var timer = null;
    var defaultOpen;
    var openHash = new Object;
    var leagueHash = new Object;
    var league_limit;
    var tmp_choice_league = new Object;
    var osoky = new Array;
    var myhash = {};
    _self.init = function() {
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
        _self.addEventListener("retryLoop", _self.retryLoop);
        _self.addEventListener("retryLastfail", _self.retryLastfail);
        _self.addEventListener("retryComplete", _self.retryComplete);
        config_set.init();
        defaultOpen = config_set.get("CLASSIFIER_DEFAULT_OPEN") || 10;
        league_limit = config_set.get("CLASSIFIER_LEAGUE_LIMIT") || 8;
        _self.getData();
        _self.createTimer();
        _self.initheader();
        util.addEvent(dom.getElementById("select_lea"), "click", _self.submitEvent, null);
        util.addEvent(dom.getElementById("btn_more_event"), "click", _self.moreEvent, null);
        util.addEvent(dom.getElementById("back_btn"), "click", _self.backClick)
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
    _self.getParentThis = function(varible) {
        return parentClass.getParentThis(varible)
    }
    ;
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname])
            eventHandler[eventname](param)
    }
    ;
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    }
    ;
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        timerHash = parentClass.getThis("timerHash");
        LS = parentClass.getThis("LS")
    }
    ;
    _self.showAlertMsg = function(param) {
        parentClass.dispatchEvent("showAlertMsg", param)
    }
    ;
    _self.bodyGoToPage = function(param) {
        parentClass.dispatchEvent("bodyGoToPage", param)
    }
    ;
    _self.retryLoop = function(param) {
        parentClass.dispatchEvent("retryLoop", param)
    }
    ;
    _self.retryLastfail = function() {
        parentClass.dispatchEvent("retryLastfail")
    }
    ;
    _self.retryComplete = function() {
        parentClass.dispatchEvent("retryComplete")
    }
    ;
    _self.createTimer = function() {
        var ret = _self.clearTimer();
        if (ret) {
            if (timer != null)
                return;
            timer = new Timer(config_set.get("CONFIG_LEAGUE_LIST"));
            timer.setParentclass(_self);
            timer.init();
            timer.addEventListener("TimerEvent.TIMER", _self.getData);
            timer.addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish);
            timer.startTimer();
            timerHash["leagueTimer"] = timer
        }
    }
    ;
    _self.startTimer = function() {
        if (timer == null)
            return;
        timer.startTimer()
    }
    ;
    _self.clearTimer = function() {
        if (timerHash != null)
            if (timer != null) {
                timer.clearObj();
                timer.is_clear = true;
                timer = null
            }
        return true
    }
    ;
    _self.timerFinish = function(count) {}
    ;
    _self.getData = function() {
        var urlParams = "p=get_league_list_All";
        urlParams += "&" + top.param;
        urlParams += "&gtype=" + top.choice_gtype.toUpperCase();
        urlParams += "&FS=N";
        urlParams += "&showtype=rb";
        urlParams += "&date=all";
        urlParams += "&nocp=Y";
        hr = new win.HttpRequestRetry(win.HttpRequest,config_set.get("RETRY_TIME"),config_set.get("RETRY_LIMIT"),null);
        hr.setParentclass(parentClass);
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.getDataComplete);
        hr.loadURL(top.m2_url, "POST", urlParams)
    }
    ;
    _self.getDataComplete = function(xml) {
        var errorMsg = util.showConnectMsg(xml);
        if (util.alertConnectMsg(errorMsg))
            return;
        var xmlnode = util.parseXml(xml);
        var classifier = xmlnode.Node(xmlnode.Root[0], "classifier");
        if (!classifier.innerHTML)
            _self.showNoData(true);
        else {
            _self.showClassifier(xmlnode, classifier);
            _self.showNoData(false)
        }
        var all_choice = CookieManager.get("all_choice_league");
        if (all_choice != null && all_choice != "") {
            all_choice = all_choice.split(",");
            for (var i = 0; i < all_choice.length; i++)
                dom.getElementById("chkbox_" + all_choice[i]).checked = true
        }
        parentClass.dispatchEvent("showLoading", {
            "isShow": false
        })
    }
    ;
    _self.onError = function() {}
    ;
    _self.showNoData = function(isShow) {
        if (isShow) {
            dom.getElementById("div_nodata").style.display = "";
            dom.getElementById("div_hasdata").style.display = "none";
            dom.getElementById("div_classifier").innerHTML = ""
        } else {
            dom.getElementById("div_nodata").style.display = "none";
            dom.getElementById("div_hasdata").style.display = ""
        }
    }
    ;
    _self.showClassifier = function(xmlnode, classifier) {
        if (!classifier.innerHTML)
            return;
        var region = xmlnode.Node(classifier, "region", false);
        if (region.length > 0) {
            var hasAZ = false;
            var tmpScreen = "";
            var headAry = new Array;
            var leaAry = new Array;
            if (top.langx == "zh-tw" || top.langx == "zh-cn")
                region = _self.sortRegionByChinese(region);
            for (var i = 0; i < region.length; i++) {
                var obj = region[i];
                var name = obj.getAttribute("name");
                var sorttype = obj.getAttribute("sorttype");
                if (!hasAZ && sorttype == "name") {
                    var model_az = dom.getElementById("model_az").innerHTML;
                    tmpScreen += model_az;
                    hasAZ = true
                }
                tmpScreen += _self.parseClassifier(obj, i, headAry, leaAry)
            }
            dom.getElementById("div_classifier").innerHTML = tmpScreen;
            dom.getElementById("div_classifier").style.display = "";
            _self.addHeadClick(headAry);
            _self.addLeagueClick(leaAry)
        }
    }
    ;
    _self.sortRegionByChinese = function(sortData) {
        var nameHash = new Array;
        var newSortData = new Array;
        for (var i = 0; i < sortData.length; i++) {
            var obj = sortData[i];
            var name = obj.getAttribute("name");
            var sorttype = obj.getAttribute("sorttype");
            if (sorttype != "name")
                newSortData.push(obj);
            else
                nameHash[i] = name
        }
        nameHash = nameHash.sort(function compareFunction(item1, item2) {
            return item1.localeCompare(item2, "zh-CN-u-co-pinyin")
        });
        for (var j = 0; j < nameHash.length; j++)
            for (var z = 0; z < sortData.length; z++) {
                var obj = sortData[z];
                var name = obj.getAttribute("name");
                if (nameHash[j] == name)
                    newSortData.push(obj)
            }
        return newSortData
    }
    ;
    _self.parseClassifier = function(region, i, headHash, leaAry) {
        var model_region = dom.getElementById("model_region").innerHTML;
        var region_id = region.getAttribute("id");
        var region_name = region.getAttribute("name");
        var region_sort = region.getAttribute("t_sort");
        var flag_class = region.getAttribute("flag_class");
        var leagues = xmlnode.Node(region, "league", false);
        var isOpen = i < defaultOpen;
        headHash.push(region_id);
        if (openHash[region_id] == null)
            openHash[region_id] = isOpen;
        model_region = model_region.replace(new RegExp("\\*REGION_ID\\*","gi"), util_game.showTxt(region_id));
        model_region = model_region.replace(new RegExp("\\*REGION_NAME\\*","gi"), util_game.showTxt(region_name));
        model_region = model_region.replace(new RegExp("\\*DEFAULT_OPEN\\*","gi"), openHash[region_id] ? "" : "none");
        model_region = model_region.replace(new RegExp("\\*FLAG_CLASS\\*","gi"), util_game.showTxt(flag_class));
        tmpLeague = "";
        for (var i = 0; i < leagues.length; i++) {
            var league = leagues[i];
            var model_league = dom.getElementById("model_league").innerHTML;
            var lid = league.getAttribute("id");
            var league_name = league.getAttribute("name");
            leaAry.push(lid);
            leagueHash[lid] = new Object;
            leagueHash[lid]["id"] = lid;
            leagueHash[lid]["name"] = league_name;
            model_league = model_league.replace(new RegExp("\\*LEAGUE_ID\\*","gi"), util_game.showTxt(lid));
            model_league = model_league.replace(new RegExp("\\*LEAGUE_NAME\\*","gi"), util_game.showTxt(league_name));
            tmpLeague += model_league
        }
        model_region = model_region.replace(new RegExp("\\*LEAGUE_COUNTENT\\*","gi"), util_game.showTxt(tmpLeague));
        return model_region
    }
    ;
    _self.setChkBoxStatus = function(leagueHash) {
        var existLid = "";
        for (var lid in tmp_choice_league) {
            var obj = dom.getElementById("chkbox_" + lid);
            if (util.countSize(leagueHash) > 1)
                if (leagueHash[lid] != null)
                    tmp_choice_league[lid] = leagueHash[lid]["name"];
            if (obj) {
                obj.checked = true;
                existLid += lid + ","
            } else {
                delete tmp_choice_league[lid];
                delete top.choice_league[lid]
            }
        }
        existLid = existLid.substring(0, existLid.length - 1);
        CookieManager.set("choice_lea_" + _mid, existLid);
        _self.chkShowSubmit(tmp_choice_league)
    }
    ;
    _self.chkShowSubmit = function(obj) {
        var len = util.countSize(obj);
        dom.getElementById("select_lea").style.display = len > 0 ? "" : "none";
        if (dom.getElementById("select_lea").style.display != "none")
            dom.getElementById("message_pop_nobtn").classList.add("high_set")
    }
    ;
    _self.addHeadClick = function(ary) {
        for (var i = 0; i < ary.length; i++)
            try {
                var _id = ary[i];
                var obj = dom.getElementById("region_head_" + _id);
                util.addEvent(obj, "click", _self.clickHead, {
                    "id": _id
                })
            } catch (e) {}
    }
    ;
    _self.addLeagueClick = function(ary) {
        for (var i = 0; i < ary.length; i++)
            try {
                var _id = ary[i];
                util.addEvent(dom.getElementById("league_" + _id), "click", _self.clickLeague, {
                    "lid": _id
                })
            } catch (e) {}
    }
    ;
    _self.clickHead = function(e, param) {
        var rid = param.id;
        openHash[rid] = !openHash[rid];
        dom.getElementById("region_body_" + rid).style.display = openHash[rid] ? "" : "none"
    }
    ;
    _self.submitEvent = function(e, param) {
        top.choice_league = tmp_choice_league;
        var lids = "";
        var lname = "";
        for (var lid in top.choice_league) {
            lids += lid + ",";
            lname += top.choice_league[lid] + ","
        }
        lids = lids.substring(0, lids.length - 1);
        _self.intoGameList(lids, lname);
        dom.getElementById("select_lea").style.display = "none";
        dom.getElementById("message_pop_nobtn").classList.remove("high_set")
    }
    ;
    _self.clickLeague = function(e, param) {
        var lid = leagueHash[param.lid]["id"];
        var lname = leagueHash[param.lid]["name"];
        var obj = e.target;
        if (obj.id != "chkbox_" + lid) {
            _self.intoGameList(lid, lname);
            e.stopPropagation()
        } else {
            if (obj.checked)
                if (util.countSize(tmp_choice_league) > league_limit - 1) {
                    obj.checked = false;
                    parentClass.dispatchEvent("showAlertMsg", {
                        "target": "message_pop_nobtn",
                        "msg": LS.get("league_limit"),
                        "confirm": "N",
                        "retFun": ""
                    })
                } else {
                    tmp_choice_league[lid] = lname;
                    osoky.push(lid)
                }
            else {
                delete tmp_choice_league[lid];
                var deletetmp_choice = osoky.indexOf(lid);
                osoky.splice(deletetmp_choice, 1)
            }
            CookieManager.set("all_choice_league", osoky);
            _self.chkShowSubmit(tmp_choice_league)
        }
    }
    ;
    _self.moreEvent = function(e, param) {
        util.clearObject(top.choice_league);
        _self.intoGameList("")
    }
    ;
    _self.intoGameList = function(lid, _lname) {
        var postHash = new Object;
        postHash["gtype"] = top.choice_gtype;
        postHash["showtype"] = top.choice_showtype;
        postHash["rtype"] = top.choice_rtype;
        postHash["lid"] = lid;
        postHash["p3type"] = "";
        postHash["date"] = "";
        if (_lname != null)
            postHash["headername"] = _lname;
        var param = new Object;
        var choiceGtype = top.choice_gtype.toUpperCase();
        param["page"] = "game_list_" + choiceGtype;
        param["extendsClass"] = "game_list";
        param["post"] = "gtype=" + top.choice_gtype + "&showtype=" + top.choice_showtype + "&rtype=" + top.choice_rtype + "&lid=" + lid + "&p3type=&date=";
        param["postHash"] = postHash;
        parentClass.dispatchEvent("bodyGoToPage", param)
    }
    ;
    _self.backClick = function(e) {
        parentClass.dispatchEvent("backPage", {})
    }
    ;
    _self.exitEvent = function() {
        dom.getElementById("select_lea").style.display = "none";
        dom.getElementById("message_pop_nobtn").classList.remove("high_set");
        return true
    }
    ;
    _self.initheader = function() {
        var _namePar = new Object;
        _namePar.gtype = top.choice_gtype;
        _namePar.showtype = top.choice_showtype;
        _self.setTitle(_namePar)
    }
    ;
    _self.setTitle = function(_par) {
        dom.getElementById("head_league").className = "head_league " + _par.gtype;
        dom.getElementById("showtype_now").innerHTML = util_game.showTxt(LS.get("showtype_" + _par.showtype));
        dom.getElementById("gtype_now").innerHTML = util_game.showTxt(LS.get("gtype_" + _par.gtype))
    }
}
;