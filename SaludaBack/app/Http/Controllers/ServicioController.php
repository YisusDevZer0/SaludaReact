<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use App\Http\Requests\ServicioRequest;
use App\Http\Resources\ServicioResource;
use App\Http\Resources\ServicioCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ServicioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Servicio::query();

            // Eager loading de relaciones si se solicita
            if ($request->boolean('with_marcas')) {
                $query->with('marcas');
            }

            // Filtros
            if ($request->filled('estado')) {
                $query->where('Estado', $request->estado);
            }

            if ($request->filled('sistema')) {
                $query->where('Sistema', $request->sistema);
            }

            if ($request->filled('organizacion')) {
                $query->where('ID_H_O_D', $request->organizacion);
            }

            if ($request->filled('requiere_cita')) {
                $query->where('Requiere_Cita', $request->boolean('requiere_cita'));
            }

            if ($request->filled('precio_min')) {
                $query->where('Precio_Base', '>=', $request->precio_min);
            }

            if ($request->filled('precio_max')) {
                $query->where('Precio_Base', '<=', $request->precio_max);
            }

            // Búsqueda por texto
            if ($request->filled('search')) {
                $searchTerm = '%' . $request->search . '%';
                $query->where(function($q) use ($searchTerm) {
                    $q->where('Nom_Serv', 'LIKE', $searchTerm)
                      ->orWhere('Descripcion', 'LIKE', $searchTerm)
                      ->orWhere('Agregado_Por', 'LIKE', $searchTerm);
                });
            }

            // DataTable search para compatibilidad con frontend existente
            if ($request->has('search.value') && !empty($request->input('search.value'))) {
                $searchValue = '%' . $request->input('search.value') . '%';
                $query->where(function($q) use ($searchValue) {
                    $q->where('Nom_Serv', 'LIKE', $searchValue)
                      ->orWhere('Descripcion', 'LIKE', $searchValue)
                      ->orWhere('Agregado_Por', 'LIKE', $searchValue);
                });
            }

            // Ordenamiento
            $orderBy = $request->input('order_by', 'created_at');
            $orderDirection = $request->input('order_direction', 'desc');
            
            // DataTable ordering para compatibilidad
            if ($request->has('order.0.column')) {
                $columns = ['Servicio_ID', 'Nom_Serv', 'Estado', 'Precio_Base', 'Requiere_Cita', 'created_at'];
                $orderColumnIndex = $request->input('order.0.column');
                $orderBy = $columns[$orderColumnIndex] ?? 'created_at';
                $orderDirection = $request->input('order.0.dir', 'desc');
            }

            $query->orderBy($orderBy, $orderDirection);

            // Paginación
            if ($request->has('paginate') && $request->boolean('paginate')) {
                $perPage = $request->input('per_page', 15);
                $servicios = $query->paginate($perPage);
                return response()->json(new ServicioCollection($servicios));
            }

            // DataTable pagination para compatibilidad
            if ($request->has('start') && $request->has('length')) {
                $start = (int) $request->input('start', 0);
                $length = (int) $request->input('length', 10);
                
                $totalRecords = Servicio::count();
                $filteredRecords = $query->count();
                
                $servicios = $query->skip($start)->take($length)->get();
                
                return response()->json([
                    'draw' => (int) $request->input('draw', 1),
                    'recordsTotal' => $totalRecords,
                    'recordsFiltered' => $filteredRecords,
                    'data' => ServicioResource::collection($servicios)
                ]);
            }

            // Respuesta estándar
            $servicios = $query->get();
            return response()->json(new ServicioCollection($servicios));

        } catch (\Exception $e) {
            Log::error('Error fetching servicios: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener los servicios',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ServicioRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $data = $request->getValidatedDataWithDefaults();
            $servicio = Servicio::create($data);

            // Asociar marcas si se proporcionan
            if ($request->has('marcas') && is_array($request->marcas)) {
                $this->syncMarcas($servicio, $request);
            }

            DB::commit();

            return response()->json([
                'message' => 'Servicio creado exitosamente',
                'data' => new ServicioResource($servicio->load('marcas'))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating servicio: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al crear el servicio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id): JsonResponse
    {
        try {
            $query = Servicio::where('Servicio_ID', $id);

            // Incluir relaciones si se solicita
            if ($request->boolean('with_marcas')) {
                $query->with('marcas');
            }

            $servicio = $query->firstOrFail();

            return response()->json([
                'data' => new ServicioResource($servicio)
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Servicio no encontrado'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching servicio: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener el servicio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServicioRequest $request, $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $servicio = Servicio::findOrFail($id);
            $data = $request->getValidatedDataWithDefaults();
            
            $servicio->update($data);

            // Actualizar asociaciones con marcas si se proporcionan
            if ($request->has('marcas')) {
                $this->syncMarcas($servicio, $request);
            }

            DB::commit();

            return response()->json([
                'message' => 'Servicio actualizado exitosamente',
                'data' => new ServicioResource($servicio->load('marcas'))
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Servicio no encontrado'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating servicio: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al actualizar el servicio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $servicio = Servicio::find($id);

            if (!$servicio) {
                return response()->json([
                    'error' => 'Servicio no encontrado',
                    'message' => 'El servicio especificado no existe'
                ], 404);
            }

            // Verificar si es un servicio del sistema
            if ($servicio->esSistema()) {
                return response()->json([
                    'error' => 'Servicio del sistema',
                    'message' => 'No se puede eliminar un servicio del sistema'
                ], 403);
            }

            $servicio->delete();

            return response()->json([
                'message' => 'Servicio eliminado exitosamente',
                'meta' => [
                    'action' => 'deleted',
                    'timestamp' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al eliminar servicio: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudo eliminar el servicio'
            ], 500);
        }
    }

    /**
     * Toggle service status between Activo and Inactivo.
     */
    public function toggleStatus($id): JsonResponse
    {
        try {
            $servicio = Servicio::findOrFail($id);
            
            if ($servicio->Estado === 'Activo') {
                $servicio->desactivar();
                $message = 'Servicio desactivado exitosamente';
            } else {
                $servicio->activar();
                $message = 'Servicio activado exitosamente';
            }

            return response()->json([
                'message' => $message,
                'data' => new ServicioResource($servicio)
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Servicio no encontrado'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error toggling servicio status: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al cambiar el estado del servicio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get services by estado.
     */
    public function getByEstado($estado): JsonResponse
    {
        try {
            $servicios = Servicio::where('Estado', $estado)->get();
            return response()->json(new ServicioCollection($servicios));
        } catch (\Exception $e) {
            Log::error('Error fetching servicios by estado: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener servicios por estado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get services by sistema.
     */
    public function getBySistema($sistema): JsonResponse
    {
        try {
            $servicios = Servicio::where('Sistema', $sistema)->get();
            return response()->json(new ServicioCollection($servicios));
        } catch (\Exception $e) {
            Log::error('Error fetching servicios by sistema: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener servicios por sistema',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sync marcas with servicio.
     */
    private function syncMarcas(Servicio $servicio, ServicioRequest $request): void
    {
        $marcasData = [];
        
        foreach ($request->marcas as $index => $marcaId) {
            $marcasData[$marcaId] = [
                'precio_especial' => $request->input("marcas_precios.{$index}"),
                'notas' => $request->input("marcas_notas.{$index}"),
                'agregado_por' => auth()->user()->Nombre_Apellidos ?? 'Sistema'
            ];
        }
        
        $servicio->marcas()->sync($marcasData);
    }

    /**
     * Obtener estadísticas de servicios
     */
    public function estadisticas(Request $request): JsonResponse
    {
        try {
            $organizacionId = $request->get('organizacion_id');
            $estadisticas = Servicio::estadisticasPorOrganizacion($organizacionId);

            return response()->json([
                'data' => $estadisticas,
                'meta' => [
                    'timestamp' => now()->toISOString(),
                    'organizacion_id' => $organizacionId
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
     * Cambiar estado masivo de servicios
     */
    public function cambiarEstadoMasivo(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'servicios_ids' => 'required|array',
                'servicios_ids.*' => 'integer|exists:Servicios_POS,Servicio_ID',
                'estado' => 'required|in:Activo,Inactivo'
            ]);

            $serviciosIds = $request->servicios_ids;
            $nuevoEstado = $request->estado;

            // Filtrar servicios del sistema
            $serviciosSistema = Servicio::whereIn('Servicio_ID', $serviciosIds)
                ->where('Sistema', true)
                ->pluck('Servicio_ID')
                ->toArray();

            if (!empty($serviciosSistema)) {
                return response()->json([
                    'error' => 'Servicios del sistema',
                    'message' => 'No se puede cambiar el estado de servicios del sistema',
                    'servicios_sistema' => $serviciosSistema
                ], 403);
            }

            DB::beginTransaction();

            $serviciosActualizados = Servicio::whereIn('Servicio_ID', $serviciosIds)
                ->update([
                    'Estado' => $nuevoEstado,
                    'Cod_Estado' => $nuevoEstado === 'Activo' ? 'A' : 'I'
                ]);

            DB::commit();

            Log::info('Estado masivo cambiado', [
                'servicios_ids' => $serviciosIds,
                'nuevo_estado' => $nuevoEstado,
                'servicios_actualizados' => $serviciosActualizados,
                'usuario' => auth()->user()->Nombre_Apellidos ?? 'Sistema'
            ]);

            return response()->json([
                'message' => 'Estado de servicios actualizado exitosamente',
                'data' => [
                    'servicios_actualizados' => $serviciosActualizados,
                    'nuevo_estado' => $nuevoEstado
                ],
                'meta' => [
                    'action' => 'bulk_status_update',
                    'timestamp' => now()->toISOString()
                ]
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Error de validación',
                'message' => 'Los datos proporcionados no son válidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al cambiar estado masivo: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => 'No se pudo cambiar el estado de los servicios'
            ], 500);
        }
    }

    /**
     * Obtener filtros aplicados
     */
    private function getAppliedFilters(Request $request): array
    {
        $filtros = [];

        if ($request->filled('estado')) {
            $filtros['estado'] = $request->estado;
        }

        if ($request->filled('sistema')) {
            $filtros['sistema'] = $request->sistema;
        }

        if ($request->filled('organizacion')) {
            $filtros['organizacion'] = $request->organizacion;
        }

        if ($request->filled('search')) {
            $filtros['search'] = $request->search;
        }

        return $filtros;
    }

    /**
     * Obtener servicios relacionados
     */
    private function getRelacionados(Servicio $servicio): array
    {
        return [
            'servicios_similares' => Servicio::where('ID_H_O_D', $servicio->ID_H_O_D)
                ->where('Servicio_ID', '!=', $servicio->Servicio_ID)
                ->where('Estado', 'Activo')
                ->limit(5)
                ->get()
                ->map(function ($servicio) {
                    return [
                        'id' => $servicio->Servicio_ID,
                        'nombre' => $servicio->Nom_Serv,
                        'estado' => $servicio->Estado
                    ];
                })
        ];
    }
} 