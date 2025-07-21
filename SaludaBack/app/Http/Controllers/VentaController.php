<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\Cliente;
use App\Models\User;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class VentaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Venta::with(['cliente', 'vendedor', 'detalles.producto']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('numero_factura', 'LIKE', "%{$search}%")
                      ->orWhere('codigo_venta', 'LIKE', "%{$search}%")
                      ->orWhereHas('cliente', function ($cliente) use ($search) {
                          $cliente->where('nombre', 'LIKE', "%{$search}%")
                                 ->orWhere('apellido', 'LIKE', "%{$search}%")
                                 ->orWhere('razon_social', 'LIKE', "%{$search}%");
                      });
                });
            }

            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('cliente_id') && $request->cliente_id) {
                $query->where('cliente_id', $request->cliente_id);
            }

            if ($request->has('vendedor_id') && $request->vendedor_id) {
                $query->where('vendedor_id', $request->vendedor_id);
            }

            if ($request->has('fecha_inicio') && $request->fecha_inicio) {
                $query->where('fecha_venta', '>=', $request->fecha_inicio);
            }

            if ($request->has('fecha_fin') && $request->fecha_fin) {
                $query->where('fecha_venta', '<=', $request->fecha_fin);
            }

            if ($request->has('tipo_pago') && $request->tipo_pago) {
                $query->where('tipo_pago', $request->tipo_pago);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'fecha_venta');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $ventas = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $ventas->items(),
                'pagination' => [
                    'current_page' => $ventas->currentPage(),
                    'last_page' => $ventas->lastPage(),
                    'per_page' => $ventas->perPage(),
                    'total' => $ventas->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ventas: ' . $e->getMessage()
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
                'cliente_id' => 'required|exists:clientes,id',
                'vendedor_id' => 'required|exists:users,id',
                'numero_factura' => 'nullable|string|max:50|unique:ventas',
                'codigo_venta' => 'nullable|string|max:50|unique:ventas',
                'fecha_venta' => 'required|date',
                'fecha_vencimiento' => 'nullable|date|after_or_equal:fecha_venta',
                'tipo_venta' => 'required|in:contado,credito,consignacion',
                'tipo_pago' => 'required|in:efectivo,tarjeta,transferencia,cheque,otro',
                'subtotal' => 'required|numeric|min:0',
                'descuento' => 'nullable|numeric|min:0',
                'impuesto_iva' => 'required|numeric|min:0',
                'impuesto_otros' => 'nullable|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'saldo_pendiente' => 'nullable|numeric|min:0',
                'estado' => 'required|in:pendiente,confirmada,anulada,devuelta',
                'observaciones' => 'nullable|string',
                'notas_internas' => 'nullable|string',
                'detalles' => 'required|array|min:1',
                'detalles.*.producto_id' => 'required|exists:productos,id',
                'detalles.*.cantidad' => 'required|numeric|min:0.01',
                'detalles.*.precio_unitario' => 'required|numeric|min:0',
                'detalles.*.descuento' => 'nullable|numeric|min:0',
                'detalles.*.impuesto_iva' => 'required|numeric|min:0',
                'detalles.*.subtotal' => 'required|numeric|min:0',
                'detalles.*.total' => 'required|numeric|min:0',
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

            // Generar código de venta si no se proporciona
            if (empty($data['codigo_venta'])) {
                $data['codigo_venta'] = $this->generarCodigoVenta();
            }

            // Generar número de factura si no se proporciona
            if (empty($data['numero_factura'])) {
                $data['numero_factura'] = $this->generarNumeroFactura();
            }

            // Calcular saldo pendiente si es venta a crédito
            if ($data['tipo_venta'] === 'credito') {
                $data['saldo_pendiente'] = $data['total'];
            }

            $detalles = $data['detalles'];
            unset($data['detalles']);

            $venta = Venta::create($data);

            // Crear detalles de venta
            foreach ($detalles as $detalle) {
                $venta->detalles()->create($detalle);
                
                // Actualizar stock del producto
                $producto = Producto::find($detalle['producto_id']);
                if ($producto) {
                    $producto->stock_actual -= $detalle['cantidad'];
                    $producto->save();
                }
            }

            // Actualizar estadísticas del cliente
            $cliente = Cliente::find($data['cliente_id']);
            if ($cliente) {
                $cliente->total_compras += $data['total'];
                $cliente->cantidad_compras += 1;
                $cliente->promedio_compra = $cliente->total_compras / $cliente->cantidad_compras;
                $cliente->fecha_ultima_compra = $data['fecha_venta'];
                $cliente->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venta creada exitosamente',
                'data' => $venta->load(['cliente', 'vendedor', 'detalles.producto'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear venta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $venta = Venta::with(['cliente', 'vendedor', 'detalles.producto'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $venta
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Venta no encontrada'
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

            $venta = Venta::findOrFail($id);

            // No permitir editar ventas confirmadas o anuladas
            if (in_array($venta->estado, ['confirmada', 'anulada'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede editar una venta confirmada o anulada'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'cliente_id' => 'sometimes|required|exists:clientes,id',
                'vendedor_id' => 'sometimes|required|exists:users,id',
                'numero_factura' => 'nullable|string|max:50|unique:ventas,numero_factura,' . $id,
                'codigo_venta' => 'nullable|string|max:50|unique:ventas,codigo_venta,' . $id,
                'fecha_venta' => 'sometimes|required|date',
                'fecha_vencimiento' => 'nullable|date|after_or_equal:fecha_venta',
                'tipo_venta' => 'sometimes|required|in:contado,credito,consignacion',
                'tipo_pago' => 'sometimes|required|in:efectivo,tarjeta,transferencia,cheque,otro',
                'subtotal' => 'sometimes|required|numeric|min:0',
                'descuento' => 'nullable|numeric|min:0',
                'impuesto_iva' => 'sometimes|required|numeric|min:0',
                'impuesto_otros' => 'nullable|numeric|min:0',
                'total' => 'sometimes|required|numeric|min:0',
                'saldo_pendiente' => 'nullable|numeric|min:0',
                'estado' => 'sometimes|required|in:pendiente,confirmada,anulada,devuelta',
                'observaciones' => 'nullable|string',
                'notas_internas' => 'nullable|string',
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

            $venta->update($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venta actualizada exitosamente',
                'data' => $venta->load(['cliente', 'vendedor', 'detalles.producto'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar venta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $venta = Venta::with('detalles')->findOrFail($id);

            // No permitir eliminar ventas confirmadas
            if ($venta->estado === 'confirmada') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar una venta confirmada'
                ], 400);
            }

            // Restaurar stock de productos
            foreach ($venta->detalles as $detalle) {
                $producto = Producto::find($detalle->producto_id);
                if ($producto) {
                    $producto->stock_actual += $detalle->cantidad;
                    $producto->save();
                }
            }

            // Actualizar estadísticas del cliente
            $cliente = Cliente::find($venta->cliente_id);
            if ($cliente) {
                $cliente->total_compras -= $venta->total;
                $cliente->cantidad_compras -= 1;
                if ($cliente->cantidad_compras > 0) {
                    $cliente->promedio_compra = $cliente->total_compras / $cliente->cantidad_compras;
                } else {
                    $cliente->promedio_compra = 0;
                }
                $cliente->save();
            }

            $venta->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venta eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar venta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm sale
     */
    public function confirmar(Request $request, string $id): JsonResponse
    {
        try {
            $venta = Venta::findOrFail($id);

            if ($venta->estado !== 'pendiente') {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo se pueden confirmar ventas pendientes'
                ], 400);
            }

            $venta->update([
                'estado' => 'confirmada',
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Venta confirmada exitosamente',
                'data' => $venta->load(['cliente', 'vendedor', 'detalles.producto'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al confirmar venta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel sale
     */
    public function anular(Request $request, string $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $venta = Venta::with('detalles')->findOrFail($id);

            if ($venta->estado === 'anulada') {
                return response()->json([
                    'success' => false,
                    'message' => 'La venta ya está anulada'
                ], 400);
            }

            // Restaurar stock de productos
            foreach ($venta->detalles as $detalle) {
                $producto = Producto::find($detalle->producto_id);
                if ($producto) {
                    $producto->stock_actual += $detalle->cantidad;
                    $producto->save();
                }
            }

            // Actualizar estadísticas del cliente
            $cliente = Cliente::find($venta->cliente_id);
            if ($cliente) {
                $cliente->total_compras -= $venta->total;
                $cliente->cantidad_compras -= 1;
                if ($cliente->cantidad_compras > 0) {
                    $cliente->promedio_compra = $cliente->total_compras / $cliente->cantidad_compras;
                } else {
                    $cliente->promedio_compra = 0;
                }
                $cliente->save();
            }

            $venta->update([
                'estado' => 'anulada',
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venta anulada exitosamente',
                'data' => $venta->load(['cliente', 'vendedor', 'detalles.producto'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al anular venta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for sales
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_ventas' => Venta::count(),
                'ventas_hoy' => Venta::whereDate('fecha_venta', today())->count(),
                'ventas_mes' => Venta::whereMonth('fecha_venta', now()->month)->count(),
                'ventas_anio' => Venta::whereYear('fecha_venta', now()->year)->count(),
                'total_facturado' => Venta::sum('total'),
                'total_facturado_hoy' => Venta::whereDate('fecha_venta', today())->sum('total'),
                'total_facturado_mes' => Venta::whereMonth('fecha_venta', now()->month)->sum('total'),
                'total_facturado_anio' => Venta::whereYear('fecha_venta', now()->year)->sum('total'),
                'promedio_venta' => Venta::avg('total'),
                'ventas_pendientes' => Venta::where('estado', 'pendiente')->count(),
                'ventas_confirmadas' => Venta::where('estado', 'confirmada')->count(),
                'ventas_anuladas' => Venta::where('estado', 'anulada')->count(),
                'por_tipo_venta' => Venta::select('tipo_venta', DB::raw('count(*) as total'))
                    ->groupBy('tipo_venta')
                    ->get(),
                'por_tipo_pago' => Venta::select('tipo_pago', DB::raw('count(*) as total'))
                    ->groupBy('tipo_pago')
                    ->get(),
                'por_estado' => Venta::select('estado', DB::raw('count(*) as total'))
                    ->groupBy('estado')
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
     * Get sales by date range
     */
    public function getPorRango(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after_or_equal:fecha_inicio'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $ventas = Venta::whereBetween('fecha_venta', [
                $request->fecha_inicio,
                $request->fecha_fin
            ])
            ->with(['cliente', 'vendedor', 'detalles.producto'])
            ->orderBy('fecha_venta', 'desc')
            ->get();

            return response()->json([
                'success' => true,
                'data' => $ventas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ventas por rango: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sales by client
     */
    public function getPorCliente(Request $request): JsonResponse
    {
        try {
            $clienteId = $request->get('cliente_id');
            
            if (!$clienteId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de cliente requerido'
                ], 400);
            }

            $ventas = Venta::where('cliente_id', $clienteId)
                ->with(['cliente', 'vendedor', 'detalles.producto'])
                ->orderBy('fecha_venta', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $ventas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ventas por cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sales by seller
     */
    public function getPorVendedor(Request $request): JsonResponse
    {
        try {
            $vendedorId = $request->get('vendedor_id');
            
            if (!$vendedorId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de vendedor requerido'
                ], 400);
            }

            $ventas = Venta::where('vendedor_id', $vendedorId)
                ->with(['cliente', 'vendedor', 'detalles.producto'])
                ->orderBy('fecha_venta', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $ventas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ventas por vendedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate sale code
     */
    private function generarCodigoVenta(): string
    {
        $prefix = 'VENT';
        $lastVenta = Venta::where('codigo_venta', 'LIKE', $prefix . '%')
            ->orderBy('codigo_venta', 'desc')
            ->first();

        if ($lastVenta) {
            $lastNumber = (int) substr($lastVenta->codigo_venta, strlen($prefix));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Generate invoice number
     */
    private function generarNumeroFactura(): string
    {
        $prefix = 'FAC';
        $year = now()->year;
        $lastVenta = Venta::where('numero_factura', 'LIKE', $prefix . $year . '%')
            ->orderBy('numero_factura', 'desc')
            ->first();

        if ($lastVenta) {
            $lastNumber = (int) substr($lastVenta->numero_factura, -6);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . $year . str_pad($newNumber, 6, '0', STR_PAD_LEFT);
    }
} 