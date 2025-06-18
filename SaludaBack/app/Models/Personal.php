<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personal extends Model
{
    /**
     * Especificar la conexión de base de datos para este modelo
     */
    protected $connection = 'mysql_second';

    /**
     * La tabla asociada al modelo
     */
    protected $table = 'personal';

    /**
     * La clave primaria
     */
    protected $primaryKey = 'Id_pernl';

    /**
     * Los atributos que son asignables masivamente
     */
    protected $fillable = [
        'Id_pernl',
        'Cedula',
        'Nombre_Completo',
        'Sexo',
        'Cargo_rol',
        'Domicilio'
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos
     */
    protected $casts = [
        'Id_pernl' => 'integer',
    ];

    /**
     * Relación con asistencia
     */
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class, 'Id_Pernl', 'Id_pernl');
    }

    /**
     * Obtener asistencia del día actual
     */
    public function asistenciaHoy()
    {
        return $this->hasOne(Asistencia::class, 'Id_Pernl', 'Id_pernl')
            ->where('FechaAsis', date('Y-m-d'));
    }

    /**
     * Obtener asistencia por rango de fechas
     */
    public function asistenciaPorRango($fechaInicio, $fechaFin)
    {
        return $this->hasMany(Asistencia::class, 'Id_Pernl', 'Id_pernl')
            ->whereBetween('FechaAsis', [$fechaInicio, $fechaFin])
            ->orderBy('FechaAsis', 'desc');
    }
} 