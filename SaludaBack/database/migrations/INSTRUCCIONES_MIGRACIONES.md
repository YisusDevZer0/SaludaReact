# Instrucciones para Ejecutar las Migraciones

## 📋 Orden de Ejecución

### 1. Eliminar Tablas Anteriores
```bash
php artisan migrate --path=database/migrations/2025_09_01_000001_drop_old_programacion_tables.php
```

### 2. Crear Nueva Estructura
```bash
# Crear tabla principal de programaciones
php artisan migrate --path=database/migrations/2025_09_01_000002_create_programacion_medicosext_table.php

# Crear tabla de fechas
php artisan migrate --path=database/migrations/2025_09_01_000003_create_fechas_especialistasext_table.php

# Crear tabla de horarios
php artisan migrate --path=database/migrations/2025_09_01_000004_create_horarios_citas_ext_table.php

# Crear tabla de programaciones completadas (para triggers)
php artisan migrate --path=database/migrations/2025_09_01_000006_create_programacion_medicosext_completos_table.php

# Crear triggers
php artisan migrate --path=database/migrations/2025_09_01_000005_create_triggers_for_programacion.php
```

## 🔄 Ejecutar Todas las Migraciones de Una Vez

```bash
php artisan migrate --path=database/migrations/2025_09_01_000001_drop_old_programacion_tables.php
php artisan migrate --path=database/migrations/2025_09_01_000002_create_programacion_medicosext_table.php
php artisan migrate --path=database/migrations/2025_09_01_000003_create_fechas_especialistasext_table.php
php artisan migrate --path=database/migrations/2025_09_01_000004_create_horarios_citas_ext_table.php
php artisan migrate --path=database/migrations/2025_09_01_000006_create_programacion_medicosext_completos_table.php
php artisan migrate --path=database/migrations/2025_09_01_000005_create_triggers_for_programacion.php
```

## ⚠️ Notas Importantes

### Antes de Ejecutar
1. **Hacer backup** de la base de datos actual
2. **Verificar** que no hay datos importantes en las tablas que se van a eliminar
3. **Confirmar** que las tablas de referencia existen (`especialistas_mejorados`, `sucursales_mejoradas`)

### Después de Ejecutar
1. **Verificar** que las tablas se crearon correctamente
2. **Comprobar** que los triggers funcionan
3. **Probar** la funcionalidad del sistema

## 🔍 Verificar la Estructura

### Comprobar Tablas Creadas
```sql
SHOW TABLES LIKE '%Programacion%';
SHOW TABLES LIKE '%Fechas%';
SHOW TABLES LIKE '%Horarios%';
```

### Verificar Triggers
```sql
SHOW TRIGGERS;
```

### Verificar Estructura de Tablas
```sql
DESCRIBE Programacion_MedicosExt;
DESCRIBE Fechas_EspecialistasExt;
DESCRIBE Horarios_Citas_Ext;
DESCRIBE Programacion_MedicosExt_Completos;
```

## 🚨 Rollback (Si es Necesario)

```bash
# Revertir migraciones en orden inverso
php artisan migrate:rollback --path=database/migrations/2025_09_01_000005_create_triggers_for_programacion.php
php artisan migrate:rollback --path=database/migrations/2025_09_01_000006_create_programacion_medicosext_completos_table.php
php artisan migrate:rollback --path=database/migrations/2025_09_01_000004_create_horarios_citas_ext_table.php
php artisan migrate:rollback --path=database/migrations/2025_09_01_000003_create_fechas_especialistasext_table.php
php artisan migrate:rollback --path=database/migrations/2025_09_01_000002_create_programacion_medicosext_table.php
```

## 📊 Estructura Final

### Tablas Principales
- `Programacion_MedicosExt` - Programaciones de especialistas
- `Fechas_EspecialistasExt` - Fechas aperturadas por especialista
- `Horarios_Citas_Ext` - Horarios disponibles por fecha

### Tabla de Auditoría
- `Programacion_MedicosExt_Completos` - Registro de programaciones eliminadas

### Triggers
- `ActualizaFechas` - Cambia estado a "Autorizar Horas" cuando se apertura fecha
- `Horarios_completos` - Registra programaciones eliminadas

---

**Sistema de Programación de Especialistas - SaludaReact**
