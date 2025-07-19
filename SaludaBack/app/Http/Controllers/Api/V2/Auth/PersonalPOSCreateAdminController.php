<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\PersonalPos;
use App\Models\Role;
use Symfony\Component\HttpFoundation\Response;

class PersonalPosCreateAdminController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string|max:20|unique:personal_pos,codigo',
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'required|email|unique:personal_pos,email',
            'password' => 'required|string|min:6',
            'telefono' => 'nullable|string|max:20',
            'dni' => 'nullable|string|max:20|unique:personal_pos,dni',
            'fecha_nacimiento' => 'nullable|date',
            'genero' => 'nullable|in:masculino,femenino,otro',
            'direccion' => 'nullable|string',
            'ciudad' => 'nullable|string|max:50',
            'provincia' => 'nullable|string|max:50',
            'codigo_postal' => 'nullable|string|max:10',
            'pais' => 'nullable|string|max:50',
            'sucursal_id' => 'nullable|exists:sucursales,id',
            'role_id' => 'nullable|exists:roles,id',
            'fecha_ingreso' => 'nullable|date',
            'salario' => 'nullable|numeric',
            'tipo_contrato' => 'nullable|string|max:50',
            'notas' => 'nullable|string'
        ]);

        // Verificar si ya existe un administrador
        $adminExists = PersonalPos::where('can_manage_users', true)->exists();
        
        if ($adminExists && !$request->has('force_create')) {
            return response()->json([
                'message' => 'Ya existe un administrador en el sistema'
            ], Response::HTTP_CONFLICT);
        }

        // Crear o obtener rol de administrador
        $adminRole = Role::where('nombre', 'Administrador')->first();
        if (!$adminRole) {
            $adminRole = Role::create([
                'nombre' => 'Administrador',
                'descripcion' => 'Rol con todos los permisos del sistema',
                'estado' => 'activo',
                'nivel_acceso' => 10,
                'permisos' => [
                    'can_login',
                    'can_sell',
                    'can_refund',
                    'can_manage_inventory',
                    'can_manage_users',
                    'can_view_reports',
                    'can_manage_settings'
                ],
                'codigo' => 'ADMIN',
                'tipo_rol' => 'sistema'
            ]);
        }

        // Crear el usuario administrador
        $admin = PersonalPos::create([
            'codigo' => $request->codigo,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telefono' => $request->telefono,
            'dni' => $request->dni,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'genero' => $request->genero,
            'direccion' => $request->direccion,
            'ciudad' => $request->ciudad,
            'provincia' => $request->provincia,
            'codigo_postal' => $request->codigo_postal,
            'pais' => $request->pais ?? 'Argentina',
            'sucursal_id' => $request->sucursal_id,
            'role_id' => $adminRole->id,
            'fecha_ingreso' => $request->fecha_ingreso ?? now(),
            'estado_laboral' => 'activo',
            'salario' => $request->salario,
            'tipo_contrato' => $request->tipo_contrato,
            'is_active' => true,
            'can_login' => true,
            'can_sell' => true,
            'can_refund' => true,
            'can_manage_inventory' => true,
            'can_manage_users' => true,
            'can_view_reports' => true,
            'can_manage_settings' => true,
            'session_timeout' => 480, // 8 horas
            'notas' => $request->notas ?? 'Administrador creado por sistema'
        ]);

        return response()->json([
            'message' => 'Administrador creado exitosamente',
            'admin' => [
                'id' => $admin->id,
                'codigo' => $admin->codigo,
                'nombre_completo' => $admin->nombre_completo,
                'email' => $admin->email,
                'role' => [
                    'id' => $adminRole->id,
                    'nombre' => $adminRole->nombre,
                    'descripcion' => $adminRole->descripcion
                ]
            ]
        ], Response::HTTP_CREATED);
    }
} 