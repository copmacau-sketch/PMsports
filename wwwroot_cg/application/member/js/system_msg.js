function system_msg(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "system_msg";
    var util;
    var _mc;
    var keepStyle = {};
    var popTimer = new Object();
    var toasttime;
    var removetime;
    var poptimer_sec = 3000;

    
    _self.init=function(){
        obj_ids = "close_alert_msgsystem,C_alert_ok_system,C_msg_ok_system,C_ok_btn_system,system_popup,";
        _mc = util.getObjAry(dom.getElementById("system_show"), obj_ids);
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.showMsg=function(param){
        // echo(param, "[system_msg][showMsg]");
        var sb = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        parentClass.dispatchEvent("addbodylock");
        parentClass.dispatchEvent("chkscroll",{"px":sb,"target":param.target});
        _mc["system_popup"].classList.add("on");
        if(param.target == "C_alert_ok_system"){// C_中間顯示聲明 一個按鈕
            _mc["C_alert_ok_system"].classList.add("on");
            _mc["C_msg_ok_system"].innerHTML = util.showTxt(param.msg);
        }
        _self.addEvent(param,sb);
    }

    _self.initAlert=function(param){
        _mc["C_msg_ok_system"].innerHTML = "";
    }

    _self.clearSysMsg=function(param){
        _self.initAlert(param);
        _self.removeEvent(param);
    }

    _self.clickEvent=function(e, param){
        _mc["C_alert_ok_system"].classList.remove("on");
        _mc["system_popup"].classList.remove("on");//皆無彈出窗
        
        _self.clearSysMsg("nopopSystem");

        if(param.retFun) param.retFun(param.type);
        parentClass.dispatchEvent("removebodylock",{"px":param.px,"type":param.type});
    }

    _self.addEvent=function(param,px){
        if(_mc["C_alert_ok_system"]){
            util.addEvent(_mc["C_ok_btn_system"], "click", _self.clickEvent, {"type":"ok","retFun":param.retFun,"px":px});
        }
    }

    _self.setPopTimer = function(target){
        dom.getElementById(target).classList.remove("on");
        dom.getElementById("msg_toast").classList.remove("on");
        parentClass.dispatchEvent("removebodylock",{});
    }

    _self.removeEvent=function(param){
        util.removeEvent(_mc["C_ok_btn_system"], "click");
    }
}