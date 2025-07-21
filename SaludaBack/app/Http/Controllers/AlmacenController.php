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
            $query = Almacen::with(['sucursales', 'productos']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('codigo', 'LIKE', "%{$search}%")
                      ->orWhere('nombre', 'LIKE', "%{$search}%")
                      ->orWhere('descripcion', 'LIKE', "%{$search}%");
                });
            }

            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('tipo_almacen') && $request->tipo_almacen) {
                $query->where('tipo_almacen', $request->tipo_almacen);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $almacenes = $query->paginate($perPage);

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
            $validator = Validator::make($request->all(), [
                'codigo' => 'required|string|max:50|unique:almacenes',
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'tipo_almacen' => 'required|in:principal,secundario,transito,temporario',
                'direccion' => 'required|string|max:500',
                'ciudad' => 'required|string|max:100',
                'estado_provincia' => 'required|string|max:100',
                'codigo_postal' => 'nullable|string|max:20',
                'pais' => 'required|string|max:100',
                'telefono' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'responsable_id' => 'nullable|exists:users,id',
                'capacidad_total' => 'nullable|numeric|min:0',
                'capacidad_utilizada' => 'nullable|numeric|min:0',
                'unidad_medida_capacidad' => 'nullable|string|max:20',
                'configuracion_inventario' => 'nullable|json',
                'configuracion_seguridad' => 'nullable|json',
                'estado' => 'required|in:activo,inactivo,en_mantenimiento',
                'observaciones' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['creado_por'] = Auth::user()->name ?? 'Sistema';

            $almacen = Almacen::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Almacén creado exitosamente',
                'data' => $almacen->load(['sucursales', 'productos'])
            ], 201);

        } catch (\Exception $e) {
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
            $almacen = Almacen::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'codigo' => 'sometimes|required|string|max:50|unique:almacenes,codigo,' . $id,
                'nombre' => 'sometimes|required|string|max:255',
                'descripcion' => 'nullable|string',
                'tipo_almacen' => 'sometimes|required|in:principal,secundario,transito,temporario',
                'direccion' => 'sometimes|required|string|max:500',
                'ciudad' => 'sometimes|required|string|max:100',
                'estado_provincia' => 'sometimes|required|string|max:100',
                'codigo_postal' => 'nullable|string|max:20',
                'pais' => 'sometimes|required|string|max:100',
                'telefono' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'responsable_id' => 'nullable|exists:users,id',
                'capacidad_total' => 'nullable|numeric|min:0',
                'capacidad_utilizada' => 'nullable|numeric|min:0',
                'unidad_medida_capacidad' => 'nullable|string|max:20',
                'configuracion_inventario' => 'nullable|json',
                'configuracion_seguridad' => 'nullable|json',
                'estado' => 'sometimes|required|in:activo,inactivo,en_mantenimiento',
                'observaciones' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['actualizado_por'] = Auth::user()->name ?? 'Sistema';

            $almacen->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Almacén actualizado exitosamente',
                'data' => $almacen->load(['sucursales', 'productos'])
            ]);

        } catch (\Exception $e) {
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
} 