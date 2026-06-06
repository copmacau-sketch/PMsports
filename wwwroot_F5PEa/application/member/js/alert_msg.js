function alert_msg(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "alert_msg";
    var util;
    var divBoxAll = new Array("alert_ok", "C_alert_ok", "alert_confirm", "C_alert_confirm", "info_pop", "R_info_pop", "alert_kick");
    var divBoxOther = new Array("C_alert_ok", "C_alert_confirm", "alert_kick");
    var divBox2 = new Array("message_pop", "message_pop_nobtn", "message_pop_bef");
    var _mc;
    var popTimer = new Object;
    var poptimer_sec = 2E3;
    var mainStatement_sw = false;
    var alert_confirm_sw = false;
    var alert_ok_sw =
        false;
    var BetFantasy_sw = false;
    var FantasyTeamAry = new Array("teamA", "teamB", "teamC", "teamD");
    var myhash = {};
    _self.init = function () {
        obj_ids = ",ok_btn,C_ok_btn,no_btn,yes_btn,C_no_btn,C_yes_btn,message_ok,message_ok_bef,kick_ok_btn,";
        obj_ids += "alert_ok,msg_ok,";
        obj_ids += "C_alert_ok,C_msg_ok,";
        obj_ids += "alert_confirm,msg_confirm,";
        obj_ids += "C_alert_confirm,C_msg_confirm,";
        obj_ids += "message_pop,message_title,message_pop_nobtn,message_title_nobtn,";
        obj_ids += "message_pop_bef,message_title_bef,";
        obj_ids += "alert_kick,";
        obj_ids += "R_info_pop,R_info_title,R_info_close,R_info_msg,R_close_alert_msg,";
        obj_ids += "info_pop,info_title,info_close,info_msg,close_alert_msg,L_close_alert_msg,";
        obj_ids += "msg_popup,msg_toast,";
        obj_ids += "fantasty_info,game1_Leg,teamA,teamB,game1_datetime,game2_Leg,teamC,teamD,game2_datetime,";
        obj_ids += "bet_info_pop,bet_info_title,bet_info_msg,bet_info_close,";
        obj_ids += "R_fantasty_info,R_game1_Leg,R_teamA,R_teamB,R_game1_datetime,R_game2_Leg,R_teamC,R_teamD,R_game2_datetime,";
        _mc = util.getObjAry(dom.getElementById("alert_show"),
            obj_ids)
    };
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util")
    };
    _self.getThis = function (varible) {
        if (!myhash[varible]) {
            var msg = "no myhash[" + varible + "]";
            util.writeLog(classname, msg)
        }
        return myhash[varible]
    };
    _self.showMsg = function (param) {
        var sb = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var width1024 = false;
        try {
            width1024 = getView().viewportwidth >= 1024 ? true : false;
            if (!width1024) parentClass.dispatchEvent("chkscroll", {
                "px": sb,
                "target": param.target
            })
        } catch (e) {
        }
        if (param._id != null) {
            if (_mc[param._id] != null) if (param._id == "R_info_pop") {
                _mc[param._id].classList.add("on");
                _mc["msg_popup"].classList.add("on");
                _mc["R_info_title"].innerHTML = util.showTxt(param.title);
                _mc["R_info_msg"].innerHTML = util.showTxt(param.msg);
                util.removeClass(dom.getElementById("bet_show"), "_no_animation")
            } else if (param._id == "bet_info_pop") {
                if (!width1024) parentClass.dispatchEvent("addbodylock");
                _mc[param._id].classList.add("on");
                _mc["msg_popup"].classList.add("on");
                _mc["bet_info_title"].innerHTML = util.showTxt(param.title);
                _mc["bet_info_msg"].innerHTML = util.showTxt(param.msg);
                if (param.isfantasy == "Y") {
                    for (key in FantasyTeamAry) if (_mc["R_" + FantasyTeamAry[key]].classList.contains("text_bold")) _mc["R_" + FantasyTeamAry[key]].classList.remove("text_bold");
                    _mc["R_fantasty_info"].style.display = "";
                    _mc["R_game1_Leg"].innerHTML = util.showTxt(param.fantasy_data.game1_Leg);
                    _mc["R_teamA"].innerHTML = util.showTxt(param.fantasy_data.teamA);
                    _mc["R_teamB"].innerHTML = util.showTxt(param.fantasy_data.teamB);
                    _mc["R_game1_datetime"].innerHTML = util.showTxt(param.fantasy_data.game1_datetime);
                    _mc["R_game2_Leg"].innerHTML = util.showTxt(param.fantasy_data.game2_Leg);
                    _mc["R_teamC"].innerHTML = util.showTxt(param.fantasy_data.teamC);
                    _mc["R_teamD"].innerHTML = util.showTxt(param.fantasy_data.teamD);
                    _mc["R_game2_datetime"].innerHTML = util.showTxt(param.fantasy_data.game2_datetime);
                    if (_mc["R_" + param.fantasy_data.fantasy_teamh]) _mc["R_" + param.fantasy_data.fantasy_teamh].classList.add("text_bold");
                    if (_mc["R_" + param.fantasy_data.fantasy_teamc]) _mc["R_" +
                    param.fantasy_data.fantasy_teamc].classList.add("text_bold")
                } else _mc["R_fantasty_info"].style.display = "none"
            } else {
                dom.getElementById("icon_info_msg").style.display = "none";
                parentClass.dispatchEvent("addbodylock");
                _mc[param._id].classList.add("on");
                _mc["msg_popup"].classList.add("on");
                _mc["info_title"].innerHTML = util.showTxt(param.title);
                _mc["info_msg"].innerHTML = util.showTxt(param.msg);
                if (param.isfantasy == "Y") {
                    for (key in FantasyTeamAry) if (_mc[FantasyTeamAry[key]].classList.contains("text_bold")) _mc[FantasyTeamAry[key]].classList.remove("text_bold");
                    _mc["fantasty_info"].style.display = "";
                    dom.getElementById("icon_info_msg").style.display = "";
                    _mc["game1_Leg"].innerHTML = util.showTxt(param.fantasy_data.game1_Leg);
                    _mc["teamA"].innerHTML = util.showTxt(param.fantasy_data.teamA);
                    _mc["teamB"].innerHTML = util.showTxt(param.fantasy_data.teamB);
                    _mc["game1_datetime"].innerHTML = util.showTxt(param.fantasy_data.game1_datetime);
                    _mc["game2_Leg"].innerHTML = util.showTxt(param.fantasy_data.game2_Leg);
                    _mc["teamC"].innerHTML = util.showTxt(param.fantasy_data.teamC);
                    _mc["teamD"].innerHTML =
                        util.showTxt(param.fantasy_data.teamD);
                    _mc["game2_datetime"].innerHTML = util.showTxt(param.fantasy_data.game2_datetime);
                    _mc[param.fantasy_data.fantasy_teamh].classList.add("text_bold");
                    _mc[param.fantasy_data.fantasy_teamc].classList.add("text_bold")
                } else _mc["fantasty_info"].style.display = "none"
            }
        } else {
            parentClass.dispatchEvent("addbodylock");
            if (param.confirm == "Y") {
                _mc["msg_popup"].classList.add("on");
                if (param.target == "C_alert_confirm") {
                    if (_mc["alert_confirm"].classList.contains("on")) _mc["alert_confirm"].classList.remove("on");
                    _mc["C_alert_confirm"].classList.add("on");
                    _mc["C_msg_confirm"].innerHTML = util.showTxt(param.msg)
                } else {
                    if (_mc["C_alert_confirm"].classList.contains("on")) _mc["C_alert_confirm"].classList.remove("on");
                    _mc["alert_confirm"].classList.add("on");
                    _mc["msg_confirm"].innerHTML = util.showTxt(param.msg)
                }
            } else if (param.target == "message_pop") {
                _mc["message_title"].innerHTML = "";
                _mc["msg_toast"].classList.add("on");
                _mc["message_pop"].classList.add("on");
                _mc["message_title"].innerHTML = util.showTxt(param.msg);
                parentClass.dispatchEvent("removebodylock",
                    {})
            } else if (param.target == "message_pop_nobtn") {
                _mc["message_title_nobtn"].innerHTML = "";
                _mc["msg_toast"].classList.add("on");
                _mc["message_pop_nobtn"].classList.add("on");
                _mc["message_title_nobtn"].innerHTML = util.showTxt(param.msg);
                parentClass.dispatchEvent("removebodylock", {})
            } else if (param.target == "message_pop_bef") {
                _mc["message_title_bef"].innerHTML = "";
                _mc["msg_toast"].classList.add("on");
                _mc["message_pop_bef"].classList.add("on");
                _mc["message_title_bef"].innerHTML = util.showTxt(param.msg);
                parentClass.dispatchEvent("removebodylock",
                    {})
            } else if (param.target == "alert_kick") {
                _mc["msg_popup"].classList.add("on");
                _mc["alert_kick"].classList.add("on")
            } else {
                _mc["msg_popup"].classList.add("on");
                if (param.target == "C_alert_ok") {
                    if (_mc["alert_ok"].classList.contains("on")) _mc["alert_ok"].classList.remove("on");
                    _mc["C_alert_ok"].classList.add("on");
                    _mc["C_msg_ok"].innerHTML = util.showTxt(param.msg)
                } else {
                    _mc["alert_ok"].classList.add("on");
                    _mc["msg_ok"].innerHTML = util.showTxt(param.msg)
                }
            }
        }
        _self.addEvent(param, sb)
    };
    _self.initAlert = function (param) {
        var divBox =
            "";
        if (param != "pop") {
            if (!mainStatement_sw) setTimeout(function () {
                _mc["info_msg"].innerHTML = "";
                _mc["info_title"].innerHTML = ""
            }, 300);
            if (param == "noPopAllClear") divBox = divBoxAll; else divBox = divBoxOther;
            for (key in divBox) if (_mc[divBox[key]].classList.contains("on")) _mc[divBox[key]].classList.remove("on");
            if (!top["RequestRetry"] && !alert_confirm_sw) _mc["msg_confirm"].innerHTML = "";
            if (!alert_ok_sw) _mc["msg_ok"].innerHTML = "";
            _mc["C_msg_ok"].innerHTML = ""
        } else for (key in divBox2) if (_mc[divBox2[key]].classList.contains("on")) _mc[divBox2[key]].classList.remove("on")
    };
    _self.clearMsg = function (param) {
        if (param.use == "nopop") {
            if (param.id == "info_pop") util.removeEvent(_mc["L_close_alert_msg"], "click");
            if (param.id == "R_info_pop") util.removeEvent(_mc["R_close_alert_msg"], "click")
        }
        var msgSw = "N";
        var bodyShow = dom.getElementById("body_show");
        if (param.use == "noPopMainClear" && (mainStatement_sw || alert_confirm_sw || alert_ok_sw)) {
            if (bodyShow.classList.contains("scroll_lock")) bodyShow.classList.remove("scroll_lock");
            if (mainStatement_sw) {
                mainStatement_sw = false;
                _mc["info_pop"].classList.remove("on");
                msgSw = "Y"
            } else if (alert_confirm_sw) {
                alert_confirm_sw = false;
                _mc["alert_confirm"].classList.remove("on");
                msgSw = "Y"
            } else if (alert_ok_sw) {
                alert_ok_sw = false;
                _mc["alert_ok"].classList.remove("on");
                msgSw = "Y"
            }
        } else if (param.use == "noPopAllClear") {
            if (bodyShow.classList.contains("scroll_lock")) bodyShow.classList.remove("scroll_lock");
            if (mainStatement_sw) {
                mainStatement_sw = false;
                _mc["info_pop"].classList.remove("on")
            } else if (alert_confirm_sw) {
                alert_confirm_sw = false;
                _mc["alert_confirm"].classList.remove("on")
            } else if (alert_ok_sw) {
                alert_ok_sw =
                    false;
                _mc["alert_ok"].classList.remove("on")
            }
            msgSw = "Y"
        } else if (param.use == "bet_nopop") if (BetFantasy_sw) {
            BetFantasy_sw = false;
            _mc["bet_info_pop"].classList.remove("on")
        }
        if (param.use == "pop" || param.use == "nopop" || msgSw == "Y") {
            _self.initAlert(param.use);
            _self.removeEvent(param.use)
        }
    };
    _self.clickEvent = function (e, param) {
        if (param.usr != "pop") {
            if (!top["RequestRetry"]) {
                if (param.id == "info_pop") {
                    mainStatement_sw = false;
                    _mc["info_pop"].classList.remove("on")
                } else if (param.id == "bet_info_pop") {
                    BetFantasy_sw = false;
                    _mc["bet_info_pop"].classList.remove("on")
                } else if (param.id ==
                    "alert_confirm") {
                    alert_confirm_sw = false;
                    _mc["alert_confirm"].classList.remove("on")
                } else if (param.id == "alert_ok") {
                    alert_ok_sw = false;
                    _mc["alert_ok"].classList.remove("on")
                }
                if (!mainStatement_sw && !alert_confirm_sw && !alert_ok_sw && !BetFantasy_sw) _mc["msg_popup"].classList.remove("on")
            }
            parentClass.dispatchEvent("hideAlertMsg", {"use": "nopop", "id": param.id});
            if (param.retFun) param.retFun(param.type)
        } else {
            _self.setPopTimer(param.target);
            parentClass.dispatchEvent("hideAlertMsg", {"use": "pop", "id": param.id});
            if (param.retFun) param.retFun(param.type)
        }
        if(param.hasOwnProperty("msgid") && param.msgid>0){
            var par = "p=set_message&id="+param.msgid+"&"+top.param
            var getHTML = new HttpRequest();
            getHTML.addEventListener("LoadComplete", function(){});
            getHTML.loadURL(top.m2_url, "POST", par);
        }
        parentClass.dispatchEvent("removebodylock", {"px": param.px, "type": param.type})
    };
    _self.addEvent = function (param, px) {
        if (param._id != null) if (param._id == "bet_info_pop") {
            BetFantasy_sw = true;
            util.addEvent(_mc["bet_info_close"], "click", _self.clickEvent, {
                "id": "bet_info_pop",
                "type": "close",
                "retFun": param.retFun,
                "px": px
            })
        } else {
            mainStatement_sw = true;
            util.addEvent(_mc["info_close"], "click", _self.clickEvent, {
                "id": "info_pop",
                "type": "close",
                "retFun": param.retFun,
                "px": px
            });
            util.addEvent(_mc["L_close_alert_msg"],
                "click", _self.clickEvent, {"id": "info_pop", "type": "close", "retFun": param.retFun, "px": px})
        } else if (param.confirm == "Y") if (param.target == "C_alert_confirm") {
            util.addEvent(_mc["C_no_btn"], "click", _self.clickEvent, {
                "id": "C_alert_confirm",
                "type": "no",
                "retFun": param.retFun,
                "px": px
            });
            util.addEvent(_mc["C_yes_btn"], "click", _self.clickEvent, {
                "id": "C_alert_confirm",
                "type": "yes",
                "retFun": param.retFun,
                "px": px
            })
        } else {
            alert_confirm_sw = true;
            util.addEvent(_mc["no_btn"], "click", _self.clickEvent, {
                "id": "alert_confirm",
                "type": "no", "retFun": param.retFun, "px": px
            });
            util.addEvent(_mc["yes_btn"], "click", _self.clickEvent, {
                "id": "alert_confirm",
                "type": "yes",
                "retFun": param.retFun,
                "px": px
            })
        } else if (param.target == "message_pop") {
            util.addEvent(_mc["message_ok"], "click", _self.clickEvent, {
                "id": "message_pop",
                "type": "ok",
                "retFun": param.retFun,
                "usr": "pop",
                "px": px,
                "target": param.target
            });
            _self.removeclass(param.target)
        } else if (param.target == "message_pop_nobtn") _self.removeclass(param.target); else if (param.target == "message_pop_bef") {
            util.addEvent(_mc["message_ok_bef"],
                "click", _self.clickEvent, {
                    "id": "message_pop_bef",
                    "type": "ok",
                    "retFun": param.retFun,
                    "usr": "pop",
                    "px": px,
                    "target": param.target
                });
            _self.removeclass(param.target)
        } else if (param.target == "alert_kick") util.addEvent(_mc["kick_ok_btn"], "click", _self.clickEvent, {
            "id": "alert_kick",
            "type": "ok",
            "retFun": param.retFun,
            "px": px
        }); else if (param.target == "C_alert_ok"){
            var msgid = 0;
            if(param.hasOwnProperty("msgid")){
                msgid = param.msgid;
            }
            util.addEvent(_mc["C_ok_btn"], "click", _self.clickEvent, {
                "id": "C_alert_ok",
                "type": "ok",
                "retFun": param.retFun,
                "px": px,
                "msgid": msgid
            });
        } else {
            alert_ok_sw = true;
            util.addEvent(_mc["ok_btn"],
                "click", _self.clickEvent, {"id": "alert_ok", "type": "ok", "retFun": param.retFun, "px": px})
        }
    };
    _self.removeclass = function (target) {
        _self.closetime(target);
        popTimer[target] = setTimeout(_self.setPopTimer, poptimer_sec, target)
    };
    _self.setPopTimer = function (target) {
        dom.getElementById(target).classList.remove("on");
        dom.getElementById("msg_toast").classList.remove("on");
        parentClass.dispatchEvent("removebodylock", {})
    };
    _self.closetime = function (_name) {
        clearTimeout(popTimer[_name])
    };
    _self.removeEvent = function (param) {
        if (param !=
            "pop") {
            if (!top["RequestRetry"]) {
                if (!alert_confirm_sw) util.removeEvent(_mc["no_btn"], "click");
                if (!alert_confirm_sw) util.removeEvent(_mc["yes_btn"], "click");
                util.removeEvent(_mc["C_no_btn"], "click");
                util.removeEvent(_mc["C_yes_btn"], "click")
            }
            if (!alert_ok_sw) util.removeEvent(_mc["ok_btn"], "click");
            util.removeEvent(_mc["C_ok_btn"], "click");
            if (!mainStatement_sw) util.removeEvent(_mc["info_close"], "click");
            util.removeEvent(_mc["kick_ok_btn"], "click")
        } else {
            util.removeEvent(_mc["message_ok"], "click");
            util.removeEvent(_mc["message_ok_bef"],
                "click")
        }
    }
};