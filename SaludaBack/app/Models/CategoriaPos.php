<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoriaPos extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * La tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'categorias_pos';

    /**
     * La clave primaria del modelo.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'categoria_padre_id',
        'codigo',
        'icono',
        'color',
        'orden',
        'activa',
        'visible_en_pos',
        'comision',
        'Id_Licencia'
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'activa' => 'boolean',
        'visible_en_pos' => 'boolean',
        'comision' => 'decimal:2',
        'orden' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Los atributos que deben ser ocultos para arrays.
     *
     * @var array
     */
    protected $hidden = [
        'deleted_at',
        'Id_Licencia' // Campo oculto por seguridad
    ];

    /**
     * Relación con la categoría padre
     */
    public function categoriaPadre()
    {
        return $this->belongsTo(CategoriaPos::class, 'categoria_padre_id');
    }

    /**
     * Relación con las categorías hijas
     */
    public function categoriasHijas()
    {
        return $this->hasMany(CategoriaPos::class, 'categoria_padre_id');
    }

    /**
     * Relación con la licencia/organización
     */
    public function licencia()
    {
        return $this->belongsTo(HospitalOrganizacionDueño::class, 'Id_Licencia', 'Id_Licencia');
    }

    /**
     * Scope para filtrar categorías activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activa', true);
    }

    /**
     * Scope para filtrar categorías visibles en POS
     */
    public function scopeVisiblesEnPos($query)
    {
        return $query->where('visible_en_pos', true);
    }

    /**
     * Scope para filtrar categorías raíz (sin padre)
     */
    public function scopeRaiz($query)
    {
        return $query->whereNull('categoria_padre_id');
    }

    /**
     * Scope para ordenar por orden
     */
    public function scopeOrdenadas($query)
    {
        return $query->orderBy('orden', 'asc');
    }

    /**
     * Scope para filtrar por licencia
     */
    public function scopePorLicencia($query, $licencia)
    {
        return $query->where('Id_Licencia', $licencia);
    }

    /**
     * Accessor para el estado
     */
    public function getEstadoAttribute()
    {
        return $this->activa ? 'Vigente' : 'No Vigente';
    }

    /**
     * Accessor para el sistema (simulado)
     */
    public function getSistemaAttribute()
    {
        return 'POS'; // Por defecto
    }

    /**
     * Accessor para Nom_Cat (compatibilidad)
     */
    public function getNomCatAttribute()
    {
        return $this->nombre;
    }

    /**
     * Accessor para Cat_ID (compatibilidad)
     */
    public function getCatIdAttribute()
    {
        return $this->id;
    }

    /**
     * Accessor para ID_H_O_D (compatibilidad)
     */
    public function getIDHODAttribute()
    {
        return $this->Id_Licencia;
    }

    /**
     * Accessor para Agregado_Por (compatibilidad)
     */
    public function getAgregadoPorAttribute()
    {
        return 'Sistema';
    }

    /**
     * Accessor para Agregadoel (compatibilidad)
     */
    public function getAgregadoelAttribute()
    {
        return $this->created_at;
    }

    /**
     * Boot method para asignar automáticamente la licencia
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
}
