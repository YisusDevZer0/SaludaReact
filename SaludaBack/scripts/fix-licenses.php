<?php

/**
 * Script para verificar y corregir licencias en la base de datos
 * 
 * Uso: php scripts/fix-licenses.php
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Configurar Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔍 Verificando y corrigiendo licencias...\n";

try {
    // Verificar personal sin licencia
    $personalSinLicencia = DB::table('personal_pos')
        ->whereNull('Id_Licencia')
        ->orWhere('Id_Licencia', '')
        ->get();
    
    echo "📊 Personal sin licencia: " . $personalSinLicencia->count() . "\n";
    
    if ($personalSinLicencia->count() > 0) {
        echo "🔧 Asignando licencias por defecto...\n";
        
        // Obtener la primera licencia disponible
        $licenciaDefault = DB::table('Hospital_Organizacion_Dueño')
            ->where('estado', 'activo')
            ->value('Id_Licencia');
        
        if (!$licenciaDefault) {
            // Crear una licencia por defecto si no existe
            $licenciaDefault = 'SALUDA_DEFAULT';
            DB::table('Hospital_Organizacion_Dueño')->insert([
                'Id_Licencia' => $licenciaDefault,
                'nombre' => 'Saluda Default',
                'codigo' => 'SALUDA',
                'estado' => 'activo',
                'created_at' => now(),
                'updated_at' => now()
            ]);
            echo "✅ Licencia por defecto creada: {$licenciaDefault}\n";
        }
        
        // Asignar licencia a personal sin licencia
        DB::table('personal_pos')
            ->whereNull('Id_Licencia')
            ->orWhere('Id_Licencia', '')
            ->update([
                'Id_Licencia' => $licenciaDefault,
                'updated_at' => now()
            ]);
        
        echo "✅ Licencias asignadas correctamente\n";
    }
    
    // Verificar distribución de licencias
    echo "\n📈 Distribución de licencias:\n";
    $distribucion = DB::table('personal_pos')
        ->select('Id_Licencia', DB::raw('count(*) as total'))
        ->groupBy('Id_Licencia')
        ->get();
    
    foreach ($distribucion as $item) {
        echo "   Licencia {$item->Id_Licencia}: {$item->total} empleados\n";
    }
    
    // Verificar que todas las tablas tengan la columna Id_Licencia
    $tables = [
        'personal_pos',
        'sucursales',
        'roles_puestos',
        'categorias_pos',
        'componentes_activos'
    ];
    
    echo "\n🔍 Verificando columnas Id_Licencia:\n";
    foreach ($tables as $table) {
        $hasColumn = DB::select("SHOW COLUMNS FROM {$table} LIKE 'Id_Licencia'");
        if (empty($hasColumn)) {
            echo "   ❌ Tabla {$table}: Falta columna Id_Licencia\n";
        } else {
            echo "   ✅ Tabla {$table}: Columna Id_Licencia presente\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n🎉 Verificación completada\n"; 