<?php
global $refreshTime,$content,$title;
$css_arr = ["/style/style.css"];
$js_arr  = ["/js/refresh.js"];
$css = "";
foreach ($css_arr as $v) {
    $css .= getFileTxt(STATICS.$v);
}

$js = "var limit=\"{$refreshTime}\" \n";
foreach ($js_arr as $v){
    $js .= getFileTxt(STATICS.$v);
    $js .= "\n";
}

/*数据部分 - 开始*/

/*数据部分 - 结束*/

$html = getFileTxt(VIEW."/index.html");
$html = str_replace('{TITLE}',$title,$html);
$html = str_replace('{JS}',$js,$html);
$html = str_replace('{CSS}',$css,$html);
$html = str_replace('{CONTENT}',$content,$html);
print_r($html);exit;