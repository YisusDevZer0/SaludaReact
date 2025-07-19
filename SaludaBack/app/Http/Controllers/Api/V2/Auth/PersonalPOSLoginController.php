<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\PersonalPos;
use Symfony\Component\HttpFoundation\Response;

class PersonalPosLoginController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Buscar usuario en personal_pos usando Eloquent
        $user = PersonalPos::where('email', $request->email)
            ->orWhere('codigo', $request->email)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar contraseña
        if (!Hash::check($request->password, $user->password)) {
            // Incrementar intentos fallidos
            $user->incrementFailedLoginAttempts();
            
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar si el usuario está bloqueado
        if ($user->isLocked()) {
            $lockedUntil = $user->locked_until->format('H:i:s');
            return response()->json([
                'message' => "Cuenta bloqueada temporalmente hasta las {$lockedUntil}"
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar si el usuario puede hacer login
        if (!$user->canLogin()) {
            return response()->json([
                'message' => 'Usuario inactivo o sin permisos de acceso'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Resetear intentos fallidos al acceder correctamente
        $user->resetFailedLoginAttempts();

        // Actualizar último login
        $user->updateLastLogin($request->ip());

        // Generar token Passport
        $tokenResult = $user->createToken('PersonalPosToken');
        $token = $tokenResult->accessToken;

        // Cargar relaciones necesarias (sin licencia por ahora)
        $userWithRelations = PersonalPos::with(['sucursal', 'role'])
            ->where('id', $user->id)
            ->first();

        // Preparar datos del usuario para la respuesta
        $userData = [
            'id' => $userWithRelations->id,
            'codigo' => $userWithRelations->codigo,
            'nombre' => $userWithRelations->nombre,
            'apellido' => $userWithRelations->apellido,
            'nombre_completo' => $userWithRelations->nombre_completo,
            'email' => $userWithRelations->email,
            'telefono' => $userWithRelations->telefono,
            'dni' => $userWithRelations->dni,
            'fecha_nacimiento' => $userWithRelations->fecha_nacimiento,
            'genero' => $userWithRelations->genero,
            'direccion' => $userWithRelations->direccion,
            'ciudad' => $userWithRelations->ciudad,
            'provincia' => $userWithRelations->provincia,
            'codigo_postal' => $userWithRelations->codigo_postal,
            'pais' => $userWithRelations->pais,
            'fecha_ingreso' => $userWithRelations->fecha_ingreso,
            'fecha_salida' => $userWithRelations->fecha_salida,
            'estado_laboral' => $userWithRelations->estado_laboral,
            'salario' => $userWithRelations->salario,
            'tipo_contrato' => $userWithRelations->tipo_contrato,
            'last_login_at' => $userWithRelations->last_login_at,
            'last_login_ip' => $userWithRelations->last_login_ip,
            'session_timeout' => $userWithRelations->session_timeout,
            'preferences' => $userWithRelations->preferences,
            'notas' => $userWithRelations->notas,
            'foto_perfil' => $userWithRelations->foto_perfil,
            'can_sell' => $userWithRelations->can_sell,
            'can_refund' => $userWithRelations->can_refund,
            'can_manage_inventory' => $userWithRelations->can_manage_inventory,
            'can_manage_users' => $userWithRelations->can_manage_users,
            'can_view_reports' => $userWithRelations->can_view_reports,
            'can_manage_settings' => $userWithRelations->can_manage_settings,
            'sucursal' => $userWithRelations->sucursal ? [
                'id' => $userWithRelations->sucursal->id,
                'nombre' => $userWithRelations->sucursal->nombre,
                'direccion' => $userWithRelations->sucursal->direccion,
                'ciudad' => $userWithRelations->sucursal->ciudad,
                'provincia' => $userWithRelations->sucursal->provincia,
                'codigo_postal' => $userWithRelations->sucursal->codigo_postal,
                'pais' => $userWithRelations->sucursal->pais,
                'telefono' => $userWithRelations->sucursal->telefono,
                'email' => $userWithRelations->sucursal->email,
                'estado' => $userWithRelations->sucursal->estado
            ] : null,
            'role' => $userWithRelations->role ? [
                'id' => $userWithRelations->role->id,
                'nombre' => $userWithRelations->role->nombre,
                'descripcion' => $userWithRelations->role->descripcion,
                'estado' => $userWithRelations->role->estado,
                'permisos' => $userWithRelations->role->permisos ?? []
            ] : null,
            'licencia' => null // Temporalmente deshabilitado
        ];

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $tokenResult->token->expires_at ? 
                $tokenResult->token->expires_at->diffInSeconds(now()) : 
                config('auth.passport.tokens.access_token.lifetime', 3600),
            'user' => $userData
        ]);
    }
} 