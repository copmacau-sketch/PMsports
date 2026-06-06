<?php
include_once "common.php";

/*引用contorller文件夹 -- 开始*/
$dir = __DIR__."/contorller/admin/";
$contorller = getFile($dir);
foreach ($contorller as $v){
    include_once $dir.$v;
}
/*引用contorller文件夹 -- 结束*/

