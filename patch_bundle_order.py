#!/usr/bin/env python3
"""Move bundle generation BEFORE {JS} replacement, prepend to $js variable"""

path = "/home/ubuntu/crown-gold/wwwroot_F5PEa/application/member/index.php"

with open(path, "r") as f:
    content = f.read()

# Backup
with open(path + ".bak3", "w") as f:
    f.write(content)

# 1. Remove the old bundle block (from "// === Template Bundle" to "// === End Bundle ===")
import re
bundle_block = re.search(
    r'\n// === Template Bundle Preload.*?// === End Bundle ===\n',
    content, re.DOTALL
)
if bundle_block:
    content = content[:bundle_block.start()] + content[bundle_block.end():]
    print("Removed old bundle block")

# 2. Insert new bundle block BEFORE the {JS} replacement
# Find: $html = str_replace('{JS}',$js,$html);
old_js_replace = "$html = str_replace('{JS}',$js,$html);"

new_bundle_and_js = """// === Template Bundle Preload (parallel curl_multi) ===
$_bundle_tpls = ["icon_all","alert_msg","system_msg","login","footer","header","order","bottom","home","right_menu"];
$_bundle = [];
$_mh = curl_multi_init();
$_chs = [];
foreach($_bundle_tpls as $_tpl){
    $_ch = curl_init("http://127.0.0.1:8080/transform.php");
    curl_setopt($_ch, CURLOPT_POST, true);
    $_post_data = "p=".$_tpl."&ver=".urlencode($ver)."&langx=".urlencode($langx);
    if(!empty($uid)) $_post_data .= "&uid=".urlencode($uid);
    curl_setopt($_ch, CURLOPT_POSTFIELDS, $_post_data);
    curl_setopt($_ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($_ch, CURLOPT_TIMEOUT, 10);
    curl_multi_add_handle($_mh, $_ch);
    $_chs[$_tpl] = $_ch;
}
do{
    curl_multi_exec($_mh, $_running);
    curl_multi_select($_mh);
}while($_running > 0);
foreach($_chs as $_tpl => $_ch){
    $_res = curl_multi_getcontent($_ch);
    if($_res) $_bundle[$_tpl] = $_res;
    curl_multi_remove_handle($_mh, $_ch);
}
curl_multi_close($_mh);
$_bundleJson = json_encode($_bundle, JSON_UNESCAPED_UNICODE);
$js = "window.__tplBundle=" . $_bundleJson . ";\\n" . $js;
// === End Bundle ===

$html = str_replace('{JS}',$js,$html);"""

content = content.replace(old_js_replace, new_bundle_and_js, 1)

with open(path, "w") as f:
    f.write(content)

print("OK - bundle now prepended to $js before {JS} replacement")
