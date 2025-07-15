# Dockerfile principal para construir toda la aplicación SaludaReact
# Este archivo es opcional y se puede usar para construir todo el proyecto

# Etapa 1: Construir Frontend
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

# Copiar archivos del frontend
COPY SaludaFront/package*.json ./
RUN npm ci --only=production

COPY SaludaFront/ ./
RUN npm run build

# Etapa 2: Construir Backend
FROM php:8.2-apache as backend-build

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
    nodejs \
    npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && a2enmod rewrite

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar archivos del backend
COPY SaludaBack/composer*.json ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

COPY SaludaBack/ ./

# Crear directorios necesarios
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Etapa 3: Imagen final
FROM nginx:alpine

# Copiar frontend construido
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html

# Copiar backend construido
COPY --from=backend-build /var/www/html /var/www/html

# Copiar configuración de nginx
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Exponer puertos
EXPOSE 80 443

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"] 