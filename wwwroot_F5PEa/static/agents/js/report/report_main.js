function report_main(_win, _dom) {
	var _self = this;
	var win = _win; 
	var dom = _dom;
	var parentClass;
	var classname = "report_main";
	var util;
	var LS;
	var LS_code;
	var cookie;
	var config_set;
	var fastTemplate_a1;
	var eventHandler = new Object;
	var par = new Object;
	var selObj = new Object;
	selObj["result_type"] = new Array("Y", "N", "D", "D4");
	selObj["date"] = new Array("yes", "to", "tm", "tw", "lw", "tp", "lp");
	var selectFun = new Object;
	var dateHash = new Object;
	var currencyHash = new Object;
	var boxAry = new Array("summary", "period", "exchange");
	var displayWtype = null;
	var inWtype = null;
	var sDate = null;
	var eDate = null;
	var game_ary = new Array("today", "yesterday");
	var _mc = new Object;
	var period_ary = new Array;
	var hr = null;
	var Storage;
	var use_Storage_code = ",turnover,winloss,top10,";
	var arr_Top10_types = {
		"win": [1, 2, 3],
		"loss": [1, 2, 3]
	};
	var set_Top10_types = {
		"win": 1,
		"loss": 1
	};
	var set_Top10_kind = "all";
	var storage_uid = top.uid;
	var dashHash = new Object;
	var arr_ChartData = {
		"turnover": {
			"status": false,
			"chartdata": new Object
		},
		"winloss": {
			"status": false,
			"chartdata": new Object
		}
	};
	var showWinLoss_mode = "mem";
	var chart_mode_arr = ["mem", "ag"];
	_self.init = function() {
		util.echo("report_main load complete");
		parentClass.dispatchEvent("chgLeftMenuColor", {
			"target": "report"
		});
		selObj["gtype"] = config_set.get("REPORT_GTYPE");
		dom.getElementById("body_show").classList.add("bgf0f0f0");
		var obj_ids = ",yes_Y,to_Y,tw_Y,lw_Y,to_N,";
		var tmp_obj = util.getObjAry(dom, obj_ids);
		for (var obj in tmp_obj) util.addEvent(tmp_obj[obj], "click", _self.quickBtnSearch, {
			"param": obj
		});
		obj_ids = ",div_quick_title,type_quick_scroll,div_type_title,type_title_scroll,div_summary_title,summary_title_scroll,";
		tmp_obj = util.getObjAry(dom, obj_ids);
		util.addEvent(tmp_obj["type_quick_scroll"], "scroll", _self.roll, {
			"chk_obj": tmp_obj["type_quick_scroll"],
			"do_obj": tmp_obj["div_quick_title"]
		});
		util.addEvent(tmp_obj["type_title_scroll"], "scroll", _self.roll, {
			"chk_obj": tmp_obj["type_title_scroll"],
			"do_obj": tmp_obj["div_type_title"]
		});
		util.addEvent(tmp_obj["summary_title_scroll"], "scroll", _self.roll, {
			"chk_obj": tmp_obj["summary_title_scroll"],
			"do_obj": tmp_obj["div_summary_title"]
		});
		obj_ids = ",today_finish,yesterday_finish,today_finish_600,yesterday_finish_600,date_class,year_class,";
		_mc = util.getObjAry(dom, obj_ids);
		_self.parseJSON();
		_self.initSelectFun();
		_self.initCalendar();
		_self.initBar();
		_self.initGameFinish();
		_self.initCurrency();
		
		_self.initPeriod();
		
		_self.setSelectEvent();
		_self.setBoxClick();
		_self.setPeriod();
		_self.addEventListener("choseDateEvent", _self.choseDateEvent);
		_self.addEventListener("dateErrorEvent", _self.dateErrorEvent);
		_self.addEventListener("enterDateEvent", _self.enterDateEvent);
		util.addEvent(dom.getElementById("clear_btn"), "click", _self.clearEvent);
		util.addEvent(dom.getElementById("search_btn"), "click", _self.searchEvent);
		util.addEvent(win, "resize", _self.orientation);
		parentClass.dispatchEvent("showLoading", {
			"showLoading": false
		});
		dom.getElementById("body_show").classList.add("body_pb");
		dom.getElementById("body_show").classList.add("--report");
		if (top.user_type == 1 || pri_type.indexOf("C") != -1) {
			var obj_ids = ",chart_mode_mem,chart_mode_ag,chart_mode_btn,";
			obj_ids += "div_reportChart,show_reportChart,sysmsg_reportChart,";
			obj_ids += "div_btn_reportChart,btn_reportChart,div_reportChart_table,div_reportChart_table_data,reportChart_table_xmp_contant,";
			var tmpObj = util.getObjAry(dom, obj_ids);
			_mc = util.mergeArray(_mc, tmpObj);
			_self.addEventListener("choseDateReportChart", _self.choseDateReportChart);
			_self.getChartData();
			for (var key in chart_mode_arr) {
				var this_type = chart_mode_arr[key];
				util.addEvent(_mc["chart_mode_" + this_type], "click", _self.chg_chart_mode, {
					"chg_type": this_type
				})
			}
		} else dom.getElementById("box_reportChart").style.display = "none";
		if (top.user_type == 1) {
			var obj_ids = ",div_top10_win,top10_win_show,top10_win_date,top10_win_data,top10_win_nodata,top10_win_sysmsg,";
			obj_ids += "div_top10_loss,top10_loss_show,top10_loss_date,top10_loss_data,top10_loss_nodata,top10_loss_sysmsg,";
			obj_ids += "xmp_contant,top10_win_date_btn,top10_loss_date_btn,";
			var tmpObj = util.getObjAry(dom, obj_ids);
			_mc = util.mergeArray(_mc, tmpObj);
			var obj_ids = ",top10_win_1,top10_win_2,top10_win_3,";
			obj_ids += "top10_loss_1,top10_loss_2,top10_loss_3,";
			var tmpObj = util.getObjAry(dom, obj_ids);
			_mc = util.mergeArray(_mc, tmpObj);
			for (var key in tmpObj) {
				var this_Obj = tmpObj[key];
				util.addEvent(this_Obj, "click", _self.setTop10status, this_Obj)
			}
			_self.getTop10Data()
		}
	};
	_self.setParentclass = function(_parentclass) {
		parentClass = _parentclass;
		util = parentClass.getThis("util");
		LS = parentClass.getThis("LS");
		LS_code = parentClass.getThis("LS_code");
		config_set = parentClass.getThis("config_set");
		cookie = parentClass.getThis("cookie");
		fastTemplate_a1 = parentClass.getThis("fastTemplate_a1");
		Storage = parentClass.getThis("Storage")
	};
	_self.getParentThis = function(varible) {
		return parentClass.getThis(varible)
	};
	_self.getThis = function(varible) {
		return eval(varible)
	};
	_self.parseJSON = function() {
		dateHash = JSON.parse(win.jsonDate);
		currencyHash = JSON.parse(win.jsonCurrency);
		periodHash = JSON.parse(win.jsonPeriod);
		util.echo(dateHash)
	};
	_self.initSelectFun = function() {
		selectFun["result_type"] = _self.chgSel;
		selectFun["date"] = _self.chgDate;
		selectFun["gtype"] = _self.chgSel
	};
	_self.orientation = function() {
		var orientation = win.Math.abs(win.orientation);
		if (orientation == 90 || orientation == 0) _self.initCalendar()
	};
	_self.initCalendar = function() {
		_self.setCalendar(dateHash, "start");
		_self.setCalendar(dateHash, "end")
	};
	_self.initBar = function() {
		par["result_type"] = "Y";
		par["gtype"] = "ALL";
		par["wtype"] = "ALL";
		par["date"] = "yes";
		if (!par["report_kind"]) par["report_kind"] = "A";
		for (var keys in par) {
			var k = par[keys];
			if (keys == "report_kind") if (par[keys] != "A") k = "D";
			else continue;
			if (keys != "wtype") _self.chgSel(null, {
				"rtype": keys,
				"type": k
			})
		}
	};
	_self.initGameFinish = function() {
		for (var i = 0; i < game_ary.length; i++) {
			var dat = game_ary[i];
			var obj = _mc[dat + "_finish"];
			var obj600 = _mc[dat + "_finish_600"];
			obj.innerHTML = dateHash[dat].replace(/\-/g, "/");
			obj600.innerHTML = dateHash[dat].replace(/\-/g, "/");
			obj.classList.add(dateHash[dat + "_finish_class"]);
			util.addEvent(obj600, "click", _self.chgDiv, {
				"type": "game",
				"target": obj600
			})
		}
		var gAry = config_set.get("GTYPEARY");
		gAry = gAry.concat(new Array("FS"));
		var data = dateHash["game_over_yn"];
		for (var j = 0; j < gAry.length; j++) {
			var gtype = gAry[j];
			dom.getElementById(gtype + "_yes_set").innerHTML = data[gtype]["yes"]["RESULT_Y"];
			dom.getElementById(gtype + "_yes_un").innerHTML = data[gtype]["yes"]["RESULT_N"];
			dom.getElementById(gtype + "_to_set").innerHTML = data[gtype]["to"]["RESULT_Y"];
			dom.getElementById(gtype + "_to_un").innerHTML = data[gtype]["to"]["RESULT_N"]
		}
	};
	_self.initCurrency = function() {
		if (currencyHash.length == 0) return;
		var div_model = dom.getElementById("exchange_box_model");
		var tpl = new fastTemplate_a1;
		tpl.init(div_model.cloneNode(true));
		var curAry = new Array("CODE_NAME", "CODE", "CODE_VALUE");
		for (var i = 0; i < currencyHash.length; i++) {
			var curData = currencyHash[i];
			tpl.addBlock("CURRENCY");
			for (var a = 0; a < curAry.length; a++) {
				var keys = curAry[a];
				tpl.replace(new RegExp("\\*" + keys + "\\*", "gi"), curData[keys])
			}
		}
		dom.getElementById("exchange_box").innerHTML = tpl.fastPrint()
	};
	
	_self.initPeriod = function(){
        var div_model = dom.getElementById("period_box_model").innerText;
        div_model = div_model.replace("*YEAR*",periodHash["y"]);
        div_model = div_model.replace("*LAST_YEAR*",periodHash["ly"]);
		
		div_model = div_model.replace("*YEAR*",periodHash["y"]);
        div_model = div_model.replace("*LAST_YEAR*",periodHash["ly"]);

        var html = "";
        var tr_model = dom.getElementById("period_box_tr_model").innerText;
        var data = periodHash["data"];
		
		var rq_model = dom.getElementById("period_box_rq_model").innerText;
		rq_model = rq_model.replace("*YEAR*",periodHash["y"]);
        rq_model = rq_model.replace("*LAST_YEAR*",periodHash["ly"]);
		html+= rq_model;
        for(var i=1;i<=13;i++){
            var str = tr_model;
            var year_id = periodHash["y"]+"_"+i;//
            var last_year_id = periodHash["ly"]+"_"+i;//
            str = str.replace("*ID*",i);
            str = str.replace("*YEAR_ID*",year_id);
            str = str.replace("*LAST_YEAR_ID*",last_year_id);
            str = str.replace("*SE*",data[i]["se"]);
            str = str.replace("*L_SE*",data[i]["l_se"]);
            html+= str;
        }

        div_model = div_model.replace("*CONTENT*",html);
        dom.getElementById("period_box").innerHTML = div_model;
    }
	_self.setPeriod = function() {
		var _name = "y" + dateHash["period_year"] + "_" + dateHash["period_num"];
		var _tmp_obj = dom.getElementById(_name);
		if (_tmp_obj) _tmp_obj.classList.add("word_green");
		period_ary = dom.getElementsByName("period_btn");
		for (var i = 0; i < period_ary.length; i++) {
			var obj = period_ary[i];
			util.addEvent(obj, "click", _self.chgDiv, {
				"type": "period",
				"target": obj
			})
		}
	};
	_self.setCalendar = function(dateHash, _name) {
		var sPar = new Object;
		sPar.div = dom.getElementById("div_date");
		sPar.input = dom.getElementById("input_" + _name);
		sPar.photo = dom.getElementById("date_" + _name);
		sPar.def_date = dateHash.yesterday;
		sPar.langx = top.langx;
		sPar.CalendarClass = win.ClassFankCal_ag;
		sPar.period_ls = dateHash.period_ls;
		sPar.WEB_TIME_ZONE = dateHash.WEB_TIME_ZONE;
		if (_name == "start") if (sDate == null) {
			sDate = new win.calendar_ag(win, dom);
			sDate.setParentclass(_self);
			sDate.init(sPar)
		} else sDate.restart();
		if (_name == "end") if (eDate == null) {
			eDate = new win.calendar_ag(win, dom);
			eDate.setParentclass(_self);
			eDate.init(sPar)
		} else eDate.restart()
	};
	_self.setBoxClick = function() {
		for (var i = 0; i < boxAry.length; i++) {
			var _name = boxAry[i];
			util.addEvent(dom.getElementById(_name + "_btn"), "click", _self.chgBoxDiv, {
				"type": _name
			})
		}
	};
	_self.chgBoxDiv = function(e, param) {
		for (var i = 0; i < boxAry.length; i++) {
			var _name = boxAry[i];
			dom.getElementById(_name + "_box").style.display = "none";
			dom.getElementById(_name + "_btn").classList.remove("--on")
		}
		dom.getElementById(param.type + "_box").style.display = "";
		dom.getElementById(param.type + "_btn").classList.add("--on")
	};
	_self.chgDiv = function(e, param) {
		if (param.target.classList.contains("--on")) return;
		else if (param.type == "game") {
			var today_game_id = "";
			var _len = game_ary.length;
			for (var i = 0; i < _len; i++) {
				_mc[game_ary[i] + "_finish_600"].classList.remove("--on");
				if (today_game_id == "") today_game_id = _mc[game_ary[i] + "_finish_600"].id
			}
			param.target.classList.add("--on");
			if (param.target.id == today_game_id) _mc["date_class"].classList.add("re_today");
			else _mc["date_class"].classList.remove("re_today")
		} else if (param.type == "period") {
			var first_year_id = "";
			var _len = period_ary.length;
			for (var i = 0; i < _len; i++) {
				period_ary[i].classList.remove("--on");
				if (first_year_id == "") first_year_id = period_ary[i].id
			}
			param.target.classList.add("--on");
			if (param.target.id == first_year_id) _mc["year_class"].classList.remove("last_year");
			else _mc["year_class"].classList.add("last_year")
		}
	};
	_self.goto600 = function(e, param) {
		parentClass.dispatchEvent("bodyGoToPage", {
			"page": "report_" + param.type,
			"pageName": param.type
		})
	};
	_self.setSelectEvent = function() {
		for (var rtype in selObj) {
			var rDom_600 = dom.getElementById(rtype + "_div_600");
			util.addEvent(rDom_600, "change", _self.selChgEvent, {
				"rtype": rtype
			});
			var ary = selObj[rtype];
			var rDom = dom.getElementById(rtype + "_div");
			var rSel = dom.getElementById(rtype + "_sel");
			util.setInfEvent(rDom, {
				"_focus": rSel,
				"_setView": rDom,
				"_viewClass": "--on"
			});
			for (var i = 0; i < ary.length; i++) {
				var type = ary[i];
				var tmp_obj = dom.getElementById(rtype + "_" + type);
				util.addEvent(tmp_obj, "click", selectFun[rtype], {
					"rtype": rtype,
					"type": type
				})
			}
		}
	};
	_self.showDiv = function(e, param) {
		var obj = dom.getElementById(param.rtype + "_div");
		if (obj.classList.contains("active")) obj.classList.remove("active");
		else {
			obj.classList.add("active");
			obj.focus()
		}
	};
	_self.selChgEvent = function(e, param) {
		param.type = e.target.value;
		if (param.rtype == "date") _self.chgDate(e, param);
		else _self.chgSel(e, param)
	};
	_self.chgSel = function(e, param) {
		var rtype = param.rtype;
		var type = param.type;
		par[rtype] = type;
		dom.getElementById(rtype + "_now").innerHTML = dom.getElementById(rtype + "_" + type).innerHTML;
		var sel_Now = dom.getElementById(rtype + "_sel").getElementsByTagName("li");
		var sel_obj = rtype + "_" + type;
		for (var i = 0; i < sel_Now.length; i++) sel_Now[i].classList.remove("--on");
		dom.getElementById(sel_obj).classList.add("--on");
		try {
			dom.getElementById(rtype + "_div_600").value = type
		} catch(e) {
			util.err("[chgSel]" + rtype + "_div_600" + type, e)
		}
	};
	_self.chgDate = function(e, param) {
		util.echo("[" + classname + "][chgDate]" + param.type);
		var date_s = "";
		var date_e = "";
		switch (param.type) {
		case "yes":
			date_s = dateHash["yesterday"];
			date_e = dateHash["yesterday"];
			break;
		case "to":
			date_s = dateHash["today"];
			date_e = dateHash["today"];
			break;
		case "tm":
			date_s = dateHash["tomorrow"];
			date_e = dateHash["tomorrow"];
			break;
		case "tw":
			date_s = dateHash["this_week_s"];
			date_e = dateHash["this_week_e"];
			break;
		case "lw":
			date_s = dateHash["last_week_s"];
			date_e = dateHash["last_week_e"];
			break;
		case "tp":
			date_s = dateHash["period_s"];
			date_e = dateHash["period_e"];
			break;
		case "lp":
			date_s = dateHash["period_ls"];
			date_e = dateHash["period_le"];
			break
		}
		date_s = date_s.replace(/ /g, "");
		date_s = date_s.replace(/\-/g, "/");
		date_e = date_e.replace(/ /g, "");
		date_e = date_e.replace(/\-/g, "/");
		util.echo(date_s);
		util.echo(date_e);
		dom.getElementById("input_start").value = date_s;
		dom.getElementById("input_end").value = date_e;
		_self.chgSel(e, param)
	};
	_self.chg_date = function(fix_type, shift, today, Obj) {
		var y_num = m_num = d_num = 0;
		if (fix_type == "y") y_num = shift;
		if (fix_type == "m") m_num = shift;
		if (fix_type == "d") d_num = shift;
		var aDate = today.split("-");
		var newDate = new Date(parseInt(aDate[0], 10) + y_num, parseInt(aDate[1], 10) - 1 + m_num, parseInt(aDate[2], 10) + d_num);
		if (Obj == 1) return newDate;
		else {
			var yyyy = newDate.getFullYear();
			var mm = newDate.getMonth() + 1;
			var dd = newDate.getDate();
			if (mm * 1 < 10) mm = "0" + mm;
			if (dd * 1 < 10) dd = "0" + dd;
			return yyyy + "-" + mm + "-" + dd
		}
	};
	_self.getWeek = function(d, w, dateHash) {
		var date_obj = _self.chg_date("", "", dateHash["today"], 1);
		var wday = date_obj.getDay();
		if (wday == "0") wday = 7;
		return _self.getNowDateTime("yyyy-mm-dd", "d", 0 - wday + d + w * 7, dateHash)
	};
	_self.getNowDateTime = function(fomat, field, num, dateHash) {
		var yyyy = mm = dd = H = i = s = 0;
		var gDate = new Date;
		yyyy = gDate.getUTCFullYear();
		mm = gDate.getUTCMonth() + 1;
		dd = gDate.getUTCDate();
		H = gDate.getUTCHours();
		i = gDate.getUTCMinutes();
		s = gDate.getUTCSeconds();
		gDate = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10), parseInt(H, 10) + parseInt(dateHash["WEB_TIME_ZONE"], 10), parseInt(i, 10), parseInt(s, 10), 0);
		yyyy = gDate.getFullYear();
		mm = gDate.getMonth() + 1;
		dd = gDate.getDate();
		H = gDate.getHours();
		i = gDate.getMinutes();
		s = gDate.getSeconds();
		if (field == "y" || field == "m" || field == "d") {
			gDate = _self.chg_date(field, num, yyyy + "-" + mm + "-" + dd, 1);
			yyyy = gDate.getFullYear();
			mm = gDate.getMonth() + 1;
			dd = gDate.getDate()
		}
		if (mm * 1 < 10) mm = "0" + mm;
		if (dd * 1 < 10) dd = "0" + dd;
		if (H * 1 < 10) H = "0" + H;
		if (i * 1 < 10) i = "0" + i;
		if (s * 1 < 10) s = "0" + s;
		if (fomat == "yyyy-mm-dd") return yyyy + "-" + mm + "-" + dd;
		if (fomat == "H:i:s") return H + ":" + i + ":" + s;
		if (fomat == "yyyy-mm-dd H:i:s") return yyyy + "-" + mm + "-" + dd + " " + H + ":" + i + ":" + s;
		return yyyy + "-" + mm + "-" + dd + " " + H + ":" + i + ":" + s
	};
	_self.choseDateEvent = function(param) {};
	_self.dateErrorEvent = function(param) {};
	_self.enterDateEvent = function(param) {};
	_self.clearEvent = function() {
		_self.initCalendar();
		_self.initBar();
		_self.chgDate(null, {
			"rtype": "date",
			"type": dom.getElementById("date_div_600").value
		})
	};
	_self.searchEvent = function() {
		util.checkReportTeach(cookie, parentClass);
		if (cookie.get("isclick")) cookie.del("isclick");
		_self.checkReport(_self.gotoReport);
		if (cookie.get("moreTip20190130")) cookie.del("moreTip20190130")
	};
	_self.checkReport = function(retFun) {
		if (par["result_type"] == "D" || par["result_type"] == "D4") {
			par["report_kind"] = par["result_type"];
			par["result_type"] = "Y"
		}
		var str = "";
		str += top.param;
		str += "&p=check_report";
		var d_s = dom.getElementById("input_start").value;
		var d_e = dom.getElementById("input_end").value;
		d_s = d_s.replace(/ /g, "");
		d_s = d_s.replace(/\//g, "-");
		d_e = d_e.replace(/ /g, "");
		d_e = d_e.replace(/\//g, "-");
		str += "&date_start=" + d_s;
		str += "&date_end=" + d_e;
		str += "&result_type=" + par["result_type"];
		str += "&report_kind=" + par["report_kind"];
		hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
		hr.setParentclass(_self);
		hr.addEventListener("onError",
		function() {});
		hr.addEventListener("LoadComplete",
		function(json) {
			var hash;
			try {
				hash = JSON.parse(json);
				if (util.chkErrorMsg(hash, LS_code)) return
			} catch(e) {
				util.err("[" + classname + "]", e);
				util.showErrorMsg("data error");
				return
			}
			if (hash["status"] == "200") retFun();
			else util.showErrorMsg(hash["msg"])
		});
		hr.loadURL(top.url, "POST", str)
	};
	_self.gotoReport = function() {
		var d_s = dom.getElementById("input_start").value;
		var d_e = dom.getElementById("input_end").value;
		d_s = d_s.replace(/ /g, "");
		d_s = d_s.replace(/\//g, "-");
		d_e = d_e.replace(/ /g, "");
		d_e = d_e.replace(/\//g, "-");
		var postHash = new Object;
		postHash["report_kind"] = par["report_kind"];
		postHash["report_type"] = "set";
		postHash["result_type"] = par["result_type"];
		if (postHash["report_kind"] == "D" || postHash["report_kind"] == "D4") postHash["result_type"] = "N";
		postHash["date"] = par["date"];
		postHash["date_start"] = d_s;
		postHash["date_end"] = d_e;
		postHash["gtype"] = par["gtype"];
		postHash["wtype"] = par["wtype"];
		postHash["view_layer"] = top.login_layer;
		postHash["WEB_TIME_ZONE"] = dateHash.WEB_TIME_ZONE;
		var param = new Object;
		param["page"] = "report_" + top.login_layer;
		param["post"] = "view_layer=" + top.login_layer;
		param["postHash"] = postHash;
		param["extendsClass"] = "report_index";
		parentClass.dispatchEvent("bodyGoToPage", param)
	};
	_self.addEventListener = function(eventname, eventFunction) {
		eventHandler[eventname] = eventFunction
	};
	_self.dispatchEvent = function(eventname, param) {
		if (eventHandler[eventname]) eventHandler[eventname](param)
	};
	_self.setSearchSel = function(icon, param) {
		util.addEvent(icon, "click", _self.setSCEvent, {
			"icon": icon,
			"param": param
		})
	};
	_self.setSCEvent = function(e, _par) {
		var icon = _par.icon;
		var param = _par.param;
		var all = param._focus.getElementsByTagName("*");
		for (var i = 0,
		max = all.length; i < max; i++) if (all[i] == e.target) return false;
		if (e.target == param._focus) return false;
		if (param._setView.classList.contains(param._viewClass)) {
			param._setView.classList.remove(param._viewClass);
			util.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
			util.removeEvent(dom.getElementsByTagName("div")[0], "touchstart")
		} else {
			param._setView.classList.add(param._viewClass);
			util.addEvent(dom.getElementsByTagName("div")[0], "mousedown", _self.InfBlurEvent, _par);
			util.addEvent(dom.getElementsByTagName("div")[0], "touchstart", _self.InfBlurEvent, _par)
		}
	};
	_self.InfBlurEvent = function(e, _par) {
		var icon = _par.icon;
		var param = _par.param;
		var mouseIN = false;
		var all = param._focus.getElementsByTagName("*");
		for (var i = 0,
		max = all.length; i < max; i++) if (all[i] == e.target) mouseIN = true;
		if (param._focus == e.target) mouseIN = true;
		if (!mouseIN) {
			var all = icon.getElementsByTagName("*");
			for (var i = 0,
			max = all.length; i < max; i++) if (all[i] == e.target) return false;
			if (e.target == icon) return false;
			_self.closeInfElmt(param)
		} else if (param.info_mode && mouseIN) _self.closeInfElmt(param)
	};
	_self.closeInfElmt = function(param) {
		dom.activeElement.blur();
		if (param._setView.classList.contains(param._viewClass)) param._setView.classList.remove(param._viewClass);
		util.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
		util.removeEvent(dom.getElementsByTagName("div")[0], "touchstart")
	};
	_self.cleanTextEvent = function(evt, param) {
		param.dom.value = "";
		param.dom.focus();
		_self.recoveyDispalyWtype()
	};
	_self.serchSelEvent = function(evt, param) {
		var DOM = evt.target;
		if (DOM.tagName == "LI") {
			par["wtype"] = DOM.id.split("_")[1];
			dom.getElementById("wtype_div").classList.remove(param.className);
			_self.recoveyDispalyWtype();
			dom.getElementById("wtype_now").innerHTML = DOM.innerHTML;
			dom.getElementById("searchWtype").value = ""
		}
	};
	_self.changeSearchText = function(evt, param) {
		var DOM = evt.target;
		var searchStr = DOM.value;
		if (searchStr == "") _self.recoveyDispalyWtype();
		else {
			var allULWtype = document.getElementById("allULWtype");
			var wtypeLIId = allULWtype.getElementsByTagName("LI");
			for (var i = 0,
			len = wtypeLIId.length; i < len; i++) {
				var targerDOMid = wtypeLIId[i].textContent.toLowerCase();
				var vanishLI = "none";
				if (targerDOMid.indexOf(searchStr.toLowerCase()) != -1) vanishLI = "";
				wtypeLIId[i].style.display = vanishLI
			}
		}
	};
	_self.recoveyDispalyWtype = function() {
		var allULWtype = document.getElementById("allULWtype");
		var wtypeLIId = allULWtype.getElementsByTagName("LI");
		for (var i = 0,
		len = wtypeLIId.length; i < len; i++) wtypeLIId[i].style.display = ""
	};
	_self.quickBtnSearch = function(e, param) {
		var btn_value = param.param.split("_");
		_self.chgDate(null, {
			"rtype": "date",
			"type": btn_value[0]
		});
		_self.chgSel(null, {
			"rtype": "result_type",
			"type": btn_value[1]
		});
		_self.searchEvent()
	};
	_self.roll = function(e, param) {
		if (param.chk_obj.scrollLeft == 0) param.do_obj.classList.remove("--scroll");
		else {
			param.do_obj.classList.add("--scroll");
			if (param.chk_obj.scrollLeft + param.chk_obj.offsetWidth == param.chk_obj.scrollWidth) param.do_obj.classList.add("--right_no_scroll");
			else param.do_obj.classList.remove("--right_no_scroll")
		}
	};
	_self.getTop10Data = function() {
		var code = "top10";
		if (use_Storage_code.indexOf("," + code + ",") != -1) {
			var cdata = Storage.get(top.login_layer + top.user_id + storage_uid + code + top.langx + top.ver);
			if (cdata != null) {
				_self.connectComplete(cdata, true);
				return
			}
		}
		var urlParams = "";
		urlParams += "uid=" + top.uid;
		urlParams += "&login_layer=" + top.login_layer;
		urlParams += "&layer_id=" + top.layer_id;
		urlParams += "&langx=" + top.langx;
		urlParams = "p=get_Top10Data&ver=" + top.ver + "&" + urlParams;
		var getHTML = new HttpRequest;
		getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete", _self.connectComplete);
		getHTML.loadURL(top.url, "POST", urlParams)
	};
	_self.onError = function() {
		util.echo("onError")
	};
	_self.connectComplete = function(data, isStorage) {
		try {
			var arr_data = JSON.parse(data);
			if (arr_data["status"] == "200") {
				if (!isStorage) Storage.set(top.login_layer + top.user_id + storage_uid + "top10" + top.langx + top.ver, data, 1 / 24);
				if (set_Top10_kind == "all") {
					_self.parseData("win", arr_data);
					_self.parseData("loss", arr_data);
					_mc["div_top10_win"].style.display = "";
					_mc["div_top10_loss"].style.display = ""
				} else _self.parseData(set_Top10_kind, arr_data)
			} else {
				var msg = arr_data["msg"] ? arr_data["msg"] : LS_code.get(arr_data["code"]);
				if (arr_data["code"] == "term_all") {
					Storage.vague_del(top.login_layer + top.user_id + storage_uid + "top10" + top.langx + top.ver);
					_mc["div_top10_win"].style.display = "";
					_mc["div_top10_loss"].style.display = "";
					_mc["top10_win_show"].style.display = "none";
					_mc["top10_win_nodata"].style.display = "none";
					_mc["top10_win_sysmsg"].style.display = "";
					_mc["top10_loss_show"].style.display = "none";
					_mc["top10_loss_nodata"].style.display = "none";
					_mc["top10_loss_sysmsg"].style.display = "";
					_mc["top10_win_date_btn"].style.display = "none";
					_mc["top10_loss_date_btn"].style.display = "none"
				} else if (arr_data["code"] == "report_top10") {
					Storage.vague_del(top.login_layer + top.user_id + storage_uid + "top10" + top.langx + top.ver);
					_mc["div_top10_win"].style.display = "none";
					_mc["div_top10_loss"].style.display = "none"
				} else util.showErrorMsg(msg)
			}
		} catch(e) {
			util.echo(e)
		}
	};
	_self.parseData = function(top10_kind, data) {
		var this_type = set_Top10_types[top10_kind];
		var arr_this_types = arr_Top10_types[top10_kind];
		for (var key in arr_this_types) {
			var list_obj = _mc["top10_" + top10_kind + "_" + arr_this_types[key]];
			if (list_obj.classList.contains("--on")) list_obj.classList.remove("--on");
			if (arr_this_types[key] == this_type) list_obj.classList.add("--on")
		}
		var div_show = _mc["top10_" + top10_kind + "_data"];
		div_show.innerHTML = "";
		var this_status = data["outData"]["types_" + this_type]["status"];
		var this_date = data["outData"]["types_" + this_type]["date"];
		if (this_status) {
			var this_data = data["outData"]["types_" + this_type]["data"][top10_kind];
			if (this_data.length > 0) {
				var show_date = "";
				if (this_type != "1") {
					var tmp_date = this_date.split("|");
					var date_start = tmp_date[0];
					var date_end = tmp_date[1];
					show_date = date_start.replace(/\-/g, "/") + " - " + date_end.replace(/\-/g, "/")
				} else {
					var date_start = this_date;
					var date_end = this_date;
					show_date = this_date.replace(/\-/g, "/")
				}
				_mc["top10_" + top10_kind + "_date"].innerHTML = show_date;
				var bodyTemp = "";
				var xmp_contant = _mc["xmp_contant"].innerHTML;
				var get_div_ids = "";
				for (var key in this_data) {
					var contanttmp = xmp_contant;
					var obj = this_data[key];
					get_div_ids += ",div_" + obj["mid"];
					contanttmp = contanttmp.replace(/\*ID\*/g, util.showTxt(obj["mid"]));
					contanttmp = contanttmp.replace(/\*USERNAME\*/g, util.showTxt(obj["username"]));
					contanttmp = contanttmp.replace(/\*ALIAS\*/g, util.showTxt(obj["alias"]));
					contanttmp = contanttmp.replace(/\*AMOUNT\*/g, util.showTxt(obj["amount"]));
					contanttmp = contanttmp.replace(/\*GOLD_D\*/g, util.mprintf(util.showTxt(obj["gold_d"]) * 1, 0, 1, false, true));
					var num_class = obj["val"] * 1 >= 0 ? "": "word_red";
					contanttmp = contanttmp.replace(/\*NUM_COLOR\*/g, num_class);
					contanttmp = contanttmp.replace(/\*VALUE\*/g, util.mprintf(util.showTxt(obj["val"]) * 1, 0, 1, false, true));
					bodyTemp += contanttmp
				}
				div_show.innerHTML = bodyTemp;
				var tmpObj = util.getObjAry(div_show, get_div_ids + ",");
				for (var key in this_data) {
					var obj = this_data[key];
					var div = tmpObj["div_" + obj["mid"]];
					var obj_ids = ",btn_user,";
					var _ary = util.getObjAry(div, obj_ids);
					util.addEvent(_ary["btn_user"], "click", _self.addUserClick, {
						"acc_id": obj["mid"],
						"pay_type": obj["pay_type"],
						"date_start": date_start,
						"date_end": date_end
					})
				}
				var div = dom.getElementById("div_" + obj["id"]);
				var obj_ids = ",span_credit,span_enable,btn_edit,btn_unlock,btn_user,change_credits_box,change_status_box,dropdown_id,credit_arrow,";
				var _ary = util.getObjAry(div, obj_ids);
				_mc["top10_" + top10_kind + "_show"].style.display = "";
				_mc["top10_" + top10_kind + "_date_btn"].style.display = "";
				_mc["top10_" + top10_kind + "_nodata"].style.display = "none";
				_mc["top10_" + top10_kind + "_sysmsg"].style.display = "none"
			} else {
				_mc["top10_" + top10_kind + "_show"].style.display = "none";
				_mc["top10_" + top10_kind + "_date_btn"].style.display = "";
				_mc["top10_" + top10_kind + "_nodata"].style.display = "";
				_mc["top10_" + top10_kind + "_sysmsg"].style.display = "none"
			}
		} else {
			_mc["top10_" + top10_kind + "_show"].style.display = "none";
			_mc["top10_" + top10_kind + "_date_btn"].style.display = "";
			_mc["top10_" + top10_kind + "_nodata"].style.display = "";
			_mc["top10_" + top10_kind + "_sysmsg"].style.display = "none"
		}
	};
	_self.addUserClick = function(obj, param) {
		parentClass.dispatchEvent("showLoading", {
			"showLoading": true
		});
		var view_layer = "list_bet";
		var pHash = new Object;
		pHash["report_kind"] = "A";
		pHash["report_type"] = "set";
		pHash["result_type"] = "Y";
		pHash["date_start"] = param["date_start"];
		pHash["date_end"] = param["date_end"];
		pHash["date"] = "yes";
		pHash["gtype"] = "ALL";
		pHash["wtype"] = "ALL";
		pHash["view_layer"] = view_layer;
		var paramPage = new Object;
		paramPage["page"] = "report_" + view_layer;
		paramPage["postHash"] = pHash;
		paramPage["post"] = "view_layer=" + view_layer;
		paramPage["extendsClass"] = "report_index";
		_self.checkReportTop10(_self.getSearchData, {
			"paramPage": paramPage,
			"param": param
		})
	};
	_self.checkReportTop10 = function(retFun, param) {
		var str = "";
		str += top.param;
		str += "&p=check_report";
		str += "&date_start=" + param["param"]["date_start"];
		str += "&date_end=" + param["param"]["date_end"];
		str += "&result_type=Y";
		str += "&report_kind=A";
		hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
		hr.setParentclass(_self);
		hr.addEventListener("onError",
		function() {});
		hr.addEventListener("LoadComplete",
		function(json) {
			var hash;
			try {
				hash = JSON.parse(json);
				if (util.chkErrorMsg(hash, LS_code)) return
			} catch(e) {
				util.err("[" + classname + "]", e);
				util.showErrorMsg("data error");
				return
			}
			if (hash["status"] == "200") retFun(param);
			else {
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "top10" + top.langx + top.ver);
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "turnover");
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "winloss");
				util.showErrorMsg(hash["msg"]);
				_self.getTop10Data();
				_self.getChartData()
			}
		});
		hr.loadURL(top.url, "POST", str)
	};
	_self.getSearchData = function(param) {
		var now_id = param["param"]["acc_id"];
		var now_pay_type = param["param"]["pay_type"];
		var urlParams = "";
		urlParams += "uid=" + top.uid;
		urlParams += "&login_layer=" + top.login_layer;
		urlParams += "&pagefrom=report_main";
		urlParams = "p=get_upper_structure&ver=" + top.ver + "&" + urlParams + "&now_layer=mem&now_id=" + now_id + "&now_pay_type=" + now_pay_type;
		var getHTML = new HttpRequest;
		getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete",
		function(data) {
			var arr_data = JSON.parse(data);
			var upper_structure = arr_data["data"];
			var report_set = arr_data["report_set"];
			var tmpurl = "";
			for (var key in upper_structure) tmpurl += upper_structure[key]["report_path"] + "&";
			for (var key in report_set) tmpurl += key + "=" + report_set[key] + "&";
			var paramPage = param["paramPage"];
			paramPage["postHash"]["url_param"] = tmpurl.substr(0, tmpurl.length - 1);
			_self.chgPage(paramPage)
		});
		getHTML.loadURL(top.url, "POST", urlParams)
	};
	_self.chgPage = function(param) {
		parentClass.dispatchEvent("bodyGoToPage", param)
	};
	_self.setTop10status = function(e, _obj) {
		if (!_obj.classList.contains("--on")) {
			var obj_id = _obj.id;
			var tmp = obj_id.split("_");
			set_Top10_kind = tmp[1];
			set_Top10_types[set_Top10_kind] = tmp[2];
			_self.getTop10Data()
		}
	};
	_self.getChartData = function() {
		_self.get_performace("turnover", "tp", _self.getTurnOverComplete);
		_self.get_performace("winloss", "tp", _self.getWinLossComplete)
	};
	_self.get_performace = function(code, _date, retFun) {
		if (use_Storage_code.indexOf("," + code + ",") != -1) {
			var cdata = Storage.get(top.login_layer + top.user_id + storage_uid + code + _date + top.langx + top.ver);
			if (cdata != null) {
				retFun(cdata, true);
				return
			}
		}
		var param = "";
		param += top.param;
		param += "&p=get_performance";
		param += "&code=" + code;
		param += "&date=" + _date;
		param += "&langx=" + top.langx;
		hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
		hr.setParentclass(_self);
		hr.addEventListener("onError", _self.perOnError);
		hr.addEventListener("LoadComplete", retFun);
		hr.loadURL(top.url, "POST", param)
	};
	_self.perOnError = function() {};
	_self.getTurnOverComplete = function(json, isStorage) {
		var hash;
		try {
			hash = JSON.parse(json);
			if (util.chkErrorMsg(hash, LS_code)) return
		} catch(e) {
			util.err("[" + classname + "]", e);
			util.showErrorMsg("data error");
			return
		}
		if (hash["status"] == "200") {
			if (!isStorage) Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
			arr_ChartData[hash["data"]["code"]]["status"] = true;
			arr_ChartData[hash["data"]["code"]]["chartdata"] = hash
		} else {
			var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
			if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "turnover");
				arr_ChartData["turnover"]["status"] = true;
				arr_ChartData["turnover"]["chartdata"] = "nodata"
			} else util.showErrorMsg(msg)
		}
		_self.checkChartData()
	};
	_self.getWinLossComplete = function(json, isStorage) {
		var hash;
		try {
			hash = JSON.parse(json);
			if (util.chkErrorMsg(hash, LS_code)) return
		} catch(e) {
			util.err("[" + classname + "]", e);
			util.showErrorMsg("data error");
			return
		}
		if (hash["status"] == "200") {
			if (!isStorage) Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
			arr_ChartData[hash["data"]["code"]]["status"] = true;
			arr_ChartData[hash["data"]["code"]]["chartdata"] = hash
		} else {
			var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
			if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "winloss");
				arr_ChartData["winloss"]["status"] = true;
				arr_ChartData["winloss"]["chartdata"] = "nodata"
			} else util.showErrorMsg(msg)
		}
		_self.checkChartData()
	};
	_self.checkChartData = function() {
		var check_all_data = true;
		for (var key in arr_ChartData) if (!arr_ChartData[key]["status"]) {
			check_all_data = false;
			break
		}
		if (check_all_data) _self.parseChart()
	};
	_self.parseChart = function() {
		var data_check = true;
		for (var key in arr_ChartData) if (arr_ChartData[key]["chartdata"] == "nodata") {
			data_check = false;
			break
		}
		if (data_check) {
			var the_same_date = arr_ChartData["turnover"]["chartdata"]["data"]["date"];
			var the_same_org_date = arr_ChartData["turnover"]["chartdata"]["data"]["org_date"];
			var arr_value = new Array;
			arr_value[0] = arr_ChartData["turnover"]["chartdata"]["data"]["value"];
			arr_value[1] = _self.getProfitMargin(arr_ChartData["turnover"]["chartdata"]["data"]["value"], arr_ChartData["winloss"]["chartdata"]["data"]["value"]);
			var click_flag = true;
			var labelAry = _self.getLabel(arr_value[0]);
			var showObj = _mc["show_reportChart"];
			if (dashHash["reportChart"] != null) dashHash["reportChart"].destroy();
			dashHash["reportChart"] = new win.dashboard(win, dom);
			dashHash["reportChart"].setParentclass(_self);
			dashHash["reportChart"].init();
			dashHash["reportChart"].showReportChart("reportChart", showObj, labelAry, arr_value, the_same_date, the_same_org_date, click_flag, showWinLoss_mode);
			_self.setSysMsgVisible("reportChart", "div");
			util.addEvent(_mc["div_reportChart"], "scroll", _self.reportChartroll, {
				"chk_obj": _mc["div_reportChart"],
				"do_obj": _mc["div_reportChart"]
			});
			if (showWinLoss_mode == "mem") _self.parseCharttable(arr_value);
			_mc["chart_mode_btn"].style.display = ""
		} else {
			_self.setSysMsgVisible("reportChart", "sysmsg");
			_mc["div_btn_reportChart"].classList.add("disable");
			_mc["chart_mode_btn"].style.display = "none"
		}
		dom.getElementById("box_reportChart").style.display = ""
	};
	_self.parseCharttable = function(arr_value) {
		var check_data = false;
		var div_show = _mc["div_reportChart_table_data"];
		div_show.innerHTML = "";
		var bodyTemp = "";
		var xmp_contant = _mc["reportChart_table_xmp_contant"].innerHTML;
		var data_num = arr_value[0].length;
		for (var i = 0; i < data_num; i++) {
			var contanttmp = xmp_contant;
			var this_days = i + 1;
			var this_turnover = arr_value[0][i];
			var profitmargin = arr_value[1][i];
			if (this_turnover == "" && profitmargin == "") continue;
			if (this_turnover != "" && profitmargin.toString() != "") check_data = true;
			contanttmp = contanttmp.replace(/\*DAY\*/g, util.showTxt(this_days));
			contanttmp = contanttmp.replace(/\*TURNOVER\*/g, util.mprintf(util.showTxt(this_turnover) * 1, 0, 1, true, false));
			var num_class = profitmargin * 1 >= 0 ? "": "word_red";
			contanttmp = contanttmp.replace(/\*PROFITMARGIN\*/g, util.mprintf(util.showTxt(profitmargin) * 1, 0, 2, false, true));
			contanttmp = contanttmp.replace(/\*NUM_COLOR\*/g, num_class);
			bodyTemp += contanttmp
		}
		div_show.innerHTML = bodyTemp;
		if (check_data) {
			util.addEvent(_mc["btn_reportChart"], "click", _self.show_reportChart_table);
			_mc["div_btn_reportChart"].classList.remove("disable")
		} else {
			util.removeEvent(_mc["btn_reportChart"], "click");
			_mc["div_btn_reportChart"].classList.add("disable")
		}
	};
	_self.show_reportChart_table = function(e, param) {
		var check_table_show = _mc["div_reportChart_table"].style.display != "none";
		if (check_table_show) {
			_mc["div_reportChart_table"].style.display = "none";
			_mc["div_btn_reportChart"].classList.remove("--on")
		} else {
			_mc["div_reportChart_table"].style.display = "";
			_mc["div_btn_reportChart"].classList.add("--on")
		}
	};
	_self.getLabel = function(data) {
		var ret = new Array;
		for (var i = 0; i < data.length; i++) ret[i] = i + 1;
		return ret
	};
	_self.reportChartroll = function(e, param) {
		if (param.chk_obj.scrollLeft == 0) param.do_obj.classList.remove("scroll");
		else param.do_obj.classList.add("scroll")
	};
	_self.setSysMsgVisible = function(type, isShowtype) {
		var arr_do_type = {
			"div": "none",
			"sysmsg": "none",
			"loading": "none"
		};
		var loading_obj = dom.getElementById("loading_" + type);
		if (loading_obj) loading_obj.classList.remove("--success");
		arr_do_type[isShowtype] = "";
		var show_time = 0;
		for (var key in arr_do_type) {
			show_time = 0;
			var do_obj = _mc[key + "_" + type];
			if (do_obj) {
				if (isShowtype == "div") {
					show_time = 200;
					if (loading_obj) loading_obj.classList.add("--success")
				}
				setTimeout(function(do_obj, do_type) {
					do_obj.style.display = do_type
				},
				show_time, do_obj, arr_do_type[key])
			}
		}
	};
	_self.getProfitMargin = function(turnoverdata, winlossdata) {
		var out_array = new Array;
		if (showWinLoss_mode == "ag") winlossdata = _self.transform_WinLoss_mode(winlossdata);
		var data_num = turnoverdata.length;
		for (var i = 0; i < data_num; i++) if (winlossdata[i] == "" && turnoverdata[i] == "") out_array[i] = "";
		else if (winlossdata[i] == 0 || turnoverdata[i] == 0) out_array[i] = util.mprintf(0, 0, 2, false, false) * 1;
		else out_array[i] = util.mprintf(winlossdata[i] / turnoverdata[i] * 100, 0, 2, false, false) * 1;
		return out_array
	};
	_self.transform_WinLoss_mode = function(this_data) {
		var out_data = Array();
		for (var key in this_data) if (this_data[key] != "") if (this_data[key] != 0) out_data[key] = this_data[key] * -1;
		else out_data[key] = this_data[key];
		else out_data[key] = this_data[key];
		return out_data
	};
	_self.chg_chart_mode = function(e, param) {
		if (showWinLoss_mode != param.chg_type) {
			for (var key in chart_mode_arr) {
				var this_type = chart_mode_arr[key];
				_mc["chart_mode_" + this_type].classList.remove("--on")
			}
			_mc["chart_mode_" + param.chg_type].classList.add("--on");
			showWinLoss_mode = param.chg_type;
			_self.getChartData()
		}
	};
	_self.choseDateReportChart = function(param) {
		if (param.date == "") return;
		parentClass.dispatchEvent("showLoading", {
			"showLoading": true
		});
		param["date_start"] = param.date;
		param["date_end"] = param.date;
		_self.checkReportTop10(_self.goDateReportChart, {
			"param": param
		})
	};
	_self.goDateReportChart = function(param) {
		var postHash = new Object;
		postHash["report_kind"] = "A";
		postHash["report_type"] = "set";
		postHash["result_type"] = "Y";
		postHash["date_start"] = param["param"].date;
		postHash["date_end"] = param["param"].date;
		postHash["date"] = "yes";
		postHash["gtype"] = "ALL";
		postHash["wtype"] = "ALL";
		postHash["view_layer"] = top.login_layer;
		var param = new Object;
		param["page"] = "report_" + top.login_layer;
		param["post"] = "view_layer=" + top.login_layer;
		param["postHash"] = postHash;
		param["extendsClass"] = "report_index";
		parentClass.dispatchEvent("bodyGoToPage", param)
	}
};
