<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Marca extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'marcas';
    protected $primaryKey = 'Marca_ID';
    public $timestamps = true;

    protected $fillable = [
        'Nom_Marca',
        'Estado',
        'Cod_Estado',
        'Agregado_Por',
        'Agregadoel',
        'Sistema',
        'ID_H_O_D',
        'Descripcion',
        'Pais_Origen',
        'Sitio_Web',
        'Logo_URL'
    ];

    protected $casts = [
        'Agregadoel' => 'datetime',
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

    public function scopePorPais($query, $pais)
    {
        return $query->where('Pais_Origen', $pais);
    }

    public function scopeConLogo($query)
    {
        return $query->whereNotNull('Logo_URL');
    }

    public function scopeConSitioWeb($query)
    {
        return $query->whereNotNull('Sitio_Web');
    }

    // Relaciones
    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'servicio_marca', 'marca_id', 'servicio_id', 'Marca_ID', 'Servicio_ID')
                    ->withPivot('precio_especial', 'notas', 'agregado_por')
                    ->withTimestamps();
    }

    // Mutadores
    public function setNomMarcaAttribute($value)
    {
        $this->attributes['Nom_Marca'] = ucwords(strtolower(trim($value)));
    }

    public function setEstadoAttribute($value)
    {
        $this->attributes['Estado'] = ucfirst(strtolower($value));
        $this->attributes['Cod_Estado'] = $value === 'Activo' ? 'A' : 'I';
    }

    public function setPaisOrigenAttribute($value)
    {
        $this->attributes['Pais_Origen'] = $value ? ucwords(strtolower(trim($value))) : null;
    }

    public function setSitioWebAttribute($value)
    {
        if ($value && !str_starts_with($value, 'http://') && !str_starts_with($value, 'https://')) {
            $value = 'https://' . $value;
        }
        $this->attributes['Sitio_Web'] = $value;
    }

    // Accessors
    public function getEstadoColorAttribute()
    {
        return $this->Estado === 'Activo' ? 'success' : 'error';
    }

    public function getTieneLogoAttribute()
    {
        return !empty($this->Logo_URL);
    }

    public function getTieneSitioWebAttribute()
    {
        return !empty($this->Sitio_Web);
    }

    public function getLogoUrlSeguraAttribute()
    {
        return $this->Logo_URL ?? '/images/marcas/default-logo.png';
    }

    public function getServiciosCountAttribute()
    {
        return $this->servicios()->count();
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

    public function asociarServicio($servicioId, $precioEspecial = null, $notas = null, $agregadoPor = null)
    {
        return $this->servicios()->attach($servicioId, [
            'precio_especial' => $precioEspecial,
            'notas' => $notas,
            'agregado_por' => $agregadoPor
        ]);
    }

    public function desasociarServicio($servicioId)
    {
        return $this->servicios()->detach($servicioId);
    }

    public static function paisesDisponibles()
    {
        return self::whereNotNull('Pais_Origen')
                   ->distinct()
                   ->orderBy('Pais_Origen')
                   ->pluck('Pais_Origen')
                   ->toArray();
    }
} 