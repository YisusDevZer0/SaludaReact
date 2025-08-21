<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use App\Models\Configuracion;
use App\Models\Sucursal;
use App\Models\Caja;
use App\Models\Usuario;

class ConfiguracionController extends Controller
{
    /**
     * Obtener todas las configuraciones del sistema
     */
    public function index()
    {
        try {
            $configuraciones = Configuracion::all()->keyBy('clave');
            
            return response()->json([
                'success' => true,
                'data' => $configuraciones,
                'message' => 'Configuraciones obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener configuraciones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener configuración específica por clave
     */
    public function show($clave)
    {
        try {
            $configuracion = Configuracion::where('clave', $clave)->first();
            
            if (!$configuracion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Configuración no encontrada'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $configuracion,
                'message' => 'Configuración obtenida exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener configuración: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear nueva configuración
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'clave' => 'required|string|max:100|unique:configuraciones',
                'valor' => 'required|string',
                'descripcion' => 'nullable|string|max:255',
                'tipo' => 'required|in:string,integer,boolean,json',
                'categoria' => 'required|string|max:50'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $configuracion = Configuracion::create($request->all());
            
            // Limpiar cache
            Cache::forget('configuracion.' . $request->clave);
            
            return response()->json([
                'success' => true,
                'data' => $configuracion,
                'message' => 'Configuración creada exitosamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear configuración: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar configuración existente
     */
    public function update(Request $request, $id)
    {
        try {
            $configuracion = Configuracion::find($id);
            
            if (!$configuracion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Configuración no encontrada'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'valor' => 'required|string',
                'descripcion' => 'nullable|string|max:255',
                'tipo' => 'in:string,integer,boolean,json',
                'categoria' => 'string|max:50'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $configuracion->update($request->all());
            
            // Limpiar cache
            Cache::forget('configuracion.' . $configuracion->clave);
            
            return response()->json([
                'success' => true,
                'data' => $configuracion,
                'message' => 'Configuración actualizada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar configuración: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar configuración
     */
    public function destroy($id)
    {
        try {
            $configuracion = Configuracion::find($id);
            
            if (!$configuracion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Configuración no encontrada'
                ], 404);
            }

            // Limpiar cache
            Cache::forget('configuracion.' . $configuracion->clave);
            
            $configuracion->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Configuración eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar configuración: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener configuraciones por categoría
     */
    public function getByCategory($categoria)
    {
        try {
            $configuraciones = Configuracion::where('categoria', $categoria)->get();
            
            return response()->json([
                'success' => true,
                'data' => $configuraciones,
                'message' => 'Configuraciones obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener configuraciones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener información del sistema
     */
    public function getSystemInfo()
    {
        try {
            $systemInfo = [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'database' => [
                    'driver' => config('database.default'),
                    'connection' => config('database.connections.' . config('database.default') . '.database')
                ],
                'cache_driver' => config('cache.default'),
                'queue_driver' => config('queue.default'),
                'app_debug' => config('app.debug'),
                'app_environment' => config('app.env'),
                'timezone' => config('app.timezone'),
                'locale' => config('app.locale'),
                'maintenance_mode' => app()->isDownForMaintenance(),
                'storage_links' => [
                    'public' => is_link(public_path('storage')),
                    'symlink_created' => file_exists(public_path('storage'))
                ]
            ];
            
            return response()->json([
                'success' => true,
                'data' => $systemInfo,
                'message' => 'Información del sistema obtenida exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener información del sistema: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas del sistema
     */
    public function getSystemStats()
    {
        try {
            $stats = [
                'usuarios' => [
                    'total' => Usuario::count(),
                    'activos' => Usuario::where('estado', 'activo')->count(),
                    'inactivos' => Usuario::where('estado', 'inactivo')->count()
                ],
                'sucursales' => [
                    'total' => Sucursal::count(),
                    'activas' => Sucursal::where('estado', 'activa')->count(),
                    'inactivas' => Sucursal::where('estado', 'inactiva')->count()
                ],
                'cajas' => [
                    'total' => Caja::count(),
                    'abiertas' => Caja::where('estado', 'abierta')->count(),
                    'cerradas' => Caja::where('estado', 'cerrada')->count()
                ],
                'database' => [
                    'tables' => count(DB::select('SHOW TABLES')),
                    'size' => $this->getDatabaseSize()
                ],
                'storage' => [
                    'disk_usage' => $this->getDiskUsage(),
                    'free_space' => disk_free_space(storage_path())
                ]
            ];
            
            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estadísticas del sistema obtenidas exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas del sistema: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Limpiar cache del sistema
     */
    public function clearCache()
    {
        try {
            Cache::flush();
            
            return response()->json([
                'success' => true,
                'message' => 'Cache del sistema limpiado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al limpiar cache: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener logs del sistema
     */
    public function getSystemLogs()
    {
        try {
            $logFile = storage_path('logs/laravel.log');
            $logs = [];
            
            if (file_exists($logFile)) {
                $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                $logs = array_slice($lines, -100); // Últimas 100 líneas
            }
            
            return response()->json([
                'success' => true,
                'data' => $logs,
                'message' => 'Logs del sistema obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener logs del sistema: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener tamaño de la base de datos
     */
    private function getDatabaseSize()
    {
        try {
            $result = DB::select("
                SELECT 
                    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'size_mb'
                FROM information_schema.tables 
                WHERE table_schema = DATABASE()
            ");
            
            return $result[0]->size_mb ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Obtener uso del disco
     */
    private function getDiskUsage()
    {
        try {
            $path = storage_path();
            $total = disk_total_space($path);
            $free = disk_free_space($path);
            $used = $total - $free;
            
            return [
                'total' => $total,
                'used' => $used,
                'free' => $free,
                'percentage' => round(($used / $total) * 100, 2)
            ];
        } catch (\Exception $e) {
            return [
                'total' => 0,
                'used' => 0,
                'free' => 0,
                'percentage' => 0
            ];
        }
    }
}
