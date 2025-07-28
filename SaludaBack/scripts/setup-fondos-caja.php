<?php

/**
 * Script para configurar los fondos de caja
 * 
 * Este script ejecuta la migración y el seeder para los fondos de caja
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// Configurar la aplicación Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🚀 Configurando Fondos de Caja...\n\n";

try {
    // Verificar si la tabla ya existe
    if (!Schema::hasTable('fondos_caja')) {
        echo "📋 Creando tabla fondos_caja...\n";
        
        // Ejecutar la migración
        Artisan::call('migrate', [
            '--path' => 'database/migrations/2025_01_20_000001_create_fondos_caja_table.php',
            '--force' => true
        ]);
        
        echo "✅ Tabla fondos_caja creada exitosamente\n";
    } else {
        echo "ℹ️  La tabla fondos_caja ya existe\n";
    }

    // Verificar si ya hay datos
    $count = DB::table('fondos_caja')->count();
    
    if ($count === 0) {
        echo "🌱 Ejecutando seeder de fondos de caja...\n";
        
        // Ejecutar el seeder
        Artisan::call('db:seed', [
            '--class' => 'FondosCajaSeeder',
            '--force' => true
        ]);
        
        echo "✅ Datos de fondos de caja creados exitosamente\n";
    } else {
        echo "ℹ️  Ya existen {$count} fondos de caja en la base de datos\n";
    }

    // Mostrar estadísticas
    echo "\n📊 Estadísticas de Fondos de Caja:\n";
    echo "----------------------------------------\n";
    
    $totalFondos = DB::table('fondos_caja')->count();
    $fondosActivos = DB::table('fondos_caja')->where('estatus', 'activo')->count();
    $totalSaldo = DB::table('fondos_caja')->sum('saldo_actual');
    
    echo "Total de fondos: {$totalFondos}\n";
    echo "Fondos activos: {$fondosActivos}\n";
    echo "Saldo total: $" . number_format($totalSaldo, 2) . "\n";
    
    // Mostrar fondos creados
    echo "\n📋 Fondos creados:\n";
    echo "----------------------------------------\n";
    
    $fondos = DB::table('fondos_caja')
        ->select('codigo', 'nombre', 'saldo_actual', 'estatus')
        ->get();
    
    foreach ($fondos as $fondo) {
        $estado = $fondo->estatus === 'activo' ? '✅' : '❌';
        echo "{$estado} {$fondo->codigo} - {$fondo->nombre} - $" . number_format($fondo->saldo_actual, 2) . "\n";
    }

    echo "\n🎉 Configuración de fondos de caja completada exitosamente!\n";
    echo "\n📝 Próximos pasos:\n";
    echo "1. Verificar que las rutas estén configuradas en routes/api.php\n";
    echo "2. Probar los endpoints desde el frontend\n";
    echo "3. Configurar permisos si es necesario\n";
    echo "4. Revisar la integración con el sistema de cajas existente\n";

} catch (Exception $e) {
    echo "❌ Error durante la configuración: " . $e->getMessage() . "\n";
    echo "📋 Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
} 