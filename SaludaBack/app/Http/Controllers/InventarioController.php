<?php

namespace App\Http\Controllers;

use App\Models\Inventario;
use App\Models\Producto;
use App\Models\Sucursal;
use App\Models\Almacen;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class InventarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Inventario::with(['producto', 'sucursal', 'almacen']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('numero_lote', 'LIKE', "%{$search}%")
                      ->orWhere('lote_proveedor', 'LIKE', "%{$search}%")
                      ->orWhereHas('producto', function ($producto) use ($search) {
                          $producto->where('nombre', 'LIKE', "%{$search}%")
                                  ->orWhere('codigo', 'LIKE', "%{$search}%");
                      });
                });
            }

            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('producto_id') && $request->producto_id) {
                $query->where('producto_id', $request->producto_id);
            }

            if ($request->has('sucursal_id') && $request->sucursal_id) {
                $query->where('sucursal_id', $request->sucursal_id);
            }

            if ($request->has('almacen_id') && $request->almacen_id) {
                $query->where('almacen_id', $request->almacen_id);
            }

            if ($request->has('stock_bajo') && $request->stock_bajo) {
                $query->whereRaw('stock_actual <= stock_minimo');
            }

            if ($request->has('sin_stock') && $request->sin_stock) {
                $query->where('stock_actual', '<=', 0);
            }

            if ($request->has('por_vencer') && $request->por_vencer) {
                $fechaLimite = now()->addDays(30);
                $query->where('fecha_vencimiento', '<=', $fechaLimite)
                      ->where('fecha_vencimiento', '>=', now());
            }

            if ($request->has('vencidos') && $request->vencidos) {
                $query->where('fecha_vencimiento', '<', now());
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $inventario = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $inventario->items(),
                'pagination' => [
                    'current_page' => $inventario->currentPage(),
                    'last_page' => $inventario->lastPage(),
                    'per_page' => $inventario->perPage(),
                    'total' => $inventario->total(),
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'producto_id' => 'required|exists:productos,id',
                'sucursal_id' => 'required|exists:sucursales,id',
                'almacen_id' => 'nullable|exists:almacenes,Almacen_ID',
                'stock_actual' => 'required|integer|min:0',
                'stock_reservado' => 'nullable|integer|min:0',
                'stock_disponible' => 'nullable|integer|min:0',
                'stock_minimo' => 'required|integer|min:0',
                'stock_maximo' => 'nullable|integer|min:0',
                'numero_lote' => 'nullable|string|max:50',
                'fecha_fabricacion' => 'nullable|date',
                'fecha_vencimiento' => 'nullable|date|after:fecha_fabricacion',
                'lote_proveedor' => 'nullable|string|max:50',
                'ubicacion_estante' => 'nullable|string|max:50',
                'ubicacion_pasillo' => 'nullable|string|max:50',
                'ubicacion_nivel' => 'nullable|string|max:50',
                'ubicacion_posicion' => 'nullable|string|max:50',
                'ubicacion_descripcion' => 'nullable|string',
                'costo_unitario' => 'nullable|numeric|min:0',
                'costo_total' => 'nullable|numeric|min:0',
                'valor_mercado' => 'nullable|numeric|min:0',
                'margen_ganancia' => 'nullable|numeric|min:0|max:100',
                'estado' => 'required|in:disponible,reservado,en_transito,en_cuarentena,defectuoso,vencido',
                'activo' => 'boolean',
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

            // Calcular stock disponible si no se proporciona
            if (!isset($data['stock_disponible'])) {
                $data['stock_disponible'] = $data['stock_actual'] - ($data['stock_reservado'] ?? 0);
            }

            // Calcular costo total si no se proporciona
            if (!isset($data['costo_total']) && isset($data['costo_unitario'])) {
                $data['costo_total'] = $data['costo_unitario'] * $data['stock_actual'];
            }

            $inventario = Inventario::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Registro de inventario creado exitosamente',
                'data' => $inventario->load(['producto', 'sucursal', 'almacen'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear registro de inventario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $inventario = Inventario::with(['producto', 'sucursal', 'almacen'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $inventario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registro de inventario no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $inventario = Inventario::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'producto_id' => 'sometimes|required|exists:productos,id',
                'sucursal_id' => 'sometimes|required|exists:sucursales,id',
                'almacen_id' => 'nullable|exists:almacenes,Almacen_ID',
                'stock_actual' => 'sometimes|required|integer|min:0',
                'stock_reservado' => 'nullable|integer|min:0',
                'stock_disponible' => 'nullable|integer|min:0',
                'stock_minimo' => 'sometimes|required|integer|min:0',
                'stock_maximo' => 'nullable|integer|min:0',
                'numero_lote' => 'nullable|string|max:50',
                'fecha_fabricacion' => 'nullable|date',
                'fecha_vencimiento' => 'nullable|date|after:fecha_fabricacion',
                'lote_proveedor' => 'nullable|string|max:50',
                'ubicacion_estante' => 'nullable|string|max:50',
                'ubicacion_pasillo' => 'nullable|string|max:50',
                'ubicacion_nivel' => 'nullable|string|max:50',
                'ubicacion_posicion' => 'nullable|string|max:50',
                'ubicacion_descripcion' => 'nullable|string',
                'costo_unitario' => 'nullable|numeric|min:0',
                'costo_total' => 'nullable|numeric|min:0',
                'valor_mercado' => 'nullable|numeric|min:0',
                'margen_ganancia' => 'nullable|numeric|min:0|max:100',
                'estado' => 'sometimes|required|in:disponible,reservado,en_transito,en_cuarentena,defectuoso,vencido',
                'activo' => 'boolean',
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

            // Calcular stock disponible si no se proporciona
            if (!isset($data['stock_disponible']) && isset($data['stock_actual'])) {
                $data['stock_disponible'] = $data['stock_actual'] - ($data['stock_reservado'] ?? $inventario->stock_reservado);
            }

            // Calcular costo total si no se proporciona
            if (!isset($data['costo_total']) && isset($data['costo_unitario'])) {
                $data['costo_total'] = $data['costo_unitario'] * ($data['stock_actual'] ?? $inventario->stock_actual);
            }

            $inventario->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Registro de inventario actualizado exitosamente',
                'data' => $inventario->load(['producto', 'sucursal', 'almacen'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar registro de inventario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $inventario = Inventario::findOrFail($id);

            if ($inventario->stock_actual > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar un registro con stock disponible'
                ], 400);
            }

            $inventario->delete();

            return response()->json([
                'success' => true,
                'message' => 'Registro de inventario eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar registro de inventario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajustar stock
     */
    public function ajustarStock(Request $request, string $id): JsonResponse
    {
        try {
            $inventario = Inventario::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'cantidad' => 'required|integer',
                'tipo_ajuste' => 'required|in:entrada,salida,reserva,liberacion',
                'motivo' => 'required|string|max:255',
                'observaciones' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $stockAnterior = $inventario->stock_actual;
            $stockReservadoAnterior = $inventario->stock_reservado;

            switch ($request->tipo_ajuste) {
                case 'entrada':
                    $inventario->stock_actual += $request->cantidad;
                    break;
                case 'salida':
                    if ($inventario->stock_actual < $request->cantidad) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Stock insuficiente para realizar la salida'
                        ], 400);
                    }
                    $inventario->stock_actual -= $request->cantidad;
                    break;
                case 'reserva':
                    if ($inventario->stock_disponible < $request->cantidad) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Stock disponible insuficiente para la reserva'
                        ], 400);
                    }
                    $inventario->stock_reservado += $request->cantidad;
                    break;
                case 'liberacion':
                    if ($inventario->stock_reservado < $request->cantidad) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Stock reservado insuficiente para la liberación'
                        ], 400);
                    }
                    $inventario->stock_reservado -= $request->cantidad;
                    break;
            }

            // Recalcular stock disponible
            $inventario->stock_disponible = $inventario->stock_actual - $inventario->stock_reservado;

            // Recalcular costo total
            if ($inventario->costo_unitario) {
                $inventario->costo_total = $inventario->costo_unitario * $inventario->stock_actual;
            }

            $inventario->observaciones = $inventario->observaciones . "\n" . 
                date('Y-m-d H:i:s') . " - " . $request->motivo . " (" . $request->tipo_ajuste . ": " . $request->cantidad . ")";
            
            $inventario->ultimo_movimiento = now();
            $inventario->ultimo_movimiento_tipo = $request->tipo_ajuste;
            $inventario->actualizado_por = Auth::user()->name ?? 'Sistema';
            $inventario->save();

            return response()->json([
                'success' => true,
                'message' => 'Stock ajustado exitosamente',
                'data' => [
                    'inventario' => $inventario->load(['producto', 'sucursal', 'almacen']),
                    'ajuste' => [
                        'stock_anterior' => $stockAnterior,
                        'stock_actual' => $inventario->stock_actual,
                        'stock_reservado_anterior' => $stockReservadoAnterior,
                        'stock_reservado_actual' => $inventario->stock_reservado,
                        'diferencia' => $inventario->stock_actual - $stockAnterior
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al ajustar stock: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get inventory statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_registros' => Inventario::count(),
                'productos_con_stock' => Inventario::where('stock_actual', '>', 0)->count(),
                'productos_sin_stock' => Inventario::where('stock_actual', '<=', 0)->count(),
                'productos_stock_bajo' => Inventario::whereRaw('stock_actual <= stock_minimo')->count(),
                'productos_reservados' => Inventario::where('stock_reservado', '>', 0)->count(),
                'productos_por_vencer' => Inventario::where('fecha_vencimiento', '<=', now()->addDays(30))
                    ->where('fecha_vencimiento', '>=', now())->count(),
                'productos_vencidos' => Inventario::where('fecha_vencimiento', '<', now())->count(),
                'valor_total_inventario' => Inventario::sum('costo_total'),
                'valor_total_mercado' => Inventario::sum('valor_mercado'),
                'por_estado' => Inventario::select('estado', DB::raw('count(*) as total'))
                    ->groupBy('estado')
                    ->get(),
                'por_sucursal' => Inventario::select('sucursal_id', DB::raw('count(*) as total'))
                    ->with('sucursal:id,nombre')
                    ->groupBy('sucursal_id')
                    ->get(),
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
     * Get inventory by product
     */
    public function getPorProducto(Request $request): JsonResponse
    {
        try {
            $productoId = $request->get('producto_id');
            
            if (!$productoId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de producto requerido'
                ], 400);
            }

            $inventario = Inventario::where('producto_id', $productoId)
                ->with(['producto', 'sucursal', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $inventario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener inventario por producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get inventory by branch
     */
    public function getPorSucursal(Request $request): JsonResponse
    {
        try {
            $sucursalId = $request->get('sucursal_id');
            
            if (!$sucursalId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de sucursal requerido'
                ], 400);
            }

            $inventario = Inventario::where('sucursal_id', $sucursalId)
                ->with(['producto', 'sucursal', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $inventario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener inventario por sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products with low stock
     */
    public function getConStockBajo(): JsonResponse
    {
        try {
            $inventario = Inventario::whereRaw('stock_actual <= stock_minimo')
                ->where('stock_actual', '>', 0)
                ->with(['producto', 'sucursal', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $inventario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos con stock bajo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products without stock
     */
    public function getSinStock(): JsonResponse
    {
        try {
            $inventario = Inventario::where('stock_actual', '<=', 0)
                ->with(['producto', 'sucursal', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $inventario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos sin stock: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products about to expire
     */
    public function getPorVencer(): JsonResponse
    {
        try {
            $fechaLimite = now()->addDays(30);
            
            $inventario = Inventario::where('fecha_vencimiento', '<=', $fechaLimite)
                ->where('fecha_vencimiento', '>=', now())
                ->where('stock_actual', '>', 0)
                ->with(['producto', 'sucursal', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $inventario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos por vencer: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get expired products
     */
    public function getVencidos(): JsonResponse
    {
        try {
            $inventario = Inventario::where('fecha_vencimiento', '<', now())
                ->where('stock_actual', '>', 0)
                ->with(['producto', 'sucursal', 'almacen'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $inventario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos vencidos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available states
     */
    public function estadosDisponibles(): JsonResponse
    {
        try {
            $estados = [
                ['value' => 'disponible', 'label' => 'Disponible'],
                ['value' => 'reservado', 'label' => 'Reservado'],
                ['value' => 'en_transito', 'label' => 'En Tránsito'],
                ['value' => 'en_cuarentena', 'label' => 'En Cuarentena'],
                ['value' => 'defectuoso', 'label' => 'Defectuoso'],
                ['value' => 'vencido', 'label' => 'Vencido'],
            ];

            return response()->json([
                'success' => true,
                'data' => $estados
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estados: ' . $e->getMessage()
            ], 500);
        }
    }
} 