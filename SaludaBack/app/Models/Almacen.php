<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Almacen extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'almacenes';
    protected $primaryKey = 'Almacen_ID';
    public $timestamps = true;

    protected $fillable = [
        'Nom_Almacen',
        'Tipo',
        'Responsable',
        'Estado',
        'Cod_Estado',
        'Sistema',
        'FkSucursal',
        'Agregado_Por',
        'Agregadoel',
        'Descripcion',
        'Ubicacion',
        'Capacidad_Max',
        'Unidad_Medida',
        'Telefono',
        'Email',
        'Id_Licencia'
    ];

    protected $hidden = [
        'Id_Licencia' // Ocultar por seguridad
    ];

    protected $casts = [
        'Agregadoel' => 'datetime',
        'Capacidad_Max' => 'decimal:2',
        'FkSucursal' => 'integer',
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

    // Tipos permitidos para almacenes
    const TIPOS_PERMITIDOS = [
        'Servicio' => 'Servicios Médicos',
        'Insumo' => 'Insumos Médicos',
        'Medicamento' => 'Medicamentos',
        'Equipo' => 'Equipos Médicos',
        'Material' => 'Materiales',
        'Consumible' => 'Consumibles'
    ];

    // Unidades de medida comunes
    const UNIDADES_MEDIDA = [
        'm²' => 'Metros cuadrados',
        'unidades' => 'Unidades',
        'kg' => 'Kilogramos',
        'litros' => 'Litros',
        'cajas' => 'Cajas',
        'paquetes' => 'Paquetes'
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

    public function scopePorTipo($query, $tipo)
    {
        return $query->where('Tipo', $tipo);
    }

    public function scopePorSucursal($query, $sucursalId)
    {
        return $query->where('FkSucursal', $sucursalId);
    }

    public function scopePorResponsable($query, $responsable)
    {
        return $query->where('Responsable', 'LIKE', "%{$responsable}%");
    }

    public function scopePorOrganizacion($query, $organizacion)
    {
        return $query->where('ID_H_O_D', $organizacion);
    }

    public function scopePorSistema($query, $sistema)
    {
        return $query->where('Sistema', $sistema);
    }

    public function scopeConCapacidad($query)
    {
        return $query->whereNotNull('Capacidad_Max');
    }

    public function scopeBuscar($query, $termino)
    {
        return $query->where(function($q) use ($termino) {
            $q->where('Nom_Almacen', 'LIKE', "%{$termino}%")
              ->orWhere('Responsable', 'LIKE', "%{$termino}%")
              ->orWhere('Descripcion', 'LIKE', "%{$termino}%")
              ->orWhere('Ubicacion', 'LIKE', "%{$termino}%");
        });
    }

    // Relaciones
    public function sucursal()
    {
        // Asumiendo que existe una tabla sucursales
        return $this->belongsTo(Sucursal::class, 'FkSucursal', 'id');
    }

    // Mutadores
    public function setNomAlmacenAttribute($value)
    {
        $this->attributes['Nom_Almacen'] = ucwords(strtolower(trim($value)));
    }

    public function setResponsableAttribute($value)
    {
        $this->attributes['Responsable'] = ucwords(strtolower(trim($value)));
    }

    public function setEstadoAttribute($value)
    {
        $this->attributes['Estado'] = ucfirst(strtolower($value));
        $this->attributes['Cod_Estado'] = $value === 'Activo' ? 'A' : 'I';
    }

    public function setEmailAttribute($value)
    {
        $this->attributes['Email'] = $value ? strtolower(trim($value)) : null;
    }

    public function setTelefonoAttribute($value)
    {
        $this->attributes['Telefono'] = $value ? preg_replace('/[^0-9\-\+\(\)\s]/', '', $value) : null;
    }

    // Accessors
    public function getEstadoColorAttribute()
    {
        return $this->Estado === 'Activo' ? 'success' : 'error';
    }

    public function getTipoDescripcionAttribute()
    {
        return self::TIPOS_PERMITIDOS[$this->Tipo] ?? $this->Tipo;
    }

    public function getCapacidadFormateadaAttribute()
    {
        if (!$this->Capacidad_Max) {
            return 'No definida';
        }
        
        $unidad = $this->Unidad_Medida ?? 'unidades';
        return number_format($this->Capacidad_Max, 2) . ' ' . $unidad;
    }

    public function getTelefonoFormateadoAttribute()
    {
        if (!$this->Telefono) {
            return null;
        }

        // Formato básico para teléfonos
        $telefono = preg_replace('/[^0-9]/', '', $this->Telefono);
        if (strlen($telefono) === 10) {
            return '(' . substr($telefono, 0, 3) . ') ' . substr($telefono, 3, 3) . '-' . substr($telefono, 6);
        }
        
        return $this->Telefono;
    }

    public function getContactoCompletoAttribute()
    {
        $contacto = [];
        
        if ($this->Telefono) {
            $contacto[] = 'Tel: ' . $this->telefono_formateado;
        }
        
        if ($this->Email) {
            $contacto[] = 'Email: ' . $this->Email;
        }
        
        return !empty($contacto) ? implode(' | ', $contacto) : 'Sin contacto';
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

    public function cambiarResponsable($nuevoResponsable, $usuarioModificador = null)
    {
        $this->update([
            'Responsable' => $nuevoResponsable,
            'Agregado_Por' => $usuarioModificador ?? $this->Agregado_Por
        ]);
    }

    public function esDelTipo($tipo)
    {
        return $this->Tipo === $tipo;
    }

    public function tieneCapacidadDefinida()
    {
        return !is_null($this->Capacidad_Max) && $this->Capacidad_Max > 0;
    }

    public function puedeAlmacenar($cantidad = 1)
    {
        if (!$this->tieneCapacidadDefinida()) {
            return true; // Sin límite definido
        }
        
        // Aquí podrías agregar lógica para verificar stock actual
        return $this->Capacidad_Max >= $cantidad;
    }

    // Métodos estáticos
    public static function tiposDisponibles()
    {
        return array_keys(self::TIPOS_PERMITIDOS);
    }

    public static function tiposConDescripcion()
    {
        return self::TIPOS_PERMITIDOS;
    }

    public static function unidadesMedidaDisponibles()
    {
        return array_keys(self::UNIDADES_MEDIDA);
    }

    public static function porcentajeUtilizacionPorTipo()
    {
        return self::selectRaw('Tipo, COUNT(*) as total, 
                                SUM(CASE WHEN Estado = "Activo" THEN 1 ELSE 0 END) as activos')
                   ->groupBy('Tipo')
                   ->get()
                   ->map(function ($item) {
                       return [
                           'tipo' => $item->Tipo,
                           'total' => $item->total,
                           'activos' => $item->activos,
                           'porcentaje_activos' => $item->total > 0 ? round(($item->activos / $item->total) * 100, 1) : 0
                       ];
                   });
    }

    public static function estadisticasPorSucursal($sucursalId = null)
    {
        $query = self::query();
        
        if ($sucursalId) {
            $query->where('FkSucursal', $sucursalId);
        }
        
        return [
            'total' => $query->count(),
            'activos' => $query->where('Estado', 'Activo')->count(),
            'por_tipo' => $query->selectRaw('Tipo, COUNT(*) as cantidad')
                                ->groupBy('Tipo')
                                ->pluck('cantidad', 'Tipo')
                                ->toArray()
        ];
    }
} 