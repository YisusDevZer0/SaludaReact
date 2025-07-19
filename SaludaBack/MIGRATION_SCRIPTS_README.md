# Scripts de Migración - SaludaBack

Este directorio contiene scripts para manejar las migraciones de la base de datos de manera controlada y corregir problemas de dependencias.

## Problemas Identificados

### 1. Error de Clave Foránea en Almacenes
**Problema**: Las migraciones que referencian la tabla `almacenes` usan `id` como clave primaria, pero la tabla `almacenes` usa `Almacen_ID`.

**Error típico**:
```
SQLSTATE[HY000]: General error: 1005 Can't create table `transferencias_inventario` 
(errno: 150 "Foreign key constraint is incorrectly formed")
```

**Migraciones afectadas**:
- `2024_06_10_000037_create_transferencias_inventario_table.php`
- `2024_06_10_000065_create_reservas_inventario_table.php`
- `2024_06_10_000066_create_alertas_inventario_table.php`
- `2024_06_10_000061_create_stock_almacen_table.php`
- `2024_06_10_000057_create_movimientos_inventario_table.php`
- `2024_06_10_000056_create_inventario_table.php`
- `2024_06_10_000041_create_conteos_fisicos_table.php`
- `2024_06_10_000039_create_ajustes_inventario_table.php`

## Scripts Disponibles

### 1. `run_critical_migrations.php`
**Propósito**: Ejecuta las migraciones críticas en orden de dependencias.

**Características**:
- Ejecuta migraciones en orden correcto (tablas base primero)
- Manejo de errores mejorado
- Contador de éxitos y errores
- Incluye todas las migraciones importantes del sistema

**Uso**:
```bash
php run_critical_migrations.php
```

### 2. `fix_foreign_keys.php`
**Propósito**: Corrige automáticamente las claves foráneas problemáticas.

**Características**:
- Corrige referencias incorrectas a `almacenes`
- Cambia `->constrained('almacenes')` por `->constrained('almacenes', 'Almacen_ID')`
- Procesa solo las migraciones que necesitan corrección

**Uso**:
```bash
php fix_foreign_keys.php
```

### 3. `run_complete_migrations.php` ⭐ **RECOMENDADO**
**Propósito**: Script principal que ejecuta todo el proceso completo.

**Características**:
- Paso 1: Corrige claves foráneas automáticamente
- Paso 2: Ejecuta migraciones en orden correcto
- Manejo completo de errores
- Reporte final detallado

**Uso**:
```bash
php run_complete_migrations.php
```

### 4. `check_migration_dependencies.php`
**Propósito**: Verifica y reporta todas las dependencias de claves foráneas.

**Características**:
- Analiza todas las migraciones
- Detecta posibles problemas de dependencias
- Genera reporte detallado
- Útil para auditoría y mantenimiento

**Uso**:
```bash
php check_migration_dependencies.php
```

## Orden de Ejecución Recomendado

1. **Verificar dependencias** (opcional):
   ```bash
   php check_migration_dependencies.php
   ```

2. **Ejecutar proceso completo**:
   ```bash
   php run_complete_migrations.php
   ```

## Estructura de Migraciones

Las migraciones están organizadas en el siguiente orden de dependencias:

### 1. Tablas Base Fundamentales
- `password_resets`
- `roles_puestos`
- `permisos`
- `permission_role`
- `sucursales`
- `personal_pos`

### 2. Tablas de Servicios y Marcas
- `servicios`
- `marcas`
- `servicio_marca`

### 3. Tabla Crítica de Almacenes
- `almacenes` (usa `Almacen_ID` como clave primaria)

### 4. Tablas de Categorías y Presentaciones
- `categorias_pos`
- `presentaciones`
- `componentes_activos`

### 5. Tablas de Clientes y Proveedores
- `proveedores`
- `clientes`

### 6. Tablas de Ventas y Compras
- `ventas`
- `compras`
- `detalles_venta`
- `detalles_compra`

### 7. Tablas de Inventario Base
- `inventario`
- `movimientos_inventario`
- `stock_almacen`

### 8. Tablas de Gestión de Inventario
- `ajustes_inventario`
- `conteos_fisicos`
- `reservas_inventario`
- `alertas_inventario`

### 9. Tablas de Transferencias
- `transferencias_inventario`
- `detalles_transferencia`
- `detalles_ajuste`
- `detalles_conteo`

### 10. Otras Tablas
- Productos, caja, médicas, pacientes, créditos, auditoría

## Solución de Problemas

### Si hay errores de migración:

1. **Verificar el estado de la base de datos**:
   ```bash
   php artisan migrate:status
   ```

2. **Revisar logs de errores**:
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Ejecutar migraciones específicas**:
   ```bash
   php artisan migrate --path=database/migrations/2024_01_15_000004_create_almacenes_table.php --force
   ```

### Si hay problemas de claves foráneas:

1. **Verificar la estructura de la tabla almacenes**:
   ```sql
   DESCRIBE almacenes;
   ```

2. **Corregir manualmente si es necesario**:
   ```sql
   ALTER TABLE transferencias_inventario 
   DROP FOREIGN KEY transferencias_inventario_almacen_origen_id_foreign;
   
   ALTER TABLE transferencias_inventario 
   ADD CONSTRAINT transferencias_inventario_almacen_origen_id_foreign 
   FOREIGN KEY (almacen_origen_id) REFERENCES almacenes(Almacen_ID);
   ```

## Notas Importantes

- **Siempre hacer backup** antes de ejecutar migraciones
- **Ejecutar en entorno de desarrollo** primero
- **Verificar dependencias** antes de ejecutar en producción
- **Revisar logs** después de cada ejecución

## Contacto

Para problemas o preguntas sobre estos scripts, revisar los logs de Laravel o consultar la documentación del proyecto. 