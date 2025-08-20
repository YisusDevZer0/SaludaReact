<?php

// Simular la función url() de Laravel
function url($path = '') {
    $baseUrl = 'http://localhost:8000';
    return $baseUrl . '/' . ltrim($path, '/');
}

echo "=== Prueba de URLs de Imágenes (Simple) ===\n\n";

// Lista de archivos que sabemos que existen
$files = [
    'personal_1_1755233499.png',
    'personal_257_1755232700.jpg',
    'personal_255_1753591673.png'
];

foreach ($files as $file) {
    echo "Archivo: {$file}\n";
    echo "URL generada: " . url('storage/profiles/' . $file) . "\n";
    
    // Verificar si el archivo existe físicamente
    $storagePath = __DIR__ . '/storage/app/public/profiles/' . $file;
    $publicPath = __DIR__ . '/public/storage/profiles/' . $file;
    
    echo "Existe en storage: " . (file_exists($storagePath) ? 'Sí' : 'No') . "\n";
    echo "Existe en public: " . (file_exists($publicPath) ? 'Sí' : 'No') . "\n";
    echo "---\n";
}

echo "\n=== URLs para probar en el navegador ===\n";
foreach ($files as $file) {
    echo url('storage/profiles/' . $file) . "\n";
}
