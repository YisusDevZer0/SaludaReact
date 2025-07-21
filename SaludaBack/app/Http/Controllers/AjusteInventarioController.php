<?php

namespace App\Http\Controllers;

use App\Models\AjusteInventario;
use App\Models\Producto;
use App\Models\Sucursal;
use App\Models\Almacen;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AjusteInventarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = AjusteInventario::with(['producto', 'sucursal', 'almacen', 'usuario']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('numero_ajuste', 'LIKE', "%{$search}%")
                      ->orWhere('motivo', 'LIKE', "%{$search}%")
                      ->orWhere('observaciones', 'LIKE', "%{$search}%")
                      ->orWhereHas('producto', function ($producto) use ($search) {
                          $producto->where('nombre', 'LIKE', "%{$search}%");
                      });
                });
            }

            if ($request->has('tipo_ajuste') && $request->tipo_ajuste) {
                $query->where('tipo_ajuste', $request->tipo_ajuste);
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
                $query->where('fecha_ajuste', '>=', $request->fecha_inicio);
            }

            if ($request->has('fecha_fin') && $request->fecha_fin) {
                $query->where('fecha_ajuste', '<=', $request->fecha_fin);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'fecha_ajuste');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $ajustes = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $ajustes->items(),
                'pagination' => [
                    'current_page' => $ajustes->currentPage(),
                    'last_page' => $ajustes->lastPage(),
                    'per_page' => $ajustes->perPage(),
                    'total' => $ajustes->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ajustes: ' . $e->getMessage()
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
                'usuario_id' => 'required|exists:personal_pos,id',
                'numero_ajuste' => 'nullable|string|max:50|unique:ajustes_inventario',
                'tipo_ajuste' => 'required|in:entrada,salida,correccion',
                'motivo' => 'required|string|max:255',
                'cantidad_anterior' => 'required|integer|min:0',
                'cantidad_nueva' => 'required|integer|min:0',
                'cantidad_ajuste' => 'required|integer',
                'costo_unitario' => 'nullable|numeric|min:0',
                'costo_total_ajuste' => 'nullable|numeric',
                'fecha_ajuste' => 'required|date',
                'observaciones' => 'nullable|string',
                'estado' => 'required|in:pendiente,confirmado,anulado',
                'aprobado_por' => 'nullable|exists:personal_pos,id',
                'fecha_aprobacion' => 'nullable|date',
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

            // Generar número de ajuste si no se proporciona
            if (empty($data['numero_ajuste'])) {
                $data['numero_ajuste'] = $this->generarNumeroAjuste();
            }

            // Calcular costo total del ajuste si no se proporciona
            if (!isset($data['costo_total_ajuste']) && isset($data['costo_unitario'])) {
                $data['costo_total_ajuste'] = $data['costo_unitario'] * abs($data['cantidad_ajuste']);
            }

            $ajuste = AjusteInventario::create($data);

            // Si el ajuste está confirmado, aplicar inmediatamente
            if ($ajuste->estado === 'confirmado') {
                $this->aplicarAjuste($ajuste);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ajuste de inventario creado exitosamente',
                'data' => $ajuste->load(['producto', 'sucursal', 'almacen', 'usuario'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear ajuste: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $ajuste = AjusteInventario::with(['producto', 'sucursal', 'almacen', 'usuario'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $ajuste
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ajuste no encontrado'
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

            $ajuste = AjusteInventario::findOrFail($id);

            // No permitir editar ajustes confirmados
            if ($ajuste->estado === 'confirmado') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede editar un ajuste confirmado'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'producto_id' => 'sometimes|required|exists:productos,id',
                'sucursal_id' => 'sometimes|required|exists:sucursales,id',
                'almacen_id' => 'nullable|exists:almacenes,Almacen_ID',
                'usuario_id' => 'sometimes|required|exists:personal_pos,id',
                'numero_ajuste' => 'nullable|string|max:50|unique:ajustes_inventario,numero_ajuste,' . $id,
                'tipo_ajuste' => 'sometimes|required|in:entrada,salida,correccion',
                'motivo' => 'sometimes|required|string|max:255',
                'cantidad_anterior' => 'sometimes|required|integer|min:0',
                'cantidad_nueva' => 'sometimes|required|integer|min:0',
                'cantidad_ajuste' => 'sometimes|required|integer',
                'costo_unitario' => 'nullable|numeric|min:0',
                'costo_total_ajuste' => 'nullable|numeric',
                'fecha_ajuste' => 'sometimes|required|date',
                'observaciones' => 'nullable|string',
                'estado' => 'sometimes|required|in:pendiente,confirmado,anulado',
                'aprobado_por' => 'nullable|exists:personal_pos,id',
                'fecha_aprobacion' => 'nullable|date',
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

            // Calcular costo total del ajuste si no se proporciona
            if (!isset($data['costo_total_ajuste']) && isset($data['costo_unitario'])) {
                $data['costo_total_ajuste'] = $data['costo_unitario'] * abs($data['cantidad_ajuste'] ?? $ajuste->cantidad_ajuste);
            }

            $ajuste->update($data);

            // Si el ajuste está confirmado, aplicar inmediatamente
            if ($ajuste->estado === 'confirmado') {
                $this->aplicarAjuste($ajuste);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ajuste actualizado exitosamente',
                'data' => $ajuste->load(['producto', 'sucursal', 'almacen', 'usuario'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar ajuste: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $ajuste = AjusteInventario::findOrFail($id);

            if ($ajuste->estado === 'confirmado') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar un ajuste confirmado'
                ], 400);
            }

            $ajuste->delete();

            return response()->json([
                'success' => true,
                'message' => 'Ajuste eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar ajuste: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm adjustment
     */
    public function confirmar(Request $request, string $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $ajuste = AjusteInventario::findOrFail($id);

            if ($ajuste->estado !== 'pendiente') {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo se pueden confirmar ajustes pendientes'
                ], 400);
            }

            $ajuste->update([
                'estado' => 'confirmado',
                'aprobado_por' => Auth::id(),
                'fecha_aprobacion' => now(),
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            // Aplicar el ajuste al inventario
            $this->aplicarAjuste($ajuste);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ajuste confirmado exitosamente',
                'data' => $ajuste->load(['producto', 'sucursal', 'almacen', 'usuario'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al confirmar ajuste: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel adjustment
     */
    public function anular(Request $request, string $id): JsonResponse
    {
        try {
            $ajuste = AjusteInventario::findOrFail($id);

            if ($ajuste->estado === 'anulado') {
                return response()->json([
                    'success' => false,
                    'message' => 'El ajuste ya está anulado'
                ], 400);
            }

            $ajuste->update([
                'estado' => 'anulado',
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Ajuste anulado exitosamente',
                'data' => $ajuste->load(['producto', 'sucursal', 'almacen', 'usuario'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al anular ajuste: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Apply adjustment to inventory
     */
    private function aplicarAjuste(AjusteInventario $ajuste)
    {
        // Buscar o crear registro de inventario
        $inventario = \App\Models\Inventario::where('producto_id', $ajuste->producto_id)
            ->where('sucursal_id', $ajuste->sucursal_id)
            ->first();

        if (!$inventario) {
            $inventario = \App\Models\Inventario::create([
                'producto_id' => $ajuste->producto_id,
                'sucursal_id' => $ajuste->sucursal_id,
                'almacen_id' => $ajuste->almacen_id,
                'stock_actual' => 0,
                'stock_reservado' => 0,
                'stock_disponible' => 0,
                'stock_minimo' => 0,
                'estado' => 'disponible',
                'activo' => true,
                'creado_por' => Auth::user()->name ?? 'Sistema'
            ]);
        }

        // Aplicar el ajuste según el tipo
        switch ($ajuste->tipo_ajuste) {
            case 'entrada':
                $inventario->stock_actual += $ajuste->cantidad_ajuste;
                break;
            case 'salida':
                $inventario->stock_actual -= $ajuste->cantidad_ajuste;
                break;
            case 'correccion':
                $inventario->stock_actual = $ajuste->cantidad_nueva;
                break;
        }

        // Recalcular stock disponible
        $inventario->stock_disponible = $inventario->stock_actual - $inventario->stock_reservado;

        // Actualizar costos si se proporcionan
        if ($ajuste->costo_unitario) {
            $inventario->costo_unitario = $ajuste->costo_unitario;
            $inventario->costo_total = $ajuste->costo_unitario * $inventario->stock_actual;
        }

        // Actualizar información de auditoría
        $inventario->ultimo_movimiento = now();
        $inventario->ultimo_movimiento_tipo = 'ajuste';
        $inventario->actualizado_por = Auth::user()->name ?? 'Sistema';
        $inventario->save();

        // Crear movimiento de inventario
        \App\Models\MovimientoInventario::create([
            'producto_id' => $ajuste->producto_id,
            'sucursal_id' => $ajuste->sucursal_id,
            'almacen_id' => $ajuste->almacen_id,
            'personal_id' => $ajuste->usuario_id,
            'tipo_movimiento' => $ajuste->tipo_ajuste === 'entrada' ? 'entrada_ajuste' : 'salida_ajuste',
            'categoria_movimiento' => $ajuste->tipo_ajuste === 'entrada' ? 'entrada' : 'salida',
            'cantidad' => abs($ajuste->cantidad_ajuste),
            'cantidad_anterior' => $ajuste->cantidad_anterior,
            'cantidad_nueva' => $ajuste->cantidad_nueva,
            'costo_unitario' => $ajuste->costo_unitario,
            'costo_total' => $ajuste->costo_total_ajuste,
            'numero_documento' => $ajuste->numero_ajuste,
            'tipo_documento' => 'ajuste_inventario',
            'observaciones' => $ajuste->motivo . ': ' . $ajuste->observaciones,
            'estado' => 'confirmado',
            'fecha_confirmacion' => now(),
            'confirmado_por' => Auth::id(),
            'creado_por' => Auth::user()->name ?? 'Sistema'
        ]);
    }

    /**
     * Generate adjustment number
     */
    private function generarNumeroAjuste(): string
    {
        $fecha = new Date();
        $año = $fecha->getFullYear();
        $mes = String($fecha->getMonth() + 1).padStart(2, '0');
        $dia = String($fecha->getDate()).padStart(2, '0');
        $hora = String($fecha->getHours()).padStart(2, '0');
        $minuto = String($fecha->getMinutes()).padStart(2, '0');
        $segundo = String($fecha->getSeconds()).padStart(2, '0');
        
        return `AJUST-${año}${mes}${dia}-${hora}${minuto}${segundo}`;
    }

    /**
     * Get adjustment statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_ajustes' => AjusteInventario::count(),
                'ajustes_hoy' => AjusteInventario::whereDate('fecha_ajuste', today())->count(),
                'ajustes_mes' => AjusteInventario::whereMonth('fecha_ajuste', now()->month)->count(),
                'ajustes_anio' => AjusteInventario::whereYear('fecha_ajuste', now()->year)->count(),
                'por_tipo' => AjusteInventario::select('tipo_ajuste', DB::raw('count(*) as total'))
                    ->groupBy('tipo_ajuste')
                    ->get(),
                'por_estado' => AjusteInventario::select('estado', DB::raw('count(*) as total'))
                    ->groupBy('estado')
                    ->get(),
                'total_entradas' => AjusteInventario::where('tipo_ajuste', 'entrada')->sum('cantidad_ajuste'),
                'total_salidas' => AjusteInventario::where('tipo_ajuste', 'salida')->sum('cantidad_ajuste'),
                'valor_total_ajustes' => AjusteInventario::sum('costo_total_ajuste'),
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
     * Get adjustments by product
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

            $ajustes = AjusteInventario::where('producto_id', $productoId)
                ->with(['producto', 'sucursal', 'almacen', 'usuario'])
                ->orderBy('fecha_ajuste', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $ajustes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ajustes por producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get adjustments by branch
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

            $ajustes = AjusteInventario::where('sucursal_id', $sucursalId)
                ->with(['producto', 'sucursal', 'almacen', 'usuario'])
                ->orderBy('fecha_ajuste', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $ajustes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ajustes por sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available adjustment types
     */
    public function tiposAjusteDisponibles(): JsonResponse
    {
        try {
            $tipos = [
                ['value' => 'entrada', 'label' => 'Entrada'],
                ['value' => 'salida', 'label' => 'Salida'],
                ['value' => 'correccion', 'label' => 'Corrección'],
            ];

            return response()->json([
                'success' => true,
                'data' => $tipos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tipos de ajuste: ' . $e->getMessage()
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