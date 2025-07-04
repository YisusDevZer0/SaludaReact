<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class ComponenteActivo extends Model
{
    protected $table = 'ComponentesActivos';
    protected $primaryKey = 'ID';

    protected $fillable = [
        'Nom_Com',
        'Agregado_Por',
        'Agregadoel',
        'ID_H_O_D',
        'Estado',
        'Cod_Estado',
        'Sistema',
        'Descripcion'
    ];

    protected $casts = [
        'Agregadoel' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Scope para filtrar componentes vigentes
    public function scopeVigente(Builder $query): Builder
    {
        return $query->where('Estado', 'Vigente')
                    ->where('Cod_Estado', 'V');
    }

    // Scope para filtrar por sistema POS
    public function scopeSistemaPos(Builder $query): Builder
    {
        return $query->where('Sistema', 'POS');
    }

    // Scope para filtrar por organización
    public function scopePorOrganizacion(Builder $query, string $organizacion): Builder
    {
        return $query->where('ID_H_O_D', $organizacion);
    }

    // Scope para búsqueda general
    public function scopeBusqueda(Builder $query, string $termino): Builder
    {
        return $query->where(function($q) use ($termino) {
            $q->where('Nom_Com', 'LIKE', "%{$termino}%")
              ->orWhere('Descripcion', 'LIKE', "%{$termino}%");
        });
    }
} 