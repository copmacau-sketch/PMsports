function rules_general(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util = new win.Util(win,dom);
    var _mc = new Object;
    var rules_array = new Array("pc_general","pc_outright","pc_multiples","pc_soccer","pc_basketball","pc_tennis","pc_volleyball","pc_badminton","pc_table_tennis","pc_baseball","pc_snooker","pc_usa_football","pc_archery","pc_athletic","pc_aussie","pc_beach_soccer","pc_beach_volleyball","pc_boxing","pc_cricket","pc_cycling","pc_darts","pc_e_sports","pc_field_hockey","pc_financial_bets","pc_futsal","pc_golf","pc_gymnastics","pc_handball","pc_ice_hockey","pc_judo","pc_lacrosse","pc_medal_betting","pc_motor_sports","pc_olympics","pc_rowing","pc_rugby_league","pc_softball","pc_tamp","pc_water_polo","pc_weightlifting","pc_wintersports");
    var classname = "rules_general";
    var myhash = {};
    _self.init = function() {
        _mc["body_show"] = document.getElementById("body_show");
        _mc["body_show"].scrollTop = 0;
        util.addEvent(dom.getElementById("back_btn"), "click", _self.toBack);
        if (top.mobile != "Y") {
            _mc["pc_sportsdropdown"] = dom.getElementById("pc_sportsdropdown");
            util.addEvent(dom.getElementById("pc_sportselect"), "click", _self.pcGoToRulerHandler)
        } else {
            _mc["sportsdropdown"] = dom.getElementById("sportsdropdown");
            util.addEvent(_mc["sportsdropdown"], "blur", _self.selectblur);
            util.addEvent(_mc["sportsdropdown"], "change", _self.chgPageHandler)
        }
        try {
            util.addEvent(dom.getElementById("general"), "click", _self.goDiv, "general");
            util.addEvent(dom.getElementById("mainmarkets"), "click", _self.goDiv, "mainmarkets");
            util.addEvent(dom.getElementById("goalmarkets"), "click", _self.goDiv, "goalmarkets");
            util.addEvent(dom.getElementById("playersmarket"), "click", _self.goDiv, "playersmarket");
            util.addEvent(dom.getElementById("specials"), "click", _self.goDiv, "specials");
            util.addEvent(dom.getElementById("corners"), "click", _self.goDiv, "corners");
            util.addEvent(dom.getElementById("bookingscards"), "click", _self.goDiv, "bookingscards");
            util.addEvent(dom.getElementById("freekicks"), "click", _self.goDiv, "freekicks");
            util.addEvent(dom.getElementById("goalkicks"), "click", _self.goDiv, "goalkicks");
            util.addEvent(dom.getElementById("throwins"), "click", _self.goDiv, "throwins");
            util.addEvent(dom.getElementById("substitutions"), "click", _self.goDiv, "substitutions");
            util.addEvent(dom.getElementById("offsides"), "click", _self.goDiv, "offsides");
            util.addEvent(dom.getElementById("penaltymarkets"), "click", _self.goDiv, "penaltymarkets");
            util.addEvent(dom.getElementById("competitions"), "click", _self.goDiv, "competitions");
            util.addEvent(dom.getElementById("combinedmarkets"), "click", _self.goDiv, "combinedmarkets");
            util.addEvent(dom.getElementById("othermarkets"), "click", _self.goDiv, "othermarkets");
            util.addEvent(dom.getElementById("fantasymatches"), "click", _self.goDiv, "fantasymatches");
            util.addEvent(dom.getElementById("efootballmatches"), "click", _self.goDiv, "efootballmatches")
        } catch (e) {}
        if (_mc["body_show"].classList.contains("box_l_height"))
            util.removeClass(_mc["body_show"], "box_l_height");
        _self.loadingClose()
    }
    ;
    _self.pcGoToRulerHandler = function(e) {
        if (_mc["pc_sportsdropdown"].classList.contains("on"))
            util.removeClass(_mc["pc_sportsdropdown"], "on");
        else
            util.addClass(_mc["pc_sportsdropdown"], "on");
        for (var i = 0; i < rules_array.length; i++)
            util.addEvent(dom.getElementById(rules_array[i]), "click", _self.pcChgPageHandler, rules_array[i].substr(3));
        _self.showOption();
        util.pcDropdowns("pc_sportsdropdown", "pc_sportsdropdown")
    }
    ;
    _self.showOption = function() {
        var sel = document.getElementById("pc_sportselect").innerHTML;
        var _options = _mc["pc_sportsdropdown"].children;
        var h = _mc["pc_sportsdropdown"].clientHeight;
        for (var i = 0; i < _options.length; i++) {
            var _option = _options[i];
            if (_option.innerHTML == sel)
                _mc["pc_sportsdropdown"].scrollTop = _option.offsetTop - (h - _option.clientHeight)
        }
    }
    ;
    _self.pcChgPageHandler = function(e, ball_id) {
        _self.chgPage({
            "ball": ball_id
        })
    }
    ;
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
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
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    }
    ;
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname])
            eventHandler[eventname](param)
    }
    ;
    _self.toBack = function() {
        parentClass.dispatchEvent("backPage", {})
    }
    ;
    _self.selectblur = function() {
        parentClass.dispatchEvent("scrollsetTop")
    }
    ;
    _self.chgPageHandler = function(e) {
        parentClass.dispatchEvent("showLoading", {
            "isShow": true
        });
        var myselect = _mc["sportsdropdown"];
        var index = myselect.selectedIndex;
        _self.chgPage({
            "ball": myselect.options[index].value
        })
    }
    ;
    _self.chgPage = function(param) {
        util.addClass(_mc["body_show"], "box_l_height");
        var par = new Object;
        par["page"] = "rules_general";
        par["post"] = "ball=" + param.ball;
        par["noCache"] = "Y";
        parentClass.dispatchEvent("bodyGoToPage", par)
    }
    ;
    _self.goDiv = function(e, param) {
        parentClass.dispatchEvent("scrollsetTop", {});
        switch (param) {
        case "general":
            document.getElementById("General_Rules").scrollIntoView({
                block: "start"
            });
            break;
        case "mainmarkets":
            document.getElementById("MainMarkets").scrollIntoView({
                block: "start"
            });
            break;
        case "goalmarkets":
            document.getElementById("GoalMarkets").scrollIntoView({
                block: "start"
            });
            break;
        case "playersmarket":
            document.getElementById("PlayersMarkets").scrollIntoView({
                block: "start"
            });
            break;
        case "specials":
            document.getElementById("Specials").scrollIntoView({
                block: "start"
            });
            break;
        case "corners":
            document.getElementById("Corners").scrollIntoView({
                block: "start"
            });
            break;
        case "bookingscards":
            document.getElementById("BookingsCards").scrollIntoView({
                block: "start"
            });
            break;
        case "freekicks":
            document.getElementById("FreeKicks").scrollIntoView({
                block: "start"
            });
            break;
        case "goalkicks":
            document.getElementById("GoalKicks").scrollIntoView({
                block: "start"
            });
            break;
        case "throwins":
            document.getElementById("ThrowIns").scrollIntoView({
                block: "start"
            });
            break;
        case "substitutions":
            document.getElementById("Substitutions").scrollIntoView({
                block: "start"
            });
            break;
        case "offsides":
            document.getElementById("Offsides").scrollIntoView({
                block: "start"
            });
            break;
        case "penaltymarkets":
            document.getElementById("PenaltyMarkets").scrollIntoView({
                block: "start"
            });
            break;
        case "competitions":
            document.getElementById("Competitions").scrollIntoView({
                block: "start"
            });
            break;
        case "combinedmarkets":
            document.getElementById("CombinedMarkets").scrollIntoView({
                block: "start"
            });
            break;
        case "othermarkets":
            document.getElementById("OtherMarkets").scrollIntoView({
                block: "start"
            });
            break;
        case "fantasymatches":
            document.getElementById("FantasyMatches").scrollIntoView({
                block: "start"
            });
            break;
        case "efootballmatches":
            document.getElementById("EFootballMatches").scrollIntoView({
                block: "start"
            });
            break
        }
    }
    ;
    _self.loadingClose = function() {
        parentClass.dispatchEvent("showLoading", {
            "isShow": false
        })
    }
}