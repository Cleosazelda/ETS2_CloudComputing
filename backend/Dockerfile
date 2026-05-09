# Menggunakan image PHP 8.2 dengan FPM
FROM php:8.4-fpm-alpine

# Install dependensi sistem yang dibutuhkan untuk Laravel dan ekstensi PHP
RUN apk add --no-cache \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    nginx \
    supervisor

# Install ekstensi PHP (PDO MySQL sangat penting untuk terhubung ke RDS)
RUN docker-php-ext-install pdo pdo_mysql bcmath gd xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Salin seluruh file proyek (kecuali yang ada di .dockerignore)
COPY . .

# Install dependensi Composer untuk production
RUN composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs

# Set permission storage dan cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Salin konfigurasi Nginx dan Supervisor jika perlu
# (Sebagai contoh, file conf disiapkan jika Anda menggunakan arsitektur container tunggal dengan supervisor,
#  namun jika untuk ECS disarankan Nginx dan PHP-FPM di container terpisah. 
#  Disini kita siapkan default php-fpm dan menjalankannya.)

EXPOSE 9000

CMD ["php-fpm"]
