<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecondDatabaseModel extends Model
{
    /**
     * Especificar la conexión de base de datos para este modelo
     */
    protected $connection = 'mysql_second';

    /**
     * La tabla asociada al modelo
     */
    protected $table = 'huellas';

    /**
     * Los atributos que son asignables masivamente
     */
    protected $fillable = [
        'id_usuario',
        'huella_digital',
        'fecha_captura',
        'estado',
        // Agrega aquí los campos que necesites según tu tabla
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos
     */
    protected $casts = [
        'fecha_captura' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con el usuario (si existe)
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
} 