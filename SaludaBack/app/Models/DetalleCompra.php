<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleCompra extends Model
{
    use HasFactory;

    protected $table = 'detalles_compra';

    protected $fillable = [
        'compra_id',
        'producto_id',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'impuestos',
        'descuentos',
        'total',
        'observaciones',
        'especificaciones',
        'codigo_producto_proveedor',
        'nombre_producto_proveedor'
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'impuestos' => 'decimal:2',
        'descuentos' => 'decimal:2',
        'total' => 'decimal:2'
    ];

    /**
     * Relación con la compra
     */
    public function compra(): BelongsTo
    {
        return $this->belongsTo(Compra::class, 'compra_id');
    }

    /**
     * Relación con el producto
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    /**
     * Calcular el subtotal del detalle
     */
    public function calcularSubtotal(): float
    {
        return $this->cantidad * $this->precio_unitario;
    }

    /**
     * Calcular el total del detalle
     */
    public function calcularTotal(): float
    {
        $subtotal = $this->calcularSubtotal();
        $impuestos = ($subtotal * $this->impuestos) / 100;
        $descuentos = ($subtotal * $this->descuentos) / 100;

        return $subtotal + $impuestos - $descuentos;
    }
}
