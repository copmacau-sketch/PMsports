#!/usr/bin/env bash
# deploy.sh — Crown-Gold (wwwroot_F5PEa) 在 3.25.180.205 的部署。
#
# ─────────────────────────────────────────────────────────────────────────
# 状态 2026-05-26：
#   - `tz`     → 历史项，php-fpm 现用 /etc/php/7.4/fpm/php.ini 时区，无需 reload
#   - `apache` → DEPRECATED：Apache 已停且 disable，:8080 由 nginx 接管
#                （见同目录 nginx-crown-gold.conf）。**这个子命令会失败，**
#                **不要再跑。** 如果误跑会因 a2ensite/systemctl reload apache2
#                而非零退出。
#   - `collector` → 仍可用，部署 BAT.exe 替代品（systemd 监督器）
#   - `status`    → 仍可用，只读检查
#   - app/php 文件 → 用 ./deploy_settlement.sh 推送 api_v2.php 等
#   - nginx vhost → 用 deploy/pmppm-com/deploy.sh 推送 pmppm-com.conf；
#                    crown-gold-on-:8080 的 nginx 配置目前用手工 scp 安装
#                    （见 nginx-crown-gold.conf 顶部注释）
# ─────────────────────────────────────────────────────────────────────────
#
# 用法（推荐 .pem 私钥）：
#   export CG_SSH_KEY=/Volumes/T7/Crown-gold/Crowngold.pem
#   ./deploy.sh collector              # 部署/更新采集器
#   ./deploy.sh status                 # 检查现状（只读，安全）
#   ./deploy.sh                        # 全量（会跑 apache 步骤 → 必失败）
#
# 备选（密码登录）：export CG_SSH_PASS='...' （需要 sshpass）
# 用户名覆盖：     export CG_SSH_USER=ubuntu （默认 ubuntu）
#
# 幂等：每次执行只产生预期变更，重复跑无副作用。
set -euo pipefail

REMOTE_HOST=3.25.180.205
REMOTE_USER=${CG_SSH_USER:-ubuntu}
REMOTE="${REMOTE_USER}@${REMOTE_HOST}"

# 自动探测同目录上层的 Crowngold.pem
if [ -z "${CG_SSH_KEY:-}" ] && [ -z "${CG_SSH_PASS:-}" ]; then
    for candidate in \
        "$(cd "$(dirname "$0")/../.." && pwd)/Crowngold.pem" \
        "$HOME/.ssh/Crowngold.pem"; do
        if [ -r "$candidate" ]; then
            CG_SSH_KEY="$candidate"
            break
        fi
    done
fi

# 远端目录约定
REMOTE_WWW=/home/ubuntu/crown-gold/wwwroot_F5PEa
REMOTE_COLLECTOR=/opt/crown-gold/collector
REMOTE_LOG=/var/log/crown-gold

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ---- ssh helpers -----------------------------------------------------------
SSH_OPTS=(-o StrictHostKeyChecking=no -o ConnectTimeout=15)
SCP_OPTS=(-o StrictHostKeyChecking=no -o ConnectTimeout=15)

if [ -n "${CG_SSH_KEY:-}" ]; then
    [ -r "$CG_SSH_KEY" ] || { echo "CG_SSH_KEY not readable: $CG_SSH_KEY" >&2; exit 1; }
    # 0400 要求（OpenSSH 拒绝过松的私钥）
    perm=$(stat -f '%Lp' "$CG_SSH_KEY" 2>/dev/null || stat -c '%a' "$CG_SSH_KEY" 2>/dev/null || echo "")
    case "$perm" in 400|600|0400|0600) :;; *)
        echo "tightening permissions on $CG_SSH_KEY to 400"
        chmod 400 "$CG_SSH_KEY"
    esac
    SSH_OPTS+=(-i "$CG_SSH_KEY")
    SCP_OPTS+=(-i "$CG_SSH_KEY")
    echo "auth: pem key = $CG_SSH_KEY"
elif [ -n "${CG_SSH_PASS:-}" ]; then
    command -v sshpass >/dev/null || {
        echo "sshpass required (brew install hudochenkov/sshpass/sshpass)" >&2
        exit 1
    }
    echo "auth: password (sshpass)"
else
    echo "auth: ssh-agent / default key"
fi

ssh_run() {
    if [ -n "${CG_SSH_KEY:-}" ] || [ -z "${CG_SSH_PASS:-}" ]; then
        ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
    else
        sshpass -p "$CG_SSH_PASS" ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
    fi
}
scp_to() {
    if [ -n "${CG_SSH_KEY:-}" ] || [ -z "${CG_SSH_PASS:-}" ]; then
        scp "${SCP_OPTS[@]}" "$@"
    else
        sshpass -p "$CG_SSH_PASS" scp "${SCP_OPTS[@]}" "$@"
    fi
}

say() { printf '\n\033[1;34m== %s ==\033[0m\n' "$*"; }

# ---- 1. timezone -----------------------------------------------------------
do_tz() {
    say "1) timezone → America/New_York"
    ssh_run "
        set -e
        # 系统时区
        sudo timedatectl set-timezone America/New_York
        timedatectl | grep -E 'Time zone|Local time'

        # PHP 时区 (Apache + CLI 各一份)
        for SAPI in apache2 cli fpm; do
            DIR=/etc/php/7.4/\$SAPI/conf.d
            [ -d \"\$DIR\" ] || continue
            sudo tee \$DIR/99-crown-gold-timezone.ini >/dev/null <<'EOF'
date.timezone = America/New_York
default_socket_timeout = 60
EOF
            echo \"installed: \$DIR/99-crown-gold-timezone.ini\"
        done

        # Apache 重载（如果在跑）
        if systemctl is-active --quiet apache2; then
            sudo systemctl reload apache2
        fi

        # 验证：php -r 看一下当前时区
        php -r 'echo \"PHP CLI: \".date_default_timezone_get().\" / \".date(DATE_RFC2822).PHP_EOL;'
    "
}

# ---- 2. apache vhost -------------------------------------------------------
do_apache() {
    say "2) apache vhost (4 paths on :8080)"
    scp_to -q "$SCRIPT_DIR/apache-crown-gold.conf" "$REMOTE:/tmp/crown-gold.conf"
    ssh_run "
        set -e
        sudo mv /tmp/crown-gold.conf /etc/apache2/sites-available/crown-gold.conf

        # 确保 :8080 被监听
        if ! grep -qE '^\s*Listen\s+8080' /etc/apache2/ports.conf; then
            echo 'Listen 8080' | sudo tee -a /etc/apache2/ports.conf
        fi

        # 启用站点 + mod_rewrite/alias (Apache 默认 mod_alias 已开)
        sudo a2enmod alias rewrite >/dev/null
        sudo a2ensite crown-gold >/dev/null

        # 关闭可能冲突的 000-default（避免 :8080 双绑）
        if [ -L /etc/apache2/sites-enabled/000-default.conf ]; then
            # 检查它是否监听 :8080；如果是，禁用以避免冲突
            if grep -qE '^\s*<VirtualHost\s+\*?:?8080' /etc/apache2/sites-enabled/000-default.conf 2>/dev/null; then
                sudo a2dissite 000-default >/dev/null || true
            fi
        fi

        sudo apache2ctl configtest
        sudo systemctl reload apache2
        echo 'apache reloaded'
    "
    say "smoke test 4 paths"
    ssh_run "
        for p in / /d0/ /agents/ /admin/; do
            code=\$(curl -sS --max-time 5 -o /dev/null -w '%{http_code}' http://127.0.0.1:8080\$p || echo ERR)
            printf '  %-12s %s\n' \"\$p\" \"\$code\"
        done
    "
}

# ---- 3. collector (BAT.exe replacement) -----------------------------------
do_collector() {
    say "3) collector (systemd replaces BAT.exe)"
    ssh_run "sudo mkdir -p $REMOTE_COLLECTOR $REMOTE_LOG && \
             sudo chown -R www-data:www-data $REMOTE_LOG"
    scp_to -q "$SCRIPT_DIR/collector/crown_gold_collector.py" "$REMOTE:/tmp/crown_gold_collector.py"
    scp_to -q "$SCRIPT_DIR/collector/crown-gold-collector.service" "$REMOTE:/tmp/crown-gold-collector.service"
    ssh_run "
        set -e
        sudo mv /tmp/crown_gold_collector.py $REMOTE_COLLECTOR/crown_gold_collector.py
        sudo chmod +x $REMOTE_COLLECTOR/crown_gold_collector.py
        sudo mv /tmp/crown-gold-collector.service /etc/systemd/system/crown-gold-collector.service

        # 确保 bdata 目录 www-data 可读
        sudo chown -R www-data:www-data $REMOTE_WWW/application/bdata || true

        sudo systemctl daemon-reload
        sudo systemctl enable crown-gold-collector.service
        sudo systemctl restart crown-gold-collector.service
        sleep 3
        sudo systemctl status --no-pager crown-gold-collector.service | head -25
        echo
        echo 'recent worker logs:'
        ls -la $REMOTE_LOG 2>/dev/null || true
    "
}

# ---- status check ---------------------------------------------------------
do_status() {
    say "status"
    ssh_run "
        echo '--- system timezone ---'
        timedatectl | grep -E 'Time zone|Local time'
        echo
        echo '--- PHP timezone (apache mod_php / CLI) ---'
        for SAPI in apache2 cli fpm; do
            FILE=/etc/php/7.4/\$SAPI/conf.d/99-crown-gold-timezone.ini
            [ -f \"\$FILE\" ] && echo \"[\$SAPI] \$(cat \$FILE | head -1)\" || echo \"[\$SAPI] not installed\"
        done
        php -r 'echo \"CLI runtime: \".date_default_timezone_get().PHP_EOL;'
        echo
        echo '--- apache sites ---'
        ls -l /etc/apache2/sites-enabled/ | grep -v '^total'
        echo
        echo '--- apache 8080 listeners ---'
        sudo ss -lntp 2>/dev/null | grep ':8080' || echo '(:8080 not listening)'
        echo
        echo '--- collector service ---'
        systemctl status --no-pager crown-gold-collector.service 2>/dev/null | head -10 || echo '(not installed)'
        echo
        echo '--- collector workers (last 5 lines each) ---'
        for f in /var/log/crown-gold/*.log; do
            [ -f \"\$f\" ] || continue
            echo \">>> \$(basename \$f)\"
            sudo tail -3 \"\$f\" 2>/dev/null
        done
    "
}

# ---- dispatch -------------------------------------------------------------
# Default changed 2026-05-26 from `all` to `status`. The historical `all`
# would chain do_tz → do_apache → do_collector → do_status, but do_apache
# fails on this server (Apache disabled — nginx owns :8080). Reaching that
# step now produces a misleading red exit code and partial state. Force
# operators to opt in to dead steps explicitly so misuse is loud.
case "${1:-status}" in
    tz|timezone)
        echo "warn: tz step is a no-op on the current php-fpm stack; running anyway" >&2
        do_tz ;;
    apache|vhost)
        echo "ERROR: apache vhost is DEPRECATED. nginx owns :8080 since 2026-05-26." >&2
        echo "       see ./nginx-crown-gold.conf for the live config." >&2
        exit 2 ;;
    collector|bat) do_collector ;;
    status|check)  do_status ;;
    all)
        echo "ERROR: 'all' is no longer safe (do_apache is dead). Run sub-commands"  >&2
        echo "       individually: $0 collector  &&  $0 status" >&2
        exit 2 ;;
    *) echo "usage: $0 [collector|status|tz]   (apache/all are deprecated)" >&2; exit 1 ;;
esac

say "done."
