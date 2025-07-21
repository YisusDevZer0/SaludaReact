<?php

namespace App\Http\Controllers;

use App\Models\Encargo;
use App\Models\Cliente;
use App\Models\Sucursal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class EncargoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Encargo::with(['cliente', 'sucursal', 'usuario']);

            // Filtros
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('descripcion', 'LIKE', "%{$search}%")
                      ->orWhere('detalles', 'LIKE', "%{$search}%")
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

            if ($request->has('sucursal_id') && $request->sucursal_id) {
                $query->where('sucursal_id', $request->sucursal_id);
            }

            if ($request->has('usuario_id') && $request->usuario_id) {
                $query->where('usuario_id', $request->usuario_id);
            }

            if ($request->has('urgente') && $request->urgente !== null) {
                $query->where('urgente', $request->urgente);
            }

            if ($request->has('prioridad') && $request->prioridad) {
                $query->where('prioridad', $request->prioridad);
            }

            if ($request->has('fecha_inicio') && $request->fecha_inicio) {
                $query->where('fecha_solicitud', '>=', $request->fecha_inicio);
            }

            if ($request->has('fecha_fin') && $request->fecha_fin) {
                $query->where('fecha_solicitud', '<=', $request->fecha_fin);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'fecha_solicitud');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $encargos = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $encargos->items(),
                'pagination' => [
                    'current_page' => $encargos->currentPage(),
                    'last_page' => $encargos->lastPage(),
                    'per_page' => $encargos->perPage(),
                    'total' => $encargos->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener encargos: ' . $e->getMessage()
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
                'cliente_id' => 'required|exists:clientes,id',
                'sucursal_id' => 'required|exists:sucursales,id',
                'usuario_id' => 'required|exists:personal_pos,id',
                'descripcion' => 'required|string|max:255',
                'detalles' => 'nullable|string',
                'monto_estimado' => 'nullable|numeric|min:0',
                'monto_final' => 'nullable|numeric|min:0',
                'adelanto' => 'nullable|numeric|min:0',
                'estado' => 'required|in:solicitado,en_proceso,listo,entregado,cancelado,vencido',
                'fecha_solicitud' => 'required|date',
                'fecha_entrega_estimada' => 'required|date|after_or_equal:fecha_solicitud',
                'fecha_entrega_real' => 'nullable|date|after_or_equal:fecha_solicitud',
                'observaciones' => 'nullable|string',
                'notas_internas' => 'nullable|string',
                'urgente' => 'boolean',
                'prioridad' => 'required|in:baja,normal,alta,urgente',
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

            $encargo = Encargo::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Encargo creado exitosamente',
                'data' => $encargo->load(['cliente', 'sucursal', 'usuario'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear encargo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $encargo = Encargo::with(['cliente', 'sucursal', 'usuario'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $encargo
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Encargo no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $encargo = Encargo::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'cliente_id' => 'sometimes|required|exists:clientes,id',
                'sucursal_id' => 'sometimes|required|exists:sucursales,id',
                'usuario_id' => 'sometimes|required|exists:personal_pos,id',
                'descripcion' => 'sometimes|required|string|max:255',
                'detalles' => 'nullable|string',
                'monto_estimado' => 'nullable|numeric|min:0',
                'monto_final' => 'nullable|numeric|min:0',
                'adelanto' => 'nullable|numeric|min:0',
                'estado' => 'sometimes|required|in:solicitado,en_proceso,listo,entregado,cancelado,vencido',
                'fecha_solicitud' => 'sometimes|required|date',
                'fecha_entrega_estimada' => 'sometimes|required|date|after_or_equal:fecha_solicitud',
                'fecha_entrega_real' => 'nullable|date|after_or_equal:fecha_solicitud',
                'observaciones' => 'nullable|string',
                'notas_internas' => 'nullable|string',
                'urgente' => 'boolean',
                'prioridad' => 'sometimes|required|in:baja,normal,alta,urgente',
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

            $encargo->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Encargo actualizado exitosamente',
                'data' => $encargo->load(['cliente', 'sucursal', 'usuario'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar encargo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $encargo = Encargo::findOrFail($id);

            if ($encargo->estado === 'entregado') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar un encargo ya entregado'
                ], 400);
            }

            $encargo->delete();

            return response()->json([
                'success' => true,
                'message' => 'Encargo eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar encargo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cambiar estado del encargo
     */
    public function cambiarEstado(Request $request, string $id): JsonResponse
    {
        try {
            $encargo = Encargo::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'estado' => 'required|in:solicitado,en_proceso,listo,entregado,cancelado,vencido',
                'observaciones' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $estadoAnterior = $encargo->estado;
            $encargo->update([
                'estado' => $request->estado,
                'fecha_entrega_real' => $request->estado === 'entregado' ? now() : $encargo->fecha_entrega_real,
                'observaciones' => $request->observaciones ? $encargo->observaciones . "\n" . $request->observaciones : $encargo->observaciones,
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Estado del encargo actualizado exitosamente',
                'data' => [
                    'encargo' => $encargo->load(['cliente', 'sucursal', 'usuario']),
                    'estado_anterior' => $estadoAnterior,
                    'estado_nuevo' => $request->estado
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar estado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marcar como entregado
     */
    public function marcarEntregado(Request $request, string $id): JsonResponse
    {
        try {
            $encargo = Encargo::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'monto_final' => 'nullable|numeric|min:0',
                'observaciones' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $encargo->update([
                'estado' => 'entregado',
                'fecha_entrega_real' => now(),
                'monto_final' => $request->monto_final ?? $encargo->monto_final,
                'observaciones' => $request->observaciones ? $encargo->observaciones . "\n" . $request->observaciones : $encargo->observaciones,
                'actualizado_por' => Auth::user()->name ?? 'Sistema'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Encargo marcado como entregado exitosamente',
                'data' => $encargo->load(['cliente', 'sucursal', 'usuario'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar como entregado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for orders
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_encargos' => Encargo::count(),
                'encargos_hoy' => Encargo::whereDate('fecha_solicitud', today())->count(),
                'encargos_mes' => Encargo::whereMonth('fecha_solicitud', now()->month)->count(),
                'encargos_anio' => Encargo::whereYear('fecha_solicitud', now()->year)->count(),
                'por_estado' => Encargo::select('estado', DB::raw('count(*) as total'))
                    ->groupBy('estado')
                    ->get(),
                'por_prioridad' => Encargo::select('prioridad', DB::raw('count(*) as total'))
                    ->groupBy('prioridad')
                    ->get(),
                'urgentes' => Encargo::where('urgente', true)->count(),
                'vencidos' => Encargo::where('fecha_entrega_estimada', '<', now())
                    ->whereNotIn('estado', ['entregado', 'cancelado'])
                    ->count(),
                'total_monto_estimado' => Encargo::sum('monto_estimado'),
                'total_monto_final' => Encargo::sum('monto_final'),
                'total_adelantos' => Encargo::sum('adelanto'),
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
     * Get orders by client
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

            $encargos = Encargo::where('cliente_id', $clienteId)
                ->with(['cliente', 'sucursal', 'usuario'])
                ->orderBy('fecha_solicitud', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $encargos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener encargos por cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get urgent orders
     */
    public function getUrgentes(): JsonResponse
    {
        try {
            $encargos = Encargo::where('urgente', true)
                ->whereNotIn('estado', ['entregado', 'cancelado'])
                ->with(['cliente', 'sucursal', 'usuario'])
                ->orderBy('prioridad', 'desc')
                ->orderBy('fecha_entrega_estimada', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $encargos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener encargos urgentes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get overdue orders
     */
    public function getVencidos(): JsonResponse
    {
        try {
            $encargos = Encargo::where('fecha_entrega_estimada', '<', now())
                ->whereNotIn('estado', ['entregado', 'cancelado'])
                ->with(['cliente', 'sucursal', 'usuario'])
                ->orderBy('fecha_entrega_estimada', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $encargos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener encargos vencidos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get orders due soon
     */
    public function getPorVencer(): JsonResponse
    {
        try {
            $fechaLimite = now()->addDays(3);
            
            $encargos = Encargo::where('fecha_entrega_estimada', '<=', $fechaLimite)
                ->where('fecha_entrega_estimada', '>=', now())
                ->whereNotIn('estado', ['entregado', 'cancelado'])
                ->with(['cliente', 'sucursal', 'usuario'])
                ->orderBy('fecha_entrega_estimada', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $encargos
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener encargos por vencer: ' . $e->getMessage()
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
                ['value' => 'solicitado', 'label' => 'Solicitado'],
                ['value' => 'en_proceso', 'label' => 'En Proceso'],
                ['value' => 'listo', 'label' => 'Listo'],
                ['value' => 'entregado', 'label' => 'Entregado'],
                ['value' => 'cancelado', 'label' => 'Cancelado'],
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

    /**
     * Get available priorities
     */
    public function prioridadesDisponibles(): JsonResponse
    {
        try {
            $prioridades = [
                ['value' => 'baja', 'label' => 'Baja'],
                ['value' => 'normal', 'label' => 'Normal'],
                ['value' => 'alta', 'label' => 'Alta'],
                ['value' => 'urgente', 'label' => 'Urgente'],
            ];

            return response()->json([
                'success' => true,
                'data' => $prioridades
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener prioridades: ' . $e->getMessage()
            ], 500);
        }
    }
} 