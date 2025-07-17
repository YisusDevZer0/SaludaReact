<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Servicio extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'Servicios_POS';
    protected $primaryKey = 'Servicio_ID';
    public $timestamps = true;

    protected $fillable = [
        'Nom_Serv',
        'Estado',
        'Cod_Estado',
        'Agregado_Por',
        'Agregadoel',
        'Sistema',
        'ID_H_O_D'
    ];

    protected $casts = [
        'Agregadoel' => 'datetime',
        'Sistema' => 'boolean',
        'ID_H_O_D' => 'integer',
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

    // Estados disponibles
    const ESTADOS = [
        'Activo' => 'A',
        'Inactivo' => 'I'
    ];

    // Scopes para consultas comunes
    public function scopeActivos($query)
    {
        return $query->where('Estado', 'Activo')->where('Cod_Estado', 'A');
    }

    public function scopeInactivos($query)
    {
        return $query->where('Estado', 'Inactivo')->where('Cod_Estado', 'I');
    }

    public function scopeSistema($query)
    {
        return $query->where('Sistema', true);
    }

    public function scopePorOrganizacion($query, $organizacion)
    {
        return $query->where('ID_H_O_D', $organizacion);
    }

    public function scopeBuscar($query, $termino)
    {
        return $query->where('Nom_Serv', 'LIKE', "%{$termino}%");
    }

    // Mutadores
    public function setNomServAttribute($value)
    {
        $this->attributes['Nom_Serv'] = ucwords(strtolower(trim($value)));
    }

    public function setEstadoAttribute($value)
    {
        $this->attributes['Estado'] = ucfirst(strtolower($value));
        $this->attributes['Cod_Estado'] = self::ESTADOS[$value] ?? 'A';
    }

    public function setAgregadoPorAttribute($value)
    {
        $this->attributes['Agregado_Por'] = ucwords(strtolower(trim($value)));
    }

    // Accessors
    public function getEstadoColorAttribute()
    {
        return $this->Estado === 'Activo' ? 'success' : 'error';
    }

    public function getSistemaDescripcionAttribute()
    {
        return $this->Sistema ? 'Sistema' : 'Personalizado';
    }

    public function getSistemaColorAttribute()
    {
        return $this->Sistema ? 'primary' : 'secondary';
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

    public function esActivo()
    {
        return $this->Estado === 'Activo' && $this->Cod_Estado === 'A';
    }

    public function esSistema()
    {
        return $this->Sistema === true;
    }

    // Métodos estáticos
    public static function estadosDisponibles()
    {
        return array_keys(self::ESTADOS);
    }

    public static function codigosEstados()
    {
        return self::ESTADOS;
    }

    public static function porcentajeUtilizacion()
    {
        $total = self::count();
        $activos = self::activos()->count();
        
        return $total > 0 ? round(($activos / $total) * 100, 2) : 0;
    }

    public static function estadisticasPorOrganizacion($organizacionId = null)
    {
        $query = self::query();
        
        if ($organizacionId) {
            $query->porOrganizacion($organizacionId);
        }

        $total = $query->count();
        $activos = $query->activos()->count();
        $sistema = $query->sistema()->count();

        return [
            'total' => $total,
            'activos' => $activos,
            'inactivos' => $total - $activos,
            'sistema' => $sistema,
            'personalizados' => $total - $sistema,
            'porcentaje_activos' => $total > 0 ? round(($activos / $total) * 100, 2) : 0
        ];
    }
} 