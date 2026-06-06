function img(_win, _dom, _post) {
                var _self = this;
                var classname = "img";
                var parentClass;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var util;
                _self.init = function() {}
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    util = parentClass.getThis("util")
                }
                ;
                _self.getThis = function(varible) {
                    return eval(varible)
                }
                ;
                _self.load = function(token) {
                    echo("[" + classname + "][load]");
                    var par = top.param;
                    par += "&p=get_" + classname;
                    par += "&token=" + token;
                    par += "&user=" + top["userData"].username;
                    par += "&protocol=" + (dom.location.protocol == "https:" ? "Y" : "N");
                    par += "&nowWidth=" + top.nowWidth;
                    par += "&ts=" + top["pageTS"]["rightTV"];
                    var hr = new HttpRequest;
                    hr.addEventListener("onError", _self.onError);
                    hr.addEventListener("LoadComplete", _self.loadComplete);
                    hr.loadURL(top.m2_url, "POST", par)
                }
                ;
                _self.loadComplete = function(jsonstr) {
                    echo("[" + classname + "][loadComplete]");
                    var hash;
                    try {
                        hash = JSON.parse(jsonstr)
                    } catch (e) {
                        var errorMsg = util.showConnectMsg(jsonstr);
                        if (util.alertConnectMsg(errorMsg))
                            return;
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": jsonstr,
                            "e": e
                        });
                        return
                    }
                    var hlsUrl = hash["data"]["hlsUrl"];
                    var statusCode = hash["data"]["statusCode"];
                    var _url = hash["data"]["url"];
                    var param = hash["data"]["param"];
                    var errorMsg = hash["data"]["message"];
                    var tmpWidth = hash["nowWidth"];
                    echo(">>>>>[now]:" + top.nowWidth + "===[tmp]:" + tmpWidth);
                    if (tmpWidth != top.nowWidth)
                        return;
                    var tmpTS = hash["ts"];
                    if (!tmpTS)
                        tmpTS = "";
                    if (!util.checkTS(top["pageTS"]["rightTV"], tmpTS, classname))
                        return;
                    if (statusCode == "200" && hlsUrl)
                        parentClass.dispatchEvent("srcVideo", {
                            "hls": hash["data"]["hlsUrl"]
                        });
                    else if (_url != null && _url != "") {
                        var hr = new win.HttpRequest;
                        hr.addEventListener("onError", _self.onError);
                        hr.addEventListener("LoadComplete", _self.loadHLS);
                        hr.loadURL(_url, "GET", param)
                    } else if (hlsUrl == null || hlsUrl == "") {
                        _self.writeLog(jsonstr);
                        if (errorMsg != "" && errorMsg != null)
                            parentClass.dispatchEvent("setErrorTV", {
                                "msg": errorMsg
                            });
                        else
                            parentClass.dispatchEvent("setErrorTV", {
                                "msg": "stream over"
                            })
                    } else
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": "error"
                        })
                }
                ;
                _self.loadHLS = function(jsonstr) {
                    echo("[" + classname + "][loadHLS]");
                    var hash;
                    try {
                        hash = JSON.parse(jsonstr)
                    } catch (e) {
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": "data error",
                            "e": e
                        });
                        return
                    }
                    if (hash["hlsUrl"])
                        parentClass.dispatchEvent("srcVideo", {
                            "hls": hash["hlsUrl"]
                        });
                    else
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": "no event",
                            "e": null
                        })
                }
                ;
                _self.onError = function() {
                    parentClass.dispatchEvent("setErrorTV", {
                        "msg": "connect fail"
                    })
                }
                ;
                _self.writeLog = function(msg) {
                    var param = "";
                    param += "mid=" + top["userData"].mid;
                    param += "&p=write_log";
                    param += "&fileName=img_acclog";
                    param += "&ver=" + top.ver;
                    param += "&MSG=" + top["userData"].username + "," + encodeURIComponent(msg);
                    console.log("mid:" + top["userData"].mid);
                    console.log("MSG:" + top["userData"].username + "," + msg);
                    console.log("m2_url:", top.m2_url);
                    var hr = new HttpRequest;
                    hr.addEventListener("LoadComplete", null);
                    hr.loadURL(top.m2_url, "POST", param)
                }
            }
            ;