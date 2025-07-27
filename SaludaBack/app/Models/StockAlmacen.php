<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class StockAlmacen extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'stock_almacen';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'producto_id',
        'almacen_id',
        'sucursal_id',
        'stock_actual',
        'stock_reservado',
        'stock_disponible',
        'stock_minimo',
        'stock_maximo',
        'stock_critico',
        'numero_lote',
        'fecha_fabricacion',
        'fecha_vencimiento',
        'lote_proveedor',
        'estante',
        'pasillo',
        'nivel',
        'posicion',
        'ubicacion_descripcion',
        'costo_unitario',
        'costo_total',
        'valor_mercado',
        'margen_ganancia',
        'estado',
        'activo',
        'observaciones',
        'alerta_stock_bajo',
        'alerta_vencimiento',
        'fecha_alerta_vencimiento',
        'creado_por',
        'actualizado_por',
        'ultimo_movimiento',
        'ultimo_movimiento_tipo',
        'Id_Licencia'
    ];

    protected $casts = [
        'stock_actual' => 'decimal:2',
        'stock_reservado' => 'decimal:2',
        'stock_disponible' => 'decimal:2',
        'stock_minimo' => 'decimal:2',
        'stock_maximo' => 'decimal:2',
        'stock_critico' => 'decimal:2',
        'costo_unitario' => 'decimal:2',
        'costo_total' => 'decimal:2',
        'valor_mercado' => 'decimal:2',
        'margen_ganancia' => 'decimal:2',
        'fecha_fabricacion' => 'date',
        'fecha_vencimiento' => 'date',
        'fecha_alerta_vencimiento' => 'datetime',
        'ultimo_movimiento' => 'datetime',
        'activo' => 'boolean',
        'alerta_stock_bajo' => 'boolean',
        'alerta_vencimiento' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    protected $dates = [
        'fecha_fabricacion',
        'fecha_vencimiento',
        'fecha_alerta_vencimiento',
        'ultimo_movimiento',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    // Relaciones
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id', 'id');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'almacen_id', 'id');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id', 'id');
    }

    public function creadoPor()
    {
        return $this->belongsTo(User::class, 'creado_por', 'id');
    }

    public function actualizadoPor()
    {
        return $this->belongsTo(User::class, 'actualizado_por', 'id');
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopePorProducto($query, $productoId)
    {
        return $query->where('producto_id', $productoId);
    }

    public function scopePorSucursal($query, $sucursalId)
    {
        return $query->where('sucursal_id', $sucursalId);
    }

    public function scopePorAlmacen($query, $almacenId)
    {
        return $query->where('almacen_id', $almacenId);
    }

    public function scopeConStockBajo($query)
    {
        return $query->where('stock_actual', '<=', DB::raw('stock_minimo'));
    }

    public function scopeSinStock($query)
    {
        return $query->where('stock_actual', 0);
    }

    public function scopePorVencer($query, $dias = 30)
    {
        $fechaLimite = now()->addDays($dias);
        return $query->where('fecha_vencimiento', '<=', $fechaLimite)
                    ->where('fecha_vencimiento', '>=', now());
    }

    public function scopeVencidos($query)
    {
        return $query->where('fecha_vencimiento', '<', now());
    }

    // Accessors
    public function getStockDisponibleCalculadoAttribute()
    {
        return $this->stock_actual - $this->stock_reservado;
    }

    public function getPorcentajeStockAttribute()
    {
        if ($this->stock_maximo > 0) {
            return round(($this->stock_actual / $this->stock_maximo) * 100, 2);
        }
        return 0;
    }

    public function getEstadoStockAttribute()
    {
        if ($this->stock_actual <= 0) {
            return 'sin_stock';
        } elseif ($this->stock_actual <= $this->stock_minimo) {
            return 'stock_bajo';
        } elseif ($this->stock_actual >= $this->stock_maximo * 0.8) {
            return 'stock_alto';
        } else {
            return 'normal';
        }
    }

    public function getColorEstadoAttribute()
    {
        switch ($this->estado_stock) {
            case 'sin_stock':
                return 'error';
            case 'stock_bajo':
                return 'warning';
            case 'stock_alto':
                return 'info';
            default:
                return 'success';
        }
    }

    public function getDiasParaVencimientoAttribute()
    {
        if (!$this->fecha_vencimiento) {
            return null;
        }
        return now()->diffInDays($this->fecha_vencimiento, false);
    }

    public function getRequiereAlertaVencimientoAttribute()
    {
        if (!$this->fecha_vencimiento) {
            return false;
        }
        $diasParaVencimiento = $this->dias_para_vencimiento;
        return $diasParaVencimiento !== null && $diasParaVencimiento <= 30 && $diasParaVencimiento >= 0;
    }

    // Mutadores
    public function setStockActualAttribute($value)
    {
        $this->attributes['stock_actual'] = $value;
        $this->attributes['stock_disponible'] = $value - $this->stock_reservado;
    }

    public function setStockReservadoAttribute($value)
    {
        $this->attributes['stock_reservado'] = $value;
        $this->attributes['stock_disponible'] = $this->stock_actual - $value;
    }

    public function setCostoUnitarioAttribute($value)
    {
        $this->attributes['costo_unitario'] = $value;
        $this->attributes['costo_total'] = $value * $this->stock_actual;
    }

    // Métodos
    public function actualizarStockDisponible()
    {
        $this->stock_disponible = $this->stock_actual - $this->stock_reservado;
        $this->save();
    }

    public function reservarStock($cantidad)
    {
        if ($this->stock_disponible >= $cantidad) {
            $this->stock_reservado += $cantidad;
            $this->stock_disponible -= $cantidad;
            $this->save();
            return true;
        }
        return false;
    }

    public function liberarStock($cantidad)
    {
        if ($this->stock_reservado >= $cantidad) {
            $this->stock_reservado -= $cantidad;
            $this->stock_disponible += $cantidad;
            $this->save();
            return true;
        }
        return false;
    }

    public function agregarStock($cantidad, $costoUnitario = null)
    {
        $this->stock_actual += $cantidad;
        $this->stock_disponible += $cantidad;
        
        if ($costoUnitario) {
            $this->costo_unitario = $costoUnitario;
        }
        
        $this->costo_total = $this->costo_unitario * $this->stock_actual;
        $this->ultimo_movimiento = now();
        $this->ultimo_movimiento_tipo = 'entrada';
        $this->save();
    }

    public function reducirStock($cantidad)
    {
        if ($this->stock_disponible >= $cantidad) {
            $this->stock_actual -= $cantidad;
            $this->stock_disponible -= $cantidad;
            $this->ultimo_movimiento = now();
            $this->ultimo_movimiento_tipo = 'salida';
            $this->save();
            return true;
        }
        return false;
    }

    public function verificarAlertas()
    {
        // Verificar stock bajo
        if ($this->stock_actual <= $this->stock_minimo) {
            $this->alerta_stock_bajo = true;
        } else {
            $this->alerta_stock_bajo = false;
        }

        // Verificar vencimiento
        if ($this->fecha_vencimiento && $this->dias_para_vencimiento <= 30 && $this->dias_para_vencimiento >= 0) {
            $this->alerta_vencimiento = true;
            $this->fecha_alerta_vencimiento = now();
        } else {
            $this->alerta_vencimiento = false;
            $this->fecha_alerta_vencimiento = null;
        }

        $this->save();
    }

    // Métodos estáticos
    public static function estadisticasPorSucursal($sucursalId = null)
    {
        $query = self::activos();
        
        if ($sucursalId) {
            $query->porSucursal($sucursalId);
        }

        return [
            'total_productos' => $query->count(),
            'total_stock' => $query->sum('stock_actual'),
            'total_valor' => $query->sum('valor_mercado'),
            'productos_sin_stock' => $query->sinStock()->count(),
            'productos_stock_bajo' => $query->conStockBajo()->count(),
            'productos_por_vencer' => $query->porVencer()->count(),
            'productos_vencidos' => $query->vencidos()->count()
        ];
    }
} 