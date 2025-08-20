<?php

echo "=== Prueba de Acceso a Imágenes ===\n\n";

$images = [
    'http://localhost:8000/storage/profiles/personal_1_1755233499.png',
    'http://localhost:8000/storage/profiles/personal_257_1755232700.jpg',
    'http://localhost:8000/storage/profiles/personal_255_1753591673.png'
];

foreach ($images as $imageUrl) {
    echo "Probando: {$imageUrl}\n";
    
    // Usar file_get_contents para probar el acceso
    $context = stream_context_create([
        'http' => [
            'method' => 'HEAD',
            'timeout' => 5
        ]
    ]);
    
    $headers = get_headers($imageUrl, 1, $context);
    
    if ($headers !== false) {
        $statusCode = $headers[0];
        echo "Status: {$statusCode}\n";
        
        if (strpos($statusCode, '200') !== false) {
            echo "✅ Imagen accesible\n";
        } else {
            echo "❌ Error: {$statusCode}\n";
        }
    } else {
        echo "❌ No se pudo acceder a la imagen\n";
    }
    
    echo "---\n";
}

echo "\n=== Verificación de archivos locales ===\n";
$localFiles = [
    'storage/app/public/profiles/personal_1_1755233499.png',
    'storage/app/public/profiles/personal_257_1755232700.jpg',
    'storage/app/public/profiles/personal_255_1753591673.png'
];

foreach ($localFiles as $file) {
    if (file_exists($file)) {
        $size = filesize($file);
        echo "✅ {$file} - Tamaño: " . number_format($size) . " bytes\n";
    } else {
        echo "❌ {$file} - No existe\n";
    }
} 