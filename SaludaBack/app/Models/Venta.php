<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas';

    protected $fillable = [
        'cliente_id',
        'personal_id',
        'sucursal_id',
        'numero_venta',
        'numero_documento',
        'serie_documento',
        'tipo_venta',
        'estado',
        'tipo_documento',
        'subtotal',
        'descuento_total',
        'subtotal_con_descuento',
        'iva_total',
        'impuestos_adicionales',
        'total',
        'total_pagado',
        'saldo_pendiente',
        'metodo_pago',
        'observaciones',
        'notas_internas',
        'creado_por',
        'actualizado_por',
        'Id_Licencia'
    ];

    protected $casts = [
        'fecha_entrega' => 'datetime',
        'fecha_vencimiento_cheque' => 'date',
        'fecha_receta' => 'date',
        'fecha_vencimiento_receta' => 'date',
        'fecha_devolucion' => 'datetime',
        'fecha_confirmacion' => 'datetime',
        'subtotal' => 'decimal:2',
        'descuento_total' => 'decimal:2',
        'subtotal_con_descuento' => 'decimal:2',
        'iva_total' => 'decimal:2',
        'impuestos_adicionales' => 'decimal:2',
        'total' => 'decimal:2',
        'total_pagado' => 'decimal:2',
        'saldo_pendiente' => 'decimal:2',
        'costo_envio' => 'decimal:2',
        'descuento_porcentaje' => 'decimal:2',
        'descuento_monto' => 'decimal:2',
        'monto_devolucion' => 'decimal:2'
    ];

    /**
     * Relación con el cliente
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    /**
     * Relación con el personal (vendedor)
     */
    public function personal(): BelongsTo
    {
        return $this->belongsTo(PersonalPos::class, 'personal_id');
    }

    /**
     * Alias para compatibilidad
     */
    public function vendedor(): BelongsTo
    {
        return $this->personal();
    }

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
     * Relación con los detalles de venta
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleVenta::class, 'venta_id');
    }

    /**
     * Scope para ventas por estado
     */
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para ventas por tipo de pago
     */
    public function scopePorTipoPago($query, $tipoPago)
    {
        return $query->where('tipo_pago', $tipoPago);
    }

    /**
     * Scope para ventas por rango de fechas
     */
    public function scopePorRango($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_venta', [$fechaInicio, $fechaFin]);
    }

    /**
     * Scope para ventas por cliente
     */
    public function scopePorCliente($query, $clienteId)
    {
        return $query->where('cliente_id', $clienteId);
    }

    /**
     * Scope para ventas por vendedor
     */
    public function scopePorVendedor($query, $vendedorId)
    {
        return $query->where('vendedor_id', $vendedorId);
    }

    /**
     * Scope para ventas por sucursal
     */
    public function scopePorSucursal($query, $sucursalId)
    {
        return $query->where('sucursal_id', $sucursalId);
    }

    /**
     * Scope para ventas de hoy
     */
    public function scopeHoy($query)
    {
        return $query->whereDate('fecha_venta', Carbon::today());
    }

    /**
     * Scope para ventas de este mes
     */
    public function scopeEsteMes($query)
    {
        return $query->whereMonth('fecha_venta', Carbon::now()->month)
                    ->whereYear('fecha_venta', Carbon::now()->year);
    }

    /**
     * Scope para ventas de este año
     */
    public function scopeEsteAno($query)
    {
        return $query->whereYear('fecha_venta', Carbon::now()->year);
    }

    /**
     * Obtener el estado formateado
     */
    public function getEstadoFormateadoAttribute(): string
    {
        $estados = [
            'pendiente' => 'Pendiente',
            'confirmada' => 'Confirmada',
            'anulada' => 'Anulada',
            'devuelta' => 'Devuelta'
        ];

        return $estados[$this->estado] ?? ucfirst($this->estado);
    }

    /**
     * Obtener el tipo de pago formateado
     */
    public function getTipoPagoFormateadoAttribute(): string
    {
        $tipos = [
            'efectivo' => 'Efectivo',
            'tarjeta' => 'Tarjeta',
            'transferencia' => 'Transferencia',
            'cheque' => 'Cheque',
            'otro' => 'Otro'
        ];

        return $tipos[$this->tipo_pago] ?? ucfirst($this->tipo_pago);
    }

    /**
     * Obtener el tipo de venta formateado
     */
    public function getTipoVentaFormateadoAttribute(): string
    {
        $tipos = [
            'contado' => 'Contado',
            'credito' => 'Crédito',
            'consignacion' => 'Consignación'
        ];

        return $tipos[$this->tipo_venta] ?? ucfirst($this->tipo_venta);
    }

    /**
     * Verificar si la venta está vencida
     */
    public function getEstaVencidaAttribute(): bool
    {
        return $this->fecha_vencimiento && $this->fecha_vencimiento->isPast() && $this->saldo_pendiente > 0;
    }

    /**
     * Verificar si la venta está por vencer
     */
    public function getEstaPorVencerAttribute(): bool
    {
        return $this->fecha_vencimiento && $this->fecha_vencimiento->diffInDays(now()) <= 3 && $this->saldo_pendiente > 0;
    }

    /**
     * Calcular el total de la venta
     */
    public function calcularTotal(): float
    {
        $subtotal = $this->detalles->sum(function ($detalle) {
            return $detalle->cantidad * $detalle->precio_unitario;
        });
        
        $impuestos = $this->impuesto_iva + $this->impuesto_otros;
        $descuentos = $this->descuento;
        
        return $subtotal + $impuestos - $descuentos;
    }

    /**
     * Obtener estadísticas de ventas
     */
    public static function getEstadisticas()
    {
        return [
            'total_ventas' => self::count(),
            'ventas_hoy' => self::hoy()->count(),
            'ventas_mes' => self::esteMes()->count(),
            'ventas_ano' => self::esteAno()->count(),
            'total_ingresos' => self::sum('total'),
            'ingresos_hoy' => self::hoy()->sum('total'),
            'ingresos_mes' => self::esteMes()->sum('total'),
            'ingresos_ano' => self::esteAno()->sum('total'),
            'ventas_pendientes' => self::porEstado('pendiente')->count(),
            'ventas_confirmadas' => self::porEstado('confirmada')->count(),
            'ventas_anuladas' => self::porEstado('anulada')->count(),
            'promedio_venta' => self::avg('total'),
            'venta_maxima' => self::max('total'),
            'venta_minima' => self::min('total')
        ];
    }
}
