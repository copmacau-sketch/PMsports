function perform(_win, _dom, _post) {
                var _self = this;
                var classname = "perform";
                var parentClass;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var util;
                var LS;
                var perform_url = dom.location.protocol + "//perform.hgapp0002.com/perform.php?uid=" + top["userData"].uid + "&usr=" + top["userData"].username + "&from=m2" + "&ver=" + top.ver;
                var perform_timer = null;
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
                    hr.addEventListener("onError", _self.onError);
                    hr.addEventListener("LoadComplete", _self.loadComplete);
                    hr.loadURL(top.m2_url, "POST", par)
                }
                ;
                _self.loadComplete = function(xml) {
                    var perform_v2 = _self.getOauthTokenComplete(xml);
                    if (!perform_v2)
                        _self.loadUrlComplete(xml)
                }
                ;
                _self.loadUrlComplete = function(xml) {
                    echo("[" + classname + "][loadComplete]");
                    echo(xml);
                    var tmpXml = xml.split("|");
                    var tmpWidth = tmpXml[1];
                    var xmlData = tmpXml[0];
                    echo(">>>>>[now]:" + top.nowWidth + "===[tmp]:" + tmpWidth);
                    if (tmpWidth != top.nowWidth)
                        return;
                    var tmpTS = tmpXml[2];
                    if (!tmpTS)
                        tmpTS = "";
                    if (!util.checkTS(top["pageTS"]["rightTV"], tmpTS, classname))
                        return;
                    var xmlnode;
                    try {
                        xmlnode = util.parseXml(xmlData)
                    } catch (e) {
                        var errorMsg = util.showConnectMsg(xml);
                        if (util.alertConnectMsg(errorMsg))
                            return;
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": xml,
                            "e": e
                        });
                        return
                    }
                    var xmlnodeRoot = xmlnode.Root[0];
                    var code = xmlnode.Node(xmlnodeRoot, "code").innerHTML;
                    echo(code);
                    if (code == "error") {
                        var msg = xmlnode.Node(xmlnodeRoot, "msg").innerHTML;
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": msg
                        });
                        return
                    }
                    var availableMediaFormats = xmlnode.Node(xmlnodeRoot, "availableMediaFormats");
                    var mediaFormat = xmlnode.Node(xmlnodeRoot, "mediaFormat", false);
                    var mediaHash = new Object;
                    var mObj = null;
                    for (var i = 0; i < mediaFormat.length; i++) {
                        var playerAlias = xmlnode.Node(mediaFormat[i], "playerAlias");
                        mediaHash[playerAlias.innerHTML] = mediaFormat[i]
                    }
                    var aliasAry = new Array("hlsmed","hlslo","iPhonewabsec","iPhonewab");
                    for (var a = 0; a < aliasAry.length; a++)
                        if (mediaHash[aliasAry[a]] != null) {
                            mObj = mediaHash[aliasAry[a]];
                            break
                        }
                    if (mObj == null)
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": "not support mobile format"
                        });
                    else {
                        var stream = xmlnode.Node(mObj, "stream");
                        var streamLaunchCode = xmlnode.Node(stream, "streamLaunchCode");
                        var content = streamLaunchCode.innerHTML;
                        var s_tag = content.indexOf("http");
                        var e_tag = content.indexOf("]]");
                        var hls = content.substring(s_tag, e_tag);
                        parentClass.dispatchEvent("srcVideo", {
                            "hls": hls
                        })
                    }
                }
                ;
                _self.onError = function() {
                    parentClass.dispatchEvent("setErrorTV", {
                        "msg": "connect fail"
                    })
                }
                ;
                _self.initPerform = function() {
                    win.addEventListener("message", _self.onMessage, false);
                    if (!top.load_perform) {
                        if (dom.getElementById("perform_ifr") == null) {
                            var ifr = dom.createElement("iframe");
                            ifr.id = "perform_ifr";
                            ifr.style.display = "none";
                            dom.body.appendChild(ifr)
                        }
                        _self.srcPerform()
                    }
                }
                ;
                _self.checkPerform = function() {
                    clearTimeout(perform_timer);
                    if (top.load_perform)
                        echo("[checkPerform]load perform compelete");
                    else
                        parentClass.dispatchEvent("showAlertMsg", {
                            "target": "C_alert_ok",
                            "msg": LS.get("connect_retry"),
                            "retFun": _self.srcPerform
                        })
                }
                ;
                _self.srcPerform = function() {
                    dom.getElementById("perform_ifr").src = perform_url;
                    clearTimeout(perform_timer);
                    perform_timer = setTimeout(_self.checkPerform, 1E4)
                }
                ;
                _self.onMessage = function(event) {
                    echo(getTime() + "[main][onMessage][" + parentClass.getPlaying() + "]" + event.data);
                    var msg = event.data.split(",");
                    var code = msg[0];
                    switch (code) {
                    case "init":
                        top.load_perform = true;
                        clearTimeout(perform_timer);
                        if (parentClass.getPlaying()) {
                            echo("perform iframe loaded > defaultPlayProc");
                            _self.load(token)
                        }
                        break;
                    case "play":
                        parentClass.dispatchEvent("srcVideo", {
                            "hls": msg[1]
                        });
                        break;
                    case "error":
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": msg[1]
                        });
                        break
                    }
                }
                ;
                var pingTimer = null;
                var createPingTimer = function() {
                    pingTimer = setInterval(_self.sendMsg, 1E3, "ping,request")
                };
                var stopPingTimer = function() {
                    clearInterval(pingTimer)
                };
                var getTime = function() {
                    return "[" + (new Date).toString().substring(16, 24) + "]"
                };
                _self.sendMsg = function(msg) {
                    echo(getTime() + "[main][sendMsg][" + parentClass.getPlaying() + "]", msg);
                    if (top.load_perform)
                        dom.getElementById("perform_ifr").contentWindow.postMessage(msg, "*");
                    else {
                        console.error("load perform fail");
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": "load perform fail"
                        })
                    }
                }
                ;
                _self.getOauthTokenComplete = function(jsonstr) {
                    var hash;
                    try {
                        hash = JSON.parse(jsonstr);
                        var tmpWidth = hash["nowWidth"];
                        echo(">>>>>[now]:" + top.nowWidth + "===[tmp]:" + tmpWidth);
                        if (tmpWidth != top.nowWidth)
                            return;
                        var tmpTS = hash["ts"];
                        if (!tmpTS)
                            tmpTS = "";
                        if (!util.checkTS(top["pageTS"]["rightTV"], tmpTS, classname))
                            return;
                        echo(hash, "[getOauthTokenComplete]");
                        if (hash["data"]["errorCode"])
                            parentClass.dispatchEvent("setErrorTV", {
                                "msg": hash["data"]["errorCode"]
                            });
                        else if (top.load_perform)
                            _self.getLiveStream(hash);
                        else
                            echo("wait for load perform iframe");
                        return true
                    } catch (e) {
                        return false
                    }
                }
                ;
                _self.getLiveStream = function(hash) {
                    var streamid = hash["streamid"];
                    if (streamid) {
                        var data = hash["data"];
                        var access_token = data["access_token"];
                        echo(data, "[getLiveStream]");
                        if (access_token)
                            _self.sendMsg("gethls," + streamid + "," + access_token + "," + top["userData"].mid);
                        else
                            parentClass.dispatchEvent("setErrorTV", {
                                "msg": "no access token"
                            })
                    } else
                        parentClass.dispatchEvent("setErrorTV", {
                            "msg": "no streamid"
                        })
                }
                ;
                _self.clearTV = function() {
                    echo("[perform]clearTV");
                    win.removeEventListener("message", _self.onMessage, false)
                }
            }
            ;