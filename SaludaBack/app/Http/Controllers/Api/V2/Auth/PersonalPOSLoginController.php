<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class PersonalPOSLoginController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Buscar usuario en PersonalPOS con su rol y sucursal usando JOIN
        $user = DB::table('PersonalPOS as p')
            ->join('Roles_Puestos as r', 'p.Fk_Usuario', '=', 'r.ID_rol')
            ->join('Sucursales as s', 'p.Fk_Sucursal', '=', 's.ID_SucursalC')
            ->where('p.Correo_Electronico', $request->email)
            ->select([
                'p.Pos_ID',
                'p.Nombre_Apellidos',
                'p.Password',
                'p.avatar_url',
                'p.Fecha_Nacimiento',
                'p.Correo_Electronico',
                'p.Telefono',
                'p.AgregadoPor',
                'p.AgregadoEl',
                'p.Fk_Sucursal',
                'p.ID_H_O_D',
                'p.Estatus',
                'p.ColorEstatus',
                'p.Biometrico',
                'p.Permisos',
                'p.Perm_Elim',
                'p.Perm_Edit',
                'p.remember_token',
                'p.created_at',
                'p.updated_at',
                'r.ID_rol',
                'r.Nombre_rol',
                'r.Estado as Rol_Estado',
                'r.Sistema as Rol_Permisos',
                'r.created_at as Rol_created_at',
                'r.updated_at as Rol_updated_at',
                's.ID_SucursalC',
                's.Nombre_Sucursal',
                's.Direccion',
                's.Telefono as Sucursal_Telefono',
                's.Correo as Sucursal_Correo',
                's.Sucursal_Activa',
                's.Latitud',
                's.Longitud'
            ])
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar contraseña
        if (!Hash::check($request->password, $user->Password)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar si el usuario está activo
        if ($user->Estatus !== 'Vigente') {
            return response()->json([
                'message' => 'Usuario inactivo'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar si el rol está activo
        if ($user->Rol_Estado !== 'Vigente') {
            return response()->json([
                'message' => 'Rol no encontrado o inactivo'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Generar token de acceso con expiración de 8 horas
        $expiresAt = time() + (8 * 60 * 60); // 8 horas en segundos
        $token = $user->Pos_ID . '|' . $expiresAt . '|' . bin2hex(random_bytes(32));
        
        // Guardar token y expiración en la base de datos
        DB::table('PersonalPOS')
            ->where('Pos_ID', $user->Pos_ID)
            ->update([
                'remember_token' => $token,
                'token_expires_at' => date('Y-m-d H:i:s', $expiresAt)
            ]);

        // Preparar la respuesta con los datos del usuario, su rol y sucursal
        return response()->json([
            'access_token' => $token,
            'expires_at' => $expiresAt,
            'refresh_token' => bin2hex(random_bytes(32)),
            'user' => [
                'Pos_ID' => $user->Pos_ID,
                'Nombre_Apellidos' => $user->Nombre_Apellidos,
                'Correo_Electronico' => $user->Correo_Electronico,
                'avatar_url' => $user->avatar_url,
                'Telefono' => $user->Telefono,
                'Fecha_Nacimiento' => $user->Fecha_Nacimiento,
                'Fk_Sucursal' => $user->Fk_Sucursal,
                'ID_H_O_D' => $user->ID_H_O_D,
                'Estatus' => $user->Estatus,
                'ColorEstatus' => $user->ColorEstatus,
                'Permisos' => $user->Permisos,
                'Perm_Elim' => $user->Perm_Elim,
                'Perm_Edit' => $user->Perm_Edit,
                'role' => [
                    'ID_rol' => $user->ID_rol,
                    'Nombre_rol' => $user->Nombre_rol,
                    'Estado' => $user->Rol_Estado,
                    'Permisos' => $user->Rol_Permisos,
                    'created_at' => $user->Rol_created_at,
                    'updated_at' => $user->Rol_updated_at
                ],
                'sucursal' => [
                    'ID_SucursalC' => $user->ID_SucursalC,
                    'Nombre_Sucursal' => $user->Nombre_Sucursal,
                    'Direccion' => $user->Direccion,
                    'Telefono' => $user->Sucursal_Telefono,
                    'Correo' => $user->Sucursal_Correo,
                    'Sucursal_Activa' => $user->Sucursal_Activa,
                    'Latitud' => $user->Latitud,
                    'Longitud' => $user->Longitud
                ]
            ]
        ]);
    }
} 