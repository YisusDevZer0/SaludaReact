# Dockerización del Proyecto SaludaReact

Este documento explica cómo dockerizar y ejecutar el proyecto SaludaReact usando Docker.

## 📋 Estructura del Proyecto

```
SaludaReact/
├── SaludaFront/          # Frontend React
├── SaludaBack/           # Backend Laravel
├── nginx/                # Configuración de Nginx
├── docker-compose.yml    # Configuración principal
├── docker-compose.dev.yml # Configuración para desarrollo
├── env.example           # Variables de entorno
└── README_Docker.md      # Esta documentación
```

## 🚀 Configuración Inicial

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus credenciales de base de datos:

```env
# Base de datos principal
DB_HOST=srv1545.hstgr.io
DB_PORT=3306
DB_DATABASE=u155356178_SaludaDB
DB_USERNAME=u155356178_SaludaUser
DB_PASSWORD=tu_password_aqui

# Base de datos secundaria (huellas)
DB_SECOND_HOST=srv1545.hstgr.io
DB_SECOND_PORT=3306
DB_SECOND_DATABASE=u155356178_SaludaHuellas
DB_SECOND_USERNAME=u155356178_SaludaCapturad
DB_SECOND_PASSWORD=z3Z1Huellafo!Tmm]56178
```

## 🐳 Comandos Docker

### Producción

```bash
# Construir y ejecutar todos los servicios
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir un servicio específico
docker-compose up -d --build backend
```

### Desarrollo

```bash
# Ejecutar en modo desarrollo (con hot reload)
docker-compose -f docker-compose.dev.yml up -d --build

# Ver logs de desarrollo
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios de desarrollo
docker-compose -f docker-compose.dev.yml down
```

### Comandos Útiles

```bash
# Entrar al contenedor del backend
docker exec -it saludaback bash

# Ejecutar comandos de Laravel
docker exec -it saludaback php artisan migrate
docker exec -it saludaback php artisan config:clear

# Entrar al contenedor del frontend
docker exec -it saludafront sh

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Nginx Proxy**: http://localhost:80 (si se usa)

## 🔧 Configuraciones Específicas

### Frontend (React)

- **Puerto**: 3000
- **Hot Reload**: Habilitado en desarrollo
- **Proxy**: Configurado para apuntar al backend en puerto 8000

### Backend (Laravel)

- **Puerto**: 8000
- **PHP**: 8.2 con Apache
- **Extensiones**: pdo_mysql, mbstring, exif, pcntl, bcmath, gd, zip
- **Optimizaciones**: OPcache habilitado

### Base de Datos

- **Conexión Principal**: MySQL remoto (srv1545.hstgr.io)
- **Conexión Secundaria**: MySQL remoto para huellas
- **No se incluye base de datos local** (como solicitado)

## 📁 Estructura de Archivos Docker

### Frontend
```
SaludaFront/
├── Dockerfile          # Producción
├── Dockerfile.dev      # Desarrollo
└── nginx.conf         # Configuración de Nginx
```

### Backend
```
SaludaBack/
├── Dockerfile          # Producción
├── Dockerfile.dev      # Desarrollo
└── docker/
    ├── php.ini        # Configuración PHP
    ├── apache.conf    # Configuración Apache
    └── supervisord.conf # Configuración Supervisor
```

### Nginx
```
nginx/
├── Dockerfile
└── conf.d/
    └── default.conf   # Configuración del proxy
```

## 🔒 Configuración de Seguridad

### Headers de Seguridad
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy
- Content-Security-Policy

### CORS
- Configurado para permitir comunicación entre frontend y backend
- Headers apropiados para API REST

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de permisos en storage**
   ```bash
   docker exec -it saludaback chown -R www-data:www-data storage bootstrap/cache
   ```

2. **Error de conexión a base de datos**
   - Verifica las credenciales en `.env`
   - Asegúrate de que el servidor MySQL esté accesible

3. **Error de puertos ocupados**
   ```bash
   # Verificar puertos en uso
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :8000
   
   # Cambiar puertos en docker-compose.yml si es necesario
   ```

4. **Error de memoria insuficiente**
   - Aumenta la memoria asignada a Docker
   - Reduce el límite de memoria en `php.ini`

### Logs Útiles

```bash
# Logs del backend
docker-compose logs backend

# Logs del frontend
docker-compose logs frontend

# Logs de Apache
docker exec -it saludaback tail -f /var/log/apache2/error.log

# Logs de PHP
docker exec -it saludaback tail -f /var/log/php_errors.log
```

## 🔄 Actualizaciones

### Actualizar Dependencias

```bash
# Frontend
docker exec -it saludafront npm update

# Backend
docker exec -it saludaback composer update
```

### Reconstruir Imágenes

```bash
# Reconstruir todo
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Reconstruir solo backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

## 📊 Monitoreo

### Estadísticas de Contenedores

```bash
# Ver uso de recursos
docker stats

# Ver procesos en contenedores
docker exec -it saludaback ps aux
docker exec -it saludafront ps aux
```

### Health Checks

```bash
# Verificar estado de servicios
docker-compose ps

# Verificar conectividad
curl http://localhost:3000
curl http://localhost:8000/api/health
```

## 🎯 Optimizaciones

### Para Producción

1. **Usar imágenes multi-stage** (ya implementado)
2. **Optimizar capas de Docker**
3. **Configurar volúmenes persistentes**
4. **Implementar health checks**

### Para Desarrollo

1. **Hot reload habilitado**
2. **Volúmenes montados para cambios en tiempo real**
3. **Debug habilitado**
4. **Logs detallados**

## 📝 Notas Importantes

- **Base de datos remota**: No se incluye MySQL local como solicitado
- **Puertos**: 3000 (frontend), 8000 (backend), 80/443 (nginx)
- **Red**: Red personalizada `saludanetwork` para comunicación entre servicios
- **Volúmenes**: Configurados para persistencia de datos y hot reload
- **Supervisor**: Gestiona múltiples procesos en el backend

## 🤝 Contribución

Para contribuir al proyecto:

1. Usa `docker-compose.dev.yml` para desarrollo
2. Sigue las convenciones de Docker
3. Actualiza esta documentación si es necesario
4. Prueba en ambos entornos (desarrollo y producción) 