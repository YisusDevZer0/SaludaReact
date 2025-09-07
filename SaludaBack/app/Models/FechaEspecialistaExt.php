<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FechaEspecialistaExt extends Model
{
    protected $table = 'Fechas_EspecialistasExt';
    protected $primaryKey = 'ID_Fecha_Esp';
    
    // Desactivar timestamps automáticos
    public $timestamps = false;
    
    protected $fillable = [
        'Fecha_Disponibilidad',
        'ID_H_O_D',
        'FK_Especialista',
        'Fk_Programacion',
        'Estado',
        'Agrego',
        'Agregadoen'
    ];

    protected $casts = [
        'Fecha_Disponibilidad' => 'date',
        'Agregadoen' => 'datetime'
    ];

    // Relaciones
    public function especialista(): BelongsTo
    {
        return $this->belongsTo(Especialista::class, 'FK_Especialista', 'Especialista_ID');
    }

    public function programacion(): BelongsTo
    {
        return $this->belongsTo(ProgramacionMedicoExt::class, 'Fk_Programacion', 'ID_Programacion');
    }

    public function horarios(): HasMany
    {
        return $this->hasMany(HorarioCitaExt::class, 'FK_Fecha', 'ID_Fecha_Esp');
    }

    // Métodos de negocio
    public function aperturar(): void
    {
        $this->update(['Estado' => 'Disponible']);
        // El trigger automáticamente cambiará el estado de la programación
    }

    public function cerrar(): void
    {
        $this->update(['Estado' => 'Cerrado']);
    }

    public function getHorariosDisponiblesAttribute()
    {
        return $this->horarios()->where('Estado', 'Disponible')->get();
    }

    public function getHorariosOcupadosAttribute()
    {
        return $this->horarios()->where('Estado', 'Ocupado')->get();
    }
}
