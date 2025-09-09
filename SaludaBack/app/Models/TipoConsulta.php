<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoConsulta extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tipos_consulta';
    protected $primaryKey = 'Tipo_ID';

    protected $fillable = [
        'Nom_Tipo',
        'Estado',
        'Agregado_Por',
        'Agregado_El',
        'Sistema',
        'ID_H_O_D',
        'Especialidad',
        'Modificado_Por',
        'Modificado_El'
    ];

    protected $casts = [
        'Agregado_El' => 'datetime',
        'Modificado_El' => 'datetime',
    ];

    // Relación con especialidad
    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'Especialidad', 'Especialidad_ID');
    }

    // Scope para tipos activos
    public function scopeActivos($query)
    {
        return $query->where('Estado', 'Activo');
    }

    // Scope por organización
    public function scopePorOrganizacion($query, $idHOD)
    {
        return $query->where('ID_H_O_D', $idHOD);
    }

    // Scope por especialidad
    public function scopePorEspecialidad($query, $especialidadId)
    {
        return $query->where('Especialidad', $especialidadId);
    }

    // Accessor para obtener el nombre de la especialidad
    public function getNombreEspecialidadAttribute()
    {
        return $this->especialidad ? $this->especialidad->Nombre_Especialidad : 'Sin especialidad';
    }

    // Método para verificar si está activo
    public function estaActivo()
    {
        return $this->Estado === 'Activo';
    }
}
