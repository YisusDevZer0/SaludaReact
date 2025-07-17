<?php

namespace App\Http\Controllers;

use App\Models\CategoriaPos;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CategoriaPosController extends BaseApiController
{
    protected $model = CategoriaPos::class;
    protected $modelName = 'categoría';
    protected $primaryKey = 'Cat_ID';
    
    protected $searchableFields = [
        'Nom_Cat',
        'Estado', 
        'Sistema',
        'Agregado_Por'
    ];
    
    protected $sortableFields = [
        'Cat_ID',
        'Nom_Cat',
        'Estado',
        'Sistema',
        'Agregadoel'
    ];
    
    protected $filterableFields = [
        'Estado' => [
            'type' => 'exact',
            'options' => ['Vigente', 'No Vigente']
        ],
        'Sistema' => [
            'type' => 'exact', 
            'options' => ['POS', 'Hospitalario', 'Dental']
        ]
    ];

    /**
     * Display a listing of the resource with server-side processing.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Usar el método optimizado del BaseApiController
            return parent::index($request);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener categorías: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
            $validator = Validator::make($request->all(), [
            'Nom_Cat' => 'required|string|max:255|unique:categorias_pos',
            'Estado' => 'required|in:Vigente,No Vigente',
            'Sistema' => 'required|in:POS,Hospitalario,Dental',
            'ID_H_O_D' => 'nullable|integer'
            ]);

            if ($validator->fails()) {
                return response()->json([
                'error' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

        try {
            $categoria = CategoriaPos::create([
                'Nom_Cat' => $request->Nom_Cat,
                'Estado' => $request->Estado,
                'Cod_Estado' => $request->Estado === 'Vigente' ? 1 : 0,
                'Sistema' => $request->Sistema,
                'ID_H_O_D' => $request->ID_H_O_D ?? 1,
                'Agregado_Por' => auth('api')->user()->Pos_ID ?? 1,
                'Agregadoel' => now()
            ]);

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
            $categoria = CategoriaPos::findOrFail($id);
            return response()->json([
                'data' => $categoria
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Categoría no encontrada'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
            $validator = Validator::make($request->all(), [
                'Nom_Cat' => 'required|string|max:255|unique:categorias_pos,Nom_Cat,' . $id . ',Cat_ID',
            'Estado' => 'required|in:Vigente,No Vigente',
            'Sistema' => 'required|in:POS,Hospitalario,Dental',
            'ID_H_O_D' => 'nullable|integer'
            ]);

            if ($validator->fails()) {
                return response()->json([
                'error' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

        try {
            $categoria = CategoriaPos::findOrFail($id);
            $categoria->update([
                'Nom_Cat' => $request->Nom_Cat,
                'Estado' => $request->Estado,
                'Cod_Estado' => $request->Estado === 'Vigente' ? 1 : 0,
                'Sistema' => $request->Sistema,
                'ID_H_O_D' => $request->ID_H_O_D
            ]);

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
            $categoria = CategoriaPos::findOrFail($id);
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
            $categorias = CategoriaPos::where('Estado', $estado)->get();
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
     * Get categories by organization
     */
    public function getByOrganizacion(string $organizacion): JsonResponse
    {
        try {
            $categorias = CategoriaPos::where('ID_H_O_D', $organizacion)->get();
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
            $totalCategorias = CategoriaPos::count();
            $categoriasVigentes = CategoriaPos::where('Estado', 'Vigente')->count();
            $categoriasPOS = CategoriaPos::where('Sistema', 'POS')->count();
            $categoriasHospitalario = CategoriaPos::where('Sistema', 'Hospitalario')->count();
            $categoriasDental = CategoriaPos::where('Sistema', 'Dental')->count();

            return [
                'total_categorias' => $totalCategorias,
                'categorias_vigentes' => $categoriasVigentes,
                'categorias_no_vigentes' => $totalCategorias - $categoriasVigentes,
                'por_sistema' => [
                    'POS' => $categoriasPOS,
                    'Hospitalario' => $categoriasHospitalario,
                    'Dental' => $categoriasDental
                ],
                'porcentaje_vigentes' => $totalCategorias > 0 ? round(($categoriasVigentes / $totalCategorias) * 100, 2) : 0
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
            return CategoriaPos::where('Estado', 'Vigente')->count();
        } catch (\Exception $e) {
            return 0;
        }
    }
}
