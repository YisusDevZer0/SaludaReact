<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Agenda extends Model
{
    use HasFactory;

    /**
     * La tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'agendas';

    /**
     * La clave primaria del modelo.
     *
     * @var string
     */
    protected $primaryKey = 'Agenda_ID';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array
     */
    protected $fillable = [
        'Titulo_Cita',
        'Descripcion',
        'Fecha_Cita',
        'Hora_Inicio',
        'Hora_Fin',
        'Estado_Cita',
        'Tipo_Cita',
        'Consultorio',
        'Costo',
        'Notas_Adicionales',
        'Fk_Paciente',
        'Fk_Doctor',
        'Fk_Sucursal',
        'ID_H_O_D',
        'Agregado_Por',
        'Modificado_Por'
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'Fecha_Cita' => 'date',
        'Hora_Inicio' => 'datetime:H:i',
        'Hora_Fin' => 'datetime:H:i',
        'Costo' => 'decimal:2',
        'Agregado_El' => 'datetime',
        'Modificado_El' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con el paciente
     */
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'Fk_Paciente', 'Paciente_ID');
    }

    /**
     * Relación con el doctor
     */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'Fk_Doctor', 'Doctor_ID');
    }

    /**
     * Relación con la sucursal
     */
    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'Fk_Sucursal', 'id');
    }

    /**
     * Scope para filtrar por fecha
     */
    public function scopePorFecha($query, $fecha)
    {
        return $query->where('Fecha_Cita', $fecha);
    }

    /**
     * Scope para filtrar por rango de fechas
     */
    public function scopePorRangoFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('Fecha_Cita', [$fechaInicio, $fechaFin]);
    }

    /**
     * Scope para filtrar por doctor
     */
    public function scopePorDoctor($query, $doctorId)
    {
        return $query->where('Fk_Doctor', $doctorId);
    }

    /**
     * Scope para filtrar por paciente
     */
    public function scopePorPaciente($query, $pacienteId)
    {
        return $query->where('Fk_Paciente', $pacienteId);
    }

    /**
     * Scope para filtrar por estado
     */
    public function scopePorEstado($query, $estado)
    {
        return $query->where('Estado_Cita', $estado);
    }

    /**
     * Scope para filtrar por organización
     */
    public function scopePorOrganizacion($query, $idHod)
    {
        return $query->where('ID_H_O_D', $idHod);
    }

    /**
     * Scope para citas de hoy
     */
    public function scopeHoy($query)
    {
        return $query->where('Fecha_Cita', now()->toDateString());
    }

    /**
     * Scope para citas pendientes
     */
    public function scopePendientes($query)
    {
        return $query->whereIn('Estado_Cita', ['Pendiente', 'Confirmada']);
    }

    /**
     * Obtener citas por doctor y fecha
     */
    public static function obtenerCitasPorDoctorYFecha($doctorId, $fecha)
    {
        return self::where('Fk_Doctor', $doctorId)
                   ->where('Fecha_Cita', $fecha)
                   ->orderBy('Hora_Inicio')
                   ->get();
    }

    /**
     * Verificar disponibilidad de horario
     */
    public static function verificarDisponibilidad($doctorId, $fecha, $horaInicio, $horaFin, $excluirCitaId = null)
    {
        $query = self::where('Fk_Doctor', $doctorId)
                     ->where('Fecha_Cita', $fecha)
                     ->where(function($q) use ($horaInicio, $horaFin) {
                         $q->whereBetween('Hora_Inicio', [$horaInicio, $horaFin])
                           ->orWhereBetween('Hora_Fin', [$horaInicio, $horaFin])
                           ->orWhere(function($q2) use ($horaInicio, $horaFin) {
                               $q2->where('Hora_Inicio', '<=', $horaInicio)
                                  ->where('Hora_Fin', '>=', $horaFin);
                           });
                     });

        if ($excluirCitaId) {
            $query->where('Agenda_ID', '!=', $excluirCitaId);
        }

        return $query->count() === 0;
    }
} 