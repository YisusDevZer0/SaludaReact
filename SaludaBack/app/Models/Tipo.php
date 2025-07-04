<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tipo extends Model
{
    use HasFactory;
    protected $table = 'Tipos';
    protected $primaryKey = 'Tip_Prod_ID';
    public $timestamps = false;
    protected $fillable = [
        'Nom_Tipo_Prod',
        'Estado',
        'Cod_Estado',
        'Agregado_Por',
        'Agregadoel',
        'Sistema',
        'ID_H_O_D',
    ];
} 