<?php

/**
 * Script para ejecutar el seeder de Dermatología
 * Uso: php run_dermatologia_seeder.php
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Seeder;
use Database\Seeders\DermatologiaSeeder;

// Configurar la aplicación Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🏥 Iniciando seeder de Dermatología...\n";
echo "=====================================\n\n";

try {
    // Ejecutar el seeder
    $seeder = new DermatologiaSeeder();
    $seeder->run();
    
    echo "\n✅ Seeder de Dermatología ejecutado exitosamente\n";
    echo "🎉 La especialidad de Dermatología y sus tipos de consulta han sido creados\n";
    
} catch (Exception $e) {
    echo "\n❌ Error al ejecutar el seeder: " . $e->getMessage() . "\n";
    echo "📋 Stack trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}

echo "\n📋 Para verificar los datos creados, puedes consultar:\n";
echo "   - Especialidades: SELECT * FROM especialidades WHERE Nombre_Especialidad = 'Dermatología';\n";
echo "   - Tipos de consulta: SELECT * FROM tipos_consulta WHERE Especialidad = (SELECT Especialidad_ID FROM especialidades WHERE Nombre_Especialidad = 'Dermatología');\n";
echo "\n🏁 Script completado\n";
