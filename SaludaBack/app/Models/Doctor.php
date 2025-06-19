<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Doctor extends Model
{
    use HasFactory;

    /**
     * La tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'doctores';

    /**
     * La clave primaria del modelo.
     *
     * @var string
     */
    protected $primaryKey = 'Doctor_ID';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array
     */
    protected $fillable = [
        'Cedula_Profesional',
        'Nombre_Completo',
        'Especialidad',
        'Subespecialidad',
        'Telefono',
        'Correo_Electronico',
        'Direccion',
        'Hora_Inicio_Laboral',
        'Hora_Fin_Laboral',
        'Duracion_Cita',
        'Costo_Consulta',
        'Consultorio_Asignado',
        'Estado',
        'Notas',
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
        'Hora_Inicio_Laboral' => 'datetime:H:i',
        'Hora_Fin_Laboral' => 'datetime:H:i',
        'Duracion_Cita' => 'integer',
        'Costo_Consulta' => 'decimal:2',
        'Agregado_El' => 'datetime',
        'Modificado_El' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con las citas
     */
    public function citas()
    {
        return $this->hasMany(Agenda::class, 'Fk_Doctor', 'Doctor_ID');
    }

    /**
     * Scope para filtrar por estado activo
     */
    public function scopeActivos($query)
    {
        return $query->where('Estado', 'Activo');
    }

    /**
     * Scope para filtrar por organización
     */
    public function scopePorOrganizacion($query, $idHod)
    {
        return $query->where('ID_H_O_D', $idHod);
    }

    /**
     * Scope para filtrar por especialidad
     */
    public function scopePorEspecialidad($query, $especialidad)
    {
        return $query->where('Especialidad', $especialidad);
    }

    /**
     * Scope para buscar por nombre o cédula
     */
    public function scopeBuscar($query, $termino)
    {
        return $query->where(function($q) use ($termino) {
            $q->where('Nombre_Completo', 'LIKE', "%{$termino}%")
              ->orWhere('Cedula_Profesional', 'LIKE', "%{$termino}%")
              ->orWhere('Especialidad', 'LIKE', "%{$termino}%");
        });
    }

    /**
     * Obtener citas de hoy del doctor
     */
    public function citasHoy()
    {
        return $this->citas()->hoy()->orderBy('Hora_Inicio');
    }

    /**
     * Obtener citas pendientes del doctor
     */
    public function citasPendientes()
    {
        return $this->citas()->pendientes()->orderBy('Fecha_Cita')->orderBy('Hora_Inicio');
    }

    /**
     * Obtener disponibilidad del doctor para una fecha específica
     */
    public function disponibilidadFecha($fecha)
    {
        $citasDelDia = $this->citas()->porFecha($fecha)->orderBy('Hora_Inicio')->get();
        $horarioLaboral = [
            'inicio' => $this->Hora_Inicio_Laboral,
            'fin' => $this->Hora_Fin_Laboral,
            'duracion_cita' => $this->Duracion_Cita
        ];

        return [
            'doctor' => $this->Nombre_Completo,
            'especialidad' => $this->Especialidad,
            'consultorio' => $this->Consultorio_Asignado,
            'horario_laboral' => $horarioLaboral,
            'citas_programadas' => $citasDelDia,
            'total_citas' => $citasDelDia->count(),
            'disponibilidad' => $this->calcularDisponibilidad($fecha, $citasDelDia, $horarioLaboral)
        ];
    }

    /**
     * Calcular disponibilidad del doctor
     */
    private function calcularDisponibilidad($fecha, $citasDelDia, $horarioLaboral)
    {
        $inicio = $horarioLaboral['inicio'];
        $fin = $horarioLaboral['fin'];
        $duracionCita = $horarioLaboral['duracion_cita'];

        $totalMinutosLaborales = $inicio->diffInMinutes($fin);
        $totalCitasPosibles = floor($totalMinutosLaborales / $duracionCita);
        $citasOcupadas = $citasDelDia->whereIn('Estado_Cita', ['Pendiente', 'Confirmada'])->count();

        return [
            'total_slots' => $totalCitasPosibles,
            'ocupados' => $citasOcupadas,
            'disponibles' => $totalCitasPosibles - $citasOcupadas,
            'porcentaje_ocupacion' => $totalCitasPosibles > 0 ? round(($citasOcupadas / $totalCitasPosibles) * 100, 2) : 0
        ];
    }

    /**
     * Obtener estadísticas del doctor
     */
    public function estadisticas($fechaInicio = null, $fechaFin = null)
    {
        $query = $this->citas();

        if ($fechaInicio && $fechaFin) {
            $query->porRangoFechas($fechaInicio, $fechaFin);
        }

        $totalCitas = $query->count();
        $citasCompletadas = $query->where('Estado_Cita', 'Completada')->count();
        $citasCanceladas = $query->where('Estado_Cita', 'Cancelada')->count();
        $citasNoAsistio = $query->where('Estado_Cita', 'No Asistió')->count();
        $citasPendientes = $query->whereIn('Estado_Cita', ['Pendiente', 'Confirmada'])->count();

        return [
            'total_citas' => $totalCitas,
            'completadas' => $citasCompletadas,
            'canceladas' => $citasCanceladas,
            'no_asistio' => $citasNoAsistio,
            'pendientes' => $citasPendientes,
            'porcentaje_asistencia' => $totalCitas > 0 ? round(($citasCompletadas / $totalCitas) * 100, 2) : 0,
            'porcentaje_cancelacion' => $totalCitas > 0 ? round(($citasCanceladas / $totalCitas) * 100, 2) : 0
        ];
    }

    /**
     * Verificar si el doctor está disponible en un horario específico
     */
    public function estaDisponible($fecha, $horaInicio, $horaFin)
    {
        return Agenda::verificarDisponibilidad($this->Doctor_ID, $fecha, $horaInicio, $horaFin);
    }

    /**
     * Obtener horarios disponibles para una fecha
     */
    public function horariosDisponibles($fecha)
    {
        $citasDelDia = $this->citas()->porFecha($fecha)->get();
        $horarios = [];
        
        $inicio = $this->Hora_Inicio_Laboral;
        $fin = $this->Hora_Fin_Laboral;
        $duracion = $this->Duracion_Cita;

        while ($inicio < $fin) {
            $horaFin = $inicio->copy()->addMinutes($duracion);
            
            if ($horaFin <= $fin) {
                $disponible = true;
                
                foreach ($citasDelDia as $cita) {
                    if ($cita->Hora_Inicio < $horaFin && $cita->Hora_Fin > $inicio) {
                        $disponible = false;
                        break;
                    }
                }
                
                if ($disponible) {
                    $horarios[] = [
                        'inicio' => $inicio->format('H:i'),
                        'fin' => $horaFin->format('H:i')
                    ];
                }
            }
            
            $inicio->addMinutes($duracion);
        }

        return $horarios;
    }
} 