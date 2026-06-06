<?php
include_once "mysql.class.php";
// Credentials are read from the Apache process environment so we can run
// the legacy `db_client` / `db_sports` connections under a low-privilege
// MySQL account (`crown_app`) without losing the ability to fall back to
// root when the env is not set (e.g. fresh box, unit-test scripts).
//
// Provision the env via `SetEnv CG_DB_USER ...` / `SetEnv CG_DB_PASS ...`
// in /etc/apache2/sites-available/crown-gold.conf, OR via
// `Environment="CG_DB_*=..."` in /etc/systemd/system/apache2.service.d/.
//
// IMPORTANT: do NOT inline a non-root password here; this file is part of
// the codebase shipped to git. The fallback to `root` is only safe while
// the legacy default (49f08...) is still in place; once we rotate root,
// we MUST set the env or every Apache request 500s.
$db_user = getenv('CG_DB_USER') ?: 'root';
$db_pwd  = getenv('CG_DB_PASS') ?: '49f0863e9070';

//用户库
$database_c =  'db_client';
unset($db_client);
$db_c =  DB::getInstance('127.0.0.1',$db_user,$db_pwd,'utf8',$database_c);

//赛事库
unset($db_sports);
$database_s =  'db_sports';
$db_s =  DB::getInstance('127.0.0.1',$db_user,$db_pwd,'utf8',$database_s);

