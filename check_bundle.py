#!/usr/bin/env python3
"""Check bundle JSON from actual index.php output for JS-incompatible chars"""
import json, subprocess, sys

# Extract line 8 from actual index.php
r = subprocess.run(
    ["curl", "-sS", "http://127.0.0.1:8080/index.php?cu=Y&langx=zh-cn"],
    capture_output=True, timeout=30
)
lines = r.stdout.decode('utf-8', errors='replace').split('\n')
line8 = lines[7] if len(lines) > 7 else ''
print(f"Line 8 length: {len(line8)}")

# Extract JSON from "window.__tplBundle={...};"
prefix = "window.__tplBundle="
idx = line8.find(prefix)
if idx == -1:
    print("ERROR: __tplBundle not found on line 8")
    sys.exit(1)

json_start = idx + len(prefix)
# Find the end: }; followed by newline or next statement
depth = 0
end = -1
for i in range(json_start, len(line8)):
    c = line8[i]
    if c == '"':
        # skip string content
        j = i + 1
        while j < len(line8):
            if line8[j] == '\\':
                j += 2
                continue
            if line8[j] == '"':
                break
            j += 1
        i = j
        continue
    if c == '{':
        depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0:
            end = i + 1
            break

json_str = line8[json_start:end]
print(f"JSON length: {len(json_str)}")

# Validate as JSON
try:
    d = json.loads(json_str)
    print(f"Valid JSON, keys: {list(d.keys())}")
except json.JSONDecodeError as e:
    print(f"JSON error at pos {e.pos}: {e.msg}")
    print(f"Context: {repr(json_str[max(0,e.pos-30):e.pos+30])}")
    sys.exit(1)

# Check for JS-problematic escape sequences in the raw JSON string
# In JS string literals, \x must be followed by 2 hex digits, \u by 4
# But in JSON, only \n \r \t \b \f \\ \/ \" \uXXXX are valid
# json_encode should only produce valid sequences
# Check for bare control chars
bad_chars = []
for i, c in enumerate(json_str):
    if ord(c) < 0x20 and c not in '\r\n\t':
        bad_chars.append((i, repr(c)))
        if len(bad_chars) >= 5:
            break

if bad_chars:
    print(f"Bad control chars found: {bad_chars}")
else:
    print("No bad control chars")

# Show context around position 215245
if len(json_str) > 215250:
    # Adjust for "window.__tplBundle=" prefix
    pos = 215245 - len(prefix)
    print(f"\nAround error position {215245}:")
    print(f"  JSON pos {pos}: {repr(json_str[max(0,pos-30):pos+30])}")

# Check the trailing part after JSON
after = line8[end:end+50]
print(f"\nAfter JSON: {repr(after)}")
