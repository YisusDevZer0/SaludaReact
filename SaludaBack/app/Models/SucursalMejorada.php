<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class SucursalMejorada extends Model
{
    use HasFactory;

    protected $table = 'sucursales_mejoradas';
    protected $primaryKey = 'Sucursal_ID';

    protected $fillable = [
        'Nombre_Sucursal',
        'Direccion',
        'Telefono',
        'Email',
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
    public function consultorios()
    {
        return $this->hasMany(ConsultorioMejorado::class, 'Fk_Sucursal', 'Sucursal_ID');
    }

    public function citas()
    {
        return $this->hasMany(CitaMejorada::class, 'Fk_Sucursal', 'Sucursal_ID');
    }

    public function programacionEspecialistas()
    {
        return $this->hasMany(ProgramacionEspecialista::class, 'Fk_Sucursal', 'Sucursal_ID');
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
        return $this->Nombre_Sucursal;
    }

    // Mutadores
    public function setNombreSucursalAttribute($value)
    {
        $this->attributes['Nombre_Sucursal'] = ucwords(strtolower($value));
    }

    public function setEmailAttribute($value)
    {
        $this->attributes['Email'] = strtolower($value);
    }
}
