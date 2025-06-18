// Rutas para el manejo de asistencia usando Eloquent (base de datos secundaria)
Route::prefix('asistencia-eloquent')->group(function () {
    Route::get('/hoy', [App\Http\Controllers\AsistenciaEloquentController::class, 'getAsistenciaHoy']);
    Route::get('/por-fecha', [App\Http\Controllers\AsistenciaEloquentController::class, 'getAsistenciaPorFecha']);
    Route::get('/por-rango', [App\Http\Controllers\AsistenciaEloquentController::class, 'getAsistenciaPorRango']);
    Route::get('/por-empleado', [App\Http\Controllers\AsistenciaEloquentController::class, 'getAsistenciaPorEmpleado']);
    Route::get('/resumen-hoy', [App\Http\Controllers\AsistenciaEloquentController::class, 'getResumenAsistenciaHoy']);
    Route::get('/resumen-por-rango', [App\Http\Controllers\AsistenciaEloquentController::class, 'getResumenAsistenciaPorRango']);
    Route::get('/sin-asistencia-hoy', [App\Http\Controllers\AsistenciaEloquentController::class, 'getEmpleadosSinAsistenciaHoy']);
}); 

// Ruta de debug temporal
Route::get('/debug-db-config', function () {
    $config = config('database.connections.mysql_second');
    // Ocultar contraseña para seguridad
    $configSafe = $config;
    $configSafe['password'] = str_repeat('*', strlen($config['password']));
    
    return response()->json([
        'mysql_second_config' => $configSafe,
        'env_values' => [
            'DB_SECOND_HOST' => env('DB_SECOND_HOST'),
            'DB_SECOND_PORT' => env('DB_SECOND_PORT'),
            'DB_SECOND_DATABASE' => env('DB_SECOND_DATABASE'),
            'DB_SECOND_USERNAME' => env('DB_SECOND_USERNAME'),
            'DB_SECOND_PASSWORD' => env('DB_SECOND_PASSWORD') ? 'SET' : 'NOT SET'
        ]
    ]);
}); 