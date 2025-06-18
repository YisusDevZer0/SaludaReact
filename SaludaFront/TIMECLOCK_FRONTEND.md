# Sistema de Reloj Checador - Frontend React

## 📋 Descripción General

Este sistema de reloj checador permite gestionar y visualizar la asistencia de empleados en tiempo real, con funcionalidades avanzadas de consulta y exportación de datos.

## 🔧 Configuración del Sistema

### Backend (Laravel)
- **URL Base**: `http://localhost:8000`
- **Base de Datos Principal**: Laravel default
- **Base de Datos Secundaria**: Base de datos de huellas/asistencia
- **Controlador Principal**: `AsistenciaEloquentController`

### Frontend (React)
- **URL Base**: `http://localhost:3000`
- **Framework**: React 18 + Material-UI
- **Servicio**: `AsistenciaService` (usando rutas Eloquent)

## 🚀 Rutas del Backend

### Rutas de Asistencia (Eloquent)
```
GET /api/asistencia-eloquent/hoy
GET /api/asistencia-eloquent/por-fecha?fecha=YYYY-MM-DD
GET /api/asistencia-eloquent/por-rango?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
GET /api/asistencia-eloquent/por-empleado?id_personal=ID
GET /api/asistencia-eloquent/resumen-hoy
GET /api/asistencia-eloquent/resumen-por-rango?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
GET /api/asistencia-eloquent/sin-asistencia-hoy
```

## 📱 Componentes del Frontend

### 1. AdminTimeClock (Reloj Checador Principal)
**Archivo**: `src/layouts/admin/TimeClock.js`

#### Funcionalidades:
- 📊 **Dashboard en tiempo real** con resumen del día
- 👥 **Lista de empleados** con estado de asistencia
- 📅 **Selector de fecha** para consultas específicas
- 🔄 **Botón de refrescar** para actualizar datos
- 📋 **Tabla detallada** con información completa
- ⚠️ **Empleados sin asistencia** destacados

#### Características:
- Usa inputs nativos de fecha (sin dependencias externas)
- Funciones de fecha nativas de JavaScript
- Manejo de errores robusto
- Interfaz responsive y moderna

### 2. TimeClockStats (Estadísticas Avanzadas)
**Archivo**: `src/layouts/admin/TimeClockStats.js`

#### Funcionalidades:
- 📈 **Estadísticas por rango** de fechas
- 🗓️ **Rangos predefinidos** (hoy, ayer, semana, mes)
- 📅 **Fechas personalizadas** con validación
- 📊 **Resumen detallado** con porcentajes
- 💾 **Exportación a CSV** de datos
- 🔍 **Búsqueda y filtrado** en tablas

#### Rangos Predefinidos:
- **Hoy**: Día actual
- **Ayer**: Día anterior
- **Esta Semana**: Semana actual (lunes a domingo)
- **Semana Anterior**: Semana pasada
- **Este Mes**: Mes actual

## 🔌 Servicio de API

### AsistenciaService
**Archivo**: `src/services/asistencia-service.js`

#### Métodos Principales:
```javascript
// Métodos usando Eloquent (recomendados)
getAsistenciaHoyEloquent()
getAsistenciaPorFechaEloquent(fecha)
getAsistenciaPorRangoEloquent(fechaInicio, fechaFin)
getResumenAsistenciaHoyEloquent()
getResumenAsistenciaPorRangoEloquent(fechaInicio, fechaFin)
getEmpleadosSinAsistenciaHoyEloquent()

// Métodos legacy (no usar)
getAsistenciaHoy()
getAsistenciaPorFecha(fecha)
// ... etc
```

## 🎨 Interfaz de Usuario

### Diseño Material-UI
- **Tema**: Material Dashboard React
- **Componentes**: MDBox, MDTypography, MDButton, etc.
- **Iconos**: Material-UI Icons
- **Tablas**: DataTable con paginación y búsqueda

### Colores de Estado:
- 🟢 **Presente**: Verde (success)
- 🔴 **Ausente**: Rojo (error)
- 🟡 **Tardanza**: Amarillo (warning)

## 📊 Estructura de Datos

### Respuesta de API (Ejemplo):
```json
{
  "success": true,
  "data": [
    {
      "Id_Pernl": 1,
      "Cedula": "12345678",
      "Nombre_Completo": "Juan Pérez",
      "Cargo_rol": "Desarrollador",
      "HoIngreso": "08:00",
      "HoSalida": "17:00",
      "EstadoAsis": "Presente",
      "Tardanzas": 0,
      "totalhora_tr": "8.5"
    }
  ],
  "count": 1,
  "fecha": "2024-01-15"
}
```

## 🚀 Instalación y Uso

### 1. Instalar Dependencias
```bash
cd SaludaFront
npm install
```

### 2. Configurar Variables de Entorno
Crear archivo `.env`:
```env
REACT_APP_API_URL=http://localhost:8000
```

### 3. Iniciar Servidor de Desarrollo
```bash
npm start
```

### 4. Acceder a la Aplicación
- **Reloj Checador**: `http://localhost:3000/admin/timeclock`
- **Estadísticas**: `http://localhost:3000/admin/timeclock-stats`

## 🔧 Configuración del Backend

### 1. Configurar Base de Datos Secundaria
En `config/database.php`:
```php
'mysql_second' => [
    'driver' => 'mysql',
    'host' => env('DB_SECOND_HOST', 'localhost'),
    'port' => env('DB_SECOND_PORT', '3306'),
    'database' => env('DB_SECOND_DATABASE', 'u155356178_SaludaHuellas'),
    'username' => env('DB_SECOND_USERNAME', 'u155356178_SaludaCapturad'),
    'password' => env('DB_SECOND_PASSWORD', 'z3Z1Huellafo!Tmm]56178'),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'strict' => true,
    'engine' => null,
],
```

### 2. Variables de Entorno (.env)
```env
DB_SECOND_HOST=localhost
DB_SECOND_PORT=3306
DB_SECOND_DATABASE=u155356178_SaludaHuellas
DB_SECOND_USERNAME=u155356178_SaludaCapturad
DB_SECOND_PASSWORD=z3Z1Huellafo!Tmm]56178
```

### 3. Iniciar Servidor Laravel
```