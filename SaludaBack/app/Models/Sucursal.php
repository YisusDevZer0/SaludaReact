<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sucursal extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sucursales';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'nombre',
        'direccion',
        'ciudad',
        'provincia',
        'codigo_postal',
        'pais',
        'telefono',
        'email',
        'estado',
        'descripcion',
        'codigo',
        'responsable_id',
        'fecha_apertura',
        'fecha_cierre',
        'capacidad',
        'tipo_sucursal',
        'zona_horaria',
        'configuracion'
    ];

    protected $casts = [
        'fecha_apertura' => 'date',
        'fecha_cierre' => 'date',
        'configuracion' => 'array',
    ];

    // Relación con personal
    public function personal()
    {
        return $this->hasMany(PersonalPos::class, 'sucursal_id');
    }

    // Relación con responsable
    public function responsable()
    {
        return $this->belongsTo(PersonalPos::class, 'responsable_id');
    }

    // Scope para sucursales activas
    public function scopeActivas($query)
    {
        return $query->where('estado', 'activo');
    }

    // Método para obtener información completa de la sucursal
    public function getInformacionCompletaAttribute()
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'direccion_completa' => $this->direccion . ', ' . $this->ciudad . ', ' . $this->provincia,
            'contacto' => [
                'telefono' => $this->telefono,
                'email' => $this->email
            ],
            'estado' => $this->estado,
            'responsable' => $this->responsable ? $this->responsable->nombre_completo : null
        ];
    }
} 