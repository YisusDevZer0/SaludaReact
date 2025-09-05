<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Especialista extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'especialistas';
    protected $primaryKey = 'Especialista_ID';

    protected $fillable = [
        'Nombre_Completo',
        'Cedula_Profesional',
        'Email',
        'Telefono',
        'Fk_Especialidad',
        'Activo',
        'Agregado_Por',
        'Modificado_Por',
        'ID_H_O_D'
    ];

    protected $casts = [
        'Activo' => 'boolean',
        'Agregado_El' => 'datetime',
        'Modificado_El' => 'datetime'
    ];

    // Relaciones
    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'Fk_Especialidad', 'Especialidad_ID');
    }

    public function citas()
    {
        return $this->hasMany(CitaMejorada::class, 'Fk_Especialista', 'Especialista_ID');
    }

    public function programacion()
    {
        return $this->hasMany(ProgramacionEspecialista::class, 'Fk_Especialista', 'Especialista_ID');
    }

    public function horariosDisponibles()
    {
        return $this->hasManyThrough(HorarioDisponible::class, ProgramacionEspecialista::class, 'Fk_Especialista', 'Fk_Programacion', 'Especialista_ID', 'Programacion_ID');
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('Activo', true);
    }

    public function scopePorEspecialidad($query, $especialidadId)
    {
        return $query->where('Fk_Especialidad', $especialidadId);
    }

    public function scopePorHospital($query, $hospitalId)
    {
        return $query->where('ID_H_O_D', $hospitalId);
    }

    // Accesores
    public function getNombreCompletoAttribute($value)
    {
        return ucwords(strtolower($value));
    }

    // Mutadores
    public function setNombreCompletoAttribute($value)
    {
        $this->attributes['Nombre_Completo'] = ucwords(strtolower($value));
    }

    public function setEmailAttribute($value)
    {
        $this->attributes['Email'] = strtolower($value);
    }
}
