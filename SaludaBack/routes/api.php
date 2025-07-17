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
use App\Http\Controllers\RolesPuestosController;
use App\Http\Controllers\PermisosController;
use App\Http\Controllers\HuellasController;
use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\CategoriaPosController;
use App\Http\Controllers\PresentacionController;
use App\Http\Controllers\PersonalPOSController;
use App\Http\Controllers\ComponenteActivoController;
use App\Http\Controllers\TipoController;
use App\Http\Controllers\AuditoriaController;
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

// Ruta adicional para /api/me (compatibilidad con frontend)
Route::get('/me', [MeController::class, 'readProfile'])->middleware(['json.api', 'personalpos.auth']);

// Rutas de autenticación PersonalPOS
Route::post('/pos/login', App\Http\Controllers\Api\V2\Auth\PersonalPOSLoginController::class);
Route::post('/pos/reset-password', App\Http\Controllers\Api\V2\Auth\PersonalPOSResetPasswordController::class);
Route::post('/pos/create-admin', App\Http\Controllers\Api\V2\Auth\PersonalPOSCreateAdminController::class);

// Ruta de logout para PersonalPOS (compatibilidad con frontend)
Route::post('/logout', function(Request $request) {
    try {
        $user = $request->user('api');
        if ($user) {
            // Revocar el token actual
            $user->token()->revoke();
            
            return response()->json([
                'message' => 'Sesión cerrada exitosamente'
            ], 200);
        }
        
        return response()->json([
            'message' => 'No hay sesión activa'
        ], 401);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al cerrar sesión: ' . $e->getMessage()
        ], 500);
    }
})->middleware('auth:api');

// Endpoint de prueba para verificar autenticación
Route::get('/test-auth', function(Request $request) {
    try {
        $user = $request->user('api');
        if ($user) {
            return response()->json([
                'message' => 'Usuario autenticado correctamente',
                'user_id' => $user->Pos_ID,
                'user_name' => $user->Nombre_Apellidos,
                'token_info' => [
                    'id' => $user->token()->id,
                    'user_id' => $user->token()->user_id,
                    'revoked' => $user->token()->revoked,
                    'expires_at' => $user->token()->expires_at
                ]
            ], 200);
        }
        
        return response()->json([
            'message' => 'No hay usuario autenticado',
            'headers' => $request->headers->all()
        ], 401);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error en autenticación: ' . $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
})->middleware('auth:api');

// Rutas para sucursales con soporte CORS
Route::options('/sucursales', function() {
    return response()->json([], 200);
});
Route::get('/sucursales', [SucursalController::class, 'index']);
Route::get('/sucursales/activas', [SucursalController::class, 'getAllActive']);

// Rutas para preferencias de usuario (protegidas con Passport)
Route::middleware(['auth:api'])->group(function () {
Route::options('/user/preferences', function() {
    return response()->json([], 200);
});
Route::get('/user/preferences', [UserPreferencesController::class, 'getUserPreferences']);
Route::post('/user/preferences', [UserPreferencesController::class, 'saveUserPreferences']);
Route::put('/user/preferences', [UserPreferencesController::class, 'saveUserPreferences']);
});

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

Route::get('/roles-puestos', [RolesPuestosController::class, 'index']);
Route::post('/roles-puestos', [RolesPuestosController::class, 'store']);
Route::post('/permisos/masivo', [PermisosController::class, 'storeMasivo']); 
Route::get('/permisos', [PermisosController::class, 'index']); 

// Rutas para probar las conexiones de base de datos duales
Route::prefix('dual-db')->group(function () {
    Route::get('/test', [App\Http\Controllers\DualDatabaseController::class, 'index']);
    Route::post('/transaction', [App\Http\Controllers\DualDatabaseController::class, 'transactionExample']);
    Route::get('/combined', [App\Http\Controllers\DualDatabaseController::class, 'combinedData']);
});

// Rutas para el manejo de huellas (base de datos secundaria)
Route::prefix('huellas')->group(function () {
    Route::get('/', [HuellasController::class, 'index']);
    Route::get('/test-connection', [HuellasController::class, 'testConnection']);
    Route::get('/{id}', [HuellasController::class, 'show']);
    Route::post('/', [HuellasController::class, 'store']);
    Route::put('/{id}', [HuellasController::class, 'update']);
    Route::delete('/{id}', [HuellasController::class, 'destroy']);
    Route::get('/usuario/{userId}', [HuellasController::class, 'getByUser']);
});

// Rutas para el manejo de asistencia (base de datos secundaria)
Route::prefix('asistencia')->group(function () {
    Route::get('/hoy', [AsistenciaController::class, 'getAsistenciaHoy']);
    Route::get('/por-fecha', [AsistenciaController::class, 'getAsistenciaPorFecha']);
    Route::get('/por-rango', [AsistenciaController::class, 'getAsistenciaPorRango']);
    Route::get('/por-empleado', [AsistenciaController::class, 'getAsistenciaPorEmpleado']);
    Route::get('/resumen-hoy', [AsistenciaController::class, 'getResumenAsistenciaHoy']);
    Route::get('/sin-asistencia-hoy', [AsistenciaController::class, 'getEmpleadosSinAsistenciaHoy']);
    Route::get('/test-connection', [AsistenciaController::class, 'testConnection']);
});

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

Route::middleware(['auth:api'])->group(function () {
    // Categorías POS
Route::prefix('categorias')->group(function () {
    Route::get('/', [CategoriaPosController::class, 'index']);
    Route::get('/create', [CategoriaPosController::class, 'create']);
    Route::post('/', [CategoriaPosController::class, 'store']);
    Route::get('/{id}', [CategoriaPosController::class, 'show']);
    Route::get('/{id}/edit', [CategoriaPosController::class, 'edit']);
    Route::put('/{id}', [CategoriaPosController::class, 'update']);
    Route::delete('/{id}', [CategoriaPosController::class, 'destroy']);
    Route::get('/estado/{estado}', [CategoriaPosController::class, 'getByEstado']);
    Route::get('/organizacion/{organizacion}', [CategoriaPosController::class, 'getByOrganizacion']);
});

    // Presentaciones
Route::prefix('presentaciones')->group(function () {
    Route::get('/', [PresentacionController::class, 'index']);
    Route::get('/create', [PresentacionController::class, 'create']);
    Route::post('/', [PresentacionController::class, 'store']);
    Route::get('/{id}', [PresentacionController::class, 'show']);
    Route::get('/{id}/edit', [PresentacionController::class, 'edit']);
    Route::put('/{id}', [PresentacionController::class, 'update']);
    Route::delete('/{id}', [PresentacionController::class, 'destroy']);
    Route::get('/estado/{estado}', [PresentacionController::class, 'getByEstado']);
    Route::get('/organizacion/{organizacion}', [PresentacionController::class, 'getByOrganizacion']);
    Route::get('/siglas/{siglas}', [PresentacionController::class, 'getBySiglas']);
});

    // Personal
Route::get('/personal/listado', [PersonalPOSController::class, 'indexDataTable']);
Route::get('personal/{id}', [PersonalPOSController::class, 'show']);
Route::post('personal', [PersonalPOSController::class, 'store']);
Route::put('personal/{id}', [PersonalPOSController::class, 'update']);
Route::delete('personal/{id}', [PersonalPOSController::class, 'destroy']);
Route::get('personal/active/count', [PersonalPOSController::class, 'countActive']);
Route::get('personal', [PersonalPOSController::class, 'index']); 

    // Agendas
Route::prefix('agendas')->group(function () {
    Route::get('/estadisticas', [App\Http\Controllers\AgendaController::class, 'estadisticas']);
    Route::get('/hoy/citas', [App\Http\Controllers\AgendaController::class, 'citasHoy']);
    Route::post('/verificar-disponibilidad', [App\Http\Controllers\AgendaController::class, 'verificarDisponibilidad']);
    Route::get('/', [App\Http\Controllers\AgendaController::class, 'index']);
    Route::post('/', [App\Http\Controllers\AgendaController::class, 'store']);
    Route::put('/{id}', [App\Http\Controllers\AgendaController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\AgendaController::class, 'destroy']);
    Route::get('/{id}', [App\Http\Controllers\AgendaController::class, 'show']);
});

    // Pacientes
Route::prefix('pacientes')->group(function () {
    Route::get('/', [App\Http\Controllers\PacienteController::class, 'index']);
    Route::get('/{id}', [App\Http\Controllers\PacienteController::class, 'show']);
    Route::post('/', [App\Http\Controllers\PacienteController::class, 'store']);
    Route::put('/{id}', [App\Http\Controllers\PacienteController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\PacienteController::class, 'destroy']);
});

    // Doctores
Route::prefix('doctores')->group(function () {
    Route::get('/', [App\Http\Controllers\DoctorController::class, 'index']);
    Route::get('/{id}', [App\Http\Controllers\DoctorController::class, 'show']);
    Route::post('/', [App\Http\Controllers\DoctorController::class, 'store']);
    Route::put('/{id}', [App\Http\Controllers\DoctorController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\DoctorController::class, 'destroy']);
    Route::get('/activos', [App\Http\Controllers\DoctorController::class, 'getActivos']);
});

    // Componentes
Route::prefix('componentes')->group(function () {
    Route::get('/', [ComponenteActivoController::class, 'index']);
    Route::post('/', [ComponenteActivoController::class, 'store']);
    Route::get('/{id}', [ComponenteActivoController::class, 'show']);
    Route::put('/{id}', [ComponenteActivoController::class, 'update']);
    Route::delete('/{id}', [ComponenteActivoController::class, 'destroy']);
    Route::get('/estado/{estado}', [ComponenteActivoController::class, 'getByEstado']);
    Route::get('/organizacion/{organizacion}', [ComponenteActivoController::class, 'getByOrganizacion']);
});

    // Servicios
    Route::prefix('servicios')->group(function () {
        Route::get('/', [App\Http\Controllers\ServicioController::class, 'index']);
        Route::post('/', [App\Http\Controllers\ServicioController::class, 'store']);
        Route::get('/estadisticas', [App\Http\Controllers\ServicioController::class, 'estadisticas']);
        Route::post('/cambiar-estado-masivo', [App\Http\Controllers\ServicioController::class, 'cambiarEstadoMasivo']);
        Route::get('/{id}', [App\Http\Controllers\ServicioController::class, 'show']);
        Route::put('/{id}', [App\Http\Controllers\ServicioController::class, 'update']);
        Route::delete('/{id}', [App\Http\Controllers\ServicioController::class, 'destroy']);
    });

    // Marcas
    Route::prefix('marcas')->group(function () {
        Route::get('/', [App\Http\Controllers\MarcaController::class, 'index']);
        Route::post('/', [App\Http\Controllers\MarcaController::class, 'store']);
        Route::get('/{id}', [App\Http\Controllers\MarcaController::class, 'show']);
        Route::put('/{id}', [App\Http\Controllers\MarcaController::class, 'update']);
        Route::delete('/{id}', [App\Http\Controllers\MarcaController::class, 'destroy']);
        Route::patch('/{id}/toggle-status', [App\Http\Controllers\MarcaController::class, 'toggleStatus']);
        Route::get('/estado/{estado}', [App\Http\Controllers\MarcaController::class, 'getByEstado']);
        Route::get('/sistema/{sistema}', [App\Http\Controllers\MarcaController::class, 'getBySistema']);
        Route::get('/pais/{pais}', [App\Http\Controllers\MarcaController::class, 'getByPais']);
        Route::get('/paises-disponibles', [App\Http\Controllers\MarcaController::class, 'getPaisesDisponibles']);
    });

    // Almacenes
    Route::prefix('almacenes')->group(function () {
        Route::get('/', [App\Http\Controllers\AlmacenController::class, 'index']);
        Route::post('/', [App\Http\Controllers\AlmacenController::class, 'store']);
        Route::get('/estadisticas', [App\Http\Controllers\AlmacenController::class, 'estadisticas']);
        Route::get('/tipos-disponibles', [App\Http\Controllers\AlmacenController::class, 'tiposDisponibles']);
        Route::post('/cambiar-estado-masivo', [App\Http\Controllers\AlmacenController::class, 'cambiarEstadoMasivo']);
        Route::get('/tipo/{tipo}', [App\Http\Controllers\AlmacenController::class, 'porTipo']);
        Route::get('/{id}', [App\Http\Controllers\AlmacenController::class, 'show']);
        Route::put('/{id}', [App\Http\Controllers\AlmacenController::class, 'update']);
        Route::delete('/{id}', [App\Http\Controllers\AlmacenController::class, 'destroy']);
    });

    // Auditoría (ya estaba protegida)
    Route::get('/auditorias', [AuditoriaController::class, 'apiIndex']);
}); 