#!/bin/bash
# 顺序：1) 先初始化 mysql 系统库 + 设 root 密码  2) 注入 MyISAM 数据  3) 交还给官方 entrypoint 启动
set -e
DATADIR=/var/lib/mysql

if [ ! -d "${DATADIR}/mysql" ]; then
  echo "[init-restore] (1/3) initializing system database in ${DATADIR}"
  mysqld --initialize-insecure \
         --datadir="${DATADIR}" \
         --user=mysql \
         --explicit_defaults_for_timestamp

  echo "[init-restore] (2/3) starting tmp mysqld to set root password"
  SOCK=/tmp/init.sock
  mysqld --user=mysql --datadir="${DATADIR}" --skip-networking \
         --socket="${SOCK}" --pid-file=/tmp/init.pid &
  for i in $(seq 1 60); do
    if mysqladmin --socket="${SOCK}" ping >/dev/null 2>&1; then break; fi
    sleep 1
  done

  mysql --socket="${SOCK}" <<-SQL
    ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
    CREATE USER 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
SQL

  mysqladmin --socket="${SOCK}" -uroot -p"${MYSQL_ROOT_PASSWORD}" shutdown
  wait || true

  echo "[init-restore] (3/3) injecting db_client / db_sports"
  cp -a /seed/db_client  "${DATADIR}/"
  cp -a /seed/db_sports  "${DATADIR}/"
  chown -R mysql:mysql "${DATADIR}/db_client" "${DATADIR}/db_sports"
  chmod -R u+rwX,g+rX  "${DATADIR}/db_client" "${DATADIR}/db_sports"
fi

# 官方 entrypoint 见到 mysql 系统库已存在，会直接 exec mysqld
exec /usr/local/bin/docker-entrypoint.sh "$@"
