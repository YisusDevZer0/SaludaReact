<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proveedor extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'proveedores';

    protected $fillable = [
        'codigo',
        'razon_social',
        'nombre_comercial',
        'cuit',
        'dni',
        'tipo_persona',
        'email',
        'telefono',
        'celular',
        'fax',
        'sitio_web',
        'direccion',
        'ciudad',
        'provincia',
        'codigo_postal',
        'pais',
        'latitud',
        'longitud',
        'categoria',
        'estado',
        'limite_credito',
        'dias_credito',
        'descuento_por_defecto',
        'banco',
        'tipo_cuenta',
        'numero_cuenta',
        'cbu',
        'alias_cbu',
        'condicion_iva',
        'retencion_iva',
        'porcentaje_retencion_iva',
        'retencion_ganancias',
        'porcentaje_retencion_ganancias',
        'contacto_nombre',
        'contacto_cargo',
        'contacto_telefono',
        'contacto_email',
        'contacto_celular',
        'hora_apertura',
        'hora_cierre',
        'horarios_semana',
        'tiempo_entrega_promedio',
        'observaciones',
        'notas_internas',
        'logo_url',
        'documentos',
        'etiquetas',
        'creado_por',
        'actualizado_por',
    ];

    protected $casts = [
        'limite_credito' => 'decimal:2',
        'descuento_por_defecto' => 'decimal:2',
        'porcentaje_retencion_iva' => 'decimal:2',
        'porcentaje_retencion_ganancias' => 'decimal:2',
        'latitud' => 'decimal:8',
        'longitud' => 'decimal:8',
        'retencion_iva' => 'boolean',
        'retencion_ganancias' => 'boolean',
        'horarios_semana' => 'array',
        'documentos' => 'array',
        'etiquetas' => 'array',
        'hora_apertura' => 'datetime:H:i',
        'hora_cierre' => 'datetime:H:i',
        'tiempo_entrega_promedio' => 'integer',
        'dias_credito' => 'integer',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * Get the compras for the proveedor.
     */
    public function compras(): HasMany
    {
        return $this->hasMany(Compra::class);
    }

    /**
     * Get the productos for the proveedor.
     */
    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class);
    }

    /**
     * Scope para proveedores activos
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    /**
     * Scope para proveedores por categoría
     */
    public function scopePorCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    /**
     * Scope para búsqueda
     */
    public function scopeBuscar($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('codigo', 'LIKE', "%{$search}%")
              ->orWhere('razon_social', 'LIKE', "%{$search}%")
              ->orWhere('nombre_comercial', 'LIKE', "%{$search}%")
              ->orWhere('cuit', 'LIKE', "%{$search}%")
              ->orWhere('email', 'LIKE', "%{$search}%");
        });
    }

    /**
     * Get the full name attribute
     */
    public function getNombreCompletoAttribute(): string
    {
        return $this->nombre_comercial ?: $this->razon_social;
    }

    /**
     * Get the contact info attribute
     */
    public function getContactoInfoAttribute(): string
    {
        $contacto = [];
        
        if ($this->contacto_nombre) {
            $contacto[] = $this->contacto_nombre;
        }
        
        if ($this->contacto_cargo) {
            $contacto[] = "({$this->contacto_cargo})";
        }
        
        if ($this->contacto_telefono) {
            $contacto[] = $this->contacto_telefono;
        }
        
        if ($this->contacto_email) {
            $contacto[] = $this->contacto_email;
        }
        
        return implode(' - ', $contacto);
    }

    /**
     * Get the address attribute
     */
    public function getDireccionCompletaAttribute(): string
    {
        $direccion = [];
        
        if ($this->direccion) {
            $direccion[] = $this->direccion;
        }
        
        if ($this->ciudad) {
            $direccion[] = $this->ciudad;
        }
        
        if ($this->provincia) {
            $direccion[] = $this->provincia;
        }
        
        if ($this->codigo_postal) {
            $direccion[] = $this->codigo_postal;
        }
        
        return implode(', ', $direccion);
    }

    /**
     * Get the banking info attribute
     */
    public function getInfoBancariaAttribute(): string
    {
        $info = [];
        
        if ($this->banco) {
            $info[] = $this->banco;
        }
        
        if ($this->tipo_cuenta) {
            $info[] = $this->tipo_cuenta;
        }
        
        if ($this->numero_cuenta) {
            $info[] = $this->numero_cuenta;
        }
        
        if ($this->cbu) {
            $info[] = "CBU: {$this->cbu}";
        }
        
        return implode(' - ', $info);
    }

    /**
     * Check if provider is active
     */
    public function isActivo(): bool
    {
        return $this->estado === 'activo';
    }

    /**
     * Check if provider has credit limit
     */
    public function hasLimiteCredito(): bool
    {
        return $this->limite_credito > 0;
    }

    /**
     * Check if provider has discount
     */
    public function hasDescuento(): bool
    {
        return $this->descuento_por_defecto > 0;
    }

    /**
     * Get formatted credit limit
     */
    public function getLimiteCreditoFormateadoAttribute(): string
    {
        return $this->limite_credito ? '$' . number_format($this->limite_credito, 2) : 'Sin límite';
    }

    /**
     * Get formatted discount
     */
    public function getDescuentoFormateadoAttribute(): string
    {
        return $this->descuento_por_defecto ? $this->descuento_por_defecto . '%' : 'Sin descuento';
    }

    /**
     * Get formatted delivery time
     */
    public function getTiempoEntregaFormateadoAttribute(): string
    {
        if (!$this->tiempo_entrega_promedio) {
            return 'No especificado';
        }
        
        return $this->tiempo_entrega_promedio . ' días';
    }

    /**
     * Get business hours
     */
    public function getHorariosComercialesAttribute(): string
    {
        if (!$this->hora_apertura || !$this->hora_cierre) {
            return 'No especificado';
        }
        
        return $this->hora_apertura->format('H:i') . ' - ' . $this->hora_cierre->format('H:i');
    }

    /**
     * Get total purchases amount
     */
    public function getTotalComprasAttribute(): float
    {
        return $this->compras()->sum('total');
    }

    /**
     * Get total purchases count
     */
    public function getCantidadComprasAttribute(): int
    {
        return $this->compras()->count();
    }

    /**
     * Get average purchase amount
     */
    public function getPromedioCompraAttribute(): float
    {
        $total = $this->total_compras;
        $cantidad = $this->cantidad_compras;
        
        return $cantidad > 0 ? $total / $cantidad : 0;
    }

    /**
     * Get last purchase date
     */
    public function getUltimaCompraAttribute()
    {
        return $this->compras()->latest()->first()?->fecha_compra;
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($proveedor) {
            if (!$proveedor->codigo) {
                $proveedor->codigo = static::generateCodigo();
            }
        });
    }

    /**
     * Generate unique code for provider
     */
    protected static function generateCodigo(): string
    {
        $prefix = 'PROV';
        $lastProvider = static::where('codigo', 'LIKE', $prefix . '%')
            ->orderBy('codigo', 'desc')
            ->first();

        if ($lastProvider) {
            $lastNumber = (int) substr($lastProvider->codigo, strlen($prefix));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 6, '0', STR_PAD_LEFT);
    }
} 