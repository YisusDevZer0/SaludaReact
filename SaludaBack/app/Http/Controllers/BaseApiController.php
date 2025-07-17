<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

abstract class BaseApiController extends Controller
{
    /**
     * Modelo que usa este controller
     */
    protected $model;
    
    /**
     * Campos que se pueden buscar
     */
    protected $searchableFields = [];
    
    /**
     * Campos que se pueden ordenar
     */
    protected $sortableFields = [];
    
    /**
     * Campos que se pueden filtrar
     */
    protected $filterableFields = [];
    
    /**
     * Relaciones que se pueden incluir
     */
    protected $includableRelations = [];
    
    /**
     * Límite máximo de registros por página
     */
    protected $maxPerPage = 100;
    
    /**
     * Registros por página por defecto
     */
    protected $defaultPerPage = 15;
    
    /**
     * Tiempo de cacheo en minutos para consultas estáticas
     */
    protected $cacheMinutes = 10;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->middleware('throttle:300,1')->only(['index']); // Rate limiting para consultas pesadas
    }

    /**
     * Listado optimizado con server-side processing
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $startTime = microtime(true);
            
            // Validar parámetros de entrada
            $this->validateIndexRequest($request);
            
            // Construir query optimizada
            $query = $this->buildOptimizedQuery($request);
            
            // Aplicar filtros
            $query = $this->applyFilters($query, $request);
            
            // Aplicar búsqueda
            $query = $this->applySearch($query, $request);
            
            // Contar total antes de aplicar límites (optimizado)
            $totalRecords = $this->getOptimizedCount($query);
            
            // Aplicar ordenamiento
            $query = $this->applyOrdering($query, $request);
            
            // Aplicar paginación
            $query = $this->applyPagination($query, $request);
            
            // Incluir relaciones si se solicitan
            $query = $this->includeRelations($query, $request);
            
            // Ejecutar consulta
            $data = $query->get();
            
            // Métricas de performance
            $executionTime = round((microtime(true) - $startTime) * 1000, 2);
            
            // Log si la consulta es lenta
            if ($executionTime > 1000) { // > 1 segundo
                Log::warning('Consulta lenta detectada', [
                    'controller' => get_class($this),
                    'execution_time' => $executionTime . 'ms',
                    'total_records' => $totalRecords,
                    'request_params' => $request->all()
                ]);
            }
            
            return $this->buildIndexResponse($data, $totalRecords, $request, $executionTime);
            
        } catch (\Exception $e) {
            Log::error('Error en index: ' . $e->getMessage(), [
                'controller' => get_class($this),
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos',
                'error' => app()->environment('local') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Validar parámetros de la request
     */
    protected function validateIndexRequest(Request $request): void
    {
        $request->validate([
            'page' => 'integer|min:1',
            'per_page' => 'integer|min:1|max:' . $this->maxPerPage,
            'sort_by' => 'string|in:' . implode(',', $this->sortableFields),
            'sort_direction' => 'string|in:asc,desc',
            'search' => 'string|max:255',
            'start' => 'integer|min:0', // Para compatibilidad con DataTables
            'length' => 'integer|min:1|max:' . $this->maxPerPage,
        ]);
    }

    /**
     * Construir query base optimizada
     */
    protected function buildOptimizedQuery(Request $request): Builder
    {
        $query = $this->model::query();
        
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
     * Aplicar filtros dinámicos
     */
    protected function applyFilters(Builder $query, Request $request): Builder
    {
        foreach ($this->filterableFields as $field => $config) {
            if ($request->has($field) && $request->filled($field)) {
                $value = $request->input($field);
                
                switch ($config['type'] ?? 'exact') {
                    case 'like':
                        $query->where($field, 'LIKE', "%{$value}%");
                        break;
                    case 'in':
                        if (is_array($value)) {
                            $query->whereIn($field, $value);
                        }
                        break;
                    case 'date_range':
                        if ($request->has($field . '_from')) {
                            $query->where($field, '>=', $request->input($field . '_from'));
                        }
                        if ($request->has($field . '_to')) {
                            $query->where($field, '<=', $request->input($field . '_to'));
                        }
                        break;
                    case 'numeric_range':
                        if ($request->has($field . '_min')) {
                            $query->where($field, '>=', $request->input($field . '_min'));
                        }
                        if ($request->has($field . '_max')) {
                            $query->where($field, '<=', $request->input($field . '_max'));
                        }
                        break;
                    default:
                        $query->where($field, $value);
                }
            }
        }
        
        return $query;
    }

    /**
     * Aplicar búsqueda de texto completo optimizada
     */
    protected function applySearch(Builder $query, Request $request): Builder
    {
        $searchTerm = $request->input('search');
        
        if (!empty($searchTerm) && !empty($this->searchableFields)) {
            $query->where(function($q) use ($searchTerm) {
                foreach ($this->searchableFields as $field) {
                    // Usar índices FULLTEXT si están disponibles
                    if ($this->hasFullTextIndex($field)) {
                        $q->orWhereRaw("MATCH({$field}) AGAINST(? IN BOOLEAN MODE)", ["+{$searchTerm}*"]);
                    } else {
                        $q->orWhere($field, 'LIKE', "%{$searchTerm}%");
                    }
                }
            });
        }
        
        return $query;
    }

    /**
     * Obtener conteo optimizado
     */
    protected function getOptimizedCount(Builder $query): int
    {
        // Crear una copia del query para el conteo
        $countQuery = clone $query;
        
        // Remover ordenamiento y selecciones para optimizar el conteo
        $countQuery->getQuery()->orders = null;
        $countQuery->getQuery()->columns = null;
        
        // Usar aproximación para tablas muy grandes
        if ($this->shouldUseApproximateCount()) {
            return $this->getApproximateCount($countQuery);
        }
        
        return $countQuery->count();
    }

    /**
     * Aplicar ordenamiento
     */
    protected function applyOrdering(Builder $query, Request $request): Builder
    {
        $sortField = $request->input('sort_by', $this->getDefaultSortField());
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Validar campo de ordenamiento
        if (in_array($sortField, $this->sortableFields)) {
            $query->orderBy($sortField, $sortDirection);
        }
        
        return $query;
    }

    /**
     * Aplicar paginación optimizada
     */
    protected function applyPagination(Builder $query, Request $request): Builder
    {
        // Detectar si es DataTables o paginación estándar
        if ($request->has('start') && $request->has('length')) {
            // Formato DataTables
            $start = (int) $request->input('start', 0);
            $length = min((int) $request->input('length', $this->defaultPerPage), $this->maxPerPage);
            $query->skip($start)->take($length);
        } else {
            // Paginación estándar
            $page = (int) $request->input('page', 1);
            $perPage = min((int) $request->input('per_page', $this->defaultPerPage), $this->maxPerPage);
            $offset = ($page - 1) * $perPage;
            $query->skip($offset)->take($perPage);
        }
        
        return $query;
    }

    /**
     * Incluir relaciones
     */
    protected function includeRelations(Builder $query, Request $request): Builder
    {
        $includes = $request->input('include', []);
        if (is_string($includes)) {
            $includes = explode(',', $includes);
        }
        
        $validIncludes = array_intersect($includes, $this->includableRelations);
        
        if (!empty($validIncludes)) {
            $query->with($validIncludes);
        }
        
        return $query;
    }

    /**
     * Construir respuesta estandarizada
     */
    protected function buildIndexResponse($data, int $totalRecords, Request $request, float $executionTime): JsonResponse
    {
        $response = [
            'success' => true,
            'data' => $data,
            'meta' => [
                'total' => $totalRecords,
                'count' => $data->count(),
                'execution_time' => $executionTime . 'ms'
            ]
        ];
        
        // Agregar información de paginación
        if ($request->has('start') && $request->has('length')) {
            // Formato DataTables
            $response['draw'] = (int) $request->input('draw', 1);
            $response['recordsTotal'] = $totalRecords;
            $response['recordsFiltered'] = $totalRecords;
        } else {
            // Paginación estándar
            $page = (int) $request->input('page', 1);
            $perPage = min((int) $request->input('per_page', $this->defaultPerPage), $this->maxPerPage);
            
            $response['meta']['per_page'] = $perPage;
            $response['meta']['current_page'] = $page;
            $response['meta']['last_page'] = ceil($totalRecords / $perPage);
            $response['meta']['from'] = (($page - 1) * $perPage) + 1;
            $response['meta']['to'] = min($page * $perPage, $totalRecords);
        }
        
        return response()->json($response);
    }

    /**
     * Obtener estadísticas del modelo
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $cacheKey = $this->getStatsCacheKey();
            
            $stats = Cache::remember($cacheKey, $this->cacheMinutes, function () {
                return $this->calculateStats();
            });
            
            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en stats: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas'
            ], 500);
        }
    }

    /**
     * Obtener registros activos para selects
     */
    public function active(Request $request): JsonResponse
    {
        try {
            $cacheKey = $this->getActiveCacheKey();
            
            $activeRecords = Cache::remember($cacheKey, $this->cacheMinutes, function () {
                return $this->getActiveRecords();
            });
            
            return response()->json([
                'success' => true,
                'data' => $activeRecords
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en active: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener registros activos'
            ], 500);
        }
    }

    // Métodos abstractos que deben implementar las clases hijas

    /**
     * Calcular estadísticas específicas del modelo
     */
    abstract protected function calculateStats(): array;

    /**
     * Obtener registros activos específicos del modelo
     */
    abstract protected function getActiveRecords();

    // Métodos auxiliares

    protected function getDefaultSortField(): string
    {
        return 'created_at';
    }

    protected function getAllowedFields(): array
    {
        return array_merge($this->searchableFields, $this->sortableFields, array_keys($this->filterableFields));
    }

    protected function hasFullTextIndex(string $field): bool
    {
        // Implementar lógica para detectar índices FULLTEXT
        // Por ahora retorna false, pero se puede implementar según la BD
        return false;
    }

    protected function shouldUseApproximateCount(): bool
    {
        // Usar conteo aproximado para tablas con más de 1M de registros
        return $this->model::count() > 1000000;
    }

    protected function getApproximateCount(Builder $query): int
    {
        // Implementar conteo aproximado usando EXPLAIN o estadísticas de la tabla
        // Por ahora usa el conteo normal
        return $query->count();
    }

    protected function getStatsCacheKey(): string
    {
        return 'stats_' . strtolower(class_basename($this->model));
    }

    protected function getActiveCacheKey(): string
    {
        return 'active_' . strtolower(class_basename($this->model));
    }
} 