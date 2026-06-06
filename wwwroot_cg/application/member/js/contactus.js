function contactus(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object();
    var util = new win.Util(win, dom);
    var _mc = new Object();
    

    _self.init = function () {
        _mc["tel01"] = dom.getElementById("tel01");
        _mc["tel02"] = dom.getElementById("tel02");
        _mc["tel03"] = dom.getElementById("tel03");
        _mc["tel04"] = dom.getElementById("tel04");
        _mc["email"] = dom.getElementById("email");

        _mc["tel01"].url = "tel:+85258089063";
        _mc["tel02"].url = "tel:+85258088664";
        _mc["tel03"].url = "tel:+639151950193";
        _mc["tel04"].url = "tel:+639151955533";
        _mc["email"].url = "mailto:royal888crown@hotmail.com";

        parentClass.dispatchEvent("showLoading", {"isShow":false});
        util.addEvent(dom.getElementById("toback"), "click",_self.toback);
        util.addEvent(_mc["tel01"], "click", _self.telCall, _mc["tel01"]);
        util.addEvent(_mc["tel02"], "click", _self.telCall, _mc["tel02"]);
        util.addEvent(_mc["tel03"], "click", _self.telCall, _mc["tel03"]);
        util.addEvent(_mc["tel04"], "click", _self.telCall, _mc["tel04"]);
        util.addEvent(_mc["email"], "click", _self.mailCall, _mc["email"]);

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

    _self.telCall=function(mouseEvent, targetObj){
        if(top.isapp=="Y") parentClass.dispatchEvent("callApp", {"msg":"callphone,"+targetObj.url});
    }

    _self.mailCall=function(mouseEvent, targetObj){
        if(top.isapp=="Y") parentClass.dispatchEvent("callApp", {"msg":"sendmail,"+targetObj.url});
    }

}