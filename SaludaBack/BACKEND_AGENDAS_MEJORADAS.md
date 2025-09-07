# 🏥 Backend de Agendas Mejoradas - SaludaReact

## 📋 **Descripción General**

Este documento describe la implementación del backend para el sistema de agendas mejoradas de SaludaReact. El sistema incluye gestión completa de especialidades, especialistas, sucursales y citas médicas con validaciones avanzadas y auditoría completa.

## 🏗️ **Arquitectura del Sistema**

### **Entidades Principales:**
1. **Especialidades** - Campos médicos disponibles
2. **Especialistas** - Médicos con sus especialidades
3. **Sucursales Mejoradas** - Ubicaciones de atención
4. **Citas Mejoradas** - Programación de consultas
5. **Pacientes Mejorados** - Información de pacientes
6. **Consultorios Mejorados** - Espacios de atención
7. **Programación de Especialistas** - Horarios disponibles
8. **Historial de Estados** - Seguimiento de cambios
9. **Notificaciones** - Sistema de alertas

## 🚀 **Instalación y Configuración**

### **Prerrequisitos:**
- Laravel 10+
- PHP 8.1+
- MySQL/MariaDB 10.5+
- Composer

### **Pasos de Instalación:**

1. **Ejecutar Migraciones:**
```bash
php artisan migrate --path=database/migrations/2025_08_25_000001_create_especialidades_table.php
php artisan migrate --path=database/migrations/2025_08_25_000002_create_especialistas_table.php
php artisan migrate --path=database/migrations/2025_08_25_000003_create_sucursales_mejoradas_table.php
php artisan migrate --path=database/migrations/2025_08_25_000004_create_consultorios_mejorados_table.php
php artisan migrate --path=database/migrations/2025_08_25_000005_create_pacientes_mejorados_table.php
php artisan migrate --path=database/migrations/2025_08_25_000006_create_programacion_especialistas_table.php
php artisan migrate --path=database/migrations/2025_08_25_000007_create_horarios_disponibles_table.php
php artisan migrate --path=database/migrations/2025_08_25_000008_create_citas_mejoradas_table.php
php artisan migrate --path=database/migrations/2025_08_25_000009_create_historial_estados_citas_table.php
php artisan migrate --path=database/migrations/2025_08_25_000010_create_notificaciones_citas_table.php
php artisan migrate --path=database/migrations/2025_08_25_000011_create_auditoria_cambios_table.php
php artisan migrate --path=database/migrations/2025_08_25_000012_create_vistas_utiles_table.php
php artisan migrate --path=database/migrations/2025_08_25_000013_insert_datos_ejemplo_table.php
```

2. **Verificar Instalación:**
```bash
php artisan migrate:status
```

## 📚 **Modelos Eloquent**

### **1. Especialidad**
```php
use App\Models\Especialidad;

// Obtener todas las especialidades activas
$especialidades = Especialidad::activas()->get();

// Obtener especialidades por hospital
$especialidades = Especialidad::porHospital('HOD001')->get();
```

### **2. Especialista**
```php
use App\Models\Especialista;

// Obtener especialistas activos con especialidad
$especialistas = Especialista::activos()
    ->with('especialidad')
    ->get();

// Obtener especialistas por especialidad
$especialistas = Especialista::porEspecialidad(1)->get();
```

### **3. CitaMejorada**
```php
use App\Models\CitaMejorada;

// Obtener citas del día de hoy
$citasHoy = CitaMejorada::hoy()->get();

// Obtener citas por estado
$citasPendientes = CitaMejorada::porEstado('Pendiente')->get();

// Obtener citas con relaciones
$citas = CitaMejorada::with([
    'paciente',
    'especialista.especialidad',
    'sucursal',
    'consultorio'
])->get();
```

## 🌐 **API Endpoints**

### **Base URL:**
```
http://localhost:8000/api
```

### **1. Especialidades**

#### **Listar Especialidades**
```http
GET /api/especialidades
```

**Parámetros de Query:**
- `activa` (boolean) - Filtrar por estado activo
- `hospital_id` (string) - Filtrar por hospital
- `search` (string) - Búsqueda por nombre
- `sort_by` (string) - Campo para ordenar
- `sort_order` (asc|desc) - Orden ascendente/descendente
- `per_page` (integer) - Elementos por página

**Respuesta:**
```json
{
  "success": true,
  "message": "Especialidades obtenidas exitosamente",
  "data": [
    {
      "Especialidad_ID": 1,
      "Nombre_Especialidad": "Cardiología",
      "Descripcion": "Especialidad del corazón",
      "Color_Calendario": "#e74c3c",
      "Activa": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

#### **Crear Especialidad**
```http
POST /api/especialidades
```

**Body:**
```json
{
  "Nombre_Especialidad": "Dermatología",
  "Descripcion": "Especialidad de la piel",
  "Color_Calendario": "#f39c12",
  "Activa": true,
  "ID_H_O_D": "HOD001"
}
```

#### **Obtener Especialidad por ID**
```http
GET /api/especialidades/{id}
```

#### **Actualizar Especialidad**
```http
PUT /api/especialidades/{id}
```

#### **Eliminar Especialidad**
```http
DELETE /api/especialidades/{id}
```

#### **Especialidades Activas**
```http
GET /api/especialidades/activas
```

#### **Estadísticas**
```http
GET /api/especialidades/estadisticas
```

### **2. Especialistas**

#### **Listar Especialistas**
```http
GET /api/especialistas
```

**Parámetros de Query:**
- `activo` (boolean) - Filtrar por estado activo
- `especialidad_id` (integer) - Filtrar por especialidad
- `hospital_id` (string) - Filtrar por hospital
- `search` (string) - Búsqueda por nombre
- `sort_by` (string) - Campo para ordenar
- `sort_order` (asc|desc) - Orden ascendente/descendente
- `per_page` (integer) - Elementos por página

#### **Crear Especialista**
```http
POST /api/especialistas
```

**Body:**
```json
{
  "Nombre_Completo": "Dr. Juan Pérez",
  "Cedula_Profesional": "12345",
  "Email": "juan.perez@hospital.com",
  "Telefono": "555-0101",
  "Fk_Especialidad": 1,
  "Activo": true,
  "ID_H_O_D": "HOD001"
}
```

#### **Especialistas Activos**
```http
GET /api/especialistas/activos
```

#### **Por Especialidad**
```http
GET /api/especialistas/por-especialidad/{especialidadId}
```

#### **Estadísticas**
```http
GET /api/especialistas/estadisticas
```

### **3. Sucursales Mejoradas**

#### **Listar Sucursales**
```http
GET /api/sucursales-mejoradas
```

**Parámetros de Query:**
- `activa` (boolean) - Filtrar por estado activo
- `hospital_id` (string) - Filtrar por hospital
- `search` (string) - Búsqueda por nombre
- `sort_by` (string) - Campo para ordenar
- `sort_order` (asc|desc) - Orden ascendente/descendente
- `per_page` (integer) - Elementos por página

#### **Crear Sucursal**
```http
POST /api/sucursales-mejoradas
```

**Body:**
```json
{
  "Nombre_Sucursal": "Sucursal Centro",
  "Direccion": "Av. Principal 123",
  "Telefono": "555-0001",
  "Email": "centro@hospital.com",
  "Activa": true,
  "ID_H_O_D": "HOD001"
}
```

#### **Sucursales Activas**
```http
GET /api/sucursales-mejoradas/activas
```

#### **Estadísticas**
```http
GET /api/sucursales-mejoradas/estadisticas
```

### **4. Citas Mejoradas**

#### **Listar Citas**
```http
GET /api/citas-mejoradas
```

**Parámetros de Query:**
- `fecha` (date) - Filtrar por fecha
- `estado` (string) - Filtrar por estado
- `especialista` (integer) - Filtrar por especialista
- `sucursal` (integer) - Filtrar por sucursal
- `especialidad` (integer) - Filtrar por especialidad
- `paciente` (string) - Búsqueda por nombre de paciente
- `hospital_id` (string) - Filtrar por hospital
- `sort_by` (string) - Campo para ordenar
- `sort_order` (asc|desc) - Orden ascendente/descendente
- `per_page` (integer) - Elementos por página

#### **Crear Cita**
```http
POST /api/citas-mejoradas
```

**Body:**
```json
{
  "Titulo": "Consulta de rutina",
  "Descripcion": "Primera consulta del paciente",
  "Fecha_Cita": "2025-01-28",
  "Hora_Inicio": "09:00:00",
  "Hora_Fin": "09:30:00",
  "Estado_Cita": "Pendiente",
  "Tipo_Cita": "Consulta",
  "Costo": 500.00,
  "Notas_Adicionales": "Paciente nuevo",
  "Fk_Paciente": 1,
  "Fk_Especialista": 1,
  "Fk_Sucursal": 1,
  "Fk_Consultorio": 1,
  "ID_H_O_D": "HOD001"
}
```

#### **Citas de Hoy**
```http
GET /api/citas-mejoradas/hoy
```

#### **Estadísticas**
```http
GET /api/citas-mejoradas/estadisticas
```

## 🔐 **Autenticación y Autorización**

### **Headers Requeridos:**
```http
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

### **Middleware de Autenticación:**
Todas las rutas requieren autenticación. El sistema verifica el token JWT en el header `Authorization`.

## ✅ **Validaciones**

### **Especialidades:**
- `Nombre_Especialidad`: Requerido, único, máximo 100 caracteres
- `Color_Calendario`: Opcional, máximo 7 caracteres (formato hex)
- `ID_H_O_D`: Requerido, máximo 10 caracteres

### **Especialistas:**
- `Nombre_Completo`: Requerido, máximo 200 caracteres
- `Cedula_Profesional`: Requerido, único, máximo 50 caracteres
- `Email`: Requerido, email válido, único, máximo 100 caracteres
- `Telefono`: Requerido, máximo 20 caracteres
- `Fk_Especialidad`: Requerido, debe existir en tabla especialidades

### **Citas:**
- `Fecha_Cita`: Requerido, fecha válida, no puede ser anterior a hoy
- `Hora_Inicio`: Requerido, formato HH:mm:ss
- `Hora_Fin`: Requerido, formato HH:mm:ss, debe ser posterior a Hora_Inicio
- `Estado_Cita`: Requerido, valores permitidos: Pendiente, Confirmada, En Proceso, Completada, Cancelada, No Asistió
- `Fk_Paciente`: Requerido, debe existir en tabla pacientes_mejorados
- `Fk_Especialista`: Requerido, debe existir en tabla especialistas
- `Fk_Sucursal`: Requerido, debe existir en tabla sucursales_mejoradas

## 🚨 **Manejo de Errores**

### **Respuestas de Error:**
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": {
    "campo": ["Mensaje de validación"]
  }
}
```

### **Códigos de Estado HTTP:**
- `200` - OK (Operación exitosa)
- `201` - Created (Recurso creado)
- `400` - Bad Request (Error de validación)
- `401` - Unauthorized (No autenticado)
- `403` - Forbidden (Sin permisos)
- `404` - Not Found (Recurso no encontrado)
- `422` - Unprocessable Entity (Error de validación)
- `500` - Internal Server Error (Error del servidor)

## 📊 **Estadísticas y Reportes**

### **Estadísticas de Especialidades:**
- Total de especialidades
- Especialidades activas/inactivas
- Distribución por hospital

### **Estadísticas de Especialistas:**
- Total de especialistas
- Especialistas activos/inactivos
- Distribución por especialidad

### **Estadísticas de Citas:**
- Total de citas
- Distribución por estado
- Distribución por especialidad
- Citas del día

## 🔄 **Relaciones entre Entidades**

### **Especialidad → Especialista:**
- Una especialidad puede tener muchos especialistas
- Un especialista pertenece a una especialidad

### **Especialista → Cita:**
- Un especialista puede tener muchas citas
- Una cita pertenece a un especialista

### **Sucursal → Consultorio:**
- Una sucursal puede tener muchos consultorios
- Un consultorio pertenece a una sucursal

### **Paciente → Cita:**
- Un paciente puede tener muchas citas
- Una cita pertenece a un paciente

## 🧪 **Testing**

### **Ejecutar Tests:**
```bash
php artisan test --filter=EspecialidadesController
php artisan test --filter=EspecialistasController
php artisan test --filter=CitasMejoradasController
php artisan test --filter=SucursalesMejoradasController
```

## 📝 **Logs y Auditoría**

### **Logs del Sistema:**
- Todas las operaciones CRUD se registran
- Cambios de estado de citas se auditan
- Errores y excepciones se loguean

### **Campos de Auditoría:**
- `Agregado_Por`: Usuario que creó el registro
- `Agregado_El`: Fecha/hora de creación
- `Modificado_Por`: Usuario que modificó el registro
- `Modificado_El`: Fecha/hora de modificación
- `ID_H_O_D`: Identificador del hospital/organización

## 🚀 **Optimizaciones y Mejoras Futuras**

### **Implementaciones Pendientes:**
1. **Cache Redis** para consultas frecuentes
2. **Queue Jobs** para notificaciones asíncronas
3. **API Rate Limiting** para prevenir abuso
4. **WebSockets** para actualizaciones en tiempo real
5. **Exportación a PDF/Excel** de reportes
6. **Integración con calendarios externos** (Google Calendar, Outlook)

### **Mejoras de Performance:**
1. **Índices de base de datos** optimizados
2. **Eager Loading** de relaciones
3. **Paginación** en todas las consultas
4. **Compresión** de respuestas JSON

## 📞 **Soporte y Contacto**

Para soporte técnico o preguntas sobre la implementación:

- **Desarrollador:** Asistente AI
- **Proyecto:** SaludaReact
- **Fecha:** Enero 2025
- **Versión:** 1.0.0

---

**¡El backend está listo para usar! 🎉**

Ejecuta las migraciones y comienza a probar los endpoints. El sistema incluye validaciones robustas, manejo de errores completo y auditoría de todas las operaciones.
