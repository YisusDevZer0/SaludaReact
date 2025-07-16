<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Servicio extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'servicios';
    protected $primaryKey = 'Servicio_ID';
    public $timestamps = true;

    protected $fillable = [
        'Nom_Serv',
        'Estado',
        'Cod_Estado',
        'Agregado_Por',
        'Agregadoel',
        'Sistema',
        'ID_H_O_D',
        'Descripcion',
        'Precio_Base',
        'Requiere_Cita'
    ];

    protected $casts = [
        'Agregadoel' => 'datetime',
        'Precio_Base' => 'decimal:2',
        'Requiere_Cita' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    protected $dates = [
        'Agregadoel',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    // Scopes para consultas comunes
    public function scopeActivos($query)
    {
        return $query->where('Estado', 'Activo')->where('Cod_Estado', 'A');
    }

    public function scopePorSistema($query, $sistema)
    {
        return $query->where('Sistema', $sistema);
    }

    public function scopePorOrganizacion($query, $organizacion)
    {
        return $query->where('ID_H_O_D', $organizacion);
    }

    public function scopeConCita($query)
    {
        return $query->where('Requiere_Cita', true);
    }

    public function scopeSinCita($query)
    {
        return $query->where('Requiere_Cita', false);
    }

    // Relaciones
    public function marcas()
    {
        return $this->belongsToMany(Marca::class, 'servicio_marca', 'servicio_id', 'marca_id')
                    ->withPivot('precio_especial', 'notas', 'agregado_por')
                    ->withTimestamps();
    }

    // Mutadores
    public function setNomServAttribute($value)
    {
        $this->attributes['Nom_Serv'] = ucwords(strtolower(trim($value)));
    }

    public function setEstadoAttribute($value)
    {
        $this->attributes['Estado'] = ucfirst(strtolower($value));
        $this->attributes['Cod_Estado'] = $value === 'Activo' ? 'A' : 'I';
    }

    // Accessors
    public function getEstadoColorAttribute()
    {
        return $this->Estado === 'Activo' ? 'success' : 'error';
    }

    public function getPrecioFormateadoAttribute()
    {
        return $this->Precio_Base ? '$' . number_format($this->Precio_Base, 2) : 'No definido';
    }

    public function getRequiereCitaTextoAttribute()
    {
        return $this->Requiere_Cita ? 'Sí' : 'No';
    }

    // Métodos de utilidad
    public function activar()
    {
        $this->update([
            'Estado' => 'Activo',
            'Cod_Estado' => 'A'
        ]);
    }

    public function desactivar()
    {
        $this->update([
            'Estado' => 'Inactivo',
            'Cod_Estado' => 'I'
        ]);
    }

    public function asociarMarca($marcaId, $precioEspecial = null, $notas = null, $agregadoPor = null)
    {
        return $this->marcas()->attach($marcaId, [
            'precio_especial' => $precioEspecial,
            'notas' => $notas,
            'agregado_por' => $agregadoPor
        ]);
    }

    public function desasociarMarca($marcaId)
    {
        return $this->marcas()->detach($marcaId);
    }
} 