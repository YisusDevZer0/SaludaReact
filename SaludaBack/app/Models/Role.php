<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use SoftDeletes;

    protected $table = 'roles_puestos';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'nombre',
        'descripcion',
        'estado',
        'nivel_acceso',
        'permisos',
        'codigo',
        'tipo_rol',
        'configuracion',
        'fecha_creacion',
        'fecha_modificacion',
        'creado_por',
        'modificado_por'
    ];

    protected $casts = [
        'permisos' => 'array',
        'configuracion' => 'array',
        'fecha_creacion' => 'datetime',
        'fecha_modificacion' => 'datetime',
    ];

    // Relación con personal
    public function personal()
    {
        return $this->hasMany(PersonalPos::class, 'role_id');
    }

    // Scope para roles activos
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    // Scope para roles por nivel de acceso
    public function scopePorNivelAcceso($query, $nivel)
    {
        return $query->where('nivel_acceso', $nivel);
    }

    // Método para verificar si el rol tiene un permiso específico
    public function tienePermiso($permiso)
    {
        if (!$this->permisos) {
            return false;
        }

        return in_array($permiso, $this->permisos);
    }

    // Método para agregar permisos al rol
    public function agregarPermisos($permisos)
    {
        $permisosActuales = $this->permisos ?? [];
        $nuevosPermisos = array_merge($permisosActuales, (array) $permisos);
        $this->update(['permisos' => array_unique($nuevosPermisos)]);
    }

    // Método para remover permisos del rol
    public function removerPermisos($permisos)
    {
        $permisosActuales = $this->permisos ?? [];
        $permisosFiltrados = array_diff($permisosActuales, (array) $permisos);
        $this->update(['permisos' => array_values($permisosFiltrados)]);
    }

    // Método para obtener información completa del rol
    public function getInformacionCompletaAttribute()
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'estado' => $this->estado,
            'nivel_acceso' => $this->nivel_acceso,
            'permisos' => $this->permisos ?? [],
            'codigo' => $this->codigo,
            'tipo_rol' => $this->tipo_rol,
            'total_personal' => $this->personal()->count()
        ];
    }
} 