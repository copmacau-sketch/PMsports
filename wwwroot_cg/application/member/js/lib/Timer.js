function Timer(_frequency, _count) {
                var _self = this;
                var parentclass;
                var frequency = _frequency;
                var init_count = _count;
                var count;
                var timerObj;
                var eventArr = new Array;
                var running = false;
                _self.dont_clear = false;
                _self.init = function() {
                    if (frequency == undefined)
                        return;
                    _self.addEventListener("TimerEvent.TIMER", _self.TIMER);
                    _self.addEventListener("TimerEvent.TIMER_COMPLETE", _self.TIMER_COMPLETE)
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
                _self.setPrivate = function(varible, val) {
                    eval(varible + "='" + val + "'")
                }
                ;
                _self.addEventListener = function(funName, eventHandler) {
                    eventArr[funName] = eventHandler
                }
                ;
                _self.removeEventListener = function(funName) {
                    eventArr[funName] = null
                }
                ;
                _self.startTimer = function() {
                    if (!running) {
                        running = true;
                        count = init_count;
                        timerObj = setInterval(_self.run, frequency)
                    }
                }
                ;
                _self.stopTimer = function() {
                    if (running) {
                        clearInterval(timerObj);
                        running = false
                    }
                }
                ;
                _self.run = function() {
                    if (count != null)
                        count--;
                    if (count > 0 || count == null)
                        eventArr["TimerEvent.TIMER"](count);
                    else {
                        eventArr["TimerEvent.TIMER_COMPLETE"](count);
                        _self.stopTimer()
                    }
                }
                ;
                _self.isRunning = function() {
                    return running
                }
                ;
                _self.TIMER = function() {
                    alert("run")
                }
                ;
                _self.TIMER_COMPLETE = function() {
                    alert("finish")
                }
                ;
                _self.clearObj = function() {
                    _self.stopTimer();
                    _self.removeEventListener("TimerEvent.TIMER");
                    _self.removeEventListener("TimerEvent.TIMER_COMPLETE");
                    timerObj = null;
                    frequency = 0;
                    count = 0
                }
                ;
                _self.init()
            }
            ;