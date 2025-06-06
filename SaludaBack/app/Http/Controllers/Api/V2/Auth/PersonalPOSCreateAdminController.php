<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class PersonalPOSCreateAdminController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'nombre_apellidos' => 'required|string|max:255',
            'email' => 'required|email|unique:PersonalPOS,Correo_Electronico',
            'password' => 'required|min:8|confirmed',
            'telefono' => 'required|string|max:20',
            'fecha_nacimiento' => 'required|date',
            'fk_sucursal' => 'required|integer',
            'id_h_o_d' => 'required|string'
        ]);

        // Verificar si ya existe un rol de administrador
        $rolAdmin = DB::table('Roles_Puestos')
            ->where('Nombre_rol', 'Administrador')
            ->where('Estado', 'Activo')
            ->first();

        if (!$rolAdmin) {
            // Crear rol de administrador si no existe
            $rolAdminId = DB::table('Roles_Puestos')->insertGetId([
                'Nombre_rol' => 'Administrador',
                'Estado' => 'Vigente',
                'Sistema' => json_encode([
                    'dashboard' => true,
                    'usuarios' => true,
                    'roles' => true,
                    'configuracion' => true
                ]),
                'ID_H_O_D' => $request->id_h_o_d,
                'Agrego' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        } else {
            $rolAdminId = $rolAdmin->ID_rol;
        }

        // Crear el usuario administrador
        $userId = DB::table('PersonalPOS')->insertGetId([
            'Nombre_Apellidos' => $request->nombre_apellidos,
            'Correo_Electronico' => $request->email,
            'Password' => Hash::make($request->password),
            'Telefono' => $request->telefono,
            'Fecha_Nacimiento' => $request->fecha_nacimiento,
            'Fk_Usuario' => $rolAdminId,
            'Fk_Sucursal' => $request->fk_sucursal,
            'ID_H_O_D' => $request->id_h_o_d,
            'Estatus' => 'Vigente',
            'ColorEstatus' => '#28a745',
            'Permisos' => json_encode([
                'crear' => true,
                'editar' => true,
                'eliminar' => true,
                'ver' => true
            ]),
            'Perm_Elim' => true,
            'Perm_Edit' => true,
            'AgregadoPor' => 'Sistema',
            'AgregadoEl' => now(),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Obtener el usuario creado
        $user = DB::table('PersonalPOS')
            ->where('Pos_ID', $userId)
            ->first();

        // Obtener el rol
        $rol = DB::table('Roles_Puestos')
            ->where('ID_rol', $rolAdminId)
            ->first();

        return response()->json([
            'message' => 'Usuario administrador creado exitosamente',
            'user' => [
                'Pos_ID' => $user->Pos_ID,
                'Nombre_Apellidos' => $user->Nombre_Apellidos,
                'Correo_Electronico' => $user->Correo_Electronico,
                'Fk_Usuario' => $user->Fk_Usuario,
                'Estatus' => $user->Estatus,
                'Permisos' => $user->Permisos,
                'role' => [
                    'ID_rol' => $rol->ID_rol,
                    'Nombre_rol' => $rol->Nombre_rol,
                    'Permisos' => $rol->Sistema
                ]
            ]
        ], Response::HTTP_CREATED);
    }
} 