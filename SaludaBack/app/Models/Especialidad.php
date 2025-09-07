<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Especialidad extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'especialidades';
    protected $primaryKey = 'Especialidad_ID';

    protected $fillable = [
        'Nombre_Especialidad',
        'Descripcion',
        'Color_Calendario',
        'Activa',
        'Agregado_Por',
        'Modificado_Por',
        'ID_H_O_D'
    ];

    protected $casts = [
        'Activa' => 'boolean',
        'Agregado_El' => 'datetime',
        'Modificado_El' => 'datetime'
    ];

    // Relaciones
    public function especialistas()
    {
        return $this->hasMany(Especialista::class, 'Fk_Especialidad', 'Especialidad_ID');
    }

    public function citas()
    {
        return $this->hasManyThrough(CitaMejorada::class, Especialista::class, 'Fk_Especialidad', 'Fk_Especialista', 'Especialidad_ID', 'Especialista_ID');
    }

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('Activa', true);
    }

    public function scopePorHospital($query, $hospitalId)
    {
        return $query->where('ID_H_O_D', $hospitalId);
    }

    // Accesores
    public function getNombreCompletoAttribute()
    {
        return $this->Nombre_Especialidad;
    }

    // Mutadores
    public function setNombreEspecialidadAttribute($value)
    {
        $this->attributes['Nombre_Especialidad'] = ucwords(strtolower($value));
    }
}
