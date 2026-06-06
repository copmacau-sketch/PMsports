function account_set(_win, _dom, _post) {
    var _self = this;
    var _mc = new Object();
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var eventHandler = new Object();
    var util = new win.Util(win,dom);
    var choice_gtype = "";
    var _top = new Object();
    var config_set;
    _top["setting_array"] = new Array("FT","BK","OP","FS");
    _top["FT_setting_array"] = new Array("R","RE","M","DT","RDT");
    _top["BK_setting_array"] = new Array("R","RE","M","DT");
    _top["OP_setting_array"] = new Array("R","RE","M","DT");
    _top["FS_setting_array"] = new Array("SP");
    
    _self.init = function () {
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
        _self.addEventListener("retryLoop", _self.retryLoop);
        _self.addEventListener("retryLastfail", _self.retryLastfail);
        _self.addEventListener("retryComplete", _self.retryComplete);

        _self.loadSetting("title_FT", { "gtype": "FT" });

        _mc["title_FT"] = dom.getElementById("title_FT");
        _mc["title_BK"] = dom.getElementById("title_BK");
        _mc["title_OP"] = dom.getElementById("title_OP");
        _mc["title_FS"] = dom.getElementById("title_FS");

        util.addEvent(_mc["title_FT"], "click", _self.searchFtEventHandler);
        util.addEvent(_mc["title_BK"], "click", _self.searchBkEventHandler);
        util.addEvent(_mc["title_OP"], "click", _self.searchOpEventHandler);
        util.addEvent(_mc["title_FS"], "click", _self.searchFsEventHandler);

        var _showtype = dom.getElementById("account_total");
        var _scroll = dom.getElementById("account_scroll");
        var _left = dom.getElementById("account_left");
        var _right = dom.getElementById("account_right");
        //第一次載入還沒有移動過的時候,要先判斷右邊滾動紐是否要出現
		if(_showtype.clientWidth > _scroll.clientWidth){
			util.addClass(_right,"on");
			util.addEvent(_right,"click",util.move,{"click":_right ,"div":_scroll, "direction":"right", "opposite":_left});
		}
		util.addEvent(_scroll,"scroll",_self.addScrollEvent,{"total":_showtype ,"scroll":_scroll , "left":_left , "right":_right});

        win.addEventListener("resize", _self.accountScroll);

        util.addEvent(dom.getElementById("toback"), "click", _self.toback);
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

    _self.chgPage = function (e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.retryLoop = function(param){
		parentClass.dispatchEvent("retryLoop", param);
    }
    
    _self.retryLastfail = function(){
		parentClass.dispatchEvent("retryLastfail");
    }
    
    _self.retryComplete = function(){
		parentClass.dispatchEvent("retryComplete");
	}


    _self.loadSetting = function (e, parObj) {
        choice_gtype = parObj["gtype"];
        var param = "";
		param += top.param;
		param += "&p=get_account_set";
		param += "&gtype=" + choice_gtype;

		hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"),null);
		hr.setParentclass(_self);
		hr.addEventListener("onError", _self.onError);
		hr.addEventListener("LoadComplete", _self.loadSettingComplete);
		hr.loadURL(top.m2_url, "POST", param);
    }

    _self.toback = function () {
        parentClass.dispatchEvent("backPage", {});
    }

    _self.loadSettingComplete = function (xml) {

        var errorMsg = util.showConnectMsg(xml);
		if(util.alertConnectMsg(errorMsg))	return;


		xmlnode = util.parseXml(xml);
        var xmdObj = new Object();
        
		xmdObj["code"] = xmlnode.Node(xmlnode.Root[0],"code");
		if(xmdObj["code"].innerHTML == "607"){
            var div_show = dom.getElementById("div_show");
            var choice_ary = _top[choice_gtype+"_setting_array"];
			for( var x = 0; x < _top["setting_array"].length; x++){
			xmdObj[ _top["setting_array"][x] ] = xmlnode.Node(xmlnode.Root[0], _top["setting_array"][x] ,false);
				var SampleTable = dom.getElementById("div_" + _top["setting_array"][x]);
				var tpl = new fastTemplate_a1();
				tpl.init(SampleTable);
				tpl.addBlock("tr");
				for( var a = 0; a < xmdObj[ _top["setting_array"][x] ].length ; a++ ){
					for( var b = 0; b < choice_ary.length; b++ ){
						var obj = xmlnode.Node(xmdObj[ _top["setting_array"][x] ][a], choice_ary[b] );
						var max = xmlnode.Node(obj,"max").innerHTML;
						var min = xmlnode.Node(obj,"min").innerHTML;
						tpl.replace("*" +  choice_ary[b] + "MAX*",util.showTxt(max));
						tpl.replace("*" +  choice_ary[b] + "MIN*",util.showTxt(min));
						var tmpDiv = tpl.fastPrint();
                        div_show.innerHTML = tmpDiv;
					}
				}
            }
        }
        parentClass.dispatchEvent("showLoading", { "isShow": false });
    }

    _self.searchFtEventHandler=function(mouseEvent){
        parentClass.dispatchEvent("showLoading", { "isShow": true });
        _self.restSelImportant("title_FT");
        _self.loadSetting("title_FT", { "gtype": "FT" });
    }

    _self.searchBkEventHandler=function(mouseEvent){
        parentClass.dispatchEvent("showLoading", { "isShow": true });
        _self.restSelImportant("title_BK");
        _self.loadSetting("title_BK", { "gtype": "BK" });
    }

    _self.searchOpEventHandler=function(mouseEvent){
        parentClass.dispatchEvent("showLoading", { "isShow": true });
        _self.restSelImportant("title_OP");
        _self.loadSetting("title_OP", { "gtype": "OP" });
    }

    _self.searchFsEventHandler=function(mouseEvent){
        parentClass.dispatchEvent("showLoading", { "isShow": true });
        _self.restSelImportant("title_FS");
        _self.loadSetting("title_FS", { "gtype": "FS" });
    }

    _self.restSelImportant = function (btn_name) {
		
        _mc["title_FT"].className="";
        _mc["title_BK"].className="";
        _mc["title_OP"].className="";
        _mc["title_FS"].className="";
        _mc[btn_name].className="active";		
    }

    _self.accountScroll = function(e){
        var _showtype = dom.getElementById("account_total");
        var _scroll = dom.getElementById("account_scroll");
        var _left = dom.getElementById("account_left");
        var _right = dom.getElementById("account_right");
        
		if(_showtype.clientWidth > _scroll.clientWidth){
			util.addClass(_right,"on");
			util.addEvent(_right,"click",util.move,{"click":_right ,"div":_scroll, "direction":"right", "opposite":_left});
		}else {
            util.removeClass(_right,"on");
			util.removeEvent(_right, "click");
        }
		util.addEvent(_scroll,"scroll",_self.addScrollEvent,{"total":_showtype ,"scroll":_scroll , "left":_left , "right":_right});
    }

    //滾動監聽加上class
	_self.addScrollEvent=function(e,param){
		var scroll = param.scroll.scrollLeft;
		var menuW = param.scroll.scrollWidth - param.scroll.clientWidth;

		if (scroll > 0) {
			util.addClass(param.left,"on");
		}  
		if (scroll == 0) {
			util.removeClass(param.left,"on");
		}
		if (scroll < menuW) {
			util.addClass(param.right,"on");
		}
		if (scroll >= menuW) {
			util.removeClass(param.right,"on");
		}
		if(param.total) util.initCheckScroll(param.total, param.scroll, param.left, param.right);
	}    
}