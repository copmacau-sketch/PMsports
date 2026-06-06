<?php
/**
 * 模板打包端点 — 一次请求返回所有 SPA 初始模板
 * 替代 10+ 个串行 transform.php AJAX 调用
 */
require_once "../../vendor/common/autoload.php";

header('Content-Type: application/json');
header('Cache-Control: public, max-age=300');

$templates = [
    'icon_all', 'alert_msg', 'system_msg', 'login',
    'footer', 'header', 'order', 'bottom', 'home', 'right_menu'
];

$uid  = isset($_GET['uid'])  ? $_GET['uid']  : '';
$ver  = isset($_GET['ver'])  ? $_GET['ver']  : '';
$langx = isset($_GET['langx']) ? $_GET['langx'] : 'zh-cn';

$bundle = [];

foreach ($templates as $tpl) {
    // 构建模拟请求参数
    $_p_fake = [
        'p'     => $tpl,
        'ver'   => $ver,
        'langx' => $langx,
        'uid'   => $uid,
    ];

    // 用 output buffering 捕获 transform.php 的输出
    ob_start();
    // 保存当前 $_REQUEST / $_POST / $_GET
    $save_request = $_REQUEST;
    $save_post    = $_POST;
    $save_get     = $_GET;

    $_REQUEST = $_p_fake;
    $_POST    = $_p_fake;
    $_GET     = $_p_fake;

    try {
        // 使用内部 HTTP 请求获取模板
        $ch = curl_init("http://127.0.0.1:8080/transform.php");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($_p_fake));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        $html = curl_exec($ch);
        curl_close($ch);

        if ($html !== false && strlen($html) > 0) {
            $bundle[$tpl] = $html;
        }
    } catch (Exception $e) {
        // skip failed templates
    }

    ob_end_clean();

    // 恢复
    $_REQUEST = $save_request;
    $_POST    = $save_post;
    $_GET     = $save_get;
}

echo json_encode($bundle, JSON_UNESCAPED_UNICODE);
