<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use LaravelJsonApi\Laravel\Routing\ResourceRegistrar;
use App\Http\Controllers\Api\V2\Auth\LoginController;
use App\Http\Controllers\Api\V2\Auth\LogoutController;
use App\Http\Controllers\Api\V2\Auth\RegisterController;
use App\Http\Controllers\Api\V2\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\V2\Auth\ResetPasswordController;
use App\Http\Controllers\Api\V2\MeController;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use App\Http\Controllers\SucursalController;
use App\Http\Controllers\UserPreferencesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v2')->middleware('json.api')->group(function () {
    Route::post('/login', LoginController::class)->name('login');
    Route::post('/logout', LogoutController::class)->middleware('auth:api');
    Route::post('/register', RegisterController::class);
    Route::post('/password-forgot', ForgotPasswordController::class);
    Route::post('/password-reset', ResetPasswordController::class)->name('password.reset');
});

JsonApiRoute::server('v2')->prefix('v2')->resources(function (ResourceRegistrar $server) {
    $server->resource('users', JsonApiController::class);
    Route::get('me', [MeController::class, 'readProfile']);
    Route::patch('me', [MeController::class, 'updateProfile']);
});

// Rutas de autenticación PersonalPOS
Route::post('/pos/login', App\Http\Controllers\Api\V2\Auth\PersonalPOSLoginController::class);
Route::post('/pos/reset-password', App\Http\Controllers\Api\V2\Auth\PersonalPOSResetPasswordController::class);
Route::post('/pos/create-admin', App\Http\Controllers\Api\V2\Auth\PersonalPOSCreateAdminController::class);

// Rutas para sucursales con soporte CORS
Route::options('/sucursales', function() {
    return response()->json([], 200);
});
Route::get('/sucursales', [SucursalController::class, 'index']);

// Rutas para preferencias de usuario (sin middleware, validación manual en controlador)
Route::options('/user/preferences', function() {
    return response()->json([], 200);
});
Route::get('/user/preferences', [UserPreferencesController::class, 'getUserPreferences']);
Route::post('/user/preferences', [UserPreferencesController::class, 'saveUserPreferences']);
Route::put('/user/preferences', [UserPreferencesController::class, 'saveUserPreferences']);

// Endpoint de debug para verificar tokens
Route::get('/debug/tokens', function() {
    $tokens = DB::table('PersonalPOS')
        ->whereNotNull('remember_token')
        ->select('Pos_ID', 'Nombre_Apellidos', 'remember_token', 'updated_at')
        ->get();
    
    return response()->json([
        'message' => 'Tokens en la BD',
        'count' => $tokens->count(),
        'tokens' => $tokens->map(function($token) {
            return [
                'Pos_ID' => $token->Pos_ID,
                'Nombre_Apellidos' => $token->Nombre_Apellidos,
                'token_preview' => substr($token->remember_token, 0, 30) . '...',
                'token_length' => strlen($token->remember_token),
                'updated_at' => $token->updated_at
            ];
        })
    ]);
});

// Endpoint específico para debuggear el usuario ID 3
Route::get('/debug/user/3', function() {
    $user = DB::table('PersonalPOS')->where('Pos_ID', 3)->first();
    
    if ($user) {
        return response()->json([
            'message' => 'Usuario encontrado',
            'user' => [
                'Pos_ID' => $user->Pos_ID,
                'Nombre_Apellidos' => $user->Nombre_Apellidos,
                'Correo_Electronico' => $user->Correo_Electronico,
                'remember_token' => $user->remember_token,
                'token_length' => strlen($user->remember_token ?? ''),
                'token_preview' => $user->remember_token ? substr($user->remember_token, 0, 30) . '...' : 'NULL',
                'updated_at' => $user->updated_at
            ]
        ]);
    } else {
        return response()->json(['message' => 'Usuario no encontrado']);
    }
});

// Endpoint para buscar token específico
Route::post('/debug/find-token', function(Request $request) {
    $token = $request->input('token');
    
    $user = DB::table('PersonalPOS')
        ->where('remember_token', $token)
        ->first();
    
    if ($user) {
        return response()->json([
            'message' => 'Token encontrado',
            'user' => [
                'Pos_ID' => $user->Pos_ID,
                'Nombre_Apellidos' => $user->Nombre_Apellidos,
                'token_matches' => true
            ]
        ]);
    } else {
        return response()->json([
            'message' => 'Token NO encontrado',
            'searched_token' => $token,
            'token_length' => strlen($token)
        ]);
    }
});

// Endpoint GET para buscar el token del usuario 3 específicamente
Route::get('/debug/check-user3-token', function() {
    $targetToken = '3|1749268737|e69585627009c42eb4d98b1d094344e42153970122229aef6a2d76e66371dc2d';
    
    $user = DB::table('PersonalPOS')
        ->where('Pos_ID', 3)
        ->first();
    
    $tokenMatch = false;
    if ($user && $user->remember_token) {
        $tokenMatch = ($user->remember_token === $targetToken);
    }
    
    return response()->json([
        'target_token' => $targetToken,
        'target_length' => strlen($targetToken),
        'db_token' => $user->remember_token ?? 'NULL',
        'db_length' => $user->remember_token ? strlen($user->remember_token) : 0,
        'tokens_match' => $tokenMatch,
        'user_found' => $user ? true : false,
        'user_name' => $user->Nombre_Apellidos ?? 'N/A'
    ]);
});

// Endpoint de debug para probar saveUserPreferences
Route::put('/debug/test-save-preferences', [UserPreferencesController::class, 'saveUserPreferences']);

// Endpoint para debug del headers
Route::get('/debug/headers', function(Request $request) {
    return response()->json([
        'all_headers' => $request->headers->all(),
        'auth_header' => $request->header('Authorization'),
        'bearer_token' => $request->bearerToken(),
        'has_auth' => $request->hasHeader('Authorization')
    ]);
});