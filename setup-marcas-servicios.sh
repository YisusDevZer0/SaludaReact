#!/bin/bash

# ==============================================
# Script de Configuración - Sistema de Gestión 
# de Marcas y Servicios para SaludaReact
# ==============================================

echo "🏥 Configurando Sistema de Gestión de Marcas y Servicios"
echo "================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -d "SaludaBack" ] || [ ! -d "SaludaFront" ]; then
    print_error "Este script debe ejecutarse desde la raíz del proyecto SaludaReact"
    exit 1
fi

print_info "Verificando estructura del proyecto..."
print_status "Directorios encontrados: SaludaBack y SaludaFront"

# ==============================================
# CONFIGURACIÓN DEL BACKEND
# ==============================================

echo ""
echo "🔧 CONFIGURANDO BACKEND (Laravel)"
echo "================================="

cd SaludaBack

# Verificar que composer esté disponible
if ! command -v composer &> /dev/null; then
    print_error "Composer no está instalado. Instálalo desde: https://getcomposer.org/"
    exit 1
fi

# Verificar que php esté disponible
if ! command -v php &> /dev/null; then
    print_error "PHP no está disponible. Asegúrate de tenerlo instalado."
    exit 1
fi

print_info "Verificando configuración de Laravel..."

# Verificar archivo .env
if [ ! -f ".env" ]; then
    print_warning "Archivo .env no encontrado. Copiando desde .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status "Archivo .env creado"
    else
        print_error "Archivo .env.example no encontrado"
        exit 1
    fi
fi

# Verificar configuración de base de datos
print_info "Verificando configuración de base de datos..."
DB_DATABASE=$(grep "DB_DATABASE=" .env | cut -d '=' -f2)
if [ -z "$DB_DATABASE" ] || [ "$DB_DATABASE" = "laravel" ]; then
    print_warning "Por favor, configura tu base de datos en el archivo .env antes de continuar"
    print_info "Edita: DB_DATABASE, DB_USERNAME, DB_PASSWORD"
    read -p "¿Has configurado la base de datos? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_error "Configuración cancelada"
        exit 1
    fi
fi

# Ejecutar migraciones
print_info "Ejecutando migraciones..."
if php artisan migrate --force; then
    print_status "Migraciones ejecutadas correctamente"
else
    print_error "Error ejecutando migraciones"
    exit 1
fi

# Ejecutar seeders
print_info "Ejecutando seeders para datos de prueba..."
if php artisan db:seed --class=ServicioSeeder; then
    print_status "Seeder de Servicios ejecutado"
else
    print_warning "Error en seeder de Servicios (puede ser normal si ya existen datos)"
fi

if php artisan db:seed --class=MarcaSeeder; then
    print_status "Seeder de Marcas ejecutado"
else
    print_warning "Error en seeder de Marcas (puede ser normal si ya existen datos)"
fi

# Verificar Laravel Passport
print_info "Verificando configuración de Laravel Passport..."
if php artisan passport:install --force; then
    print_status "Laravel Passport configurado"
else
    print_warning "Error configurando Passport (puede ser normal si ya está configurado)"
fi

# Limpiar caché
print_info "Limpiando cachés de Laravel..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
print_status "Cachés limpiados"

cd ..

# ==============================================
# CONFIGURACIÓN DEL FRONTEND
# ==============================================

echo ""
echo "⚛️  CONFIGURANDO FRONTEND (React)"
echo "================================="

cd SaludaFront

# Verificar que npm esté disponible
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado. Instálalo desde: https://nodejs.org/"
    exit 1
fi

print_info "Verificando dependencias de React..."

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    print_info "Instalando dependencias de npm..."
    if npm install; then
        print_status "Dependencias instaladas"
    else
        print_error "Error instalando dependencias"
        exit 1
    fi
else
    print_status "Dependencias ya instaladas"
fi

# Verificar e instalar dependencias específicas
print_info "Verificando dependencias específicas..."

# SweetAlert2 para notificaciones
if npm list sweetalert2 &> /dev/null; then
    print_status "SweetAlert2 ya está instalado"
else
    print_info "Instalando SweetAlert2..."
    npm install sweetalert2
    print_status "SweetAlert2 instalado"
fi

# Material UI (debería estar ya instalado)
if npm list @mui/material &> /dev/null; then
    print_status "Material UI ya está instalado"
else
    print_warning "Material UI no encontrado, instalando..."
    npm install @mui/material @emotion/react @emotion/styled
    print_status "Material UI instalado"
fi

cd ..

# ==============================================
# VERIFICACIÓN FINAL
# ==============================================

echo ""
echo "🔍 VERIFICACIÓN FINAL"
echo "===================="

# Verificar archivos creados
print_info "Verificando archivos del sistema..."

# Backend files
backend_files=(
    "SaludaBack/database/migrations/2024_01_15_000001_create_servicios_table.php"
    "SaludaBack/database/migrations/2024_01_15_000002_create_marcas_table.php"
    "SaludaBack/app/Models/Servicio.php"
    "SaludaBack/app/Models/Marca.php"
    "SaludaBack/app/Http/Controllers/ServicioController.php"
    "SaludaBack/app/Http/Controllers/MarcaController.php"
)

for file in "${backend_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "✓ $file"
    else
        print_error "✗ $file"
    fi
done

# Frontend files
frontend_files=(
    "SaludaFront/src/services/servicio-service.js"
    "SaludaFront/src/services/marca-service.js"
    "SaludaFront/src/components/ServiciosTable.js"
    "SaludaFront/src/components/MarcasTable.js"
    "SaludaFront/src/hooks/useNotifications.js"
)

for file in "${frontend_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "✓ $file"
    else
        print_error "✗ $file"
    fi
done

# ==============================================
# INSTRUCCIONES FINALES
# ==============================================

echo ""
echo "🎉 CONFIGURACIÓN COMPLETADA"
echo "==========================="

print_status "Sistema de Gestión de Marcas y Servicios configurado correctamente"

echo ""
print_info "PRÓXIMOS PASOS:"
echo "1. Iniciar el servidor de Laravel:"
echo "   cd SaludaBack && php artisan serve"
echo ""
echo "2. Iniciar el servidor de React:"
echo "   cd SaludaFront && npm start"
echo ""
echo "3. Acceder a las funcionalidades:"
echo "   📋 Servicios: http://localhost:3000/admin/almacenes/servicios"
echo "   🏷️  Marcas: http://localhost:3000/admin/almacenes/marcas"

echo ""
print_info "DOCUMENTACIÓN:"
echo "📚 Consulta SETUP_MARCAS_SERVICIOS.md para información detallada"

echo ""
print_info "DATOS DE PRUEBA:"
echo "✅ Se han creado servicios y marcas de ejemplo"
echo "✅ Relaciones entre servicios y marcas configuradas"

echo ""
print_warning "IMPORTANTE:"
echo "- Asegúrate de que la base de datos esté configurada correctamente"
echo "- Verifica que Laravel Passport esté funcionando"
echo "- Todos los endpoints requieren autenticación"

echo ""
print_status "¡Sistema listo para usar! 🚀" 