function help_odds(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object();
    var util = new win.Util(win, dom);
    var _mc = new Object();
    

    _self.init = function () {
        var bodyShow = document.getElementById("body_show");
        //bodyShow.scrollTop = 0;//修正88.所有主面版畫面-當有切換時都應該要置頂不該記住上一個介面的位置
        util.addEvent(dom.getElementById("toback"), "click",_self.toback);
        bodyShow.classList.remove("box_l_height");
        //parentClass.dispatchEvent("showLoading", {"isShow":false});
        _self.loadingClose();
    }

    

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        //util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }

    _self.toback = function () {
        parentClass.dispatchEvent("backPage", {});
    }

    _self.loadingClose = function(){
        parentClass.dispatchEvent("showLoading", {"isShow":false});
    }

}