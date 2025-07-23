<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuditoriaController;

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

// Ruta para servir imágenes de perfil desde el frontend
Route::get('uploads/profiles/avatars/{filename}', function ($filename) {
    $path = base_path('../SaludaFront/public/uploads/profiles/avatars/' . $filename);
    
    if (file_exists($path)) {
        $file = file_get_contents($path);
        $type = mime_content_type($path);
        
        return response($file, 200)
            ->header('Content-Type', $type)
            ->header('Cache-Control', 'public, max-age=31536000');
    }
    
    return response('Imagen no encontrada', 404);
})->where('filename', '.*');

Route::middleware(['auth'])->group(function () {
    Route::get('/auditorias', [AuditoriaController::class, 'index'])->name('auditorias.index');
});

// Ruta pública para count de personal activo (sin autenticación)
Route::get('/api/personal/active/count', [App\Http\Controllers\PersonalPOSController::class, 'countActive']);
