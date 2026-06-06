function login(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object();
    var layerFun = new Object();
    var util;
    var LS_code;
    var LS_account;

    //Ricky
    var pwd_isShow = false;
    var pwd_safe_isShow = false;
    var lang_isShow = false;
    var site_isShow = false;
    var totalAD;
    var nowAD = 1;
    var animate_div;
    var selLayer = "A";//預設登1

    var cookieAry = new Array();
    var login_1;
    var login_2;
    var login_3;
    var lang_btn;
    var sel_lang;
    var zh_tw;
    var zh_cn;
    var en_us;
    var user;
    var user_div;
    var pwd;
    var pwd_div;
    var text_msg;
    var pwd_eye_icon;
    var pwd_safe_eye_icon;
    var pwd_safe;
    var Safe;
    var hr_info;
    var hr_info1;
    var hr_infoTXT;
    var hr_info1TXT;
    var remember;
    var forgot_pwd;
    var login_btn;
    var loginold_btn;
    var pwdHtmlTemp;
    var ver_div ;

    var firstTouch = false;
    var touchStartPos = 0;
    var touch = null; // 第一個接觸點
    var touchPoint = 5; //移動多少pixel數才觸發事件

    var timeObj;
    var timeOut = 300; //登入的延遲時間

    var _mc = new Object();
    var tag = "•";
    var isVerifying = false; //是否在驗證中

    _self.init=function(){
        // util.echo("login load complete");
        top.blackbox = '';
        if (typeof (iovationURL) == "undefined") iovationURL="" ;
        if (iovationURL != '') {
            var p = dom.location.protocol;
            p = p.replace(":", "")
            iovation_Proxy = iovation_Proxy.replace("http", "");
            iovation_Proxy = iovation_Proxy.replace("https", "");
            iovationURL = p + iovation_Proxy + "/iovation/vindex.html?webProtocal=" + p + "&webDomain=" + dom.domain;
            dom.getElementById("ddnet_corp_func1").src = iovationURL;
            //top.blackbox = dom.getElementById("ddnet_corp_func1").blackbox ;
        } else {
            top.blackbox = " no blackbox " ;
        }

        _self.initLayerFun();

        login_1 = dom.getElementById("btn_A"); //登1
        login_2 = dom.getElementById("btn_B"); //登2
        login_3 = dom.getElementById("btn_C"); //登3

        lang_btn = dom.getElementById("lang_btn"); //語系箭頭
        sel_lang = dom.getElementById("sel_lang"); //語系拉霸
        //lang_target = dom.getElementById("lang_target");
        zh_tw = dom.getElementById("lg_lan_tw");
        zh_cn = dom.getElementById("lg_lan_cn");
        en_us = dom.getElementById("lg_lan_us");

        user = dom.getElementById("username");//帳號
        user_div =  dom.getElementById("username_div");//帳號框
        pwd = dom.getElementById("pwd");//密碼
        pwdHtmlTemp = pwd.outerHTML.replace(new RegExp("type=*password*", "gi"), "*TYPE*");
        pwd_div = dom.getElementById("pwd_div");//密碼框
        pwd_eye_icon = dom.getElementById("pwd_eye_icon"); //密碼明碼
        pwd_safe_eye_icon = dom.getElementById("pwd_safe_eye_icon"); //安全代碼明碼
        pwd_safe = dom.getElementById("pwd_safe");//安全代碼
        text_msg = dom.getElementById("text_msg");//未設定安全代碼不需輸入
        Safe = dom.getElementById("Safe");//安全代碼框
        hr_info = dom.getElementById("hr_info");//帳號框下的錯誤訊息
        hr_info1 = dom.getElementById("hr_info1");//安全代碼框下的錯誤訊息
        hr_infoTXT = dom.getElementById("hr_infoTXT");//帳號框下的錯誤訊息
        hr_info1TXT = dom.getElementById("hr_info1TXT");//安全代碼框下的錯誤訊息
        remember = dom.getElementById("remember"); //記住帳號
        forgot_pwd = dom.getElementById("forgot_pwd"); //忘記密碼
        login_btn = dom.getElementById("loginBtn"); //登入鈕
        loginold_btn = dom.getElementById("loginoldBtn"); //登入鈕
        ver_div = dom.getElementById("ver_div");    // 驗證碼彈出視窗

        _mc["pwd"] = pwd;
        _mc["safe"] = pwd_safe;
        _mc["pwd"].val = "";
        _mc["safe"].val = "";



        // util.addEvent(user, "Event.ONFOCUS", _self.onFocusEventHandler);
        // util.addEvent(pwd, "Event.ONFOCUS", _self.onFocusEventHandler);
        // util.addEvent(pwd_safe, "Event.ONFOCUS", _self.onFocusEventHandler);
        // util.addEvent(user, "Event.ONBLUR", _self.onBlurEventHandler);
        // util.addEvent(pwd, "Event.ONBLUR", _self.onBlurEventHandler);
        // util.addEvent(pwd_safe, "Event.ONBLUR", _self.onBlurEventHandler);

        util.addEvent(pwd, "focus", _self.onFocusEventHandler, {"type":"pwd"});
        util.addEvent(pwd_safe, "focus", _self.onFocusEventHandler, {"type":"safe"});
        util.addEvent(pwd, "blur", _self.onBlurEventHandler, {"type":"pwd"});
        util.addEvent(pwd_safe, "blur", _self.onBlurEventHandler, {"type":"safe"});

        util.addEvent(login_btn, "click", _self.doLogin);
        util.addEvent(loginold_btn, "click", _self.cntToOldSite);
        util.addEvent(pwd_eye_icon, "click", _self.showPwd);
        util.addEvent(pwd_safe_eye_icon, "click", _self.showPwd_safe);
        util.addEvent(lang_btn, "click", _self.showLang);
        util.addEvent(lang_btn, "focus", _self.onFocusEventHandler);
        util.addEvent(lang_btn, "blur", _self.onBlurEventHandler);

        util.addEvent(login_1, "click", _self.setLayerFun, {"layer":"A"});
        util.addEvent(login_2, "click", _self.setLayerFun, {"layer":"B"});
        util.addEvent(login_3, "click", _self.setLayerFun, {"layer":"C"});
        util.addEvent(zh_tw, "click", _self.chgLang, {"langx":"zh-tw","ls":"tw","class":"hk"});
        util.addEvent(zh_cn, "click", _self.chgLang, {"langx":"zh-cn","ls":"cn","class":"cn"});
        util.addEvent(en_us, "click", _self.chgLang, {"langx":"en-us","ls":"us","class":"en"});
        util.addEvent(dom.getElementById("link_chrome"), "click", util.browserdownload, { "browser": "chrome" });
        util.addEvent(dom.getElementById("link_uc"), "click", util.browserdownload, { "browser": "uc" });
        util.addEvent(dom.getElementById("link_safari"), "click", util.browserdownload, { "browser": "safari" });
        util.addEvent(dom.getElementById("link_firefox"), "click", util.browserdownload, { "browser": "firefox" });

        _self.addEventListener("startTimer", _self.startTimer);
        _self.addEventListener("stopTimer", _self.stopTimer);
        _self.addEventListener("clearTimer", _self.clearTimer);
        _self.addEventListener("showFadeOutMesg", _self.showFadeOutMesg);
        util.addEvent(user, "keyup", _self.keyupEventHandler, {"type":"user"});
        util.addEvent(pwd, "keyup", _self.keyupEventHandler, {"type":"pwd"});
        util.addEvent(pwd_safe, "keyup", _self.keyupEventHandler, {"type":"safe"});
        // 點到輸入框 將選擇語系框框隱藏
        util.addEvent(user, "focus", _self.hideLang, {}, false);
        util.addEvent(pwd, "focus", _self.hideLang,{},false);
        util.addEvent(pwd_safe, "focus", _self.hideLang,{},false);

        // //依照語系換登入頁(*)

        util.addEvent(forgot_pwd, "click", _self.forgotPwd); //忘記密碼
        util.addEvent(dom.getElementById("requirements"), "click", _self.show_requirements); //最低需求

        _self.setLayerFun(null,{"layer":selLayer});

        cookieAry = document.cookie.split(";");
        _self.doCookie("ag_user"+selLayer);

        sel_lang.style.display = "none";


        if(!_self.chg_site()) return; // 不支援的不跑廣告邏輯
        //==== AD func
        animate_div = dom.getElementById("animate_div");
        //ad_Dot = dom.getElementById("ad_Dot");
        preBtn = dom.getElementById("preBtn"); //廣告上一頁按鈕
        nextBtn = dom.getElementById("nextBtn"); //廣告下一頁按鈕
        totalAD = animate_div.children.length; //全部廣告數量(包含最後一張)
        //左右鍵
        util.addEvent(preBtn, "click", _self.preAD);
        util.addEvent(nextBtn, "click", _self.nextAD);
        //廣告小圓點
        for(var i = 1; i<=totalAD-1; i++){
            util.addEvent(dom.getElementById("dot"+i), "click", _self.chgAD, {"now":i});
        }
        //touch事件
        util.addEvent(animate_div, "touchstart", _self.touchstart);
        util.addEvent(animate_div, "touchmove", _self.touchmove);
        util.addEvent(animate_div, "touchend", _self.touchend);

        _self.createTimer();
        _self.startTimer();
        //=============

    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
        config_set = parentClass.getThis("config_set");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash");
        selLayer = parentClass.getThis("selLayer");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }


    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

    _self.keyupEventHandler=function(keyEvent, param){

        var type = param.type;

        if(keyEvent.keyCode==0){
            charCode = keyEvent.which;
        }else{
            charCode = (keyEvent.keyCode)?keyEvent.keyCode:keyEvent.which;
        }

        if(type!="user") _mc[type].val = _mc[type].value;

        if(charCode=="13"){
            //2019-04-10 Ricky 防止連點
            _self.doLogin();
            //targetObj.blur();
        }
    }

    _self.chgPwd=function(val){
        var n = val.length;
        var ret = "";
        for(i=0; i<n; i++){
            ret+=tag;
        }
        return ret;
    }

	//onFocus
	_self.onFocusEventHandler=function(evt, param){
        //lang_btn.className = "lg_languageG active";

        if (evt.target != null){
            if ((pwd_isShow && evt.target.id == "pwd") || (pwd_safe_isShow && evt.target.id == "pwd_safe")){

            }else{
                if(evt.target.value!=null){
                    evt.target.value =_mc[param.type].val ;
                    evt.target.setAttribute("type", "password");
                    evt.target.setAttribute("autocomplete", "new-password");
                }
            }
        }

        // alert(pwd_safe.outerHTML);

        // sel_lang.style.display = "";
    }

    //onBlur
    _self.onBlurEventHandler=function(evt, param){
        //lang_btn.className = "lg_languageG";
        // sel_lang.style.display = "none";
        // lang_isShow = false;
        if (evt.target != null) {
            if ((pwd_isShow && evt.target.id == "pwd") || (pwd_safe_isShow && evt.target.id == "pwd_safe")){
            }else{
                if(evt.target.value!=null){
                    _mc[param.type].val = evt.target.value;
                    evt.target.value = _self.chgPwd(evt.target.value);
                    evt.target.setAttribute("autocomplete", "off");
                }
            }
            evt.target.setAttribute("type", "text");
        }

    }

    //2019-04-10 Ricky 防止連點
    _self.doLogin=function(){
        clearTimeout(timeObj);
        timeObj=setTimeout(_self.loginEventHandler,timeOut);
    }

    //login
    _self.loginEventHandler=function(mouseEvent, targetObj){
        login_btn.focus() ; // 為了要把鍵盤關閉, 聚焦到輸入框之外
        //alert("user="+_mc["user"].value+"\npwd="+_mc["pwd"].value);
        if(typeof autoLogin=="function") autoLogin();
        user_div.className="lg_input u_icon";
        pwd_div.className="lg_input p_icon";
        Safe.className="lg_input s_icon";
        hr_info.style.display="none";
        hr_info1.style.display="none";
        var ret = _self.checkFormat(user.value, pwd.value,pwd_safe.value);

        if(ret==""){
            //記住我的帳號(*)
            if(remember.checked){
                // util.echo("remember is checked");
                //取cookie
                //setLocalStorageItem("username",_mc["user"].value);
            }
            //登入動作
            _self.connetToServer();

        }else{
            util.echo("login error");
        }
    }

    _self.cntToOldSite=function(){
        if(oldSite) util.topGoToUrl(oldSite, {"langx":top.langx});
    }

    //check format
    _self.checkFormat=function(user,pwd){
        if(user==""){
            //帳號未輸入時，要秀錯誤訊息(*)
            hr_info.style.display="";
            //19/04/30 James 517>現在登入帳號沒有輸入時, 顯示的提示訊息秀成英文
            hr_infoTXT.innerHTML = LS_account.get("loginID_Null");
            user_div.className="lg_input u_icon err_input";
            return "login_user";
        }
        if(pwd==""){
            hr_info1.style.display="";
            hr_info1TXT.innerHTML = LS_account.get("pwd_Null");
            pwd_div.className="lg_input p_icon err_input";
            return "login_pwd";
        }
        return "";
    }

    //安全代碼明碼
    _self.showPwd_safe = function () {
        if (!pwd_safe_isShow) {
            pwd_safe_isShow = true;
            pwd_safe_eye_icon.className = "eye_icon";
            pwd_safe.setAttribute("type", "text");
            pwd_safe.value = _mc["safe"].val;
        } else {
            pwd_safe_isShow = false;
            pwd_safe_eye_icon.className = "no_eye_icon";
            pwd_safe.setAttribute("type", "password");
        }
    }

    //密碼明碼
    _self.showPwd=function(){

        var ret = "";

        if(!pwd_isShow){
            pwd_isShow = true;
            pwd_eye_icon.className = "eye_icon";
            pwd.setAttribute("type", "text");
            pwd.value = _mc["pwd"].val;
        }else{
            pwd_isShow = false;
            pwd_eye_icon.className = "no_eye_icon";
            pwd.setAttribute("type", "password");
            // ret = _self.chgPwd(pwd.val);

        }
        // pwd.outerHTML = temp;
        //因為是新物件(innerHTML 被取代掉) 所以要重抓DOM 並設定事件
        // pwd = dom.getElementById("pwd");//密碼
        // pwd.value = ret;
        // util.addEvent(pwd, "Event.ONFOCUS", _self.onFocusEventHandler);
        // util.addEvent(pwd, "Event.ONBLUR", _self.onBlurEventHandler);
        // util.addEvent(pwd, "keyup", _self.keyupEventHandler);
    }
    // _self.showPwd=function(){
    //     var value = pwd.value;
    //     var temp = pwdHtmlTemp;
    //     if(!pwd_isShow){
    //         pwd_isShow = true;
    //         //pwd.setAttribute("type", "text"); //IE8不支援
    //         temp = pwdHtmlTemp.replace("type=\"password\"", "type=\"text\"");
    //         eye_icon.className = "eye_icon";
    //     }else{
    //         pwd_isShow = false;
    //         //pwd.setAttribute("type", "password"); //IE8不支援
    //         temp = pwdHtmlTemp.replace("type=\"text\"", "type=\"password\"");
    //         eye_icon.className = "no_eye_icon";
    //     }
    //     pwd.outerHTML = temp;
    //     //因為是新物件(innerHTML 被取代掉) 所以要重抓DOM 並設定事件
    //     pwd = dom.getElementById("pwd");//密碼
    //     pwd.value = value;
    //     // util.addEvent(pwd, "Event.ONFOCUS", _self.onFocusEventHandler);
    //     // util.addEvent(pwd, "Event.ONBLUR", _self.onBlurEventHandler);
    //     // util.addEvent(pwd, "keyup", _self.keyupEventHandler);
    // }

    //語系顯示
    _self.showLang=function(){
        if(!lang_isShow){
			lang_isShow = true;
            //lang_btn.className = "lg_languageG active";
            sel_lang.style.display = "";
        }else{
            lang_isShow = false;
            //lang_btn.className = "lg_languageG";
            sel_lang.style.display = "none";
        }
    }

    //語系隱藏
    _self.hideLang = function () {
        if (lang_isShow){
            lang_isShow = false;
            sel_lang.style.display = "none";
            lang_btn.blur();
        }
    }

    _self.changePage=function(e, param){
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("GoToPage", param);
    }

    _self.changePageComplete=function(){
        // util.echo("changePageComplete");
    }

    _self.connetToServer=function(){
        util.removeEvent(login_btn, "click");
        var urlParams = "";
        urlParams += "login_layer=co";
        top.login_layer = "co";
        if(selLayer == "B"){
            urlParams ="login_layer=su";
            top.login_layer = "su";
        }else if(selLayer == "C"){
            urlParams ="login_layer=ag";
            top.login_layer = "ag";
        }

        urlParams += "&username="+user.value;
        // urlParams += "&pwd="+pwd.value;
        urlParams += "&pwd="+_mc["pwd"].val;
        if(pwd_safe.value=="") urlParams += "&pwd_safe=none";
        // else urlParams += "&pwd_safe="+pwd_safe.value;
        else urlParams += "&pwd_safe="+_mc["safe"].val;
        urlParams += "&uid="+top.uid;
        urlParams += "&langx="+top.langx;
        urlParams += "&auto=" + top.iovationKey;
        urlParams += "&blackbox=" + top.blackbox;

        urlParams = "p=login_chk&ver="+top.ver+"&"+urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);

        getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.connectComplete=function(data){
        util.addEvent(login_btn, "click", _self.doLogin);
        try{
            var arr_data = new Object();
            try{
                arr_data = JSON.parse(data);
            }catch(e){
                arr_data = (new Function("return " + data))();
            }
            if(util.chkErrorMsg(arr_data,LS_code)) return;
            top.uid = arr_data["uid"];
            top.user_id = arr_data["user_id"];
            top.layer_id = arr_data["layer_id"];
            top.pri_type = arr_data["pri_type"];
            top.user_type = arr_data["user_type"];
            top.user_enable = arr_data["enable"];
            top.enable_pri = arr_data["enable_pri"];
            top.username = arr_data["username"];
            top.layer_username = arr_data["layer_username"];
            top.annCookie = "ag_" + top.login_layer + "_ann" + top.user_id;
            top.pay_type = arr_data["pay_type"];
            if(arr_data["code"]=="102"){
                if(arr_data["status"]=="success"){
                    if (_self.chg_site()) {
                        // 連點有可能會登入後還是有顯示驗證碼框框, 成功登入後多個關掉驗證碼框框的動作
                        _self.close_verification();
                        _self.clearTimer();
                        //top.pwd =pwd.value;
                        //top.pwdSafe = pwd_safe.value;
                        var isChceked = remember.checked;
                        if (isChceked) {
                            document.cookie = "ag_user" + selLayer + "=" + user.value + ";";
                        } else {

                            cookieAry = document.cookie.split(";");
                            var ary = new Array();
                            for (var i = 0; i < cookieAry.length; i++) {
                                var keys = cookieAry[i];
                                var tmp = keys.split("=");
                                if (tmp[0].indexOf("ag_user" + selLayer) != -1) {

                                    var d = new Date();
                                    d.setTime(d.getTime() - 1 * 3600 * 1000);
                                    var _value = tmp[0] + "=;";
                                    _value += 'expires=' + d.toGMTString() + ";";

                                    ary.unshift(_value);
                                } else {
                                    ary.push(keys);
                                }
                            }
                            document.cookie = ary.join(";");

                        }
                        if (arr_data["status_code"] == "4O000") {
                            //正常登入
                            parentClass.dispatchEvent("hideDiv", { "target": "acc_show", "retFun": _self.hideDivComplete });

                        }
                        if (arr_data["status_code"] == "4O001") {
                            //修改密碼(*)
                            parentClass.dispatchEvent("chgPwd", { "target": "acc_show", "retFun": _self.hideDivComplete });
                        }
                        if (arr_data["status_code"] == "4O007") {
                            //超過30(other_set name='chg_pwd_ag')天未修改密碼 要做修改密碼(*)
                            parentClass.dispatchEvent("chgPwd", { "target": "acc_show", "retFun": _self.hideDivComplete });
                        }

                        if (arr_data["status_code"] == "4O002") {
                            if (selLayer == "C") {
                                parentClass.dispatchEvent("chgLoginID", { "target": "acc_show", "retFun": _self.hideDivComplete });
                            } else {
                                //修改安全代碼
                                parentClass.dispatchEvent("chgPwdSafe", { "target": "acc_show", "retFun": _self.hideDivComplete });
                            }
                        }
                    } else {
                        var protocol = dom.location.protocol;
                        window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx;
                    }

                }else{
                    //秀錯誤訊息(*)
                    if(arr_data["status_code"]=="4X004"){
                        user_div.className="lg_input u_icon";
                        pwd_div.className="lg_input p_icon";
                        Safe.className="lg_input s_icon";
                    }else{
                        user_div.className="lg_input u_icon  err_input";
                        pwd_div.className="lg_input p_icon  err_input";
                        Safe.className="lg_input s_icon  err_input";
                    }
                    hr_info1.style.display = "";
                    hr_info1TXT.innerHTML = LS_code.get(arr_data["status_code"]);
                    pwd.value="";
                    pwd_safe.value="";
                    //roland 577.登入頁-當輸入錯誤帳號密碼, 要再輸入密碼時, 頁面會自動填入資料, 原管理端不會(PJP-718)
                    _mc["pwd"].val="";
                    _mc["safe"].val="";

                    isVerifying = false;
                    // 如果是帳密錯誤的話 會要經過驗證才能繼續登入
                    if (arr_data["ver_data"]!=null){
                        if (arr_data["ver_data"]["is_check"]=="Y"){
                            _self.show_verification(arr_data["ver_data"]["Vimage"]);
                        }
                    }else{
                        _self.close_verification();
                    }
                }

            } else if (arr_data["code"] == "201" && arr_data["is_check"]=="Y"){
                // 需要驗證後才可以繼續登入
                _self.show_verification(arr_data["Vimage"]) ;
            }else{
                hr_info1.style.display = "";
                hr_info1TXT.innerHTML = "connect fail !!";
            }
        }catch(e){
            util.echo("[login]something wrong !!");
            util.echo(e);
        }

    }

    _self.close_verification = function () {
        dom.getElementById("acc_show").removeAttribute("style");
        dom.body.removeAttribute("style");
        ver_div.style.display = "none";
        _self.cleanClick() ;
    }

    _self.set_error_msg = function (is_show){
        if(is_show){
            util.classFunc(dom.getElementById("click_Ans").parentElement, "err_input");
            dom.getElementById("ver_msg_show").style.display = "";
        }else{
            util.classFunc(dom.getElementById("click_Ans").parentElement, "err_input", "remove");
            dom.getElementById("ver_msg_show").style.display = "none";
        }
    }

    _self.send_Ver = function () {
        if (isVerifying) return ;
        isVerifying = true;
        _self.set_error_msg(false) ;

        if (top.ans_num != top.ans_length) {
            _self.set_error_msg(true);
            return ;
        }
        var urlParams = "";
        urlParams += "login_layer=co";
        top.login_layer = "co";
        if(selLayer == "B"){
            urlParams ="login_layer=su";
            top.login_layer = "su";
        }else if(selLayer == "C"){
            urlParams ="login_layer=ag";
            top.login_layer = "ag";
        }
        urlParams += "&action=ver_checkresult";
        urlParams += top.ans;

        urlParams = "p=get_verification&"+urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.get_check_ver);

        getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.change_Ver = function () {
        _self.set_error_msg(false);
        var urlParams = "";
        urlParams += "login_layer=co";
        top.login_layer = "co";
        if(selLayer == "B"){
            urlParams ="login_layer=su";
            top.login_layer = "su";
        }else if(selLayer == "C"){
            urlParams ="login_layer=ag";
            top.login_layer = "ag";
        }
        urlParams += "&action=ver_change";

        urlParams = "p=get_verification&"+urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.get_check_ver);

        getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.get_check_ver = function (data) {
        try{
            var arr_data = new Object();
            try{
                arr_data = JSON.parse(data);
            }catch(e){
                arr_data = (new Function("return " + data))();
            }

            if ((arr_data["code"] == "201" || arr_data["code"] == "221") && arr_data["is_check"] == "Y") {
                // 需要驗證後才可以繼續登入
                _self.cleanClick();
                _self.show_verification(arr_data["Vimage"]);
                if (arr_data["code"] == "221")  _self.set_error_msg(true);
                isVerifying = false;
            }else{
                // 登入帳號, 密碼 都有輸入值的話 直接執行登入動作
                if (user.value!="" && pwd.value!=""){
                    _self.doLogin();
                }else{
                    // 回傳不需要驗證的話就關閉驗證框框
                    _self.close_verification() ;
                }
            }
        }catch(e){
            util.echo("[verification]something wrong !!");
            util.echo(e);
        }
    }

    _self.show_verification = function (arr_Img){
        top.ans = "";
        top.ans_length = 0;
        top.ans_num = 0;
        _self.set_error_msg(false);
        util.addEvent(dom.getElementById("close_ver"), "click", _self.close_verification);
        util.addEvent(dom.getElementById("ver_clean"), "click", _self.cleanClick);
        util.addEvent(dom.getElementById("ver_send"), "click", _self.send_Ver);
        util.addEvent(dom.getElementById("ver_change"), "click", _self.change_Ver);
        if (arr_Img["img_data"]!=null){
            _self.setAnsevent(arr_Img) ;
            dom.getElementById("acc_show").setAttribute("style", "overflow-y:hidden;");
            dom.body.setAttribute("style", "position:fixed; overflow-y:hidden;");
            ver_div.style.display = "";
        }
    }

    // 設定答題事件
    _self.setAnsevent = function (arr_Img_data) {
        dom.getElementById("show_verdiv").src = arr_Img_data["img_data"];
        var Ans_map_node = dom.getElementById("show_verdiv").nextElementSibling ;
        Ans_map_node.innerHTML = "";
        top.ans_length = arr_Img_data.arr_Q.length ;
        for(var key in arr_Img_data.arr_Q){
            //新增 area
            var new_obj = dom.createElement("area");
            new_obj.setAttribute("id", arr_Img_data.arr_Q[key]);
            new_obj.setAttribute("shape", "rect");
            new_obj.setAttribute("coords", arr_Img_data.arr_X[key]+","+ arr_Img_data.arr_Y[key]+"," + (arr_Img_data.arr_X[key]+ arr_Img_data.qCodeWidth) +"," + (arr_Img_data.arr_Y[key] + arr_Img_data.qCodeHight));
            new_obj.setAttribute("style", "cursor: pointer;");
            util.addEvent(new_obj, "click", _self.getClick, arr_Img_data.arr_P[key]);
            Ans_map_node.appendChild(new_obj);
        }
    }

    _self.getClick = function (e, show_pic) {
        _self.set_error_msg(false);
        if (top.ans_num >= top.ans_length) return;
        top.ans_num++;
        var show_Ans_span = dom.getElementById("click_Ans");
        var click_id = e.target.id;
        top.ans += "&ver_result[]=" + click_id ;
        var new_obj = dom.createElement("img");
        new_obj.setAttribute("src", show_pic);
        new_obj.setAttribute("width", 30);
        show_Ans_span.appendChild(new_obj);
    }

    _self.cleanClick = function () {
        var show_Ans_span = dom.getElementById("click_Ans");
        show_Ans_span.innerHTML = "";
        top.ans = "";
        top.ans_num = 0;
    }

    _self.chg_site = function() {
        var ret = false;
        var agent = navigator.userAgent;
        var ie = "MSIE";
        var pos = agent.indexOf(ie);
        //Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET4.0C)

        //Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36
        //Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9
        var brows = new Array("Chrome", "Safari", "Firefox", "rv:11", "UCBrowser","opr/");
        //alert(agent)
        if (pos != -1) {
            var tmp_agent = agent.substring(pos + ie.length, agent.length);
            var str = tmp_agent.indexOf(".");
            var version = tmp_agent.substring(0, str);
            if (version * 1 >= 11) ret = true;
        }

        for (var i = 0; i < brows.length; i++) {
            if (agent.indexOf(brows[i]) != -1) {
                ret = true;
                break;
            }
        }
        return ret;
    }

    _self.onError=function(){
        util.addEvent(login_btn, "click", _self.doLogin);
        util.echo("onError");
    }

    _self.hideDivComplete=function(){
        // util.echo("acc_show div hide OK!");
    }

    _self.initLayerFun=function(){
        layerFun["A"] = _self.chgLoginlayer1;
        layerFun["B"] = _self.chgLoginlayer2;
        layerFun["C"] = _self.chgLoginlayer3;
    }

    _self.setLayerFun=function(e, param){
        if(layerFun[param.layer]) layerFun[param.layer]();
    }

    _self.chgLoginlayer1=function(){
        selLayer = "A";
        top.login_layer = "co";
        login_1.className = "on";
        login_2.className = "";
        login_3.className = "";
        Safe.style.display = "";
        //james 20190517 534.登入頁-切換至登3時, 密碼下方的”未設定安全代碼不需輸入“請幫隱藏
        text_msg.style.display = "";
        hr_info.style.display="none";
        hr_info1.style.display="none";
        user_div.className="lg_input u_icon";
        pwd_div.className="lg_input p_icon";
        Safe.className="lg_input s_icon";
        _self.doCookie("ag_user"+selLayer);
    }
    _self.chgLoginlayer2=function(){
        selLayer = "B";
        top.login_layer = "su";
        login_1.className = "";
        login_2.className = "on";
        login_3.className = "";
        Safe.style.display = "";
        //james 20190517 534.登入頁-切換至登3時, 密碼下方的”未設定安全代碼不需輸入“請幫隱藏
        text_msg.style.display = "";
        hr_info.style.display="none";
        hr_info1.style.display="none";
        user_div.className="lg_input u_icon";
        pwd_div.className="lg_input p_icon";
        Safe.className="lg_input s_icon";
        _self.doCookie("ag_user"+selLayer);
    }
    _self.chgLoginlayer3=function(){
        selLayer = "C";
        top.login_layer = "ag";
        login_1.className = "";
        login_2.className = "";
        login_3.className = "on";
        Safe.style.display = "none";
        //james 20190517 534.登入頁-切換至登3時, 密碼下方的”未設定安全代碼不需輸入“請幫隱藏
        text_msg.style.display = "none";
        hr_info.style.display="none";
        hr_info1.style.display="none";
        user_div.className="lg_input u_icon";
        pwd_div.className="lg_input p_icon";
        Safe.className="lg_input s_icon";
        _self.doCookie("ag_user"+selLayer);
    }

    _self.chgLang=function(e, param){

        // util.classFunc(lang_target, ["lg_lan_hk","lg_lan_cn","lg_lan_en"], "remove");
        // lang_target.innerHTML = dom.getElementById("lg_lan_"+param.ls).innerHTML;

        sel_lang.style.display="none";
        lang_btn.blur();

        parentClass.dispatchEvent("chgLangx", {"langx":param.langx,"ls":param.ls,"selLayer":selLayer});
    }

    _self.forgotPwd=function(){
        if (_self.chg_site()) {
            _self.clearTimer();
            parentClass.dispatchEvent("forgotPwd", { "target": "acc_show", "retFun": _self.hideDivComplete });
        } else {
            var protocol = dom.location.protocol;
            window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx;
        }
    }

    _self.show_requirements=function(){
        if (_self.chg_site()) {
            _self.clearTimer();
            parentClass.dispatchEvent("show_requirements", { "target": "acc_show", "retFun": _self.hideDivComplete });
        } else {
            var protocol = dom.location.protocol;
            window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx;
        }
    }

    _self.doCookie=function(keys){
        remember.checked = false;
        for(var i=0; i<cookieAry.length; i++){
            var thisCookie = cookieAry[i].split("=");
            if(thisCookie[0].indexOf(keys) != -1){
                user.value = thisCookie[1];
                remember.checked = true;
                break;
            }
        }
    }


    //========= 廣告部分(*) ==========
    _self.createTimer=function(){
        timerHash["AD"] = new Timer(config_set.get("AD_TIME"));
        timerHash["AD"].setParentclass(_self);
        //timerHash["AD"].dont_clear = true; //設定為不清除timer
		timerHash["AD"].init();
		timerHash["AD"].addEventListener("TimerEvent.TIMER", _self.timerRun);
		//timerHash["AD"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.ADtimerComplete);
    }

    _self.startTimer=function(){
        // util.echo("AD startTimer");
        if(timerHash["AD"]!=null) timerHash["AD"].startTimer();
    }

    _self.stopTimer=function(){
        // util.echo("AD stopTimer");
        if(timerHash["AD"]!=null) timerHash["AD"].stopTimer();
    }

    _self.clearTimer=function(){
        // util.echo("AD clearTimer");
        if(timerHash["AD"]!=null) timerHash["AD"].clearObj();
    }

    _self.touchstart=function(e){
        var start_touch = e.touches[0]; // 第一個接觸點
        touchStartPos = Number(start_touch.pageX);
        firstTouch = true;
    }
    _self.touchmove=function(e){
        var diff = (touchStartPos*1) - (e.touches[0].pageX)*1;
        if(Math.abs(diff)>=10) e.preventDefault();
        touch = e.touches[0]; // 第一個接觸點
        if(timerHash["AD"]!=null) _self.stopTimer();
    }
    _self.touchend=function(e){
        if(!touch) return;
        animate_div.className = "lg_adcomInner lg_adcomGO adcom"+nowAD;
        var x = Number(touch.pageX);
        var y = Number(touch.pageY);
        var diffPos = touchStartPos - x;


        if(firstTouch){
            if(diffPos <= touchPoint*-1){  //左往右拖曳
                nowAD--;
            }
            else if(diffPos >= touchPoint){  //右往左拖曳
                nowAD++;
            }
            //if(nowAD>totalAD)nowAD=1;

            if(nowAD>=totalAD-1)nowAD=totalAD-1;
            if(nowAD<1)nowAD=1;

            animate_div.className = "lg_adcomInner lg_adcomGO adcom"+nowAD;
            _self.chkAD(nowAD);
            _self.startTimer();
        }

        firstTouch = false;
        touch = null;
    }

    _self.timerRun=function(){
        // util.echo("nowAD:"+nowAD+"===totalAD:"+totalAD);
        if(nowAD>totalAD)nowAD=1;
        else if(nowAD<1)nowAD=totalAD;
        nowAD++;
        animate_div.className ="lg_adcomInner lg_adcomGO adcom"+nowAD;
        if(nowAD == totalAD){
            setTimeout(function(){
                nowAD = 1;
                dot1.className = "on";
                dot2.className = "";
                dot3.className = "";
                animate_div.className = "lg_adcomInner adcom1";
                _self.stopTimer();
                _self.startTimer();
            },300);
            _self.chkAD(1);
        }else{
            _self.chkAD(nowAD);
        }
    }

    _self.preAD=function(){
        if(nowAD==1){ //第一張廣告按左鍵，還是在第一頁
            nowAD=1;
        }
        else{
            nowAD--;
        }
        animate_div.className = "lg_adcomInner lg_adcomGO adcom"+nowAD;
        _self.chkAD(nowAD);
        _self.stopTimer();
        _self.startTimer();
    }

    _self.nextAD=function(){
        if(nowAD==totalAD-1){ //最後一張廣告按右鍵，還是在最後一頁
            nowAD=totalAD-1;
        }
        else{
            nowAD++;
        }
        animate_div.className = "lg_adcomInner lg_adcomGO adcom"+nowAD;
        _self.chkAD(nowAD);
        _self.stopTimer();
        _self.startTimer();
    }

    //點選廣告小圓點切換到對應廣告
    _self.chgAD=function(e, param){
        _self.chkAD(param.now);
        nowAD=param.now;
        animate_div.className = "lg_adcomInner lg_adcomGO adcom"+nowAD;
        _self.stopTimer();
        _self.startTimer();
    }

    //檢查廣告小圓點＆左右鍵
    _self.chkAD=function(now){
        //util.echo(now);
        //=====初始化
        preBtn.style.display="";
        nextBtn.style.display="";
        for(var i = 1; i<=totalAD-1; i++){
            dom.getElementById("dot"+i).className = "";
        }
        //==========

        if(now == 1){
            preBtn.style.display="none";
        }else if(now == totalAD-1){
            nextBtn.style.display="none";
        }

        dom.getElementById("dot"+now).className = "on";
    }
    //========= 廣告部分 ==========
}