<?php

/**
 * Script para verificar y corregir la configuración de Passport
 * Ejecutar con: php artisan tinker --execute="require 'scripts/fix-passport-config.php';"
 */

use Laravel\Passport\Passport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

echo "=== Verificando configuración de Passport ===\n";

// Verificar si las tablas de Passport existen
$tables = ['oauth_clients', 'oauth_personal_access_clients', 'oauth_access_tokens', 'oauth_refresh_tokens'];
$missingTables = [];

foreach ($tables as $table) {
    if (!DB::getSchemaBuilder()->hasTable($table)) {
        $missingTables[] = $table;
    }
}

if (!empty($missingTables)) {
    echo "❌ Tablas faltantes de Passport: " . implode(', ', $missingTables) . "\n";
    echo "Ejecutando migraciones de Passport...\n";
    
    try {
        Artisan::call('passport:install');
        echo "✅ Migraciones de Passport ejecutadas correctamente\n";
    } catch (Exception $e) {
        echo "❌ Error ejecutando migraciones: " . $e->getMessage() . "\n";
    }
} else {
    echo "✅ Todas las tablas de Passport existen\n";
}

// Verificar si existe el cliente password
$passwordClient = DB::table('oauth_clients')->where('password_client', 1)->first();

if (!$passwordClient) {
    echo "❌ No se encontró el cliente password de Passport\n";
    echo "Creando cliente password...\n";
    
    try {
        Artisan::call('passport:client', [
            '--password' => true,
            '--name' => 'Password Grant Client'
        ]);
        echo "✅ Cliente password creado correctamente\n";
    } catch (Exception $e) {
        echo "❌ Error creando cliente password: " . $e->getMessage() . "\n";
    }
} else {
    echo "✅ Cliente password existe (ID: {$passwordClient->id})\n";
}

// Verificar si existe el cliente personal access
$personalClient = DB::table('oauth_personal_access_clients')->first();

if (!$personalClient) {
    echo "❌ No se encontró el cliente personal access de Passport\n";
    echo "Creando cliente personal access...\n";
    
    try {
        Artisan::call('passport:client', [
            '--personal' => true,
            '--name' => 'Personal Access Client'
        ]);
        echo "✅ Cliente personal access creado correctamente\n";
    } catch (Exception $e) {
        echo "❌ Error creando cliente personal access: " . $e->getMessage() . "\n";
    }
} else {
    echo "✅ Cliente personal access existe\n";
}

// Verificar configuración de Passport
echo "\n=== Verificando configuración de Passport ===\n";

try {
    // Verificar si Passport está habilitado
    $passwordGrantEnabled = config('passport.enable_password_grant', false);
    echo $passwordGrantEnabled ? "✅ Password grant habilitado\n" : "❌ Password grant deshabilitado\n";
    
    $clientCredentialsEnabled = config('passport.enable_client_credentials_grant', false);
    echo $clientCredentialsEnabled ? "✅ Client credentials grant habilitado\n" : "❌ Client credentials grant deshabilitado\n";
    
    $personalAccessEnabled = config('passport.enable_personal_access_client', false);
    echo $personalAccessEnabled ? "✅ Personal access client habilitado\n" : "❌ Personal access client deshabilitado\n";
    
} catch (Exception $e) {
    echo "❌ Error verificando configuración: " . $e->getMessage() . "\n";
}

// Verificar configuración de autenticación
echo "\n=== Verificando configuración de autenticación ===\n";

$defaultGuard = config('auth.defaults.guard');
echo "Guard por defecto: {$defaultGuard}\n";

$apiGuard = config('auth.guards.api');
if ($apiGuard) {
    echo "✅ Guard 'api' configurado correctamente\n";
    echo "Driver: {$apiGuard['driver']}\n";
    echo "Provider: {$apiGuard['provider']}\n";
} else {
    echo "❌ Guard 'api' no configurado\n";
}

$personalposProvider = config('auth.providers.personalpos');
if ($personalposProvider) {
    echo "✅ Provider 'personalpos' configurado correctamente\n";
    echo "Driver: {$personalposProvider['driver']}\n";
    echo "Model: {$personalposProvider['model']}\n";
} else {
    echo "❌ Provider 'personalpos' no configurado\n";
}

echo "\n=== Verificación completada ===\n"; 