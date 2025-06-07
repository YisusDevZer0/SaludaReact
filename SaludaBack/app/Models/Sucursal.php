<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
    use HasFactory;

    protected $table = 'Sucursales';
    protected $primaryKey = 'ID_SucursalC';
    
    protected $fillable = [
        'Nombre_Sucursal',
        'Direccion',
        'CP',
        'RFC',
        'ID_H_O_D',
        'Codigo_identificador',
        'Telefono',
        'Correo',
        'Contra_correo',
        'Cuenta_Clip',
        'Clave_Clip',
        'Pin_Equipo',
        'Sucursal_Activa',
        'Agrego',
        'AgregadoEl',
        'Sistema',
        'Impresora_Tickets',
        'Url_Drive_Enfermeria',
        'EstadoSucursalInv',
        'sistemachecador',
        'Latitud',
        'Longitud',
        'LinkMaps'
    ];

    protected $casts = [
        'Sucursal_Activa' => 'boolean',
        'EstadoSucursalInv' => 'boolean',
        'sistemachecador' => 'boolean',
        'Latitud' => 'decimal:8',
        'Longitud' => 'decimal:8',
        'AgregadoEl' => 'datetime'
    ];
} 