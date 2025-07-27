<?php

namespace App\Http\Controllers;

use App\Models\Almacen;
use App\Models\Sucursal;
use App\Models\Producto;
use App\Models\MovimientoInventario;
use App\Http\Requests\AlmacenRequest;
use App\Http\Resources\AlmacenResource;
use App\Http\Resources\AlmacenCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AlmacenController extends Controller
{
    /**
     * Display a listing of almacenes.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            Log::info('Obteniendo almacenes', [
                'user_id' => $user->id,
                'licencia' => $licencia
            ]);

            $query = Almacen::query();

            // Filtrar por licencia del usuario
            if ($licencia) {
                $query->where('Id_Licencia', $licencia);
                Log::info('Filtrando almacenes por licencia:', ['licencia' => $licencia]);
            }

            // Filtros adicionales
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('Nom_Almacen', 'LIKE', "%{$search}%")
                      ->orWhere('Descripcion', 'LIKE', "%{$search}%")
                      ->orWhere('Responsable', 'LIKE', "%{$search}%");
                });
            }

            if ($request->has('estado') && $request->estado) {
                $query->where('Estado', $request->estado);
            }

            if ($request->has('tipo') && $request->tipo) {
                $query->where('Tipo', $request->tipo);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'Almacen_ID');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $almacenes = $query->paginate($perPage);

            Log::info('Almacenes obtenidos:', [
                'total' => $almacenes->total(),
                'licencia_filtro' => $licencia
            ]);

            return response()->json([
                'success' => true,
                'data' => $almacenes->items(),
                'pagination' => [
                    'current_page' => $almacenes->currentPage(),
                    'last_page' => $almacenes->lastPage(),
                    'per_page' => $almacenes->perPage(),
                    'total' => $almacenes->total(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener almacenes:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener almacenes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created almacen.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('Creando nuevo almacén', [
                'request_data' => $request->all(),
                'user_id' => Auth::guard('api')->id()
            ]);

            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            Log::info('Usuario autenticado:', [
                'user_id' => $user->id,
                'licencia' => $licencia
            ]);

            $validator = Validator::make($request->all(), [
                'Nom_Almacen' => 'required|string|max:255',
                'Tipo' => 'required|string|max:100',
                'Responsable' => 'nullable|string|max:255',
                'Estado' => 'required|string|max:50',
                'Cod_Estado' => 'required|string|max:10',
                'Sistema' => 'required|string|max:50',
                'FkSucursal' => 'nullable|integer',
                'Descripcion' => 'nullable|string',
                'Ubicacion' => 'nullable|string|max:500',
                'Capacidad_Max' => 'nullable|numeric|min:0',
                'Unidad_Medida' => 'nullable|string|max:50',
                'Telefono' => 'nullable|string|max:20',
                'Email' => 'nullable|email|max:255',
            ]);

            if ($validator->fails()) {
                Log::error('Error de validación al crear almacén:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Establecer valores por defecto si no se proporcionan
            $data = $validator->validated();
            
            if (empty($data['Agregado_Por'])) {
                $data['Agregado_Por'] = $user->name ?? $user->Nombre_Apellidos ?? 'Sistema';
            }
            
            if (empty($data['Agregadoel'])) {
                $data['Agregadoel'] = now();
            }
            
            if (empty($data['Sistema'])) {
                $data['Sistema'] = 'SaludaReact';
            }

            // Asignar automáticamente la licencia del usuario
            $data['Id_Licencia'] = $licencia;

            Log::info('Datos finales para crear almacén:', $data);

            $almacen = Almacen::create($data);

            Log::info('Almacén creado exitosamente:', [
                'almacen_id' => $almacen->Almacen_ID,
                'nombre' => $almacen->Nom_Almacen
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Almacén creado exitosamente',
                'data' => $almacen
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al crear almacén:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al crear almacén: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified almacen.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $almacen = Almacen::with(['sucursales', 'productos'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $almacen
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Almacén no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified almacen.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            Log::info('Actualizando almacén', [
                'id' => $id,
                'request_data' => $request->all()
            ]);

            $almacen = Almacen::findOrFail($id);

            // Obtener el usuario autenticado
            $user = Auth::guard('api')->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

            $validator = Validator::make($request->all(), [
                'Nom_Almacen' => 'required|string|max:255',
                'Tipo' => 'required|string|max:100',
                'Responsable' => 'nullable|string|max:255',
                'Estado' => 'required|string|max:50',
                'Cod_Estado' => 'required|string|max:10',
                'Sistema' => 'required|string|max:50',
                'FkSucursal' => 'nullable|integer',
                'Agregado_Por' => 'nullable|string|max:255',
                'Descripcion' => 'nullable|string',
                'Ubicacion' => 'nullable|string|max:500',
                'Capacidad_Max' => 'nullable|numeric|min:0',
                'Unidad_Medida' => 'nullable|string|max:50',
                'Telefono' => 'nullable|string|max:20',
                'Email' => 'nullable|email|max:255',
                'Id_Licencia' => 'nullable|string|max:100'
            ]);

            if ($validator->fails()) {
                Log::error('Error de validación al actualizar almacén:', [
                    'errors' => $validator->errors()
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            
            // Asignar valores por defecto
            $data['Agregado_Por'] = $user->name ?? $user->Nombre_Apellidos ?? 'Sistema';
            $data['Sistema'] = 'SaludaReact';
            $data['Id_Licencia'] = $licencia;

            Log::info('Datos a actualizar:', $data);

            $almacen->update($data);

            Log::info('Almacén actualizado exitosamente', [
                'id' => $id,
                'nombre' => $data['Nom_Almacen']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Almacén actualizado exitosamente',
                'data' => $almacen
            ]);

        } catch (\Exception $e) {
            Log::error('Error al actualizar almacén:', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar almacén: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified almacen.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $almacen = Almacen::findOrFail($id);

            // Verificar que no tenga productos asociados
            $productosAsociados = Producto::where('almacen_id', $id)->count();
            if ($productosAsociados > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el almacén porque tiene productos asociados'
                ], 400);
            }

            // Verificar que no tenga sucursales asociadas
            $sucursalesAsociadas = Sucursal::where('almacen_id', $id)->count();
            if ($sucursalesAsociadas > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el almacén porque tiene sucursales asociadas'
                ], 400);
            }

            $almacen->delete();

            return response()->json([
                'success' => true,
                'message' => 'Almacén eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar almacén: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get inventory for warehouse
     */
    public function inventario(Request $request, string $id): JsonResponse
    {
        try {
            $almacen = Almacen::findOrFail($id);

            $query = Producto::where('almacen_id', $id)
                ->with(['categoria', 'marca', 'proveedor']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('codigo', 'LIKE', "%{$search}%")
                      ->orWhere('nombre', 'LIKE', "%{$search}%")
                      ->orWhere('codigo_barras', 'LIKE', "%{$search}%");
                });
            }

            if ($request->has('categoria_id') && $request->categoria_id) {
                $query->where('categoria_id', $request->categoria_id);
            }

            if ($request->has('stock_bajo') && $request->stock_bajo) {
                $query->where('stock_actual', '<=', DB::raw('stock_minimo'));
            }

            if ($request->has('sin_stock') && $request->sin_stock) {
                $query->where('stock_actual', '<=', 0);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'nombre');
            $sortOrder = $request->get('sortOrder', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $productos = $query->paginate($perPage);

            // Calcular estadísticas del inventario
            $stats = [
                'total_productos' => Producto::where('almacen_id', $id)->count(),
                'productos_con_stock' => Producto::where('almacen_id', $id)->where('stock_actual', '>', 0)->count(),
                'productos_sin_stock' => Producto::where('almacen_id', $id)->where('stock_actual', '<=', 0)->count(),
                'productos_stock_bajo' => Producto::where('almacen_id', $id)->whereRaw('stock_actual <= stock_minimo')->count(),
                'valor_total_inventario' => Producto::where('almacen_id', $id)->sum(DB::raw('stock_actual * precio_costo')),
                'valor_total_venta' => Producto::where('almacen_id', $id)->sum(DB::raw('stock_actual * precio_venta')),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'almacen' => $almacen,
                    'inventario' => $productos->items(),
                    'pagination' => [
                        'current_page' => $productos->currentPage(),
                        'last_page' => $productos->lastPage(),
                        'per_page' => $productos->perPage(),
                        'total' => $productos->total(),
                    ],
                    'estadisticas' => $stats
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener inventario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get warehouse statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_almacenes' => Almacen::count(),
                'almacenes_activos' => Almacen::where('estado', 'activo')->count(),
                'almacenes_inactivos' => Almacen::where('estado', 'inactivo')->count(),
                'almacenes_mantenimiento' => Almacen::where('estado', 'en_mantenimiento')->count(),
                'por_tipo' => Almacen::select('tipo_almacen', DB::raw('count(*) as total'))
                    ->groupBy('tipo_almacen')
                    ->get(),
                'por_estado' => Almacen::select('estado', DB::raw('count(*) as total'))
                    ->groupBy('estado')
                    ->get(),
                'total_productos_en_almacenes' => Producto::count(),
                'total_sucursales' => Sucursal::count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get warehouse capacity
     */
    public function capacidad(Request $request, string $id): JsonResponse
    {
        try {
            $almacen = Almacen::findOrFail($id);

            $productos = Producto::where('almacen_id', $id)->get();
            $totalProductos = $productos->count();
            $productosConStock = $productos->where('stock_actual', '>', 0)->count();
            $valorTotalInventario = $productos->sum(function ($producto) {
                return $producto->stock_actual * $producto->precio_costo;
            });

            $capacidad = [
                'capacidad_total' => $almacen->capacidad_total,
                'capacidad_utilizada' => $almacen->capacidad_utilizada,
                'capacidad_disponible' => $almacen->capacidad_total - $almacen->capacidad_utilizada,
                'porcentaje_utilizado' => $almacen->capacidad_total > 0 ? 
                    ($almacen->capacidad_utilizada / $almacen->capacidad_total) * 100 : 0,
                'total_productos' => $totalProductos,
                'productos_con_stock' => $productosConStock,
                'valor_total_inventario' => $valorTotalInventario,
                'unidad_medida' => $almacen->unidad_medida_capacidad,
            ];

            return response()->json([
                'success' => true,
                'data' => $capacidad
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener capacidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get warehouse movements
     */
    public function movimientos(Request $request, string $id): JsonResponse
    {
        try {
            $almacen = Almacen::findOrFail($id);

            $query = MovimientoInventario::where('almacen_id', $id)
                ->with(['producto', 'usuario']);

            // Filtros
            if ($request->has('tipo_movimiento') && $request->tipo_movimiento) {
                $query->where('tipo_movimiento', $request->tipo_movimiento);
            }

            if ($request->has('fecha_inicio') && $request->fecha_inicio) {
                $query->where('fecha_movimiento', '>=', $request->fecha_inicio);
            }

            if ($request->has('fecha_fin') && $request->fecha_fin) {
                $query->where('fecha_movimiento', '<=', $request->fecha_fin);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'fecha_movimiento');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $movimientos = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => [
                    'almacen' => $almacen,
                    'movimientos' => $movimientos->items(),
                    'pagination' => [
                        'current_page' => $movimientos->currentPage(),
                        'last_page' => $movimientos->lastPage(),
                        'per_page' => $movimientos->perPage(),
                        'total' => $movimientos->total(),
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimientos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available warehouse types
     */
    public function tiposAlmacenDisponibles(): JsonResponse
    {
        try {
            $tipos = [
                ['value' => 'principal', 'label' => 'Principal'],
                ['value' => 'secundario', 'label' => 'Secundario'],
                ['value' => 'transito', 'label' => 'Tránsito'],
                ['value' => 'temporario', 'label' => 'Temporario'],
            ];

            return response()->json([
                'success' => true,
                'data' => $tipos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tipos de almacén: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available capacity units
     */
    public function unidadesCapacidadDisponibles(): JsonResponse
    {
        try {
            $unidades = [
                ['value' => 'm2', 'label' => 'Metros Cuadrados'],
                ['value' => 'm3', 'label' => 'Metros Cúbicos'],
                ['value' => 'unidades', 'label' => 'Unidades'],
                ['value' => 'kg', 'label' => 'Kilogramos'],
                ['value' => 'l', 'label' => 'Litros'],
                ['value' => 'palets', 'label' => 'Palets'],
                ['value' => 'estantes', 'label' => 'Estantes'],
            ];

            return response()->json([
                'success' => true,
                'data' => $unidades
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener unidades de capacidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener personas disponibles para asignar como responsables (excluyendo farmacéuticos)
     */
    public function getPersonasDisponibles(): JsonResponse
    {
        try {
            Log::info('Obteniendo personas disponibles para almacenes');
            
            // Obtener el usuario autenticado para filtrar por licencia
            $user = Auth::guard('api')->user();
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            Log::info('Usuario autenticado:', [
                'user_id' => $user->id ?? 'no_auth',
                'licencia' => $licencia
            ]);

            $query = DB::table('personal_pos')
                ->select('id', 'nombre', 'apellido', 'email', 'telefono', 'role_id')
                ->where('is_active', 1)
                ->where('estado_laboral', 'activo');

            // Filtrar por licencia si está disponible
            if ($licencia) {
                $query->where('Id_Licencia', $licencia);
                Log::info('Filtrando por licencia:', ['licencia' => $licencia]);
            }

            $personas = $query->orderBy('nombre')
                ->orderBy('apellido')
                ->get();

            Log::info('Personas disponibles encontradas:', ['count' => $personas->count()]);

            return response()->json([
                'success' => true,
                'data' => $personas,
                'meta' => [
                    'total' => $personas->count(),
                    'licencia_filtro' => $licencia
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener personas disponibles:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener personas disponibles: ' . $e->getMessage()
            ], 500);
        }
    }
} 