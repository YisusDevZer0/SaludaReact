<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CategoriaPos extends Model
{
    use HasFactory;

    /**
     * La tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'categorias_pos';

    /**
     * La clave primaria del modelo.
     *
     * @var string
     */
    protected $primaryKey = 'Cat_ID';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array
     */
    protected $fillable = [
        'Nom_Cat',
        'Estado',
        'Cod_Estado',
        'Agregado_Por',
        'Agregadoel',
        'Sistema',
        'ID_H_O_D',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'Agregadoel' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Los atributos que deben ser ocultos para arrays.
     *
     * @var array
     */
    protected $hidden = [
        // Agregar campos que no quieres que se muestren en JSON
    ];

    /**
     * Scope para filtrar por estado vigente
     */
    public function scopeVigente($query)
    {
        return $query->where('Estado', 'Vigente');
    }

    /**
     * Scope para filtrar por sistema POS
     */
    public function scopeSistemaPos($query)
    {
        return $query->where('Sistema', 'POS');
    }

    /**
     * Scope para filtrar por organización
     */
    public function scopePorOrganizacion($query, $organizacion)
    {
        return $query->where('ID_H_O_D', $organizacion);
    }
}
