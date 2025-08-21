<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleVenta extends Model
{
    use HasFactory;

    protected $table = 'detalles_venta';

    protected $fillable = [
        'venta_id',
        'producto_id',
        'inventario_id',
        'codigo_producto',
        'nombre_producto',
        'descripcion_producto',
        'codigo_barras',
        'numero_lote',
        'fecha_vencimiento',
        'lote_proveedor',
        'cantidad',
        'precio_unitario',
        'precio_total',
        'costo_unitario',
        'costo_total',
        'descuento_porcentaje',
        'descuento_monto',
        'subtotal_con_descuento',
        'motivo_descuento',
        'iva_porcentaje',
        'iva_monto',
        'impuestos_adicionales',
        'total_linea',
        'estado',
        'observaciones'
    ];

    protected $casts = [
        'fecha_vencimiento' => 'date',
        'fecha_receta' => 'date',
        'fecha_vencimiento_receta' => 'date',
        'fecha_devolucion' => 'datetime',
        'cantidad' => 'integer',
        'precio_unitario' => 'decimal:2',
        'precio_total' => 'decimal:2',
        'costo_unitario' => 'decimal:2',
        'costo_total' => 'decimal:2',
        'descuento_porcentaje' => 'decimal:2',
        'descuento_monto' => 'decimal:2',
        'subtotal_con_descuento' => 'decimal:2',
        'iva_porcentaje' => 'decimal:2',
        'iva_monto' => 'decimal:2',
        'impuestos_adicionales' => 'decimal:2',
        'total_linea' => 'decimal:2',
        'monto_devuelto' => 'decimal:2',
        'requiere_receta' => 'boolean',
        'receta_validada' => 'boolean'
    ];

    /**
     * Relación con la venta
     */
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'venta_id');
    }

    /**
     * Relación con el producto
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    /**
     * Calcular subtotal
     */
    public function calcularSubtotal(): float
    {
        return $this->cantidad * $this->precio_unitario;
    }

    /**
     * Calcular total
     */
    public function calcularTotal(): float
    {
        $subtotal = $this->calcularSubtotal();
        $impuestos = $this->impuesto_iva + $this->impuesto_otros;
        $descuentos = $this->descuento;
        
        return $subtotal + $impuestos - $descuentos;
    }
}
