# Configuración de Conexiones Duales de Base de Datos - Sistema de Huellas

Este documento explica cómo configurar y usar múltiples conexiones de base de datos en Laravel para el sistema de huellas sin afectar la conexión principal.

## 1. Configuración del Archivo .env

Crea o edita tu archivo `.env` en la raíz del proyecto y agrega las siguientes variables:

```env
# Conexión principal (ya existente)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tu_base_principal
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password

# Segunda conexión - Base de datos de huellas
DB_SECOND_HOST=localhost
DB_SECOND_PORT=3306
DB_SECOND_DATABASE=u155356178_SaludaHuellas
DB_SECOND_USERNAME=u155356178_SaludaCapturad
DB_SECOND_PASSWORD=z3Z1Huellafo!Tmm]56178
```

## 2. Configuración en config/database.php

Ya se ha agregado la configuración `mysql_second` en el archivo `config/database.php` con los datos de la base de datos de huellas.

## 3. Endpoints Disponibles

### Endpoints de Prueba de Conexiones Duales:
- `GET /api/dual-db/test` - Prueba básica de ambas conexiones
- `POST /api/dual-db/transaction` - Ejemplo de transacción en BD de huellas
- `GET /api/dual-db/combined` - Combina datos de ambas bases de datos

### Endpoints de Gestión de Huellas:
- `GET /api/huellas/` - Obtener todas las huellas
- `GET /api/huellas/test-connection` - Verificar conexión a BD de huellas
- `GET /api/huellas/{id}` - Obtener huella por ID
- `POST /api/huellas/` - Registrar nueva huella
- `PUT /api/huellas/{id}` - Actualizar huella
- `DELETE /api/huellas/{id}` - Eliminar huella
- `GET /api/huellas/usuario/{userId}` - Obtener huellas por usuario

## 4. Ejemplos de Uso

### Registrar una nueva huella:
```bash
POST /api/huellas/
Content-Type: application/json

{
    "id_usuario": 1,
    "huella_digital": "datos_huella_base64_o_texto",
    "estado": "activo"
}
```

### Obtener huellas de un usuario:
```bash
GET /api/huellas/usuario/1
```

### Verificar conexión:
```bash
GET /api/huellas/test-connection
```

## 5. Formas de Usar la Segunda Conexión

### Opción 1: Usando DB::connection() directamente

```php
// Consulta simple en BD de huellas
$huellas = DB::connection('mysql_second')
    ->table('huellas')
    ->where('id_usuario', $userId)
    ->get();

// Transacción en BD de huellas
DB::connection('mysql_second')->beginTransaction();
try {
    // Operaciones en la BD de huellas
    DB::connection('mysql_second')->commit();
} catch (\Exception $e) {
    DB::connection('mysql_second')->rollBack();
}
```

### Opción 2: Usando modelos con conexión específica

```php
class Huella extends Model
{
    protected $connection = 'mysql_second';
    protected $table = 'huellas';
    
    protected $fillable = [
        'id_usuario',
        'huella_digital',
        'fecha_captura',
        'estado'
    ];
}

// Uso
$huella = new Huella();
$huellas = $huella->where('id_usuario', 1)->get();
```

### Opción 3: Combinar datos de ambas bases de datos

```php
public function obtenerDatosCompletos($userId)
{
    // Usuario de la BD principal
    $usuario = DB::connection('mysql')
        ->table('users')
        ->where('id', $userId)
        ->first();
    
    // Huellas de la BD secundaria
    $huellas = DB::connection('mysql_second')
        ->table('huellas')
        ->where('id_usuario', $userId)
        ->get();
    
    return [
        'usuario' => $usuario,
        'huellas' => $huellas
    ];
}
```

## 6. Estructura de la Tabla de Huellas

La tabla `huellas` en la base de datos secundaria debe tener la siguiente estructura:

```sql
CREATE TABLE huellas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    huella_digital TEXT NOT NULL,
    fecha_captura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 7. Consideraciones de Seguridad

1. **Encriptación**: Considera encriptar los datos de huellas digitales
2. **Validación**: Valida siempre los datos de entrada
3. **Permisos**: Asegúrate de que solo usuarios autorizados accedan a los datos de huellas
4. **Backup**: Realiza backups regulares de ambas bases de datos

## 8. Troubleshooting

### Error de conexión a BD de huellas:
- Verifica que el servidor MySQL esté ejecutándose
- Confirma las credenciales en `.env`
- Asegúrate de que la base de datos `u155356178_SaludaHuellas` existe

### Error de tabla no encontrada:
- Verifica que la tabla `huellas` existe en la BD secundaria
- Ejecuta las migraciones si es necesario

### Error de permisos:
- Verifica que el usuario `u155356178_SaludaCapturad` tenga permisos en la BD

## 9. Comandos Útiles

```bash
# Verificar conexión a BD de huellas
php artisan tinker
>>> DB::connection('mysql_second')->select('SELECT 1 as test');

# Limpiar cache de configuración
php artisan config:clear

# Ver configuración actual
php artisan config:show database
```

## 10. Ejemplo de Integración Completa

```php
// En un controlador que maneja autenticación con huellas
public function autenticarConHuella(Request $request)
{
    try {
        $request->validate([
            'id_usuario' => 'required|integer',
            'huella_digital' => 'required|string'
        ]);

        // Verificar usuario en BD principal
        $usuario = DB::connection('mysql')
            ->table('users')
            ->where('id', $request->id_usuario)
            ->first();

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar huella en BD secundaria
        $huella = DB::connection('mysql_second')
            ->table('huellas')
            ->where('id_usuario', $request->id_usuario)
            ->where('huella_digital', $request->huella_digital)
            ->where('estado', 'activo')
            ->first();

        if (!$huella) {
            return response()->json(['error' => 'Huella no válida'], 401);
        }

        // Autenticación exitosa
        return response()->json([
            'success' => true,
            'usuario' => $usuario,
            'message' => 'Autenticación exitosa'
        ]);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
```

## 11. Controlador de Asistencia - Consulta SQL Específica

Se ha creado un controlador específico (`AsistenciaController`) que implementa exactamente la consulta SQL que proporcionaste:

### Consulta Original Implementada:
```sql
SELECT
    p.Id_pernl AS Id_Pernl,
    p.Cedula AS Cedula,
    p.Nombre_Completo AS Nombre_Completo,
    p.Sexo AS Sexo,
    p.Cargo_rol AS Cargo_rol,
    p.Domicilio AS Domicilio,
    a.Id_asis AS Id_asis,
    a.FechaAsis AS FechaAsis,
    a.Nombre_dia AS Nombre_dia,
    a.HoIngreso AS HoIngreso,
    a.HoSalida AS HoSalida,
    a.Tardanzas AS Tardanzas,
    a.Justifacion AS Justifacion,
    a.tipoturno AS tipoturno,
    a.EstadoAsis AS EstadoAsis,
    a.totalhora_tr AS totalhora_tr
FROM
    u155356178_SaludaHuellas.personal p
JOIN u155356178_SaludaHuellas.asistenciaper a
    ON a.Id_Pernl = p.Id_pernl
WHERE
    a.FechaAsis = CURDATE()
```

### Endpoints de Asistencia Disponibles:

#### **Usando SQL Directo:**
- `GET /api/asistencia/hoy` - Asistencia del día actual
- `GET /api/asistencia/por-fecha?fecha=2024-01-15` - Asistencia por fecha específica
- `GET /api/asistencia/por-rango?fecha_inicio=2024-01-01&fecha_fin=2024-01-31` - Asistencia por rango
- `GET /api/asistencia/por-empleado?id_personal=1` - Asistencia de empleado específico
- `GET /api/asistencia/resumen-hoy` - Resumen de asistencia del día
- `GET /api/asistencia/sin-asistencia-hoy` - Empleados sin asistencia hoy
- `GET /api/asistencia/test-connection` - Verificar conexión

#### **Usando Eloquent (Recomendado):**
- `GET /api/asistencia-eloquent/hoy` - Asistencia del día actual
- `GET /api/asistencia-eloquent/por-fecha?fecha=2024-01-15` - Asistencia por fecha
- `GET /api/asistencia-eloquent/por-rango?fecha_inicio=2024-01-01&fecha_fin=2024-01-31` - Asistencia por rango
- `GET /api/asistencia-eloquent/por-empleado?id_personal=1` - Asistencia de empleado
- `GET /api/asistencia-eloquent/resumen-hoy` - Resumen de asistencia
- `GET /api/asistencia-eloquent/sin-asistencia-hoy` - Empleados sin asistencia

### Ejemplo de Uso:

```bash
# Obtener asistencia del día actual
GET /api/asistencia/hoy

# Obtener asistencia de una fecha específica
GET /api/asistencia/por-fecha?fecha=2024-01-15

# Obtener asistencia de un empleado específico
GET /api/asistencia/por-empleado?id_personal=1&fecha_inicio=2024-01-01&fecha_fin=2024-01-31
```

### Modelos Eloquent Creados:

#### **Personal Model:**
```php
class Personal extends Model
{
    protected $connection = 'mysql_second';
    protected $table = 'personal';
    protected $primaryKey = 'Id_pernl';
    
    // Relaciones
    public function asistencias() { ... }
    public function asistenciaHoy() { ... }
    public function asistenciaPorRango($fechaInicio, $fechaFin) { ... }
}
```

#### **Asistencia Model:**
```php
class Asistencia extends Model
{
    protected $connection = 'mysql_second';
    protected $table = 'asistenciaper';
    protected $primaryKey = 'Id_asis';
    
    // Scopes
    public function scopePorFecha($query, $fecha) { ... }
    public function scopePorRangoFechas($query, $fechaInicio, $fechaFin) { ... }
    public function scopePorEmpleado($query, $idPersonal) { ... }
    
    // Accessors
    public function getHorasTrabajadasAttribute() { ... }
    public function getTieneTardanzaAttribute() { ... }
    public function getEstaJustificadoAttribute() { ... }
}
```

### Ventajas del Controlador de Asistencia:

1. **Consulta Exacta**: Implementa exactamente tu consulta SQL original
2. **Flexibilidad**: Permite filtrar por fecha, rango, empleado específico
3. **Resúmenes**: Incluye métodos para obtener estadísticas
4. **Dos Enfoques**: SQL directo y Eloquent para diferentes necesidades
5. **Validación**: Incluye validación de parámetros de entrada
6. **Manejo de Errores**: Gestión completa de excepciones

### Estructura de Respuesta:

```json
{
    "success": true,
    "data": [
        {
            "Id_Pernl": 1,
            "Cedula": "12345678",
            "Nombre_Completo": "Juan Pérez",
            "Sexo": "M",
            "Cargo_rol": "Desarrollador",
            "Domicilio": "Calle 123",
            "Id_asis": 100,
            "FechaAsis": "2024-01-15",
            "Nombre_dia": "Lunes",
            "HoIngreso": "08:00:00",
            "HoSalida": "17:00:00",
            "Tardanzas": 0,
            "Justifacion": "No",
            "tipoturno": "Diurno",
            "EstadoAsis": "Presente",
            "totalhora_tr": 8.5
        }
    ],
    "count": 1,
    "fecha": "2024-01-15"
}
``` 