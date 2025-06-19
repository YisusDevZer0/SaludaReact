<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Paciente extends Model
{
    use HasFactory;

    /**
     * La tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'pacientes';

    /**
     * La clave primaria del modelo.
     *
     * @var string
     */
    protected $primaryKey = 'Paciente_ID';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array
     */
    protected $fillable = [
        'Cedula',
        'Nombre_Completo',
        'Fecha_Nacimiento',
        'Sexo',
        'Telefono',
        'Correo_Electronico',
        'Direccion',
        'Grupo_Sanguineo',
        'Alergias',
        'Antecedentes_Medicos',
        'Estado_Civil',
        'Ocupacion',
        'Emergencia_Contacto',
        'Emergencia_Telefono',
        'Estado',
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
        'Fecha_Nacimiento' => 'date',
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
        return $this->hasMany(Agenda::class, 'Fk_Paciente', 'Paciente_ID');
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
     * Scope para buscar por nombre o cédula
     */
    public function scopeBuscar($query, $termino)
    {
        return $query->where(function($q) use ($termino) {
            $q->where('Nombre_Completo', 'LIKE', "%{$termino}%")
              ->orWhere('Cedula', 'LIKE', "%{$termino}%");
        });
    }

    /**
     * Scope para filtrar por grupo sanguíneo
     */
    public function scopePorGrupoSanguineo($query, $grupo)
    {
        return $query->where('Grupo_Sanguineo', $grupo);
    }

    /**
     * Scope para filtrar por sexo
     */
    public function scopePorSexo($query, $sexo)
    {
        return $query->where('Sexo', $sexo);
    }

    /**
     * Calcular edad del paciente
     */
    public function getEdadAttribute()
    {
        return $this->Fecha_Nacimiento ? $this->Fecha_Nacimiento->age : null;
    }

    /**
     * Obtener citas pendientes del paciente
     */
    public function citasPendientes()
    {
        return $this->citas()->whereIn('Estado_Cita', ['Pendiente', 'Confirmada']);
    }

    /**
     * Obtener historial de citas del paciente
     */
    public function historialCitas()
    {
        return $this->citas()->orderBy('Fecha_Cita', 'desc')->orderBy('Hora_Inicio', 'desc');
    }

    /**
     * Obtener próxima cita del paciente
     */
    public function proximaCita()
    {
        return $this->citas()
                   ->where('Fecha_Cita', '>=', now()->toDateString())
                   ->whereIn('Estado_Cita', ['Pendiente', 'Confirmada'])
                   ->orderBy('Fecha_Cita')
                   ->orderBy('Hora_Inicio')
                   ->first();
    }

    /**
     * Verificar si el paciente tiene citas pendientes
     */
    public function tieneCitasPendientes()
    {
        return $this->citasPendientes()->count() > 0;
    }

    /**
     * Obtener estadísticas del paciente
     */
    public function estadisticas()
    {
        $totalCitas = $this->citas()->count();
        $citasCompletadas = $this->citas()->where('Estado_Cita', 'Completada')->count();
        $citasCanceladas = $this->citas()->where('Estado_Cita', 'Cancelada')->count();
        $citasNoAsistio = $this->citas()->where('Estado_Cita', 'No Asistió')->count();

        return [
            'total_citas' => $totalCitas,
            'completadas' => $citasCompletadas,
            'canceladas' => $citasCanceladas,
            'no_asistio' => $citasNoAsistio,
            'porcentaje_asistencia' => $totalCitas > 0 ? round(($citasCompletadas / $totalCitas) * 100, 2) : 0
        ];
    }
} 