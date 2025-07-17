<?php

namespace App\Http\Controllers;

use App\Models\CategoriaPos;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategoriaPosOptimizedController extends BaseApiController
{
    public function __construct()
    {
        parent::__construct();
        $this->model = CategoriaPos::class;
        
        // Configurar campos que se pueden buscar
        $this->searchableFields = [
            'Nom_Cat',
            'Descripcion',
            'Sistema',
            'ID_H_O_D'
        ];
        
        // Configurar campos que se pueden ordenar
        $this->sortableFields = [
            'Cat_ID',
            'Nom_Cat',
            'Estado',
            'Cod_Estado',
            'Sistema',
            'ID_H_O_D',
            'Agregadoel',
            'created_at',
            'updated_at'
        ];
        
        // Configurar filtros disponibles
        $this->filterableFields = [
            'Estado' => ['type' => 'exact'],
            'Cod_Estado' => ['type' => 'exact'],
            'Sistema' => ['type' => 'in'],
            'ID_H_O_D' => ['type' => 'like'],
            'Agregadoel' => ['type' => 'date_range']
        ];
        
        // No hay relaciones para incluir en este modelo
        $this->includableRelations = [];
    }

    /**
     * Crear nueva categoría
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'Nom_Cat' => 'required|string|max:255|unique:categoriaspos,Nom_Cat',
                'Descripcion' => 'nullable|string|max:1000',
                'Estado' => 'required|in:Vigente,Descontinuado',
                'Sistema' => 'required|string|max:50',
                'ID_H_O_D' => 'required|string|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            
            // Establecer valores automáticos
            $data['Cod_Estado'] = $data['Estado'] === 'Vigente' ? 'V' : 'D';
            $data['Agregadoel'] = Carbon::now();
            $data['Agregado_Por'] = $request->user()->name ?? 'Sistema';

            $categoria = CategoriaPos::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Categoría creada exitosamente',
                'data' => $categoria
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la categoría',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar categoría específica
     */
    public function show($id): JsonResponse
    {
        try {
            $categoria = CategoriaPos::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $categoria
            ]);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada'
            ], 404);
        }
    }

    /**
     * Actualizar categoría
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $categoria = CategoriaPos::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'Nom_Cat' => 'required|string|max:255|unique:categoriaspos,Nom_Cat,' . $id . ',Cat_ID',
                'Descripcion' => 'nullable|string|max:1000',
                'Estado' => 'required|in:Vigente,Descontinuado',
                'Sistema' => 'required|string|max:50',
                'ID_H_O_D' => 'required|string|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['Cod_Estado'] = $data['Estado'] === 'Vigente' ? 'V' : 'D';
            $data['Modificado_Por'] = $request->user()->name ?? 'Sistema';
            $data['Modificadoel'] = Carbon::now();

            $categoria->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Categoría actualizada exitosamente',
                'data' => $categoria
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la categoría',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar categoría
     */
    public function destroy($id): JsonResponse
    {
        try {
            $categoria = CategoriaPos::findOrFail($id);
            
            // Verificar si la categoría está siendo utilizada
            $isUsed = $this->isCategoryUsed($id);
            
            if ($isUsed) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar la categoría porque está siendo utilizada'
                ], 409);
            }
            
            $categoria->delete();

            return response()->json([
                'success' => true,
                'message' => 'Categoría eliminada exitosamente'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la categoría',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Implementación requerida: Calcular estadísticas
     */
    protected function calculateStats(): array
    {
        return [
            'total' => CategoriaPos::count(),
            'vigentes' => CategoriaPos::where('Estado', 'Vigente')->count(),
            'descontinuadas' => CategoriaPos::where('Estado', 'Descontinuado')->count(),
            'este_mes' => CategoriaPos::whereMonth('Agregadoel', Carbon::now()->month)
                                    ->whereYear('Agregadoel', Carbon::now()->year)
                                    ->count(),
            'este_año' => CategoriaPos::whereYear('Agregadoel', Carbon::now()->year)->count(),
            'por_sistema' => CategoriaPos::select('Sistema', DB::raw('count(*) as total'))
                                        ->groupBy('Sistema')
                                        ->pluck('total', 'Sistema')
                                        ->toArray(),
            'ultimas_creadas' => CategoriaPos::orderBy('Agregadoel', 'desc')
                                            ->limit(5)
                                            ->get(['Cat_ID', 'Nom_Cat', 'Agregadoel'])
        ];
    }

    /**
     * Implementación requerida: Obtener registros activos
     */
    protected function getActiveRecords()
    {
        return CategoriaPos::where('Estado', 'Vigente')
                          ->select('Cat_ID', 'Nom_Cat', 'Descripcion')
                          ->orderBy('Nom_Cat')
                          ->get();
    }

    /**
     * Campo de ordenamiento por defecto
     */
    protected function getDefaultSortField(): string
    {
        return 'Cat_ID';
    }

    /**
     * Verificar si la categoría está siendo utilizada
     */
    private function isCategoryUsed($categoryId): bool
    {
        // Verificar en tablas relacionadas si las hay
        // Por ejemplo, productos, servicios, etc.
        
        // return DB::table('productos')->where('categoria_id', $categoryId)->exists() ||
        //        DB::table('servicios')->where('categoria_id', $categoryId)->exists();
        
        // Por ahora retornamos false, pero se debe implementar según las relaciones reales
        return false;
    }

    /**
     * Exportar categorías (ejemplo de funcionalidad adicional)
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $format = $request->input('format', 'json');
            
            $query = CategoriaPos::query();
            
            // Aplicar filtros si existen
            if ($request->has('estado')) {
                $query->where('Estado', $request->estado);
            }
            
            $categorias = $query->orderBy('Nom_Cat')->get();
            
            switch ($format) {
                case 'csv':
                    return $this->exportToCsv($categorias);
                case 'excel':
                    return $this->exportToExcel($categorias);
                default:
                    return response()->json([
                        'success' => true,
                        'data' => $categorias,
                        'format' => 'json'
                    ]);
            }
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al exportar categorías',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Búsqueda avanzada con múltiples criterios
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = CategoriaPos::query();
            
            // Búsqueda por nombre (más flexible)
            if ($request->has('nombre')) {
                $query->where('Nom_Cat', 'LIKE', '%' . $request->nombre . '%');
            }
            
            // Búsqueda por rango de fechas
            if ($request->has('fecha_desde')) {
                $query->where('Agregadoel', '>=', $request->fecha_desde);
            }
            
            if ($request->has('fecha_hasta')) {
                $query->where('Agregadoel', '<=', $request->fecha_hasta);
            }
            
            // Búsqueda por múltiples sistemas
            if ($request->has('sistemas')) {
                $sistemas = explode(',', $request->sistemas);
                $query->whereIn('Sistema', $sistemas);
            }
            
            $categorias = $query->orderBy('Nom_Cat')->paginate(
                $request->input('per_page', 15)
            );
            
            return response()->json([
                'success' => true,
                'data' => $categorias
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la búsqueda',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener categorías populares (más utilizadas)
     */
    public function popular(Request $request): JsonResponse
    {
        try {
            // Esta implementación dependería de las tablas relacionadas
            $limit = $request->input('limit', 10);
            
            $categorias = CategoriaPos::where('Estado', 'Vigente')
                                     ->orderBy('Nom_Cat')
                                     ->limit($limit)
                                     ->get();
            
            return response()->json([
                'success' => true,
                'data' => $categorias
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener categorías populares',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Métodos auxiliares para exportación
    private function exportToCsv($data)
    {
        // Implementar exportación a CSV
        return response()->json([
            'success' => true,
            'message' => 'Exportación CSV no implementada aún',
            'data' => $data
        ]);
    }

    private function exportToExcel($data)
    {
        // Implementar exportación a Excel
        return response()->json([
            'success' => true,
            'message' => 'Exportación Excel no implementada aún',
            'data' => $data
        ]);
    }
} 