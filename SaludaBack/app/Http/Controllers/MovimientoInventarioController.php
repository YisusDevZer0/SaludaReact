<?php

namespace App\Http\Controllers;

use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\Sucursal;
use App\Models\Almacen;
use App\Models\Proveedor;
use App\Models\Cliente;
use App\Models\Venta;
use App\Models\Compra;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MovimientoInventarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = MovimientoInventario::with([
                'producto', 'sucursal', 'almacen', 'personal', 
                'proveedor', 'cliente', 'venta', 'compra'
            ]);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('numero_documento', 'LIKE', "%{$search}%")
                      ->orWhere('numero_lote', 'LIKE', "%{$search}%")
                      ->orWhere('observaciones', 'LIKE', "%{$search}%")
                      ->orWhereHas('producto', function ($producto) use ($search) {
                          $producto->where('nombre', 'LIKE', "%{$search}%");
                      });
                });
            }

            if ($request->has('tipo_movimiento') && $request->tipo_movimiento) {
                $query->where('tipo_movimiento', $request->tipo_movimiento);
            }

            if ($request->has('categoria_movimiento') && $request->categoria_movimiento) {
                $query->where('categoria_movimiento', $request->categoria_movimiento);
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

            if ($request->has('fecha_inicio') && $request->fecha_inicio) {
                $query->where('created_at', '>=', $request->fecha_inicio);
            }

            if ($request->has('fecha_fin') && $request->fecha_fin) {
                $query->where('created_at', '<=', $request->fecha_fin);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $movimientos = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $movimientos->items(),
                'pagination' => [
                    'current_page' => $movimientos->currentPage(),
                    'last_page' => $movimientos->lastPage(),
                    'per_page' => $movimientos->perPage(),
                    'total' => $movimientos->total(),
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $validator = Validator::make($request->all(), [
                'producto_id' => 'required|exists:productos,id',
                'sucursal_id' => 'required|exists:sucursales,id',
                'almacen_id' => 'nullable|exists:almacenes,Almacen_ID',
                'personal_id' => 'nullable|exists:personal_pos,id',
                'tipo_movimiento' => 'required|in:entrada_compra,entrada_devolucion,entrada_ajuste,entrada_transferencia,salida_venta,salida_devolucion,salida_ajuste,salida_transferencia,salida_merma,salida_vencimiento,reserva,liberacion_reserva',
                'categoria_movimiento' => 'required|in:entrada,salida,ajuste,reserva',
                'cantidad' => 'required|integer|min:1',
                'cantidad_anterior' => 'required|integer|min:0',
                'cantidad_nueva' => 'required|integer|min:0',
                'costo_unitario' => 'nullable|numeric|min:0',
                'costo_total' => 'nullable|numeric|min:0',
                'numero_lote' => 'nullable|string|max:50',
                'fecha_fabricacion' => 'nullable|date',
                'fecha_vencimiento' => 'nullable|date|after:fecha_fabricacion',
                'lote_proveedor' => 'nullable|string|max:50',
                'numero_documento' => 'nullable|string|max:50',
                'tipo_documento' => 'nullable|string|max:50',
                'proveedor_id' => 'nullable|exists:proveedores,id',
                'cliente_id' => 'nullable|exists:clientes,id',
                'venta_id' => 'nullable|exists:ventas,id',
                'compra_id' => 'nullable|exists:compras,id',
                'ubicacion_origen' => 'nullable|string|max:100',
                'ubicacion_destino' => 'nullable|string|max:100',
                'observaciones' => 'nullable|string',
                'estado' => 'required|in:pendiente,confirmado,anulado,reversado',
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

            // Calcular costo total si no se proporciona
            if (!isset($data['costo_total']) && isset($data['costo_unitario'])) {
                $data['costo_total'] = $data['costo_unitario'] * $data['cantidad'];
            }

            $movimiento = MovimientoInventario::create($data);

            // Actualizar inventario si el movimiento está confirmado
            if ($movimiento->estado === 'confirmado') {
                $this->actualizarInventario($movimiento);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Movimiento de inventario creado exitosamente',
                'data' => $movimiento->load([
                    'producto', 'sucursal', 'almacen', 'personal', 
                    'proveedor', 'cliente', 'venta', 'compra'
                ])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear movimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $movimiento = MovimientoInventario::with([
                'producto', 'sucursal', 'almacen', 'personal', 
                'proveedor', 'cliente', 'venta', 'compra'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $movimiento
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Movimiento no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $movimiento = MovimientoInventario::findOrFail($id);

            // No permitir editar movimientos confirmados
            if ($movimiento->estado === 'confirmado') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede editar un movimiento confirmado'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'producto_id' => 'sometimes|required|exists:productos,id',
                'sucursal_id' => 'sometimes|required|exists:sucursales,id',
                'almacen_id' => 'nullable|exists:almacenes,Almacen_ID',
                'personal_id' => 'nullable|exists:personal_pos,id',
                'tipo_movimiento' => 'sometimes|required|in:entrada_compra,entrada_devolucion,entrada_ajuste,entrada_transferencia,salida_venta,salida_devolucion,salida_ajuste,salida_transferencia,salida_merma,salida_vencimiento,reserva,liberacion_reserva',
                'categoria_movimiento' => 'sometimes|required|in:entrada,salida,ajuste,reserva',
                'cantidad' => 'sometimes|required|integer|min:1',
                'cantidad_anterior' => 'sometimes|required|integer|min:0',
                'cantidad_nueva' => 'sometimes|required|integer|min:0',
                'costo_unitario' => 'nullable|numeric|min:0',
                'costo_total' => 'nullable|numeric|min:0',
                'numero_lote' => 'nullable|string|max:50',
                'fecha_fabricacion' => 'nullable|date',
                'fecha_vencimiento' => 'nullable|date|after:fecha_fabricacion',
                'lote_proveedor' => 'nullable|string|max:50',
                'numero_documento' => 'nullable|string|max:50',
                'tipo_documento' => 'nullable|string|max:50',
                'proveedor_id' => 'nullable|exists:proveedores,id',
                'cliente_id' => 'nullable|exists:clientes,id',
                'venta_id' => 'nullable|exists:ventas,id',
                'compra_id' => 'nullable|exists:compras,id',
                'ubicacion_origen' => 'nullable|string|max:100',
                'ubicacion_destino' => 'nullable|string|max:100',
                'observaciones' => 'nullable|string',
                'estado' => 'sometimes|required|in:pendiente,confirmado,anulado,reversado',
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

            // Calcular costo total si no se proporciona
            if (!isset($data['costo_total']) && isset($data['costo_unitario'])) {
                $data['costo_total'] = $data['costo_unitario'] * ($data['cantidad'] ?? $movimiento->cantidad);
            }

            $movimiento->update($data);

            // Actualizar inventario si el movimiento está confirmado
            if ($movimiento->estado === 'confirmado') {
                $this->actualizarInventario($movimiento);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Movimiento actualizado exitosamente',
                'data' => $movimiento->load([
                    'producto', 'sucursal', 'almacen', 'personal', 
                    'proveedor', 'cliente', 'venta', 'compra'
                ])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar movimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $movimiento = MovimientoInventario::findOrFail($id);

            if ($movimiento->estado === 'confirmado') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar un movimiento confirmado'
                ], 400);
            }

            $movimiento->delete();

            return response()->json([
                'success' => true,
                'message' => 'Movimiento eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar movimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm movement
     */
    public function confirmar(Request $request, string $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $movimiento = MovimientoInventario::findOrFail($id);

            if ($movimiento->estado !== 'pendiente') {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo se pueden confirmar movimientos pendientes'
                ], 400);
            }

            $movimiento->update([
                'estado' => 'confirmado',
                'fecha_confirmacion' => now(),
                'confirmado_por' => Auth::id(),
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            // Actualizar inventario
            $this->actualizarInventario($movimiento);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Movimiento confirmado exitosamente',
                'data' => $movimiento->load([
                    'producto', 'sucursal', 'almacen', 'personal', 
                    'proveedor', 'cliente', 'venta', 'compra'
                ])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al confirmar movimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel movement
     */
    public function anular(Request $request, string $id): JsonResponse
    {
        try {
            $movimiento = MovimientoInventario::findOrFail($id);

            if ($movimiento->estado === 'anulado') {
                return response()->json([
                    'success' => false,
                    'message' => 'El movimiento ya está anulado'
                ], 400);
            }

            $movimiento->update([
                'estado' => 'anulado',
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Movimiento anulado exitosamente',
                'data' => $movimiento->load([
                    'producto', 'sucursal', 'almacen', 'personal', 
                    'proveedor', 'cliente', 'venta', 'compra'
                ])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al anular movimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update inventory based on movement
     */
    private function actualizarInventario(MovimientoInventario $movimiento)
    {
        // Buscar o crear registro de inventario
        $inventario = \App\Models\Inventario::where('producto_id', $movimiento->producto_id)
            ->where('sucursal_id', $movimiento->sucursal_id)
            ->where('numero_lote', $movimiento->numero_lote)
            ->first();

        if (!$inventario) {
            $inventario = \App\Models\Inventario::create([
                'producto_id' => $movimiento->producto_id,
                'sucursal_id' => $movimiento->sucursal_id,
                'almacen_id' => $movimiento->almacen_id,
                'stock_actual' => 0,
                'stock_reservado' => 0,
                'stock_disponible' => 0,
                'stock_minimo' => 0,
                'numero_lote' => $movimiento->numero_lote,
                'fecha_fabricacion' => $movimiento->fecha_fabricacion,
                'fecha_vencimiento' => $movimiento->fecha_vencimiento,
                'lote_proveedor' => $movimiento->lote_proveedor,
                'estado' => 'disponible',
                'activo' => true,
                'creado_por' => Auth::user()->name ?? 'Sistema'
            ]);
        }

        // Actualizar stock según el tipo de movimiento
        switch ($movimiento->tipo_movimiento) {
            case 'entrada_compra':
            case 'entrada_devolucion':
            case 'entrada_ajuste':
            case 'entrada_transferencia':
                $inventario->stock_actual += $movimiento->cantidad;
                break;
            case 'salida_venta':
            case 'salida_devolucion':
            case 'salida_ajuste':
            case 'salida_transferencia':
            case 'salida_merma':
            case 'salida_vencimiento':
                $inventario->stock_actual -= $movimiento->cantidad;
                break;
            case 'reserva':
                $inventario->stock_reservado += $movimiento->cantidad;
                break;
            case 'liberacion_reserva':
                $inventario->stock_reservado -= $movimiento->cantidad;
                break;
        }

        // Recalcular stock disponible
        $inventario->stock_disponible = $inventario->stock_actual - $inventario->stock_reservado;

        // Actualizar información de lote si es necesario
        if ($movimiento->numero_lote && !$inventario->numero_lote) {
            $inventario->numero_lote = $movimiento->numero_lote;
            $inventario->fecha_fabricacion = $movimiento->fecha_fabricacion;
            $inventario->fecha_vencimiento = $movimiento->fecha_vencimiento;
            $inventario->lote_proveedor = $movimiento->lote_proveedor;
        }

        // Actualizar costos si se proporcionan
        if ($movimiento->costo_unitario) {
            $inventario->costo_unitario = $movimiento->costo_unitario;
            $inventario->costo_total = $movimiento->costo_unitario * $inventario->stock_actual;
        }

        // Actualizar información de auditoría
        $inventario->ultimo_movimiento = now();
        $inventario->ultimo_movimiento_tipo = $movimiento->tipo_movimiento;
        $inventario->actualizado_por = Auth::user()->name ?? 'Sistema';
        $inventario->save();
    }

    /**
     * Get movement statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_movimientos' => MovimientoInventario::count(),
                'movimientos_hoy' => MovimientoInventario::whereDate('created_at', today())->count(),
                'movimientos_mes' => MovimientoInventario::whereMonth('created_at', now()->month)->count(),
                'movimientos_anio' => MovimientoInventario::whereYear('created_at', now()->year)->count(),
                'por_tipo' => MovimientoInventario::select('tipo_movimiento', DB::raw('count(*) as total'))
                    ->groupBy('tipo_movimiento')
                    ->get(),
                'por_categoria' => MovimientoInventario::select('categoria_movimiento', DB::raw('count(*) as total'))
                    ->groupBy('categoria_movimiento')
                    ->get(),
                'por_estado' => MovimientoInventario::select('estado', DB::raw('count(*) as total'))
                    ->groupBy('estado')
                    ->get(),
                'total_entradas' => MovimientoInventario::where('categoria_movimiento', 'entrada')->sum('cantidad'),
                'total_salidas' => MovimientoInventario::where('categoria_movimiento', 'salida')->sum('cantidad'),
                'valor_total_movimientos' => MovimientoInventario::sum('costo_total'),
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
     * Get movements by product
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

            $movimientos = MovimientoInventario::where('producto_id', $productoId)
                ->with([
                    'producto', 'sucursal', 'almacen', 'personal', 
                    'proveedor', 'cliente', 'venta', 'compra'
                ])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $movimientos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimientos por producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get movements by branch
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

            $movimientos = MovimientoInventario::where('sucursal_id', $sucursalId)
                ->with([
                    'producto', 'sucursal', 'almacen', 'personal', 
                    'proveedor', 'cliente', 'venta', 'compra'
                ])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $movimientos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimientos por sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available movement types
     */
    public function tiposMovimientoDisponibles(): JsonResponse
    {
        try {
            $tipos = [
                ['value' => 'entrada_compra', 'label' => 'Entrada por Compra'],
                ['value' => 'entrada_devolucion', 'label' => 'Entrada por Devolución'],
                ['value' => 'entrada_ajuste', 'label' => 'Entrada por Ajuste'],
                ['value' => 'entrada_transferencia', 'label' => 'Entrada por Transferencia'],
                ['value' => 'salida_venta', 'label' => 'Salida por Venta'],
                ['value' => 'salida_devolucion', 'label' => 'Salida por Devolución'],
                ['value' => 'salida_ajuste', 'label' => 'Salida por Ajuste'],
                ['value' => 'salida_transferencia', 'label' => 'Salida por Transferencia'],
                ['value' => 'salida_merma', 'label' => 'Salida por Merma'],
                ['value' => 'salida_vencimiento', 'label' => 'Salida por Vencimiento'],
                ['value' => 'reserva', 'label' => 'Reserva'],
                ['value' => 'liberacion_reserva', 'label' => 'Liberación de Reserva'],
            ];

            return response()->json([
                'success' => true,
                'data' => $tipos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tipos de movimiento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available movement categories
     */
    public function categoriasMovimientoDisponibles(): JsonResponse
    {
        try {
            $categorias = [
                ['value' => 'entrada', 'label' => 'Entrada'],
                ['value' => 'salida', 'label' => 'Salida'],
                ['value' => 'ajuste', 'label' => 'Ajuste'],
                ['value' => 'reserva', 'label' => 'Reserva'],
            ];

            return response()->json([
                'success' => true,
                'data' => $categorias
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener categorías de movimiento: ' . $e->getMessage()
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
                ['value' => 'pendiente', 'label' => 'Pendiente'],
                ['value' => 'confirmado', 'label' => 'Confirmado'],
                ['value' => 'anulado', 'label' => 'Anulado'],
                ['value' => 'reversado', 'label' => 'Reversado'],
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