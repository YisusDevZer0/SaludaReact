#!/bin/bash

# Script de entrada para Docker
set -e

echo "Iniciando configuración de Laravel..."

# Cambiar al directorio de la aplicación
cd /var/www/html

# Copiar archivo de configuración de entorno si no existe
if [ ! -f .env ]; then
    echo "Copiando archivo .env desde env.example..."
    cp env.example .env
fi

# Generar clave de aplicación si no existe
if [ -z "$(grep '^APP_KEY=' .env | cut -d '=' -f2)" ] || [ "$(grep '^APP_KEY=' .env | cut -d '=' -f2)" = "" ]; then
    echo "Generando clave de aplicación..."
    php artisan key:generate --no-interaction
fi

# Generar claves de Passport si no existen
if [ ! -f storage/oauth-private.key ] || [ ! -f storage/oauth-public.key ]; then
    echo "Generando claves de Passport..."
    php artisan passport:keys --force --no-interaction
fi

# Limpiar cachés
echo "Limpiando cachés..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimizar Laravel
echo "Optimizando Laravel..."
php artisan config:cache || echo "Config cache failed, continuing..."
php artisan route:cache || echo "Route cache failed, continuing..."
php artisan view:cache || echo "View cache failed, continuing..."

# Establecer permisos
echo "Estableciendo permisos..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "Configuración completada. Iniciando supervisor..."

# Ejecutar el comando original
exec "$@" 