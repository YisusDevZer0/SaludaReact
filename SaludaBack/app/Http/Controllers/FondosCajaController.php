<?php

namespace App\Http\Controllers;

use App\Models\FondoCaja;
use App\Models\Caja;
use App\Models\Sucursal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class FondosCajaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = FondoCaja::with(['caja', 'sucursal']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('codigo', 'LIKE', "%{$search}%")
                      ->orWhere('nombre', 'LIKE', "%{$search}%")
                      ->orWhereHas('caja', function ($caja) use ($search) {
                          $caja->where('nombre', 'LIKE', "%{$search}%");
                      })
                      ->orWhereHas('sucursal', function ($sucursal) use ($search) {
                          $sucursal->where('nombre', 'LIKE', "%{$search}%");
                      });
                });
            }

            if ($request->has('estatus') && $request->estatus) {
                $query->where('estatus', $request->estatus);
            }

            if ($request->has('sucursal_id') && $request->sucursal_id) {
                $query->where('sucursal_id', $request->sucursal_id);
            }

            if ($request->has('caja_id') && $request->caja_id) {
                $query->where('caja_id', $request->caja_id);
            }

            if ($request->has('tipo_fondo') && $request->tipo_fondo) {
                $query->where('tipo_fondo', $request->tipo_fondo);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $fondos = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $fondos->items(),
                'pagination' => [
                    'current_page' => $fondos->currentPage(),
                    'last_page' => $fondos->lastPage(),
                    'per_page' => $fondos->perPage(),
                    'total' => $fondos->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener fondos de caja: ' . $e->getMessage()
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
                'caja_id' => 'required|exists:cajas,id',
                'sucursal_id' => 'required|exists:sucursales,id',
                'codigo' => 'required|string|max:50|unique:fondos_caja',
                'nombre' => 'required|string|max:100',
                'descripcion' => 'nullable|string',
                'fondo_caja' => 'required|numeric|min:0',
                'saldo_minimo' => 'nullable|numeric|min:0',
                'saldo_maximo' => 'nullable|numeric|min:0',
                'tipo_fondo' => 'required|in:efectivo,mixto,digital',
                'configuracion_monedas' => 'nullable|json',
                'configuracion_denominaciones' => 'nullable|json',
                'observaciones' => 'nullable|string',
                'permitir_sobrepasar_maximo' => 'boolean',
                'requerir_aprobacion_retiro' => 'boolean',
                'monto_maximo_retiro' => 'nullable|numeric|min:0',
                'Id_Licencia' => 'nullable|string|max:150',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['saldo_actual'] = $data['fondo_caja'];
            $data['estatus'] = 'activo';
            $data['codigo_estatus'] = 'A';

            $fondoCaja = FondoCaja::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Fondo de caja creado exitosamente',
                'data' => $fondoCaja->load(['caja', 'sucursal'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear fondo de caja: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $fondoCaja = FondoCaja::with(['caja', 'sucursal'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $fondoCaja
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Fondo de caja no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $fondoCaja = FondoCaja::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'caja_id' => 'sometimes|required|exists:cajas,id',
                'sucursal_id' => 'sometimes|required|exists:sucursales,id',
                'codigo' => 'sometimes|required|string|max:50|unique:fondos_caja,codigo,' . $id,
                'nombre' => 'sometimes|required|string|max:100',
                'descripcion' => 'nullable|string',
                'fondo_caja' => 'sometimes|required|numeric|min:0',
                'saldo_minimo' => 'nullable|numeric|min:0',
                'saldo_maximo' => 'nullable|numeric|min:0',
                'tipo_fondo' => 'sometimes|required|in:efectivo,mixto,digital',
                'configuracion_monedas' => 'nullable|json',
                'configuracion_denominaciones' => 'nullable|json',
                'observaciones' => 'nullable|string',
                'permitir_sobrepasar_maximo' => 'boolean',
                'requerir_aprobacion_retiro' => 'boolean',
                'monto_maximo_retiro' => 'nullable|numeric|min:0',
                'estatus' => 'sometimes|required|in:activo,inactivo,suspendido',
                'Id_Licencia' => 'nullable|string|max:150',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            
            // Actualizar código de estado según el estatus
            if (isset($data['estatus'])) {
                $data['codigo_estatus'] = $data['estatus'] === 'activo' ? 'A' : 
                                        ($data['estatus'] === 'inactivo' ? 'I' : 'S');
            }

            $fondoCaja->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Fondo de caja actualizado exitosamente',
                'data' => $fondoCaja->load(['caja', 'sucursal'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar fondo de caja: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $fondoCaja = FondoCaja::findOrFail($id);

            // Verificar que no tenga movimientos asociados
            $movimientosAsociados = $fondoCaja->movimientos()->count();
            if ($movimientosAsociados > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el fondo porque tiene movimientos asociados'
                ], 400);
            }

            $fondoCaja->delete();

            return response()->json([
                'success' => true,
                'message' => 'Fondo de caja eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar fondo de caja: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener fondos por sucursal
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

            $fondos = FondoCaja::where('sucursal_id', $sucursalId)
                ->with(['caja', 'sucursal'])
                ->activos()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $fondos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener fondos por sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener fondos por caja
     */
    public function getPorCaja(Request $request): JsonResponse
    {
        try {
            $cajaId = $request->get('caja_id');
            
            if (!$cajaId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de caja requerido'
                ], 400);
            }

            $fondos = FondoCaja::where('caja_id', $cajaId)
                ->with(['caja', 'sucursal'])
                ->activos()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $fondos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener fondos por caja: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de fondos
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_fondos' => FondoCaja::count(),
                'fondos_activos' => FondoCaja::where('estatus', 'activo')->count(),
                'fondos_inactivos' => FondoCaja::where('estatus', 'inactivo')->count(),
                'fondos_suspendidos' => FondoCaja::where('estatus', 'suspendido')->count(),
                'total_saldo_fondos' => FondoCaja::sum('saldo_actual'),
                'fondos_saldo_bajo' => FondoCaja::whereRaw('saldo_actual < saldo_minimo')->count(),
                'por_tipo' => FondoCaja::select('tipo_fondo', DB::raw('count(*) as total'))
                    ->groupBy('tipo_fondo')
                    ->get(),
                'por_estatus' => FondoCaja::select('estatus', DB::raw('count(*) as total'))
                    ->groupBy('estatus')
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
     * Obtener opciones para formularios
     */
    public function getOpciones(): JsonResponse
    {
        try {
            $opciones = [
                'tipos_fondo' => FondoCaja::TIPOS_FONDO,
                'estados' => FondoCaja::ESTADOS,
                'codigos_estado' => FondoCaja::CODIGOS_ESTADO,
                'cajas' => Caja::select('id', 'nombre')->activas()->get(),
                'sucursales' => Sucursal::select('id', 'nombre')->activas()->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $opciones
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener opciones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar saldo del fondo
     */
    public function actualizarSaldo(Request $request, string $id): JsonResponse
    {
        try {
            $fondoCaja = FondoCaja::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'monto' => 'required|numeric',
                'tipo' => 'required|in:entrada,salida',
                'concepto' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $monto = $request->monto;
            $tipo = $request->tipo;

            // Verificar si se puede hacer el movimiento
            if ($tipo === 'salida' && !$fondoCaja->puedeRetirar($monto)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede realizar el retiro. Verifique el saldo disponible o los límites configurados.'
                ], 400);
            }

            // Actualizar saldo
            $saldoAnterior = $fondoCaja->saldo_actual;
            $fondoCaja->actualizarSaldo($monto, $tipo);

            return response()->json([
                'success' => true,
                'message' => 'Saldo actualizado exitosamente',
                'data' => [
                    'fondo_caja' => $fondoCaja->load(['caja', 'sucursal']),
                    'saldo_anterior' => $saldoAnterior,
                    'saldo_actual' => $fondoCaja->saldo_actual,
                    'diferencia' => $tipo === 'entrada' ? $monto : -$monto
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar saldo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener información detallada del fondo
     */
    public function getDetalle(string $id): JsonResponse
    {
        try {
            $fondoCaja = FondoCaja::with(['caja', 'sucursal'])->findOrFail($id);

            // Calcular estadísticas adicionales
            $detalle = [
                'fondo_caja' => $fondoCaja,
                'estadisticas' => [
                    'porcentaje_uso' => $fondoCaja->getPorcentajeUso(),
                    'monto_disponible' => $fondoCaja->getMontoDisponible(),
                    'saldo_bajo' => $fondoCaja->saldoBajo(),
                    'saldo_alto' => $fondoCaja->saldoAlto(),
                    'puede_retirar' => $fondoCaja->puedeRetirar($fondoCaja->getMontoDisponible()),
                ],
                'movimientos_recientes' => $fondoCaja->movimientos()
                    ->orderBy('created_at', 'desc')
                    ->limit(10)
                    ->get(),
                'total_movimientos' => $fondoCaja->movimientos()->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $detalle
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener detalle: ' . $e->getMessage()
            ], 500);
        }
    }
} 