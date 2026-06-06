function footer(_win, _dom, _post){ //extends game_list
    var _self = this;
	var util = new win.Util(win,dom);
    var langx_ary = new Array("zh-cn","zh-tw","en-us");
    _self.init=function(){
        _self.reInit(_self, classname, gameInfo, GameRatio, null, null, IOR);
    }
	
	//新增底部语言功能
				util.addEvent(dom.getElementById("footer_chg_language"), "click", _self.footer_chgLanguage);
				util.addEvent(dom.getElementById("footer_features_new"), "click", _self.chgPage, { "page": "features" } );
				util.addEvent(dom.getElementById("footer_rules_general"), "click", _self.chgPage, { "page": "rules_general" } );
				util.addEvent(dom.getElementById("footer_help_sys"), "click", _self.chgPage, { "page": "help_sys" } );
				util.addEvent(dom.getElementById("footer_help_term"), "click", _self.chgPage, { "page": "help_term" } );
				//新增底部语言选择适配
				document.getElementById("footer_selec_language").classList.remove("on");  //清除 底部選擇語系
				var footer_langxselect=document.getElementById("footer_langx_dropdown");    
				//2020-10-08 2610.我的帳戶-語言設定-原本順序為 英文/繁中/簡中，順序請幫改成簡中/繁中/英文 (CRM-456) (需求) 
				if(langx == "zh-cn")footer_langxselect.options[0].selected="selected";
				if(langx == "zh-tw")footer_langxselect.options[1].selected="selected";
				if(langx == "en-us")footer_langxselect.options[2].selected="selected";
				document.getElementById("footer_"+langx).style.display = "";
				document.getElementById("footer_icon_"+langx).style.display = "";
				
	_self.chgPage = function (e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
    }
	//底部
	_self.footer_chgLanguage = function(){ //底部 語系轉換
			util.addEvent(dom.getElementById("footer_selec_en-us"), "click", _self.choice,"en-us");
			util.addEvent(dom.getElementById("footer_selec_zh-tw"), "click", _self.choice,"zh-tw");
			util.addEvent(dom.getElementById("footer_selec_zh-cn"), "click", _self.choice,"zh-cn");
			document.getElementById("footer_selec_language").classList.add("on");
			document.getElementById("footer_selec_language").style.display = "";
			_self.footer_langxOddSelected("footer_selec_language","footer_lang_focus");//(class控制,focus目標)  PC下拉選單class開關 => on
			var langx_str = "footer_selec_";
			for(var j = 0;j < langx_ary.length;j++){
				if(langx_ary[j] == langx){
					document.getElementById(langx_str+langx_ary[j]).checked ="true";
				}
			}
	}
	
	_self.choice = function(e, param){ // 語系換頁
        //var myselect=document.getElementById("langx_dropdown");
		var icon_str = 'footer_icon_';
        top["userData"].langx = langx;
        if(top["userData"].langx == param){
            document.getElementById("selec_language").classList.remove("on");
            chg_lang_sw="N";//關閉 選擇語系欄
        }else{
            for(var i = 0; i < langx_ary.length; i++){
                document.getElementById(langx_ary[i]).style.display = "none";
                document.getElementById(icon_str+langx_ary[i]).style.display = "none";
            }
            for(var j = 0; j < langx_ary.length; j++){
                if(langx_ary[j] == param){
                    document.getElementById(icon_str+langx_ary[j]).style.display = "";
                    document.getElementById(langx_ary[j]).style.display = "";
                    top["userData"].langx = param;
                    langx = param;
                    ver_ary = top.ver.split("_");
                    ver_ary[2] = param;
                    top.ver = ver_ary.join("_");
                }
            }

            document.getElementById("selec_language").className = "box_popup_selec";
            _history.length = 0 ; //清歷史紀錄
            parentClass.dispatchEvent("clearAllOpenWindow");
            if(top["userData"].newalertMsg == "Y"){
                delete top["userData"].newalertMsg;
                top["userData"].four_pwd = "new";
            }
            util.topGoToUrl(location,top["userData"]);
            //_self.chgPage("",{"page": "home"});
        }
    }
	
	_self.footer_langxOddSelected = function(classId,focusId){
        dom.getElementById(focusId).tabIndex=1;//讓ul li可以聚焦
        setTimeout("langxOddFocus('"+focusId+"')",300);
        util.addEvent(dom.getElementById(focusId), "blur", _self.footer_langxOddBlur, {"id":classId});
    }
	
	_self.footer_langxOddBlur = function(e,param){//失焦關閉選單
        dom.getElementById(param.id).classList.remove("on");//關閉選單
    }
	//end

}