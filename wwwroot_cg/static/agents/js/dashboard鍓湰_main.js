function dashboard_main(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "dashboard_main";
    var util;
    var LS;
    var config_set;
    var Timer;
    var timerHash;
    var hr = null;
    var eventHandler = new Object();
    var LS_code;

    //Ricky
    var report_btn;
    var acc_btn;
    var bet_btn;
    var credits;
    var balance;
    var balance_show ;
    var this_period_performance ;
    var this_period ;
    var remaining_days ;
    var completed_days ;
    var logindate;
    var amount_mem;
    var lastdate;
    // var active;
    // var inactive;
    // var viewOnly;
    // var viewOnly_br;
    // var suspend;
    // var su_agent_count;
    // var agent_count;
    // var mem_count;
    var su_enable_Y;
    var su_enable_N;
    var su_pri_Y;
    var su_pri_N;
    var a_enable_Y;
    var a_enable_N;
    var a_pri_Y;
    var a_pri_N;
    var m_enable_Y;
    var m_enable_N;
    var m_pri_Y;
    var m_pri_N;
    var dashboard_chart ;
    // var nowStatus = "Y";
    // var da_SU;
    // var da_A;
    // var da_M;
    var nowOverView = "yes";
    var originalOverView = "yes";
    var nowTurnOver = "tp";
    var nowWinLoss = "tp";
    var nowPossess = "tp";
    var nowMembers = "tp";
    var nowMem = "tp";

    var date_s = "";
    var date_e = "";
    var dashHash = new Object();
    var now_dash_type = "";
    var pri_type = top.pri_type;
    var cookie;
    var Storage;
    var use_Storage_code = ",possess,members,turnover,winloss,";

    // storage存圖表的key串上 uid使用, 達成每次重登就會重做的動作
    var storage_uid = top.uid;

    var search_last = "N";
    var _mc = new Object();
    var list = new Object();

    var OverView_arr = ["profit","result","stock"];

    var downlineSummary = new Object();
    var downline_summary_options = {
        tooltip: {
            show: false,
            trigger: "item",
        },
        legend: {
            show: true,
            // selectedMode: false, //側邊欄點擊效果
            right: "20%",
            align: "left",
            y: "center",
            itemGap: 20,
            itemWidth: 20,
            itemHeight: 20,
            textStyle: {
                fontFamily: "Arial",
                fontSize: 14,
                color: "rgba(0, 0, 0, 0.56)",
            },
            orient: "vertical",
            formatter: function (name) {
                var value;
                list.forEach((item) => {
                    if (item.name == name) {
                        value = item.value;
                    }
                })
                return name+"  "+value;
            },
        },
        series: [
            {
                // name: "Downline Summary",
                type: "pie",
                center: ["30%", "50%"],
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 5,
                    borderColor: "#fff",
                    borderWidth: 2,
                },
                label: {
                    show: false,
                    formatter: '{b}\n{c}',
                    position: 'center',
                    lineHeight: 30,
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '20'
                        }
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: "30",
                        fontWeight: "bold",
                    },
                },
                labelLine: {
                    show: false,
                },
                animation: "auto",
                animationDuration: 1000,
                animationDelay: 600,
                // 下線狀態 圖表資料
                data: [
                    { value: 0, name: "Y", this_enable: "Y", this_user_type: "ma", itemStyle: {normal:{ color: "#29C2CC" }, emphasis:{ color: "#22A2AA" }} },
                    { value: 0, name: "N", this_enable: "N", this_user_type: "ma", itemStyle: {normal:{ color: "#FF4E65" }, emphasis:{ color: "#FF1A37" }} },
                    { value: 0, name: "S", this_enable: "S", this_user_type: "ma", itemStyle: {normal:{ color: "#F3B932" }, emphasis:{ color: "#ECA90E" }} },
                    { value: 0, name: "F", this_enable: "F", this_user_type: "ma", itemStyle: {normal:{ color: "#A3ACB1" }, emphasis:{ color: "#8E999F" }} }
                ],
            },
        ],
    };
    var original_width_model = "";

    _self.init = function () {
        util.echo("dashboard_main load complete");
        _self.addEventListener("startTimer", _self.startTimer);
        _self.addEventListener("stopTimer", _self.stopTimer);
        _self.addEventListener("clearTimer", _self.clearTimer);
        _self.addEventListener("setNowDashboard", _self.setNowDashboard);
        if (win.addEventListener) win.addEventListener("resize", _self.do_resize);
        if (win.addEventListener) win.addEventListener("orientationchange", _self.do_resize);


        report_btn = dom.getElementById("report_btn");
        acc_btn = dom.getElementById("acc_btn");
        bet_btn = dom.getElementById("bet_btn");

        //==== Performance Overview ====
        if (top.user_type == 1 || pri_type.indexOf("C") != -1) {//報表
            yesterDay = dom.getElementById("per_yes");
            lastWeek = dom.getElementById("per_lw");
            thisPeriod = dom.getElementById("per_tp");
            util.addEvent(yesterDay, "click", _self.showPerformance, { "range": "yes" });
            util.addEvent(lastWeek, "click", _self.showPerformance, { "range": "lw" });
            util.addEvent(thisPeriod, "click", _self.showPerformance, { "range": "tp" });
            // 滑動按鈕區塊時, 左右兩邊要有淡出的效果
            util.addEvent(dom.getElementById("per_box_scroll"), "scroll", _self.roll, { "chk_obj": dom.getElementById("per_box_scroll"),"do_obj": dom.getElementById("per_box_scroll").parentNode });

            _self.getOverView();
        }else{
            dom.getElementById("box_per").style.display = "none";
        }

        //==== Account Overview ====
        credits = dom.getElementById("credits");
        balance = dom.getElementById("balance");
        balance_show = dom.getElementById("balance_show");
        // 本期期數區間
        this_period_performance = dom.getElementById("this_period_performance");
        this_period = dom.getElementById("this_period");
        remaining_days = dom.getElementById("remaining_days");
        completed_days = dom.getElementById("completed_days");

        logindate = dom.getElementById("last_login");
        amount_mem = dom.getElementById("amount_mem");
        lastdate = dom.getElementById("lastdate");


        //==== Downline Status ====
        if (top.user_type == 1 || pri_type.indexOf("B") != -1) { //帳號管理
            // active = dom.getElementById("active");
            // inactive = dom.getElementById("inactive");
            // viewOnly = dom.getElementById("viewOnly");
            // viewOnly_br = dom.getElementById("viewOnly_br");
            // suspend = dom.getElementById("suspend");
            // su_agent_count = dom.getElementById("su_agent_count");
            // agent_count = dom.getElementById("agent_count");
            // mem_count = dom.getElementById("mem_count");
            _mc["da_SU"] = dom.getElementById("da_SU");
            _mc["da_A"] = dom.getElementById("da_A");
            _mc["da_M"] = dom.getElementById("da_M");
            _mc["downline_summary"] = dom.getElementById("downline_summary");
            // 下線狀態 語系
            downline_summary_options["series"][0]["data"][0]["name"] = LS.get("enable_Y");
            downline_summary_options["series"][0]["data"][1]["name"] = LS.get("enable_N");
            downline_summary_options["series"][0]["data"][2]["name"] = LS.get("enable_S");
            downline_summary_options["series"][0]["data"][3]["name"] = LS.get("enable_F");

            if (top.login_layer == "su") {
                _mc["da_SU"].style.display = "none";
            }
            if (top.login_layer == "ag") {
                _mc["da_SU"].style.display = "none";
                _mc["da_A"].style.display = "none";
            }

            // util.addEvent(active, "click", _self.show_Active);
            // util.addEvent(inactive, "click", _self.show_Inactive);
            // util.addEvent(viewOnly, "click", _self.show_ViewOnly);
            // util.addEvent(viewOnly_br, "click", _self.show_ViewOnly);
            // util.addEvent(suspend, "click", _self.show_Suspend);
            util.addEvent(_mc["da_SU"], "click", _self.show_downline_summary, "su");
            util.addEvent(_mc["da_A"], "click", _self.show_downline_summary, "a");
            util.addEvent(_mc["da_M"], "click", _self.show_downline_summary, "m");
            // 滑動按鈕區塊時, 左右兩邊要有淡出的效果
            util.addEvent(dom.getElementById("da_box_scroll"), "scroll", _self.roll, { "chk_obj": dom.getElementById("da_box_scroll"), "do_obj": dom.getElementById("da_box_scroll").parentNode});
        }else{
            dom.getElementById("downlineS").style.display = "none";
        }
        //==== Downline Status End====


        util.addEvent(acc_btn, "click", _self.chooseLayer);
        util.addEvent(report_btn, "click", _self.chgPage, { "page": "report_main", "type": "report", "pageName": "report" });
        //util.addEvent(bet_btn, "click", _self.chgPage, { "page": "totalbet_header", "type": "bet", "pageName": "bet" });
        //Dashboard-Total bet按鈕，按下後幫連接到Overview頁面
        util.addEvent(bet_btn, "click", _self.chgPage, { "page": "overView", "pageType": "totalbet", "pageName": "overview", "target":"analysis"});
        _self.addEventListener("choseDateEvent", _self.choseDateEvent);
        _self.addEventListener("viewReportTeach", _self.viewReportTeach);


        //判斷子帳號有哪些權限來隱藏header
        if (top.user_type != 1) {
            if (pri_type.indexOf("A") == -1) { //即時注單
                bet_btn.style.display = "none";
                util.removeEvent(bet_btn, "click");
            }
            if (pri_type.indexOf("B") == -1) { //帳號管理
                acc_btn.style.display = "none";
                util.removeEvent(acc_btn, "click");
            }
            if (pri_type.indexOf("C") == -1) { //報表
                report_btn.style.display = "none";
                util.removeEvent(report_btn, "click");
            }
        }

        _self.getTmpData();
        _self.initHttpRequest();
        //_self.getData();

        if (top.user_type == 1 || pri_type.indexOf("C") != -1) {//報表
            //==== Possess ====
            // util.addEvent(dom.getElementById("possess_tp"), "click", _self.chgPossess, { "range": "tp" });

            //==== Members ====
            // util.addEvent(dom.getElementById("members_tp"), "click", _self.chgMembers, { "range": "tp" });

            //==== TurnOver ====
            // util.addEvent(dom.getElementById("turnover_tp"), "click", _self.chgTurnOver, { "range": "tp" });

            //==== WinLoss ====
            // util.addEvent(dom.getElementById("winloss_tp"), "click", _self.chgWinLoss, { "range": "tp" });

            _self.getPossess();
            _self.getMembers();
            _self.getTurnOver();
            _self.getWinLoss();
        } else {
            dom.getElementById("box_possess").style.display = "none";
            dom.getElementById("box_members").style.display = "none";
            dom.getElementById("box_turnover").style.display = "none";
            dom.getElementById("box_winloss").style.display = "none";
        }

        _self.do_resize() ;
        // _self.createTimer();
        // _self.startTimer();

        // dom.body.addEventListener("touchstart", _self.touchStart);
        // dom.body.addEventListener("touchmove", _self.touchMove);
        // util.addEvent(dom.getElementById("body_show"), "scroll", _self.onScroll);
        // var tmp = dom.getElementsByTagName("CANVAS");
        // for(var i = 0; i < tmp.length; i++){
        //     tmp[i].addEventListener("mousemove", _self.mouseOver);
        // }

        // dom.body.addEventListener("touchend", _self.touchEnd);
    }

    // _self.mouseOver=function(e){
    //     var _id = e.target.id;
    //     now_dash_type = _id.split("_")[1];
    // }

    _self.initHttpRequest = function () {
        var _time = config_set.get("RETRY_TIME");
        var _limit = config_set.get("RETRY_LIMIT");
        hr = new win.HttpRequestRetry(win.HttpRequest, _time, _limit);
        hr.setParentclass(_self);
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadComplete);
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        config_set = parentClass.getThis("config_set");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash");
        getView = parentClass.getThis("getView");
        cookie = parentClass.getThis("cookie");
        Storage = parentClass.getThis("Storage");
    }

    _self.getParentThis = function (varible) {
        return parentClass.getThis(varible);
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    //exit
    _self.exitEvent = function () {
        util.echo("dashboard_main exit");
        now_dash_type = "";
        hr.clearObj();
        _self.destroyDashboard();
        if (win.removeEventListener){
            win.removeEventListener("resize", _self.do_resize);
            win.removeEventListener("orientationchange", _self.do_resize);
        }
        // dom.body.removeEventListener("touchstart", _self.touchStart);
        // dom.body.removeEventListener("touchmove", _self.touchMove);
        // util.removeEvent(dom.getElementById("body_show"), "scroll");
        // var tmp = dom.getElementsByTagName("CANVAS");
        // for(var i = 0; i < tmp.length; i++){
        //     tmp[i].removeEventListener("mousemove", _self.mouseOver);
        // }
        // dom.body.removeEventListener("touchend", _self.touchEnd);
        return true;
    }

    _self.destroyDashboard = function () {
        for (var keys in dashHash) {
            dashHash[keys].destroy();
            // dashHash[keys].hideToopTip();
        }
    }

    // _self.touchStart = function (e) {
    //     var tag = e.target.tagName;

    //     writeLog("[touch start]" + tag);

    //     if (tag.toUpperCase() == "CANVAS") {
    //         var _id = e.target.id;
    //         now_dash_type = _id.split("_")[1];
    //     } else {
    //         _self.checkRepaint();
    //     }
    // }

    // _self.touchMove = function (e) {
    //     _self.checkRepaint();
    // }

    // _self.checkRepaint = function () {
    //     writeLog("[checkRepaint]" + now_dash_type);
    //     if (now_dash_type != "") {

    //         var tooltipEl = dom.getElementById('chartjs-tooltip');
    //         if (tooltipEl.style.opacity != 0) {

    //             writeLog("some tooltips show");
    //             if (dashHash[now_dash_type]) dashHash[now_dash_type].repaint();

    //         }
    //         // now_dash_type = "";
    //     }
    // }

    // _self.onScroll=function(e, param){
    //     if(now_dash_type!=""){
    //         dashHash[now_dash_type].repaint();
    //     }
    // }

    _self.roll = function (e,param) {
        if (param.chk_obj.scrollLeft == 0) {
            param.do_obj.classList.remove("scroll") ;
        } else {
            param.do_obj.classList.add("scroll") ;
        }
    }

    _self.setNowDashboard = function (param) {
        now_dash_type = param.dash_type;
    }


    _self.choseDateEvent = function (param) {

        var postHash = new Object();
        postHash["report_kind"] = "A";
        postHash["report_type"] = "set";
        postHash["result_type"] = "Y";
        postHash["date_start"] = param.date;
        postHash["date_end"] = param.date;
        postHash["gtype"] = "ALL";
        postHash["wtype"] = "ALL";
        postHash["view_layer"] = top.login_layer;

        var param = new Object();
        param["page"] = "report_" + top.login_layer;
        param["post"] = "view_layer=" + top.login_layer;
        param["postHash"] = postHash;
        param["extendsClass"] = "report_index";

        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.viewReportTeach = function (param) {
        parentClass.dispatchEvent("viewReportTeach", param);
    }

    _self.createTimer = function () {

        timerHash["dashboard"] = new Timer(config_set.get("DASHBOARD"));
        timerHash["dashboard"].setParentclass(_self);
        //timerHash["dashboard"].dont_clear = true; //設定為不清除timer
        timerHash["dashboard"].init();
        timerHash["dashboard"].addEventListener("TimerEvent.TIMER", _self.timerRun);
        timerHash["dashboard"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerComplete);

    }

    _self.startTimer = function () {
        util.echo("dashboard startTimer");
        // timerHash["dashboard"].startTimer();
    }

    _self.stopTimer = function () {
        util.echo("dashboard stopTimer");
        timerHash["dashboard"].stopTimer();
    }

    _self.clearTimer = function () {
        util.echo("dashboard clearTimer");
        if (typeof (timerHash["dashboard"]) !='undefined'){
            timerHash["dashboard"].clearObj();
        }
    }

    _self.timerRun = function () {
        util.echo("DASHBOARD timer"); //每10秒做一次
        _self.getData();
    }

    _self.timerComplete = function () {
        util.echo("timerComplete"); //no complete
    }

    _self.getData = function () {
        //var url = util.getWebUrl()+"/transform.php";
        hr.loadURL(top.url, "POST", "p=get_dashboard&ver=" + top.ver);
    }

    //新管理端第一階段用
    _self.getTmpData = function () {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&user_id=" + top.user_id;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&langx=" + top.langx;
        urlParams += "&layer_id=" + top.layer_id;
        urlParams = "p=get_dashboard&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.LoadComplete);
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.onError = function () {
        util.echo("onError");
    }

    _self.LoadComplete = function (json) {
        util.echo(json);
        // var testnum = 100000;
        // var testans = util.formatThousand(testnum);
        // util.echo("===>"+testans);
        try {
            var hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;

            if (hash["now_maxcredit"] == "-") {
                credits.innerHTML = "-";
                balance.innerHTML = "-";
            } else {
                // credits.innerHTML = _self.formatThousand(hash["now_maxcredit"] * 1);
                _self.set_fz(credits, hash["now_maxcredit"] * 1);   // 設定數字大小
                // 若位數達到8位數, 小數點後的數字就省略不顯示 10000000
                var float_bit = (Math.abs(hash["now_maxcredit"] * 1) >= 100000000) ? 0 : 2;
                // 數字動畫
                _self.show_scroll_numbers(credits, 0, hash["now_maxcredit"] * 1, float_bit, false);

                if (top.pay_type == "1"){
                    balance_show.style.display = "none";
                }else{
                    balance_show.style.display = "";
                    var tmp_balance = hash["now_maxcredit"] * 1 - hash["lv_maxcredit"] * 1;
                    _self.set_fz(balance, tmp_balance);   // 設定數字大小
                    var float_bit = (Math.abs(tmp_balance * 1) >= 100000000) ? 0 : 2;
                    // 數字動畫
                    _self.show_scroll_numbers(balance, 0, tmp_balance * 1, float_bit, false);
                }
            }


            // 數字動畫
            _self.show_scroll_numbers(amount_mem, 0, hash["amount_mem"] * 1, 0, false);
            if (hash["logindate"] != "") {
                logindate.innerHTML = hash["logindate"];
            }
            lastdate.innerHTML = hash["lastdate"];

            // 本期期數區間顯示
            if (hash["this_period"]["show"]=="Y"){
                this_period_performance.innerHTML = hash["this_period"]["this_period"] ;
                this_period.innerHTML = hash["this_period"]["this_period"];
                remaining_days.innerHTML = hash["this_period"]["remaining_days"] ;
                completed_days.innerHTML = hash["this_period"]["completed_days"] ;
            } else {
                this_period_performance.innerHTML = LS.get("period_not_set");
                this_period.innerHTML = LS.get("period_not_set");
                remaining_days.innerHTML = "-";
                completed_days.innerHTML = "-";
            }

            //==== Downline Status ====
            if (top.user_type == 1 || pri_type.indexOf("B") != -1) { //帳號管理
                // Super_agents
                su_enable_Y = hash["su_enable_Y"];
                su_enable_N = hash["su_enable_N"];
                su_pri_Y = hash["su_pri_Y"];
                su_pri_N = hash["su_pri_N"];

                // Agents
                a_enable_Y = hash["a_enable_Y"];
                a_enable_N = hash["a_enable_N"];
                a_pri_Y = hash["a_pri_Y"];
                a_pri_N = hash["a_pri_N"];

                // Members
                m_enable_Y = hash["m_enable_Y"];
                m_enable_N = hash["m_enable_N"];
                m_pri_Y = hash["m_pri_Y"];
                m_pri_N = hash["m_pri_N"];

                // 預設 可管理的最高層級
                var tmp_user_type = "su";
                if (top.login_layer == "su") {
                    tmp_user_type = "a";
                }else if (top.login_layer == "ag") {
                    tmp_user_type = "m";
                }
                dashboard_chart = hash["dashboard_chart"] ;
                // 顯示 下線狀態環形圖
                if (dashboard_chart=="Y"){
                    var e = null;
                    _self.show_downline_summary(e, tmp_user_type);
                    if (downlineSummary != null){
                        // 圖表的點擊事件
                        downlineSummary.on('click', function (params) {
                            if (params.componentType === 'series') {
                                _self.goToQuick({ "search_type": params.data.this_user_type, "enable": params.data.this_enable });
                            }
                        });
                        // 狀態說明列 點擊事件
                        downlineSummary.on('legendselectchanged', function (params) {
                            var option = this.getOption();
                            option.legend[0].selected[params.name] = true;  //取消點擊事件
                            this.setOption(option)

                            var this_user_type = this_enable = "" ;
                            list.forEach((item) => {
                                if (item.name == params.name) {
                                    this_user_type = item.this_user_type;
                                    this_enable = item.this_enable;
                                }
                            })
                            if (this_user_type !="" && this_enable !=""){
                                _self.goToQuick({ "search_type": this_user_type, "enable": this_enable });
                            }
                        });
                        _self.setSysMsgVisible("downline_summary", "div");
                    }else{
                        // echarts物件沒有建立成功的話, 顯示維護圖案
                        _self.setSysMsgVisible("downline_summary", "sysmsg");
                    }
                }else{
                    // 顯示維護圖案
                    _self.setSysMsgVisible("downline_summary", "sysmsg");
                }
            }
            //==== Downline Status End====
        } catch (e) {
            util.echo("onError");
            //show error
            return;
        }
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "home" });
        dom.getElementById("body_show").classList.add("body_pb");
        parentClass.dispatchEvent("showLoading", { "showLoading": false, "defalutPage": true });
    }

    _self.show_downline_summary = function (e, show_user_type) {
        if (dashboard_chart != "Y") return ;
        var obj_width = _mc["downline_summary"].offsetWidth ;
        if (getView().viewportwidth<600){
            delete downline_summary_options.legend.right ;
            downline_summary_options["legend"]["top"] = "bottom";
            var summary_height = "570px";
            downline_summary_options["series"][0]["center"] = ["50%", "35%"];
            if (obj_width <= 313) {
                summary_height = "400px";
                downline_summary_options["series"][0]["center"] = ["50%", "30%"];
            } else if (obj_width < 360) {
                summary_height = "440px";
                downline_summary_options["series"][0]["center"] = ["50%", "30%"];
            } else if (obj_width < 410) {
                summary_height = "480px";
            } else if (obj_width < 460) {
                summary_height = "520px";
            } else if (obj_width < 510) {
                summary_height = "560px";
            }
            _mc["downline_summary"].style.height = summary_height;
        } else {
            var right_per = "20%";
            if (obj_width<=315){
                right_per = "0%";
            } else if (obj_width <= 355) {
                right_per = "5%";
            } else if (obj_width <= 430) {
                right_per = "10%";
            } else if (obj_width < 505) {
                right_per = "15%";
            }
            _mc["downline_summary"].style.height = "320px";
            downline_summary_options["legend"]["right"] = right_per;
            delete downline_summary_options.legend.top;
            downline_summary_options["series"][0]["center"] = ["30%", "50%"];
        }
        if (getView().viewportwidth <=1024){
            downline_summary_options["series"][0]["label"]["emphasis"]["show"] = false;
        }else{
            downline_summary_options["series"][0]["label"]["emphasis"]["show"] = true;
        }
        // 下線狀態 環形圖
        try{
            downlineSummary = echarts.init(_mc["downline_summary"]);
        }catch(e){
            downlineSummary = null;
        }

        var all_show_user_type = ["su","a","m"];
        for (var key in all_show_user_type){
            _mc["da_" + all_show_user_type[key].toUpperCase()].classList.remove("active") ;
        }
        _mc["da_" + show_user_type.toUpperCase()].classList.add("active");

        downline_summary_options["series"][0]["data"][0]["value"] = eval(show_user_type + "_enable_Y"); // 啟用
        downline_summary_options["series"][0]["data"][1]["value"] = eval(show_user_type + "_enable_N"); // 停用
        downline_summary_options["series"][0]["data"][2]["value"] = eval(show_user_type + "_pri_Y"); // 只能看帳
        downline_summary_options["series"][0]["data"][3]["value"] = eval(show_user_type + "_pri_N"); // 禁止登入

        var search_type = "ma" ;
        if (show_user_type=="a"){
            search_type = "ag";
        } else if (show_user_type == "m") {
            search_type = "mem";
        }
        downline_summary_options["series"][0]["data"][0]["this_user_type"] = search_type;
        downline_summary_options["series"][0]["data"][1]["this_user_type"] = search_type;
        downline_summary_options["series"][0]["data"][2]["this_user_type"] = search_type;
        downline_summary_options["series"][0]["data"][3]["this_user_type"] = search_type;
        list = downline_summary_options["series"][0]["data"];
        if (downlineSummary!=null)  downlineSummary.setOption(downline_summary_options);
    }

    _self.goToQuick = function (_obj) {
        var paramHash = new Object();
        paramHash["search_layer"] = top.login_layer;
        paramHash["search_id"] = top.layer_id;
        paramHash["search_type"] = _obj.search_type;
        paramHash["enable"] = _obj.enable

        var obj = new Object();
        obj["page"] = "quick_search";
        obj["postHash"] = paramHash;
        parentClass.dispatchEvent("bodyGoToPage", obj);
    }

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }

    // _self.show_Active = function () {
    //     nowStatus = "Y";
    //     active.className = "on";
    //     inactive.className = "";
    //     viewOnly.className = "hide_on_mini_only hide_on_med_only";
    //     viewOnly_br.className = "re_title_br hide_on_small_only hide_on_large_only";
    //     suspend.className = "";
    //     su_agent_count.innerHTML = su_enable_Y;
    //     agent_count.innerHTML = a_enable_Y;
    //     mem_count.innerHTML = m_enable_Y;
    // }
    // _self.show_Inactive = function () {
    //     nowStatus = "N";
    //     active.className = "";
    //     inactive.className = "on";
    //     viewOnly.className = "hide_on_mini_only hide_on_med_only";
    //     viewOnly_br.className = "re_title_br hide_on_small_only hide_on_large_only";
    //     suspend.className = "";
    //     su_agent_count.innerHTML = su_enable_N;
    //     agent_count.innerHTML = a_enable_N;
    //     mem_count.innerHTML = m_enable_N;
    // }
    // _self.show_ViewOnly = function () {
    //     nowStatus = "S";
    //     active.className = "";
    //     inactive.className = "";
    //     viewOnly.className = "hide_on_mini_only hide_on_med_only on";
    //     viewOnly_br.className = "re_title_br hide_on_small_only hide_on_large_only on";
    //     suspend.className = "";
    //     su_agent_count.innerHTML = su_pri_Y;
    //     agent_count.innerHTML = a_pri_Y;
    //     mem_count.innerHTML = m_pri_Y;
    // }
    // _self.show_Suspend = function () {
    //     nowStatus = "F";
    //     active.className = "";
    //     inactive.className = "";
    //     viewOnly.className = "hide_on_mini_only hide_on_med_only";
    //     viewOnly_br.className = "re_title_br hide_on_small_only hide_on_large_only";
    //     suspend.className = "on";
    //     su_agent_count.innerHTML = su_pri_N;
    //     agent_count.innerHTML = a_pri_N;
    //     mem_count.innerHTML = m_pri_N;
    // }

    _self.showPerformance = function (e, param) {
        util.echo("showPerformance");
        if (param.range == "yes") {
            yesterDay.classList.add("active")
            lastWeek.classList.remove("active")
            thisPeriod.classList.remove("active")
        } else if (param.range == "lw") {
            yesterDay.classList.remove("active")
            lastWeek.classList.add("active")
            thisPeriod.classList.remove("active")
        } else if (param.range == "tp") {
            yesterDay.classList.remove("active")
            lastWeek.classList.remove("active")
            thisPeriod.classList.add("active")
        }
        nowOverView = param.range;

        var OverView_arr_len = OverView_arr.length;
        for(var i=0; i<OverView_arr_len; i++){
            var OverView_obj = dom.getElementById("div_" + OverView_arr[i]);
            util.addEvent(OverView_obj, "click", _self.chk_ErrorMsg);
        }

        _self.getOverView();
    }

    //還沒載入，彈出提示窗
    _self.chk_ErrorMsg = function(){
        var errHash = new Object;
        errHash["code"] = "m_rep";
        errHash["msg"] = LS.get("err_rp");
        errHash["status"] = "error";
        util.chkErrorMsg(errHash, LS_code)
    }

    //==== OverView ====
    _self.getOverView = function () {
        _self.setSysMsgVisible("po", "loading");
        if (top.user_type != 1 && pri_type.indexOf("C") == -1) return;//報表
        _self.get_performace("overview", nowOverView, _self.getOverViewComplete);
    }


    _self.getOverViewComplete = function (json) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)){
                _self.set_showPerformance(originalOverView) ;
                return;
            }
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return;
        }

        if (hash["status"] == "200") {
            if (hash["date"] != nowOverView)    _self.set_showPerformance(hash["date"]);
            originalOverView = nowOverView ;
            if (search_last == "Y") {
                var show_last = hash["show_last"];
                var json = JSON.stringify(show_last);
                Storage.set(top.login_layer + top.user_id + storage_uid + "overview" + nowOverView + top.langx + top.ver, json, 1 / 24);
            } else {
                var show_last = JSON.parse(Storage.get(top.login_layer + top.user_id + storage_uid + "overview" + nowOverView + top.langx + top.ver)) ;
            }
            _self.set_OverView("profit", hash, show_last);
            _self.set_OverView("result", hash, show_last);
            _self.set_OverView("stock", hash, show_last);

            _self.setSysMsgVisible("po", "div");
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "term_all") {
                _self.setSysMsgVisible("po", "sysmsg");
            } else if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart"){
                _self.setSysMsgVisible("po", "sysmsg");
                // 開關關閉的話 將storage暫存的資料刪除
                Storage.vague_del(top.login_layer + top.user_id + storage_uid + "overview");
            } else {
                util.showErrorMsg(msg);
            }
        }
    }

    _self.set_showPerformance = function (showOverView){
        if (showOverView == "yes") {
            yesterDay.classList.add("active")
            lastWeek.classList.remove("active")
            thisPeriod.classList.remove("active")
        } else if (showOverView == "lw") {
            yesterDay.classList.remove("active")
            lastWeek.classList.add("active")
            thisPeriod.classList.remove("active")
        } else if (showOverView == "tp") {
            yesterDay.classList.remove("active")
            lastWeek.classList.remove("active")
            thisPeriod.classList.add("active")
        }
        nowOverView = showOverView;
    }

    _self.set_OverView = function (type, hash, show_last) {
        var this_Obj = dom.getElementById("div_" + type);
        if (this_Obj){
            util.addEvent(this_Obj, "click", _self.goToRepoort, { "date_start": hash["date_start"], "date_end": hash["date_end"]});

            var obj_ids = ",show_compare_" + type + ",per_" + type + ",compare_" + type + ",compare_per_" + type + ",";
            var tmpObj = util.getObjAry(this_Obj, obj_ids);
            _self.set_fz(tmpObj["per_" + type], hash[type]) ;   // 設定數字大小
            tmpObj["per_" + type].classList.remove("word_red");
            if (hash[type]<0) tmpObj["per_" + type].classList.add("word_red");

            var show_per = false;
            if(type == "profit" ){
                show_per = true;
            }
            // 若位數達到8位數, 小數點後的數字就省略不顯示 10000000
            var float_bit = (Math.abs(hash[type] * 1) >= 100000000)? 0:2 ;
            // 數字動畫
            _self.show_scroll_numbers(tmpObj["per_" + type], 0, hash[type] * 1, float_bit, show_per);

            dom.getElementById("show_compare_" + type).style.display = "none";
            if (show_last!= null){
                if (show_last["show_compare_" + type]){
                    tmpObj["show_compare_" + type].classList.remove("increase");
                    tmpObj["show_compare_" + type].classList.remove("decrease");
                    if (show_last["class_" + type] != "") tmpObj["show_compare_" + type].classList.add(show_last["class_" + type]);  //增加 increase, 減少 decrease
                    tmpObj["compare_" + type].dataset.inc = LS.get("overView_inc_" + nowOverView);
                    tmpObj["compare_" + type].dataset.dec = LS.get("overView_dec_" + nowOverView);

                    tmpObj["compare_" + type].innerHTML = show_last["compare_" + type]+"%" ;
                    tmpObj["compare_per_" + type].style.width = (show_last["compare_" + type] > 100) ? "100%" : show_last["compare_" + type] + "%";
                    tmpObj["show_compare_" + type].style.display = "";
                    dom.getElementById("show_compare_" + type).style.display = "";
                }
            }
        }
    }

    // 數字動畫
    _self.show_scroll_numbers = function (_obj, value_s, value_e, float_bit, show_per){
        // value_s 起始數值
        // value_e 最後顯示數值
        // float_bit 小數點保留位數
        // show_per 是否要多顯示 %
        var str_per = (show_per)? "%":"";
        var total = 100;    // 數值跳動次數
        _obj.innerHTML = value_s + str_per;
        var final = value_s;
        var random = value_e;
        var diff = random - final;
        // var plus = Math.floor(diff / total);
        var plus = Math.round((diff / total) * 100) / 100;
        var cnt = 0;
        var i = setInterval(function () {
            final = final + plus;
            if (cnt >= total) {
                // _obj.innerHTML = trans_thousand(random);
                _obj.innerHTML = util.mprintf(random * 1, 0, float_bit, false, true) + str_per;
                clearInterval(i);
                return;
            }
            // _obj.innerHTML = trans_thousand(final);
            _obj.innerHTML = util.mprintf(final * 1, 0, float_bit, false, true) + str_per;
            cnt++;
        }, 1);
    }

    // 數值超過12個數字後大小會遞減，每1數字 字體大小-3
    // 直到字體大小被減到18px 時不再遞減
    // fz36 ~ fz18
    _self.set_fz = function (_obj, value){
        var value_arr = new Array();
        value = value+"";
        value_arr = value.split(".");
        var value_bit = value_arr[0].replace("-","").length ;
        _obj.classList.remove("fz36", "fz33", "fz30", "fz27", "fz24", "fz21", "fz18");
        var show_size = "36";
        if (value_bit>=18){
            show_size = "18";
        } else if (value_bit >= 17) {
            show_size = "21";
        } else if (value_bit >= 16) {
            show_size = "24";
        } else if (value_bit >= 15) {
            show_size = "27";
        } else if (value_bit >= 14) {
            show_size = "30";
        } else if (value_bit >= 13) {
            show_size = "33";
        }
        _obj.classList.add("fz" + show_size);
    }

    _self.goToRepoort = function (e,date){
        var postHash = new Object();
        postHash["report_kind"] = "A";
        postHash["report_type"] = "set";
        postHash["result_type"] = "Y";
        postHash["date_start"] = date["date_start"];
        postHash["date_end"] = date["date_end"];
        postHash["gtype"] = "ALL";
        postHash["wtype"] = "ALL";
        postHash["view_layer"] = top.login_layer;

        var param = new Object();
        param["page"] = "report_" + top.login_layer;
        param["post"] = "view_layer=" + top.login_layer;
        param["postHash"] = postHash;
        param["extendsClass"] = "report_index";

        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    // _self.setSysMsgVisible = function (type, isShow) {
    //     dom.getElementById("div_" + type).style.display = isShow ? "none" : "";
    //     dom.getElementById("sysmsg_" + type).style.display = isShow ? "" : "none";
    // }
    // 要顯示 正常資料(div), 維護圖案(sysmsg), 載入進度條(loading)
    _self.setSysMsgVisible = function (type, isShowtype) {
        var arr_do_type = {
            "div": "none",
            "sysmsg": "none",
            "loading": "none"
        };
        var loading_obj = dom.getElementById("loading_" + type) ;
        if (loading_obj){
            loading_obj.classList.remove("--success");
        }
        // dom.getElementById("possess_" + nowPossess).classList.add("on");

        arr_do_type[isShowtype] = "";
        var show_time = 0;
        for (var key in arr_do_type) {
            show_time = 0;
            var do_obj = dom.getElementById(key+"_"+type) ;
            if (do_obj){
                // if (isShowtype !="loading"){
                if (isShowtype =="div"){
                    show_time = 200;
                    if (loading_obj) {
                        loading_obj.classList.add("--success");
                    }
                }
                setTimeout(function (do_obj, do_type) { do_obj.style.display = do_type; }, show_time, do_obj, arr_do_type[key]);
            }
        }
    }

    //==== Possess ====
    _self.getPossess = function () {
        _self.get_performace("possess", nowPossess, _self.getPossessComplete);
    }

    _self.getPossessComplete = function (json,isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return;
        }

        if (hash["status"] == "200") {
            if(!isStorage){
                Storage.set(top.login_layer+top.user_id+storage_uid+hash["data"]["code"]+hash["data"]["pdate"]+top.langx+top.ver,json,1/24);
            }
            var click_flag = true;
            //if(hash["data"]["pdate"] == "tp")click_flag=true;
            //else click_flag=false;

            var labelAry = _self.getLabel(hash["data"]["value"]);

            var showObj = dom.getElementById("show_possess");
            if (dashHash["possess"] != null) dashHash["possess"].destroy();
            dashHash["possess"] = new win.dashboard(win, dom);
            dashHash["possess"].setParentclass(_self);
            dashHash["possess"].init();
            dashHash["possess"].show("possess", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"],click_flag);
            _self.setSysMsgVisible("possess", "div");
            // 滑動圖表區塊時, 左右兩邊要有淡出的效果
            util.addEvent(dom.getElementById("div_possess"), "scroll", _self.roll, { "chk_obj": dom.getElementById("div_possess"), "do_obj": dom.getElementById("div_possess") });
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
                _self.setSysMsgVisible("possess", "sysmsg");
                // 開關關閉的話 將storage暫存的資料刪除
                Storage.vague_del(top.login_layer + top.user_id + storage_uid + "possess");
            } else {
                util.showErrorMsg(msg);
            }
        }
    }


    //==== Members ====
    _self.getMembers = function () {
        _self.get_performace("members", nowMembers, _self.getMembersComplete);
    }

    _self.getMembersComplete = function (json,isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return;
        }

        if (hash["status"] == "200") {
            if(!isStorage){
                Storage.set(top.login_layer+top.user_id+storage_uid+hash["data"]["code"]+hash["data"]["pdate"]+top.langx+top.ver,json,1/24);
            }
            var click_flag = true;
            //if(hash["data"]["pdate"] == "tp")click_flag=true;
            //else click_flag=false;

            var labelAry = _self.getLabel(hash["data"]["value"]);

            var showObj = dom.getElementById("show_members");
            if (dashHash["members"] != null) dashHash["members"].destroy();
            dashHash["members"] = new win.dashboard(win, dom);
            dashHash["members"].setParentclass(_self);
            dashHash["members"].init();
            dashHash["members"].show("members", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"],click_flag);
            _self.setSysMsgVisible("members", "div");
            // 滑動圖表區塊時, 左右兩邊要有淡出的效果
            util.addEvent(dom.getElementById("div_members"), "scroll", _self.roll, { "chk_obj": dom.getElementById("div_members"), "do_obj": dom.getElementById("div_members") });
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
                _self.setSysMsgVisible("members", "sysmsg");
                // 開關關閉的話 將storage暫存的資料刪除
                Storage.vague_del(top.login_layer + top.user_id + storage_uid + "members");
            } else {
                util.showErrorMsg(msg);
            }
        }
    }



    //==== TurnOver ====
    _self.getTurnOver = function () {
        _self.get_performace("turnover", nowTurnOver, _self.getTurnOverComplete);
    }


    _self.getTurnOverComplete = function (json,isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return;
        }

        if (hash["status"] == "200") {
            if(!isStorage){
                Storage.set(top.login_layer+top.user_id+storage_uid+hash["data"]["code"]+hash["data"]["pdate"]+top.langx+top.ver,json,1/24);
            }
            var click_flag = true;
            //if(hash["data"]["pdate"] == "tp")click_flag=true;
            //else click_flag=false;

            var labelAry = _self.getLabel(hash["data"]["value"]);

            var showObj = dom.getElementById("show_turnover");
            if (dashHash["turnover"] != null) dashHash["turnover"].destroy();
            dashHash["turnover"] = new win.dashboard(win, dom);
            dashHash["turnover"].setParentclass(_self);
            dashHash["turnover"].init();
            dashHash["turnover"].show("turnover", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"],click_flag);
            _self.setSysMsgVisible("turnover", "div");
            // 滑動圖表區塊時, 左右兩邊要有淡出的效果
            util.addEvent(dom.getElementById("div_turnover"), "scroll", _self.roll, { "chk_obj": dom.getElementById("div_turnover"), "do_obj": dom.getElementById("div_turnover") });
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
                _self.setSysMsgVisible("turnover", "sysmsg");
                // 開關關閉的話 將storage暫存的資料刪除
                Storage.vague_del(top.login_layer + top.user_id + storage_uid + "turnover");
            } else {
                util.showErrorMsg(msg);
            }
        }
    }

    //==== WinLoss ====
    _self.getWinLoss = function () {
        _self.get_performace("winloss", nowWinLoss, _self.getWinLossComplete);
    }

    _self.getWinLossComplete = function (json,isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return;
        }

        if (hash["status"] == "200") {
            if(!isStorage){
                Storage.set(top.login_layer+top.user_id+storage_uid+hash["data"]["code"]+hash["data"]["pdate"]+top.langx+top.ver,json,1/24);
            }
            var click_flag = true;
            //if(hash["data"]["pdate"] == "tp")click_flag=true;
            //else click_flag=false;

            var labelAry = _self.getLabel(hash["data"]["value"]);
            var showObj = dom.getElementById("show_winloss");
            if (dashHash["winloss"] != null) dashHash["winloss"].destroy();
            dashHash["winloss"] = new win.dashboard(win, dom);
            dashHash["winloss"].setParentclass(_self);
            dashHash["winloss"].init();
            dashHash["winloss"].show("winloss", showObj, labelAry, hash["data"]["value"],hash["data"]["date"], hash["data"]["org_date"],click_flag);
            _self.setSysMsgVisible("winloss", "div");
            // 滑動圖表區塊時, 左右兩邊要有淡出的效果
            util.addEvent(dom.getElementById("div_winloss"), "scroll", _self.roll, { "chk_obj": dom.getElementById("div_winloss"), "do_obj": dom.getElementById("div_winloss") });
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
                _self.setSysMsgVisible("winloss", "sysmsg");
                // 開關關閉的話 將storage暫存的資料刪除
                Storage.vague_del(top.login_layer + top.user_id + storage_uid + "winloss");
            } else {
                util.showErrorMsg(msg);
            }
        }
    }

    _self.getLabel = function (data) {
        var ret = new Array();
        var singleDay = getView().viewportwidth < 768;

        for (var i = 0; i < data.length; i++) {
            ret[i] = i + 1;
        }

        return ret;
    }

    // _self.chgPossess = function (e, param) {
    //     nowPossess = param.range;
    //     dom.getElementById("possess_tp").classList.remove("on");
    //     dom.getElementById("possess_" + nowPossess).classList.add("on");
    //     _self.getPossess();
    // }

    // _self.chgMembers = function (e, param) {
    //     nowMembers = param.range;
    //     dom.getElementById("members_tp").classList.remove("on");
    //     dom.getElementById("members_" + nowMembers).classList.add("on");
    //     _self.getMembers();
    // }

    // _self.chgTurnOver = function (e, param) {
    //     nowTurnOver = param.range;
    //     dom.getElementById("turnover_tp").classList.remove("on");
    //     dom.getElementById("turnover_" + nowTurnOver).classList.add("on");
    //     _self.getTurnOver();
    // }

    // _self.chgWinLoss = function (e, param) {
    //     nowWinLoss = param.range;
    //     dom.getElementById("winloss_tp").classList.remove("on");
    //     dom.getElementById("winloss_" + nowWinLoss).classList.add("on");
    //     _self.getWinLoss();
    // }



    _self.get_performace = function (code, _date, retFun) {
        // 檢查本地是否有資料了
        if(use_Storage_code.indexOf(","+code+",")!=-1){
            var cdata=Storage.get(top.login_layer+top.user_id+storage_uid+code+_date+top.langx+top.ver);
            if(cdata!=null){
                retFun(cdata,true);
                return;
            }
        }
        var param = "";
        param += top.param;
        param += "&p=get_performance";
        param += "&code=" + code;
        param += "&date=" + _date;
        param += "&langx=" + top.langx;

        if (code == "overview") {
            param += "&report_kind=A";
            param += "&result_type=Y";
            param += "&gtype=";
            param += "&wtype=";
            param += "&langx=" + top.langx;
            var overview_last = Storage.get(top.login_layer + top.user_id + storage_uid + "overview" + _date + top.langx + top.ver);
            search_last = (overview_last != null)? "N":"Y" ;
            param += "&search_last=" + search_last ;

        }

        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
        hr.setParentclass(_self);
        hr.addEventListener("onError", _self.perOnError);
        hr.addEventListener("LoadComplete", retFun);
        hr.loadURL(top.url, "POST", param);
    }

    _self.perOnError = function () {

    }

    _self.formatThousand = function (num) {
        num = num + "";
        var tmp = num.split(".");
        num = tmp[0];
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) {
            num = num.replace(re, "\$1,\$2");
        }
        if (tmp.length > 1) {
            num = num + "." + tmp[1];
        }
        return num;
    }


    _self.chgPage = function (e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
        //_self.hideDiv(e, param);
    }

    _self.chooseLayer = function () {
        parentClass.dispatchEvent("chooseLayer", {});
    }


    _self.hideDiv = function (e, param) {
        dom.getElementById("show_" + param.type).style.display = "none";
        //dom.getElementById("menu_"+param.type).className = "le_"+param.type;
    }

    // function writeLog(msg) {

    // var _url = util.getWebUrl() + "/lib/write_log.php";
    // var param = "";
    // param+="user="+top.username;
    // param+="&msg="+encodeURIComponent(msg);

    // var hr = new win.HttpRequest();
    // hr.addEventListener("LoadComplete", _self.emptyFun);
    // hr.loadURL(_url,"POST",param);

    // }

    // 尺寸拉到 1024 ,旋轉時 重整一下頁面
    _self.do_resize = function (e){
        var tmp_width = getView().viewportwidth ;
        var now_width_model = "320";
        var do_reload = false;

        if (tmp_width > 1024){
            now_width_model = "1024" ;
        }
        if (original_width_model!=""){
            if (original_width_model != now_width_model){
                do_reload = true;
            }
        }
        if (e.type == "orientationchange") {
            do_reload = true;
        }
        original_width_model = now_width_model;
        if (do_reload){
            parentClass.dispatchEvent("bodyGoToPage", { "target": "home", "page": "dashboard_main" });
        }
    }
}