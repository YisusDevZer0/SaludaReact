<?php

/**
 * Script de prueba para verificar CORS
 * Ejecutar desde la línea de comandos: php test_cors.php
 */

echo "=== PRUEBA DE CORS PARA AGENDA ===\n\n";

// URL base de la API
$baseUrl = 'http://localhost:8000/api';

// Endpoints a probar
$endpoints = [
    '/test-agenda/test',
    '/test-agenda/cors',
    '/test-agenda/agendas',
    '/test-agenda/agendas/estadisticas',
    '/test-agenda/agendas/hoy/citas',
    '/test-agenda/citas',
    '/test-agenda/citas/estadisticas',
    '/test-agenda/citas/hoy',
    '/test-citas/test',
    '/test-citas/',
    '/test-citas/estadisticas',
    '/test-citas/hoy'
];

foreach ($endpoints as $endpoint) {
    echo "Probando: {$endpoint}\n";
    
    // Hacer petición GET
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);
    
    curl_close($ch);
    
    echo "HTTP Code: {$httpCode}\n";
    echo "Headers:\n{$headers}\n";
    echo "Body: {$body}\n";
    echo "---\n\n";
}

// Probar petición OPTIONS (preflight)
echo "=== PRUEBA DE PREFLIGHT OPTIONS ===\n\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/test-agenda/agendas');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'OPTIONS');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Origin: http://localhost:3000',
    'Access-Control-Request-Method: GET',
    'Access-Control-Request-Headers: Content-Type, Authorization'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headers = substr($response, 0, $headerSize);

curl_close($ch);

echo "OPTIONS HTTP Code: {$httpCode}\n";
echo "OPTIONS Headers:\n{$headers}\n";
echo "=== FIN DE PRUEBAS ===\n";
