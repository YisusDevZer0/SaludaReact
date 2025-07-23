<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HospitalOrganizacionDueño extends Model
{
    protected $table = 'Hospital_Organizacion_Dueño';
    protected $primaryKey = 'H_O_D';
    public $timestamps = true;

    protected $fillable = [
        'nombre',
        'descripcion',
        'estado',
        'fecha_expiracion',
        'codigo',
        'tipo_licencia',
        'numero_licencia',
        'fecha_emision',
        'fecha_vencimiento',
        'autoridad_emisora',
        'restricciones',
        'notas',
        'documentos_adjuntos',
        'contacto_emergencia',
        'telefono_emergencia',
        'email_emergencia',
        'direccion_emergencia',
        'responsable_nombre',
        'responsable_cargo',
        'responsable_telefono',
        'responsable_email',
        'configuracion',
        'metadata'
    ];

    protected $hidden = [
        'configuracion',
        'metadata'
    ];

    protected $casts = [
        'fecha_expiracion' => 'datetime',
        'fecha_emision' => 'datetime',
        'fecha_vencimiento' => 'datetime',
        'estado' => 'string',
        'configuracion' => 'array',
        'metadata' => 'array',
        'documentos_adjuntos' => 'array',
        'restricciones' => 'array'
    ];

    // Relación con personal_pos
    public function personalPos()
    {
        return $this->hasMany(PersonalPos::class, 'Id_Licencia');
    }

    // Método para verificar si la licencia está activa
    public function isActive()
    {
        return $this->estado === 'activo' && 
               (!$this->fecha_vencimiento || now()->lt($this->fecha_vencimiento));
    }

    // Método para verificar si la licencia ha expirado
    public function isExpired()
    {
        return $this->fecha_vencimiento && now()->gt($this->fecha_vencimiento);
    }

    // Método para obtener días restantes hasta expiración
    public function getDaysUntilExpiration()
    {
        if (!$this->fecha_vencimiento) {
            return null;
        }
        
        return now()->diffInDays($this->fecha_vencimiento, false);
    }

    // Método para obtener el estado de la licencia con más detalle
    public function getDetailedStatus()
    {
        if (!$this->isActive()) {
            return 'inactivo';
        }
        
        if ($this->isExpired()) {
            return 'expirado';
        }
        
        $daysLeft = $this->getDaysUntilExpiration();
        if ($daysLeft !== null && $daysLeft <= 30) {
            return 'por_expirar';
        }
        
        return 'activo';
    }
} 