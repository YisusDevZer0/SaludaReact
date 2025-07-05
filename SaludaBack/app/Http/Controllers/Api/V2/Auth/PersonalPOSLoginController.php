<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\PersonalPOS;
use Symfony\Component\HttpFoundation\Response;

class PersonalPOSLoginController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Buscar usuario en PersonalPOS usando Eloquent
        $user = PersonalPOS::where('Correo_Electronico', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->Password)) {
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

        // Genera el token Passport
        if (method_exists($user, 'createToken')) {
            $tokenResult = $user->createToken('PersonalPOSToken');
            $token = $tokenResult->accessToken;
        } else {
            return response()->json([
                'message' => 'No se pudo generar el token'
            ], 500);
        }

        // Obtener información del rol del usuario
        $userWithRole = DB::table('PersonalPOS as p')
            ->leftJoin('Roles_Puestos as r', 'p.Fk_Usuario', '=', 'r.ID_rol')
            ->where('p.Pos_ID', $user->Pos_ID)
            ->select([
                'p.Pos_ID',
                'p.Nombre_Apellidos',
                'p.Correo_Electronico',
                'p.avatar_url',
                'p.Telefono',
                'p.Fecha_Nacimiento',
                'p.Fk_Sucursal',
                'p.ID_H_O_D',
                'p.Estatus',
                'p.ColorEstatus',
                'p.Permisos',
                'p.Perm_Elim',
                'p.Perm_Edit',
                'r.ID_rol',
                'r.Nombre_rol',
                'r.Estado as role_estado',
                'r.Descripcion as role_descripcion'
            ])
            ->first();

        return response()->json([
            'access_token' => $token,
            'user' => [
                'Pos_ID' => $userWithRole->Pos_ID,
                'Nombre_Apellidos' => $userWithRole->Nombre_Apellidos,
                'Correo_Electronico' => $userWithRole->Correo_Electronico,
                'avatar_url' => $userWithRole->avatar_url,
                'Telefono' => $userWithRole->Telefono,
                'Fecha_Nacimiento' => $userWithRole->Fecha_Nacimiento,
                'Fk_Sucursal' => $userWithRole->Fk_Sucursal,
                'ID_H_O_D' => $userWithRole->ID_H_O_D,
                'Estatus' => $userWithRole->Estatus,
                'ColorEstatus' => $userWithRole->ColorEstatus,
                'Permisos' => $userWithRole->Permisos,
                'Perm_Elim' => $userWithRole->Perm_Elim,
                'Perm_Edit' => $userWithRole->Perm_Edit,
                'role' => [
                    'ID_rol' => $userWithRole->ID_rol,
                    'Nombre_rol' => $userWithRole->Nombre_rol,
                    'Estado' => $userWithRole->role_estado,
                    'Descripcion' => $userWithRole->role_descripcion
                ]
            ]
        ]);
    }
} 