<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Crear una instancia de la aplicación
$app = Application::configure(basePath: __DIR__)
    ->withRouting(
        web: __DIR__.'/routes/web.php',
        api: __DIR__.'/routes/api.php',
        commands: __DIR__.'/routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

echo "=== Diagnóstico de Railway ===\n";

// Verificar variables de entorno críticas
$criticalVars = [
    'APP_KEY',
    'APP_ENV',
    'APP_DEBUG',
    'DB_CONNECTION',
    'DB_HOST',
    'DB_DATABASE',
    'DB_USERNAME',
    'DB_PASSWORD'
];

echo "Variables de entorno:\n";
foreach ($criticalVars as $var) {
    $value = env($var);
    $status = $value ? '✅ Configurada' : '❌ NO CONFIGURADA';
    echo "  $var: $status\n";
}

// Verificar archivos de claves
echo "\nArchivos de claves:\n";
$keyFiles = [
    'storage/oauth-private.key',
    'storage/oauth-public.key'
];

foreach ($keyFiles as $file) {
    $exists = file_exists($file);
    $status = $exists ? '✅ Existe' : '❌ NO EXISTE';
    echo "  $file: $status\n";
}

// Verificar directorios de almacenamiento
echo "\nDirectorios de almacenamiento:\n";
$storageDirs = [
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache'
];

foreach ($storageDirs as $dir) {
    $exists = is_dir($dir);
    $writable = is_writable($dir);
    $status = $exists ? ($writable ? '✅ Existe y escribible' : '⚠️ Existe pero no escribible') : '❌ NO EXISTE';
    echo "  $dir: $status\n";
}

echo "\n=== Fin del diagnóstico ===\n"; 