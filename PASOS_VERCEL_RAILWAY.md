# 🚀 Pasos para Conectar Vercel ↔ Railway

## 📋 Resumen Rápido

1. **Configurar variables en Vercel** → `REACT_APP_API_URL`
2. **Configurar CORS en Railway** → Permitir dominios de Vercel
3. **Desplegar ambos servicios**
4. **Probar la conexión**

---

## 🔧 Paso 1: Configurar Vercel

### 1.1 Ir al Dashboard de Vercel
- Ve a [vercel.com](https://vercel.com)
- Selecciona tu proyecto `SaludaFront`

### 1.2 Configurar Variables de Entorno
- Ve a **Settings** → **Environment Variables**
- Agrega estas variables:

```bash
# Variable principal (requerida)
REACT_APP_API_URL=https://tu-backend.railway.app

# Variables opcionales
REACT_APP_NAME=SaludaReact
REACT_APP_DEBUG=false
```

### 1.3 Seleccionar Entornos
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

---

## 🔧 Paso 2: Configurar Railway

### 2.1 Obtener URL del Backend
- Ve a [railway.app](https://railway.app)
- Selecciona tu proyecto backend
- Ve a **Settings** → **Domains**
- Copia la URL (ej: `https://saluda-backend-production.up.railway.app`)

### 2.2 Configurar Variables de Entorno en Railway
- Ve a **Variables**
- Agrega/actualiza estas variables:

```bash
# Configuración básica
APP_NAME=SaludaReact
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-backend.railway.app

# Base de datos (ya configuradas)
DB_CONNECTION=mysql
DB_HOST=tu-host-de-railway
DB_PORT=3306
DB_DATABASE=tu-database
DB_USERNAME=tu-username
DB_PASSWORD=tu-password

# CORS para Vercel
CORS_ALLOWED_ORIGINS=https://saluda-react.vercel.app,https://*.vercel.app

# Otras configuraciones
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
LOG_CHANNEL=stack
LOG_LEVEL=debug
```

---

## 🚀 Paso 3: Desplegar

### 3.1 Desplegar Backend (Railway)
```bash
# Los cambios ya están en el repositorio
git add .
git commit -m "Configurar CORS para Vercel"
git push origin main
```

### 3.2 Desplegar Frontend (Vercel)
```bash
# Vercel se despliega automáticamente
git push origin main
```

---

## 🧪 Paso 4: Probar la Conexión

### 4.1 Probar Backend Directamente
```bash
# Usar el script de prueba
node test-vercel-railway-connection.js https://tu-backend.railway.app
```

### 4.2 Probar en el Navegador
1. Abre: `https://tu-backend.railway.app/api/test-connection`
2. Deberías ver una respuesta JSON con `"status": "success"`

### 4.3 Probar desde el Frontend
1. Ve a tu aplicación en Vercel
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña **Console**
4. Ejecuta: `console.log(process.env.REACT_APP_API_URL)`
5. Debería mostrar la URL de tu backend

---

## 🔍 Verificación Final

### ✅ Checklist Frontend (Vercel):
- [ ] Variables de entorno configuradas
- [ ] `REACT_APP_API_URL` apunta al backend correcto
- [ ] Aplicación se despliega sin errores
- [ ] Console del navegador sin errores de CORS

### ✅ Checklist Backend (Railway):
- [ ] Variables de entorno configuradas
- [ ] CORS configurado para dominios de Vercel
- [ ] Aplicación responde en la URL correcta
- [ ] Endpoint `/api/test-connection` funciona

### ✅ Checklist Conexión:
- [ ] Frontend puede hacer peticiones al backend
- [ ] Autenticación funciona correctamente
- [ ] Datos se cargan desde el backend
- [ ] No hay errores de CORS en la consola

---

## 🛠️ Solución de Problemas

### Error de CORS:
```bash
# Verificar configuración de CORS
curl -H "Origin: https://tu-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://tu-backend.railway.app/api/test-connection
```

### Error de Conexión:
1. Verifica que la URL del backend sea correcta
2. Prueba la URL directamente en el navegador
3. Revisa los logs de Railway

### Error de Variables de Entorno:
1. Verifica que las variables estén configuradas en Vercel
2. Asegúrate de que el nombre sea exacto: `REACT_APP_API_URL`
3. Revisa que estén seleccionados los entornos correctos

---

## 📞 URLs Importantes

### Para Railway:
- **Dashboard**: https://railway.app
- **Logs**: Railway Dashboard → Tu Proyecto → Logs
- **Variables**: Railway Dashboard → Tu Proyecto → Variables

### Para Vercel:
- **Dashboard**: https://vercel.com
- **Variables**: Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
- **Logs**: Vercel Dashboard → Tu Proyecto → Functions → Logs

---

## 🎯 Resultado Esperado

Después de completar estos pasos:

1. **Tu frontend en Vercel** podrá comunicarse con tu backend en Railway
2. **La autenticación funcionará** correctamente
3. **Los datos se cargarán** desde el backend
4. **No habrá errores de CORS** en la consola del navegador

¡Tu aplicación estará completamente funcional en producción! 🚀 