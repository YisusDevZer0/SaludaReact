<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permiso extends Model
{
    use HasFactory;

    protected $table = 'permisos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'modulo',
        'accion',
        'activo'
    ];

    protected $casts = [
        'activo' => 'boolean'
    ];

    /**
     * Relación muchos a muchos con roles
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permisos', 'permiso_id', 'role_id');
    }

    /**
     * Scope para permisos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para permisos por módulo
     */
    public function scopePorModulo($query, $modulo)
    {
        return $query->where('modulo', $modulo);
    }

    /**
     * Scope para permisos por acción
     */
    public function scopePorAccion($query, $accion)
    {
        return $query->where('accion', $accion);
    }

    /**
     * Obtener el nombre formateado del módulo
     */
    public function getModuloFormateadoAttribute(): string
    {
        $modulos = [
            'usuarios' => 'Usuarios',
            'personal' => 'Personal',
            'productos' => 'Productos',
            'ventas' => 'Ventas',
            'compras' => 'Compras',
            'inventario' => 'Inventario',
            'reportes' => 'Reportes',
            'configuracion' => 'Configuración',
            'agendas' => 'Agendas',
            'cajas' => 'Cajas',
            'gastos' => 'Gastos',
            'proveedores' => 'Proveedores',
            'clientes' => 'Clientes',
            'sucursales' => 'Sucursales',
            'almacenes' => 'Almacenes',
            'fondos_caja' => 'Fondos de Caja',
            'encargos' => 'Encargos',
            'asistencia' => 'Asistencia',
            'auditorias' => 'Auditorías'
        ];

        return $modulos[$this->modulo] ?? ucfirst($this->modulo);
    }

    /**
     * Obtener el nombre formateado de la acción
     */
    public function getAccionFormateadaAttribute(): string
    {
        $acciones = [
            'ver' => 'Ver',
            'crear' => 'Crear',
            'editar' => 'Editar',
            'eliminar' => 'Eliminar',
            'exportar' => 'Exportar',
            'importar' => 'Importar',
            'aprobar' => 'Aprobar',
            'rechazar' => 'Rechazar',
            'confirmar' => 'Confirmar',
            'anular' => 'Anular',
            'reportar' => 'Reportar',
            'configurar' => 'Configurar'
        ];

        return $acciones[$this->accion] ?? ucfirst($this->accion);
    }

    /**
     * Verificar si el permiso está asignado a un rol
     */
    public function tieneRol($roleId): bool
    {
        return $this->roles()->where('role_id', $roleId)->exists();
    }

    /**
     * Obtener permisos por módulo y acción
     */
    public static function getPorModuloAccion($modulo, $accion)
    {
        return static::where('modulo', $modulo)
            ->where('accion', $accion)
            ->where('activo', true)
            ->first();
    }

    /**
     * Obtener todos los módulos disponibles
     */
    public static function getModulosDisponibles()
    {
        return static::select('modulo')
            ->distinct()
            ->where('activo', true)
            ->pluck('modulo');
    }

    /**
     * Obtener todas las acciones disponibles
     */
    public static function getAccionesDisponibles()
    {
        return static::select('accion')
            ->distinct()
            ->where('activo', true)
            ->pluck('accion');
    }
}
