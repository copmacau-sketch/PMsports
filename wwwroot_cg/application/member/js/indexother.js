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
    var total_frame = 5;
    var now_frame = 0;
    var lastTouchEnd = 0;
    var doublecount = 0;
    var tmp_choice_lid = "";
    var tmp_date = "";
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
    var systemFrame = null;
    var betFrame = null;
    var SerFrame = null;
    var forecastFrame = null;
    var leagueSettingFrame = null;
    var first = null;
    var firstcode = null;
    var announcementFrame = null;
    var doubleLoginip =null;
    var first0height = null;
    var first90height = null;
    var announcementlock = false;
    var footerFrame = null;
    var cache_footer_html = null;
    var cache_footer_script = null;
    
    var util = new win.Util(win,dom);
    var config_set = new win.config_set();
    var LS;
    var LS_code;
    var LS_game;

    var CookieManager = new win.CookieManager();
    var login_4pwd_sw = "Y";
    var errorCount = 0;
    var errorTwice = false;
    var backcount = 0;
    var fixY = 15;
    var ios = util.isIOS();
    var loginComplete = false;
    var ann_sw = true;
    var betShowToMini = false;
    var otherAry = new Array("today_wagers","history_data","history_view","credit_logs");
    var myGameGtype = new Array("ft","bk","tn","vb","bm","tt","bs","sk","op");
    var isBottom = false;
    var iscloseW ="Y";
    var chkNow = false;
    var now_Page ="";
    var BodyPage ="";

    var lastHeight = null;
    var isHome = false;

    var rightPanelFrame = null;
    var rightPanel_sw = true;
    var width1024,width640,width840;
    var loginSuccess = false;

    var cuTimer = null;
    var nowTS = "";
    var game_list_ts = "";

    var cssRetFuncHash = new Object();
    var cssTotalCount = new Object();
    var cssFinishCount = new Object();
    var nowPage = "";
    var bannerCnt = 0;
    var global_protocol = dom.location.protocol.replace(":","");
    var alertShow = false;
    var nowScrollTop = 0;
    var nowBodyLock = false;
    var _ = new Object();
    _.timerObj = new Object();
    win._history = new Array();
    top["isback4pwd"] = false;
    top["fullscreen"] = false;
    top["userData"] = new Object();
    top["cmid"] = new Object();
    top["m2_url"] = util.getWebUrl()+"/transform.php";
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
    top["choice_filter"] = "";
    top["choice_sorttype"] = "L";
    top["choice_rtype"] = "r";
    top["nowPDMode"] = "all";
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
    top["bet_mini"] = false;
    top["isSameGame"] = new Array();
    top["pageTS"] = new Object();
    top["chgModelTs"] = null;
    top["specialGame"] = new Object();
    top["myGame_sw"]= null;
    top["forecast_sw"]= null;
    top["clean_data_sw"] = "N";
    top["bannerGtype"]= "OP";

    top["pageTS"]["rightTV"] = "";

    top["betholdTid_hash"] = new Object();
    top["betholdstatus_hash"] = new Object();

    top["requestFailedCount"] = 0;
    top["requestHash"] = new Object();
    top["requestFailedHash"] = new Object();

    top["specialGame"]["SW"] = true;
    top["specialGame"]["RB"] = "0";
    top["specialGame"]["FTFU"] = "0";
    top["specialGame"]["FS"] = "0";
    top["specialGame"]["Fantasy"] = "0";
    top["specialGame"]["isFantasy"] = false;
    top["specialGame"]["title"] = "";
    top["specialGame"]["isHL"] = false;
    top["specialGame"]["isTeam"] = false;
    top["specialGame"]["isStandings"] = false;
    top["specialGame"]["choice_teamID"] = "";
    top["specialGame"]["CUP_TEAM_NAME"] = new Object();
    top["specialGame"]["CUP_TEAM_FLAG"] = new Object();
    top["specialGame"]["mode"] = "";
    top["specialGame"]["clickTabTs"] = null;

    top["rightECID"] = "";
    top["rightNowPlay"] = "";
    top["resizePage"] = "";
    top["hasChgGtype"] = false;
    top["resizeMTSub"] = "";
    top["rightAllClosed"] = false;
    top["collapseClick"] = true;
    top["nowWidth"] = "less1024";
    top["loginWidth"] = "less1024";

    top["myGameHash"] = new Object();
    top["checkBackPage"] = "";
    top["myGameVer"] = "_211228";
    top["clickBackPage"]="";

    top["fantasyHash"] = new Object();

    top["verAutoUpdate"] = true;
    top["extendsClass"] = "";
    top["chgBodyDone"] = true;
    top["tab_scroll_clientWidth"] = 0;
    top["tab_total_clientWidth"] = 0;
    top["tab_left_distance"] = 0;
    top["loadAD_done"] = false;
    top["loadTeam_done"] = false;
    top["loadTab_done"] = false;
    top["betradar_season"] = "";
    top["cookieEncode_sw"] = "N";
    top["specialTitle"] = "";
    top["wagers_oldTS"] = 0;
    top["wagers_xmlnode"];
    top["wagerGtype"] = "ALL";
    top["SP_CUP_TEAM"] = "";
    top["timePoint_FT"] = new Object();
    top["timePoint_BK"] = new Object();

    top["forecastData"] = new Object();
    top["forecastResult"] = new Object();
    top["rightShowTV"] = false;
    top["p3type"] = "";
    top["lastDataHash"] = new Object();
    top["fantasy_lid"] = "";
    var myhash = {};
    var newFourPwd = "N";
    _self.paramHash = new Object();
    var familyHash = new Array();
    var gtype_ary = new Array("ft","bk","bs","bm","op","sk","tt","tn","vb");
    var notice_ver = "20240820";

    _self.init=function(){
        myhash["util"] = util;
        myhash["config_set"] = config_set;
        myhash["CookieManager"] = CookieManager;
        myhash[_self] = _self;
        var CookieChk = (CookieManager.get("CookieChk"))?CookieManager.get("CookieChk") : "";
        if(top.cookieEncode == "Y"){
            if(CookieChk == ""){
                util.CookieChkProc("encode");
            }else{
                top.cookieEncode_sw = "Y";
            }
        }else{
            if(CookieChk != ""){
                util.CookieChkProc("decode");
            }else{
                top.cookieEncode_sw = "N";
            }
        }

        _self.format_myGame();
        CookieManager.set("protocolstr", global_protocol,1);
        if(checkDomainIsM=="Y"){
            _self.goDomainRemoveM(dom.location.host);
            return;
        }
        width1024=(getView().viewportwidth >= 1024)?true:false;
        width640=(getView().viewportwidth >= 640)?true:false;
        width840=(getView().viewportwidth >= 840)?true:false;

        if(top.sub_doubleLogin=="Y")CookieManager.set("doubleLogin","double_"+new Date().getTime());
        top.iorChgSw = CookieManager.get("iorChgSw");
        if(CookieManager.get("iorChgSw")!="N"){
            CookieManager.set("iorChgSw","Y");
            top.iorChgSw = "Y";
        }
        if(top.needsTrans){
            var master_IP = util.getProtocal()+"//"+top.needsTrans;
            if(CookieManager.get("doubleLogin")){
                var sub_doubleLogin = "Y";
                CookieManager.del("doubleLogin");
                util.topGoToUrl(master_IP,{"sub_doubleLogin":sub_doubleLogin});
            }else{
                util.topGoToUrl(master_IP);
            }
            return;
        }

        setTimeout(_self.firsttack,500)

        win.addEventListener("message", _self.onMessage, false);
        _self.loadFile();

        config_set.init();
        // _self.checkIos15();
        _self.clearAllOpenWindow();
        _self.chg_langx(top.ls);
        _self.setFamilyHash();
        if (win.addEventListener) win.addEventListener("popstate", _self.popstate);
        if (win.addEventListener) win.addEventListener("orientationchange", _self.orientation);
        if (win.addEventListener) win.addEventListener("resize", orientationblur);
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
        _self.addEventListener("mini_bet", _self.mini_bet);
        _self.addEventListener("showSpecialTitle", _self.showSpecialTitle);
        _self.addEventListener("rollBottom", _self.rollBottom);
        _self.addEventListener("setBottomTodayWagers", _self.setBottomTodayWagers);
        _self.addEventListener("auto_update", _self.auto_update);
        _self.addEventListener("systemreq", _self.systemreq);
        _self.addEventListener("goToip_guide", _self.systemreq);
        _self.addEventListener("noCloseWindow", _self.noCloseWindow);
        _self.addEventListener("closePCResult", _self.closePCResult);
        _self.addEventListener("addMyEventAnimation", _self.addMyEventAnimation);
        _self.addEventListener("showGreenBtnProc", _self.showGreenBtnProc);
        _self.addEventListener("goToMygame", _self.goToMygame);
        _self.addEventListener("chkGame", _self.chkGame);
        _self.addEventListener("initMyGame", _self.initMyGame);
        _self.addEventListener("lastBodyPage", _self.lastBodyPage);
        _self.addEventListener("showFantasyInfo", _self.showFantasyInfo);
        _self.addEventListener("bet_showFantasyInfo", _self.bet_showFantasyInfo);
        _self.addEventListener("getFantasyInfoProc", _self.getFantasyInfoProc);
        _self.addEventListener("specialRename", _self.specialRename);
        _self.addEventListener("closeGameLoading", _self.closeGameLoading);


        _self.addEventListener("loadRightScore", _self.loadRightScore);
        _self.addEventListener("resetRightTV", _self.resetRightTV);
        _self.addEventListener("playRightTV", _self.playRightTV);
        _self.addEventListener("resizeMTEvent", _self.resizeMTEvent);
        _self.addEventListener("setRightTVDefaultPlay", _self.setRightTVDefaultPlay);
        _self.addEventListener("setRightVisible", _self.setRightVisible);
        _self.addEventListener("checkRightLive", _self.checkRightLive);
        _self.addEventListener("parseRightScoreBoard", _self.parseRightScoreBoard);
        _self.addEventListener("parseNoGameRightScoreBoard", _self.parseNoGameRightScoreBoard);
        _self.addEventListener("chkTvPlaying", _self.chkTvPlaying);
        _self.addEventListener("rightResizeEvent", _self.rightResizeEvent);
        _self.addEventListener("setRightLoading", _self.setRightLoading);
        _self.addEventListener("resizeRightLive", _self.resizeRightLive); 
        _self.addEventListener("noGameCheckLive", _self.noGameCheckLive);
        _self.addEventListener("showBigRightLoading", _self.showBigRightLoading);
        _self.addEventListener("setBodyShowClass", _self.setBodyShowClass);
        _self.addEventListener("removeBodyShowClass", _self.removeBodyShowClass);
        _self.addEventListener("goToSpecialPage", _self.goToSpecialPage);
        _self.addEventListener("setRightTimer", _self.setRightTimer);
        _self.addEventListener("createLS_game", _self.createLS_game);
        _self.addEventListener("initBackCount", _self.initBackCount);

        _self.addEventListener("resetHeaderTimer", _self.resetHeaderTimer);
        _self.addEventListener("getIovationBlackBox", _self.getIovationBlackBox);
        
        _self.addEventListener("showForecast", _self.showForecast);
        _self.addEventListener("showLegSetting", _self.showLegSetting);
        _self.addEventListener("updateForecast", _self.updateForecast);
        _self.addEventListener("restartTimer", _self.restartTimer);
        _self.addEventListener("resetForecast", _self.resetForecast);
        _self.addEventListener("chkBannerCount", _self.chkBannerCount);
        _self.addEventListener("intoGame", _self.intoGame);
        _self.addEventListener("getPgCnt", _self.getPageCount);
        _self.addEventListener("forecastBtnOn", _self.forecastBtnOn);
        _self.addEventListener("loadDelayReason", _self.loadDelayReason);
        _self.addEventListener("GoHome", _self.reGoHome);
        _self.addEventListener("setFooterTimetype", _self.setFooterTimetype);
        _self.addEventListener("updateTime", _self.updateTime);
        _self.addEventListener("updateScrollTop", _self.updateScrollTop);
        _self.addEventListener("hideCash", _self.hideCash);
        _self.addEventListener("setIorChg", _self.setIorChg);
        _self.addEventListener("goToChgSort", _self.goToChgSort);
        _self.addEventListener("closeLeagueSetting", _self.closeLeagueSetting);
        _self.addEventListener("showLeagueFilter", _self.showLeagueFilter);
        _self.addEventListener("updateNowFilter", _self.updateNowFilter);
        _self.addEventListener("setNowBodyLockStatus", _self.setNowBodyLockStatus);
        
        
        

        top["local_storage"] = _self.getLocalStorage();
        if(top["local_storage"] == "initFail"){
            document.getElementById("acc_show").classList.add("pass_outside");
            _self.private();
            return;
        }
   
        if(top.mobile == "Y"){
            var main = dom.getElementById("main");
            main.classList.add("mobile");
            if(ios){
                util.addEvent(dom.getElementById("scroll_html"), "touchmove", _self.iosScroll);
                util.addEvent(dom.getElementById("scroll_html"), "wheel", _self.iosScroll);
                util.addEvent(dom.body, "touchend", _self.ios_blur);
                util.addClass(main, "main_ios");
            }
        }

        _self.clearSerTimer();
        _self.createSerTimer();
        _self.createNetTimer();
        util.setParentclass(_self);

        if(_CHDomain.uid != ""&&_CHDomain.uid !=null&&_CHDomain.uid !=undefined)
		{   
            _self.setLoadingVisible(true);
            
            for(var key in _CHDomain)
			{
				top["userData"][key] = _CHDomain[key];
            }
            
            if(top["userData"].domain=="")_self.CheckDomain();
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

            _self.goToPage("system_show", "system_msg", function(){
                try{
                    systemFrame = new win.system_msg(win,dom);
                    systemFrame.setParentclass(_self);
                    systemFrame.init();
                }catch(e){
                    util.err("[system_msg]", e);
                }
            },{});

            if(top["userData"].newalertMsg=="Y" && top["userData"].msg=="goToPasscode") newFourPwd = "Y";

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
                    myhash["loginFrame"]  = loginFrame;
                    loginFrame.setParentclass(_self);
                    _self.reloed_memset(_self.check_Complete);
                    _self.SerrefreshPage();
                },{});
            }

            _self.goToPage("icon_all", "icon_all", function(){},{});
			return;
		}else if(top.QRdata){
            firstcode = true;
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

            _self.goToPage("system_show", "system_msg", function(){
                try{
                    systemFrame = new win.system_msg(win,dom);
                    systemFrame.setParentclass(_self);
                    systemFrame.init();
                }catch(e){
                    util.err("[system_msg]", e);
                }
            },{});

            _self.goToPage("icon_all", "icon_all", function(){},{});

            _self.goVerifyQR();
        }else{
            _self.SerrefreshPage(true);
        }
    }

    _self.goVerifyQR = function(){
        var urlParams= "";
        urlParams += "&langx="+top.langx;
        urlParams += "&q="+top.QRdata;

        urlParams = "p=go_verifyQR&ver="+top.ver+"&"+urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("LoadComplete", _self.verifyQRComplete);
        getHTML.loadURL(top.m2_url,"POST",urlParams);
    }

    _self.verifyQRComplete = function(xml){
        if(xml.indexOf("CheckIOSapp error")!=-1) {
            alert("Attention! Illegally logining.");
            return;
        }

        var errorMsg = util.showConnectMsg(xml);
        if(util.alertConnectMsg(errorMsg))	return;
        

        try{
            xmlnode = util.parseXml(xml);
            var status = xmlnode.Node(xmlnode.Root[0],"status").innerHTML;
            if(status=="999" || status=="998" ||  status=="997" || status=="error"){
                var msg = xmlnode.Node(xmlnode.Root[0],"err_code").innerHTML;
                _self.showQRexpired(msg);
                return;
            } else{
                var msg = xmlnode.Node(xmlnode.Root[0],"msg").innerHTML;
                var username = xmlnode.Node(xmlnode.Root[0],"username").innerHTML;
                var mid = xmlnode.Node(xmlnode.Root[0],"mid").innerHTML;
                var uid = xmlnode.Node(xmlnode.Root[0],"uid").innerHTML;
                var ltype = xmlnode.Node(xmlnode.Root[0],"ltype").innerHTML;
                var currency = xmlnode.Node(xmlnode.Root[0],"currency").innerHTML;
                var odd_f = xmlnode.Node(xmlnode.Root[0],"odd_f").innerHTML;
                var domain = xmlnode.Node(xmlnode.Root[0],"domain").innerHTML;
                var pay_type = xmlnode.Node(xmlnode.Root[0],"pay_type").innerHTML;
            }
        }catch(e){
            console.err(e);
            return;
        }

        if(status=="200"){
            top["userData"].uid = uid;
            top["userData"].pay_type = pay_type;
            top["userData"].username = username;
            top["userData"].passwd_safe  = username;
            top["userData"].mid = mid;
            top["userData"].ltype = ltype;
            top["userData"].currency = currency;
            top["userData"].odd_f = odd_f;
            top["userData"].domain = domain;
            top.param = "uid="+top["userData"].uid+"&ver="+top.ver+"&langx="+top.langx;
            var firstodd = odd_f.split(",");
            top["userData"].odd_f_type = "H";
            top["userData"].timetype = "sysTime";
            var odds_length = top['userData'].odd_f.split(",");
            if(CookieManager.get("odd_f_type_"+top["userData"].mid)){
                for(var i = 0;i < odds_length.length;i++){
                    if(odds_length[i] == CookieManager.get("odd_f_type_"+top["userData"].mid)){
                        top["userData"].odd_f_type = CookieManager.get("odd_f_type_"+top["userData"].mid);
                    }
                }
            }
            
            if(msg=="109"){
                top["memSet"] = new Object();
                _self.showchg_id();
            }
        }else{
            console.log("error status !=200");
            var login_errMsg = "xml error >> mid:"+mid+",xml:"+xml+",QRdata:"+top.QRdata;
            util.writeLoginErrLog(classname,login_errMsg);

            var err_msg = LS_code.get("loginFormatError");
            if(msg=="ip error"){
                err_msg = LS_code.get("ipv6Error");
            }
            
            loginFrame.system_error(err_msg);
        }
    }

    _self.showQRexpired=function(_post){
        _self.setLoadingVisible(true);
        
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";

        _self.goToPage("acc_show", "expired", function(){
            loginFrame = new expired(win,dom,null);
            loginFrame.setParentclass(_self);
            loginFrame.init();
            loginFrame.showMsg(_post);
            dom.getElementById("acc_show").style.display = "";
        },{});
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
        top.outrightsClick = "";
        headerFrame.getSpecCount(par);
    }

    _self.reloed_memset =function(completeFun){
         var action = "check";
         var urlParams= "";
         urlParams += "uid="+top["userData"].uid;
         urlParams += "&langx="+top.langx;
         urlParams += "&action="+action;

         urlParams = "p=memSet&ver="+top.ver+"&"+urlParams;
         var getHTML = new HttpRequest();
         getHTML.addEventListener("LoadComplete", completeFun);
         getHTML.loadURL(top.m2_url,"POST",urlParams);
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
                if(tmpOrientation==90){
                    top.nowWidth = "over1024";
                    _self.removebodylock();
                    if(rightPanelFrame==null && loginSuccess){
                        _self.showBigRightLoading(true);        
                        _self.goToPage("right_show", "right_panel", function(){
                            rightPanelFrame = new win.right_panel(win,dom,null);
                            rightPanelFrame.setParentclass(_self);
                            rightPanelFrame.init();
                            _self.showBigRightLoading(false);
                            if(top.resizePage=="game_list"||top.resizePage=="game_more"){
                                rightPanelFrame.setRightLoading(true);
                                rightPanelFrame.loadRightScore({"scFun":bodyFrame.resizeEvent});
                                rightPanelFrame.showRightMsg(true);
                            }
                            else if(top.resizePage=="other"&&top.rightECID!=""){
                                rightPanelFrame.setRightLoading(true);
                                rightPanelFrame.loadRightScore({"scFun":rightPanelFrame.getData});
                            }
                        },{});
                    }else if(rightPanelFrame!=null){
                        
                        var hasLoad = rightPanelFrame.chkRightScore();
                        if(top.resizePage=="game_list"||top.resizePage=="game_more"){    
                            rightPanelFrame.setRightLoading(true);
                            rightPanelFrame.loadRightScore({"scFun":bodyFrame.resizeEvent});
                        }

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
                        rightPanelFrame.showRightMsg(true);
                    }
                    var nowPage = _self.getNowPage();
                    if(util.in_array(nowPage,otherAry)){
                        _self.showBackTopBtn();
                    }
                    if(util.countSize(top.bet_select) > 0 && !top.openBets){
                        top.betMode = "total"; 
                        _self.showBetSlip({"isShow":true,"minimize":true});                        
                    }  
                }else{
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
                    if(rightPanelFrame)rightPanelFrame.showRightMsg(false);
                    if(top.openBets){
                        _self.hideAlertMsg({"use":"noPopMainClear"});
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
                mainObj.className = "main_height"+" "+lls.toUpperCase()+" mobile";
            }else{
                mainObj.className = "main_height"+" "+lls.toUpperCase()+" main_ios mobile";
            }
            setTimeout(_self.classchang,500,mainObj,oldmainObj);
        }
    }

    _self.first90 =function(){
        first90height = win.innerHeight;
    }

    _self.classchang = function(mainObj,oldmainObj){
        mainObj.className = oldmainObj;

        var now_width640 = (getView().viewportwidth >= 640);
        if(width640!=now_width640 && top.resizePage=="game_list"){
            width640 = now_width640;
            bodyFrame.orientation90or0();
        }

        var now_width840 = (getView().viewportwidth >= 840);
        if(width840!=now_width840 && top.resizePage=="game_list"){
            width840 = now_width840;
        }
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
    }

    _self.getThis=function(varible){
        if(!myhash[varible]) {
            if(typeof(varible)=="string"){
                var msg = "no myhash["+varible+"]";
            }else {
                try{
                    var msg = "no myhash["+JSON.stringify(varible)+"]";
                }catch(e){
                    console.error(e);
                }
            }
            util.writeLog(classname, msg);
        }
        return myhash[varible];
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

        _self.goToPage("system_show", "system_msg", function(){
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
            myhash["loginFrame"]  = loginFrame;
            loginFrame.setParentclass(_self);
            loginFrame.init();
            if(errMsg)loginFrame.system_error(errMsg);
            dom.getElementById("acc_show").style.display = "";
            _self.chkDoubleLogin();
        },{});

        _self.goToPage("icon_all", "icon_all", function(){},{});
    }

    _self.callApp = function(par){
        var msg = par.msg;
        try {
            Android.callFunction(msg);
        }catch(e){
            try {
                window.webkit.messageHandlers.systemCall.postMessage(msg);
            }catch(e){	      	

            }	      
        }
    }

    _self.showchg_id=function(){
        _self.clearSerTimer();
        _self.setLoadingVisible(true);
        firstchgid = true;
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";
        firstcode = false;
        _self.goToPage("chgAcc_show", "chg_id", function(){
            loginFrame = new win.chg_id(win,dom,null);
            myhash["loginFrame"]  = loginFrame;
            loginFrame.setParentclass(_self);
            loginFrame.init();

            dom.getElementById("chgAcc_show").style.display = "";
        },{});
        
    }

    _self.login_help=function(){
        _self.clearSerTimer();
        _self.setLoadingVisible(true);
        
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";

        _self.goToPage("chgAcc_show", "first_login_help", function(){
            loginFrame = new win.first_login_help(win,dom,null);
            myhash["loginFrame"]  = loginFrame;
            loginFrame.setParentclass(_self);
            loginFrame.init();

            dom.getElementById("chgAcc_show").style.display = "";
        },{});
        
    }

    _self.show_prepasscode=function(){
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

        _self.goToPage("system_show", "system_msg", function(){
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
            myhash["loginFrame"]  = loginFrame;
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
                var usedTime = _self.getDoubleLoginTs();
                if(usedTime < 10) _self.doubleLoginchk();
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

    _self.show_back_login=function(param){
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

    _self.loadDelayReason = function(){
        if(bodyFrame && bodyFrame.loadDelayReason){
            bodyFrame.loadDelayReason();
            bodyFrame.loadTodayWager();
        }
    }


    _self.loginSuccess=function(){
        if(top.blackBoxStatus == "N" || !top.blackBoxStatus){
            _self.getIovationBlackBox();
        }
        if(top["userData"].msg=="104" && top['userData'].four_pwd=="new"){
            firstcode=null;
            firstchgid=false;
        }else if(top["userData"].msg=="104"){
            firstcode=null;
        }
        top["userData"].msg="";
        loginSuccess = true;
        CookieManager.del("choice_lea_"+top['userData'].mid);

        _self.initMyGame();

        if(top["userData"].go_to_new_site=="Y" && top["userData"].msg!="already_104"){
            var abox4pwd_notshow = {};
            var inputUID = top["userData"].passwd_safe.toLowerCase().trim();
            var cookiePID = CookieManager.get("PID");
            var cookieUID = (cookiePID)?CookieManager.get("UID"):"";


            if(CookieManager.get("box4pwd_notshow_"+top['userData'].mid) != null){  
                 abox4pwd_notshow = CookieManager.get("box4pwd_notshow_"+top['userData'].mid).split("_");
            }
           
            if((!top["memSet"].passcode && cookiePID) || (!top["memSet"].passcode && !cookiePID) || !top["memSet"].passcode || top["memSet"].passcode=="[del]" || top["memSet"].passcode=="[del1]" ){
                top['userData'].four_pwd = "new";
                top['userData'].abox4pwd_notshow = abox4pwd_notshow[1];
            }else if((top["memSet"].passcode && !cookiePID) || (cookieUID != top["userData"].passwd_safe || !CookieManager.get("UID"))){
                top['userData'].four_pwd = "second";   
                top['userData'].abox4pwd_notshow = abox4pwd_notshow[1];
            }else if(top["errorTwice"] && cookieUID.toLowerCase().trim() == inputUID){
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
        _self.goToPage("body_show", "footer", function(){
            footerFrame = new win.footer(win,dom,null);
            footerFrame.setParentclass(_self);
            footerFrame.init();
        },{});
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
            myhash["headerFrame"]  = headerFrame;
            headerFrame.setParentclass(_self);
            headerFrame.init();

            _self.goToPage("myAcc_show", "right_menu", function(){
                rightFrame = new win.right_menu(win,dom,null);
                rightFrame.setParentclass(_self);
                rightFrame.init();
                headerFrame.setRightPanel();
            },{});
        },{});
        if(getView().viewportwidth >= 1024){
            top.nowWidth = "over1024";
            top.loginWidth = "over1024";
            _self.showBigRightLoading(true);
            _self.goToPage("right_show", "right_panel", function(){
                rightPanelFrame = new win.right_panel(win,dom,null);
                rightPanelFrame.setParentclass(_self);
                rightPanelFrame.init();
                _self.showBigRightLoading(false);
            },{});
        }
        
        _self.bodyGoToPage({"page":"home","retFun":_self.checkLastHistory});
        
    }

    _self.reGoHome = function(){
        _self.bodyGoToPage({"page":"home","retFun":_self.checkLastHistory});
    }

    _self.checkLastHistory = function(){
        if(top["userData"].ver){
            console.log("version updating...", _history);
        }
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
                    }else{
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
                }else{
                    dom.getElementById("maintain_show").style.display = "";
                    _self.CheckDomain();
                }
            }
        }else{
            _self.createDomTimer();
            dom.getElementById("maintain_show").style.display = "";
            if(top["userData"].newalertMsg == "Y" && newFourPwd=="Y"){
                setTimeout(_self.passcode,2000);
                _self.IsGamechk("passcode");
            }else{
                _self.checkCount();
            }
            
        }
        _self.messagechk();
        _self.createMesTimer();
        _self.createMemTimer();
        _self.createVerTimer();
        _self.createMemOnlineTimer();
        if(top.myGame_sw && clean_data_sw != "Y"){
            chkNow = true;
            _self.showMyGameProc(true,clean_data_sw,chkNow,"first_login");
        }
    }

    _self.mini_bet = function(param){
            var bet_size = util.countSize(top["bet_select"]);
            var bet_totalSize = util.countSize(top["totalBetHash"]);
            var minimize = (param.minimize)?true:false;
            var rightMsg_sw = (param.rightMsgStatus)?true:false;

            if(rightMsg_sw){
                if(top["isOrderView"]) betFrame.addTotal(null, {"xmlnode":top["fastBetXML"], "gameObj":top["fastBetGameObj"], "betData":top["fastBetHash"], "rightMsg_sw":rightMsg_sw});
                else betFrame.closeBet(true);
                return;
            }
            var miniOrientation = win.Math.abs(win.orientation);
            if(minimize){
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
            else if((!top.openBets || rightMsg_sw) && bet_size != 0 && (getView().viewportwidth >= 1024 || miniOrientation==90)){
                top.bet_mini = true;
                util.addClass(param.betDiv, "mini");
                util.removeClass(param.betDiv, "off");
                if(betShowToMini)betShowToMini=false;
                else betFrame.addBounce();
            }
            if((getView().viewportwidth < 1024 && miniOrientation!=90 )&& top.bet_mini){
                top.bet_mini = false;
                util.addClass(param.betDiv, "off");
                util.removeClass(param.betDiv, "mini");
                util.removeClass(param.betDiv, "minimize");
                betShowToMini=true;
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
                util.addClass(dom.getElementById("bet_show"), "_no_animation");
                util.removeClass(betDiv, "off");
                betFrame.showOrder(param.xmlnode, param.gameObj, param.paramHash, param.isRepeat, param.isSameEcid);
            }else{
                util.addClass(betDiv, "on");
                betShowToMini=true;
                util.removeClass(betDiv, "off");
                betFrame.showOrder(param.xmlnode, param.gameObj, param.paramHash, param.isRepeat, param.isSameEcid);
            }
            
        }else{
            betFrame.setSetVisible(false);
            betFrame.clearOVTimer();
            _self.hideAlertMsg({"use":"bet_nopop"});
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
        var _count = util.countSize(top["bet_select"]);
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
        if(firstcode == null){
            if(getView().viewportwidth >= 1024)total_frame = 6;
            echo("[checkCount] now="+now_frame+" vs total="+total_frame);
            if(now_frame >= total_frame){
                var cookieUID = (CookieManager.get("UID"))? CookieManager.get("UID") : "";
                dom.getElementById("home_show").style.display = "";
                if(cookieUID == top["userData"].passwd_safe && top['userData'].four_pwd != "second"){
                    if(ann_sw && top.memSet.passcode != "[del]")_self.chkann();
                }else if(top["userData"].abox4pwd_notshow == "Y"){
                    if(ann_sw)_self.chkann();
                }else if(cookieUID != top["userData"].passwd_safe && top['userData'].four_pwd==undefined){
                    if(ann_sw)_self.chkann();
                }
                if(now_frame==(total_frame+1)){
                    if(ios){
                        dom.getElementsByTagName("html")[0].classList.add("ios_scroll"); 
                    }
                    loginComplete= true;
                    dom.getElementById("home_show").classList.remove("outside");
                    _self.setLoadingVisible(false);
                }
                _self.SerrefreshPage();
                _self.membercashchk();
            }
        }else{
            (getView().viewportwidth >= 1024)?total_frame = 7:total_frame = 6;
            echo("[checkCount] now="+now_frame+" vs total="+total_frame);
            if(now_frame >= total_frame){
                if(top["errorTwice"] != true){
                    top['userData'].four_pwd = "";
                }
                _self.SerrefreshPage();
                _self.membercashchk();
                if(top['userData'].four_pwd != "new" && ann_sw)_self.chkann();
                if(now_frame==(total_frame+1)){
                    loginComplete= true;
                    dom.getElementById("home_show").classList.remove("outside");
                    if(ios)dom.getElementsByTagName("html")[0].classList.add("ios_scroll");
                    _self.setLoadingVisible(false);
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
        getHTML.loadURL(top.m2_url, "POST", urlParams);
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
        myhash["timerHash"] = timerHash;
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

   _self.bodyGoToPage=function(param){
        if(!param.extendsClass)util.removeClass(dom.getElementById("body_content"),"bg_game");
        if(footerFrame!=null)footerFrame.stopTimer();
        if (bodyFrame && bodyFrame.exitConfirm && !bodyFrame.LeaveChk && !param.LeaveChkPass) {
            _self.exitConfirm(_self.bodyGoToPage, param, bodyFrame.exitConfirm);
            return;
        }else if(param.specialClick == "special" && param.kind && top.resizePage=="game_list" && param.from != "pic"){
            top.chgBodyDone = false;
            if(dom.getElementById("game_loading"))util.addClass(dom.getElementById("game_loading"),"loading_on");
            var copyObj = dom.getElementById("body_show");
            _self.createBak(copyObj);
            BodyPage = param.page;
            top["fantasyHash"] = new Object();

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
                        if(param.back == "Y" && top.outrightsClick==""){
                            if(top.specialClick == "special")headerFrame.chgHeadCss(param.showtype, "special");
                            else {
                                if(param.isMyGame == "Y" && param.page.indexOf("game_more")!=-1) headerFrame.chgHeadCss("mygame");
                                else headerFrame.chgHeadCss(param.showtype);

                                if(param.showtype == "mygame")bottomFrame.chgBottomCss("mygame");
                            }
                        }else{
                            if(top.outrightsClick == "outrights")headerFrame.chgHeadCss(param.showtype, "outrights");
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

            var isGoToGame = _self.chkGoToGame(param.page);
            if(isGoToGame){
                if(rightPanelFrame!=null){
                    if(top.choice_rtype!="fs"){
                        rightPanelFrame.stopTimer();
                    }
                    if(top.choice_rtype=="fs" && top.rightECID!="" && getView().viewportwidth >= 1024){
                        rightPanelFrame.createTimer();
                        rightPanelFrame.startTimer();
                    }
                    top.rightAllClosed = false;
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
            if(forecastFrame!=null)forecastFrame.closeForecast();

            if(ret){
                ret = _self.clearAllTimer();
                if(ret) _self.goToPage("body_show_bak", param.page, _self.definedParent, param);
            }
        }else{
            BodyPage = param.page;
            if(param.postHash && param.postHash.lid){
                tmp_choice_lid = param.postHash.lid;
                if(param.postHash.date)tmp_date = param.postHash.date;
            }
            else if(BodyPage == "game_list_FT" && !param.postHash.lid){
                tmp_choice_lid = "";
                tmp_date = "";
            }
            top["fantasyHash"] = new Object();
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
                        if(param.back == "Y" && top.outrightsClick==""){
                            if(top.specialClick == "special")headerFrame.chgHeadCss(param.showtype, "special");
                            else {
                                if(param.isMyGame == "Y" && param.page.indexOf("game_more")!=-1) headerFrame.chgHeadCss("mygame");
                                else headerFrame.chgHeadCss(param.showtype);
                                if(param.showtype == "mygame" || param.isMyGame == "Y")bottomFrame.chgBottomCss("mygame");
                            }
                        }else{
                            if(top.outrightsClick == "outrights")headerFrame.chgHeadCss(param.showtype, "outrights");
                            if((param.postHash.allmarket == "Y" || param.goToRB == "Y") && !param.specialClick){
                                top.choice_showtype = param.showtype;
                                headerFrame.chgHeadCss(param.showtype); 
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

            if(param.page == "home"){
                top.specialClick = "";
                top.outrightsClick = "";
                top.specialGame.isFantasy = false;
                top.specialGame.isHL = false;
                top.specialGame.isTeam = false;
                top.specialGame.isStandings = false;
                top.specialGame.cup_page = "";
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
                    top.rightShowTV = false;
                }
            }

            var isGoToGame = _self.chkGoToGame(param.page);
            if(isGoToGame){
                if(rightPanelFrame!=null){
                    if(top.choice_rtype!="fs"){
                        rightPanelFrame.stopTimer();
                    }
                    if(top.choice_rtype=="fs" && top.rightECID!="" && getView().viewportwidth >= 1024){
                        rightPanelFrame.createTimer();
                        rightPanelFrame.startTimer();
                    }
                    top.rightAllClosed = false;
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
            if(forecastFrame!=null)forecastFrame.closeForecast();
            
            if(ret){
                ret = _self.clearAllTimer();
                if(ret) _self.goToPage("body_show", param.page, _self.definedParent, param);
            }
        }
    }

    _self.createBak=function(obj){
        if(obj!=null){
            var _id = obj.getAttribute("id");
            var bakObj = dom.getElementById(_id+"_bak");

            if(bakObj==null){
                bakObj = dom.createElement("div");
                bakObj.setAttribute("id", _id+"_bak");
                bakObj.setAttribute("class", "box_l");
                bakObj.style.display = "none";
                obj.parentNode.insertBefore(bakObj,obj);
                dom.getElementById("div_show").innerHTML="";
            }
        }
    }

    _self.specialRename=function(par){
        var _id = par._id;
        var dom = par.dom;
		var orgObj = dom.getElementById(_id);
        var bakObj = dom.getElementById(_id+"_bak");

		if(orgObj==null||orgObj.tagName==null||bakObj==null||bakObj.tagName==null){
				return;
		}

		var orgName = _id;
		var bakName = _id+"_bak";

        if(bakObj.innerHTML!=""){
            orgObj.setAttribute("id", bakName);
            bakObj.setAttribute("id", orgName);
    
            dom.getElementById(_id).style.display = "";
            util.addClass(dom.getElementById(_id),"bg_game");
            dom.getElementById(_id+"_bak").style.display = "none";
            dom.getElementById(_id+"_bak").parentNode.removeChild(dom.getElementById(_id+"_bak"));
            if(dom.getElementById("tab_scroll"))dom.getElementById("tab_scroll").scrollLeft = top.tab_left_distance;
        }
    }

    _self.goToPageEvent=function(param){
        param.isTrans = "Y";
        var retFunc = ( param.useDefineParent=="Y")? _self.definedParent : param.retFun;
        _self.goToPage(param.target, param.page, retFunc, param);
    }

    _self.goToPage=function(target, page, retFun, param){
        clearTimeout(retryTimer);
        if(page != "forecast"){
            alertShow = false;
            nowScrollTop = 0;
        }
        if(!failCount[page]) failCount[page] = 0;
        var str_isRB = (param.isRB!=null)?param.isRB:"N";
        var post = "";
        try{
            post = param["post"];
        }catch(e){}
        var str_showtype = (page.indexOf("game")!=-1||page=="right_score"||page=="features"||page=="sport_menu"||page=="rules_general"||page.indexOf("league")!=-1)? "_"+post: "";
        var page_name = target+"_"+page+str_showtype+"_"+top.ver;
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
            failCount[page] = 0;

            var tempHtml = new win.parseHTML(html);
            var dbody = tempHtml.getTag("div")[0];
            var sty = tempHtml.getTag("style");
            var scp = tempHtml.getTag("script");
            var alink = tempHtml.getTag("link");
            if(page=="footer"){
                cache_footer_html = dbody;
                cache_footer_script = scp[0].innerHTML;
                return;
            }else if(target=="body_show" || target=="body_show_bak"){
                if(cache_footer_html!=null || cache_footer_script!=null){
                    dbody.appendChild(cache_footer_html);
                    scp[0].innerHTML+=cache_footer_script;
                }else if(page=="home"){
                    setTimeout(_self.reGoHome,1000);
                    return;
                }
            }
            var ts = "";
            if((!param.useDefineParent || page == "sport_menu") && scp[1] && scp[1].id == "ts"){
                ts = scp[1].innerHTML;
                if(ts != 0 && ts != "" && ts != top["lastClickTS"]){
                    console.log('[錯誤][',page,'][goToPage][ts]======>',ts,"[top.lastClickTS]=======>",top["lastClickTS"]);
                    return;
                }
            }
            if(!dbody){
                try{
                    var errHash = JSON.parse(html);
                    if(util.chkErrorMsg(errHash,LS_code)) return;
                }catch(e){
                    util.err("[load html error]"+page, e);
                    return;
                }
            }
            var ret = true;
            if((target=="body_show" || target=="body_show_bak") && nowPage!=""){
                _self.clearHead(nowPage);
            }
            if(ret){
                var jsObj = new Object();

                for(var j=0; j<scp.length; j++){
                    if(scp[j].id == "ts")continue;
                    _self.createJS({"page":page, "scpt":scp[j]});
                    jsObj[page+"_"+j] = scp[j];
                }

                cssFinishCount[tmpKey] = 0;
                cssTotalCount[tmpKey] = alink.length;
                var ver = top.ver;
                var cssObj = new Object();
                for(i=0;i<alink.length;i++) {
                    _self.createCSS({"page":page, "pageKey":tmpKey, "link":alink[i], "ver":ver, "ts":ts});
                    cssObj[page+"_"+i] = alink[i];
                }
                pageHash[page_name] = new Object();
                pageHash[page_name]["script"] = jsObj;
                pageHash[page_name]["style"] = cssObj;

                dbody.innerHTML = _self.load_art(dbody.innerHTML,artjson,top.langx);
                if(target=="body_show" || target=="body_show_bak")dbody.innerHTML = _self.load_art(dbody.innerHTML,footer_artjson,top.langx);
                pageHash[page_name]["html"] = dbody.innerHTML;
                dom.getElementById(target).innerHTML = dbody.innerHTML;

                _self.createTitle();  
                _self.clearDuplicate();  
                if(page == "home" && !top["homefirst"]){
                    _self.chkFourPwdProc();
                }
            }
        });
        var isCUP = (top.specialGame.mode=="CUP" && top.specialClick=="special");
        if(cache_html_sw && pageHash[page_name] && page != "rules_general" && page != "features" && !isCUP){
            if((target=="body_show" || target=="body_show_bak") && nowPage!=""){
                _self.clearHead(nowPage);
            }
            if(page=="home"&&param.rightLoading=="slowlyClose")_self.setRightLoading(false);
            var pageName = page;
            cssFinishCount[tmpKey] = 0;
            cssTotalCount[tmpKey] = util.countSize(pageHash[page_name]["style"]);
            for(var key in pageHash[page_name]["script"]){
                _self.createJS({"page":pageName, "scpt":pageHash[page_name]["script"][key]});
            }
            for(var key in pageHash[page_name]["style"]){
                _self.createCSS({"page":pageName, "pageKey":tmpKey, "link":pageHash[page_name]["style"][key], "ver":top.ver ,"ts":param.nowTS});
            }
            dom.getElementById(target).innerHTML = pageHash[page_name]["html"];
        }else{
            var _post = "p="+page+"&ver="+top.ver+"&langx="+top.langx;
            if(top["userData"].uid!="")_post+="&uid="+top["userData"].uid;
            if((!param.useDefineParent || page == "sport_menu")){
                var tmpTS = (param.nowTS)?param.nowTS:"";
                if(tmpTS && tmpTS != ""){
                    _post += "&ts=" + tmpTS;
                }
            }
            if(param.action == "goTo"+top["bannerGtype"] && param.ball != ""){
                ball_target = _self.transBall(param.ball);
                param.post = "ball="+ball_target;
            }
            if(page == "features" && param.data)param.post = "data="+param.data;
            if(param.post) _post+="&"+param.post;
            ht.loadURL(top.m2_url, "POST" , _post);
        }
    }

    _self.transBall = function(gtype){
        var ball = new Array();
        ball["FT"] = "football";
        ball["BK"] = "basketball";
        ball["BS"] = "baseball";
        ball["TN"] = "tennis";
        ball["VB"] = "volleyball";
        ball["BM"] = "badminton";
        ball["TT"] = "table_tennis";
        ball["SK"] = "snooker";
        return ball[gtype];
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
                util.addEvent(_link, "load", _self.cssLoad, {"page":param["pageKey"],"ts":param["ts"]});
                util.addEvent(_link, "error", _self.cssLoad, {"page":param["pageKey"],"ts":param["ts"]});

                var tmp_protocol = tarLink.href.split(":")[0];
                var _url = tarLink.href.split(":")[1];
                var new_url = tarLink.href;
                if(tmp_protocol != global_protocol){
                    new_url = global_protocol +":"+ _url;
                    CookieManager.set("protocolstr", global_protocol,1);
                }
                var ver = "?ver="+param["ver"];
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
            if(cssRetFuncHash[param["page"]] && cssRetFuncHash[param["page"]]["func"]) cssRetFuncHash[param["page"]]["func"](cssRetFuncHash[param["page"]]["param"],param["ts"]);
            delete cssRetFuncHash[param["page"]];
        }
    }

    _self.SetConfirmExit = function (param) {
        bodyFrame.LeaveChk = false;
        bodyFrame.exitConfirm = param;
        myhash["bodyFrame"] = bodyFrame;
    }

    _self.closeConfirmExit = function () {
        bodyFrame.LeaveChk = null;
        bodyFrame.exitConfirm = null;
        myhash["bodyFrame"] = bodyFrame;
    }

    _self.exitConfirm = function (retFun, param, confirm_par) {
        if (confirm_par.isEdit && !confirm_par.isEdit()){
            bodyFrame.LeaveChk = true;
            myhash["bodyFrame"] = bodyFrame;
            retFun(param);
            return;
        }
        _self.setLoadingVisible(false);
        _self.showAlertMsg({ "target":confirm_par["Alert"].target, "msg":confirm_par["Alert"].msg, "confirm":confirm_par["Alert"].mode, "retFun": function (msg) {
            if (msg == "yes") {
                bodyFrame.LeaveChk = true;
                myhash["bodyFrame"] = bodyFrame;
                if (confirm_par.ifYes) {
                    confirm_par.ifYes(confirm_par.YesParam);
                }
                retFun(param);
            } else {
                bodyFrame.LeaveChk = false;
                myhash["bodyFrame"] = bodyFrame;
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
        var tmpHash = familyHash[pageName];
        if(tmpHash){
            for(var f = 0;f < tmpHash.length;f++){
                var tarHeadObj = dom.getElementsByName(tmpHash[f]);
                var sty_len = tarHeadObj.length;
                for(var i = sty_len-1; i >= 0; i--){
                    if(tarHeadObj[i].tagName == "SCRIPT")tarHeadObj[i].parentNode.removeChild(tarHeadObj[i]);//Tz 原本只移除[0],改跑全部移除
                }
            }
        }else{
            var tarHeadObj = dom.getElementsByName(pageName);
            var sty_len = tarHeadObj.length;
            for(var i = sty_len-1; i >= 0; i--){
                tarHeadObj[0].parentNode.removeChild(tarHeadObj[0]);
            }
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

    _self.definedParent=function(param, ts){
        if(!isNaN(param.history_pop)){
            try{
                window._history.splice(window._history.length-param.history_pop, 1);
            }catch(e){
                util.err("[definedParent][window._history.splice]", e);
            }
        }
        if( (param.back!="Y" || homePage) && param.isTrans!="Y" ){
            if(ts && (ts != top["lastClickTS"])){
                console.log("[你遲到囉]",param.page,"[ts]==>",ts,"[現在已經輪到][nowTS]==>",top["lastClickTS"]);
                return;
            }
            _self.pushHistory(param, "", param.page);
        }
        try{
            var obj = classHash[param.page];
            if(param["extendsClass"]){
                top.extendsClass = param["extendsClass"];
                var extendsClassPage = _self.new_eval(param["extendsClass"]);
                var extendsClassObj = new extendsClassPage(win,dom,param.postHash);
                obj = util.extendsClass(extendsClassObj, _self.new_eval(param.page), win, dom, param["postHash"]);
            }else{
                var newPage = _self.new_eval(param.page);
                obj = new newPage(win,dom,param.postHash);
            }
            if(param.isTrans=="Y"){
                var parantClass = (param.parentClass!=null)?param.parentClass:_self;
                obj.setParentclass(parantClass);
                obj.init();
                if (param.retChild) param.retChild(obj);
            }else{
                nowPage = param.page;
                bodyFrame = obj;
                myhash["bodyFrame"] = bodyFrame;
                bodyFrame.setParentclass(_self);
                bodyFrame.init();
                
                setTimeout(function(){
                    footerFrame = new win.footer(win,dom,null);
                    footerFrame.setParentclass(_self);
                    footerFrame.init();
                },300);
            }
        }catch(e){
            util.err("[definedParent]["+param.page+"]", e);
        }

        _self.backToTop();
        var bObj = dom.getElementById("body_show");
        var clsary = {};
        try{
                clsary = bObj.className.split(" ");
                for(i=1; i<clsary.length; i++){
                    bObj.classList.remove(clsary[i]);
                }
        }catch(e){}
        setTimeout(function(){
            try{
                for(j=1; j<clsary.length; j++){
                    bObj.classList.add(clsary[j]);
            }
            }catch(e){}
                
            if(param.retFun) param.retFun(param.retParam);
            if (param.pageName) _self.chgPageName({ "pageType": param.pageType, "pageName": param.pageName, "uniqText": param.uniqText});
                
        }, 10);
    }

    _self.backToTop=function(){
        // dom.getElementById("body_show").scrollTop = 0;
        var targetScroll = util.getScrollDom(ios);
        targetScroll.scrollTop = 0;
    }

    _self.showLoading=function(param){
        now_Page = _self.getNowPage();
        if(!param.isShow){
            if(param.from && !now_Page.includes(param.from)){
                console.log("收loading指令和現在載入的頁面不同,不執行");
                return;
            }
        }
        if(getView().viewportwidth >= 1024)_self.showBodyLoading(param.isShow);
        else _self.setLoadingVisible(param.isShow);
    }

    _self.showBodyLoading=function(isShow){
        if(dom.getElementById("loading") && loginComplete)dom.getElementById("loading").style.display = "none";
        if(dom.getElementById("body_loading"))dom.getElementById("body_loading").style.display = isShow?"":"none";
    }

    _self.loginFullLoading=function(param){
        _self.setLoadingVisible(param.isShow);
    }

    _self.setLoadingVisible=function(isShow){
        if(ios){
            var lockObj = util.getScrollDom(ios);
            if(isShow)_self.addbodylock();
            else{
                if(lockObj.classList.contains("scroll_lock") && !nowBodyLock){
                    console.log("移除scroll_lock!!");
                    _self.removebodylock();
                }
            }
        }
        if(dom.getElementById("body_loading"))dom.getElementById("body_loading").style.display = "none";
        dom.getElementById("loading").style.display = isShow?"":"none";
    }

    _self.setNowBodyLockStatus = function(status){
        nowBodyLock = status;
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
            if(postHash["back"]!=null && postHash["back"]=="Y")tmpPage = win._history[win._history.length-1];
            else tmpPage = win._history[win._history.length-2];
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

    _self.initBackCount=function(){
        backcount = 0;
    }

    _self.backPage=function(param){
        try{
            backcount++;
            top.clickBackPage="click";
            if(bodyFrame.classname != "home"){
                if(backcount >= 5){
                    var hash = new Object();
                    _self.backhomeclear(win._history.length-1);
                    _self.SerrefreshPage();
                    _self.backhome();
                }else{
                    if(win._history.length > 1){
                        top.BackTag = "Y";
                        win._history.pop();
                        var obj = win._history[win._history.length-1];
                        var hash = obj.state;
                        try{
                            if(top.specialClick=="special"){
                                if(hash.mode && top.specialGame.mode!=hash.mode){
                                    win._history.pop();
                                    var par = new Object();
                                    par["page"] = "league_index";
                                    par["showtype"] = "today";
                                    par["type"] = "today";
                                    par["specialClick"] = "special";
                                    par["outrightsClick"] = "";
                                    headerFrame.goPage(null,par);
                                    return;
                                }                                
                            }

                            if(hash.showtype){
                                if(hash.isMyGame=="Y")top.choice_showtype = "mygame";
                                else top.choice_showtype = hash.showtype;
                            }
                            if(hash.postHash.rtype)top.choice_rtype = hash.postHash.rtype;
                            if(hash.postHash.gtype)top.choice_gtype = hash.postHash.gtype;
                            
                            
                            if(hash.postHash.specialClick == "special")top.specialClick = hash.postHash.specialClick;
                            else top.specialClick = "";

                            if(hash.postHash){
                                hash.postHash.back = "Y";
                                if(hash.postHash.isLeagued != "Y" && top.specialClick == ""){
                                    if(top.choice_gtype != "ft"){
                                        if(top.choice_showtype == "today")top.choice_filter = "MIX";
                                        else{
                                            top.choice_filter = (top.choice_showtype == "early")?"FU":"FT";
                                        }
                                    }else{
                                        top.choice_filter = (top.choice_showtype == "early")?"FU":"FT";
                                    }
                                }
                            }

                            if(hash.outrightsClick == "outrights"||hash.postHash.outrightsClick == "outrights"){
                                top.outrightsClick = "outrights";
                                top.choice_showtype = "early";
                            }else{
                                top.outrightsClick = "";
                            }
                            if((hash.postHash.kind && hash.postHash.kind == "fantasy" || hash.postHash.isFantasy == "Y"))top.specialGame.isFantasy = true;
                            else top.specialGame.isFantasy = false;

                            if(top.specialGame.mode == "CUP"){
                                if(top.choice_rtype=="fs")top.specialGame.cup_page = "fs";
                                else if(top.specialGame.isFantasy)top.specialGame.cup_page = "fantasy";
                                else top.specialGame.cup_page = "game";
                                
                                if(hash.postHash.kind && hash.postHash.kind == "highlights"){
                                    top.specialGame.isHL = true;
                                    top.specialGame.cup_page = "HL";
                                }else top.specialGame.isHL = false;

                                if(hash.postHash.kind && hash.postHash.kind == "teams"){
                                    top.specialGame.isTeam = true;
                                    top.specialGame.cup_page = "teams";
                                }else top.specialGame.isTeam = false;

                                if(hash.postHash.kind && hash.postHash.kind == "standings"){
                                    top.specialGame.isStandings = true;
                                    top.specialGame.cup_page = "standings";
                                }else top.specialGame.isStandings = false;

                                if(hash.postHash.team_id)top.specialGame.choice_teamID = hash.postHash.team_id;
                                if(hash.team_id)top.specialGame.choice_teamID = hash.team_id;
                            }else{
                                top.specialGame.isHL = false;
                                top.specialGame.isTeam = false;
                                top.specialGame.isStandings = false;
                                top.specialGame.cup_page = "";
                            }
                        }catch(e){}
                        if(obj.page == "home")backcount = 0;

                        hash.page = obj.page;
                        hash.back = "Y";
                        hash.retFun = param.retFun;
                        if(hash.nowTS)hash.nowTS = 0;
                        if(hash.postHash)hash.postHash.nowTS = 0;                
                        _self.bodyGoToPage(hash);
                    }
                }
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
        LS = _self.new_eval("new LS_"+ls+"();");
        LS_game = _self.new_eval("new LS_game_"+ls+"();");
        LS_code = _self.new_eval("new LS_code_"+ls+"();");

        LS.init();
        LS_game.init();
        LS_code.init();
        myhash["LS"] = LS;
        myhash["LS_game"] = LS_game;
        myhash["LS_code"] = LS_code;
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
                }
            }
        }
    }

    _self.iosScroll = function(e){
        if(alertShow)return;
        nowScrollTop = dom.getElementById("scroll_html").scrollTop;
    }

    _self.updateScrollTop = function(px){
        nowScrollTop = px;
    }


    _self.doOnTouchMove = function (e) {
        var nowTouchY = e.touches[0].clientY;
        if( startTouchY < nowTouchY - fixY||startTouchY > nowTouchY + fixY){
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
 

    _self.showchg_pwd=function(param){
        firstchgid=false;
        firstcode=null;
        _self.clearSerTimer();
        _self.setLoadingVisible(true);
        
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";
        
        _self.goToPage("chgAcc_show", "chg_pwd", function(){
            loginFrame = new win.chg_pwd(win,dom,param);
            myhash["loginFrame"]  = loginFrame;
            loginFrame.setParentclass(_self);
            loginFrame.init();
        },{});
    } 


    _self.show_forgotEvent=function(){
        top.param ="ver="+top.ver+"&langx="+top.langx;
        _self.setLoadingVisible(true);
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";

        _self.goToPage("chgAcc_show", "forgot_pwd", function(){
            loginFrame = new win.forgot_pwd(win,dom,null);
            myhash["loginFrame"]  = loginFrame;
            loginFrame.setParentclass(_self);
            loginFrame.init();

            dom.getElementById("chgAcc_show").style.display = "";
        },{});
    }

    _self.passcode=function(){
        _self.setLoadingVisible(true);
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        firstcode = true;
        _self.goToPage("body_show", "passcode", function(){
            loginFrame = new win.passcode(win,dom,null);
            myhash["loginFrame"]  = loginFrame;
            loginFrame.setParentclass(_self);
            loginFrame.init();
            footerFrame = new win.footer(win,dom,null);
            footerFrame.setParentclass(_self);
            footerFrame.init();
        },{});

    }

    _self.transDate = function(xml_datetime, sys_time){
		var ret = "";
        if(xml_datetime != ""){
            var tmpdate = xml_datetime.split(" ");
            var xml_date = tmpdate[0];
            var gmt = new Date(sys_time.replace(/-/g,"/"));
            var now_m = parseInt(gmt.getMonth()+1);
            var game_m = parseInt(xml_date.split("-")[0]);
            if(now_m > game_m) gmt.setFullYear(gmt.getFullYear() +1);
            var y = gmt.getFullYear();
            var hm = _self.get24Hours(y+"-"+xml_datetime);
            var dt_ary = xml_datetime.split(" ");
            var d_ary = dt_ary[0].split("-");
            ret = d_ary[1]+" / "+d_ary[0]+"   "+hm;
        }
		return ret;
	}

    _self.get24Hours = function(datetime){
		var ret = "";
		try{
			var tmp = datetime.replace(/-/g,"/");
			tmp = tmp.replace(/a/g," am").replace(/p/g," pm");
			var h = new Date(tmp).getHours();
			var str_h = (parseInt(h)<10)? "0"+h : h;
			var tmpd = datetime.split(" ");
			var tmph = tmpd[1].split(":");
			ret = str_h + ":" + tmph[1];
			ret = ret.replace(/a/gi, "").replace(/p/gi, "");
		}catch(e){}
		return ret;
	}

    _self.showFantasyInfo = function(hash){
        var showData = "Y";
        var data = new Object();
        var targetDiv = "info_pop";
		if(hash.game1_datetime && hash.game2_datetime){
			var game1_datetime = _self.transDate(hash.game1_datetime, hash.system_time, false);
			var game2_datetime = _self.transDate(hash.game2_datetime, hash.system_time, false);
            data = {
                "game1_datetime":game1_datetime,"game1_Leg":hash.game1_Leg,"teamA":hash.teamA,"teamB":hash.teamB,
                "game2_datetime":game2_datetime,"game2_Leg":hash.game2_Leg,"teamC":hash.teamC,"teamD":hash.teamD,
                "fantasy_teamh":hash.fantasy_teamh,"fantasy_teamc":hash.fantasy_teamc
            };
		}else{
            showData = "N";
        }

        var _par = new Object();
        _par["_id"] = targetDiv;
		_par["title"] = "<li>" + LS.get("fantasy_title")+ "</li>";
		_par["msg"] = "<li>" + LS.get("fantasy_content")+ "</li>";
        _par["isfantasy"] = showData;
        _par["fantasy_data"] = data;

		_self.showAlertMsg(_par);
    }

    _self.bet_showFantasyInfo = function(hash){
        var showData = "Y";
        var data = new Object();
		if(hash.game1_datetime && hash.game2_datetime){
			var game1_datetime = _self.transDate(hash.game1_datetime, hash.system_time, false);
			var game2_datetime = _self.transDate(hash.game2_datetime, hash.system_time, false);
            data = {
                "game1_datetime":game1_datetime,"game1_Leg":hash.game1_Leg,"teamA":hash.teamA,"teamB":hash.teamB,
                "game2_datetime":game2_datetime,"game2_Leg":hash.game2_Leg,"teamC":hash.teamC,"teamD":hash.teamD,
                "fantasy_teamh":hash.fantasy_teamh,"fantasy_teamc":hash.fantasy_teamc
            };
		}else{
            showData = "N";
        }

        var _par = new Object();
		_par["_id"] = "bet_info_pop";
		_par["title"] = "<li>" + LS.get("fantasy_title")+ "</li>";
		_par["msg"] = "<li>" + LS.get("fantasy_content")+ "</li>";
        _par["isfantasy"] = showData;
        _par["fantasy_data"] = data;

		_self.showAlertMsg(_par);
    }

    _self.showAlertMsg=function(param){
        alertShow = true;
        alertFrame.showMsg(param);
    }

    _self.hideAlertMsg=function(param){
        alertShow = false;
        alertFrame.clearMsg(param);
    }

    _self.noCloseWindow=function(param){
        iscloseW = param.iscloseW;
    }

    _self.closePCResult=function(){
        window.onbeforeunload=function (e){
            if(e.clientX>document.body.clientWidth && e.clientY < 0 || e.altKey){
                top.newWinObj_result.close();
            }else{
                if(iscloseW=="Y"){
                    top.newWinObj_result.close();
                }else {
                    iscloseW="Y";
                }
            }
        }
    }

    _self.showSystemMsg=function(param){
        systemFrame.showMsg(param);
    }

    _self.hideSystemMsg=function(param){
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
                        _self.show_prepasscode();
                    }else{
                        top["errorTwice"] = true;
                        CookieManager.set("error1","error1", 3650);
                        _self.show_back_login();
                    }
                });
                getHTML.loadURL(top.m2_url,"POST",urlParams);
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
        alertShow = false;
        var lockObj = util.getScrollDom(ios);
        if(!announcementlock){
            // dom.getElementById("body_show").classList.remove("scroll_lock");
            lockObj.classList.remove("scroll_lock");
            dom.body.removeAttribute("style");
            dom.body.classList.remove("scroll_lock");
            if(ios){
                console.trace("關閉背景鎖定",nowScrollTop);
                lockObj.removeAttribute("style");
                lockObj.scrollTop = nowScrollTop;
            }
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
        alertShow = true;
        var lockObj = util.getScrollDom(ios);
        lockObj.classList.add("scroll_lock");
        //dom.getElementById("body_show").classList.add("scroll_lock");
        dom.body.classList.add("scroll_lock");
        if(ios){
            var lockObj = util.getScrollDom(ios);
            nowScrollTop = lockObj.scrollTop;
            lockObj.style.position = 'fixed';
            dom.body.style.marginTop = "-"+nowScrollTop+"px";
            console.log("開啟鎖背景",nowScrollTop);
        }
    }

    _self.setScrollTop = function(obj){
        dom.documentElement.scrollTop = obj.value;
        dom.body.scrollTop = obj.value;
    }

    _self.chkscroll = function(param){
        var sb = window.pageYOffset || dom.documentElement.scrollTop || dom.body.scrollTop;
        try{
            if(param.px != null){
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
        if(type == "yes") {
            top["userData"].newalertMsg = "Y";
            newFourPwd = "Y";
        }
        if(dom.getElementById('C_confirm_chk').checked == true){
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
        ann_sw = false;
        if(top["memSet"].notice != notice_ver && top.notice_sw == "Y"){
            _self.goToPage("announcement_show", "announcement", function(){ 
                announcementFrame = new win.announcement(win,dom,null);
                announcementFrame.setParentclass(_self);
                announcementFrame.init();
                announcementlock = true;
                announcementFrame.show_announcement({"notice_ver":notice_ver});
            },{});
        }else _self.ann_message();
    }

    _self.ann_message= function(){
        var urlParams = "";
        urlParams += "username=" + top["userData"].username;
        urlParams += "&uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams += "&select_date=-4";
        urlParams += "&t_important=4";
        urlParams = "p=messageget&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.m2_url, "POST", urlParams);
    
    }

    _self.connectComplete = function (xml) {
        var errorMsg = util.showConnectMsg(xml);
        if(util.alertConnectMsg(errorMsg))  return;

		var xmlnode=util.parseXml(xml);
        var ann_msg = util.showTxt(xmlnode.Node(xmlnode.Root[0],"annmsg").innerHTML);
        var message_id = util.showTxt(xmlnode.Node(xmlnode.Root[0],"id").innerHTML);

        if(ann_msg != "" && message_id!=top["memSet"].msgid){
            _self.goToPage("announcement_show", "announcement", function(){ 
                announcementFrame = new win.announcement(win,dom,null);
                announcementFrame.setParentclass(_self);
                announcementFrame.init();
                announcementFrame.show_announcement({"id":message_id,"msg":ann_msg,"ann_sw":"Y"});
            },{});
        }else {
            document.getElementById("home_show").removeAttribute("style");
            _self.showLoading({"isShow":false});
            if(document.getElementById("home_touch_div_320"))document.getElementById("home_touch_div_320").classList.remove("sideshow_hide");
            if(document.getElementById("home_touch_div_640"))document.getElementById("home_touch_div_640").classList.remove("sideshow_hide");
            if(document.getElementById("home_touch_div_320_ios"))document.getElementById("home_touch_div_320_ios").classList.remove("sideshow_hide");
            if(document.getElementById("home_touch_div_640_ios"))document.getElementById("home_touch_div_640_ios").classList.remove("sideshow_hide");
            _self.checkCount();
        }
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
        getHTML.loadURL(top.m2_url,"POST",urlParams);

    }
    _self.encodePassCodeFinish=function(xml){
        var errorMsg = util.showConnectMsg(xml);
		if(util.alertConnectMsg(errorMsg))  return;

        var xmdObj = new Object();
        xmlnode = util.parseXml(xml);
        xmdObj["code"] = xmlnode.Node(xmlnode.Root[0],"code");

        if(xmdObj["code"].innerHTML =="484" && top.aspenbet != "Y"){
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
        myhash["timerHash"] = timerHash;
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
            msgObj["forecast_sw"] = xmlnode.Node(xmlnode.Root[0],"forecast_sw").innerHTML;
            msgObj["urgent_sw"] = xmlnode.Node(xmlnode.Root[0],"urgent_sw").innerHTML;
            msgObj["emergency_sw"] = xmlnode.Node(xmlnode.Root[0],"emergency_sw").innerHTML;
            msgObj["clean_data_time"] = xmlnode.Node(xmlnode.Root[0],"clean_data_time").innerHTML;
            msgObj["isException"] = xmlnode.Node(xmlnode.Root[0],"isException").innerHTML;
            msgObj["code"] = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
            msgObj["fix_sw"] = fix_sw;
            msgObj["hometext"] = _self.getNowPage();

            Serobj = msgObj;
            top.myGame_sw = (msgObj["myGame_sw"] == "Y")?true:false;
            top.forecast_sw = (msgObj["forecast_sw"] == "Y")?true:false;
            top.clean_data_sw = (msgObj["clean_data_sw"] == "Y")?"Y":"N";
            var CookieChk = (CookieManager.get("CookieChk"))?CookieManager.get("CookieChk") : "";
            if(CookieChk != ""){
                top.cookieEncode_sw = "Y";
            }else{
                top.cookieEncode_sw = "N";
            }
            if(top.userData.mid){
                if(msgObj["myGame_sw"] != "Y")_self.showMyGameProc(false,msgObj["clean_data_sw"]);
                else{
                    if(msgObj["clean_data_sw"] != "Y"){
                        chkNow = false;
                       _self.showMyGameProc(true,msgObj["clean_data_sw"],chkNow);   
                    }   
                    else _self.showMyGameProc(false,msgObj["clean_data_sw"]);
                }

                if(forecastFrame!=null){
                    if(!top.forecast_sw && dom.getElementById("forecast_show").classList.contains("on")){
                        var foreParam = new Object();
                        foreParam.restartTimer = "Y";
                        forecastFrame.closeForecast(null,foreParam);
                    }
                }
            }

            if(msgObj["isException"]=="Y"){
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
                if(urgent || maintain || emergency){
                    util.goToIndex();
                    return;
                }
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
        getHTML.setParentclass(_self);
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", function(xml){
            var errorMsg = util.showConnectMsg(xml);
            if(util.alertConnectMsg(errorMsg))  return;

            _self.SerrefreshPageComplete(xml,firstTime);
        });
        getHTML.loadURL(top.m2_url, "POST", urlParams);
    }

    _self.SerTimerFinish=function(){

    }

    _self.browser_rule = function(){
        _self.setLoadingVisible(true);
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";

        _self.goToPage("acc_show", "browser_rule", function(){
            loginFrame = new win.browser_rule(win,dom,null);
            myhash["loginFrame"]  = loginFrame;
            loginFrame.setParentclass(_self);
            loginFrame.init();

            dom.getElementById("acc_show").style.display = "";
        },{});
    }

    _self.getParentThis=function(varible){
        return _self.getThis(_self);
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
        headerFrame.chgHeadCss(param.showtype);
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
        var alllock = new Array("menu_tv","header_tv","home_page","live_page","today_page","early_page","parlay_page","special_page","outrights_page","menu_myGame","header_myGame");
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
            bod = bod.replace(new RegExp( '\\\\*' + key + '\\\\*','gi'),json[key]);
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
        myhash["timerHash"] = timerHash;
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

    _self.getPageCount=function(){
        var par = "p=get_page_count";
        var team_id = (top.specialGame.isTeam)?top.specialGame.choice_teamID:"";
        par += "&" + top.param;
        par += "&gtype=" + top.choice_gtype;
        par += "&showtype=" + top.choice_showtype;
        par += "&filter=" + top.choice_filter;
        par += "&ltype=" + top["userData"].ltype;
        par += "&team_id=" + team_id;
        par += "&specialClick=" + top.specialClick;
        par += "&p3type=" + (top.p3type || "");
        par += "&date=" + tmp_date;
        if(top.specialClick == "special"){
            var isFantasy = (top.specialGame.isFantasy && top.specialGame.mode=="CUP")?"Y":"N";
            par += "&isFantasy=" + isFantasy;
        }
        

        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.getPageCountComplete);
        getHTML.loadURL(top.m2_url,"POST",par);
    }

    _self.getPageCountComplete=function(xml){
        var pageCountHash = new Object();
        pageCountHash["main"] = 0;
        pageCountHash["rnou"] = 0;
        pageCountHash["cn"] = 0;
        pageCountHash["rn"] = 0;
        pageCountHash["pd"] = 0;
        pageCountHash["moua"] = 0;
        pageCountHash["sfs"] = 0;
        pageCountHash["fantasy"] = 0;

        pageCntHash = util.showConnectMsg(xml);
        if(util.alertConnectMsg(pageCntHash))  return;
        xmlnode = util.parseXml(xml);
        var xmdObj = new Object();
        var dataStatus = xmlnode.Node(xmlnode.Root[0],"dataStatus").innerHTML;
        if(dataStatus == "N"){
            console.log("Server沒傳任何資料回來!!!!");
            return;
        }
        xmdObj = xmlnode.Node(xmlnode.Root[0],"pgcount",false);
        for(var key=0;key<xmdObj.length;key++){
            var lid = xmdObj[key].getAttribute("id");
            if(top.specialClick == "" && tmp_choice_lid != "" && top.choice_filter != "FANTASY"){
                //console.log("選擇的聯盟:",tmp_choice_lid);
                var tmp_lid = ","+tmp_choice_lid+",";
                if(tmp_lid.indexOf(","+lid+",") == -1)continue;
            }else if(top.specialClick != "" && top.specialGame.isTeam){
                //console.log("選擇的隊伍:",top.specialGame.choice_teamID);
                if(lid != top.specialGame.choice_teamID)continue;
            }else if(top.specialClick != "" && top.specialGame.isFantasy){
                //console.log("選擇的夢幻聯盟:",top.specialGame.FantasyLID);
                var tmp_lid = "^"+top.specialGame.FantasyLID+"^";
                if(tmp_lid.indexOf("^"+lid+"^") == -1)continue;
            }
            
            var tmp_main = xmlnode.Node(xmdObj[key],"MAIN").innerHTML;
            var tmp_rnou = xmlnode.Node(xmdObj[key],"RNOU").innerHTML;
            var tmp_cn = xmlnode.Node(xmdObj[key],"CN").innerHTML;
            var tmp_rn = xmlnode.Node(xmdObj[key],"RN").innerHTML;
            var tmp_pd = xmlnode.Node(xmdObj[key],"PD").innerHTML;
            var tmp_moua = xmlnode.Node(xmdObj[key],"MOUA").innerHTML;
            var tmp_sfs = xmlnode.Node(xmdObj[key],"SFS").innerHTML;
            var tmp_fantasy = xmlnode.Node(xmdObj[key],"FANTASY").innerHTML;

            pageCountHash["main"] += parseInt(tmp_main);
            pageCountHash["rnou"] += parseInt(tmp_rnou);
            pageCountHash["cn"] += parseInt(tmp_cn);
            pageCountHash["rn"] += parseInt(tmp_rn);
            pageCountHash["pd"] += parseInt(tmp_pd);
            pageCountHash["moua"] += parseInt(tmp_moua);
            pageCountHash["sfs"] += parseInt(tmp_sfs);
            pageCountHash["fantasy"] += parseInt(tmp_fantasy);
        }
        
        if(dataStatus == "Y" || dataStatus == "noData"){
            //console.log("Server狀態為Y");
            bodyFrame.showPageProc(pageCountHash);
        }
    }

    _self.createMyGameChkTimer=function(){
        if(timerHash["myGameChkTimer"]==null){
            timerHash["myGameChkTimer"] = new Timer(config_set.get("CONFIG_MYGAME_CHECK"));
            timerHash["myGameChkTimer"].setParentclass(_self);
            timerHash["myGameChkTimer"].init();
            timerHash["myGameChkTimer"].addEventListener("TimerEvent.TIMER", _self.myGameChk);
            timerHash["myGameChkTimer"].startTimer();
            myhash["timerHash"] = timerHash;
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
            _self.format_myGame();
            _self.showGreenBtnProc(false);
            return;
        }
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.myGameChkComplete);
        getHTML.loadURL(top.m2_url,"POST",par);
    }
    _self.myGameChkComplete=function(xml){
        myGameChkHash = util.showConnectMsg(xml);
        if(util.alertConnectMsg(myGameChkHash))  return;

        var xmdObj = new Object();
        var nowPage = _self.getNowPage();
        xmlnode = util.parseXml(xml);
        

        for(var k= 0;k<myGameGtype.length;k++){
            var gtype = myGameGtype[k];
            var myGameHash = top["myGameHash"][myGameGtype[k]];
            var msg = xmlnode.Node(xmlnode.Root[0],"msg");
            xmdObj[gtype] = xmlnode.Node(xmlnode.Root[0],gtype);
            if(msg.innerHTML == "NeedsToDel"){
                if(xmdObj[gtype].innerHTML){
                    var tmp_ec = xmlnode.Node(xmdObj[gtype],"ec",false);
                    for(var f=0;f<tmp_ec.length;f++){
                        var tmpEC = tmp_ec[f];
                        var tmpID = tmpEC.getAttribute("id");
                        var status = tmpEC.getAttribute("status");
                        if(status=="delete"){
                            util.delMyGameHash(myGameHash,tmpID,config_set);
                        }else {
                            if(myGameHash[tmpID]["ts"]!=null && myGameHash[tmpID]["ts"]!="")myGameHash[tmpID]["ts"] = "";
                        }
                    }
                }
            }else{
                for(var ecid in myGameHash){
                    if(myGameHash[ecid]["ts"]!=null && myGameHash[ecid]["ts"]!="")myGameHash[ecid]["ts"] = "";
                }
            }        
            util.setMyGameCookie(CookieManager,myGameHash,myGameGtype[k]);
        }
        var noGame = util.chkAllMyGameHash(true);
        if(noGame){
            _self.showGreenBtnProc(false);
        }else{
            _self.showGreenBtnProc(true);
        }
        if(nowPage.includes("game_list") && top.choice_showtype == "mygame"){
            bodyFrame.getMyGameCnt();
        }
    }
    _self.showGreenBtnProc=function(show){
        if(headerFrame)headerFrame.showGreenBtn(show);
        if(bottomFrame)bottomFrame.showGreenBtn(show);
    }

    _self.chkGame = function(param){
        _self.showMyGameProc(param.myGame_sw,param.clean_data,param.chkNow,param.from);
    }

    _self.showMyGameProc=function(show,clean_data,chkNow,from){
        cleanData = (clean_data == "Y")?true:false;
        var from = (from)?from:"";
        
        var nowPage = _self.getNowPage();
        if(nowPage.includes("game_list")||nowPage.includes("game_more")){
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
                for(var i=0;i<gtype_ary.length;i++){
                    var tmpGtype = gtype_ary[i];
                    top["myGameHash"][tmpGtype] = new Object();
                    if(CookieManager.get(tmpGtype+"_myGame_"+top["userData"].mid)!=null)CookieManager.del(tmpGtype+"_myGame_"+top["userData"].mid);
                }
                console.log("========開關關閉了========");
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
        myhash["timerHash"] = timerHash;
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
        myhash["timerHash"] = timerHash;
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
        getHTML.loadURL(top.m2_url, "POST", par);
    }

    _self.emptyFun=function(xml){
        var errorMsg = util.showConnectMsg(xml);
		if(util.alertConnectMsg(errorMsg))  return;
    }
    
    _self.auto_update=function(){
        _self.reloadCredit({"key":"all"});
    }

    _self.reloadCredit=function(param){
        key = "member";
        if(param.key == "cash"){
            key = "credit";
        }else if(param.key == "all"){
            key = "all";
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
        getHTML.loadURL(top.m2_url, "POST", urlParams);
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
        getHTML.loadURL(top.m2_url, "POST", urlParams);
    }

    _self.private=function(){
        _self.setLoadingVisible(true);
        
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("chgAcc_show").style.display = "none";

        _self.goToPage("acc_show", "private", function(){
            loginFrame = new win.private_page(win,dom,null);
            myhash["loginFrame"]  = loginFrame;
            loginFrame.setParentclass(_self);
            loginFrame.init();
            dom.getElementById("acc_show").style.display = "";
        },{});

    }

    _self.retryLoop=function(params){
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
                ht.loadURL(top.m2_url, method[i], params[i]);
            }
        }
        _self.retryComplete();
		if(dom.getElementById("ok_btn"))dom.getElementById("ok_btn").innerHTML = LS.get("determine");
	}

    _self.retryLastfail=function(){
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
        // _self.checkHeight();
        var now_width1024 = (getView().viewportwidth >= 1024);
        var fs = false;
        if(dom.getElementById("html5_player")){
            fs = (dom.getElementById("html5_player").clientWidth == win.screen.width);
        }
        if(!top.fullscreen && !fs){
            if(top.mobile != "Y" && top.resizePage == "game_list" && top.choice_rtype.match(/rnou/)){
                bodyFrame.ratioResize();
            }
            if(!ios&&top.mobile == "Y"){
                if(win.visualViewport.height != win.innerHeight)return;
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
                if(width1024){
                    top.nowWidth = "over1024";
                    _self.removebodylock();
                    if(rightPanelFrame==null && loginSuccess){
                        _self.showBigRightLoading(true);        
                        _self.goToPage("right_show", "right_panel", function(){
                            rightPanelFrame = new win.right_panel(win,dom,null);
                            rightPanelFrame.setParentclass(_self);
                            rightPanelFrame.init();
                            _self.showBigRightLoading(false);
                            if(top.resizePage=="game_list"||top.resizePage=="game_more"){
                                rightPanelFrame.setRightLoading(true);
                                rightPanelFrame.loadRightScore({"scFun":bodyFrame.resizeEvent});
                                rightPanelFrame.showRightMsg(true);
                            }
                            else if(top.resizePage=="other"&&top.rightECID!=""){
                                rightPanelFrame.setRightLoading(true);
                                rightPanelFrame.loadRightScore({"scFun":rightPanelFrame.getData});
                            }
                        },{});
                    }else if(rightPanelFrame!=null){
                        
                        var hasLoad = rightPanelFrame.chkRightScore();
                        if(top.resizePage=="game_list"||top.resizePage=="game_more"){    
                            rightPanelFrame.setRightLoading(true);
                            rightPanelFrame.loadRightScore({"scFun":bodyFrame.resizeEvent});
                        }

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
                        rightPanelFrame.showRightMsg(true);
                    }
                    var nowPage = _self.getNowPage();
                    if(util.in_array(nowPage,otherAry)){
                        _self.showBackTopBtn();
                    }
                    if(util.countSize(top.bet_select) > 0 && !top.openBets){
                        top.betMode = "total"; 
                        _self.showBetSlip({"isShow":true,"minimize":true});                        
                    }  
                }else{
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
                    if(rightPanelFrame)rightPanelFrame.showRightMsg(false);
                    if(top.openBets){
                        _self.hideAlertMsg({"use":"noPopMainClear"});
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

            var now_width840 = (getView().viewportwidth >= 840);
            if(width840!=now_width840 && top.resizePage=="game_list"){
                width840 = now_width840;
            }

            if(top.resizePage=="game_list"){
                if(bodyFrame)bodyFrame.tabScroll();
            }

        }
    }

    _self.rollBottom=function(param){
        var nowpage = _self.getNowPage();
        if(param.page==nowpage){
            isBottom = param.isBottom;
        }else{
            isBottom = false;
        }
    }

    _self.showBackTopBtn = function(){
        var body_h = document.getElementById("body_show").scrollHeight;
        var view_h = document.getElementById("body_show").clientHeight;
        var now_h = document.getElementById('body_show').scrollTop;
        if(body_h-view_h>=10){
            document.getElementById("tool_backtop").style.display = "";
            if(((body_h-(view_h+now_h)<=80) || isBottom) && top.mobile!="Y"){
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

    _self.parseNoGameRightScoreBoard = function(obj){
        if(rightPanelFrame!=null){
            rightPanelFrame.parseNoGameRightScoreBoard(obj);
        }
    }

    _self.chkTvPlaying = function(){
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
        if(rightPanelFrame!=null)rightPanelFrame.noGameCheckLive(par.eventid_ph,par.center_tv,par.eventid_mt,par.MT_data,par.lineups,par.from);
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
                case "create":
                    rightPanelFrame.createTimer();
                    break;
            }
        }
    }    

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
            sc.src = document.location.protocol+"//"+top.cu_domain+"/transform.php?p=loadDomain&type=cu&ver="+_self.getRandom();
            document.body.appendChild(sc);
            cuTimer = setTimeout(_self.cuAbort,5000,sc); 
        }

        var cuipv6Cookie = CookieManager.get("cuipv6");
        if(!cuipv6Cookie){
            CookieManager.set("cuipv6","N");
            top["userData"].cuipv6 = "N";
        }
        if(top.cuipv6_domain){ 
            var cipv6 = document.createElement("iframe");
            cipv6.id = "cuipv6_ifr";
            cipv6.style.display = "none";
            cipv6.src = document.location.protocol+"//"+top.cuipv6_domain+"/transform.php?p=loadDomain&type=cuipv6&ver="+_self.getRandom();
            document.body.appendChild(cipv6);
            cuipv6Timer = setTimeout(_self.cuipv6Abort,5000,cipv6); 
        }

        var ipv6Cookie = CookieManager.get("ipv6");
        if(!ipv6Cookie){
            CookieManager.set("ipv6","N");
            top["userData"].ipv6 = "N";
        }
        if(top.ipv6_domain){ 
            var sipv6 = document.createElement("iframe");
            sipv6.id = "ipv6_ifr";
            sipv6.style.display = "none";
            sipv6.src = document.location.protocol+"//"+top.ipv6_domain+"/transform.php?p=loadDomain&type=ipv6&ver="+_self.getRandom();
            document.body.appendChild(sipv6);
            ipv6Timer = setTimeout(_self.ipv6Abort,5000,sipv6); 
        }
    }    

    _self.cuAbort = function(sc){
        CookieManager.set("cu","N");
        top["userData"].cu = "N";
        sc.src = "";     
        sc.parentNode.removeChild(sc);
    }

    _self.ipv6Abort = function(sipv6){
        CookieManager.set("ipv6","N");
        top["userData"].ipv6 = "N";
        sipv6.src = "";     
        sipv6.parentNode.removeChild(sipv6);
    }

    _self.cuipv6Abort = function(cipv6){
        CookieManager.set("cuipv6","N");
        top["userData"].cuipv6 = "N";
        cipv6.src = "";     
        cipv6.parentNode.removeChild(cipv6);
    }

    _self.createVerTimer=function(){
        if(timerHash["verTimer"]!=null) return;
        timerHash["verTimer"] = new Timer(config_set.get("CONFIG_CHECK_VERSION"));
        timerHash["verTimer"].setParentclass(_self);
        timerHash["verTimer"].init();
        timerHash["verTimer"].dont_clear = true;
        timerHash["verTimer"].addEventListener("TimerEvent.TIMER", _self.checkVersion);
        timerHash["verTimer"].startTimer();
        myhash["timerHash"] = timerHash;
    }

    _self.checkVersion = function(){
        var urlParams = "";
        urlParams = "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams = "p=get_version&"+ urlParams;

        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete",_self.getVersionComplete);
		getHTML.loadURL(top.m2_url,"POST",urlParams);
    }

    _self.getVersionComplete=function(xml){
        var errorMsg = util.showConnectMsg(xml);
        if(util.alertConnectMsg(errorMsg))  return;
        xmlnode = util.parseXml(xml);
        var code = xmlnode.Node(xmlnode.Root[0],"code").innerHTML;
        if(code=="666"){
            var ver = xmlnode.Node(xmlnode.Root[0],"ver").innerHTML;
            if(top["verAutoUpdate"]){
                if(top.ver!=ver){
                    var nowNo = 0;
                    var newNo = 0;
                    var splitTop = top.ver.split("_")[1];
                    var splitVer = ver.split("_")[1];
                    if(!isNaN(splitTop*1))nowNo = splitTop*1;
                    if(!isNaN(splitVer*1))newNo = splitVer*1;
                    if(newNo > nowNo){
                        top["userData"].ver = ver;
                        var _url = util.getProtocal()+"//"+util.getWebDomain();
                        util.topGoToUrl(_url,top["userData"]);
                    }
                }
            }else{
                top.ver = ver;
            }
            
        }
    }

    _self.showBigRightLoading=function(isShow){        
        dom.getElementById("right_loading").style.display = isShow?"":"none";    
    }

    _self.setBodyShowClass=function(param){
        if(param.page == "rules_general"||param.page == "help_faq"||param.page == "features"||param.page == "help_odds"||param.page == "help_sys"){
            dom.getElementById("body_show").classList.add("box_l_height");
        }
    }

    _self.removeBodyShowClass=function(){
        var bodyShow = dom.getElementById("body_show");
        util.removeClass(bodyShow,"box_l_height");
        //console.log("移除 class [box_l_height]");
    }

	_self.onMessage = function(event){
        var code=event.data;
        switch(code){
            case "CUIPV6_OK":
                var cuipv6Ifr = dom.getElementById("cuipv6_ifr");
                CookieManager.set("cuipv6","Y");
                top["userData"].cuipv6 = "Y";
                clearTimeout(cuipv6Timer);
                cuipv6Ifr.parentNode.removeChild(cuipv6Ifr);
                break;
            case "CU_OK":
                var cuIfr = dom.getElementById("cu_ifr");
                CookieManager.set("cu","Y");
                top["userData"].cu = "Y";
                clearTimeout(cuTimer);
                cuIfr.parentNode.removeChild(cuIfr);
                break;
            case "IPV6_OK":
                var ipv6Ifr = dom.getElementById("ipv6_ifr");
                CookieManager.set("ipv6","Y");
                top["userData"].ipv6 = "Y";
                clearTimeout(ipv6Timer);
                ipv6Ifr.parentNode.removeChild(ipv6Ifr);
                break;
            default:
                if(code.indexOf("S002")!=-1 || code.indexOf("S004")!=-1){
                    bodyFrame.onMessageEvent(code);
                }else{
                    if(getView().viewportwidth >= 1024){
                        rightPanelFrame.onMessageEvent(code);
                    }else{
                        bodyFrame.onMessageEvent(code);
                    }
                }
                break;
        }
    }

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
        myhash["timerHash"] = timerHash;
    }

    _self.stopNetTimer = function () {
        timerHash["NetCheckTimer"].stopTimer();
    }

    _self.startNetTimer = function () {
        top["requestFailedCount"]++;
        timerHash["NetCheckTimer"].startTimer();
    }

    _self.networkCheck = function(){
        if(top["requestFailedCount"] >= config_set.get("RETRY_LIMIT")){
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

    _self.goDomainRemoveM = function(str){
        var goUrl ="";
        goUrl = dom.location.protocol+"//"+str.replace("m.","");
        util.topGoToUrl(goUrl);
    }
    
    _self.networkCheckFinish = function(){
        
    }
    _self.systemreq = function(data){
        top.param ="ver="+top.ver+"&langx="+top.langx;
        _self.setLoadingVisible(true);
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "none";
        dom.getElementById("sysreq_show").style.display = "none";
        if(data.act == "ip_guide"){
            _self.goToPage("sysreq_show", "ip_guide", function(){
                loginFrame = new win.ip_guide(win,dom,null);
                myhash["loginFrame"]  = loginFrame;
                loginFrame.setParentclass(_self);
                loginFrame.init();
                dom.getElementById("sysreq_show").style.display = "";
            },{});
        }else{
            _self.goToPage("sysreq_show", "system_req", function(){
                loginFrame = new win.system_req(win,dom,null);
                myhash["loginFrame"]  = loginFrame;
                loginFrame.setParentclass(_self);
                loginFrame.init();
                dom.getElementById("sysreq_show").style.display = "";
            },{});
        }
        
    }
    _self.show_back_4pwd = function(){
        dom.getElementById("sysreq_show").style.display = "none";
        _self.show_prepasscode();
    }

    _self.goToMygame = function(){
        headerFrame.doGoToMyGame();
    }

    _self.addMyEventAnimation = function(target){
        if(target.action == "add"){
            if(top.nowWidth == "over1024")headerFrame.addAnimation();
            else bottomFrame.addAnimation();  
        }
        else{
            if(top.nowWidth == "over1024")headerFrame.removeAnimation();
            else bottomFrame.removeAnimation();
        }
    }

    _self.initMyGame = function(){

        for(var i=0;i<gtype_ary.length;i++){
            var tmpMyGameStr = (CookieManager.get(gtype_ary[i]+"_myGame_"+top["userData"].mid)!=null)?CookieManager.get(gtype_ary[i]+"_myGame_"+top["userData"].mid):"{}";
            try{
                var tmpObj = JSON.parse(tmpMyGameStr);
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
                }
            }
            var wrongVer = (CookieManager.get("myGameVer_"+top["userData"].mid)==null || CookieManager.get("myGameVer_"+top["userData"].mid)!=top.myGameVer);
            if(wrongFormat || wrongVer){
                top["myGameHash"][gtype_ary[i]] = new Object();
                CookieManager.del(gtype_ary[i]+"_myGame_"+top["userData"].mid);  
            }else{
                top["myGameHash"][gtype_ary[i]] = tmpObj;
            }                          
        }
        
        CookieManager.set("myGameVer_"+top["userData"].mid,top.myGameVer);
    } 
    
    _self.lastBodyPage = function(){
        return BodyPage;
    }

    _self.getFantasyInfoProc = function(data){
        var gidfl = data.gidfl.split("_")[0];
        var gid = data.gid;
		if(!top["fantasyHash"][gid]){
			var urlParams = "";
			urlParams += "uid=" + top["userData"].uid;
			urlParams += "&langx=" + top.langx;
            urlParams += "&gidfl=" + gidfl;
            urlParams += "&mode=" + data.mode;
            urlParams += "&team_id_h=" + data.team_id_h;
            urlParams += "&team_id_c=" + data.team_id_c;
            urlParams += "&gid=" + gid;
			urlParams = "p=get_fantasy_info&" + urlParams;
			
			var getHTML = new HttpRequest();
			getHTML.addEventListener("onError", _self.onError);
			getHTML.addEventListener("LoadComplete",_self.getFantasyInfoComplete);
			getHTML.loadURL(top.m2_url,"POST",urlParams);
		}else{
            if(top["fantasyHash"][gid] == "noData")_self.showFantasyInfo(top["fantasyHash"]);
            else{
                _self.showFantasyInfo(top["fantasyHash"][gid]); 
            }
		}
	}

    _self.getFantasyInfoComplete = function(xml){
        var errorMsg = util.showConnectMsg(xml);
        if(util.alertConnectMsg(errorMsg))  return;
        xmlnode = util.parseXml(xml);
        var fantasyData = xmlnode.Node(xmlnode.Root[0],"FANTASY_DATA").innerHTML;
        var gidfl = xmlnode.Node(xmlnode.Root[0],"gidfl").innerHTML;
        var gid = xmlnode.Node(xmlnode.Root[0],"gid").innerHTML;
        var system_time = xmlnode.Node(xmlnode.Root[0],"system_time").innerHTML;
        var team_id_h = xmlnode.Node(xmlnode.Root[0],"team_id_h").innerHTML;
        var team_id_c = xmlnode.Node(xmlnode.Root[0],"team_id_c").innerHTML;
        var fantasyObj= new Object();
        if(fantasyData!="No Fantasy Data"){
            fantasyData = xmlnode.Node(xmlnode.Root[0],"FANTASY_DATA", false)[0];
            var fantasyGame1 = xmlnode.Node(fantasyData,"GAMEH", false)[0];
            var fantasyGame2 = xmlnode.Node(fantasyData,"GAMEC", false)[0];
            var fantasy_teamh = (team_id_h==fantasyGame1.getAttribute("TEAM_H_ID"))?"teamA":"teamB";
            var fantasy_teamc = (team_id_c==fantasyGame2.getAttribute("TEAM_H_ID"))?"teamC":"teamD";
            fantasyObj = {
                "system_time":system_time,
                "game1_datetime":fantasyGame1.getAttribute("DATETIME"),"game1_Leg":fantasyGame1.getAttribute("LEAGUE"),"teamA":fantasyGame1.getAttribute("TEAM_H"),"teamB":fantasyGame1.getAttribute("TEAM_C"),
                "game2_datetime":fantasyGame2.getAttribute("DATETIME"),"game2_Leg":fantasyGame2.getAttribute("LEAGUE"),"teamC":fantasyGame2.getAttribute("TEAM_H"),"teamD":fantasyGame2.getAttribute("TEAM_C"),
                "fantasy_teamh":fantasy_teamh,"fantasy_teamc":fantasy_teamc,"isToday":"Y"
            };
            _self.showFantasyInfo(fantasyObj);
            top["fantasyHash"][gid] = fantasyObj;
        }
        else{
            _self.showFantasyInfo(fantasyObj);
            top["fantasyHash"][gid] = "noData";
        }

    }

    _self.closeGameLoading = function(){
        bodyFrame.showGameLoading(false);
    }

    _self.new_eval = function(str){
        var fn = Function;
        return new fn('return '+str)();
    }

    _self.getRandom = function(x){
        return (Math.floor(Math.random()*10000000));
    }

    _self.resetHeaderTimer = function(act){
        if(headerFrame){
            if(act=="create")headerFrame.createSpecialChkTimer();
            else if(act=="clear")headerFrame.clearSpecTimer();
        }
    }

    _self.showForecast = function(par){
        util.addClass(dom.getElementById("forecast_show"),"on");
        if(dom.getElementById("fore_loading"))util.addClass(dom.getElementById("fore_loading"),"page_on");
        _self.addbodylock();
        if(forecastFrame==null){
            //console.log("forecastFrame是空的，重新new");
            _self.goToPage("forecast_content", "forecast", function(){
                forecastFrame = new win.forecast(win,dom,par);
                forecastFrame.setParentclass(_self);
                forecastFrame.setOriTable();
                forecastFrame.setOriScoreBoard();
                forecastFrame.init();
            },{});
        }else{
            //console.log("forecastFrame不是空的");
            forecastFrame.setParam(par);
            forecastFrame.init();
        }
    }

    _self.updateForecast = function(par){
        if(forecastFrame)forecastFrame.updateForecast();
    }

    _self.restartTimer = function(){
        //console.log("[index][restartTimer]");
        if(bodyFrame && bodyFrame.restartTimer) bodyFrame.restartTimer();
    }

    _self.resetForecast = function(){
        forecastFrame = null;
    }

    _self.getIovationBlackBox = function(){
        if(iovationURL!='' && top.blackbox == ""){
            top.iovationCount += 1;
			var p=document.location.protocol;
			p=p.replace(":","");
            iovation_Proxy=iovation_Proxy.replace("https","");
			iovation_Proxy=iovation_Proxy.replace("http","");
			iovationURL=p+iovation_Proxy+"/iovation/vindex.html?webProtocal="+p+"&webDomain="+document.domain;
			
            var iovationFrame = document.createElement("iframe");
            iovationFrame.id = "SI2_func";
            iovationFrame.style.display = "none";
            iovationFrame.src=iovationURL;
            document.body.appendChild(iovationFrame);
            setTimeout(_self.loadIovationFinish,10000,iovationFrame); 
		}
    }

    _self.loadIovationFinish = function(iovationFrame){
        _self.iovationAbort(iovationFrame);
        if(top.blackbox != "" || top.iovationCount >= 3){
            CookieManager.set("loadBB","ok");
            var urlParams = "";
            urlParams = "uid=" + top["userData"].uid;
            urlParams += "&blackbox=" + top.blackbox;
            urlParams +="&auto="+top.iovationKey;
            urlParams = "p=sendIovation&"+ urlParams;

            var getHTML = new HttpRequest();
            getHTML.addEventListener("onError", _self.onError);
            getHTML.addEventListener("LoadComplete",_self.sendIovationComplete);
            getHTML.loadURL(top.m2_url,"POST",urlParams);
            return;
        }else{
            _self.getIovationBlackBox();
        }
    }

    _self.iovationAbort = function(iovationFrame){
        iovationFrame.parentNode.removeChild(iovationFrame);
    }

    _self.chkBannerCount=function(count){
        bannerCnt = count;
        if(rightPanelFrame)rightPanelFrame.bannerGameCount(count);
    }

    _self.bannerCount=function(){
        return bannerCnt;
    }

    _self.intoGame=function(targetObj){
        var nowTS = util.getTimestamp();
        targetObj.nowTS = nowTS;
        top["lastClickTS"] = nowTS;
        top.choice_gtype = targetObj.gtype;
        top.choice_showtype = targetObj.showtype;
        top.choice_rtype = targetObj.rtype;
        top.specialClick = "";
        top.outrightsClick = "";
       
        var postHash = new Object();
        postHash["gtype"] = top.choice_gtype;
        postHash["showtype"] = top.choice_showtype;
        postHash["rtype"] = top.choice_rtype;
        postHash["nowTS"] = targetObj.nowTS;
        var param = new Object();
        param["page"] = targetObj.page;
        param["post"] = "gtype="+top.choice_gtype+"&showtype="+top.choice_showtype+"&rtype="+top.choice_rtype;
        param["postHash"] = postHash;
        param["nowTS"] = targetObj.nowTS;
        if(targetObj.extends!="") param["extendsClass"] = targetObj.extends;
    
        _self.chgHeadCss({"showtype":top.choice_showtype});
        _self.bodyGoToPage(param);
    }

    _self.forecastBtnOn = function(data){
        if(bodyFrame != null){
            var _id = data.id;
            var _sw = data.sw;
            if(bodyFrame.forecastBtnOn)bodyFrame.forecastBtnOn(_id,_sw);
        }
    }

    _self.setFamilyHash = function(){
        for(var g=0;g<gtype_ary.length;g++){
            familyHash["game_list_"+gtype_ary[g].toUpperCase()] = Array("game_list_"+gtype_ary[g].toUpperCase(),"sport_menu","gameModel");
        }
        familyHash["league_index"] = Array("league_index","sport_menu","league_list_All","league_list_FS");
    }

    _self.setFooterTimetype = function(){
        if(footerFrame) footerFrame.setTimetype(top["userData"].timetype);
    }

    _self.updateTime = function(){
        if(top.resizePage=="other" && top.rightECID!=""){ //非盤面但有右面板
            if(bodyFrame.getData)bodyFrame.getData();
            if(rightPanelFrame.getData)rightPanelFrame.getData();
        }else{
            if(top.specialClick!=""){ //特殊盤面
                if(top.resizePage=="game_more"){
                    if(bodyFrame.getData)bodyFrame.getData();
                }else{
                    if(bodyFrame.gameTimerRun) bodyFrame.gameTimerRun();
                }
            }else{ //一般盤面
                if(top.choice_rtype!="fs"){
                    if(bodyFrame.getData)bodyFrame.getData();
                }else{
                    if(bodyFrame.getData_FS)bodyFrame.getData_FS();
                }
            }
        }
    }

    _self.hideCash = function(param){
        if(param.from=="header"){
            if(rightFrame!=null)rightFrame.hideCash(false);
        }else if(param.from=="right_menu"){
            if(headerFrame!=null)headerFrame.hideCash(false);
        }
    }

    _self.setIorChg = function(param){
        CookieManager.set("iorChgSw",param.sw);
        top.iorChgSw = param.sw;
        if(param.from=="game_list"){
            console.log("去right_menu設定 iorChgSw:"+param.sw);
            if(rightFrame!=null)rightFrame.setIorChg(false ,param.sw);
        }else if(param.from=="right_menu"){
            console.log("去game_list設定 iorChgSw:"+param.sw);
            if(leagueSettingFrame!=null)leagueSettingFrame.setIorChg(param.sw);
        }
    }

    _self.showLegSetting = function(){
        if(dom.getElementById("league_setting_loading")){
            dom.getElementById("league_setting_loading").style.display = "";
            util.addClass(dom.getElementById("league_setting_loading"),"page_on");
        }
        util.addClass(dom.getElementById("league_setting_show"),"on");
        _self.addbodylock();
        _self.setNowBodyLockStatus(true);
        if(leagueSettingFrame==null){
            _self.goToPage("league_setting_content", "league_setting", function(){
                leagueSettingFrame = new win.league_setting(win,dom);
                leagueSettingFrame.setParentclass(_self);
                leagueSettingFrame.init();           
            },{});
        }else{
            leagueSettingFrame.init();
        }
    }

    _self.goToChgSort = function(type){
        if(bodyFrame)bodyFrame.chgSortType({"sort_type":type});
    }

    _self.closeLeagueSetting = function(){
        if(leagueSettingFrame){
            leagueSettingFrame.closeLeagueSetting();
        }
    }

    _self.showLeagueFilter = function(){
        var tmp_choice_filter = (top.choice_showtype == "early")?"FU":"FT";
        _self.updateNowFilter(tmp_choice_filter);
        if(bodyFrame)bodyFrame.showLeagueFilter();
    }

    _self.updateNowFilter = function(filter){
        headerFrame.updateNowFilter(filter);
    }
}
var echo = function(){};
