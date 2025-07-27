<?php

namespace App\Http\Controllers;

use App\Models\CategoriaPos;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class CategoriaPosController extends BaseApiController
{
    protected $model = CategoriaPos::class;
    protected $modelName = 'categoría';
    protected $primaryKey = 'id';
    
    protected $searchableFields = [
        'nombre',
        'descripcion',
        'codigo'
    ];
    
    protected $sortableFields = [
        'id',
        'nombre',
        'codigo',
        'orden',
        'activa',
        'visible_en_pos',
        'created_at',
        'updated_at'
    ];
    
    protected $filterableFields = [
        'activa' => [
            'type' => 'exact',
            'options' => [true, false]
        ],
        'visible_en_pos' => [
            'type' => 'exact',
            'options' => [true, false]
        ]
    ];

    /**
     * Display a listing of the resource with server-side processing.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            
            if (!$user) {
                return response()->json([
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'error' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            // Usar el método optimizado del BaseApiController
            return parent::index($request);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener categorías: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Construir query base optimizada con filtro de licencia
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Obtener el usuario autenticado
        $user = auth('api')->user();
        
        if (!$user) {
            return response()->json([
                'error' => 'Usuario no autenticado'
            ], 401);
        }

        // Obtener la licencia del usuario
        $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
        
        if (!$licencia) {
            return response()->json([
                'error' => 'Licencia no encontrada para el usuario'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100|unique:categorias_pos,nombre,NULL,id,Id_Licencia,' . $licencia,
            'descripcion' => 'nullable|string|max:1000',
            'codigo' => 'required|string|max:50|unique:categorias_pos,codigo,NULL,id,Id_Licencia,' . $licencia,
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:7',
            'orden' => 'nullable|integer|min:0',
            'activa' => 'boolean',
            'visible_en_pos' => 'boolean',
            'comision' => 'nullable|numeric|min:0|max:100',
            'categoria_padre_id' => 'nullable|exists:categorias_pos,id,Id_Licencia,' . $licencia
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            $data['Id_Licencia'] = $licencia; // Asignar la licencia automáticamente

            $categoria = CategoriaPos::create($data);

            return response()->json([
                'message' => 'Categoría creada exitosamente',
                'data' => $categoria
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear categoría: ' . $e->getMessage()
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
            
            if (!$user) {
                return response()->json([
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'error' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            $categoria = CategoriaPos::where('id', $id)
                ->where('Id_Licencia', $licencia)
                ->first();

            if (!$categoria) {
                return response()->json([
                    'error' => 'Categoría no encontrada'
                ], 404);
            }

            return response()->json([
                'data' => $categoria
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // Obtener el usuario autenticado
        $user = auth('api')->user();
        
        if (!$user) {
            return response()->json([
                'error' => 'Usuario no autenticado'
            ], 401);
        }

        // Obtener la licencia del usuario
        $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
        
        if (!$licencia) {
            return response()->json([
                'error' => 'Licencia no encontrada para el usuario'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100|unique:categorias_pos,nombre,' . $id . ',id,Id_Licencia,' . $licencia,
            'descripcion' => 'nullable|string|max:1000',
            'codigo' => 'required|string|max:50|unique:categorias_pos,codigo,' . $id . ',id,Id_Licencia,' . $licencia,
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:7',
            'orden' => 'nullable|integer|min:0',
            'activa' => 'boolean',
            'visible_en_pos' => 'boolean',
            'comision' => 'nullable|numeric|min:0|max:100',
            'categoria_padre_id' => 'nullable|exists:categorias_pos,id,Id_Licencia,' . $licencia
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Datos de validación incorrectos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $categoria = CategoriaPos::where('id', $id)
                ->where('Id_Licencia', $licencia)
                ->first();

            if (!$categoria) {
                return response()->json([
                    'error' => 'Categoría no encontrada'
                ], 404);
            }

            $categoria->update($validator->validated());

            return response()->json([
                'message' => 'Categoría actualizada exitosamente',
                'data' => $categoria
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar categoría: ' . $e->getMessage()
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
            
            if (!$user) {
                return response()->json([
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'error' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            $categoria = CategoriaPos::where('id', $id)
                ->where('Id_Licencia', $licencia)
                ->first();

            if (!$categoria) {
                return response()->json([
                    'error' => 'Categoría no encontrada'
                ], 404);
            }

            $categoria->delete();

            return response()->json([
                'message' => 'Categoría eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get categories by status
     */
    public function getByEstado(string $estado): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            
            if (!$user) {
                return response()->json([
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'error' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            $activa = $estado === 'Vigente';
            $categorias = CategoriaPos::where('activa', $activa)
                ->where('Id_Licencia', $licencia)
                ->get();

            return response()->json([
                'data' => $categorias
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener categorías por estado'
            ], 500);
        }
    }

    /**
     * Get categories by organization (simulado)
     */
    public function getByOrganizacion(string $organizacion): JsonResponse
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            
            if (!$user) {
                return response()->json([
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return response()->json([
                    'error' => 'Licencia no encontrada para el usuario'
                ], 400);
            }

            // Filtrar por licencia del usuario
            $categorias = CategoriaPos::where('activa', true)
                ->where('Id_Licencia', $licencia)
                ->get();

            return response()->json([
                'data' => $categorias
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener categorías por organización'
            ], 500);
        }
    }

    /**
     * Calculate statistics for dashboard
     * Required abstract method from BaseApiController
     */
    protected function calculateStats(): array
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            
            if (!$user) {
                return ['error' => 'Usuario no autenticado'];
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return ['error' => 'Licencia no encontrada para el usuario'];
            }

            $totalCategorias = CategoriaPos::where('Id_Licencia', $licencia)->count();
            $categoriasActivas = CategoriaPos::where('activa', true)
                ->where('Id_Licencia', $licencia)
                ->count();
            $categoriasVisibles = CategoriaPos::where('visible_en_pos', true)
                ->where('Id_Licencia', $licencia)
                ->count();
            $categoriasRaiz = CategoriaPos::whereNull('categoria_padre_id')
                ->where('Id_Licencia', $licencia)
                ->count();

            return [
                'total_categorias' => $totalCategorias,
                'categorias_activas' => $categoriasActivas,
                'categorias_inactivas' => $totalCategorias - $categoriasActivas,
                'categorias_visibles_pos' => $categoriasVisibles,
                'categorias_raiz' => $categoriasRaiz,
                'porcentaje_activas' => $totalCategorias > 0 ? round(($categoriasActivas / $totalCategorias) * 100, 2) : 0
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'Error al calcular estadísticas: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get active records count
     * Required abstract method from BaseApiController
     */
    protected function getActiveRecords(): int
    {
        try {
            // Obtener el usuario autenticado
            $user = auth('api')->user();
            
            if (!$user) {
                return 0;
            }

            // Obtener la licencia del usuario
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
            
            if (!$licencia) {
                return 0;
            }

            return CategoriaPos::where('activa', true)
                ->where('Id_Licencia', $licencia)
                ->count();
        } catch (\Exception $e) {
            return 0;
        }
    }
}
