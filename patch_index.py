#!/usr/bin/env python3
"""Inject template bundle preload into index.php"""

path = "/home/ubuntu/crown-gold/wwwroot_F5PEa/application/member/index.php"

with open(path, "r") as f:
    content = f.read()

# Backup
with open(path + ".bak", "w") as f:
    f.write(content)

inject_code = '''
// === Template Bundle Preload (parallel curl_multi) ===
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
$_bundleJson = json_encode($_bundle, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$html = str_replace('</body>', '<script>window.__tplBundle='.$_bundleJson.';</script></body>', $html);
// === End Bundle ===

'''

old = 'print_r($html);exit;'
new = inject_code + 'print_r($html);exit;'
content = content.replace(old, new, 1)

with open(path, "w") as f:
    f.write(content)

print("OK - injected bundle preload into index.php")
