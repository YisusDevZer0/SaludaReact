<?php

/**
 * Script para verificar los datos del perfil
 * 
 * Uso: php scripts/check-profile-data.php
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Configurar Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔍 Verificando datos del perfil...\n";

try {
    // Obtener datos del usuario con ID 1
    $user = DB::table('personal_pos')
        ->where('id', 1)
        ->first();
    
    if ($user) {
        echo "✅ Usuario encontrado:\n";
        echo "   ID: {$user->id}\n";
        echo "   Nombre: {$user->nombre} {$user->apellido}\n";
        echo "   Email: {$user->email}\n";
        echo "   Foto perfil: " . ($user->foto_perfil ?? 'NULL') . "\n";
        echo "   Id_Licencia: " . ($user->Id_Licencia ?? 'NULL') . "\n";
    } else {
        echo "❌ Usuario no encontrado\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n🎉 Verificación completada\n"; 