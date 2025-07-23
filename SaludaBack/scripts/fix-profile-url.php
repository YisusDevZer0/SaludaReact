<?php

/**
 * Script para corregir la URL de la imagen de perfil
 * 
 * Uso: php scripts/fix-profile-url.php
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Configurar Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔄 Corrigiendo URL de imagen de perfil...\n";

try {
    // Actualizar la URL para el usuario con ID 1
    $result = DB::table('personal_pos')
        ->where('id', 1)
        ->update(['foto_perfil' => 'yisus.png']);
    
    if ($result) {
        echo "✅ URL actualizada correctamente\n";
        echo "   Nueva URL: http://localhost:8000/uploads/profiles/avatars/yisus.png\n";
    } else {
        echo "❌ No se pudo actualizar la URL\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n🎉 Proceso completado\n"; 