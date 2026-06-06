# MySQL 5.7 + 自动把 db_client / db_sports 注入 datadir
# 构建上下文需要在 Crown-gold/ 根（compose 已设 context: ..），以便 COPY 到 db_client / db_sports
FROM mysql:5.7

# 把数据文件复制到 /seed（首次启动时由 init-restore.sh 拷进 /var/lib/mysql）
COPY db_client  /seed/db_client
COPY db_sports  /seed/db_sports

COPY repro/mysql/init-restore.sh /usr/local/bin/init-restore.sh
RUN chmod +x /usr/local/bin/init-restore.sh \
    && chown -R mysql:mysql /seed

ENTRYPOINT ["init-restore.sh"]
CMD ["mysqld"]
