<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalPOS extends Model
{
    protected $table = 'PersonalPOS';
    protected $primaryKey = 'Pos_ID';
    public $timestamps = true;

    protected $fillable = [
        'Nombre_Apellidos', 'Password', 'avatar_url', 'Fk_Usuario', 'Fecha_Nacimiento',
        'Correo_Electronico', 'Telefono', 'AgregadoPor', 'AgregadoEl', 'Fk_Sucursal',
        'ID_H_O_D', 'Estatus', 'ColorEstatus', 'Biometrico', 'Permisos', 'Perm_Elim',
        'Perm_Edit', 'remember_token', 'token_expires_at'
    ];
} 