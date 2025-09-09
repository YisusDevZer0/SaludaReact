# Módulo de Tipos de Consulta

## Descripción
Este módulo permite gestionar tipos de consulta que están ligados a especialidades médicas. Cuando se selecciona una especialidad en el agendamiento de citas, se despliegan automáticamente los tipos de consulta disponibles para esa especialidad.

## Estructura de la Base de Datos

### Tabla: `tipos_consulta`
- `Tipo_ID` (PK): Identificador único del tipo de consulta
- `Nom_Tipo`: Nombre del tipo de consulta (ej: "Consulta General", "Control de Presión")
- `Estado`: Estado del tipo (Activo/Inactivo)
- `Agregado_Por`: Usuario que creó el registro
- `Agregado_El`: Fecha y hora de creación
- `Sistema`: Sistema que creó el registro (SaludaReact)
- `ID_H_O_D`: Identificador de la organización/hospital
- `Especialidad` (FK): Referencia a la tabla especialidades
- `Modificado_Por`: Usuario que modificó el registro
- `Modificado_El`: Fecha y hora de modificación

### Tabla: `citas` (modificada)
- Se agregó el campo `tipo_consulta_id` (FK) que referencia a `tipos_consulta.Tipo_ID`

## Backend (Laravel)

### Archivos Creados/Modificados:

1. **Migración**: `2025_01_20_000001_create_tipos_consulta_table.php`
2. **Migración**: `2025_01_20_000002_add_tipo_consulta_id_to_citas_table.php`
3. **Modelo**: `app/Models/TipoConsulta.php`
4. **Controlador**: `app/Http/Controllers/Api/TiposConsultaController.php`
5. **Rutas**: Agregadas en `routes/api.php`
6. **Seeder**: `database/seeders/TiposConsultaSeeder.php`

### Endpoints API:

- `GET /api/tipos-consulta` - Obtener todos los tipos de consulta
- `POST /api/tipos-consulta` - Crear nuevo tipo de consulta
- `GET /api/tipos-consulta/{id}` - Obtener tipo de consulta por ID
- `PUT /api/tipos-consulta/{id}` - Actualizar tipo de consulta
- `DELETE /api/tipos-consulta/{id}` - Eliminar tipo de consulta
- `GET /api/tipos-consulta/por-especialidad` - Obtener tipos por especialidad

## Frontend (React)

### Archivos Creados/Modificados:

1. **Servicio**: `src/services/tipos-consulta-service.js`
2. **Servicio**: `src/services/especialidad-service.js`
3. **Formulario**: `src/components/forms/TipoConsultaForm.js`
4. **Tabla**: `src/components/TiposConsultaTable.js`
5. **Estilos**: `src/components/TiposConsultaTable.css`
6. **Formulario de Agenda**: Modificado `src/components/Modales/AgendaFormMejorado.js`
7. **Modal de Agenda**: Modificado `src/components/Modales/AgendaModalMejorado.js`
8. **Servicio de Agenda**: Modificado `src/services/agenda-service.js`

### Componentes Principales:

#### TiposConsultaTable
- Tabla completa para gestionar tipos de consulta
- Filtros por especialidad y estado
- Búsqueda por nombre
- Acciones CRUD (Crear, Editar, Eliminar)

#### TipoConsultaForm
- Formulario para crear/editar tipos de consulta
- Validación de campos
- Selector de especialidad
- Información de auditoría

#### Integración en Agenda
- Campo de tipo de consulta en el formulario de citas
- Carga automática de tipos según la especialidad seleccionada
- Validación de campos requeridos

## Instalación y Configuración

### 1. Ejecutar Migraciones
```bash
cd SaludaBack
php artisan migrate
```

### 2. Ejecutar Seeder (Opcional)
```bash
php artisan db:seed --class=TiposConsultaSeeder
```

### 3. Verificar Rutas
Las rutas API están disponibles en:
- `GET /api/tipos-consulta`
- `POST /api/tipos-consulta`
- etc.

## Uso del Módulo

### 1. Gestión de Tipos de Consulta
1. Acceder a la tabla de tipos de consulta
2. Crear nuevos tipos asociados a especialidades
3. Editar tipos existentes
4. Activar/desactivar tipos según necesidad

### 2. Agendamiento de Citas
1. Seleccionar especialidad en el formulario de cita
2. Los tipos de consulta se cargan automáticamente
3. Seleccionar el tipo de consulta apropiado
4. Completar el resto de la información de la cita

### 3. Filtros y Búsqueda
- Filtrar por especialidad
- Filtrar por estado (Activo/Inactivo)
- Buscar por nombre del tipo de consulta

## Características Técnicas

### Validaciones
- Nombre del tipo es requerido y único por especialidad
- Especialidad es requerida
- ID de organización es requerido
- Estado debe ser Activo o Inactivo

### Relaciones
- Un tipo de consulta pertenece a una especialidad
- Una especialidad puede tener múltiples tipos de consulta
- Una cita puede tener un tipo de consulta (opcional)

### Auditoría
- Registro de quién creó y modificó cada tipo
- Fechas de creación y modificación
- Soft deletes para recuperación de datos

## Consideraciones de Seguridad

- Autenticación requerida para todas las operaciones
- Validación de permisos por organización
- Sanitización de datos de entrada
- Validación de claves foráneas

## Mantenimiento

### Limpieza de Datos
- Los tipos inactivos no aparecen en el agendamiento
- Soft deletes permiten recuperar datos eliminados
- Relaciones en cascada configuradas apropiadamente

### Monitoreo
- Logs de creación y modificación
- Validación de integridad referencial
- Alertas de errores en operaciones CRUD

## Extensibilidad

El módulo está diseñado para ser fácilmente extensible:

1. **Nuevos campos**: Agregar campos a la migración y modelo
2. **Nuevas validaciones**: Modificar el controlador y formulario
3. **Nuevas funcionalidades**: Extender el servicio y componentes
4. **Nuevas relaciones**: Agregar claves foráneas según necesidad

## Troubleshooting

### Problemas Comunes

1. **Tipos no aparecen en agenda**: Verificar que la especialidad esté seleccionada
2. **Error de validación**: Revisar que el nombre sea único para la especialidad
3. **Error de conexión**: Verificar que las rutas API estén configuradas correctamente

### Logs
Revisar los logs de Laravel para errores del backend:
```bash
tail -f storage/logs/laravel.log
```

### Base de Datos
Verificar la integridad de las relaciones:
```sql
SELECT * FROM tipos_consulta WHERE Especialidad NOT IN (SELECT Especialidad_ID FROM especialidades);
```
