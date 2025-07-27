<?php

namespace App\Http\Controllers;

use App\Models\ComponenteActivo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;

class ComponenteActivoController extends BaseApiController
{
    protected $model = ComponenteActivo::class;
    protected $primaryKey = 'id';
    protected $searchableFields = ['nombre', 'descripcion', 'codigo'];
    protected $sortableFields = ['id', 'nombre', 'activo', 'codigo', 'created_at'];
    protected $filterableFields = ['activo', 'codigo'];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            // Construir query base con filtro de licencia
            $query = $this->model::query();
            $query->where('Id_Licencia', $licencia);

            // Aplicar búsqueda si se proporciona
            if ($request->has('search') && !empty($request->search['value'])) {
                $searchValue = '%' . $request->search['value'] . '%';
                $query->where(function($q) use ($searchValue) {
                    $q->where('nombre', 'LIKE', $searchValue)
                      ->orWhere('descripcion', 'LIKE', $searchValue)
                      ->orWhere('codigo', 'LIKE', $searchValue);
                });
            }

            // Total de registros sin filtrar
            $totalRecords = ComponenteActivo::where('Id_Licencia', $licencia)->count();

            // Aplicar ordenamiento
            if ($request->has('order')) {
                $orderColumn = $request->order[0]['column'];
                $orderDir = $request->order[0]['dir'];
                $columns = ['id', 'nombre', 'activo', 'codigo', 'created_at'];
                
                if (isset($columns[$orderColumn])) {
                    $query->orderBy($columns[$orderColumn], $orderDir);
                }
            } else {
                $query->orderBy('id', 'desc');
            }

            // Aplicar paginación
            if ($request->has('start') && $request->has('length')) {
                $query->skip($request->start)->take($request->length);
            }

            $componentes = $query->get();
            $filteredRecords = $query->count();

            // Transformar los datos para que coincidan con el frontend
            $componentes = $componentes->map(function($componente) {
                return [
                    'ID_Comp' => $componente->id,
                    'Nom_Com' => $componente->nombre,
                    'Descripcion' => $componente->descripcion,
                    'Estado' => $componente->activo ? 'Vigente' : 'Descontinuado',
                    'Cod_Estado' => $componente->activo ? 'V' : 'D',
                    'Sistema' => 'POS',
                    'Organizacion' => 'Saluda',
                    'Agregadoel' => $componente->created_at,
                    'Agregado_Por' => 'Sistema'
                ];
            });

            return response()->json([
                'data' => $componentes,
                'recordsTotal' => $totalRecords,
                'recordsFiltered' => $filteredRecords,
                'draw' => $request->draw
            ]);
        } catch (\Exception $e) {
            Log::error('Error en ComponenteActivoController@index: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los componentes activos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'Nom_Com' => 'required|string|max:255|unique:componentes_activos,nombre,NULL,id,Id_Licencia,' . $licencia,
                'Descripcion' => 'nullable|string|max:500',
                'Estado' => 'required|in:Vigente,Descontinuado',
                'Cod_Estado' => 'required|in:V,D',
                'Sistema' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Transformar los datos del frontend al formato de la base de datos
            $data = [
                'nombre' => $request->Nom_Com,
                'descripcion' => $request->Descripcion,
                'codigo' => $request->Nom_Com, // Usar el nombre como código por defecto
                'activo' => $request->Estado === 'Vigente',
                'Id_Licencia' => $licencia, // Asignar la licencia automáticamente
            ];

            $componente = ComponenteActivo::create($data);

            // Transformar la respuesta al formato del frontend
            $response = [
                'ID_Comp' => $componente->id,
                'Nom_Com' => $componente->nombre,
                'Descripcion' => $componente->descripcion,
                'Estado' => $componente->activo ? 'Vigente' : 'Descontinuado',
                'Cod_Estado' => $componente->activo ? 'V' : 'D',
                'Sistema' => 'POS',
                'Organizacion' => 'Saluda',
                'Agregadoel' => $componente->created_at,
                'Agregado_Por' => 'Sistema'
            ];

            return response()->json([
                'success' => true,
                'message' => 'Componente creado exitosamente',
                'data' => $response
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error en ComponenteActivoController@store: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el componente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            $componente = ComponenteActivo::where('Id_Licencia', $licencia)
                ->where('id', $id)
                ->firstOrFail();
            
            // Transformar la respuesta al formato del frontend
            $response = [
                'ID_Comp' => $componente->id,
                'Nom_Com' => $componente->nombre,
                'Descripcion' => $componente->descripcion,
                'Estado' => $componente->activo ? 'Vigente' : 'Descontinuado',
                'Cod_Estado' => $componente->activo ? 'V' : 'D',
                'Sistema' => 'POS',
                'Organizacion' => 'Saluda',
                'Agregadoel' => $componente->created_at,
                'Agregado_Por' => 'Sistema'
            ];

            return response()->json([
                'success' => true,
                'data' => $response
            ]);
        } catch (\Exception $e) {
            Log::error('Error en ComponenteActivoController@show: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el componente: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'Nom_Com' => 'required|string|max:255|unique:componentes_activos,nombre,' . $id . ',id,Id_Licencia,' . $licencia,
                'Descripcion' => 'nullable|string|max:500',
                'Estado' => 'required|in:Vigente,Descontinuado',
                'Cod_Estado' => 'required|in:V,D',
                'Sistema' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $componente = ComponenteActivo::where('Id_Licencia', $licencia)
                ->where('id', $id)
                ->firstOrFail();

            // Transformar los datos del frontend al formato de la base de datos
            $data = [
                'nombre' => $request->Nom_Com,
                'descripcion' => $request->Descripcion,
                'codigo' => $request->Nom_Com, // Usar el nombre como código
                'activo' => $request->Estado === 'Vigente'
            ];

            $componente->update($data);

            // Transformar la respuesta al formato del frontend
            $response = [
                'ID_Comp' => $componente->id,
                'Nom_Com' => $componente->nombre,
                'Descripcion' => $componente->descripcion,
                'Estado' => $componente->activo ? 'Vigente' : 'Descontinuado',
                'Cod_Estado' => $componente->activo ? 'V' : 'D',
                'Sistema' => 'POS',
                'Organizacion' => 'Saluda',
                'Agregadoel' => $componente->created_at,
                'Agregado_Por' => 'Sistema'
            ];

            return response()->json([
                'success' => true,
                'message' => 'Componente actualizado exitosamente',
                'data' => $response
            ]);
        } catch (\Exception $e) {
            Log::error('Error en ComponenteActivoController@update: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el componente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            $componente = ComponenteActivo::where('Id_Licencia', $licencia)
                ->where('id', $id)
                ->firstOrFail();
            
            $componente->delete();

            return response()->json([
                'success' => true,
                'message' => 'Componente eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error en ComponenteActivoController@destroy: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el componente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get components by status.
     */
    public function getByEstado(string $estado): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            $activo = $estado === 'Vigente';
            $componentes = ComponenteActivo::where('Id_Licencia', $licencia)
                ->where('activo', $activo)
                ->get();
            
            // Transformar los datos para que coincidan con el frontend
            $componentes = $componentes->map(function($componente) {
                return [
                    'ID_Comp' => $componente->id,
                    'Nom_Com' => $componente->nombre,
                    'Descripcion' => $componente->descripcion,
                    'Estado' => $componente->activo ? 'Vigente' : 'Descontinuado',
                    'Cod_Estado' => $componente->activo ? 'V' : 'D',
                    'Sistema' => 'POS',
                    'Organizacion' => 'Saluda',
                    'Agregadoel' => $componente->created_at,
                    'Agregado_Por' => 'Sistema'
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $componentes
            ]);
        } catch (\Exception $e) {
            Log::error('Error en ComponenteActivoController@getByEstado: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los componentes por estado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get components by organization.
     */
    public function getByOrganizacion(string $organizacion): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

            if (!$licencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            $componentes = ComponenteActivo::where('Id_Licencia', $licencia)->get();

            return response()->json([
                'success' => true,
                'data' => $componentes,
                'message' => 'Componentes activos filtrados por organización'
            ]);
        } catch (\Exception $e) {
            Log::error('Error en ComponenteActivoController@getByOrganizacion: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener componentes activos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Override buildOptimizedQuery para asegurar filtrado por licencia
     */
    protected function buildOptimizedQuery(Request $request): Builder
    {
        // Obtener el usuario autenticado
        $user = auth('api')->user();
        $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

        // Construir query base con filtro de licencia
        $query = $this->model::query();

        if ($licencia) {
            $query->where('Id_Licencia', $licencia);
        }

        // Optimización: Solo seleccionar campos necesarios si se especifican
        if ($request->has('fields')) {
            $fields = explode(',', $request->fields);
            $validFields = array_intersect($fields, $this->getAllowedFields());
            if (!empty($validFields)) {
                $query->select($validFields);
            }
        }

        return $query;
    }

    /**
     * Calcular estadísticas específicas del modelo
     */
    protected function calculateStats(): array
    {
        // Obtener el usuario autenticado
        $user = auth('api')->user();
        $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

        if (!$licencia) {
            return [];
        }

        return [
            'total' => ComponenteActivo::where('Id_Licencia', $licencia)->count(),
            'vigentes' => ComponenteActivo::where('Id_Licencia', $licencia)->where('activo', true)->count(),
            'descontinuados' => ComponenteActivo::where('Id_Licencia', $licencia)->where('activo', false)->count(),
            'este_mes' => ComponenteActivo::where('Id_Licencia', $licencia)->whereMonth('created_at', now()->month)->count(),
        ];
    }

    /**
     * Obtener registros activos específicos del modelo
     */
    protected function getActiveRecords()
    {
        // Obtener el usuario autenticado
        $user = auth('api')->user();
        $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;

        if (!$licencia) {
            return collect([]);
        }

        return ComponenteActivo::where('Id_Licencia', $licencia)
            ->where('activo', true)
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get();
    }
} 