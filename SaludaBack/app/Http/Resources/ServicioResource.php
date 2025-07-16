<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServicioResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->Servicio_ID,
            'nombre' => $this->Nom_Serv,
            'estado' => $this->Estado,
            'codigo_estado' => $this->Cod_Estado,
            'estado_color' => $this->estado_color,
            'descripcion' => $this->Descripcion,
            'precio_base' => $this->Precio_Base,
            'precio_formateado' => $this->precio_formateado,
            'requiere_cita' => $this->Requiere_Cita,
            'requiere_cita_texto' => $this->requiere_cita_texto,
            'sistema' => $this->Sistema,
            'organizacion' => $this->ID_H_O_D,
            'agregado_por' => $this->Agregado_Por,
            'agregado_el' => $this->Agregadoel?->format('Y-m-d H:i:s'),
            'creado_en' => $this->created_at?->format('Y-m-d H:i:s'),
            'actualizado_en' => $this->updated_at?->format('Y-m-d H:i:s'),
            
            // Relaciones condicionales
            'marcas' => MarcaResource::collection($this->whenLoaded('marcas')),
            'marcas_count' => $this->when($this->relationLoaded('marcas'), function () {
                return $this->marcas->count();
            }),
            
            // Datos adicionales para formularios
            'puede_editar' => $this->when($request->user(), function () use ($request) {
                return $request->user()->Nombre_Apellidos === $this->Agregado_Por || 
                       $request->user()->role?->Nombre_rol === 'Administrador';
            }),
            
            'puede_eliminar' => $this->when($request->user(), function () use ($request) {
                return $request->user()->role?->Nombre_rol === 'Administrador';
            }),
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
            ],
        ];
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse(Request $request, $response): void
    {
        $response->header('X-Resource-Type', 'Servicio');
    }
} 