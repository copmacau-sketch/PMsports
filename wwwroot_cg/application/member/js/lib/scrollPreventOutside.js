function scrollPreventOutside() {
                var _self = this;
                var ts = new Object;
                var _target;
                _self.init = function(_name) {
                    _target = document.getElementById(_name);
                    _target.addEventListener("touchstart", _self.bodyScroll);
                    _target.addEventListener("touchmove", _self.bodyScroll)
                }
                ;
                _self.remove = function() {
                    _target.removeEventListener("touchstart", _self.bodyScroll);
                    _target.removeEventListener("touchmove", _self.bodyScroll)
                }
                ;
                _self.bodyScroll = function(e) {
                    _self.listenEvent(e, document.getElementById(e.target.id))
                }
                ;
                _self.touchObject = function(targetObject, eventObject) {
                    try {
                        var allobj = targetObject.getElementsByTagName("*");
                        if (allobj.length == 0)
                            return true;
                        for (var i = 0; i < allobj.length; i++)
                            if (allobj[i] == eventObject)
                                return true
                    } catch (e) {
                        return false
                    }
                    return true
                }
                ;
                _self.listenEvent = function(e, targetObject) {
                    var touch = e.targetTouches[0];
                    if (e.type == "touchstart") {
                        ts.x = touch.pageX;
                        ts.y = touch.pageY
                    }
                    if (!_self.touchObject(targetObject, e.target)) {
                        if (e.target.id != "")
                            _self.stopBodyDefaultEvent(e)
                    } else {
                        if (targetObject.scrollTop == 0)
                            if (ts.y - touch.pageY < 0)
                                if (e.type == "touchmove")
                                    _self.stopBodyDefaultEvent(e);
                        if (targetObject.scrollTop + targetObject.clientHeight == targetObject.scrollHeight)
                            if (ts.y - touch.pageY > 0)
                                if (e.type == "touchmove")
                                    _self.stopBodyDefaultEvent(e)
                    }
                }
                ;
                _self.stopBodyDefaultEvent = function(e) {
                    e.preventDefault();
                    e.stopPropagation()
                }
            }
            ;