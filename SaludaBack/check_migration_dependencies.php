<?php

require_once 'vendor/autoload.php';

// Inicializar Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== VERIFICANDO DEPENDENCIAS DE MIGRACIONES ===\n\n";

// Función para extraer referencias de claves foráneas de un archivo
function extractForeignKeys($filePath) {
    if (!file_exists($filePath)) {
        return [];
    }
    
    $content = file_get_contents($filePath);
    $foreignKeys = [];
    
    // Buscar patrones de claves foráneas
    preg_match_all('/->constrained\([\'"]([^\'"]+)[\'"](?:,\s*[\'"]([^\'"]+)[\'"])?\)/', $content, $matches, PREG_SET_ORDER);
    
    foreach ($matches as $match) {
        $table = $match[1];
        $column = isset($match[2]) ? $match[2] : 'id';
        $foreignKeys[] = [
            'table' => $table,
            'column' => $column,
            'line' => substr_count(substr($content, 0, strpos($content, $match[0])), "\n") + 1
        ];
    }
    
    return $foreignKeys;
}

// Obtener todas las migraciones
$migrationsPath = 'database/migrations';
$migrations = glob($migrationsPath . '/*.php');

$dependencies = [];
$potentialIssues = [];

foreach ($migrations as $migration) {
    $filename = basename($migration);
    $foreignKeys = extractForeignKeys($migration);
    
    if (!empty($foreignKeys)) {
        $dependencies[$filename] = $foreignKeys;
        
        // Verificar posibles problemas
        foreach ($foreignKeys as $fk) {
            if ($fk['table'] === 'almacenes' && $fk['column'] === 'id') {
                $potentialIssues[] = [
                    'file' => $filename,
                    'issue' => 'Referencia incorrecta a almacenes (debería ser Almacen_ID)',
                    'line' => $fk['line']
                ];
            }
        }
    }
}

// Mostrar reporte
echo "📊 REPORTE DE DEPENDENCIAS:\n\n";

foreach ($dependencies as $migration => $foreignKeys) {
    echo "📁 $migration:\n";
    foreach ($foreignKeys as $fk) {
        echo "  └─ Referencia: {$fk['table']}.{$fk['column']} (línea {$fk['line']})\n";
    }
    echo "\n";
}

if (!empty($potentialIssues)) {
    echo "⚠️  POSIBLES PROBLEMAS DETECTADOS:\n\n";
    foreach ($potentialIssues as $issue) {
        echo "❌ {$issue['file']} (línea {$issue['line']}): {$issue['issue']}\n";
    }
    echo "\n";
} else {
    echo "✅ No se detectaron problemas de dependencias\n\n";
}

echo "=== VERIFICACIÓN COMPLETADA ===\n"; 