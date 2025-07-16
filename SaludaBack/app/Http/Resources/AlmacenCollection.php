<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\Almacen;

class AlmacenCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->collection->count(),
                'tipos_estadisticas' => $this->getTiposEstadisticas(),
                'estados_estadisticas' => $this->getEstadosEstadisticas(),
                'capacidad_estadisticas' => $this->getCapacidadEstadisticas(),
                'responsables_estadisticas' => $this->getResponsablesEstadisticas(),
                'sucursales_estadisticas' => $this->getSucursalesEstadisticas(),
                'timestamp' => now()->toISOString(),
                'version' => '1.0'
            ],
            'opciones' => [
                'tipos_disponibles' => Almacen::tiposConDescripcion(),
                'unidades_medida' => Almacen::UNIDADES_MEDIDA,
                'estados_disponibles' => ['Activo', 'Inactivo']
            ]
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     */
    public function with(Request $request): array
    {
        return [
            'links' => [
                'self' => $request->url(),
                'create' => route('almacenes.store'),
            ],
            'actions' => [
                'bulk_activate' => $this->when($request->user()?->can('bulk_update_almacenes'), 
                    route('almacenes.bulk-activate')),
                'bulk_deactivate' => $this->when($request->user()?->can('bulk_update_almacenes'), 
                    route('almacenes.bulk-deactivate')),
                'export' => route('almacenes.export'),
                'import' => $this->when($request->user()?->can('import_almacenes'), 
                    route('almacenes.import')),
            ]
        ];
    }

    /**
     * Get statistics by type.
     */
    private function getTiposEstadisticas(): array
    {
        $tiposStats = $this->collection->groupBy('Tipo')->map(function ($almacenes, $tipo) {
            return [
                'tipo' => $tipo,
                'total' => $almacenes->count(),
                'activos' => $almacenes->where('Estado', 'Activo')->count(),
                'inactivos' => $almacenes->where('Estado', 'Inactivo')->count(),
                'con_capacidad' => $almacenes->whereNotNull('Capacidad_Max')->count(),
                'con_contacto' => $almacenes->filter(function ($almacen) {
                    return !empty($almacen->Telefono) || !empty($almacen->Email);
                })->count()
            ];
        });

        return $tiposStats->values()->toArray();
    }

    /**
     * Get statistics by status.
     */
    private function getEstadosEstadisticas(): array
    {
        $total = $this->collection->count();
        $activos = $this->collection->where('Estado', 'Activo')->count();
        $inactivos = $this->collection->where('Estado', 'Inactivo')->count();

        return [
            'total' => $total,
            'activos' => $activos,
            'inactivos' => $inactivos,
            'porcentaje_activos' => $total > 0 ? round(($activos / $total) * 100, 1) : 0,
            'porcentaje_inactivos' => $total > 0 ? round(($inactivos / $total) * 100, 1) : 0
        ];
    }

    /**
     * Get capacity statistics.
     */
    private function getCapacidadEstadisticas(): array
    {
        $conCapacidad = $this->collection->whereNotNull('Capacidad_Max');
        $sinCapacidad = $this->collection->whereNull('Capacidad_Max');

        $capacidadStats = [];

        if ($conCapacidad->count() > 0) {
            $capacidades = $conCapacidad->pluck('Capacidad_Max')->filter();
            
            $capacidadStats = [
                'con_capacidad_definida' => $conCapacidad->count(),
                'sin_capacidad_definida' => $sinCapacidad->count(),
                'capacidad_promedio' => round($capacidades->avg(), 2),
                'capacidad_maxima' => $capacidades->max(),
                'capacidad_minima' => $capacidades->min(),
                'capacidad_total' => round($capacidades->sum(), 2)
            ];
        } else {
            $capacidadStats = [
                'con_capacidad_definida' => 0,
                'sin_capacidad_definida' => $sinCapacidad->count(),
                'capacidad_promedio' => 0,
                'capacidad_maxima' => 0,
                'capacidad_minima' => 0,
                'capacidad_total' => 0
            ];
        }

        return $capacidadStats;
    }

    /**
     * Get statistics by responsible person.
     */
    private function getResponsablesEstadisticas(): array
    {
        $responsablesStats = $this->collection->groupBy('Responsable')->map(function ($almacenes, $responsable) {
            return [
                'responsable' => $responsable,
                'total_almacenes' => $almacenes->count(),
                'activos' => $almacenes->where('Estado', 'Activo')->count(),
                'tipos_manejados' => $almacenes->pluck('Tipo')->unique()->values()->toArray()
            ];
        })->sortByDesc('total_almacenes')->take(10); // Top 10 responsables

        return $responsablesStats->values()->toArray();
    }

    /**
     * Get statistics by branch.
     */
    private function getSucursalesEstadisticas(): array
    {
        $sucursalesStats = $this->collection->groupBy('FkSucursal')->map(function ($almacenes, $sucursalId) {
            return [
                'sucursal_id' => $sucursalId,
                'total_almacenes' => $almacenes->count(),
                'activos' => $almacenes->where('Estado', 'Activo')->count(),
                'tipos_disponibles' => $almacenes->pluck('Tipo')->unique()->count(),
                'tipos_detalle' => $almacenes->groupBy('Tipo')->map->count()->toArray()
            ];
        })->sortByDesc('total_almacenes');

        return $sucursalesStats->values()->toArray();
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse(Request $request, $response): void
    {
        $response->header('X-Resource-Type', 'AlmacenCollection');
        $response->header('X-Total-Almacenes', $this->collection->count());
        
        $tiposUnicos = $this->collection->pluck('Tipo')->unique()->count();
        $response->header('X-Tipos-Disponibles', $tiposUnicos);
    }
} 