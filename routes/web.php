<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Ruta de prueba para la conexión secundaria
Route::get('/test-second-db', function () {
    try {
        $config = config('database.connections.mysql_second');
        
        // Mostrar configuración (sin contraseña)
        $configDisplay = $config;
        $configDisplay['password'] = str_repeat('*', strlen($config['password']));
        
        // Intentar conectar
        $pdo = DB::connection('mysql_second')->getPdo();
        
        // Probar una consulta simple
        $result = DB::connection('mysql_second')->select('SELECT 1 as test');
        
        return response()->json([
            'success' => true,
            'message' => 'Conexión exitosa',
            'config' => $configDisplay,
            'test_query' => $result
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
            'config' => config('database.connections.mysql_second')
        ]);
    }
}); 