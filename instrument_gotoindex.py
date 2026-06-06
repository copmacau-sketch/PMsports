#!/usr/bin/env python3
"""Instrument goToIndex to capture redirect cause"""

path = "/home/ubuntu/crown-gold/wwwroot_F5PEa/application/member/js/Util.js"
with open(path, "r") as f:
    c = f.read()

with open(path + ".bak_dbg", "w") as f:
    f.write(c)

old = "_self.goToIndex = function() {\n                    _self.topGoToUrl(_self.getWebUrl())\n                }"
new = """_self.goToIndex = function() {
                    try {
                        var stk = (new Error()).stack || 'no-stack';
                        document.title = 'REDIRECT: ' + stk.substring(0, 400);
                        if (window.sessionStorage) sessionStorage.setItem('__redirectStack', stk);
                    } catch(e) {}
                    _self.topGoToUrl(_self.getWebUrl())
                }"""

if old in c:
    c = c.replace(old, new, 1)
    with open(path, "w") as f:
        f.write(c)
    print("OK - instrumented goToIndex")
else:
    print("FAIL - pattern not found")
