<?php

namespace App\Http\Resources;

use App\Models\Servicio;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ServicioCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->collection->count(),
                'estados_estadisticas' => $this->getEstadosEstadisticas(),
                'sistema_estadisticas' => $this->getSistemaEstadisticas(),
                'organizacion_estadisticas' => $this->getOrganizacionEstadisticas(),
                'timestamp' => now()->toISOString(),
                'version' => '1.0'
            ],
            'opciones' => [
                'estados_disponibles' => Servicio::estadosDisponibles(),
                'codigos_estados' => Servicio::codigosEstados(),
                'tipos_sistema' => [
                    'Sistema' => 'Servicios del sistema',
                    'Personalizado' => 'Servicios personalizados'
                ]
            ],
            'links' => [
                'self' => url()->current(),
            ],
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'timestamp' => now()->toISOString(),
                'version' => '1.0'
            ]
        ];
    }

    /**
     * Customize the outgoing response for the resource collection.
     */
    public function withResponse($request, $response)
    {
        $response->header('X-Resource-Type', 'ServicioCollection');
        $response->header('X-Total-Servicios', $this->collection->count());
    }

    /**
     * Obtener estadísticas por estados
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
            'porcentaje_activos' => $total > 0 ? round(($activos / $total) * 100, 2) : 0,
            'porcentaje_inactivos' => $total > 0 ? round(($inactivos / $total) * 100, 2) : 0
        ];
    }

    /**
     * Obtener estadísticas por tipo de sistema
     */
    private function getSistemaEstadisticas(): array
    {
        $total = $this->collection->count();
        $sistema = $this->collection->where('Sistema', true)->count();
        $personalizados = $this->collection->where('Sistema', false)->count();

        return [
            'total' => $total,
            'sistema' => $sistema,
            'personalizados' => $personalizados,
            'porcentaje_sistema' => $total > 0 ? round(($sistema / $total) * 100, 2) : 0,
            'porcentaje_personalizados' => $total > 0 ? round(($personalizados / $total) * 100, 2) : 0
        ];
    }

    /**
     * Obtener estadísticas por organización
     */
    private function getOrganizacionEstadisticas(): array
    {
        $organizaciones = $this->collection->groupBy('ID_H_O_D')->map(function ($servicios, $organizacionId) {
            $total = $servicios->count();
            $activos = $servicios->where('Estado', 'Activo')->count();
            $sistema = $servicios->where('Sistema', true)->count();

            return [
                'organizacion_id' => $organizacionId,
                'total_servicios' => $total,
                'activos' => $activos,
                'inactivos' => $total - $activos,
                'sistema' => $sistema,
                'personalizados' => $total - $sistema,
                'porcentaje_activos' => $total > 0 ? round(($activos / $total) * 100, 2) : 0
            ];
        })->values();

        return $organizaciones->toArray();
    }
} 