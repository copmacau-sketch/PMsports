<?php

/**
 * Class Configure 后台配置类
 */
class Configure extends Base
{
    public function __construct($_p = [])
    {
        parent::__construct($_p);
    }

    /**
     * 最新网址查询
     */
    public function get_new_url(){
        if(strlen($this->user["nid"]) == 16){
            $arr = $this->getConnDefaultNewUrl();
        }else{
            $nid = sup_nid(Constant::AD,$this->user["nid"]);
            $conn_table = Constant::T_CONFIG;
            $r = $this->dbc->select("SELECT `new_url` FROM {$conn_table} WHERE `nid`='{$nid}'");
            if(!$r){
                $arr = $this->getConnDefaultNewUrl();
            }else{
                if(empty($r["new_url"])){
                    $arr = $this->getConnDefaultNewUrl();
                }else{
                    $arr = json_decode($r["new_url"],true);
                }
            }
        }

        return $arr;
    }


    /**
     * 读取默认最新网址
     * @return mixed
     */
    public function getConnDefaultNewUrl(){
        $conn_default = Constant::T_CONFIG_DEFAULT;
        $rs = $this->dbc->select("SELECT `new_url` FROM {$conn_default} LIMIT 1","Row");
        return json_decode($rs["new_url"],true);
    }

    /**
     * 查询采集配置
     */
    public function curlConf(){
        $table = Constant::S_CONFIG;
        $rs = $this->dbs->select("SELECT * FROM {$table} LIMIT 1","Row");
        if(isset($this->param["showtype"])){
            switch (strtoupper($this->param["showtype"])){
                case "UP":
                    $arr = empty($rs["front"]) ? [] : unserialize($rs["front"]);
                    break;
                case "DOWN":
                    $arr = empty($rs["after"]) ? "" : unserialize($rs["after"]);
                    break;
                case "AG":
                    $table = Constant::S_AGUID;
                    $rs = $this->dbs->select("SELECT `id`,`url`,`username` AS `user`,`password` AS `pwd`,`uid`,`msg` AS `status` ,`ver` FROM {$table}");
                    return $rs;
                    break;
                case "URL":
                    $table = Constant::S_URL;
                    $rs = $this->dbs->select("SELECT `id`,`url`,`ms`,`status` FROM {$table}");
                    return $rs;
                    break;
            }
        }else{
            $arr = [
                "front" => empty($rs["front"]) ? "" : unserialize($rs["front"]),
                "after" => empty($rs["after"]) ? "" : unserialize($rs["after"])
            ];
        }
        return $arr;
    }

    public function curlConfAdd(){
        $table = Constant::S_CONFIG;
        if(isset($this->param["ary"])){
            $ary =json_decode(html_entity_decode($this->param["ary"]),true);
            $ary = serialize($ary);
        }

        $save = [];
        switch (strtoupper($this->param["type"])){
            case "UP":
                $save = ["front" => $ary];
                break;
            case "DOWN":
                $save = ["after" => $ary];
                break;
            case "AG":
                $table = Constant::S_AGUID;

                try{
                    foreach (unserialize($ary) as $k => $v){
                        $sql = "INSERT INTO {$table} (`url`,`username`,`password`,`uid`,`msg`) VALUES ('{$v["url"]}','{$v["user"]}','{$v["pwd"]}','{$v["uid"]}','{$v["status"]}')";
                        $sql.= " ON DUPLICATE KEY UPDATE";
                        $sql.= "`url`=VALUES(`url`),`username`=VALUES(`username`),`password`=VALUES(`password`),`uid`=VALUES(`uid`),`msg`=VALUES(`msg`)";
                        $this->dbs->execSql($sql);
                    }

                    return [
                        "status" => "success",
                        "code" => "add"
                    ];
                }catch (\Exception $e){
                    return [
                        "status" => "error",
                        "msg" => $e->getMessage()
                    ];
                }
                break;
            case "URL":
                $table = Constant::S_URL;
                try{
                    foreach (unserialize($ary) as $k => $v){
                        $sql = "INSERT INTO {$table} (`url`) VALUES ('{$v["url"]}')";
                        $sql.= " ON DUPLICATE KEY UPDATE";
                        $sql.= "`url`=VALUES(`url`)";
                        $this->dbs->execSql($sql);
                    }
                    return [
                        "status" => "success",
                        "code" => "add"
                    ];
                }catch (\Exception $e){
                    return [
                        "status" => "error",
                        "msg" => $e->getMessage()
                    ];
                }

                break;
            case "DEL_URL":
                if(isset($this->param["id"]) && is_numeric($this->param["id"]) && $this->param["id"]>0){
                    $table = Constant::S_URL;
                    $sql = "DELETE FROM {$table} WHERE `id`={$this->param["id"]}";
                }else{
                    return ["status" => "error","msg"=>"参数错误!"];
                }
                break;
            case "DEL_AG":
                if(isset($this->param["id"]) && is_numeric($this->param["id"]) && $this->param["id"]>0){
                    $table = Constant::S_AGUID;
                    $sql = "DELETE FROM {$table} WHERE `id`={$this->param["id"]}";
                }else{
                    return ["status" => "error","msg"=>"参数错误!"];
                }
                break;
            case "SET_CURL_URL":
                if(isset($this->param["url"]) && !empty($this->param["url"])){
                    $this->dbs->beginTransaction();
                    try{
                        $table = Constant::S_CONFIG;
                        $con = $this->dbs->select("SELECT * FROM {$table} WHERE `id`=1","Row");
                        if($con){
                            $f = unserialize($con["front"]);
                            foreach ($f as $k => $v){
                                $f[$k]["url"] = $this->param["url"];
                            }

                            $a = unserialize($con["after"]);
                            foreach ($a as $k => $v){
                                $a[$k]["url"] = $this->param["url"];
                            }

                            $up = [
                                "front" => serialize($f),
                                "after" => serialize($a)
                            ];

                            $this->dbs->update($table,$up,"`id`=1");
                        }
                        $this->dbs->commit();
                        return [
                            "status" => "success",
                            "code" => "add"
                        ];
                    }catch (\Exception $e){
                        $this->dbs->rollback();
                        return [
                            "status" => "error",
                            "msg" => $e->getMessage()
                        ];
                    }
                }else{
                    return ["status" => "error","msg"=>"参数错误!"];
                }
                break;
        }

        try{
            if(isset($sql)){
                $this->dbs->execSql($sql);
            } else {
                $count = $this->dbs->getCount($table, "id");
                if ($count > 0) {
                    $this->dbs->update($table, $save, "id=1");
                } else {
                    $this->dbs->insert($table, $save);
                }
            }
            return [
                "status" => "success",
                "code" => "add"
            ];
        }catch (\Exception $e){
            return [
                "status" => "error",
                "msg" => $e->getMessage()
            ];
        }
    }
}