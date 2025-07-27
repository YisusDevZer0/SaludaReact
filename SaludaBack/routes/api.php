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
use App\Http\Controllers\UserPreferenceController;
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
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\CajaController;
use App\Http\Controllers\GastoController;
use App\Http\Controllers\AlmacenController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\EncargoController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\MovimientoInventarioController;
use App\Http\Controllers\AjusteInventarioController;
use App\Http\Controllers\StockController;
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

// Rutas de autenticación PersonalPos
Route::post('/pos/login', \App\Http\Controllers\Api\V2\Auth\SimpleLoginController::class);
Route::post('/pos/reset-password', [\App\Http\Controllers\Api\V2\Auth\PersonalPosResetPasswordController::class, '__invoke']);
Route::post('/pos/create-admin', [\App\Http\Controllers\Api\V2\Auth\PersonalPosCreateAdminController::class, '__invoke']);

// Ruta de prueba
Route::get('/pos/test', [\App\Http\Controllers\Api\V2\Auth\TestController::class, '__invoke']);

// Endpoint de prueba para verificar conexión con Vercel
Route::get('/test-connection', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Backend conectado correctamente desde Railway',
        'timestamp' => now()->toISOString(),
        'environment' => config('app.env'),
        'cors_enabled' => true,
        'frontend_url' => config('app.url')
    ]);
});

// Endpoint de health check simple
Route::get('/health', function () {
    try {
        return response()->json([
            'status' => 'healthy',
            'message' => 'Backend funcionando correctamente',
            'timestamp' => now()->toISOString(),
            'environment' => config('app.env'),
            'debug' => config('app.debug')
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Error en el backend: ' . $e->getMessage(),
            'timestamp' => now()->toISOString()
        ], 500);
    }
});

// Endpoint súper simple sin dependencias
Route::get('/ping', function () {
    return response()->json([
        'status' => 'pong',
        'message' => 'Server is alive',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
});

// Endpoint para verificar configuración
Route::get('/config-test', function () {
    return response()->json([
        'app_key' => env('APP_KEY') ? 'Configurada' : 'NO CONFIGURADA',
        'app_env' => env('APP_ENV', 'no configurado'),
        'app_debug' => env('APP_DEBUG', 'no configurado'),
        'db_connection' => env('DB_CONNECTION', 'no configurado'),
        'db_host' => env('DB_HOST', 'no configurado'),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
});

// Endpoint de diagnóstico detallado para Railway
Route::get('/railway-diagnostic', function () {
    $diagnostic = [
        'timestamp' => date('Y-m-d H:i:s'),
        'environment' => [
            'app_key' => env('APP_KEY') ? 'Configurada' : 'NO CONFIGURADA',
            'app_env' => env('APP_ENV', 'no configurado'),
            'app_debug' => env('APP_DEBUG', 'no configurado'),
            'app_url' => env('APP_URL', 'no configurado'),
        ],
        'database' => [
            'connection' => env('DB_CONNECTION', 'no configurado'),
            'host' => env('DB_HOST', 'no configurado'),
            'database' => env('DB_DATABASE', 'no configurado'),
            'username' => env('DB_USERNAME', 'no configurado'),
            'password' => env('DB_PASSWORD') ? 'Configurada' : 'NO CONFIGURADA',
        ],
        'files' => [
            'oauth_private_key' => file_exists(storage_path('oauth-private.key')) ? 'Existe' : 'NO EXISTE',
            'oauth_public_key' => file_exists(storage_path('oauth-public.key')) ? 'Existe' : 'NO EXISTE',
        ],
        'directories' => [
            'storage_cache' => is_writable(storage_path('framework/cache')) ? 'Escribible' : 'NO ESCRIBIBLE',
            'storage_logs' => is_writable(storage_path('logs')) ? 'Escribible' : 'NO ESCRIBIBLE',
        ],
        'middleware_test' => 'Este endpoint se ejecutó sin errores del middleware'
    ];
    
    return response()->json($diagnostic);
});

// Rutas con auditoría (solo las que realmente necesitan auditoría)
Route::middleware(['auditoria'])->group(function () {
    // Rutas de imágenes de perfil
    Route::middleware(['personalpos.auth'])->group(function () {
        Route::post('/profile/image/upload', [\App\Http\Controllers\Api\V2\ProfileImageController::class, 'upload']);
        Route::delete('/profile/image/delete', [\App\Http\Controllers\Api\V2\ProfileImageController::class, 'delete']);
        Route::get('/profile/image/{userId?}', [\App\Http\Controllers\Api\V2\ProfileImageController::class, 'show']);
        
        // Rutas para imágenes de personal específico
        Route::post('/personal/{userId}/image', [\App\Http\Controllers\Api\V2\ProfileImageController::class, 'uploadPersonalImage']);
        Route::delete('/personal/{userId}/image', [\App\Http\Controllers\Api\V2\ProfileImageController::class, 'deletePersonalImage']);
    });
});

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

// Ruta de prueba para verificar autenticación
Route::get('/test-auth', function(Request $request) {
    try {
        $user = $request->user('api');
        if ($user) {
            return response()->json([
                'success' => true,
                'message' => 'Usuario autenticado correctamente',
                'user' => [
                    'id' => $user->id,
                    'nombre' => $user->nombre,
                    'email' => $user->email,
                    'licencia' => $user->Id_Licencia ?? $user->ID_H_O_D
                ]
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'No hay usuario autenticado'
        ], 401);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 500);
    }
})->middleware('auth:api');

// Ruta de prueba para verificar autenticación con middleware personalizado
Route::get('/test-personalpos-auth', function(Request $request) {
    try {
        $user = $request->get('auth_user');
        if ($user) {
            return response()->json([
                'success' => true,
                'message' => 'Usuario autenticado correctamente con PersonalPOS',
                'user' => [
                    'id' => $user->id,
                    'nombre' => $user->nombre,
                    'email' => $user->email,
                    'licencia' => $user->Id_Licencia ?? $user->ID_H_O_D
                ]
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'No hay usuario autenticado'
        ], 401);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 500);
    }
})->middleware('personalpos.auth');

// Rutas para sucursales con soporte CORS
Route::options('/sucursales', function() {
    return response()->json([], 200);
});
Route::get('/sucursales', [SucursalController::class, 'index']);
Route::post('/sucursales', [SucursalController::class, 'store']);
Route::get('/sucursales/{id}', [SucursalController::class, 'show']);
Route::put('/sucursales/{id}', [SucursalController::class, 'update']);
Route::delete('/sucursales/{id}', [SucursalController::class, 'destroy']);
Route::get('/sucursales/estadisticas', [SucursalController::class, 'getStats']);
Route::get('/sucursales/activas', [SucursalController::class, 'getAllActive']);
Route::get('/sucursales/todas', [SucursalController::class, 'getAll']);

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
    $tokens = DB::table('personal_pos')
        ->whereNotNull('remember_token')
        ->select('id', 'nombre', 'apellido', 'remember_token', 'updated_at')
        ->get();
    
    return response()->json([
        'message' => 'Tokens en la BD',
        'count' => $tokens->count(),
        'tokens' => $tokens->map(function($token) {
            return [
                'id' => $token->id,
                'nombre_completo' => $token->nombre . ' ' . $token->apellido,
                'token_preview' => substr($token->remember_token, 0, 30) . '...',
                'token_length' => strlen($token->remember_token),
                'updated_at' => $token->updated_at
            ];
        })
    ]);
});

// Endpoint específico para debuggear el usuario ID 3
Route::get('/debug/user/3', function() {
    $user = DB::table('personal_pos')->where('id', 3)->first();
    
    if ($user) {
        return response()->json([
            'message' => 'Usuario encontrado',
            'user' => [
                'id' => $user->id,
                'nombre_completo' => $user->nombre . ' ' . $user->apellido,
                'email' => $user->email,
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
    
    $user = DB::table('personal_pos')
        ->where('remember_token', $token)
        ->first();
    
    if ($user) {
        return response()->json([
            'message' => 'Token encontrado',
            'user' => [
                'id' => $user->id,
                'nombre_completo' => $user->nombre . ' ' . $user->apellido,
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
    
    $user = DB::table('personal_pos')
        ->where('id', 3)
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
        'user_name' => $user->nombre . ' ' . $user->apellido ?? 'N/A'
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

    // Tipos de Productos
Route::prefix('tipos')->group(function () {
    Route::get('/', [TipoController::class, 'index']);
    Route::get('/create', [TipoController::class, 'create']);
    Route::post('/', [TipoController::class, 'store']);
    Route::get('/{id}', [TipoController::class, 'show']);
    Route::get('/{id}/edit', [TipoController::class, 'edit']);
    Route::put('/{id}', [TipoController::class, 'update']);
    Route::delete('/{id}', [TipoController::class, 'destroy']);
    Route::get('/estado/{estado}', [TipoController::class, 'getByEstado']);
    Route::get('/organizacion/{organizacion}', [TipoController::class, 'getByOrganizacion']);
});

    // Personal
Route::get('/personal/listado', [PersonalPOSController::class, 'indexDataTable']);
Route::get('personal/{id}', [PersonalPOSController::class, 'show']);
Route::post('personal', [PersonalPOSController::class, 'store']);
Route::put('personal/{id}', [PersonalPOSController::class, 'update']);
Route::delete('personal/{id}', [PersonalPOSController::class, 'destroy']);
Route::get('personal/active/count', [PersonalPOSController::class, 'countActive'])->middleware(['json.api', 'auth:api']);

// Roles
Route::get('/roles', function() {
    try {
        $roles = DB::table('roles_puestos')
            ->select('id', 'nombre', 'descripcion', 'tipo', 'activo')
            ->where('activo', 1)
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener roles: ' . $e->getMessage()
        ], 500);
    }
})->middleware(['auth:api']);

// Sucursales
Route::get('/sucursales', function() {
    try {
        $sucursales = DB::table('sucursales')
            ->select('id', 'nombre', 'codigo', 'direccion', 'estado')
            ->where('estado', 'activo')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $sucursales
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener sucursales: ' . $e->getMessage()
        ], 500);
    }
})->middleware(['auth:api']);

// Rutas de preferencias del usuario
Route::middleware(['json.api', 'auth:api'])->group(function () {
    Route::get('user/preferences', [UserPreferenceController::class, 'getUserPreferences']);
    Route::put('user/preferences', [UserPreferenceController::class, 'updateUserPreferences']);
    Route::post('user/preferences/reset', [UserPreferenceController::class, 'resetUserPreferences']);
});

// Ruta para autenticación de broadcasting
Route::post('broadcasting/auth', function (Request $request) {
    return Broadcast::routes();
})->middleware(['auth:api']);
Route::get('personal', [PersonalPOSController::class, 'index']); 

// Rutas del Dashboard
Route::prefix('dashboard')->middleware(['json.api', 'personalpos.auth'])->group(function () {
    Route::get('/stats', [DashboardController::class, 'getStats']);
    Route::get('/sales-stats', [DashboardController::class, 'getSalesStats']);
    Route::get('/appointments-stats', [DashboardController::class, 'getAppointmentsStats']);
    Route::get('/recent-transactions', [DashboardController::class, 'getRecentTransactions']);
    Route::get('/inventory-alerts', [DashboardController::class, 'getInventoryAlerts']);
    Route::get('/advanced-stats', [DashboardController::class, 'getAdvancedStats']);
});

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
        Route::get('/', [AlmacenController::class, 'index']);
        Route::post('/', [AlmacenController::class, 'store']);
        Route::get('/personas-disponibles', [AlmacenController::class, 'getPersonasDisponibles']);
        Route::get('/estadisticas', [AlmacenController::class, 'estadisticas']);
        Route::get('/tipos-disponibles', [AlmacenController::class, 'tiposDisponibles']);
        Route::post('/cambiar-estado-masivo', [AlmacenController::class, 'cambiarEstadoMasivo']);
        Route::get('/tipo/{tipo}', [AlmacenController::class, 'porTipo']);
        Route::get('/{id}', [AlmacenController::class, 'show']);
        Route::put('/{id}', [AlmacenController::class, 'update']);
        Route::delete('/{id}', [AlmacenController::class, 'destroy']);
    });

    // Auditoría (ya estaba protegida)
    Route::get('/auditorias', [AuditoriaController::class, 'apiIndex']);

    // Productos
    Route::prefix('productos')->group(function () {
        Route::get('/', [ProductoController::class, 'index']);
        Route::post('/', [ProductoController::class, 'store']);
        Route::post('/bulk-upload', [ProductoController::class, 'bulkUpload']);
        Route::get('/estadisticas', [ProductoController::class, 'estadisticas']);
        Route::post('/cambiar-estado-masivo', [ProductoController::class, 'cambiarEstadoMasivo']);
        Route::get('/estados-disponibles', [ProductoController::class, 'estadosDisponibles']);
        Route::get('/unidades-medida-disponibles', [ProductoController::class, 'unidadesMedidaDisponibles']);
        Route::get('/estado/{estado}', [ProductoController::class, 'getByEstado']);
        Route::get('/categoria/{categoriaId}', [ProductoController::class, 'getByCategoria']);
        Route::get('/marca/{marcaId}', [ProductoController::class, 'getByMarca']);
        Route::get('/proveedor/{proveedorId}', [ProductoController::class, 'getByProveedor']);
        Route::get('/stock-bajo', [ProductoController::class, 'getConStockBajo']);
        Route::get('/sin-stock', [ProductoController::class, 'getSinStock']);
        Route::get('/por-vencer', [ProductoController::class, 'getPorVencer']);
        Route::get('/vencidos', [ProductoController::class, 'getVencidos']);
        Route::put('/{id}/stock', [ProductoController::class, 'updateStock']);
        Route::get('/{id}', [ProductoController::class, 'show']);
        Route::put('/{id}', [ProductoController::class, 'update']);
        Route::delete('/{id}', [ProductoController::class, 'destroy']);
    });

    // Stock
    Route::prefix('stock')->group(function () {
        Route::post('/crear-inicial', [StockController::class, 'crearStockInicial']);
        Route::post('/agregar', [StockController::class, 'agregarStock']);
        Route::get('/producto/{productoId}', [StockController::class, 'getStockProducto']);
        Route::get('/historial/{productoId}', [StockController::class, 'getHistorialStock']);
        Route::get('/sucursal/{sucursalId}', [StockController::class, 'getStockPorSucursal']);
        Route::post('/transferir', [StockController::class, 'transferirStock']);
        Route::post('/ajustar', [StockController::class, 'ajustarStock']);
        Route::get('/alertas/bajo', [StockController::class, 'getAlertasStockBajo']);
        Route::get('/alertas/vencimiento', [StockController::class, 'getAlertasVencimiento']);
        Route::get('/estadisticas', [StockController::class, 'getEstadisticasStock']);
    });

    // Proveedores
    Route::prefix('proveedores')->group(function () {
        Route::get('/', [ProveedorController::class, 'index']);
        Route::post('/', [ProveedorController::class, 'store']);
        Route::get('/estadisticas', [ProveedorController::class, 'estadisticas']);
        Route::post('/cambiar-estado-masivo', [ProveedorController::class, 'cambiarEstadoMasivo']);
        Route::get('/tipos-persona-disponibles', [ProveedorController::class, 'tiposPersonaDisponibles']);
        Route::get('/categorias-disponibles', [ProveedorController::class, 'categoriasDisponibles']);
        Route::get('/estados-disponibles', [ProveedorController::class, 'estadosDisponibles']);
        Route::get('/condiciones-iva-disponibles', [ProveedorController::class, 'condicionesIvaDisponibles']);
        Route::get('/estado/{estado}', [ProveedorController::class, 'getByEstado']);
        Route::get('/categoria/{categoria}', [ProveedorController::class, 'getByCategoria']);
        Route::get('/tipo-persona/{tipo}', [ProveedorController::class, 'getByTipoPersona']);
        Route::get('/condicion-iva/{condicion}', [ProveedorController::class, 'getByCondicionIva']);
        Route::get('/con-credito', [ProveedorController::class, 'getConCredito']);
        Route::get('/sin-credito', [ProveedorController::class, 'getSinCredito']);
        Route::get('/ciudad/{ciudad}', [ProveedorController::class, 'getByCiudad']);
        Route::get('/provincia/{provincia}', [ProveedorController::class, 'getByProvincia']);
        Route::get('/{id}', [ProveedorController::class, 'show']);
        Route::put('/{id}', [ProveedorController::class, 'update']);
        Route::delete('/{id}', [ProveedorController::class, 'destroy']);
    });

    // Clientes
    Route::prefix('clientes')->group(function () {
        Route::get('/', [ClienteController::class, 'index']);
        Route::post('/', [ClienteController::class, 'store']);
        Route::get('/estadisticas', [ClienteController::class, 'statistics']);
        Route::get('/por-categoria', [ClienteController::class, 'byCategory']);
        Route::get('/top-ventas', [ClienteController::class, 'topBySales']);
        Route::get('/{id}', [ClienteController::class, 'show']);
        Route::put('/{id}', [ClienteController::class, 'update']);
        Route::delete('/{id}', [ClienteController::class, 'destroy']);
    });

    // Usuarios
    Route::prefix('usuarios')->group(function () {
        Route::get('/', [UsuarioController::class, 'index']);
        Route::post('/', [UsuarioController::class, 'store']);
        Route::get('/estadisticas', [UsuarioController::class, 'statistics']);
        Route::get('/por-rol', [UsuarioController::class, 'byRole']);
        Route::get('/perfil', [UsuarioController::class, 'profile']);
        Route::put('/perfil', [UsuarioController::class, 'updateProfile']);
        Route::put('/cambiar-contrasena', [UsuarioController::class, 'changePassword']);
        Route::get('/{id}', [UsuarioController::class, 'show']);
        Route::put('/{id}', [UsuarioController::class, 'update']);
        Route::delete('/{id}', [UsuarioController::class, 'destroy']);
        Route::put('/{id}/estado', [UsuarioController::class, 'changeStatus']);
        Route::put('/{id}/restablecer-contrasena', [UsuarioController::class, 'resetPassword']);
    });
}); 

// Rutas de Productos
Route::prefix('productos')->group(function () {
    Route::get('/', [ProductoController::class, 'index']);
    Route::post('/', [ProductoController::class, 'store']);
    Route::post('/bulk-upload', [ProductoController::class, 'bulkUpload']);
    Route::get('/{id}', [ProductoController::class, 'show']);
    Route::put('/{id}', [ProductoController::class, 'update']);
    Route::delete('/{id}', [ProductoController::class, 'destroy']);
    Route::put('/{id}/stock', [ProductoController::class, 'updateStock']);
    Route::get('/estadisticas/statistics', [ProductoController::class, 'statistics']);
    Route::get('/por-categoria/getByCategoria', [ProductoController::class, 'getByCategoria']);
    Route::get('/por-marca/getByMarca', [ProductoController::class, 'getByMarca']);
    Route::get('/por-proveedor/getByProveedor', [ProductoController::class, 'getByProveedor']);
    Route::get('/con-stock-bajo/getConStockBajo', [ProductoController::class, 'getConStockBajo']);
    Route::get('/sin-stock/getSinStock', [ProductoController::class, 'getSinStock']);
    Route::get('/por-vencer/getPorVencer', [ProductoController::class, 'getPorVencer']);
    Route::get('/vencidos/getVencidos', [ProductoController::class, 'getVencidos']);
    Route::get('/estados-disponibles/estadosDisponibles', [ProductoController::class, 'estadosDisponibles']);
    Route::get('/unidades-medida-disponibles/unidadesMedidaDisponibles', [ProductoController::class, 'unidadesMedidaDisponibles']);
    Route::post('/cambiar-estado-masivo/cambiarEstadoMasivo', [ProductoController::class, 'cambiarEstadoMasivo']);
});

// Rutas de Ventas
Route::prefix('ventas')->group(function () {
    Route::get('/', [VentaController::class, 'index']);
    Route::post('/', [VentaController::class, 'store']);
    Route::get('/{id}', [VentaController::class, 'show']);
    Route::put('/{id}', [VentaController::class, 'update']);
    Route::delete('/{id}', [VentaController::class, 'destroy']);
    Route::put('/{id}/confirmar', [VentaController::class, 'confirmar']);
    Route::put('/{id}/anular', [VentaController::class, 'anular']);
    Route::get('/estadisticas/statistics', [VentaController::class, 'statistics']);
    Route::get('/por-rango/getPorRango', [VentaController::class, 'getPorRango']);
    Route::get('/por-cliente/getPorCliente', [VentaController::class, 'getPorCliente']);
    Route::get('/por-vendedor/getPorVendedor', [VentaController::class, 'getPorVendedor']);
});

// Rutas de Compras
Route::prefix('compras')->group(function () {
    Route::get('/', [CompraController::class, 'index']);
    Route::post('/', [CompraController::class, 'store']);
    Route::get('/{id}', [CompraController::class, 'show']);
    Route::put('/{id}', [CompraController::class, 'update']);
    Route::delete('/{id}', [CompraController::class, 'destroy']);
    Route::put('/{id}/confirmar', [CompraController::class, 'confirmar']);
    Route::put('/{id}/anular', [CompraController::class, 'anular']);
    Route::get('/estadisticas/statistics', [CompraController::class, 'statistics']);
    Route::get('/por-rango/getPorRango', [CompraController::class, 'getPorRango']);
    Route::get('/por-proveedor/getByProveedor', [CompraController::class, 'getByProveedor']);
    Route::get('/por-comprador/getPorComprador', [CompraController::class, 'getByComprador']);
});

// Rutas de Cajas
Route::prefix('cajas')->group(function () {
    Route::get('/', [CajaController::class, 'index']);
    Route::post('/', [CajaController::class, 'store']);
    Route::get('/{id}', [CajaController::class, 'show']);
    Route::put('/{id}', [CajaController::class, 'update']);
    Route::delete('/{id}', [CajaController::class, 'destroy']);
    Route::put('/{id}/abrir', [CajaController::class, 'abrir']);
    Route::put('/{id}/cerrar', [CajaController::class, 'cerrar']);
    Route::get('/{id}/saldo', [CajaController::class, 'saldo']);
    Route::get('/estadisticas/statistics', [CajaController::class, 'statistics']);
    Route::get('/por-sucursal/getPorSucursal', [CajaController::class, 'getPorSucursal']);
    Route::get('/metodos-pago-disponibles/metodosPagoDisponibles', [CajaController::class, 'metodosPagoDisponibles']);
    Route::get('/monedas-disponibles/monedasDisponibles', [CajaController::class, 'monedasDisponibles']);
});

// Rutas de Gastos
Route::prefix('gastos')->group(function () {
    Route::get('/', [GastoController::class, 'index']);
    Route::post('/', [GastoController::class, 'store']);
    Route::get('/{id}', [GastoController::class, 'show']);
    Route::put('/{id}', [GastoController::class, 'update']);
    Route::delete('/{id}', [GastoController::class, 'destroy']);
    Route::put('/{id}/marcar-pagado', [GastoController::class, 'marcarPagado']);
    Route::get('/estadisticas/statistics', [GastoController::class, 'statistics']);
    Route::get('/por-rango/getPorRango', [GastoController::class, 'getPorRango']);
    Route::get('/por-categoria/getPorCategoria', [GastoController::class, 'getPorCategoria']);
    Route::get('/por-proveedor/getPorProveedor', [GastoController::class, 'getPorProveedor']);
    Route::get('/pendientes/getPendientes', [GastoController::class, 'getPendientes']);
    Route::get('/vencidos/getVencidos', [GastoController::class, 'getVencidos']);
    Route::get('/por-vencer/getPorVencer', [GastoController::class, 'getPorVencer']);
    Route::get('/prioridades-disponibles/prioridadesDisponibles', [GastoController::class, 'prioridadesDisponibles']);
    Route::get('/recurrencias-disponibles/recurrenciasDisponibles', [GastoController::class, 'recurrenciasDisponibles']);
});

// Rutas de Almacenes
Route::prefix('almacenes')->group(function () {
    Route::get('/', [AlmacenController::class, 'index']);
    Route::post('/', [AlmacenController::class, 'store']);
    Route::get('/personas-disponibles', [AlmacenController::class, 'getPersonasDisponibles']);
    Route::get('/{id}', [AlmacenController::class, 'show']);
    Route::put('/{id}', [AlmacenController::class, 'update']);
    Route::delete('/{id}', [AlmacenController::class, 'destroy']);
    Route::get('/{id}/inventario', [AlmacenController::class, 'inventario']);
    Route::get('/{id}/capacidad', [AlmacenController::class, 'capacidad']);
    Route::get('/{id}/movimientos', [AlmacenController::class, 'movimientos']);
    Route::get('/estadisticas/statistics', [AlmacenController::class, 'statistics']);
    Route::get('/tipos-almacen-disponibles/tiposAlmacenDisponibles', [AlmacenController::class, 'tiposAlmacenDisponibles']);
    Route::get('/unidades-capacidad-disponibles/unidadesCapacidadDisponibles', [AlmacenController::class, 'unidadesCapacidadDisponibles']);
});

// Rutas de Encargos
Route::prefix('encargos')->group(function () {
    Route::get('/', [EncargoController::class, 'index']);
    Route::post('/', [EncargoController::class, 'store']);
    Route::get('/{id}', [EncargoController::class, 'show']);
    Route::put('/{id}', [EncargoController::class, 'update']);
    Route::delete('/{id}', [EncargoController::class, 'destroy']);
    Route::put('/{id}/cambiar-estado', [EncargoController::class, 'cambiarEstado']);
    Route::put('/{id}/marcar-entregado', [EncargoController::class, 'marcarEntregado']);
    Route::get('/estadisticas/statistics', [EncargoController::class, 'statistics']);
    Route::get('/por-cliente/getPorCliente', [EncargoController::class, 'getPorCliente']);
    Route::get('/urgentes/getUrgentes', [EncargoController::class, 'getUrgentes']);
    Route::get('/vencidos/getVencidos', [EncargoController::class, 'getVencidos']);
    Route::get('/por-vencer/getPorVencer', [EncargoController::class, 'getPorVencer']);
    Route::get('/estados-disponibles/estadosDisponibles', [EncargoController::class, 'estadosDisponibles']);
    Route::get('/prioridades-disponibles/prioridadesDisponibles', [EncargoController::class, 'prioridadesDisponibles']);
});

// Rutas de Inventario
Route::prefix('inventario')->group(function () {
    Route::get('/', [InventarioController::class, 'index']);
    Route::post('/', [InventarioController::class, 'store']);
    Route::get('/{id}', [InventarioController::class, 'show']);
    Route::put('/{id}', [InventarioController::class, 'update']);
    Route::delete('/{id}', [InventarioController::class, 'destroy']);
    Route::put('/{id}/ajustar-stock', [InventarioController::class, 'ajustarStock']);
    Route::get('/estadisticas/statistics', [InventarioController::class, 'statistics']);
    Route::get('/por-producto/getPorProducto', [InventarioController::class, 'getPorProducto']);
    Route::get('/por-sucursal/getPorSucursal', [InventarioController::class, 'getPorSucursal']);
    Route::get('/con-stock-bajo/getConStockBajo', [InventarioController::class, 'getConStockBajo']);
    Route::get('/sin-stock/getSinStock', [InventarioController::class, 'getSinStock']);
    Route::get('/por-vencer/getPorVencer', [InventarioController::class, 'getPorVencer']);
    Route::get('/vencidos/getVencidos', [InventarioController::class, 'getVencidos']);
    Route::get('/estados-disponibles/estadosDisponibles', [InventarioController::class, 'estadosDisponibles']);
});

// Rutas de Movimientos de Inventario
Route::prefix('movimientos-inventario')->group(function () {
    Route::get('/', [MovimientoInventarioController::class, 'index']);
    Route::post('/', [MovimientoInventarioController::class, 'store']);
    Route::get('/{id}', [MovimientoInventarioController::class, 'show']);
    Route::put('/{id}', [MovimientoInventarioController::class, 'update']);
    Route::delete('/{id}', [MovimientoInventarioController::class, 'destroy']);
    Route::put('/{id}/confirmar', [MovimientoInventarioController::class, 'confirmar']);
    Route::put('/{id}/anular', [MovimientoInventarioController::class, 'anular']);
    Route::get('/estadisticas/statistics', [MovimientoInventarioController::class, 'statistics']);
    Route::get('/por-producto/getPorProducto', [MovimientoInventarioController::class, 'getPorProducto']);
    Route::get('/por-sucursal/getPorSucursal', [MovimientoInventarioController::class, 'getPorSucursal']);
    Route::get('/tipos-movimiento-disponibles/tiposMovimientoDisponibles', [MovimientoInventarioController::class, 'tiposMovimientoDisponibles']);
    Route::get('/categorias-movimiento-disponibles/categoriasMovimientoDisponibles', [MovimientoInventarioController::class, 'categoriasMovimientoDisponibles']);
    Route::get('/estados-disponibles/estadosDisponibles', [MovimientoInventarioController::class, 'estadosDisponibles']);
});

// Rutas de Ajustes de Inventario
Route::prefix('ajustes-inventario')->group(function () {
    Route::get('/', [AjusteInventarioController::class, 'index']);
    Route::post('/', [AjusteInventarioController::class, 'store']);
    Route::get('/{id}', [AjusteInventarioController::class, 'show']);
    Route::put('/{id}', [AjusteInventarioController::class, 'update']);
    Route::delete('/{id}', [AjusteInventarioController::class, 'destroy']);
    Route::put('/{id}/confirmar', [AjusteInventarioController::class, 'confirmar']);
    Route::put('/{id}/anular', [AjusteInventarioController::class, 'anular']);
    Route::get('/estadisticas/statistics', [AjusteInventarioController::class, 'statistics']);
    Route::get('/por-producto/getPorProducto', [AjusteInventarioController::class, 'getPorProducto']);
    Route::get('/por-sucursal/getPorSucursal', [AjusteInventarioController::class, 'getPorSucursal']);
    Route::get('/tipos-ajuste-disponibles/tiposAjusteDisponibles', [AjusteInventarioController::class, 'tiposAjusteDisponibles']);
    Route::get('/estados-disponibles/estadosDisponibles', [AjusteInventarioController::class, 'estadosDisponibles']);
});

// Rutas de Proveedores
Route::prefix('proveedores')->group(function () {
    Route::get('/', [ProveedorController::class, 'index']);
    Route::post('/', [ProveedorController::class, 'store']);
    Route::get('/{id}', [ProveedorController::class, 'show']);
    Route::put('/{id}', [ProveedorController::class, 'update']);
    Route::delete('/{id}', [ProveedorController::class, 'destroy']);
    Route::get('/estadisticas/statistics', [ProveedorController::class, 'statistics']);
    Route::get('/por-categoria/getByCategoria', [ProveedorController::class, 'getByCategoria']);
    Route::get('/por-ciudad/getByCiudad', [ProveedorController::class, 'getByCiudad']);
    Route::get('/por-estado/getByEstado', [ProveedorController::class, 'getByEstado']);
    Route::get('/activos/getActivos', [ProveedorController::class, 'getActivos']);
    Route::get('/inactivos/getInactivos', [ProveedorController::class, 'getInactivos']);
    Route::get('/estados-disponibles/estadosDisponibles', [ProveedorController::class, 'estadosDisponibles']);
    Route::get('/categorias-disponibles/categoriasDisponibles', [ProveedorController::class, 'categoriasDisponibles']);
    Route::post('/cambiar-estado-masivo/cambiarEstadoMasivo', [ProveedorController::class, 'cambiarEstadoMasivo']);
});

// Rutas de Clientes
Route::prefix('clientes')->group(function () {
    Route::get('/', [ClienteController::class, 'index']);
    Route::post('/', [ClienteController::class, 'store']);
    Route::get('/{id}', [ClienteController::class, 'show']);
    Route::put('/{id}', [ClienteController::class, 'update']);
    Route::delete('/{id}', [ClienteController::class, 'destroy']);
    Route::get('/estadisticas/statistics', [ClienteController::class, 'statistics']);
    Route::get('/por-categoria/getByCategoria', [ClienteController::class, 'getByCategoria']);
    Route::get('/por-ciudad/getByCiudad', [ClienteController::class, 'getByCiudad']);
    Route::get('/por-estado/getByEstado', [ClienteController::class, 'getByEstado']);
    Route::get('/activos/getActivos', [ClienteController::class, 'getActivos']);
    Route::get('/inactivos/getInactivos', [ClienteController::class, 'getInactivos']);
    Route::get('/estados-disponibles/estadosDisponibles', [ClienteController::class, 'estadosDisponibles']);
    Route::get('/categorias-disponibles/categoriasDisponibles', [ClienteController::class, 'categoriasDisponibles']);
    Route::post('/cambiar-estado-masivo/cambiarEstadoMasivo', [ClienteController::class, 'cambiarEstadoMasivo']);
});

// Rutas de Usuarios
Route::prefix('usuarios')->group(function () {
    Route::get('/', [UsuarioController::class, 'index']);
    Route::post('/', [UsuarioController::class, 'store']);
    Route::get('/{id}', [UsuarioController::class, 'show']);
    Route::put('/{id}', [UsuarioController::class, 'update']);
    Route::delete('/{id}', [UsuarioController::class, 'destroy']);
    Route::put('/{id}/cambiar-rol', [UsuarioController::class, 'cambiarRol']);
    Route::put('/{id}/resetear-password', [UsuarioController::class, 'resetearPassword']);
    Route::put('/{id}/activar', [UsuarioController::class, 'activar']);
    Route::put('/{id}/desactivar', [UsuarioController::class, 'desactivar']);
    Route::get('/estadisticas/statistics', [UsuarioController::class, 'statistics']);
    Route::get('/por-rol/getByRol', [UsuarioController::class, 'getByRol']);
    Route::get('/activos/getActivos', [UsuarioController::class, 'getActivos']);
    Route::get('/inactivos/getInactivos', [UsuarioController::class, 'getInactivos']);
    Route::get('/roles-disponibles/rolesDisponibles', [UsuarioController::class, 'rolesDisponibles']);
    Route::post('/cambiar-estado-masivo/cambiarEstadoMasivo', [UsuarioController::class, 'cambiarEstadoMasivo']);
}); 