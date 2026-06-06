function AD(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var swiper = null;
    var _isAndroidPC = false;
    var parentClass;
    var autoplay_sec = 8E3;
    var bannerGame = 0;
    var addEventBannerGame = false;
    _self.init = function() {}
    ;
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass
    }
    ;
    _self.getThis = function(varible) {
        return eval(varible)
    }
    ;
    _self.setTimeout = function(isAndroidPC) {
        _isAndroidPC = isAndroidPC;
        setTimeout(_self.setSwiper, 500)
    }
    ;
    _self.setSwiper = function() {
        var containerName = _isAndroidPC ? ".swiper-container" : ".swiper-container_ios";
        var paginationName = _isAndroidPC ? ".swiper-pagination" : ".swiper-pagination_ios";
        swiper = new Swiper(containerName,{
            loop: true,
            on: {
                doubleTap: function(e) {
                    _self.clickfun(e.target.id)
                },
                click: function(e) {
                    _self.clickfun(e.target.id)
                }
            },
            pagination: {
                el: paginationName,
                clickable: true
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            autoplay: {
                delay: autoplay_sec,
                disableOnInteraction: false
            }
        });
        if (top.specialGame.isHL) {
            top.loadAD_done = true;
            parentClass.dispatchEvent("closeGameLoading", {})
        }
    }
    ;
    _self.clickfun = function(id) {
        var hasCUP = top.specialGame.mode == "CUP";
        var nowTS = (new Date).getTime();
        top["lastClickTS"] = nowTS;
        var feaAry = new Array("AD_innart02_320","AD_innart02_640","AD_innart03_320","AD_innart03_640","AD_innart04_320","AD_innart04_640","btn_features");
        if (feaAry.indexOf(id) != -1)
            _self.chgPage("click", {
                "page": "features"
            });
        else if (id.indexOf("AD_innartMyGame") != -1)
            _self.chgPage("click", {
                "page": "features",
                "data": "data_1"
            });
        else if (id.indexOf("AD_innartForecast") != -1)
            _self.chgPage("click", {
                "page": "features",
                "data": "data_7"
            });
        else if (id.indexOf("AD_innartTimeset") != -1)
            _self.chgPage("click", {
                "page": "features",
                "data": "data_12"
            });
        else if (id.indexOf("set_4pwd") != -1)
            _self.chgPage("click", {
                "page": "passcode"
            });
        else if (id.indexOf("dl_google") != -1)
            _self.chgdownloadPage();
        else if (id.indexOf("special_ad") != -1) {
            if (top.specialGame.SW)
                if (top["specialGame"]["Total_Count"] != "0")
                    parentClass.dispatchEvent("goToSpecialPage", {
                        "specialClick": "special",
                        "type": "live",
                        "page": "league_index",
                        "showtype": "live",
                        "rtype": "rb"
                    })
        } else if (id.indexOf("AD_innart" + top["bannerGtype"]) != -1)
            ;
        else if (id.indexOf("AD_innartHotgame") != -1)
            _self.goHotGame();
        else if (id.indexOf("AD_innartCup_") != -1) {
            if (top.specialGame.SW)
                if (top["specialGame"]["Total_Count"] != "0" && hasCUP)
                    parentClass.dispatchEvent("goToSpecialPage", {
                        "specialClick": "special",
                        "type": "live",
                        "page": "league_index",
                        "showtype": "live",
                        "rtype": "rb",
                        "from": "pic",
                        "kind": "highlights",
                        "nowTS": nowTS
                    })
        } else if (id.indexOf("AD_innartCupfs_") != -1) {
            if (top.specialGame.SW)
                if (top["specialGame"]["Total_Count"] != "0" && hasCUP)
                    parentClass.dispatchEvent("goToSpecialPage", {
                        "specialClick": "special",
                        "type": "live",
                        "page": "league_index",
                        "showtype": "early",
                        "rtype": "fs",
                        "from": "pic",
                        "kind": "fs",
                        "nowTS": nowTS
                    })
        } else if (id.indexOf("CUP_innartForecast_") != -1 && hasCUP)
            _self.chgPage("click", {
                "page": "features"
            })
    }
    ;
    _self.chgPage = function(e, param) {
        param.retFun = _self.changePageComplete;
        if (param.page == "features")
            param.noCache = "Y";
        parentClass.dispatchEvent("bodyGoToPage", param)
    }
    ;
    _self.intoGame = function(e) {
        var GameObj = {
            "page": "game_list_" + top["bannerGtype"],
            "extends": "game_list",
            "gtype": top["bannerGtype"].toLowerCase(),
            "showtype": "today",
            "rtype": "r"
        };
        top.choice_filter = "FT";
        parentClass.dispatchEvent("intoGame", GameObj)
    }
    ;
    _self.goHotGame = function(e) {
        var GameObj = {
            "page": "game_list_" + top.choice_gtype.toUpperCase(),
            "extends": "game_list",
            "gtype": top.choice_gtype,
            "showtype": "hot",
            "rtype": "r"
        };
        parentClass.dispatchEvent("intoGame", GameObj)
    }
    ;
    _self.getTimestamp = function() {
        return (new Date).getTime()
    }
    ;
    _self.bannerGameCount = function(count) {
        bannerGame = count * 1;
        var bannerGtypeObj_640 = dom.getElementById("AD_innart" + top["bannerGtype"] + "_640");
        var bannerGtypeObj_320 = dom.getElementById("AD_innart" + top["bannerGtype"] + "_320");
        var home_320 = dom.getElementById("home_touch_div_320");
        var home_320_ios = dom.getElementById("home_touch_div_320_ios");
        var home_640 = dom.getElementById("home_touch_div_640");
        var home_640_ios = dom.getElementById("home_touch_div_640_ios");
        if (!home_320.classList.contains("no_event"))
            home_320.classList.add("no_event");
        if (!home_320_ios.classList.contains("no_event"))
            home_320_ios.classList.add("no_event");
        if (!home_640.classList.contains("no_event"))
            home_640.classList.add("no_event");
        if (!home_640_ios.classList.contains("no_event"))
            home_640_ios.classList.add("no_event")
    }
    ;
    _self.chgdownloadPage = function() {
        var urlParams = "";
        urlParams += "uid=" + top["userData"].uid;
        urlParams += "&langx=" + top.langx;
        urlParams = "p=guide_HGApp&ver=" + top.ver + "&" + urlParams;
        window.open(top.m2_url + "?" + urlParams)
    }
    ;
    _self.gotogoogle = function() {
        window.open("https://play.google.com/store/apps/details?id=com.hg0088.sib")
    }
    ;
    _self.setAutoPlaySec = function(sec) {
        autoplay_sec = sec
    }
}
;