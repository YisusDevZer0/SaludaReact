<?php

require_once 'vendor/autoload.php';

// Inicializar Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CORRIGIENDO TODAS LAS CLAVES FORÁNEAS PROBLEMÁTICAS ===\n\n";

// Definir todas las correcciones necesarias basadas en las claves primarias personalizadas encontradas
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
    ],
    
    // Correcciones para servicios
    'servicios' => [
        'old' => "->constrained('servicios')",
        'new' => "->constrained('servicios', 'Servicio_ID')",
        'migrations' => [
            // Agregar aquí las migraciones que referencien servicios
        ]
    ],
    
    // Correcciones para marcas
    'marcas' => [
        'old' => "->constrained('marcas')",
        'new' => "->constrained('marcas', 'Marca_ID')",
        'migrations' => [
            // Agregar aquí las migraciones que referencien marcas
        ]
    ],
    
    // Correcciones para servicios_pos
    'servicios_pos' => [
        'old' => "->constrained('servicios_pos')",
        'new' => "->constrained('servicios_pos', 'Servicio_ID')",
        'migrations' => [
            // Agregar aquí las migraciones que referencien servicios_pos
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

echo "=== RESUMEN DE CORRECCIONES ===\n";
echo "📁 Archivos procesados: $totalFiles\n";
echo "🔧 Correcciones aplicadas: $totalCorrections\n";
echo "✅ Corrección de claves foráneas completada\n\n";

// Verificar si hay otras referencias problemáticas
echo "🔍 Verificando otras posibles referencias problemáticas...\n\n";

$migrationsPath = 'database/migrations';
$migrations = glob($migrationsPath . '/*.php');

$otherIssues = [];

foreach ($migrations as $migration) {
    $filename = basename($migration);
    $content = file_get_contents($migration);
    
    // Buscar referencias a tablas que podrían tener claves primarias personalizadas
    $tablesToCheck = [
        'servicios' => 'Servicio_ID',
        'marcas' => 'Marca_ID',
        'servicios_pos' => 'Servicio_ID',
        'almacenes' => 'Almacen_ID',
        'pacientes' => 'Paciente_ID',
        'doctores' => 'Doctor_ID',
        'agendas' => 'Agenda_ID'
    ];
    
    foreach ($tablesToCheck as $table => $primaryKey) {
        if (strpos($content, "->constrained('$table')") !== false) {
            $otherIssues[] = [
                'file' => $filename,
                'table' => $table,
                'primaryKey' => $primaryKey,
                'issue' => "Posible referencia incorrecta a $table (debería usar $primaryKey)"
            ];
        }
    }
}

if (!empty($otherIssues)) {
    echo "⚠️  OTRAS POSIBLES REFERENCIAS PROBLEMÁTICAS:\n\n";
    foreach ($otherIssues as $issue) {
        echo "❌ {$issue['file']}: {$issue['issue']}\n";
    }
    echo "\n";
} else {
    echo "✅ No se detectaron otras referencias problemáticas\n\n";
}

echo "=== PROCESO DE CORRECCIÓN FINALIZADO ===\n"; 