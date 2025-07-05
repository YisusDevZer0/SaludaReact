<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Auditoria extends Model
{
    use HasFactory;

    protected $table = 'auditorias';

    protected $fillable = [
        'user_id',
        'accion',
        'descripcion',
        'ip',
        'user_agent',
        'ruta',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
} 