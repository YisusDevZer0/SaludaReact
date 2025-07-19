<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = [
        'user_id',
        'sidenav_color',
        'transparent_sidenav',
        'white_sidenav',
        'fixed_navbar',
        'dark_mode',
        'mini_sidenav',
        'navbar_color',
        'transparent_navbar',
        'navbar_shadow',
        'navbar_position',
        'layout',
        'direction',
        'table_header_color'
    ];

    protected $casts = [
        'transparent_sidenav' => 'boolean',
        'white_sidenav' => 'boolean',
        'fixed_navbar' => 'boolean',
        'dark_mode' => 'boolean',
        'mini_sidenav' => 'boolean',
        'transparent_navbar' => 'boolean',
        'navbar_shadow' => 'boolean'
    ];

    // Relación con el usuario
    public function user()
    {
        return $this->belongsTo(PersonalPos::class, 'user_id');
    }

    // Método para obtener preferencias por defecto
    public static function getDefaultPreferences()
    {
        return [
            'sidenav_color' => 'info',
            'transparent_sidenav' => false,
            'white_sidenav' => false,
            'fixed_navbar' => true,
            'dark_mode' => false,
            'mini_sidenav' => false,
            'navbar_color' => 'info',
            'transparent_navbar' => true,
            'navbar_shadow' => true,
            'navbar_position' => 'fixed',
            'layout' => 'dashboard',
            'direction' => 'ltr',
            'table_header_color' => 'azulSereno'
        ];
    }
}
