<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class PersonalPOS extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'PersonalPOS';
    protected $primaryKey = 'Pos_ID';
    public $timestamps = true;

    protected $fillable = [
        'Nombre_Apellidos', 'Password', 'avatar_url', 'Fk_Usuario', 'Fecha_Nacimiento',
        'Correo_Electronico', 'Telefono', 'AgregadoPor', 'AgregadoEl', 'Fk_Sucursal',
        'ID_H_O_D', 'Estatus', 'ColorEstatus', 'Biometrico', 'Permisos', 'Perm_Elim',
        'Perm_Edit', 'remember_token', 'token_expires_at'
    ];

    // Para Passport/Sanctum: campo password
    public function getAuthPassword()
    {
        return $this->Password;
    }

    // Para Passport/Sanctum: campo email
    public function getAuthIdentifierName()
    {
        return 'Pos_ID';
    }

    // Para Passport: usar Pos_ID como clave primaria
    public function getKey()
    {
        return $this->getAttribute($this->getKeyName());
    }

    // Para Passport: método adicional para resolver el usuario
    public function getAuthIdentifier()
    {
        return $this->getAttribute($this->getKeyName());
    }

    // Para Passport: método para obtener el nombre de la clave primaria
    public function getKeyName()
    {
        return $this->primaryKey;
    }

    // Para Passport: encontrar usuario por Pos_ID o Correo_Electronico
    public function findForPassport($username)
    {
        return $this->where('Pos_ID', $username)
            ->orWhere('Correo_Electronico', $username)
            ->first();
    }
} 