<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Caja extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'cajas';

    protected $fillable = [
        'nombre',
        'descripcion',
        'saldo_inicial',
        'saldo_actual',
        'estado',
        'sucursal_id',
        'usuario_apertura_id',
        'usuario_cierre_id',
        'fecha_apertura',
        'fecha_cierre',
        'observaciones_apertura',
        'observaciones_cierre',
        'diferencia',
        'activa',
    ];

    protected $hidden = [
        'deleted_at'
    ];

    protected $casts = [
        'saldo_inicial' => 'decimal:2',
        'saldo_actual' => 'decimal:2',
        'diferencia' => 'decimal:2',
        'activa' => 'boolean',
        'fecha_apertura' => 'datetime',
        'fecha_cierre' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    protected $dates = [
        'fecha_apertura',
        'fecha_cierre',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    // Estados disponibles
    const ESTADOS = [
        'abierta' => 'Abierta',
        'cerrada' => 'Cerrada',
        'en_uso' => 'En Uso'
    ];

    /**
     * Relación con la sucursal
     */
    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    /**
     * Relación con el usuario de apertura
     */
    public function usuarioApertura(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_apertura_id');
    }

    /**
     * Relación con el usuario de cierre
     */
    public function usuarioCierre(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_cierre_id');
    }

    /**
     * Relación con fondos de caja
     */
    public function fondos(): HasMany
    {
        return $this->hasMany(FondoCaja::class, 'caja_id');
    }

    /**
     * Relación con movimientos de caja
     */
    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoCaja::class, 'caja_id');
    }

    /**
     * Relación con cierres de caja
     */
    public function cierres(): HasMany
    {
        return $this->hasMany(CierreCaja::class, 'caja_id');
    }

    /**
     * Scope para cajas activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activa', true);
    }

    /**
     * Scope para cajas por estado
     */
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para cajas por sucursal
     */
    public function scopePorSucursal($query, $sucursalId)
    {
        return $query->where('sucursal_id', $sucursalId);
    }

    /**
     * Verificar si la caja está abierta
     */
    public function estaAbierta(): bool
    {
        return $this->estado === 'abierta';
    }

    /**
     * Verificar si la caja está cerrada
     */
    public function estaCerrada(): bool
    {
        return $this->estado === 'cerrada';
    }

    /**
     * Verificar si la caja está en uso
     */
    public function estaEnUso(): bool
    {
        return $this->estado === 'en_uso';
    }

    /**
     * Obtener el estado formateado
     */
    public function getEstadoFormateadoAttribute(): string
    {
        return self::ESTADOS[$this->estado] ?? $this->estado;
    }

    /**
     * Calcular el saldo disponible
     */
    public function getSaldoDisponible(): float
    {
        return $this->saldo_actual;
    }

    /**
     * Boot del modelo
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($caja) {
            if (!$caja->saldo_actual) {
                $caja->saldo_actual = $caja->saldo_inicial;
            }
        });
    }
} 