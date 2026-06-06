function service_main(_win, _dom, _post) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var eventHandler = new Object;
                var util = new win.Util(win,dom);
                var _mc = new Object;
                var config_set;
                var classname = "service_main";
                var myhash = {};
                _self.init = function() {
                    _mc["div_cleandata"] = dom.getElementById("div_cleandata");
                    _mc["div_urgent"] = dom.getElementById("div_urgent");
                    _mc["div_regular"] = dom.getElementById("div_regular");
                    _mc["time"] = dom.getElementById("time");
                    _mc["regular_info"] = dom.getElementById("regular_info");
                    _mc["urgent_info"] = dom.getElementById("urgent_info");
                    _mc["maintain_show"] = dom.getElementById("maintain_show");
                    _mc["reg_time_zh"] = dom.getElementById("reg_time_zh");
                    _mc["reg_time_en"] = dom.getElementById("reg_time_en");
                    _self.Serchk(postHash)
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    config_set = parentClass.getThis("config_set");
                    timerHash = parentClass.getThis("timerHash")
                }
                ;
                _self.getThis = function(varible) {
                    if (!myhash[varible]) {
                        var msg = "no myhash[" + varible + "]";
                        util.writeLog(classname, msg)
                    }
                    return myhash[varible]
                }
                ;
                _self.dispatchEvent = function(eventname, param) {
                    if (eventHandler[eventname])
                        eventHandler[eventname](param)
                }
                ;
                _self.Serchk = function(postHash) {
                    var code = postHash["code"];
                    var fix_sw = postHash["fix_sw"];
                    var nowPage = postHash["hometext"];
                    if (!fix_sw)
                        return;
                    if (code == "619") {
                        top["system_time"] = postHash["now_time"];
                        var isHome = nowPage == "home";
                        var isEmergency = postHash["emergency_sw"] == "Y";
                        var isUrgent = postHash["urgent_sw"] == "Y";
                        var isMaintain = postHash["maintain_sw"] == "Y";
                        var isCleanData = postHash["clean_data_sw"] == "Y";
                        if (isEmergency || isUrgent || isMaintain) {
                            if (top.aspenbet == "Y") {
                                if (isEmergency || isUrgent)
                                    util.addClass(_mc["urgent_info"], "none_tel");
                                if (isMaintain)
                                    util.addClass(_mc["regular_info"], "none_tel")
                            }
                            _mc["reg_time_zh"].innerHTML = util.showTxt(postHash["maintain_time"]);
                            _mc["reg_time_en"].innerHTML = util.showTxt(postHash["maintain_time"]);
                            _mc["maintain_show"].className = "maintain";
                            if (isEmergency || isUrgent)
                                _self.openMsg("div_urgent");
                            if (isMaintain)
                                _self.openMsg("div_regular");
                            if (nowPage != null && nowPage != "")
                                util.goToIndex()
                        } else if (isCleanData) {
                            _mc["time"].innerHTML = util.showTxt(postHash["clean_data_time"]);
                            var isGame = parentClass.checkIsGame(nowPage);
                            if (isHome || isGame) {
                                if (isGame)
                                    parentClass.dispatchEvent("closePopMT", {});
                                _self.showCleanData()
                            }
                        }
                    }
                }
                ;
                _self.showCleanData = function() {
                    _self.openMsg("div_cleandata");
                    _mc["maintain_show"].className = "maintain_clear";
                    dom.body.setAttribute("style", "height:100%;width:100%;position:relative;overflow-y:hidden;top:-0px")
                }
                ;
                _self.onError = function(e) {
                    console.error(e)
                }
                ;
                _self.openMsg = function(name) {
                    _mc["div_cleandata"].style.display = "none";
                    _mc["div_urgent"].style.display = "none";
                    _mc["div_regular"].style.display = "none";
                    _mc[name].style.display = ""
                }
            }
            ;