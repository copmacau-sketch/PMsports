function runall(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var swiper = null;
    var parentClass;

    _self.init = function () {
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    _self.setTimeout = function(){
            setTimeout(_self.setSwiper(),190);
            
    }

    _self.setSwiper = function(){
            swiper = new Swiper('.swiper-container_ios', {
                    loop: true,             //輪播
                    on: {
                        doubleTap:  function(e){
                            _self.clickfun(e.target.id);
                        }

                        ,click:  function(e){
                            _self.clickfun(e.target.id);
                        }
                    },
                    pagination: {           //分頁器
                            el: '.swiper-paginatio_ios',
                            clickable: true,
                          },
                    navigation: {           //按鍵切換
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                          },
                    autoplay: {             //自動播
                            delay: 8000,    
                            disableOnInteraction: false,
                          },
                  });  
    }

    _self.clickfun = function(param){
        if(param == "AD_innart02_320"||param == "AD_innart03_320"||param == "AD_innart04_320"||param == "AD_innart02_640"||param == "AD_innart03_640"||param == "AD_innart04_640"){
            _self.chgPage("click",{ "page": "features" });
        }else if(param == "set_4pwd_320"||param == "set_4pwd_640"){
            _self.chgPage("click",{ "page": "passcode" });
        }else if(param == "dl_google_320"||param == "dl_google_640"){
            _self.chgdownloadPage()
        }else if(param == "btn_features"){
            _self.chgPage("click",{ "page": "features" });
        }else if(param == "btn_store_320"||param == "btn_store_640"){
            _self.gotogoogle();
        }else if(param == "AD_innart00_320" || param == "AD_innart00_640"){
            if(top.specialGame.SW){
                if(top["specialGame"]["Total_Count"] != "0")parentClass.dispatchEvent("goToSpecialPage", {"specialClick": "special", "type": "live" ,"page": "league_index" ,"showtype":"live" ,"rtype": "rb"});
            }     
        }
    };

    _self.chgPage = function (e,param) {
        param.retFun = _self.changePageComplete;
        if(param.page == "features"){
            document.getElementById("body_show").classList.add("box_l_height");//2021-01-11 Q2 275.ios-所有瀏覽器-用四位數密碼登入，馬上點新功能、體育規則、賠率轉換會無法往下滑(正常登入正常)
            param.noCache = "Y";
        }
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.chgdownloadPage = function () {
        var urlParams = "";
        urlParams += "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams = "p=guide_HGApp&ver=" + top.ver + "&" + urlParams;
        //window.open("/app/guide_HGApp.php?"+urlParams);
        window.open(top.url+"?"+urlParams);
    }

    _self.gotogoogle = function(){
        window.open("https://play.google.com/store/apps/details?id=com.hg0088.sib");
    }
}
