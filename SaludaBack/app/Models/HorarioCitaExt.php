<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HorarioCitaExt extends Model
{
    protected $table = 'Horarios_Citas_Ext';
    protected $primaryKey = 'ID_Horario';
    
    // Desactivar timestamps automáticos
    public $timestamps = false;
    
    protected $fillable = [
        'Horario_Disponibilidad',
        'ID_H_O_D',
        'FK_Especialista',
        'FK_Fecha',
        'Fk_Programacion',
        'Estado',
        'AgregadoPor',
        'AgregadoEl'
    ];

    protected $casts = [
        'Horario_Disponibilidad' => 'datetime:H:i:s',
        'AgregadoEl' => 'datetime'
    ];

    // Relaciones
    public function especialista(): BelongsTo
    {
        return $this->belongsTo(Especialista::class, 'FK_Especialista', 'Especialista_ID');
    }

    public function fecha(): BelongsTo
    {
        return $this->belongsTo(FechaEspecialistaExt::class, 'FK_Fecha', 'ID_Fecha_Esp');
    }

    public function programacion(): BelongsTo
    {
        return $this->belongsTo(ProgramacionMedicoExt::class, 'Fk_Programacion', 'ID_Programacion');
    }

    // Métodos de negocio
    public function aperturar(): void
    {
        $this->update(['Estado' => 'Disponible']);
    }

    public function ocupar(): void
    {
        $this->update(['Estado' => 'Ocupado']);
    }

    public function cerrar(): void
    {
        $this->update(['Estado' => 'Cerrado']);
    }

    // Scopes para consultas comunes
    public function scopeDisponibles($query)
    {
        return $query->where('Estado', 'Disponible');
    }

    public function scopeOcupados($query)
    {
        return $query->where('Estado', 'Ocupado');
    }

    public function scopePorFecha($query, $fecha)
    {
        return $query->whereHas('fecha', function($q) use ($fecha) {
            $q->where('Fecha_Disponibilidad', $fecha);
        });
    }

    public function scopePorEspecialista($query, $especialistaId)
    {
        return $query->where('FK_Especialista', $especialistaId);
    }
}
