<?php

/**
 * Script para verificar el estado de las conexiones de base de datos
 * Ejecutar con: php check_db_connections.php
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

// Cargar configuración de Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "=== Verificación de Conexiones de Base de Datos ===\n\n";
    
    // Verificar conexión principal
    echo "1. Verificando conexión principal...\n";
    $pdo = DB::connection()->getPdo();
    echo "   ✓ Conexión principal: OK\n";
    echo "   - Driver: " . $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) . "\n";
    echo "   - Server: " . $pdo->getAttribute(PDO::ATTR_SERVER_INFO) . "\n";
    
    // Verificar conexión secundaria si existe
    if (Config::has('database.connections.mysql_second')) {
        echo "\n2. Verificando conexión secundaria...\n";
        try {
            $pdo2 = DB::connection('mysql_second')->getPdo();
            echo "   ✓ Conexión secundaria: OK\n";
        } catch (Exception $e) {
            echo "   ✗ Conexión secundaria: ERROR - " . $e->getMessage() . "\n";
        }
    }
    
    // Obtener información de procesos MySQL
    echo "\n3. Información de procesos MySQL:\n";
    $processes = DB::select("SHOW PROCESSLIST");
    echo "   - Total de procesos: " . count($processes) . "\n";
    
    $sleeping = array_filter($processes, function($p) {
        return $p->Command === 'Sleep';
    });
    echo "   - Procesos inactivos (Sleep): " . count($sleeping) . "\n";
    
    $active = array_filter($processes, function($p) {
        return $p->Command !== 'Sleep';
    });
    echo "   - Procesos activos: " . count($active) . "\n";
    
    // Mostrar variables de configuración relevantes
    echo "\n4. Variables de configuración MySQL:\n";
    $variables = DB::select("SHOW VARIABLES LIKE '%max_connections%'");
    foreach ($variables as $var) {
        echo "   - {$var->Variable_name}: {$var->Value}\n";
    }
    
    $variables = DB::select("SHOW VARIABLES LIKE '%wait_timeout%'");
    foreach ($variables as $var) {
        echo "   - {$var->Variable_name}: {$var->Value}\n";
    }
    
    echo "\n=== Verificación completada ===\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}
