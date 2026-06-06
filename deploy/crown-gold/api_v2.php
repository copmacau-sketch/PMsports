<?php
/**
 * DEPRECATED 2026-05-26.
 *
 * This file used to be a 561-line snapshot of api_v2.php that nobody on the
 * deploy path actually pushed (the canonical file lived — and still lives —
 * at wwwroot_F5PEa/application/member/api_v2.php, currently ~2920 lines).
 * Keeping the snapshot around made it look like a deployable artefact and
 * caused at least one P2 rotation to push the wrong file.
 *
 * Truncated to this stub on 2026-05-26 so anyone who scp's it accidentally
 * gets an obvious 500 instead of silently downgrading the live API to last
 * month's behaviour. Recover the full pre-truncation contents from git
 * history if you ever need to reference the old shape.
 *
 * Canonical source-of-truth:
 *   /Volumes/T7/Crown-gold/wwwroot_F5PEa/application/member/api_v2.php
 *
 * Push it to production via:
 *   /Volumes/T7/Crown-gold/deploy/crown-gold/deploy_settlement.sh
 */
http_response_code(500);
header('Content-Type: text/plain; charset=utf-8');
echo "deploy/crown-gold/api_v2.php is a deprecated stub. Push the real file\n";
echo "from wwwroot_F5PEa/application/member/api_v2.php via deploy_settlement.sh.\n";
exit(1);
