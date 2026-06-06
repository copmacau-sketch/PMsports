#!/usr/bin/env bash
# Deploy the PmPm v4 H5 prototype to https://pmppm.com/sports.
#
# Layout on server (created by this script):
#   /opt/pmppm-com/
#       web/                 Next.js standalone bundle
#       api/
#           backend/         FastAPI app source
#           scripts/         ingest_oddsapi.py + helpers
#       venv/                Python venv used by both api + ingest
#       data/oddsapi.sqlite  refreshed by cron
#
# Idempotent: re-run after code changes; existing services are restarted.
#
# Auth (preferred): ssh key. Auto-detects $REPO_ROOT/Crowngold.pem or
# ~/.ssh/Crowngold.pem; override with PMPPM_SSH_KEY=<path>.
# Fallback: password via sshpass with PMPPM_SSH_PASS=<pw>.
# Remote user defaults to `ubuntu` (override with PMPPM_SSH_USER).
#
# Env required locally:
#   PMPPM_SSH_KEY    — path to ssh private key (optional if auto-detected)
#   ODDS_API_KEY     — odds-api.io key (written into /etc/default/pmppm-com.env)
#   APISPORTS_KEY    — api-sports.io key
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/Football-codex-pmpm-h5-v3-frontend/frontend"
BACKEND_DIR="$REPO_ROOT/crown-explorer/backend"
SCRIPTS_DIR="$REPO_ROOT/crown-explorer/scripts"
DEPLOY_DIR="$REPO_ROOT/deploy/pmppm-com"

REMOTE_HOST=107.151.247.80
REMOTE_USER=${PMPPM_SSH_USER:-root}
REMOTE="${REMOTE_USER}@${REMOTE_HOST}"
REMOTE_ROOT="/opt/pmppm-com"

# ---- auth: prefer pem key, fall back to sshpass password -------------------
if [ -z "${PMPPM_SSH_KEY:-}" ] && [ -z "${PMPPM_SSH_PASS:-}" ]; then
    for candidate in "$REPO_ROOT/Crowngold.pem" "$HOME/.ssh/Crowngold.pem"; do
        if [ -r "$candidate" ]; then
            PMPPM_SSH_KEY="$candidate"
            break
        fi
    done
fi

SSH_OPTS=(-o StrictHostKeyChecking=no -o ConnectTimeout=15)
SCP_OPTS=(-o StrictHostKeyChecking=no -o ConnectTimeout=15)
if [ -n "${PMPPM_SSH_KEY:-}" ]; then
    [ -r "$PMPPM_SSH_KEY" ] || { echo "PMPPM_SSH_KEY not readable: $PMPPM_SSH_KEY" >&2; exit 1; }
    # OpenSSH refuses overly-permissive private keys.
    perm=$(stat -f '%Lp' "$PMPPM_SSH_KEY" 2>/dev/null || stat -c '%a' "$PMPPM_SSH_KEY" 2>/dev/null || echo "")
    case "$perm" in 400|600|0400|0600) :;; *) chmod 400 "$PMPPM_SSH_KEY";; esac
    SSH_OPTS+=(-i "$PMPPM_SSH_KEY")
    SCP_OPTS+=(-i "$PMPPM_SSH_KEY")
    echo "auth: pem key = $PMPPM_SSH_KEY"
elif [ -n "${PMPPM_SSH_PASS:-}" ]; then
    command -v sshpass >/dev/null || { echo "sshpass required (brew install hudochenkov/sshpass/sshpass)" >&2; exit 1; }
    echo "auth: password (sshpass)"
fi

ssh_run() {
    if [ -n "${PMPPM_SSH_KEY:-}" ] || [ -z "${PMPPM_SSH_PASS:-}" ]; then
        ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
    else
        sshpass -p "$PMPPM_SSH_PASS" ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
    fi
}
scp_to() {
    if [ -n "${PMPPM_SSH_KEY:-}" ] || [ -z "${PMPPM_SSH_PASS:-}" ]; then
        scp "${SCP_OPTS[@]}" "$@"
    else
        sshpass -p "$PMPPM_SSH_PASS" scp "${SCP_OPTS[@]}" "$@"
    fi
}
rsync_to() {
    local SSH_E="ssh ${SSH_OPTS[*]}"
    if [ -n "${PMPPM_SSH_KEY:-}" ] || [ -z "${PMPPM_SSH_PASS:-}" ]; then
        rsync -e "$SSH_E" "$@"
    else
        sshpass -p "$PMPPM_SSH_PASS" rsync -e "$SSH_E" "$@"
    fi
}

say() { printf '\n\033[1;34m== %s ==\033[0m\n' "$*"; }

# ---- 0. sanity checks ------------------------------------------------------
say "checking prerequisites"
: "${ODDS_API_KEY:?set ODDS_API_KEY}"
: "${APISPORTS_KEY:?set APISPORTS_KEY}"
if [ -z "${PMPPM_SSH_KEY:-}" ] && [ -z "${PMPPM_SSH_PASS:-}" ]; then
    echo "need PMPPM_SSH_KEY (or Crowngold.pem in repo root) or PMPPM_SSH_PASS" >&2
    exit 1
fi
command -v rsync >/dev/null
[ -d "$FRONTEND_DIR" ] && [ -d "$BACKEND_DIR" ] && [ -d "$SCRIPTS_DIR" ]

# ---- 1. local build --------------------------------------------------------
say "building Next.js (output: standalone)"
cd "$FRONTEND_DIR"
# Wipe .next to avoid the macOS ENOTEMPTY race on standalone/node_modules
# cleanup. The build is fast enough (3s) that a from-scratch run is fine.
# T7 external SSD occasionally holds a file briefly — retry a few times.
for attempt in 1 2 3 4 5; do
    if rm -rf .next 2>/dev/null; then break; fi
    echo "rm -rf .next failed (attempt $attempt), retrying…"
    sleep 1
done
[ -d .next ] && { echo "could not clean .next"; exit 1; } || true
NEXT_PUBLIC_API_BASE="" npm run build

# Assemble the standalone bundle. Next emits .next/standalone with server.js
# at the root; .next/static and public/ need to be co-located.
BUILD_OUT="$FRONTEND_DIR/.next/standalone"
[ -d "$BUILD_OUT" ] || { echo "build output missing: $BUILD_OUT"; exit 1; }
rm -rf "$BUILD_OUT/.next/static" "$BUILD_OUT/public" 2>/dev/null || true
mkdir -p "$BUILD_OUT/.next"
cp -R "$FRONTEND_DIR/.next/static" "$BUILD_OUT/.next/static"
[ -d "$FRONTEND_DIR/public" ] && cp -R "$FRONTEND_DIR/public" "$BUILD_OUT/public" || true

# ---- 1b. second build: static export with basePath=/h5 ---------------------
# pmppm.com has TWO entry points to the same Next.js app:
#   /sports             → Node.js standalone (the one we just built)
#   /h5/sports.html     → static export bundled into Crown-gold's
#                         wwwroot_F5PEa/application/member/h5/ directory.
# The Crown-gold login page redirects post-auth to /h5/sports.html, so
# without this second build that entry would stay frozen at whatever
# bundle was last manually `tar xzf`-ed onto the box.
#
# next.config.ts gates output mode on NEXT_EXPORT=1: standalone when
# unset, "export" + basePath=/h5 when set. We MUST stage the standalone
# bundle *before* this rebuild because the second `next build` clobbers
# .next/ — and section 3 below depends on $STANDALONE_STAGE existing.
say "staging standalone bundle before second build"
STANDALONE_STAGE="$FRONTEND_DIR/.standalone_stage"
rm -rf "$STANDALONE_STAGE"
cp -R "$BUILD_OUT" "$STANDALONE_STAGE"

say "building Next.js (output: export, basePath=/h5)"
EXPORT_STAGE="$FRONTEND_DIR/.h5_export_stage"
rm -rf "$EXPORT_STAGE"
NEXT_EXPORT=1 NEXT_PUBLIC_API_BASE="" npx next build
[ -d "$FRONTEND_DIR/out" ] || { echo "export build missing: $FRONTEND_DIR/out"; exit 1; }
mv "$FRONTEND_DIR/out" "$EXPORT_STAGE"

# ---- 2. remote prepare -----------------------------------------------------
# /opt/pmppm-com is created as root once, then chowned to $REMOTE_USER so
# subsequent rsyncs and pip installs run unprivileged. Only /etc writes
# (systemd, nginx, cron, env file) still need sudo further down.
say "preparing remote tree"
ssh_run "sudo mkdir -p $REMOTE_ROOT/{web,api/backend,api/scripts,data,venv} && \
         sudo chown -R $REMOTE_USER:$REMOTE_USER $REMOTE_ROOT && \
         sudo apt-get -qq update >/dev/null && \
         sudo apt-get -qq install -y python3-venv >/dev/null && \
         (test -x $REMOTE_ROOT/venv/bin/python3 || python3 -m venv $REMOTE_ROOT/venv) && \
         $REMOTE_ROOT/venv/bin/pip install --quiet --upgrade pip"

# ---- 3. rsync web ----------------------------------------------------------
say "rsyncing Next.js standalone → $REMOTE:$REMOTE_ROOT/web"
rsync_to -az --delete "$STANDALONE_STAGE/" "$REMOTE:$REMOTE_ROOT/web/"
rm -rf "$STANDALONE_STAGE"

# ---- 3b. rsync /h5/ static export ------------------------------------------
# Crown-gold's wwwroot is owned by www-data, so we rsync into a /tmp
# staging dir owned by $REMOTE_USER and then sudo-mv it into place.
# `--delete` is intentional so removed pages (e.g. retired routes) don't
# linger in the legacy bundle.
H5_REMOTE_DIR="/home/ubuntu/crown-gold/wwwroot_F5PEa/application/member/h5"
H5_STAGE="/tmp/cg_h5_stage_$$"
say "rsyncing static export → $REMOTE:$H5_REMOTE_DIR (via $H5_STAGE)"
ssh_run "rm -rf $H5_STAGE && mkdir -p $H5_STAGE"
rsync_to -az --delete "$EXPORT_STAGE/" "$REMOTE:$H5_STAGE/"
ssh_run "
    set -e
    sudo rsync -a --delete $H5_STAGE/ $H5_REMOTE_DIR/
    # Strip macOS dotfiles that occasionally hitch a ride from the dev box.
    sudo find $H5_REMOTE_DIR -name '._*' -delete
    sudo chown -R www-data:www-data $H5_REMOTE_DIR
    rm -rf $H5_STAGE
"
rm -rf "$EXPORT_STAGE"

# ---- 4. rsync api + scripts + requirements ---------------------------------
say "rsyncing FastAPI backend + ingest scripts"
rsync_to -az --delete --exclude '__pycache__' --exclude '*.pyc' \
    "$BACKEND_DIR/" "$REMOTE:$REMOTE_ROOT/api/backend/"
rsync_to -az --delete --exclude '__pycache__' --exclude '*.pyc' \
    "$SCRIPTS_DIR/" "$REMOTE:$REMOTE_ROOT/api/scripts/"

say "installing python deps into venv"
ssh_run "$REMOTE_ROOT/venv/bin/pip install --quiet -r $REMOTE_ROOT/api/backend/requirements.txt certifi"

# ---- 5. systemd, nginx, cron, env file -------------------------------------
# All /etc writes go via /tmp + `sudo mv` since the deploy user (ubuntu)
# can't scp directly into /etc/systemd, /etc/nginx, /etc/cron.d, etc.
say "installing systemd units, nginx site, cron, env file"
scp_to -q \
    "$DEPLOY_DIR/pmppm-com-web.service" \
    "$DEPLOY_DIR/pmppm-com-api.service" \
    "$DEPLOY_DIR/nginx-pmppm-com.conf" \
    "$DEPLOY_DIR/pmppm-com-ingest.cron" \
    "$REMOTE:/tmp/"
ssh_run "
    set -e
    sudo mv /tmp/pmppm-com-web.service /etc/systemd/system/pmppm-com-web.service
    sudo mv /tmp/pmppm-com-api.service /etc/systemd/system/pmppm-com-api.service
    sudo mv /tmp/nginx-pmppm-com.conf  /etc/nginx/sites-available/pmppm-com
    sudo mv /tmp/pmppm-com-ingest.cron /etc/cron.d/pmppm-com-ingest
    sudo chown root:root /etc/systemd/system/pmppm-com-web.service \
                         /etc/systemd/system/pmppm-com-api.service \
                         /etc/nginx/sites-available/pmppm-com \
                         /etc/cron.d/pmppm-com-ingest
    sudo chmod 644 /etc/systemd/system/pmppm-com-web.service \
                   /etc/systemd/system/pmppm-com-api.service \
                   /etc/nginx/sites-available/pmppm-com
    sudo chmod 644 /etc/cron.d/pmppm-com-ingest
"

# Env file with API keys. chmod 600 so it isn't world-readable.
# Idempotent merge: keys we manage (ODDS_API_KEY, APISPORTS_KEY,
# ODDSAPI_DB_PATH) get rewritten every deploy, but operator-provided
# secrets like THEODDSAPI_KEY (the-odds-api.com proxy used by
# /api/external/outrights) and CROWN_MYSQL_PASS (db_sports access for
# the FastAPI MySQL reader) are preserved across re-deploys.  Without
# this guard a `bash deploy.sh` would silently break /outrights and
# every endpoint that touches Crown's MySQL.
ssh_run "sudo bash -s" <<EOF
set -e
EXISTING=/etc/default/pmppm-com.env
# Capture the operator-managed keys before we rewrite the file.
THEODDSAPI_KEY_LINE=\$(sudo grep '^THEODDSAPI_KEY=' \$EXISTING 2>/dev/null || true)
CROWN_MYSQL_PASS_LINE=\$(sudo grep '^CROWN_MYSQL_PASS=' \$EXISTING 2>/dev/null || true)
sudo tee \$EXISTING >/dev/null <<INNER
ODDS_API_KEY=$ODDS_API_KEY
APISPORTS_KEY=$APISPORTS_KEY
ODDSAPI_DB_PATH=$REMOTE_ROOT/data/oddsapi.sqlite
INNER
[ -n "\$THEODDSAPI_KEY_LINE"   ] && echo "\$THEODDSAPI_KEY_LINE"   | sudo tee -a \$EXISTING >/dev/null
[ -n "\$CROWN_MYSQL_PASS_LINE" ] && echo "\$CROWN_MYSQL_PASS_LINE" | sudo tee -a \$EXISTING >/dev/null
sudo chmod 600 \$EXISTING
EOF

# Splice pmppm.com out of the shared `hga` server_name so the dedicated
# block below wins. Idempotent: only edits if pmppm.com is present.
ssh_run "
    HGA=/etc/nginx/sites-enabled/hga
    BACKUPS=/root/nginx-backups
    sudo mkdir -p \$BACKUPS
    if sudo grep -qE 'server_name pmpm\\.uk www\\.pmpm\\.uk pmppm\\.com www\\.pmppm\\.com' \$HGA 2>/dev/null; then
        # Backup OUTSIDE sites-enabled — nginx parses every file there as
        # config and would complain about duplicate upstreams otherwise.
        sudo cp \$HGA \$BACKUPS/hga.\$(date +%s).bak
        sudo sed -i 's/server_name pmpm\\.uk www\\.pmpm\\.uk pmppm\\.com www\\.pmppm\\.com;/server_name pmpm.uk www.pmpm.uk;/' \$HGA
        echo 'pmppm.com removed from hga site'
    else
        echo 'hga site already split (no pmppm.com present)'
    fi
    sudo ln -sfn /etc/nginx/sites-available/pmppm-com /etc/nginx/sites-enabled/pmppm-com
    sudo nginx -t
"

# ---- 6. first ingest so the DB has data before services come up ------------
say "running first ingest (may take ~30s)"
# Mirror production: pmppm-com-api.service and the cron both run as root
# and source the 0600-root env file directly, so the deploy-time ingest
# does the same. Output is tailed so we surface immediate failures
# (HTTP 4xx from odds-api.io, schema mismatches, etc.).
ssh_run "sudo bash -c '. /etc/default/pmppm-com.env && $REMOTE_ROOT/venv/bin/python3 $REMOTE_ROOT/api/scripts/ingest_oddsapi.py' 2>&1 | tail -20"

# ---- 7. boot services ------------------------------------------------------
say "starting / restarting services"
ssh_run "
    sudo systemctl daemon-reload
    sudo systemctl enable --now pmppm-com-api.service
    sudo systemctl restart pmppm-com-api.service
    sudo systemctl enable --now pmppm-com-web.service
    sudo systemctl restart pmppm-com-web.service
    sudo systemctl reload  nginx
    systemctl status --no-pager pmppm-com-api.service pmppm-com-web.service | head -20
"

# ---- 8. smoke test ---------------------------------------------------------
say "smoke testing"
ssh_run "
    set -e
    curl -sS --max-time 5 -o /dev/null -w 'api /health        : %{http_code}\n'         http://127.0.0.1:8787/health
    curl -sS --max-time 5 -o /dev/null -w 'api /api/external/leagues : %{http_code}\n'  http://127.0.0.1:8787/api/external/leagues
    curl -sS --max-time 5 -o /dev/null -w 'web /sports        : %{http_code}\n'         http://127.0.0.1:3003/sports
    curl -sS --max-time 5 -o /dev/null -w 'crown /h5/sports.html : %{http_code}\n'      http://127.0.0.1:8080/h5/sports.html
"

# Public smoke (through Cloudflare) — best-effort.
say "public smoke (Cloudflare → origin)"
for url in \
    "https://pmppm.com/" \
    "https://pmppm.com/sports" \
    "https://pmppm.com/h5/sports.html" \
    "https://pmppm.com/api/external/leagues" \
    "https://pmppm.com/health"
do
    code=$(curl -sS --max-time 8 -o /dev/null -w '%{http_code}' "$url" || true)
    redirect=$(curl -sSI --max-time 8 "$url" 2>/dev/null | awk 'tolower($1) ~ /^location:/{print $2}' | tr -d '\r' | head -1)
    printf '%-44s %s%s\n' "$url" "$code" "${redirect:+  → $redirect}"
done

say "done. live at https://pmppm.com/sports and https://pmppm.com/h5/sports.html"
