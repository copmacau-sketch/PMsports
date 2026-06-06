function alert_msg(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "alert_msg";
    var util;
    var divBoxAll = new Array("alert_ok","C_alert_ok","alert_confirm","C_alert_confirm","info_pop","R_info_pop","alert_kick");//所有彈出窗
    var divBoxOther = new Array("C_alert_ok","C_alert_confirm","alert_kick");//其他彈出窗 少"alert_ok","alert_confirm","info_pop","R_info_pop"
    var divBox2 = new Array("message_pop","message_pop_nobtn","message_pop_bef");
    var _mc;
    var keepStyle = {};
    var popTimer = new Object();
    var toasttime;
    var removetime;
    //364.會員端-修改以下類型的所有toast訊息(選擇超過八個聯盟、踢單訊息、超過十個選項) 秒數，從3秒改為2秒 (CRM-97)
    var poptimer_sec = 2000;
    var rightStatement_sw = false;//右面板聲明開關
    var mainStatement_sw = false; //主面板聲明開關
    var alert_confirm_sw = false; //主面板雙按鈕pop開關
    var alert_ok_sw = false;//主面板單按鈕pop開關
    
    _self.init=function(){
        //util.echo(classname+" load complete");
        obj_ids = ",ok_btn,C_ok_btn,no_btn,yes_btn,C_no_btn,C_yes_btn,message_ok,message_ok_bef,kick_ok_btn,";// C_中間顯示彈出窗
        obj_ids += "alert_ok,msg_ok,";
        obj_ids += "C_alert_ok,C_msg_ok,";// C_中間顯示彈出窗 一個按鈕
        obj_ids += "alert_confirm,msg_confirm,";
        obj_ids += "C_alert_confirm,C_msg_confirm,";// C_中間顯示彈出窗 兩個按鈕
        obj_ids += "message_pop,message_title,message_pop_nobtn,message_title_nobtn,";
        obj_ids += "message_pop_bef,message_title_bef,";
        obj_ids += "alert_kick,";
        obj_ids += "R_info_pop,R_info_title,R_info_close,R_info_msg,R_close_alert_msg,";//R_close_alert_msg 右遮罩
        obj_ids += "info_pop,info_title,info_close,info_msg,close_alert_msg,L_close_alert_msg,";//L_close_alert_msg 
        obj_ids += "msg_popup,msg_toast,";
        _mc = util.getObjAry(dom.getElementById("alert_show"), obj_ids);
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.showMsg=function(param){
        // echo(param, "[alert_msg][showMsg]");
        var sb = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        //parentClass.dispatchEvent("addbodylock");
        parentClass.dispatchEvent("chkscroll",{"px":sb,"target":param.target});
        if (param._id != null){
            if(_mc[param._id] != null){
                if(param._id=="R_info_pop"){
                    _mc[param._id].classList.add("on");
                    _mc["msg_popup"].classList.add("on");
                    _mc["R_info_title"].innerHTML = util.showTxt(param.title);
                    _mc["R_info_msg"].innerHTML = util.showTxt(param.msg);
                    //14.先展開右面板彈出窗，再去添加下注選項，彈出窗應收掉，只顯示注單 ; 展開注單再去點右面板的聲明，應要加注單下收變header，現在彈出窗會蓋在注單上方
                    //mini這個class會有動畫效果 在點擊聲明的部分會加入_no_animation 直到聲明彈出才收掉
                    util.removeClass(dom.getElementById("bet_show"), "_no_animation");
                }else{
                    parentClass.dispatchEvent("addbodylock");
                    _mc[param._id].classList.add("on");
                    _mc["msg_popup"].classList.add("on");
                    _mc["info_title"].innerHTML = util.showTxt(param.title);
                    _mc["info_msg"].innerHTML = util.showTxt(param.msg);
                } 
            }
        }else{
            parentClass.dispatchEvent("addbodylock");
            if (param.confirm == "Y") {
                _mc["msg_popup"].classList.add("on");
               if(param.target == "C_alert_confirm"){// C_中間顯示彈出窗 兩個按鈕
                    if (_mc["alert_confirm"].classList.contains("on")){
                        _mc["alert_confirm"].classList.remove("on");
                    }
                    _mc["C_alert_confirm"].classList.add("on");
                    _mc["C_msg_confirm"].innerHTML = util.showTxt(param.msg);
                }else{
                    if (_mc["C_alert_confirm"].classList.contains("on")){
                        _mc["C_alert_confirm"].classList.remove("on");
                    }
                    _mc["alert_confirm"].classList.add("on");//主版面顯示彈出窗 兩個按鈕
                    _mc["msg_confirm"].innerHTML = util.showTxt(param.msg);
               }
            } else {
                if (param.target == "message_pop"){
                    _mc["message_title"].innerHTML = "";
                    _mc["msg_toast"].classList.add("on");
                    _mc["message_pop"].classList.add("on");
                    _mc["message_title"].innerHTML = util.showTxt(param.msg);
                    parentClass.dispatchEvent("removebodylock",{});
                }else if (param.target == "message_pop_nobtn"){
                    _mc["message_title_nobtn"].innerHTML = "";
                    _mc["msg_toast"].classList.add("on");
                    _mc["message_pop_nobtn"].classList.add("on");
                    _mc["message_title_nobtn"].innerHTML = util.showTxt(param.msg);
                    parentClass.dispatchEvent("removebodylock",{});
                }else if(param.target == "message_pop_bef"){
                    _mc["message_title_bef"].innerHTML = "";
                    _mc["msg_toast"].classList.add("on");
                    _mc["message_pop_bef"].classList.add("on");
                    _mc["message_title_bef"].innerHTML = util.showTxt(param.msg);
                    parentClass.dispatchEvent("removebodylock",{});
                } else if(param.target == "alert_kick") {
                    _mc["msg_popup"].classList.add("on");
                    _mc["alert_kick"].classList.add("on");
                } else {
                    _mc["msg_popup"].classList.add("on");
                    if(param.target == "C_alert_ok"){// C_中間顯示聲明 一個按鈕
                        if (_mc["alert_ok"].classList.contains("on")){
                            _mc["alert_ok"].classList.remove("on");
                        }
                        _mc["C_alert_ok"].classList.add("on");
                        _mc["C_msg_ok"].innerHTML = util.showTxt(param.msg);
                    }else{
                        _mc["alert_ok"].classList.add("on");
                        _mc["msg_ok"].innerHTML = util.showTxt(param.msg);
                    }
                    
                }
            }
        }
        _self.addEvent(param,sb);
    }

    _self.initAlert=function(param){
        var divBox="";
        if(param != "pop"){
            if(!rightStatement_sw){//右面板關閉
                setTimeout(function(){
                    _mc["R_info_msg"].innerHTML = "";
                    _mc["R_info_title"].innerHTML = "";
                }, 300);
            }
            if(!mainStatement_sw){//主面板關閉
                setTimeout(function(){
                    _mc["info_msg"].innerHTML = "";
                    _mc["info_title"].innerHTML = "";
                }, 300);
            }
            if(param=="noPopAllClear")divBox=divBoxAll;
            else divBox=divBoxOther;
            for (key in divBox) {
                if(_mc[divBox[key]].classList.contains("on")){
                    _mc[divBox[key]].classList.remove("on");
                }
            }
            if(!top["RequestRetry"] && !alert_confirm_sw){
                _mc["msg_confirm"].innerHTML = "";
            }
            if(!alert_ok_sw)_mc["msg_ok"].innerHTML = "";
            _mc["C_msg_ok"].innerHTML = "";
        }else{
            for (key in divBox2) {
                if(_mc[divBox2[key]].classList.contains("on"))_mc[divBox2[key]].classList.remove("on"); 
            }
            //1819.有按鈕的toast訊息，當按下確認，內容字會消失(3秒自動收下的正常) bd 吐司變成一進來先清在塞訊息
            //_mc["message_title"].innerHTML = "";
            //_mc["message_title_bef"].innerHTML = "";
        }
    }

    _self.clearMsg=function(param){
        var msgSw = "N";
        var bodyShow = dom.getElementById("body_show");
        if(param=="noPopMainClear" && (mainStatement_sw || alert_confirm_sw || alert_ok_sw)){//判斷主面板彈出框關閉
            //330.主面板有彈出視窗 (聲明連結 、Ｉ圖示) 後直接點擊切換盤口，主面板的滾軸會不見導致無法滑動
            if(bodyShow.classList.contains("scroll_lock"))bodyShow.classList.remove("scroll_lock");
            if(mainStatement_sw){
                mainStatement_sw=false;
                _mc["info_pop"].classList.remove("on");
                msgSw = "Y";
            }else if(alert_confirm_sw){
                alert_confirm_sw=false;
                _mc["alert_confirm"].classList.remove("on");
                msgSw = "Y";
            }else if(alert_ok_sw){
                alert_ok_sw=false;
                _mc["alert_ok"].classList.remove("on");
                msgSw = "Y";
            }
        }else if(param=="noPopRightClear"&& rightStatement_sw){//判斷右面板聲明關閉
            if(rightStatement_sw){
                rightStatement_sw=false;
                _mc["R_info_pop"].classList.remove("on");
                msgSw = "Y";
            }
        }else if(param=="noPopAllClear"){//判斷所有彈出框關閉
            //330.主面板有彈出視窗 (聲明連結 、Ｉ圖示) 後直接點擊切換盤口，主面板的滾軸會不見導致無法滑動
            if(bodyShow.classList.contains("scroll_lock"))bodyShow.classList.remove("scroll_lock");
            if(mainStatement_sw){
                mainStatement_sw=false;//主面板聲明關閉
                _mc["info_pop"].classList.remove("on");
            }else if(alert_confirm_sw){
                alert_confirm_sw=false;
                _mc["alert_confirm"].classList.remove("on");
            }else if(alert_ok_sw){
                alert_ok_sw=false;
                _mc["alert_ok"].classList.remove("on");
            }
            if(rightStatement_sw){
                rightStatement_sw=false;//右面板聲明關閉
                _mc["R_info_pop"].classList.remove("on");
            }
            msgSw = "Y";
        }
        if(param=="pop" || param=="nopop" || msgSw =="Y"){
            _self.initAlert(param);
            _self.removeEvent(param);
        }
    }

    _self.clickEvent=function(e, param){
        if(param.usr != "pop"){
            if(!top["RequestRetry"]){
                if(param.id=="R_info_pop"){//關閉右面板聲明
                    rightStatement_sw=false;
                    _mc["R_info_pop"].classList.remove("on");
                }else if(param.id=="info_pop"){//關閉主面板聲明
                    mainStatement_sw=false;
                    _mc["info_pop"].classList.remove("on");
                }else if(param.id=="alert_confirm"){
                    alert_confirm_sw=false;
                    _mc["alert_confirm"].classList.remove("on");
                }else if(param.id=="alert_ok"){
                    alert_ok_sw=false;
                    _mc["alert_ok"].classList.remove("on");
                }
                if(!rightStatement_sw && !mainStatement_sw && !alert_confirm_sw && !alert_ok_sw){
                    _mc["msg_popup"].classList.remove("on");//皆無彈出窗
                }
            }
            if(param.dont_close!="Y"){
                parentClass.dispatchEvent("hideAlertMsg", {"use":"nopop"});
            }
            if(param.retFun) param.retFun(param.type);
        }else{
            _self.setPopTimer(param.target);
            if(param.dont_close!="Y"){
                parentClass.dispatchEvent("hideAlertMsg", {"use":"pop"});
            }
            if(param.retFun) param.retFun(param.type);
        }
        parentClass.dispatchEvent("removebodylock",{"px":param.px,"type":param.type});
    }


    _self.addEvent=function(param,px){
        if (param._id != null){
            if(param._id=="R_info_pop"){//右面板 聲明
                rightStatement_sw=true;
                util.addEvent(_mc["R_info_close"], "click", _self.clickEvent, {"id":"R_info_pop","type":"close","retFun":param.retFun,"px":px});
                util.addEvent(_mc["R_close_alert_msg"], "click", _self.clickEvent, {"id":"R_info_pop","type":"close","retFun":param.retFun,"px":px});
            }else{  //主控版 聲明
                mainStatement_sw=true;
                util.addEvent(_mc["info_close"], "click", _self.clickEvent, {"id":"info_pop","type":"close","retFun":param.retFun,"px":px});
                util.addEvent(_mc["L_close_alert_msg"], "click", _self.clickEvent, {"id":"info_pop","type":"close","retFun":param.retFun,"px":px});
            }
        }else{
            if(param.confirm=="Y"){
                if(param.target == "C_alert_confirm"){// 中間顯示用聲明(全畫面) 兩個按鈕
                    util.addEvent(_mc["C_no_btn"], "click", _self.clickEvent, {"id":"C_alert_confirm","type":"no","retFun":param.retFun,"px":px});
                    util.addEvent(_mc["C_yes_btn"], "click", _self.clickEvent, {"id":"C_alert_confirm","type":"yes","retFun":param.retFun,"px":px});
                }else{
                    alert_confirm_sw=true;//主面板雙按鈕pop開關
                    util.addEvent(_mc["no_btn"], "click", _self.clickEvent, {"id":"alert_confirm","type":"no","retFun":param.retFun,"px":px});
                    util.addEvent(_mc["yes_btn"], "click", _self.clickEvent, {"id":"alert_confirm","type":"yes","retFun":param.retFun,"px":px});
                }
            }else{
                if (param.target == "message_pop"){

                    util.addEvent(_mc["message_ok"], "click", _self.clickEvent, {"id":"message_pop","type":"ok","retFun":param.retFun,"usr":"pop","px":px,"target":param.target});
                    _self.removeclass(param.target);

                }else if (param.target == "message_pop_nobtn"){
                    
                    _self.removeclass(param.target);

                }else if(param.target == "message_pop_bef"){

                    util.addEvent(_mc["message_ok_bef"], "click", _self.clickEvent, {"id":"message_pop_bef","type":"ok","retFun":param.retFun,"usr":"pop","px":px,"target":param.target});
                    _self.removeclass(param.target);

                }else if(param.target == "alert_kick") {
                    util.addEvent(_mc["kick_ok_btn"], "click", _self.clickEvent, {"id":"alert_kick","type":"ok","retFun":param.retFun,"px":px});
                }else{
                    if(param.target == "C_alert_ok"){// 中間顯示用聲明(全畫面) 一個按鈕
                        util.addEvent(_mc["C_ok_btn"], "click", _self.clickEvent, {"id":"C_alert_ok","type":"ok","retFun":param.retFun,"px":px});
                    }else{
                        alert_ok_sw=true;//主面板單按鈕pop開關
                        util.addEvent(_mc["ok_btn"], "click", _self.clickEvent, {"id":"alert_ok","type":"ok","retFun":param.retFun,"px":px});
                    }
                    
                }
            }
        }
    }

    _self.removeclass = function(target){
        _self.closetime(target);
        // 將每一個吐司訊息的timer獨立，否則會統一被清除導致沒有執行移除"on"
        popTimer[target] = setTimeout(_self.setPopTimer, poptimer_sec, target);
    }

    _self.setPopTimer = function(target){
        dom.getElementById(target).classList.remove("on");
        dom.getElementById("msg_toast").classList.remove("on");
        parentClass.dispatchEvent("removebodylock",{});
    }

    _self.closetime = function(_name){
        clearTimeout(popTimer[_name]);
    }

    _self.removeEvent=function(param){
        if(param != "pop"){
            if(!top["RequestRetry"]){
                if(!alert_confirm_sw)util.removeEvent(_mc["no_btn"], "click");
                if(!alert_confirm_sw)util.removeEvent(_mc["yes_btn"], "click");
                util.removeEvent(_mc["C_no_btn"], "click");
                util.removeEvent(_mc["C_yes_btn"], "click");
            }
            if(!alert_ok_sw)util.removeEvent(_mc["ok_btn"], "click");
            util.removeEvent(_mc["C_ok_btn"], "click");
            if(!mainStatement_sw)util.removeEvent(_mc["info_close"], "click");
            if(!rightStatement_sw)util.removeEvent(_mc["R_info_close"], "click");
            util.removeEvent(_mc["kick_ok_btn"], "click");
        }else{
            util.removeEvent(_mc["message_ok"], "click");
            util.removeEvent(_mc["message_ok_bef"], "click");
        }
    }
}