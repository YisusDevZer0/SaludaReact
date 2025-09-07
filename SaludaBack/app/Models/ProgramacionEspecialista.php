<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProgramacionEspecialista extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'programacion_especialistas';
    protected $primaryKey = 'Programacion_ID';

    protected $fillable = [
        'Fk_Especialista',
        'Fk_Sucursal',
        'Fk_Consultorio',
        'Tipo_Programacion',
        'Fecha_Inicio',
        'Fecha_Fin',
        'Hora_Inicio',
        'Hora_Fin',
        'Intervalo_Citas',
        'Estatus',
        'Notas',
        'ID_H_O_D',
        'Agregado_Por',
        'Modificado_Por'
    ];

    protected $casts = [
        'Fecha_Inicio' => 'date',
        'Fecha_Fin' => 'date',
        'Hora_Inicio' => 'datetime:H:i',
        'Hora_Fin' => 'datetime:H:i',
        'Agregado_El' => 'datetime',
        'Modificado_El' => 'datetime'
    ];

    // Relaciones
    public function especialista()
    {
        return $this->belongsTo(Especialista::class, 'Fk_Especialista', 'Especialista_ID');
    }

    public function sucursal()
    {
        return $this->belongsTo(SucursalMejorada::class, 'Fk_Sucursal', 'Sucursal_ID');
    }

    public function consultorio()
    {
        return $this->belongsTo(ConsultorioMejorado::class, 'Fk_Consultorio', 'Consultorio_ID');
    }

    public function horariosDisponibles()
    {
        return $this->hasMany(HorarioDisponible::class, 'Fk_Programacion', 'Programacion_ID');
    }

    public function citas()
    {
        return $this->hasMany(CitaMejorada::class, 'Fk_Especialista', 'Fk_Especialista');
    }

    // Scopes para filtros
    public function scopeActiva($query)
    {
        return $query->where('Estatus', 'Activa');
    }

    public function scopePorEspecialista($query, $especialistaId)
    {
        return $query->where('Fk_Especialista', $especialistaId);
    }

    public function scopePorSucursal($query, $sucursalId)
    {
        return $query->where('Fk_Sucursal', $sucursalId);
    }

    public function scopePorFecha($query, $fecha)
    {
        return $query->where('Fecha_Inicio', '<=', $fecha)
                    ->where('Fecha_Fin', '>=', $fecha);
    }

    // Métodos de utilidad
    public function generarHorariosDisponibles()
    {
        $fechaActual = $this->Fecha_Inicio;
        $horarios = [];

        while ($fechaActual <= $this->Fecha_Fin) {
            $horaActual = $this->Hora_Inicio;
            
            while ($horaActual < $this->Hora_Fin) {
                $horarios[] = [
                    'Fk_Programacion' => $this->Programacion_ID,
                    'Fecha' => $fechaActual->format('Y-m-d'),
                    'Hora' => $horaActual->format('H:i:s'),
                    'Estatus' => 'Cerrado',
                    'ID_H_O_D' => $this->ID_H_O_D,
                    'Agregado_Por' => $this->Agregado_Por,
                    'created_at' => now(),
                    'updated_at' => now()
                ];

                // Avanzar según el intervalo
                $horaActual = $horaActual->addMinutes($this->Intervalo_Citas);
            }

            $fechaActual = $fechaActual->addDay();
        }

        return $horarios;
    }

    public function activar()
    {
        $this->update(['Estatus' => 'Activa']);
        
        // Generar horarios disponibles si no existen
        if ($this->horariosDisponibles()->count() === 0) {
            $horarios = $this->generarHorariosDisponibles();
            HorarioDisponible::insert($horarios);
        }
    }

    /**
     * Verificar si la programación debe cambiar a activa
     */
    public function verificarCambioAActiva()
    {
        if ($this->Estatus === 'Programada') {
            $horariosAperturados = $this->horariosDisponibles()
                ->where('Estatus', 'Disponible')
                ->count();
            
            if ($horariosAperturados > 0) {
                $this->update(['Estatus' => 'Activa']);
                return true;
            }
        }
        
        return false;
    }

    public function finalizar()
    {
        $this->update(['Estatus' => 'Finalizada']);
    }

    public function cancelar()
    {
        $this->update(['Estatus' => 'Cancelada']);
    }
}
