#!/usr/bin/env python3
"""Remove bundle injection from index.php, restore original loading"""

path = "/home/ubuntu/crown-gold/wwwroot_F5PEa/application/member/index.php"

with open(path, "r") as f:
    content = f.read()

with open(path + ".bak_bundle", "w") as f:
    f.write(content)

import re

# Remove the entire bundle block
bundle_block = re.search(
    r'\n// === Template Bundle Preload.*?// === End Bundle ===\n',
    content, re.DOTALL
)
if bundle_block:
    content = content[:bundle_block.start()] + "\n" + content[bundle_block.end():]
    print("Removed bundle block")
else:
    print("Bundle block not found!")

# Remove the base64 lines if they exist outside the block
content = re.sub(r'\$_bundleB64.*?\n', '', content)

# Make sure $html = str_replace('{JS}',$js,$html); exists
if "str_replace('{JS}',$js,$html)" not in content:
    # Re-add it before the CSS replacement
    content = content.replace(
        "$html = str_replace('{CSS}',$css,$html);",
        "$html = str_replace('{JS}',$js,$html);\n$html = str_replace('{CSS}',$css,$html);"
    )
    print("Re-added {JS} replacement")

with open(path, "w") as f:
    f.write(content)

print("OK - bundle removed, original loading restored")
