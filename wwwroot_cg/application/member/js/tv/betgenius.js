 function betgenius(_win, _dom, _post) {
                var _self = this;
                var classname = "betgenius";
                var parentClass;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var util;
                var betgenius_url = dom.location.protocol + "//betgenius.hgapp0004.com/betgenius.php?uid=" + top["userData"].uid + "&usr=" + top["userData"].username + "&from=m2" + "&ver=" + top.ver;
                var betgenius_timer = null;
                var token = null;
                _self.init = function() {}
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    util = parentClass.getThis("util");
                    LS = parentClass.getThis("LS")
                }
                ;
                _self.getThis = function(varible) {
                    return eval(varible)
                }
                ;
                _self.load = function(_token) {
                    echo("[" + classname + "][load]");
                    token = _token;
                    var par = top.param;
                    par += "&p=get_" + classname;
                    par += "&token=" + token;
                    par += "&user=" + top["userData"].username;
                    par += "&nowWidth=" + top.nowWidth;
                    par += "&ts=" + top["pageTS"]["rightTV"];
                    var hr = new HttpRequest;
                    hr.addEventListener("onError", _self.onLoadError);
                    hr.addEventListener("LoadComplete", _self.loadComplete);
                    hr.loadURL(top.m2_url, "POST", par)
                }
                ;
                _self.loadComplete = function(jsonstr) {
                    var url = null;
                    var err_msg = "";
                    try {
                        var hash = JSON.parse(jsonstr);
                        url = hash["data"]["url"];
                        drm = hash["data"]["drm"];
                        if (hash["data"]["title"])
                            err_msg = hash["data"]["title"]
                    } catch (e) {
                        var errorMsg = util.showConnectMsg(jsonstr);
                        if (util.alertConnectMsg(errorMsg))
                            return;
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": jsonstr
                        });
                        return
                    }
                    var tmpWidth = hash["nowWidth"];
                    if (tmpWidth != top.nowWidth)
                        return;
                    var tmpTS = hash["ts"];
                    if (!tmpTS)
                        tmpTS = "";
                    if (!util.checkTS(top["pageTS"]["rightTV"], tmpTS, classname))
                        return;
                    if (drm != null) {
                        err_msg = LS.get("BG_DRM_Y");
                        _self.onError(err_msg)
                    } else if (url != null)
                        if (top.load_betgenius)
                            _self.getLiveStream(hash);
                        else
                            echo("wait for load betgenius iframe");
                    else {
                        if (err_msg == "")
                            err_msg = LS.get("BG_DRM_N");
                        _self.onError(err_msg)
                    }
                    return true
                }
                ;
                _self.getLiveStream = function(hash) {
                    var streamid = hash["data"]["stream_id"];
                    if (streamid) {
                        var data = hash["data"];
                        var access_token = data["token"];
                        echo(data, "[getLiveStream]");
                        if (access_token) {
                            url = data["url"] + "?" + access_token;
                            parentClass.dispatchEvent("srcVideo", {
                                "hls": url
                            })
                        } else
                            parentClass.dispatchEvent("setErrorTV", {
                                "msg": "no access token"
                            })
                    } else
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": "no streamid"
                        })
                }
                ;
                _self.sendMsg = function(msg) {
                    if (top.load_betgenius)
                        dom.getElementById("betgenius_ifr").contentWindow.postMessage(msg, "*");
                    else {
                        console.error("load betgenius fail");
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": "load betgenius fail"
                        })
                    }
                }
                ;
                _self.initBetgenius = function() {
                    win.addEventListener("message", _self.onMessage, false);
                    if (!top.load_betgenius) {
                        if (dom.getElementById("betgenius_ifr") == null) {
                            var ifr = dom.createElement("iframe");
                            ifr.id = "betgenius_ifr";
                            ifr.style.display = "none";
                            dom.body.appendChild(ifr)
                        }
                        _self.srcBetgenius()
                    }
                }
                ;
                _self.srcBetgenius = function() {
                    dom.getElementById("betgenius_ifr").src = betgenius_url;
                    clearTimeout(betgenius_timer);
                    betgenius_timer = setTimeout(_self.checkBetgenius, 1E4)
                }
                ;
                _self.checkBetgenius = function() {
                    clearTimeout(betgenius_timer);
                    if (top.load_betgenius)
                        console.log("[checkBetgenius]load betgenius compelete");
                    else
                        parentClass.dispatchEvent("showAlertMsg", {
                            "target": "C_alert_ok",
                            "msg": LS.get("connect_retry"),
                            "retFun": _self.srcBetgenius
                        })
                }
                ;
                _self.onMessage = function(event) {
                    var msg = event.data.split(",");
                    var code = msg[0];
                    switch (code) {
                    case "init":
                        console.log("[BG][onMessage][init]");
                        top.load_betgenius = true;
                        clearTimeout(betgenius_timer);
                        if (parentClass.getPlaying()) {
                            echo("betgenius iframe loaded > defaultPlayProc");
                            _self.load(token)
                        }
                        break
                    }
                }
                ;
                _self.onError = function(msg) {
                    var _msg = msg ? msg : "error";
                    parentClass.dispatchEvent("setErrorTV", {
                        "msg": _msg
                    })
                }
                ;
                _self.onLoadError = function(msg) {
                    parentClass.dispatchEvent("setErrorTV", {
                        "msg": "connect fail"
                    })
                }
            }
            ;