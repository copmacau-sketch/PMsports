function HttpRequest() {
                var _self = this;
                var req;
                var eventHandler = new Array;
                var parentClass;
                var isAbort = false;
                var cancelAbort = false;
                var _url = "";
                var _method = "";
                var _params = "";
                var _pageName = "";
                _self.ts = "";
                _self.init = function() {
                    _self.addEventListener("LoadComplete", _self.cmd_proc);
                    _self.ts = _self.getTimestamp()
                }
                ;
                _self.help = function() {
                    var str = "";
                    str += "EventName:LoadComplete Method:function(html)\n";
                    str += "Method:loadURL(url,post/get,pamam)\n";
                    return str
                }
                ;
                _self.setParentclass = function(parentclass) {
                    parentClass = parentclass
                }
                ;
                _self.getThis = function(varible) {
                    return eval(varible)
                }
                ;
                _self.loadURL = function(url, method, params) {
                    req = false;
                    _url = url;
                    _method = method;
                    _params = params;
                    if (window.XMLHttpRequest && !window.ActiveXObject)
                        try {
                            req = new XMLHttpRequest
                        } catch (e) {
                            req = false
                        }
                    else if (window.ActiveXObject)
                        try {
                            req = new ActiveXObject("Msxml2.XMLHTTP")
                        } catch (e) {
                            try {
                                req = new ActiveXObject("Microsoft.XMLHTTP")
                            } catch (e) {
                                req = false
                            }
                        }
                    if (req) {
                        _time = new Date;
                        var new_par = _self.replaceFromParam(_params);
                        var isBet = _pageName.indexOf("bet") != -1 && _pageName.indexOf("betradar") == -1;
                        var isHistory = _pageName.indexOf("get_history") != -1;
                        if (!isBet && !isHistory)
                            req.timeout = 1E4;
                        if (top["requestHash"][_method + "_" + new_par]) {
                            var tmpTS = top["requestHash"][_method + "_" + new_par].ts;
                            if (tmpTS != _self.ts) {
                                top["requestHash"][_method + "_" + new_par].cancelAbort();
                                delete top["requestHash"][_method + "_" + new_par]
                            }
                        }
                        top["requestHash"][_method + "_" + new_par] = _self;
                        req.onreadystatechange = _self.processReqChange;
                        if (method == undefined)
                            method = "POST";
                        if (method.toUpperCase() == "POST") {
                            req.open("POST", url + _self.getP(params), true);
                            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            req.send(params)
                        } else {
                            req.open("GET", url + "?" + params, true);
                            req.send("")
                        }
                    }
                }
                ;
                _self.abort = function() {
                    try {
                        isAbort = true;
                        req.abort()
                    } catch (e) {
                        console.error("[abortError] = ", e)
                    }
                }
                ;
                _self.cancelAbort = function() {
                    try {
                        cancelAbort = true;
                        req.abort()
                    } catch (e) {
                        console.error("[cancelAbortError] = ", e)
                    }
                }
                ;
                _self.processReqChange = function() {
                    if (cancelAbort)
                        return;
                    if (req.readyState == 4) {
                        var new_par = _self.replaceFromParam(_params);
                        if (req.status == 200) {
                            delete top["requestHash"][_method + "_" + new_par];
                            delete top["requestFailedHash"][_method + "_" + new_par];
                            _self.eventhandler("LoadComplete", req.responseText)
                        } else if (req.status == 0)
                            if (isAbort)
                                _self.eventhandler("onAbort", req);
                            else if (_pageName.indexOf("bet") == -1 || _pageName.indexOf("betradar") != -1) {
                                top["requestFailedHash"][_method + "_" + new_par] = "Failed";
                                setTimeout(_self.loadURL, 1E3, _url, _method, _params)
                            } else
                                _self.eventhandler("onError", req);
                        else if (_pageName.indexOf("bet") == -1 || _pageName.indexOf("betradar") != -1) {
                            top["requestFailedHash"][_method + "_" + new_par] = "Failed";
                            setTimeout(_self.loadURL, 1E3, _url, _method, _params)
                        } else
                            _self.eventhandler("onError", req)
                    } else if (req.readyState == 0 && req.status == 0)
                        if (isAbort)
                            _self.eventhandler("onAbort", req);
                        else if (_pageName.indexOf("bet") == -1 || _pageName.indexOf("betradar") != -1) {
                            top["requestFailedHash"][_method + "_" + new_par] = "Failed";
                            setTimeout(_self.loadURL, 1E3, _url, _method, _params)
                        } else
                            _self.eventhandler("onError", req);
                    isAbort = false
                }
                ;
                _self.addEventListener = function(eventname, eventFunction) {
                    eventHandler[eventname] = eventFunction
                }
                ;
                _self.removeEventListener = function(eventname) {
                    EventHandler[eventname] = undefined
                }
                ;
                _self.eventhandler = function(eventname, param) {
                    if (eventHandler[eventname] != undefined)
                        eventHandler[eventname](param)
                }
                ;
                _self.cmd_proc = function(html) {
                    alert(html)
                }
                ;
                _self.getP = function(params) {
                    var p = "?ver=" + top.ver;
                    if (typeof autoLogin == "function") {
                        var par = params.split("&");
                        for (var i = 0; i < par.length; i++) {
                            var tmp = par[i].split("=");
                            if (tmp[0] == "p") {
                                p = "?p=" + tmp[1] + "&ver=" + top.ver;
                                break
                            }
                        }
                    }
                    return p
                }
                ;
                _self.replaceFromParam = function(_params) {
                    var replaceParam = _params;
                    var par = _params.split("&");
                    for (var i = 0; i < par.length; i++) {
                        if (par[i].indexOf("ver=") != -1 || par[i].indexOf("ts=") != -1 || par[i].indexOf("timestamp=") != -1)
                            replaceParam = replaceParam.replace(par[i], "");
                        if (par[i].indexOf("p=") != -1 && _pageName == "")
                            _pageName = par[i].split("=")[1]
                    }
                    return replaceParam
                }
                ;
                _self.getTimestamp = function() {
                    return (new Date).getTime()
                }
                ;
                _self.init()
            }
            ;