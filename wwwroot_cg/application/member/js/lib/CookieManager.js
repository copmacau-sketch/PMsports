function CookieManager() {
                var _self = this;
                var _domain = document.domain;
                var MainDomain = getDomain(_domain);
                _self.set = function(cname, cvalue, exdays, path) {
                    exdays = exdays || 30;
                    path = path || "/";
                    var d = new Date;
                    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1E3);
                    var expires = "expires=" + d.toUTCString();
                    var paths = "path=" + path;
                    if (top.cookieEncode_sw == "Y")
                        try {
                            document.cookie = cname + "=" + btoa(cvalue) + "; " + expires + "; " + paths + "; " + MainDomain
                        } catch (e) {
                            console.log(e);
                            document.cookie = cname + "='';" + expires + "; " + paths + "; " + MainDomain
                        }
                    else
                        document.cookie = cname + "=" + cvalue + "; " + expires + "; " + paths + "; " + MainDomain
                }
                ;
                _self.get = function(cname) {
                    var name = cname + "=";
                    var ca = document.cookie.split(";");
                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == " ")
                            c = c.substring(1);
                        if (c.indexOf(name) == 0) {
                            var tmp_val = c.substring(name.length, c.length);
                            if (top.cookieEncode_sw == "Y")
                                try {
                                    return atob(tmp_val)
                                } catch (e) {
                                    console.log("[", cname, "]=>", e);
                                    return ""
                                }
                            else
                                return tmp_val
                        }
                    }
                    return undefined
                }
                ;
                _self.del = function(cname) {
                    var d = new Date;
                    d.setTime(d.getTime() - 1);
                    var cookieVal = _self.get(cname);
                    if (cookieVal != null)
                        document.cookie = cname + "=" + cookieVal + ";expires=" + d.toGMTString() + "; " + MainDomain
                }
                ;
                function getDomain(_domain) {
                    var domainAry = _domain.split(".");
                    var ret = "";
                    switch (domainAry.length) {
                    case 2:
                        ret = "domain=.";
                        ret += _domain;
                        break;
                    case 3:
                        ret = "domain=.";
                        domainAry.shift();
                        ret += domainAry.join(".");
                        break;
                    default:
                        ret = _domain;
                        break
                    }
                    return ret
                }
            }
            ;