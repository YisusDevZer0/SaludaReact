# Migraciones para Sistema de Agendas Mejorado - SaludaBack

## 📋 Descripción

Este conjunto de migraciones implementa la estructura mejorada de base de datos para el sistema de agendas de especialistas de SaludaReact, reemplazando la estructura anterior con una arquitectura más robusta y escalable.

## 🗄️ Tablas Creadas

### 1. **especialidades** (2025_08_25_000001)
- Gestión centralizada de especialidades médicas
- Colores personalizables para calendario
- Control de estatus activo/inactivo

### 2. **especialistas** (2025_08_25_000002)
- Información completa de médicos especialistas
- Integración con Google Calendar
- Control de estatus (activo, vacaciones, licencia)

### 3. **sucursales_mejoradas** (2025_08_25_000003)
- Gestión de múltiples ubicaciones
- Horarios de operación
- Información de contacto

### 4. **consultorios_mejorados** (2025_08_25_000004)
- Gestión de espacios físicos
- Control de disponibilidad
- Equipamiento disponible

### 5. **pacientes_mejorados** (2025_08_25_000005)
- Información completa del paciente
- Historial médico básico
- Control de estatus

### 6. **programacion_especialistas** (2025_08_25_000006)
- Programación de horarios de trabajo
- Control de intervalos entre citas
- Gestión de tipos de programación

### 7. **horarios_disponibles** (2025_08_25_000007)
- Control automático de disponibilidad
- Estados: Disponible, Reservado, Ocupado, Bloqueado
- Generación automática basada en programación

### 8. **citas_mejoradas** (2025_08_25_000008)
- Tabla principal de agenda
- Relaciones con todas las entidades
- Control de estados y tipos de cita

### 9. **historial_estados_citas** (2025_08_25_000009)
- Trazabilidad completa de cambios de estado
- Motivos y comentarios de cambios
- Auditoría temporal

### 10. **notificaciones_citas** (2025_08_25_000010)
- Sistema de notificaciones automáticas
- Múltiples medios de envío
- Control de estado de envío

### 11. **auditoria_cambios** (2025_08_25_000011)
- Auditoría completa de todas las operaciones
- Captura de valores antes y después
- Información de usuario y contexto

### 12. **Vistas Útiles** (2025_08_25_000012)
- `v_citas_hoy`: Citas del día actual
- `v_estadisticas_citas`: Estadísticas generales del sistema

### 13. **Datos de Ejemplo** (2025_08_25_000013)
- Especialidades médicas comunes
- Sucursales de ejemplo
- Consultorios de ejemplo

## 🚀 Instalación

### Prerrequisitos
- Laravel 10+ instalado
- Base de datos MySQL/MariaDB configurada
- Composer instalado

### Pasos de Instalación

1. **Navegar al directorio del proyecto**
   ```bash
   cd SaludaBack
   ```

2. **Instalar dependencias**
   ```bash
   composer install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con la configuración de tu base de datos
   ```

4. **Generar clave de aplicación**
   ```bash
   php artisan key:generate
   ```

5. **Ejecutar migraciones existentes** (si las hay)
   ```bash
   php artisan migrate
   ```

6. **Ejecutar las nuevas migraciones de agendas**
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

   **O ejecutar todas las migraciones de una vez:**
   ```bash
   php artisan migrate
   ```

## 🔧 Configuración Adicional

### 1. **Verificar Estructura de Base de Datos**
```bash
php artisan migrate:status
```

### 2. **Revisar Tablas Creadas**
```bash
php artisan tinker
>>> Schema::getAllTables();
```

### 3. **Verificar Vistas**
```sql
SHOW TABLES LIKE 'v_%';
```

## 📊 Estructura de Relaciones

```
especialidades (1) ←→ (N) especialistas
especialistas (1) ←→ (N) programacion_especialistas
sucursales_mejoradas (1) ←→ (N) consultorios_mejorados
sucursales_mejoradas (1) ←→ (N) programacion_especialistas
consultorios_mejorados (1) ←→ (N) programacion_especialistas
programacion_especialistas (1) ←→ (N) horarios_disponibles
pacientes_mejorados (1) ←→ (N) citas_mejoradas
especialistas (1) ←→ (N) citas_mejoradas
sucursales_mejoradas (1) ←→ (N) citas_mejoradas
consultorios_mejorados (1) ←→ (N) citas_mejoradas
citas_mejoradas (1) ←→ (N) historial_estados_citas
citas_mejoradas (1) ←→ (N) notificaciones_citas
```

## 🚨 Consideraciones Importantes

### 1. **Orden de Ejecución**
Las migraciones deben ejecutarse en el orden especificado debido a las dependencias de claves foráneas.

### 2. **Compatibilidad**
- Las nuevas tablas tienen nombres diferentes a las existentes para evitar conflictos
- Se pueden mantener las tablas antiguas durante la transición

### 3. **Migración de Datos**
Si necesitas migrar datos existentes, crea migraciones adicionales que:
- Copien datos de las tablas antiguas a las nuevas
- Mapeen campos según corresponda
- Validen la integridad de los datos

### 4. **Rollback**
Para revertir las migraciones:
```bash
php artisan migrate:rollback --step=13
```

## 🔍 Verificación de Instalación

### 1. **Verificar Tablas Creadas**
```sql
SHOW TABLES LIKE '%mejorad%';
SHOW TABLES LIKE '%especialidad%';
SHOW TABLES LIKE '%especialista%';
```

### 2. **Verificar Vistas**
```sql
SELECT * FROM v_citas_hoy LIMIT 5;
SELECT * FROM v_estadisticas_citas;
```

### 3. **Verificar Datos de Ejemplo**
```sql
SELECT * FROM especialidades;
SELECT * FROM sucursales_mejoradas;
SELECT * FROM consultorios_mejorados;
```

## 📝 Notas de Desarrollo

### 1. **Nomenclatura**
- Se mantiene la convención de Laravel para nombres de tablas
- Los nombres de campos siguen el patrón del proyecto existente
- Se usan prefijos para evitar conflictos con tablas existentes

### 2. **Índices**
- Se han creado índices compuestos para consultas frecuentes
- Se optimizan consultas por fecha, especialista y sucursal

### 3. **Auditoría**
- Sistema completo de auditoría automática
- Captura de cambios en tiempo real
- Historial de modificaciones

## 🆘 Solución de Problemas

### Error: "Table already exists"
```bash
php artisan migrate:rollback
php artisan migrate
```

### Error: "Foreign key constraint fails"
Verificar que las tablas padre se hayan creado correctamente:
```bash
php artisan migrate:status
```

### Error: "View already exists"
```sql
DROP VIEW IF EXISTS v_citas_hoy;
DROP VIEW IF EXISTS v_estadisticas_citas;
```

## 📞 Soporte

Para problemas o consultas sobre las migraciones:
1. Revisar logs de Laravel: `storage/logs/laravel.log`
2. Verificar estado de migraciones: `php artisan migrate:status`
3. Consultar documentación de Laravel sobre migraciones

---

**Nota**: Estas migraciones están diseñadas para trabajar con Laravel 10+ y MySQL/MariaDB. Asegúrate de tener las versiones correctas instaladas.
