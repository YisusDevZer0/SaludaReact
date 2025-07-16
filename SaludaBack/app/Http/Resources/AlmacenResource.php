<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlmacenResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->Almacen_ID,
            'nombre' => $this->Nom_Almacen,
            'tipo' => $this->Tipo,
            'tipo_descripcion' => $this->tipo_descripcion,
            'responsable' => $this->Responsable,
            'estado' => $this->Estado,
            'codigo_estado' => $this->Cod_Estado,
            'estado_color' => $this->estado_color,
            'sistema' => $this->Sistema,
            'organizacion' => $this->ID_H_O_D,
            'sucursal_id' => $this->FkSucursal,
            'agregado_por' => $this->Agregado_Por,
            'agregado_el' => $this->Agregadoel?->format('Y-m-d H:i:s'),
            'creado_en' => $this->created_at?->format('Y-m-d H:i:s'),
            'actualizado_en' => $this->updated_at?->format('Y-m-d H:i:s'),
            
            // Campos adicionales
            'descripcion' => $this->Descripcion,
            'ubicacion' => $this->Ubicacion,
            'capacidad_max' => $this->Capacidad_Max,
            'capacidad_formateada' => $this->capacidad_formateada,
            'unidad_medida' => $this->Unidad_Medida,
            'telefono' => $this->Telefono,
            'telefono_formateado' => $this->telefono_formateado,
            'email' => $this->Email,
            'contacto_completo' => $this->contacto_completo,
            
            // Información adicional
            'tiene_capacidad_definida' => $this->tieneCapacidadDefinida(),
            'puede_almacenar' => $this->puedeAlmacenar(),
            
            // Relaciones condicionales
            'sucursal' => $this->whenLoaded('sucursal'),
            
            // Datos adicionales para formularios
            'puede_editar' => $this->when($request->user(), function () use ($request) {
                return $request->user()->Nombre_Apellidos === $this->Agregado_Por || 
                       in_array($request->user()->role?->Nombre_rol ?? '', ['Administrador', 'Admin']);
            }),
            
            'puede_eliminar' => $this->when($request->user(), function () use ($request) {
                return $request->user()->role?->Nombre_rol === 'Administrador';
            }),

            'puede_cambiar_responsable' => $this->when($request->user(), function () use ($request) {
                return in_array($request->user()->role?->Nombre_rol ?? '', ['Administrador', 'Admin']);
            }),
            
            // Metadatos del tipo
            'tipo_info' => [
                'codigo' => $this->Tipo,
                'descripcion' => $this->tipo_descripcion,
                'permite_email' => in_array($this->Tipo, ['Servicio', 'Equipo']),
                'requiere_capacidad' => in_array($this->Tipo, ['Medicamento', 'Insumo', 'Material'])
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
                'tipos_disponibles' => \App\Models\Almacen::tiposConDescripcion(),
                'unidades_medida' => \App\Models\Almacen::UNIDADES_MEDIDA,
            ],
        ];
    }

    /**
     * Customize the outgoing response for the resource.
     */
    public function withResponse(Request $request, $response): void
    {
        $response->header('X-Resource-Type', 'Almacen');
        $response->header('X-Almacen-Tipo', $this->Tipo);
    }
} 