<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Gasto extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'gastos';

    protected $fillable = [
        'numero_factura',
        'concepto',
        'descripcion',
        'categoria',
        'metodo_pago',
        'sucursal_id',
        'caja_id',
        'usuario_solicitante_id',
        'usuario_aprobador_id',
        'proveedor_id',
        'fecha_gasto',
        'fecha_vencimiento',
        'monto',
        'estado',
        'observaciones',
        'archivo_adjunto',
        'recurrente',
        'frecuencia',
        'creado_por',
        'actualizado_por'
    ];

    protected $hidden = [
        'deleted_at'
    ];

    protected $casts = [
        'fecha_gasto' => 'date',
        'fecha_vencimiento' => 'date',
        'monto' => 'decimal:2',
        'recurrente' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    protected $dates = [
        'fecha_gasto',
        'fecha_vencimiento',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    // Categorías disponibles
    const CATEGORIAS = [
        'servicios_publicos' => 'Servicios Públicos',
        'alquiler' => 'Alquiler',
        'salarios' => 'Salarios',
        'insumos' => 'Insumos',
        'mantenimiento' => 'Mantenimiento',
        'marketing' => 'Marketing',
        'seguros' => 'Seguros',
        'impuestos' => 'Impuestos',
        'equipamiento' => 'Equipamiento',
        'software' => 'Software',
        'otros' => 'Otros'
    ];

    // Estados disponibles
    const ESTADOS = [
        'pendiente' => 'Pendiente',
        'aprobado' => 'Aprobado',
        'rechazado' => 'Rechazado',
        'pagado' => 'Pagado',
        'anulado' => 'Anulado'
    ];

    // Métodos de pago disponibles
    const METODOS_PAGO = [
        'efectivo' => 'Efectivo',
        'tarjeta' => 'Tarjeta',
        'transferencia' => 'Transferencia',
        'cheque' => 'Cheque'
    ];

    // Frecuencias disponibles
    const FRECUENCIAS = [
        'mensual' => 'Mensual',
        'trimestral' => 'Trimestral',
        'semestral' => 'Semestral',
        'anual' => 'Anual'
    ];

    /**
     * Relación con la sucursal
     */
    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    /**
     * Relación con la caja
     */
    public function caja(): BelongsTo
    {
        return $this->belongsTo(Caja::class, 'caja_id');
    }

    /**
     * Relación con el usuario solicitante
     */
    public function usuarioSolicitante(): BelongsTo
    {
        return $this->belongsTo(PersonalPos::class, 'usuario_solicitante_id');
    }

    /**
     * Relación con el usuario aprobador
     */
    public function usuarioAprobador(): BelongsTo
    {
        return $this->belongsTo(PersonalPos::class, 'usuario_aprobador_id');
    }

    /**
     * Relación con el proveedor
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    /**
     * Relación con movimientos de caja
     */
    public function movimientosCaja(): HasMany
    {
        return $this->hasMany(MovimientoCaja::class, 'gasto_id');
    }

    /**
     * Scope para gastos por estado
     */
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para gastos por categoría
     */
    public function scopePorCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    /**
     * Scope para gastos por sucursal
     */
    public function scopePorSucursal($query, $sucursalId)
    {
        return $query->where('sucursal_id', $sucursalId);
    }

    /**
     * Scope para gastos por caja
     */
    public function scopePorCaja($query, $cajaId)
    {
        return $query->where('caja_id', $cajaId);
    }

    /**
     * Scope para gastos pendientes
     */
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    /**
     * Scope para gastos pagados
     */
    public function scopePagados($query)
    {
        return $query->where('estado', 'pagado');
    }

    /**
     * Scope para gastos recurrentes
     */
    public function scopeRecurrentes($query)
    {
        return $query->where('recurrente', true);
    }

    /**
     * Scope para gastos por rango de fechas
     */
    public function scopePorRangoFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_gasto', [$fechaInicio, $fechaFin]);
    }

    /**
     * Scope para gastos vencidos
     */
    public function scopeVencidos($query)
    {
        return $query->where('fecha_vencimiento', '<', now())
                    ->where('estado', '!=', 'pagado');
    }

    /**
     * Scope para gastos por vencer
     */
    public function scopePorVencer($query, $dias = 7)
    {
        return $query->where('fecha_vencimiento', '<=', now()->addDays($dias))
                    ->where('fecha_vencimiento', '>', now())
                    ->where('estado', '!=', 'pagado');
    }

    /**
     * Verificar si el gasto está pendiente
     */
    public function estaPendiente(): bool
    {
        return $this->estado === 'pendiente';
    }

    /**
     * Verificar si el gasto está pagado
     */
    public function estaPagado(): bool
    {
        return $this->estado === 'pagado';
    }

    /**
     * Verificar si el gasto está vencido
     */
    public function estaVencido(): bool
    {
        return $this->fecha_vencimiento && 
               $this->fecha_vencimiento < now() && 
               $this->estado !== 'pagado';
    }

    /**
     * Verificar si el gasto está por vencer
     */
    public function estaPorVencer(int $dias = 7): bool
    {
        return $this->fecha_vencimiento && 
               $this->fecha_vencimiento <= now()->addDays($dias) &&
               $this->fecha_vencimiento > now() &&
               $this->estado !== 'pagado';
    }

    /**
     * Obtener el estado formateado
     */
    public function getEstadoFormateadoAttribute(): string
    {
        return self::ESTADOS[$this->estado] ?? $this->estado;
    }

    /**
     * Obtener la categoría formateada
     */
    public function getCategoriaFormateadaAttribute(): string
    {
        return self::CATEGORIAS[$this->categoria] ?? $this->categoria;
    }

    /**
     * Obtener el método de pago formateado
     */
    public function getMetodoPagoFormateadoAttribute(): string
    {
        return self::METODOS_PAGO[$this->metodo_pago] ?? $this->metodo_pago;
    }

    /**
     * Obtener la frecuencia formateada
     */
    public function getFrecuenciaFormateadaAttribute(): string
    {
        return self::FRECUENCIAS[$this->frecuencia] ?? $this->frecuencia;
    }

    /**
     * Obtener el número de días hasta el vencimiento
     */
    public function getDiasHastaVencimientoAttribute(): ?int
    {
        if (!$this->fecha_vencimiento) {
            return null;
        }
        
        return now()->diffInDays($this->fecha_vencimiento, false);
    }

    /**
     * Marcar como pagado
     */
    public function marcarComoPagado(): bool
    {
        $this->estado = 'pagado';
        $this->actualizado_por = auth()->user()->name ?? 'Sistema';
        return $this->save();
    }

    /**
     * Marcar como aprobado
     */
    public function marcarComoAprobado(int $usuarioAprobadorId): bool
    {
        $this->estado = 'aprobado';
        $this->usuario_aprobador_id = $usuarioAprobadorId;
        $this->actualizado_por = auth()->user()->name ?? 'Sistema';
        return $this->save();
    }

    /**
     * Marcar como rechazado
     */
    public function marcarComoRechazado(): bool
    {
        $this->estado = 'rechazado';
        $this->actualizado_por = auth()->user()->name ?? 'Sistema';
        return $this->save();
    }

    /**
     * Generar número de factura automático
     */
    public static function generarNumeroFactura(): string
    {
        $ultimoGasto = self::orderBy('id', 'desc')->first();
        $numero = $ultimoGasto ? $ultimoGasto->id + 1 : 1;
        return 'GASTO-' . str_pad($numero, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Boot del modelo
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($gasto) {
            if (!$gasto->numero_factura) {
                $gasto->numero_factura = self::generarNumeroFactura();
            }
            if (!$gasto->creado_por) {
                $gasto->creado_por = auth()->user()->name ?? 'Sistema';
            }
        });

        static::updating(function ($gasto) {
            $gasto->actualizado_por = auth()->user()->name ?? 'Sistema';
        });
    }
}
