<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\PersonalPos;

try {
    // Buscar un usuario válido
    $user = PersonalPos::where('is_active', true)
        ->where('estado_laboral', 'activo')
        ->first();

    if (!$user) {
        echo "No se encontró ningún usuario activo\n";
        exit(1);
    }

    echo "Usuario encontrado: {$user->nombre} {$user->apellido}\n";
    echo "Email: {$user->email}\n";
    echo "Licencia: " . ($user->Id_Licencia ?? 'No definida') . "\n";

    // Generar token
    $tokenResult = $user->createToken('TestToken');
    $token = $tokenResult->accessToken;

    echo "\nToken generado: " . substr($token, 0, 20) . "...\n";

    // Probar el endpoint con el token
    echo "\nProbando endpoint con autenticación...\n";
    
    $response = file_get_contents('http://localhost:8000/api/personal/active/count', false, stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json',
                'Accept: application/json'
            ]
        ]
    ]));

    echo "Respuesta del endpoint:\n";
    echo $response . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
} 