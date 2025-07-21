<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'clientes';

    protected $fillable = [
        'codigo',
        'nombre',
        'apellido',
        'razon_social',
        'email',
        'telefono',
        'celular',
        'dni',
        'cuit',
        'tipo_persona',
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
        'saldo_actual',
        'condicion_iva',
        'numero_ingresos_brutos',
        'exento_iva',
        'contacto_alternativo',
        'telefono_alternativo',
        'email_alternativo',
        'direccion_facturacion',
        'ciudad_facturacion',
        'provincia_facturacion',
        'codigo_postal_facturacion',
        'direccion_envio',
        'ciudad_envio',
        'provincia_envio',
        'codigo_postal_envio',
        'instrucciones_envio',
        'obra_social',
        'numero_afiliado',
        'plan_obra_social',
        'alergias',
        'medicamentos_actuales',
        'condiciones_medicas',
        'grupo_sanguineo',
        'factor_rh',
        'fecha_nacimiento',
        'genero',
        'profesion',
        'empresa',
        'cargo',
        'observaciones',
        'notas_internas',
        'preferencias',
        'etiquetas',
        'acepta_marketing',
        'acepta_newsletter',
        'fecha_ultima_compra',
        'total_compras',
        'cantidad_compras',
        'promedio_compra',
        'creado_por',
        'actualizado_por',
    ];

    protected $casts = [
        'limite_credito' => 'decimal:2',
        'descuento_por_defecto' => 'decimal:2',
        'saldo_actual' => 'decimal:2',
        'total_compras' => 'decimal:2',
        'promedio_compra' => 'decimal:2',
        'latitud' => 'decimal:8',
        'longitud' => 'decimal:8',
        'exento_iva' => 'boolean',
        'acepta_marketing' => 'boolean',
        'acepta_newsletter' => 'boolean',
        'preferencias' => 'array',
        'etiquetas' => 'array',
        'fecha_nacimiento' => 'date',
        'fecha_ultima_compra' => 'date',
        'dias_credito' => 'integer',
        'cantidad_compras' => 'integer',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
        'fecha_nacimiento',
        'fecha_ultima_compra',
    ];

    /**
     * Get the ventas for the cliente.
     */
    public function ventas(): HasMany
    {
        return $this->hasMany(Venta::class);
    }

    /**
     * Get the encargos for the cliente.
     */
    public function encargos(): HasMany
    {
        return $this->hasMany(Encargo::class);
    }

    /**
     * Scope para clientes activos
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    /**
     * Scope para clientes por categoría
     */
    public function scopePorCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    /**
     * Scope para clientes por tipo de persona
     */
    public function scopePorTipoPersona($query, $tipo)
    {
        return $query->where('tipo_persona', $tipo);
    }

    /**
     * Scope para búsqueda
     */
    public function scopeBuscar($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('codigo', 'LIKE', "%{$search}%")
              ->orWhere('nombre', 'LIKE', "%{$search}%")
              ->orWhere('apellido', 'LIKE', "%{$search}%")
              ->orWhere('razon_social', 'LIKE', "%{$search}%")
              ->orWhere('dni', 'LIKE', "%{$search}%")
              ->orWhere('cuit', 'LIKE', "%{$search}%")
              ->orWhere('email', 'LIKE', "%{$search}%");
        });
    }

    /**
     * Get the full name attribute
     */
    public function getNombreCompletoAttribute(): string
    {
        if ($this->tipo_persona === 'juridica' && $this->razon_social) {
            return $this->razon_social;
        }
        
        return trim($this->nombre . ' ' . $this->apellido);
    }

    /**
     * Get the contact info attribute
     */
    public function getContactoInfoAttribute(): string
    {
        $contacto = [];
        
        if ($this->telefono) {
            $contacto[] = $this->telefono;
        }
        
        if ($this->celular) {
            $contacto[] = $this->celular;
        }
        
        if ($this->email) {
            $contacto[] = $this->email;
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
     * Get the billing address attribute
     */
    public function getDireccionFacturacionCompletaAttribute(): string
    {
        $direccion = [];
        
        if ($this->direccion_facturacion) {
            $direccion[] = $this->direccion_facturacion;
        }
        
        if ($this->ciudad_facturacion) {
            $direccion[] = $this->ciudad_facturacion;
        }
        
        if ($this->provincia_facturacion) {
            $direccion[] = $this->provincia_facturacion;
        }
        
        if ($this->codigo_postal_facturacion) {
            $direccion[] = $this->codigo_postal_facturacion;
        }
        
        return implode(', ', $direccion);
    }

    /**
     * Get the shipping address attribute
     */
    public function getDireccionEnvioCompletaAttribute(): string
    {
        $direccion = [];
        
        if ($this->direccion_envio) {
            $direccion[] = $this->direccion_envio;
        }
        
        if ($this->ciudad_envio) {
            $direccion[] = $this->ciudad_envio;
        }
        
        if ($this->provincia_envio) {
            $direccion[] = $this->provincia_envio;
        }
        
        if ($this->codigo_postal_envio) {
            $direccion[] = $this->codigo_postal_envio;
        }
        
        return implode(', ', $direccion);
    }

    /**
     * Get the health info attribute
     */
    public function getInfoSaludAttribute(): string
    {
        $info = [];
        
        if ($this->obra_social) {
            $info[] = $this->obra_social;
        }
        
        if ($this->numero_afiliado) {
            $info[] = "Afiliado: {$this->numero_afiliado}";
        }
        
        if ($this->plan_obra_social) {
            $info[] = $this->plan_obra_social;
        }
        
        if ($this->grupo_sanguineo) {
            $info[] = "Grupo: {$this->grupo_sanguineo}";
        }
        
        return implode(' - ', $info);
    }

    /**
     * Check if client is active
     */
    public function isActivo(): bool
    {
        return $this->estado === 'activo';
    }

    /**
     * Check if client has credit limit
     */
    public function hasLimiteCredito(): bool
    {
        return $this->limite_credito > 0;
    }

    /**
     * Check if client has discount
     */
    public function hasDescuento(): bool
    {
        return $this->descuento_por_defecto > 0;
    }

    /**
     * Check if client has debt
     */
    public function hasDeuda(): bool
    {
        return $this->saldo_actual > 0;
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
     * Get formatted current balance
     */
    public function getSaldoActualFormateadoAttribute(): string
    {
        return '$' . number_format($this->saldo_actual, 2);
    }

    /**
     * Get formatted total purchases
     */
    public function getTotalComprasFormateadoAttribute(): string
    {
        return '$' . number_format($this->total_compras, 2);
    }

    /**
     * Get formatted average purchase
     */
    public function getPromedioCompraFormateadoAttribute(): string
    {
        return '$' . number_format($this->promedio_compra, 2);
    }

    /**
     * Get age attribute
     */
    public function getEdadAttribute(): ?int
    {
        if (!$this->fecha_nacimiento) {
            return null;
        }
        
        return $this->fecha_nacimiento->age;
    }

    /**
     * Get total sales amount
     */
    public function getTotalVentasAttribute(): float
    {
        return $this->ventas()->sum('total');
    }

    /**
     * Get total sales count
     */
    public function getCantidadVentasAttribute(): int
    {
        return $this->ventas()->count();
    }

    /**
     * Get average sale amount
     */
    public function getPromedioVentaAttribute(): float
    {
        $total = $this->total_ventas;
        $cantidad = $this->cantidad_ventas;
        
        return $cantidad > 0 ? $total / $cantidad : 0;
    }

    /**
     * Get last sale date
     */
    public function getUltimaVentaAttribute()
    {
        return $this->ventas()->latest()->first()?->fecha_venta;
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($cliente) {
            if (!$cliente->codigo) {
                $cliente->codigo = static::generateCodigo();
            }
        });
    }

    /**
     * Generate unique code for client
     */
    protected static function generateCodigo(): string
    {
        $prefix = 'CLI';
        $lastClient = static::where('codigo', 'LIKE', $prefix . '%')
            ->orderBy('codigo', 'desc')
            ->first();

        if ($lastClient) {
            $lastNumber = (int) substr($lastClient->codigo, strlen($prefix));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 6, '0', STR_PAD_LEFT);
    }
} 