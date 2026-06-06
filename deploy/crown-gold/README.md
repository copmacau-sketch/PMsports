# Crown-Gold 服务器部署（3.25.180.205）

## 现状一句话

`3.25.180.205` 上的 Crown-Gold (`wwwroot_F5PEa/`) 由 **nginx + php7.4-fpm** 提供。Apache 在 2026-05-26 被停且 `disable`。MySQL 应用层从 root 切到低权限 `crown_app@127.0.0.1`，凭据走 systemd `EnvironmentFile=/etc/cg-db.env` 注入 php-fpm worker。安全审计 P0/P1/P2 已修。

## 文件清单

| 文件 | 状态 | 用途 |
|---|---|---|
| `nginx-crown-gold.conf`         | **活** | nginx vhost on :8080，PHP via php7.4-fpm.sock。手工 scp 到 `/etc/nginx/sites-available/crown-gold` |
| `collector/crown_gold_collector.py` | **活** | BAT.exe 替代 — Python supervisor，跑 14 个 bdata/* 采集脚本 |
| `collector/crown-gold-collector.service` | **活** | systemd unit |
| `php-timezone.ini`              | **活** | PHP 时区（CLI/FPM 公用），dropped into `/etc/php/7.4/{cli,fpm}/conf.d/` |
| `settle_bets.cron`              | **活** | 5 分钟一次跑 `settle_bets.php`（API-Sports.io 结算） |
| `deploy_settlement.sh`          | **活** | scp 推送 `api_v2.php` / `settle_bets.php` / `.htaccess` / `settle_bets.cron` |
| `deploy.sh`                     | **半活** | 仅 `./deploy.sh collector` 和 `./deploy.sh status` 子命令有效；`apache`/`all` 已 deprecated 并强制 exit 2 |
| `apache-crown-gold.conf`        | **DEPRECATED** | Apache vhost — 仅留作历史参考，DO NOT a2ensite |
| `api_v2.php`                    | **DEPRECATED** | 已截断为 stub。真正的 api_v2.php 在 `wwwroot_F5PEa/application/member/api_v2.php` |

## 常用部署命令

```bash
# 推送 PHP 业务代码（api_v2.php / settle_bets.php / .htaccess / cron）
./deploy_settlement.sh

# 推送 / 更新 14 个采集脚本的 systemd 监督器
export CG_SSH_KEY=/Volumes/T7/Crown-gold/Crowngold.pem
./deploy.sh collector

# 看现状（只读，安全）
./deploy.sh status

# nginx 配置（手工，因为前端 vhost pmppm-com 也要一起改时有依赖）
scp -i $CG_SSH_KEY nginx-crown-gold.conf ubuntu@3.25.180.205:/tmp/
ssh -i $CG_SSH_KEY ubuntu@3.25.180.205 'sudo install -o root -g root -m 644 /tmp/nginx-crown-gold.conf /etc/nginx/sites-available/crown-gold && sudo nginx -t && sudo systemctl reload nginx'
```

## URL → 文件夹

```
http://127.0.0.1:8080/         → application/member  (H5 + index.html 登录页)
http://127.0.0.1:8080/d0/      → application/d0      (报表)
http://127.0.0.1:8080/agents/  → application/agents  (代理)
http://127.0.0.1:8080/admin/   → application/admin   (后台)
http://127.0.0.1:8080/static/  → wwwroot_F5PEa/static
```

`vendor/` 和 `bdata/` 通过 `location ~ ^/(vendor|bdata)(/|$) { return 403; }` 完全屏蔽。

公网入口（HTTPS）由 `deploy/pmppm-com/nginx-pmppm-com.conf` 终结，反向代理到本机 `:8080`。

## 凭据 / 密钥

| 项 | 位置 | 权限 |
|---|---|---|
| MySQL `crown_app` 密码 | `/etc/cg-db.env`（线上） | root:root 600 |
| MySQL root 密码 | `49f0863e9070`（硬编 — 仍是 fallback） | — |
| odds-api.io API key | `/etc/default/pmppm-com.env`（线上） | root:root 600 |
| api-sports.io API key | `application/member/settle_bets.php` 内硬编 | — |
| Crown-Gold ssh 私钥 | `/Volumes/T7/Crown-gold/Crowngold.pem`（本地） | 400 |

要轮转 MySQL `crown_app` 密码：
```bash
NEW_PW=$(openssl rand -hex 24)
ssh ubuntu@3.25.180.205 "mysql -uroot -p49f0863e9070 -e \"ALTER USER 'crown_app'@'127.0.0.1' IDENTIFIED BY '$NEW_PW'; FLUSH PRIVILEGES\""
ssh ubuntu@3.25.180.205 "sudo sed -i 's|^CG_DB_PASS=.*|CG_DB_PASS=$NEW_PW|' /etc/cg-db.env && sudo systemctl restart php7.4-fpm"
```

## 历史 / 回滚

- 2026-05-26：Apache 停 + nginx 接管 :8080；MySQL 切 crown_app；密码哈希 md5(md5()) → argon2id 透明迁移
- 2026-05-22：自动结算 (settle_bets.php) 上线
- 2026-05-21：H5 SPA 切到 `/api/auth/login` JSON 接口

回滚到 Apache 时代是单向操作，需要先在 nginx 上挪 :8080 vhost，再 `a2ensite crown-gold && systemctl start apache2`。**不建议**。
