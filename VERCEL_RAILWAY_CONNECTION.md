# Conexión Frontend Vercel ↔ Backend Railway

Esta guía explica cómo conectar tu frontend desplegado en Vercel con tu backend desplegado en Railway.

## 🔗 Configuración del Frontend (Vercel)

### 1. Variables de Entorno en Vercel Dashboard

Ve a tu proyecto en [vercel.com](https://vercel.com) y configura estas variables:

#### Variables Requeridas:
```bash
REACT_APP_API_URL=https://tu-backend.railway.app
```

#### Variables Opcionales:
```bash
REACT_APP_NAME=SaludaReact
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=info
```

### 2. Pasos en Vercel Dashboard:

1. **Accede a tu proyecto** en Vercel
2. **Ve a Settings** → **Environment Variables**
3. **Agrega las variables**:
   - `REACT_APP_API_URL` = `https://tu-backend.railway.app`
   - `REACT_APP_NAME` = `SaludaReact`
4. **Selecciona los entornos** (Production, Preview, Development)
5. **Guarda los cambios**

### 3. Obtener la URL de tu Backend en Railway

1. Ve a tu proyecto en [railway.app](https://railway.app)
2. Selecciona tu servicio backend
3. Ve a la pestaña "Settings"
4. Copia la URL generada (ej: `https://saluda-backend-production.up.railway.app`)

## 🔧 Configuración del Backend (Railway)

### 1. Variables de Entorno en Railway

En Railway, configura estas variables:

```bash
# Configuración básica
APP_NAME=SaludaReact
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-backend.railway.app

# Base de datos
DB_CONNECTION=mysql
DB_HOST=tu-host-de-railway
DB_PORT=3306
DB_DATABASE=tu-database
DB_USERNAME=tu-username
DB_PASSWORD=tu-password

# CORS - Permitir dominio de Vercel
CORS_ALLOWED_ORIGINS=https://saluda-react.vercel.app,https://*.vercel.app

# Otras configuraciones
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
LOG_CHANNEL=stack
LOG_LEVEL=debug
```

### 2. Configuración de CORS

El archivo `SaludaBack/config/cors.php` ya ha sido actualizado para incluir los dominios de Vercel:

```php
'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'https://saluda-react.vercel.app',
    'https://saluda-react-git-main.vercel.app',
    'https://saluda-react-git-develop.vercel.app',
    'https://*.vercel.app'
],
```

## 🚀 Pasos de Despliegue

### 1. Desplegar Backend en Railway

```bash
# Asegúrate de que los cambios estén en tu repositorio
git add .
git commit -m "Configurar CORS para Vercel"
git push origin main
```

### 2. Desplegar Frontend en Vercel

```bash
# Vercel se despliega automáticamente cuando haces push
git push origin main
```

### 3. Verificar la Conexión

1. **Verifica el backend**: Visita `https://tu-backend.railway.app/api/health` (si tienes un endpoint de health)
2. **Verifica el frontend**: Visita tu aplicación en Vercel
3. **Prueba la autenticación**: Intenta hacer login desde el frontend

## 🔍 Verificación y Testing

### 1. Verificar Variables de Entorno

En el frontend, puedes verificar que las variables se están cargando:

```javascript
// En la consola del navegador
console.log('API URL:', process.env.REACT_APP_API_URL);
```

### 2. Probar Conexión API

Abre las herramientas de desarrollador del navegador y verifica:
- **Network tab**: Las peticiones a tu backend
- **Console**: Errores de CORS o conexión
- **Application tab**: Cookies y localStorage

### 3. Endpoints de Prueba

Puedes crear un endpoint de prueba en tu backend:

```php
// En routes/api.php
Route::get('/test-connection', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Backend conectado correctamente',
        'timestamp' => now()
    ]);
});
```

## 🛠️ Solución de Problemas

### Error de CORS

Si ves errores de CORS:

1. **Verifica la configuración de CORS** en `SaludaBack/config/cors.php`
2. **Asegúrate de que el dominio de Vercel esté en `allowed_origins`**
3. **Revisa los logs de Railway** para errores específicos

### Error de Conexión

Si el frontend no puede conectar con el backend:

1. **Verifica la URL del backend** en las variables de entorno de Vercel
2. **Prueba la URL directamente** en el navegador
3. **Revisa los logs de Railway** para errores de aplicación

### Error de Autenticación

Si hay problemas de autenticación:

1. **Verifica las cookies** en el navegador
2. **Revisa la configuración de Sanctum** en el backend
3. **Asegúrate de que `supports_credentials` esté en `true`** en CORS

## 📋 Checklist de Verificación

### Frontend (Vercel):
- [ ] Variables de entorno configuradas
- [ ] `REACT_APP_API_URL` apunta al backend correcto
- [ ] Aplicación se despliega sin errores
- [ ] Console del navegador sin errores de CORS

### Backend (Railway):
- [ ] Variables de entorno configuradas
- [ ] CORS configurado para dominios de Vercel
- [ ] Aplicación responde en la URL correcta
- [ ] Logs sin errores críticos

### Conexión:
- [ ] Frontend puede hacer peticiones al backend
- [ ] Autenticación funciona correctamente
- [ ] Datos se cargan desde el backend
- [ ] No hay errores de CORS en la consola

## 🔄 Actualizaciones Automáticas

### Para el Frontend:
- Vercel se actualiza automáticamente cuando haces push a tu repositorio
- Las variables de entorno se mantienen entre despliegues

### Para el Backend:
- Railway se actualiza automáticamente cuando haces push
- Puedes configurar auto-deploy en Railway

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** de ambos servicios
2. **Verifica las variables de entorno**
3. **Prueba los endpoints** directamente
4. **Revisa la configuración de CORS**

¡Con esta configuración, tu frontend en Vercel debería comunicarse perfectamente con tu backend en Railway! 