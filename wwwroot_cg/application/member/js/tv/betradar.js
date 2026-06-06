 function betradar(_win, _dom, _post) {
                var _self = this;
                var classname = "betradar";
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
                    par += "&nowWidth=" + top.nowWidth;
                    par += "&ts=" + top["pageTS"]["rightTV"];
                    var hr = new HttpRequest;
                    hr.addEventListener("onError", _self.onLoadError);
                    hr.addEventListener("LoadComplete", _self.loadComplete);
                    hr.loadURL(top.m2_url, "POST", par)
                }
                ;
                _self.loadComplete = function(jsonstr) {
                    echo("[" + classname + "][loadComplete]");
                    var url = null;
                    var err_msg = "";
                    try {
                        var hash = JSON.parse(jsonstr);
                        url = hash["data"]["url"];
                        if (hash["data"]["error"])
                            err_msg = hash["data"]["error"]["message"]
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
                    echo(">>>>>[now]:" + top.nowWidth + "===[tmp]:" + tmpWidth);
                    if (tmpWidth != top.nowWidth)
                        return;
                    var tmpTS = hash["ts"];
                    if (!tmpTS)
                        tmpTS = "";
                    if (!util.checkTS(top["pageTS"]["rightTV"], tmpTS, classname))
                        return;
                    if (url != null)
                        parentClass.dispatchEvent("srcVideo", {
                            "hls": url
                        });
                    else
                        _self.onError(err_msg)
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