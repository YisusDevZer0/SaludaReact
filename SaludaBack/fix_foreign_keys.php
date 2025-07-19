<?php

require_once 'vendor/autoload.php';

// Inicializar Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CORRIGIENDO CLAVES FORÁNEAS DE ALMACENES ===\n\n";

// Migraciones que necesitan corrección de claves foráneas
$migrationsToFix = [
    '2024_06_10_000037_create_transferencias_inventario_table.php',
    '2024_06_10_000065_create_reservas_inventario_table.php',
    '2024_06_10_000066_create_alertas_inventario_table.php',
    '2024_06_10_000061_create_stock_almacen_table.php',
    '2024_06_10_000057_create_movimientos_inventario_table.php',
    '2024_06_10_000056_create_inventario_table.php',
    '2024_06_10_000041_create_conteos_fisicos_table.php',
    '2024_06_10_000039_create_ajustes_inventario_table.php',
];

foreach ($migrationsToFix as $migration) {
    echo "🔧 Corrigiendo: $migration\n";
    
    $filePath = "database/migrations/$migration";
    
    if (!file_exists($filePath)) {
        echo "❌ Archivo no encontrado: $filePath\n";
        continue;
    }
    
    $content = file_get_contents($filePath);
    
    // Reemplazar las referencias incorrectas a almacenes
    $originalContent = $content;
    
    // Corregir las claves foráneas de almacenes
    $content = str_replace(
        "->constrained('almacenes')",
        "->constrained('almacenes', 'Almacen_ID')",
        $content
    );
    
    // Si el contenido cambió, guardar el archivo
    if ($content !== $originalContent) {
        file_put_contents($filePath, $content);
        echo "✅ Corregida: $migration\n";
    } else {
        echo "ℹ️  No requiere corrección: $migration\n";
    }
}

echo "\n=== CORRECCIÓN DE CLAVES FORÁNEAS FINALIZADA ===\n"; 