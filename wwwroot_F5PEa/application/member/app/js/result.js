var GameRtype = new Array();
var SP_wtypes = new Array();
var gid ='';
var calendar = null;

		try{
		parent.mem_order.document.getElementById('today_btn').className="today_btn";
		parent.mem_order.document.getElementById('early_btn').className="early_btn";
		}catch(E){}

function init(){
	var sel = document.getElementById("sel_gtype");
	var obj = document.getElementById("gtype_"+game_type);
	obj.className = (game_type == "BK"&&top.langx=="en-us")?"acc_selectBK On":"On";
	sel.innerHTML = obj.innerHTML;
	//document.getElementById("chose_gtype").setAttribute("onmouseleave","close_sel(this.id)");
	//document.getElementById("chose_type").setAttribute("onmouseleave","close_sel(this.id)");
	var sel_type = document.getElementById("sel_type");
	var obj_type = document.getElementById(chg_type);
	obj_type.className = "On";
	sel_type.innerHTML = obj_type.innerHTML;
	setClick("gtype");
	setClick("type");

	document.body.onclick=function(evt){getTarget((evt) ? evt : window.event);}
	var langx = top.langx;
	var _set = {};
	if(langx == "zh-tw" ||langx == "zh-cn"){
		_set.monthName = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]; // 月份語系;
		_set.weekName = ["日","一","二","三","四","五","六"]; // 星期語系;
	}
	if(langx == "en-us"){
		_set.monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"]; // 月份語系;
		_set.weekName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; // 星期語系;
	}
	_set.futureYear = 20; // 未來年份數;
	_set.cssShow = false;
	_set.maxDate=max_day;
	var tmpScreen = document.getElementById("div_state");
	calendar = new ClassFankCal(tmpScreen,_set);
	calendar.addEventListener("DATE_CHOOSE",function(evt,obj){
		if(document.all){
			document.getElementById("date_start").innerText = obj.date;
		}
		else{
			document.getElementById("date_start").textContent = obj.date;
		}
		calendar.close();
		location.href = "/app/member/account/result/result.php?game_type="+game_type+"&list_date="+obj.date+"&uid="+top.uid+"&langx="+top.langx;
	});

	calendar.addEventListener("ERROR_DATE",function(evt,obj){
		//console.log(evt);
		//console.log(obj);
	});

	for(var key in top.showResultObj){
       document.getElementById(key).style.display = top.showResultObj[key];
	}
	if(lasttr == "Y"){
		document.getElementById("results_tableLine").className = "acc_results_tableBL";
	}
}

function getTarget(evt){
	var evt=(evt.target) ? evt.target :evt.srcElement;
	if(evt.id != "sel_gtype")
	{
		document.getElementById("chose_gtype").style.display = "none";
	}
	if(evt.id != "sel_type")
	{
		document.getElementById("chose_type").style.display = "none";
	}
}

function close_sel(_id){
	document.getElementById(_id).style.display="none";
}

function setClick(type){
		var typeObj = document.getElementById("chose_"+type);
		for(var i=0; i<typeObj.children.length; i++){
				var obj = typeObj.children[i];
				setClickEvent(obj,type);
		}
}

function setClickEvent(obj,type){
		obj.onclick=function(){
				chgChose(obj,type);
		};
}

function chgChose(obj, type){
		var _value = obj.getAttribute("value");
		chg_gtype(_value);

}

function setUrl(url){
	if(url){
		top.showResultObj=new Object();
		location.href=url;
	}
}

function showOption(_type){
	var _otherType = (_type == "gtype")?"type":"gtype";
	var _status = document.getElementById("chose_"+_type).style.display;
	var _newStatus = (_status=="")?"none":"";
	document.getElementById("chose_"+_type).style.display = _newStatus;
	top.showResultObj=new Object();
	if(_newStatus == ""){
		document.getElementById("chose_"+_otherType).style.display = "none";
		calendar.close();
	}
}

function showDate(){
	var abs = util.getObjAbsolute_new(document.getElementById("date_start"));
	var date;
	if(document.all){
		date = document.getElementById("date_start").innerText;
	}
	else{
		date = document.getElementById("date_start").textContent;
	}
	calendar.open(abs["left"],abs["top"]+document.getElementById("date_start").offsetHeight,date);
	document.getElementById("date_start").className = "acc_selectMS_first RedWord";
	document.getElementById("chose_gtype").style.display = "none";
	document.getElementById("chose_type").style.display = "none";
	top.showResultObj=new Object();
}

function closeDate(){
	document.getElementById("date_start").className = "acc_selectMS_first";
}

function Check(uid,gtype,gid,lang,i){
	document.getElementById("show_table").style.top=document.getElementById("moreid_"+i).offsetTop+10;
	//document.getElementById("show_table").style.top=document.body.scrollTop+event.clientY+10;
	SP_Data.location ="./result_sp.php?uid="+uid+"&gtype="+gtype+"&gid="+gid+"&langx="+lang;
}

function show_key_result_sp(){
	var rary =SP_wtypes;
	var rary1=new Array("F","L");
	var rarysub=new Array("H","C");
	var tmpDate= new Array();
	var tmp_table = document.getElementById("show_table_sp").innerHTML;
	for(var j=0; j < rary.length; j++) {
		for(var k=0; k < rary1.length; k++) {
			if(GameRtype[gid+rary[j]+rary1[k]][1]=="無開放" || GameRtype[gid+rary[j]+rary1[k]][1]=="无开放" || GameRtype[gid+rary[j]+rary1[k]][1]=="N/A"){
			tmp_table  = tmp_table.replace('*'+rary[j]+rary1[k]+'*',GameRtype[gid+rary[j]+rary1[k]][1]).replace('*'+rary[j]+rary1[k]+'A'+'*',"mor_2").replace('*'+rary[j]+rary1[k]+'B'+'*',"morth_2");
		}else{
			tmp_table  = tmp_table.replace('*'+rary[j]+rary1[k]+'*',GameRtype[gid+rary[j]+rary1[k]][1]).replace('*'+rary[j]+rary1[k]+'A'+'*',"mor_1").replace('*'+rary[j]+rary1[k]+'B'+'*',"morth_1");
			}
		}
	}
	show_table.innerHTML =tmp_table ;
}

function Closedv(){
	show_table.innerHTML="";
}


function chg_gtype(tmpValue){
	var strUrl ="";
	console.log(tmpValue);
	if(tmpValue=="FS" || (chg_type == "Outright" && tmpValue != "Match")){
		strUrl ="/app/member/account/result/result_fs.php";
	/*}else if(tmpValue=="SFS"){
		strUrl ="/app/member/account/result/result_sfs.php";
	}else if(tmpValue=="TN"){
		strUrl ="/app/member/account/result/result_tn.php";
	}else if(tmpValue=="VB"){
		strUrl ="/app/member/account/result/result_vb.php";
	}else if(tmpValue=="BM"){
		strUrl ="/app/member/account/result/result_bm.php";
	}else if(tmpValue=="TT"){
		strUrl ="/app/member/account/result/result_tt.php";*/
	}else{
		strUrl ="/app/member/account/result/result.php";
	}
	if(tmpValue=="FS" || tmpValue=="Match")tmpValue = game_type;
	//}
	self.location.href=strUrl+"?uid="+top.uid+"&langx="+top.langx+"&game_type="+tmpValue+"&today="+game_date;
}

//--------------判斷聯盟顯示或隱藏----------------
function showLEG(leg){
	for (i=0;i<myleg.length;i++){
		//if (leg==myleg[i][0]){
		if (myleg[i].indexOf(leg)!= -1){
			if ( document.getElementById("TR_"+myleg[i]).style.display!="none"){
				showLegIcon(leg,"LegClose",myleg[i],"none");
			}else{
				showLegIcon(leg,"LegOpen",myleg[i],"");
			}
		}
	}
}
function showLegIcon(leg,state,gnumH,display){
	//var  ary=document.getElementById("S_"+gnumH);
		//alert(ary.innerHTML);

	//for (var j=0;j<ary.length;j++){
	//	ary.innerHTML="<span id='"+state+"'></span>";
	//}
	//alert(">>>>>>>>>>"+gnumH+"<-------->"+display);
	var  ary=document.getElementsByName("S_"+gnumH);
//	alert(">>>>>>>>"+ary.length);
	for (var j=0;j<ary.length;j++){
		ary[j].innerHTML="<span id='"+state+"'></span>";
		//alert("<---------->"+ary[j].innerHTML+"<-------->"+state);
	}
	try{
		document.getElementById("TR_10_"+gnumH).style.display=display;
		top.showResultObj["TR_10_"+gnumH] = display;
	}catch(E){}
	try{
		document.getElementById("TR_9_"+gnumH).style.display=display;
		top.showResultObj["TR_9_"+gnumH] = display;
	}catch(E){}
	try{
		document.getElementById("TR_8_"+gnumH).style.display=display;
		top.showResultObj["TR_8_"+gnumH] = display;
	}catch(E){}
	try{
		document.getElementById("TR_7_"+gnumH).style.display=display;
		top.showResultObj["TR_7_"+gnumH] = display;
	}catch(E){}
		try{
		document.getElementById("TR_6_"+gnumH).style.display=display;
		top.showResultObj["TR_6_"+gnumH] = display;
	}catch(E){}
		try{
		document.getElementById("TR_5_"+gnumH).style.display=display;
		top.showResultObj["TR_5_"+gnumH] = display;
	}catch(E){}
		try{
		document.getElementById("TR_4_"+gnumH).style.display=display;
		top.showResultObj["TR_4_"+gnumH] = display;
	}catch(E){}
		try{
		document.getElementById("TR_3_"+gnumH).style.display=display;
		top.showResultObj["TR_3_"+gnumH] = display;
	}catch(E){}
	try{
		document.getElementById("TR_2_"+gnumH).style.display=display;
		top.showResultObj["TR_2_"+gnumH] = display;
	}catch(E){}
	try{
		document.getElementById("TR_1_"+gnumH).style.display=display;
		top.showResultObj["TR_1_"+gnumH] = display;
	}catch(E){}
	try{
		document.getElementById("TR_"+gnumH).style.display=display;
		top.showResultObj["TR_"+gnumH] = display;
	}catch(E){}
	try{
		document.getElementById("PT_"+gnumH).style.display=display;
		top.showResultObj["PT_"+gnumH] = display;
	}catch(E){}
}


function onchangeDate(url,tmpgtype,lang){
        var todayTmp= document.getElementById('today_gmt');
        var chk=chk_changeDate(todayTmp.value);
        if(chk==false){
        	alert("Date error!!");
        	return;
        }
       location.href=url+"&game_type="+tmpgtype+"&today="+todayTmp.value+"&langx="+lang;

}

function chk_changeDate(today_Tmp){
	if(today_Tmp==""){
		return true;}

	var dateArr = today_Tmp.split("-");
	if(dateArr.length!=3){
		return false;
	}else if(dateArr[0]*1< 2000 || dateArr[0]*1 > 2999){
		return false;
	}else if(dateArr[1]*1< 1 || dateArr[1]*1 > 12){
		return false;
	}else if(dateArr[2]*1< 1 || dateArr[2]*1 > 31){
		return false;
	}else{
		return true;
	}

}
function refreshReload(level){
	reload_var(level);
}

function reload_var(Level){
	location.reload();
}
//window.onscroll = scroll;

function scroll()
{
	var refresh_right= document.getElementById('refresh_right');

	//refresh_right.style.top=document.body.scrollTop+21+34+25+10;
	refresh_right.style.top=document.body.scrollTop+(document.body.clientHeight-118)/2;
	                      // 捲軸位置              +( frame高度                -header高度)/2

 //alert("scroll event detected! "+document.body.scrollTop);
//
	//conscroll.style.display="block";
//conscroll.style.top=document.body.scrollTop;
 // note: you can use window.innerWidth and window.innerHeight to access the width and height of the viewing area
}
//----------------------

function showResult_new(uid,gtype,gid,lang){
	document.body.style.overflowY="hidden";
	document.body.scrollTop = "0";
	var obj = document.getElementById('result_new_Data');
	obj.style.display = "";
	obj.style.position = "absolute";

	obj.style.top = parent.body.scrollY+40 || parent.body.document.body.scrollTop+40 ;



	obj.style.left = "0px";

	result_new_Data.location.href = "./"+gtype+"_result_new.php?uid="+uid+"&gtype="+gtype+"&game_id="+gid+"&langx="+lang;
}

function showDiv(divname, isShow){
		var obj = document.getElementById("chose_"+divname);
		obj.style.display = (isShow)?"":"none";

}
