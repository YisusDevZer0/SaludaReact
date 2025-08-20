<?php

require_once 'vendor/autoload.php';

// Cargar la aplicación Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\PersonalPos;

echo "=== Prueba de URLs de Imágenes ===\n\n";

// Obtener algunos usuarios con fotos
$users = PersonalPos::whereNotNull('foto_perfil')
    ->where('foto_perfil', '!=', '')
    ->limit(5)
    ->get();

foreach ($users as $user) {
    echo "Usuario: {$user->nombre_completo}\n";
    echo "Foto en BD: {$user->getRawOriginal('foto_perfil')}\n";
    echo "URL generada: {$user->foto_perfil}\n";
    echo "URL completa: " . url('storage/profiles/' . $user->getRawOriginal('foto_perfil')) . "\n";
    echo "APP_URL: " . config('app.url') . "\n";
    echo "---\n";
}

// Verificar si los archivos existen físicamente
echo "\n=== Verificación de archivos físicos ===\n";
$storagePath = storage_path('app/public/profiles/');
echo "Ruta de storage: {$storagePath}\n";

if (is_dir($storagePath)) {
    $files = scandir($storagePath);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            $fullPath = $storagePath . $file;
            echo "Archivo: {$file} - Existe: " . (file_exists($fullPath) ? 'Sí' : 'No') . "\n";
        }
    }
} else {
    echo "El directorio de storage no existe\n";
}

// Verificar enlace simbólico
echo "\n=== Verificación de enlace simbólico ===\n";
$publicStoragePath = public_path('storage/profiles/');
echo "Ruta pública: {$publicStoragePath}\n";

if (is_dir($publicStoragePath)) {
    $files = scandir($publicStoragePath);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            $fullPath = $publicStoragePath . $file;
            echo "Archivo público: {$file} - Existe: " . (file_exists($fullPath) ? 'Sí' : 'No') . "\n";
        }
    }
} else {
    echo "El directorio público de storage no existe\n";
}
