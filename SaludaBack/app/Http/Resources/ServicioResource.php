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
            'sistema_descripcion' => $this->sistema_descripcion,
            'sistema_color' => $this->sistema_color,
            'organizacion' => 'Saluda',
            'agregado_por' => $this->Agregado_Por,
            'agregado_el' => $this->Agregadoel?->format('Y-m-d H:i:s'),
            'creado_en' => $this->created_at?->format('Y-m-d H:i:s'),
            'actualizado_en' => $this->updated_at?->format('Y-m-d H:i:s'),
            'ID_H_O_D' => $this->ID_H_O_D,
            'deleted_at' => $this->deleted_at?->format('Y-m-d H:i:s'),
            
            // Campos computados
            'es_activo' => $this->esActivo(),
            'es_sistema' => $this->esSistema(),
            'puede_editar' => true, // Basado en permisos del usuario
            'puede_eliminar' => !$this->esSistema(), // No eliminar servicios del sistema
            'puede_cambiar_estado' => true,
            
            // Información adicional
            'tipo_info' => [
                'codigo' => $this->Sistema ? 'Sistema' : 'Personalizado',
                'descripcion' => $this->Sistema ? 'Servicio del sistema' : 'Servicio personalizado',
                'permite_edicion' => !$this->Sistema,
                'permite_eliminacion' => !$this->Sistema
            ],
            
            // Relaciones condicionales
            'marcas' => MarcaResource::collection($this->whenLoaded('marcas')),
            'marcas_count' => $this->when($this->relationLoaded('marcas'), function () {
                return $this->marcas->count();
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
                'timestamp' => now()->toISOString(),
                'version' => '1.0'
            ]
        ];
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse($request, $response)
    {
        $response->header('X-Resource-Type', 'Servicio');
        $response->header('X-Servicio-Tipo', $this->Sistema ? 'Sistema' : 'Personalizado');
    }
} 