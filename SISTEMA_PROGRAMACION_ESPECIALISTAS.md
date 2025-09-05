# Sistema de Programación de Especialistas - Documentación Completa

## 📊 Estructura de Base de Datos

### 1. Tabla `Programacion_MedicosExt`
**Propósito**: Almacena las programaciones base de los especialistas

```sql
CREATE TABLE `Programacion_MedicosExt` (
  `ID_Programacion` int(11) NOT NULL AUTO_INCREMENT,
  `FK_Medico` int(11) NOT NULL,
  `Fk_Sucursal` int(11) NOT NULL,
  `Tipo_Programacion` varchar(100) NOT NULL,
  `Fecha_Inicio` date NOT NULL,
  `Fecha_Fin` date NOT NULL,
  `Hora_inicio` time NOT NULL,
  `Hora_Fin` time NOT NULL,
  `Intervalo` int(11) NOT NULL,
  `Estatus` varchar(200) NOT NULL,
  `ProgramadoPor` varchar(300) NOT NULL,
  `ProgramadoEn` timestamp NOT NULL DEFAULT current_timestamp(),
  `Sistema` varchar(300) NOT NULL,
  `ID_H_O_D` varchar(300) NOT NULL
);
```

**Estados de Programación**:
- `Programada`: Programación creada pero sin fechas aperturadas
- `Autorizar Horas`: Al menos una fecha está aperturada (cambio automático via trigger)

### 2. Tabla `Fechas_EspecialistasExt`
**Propósito**: Almacena las fechas específicas aperturadas para cada especialista

```sql
CREATE TABLE `Fechas_EspecialistasExt` (
  `ID_Fecha_Esp` int(11) NOT NULL AUTO_INCREMENT,
  `Fecha_Disponibilidad` date NOT NULL,
  `ID_H_O_D` varchar(200) NOT NULL,
  `FK_Especialista` int(12) NOT NULL,
  `Fk_Programacion` int(11) NOT NULL,
  `Estado` varchar(50) NOT NULL,
  `Agrego` varchar(200) NOT NULL,
  `Agregadoen` timestamp NOT NULL DEFAULT current_timestamp()
);
```

**Estados de Fecha**:
- `Disponible`: Fecha aperturada y disponible para horarios
- `Cerrado`: Fecha cerrada (no disponible)

### 3. Tabla `Horarios_Citas_Ext`
**Propósito**: Almacena los horarios específicos para cada fecha

```sql
CREATE TABLE `Horarios_Citas_Ext` (
  `ID_Horario` int(11) NOT NULL AUTO_INCREMENT,
  `Horario_Disponibilidad` time NOT NULL,
  `ID_H_O_D` varchar(200) NOT NULL,
  `FK_Especialista` int(12) NOT NULL,
  `FK_Fecha` int(11) NOT NULL,
  `Fk_Programacion` int(11) NOT NULL,
  `Estado` varchar(50) NOT NULL,
  `AgregadoPor` varchar(150) NOT NULL,
  `AgregadoEl` timestamp NOT NULL DEFAULT current_timestamp()
);
```

**Estados de Horario**:
- `Disponible`: Horario disponible para citas
- `Ocupado`: Horario ocupado por una cita
- `Cerrado`: Horario cerrado (no disponible)

## 🔄 Flujo de Trabajo del Sistema

### Paso 1: Crear Programación
```javascript
// Frontend envía datos de programación
const programacionData = {
  FK_Especialista: 1,
  Fk_Sucursal: 1,
  Tipo_Programacion: 'Regular',
  Fecha_Inicio: '2025-09-01',
  Fecha_Fin: '2025-09-05',
  Hora_inicio: '07:00',
  Hora_Fin: '17:00',
  Intervalo: 30
};

// Backend crea la programación
const programacion = ProgramacionMedicoExt::create([
  'FK_Medico' => $request->FK_Especialista,
  'Fk_Sucursal' => $request->Fk_Sucursal,
  'Tipo_Programacion' => $request->Tipo_Programacion,
  'Fecha_Inicio' => $request->Fecha_Inicio,
  'Fecha_Fin' => $request->Fecha_Fin,
  'Hora_inicio' => $request->Hora_inicio,
  'Hora_Fin' => $request->Hora_Fin,
  'Intervalo' => $request->Intervalo,
  'Estatus' => 'Programada'
]);
```

### Paso 2: Aperturar Fechas
```javascript
// Frontend selecciona fechas para aperturar
const fechasSeleccionadas = ['2025-09-01', '2025-09-03'];

// Backend crea registros en Fechas_EspecialistasExt
fechasSeleccionadas.forEach(fecha => {
  FechaEspecialistaExt::create([
    'Fecha_Disponibilidad' => fecha,
    'FK_Especialista' => programacion.FK_Medico,
    'Fk_Programacion' => programacion.ID_Programacion,
    'Estado' => 'Disponible'
  ]);
});

// Trigger automáticamente cambia Estatus a "Autorizar Horas"
```

### Paso 3: Aperturar Horarios
```javascript
// Frontend selecciona fechas y horarios específicos
const horariosData = {
  fecha: '2025-09-01',
  horarios: [
    { hora: '07:00', estatus: 'Disponible' },
    { hora: '08:00', estatus: 'Disponible' }
  ]
};

// Backend crea horarios en Horarios_Citas_Ext
horariosData.horarios.forEach(horario => {
  HorarioCitaExt::create([
    'Horario_Disponibilidad' => horario.hora,
    'FK_Especialista' => programacion.FK_Medico,
    'FK_Fecha' => fechaEspecialista.ID_Fecha_Esp,
    'Fk_Programacion' => programacion.ID_Programacion,
    'Estado' => horario.estatus
  ]);
});
```

## 🎯 Funcionalidades del Sistema

### 1. Gestión de Programaciones
- **Crear Programación**: Define rango de fechas, horarios e intervalo
- **Editar Programación**: Modificar parámetros de programación existente
- **Eliminar Programación**: Eliminar programación y todos sus datos asociados
- **Filtrar Programaciones**: Por especialista, sucursal, estado, fechas

### 2. Gestión de Fechas
- **Aperturar Fechas**: Marcar fechas específicas como disponibles
- **Eliminar Fechas**: Eliminar fechas y todos sus horarios asociados
- **Editar Fechas**: Cambiar fecha de disponibilidad
- **Visualización**: Ver fechas aperturadas vs cerradas

### 3. Gestión de Horarios
- **Aperturar Horarios**: Crear horarios específicos en fechas aperturadas
- **Selección Múltiple**: Seleccionar múltiples fechas y horarios
- **Eliminar Horarios**: Eliminar horarios específicos
- **Editar Horarios**: Cambiar hora de un horario específico

### 4. Estados Automáticos
- **Programada → Autorizar Horas**: Cambio automático cuando se apertura la primera fecha
- **Trigger de Base de Datos**: Maneja el cambio de estado automáticamente

## 🖥️ Interfaz de Usuario

### 1. Modal de Aperturar Fechas
```
┌─────────────────────────────────────┐
│ Aperturar Fechas y Horarios         │
├─────────────────────────────────────┤
│ Paso 1: Seleccionar Fechas           │
│ [✓] 01/09/2025 - Lunes              │
│ [ ] 02/09/2025 - Martes             │
│ [✓] 03/09/2025 - Miércoles          │
│                                     │
│ [Aperturar Fechas] [Aperturar Horarios] │
└─────────────────────────────────────┘
```

### 2. Modal de Aperturar Horarios
```
┌─────────────────────────────────────┐
│ Aperturar Horarios                  │
├─────────────────────────────────────┤
│ Paso 1: Seleccionar Fechas Aperturadas │
│ [✓] 01/09/2025 (Aperturada)         │
│ [✓] 03/09/2025 (Aperturada)         │
│                                     │
│ Paso 2: Seleccionar Horarios        │
│ [✓] 07:00  [✓] 08:00  [ ] 09:00    │
│ [✓] 10:00  [ ] 11:00  [✓] 12:00    │
│                                     │
│ [Aperturar Horarios Seleccionados]  │
└─────────────────────────────────────┘
```

## 🔧 API Endpoints

### Programaciones
- `POST /api/programacion` - Crear programación
- `GET /api/programacion` - Obtener programaciones
- `DELETE /api/programacion/{id}` - Eliminar programación

### Gestión de Fechas
- `POST /api/programacion/{id}/gestionar-fecha` - Aperturar/eliminar/editar fecha
- `GET /api/programacion/{id}/horarios-por-fecha` - Obtener horarios por fecha

### Gestión de Horarios
- `POST /api/programacion/{id}/agregar-horarios` - Agregar horarios a fecha
- `POST /api/programacion/{id}/horarios/{horarioId}/gestionar` - Gestionar horario individual

### Estadísticas
- `GET /api/programacion/estadisticas` - Obtener estadísticas de programaciones

## 📋 Validaciones del Sistema

### Programación
- Fecha de inicio debe ser posterior a hoy
- Fecha de fin debe ser posterior a fecha de inicio
- Hora de fin debe ser posterior a hora de inicio
- Intervalo debe estar entre 15 y 120 minutos

### Fechas
- Solo se pueden aperturar fechas dentro del rango de la programación
- No se pueden duplicar fechas para la misma programación
- Al eliminar fecha, se eliminan todos sus horarios asociados

### Horarios
- Solo se pueden crear horarios en fechas aperturadas
- Horarios deben estar dentro del rango horario de la programación
- No se pueden duplicar horarios en la misma fecha

## 🔄 Integración con Citas

### Verificación de Disponibilidad
```php
// Verificar si un horario está disponible para cita
$horario = HorarioCitaExt::where([
    'FK_Especialista' => $especialistaId,
    'FK_Fecha' => $fechaId,
    'Horario_Disponibilidad' => $hora,
    'Estado' => 'Disponible'
])->first();

if ($horario) {
    // Horario disponible para cita
    $horario->ocupar(); // Cambiar a 'Ocupado'
}
```

### Liberación de Horarios
```php
// Cuando se cancela una cita
$horario = HorarioCitaExt::find($horarioId);
$horario->aperturar(); // Cambiar de 'Ocupado' a 'Disponible'
```

## 🚀 Ventajas del Sistema

### 1. Flexibilidad
- **Granularidad**: Control individual de fechas y horarios
- **Selección Múltiple**: Aperturar múltiples fechas/horarios simultáneamente
- **Edición Dinámica**: Modificar fechas y horarios sin afectar otros

### 2. Escalabilidad
- **Separación de Responsabilidades**: Fechas y horarios en tablas separadas
- **Relaciones Optimizadas**: Consultas eficientes con índices apropiados
- **Triggers Automáticos**: Cambios de estado sin intervención manual

### 3. Usabilidad
- **Interfaz Intuitiva**: Modales paso a paso para apertura
- **Feedback Visual**: Indicadores de estado y selección
- **Validaciones en Tiempo Real**: Prevención de errores

### 4. Mantenibilidad
- **Código Modular**: Servicios separados para frontend y backend
- **Logging Extensivo**: Trazabilidad de todas las operaciones
- **Documentación Completa**: Guías claras para desarrolladores

## 📝 Notas de Implementación

### Consideraciones de Rendimiento
- Índices en campos de búsqueda frecuente
- Paginación en listados grandes
- Caché para datos de referencia

### Seguridad
- Validación de permisos por usuario
- Sanitización de inputs
- Logs de auditoría

### Compatibilidad
- Soporte para múltiples zonas horarias
- Formato de fechas internacional
- Codificación UTF-8

---

**Sistema desarrollado para SaludaReact - Gestión de Programaciones de Especialistas**
