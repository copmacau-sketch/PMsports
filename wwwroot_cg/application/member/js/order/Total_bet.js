function Total_bet(_win, _dom) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var parentClass;
                var classname = "Total_bet.js";
                var timerHash;
                var config_set;
                var LS, LS_code, LS_game;
                var _mc = new Object;
                var util = new win.Util(win,dom);
                var util_game = new win.Util_game(win,dom);
                var d_active = "";
                var d_TS = "";
                var d_tidStr = "";
                var uni_key = "";
                var buni_key = "";
                var errorAry, errP3Ary, errP3ChgAry;
                var startTouchY = 0;
                var fixY = 5;
                var fcntAry = new Object;
                _self.totalBetHash = new Object;
                _self.successXML = new Object;
                _self.failXML = new Object;
                _self.p3XML = new Array;
                _self.dg = new Object;
                _self.bethold = new Object;
                _self.reject = new Object;
                _self.finishDiv;
                var orderBetSuccsee = false;
                var tmp_bet_select = new Object;
                var tmp_bet_select_more = new Object;
                var tmp_totalBetXML = new Object;
                var tmp_totalBetGameObj = new Object;
                var tmp_totalBetHash = new Object;
                var tmp_bet_viewdata = new Object;
                var tmp_bet_ECID = new Object;
                var tmp_ptypeHash = new Object;
                var tmp_bet_ior = new Array;
                var tmp_totalFinishHash = new Object;
                var tmp_isDelayed = false;
                var tmp_isAddTotal = false;
                _self.init = function() {
                    _mc["div_mask"] = dom.getElementById("div_mask");
                    _mc["bet_show"] = dom.getElementById("bet_show");
                    _mc["finish_model"] = dom.getElementById("finish_model");
                    util_game.init()
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    LS = parentClass.getThis("LS");
                    LS_game = parentClass.getThis("LS_game");
                    LS_code = parentClass.getThis("LS_code");
                    timerHash = parentClass.getThis("timerHash");
                    config_set = parentClass.getThis("config_set");
                    errorAry = parentClass.getThis("errorAry");
                    errP3Ary = parentClass.getThis("errP3Ary");
                    errP3ChgAry = parentClass.getThis("errP3ChgAry")
                }
                ;
                _self.bet = function(datas) {
                    _self.totalBetHash = util.mergeHash(_self.totalBetHash, datas);
                    var urlParams = "";
                    urlParams += "odd_f_type=" + top["userData"].odd_f_type;
                    urlParams += "&autoOdd=" + _self.totalBetHash["autoOdd"];
                    urlParams += "&timestamp=" + util_game.getTimestamp();
                    var sinlgeBets = _self.totalBetHash["single"];
                    var ind = 0;
                    var orderviewTS = "";
                    for (var betKey in sinlgeBets) {
                        var tmpBetslip = sinlgeBets[betKey];
                        var _wtype = tmpBetslip["wtype"] != null ? tmpBetslip["wtype"] : tmpBetslip["keepwtype"];
                        var _chose = tmpBetslip["chose_team"] != null ? tmpBetslip["chose_team"] : tmpBetslip["rtype"];
                        var _imp = tmpBetslip["imp"] != null ? tmpBetslip["imp"] : "";
                        var _ptype = tmpBetslip["ptype"] != null ? tmpBetslip["ptype"] : "";
                        if (orderviewTS == "" && tmpBetslip["orderviewTS"])
                            orderviewTS = tmpBetslip["orderviewTS"];
                        urlParams += "&bp_" + ind + "=" + betKey + "!" + tmpBetslip["gold"] + "!" + tmpBetslip["gid"] + "!" + tmpBetslip["gtype"] + "!" + _wtype + "!" + tmpBetslip["rtype"] + "!" + _chose;
                        urlParams += "!" + tmpBetslip["ioratio"] + "!" + tmpBetslip["con"] + "!" + tmpBetslip["ratio"] + "!" + (util_game.isRBWtype(_wtype) ? "Y" : "N");
                        urlParams += "!" + _imp + "!" + _ptype;
                        ind++;
                        if (fcntAry[tmpBetslip["f"]] == null)
                            fcntAry[tmpBetslip["f"]] = 0;
                        fcntAry[tmpBetslip["f"]]++
                    }
                    urlParams += "&teamCount=" + ind;
                    var cnt_str = "";
                    for (var key in fcntAry)
                        cnt_str += fcntAry[key] + key + "_";
                    if (cnt_str.substr(-1, 1) == "_")
                        cnt_str = cnt_str.substr(0, cnt_str.length - 1);
                    var p3_size = util.countSize(_self.totalBetHash["p3"]);
                    if (p3_size != 0) {
                        var tmpP3 = _self.totalBetHash["p3"];
                        if (orderviewTS == "")
                            orderviewTS = tmpP3["orderviewTS"];
                        urlParams += "&bp_p3=" + top["userData"].uid + "@" + tmpP3["keepwtype"] + "@" + top["userData"].mid + "@" + tmpP3["gtype"] + "@" + tmpP3["betData"] + "@" + tmpP3["gold"] + "@"
                    }
                    urlParams += "&timestamp2=" + orderviewTS;
                    if (top.userData.pay_type == 1)
                        urlParams += "&onlyYesterday=" + "N";
                    else
                        urlParams += "&onlyYesterday=" + _self.totalBetHash["onlyYesterday"];
                    urlParams += "&f=" + cnt_str;
                    urlParams = "p=Total_bet&" + top.param + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onBetError);
                    getHTML.addEventListener("LoadComplete", _self.betFinish);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.delay_bet = function() {
                    var urlParams = "";
                    urlParams += "odd_f_type=" + top["userData"].odd_f_type;
                    urlParams += "&active=" + d_active;
                    urlParams += "&ticket_id=" + d_tidStr;
                    urlParams += "&autoOdd=" + _self.totalBetHash["autoOdd"];
                    urlParams += "&timestamp=" + util_game.getTimestamp();
                    urlParams += "&timestamp2=" + d_TS;
                    if (top.userData.pay_type == 1)
                        urlParams += "&onlyYesterday=" + "N";
                    else
                        urlParams += "&onlyYesterday=" + _self.totalBetHash["onlyYesterday"];
                    urlParams = "p=Total_bet&" + top.param + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onBetError);
                    getHTML.addEventListener("LoadComplete", _self.betFinish);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.onBetError = function() {
                    parentClass.dispatchEvent("showUnStableMsg", {})
                }
                ;
                _self.delayFinish = function() {
                    if (timerHash != null)
                        if (timerHash["delay_timer"] != null) {
                            timerHash["delay_timer"].clearObj();
                            timerHash["delay_timer"] = null
                        }
                }
                ;
                _self.sortObj = function(obj) {
                    var arr = [];
                    for (var i in obj)
                        arr.push([obj[i], i]);
                    arr.reverse();
                    var len = arr.length;
                    var obj = {};
                    for (var i = 0; i < len; i++)
                        obj[arr[i][1]] = arr[i][0];
                    return obj
                }
                ;
                _self.betFinish = function(xml) {
                    var SP_RC_Ary = new Array("RCFH","RCFC","RCLH","RCLC");
                    var xmdObj = new Object;
                    var xmlnode = util.parseXml(xml);
                    top["betting"] = false;
                    var check_code = util.showTxt(xmlnode.Node(xmlnode.Root[0], "code").innerHTML);
                    var check_errorMsg = util.showTxt(xmlnode.Node(xmlnode.Root[0], "errormsg").innerHTML);
                    var wagersParam = {};
                    var wagersInfo = {};
                    if (check_code == "555" && check_errorMsg == "betError000" || check_errorMsg == "betError9487") {
                        if (!util.in_array(check_errorMsg, errorAry))
                            errorAry.push(check_errorMsg);
                        parentClass.dispatchEvent("showOrderMsg", true);
                        parentClass.dispatchEvent("orderTotalView", {});
                        parentClass.dispatchEvent("bettingMask", false);
                        parentClass.dispatchEvent("setIsFromBet", true)
                    } else {
                        top["totalFinishHash"] = new Object;
                        xmdObj["parlay"] = xmlnode.Node(xmlnode.Root[0], "parlay", false);
                        parlaycode = xmlnode.Node(xmdObj["parlay"][0], "code").innerHTML;
                        if (!top["isDelayed"]) {
                            var _gtype = util.showTxt(xmlnode.Node(xmdObj["parlay"][0], "gtype").innerHTML);
                            if (_self.totalBetHash["p3"]["betData"] != null) {
                                var p3Str = _self.totalBetHash["p3"]["betData"].split("^");
                                for (var i = 0; i < p3Str.length - 1; i++) {
                                    var _gid = p3Str[i].split("!")[0];
                                    top["totalFinishHash"][_gtype + "_" + top["bet_ECID"]["gid_" + _gid]] = new Object;
                                    top["totalFinishHash"][_gtype + "_" + top["bet_ECID"]["gid_" + _gid]] = top["totalBetOrderView"][_gtype + "_" + top["bet_ECID"]["gid_" + _gid]]
                                }
                                if (parlaycode != "555") {
                                    var parlaygame = xmlnode.Node(xmdObj["parlay"][0], "game", false);
                                    var parlaylength = parlaygame.length
                                }
                            } else
                                for (var betKey in _self.totalBetHash["single"]) {
                                    top["totalFinishHash"][betKey] = new Object;
                                    top["totalFinishHash"][betKey] = top["totalBetOrderView"][betKey]
                                }
                            var tmpBet = "", choiceModel, tmpBetList, betSlipModel, tmpBetSlip;
                            choiceModel = dom.getElementById("total_finish");
                            tmpBetList = choiceModel.cloneNode(true);
                            for (var betKey in _self.sortObj(top["totalFinishHash"])) {
                                var gameObj = top["totalFinishHash"][betKey];
                                betSlipModel = dom.getElementById("model_finish");
                                tmpBetSlip = betSlipModel.cloneNode(true);
                                var _gid = gameObj["gid"];
                                var _ECID = top["bet_ECID"]["gid_" + _gid];
                                var _gtype = gameObj["gtype"];
                                var _showtype = gameObj["showtype"];
                                var tmp_ior = util_game.util_formatNumber(gameObj["ioratio"]);
                                var FTmenutype = "";
                                var team_h = "";
                                var team_c = "";
                                var choice_team = "";
                                var choice_con = "";
                                var _ior = "";
                                var _conH = "";
                                var _conC = "";
                                var _score = "";
                                var needs_score = "";
                                var needs_teamData = "";
                                var _league = "";
                                var strong = "";
                                if (gameObj["bet_now"] != null && gameObj["bet_now"].indexOf("FS") != -1) {
                                    var getMenuHash = new Object;
                                    getMenuHash.gid = _gid;
                                    getMenuHash.showtype = _showtype.toLowerCase();
                                    getMenuHash.gtype = _gtype;
                                    getMenuHash.wtype = top["ptypeHash"][_gid].keepwtype;
                                    getMenuHash.rtype = gameObj["rtype"];
                                    getMenuHash.ms = "";
                                    getMenuHash.team_h = "";
                                    getMenuHash.team_c = "";
                                    getMenuHash.imp = "";
                                    getMenuHash.ptype = "";
                                    wagersInfo["gid_" + _gid] = util_game.get_wtype_name(LS_game, getMenuHash.gid, getMenuHash.showtype, getMenuHash.gtype, getMenuHash.wtype, getMenuHash.rtype, getMenuHash.ms, getMenuHash.team_h, getMenuHash.team_c, getMenuHash.imp, getMenuHash.ptype);
                                    FTmenutype = wagersInfo["gid_" + _gid]["menutype"];
                                    choice_team = gameObj["rtype_name"];
                                    _ior = util.showTxt(util_game.getIoratio(tmp_ior, null, "FS"));
                                    needs_teamData = "display:none";
                                    var rtypename = "";
                                    var _subTitle = gameObj["team_name_h"];
                                    var _subPlayType = gameObj["team_name_c"];
                                    if (gameObj["bet_now"] == "FS")
                                        rtypename = util.showTxt(_subTitle);
                                    else if (gameObj["bet_now"] == "SFS")
                                        rtypename = util.showTxt(_subTitle) + " " + util.showTxt(_subPlayType);
                                    _league = util.showTxt(gameObj["league_name"]) + " " + util.showTxt(rtypename);
                                    wagersInfo["league"] = util.showTxt(gameObj["league_name"]) + " - " + util.showTxt(rtypename)
                                } else {
                                    var periodHash = new Object;
                                    if (xmdObj["parlay"][0].innerHTML != "noBet" && parlaycode != "555" && parlaycode != "connectFail") {
                                        strong = xmlnode.Node(parlaygame[parlaylength - 1], "strong").innerHTML;
                                        concede = xmlnode.Node(parlaygame[parlaylength - 1], "concede").innerHTML;
                                        var peid = xmlnode.Node(parlaygame[parlaylength - 1], "peid").innerHTML;
                                        var period = xmlnode.Node(parlaygame[parlaylength - 1], "period").innerHTML;
                                        var competitionext = xmlnode.Node(parlaygame[parlaylength - 1], "competitionext").innerHTML;
                                        var gamenum = xmlnode.Node(parlaygame[parlaylength - 1], "gamenum").innerHTML;
                                        periodHash = {
                                            "period": period,
                                            "gameType": competitionext,
                                            "nowGame": "G" + gamenum
                                        }
                                    } else {
                                        var peid = gameObj["peid"];
                                        var period = gameObj["period"];
                                        var competitionext = gameObj["competitionext"];
                                        var gamenum = gameObj["gamenum"];
                                        periodHash = {
                                            "period": period,
                                            "gameType": competitionext,
                                            "nowGame": "G" + gamenum
                                        }
                                    }
                                    var team_h = gameObj["team_name_h"];
                                    var team_c = gameObj["team_name_c"];
                                    var imp = top["ptypeHash"][_gid].imp != null ? top["ptypeHash"][_gid].imp : "";
                                    var ptype = top["ptypeHash"][_gid].ptype != null ? top["ptypeHash"][_gid].ptype : "";
                                    var showtype = top["ptypeHash"][_gid].showtype != null ? top["ptypeHash"][_gid].showtype : "";
                                    var show_rtype = gameObj["show_rtype"] != null ? gameObj["show_rtype"] : gameObj["rtype"];
                                    var _rtype = util.showTxt(util_game.switchRtypetoFinish(top["ptypeHash"][_gid].keepwtype, show_rtype).toLowerCase());
                                    if ((_rtype.substr(0, 2) == "hp" || _rtype.substr(0, 1) == "p") && _rtype != "pd" && _rtype != "hpd" && _rtype != "pg" && _rtype != "pgf" && _rtype != "pgl" && _rtype != "pgfn" && _rtype != "pgln" && _rtype != "pgfh" && _rtype != "pgfc" && _rtype != "pglh" && _rtype != "pglc" && _rtype != "pa" && _rtype != "pah" && _rtype != "pac" && _gtype.toUpperCase() == "FT")
                                        _rtype = _rtype.replace("p", "");
                                    var _t = util_game.getTeamP(_rtype.toLowerCase());
                                    var _choice = _t != null ? _t : _rtype.substr(_rtype.length - 1, 1);
                                    var getMenuHash = new Object;
                                    getMenuHash.gid = _gid;
                                    getMenuHash.showtype = showtype.toLowerCase();
                                    getMenuHash.gtype = _gtype;
                                    getMenuHash.wtype = top["ptypeHash"][_gid].keepwtype;
                                    getMenuHash.rtype = _rtype;
                                    getMenuHash.ms = top["ptypeHash"][_gid].ms;
                                    getMenuHash.team_h = team_h;
                                    getMenuHash.team_c = team_c;
                                    getMenuHash.imp = imp;
                                    getMenuHash.ptype = ptype;
                                    wagersInfo["gid_" + _gid] = util_game.get_wtype_name(LS_game, getMenuHash.gid, getMenuHash.showtype, getMenuHash.gtype, getMenuHash.wtype, getMenuHash.rtype, getMenuHash.ms, getMenuHash.team_h, getMenuHash.team_c, getMenuHash.imp, getMenuHash.ptype, periodHash);
                                    FTmenutype = wagersInfo["gid_" + _gid]["menutype"];
                                    if (imp == "Y") {
                                        team_h = team_h.replace(ptype, "");
                                        team_c = team_c.replace(ptype, "")
                                    }
                                    if (_gtype.toUpperCase() == "BS" && util_game.checkWtypeIsWM(top["ptypeHash"][_gid].keepwtype))
                                        choice_team = LS_game.get(_rtype + "_" + _gtype.toLowerCase());
                                    else if (LS_game.get(_rtype) == "") {
                                        var Ftype = "_F_RF_DC_RDC_";
                                        var isRGA = util_game.checkWtypeIsRGA_TN(top["ptypeHash"][_gid].keepwtype.toUpperCase());
                                        var isRGOU = util_game.checkWtypeIsRGOU_TN(top["ptypeHash"][_gid].keepwtype.toUpperCase());
                                        if (Ftype.indexOf("_" + top["ptypeHash"][_gid].keepwtype.toUpperCase() + "_") >= 0) {
                                            f1 = _rtype.toUpperCase().replace(top["ptypeHash"][_gid].keepwtype.toUpperCase(), "").substr(0, 1);
                                            f2 = _rtype.toUpperCase().replace(top["ptypeHash"][_gid].keepwtype.toUpperCase(), "").substr(1, 1);
                                            choice_team = "";
                                            if (f1 == "N")
                                                choice_team += LS_game.get("mn");
                                            else {
                                                var choose = gameObj["team_name_" + f1.toLowerCase()];
                                                if (imp == "Y")
                                                    choose = choose.replace(ptype, "");
                                                choice_team += choose
                                            }
                                            choice_team += " / ";
                                            if (f2 == "N")
                                                choice_team += LS_game.get("mn");
                                            else {
                                                var choose = gameObj["team_name_" + f2.toLowerCase()];
                                                if (imp == "Y")
                                                    choose = choose.replace(ptype, "");
                                                choice_team += choose
                                            }
                                        } else if (isRGA || isRGOU)
                                            choice_team = LS_game.get(gameObj["chose_team"]);
                                        else {
                                            var choose = gameObj["team_name_" + _choice.toLowerCase()];
                                            if (imp == "Y")
                                                choose = choose.replace(ptype, "");
                                            choice_team = choose
                                        }
                                    } else {
                                        choice_team = LS_game.get(_rtype);
                                        choice_team = choice_team.replace(/\*TEAM_H\*/g, util.showTxt(team_h));
                                        choice_team = choice_team.replace(/\*TEAM_C\*/g, util.showTxt(team_c))
                                    }
                                    var tmp_team = "";
                                    var get_team = util_game.getTeamWM(_rtype);
                                    if (get_team != null) {
                                        tmp_team = util.showTxt(gameObj["team_name_" + get_team.toLowerCase()]) + " - ";
                                        if (imp == "Y" && tmp_team.indexOf(ptype) != -1)
                                            tmp_team = tmp_team.replace(ptype, "")
                                    }
                                    choice_team = tmp_team + util.showTxt(choice_team);
                                    if (imp == "Y" && choice_team.indexOf(ptype) != -1) {
                                        var tmp_ptype = ptype.replace(/\(/g, "\(").replace(/\)/g, "\)");
                                        choice_team = choice_team.replace(new RegExp(tmp_ptype,"g"), "")
                                    }
                                    var bet_wtype = util_game.chgTwtype(top["ptypeHash"][_gid].keepwtype, _rtype);
                                    if (bet_wtype == "RC" && util.in_array(_rtype.toUpperCase(), SP_RC_Ary))
                                        bet_wtype = "SR";
                                    _ior = util.showTxt(util_game.getIoratio(tmp_ior, null, bet_wtype));
                                    choice_con = gameObj["bet_chose_con"];
                                    if ((gameObj["ordercon"] == "0" || gameObj["ordercon_c"] == "0") && strong != "")
                                        if (strong == "H")
                                            _conH = 0;
                                        else
                                            _conC = 0;
                                    else {
                                        _conH = gameObj["ordercon"];
                                        _conC = gameObj["ordercon_c"]
                                    }
                                    _league = util.showTxt(gameObj["league_name"])
                                }
                                if (gameObj["bet_now"] != null && gameObj["bet_now"].indexOf("FS") != -1)
                                    needs_score = "display:none";
                                else if (_gtype.toUpperCase() == "FT" && (_showtype == "live" || util_game.isRBWtype(gameObj["wtype"]))) {
                                    var showScoreWtype = top["ptypeHash"][_gid].keepwtype;
                                    if ((showScoreWtype.substr(0, 2) == "HP" || showScoreWtype.substr(0, 1) == "P") && showScoreWtype != "PD" && showScoreWtype != "HPD" && showScoreWtype != "PG" && showScoreWtype != "PGF" && showScoreWtype != "PGL" && showScoreWtype != "PGFN" && showScoreWtype != "PGLN" && showScoreWtype != "PGFH" && showScoreWtype != "PGFC" && showScoreWtype != "PGLH" && showScoreWtype != "PGLC" && showScoreWtype != "PA" && showScoreWtype != "PAH" && showScoreWtype != "PAC")
                                        showScoreWtype = top["ptypeHash"][_gid].keepwtype.replace("P", "");
                                    if (util_game.needToShowScore(showScoreWtype)) {
                                        _score = util.showTxt(gameObj["score"]);
                                        _score = "(" + _score.replace(":", " - ") + ")";
                                        needs_score = ""
                                    } else
                                        needs_score = "display:none"
                                } else
                                    needs_score = "display:none";
                                if (_ior == "")
                                    _ior = "-";
                                var baseIorClass = util_game.checkIorClass(_ior);
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*ECID\\*","gi"), util.showTxt(_ECID));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*WTYPESHOW\\*","gi"), util.showTxt(FTmenutype));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*SCORE\\*","gi"), util.showTxt(_score));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*PARLAY_SC\\*","gi"), util.showTxt(needs_score));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*NEED_TEAM\\*","gi"), util.showTxt(needs_teamData));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*TEAM_H\\*","gi"), util.showTxt(team_h));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*TEAM_C\\*","gi"), util.showTxt(team_c));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*CHOSE_TEAM\\*","gi"), util.showTxt(choice_team));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*LEAGUE\\*","gi"), util.showTxt(_league));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*BET_IOR\\*","gi"), util.showTxt(_ior));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*IOR_COLOR\\*","gi"), util.showTxt(baseIorClass));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*CHOSE_CON\\*","gi"), util.showTxt(choice_con));
                                if (util_game.checkWtypeIsR(top["ptypeHash"][_gid].keepwtype))
                                    if (top["ptypeHash"][_gid].keepwtype != "W3")
                                        tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*CON_R_COLOR\\*","gi"), "word_yellow");
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*CON_H\\*","gi"), util.showTxt(_conH));
                                tmpBetSlip.innerHTML = tmpBetSlip.innerHTML.replace(new RegExp("\\*CON_C\\*","gi"), util.showTxt(_conC));
                                tmpBet += tmpBetSlip.innerHTML;
                                parlaylength--;
                                var str_league = wagersInfo["league"] ? wagersInfo["league"] : _league;
                                wagersParam["gid_" + _gid] = {
                                    "menutype": FTmenutype,
                                    "league": str_league,
                                    "choice_team": choice_team,
                                    "score": _score,
                                    "team_h": team_h,
                                    "team_c": team_c,
                                    "ioratio": _ior,
                                    "concede": choice_con
                                }
                            }
                            tmpBetList.innerHTML = tmpBetList.innerHTML.replace(new RegExp("\\*FINISH_BET_SLIP_SHOW\\*","gi"), tmpBet);
                            var finalBet = _mc["finish_model"].cloneNode(true);
                            finalBet.innerHTML = finalBet.innerHTML.replace(new RegExp("\\*FINISH_LIST\\*","gi"), tmpBetList.innerHTML);
                            _self.finishDiv = finalBet.innerHTML
                        }
                        if (xmdObj["parlay"][0].innerHTML == "noBet") {
                            xmdObj["success"] = xmlnode.Node(xmlnode.Root[0], "success", false);
                            xmdObj["fail"] = xmlnode.Node(xmlnode.Root[0], "fail", false);
                            xmdObj["delay"] = xmlnode.Node(xmlnode.Root[0], "delay", false);
                            if (xmdObj["delay"].length == 0)
                                if (xmdObj["success"].length != 0 || util.countSize(_self.successXML) != 0 || util.countSize(_self.p3XML) != 0) {
                                    _self.addFinishEvent(_self.finishDiv);
                                    _self.showFinishParlay(false);
                                    if (xmdObj["success"].length != 0) {
                                        orderBetSuccsee = true;
                                        xmdObj["success_betslip"] = xmlnode.Node(xmdObj["success"][0], "betslip", false);
                                        _self.successXML = _self.reAry(_self.successXML, xmlnode, xmdObj["success_betslip"])
                                    }
                                    if (xmdObj["fail"].length != 0) {
                                        xmdObj["fail_betslip"] = xmlnode.Node(xmdObj["fail"][0], "betslip", false);
                                        _self.failXML = _self.reAry(_self.failXML, xmlnode, xmdObj["fail_betslip"])
                                    }
                                    if (util.countSize(_self.p3XML) != 0) {
                                        _self.showFinishParlay(true);
                                        _self.parseParlay(xmlnode, _self.p3XML, wagersParam, wagersInfo)
                                    }
                                    if (util.countSize(_self.successXML) != 0)
                                        _self.parseSuccess(xmlnode, _self.successXML, wagersParam, wagersInfo);
                                    if (util.countSize(_self.dg) != 0 && timerHash["dgTimer_" + uni_key] == null)
                                        _self.createDangerTimer();
                                    if (util.countSize(_self.bethold) != 0 && timerHash["betholdTimer_" + uni_key] == null)
                                        _self.createbetholdTimer();
                                    if (util.countSize(_self.failXML) != 0)
                                        _self.parseFail(xmlnode, _self.failXML);
                                    else if (util.countSize(_self.reject) != 0)
                                        _self.showOrderMsg("1more_rejected", "bg_red", true);
                                    else if (util.countSize(_self.dg) != 0 || util.countSize(_self.bethold) != 0)
                                        _self.showOrderMsg("1more_pending", "bg_yellow", true);
                                    else
                                        _self.showOrderMsg("bet_success", "bg_green", true);
                                    var totalCount = util.countSize(_self.successXML) + util.countSize(_self.p3XML);
                                    dom.getElementById("finish_betCount_tt").innerHTML = util.showTxt(totalCount);
                                    _self.calcFinal();
                                    var AllCount = util.countSize(_self.successXML) + util.countSize(_self.failXML) + util.countSize(_self.p3XML);
                                    if (util.isIOS12() && util.countSize(_self.successXML) == 1 && AllCount == 1)
                                        _self.lockScroll();
                                    util.scrollFun("div_finishInfo")
                                } else {
                                    parentClass.dispatchEvent("clearOVTimer", {});
                                    parentClass.dispatchEvent("createOVTimer", {});
                                    parentClass.dispatchEvent("setIsFromBet", true);
                                    echo("ALL FAILED!!! FOOL!!!");
                                    xmdObj["fail_betslip"] = xmlnode.Node(xmdObj["fail"][0], "betslip", false);
                                    for (var f = 0; f < xmdObj["fail_betslip"].length; f++) {
                                        var betslipObj = xmdObj["fail_betslip"][f];
                                        var errMsg = xmlnode.Node(betslipObj, "errormsg").innerHTML;
                                        var _gid = xmlnode.Node(betslipObj, "gid").innerHTML;
                                        var _ECID = top["bet_ECID"]["gid_" + _gid];
                                        if (util_game.isOrderLevel(errMsg)) {
                                            if (util_game.isRemoveClose(errMsg)) {
                                                parentClass.setLocked("set", "specific", _ECID);
                                                parentClass.showSingleErrorMsg(_ECID, true)
                                            }
                                            var tmp = "";
                                            var org = "";
                                            if (errMsg == "1X020" || errMsg == "1X019") {
                                                tmp = util.showTxt(util.formatThousand(xmlnode.Node(betslipObj, "errorvalue").innerHTML));
                                                org = "max"
                                            }
                                            if (util_game.isOverSingleCredit(errMsg) || util_game.isLessSingleCredit(errMsg))
                                                tmp = LS.get(top["userData"].currency) + " " + util.showTxt(util.formatThousand(xmlnode.Node(betslipObj, "errorvalue").innerHTML * 1));
                                            if (errMsg == "1X017") {
                                                errMsg = "error_mem_max";
                                                tmp = util.showTxt(util.formatThousand(xmlnode.Node(betslipObj, "errorvalue").innerHTML * 1));
                                                org = "error_mem_max1"
                                            }
                                            parentClass.setSingleErrorCode(_ECID, errMsg);
                                            parentClass.setSingleErrorMsg(_ECID, errMsg, tmp, org);
                                            if (!util_game.onlyOrderLevel(errMsg))
                                                parentClass.showSingleErrorMsg(_ECID, true)
                                        } else {
                                            parentClass.setSingleErrorCode(_ECID, errMsg);
                                            parentClass.setSingleErrorMsg(_ECID, errMsg, tmp, org);
                                            parentClass.showSingleErrorMsg(_ECID, true)
                                        }
                                    }
                                    parentClass.dispatchEvent("orderTotalView", {});
                                    parentClass.dispatchEvent("showOrderMsg", true);
                                    parentClass.dispatchEvent("bettingMask", false);
                                    top["isFromFast"] = false;
                                    top["isDelayed"] = false;
                                    return
                                }
                            else {
                                top["isDelayed"] = true;
                                if (xmdObj["success"].length != 0) {
                                    orderBetSuccsee = true;
                                    xmdObj["success_betslip"] = xmlnode.Node(xmdObj["success"][0], "betslip", false);
                                    _self.successXML = _self.reAry(_self.successXML, xmlnode, xmdObj["success_betslip"])
                                }
                                if (xmdObj["fail"].length != 0) {
                                    xmdObj["fail_betslip"] = xmlnode.Node(xmdObj["fail"][0], "betslip", false);
                                    _self.failXML = _self.reAry(_self.failXML, xmlnode, xmdObj["fail_betslip"])
                                }
                                xmdObj["delay_betslip"] = xmlnode.Node(xmdObj["delay"][0], "betslip", false);
                                d_tidStr = "";
                                for (var d = 0; d < xmdObj["delay_betslip"].length; d++) {
                                    d_active = xmlnode.Node(xmdObj["delay_betslip"][d], "active").innerHTML;
                                    d_TS = xmlnode.Node(xmdObj["delay_betslip"][d], "timestamp").innerHTML;
                                    d_tidStr += xmlnode.Node(xmdObj["delay_betslip"][d], "gtype").innerHTML + "!" + xmlnode.Node(xmdObj["delay_betslip"][d], "gid").innerHTML + "!" + xmlnode.Node(xmdObj["delay_betslip"][d], "ticket_id").innerHTML + "!" + xmlnode.Node(xmdObj["delay_betslip"][d], "isRB").innerHTML + "^"
                                }
                                if (timerHash["delay_timer"] == null) {
                                    timerHash["delay_timer"] = new Timer(config_set.get("CONFIG_DELAY_TIME"),1);
                                    timerHash["delay_timer"].setParentclass(_self);
                                    timerHash["delay_timer"].init()
                                }
                                timerHash["delay_timer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.delay_bet);
                                timerHash["delay_timer"].startTimer();
                                parentClass.dispatchEvent("showDelayLoading", true);
                                return
                            }
                        } else {
                            var parlay_code = xmlnode.Node(xmdObj["parlay"][0], "code").innerHTML;
                            if (parlay_code == "560") {
                                xmdObj["success"] = xmlnode.Node(xmlnode.Root[0], "success", false);
                                xmdObj["fail"] = xmlnode.Node(xmlnode.Root[0], "fail", false);
                                xmdObj["delay"] = xmlnode.Node(xmlnode.Root[0], "delay", false);
                                orderBetSuccsee = true;
                                _self.p3XML = _self.reAry(_self.p3XML, xmlnode, xmdObj["parlay"]);
                                if (xmdObj["delay"].length == 0) {
                                    _self.addFinishEvent(_self.finishDiv);
                                    _self.showFinishParlay(true);
                                    _self.parseParlay(xmlnode, _self.p3XML, wagersParam, wagersInfo);
                                    if (xmdObj["success"].length != 0) {
                                        xmdObj["success_betslip"] = xmlnode.Node(xmdObj["success"][0], "betslip", false);
                                        _self.successXML = _self.reAry(_self.successXML, xmlnode, xmdObj["success_betslip"]);
                                        _self.parseSuccess(xmlnode, _self.successXML, wagersParam, wagersInfo)
                                    }
                                    if (xmdObj["fail"].length != 0) {
                                        xmdObj["fail_betslip"] = xmlnode.Node(xmdObj["fail"][0], "betslip", false);
                                        _self.failXML = _self.reAry(_self.failXML, xmlnode, xmdObj["fail_betslip"])
                                    }
                                    if (xmdObj["success"].length == 0 && xmdObj["fail"].length == 0) {
                                        var finish_iorAry = dom.getElementsByName("finish_bet_ior");
                                        for (var i = 0; i < finish_iorAry.length; i++) {
                                            var tmpIor = finish_iorAry[i].innerHTML;
                                            var baseIorClass = util_game.checkIorClass(tmpIor);
                                            finish_iorAry[i].className = baseIorClass
                                        }
                                    }
                                    if (util.countSize(_self.dg) != 0 && timerHash["dgTimer_" + uni_key] == null)
                                        _self.createDangerTimer();
                                    if (util.countSize(_self.bethold) != 0 && timerHash["betholdTimer_" + uni_key] == null)
                                        _self.createbetholdTimer();
                                    if (util.countSize(_self.failXML) != 0)
                                        _self.parseFail(xmlnode, _self.failXML);
                                    else if (util.countSize(_self.reject) != 0)
                                        _self.showOrderMsg("1more_rejected", "bg_red", true);
                                    else if (util.countSize(_self.dg) != 0 || util.countSize(_self.bethold) != 0)
                                        _self.showOrderMsg("1more_pending", "bg_yellow", true);
                                    else
                                        _self.showOrderMsg("bet_success", "bg_green", true);
                                    var totalCount = util.countSize(_self.successXML) + util.countSize(_self.p3XML);
                                    dom.getElementById("finish_betCount_tt").innerHTML = util.showTxt(totalCount);
                                    _self.calcFinal();
                                    var AllCount = util.countSize(_self.successXML) + util.countSize(_self.failXML) + util.countSize(_self.p3XML);
                                    if (util.isIOS12() && util.countSize(_self.successXML) == 1 && AllCount == 1)
                                        _self.lockScroll();
                                    util.scrollFun("div_finishInfo")
                                } else {
                                    top["isDelayed"] = true;
                                    if (xmdObj["success"].length != 0) {
                                        xmdObj["success_betslip"] = xmlnode.Node(xmdObj["success"][0], "betslip", false);
                                        _self.successXML = _self.reAry(_self.successXML, xmlnode, xmdObj["success_betslip"])
                                    }
                                    if (xmdObj["fail"].length != 0) {
                                        xmdObj["fail_betslip"] = xmlnode.Node(xmdObj["fail"][0], "betslip", false);
                                        _self.failXML = _self.reAry(_self.failXML, xmlnode, xmdObj["fail_betslip"])
                                    }
                                    xmdObj["delay_betslip"] = xmlnode.Node(xmdObj["delay"][0], "betslip", false);
                                    d_tidStr = "";
                                    for (var d = 0; d < xmdObj["delay_betslip"].length; d++) {
                                        d_active = xmlnode.Node(xmdObj["delay_betslip"][d], "active").innerHTML;
                                        d_TS = xmlnode.Node(xmdObj["delay_betslip"][d], "timestamp").innerHTML;
                                        d_tidStr += xmlnode.Node(xmdObj["delay_betslip"][d], "gtype").innerHTML + "!" + xmlnode.Node(xmdObj["delay_betslip"][d], "gid").innerHTML + "!" + xmlnode.Node(xmdObj["delay_betslip"][d], "ticket_id").innerHTML + "!" + xmlnode.Node(xmdObj["delay_betslip"][d], "isRB").innerHTML + "^"
                                    }
                                    if (timerHash["delay_timer"] == null) {
                                        timerHash["delay_timer"] = new Timer(config_set.get("CONFIG_DELAY_TIME"),1);
                                        timerHash["delay_timer"].setParentclass(_self);
                                        timerHash["delay_timer"].init()
                                    }
                                    timerHash["delay_timer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.delay_bet);
                                    timerHash["delay_timer"].startTimer();
                                    parentClass.dispatchEvent("showDelayLoading", true);
                                    return
                                }
                            } else {
                                parentClass.dispatchEvent("clearOVTimer", {});
                                parentClass.dispatchEvent("createOVTimer", {});
                                parentClass.dispatchEvent("setIsFromBet", true);
                                var parlay_errMsg = xmlnode.Node(xmdObj["parlay"][0], "errormsg").innerHTML;
                                var tmp = "";
                                if (parlay_code == "connectFail" || parlay_errMsg == "1X037") {
                                    top.isSystemError = true;
                                    if (parlay_code == "connectFail" && !util.in_array(parlay_code, errorAry))
                                        errorAry.push(parlay_code);
                                    if (parlay_errMsg == "1X037" && !util.in_array(parlay_errMsg, errorAry))
                                        errorAry.push(parlay_errMsg);
                                    parentClass.dispatchEvent("showOrderMsg", true);
                                    parentClass.dispatchEvent("enabledBet", false);
                                    parentClass.dispatchEvent("orderTotalView", {});
                                    parentClass.dispatchEvent("bettingMask", false);
                                    return
                                }
                                if (!util.in_array(parlay_errMsg, errorAry))
                                    errorAry.push(parlay_errMsg);
                                if (parlay_errMsg == "1X001") {
                                    parentClass.dispatchEvent("showParlay", true);
                                    parentClass.showParlayErrorMsg(true, parlay_errMsg);
                                    parentClass.setLocked("set", "parlay");
                                    parentClass.setLocked("set", "single")
                                } else if (parlay_errMsg == "1X034") {
                                    parentClass.dispatchEvent("showParlay", false);
                                    parentClass.showParlayErrorMsg(true, parlay_errMsg);
                                    xmdObj["errorGame"] = xmlnode.Node(xmdObj["parlay"][0], "errorgame", false);
                                    if (xmdObj["errorGame"].length != 0) {
                                        parentClass.dispatchEvent("clearDots", {});
                                        for (var i = 0; i < xmdObj["errorGame"].length; i++) {
                                            var error_gid = xmdObj["errorGame"][i].innerHTML;
                                            var _ecid = top["bet_ECID"]["gid_" + error_gid];
                                            errP3Ary[_ecid] = error_gid;
                                            _mc["dots_" + _ecid] = dom.getElementById("dots_" + _ecid);
                                            util.addClass(_mc["dots_" + _ecid], "no_parlayin")
                                        }
                                    }
                                } else if (parlay_errMsg == "1X027") {
                                    par_limit_min = xmlnode.Node(xmdObj["parlay"][0], "par_limit_min").innerHTML;
                                    par_limit_max = xmlnode.Node(xmdObj["parlay"][0], "par_limit_max").innerHTML;
                                    var _betSize = util.countSize(top["bet_select"]);
                                    var errMsg = "";
                                    if (_betSize < par_limit_min) {
                                        errMsg = "1X032";
                                        parentClass.showParlayLimit(true, par_limit_min)
                                    } else if (_betSize > par_limit_max)
                                        errMsg = parlay_errMsg;
                                    else
                                        errMsg = parlay_errMsg;
                                    parentClass.dispatchEvent("showParlay", false);
                                    parentClass.showParlayErrorMsg(true, errMsg)
                                } else if (parlay_errMsg == "1X020" || parlay_errMsg == "1X019") {
                                    tmp = util.formatThousand(xmlnode.Node(xmdObj["parlay"][0], "errorvalue").innerHTML);
                                    parentClass.showParlayErrorMsg(true, parlay_errMsg, tmp, "max")
                                } else if (parlay_errMsg == "1X018" || parlay_errMsg == "1X023") {
                                    tmp = xmlnode.Node(xmdObj["parlay"][0], "errorvalue").innerHTML * 1;
                                    parentClass.showParlayErrorMsg(true, parlay_errMsg, tmp)
                                } else if (util_game.isChgIor(parlay_errMsg) || util_game.isChgConcede(parlay_errMsg)) {
                                    parentClass.showParlayErrorMsg(true, parlay_errMsg);
                                    xmdObj["errorGame"] = xmlnode.Node(xmdObj["parlay"][0], "errorgame", false);
                                    if (xmdObj["errorGame"].length != 0)
                                        for (var i = 0; i < xmdObj["errorGame"].length; i++) {
                                            var error_gid = xmdObj["errorGame"][i].innerHTML;
                                            var tmpECID = top["bet_ECID"]["gid_" + error_gid];
                                            errP3ChgAry[tmpECID] = error_gid;
                                            echo("[total_bet] = ", errP3ChgAry)
                                        }
                                } else if (parlay_code != "noP3")
                                    parentClass.showParlayErrorMsg(true, parlay_errMsg);
                                parentClass.dispatchEvent("showOrderMsg", true);
                                parentClass.dispatchEvent("orderTotalView", {});
                                parentClass.dispatchEvent("bettingMask", false)
                            }
                        }
                        if (top.betMode == "total" && orderBetSuccsee) {
                            tmp_bet_select = top["bet_select"];
                            tmp_bet_select_more = top["bet_select_more"];
                            tmp_totalBetXML = top["totalBetXML"];
                            tmp_totalBetGameObj = top["totalBetGameObj"];
                            tmp_totalBetHash = top["totalBetHash"];
                            tmp_bet_viewdata = top["bet_viewdata"];
                            tmp_bet_ECID = top["bet_ECID"];
                            tmp_ptypeHash = top["ptypeHash"];
                            tmp_bet_ior = top["bet_ior"];
                            tmp_totalFinishHash = top["totalFinishHash"];
                            tmp_isDelayed = top["isDelayed"];
                            tmp_isAddTotal = top["isAddTotal"];
                            parentClass.dispatchEvent("clearOrderbets")
                        }
                        var finish_nowCredit = dom.getElementById("finish_nowCredit");
                        if (finish_nowCredit != null) {
                            var nowCredit = xmlnode.Node(xmlnode.Root[0], "nowcredit").innerHTML;
                            _self.updateCurrency(top["userData"].currency);
                            finish_nowCredit.innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(nowCredit)));
                            var div_lastBetOption = dom.getElementById("div_lastBetOption");
                            var div_lastBetOption_txt = document.getElementById("div_lastBetOption_txt");
                            div_lastBetOption_txt.innerHTML = LS.get("lastBetOption_total");
                            if (top["orderinfo"]["date"] == "yesterday")
                                top["userData"].yesterdayCredit = nowCredit;
                            util.addEvent(div_lastBetOption, "click", _self.reBet, div_lastBetOption);
                            parentClass.dispatchEvent("setBottomon", {});
                            parentClass.dispatchEvent("reloadCredit", nowCredit)
                        }
                        top["wagers_oldTS"] = 0
                    }
                    top["isFromFast"] = false;
                    top["isDelayed"] = false;
                    top["LastBet_select"] = new Object;
                    top["keepGold"] = new Object;
                    util.clearObject(wagersParam)
                }
                ;
                _self.createDangerTimer = function() {
                    uni_key = util_game.getTimestamp();
                    if (util.countSize(_self.dg) == 0)
                        return;
                    if (timerHash["dgTimer_" + uni_key] != null)
                        return;
                    if (!util.in_object(uni_key, top["dgTid_hash"]))
                        top["dgTid_hash"][uni_key] = "";
                    if (!util.in_object(uni_key, top["dgStatus_hash"]))
                        top["dgStatus_hash"][uni_key] = "isReceipt";
                    for (var _key in top["dgStatus_hash"])
                        if (timerHash["dgTimer_" + _key] != null) {
                            top["dgStatus_hash"][_key] = "isToast";
                            timerHash["dgTimer_" + _key]._status = "isToast"
                        }
                    timerHash["dgTimer_" + uni_key] = new Timer(config_set.get("CONFIG_DANGEROUS"));
                    timerHash["dgTimer_" + uni_key].setParentclass(_self);
                    timerHash["dgTimer_" + uni_key].init();
                    timerHash["dgTimer_" + uni_key].dont_clear = true;
                    timerHash["dgTimer_" + uni_key]._status = "isReceipt";
                    timerHash["dgTimer_" + uni_key].addEventListener("TimerEvent.TIMER", _self.dgTimerRun);
                    timerHash["dgTimer_" + uni_key].addEventListener("TimerEvent.TIMER_COMPLETE", _self.dgTimerFinish);
                    timerHash["dgTimer_" + uni_key].startTimer()
                }
                ;
                _self.clearDangerTimer = function(xml_key) {
                    if (xml_key == "all") {
                        for (var _key in top["dgTid_hash"])
                            if (timerHash["dgTimer_" + _key] != null) {
                                timerHash["dgTimer_" + _key].clearObj();
                                timerHash["dgTimer_" + _key] = null
                            }
                        return true
                    }
                    if (timerHash["dgTimer_" + xml_key] != null) {
                        timerHash["dgTimer_" + xml_key].clearObj();
                        timerHash["dgTimer_" + xml_key] = null
                    }
                    _self.dg = new Object;
                    return true
                }
                ;
                _self.dgTimerRun = function(count) {
                    _self.checkDanger()
                }
                ;
                _self.dgTimerFinish = function() {}
                ;
                _self.checkDanger = function() {
                    var dg_tid = "";
                    var p3_dg = "";
                    for (var _tid in _self.dg) {
                        if (_self.dg[_tid] == "p3") {
                            p3_dg = _tid;
                            continue
                        }
                        dg_tid += _tid + ","
                    }
                    if (dg_tid.substr(-1, 1) == ",")
                        dg_tid = dg_tid.substr(0, dg_tid.length - 1);
                    top["dgTid_hash"][uni_key] = dg_tid + "," + p3_dg;
                    var urlParams = "";
                    urlParams += "type=xml";
                    urlParams += "&from=bet";
                    urlParams += "&uni_key=" + uni_key;
                    urlParams += "&tid=" + dg_tid;
                    if (p3_dg != "")
                        urlParams += "&p3_tid=" + p3_dg;
                    urlParams = "p=get_dangerous&" + top.param + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.checkDangerFinish);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.checkDangerFinish = function(xml) {
                    var xmlnode = util.parseXml(xml);
                    var tickets = xmlnode.Node(xmlnode.Root[0], "tickets");
                    var xml_key = xmlnode.Node(xmlnode.Root[0], "uni_key").innerHTML;
                    var ticket = xmlnode.Node(tickets, "ticket", false);
                    var clearStatus = new Array("R","A");
                    var toast_sw = false;
                    if (!top["openBets"]) {
                        if (top["dgStatus_hash"][xml_key])
                            top["dgStatus_hash"][xml_key] = "isToast";
                        if (timerHash["dgTimer_" + xml_key])
                            timerHash["dgTimer_" + xml_key]._status = "isToast"
                    }
                    for (var _tid in _self.dg) {
                        var _ECID = "";
                        var _status = ticket[_tid].innerHTML;
                        if (top["dgStatus_hash"][xml_key] != "isToast") {
                            if (_self.dg[_tid] == "p3") {
                                var dg_p3 = dom.getElementById("finish_bet_dg_p3");
                                _self.chgDangerStatus(dg_p3, _status)
                            } else if (ticket[_tid] != null) {
                                _ECID = _self.dg[_tid];
                                var div_TID = dom.getElementById("show_tid_" + _ECID);
                                if (top["openBets"] && div_TID != null)
                                    div_TID.style.display = "";
                                var objids = ",finish_bet_dg,";
                                var ary = util.getObjAry(div_TID, objids);
                                _self.chgDangerStatus(ary["finish_bet_dg"], _status)
                            }
                            if (util.in_array(_status, clearStatus)) {
                                delete _self.dg[_tid];
                                if (_status == "R")
                                    _self.reject[_tid] = _ECID != "" ? _ECID : "p3"
                            }
                            if (!top["isOrderView"])
                                if (util.countSize(_self.reject) != 0) {
                                    _self.showOrderMsg("1more_rejected", "bg_red", true);
                                    if (!top["openBets"] && toast_sw) {
                                        parentClass.dispatchEvent("showAlertMsg", {
                                            "target": "message_pop_nobtn",
                                            "msg": LS_code.get("1more_rejected_toast"),
                                            "confirm": "N",
                                            "retFun": ""
                                        });
                                        _self.clearDangerTimer("all")
                                    } else if (util.countSize(_self.dg) == 0)
                                        _self.clearDangerTimer(xml_key);
                                    toast_sw = true
                                } else if (util.countSize(_self.dg) != 0 || util.countSize(_self.bethold) != 0) {
                                    _self.showOrderMsg("1more_pending", "bg_yellow", true);
                                    if (util.countSize(_self.dg) == 0)
                                        _self.clearDangerTimer(xml_key)
                                } else {
                                    echo("acceptclear");
                                    _self.showOrderMsg("bet_success", "bg_green", true);
                                    if (util.countSize(_self.dg) == 0)
                                        _self.clearDangerTimer(xml_key)
                                }
                            else if (util.countSize(_self.reject) != 0) {
                                parentClass.dispatchEvent("showAlertMsg", {
                                    "target": "message_pop_nobtn",
                                    "msg": LS_code.get("1more_rejected_toast"),
                                    "confirm": "N",
                                    "retFun": ""
                                });
                                _self.clearDangerTimer("all")
                            } else if (util.countSize(_self.dg) == 0)
                                _self.clearDangerTimer(xml_key);
                            if (_self.totalBetHash["onlyYesterday"] == "Y" && top.userData.pay_type == 0)
                                parentClass.dispatchEvent("reloadCredit", top.userData.yesterdayCredit);
                            else
                                parentClass.dispatchEvent("reloadCredit")
                        } else {
                            if (_status == "R") {
                                parentClass.dispatchEvent("showAlertMsg", {
                                    "target": "message_pop_nobtn",
                                    "msg": LS_code.get("1more_rejected_toast"),
                                    "confirm": "N",
                                    "retFun": ""
                                });
                                for (var _key in top["dgStatus_hash"])
                                    if (timerHash["dgTimer_" + _key] != null && timerHash["dgTimer_" + _key]._status == "isToast") {
                                        timerHash["dgTimer_" + _key].clearObj();
                                        timerHash["dgTimer_" + _key] = null
                                    }
                                if (_self.totalBetHash["onlyYesterday"] == "Y" && top.userData.pay_type == 0)
                                    parentClass.dispatchEvent("reloadCredit", top.userData.yesterdayCredit);
                                else
                                    parentClass.dispatchEvent("reloadCredit");
                                return
                            }
                            if (_status == "A") {
                                _self.clearDangerTimer(xml_key);
                                return
                            }
                        }
                    }
                }
                ;
                _self.chgDangerStatus = function(obj, _status, msg, error_value) {
                    if (top["openBets"]) {
                        var str_sty = "";
                        var str_code = "";
                        switch (_status) {
                        case "A":
                            str_sty = "status_word word_green";
                            body_sty = "bg_green";
                            str_code = "bet_success";
                            break;
                        case "R":
                            str_sty = "status_word word_red";
                            body_sty = "bg_red";
                            str_code = "bet_rejected";
                            _self.reloadCredit();
                            break;
                        case "F":
                            str_sty = "status_word word_fail";
                            body_sty = "bg_red";
                            str_code = top["isDelayed"] ? "1more_failed" : "1more_place_failed";
                            _self.reloadCredit();
                            _self.showErrorMsg(obj, msg, error_value);
                            break;
                        case "N":
                        default:
                            str_sty = "status_word word_yellow";
                            body_sty = "bg_yellow";
                            str_code = "1more_pending";
                            break
                        }
                        echo("[isOrderView] = ", top["isOrderView"]);
                        if (obj != null && !top["isOrderView"]) {
                            obj.className = str_sty;
                            _self.showOrderMsg(str_code, body_sty, true)
                        }
                    }
                }
                ;
                _self.showErrorMsg = function(obj, errormsg, error_value) {
                    var org = "";
                    var dollars = util.showTxt(util.formatThousand(error_value));
                    var currency = LS.get(top["userData"].currency) + " ";
                    if (errormsg != "")
                        if (errormsg == "1X017") {
                            errormsg = "error_mem_max";
                            org = "error_mem_max1";
                            obj.innerHTML = util.showTxt(LS_code.get(errormsg)) + dollars + util.showTxt(LS_code.get(org))
                        } else if (errormsg == "1X020" || errormsg == "1X019") {
                            org = "max";
                            obj.innerHTML = util.showTxt(LS_code.get(errormsg)) + dollars + util.showTxt(LS_code.get(org))
                        } else if (util_game.isOverSingleCredit(errormsg) || util_game.isLessSingleCredit(errormsg))
                            obj.innerHTML = util.showTxt(LS_code.get(errormsg)) + currency + dollars + ".";
                        else
                            obj.innerHTML = util.showTxt(LS_code.get(errormsg))
                }
                ;
                _self.reloadCredit = function(param) {
                    var urlParams = "";
                    urlParams = "p=get_member_data&" + top.param + "&change=credit";
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.updateMemData);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.updateMemData = function(xml) {
                    memparamHash = util.showConnectMsg(xml);
                    if (util.alertConnectMsg(memparamHash))
                        return;
                    var xmdObj = new Object;
                    xmlnode = util.parseXml(xml);
                    xmdObj["code"] = xmlnode.Node(xmlnode.Root[0], "code");
                    if (xmdObj["code"].innerHTML == "get_credit_data") {
                        var maxcredit = xmlnode.Node(xmlnode.Root[0], "maxcredit").innerHTML;
                        var finish_nowCredit = dom.getElementById("finish_nowCredit");
                        if (finish_nowCredit)
                            finish_nowCredit.innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(maxcredit)));
                        top.userData.maxcredit = maxcredit
                    }
                    parentClass.dispatchEvent("reloadCredit")
                }
                ;
                _self.showOrderMsg = function(code, bgCalss, isShow) {
                    var orderMsg_div = dom.getElementById("orderMsg_div");
                    var orderMsg = dom.getElementById("orderMsg");
                    if (top.betMode == "total") {
                        orderMsg.innerHTML = "";
                        orderMsg_div.style.display = isShow ? "" : "none";
                        if (isShow) {
                            orderMsg_div.className = "ord_msg ord_levelmsg " + bgCalss;
                            var msgli = document.createElement("li");
                            msgli.innerHTML = util.showTxt(LS_code.get(code));
                            orderMsg.appendChild(msgli)
                        }
                    }
                }
                ;
                _self.addFinishEvent = function(div) {
                    var betDiv = dom.getElementById("bet_show");
                    betDiv.innerHTML = "";
                    betDiv.innerHTML = div;
                    var objids = ",total_print,finishBtn_show,";
                    var ary = util.getObjAry(betDiv, objids);
                    util.removeEvent(ary["finishBtn_show"], "click");
                    util.addEvent(ary["finishBtn_show"], "click", parentClass.OrderCloseBet, true);
                    if (getView().viewportwidth >= 1024)
                        util.addEvent(ary["total_print"], "click", parentClass.totalPrint, betDiv);
                    util.removeEvent(_mc["div_mask"], "click");
                    util.addEvent(_mc["div_mask"], "click", parentClass.OrderCloseBet, true);
                    parentClass.dispatchEvent("bettingMask", false)
                }
                ;
                _self.showFinishParlay = function(isShow) {
                    var header = dom.getElementById("finish_total_parlay_header");
                    var finishParlay = dom.getElementById("finish_total_parlay");
                    header.style.display = isShow ? "" : "none";
                    finishParlay.style.display = isShow ? "" : "none"
                }
                ;
                _self.reAry = function(tarObj, xmlnode, tmpObj) {
                    for (var i = 0; i < tmpObj.length; i++) {
                        var key = xmlnode.Node(tmpObj[i], "ticket_id").innerHTML;
                        if (key + "" == "undefined")
                            key = xmlnode.Node(tmpObj[i], "gid").innerHTML;
                        tarObj[key] = tmpObj[i]
                    }
                    return tarObj
                }
                ;
                _self.parseSuccess = function(xmlnode, successObj, wagersParam, wagersInfo) {
                    top["isOrderView"] = false;
                    echo("[Success] = ", successObj);
                    for (var s in successObj) {
                        var _betslip = successObj[s];
                        var _gid = xmlnode.Node(_betslip, "gid").innerHTML;
                        var _ECID = top["bet_ECID"]["gid_" + _gid];
                        var _tid = xmlnode.Node(_betslip, "ticket_id").innerHTML;
                        var _gold = xmlnode.Node(_betslip, "gold").innerHTML;
                        var _gtype = xmlnode.Node(_betslip, "gtype").innerHTML;
                        var _ioratio = xmlnode.Node(_betslip, "ioratio").innerHTML;
                        var _wtype = xmlnode.Node(_betslip, "wtype").innerHTML;
                        var _rtype = xmlnode.Node(_betslip, "rtype").innerHTML;
                        var _type = xmlnode.Node(_betslip, "type").innerHTML;
                        var scroe_h = xmlnode.Node(_betslip, "score_h").innerHTML;
                        var score_c = xmlnode.Node(_betslip, "score_c").innerHTML;
                        var _dg = xmlnode.Node(_betslip, "ball_act").innerHTML;
                        var _dg_mode = xmlnode.Node(_betslip, "dg_mode").innerHTML;
                        var _bethold = xmlnode.Node(_betslip, "delaysec").innerHTML;
                        var _team_id_h = xmlnode.Node(_betslip, "team_id_h").innerHTML;
                        var _team_id_c = xmlnode.Node(_betslip, "team_id_c").innerHTML;
                        var _strong = xmlnode.Node(_betslip, "strong").innerHTML;
                        var _spread = xmlnode.Node(_betslip, "spread").innerHTML;
                        var _score = "(" + scroe_h + " - " + score_c + ")";
                        var betKey = _gtype + "_" + _ECID;
                        var div_TID = dom.getElementById("show_tid_" + _ECID);
                        div_TID.style.display = "";
                        var objids = ",finish_bet_tid,finish_bet_gold,finish_bet_wingold,finish_bet_dg,";
                        var ary = util.getObjAry(div_TID, objids);
                        var finishObj = dom.getElementById("finish_" + _ECID);
                        var bet_ids = ",finish_bet_ior,finish_bet_chose_con,finish_bet_chose_team,";
                        var betFinishInfoObj = util.getObjAry(finishObj, bet_ids);
                        var tmpIor = util.showTxt(util_game.getIoratio(_ioratio, null, _wtype));
                        var baseIorClass = util_game.checkIorClass(tmpIor);
                        if (_wtype == "FS")
                            betFinishInfoObj["finish_bet_chose_team"].innerHTML = util.showTxt(xmlnode.Node(_betslip, "rtype_name").innerHTML);
                        betFinishInfoObj["finish_bet_ior"].className = baseIorClass;
                        betFinishInfoObj["finish_bet_ior"].innerHTML = tmpIor;
                        var finishDiv = dom.getElementById("finish_" + _ECID);
                        var scoreStr = ",finish_bet_score,";
                        var scoreAry = util.getObjAry(finishDiv, scoreStr);
                        if (_gtype == "FT") {
                            scoreAry["finish_bet_score"].innerHTML = util_game.needToShowScore(_wtype) ? _score : "";
                            scoreAry["finish_bet_score"].style.display = util_game.needToShowScore(_wtype) ? "" : "none";
                            _mc["div_icon_info_bet_" + _ECID] = dom.getElementById("div_icon_info_bet_" + _ECID);
                            if (top["totalFinishHash"][betKey]["isFantasy"] == "Y") {
                                _mc["div_icon_info_bet_i_" + _ECID] = dom.getElementById("div_icon_info_bet_i_" + _ECID);
                                _mc["div_icon_info_bet_" + _ECID].style.display = "";
                                util.addEvent(_mc["div_icon_info_bet_i_" + _ECID], "click", _self.AlertFantasyInfo, top["totalFinishHash"][betKey]["fantasyObj"])
                            } else
                                _mc["div_icon_info_bet_" + _ECID].style.display = "none"
                        } else {
                            scoreAry["finish_bet_score"].innerHTML = "";
                            scoreAry["finish_bet_score"].style.display = "none"
                        }
                        ary["finish_bet_tid"].innerHTML = util.showTxt(util_game.getTicketType(_wtype) + _tid);
                        ary["finish_bet_gold"].innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(_gold)));
                        ary["finish_bet_wingold"].innerHTML = util.showTxt(util.formatThousand(util_game.calcWindGold(_gold, _ioratio, _wtype)));
                        if (_dg == "Y" || _dg_mode == "Y") {
                            _self.chgDangerStatus(ary["finish_bet_dg"], "N");
                            _self.dg[_tid] = _ECID
                        }
                        if (_gtype != "FT" && _bethold > 0) {
                            _self.chgbetholdStatus(ary["finish_bet_dg"], "N");
                            _self.bethold[_tid] = _ECID
                        }
                        var _key = "gid_" + _gid;
                        wagersParam[_key]["gold"] = ary["finish_bet_gold"].innerHTML;
                        wagersParam[_key]["wingold"] = ary["finish_bet_wingold"].innerHTML;
                        wagersParam[_key]["tid"] = ary["finish_bet_tid"].innerHTML;
                        wagersParam[_key]["gid"] = _gid;
                        wagersParam[_key]["gtype"] = _gtype;
                        wagersParam[_key]["wtype"] = _wtype;
                        wagersParam[_key]["rtype"] = _rtype;
                        wagersParam[_key]["type"] = _type;
                        wagersParam[_key]["team_id_h"] = _team_id_h;
                        wagersParam[_key]["team_id_c"] = _team_id_c;
                        wagersParam[_key]["strong"] = _strong;
                        wagersParam[_key]["spread"] = _spread;
                        wagersParam[_key]["ball_act"] = _dg;
                        wagersParam[_key]["dg_mode"] = _dg_mode;
                        wagersParam[_key]["delaysec"] = _bethold;
                        wagersParam[_key]["menutype"] = wagersInfo[_key]["menutype"];
                        wagersParam[_key]["w_ms"] = wagersInfo[_key]["subtype"];
                        wagersParam[_key]["ptype"] = wagersInfo[_key]["ptype"];
                        wagersParam[_key]["str_showtype"] = wagersInfo[_key]["str_showtype"];
                        wagersParam[_key]["title_gtype"] = wagersInfo[_key]["title_gtype"];
                        wagersParam[_key]["str_wtype"] = wagersInfo[_key]["wtype"];
                        wagersParam[_key]["choice_team"] = util.chkXmlTag(wagersParam[_key]["choice_team"]);
                        if (typeof util.transTodayWagers == "function")
                            util.transTodayWagers(wagersParam[_key], LS_game)
                    }
                }
                ;
                _self.parseFail = function(xmlnode, failObj) {
                    top["isOrderView"] = false;
                    echo("[Fail] = ", failObj);
                    for (var f in failObj) {
                        var _betslip = failObj[f];
                        var _gid = xmlnode.Node(_betslip, "gid").innerHTML;
                        var _gtype = xmlnode.Node(_betslip, "gtype").innerHTML;
                        var errormsg = xmlnode.Node(_betslip, "errormsg").innerHTML;
                        var errorvalue = xmlnode.Node(_betslip, "errorvalue").innerHTML;
                        var _ECID = top["bet_ECID"]["gid_" + _gid];
                        var betKey = _gtype + "_" + _ECID;
                        var div_TID = dom.getElementById("show_tid_" + _ECID);
                        div_TID.style.display = "";
                        var objids = ",finish_bet_tid,finish_bet_gold,finish_bet_wingold,finish_bet_dg,";
                        var ary = util.getObjAry(div_TID, objids);
                        ary["finish_bet_tid"].innerHTML = "";
                        ary["finish_bet_gold"].innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(top["totalBetOrderView"][betKey]["gold"])));
                        ary["finish_bet_wingold"].innerHTML = "- -";
                        ary["finish_bet_wingold"].className = "word_black";
                        _mc["div_icon_info_bet_" + _ECID] = dom.getElementById("div_icon_info_bet_" + _ECID);
                        if (top["totalFinishHash"][betKey]["isFantasy"] == "Y") {
                            _mc["div_icon_info_bet_i_" + _ECID] = dom.getElementById("div_icon_info_bet_i_" + _ECID);
                            _mc["div_icon_info_bet_" + _ECID].style.display = "";
                            util.addEvent(_mc["div_icon_info_bet_i_" + _ECID], "click", _self.AlertFantasyInfo, top["totalFinishHash"][betKey]["fantasyObj"])
                        } else
                            _mc["div_icon_info_bet_" + _ECID].style.display = "none";
                        var finishObj = dom.getElementById("finish_" + _ECID);
                        var bet_ids = ",finish_bet_ior,";
                        var betFinishInfoObj = util.getObjAry(finishObj, bet_ids);
                        var _ioratio = betFinishInfoObj["finish_bet_ior"].innerHTML;
                        var baseIorClass = util_game.checkIorClass(_ioratio);
                        betFinishInfoObj["finish_bet_ior"].className = baseIorClass;
                        _self.chgDangerStatus(ary["finish_bet_dg"], "F", errormsg, errorvalue);
                        _self.chgbetholdStatus(ary["finish_bet_dg"], "F", errormsg, errorvalue)
                    }
                }
                ;
                _self.parseParlay = function(xmlnode, p3Obj, wagersParam, wagersInfo) {
                    top["isOrderView"] = false;
                    var wagersData = {};
                    var parlay = xmlnode.Node(xmlnode.Root[0], "parlay", false);
                    var gold_p3 = xmlnode.Node(parlay[0], "gold").innerHTML;
                    var tid_p3 = xmlnode.Node(parlay[0], "ticket_id").innerHTML;
                    var wtype = xmlnode.Node(parlay[0], "wtype").innerHTML;
                    var gtype = xmlnode.Node(parlay[0], "gtype").innerHTML;
                    var tilte_gtype = LS_game.get("title_" + gtype);
                    if (gtype == "BK")
                        tilte_gtype = tilte_gtype.split("/")[0];
                    for (var key in p3Obj) {
                        wagersData["tid"] = util_game.getTicketType(top["totalBetOrderView"]["p3"]["keepwtype"]) + tid_p3;
                        wagersData["bet_gtype"] = gtype;
                        wagersData["w_ms"] = "";
                        wagersData["wtype"] = "";
                        wagersData["bet_wtype"] = wtype.replace("3", "");
                        wagersData["wagers_sub"] = [];
                        var gameP3 = p3Obj[key];
                        var ior_p3 = util.ignoreDots(top["totalBetOrderView"]["p3"]["ioratio"], 2);
                        var isDG = false;
                        var isbethold = false;
                        _bethold = 0;
                        var gameAry = xmlnode.Node(gameP3, "game", false);
                        for (var i = 0; i < gameAry.length; i++) {
                            var _dg = xmlnode.Node(gameAry[i], "dg").innerHTML;
                            var gid = xmlnode.Node(gameAry[i], "gid").innerHTML;
                            var date = xmlnode.Node(gameAry[i], "date").innerHTML;
                            var strong = xmlnode.Node(gameAry[i], "strong").innerHTML;
                            var _bethold = xmlnode.Node(gameAry[i], "delaysec").innerHTML;
                            var rtype = xmlnode.Node(gameAry[i], "rtype").innerHTML;
                            var ioratio = xmlnode.Node(gameAry[i], "ioratio").innerHTML;
                            if (_dg == "Y")
                                isDG = true;
                            else if (gtype != "FT" && parseInt(_bethold) > 0)
                                isbethold = true;
                            var wagersObj = wagersParam["gid_" + gid];
                            var wagersinfo = wagersInfo["gid_" + gid];
                            var sub = {};
                            var tmp_date = date.split("-");
                            sub["date"] = tmp_date[1] + "-" + tmp_date[2] + " ";
                            var tmp_menu = wagersObj.menutype.split(" ");
                            var wtype_sub = wagersObj.menutype.replace(tmp_menu[0] + " ", "");
                            var p_ball_act_class = "";
                            var p_ball_act_ret = "";
                            var tmp_ms = wagersObj.menutype.split(" - ");
                            var ms_sub = "";
                            if (tmp_ms.length > 1 && wagersObj.menutype.indexOf("/") == -1) {
                                ms_sub = "- " + tmp_ms[tmp_ms.length - 1];
                                wtype_sub.replace(ms_sub, "")
                            }
                            var str_ptype = "";
                            var str_wtype = "";
                            if (gtype == "BS") {
                                str_ptype = wagersinfo["ptype"] != "" && wagersinfo["ptype"] != "0" ? " - " + wagersinfo["ptype"] : "";
                                str_wtype = wagersinfo["str_showtype"] + wagersinfo["wtype"] + str_ptype
                            } else {
                                str_ptype = wagersinfo["ptype"] != "" && wagersinfo["ptype"] != "0" ? wagersinfo["ptype"] + " - " : "";
                                str_wtype = wagersinfo["str_showtype"] + str_ptype + wagersinfo["wtype"]
                            }
                            wagersData["gtype"] = wagersinfo["title_gtype"] + " ";
                            sub["menutype"] = wagersinfo["menutype"];
                            sub["ms_sub"] = wagersinfo["subtype"];
                            sub["wtype_sub"] = str_wtype;
                            sub["league"] = wagersObj.league;
                            sub["team_h_show"] = wagersObj.team_h;
                            sub["team_c_show"] = wagersObj.team_c;
                            sub["team_h_ratio"] = "";
                            sub["team_c_ratio"] = "";
                            sub["combine"] = xmlnode.Node(gameAry[i], "combine").innerHTML;
                            sub["strong"] = strong;
                            sub["score"] = wagersObj.score;
                            sub["result"] = wagersObj.choice_team;
                            sub["ioratio"] = ioratio;
                            sub["p_wtype"] = _self.rtype2wtypeParlay(rtype);
                            sub["p_rtype"] = rtype;
                            if (isDG || isbethold) {
                                p_ball_act_class = "word_yellow";
                                p_ball_act_ret = LS_game.get("dg_N")
                            }
                            sub["p_ball_act_class"] = p_ball_act_class;
                            sub["p_ball_act_ret"] = p_ball_act_ret;
                            sub["sub_delaysec"] = _bethold;
                            wagersData["wagers_sub"].push(sub)
                        }
                        var bet_ior_p3 = dom.getElementById("finish_parlay_ior");
                        var bet_tid_p3 = dom.getElementById("finish_bet_tid_p3");
                        var bet_gold_p3 = dom.getElementById("finish_bet_gold_p3");
                        var bet_wingold_p3 = dom.getElementById("finish_bet_wingold_p3");
                        var bet_finish_dg_p3 = dom.getElementById("finish_bet_dg_p3");
                        bet_ior_p3.innerHTML = util.showTxt(ior_p3);
                        bet_tid_p3.innerHTML = util.showTxt(util_game.getTicketType(top["totalBetOrderView"]["p3"]["keepwtype"]) + tid_p3);
                        bet_gold_p3.innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(gold_p3)));
                        bet_wingold_p3.innerHTML = util.showTxt(util.formatThousand(util_game.calcWindGold(gold_p3, top["totalBetOrderView"]["p3"]["ioratio"], top["totalBetOrderView"]["p3"]["keepwtype"])));
                        var main_ball_act_class = "";
                        var main_ball_act_ret = "";
                        var ball_act_class = "";
                        var ball_act_ret = "";
                        if (isDG || isbethold) {
                            if (isDG) {
                                _self.chgDangerStatus(bet_finish_dg_p3, "N");
                                _self.dg[tid_p3] = "p3"
                            } else {
                                _self.chgbetholdStatus(bet_finish_dg_p3, "N");
                                _self.bethold[tid_p3] = "p3"
                            }
                            main_ball_act_class = "word_yellow";
                            main_ball_act_ret = LS_game.get("dg_N");
                            ball_act_class = main_ball_act_class;
                            ball_act_ret = main_ball_act_ret
                        }
                        wagersData["main_ball_act_class"] = main_ball_act_class;
                        wagersData["main_ball_act_ret"] = main_ball_act_ret;
                        wagersData["ball_act_class"] = ball_act_class;
                        wagersData["ball_act_ret"] = ball_act_ret;
                        wagersData["gold"] = bet_gold_p3.innerHTML;
                        wagersData["win_gold"] = bet_wingold_p3.innerHTML
                    }
                    if (typeof util.transTodayWagersP == "function")
                        util.transTodayWagersP(wagersData, LS_game)
                }
                ;
                _self.rtype2wtypeParlay = function(type) {
                    var P3wtype = "";
                    var rtypeM = ["MH", "MC", "MN", "RMH", "RMC", "RMN"];
                    var rtypeHM = ["HMH", "HMC", "HMN", "HRMH", "HRMC", "HRMN"];
                    var rtypePD = ["OVH"];
                    var rtypeRPD = ["ROVH"];
                    var rtypeHPD = ["HOVH"];
                    var rtypeHRPD = ["HROVH"];
                    for ($i = 0; $i <= 20; $i++)
                        for ($j = 0; $j <= 20; $j++) {
                            rtypePD.push("H" + $i + "C" + $j);
                            rtypeRPD.push("RH" + $i + "C" + $j);
                            rtypeHPD.push("HH" + $i + "C" + $j);
                            rtypeHRPD.push("HRH" + $i + "C" + $j)
                        }
                    var rtypePD3 = ["PD302", "PD312", "PD320", "PD321"];
                    var rtypePD5 = ["PD503", "PD513", "PD523", "PD530", "PD531", "PD532"];
                    var rtypePD7 = ["PD704", "PD714", "PD724", "PD734", "PD740", "PD741", "PD742", "PD743"];
                    var rtypeF = ["FHH", "FHN", "FHC", "FNH", "FNN", "FNC", "FCH", "FCN", "FCC"];
                    var rtypeRF = ["RFHH", "RFHN", "RFHC", "RFNH", "RFNN", "RFNC", "RFCH", "RFCN", "RFCC"];
                    var rtypeT = ["0~1", "2~3", "4~6", "OVER"];
                    var rtypeRT = ["R0~1", "R2~3", "R4~6", "ROVER"];
                    var rtypeRDT = ["RDT0", "RDT1", "RDT2", "RDTOV"];
                    var rtypeHRT = ["HRT0", "HRT1", "HRT2", "HRTOV"];
                    if (type == "PRH" || type == "PRC")
                        P3wtype = "R";
                    else if (type == "PREH" || type == "PREC")
                        P3wtype = "RE";
                    else if (type == "POUH" || type == "POUC")
                        P3wtype = "OU";
                    else if (type == "PROUH" || type == "PROUC")
                        P3wtype = "ROU";
                    else if (type == "PE" || type == "PO" || type == "PEOE" || type == "PEOO")
                        P3wtype = "T";
                    else if (type == "PRE" || type == "PRO" || type == "PREOE" || type == "PREOO")
                        P3wtype = "RT";
                    else if (type == "HPRH" || type == "HPRC")
                        P3wtype = "HR";
                    else if (type == "HPREH" || type == "HPREC")
                        P3wtype = "HRE";
                    else if (type == "HPOUH" || type == "HPOUC")
                        P3wtype = "HOU";
                    else if (type == "HPROUH" || type == "HPROUC")
                        P3wtype = "HROU";
                    else if (type == "HPE" || type == "HPO" || type == "HPEOE" || type == "HPEOO")
                        P3wtype = "HT";
                    else if (type == "HPRE" || type == "HPRO" || type == "HPREOE" || type == "HPREOO")
                        P3wtype = "HRT";
                    else if (rtypeM.indexOf(type) != -1)
                        P3wtype = type.indexOf("R") != -1 ? "RM" : "M";
                    else if (rtypeHM.indexOf(type) != -1)
                        P3wtype = type.indexOf("R") != -1 ? "HRM" : "HM";
                    else if (rtypePD.indexOf(type) != -1)
                        P3wtype = "PD";
                    else if (rtypeRPD.indexOf(type) != -1)
                        P3wtype = "RPD";
                    else if (rtypeHPD.indexOf(type) != -1)
                        P3wtype = "HPD";
                    else if (rtypeHRPD.indexOf(type) != -1)
                        P3wtype = "HRPD";
                    else if (rtypePD3.indexOf(type) != -1)
                        P3wtype = "PD3";
                    else if (rtypePD5.indexOf(type) != -1)
                        P3wtype = "PD5";
                    else if (rtypePD7.indexOf(type) != -1)
                        P3wtype = "PD7";
                    else if (rtypeF.indexOf(type) != -1)
                        P3wtype = "F";
                    else if (rtypeRF.indexOf(type) != -1)
                        P3wtype = "RF";
                    else if (rtypeT.indexOf(type) != -1)
                        P3wtype = "T";
                    else if (rtypeRT.indexOf(type) != -1)
                        P3wtype = "RT";
                    else if (rtypeRDT.indexOf(type) != -1)
                        P3wtype = "RDT";
                    else if (type.match(/^RNC[1-9A-U][HC]$/g))
                        P3wtype = type.substring(0, 4);
                    else if (type.match(/^RNB[A-O][HC]$/g))
                        P3wtype = type.substring(0, 4);
                    else if (type.match(/^RHG[HC]$/g))
                        P3wtype = "RHG";
                    else if (type.match(/^RMG[HCN]$/g))
                        P3wtype = "RMG";
                    else if (type.match(/^RTS[YN]$/g))
                        P3wtype = "RTS";
                    else if (type.match(/^RTS2[YN]$/g))
                        P3wtype = "RTS2";
                    else if (type.match(/^RWM[HCM][1|2|3|0|N|O]V?$/g))
                        P3wtype = "RWM";
                    else if (type.match(/^RMTS[HCN][YN]$/g))
                        P3wtype = "RMTS";
                    else if (type.match(/^RMPG[HCN][HC]$/g))
                        P3wtype = "RMPG";
                    else if (type.match(/^RSB[HC]$/g))
                        P3wtype = "RSB";
                    else if (type.match(/^RT3G[12N]$/g))
                        P3wtype = "RT3G";
                    else if (type.match(/^RT1G[1-6|N]$/g))
                        P3wtype = "RT1G";
                    else if (type.match(/^RDS[HCS][YN]$/g))
                        P3wtype = "RDS";
                    else if (type.match(/^RDG[HCS][HC]$/g))
                        P3wtype = "RDG";
                    else if (type.match(/^RWE[HC]$/g))
                        P3wtype = "RWE";
                    else if (type.match(/^RWB[HC]$/g))
                        P3wtype = "RWB";
                    else if (type.match(/^ROT[YN]$/g))
                        P3wtype = "ROT";
                    else if (type.match(/^RCS[HC]$/g))
                        P3wtype = "RCS";
                    else if (type.match(/^RWN[HC]$/g))
                        P3wtype = "RWN";
                    else if (type.match(/^RMU[A-D][HCN][OU]$/g))
                        P3wtype = type.substring(0, 4);
                    else if (type.match(/^RDU[A-D][HCS][OU]$/g))
                        P3wtype = type.substring(0, 4);
                    else if (type.match(/^RUE[A-D][OU][OE]$/g))
                        P3wtype = type.substring(0, 4);
                    else if (type.match(/^RPS[YN]$/g))
                        P3wtype = "RPS";
                    else if (type.match(/^RPS[YN]$/g))
                        P3wtype = "RPS";
                    else if (type.match(/^RTW[HCN0][1|2|O]?V?$/g))
                        P3wtype = "RTW";
                    else if (type.match(/^RPF[1-3O]V?$/g))
                        P3wtype = "RPF";
                    else if (type.match(/^PT[A-E]RU[OU]$/g))
                        P3wtype = type.substring(1, 5);
                    else if (type.match(/^RUT[A-D][OU][YN]$/g))
                        P3wtype = type.substring(0, 4);
                    else if (type.match(/^RUP[A-D][OU][HC]$/g))
                        P3wtype = type.substring(0, 4);
                    else if (type.match(/^RS[HC][A-O][YN]$/g))
                        P3wtype = type.substring(0, 4);
                    else if (type.match(/^RPX[A-O][HCN]$/g))
                        P3wtype = type.substring(0, 4);
                    else if (type.match(/^PA[HC]$/g))
                        P3wtype = "PA";
                    else if (type.match(/^(PG|OS|ST|CN|CD|YC|GA|RC)[FL][CHN]$/g))
                        P3wtype = "SP";
                    else if (type.match(/^HT([0-2]|OV)$/g))
                        P3wtype = "HT";
                    else if (rtypeHRT.indexOf(type) != -1)
                        P3wtype = "HRT";
                    else if (type.match(/^WM([CH][1-3]|[CH]OV|0|N)$/g))
                        P3wtype = "WM";
                    else if (type.match(/^RWM([CH][1-3]|[CH]OV|0|N)$/g))
                        P3wtype = "RWM";
                    else if (type.match(/^DC(HN|CN|HC)$/g))
                        P3wtype = "DC";
                    else if (type.match(/^RDC(HN|CN|HC)$/g))
                        P3wtype = "RDC";
                    else if (type.match(/^MW[HC](OT|PK)?$/g))
                        P3wtype = "MW";
                    else if (type.match(/^MQ[HC](OT|PK)?$/g))
                        P3wtype = "MQ";
                    else if (type.match(/^(OG|OT|HTS)[YN]$/g) || type.match(/^H?EO[HC][OE]$/g))
                        P3wtype = type.substring(0, type.length - 1);
                    else if (type.match(/^MOU[A-D][CHN][OU]$/g) || type.match(/^MPG[CHN][HC]$/g) || type.match(/^MTS[CHN][YN]$/g) || type.match(/^DU[A-D][CHS][OU]$/g) || type.match(/^DG[CHS][HC]$/g) || type.match(/^DS[CHS][YN]$/g) || type.match(/^OUE[A-D][OU][OE]$/g) || type.match(/^OUP[A-D][OU][HC]$/g) || type.match(/^OUT[A-D][OU][YN]$/g))
                        P3wtype = type.substring(0, type.length - 2);
                    else if (type.match(/^P[ABCDEF](R|OU)(O|U|H|C)$/g))
                        P3wtype = type.substring(0, type.length - 1).replace("P", "");
                    else if (type.match(/^P[ABCDEF](ROU)(O|U|H|C)$/g))
                        P3wtype = type.substring(0, type.length - 1).replace("P", "");
                    else if (type.match(/^H?P(OUH|OUC|UH|UC)(O|U)$/g))
                        P3wtype = type.substring(0, type.length - 1).replace("P", "");
                    else if (type.match(/^H?PR?(OUH|OUC|UH|UC)(O|U)$/g))
                        P3wtype = type.substring(0, type.length - 1).replace("P", "");
                    else if (type.match(/^[ABCDEF]M(H|C|N)$/g) || type.match(/^(W3|CS|WN|TS|WB|WE|SB|HG|MG|TK|PA|RCD|BH)(Y|H|C|N)$/g) || type.match(/^(F[23]G)(H|C|N)$/g) || type.match(/^T[13]G([1-6]|N)$/g) || type.match(/^FG(S|H|N|P|F|O)$/g))
                        P3wtype = type.substring(0, type.length - 1);
                    else if (type.match(/^([A-J]RG)(H|C|N)$/g))
                        P3wtype = type.substring(0, type.length - 1);
                    return P3wtype
                }
                ;
                _self.calcFinal = function() {
                    var total_gold = 0;
                    var total_wingold = 0;
                    var betGold = dom.getElementsByName("finish_bet_gold");
                    var betWinGold = dom.getElementsByName("finish_bet_wingold");
                    var betTid = dom.getElementsByName("finish_bet_tid");
                    for (var i = 0; i < betWinGold.length; i++) {
                        if (betGold[i].innerHTML != "" && betTid[i].innerHTML != "")
                            total_gold += betGold[i].innerHTML.replace(/,/g, "") * 1;
                        if (betWinGold[i].innerHTML != "" && betWinGold[i].innerHTML != "- -")
                            total_wingold += betWinGold[i].innerHTML.replace(/,/g, "") * 1
                    }
                    dom.getElementById("finish_bet_total_gold").innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(total_gold)));
                    dom.getElementById("finish_bet_total_wingold").innerHTML = util.showTxt(util.formatThousand(util.util_formatNumber(total_wingold)))
                }
                ;
                _self.reBet = function(mouseClick, tarObj) {
                    top["bet_select"] = tmp_bet_select;
                    top["bet_select_more"] = tmp_bet_select_more;
                    top["totalBetXML"] = tmp_totalBetXML;
                    top["totalBetGameObj"] = tmp_totalBetGameObj;
                    top["totalBetHash"] = tmp_totalBetHash;
                    top["bet_viewdata"] = tmp_bet_viewdata;
                    top["bet_ECID"] = tmp_bet_ECID;
                    top["ptypeHash"] = tmp_ptypeHash;
                    top["bet_ior"] = tmp_bet_ior;
                    top["totalFinishHash"] = tmp_totalFinishHash;
                    top["isDelayed"] = tmp_isDelayed;
                    top["isAddTotal"] = tmp_isAddTotal;
                    parentClass.dispatchEvent("reBet", {})
                }
                ;
                _self.updateCurrency = function(_currency) {
                    dom.getElementById("finish_nowCredit").setAttribute("data-currency", _currency);
                    dom.getElementById("finish_bet_total_gold").setAttribute("data-currency", _currency);
                    dom.getElementById("finish_bet_total_wingold").setAttribute("data-currency", _currency)
                }
                ;
                _self.lockScroll = function() {
                    var _div = dom.getElementById("div_finishInfo");
                    try {
                        util.addEvent(_div, "touchstart", _self.touchstartEvent);
                        util.addEvent(_div, "touchmove", _self.preventScroll)
                    } catch (e) {
                        console.log(e)
                    }
                }
                ;
                _self.touchstartEvent = function(e) {
                    startTouchY = e.touches[0].clientY;
                    if (e.touches.length > 1)
                        e.preventDefault()
                }
                ;
                _self.preventScroll = function(e) {
                    var nowTouchY = e.touches[0].clientY;
                    if (startTouchY < nowTouchY - fixY || startTouchY > nowTouchY + fixY) {
                        e.stopPropagation();
                        e.preventDefault()
                    }
                }
                ;
                _self.createbetholdTimer = function() {
                    buni_key = util_game.getTimestamp();
                    if (util.countSize(_self.bethold) == 0)
                        return;
                    if (timerHash["betholdTimer_" + buni_key] != null)
                        return;
                    if (!util.in_object(buni_key, top["betholdTid_hash"]))
                        top["betholdTid_hash"][buni_key] = "";
                    if (!util.in_object(buni_key, top["betholdstatus_hash"]))
                        top["betholdstatus_hash"][buni_key] = "isReceipt";
                    for (var _key in top["betholdstatus_hash"])
                        if (timerHash["betholdTimer_" + _key] != null) {
                            top["betholdstatus_hash"][_key] = "isToast";
                            timerHash["betholdTimer_" + _key]._status = "isToast"
                        }
                    timerHash["betholdTimer_" + buni_key] = new Timer(config_set.get("CONFIG_BETHOLD"));
                    timerHash["betholdTimer_" + buni_key].setParentclass(_self);
                    timerHash["betholdTimer_" + buni_key].init();
                    timerHash["betholdTimer_" + buni_key].dont_clear = true;
                    timerHash["betholdTimer_" + buni_key]._status = "isReceipt";
                    timerHash["betholdTimer_" + buni_key].addEventListener("TimerEvent.TIMER", _self.betholdTimerRun);
                    timerHash["betholdTimer_" + buni_key].addEventListener("TimerEvent.TIMER_COMPLETE", _self.betholdTimerFinish);
                    timerHash["betholdTimer_" + buni_key].startTimer()
                }
                ;
                _self.clearbetholdTimer = function(xml_key) {
                    if (xml_key == "all") {
                        for (var _key in top["betholdTid_hash"])
                            if (timerHash["betholdTimer_" + _key] != null) {
                                timerHash["betholdTimer_" + _key].clearObj();
                                timerHash["betholdTimer_" + _key] = null
                            }
                        return true
                    }
                    if (timerHash["betholdTimer_" + xml_key] != null) {
                        timerHash["betholdTimer_" + xml_key].clearObj();
                        timerHash["betholdTimer_" + xml_key] = null
                    }
                    _self.bethold = new Object;
                    return true
                }
                ;
                _self.betholdTimerRun = function(count) {
                    _self.checkbethold()
                }
                ;
                _self.betholdTimerFinish = function() {}
                ;
                _self.checkbethold = function() {
                    var bethold_tid = "";
                    var p3_bethold = "";
                    for (var _tid in _self.bethold) {
                        if (_self.bethold[_tid] == "p3") {
                            p3_bethold = _tid;
                            continue
                        }
                        if (_tid != "")
                            bethold_tid += _tid + ","
                    }
                    if (bethold_tid.substr(-1, 1) == ",")
                        bethold_tid = bethold_tid.substr(0, bethold_tid.length - 1);
                    top["betholdTid_hash"][buni_key] = bethold_tid + "," + p3_bethold;
                    var urlParams = "";
                    urlParams += "type=xml";
                    urlParams += "&from=bet";
                    urlParams += "&uni_key=" + buni_key;
                    urlParams += "&tid=" + bethold_tid;
                    if (p3_bethold != "")
                        urlParams += "&p3_tid=" + p3_bethold;
                    urlParams = "p=get_bethold&" + top.param + "&" + urlParams;
                    var getHTML = new HttpRequest;
                    getHTML.addEventListener("onError", _self.onError);
                    getHTML.addEventListener("LoadComplete", _self.checkbetholdFinish);
                    getHTML.loadURL(top.m2_url, "POST", urlParams)
                }
                ;
                _self.checkbetholdFinish = function(xml) {
                    var xmlnode = util.parseXml(xml);
                    var tickets = xmlnode.Node(xmlnode.Root[0], "tickets");
                    var xml_key = xmlnode.Node(xmlnode.Root[0], "uni_key").innerHTML;
                    var ticket = xmlnode.Node(tickets, "ticket", false);
                    var clearStatus = new Array("V","A");
                    var toast_sw = false;
                    if (!top["openBets"]) {
                        if (top["betholdstatus_hash"][xml_key])
                            top["betholdstatus_hash"][xml_key] = "isToast";
                        if (timerHash["betholdTimer_" + xml_key])
                            timerHash["betholdTimer_" + xml_key]._status = "isToast"
                    }
                    for (var _tid in _self.bethold) {
                        var _ECID = "";
                        var _status = ticket[_tid].innerHTML;
                        if (top["betholdstatus_hash"][xml_key] != "isToast") {
                            if (_self.bethold[_tid] == "p3") {
                                var bethold_p3 = dom.getElementById("finish_bet_dg_p3");
                                _self.chgbetholdStatus(bethold_p3, _status)
                            } else if (ticket[_tid] != null) {
                                _ECID = _self.bethold[_tid];
                                var div_TID = dom.getElementById("show_tid_" + _ECID);
                                if (top["openBets"] && div_TID != null)
                                    div_TID.style.display = "";
                                var objids = ",finish_bet_dg,";
                                var ary = util.getObjAry(div_TID, objids);
                                _self.chgbetholdStatus(ary["finish_bet_dg"], _status)
                            }
                            if (util.in_array(_status, clearStatus)) {
                                delete _self.bethold[_tid];
                                if (_status == "V")
                                    _self.reject[_tid] = _ECID != "" ? _ECID : "p3"
                            }
                            if (!top["isOrderView"])
                                if (util.countSize(_self.reject) != 0) {
                                    _self.showOrderMsg("1more_rejected", "bg_red", true);
                                    if (!top["openBets"] && toast_sw) {
                                        parentClass.dispatchEvent("showAlertMsg", {
                                            "target": "message_pop_nobtn",
                                            "msg": LS_code.get("1more_rejected_toast"),
                                            "confirm": "N",
                                            "retFun": ""
                                        });
                                        _self.clearbetholdTimer("all")
                                    } else if (util.countSize(_self.bethold) == 0)
                                        _self.clearbetholdTimer(xml_key);
                                    toast_sw = true
                                } else if (util.countSize(_self.bethold) != 0 || util.countSize(_self.dg) != 0) {
                                    _self.showOrderMsg("1more_pending", "bg_yellow", true);
                                    if (util.countSize(_self.bethold) == 0)
                                        _self.clearbetholdTimer(xml_key)
                                } else {
                                    _self.showOrderMsg("bet_success", "bg_green", true);
                                    if (util.countSize(_self.bethold) == 0)
                                        _self.clearbetholdTimer(xml_key)
                                }
                            else if (util.countSize(_self.reject) != 0) {
                                parentClass.dispatchEvent("showAlertMsg", {
                                    "target": "message_pop_nobtn",
                                    "msg": LS_code.get("1more_rejected_toast"),
                                    "confirm": "N",
                                    "retFun": ""
                                });
                                _self.clearbetholdTimer("all")
                            } else if (util.countSize(_self.bethold) == 0)
                                _self.clearbetholdTimer(xml_key)
                        } else {
                            if (_status == "V") {
                                parentClass.dispatchEvent("showAlertMsg", {
                                    "target": "message_pop_nobtn",
                                    "msg": LS_code.get("1more_rejected_toast"),
                                    "confirm": "N",
                                    "retFun": ""
                                });
                                for (var _key in top["betholdstatus_hash"])
                                    if (timerHash["betholdTimer_" + _key] != null && timerHash["betholdTimer_" + _key]._status == "isToast") {
                                        timerHash["betholdTimer_" + _key].clearObj();
                                        timerHash["betholdTimer_" + _key] = null
                                    }
                                if (_self.totalBetHash["onlyYesterday"] == "Y" && top.userData.pay_type == 0)
                                    parentClass.dispatchEvent("reloadCredit", top.userData.yesterdayCredit);
                                else
                                    parentClass.dispatchEvent("reloadCredit");
                                return
                            }
                            if (_status == "A") {
                                _self.clearbetholdTimer(xml_key);
                                return
                            }
                        }
                    }
                }
                ;
                _self.chgbetholdStatus = function(obj, _status, msg, error_value) {
                    if (top["openBets"]) {
                        var str_sty = "";
                        var str_code = "";
                        switch (_status) {
                        case "A":
                            str_sty = "status_word word_green";
                            body_sty = "bg_green";
                            str_code = "bet_success";
                            break;
                        case "V":
                            str_sty = "status_word word_red";
                            body_sty = "bg_red";
                            str_code = "bet_rejected";
                            _self.reloadCredit();
                            break;
                        case "F":
                            str_sty = "status_word word_fail";
                            body_sty = "bg_red";
                            str_code = top["isDelayed"] ? "1more_failed" : "1more_place_failed";
                            _self.reloadCredit();
                            _self.showErrorMsg(obj, msg, error_value);
                            break;
                        case "N":
                        default:
                            str_sty = "status_word word_yellow";
                            body_sty = "bg_yellow";
                            str_code = "1more_pending";
                            break
                        }
                        echo("[isOrderView] = ", top["isOrderView"]);
                        if (obj != null && !top["isOrderView"]) {
                            obj.className = str_sty;
                            _self.showOrderMsg(str_code, body_sty, true)
                        }
                    }
                }
                ;
                _self.AlertFantasyInfo = function(e, hash) {
                    parentClass.dispatchEvent("showFantasyInfo", hash)
                }
            }
            ;