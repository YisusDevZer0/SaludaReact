# 🚨 Solución al Error: localhost:8000

## 🔍 Problema Identificado

El frontend está intentando conectarse a `http://localhost:8000` en lugar de usar la URL de Railway. Esto indica que la variable de entorno `REACT_APP_API_URL` no está configurada correctamente.

## 🛠️ Solución Paso a Paso

### Paso 1: Verificar Variables de Entorno en Vercel

1. **Ve a tu proyecto en Vercel**
2. **Settings** → **Environment Variables**
3. **Verifica que tengas**:
   ```
   REACT_APP_API_URL=https://tu-backend-real.railway.app
   ```

### Paso 2: Obtener la URL Real de Railway

1. Ve a [railway.app](https://railway.app)
2. Selecciona tu proyecto backend
3. Ve a **Settings** → **Domains**
4. Copia la URL (ej: `https://saluda-backend-production.up.railway.app`)

### Paso 3: Configurar la Variable en Vercel

1. En Vercel Dashboard, ve a **Settings** → **Environment Variables**
2. Agrega o actualiza:
   ```
   REACT_APP_API_URL=https://tu-backend-real.railway.app
   ```
3. Selecciona todos los entornos (Production, Preview, Development)
4. Guarda los cambios

### Paso 4: Redesplegar

```bash
# Hacer push para redesplegar automáticamente
git add .
git commit -m "Corregir configuración de API URL"
git push origin main
```

## 🔧 Archivos Corregidos

Ya corregí estos archivos para usar la variable de entorno:

- ✅ `SaludaFront/src/services/http.service.js`
- ✅ `SaludaFront/src/services/http-service.js`
- ✅ `SaludaFront/src/services/debug-api-url.js` (nuevo)

## 🧪 Verificación

### 1. Verificar en el Navegador

1. Abre tu aplicación en Vercel
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña **Console**
4. Deberías ver logs como:
   ```
   🔍 Debug: Configuración de API URL
   =====================================
   REACT_APP_API_URL: https://tu-backend-real.railway.app
   ✅ REACT_APP_API_URL está configurada
   ```

### 2. Probar la Conexión

```bash
# Usar el script de prueba
node test-vercel-railway-connection.js https://tu-backend-real.railway.app
```

## 🚨 Si el Problema Persiste

### Verificar que la Variable se Esté Cargando

En la consola del navegador, ejecuta:
```javascript
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
```

Si muestra `undefined`, significa que la variable no está configurada correctamente en Vercel.

### Verificar el Nombre de la Variable

Asegúrate de que el nombre sea exactamente:
```
REACT_APP_API_URL
```

**NO**:
- `REACT_APP_API_URLS`
- `API_URL`
- `REACT_API_URL`

### Verificar los Entornos

En Vercel, asegúrate de que la variable esté seleccionada para:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

## 📋 Checklist de Verificación

- [ ] Variable `REACT_APP_API_URL` configurada en Vercel
- [ ] URL de Railway copiada correctamente
- [ ] Variable seleccionada para todos los entornos
- [ ] Aplicación redesplegada en Vercel
- [ ] Logs en consola muestran la URL correcta
- [ ] No hay errores de CORS

## 🎯 Resultado Esperado

Después de configurar correctamente la variable de entorno:

1. **Los logs en consola** mostrarán la URL de Railway
2. **Las peticiones** irán a tu backend en Railway
3. **La autenticación funcionará** correctamente
4. **No habrá errores** de "Network Error"

¡Con estos pasos, tu frontend debería conectarse correctamente con tu backend en Railway! 