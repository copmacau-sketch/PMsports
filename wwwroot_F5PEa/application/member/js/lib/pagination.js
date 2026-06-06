function pagination(_win, _dom) {
                var _self = this;
                var win = _win;
                var dom = _dom;
                var parentClass;
                var classname = "pagination";
                var util = new win.Util(win,dom);
                var config_set;
                var pageDiv, pageBtnLimit, _total, TOTALPAGE;
                var nowPageAry = new Array;
                var model = "";
                var nowPage = 1;
                var chgPageFunc = null;
                _self.init = function() {
                    pageDiv = dom.getElementById("pageDiv");
                    TOTALPAGE = config_set.get("PAGE_SETTING_MORE");
                    pageBtnLimit = config_set.get("PAGE_SETTING_MORE");
                    _self.initBtn()
                }
                ;
                _self.setParentclass = function(_parentclass) {
                    parentClass = _parentclass;
                    config_set = parentClass.getThis("config_set")
                }
                ;
                _self.initBtn = function() {
                    var pageModel = dom.getElementById("page_model");
                    var tmpPage = "";
                    for (var i = 1; i <= pageBtnLimit; i++) {
                        nowPageAry.push(i);
                        var btnModel = dom.getElementById("pageBtn_model").innerHTML;
                        btnModel = btnModel.replace(/\*PAGENUM\*/gi, i);
                        tmpPage += btnModel
                    }
                    pageModel.innerHTML = pageModel.innerHTML.replace(/\*PAGES\*/gi, tmpPage);
                    pageDiv.innerHTML = pageModel.innerHTML
                }
                ;
                _self.bindBtn = function(_func) {
                    chgPageFunc = _func;
                    var pg_prev = dom.getElementById("pg_prev");
                    var pg_first = dom.getElementById("pg_first");
                    var pg_next = dom.getElementById("pg_next");
                    util.addEvent(pg_prev, "click", chgPageFunc, {
                        "key": "prev"
                    });
                    util.addEvent(pg_first, "click", chgPageFunc, {
                        "key": "first",
                        "val": 1
                    });
                    util.addEvent(pg_next, "click", chgPageFunc, {
                        "key": "next"
                    })
                }
                ;
                _self.updateTotal = function(_new) {
                    _total = _new
                }
                ;
                _self.chgStyle = function(_style) {
                    pageDiv.className = "box_page";
                    model = _style;
                    switch (model) {
                    case "page_3":
                        pageBtnLimit = config_set.get("PAGE_SETTING_LESS");
                        break;
                    case "page_5":
                        pageBtnLimit = config_set.get("PAGE_SETTING_MORE");
                        break
                    }
                    if (model == "page_5" && _total < 5)
                        _style = "page_4";
                    if (_total < 3)
                        _style = "page_2";
                    util.addClass(pageDiv, _style)
                }
                ;
                _self.showPageDiv = function(isShow) {
                    pageDiv.style.display = isShow ? "" : "none"
                }
                ;
                _self.setBright = function(_num, resize) {
                    if (_num * 1 > _total * 1)
                        _num = _total;
                    _self.initBtnColor();
                    _self.checkPageNum(_num, resize);
                    var _key = nowPageAry.indexOf(_num);
                    if (_key == -1)
                        _key = nowPageAry.length - 1;
                    var _page = null;
                    if (model == "page_5") {
                        var tmpPage = _key + 1 > _total ? pageBtnLimit : _key + 1;
                        _page = dom.getElementById("pg_" + tmpPage);
                        nowPage = tmpPage
                    } else {
                        switch (_key) {
                        case 0:
                            _page = dom.getElementById("pg_2");
                            break;
                        case 1:
                            _page = dom.getElementById("pg_3");
                            break;
                        case 2:
                            _page = dom.getElementById("pg_4");
                            break
                        }
                        nowPage = _key + 1
                    }
                    _page.className = "btn_page";
                    util.addClass(_page, "on");
                    var pg_prev = dom.getElementById("pg_prev");
                    var pg_first = dom.getElementById("pg_first");
                    var pg_next = dom.getElementById("pg_next");
                    if (_num == 1) {
                        util.addClass(pg_prev, "off");
                        util.addClass(pg_first, "off")
                    } else if (_num == _total)
                        util.addClass(pg_next, "off")
                }
                ;
                _self.initBtnColor = function() {
                    for (var i = 1; i <= 5; i++) {
                        var _page = dom.getElementById("pg_" + i);
                        _page.className = "btn_page"
                    }
                    var pg_prev = dom.getElementById("pg_prev");
                    var pg_first = dom.getElementById("pg_first");
                    var pg_next = dom.getElementById("pg_next");
                    pg_prev.className = "btn_page_arr";
                    pg_first.className = "btn_page_arr";
                    pg_next.className = "btn_page_arr"
                }
                ;
                _self.checkPageNum = function(_num, resize) {
                    var _key = nowPageAry.indexOf(_num);
                    var addPage = _key == nowPage;
                    var midNum = Math.ceil(pageBtnLimit / 2);
                    var scope = model == "page_5" ? 2 : 1;
                    _num = _num * 1;
                    _total = _total * 1;
                    if (model == "page_3" && _num != _total) {
                        if (addPage && _num == nowPageAry[midNum] || !addPage && _num == nowPageAry[0] && _num - scope != 0 || !addPage && nowPageAry.length != pageBtnLimit && _key == nowPageAry.length - 1 || !addPage && _key != -1 && _num != _total - 1 && _num != 1 || resize && _num != 1) {
                            nowPageAry = new Array;
                            for (var i = _num - scope; i <= _num + scope; i++)
                                if (i <= _total && i > 0)
                                    nowPageAry.push(i)
                        } else if (nowPageAry.length != pageBtnLimit && _num != nowPageAry[midNum] || _num == 1) {
                            nowPageAry = new Array;
                            for (var i = _num; i <= _num + pageBtnLimit - 1; i++)
                                if (i <= _total && i > 0)
                                    nowPageAry.push(i)
                        }
                        _self.reDraw()
                    } else if (model == "page_5" && _num != _total && _total >= 3 || model == "page_5" && _total < 3 || resize) {
                        if (resize && _num == _total) {
                            var minor = pageBtnLimit - 1;
                            var start = _num - minor <= 0 ? 1 : _num - minor;
                            nowPageAry = new Array;
                            var end = start + minor;
                            for (var i = start; i <= end; i++)
                                if (i <= _total && i > 0)
                                    nowPageAry.push(i)
                        } else if (addPage && _num == nowPageAry[midNum] && _num != _total - 1 && nowPageAry.length == pageBtnLimit || !addPage && _num == nowPageAry[midNum - 2] && _num - scope != 0 && nowPageAry.length == pageBtnLimit || !addPage && _key != -1 && _num != 1 && _num != 2 && _num != _total - 1) {
                            nowPageAry = new Array;
                            for (var i = _num - scope; i <= _num + scope; i++)
                                if (i <= _total && i > 0)
                                    nowPageAry.push(i)
                        } else if (nowPageAry.length != pageBtnLimit && _num != nowPageAry[midNum] && nowPageAry.length == pageBtnLimit || _num == 1) {
                            nowPageAry = new Array;
                            var start = _num != 1 ? _num - 1 : _num;
                            for (var i = start; i <= _num + pageBtnLimit - 1; i++)
                                if (i <= _total && i > 0)
                                    nowPageAry.push(i)
                        } else if (!addPage && _key != -1 && (_num == 2 || _num == _total - 1)) {
                            nowPageAry = new Array;
                            var start = _num == 2 ? 1 : _total - pageBtnLimit + 1;
                            var end = _num == 2 ? pageBtnLimit : _total;
                            for (var i = start; i <= end; i++)
                                if (i <= _total && i > 0)
                                    nowPageAry.push(i)
                        }
                        _self.reDraw()
                    } else if (_key == -1 || _key != -1 && _num == _total) {
                        var minor = pageBtnLimit - 1;
                        var start = _num - minor < 0 ? 1 : _num - minor;
                        nowPageAry = new Array;
                        for (var i = start; i <= _num; i++)
                            if (i <= _total && i > 0)
                                nowPageAry.push(i);
                        _self.reDraw()
                    }
                }
                ;
                _self.reDraw = function() {
                    if (model == "page_5")
                        for (var i = 0; i < pageBtnLimit; i++) {
                            var obj = dom.getElementById("pg_" + (i + 1));
                            obj.innerHTML = nowPageAry[i] ? nowPageAry[i] : "";
                            util.addEvent(obj, "click", chgPageFunc, {
                                "key": "spec",
                                "val": nowPageAry[i]
                            })
                        }
                    else {
                        var obj_first = dom.getElementById("pg_1");
                        var obj_last = dom.getElementById("pg_" + TOTALPAGE);
                        obj_first.innerHTML = "";
                        obj_last.innerHTML = "";
                        var ind = 2;
                        for (var i = 0; i < nowPageAry.length; i++) {
                            var obj = dom.getElementById("pg_" + ind);
                            if (obj)
                                obj.innerHTML = nowPageAry[i];
                            ind++;
                            util.addEvent(obj, "click", chgPageFunc, {
                                "key": "spec",
                                "val": nowPageAry[i]
                            })
                        }
                        if (nowPageAry.length < pageBtnLimit) {
                            var tmpobj = dom.getElementById("pg_" + (TOTALPAGE * 1 - 1));
                            tmpobj.innerHTML = ""
                        }
                    }
                }
            }
            ;