#!/usr/bin/env python3
"""Patch goToPage in index_3.js to use preloaded template cache"""

path = "/home/ubuntu/crown-gold/wwwroot_F5PEa/application/member/js/index_3.js"

with open(path, "r") as f:
    content = f.read()

# Backup
with open(path + ".bak2", "w") as f:
    f.write(content)

# Find the exact loadURL call in goToPage and add cache check before it
old = '                        ht.loadURL(top.m2_url, "POST", _post)'

new = '''                        if (window.__tplBundle && window.__tplBundle[page]) {
                            var _cachedHtml = window.__tplBundle[page];
                            delete window.__tplBundle[page];
                            setTimeout(function(){ ht.eventhandler("LoadComplete", _cachedHtml); }, 0);
                        } else {
                        ht.loadURL(top.m2_url, "POST", _post)
                        }'''

# Only replace the FIRST occurrence (inside goToPage)
content = content.replace(old, new, 1)

with open(path, "w") as f:
    f.write(content)

print("OK - patched goToPage to use template cache")
