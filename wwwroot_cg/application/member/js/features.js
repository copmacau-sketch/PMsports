function features(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object;
    var util = new win.Util(win, dom);
    var _mc = new Object;
    var features_chg = new Array("data_0", "data_1", "data_2", "data_3", "data_4", "data_5", "data_6", "data_7");
    var classname = "features";
    var myhash = {};
    _self.init = function() {
        var bodyShow = document.getElementById("body_show");
        if (top.mobile != "Y") util.addEvent(dom.getElementById("select_features"), "click", _self.openDropdown, {
            "id": "select_features"
        });
        else util.addEvent(dom.getElementById("select_features2"), "change", _self.selectFeatures, {
            "id": "select_features2"
        });
        util.addEvent(dom.getElementById("sel_title_ph"), "blur", _self.selectBlur);
        util.addEvent(dom.getElementById("top_btn"), "click", _self.backTop);
        util.addEvent(dom.getElementById("toback"), "click", _self.toBack);
        _self.selectChg(_data);
        if (bodyShow.classList.contains("box_l_height")) bodyShow.classList.remove("box_l_height");
        _self.loadingClose()
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        LS = parentClass.getThis("LS")
    };
    _self.getThis = function(varible) {
        if (!myhash[varible]) {
            var msg = "no myhash[" + varible + "]";
            util.writeLog(classname, msg)
        }
        return myhash[varible]
    };
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param)
    };
    _self.selectBlur = function() {
        parentClass.dispatchEvent("scrollsetTop")
    };
    _self.openDropdown = function() {
        var obj = dom.getElementById("select_features");
        if (obj.classList.contains("on")) obj.classList.remove("on");
        else {
            obj.classList.add("on");
            util.pcDropdowns("select_features", "pc_sel_title")
        }
        var titleTxt = dom.getElementById("sel_title").innerHTML;
        for (var i = 0; i < features_chg.length; i++) {
            var featuresObj = dom.getElementById("features0" + i);
            if (titleTxt == featuresObj.innerHTML) featuresObj.classList.add("on");
            else if (featuresObj.classList.contains("on")) featuresObj.classList.remove("on");
            util.addEvent(featuresObj, "click", _self.clickChgFeatures, {
                "id": "data_" + i
            })
        }
    };
    _self.clickChgFeatures = function(e, param) {
        _self.chgSelectPage(param.id)
    };
    _self.selectFeatures = function(e, param) {
        _self.selectOption();
        if (dom.getElementById(param.id).className == "tool_select full ph_select") dom.getElementById(param.id).className = "tool_select active full ph_select";
        else dom.getElementById(param.id).className = "tool_select full ph_select"
    };
    _self.selectOption = function(e, param) {
        var option = "sel_title_ph";
        var myselect = dom.getElementById(option);
        var optionnum = myselect.selectedIndex;
        console.log("[myselect]:", myselect);
        console.log("[optionnum]:", optionnum);
        switch (optionnum) {
        case 0:
            _self.chgSelectPage("data_0");
            break;
        case 1:
            _self.chgSelectPage("data_7");
            break;
        case 2:
            _self.chgSelectPage("data_1");
            break;
        case 3:
            _self.chgSelectPage("data_2");
            break;
        case 4:
            _self.chgSelectPage("data_3");
            break;
        case 5:
            _self.chgSelectPage("data_4");
            break;
        case 6:
            _self.chgSelectPage("data_5");
            break;
        case 7:
            _self.chgSelectPage("data_6");
            break;
        default:
            break
        }
    };
    _self.chgSelectPage = function(param) {
        setTimeout(_self.loadPage, 300, param)
    };
    _self.loadPage = function(param) {
        document.getElementById("body_show").classList.add("box_l_height");
        var par = new Object;
        par["page"] = "features";
        par["post"] = "data=" + param;
        par["noCache"] = "Y";
        parentClass.dispatchEvent("bodyGoToPage", par)
    };
    _self.selectChg = function(param) {
        console.log("[selectChg][param]:", param);
        for (var i = 1; i < features_chg.length; i++) dom.getElementById(features_chg[i]).style.display = "none";
        if (param == "data_0") for (var i = 1; i < features_chg.length; i++) dom.getElementById(features_chg[i]).style.display = "";
        else dom.getElementById(param).style.display = "";
        var all = param.split("_");
        if (top.mobile != "Y") dom.getElementById("sel_title").innerHTML = util.showTxt(dom.getElementById("features0" + all[1]).innerHTML);
        else {
            var myselect = document.getElementById("sel_title_ph");
            var tmpIndex = all[1];
            var chgIndex = new Object;
            chgIndex[0] = 0;
            chgIndex[7] = 1;
            chgIndex[1] = 2;
            chgIndex[2] = 3;
            chgIndex[3] = 4;
            chgIndex[4] = 5;
            chgIndex[5] = 6;
            chgIndex[6] = 7;
            myselect.selectedIndex = chgIndex[tmpIndex]
        }
    };
    _self.loadingClose = function() {
        parentClass.dispatchEvent("showLoading", {
            "isShow": false
        })
    };
    _self.backTop = function() {
        win.dom.body.scrollTop = 0;
        win.dom.documentElement.scrollTop = 0
    };
    _self.toBack = function() {
        parentClass.dispatchEvent("backPage", {
            "noCache": "Y"
        })
    }
};