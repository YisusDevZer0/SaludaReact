# 🏥 Sistema de Gestión de Marcas y Servicios - SaludaReact

## 📋 Descripción

Sistema completo de gestión de marcas y servicios médicos integrado en la plataforma SaludaReact, con backend en Laravel 11 y frontend en React 18 + Material UI.

## ✨ Características Implementadas

### Backend (Laravel 11)
- ✅ **Migrations optimizadas** con índices y campos adicionales
- ✅ **Modelos robustos** con relaciones many-to-many entre servicios y marcas
- ✅ **Controladores CRUD completos** con filtros avanzados y paginación
- ✅ **Form Requests** con validación personalizada y mensajes en español
- ✅ **API Resources** con serialización condicional y metadatos
- ✅ **Rutas protegidas** con middleware `auth:api`
- ✅ **Seeders y factories** para datos de prueba realistas

### Frontend (React 18 + Material UI)
- ✅ **Servicios API** completos con manejo de errores robusto
- ✅ **Componentes de tabla** con DataTables, filtros y búsqueda
- ✅ **Formularios modales** para CRUD con validación client-side
- ✅ **Sistema de notificaciones** con SweetAlert2
- ✅ **Integración completa** con el sistema de rutas existente
- ✅ **Responsive design** con soporte para dark mode

## 🚀 Instalación y Configuración

### 1. Ejecutar Migraciones del Backend

```bash
cd SaludaBack
php artisan migrate
php artisan db:seed --class=ServicioSeeder
php artisan db:seed --class=MarcaSeeder
```

### 2. Verificar Dependencias del Frontend

Asegúrate de que las siguientes dependencias estén instaladas:

```bash
cd SaludaFront
npm install sweetalert2 # Para notificaciones
npm install @mui/material @emotion/react @emotion/styled # Ya debería estar instalado
```

### 3. Verificar Variables de Entorno

Backend (`.env`):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tu_base_de_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password

# Asegurar que Laravel Passport esté configurado
PASSPORT_LOGIN_ENDPOINT=http://localhost:8000/oauth/token
```

Frontend (variables de entorno):
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📡 Endpoints de la API

### Servicios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/servicios` | Listar servicios con filtros |
| POST | `/api/servicios` | Crear nuevo servicio |
| GET | `/api/servicios/{id}` | Obtener servicio específico |
| PUT | `/api/servicios/{id}` | Actualizar servicio |
| DELETE | `/api/servicios/{id}` | Eliminar servicio |
| PATCH | `/api/servicios/{id}/toggle-status` | Cambiar estado |

### Marcas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/marcas` | Listar marcas con filtros |
| POST | `/api/marcas` | Crear nueva marca |
| GET | `/api/marcas/{id}` | Obtener marca específica |
| PUT | `/api/marcas/{id}` | Actualizar marca |
| DELETE | `/api/marcas/{id}` | Eliminar marca |
| PATCH | `/api/marcas/{id}/toggle-status` | Cambiar estado |
| GET | `/api/marcas/paises-disponibles` | Obtener países disponibles |

### Filtros Disponibles

**Servicios:**
- `estado` (Activo/Inactivo)
- `sistema` (POS/HOSPITALARIO/AMBULATORIO/URGENCIAS)
- `organizacion`
- `requiere_cita` (true/false)
- `precio_min` / `precio_max`
- `search` (búsqueda por texto)

**Marcas:**
- `estado` (Activo/Inactivo)
- `sistema` (POS/HOSPITALARIO/FARMACIA/LABORATORIO)
- `pais_origen`
- `con_logo` (true/false)
- `con_sitio_web` (true/false)
- `search` (búsqueda por texto)

## 🖥️ Uso del Frontend

### Navegación
- **Servicios:** `/admin/almacenes/servicios`
- **Marcas:** `/admin/almacenes/marcas`

### Funcionalidades Disponibles

#### Gestión de Servicios
- **Ver listado** con paginación y búsqueda
- **Crear servicio** con formulario modal
- **Editar servicio** inline
- **Cambiar estado** (Activo/Inactivo)
- **Eliminar servicio** con confirmación
- **Ver detalles** completos en modal

#### Gestión de Marcas
- **Ver listado** con logos y enlaces
- **Crear marca** con información completa
- **Editar marca** con validación de URLs
- **Cambiar estado** dinámicamente
- **Eliminar marca** con confirmación
- **Ver detalles** con información ampliada

### Permisos por Rol
- **Usuarios normales:** Solo lectura
- **Administradores/Admin:** CRUD completo
- **Administrador:** Puede eliminar registros

## 🔧 Estructura de Base de Datos

### Tabla `servicios`
```sql
- Servicio_ID (PK, Auto-increment)
- Nom_Serv (VARCHAR 200, único)
- Estado (ENUM: Activo/Inactivo)
- Cod_Estado (CHAR 1: A/I)
- Descripcion (TEXT, opcional)
- Precio_Base (DECIMAL 10,2, opcional)
- Requiere_Cita (BOOLEAN)
- Sistema (VARCHAR 250)
- ID_H_O_D (VARCHAR 150)
- Agregado_Por (VARCHAR 250)
- Agregadoel (TIMESTAMP)
- timestamps (created_at, updated_at)
- deleted_at (Soft delete)
```

### Tabla `marcas`
```sql
- Marca_ID (PK, Auto-increment)
- Nom_Marca (VARCHAR 200, único)
- Estado (ENUM: Activo/Inactivo)
- Cod_Estado (CHAR 1: A/I)
- Descripcion (TEXT, opcional)
- Pais_Origen (VARCHAR 100, opcional)
- Sitio_Web (VARCHAR 500, opcional)
- Logo_URL (VARCHAR 500, opcional)
- Sistema (VARCHAR 250)
- ID_H_O_D (VARCHAR 150)
- Agregado_Por (VARCHAR 250)
- Agregadoel (TIMESTAMP)
- timestamps (created_at, updated_at)
- deleted_at (Soft delete)
```

### Tabla `servicio_marca` (Relación Many-to-Many)
```sql
- id (PK)
- servicio_id (FK → servicios.Servicio_ID)
- marca_id (FK → marcas.Marca_ID)
- precio_especial (DECIMAL 10,2, opcional)
- notas (TEXT, opcional)
- agregado_por (VARCHAR 250)
- timestamps (created_at, updated_at)
```

## 🎨 Personalización

### Estilos CSS
Los componentes incluyen archivos CSS específicos:
- `ServiciosTable.css` - Estilos para tabla de servicios
- `MarcasTable.css` - Estilos para tabla de marcas con efectos especiales

### Temas
- ✅ Soporte completo para modo oscuro
- ✅ Colores adaptativos según configuración
- ✅ Animaciones y efectos visuales

## 🔒 Seguridad

### Autenticación
- Todas las rutas están protegidas con `auth:api`
- Tokens Bearer requeridos para todas las operaciones
- Validación de permisos por rol de usuario

### Validación
- **Backend:** Form Requests con reglas de Laravel
- **Frontend:** Validación client-side antes del envío
- **Sanitización:** URLs y datos de entrada

## 📊 Datos de Prueba

El sistema incluye seeders que crean:
- **45+ servicios** médicos realistas
- **35+ marcas** farmacéuticas y de equipos médicos
- **Relaciones** entre servicios y marcas
- **Datos variados** para probar filtros y búsquedas

## 🚨 Troubleshooting

### Error 500 en APIs
1. Verificar configuración de base de datos
2. Ejecutar migraciones: `php artisan migrate`
3. Verificar permisos de storage: `php artisan storage:link`

### Componentes no se muestran
1. Verificar que las rutas estén correctamente configuradas
2. Comprobar importaciones en `routes.js`
3. Verificar que el usuario tenga permisos adecuados

### Estilos no se aplican
1. Verificar que los archivos CSS estén importados
2. Comprobar que las clases CSS no tengan conflictos
3. Verificar configuración de tema en contexto

## 📚 Documentación Adicional

- [Documentación de Laravel](https://laravel.com/docs)
- [Material UI Components](https://mui.com/components/)
- [DataTables Documentation](https://datatables.net/)
- [SweetAlert2 Documentation](https://sweetalert2.github.io/)

## 👥 Soporte

Para dudas o problemas con el sistema:
1. Revisar logs de Laravel: `storage/logs/laravel.log`
2. Revisar consola del navegador para errores de JavaScript
3. Verificar respuestas de API en Network tab

---

*Desarrollado con ❤️ para SaludaReact* 