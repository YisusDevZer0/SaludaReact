<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Presentacion extends Model
{
    use HasFactory;

    /**
     * La tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'presentaciones';

    /**
     * La clave primaria del modelo.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'codigo',
        'abreviatura',
        'activa',
        'orden',
        'Id_Licencia',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'activa' => 'boolean',
        'orden' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
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
     * Scope para filtrar por estado activo
     */
    public function scopeActiva($query)
    {
        return $query->where('activa', true);
    }

    /**
     * Scope para filtrar por código
     */
    public function scopePorCodigo($query, $codigo)
    {
        return $query->where('codigo', 'like', '%' . $codigo . '%');
    }

    /**
     * Scope para filtrar por nombre
     */
    public function scopePorNombre($query, $nombre)
    {
        return $query->where('nombre', 'like', '%' . $nombre . '%');
    }

    /**
     * Scope para filtrar por abreviatura
     */
    public function scopePorAbreviatura($query, $abreviatura)
    {
        return $query->where('abreviatura', 'like', '%' . $abreviatura . '%');
    }

    /**
     * Scope para ordenar por orden
     */
    public function scopeOrdenado($query)
    {
        return $query->orderBy('orden', 'asc');
    }
} 