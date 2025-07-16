<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class MarcaCollection extends ResourceCollection
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
                'activas' => $this->collection->where('Estado', 'Activo')->count(),
                'inactivas' => $this->collection->where('Estado', 'Inactivo')->count(),
                'con_logo' => $this->collection->whereNotNull('Logo_URL')->count(),
                'con_sitio_web' => $this->collection->whereNotNull('Sitio_Web')->count(),
                'con_pais' => $this->collection->whereNotNull('Pais_Origen')->count(),
            ],
            'paises' => [
                'total_paises' => $this->collection->whereNotNull('Pais_Origen')->pluck('Pais_Origen')->unique()->count(),
                'lista_paises' => $this->collection->whereNotNull('Pais_Origen')->pluck('Pais_Origen')->unique()->sort()->values(),
                'distribucion' => $this->collection->whereNotNull('Pais_Origen')
                    ->groupBy('Pais_Origen')
                    ->map(function ($marcas, $pais) {
                        return [
                            'pais' => $pais,
                            'cantidad' => $marcas->count(),
                            'porcentaje' => round(($marcas->count() / $this->collection->count()) * 100, 1)
                        ];
                    })
                    ->values()
                    ->sortByDesc('cantidad')
                    ->take(10), // Top 10 países
            ],
            'filtros_disponibles' => [
                'estados' => ['Activo', 'Inactivo'],
                'sistemas' => $this->collection->pluck('Sistema')->unique()->values(),
                'organizaciones' => $this->collection->pluck('ID_H_O_D')->unique()->values(),
                'paises' => $this->collection->whereNotNull('Pais_Origen')->pluck('Pais_Origen')->unique()->sort()->values(),
                'con_logo' => [true, false],
                'con_sitio_web' => [true, false],
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
                'resource_type' => 'marcas',
                'total_elementos' => $this->collection->count(),
                'sugerencias' => [
                    'paises_populares' => $this->collection->whereNotNull('Pais_Origen')
                        ->groupBy('Pais_Origen')
                        ->map->count()
                        ->sortDesc()
                        ->take(5)
                        ->keys()
                        ->toArray(),
                ],
            ],
        ];
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse(Request $request, $response): void
    {
        $response->header('X-Resource-Type', 'MarcaCollection');
        $response->header('X-Total-Count', $this->collection->count());
        $response->header('X-Countries-Count', $this->collection->whereNotNull('Pais_Origen')->pluck('Pais_Origen')->unique()->count());
    }
} 