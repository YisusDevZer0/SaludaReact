<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarcaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->Marca_ID,
            'nombre' => $this->Nom_Marca,
            'estado' => $this->Estado,
            'codigo_estado' => $this->Cod_Estado,
            'estado_color' => $this->estado_color,
            'descripcion' => $this->Descripcion,
            'pais_origen' => $this->Pais_Origen,
            'sitio_web' => $this->Sitio_Web,
            'tiene_sitio_web' => $this->tiene_sitio_web,
            'logo_url' => $this->Logo_URL,
            'logo_url_segura' => $this->logo_url_segura,
            'tiene_logo' => $this->tiene_logo,
            'sistema' => $this->Sistema,
            'organizacion' => $this->ID_H_O_D,
            'agregado_por' => $this->Agregado_Por,
            'agregado_el' => $this->Agregadoel?->format('Y-m-d H:i:s'),
            'creado_en' => $this->created_at?->format('Y-m-d H:i:s'),
            'actualizado_en' => $this->updated_at?->format('Y-m-d H:i:s'),
            
            // Relaciones condicionales
            'servicios' => ServicioResource::collection($this->whenLoaded('servicios')),
            'servicios_count' => $this->when($this->relationLoaded('servicios'), function () {
                return $this->servicios->count();
            }),
            
            // Datos adicionales para formularios
            'puede_editar' => $this->when($request->user(), function () use ($request) {
                return $request->user()->Nombre_Apellidos === $this->Agregado_Por || 
                       $request->user()->role?->Nombre_rol === 'Administrador';
            }),
            
            'puede_eliminar' => $this->when($request->user(), function () use ($request) {
                return $request->user()->role?->Nombre_rol === 'Administrador';
            }),
            
            // Enlaces útiles
            'enlaces' => [
                'sitio_web' => $this->when($this->Sitio_Web, $this->Sitio_Web),
                'logo' => $this->when($this->Logo_URL, $this->Logo_URL),
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
                'paises_disponibles' => $this->when(
                    $request->routeIs('*.index') || $request->routeIs('*.create'),
                    function () {
                        return \App\Models\Marca::paisesDisponibles();
                    }
                ),
            ],
        ];
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse(Request $request, $response): void
    {
        $response->header('X-Resource-Type', 'Marca');
    }
} 