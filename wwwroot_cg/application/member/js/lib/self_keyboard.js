function self_keyboard(_win, _dom, _paramHash) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var parentClass;
                var CookieManager;
                var classname = "self_keyboard";
                var util = new win.Util(win,dom);
                var targetObj = _paramHash["targetObj"];
                var targetObj_tt = _paramHash["targetObj_tt"];
                var _mid = _paramHash["mid"];
                var limitCount = _paramHash["limitCount"];
                var currency = _paramHash["currency"];
                var minBet = _paramHash["minbet"].replace(/,/g, "");
                var maxBet = _paramHash["maxbet"].replace(/,/g, "");
                var _ECID = "";
                var _betKey = "";
                var bet_wingold;
                var singleUse = false;
                var classObj = new Object;
                var limitArray, config_set;
                var currencyList = new Array("RMB","HKD","USD","MYR","SGD","THB","GBP","JPY","EUR","IDR");
                _self.init = function() {
                    if (!util.in_array(currency, currencyList))
                        limitArray = config_set.get("RMB");
                    else
                        limitArray = config_set.get(currency);
                    _self.initNum();
                    _self.initBack();
                    _self.initAdd();
                    _self.initDone()
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    config_set = parentClass.getThis("config_set");
                    CookieManager = parentClass.getThis("CookieManager")
                }
                ;
                _self.initNum = function() {
                    for (var i = 0; i <= 9; i++) {
                        var div = dom.getElementById("num_" + i);
                        classObj["num_" + i] = new _self.num({
                            "targetObj": targetObj,
                            "targetObj_tt": targetObj_tt,
                            "screen": div,
                            "value": i
                        });
                        classObj["num_" + i].init()
                    }
                }
                ;
                _self.initBack = function() {
                    var div = dom.getElementById("num_x");
                    classObj["num_x"] = new _self.del({
                        "targetObj": targetObj,
                        "screen": div
                    });
                    classObj["num_x"].init()
                }
                ;
                _self.initAdd = function() {
                    for (var i = 1; i <= limitCount; i++) {
                        var div = dom.getElementById("add_" + i);
                        var divNum = dom.getElementById("add_num_" + i);
                        var str_limit = limitArray[i - 1];
                        var limit_val = str_limit.replace(/,/g, "");
                        classObj["add_" + i] = new _self.add({
                            "targetObj": targetObj,
                            "targetObj_tt": targetObj_tt,
                            "screen": div,
                            "num": divNum
                        });
                        classObj["add_" + i].init();
                        classObj["add_" + i].set_value({
                            "show": str_limit,
                            "value": limit_val
                        })
                    }
                }
                ;
                _self.initDone = function() {
                    var div = dom.getElementById("num_done");
                    var obj = new _self.done({
                        "targetObj": targetObj,
                        "screen": div
                    });
                    obj.init()
                }
                ;
                _self.updateLimit = function(obj) {
                    minBet = obj["minbet"].replace(/,/g, "");
                    maxBet = obj["maxbet"].replace(/,/g, "");
                    for (var i = 1; i <= limitCount; i++) {
                        var obj = classObj["add_" + i];
                        var limit_val = obj.get_value();
                        var dis = limit_val * 1 > maxBet * 1 ? true : false;
                        if (dis)
                            dom.getElementById("add_" + i).disabled = true;
                        else
                            dom.getElementById("add_" + i).disabled = false;
                        obj.disabled(dis)
                    }
                }
                ;
                _self.updateCurrency = function(obj) {
                    currency = obj["currency"];
                    if (!util.in_array(currency, currencyList))
                        limitArray = config_set.get("RMB");
                    else
                        limitArray = config_set.get(currency);
                    for (var i = 1; i <= limitCount; i++) {
                        var obj = classObj["add_" + i];
                        var str_limit = limitArray[i - 1];
                        var limit_val = str_limit.replace(/,/g, "");
                        classObj["add_" + i].set_value({
                            "show": str_limit,
                            "value": limit_val
                        })
                    }
                }
                ;
                _self.changeTarget = function(hash) {
                    for (var i = 0; i <= 9; i++) {
                        var obj = classObj["num_" + i];
                        obj.changeTarget(hash);
                        obj.init()
                    }
                    for (var i = 1; i <= limitCount; i++) {
                        var obj = classObj["add_" + i];
                        obj.changeTarget(hash);
                        obj.init()
                    }
                    _betKey = hash["betKey"];
                    _ECID = hash["ECID"];
                    bet_wingold = hash["bet_wingold"];
                    classObj["num_x"].changeTarget(hash);
                    classObj["num_x"].init()
                }
                ;
                _self.num = function(obj) {
                    var _num = this;
                    var targetObj = obj["targetObj"];
                    var targetObj_tt = obj["targetObj_tt"];
                    var _screen = obj["screen"];
                    var _value = obj["value"];
                    _num.init = function() {
                        util.removeEvent(_num, "click");
                        util.addEvent(_screen, "click", _num.clickEvent)
                    }
                    ;
                    _num.clickEvent = function() {
                        var bet_gold = top.mobile != "Y" ? targetObj.value : targetObj.innerHTML;
                        var last_gold_length = bet_gold.length;
                        var Start = targetObj.selectionStart;
                        var End = targetObj.selectionEnd;
                        var hasSelect = Start != End;
                        if (bet_gold == "" && _value == "0" || !hasSelect && bet_gold.replace(/,/g, "").length >= 10)
                            return;
                        var nextNum = bet_gold.replace(/,/g, "") + _value;
                        if (nextNum * 1 == 0)
                            return;
                        var enterVal = "";
                        if (nextNum * 1 > maxBet * 1)
                            enterVal = maxBet;
                        else
                            enterVal = bet_gold.replace(/,/g, "") + _value;
                        if (top.mobile != "Y") {
                            targetObj.focus();
                            enterVal = (targetObj.value.substring(0, Start) + _value + targetObj.value.substring(End)).replace(/,/g, "");
                            if (enterVal * 1 > maxBet * 1)
                                enterVal = maxBet;
                            if (enterVal * 1 == 0)
                                targetObj.value = "";
                            else
                                targetObj.value = util.showTxt(util.formatThousand(enterVal * 1));
                            var obj = new Object;
                            obj.goldObj = targetObj;
                            obj.tmp_gold = enterVal;
                            obj.last_gold_length = last_gold_length;
                            obj.End = End;
                            parentClass.dispatchEvent("setTargetPostition", obj)
                        } else {
                            targetObj.innerHTML = util.showTxt(util.formatThousand(enterVal * 1));
                            document.activeElement.blur()
                        }
                        if (enterVal != "")
                            targetObj_tt.style.display = "none";
                        tmpGold = enterVal.replace(/,/g, "") * 1;
                        if (singleUse)
                            parentClass.dispatchEvent("setTotalSingleBets", tmpGold);
                        else {
                            var _paramHash = new Object;
                            _paramHash["target"] = targetObj;
                            if (_betKey != "") {
                                _paramHash["ECID"] = _ECID;
                                _paramHash["betKey"] = _betKey;
                                _paramHash["bet_wingold"] = bet_wingold
                            }
                            parentClass.dispatchEvent("_calcWinGold", _paramHash)
                        }
                        var needSave = CookieManager.get("lastBetCredit_sw_" + _mid);
                        if (needSave == "Y")
                            CookieManager.set("lastBetCredit_" + _mid, tmpGold)
                    }
                    ;
                    _num.changeTarget = function(hash) {
                        targetObj = hash["targetObj"];
                        targetObj_tt = hash["targetObj_tt"]
                    }
                }
                ;
                _self.del = function(obj) {
                    var _del = this;
                    var targetObj = obj["targetObj"];
                    var _screen = obj["screen"];
                    _del.init = function() {
                        util.removeEvent(_del, "click");
                        util.addEvent(_screen, "click", _del.clickEvent)
                    }
                    ;
                    _del.clickEvent = function() {
                        var bet_gold = top.mobile != "Y" ? targetObj.value : targetObj.innerHTML;
                        var last_gold_length = bet_gold.length;
                        var long_str = bet_gold.replace(/,/g, "");
                        var tmp_gold = bet_gold.replace(/,/g, "").substring(0, long_str.length - 1);
                        if (top.mobile != "Y") {
                            var Start = targetObj.selectionStart;
                            var End = targetObj.selectionEnd;
                            if (Start != End)
                                tmp_gold = (targetObj.value.substring(0, Start) + targetObj.value.substring(End)).replace(/,/g, "");
                            else
                                tmp_gold = (targetObj.value.substring(0, Start - 1) + targetObj.value.substring(End)).replace(/,/g, "");
                            targetObj.focus();
                            if (tmp_gold * 1 == 0)
                                targetObj.value = "";
                            else {
                                var obj = new Object;
                                obj.goldObj = targetObj;
                                obj.tmp_gold = tmp_gold;
                                obj.last_gold_length = last_gold_length;
                                obj.End = End;
                                parentClass.dispatchEvent("setTargetPostition", obj)
                            }
                        } else {
                            targetObj.innerHTML = util.showTxt(util.formatThousand(tmp_gold));
                            document.activeElement.blur()
                        }
                        if (tmp_gold == "")
                            targetObj_tt.style.display = "";
                        tmpGold = tmp_gold.replace(/,/g, "");
                        if (singleUse)
                            parentClass.dispatchEvent("setTotalSingleBets", tmpGold);
                        else {
                            var _paramHash = new Object;
                            _paramHash["target"] = targetObj;
                            if (_betKey != "") {
                                _paramHash["ECID"] = _ECID;
                                _paramHash["betKey"] = _betKey;
                                _paramHash["bet_wingold"] = bet_wingold
                            }
                            parentClass.dispatchEvent("_calcWinGold", _paramHash)
                        }
                        var needSave = CookieManager.get("lastBetCredit_sw_" + _mid);
                        if (needSave == "Y")
                            CookieManager.set("lastBetCredit_" + _mid, tmpGold)
                    }
                    ;
                    _del.changeTarget = function(hash) {
                        targetObj = hash["targetObj"];
                        targetObj_tt = hash["targetObj_tt"]
                    }
                }
                ;
                _self.add = function(obj) {
                    var _add = this;
                    var targetObj = obj["targetObj"];
                    var targetObj_tt = obj["targetObj_tt"];
                    var _screen = obj["screen"];
                    var _num = obj["num"];
                    var _value;
                    _add.init = function() {
                        _add.addEvent(true)
                    }
                    ;
                    _add.clickEvent = function() {
                        var bet_gold = top.mobile != "Y" ? targetObj.value : targetObj.innerHTML;
                        var Start = targetObj.selectionStart;
                        var End = targetObj.selectionEnd;
                        var last_gold_length = bet_gold.length;
                        var nextNum = bet_gold.replace(/,/g, "") * 1 + _value.replace(/,/g, "") * 1;
                        if (nextNum * 1 > maxBet * 1)
                            if (top.mobile != "Y")
                                targetObj.value = util.showTxt(util.formatThousand(maxBet));
                            else
                                targetObj.innerHTML = util.showTxt(util.formatThousand(maxBet));
                        else {
                            var tmp_gold = bet_gold.replace(/,/g, "") * 1 + _value * 1;
                            if (top.mobile != "Y")
                                targetObj.value = util.showTxt(util.formatThousand(tmp_gold));
                            else
                                targetObj.innerHTML = util.showTxt(util.formatThousand(tmp_gold))
                        }
                        tmpGold = top.mobile != "Y" ? targetObj.value.replace(/,/g, "") : targetObj.innerHTML.replace(/,/g, "");
                        if (tmpGold != "")
                            targetObj_tt.style.display = "none";
                        if (top.mobile != "Y") {
                            var obj = new Object;
                            obj.goldObj = targetObj;
                            obj.tmp_gold = tmpGold;
                            obj.last_gold_length = last_gold_length;
                            obj.End = End;
                            targetObj.focus();
                            parentClass.dispatchEvent("setTargetPostition", obj)
                        } else
                            document.activeElement.blur();
                        if (singleUse)
                            parentClass.dispatchEvent("setTotalSingleBets", tmpGold);
                        else {
                            var _paramHash = new Object;
                            _paramHash["target"] = targetObj;
                            if (_betKey != "") {
                                _paramHash["ECID"] = _ECID;
                                _paramHash["betKey"] = _betKey;
                                _paramHash["bet_wingold"] = bet_wingold
                            }
                            parentClass.dispatchEvent("_calcWinGold", _paramHash)
                        }
                        var needSave = CookieManager.get("lastBetCredit_sw_" + _mid);
                        if (needSave == "Y")
                            CookieManager.set("lastBetCredit_" + _mid, tmpGold)
                    }
                    ;
                    _add.set_value = function(obj) {
                        _value = obj["value"];
                        _num.innerHTML = obj["show"]
                    }
                    ;
                    _add.get_value = function(val) {
                        return _value
                    }
                    ;
                    _add.disabled = function(isDis) {
                        _add.addEvent(!isDis)
                    }
                    ;
                    _add.addEvent = function(isAdd) {
                        if (isAdd) {
                            util.removeEvent(_screen, "click");
                            util.addEvent(_screen, "click", _add.clickEvent)
                        } else
                            util.removeEvent(_screen, "click")
                    }
                    ;
                    _add.changeTarget = function(hash) {
                        targetObj = hash["targetObj"];
                        targetObj_tt = hash["targetObj_tt"]
                    }
                }
                ;
                _self.done = function(obj) {
                    var _done = this;
                    var targetObj = obj["targetObj"];
                    var _screen = obj["screen"];
                    _done.init = function() {
                        util.removeEvent(_done, "click");
                        util.addEvent(_screen, "click", _done.clickEvent)
                    }
                    ;
                    _done.clickEvent = function() {
                        parentClass.setBetNumVisible(false);
                        if (singleUse)
                            parentClass.setReverseSw(false, "single");
                        else if (_betKey != "")
                            parentClass.setReverseSw(false, _ECID);
                        else
                            parentClass.setReverseSw(false);
                        document.activeElement.blur();
                        parentClass.initTyping()
                    }
                }
                ;
                _self.updateSingleSw = function(_sw) {
                    singleUse = _sw
                }
                ;
                _self.getTarget = function() {
                    return _ECID
                }
            }
            ;