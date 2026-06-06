<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$para = $cc->chg_psw();
exit(json_encode($para));