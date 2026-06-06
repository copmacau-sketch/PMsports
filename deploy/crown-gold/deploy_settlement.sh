#!/usr/bin/env bash
# deploy_settlement.sh — push settlement system to Crown-Gold server
#
# Files deployed:
#   wwwroot_F5PEa/application/member/api_v2.php  (place-bet stores wtype/rtype/spread, events return scores, /api/settle route)
#   wwwroot_F5PEa/application/member/.htaccess   (routes /api/settle and /api/bets)
#   wwwroot_F5PEa/application/member/settle_bets.php  (CLI settlement script, API-Sports.io)
#
# Cron install (one-time):
#   ssh ubuntu@3.25.180.205 'sudo touch /var/log/settle_bets.log && sudo chown ubuntu:ubuntu /var/log/settle_bets.log'
#   ssh ubuntu@3.25.180.205 'crontab -l 2>/dev/null | grep -v settle_bets.php > /tmp/cb; cat /home/ubuntu/crown-gold/wwwroot_F5PEa/application/member/settle_bets.cron >> /tmp/cb; crontab /tmp/cb'

set -euo pipefail

HOST="ubuntu@3.25.180.205"
KEY="/Volumes/T7/Crown-gold/Crowngold.pem"
SRC="/Volumes/T7/Crown-gold/wwwroot_F5PEa/application/member"
DST="/home/ubuntu/crown-gold/wwwroot_F5PEa/application/member"

scp -i "$KEY" \
    "$SRC/api_v2.php" \
    "$SRC/.htaccess" \
    "$SRC/settle_bets.php" \
    "$HOST:$DST/"

scp -i "$KEY" \
    "/Volumes/T7/Crown-gold/deploy/crown-gold/settle_bets.cron" \
    "$HOST:$DST/"

echo "Deployed. Verify with:"
echo "  ssh -i $KEY $HOST 'php $DST/settle_bets.php'"
echo "  curl -s 'http://3.25.180.205:8080/api/settle?key=cron2026'"
