function help_sys(_win, _dom, _post) {
    var _self = this;
    var _mc = new Object();
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object();
    var util = new win.Util(win,dom);   
    _self.init = function () {
        var bodyShow = document.getElementById("body_show");
        bodyShow.scrollTop = 0;
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
        util.addEvent(dom.getElementById("toback"), "click", _self.toback);
        util.addEvent(dom.getElementById("chromeandr"), "click", _self.tobrowse ,{"browse":"chrome"});
        util.addEvent(dom.getElementById("chromemac"), "click", _self.tobrowse ,{"browse":"chrome"});
        util.addEvent(dom.getElementById("chromeios"), "click", _self.tobrowse ,{"browse":"chrome"});
        util.addEvent(dom.getElementById("chromewin"), "click", _self.tobrowse ,{"browse":"chrome"});
        util.addEvent(dom.getElementById("ucios"), "click", _self.tobrowse ,{"browse":"uc"});
        util.addEvent(dom.getElementById("ucandr"), "click", _self.tobrowse ,{"browse":"uc"});
        util.addEvent(dom.getElementById("QQandr"), "click", _self.tobrowse ,{"browse":"qq"});
        util.addEvent(dom.getElementById("QQios"), "click", _self.tobrowse ,{"browse":"qq"});
        util.addEvent(dom.getElementById("safmac"), "click", _self.tobrowse ,{"browse":"safari"});
        util.addEvent(dom.getElementById("safios"), "click", _self.tobrowse ,{"browse":"safari"});
        util.addEvent(dom.getElementById("firewin"), "click", _self.tobrowse ,{"browse":"firefox"});
        util.addEvent(dom.getElementById("firemac"), "click", _self.tobrowse ,{"browse":"firefox"});
        if(bodyShow.classList.contains("box_l_height"))bodyShow.classList.remove("box_l_height");
        parentClass.dispatchEvent("showLoading", { "isShow": false });
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        config_set = parentClass.getThis("config_set");
        LS = parentClass.getThis("LS")
        //ratioForm = parentClass.getThis("ratioForm_Single_rule");
    }

    _self.getParentThis = function (varible) {
        return parentClass.getThis(varible);
	}

    _self.getThis = function (varible) {
        return eval(varible);
    }

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

    _self.showAlertMsg = function(param){
		parentClass.dispatchEvent("showAlertMsg", param);
    }
    
    _self.bodyGoToPage = function(param){
		parentClass.dispatchEvent("bodyGoToPage", param);
    }
    _self.toback = function(){
        parentClass.dispatchEvent("backPage", {});

    }
    _self.tobrowse = function(e,param){
        if(top.isapp!="Y"){
            if(param.browse == "chrome"){
                window.open('https://www.google.com/chrome', '_blank');
            }
            else if(param.browse == "uc"){
                window.open('http://www.ucweb.com/', '_blank');
            }
            else if(param.browse == "qq"){
                window.open('https://browser.qq.com/', '_blank');
            }
            else if(param.browse == "safari"){
                window.open('https://support.apple.com/downloads/safari', '_blank');
            } 
            else if(param.browse == "firefox"){
                window.open('https://www.mozilla.org/en-US/', '_blank');
            }
        } 
    }
}