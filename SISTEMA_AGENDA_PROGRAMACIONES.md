# Sistema de Agenda y Programaciones - SaludaReact

## 📋 Resumen Ejecutivo

Se ha implementado un sistema completo de gestión de agenda y programaciones para especialistas médicos, que permite:

- **Crear programaciones** con fechas, horarios e intervalos personalizables
- **Gestionar horarios** de forma granular (por fecha y por hora individual)
- **Editar fechas y horarios** existentes
- **Agregar nuevas fechas** y horarios a programaciones existentes
- **Control de estados** (Disponible, Cerrado, Ocupado)
- **Interfaz intuitiva** con modales y notificaciones

---

## 🏗️ Arquitectura del Sistema

### Backend (Laravel)
- **Modelos**: `ProgramacionEspecialista`, `HorarioDisponible`
- **Controladores**: `ProgramacionController` (API)
- **Rutas**: Endpoints RESTful para todas las operaciones
- **Base de datos**: Tablas relacionadas con soft deletes

### Frontend (React + Material-UI)
- **Componentes**: Modales de edición, formularios de programación
- **Servicios**: API client para comunicación con backend
- **Hooks**: Notificaciones y gestión de estado
- **Estilos**: CSS personalizado para modales

---

## 🔧 Funcionalidades Implementadas

### 1. Gestión de Programaciones

#### Crear Programación
- Selección de especialista, sucursal y consultorio
- Configuración de fechas de inicio y fin
- Definición de horarios de trabajo (inicio/fin)
- Intervalo de citas configurable (15-120 minutos)
- Activación automática opcional
- Notas y comentarios

#### Editar Programación
- Modificación de todos los parámetros
- Validación de datos
- Actualización en tiempo real

#### Eliminar Programación
- Verificación de citas agendadas
- Soft delete para mantener historial

### 2. Gestión Granular de Horarios

#### Por Fecha
- **Aperturar**: Hacer disponibles todos los horarios de una fecha
- **Cerrar**: Marcar todos los horarios como no disponibles
- **Eliminar**: Remover fecha completa con todos sus horarios
- **Editar**: Cambiar fecha y redefinir horarios

#### Por Hora Individual
- **Aperturar**: Marcar horario específico como disponible
- **Cerrar**: Marcar horario específico como cerrado
- **Eliminar**: Remover horario individual
- **Editar**: Cambiar hora específica

### 3. Agregado de Nuevos Elementos

#### Nuevas Fechas
- Agregar fechas adicionales a programaciones existentes
- Definir horarios personalizados para nuevas fechas
- Validación de fechas duplicadas

#### Nuevos Horarios
- Agregar horarios adicionales a fechas existentes
- Verificación de horarios duplicados
- Estado inicial configurable

---

## 📁 Estructura de Archivos

### Backend

```
SaludaBack/
├── app/
│   ├── Models/
│   │   ├── ProgramacionEspecialista.php
│   │   └── HorarioDisponible.php
│   └── Http/Controllers/Api/
│       └── ProgramacionController.php
├── routes/
│   └── api.php
└── database/migrations/
    └── [migraciones relacionadas]
```

### Frontend

```
SaludaFront/
├── src/
│   ├── components/Modales/
│   │   ├── EditarProgramacionModal.js
│   │   ├── ProgramacionModal.js
│   │   └── Modales.css
│   ├── services/
│   │   └── programacion-service.js
│   └── layouts/admin-agendas/
│       └── GestionProgramaciones.js
```

---

## 🗄️ Modelos de Datos

### ProgramacionEspecialista

```php
protected $fillable = [
    'Fk_Especialista',
    'Fk_Sucursal', 
    'Fk_Consultorio',
    'Tipo_Programacion',
    'Fecha_Inicio',
    'Fecha_Fin',
    'Hora_Inicio',
    'Hora_Fin',
    'Intervalo_Citas',
    'Estatus',
    'Notas',
    'ID_H_O_D',
    'Agregado_Por'
];
```

**Estados posibles:**
- `Programada`: Creada pero no activa
- `Activa`: En funcionamiento
- `Finalizada`: Completada
- `Cancelada`: Anulada

### HorarioDisponible

```php
protected $fillable = [
    'Fk_Programacion',
    'Fecha',
    'Hora',
    'Estatus',
    'ID_H_O_D',
    'Agregado_Por',
    'Modificado_Por'
];
```

**Estados posibles:**
- `Disponible`: Horario abierto para citas
- `Cerrado`: Horario no disponible
- `Ocupado`: Cita agendada
- `Reservado`: Horario reservado
- `Bloqueado`: Horario bloqueado por administración

---

## 🌐 API Endpoints

### Programaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/programacion` | Crear nueva programación |
| `GET` | `/api/programacion` | Listar programaciones con filtros |
| `GET` | `/api/programacion/{id}` | Obtener programación específica |
| `PUT` | `/api/programacion/{id}` | Actualizar programación |
| `DELETE` | `/api/programacion/{id}` | Eliminar programación |
| `POST` | `/api/programacion/{id}/generar-horarios` | Generar horarios automáticamente |

### Gestión de Fechas y Horarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/programacion/{id}/horarios-por-fecha` | Obtener horarios agrupados por fecha |
| `POST` | `/api/programacion/{id}/gestionar-fecha` | Gestionar fecha (aperturar/cerrar/eliminar/editar) |
| `POST` | `/api/programacion/{id}/horarios/{horarioId}/gestionar` | Gestionar horario individual |
| `POST` | `/api/programacion/{id}/agregar-fecha` | Agregar nueva fecha |
| `POST` | `/api/programacion/{id}/agregar-horarios` | Agregar horarios a fecha existente |

### Consultas y Estadísticas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/programacion/horarios-disponibles` | Obtener horarios disponibles para agendar |
| `GET` | `/api/programacion/estadisticas` | Estadísticas generales |

---

## 🎯 Lógica de Negocio

### Generación de Horarios

1. **Validación**: Solo programaciones activas pueden generar horarios
2. **Cálculo**: Horarios generados según intervalo configurado
3. **Estado inicial**: Todos los horarios se crean como "Cerrado"
4. **Activación manual**: Requiere apertura explícita de fechas/horarios

### Gestión de Estados

#### Jerarquía de Estados
- **Fecha cerrada** → Horarios no pueden estar disponibles
- **Fecha abierta** → Horarios pueden ser gestionados individualmente
- **Horario disponible** → Puede ser agendado
- **Horario ocupado** → Cita agendada, no puede modificarse

#### Reglas de Negocio
- No se pueden eliminar programaciones con citas agendadas
- Los horarios se generan como "Cerrado" por defecto
- Las fechas se pueden editar sin afectar horarios existentes
- Los horarios se pueden editar independientemente

---

## 🎨 Interfaz de Usuario

### Componentes Principales

#### EditarProgramacionModal
- **Vista general**: Lista de fechas con horarios
- **Gestión por fecha**: Botones para aperturar/cerrar/eliminar/editar
- **Gestión por horario**: Control individual de cada horario
- **Agregado**: Botones para nuevas fechas y horarios

#### ProgramacionModal
- **Creación**: Formulario completo para nuevas programaciones
- **Edición**: Modificación de programaciones existentes
- **Validación**: Verificación en tiempo real de datos

### Características de UX

- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Intuitivo**: Iconos y colores para estados
- **Notificaciones**: Feedback inmediato de acciones
- **Validación**: Prevención de errores comunes
- **Carga**: Indicadores de estado para operaciones asíncronas

---

## 🔒 Seguridad y Validación

### Backend
- **Validación**: Reglas de validación estrictas para todos los inputs
- **Autorización**: Middleware de autenticación en todas las rutas
- **Sanitización**: Limpieza de datos antes de procesamiento
- **Logging**: Registro de todas las operaciones críticas

### Frontend
- **Validación**: Verificación de datos antes de envío
- **Manejo de errores**: Captura y presentación de errores del servidor
- **Estados de carga**: Prevención de múltiples envíos
- **Confirmaciones**: Diálogos para acciones destructivas

---

## 📊 Flujo de Trabajo

### 1. Crear Programación
```
Usuario → Formulario → Validación → Backend → Base de Datos → Respuesta
```

### 2. Generar Horarios
```
Programación → Verificación de estado → Cálculo de horarios → Inserción → Confirmación
```

### 3. Gestionar Horarios
```
Selección → Acción → API Call → Actualización BD → Recarga → UI Update
```

### 4. Agregar Elementos
```
Botón → Modal → Formulario → Validación → API → Confirmación → Recarga
```

---

## 🧪 Casos de Uso

### Escenario 1: Programación Regular
1. Administrador crea programación para especialista
2. Define fechas de trabajo (lunes a viernes)
3. Establece horario (9:00 AM - 5:00 PM)
4. Configura intervalo de 30 minutos
5. Genera horarios automáticamente
6. Apertura fechas según necesidad

### Escenario 2: Ajuste de Horarios
1. Especialista solicita cambio de horario
2. Administrador edita fecha específica
3. Modifica horarios individuales
4. Guarda cambios
5. Sistema actualiza disponibilidad

### Escenario 3: Agregado de Horarios
1. Se requiere horario adicional
2. Administrador agrega nueva fecha
3. Define horarios específicos
4. Sistema crea nuevos slots
5. Horarios disponibles para agendar

---

## 🔧 Configuración y Personalización

### Variables de Entorno
```env
API_BASE_URL=http://localhost:8000
HOSPITAL_ID=default
USER_ID=system
```

### Configuración de Base de Datos
- **Motor**: MySQL/MariaDB
- **Charset**: UTF-8
- **Timezone**: Configurable por hospital
- **Soft Deletes**: Habilitado para auditoría

### Personalización de UI
- **Tema**: Material-UI con colores personalizables
- **Idioma**: Soporte para español (configurable)
- **Responsive**: Breakpoints configurables
- **Accesibilidad**: ARIA labels y navegación por teclado

---

## 📈 Métricas y Monitoreo

### Logs del Sistema
- **Creación**: Programaciones y horarios generados
- **Modificaciones**: Cambios en fechas y horarios
- **Eliminaciones**: Programaciones removidas
- **Errores**: Fallos en operaciones críticas

### Estadísticas Disponibles
- Total de programaciones
- Programaciones por estado
- Horarios disponibles vs. ocupados
- Uso por especialista/sucursal

---

## 🚀 Mejoras Futuras

### Funcionalidades Planificadas
- **Recurrencia**: Programaciones automáticas semanales/mensuales
- **Bloqueos**: Horarios bloqueados por mantenimiento
- **Notificaciones**: Alertas de cambios en programación
- **Reportes**: Exportación de horarios y estadísticas
- **API Webhooks**: Notificaciones en tiempo real

### Optimizaciones Técnicas
- **Caché**: Redis para consultas frecuentes
- **Paginación**: Lazy loading para grandes volúmenes
- **Búsqueda**: Filtros avanzados y búsqueda por texto
- **Sincronización**: Offline/online sync para móviles

---

## 🐛 Solución de Problemas

### Problemas Comunes

#### Modal Transparente
- **Causa**: Conflictos de CSS con Material-UI
- **Solución**: Archivo `Modales.css` con reglas `!important`

#### Horarios No Generados
- **Causa**: Programación no activa
- **Solución**: Verificar estado antes de generar

#### Errores de Validación
- **Causa**: Datos incompletos o inválidos
- **Solución**: Validación en frontend y backend

### Debug y Logs
```php
Log::info('Operación realizada', [
    'programacion_id' => $id,
    'usuario' => $request->header('X-User-ID'),
    'timestamp' => now()
]);
```

---

## 📚 Recursos y Referencias

### Documentación Técnica
- **Laravel**: https://laravel.com/docs
- **Material-UI**: https://mui.com/material-ui/
- **React**: https://reactjs.org/docs
- **Date-fns**: https://date-fns.org/

### Estándares de Código
- **PSR-12**: Estándar de codificación PHP
- **ESLint**: Linting de JavaScript
- **Prettier**: Formateo de código
- **Git Hooks**: Pre-commit validation

---

## 👥 Contribución y Mantenimiento

### Equipo de Desarrollo
- **Backend**: Desarrolladores Laravel
- **Frontend**: Desarrolladores React
- **DevOps**: Administradores de sistemas
- **QA**: Testing y calidad

### Proceso de Deployment
1. **Desarrollo**: Feature branches
2. **Testing**: Staging environment
3. **Review**: Code review obligatorio
4. **Deployment**: Producción con rollback
5. **Monitoreo**: Logs y métricas

---

## 📞 Soporte y Contacto

### Canales de Soporte
- **Issues**: GitHub Issues para bugs
- **Documentación**: Wiki del proyecto
- **Chat**: Slack/Discord para equipo
- **Email**: Soporte técnico directo

### Escalación
1. **Nivel 1**: Desarrolladores del equipo
2. **Nivel 2**: Arquitectos del sistema
3. **Nivel 3**: DevOps y infraestructura

---

*Documentación generada automáticamente - Última actualización: Diciembre 2024*
