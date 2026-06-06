  function HttpRequestRetry(_HttpRequest, _time, _limit, _frame) {
                var _self = this;
                var parentClass;
                var eventHandler = new Object;
                var HttpRequest = _HttpRequest;
                var hr;
                var limit_count = _limit;
                var now_count = 0;
                var nowFrame = _frame ? _frame : "bodyFrame";
                var timer;
                var sec = _time;
                var url = "";
                var method = "";
                var params = "";
                var Retryfun;
                _self.init = function() {
                    _self.clearObj()
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass
                }
                ;
                _self.loadURL = function(_url, _method, _params) {
                    url = _url;
                    method = _method;
                    params = _params;
                    hr = new HttpRequest;
                    hr.addEventListener("onError", _self.onError);
                    hr.addEventListener("onAbort", _self.onAbort);
                    hr.addEventListener("LoadComplete", _self.LoadComplete);
                    hr.loadURL(url, method, params)
                }
                ;
                _self.abort = function() {
                    try {
                        hr.abort()
                    } catch (e) {
                        console.error("[HttpRequestRetry abort Error]", e)
                    }
                }
                ;
                _self.addEventListener = function(eventname, eventFunction) {
                    Retryfun = eventFunction;
                    eventHandler[eventname] = eventFunction
                }
                ;
                _self.eventhandler = function(eventname, param) {
                    if (eventHandler[eventname])
                        eventHandler[eventname](param)
                }
                ;
                _self.onAbort = function(req) {
                    var bodyFrame = parentClass.getParentThis(nowFrame);
                    if (bodyFrame == parentClass) {
                        if (req.readyState == 4 || req.readyState == 0)
                            if (req.status == 0)
                                _self.eventhandler("onAbort", req)
                    } else {
                        _self.clearObj();
                        parentClass.dispatchEvent("clearTimer", null);
                        echo("[HttpRequestRetry]change page")
                    }
                }
                ;
                _self.onError = function(req) {
                    var bodyFrame = parentClass.getParentThis(nowFrame);
                    if (bodyFrame == parentClass) {
                        if (req.readyState == 4)
                            if (req.status == 404)
                                parentClass.dispatchEvent("bodyGoToPage", {
                                    "page": "error404"
                                });
                            else {
                                if (top["Requesterrorcount"] < limit_count)
                                    parentClass.dispatchEvent("retryLoop", {
                                        "method": method,
                                        "params": params,
                                        "fun": Retryfun,
                                        "Parentclass": parentClass,
                                        "frame": _frame
                                    });
                                else
                                    parentClass.dispatchEvent("retryLastfail");
                                top["retryonoff"] = true
                            }
                    } else {
                        _self.clearObj();
                        parentClass.dispatchEvent("clearTimer", null);
                        echo("[HttpRequestRetry]change page")
                    }
                }
                ;
                _self.LoadComplete = function(json) {
                    top["Requesterrorcount"] = 1;
                    _self.clearObj();
                    if (top["RequestRetry"] && top["retryonoff"]) {
                        parentClass.dispatchEvent("login4pwdRetryComplete");
                        top["retryonoff"] = null
                    }
                    var bodyFrame = parentClass.getParentThis(nowFrame);
                    _self.eventhandler("LoadComplete", json);
                    parentClass.dispatchEvent("retryComplete")
                }
                ;
                _self.clearObj = function() {
                    hr = null;
                    url = "";
                    method = "";
                    params = "";
                    now_count = 0;
                    clearTimeout(top["Retrytimer"])
                }
            }
            ;