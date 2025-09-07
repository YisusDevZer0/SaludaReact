# Usar imagen oficial de PHP 8.2 con Apache
FROM php:8.2-apache

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && a2enmod rewrite \
    && a2enmod headers

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Instalar Node.js y npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Instalar nodemon globalmente
RUN npm install -g nodemon

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar todo el código fuente primero
COPY . .

# Instalar dependencias de PHP (sin optimización para desarrollo)
RUN composer install --no-interaction --no-scripts --no-autoloader \
    && composer clear-cache

# Instalar dependencias de Node.js
RUN if [ -f "package.json" ]; then npm install; fi

# Crear directorios necesarios y establecer permisos
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copiar archivos de configuración si existen
RUN if [ -f "docker/php.ini" ]; then cp docker/php.ini /usr/local/etc/php/; fi \
    && if [ -f "docker/apache.conf" ]; then cp docker/apache.conf /etc/apache2/sites-available/000-default.conf; fi

# Configurar entorno de desarrollo
RUN if [ ! -f ".env" ] && [ -f ".env.example" ]; then \
        cp .env.example .env \
        && php artisan key:generate --no-interaction || echo "Key generation failed"; \
    fi

# Exponer puerto
EXPOSE 8000

# Comando para desarrollo con hot reload
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=8000"]