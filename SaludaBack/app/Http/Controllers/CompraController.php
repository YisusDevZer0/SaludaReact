<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Proveedor;
use App\Models\User;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CompraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Compra::with(['proveedor', 'personal', 'detalles.producto']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('numero_factura', 'LIKE', "%{$search}%")
                      ->orWhere('codigo_compra', 'LIKE', "%{$search}%")
                      ->orWhereHas('proveedor', function ($proveedor) use ($search) {
                          $proveedor->where('razon_social', 'LIKE', "%{$search}%")
                                   ->orWhere('nombre_contacto', 'LIKE', "%{$search}%");
                      });
                });
            }

            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('proveedor_id') && $request->proveedor_id) {
                $query->where('proveedor_id', $request->proveedor_id);
            }

            if ($request->has('personal_id') && $request->personal_id) {
                $query->where('personal_id', $request->personal_id);
            }

            if ($request->has('fecha_inicio') && $request->fecha_inicio) {
                $query->where('fecha_documento', '>=', $request->fecha_inicio);
            }

            if ($request->has('fecha_fin') && $request->fecha_fin) {
                $query->where('fecha_documento', '<=', $request->fecha_fin);
            }

            if ($request->has('tipo_pago') && $request->tipo_pago) {
                $query->where('tipo_pago', $request->tipo_pago);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'fecha_documento');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $compras = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $compras->items(),
                'pagination' => [
                    'current_page' => $compras->currentPage(),
                    'last_page' => $compras->lastPage(),
                    'per_page' => $compras->perPage(),
                    'total' => $compras->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener compras: ' . $e->getMessage()
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
                'proveedor_id' => 'required|exists:proveedores,id',
                'personal_id' => 'required|exists:personal,id',
                'numero_factura' => 'nullable|string|max:50|unique:compras',
                'codigo_compra' => 'nullable|string|max:50|unique:compras',
                'fecha_documento' => 'required|date',
                'fecha_vencimiento' => 'nullable|date|after_or_equal:fecha_documento',
                'tipo_compra' => 'required|in:contado,credito,consignacion',
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

            // Generar código de compra si no se proporciona
            if (empty($data['codigo_compra'])) {
                $data['codigo_compra'] = $this->generarCodigoCompra();
            }

            // Generar número de factura si no se proporciona
            if (empty($data['numero_factura'])) {
                $data['numero_factura'] = $this->generarNumeroFactura();
            }

            // Calcular saldo pendiente si es compra a crédito
            if ($data['tipo_compra'] === 'credito') {
                $data['saldo_pendiente'] = $data['total'];
            }

            $detalles = $data['detalles'];
            unset($data['detalles']);

            $compra = Compra::create($data);

            // Crear detalles de compra
            foreach ($detalles as $detalle) {
                $compra->detalles()->create($detalle);
                
                // Actualizar stock del producto
                $producto = Producto::find($detalle['producto_id']);
                if ($producto) {
                    $producto->stock_actual += $detalle['cantidad'];
                    $producto->save();
                }
            }

            // Actualizar estadísticas del proveedor
            $proveedor = Proveedor::find($data['proveedor_id']);
            if ($proveedor) {
                $proveedor->total_compras += $data['total'];
                $proveedor->cantidad_compras += 1;
                $proveedor->promedio_compra = $proveedor->total_compras / $proveedor->cantidad_compras;
                $proveedor->fecha_ultima_compra = $data['fecha_compra'];
                $proveedor->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra creada exitosamente',
                'data' => $compra->load(['proveedor', 'comprador', 'detalles.producto'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear compra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $compra = Compra::with(['proveedor', 'comprador', 'detalles.producto'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $compra
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Compra no encontrada'
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

            $compra = Compra::findOrFail($id);

            // No permitir editar compras confirmadas o anuladas
            if (in_array($compra->estado, ['confirmada', 'anulada'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede editar una compra confirmada o anulada'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'proveedor_id' => 'sometimes|required|exists:proveedores,id',
                'comprador_id' => 'sometimes|required|exists:users,id',
                'numero_factura' => 'nullable|string|max:50|unique:compras,numero_factura,' . $id,
                'codigo_compra' => 'nullable|string|max:50|unique:compras,codigo_compra,' . $id,
                'fecha_compra' => 'sometimes|required|date',
                'fecha_vencimiento' => 'nullable|date|after_or_equal:fecha_compra',
                'tipo_compra' => 'sometimes|required|in:contado,credito,consignacion',
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

            $compra->update($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra actualizada exitosamente',
                'data' => $compra->load(['proveedor', 'comprador', 'detalles.producto'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar compra: ' . $e->getMessage()
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

            $compra = Compra::with('detalles')->findOrFail($id);

            // No permitir eliminar compras confirmadas
            if ($compra->estado === 'confirmada') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar una compra confirmada'
                ], 400);
            }

            // Restaurar stock de productos
            foreach ($compra->detalles as $detalle) {
                $producto = Producto::find($detalle->producto_id);
                if ($producto) {
                    $producto->stock_actual -= $detalle->cantidad;
                    $producto->save();
                }
            }

            // Actualizar estadísticas del proveedor
            $proveedor = Proveedor::find($compra->proveedor_id);
            if ($proveedor) {
                $proveedor->total_compras -= $compra->total;
                $proveedor->cantidad_compras -= 1;
                if ($proveedor->cantidad_compras > 0) {
                    $proveedor->promedio_compra = $proveedor->total_compras / $proveedor->cantidad_compras;
                } else {
                    $proveedor->promedio_compra = 0;
                }
                $proveedor->save();
            }

            $compra->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar compra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm purchase
     */
    public function confirmar(Request $request, string $id): JsonResponse
    {
        try {
            $compra = Compra::findOrFail($id);

            if ($compra->estado !== 'pendiente') {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo se pueden confirmar compras pendientes'
                ], 400);
            }

            $compra->update([
                'estado' => 'confirmada',
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Compra confirmada exitosamente',
                'data' => $compra->load(['proveedor', 'comprador', 'detalles.producto'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al confirmar compra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel purchase
     */
    public function anular(Request $request, string $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $compra = Compra::with('detalles')->findOrFail($id);

            if ($compra->estado === 'anulada') {
                return response()->json([
                    'success' => false,
                    'message' => 'La compra ya está anulada'
                ], 400);
            }

            // Restaurar stock de productos
            foreach ($compra->detalles as $detalle) {
                $producto = Producto::find($detalle->producto_id);
                if ($producto) {
                    $producto->stock_actual -= $detalle->cantidad;
                    $producto->save();
                }
            }

            // Actualizar estadísticas del proveedor
            $proveedor = Proveedor::find($compra->proveedor_id);
            if ($proveedor) {
                $proveedor->total_compras -= $compra->total;
                $proveedor->cantidad_compras -= 1;
                if ($proveedor->cantidad_compras > 0) {
                    $proveedor->promedio_compra = $proveedor->total_compras / $proveedor->cantidad_compras;
                } else {
                    $proveedor->promedio_compra = 0;
                }
                $proveedor->save();
            }

            $compra->update([
                'estado' => 'anulada',
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra anulada exitosamente',
                'data' => $compra->load(['proveedor', 'comprador', 'detalles.producto'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al anular compra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for purchases
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_compras' => Compra::count(),
                'compras_hoy' => Compra::whereDate('fecha_compra', today())->count(),
                'compras_mes' => Compra::whereMonth('fecha_compra', now()->month)->count(),
                'compras_anio' => Compra::whereYear('fecha_compra', now()->year)->count(),
                'total_facturado' => Compra::sum('total'),
                'total_facturado_hoy' => Compra::whereDate('fecha_compra', today())->sum('total'),
                'total_facturado_mes' => Compra::whereMonth('fecha_compra', now()->month)->sum('total'),
                'total_facturado_anio' => Compra::whereYear('fecha_compra', now()->year)->sum('total'),
                'promedio_compra' => Compra::avg('total'),
                'compras_pendientes' => Compra::where('estado', 'pendiente')->count(),
                'compras_confirmadas' => Compra::where('estado', 'confirmada')->count(),
                'compras_anuladas' => Compra::where('estado', 'anulada')->count(),
                'por_tipo_compra' => Compra::select('tipo_compra', DB::raw('count(*) as total'))
                    ->groupBy('tipo_compra')
                    ->get(),
                'por_tipo_pago' => Compra::select('tipo_pago', DB::raw('count(*) as total'))
                    ->groupBy('tipo_pago')
                    ->get(),
                'por_estado' => Compra::select('estado', DB::raw('count(*) as total'))
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
     * Get purchases by date range
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

            $compras = Compra::whereBetween('fecha_compra', [
                $request->fecha_inicio,
                $request->fecha_fin
            ])
            ->with(['proveedor', 'comprador', 'detalles.producto'])
            ->orderBy('fecha_compra', 'desc')
            ->get();

            return response()->json([
                'success' => true,
                'data' => $compras
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener compras por rango: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get purchases by provider
     */
    public function getPorProveedor(Request $request): JsonResponse
    {
        try {
            $proveedorId = $request->get('proveedor_id');
            
            if (!$proveedorId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de proveedor requerido'
                ], 400);
            }

            $compras = Compra::where('proveedor_id', $proveedorId)
                ->with(['proveedor', 'comprador', 'detalles.producto'])
                ->orderBy('fecha_compra', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $compras
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener compras por proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get purchases by buyer
     */
    public function getPorComprador(Request $request): JsonResponse
    {
        try {
            $compradorId = $request->get('comprador_id');
            
            if (!$compradorId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de comprador requerido'
                ], 400);
            }

            $compras = Compra::where('comprador_id', $compradorId)
                ->with(['proveedor', 'comprador', 'detalles.producto'])
                ->orderBy('fecha_compra', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $compras
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener compras por comprador: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate purchase code
     */
    private function generarCodigoCompra(): string
    {
        $prefix = 'COMP';
        $lastCompra = Compra::where('codigo_compra', 'LIKE', $prefix . '%')
            ->orderBy('codigo_compra', 'desc')
            ->first();

        if ($lastCompra) {
            $lastNumber = (int) substr($lastCompra->codigo_compra, strlen($prefix));
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
        $lastCompra = Compra::where('numero_factura', 'LIKE', $prefix . $year . '%')
            ->orderBy('numero_factura', 'desc')
            ->first();

        if ($lastCompra) {
            $lastNumber = (int) substr($lastCompra->numero_factura, -6);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . $year . str_pad($newNumber, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Get purchase statistics
     */
    public function getEstadisticas(): JsonResponse
    {
        try {
            $stats = [
                'total_compras' => Compra::count(),
                'compras_pendientes' => Compra::where('estado', 'pendiente')->count(),
                'compras_aprobadas' => Compra::where('estado', 'aprobada')->count(),
                'compras_en_proceso' => Compra::where('estado', 'en_proceso')->count(),
                'compras_recibidas' => Compra::where('estado', 'recibida')->count(),
                'compras_canceladas' => Compra::where('estado', 'cancelada')->count(),
                'total_monto' => Compra::where('estado', '!=', 'cancelada')->sum('total'),
                'monto_pendiente' => Compra::where('estado', 'pendiente')->sum('total'),
                'monto_aprobado' => Compra::where('estado', 'aprobada')->sum('total'),
                'compras_por_mes' => Compra::selectRaw('MONTH(fecha_documento) as mes, COUNT(*) as total')
                    ->whereYear('fecha_documento', now()->year)
                    ->groupBy('mes')
                    ->get(),
                'top_proveedores' => Compra::selectRaw('proveedor_id, COUNT(*) as total_compras, SUM(total) as total_monto')
                    ->with('proveedor:id,razon_social,nombre_contacto')
                    ->groupBy('proveedor_id')
                    ->orderBy('total_monto', 'desc')
                    ->limit(5)
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Estadísticas de compras obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }
} 