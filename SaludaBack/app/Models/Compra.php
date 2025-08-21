<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Compra extends Model
{
    use HasFactory;

    protected $table = 'compras';

    protected $fillable = [
        'numero_compra',
        'sucursal_id',
        'personal_id',
        'proveedor_id',
        'tipo_compra',
        'estado',
        'tipo_documento',
        'numero_documento',
        'serie_documento',
        'fecha_documento',
        'subtotal',
        'descuento_total',
        'subtotal_con_descuento',
        'iva_total',
        'impuestos_adicionales',
        'total',
        'total_pagado',
        'saldo_pendiente',
        'metodo_pago',
        'dias_credito',
        'fecha_vencimiento_pago',
        'numero_cheque',
        'banco_cheque',
        'fecha_vencimiento_cheque',
        'banco_transferencia',
        'numero_transferencia',
        'tipo_entrega',
        'fecha_entrega_estimada',
        'fecha_entrega_real',
        'direccion_entrega',
        'instrucciones_entrega',
        'costo_envio',
        'descuento_porcentaje',
        'descuento_monto',
        'motivo_descuento',
        'autorizado_por',
        'fecha_recepcion',
        'recibido_por',
        'observaciones_recepcion',
        'conforme_entrega',
        'motivo_no_conforme',
        'fecha_devolucion',
        'devolucion_autorizada_por',
        'motivo_devolucion',
        'monto_devolucion',
        'observaciones',
        'notas_internas',
        'datos_adicionales',
        'creado_por',
        'actualizado_por',
        'fecha_confirmacion',
        'confirmado_por',
        'Id_Licencia'
    ];

    protected $casts = [
        'fecha_documento' => 'date',
        'fecha_entrega_estimada' => 'date',
        'fecha_entrega_real' => 'date',
        'fecha_vencimiento_pago' => 'date',
        'fecha_vencimiento_cheque' => 'date',
        'fecha_recepcion' => 'date',
        'fecha_devolucion' => 'date',
        'fecha_confirmacion' => 'date',
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'subtotal_con_descuento' => 'decimal:2',
        'iva_total' => 'decimal:2',
        'impuestos_adicionales' => 'decimal:2',
        'total_pagado' => 'decimal:2',
        'saldo_pendiente' => 'decimal:2',
        'descuento_total' => 'decimal:2',
        'descuento_porcentaje' => 'decimal:2',
        'descuento_monto' => 'decimal:2',
        'costo_envio' => 'decimal:2',
        'monto_devolucion' => 'decimal:2',
        'conforme_entrega' => 'boolean',
        'datos_adicionales' => 'array'
    ];

    /**
     * Relación con el proveedor
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    /**
     * Relación con el personal (comprador)
     */
    public function personal(): BelongsTo
    {
        return $this->belongsTo(Personal::class, 'personal_id');
    }

    /**
     * Relación con la sucursal
     */
    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    /**
     * Relación con los detalles de la compra
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleCompra::class, 'compra_id');
    }

    /**
     * Scope para compras pendientes
     */
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    /**
     * Scope para compras aprobadas
     */
    public function scopeAprobadas($query)
    {
        return $query->where('estado', 'aprobada');
    }

    /**
     * Scope para compras en proceso
     */
    public function scopeEnProceso($query)
    {
        return $query->where('estado', 'en_proceso');
    }

    /**
     * Scope para compras recibidas
     */
    public function scopeRecibidas($query)
    {
        return $query->where('estado', 'recibida');
    }

    /**
     * Scope para compras canceladas
     */
    public function scopeCanceladas($query)
    {
        return $query->where('estado', 'cancelada');
    }

    /**
     * Scope para compras urgentes
     */
    public function scopeUrgentes($query)
    {
        return $query->where('es_urgente', true);
    }

    /**
     * Scope para compras por rango de fechas
     */
    public function scopePorRango($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_documento', [$fechaInicio, $fechaFin]);
    }

    /**
     * Scope para compras por proveedor
     */
    public function scopePorProveedor($query, $proveedorId)
    {
        return $query->where('proveedor_id', $proveedorId);
    }

    /**
     * Scope para compras por personal
     */
    public function scopePorPersonal($query, $personalId)
    {
        return $query->where('personal_id', $personalId);
    }

    /**
     * Scope para compras por sucursal
     */
    public function scopePorSucursal($query, $sucursalId)
    {
        return $query->where('sucursal_id', $sucursalId);
    }

    /**
     * Obtener el estado formateado
     */
    public function getEstadoFormateadoAttribute(): string
    {
        $estados = [
            'pendiente' => 'Pendiente',
            'aprobada' => 'Aprobada',
            'en_proceso' => 'En Proceso',
            'recibida' => 'Recibida',
            'cancelada' => 'Cancelada',
            'devuelta' => 'Devuelta'
        ];

        return $estados[$this->estado] ?? $this->estado;
    }

    /**
     * Obtener el método de pago formateado
     */
    public function getMetodoPagoFormateadoAttribute(): string
    {
        $metodos = [
            'efectivo' => 'Efectivo',
            'transferencia' => 'Transferencia',
            'cheque' => 'Cheque',
            'credito' => 'Crédito'
        ];

        return $metodos[$this->metodo_pago] ?? $this->metodo_pago;
    }

    /**
     * Verificar si la compra está vencida
     */
    public function getEstaVencidaAttribute(): bool
    {
        return $this->fecha_entrega_estimada && 
               $this->fecha_entrega_estimada->isPast() && 
               $this->estado !== 'recibida' && 
               $this->estado !== 'cancelada';
    }

    /**
     * Verificar si la compra está por vencer
     */
    public function getEstaPorVencerAttribute(): bool
    {
        return $this->fecha_entrega_estimada && 
               $this->fecha_entrega_estimada->diffInDays(now()) <= 3 && 
               $this->estado !== 'recibida' && 
               $this->estado !== 'cancelada';
    }

    /**
     * Calcular el total de la compra
     */
    public function calcularTotal(): float
    {
        $subtotal = $this->detalles->sum(function ($detalle) {
            return $detalle->cantidad * $detalle->precio_unitario;
        });

        $impuestos = $this->iva_total + $this->impuestos_adicionales;
        $descuentos = $this->descuento_total;

        return $subtotal + $impuestos - $descuentos;
    }
}
