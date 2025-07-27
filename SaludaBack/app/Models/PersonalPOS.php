<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Hash;
use App\Models\UserPreference;

class PersonalPos extends Authenticatable
{
    use HasApiTokens, SoftDeletes;

    protected $table = 'personal_pos';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'codigo',
        'nombre',
        'apellido',
        'email',
        'password',
        'telefono',
        'dni',
        'fecha_nacimiento',
        'genero',
        'direccion',
        'ciudad',
        'provincia',
        'codigo_postal',
        'pais',
        'sucursal_id',
        'role_id',
        'fecha_ingreso',
        'fecha_salida',
        'estado_laboral',
        'salario',
        'tipo_contrato',
        'email_verified_at',
        'last_login_at',
        'last_login_ip',
        'is_active',
        'can_login',
        'can_sell',
        'can_refund',
        'can_manage_inventory',
        'can_manage_users',
        'can_view_reports',
        'can_manage_settings',
        'session_timeout',
        'preferences',
        'failed_login_attempts',
        'locked_until',
        'password_reset_token',
        'password_reset_expires_at',
        'notas',
        'foto_perfil',
        'Id_Licencia'
    ];

    protected $hidden = [
        'password',
        'password_reset_token',
        'remember_token',
        'Id_Licencia' // Ocultar por seguridad
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'locked_until' => 'datetime',
        'password_reset_expires_at' => 'datetime',
        'fecha_nacimiento' => 'date',
        'fecha_ingreso' => 'date',
        'fecha_salida' => 'date',
        'is_active' => 'boolean',
        'can_login' => 'boolean',
        'can_sell' => 'boolean',
        'can_refund' => 'boolean',
        'can_manage_inventory' => 'boolean',
        'can_manage_users' => 'boolean',
        'can_view_reports' => 'boolean',
        'can_manage_settings' => 'boolean',
        'preferences' => 'array',
    ];

    /**
     * Boot del modelo para asignar automáticamente Id_Licencia
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Si no se proporciona Id_Licencia, intentar obtenerla del usuario autenticado
            if (empty($model->Id_Licencia)) {
                $user = auth('api')->user();
                if ($user) {
                    $model->Id_Licencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
                }
            }
        });
    }

    // Para Passport/Sanctum: campo password
    public function getAuthPassword()
    {
        return $this->password;
    }

    // Para Passport/Sanctum: campo email
    public function getAuthIdentifierName()
    {
        return 'id';
    }

    // Para Passport: usar id como clave primaria
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

    // Para Passport: encontrar usuario por id, email o codigo
    public function findForPassport($username)
    {
        return $this->where('id', $username)
            ->orWhere('email', $username)
            ->orWhere('codigo', $username)
            ->first();
    }

    // Relación con sucursal
    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    // Relación con rol
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    // Relación con licencia (Hospital_Organizacion_Dueño)
    public function licencia()
    {
        return $this->belongsTo(HospitalOrganizacionDueño::class, 'Id_Licencia', 'Id_Licencia');
    }

    // Relación con licencia (alias para compatibilidad)
    public function hospitalOrganizacionDueño()
    {
        return $this->belongsTo(HospitalOrganizacionDueño::class, 'Id_Licencia', 'Id_Licencia');
    }

    // Relación con preferencias del usuario
    public function preferences()
    {
        return $this->hasOne(UserPreference::class, 'user_id');
    }

    // Método para obtener el nombre completo
    public function getNombreCompletoAttribute()
    {
        return trim($this->nombre . ' ' . $this->apellido);
    }

    // Método para verificar si el usuario puede hacer login
    public function canLogin()
    {
        return $this->is_active && $this->can_login && $this->estado_laboral === 'activo';
    }

    // Método para verificar si el usuario está bloqueado
    public function isLocked()
    {
        return $this->locked_until && now()->lt($this->locked_until);
    }

    // Método para incrementar intentos fallidos
    public function incrementFailedLoginAttempts()
    {
        $this->increment('failed_login_attempts');
        
        // Bloquear después de 5 intentos fallidos por 30 minutos
        if ($this->failed_login_attempts >= 5) {
            $this->update([
                'locked_until' => now()->addMinutes(30)
            ]);
        }
    }

    // Método para resetear intentos fallidos
    public function resetFailedLoginAttempts()
    {
        $this->update([
            'failed_login_attempts' => 0,
            'locked_until' => null
        ]);
    }

    // Método para actualizar último login
    public function updateLastLogin($ip = null)
    {
        $this->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip
        ]);
    }

    // Accessor para foto_perfil - convertir a URL completa
    public function getFotoPerfilAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // Si ya es una URL completa, devolverla tal como está
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // Si es solo un nombre de archivo, construir la URL completa
        if (strpos($value, '/') === false) {
            // Usar la ruta de storage
            return url('storage/profiles/' . $value);
        }

        // Si es una ruta relativa, construir la URL completa
        return url('storage/' . $value);
    }

    // Mutator para foto_perfil - guardar solo el nombre del archivo
    public function setFotoPerfilAttribute($value)
    {
        if (!$value) {
            $this->attributes['foto_perfil'] = null;
            return;
        }

        // Si es una URL completa, extraer solo el nombre del archivo
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            $path = parse_url($value, PHP_URL_PATH);
            $filename = basename($path);
            $this->attributes['foto_perfil'] = $filename;
            return;
        }

        // Si es solo un nombre de archivo, guardarlo tal como está
        $this->attributes['foto_perfil'] = $value;
    }
} 