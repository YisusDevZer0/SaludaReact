# Despliegue en Railway

Este documento explica cómo desplegar la aplicación SaludaReact en Railway.

## Problema Resuelto

El error original era:
```
[stage-0 14/17] RUN php artisan key:generate --no-interaction 
process "/bin/sh -c php artisan key:generate --no-interaction" did not complete successfully: exit code: 1
```

## Solución Implementada

### 1. Archivo de Configuración de Entorno

Se copió el archivo `env.example` al directorio `SaludaBack/` para que esté disponible durante la construcción de la imagen.

### 2. Script de Entrada Mejorado

Se creó `docker-entrypoint.sh` que:
- Copia el archivo `.env` desde `env.example` si no existe
- Genera la clave de aplicación de forma segura
- Maneja errores de manera robusta
- Establece permisos correctos

### 3. Dockerfile Mejorado

El `Dockerfile` ahora incluye:
- Manejo de errores en comandos críticos
- Script de entrada para configuración en tiempo de ejecución
- Fallback para generación de claves

## Archivos Modificados

1. **SaludaBack/Dockerfile** - Versión principal con mejoras
2. **SaludaBack/Dockerfile.railway** - Versión específica para Railway
3. **SaludaBack/docker-entrypoint.sh** - Script de entrada
4. **SaludaBack/env.example** - Copiado desde el directorio raíz

## Configuración en Railway

### Variables de Entorno Requeridas

En Railway, configura las siguientes variables de entorno:

```bash
APP_NAME=SaludaReact
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-app.railway.app

# Base de datos principal
DB_CONNECTION=mysql
DB_HOST=tu-host-de-railway
DB_PORT=3306
DB_DATABASE=tu-database
DB_USERNAME=tu-username
DB_PASSWORD=tu-password

# Base de datos secundaria (si usas)
DB_SECOND_HOST=tu-host-secundario
DB_SECOND_PORT=3306
DB_SECOND_DATABASE=tu-database-secundaria
DB_SECOND_USERNAME=tu-username-secundario
DB_SECOND_PASSWORD=tu-password-secundario

# Otras configuraciones
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
LOG_CHANNEL=stack
LOG_LEVEL=debug
```

### Comando de Construcción

En Railway, usa uno de estos Dockerfiles:

- **Para desarrollo**: `SaludaBack/Dockerfile`
- **Para producción**: `SaludaBack/Dockerfile.railway`

### Puerto

La aplicación está configurada para usar el puerto 8000. Railway detectará automáticamente este puerto.

## Verificación del Despliegue

1. **Logs de Railway**: Revisa los logs para verificar que el script de entrada se ejecute correctamente
2. **Health Check**: La aplicación debería responder en el endpoint principal
3. **Base de Datos**: Verifica que la conexión a la base de datos funcione

## Solución de Problemas

### Error de Clave de Aplicación

Si ves errores relacionados con `APP_KEY`:

1. Verifica que las variables de entorno estén configuradas en Railway
2. El script de entrada generará automáticamente una clave si no existe
3. Revisa los logs para ver si la generación de clave fue exitosa

### Error de Base de Datos

Si hay problemas de conexión a la base de datos:

1. Verifica las credenciales en Railway
2. Asegúrate de que la base de datos esté accesible desde Railway
3. Revisa los logs de Laravel para errores específicos

### Error de Permisos

Si hay problemas de permisos:

1. El script de entrada establece automáticamente los permisos correctos
2. Verifica que los directorios `storage` y `bootstrap/cache` tengan permisos 775

## Comandos Útiles

Para verificar el estado de la aplicación:

```bash
# Ver logs de la aplicación
railway logs

# Ejecutar comandos en el contenedor
railway run php artisan migrate
railway run php artisan config:clear
railway run php artisan route:clear
```

## Notas Importantes

- El script de entrada se ejecuta cada vez que el contenedor inicia
- La clave de aplicación se genera automáticamente si no existe
- Los errores no críticos no detendrán el despliegue
- Railway detectará automáticamente el puerto 8000 