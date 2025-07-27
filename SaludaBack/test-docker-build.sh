#!/bin/bash

# Script para probar la construcción de Docker localmente
set -e

echo "🧪 Probando construcción de Docker para Railway..."

# Verificar que estamos en el directorio correcto
if [ ! -f "Dockerfile" ]; then
    echo "❌ Error: No se encontró Dockerfile en el directorio actual"
    echo "   Ejecuta este script desde el directorio SaludaBack/"
    exit 1
fi

# Verificar que existe el archivo env.example
if [ ! -f "env.example" ]; then
    echo "❌ Error: No se encontró env.example"
    echo "   Asegúrate de que el archivo env.example esté en el directorio SaludaBack/"
    exit 1
fi

# Verificar que existe el script de entrada
if [ ! -f "docker-entrypoint.sh" ]; then
    echo "❌ Error: No se encontró docker-entrypoint.sh"
    exit 1
fi

echo "✅ Archivos necesarios encontrados"

# Construir la imagen de Docker
echo "🔨 Construyendo imagen de Docker..."
docker build -t saluda-backend-test .

if [ $? -eq 0 ]; then
    echo "✅ Construcción exitosa"
    
    # Probar el contenedor
    echo "🚀 Probando contenedor..."
    docker run --rm -d --name saluda-test -p 8000:8000 saluda-backend-test
    
    # Esperar un momento para que el contenedor se inicie
    sleep 10
    
    # Verificar si el contenedor está ejecutándose
    if docker ps | grep -q saluda-test; then
        echo "✅ Contenedor ejecutándose correctamente"
        
        # Verificar logs
        echo "📋 Logs del contenedor:"
        docker logs saluda-test
        
        # Detener el contenedor
        docker stop saluda-test
        echo "🛑 Contenedor detenido"
    else
        echo "❌ El contenedor no se está ejecutando"
        docker logs saluda-test
    fi
else
    echo "❌ Error en la construcción"
    exit 1
fi

echo "🎉 Prueba completada. Si todo está bien, puedes desplegar en Railway." 