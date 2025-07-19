<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// Inicializar Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== EJECUTANDO MIGRACIONES EN ORDEN CORRECTO ===\n\n";

// Lista de migraciones en orden correcto (dependencias primero)
$migrations = [
    // Migraciones base (ya ejecutadas)
    '2014_10_12_100000_create_password_resets_table.php',
    '2016_06_01_000001_create_oauth_auth_codes_table.php',
    '2016_06_01_000002_create_oauth_access_tokens_table.php',
    '2016_06_01_000003_create_oauth_refresh_tokens_table.php',
    '2016_06_01_000004_create_oauth_clients_table.php',
    '2016_06_01_000005_create_oauth_personal_access_clients_table.php',
    '2019_12_14_000001_create_personal_access_tokens_table.php',
    
    // Tablas base del sistema
    '2024_01_15_000001_create_servicios_table.php',
    '2024_01_15_000002_create_marcas_table.php',
    '2024_01_15_000003_create_servicio_marca_table.php',
    '2024_01_15_000004_create_almacenes_table.php',
    '2024_01_20_000001_create_servicios_pos_table.php',
    
    // Roles y permisos
    '2024_06_10_000001_create_roles_puestos_table.php',
    '2024_06_10_000002_create_permisos_table.php',
    '2024_06_10_000004_create_permission_role_table.php',
    
    // Sucursales y personal
    '2024_06_10_000005_create_sucursales_table.php',
    '2024_06_10_000006_create_personal_pos_table.php',
    '2024_06_10_000007_create_role_user_table.php',
    
    // Entidades principales
    '2024_06_10_000008_create_proveedores_table.php',
    '2024_06_10_000011_create_clientes_table.php',
    
    // Ventas y compras
    '2024_06_10_000012_create_ventas_table.php',
    '2024_06_10_000014_create_compras_table.php',
    
    // Inventario
    '2024_06_10_000037_create_transferencias_inventario_table.php',
    '2024_06_10_000039_create_ajustes_inventario_table.php',
    '2024_06_10_000041_create_conteos_fisicos_table.php',
    
    // Productos e inventario
    '2024_06_10_000055_create_productos_table.php',
    '2024_06_10_000056_create_inventario_table.php',
    '2024_06_10_000057_create_movimientos_inventario_table.php',
    
    // Detalles de ventas y compras
    '2024_06_10_000058_create_detalles_venta_table.php',
    '2024_06_10_000059_create_detalles_compra_table.php',
    
    // Stock y detalles de inventario
    '2024_06_10_000061_create_stock_almacen_table.php',
    '2024_06_10_000062_create_detalles_transferencia_table.php',
    '2024_06_10_000063_create_detalles_ajuste_table.php',
    '2024_06_10_000064_create_detalles_conteo_table.php',
    
    // Créditos dentales (ya corregidas)
    '2024_06_10_000072_create_creditos_dentales_table.php',
    '2024_06_10_000073_create_cuotas_credito_dental_table.php',
];

$migrationsPath = 'database/migrations/';

foreach ($migrations as $migration) {
    $fullPath = $migrationsPath . $migration;
    
    if (!file_exists($fullPath)) {
        echo "⚠️  Migración no encontrada: $migration\n";
        continue;
    }
    
    // Extraer nombre de tabla del archivo
    $tableName = '';
    if (preg_match('/create_(\w+)_table/', $migration, $matches)) {
        $tableName = $matches[1];
    }
    
    // Verificar si la tabla ya existe
    if ($tableName && Schema::hasTable($tableName)) {
        echo "✅ Tabla '$tableName' ya existe, saltando: $migration\n";
        continue;
    }
    
    echo "🔄 Ejecutando: $migration\n";
    
    try {
        // Ejecutar migración específica
        $command = "php artisan migrate --path=database/migrations/$migration --force";
        $output = shell_exec($command);
        
        if (strpos($output, 'FAIL') !== false) {
            echo "❌ Error en: $migration\n";
            echo $output . "\n";
        } else {
            echo "✅ Completada: $migration\n";
        }
    } catch (Exception $e) {
        echo "❌ Excepción en: $migration - " . $e->getMessage() . "\n";
    }
    
    echo "\n";
}

echo "=== FINALIZADO ===\n"; 