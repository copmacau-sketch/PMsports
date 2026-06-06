<?php
header('Content-type: text/html;charset=utf-8');

$title = "UID检测";
$refreshTime = 30;//刷新时间
$content = "";//显示内容
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去

do{
    include_once "include/config.php";
    global $db_c,$db_s,$webdb;
    $table = Constant::S_CONFIG;
    $curl = $db_c->select("SELECT * FROM {$table} LIMIT 1","Row");
    if($curl){
        $f = !empty($curl["front"]) ? unserialize($curl["front"]) : "";
        if(!empty($f) && is_array($f)){
            $content = "前端UID检测:\n";
            $res = checkUID("front",$f);
            $content .= $res;
            print_r($content);
        }

        $a = !empty($curl["after"]) ? unserialize($curl["after"]) : "";
        if(!empty($a) && is_array($a)){
            $content = "后端UID检测:\n";
            $res = checkUID("after",$a);
            $content .= $res;
            print_r($content);
        }

        //写入db.php
        $curl =  $db_c->select("SELECT * FROM {$table} LIMIT 1","Row");
        if($curl) {
            $arr = [
                "front" => !empty($curl["front"]) ? unserialize($curl["front"]) : [],
                "after" => !empty($curl["after"]) ? unserialize($curl["after"]) : []
            ];
            writefile(serialize($arr));
        }
        //$db_c->close();
        sleep($refreshTime);
    }

} while(true);

function checkUID($type="front",$f=[]){
    global $db_s,$webdb,$curlMatchAry;
    $table = Constant::S_CONFIG;
    $content = "";
    foreach ($f as $k => $v){
        $tf = new Transform($v['url'],"zh-cn");
        /*检测线路 -- 开始*/
        $isUrl = $tf->chkUrl();
        if($isUrl["status"]=="error"){
            $url1 = get_url();
            if(empty($url1)){
                $f[$k]["status"] = "线路不通！";
                $content .= "USER:{$v["user"]} UID:{$f[$k]["status"]}\n";
                $tf->close();
                continue;
            }
            $f[$k]["url"] = $url1;
            $isUrl = $tf->chkUrl($url1);
        }

        if($isUrl["status"]=="error"){
            continue;
        }
        //设置默认采集账号配置为当前账号配置
        $tf->setDefaultWeb($v);
        /*维护检测 -- 开始*/
        if(isset($isUrl["maintain_sw"]) && $isUrl["maintain_sw"] == "Y"){
            if($isUrl["maintain_sw"]=="Y"){
                $f[$k]["status"] = "紧急维护";
            }else{
                $f[$k]["status"] = "例行维护";
            }
            $webstr = $isUrl["maintain_time"];
            //更新维护表
            $db_s ->update(Constant::T_CONFIG_DEFAULT,["website"=>1,"webstr"=>$webstr],"`isrg`=0");
            $content .= "USER:{$v["user"]} UID:{$f[$k]["status"]}\n";
            $tf->close();
            continue;
        }else{
            $xml = $tf->service_mainget("N");

            $urgent_sw =  $tf->getXmlNode($xml,"urgent_sw");
            $maintain_sw =  $tf->getXmlNode($xml,"maintain_sw");
            //$emergency_sw =  $tf->getXmlNode($xml,"emergency_sw");
            if($urgent_sw=="Y" || $maintain_sw=="Y"){// || $emergency_sw=="Y"
                if($urgent_sw=="Y"){
                    $f[$k]["status"] = "紧急维护";
                }else{
                    $f[$k]["status"] = "例行维护";
                }/*else{
                $f[$k]["status"] = "页面维护";
            }*/
                $website = $tf->getXmlNode($xml,"maintain_time");
                //更新维护表
                $db_s ->update(Constant::T_CONFIG_DEFAULT,["website"=>1,"webstr"=>$website],"`isrg`=0");
                $content .= "USER:{$v["user"]} UID:{$f[$k]["status"]}\n";
                $tf->close();
                continue;
            }else{
                $db_s ->update(Constant::T_CONFIG_DEFAULT,["website"=>0],"`isrg`=0");
            }

        }/*维护检测 -- 结束*/
        //更新版本号
        if(!empty($isUrl["ver"]) && $isUrl["ver"]!=$v["ver"]){
            $f[$k]["ver"] = $isUrl["ver"];
            $v["ver"] = $isUrl["ver"];
        }

        /*检测线路 -- 结束*/


        /*检测UID -- 开始*/
        $xml = $tf->get_member_data();//访问用户资料用于检测登陆是否失效
        //print_r($xml);exit;
        $code = $tf->getXmlNode($xml,"code");
        if($code == "get_credit_data"){
            $content .= "USER:{$v["user"]} UID:正常\n";
            $f[$k]["status"] = "ok";
            $tf->close();
            continue;
        }
        /*检测UID -- 结束*/
        //登陆验证
        $arr = $tf->login($v["user"],$v["pwd"]);
        if($arr["status"] == "error"){
            $f[$k]["status"] = $arr["msg"];
            $content .= "USER:{$v["user"]} UID:{$f[$k]["status"]}\n";
            $tf->close();
            continue;
        }

        //登陆成功
        $f[$k]["uid"] = $arr["uid"];
        $f[$k]["mid"] = $arr["mid"];
        $f[$k]["url"] = $arr["url"];
        $f[$k]["status"] = "ok";
        $content .= "USER:{$v["user"]} UID:{$arr["uid"]}\n";
        $tf->close();
    }
    $db_s->update($table,[$type=>serialize($f)],"id=1");

    return $content;
}

function get_url(){
    global $db_s;
    $rs = $db_s->SELECT("SELECT `url` FROM `db_sports`.`url`  WHERE `status`='ok' ORDER BY `ms` ASC LIMIT 1","Row");
    return isset($rs["url"]) ? $rs["url"] : "";
}
//include_once "./include/html.php";
?>
