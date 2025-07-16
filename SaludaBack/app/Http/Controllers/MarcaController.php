<?php

namespace App\Http\Controllers;

use App\Models\Marca;
use App\Http\Requests\MarcaRequest;
use App\Http\Resources\MarcaResource;
use App\Http\Resources\MarcaCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MarcaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Marca::query();

            // Eager loading de relaciones si se solicita
            if ($request->boolean('with_servicios')) {
                $query->with('servicios');
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

            if ($request->filled('pais_origen')) {
                $query->where('Pais_Origen', $request->pais_origen);
            }

            if ($request->boolean('con_logo')) {
                $query->whereNotNull('Logo_URL');
            }

            if ($request->boolean('con_sitio_web')) {
                $query->whereNotNull('Sitio_Web');
            }

            // Búsqueda por texto
            if ($request->filled('search')) {
                $searchTerm = '%' . $request->search . '%';
                $query->where(function($q) use ($searchTerm) {
                    $q->where('Nom_Marca', 'LIKE', $searchTerm)
                      ->orWhere('Descripcion', 'LIKE', $searchTerm)
                      ->orWhere('Pais_Origen', 'LIKE', $searchTerm)
                      ->orWhere('Agregado_Por', 'LIKE', $searchTerm);
                });
            }

            // DataTable search para compatibilidad con frontend existente
            if ($request->has('search.value') && !empty($request->input('search.value'))) {
                $searchValue = '%' . $request->input('search.value') . '%';
                $query->where(function($q) use ($searchValue) {
                    $q->where('Nom_Marca', 'LIKE', $searchValue)
                      ->orWhere('Descripcion', 'LIKE', $searchValue)
                      ->orWhere('Pais_Origen', 'LIKE', $searchValue)
                      ->orWhere('Agregado_Por', 'LIKE', $searchValue);
                });
            }

            // Ordenamiento
            $orderBy = $request->input('order_by', 'created_at');
            $orderDirection = $request->input('order_direction', 'desc');
            
            // DataTable ordering para compatibilidad
            if ($request->has('order.0.column')) {
                $columns = ['Marca_ID', 'Nom_Marca', 'Estado', 'Pais_Origen', 'created_at'];
                $orderColumnIndex = $request->input('order.0.column');
                $orderBy = $columns[$orderColumnIndex] ?? 'created_at';
                $orderDirection = $request->input('order.0.dir', 'desc');
            }

            $query->orderBy($orderBy, $orderDirection);

            // Paginación
            if ($request->has('paginate') && $request->boolean('paginate')) {
                $perPage = $request->input('per_page', 15);
                $marcas = $query->paginate($perPage);
                return response()->json(new MarcaCollection($marcas));
            }

            // DataTable pagination para compatibilidad
            if ($request->has('start') && $request->has('length')) {
                $start = (int) $request->input('start', 0);
                $length = (int) $request->input('length', 10);
                
                $totalRecords = Marca::count();
                $filteredRecords = $query->count();
                
                $marcas = $query->skip($start)->take($length)->get();
                
                return response()->json([
                    'draw' => (int) $request->input('draw', 1),
                    'recordsTotal' => $totalRecords,
                    'recordsFiltered' => $filteredRecords,
                    'data' => MarcaResource::collection($marcas)
                ]);
            }

            // Respuesta estándar
            $marcas = $query->get();
            return response()->json(new MarcaCollection($marcas));

        } catch (\Exception $e) {
            Log::error('Error fetching marcas: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener las marcas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MarcaRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $data = $request->getValidatedDataWithDefaults();
            $marca = Marca::create($data);

            // Asociar servicios si se proporcionan
            if ($request->has('servicios') && is_array($request->servicios)) {
                $this->syncServicios($marca, $request);
            }

            DB::commit();

            return response()->json([
                'message' => 'Marca creada exitosamente',
                'data' => new MarcaResource($marca->load('servicios'))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating marca: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al crear la marca',
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
            $query = Marca::where('Marca_ID', $id);

            // Incluir relaciones si se solicita
            if ($request->boolean('with_servicios')) {
                $query->with('servicios');
            }

            $marca = $query->firstOrFail();

            return response()->json([
                'data' => new MarcaResource($marca)
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Marca no encontrada'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching marca: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener la marca',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MarcaRequest $request, $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $marca = Marca::findOrFail($id);
            $data = $request->getValidatedDataWithDefaults();
            
            $marca->update($data);

            // Actualizar asociaciones con servicios si se proporcionan
            if ($request->has('servicios')) {
                $this->syncServicios($marca, $request);
            }

            DB::commit();

            return response()->json([
                'message' => 'Marca actualizada exitosamente',
                'data' => new MarcaResource($marca->load('servicios'))
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Marca no encontrada'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating marca: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al actualizar la marca',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $marca = Marca::findOrFail($id);
            
            // Soft delete para mantener integridad referencial
            $marca->delete();

            return response()->json([
                'message' => 'Marca eliminada exitosamente'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Marca no encontrada'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting marca: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al eliminar la marca',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle brand status between Activo and Inactivo.
     */
    public function toggleStatus($id): JsonResponse
    {
        try {
            $marca = Marca::findOrFail($id);
            
            if ($marca->Estado === 'Activo') {
                $marca->desactivar();
                $message = 'Marca desactivada exitosamente';
            } else {
                $marca->activar();
                $message = 'Marca activada exitosamente';
            }

            return response()->json([
                'message' => $message,
                'data' => new MarcaResource($marca)
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Marca no encontrada'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error toggling marca status: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al cambiar el estado de la marca',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get brands by estado.
     */
    public function getByEstado($estado): JsonResponse
    {
        try {
            $marcas = Marca::where('Estado', $estado)->get();
            return response()->json(new MarcaCollection($marcas));
        } catch (\Exception $e) {
            Log::error('Error fetching marcas by estado: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener marcas por estado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get brands by sistema.
     */
    public function getBySistema($sistema): JsonResponse
    {
        try {
            $marcas = Marca::where('Sistema', $sistema)->get();
            return response()->json(new MarcaCollection($marcas));
        } catch (\Exception $e) {
            Log::error('Error fetching marcas by sistema: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener marcas por sistema',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get brands by country.
     */
    public function getByPais($pais): JsonResponse
    {
        try {
            $marcas = Marca::where('Pais_Origen', $pais)->get();
            return response()->json(new MarcaCollection($marcas));
        } catch (\Exception $e) {
            Log::error('Error fetching marcas by pais: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener marcas por país',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available countries.
     */
    public function getPaisesDisponibles(): JsonResponse
    {
        try {
            $paises = Marca::paisesDisponibles();
            return response()->json([
                'data' => $paises
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching paises disponibles: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener países disponibles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sync servicios with marca.
     */
    private function syncServicios(Marca $marca, MarcaRequest $request): void
    {
        $serviciosData = [];
        
        foreach ($request->servicios as $index => $servicioId) {
            $serviciosData[$servicioId] = [
                'precio_especial' => $request->input("servicios_precios.{$index}"),
                'notas' => $request->input("servicios_notas.{$index}"),
                'agregado_por' => auth()->user()->Nombre_Apellidos ?? 'Sistema'
            ];
        }
        
        $marca->servicios()->sync($serviciosData);
    }
}
