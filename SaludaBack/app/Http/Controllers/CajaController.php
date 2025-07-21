<?php

namespace App\Http\Controllers;

use App\Models\Caja;
use App\Models\Sucursal;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CajaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Caja::with(['sucursal', 'usuario_responsable']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('codigo', 'LIKE', "%{$search}%")
                      ->orWhere('nombre', 'LIKE', "%{$search}%")
                      ->orWhereHas('sucursal', function ($sucursal) use ($search) {
                          $sucursal->where('nombre', 'LIKE', "%{$search}%");
                      });
                });
            }

            if ($request->has('estado') && $request->estado) {
                $query->where('estado', $request->estado);
            }

            if ($request->has('sucursal_id') && $request->sucursal_id) {
                $query->where('sucursal_id', $request->sucursal_id);
            }

            if ($request->has('usuario_id') && $request->usuario_id) {
                $query->where('usuario_responsable_id', $request->usuario_id);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $cajas = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $cajas->items(),
                'pagination' => [
                    'current_page' => $cajas->currentPage(),
                    'last_page' => $cajas->lastPage(),
                    'per_page' => $cajas->perPage(),
                    'total' => $cajas->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener cajas: ' . $e->getMessage()
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
                'codigo' => 'required|string|max:50|unique:cajas',
                'nombre' => 'required|string|max:255',
                'sucursal_id' => 'required|exists:sucursales,id',
                'usuario_responsable_id' => 'required|exists:users,id',
                'tipo_caja' => 'required|in:principal,secundaria,express',
                'saldo_inicial' => 'required|numeric|min:0',
                'saldo_minimo' => 'nullable|numeric|min:0',
                'saldo_maximo' => 'nullable|numeric|min:0',
                'moneda_principal' => 'required|string|max:10',
                'monedas_aceptadas' => 'nullable|json',
                'metodos_pago' => 'nullable|json',
                'configuracion_pos' => 'nullable|json',
                'estado' => 'required|in:activa,inactiva,en_mantenimiento',
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
            $data['saldo_actual'] = $data['saldo_inicial'];

            $caja = Caja::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Caja creada exitosamente',
                'data' => $caja->load(['sucursal', 'usuario_responsable'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear caja: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $caja = Caja::with(['sucursal', 'usuario_responsable'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $caja
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Caja no encontrada'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $caja = Caja::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'codigo' => 'sometimes|required|string|max:50|unique:cajas,codigo,' . $id,
                'nombre' => 'sometimes|required|string|max:255',
                'sucursal_id' => 'sometimes|required|exists:sucursales,id',
                'usuario_responsable_id' => 'sometimes|required|exists:users,id',
                'tipo_caja' => 'sometimes|required|in:principal,secundaria,express',
                'saldo_inicial' => 'sometimes|required|numeric|min:0',
                'saldo_minimo' => 'nullable|numeric|min:0',
                'saldo_maximo' => 'nullable|numeric|min:0',
                'moneda_principal' => 'sometimes|required|string|max:10',
                'monedas_aceptadas' => 'nullable|json',
                'metodos_pago' => 'nullable|json',
                'configuracion_pos' => 'nullable|json',
                'estado' => 'sometimes|required|in:activa,inactiva,en_mantenimiento',
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

            $caja->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Caja actualizada exitosamente',
                'data' => $caja->load(['sucursal', 'usuario_responsable'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar caja: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $caja = Caja::findOrFail($id);

            // Verificar que no tenga ventas asociadas
            $ventasAsociadas = Venta::where('caja_id', $id)->count();
            if ($ventasAsociadas > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar la caja porque tiene ventas asociadas'
                ], 400);
            }

            $caja->delete();

            return response()->json([
                'success' => true,
                'message' => 'Caja eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar caja: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Open cash register
     */
    public function abrir(Request $request, string $id): JsonResponse
    {
        try {
            $caja = Caja::findOrFail($id);

            if ($caja->estado !== 'activa') {
                return response()->json([
                    'success' => false,
                    'message' => 'La caja debe estar activa para abrirla'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'saldo_inicial' => 'required|numeric|min:0',
                'observaciones' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $caja->update([
                'saldo_actual' => $request->saldo_inicial,
                'fecha_apertura' => now(),
                'usuario_apertura_id' => Auth::id(),
                'observaciones_apertura' => $request->observaciones,
                'estado_operacion' => 'abierta'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Caja abierta exitosamente',
                'data' => $caja->load(['sucursal', 'usuario_responsable'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al abrir caja: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Close cash register
     */
    public function cerrar(Request $request, string $id): JsonResponse
    {
        try {
            $caja = Caja::findOrFail($id);

            if ($caja->estado_operacion !== 'abierta') {
                return response()->json([
                    'success' => false,
                    'message' => 'La caja debe estar abierta para cerrarla'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'saldo_final' => 'required|numeric|min:0',
                'observaciones' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Calcular estadísticas del día
            $ventasHoy = Venta::where('caja_id', $id)
                ->whereDate('fecha_venta', today())
                ->get();

            $totalVentas = $ventasHoy->sum('total');
            $cantidadVentas = $ventasHoy->count();
            $diferencia = $request->saldo_final - $caja->saldo_actual;

            $caja->update([
                'saldo_actual' => $request->saldo_final,
                'fecha_cierre' => now(),
                'usuario_cierre_id' => Auth::id(),
                'observaciones_cierre' => $request->observaciones,
                'estado_operacion' => 'cerrada',
                'total_ventas_dia' => $totalVentas,
                'cantidad_ventas_dia' => $cantidadVentas,
                'diferencia_caja' => $diferencia
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Caja cerrada exitosamente',
                'data' => [
                    'caja' => $caja->load(['sucursal', 'usuario_responsable']),
                    'resumen_dia' => [
                        'total_ventas' => $totalVentas,
                        'cantidad_ventas' => $cantidadVentas,
                        'diferencia_caja' => $diferencia
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar caja: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get cash register balance
     */
    public function saldo(Request $request, string $id): JsonResponse
    {
        try {
            $caja = Caja::findOrFail($id);

            // Calcular saldo actual basado en ventas del día
            $ventasHoy = Venta::where('caja_id', $id)
                ->whereDate('fecha_venta', today())
                ->get();

            $totalIngresos = $ventasHoy->sum('total');
            $saldoCalculado = $caja->saldo_inicial + $totalIngresos;

            return response()->json([
                'success' => true,
                'data' => [
                    'saldo_inicial' => $caja->saldo_inicial,
                    'saldo_actual' => $caja->saldo_actual,
                    'saldo_calculado' => $saldoCalculado,
                    'total_ventas_hoy' => $totalIngresos,
                    'cantidad_ventas_hoy' => $ventasHoy->count(),
                    'diferencia' => $caja->saldo_actual - $saldoCalculado
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener saldo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get cash register statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_cajas' => Caja::count(),
                'cajas_activas' => Caja::where('estado', 'activa')->count(),
                'cajas_inactivas' => Caja::where('estado', 'inactiva')->count(),
                'cajas_abiertas' => Caja::where('estado_operacion', 'abierta')->count(),
                'cajas_cerradas' => Caja::where('estado_operacion', 'cerrada')->count(),
                'total_saldo_cajas' => Caja::sum('saldo_actual'),
                'por_tipo' => Caja::select('tipo_caja', DB::raw('count(*) as total'))
                    ->groupBy('tipo_caja')
                    ->get(),
                'por_estado' => Caja::select('estado', DB::raw('count(*) as total'))
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
     * Get cash registers by branch
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

            $cajas = Caja::where('sucursal_id', $sucursalId)
                ->with(['sucursal', 'usuario_responsable'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $cajas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener cajas por sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available payment methods
     */
    public function metodosPagoDisponibles(): JsonResponse
    {
        try {
            $metodos = [
                ['value' => 'efectivo', 'label' => 'Efectivo'],
                ['value' => 'tarjeta_debito', 'label' => 'Tarjeta de Débito'],
                ['value' => 'tarjeta_credito', 'label' => 'Tarjeta de Crédito'],
                ['value' => 'transferencia', 'label' => 'Transferencia'],
                ['value' => 'cheque', 'label' => 'Cheque'],
                ['value' => 'pago_movil', 'label' => 'Pago Móvil'],
                ['value' => 'criptomonedas', 'label' => 'Criptomonedas'],
                ['value' => 'otros', 'label' => 'Otros'],
            ];

            return response()->json([
                'success' => true,
                'data' => $metodos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener métodos de pago: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available currencies
     */
    public function monedasDisponibles(): JsonResponse
    {
        try {
            $monedas = [
                ['value' => 'USD', 'label' => 'Dólar Estadounidense'],
                ['value' => 'EUR', 'label' => 'Euro'],
                ['value' => 'VES', 'label' => 'Bolívar Venezolano'],
                ['value' => 'COP', 'label' => 'Peso Colombiano'],
                ['value' => 'MXN', 'label' => 'Peso Mexicano'],
                ['value' => 'ARS', 'label' => 'Peso Argentino'],
                ['value' => 'CLP', 'label' => 'Peso Chileno'],
                ['value' => 'PEN', 'label' => 'Sol Peruano'],
                ['value' => 'BRL', 'label' => 'Real Brasileño'],
            ];

            return response()->json([
                'success' => true,
                'data' => $monedas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener monedas: ' . $e->getMessage()
            ], 500);
        }
    }
} 