<?php
$_p = unserialize(_POST_);
$arr_js = [
    "lib/HttpRequest.js",
    "lib/HttpRequestRetry.js",
    "lib/echarts.min.js",
    "lib/Chart.js",
    "lib/Charts.js",
    "lib/ChartJs.js",
    "dashboard.js",
    "{$_p["p"]}.js"
];
$arr_css = [
    "control/reset.css",
    "control/dashboard.css",
    "control/rwd.css",
    "control/overcss.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";