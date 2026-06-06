# Crown-Gold 前后端联调（Docker）

一键起 **MySQL 5.7（带 db_client / db_sports 数据）+ PHP 7.4 (Apache)**，前端 `index.html` 通过同源 `POST /transform.php?p=chk_login` 调用真后端登录。

## 拓扑

```
┌────────────── http://localhost:8080 (Apache) ──────────────┐
│                                                            │
│  /              → repro/index.html (登录页)                │
│  /transform.php → wwwroot_F5PEa/application/member/        │
│  /index.php     → 同上 (登录成功后跳转)                    │
│                                                            │
└─────────┬───────────────────────────────────────┬──────────┘
          │ PDO/mysqli                             │
          ▼                                        │
┌──── mysql:5.7 ────┐                              │
│  db_client/  ◀────── 自动从 db_client/ COPY      │
│  db_sports/  ◀────── 自动从 db_sports/ COPY      │
└───────────────────┘                              │
   listen 3307 (host) → 3306 (container)
```

## 文件作用

| 路径 | 说明 |
|---|---|
| `docker-compose.yml` | 编排两个服务 |
| `mysql/Dockerfile` | 基于 `mysql:5.7`，构建时把 `db_client/` `db_sports/` 烤入镜像 `/seed` |
| `mysql/init-restore.sh` | 容器首启时把 `/seed` 拷进 `/var/lib/mysql/` |
| `php/Dockerfile` | PHP 7.4-apache，装 `pdo_mysql/mysqli/gd/zip`，docroot 指向 `application/member` |
| `conf/mysql.config.php` | 通过 bind mount 覆盖 `vendor/mysql/config.php`，把 host 改成 `mysql` |
| `index.html` | 自包含登录页，POST `/transform.php?p=chk_login`，成功后跳 `/index.php?cu=Y...` |

## 启动

```bash
# 在 repro/ 目录下（compose 会用 ../ 作为 mysql 的 build context）
docker compose build
docker compose up -d

# 看日志
docker compose logs -f mysql
docker compose logs -f php
```

首次构建约 1–2 分钟（拉镜像 + 装 PHP 扩展）。

## 访问

打开 <http://localhost:8080/> ，看到登录页（CN/TW/EN 切换、表单、IP 卡、浏览器推荐）。

输入测试账号 → 点 **登入** → 浏览器 DevTools Network 应能看到：

```
POST /transform.php
Form: p=chk_login&langx=zh-cn&username=xxx&password=xxx&...
Resp: <?xml ...><document><status>error</status><msg>101</msg>... </document>
```

## 验证 DB 是否装好

```bash
# 进入 mysql 容器
docker compose exec mysql mysql -uroot -p49f0863e9070 -e "SHOW DATABASES;"

# 看会员表
docker compose exec mysql mysql -uroot -p49f0863e9070 db_client -e "SELECT id,name,loginname,uid FROM member LIMIT 5;"
```

正常应输出 4 个库：`db_client`, `db_sports`, `mysql`, `performance_schema`（+ 5.7 的 `sys`）。

## curl 直测后端

```bash
curl -sS -X POST http://localhost:8080/transform.php \
  --data-urlencode 'p=chk_login' \
  --data-urlencode 'langx=zh-cn' \
  --data-urlencode 'username=demo' \
  --data-urlencode 'password=Aa112233' \
  --data-urlencode 'ver=-3ed5-iovation-0000-95881ae5676be3' \
  --data-urlencode 'app=N' \
  --data-urlencode 'auto=HDICAD' \
  --data-urlencode 'blackbox=' \
  --data-urlencode 'userAgent=YnJvd3Nlcg==' | xmllint --format -
```

## 常见问题

### MySQL 数据没出现
首次启动后 datadir 用的是 docker volume `crown-gold-mysqldata`，`init-restore.sh` 只在 datadir 不存在 `db_client/` 时拷贝。如果想重新注入，先：

```bash
docker compose down
docker volume rm crown-gold-mysqldata
docker compose up -d
```

### 改了 `db_client/` `db_sports/` 想生效
要重新 build mysql 镜像（COPY 是 build-time）：

```bash
docker compose build mysql
docker volume rm crown-gold-mysqldata
docker compose up -d
```

### 想让首页恢复成原 SPA
注释掉 compose 里 `index.html` 的 bind mount：

```yaml
# - ./index.html:/var/www/application/member/index.html:ro
```

### 想让登录成功后停在登录页（不跳 SPA）
编辑 `index.html` 里 `loginRequest(...).then(...)` 的成功分支，把 `location.href = ...` 改成 `alert('登录成功：' + data.username)`。

## 安全提示

镜像里硬编码了原始 DB 密码 `49f0863e9070`，仅供本地复现用。**不要把镜像或 compose 推到公网仓库。**
