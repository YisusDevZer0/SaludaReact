<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FondoCaja extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'fondos_caja';

    protected $fillable = [
        'caja_id',
        'sucursal_id',
        'codigo',
        'nombre',
        'descripcion',
        'fondo_caja',
        'saldo_actual',
        'saldo_minimo',
        'saldo_maximo',
        'estatus',
        'codigo_estatus',
        'sistema',
        'agregado_por',
        'agregado_el',
        'actualizado_por',
        'actualizado_el',
        'Id_Licencia',
        'tipo_fondo',
        'configuracion_monedas',
        'configuracion_denominaciones',
        'observaciones',
        'permitir_sobrepasar_maximo',
        'requerir_aprobacion_retiro',
        'monto_maximo_retiro',
    ];

    protected $hidden = [
        'Id_Licencia', // Ocultar por seguridad
        'deleted_at'
    ];

    protected $casts = [
        'fondo_caja' => 'decimal:2',
        'saldo_actual' => 'decimal:2',
        'saldo_minimo' => 'decimal:2',
        'saldo_maximo' => 'decimal:2',
        'monto_maximo_retiro' => 'decimal:2',
        'sistema' => 'boolean',
        'permitir_sobrepasar_maximo' => 'boolean',
        'requerir_aprobacion_retiro' => 'boolean',
        'configuracion_monedas' => 'array',
        'configuracion_denominaciones' => 'array',
        'agregado_el' => 'datetime',
        'actualizado_el' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    protected $dates = [
        'agregado_el',
        'actualizado_el',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    // Tipos de fondo disponibles
    const TIPOS_FONDO = [
        'efectivo' => 'Efectivo',
        'mixto' => 'Mixto (Efectivo + Digital)',
        'digital' => 'Digital'
    ];

    // Estados disponibles
    const ESTADOS = [
        'activo' => 'Activo',
        'inactivo' => 'Inactivo',
        'suspendido' => 'Suspendido'
    ];

    // Códigos de estado
    const CODIGOS_ESTADO = [
        'A' => 'Activo',
        'I' => 'Inactivo',
        'S' => 'Suspendido'
    ];

    /**
     * Relación con la caja
     */
    public function caja(): BelongsTo
    {
        return $this->belongsTo(Caja::class, 'caja_id');
    }

    /**
     * Relación con la sucursal
     */
    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    /**
     * Relación con movimientos de caja
     */
    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoCaja::class, 'fondo_caja_id');
    }

    /**
     * Relación con cierres de caja
     */
    public function cierres(): HasMany
    {
        return $this->hasMany(CierreCaja::class, 'fondo_caja_id');
    }

    /**
     * Scope para fondos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('estatus', 'activo');
    }

    /**
     * Scope para fondos por sucursal
     */
    public function scopePorSucursal($query, $sucursalId)
    {
        return $query->where('sucursal_id', $sucursalId);
    }

    /**
     * Scope para fondos por caja
     */
    public function scopePorCaja($query, $cajaId)
    {
        return $query->where('caja_id', $cajaId);
    }

    /**
     * Scope para fondos por tipo
     */
    public function scopePorTipo($query, $tipo)
    {
        return $query->where('tipo_fondo', $tipo);
    }

    /**
     * Scope para fondos del sistema
     */
    public function scopeDelSistema($query)
    {
        return $query->where('sistema', true);
    }

    /**
     * Verificar si el fondo está activo
     */
    public function estaActivo(): bool
    {
        return $this->estatus === 'activo';
    }

    /**
     * Verificar si el saldo está por debajo del mínimo
     */
    public function saldoBajo(): bool
    {
        return $this->saldo_actual < $this->saldo_minimo;
    }

    /**
     * Verificar si el saldo está por encima del máximo
     */
    public function saldoAlto(): bool
    {
        return $this->saldo_maximo && $this->saldo_actual > $this->saldo_maximo;
    }

    /**
     * Obtener el porcentaje de uso del fondo
     */
    public function getPorcentajeUso(): float
    {
        if ($this->saldo_maximo && $this->saldo_maximo > 0) {
            return ($this->saldo_actual / $this->saldo_maximo) * 100;
        }
        return 0;
    }

    /**
     * Obtener el monto disponible para retiro
     */
    public function getMontoDisponible(): float
    {
        $disponible = $this->saldo_actual - $this->saldo_minimo;
        return max(0, $disponible);
    }

    /**
     * Verificar si se puede hacer un retiro
     */
    public function puedeRetirar(float $monto): bool
    {
        if (!$this->estaActivo()) {
            return false;
        }

        if ($this->requerir_aprobacion_retiro && $monto > ($this->monto_maximo_retiro ?? 0)) {
            return false;
        }

        return $this->getMontoDisponible() >= $monto;
    }

    /**
     * Actualizar saldo del fondo
     */
    public function actualizarSaldo(float $monto, string $tipo = 'entrada'): bool
    {
        $saldoAnterior = $this->saldo_actual;
        
        if ($tipo === 'entrada') {
            $this->saldo_actual += $monto;
        } else {
            $this->saldo_actual -= $monto;
        }

        $this->actualizado_por = auth()->user()->name ?? 'Sistema';
        $this->actualizado_el = now();

        return $this->save();
    }

    /**
     * Obtener el nombre completo del fondo
     */
    public function getNombreCompletoAttribute(): string
    {
        return "{$this->codigo} - {$this->nombre}";
    }

    /**
     * Obtener el estado formateado
     */
    public function getEstadoFormateadoAttribute(): string
    {
        return self::ESTADOS[$this->estatus] ?? $this->estatus;
    }

    /**
     * Obtener el tipo de fondo formateado
     */
    public function getTipoFormateadoAttribute(): string
    {
        return self::TIPOS_FONDO[$this->tipo_fondo] ?? $this->tipo_fondo;
    }

    /**
     * Boot del modelo
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($fondoCaja) {
            if (!$fondoCaja->agregado_por) {
                $fondoCaja->agregado_por = auth()->user()->name ?? 'Sistema';
            }
            if (!$fondoCaja->agregado_el) {
                $fondoCaja->agregado_el = now();
            }
        });

        static::updating(function ($fondoCaja) {
            $fondoCaja->actualizado_por = auth()->user()->name ?? 'Sistema';
            $fondoCaja->actualizado_el = now();
        });
    }
} 