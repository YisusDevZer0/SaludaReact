<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ServicioCollection extends ResourceCollection
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
            'estadisticas' => [
                'total' => $this->collection->count(),
                'activos' => $this->collection->where('Estado', 'Activo')->count(),
                'inactivos' => $this->collection->where('Estado', 'Inactivo')->count(),
                'con_precio' => $this->collection->whereNotNull('Precio_Base')->count(),
                'requieren_cita' => $this->collection->where('Requiere_Cita', true)->count(),
            ],
            'filtros_disponibles' => [
                'estados' => ['Activo', 'Inactivo'],
                'sistemas' => $this->collection->pluck('Sistema')->unique()->values(),
                'organizaciones' => $this->collection->pluck('ID_H_O_D')->unique()->values(),
                'con_cita' => [true, false],
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
                'version' => '1.0',
                'timestamp' => now()->toISOString(),
                'resource_type' => 'servicios',
                'total_elementos' => $this->collection->count(),
            ],
        ];
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse(Request $request, $response): void
    {
        $response->header('X-Resource-Type', 'ServicioCollection');
        $response->header('X-Total-Count', $this->collection->count());
    }
} 