<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class ProgramacionMedicoExt extends Model
{
    protected $table = 'Programacion_MedicosExt';
    protected $primaryKey = 'ID_Programacion';
    
    // Desactivar timestamps automáticos
    public $timestamps = false;
    
    protected $fillable = [
        'FK_Medico',
        'Fk_Sucursal',
        'Tipo_Programacion',
        'Fecha_Inicio',
        'Fecha_Fin',
        'Hora_inicio',
        'Hora_Fin',
        'Intervalo',
        'Estatus',
        'ProgramadoPor',
        'Sistema',
        'ID_H_O_D'
    ];

    protected $casts = [
        'Fecha_Inicio' => 'date',
        'Fecha_Fin' => 'date',
        'Hora_inicio' => 'datetime:H:i',
        'Hora_Fin' => 'datetime:H:i',
        'ProgramadoEn' => 'datetime'
    ];

    // Relaciones
    public function especialista(): BelongsTo
    {
        return $this->belongsTo(Especialista::class, 'FK_Medico', 'Especialista_ID');
    }

    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(SucursalMejorada::class, 'Fk_Sucursal', 'Sucursal_ID');
    }

    public function fechas(): HasMany
    {
        return $this->hasMany(FechaEspecialistaExt::class, 'Fk_Programacion', 'ID_Programacion');
    }

    public function horarios(): HasMany
    {
        return $this->hasMany(HorarioCitaExt::class, 'Fk_Programacion', 'ID_Programacion');
    }

    // Métodos de negocio
    public function verificarCambioAAutorizarHoras(): void
    {
        if ($this->Estatus === 'Programada') {
            $tieneFechas = $this->fechas()->where('Estado', 'Disponible')->exists();
            if ($tieneFechas) {
                $this->update(['Estatus' => 'Autorizar Horas']);
            }
        }
    }

    public function getFechasDisponiblesAttribute()
    {
        return $this->fechas()->where('Estado', 'Disponible')->get();
    }

    public function getHorariosDisponiblesAttribute()
    {
        return $this->horarios()->where('Estado', 'Disponible')->get();
    }

    /**
     * Generar fechas y horarios disponibles para la programación
     */
    public function generarFechasYHorarios()
    {
        $fechaInicio = \Carbon\Carbon::parse($this->Fecha_Inicio);
        $fechaFin = \Carbon\Carbon::parse($this->Fecha_Fin);
        $horaInicio = \Carbon\Carbon::parse($this->Hora_inicio);
        $horaFin = \Carbon\Carbon::parse($this->Hora_Fin);
        $intervalo = $this->Intervalo;

        $fechaActual = $fechaInicio->copy();
        
        while ($fechaActual->lte($fechaFin)) {
            // Crear fecha para este día
            $fecha = FechaEspecialistaExt::create([
                'Fk_Programacion' => $this->ID_Programacion,
                'Fecha_Disponibilidad' => $fechaActual->format('Y-m-d'),
                'Estado' => 'Disponible',
                'ID_H_O_D' => $this->ID_H_O_D,
                'Agregado_Por' => $this->ProgramadoPor,
                'Agregado_El' => now()
            ]);

            // Generar horarios para esta fecha
            $horaActual = $horaInicio->copy();
            
            while ($horaActual->lt($horaFin)) {
                HorarioCitaExt::create([
                    'Fk_Programacion' => $this->ID_Programacion,
                    'Fk_Fecha' => $fecha->ID_Fecha,
                    'FK_Especialista' => $this->FK_Medico,
                    'Horario_Disponibilidad' => $horaActual->format('H:i:s'),
                    'Estado' => 'Disponible',
                    'ID_H_O_D' => $this->ID_H_O_D,
                    'Agregado_Por' => $this->ProgramadoPor,
                    'Agregado_El' => now()
                ]);
                
                $horaActual->addMinutes($intervalo);
            }
            
            $fechaActual->addDay();
        }

        // Actualizar estado de la programación
        $this->update(['Estatus' => 'Autorizar Horas']);
    }
}
