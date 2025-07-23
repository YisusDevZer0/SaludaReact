<?php

/**
 * Script para mover imágenes de perfil al directorio correcto
 * 
 * Uso: php scripts/move-profile-images.php
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

// Configurar Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔄 Moviendo imágenes de perfil...\n";

// Directorio de origen (donde están las imágenes actualmente)
$sourceDir = __DIR__ . '/../public/uploads/profiles/';
$destDir = __DIR__ . '/../storage/app/public/profiles/';

// Crear directorio de destino si no existe
if (!File::exists($destDir)) {
    File::makeDirectory($destDir, 0755, true);
    echo "📁 Creado directorio: {$destDir}\n";
}

// Buscar archivos de imágenes
$imageFiles = [
    'yisus.png',
    // Agregar más archivos aquí si es necesario
];

$moved = 0;
$errors = 0;

foreach ($imageFiles as $filename) {
    $sourcePath = $sourceDir . $filename;
    $destPath = $destDir . $filename;
    
    echo "📄 Procesando: {$filename}\n";
    
    // Verificar si el archivo existe en el origen
    if (File::exists($sourcePath)) {
        echo "   ✅ Archivo encontrado en origen\n";
        
        // Verificar si ya existe en el destino
        if (File::exists($destPath)) {
            echo "   ⚠️  El archivo ya existe en el destino\n";
            continue;
        }
        
        try {
            // Copiar archivo
            File::copy($sourcePath, $destPath);
            echo "   ✅ Archivo movido correctamente\n";
            $moved++;
        } catch (Exception $e) {
            echo "   ❌ Error al mover archivo: " . $e->getMessage() . "\n";
            $errors++;
        }
    } else {
        echo "   ❌ Archivo no encontrado en origen: {$sourcePath}\n";
        $errors++;
    }
}

echo "\n📈 Resumen:\n";
echo "   ✅ Movidos: {$moved}\n";
echo "   ❌ Errores: {$errors}\n";

if ($moved > 0) {
    echo "\n💡 Ahora ejecuta el comando para actualizar las URLs:\n";
    echo "   php artisan profile:fix-image-urls --dry-run\n";
    echo "   php artisan profile:fix-image-urls\n";
}

echo "\n🎉 Proceso completado\n"; 