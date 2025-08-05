# Solución para Problemas de Middleware de Autenticación

## Problema Identificado

El error `{"message":"Unauthenticated."}` indica que hay problemas con la configuración de autenticación en el proyecto SaludaReact. Los principales problemas identificados son:

1. **Configuración incompleta de Passport**
2. **Middleware de autenticación inconsistente**
3. **Falta de archivo de configuración de Passport**
4. **Manejo inadecuado de errores de autenticación**

## Soluciones Implementadas

### 1. Archivo de Configuración de Passport

Se creó el archivo `SaludaBack/config/passport.php` con la configuración completa de Passport:

```php
<?php
return [
    'tokens' => [
        'access_token' => [
            'lifetime' => env('PASSPORT_ACCESS_TOKEN_LIFETIME', 60 * 60), // 1 hour
        ],
        'refresh_token' => [
            'lifetime' => env('PASSPORT_REFRESH_TOKEN_LIFETIME', 60 * 60 * 24 * 14), // 14 days
        ],
    ],
    'enable_password_grant' => true,
    'enable_client_credentials_grant' => false,
    'enable_implicit_grant' => false,
    'enable_auth_code_grant' => false,
    'enable_personal_access_client' => true,
    'enable_password_client' => true,
    'enable_refresh_token_grant' => true,
    'enable_revoke_tokens' => true,
    'enable_token_pruning' => true,
];
```

### 2. Actualización del AuthServiceProvider

Se actualizó `SaludaBack/app/Providers/AuthServiceProvider.php` para configurar Passport correctamente:

```php
public function boot()
{
    $this->registerPolicies();

    // Configurar Passport
    Passport::enablePasswordGrant();
    Passport::enableClientCredentialsGrant();
    Passport::enableImplicitGrant();
    Passport::enableAuthCodeGrant();
    Passport::enablePersonalAccessClient();
    Passport::enablePasswordClient();
    Passport::enableRefreshTokenGrant();
    Passport::enableRevokeTokens();
    Passport::enableTokenPruning();

    // Configurar el tiempo de vida de los tokens
    Passport::tokensExpireIn(now()->addHours(1));
    Passport::refreshTokensExpireIn(now()->addDays(14));
    Passport::personalAccessTokensExpireIn(now()->addMonths(6));
}
```

### 3. Mejora del Middleware PersonalPOSAuth

Se actualizó `SaludaBack/app/Http/Middleware/PersonalPOSAuth.php` para:

- Verificar la presencia del token antes de intentar autenticar
- Proporcionar mensajes de error más claros
- Manejar mejor los errores de autenticación
- Separar la validación de estado activo y estado laboral

### 4. Nuevo Middleware ApiAuth

Se creó `SaludaBack/app/Http/Middleware/ApiAuth.php` como una alternativa más simple y robusta para autenticación de API.

### 5. Actualización del Middleware Authenticate

Se mejoró `SaludaBack/app/Http/Middleware/Authenticate.php` para manejar mejor los errores de autenticación en APIs.

### 6. Mejora del Interceptor del Frontend

Se actualizó `SaludaFront/src/services/interceptor.js` para:

- Asegurar que el token se envía correctamente en el header Authorization
- Proporcionar mejor logging de errores
- Manejar diferentes tipos de errores HTTP

## Scripts de Diagnóstico y Reparación

### 1. Verificar Configuración de Passport

```bash
cd SaludaBack
php artisan tinker --execute="require 'scripts/fix-passport-config.php';"
```

### 2. Regenerar Claves de Passport

```bash
cd SaludaBack
php artisan tinker --execute="require 'scripts/regenerate-passport-keys.php';"
```

## Pasos para Aplicar la Solución

### 1. Ejecutar Scripts de Reparación

```bash
# Navegar al directorio del backend
cd SaludaBack

# Verificar y corregir configuración de Passport
php artisan tinker --execute="require 'scripts/fix-passport-config.php';"

# Regenerar claves de Passport si es necesario
php artisan tinker --execute="require 'scripts/regenerate-passport-keys.php';"
```

### 2. Limpiar Caché

```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### 3. Verificar Configuración

```bash
# Verificar que Passport esté instalado correctamente
php artisan passport:install

# Verificar que las claves existan
ls -la storage/oauth-*.key
```

### 4. Probar Autenticación

```bash
# Probar endpoint de autenticación
curl -X POST http://localhost:8000/api/pos/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

## Cambios en las Rutas

Se actualizaron algunas rutas para usar el nuevo middleware `api.auth` en lugar de `personalpos.auth`:

```php
// Antes
Route::get('/me', [MeController::class, 'readProfile'])->middleware(['json.api', 'personalpos.auth']);

// Después
Route::get('/me', [MeController::class, 'readProfile'])->middleware(['json.api', 'api.auth']);
```

## Verificación de la Solución

### 1. Verificar Logs

Revisar los logs de Laravel para ver si hay errores de autenticación:

```bash
tail -f SaludaBack/storage/logs/laravel.log
```

### 2. Probar Endpoints

Probar los endpoints protegidos con un token válido:

```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Verificar Frontend

Verificar que el frontend pueda autenticarse correctamente y mantener la sesión.

## Posibles Problemas Adicionales

### 1. Problemas de CORS

Si persisten problemas de CORS, verificar la configuración en `SaludaBack/config/cors.php`.

### 2. Problemas de Base de Datos

Verificar que las tablas de Passport existan:

```sql
SHOW TABLES LIKE 'oauth_%';
```

### 3. Problemas de Permisos

Verificar permisos de las claves de Passport:

```bash
chmod 600 storage/oauth-private.key
chmod 644 storage/oauth-public.key
```

## Conclusión

Esta solución aborda los problemas principales de autenticación:

1. **Configuración completa de Passport**
2. **Middleware mejorado y más robusto**
3. **Mejor manejo de errores**
4. **Scripts de diagnóstico y reparación**
5. **Interceptor del frontend mejorado**

Los cambios son compatibles con la configuración existente y deberían resolver el problema de `{"message":"Unauthenticated."}` de manera óptima. 