<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Producto extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'productos';

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'codigo_barras',
        'codigo_interno',
        'categoria_id',
        'marca_id',
        'presentacion_id',
        'componente_activo_id',
        'precio_venta',
        'precio_compra',
        'precio_por_mayor',
        'costo_unitario',
        'margen_ganancia',
        'iva',
        'exento_iva',
        'impuestos_adicionales',
        'inventariable',
        'stock_minimo',
        'stock_maximo',
        'stock_actual',
        'unidad_medida',
        'peso',
        'volumen',
        'ubicacion_almacen',
        'alto',
        'ancho',
        'largo',
        'color',
        'material',
        'proveedor_id',
        'codigo_proveedor',
        'tiempo_entrega_dias',
        'precio_proveedor',
        'almacen_id',
        'estado',
        'visible_en_pos',
        'permitir_venta_sin_stock',
        'requiere_receta',
        'controlado_por_lote',
        'controlado_por_fecha_vencimiento',
        'fecha_vencimiento',
        'fecha_fabricacion',
        'vida_util_dias',
        'caracteristicas',
        'etiquetas',
        'notas',
        'imagen_url',
        'documentacion_url',
        'creado_por',
        'actualizado_por',
    ];

    protected $casts = [
        'precio_venta' => 'decimal:2',
        'precio_compra' => 'decimal:2',
        'precio_por_mayor' => 'decimal:2',
        'costo_unitario' => 'decimal:2',
        'margen_ganancia' => 'decimal:2',
        'iva' => 'decimal:2',
        'exento_iva' => 'boolean',
        'impuestos_adicionales' => 'decimal:2',
        'inventariable' => 'boolean',
        'stock_minimo' => 'integer',
        'stock_maximo' => 'integer',
        'stock_actual' => 'integer',
        'peso' => 'decimal:3',
        'volumen' => 'decimal:3',
        'alto' => 'decimal:2',
        'ancho' => 'decimal:2',
        'largo' => 'decimal:2',
        'tiempo_entrega_dias' => 'integer',
        'precio_proveedor' => 'decimal:2',
        'visible_en_pos' => 'boolean',
        'permitir_venta_sin_stock' => 'boolean',
        'requiere_receta' => 'boolean',
        'controlado_por_lote' => 'boolean',
        'controlado_por_fecha_vencimiento' => 'boolean',
        'fecha_vencimiento' => 'date',
        'fecha_fabricacion' => 'date',
        'vida_util_dias' => 'integer',
        'caracteristicas' => 'array',
        'etiquetas' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $dates = [
        'fecha_vencimiento',
        'fecha_fabricacion',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // Relaciones
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaPos::class, 'categoria_id');
    }

    public function marca(): BelongsTo
    {
        return $this->belongsTo(Marca::class, 'marca_id', 'Marca_ID');
    }

    public function presentacion(): BelongsTo
    {
        return $this->belongsTo(Presentacion::class, 'presentacion_id');
    }

    public function componenteActivo(): BelongsTo
    {
        return $this->belongsTo(ComponenteActivo::class, 'componente_activo_id');
    }

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    public function almacen(): BelongsTo
    {
        return $this->belongsTo(Almacen::class, 'almacen_id', 'Almacen_ID');
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    public function scopeInactivos($query)
    {
        return $query->where('estado', 'inactivo');
    }

    public function scopeDescontinuados($query)
    {
        return $query->where('estado', 'descontinuado');
    }

    public function scopeAgotados($query)
    {
        return $query->where('estado', 'agotado');
    }

    public function scopeConStockBajo($query)
    {
        return $query->whereRaw('stock_actual <= stock_minimo');
    }

    public function scopeSinStock($query)
    {
        return $query->where('stock_actual', 0);
    }

    public function scopePorCategoria($query, $categoriaId)
    {
        return $query->where('categoria_id', $categoriaId);
    }

    public function scopePorMarca($query, $marcaId)
    {
        return $query->where('marca_id', $marcaId);
    }

    public function scopePorProveedor($query, $proveedorId)
    {
        return $query->where('proveedor_id', $proveedorId);
    }

    public function scopePorAlmacen($query, $almacenId)
    {
        return $query->where('almacen_id', $almacenId);
    }

    public function scopeInventariables($query)
    {
        return $query->where('inventariable', true);
    }

    public function scopeVisiblesEnPos($query)
    {
        return $query->where('visible_en_pos', true);
    }

    public function scopePorVencer($query, $dias = 30)
    {
        return $query->where('fecha_vencimiento', '<=', now()->addDays($dias))
                    ->where('fecha_vencimiento', '>', now());
    }

    public function scopeVencidos($query)
    {
        return $query->where('fecha_vencimiento', '<', now());
    }

    public function scopeBuscar($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('codigo', 'LIKE', "%{$search}%")
              ->orWhere('nombre', 'LIKE', "%{$search}%")
              ->orWhere('descripcion', 'LIKE', "%{$search}%")
              ->orWhere('codigo_barras', 'LIKE', "%{$search}%")
              ->orWhere('codigo_interno', 'LIKE', "%{$search}%");
        });
    }

    // Accessors
    public function getStockDisponibleAttribute()
    {
        return $this->stock_actual;
    }

    public function getStockBajoAttribute()
    {
        return $this->stock_actual <= $this->stock_minimo;
    }

    public function getSinStockAttribute()
    {
        return $this->stock_actual == 0;
    }

    public function getValorInventarioAttribute()
    {
        return $this->stock_actual * $this->precio_compra;
    }

    public function getValorVentaAttribute()
    {
        return $this->stock_actual * $this->precio_venta;
    }

    public function getMargenGananciaCalculadoAttribute()
    {
        if ($this->precio_compra > 0) {
            return (($this->precio_venta - $this->precio_compra) / $this->precio_compra) * 100;
        }
        return 0;
    }

    public function getPorVencerAttribute()
    {
        if (!$this->fecha_vencimiento) {
            return false;
        }
        return $this->fecha_vencimiento->diffInDays(now()) <= 30;
    }

    public function getVencidoAttribute()
    {
        if (!$this->fecha_vencimiento) {
            return false;
        }
        return $this->fecha_vencimiento < now();
    }

    // Mutadores
    public function setCaracteristicasAttribute($value)
    {
        $this->attributes['caracteristicas'] = is_array($value) ? json_encode($value) : $value;
    }

    public function setEtiquetasAttribute($value)
    {
        $this->attributes['etiquetas'] = is_array($value) ? json_encode($value) : $value;
    }

    // Métodos de utilidad
    public function actualizarStock($cantidad, $tipo = 'suma')
    {
        if ($tipo === 'suma') {
            $this->stock_actual += $cantidad;
        } else {
            $this->stock_actual -= $cantidad;
        }
        
        if ($this->stock_actual < 0) {
            $this->stock_actual = 0;
        }
        
        $this->save();
    }

    public function tieneStockSuficiente($cantidad)
    {
        return $this->stock_actual >= $cantidad;
    }

    public function puedeVenderseSinStock()
    {
        return $this->permitir_venta_sin_stock;
    }

    public function requiereReceta()
    {
        return $this->requiere_receta;
    }

    public function esControladoPorLote()
    {
        return $this->controlado_por_lote;
    }

    public function esControladoPorFechaVencimiento()
    {
        return $this->controlado_por_fecha_vencimiento;
    }
} 