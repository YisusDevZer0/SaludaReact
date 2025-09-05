<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HorarioDisponible extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'horarios_disponibles';
    protected $primaryKey = 'Horario_ID';

    protected $fillable = [
        'Fk_Programacion',
        'Fecha',
        'Hora',
        'Estatus',
        'ID_H_O_D',
        'Agregado_Por',
        'Modificado_Por'
    ];

    protected $casts = [
        'Fecha' => 'date',
        'Hora' => 'datetime:H:i',
        'Agregado_El' => 'datetime',
        'Modificado_El' => 'datetime'
    ];

    // Relaciones
    public function programacion()
    {
        return $this->belongsTo(ProgramacionEspecialista::class, 'Fk_Programacion', 'Programacion_ID');
    }

    public function especialista()
    {
        return $this->hasOneThrough(
            Especialista::class,
            ProgramacionEspecialista::class,
            'Programacion_ID',
            'Especialista_ID',
            'Fk_Programacion',
            'Fk_Especialista'
        );
    }

    public function sucursal()
    {
        return $this->hasOneThrough(
            SucursalMejorada::class,
            ProgramacionEspecialista::class,
            'Programacion_ID',
            'Sucursal_ID',
            'Fk_Programacion',
            'Fk_Sucursal'
        );
    }

    public function consultorio()
    {
        return $this->hasOneThrough(
            ConsultorioMejorado::class,
            ProgramacionEspecialista::class,
            'Programacion_ID',
            'Consultorio_ID',
            'Fk_Programacion',
            'Fk_Consultorio'
        );
    }

    public function cita()
    {
        return $this->hasOne(CitaMejorada::class, 'Fk_Especialista', 'Fk_Especialista')
                    ->where('Fecha_Cita', $this->Fecha)
                    ->where('Hora_Inicio', $this->Hora);
    }

    // Scopes para filtros
    public function scopeDisponible($query)
    {
        return $query->where('Estatus', 'Disponible');
    }

    public function scopeOcupado($query)
    {
        return $query->where('Estatus', 'Ocupado');
    }

    public function scopePorFecha($query, $fecha)
    {
        return $query->where('Fecha', $fecha);
    }

    public function scopePorEspecialista($query, $especialistaId)
    {
        return $query->whereHas('programacion', function($q) use ($especialistaId) {
            $q->where('Fk_Especialista', $especialistaId);
        });
    }

    public function scopePorSucursal($query, $sucursalId)
    {
        return $query->whereHas('programacion', function($q) use ($sucursalId) {
            $q->where('Fk_Sucursal', $sucursalId);
        });
    }

    public function scopePorEspecialidad($query, $especialidadId)
    {
        return $query->whereHas('programacion.especialista', function($q) use ($especialidadId) {
            $q->where('Fk_Especialidad', $especialidadId);
        });
    }

    // Métodos para gestionar fechas y horas
    public function scopeFechasAperturadas($query)
    {
        return $query->where('Estatus', '!=', 'Cerrado')
                    ->distinct('Fecha');
    }

    public function scopeHorasAperturadas($query, $fecha)
    {
        return $query->where('Fecha', $fecha)
                    ->where('Estatus', '!=', 'Cerrado');
    }

    // Métodos estáticos para operaciones en lote
    public static function aperturarFecha($programacionId, $fecha)
    {
        $resultado = self::where('Fk_Programacion', $programacionId)
                  ->where('Fecha', $fecha)
                  ->update(['Estatus' => 'Disponible']);
        
        // Verificar si la programación debe cambiar a activa
        $programacion = \App\Models\ProgramacionEspecialista::find($programacionId);
        if ($programacion) {
            $programacion->verificarCambioAActiva();
        }
        
        return $resultado;
    }



    public static function eliminarFecha($programacionId, $fecha)
    {
        return self::where('Fk_Programacion', $programacionId)
                  ->where('Fecha', $fecha)
                  ->delete();
    }

    public static function editarFecha($programacionId, $fechaOriginal, $nuevaFecha, $nuevosHorarios)
    {
        // Si se cambia la fecha, actualizar todos los horarios de esa fecha
        if ($fechaOriginal !== $nuevaFecha) {
            self::where('Fk_Programacion', $programacionId)
                ->where('Fecha', $fechaOriginal)
                ->update(['Fecha' => $nuevaFecha]);
        }

        // Si se proporcionan nuevos horarios, reemplazar los existentes
        if (!empty($nuevosHorarios)) {
            // Eliminar horarios existentes de esa fecha
            self::where('Fk_Programacion', $programacionId)
                ->where('Fecha', $nuevaFecha)
                ->delete();

            // Crear nuevos horarios
            $horarios = [];
            foreach ($nuevosHorarios as $hora) {
                $horarios[] = [
                    'Fk_Programacion' => $programacionId,
                    'Fecha' => $nuevaFecha,
                    'Hora' => $hora,
                    'Estatus' => 'Cerrado',
                    'ID_H_O_D' => 'default', // Se puede mejorar obteniendo el ID_H_O_D de la programación
                    'Agregado_Por' => 'system',
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            self::insert($horarios);
        }

        return true;
    }

    public function scopeActiva($query)
    {
        return $query->whereHas('programacion', function($q) {
            $q->where('Estatus', 'Activa');
        });
    }

    // Métodos de utilidad
    public function marcarComoOcupado()
    {
        $this->update(['Estatus' => 'Ocupado']);
    }

    public function aperturar()
    {
        $this->update(['Estatus' => 'Disponible']);
        
        // Verificar si la programación debe cambiar a activa
        $programacion = $this->programacion;
        if ($programacion) {
            $programacion->verificarCambioAActiva();
        }
    }



    public function marcarComoDisponible()
    {
        $this->update(['Estatus' => 'Disponible']);
    }

    public function marcarComoReservado()
    {
        $this->update(['Estatus' => 'Reservado']);
    }

    public function marcarComoBloqueado()
    {
        $this->update(['Estatus' => 'Bloqueado']);
    }

    public function estaDisponible()
    {
        return $this->Estatus === 'Disponible';
    }

    public function estaOcupado()
    {
        return $this->Estatus === 'Ocupado';
    }

    public function getFechaHoraCompletaAttribute()
    {
        return $this->Fecha->format('Y-m-d') . ' ' . $this->Hora->format('H:i:s');
    }

    public function getHoraFormateadaAttribute()
    {
        return $this->Hora->format('H:i');
    }
}
