function index(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "index";
    var classHash = new Object();
    var timerHash = new Object();
    var eventHandler = new Object();
    var pageHash = new Object();
    var total_frame = 5;//bottom,home,order,right_menu,header
    var now_frame = 0;
    var lastTouchEnd = 0;
    var doublecount = 0;
    //var first_load = false;
    
    
    var failCount = new Object();
    var memparamHash = new Object();
    var retryTimer;
    var Serobj;
    var cache_html_sw = true;
    var urgent = false;
    var maintain = false;
    var emergency = false;
    var clean_data_sw = false;
    var firstchgid = false;
    var retryMethod = new Array();
    var retryParams = new Array();
    var retryFun = new Array();
    var retryParentclass = new Array();
    var retryFrame = new Array();

    var bottomFrame = null;
    var headerFrame = null;
    var bodyFrame = null;
    var loginFrame = null;
    var rightFrame = null;
    var alertFrame = null;
    var systemFrame = null;//系統訊息用(網路不穩定)
    var betFrame = null;
    var SerFrame = null;
    var first = null;
    var firstcode = null;
    var announcementFrame = null;
    var doubleLoginip =null;
    var first0height = null;
    var first90height = null;
    var announcementlock = false;
    
    var util = new win.Util(win,dom);
    var config_set = new win.config_set();
    var LS;
    var LS_code;
    var LS_game;

    var CookieManager = new win.CookieManager();
    var login_4pwd_sw = "Y";
    var errorCount = 0;   // 四位密碼錯誤次數
    var errorTwice = false;
    var backcount = 0;
    var fixY = 15;
    var ios = util.isIOS();
    var loginComplete = false;//登入完成true 未完成false
    var ann_sw = true;//公告開關
    var betShowToMini = false;//完整注單到迷你注單狀態
    var otherAry = new Array("today_wagers","history_data","history_view","credit_logs");
    var myGameGtype = new Array("ft","bk","tn","vb","bm","tt","bs","sk","op");
    var isBottom = false;
    var iscloseW ="Y";
    var chkNow = false;

    // ios15判斷用
    var lastHeight = null;
    var isHome = false;

    //右面板相關
    var rightPanelFrame = null;
    var rightPanel_sw = true; //右面板開關
    var width1024,width640;
    var loginSuccess = false;

    var cuTimer = null;

    // 2020-12-03 新增 CDN 載入css
    var cssRetFuncHash = new Object(); // 儲存 retFun & param
    var cssTotalCount = new Object();  // 總載入數量
    var cssFinishCount = new Object(); // 已載入數量
    var nowPage = "";
    var global_protocol = dom.location.protocol.replace(":","");
    var _ = new Object();
    _.timerObj = new Object(); //廣告功能需要
    win._history = new Array();
    top["isback4pwd"] = false;
    top["fullscreen"] = false;
    top["userData"] = new Object();
    top["cmid"] = new Object();
    top["url"] = util.getWebUrl()+"/transform.php";
    top["keep_head"] = ",index,header,bottom,alert_msg,system_msg,order,right_menu,";
    top["popWindow"] = new Object();
    top["isLeagued"] = false;
    top["isDelayed"] = false;
    top["bet_select"] = new Object();
    top["bet_select_more"] = new Object();
    top["browserBack"] = false;
    top["betHash"] = new Object();
    top["bet_ECID"] = new Object();
    top["fastBetXML"] = new Object();
    top["fastBetGameObj"] = new Object();
    top["fastBetHash"] = new Object();
    top["totalBetXML"] = new Object();
    top["totalBetGameObj"] = new Object();
    top["totalBetHash"] = new Object();
    top["totalFinishHash"] = new Object();
    top["bet_viewdata"] = new Object();
    top["ptypeHash"] = new Object();
    top["bet_ior"] = new Array();
    top["betting"] = false;
    top["gameLocked"] = false;
    top["isErrCleanGold"] = false;
    top["closeGame"] = new Object();
    top["total_bet_sw"] = "Y";
    top["choice_gtype"] = "ft";
    top["choice_list_tv_gtype"] = "ALL";
    top["choice_showtype"] = "";
    top["choice_sorttype"] = "L";
    top["choice_rtype"] = "r";
    top["choice_date"] = "all";
    top["choice_leagueTab"] = "";
    top["choice_league"] = new Object();
    top["locked_slip"] = new Object();
    top["openLimit"] = new Object();
    top["lastSportAll"] = new Object();
    top["BackTag"] = "N";
    top["openBets"] = false;
    top["isOrderView"] = true;
    top["dgTid_hash"] = new Object();
    top["dgStatus_hash"] = new Object();
    top["keepGold"] = new Object();
    top["orderinfo"] = new Object();
    top["Requesterrorcount"] = 1;
    top["Requesttime"] = null;
    top["homefirst"]= null;
    top["CookieManager2"] = CookieManager;
    top["RequestRetry"] = null;
    top["local_storage"] = null;
    top["bet_mini"] = false;//pc才有的迷你完整注單
    top["isSameGame"] = new Array();
    top["pageTS"] = new Object();
    top["specialGame"] = new Object();//特殊賽事用
    top["myGame_sw"]= null;

    top["pageTS"]["rightTV"] = "";//右面板TV用

    top["betholdTid_hash"] = new Object();
    top["betholdstatus_hash"] = new Object();

    top["requestFailedCount"] = 0;
    top["requestHash"] = new Object();
    top["requestFailedHash"] = new Object();

    //特殊賽事初始值
    top["specialGame"]["SW"] = true;//特殊賽事開關
    top["specialGame"]["RB"] = "0";
    top["specialGame"]["FTFU"] = "0";
    top["specialGame"]["FS"] = "0";
    top["specialGame"]["Fantasy"] = "0";
    top["specialGame"]["isFantasy"] = false;
    top["specialGame"]["title"] = "";

    //右面板相關top變數
    top["rightECID"] = "";
    top["rightNowPlay"] = "";
    top["resizePage"] = "";
    top["hasChgGtype"] = false;
    top["resizeMTSub"] = "";
    top["rightAllClosed"] = false;
    top["collapseClick"] = true;
    top["nowWidth"] = "less1024";

    //我的賽事
    top["myGameHash"] = new Object();
    top["myGameVer"] = "_211228";
    _self.init=function(){
        //alert("first_width:"+getView().viewportwidth);
        // if(history.state) _CHDomain = history.state; // 重整不登出
		
        // 2020-12-07 新增CDN載入時，除了首頁之外需要使用到對應的 protocol
        _self.format_myGame();
        CookieManager.set("protocolstr", global_protocol,1);
        if(checkDomainIsM=="Y"){
            _self.goDomainRemoveM(dom.location.host);//如果domain為m.XXXX且不是IP 需轉導
            return;
        }
        width1024=(getView().viewportwidth >= 1024)?true:false;
        width640=(getView().viewportwidth >= 640)?true:false;

        if(top.sub_doubleLogin=="Y")CookieManager.set("doubleLogin","double_"+new Date().getTime());

        if(top.needsTrans && !history.state){
            var master_IP = util.getProtocal()+"//"+top.needsTrans;
            //util.topGoToUrl(master_IP);
            //2020-01-07 Q2-(1)uat-強制踢出-重複登入相同帳號，踢出時不會有強制踢出公告
            //如果子取到doubleLogin，子轉主的時候主也要記住doubleLogin，才會秀出踢出訊息
            if(CookieManager.get("doubleLogin")){
                var sub_doubleLogin = "Y";
                //轉到主domain前,要先刪除 子domain的cookie
                CookieManager.del("doubleLogin");
                util.topGoToUrl(master_IP,{"sub_doubleLogin":sub_doubleLogin});
            }else{
                util.topGoToUrl(master_IP);
            }
            return;
        }
    
        //一進來就取 如果在近來這頁之前是開著鍵盤會取錯高度
        setTimeout(_self.firsttack,500)

        win.addEventListener("message", _self.onMessage, false);
        _self.loadFile();

        config_set.init();
        // ios 15 檢查
        _self.checkIos15();
        _self.clearAllOpenWindow();
        _self.chg_langx(top.ls);
        //_self.lockScaled();
        if (win.addEventListener) win.addEventListener("popstate", _self.popstate);
        if (win.addEventListener) win.addEventListener("orientationchange", _self.orientation);
        if (win.addEventListener) win.addEventListener("resize", orientationblur);
        //if (win.addEventListener) win.addEventListener("resize", _self.orientationblur);
        dom.addEventListener("fullscreenchange", _self.changeFullScreen);
        dom.addEventListener("webkitfullscreenchange", _self.changeFullScreen);
        dom.addEventListener("mozfullscreenchange", _self.changeFullScreen);
                    
        _self.addEventListener("videoOnClick", _self.videoOnClick);
        _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
        _self.addEventListener("backPage", _self.backPage);
        _self.addEventListener("goToPage", _self.goToPageEvent);
        _self.addEventListener("showLoading", _self.showLoading);
        _self.addEventListener("loginFullLoading", _self.loginFullLoading);
        _self.addEventListener("messagechk", _self.messagechk);
        _self.addEventListener("resetmsg", _self.resetmsg);
        _self.addEventListener("showchg_id", _self.showchg_id);
        _self.addEventListener("login_help", _self.login_help);
        _self.addEventListener("show_prepasscode", _self.show_prepasscode);
        _self.addEventListener("show_back_login", _self.show_back_login);
        _self.addEventListener("show_back_4pwd", _self.show_back_4pwd);
        _self.addEventListener("showchg_pwd", _self.showchg_pwd);
        _self.addEventListener("backToTop", _self.backToTop);
        _self.addEventListener("show_forgotEvent", _self.show_forgotEvent);
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("hideAlertMsg", _self.hideAlertMsg);
        _self.addEventListener("hideSystemMsg", _self.hideSystemMsg);
        _self.addEventListener("showBetSlip", _self.showBetSlip);
        _self.addEventListener("initSelect", _self.initSelect);
        _self.addEventListener("setSelect", _self.setSelect);
        _self.addEventListener("deleteSelect", _self.deleteSelect);
        _self.addEventListener("delBetslip", _self.delBetslip);
        _self.addEventListener("setBodyScrollTop", _self.setBodyScrollTop);
        _self.addEventListener("browser_rule", _self.browser_rule);
        _self.addEventListener("createSerTimer", _self.createSerTimer);
        _self.addEventListener("clearSerTimer", _self.clearSerTimer);
        _self.addEventListener("stopTimer", _self.stopSerTimer);
        _self.addEventListener("clearTimer", _self.clearSerTimer);
        _self.addEventListener("setBetSelectCount", _self.setBetSelectCount);
        _self.addEventListener("setBetSelectIor", _self.setBetSelectIor);
        _self.addEventListener("Chg_odds", _self.Chg_odds);
        _self.addEventListener("chgHeadCss", _self.chgHeadCss);
        _self.addEventListener("chgBottomCss", _self.chgBottomCss);
        _self.addEventListener("SetConfirmExit", _self.SetConfirmExit);
        _self.addEventListener("closeConfirmExit", _self.closeConfirmExit);
        _self.addEventListener("membercashchk", _self.membercashchk);
        _self.addEventListener("SerrefreshPage", _self.SerrefreshPage);
        _self.addEventListener("clearAllOpenWindow", _self.clearAllOpenWindow);
        _self.addEventListener("loginSuccess", _self.loginSuccess);
        _self.addEventListener("removebodylock", _self.removebodylock);
        _self.addEventListener("addbodylock", _self.addbodylock);
        _self.addEventListener("chkscroll", _self.chkscroll);
        _self.addEventListener("setScrollTop", _self.setScrollTop);
        _self.addEventListener("scrollsetTop", _self.scrollsetTop);
        _self.addEventListener("checkCount", _self.checkCount);
        _self.addEventListener("setBottomon", _self.setBottomon);
        _self.addEventListener("langx_beforelogin", _self.langx_beforelogin);
        _self.addEventListener("createDomTimer", _self.createDomTimer);
        _self.addEventListener("clearDomTimer", _self.clearDomTimer);
        _self.addEventListener("reloadCredit", _self.reloadCredit);
        _self.addEventListener("betfinsih_update", _self.betfinsih_update);
        _self.addEventListener("closePopMT", _self.closePopMT);
        _self.addEventListener("reCalcBetslip", _self.reCalcBetslip);
        _self.addEventListener("doubleLoginchk", _self.doubleLoginchk);
        _self.addEventListener("private", _self.private);
        _self.addEventListener("scrollClose", _self.scrollClose);
        _self.addEventListener("annlock", _self.annlock);
        _self.addEventListener("clearBets", _self.clearBets);
        _self.addEventListener("retryLoop", _self.retryLoop);
        _self.addEventListener("retryLastfail", _self.retryLastfail);
        _self.addEventListener("login4pwdRetryComplete", _self.login4pwdRetryComplete);
        _self.addEventListener("retryComplete", _self.retryComplete);
        _self.addEventListener("callApp", _self.callApp);
        _self.addEventListener("mini_bet", _self.mini_bet);//右面板聲明監聽
        _self.addEventListener("showSpecialTitle", _self.showSpecialTitle);
        _self.addEventListener("rollBottom", _self.rollBottom);
        _self.addEventListener("setBottomTodayWagers", _self.setBottomTodayWagers);
        _self.addEventListener("auto_update", _self.auto_update);
        _self.addEventListener("systemreq", _self.systemreq);
        _self.addEventListener("noCloseWindow", _self.noCloseWindow);
        _self.addEventListener("closePCResult", _self.closePCResult);
        _self.addEventListener("addMyEventAnimation", _self.addMyEventAnimation);
        _self.addEventListener("showGreenBtnProc", _self.showGreenBtnProc);
        _self.addEventListener("goToMygame", _self.goToMygame);
        _self.addEventListener("chkGame", _self.chkGame);
        _self.addEventListener("initMyGame", _self.initMyGame);

        //==== 右面板 Fun ====
        _self.addEventListener("loadRightScore", _self.loadRightScore);//載入右面板計分板 & TV/MT init
        _self.addEventListener("resetRightTV", _self.resetRightTV);//重置右面板TV
        _self.addEventListener("playRightTV", _self.playRightTV);//播放右面板TV
        _self.addEventListener("resizeMTEvent", _self.resizeMTEvent);
        _self.addEventListener("setRightTVDefaultPlay", _self.setRightTVDefaultPlay);//設定右面板TV預設畫面
        _self.addEventListener("setRightVisible", _self.setRightVisible);//右面板計分板&TV框架顯示與否
        _self.addEventListener("checkRightLive", _self.checkRightLive);//檢查右面板TV狀態
        _self.addEventListener("parseRightScoreBoard", _self.parseRightScoreBoard);//parse右面板計分板
        _self.addEventListener("chkTvPlaying", _self.chkTvPlaying);//2020-11-06 TV是否播放
        _self.addEventListener("rightResizeEvent", _self.rightResizeEvent);//2020-11-06 TV是否播放
        _self.addEventListener("setRightLoading", _self.setRightLoading);
        _self.addEventListener("resizeRightLive", _self.resizeRightLive); 
        _self.addEventListener("noGameCheckLive", _self.noGameCheckLive);
        _self.addEventListener("showBigRightLoading", _self.showBigRightLoading);//右面板大Loading
        _self.addEventListener("setBodyShowClass", _self.setBodyShowClass);
        _self.addEventListener("goToSpecialPage", _self.goToSpecialPage);//去特殊賽事頁面
        _self.addEventListener("setRightTimer", _self.setRightTimer);
        _self.addEventListener("createLS_game", _self.createLS_game);
        
        

        top["local_storage"] = _self.getLocalStorage();
        if(top["local_storage"] == "initFail"){
            document.getElementById("acc_show").classList.add("pass_outside");
            _self.private();
            return;
        }
   
        if(top.mobile == "Y"){ //2020-10-08 2610.我的帳戶-語言設定-原本順序為 英文/繁中/簡中，順序請幫改成簡中/繁中/英文 (CRM-456) (需求)
            var main = dom.getElementById("main");
            main.classList.add("mobile");
            if(ios){
                util.addEvent(dom.body, "touchend", _self.ios_blur);
                util.addClass(main, "main_ios");
            }
        }

        _self.clearSerTimer();
        _self.createSerTimer();
        _self.createNetTimer();
        _self.createMemMessageTimer();
        util.setParentclass(_self);

        if(_CHDomain.uid != ""&&_CHDomain.uid !=null&&_CHDomain.uid !=undefined)//換分流轉導過來
		{   
            _self.setLoadingVisible(true);
            
            for(var key in _CHDomain)
			{
				top["userData"][key] = _CHDomain[key];
            }
            if(top["userData"].domain=="")_self.CheckDomain();//PC轉導過來需檢查分流
            firstcode = true;
            top["login_4pwd_sw"] = "Y";
            top.param = "uid="+top["userData"].uid+"&ver="+top.ver+"&langx="+top.langx;

            _self.goToPage("alert_show", "alert_msg", function(){
                try{
                    alertFrame = new win.alert_msg(win,dom);
                    alertFrame.setParentclass(_self);
                    alertFrame.init();
                }catch(e){
                    util.err("[alert_msg]", e);
                }
            },{});

            _self.goToPage("system_show", "system_msg", function(){//系統訊息用(網路不穩定)
                try{
                    systemFrame = new win.system_msg(win,dom);
                    systemFrame.setParentclass(_self);
                    systemFrame.init();
                }catch(e){
                    util.err("[system_msg]", e);
                }
            },{});

            if(top["userData"].msg=="104"){
                top["userData"].msg = "already_104";
                top["memSet"] = new Object();
                _self.showchg_id();
            }else if(top["userData"].msg=="106"){
                top["userData"].msg = "already_106";
                top["memSet"] = new Object();
                _self.showchg_pwd();
            }else{
                _self.goToPage("acc_show", "login", function(){
                    loginFrame = new win.login(win,dom,null);
                    loginFrame.setParentclass(_self);
                    _self.reloed_memset(_self.check_Complete);
                    _self.SerrefreshPage();
                },{});
            }

            _self.goToPage("icon_all", "icon_all", function(){},{});
			return;
		}else{
            _self.SerrefreshPage(true);
        }
    }

    _self.format_myGame=function(){
        top["myGameHash"]["ft"] = new Object();
        top["myGameHash"]["bk"] = new Object();
        top["myGameHash"]["bs"] = new Object();
        top["myGameHash"]["bm"] = new Object();
        top["myGameHash"]["op"] = new Object();
        top["myGameHash"]["sk"] = new Object();
        top["myGameHash"]["tt"] = new Object();
        top["myGameHash"]["tn"] = new Object();
        top["myGameHash"]["vb"] = new Object();
    }

    _self.firsttack = function(){
        first0height = win.innerHeight;
    }

    _self.goToSpecialPage = function(par){
        top.choice_showtype = "live";
        top.choice_rtype = "rb";
        headerFrame.getSpecCount(par);
    }

    _self.reloed_memset =function(completeFun){
         //重撈memset
         var action = "check";
         var urlParams= "";
         urlParams += "uid="+top["userData"].uid;
         urlParams += "&langx="+top.langx;
         urlParams += "&action="+action;

         urlParams = "p=memSet&ver="+top.ver+"&"+urlParams;
         var getHTML = new HttpRequest();
         getHTML.addEventListener("LoadComplete", completeFun);
         getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.check_Complete = function(msg){
        var errorMsg = util.showConnectMsg(msg);
        if(util.alertConnectMsg(errorMsg))  return;
        
        loginFrame.check_Complete(msg);
    }

    _self.orientation = function () {
        _self.mobileandblue();
    }

    _self.checkIos15 = function(){
        _self.checkHeight();
        //if(_self.is_ios15_safari()) util.addClass(dom.body,"ios15");
        if(_self.is_ios15_safari()) util.addClass(dom.getElementsByTagName("html")[0],"ios15");
    }

    _self.checkHeight = function(){
        if(!_self.is_ios15_safari()) return;
		
        var ori = win.Math.abs(win.orientation);
        if(ori==0){
            var goInnerHeight = false;
            var defined_h = config_set.get("IOS15");
            var bodyObj = dom.documentElement || dom.body;
            var c_height = bodyObj.clientHeight;
            switch(c_height){
                case defined_h["PHONE_12+"]["TOP_HEIGHT"]:
                case defined_h["PHONE_12+_MINI"]["TOP_HEIGHT"]:
                case defined_h["PHONE_12+_PRO_MAX"]["TOP_HEIGHT"]:
                case defined_h["PHONE_X+"]["TOP_HEIGHT"]:    
                case defined_h["PHONE_X+_PRO"]["TOP_HEIGHT"]:    
                case defined_h["PHONE_X+_PRO_MAX"]["TOP_HEIGHT"]: 
                    goInnerHeight = true;
                    break;
                case defined_h["PHONE_12+"]["BTM_HEIGHT"]:
                case defined_h["PHONE_12+_MINI"]["BTM_HEIGHT"]:
                case defined_h["PHONE_12+_PRO_MAX"]["BTM_HEIGHT"]:
                case defined_h["PHONE_X+"]["BTM_HEIGHT"]:    
                case defined_h["PHONE_X+_PRO"]["BTM_HEIGHT"]:    
                case defined_h["PHONE_X+_PRO_MAX"]["BTM_HEIGHT"]: 
                    goInnerHeight = false;
                    break;    
            }
            if(c_height < defined_h["PHONE_6+"]["HEIGHT"] || c_height==defined_h["PHONE_6+_PLUS"]["HEIGHT"]){
                goInnerHeight = false;
                isHome = true;
            }
            var absHeight = 0;
            if(lastHeight!=null){
                absHeight = win.Math.abs(lastHeight - c_height);
                goInnerHeight = (absHeight!=1);
            }
            console.log("[c_height]="+c_height+"[absHeight]="+absHeight+" >>>>> goInnerHeight="+goInnerHeight);
            if(!isHome && goInnerHeight){
                _self.chgHeight(win.innerHeight+"px");
            }else{
                _self.chgHeight("100vh");
            }
        }else if(ori==90){
            setTimeout(_self.chgHeight, 500, win.innerHeight+"px");
        }
        lastHeight = win.innerHeight;
    }

    _self.is_ios15_safari = function(){
        var agent = win.navigator.userAgent;
		if(agent.indexOf("iPhone OS 15_0")!=-1){
            if(agent.indexOf("CriOS")==-1 && agent.indexOf("FxiOS")==-1 && agent.indexOf("QQ")==-1){
                    return true;	
            }
		}
		return false;
    }
    
    _self.chgHeight = function(h){
        var obj = dom.getElementsByTagName("html")[0];
        if(obj){
            obj.style.height = h;
            obj.style.overflow = "hidden";
        }
    }

    _self.mobileandblue = function () {
        if(top.mobile == "Y"){
            var tmpOrientation = win.Math.abs(win.orientation);
            var tmpAgent = window.navigator.userAgent;
            if(tmpAgent.indexOf("iPad")!=-1){
                if(tmpOrientation==90){ //1024以上
                    top.nowWidth = "over1024";
                    _self.removebodylock();
                    // console.log("[index][resize]width>1024");
                    if(rightPanelFrame==null && loginSuccess){
                        _self.showBigRightLoading(true);        
                        _self.goToPage("right_show", "right_panel", function(){
                            rightPanelFrame = new win.right_panel(win,dom,null);
                            rightPanelFrame.setParentclass(_self);
                            rightPanelFrame.init();
                            //rightPanelFrame.loadLS();
                            _self.showBigRightLoading(false);
                            if(top.resizePage=="game_list"||top.resizePage=="game_more"){
                                rightPanelFrame.setRightLoading(true);
                                rightPanelFrame.loadRightScore({"scFun":bodyFrame.resizeEvent});
                                rightPanelFrame.showRightMsg(true);//大於1024
                            }
                            else if(top.resizePage=="other"&&top.rightECID!=""){
                                rightPanelFrame.setRightLoading(true);
                                rightPanelFrame.loadRightScore({"scFun":rightPanelFrame.getData});
                            }
                        },{});
                    }else if(rightPanelFrame!=null){
                        
                        var hasLoad = rightPanelFrame.chkRightScore();
                        //337.
                        //if((top.resizePage=="game_list"||top.resizePage=="game_more")&&top.choice_showtype=="live"){
                        if(top.resizePage=="game_list"||top.resizePage=="game_more"){    
                            rightPanelFrame.setRightLoading(true);
                            rightPanelFrame.loadRightScore({"scFun":bodyFrame.resizeEvent});
                        }
                        // else if((top.resizePage=="game_list"||top.resizePage=="game_more")&&top.choice_showtype!="live"){
                        //     rightPanelFrame.setRightLoading(true);
                        //     bodyFrame.resizeEvent(width1024);
                        // }
                        
                        if(!hasLoad){
                            if(top.resizePage=="other"&&top.rightECID!=""){
                                rightPanelFrame.setRightLoading(true);
                                rightPanelFrame.loadRightScore({"scFun":rightPanelFrame.getData});
				                rightPanelFrame.startTimer();
                            } 
                        }else{
                            if(top.resizePage=="other"&&top.rightECID!=""){
                                rightPanelFrame.setRightLoading(true);
                                if(rightPanelFrame.getTVPlaying())rightPanelFrame.loadRightScore({"scFun":rightPanelFrame.getData, "scParam":true});
                                else rightPanelFrame.loadRightScore({"scFun":rightPanelFrame.getData});
				                rightPanelFrame.startTimer();
                            }
                        }
                        rightPanelFrame.showRightMsg(true);//大於1024
                    }
                    var nowPage = _self.getNowPage();
                    if(util.in_array(nowPage,otherAry)){
                        _self.showBackTopBtn();
                    }
                    if(util.countSize(top.bet_select) > 0 && !top.openBets){
                        top.betMode = "total"; 
                        _self.showBetSlip({"isShow":true,"minimize":true});                        
                    }  
                }else{ //1024以下
                    top.nowWidth = "less1024";
                    // console.log("[index][resize]width<1024");
                    if(top.resizePage=="game_list" || top.resizePage=="game_more"){
                        bodyFrame.resizeEvent(width1024);
                    }
                    else if(top.resizePage=="other"){
			            rightPanelFrame.stopTimer();
                        if(rightPanelFrame.chkTvPlaying()){
                            rightPanelFrame.setTVPlaying(true);
                            _self.resetRightTV();
                        }
                        var nowPage = _self.getNowPage();
                        if(util.in_array(nowPage,otherAry)){
                            _self.showBackTopBtn();
                        }
                    }
                    if(rightPanelFrame)rightPanelFrame.showRightMsg(false);//小於1024
                    if(top.openBets){//有開啟著單狀態
                        _self.hideAlertMsg({"use":"noPopMainClear"});//清除主面板聲明
                    }
                    if(top.bet_mini){
                        _self.showBetSlip({"isShow":false});
                    }
                }
            }


            var mainObj = dom.getElementById("main");
            var oldmainObj = mainObj.className;
            var lls = top.ls;
            if(lls == "us")lls = "en";
            if(!ios){
                dom.activeElement.blur();
                var orientationTurn = win.Math.abs(win.orientation);
                if(dom.activeElement.tagName != "INPUT"&&orientationTurn == 90){
                    if(!first90height)setTimeout(_self.first90,500)
                }
                mainObj.className = "main_height"+" "+lls.toUpperCase()+" mobile"; //2020-10-08 2610.補上 mobile
            }else{
                mainObj.className = "main_height"+" "+lls.toUpperCase()+" main_ios mobile"; //2020-10-08 2610.補上 mobile
            }
            setTimeout(_self.classchang,500,mainObj,oldmainObj);
        }
    }

    _self.first90 =function(){
        first90height = win.innerHeight;
    }

    _self.classchang = function(mainObj,oldmainObj){
        mainObj.className = oldmainObj;
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
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

    _self.showLogin=function(errMsg){
        _self.setLoadingVisible(true);
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";
        dom.getElementById("sysreq_show").style.display = "none";


        _self.goToPage("alert_show", "alert_msg", function(){
            try{
                alertFrame = new win.alert_msg(win,dom);
                alertFrame.setParentclass(_self);
                alertFrame.init();
                _self.chkDoubleLogin();
            }catch(e){
                util.err("[alert_msg]", e);
            }
        },{});

        _self.goToPage("system_show", "system_msg", function(){//系統訊息用(網路不穩定)
            try{
                systemFrame = new win.system_msg(win,dom);
                systemFrame.setParentclass(_self);
                systemFrame.init();
            }catch(e){
                util.err("[system_msg]", e);
            }
        },{});

        _self.goToPage("acc_show", "login", function(){
            loginFrame = new win.login(win,dom,null);
            loginFrame.setParentclass(_self);
            loginFrame.init();
            if(errMsg)loginFrame.system_error(errMsg);
            dom.getElementById("acc_show").style.display = "";
            _self.chkDoubleLogin();
        },{});

        _self.goToPage("icon_all", "icon_all", function(){},{});
    }

    // 2020-09-07 app統一導入到網頁版登入
    _self.callApp = function(par){
        var msg = par.msg;
        try {
            Android.callFunction(msg);
        }catch(e){
            try {
                window.webkit.messageHandlers.systemCall.postMessage(msg);
            }catch(e){	      	
                // iframe_src(document.getElementById("systemCall"), "systemCall.html?"+msg);
            }	      
        }
    }

    _self.showchg_id=function(){ //首次登入改ID
        _self.clearSerTimer();
        //top.param只會有uid.ver.langx這三個 2019-10-14 bd
        //top.param = "uid="+top["userData"].uid+"&ver="+top.ver+"&langx="+top.langx;
        _self.setLoadingVisible(true);
        firstchgid = true;
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";
        firstcode = false;
        _self.goToPage("chgAcc_show", "chg_id", function(){
            loginFrame = new win.chg_id(win,dom,null);
            loginFrame.setParentclass(_self);
            loginFrame.init();

            dom.getElementById("chgAcc_show").style.display = "";
        },{});
        
    }

    _self.login_help=function(){ //首次登入改ID
        _self.clearSerTimer();
        _self.setLoadingVisible(true);
        
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";

        _self.goToPage("chgAcc_show", "first_login_help", function(){
            loginFrame = new win.first_login_help(win,dom,null);
            loginFrame.setParentclass(_self);
            loginFrame.init();

            dom.getElementById("chgAcc_show").style.display = "";
        },{});
        
    }

    _self.show_prepasscode=function(){ //簡易登入
        _self.setLoadingVisible(true);
        dom.getElementById("chgAcc_show").style.display = "none";
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("sysreq_show").style.display = "none";

        _self.goToPage("alert_show", "alert_msg", function(){
            try{
                alertFrame = new win.alert_msg(win,dom);
                alertFrame.setParentclass(_self);
                alertFrame.init();
                _self.chkDoubleLogin();
            }catch(e){
                util.err("[alert_msg]", e);
            }
        },{});

        _self.goToPage("system_show", "system_msg", function(){//系統訊息用(網路不穩定)
            try{
                systemFrame = new win.system_msg(win,dom);
                systemFrame.setParentclass(_self);
                systemFrame.init();
            }catch(e){
                util.err("[system_msg]", e);
            }
        },{});

        _self.goToPage("acc_show", "prepasscode", function(){
            loginFrame = new win.prepasscode(win,dom,null);
            loginFrame.setParentclass(_self);
            loginFrame.init();
            dom.getElementById("acc_show").style.display = "";
            _self.chkDoubleLogin();
        },{});

        _self.goToPage("icon_all", "icon_all", function(){},{});
        
    }

    _self.chkDoubleLogin = function(){
        doublecount++;
        if(doublecount >= 2){
            if(CookieManager.get("doubleLogin")){
                //設定秒數是因為有些手機cookie刪不掉,後來value存timestamp跟現在時間做判斷,太久就不讓他秀了 馬來太慢所以3秒改10秒
                var usedTime = _self.getDoubleLoginTs();
                if(usedTime < 10) _self.doubleLoginchk();//2020-01-07 Q2-(1)uat <3 改 <10
            }else{
                _self.setLoadingVisible(false);
            }
            CookieManager.del("doubleLogin");
        }
    }

    _self.doubleLoginchk=function(){
        _self.showAlertMsg({"target":"alert_kick", "msg":"","retFun":_self.cleardoubleLogincookie});
        _self.addbodylock();
    }

    _self.show_back_login=function(param){ //回登入畫面
        var errMsg = "";
        var acc_show = dom.getElementById("acc_show");    
        util.removeClass(acc_show, "pass_outside");
        if(param)errMsg = param.errMsg;
        if(errMsg != "")_self.showLogin(errMsg);
        else _self.showLogin();
    }

    _self.setBetSelectCount = function(_count){
        bottomFrame.setBetSelectCount(_count);
    }

    _self.setBetSelectIor = function(_ior){
        bottomFrame.setBetSelectIor(_ior);
    }

    _self.setBottomon = function(){
        headerFrame.getTodayWagersCount();
    }


    _self.loginSuccess=function(){
        loginSuccess = true;
        CookieManager.del("choice_lea_"+top['userData'].mid);

        _self.initMyGame();

        if(top["userData"].go_to_new_site=="Y" && top["userData"].msg!="already_104"){
            var abox4pwd_notshow = {};
            var inputUID = top["userData"].passwd_safe.toLowerCase().trim();
            var cookieUID = (CookieManager.get("PID"))?CookieManager.get("UID").toLowerCase().trim():"";

            if(CookieManager.get("box4pwd_notshow_"+top['userData'].mid) != null){  
                 abox4pwd_notshow = CookieManager.get("box4pwd_notshow_"+top['userData'].mid).split("_");
            }
           
            if((!top["memSet"].passcode && CookieManager.get("PID")) || (!top["memSet"].passcode && !CookieManager.get("PID")) || !top["memSet"].passcode || top["memSet"].passcode=="[del]" || top["memSet"].passcode=="[del1]" ){
                top['userData'].four_pwd = "new";
                top['userData'].abox4pwd_notshow = abox4pwd_notshow[1];
            }else if((top["memSet"].passcode && !CookieManager.get("PID")) || (CookieManager.get("UID") != top["userData"].passwd_safe || !CookieManager.get("UID"))){
                top['userData'].four_pwd = "second";   
                top['userData'].abox4pwd_notshow = abox4pwd_notshow[1];
            }else if(top["errorTwice"] && cookieUID==inputUID){
                top['userData'].four_pwd = "errorTwice";
            }
            _CHDomain = {};
            top["userData"].msg = "";
            top["userData"].go_to_new_site = "N";
        }
        
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("home_show").setAttribute("style", "visibility: hidden;");
        dom.getElementById("home_show").classList.add("outside");
        dom.getElementById("chgAcc_show").style.display = "none";
        _self.goToPage("bottom_show", "bottom", function(){
            bottomFrame = new win.bottom(win,dom,null);
            bottomFrame.setParentclass(_self);
            bottomFrame.init();
        },{});
        _self.goToPage("betslip_show", "order", function(){
            betFrame = new win.order(win,dom,null);
            betFrame.setParentclass(_self);
            betFrame.init();
        },{});

        _self.goToPage("header_show", "header", function(){
            headerFrame = new win.header(win,dom,null);
            headerFrame.setParentclass(_self);
            headerFrame.init();

            _self.goToPage("myAcc_show", "right_menu", function(){
                rightFrame = new win.right_menu(win,dom,null);
                rightFrame.setParentclass(_self);
                rightFrame.init();
                headerFrame.setRightPanel();
            },{});
        },{});
        if(getView().viewportwidth >= 1024){ //大畫面才載右邊menu跟右面板
            top.nowWidth = "over1024";
            _self.showBigRightLoading(true);
            _self.goToPage("right_show", "right_panel", function(){
                rightPanelFrame = new win.right_panel(win,dom,null);
                rightPanelFrame.setParentclass(_self);
                rightPanelFrame.init();
                _self.showBigRightLoading(false);
            },{});
        }
         _self.bodyGoToPage({"page":"home"});
    }
    _self.chkFourPwdProc = function(){
        document.getElementById("acc_show").classList.remove("pass_outside");
        if( top['userData'].four_pwd!="" && (_CHDomain.uid == ""||_CHDomain.uid ==null||_CHDomain.uid ==undefined) ){
           
            if(!maintain && !emergency && !urgent){
                dom.getElementById("maintain_show").style.display = "none";
                if( top['userData'].four_pwd == "new" && !firstchgid ){
                    if(top['userData'].abox4pwd_notshow != "Y"){
                        _self.scrollsetTop();
                        _self.setLoadingVisible(false);
                        top["RequestRetry"] = true;
                        _self.showAlertMsg({"target":"C_alert_confirm", "msg":LS.get("4pwd_new"),"confirm":"Y","retFun":_self.newalertMsg});
                    }else{//打勾不要再顯示
                        _self.checkbox_noshow();
                        _self.CheckDomain(_self.Domainon);
                    }
                }else if(top['userData'].four_pwd == "second"){
                    _self.scrollsetTop();
                    _self.setLoadingVisible(false);
                    top["RequestRetry"] = true;
                    _self.showAlertMsg({"target":"C_alert_confirm", "msg":LS.get("4pwd_second"),"confirm":"Y","retFun":_self.alertMsg});
                    document.getElementById("C_popup_checkbox").style.display="none";
                }else if(top['userData'].four_pwd == "errorTwice"){
                    _self.CheckDomain();
                }else{//已使用4位數密碼登入
                    dom.getElementById("maintain_show").style.display = "";
                    _self.CheckDomain();
                }
            }
        }else{
            _self.createDomTimer();
            dom.getElementById("maintain_show").style.display = "";
            if(top["userData"].newalertMsg == "Y"){
                setTimeout(_self.passcode,2000);
                //2077.清資料時登入後詢問是否要設置簡易密碼 點擊“是” 沒有帶到簡易密碼畫面
                _self.IsGamechk("passcode");
            }else{
                _self.checkCount();//切換分流/語系跑
            }
            
        }
        _self.messagechk();
        _self.createMesTimer();
        _self.createMemTimer();
        _self.createVerTimer();//2020-10-13 新增一個timer(60秒)定期更新top.ver的值(版本號)
        _self.createMemOnlineTimer();
        //清資料關閉且我的賽事開關打開的情況 登入才需要跑我的賽事檢查 並 設定一個timer
        if(top.myGame_sw && clean_data_sw != "Y"){
            chkNow = true;
            _self.showMyGameProc(true,clean_data_sw,chkNow,"first_login");
        }
    }

    //pc專用迷你注單,控制收下完整注單的header
    _self.mini_bet = function(param){
            //console.log("===========mini_bet===========");
            var bet_size = util.countSize(top["bet_select"]);
            var bet_totalSize = util.countSize(top["totalBetHash"]);
            var minimize = (param.minimize)?true:false;
            var rightMsg_sw = (param.rightMsgStatus)?true:false;

            if(rightMsg_sw){
                if(top["isOrderView"]) betFrame.addTotal(null, {"xmlnode":top["fastBetXML"], "gameObj":top["fastBetGameObj"], "betData":top["fastBetHash"], "rightMsg_sw":rightMsg_sw});
                else betFrame.closeBet(true);//點右面板聲明 下注收據需收掉
                return;
            }
            //console.log("[bet_size]=>",bet_size,",[bet_totalSize]=>",bet_totalSize,",[minimize]=>",minimize,",[rightMsg_sw]=>",rightMsg_sw);
            var miniOrientation = win.Math.abs(win.orientation);
            //小畫面拉大如果有注單下收,要直接變迷你注單
            if(minimize){
                //console.log("特殊的迷你注單狀態");
                top.bet_mini = true;
                util.addClass(param.betDiv, "mini");
                util.removeClass(param.betDiv, "minimize");
                util.removeClass(param.betDiv, "on");
                util.removeClass(param.betDiv, "off");
            }
            else if((bet_size == 0 && bet_totalSize == 0) || (top.openBets && !rightMsg_sw)){
                top.bet_mini = false;
                util.removeClass(param.betDiv, "mini");
            }
            else if((!top.openBets || rightMsg_sw) && bet_size != 0 && (getView().viewportwidth >= 1024 || miniOrientation==90)){//rightMsgStatus 判斷 先開注單再開聲明,注單變成mini注單
                top.bet_mini = true;
                util.addClass(param.betDiv, "mini");
                util.removeClass(param.betDiv, "off");
                if(betShowToMini)betShowToMini=false;//已從完整改為迷你
                else betFrame.addBounce();//迷你注單才加上
            }
            if((getView().viewportwidth < 1024 && miniOrientation!=90 )&& top.bet_mini){
                //console.log("小畫面不會有迷你注單,處理他");
                top.bet_mini = false;
                util.addClass(param.betDiv, "off");
                util.removeClass(param.betDiv, "mini");
                util.removeClass(param.betDiv, "minimize");
                betShowToMini=true;//縮小後拉大可從隱藏到迷你注單狀態  2021-01-13 Q2-377.將畫面從1024px以下拉大到有右面板，再點非盤面頁面，注單收下的header都會跳動一下
            }
    }

    _self.showBetSlip = function(param){
        var isShow = param.isShow;
        var minimize = (param.minimize)?true:false;
        top["openBets"] = isShow;
        var betDiv = dom.getElementById("betslip_show");
        if(isShow){
            if(minimize){
                util.addClass(betDiv, "minimize");
                util.addClass(dom.getElementById("bet_show"), "_no_animation");//2020-01-07 Q2-14.先展開右面板彈出窗，再去添加下注選項，彈出窗應收掉，只顯示注單 ; 展開注單再去點右面板的聲明，應要加注單下收變header，現在彈出窗會蓋在注單上方
                util.removeClass(betDiv, "off");
                betFrame.showOrder(param.xmlnode, param.gameObj, param.paramHash, param.isRepeat, param.isSameEcid);
            }else{
                util.addClass(betDiv, "on");
                betShowToMini=true;//可從完整到迷你注單狀態 2021-01-13 Q2-380.右面板-收下完整注單header，不應跳一下，應要順順的收下
                util.removeClass(betDiv, "off");
                betFrame.showOrder(param.xmlnode, param.gameObj, param.paramHash, param.isRepeat, param.isSameEcid);
            }
            
        }else{
            util.removeClass(betDiv, "on");
            util.addClass(betDiv, "off");
        }

        var betOrientation = win.Math.abs(win.orientation);
        if(getView().viewportwidth >= 1024 || betOrientation==90){
            if(param.rightMsg_sw) _self.mini_bet({"betDiv":betDiv,"rightMsgStatus":true,"minimize":minimize});
            else _self.mini_bet({"betDiv":betDiv,"rightMsgStatus":false,"minimize":minimize});
        }else{
            _self.mini_bet({"betDiv":betDiv})
        }
    }


    _self.reCalcBetslip = function(param){
        var _count = util.countSize(top["bet_select"]);//計算選擇了幾個賠率選項
        if(!top["openBets"]){
            betFrame.getParlay();
            _self.showBetSlip({"isShow":false});
        }else{
            if(_count != 0){
                top.betMode = "total";
                _self.showBetSlip({"isShow":true,"isRepeat":param.isRepeat,"isSameEcid":param.isSameEcid});
            }else{
                _self.showBetSlip({"isShow":false});
                if(top.isAddTotal)betFrame.clearTotalOrder();
            }
        }
        _self.setBetSelectCount(_count);
        if(top.bet_mini && getView().viewportwidth >= 1024){
            betFrame.countMiniBet(_count);
            betFrame.addBounce();
        }
    }    

    _self.checkCount=function(){
        now_frame++;
        if(firstcode == null){//4位數密碼登入/[否]設定新4位數密碼/[是][否]使用已設定的4位數密碼/已設定4位數密碼但失敗2次退回登入頁/第二次改密碼 首次登入
            echo("[checkCount] now="+now_frame+" vs total="+total_frame);
            if(now_frame >= total_frame){
                dom.getElementById("home_show").style.display = "";
                if(CookieManager.get("UID") == top["userData"].passwd_safe && top['userData'].four_pwd != "second"){
                    //(909)會員端-當有分流時，主網址和分流都記住四位數密碼，刪除四位數密碼後，登出至主網址出現四位數登入頁(不輸入密碼)，切換正常登入頁，登入後停在彈出窗畫面，灰色背景不應提早收掉(若先按了“是“會閃一下首頁才到設置頁)
                    if(ann_sw && top.memSet.passcode != "[del]")_self.chkann();//主要header跑完 才跑公告,補上"四位數密碼存在的狀況"才去跑公告
                }else if(top["userData"].abox4pwd_notshow == "Y"){ //勾選”不要再提醒“ 後直接近主畫面
                    if(ann_sw)_self.chkann();//主要header跑完 才跑公告
                }else if(CookieManager.get("UID") != top["userData"].passwd_safe && top['userData'].four_pwd==undefined){
                    if(ann_sw)_self.chkann();
                }
                if(now_frame==6){//跑完公告收loading
                    loginComplete= true;
                    dom.getElementById("home_show").classList.remove("outside");
                    _self.setLoadingVisible(false);
                    // _self.callFrameToLoadLS();
                }
                _self.SerrefreshPage();
                _self.membercashchk();
            }
        }else{//分流/切換語系/[是]設定新4位數密碼/第一次改帳號 已登入
            total_frame = 6;
            echo("[checkCount] now="+now_frame+" vs total="+total_frame);
            if(now_frame >= total_frame){
                if(top["errorTwice"] != true){
                    top['userData'].four_pwd = "";
                }
                _self.SerrefreshPage();
                _self.membercashchk();
                if(top['userData'].four_pwd != "new" && ann_sw)_self.chkann();//主要header跑完 才跑公告
                if(now_frame==(total_frame+1)){//跑完公告收loading
                    loginComplete= true;
                    dom.getElementById("home_show").classList.remove("outside");
                    _self.setLoadingVisible(false);
                    // _self.callFrameToLoadLS();
                }
            }
        }
    }

    _self.messagechk=function(){
        var urlParams = "";
        var _substr="";
        var _select_date="-4";
        var _important="3";

        urlParams += "username=" + top["userData"].username;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&select_date="+_select_date+_substr;
        urlParams += "&t_important="+_important;

        urlParams = "p=messageget&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onErrormsg);
        getHTML.addEventListener("LoadComplete", _self.loadcountCompletemsg);
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.loadcountCompletemsg = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if(util.alertConnectMsg(errorMsg))  return;
        
		var xmlnode=util.parseXml(xml);
        msgImpchk= xmlnode.Node(xmlnode.Root[0],"Impcount").innerHTML;
        msgPerchk = xmlnode.Node(xmlnode.Root[0],"counts").innerHTML;
        top.impchk = msgImpchk;
        top.perchk = msgPerchk;
        if(headerFrame != null){
            headerFrame.messg(msgImpchk,msgPerchk);
        }
        if(rightFrame != null){
            rightFrame.messg(msgImpchk,msgPerchk);
        }
    }
    _self.resetmsg = function(){
        headerFrame.messg("N","N");
        rightFrame.messg("N","N");
    }

    _self.createMesTimer=function(){
        if(timerHash["MesTimer"]!=null) return;
        timerHash["MesTimer"] = new Timer(config_set.get("CONFIG_MSG_COUNT"));
        timerHash["MesTimer"].setParentclass(_self);
        timerHash["MesTimer"].init();
        timerHash["MesTimer"].dont_clear = true;
        timerHash["MesTimer"].addEventListener("TimerEvent.TIMER", _self.messagechk);
        timerHash["MesTimer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.MesTimerFinish);
        timerHash["MesTimer"].startTimer();
    }

    _self.clearMesTimer=function(){
        if(timerHash!=null){
            if(timerHash["MesTimer"]!=null){
                timerHash["MesTimer"].clearObj();
                timerHash["MesTimer"].is_clear = true;
                timerHash["MesTimer"]=null;
            }
        }
        return true;
    }
    _self.MesTimerFinish = function () {

    };

    _self.onErrormsg = function () {

    };

    /*
    * param.page
    * param.retFun
    */
   _self.bodyGoToPage=function(param){

        if (bodyFrame && bodyFrame.exitConfirm && !bodyFrame.LeaveChk && !param.LeaveChkPass) {
            _self.exitConfirm(_self.bodyGoToPage, param, bodyFrame.exitConfirm);
            return;
        } else {

            //2021-01-11 Q2 275.ios-所有瀏覽器-用四位數密碼登入，馬上點新功能、體育規則、賠率轉換會無法往下滑(正常登入正常)
            _self.setBodyShowClass(param);
            _self.showLoading({"isShow":true});

            var ret = false;
            if (bodyFrame && bodyFrame.exitEvent){
                ret = bodyFrame.exitEvent();
            }else{
                ret = true;
            }

            if (win._history.length > 0){
                homePage = false;
            }
            if(dom.getElementById("maintain_show").innerHTML != ""){
                if(param.page !=""&&param.page !=null){
                    _self.IsGamechk(param.page);
                }
            }
            if(CookieManager.get("all_choice_league")){
                CookieManager.del("all_choice_league");
            }
            try{
                var Ismotion = _self.checkIsGame(param.page);
                if(Ismotion){
                    if(clean_data_sw){
                        top["lastSportAll"].page = "home";
                    }else{
                        top["lastSportAll"] = param;
                    }

                    if(param.page == "home"){
                        headerFrame.chgHeadCss(param.page);
                        bottomFrame.chgBottomCss("menu_sport");
                    }else{
                        param.showtype = (param.showtype)?param.showtype:param.postHash.showtype;
                        if(param.back == "Y"){
                            if(top.specialClick == "special")headerFrame.chgHeadCss(param.showtype, "special");
                            else {
                                if(param.isMyGame == "Y" && param.page.indexOf("game_more")!=-1) headerFrame.chgHeadCss("mygame");
                                else headerFrame.chgHeadCss(param.showtype);

                                if(param.showtype == "mygame")bottomFrame.chgBottomCss("mygame");
                            }
                        }
                    }
                    if(top.choice_showtype!="mygame" || (param.isMyGame != "Y" && param.page.indexOf("game_more")!=-1)) bottomFrame.chgBottomCss("menu_sport");
                }else{
                    if(top["openBets"]){
                        _self.scrollClose();
                    }
                    headerFrame.chgHeadCss(param.page);
                    bottomFrame.chgBottomCss(param.page);
                }
            }catch(e){}

            //Ricky rightPanel
            if(param.page == "home"){
                top.specialClick = "";
                top.specialGame.isFantasy = false;
                if(rightPanelFrame!=null){
                    rightPanelFrame.clearTimer();
                    rightPanelFrame.setVisible(false);
                    if(top.rightECID!="")_self.resetRightTV();
                    if(param.rightLoading!="slowlyClose")_self.setRightLoading(false);
                    top.rightECID = "";
                    top.rightGtype = "";
                    top.rightRB = "";
                    top.rightNowPlay = "";
                    top.rightAllClosed = false;
                }
            }

            //檢查bodyGoToPage要去的頁面是不是game_list或game_more
            var isGoToGame = _self.chkGoToGame(param.page);
            if(isGoToGame){
                if(rightPanelFrame!=null){
                    //337.
                    //if(top.choice_showtype=="live"||(top.choice_showtype=="parlay"&&top.choice_gtype=="ft")||top.specialClick=="special"){ //滾球&滾過盤面要停止Timer
                        if(top.choice_rtype!="fs"){
                            rightPanelFrame.stopTimer();
                        }
                        if(top.choice_rtype=="fs" && top.rightECID!=""){
                            rightPanelFrame.createTimer();
                            rightPanelFrame.startTimer();
                        }
                        top.rightAllClosed = false;
                    //}
                    //else{
                    //    if(top.rightECID!="" && getView().viewportwidth >= 1024)rightPanelFrame.startTimer();
                    //} 
                }
            }else{
                if(rightPanelFrame!=null){
                    if(top.rightECID!="" && getView().viewportwidth >= 1024){
                        rightPanelFrame.createTimer();
                        rightPanelFrame.startTimer();
                    }
                }
            }
            if(rightPanelFrame!=null)rightPanelFrame.setTVPlaying(false);

            if(ret){
                ret = _self.clearAllTimer();
                if(ret) _self.goToPage("body_show", param.page, _self.definedParent, param);
            }
        }
    }

    /*
    * param.target
    * param.page
    * param.retFun
    * param.post
    */
    _self.goToPageEvent=function(param){
        param.isTrans = "Y";
        var retFunc = ( param.useDefineParent=="Y")? _self.definedParent : param.retFun;
        _self.goToPage(param.target, param.page, retFunc, param);
    }

    _self.goToPage=function(target, page, retFun, param){
        clearTimeout(retryTimer);
        if(!failCount[page]) failCount[page] = 0;
        var str_isRB = (param.isRB!=null)?param.isRB:"N";
        var post = "";
        try{
            post = param["post"];
        }catch(e){}
        var str_showtype = (page.indexOf("game")!=-1||page=="right_score"||page=="features"||page=="sport_menu"||page=="rules_general"||page.indexOf("league")!=-1)? "_"+post: "";
        var page_name = target+"_"+page+str_showtype+"_"+top.ver;

        // 2020-12-03 載完cdn之後在執行後續動作（將func先行儲存
        // 2021-01-12 原先使用page當key，會導致pending載入的頁面只執行到一次ret，故改成使用page_name
        var tmpKey = page_name+"_"+util.getTimestamp();
        cssRetFuncHash[tmpKey] = new Object();
        cssRetFuncHash[tmpKey].func = retFun;
        cssRetFuncHash[tmpKey].param = param;

        var ht = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"),null);
        ht.setParentclass(_self);
        ht.addEventListener("onError", _self.onError);
        ht.addEventListener("LoadComplete", function(html){
            var errorMsg = util.showConnectMsg(html);
            if(util.alertConnectMsg(errorMsg))  return;
            if(page=="home"&&param.rightLoading=="slowlyClose")_self.setRightLoading(false);
            
            top["Requesterrorcount"] = 1;
            top["Requesttime"] = null;
            var xmlnode = util.parseXml(html);
            var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
            var msg = xmlnode.Node(xmlnode.Root[0],"msg").innerHTML;
            failCount[page] = 0;
            
            //console.log("[loadHtml]", html);
            var tempHtml = new win.parseHTML(html);
            var dbody = tempHtml.getTag("div")[0];
            var sty = tempHtml.getTag("style");
            var scp = tempHtml.getTag("script");
            var alink = tempHtml.getTag("link");
            
            if(!dbody){
                try{
                    var errHash = JSON.parse(html);
                    if(util.chkErrorMsg(errHash,LS_code)) return;
                }catch(e){
                    util.err("[load html error]"+page, e);
                    return;
                }
            }
            // 將不必要的js css移除，避免負擔
            var ret = true;
            if(target=="body_show" && nowPage!=""){
                _self.clearHead(nowPage);
            }
            if(ret){
                var jsObj = new Object();

                for(var j=0; j<scp.length; j++){
                    _self.createJS({"page":page, "scpt":scp[j]});
                    jsObj[page+"_"+j] = scp[j];
                }

                cssFinishCount[tmpKey] = 0;
                cssTotalCount[tmpKey] = alink.length;
                var ver = top.ver;
                var cssObj = new Object();
                for(i=0;i<alink.length;i++) {
                    _self.createCSS({"page":page, "pageKey":tmpKey, "link":alink[i], "ver":ver});
                    cssObj[page+"_"+i] = alink[i];
                }
                pageHash[page_name] = new Object();
                pageHash[page_name]["script"] = jsObj;
                pageHash[page_name]["style"] = cssObj;
                //換語系區
                dbody.innerHTML = _self.load_art(dbody.innerHTML,artjson,top.langx);
                pageHash[page_name]["html"] = dbody.innerHTML;
                dom.getElementById(target).innerHTML = dbody.innerHTML;  //首次載入

                _self.createTitle();  
                _self.clearDuplicate();  
                if(page == "home" && !top["homefirst"]){
                    _self.chkFourPwdProc();
                }
            }
        });
        //page != "rules_general" 羽球banner點了後會連結到體育規則裡的羽球 如果快取住了再去點擊右面板的規則會停在羽球 我的賽事一樣
        if(cache_html_sw && pageHash[page_name] && page != "rules_general" && page != "features"){
            if(page=="home"&&param.rightLoading=="slowlyClose")_self.setRightLoading(false);
            var pageName = page;
            cssFinishCount[tmpKey] = 0;
            cssTotalCount[tmpKey] = util.countSize(pageHash[page_name]["style"]);
            for(var key in pageHash[page_name]["script"]){
                _self.createJS({"page":pageName, "scpt":pageHash[page_name]["script"][key]});
            }
            for(var key in pageHash[page_name]["style"]){
                _self.createCSS({"page":pageName, "pageKey":tmpKey, "link":pageHash[page_name]["style"][key], "ver":top.ver});
            }
            dom.getElementById(target).innerHTML = pageHash[page_name]["html"]; // 第二次之後載入
        }else{
            var _post = "p="+page+"&ver="+top.ver+"&langx="+top.langx;
            if(top["userData"].uid!="")_post+="&uid="+top["userData"].uid;
            //會員端-所有尺寸-請幫加上羽毛球Banner，顯示在第一張，點了後會連結到體育規則裡的羽球(拉霸需顯示在羽球) (CRM-88)
            if(param.action == "goToBM" && param.ball != ""){
                param.post = "ball="+param.ball;
            }
            //<<3>>我的賽事-彈出公告、Banner、新功能(CRM-119)
            if(page == "features" && param.data == "data_1")param.post = "data="+param.data;
            if(param.post) _post+="&"+param.post;
            ht.loadURL(top.url, "POST" , _post);
        }
    }

    _self.createTitle = function(){
        try{
            var title = dom.createElement("title");
            title.innerHTML = "Welcome"; 
            dom.getElementsByTagName("head")[0].appendChild(title);
        }catch(e){
            util.err("["+classname+"]", e);
        }
    }

    _self.createJS = function(param){
        try{
            var scpt = dom.createElement("script");
            var tarScpt = param["scpt"];
            if(tarScpt.src){
                scpt.src =tarScpt.src;
            }else{
                scpt.innerHTML = tarScpt.innerHTML;
                scpt.setAttribute("id",param["page"]+"JS");
                scpt.setAttribute("name",param["page"]);
            }
            dom.getElementsByTagName("head")[0].appendChild(scpt);
        }catch(e){
            util.err("["+classname+"]", e);
        }
    }

    _self.createCSS = function(param){
        try{
            var _link = dom.createElement("link");
            var tarLink = param["link"];
            if(tarLink.href){
                _link.setAttribute("id", param["page"]+"CS_"+(i+1));
                _link.setAttribute("name", param["page"]);
                _link.rel = "stylesheet";
                _link.type = "text/css";
                util.addEvent(_link, "load", _self.cssLoad, {"page":param["pageKey"]});
                util.addEvent(_link, "error", _self.cssLoad, {"page":param["pageKey"]});

                // 避免中間流程 cookie被刪除導致掉圖防呆
                var tmp_protocol = tarLink.href.split(":")[0];
                var _url = tarLink.href.split(":")[1];
                var new_url = tarLink.href;
                if(tmp_protocol != global_protocol){
                    new_url = global_protocol +":"+ _url;
                    CookieManager.set("protocolstr", global_protocol,1);
                }
                var ver = "?ver="+param["ver"];//css會多串一次ver ?ver拿掉
                _link.href = new_url+ver;
            }
            dom.getElementsByTagName("head")[0].appendChild(_link);
        }catch(e){
            util.err("["+classname+"]", e);
        }
    }

    _self.cssLoad = function(e, param){
        cssFinishCount[param["page"]]++;
        if(cssFinishCount[param["page"]] == cssTotalCount[param["page"]]){
            if(cssRetFuncHash[param["page"]] && cssRetFuncHash[param["page"]]["func"]) cssRetFuncHash[param["page"]]["func"](cssRetFuncHash[param["page"]]["param"]);
            delete cssRetFuncHash[param["page"]];
        }
    }

    _self.SetConfirmExit = function (param) {
        bodyFrame.LeaveChk = false;
        bodyFrame.exitConfirm = param;
    }

    _self.closeConfirmExit = function () {
        bodyFrame.LeaveChk = null;
        bodyFrame.exitConfirm = null;
    }

    _self.exitConfirm = function (retFun, param, confirm_par) {
        if (confirm_par.isEdit && !confirm_par.isEdit()){
            bodyFrame.LeaveChk = true;
            retFun(param);
            return;
        }
        _self.setLoadingVisible(false);
        _self.showAlertMsg({ "target":confirm_par["Alert"].target, "msg":confirm_par["Alert"].msg, "confirm":confirm_par["Alert"].mode, "retFun": function (msg) {
            if (msg == "yes") {
                bodyFrame.LeaveChk = true;
                //當確認離開時有留下遺言 做ifYes
                if (confirm_par.ifYes) {
                    confirm_par.ifYes(confirm_par.YesParam);
                }
                retFun(param);
            } else {
                bodyFrame.LeaveChk = false;
                //當不想離開時要把畫面還原等動作 做ifNo
                if (confirm_par.ifNo) {
                    confirm_par.ifNo(confirm_par.ifNo);
                }
                return false;
            }
        }});
    }

    _self.checkIsGame=function(_url){
		var ary = new Array("home","game_list","game_more","league_index","league_filter");
		var isGame = false;

		//從盤面來要資料
		for(var j=0; j<ary.length; j++){
				if(_url.indexOf(ary[j])!=-1){
						isGame = true;
						break;
				}
		}

		return isGame;
    }

    _self.closePopMT = function(){
        var _MT = dom.getElementById("mt_pop");
        if(_MT!=null){
            bodyFrame.closeMTsub();
        }
    }

    _self.IsGamechk=function(chk){
        var IsGametest = _self.checkIsGame(chk);
        if(IsGametest){
            dom.getElementById("maintain_show").style.display="";
        }else{
            dom.getElementById("maintain_show").style.display="none";
        }
    }

    _self.clearHead=function(pageName){
        var tarHeadObj = dom.getElementsByName(pageName);
        var sty_len = tarHeadObj.length;
        for(var i = sty_len-1; i >= 0; i--){
            tarHeadObj[0].parentNode.removeChild(tarHeadObj[0]);
        }
        return true;
    }

    _self.clearDuplicate=function(){
        var ori_head = dom.getElementsByTagName("head")[0].children;
        var sty_len = ori_head.length;
        var classHash = new Array();
        for(var i = sty_len-1; i >= 0; i--){
            var realID = ori_head[i].id;
            if(util.in_array(realID,classHash) && ori_head[i].tagName!="META"){
                ori_head[i].parentNode.removeChild(ori_head[i]);
            }
            classHash.push(realID);
        }
    }

    _self.definedParent=function(param){
        if(!isNaN(param.history_pop)){
            try{
                window._history.splice(window._history.length-param.history_pop, 1);
            }catch(e){
                util.err("[definedParent][window._history.splice]", e);
            }
        }
        if( (param.back!="Y" || homePage) && param.isTrans!="Y" ){
            _self.pushHistory(param, "", param.page);
        }
        try{
            var obj = classHash[param.page];
            if(param["extendsClass"]){
                obj = util.extendsClass(eval("new "+param["extendsClass"]+"(win,dom,param.postHash)"), eval(param.page), win, dom, param["postHash"]);
            }else{
                obj = eval("new "+param.page+"(win,dom,param.postHash);");
            }
            if(param.isTrans=="Y"){
                
                var parantClass = (param.parentClass!=null)?param.parentClass:_self;
                obj.setParentclass(parantClass);
                obj.init();
                if (param.retChild) param.retChild(obj);
            }else{
                nowPage = param.page;
                bodyFrame = obj;
                bodyFrame.setParentclass(_self);
                bodyFrame.init();
            }
        }catch(e){
            util.err("[definedParent]["+param.page+"]", e);
        }

        _self.backToTop();
        var bObj = dom.getElementById("body_show");
        var clsary = {};
        try{
                clsary = bObj.className.split(" ");
                //otis修改 <26>會員端-今日/早餐/過關-選擇聯盟頁-切換賽事/冠軍頁籤時，會秀兩個loading圖示
                for(i=1; i<clsary.length; i++){
                    bObj.classList.remove(clsary[i]);
                }
        }catch(e){}
        //if(param.retFun) param.retFun(param.retParam);
        //if (param.pageName) _self.chgPageName({ "pageType": param.pageType, "pageName": param.pageName, "uniqText": param.uniqText});
        setTimeout(function(){
            try{
                //otis修改 <26>會員端-今日/早餐/過關-選擇聯盟頁-切換賽事/冠軍頁籤時，會秀兩個loading圖示
                for(j=1; j<clsary.length; j++){
                    bObj.classList.add(clsary[j]);
            }
            }catch(e){}
                
            if(param.retFun) param.retFun(param.retParam);
            if (param.pageName) _self.chgPageName({ "pageType": param.pageType, "pageName": param.pageName, "uniqText": param.uniqText});
                
        }, 10);
    }

    _self.backToTop=function(){
        dom.getElementById("body_show").scrollTop = 0;
    }

    _self.showLoading=function(param){//換頁面loading
        if(getView().viewportwidth >= 1024)_self.showBodyLoading(param.isShow);
        else _self.setLoadingVisible(param.isShow);
    }

    _self.showBodyLoading=function(isShow){//1024以上
        if(dom.getElementById("loading") && loginComplete)dom.getElementById("loading").style.display = "none";//拉大拉小問題
        if(dom.getElementById("body_loading"))dom.getElementById("body_loading").style.display = isShow?"":"none";
    }

    _self.loginFullLoading=function(param){//第一次登入成功後loading
        _self.setLoadingVisible(param.isShow);
    }

    _self.setLoadingVisible=function(isShow){//1024以下
        if(dom.getElementById("body_loading"))dom.getElementById("body_loading").style.display = "none";//拉大拉小問題
        dom.getElementById("loading").style.display = isShow?"":"none";
    }

    _self.getNowPage = function(){
        var tmpPage = "";
        if(win._history.length!=0){
            tmpPage = win._history[win._history.length-1].page;
        }
        return tmpPage;
    }

    _self.getLastPageParam = function(postHash){
        var tmpPage = null;
        if(win._history.length!=0){
            //按上一頁時，histroy已經先被pop掉了，所以-1，其餘單純切換頁面的-2
            // if(postHash["back"]!=null && postHash["back"]=="Y")tmpPage = win._history[win._history.length-1];
            // else tmpPage = win._history[win._history.length-2];
            tmpPage = win._history[win._history.length-2];
        }
        return tmpPage;
    }

    _self.popstate=function(e){
        _self.pushHistory(null, "", "");
        _self.backPage({"retFun":null});
    }

    _self.pushHistory=function(state, title, page){
        try{
            win.history.pushState(top["userData"], title, util.getWebUrl() );
            if(page!=""){
                backcount = 0;
                win._history.push({"state":util.clone(state),"page":page});
            }
        }catch(e){
            util.err("[pushHistory]", e);
        }
    }

    _self.backPage=function(param){
        try{
            backcount++;
            if(bodyFrame.classname != "home"){
                if(backcount >= 5){
                    var hash = new Object();
                    _self.backhomeclear(win._history.length-1);
                    _self.SerrefreshPage();
                    _self.backhome();
                }else{
                    if(win._history.length > 1){
                        top["BackTag"] = "Y";
                        win._history.pop();
                        var obj = win._history[win._history.length-1];
                        var hash = obj.state;
                        //console.log("[backPage][obj]",obj);
                        //console.log("[backPage][hash]",hash);
                        try{
                            //我的賽事內層參數是使用各時節的參數 ex:滾球帶live...但是只要在我的賽事盤面 就應該要為mygame 所以這邊判斷掉
                            if(hash.showtype){
                                if(hash.isMyGame=="Y")top.choice_showtype = "mygame";
                                else top.choice_showtype = hash.showtype;
                            }
                            if(hash.postHash.rtype)top.choice_rtype = hash.postHash.rtype;
                            if(hash.postHash.gtype)top.choice_gtype = hash.postHash.gtype;
                            if(hash.postHash)hash.postHash.back = "Y";

                            if(hash.postHash.specialClick == "special")top.specialClick = hash.postHash.specialClick;
                            else top.specialClick = "";

                            if(hash.outrightsClick == "outrights"||hash.postHash.outrightsClick == "outrights"){
                                top.outrightsClick = "outrights";
                                top.choice_showtype = "early";
                            }else{
                                top.outrightsClick = "";
                            }

                            if(hash.postHash.kind && hash.postHash.kind == "fantasy")top.specialGame.isFantasy = true;
                            else top.specialGame.isFantasy = false;
                        }catch(e){}
                        if(obj.page == "home")backcount = 0;
                        hash.page = obj.page;
                        hash.back = "Y";
                        hash.retFun = param.retFun;
                        _self.bodyGoToPage(hash);
                    }
                }
                //1179.未啟用四位數密碼會員，登入後選擇是前往設定簡易密碼，設定頁面的上一頁箭頭無反應
            }else if(bodyFrame.classname == "home"&&loginFrame.classname == "passcode"){
                _self.backhomeclear(win._history.length-1);
                _self.backhome();
            }else{
                backcount = 0;
            }
        }catch(e){
            util.err("[backPage]", e);
        }
    }

    _self.backhome = function(){
        backcount = 0;
        var hash = new Object();
        hash.page = "home";
        hash.back = "Y";
        _self.bodyGoToPage(hash);
    }

    _self.backhomeclear = function(param){
        for(i = 0; i < param; i++){
            win._history.pop();
        }
    }

    _self.clearAllOpenWindow = function(){
        for(var i in top.popWindow){
            try{
                if(!top.popWindow[i].closed){
                        top.popWindow[i].window.close();
                }
            }catch(e){}
        }
    }

    _self.chg_langx=function(ls){
        var lss = ls.toUpperCase();
        if(lss == "US")lss = "EN";
        util.setObjectClass(dom.getElementById("main"),"main "+lss);
        LS = eval("new LS_"+ls+"();");
        LS_game = eval("new LS_game_"+ls+"();");
        LS_code = eval("new LS_code_"+ls+"();");

        LS.init();
        LS_game.init();
        LS_code.init();
        dom.getElementById("select_lea").innerHTML = LS_code.get("indexsubmit");
    }

    _self.ios_blur = function (e) {
        var startTouchY = 0;
        util.addEvent(dom.body, "touchstart", _self.touchstartEvent,{passive: false});
        util.addEvent(dom.body, "touchmove", _self.doOnTouchMove);
        if(top.moving == "true"){
            return;
        }else{
            if(e.target.tagName != "INPUT"){
                var now_focus = dom.activeElement;
                if(now_focus.tagName == "INPUT" && e.target.dataset.system != "ios12"){
                    now_focus.blur();
                    //console.log("失焦成功");   
                }
            }
        }
    }


    _self.doOnTouchMove = function (e) {
        var nowTouchY = e.touches[0].clientY;
        if( startTouchY < nowTouchY - fixY||startTouchY > nowTouchY + fixY){  //往下 或 往上
            top.moving = "true";
        }else{
            top.moving = "false";
        }
    }

    _self.touchstartEvent=function(event){
        startTouchY = event.touches[0].clientY;
        top.moving = "false";
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }

    _self.clearAllTimer=function(isInit){
        for(var keys in timerHash){
            if(isInit){
                if(timerHash[keys]!=null){
                    timerHash[keys].clearObj();
                    timerHash[keys] = null;
                }
            }else{
                if(timerHash[keys]!=null && !timerHash[keys].dont_clear){
                    timerHash[keys].clearObj();
                    timerHash[keys] = null;
                }
            }
        }
        return true;
    }
 

    _self.showchg_pwd=function(param){ // 第二次登入修改密碼
        if(top["userData"].passwd=="" || top["userData"].passwd==undefined){//使用4位數密碼登入
            top["userData"].passwd="login_4pwd";
        }
        _self.clearSerTimer();
        _self.setLoadingVisible(true);
        
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";
        
        _self.goToPage("chgAcc_show", "chg_pwd", function(){
            loginFrame = new win.chg_pwd(win,dom,param);
            loginFrame.setParentclass(_self);
            loginFrame.init();
        },{});
    } 


    _self.show_forgotEvent=function(){ //忘記密碼
        top.param ="ver="+top.ver+"&langx="+top.langx;
        _self.setLoadingVisible(true);
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";

        _self.goToPage("chgAcc_show", "forgot_pwd", function(){
            loginFrame = new win.forgot_pwd(win,dom,null);
            loginFrame.setParentclass(_self);
            loginFrame.init();

            dom.getElementById("chgAcc_show").style.display = "";
        },{});
    }

    _self.passcode=function(){//按"是" 啟用4位數密碼
        _self.setLoadingVisible(true);
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        firstcode = true;
        _self.goToPage("body_show", "passcode", function(){
            loginFrame = new win.passcode(win,dom,null);
            loginFrame.setParentclass(_self);
            loginFrame.init();
        },{});

    }

    _self.showAlertMsg=function(param){
        alertFrame.showMsg(param);
    }

    _self.hideAlertMsg=function(param){
        alertFrame.clearMsg(param.use);
    }

    _self.noCloseWindow=function(param){
        //開啟賽果後，點擊聯繫我們的信箱或電話，賽果不應收掉
        iscloseW = param.iscloseW;
    }

    _self.closePCResult=function(){
        //352.會員端-1024以上-另開賽果頁，登出後應將賽果頁關閉
        //判斷重整 或 關閉
        window.onbeforeunload=function (e){
            if(e.clientX>document.body.clientWidth && e.clientY < 0 || e.altKey){
                //關閉頁面
                top.newWinObj_result.close();
            }else{
                //重新整理
                if(iscloseW=="Y"){
                    top.newWinObj_result.close();
                }else {
                    iscloseW="Y";//開啟賽果後，點擊聯繫我們的信箱或電話，賽果不應收掉
                }
            }
        }
    }

    _self.showSystemMsg=function(param){//show系統訊息-網路不穩
        systemFrame.showMsg(param);
    }

    _self.hideSystemMsg=function(param){//hide系統訊息-網路不穩
        systemFrame.clearSysMsg(param.use);
    }

    _self.chk_acc=function(){
        top["login_4pwd_sw"] = login_4pwd_sw;
        top["errorCount"] = errorCount;
        top["errorTwice"] = errorTwice;

        if(top["login_4pwd_sw"]=="Y" && CookieManager.get("PID")){

            if(CookieManager.get("UID") && !CookieManager.get("previous_langx")){

                action = "GETSW"
                keycode = CookieManager.get("PID");
                var urlParams= "";
                urlParams += "p=checkPassCode";
                if(top.param)urlParams += "&"+top.param;
                urlParams += "&keycode="+keycode;
                urlParams += "&action="+action;
                var getHTML = new HttpRequest();
                getHTML.addEventListener("LoadComplete", function(xml){
                    var errorMsg = util.showConnectMsg(xml);
		            if(util.alertConnectMsg(errorMsg))  return;

                    var xmdObj = new Object();
                    xmlnode = util.parseXml(xml);
                    xmdObj["sw"] = xmlnode.Node(xmlnode.Root[0],"sw");
                    if(xmdObj["sw"].innerHTML=="N"){
                        document.getElementById("acc_show").classList.add("pass_outside");
                        _self.show_prepasscode();//導四位密碼登入頁
                    }else{
                        top["errorTwice"] = true;
                        CookieManager.set("error1","error1", 3650);
                        _self.show_back_login();
                    }
                });
                getHTML.loadURL(top.url,"POST",urlParams);
                return;

            }else{
                _self.showLogin();
                CookieManager.del("previous_langx");
            }

        }else{
            _self.showLogin();
        }

       
    }

    _self.removebodylock = function(param){
        if(!announcementlock){
            dom.getElementById("body_show").classList.remove("scroll_lock");
            dom.body.removeAttribute("style");
            dom.body.classList.remove("scroll_lock");
            try{
                if(param.type == "no"){
                    if(param.px != null){
                        _self.setScrollTop({"value":param.px});
                    }
                }
            }catch(e){}
        }
    }

    _self.annlock = function(param){
        announcementlock = param.sw;
    }

    _self.addbodylock = function(){
        dom.getElementById("body_show").classList.add("scroll_lock");
        dom.body.classList.add("scroll_lock");
    }

    //因為加上class會把scrollTop變成0所以使用obj做判斷
    _self.setScrollTop = function(obj){
        dom.documentElement.scrollTop = obj.value;
        dom.body.scrollTop = obj.value;
    }

    _self.chkscroll = function(param){
        var sb = window.pageYOffset || dom.documentElement.scrollTop || dom.body.scrollTop;
        try{
            if(param.px != null){
                //吐司訊息沒有所畫面所以top沒有用
                if(param.target != "message_pop" && param.target != "message_pop_bef"){
                    document.body.setAttribute("style","top:-"+param.px+"px");
                }else{
                    dom.documentElement.scrollTop = param.px;
                    dom.body.scrollTop = param.px;
                }
            }else{
                document.body.setAttribute("style","top:-"+sb+"px");
            }
        }catch(e){

        }
    }
    
    _self.newalertMsg=function(type){
        dom.getElementById("msg_popup").classList.remove("on");
        _self.loginFullLoading({"isShow":true});
        if(type == "yes") top["userData"].newalertMsg = "Y";
        //順序 勾選"不要再顯示"  >> 主分流
        if(dom.getElementById('C_confirm_chk').checked == true){//打勾不要再顯示
            _self.checkbox_noshow();
        }else{
            box4pwd_notshow = "N";
            CookieManager.set("box4pwd_notshow_"+top['userData'].mid,top['userData'].mid+"_"+box4pwd_notshow);
        }
        _self.CheckDomain(function(){
            if(type == "yes"){
                bottomFrame.chgBottomCss("passcode");
                _self.passcode();
            }else if(type == "no"){
                CookieManager.del("PID");
                CookieManager.del("UID");
            }
            //2135.登入後詢問四位數密碼畫面時，若出現網路不穩定訊息按"重新嘗試連接"，網路正常時點擊後會顯示白頁，正確應出現網路不穩時，收掉四位數的訊息，當可正常連線，點擊"重新連接"，再跳出四位數的詢問視窗
            top["RequestRetry"] = null;
            _self.Domainon();
        });    
    }

    _self.alertMsg=function(type){
        dom.getElementById("msg_popup").classList.remove("on");
        _self.loginFullLoading({"isShow":true});
        if(type == "yes"){
            box4pwd_notshow = "N";
            CookieManager.set("box4pwd_notshow_"+top['userData'].mid,top['userData'].mid+"_"+box4pwd_notshow);
            _self.setPassCode(function(){
                _self.CheckDomain(_self.Domainon);
            });
        }else if(type == "no"){
            box4pwd_notshow = "N";
            CookieManager.set("box4pwd_notshow_"+top['userData'].mid,top['userData'].mid+"_"+box4pwd_notshow);
            CookieManager.del("PID");
            CookieManager.del("UID");
            _self.CheckDomain(_self.Domainon);
        }
        top["RequestRetry"] = null;
    }

    _self.chkann=function(){
        ann_sw = false;//checkCount只做一次公告檢查 不重複檢查
        _self.goToPage("announcement_show", "announcement", function(){ 
            announcementFrame = new win.announcement(win,dom,null);
            announcementFrame.setParentclass(_self);
            announcementFrame.init();

            if(CookieManager.get("announcement_"+top['userData'].mid+"_202112") ==null && top.notice_sw == "Y"){
                announcementlock = true;
                announcementFrame.show_announcement();
            }
            else announcementFrame.ann_message();   
        },{});
    }

    _self.checkbox_noshow=function(){
        box4pwd_notshow = "Y";
        CookieManager.set("box4pwd_notshow_"+top['userData'].mid,top['userData'].mid+"_"+box4pwd_notshow);
    }


    _self.setPassCode=function(retFun){
        var tmp_date = new Date().toJSON().slice(0,10);
        action = "SET";
        var urlParams= "";
        urlParams += "p=checkPassCode";
        if(top.param)urlParams += "&"+top.param;
        urlParams += "&inputCode="+top["userData"].passwd_safe+"|"+top["memSet"].passcode+"|"+top["userData"].mid+"|N|"+tmp_date;
        urlParams += "&action="+action;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete",  function(xml){
            _self.encodePassCodeFinish(xml);
            retFun();
        });
        getHTML.loadURL(top.url,"POST",urlParams);

    }
    _self.encodePassCodeFinish=function(xml){
        var errorMsg = util.showConnectMsg(xml);
		if(util.alertConnectMsg(errorMsg))  return;

        var xmdObj = new Object();
        xmlnode = util.parseXml(xml);
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0],"code");

        if(xmdObj["code"].innerHTML =="484"){
            // 2018-05-08 四位密碼時效從30天改10年
            var getPID = xmlnode.Node(xmlnode.Root[0],"data").innerHTML;
            CookieManager.set("PID", encodeURIComponent(getPID), 3650);
            CookieManager.set("UID", top["userData"].passwd_safe, 3650);
            top["userData"]["secondSet4pwd"] = "Y";
        }
    }

    _self.getBodyScrollTop = function(){
        var scrollTop = dom.documentElement.scrollTop || dom.body.scrollTop || 0;
        return scrollTop;
    }
    
    _self.setBodyScrollTop = function(obj){
        if(dom.documentElement.scrollTop){
            dom.documentElement.scrollTop = obj.value;
        }else if(dom.body.scrollTop){
            dom.body.scrollTop = obj.value;
        }
    }

    _self.createSerTimer=function(){
        if(timerHash["SerTimer"]!=null) return;
        timerHash["SerTimer"] = new Timer(config_set.get("CONFIG_FIX"));
        timerHash["SerTimer"].setParentclass(_self);
        timerHash["SerTimer"].init();
        timerHash["SerTimer"].dont_clear = true;
        timerHash["SerTimer"].addEventListener("TimerEvent.TIMER", _self.SerrefreshPage);
        timerHash["SerTimer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.SerTimerFinish);
        timerHash["SerTimer"].startTimer();
    }

    _self.stopSerTimer = function () {
        timerHash["SerTimer"].stopTimer();
    }

    _self.clearSerTimer=function(){
        if(timerHash!=null){
            if(timerHash["SerTimer"]!=null){
                timerHash["SerTimer"].clearObj();
                timerHash["SerTimer"].is_clear = true;
                timerHash["SerTimer"]=null;
            }
        }
        return true;
    }

    _self.SerrefreshPageComplete=function(msg,firstTime){
        var msgObj = new Object();
        var xmlnode=util.parseXml(msg);
        var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
        var fix_sw = config_set.get("CONFIG_FIX_CHECK");
            
        if(!fix_sw){
            return;
        }
            
        if(code=="619"){
            msgObj["maintain_sw"] = xmlnode.Node(xmlnode.Root[0],"maintain_sw").innerHTML;
            msgObj["maintain_time"] = xmlnode.Node(xmlnode.Root[0],"maintain_time").innerHTML;
            msgObj["clean_data_sw"] = xmlnode.Node(xmlnode.Root[0],"clean_data_sw").innerHTML;
            msgObj["myGame_sw"] = xmlnode.Node(xmlnode.Root[0],"myGame_sw").innerHTML;
            msgObj["urgent_sw"] = xmlnode.Node(xmlnode.Root[0],"urgent_sw").innerHTML;
            msgObj["emergency_sw"] = xmlnode.Node(xmlnode.Root[0],"emergency_sw").innerHTML;
            msgObj["clean_data_time"] = xmlnode.Node(xmlnode.Root[0],"clean_data_time").innerHTML;
            msgObj["exceptions_ip"] = "@"+xmlnode.Node(xmlnode.Root[0],"exceptions_ip").innerHTML+"@";
            msgObj["masterNewDomain_ip"] = xmlnode.Node(xmlnode.Root[0],"masterNewDomain_ip").innerHTML;
            msgObj["masterNewDomainY_ip"] = xmlnode.Node(xmlnode.Root[0],"masterNewDomainY_ip").innerHTML;
            msgObj["isException"] = (msgObj["exceptions_ip"].indexOf("@"+util.getWebDomain()+"@")!=-1);
            if(msgObj["masterNewDomain_ip"].substr(-1,1)=="@") msgObj["masterNewDomain_ip"] = msgObj["masterNewDomain_ip"].substr(0,msgObj["masterNewDomain_ip"].length-1);
            msgObj["code"] = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
            msgObj["fix_sw"] = fix_sw;
            msgObj["hometext"] = _self.getNowPage();

            Serobj = msgObj;
            var nowDomain = util.getWebDomain();
            var regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;
            top.myGame_sw = (msgObj["myGame_sw"] == "Y")?true:false;
            //判斷我的賽事呈現的狀態
            if(top.userData.mid){
                if(msgObj["myGame_sw"] != "Y")_self.showMyGameProc(false,msgObj["clean_data_sw"]);
                else{
                    if(msgObj["clean_data_sw"] != "Y"){
                        chkNow = false;
                       _self.showMyGameProc(true,msgObj["clean_data_sw"],chkNow);   
                    }   
                    //清資料開關打開時,我的賽事反灰
                    else _self.showMyGameProc(false,msgObj["clean_data_sw"]);
                }
            }
                
            //例外ip不進維護
            if(msgObj["isException"]){
                if(msgObj["clean_data_sw"] =="Y"){
                    if(SerFrame == null){
                        _self.goToPage("maintain_show", "service_main", function(_post){
                            SerFrame = new win.service_main(win,dom,_post);
                            SerFrame.setParentclass(_self);
                            SerFrame.init();
                        },msgObj);
                        if(msgObj["clean_data_sw"] =="Y"){
                            if(loginFrame == null){
                                if(_CHDomain.uid == ""||_CHDomain.uid ==null||_CHDomain.uid ==undefined){
                                    _self.chk_acc();
                                }
                            }
                            clean_data_sw = true;
                        }else{
                            dom.getElementById("acc_show").style.display = "none";
                        }
                    }else{
                        SerFrame.Serchk(msgObj);
                    }
                }else{
                    clean_data_sw = false;
                    dom.getElementById("maintain_show").className = "";
                    dom.getElementById("maintain_show").innerHTML = "";
                    if(SerFrame != null){
                        SerFrame = null;
                    }
                    if(loginFrame == null){
                        _self.chk_acc();
                    }
                }
                
                _self.lockbottom();
                return;
            }else if(nowDomain.match(regex) && (firstTime!=null && firstTime) ){
                if(_self.chk_masterDomain_ip(nowDomain,msgObj["masterNewDomain_ip"])=="N" && msgObj["masterNewDomain_ip"]!=""){
                    var masterAry = msgObj["masterNewDomainY_ip"].split("@");
                    var newAry = new Array();
                    for(var i =0; i < masterAry.length; i++){
                        if(masterAry[i].match(regex)){
                            newAry.push(masterAry[i]);
                        }
                    }
                    var r = util.getRandomInt(newAry.length-1);
                    var master_IP = util.getProtocal()+"//"+newAry[r];
                    if(CookieManager.get("doubleLogin")){
                        //設定秒數是因為有些手機cookie刪不掉,後來value存timestamp跟現在時間做判斷,太久就不讓他秀了 馬來太慢所以3秒改10秒
                        var usedTime = _self.getDoubleLoginTs();
                        if(usedTime < 10){
                            doubleLoginip = master_IP;
                            _self.chk_acc();
                            return;
                        }
                    }
                    
                    util.topGoToUrl(master_IP);
                    return;
                }
            }

            if(msgObj["maintain_sw"]=="Y"||msgObj["emergency_sw"]=="Y"||msgObj["clean_data_sw"] =="Y"||msgObj["urgent_sw"]=="Y"){
                if(SerFrame == null){
                    _self.goToPage("maintain_show", "service_main", function(_post){
                        SerFrame = new win.service_main(win,dom,_post);
                        SerFrame.setParentclass(_self);
                        SerFrame.init();
                    },msgObj);
                    if(msgObj["clean_data_sw"] =="Y"){
                        if(loginFrame == null){
                            if(_CHDomain.uid == ""||_CHDomain.uid ==null||_CHDomain.uid ==undefined){
                                _self.chk_acc();
                            }
                        }
                        clean_data_sw = true;
                    }else{
                        dom.getElementById("acc_show").style.display = "";
                    }
                }else{
                    SerFrame.Serchk(msgObj);
                }
                if(msgObj["maintain_sw"]=="Y"){
                    maintain = true;
                }else if(msgObj["emergency_sw"]=="Y"){
                    emergency = true;
                }
                _self.lockbottom();
            }else{
                urgent = false;
                maintain = false;
                emergency = false;
                clean_data_sw =false;
                dom.getElementById("maintain_show").className = "";
                dom.getElementById("maintain_show").innerHTML = "";
                if(dom.getElementById("menu_tv") != null){
                    _self.lockbottom();
                }
                if(SerFrame != null){
                    SerFrame = null;
                }
                if(loginFrame == null){
                    if(_CHDomain.uid == ""||_CHDomain.uid ==null||_CHDomain.uid ==undefined){
                        dom.getElementById("acc_show").style.display = "";
                        _self.chk_acc();
                    }
                }
            }
    
        }

    }

    _self.chk_masterDomain_ip = function(server_name,masterDomain_ip){
        var chk_master="N";	
        if( (masterDomain_ip !="") && ( masterDomain_ip.indexOf(server_name)!=-1 ) ){
            chk_master ="Y";
        }
        return chk_master;
    }

    _self.SerrefreshPage=function(firstTime){

        var urlParams = "";
        urlParams += "&langx=" + top.langx;
        try{
            if(bodyFrame != null){
                urlParams += "&uid="+top["userData"].uid;
                urlParams += "&login=Y";
            }else{
                urlParams += "&login=N";
            }
        }catch(e){}

        urlParams = "p=service_mainget&ver=" + top.ver + "&" + urlParams;
        
        var getHTML = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"),null);
        getHTML.setParentclass(_self); //指向 HttpRequestRetry 要設定的Parentclass 
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", function(xml){
            var errorMsg = util.showConnectMsg(xml);
            if(util.alertConnectMsg(errorMsg))  return;

            _self.SerrefreshPageComplete(xml,firstTime);
        });
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.SerTimerFinish=function(){

    }

    _self.browser_rule = function(){ //使用過時瀏覽器
        _self.setLoadingVisible(true);
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";

        _self.goToPage("acc_show", "browser_rule", function(){
            loginFrame = new win.browser_rule(win,dom,null);
            loginFrame.setParentclass(_self);
            loginFrame.init();

            dom.getElementById("acc_show").style.display = "";
        },{});
    }

    _self.getParentThis=function(varible){
        return _self.getThis(_self); //指向 HttpRequestRetry 的 bodyFrame 
    }

    _self.Chg_odds = function(value){
        try{					
            if(top.choice_rtype != "fs"){
                bodyFrame.getData();
            }else{
                bodyFrame.getData_FS();
            }
        }catch(e){
        }
    }

    _self.chgHeadCss = function(param){
        bottomFrame.chgHeadCss(param.showtype);
    }

    _self.chgBottomCss = function(param){
        bottomFrame.chgBottomCss(param.showtype);
    }

    _self.membercashchk = function(){
        try{
            if(bodyFrame.classname == "home"){
                try{
                    if(top["userData"].enable!="S") bodyFrame.createLeaTimer();
                    bodyFrame.showViewOnly((top["userData"].enable=="S"));
                    _self.lockbottom();
                }catch(e){

                }
            }
        }catch(e){

        }
    }
    _self.lockbottom = function(){
        var alllock = new Array("menu_tv","header_tv","home_page","live_page","today_page","early_page","parlay_page","special_page","outrights_page","menu_myGame","header_myGame");//2021-02-09 TZ 補"special_page"
        if(top["userData"].enable=="S"||clean_data_sw){
            try{
                for(var i=0; i<alllock.length; i++){
                    dom.getElementById(alllock[i]).classList.add("off");
                };
                if(!clean_data_sw){
                    dom.getElementById("home_page").classList.remove("off");
                }
            }catch(e){}
        }else{
            if(!clean_data_sw){
                try{
                    for(var i=0; i<alllock.length; i++){
                        dom.getElementById(alllock[i]).classList.remove("off");
                    };
                }catch(e){}
            }
        }
    }

    _self.load_art = function(doc,artjson,langx){
        if(langx == '') langx="zh-tw";
        var json = artjson;
        var bod = doc;
        for (var key in json) {
            bod = bod.replace(new RegExp( '\\\*' + key + '\\\*','gi'),json[key]);
        }
        doc = bod;
        return doc;
        
    }

    _self.langx_beforelogin = function(){
       _self.showLogin();
    }

    _self.scrollsetTop = function(){
        _self.mobileandblue();
    }

    _self.cleardoubleLogincookie = function(){
        if(doubleLoginip){
            util.topGoToUrl(doubleLoginip);
        }else{
            _self.setLoadingVisible(false);
        }
        _self.removebodylock();
    }

    _self.createDomTimer=function(){
        if(timerHash["DomTimer"]!=null) return;
        timerHash["DomTimer"] = new Timer(config_set.get("CONFIG_DOMAIN"));
        timerHash["DomTimer"].setParentclass(_self);
        timerHash["DomTimer"].init();
        timerHash["DomTimer"].dont_clear = true;
        timerHash["DomTimer"].addEventListener("TimerEvent.TIMER", _self.CheckDomain);
        timerHash["DomTimer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.DomTimerFinish);
        timerHash["DomTimer"].startTimer();
    }

    _self.stopDomTimer = function () {
        timerHash["DomTimer"].stopTimer();
    }

    _self.clearDomTimer=function(){
        if(timerHash!=null){
            if(timerHash["DomTimer"]!=null){
                timerHash["DomTimer"].clearObj();
                timerHash["DomTimer"].is_clear = true;
                timerHash["DomTimer"]=null;
            }
        }
        return true;
    }

    _self.Domainon = function(){
        var nowpage = _self.getNowPage();
        if(top["userData"].newalertMsg == "Y"){
            _self.IsGamechk("passcode");
        }else{
            if(nowpage == ""){
                nowpage = "home";
            }
            _self.IsGamechk(nowpage);
        }
        _self.createDomTimer();
        if(ann_sw)_self.chkann();
    }
    //新增我的賽事檢查timer
    _self.createMyGameChkTimer=function(){
        if(timerHash["myGameChkTimer"]==null){
            timerHash["myGameChkTimer"] = new Timer(config_set.get("CONFIG_MYGAME_CHECK"));
            timerHash["myGameChkTimer"].setParentclass(_self);
            timerHash["myGameChkTimer"].init();
            timerHash["myGameChkTimer"].addEventListener("TimerEvent.TIMER", _self.myGameChk);
            timerHash["myGameChkTimer"].startTimer();
        }
        
    }

    _self.myGameChk=function(from){
        var gid_str = "";
        var gid = "";
        
        _self.initMyGame();
        for(var i= 0;i<myGameGtype.length;i++){
            var myGameHash = top["myGameHash"][myGameGtype[i]];
            if(util.countSize(myGameHash) == 0)continue;
            for (var key in myGameHash){
                if(gid != "")gid += "|";
                gid += key; 
            }
            if(gid_str != "")gid_str += "@";
            gid_str += myGameGtype[i].toUpperCase()+"," + gid;
            gid = "";
        }
        var par = "p=get_mygame";
        par += "&" + top.param;
        par += "&gid_str=" + gid_str;
        if(from)par += "&from=" + from;
        if(gid_str == ""){
            //手動清除所有cookie
            //console.log("沒有半場[我的賽事]需要[檢查]==>格式化記憶體,清除綠點");
            _self.format_myGame();
            _self.showGreenBtnProc(false);
            return;
        }
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.myGameChkComplete);
        getHTML.loadURL(top.url,"POST",par);
    }
    _self.myGameChkComplete=function(xml){
        myGameChkHash = util.showConnectMsg(xml);
        if(util.alertConnectMsg(myGameChkHash))  return;

        var xmdObj = new Object();
        var nowPage = _self.getNowPage();
        xmlnode = util.parseXml(xml);
        

        for(var k= 0;k<myGameGtype.length;k++){
            //跑球類
            var gtype = myGameGtype[k];
            var myGameHash = top["myGameHash"][myGameGtype[k]];
            var msg = xmlnode.Node(xmlnode.Root[0],"msg");
            xmdObj[gtype] = xmlnode.Node(xmlnode.Root[0],gtype);
            if(msg.innerHTML == "NeedsToDel"){
                if(xmdObj[gtype].innerHTML){
                    var gid_ary = xmdObj[gtype].innerHTML.split("^");
                    for(var ecid in myGameHash){
                        if(gid_ary.indexOf(ecid)!=-1){
                            util.delMyGameHash(myGameHash,ecid,config_set);
                            //console.log("刪除=>"+ecid);
                        }else{
                            if(myGameHash[ecid]["ts"]!=null && myGameHash[ecid]["ts"]!="")myGameHash[ecid]["ts"] = "";
                        }
                    }

                }
            }else{
                for(var ecid in myGameHash){
                    if(myGameHash[ecid]["ts"]!=null && myGameHash[ecid]["ts"]!="")myGameHash[ecid]["ts"] = "";
                }
            }        
            //記憶體同步cookie
            util.setMyGameCookie(CookieManager,myGameHash,myGameGtype[k]);
        }
        //計算各球類記憶體數量
        var noGame = util.chkAllMyGameHash(true);
        if(noGame){
            //沒有賽事資料
            _self.showGreenBtnProc(false);
        }else{
            //有賽事資料
            _self.showGreenBtnProc(true);
        }
        if(nowPage.includes("game_list") && top.choice_showtype == "mygame"){
            //120秒檢查目前我的賽事球類數量
            bodyFrame.getMyGameCnt();
        }
    }
    //我的賽事: 綠點
    _self.showGreenBtnProc=function(show){
        if(headerFrame)headerFrame.showGreenBtn(show);
        if(bottomFrame)bottomFrame.showGreenBtn(show);
    }

    _self.chkGame = function(param){
        _self.showMyGameProc(param.myGame_sw,param.clean_data,param.chkNow,param.from);
    }

    //我的賽事: 開關(我的賽事都要走進該流程)
    _self.showMyGameProc=function(show,clean_data,chkNow,from){
        cleanData = (clean_data == "Y")?true:false;
        var from = (from)?from:"";
        
        var nowPage = _self.getNowPage();
        if(nowPage.includes("game_list")||nowPage.includes("game_more")){
            //判斷目前是否在盤面,設定星星狀態
            if(nowPage.includes("game_list"))bodyFrame.starShow(show);
            if(top.choice_showtype == "mygame" && !top.myGame_sw)bodyFrame.myGameClose();
        }
        if(!cleanData){
            if(headerFrame)headerFrame.showMyGame(show);
            if(bottomFrame)bottomFrame.showMyGame(show);
        }
        
        if(show){
            if(chkNow)_self.myGameChk(from);
            _self.createMyGameChkTimer();
        }else{
            if(timerHash["myGameChkTimer"]!=null){
                timerHash["myGameChkTimer"].clearObj();
                timerHash["myGameChkTimer"].is_clear = true;
                timerHash["myGameChkTimer"]=null;
            }

            if(!top.myGame_sw){
                var gtype_ary = new Array("ft","bk","bs","bm","op","sk","tt","tn","vb");
                for(var i=0;i<gtype_ary.length;i++){
                    var tmpGtype = gtype_ary[i];
                    top["myGameHash"][tmpGtype] = new Object();
                    if(CookieManager.get(tmpGtype+"_myGame_"+top["userData"].mid)!=null)CookieManager.del(tmpGtype+"_myGame_"+top["userData"].mid);
                }
                //console.log("========開關關閉了========");
                _self.showGreenBtnProc(false);
            }
        }
    }

    _self.createMemTimer=function(){
        if(timerHash["memTimer"]!=null) return;
        timerHash["memTimer"] = new Timer(config_set.get("CONFIG_MEMBER_CREDIT"));
        timerHash["memTimer"].setParentclass(_self);
        timerHash["memTimer"].init();
        timerHash["memTimer"].dont_clear = true;
        timerHash["memTimer"].addEventListener("TimerEvent.TIMER", _self.auto_update);
        timerHash["memTimer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.memTimerFinish);
        timerHash["memTimer"].startTimer();
    }

    _self.clearMemTimer=function(){
        if(timerHash!=null){
            if(timerHash["memTimer"]!=null){
                timerHash["memTimer"].clearObj();
                timerHash["memTimer"].is_clear = true;
                timerHash["memTimer"]=null;
            }
        }
        return true;
    }

    _self.createMemMessageTimer = function(){
        var _name = "MemMessageTimer";
        if(timerHash[_name]!=null) return;
        timerHash[_name] = new Timer(config_set.get("CONFIG_MEMBER_MESSAGE"));
        timerHash[_name].setParentclass(_self);
        timerHash[_name].init();
        timerHash[_name].dont_clear = true;
        timerHash[_name].addEventListener("TimerEvent.TIMER", _self.memMessage);
        timerHash[_name].addEventListener("TimerEvent.TIMER_COMPLETE", _self.getMemData);
        timerHash[_name].startTimer();
    }

    _self.memMessage = function(param){
        var par = "p=mem_message&"+top.param
        var getHTML = new HttpRequest();
        getHTML.addEventListener("LoadComplete", _self.getMemData);
        getHTML.loadURL(top.url, "POST", par);
    }

    _self.getMemData = function(data){
        if(data!=""){
            data = JSON.parse(data);
            var id = data.id;
            var msg = data.msg;
            _self.showAlertMsg({"target":"C_alert_ok", "msg":msg,"retFun":_self.cleardoubleLogincookie,"msgid":id});
        }
    }

    _self.createMemOnlineTimer=function(){
        var _name = "memOnlineTimer";
        if(timerHash[_name]!=null) return;
        timerHash[_name] = new Timer(config_set.get("CONFIG_MEMBER_ONLINE"));
        timerHash[_name].setParentclass(_self);
        timerHash[_name].init();
        timerHash[_name].dont_clear = true;
        timerHash[_name].addEventListener("TimerEvent.TIMER", _self.memOnline);
        timerHash[_name].addEventListener("TimerEvent.TIMER_COMPLETE", _self.emptyFun);
        timerHash[_name].startTimer();
    }

    _self.clearMemOnlineTimer=function(){
        var _name = "memOnlineTimer";
        if(timerHash!=null){
            if(timerHash[_name]!=null){
                timerHash[_name].clearObj();
                timerHash[_name].is_clear = true;
                timerHash[_name]=null;
            }
        }
        return true;
    }

    _self.memOnline = function(param){
        var par = "p=mem_online&"+top.param
        var getHTML = new HttpRequest();
        getHTML.addEventListener("LoadComplete", _self.emptyFun);
        getHTML.loadURL(top.url, "POST", par);
    }

    _self.emptyFun=function(xml){
        var errorMsg = util.showConnectMsg(xml);
		if(util.alertConnectMsg(errorMsg))  return;
    }
    
    _self.auto_update=function(){
        _self.reloadCredit({"key":"all"});
    }

    _self.reloadCredit=function(param){
        key = "member"; //預設取會員狀態
        if(param.key == "cash"){
            key = "credit"; //取額度
        }else if(param.key == "all"){
            key = "all"; //全部取
        }

        var urlParams = "";
        urlParams = "p=get_member_data&"+top.param+"&change="+key;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        if(key == "member"){
            getHTML.addEventListener("LoadComplete", _self.updateMemData);
        }else if(key == "credit"){
            getHTML.addEventListener("LoadComplete", _self.cash);
        }else{
            getHTML.addEventListener("LoadComplete", _self.reloadAll);
        }
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.updateMemData=function(xml){
        memparamHash = util.showConnectMsg(xml);
        if(util.alertConnectMsg(memparamHash))  return;

        var xmdObj = new Object();
        xmlnode = util.parseXml(xml);
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0],"code");

        if(xmdObj["code"].innerHTML=="get_member_data"){
            top["userData"].enable = xmlnode.Node(xmlnode.Root[0],"enable").innerHTML;
            _self.membercashchk();
        }
    }

    _self.cash=function(xml){
        memparamHash = util.showConnectMsg(xml);
        if(util.alertConnectMsg(memparamHash))  return;

        if(rightFrame!=null)rightFrame.cashdata(xml);
        if(headerFrame!=null)headerFrame.cashdata(xml);
        
    }

    _self.reloadAll=function(xml){
        memparamHash = util.showConnectMsg(xml);
        if(util.alertConnectMsg(memparamHash))  return;

        if(rightFrame!=null){
            rightFrame.cashdata(xml);
        }
        if(headerFrame!=null)headerFrame.cashdata(xml);

        var xmdObj = new Object();
        xmlnode = util.parseXml(xml);
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0],"code");
        
        if(xmdObj["code"].innerHTML=="get_all_data"){
            top["userData"].enable = xmlnode.Node(xmlnode.Root[0],"enable").innerHTML;
            _self.membercashchk();
        }

    }

    _self.betfinsih_update=function(nowCredit){
        if(nowCredit!=null){
            if(rightFrame!=null)rightFrame.chgcredit(nowCredit);
            if(headerFrame!=null)headerFrame.chgcredit(nowCredit);
        }
        if(nowCredit == null) _self.reloadCredit({"key":"cash"});
    }

    _self.CheckDomain=function(Fun){
        var urlParams = "";

        urlParams += "username=" + top["userData"].username;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&code=663";

        urlParams = "p=check_login_domain&ver=" + top.ver + "&" + urlParams;

        var getHTML = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"),null);
        getHTML.setParentclass(_self);
        getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete", function(xml){
            var errorMsg = util.showConnectMsg(xml);
            if(util.alertConnectMsg(errorMsg))  return;

			xmlnode = util.parseXml(xml);
            var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
			if(code=="664"){
				var _url = "";
                var new_domain = xmlnode.Node(xmlnode.Root[0],"new_domain").innerHTML;
                var now_mode = xmlnode.Node(xmlnode.Root[0],"now_mode").innerHTML;
                top["userData"].langx = top.langx;
                if(now_mode == "Y"){
                    if(new_domain!=""){
                        top["Requesttime"] = "Y";
                        var _url = util.getProtocal()+"//"+new_domain;
                        util.topGoToUrl(_url,top["userData"]);
                        return;
                    }else{
                        if(Fun) Fun();
                    }
                }else{
                    if(Fun) Fun();
                }
			}
        });
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.private=function(){  //使用 私密連線
        _self.setLoadingVisible(true);
        
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";

        _self.goToPage("acc_show", "private", function(){
            loginFrame = new win.private(win,dom,null);
            loginFrame.setParentclass(_self);
            loginFrame.init();
            dom.getElementById("acc_show").style.display = "";
        },{});

    }

    _self.retryLoop=function(params){//網路-不穩
        if(dom.getElementById("C_ok_btn_system"))dom.getElementById("C_ok_btn_system").innerHTML = LS.get("connect_again");
        if(dom.getElementById("alert_confirm"))dom.getElementById("alert_confirm").classList.remove("on");
        if(dom.getElementById("C_alert_confirm"))dom.getElementById("C_alert_confirm").classList.remove("on");
        retryMethod.push(params.method);
        retryParams.push(params.params);
        retryFun.push(params.fun);
        retryParentclass.push(params.Parentclass);
        retryFrame.push(params.frame);
		if(top["Requesttime"] == null){
            _self.showSystemMsg({"target":"C_alert_ok_system", "msg":LS.get("connect_retry"),"retFun":_self.reQuest});
			top["Requesttime"]="Y";
		}
    }

    _self.reQuest = function(){
        top["Retrytimer"] = setTimeout(_self.reTry,600,retryMethod,retryParams,retryFun,retryParentclass,retryFrame);
		top["Requesterrorcount"]++;
	}

	_self.reTry = function(method, params,fun,pclass,frame){
        top["Requesttime"]=null;
        if(retryParams.length >= 1){
            for(i=0;i<retryParams.length;i++){
                var ht = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"),frame[i]);
                ht.setParentclass(pclass[i]);
                ht.addEventListener("onError", _self.onError);
                ht.addEventListener("LoadComplete", fun[i]);
                ht.loadURL(top.url, method[i], params[i]);
            }
        }
        _self.retryComplete();
		if(dom.getElementById("ok_btn"))dom.getElementById("ok_btn").innerHTML = LS.get("determine");
	}

    _self.retryLastfail=function(){//網路-極度不穩
        if(dom.getElementById("C_ok_btn_system"))dom.getElementById("C_ok_btn_system").innerHTML = LS.get("connect_ok");
        _self.showSystemMsg({"target":"C_alert_ok_system", "msg":LS.get("connect_fail"),"retFun":util.goToIndex});
    }

    _self.login4pwdRetryComplete=function(){
        if(dom.getElementById("alert_confirm") && getView().viewportwidth < 1024)dom.getElementById("alert_confirm").classList.add("on");
        if(dom.getElementById("C_alert_confirm") && getView().viewportwidth >= 1024)dom.getElementById("C_alert_confirm").classList.add("on");
        if(dom.getElementById("msg_popup"))dom.getElementById("msg_popup").classList.add("on");
    }

    _self.retryComplete=function(){
        retryMethod = new Array();
        retryParams = new Array();
        retryFun = new Array();
        retryParentclass = new Array();
        retryFrame = new Array();
    }

    _self.getLocalStorage = function(){
        var tmp_storage = null;
		try{
				tmp_storage = (window.localStorage)?window.localStorage:window.globalStorage[strDomain];
				tmp_storage["init"] = "true";
		}catch(e){
				return "initFail";
		}

		return tmp_storage;
    }

    _self.videoOnClick = function(param){
        win.removeEventListener("resize", orientationblur);
        setTimeout(_self.addResizeEvent, 500);
    }

    _self.addResizeEvent = function(){
        if(!top.fullscreen){
            win.addEventListener("resize", orientationblur);
        }
    }

    _self.changeFullScreen = function(e){
        top.fullscreen = !top.fullscreen;

        if(top.fullscreen){
            win.removeEventListener("resize", orientationblur);
        }else{
            win.addEventListener("resize", orientationblur);
        }
    }

    var orientationblur = function(e){
        _self.checkHeight();
        var now_width1024 = (getView().viewportwidth >= 1024);
        var fs = false;
        if(dom.getElementById("html5_player")){
            fs = (dom.getElementById("html5_player").clientWidth == win.screen.width);
        }

        if(!top.fullscreen && !fs){
            if(!ios&&top.mobile == "Y"){
                var orientationTurn = win.Math.abs(win.orientation);
                if(top["userData"].uid != null&& top["userData"].uid != ""){
                    if(win.innerHeight == first0height&&dom.activeElement.tagName == "INPUT"&&orientationTurn ==0){
                        dom.activeElement.blur();
                    }else if(win.innerHeight == first90height&&dom.activeElement.tagName == "INPUT"&&orientationTurn ==90){
                        dom.activeElement.blur();
                    }
                }
            }
            if(width1024!=now_width1024){
                width1024 = now_width1024;
                //Ricky abcd
                if(width1024){ //1024以上
                    top.nowWidth = "over1024";
                    _self.removebodylock();
                    if(rightPanelFrame==null && loginSuccess){
                        _self.showBigRightLoading(true);        
                        _self.goToPage("right_show", "right_panel", function(){
                            rightPanelFrame = new win.right_panel(win,dom,null);
                            rightPanelFrame.setParentclass(_self);
                            rightPanelFrame.init();
                            //rightPanelFrame.loadLS();
                            _self.showBigRightLoading(false);
                            if(top.resizePage=="game_list"||top.resizePage=="game_more"){
                                rightPanelFrame.setRightLoading(true);
                                rightPanelFrame.loadRightScore({"scFun":bodyFrame.resizeEvent});
                                rightPanelFrame.showRightMsg(true);//大於1024
                            }
                            else if(top.resizePage=="other"&&top.rightECID!=""){
                                rightPanelFrame.setRightLoading(true);
                                rightPanelFrame.loadRightScore({"scFun":rightPanelFrame.getData});
                            }
                        },{});
                    }else if(rightPanelFrame!=null){
                        
                        var hasLoad = rightPanelFrame.chkRightScore();
                        //337.
                        //if((top.resizePage=="game_list"||top.resizePage=="game_more")&&top.choice_showtype=="live"){
                        if(top.resizePage=="game_list"||top.resizePage=="game_more"){    
                            rightPanelFrame.setRightLoading(true);
                            rightPanelFrame.loadRightScore({"scFun":bodyFrame.resizeEvent});
                        }
                        // else if((top.resizePage=="game_list"||top.resizePage=="game_more")&&top.choice_showtype!="live"){
                        //     rightPanelFrame.setRightLoading(true);
                        //     bodyFrame.resizeEvent(width1024);
                        // }
                        
                        if(!hasLoad){
                            if(top.resizePage=="other"&&top.rightECID!=""){
                                rightPanelFrame.setRightLoading(true);
                                rightPanelFrame.loadRightScore({"scFun":rightPanelFrame.getData});
				                rightPanelFrame.startTimer();
                            } 
                        }else{
                            if(top.resizePage=="other"&&top.rightECID!=""){
                                rightPanelFrame.setRightLoading(true);
                                if(rightPanelFrame.getTVPlaying())rightPanelFrame.loadRightScore({"scFun":rightPanelFrame.getData, "scParam":true});
                                else rightPanelFrame.loadRightScore({"scFun":rightPanelFrame.getData});
				                rightPanelFrame.startTimer();
                            }
                        }
                        rightPanelFrame.showRightMsg(true);//大於1024
                    }
                    var nowPage = _self.getNowPage();
                    if(util.in_array(nowPage,otherAry)){
                        _self.showBackTopBtn();
                    }
                    if(util.countSize(top.bet_select) > 0 && !top.openBets){
                        top.betMode = "total"; 
                        _self.showBetSlip({"isShow":true,"minimize":true});                        
                    }  
                }else{ //1024以下
                    top.nowWidth = "less1024";
                    if(top.resizePage=="game_list" || top.resizePage=="game_more"){
                        bodyFrame.resizeEvent(width1024);
                    }
                    else if(top.resizePage=="other"){
			            rightPanelFrame.stopTimer();
                        if(rightPanelFrame.chkTvPlaying()){
                            rightPanelFrame.setTVPlaying(true);
                            _self.resetRightTV();
                        }
                        var nowPage = _self.getNowPage();
                        if(util.in_array(nowPage,otherAry)){
                            _self.showBackTopBtn();
                        }
                    }
                    if(rightPanelFrame)rightPanelFrame.showRightMsg(false);//小於1024
                    if(top.openBets){//有開啟著單狀態
                        _self.hideAlertMsg({"use":"noPopMainClear"});//清除主面板聲明
                    }
                    if(top.bet_mini){
                        _self.showBetSlip({"isShow":false});
                    }
                }
            }else{
                var nowPage = _self.getNowPage();
                if(util.in_array(nowPage,otherAry)){
                    _self.showBackTopBtn();
                }
            }
            var now_width640 = (getView().viewportwidth >= 640);
            if(width640!=now_width640 && top.resizePage=="game_list"){
                width640 = now_width640;
                bodyFrame.orientation90or0();
            }
        }
    }

    _self.rollBottom=function(param){//交易狀況/帳戶歷史/額度修改-畫面位置是否在底部
        var nowpage = _self.getNowPage();
        if(param.page==nowpage){
            isBottom = param.isBottom;
        }else{
            isBottom = false;
        }
    }

    _self.showBackTopBtn = function(){//交易狀況/帳戶歷史/額度修改-畫面在底部 且 超出可視範圍
        var body_h = document.getElementById("body_show").scrollHeight;  //body height(包含捲軸滾動後)
        var view_h = document.getElementById("body_show").clientHeight;  //view height
        var now_h = document.getElementById('body_show').scrollTop;      //目前scroll位置
        if(body_h-view_h>=10){//超出可視範圍 加上"移置頂部"按鈕
            document.getElementById("tool_backtop").style.display = "";
            if(((body_h-(view_h+now_h)<=80) || isBottom) && top.mobile!="Y"){//目前scroll在底部
                setTimeout(function(){
                    document.getElementById('body_show').scrollTop = body_h;
                },300);
            }
        }
    }

    _self.scrollClose = function(){
        if(top["isOrderView"]){
            if(top.choice_showtype=="parlay" && getView().viewportwidth >= 1024){
                betFrame.addTotal(null, {"xmlnode":top["fastBetXML"], "gameObj":top["fastBetGameObj"], "betData":top["fastBetHash"], "from":"goToNoGame"});
            }else{
                betFrame.addTotal(null, {"xmlnode":top["fastBetXML"], "gameObj":top["fastBetGameObj"], "betData":top["fastBetHash"]});
            }
        }else{
            betFrame.closeBet(true);
        }
    }

    _self.clearBets = function(){
        betFrame.clearBets();
    }

    _self.showSpecialTitle = function(param){
        if(headerFrame != null){
                headerFrame.showSpecialTitle(param);
       }
    
    }

    //========== 右面板 Function ==========  
    _self.loadRightScore = function(par){
        if(rightPanelFrame!=null){
            rightPanelFrame.loadRightScore(par);
        }
    }    

    _self.resetRightTV = function(){
        if(rightPanelFrame!=null)rightPanelFrame.resetRightTV();
    }

    _self.playRightTV = function(){
        if(rightPanelFrame!=null)rightPanelFrame.playRightTV();
    }
    
    _self.resizeMTEvent = function(){
        if(rightPanelFrame!=null)rightPanelFrame.resizeMTEvent();
    } 

    _self.setRightTVDefaultPlay = function(obj){
        if(rightPanelFrame!=null)rightPanelFrame.setTVDefaultPlay(obj);
    }    

    _self.setRightVisible = function(par){
        if(rightPanelFrame!=null)rightPanelFrame.setVisible(par.isShow);
    }    

    _self.checkRightLive = function(par){
        if(rightPanelFrame!=null)rightPanelFrame.checkLive(par.xmlnode,par.mainGame,par.from);
    }    

    _self.parseRightScoreBoard = function(obj){
        if(rightPanelFrame!=null){
            rightPanelFrame.parseRightScoreBoard(obj);
        }
    }

    _self.chkTvPlaying = function(){//檢查是否播放TV
        if(rightPanelFrame!=null) return rightPanelFrame.chkTvPlaying();
    }

    _self.chkGoToGame=function(page){
		var ary = new Array("game_list","game_more");
        var isGo = false;

		for(var j=0; j<ary.length; j++){
            if(page.indexOf(ary[j])!=-1){
                top.resizePage = ary[j];
                isGo = true;
                break;
            }
        }
        if(!isGo){
            if(page=="home")top.resizePage = "home";
            else top.resizePage = "other";
        }

		return isGo;
    }    

    _self.rightResizeEvent = function(param){
        if(rightPanelFrame!=null)rightPanelFrame.resizeEvent(param.act);
    }

    _self.setRightLoading=function(param){
        if(rightPanelFrame!=null)rightPanelFrame.setRightLoading(param.isShow);
    }    

    _self.resizeRightLive = function(par){
        if(rightPanelFrame!=null)rightPanelFrame.resizeLive(par.xmlnode,par.mainGame);
    }

    _self.noGameCheckLive = function(par){
        if(rightPanelFrame!=null)rightPanelFrame.noGameCheckLive(par.eventid_ph,par.center_tv);
    }

    _self.setRightTimer = function(act){
        if(rightPanelFrame!=null){
            switch(act){
                case "stop":
                    rightPanelFrame.stopTimer();
                    break;
                case "start":
                    rightPanelFrame.startTimer();
                    break;
            }
        }
    }    

    //====================================

    _self.getDoubleLoginTs = function(){
        var tmpAry = CookieManager.get("doubleLogin").split("_");
        var tmpTs = new Date().getTime() - tmpAry[1];
        var ret = tmpTs/1000;
        return ret;
    }

    _self.loadFile = function(){
        var cuCookie = CookieManager.get("cu");
        if(!cuCookie){
            CookieManager.set("cu","N");
            top["userData"].cu = "N";
        }
        if(top.cu_domain){ 
            var sc = document.createElement("iframe");
            sc.id = "cu_ifr";
            sc.style.display = "none";
            sc.src = document.location.protocol+"//"+top.cu_domain+"/cu.html";
            document.body.appendChild(sc);
            cuTimer = setTimeout(_self.cuAbort,5000,sc); 
        }
    }    

    _self.cuAbort = function(sc){
        CookieManager.set("cu","N");
        top["userData"].cu = "N";
        sc.src = "";     
        sc.parentNode.removeChild(sc);
    }

    _self.createVerTimer=function(){//2020-10-13 新增一個timer(60秒)定期更新top.ver的值(版本號)
        if(timerHash["verTimer"]!=null) return;
        timerHash["verTimer"] = new Timer(config_set.get("CONFIG_CHECK_VERSION"));
        timerHash["verTimer"].setParentclass(_self);
        timerHash["verTimer"].init();
        timerHash["verTimer"].dont_clear = true;//設定為不清除timer
        timerHash["verTimer"].addEventListener("TimerEvent.TIMER", _self.checkVersion);//60秒自動更新版本號
        timerHash["verTimer"].startTimer();
    }

    _self.checkVersion = function(){//2020-10-13 新增一個timer(60秒)定期更新top.ver的值(版本號)
        var urlParams = "";
        urlParams = "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams = "p=get_version&"+ urlParams;

        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete",_self.getVersionComplete);
		getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.getVersionComplete=function(xml){//2020-10-13 新增一個timer(60秒)定期更新top.ver的值(版本號)
        var errorMsg = util.showConnectMsg(xml);
        if(util.alertConnectMsg(errorMsg))  return;
        xmlnode = util.parseXml(xml);
        var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
        if(code=="666"){
                top.ver = xmlnode.Node(xmlnode.Root[0],"ver").innerHTML;
        }
    }

    _self.showBigRightLoading=function(isShow){        
        dom.getElementById("right_loading").style.display = isShow?"":"none";    
    }

    _self.setBodyShowClass=function(param){
        if(param.page == "rules_general"||param.page == "features"||param.page == "help_odds"||param.page == "help_sys"){
            dom.getElementById("body_show").classList.add("box_l_height");
            //console.log("[addClass][body_show_scrollHeight]",dom.getElementById("body_show").scrollHeight);
        }
    }

    //====== CU ONMESSAGE事件設定 ======
	_self.onMessage = function(event){
        var code=event.data;
        var cuIfr = dom.getElementById("cu_ifr");
        switch(code){
            case "CU_OK":
                CookieManager.set("cu","Y");
                top["userData"].cu = "Y";
                clearTimeout(cuTimer);
                cuIfr.parentNode.removeChild(cuIfr);
                break;
        }
    }   
    //====== CU ONMESSAGE事件設定 ======

    _self.setBottomTodayWagers = function(param){
        bottomFrame.setTodayWagersCount(param.num);
    }

    _self.createNetTimer = function(){
        if(timerHash["NetCheckTimer"]!=null) return;
        timerHash["NetCheckTimer"] = new Timer(config_set.get("CONFIG_NETWORK_CHECK"));
        timerHash["NetCheckTimer"].setParentclass(_self);
        timerHash["NetCheckTimer"].init();
        timerHash["NetCheckTimer"].dont_clear = true;
        timerHash["NetCheckTimer"].addEventListener("TimerEvent.TIMER", _self.networkCheck);
        timerHash["NetCheckTimer"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.networkCheckFinish);
        timerHash["NetCheckTimer"].startTimer();
    }

    _self.stopNetTimer = function () {
        timerHash["NetCheckTimer"].stopTimer();
    }

    _self.startNetTimer = function () {
        top["requestFailedCount"]++;
        timerHash["NetCheckTimer"].startTimer();
    }

    _self.networkCheck = function(){
        if(top["requestFailedCount"] >= config_set.get("RETRY_LIMIT")){ // 第五次要彈跳
            _self.retryLastfail();
            _self.stopNetTimer();
            return;
        }
        if(util.countSize(top["requestFailedHash"])!=0){
            _self.stopNetTimer();
            _self.showSystemMsg({"target":"C_alert_ok_system", "msg":LS.get("connect_retry") ,"retFun":_self.startNetTimer});
        }else{
            top["requestFailedCount"] = 0;
        }
    }

    _self.goDomainRemoveM = function(str){//如果domain為m.XXXX且不是IP 需轉導
        var goUrl ="";
        goUrl = dom.location.protocol+"//"+str.replace("m.","");//去掉m.
        util.topGoToUrl(goUrl);
    }
    
    _self.networkCheckFinish = function(){
        
    }
    _self.systemreq = function(){
        top.param ="ver="+top.ver+"&langx="+top.langx;
        _self.setLoadingVisible(true);
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("sysreq_show").style.display = "none";

        _self.goToPage("sysreq_show", "system_req", function(){
            loginFrame = new win.system_req(win,dom,null);
            loginFrame.setParentclass(_self);
            loginFrame.init();

            dom.getElementById("sysreq_show").style.display = "";
        },{});
    }
    _self.show_back_4pwd = function(){
        dom.getElementById("sysreq_show").style.display = "none";
        _self.show_prepasscode();
    }

    // _self.createLS_game = function(){
    //     LS_game = eval("new LS_game_"+top.ls+"();");
    //     LS_game.init();
    // }

    // _self.callFrameToLoadLS = function(){
    //     if(rightPanelFrame!=null) rightPanelFrame.loadLS();
    //     if(betFrame!=null) betFrame.loadLS();
    // }

    //menu走header我的賽事流程
    _self.goToMygame = function(){
        headerFrame.doGoToMyGame();
    }

    _self.addMyEventAnimation = function(target){
        if(target.action == "add"){
            //賽事新增動畫
            if(top.nowWidth == "over1024")headerFrame.addAnimation();
            else bottomFrame.addAnimation();  
        }
        else{
            //賽事移除動畫
            if(top.nowWidth == "over1024")headerFrame.removeAnimation();
            else bottomFrame.removeAnimation();
        }
    }

    //Ricky新增 我的賽事
    _self.initMyGame = function(){
        var gtype_ary = new Array("ft","bk","bs","bm","op","sk","tt","tn","vb");

        for(var i=0;i<gtype_ary.length;i++){
            var tmpMyGameStr = (CookieManager.get(gtype_ary[i]+"_myGame_"+top["userData"].mid)!=null)?CookieManager.get(gtype_ary[i]+"_myGame_"+top["userData"].mid):"{}";//該球類賽事gid串

            // if(top["userData"].mid=="1405" && gtype_ary[i]=="ft"){
            //     tmpMyGameStr ='{"691390":{"showtype":"live","ts":""},"691392":{"showtype":"live","ts":""},"5030639":{},"8368773":{}}';
            // }

            try{
                var tmpObj = JSON.parse(tmpMyGameStr);
                //top["myGameHash"][gtype_ary[i]] = JSON.parse(tmpMyGameStr);
            }catch(e){
                console.log("[index][initMyGame]error");
                top["myGameHash"][gtype_ary[i]] = new Object();
                CookieManager.del(gtype_ary[i]+"_myGame_"+top["userData"].mid);
                continue;
            } 

            var wrongFormat = false;
            for(var ecid in tmpObj){
                if(tmpObj[ecid]["showtype"]==null){
                    wrongFormat = true;
                    break;
                    //top["myGameHash"][gtype_ary[i]][ecid] = new Object();
                }
            }

            var wrongVer = (CookieManager.get("myGameVer_"+top["userData"].mid)==null || CookieManager.get("myGameVer_"+top["userData"].mid)!=top.myGameVer);

            if(wrongFormat || wrongVer){
                console.log(gtype_ary[i]+"的cookie格式有誤，全刪了");
                top["myGameHash"][gtype_ary[i]] = new Object();
                CookieManager.del(gtype_ary[i]+"_myGame_"+top["userData"].mid);  
            }else{
                top["myGameHash"][gtype_ary[i]] = tmpObj;
            }                          
        }
        CookieManager.set("myGameVer_"+top["userData"].mid,top.myGameVer);
    } 

}
var echo = function(){};
