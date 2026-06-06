function Util(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var config_set;
    var LS;
    var fixY = 15;
    

    _self.init = function () {

    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        LS = parentClass.getThis("LS");
        config_set = parentClass.getThis("config_set");
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    _self.addEvent = function (targetObj, eventName, fun, parObj) {
        try {
            var retFun = function (e) {
                fun(e, parObj);
            }
            if (targetObj.eventName == null){
                targetObj.eventName = new Array();
            }else{
                _self.removeEvent(targetObj, eventName);
            }
            targetObj.eventName[eventName] = retFun;
            
            targetObj.addEventListener(eventName, retFun, false);
            // targetObj.addEventListener(eventName, function(e){
            //     fun(e, parObj);
            // },false);

        } catch (ex) {
            // console.error(ex.toString());
            try {
                targetObj.attachEvent("on" + eventName, retFun);
                if (targetObj.eventName == null) targetObj.eventName = new Array();
                targetObj.eventName[eventName] = retFun;

                // targetObj.attachEvent("on"+eventName, function(e){
                //     fun(e, parObj);
                // });
            } catch (exx) {
                // console.error(exx.toString());
            }
        }
    }

    _self.removeEvent = function (targetObj, eventName) {
        if (targetObj.eventName == null) return;
        //echo(eventName + ":" + targetObj.eventName[eventName]);
        try {
            targetObj.removeEventListener(eventName, targetObj.eventName[eventName]);
        } catch (ex) {
            //console.error(ex.toString());
            try {
                targetObj.detachEvent("on" + eventName, targetObj.eventName[eventName]);
            } catch (exx) {
                //console.error(exx.toString());
            }
        }
    }

    _self.mergeArray = function () {

        var newArray = new Object();

        for (i = 0; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                newArray[key] = arguments[i][key];
            }
        }
        return newArray;
    }

    _self.getProtocal = function () {
        return dom.location.protocol;
    }

    _self.getWebDomain = function () {
        return dom.domain;
    }

    _self.getWebUrl = function () {
        return _self.getProtocal() + "//" + _self.getWebDomain();
    }

    _self.goToIndex = function () {
        _self.topGoToUrl(_self.getWebUrl());
    }

    _self.topGoToUrl = function (_url, par) {
        var paramStr = "";
        var str = "";

        /*var tmpForm = document.createElement("form");
        tmpForm.action = _url;
        tmpForm.method = "POST";
        tmpForm.target = "_top";

        if(top.isapp == "Y"){
            par["isapp"] = top.isapp;
        }

        if(par){
            for(var keys in par){
                var inp = document.createElement("input");
                inp.type = "hidden";
                inp.name = keys;
                inp.value = par[keys];
                tmpForm.appendChild(inp);
            }
        }
        

        document.body.appendChild(tmpForm);
        tmpForm.submit();*/

        if(par){
            for (var key in par) {
                var content = par[key]+"";
                str+=key+"="+((content=="undefined")?"":content)+"&";
            }
        }
        if(top.isapp == "Y"){
            str+="isapp="+top.isapp+"&";
        }

        if(str !="")paramStr="?"+str
        top.location = _url + paramStr;
    }

    _self.chkErrorMsg = function (errHash, LS_code) {
        if (errHash["status"]!= null && errHash["status"] == "error") {
            if (errHash["code"]!=null && errHash["code"] == "4X014") {
                if(!top.doubleLogin){
                    top.doubleLogin = true;
                    alert(LS_code.get(errHash["code"]));
                }
                _self.goToIndex();
                return true;
            } else if (errHash["code"] != null && errHash["code"].indexOf("clean_db")!=-1){
                if (errHash["msg"]) _self.showErrorMsg(errHash["msg"]);
                parentClass.dispatchEvent("showLoading", { "showLoading": false });
                return true;
            }

        }
        return false;
    }

    //onblur
    _self.initOnBlurDiv = function (showObj, clickObj, clickFun, clickParam) {
        clickObj.tabIndex = 100;

        var param = new Object();
        param.showObj = showObj;
        param.clickObj = clickObj;
        param.clickFun = clickFun;
        param.clickParam = clickParam;
        _self.addEvent(clickObj, "blur", _self.onBlurEvent, param);
    }

    _self.onBlurEvent = function (e, param) {
        //_self.echo("on blur");
        //param.showObj.style.display = 'none';
        //_self.removeEvent(param.clickObj, "click");
	//_self.echo(param.clickObj);
	if(param.clickParam && param.clickParam.className) _self.classFunc(param.clickObj,param.clickParam.className,"remove");

        //setTimeout(_self.addEvent, 500, param.clickObj, "click", param.clickFun, param.clickParam);
    }

    //隱藏顯示提示窗
    _self.setInfEvent = function (icon,param) {
        //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
        // param.info_mode = true; //點內容要消失的模式
        param.info_mode != false ? param.info_mode = true : param.info_mode = false; //點內容要消失的模式
        param._focus.prev_scroll_lock = true;
        _self.addEvent(icon, "click", _self.showInfEvent, { "icon": icon, "param": param});
    }

    _self.showInfEvent = function (e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i] == e.target) {
                return false;
            }
        }
        if (e.target == param._focus) return false;

        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
            if (param.info_mode) _self.removeEvent(param._focus, "click");
            _self.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
            _self.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");
        } else {
            param._setView.classList.add(param._viewClass);
            if (param.info_mode) _self.addEvent(param._focus, "click", _self.closeInfElmt, param);
            _self.addEvent(dom.getElementsByTagName("div")[0], "mousedown", _self.InfBlurEvent, _par);
            _self.addEvent(dom.getElementsByTagName("div")[0], "touchstart", _self.InfBlurEvent, _par);
        }
    }

    _self.InfBlurEvent = function (e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
        var mouseIN = false;
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if(all[i] == e.target){
                mouseIN = true;
            }
        }
        if (param._focus == e.target) mouseIN = true;

        if (!mouseIN){
            var all = icon.getElementsByTagName("*");
            for (var i = 0, max = all.length; i < max; i++) {
                if (all[i] == e.target) {
                    return false;
                }
            }
            if (e.target == icon) return false;

            _self.closeInfElmt(null,param);

        }
    }

    _self.closeInfElmt = function (e,param) {
        dom.activeElement.blur();
        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
        }

        _self.removeEvent(param._focus, "click");
        _self.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
        _self.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");
    }
    //隱藏顯示提示窗

    _self.clone = function (obj) {
        //Handle the 3 simple types, and null or undefined
        if (null == obj || typeof obj != "object") return obj;

        //Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());

            return copy;
        }

        //Handle Array
        if (obj instanceof Array) {
            var copy = [];

            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = _self.clone(obj[i]);
            }

            return copy;
        }

        //Handle Object
        if (obj instanceof Object) {
            var copy = {};

            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = _self.clone(obj[attr]);
            }

            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    _self.showErrorMsg = function (msg) {
        // alert(msg);
        _self.showMsg(msg, "N", null);
    }

    _self.showMsg = function (msg, _confirm, retFun) {
        parentClass.dispatchEvent("showAlertMsg", { "confirm": _confirm, "msg": msg, "retFun": retFun });
    }

    _self.showTxt = function (msg) {
        if(msg+""=="undefined"||msg+""=="null"||msg+""=="NaN")  return "";
        return msg;
    }

    _self.echo = function (msg) {
        //win.console.trace(msg);
        //win.echo(msg);
    }

    _self.err = function (title, e) {
        // _self.echo(title+"\n"+e.stack);
        //win.console.error(title, e.stack);
        try{
            console.error(title+"\n"+e);
        }catch(e){}
    }

    _self.formatThousand = function (num) {
        num = num + "";
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) {
            num = num.replace(re, '\$1,\$2');
        }
        return num;
    }

    _self.util_formatNumber = function(num){
            return _self.formatNumber(num, 2, true);
    }

    _self.formatNumber = function(num, b, add){
        var point = b;
        var t=1;
        for(;b>0;t*=10,b--);

        if(num*1 >= 0){
            if(add) return _self.addZero(Math.round((num*t)+(1/t))/t,point);
            else 		return Math.round((num*t)+(1/t))/t;
        }else{
            if(add) return _self.addZero(Math.round((num*t)-(1/t))/t,point);
            else 		return Math.round((num*t)+(1/t))/t;
        }
    }


    _self.addZero = function(code,b){
        code+="";
        var str = "";
        var index = code.indexOf(".");

        if(index==-1){
                code+=".";
                index=code.length-1;
        }

        var r = b*1 - (code.length-index-1);
        for(i=0; i<r; i++){
                str += "0";
        }
        str = code + str;

        return str;
    }

    _self.mprintf = function (vals, fronts, points, comma, thousand) {
        var out = _self.printf(vals, fronts, points, comma);
        if (thousand) out = _self.formatThousand(out);
        return out;
    }

    _self.printf = function (vals, fronts, points, comma) {
        vals = "" + vals;
        var cmd = new Array();
        cmd = vals.split(".");
        if (cmd.length > 1) { //cut the unnecessary points
            if (cmd[1].length > points) {
                if (points != 0) {
                    tmp = Math.pow(10, points * 1);
                    vals = Math.round(vals * tmp + 0.0001) / tmp;
                    vals = "" + vals;
                    cmd = vals.split(".");
                } else {
                    cmd = new Array(cmd[0]);
                    vals = cmd[0];
                }
            }
        }
        //integer+0
        for (ii = 0; ii < (fronts - cmd[0].length); ii++) {
            vals = "0" + vals;
        }

        //add comma
        if (comma) {
            valarr = vals.split(".");
            tmpval = valarr[0];
            for (ii = valarr[0].length; ii > 3; ii -= 3) {
                comma_index = ii - 3;
                strA = tmpval.substring(0, comma_index);
                strB = tmpval.substring(comma_index);
                tmpval = strA + "," + strB;
            }
            if (valarr.length > 1) {
                tmpval += "." + valarr[1];
            }
            vals = tmpval;
        }

        //point+0
        if (points > 0) {
            if (cmd.length > 1) { //has point
                for (ii = 0; ii < (points - cmd[1].length); ii++) {
                    vals = vals + "0";
                }
            } else { //no point
                vals = vals + ".";
                for (ii = 0; ii < points; ii++) {
                    vals = vals + "0";
                }
            }
        }
        return vals;
    }

    _self.getObjAry = function (tmpScreen, aryStr, attribute, isOnly) {
        var newAry = new Array();
        var _attribute = attribute;

        if (tmpScreen != null & aryStr != null) {

            if (_attribute == null) _attribute = "id";
            newAry = _self.getChildAry(tmpScreen.getElementsByTagName("*"), aryStr, newAry, _attribute, isOnly);

        }
        return newAry;
    }

    _self.getChildAry = function (objAry, aryStr, newAry, attribute, isOnly) {

        for (var i = 0; i < objAry.length; i++) {
            var obj = objAry[i];
            var _id = obj.getAttribute(attribute);

            if (_id != null) {
                if (aryStr.indexOf("," + _id + ",") != -1) {
                    if (attribute == "id") {
                        newAry[_id] = obj;
                    } else {
                        newAry.push(obj);
                    }
                    if (isOnly) return newAry;
                }
            }

            // if (obj.children.length > 0) {
            //     _self.getChildAry(obj.children, aryStr, newAry, attribute, isOnly);

            // }

        }
        return newAry;
    }

    //get span
    _self.getSpan = function (divObj, spanid) {
        return _self.getObj(divObj, spanid);
    }


    //get obj
    _self.getObj = function (divObj, tagID) {
        var obj = null;
        try {
            obj = divObj.children[tagID];
        } catch (e) {
            obj = null;
        }
        return obj;
    }

    _self.setObjectClass = function (targetObj, classStr) {
        if (targetObj.className != undefined) {
            targetObj.className = classStr;
        } else {
            targetObj.setAttribute("class", classStr);
        }
    }

    _self.getObjAbsolute_new = function (obj, stop_name) {
        var abs = new Object();

        abs["left"] = obj.offsetLeft;
        abs["top"] = obj.offsetTop;

        while (obj = obj.offsetParent) {
            ////echo(obj);
            ////echo(obj.offsetLeft+" >> "+obj.offsetTop);
            if (_self.getStyle(obj, "position") == "relative") {
                ////echo(obj.id+"|"+obj.offsetParent.id+"|"+_self.getStyle(obj,"top")+"|"+_self.getStyle(obj,"margin-top")+"|"+obj.offsetTop);
                if ((obj.id != "" && obj.offsetParent.id != "") && _self.getStyle(obj, "top") != "auto" && _self.getStyle(obj, "margin-top") != "auto" && _self.getStyle(obj, "margin-top") != "0px") {
                    abs["top"] += -obj.offsetTop;
                    continue;
                }
            }

            if (stop_name != undefined && obj.id == stop_name) {
                break;
            } else if (_self.getStyle(obj, "position") == "absolute") {
                break;
            }

            abs["left"] += obj.offsetLeft;
            abs["top"] += obj.offsetTop;
        }

        return abs;
    }

    _self.getStyle = function (oElm, strCssRule) {
        var strValue = "";
        if (document.defaultView && document.defaultView.getComputedStyle) {
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        } else if (oElm.currentStyle) {
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
            strValue = oElm.currentStyle[strCssRule];
        } else {
            return "error";
        }
        return strValue;
    }

    //return true/false
    _self.checkFormat = function (msg, type) {
        var ret = null;
        var _msg = msg + "";
        switch (type) {
            case 0:
                ret = _msg.match("^[a-zA-Z0-9]*$");
                break;
            case 1:
                ret = _msg.match("^[0-9]*$");
                break;
            case 2://密碼專用
                ret = _msg.match("^[a-zA-Z0-9]*$");
                if (ret) {
                    if (_msg.match("^[a-zA-Z]*$") || _msg.match("^[0-9]*$")) {
                        ret = false;
                    }
                    if (_msg.length < 6 || _msg.length > 12) ret = false;
                }
                break;
            default:
                ret = _msg.match("^[a-zA-Z0-9]*$");
                break;
        }
        return (ret) ? true : false;
    }

    _self.getKeyCode = function (e) {
        return (win.event) ? win.event.keyCode : e.which;
    }

    _self.prevDefault = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    //============== check username keyBoard==============
    _self.ChkKeyUser = function (target, FunParam) {
        //FunParam{onErr:funOnErr(), param:param}
        if (_self.isAndroid()) {
            _self.addEvent(target, "input", _self.ChkInpKeyUser, FunParam);
        }else{
            _self.addEvent(target, "keypress", _self.ChkBoardKeyUser, FunParam);
        }
    }

    _self.ChkBoardKeyUser = function (e, FunParam) {
        //FunParam{onErr:funOnErr(), initShow:initShow(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow) FunParam.initShow(e, _par);
        }
        var keyCode = _self.getKeyCode(e);
        if (keyCode == 13) _self.prevDefault(e);
        else if (keyCode == 8) { }
        else if ((keyCode < 48 || keyCode > 57) && (keyCode > 95 || keyCode < 106) && !((keyCode > 64 && keyCode < 91) || (keyCode > 96 && keyCode < 123))) {
            _self.prevDefault(e);
            if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
        }
    }

    _self.ChkInpKeyUser = function (e, FunParam) {
        //FunParam{onErr:funOnErr(), initShow:initShow(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow) FunParam.initShow(e, _par);
        }
        var inCode = e.data;
        if (inCode != null) {
            if (inCode.match(/[^a-zA-Z0-9]/)) {
                var St = e.target;
                var position = _self.getCaretPosition(St) - inCode.length;
                var result = St.value.split('');
                result.splice(position, inCode.length);
                St.value = result.join('');
                _self.setSelectionRange(e.target, position, position);
                if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
            }
        }
    }

    //============== check Credit keyBoard==============
    _self.ChkKeyCash = function (target, FunParam) {
        //FunParam{initShow:initShow(), onErr:funOnErr(), onSuc:funOnSuc(), param:param}
        if (_self.isAndroid()) {
            _self.addEvent(target, "input", _self.ChkInpKeyCash, FunParam);
        } else {
            _self.addEvent(target, "keypress", _self.ChkBoardKeyCash, FunParam);
            _self.addEvent(target, "keyup", _self.doSucKeyCash, FunParam);
        }
    }

    _self.ChkBoardKeyCash = function (e, FunParam) {

        //FunParam{initShow:initShow(), onErr:funOnErr(), onSuc:funOnSuc(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null){
            if (FunParam.initShow) FunParam.initShow(e, _par);
            FunParam.isCHK = false;
        }

        var keyCode = _self.getKeyCode(e);
        if (keyCode == 13){
            _self.prevDefault(e);
            return false;
        }
        else if ((keyCode >= 48 && keyCode <= 57) || keyCode == 8) { }
        else if (keyCode < 96 || keyCode > 105) {
            if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
            _self.prevDefault(e);
            return false;
        } else if (e.code || e.key) {
            var charCode = e.code || e.key;
            charCode = charCode.replace(/\D/g, '');
            if (charCode == '') {
                if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
                _self.prevDefault(e);
                return false;
            }
        }
        if (FunParam != null) FunParam.isCHK = true;
    }
    _self.doSucKeyCash = function (e, FunParam) {
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null && FunParam.onSuc && FunParam.isCHK) FunParam.onSuc(e, _par);
    }

    _self.ChkInpKeyCash = function (e, FunParam) {

        //FunParam{initShow:initShow(), onErr:funOnErr(), onSuc:funOnSuc(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow) FunParam.initShow(e, _par);
            FunParam.isCHK = false;
        }

        var inCode = e.data;
        if (inCode != null) {
            if (inCode.match(/[^0-9]/)) {
                if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
                var St = e.target;
                var position = _self.getCaretPosition(St) - inCode.length;
                var result = St.value.split('');
                result.splice(position, inCode.length);
                St.value = result.join('');
                _self.setSelectionRange(e.target, position, position);
                return false;
            }
        }
        if (FunParam != null) FunParam.isCHK = true;
        if (FunParam != null && FunParam.onSuc) FunParam.onSuc(e, _par);
    }

    //信用額度轉換千位顯示
    _self.Replace_credits = function (targetObj, credit_old, e) {
        var keyCode = _self.getKeyCode(e);
        var position = _self.getCaretPosition(targetObj);
        var credit = targetObj.value.replace(/\D/g, '');
        if (credit != "") {
            credit = credit * 1;
            var num_length = credit.toString().length;

            if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
                if (credit_old * 1 != credit && num_length % 3 == 1) position++;
                //if (credit_old * 1 == credit && position > 0) position--;
            } else if (keyCode == 8) {
                if (num_length % 3 == 0 && (credit_old * 1 != credit) && position > 0) position--;
            } else if ((keyCode >= 37 && keyCode <= 40) || keyCode == 13){
                return true;
            }
            targetObj.value = _self.mprintf(credit, 0, 0, false, true);
            _self.setSelectionRange(targetObj, position, position);
        } else {
            targetObj.value = "";
        }

    }

    //信用額度轉換千位顯示
    _self.Replace_Input_credits = function (targetObj, credit_old, e) {
        var inCode = e.data;
        var position = _self.getCaretPosition(targetObj);
        var credit = targetObj.value.replace(/\D/g, '');
        if (credit != "") {
            credit = credit * 1;
            var num_length = credit.toString().length;

            if (inCode != null) {
                if (num_length % 3 == 1 && inCode.match(/\d/)){
                    position += inCode.length;
                }
                if (inCode.match(/\D/)){
                    position -= inCode.length;
                }
                //echo(inCode.length);
            } else {
                if (num_length % 3 == 0 && (credit_old * 1 != credit) && position > 0) position--;
            }
            //echo(position);
            targetObj.value = _self.mprintf(credit, 0, 0, false, true);
            _self.setSelectionRange(targetObj, position, position)
        }else{
            targetObj.value = "";
        }

    }

    _self.getCaretPosition = function (oField) {
        var iCaretPos = 0;

        // IE Support
        if (document.selection) {
            oField.focus();
            var oSel = document.selection.createRange(); // To get cursor position, get empty selection range
            oSel.moveStart("character", 0 - oField.value.length); // Move selection start to 0th position
            iCaretPos = oSel.text.length; // The caret position is selection length
        }
        // Firefox Chrome support
        else if (oField.selectionStart || oField.selectionStart == "0") {
            iCaretPos = oField.selectionStart;
        }

        return (iCaretPos);
    }



    _self.setSelectionRange = function (input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionStart);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }

    //增加 / 刪除 className
    // ex: 刪除 util.classFunc(dom.getElementById("right_show"), ["w200px","w360px","w100per"], "remove");
    // ex: 新增 util.classFunc(dom.getElementById("right_show"), ["w100per","ma_extend"]);
    _self.classFunc = function (dom, c, a) {
        //dom指定的元素
        //c 可以是字串或是陣列
        //a=remove 剔除
        a = a || "";
        if (!Array.isArray) {
            Array.isArray = function (arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
        if (!(typeof c == "string") && !Array.isArray(c)) return;
        var o = dom.className.split(" ");
        if (!Array.isArray(c)) c = c.split(" ");

        Array.prototype.push.apply(o, c);
        o = _self.unique(o);
        if (a == "remove") {
            var z = JSON.parse(JSON.stringify(c));
            for (var i = 0, len = z.length; i < len; i++) {
                var ind = o.indexOf(z[i]);
                if (ind != -1) o.splice(ind, 1);
            }
        }
        dom.className = o.join(" ");
    }
    //陣列使用 剔除相同元素
    _self.unique = function (array) {
        var r = [];
        for (var i = 0, l = array.length; i < l; i++) {
            for (var j = i + 1; j < l; j++)
                if (array[i] === array[j]) j = ++i;
            r.push(array[i]);
        }
        return r;
    }

    _self.isIE = function () {
        if (win.navigator.userAgent.toUpperCase().indexOf("MSIE") != -1) {
            return true;
        }
        return false;
    }

    _self.isAndroid = function () {
        if (win.navigator.userAgent.toUpperCase().indexOf("ANDROID") != -1) {
            return true;
        }
        return false;
    }

    _self.checkScrollToHide=function(e, targetObj){
        //需要有 "返回至頂部按鈕" 的頁面
        var newScrollTop = e.target.scrollTop;
        if(newScrollTop > 0){
            targetObj["backtop"].style.display = "";
        }else if(newScrollTop <= 0){
            targetObj["backtop"].style.display = "none";
        }
    }


    //檢查流程
    //EngNeed 至少需要幾個字母組成
    _self.str_chk=function(str,EngNeed){
        var str_char=0;
        var str_len = str.length;
        for (var i=0; i < str_len;i++){
            var tmp_str = str.substr(i,1);
            if(tmp_str.match(/[aA-zZ]/))str_char++;
        }
        //不是由英數字組成
        //if(!str.match(/^[0-9aA-zZ]+$/)){
        if(!str.match(/^[a-zA-Z0-9]*$/)){
            return "err_combination";
        }

        //低於6個字或是大於12個字
        if(str_len < 6 || str_len > 12 ){
            return "err_length";
        }

        //裡面含有空格或是底線
        if (str.match(/\s/) || str.match(/_/) || str.match(/\^/)){
            return "err_contain";
        }

        if(str_char >= EngNeed && str_len > str_char){
            return "chk_OK";
        }
     	else{
     		return "chk_wrong";
     	}

    }


    /*_self.in_array=function(txt, ary){
		for(var i=0; i<ary.length; i++){
			if(ary[i]==txt)  return true;
		}
		return false;
    }*/


    _self.isUCBrowser=function(){
        return (navigator.userAgent.indexOf("UCBrowser")!=-1)?true:false;
    }

    _self.extendsClass=function(parentClass, childClass, _win, _dom, _postHash){
        childClass.prototype=parentClass;
        objClass = new childClass(_win, _dom, _postHash);
        objClass._super = parentClass;
        return objClass;
    }

    _self.checkReportTeach=function(cookie, parentClass){
        // if(cookie.get("view_report_teach")!="Y"){
        //     parentClass.dispatchEvent("viewReportTeach", {"page":"report_teach"});
        // }
    }

    _self.isIE=function(){
        if(window.navigator.userAgent.toUpperCase().indexOf("MSIE")!=-1){
                return true;
        }
        return false;
    }


    _self.parseXml=function(xml){
        var tempHtml=new parseHTML(xml);
        var xml=tempHtml.getChildren();
        //alert("-==>"+xml[0].tagName);
        var firstNode=xml[0].tagName;
        //game=xml["server"].node["group"].children["game"].children;
        root=tempHtml.getTag(firstNode);
        xmlnode=new xmlNode(root);
        tempHtml.remove();
        return xmlnode;

    }

    _self.chg_credit=function(targetObj, start_credit, end_credit){
        var total = 300;
        var credit_s = start_credit*1;
        var credit_e = end_credit*1;
        var final = credit_s;
        var diff = credit_e - credit_s;
        var plus = Math.floor(diff/total); 
        var cnt = 0;
        var i = setInterval(function(){
            final = final + plus;
            if(cnt >= total){
                targetObj.innerHTML = trans_thousand(random);
                clearInterval(i);
                return;
            } 
            targetObj.innerHTML = trans_thousand(final);
            cnt++;
        },1);
    }

    //數字轉換成有千分位額度
    _self.trans_thousand=function(val){
        var print_f = val;
        print_f=_self.addComma(print_f);
        print_f=_self.print_t(print_f,2);
        return print_f;
    }
    //千分位符號
    _self.addComma=function(vals){
        var integer = "";
        var decimal = "";
        var tmpval = "";
        var pn = (vals<0)?"-":"";
        vals = ""+Math.abs(vals);
        if(vals.indexOf(".")>=0){
            var valarr = vals.split(".");
            integer = valarr[0];
            decimal = valarr[1];
            tmpval = valarr[0];
        }else{
            integer = vals;
            tmpval = vals;
        }
        for (ii=integer.length;ii>3;ii-=3){
            var comma_index = ii-3;
            var strA = tmpval.substring(0,comma_index);
            var strB = tmpval.substring(comma_index);
            tmpval = strA+","+strB;
        }
        if(vals.indexOf(".")>=0){
            tmpval += "."+decimal;
        }
        tmpval = pn+tmpval;
        return tmpval;
    }
    //小數點位數
    _self.print_t=function(vals, points) {
        vals = "" + vals;
        var cmd = new Array();
        cmd = vals.split(".");
        if (cmd.length > 1){
            for (ii=0; ii<(points-cmd[1].length); ii++) vals = vals + "0";
        }else{
            vals = vals + ".";
            for (ii=0; ii<points; ii++) vals = vals + "0";
        }
        return vals;
    }
    // 省略小數點位數
    _self.ignoreDots = function(_ior, ignoreNum){
        var floatIor = _self.print_t(_ior,2);
        var tmpIor = floatIor+"";
        var tmp = tmpIor.split(".");
        var _int = tmp[0];
        var _float = tmp[1];
        var newIor = _int + "." + _float.substr(0, ignoreNum);
        return newIor;
    }
    // 小數點相乘溢位
    _self.mulFloat = function(num1, num2){
        var m = 0, s1 = num1.toString(), s2 = num2.toString();
        try{ 
            m += s1.split(".")[1].length; 
        }catch(e){ }
        try{
            m += s2.toString().split(".")[1].length;
        } catch(e){ }
        
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }

    //判斷wtype是否為大小 true/false
    _self.checkWtypeIsOU=function(wtype){
        // =========== 2017-12-21 PJB-176 CRM-229世界盃新玩法 ============= 
        // 加時賽 - 5分鐘進球: 大小(TARU,TBRU ...)
        var wtypeDouble2017 = new Array("TARU","TBRU","TDRU","TERU");
        // ==============================================================	
        var ary = new Array("ROU","HROU","AROU","BROU","CROU","DROU","EROU","FROU","ROUH","ROUC","HRUH","HRUC","OU","HOU","AOU","BOU","COU","DOU","EOU","FOU","PAOU","PBOU","PCOU","PDOU","PEOU","PFOU","OUH","OUC","HOUH","HOUC","POU","HPOU","HPOUH","HPOUC","POUH","POUC");
        var finalAry = ary.concat(wtypeDouble2017);
        return _self.in_array(wtype.toUpperCase(), finalAry);
    }

    _self.showConnectMsg=function(xml){
        var ret = "";
	
        if(xml==""){
            _self.printStackTrace();
            ret = LS_code.get("0X003");
        }else{
            try{
                var xmlnode = _self.parseXml(xml);
                var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
                var msg = xmlnode.Node(xmlnode.Root[0],"msg").innerHTML;
                if(code=="error"){
                    ret = msg;
                }
            }catch(e){
                // _self.err(xml,e);
            }
            
        }
		return ret;
    }

    _self.printStackTrace = function(){
	
		var _this = arguments.callee.caller;
		var msg = "Stack trace:";
		var base = "\n";
        top["errorHash"] = "";
		while(_this.caller){
				//var _name = _this.caller.toString();
				//var idx = _name.indexOf("{");
				//msg+=base+_name.substring(0,idx);
				//msg+=base+_name;
				var param = _self.getArguments(_this.caller.arguments);
				msg+=base+"FUNCTIONMAME "+_this.caller.toString()+base;
				_this = _this.caller;
		}
		
		_self.trace(msg);
}

_self.getArguments = function(obj){
		var ret = new Array();
		for(var _key in obj){
				ret.push(obj[_key]);
		}
		return ret.join(",");
}

_self.trace = function(msg){
		try{
                top["errorHash"] = msg;
				//echo("util ==> _self.trace()",msg);
		}catch(e){
                top["errorHash"] = "catch:" + msg;
		}
}
    
    //by key
    _self.in_array=function(txt, ary){
        return (ary.indexOf(txt)!=-1); 
    }
    
    //error: true
    _self.alertConnectMsg=function(msg){
        
        var ret = false;

        if(msg=="doubleLogin"){  //check uid
                if(top["CookieManager2"]){
                    top["CookieManager2"].set("doubleLogin","double_"+new Date().getTime());
                }
                _self.goToIndex();
                ret = true;
        }else if(msg=="goHome"){
            _self.goToIndex();
            ret = true;
        }else if(msg!=""){
            _self.showErrorMsg(msg);
            ret = true;
        }

        return ret;

    } 
    
    _self.switchShowType=function(type, isUpper){
		var _type = type.toLowerCase();
		var hash = new Object();
		hash["fu"] = "early";
		hash["ft"] = "today";
        hash["rb"] = "live";
        hash["p3"] = "parlay";
		hash["early"] = "fu";
		hash["today"] = "ft";
		hash["live"] = "rb";
		hash["parlay"] = "p3";
		var ret = (hash[_type]!=null)?hash[_type]:type;
		return (isUpper)?ret.toUpperCase():ret.toLowerCase();
    }
    
     _self.showLS=function(code){
		if(top["LS_code_tw"][code]+""=="undefined")  return code;
		return top["LS_code_tw"][code];
    }

    _self.convertNodeToHash=function(NodeObj, orgHash){
		var newHash = new Object();
		for(i=0; i<NodeObj.children.length; i++){
				//alert(NodeObj.children[i].localName;
				try{
						_key = NodeObj.children[i].localName;
						_value = NodeObj.children[i].innerHTML;
						newHash[_key] = _value;
				}catch(e){
                    _self.showErrorMsg(classname, "convertNodeToHash", e.toString());
				}
		}

		return (orgHash!=null)?_self.mergeHash(orgHash,newHash):newHash;
    }

    _self.mergeHash=function (){

		var newHash = new Object();

		for(i=0; i< arguments.length; i++){
				for(var key in arguments[i]){
						try{
								newHash[key] = arguments[i][key];
						}catch(e){
								alert(e.toString());
								//showErrorMsg(classname, "mergeHash", e.toString());
						}
				}
		}
		return newHash;
    }

    /*_self.CheckDomain=function(Fun){
        var urlParams = "";

        urlParams += "username=" + top["userData"].username;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&mid=" + top["userData"].mid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&code=663";

        urlParams = "p=check_login_domain&ver=" + top.ver + "&" + urlParams;

        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete", function(xml){
			xmlnode = _self.parseXml(xml);
            var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
			if(code=="664"){
				var _url = "";
                var new_domain = xmlnode.Node(xmlnode.Root[0],"new_domain").innerHTML;
                var now_mode = xmlnode.Node(xmlnode.Root[0],"now_mode").innerHTML;
                top["userData"].langx = top.langx;
                if(now_mode == "Y"){
                    if(new_domain!=""){
                        top["Requesttime"] = "Y";
                        var _url = _self.getProtocal()+"//"+new_domain;
                        _self.topGoToUrl(_url,top["userData"]);
                        return
                    }else{
                        if(Fun) Fun();
                    }
                }else{
                    if(Fun) Fun();
                }
			}
        });
        getHTML.loadURL(top.url, "POST", urlParams);
    }*/

    _self.countSize = function(tarObj){
        return Object.keys(tarObj).length;
    }

    /*_self.DomainGoToUrl = function(url){
        var loginvar = "?";
        for(var key in top["userData"]){
            loginvar += ""+key+"="+top["userData"][key]+"&";
        }
        var _par = (top["userData"].uid+""=="undefined")?"":loginvar;
        var url = url + _par;
        _self.topGoToUrl(url);
    }*/

    /*_self.chgOddfIoratio = function(iorH, iorC, odd){
        if (odd=="HK") odd="H";
        var tmp_odd = (odd!=null)?odd:top["userData"].odd_f_type;
		if(iorH*1==0 && iorC*1==0){
			var tmp = new Array();
			tmp[0] = 0;
			tmp[1] = 0;
			return tmp;
        }
		return get_other_ioratio(tmp_odd, iorH, iorC , chg_showior(top["userData"].ltype), config_set.get("CONFIG_IORATIO"));
    }

    _self.getChangeAry = function(isUpper){
        	//2017-07-11 CRB-101 足球玩法原雙盤改單盤  (會員三端) Ricky
		//將 "OG","OT","TS","HTS","ROT","RTS","RTS2" 從 ary 移掉
		//Ricky 2018-01-11 PJB-176 CRM-229世界盃新玩法 (8)所有會員端-all bets-雙盤-改盤口沒作用
		var ary = new Array("R","OU","HR","HOU","RE","ROU","HRE","HROU","EO","HEO","REO","HREO","AR","BR","CR",
		"DR","ER","FR","AOU","BOU","COU","DOU","EOU","FOU","ARE","BRE","CRE","DRE","ERE","FRE","AROU","BROU",
		"CROU","DROU","EROU","FROU","ROUH","ROUC","HRUH","HRUC","OUH","OUC","HOUH","HOUC",
		"EOH","EOC","HEOH","HEOC",
		"RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL",
		"RNBM","RNBN","RNBO","RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC",
		"RNCD","RNCE","RNCF","RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR",
		"RNCS","RNCT","RNCU","RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL",
		"RSHM","RSHN","RSHO","RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ","RSCK","RSCL",
		"RSCM","RSCN","RSCO",
		"TARU","TBRU","TDRU","TERU");

		if(isUpper){
				return ary;
		}else{
				var tmp = ary.join(",").toLowerCase();
				return tmp.split(",");
		}
    }

    function chg_showior(ltype){
        switch(ltype){
            case "1":
                show_ior=100;
                break;
            case "2":
                show_ior=100;
                break;
            case "3":
                show_ior=100;
                break;
            case "4":
                show_ior=100;
                break;
            default:
                show_ior=100;
                break;
        }
        return show_ior;
    }*/

    _self.in_object = function(_key, tarObj){
        for(var i in tarObj){
            if(_key==i) return true;
        }
        return false;
    }

    _self.checkWtypeIsRSH = function(wtype){
	    var ary = new Array("RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO"
	                   ,"PRSHA","PRSHB","PRSHC","PRSHD","PRSHE","PRSHF","PRSHG","PRSHH","PRSHI","PRSHJ","PRSHK","PRSHL","PRSHM","PRSHN","PRSHO");

	    return _self.in_array(wtype.toUpperCase(), ary);
    }

    _self.addClass = function(targetObj, classStr){
        if(!targetObj.classList.contains(classStr)) targetObj.classList.add(classStr);
    }

    _self.removeClass = function(targetObj, classStr){
        if(targetObj.classList.contains(classStr)) targetObj.classList.remove(classStr);
    }

    _self.initCheckScroll = function(totalObj, divObj, leftObj, rightObj, ary, retFun){
        // var total_w = totalObj.clientWidth;
        // var menu_w = divObj.clientWidth;
        // var menuWidth = divObj.offsetWidth;
        // var menuW = divObj.scrollWidth - divObj.clientWidth;
        // var scroll_w = divObj.scrollLeft;

        // //左右箭頭
        // if(total_w > menu_w){
		// 	if(scroll_w != 0) leftObj.classList.add("on");
		// 	if(scroll_w != menu_w) rightObj.classList.add("on");
		// }else{
		// 	if(leftObj.classList.contains("on")){
		// 		leftObj.classList.remove("on");
		// 		_self.removeEvent(leftObj, "click");
		// 	}
		// 	if(rightObj.classList.contains("on")){
		// 		rightObj.classList.remove("on");
		// 		_self.removeEvent(rightObj, "click");
		// 	} 
        // }
		// if(leftObj.classList.contains("on")) _self.addEvent(leftObj, "click", _self.move, {"click":leftObj ,"div":divObj, "direction":"left", "opposite":rightObj});
		// if(rightObj.classList.contains("on")) _self.addEvent(rightObj, "click", _self.move, {"click":rightObj ,"div":divObj, "direction":"right", "opposite":leftObj});

        // _self.addEvent(divObj, "scroll", function (event) {
        //     var eded = divObj.scrollLeft;

        //     if (eded > 0) {
        //         leftObj.classList.add("on");
        //     }  
        //     if (eded == 0) {
        //         leftObj.classList.remove("on");
        //     }
        //     if (eded < menuW) {
        //         rightObj.classList.add("on");
        //     }
        //     if (eded >= menuW) {
        //         rightObj.classList.remove("on");
        //     }
        
        // });

        // //var btnSport = dom.getElementsByClassName("btn_le_sport");
        // for(var i = 0; i < ary.length; i++) {
        //     (function(num) {
        //         dom.getElementById(ary[num]).addEventListener("click", function(e) {
        //                 e.preventDefault();
        //                 for(var j = 0; j < ary.length; j++) {
        //                     dom.getElementById(ary[j]).classList.remove("on");
        //                     var myScrollPos = 0;
        //                 }
        //                 echo(ary[num].split("_")[1]);
        //                 dom.getElementById(ary[num]).classList.add("on");

        //                 var elOffset = dom.getElementById(ary[num]).offsetLeft;
        //                 var elWidth = dom.getElementById(ary[num]).offsetWidth;
        //                 var menuScrollLeft = 0;                        
        //                 var myScrollPos = elOffset + (elWidth / 2) + menuScrollLeft - (menuWidth / 2);
                
        //                 echo("elOffset =" +  elOffset);
        //                 echo("elWidth =" +  elWidth);
        //                 echo("menuScrollLeft =" +  menuScrollLeft);
        //                 echo("menuWidth =" +  menuWidth);
        //                 echo("myScrollPos =" +  myScrollPos);
                    
        //                 //top.scrollLeft = myScrollPos;
        //                 dom.getElementById("sport_scroll").scrollLeft = myScrollPos;
        //                 //return retFun(null,{"gtype":ary[num].split("_")[1]});
        //             });
        //     })(i);
        // }

		var total_w = totalObj.clientWidth;
		var menu_w = divObj.clientWidth;
        var scroll_w = divObj.scrollLeft;
        
		if(total_w > menu_w){
			if(scroll_w != 0) leftObj.classList.add("on");
			// if(scroll_w < menu_w) {
            //     echo("居然加上右邊的on");
            //     rightObj.classList.add("on");
            // }
		}else{
			if(leftObj.classList.contains("on")){
				leftObj.classList.remove("on");
				_self.removeEvent(leftObj, "click");
			}
			if(rightObj.classList.contains("on")){
				rightObj.classList.remove("on");
				_self.removeEvent(rightObj, "click");
			} 
        }
		if(leftObj.classList.contains("on")) _self.addEvent(leftObj, "click", _self.move, {"click":leftObj ,"div":divObj, "direction":"left", "opposite":rightObj});
        if(rightObj.classList.contains("on")) _self.addEvent(rightObj, "click", _self.move, {"click":rightObj ,"div":divObj, "direction":"right", "opposite":leftObj});
        
        // _self.addEvent(divObj, "scroll", function (event) {
        //     var eded = divObj.scrollLeft;
        //     var menuW = divObj.scrollWidth - divObj.clientWidth;

        //     if (eded > 0) {
        //         leftObj.classList.add("on");
        //     }  
        //     if (eded == 0) {
        //         leftObj.classList.remove("on");
        //     }
        //     if (eded < menuW) {
        //         rightObj.classList.add("on");
        //     }
        //     if (eded >= menuW) {
        //         rightObj.classList.remove("on");
        //     }
        // })
        
	}

	_self.move = function(e, hash){
			var clickObj = hash.click;
			var divObj = hash.div;
			var movePix = divObj.clientWidth;
			var move = (hash.direction=="right")?movePix:movePix*-1;
			_self.checkScrolltoShow(clickObj, hash.direction, hash.opposite, divObj, move);
	}

	_self.checkScrolltoShow = function(clickObj, _dir, _oppositeObj, divObj, move){
			var dirAry = new Object();
			dirAry["left"] = "right";
			dirAry["right"] = "left";
			if(!_oppositeObj.classList.contains("on")){
				_oppositeObj.classList.add("on");
				_self.addEvent(_oppositeObj, "click", _self.move, {"click":_oppositeObj ,"div":divObj, "direction":dirAry[_dir], "opposite":clickObj});
			}
			// 紀錄加總完後的值 (如果即時抓取+move的值，因為scrollLeft需要毫秒去移動畫面，導致抓取是前一個的值)
			var sl = divObj.scrollLeft + move;
			divObj.scrollLeft += move;

			if(_dir=="right"){
				var scroll_w = sl + divObj.clientWidth;
				if(scroll_w >= divObj.scrollWidth && clickObj.classList.contains("on")) clickObj.classList.remove("on");
			}else{
				if(sl <= 0 && clickObj.classList.contains("on")) clickObj.classList.remove("on");
			}	
    }
    
    _self.clearObject=function(obj){
        for(var key in obj){
            delete obj[key];
        }
        return obj;
    }

    _self.clearArray=function(ary){
        ary.length = 0;
        return ary;
    }

    _self.checkVal = function(str){
        var NUMS = /[0-9]+/;
        var A_Z = /[a-zA-Z]+/;
        var all = /^[a-zA-Z0-9]+$/;
        if( !A_Z.test(str) || !NUMS.test(str) || !all.test(str)){
            return false;
        }else{
            return true;
        }
    }

    _self.transDateFS = function(_date){
        // DD/MM/YYYY hh:mm
        var tmpDate = _date.split(" ")[0];
        var tmpTime = _date.split(" ")[1];

        var _YYYY = tmpDate.split("-")[0];
        var _MM = tmpDate.split("-")[1];
        var _DD = tmpDate.split("-")[2];
        var _hh = tmpTime.split(":")[0];
        var _mm = tmpTime.split(":")[1];
        
        var newFormat = _DD+" / "+_MM+" / "+_YYYY+" "+_hh+":"+_mm;
        return newFormat;
    }

    _self.isDifferent_ary = function(_ary, _cp){
        var ary_str = JSON.stringify(_ary);
        var cp_str = JSON.stringify(_cp);
        return (ary_str!=cp_str);
    }

    _self.isIOS12 = function(){
        var ret = false;
        var ag = navigator.userAgent;
        if(ag.indexOf("iPhone")!=-1 || ag.indexOf("iPad")!=-1){
            var os = "OS";
            var pos = ag.indexOf(os);
            var tmp_agent = ag.substring(pos+os.length,ag.length);
            var str = tmp_agent.indexOf("_");
            var version = tmp_agent.substring(0, str);
            if(version*1==12) ret = true;
        }
        return ret;
    }

    _self.isIOS = function(){
        var ret = false;
        var ag = navigator.userAgent;
        if(ag.indexOf("iPhone")!=-1||ag.indexOf("iPad")!=-1){
            ret = true;
        }
        return ret;
    }

    _self.findVal_object = function(txt, obj){
        for(var key in obj){
            if(obj[key]==txt)  return true;
        }
        return false;
    }

    _self.writeLog=function(msg){
        // echo(msg);
        // return;
        var param = "";
        param+="p=write_log";
        param+="&user="+top["userData"].username;
        param+="&msg="+encodeURIComponent(msg);
        
        var hr = new HttpRequest();
        hr.addEventListener("LoadComplete", _self.emptyFun);
        hr.loadURL(top.url, "POST", param);
    }

    _self.parseNewObj=function(str){
        var tmp = new DOMParser().parseFromString(str,"text/html");
        return tmp.body.children[0];
    }

    _self.scrollFun = function(divName){
        var _div = dom.getElementById(divName);
        try{
            _self.addEvent(_div, "touchstart", _self.bodyScroll, {"divName":divName});
            _self.addEvent(_div, "touchmove", _self.bodyScroll, {"divName":divName});
        }catch(e){
            console.log(e);
        }
    }

    _self.bodyScroll = function (e,par){
        _self.listenEvent(e,dom.getElementById(par.divName));
    }

    _self.touchObject = function(targetObject, eventObject){
        try{
            // 取得當下指定物件以下的所有物件
            var allobj = targetObject.getElementsByTagName("*");
            // 最底層的物件（只有他自己）
            if (allobj.length==0) return true;
            for (var i=0;i<allobj.length;i++){
                if (allobj[i]==eventObject){
                    return true;
                }
            }
        }catch(e){
            return false;
        }
        
        return true;
    }
    
    _self.listenEvent = function (e,targetObject){
        var touch=e.targetTouches[0];
        var ts = new Object();
        if (e.type=="touchstart"){
            ts.x=touch.pageX;
            ts.y=touch.pageY;
        }
        //例外的物件（必須執行的指定物件）之外的物件
        echo(e.target);
        if (!_self.touchObject(targetObject,e.target)){
            // e.target.id = "" 代表物件移轉到body身上
            if(e.target.id!="") _self.stopBodyDefaultEvent(e);
        }else{
            // 捲到捲到指定物件頁首
            if (targetObject.scrollTop==0){
                if (ts.y-touch.pageY<0){
                    if (e.type=="touchmove"){
                        _self.stopBodyDefaultEvent(e);
                    }
                }
            }

            // 捲到指定物件的頁尾
            if ((targetObject.scrollTop+targetObject.clientHeight)==targetObject.scrollHeight){
                if (ts.y-touch.pageY>0){
                    if (e.type=="touchmove"){
                        _self.stopBodyDefaultEvent(e);
                    }
                }
            }
        }
    }
    
    _self.stopBodyDefaultEvent = function(e){
        e.preventDefault();
        e.stopPropagation();
    } 

    //2325.iOS 12、13-UC-所有輸入框，輸入錯誤出現紅框後，點輸入框應該要自動全選功能，現在點擊只會彈出鍵盤無法輸入(第一次點擊紅框才會錯)>>info IOS 12 chrome&firefox 點擊也不會全選"
    //uc錯誤後第一次點擊直接進入fun會不知道點到哪裡
    //"2415.我的帳戶-修改密碼當點了輸入框後鍵盤會擋住著輸入框、使用鍵盤上的向下切換也會有擋住的問題
    //>android-點擊輸入框畫面會往下跳>>有在正確的位置了，但切換輸入框時畫面不應該閃，且點了提交，會跳到帳戶歷史>提交ok，但照順序點擊輸入匡畫面還是會閃"
    _self.chkuc = function(Fun,param){
        if(navigator.userAgent.indexOf('MIX') > -1) {
            if(Fun)setTimeout(Fun,100,param);
        }else{
            if(Fun)setTimeout(Fun,2,param);
        }
        /*if(navigator.userAgent.indexOf('UCBrowser') > -1) {
            if(Fun)setTimeout(Fun,5,param);
        }else{
            if(Fun)Fun(param);
        }*/
    }
    _self.getRotation = function(){
        return window.Math.abs(window.orientation);
    }

    _self.selectresizeblur = function(Fun){
        if(navigator.userAgent.indexOf('UCBrowser') <= -1) {
            win.addEventListener("resize",Fun);
        }
    }

    _self.sortObject = function(tarObj){
        var keys = new Array();
        var ret = new Object();
        for (var k in tarObj) {
            if (tarObj.hasOwnProperty(k)) {
              keys.push(k);
            }
        }
        keys.sort();

        for(var i = 0; i < keys.length; i++){
            var _k = keys[i];
            ret[_k] = tarObj[_k];
        }
        return ret;
    }

    _self.sumArrayVal = function(_arr){
        // IE 11 不支援 『=>』此符號
        // return _arr.reduce((a,b)=>a+b);  
        return _arr.reduce(sumFunc);  
    }

    function sumFunc(a,b){
        return a+b;
    }


    _self.aryRemove = function (array, index) {
        var r = [];
        for (var i = 0; i < array.length; i++) {
            if(i!=index) r.push(array[i]);
        }
        return r;
    }

    //----- PC用 ul li 下拉動畫 下拉選單 start ------
    _self.pcDropdowns = function(classId,focusId){
        dom.getElementById(focusId).tabIndex=1;//讓ul li可以聚焦
        setTimeout("pcFocus('"+focusId+"')",300);
        _self.addEvent(dom.getElementById(focusId), "blur", _self.pcBlur, {"id":classId});
    }

    pcFocus = function(focus_id){
        //dom.getElementById(focus_id).focus();
        dom.getElementById(focus_id).focus({preventScroll:true});//preventScroll=true 只聚焦不滾動 但Safari吃不到
    }

    _self.pcBlur = function(e,param){//失焦關閉選單
        dom.getElementById(param.id).classList.remove("on");//關閉選單
    }
    //----- PC用 ul li 下拉動畫 下拉選單 end ------

    _self.getTimestamp = function(){
        return new Date().getTime();
    }

    _self.checkTS = function(tarTS, newTS, _php){
        // echo("[php] = ",_php," now = ",tarTS," response = ",newTS," [goParse] = ",(tarTS == newTS));
        return (tarTS == newTS);
    }

    _self.dragScroll = function(dom,targetName,addClickFun,removeClickFun,param){
        var _document = dom;
        var mousemove = 'mousemove';
        var mouseup = 'mouseup';
        var mousedown = 'mousedown';
        var mouseleave = 'mouseleave';
        var EventListener = 'EventListener';
        var addEventListener = 'add'+EventListener;
        var removeEventListener = 'remove'+EventListener;
        var newScrollX, newScrollY;
        var isDown = false;
        var isMoving = false;
    
        var dragged = [];
        for (i = 0; i < dragged.length;) {
            el = dragged[i++];
            el = el.container || el;
            el[removeEventListener](mousedown, el.md, 0);
            _document.getElementById(targetName)[removeEventListener](mouseup, el.mu, 0);
            _document.getElementById(targetName)[removeEventListener](mousemove, el.mm, 0);
        }

        // cloning into array since HTMLCollection is updated dynamically
        var dragClassName = (param)? 'dragscroll_'+param.tagName : 'dragscroll';
        dragged = [].slice.call(_document.getElementsByClassName(dragClassName));

        for (i = 0; i < dragged.length;) {
            (function(el, lastClientX, lastClientY, pushed, scroller, cont){
                (cont = el.container || el)[addEventListener](
                    mousedown,
                    cont.md = function(e) {
                        isDown = true;
                        if (!el.hasAttribute('nochilddrag') ||
                            _document.elementFromPoint(
                                e.pageX, e.pageY
                            ) == cont
                        ) {
                            pushed = 1;
                            lastClientX = e.clientX;
                            lastClientY = e.clientY;

                            e.preventDefault();
                        }
                    }, 0
                );

                _document.getElementById(targetName)[addEventListener](
                    mouseup, cont.mu = function() {
                        isMoving = false;
                        isDown = false;
                        if(param)setTimeout(addClickFun,300,param);
                        else setTimeout(addClickFun,300);
                        pushed = 0;
                    }, 0
                );        
                
                _document.getElementById(targetName)[addEventListener](
                    mouseleave, cont.mlv = function() {
                        echo("mouseleave");
                        isMoving = false;
                        isDown = false;
                        // if(param)addClickFun(param);
                        // else addClickFun();
                        if(param)setTimeout(addClickFun,300,param);
                        else setTimeout(addClickFun,300);
                    }, 0
                );                   

                _document.getElementById(targetName)[addEventListener](
                    mousemove,
                    cont.mm = function(e) {
                        if(!isDown)return;
                        isMoving = true;
                        if(isMoving){
                            echo("觸發到了move，點擊事件被移除了");
                            // if(param)removeClickFun(param);
                            // else removeClickFun();
                            if(param)setTimeout(removeClickFun,100,param);
                            else setTimeout(removeClickFun,100);
                        }
                        if (pushed) {
                            (scroller = el.scroller||el).scrollLeft -=
                                newScrollX = (- lastClientX + (lastClientX=e.clientX));
                            scroller.scrollTop -=
                                newScrollY = (- lastClientY + (lastClientY=e.clientY));
                            if (el == _document.body) {
                                (scroller = _document.documentElement).scrollLeft -= newScrollX;
                                scroller.scrollTop -= newScrollY;
                            }
                        }
                    }, 0
                );
                })(dragged[i++]);
        }
    } 
    
    _self.getRandomInt=function(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    _self.setMyGameCookie = function(cookie,ecidHash,gtype){
        try{
			var myGameStr = JSON.stringify(ecidHash);
			cookie.set(gtype+"_myGame_"+top["userData"].mid,myGameStr);
		}catch(e){
			console.log(top.choice_gtype+"_myGame add ecid error");
		}
    }

    _self.chkAllMyGameHash = function(chkTS){
        var gtype_ary = new Array("ft","bk","bs","bm","op","sk","tt","tn","vb");
        var allZero = true;
        for(var i=0;i<gtype_ary.length;i++){
            var ecidHash = top["myGameHash"][gtype_ary[i]];
            var tmpCnt = _self.countSize(ecidHash);
            if(!chkTS){
                if(tmpCnt!=0){
                    allZero=false;
                    break;
                }
            }else{
                if(tmpCnt!=0){
                    for(var ecid in ecidHash){
                        if(ecidHash[ecid]["ts"]==null || ecidHash[ecid]["ts"]==""){
                            allZero=false;
                            break;
                        }
                    }
                }
            }
        }
        return allZero;
    }    

    _self.delMyGameHash = function(myGameHash,ecid,config_set){
        if(myGameHash[ecid]["ts"]!=null && myGameHash[ecid]["ts"]!=""){
            //console.log("找到TS");
            var tarTS = myGameHash[ecid]["ts"];
            var nowTS = _self.getTimestamp();
            //console.log("[nowTS]:"+nowTS+"[tarTS]:"+tarTS);
            var sec_diff = Math.abs(nowTS-tarTS);
            //console.log("[sec_diff]:",sec_diff);
            var delSec = config_set.get("CONFIG_MYGAME_DEL_COOKIE");
            //console.log("[delSec]:",delSec);
            if(sec_diff >= delSec) delete myGameHash[ecid];
        }else{
            myGameHash[ecid]["ts"] = _self.getTimestamp();
        }
    }

    _self.compareTime = function(t1, t2, diffType) {
		t1 = t1.replace(/\-/g, "/");
		t2 = t2.replace(/\-/g, "/");
		diffType = diffType.toLowerCase();
		var t1 = new Date(t1);
		var t2 = new Date(t2);
		var timeType = 1;
		switch (diffType) {
			case "second":
				timeType = 1E3;
				break;
			case "minute":
				timeType = 1E3 * 60;
				break;
			case "hour":
				timeType = 1E3 * 3600;
				break;
			case "day":
				timeType = 1E3 * 3600 * 24;
				break;
			default:
				break
		}
		ret = parseInt((t2.getTime() - t1.getTime()) / parseInt(timeType));
		return ret
	};
    
	_self.transGameDate = function(gameDate, system_time) {
		var ret = "";
		var tmpdate = gameDate.split(" ");
		var xml_date = tmpdate[0];
		var gmt = new Date(system_time.replace(/-/g, "/"));
		var now_m = parseInt(gmt.getMonth() + 1);
		var game_m = parseInt(xml_date.split("-")[0]);
		if (now_m > game_m) gmt.setFullYear(gmt.getFullYear() +
			1);
		var y = gmt.getFullYear();
		ret = get24Hours(y + "-" + gameDate);
		return ret
	};

	_self.get24Hours = function(gameDate) {
		var ret = "";
		var tmp = gameDate.replace(/-/g, "/");
		tmp = tmp.replace(/a/g, " am")
			.replace(/p/g, " pm");
		var h = (new Date(tmp))
			.getHours();
		var str_h = parseInt(h) < 10 ? "0" + h : h;
		var tmpd = gameDate.split(" ");
		var tmph = tmpd[1].split(":");
		ret = tmpd[0] + " " + str_h + ":" + tmph[1];
		ret = ret.replace(/a/gi, "")
			.replace(/p/gi, "");
		return ret
	};

	_self.isBase64 = function(name, val) {
		var CookieManager = new win.CookieManager;
		if (!val || val ===
			"" || val.trim() === "") return val;
		try {
			if (btoa(atob(val)) == val) return val
		} catch (e) {
			var delComplete = _self.delCookie(name, CookieManager);
			if (delComplete) {
				console.log("\u522a\u9664Cookie:", name, ",\u56e0\u70bavalue\u6c92\u7d93\u904e\u7de8\u78bc");
				return false
			}
		}
	};

	_self.delCookie = function(name, obj) {
		obj.del(name);
		console.log("\u6e05\u9664Cookie:", name, "\u5b8c\u7562!!");
		return true
	};

	_self.CookieChkProc = function(act) {
		var cookies = document.cookie.split(";");
		var CookieManager = new win.CookieManager;
		if (act == "encode") top.cookieEncode_sw =
			"Y";
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var key = cookie.split("=", 1)[0];
			var val = cookie.split(key + "=")[1];
			try {
				val = act == "decode" && key != "" ? atob(val) : val
			} catch (e) {
				console.log("[error] = ", key, e);
				CookieManager.del(key)
			}
			if (key != "") _self.CookieEncode(key, val, CookieManager);
			if (!CookieManager.get("CookieChk") && act == "encode") CookieManager.set("CookieChk", "Y");
			else if (act == "decode" && top.cookieEncode_sw != "Y") CookieManager.del("CookieChk")
		}
	};

	_self.CookieEncode = function(key, val, obj) {
		try {
			obj.set(key,
				val);
			return true
		} catch (e) {
			console.log(e);
			_self.delCookie(key, obj)
		}
	};

	_self.SaveGoldProc = function(gold) {
		if (gold == 0) gold = "";
		var CookieManager = new win.CookieManager;
		var needSave = CookieManager.get("lastBetCredit_sw_" + top.userData.mid);
		if (needSave == "Y") CookieManager.set("lastBetCredit_" + top.userData.mid, gold)
	}

}
