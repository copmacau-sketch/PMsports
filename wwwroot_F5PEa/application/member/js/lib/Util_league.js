 function Util_league(_win, _dom) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var parentClass;
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
                _self.checkLastPage = function(choice_date, postHash, lastPage) {
                    var choiceDate = choice_date.toString();
                    var ret = choiceDate;
                    var last_showtype = "";
                    var defDate = "all";
                    var d = isNaN(choiceDate) ? 0 : parseInt(choiceDate);
                    try {
                        last_showtype = lastPage.state.showtype || ""
                    } catch (e) {}
                    if (postHash["showtype"] == "today")
                        ret = "0";
                    else if (!last_showtype.match(/early|parlay/))
                        ret = defDate;
                    else if (postHash["showtype"] == "early") {
                        if (!choiceDate.match(/all|future/) && (d < 1 || d > 7))
                            ret = defDate
                    } else if (postHash["showtype"] == "parlay")
                        if (!choiceDate.match(/all|0|future/) && (d < 1 || d > 6))
                            ret = defDate;
                    return ret
                }
            }
            ;