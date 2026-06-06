FROM php:7.4-apache

# 必要扩展
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        libzip-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev libcurl4-openssl-dev \
    ; \
    docker-php-ext-configure gd --with-freetype --with-jpeg; \
    docker-php-ext-install -j$(nproc) pdo_mysql mysqli gd zip opcache; \
    rm -rf /var/lib/apt/lists/*

# Apache 配置：DocumentRoot 指向会员端，并允许 .htaccess
ENV APACHE_DOCUMENT_ROOT=/var/www/application/member
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
            -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf \
            -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite headers

# DirectoryIndex：index.html 优先，便于首页只显示登录
RUN printf '<Directory %s>\n  Options -Indexes +FollowSymLinks\n  AllowOverride None\n  Require all granted\n  DirectoryIndex index.html index.php\n</Directory>\n' "${APACHE_DOCUMENT_ROOT}" \
    > /etc/apache2/conf-available/zz-docroot.conf \
    && a2enconf zz-docroot

# PHP 运行时设置
RUN { \
      echo 'date.timezone = Asia/Shanghai'; \
      echo 'session.save_path = /tmp'; \
      echo 'session.use_strict_mode = 1'; \
      echo 'session.auto_start = 1'; \
      echo 'display_errors = Off'; \
      echo 'log_errors = On'; \
      echo 'error_log = /var/log/php-error.log'; \
      echo 'post_max_size = 32M'; \
      echo 'upload_max_filesize = 32M'; \
      echo 'short_open_tag = On'; \
      echo '; --- opcache ---'; \
      echo 'opcache.enable = 1'; \
      echo 'opcache.enable_cli = 0'; \
      echo 'opcache.memory_consumption = 128'; \
      echo 'opcache.interned_strings_buffer = 16'; \
      echo 'opcache.max_accelerated_files = 20000'; \
      echo 'opcache.validate_timestamps = 1'; \
      echo 'opcache.revalidate_freq = 2'; \
      echo 'realpath_cache_size = 4096K'; \
      echo 'realpath_cache_ttl = 600'; \
    } > /usr/local/etc/php/conf.d/zz-app.ini

EXPOSE 80
