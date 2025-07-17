<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TestPerformance extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'test:performance 
                           {endpoint? : El endpoint a probar (ej: categorias, tipos, servicios)}
                           {--records=1000 : Número de registros por página}
                           {--pages=10 : Número de páginas a probar}
                           {--concurrent=1 : Número de requests concurrentes}
                           {--with-search : Incluir pruebas de búsqueda}
                           {--with-filters : Incluir pruebas de filtros}
                           {--detailed : Mostrar métricas detalladas}';

    /**
     * The console command description.
     */
    protected $description = 'Probar el rendimiento de las APIs con server-side processing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Iniciando pruebas de performance...');
        
        $endpoint = $this->argument('endpoint');
        $recordsPerPage = $this->option('records');
        $totalPages = $this->option('pages');
        $concurrent = $this->option('concurrent');
        $withSearch = $this->option('with-search');
        $withFilters = $this->option('with-filters');
        $detailed = $this->option('detailed');
        
        // Si no se especifica endpoint, probar todos
        $endpoints = $endpoint ? [$endpoint] : [
            'categorias', 'tipos', 'presentaciones', 'servicios', 
            'marcas', 'personal', 'doctores', 'pacientes', 'agenda'
        ];
        
        $results = [];
        
        foreach ($endpoints as $endpointName) {
            $this->line("\n📊 Probando endpoint: {$endpointName}");
            
            $endpointResults = $this->testEndpoint(
                $endpointName, 
                $recordsPerPage, 
                $totalPages, 
                $concurrent,
                $withSearch,
                $withFilters,
                $detailed
            );
            
            $results[$endpointName] = $endpointResults;
        }
        
        $this->showFinalReport($results);
    }

    /**
     * Probar un endpoint específico
     */
    protected function testEndpoint(
        string $endpoint, 
        int $recordsPerPage, 
        int $totalPages, 
        int $concurrent,
        bool $withSearch,
        bool $withFilters,
        bool $detailed
    ): array {
        $baseUrl = config('app.url', 'http://localhost:8000');
        $apiUrl = "{$baseUrl}/api/{$endpoint}";
        
        $results = [
            'basic_pagination' => [],
            'search_tests' => [],
            'filter_tests' => [],
            'concurrent_tests' => [],
            'database_stats' => []
        ];
        
        // 1. Pruebas básicas de paginación
        $this->line("  🔄 Probando paginación básica...");
        $results['basic_pagination'] = $this->testBasicPagination(
            $apiUrl, $recordsPerPage, $totalPages, $detailed
        );
        
        // 2. Pruebas de búsqueda (si está habilitado)
        if ($withSearch) {
            $this->line("  🔍 Probando búsquedas...");
            $results['search_tests'] = $this->testSearchQueries($apiUrl, $recordsPerPage);
        }
        
        // 3. Pruebas de filtros (si está habilitado)
        if ($withFilters) {
            $this->line("  📝 Probando filtros...");
            $results['filter_tests'] = $this->testFilterQueries($apiUrl, $recordsPerPage, $endpoint);
        }
        
        // 4. Pruebas concurrentes
        if ($concurrent > 1) {
            $this->line("  ⚡ Probando requests concurrentes...");
            $results['concurrent_tests'] = $this->testConcurrentRequests(
                $apiUrl, $recordsPerPage, $concurrent
            );
        }
        
        // 5. Estadísticas de base de datos
        $results['database_stats'] = $this->getDatabaseStats($endpoint);
        
        $this->showEndpointSummary($endpoint, $results);
        
        return $results;
    }

    /**
     * Probar paginación básica
     */
    protected function testBasicPagination(string $url, int $perPage, int $totalPages, bool $detailed): array
    {
        $times = [];
        $errors = 0;
        
        $progressBar = $this->output->createProgressBar($totalPages);
        
        for ($page = 1; $page <= $totalPages; $page++) {
            $startTime = microtime(true);
            
            try {
                $response = Http::timeout(30)->get($url, [
                    'page' => $page,
                    'per_page' => $perPage
                ]);
                
                $endTime = microtime(true);
                $duration = ($endTime - $startTime) * 1000; // ms
                
                if ($response->successful()) {
                    $times[] = $duration;
                    
                    if ($detailed) {
                        $data = $response->json();
                        $this->line("\n    Página {$page}: {$duration}ms - {$data['meta']['count']} registros");
                    }
                } else {
                    $errors++;
                    if ($detailed) {
                        $this->error("\n    Error en página {$page}: " . $response->status());
                    }
                }
                
            } catch (\Exception $e) {
                $errors++;
                if ($detailed) {
                    $this->error("\n    Excepción en página {$page}: " . $e->getMessage());
                }
            }
            
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->newLine();
        
        return [
            'total_requests' => $totalPages,
            'successful_requests' => count($times),
            'errors' => $errors,
            'avg_time' => count($times) > 0 ? array_sum($times) / count($times) : 0,
            'min_time' => count($times) > 0 ? min($times) : 0,
            'max_time' => count($times) > 0 ? max($times) : 0,
            'times' => $times
        ];
    }

    /**
     * Probar búsquedas
     */
    protected function testSearchQueries(string $url, int $perPage): array
    {
        $searchTerms = ['test', 'categoria', 'tipo', 'servicio', 'marca', 'abc', '123'];
        $results = [];
        
        foreach ($searchTerms as $term) {
            $startTime = microtime(true);
            
            try {
                $response = Http::timeout(30)->get($url, [
                    'search' => $term,
                    'per_page' => $perPage
                ]);
                
                $endTime = microtime(true);
                $duration = ($endTime - $startTime) * 1000;
                
                if ($response->successful()) {
                    $data = $response->json();
                    $results[] = [
                        'term' => $term,
                        'time' => $duration,
                        'results_count' => $data['meta']['count'] ?? 0,
                        'total_found' => $data['meta']['total'] ?? 0
                    ];
                }
                
            } catch (\Exception $e) {
                $results[] = [
                    'term' => $term,
                    'time' => 0,
                    'error' => $e->getMessage()
                ];
            }
        }
        
        return $results;
    }

    /**
     * Probar filtros
     */
    protected function testFilterQueries(string $url, int $perPage, string $endpoint): array
    {
        $filters = $this->getFiltersForEndpoint($endpoint);
        $results = [];
        
        foreach ($filters as $filterName => $filterValues) {
            foreach ($filterValues as $value) {
                $startTime = microtime(true);
                
                try {
                    $response = Http::timeout(30)->get($url, [
                        $filterName => $value,
                        'per_page' => $perPage
                    ]);
                    
                    $endTime = microtime(true);
                    $duration = ($endTime - $startTime) * 1000;
                    
                    if ($response->successful()) {
                        $data = $response->json();
                        $results[] = [
                            'filter' => $filterName,
                            'value' => $value,
                            'time' => $duration,
                            'results_count' => $data['meta']['count'] ?? 0
                        ];
                    }
                    
                } catch (\Exception $e) {
                    $results[] = [
                        'filter' => $filterName,
                        'value' => $value,
                        'error' => $e->getMessage()
                    ];
                }
            }
        }
        
        return $results;
    }

    /**
     * Probar requests concurrentes
     */
    protected function testConcurrentRequests(string $url, int $perPage, int $concurrent): array
    {
        $this->line("    Ejecutando {$concurrent} requests simultáneos...");
        
        $startTime = microtime(true);
        $promises = [];
        
        // Crear requests concurrentes
        for ($i = 0; $i < $concurrent; $i++) {
            $promises[] = Http::async()->timeout(30)->get($url, [
                'page' => $i + 1,
                'per_page' => $perPage
            ]);
        }
        
        // Esperar todas las respuestas
        $responses = [];
        $errors = 0;
        
        foreach ($promises as $promise) {
            try {
                $response = $promise->wait();
                if ($response->successful()) {
                    $responses[] = $response;
                } else {
                    $errors++;
                }
            } catch (\Exception $e) {
                $errors++;
            }
        }
        
        $endTime = microtime(true);
        $totalTime = ($endTime - $startTime) * 1000;
        
        return [
            'concurrent_requests' => $concurrent,
            'successful_requests' => count($responses),
            'errors' => $errors,
            'total_time' => $totalTime,
            'avg_time_per_request' => count($responses) > 0 ? $totalTime / count($responses) : 0
        ];
    }

    /**
     * Obtener estadísticas de base de datos
     */
    protected function getDatabaseStats(string $endpoint): array
    {
        $tableName = $this->getTableNameForEndpoint($endpoint);
        
        if (!$tableName) {
            return [];
        }
        
        try {
            $totalRecords = DB::table($tableName)->count();
            $tableSize = DB::select("
                SELECT 
                    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
                FROM information_schema.tables 
                WHERE table_schema = DATABASE() 
                AND table_name = ?
            ", [$tableName]);
            
            $indexes = DB::select("
                SELECT 
                    index_name, 
                    column_name,
                    cardinality
                FROM information_schema.statistics 
                WHERE table_schema = DATABASE() 
                AND table_name = ?
                ORDER BY index_name, seq_in_index
            ", [$tableName]);
            
            return [
                'table_name' => $tableName,
                'total_records' => $totalRecords,
                'size_mb' => $tableSize[0]->size_mb ?? 0,
                'indexes_count' => count($indexes),
                'indexes' => $indexes
            ];
            
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Mostrar resumen de endpoint
     */
    protected function showEndpointSummary(string $endpoint, array $results): void
    {
        $basic = $results['basic_pagination'];
        
        if (!empty($basic)) {
            $this->line("\n  📈 Resumen de {$endpoint}:");
            $this->line("    • Requests exitosos: {$basic['successful_requests']}/{$basic['total_requests']}");
            $this->line("    • Tiempo promedio: " . round($basic['avg_time'], 2) . "ms");
            $this->line("    • Tiempo mínimo: " . round($basic['min_time'], 2) . "ms");
            $this->line("    • Tiempo máximo: " . round($basic['max_time'], 2) . "ms");
            $this->line("    • Errores: {$basic['errors']}");
            
            if (!empty($results['database_stats']['total_records'])) {
                $this->line("    • Registros en BD: " . number_format($results['database_stats']['total_records']));
                $this->line("    • Tamaño tabla: {$results['database_stats']['size_mb']} MB");
            }
        }
    }

    /**
     * Mostrar reporte final
     */
    protected function showFinalReport(array $results): void
    {
        $this->line("\n" . str_repeat('=', 60));
        $this->info("📊 REPORTE FINAL DE PERFORMANCE");
        $this->line(str_repeat('=', 60));
        
        foreach ($results as $endpoint => $data) {
            if (empty($data['basic_pagination'])) continue;
            
            $basic = $data['basic_pagination'];
            $this->line("\n{$endpoint}:");
            $this->line("  ✓ Promedio: " . round($basic['avg_time'], 2) . "ms");
            $this->line("  ✓ Máximo: " . round($basic['max_time'], 2) . "ms");
            $this->line("  ✓ Errores: {$basic['errors']}");
            
            // Clasificar performance
            $avgTime = $basic['avg_time'];
            if ($avgTime < 100) {
                $this->line("  🟢 Excelente performance");
            } elseif ($avgTime < 500) {
                $this->line("  🟡 Buena performance");
            } elseif ($avgTime < 1000) {
                $this->line("  🟠 Performance aceptable");
            } else {
                $this->line("  🔴 Performance necesita optimización");
            }
        }
        
        $this->line("\n💡 Recomendaciones:");
        $this->line("  • Tiempos < 100ms: Excelente");
        $this->line("  • Tiempos < 500ms: Bueno");
        $this->line("  • Tiempos > 1000ms: Revisar índices y queries");
        
        $this->info("\n✅ Pruebas de performance completadas!");
    }

    /**
     * Obtener filtros para un endpoint específico
     */
    protected function getFiltersForEndpoint(string $endpoint): array
    {
        $filters = [
            'categorias' => [
                'estado' => ['Vigente', 'Descontinuado'],
                'sistema' => ['POS', 'SaludaReact']
            ],
            'tipos' => [
                'estado' => ['Activo', 'Inactivo'],
                'sistema' => ['POS', 'SaludaReact']
            ],
            'servicios' => [
                'estado' => ['Activo', 'Inactivo'],
                'requiere_cita' => [true, false]
            ],
            'marcas' => [
                'estado' => ['Activo', 'Inactivo'],
                'pais_origen' => ['España', 'México']
            ]
        ];
        
        return $filters[$endpoint] ?? [];
    }

    /**
     * Obtener nombre de tabla para un endpoint
     */
    protected function getTableNameForEndpoint(string $endpoint): ?string
    {
        $tables = [
            'categorias' => 'categoriaspos',
            'tipos' => 'tipos',
            'presentaciones' => 'presentaciones',
            'servicios' => 'servicios',
            'marcas' => 'marcas',
            'personal' => 'PersonalPOS',
            'doctores' => 'doctores',
            'pacientes' => 'pacientes',
            'agenda' => 'agenda'
        ];
        
        return $tables[$endpoint] ?? null;
    }
} 