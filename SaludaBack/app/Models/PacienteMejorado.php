<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PacienteMejorado extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pacientes_mejorados';
    protected $primaryKey = 'Paciente_ID';

    protected $fillable = [
        'Nombre',
        'Apellido',
        'Fecha_Nacimiento',
        'Genero',
        'Telefono',
        'Correo_Electronico',
        'Direccion',
        'Activo',
        'Agregado_Por',
        'Modificado_Por',
        'ID_H_O_D'
    ];

    protected $casts = [
        'Fecha_Nacimiento' => 'date',
        'Activo' => 'boolean',
        'Agregado_El' => 'datetime',
        'Modificado_El' => 'datetime'
    ];

    // Relaciones
    public function citas()
    {
        return $this->hasMany(CitaMejorada::class, 'Fk_Paciente', 'Paciente_ID');
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('Activo', true);
    }

    public function scopePorHospital($query, $hospitalId)
    {
        return $query->where('ID_H_O_D', $hospitalId);
    }

    public function scopePorNombre($query, $nombre)
    {
        return $query->where(function($q) use ($nombre) {
            $q->where('Nombre', 'like', "%{$nombre}%")
              ->orWhere('Apellido', 'like', "%{$nombre}%");
        });
    }

    // Accesores
    public function getNombreCompletoAttribute()
    {
        return trim($this->Nombre . ' ' . $this->Apellido);
    }

    public function getEdadAttribute()
    {
        if ($this->Fecha_Nacimiento) {
            return $this->Fecha_Nacimiento->age;
        }
        return null;
    }

    // Mutadores
    public function setNombreAttribute($value)
    {
        $this->attributes['Nombre'] = ucwords(strtolower($value));
    }

    public function setApellidoAttribute($value)
    {
        $this->attributes['Apellido'] = ucwords(strtolower($value));
    }

    public function setCorreoElectronicoAttribute($value)
    {
        $this->attributes['Correo_Electronico'] = strtolower($value);
    }
}
