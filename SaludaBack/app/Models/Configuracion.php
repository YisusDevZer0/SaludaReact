<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    use HasFactory;

    protected $table = 'configuraciones';

    protected $fillable = [
        'clave',
        'valor',
        'descripcion',
        'tipo',
        'categoria',
        'activo'
    ];

    protected $casts = [
        'activo' => 'boolean',
        'valor' => 'string'
    ];

    /**
     * Scope para configuraciones activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para configuraciones por categoría
     */
    public function scopePorCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    /**
     * Obtener valor de configuración con cache
     */
    public static function getValor($clave, $default = null)
    {
        $config = static::where('clave', $clave)->where('activo', true)->first();
        
        if (!$config) {
            return $default;
        }

        return $config->valor;
    }

    /**
     * Establecer valor de configuración
     */
    public static function setValor($clave, $valor, $descripcion = null, $tipo = 'string', $categoria = 'general')
    {
        $config = static::where('clave', $clave)->first();
        
        if ($config) {
            $config->update([
                'valor' => $valor,
                'descripcion' => $descripcion,
                'tipo' => $tipo,
                'categoria' => $categoria
            ]);
        } else {
            static::create([
                'clave' => $clave,
                'valor' => $valor,
                'descripcion' => $descripcion,
                'tipo' => $tipo,
                'categoria' => $categoria,
                'activo' => true
            ]);
        }

        // Limpiar cache
        \Cache::forget('configuracion.' . $clave);
        
        return true;
    }

    /**
     * Obtener todas las configuraciones como array asociativo
     */
    public static function getAllAsArray()
    {
        return static::activas()->pluck('valor', 'clave')->toArray();
    }

    /**
     * Obtener configuraciones por categoría como array
     */
    public static function getByCategoryAsArray($categoria)
    {
        return static::activas()
            ->porCategoria($categoria)
            ->pluck('valor', 'clave')
            ->toArray();
    }
}
