<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultorioMejorado extends Model
{
    use HasFactory;

    protected $table = 'consultorios_mejorados';
    protected $primaryKey = 'Consultorio_ID';

    protected $fillable = [
        'Nombre_Consultorio',
        'Descripcion',
        'Capacidad',
        'Equipamiento',
        'Fk_Sucursal',
        'Estado',
        'ID_H_O_D',
        'Agregado_Por',
        'Agregado_El'
    ];

    protected $casts = [
        'Fecha_Creacion' => 'datetime',
        'Fecha_Actualizacion' => 'datetime',
        'Agregado_El' => 'datetime'
    ];

    // Relación con Sucursal
    public function sucursal()
    {
        return $this->belongsTo(SucursalMejorada::class, 'Fk_Sucursal', 'Sucursal_ID');
    }

    // Relación con Citas
    public function citas()
    {
        return $this->hasMany(CitaMejorada::class, 'Fk_Consultorio', 'Consultorio_ID');
    }
}
