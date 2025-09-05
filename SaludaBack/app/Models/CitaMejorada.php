<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CitaMejorada extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'citas_mejoradas';
    protected $primaryKey = 'Cita_ID';

    protected $fillable = [
        'Titulo',
        'Descripcion',
        'Fecha_Cita',
        'Hora_Inicio',
        'Hora_Fin',
        'Estado_Cita',
        'Tipo_Cita',
        'Costo',
        'Notas_Adicionales',
        'Fk_Paciente',
        'Fk_Especialista',
        'Fk_Sucursal',
        'Fk_Consultorio',
        'Fk_Horario',
        'Agregado_Por',
        'Modificado_Por',
        'ID_H_O_D'
    ];

    protected $casts = [
        'Fecha_Cita' => 'date',
        'Hora_Inicio' => 'datetime',
        'Hora_Fin' => 'datetime',
        'Costo' => 'decimal:2',
        'Agregado_El' => 'datetime',
        'Modificado_El' => 'datetime'
    ];

    // Relaciones
    public function paciente()
    {
        return $this->belongsTo(PacienteMejorado::class, 'Fk_Paciente', 'Paciente_ID');
    }

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

    public function horario()
    {
        return $this->belongsTo(HorarioCitaExt::class, 'Fk_Horario', 'ID_Horario');
    }

    public function historialEstados()
    {
        return $this->hasMany(HistorialEstadoCita::class, 'Fk_Cita', 'Cita_ID');
    }

    public function notificaciones()
    {
        return $this->hasMany(NotificacionCita::class, 'Fk_Cita', 'Cita_ID');
    }

    // Scopes
    public function scopePorFecha($query, $fecha)
    {
        return $query->whereDate('Fecha_Cita', $fecha);
    }

    public function scopePorEstado($query, $estado)
    {
        return $query->where('Estado_Cita', $estado);
    }

    public function scopePorEspecialista($query, $especialistaId)
    {
        return $query->where('Fk_Especialista', $especialistaId);
    }

    public function scopePorSucursal($query, $sucursalId)
    {
        return $query->where('Fk_Sucursal', $sucursalId);
    }

    public function scopePorHospital($query, $hospitalId)
    {
        return $query->where('ID_H_O_D', $hospitalId);
    }

    public function scopeHoy($query)
    {
        return $query->whereDate('Fecha_Cita', today());
    }

    public function scopePendientes($query)
    {
        return $query->whereIn('Estado_Cita', ['Pendiente', 'Confirmada']);
    }

    // Accesores
    public function getDuracionAttribute()
    {
        if ($this->Hora_Inicio && $this->Hora_Fin) {
            $inicio = \Carbon\Carbon::parse($this->Hora_Inicio);
            $fin = \Carbon\Carbon::parse($this->Hora_Fin);
            return $inicio->diffInMinutes($fin);
        }
        return 0;
    }

    public function getEstadoColorAttribute()
    {
        $colores = [
            'Pendiente' => 'warning',
            'Confirmada' => 'info',
            'En Proceso' => 'primary',
            'Completada' => 'success',
            'Cancelada' => 'error',
            'No Asistió' => 'default'
        ];
        
        return $colores[$this->Estado_Cita] ?? 'default';
    }

    // Mutadores
    public function setTituloAttribute($value)
    {
        $this->attributes['Titulo'] = ucfirst(strtolower($value));
    }

    public function setTipoCitaAttribute($value)
    {
        $this->attributes['Tipo_Cita'] = ucfirst(strtolower($value));
    }

    public function setEstadoCitaAttribute($value)
    {
        $this->attributes['Estado_Cita'] = ucfirst(strtolower($value));
    }
}
