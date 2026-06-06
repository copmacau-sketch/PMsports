function left_menu(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;

    var le_smallG;
    var accountM;
    var t_SU;
    var t_AG;
    var t_MEM;
    var t_Sub;
    var reportS;
    var t_report;
    // var oldRS;
    var t_analysis;
    var overView;
    var t_wmc;
    var layer;
    var downlayer;
    var menu_analysis;
    var account_class;

    _self.init=function(){
        util.echo("left load complete");

        layer = top.login_layer;
        if(layer == "co"){
            downlayer = "su";
        }else{
            if(layer == "su"){
                downlayer = "ag";
                account_class = "agent";
            }else if(layer == "ag"){
                downlayer = "mem";
                account_class = "member";
            }
            dom.getElementById("menu_account").classList.add(account_class);
        }

        le_smallG = dom.getElementById("le_smallG");
        util.addEvent(dom.getElementById("menu_home"), "click", _self.expendMenu, {"target":"home","page":"dashboard_main","id":"home"});
        util.addEvent(dom.getElementById("menu_account"), "click", _self.expendMenu, {"target":"account","page": "acc_"+downlayer+"_list","id":downlayer.toUpperCase()});
        util.addEvent(dom.getElementById("menu_report"), "click", _self.expendMenu, {"target":"report","page":"report_main","id":"report"});
        //util.addEvent(dom.getElementById("old_btn"), "click", _self.goToReportOld);
        util.addEvent(dom.getElementById("menu_analysis"), "click", _self.expendMenu, {"target":"analysis","page":"overView","id":"analysis"});
        util.addEvent(dom.getElementById("menu_wmc"), "click", _self.expendMenu, {"target":"wmc","id":"wmc"});
        util.addEvent(dom.getElementById("leftMask"), "click", _self.hideDiv, {"target":"home"});
        // util.addEvent(dom.getElementById("overViewS"), "click", _self.chgPage, {"page":"overView","target":"analysis"});
        // util.addEvent(dom.getElementById("re_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "INPLAY", "pageType": "totalbet",  "target": "analysis", "tbet_showtype": "INPLAY" });
        // util.addEvent(dom.getElementById("today_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "TODAY", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "TODAY" });
        // util.addEvent(dom.getElementById("fu_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "EARLY", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "EARLY" });
        // util.addEvent(dom.getElementById("parly_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "PARLAY", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "PARLAY" });
        // util.addEvent(dom.getElementById("outright_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "OUTRIGHT", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "OUTRIGHT" });
        // util.addEvent(dom.getElementById("started_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "STARTED", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "STARTED" });
        // util.addEvent(dom.getElementById("results_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "RESULTS", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "RESULTS" });

        //2019-04-10 Ricky 397.左邊控制版，當滑鼠移動到報表或帳號管理圖標後，在移到dashboard圖標後，左邊控制版的圖標選項不會自動收起(PJP-487)
        // util.addEvent(dom.getElementById("menu_home"), "mouseenter", _self.hideDiv, {"target":"home"});
        // util.addEvent(dom.getElementById("menu_account"), "mouseenter", _self.showDiv, {"target":"account"});
        // util.addEvent(dom.getElementById("menu_report"), "mouseenter", _self.showDiv, {"target":"report"});
        // util.addEvent(dom.getElementById("menu_analysis"), "mouseenter", _self.showDiv, {"target":"analysis"});

        // util.addEvent(dom.getElementById("menu_account"), "mouseleave", _self.hideDiv, { "target": "account" });
        // util.addEvent(dom.getElementById("menu_report"), "mouseleave", _self.hideDiv, { "target": "report" });
        // util.addEvent(dom.getElementById("menu_analysis"), "mouseleave", _self.hideDiv, { "target": "analysis" });
        util.addEvent(dom.getElementById("le_close"), "click", _self.closeLeftPanel);
        //放大menu
        //=== Dashboard ===
        util.addEvent(dom.getElementById("t_home"), "click", _self.expendMenu, {"target":"home","page":"dashboard_main","id":"home"});

        //=== Account Management ===
        accountM = dom.getElementById("accountM");
        t_SU = dom.getElementById("t_SU");
        t_AG = dom.getElementById("t_AG");
        t_MEM = dom.getElementById("t_MEM");
        t_Sub = dom.getElementById("t_Sub");
        // util.addEvent(dom.getElementById("tit_account"), "click", _self.expendMenu, {"target":"account"});

        //=== Reports ===
        t_report = dom.getElementById("t_report");
        util.addEvent(t_report, "click", _self.expendMenu, {"page":"report_main","target":"report","id":"report"});
        // util.addEvent(dom.getElementById("oldRS"), "click", _self.goToReportOld);

        //=== Total Bets ===
        t_analysis = dom.getElementById("t_analysis");
        util.addEvent(t_analysis, "click", _self.expendMenu, {"page":"overView","target":"analysis","id":"analysis"});

        //=== Wager Tracker ===
        t_wmc = dom.getElementById("t_wmc");
        util.addEvent(t_wmc, "click", _self.expendMenu, {"target":"wmc","id":"wmc"});

        if (top.user_enable == "S") {
            dom.getElementById("menu_wmc").style.display = "none";
            t_wmc.style.display = "none";
        }
        menu_analysis = dom.getElementById("menu_analysis")
        if(top.user_type == 2 || top.user_type == 3){
            if (pri_type.indexOf("A") == -1) { //即時注單
                dom.getElementById("menu_wmc").style.display = "none";
                t_wmc.style.display = "none";
                util.removeEvent(dom.getElementById("menu_wmc"), "click");
                util.removeEvent(t_wmc, "click");
            }
        }

        if(top.login_layer == "su"){
            t_SU.style.display="none";
        }
        if(top.login_layer == "ag"){
            t_SU.style.display="none";
            t_AG.style.display="none";
        }

        if (top.user_enable == "S") {
            menu_analysis.style.display = "none";
            t_analysis.style.display = "none";
        }

        //判斷子帳號有哪些權限來隱藏header
        if(top.user_type == 2 || top.user_type == 3){
            t_Sub.style.display = "none";     //手機版
            if(pri_type.indexOf("A")==-1){ //即時注單
                menu_analysis.style.display="none";
                t_analysis.style.display="none";
            }
            if(pri_type.indexOf("B")==-1){ //帳號管理
                dom.getElementById("menu_account").style.display="none";
                accountM.style.display="none";
            }
            if(pri_type.indexOf("C")==-1){ //報表
                dom.getElementById("menu_report").style.display="none";
                t_report.style.display="none";
            }
        }

        if (t_SU.style.display != "none") util.addEvent(t_SU, "click", _self.expendMenu, { "page": "acc_su_list", "target": "account","id":"SU" });
        if (t_AG.style.display != "none") util.addEvent(t_AG, "click", _self.expendMenu, { "page": "acc_ag_list", "target": "account","id":"AG" });
        if (t_MEM.style.display != "none") util.addEvent(t_MEM, "click", _self.expendMenu, { "page": "acc_mem_list", "target": "account","id":"MEM" });
        util.addEvent(t_Sub, "click", _self.expendMenu, { "page": "acc_sub_list", "target": "account","id":"Sub" });
        //_self.loadOverview();
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.chgPage=function(e, param){
        //util.echo("[left chgPage]:"+param);
        param.retFun = _self.changePageComplete;
        if(param.page=="report_main") param.pageName="report";
        if(param.page=="dashboard_main") param.pageName="dashboard";
        parentClass.dispatchEvent("bodyGoToPage", param);
        // if(param.page!="dashboard_main") _self.hideDiv(e, param);
        //if(param.page!="dashboard_main") _self.hideDiv(param);
        if (param.page == "overView"){
            param.pageName = "overview";
            param.pageType = "totalbet";
        }
        parentClass.dispatchEvent("closeLeftMenu", {"retFun":_self.showComplete});
        top.mu_isOpen = "close";

        if (param.page == "totalbet_header" && param.tbet_showtype != undefined) top.tbet_showtype = param.tbet_showtype;
    }

    //onFocus
    _self.onFocusEventHandler=function(evt, param){
        //targetObj.placeholder="";
        dom.getElementById("show_"+param.target).style.display = "";
    }

    //onBlur
    _self.onBlurEventHandler=function(evt, param){
        dom.getElementById("show_"+param.target).style.display = "none";
    }

    _self.showDiv=function(e, param){
        dom.getElementById("menu_"+param.target).className = "le_"+param.target+" active";

        //if (param.target == "analysis") _self.loadOverview();
    }

    _self.hideDiv=function(e, param){
        //2019-04-10 Ricky 397.左邊控制版，當滑鼠移動到報表或帳號管理圖標後，在移到dashboard圖標後，左邊控制版的圖標選項不會自動收起(PJP-487)
        if(param.target == "home"){
            var tmpAry = new Array("account","report","analysis");
            for(i=0;i<tmpAry.length;i++){
                var tmpObj = dom.getElementById("menu_"+tmpAry[i]);
                if(tmpObj.classList.contains("on_smallLi"))tmpObj.className = "le_"+tmpAry[i]+" on_smallLi";
                else tmpObj.className = "le_"+tmpAry[i];
            }
        }else{
            var tmpObj = dom.getElementById("menu_"+param.target);
            if(tmpObj.classList.contains("on_smallLi"))tmpObj.className = "le_"+param.target+" on_smallLi";
            else tmpObj.className = "le_"+param.target;
        }
    }

    _self.openMenu=function(){
        le_smallG.style.display="none";
        _self.sizeChange() ;
    }

    _self.closeMenu=function(){
        setTimeout(function () { le_smallG.style.display=""; }, 300);
        _self.sizeChange() ;
    }

    _self.closeLeftPanel = function () {
        top.mu_isOpen = "close";
        parentClass.dispatchEvent("closeLeftMenu", { "retFun": _self.showComplete });
    }

    //畫面改變時 fixed 的物件顯示會異常, 異動class 觸發畫面重新偵測
    _self.sizeChange = function () {
        var tmpObj = dom.getElementById("main") ;
        if (tmpObj) {
            tmpObj.classList.add("nofixed");
            setTimeout(function () { tmpObj.classList.remove("nofixed"); }, 400);
        }
    }

    _self.showComplete=function(){
        util.echo("showComplete");
    }

    _self.expendMenu=function(e, param){
        var le_class = param.id.toLowerCase();

        if(param.target=="wmc"){
            dom.getElementById("menu_wmc").className = "le_wmc" ;
            dom.getElementById("t_wmc").className = "le_wmc" ;
            _self.wmcOpen();
        }else{
            _self.chgColor(param);
            _self.chgPage(e,param);
            if (param.target != "home"){
                if (e.target.id.match(/^menu_/)) {
                    if(top.login_layer == "co"){
                        dom.getElementById("menu_" + param.target).className = "le_" + param.target + " on_smallLi ";
                    }else if (top.login_layer == "su" || top.login_layer == "ag"){
                        dom.getElementById("menu_" + param.target).className = "le_" + param.target + " on_smallLi " + account_class;
                    }
                }
                if (e.target.id.match(/^t_/)) dom.getElementById("t_" + param.id).className = "le_" + le_class + " le_titleOn";
            }
        }
    }

    _self.wmcOpen = function(){
        var obj = new Object();
        obj.filename = "app/wmc/index.php";
        obj.title = "_blank";
        parentClass.dispatchEvent("newOpenPageNoPar", obj);
    }

    _self.goToReportOld=function(){
        return false;
    }

    //menu變深底色
    _self.chgColor=function(param){
        util.echo(param.target);
        util.echo("left menu chgColor");
        //初始化
        var menuAry = new Array("home","account","report","analysis");
        var tit_rry= new Array("home","report","SU","AG","MEM","Sub","analysis");

        for(i=0;i<menuAry.length;i++){
            dom.getElementById("menu_"+menuAry[i]).className = "le_"+menuAry[i];
            // dom.getElementById("tit_"+menuAry[i]).className = "le_"+menuAry[i];
            if(menuAry[i] == "account" && (top.login_layer == "su" || top.login_layer == "ag")) {
                dom.getElementById("menu_"+menuAry[i]).classList.add(account_class);
            }
        }
        for(i=0;i<tit_rry.length;i++){
            dom.getElementById("t_"+tit_rry[i]).className = "le_"+tit_rry[i].toLowerCase();
        }

        if(param.target=="report"){
            param.id = "report";
        }else if(param.target=="home"){
            param.id = "home";
        }else if(param.target=="analysis"){
            param.id = "analysis";
        }

        if(menuAry.indexOf(param.target) != -1){
            dom.getElementById("menu_"+param.target).classList.add("on_smallLi");
            if(typeof(param.id)!="undefined"){
                dom.getElementById("t_"+param.id).classList.add("le_titleOn");
            }
        }
        //dom.getElementById("menu_"+param.target).className = "le_"+param.target+" on_smallLi active";
        //dom.getElementById("tit_"+param.target).className = "le_"+param.target+" le_titleOn active";

    }

    _self.loadOverview = function () {
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.loadFinish);
        getHttp.loadURL(top.url, "POST", _self.getUrlParam());
    }

    _self.getUrlParam = function () {
        var sendCode = "";
        sendCode += "p=get_overview";
        sendCode += "&uid=" + top.uid;
        sendCode += "&login_layer=" + top.login_layer;
        sendCode += "&id=" + top.layer_id;
        return sendCode;
    }

    _self.loadFinish = function (xml) {
        var gtypeAry = config_set.get("GTYPEARY");
        var timeAry = new Array("inplay", "today", "early", "outright", "parlay");
        var ary = JSON.parse(xml);
        var _status = util.showTxt(ary, "status");
        var total = new Array();

        for (var k = 0; k < timeAry.length; k++) {
            var time = timeAry[k];
            total[time] = 0;
        }
        for (var j = 0; j < gtypeAry.length; j++) {
            var gtype = gtypeAry[j];
            for (var i = 0; i < timeAry.length; i++) {
                var time = timeAry[i];
                if (top.user_enable != "S") {
                    total[time] += (_status["period"][gtype][time]["bets"]) * 1;
                }
            }
        }

        for (var k = 0; k < timeAry.length; k++) {
            var _time = timeAry[k];
            var _total = total[_time];
            document.getElementById(_time + "_total_S").innerHTML = _total;
            document.getElementById(_time + "_total_L").innerHTML = _total;
        }

    }

}
