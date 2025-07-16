<?php

namespace App\Http\Controllers;

use App\Models\Almacen;
use App\Http\Requests\AlmacenRequest;
use App\Http\Resources\AlmacenResource;
use App\Http\Resources\AlmacenCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AlmacenController extends Controller
{
    /**
     * Display a listing of almacenes.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Almacen::query();

            // Aplicar filtros
            $this->applyFilters($query, $request);

            // Buscar por término
            if ($request->filled('search')) {
                $query->buscar($request->search);
            }

            // Ordenamiento
            $sortField = $request->get('sort_by', 'Agregadoel');
            $sortDirection = $request->get('sort_direction', 'desc');
            
            // Validar campos de ordenamiento permitidos
            $allowedSortFields = [
                'Nom_Almacen', 'Tipo', 'Responsable', 'Estado', 
                'Agregadoel', 'created_at', 'updated_at', 'Capacidad_Max'
            ];
            
            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection);
            }

            // Paginación
            $perPage = min($request->get('per_page', 15), 100);
            $almacenes = $query->paginate($perPage);

            return response()->json([
                'data' => new AlmacenCollection($almacenes->items()),
                'meta' => [
                    'current_page' => $almacenes->currentPage(),
                    'last_page' => $almacenes->lastPage(),
                    'per_page' => $almacenes->perPage(),
                    'total' => $almacenes->total(),
                    'from' => $almacenes->firstItem(),
                    'to' => $almacenes->lastItem(),
                    'path' => $almacenes->path(),
                    'filtros_aplicados' => $this->getAppliedFilters($request)
                ],
                'links' => [
                    'first' => $almacenes->url(1),
                    'last' => $almacenes->url($almacenes->lastPage()),
                    'prev' => $almacenes->previousPageUrl(),
                    'next' => $almacenes->nextPageUrl(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener almacenes: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudieron cargar los almacenes'
            ], 500);
        }
    }

    /**
     * Store a newly created almacen.
     */
    public function store(AlmacenRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $almacen = Almacen::create($request->getValidatedDataWithDefaults());

            DB::commit();

            Log::info('Almacén creado', [
                'almacen_id' => $almacen->Almacen_ID,
                'nombre' => $almacen->Nom_Almacen,
                'usuario' => auth()->user()->Nombre_Apellidos ?? 'Sistema'
            ]);

            return response()->json([
                'message' => 'Almacén creado exitosamente',
                'data' => new AlmacenResource($almacen),
                'meta' => [
                    'action' => 'created',
                    'timestamp' => now()->toISOString()
                ]
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error de validación',
                'message' => 'Los datos proporcionados no son válidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear almacén: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudo crear el almacén'
            ], 500);
        }
    }

    /**
     * Display the specified almacen.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $almacen = Almacen::with(['sucursal'])->find($id);

            if (!$almacen) {
                return response()->json([
                    'error' => 'Almacén no encontrado',
                    'message' => 'El almacén especificado no existe'
                ], 404);
            }

            return response()->json([
                'data' => new AlmacenResource($almacen),
                'meta' => [
                    'timestamp' => now()->toISOString(),
                    'relacionados' => $this->getRelacionados($almacen)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener almacén: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudo obtener la información del almacén'
            ], 500);
        }
    }

    /**
     * Update the specified almacen.
     */
    public function update(AlmacenRequest $request, string $id): JsonResponse
    {
        try {
            $almacen = Almacen::find($id);

            if (!$almacen) {
                return response()->json([
                    'error' => 'Almacén no encontrado',
                    'message' => 'El almacén especificado no existe'
                ], 404);
            }

            DB::beginTransaction();

            $datosOriginales = $almacen->toArray();
            $almacen->update($request->getValidatedDataWithDefaults());

            DB::commit();

            Log::info('Almacén actualizado', [
                'almacen_id' => $almacen->Almacen_ID,
                'cambios' => array_diff_assoc($almacen->toArray(), $datosOriginales),
                'usuario' => auth()->user()->Nombre_Apellidos ?? 'Sistema'
            ]);

            return response()->json([
                'message' => 'Almacén actualizado exitosamente',
                'data' => new AlmacenResource($almacen->fresh()),
                'meta' => [
                    'action' => 'updated',
                    'timestamp' => now()->toISOString()
                ]
            ]);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error de validación',
                'message' => 'Los datos proporcionados no son válidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar almacén: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudo actualizar el almacén'
            ], 500);
        }
    }

    /**
     * Remove the specified almacen.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $almacen = Almacen::find($id);

            if (!$almacen) {
                return response()->json([
                    'error' => 'Almacén no encontrado',
                    'message' => 'El almacén especificado no existe'
                ], 404);
            }

            DB::beginTransaction();

            $nombreAlmacen = $almacen->Nom_Almacen;
            $almacen->delete();

            DB::commit();

            Log::info('Almacén eliminado', [
                'almacen_id' => $id,
                'nombre' => $nombreAlmacen,
                'usuario' => auth()->user()->Nombre_Apellidos ?? 'Sistema'
            ]);

            return response()->json([
                'message' => 'Almacén eliminado exitosamente',
                'meta' => [
                    'action' => 'deleted',
                    'deleted_name' => $nombreAlmacen,
                    'timestamp' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al eliminar almacén: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudo eliminar el almacén'
            ], 500);
        }
    }

    /**
     * Get almacenes by tipo.
     */
    public function porTipo(Request $request, string $tipo): JsonResponse
    {
        try {
            $almacenes = Almacen::porTipo($tipo)
                               ->activos()
                               ->orderBy('Nom_Almacen')
                               ->get();

            return response()->json([
                'data' => AlmacenResource::collection($almacenes),
                'meta' => [
                    'tipo' => $tipo,
                    'total' => $almacenes->count(),
                    'timestamp' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener almacenes por tipo: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudieron obtener los almacenes del tipo especificado'
            ], 500);
        }
    }

    /**
     * Get estadísticas generales.
     */
    public function estadisticas(Request $request): JsonResponse
    {
        try {
            $sucursalId = $request->get('sucursal_id');
            
            $estadisticas = [
                'generales' => Almacen::estadisticasPorSucursal($sucursalId),
                'por_tipo' => Almacen::porcentajeUtilizacionPorTipo(),
                'responsables_top' => $this->getTopResponsables($sucursalId),
                'capacidad_total' => $this->getCapacidadTotal($sucursalId),
                'ultimos_agregados' => $this->getUltimosAgregados($sucursalId, 5)
            ];

            return response()->json([
                'data' => $estadisticas,
                'meta' => [
                    'sucursal_id' => $sucursalId,
                    'timestamp' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener estadísticas: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudieron obtener las estadísticas'
            ], 500);
        }
    }

    /**
     * Cambiar estado masivo.
     */
    public function cambiarEstadoMasivo(Request $request): JsonResponse
    {
        $request->validate([
            'almacenes_ids' => 'required|array',
            'almacenes_ids.*' => 'integer|exists:almacenes,Almacen_ID',
            'estado' => 'required|in:Activo,Inactivo'
        ]);

        try {
            DB::beginTransaction();

            $almacenes = Almacen::whereIn('Almacen_ID', $request->almacenes_ids);
            $cantidad = $almacenes->count();
            
            $almacenes->update([
                'Estado' => $request->estado,
                'Cod_Estado' => $request->estado === 'Activo' ? 'A' : 'I'
            ]);

            DB::commit();

            Log::info('Cambio de estado masivo', [
                'cantidad' => $cantidad,
                'estado' => $request->estado,
                'usuario' => auth()->user()->Nombre_Apellidos ?? 'Sistema'
            ]);

            return response()->json([
                'message' => "Estado cambiado exitosamente para {$cantidad} almacenes",
                'meta' => [
                    'action' => 'bulk_status_change',
                    'affected_count' => $cantidad,
                    'new_status' => $request->estado,
                    'timestamp' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en cambio de estado masivo: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudo cambiar el estado de los almacenes'
            ], 500);
        }
    }

    /**
     * Get tipos disponibles con estadísticas.
     */
    public function tiposDisponibles(): JsonResponse
    {
        try {
            $tipos = Almacen::tiposConDescripcion();
            $estadisticasPorTipo = Almacen::selectRaw('Tipo, COUNT(*) as total')
                                         ->groupBy('Tipo')
                                         ->pluck('total', 'Tipo')
                                         ->toArray();

            $tiposConStats = collect($tipos)->map(function ($descripcion, $tipo) use ($estadisticasPorTipo) {
                return [
                    'codigo' => $tipo,
                    'descripcion' => $descripcion,
                    'total_almacenes' => $estadisticasPorTipo[$tipo] ?? 0
                ];
            })->values();

            return response()->json([
                'data' => $tiposConStats,
                'meta' => [
                    'total_tipos' => count($tipos),
                    'timestamp' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener tipos disponibles: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudieron obtener los tipos disponibles'
            ], 500);
        }
    }

    /**
     * Apply filters to query.
     */
    private function applyFilters($query, Request $request): void
    {
        if ($request->filled('tipo')) {
            $query->porTipo($request->tipo);
        }

        if ($request->filled('estado')) {
            $query->where('Estado', $request->estado);
        }

        if ($request->filled('sucursal_id')) {
            $query->porSucursal($request->sucursal_id);
        }

        if ($request->filled('responsable')) {
            $query->porResponsable($request->responsable);
        }

        if ($request->filled('con_capacidad')) {
            if ($request->boolean('con_capacidad')) {
                $query->conCapacidad();
            } else {
                $query->whereNull('Capacidad_Max');
            }
        }

        if ($request->filled('fecha_desde')) {
            $query->where('Agregadoel', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->where('Agregadoel', '<=', $request->fecha_hasta);
        }
    }

    /**
     * Get applied filters.
     */
    private function getAppliedFilters(Request $request): array
    {
        $filters = [];
        
        if ($request->filled('tipo')) $filters['tipo'] = $request->tipo;
        if ($request->filled('estado')) $filters['estado'] = $request->estado;
        if ($request->filled('sucursal_id')) $filters['sucursal_id'] = $request->sucursal_id;
        if ($request->filled('responsable')) $filters['responsable'] = $request->responsable;
        if ($request->filled('search')) $filters['search'] = $request->search;
        if ($request->filled('con_capacidad')) $filters['con_capacidad'] = $request->boolean('con_capacidad');
        if ($request->filled('fecha_desde')) $filters['fecha_desde'] = $request->fecha_desde;
        if ($request->filled('fecha_hasta')) $filters['fecha_hasta'] = $request->fecha_hasta;

        return $filters;
    }

    /**
     * Get related information.
     */
    private function getRelacionados(Almacen $almacen): array
    {
        return [
            'mismo_tipo' => Almacen::porTipo($almacen->Tipo)
                                  ->where('Almacen_ID', '!=', $almacen->Almacen_ID)
                                  ->activos()
                                  ->limit(5)
                                  ->pluck('Nom_Almacen', 'Almacen_ID')
                                  ->toArray(),
            'mismo_responsable' => Almacen::porResponsable($almacen->Responsable)
                                         ->where('Almacen_ID', '!=', $almacen->Almacen_ID)
                                         ->activos()
                                         ->limit(3)
                                         ->pluck('Nom_Almacen', 'Almacen_ID')
                                         ->toArray()
        ];
    }

    /**
     * Get top responsables.
     */
    private function getTopResponsables(?int $sucursalId = null, int $limit = 10): array
    {
        $query = Almacen::selectRaw('Responsable, COUNT(*) as total_almacenes, 
                                     SUM(CASE WHEN Estado = "Activo" THEN 1 ELSE 0 END) as activos')
                        ->groupBy('Responsable')
                        ->orderByDesc('total_almacenes');

        if ($sucursalId) {
            $query->porSucursal($sucursalId);
        }

        return $query->limit($limit)->get()->toArray();
    }

    /**
     * Get total capacity.
     */
    private function getCapacidadTotal(?int $sucursalId = null): array
    {
        $query = Almacen::whereNotNull('Capacidad_Max');
        
        if ($sucursalId) {
            $query->porSucursal($sucursalId);
        }

        $capacidades = $query->pluck('Capacidad_Max');

        return [
            'total' => round($capacidades->sum(), 2),
            'promedio' => round($capacidades->avg(), 2),
            'maximo' => $capacidades->max(),
            'minimo' => $capacidades->min(),
            'count' => $capacidades->count()
        ];
    }

    /**
     * Get últimos agregados.
     */
    private function getUltimosAgregados(?int $sucursalId = null, int $limit = 5): array
    {
        $query = Almacen::orderByDesc('Agregadoel');
        
        if ($sucursalId) {
            $query->porSucursal($sucursalId);
        }

        return $query->limit($limit)
                     ->get(['Almacen_ID', 'Nom_Almacen', 'Tipo', 'Responsable', 'Agregadoel'])
                     ->toArray();
    }
} 