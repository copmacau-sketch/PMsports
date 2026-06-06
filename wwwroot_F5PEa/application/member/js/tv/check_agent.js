function check_agent(_win, _dom, _post) {
                var _self = this;
                var parentclass;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                _self.init = function() {}
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass
                }
                ;
                _self.getThis = function(varible) {
                    return eval(varible)
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
                _self.checkNoReady = function(agent) {
                    if (agent.indexOf("LT26ii") != -1 && agent.indexOf("Android") != -1)
                        return true;
                    if (_self.isNote2_S3())
                        return true;
                    return false
                }
                ;
                _self.isNote2_S3 = function(agent) {
                    if (agent.indexOf("GT-I9300") != -1 && agent.indexOf("Android") != -1)
                        return true;
                    if (agent.indexOf("GT-N7100") != -1 && agent.indexOf("Android") != -1)
                        return true;
                    return false
                }
                ;
                _self.isNote2_S3_Sony_UC = function(agent) {
                    if ((agent.indexOf("GT-N7100") != -1 || agent.indexOf("GT-I9300") != -1 || agent.indexOf("LT26ii") != -1 || agent.indexOf("UCBrowser") != -1) && agent.indexOf("Android") != -1)
                        return true;
                    return false
                }
                ;
                _self.isMI_def_Browser = function(agent) {
                    if (agent.indexOf("MI") != -1 && agent.indexOf("MiuiBrowser") != -1 && agent.indexOf("Android") != -1)
                        return true;
                    return false
                }
                ;
                _self.isIPad = function(agent) {
                    return agent.indexOf("iPad") != -1
                }
                ;
                _self.isUCBrowser = function(agent) {
                    return agent.indexOf("UCBrowser") != -1
                }
            }
            ;