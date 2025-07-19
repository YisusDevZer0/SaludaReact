<?php

require_once 'vendor/autoload.php';

// Inicializar Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== PROCESO COMPLETO DE MIGRACIONES ===\n\n";

// Paso 1: Corregir todas las claves foráneas problemáticas
echo "🔧 PASO 1: Corrigiendo todas las claves foráneas problemáticas...\n\n";

// Definir todas las correcciones necesarias
$corrections = [
    // Correcciones para almacenes
    'almacenes' => [
        'old' => "->constrained('almacenes')",
        'new' => "->constrained('almacenes', 'Almacen_ID')",
        'migrations' => [
            '2024_06_10_000037_create_transferencias_inventario_table.php',
            '2024_06_10_000065_create_reservas_inventario_table.php',
            '2024_06_10_000066_create_alertas_inventario_table.php',
            '2024_06_10_000061_create_stock_almacen_table.php',
            '2024_06_10_000057_create_movimientos_inventario_table.php',
            '2024_06_10_000056_create_inventario_table.php',
            '2024_06_10_000041_create_conteos_fisicos_table.php',
            '2024_06_10_000039_create_ajustes_inventario_table.php',
        ]
    ],
    
    // Correcciones para pacientes
    'pacientes' => [
        'old' => "->constrained('pacientes')",
        'new' => "->constrained('pacientes', 'Paciente_ID')",
        'migrations' => [
            '2024_06_10_000076_create_pacientes_medicos_table.php',
            '2024_06_10_000077_create_recetas_medicas_table.php',
            '2024_06_10_000068_create_historial_clinico_table.php',
            '2024_06_10_000079_create_antecedentes_medicos_table.php',
            '2024_06_10_000080_create_estudios_medicos_table.php',
            '2024_06_10_000082_create_creditos_table.php',
            '2024_06_10_000072_create_creditos_dentales_table.php',
        ]
    ],
    
    // Correcciones para doctores
    'doctores' => [
        'old' => "->constrained('doctores')",
        'new' => "->constrained('doctores', 'Doctor_ID')",
        'migrations' => [
            '2024_06_10_000076_create_pacientes_medicos_table.php',
            '2024_06_10_000074_create_tratamientos_dentales_table.php',
            '2024_06_10_000075_create_sesiones_dentales_table.php',
        ]
    ],
    
    // Correcciones para agendas
    'agendas' => [
        'old' => "->constrained('agendas')",
        'new' => "->constrained('agendas', 'Agenda_ID')",
        'migrations' => [
            '2024_06_10_000081_create_agendas_medicas_table.php',
        ]
    ]
];

$totalCorrections = 0;
$totalFiles = 0;

foreach ($corrections as $table => $correction) {
    echo "🔧 Corrigiendo referencias a tabla: $table\n";
    
    foreach ($correction['migrations'] as $migration) {
        $filePath = "database/migrations/$migration";
        
        if (!file_exists($filePath)) {
            echo "  ❌ Archivo no encontrado: $migration\n";
            continue;
        }
        
        $content = file_get_contents($filePath);
        $originalContent = $content;
        
        // Aplicar la corrección
        $content = str_replace($correction['old'], $correction['new'], $content);
        
        // Si el contenido cambió, guardar el archivo
        if ($content !== $originalContent) {
            file_put_contents($filePath, $content);
            echo "  ✅ Corregida: $migration\n";
            $totalCorrections++;
        } else {
            echo "  ℹ️  No requiere corrección: $migration\n";
        }
        
        $totalFiles++;
    }
    
    echo "\n";
}

echo "✅ Corrección de claves foráneas completada\n";
echo "📁 Archivos procesados: $totalFiles\n";
echo "🔧 Correcciones aplicadas: $totalCorrections\n\n";

// Paso 2: Ejecutar migraciones críticas
echo "🔄 PASO 2: Ejecutando migraciones críticas...\n\n";

// Migraciones en orden de dependencias
$criticalMigrations = [
    // 1. Tablas base fundamentales
    '2014_10_12_100000_create_password_resets_table.php',
    '2024_06_10_000001_create_roles_puestos_table.php',
    '2024_06_10_000002_create_permisos_table.php',
    '2024_06_10_000004_create_permission_role_table.php',
    '2024_06_10_000005_create_sucursales_table.php',
    '2024_06_10_000006_create_personal_pos_table.php',
    
    // 2. Tablas de servicios y marcas
    '2024_01_15_000001_create_servicios_table.php',
    '2024_01_15_000002_create_marcas_table.php',
    '2024_01_15_000003_create_servicio_marca_table.php',
    
    // 3. Tabla de almacenes (crítica para inventario)
    '2024_01_15_000004_create_almacenes_table.php',
    
    // 4. Tablas de categorías y presentaciones
    '2024_06_10_000004_create_categorias_pos_table.php',
    '2024_06_10_000005_create_presentaciones_table.php',
    '2024_06_10_000006_create_componentes_activos_table.php',
    
    // 5. Tablas de clientes y proveedores
    '2024_06_10_000008_create_proveedores_table.php',
    '2024_06_10_000011_create_clientes_table.php',
    
    // 6. Tablas de ventas y compras
    '2024_06_10_000012_create_ventas_table.php',
    '2024_06_10_000014_create_compras_table.php',
    '2024_06_10_000058_create_detalles_venta_table.php',
    '2024_06_10_000059_create_detalles_compra_table.php',
    
    // 7. Tablas de inventario base
    '2024_06_10_000056_create_inventario_table.php',
    '2024_06_10_000057_create_movimientos_inventario_table.php',
    '2024_06_10_000061_create_stock_almacen_table.php',
    
    // 8. Tablas de gestión de inventario
    '2024_06_10_000039_create_ajustes_inventario_table.php',
    '2024_06_10_000041_create_conteos_fisicos_table.php',
    '2024_06_10_000065_create_reservas_inventario_table.php',
    '2024_06_10_000066_create_alertas_inventario_table.php',
    
    // 9. Tablas de transferencias (ahora corregidas)
    '2024_06_10_000037_create_transferencias_inventario_table.php',
    '2024_06_10_000062_create_detalles_transferencia_table.php',
    '2024_06_10_000063_create_detalles_ajuste_table.php',
    '2024_06_10_000064_create_detalles_conteo_table.php',
    
    // 10. Tablas de productos
    '2024_06_10_000055_create_productos_table.php',
    
    // 11. Tablas de caja
    '2024_06_10_000045_create_cajas_table.php',
    '2024_06_10_000046_create_movimientos_caja_table.php',
    '2024_06_10_000047_create_gastos_table.php',
    '2024_06_10_000048_create_encargos_table.php',
    '2024_06_10_000049_create_detalles_encargo_table.php',
    '2024_06_10_000050_create_categorias_gasto_table.php',
    '2024_06_10_000051_create_cierres_caja_table.php',
    
    // 12. Tablas médicas
    '2024_06_10_000016_create_especialidades_medicas_table.php',
    '2024_06_10_000022_create_consultorios_table.php',
    '2024_06_10_000023_create_obras_sociales_table.php',
    '2024_06_10_000024_create_planes_obra_social_table.php',
    '2024_06_10_000025_create_enfermeros_table.php',
    '2024_06_10_000026_create_carritos_enfermeros_table.php',
    '2024_06_10_000029_create_procedimientos_medicos_table.php',
    
    // 13. Tablas de pacientes y agendas médicas
    '2025_01_15_000001_create_agendas_table.php',
    '2025_01_15_000002_create_pacientes_table.php',
    '2025_01_15_000003_create_doctores_table.php',
    '2024_06_10_000076_create_pacientes_medicos_table.php',
    '2024_06_10_000077_create_recetas_medicas_table.php',
    '2024_06_10_000060_create_detalles_receta_table.php',
    '2024_06_10_000068_create_historial_clinico_table.php',
    '2024_06_10_000079_create_antecedentes_medicos_table.php',
    '2024_06_10_000080_create_estudios_medicos_table.php',
    '2024_06_10_000081_create_agendas_medicas_table.php',
    
    // 14. Tablas de créditos
    '2024_06_10_000082_create_creditos_table.php',
    '2024_06_10_000086_create_cuotas_credito_table.php',
    '2024_06_10_000072_create_creditos_dentales_table.php',
    '2024_06_10_000073_create_cuotas_credito_dental_table.php',
    '2024_06_10_000074_create_tratamientos_dentales_table.php',
    '2024_06_10_000075_create_sesiones_dentales_table.php',
    
    // 15. Tablas de auditoría
    '2024_06_01_000000_create_auditorias_table.php',
];

$successCount = 0;
$errorCount = 0;

foreach ($criticalMigrations as $migration) {
    echo "🔄 Ejecutando: $migration\n";
    
    try {
        $command = "php artisan migrate --path=database/migrations/$migration --force 2>&1";
        $output = shell_exec($command);
        
        if (strpos($output, 'FAIL') !== false || strpos($output, 'error') !== false || strpos($output, 'Exception') !== false) {
            echo "❌ Error en: $migration\n";
            echo $output . "\n";
            $errorCount++;
        } else {
            echo "✅ Completada: $migration\n";
            $successCount++;
        }
    } catch (Exception $e) {
        echo "❌ Excepción en: $migration - " . $e->getMessage() . "\n";
        $errorCount++;
    }
    
    echo "\n";
}

echo "=== RESUMEN FINAL ===\n";
echo "✅ Migraciones exitosas: $successCount\n";
echo "❌ Migraciones con errores: $errorCount\n";
echo "=== PROCESO COMPLETO FINALIZADO ===\n"; 