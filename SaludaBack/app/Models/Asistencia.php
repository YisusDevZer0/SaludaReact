<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    /**
     * Especificar la conexión de base de datos para este modelo
     */
    protected $connection = 'mysql_second';

    /**
     * La tabla asociada al modelo
     */
    protected $table = 'asistenciaper';

    /**
     * La clave primaria
     */
    protected $primaryKey = 'Id_asis';

    /**
     * Los atributos que son asignables masivamente
     */
    protected $fillable = [
        'Id_asis',
        'Id_Pernl',
        'FechaAsis',
        'Nombre_dia',
        'HoIngreso',
        'HoSalida',
        'Tardanzas',
        'Justifacion',
        'tipoturno',
        'EstadoAsis',
        'totalhora_tr'
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos
     */
    protected $casts = [
        'Id_asis' => 'integer',
        'Id_Pernl' => 'integer',
        'FechaAsis' => 'date',
        'totalhora_tr' => 'decimal:2'
    ];

    /**
     * Relación con personal
     */
    public function personal()
    {
        return $this->belongsTo(Personal::class, 'Id_Pernl', 'Id_pernl');
    }

    /**
     * Scope para filtrar por fecha
     */
    public function scopePorFecha($query, $fecha)
    {
        return $query->where('FechaAsis', $fecha);
    }

    /**
     * Scope para filtrar por rango de fechas
     */
    public function scopePorRangoFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('FechaAsis', [$fechaInicio, $fechaFin]);
    }

    /**
     * Scope para filtrar por empleado
     */
    public function scopePorEmpleado($query, $idPersonal)
    {
        return $query->where('Id_Pernl', $idPersonal);
    }

    /**
     * Scope para filtrar por estado de asistencia
     */
    public function scopePorEstado($query, $estado)
    {
        return $query->where('EstadoAsis', $estado);
    }

    /**
     * Calcular horas trabajadas
     */
    public function getHorasTrabajadasAttribute()
    {
        if ($this->HoIngreso && $this->HoSalida) {
            $ingreso = \Carbon\Carbon::parse($this->HoIngreso);
            $salida = \Carbon\Carbon::parse($this->HoSalida);
            return $ingreso->diffInHours($salida, true);
        }
        return 0;
    }

    /**
     * Verificar si tiene tardanza
     */
    public function getTieneTardanzaAttribute()
    {
        return $this->Tardanzas > 0;
    }

    /**
     * Verificar si está justificado
     */
    public function getEstaJustificadoAttribute()
    {
        return $this->Justifacion === 'Sí';
    }
} 