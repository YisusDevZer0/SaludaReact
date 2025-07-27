<?php

/**
 * Script para probar el acceso a las imágenes
 */

require_once __DIR__ . '/vendor/autoload.php';

// Configurar Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔍 Probando acceso a imágenes...\n\n";

try {
    // Buscar un usuario con foto de perfil
    $user = \App\Models\PersonalPos::whereNotNull('foto_perfil')
        ->where('foto_perfil', '!=', '')
        ->first();
    
    if ($user) {
        echo "✅ Usuario encontrado: {$user->nombre} {$user->apellido}\n";
        echo "📁 Foto perfil en BD: {$user->foto_perfil}\n";
        
        // Probar el accessor
        $photoUrl = $user->foto_perfil;
        echo "🌐 URL generada: {$photoUrl}\n";
        
        // Verificar si el archivo existe físicamente
        $path = str_replace(url('storage/'), '', $photoUrl);
        $fullPath = storage_path('app/public/' . $path);
        echo "📂 Ruta física: {$fullPath}\n";
        
        if (file_exists($fullPath)) {
            echo "✅ Archivo existe físicamente\n";
            echo "📏 Tamaño: " . filesize($fullPath) . " bytes\n";
        } else {
            echo "❌ Archivo NO existe físicamente\n";
        }
        
        // Probar acceso HTTP
        $httpUrl = url('storage/' . $path);
        echo "🌐 URL HTTP: {$httpUrl}\n";
        
        $headers = get_headers($httpUrl);
        if ($headers && strpos($headers[0], '200') !== false) {
            echo "✅ Archivo accesible via HTTP\n";
        } else {
            echo "❌ Archivo NO accesible via HTTP\n";
        }
        
    } else {
        echo "❌ No se encontró ningún usuario con foto de perfil\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n🎉 Prueba completada\n"; 