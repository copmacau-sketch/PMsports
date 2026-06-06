function unas(_win, _dom, _post) {
                var _self = this;
                var classname = "unas";
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
                            "msg": jsonstr
                        });
                        return
                    }
                    var _url = hash["url"];
                    var param = hash["param"];
                    if (_url != null && _url != "") {
                        var hr = new win.HttpRequest;
                        hr.addEventListener("onError", _self.onError);
                        hr.addEventListener("LoadComplete", _self.loadHLS);
                        hr.loadURL(_url, "GET", param)
                    } else
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": "error"
                        })
                }
                ;
                _self.loadHLS = function(xml) {
                    echo("[" + classname + "][loadHLS]");
                    var xmlnode;
                    try {
                        xmlnode = util.parseXml(xml)
                    } catch (e) {
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": xml
                        });
                        return
                    }
                    var token = xmlnode.Node(xmlnode.Root[0], "token");
                    var _url = token.getAttribute("url");
                    var statusText = token.getAttribute("statusText");
                    if (_url == "error" || statusText == "restricted") {
                        var msg = token.getAttribute("comment");
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": msg
                        })
                    } else
                        parentClass.dispatchEvent("srcVideo", {
                            "hls": _url
                        })
                }
                ;
                _self.onError = function() {
                    parentClass.dispatchEvent("setErrorTV", {
                        "msg": "error"
                    })
                }
            }
            ;