<?php

/**
 * Script para limpiar los nombres de archivo de foto_perfil
 */

require_once __DIR__ . '/vendor/autoload.php';

// Configurar Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔧 Limpiando nombres de archivo de foto_perfil...\n\n";

try {
    // Buscar usuarios con foto_perfil que contengan URLs completas
    $users = \App\Models\PersonalPos::whereNotNull('foto_perfil')
        ->where('foto_perfil', '!=', '')
        ->get();
    
    $updated = 0;
    $errors = 0;
    
    foreach ($users as $user) {
        $originalValue = $user->getRawOriginal('foto_perfil');
        echo "👤 Usuario: {$user->nombre} {$user->apellido} (ID: {$user->id})\n";
        echo "   Original: {$originalValue}\n";
        
        // Si es una URL completa, extraer solo el nombre del archivo
        if (filter_var($originalValue, FILTER_VALIDATE_URL)) {
            $path = parse_url($originalValue, PHP_URL_PATH);
            $filename = basename($path);
            
            try {
                $user->update(['foto_perfil' => $filename]);
                echo "   ✅ Actualizado: {$filename}\n";
                $updated++;
            } catch (Exception $e) {
                echo "   ❌ Error al actualizar: " . $e->getMessage() . "\n";
                $errors++;
            }
        } else {
            echo "   ✅ Ya es un nombre de archivo válido\n";
        }
        
        echo "\n";
    }
    
    echo "📈 Resumen:\n";
    echo "   ✅ Actualizados: {$updated}\n";
    echo "   ❌ Errores: {$errors}\n";
    
    if ($updated > 0) {
        echo "\n💡 Nombres de archivo limpiados correctamente.\n";
        echo "   Ahora las imágenes deberían mostrarse correctamente.\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n🎉 Proceso completado\n"; 