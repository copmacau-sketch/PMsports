function TV(_win, _dom, _post) {
                var _self = this;
                var parentClass;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var util;
                var LS;
                var LS_code;
                var timerHash;
                var open_status = true;
                var center_tv = "";
                var token = "";
                var default_toolbar = true;
                var tv_url = win.top.m2_url;
                var playing = false;
                var video;
                var hls = null;
                var agent = win.navigator.userAgent;
                var first_reload = false;
                var _visible = false;
                var src_notsuppot = 0;
                var first_play = true;
                var eventHandler = new Object;
                var tvObj = null;
                var chkAgent = new win.check_agent(win,dom);
                var _showRight = false;
                var first_open = true;
                var videoInner;
                var config_set;
                var myhash = {};
                var perform_url = dom.location.protocol + "//perform.hgapp0001.com/perform.php?uid=" + top["userData"].uid + "&usr=" + top["userData"].username + "&from=m2" + "&ver=" + top.ver;
                var betgenius_url = dom.location.protocol + "//betgenius.hgapp0005.com/betgenius.php?uid=" + top["userData"].uid + "&usr=" + top["userData"].username + "&from=m2" + "&ver=" + top.ver;
                var iframe_timer = null;
                _self.init = function(showRight) {
                    _showRight = showRight;
                    _self.createVideo();
                    _self.showDefaultPlay();
                    videoInner = get("player").innerHTML;
                    _self.addEventListener("setErrorTV", _self.setErrorTV);
                    _self.addEventListener("srcVideo", _self.srcVideoEvent);
                    _self.addEventListener("defaultPlayProc", _self.defaultPlayProc);
                    _self.addEventListener("showAlertMsg", _self.showAlertMsg)
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    util = parentClass.getThis("util");
                    LS = parentClass.getThis("LS");
                    LS_code = parentClass.getThis("LS_code");
                    timerHash = parentClass.getThis("timerHash");
                    config_set = parentClass.getThis("config_set");
                    myhash["util"] = util;
                    myhash["LS"] = LS;
                    myhash["LS_code"] = LS_code;
                    myhash["config_set"] = config_set;
                    util.setParentclass(_self)
                }
                ;
                _self.getThis = function(varible) {
                    if (!myhash[varible]) {
                        var msg = "no myhash[" + varible + "]";
                        util.writeLog("TV", msg)
                    }
                    return myhash[varible]
                }
                ;
                _self.addEventListener = function(eventname, eventFunction) {
                    eventHandler[eventname] = eventFunction
                }
                ;
                _self.dispatchEvent = function(eventname, param) {
                    if (eventHandler[eventname])
                        eventHandler[eventname](param)
                }
                ;
                _self.showDefaultPlay = function() {
                    _self.setLoadingTV(false);
                    get("def_pic").style.display = "";
                    get("player").style.display = "none";
                    get("tv_error").style.display = "none"
                }
                ;
                _self.showVideo = function() {
                    get("def_pic").style.display = "none";
                    get("player").style.display = "";
                    get("tv_error").style.display = "none"
                }
                ;
                _self.createVideo = function() {
                    video = get("html5_player");
                    video.autoplay = true;
                    video.disablePictureInPicture = true
                }
                ;
                _self.resetVideo = function() {
                    get("player").innerHTML = videoInner;
                    _self.createVideo()
                }
                ;
                _self.setVariable = function(parObj) {
                    center_tv = parObj.center_tv;
                    token = parObj.token;
                    if (center_tv != "")
                        top.old_center_tv = center_tv;
                    if (token != "")
                        top.old_token = token;
                    if (parObj.center_tv)
                        tvObj = _self.get_tv_obj(center_tv);
                    if (tvObj)
                        tvObj.setParentclass(_self)
                }
                ;
                _self.get_tv_obj = function(center_tv) {
                    var obj = null;
                    try {
                        var obj_tv = _self.new_eval(center_tv);
                        obj = new obj_tv(win,dom)
                    } catch (e) {
                        util.err("[TV][get_tv_obj]" + center_tv, e)
                    }
                    return obj
                }
                ;
                _self.setVisible = function(isShow) {
                    get("watch_live").style.display = isShow && top.resizePage != "home" ? "" : "none";
                    _visible = isShow;
                    _self.setEvent(isShow)
                }
                ;
                _self.setEvent = function(isSet) {
                    if (isSet) {
                        util.addEvent(get("tv_start"), "click", _self.defaultPlay);
                        util.addEvent(video, "play", _self.onPlayEvent);
                        util.addEvent(video, "pause", _self.onPauseEvent);
                        util.addEvent(video, "error", _self.onErrorEvent);
                        util.addEvent(video, "loadedmetadata", _self.onloadedmetadata);
                        util.addEvent(video, "loadeddata", _self.onloadeddata);
                        util.addEvent(video, "click", _self.onClickEvent)
                    } else {
                        util.removeEvent(get("tv_start"), "click");
                        util.removeEvent(video, "play");
                        util.removeEvent(video, "pause");
                        util.removeEvent(video, "error");
                        util.removeEvent(video, "loadedmetadata");
                        util.removeEvent(video, "loadeddata");
                        util.removeEvent(video, "click")
                    }
                }
                ;
                _self.getCenterTV = function() {
                    return center_tv
                }
                ;
                _self.getEventid = function() {
                    return token
                }
                ;
                _self.setOpen = function(isOpen) {
                    if (isOpen)
                        _self.showDefaultPlay();
                    else if (first_open) {
                        _self.setLoadingTV(false);
                        first_open = false
                    } else
                        setTimeout(_self.closeLoadingTV, 1E3)
                }
                ;
                _self.closeLoadingTV = function(isShow) {
                    if (top.rightRB == "N")
                        get("tv_loading").style.display = "none"
                }
                ;
                _self.onClickEvent = function() {
                    parentClass.dispatchEvent("videoOnClick", null)
                }
                ;
                _self.onPlayEvent = function() {
                    if (!playing) {
                        _self.pause();
                        video.src = "";
                        return
                    }
                    echo("\u2587\u2586\u2585\u2582on play");
                    if (open_status) {
                        _self.showVideo();
                        _self.setLoadingTV(false)
                    }
                    first_play = false
                }
                ;
                _self.onPauseEvent = function() {
                    echo("\u2587\u2586\u2585\u2582on pause")
                }
                ;
                _self.onErrorEvent = function(e) {
                    echo("on error: open_status=" + open_status + ",playing=" + playing);
                    if (open_status && playing) {
                        var msg = "";
                        var logmsg = "";
                        switch (e.target.error.code) {
                        case 1:
                            msg = "MEDIA_ERR_ABORTED";
                            logmsg = msg;
                            echo("\u60a8\u4e2d\u6b62\u4e86\u8996\u983b\u64ad\u653e You aborted the video playback");
                            src_notsuppot = 0;
                            break;
                        case 2:
                            msg = "MEDIA_ERR_NETWORK";
                            logmsg = msg;
                            echo("\u7db2\u7d61\u932f\u8aa4\u5c0e\u81f4\u8996\u983b\u4e0b\u8f09\u5931\u6557 A network error caused the video download to fail part-way");
                            src_notsuppot = 0;
                            break;
                        case 3:
                            logmsg = "MEDIA_ERR_DECODE";
                            src_notsuppot = 0;
                            echo("\u7531\u65bc\u640d\u58de\u554f\u984c\u6216\u7531\u65bc\u700f\u89bd\u5668\u4e0d\u652f\u6301\u7684\u8996\u983b\u4f7f\u7528\u529f\u80fd\uff0c\u8996\u983b\u64ad\u653e\u5df2\u4e2d\u6b62 The video playback was aborted due to a corruption problem or because the video used features your browser did not support");
                            _self.loadUrl();
                            break;
                        case 4:
                            logmsg = "MEDIA_ERR_SRC_NOT_SUPPORTED";
                            src_notsuppot++;
                            echo("\u8996\u983b\u7121\u6cd5\u52a0\u8f09\uff0c\u56e0\u70ba\u4f3a\u670d\u5668\u6216\u7db2\u7d61\u5931\u6557\u6216\u56e0\u683c\u5f0f\u4e0d\u652f\u63f4 The video could not be loaded, either because the server or network failed or because the format is not supported");
                            echo("src_notsuppot=" + src_notsuppot);
                            if (src_notsuppot < 3)
                                _self.loadUrl();
                            else {
                                _self.setLoadingTV(false);
                                get("def_pic").style.display = ""
                            }
                            break;
                        default:
                            msg = "An unknown error occurred";
                            logmsg = msg;
                            src_notsuppot = 0;
                            break
                        }
                        if (msg != "")
                            _self.setErrorTV(msg)
                    }
                }
                ;
                _self.onloadedmetadata = function() {
                    if (chkAgent.isIPad(agent))
                        _self.readyToPlay()
                }
                ;
                _self.onloadeddata = function() {
                    _self.readyToPlay()
                }
                ;
                _self.readyToPlay = function() {
                    echo("ready to play: open_status=" + open_status + ",playing=" + playing);
                    if (open_status && playing) {
                        _self.showVideo();
                        _self.setLoadingTV(false)
                    }
                }
                ;
                _self.testF = function() {
                    return parentClass
                }
                ;
                _self.defaultPlay = function(evt) {
                    top["pageTS"]["rightTV"] = util.getTimestamp();
                    _self.setLoadingTV(true);
                    get("def_pic").style.display = "none";
                    playing = true;
                    if (center_tv == "perform" || center_tv == "betgenius") {
                        var hasLoad = center_tv == "perform" ? top.load_perform : top.load_betgenius;
                        if (hasLoad)
                            _self.defaultPlayProc();
                        else {
                            _self.initFrame();
                            console.log("[defaultPlay]wait for load iframe")
                        }
                    } else
                        _self.defaultPlayProc()
                }
                ;
                _self.initFrame = function() {
                    var hasLoad = center_tv == "perform" ? top.load_perform : top.load_betgenius;
                    if (!hasLoad) {
                        if (dom.getElementById(center_tv + "_ifr") == null) {
                            var ifr = dom.createElement("iframe");
                            ifr.id = center_tv + "_ifr";
                            ifr.style.display = "none";
                            dom.body.appendChild(ifr)
                        }
                        _self.srcFrame()
                    }
                }
                ;
                _self.checkFrame = function() {
                    _self.clearFrameTimer();
                    var hasLoad = center_tv == "perform" ? top.load_perform : top.load_betgenius;
                    if (hasLoad)
                        console.log("[checkFrame]load iframe compelete");
                    else
                        parentClass.dispatchEvent("showAlertMsg", {
                            "target": "C_alert_ok",
                            "msg": LS.get("connect_retry"),
                            "retFun": _self.srcFrame
                        })
                }
                ;
                _self.srcFrame = function() {
                    dom.getElementById(center_tv + "_ifr").src = center_tv == "perform" ? perform_url : betgenius_url;
                    _self.createFrameTimer()
                }
                ;
                _self.onMessage = function(event) {
                    var msg = event.data.split(",");
                    var code = msg[0];
                    var performObj = new Object;
                    switch (code) {
                    case "init":
                        if (center_tv == "perform")
                            top.load_perform = true;
                        if (center_tv == "betgenius")
                            top.load_betgenius = true;
                        if (_self.getPlaying())
                            _self.defaultPlayProc();
                        break;
                    case "play":
                        performObj["hls"] = msg[1];
                        _self.srcVideo(performObj);
                        break;
                    case "error":
                        performObj["msg"] = msg[1];
                        _self.setErrorTV(performObj);
                        break
                    }
                }
                ;
                _self.createFrameTimer = function() {
                    var ret = _self.clearFrameTimer();
                    if (ret) {
                        if (timerHash["FrameTimer"] != null)
                            return;
                        timerHash["FrameTimer"] = new Timer(1E4);
                        timerHash["FrameTimer"].setParentclass(_self);
                        timerHash["FrameTimer"].init();
                        timerHash["FrameTimer"].addEventListener("TimerEvent.TIMER", _self.checkFrame);
                        timerHash["FrameTimer"].startTimer()
                    }
                }
                ;
                _self.startFrameTimer = function() {
                    if (timerHash["FrameTimer"] == null)
                        return;
                    timerHash["FrameTimer"].startTimer()
                }
                ;
                _self.clearFrameTimer = function() {
                    if (timerHash != null)
                        if (timerHash["FrameTimer"] != null) {
                            timerHash["FrameTimer"].clearObj();
                            timerHash["FrameTimer"].is_clear = true;
                            timerHash["FrameTimer"] = null
                        }
                    return true
                }
                ;
                _self.defaultPlayProc = function() {
                    _self.pause();
                    _self.loadUrl()
                }
                ;
                _self.loadUrl = function() {
                    tvObj.load(token)
                }
                ;
                _self.srcVideoEvent = function(param) {
                    _self.srcVideo(param)
                }
                ;
                _self.srcVideo = function(param) {
                    video.style.display = "";
                    if (win.Hls.isSupported()) {
                        if (hls) {
                            hls.stopLoad();
                            hls.detachMedia();
                            hls.destroy();
                            hls = null;
                            echo("[TV][scrVideo]destroy")
                        }
                        hls = new Hls;
                        hls.attachMedia(video);
                        hls.loadSource(param.hls);
                        _self.play();
                        echo("[TV][scrVideo]loadSource")
                    } else {
                        video.src = param.hls;
                        _self.play()
                    }
                }
                ;
                _self.play = function() {
                    echo("\u2587\u2586\u2585\u2582play");
                    if (video != null) {
                        _self.pause();
                        video.autoplay = true;
                        video.controls = default_toolbar;
                        video.play();
                        echo("[video]", video);
                        _self.removeErrorTV()
                    }
                }
                ;
                _self.pause = function() {
                    echo("\u2587\u2586\u2585\u2582pause");
                    if (video != null)
                        if (win.Hls.isSupported()) {
                            if (hls)
                                hls.stopLoad()
                        } else
                            video.pause()
                }
                ;
                _self.destroy = function() {
                    echo("\u2587\u2586\u2585\u2582clearTV start");
                    _self.pause();
                    if (video)
                        video.src = "";
                    _self.setEvent(false);
                    center_tv = "";
                    token = "";
                    get("player").innerHTML = "";
                    if (hls) {
                        hls.stopLoad();
                        hls.detachMedia();
                        hls.destroy();
                        hls = null
                    }
                    echo("\u2587\u2586\u2585\u2582clearTV end");
                    try {
                        tvObj.clearTV()
                    } catch (e) {}
                    return true
                }
                ;
                _self.clearTV = function() {
                    echo("\u2587\u2586\u2585\u2582clearTV start");
                    _self.pause();
                    if (video)
                        video.src = "";
                    _self.setEvent(false);
                    center_tv = "";
                    token = "";
                    playing = false;
                    get("player").innerHTML = "";
                    if (hls) {
                        hls.stopLoad();
                        hls.detachMedia();
                        hls.destroy();
                        hls = null
                    }
                    echo("\u2587\u2586\u2585\u2582clearTV end");
                    try {
                        tvObj.clearTV()
                    } catch (e) {}
                    return true
                }
                ;
                _self.openEvent = function(isRBorRP) {
                    if (isRBorRP == null || isRBorRP == undefined)
                        isRBorRP = true;
                    if (!playing)
                        _self.setOpen(isRBorRP);
                    else
                        _self.defaultPlay()
                }
                ;
                _self.closeEvent = function(evt) {
                    _self.pause();
                    video.src = "";
                    _self.setOpen(false);
                    playing = false
                }
                ;
                _self.getPlaying = function() {
                    return playing
                }
                ;
                _self.setLoadingTV = function(isShow) {
                    get("tv_loading").style.display = isShow ? "" : "none"
                }
                ;
                function get(_id) {
                    if (_showRight)
                        _id = "R_" + _id;
                    return dom.getElementById(_id)
                }
                _self.setErrorTV = function(param) {
                    _self.resetVideo();
                    if (param.msg != LS.get("event_not_start")) {
                        util.addClass(get("tv_error"), "live");
                        get("tv_error_msg").innerHTML = LS.get("event_TV_error");
                      //  get("tv_error_data").innerHTML = "[" + param.msg + "]";
                        util.err("[TV][setErrorTV]" + param.msg, param.e)
                    } else {
                        util.removeClass(get("tv_error"), "live");
                        get("tv_error_msg").innerHTML = param.msg;
                        get("tv_error_data").innerHTML = ""
                    }
                    get("tv_error").style.display = "";
                    get("def_pic").style.display = "none";
                    if (param.closeLoading != "N")
                        _self.setLoadingTV(false)
                }
                ;
                _self.removeErrorTV = function() {
                    get("tv_error_msg").innerHTML = "";
                    get("tv_error_data").innerHTML = "";
                    get("tv_error").style.display = "none";
                    get("player").style.display = "";
                    _self.setLoadingTV(false)
                }
                ;
                _self.chkExist = function() {
                    return video != null
                }
                ;
                _self.setHasRightPanel = function() {
                    _showRight = true
                }
                ;
                _self.showAlertMsg = function(param) {
                    parentClass.dispatchEvent("showAlertMsg", param)
                }
                ;
                _self.isSafari = function() {
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.indexOf("safari") != -1)
                        if (ua.indexOf("chrome") > -1)
                            return false;
                        else
                            return true
                }
                ;
                _self.new_eval = function(str) {
                    var fn = Function;
                    return (new fn("return " + str))()
                }
            }
            ;