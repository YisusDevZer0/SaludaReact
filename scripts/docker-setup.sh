#!/bin/bash

# Script de configuración automática para Docker - SaludaReact
# Este script configura automáticamente el entorno Docker

set -e

echo "🐳 Configurando Docker para SaludaReact..."
echo "=========================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado. Por favor, instala Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose no está instalado. Por favor, instala Docker Compose primero."
        exit 1
    fi
    
    print_status "Docker y Docker Compose están instalados"
}

# Verificar si Docker está ejecutándose
check_docker_running() {
    if ! docker info &> /dev/null; then
        print_error "Docker no está ejecutándose. Por favor, inicia Docker."
        exit 1
    fi
    
    print_status "Docker está ejecutándose"
}

# Crear archivo .env si no existe
setup_env() {
    if [ ! -f .env ]; then
        print_status "Creando archivo .env desde env.example..."
        cp env.example .env
        print_warning "Por favor, edita el archivo .env con tus credenciales de base de datos"
    else
        print_status "Archivo .env ya existe"
    fi
}

# Crear directorios necesarios
create_directories() {
    print_status "Creando directorios necesarios..."
    
    # Crear directorio para logs de supervisor
    mkdir -p SaludaBack/storage/logs
    mkdir -p SaludaBack/bootstrap/cache
    
    # Crear directorio para SSL (opcional)
    mkdir -p nginx/ssl
    
    print_status "Directorios creados correctamente"
}

# Verificar puertos disponibles
check_ports() {
    print_status "Verificando puertos disponibles..."
    
    local ports=("3000" "8000" "80" "443")
    
    for port in "${ports[@]}"; do
        if netstat -tulpn 2>/dev/null | grep ":$port " > /dev/null; then
            print_warning "Puerto $port está en uso"
        else
            print_status "Puerto $port está disponible"
        fi
    done
}

# Construir imágenes Docker
build_images() {
    print_status "Construyendo imágenes Docker..."
    
    # Construir imágenes en paralelo
    docker-compose build --parallel
    
    print_status "Imágenes construidas correctamente"
}

# Ejecutar migraciones (opcional)
run_migrations() {
    read -p "¿Deseas ejecutar las migraciones de Laravel? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Ejecutando migraciones..."
        docker-compose up -d backend
        sleep 10  # Esperar a que el backend esté listo
        docker exec -it saludaback php artisan migrate --force
        print_status "Migraciones completadas"
    fi
}

# Mostrar información final
show_info() {
    echo
    echo "🎉 Configuración completada!"
    echo "============================"
    echo
    echo "Comandos útiles:"
    echo "  • Iniciar servicios: docker-compose up -d"
    echo "  • Ver logs: docker-compose logs -f"
    echo "  • Detener servicios: docker-compose down"
    echo "  • Desarrollo: docker-compose -f docker-compose.dev.yml up -d"
    echo
    echo "URLs de acceso:"
    echo "  • Frontend: http://localhost:3000"
    echo "  • Backend: http://localhost:8000"
    echo "  • Nginx: http://localhost:80"
    echo
    echo "Documentación: README_Docker.md"
}

# Función principal
main() {
    print_status "Iniciando configuración de Docker..."
    
    check_docker
    check_docker_running
    setup_env
    create_directories
    check_ports
    
    read -p "¿Deseas construir las imágenes Docker ahora? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        build_images
        run_migrations
    fi
    
    show_info
}

# Ejecutar función principal
main "$@" 