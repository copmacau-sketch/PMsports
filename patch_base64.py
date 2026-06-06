#!/usr/bin/env python3
"""Fix bundle injection to use base64+JSON.parse instead of raw JS object literal"""

path = "/home/ubuntu/crown-gold/wwwroot_F5PEa/application/member/index.php"

with open(path, "r") as f:
    content = f.read()

with open(path + ".bak4", "w") as f:
    f.write(content)

# Replace the raw JS assignment with base64+JSON.parse
old = '$js = "window.__tplBundle=" . $_bundleJson . ";\\n" . $js;'
new = '$_bundleB64 = base64_encode($_bundleJson);\n$js = "window.__tplBundle=JSON.parse(atob(\'" . $_bundleB64 . "\'));\\n" . $js;'

content = content.replace(old, new, 1)

with open(path, "w") as f:
    f.write(content)

print("OK - switched to base64+JSON.parse for bundle injection")
