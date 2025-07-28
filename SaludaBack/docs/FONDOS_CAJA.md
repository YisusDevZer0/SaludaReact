# Sistema de Fondos de Caja

## Descripción General

El sistema de Fondos de Caja es una mejora significativa del sistema anterior que permite gestionar múltiples fondos por caja, con control de saldos, límites y tipos de fondos. Este sistema se integra perfectamente con la tabla de cajas existente y reemplaza el campo `ID_H_O_D` por `Id_Licencia` para mayor claridad.

## Características Principales

### ✅ Mejoras Implementadas

1. **Múltiples Fondos por Caja**: Cada caja puede tener varios fondos con diferentes propósitos
2. **Control de Saldos**: Saldo mínimo, máximo y actual con validaciones
3. **Tipos de Fondos**: Efectivo, Digital y Mixto
4. **Control de Licencias**: Reemplaza `ID_H_O_D` por `Id_Licencia`
5. **Auditoría Completa**: Registro de quién creó y modificó cada fondo
6. **Validaciones Avanzadas**: Control de retiros, aprobaciones y límites
7. **Integración con Cajas**: Relación directa con la tabla de cajas existente

### 🔧 Estructura de la Base de Datos

#### Tabla: `fondos_caja`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | bigint | Clave primaria |
| `caja_id` | bigint | ID de la caja (FK) |
| `sucursal_id` | bigint | ID de la sucursal (FK) |
| `codigo` | varchar(50) | Código único del fondo |
| `nombre` | varchar(100) | Nombre del fondo |
| `descripcion` | text | Descripción detallada |
| `fondo_caja` | decimal(15,2) | Monto inicial del fondo |
| `saldo_actual` | decimal(15,2) | Saldo actual del fondo |
| `saldo_minimo` | decimal(15,2) | Saldo mínimo permitido |
| `saldo_maximo` | decimal(15,2) | Saldo máximo permitido |
| `estatus` | enum | 'activo', 'inactivo', 'suspendido' |
| `codigo_estatus` | varchar(10) | Código de estado (A/I/S) |
| `tipo_fondo` | enum | 'efectivo', 'mixto', 'digital' |
| `permitir_sobrepasar_maximo` | boolean | Permite exceder saldo máximo |
| `requerir_aprobacion_retiro` | boolean | Requiere aprobación para retiros |
| `monto_maximo_retiro` | decimal(15,2) | Monto máximo por retiro |
| `Id_Licencia` | varchar(150) | ID de la licencia |
| `agregado_por` | varchar(100) | Usuario que creó el registro |
| `agregado_el` | timestamp | Fecha de creación |
| `actualizado_por` | varchar(100) | Usuario que modificó |
| `actualizado_el` | timestamp | Fecha de última modificación |

## API Endpoints

### 📋 Operaciones CRUD Básicas

```http
GET    /api/fondos-caja                    # Listar fondos
POST   /api/fondos-caja                    # Crear fondo
GET    /api/fondos-caja/{id}               # Obtener fondo específico
PUT    /api/fondos-caja/{id}               # Actualizar fondo
DELETE /api/fondos-caja/{id}               # Eliminar fondo
```

### 🔍 Consultas Especializadas

```http
GET    /api/fondos-caja/estadisticas       # Estadísticas generales
GET    /api/fondos-caja/opciones           # Opciones para formularios
GET    /api/fondos-caja/por-sucursal       # Fondos por sucursal
GET    /api/fondos-caja/por-caja           # Fondos por caja
GET    /api/fondos-caja/{id}/detalle       # Detalle completo
```

### 💰 Operaciones de Saldo

```http
PUT    /api/fondos-caja/{id}/actualizar-saldo  # Actualizar saldo
```

## Modelo FondoCaja

### Métodos Principales

```php
// Verificar estado del fondo
$fondo->estaActivo()
$fondo->saldoBajo()
$fondo->saldoAlto()

// Calcular valores
$fondo->getPorcentajeUso()
$fondo->getMontoDisponible()
$fondo->puedeRetirar($monto)

// Actualizar saldo
$fondo->actualizarSaldo($monto, $tipo)
```

### Scopes Disponibles

```php
FondoCaja::activos()           // Solo fondos activos
FondoCaja::porSucursal($id)    // Por sucursal
FondoCaja::porCaja($id)        // Por caja
FondoCaja::porTipo($tipo)      // Por tipo de fondo
FondoCaja::delSistema()        // Fondos del sistema
```

## Frontend

### Componentes Creados

1. **FondosCaja.js**: Componente principal con tabla y formularios
2. **FondoCajaDetalle.js**: Modal para mostrar detalles completos
3. **fondos-caja-service.js**: Servicio para comunicación con API

### Características del Frontend

- ✅ Tabla con paginación y filtros
- ✅ Formularios de creación/edición
- ✅ Validaciones en tiempo real
- ✅ Indicadores visuales de estado
- ✅ Estadísticas en tiempo real
- ✅ Responsive design

## Instalación y Configuración

### 1. Ejecutar Migración

```bash
php artisan migrate --path=database/migrations/2025_01_20_000001_create_fondos_caja_table.php
```

### 2. Ejecutar Seeder

```bash
php artisan db:seed --class=FondosCajaSeeder
```

### 3. Script Automático

```bash
php scripts/setup-fondos-caja.php
```

## Uso del Sistema

### Crear un Nuevo Fondo

```javascript
const nuevoFondo = {
  caja_id: 1,
  sucursal_id: 1,
  codigo: 'FC001',
  nombre: 'Fondo Principal',
  descripcion: 'Fondo para operaciones diarias',
  fondo_caja: 50000.00,
  saldo_minimo: 10000.00,
  saldo_maximo: 100000.00,
  tipo_fondo: 'efectivo',
  permitir_sobrepasar_maximo: false,
  requerir_aprobacion_retiro: true,
  monto_maximo_retiro: 5000.00
};

await fondosCajaService.createFondoCaja(nuevoFondo);
```

### Actualizar Saldo

```javascript
const movimiento = {
  monto: 1000.00,
  tipo: 'entrada', // o 'salida'
  concepto: 'Depósito inicial',
  descripcion: 'Depósito para operaciones'
};

await fondosCajaService.actualizarSaldo(fondoId, movimiento);
```

### Verificar Estado

```javascript
const fondo = await fondosCajaService.getFondoCaja(fondoId);

if (fondosCajaService.esEstadoCritico(fondo)) {
  console.log('¡Atención! Saldo bajo');
}

const disponible = fondosCajaService.calcularSaldoDisponible(fondo);
```

## Validaciones y Reglas de Negocio

### ✅ Validaciones Implementadas

1. **Código Único**: No puede repetirse
2. **Saldo Mínimo**: Debe ser mayor a 0
3. **Saldo Máximo**: Opcional, pero si existe debe ser mayor al mínimo
4. **Retiros**: Validación de saldo disponible
5. **Aprobaciones**: Control de montos máximos
6. **Relaciones**: Caja y sucursal deben existir

### 🔒 Reglas de Seguridad

1. **Licencias**: Campo `Id_Licencia` oculto por seguridad
2. **Auditoría**: Registro completo de cambios
3. **Soft Deletes**: Eliminación lógica
4. **Validación de Usuario**: Control de permisos

## Integración con Sistema Existente

### 🔗 Relaciones

- **Cajas**: Un fondo pertenece a una caja
- **Sucursales**: Un fondo pertenece a una sucursal
- **Movimientos**: Un fondo puede tener múltiples movimientos
- **Cierres**: Un fondo puede tener múltiples cierres

### 🔄 Migración desde Sistema Anterior

El sistema anterior tenía esta estructura:
```sql
SELECT `ID_Fon_Caja`, `Fk_Sucursal`, `Fondo_Caja`, `Estatus`, 
       `CodigoEstatus`, `AgregadoPor`, `AgregadoEl`, `Sistema`, `ID_H_O_D` 
FROM `Fondos_Cajas`
```

**Cambios principales:**
- `ID_Fon_Caja` → `id` (auto-increment)
- `Fk_Sucursal` → `sucursal_id` + `caja_id`
- `Fondo_Caja` → `fondo_caja` + `saldo_actual`
- `ID_H_O_D` → `Id_Licencia`
- Agregados campos de control y auditoría

## Monitoreo y Alertas

### 📊 Métricas Disponibles

- Total de fondos por estado
- Saldo total del sistema
- Fondos con saldo bajo
- Porcentaje de uso por fondo
- Movimientos por período

### 🚨 Alertas Automáticas

- Saldo por debajo del mínimo
- Saldo por encima del máximo
- Fondos inactivos
- Retiros sin aprobación

## Próximas Mejoras

### 🚀 Roadmap

1. **Reportes Avanzados**: Exportación a PDF/Excel
2. **Notificaciones**: Alertas en tiempo real
3. **Auditoría Avanzada**: Logs detallados de cambios
4. **API GraphQL**: Consultas más eficientes
5. **Mobile App**: Aplicación móvil nativa
6. **Integración Bancaria**: Conexión con APIs bancarias

### 🔧 Mejoras Técnicas

1. **Cache**: Implementar Redis para consultas frecuentes
2. **Queue**: Procesamiento asíncrono de movimientos
3. **WebSockets**: Actualizaciones en tiempo real
4. **Microservicios**: Separación de responsabilidades

## Soporte y Mantenimiento

### 📞 Contacto

Para soporte técnico o consultas sobre el sistema de fondos de caja, contactar al equipo de desarrollo.

### 📚 Documentación Adicional

- [API Documentation](./API.md)
- [Database Schema](./SCHEMA.md)
- [Frontend Components](./FRONTEND.md)
- [Testing Guide](./TESTING.md)

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Autor**: Equipo de Desarrollo SaludaReact 