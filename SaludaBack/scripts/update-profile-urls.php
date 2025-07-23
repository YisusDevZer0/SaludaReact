<?php

/**
 * Script para actualizar URLs de imágenes de perfil en la base de datos
 * 
 * Uso: php scripts/update-profile-urls.php
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Configurar Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔄 Actualizando URLs de imágenes de perfil...\n";

// Obtener la URL base de la aplicación
$baseUrl = config('app.url');
if (!$baseUrl) {
    $baseUrl = 'http://localhost:8000';
}

echo "🌐 URL base: {$baseUrl}\n";

// Buscar usuarios con foto_perfil
$users = DB::table('personal_pos')
    ->whereNotNull('foto_perfil')
    ->where('foto_perfil', '!=', '')
    ->get();

if ($users->isEmpty()) {
    echo "✅ No se encontraron usuarios con imágenes de perfil.\n";
    exit;
}

echo "📊 Se encontraron {$users->count()} usuarios con imágenes de perfil.\n\n";

$updated = 0;
$errors = 0;

foreach ($users as $user) {
    $originalValue = $user->foto_perfil;
    
    echo "👤 Usuario: {$user->nombre} {$user->apellido} (ID: {$user->id})\n";
    echo "   Original: {$originalValue}\n";
    
    // Verificar si ya es una URL completa
    if (filter_var($originalValue, FILTER_VALIDATE_URL)) {
        echo "   ✅ Ya es una URL válida - No requiere cambios\n\n";
        continue;
    }
    
            // Si es solo un nombre de archivo, construir la URL completa
        if ($originalValue && strpos($originalValue, '/') === false) {
            $newUrl = $baseUrl . '/uploads/profiles/avatars/' . $originalValue;
        
        try {
            DB::table('personal_pos')
                ->where('id', $user->id)
                ->update(['foto_perfil' => $newUrl]);
            
            echo "   ✅ Actualizado: {$newUrl}\n";
            $updated++;
        } catch (Exception $e) {
            echo "   ❌ Error al actualizar: " . $e->getMessage() . "\n";
            $errors++;
        }
    } else {
        echo "   ⚠️  Formato no reconocido: {$originalValue}\n";
        $errors++;
    }
    
    echo "\n";
}

echo "📈 Resumen:\n";
echo "   ✅ Actualizados: {$updated}\n";
echo "   ❌ Errores: {$errors}\n";

if ($updated > 0) {
    echo "\n💡 URLs actualizadas correctamente.\n";
    echo "   Ahora las imágenes deberían mostrarse en el frontend.\n";
}

echo "\n🎉 Proceso completado\n"; 