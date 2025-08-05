<?php

/**
 * Script para regenerar las claves de Passport
 * Ejecutar con: php artisan tinker --execute="require 'scripts/regenerate-passport-keys.php';"
 */

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

echo "=== Regenerando claves de Passport ===\n";

// Verificar si existen las claves
$privateKeyPath = storage_path('oauth-private.key');
$publicKeyPath = storage_path('oauth-public.key');

echo "Verificando claves existentes...\n";

if (file_exists($privateKeyPath)) {
    echo "✅ Clave privada existe\n";
} else {
    echo "❌ Clave privada no existe\n";
}

if (file_exists($publicKeyPath)) {
    echo "✅ Clave pública existe\n";
} else {
    echo "❌ Clave pública no existe\n";
}

// Regenerar claves
echo "\nRegenerando claves de Passport...\n";

try {
    // Eliminar claves existentes si existen
    if (file_exists($privateKeyPath)) {
        unlink($privateKeyPath);
        echo "🗑️ Clave privada eliminada\n";
    }
    
    if (file_exists($publicKeyPath)) {
        unlink($publicKeyPath);
        echo "🗑️ Clave pública eliminada\n";
    }
    
    // Generar nuevas claves
    Artisan::call('passport:keys');
    echo "✅ Nuevas claves generadas correctamente\n";
    
} catch (Exception $e) {
    echo "❌ Error generando claves: " . $e->getMessage() . "\n";
    
    // Intentar método alternativo
    try {
        echo "Intentando método alternativo...\n";
        Artisan::call('passport:install', ['--force' => true]);
        echo "✅ Claves generadas con método alternativo\n";
    } catch (Exception $e2) {
        echo "❌ Error con método alternativo: " . $e2->getMessage() . "\n";
    }
}

// Verificar permisos de las claves
echo "\nVerificando permisos de las claves...\n";

if (file_exists($privateKeyPath)) {
    $permissions = substr(sprintf('%o', fileperms($privateKeyPath)), -4);
    echo "Permisos de clave privada: {$permissions}\n";
    
    if ($permissions !== '0600') {
        echo "⚠️ Ajustando permisos de clave privada...\n";
        chmod($privateKeyPath, 0600);
        echo "✅ Permisos ajustados\n";
    }
}

if (file_exists($publicKeyPath)) {
    $permissions = substr(sprintf('%o', fileperms($publicKeyPath)), -4);
    echo "Permisos de clave pública: {$permissions}\n";
    
    if ($permissions !== '0644') {
        echo "⚠️ Ajustando permisos de clave pública...\n";
        chmod($publicKeyPath, 0644);
        echo "✅ Permisos ajustados\n";
    }
}

// Limpiar caché
echo "\nLimpiando caché...\n";

try {
    Artisan::call('config:clear');
    echo "✅ Caché de configuración limpiada\n";
    
    Artisan::call('route:clear');
    echo "✅ Caché de rutas limpiada\n";
    
    Artisan::call('cache:clear');
    echo "✅ Caché general limpiada\n";
    
} catch (Exception $e) {
    echo "❌ Error limpiando caché: " . $e->getMessage() . "\n";
}

// Verificar configuración final
echo "\n=== Verificación final ===\n";

if (file_exists($privateKeyPath)) {
    echo "✅ Clave privada regenerada correctamente\n";
} else {
    echo "❌ Clave privada no se pudo regenerar\n";
}

if (file_exists($publicKeyPath)) {
    echo "✅ Clave pública regenerada correctamente\n";
} else {
    echo "❌ Clave pública no se pudo regenerar\n";
}

echo "\n=== Proceso completado ===\n";
echo "Si las claves se regeneraron correctamente, el problema de autenticación debería estar resuelto.\n";
echo "Reinicia el servidor si es necesario.\n"; 