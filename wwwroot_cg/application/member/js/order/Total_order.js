function Total_order(_win, _dom) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var parentClass;
                var CookieManager;
                var LS, LS_code, LS_game;
                var classname = "Total_order";
                var util = new win.Util(win,dom);
                var util_game = new win.Util_game(win,dom);
                var _mc = new Object;
                var betFrame;
                var timerHash;
                var config_set;
                var _mc = new Object;
                var num_show = true;
                var set_show = true;
                var errorCode = new Object;
                var errP3Ary = new Array;
                var errP3ChgAry = new Object;
                var errorAry = new Array;
                var p3hasErr = false;
                var p3Error = "";
                var _limit;
                var tmpDiv = new Object;
                var isFirst;
                var keyboardObj;
                var typingObj;
                var firstErr = true;
                var openedKeyboard = false;
                var isFromBet = false;
                var atLeastNeedChg = false;
                var p3NeedChg = false;
                var par_limit_min = "";
                var par_limit_max = "";
                var isLockANDopenLimit = false;
                var eventHandler = new Object;
                var limit_allowBets = new Object;
                var ignoreCollapseBtn = new Array("num_0","num_1","num_2","num_3","num_4","num_5","num_6","num_7","num_8","num_9","num_x","num_no","add_1","add_2","add_3","bet_gold_tt","bet_gold","bet_gold_tt_pc","bet_gold_pc");
                var noEffect = new Array("div_showlimit","set_max");
                var reverseSw = new Object;
                var keepScore = new Object;
                var iorError = false;
                var SYSTIME = "";
                var Credit = new Object;
                var needsToRebuild;
                var lockBetNum;
                var isCnf = new Object;
                var systemErr_Gtype = new Object;
                systemErr_Gtype["FT"] = false;
                systemErr_Gtype["OP"] = false;
                var allFT = true;
                var allOP = true;
                var stillError = false;
                var systemErrAry = new Array("connectFail","0X001","0X002","0X003","0X004","0X005","0X006","0X007","0X008","1X037");
                var tmpLimitObj = new Object;
                _self.paramHash = new Object;
                _self.totalParamHash = new Object;
                _self.idKeyHash = new Object;
                var myhash = {};
                var is_PC = "";
                _self.init = function() {
                    myhash["errorAry"] = errorAry;
                    myhash["errP3Ary"] = errP3Ary;
                    myhash["errP3ChgAry"] = errP3ChgAry;
                    _mc["div_mask"] = dom.getElementById("div_mask");
                    _mc["bet_show"] = dom.getElementById("bet_show");
                    _mc["bet_model"] = dom.getElementById("bet_model");
                    util_game.init();
                    _self.addEventListener("_calcWinGold", _self._calcWinGold);
                    _self.addEventListener("setTotalSingleBets", _self.setTotalSingleBets);
                    _self.addEventListener("enabledBet", _self.OrderEnabledBet);
                    _self.addEventListener("bettingMask", _self.OrderBettingMask);
                    _self.addEventListener("showDelayLoading", _self.OrderShowDelayLoading);
                    _self.addEventListener("showOrderMsg", _self.showOrderMsg);
                    _self.addEventListener("setIsFromBet", _self.setIsFromBet);
                    _self.addEventListener("showParlay", _self.showParlay);
                    _self.addEventListener("clearDots", _self.clearDots);
                    _self.addEventListener("orderTotalView", _self.orderTotalView);
                    _self.addEventListener("showAcceptChg", _self.showAcceptChg);
                    _self.addEventListener("createOVTimer", _self.OrderCreateOVTimer);
                    _self.addEventListener("clearOVTimer", _self.OrderClearOVTimer);
                    _self.addEventListener("reBet", _self.OrderReBet);
                    _self.addEventListener("setBottomon", _self.setBottomtest);
                    _self.addEventListener("showAlertMsg", _self.OrderShowAlertMsg);
                    _self.addEventListener("reloadCredit", _self.reloadCredit);
                    _self.addEventListener("get_gamedate", _self.get_gamedate);
                    _self.addEventListener("clearOrderbets", _self.clearOrderbets);
                    _self.addEventListener("showUnStableMsg", _self.showUnStableMsg);
                    _self.addEventListener("totalPrint", _self.totalPrint);
                    _self.addEventListener("showFantasyInfo", _self.showFantasyInfo);
                    _self.addEventListener("setTargetPostition", _self.setTargetPostition)
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    LS = parentClass.getThis("LS");
                    LS_game = parentClass.getThis("LS_game");
                    LS_code = parentClass.getThis("LS_code");
                    timerHash = parentClass.getThis("timerHash");
                    config_set = parentClass.getThis("config_set");
                    CookieManager = parentClass.getThis("CookieManager");
                    _limit = parentClass.getThis("_limit");
                    lockBetNum = parentClass.getThis("lockBetNum");
                    myhash["LS"] = LS;
                    myhash["LS_game"] = LS_game;
                    myhash["LS_code"] = LS_code;
                    myhash["config_set"] = config_set;
                    myhash["CookieManager"] = CookieManager;
                    myhash["_limit"] = _limit;
                    myhash["timerHash"] = timerHash;
                    myhash["lockBetNum"] = lockBetNum
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
                _self.getThis = function(varible) {
                    if (!myhash[varible]) {
                        var msg = "no myhash[" + varible + "]";
                        util.writeLog(classname, msg)
                    }
                    return myhash[varible]
                }
                ;
                _self.OrderShowAlertMsg = function(obj) {
                    parentClass.dispatchEvent("showAlertMsg", obj)
                }
                ;
                _self.OrderEnabledBet = function(sw) {
                    parentClass.dispatchEvent("enabledBet", sw)
                }
                ;
                _self.OrderCloseBet = function(mouseEvent, needsClear) {
                    parentClass.dispatchEvent("closeBet", needsClear)
                }
                ;
                _self.OrderBettingMask = function(mouseEvent, isShow) {
                    parentClass.dispatchEvent("bettingMask", isShow)
                }
                ;
                _self.OrderShowDelayLoading = function(isShow) {
                    parentClass.dispatchEvent("showDelayLoading", isShow)
                }
                ;
                _self.OrderCreateOVTimer = function() {
                    parentClass.dispatchEvent("createOVTimer", {})
                }
                ;
                _self.OrderClearOVTimer = function() {
                    parentClass.dispatchEvent("clearOVTimer", {})
                }
                ;
                _self.OrdercloseKeyboard = function(status) {
                    parentClass.dispatchEvent("closeKeyboard", status)
                }
                ;
                _self.OrderReBet = function() {
                    errorCode = new Object;
                    errorAry = new Array;
                    myhash["errorAry"] = errorAry;
                    isFromBet = false;
                    firstErr = true;
                    atLeastNeedChg = false;
                    p3NeedChg = false;
                    p3Error = "";
                    parentClass.dispatchEvent("reBet", {})
                }
                ;
                _self.setBottomtest = function() {
                    parentClass.dispatchEvent("setBottomon", {})
                }
                ;
                _self.clearOrderbets = function() {
                    parentClass.dispatchEvent("clearOrderbets")
                }
                ;
                _self.totalPrint = function(mouseEvent, page) {
                    parentClass.dispatchEvent("doPrint", page)
                }
                ;
                _self.setTotalData = function(xmlHash, gameHash, betHash, rightMsg_sw, isSameEcid) {
                    echo("[xmlHash]", xmlHash);
                    echo("[gameHash]", gameHash);
                    echo("[betHash]", betHash);
                    var dataHash = new Array;
                    var betSize = util.countSize(top.bet_viewdata);
                    if (betSize != 0)
                        for (var key in top.bet_viewdata) {
                            var tmpXML = xmlHash[top.bet_viewdata[key]];
                            var tmp_game = gameHash[top.bet_viewdata[key]];
                            var tmpHash = betHash[top.bet_viewdata[key]];
                            var _paramHash = new Object;
                            var _tmpDataHash = new Object;
                            var FTmenutype = "";
                            var ms_str = "";
                            var imp_str = "";
                            var ptype_str = "";
                            _paramHash = util.mergeHash(_paramHash, tmpHash);
                            var wtypeStr = _paramHash["wtype"] ? util_game.switchWtypeStr(_paramHash["wtype"].toUpperCase()) : "";
                            if (_paramHash["is_rb"] == "N") {
                                _paramHash["wtype"] = util_game.transWtypeRB2R(_paramHash["wtype"], _paramHash["is_rb"]);
                                _paramHash["keepwtype"] = util_game.transWtypeRB2R(_paramHash["keepwtype"], _paramHash["is_rb"]);
                                _paramHash["rtype"] = util_game.transRtypeRB2R(_paramHash["rtype"], _paramHash["is_rb"]);
                                _paramHash["show_rtype"] = util_game.transRtypeRB2R(_paramHash["show_rtype"], _paramHash["is_rb"])
                            }
                            var _betKey = _paramHash["gtype"].toUpperCase() + "_" + _paramHash["ecid"];
                            if (_paramHash["bet_now"] != null && _paramHash["bet_now"].indexOf("FS") != -1) {
                                _paramHash["keepwtype"] = "FS";
                                _tmpDataHash["ECID"] = _paramHash["ecid"];
                                _tmpDataHash["showtype"] = tmpHash["showtype"].toLowerCase() != "ft" ? LS.get("showtype_" + tmpHash["showtype"]) : "";
                                _tmpDataHash["rtype"] = _paramHash["rtype"];
                                if (_paramHash["mode"] == "group")
                                    _tmpDataHash["LEAGUE"] = _paramHash["betLeagueName"] + " " + _paramHash["rtype_name"];
                                else
                                    _tmpDataHash["LEAGUE"] = util.getKeyValue(tmpXML, tmp_game, "league") + " " + (_paramHash["bet_now"] != "SFS" ? util.getKeyValue(tmpXML, tmp_game, "league") : "");
                                _tmpDataHash["TEAM_H"] = "";
                                _tmpDataHash["TEAM_C"] = "";
                                _tmpDataHash["SCORE"] = "";
                                _tmpDataHash["CON_H"] = "";
                                _tmpDataHash["CON_C"] = "";
                                _tmpDataHash["CHOSE_CON"] = "";
                                _tmpDataHash["CHOSE_TEAM"] = _paramHash["rtype_name"];
                                _tmpDataHash["bet_now"] = _paramHash["bet_now"];
                                _tmpDataHash["gid"] = _paramHash["gid"];
                                var getMenuHash = new Object;
                                getMenuHash.gid = _paramHash["gid"];
                                getMenuHash.gtype = _paramHash["gtype"];
                                getMenuHash.showtype = _paramHash["showtype"];
                                getMenuHash.wtype = _paramHash["keepwtype"];
                                getMenuHash.rtype = _paramHash["rtype"];
                                getMenuHash.ms = ms_str;
                                getMenuHash.team_h = "";
                                getMenuHash.team_c = "";
                                getMenuHash.imp = imp_str;
                                getMenuHash.ptype = ptype_str;
                                FTmenutype = util_game.getWtypeName(LS_game, getMenuHash.gid, getMenuHash.showtype, getMenuHash.gtype, getMenuHash.wtype, getMenuHash.rtype, getMenuHash.ms, getMenuHash.team_h, getMenuHash.team_c, getMenuHash.imp, getMenuHash.ptype)
                            } else {
                                _tmpDataHash["bet_now"] = "";
                                _paramHash["show_rtype"] = _paramHash["rtype"];
                                _paramHash["keepchose_team"] = _paramHash["chose_team"];
                                var chose_team;
                                var _rtype = _paramHash["show_rtype"].toLowerCase();
                                if (LS_game.get(_rtype) == "") {
                                    var Ftype = "_F_RF_DC_RDC_";
                                    var isRGA = util_game.checkWtypeIsRGA_TN(_paramHash["wtype"].toUpperCase());
                                    var isRGOU = util_game.checkWtypeIsRGOU_TN(_paramHash["wtype"].toUpperCase());
                                    if (Ftype.indexOf("_" + _paramHash["wtype"].toUpperCase() + "_") >= 0) {
                                        f1 = _paramHash["rtype"].toUpperCase().replace(_paramHash["wtype"].toUpperCase(), "").substr(0, 1);
                                        f2 = _paramHash["rtype"].toUpperCase().replace(_paramHash["wtype"].toUpperCase(), "").substr(1, 1);
                                        chose_team = "";
                                        if (f1 == "N")
                                            chose_team += LS_game.get("mn");
                                        else
                                            chose_team += util.getKeyValue(tmpXML, tmp_game, "team_" + f1.toUpperCase());
                                        chose_team += " / ";
                                        if (f2 == "N")
                                            chose_team += LS_game.get("mn");
                                        else
                                            chose_team += util.getKeyValue(tmpXML, tmp_game, "team_" + f2.toUpperCase())
                                    } else if (isRGA || isRGOU)
                                        chose_team = LS_game.get(_paramHash["chose_team"]);
                                    else
                                        chose_team = util.getKeyValue(tmpXML, tmp_game, "team_" + _paramHash["keepchose_team"].toLowerCase())
                                } else {
                                    var team_h = util.getKeyValue(tmpXML, tmp_game, "team_h");
                                    var team_c = util.getKeyValue(tmpXML, tmp_game, "team_c");
                                    chose_team = LS_game.get(_rtype);
                                    chose_team = chose_team.replace(/\*TEAM_H\*/g, util.showTxt(team_h));
                                    chose_team = chose_team.replace(/\*TEAM_C\*/g, util.showTxt(team_c))
                                }
                                _tmpDataHash["ECID"] = _paramHash["ecid"];
                                _tmpDataHash["gid"] = _paramHash["gid"];
                                var tmpRtype = "";
                                if (_paramHash["gtype"].toUpperCase() == "FT") {
                                    var is_rb = _paramHash["is_rb"];
                                    if (_paramHash["remain_rtype"] != null)
                                        tmpRtype = _paramHash["remain_rtype"];
                                    else if (util_game.checkWtypeIsRG(_paramHash["wtype"])) {
                                        var _rtype = _paramHash["show_rtype"];
                                        tmpRtype = _rtype.replace(/^[A-J]/, "")
                                    } else
                                        tmpRtype = util_game.transRtypeR2RB(_paramHash["show_rtype"], is_rb)
                                } else if (_paramHash["gtype"].toUpperCase() != "FT" && _paramHash["showtype"] == "parlay")
                                    tmpRtype = util_game.transRtype2P(_paramHash["show_rtype"], true);
                                else
                                    tmpRtype = _paramHash["show_rtype"];
                                _paramHash["ioratio"] = util.getKeyValue(tmpXML, tmp_game, "ior_" + tmpRtype.toLowerCase(), wtypeStr);
                                if (_paramHash["gtype"].toUpperCase() == "FT" && tmpHash["showtype"] == "live")
                                    _tmpDataHash["SCORE"] = "(" + util.getKeyValue(tmpXML, tmp_game, "score_h") + " - " + util.getKeyValue(tmpXML, tmp_game, "score_c") + ")";
                                else
                                    _tmpDataHash["SCORE"] = "";
                                try {
                                    _paramHash["keepwtype"] = _paramHash["wtype"].toUpperCase();
                                    _paramHash["subtypestr"] = "";
                                    if (_paramHash["gtype"] == "FT") {
                                        _paramHash["subtypestr"] = LS_game.get("showRtype");
                                        if (util_game.checkWtypeIsHalf_menutype(_paramHash["keepwtype"]))
                                            _paramHash["subtypestr"] = LS_game.get("showRtype_h")
                                    } else {
                                        var ms = util.getKeyValue(tmpXML, tmp_game, "ms");
                                        if (ms != null) {
                                            ms = ms.split("_")[1];
                                            var ms_str = LS_game.get(_paramHash["gtype"] + "_game_" + ms + "_set");
                                            if (ms_str != "") {
                                                if (ms_str == _paramHash["gtype"] + "_game_" + ms + "_set")
                                                    ms_str = "";
                                                _paramHash["subtypestr"] = ms_str
                                            }
                                        }
                                    }
                                    var showRtype = "";
                                    if (_paramHash["keepwtype"] == "T") {
                                        var _ary = new Array("EOO","EOE","HEOO","HEOE","EOH","EOC","HEOH","HEOC");
                                        if (util.in_array(_paramHash["show_rtype"], _ary)) {
                                            showRtype = "eo";
                                            _paramHash["keepwtype"] = showRtype.toUpperCase()
                                        } else
                                            showRtype = _paramHash["keepwtype"]
                                    } else
                                        showRtype = _paramHash["keepwtype"];
                                    var _ary = new Array("ouh","ouc","houh","houc","rouh","rouc","hruh","hruc");
                                    var tmp_team = "";
                                    var tmp_wtype = showRtype.toLowerCase();
                                    _paramHash["showPlayType"] = LS_game.get(util_game.chgShowName_M("showRtype_" + showRtype.toLowerCase(), _paramHash["gtype"])) + tmp_team;
                                    if (util.in_array(tmp_wtype, _ary) && _paramHash["gtype"] == "FT") {
                                        var t = tmp_wtype.substr(tmp_wtype.length - 1, 1);
                                        tmp_team = util.getKeyValue(tmpXML, tmp_game, "team_" + t.toUpperCase());
                                        _paramHash["showPlayType"] = _paramHash["showPlayType"].replace("*TEAM_" + t.toUpperCase() + "*", util.showTxt(tmp_team))
                                    }
                                    if (_paramHash["gtype"] == "TN" && util_game.checkWtypeIsR(_paramHash["keepwtype"]))
                                        _paramHash["showPlayType"] = LS_game.get("showRtype_" + showRtype.toLowerCase() + "_p");
                                    if ((_paramHash["gtype"] == "VB" || _paramHash["gtype"] == "BK") && util_game.checkWtypeIsR(_paramHash["keepwtype"]))
                                        _paramHash["showPlayType"] = LS_game.get("showRtype_" + showRtype.toLowerCase() + "_s")
                                } catch (e) {
                                    _tmpDataHash["league"] = util.getKeyValue(tmpXML, tmp_game, "league");
                                    _paramHash["showPlayType"] = "";
                                    _paramHash["subtypestr"] = ""
                                }
                                _paramHash["showPlayType"] = _paramHash["showPlayType"].replace(/\*TEAM_H\*/g, util.showTxt(_tmpDataHash["team_h"]));
                                _paramHash["showPlayType"] = _paramHash["showPlayType"].replace(/\*TEAM_C\*/g, util.showTxt(_tmpDataHash["team_c"]));
                                var strong = util.getKeyValue(tmpXML, tmp_game, "strong");
                                var _betCon = "";
                                if (util_game.checkWtypeIsOU(_paramHash["keepwtype"]) || _paramHash["keepwtype"] == "W3") {
                                    var _abs = "";
                                    var isFromOutside = _paramHash["isFromOutside"] != null ? "Y" : "N";
                                    var rb_rtype = _paramHash["show_rtype"];
                                    var tmpCon = util.getKeyValue(tmpXML, tmp_game, util_game.switchConRtype(rb_rtype, isFromOutside));
                                    if (_paramHash["MSorPOINT"] != "" && _paramHash["MSorPOINT"])
                                        tmpCon = util.getKeyValue(tmpXML, tmp_game, _paramHash["MSorPOINT"] + "_" + util_game.switchConRtype(rb_rtype, isFromOutside));
                                    _betCon = _abs + tmpCon.replace(/U/, "").replace(/O/, "")
                                }
                                _tmpDataHash["CHOSE_CON"] = _betCon;
                                _tmpDataHash["CON_H"] = "";
                                _tmpDataHash["CON_C"] = "";
                                if (util_game.checkWtypeIsR(_paramHash["keepwtype"])) {
                                    var str = _paramHash["keepwtype"].toUpperCase().indexOf("H") == -1 ? "strong" : "hstrong";
                                    var _abs = "";
                                    if (_paramHash["MSorPOINT"] && _paramHash["MSorPOINT"] != "")
                                        var tmp_con = util.getKeyValue(tmpXML, tmp_game, _paramHash["MSorPOINT"] + "_" + util_game.switchConRtype(_paramHash["show_rtype"]));
                                    else
                                        var tmp_con = util.getKeyValue(tmpXML, tmp_game, util_game.switchConRtype(_paramHash["show_rtype"]));
                                    if (!tmp_con)
                                        tmp_con = "";
                                    strong = util.getKeyValue(tmpXML, tmp_game, str);
                                    if (_paramHash["keepwtype"] != "W3" && tmp_con != "0" && tmp_con != "")
                                        if (strong == _paramHash["chose_team"])
                                            _abs = "-";
                                        else
                                            _abs = "+";
                                    if (strong == "H") {
                                        _tmpDataHash["CON_H"] = _abs + tmp_con;
                                        _tmpDataHash["CON_C"] = "";
                                        _paramHash["CON_H"] = _tmpDataHash["CON_H"];
                                        _paramHash["CON_C"] = _tmpDataHash["CON_C"]
                                    } else {
                                        _tmpDataHash["CON_H"] = "";
                                        _tmpDataHash["CON_C"] = _abs + tmp_con;
                                        _paramHash["CON_C"] = _tmpDataHash["CON_C"];
                                        _paramHash["CON_H"] = _tmpDataHash["CON_H"]
                                    }
                                }
                                _tmpDataHash["LEAGUE"] = util.getKeyValue(tmpXML, tmp_game, "LEAGUE");
                                var team_h = util.getKeyValue(tmpXML, tmp_game, "TEAM_H");
                                var team_c = util.getKeyValue(tmpXML, tmp_game, "TEAM_C");
                                var imp = _paramHash["imp"];
                                var ptype = _paramHash["ptype"];
                                if (imp == "Y") {
                                    team_h = team_h.replace(ptype, "");
                                    team_c = team_c.replace(ptype, "");
                                    chose_team = chose_team.replace(ptype, "")
                                }
                                if (_paramHash["subtypestr"] != "") {
                                    var tmpSession = " - (" + _paramHash["subtypestr"] + ")";
                                    team_h = team_h.replace(tmpSession, "");
                                    team_c = team_c.replace(tmpSession, "");
                                    chose_team = chose_team.replace(tmpSession, "")
                                }
                                if (_paramHash["session"] != null && _paramHash["session"] != "") {
                                    var tmpSession = " - (" + _paramHash["session"] + ")";
                                    team_h = team_h.replace(tmpSession, "");
                                    team_c = team_c.replace(tmpSession, "");
                                    chose_team = chose_team.replace(tmpSession, "")
                                }
                                _tmpDataHash["TEAM_H"] = team_h;
                                _tmpDataHash["TEAM_C"] = team_c;
                                _tmpDataHash["CHOSE_TEAM"] = chose_team;
                                var tmpMS = "";
                                if (_paramHash["MSorPOINT"] && _paramHash["MSorPOINT"] != "" && !_paramHash["gtype"].match(/BS|ES/))
                                    tmpMS = _paramHash["gid"] + "_" + util_game.getNowMS(xmlnode, tmp_game, _paramHash["MSorPOINT"], _paramHash["gtype"], util);
                                imp_str = _paramHash["imp"];
                                ptype_str = _paramHash["ptype"];
                                var getMenuHash = new Object;
                                getMenuHash.gid = _paramHash["gid"];
                                getMenuHash.gtype = _paramHash["gtype"];
                                getMenuHash.showtype = _paramHash["showtype"];
                                getMenuHash.wtype = _paramHash["keepwtype"];
                                getMenuHash.rtype = _paramHash["rtype"];
                                getMenuHash.ms = tmpMS;
                                getMenuHash.team_h = _tmpDataHash["TEAM_H"];
                                getMenuHash.team_c = _tmpDataHash["TEAM_C"];
                                getMenuHash.imp = imp_str;
                                getMenuHash.ptype = ptype_str;
                                FTmenutype = util_game.getWtypeName(LS_game, getMenuHash.gid, getMenuHash.showtype, getMenuHash.gtype, getMenuHash.wtype, getMenuHash.rtype, getMenuHash.ms, getMenuHash.team_h, getMenuHash.team_c, getMenuHash.imp, getMenuHash.ptype, betHash[_paramHash["gtype"] + "_" + _paramHash["ecid"]], _paramHash);
                                _paramHash = util_game.switchBetRtype(_paramHash)
                            }
                            _limit[_betKey] = new Object;
                            _limit[_betKey]["max"] = "";
                            _limit[_betKey]["min"] = "";
                            _limit[_betKey]["currency"] = "";
                            myhash["_limit"] = _limit;
                            _tmpDataHash["betKey"] = _betKey;
                            _tmpDataHash["min_bet"] = "";
                            _tmpDataHash["max_bet"] = "";
                            _tmpDataHash["idKey"] = _paramHash["gid"] + "_" + _paramHash["ecid"] + "_" + _paramHash["rtype"];
                            _self.idKeyHash[_betKey] = _tmpDataHash["idKey"];
                            try {
                                var bet_wtype = util_game.chgTwtype(_paramHash["keepwtype"], _paramHash["rtype"]);
                                var float_ior = util.ignoreDots(_paramHash["ioratio"], 2);
                                _tmpDataHash["BET_IOR"] = util.showTxt(util_game.getOrderIoratio(float_ior, null, bet_wtype))
                            } catch (e) {
                                _tmpDataHash["BET_IOR"] = "0.00"
                            }
                            _tmpDataHash["maxcredit"] = top["userData"].maxcredit;
                            _tmpDataHash["WTYPESHOW"] = FTmenutype;
                            dataHash.push(_tmpDataHash);
                            _self.totalParamHash[_betKey] = _paramHash
                        }
                    _self.setTotalModelData(dataHash.reverse(), rightMsg_sw, isSameEcid)
                }
                ;
                _self.setTotalModelData = function(dataHash, rightMsg_sw, isSameEcid) {
                    echo("[setTotalModelData][dataHash]", dataHash);
                    var tmpDiv, tmpBet = "", choiceModel, tmpBetList, betSlipModel, tmpBetSlip;
                    needsToRebuild = util.isDifferent_ary(top["LastBet_select"], top["bet_select"]);
                    echo("[needsToRebuild]=====>", needsToRebuild);
                    choiceModel = dom.getElementById("total_bet");
                    tmpBetList = choiceModel.cloneNode(true);
                    if (needsToRebuild) {
                        top.isSystemError = false;
                        isFirst = true;
                        isFromBet = false;
                        limit_allowBets = new Object;
                        top["closeGame"] = new Object;
                        top["locked_slip"] = new Object;
                        errorAry = new Array;
                        myhash["errorAry"] = errorAry;
                        errorCode = new Object;
                        firstErr = true;
                        isCnf = new Object;
                        lockBetNum = new Object;
                        p3Error = "";
                        errP3ChgAry = new Object;
                        myhash["errP3ChgAry"] = errP3ChgAry;
                        if (top.mobile != "Y")
                            is_PC = "_pc";
                        if (dataHash.length != 0) {
                            var betSlipAry = new Array("ECID","BET_KEY","WTYPESHOW","SCORE","LEAGUE","TEAM_H","TEAM_C","CON_H","CON_C","CHOSE_TEAM","CHOSE_CON","BET_IOR");
                            var isSameEcid_sw = isSameEcid;
                            for (var i = 0; i < dataHash.length; i++) {
                                betSlipModel = dom.getElementById("model_betslip");
                                tmpBetSlip = betSlipModel.cloneNode(true);
                                var tmp_bet_gold_obj = dom.getElementById("bet_gold_" + dataHash[i].ECID + is_PC);
                                var tmp_gold = "";
                                if (isSameEcid_sw) {
                                    if (tmp_bet_gold_obj)
                                        tmp_bet_gold_obj.innerHTML = "";
                                    isSameEcid_sw = false
                                }
                                if (top.isSameGame != null && top.isSameGame.indexOf(dataHash[i].ECID) != -1)
                                    if (tmp_bet_gold_obj)
                                        tmp_bet_gold_obj.innerHTML = "";
                                if (tmp_bet_gold_obj && top.isSameGame.indexOf(dataHash[i].ECID) == -1) {
                                    if (top.mobile != "Y") {
                                        if (tmp_bet_gold_obj.value != "")
                                            tmp_gold = tmp_bet_gold_obj.value
                                    } else if (tmp_bet_gold_obj.innerHTML != "")
                                        tmp_gold = tmp_bet_gold_obj.innerHTML;
                                    if (tmp_gold != "")
                                        top["keepGold"]["bet_" + dataHash[i].idKey] = tmp_gold
                                }
                                top.isSameGame.splice(top.isSameGame.indexOf(dataHash[i].ECID), 1);
                                for (var a = 0; a < betSlipAry.length; a++) {
                                    var keys = betSlipAry[a];
                                    var vals = dataHash[i][keys];
                                    if (keys.indexOf("TEAM") != -1 && vals != null)
                                        vals = vals.replace("[Mid]", "").replace("[\u4e2d]", "");
                                    if (keys.indexOf("BET_KEY") != -1)
                                        vals = dataHash[i]["idKey"];
                                    tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*" + keys + "\\*","gi"), util.showTxt(vals))
                                }
                                tmpBet += tmpBetSlip.innerHTML
                            }
                            tmpBetList.innerHTML = tmpBetList.innerHTML.replace(new RegExp("\\*BET_SLIP_SHOW\\*","gi"), tmpBet)
                        } else
                            tmpBetList.innerHTML = tmpBetList.innerHTML.replace(new RegExp("\\*BET_SLIP_SHOW\\*","gi"), "");
                        var finalBet = _mc["bet_model"].cloneNode(true);
                        finalBet.innerHTML = finalBet.innerHTML.replace(new RegExp("\\*BET_LIST\\*","gi"), tmpBetList.innerHTML);
                        tmpDiv = finalBet.innerHTML;
                        _mc["bet_show"].innerHTML = tmpDiv;
                        if (top["LastBet_select"] != undefined)
                            top["LastBet_select"] = util.clone(top["bet_select"])
                    } else if (dataHash.length == 0) {
                        tmpBetList.innerHTML = tmpBetList.innerHTML.replace(new RegExp("\\*BET_SLIP_SHOW\\*","gi"), "");
                        var finalBet = _mc["bet_model"].cloneNode(true);
                        finalBet.innerHTML = finalBet.innerHTML.replace(new RegExp("\\*BET_LIST\\*","gi"), tmpBetList.innerHTML);
                        tmpDiv = finalBet.innerHTML;
                        _mc["bet_show"].innerHTML = tmpDiv
                    }
                    util.removeClass(_mc["bet_show"], "qk");
                    util.removeClass(_mc["bet_show"], "receipt");
                    if (dataHash.length == 1)
                        parentClass.dispatchEvent("lockScroll", {});
                    util.scrollFun("div_betInfo");
                    _self.setTotalClickEvent();
                    _self.setLastKeepGold();
                    if (openedKeyboard)
                        _self.initReverseSw();
                    _self.setBetNumVisible(false);
                    typingObj = null;
                    _self.initTyping();
                    parentClass.dispatchEvent("showInfoLoading", true);
                    dom.getElementById("nowCredit").innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(top["userData"].maxcredit)));
                    parentClass.dispatchEvent("showAddTotal", false);
                    var _betSize = util.countSize(top["bet_select"]);
                    _self.setBetCount(_betSize);
                    _self.updateCurrency(top["userData"].currency);
                    if (dataHash.length == 0) {
                        _self.showRemoveALL(false);
                        _self.showEmpty(true);
                        top["isOrderView"] = true;
                        parentClass.dispatchEvent("showInfoLoading", false);
                        return
                    } else {
                        _self.showRemoveALL(true);
                        _self.showEmpty(false);
                        _self.showSingle(dataHash.length > 1);
                        _self.setMutiBetslipCount(_betSize)
                    }
                    for (var i = 0; i < dataHash.length; i++) {
                        if (top.mobile != "Y") {
                            var bet_gold_bg = dom.getElementById("bet_gold_bg_" + dataHash[i].ECID);
                            var bet_gold_bg_pc = dom.getElementById("bet_gold_bg_" + dataHash[i].ECID + "_pc");
                            var bet_gold_input = dom.getElementById("bet_gold_" + dataHash[i].ECID + "_pc");
                            bet_gold_bg.style.display = "none";
                            bet_gold_bg_pc.style.display = "";
                            util.addEvent(bet_gold_input, "input", _self.pcGoldHandler, bet_gold_input)
                        }
                        _self.setEachTotalBetClick(dataHash[i])
                    }
                    _self.allowToBet();
                    _self.orderTotalView();
                    parentClass.dispatchEvent("createOVTimer", {})
                }
                ;
                _self.setTotalClickEvent = function() {
                    if (top.mobile != "Y") {
                        dom.getElementById("total_parlay_count").style.display = "none";
                        dom.getElementById("total_parlay_count_pc").style.display = "";
                        dom.getElementById("total_single_count").style.display = "none";
                        dom.getElementById("total_single_count_pc").style.display = ""
                    }
                    _mc["betCount"] = dom.getElementById("betCount");
                    _mc["bet_loading"] = dom.getElementById("bet_loading");
                    _mc["delay_loading"] = dom.getElementById("delay_loading");
                    _mc["div_set"] = dom.getElementById("div_set");
                    _mc["div_calc"] = dom.getElementById("div_calc");
                    _mc["order_bet"] = dom.getElementById("order_bet");
                    _mc["set_btn"] = dom.getElementById("set_btn");
                    _mc["bet_gold_tt"] = dom.getElementById("bet_gold_tt" + is_PC);
                    _mc["bet_gold2_tt"] = dom.getElementById("bet_gold2_tt");
                    _mc["last_betCredit"] = dom.getElementById("last_betCredit");
                    _mc["add_total_bet"] = dom.getElementById("add_total_bet");
                    _mc["bet_better_odds"] = dom.getElementById("bet_better_odds");
                    _mc["close_set"] = dom.getElementById("close_set");
                    _mc["betBtn_show"] = dom.getElementById("betBtn_show");
                    _mc["betBtn_txt"] = dom.getElementById("betBtn_txt");
                    _mc["div_betInfo"] = dom.getElementById("div_betInfo");
                    _mc["betInfo_bg"] = dom.getElementById("betInfo_bg");
                    _mc["div_lastBetCredit"] = dom.getElementById("div_lastBetCredit");
                    _mc["div_betHeader"] = dom.getElementById("div_betHeader");
                    _mc["showRemoveALL"] = dom.getElementById("showRemoveALL");
                    _mc["removeALL"] = dom.getElementById("removeALL");
                    _mc["div_removeALL"] = dom.getElementById("div_removeALL");
                    _mc["cancel_removeALL"] = dom.getElementById("cancel_removeALL");
                    _mc["nowCredit"] = dom.getElementById("nowCredit");
                    _mc["bet_total_gold"] = dom.getElementById("bet_total_gold");
                    _mc["bet_total_wingold"] = dom.getElementById("bet_total_wingold");
                    _mc["div_empty"] = dom.getElementById("div_empty");
                    _mc["total_parlay"] = dom.getElementById("total_parlay");
                    _mc["total_single"] = dom.getElementById("total_single");
                    _mc["total_parlay_locked"] = dom.getElementById("total_parlay_locked");
                    _mc["total_single_locked"] = dom.getElementById("total_single_locked");
                    _mc["total_parlay_count"] = dom.getElementById("total_parlay_count" + is_PC);
                    _mc["total_single_count"] = dom.getElementById("total_single_count" + is_PC);
                    _mc["parlay_error"] = dom.getElementById("parlay_error");
                    _mc["parlay_ior"] = dom.getElementById("parlay_ior");
                    _mc["div_parlay_limit"] = dom.getElementById("div_parlay_limit");
                    _mc["parlay_limit"] = dom.getElementById("parlay_limit");
                    _mc["orderMsg_div"] = dom.getElementById("orderMsg_div");
                    _mc["orderMsg"] = dom.getElementById("orderMsg");
                    _mc["remove_bet"] = dom.getElementById("remove_bet");
                    _mc["betCount_tt"] = dom.getElementById("betCount_tt");
                    _mc["bet_gold_single"] = dom.getElementById("bet_gold_single" + is_PC);
                    _mc["bet_gold_tt_single"] = dom.getElementById("bet_gold_tt_single" + is_PC);
                    _mc["bet_gold_p3"] = dom.getElementById("bet_gold_p3" + is_PC);
                    _mc["bet_gold_tt_p3"] = dom.getElementById("bet_gold_tt_p3" + is_PC);
                    _mc["bet_wingold_p3"] = dom.getElementById("bet_wingold_p3");
                    _mc["max_limit_p3"] = dom.getElementById("max_limit_p3");
                    _mc["div_showlimit_p3"] = dom.getElementById("div_showlimit_p3");
                    _mc["div_limit_p3"] = dom.getElementById("div_limit_p3");
                    _mc["set_max_p3"] = dom.getElementById("set_max_p3");
                    _mc["rotate_removeALL"] = dom.getElementById("rotate_removeALL");
                    _mc["total_single_count_pc"] = dom.getElementById("total_single_count_pc");
                    _mc["total_parlay_count_pc"] = dom.getElementById("total_parlay_count_pc");
                    _mc["bet_gold_single_pc"] = dom.getElementById("bet_gold_single_pc");
                    _mc["bet_gold_p3_pc"] = dom.getElementById("bet_gold_p3_pc");
                    var _min = "5";
                    var _max = "999999999";
                    var obj = {
                        "win": win,
                        "dom": dom,
                        "targetObj": _mc["bet_gold"],
                        "targetObj_tt": _mc["bet_gold_tt"],
                        "screen": _mc["div_calc"],
                        "limitCount": 3,
                        "currency": top["userData"].currency,
                        "minbet": _min,
                        "maxbet": _max
                    };
                    keyboardObj = new win.self_keyboard(win,dom,obj);
                    keyboardObj.setParentclass(this);
                    keyboardObj.init();
                    util.addEvent(_mc["div_mask"], "click", parentClass.clickClose, {
                        "needsClear": false
                    });
                    util.addEvent(_mc["div_betHeader"], "click", parentClass.clickClose, {
                        "needsClear": false
                    });
                    util.addEvent(_mc["showRemoveALL"], "click", _self.openRemoveALL, _mc["showRemoveALL"]);
                    util.addEvent(_mc["removeALL"], "click", _self.removeALL, _mc["removeALL"]);
                    util.addEvent(_mc["cancel_removeALL"], "click", _self.openRemoveALL, _mc["cancel_removeALL"]);
                    util.addEvent(_mc["set_btn"], "click", parentClass.showSet, _mc["set_btn"]);
                    util.addEvent(_mc["order_bet"], "click", _self.betHandler, _mc["order_bet"]);
                    util.addEvent(_mc["close_set"], "click", parentClass.showSet, _mc["close_set"]);
                    util.addEvent(_mc["div_betInfo"], "click", _self.betClick, _mc["div_betInfo"]);
                    util.addEvent(_mc["bet_better_odds"], "change", parentClass.saveBetterOdds, _mc["bet_better_odds"]);
                    util.addEvent(_mc["bet_gold_single"], "click", _self.setSingleGold, null);
                    util.addEvent(_mc["bet_gold_tt_single"], "click", _self.setSingleGold, null);
                    util.addEvent(_mc["bet_gold_p3"], "click", _self.setBetNum, {
                        "isTotalBet": true,
                        "targetObj": _mc["bet_gold_p3"],
                        "targetObj_tt": _mc["bet_gold_tt_p3"],
                        "betKey": "p3",
                        "bet_wingold": _mc["bet_wingold_p3"],
                        "ECID": "p3"
                    });
                    util.addEvent(_mc["bet_gold_tt_p3"], "click", _self.setBetNum, {
                        "isTotalBet": true,
                        "targetObj": _mc["bet_gold_p3"],
                        "targetObj_tt": _mc["bet_gold_tt_p3"],
                        "betKey": "p3",
                        "bet_wingold": _mc["bet_wingold_p3"],
                        "ECID": "p3"
                    });
                    util.addEvent(_mc["div_showlimit_p3"], "click", parentClass.showSpecDiv, {
                        "showTarget": "limit",
                        "clickObj": _mc["div_showlimit_p3"],
                        "isShow": true,
                        "ECID": "p3"
                    });
                    util.addEvent(_mc["set_max_p3"], "click", parentClass.setMax, {
                        "isTotalBet": true,
                        "limitObj": _limit,
                        "targetObj": _mc["bet_gold_p3"],
                        "targetObj_tt": _mc["bet_gold_tt_p3"],
                        "betKey": "p3",
                        "ECID": "p3"
                    });
                    util.addEvent(_mc["rotate_removeALL"], "click", parentClass.clickClose, {
                        "needsClear": true
                    });
                    util.addEvent(_mc["bet_gold_p3"], "input", _self.pcGoldHandler, _mc["bet_gold_p3"]);
                    util.addEvent(_mc["bet_gold_single"], "input", _self.pcGoldHandlerSingle, _mc["bet_gold_single"]);
                    util.addEvent(_mc["total_single_count_pc"], "click", _self.focusInput, _mc["bet_gold_single_pc"]);
                    util.addEvent(_mc["total_parlay_count_pc"], "click", _self.focusInput, _mc["bet_gold_p3_pc"]);
                    _self.unlockScroll()
                }
                ;
                _self.focusInput = function(e, obj) {
                    if (obj)
                        obj.focus()
                }
                ;
                _self.pcGoldHandler = function(e, goldObj) {
                    var isP3 = goldObj.id.includes("p3");
                    var tmp_ecid = goldObj.id.split("_")[2];
                    var betKey = top["bet_viewdata"]["ec_" + tmp_ecid];
                    var maxBetlimit = isP3 ? _limit["p3"]["max"] : _limit[betKey]["max"];
                    var last_gold_length = goldObj.value.length;
                    var tmp_gold = goldObj.value.replace(/[^\d]|^[0]/g, "");
                    var wingoldObj = dom.getElementById("bet_wingold_" + tmp_ecid);
                    if (tmp_gold * 1 == 0)
                        goldObj.value = "";
                    else if (tmp_gold * 1 > maxBetlimit * 1)
                        goldObj.value = util.showTxt(util.formatThousand(maxBetlimit * 1));
                    else
                        _self.targetPostitionData(goldObj, tmp_gold, last_gold_length);
                    var _paramHash = new Object;
                    _paramHash["target"] = goldObj;
                    _paramHash["bet_wingold"] = wingoldObj;
                    _paramHash["betKey"] = isP3 ? "p3" : betKey;
                    _paramHash["ECID"] = isP3 ? "p3" : tmp_ecid;
                    _self._calcWinGold(_paramHash)
                }
                ;
                _self.pcGoldHandlerSingle = function(goldObj) {
                    var last_gold_length = goldObj.target.value.length;
                    var tmp_gold = goldObj.target.value.replace(/[^\d]|^[0]/g, "");
                    if (tmp_gold * 1 == 0)
                        goldObj.target.value = "";
                    else
                        _self.targetPostitionData(goldObj.target, tmp_gold, last_gold_length);
                    _self.setTotalSingleBets(tmp_gold * 1)
                }
                ;
                _self.targetPostitionData = function(goldObj, tmp_gold, last_gold_length) {
                    var obj = new Object;
                    obj.goldObj = goldObj;
                    obj.tmp_gold = tmp_gold;
                    obj.last_gold_length = last_gold_length;
                    obj.End = goldObj.selectionEnd;
                    _self.setTargetPostition(obj)
                }
                ;
                _self.setTargetPostition = function(obj) {
                    parentClass.dispatchEvent("setTargetPostition", obj)
                }
                ;
                _self.setEachTotalBetClick = function(hash) {
                    var _ECID = hash["ECID"];
                    var _betKey = hash["betKey"];
                    var _idKey = _self.idKeyHash[_betKey];
                    var betslipDiv = dom.getElementById("betslip_" + _idKey);
                    var bet_gold = dom.getElementById("bet_gold_" + _ECID + is_PC);
                    var bet_gold_tt = dom.getElementById("bet_gold_tt_" + _ECID + is_PC);
                    var div_showlimit = dom.getElementById("div_showlimit_" + _ECID);
                    var set_max = dom.getElementById("set_max_" + _ECID);
                    var deleteBet = dom.getElementById("delete_betslip_" + _ECID);
                    var bet_wingold = dom.getElementById("bet_wingold_" + _ECID);
                    var bet_gold_bg = dom.getElementById("bet_gold_bg_" + _ECID + "_pc");
                    if (hash["bet_now"].indexOf("FS") != -1) {
                        _mc["betslip_" + _idKey] = dom.getElementById("betslip_" + _idKey);
                        var bet_ids = ",bet_teamData,";
                        var betInfoObj = util.getObjAry(_mc["betslip_" + _idKey], bet_ids);
                        betInfoObj["bet_teamData"].style.display = "none"
                    }
                    util.addEvent(bet_gold, "click", _self.setBetNum, {
                        "isTotalBet": true,
                        "targetObj": bet_gold,
                        "targetObj_tt": bet_gold_tt,
                        "betKey": _betKey,
                        "bet_wingold": bet_wingold,
                        "ECID": _ECID
                    });
                    util.addEvent(bet_gold_tt, "click", _self.setBetNum, {
                        "isTotalBet": true,
                        "targetObj": bet_gold,
                        "targetObj_tt": bet_gold_tt,
                        "betKey": _betKey,
                        "bet_wingold": bet_wingold,
                        "ECID": _ECID
                    });
                    util.addEvent(div_showlimit, "click", parentClass.showSpecDiv, {
                        "showTarget": "limit",
                        "clickObj": div_showlimit,
                        "isShow": true,
                        "ECID": _ECID
                    });
                    util.addEvent(set_max, "click", parentClass.setMax, {
                        "isTotalBet": true,
                        "limitObj": _limit,
                        "targetObj": bet_gold,
                        "targetObj_tt": bet_gold_tt,
                        "betKey": hash["betKey"],
                        "ECID": _ECID
                    });
                    util.addEvent(deleteBet, "click", _self.delBetslip, {
                        "ECID": _ECID,
                        "targetObj": betslipDiv,
                        "betKey": hash["betKey"],
                        "gid": hash["gid"]
                    });
                    util.addEvent(bet_gold_bg, "click", _self.focusInput, bet_gold)
                }
                ;
                _self.setBetCount = function(_betSize) {
                    dom.getElementById("betCount").innerHTML = util.showTxt(_betSize)
                }
                ;
                _self.keyupEventHandler = function(e) {
                    parentClass.keyboard_set(e, openedKeyboard)
                }
                ;
                _self.unlockScroll = function() {
                    try {
                        util.removeEvent(_mc["bet_show"], "touchstart");
                        util.removeEvent(_mc["bet_show"], "touchmove")
                    } catch (e) {
                        console.log(e)
                    }
                }
                ;
                _self.checkAllBets = function() {
                    var noGold_count = 0;
                    var goldObj = dom.getElementsByName("bet_gold" + is_PC);
                    for (var x = 0; x < goldObj.length; x++) {
                        var order_gold = top.mobile != "Y" ? goldObj[x].value : goldObj[x].innerHTML;
                        var tmpKey = goldObj[x].getAttribute("id").split("_")[2];
                        var betKey = tmpKey;
                        var ECID = tmpKey;
                        if (order_gold == "") {
                            noGold_count++;
                            continue
                        }
                        if (tmpKey != "p3")
                            betKey = top.bet_viewdata["ec_" + tmpKey];
                        _self.checkBets({
                            "bet_gold": goldObj[x],
                            "betKey": betKey,
                            "ECID": ECID
                        })
                    }
                    _self.allowToBet();
                    if (noGold_count == goldObj.length)
                        parentClass.dispatchEvent("enabledBet", false)
                }
                ;
                _self.checkBets = function(hash) {
                    var bet_gold = hash.bet_gold;
                    var _gold = top.mobile != "Y" ? bet_gold.value.replace(/,/g, "") : bet_gold.innerHTML.replace(/,/g, "");
                    var _betKey = hash.betKey;
                    var div_limit = dom.getElementById("div_limit_" + hash["ECID"]);
                    var div_showlimit = dom.getElementById("div_showlimit_" + hash["ECID"]);
                    if (_gold != "") {
                        var clickObj = tmpDiv["last"] != null ? tmpDiv["last"] : top["openLimit"][hash["ECID"]] ? div_limit : div_showlimit;
                        parentClass.showSpecDiv(null, {
                            "showTarget": "wingold",
                            "clickObj": clickObj,
                            "isShow": true,
                            "ECID": hash["ECID"]
                        })
                    } else if (top["openLimit"][hash["ECID"]])
                        parentClass.showSpecDiv(null, {
                            "showTarget": "limit",
                            "clickObj": div_showlimit,
                            "isShow": true,
                            "ECID": hash["ECID"]
                        });
                    else if (isLockANDopenLimit)
                        parentClass.showSpecDiv(null, {
                            "showTarget": "showlimit",
                            "clickObj": null,
                            "isShow": true,
                            "ECID": hash["ECID"]
                        });
                    else if (_gold == "" && !top["isErrCleanGold"])
                        parentClass.showSpecDiv(null, {
                            "showTarget": "showlimit",
                            "clickObj": tmpDiv["now"],
                            "isShow": true,
                            "ECID": hash["ECID"]
                        });
                    var allowBet = _self.checkLimitMin(_gold, _betKey, hash["ECID"]);
                    limit_allowBets[_betKey] = allowBet;
                    _self.allowToBet()
                }
                ;
                _self.allowToBet = function() {
                    var isAllow = false;
                    if (atLeastNeedChg || p3NeedChg)
                        return;
                    if (!top.isSystemError) {
                        var p3_gold = top.mobile != "Y" ? dom.getElementById("bet_gold_p3_pc").value * 1 : dom.getElementById("bet_gold_p3").innerHTML * 1;
                        if (limit_allowBets["p3"] != null && !limit_allowBets["p3"] && p3_gold != 0) {
                            parentClass.dispatchEvent("enabledBet", false);
                            return
                        }
                        for (var betKey in limit_allowBets)
                            if (limit_allowBets[betKey]) {
                                isAllow = limit_allowBets[betKey];
                                parentClass.dispatchEvent("enabledBet", true)
                            }
                        if (!isAllow)
                            parentClass.dispatchEvent("enabledBet", false)
                    } else
                        parentClass.dispatchEvent("enabledBet", false)
                }
                ;
                _self.checkLimitMin = function(_gold, _betKey, _ECID) {
                    var ret = util_game.checkFormat(_gold, false);
                    if (isCnf[_ECID] || lockBetNum[_ECID])
                        return false;
                    if (_limit[_betKey] == null)
                        return false;
                    var gold_gmin = _limit[_betKey]["min"] * 1;
                    var currency = _limit[_betKey]["currency"];
                    var errorValue = "";
                    var org = "";
                    if (ret == "")
                        if (_gold != "" && _gold < gold_gmin) {
                            if (_betKey == "p3")
                                p3hasErr = true;
                            ret = "1X022";
                            errorValue = LS.get(currency) + " " + gold_gmin + ".";
                            delete errorCode[_ECID]
                        } else if (_gold != "" && _gold >= gold_gmin)
                            if (p3Error == "1X022" && _betKey == "p3")
                                p3Error = "";
                    if (_betKey == "p3") {
                        var _countErr = util.countSize(errP3Ary);
                        if (ret != "" && !isFirst) {
                            p3hasErr = true;
                            _self.showParlayErrorMsg(true, ret, errorValue, org);
                            return false
                        } else if (isFirst && ret != "") {
                            p3hasErr = false;
                            _self.showParlayErrorMsg(false, "");
                            return false
                        } else if (_gold == "") {
                            p3hasErr = false;
                            _self.showParlayErrorMsg(false, "");
                            return false
                        } else {
                            if (_countErr == 0 && p3Error == "") {
                                _self.showParlayErrorMsg(false, "");
                                _self.showParlayLimit(false, 0)
                            }
                            p3hasErr = false;
                            return true
                        }
                    } else if (ret != "" && !isFirst) {
                        _self.setSingleErrorMsg(_ECID, ret, errorValue, org);
                        _self.showSingleErrorMsg(_ECID, true);
                        return false
                    } else if (isFirst && ret != "") {
                        _self.setSingleErrorMsg(_ECID, "");
                        _self.showSingleErrorMsg(_ECID, false);
                        return false
                    } else {
                        var err_len = util.countSize(errorCode);
                        if (err_len == 0) {
                            _self.setSingleErrorMsg(_ECID, "");
                            _self.showSingleErrorMsg(_ECID, false)
                        } else if (_gold == "") {
                            _self.setSingleErrorMsg(_ECID, "");
                            _self.showSingleErrorMsg(_ECID, false)
                        } else
                            for (var _tmpECID in errorCode)
                                if (_tmpECID != _ECID && !util.in_object(_ECID, errorCode)) {
                                    _self.setSingleErrorMsg(_ECID, "");
                                    _self.showSingleErrorMsg(_ECID, false)
                                }
                        if (_gold == "")
                            return false;
                        return true
                    }
                }
                ;
                _self.orderTotalView = function() {
                    top["isOrderView"] = true;
                    var betStr = "";
                    for (var x in top.bet_viewdata) {
                        var _betKey = top.bet_viewdata[x];
                        betStr += _self.totalParamHash[_betKey]["ecid"] + "!";
                        betStr += _self.totalParamHash[_betKey]["gtype"] + "!";
                        betStr += _self.totalParamHash[_betKey]["gid"] + "!";
                        if (_self.totalParamHash[_betKey]["keepwtype"] == "FS")
                            betStr += _self.totalParamHash[_betKey]["keepwtype"] + "!";
                        else
                            betStr += _self.totalParamHash[_betKey]["wtype"] + "!";
                        betStr += _self.totalParamHash[_betKey]["rtype"] + "!";
                        if (_self.totalParamHash[_betKey]["keepwtype"] == "FS")
                            betStr += _self.totalParamHash[_betKey]["rtype"] + "^";
                        else
                            betStr += _self.totalParamHash[_betKey]["chose_team"] + "^"
                    }
                    var needsP3 = parentClass.checkNeedsParlay(top["totalBetHash"]);
                    if (betStr.substr(-1, 1) == "^")
                        betStr = betStr.substr(0, betStr.length - 1);
                    var goPage = "Total_order_view";
                    var urlParams = "";
                    urlParams += "odd_f_type=" + top["userData"].odd_f_type;
                    urlParams += "&betStr=" + betStr;
                    urlParams += "&code=getOrderview";
                    urlParams += "&needsP3=" + (needsP3 ? "Y" : "N");
                    urlParams = "p=" + goPage + "&" + top.param + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.orderTotalViewComplete);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.orderTotalViewComplete = function(xml) {
                    echo("========[orderTotalViewComplete]========");
                    _self.paramHash["errorMsg"] = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(_self.paramHash["errorMsg"]))
                        return;
                    for (var _key in top["dgStatus_hash"])
                        if (timerHash["dgTimer_" + _key] != null) {
                            top["dgStatus_hash"][_key] = "isToast";
                            timerHash["dgTimer_" + _key]._status = "isToast"
                        }
                    try {
                        var xmdObj = new Object;
                        xmlnode = util.parseXml(xml);
                        atLeastNeedChg = false;
                        p3NeedChg = false;
                        top["total_bet_sw"] = xmlnode.Node(xmlnode.Root[0], "total_bet_sw").innerHTML;
                        xmdObj["betslip"] = xmlnode.Node(xmlnode.Root[0], "betslip", false);
                        xmdObj["parlay"] = xmlnode.Node(xmlnode.Root[0], "parlay", false)[0];
                        xmdObj["parlayCode"] = xmlnode.Node(xmdObj["parlay"], "code");
                        xmdObj["parlayErrMsg"] = xmlnode.Node(xmdObj["parlay"], "errormsg");
                        SYSTIME = xmlnode.Node(xmlnode.Root[0], "SYSTIME").innerHTML.split(" ")[0];
                        Credit["today"] = xmlnode.Node(xmlnode.Root[0], "today_credit").innerHTML;
                        Credit["yesterday"] = xmlnode.Node(xmlnode.Root[0], "yesterday_credit").innerHTML;
                        parentClass.dispatchEvent("setLastGold", false);
                        if (top["total_bet_sw"] == "N") {
                            if (!util.in_array("totalBet_close", errorAry))
                                errorAry.push("totalBet_close");
                            _self.showOrderMsg(true)
                        } else if (util.in_array("totalBet_close", errorAry))
                            _self.spliceErrAry("totalBet_close", errorAry);
                        var _betSize = util.countSize(top["bet_select"]);
                        if (_betSize > 1)
                            if (xmdObj["parlayCode"].innerHTML == "541" || xmdObj["parlayCode"].innerHTML == "590") {
                                lockBetNum["p3"] = false;
                                top.isSystemError = false;
                                p3NeedChg = false;
                                if (top["locked_slip"]["p3"] != null && top["locked_slip"]["single"] != null) {
                                    delete top["locked_slip"]["p3"];
                                    delete top["locked_slip"]["single"]
                                }
                                _self.setLocked("remove", "parlay");
                                _self.setLocked("remove", "single");
                                parentClass.dispatchEvent("setLoadingBetVisible", false);
                                _self.totalParamHash["p3"] = new Object;
                                _self.totalParamHash["p3"]["pickDate"] = "";
                                _self.totalParamHash["p3"]["betData"] = "";
                                var _size = util.countSize(top["bet_select"]);
                                errP3Ary = new Object;
                                _self.clearDots();
                                _self.setMutiBetslipCount(_size);
                                if (isCnf["p3"]) {
                                    for (var w = 0; w < systemErrAry.length; w++)
                                        _self.spliceErrAry(systemErrAry[w], errorAry);
                                    isCnf["p3"] = false
                                } else
                                    isCnf["p3"] = false;
                                if (util_game.isSystemError(p3Error)) {
                                    if (util.in_array(p3Error, errorAry))
                                        _self.spliceErrAry(p3Error, errorAry);
                                    if (errorAry.length == 0)
                                        _self.showOrderMsg(false);
                                    p3Error = ""
                                } else if (p3Error == "1X001" || p3Error == "1X034" || p3Error == "1X032" || p3Error == "1X027") {
                                    p3Error = "";
                                    _self.showParlayErrorMsg(false, "");
                                    _self.showParlayLimit(false, 0)
                                } else if (p3Error == "1X018" || p3Error == "1X023")
                                    p3NeedChg = true;
                                else if (util_game.isChgIor(p3Error) || util_game.isChgConcede(p3Error)) {
                                    if (firstErr)
                                        for (var _ecid in errP3ChgAry) {
                                            var targetObj = dom.getElementById("betslip_locked_" + _ecid);
                                            util.addClass(targetObj, "highlight")
                                        }
                                    p3NeedChg = true
                                }
                                if (errorAry.length == 0)
                                    _self.showOrderMsg(false);
                                xmdObj["game"] = xmlnode.Node(xmdObj["parlay"], "game", false);
                                var tmpIor;
                                var isRP3 = false;
                                for (var i = 0; i < xmdObj["game"].length; i++) {
                                    var tmp_game = xmdObj["game"][i];
                                    var _gidStr = tmp_game.getAttribute("id");
                                    var tmpGid = xmlnode.Node(tmp_game, "gid").innerHTML;
                                    var rtype = xmlnode.Node(tmp_game, "rtype").innerHTML;
                                    var wtype = xmlnode.Node(tmp_game, "wtype").innerHTML;
                                    var strong = xmlnode.Node(tmp_game, "strong").innerHTML;
                                    var concede = xmlnode.Node(tmp_game, "concede").innerHTML;
                                    var ratio = xmlnode.Node(tmp_game, "ratio").innerHTML;
                                    var ioratio = xmlnode.Node(tmp_game, "ioratio").innerHTML;
                                    var date = xmlnode.Node(tmp_game, "date").innerHTML;
                                    if (!isRP3)
                                        isRP3 = wtype == "RP3" ? true : false;
                                    if (i == 0)
                                        tmpIor = ioratio;
                                    else
                                        tmpIor = util.mulFloat(tmpIor * 1, ioratio * 1);
                                    if (_self.totalParamHash["p3"]["pickDate"] == "")
                                        _self.totalParamHash["p3"]["pickDate"] += date;
                                    else
                                        _self.totalParamHash["p3"]["pickDate"] += "^" + date;
                                    _self.totalParamHash["p3"]["betData"] += tmpGid + "!" + rtype + "!" + strong + "!" + concede + "!" + ratio + "!" + ioratio + "!" + date + "^";
                                    var restsinglecredit = xmlnode.Node(tmp_game, "restsinglecredit").innerHTML;
                                    _self.totalParamHash["p3"][_gidStr] = restsinglecredit
                                }
                                _mc["parlay_ior"].innerHTML = util.showTxt(util.ignoreDots(tmpIor, 2));
                                _self.totalParamHash["p3"]["ioratio"] = tmpIor;
                                _self.totalParamHash["p3"]["keepwtype"] = isRP3 ? "RP3" : "P3";
                                _self.totalParamHash["p3"]["gtype"] = xmlnode.Node(xmdObj["parlay"], "gtype").innerHTML;
                                _self.totalParamHash["p3"]["mem_sc"] = xmlnode.Node(xmdObj["parlay"], "mem_sc").innerHTML;
                                _self.totalParamHash["p3"]["mem_so"] = xmlnode.Node(xmdObj["parlay"], "mem_so").innerHTML;
                                _self.totalParamHash["p3"]["game_sc"] = xmlnode.Node(xmdObj["parlay"], "game_sc").innerHTML;
                                _self.totalParamHash["p3"]["game_so"] = xmlnode.Node(xmdObj["parlay"], "game_so").innerHTML;
                                _self.totalParamHash["p3"]["orderviewTS"] = xmlnode.Node(xmdObj["parlay"], "ts").innerHTML;
                                _limit["p3"] = new Object;
                                _limit["p3"]["max"] = xmlnode.Node(xmdObj["parlay"], "gold_gmax").innerHTML;
                                _limit["p3"]["min"] = xmlnode.Node(xmdObj["parlay"], "gold_gmin").innerHTML;
                                _limit["p3"]["currency"] = xmlnode.Node(xmdObj["parlay"], "currency").innerHTML;
                                myhash["_limit"] = _limit;
                                _mc["max_limit_p3"].innerHTML = util.showTxt(util.formatThousand(xmlnode.Node(xmdObj["parlay"], "gold_gmax").innerHTML));
                                _self.showParlay(true);
                                var _tarECID = keyboardObj.getTarget();
                                if (_tarECID == "p3")
                                    _self.updateEvent("p3")
                            } else {
                                _self.clearDots();
                                _self.showParlayLimit(false, 0);
                                var parlay_errCode = xmlnode.Node(xmdObj["parlay"], "code").innerHTML;
                                var parlay_errMsg = xmlnode.Node(xmdObj["parlay"], "errormsg").innerHTML;
                                p3Error = parlay_errMsg;
                                if (isCnf["p3"]) {
                                    for (var v = 0; v < systemErrAry.length; v++)
                                        _self.spliceErrAry(systemErrAry[v], errorAry);
                                    isCnf["p3"] = false
                                } else
                                    isCnf["p3"] = false;
                                if (parlay_errCode == "connectFail") {
                                    top.isSystemError = true;
                                    _self.OrdercloseKeyboard(true);
                                    if (!util.in_array(parlay_errCode, errorAry))
                                        errorAry.push(parlay_errCode);
                                    _self.showOrderMsg(true);
                                    isCnf["p3"] = true;
                                    for (var i = 0; i < xmdObj["betslip"].length; i++) {
                                        var betslipObj = xmdObj["betslip"][i];
                                        var _ECID = betslipObj.getAttribute("id").split("_")[1];
                                        var betKey = betslipObj.getAttribute("id");
                                        var _idKey = _self.idKeyHash[betKey];
                                        var betObj = dom.getElementById("betslip_" + _idKey);
                                        var bet_ids = ",bet_ior,bet_score,";
                                        var betInfoObj = util.getObjAry(betObj, bet_ids);
                                        betInfoObj["bet_ior"].className = "word_red";
                                        betInfoObj["bet_ior"].innerHTML = "-";
                                        betInfoObj["bet_score"].style.display = "none";
                                        _self.totalParamHash[betKey]["ioratio"] = "-";
                                        lockBetNum[_ECID] = true
                                    }
                                    parentClass.dispatchEvent("enabledBet", false);
                                    parentClass.dispatchEvent("showInfoLoading", false);
                                    lockBetNum["p3"] = true;
                                    return
                                }
                                var parlay_ior = dom.getElementById("parlay_ior");
                                var wingold_p3 = dom.getElementById("bet_wingold_p3");
                                if (parlay_errCode == "noP3" && parlay_errMsg == "1X034") {
                                    var _errGame = _self.checkNoParlay(top["totalBetHash"]);
                                    _self.showParlay(false);
                                    _self.clearDots();
                                    if (_errGame != "crossGtype") {
                                        for (var i = 0; i < _errGame.length; i++) {
                                            var error_gid = _errGame[i];
                                            var _ecid = top["bet_ECID"]["gid_" + error_gid];
                                            errP3Ary[_ecid] = error_gid;
                                            _mc["dots_" + _ecid] = dom.getElementById("dots_" + _ecid);
                                            util.addClass(_mc["dots_" + _ecid], "no_parlayin")
                                        }
                                        _self.showParlayErrorMsg(true, parlay_errMsg)
                                    }
                                    delete limit_allowBets["p3"];
                                    if (top.mobile != "Y")
                                        dom.getElementById("bet_gold_p3_pc").value = "";
                                    else
                                        dom.getElementById("bet_gold_p3").innerHTML = "";
                                    dom.getElementById("bet_gold_tt_p3" + is_PC).style.display = "";
                                    _self.calcTotal();
                                    lockBetNum["p3"] = true
                                } else {
                                    if (_self.totalParamHash["p3"] == null)
                                        _self.totalParamHash["p3"] = new Object;
                                    if (util_game.isSystemError(parlay_errMsg)) {
                                        _self.showParlay(true);
                                        top.isSystemError = true;
                                        isCnf["p3"] = true;
                                        if (!util.in_array(parlay_errMsg, errorAry))
                                            errorAry.push(parlay_errMsg);
                                        _self.showOrderMsg(true);
                                        parentClass.dispatchEvent("enabledBet", false);
                                        parlay_ior.innerHTML = "-";
                                        wingold_p3.innerHTML = "- -";
                                        wingold_p3.className = "word_bold";
                                        _self.totalParamHash["p3"]["ioratio"] = "-";
                                        lockBetNum["p3"] = true
                                    } else if (parlay_errMsg == "1X001") {
                                        _self.showParlay(true);
                                        _self.showParlayErrorMsg(true, parlay_errMsg);
                                        _self.setLocked("set", "parlay");
                                        _self.setLocked("set", "single");
                                        parlay_ior.innerHTML = "-";
                                        wingold_p3.innerHTML = "- -";
                                        wingold_p3.className = "word_bold";
                                        if (_self.totalParamHash["p3"] != null)
                                            _self.totalParamHash["p3"]["ioratio"] = "-";
                                        var p3_gold = top.mobile != "Y" ? _mc["bet_gold_p3"].value : _mc["bet_gold_p3"].innerHTML;
                                        if (p3_gold != "")
                                            p3NeedChg = true;
                                        lockBetNum["p3"] = true
                                    } else if (parlay_errMsg == "1X034") {
                                        _self.showParlay(false);
                                        _self.showParlayErrorMsg(true, parlay_errMsg);
                                        xmdObj["errorGame"] = xmlnode.Node(xmdObj["parlay"], "errorgame", false);
                                        if (xmdObj["errorGame"].length != 0) {
                                            _self.clearDots();
                                            for (var i = 0; i < xmdObj["errorGame"].length; i++) {
                                                var error_gid = xmdObj["errorGame"][i].innerHTML;
                                                var _ecid = top["bet_ECID"]["gid_" + error_gid];
                                                errP3Ary[_ecid] = error_gid;
                                                _mc["dots_" + _ecid] = dom.getElementById("dots_" + _ecid);
                                                util.addClass(_mc["dots_" + _ecid], "no_parlayin")
                                            }
                                        }
                                        dom.getElementById("bet_gold_p3").innerHTML = "";
                                        dom.getElementById("bet_gold_p3_pc").value = "";
                                        dom.getElementById("bet_gold_tt_p3" + is_PC).style.display = "";
                                        _self.calcTotal();
                                        lockBetNum["p3"] = true
                                    } else if (parlay_errMsg == "1X027") {
                                        par_limit_min = xmlnode.Node(xmdObj["parlay"], "par_limit_min").innerHTML;
                                        par_limit_max = xmlnode.Node(xmdObj["parlay"], "par_limit_max").innerHTML;
                                        var _betSize = util.countSize(top["bet_select"]);
                                        var errMsg = "";
                                        if (_betSize < par_limit_min) {
                                            errMsg = "1X032";
                                            _self.showParlayLimit(true, par_limit_min)
                                        } else if (_betSize > par_limit_max)
                                            errMsg = parlay_errMsg;
                                        _self.showParlay(false);
                                        _self.showParlayErrorMsg(true, errMsg);
                                        lockBetNum["p3"] = true
                                    } else if (parlay_errMsg == "1X002" || parlay_errMsg == "1X003") {
                                        _self.setLocked("remove", "parlay");
                                        _self.showParlay(true);
                                        _self.showParlayErrorMsg(true, parlay_errMsg);
                                        lockBetNum["p3"] = true
                                    } else if (parlay_errMsg == "1X013") {
                                        _self.setLocked("remove", "parlay");
                                        _self.showParlay(true);
                                        _self.showParlayErrorMsg(true, parlay_errMsg);
                                        parlay_ior.innerHTML = "-";
                                        wingold_p3.innerHTML = "- -";
                                        wingold_p3.className = "word_bold";
                                        _self.totalParamHash["p3"]["ioratio"] = "-";
                                        lockBetNum["p3"] = true
                                    } else {
                                        _self.showParlay(false);
                                        if (util_game.isOrderLevel(parlay_errMsg)) {
                                            if (!util.in_array(parlay_errMsg, errorAry))
                                                errorAry.push(parlay_errMsg);
                                            _self.showOrderMsg(true);
                                            parentClass.dispatchEvent("enabledBet", false)
                                        }
                                        _self.showParlayErrorMsg(true, parlay_errMsg)
                                    }
                                }
                            }
                        else if (_betSize == 1) {
                            _self.clearDots();
                            _self.showParlayErrorMsg(false, "");
                            _self.showParlayLimit(false, 0)
                        }
                        myhash["errorAry"] = errorAry;
                        myhash["errP3Ary"] = errP3Ary;
                        if (xmdObj["betslip"].length != 0) {
                            for (var i = 0; i < xmdObj["betslip"].length; i++) {
                                var betslipObj = xmdObj["betslip"][i];
                                var betKey = betslipObj.getAttribute("id");
                                var _idKey = _self.idKeyHash[betKey];
                                var _ECID = betslipObj.getAttribute("id").split("_")[1];
                                var _GTYPE = betslipObj.getAttribute("id").split("_")[0];
                                if (_GTYPE != "FT") {
                                    _GTYPE = "OP";
                                    allFT = false
                                } else {
                                    _GTYPE = "FT";
                                    allOP = false
                                }
                                lockBetNum[_ECID] = false;
                                stillError = false;
                                xmdObj["code"] = xmlnode.Node(betslipObj, "code");
                                if (xmdObj["code"].innerHTML == "501") {
                                    top.isSystemError = false;
                                    var total_bet_sw = top["total_bet_sw"] != "N";
                                    _self.setLocked("remove", "specific", _ECID);
                                    if (top["locked_slip"][_ECID] != null)
                                        delete top["locked_slip"][_ECID];
                                    if (top["closeGame"][_ECID] != null)
                                        delete top["closeGame"][_ECID];
                                    _self.enableToBet(total_bet_sw, _ECID);
                                    parentClass.dispatchEvent("setLoadingBetVisible", false);
                                    _mc["betslip_" + _idKey] = dom.getElementById("betslip_" + _idKey);
                                    var bet_ids = ",bet_menutype,bet_team_h,bet_team_c,bet_league,bet_ior,max_limit,bet_con,bet_con_c,bet_chose_con,bet_chose_team,bet_score,";
                                    var betInfoObj = util.getObjAry(_mc["betslip_" + _idKey], bet_ids);
                                    var dataHash = util.convertNodeToHash(betslipObj);
                                    _self.totalParamHash[betKey] = util.mergeHash(_self.totalParamHash[betKey], dataHash);
                                    _self.totalParamHash[betKey]["orderviewTS"] = util.showTxt(xmlnode.Node(betslipObj, "ts").innerHTML);
                                    var imp = _self.totalParamHash[betKey]["imp"];
                                    var ptype = _self.totalParamHash[betKey]["ptype"];
                                    var team_h = util.showTxt(xmlnode.Node(betslipObj, "team_name_h").innerHTML);
                                    var team_c = util.showTxt(xmlnode.Node(betslipObj, "team_name_c").innerHTML);
                                    top["ptypeHash"][_self.totalParamHash[betKey]["gid"]] = new Object;
                                    top["ptypeHash"][_self.totalParamHash[betKey]["gid"]].keepwtype = _self.totalParamHash[betKey]["keepwtype"];
                                    top["ptypeHash"][_self.totalParamHash[betKey]["gid"]].imp = imp;
                                    top["ptypeHash"][_self.totalParamHash[betKey]["gid"]].ptype = ptype;
                                    top["ptypeHash"][_self.totalParamHash[betKey]["gid"]].showtype = _self.totalParamHash[betKey]["showtype"];
                                    top["ptypeHash"][_self.totalParamHash[betKey]["gid"]].ms = _self.totalParamHash[betKey]["ms"];
                                    _mc["div_icon_info_bet_" + _ECID] = dom.getElementById("div_icon_info_bet_" + _ECID);
                                    if (_self.totalParamHash[betKey]["isFantasy"] == "Y") {
                                        _mc["div_icon_info_bet_i_" + _ECID] = dom.getElementById("div_icon_info_bet_i_" + _ECID);
                                        _mc["div_icon_info_bet_" + _ECID].style.display = "";
                                        util.addEvent(_mc["div_icon_info_bet_i_" + _ECID], "click", _self.AlertFantasyInfo, _self.totalParamHash[betKey]["fantasyObj"])
                                    } else
                                        _mc["div_icon_info_bet_" + _ECID].style.display = "none";
                                    if (imp == "Y") {
                                        team_h = team_h.replace(ptype, "");
                                        team_c = team_c.replace(ptype, "")
                                    }
                                    betInfoObj["bet_team_h"].innerHTML = team_h;
                                    betInfoObj["bet_team_c"].innerHTML = team_c;
                                    betInfoObj["bet_league"].innerHTML = util.showTxt(xmlnode.Node(betslipObj, "league_name").innerHTML);
                                    var bet_wtype = util_game.chgTwtype(_self.totalParamHash[betKey]["wtype"], _self.totalParamHash[betKey]["rtype"]);
                                    var isChangeIor = util_game.isChgIor(errorCode[_ECID]) ? true : false;
                                    var tmpIor = util.showTxt(util_game.getOrderIoratio(_self.totalParamHash[betKey]["ioratio"], null, bet_wtype));
                                    var baseIorClass = util_game.checkIorClass(tmpIor);
                                    betInfoObj["bet_ior"].className = baseIorClass;
                                    betInfoObj["bet_ior"].innerHTML = tmpIor;
                                    var _limitKey = _self.totalParamHash[betKey]["gtype"].toUpperCase() + "_" + _self.totalParamHash[betKey]["ecid"];
                                    _limit[_limitKey]["max"] = _self.totalParamHash[betKey]["gold_gmax"];
                                    _limit[_limitKey]["min"] = _self.totalParamHash[betKey]["gold_gmin"];
                                    _limit[_limitKey]["currency"] = _self.totalParamHash[betKey]["currency"];
                                    myhash["_limit"] = _limit;
                                    betInfoObj["max_limit"].innerHTML = util.showTxt(util.formatThousand(_self.totalParamHash[betKey]["gold_gmax"]));
                                    var strong = util.showTxt(xmlnode.Node(betslipObj, "strong").innerHTML);
                                    var ratio = xmlnode.Node(betslipObj, "spread").innerHTML;
                                    var isChangeConcede = util_game.isChgConcede(errorCode[_ECID]) ? true : false;
                                    var conObj = util_game.getConcedeStr(_self.totalParamHash[betKey]["keepwtype"], strong, ratio);
                                    if (util_game.checkWtypeIsR(_self.totalParamHash[betKey]["keepwtype"])) {
                                        var color = "word_yellow";
                                        if (_self.totalParamHash[betKey]["keepwtype"] == "W3")
                                            color = "word_red";
                                        betInfoObj["bet_con"].innerHTML = "";
                                        betInfoObj["bet_con_c"].innerHTML = "";
                                        betInfoObj["bet_con"].style.display = "none";
                                        betInfoObj["bet_con_c"].style.display = "none";
                                        betInfoObj["bet_chose_con"].className = color
                                    } else {
                                        betInfoObj["bet_con"].className = "word_red";
                                        betInfoObj["bet_con_c"].className = "word_red";
                                        betInfoObj["bet_con"].innerHTML = conObj["bet_finish_con"];
                                        betInfoObj["bet_con_c"].innerHTML = conObj["bet_finish_con_c"]
                                    }
                                    var _betslip = dom.getElementById("betslip_locked_" + _ECID);
                                    if ((isChangeIor || isChangeConcede) && firstErr)
                                        util.addClass(_betslip, "highlight");
                                    else if (!firstErr)
                                        util.removeClass(_betslip, "highlight");
                                    _self.totalParamHash[betKey]["ordercon"] = util.showTxt(betInfoObj["bet_con"].innerHTML);
                                    _self.totalParamHash[betKey]["ordercon_c"] = util.showTxt(betInfoObj["bet_con_c"].innerHTML);
                                    var period = xmlnode.Node(betslipObj, "period").innerHTML;
                                    var ratioR = util_game.transRatioStr(period, xmlnode.Node(betslipObj, "spread").innerHTML);
                                    if (!util_game.checkWtypeIsOU(_self.totalParamHash[betKey]["keepwtype"]) && _self.totalParamHash[betKey]["keepwtype"] != "W3")
                                        if (util_game.checkWtypeIsR(_self.totalParamHash[betKey]["keepwtype"])) {
                                            var _abs = "";
                                            var chose = _self.totalParamHash[betKey]["chose_team"];
                                            if (chose == "N")
                                                chose = "H";
                                            if (ratioR != 0)
                                                if (strong == chose)
                                                    _abs = "-";
                                                else
                                                    _abs = "+";
                                            betInfoObj["bet_chose_con"].innerHTML = _abs + util.showTxt(ratioR);
                                            betInfoObj["bet_chose_con"].style.display = ""
                                        } else {
                                            betInfoObj["bet_chose_con"].innerHTML = "";
                                            betInfoObj["bet_chose_con"].style.display = "none"
                                        }
                                    else {
                                        var _abs = "";
                                        if (_self.totalParamHash[betKey]["keepwtype"] == "W3") {
                                            var chose = _self.totalParamHash[betKey]["chose_team"];
                                            if (chose == "N")
                                                chose = "H";
                                            if (strong == chose)
                                                _abs = "-";
                                            else
                                                _abs = "+"
                                        }
                                        betInfoObj["bet_chose_con"].innerHTML = _abs + util.showTxt(ratioR);
                                        betInfoObj["bet_chose_con"].style.display = ""
                                    }
                                    var chose_team;
                                    var _rtype = _self.totalParamHash[betKey]["show_rtype"].toLowerCase();
                                    if (_self.totalParamHash[betKey]["gtype"].toUpperCase() == "BS" && util_game.checkWtypeIsWM(_self.totalParamHash[betKey]["keepwtype"]))
                                        chose_team = LS_game.get(_rtype + "_" + _self.totalParamHash[betKey]["gtype"].toLowerCase());
                                    else if (LS_game.get(_rtype) == "") {
                                        var Ftype = "_F_RF_DC_RDC_";
                                        if (Ftype.indexOf("_" + _self.totalParamHash[betKey]["wtype"].toUpperCase() + "_") >= 0) {
                                            f1 = _self.totalParamHash[betKey]["rtype"].toUpperCase().replace(_self.totalParamHash[betKey]["wtype"].toUpperCase(), "").substr(0, 1);
                                            f2 = _self.totalParamHash[betKey]["rtype"].toUpperCase().replace(_self.totalParamHash[betKey]["wtype"].toUpperCase(), "").substr(1, 1);
                                            chose_team = "";
                                            if (f1 == "N")
                                                chose_team += LS_game.get("mn");
                                            else {
                                                chose_team += xmlnode.Node(betslipObj, "team_name_" + f1.toLowerCase()).innerHTML;
                                                if (imp == "Y")
                                                    chose_team = chose_team.replace(ptype, "")
                                            }
                                            chose_team += " / ";
                                            if (f2 == "N")
                                                chose_team += LS_game.get("mn");
                                            else {
                                                chose_team += xmlnode.Node(betslipObj, "team_name_" + f2.toLowerCase()).innerHTML;
                                                if (imp == "Y")
                                                    chose_team = chose_team.replace(ptype, "")
                                            }
                                        } else {
                                            chose_team = xmlnode.Node(betslipObj, "team_name_" + _self.totalParamHash[betKey]["keepchose_team"].toLowerCase()).innerHTML;
                                            if (imp == "Y")
                                                chose_team = chose_team.replace(ptype, "")
                                        }
                                    } else {
                                        var team_h = xmlnode.Node(betslipObj, "team_name_h").innerHTML;
                                        var team_c = xmlnode.Node(betslipObj, "team_name_c").innerHTML;
                                        chose_team = LS_game.get(_rtype);
                                        chose_team = chose_team.replace(/\*TEAM_H\*/g, team_h);
                                        chose_team = chose_team.replace(/\*TEAM_C\*/g, team_c)
                                    }
                                    if (imp == "Y") {
                                        var tmp_ptype = ptype.replace(/\(/g, "\(").replace(/\)/g, "\)");
                                        var re = new RegExp(tmp_ptype,"g");
                                        chose_team = chose_team.replace(re, "")
                                    }
                                    var tmp_team = "";
                                    var get_team = util_game.getTeamWM(_self.totalParamHash[betKey]["show_rtype"]);
                                    if (get_team != null)
                                        tmp_team = util.showTxt(betInfoObj["bet_team_" + get_team].innerHTML) + " - ";
                                    if (chose_team != null) {
                                        chose_team = chose_team.replace(/\*TEAM_H\*/g, util.showTxt(betInfoObj["bet_team_h"].innerHTML));
                                        chose_team = chose_team.replace(/\*TEAM_C\*/g, util.showTxt(betInfoObj["bet_team_c"].innerHTML));
                                        betInfoObj["bet_chose_team"].innerHTML = tmp_team + util.showTxt(chose_team).replace("[Mid]", "").replace("[\u4e2d]", "")
                                    }
                                    _self.totalParamHash[betKey]["bet_chose_team"] = betInfoObj["bet_chose_team"].innerHTML;
                                    _self.totalParamHash[betKey]["bet_chose_con"] = betInfoObj["bet_chose_con"].innerHTML;
                                    var tmp_score = util.showTxt(xmlnode.Node(betslipObj, "score").innerHTML);
                                    tmp_score = "(" + tmp_score.replace(":", " - ") + ")";
                                    if (_self.totalParamHash[betKey]["gtype"] == "FT") {
                                        betInfoObj["bet_score"].innerHTML = util_game.needToShowScore(_self.totalParamHash[betKey]["keepwtype"]) ? tmp_score : "";
                                        betInfoObj["bet_score"].style.display = util_game.needToShowScore(_self.totalParamHash[betKey]["keepwtype"]) ? "" : "none";
                                        if (util_game.needToShowScore(_self.totalParamHash[betKey]["keepwtype"]) && keepScore[_ECID] == null)
                                            keepScore[_ECID] = tmp_score;
                                        betInfoObj["bet_score"].className = "word_yellow"
                                    } else {
                                        betInfoObj["bet_score"].innerHTML = "";
                                        betInfoObj["bet_score"].style.display = "none"
                                    }
                                    var getMenuHash = new Object;
                                    getMenuHash.gid = _self.totalParamHash[betKey]["gid"];
                                    getMenuHash.gtype = _self.totalParamHash[betKey]["gtype"];
                                    getMenuHash.showtype = _self.totalParamHash[betKey]["showtype"];
                                    getMenuHash.wtype = _self.totalParamHash[betKey]["keepwtype"];
                                    getMenuHash.rtype = _self.totalParamHash[betKey]["rtype"];
                                    getMenuHash.ms = _self.totalParamHash[betKey]["ms"];
                                    getMenuHash.team_h = team_h;
                                    getMenuHash.team_c = team_c;
                                    getMenuHash.imp = imp;
                                    getMenuHash.ptype = ptype;
                                    var FTmenutype = util_game.getWtypeName(LS_game, getMenuHash.gid, getMenuHash.showtype, getMenuHash.gtype, getMenuHash.wtype, getMenuHash.rtype, getMenuHash.ms, getMenuHash.team_h, getMenuHash.team_c, getMenuHash.imp, getMenuHash.ptype, _self.totalParamHash[betKey]);
                                    betInfoObj["bet_menutype"].innerHTML = FTmenutype;
                                    var tmpBetGold = dom.getElementById("bet_gold_" + _ECID + is_PC);
                                    var tmpBetGold_str = top.mobile != "Y" ? tmpBetGold.value : tmpBetGold.innerHTML;
                                    var tmpWinGold = dom.getElementById("bet_wingold_" + _ECID);
                                    if (tmpIor * 1 == 0 || tmpIor == "-") {
                                        tmpWinGold.className = "word_bold";
                                        tmpWinGold.innerHTML = "-";
                                        lockBetNum[_ECID] = true
                                    }
                                    if (isCnf[_ECID]) {
                                        for (var b = 0; b < systemErrAry.length; b++)
                                            _self.spliceErrAry(systemErrAry[b], errorAry);
                                        isCnf[_ECID] = false
                                    } else
                                        isCnf[_ECID] = false;
                                    if (util_game.isSystemError(errorCode[_ECID])) {
                                        if (util.in_array(errorCode[_ECID], errorAry))
                                            _self.spliceErrAry(errorCode[_ECID], errorAry);
                                        if (errorAry.length == 0)
                                            _self.showOrderMsg(false);
                                        delete errorCode[_ECID]
                                    } else if (util_game.isRemoveClose(errorCode[_ECID])) {
                                        _self.showSingleErrorMsg(_ECID, false);
                                        delete errorCode[_ECID]
                                    }
                                    if (util_game.isChgIor(errorCode[_ECID]) || util_game.isChgConcede(errorCode[_ECID]) || util_game.isRemoveClose(errorCode[_ECID]) && tmpBetGold_str != "" || util_game.isOverSingleCredit(errorCode[_ECID])) {
                                        atLeastNeedChg = true;
                                        if (util_game.needToShowScore(_self.totalParamHash[betKey]["keepwtype"]) && keepScore[_ECID] != null && keepScore[_ECID] != "" && keepScore[_ECID] != tmp_score)
                                            betInfoObj["bet_score"].className = "word_oddbg"
                                    } else if (errorCode[_ECID] == "1X004") {
                                        var _betKey = top.bet_viewdata["ec_" + _ECID];
                                        limit_allowBets[_betKey] = false
                                    } else if (errorCode[_ECID] == null)
                                        if (needsToRebuild)
                                            _self.showSingleErrorMsg(_ECID, false);
                                    if (errorAry.length == 0) {
                                        for (var _key in isCnf)
                                            if (isCnf[_key])
                                                stillError = true;
                                        if (!stillError)
                                            _self.showOrderMsg(false)
                                    }
                                    if (_self.totalParamHash[betKey]["gtype"] == "FT" && util_game.needToShowScore(_self.totalParamHash[betKey]["keepwtype"]))
                                        keepScore[_ECID] = tmp_score;
                                    var _param = new Object;
                                    _param["target"] = tmpBetGold;
                                    _param["bet_wingold"] = tmpWinGold;
                                    _param["betKey"] = betKey;
                                    _param["ECID"] = _ECID;
                                    if (total_bet_sw)
                                        _self._calcWinGold(_param)
                                } else if (xmdObj["code"].innerHTML == "531") {
                                    top.isSystemError = false;
                                    _self.setLocked("remove", "specific", _ECID);
                                    if (top["locked_slip"][_ECID] != null)
                                        delete top["locked_slip"][_ECID];
                                    var total_bet_sw = top["total_bet_sw"] != "N";
                                    _self.enableToBet(total_bet_sw, _ECID);
                                    parentClass.dispatchEvent("setLoadingBetVisible", false);
                                    _mc["betslip_" + _idKey] = dom.getElementById("betslip_" + _idKey);
                                    var bet_ids = ",bet_team_h,bet_team_c,bet_league,bet_ior,max_limit,bet_con,bet_con_c,bet_chose_con,bet_chose_team,bet_score,";
                                    var betInfoObj = util.getObjAry(_mc["betslip_" + _idKey], bet_ids);
                                    var dataHash = util.convertNodeToHash(betslipObj);
                                    top["ptypeHash"][_self.totalParamHash[betKey]["gid"]] = new Object;
                                    top["ptypeHash"][_self.totalParamHash[betKey]["gid"]].keepwtype = "FS";
                                    var allName = xmlnode.Node(betslipObj, "score");
                                    betInfoObj["bet_chose_team"].innerHTML = util.showTxt(allName.innerHTML);
                                    _self.totalParamHash[betKey] = util.mergeHash(_self.totalParamHash[betKey], dataHash);
                                    _self.totalParamHash[betKey]["orderviewTS"] = util.showTxt(xmlnode.Node(betslipObj, "ts").innerHTML);
                                    betInfoObj["bet_team_h"].innerHTML = "";
                                    betInfoObj["bet_team_c"].innerHTML = "";
                                    var isChangeIor = util_game.isChgIor(errorCode[_ECID]) ? true : false;
                                    var tmpIor = util.showTxt(util_game.getOrderIoratio(_self.totalParamHash[betKey]["ioratio"], null, "FS"));
                                    var baseIorClass = util_game.checkIorClass(tmpIor);
                                    betInfoObj["bet_ior"].className = baseIorClass;
                                    betInfoObj["bet_ior"].innerHTML = tmpIor;
                                    var rtypename = "";
                                    var _subTitle = xmlnode.Node(betslipObj, "team_name_h").innerHTML;
                                    var _subPlayType = xmlnode.Node(betslipObj, "team_name_c").innerHTML;
                                    if (_self.totalParamHash[betKey]["bet_now"] == "FS")
                                        rtypename = util.showTxt(_subTitle);
                                    else if (_self.totalParamHash[betKey]["bet_now"] == "SFS")
                                        rtypename = util.showTxt(_subTitle) + " " + util.showTxt(_subPlayType);
                                    betInfoObj["bet_league"].innerHTML = util.showTxt(xmlnode.Node(betslipObj, "league_name").innerHTML) + " " + rtypename;
                                    var _limitKey = _self.totalParamHash[betKey]["gtype"].toUpperCase() + "_" + _self.totalParamHash[betKey]["ecid"];
                                    _limit[_limitKey]["max"] = _self.totalParamHash[betKey]["gold_gmax"];
                                    _limit[_limitKey]["min"] = _self.totalParamHash[betKey]["gold_gmin"];
                                    _limit[_limitKey]["currency"] = _self.totalParamHash[betKey]["currency"];
                                    myhash["_limit"] = _limit;
                                    betInfoObj["max_limit"].innerHTML = util.showTxt(util.formatThousand(_self.totalParamHash[betKey]["gold_gmax"]));
                                    betInfoObj["bet_con"].innerHTML = "";
                                    betInfoObj["bet_con_c"].innerHTML = "";
                                    betInfoObj["bet_chose_con"].innerHTML = "";
                                    betInfoObj["bet_score"].innerHTML = "";
                                    var _betslip = dom.getElementById("betslip_locked_" + _ECID);
                                    if (isChangeIor && firstErr)
                                        util.addClass(_betslip, "highlight");
                                    else if (!firstErr)
                                        util.removeClass(_betslip, "highlight");
                                    var tmpBetGold = dom.getElementById("bet_gold_" + _ECID + is_PC);
                                    var tmpBetGold_str = top.mobile != "Y" ? tmpBetGold.value : tmpBetGold.innerHTML;
                                    var tmpWinGold = dom.getElementById("bet_wingold_" + _ECID);
                                    if (tmpIor * 1 == 0 || tmpIor == "-") {
                                        tmpWinGold.className = "word_bold";
                                        tmpWinGold.innerHTML = "-";
                                        lockBetNum[_ECID] = true
                                    }
                                    if (isCnf[_ECID]) {
                                        for (var z = 0; z < systemErrAry.length; z++)
                                            _self.spliceErrAry(systemErrAry[z], errorAry);
                                        isCnf[_ECID] = false
                                    } else
                                        isCnf[_ECID] = false;
                                    if (util_game.isRemoveClose(errorCode[_ECID])) {
                                        delete errorCode[_ECID];
                                        _self.showSingleErrorMsg(_ECID, false)
                                    }
                                    if (util_game.isChgIor(errorCode[_ECID]) || util_game.isRemoveClose(errorCode[_ECID]) && tmpBetGold_str != "")
                                        atLeastNeedChg = true;
                                    var _param = new Object;
                                    _param["target"] = tmpBetGold;
                                    _param["bet_wingold"] = tmpWinGold;
                                    _param["betKey"] = betKey;
                                    _param["ECID"] = _ECID;
                                    if (errorAry.length == 0) {
                                        for (var _key in isCnf)
                                            if (isCnf[_key])
                                                stillError = true;
                                        if (!stillError)
                                            _self.showOrderMsg(false)
                                    }
                                    _self._calcWinGold(_param)
                                } else {
                                    parentClass.dispatchEvent("setLoadingBetVisible", false);
                                    xmdObj["errormsg"] = xmlnode.Node(betslipObj, "errormsg");
                                    var betObj = dom.getElementById("betslip_" + _idKey);
                                    var wingoldObj = dom.getElementById("bet_wingold_" + _ECID);
                                    var bet_ids = ",bet_ior,bet_score,bet_con,bet_con_c,bet_chose_con,";
                                    var betInfoObj = util.getObjAry(betObj, bet_ids);
                                    _mc["div_icon_info_bet_" + _ECID] = dom.getElementById("div_icon_info_bet_" + _ECID);
                                    if (_self.totalParamHash[betKey]["isFantasy"] == "Y") {
                                        _mc["div_icon_info_bet_i_" + _ECID] = dom.getElementById("div_icon_info_bet_i_" + _ECID);
                                        _mc["div_icon_info_bet_" + _ECID].style.display = "";
                                        util.addEvent(_mc["div_icon_info_bet_i_" + _ECID], "click", _self.AlertFantasyInfo, _self.totalParamHash[betKey]["fantasyObj"])
                                    } else
                                        _mc["div_icon_info_bet_" + _ECID].style.display = "none";
                                    if (isCnf[_ECID]) {
                                        for (var c = 0; c < systemErrAry.length; c++)
                                            _self.spliceErrAry(systemErrAry[c], errorAry);
                                        isCnf[_ECID] = false
                                    } else
                                        isCnf[_ECID] = false;
                                    if (xmdObj["code"].innerHTML == "connectFail") {
                                        _self.OrdercloseKeyboard(true);
                                        top.isSystemError = true;
                                        systemErr_Gtype[_GTYPE] = true;
                                        isCnf[_ECID] = true;
                                        if (!util.in_array(xmdObj["code"].innerHTML, errorAry)) {
                                            errorAry.push(xmdObj["code"].innerHTML);
                                            myhash["errorAry"] = errorAry
                                        }
                                        _self.showOrderMsg(true);
                                        parentClass.dispatchEvent("enabledBet", false);
                                        parentClass.dispatchEvent("showInfoLoading", false);
                                        betInfoObj["bet_ior"].className = "word_red";
                                        betInfoObj["bet_ior"].innerHTML = "-";
                                        betInfoObj["bet_score"].style.display = "none";
                                        wingoldObj.innerHTML = "- -";
                                        wingoldObj.className = "word_bold";
                                        _self.totalParamHash[betKey]["ioratio"] = "-";
                                        lockBetNum[_ECID] = true;
                                        if (util_game.checkWtypeIsR(_self.totalParamHash[betKey]["keepwtype"])) {
                                            betInfoObj["bet_con"].style.display = "none";
                                            betInfoObj["bet_con_c"].style.display = "none"
                                        }
                                        continue
                                    }
                                    _self.setSingleErrorCode(_ECID, xmdObj["errormsg"].innerHTML);
                                    _self.setSingleErrorMsg(_ECID, xmdObj["errormsg"].innerHTML);
                                    if (util_game.isOrderLevel(xmdObj["errormsg"].innerHTML)) {
                                        if (util_game.isSystemError(xmdObj["errormsg"].innerHTML)) {
                                            top.isSystemError = true;
                                            systemErr_Gtype[_GTYPE] = true;
                                            isCnf[_ECID] = true;
                                            betInfoObj["bet_ior"].className = "word_red";
                                            betInfoObj["bet_ior"].innerHTML = "-";
                                            betInfoObj["bet_score"].style.display = "none";
                                            wingoldObj.innerHTML = "- -";
                                            wingoldObj.className = "word_bold";
                                            _self.totalParamHash[betKey]["ioratio"] = "-";
                                            lockBetNum[_ECID] = true
                                        }
                                        if (!util.in_array(xmdObj["errormsg"].innerHTML, errorAry)) {
                                            errorAry.push(xmdObj["errormsg"].innerHTML);
                                            myhash["errorAry"] = errorAry
                                        }
                                        if (util_game.isRemoveClose(xmdObj["errormsg"].innerHTML)) {
                                            betInfoObj["bet_ior"].className = "word_red";
                                            betInfoObj["bet_ior"].innerHTML = "-";
                                            wingoldObj.innerHTML = "- -";
                                            wingoldObj.className = "word_bold";
                                            _self.totalParamHash[betKey]["ioratio"] = "-";
                                            betInfoObj["bet_score"].style.display = "none";
                                            if (top["closeGame"][_ECID] == null)
                                                top["closeGame"][_ECID] = betKey;
                                            var bet_gold = dom.getElementById("bet_gold_" + _ECID + is_PC);
                                            _self.setLocked("set", "specific", _ECID);
                                            if (bet_gold.innerHTML != "" || bet_gold.value != "") {
                                                _self.showAcceptChg(true);
                                                atLeastNeedChg = true
                                            }
                                            lockBetNum[_ECID] = true
                                        }
                                        if (xmdObj["errormsg"].innerHTML == "1X003") {
                                            betInfoObj["bet_ior"].className = "word_red";
                                            betInfoObj["bet_ior"].innerHTML = "-";
                                            _self.totalParamHash[betKey]["ioratio"] = "-";
                                            _limit[betKey]["min"] = "";
                                            _limit[betKey]["max"] = "";
                                            myhash["_limit"] = _limit;
                                            lockBetNum[_ECID] = true
                                        }
                                        if (xmdObj["errormsg"].innerHTML == "1X013" || xmdObj["errormsg"].innerHTML == "1X011") {
                                            iorError = true;
                                            betInfoObj["bet_ior"].className = "word_red";
                                            betInfoObj["bet_ior"].innerHTML = "-";
                                            wingoldObj.innerHTML = "- -";
                                            wingoldObj.className = "word_bold";
                                            _self.totalParamHash[betKey]["ioratio"] = "-";
                                            lockBetNum[_ECID] = true
                                        }
                                        if (!util_game.onlyOrderLevel(xmdObj["errormsg"].innerHTML))
                                            _self.showSingleErrorMsg(_ECID, true);
                                        if (top.isSystemError && !util_game.onlyOrderLevel(xmdObj["errormsg"].innerHTML)) {
                                            for (var _key in isCnf)
                                                if (isCnf[_key])
                                                    stillError = true;
                                            if (stillError)
                                                _self.showOrderMsg(true);
                                            else
                                                _self.showOrderMsg(false);
                                            top.isSystemError = false
                                        } else
                                            _self.showOrderMsg(true)
                                    } else
                                        _self.showSingleErrorMsg(_ECID, true);
                                    if (util_game.checkWtypeIsR(_self.totalParamHash[betKey]["keepwtype"])) {
                                        betInfoObj["bet_con"].style.display = "none";
                                        betInfoObj["bet_con_c"].style.display = "none";
                                        if (_self.totalParamHash[betKey]["keepwtype"] != "W3") {
                                            var tmp_con = "conError";
                                            if (_self.totalParamHash[betKey]["CON_H"] != "")
                                                tmp_con = _self.totalParamHash[betKey]["CON_H"];
                                            else
                                                tmp_con = _self.totalParamHash[betKey]["CON_C"];
                                            betInfoObj["bet_chose_con"].className = "word_yellow";
                                            betInfoObj["bet_chose_con"].innerHTML = tmp_con
                                        }
                                    }
                                    _self.calcTotal()
                                }
                            }
                            if (systemErr_Gtype["FT"] && systemErr_Gtype["OP"] || systemErr_Gtype["FT"] && allFT || systemErr_Gtype["OP"] && allOP)
                                top.isSystemError = true;
                            else
                                top.isSystemError = false;
                            systemErr_Gtype["FT"] = false;
                            systemErr_Gtype["OP"] = false;
                            allFT = true;
                            allOP = true;
                            if (firstErr && (util.countSize(errorCode) != 0 || p3Error != ""))
                                firstErr = false;
                            if (util.countSize(top["closeGame"]) != 0)
                                _self.setLocked("set", "single");
                            else if (util.countSize(errorCode) == 0 && util.countSize(top["closeGame"]) == 0 && top["total_bet_sw"] != "N") {
                                if (util.in_array("1X001", errorAry))
                                    _self.spliceErrAry("1X001", errorAry);
                                _self.setLocked("remove", "single");
                                if (top["locked_slip"]["single"] != null)
                                    delete top["locked_slip"]["single"];
                                atLeastNeedChg = false;
                                _self.showRemoveClose(false);
                                parentClass.dispatchEvent("initOrderBet", null)
                            }
                            if (util.countSize(top["closeGame"]) == util.countSize(top["bet_select"]) && util.countSize(top["bet_select"]) != 1) {
                                parentClass.dispatchEvent("enabledBet", false);
                                _self.showNowCredit();
                                parentClass.dispatchEvent("showInfoLoading", false);
                                if (openedKeyboard) {
                                    var _tarECID = keyboardObj.getTarget();
                                    if (top["locked_slip"][_tarECID] != null && top["locked_slip"][_tarECID])
                                        _self.setBetNumVisible(false)
                                }
                                return
                            }
                            if (atLeastNeedChg && util.countSize(top["bet_select"]) != 0) {
                                _self.showAcceptChg(true);
                                _self.showNowCredit();
                                parentClass.dispatchEvent("showInfoLoading", false);
                                if (openedKeyboard) {
                                    var _tarECID = keyboardObj.getTarget();
                                    if (top["locked_slip"][_tarECID] != null && top["locked_slip"][_tarECID])
                                        _self.setBetNumVisible(false)
                                }
                                return
                            }
                        } else {
                            if (!util.in_array("connectFail", errorAry)) {
                                errorAry.push("connectFail");
                                myhash["errorAry"] = errorAry
                            }
                            _self.OrdercloseKeyboard(true);
                            _self.showOrderMsg(true);
                            parentClass.dispatchEvent("enabledBet", false);
                            parentClass.dispatchEvent("showInfoLoading", false);
                            _self.showNowCredit();
                            return
                        }
                        if (openedKeyboard) {
                            var _tarECID = keyboardObj.getTarget();
                            _self.setBetNumLock(_tarECID);
                            if (_tarECID == "single")
                                _self.checkSingleBetLock();
                            if (top["locked_slip"][_tarECID] != null && top["locked_slip"][_tarECID])
                                _self.setBetNumVisible(false)
                        }
                        if (p3NeedChg && util.countSize(top["bet_select"]) != 1) {
                            _self.showAcceptChg(true);
                            _self.showNowCredit();
                            parentClass.dispatchEvent("showInfoLoading", false);
                            return
                        }
                        var allOpen = true;
                        for (var key in errorCode)
                            if (util_game.isRemoveClose(errorCode[key])) {
                                allOpen = false;
                                break
                            }
                        if (allOpen) {
                            _self.showRemoveClose(false);
                            var orderMsg = dom.getElementById("orderMsg");
                            if (orderMsg.innerHTML == "")
                                _self.showOrderMsg(false)
                        }
                        _self.showNowCredit();
                        parentClass.dispatchEvent("showInfoLoading", false);
                        _self.checkAllBets();
                        _self.updatelockBetNum(lockBetNum)
                    } catch (e) {
                        console.log(e)
                    }
                }
                ;
                _self.updatelockBetNum = function(hash) {
                    parentClass.dispatchEvent("updatelockBetNum", hash)
                }
                ;
                _self.setLastKeepGold = function() {
                    if (needsToRebuild) {
                        var total_gold = 0;
                        for (var betKey in top["keepGold"]) {
                            var _key = betKey.replace(/bet_/g, "");
                            var betObj = dom.getElementById("betslip_" + _key);
                            if (betObj) {
                                var _ECID = _key.split("_")[1];
                                var goldObj = dom.getElementById("bet_gold_" + _ECID + is_PC);
                                var wingoldObj = dom.getElementById("bet_wingold_" + _ECID);
                                var gold_ttObj = dom.getElementById("bet_gold_tt_" + _ECID + is_PC);
                                if (gold_ttObj.style.display == "")
                                    gold_ttObj.style.display = "none";
                                else if (top["keepGold"][betKey] == "")
                                    gold_ttObj.style.display = "";
                                if (top.mobile != "Y")
                                    goldObj.value = util.showTxt(util.formatThousand(top["keepGold"][betKey]));
                                else
                                    goldObj.innerHTML = util.showTxt(util.formatThousand(top["keepGold"][betKey]));
                                total_gold += top["keepGold"][betKey] * 1;
                                var _param = new Object;
                                _param["target"] = goldObj;
                                _param["bet_wingold"] = wingoldObj;
                                _param["betKey"] = top.bet_viewdata["ec_" + _ECID];
                                _param["ECID"] = _ECID;
                                _self._calcWinGold(_param)
                            } else
                                delete top["keepGold"][betKey]
                        }
                        var bet_gold2_tt = dom.getElementById("bet_gold2_tt");
                        bet_gold2_tt.innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(total_gold)));
                        _self.calcTotal();
                        _self.checkAllBets()
                    }
                }
                ;
                _self.showNowCredit = function() {
                    var gamedate = _self.get_gamedate();
                    var nowCredit = "";
                    if (gamedate == "yesterday")
                        nowCredit = xmlnode.Node(xmlnode.Root[0], "yesterday_credit").innerHTML;
                    else
                        nowCredit = xmlnode.Node(xmlnode.Root[0], "today_credit").innerHTML;
                    if (nowCredit * 1 < 0)
                        nowCredit = 0;
                    _self.updateCurrency(top["userData"].currency);
                    _mc["nowCredit"].innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(nowCredit)))
                }
                ;
                _self.delBetslip = function(mouseEvent, hash) {
                    _self.clearDots();
                    var tarObj = hash["targetObj"];
                    var _ECID = hash["ECID"];
                    if (isCnf[_ECID]) {
                        for (var i = 0; i < systemErrAry.length; i++)
                            _self.spliceErrAry(systemErrAry[i], errorAry);
                        isCnf[_ECID] = false
                    } else
                        isCnf[_ECID] = false;
                    tarObj.parentNode.removeChild(tarObj);
                    util_game.delBetslip(util, _ECID);
                    var _size = util.countSize(top["bet_select"]);
                    parentClass.dispatchEvent("setBetSelectCount", _size);
                    delete top["totalBetHash"][hash["betKey"]];
                    delete _self.totalParamHash[hash["betKey"]];
                    delete top["totalBetXML"][hash["betKey"]];
                    delete top["bet_ECID"]["gid_" + hash["gid"]];
                    delete top["closeGame"][_ECID];
                    delete errP3Ary[_ECID];
                    myhash["errP3Ary"] = errP3Ary;
                    delete _self.idKeyHash[hash["betKey"]];
                    delete top["keepGold"][top["bet_select"]["ec_" + _ECID]];
                    if (top["LastBet_select"])
                        top["LastBet_select"] = util.clone(top["bet_select"]);
                    delete errorCode[_ECID];
                    delete lockBetNum[_ECID];
                    if (util.countSize(top["closeGame"]) == 0) {
                        for (var i = 0; i < errorAry.length; i++)
                            if (util_game.isRemoveClose(errorAry[i]))
                                errorAry.splice(i, 1);
                        myhash["errorAry"] = errorAry
                    }
                    if (_size == 0) {
                        top["totalBetXML"] = new Object;
                        top["totalBetHash"] = new Object;
                        top["LastBet_select"] = new Object;
                        atLeastNeedChg = false;
                        p3NeedChg = false;
                        parentClass.dispatchEvent("closeBet", true);
                        parentClass.dispatchEvent("setBetSelectCount", "0");
                        return
                    } else if (_size == 1) {
                        _self.showParlay(false);
                        _self.showSingle(false)
                    }
                    _self.setMutiBetslipCount(_size);
                    _mc["betCount"].innerHTML = _size;
                    if (util.countSize(errorCode) == 0 && util.countSize(top["closeGame"]) == 0 && top["total_bet_sw"] != "N") {
                        atLeastNeedChg = false;
                        p3NeedChg = false;
                        parentClass.dispatchEvent("initOrderBet", null)
                    }
                    if (util.countSize(top["closeGame"]) == 0)
                        _self.showRemoveClose(false);
                    _self.calcTotal();
                    parentClass.dispatchEvent("getParlay", {});
                    _self.orderTotalView()
                }
                ;
                _self.showEmpty = function(isShow) {
                    if (isShow) {
                        _mc["div_empty"].style.display = "";
                        parentClass.dispatchEvent("enabledBet", false)
                    } else
                        _mc["div_empty"].style.display = "none"
                }
                ;
                _self.checkNoParlay = function(totalHash) {
                    var _gtype = "";
                    var hasFS = false;
                    var isDifferent = false;
                    var hasRP3 = false;
                    var FS_ECID = new Array;
                    var errorRP3 = new Array;
                    for (var key in totalHash) {
                        var tmpHash = totalHash[key];
                        if (_gtype != "" && _gtype != tmpHash["gtype"].toUpperCase())
                            isDifferent = true;
                        _gtype = tmpHash["gtype"].toUpperCase();
                        if (tmpHash["bet_now"] != null && (tmpHash["bet_now"] == "FS" || tmpHash["bet_now"] == "SFS")) {
                            hasFS = true;
                            if (tmpHash["bet_now"] == "FS")
                                FS_ECID.push(tmpHash["ecid"]);
                            if (tmpHash["bet_now"] == "SFS")
                                FS_ECID.push(tmpHash["gid"])
                        }
                        if (_gtype != "FT" && (tmpHash["showtype"] == "live" || tmpHash["is_rb"] == "Y")) {
                            hasRP3 = true;
                            errorRP3.push(tmpHash["gid"])
                        }
                    }
                    if (!isDifferent && hasFS)
                        return FS_ECID;
                    if (isDifferent)
                        return "crossGtype";
                    if (!isDifferent && hasRP3)
                        return errorRP3
                }
                ;
                _self.showParlayLimit = function(isShow, _limit) {
                    _mc["div_parlay_limit"].style.display = isShow ? "" : "none";
                    _mc["parlay_limit"].innerHTML = _limit
                }
                ;
                _self.showParlay = function(isShow) {
                    var bet_gold_p3 = dom.getElementById("bet_gold_p3" + is_PC);
                    var bet_wingold_p3 = dom.getElementById("bet_wingold_p3");
                    var bet_gold_tt_p3 = dom.getElementById("bet_gold_tt_p3" + is_PC);
                    var parlay_ior = dom.getElementById("parlay_ior");
                    var bet_gold_p3_str = top.mobile != "Y" ? bet_gold_p3.value : bet_gold_p3.innerHTML;
                    if (bet_gold_p3_str != "" && (parlay_ior.innerHTML * 1 != 0 || parlay_ior.innerHTML == "-")) {
                        var _param = new Object;
                        _param["target"] = bet_gold_p3;
                        _param["bet_wingold"] = bet_wingold_p3;
                        _param["betKey"] = "p3";
                        _param["ECID"] = "p3";
                        _self._calcWinGold(_param)
                    }
                    _mc["total_parlay"].style.display = isShow ? "" : "none";
                    if (!isShow) {
                        delete limit_allowBets["p3"];
                        parlay_ior.innerHTML = "";
                        if (top.mobile != "Y")
                            bet_gold_p3.value = "";
                        else
                            bet_gold_p3.innerHTML = "";
                        bet_wingold_p3.innerHTML = "";
                        bet_gold_tt_p3.style.display = "";
                        _self.calcTotal()
                    }
                }
                ;
                _self.showSingle = function(isShow) {
                    _mc["total_single"].style.display = isShow ? "" : "none"
                }
                ;
                _self.setMutiBetslipCount = function(_count) {
                    _mc["total_single_count"].setAttribute("data-more", _count)
                }
                ;
                _self.removeALL = function() {
                    for (var key in top["totalBetHash"]) {
                        var ecid = key.split("_")[1];
                        if (dom.getElementById("bet_gold_" + ecid + is_PC)) {
                            dom.getElementById("bet_gold_" + ecid + "_pc").value = "";
                            dom.getElementById("bet_gold_" + ecid).innerHTML = ""
                        }
                    }
                    top["totalBetXML"] = Object();
                    top["totalBetHash"] = Object();
                    top["closeGame"] = new Object;
                    top["keepGold"] = new Object;
                    top["LastBet_select"] = new Object;
                    errorCode = new Object;
                    isCnf = new Object;
                    _self.idKeyHash = new Object;
                    atLeastNeedChg = false;
                    p3NeedChg = false;
                    parentClass.dispatchEvent("closeBet", true);
                    parentClass.dispatchEvent("setBetSelectCount", "0");
                    parentClass.dispatchEvent("setBetSelectIor", LS.get("betslip_txt"));
                    if (_mc["bet_show"])
                        _mc["bet_show"].innerHTML = ""
                }
                ;
                _self.showRemoveALL = function(isShow) {
                    _mc["showRemoveALL"].style.display = isShow ? "" : "none";
                    _mc["rotate_removeALL"].style.display = isShow ? "" : "none"
                }
                ;
                _self.openRemoveALL = function() {
                    var isShow = _mc["div_removeALL"].classList.contains("active");
                    if (isShow)
                        util.removeClass(_mc["div_removeALL"], "active");
                    else
                        util.addClass(_mc["div_removeALL"], "active")
                }
                ;
                _self.clearDots = function() {
                    for (var _id in top["bet_ECID"]) {
                        var _gid = _id.split("_")[1];
                        var _ecid = top["bet_ECID"]["gid_" + _gid];
                        _mc["dots_" + _ecid] = dom.getElementById("dots_" + _ecid);
                        if (_mc["dots_" + _ecid] != null)
                            util.removeClass(_mc["dots_" + _ecid], "no_parlayin")
                    }
                }
                ;
                _self.clearGold = function(_ecid) {
                    var betGoldObj = dom.getElementById("bet_gold_" + _ecid + is_PC);
                    var wingoldObj = dom.getElementById("bet_wingold_" + _ecid);
                    var betGold_ttObj = dom.getElementById("bet_gold_tt_" + _ecid + is_PC);
                    var _betKey = top.bet_viewdata["ec_" + _ecid] != null ? top.bet_viewdata["ec_" + _ecid] : _ecid;
                    if (top.mobile != "Y")
                        betGoldObj.value = "";
                    else
                        betGoldObj.innerHTML = "";
                    if (betGoldObj != null)
                        util.removeClass(betGoldObj, "on");
                    betGold_ttObj.style.display = "";
                    var _param = new Object;
                    _param["target"] = betGoldObj;
                    _param["bet_wingold"] = wingoldObj;
                    _param["betKey"] = _betKey;
                    _param["ECID"] = _ecid;
                    _self._calcWinGold(_param)
                }
                ;
                _self.betClick = function(mouseEvent, targetObj) {
                    util.addEvent(dom.body, "keyup", _self.keyupEventHandler);
                    var targetID = mouseEvent.target.id;
                    var tmpobj = targetID.split("_");
                    var tmpECID = "";
                    if (tmpobj[tmpobj.length - 1] != null)
                        tmpECID = tmpobj[tmpobj.length - 1];
                    for (var i = 0; i < noEffect.length; i++)
                        if (targetID.indexOf(noEffect[i]) != -1)
                            return;
                    for (var i = 0; i < ignoreCollapseBtn.length; i++)
                        if (targetID.indexOf(ignoreCollapseBtn[i]) == -1 || top["betting"] || top["locked_slip"][tmpECID] != null && top["locked_slip"][tmpECID]) {
                            _self.setBetNumVisible(false);
                            _self.setReverseSwOthers(tmpECID)
                        } else {
                            _self.setBetNumVisible(true);
                            _self.setReverseSwOthers(tmpECID);
                            return
                        }
                    if (openedKeyboard)
                        util.addClass(typingObj, "on");
                    else {
                        typingObj = null;
                        _self.initTyping()
                    }
                }
                ;
                _self.setReverseSwOthers = function(tarECID) {
                    for (var _ecid in reverseSw) {
                        if (_ecid == tarECID)
                            continue;
                        reverseSw[_ecid] = false
                    }
                }
                ;
                _self.initReverseSw = function() {
                    for (var _ecid in reverseSw)
                        reverseSw[_ecid] = false
                }
                ;
                _self.setReverseSw = function(sw, _ecid) {
                    reverseSw[_ecid] = sw
                }
                ;
                _self._calcWinGold = function(_param) {
                    var betGoldObj = _param["target"];
                    var betGoldStr = top.mobile != "Y" ? betGoldObj.value.replace(/,/g, "") : betGoldObj.innerHTML.replace(/,/g, "");
                    var bet_wingoldObj = _param["bet_wingold"];
                    var betKey = _param["betKey"];
                    var ECID = _param["ECID"];
                    var wingold = "";
                    var wingoldClass = "word_green";
                    if (betGoldStr != "") {
                        wingold = util.showTxt(util.formatThousand(util_game.calcWindGold(betGoldStr, _self.totalParamHash[betKey]["ioratio"], _self.totalParamHash[betKey]["keepwtype"])));
                        if (_self.totalParamHash[betKey]["ioratio"] * 1 == 0 || _self.totalParamHash[betKey]["ioratio"] == "-") {
                            wingold = "- -";
                            wingoldClass = "word_bold"
                        }
                    } else
                        wingold = "0.00";
                    if (bet_wingoldObj != null) {
                        bet_wingoldObj.innerHTML = wingold;
                        bet_wingoldObj.className = wingoldClass
                    }
                    _self.calcTotal();
                    _self.checkBets({
                        "bet_gold": betGoldObj,
                        "betKey": betKey,
                        "ECID": ECID
                    })
                }
                ;
                _self.calcTotal = function() {
                    var total_gold = 0;
                    var _betCount = 0;
                    var goldObj = dom.getElementsByName("bet_gold" + is_PC);
                    var iorObj = dom.getElementsByName("bet_ior");
                    for (var x = 0; x < goldObj.length; x++) {
                        if (iorObj[x] != null && (iorObj[x] * 1 == 0 || iorObj[x].innerHTML == "-"))
                            continue;
                        if (top.mobile != "Y")
                            total_gold += goldObj[x].value.replace(/,/g, "") * 1;
                        else
                            total_gold += goldObj[x].innerHTML.replace(/,/g, "") * 1;
                        if (goldObj[x].innerHTML != "" || goldObj[x].value != undefined && goldObj[x].value != "")
                            _betCount++
                    }
                    _mc["bet_gold2_tt"].innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(total_gold)));
                    _mc["bet_total_gold"].innerHTML = _mc["bet_gold2_tt"].innerHTML;
                    _mc["betCount_tt"].innerHTML = _betCount;
                    var total_wingold = 0;
                    var wingoldObj = dom.getElementsByName("bet_wingold");
                    for (var x = 0; x < wingoldObj.length; x++) {
                        if (iorObj[x] != null && (iorObj[x] * 1 == 0 || iorObj[x].innerHTML == "-"))
                            continue;
                        if (wingoldObj[x].innerHTML != "- -")
                            total_wingold += wingoldObj[x].innerHTML.replace(/,/g, "") * 1
                    }
                    _mc["bet_total_wingold"].innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(total_wingold)))
                }
                ;
                _self.setSingleGold = function(mouseEvent, targetObj) {
                    _limit["single"] = new Object;
                    _limit["single"]["max"] = "9999999999";
                    _limit["single"]["min"] = "0";
                    myhash["_limit"] = _limit;
                    var _hash = new Object;
                    _hash["targetObj"] = _mc["bet_gold_single"];
                    _hash["targetObj_tt"] = _mc["bet_gold_tt_single"];
                    _hash["ECID"] = "single";
                    _self.initTyping();
                    var bet_gold = _hash["targetObj"];
                    var tmpECID = bet_gold.getAttribute("id").split("_")[2];
                    typingObj = bet_gold;
                    if (openedKeyboard)
                        if (!reverseSw[tmpECID])
                            util.addClass(bet_gold, "on");
                        else if (reverseSw[tmpECID] == null)
                            util.addClass(bet_gold, "on");
                        else {
                            if (reverseSw[tmpECID])
                                util.removeClass(bet_gold, "on")
                        }
                    else if (!reverseSw[tmpECID])
                        util.addClass(bet_gold, "on");
                    else if (reverseSw[tmpECID] == null)
                        util.addClass(bet_gold, "on");
                    else if (reverseSw[tmpECID])
                        util.removeClass(bet_gold, "on");
                    _self.changeTarget(_hash);
                    _self.updateEvent("single");
                    keyboardObj.updateSingleSw(true);
                    if (dom.getElementById("div_calc").style.display == "none")
                        _self.setBetNumVisible(num_show);
                    if (top["locked_slip"]["single"] != true)
                        _mc["div_betInfo"].scrollTop = _mc["div_betInfo"].scrollHeight;
                    _self.checkSingleBetLock()
                }
                ;
                _self.checkSingleBetLock = function() {
                    var isLocked = _self.checkBetsIsZero();
                    var _calc = dom.getElementById("div_calc");
                    if (isLocked) {
                        if (!_calc.classList.contains("nobet"))
                            _calc.classList.add("nobet")
                    } else if (_calc.classList.contains("nobet"))
                        _calc.classList.remove("nobet")
                }
                ;
                _self.setTotalSingleBets = function(_gold) {
                    _gold = _gold > 0 ? _gold : "";
                    for (var gidKey in top.bet_ECID) {
                        var _ECID = top.bet_ECID[gidKey];
                        if (isCnf[_ECID])
                            continue;
                        var _betKey = top.bet_viewdata["ec_" + _ECID];
                        var tmpObj = dom.getElementById("bet_gold_" + _ECID + is_PC);
                        var ttObj = dom.getElementById("bet_gold_tt_" + _ECID + is_PC);
                        var wingoldObj = dom.getElementById("bet_wingold_" + _ECID);
                        if (_gold != "" && !lockBetNum[_ECID]) {
                            if (top.mobile != "Y")
                                tmpObj.value = util.showTxt(util.formatThousand(_gold));
                            else
                                tmpObj.innerHTML = util.showTxt(util.formatThousand(_gold));
                            ttObj.style.display = "none"
                        } else {
                            if (top.mobile != "Y")
                                tmpObj.value = "";
                            else
                                tmpObj.innerHTML = "";
                            ttObj.style.display = ""
                        }
                        var _paramHash = new Object;
                        _paramHash["target"] = tmpObj;
                        _paramHash["bet_wingold"] = wingoldObj;
                        _paramHash["betKey"] = _betKey;
                        _paramHash["ECID"] = _ECID;
                        _self._calcWinGold(_paramHash)
                    }
                }
                ;
                _self.betHandler = function(mouseEvent) {
                    var total_betHash = new Object;
                    var singleHash = new Object;
                    var parlayHash = new Object;
                    parentClass.dispatchEvent("setLoadingBetVisible", true);
                    _self.showOrderMsg(false);
                    if (openedKeyboard)
                        _self.initReverseSw();
                    _self.setBetNumVisible(false);
                    typingObj = null;
                    _self.initTyping();
                    var p3hasTodayGame = false;
                    var p3hasYesterdayGame = false;
                    var illegal = false;
                    var total_gold = 0;
                    var today_gold = 0;
                    var todayHash = new Object;
                    var yesterdayHash = new Object;
                    for (var key in top.bet_viewdata) {
                        var _ECID = key.split("_")[1];
                        var _betKey = top.bet_viewdata[key];
                        var gold = top.mobile != "Y" ? dom.getElementById("bet_gold_" + _ECID + is_PC).value.replace(/,/g, "") : dom.getElementById("bet_gold_" + _ECID + is_PC).innerHTML.replace(/,/g, "");
                        if (_self.totalParamHash[_betKey]["ioratio"] == "-")
                            continue;
                        if (gold == "")
                            continue;
                        var mem_sc = _self.totalParamHash[_betKey]["mem_sc"] * 1;
                        var mem_so = _self.totalParamHash[_betKey]["mem_so"] * 1;
                        var restsinglecredit = _self.totalParamHash[_betKey]["restsinglecredit"] * 1;
                        var game_date = _self.totalParamHash[_betKey]["dates"];
                        var gold_gmax = _self.totalParamHash[_betKey]["gold_gmax"] * 1;
                        var gold_res = restsinglecredit * 1 + gold * 1;
                        var ret = util_game.checkFormat(gold);
                        var org = "";
                        var errorValue = "";
                        var currency = _self.totalParamHash[_betKey]["currency"];
                        var gameDateStr = _self.get_gamedate();
                        if (gameDateStr == "today") {
                            todayHash[_betKey] = _self.totalParamHash[_betKey];
                            today_gold += gold * 1
                        } else
                            yesterdayHash[_betKey] = _self.totalParamHash[_betKey];
                        if (ret != "") {
                            _self.setSingleErrorCode(_ECID, ret);
                            _self.setSingleErrorMsg(_ECID, ret, errorValue, org);
                            _self.showSingleErrorMsg(_ECID, true)
                        }
                        if (_self.totalParamHash[_betKey]["bet_now"] != null && _self.totalParamHash[_betKey]["bet_now"].indexOf("FS") == -1)
                            _self.totalParamHash[_betKey] = util_game.switchBetRtype(_self.totalParamHash[_betKey]);
                        singleHash[_betKey] = _self.totalParamHash[_betKey];
                        singleHash[_betKey]["gold"] = gold;
                        total_gold += gold * 1
                    }
                    top["totalBetOrderView"] = _self.totalParamHash;
                    var bet_gold_p3_str = top.mobile != "Y" ? _mc["bet_gold_p3"].value : _mc["bet_gold_p3"].innerHTML;
                    if (bet_gold_p3_str != "") {
                        var bet_gold_p3 = bet_gold_p3_str.replace(/,/g, "");
                        var mem_sc = _self.totalParamHash["p3"]["mem_sc"] * 1;
                        var ret = util_game.checkFormat(bet_gold_p3);
                        var dateObj = _self.totalParamHash["p3"]["pickDate"].split("^");
                        for (var i = 0; i < dateObj.length; i++) {
                            var gameDateStr = _self.get_gamedate();
                            if (gameDateStr == "today") {
                                p3hasTodayGame = true;
                                p3hasYesterdayGame = false;
                                break
                            }
                        }
                        for (var i = 0; i < dateObj.length; i++) {
                            var gameDateStr = _self.get_gamedate();
                            if (gameDateStr == "yesterday") {
                                p3hasYesterdayGame = true;
                                break
                            }
                        }
                        if (!util_game.chkParlayDate(_self.totalParamHash["p3"]["pickDate"]))
                            ret = "error7D";
                        for (var gid in top.bet_ECID) {
                            var tmpgid = gid.split("_")[0] + gid.split("_")[1];
                            var restsinglecredit = _self.totalParamHash["p3"][tmpgid];
                            var gold_res = restsinglecredit * 1 + bet_gold_p3 * 1;
                            var org = "";
                            var errorValue = "";
                            if (ret == "")
                                if (gold_res > mem_sc) {
                                    ret = "1X017";
                                    break
                                }
                        }
                        var betP3Obj = _self.totalParamHash["p3"]["betData"].split("^");
                        var singleBetLength = util.countSize(top.bet_viewdata);
                        if (singleBetLength > betP3Obj.length) {
                            _self.showUnStableMsg();
                            return
                        }
                        if (ret != "") {
                            parentClass.dispatchEvent("setLoadingBetVisible", false);
                            p3hasErr = true;
                            _self.showParlayErrorMsg(true, ret);
                            if (ret != "error7D")
                                _self.orderTotalView();
                            else {
                                parentClass.dispatchEvent("clearOVTimer", {});
                                parentClass.dispatchEvent("createOVTimer", {})
                            }
                            return
                        }
                        p3hasErr = false;
                        parlayHash = _self.totalParamHash["p3"];
                        parlayHash["gold"] = bet_gold_p3;
                        total_gold += bet_gold_p3 * 1;
                        today_gold += bet_gold_p3 * 1
                    }
                    if (util.countSize(yesterdayHash) != 0 || bet_gold_p3_str != "" && p3hasYesterdayGame) {
                        if (top["userData"].pay_type != 1)
                            if (total_gold > Credit["yesterday"] * 1) {
                                if (!util.in_array("1X029", errorAry)) {
                                    errorAry.push("1X029");
                                    myhash["errorAry"] = errorAry
                                }
                                illegal = true;
                                isFromBet = true
                            } else if (util.in_array("1X029", errorAry))
                                _self.spliceErrAry("1X029", errorAry);
                        if (total_gold > Credit["today"] * 1) {
                            if (!util.in_array("1X012", errorAry)) {
                                errorAry.push("1X012");
                                myhash["errorAry"] = errorAry
                            }
                            illegal = true;
                            isFromBet = true
                        } else if (util.in_array("1X012", errorAry))
                            _self.spliceErrAry("1X012", errorAry)
                    }
                    if (util.countSize(yesterdayHash) == 0 || bet_gold_p3_str != "" && !p3hasYesterdayGame)
                        if (today_gold > Credit["today"] * 1) {
                            if (!util.in_array("1X012", errorAry)) {
                                errorAry.push("1X012");
                                myhash["errorAry"] = errorAry
                            }
                            illegal = true;
                            isFromBet = true
                        } else if (util.in_array("1X012", errorAry))
                            _self.spliceErrAry("1X012", errorAry);
                    if (illegal) {
                        _self.showAcceptChg(false);
                        _self.showOrderMsg(true);
                        _self.orderTotalView();
                        return
                    }
                    if (top["betting"] == true)
                        return;
                    top["betting"] = true;
                    total_betHash["onlyYesterday"] = util.countSize(yesterdayHash) > 0 || bet_gold_p3_str != "" && p3hasYesterdayGame ? "Y" : "N";
                    total_betHash["autoOdd"] = top["memSet"]["betterOdds"] == false ? "N" : "Y";
                    total_betHash["single"] = singleHash;
                    total_betHash["p3"] = parlayHash;
                    betFrame = new win.Total_bet(win,dom);
                    betFrame.setParentclass(_self);
                    betFrame.init();
                    betFrame.bet(total_betHash);
                    parentClass.dispatchEvent("clearOVTimer", {});
                    util.removeEvent(_mc["order_bet"], "click");
                    firstErr = true;
                    isCnf = new Object
                }
                ;
                _self.setLocked = function(_code, _name, _ecid) {
                    var p3Obj = dom.getElementById("total_parlay_locked");
                    var sinObj = dom.getElementById("total_single_locked");
                    var p3noEnter = dom.getElementById("total_parlay_count" + is_PC);
                    var sinnoEnter = dom.getElementById("total_single_count" + is_PC);
                    var p3betgold = dom.getElementById("bet_gold_p3" + is_PC);
                    var sinbetgold = dom.getElementById("bet_gold_single" + is_PC);
                    var p3betgold_tt = dom.getElementById("bet_gold_tt_p3" + is_PC);
                    var sinbetgold_tt = dom.getElementById("bet_gold_tt_single" + is_PC);
                    var tarObj, bgObj, inputObj, input_ttObj, tmpECID;
                    var needsLimit = false;
                    if (_name == "single") {
                        tarObj = sinObj;
                        bgObj = sinnoEnter;
                        inputObj = sinbetgold;
                        input_ttObj = sinbetgold_tt;
                        tmpECID = "single"
                    } else if (_name == "parlay") {
                        tarObj = p3Obj;
                        bgObj = p3noEnter;
                        inputObj = p3betgold;
                        input_ttObj = p3betgold_tt;
                        tmpECID = "p3";
                        needsLimit = true
                    } else if (_ecid != "") {
                        tarObj = dom.getElementById("betslip_locked_" + _ecid);
                        bgObj = dom.getElementById("bet_gold_bg_" + _ecid + is_PC);
                        inputObj = dom.getElementById("bet_gold_" + _ecid + is_PC);
                        input_ttObj = dom.getElementById("bet_gold_tt_" + _ecid + is_PC);
                        tmpECID = _ecid;
                        needsLimit = true
                    }
                    if (_code == "set") {
                        util.removeClass(inputObj, "on");
                        util.addClass(tarObj, "locked");
                        util.addClass(bgObj, "noenter");
                        top["locked_slip"][tmpECID] = true;
                        _self.checkOpenLimitANDLock(tmpECID);
                        if (tmpECID != "single")
                            parentClass.dispatchEvent("hiddenALL", tmpECID)
                    } else {
                        if (top["total_bet_sw"] != "N" && needsLimit) {
                            var _gold = top.mobile != "Y" ? inputObj.value : inputObj.innerHTML;
                            var div_limit = dom.getElementById("div_limit_" + tmpECID);
                            var div_showlimit = dom.getElementById("div_showlimit_" + tmpECID);
                            if (_gold != "") {
                                var clickObj = tmpDiv["last"] != null ? tmpDiv["last"] : top["openLimit"][tmpECID] ? div_limit : div_showlimit;
                                parentClass.showSpecDiv(null, {
                                    "showTarget": "wingold",
                                    "clickObj": clickObj,
                                    "isShow": true,
                                    "ECID": tmpECID
                                })
                            } else if (top["openLimit"][tmpECID])
                                parentClass.showSpecDiv(null, {
                                    "showTarget": "limit",
                                    "clickObj": div_showlimit,
                                    "isShow": true,
                                    "ECID": tmpECID
                                });
                            else if (isLockANDopenLimit)
                                parentClass.showSpecDiv(null, {
                                    "showTarget": "showlimit",
                                    "clickObj": null,
                                    "isShow": true,
                                    "ECID": tmpECID
                                });
                            else if (_gold == "" && !top["isErrCleanGold"])
                                parentClass.showSpecDiv(null, {
                                    "showTarget": "showlimit",
                                    "clickObj": tmpDiv["now"],
                                    "isShow": true,
                                    "ECID": tmpECID
                                });
                            else
                                parentClass.initSpecDiv()
                        } else
                            parentClass.initSpecDiv();
                        util.removeClass(tarObj, "locked");
                        util.removeClass(bgObj, "noenter")
                    }
                }
                ;
                _self.enableToBet = function(sw, _ecid) {
                    var bgObj = dom.getElementById("bet_gold_bg_" + _ecid + is_PC);
                    if (sw) {
                        util.removeClass(bgObj, "noenter");
                        _mc["bet_gold_single"].removeAttribute("disabled");
                        if (top["locked_slip"][_ecid] != null)
                            delete top["locked_slip"][_ecid];
                        util.addEvent(_mc["bet_gold_single"], "click", _self.setSingleGold, null);
                        util.addEvent(_mc["bet_gold_tt_single"], "click", _self.setSingleGold, null)
                    } else {
                        util.addClass(bgObj, "noenter");
                        _mc["bet_gold_single"].disabled = true;
                        top["locked_slip"][_ecid] = true;
                        top["locked_slip"]["single"] = true;
                        util.addClass(_mc["total_single_count"], "noenter");
                        util.removeEvent(_mc["bet_gold_single"], "click");
                        util.removeEvent(_mc["bet_gold_tt_single"], "click")
                    }
                }
                ;
                _self.checkOpenLimitANDLock = function(_ecid) {
                    for (var _tmpECID in top["openLimit"]) {
                        if (top["openLimit"][_tmpECID] && _ecid == _tmpECID)
                            isLockANDopenLimit = true;
                        break
                    }
                }
                ;
                _self.showAcceptChg = function(isShow) {
                    parentClass.dispatchEvent("showDelayLoading", false);
                    var betBtn_txt = dom.getElementById("betBtn_txt");
                    var bet_gold2_tt = dom.getElementById("bet_gold2_tt");
                    var order_bet = dom.getElementById("order_bet");
                    if (isShow) {
                        order_bet.removeAttribute("disabled");
                        betBtn_txt.innerHTML = LS.get("accept_change_txt");
                        bet_gold2_tt.style.display = "none";
                        util.removeEvent(order_bet, "click");
                        util.addEvent(order_bet, "click", _self.acceptChg, {})
                    } else {
                        betBtn_txt.innerHTML = LS.get("bet_txt");
                        bet_gold2_tt.style.display = ""
                    }
                }
                ;
                _self.acceptChg = function() {
                    for (var _key in top["bet_ECID"]) {
                        var targetObj = dom.getElementById("betslip_locked_" + top["bet_ECID"][_key]);
                        util.removeClass(targetObj, "highlight")
                    }
                    echo("acceptChg [errorCode] = ", errorCode, " [p3Error] = ", p3Error);
                    for (var _ECID in errorCode)
                        if (util_game.isRemoveClose(errorCode[_ECID])) {
                            top["isErrCleanGold"] = true;
                            _self.clearGold(_ECID)
                        } else if (util_game.isOverSingleCredit(errorCode[_ECID])) {
                            var betKey = top["bet_viewdata"]["ec_" + _ECID];
                            var max_gold = _self.totalParamHash[betKey]["gold_gmax"];
                            var betGoldObj = dom.getElementById("bet_gold_" + _ECID + is_PC);
                            var betGoldttObj = dom.getElementById("bet_gold_tt_" + _ECID + is_PC);
                            var wingoldObj = dom.getElementById("bet_wingold_" + _ECID);
                            if (top.mobile != "Y")
                                betGoldObj.value = util.showTxt(util.formatThousand(max_gold));
                            else
                                betGoldObj.innerHTML = util.showTxt(util.formatThousand(max_gold));
                            betGoldttObj.style.display = "none";
                            var _param = new Object;
                            _param["target"] = betGoldObj;
                            _param["bet_wingold"] = wingoldObj;
                            _param["betKey"] = betKey;
                            _param["ECID"] = _ECID;
                            _self._calcWinGold(_param);
                            _self.showSingleErrorMsg(_ECID, false)
                        } else
                            _self.showSingleErrorMsg(_ECID, false);
                    if (util_game.isRemoveClose(p3Error)) {
                        top["isErrCleanGold"] = true;
                        _self.clearGold("p3")
                    } else if (p3Error == "1X018" || p3Error == "1X023") {
                        var max_gold;
                        var betGoldObj = dom.getElementById("bet_gold_p3" + is_PC);
                        var betGoldttObj = dom.getElementById("bet_gold_tt_p3" + is_PC);
                        if (p3Error == "1X018")
                            if (_self.totalParamHash["p3"]["mem_so"] * 1 > _self.totalParamHash["p3"]["game_sc"] * 1)
                                max_gold = _self.totalParamHash["p3"]["game_sc"];
                            else
                                max_gold = _self.totalParamHash["p3"]["mem_so"];
                        else if (_self.totalParamHash["p3"]["mem_so"] * 1 < _self.totalParamHash["p3"]["game_sc"] * 1)
                            max_gold = _self.totalParamHash["p3"]["mem_so"];
                        else
                            max_gold = _self.totalParamHash["p3"]["game_sc"];
                        if (top.mobile != "Y")
                            betGoldObj.value = util.showTxt(util.formatThousand(max_gold));
                        else
                            betGoldObj.innerHTML = util.showTxt(util.formatThousand(max_gold));
                        betGoldttObj.style.display = "none";
                        var _param = new Object;
                        _param["target"] = betGoldObj;
                        _param["bet_wingold"] = wingoldObj;
                        _param["betKey"] = "p3";
                        _param["ECID"] = "p3";
                        _self._calcWinGold(_param);
                        _self.showParlayErrorMsg(false, "")
                    }
                    errorCode = new Object;
                    errorAry = new Array;
                    myhash["errorAry"] = errorAry;
                    errP3ChgAry = new Object;
                    myhash["errP3ChgAry"] = errP3ChgAry;
                    isFromBet = false;
                    firstErr = true;
                    atLeastNeedChg = false;
                    p3NeedChg = false;
                    p3Error = "";
                    _self.showAcceptChg(false);
                    _self.showOrderMsg(false);
                    _self.orderTotalView();
                    parentClass.dispatchEvent("clearOVTimer", {});
                    parentClass.dispatchEvent("createOVTimer", {})
                }
                ;
                _self.updateCurrency = function(_currency) {
                    dom.getElementById("nowCredit").setAttribute("data-currency", _currency);
                    dom.getElementById("bet_total_gold").setAttribute("data-currency", _currency);
                    dom.getElementById("bet_total_wingold").setAttribute("data-currency", _currency);
                    dom.getElementById("bet_gold2_tt").setAttribute("data-currency", _currency)
                }
                ;
                _self.setSingleErrorCode = function(_ecid, error) {
                    errorCode[_ecid] = error;
                    if (!util.in_array(error, errorAry)) {
                        errorAry.push(error);
                        myhash["errorAry"] = errorAry
                    }
                }
                ;
                _self.setSingleErrorMsg = function(_ECID, errorMsg, errorValue, org) {
                    var err_msg = dom.getElementById("err_msg_" + _ECID);
                    if (errorValue + "" == "undefined")
                        err_msg.innerHTML = util.showTxt(LS_code.get(errorMsg));
                    else if (org + "" == "undefined")
                        err_msg.innerHTML = util.showTxt(LS_code.get(errorMsg)) + errorValue;
                    else
                        err_msg.innerHTML = util.showTxt(LS_code.get(errorMsg)) + errorValue + util.showTxt(LS_code.get(org))
                }
                ;
                _self.showSingleErrorMsg = function(_ECID, isShow) {
                    var err_msg = dom.getElementById("err_msg_" + _ECID);
                    err_msg.style.display = isShow ? "" : "none"
                }
                ;
                _self.showParlayErrorMsg = function(isShow, _code, errorValue, org) {
                    p3hasErr = isShow;
                    p3Error = _code;
                    _mc["parlay_error"].style.display = isShow ? "" : "none";
                    if (_code == "1X034")
                        util.addClass(_mc["parlay_error"], "no_parlayin");
                    else
                        util.removeClass(_mc["parlay_error"], "no_parlayin");
                    if (errorValue + "" == "undefined")
                        _mc["parlay_error"].innerHTML = util.showTxt(LS_code.get(_code));
                    else if (org + "" == "undefined")
                        if (_code == "1X018" || _code == "1X023")
                            _mc["parlay_error"].innerHTML = util.showTxt(LS_code.get(_code)) + LS.get(top["userData"].currency) + " " + errorValue + ".";
                        else
                            _mc["parlay_error"].innerHTML = util.showTxt(LS_code.get(_code)) + errorValue;
                    else
                        _mc["parlay_error"].innerHTML = util.showTxt(LS_code.get(_code)) + errorValue + util.showTxt(LS_code.get(org))
                }
                ;
                _self.showUnStableMsg = function() {
                    parentClass.dispatchEvent("setLoadingBetVisible", false);
                    if (!util.in_array("betError878787", errorAry)) {
                        errorAry.push("betError878787");
                        myhash["errorAry"] = errorAry
                    }
                    _self.showOrderMsg(true);
                    parentClass.dispatchEvent("enabledBet", true);
                    parentClass.dispatchEvent("clearOVTimer", {});
                    parentClass.dispatchEvent("createOVTimer", {});
                    _self.orderTotalView();
                    top["betting"] = false
                }
                ;
                _self.showOrderMsg = function(isShow) {
                    var orderMsg_div = dom.getElementById("orderMsg_div");
                    var orderMsg = dom.getElementById("orderMsg");
                    var remove_close = dom.getElementById("remove_bet");
                    orderMsg_div.style.display = isShow ? "" : "none";
                    orderMsg.innerHTML = "";
                    if (isShow) {
                        var sorted = util_game.sortBetError(errorAry);
                        for (var i in sorted) {
                            if (!isFromBet && sorted[i] == "order_failed")
                                continue;
                            if (sorted[i] == "remove_closed") {
                                _self.showRemoveClose(true);
                                util.addEvent(remove_close, "click", _self.removeClose, {});
                                continue
                            }
                            var obj = dom.createElement("li");
                            obj.innerHTML = util.showTxt(LS_code.get(sorted[i]));
                            orderMsg.appendChild(obj)
                        }
                    } else
                        remove_close.style.display = "none"
                }
                ;
                _self.removeClose = function() {
                    if (util.countSize(top["closeGame"]) != 0) {
                        for (var _ecid in top["closeGame"]) {
                            var betStr = top["bet_select"]["ec_" + _ecid];
                            var _gid = betStr.split("_")[1];
                            var _betKey = top["closeGame"][_ecid];
                            var _idKey = _self.idKeyHash[_betKey];
                            var tmpObj = dom.getElementById("betslip_" + _idKey);
                            tmpObj.parentNode.removeChild(tmpObj);
                            util_game.delBetslip(util, _ecid);
                            var _size = util.countSize(top["bet_select"]);
                            parentClass.dispatchEvent("setBetSelectCount", _size);
                            if (_size == 0) {
                                top["totalBetXML"] = Object();
                                top["totalBetHash"] = Object();
                                parentClass.dispatchEvent("closeBet", true);
                                parentClass.dispatchEvent("setBetSelectCount", "0");
                                return
                            } else {
                                _self.showSingle(_size > 1);
                                _self.showParlay(_size > 1)
                            }
                            _self.setMutiBetslipCount(_size);
                            _mc["betCount"].innerHTML = _size;
                            delete top["totalBetHash"][_betKey];
                            delete top["totalBetXML"][_betKey];
                            delete top["bet_ECID"]["gid_" + _gid];
                            delete top["closeGame"][_ecid];
                            delete errorCode[_ecid];
                            delete _self.idKeyHash[_betKey];
                            delete top["keepGold"][top["bet_select"]["ec_" + _ecid]];
                            if (isCnf[_ecid]) {
                                for (var s = 0; s < systemErrAry.length; s++)
                                    _self.spliceErrAry(systemErrAry[s], errorAry);
                                isCnf[_ecid] = false
                            } else
                                isCnf[_ecid] = false;
                            _self.orderTotalView();
                            _self.calcTotal()
                        }
                        for (var i = 0; i < errorAry.length; i++)
                            if (util_game.isRemoveClose(errorAry[i]))
                                errorAry.splice(i, 1);
                        _self.showRemoveClose(false);
                        if (util.countSize(top["closeGame"]) == 0 && util.countSize(top["bet_select"]) > 1)
                            _self.setLocked("remove", "single");
                        else if (util.countSize(top["bet_select"]) == 1) {
                            _self.showParlayLimit(false);
                            _self.showParlayErrorMsg(false, "")
                        }
                        if (errorAry.length == 0)
                            _self.showOrderMsg(false);
                        myhash["errorAry"] = errorAry
                    }
                }
                ;
                _self.showRemoveClose = function(isShow) {
                    var remove_close = dom.getElementById("remove_bet");
                    remove_close.style.display = isShow ? "" : "none"
                }
                ;
                _self.setIsFromBet = function(sw) {
                    isFromBet = sw
                }
                ;
                _self.scrollToClose = function(e) {
                    _self.setBetNumVisible(false);
                    _self.initReverseSw();
                    _self.initTyping()
                }
                ;
                _self.setBetNumVisible = function(isShow) {
                    var _calc = dom.getElementById("div_calc");
                    if (isShow) {
                        if (isFirst)
                            isFirst = false;
                        _calc.style.display = "";
                        num_show = false;
                        openedKeyboard = true
                    } else {
                        _calc.style.display = "none";
                        num_show = true;
                        openedKeyboard = false
                    }
                }
                ;
                _self.setBetNum = function(mouseEvent, hash) {
                    top["isErrCleanGold"] = false;
                    _self.initTyping();
                    var bet_gold = hash["targetObj"];
                    var tmpECID = bet_gold.getAttribute("id").split("_")[2];
                    typingObj = bet_gold;
                    if (openedKeyboard)
                        if (!reverseSw[tmpECID])
                            util.addClass(bet_gold, "on");
                        else if (reverseSw[tmpECID] == null)
                            util.addClass(bet_gold, "on");
                        else {
                            if (reverseSw[tmpECID])
                                util.removeClass(bet_gold, "on")
                        }
                    else if (!reverseSw[tmpECID])
                        util.addClass(bet_gold, "on");
                    else if (reverseSw[tmpECID] == null)
                        util.addClass(bet_gold, "on");
                    else if (reverseSw[tmpECID])
                        util.removeClass(bet_gold, "on");
                    _self.setBetNumLock(tmpECID);
                    _self.changeTarget(hash);
                    _self.updateEvent(hash["betKey"]);
                    keyboardObj.updateSingleSw(false);
                    if (dom.getElementById("div_calc").style.display == "none")
                        _self.setBetNumVisible(true);
                    if (top["locked_slip"][tmpECID] != true) {
                        hash["targetObj"].scrollIntoView(false);
                        if (_mc["div_betInfo"].scrollTop != 0)
                            _mc["div_betInfo"].scrollTop += 50
                    }
                }
                ;
                _self.setBetNumLock = function(_ecid) {
                    var _calc = dom.getElementById("div_calc");
                    if (lockBetNum[_ecid]) {
                        _self.OrdercloseKeyboard(true);
                        if (!_calc.classList.contains("nobet"))
                            _calc.classList.add("nobet")
                    } else {
                        _self.OrdercloseKeyboard(false);
                        if (_calc.classList.contains("nobet"))
                            _calc.classList.remove("nobet")
                    }
                }
                ;
                _self.checkBetsIsZero = function() {
                    var ret = true;
                    for (var _key in lockBetNum) {
                        if (_key == "fast" || _key == "p3")
                            continue;
                        if (!lockBetNum[_key])
                            ret = lockBetNum[_key]
                    }
                    return ret
                }
                ;
                _self.updateEvent = function(_key) {
                    if (_limit[_key] != null) {
                        if (top.isSystemError || iorError)
                            _key = "noLimit";
                        minBet = _limit[_key]["min"].replace(/,/g, "");
                        maxBet = _limit[_key]["max"].replace(/,/g, "");
                        keyboardObj.updateLimit({
                            "minbet": minBet,
                            "maxbet": maxBet
                        })
                    }
                }
                ;
                _self.changeEvent = function(currency) {
                    var tmp_currency = currency;
                    keyboardObj.updateCurrency({
                        "currency": tmp_currency
                    });
                    _self.updateEvent()
                }
                ;
                _self.changeTarget = function(hash) {
                    keyboardObj.changeTarget(hash)
                }
                ;
                _self.initTyping = function() {
                    var allObj = dom.getElementsByName("bet_gold" + is_PC);
                    for (var i = 0; i < allObj.length; i++) {
                        var tmpBetGold = allObj[i];
                        if (tmpBetGold != null)
                            util.removeClass(tmpBetGold, "on")
                    }
                    var singleBetGold = dom.getElementById("bet_gold_single" + is_PC);
                    if (singleBetGold != null)
                        util.removeClass(singleBetGold, "on")
                }
                ;
                _self.spliceErrAry = function(errStr, errorAry) {
                    var ind = errorAry.indexOf(errStr);
                    if (ind != -1)
                        errorAry.splice(ind, 1);
                    myhash["errorAry"] = errorAry
                }
                ;
                _self.get_gamedate = function() {
                    var date_array = new Array;
                    var show;
                    for (var key in top.bet_viewdata) {
                        var _betKey = top.bet_viewdata[key];
                        var game_date = _self.totalParamHash[_betKey]["dates"];
                        var gameDateStr = util_game.chkGameDate(SYSTIME, game_date);
                        if (date_array.length < 2 && date_array.indexOf(gameDateStr) == -1)
                            date_array.push(gameDateStr)
                    }
                    if (date_array.indexOf("today") != -1 && date_array.indexOf("yesterday") != -1)
                        show = "today";
                    if (date_array.indexOf("today") != -1 && date_array.indexOf("yesterday") == -1)
                        show = "today";
                    if (date_array.indexOf("today") == -1 && date_array.indexOf("yesterday") != -1)
                        show = "yesterday";
                    top["orderinfo"]["date"] = show;
                    return show
                }
                ;
                _self.reloadCredit = function(cash) {
                    parentClass.dispatchEvent("reloadCredit", cash)
                }
                ;
                _self.AlertFantasyInfo = function(e, hash) {
                    parentClass.dispatchEvent("showFantasyInfo", hash)
                }
                ;
                _self.showFantasyInfo = function(hash) {
                    parentClass.dispatchEvent("showFantasyInfo", hash)
                }
            }
            ;