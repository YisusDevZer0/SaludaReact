<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class TestLoginController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Buscar usuario directamente en la base de datos
        $user = DB::table('personal_pos')
            ->where('email', $request->email)
            ->orWhere('codigo', $request->email)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Credenciales inválidas - Usuario no encontrado'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar contraseña usando Hash
        if (!\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales inválidas - Contraseña incorrecta'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar si el usuario está activo
        if (!$user->is_active || !$user->can_login || $user->estado_laboral !== 'activo') {
            return response()->json([
                'message' => 'Usuario inactivo o sin permisos de acceso'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Actualizar último login
        DB::table('personal_pos')
            ->where('id', $user->id)
            ->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip()
            ]);

        // Cargar datos de sucursal y rol
        $sucursal = null;
        $role = null;

        if ($user->sucursal_id) {
            $sucursal = DB::table('sucursales')
                ->where('id', $user->sucursal_id)
                ->first();
        }

        if ($user->role_id) {
            $role = DB::table('roles')
                ->where('id', $user->role_id)
                ->first();
        }

        // Preparar datos del usuario para la respuesta
        $userData = [
            'id' => $user->id,
            'codigo' => $user->codigo,
            'nombre' => $user->nombre,
            'apellido' => $user->apellido,
            'nombre_completo' => trim($user->nombre . ' ' . $user->apellido),
            'email' => $user->email,
            'telefono' => $user->telefono,
            'dni' => $user->dni,
            'fecha_nacimiento' => $user->fecha_nacimiento,
            'genero' => $user->genero,
            'direccion' => $user->direccion,
            'ciudad' => $user->ciudad,
            'provincia' => $user->provincia,
            'codigo_postal' => $user->codigo_postal,
            'pais' => $user->pais,
            'fecha_ingreso' => $user->fecha_ingreso,
            'fecha_salida' => $user->fecha_salida,
            'estado_laboral' => $user->estado_laboral,
            'salario' => $user->salario,
            'tipo_contrato' => $user->tipo_contrato,
            'last_login_at' => $user->last_login_at,
            'last_login_ip' => $user->last_login_ip,
            'session_timeout' => $user->session_timeout,
            'preferences' => $user->preferences,
            'notas' => $user->notas,
            'foto_perfil' => $user->foto_perfil,
            'can_sell' => $user->can_sell,
            'can_refund' => $user->can_refund,
            'can_manage_inventory' => $user->can_manage_inventory,
            'can_manage_users' => $user->can_manage_users,
            'can_view_reports' => $user->can_view_reports,
            'can_manage_settings' => $user->can_manage_settings,
            'sucursal' => $sucursal ? [
                'id' => $sucursal->id,
                'nombre' => $sucursal->nombre,
                'direccion' => $sucursal->direccion,
                'ciudad' => $sucursal->ciudad,
                'provincia' => $sucursal->provincia,
                'codigo_postal' => $sucursal->codigo_postal,
                'pais' => $sucursal->pais,
                'telefono' => $sucursal->telefono,
                'email' => $sucursal->email,
                'estado' => $sucursal->estado
            ] : null,
            'role' => $role ? [
                'id' => $role->id,
                'nombre' => $role->nombre,
                'descripcion' => $role->descripcion,
                'estado' => $role->estado,
                'permisos' => $role->permisos ?? []
            ] : null
        ];

        return response()->json([
            'message' => 'Login exitoso usando TestLoginController',
            'user' => $userData,
            'note' => 'Este es un controlador de prueba sin Passport tokens'
        ]);
    }
} 