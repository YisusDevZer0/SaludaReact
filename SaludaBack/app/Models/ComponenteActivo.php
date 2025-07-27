<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComponenteActivo extends Model
{
    use SoftDeletes;

    protected $table = 'componentes_activos';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nombre',
        'descripcion',
        'codigo',
        'formula_quimica',
        'concentracion_estandar',
        'unidad_concentracion',
        'indicaciones',
        'contraindicaciones',
        'efectos_secundarios',
        'interacciones',
        'activo',
        'Id_Licencia'
    ];

    protected $hidden = [
        'Id_Licencia' // Campo oculto por seguridad
    ];

    protected $casts = [
        'concentracion_estandar' => 'decimal:3',
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Boot del modelo para asignar automáticamente Id_Licencia
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Si no se proporciona Id_Licencia, intentar obtenerla del usuario autenticado
            if (empty($model->Id_Licencia)) {
                $user = auth('api')->user();
                if ($user) {
                    $model->Id_Licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
                }
            }
        });
    }

    /**
     * Relación con la licencia
     */
    public function licencia()
    {
        return $this->belongsTo(HospitalOrganizacionDueño::class, 'Id_Licencia', 'Id_Licencia');
    }

    /**
     * Scope para filtrar por licencia
     */
    public function scopePorLicencia(Builder $query, $licencia = null): Builder
    {
        if (!$licencia) {
            $user = auth('api')->user();
            $licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
        }
        
        if ($licencia) {
            return $query->where('Id_Licencia', $licencia);
        }
        
        return $query;
    }

    // Scope para filtrar componentes activos
    public function scopeActivo(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    // Scope para búsqueda general
    public function scopeBusqueda(Builder $query, string $termino): Builder
    {
        return $query->where(function($q) use ($termino) {
            $q->where('nombre', 'LIKE', "%{$termino}%")
              ->orWhere('descripcion', 'LIKE', "%{$termino}%")
              ->orWhere('codigo', 'LIKE', "%{$termino}%");
        });
    }

    // Accessors para compatibilidad con nombres antiguos
    public function getNomComAttribute($value)
    {
        return $this->nombre;
    }

    public function getEstadoAttribute($value)
    {
        return $this->activo ? 'Vigente' : 'Descontinuado';
    }

    public function getCodEstadoAttribute($value)
    {
        return $this->activo ? 'V' : 'D';
    }

    public function getSistemaAttribute($value)
    {
        return 'POS'; // Por defecto
    }

    public function getIDHODAttribute($value)
    {
        return 'Saluda'; // Por defecto
    }

    public function getAgregadoPorAttribute($value)
    {
        return 'Sistema';
    }

    public function getAgregadoelAttribute($value)
    {
        return $this->created_at;
    }

    public function getIDCompAttribute($value)
    {
        return $this->id;
    }

    public function getOrganizacionAttribute($value)
    {
        return 'Saluda'; // Por defecto
    }
} 