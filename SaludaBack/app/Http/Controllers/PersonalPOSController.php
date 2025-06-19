<?php

namespace App\Http\Controllers;

use App\Models\PersonalPOS;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Hash;

class PersonalPOSController extends Controller
{
    // Listar todo el personal
    public function index()
    {
        return PersonalPOS::all();
    }

    // Mostrar un registro específico
    public function show($id)
    {
        return PersonalPOS::findOrFail($id);
    }

    // Crear nuevo personal
    public function store(Request $request)
    {
        try {
            // Validar los datos recibidos
            $request->validate([
                'Nombre_Apellidos' => 'required|string|max:255',
                'Correo_Electronico' => 'required|email|unique:PersonalPOS,Correo_Electronico',
                'Password' => 'required|string|min:6',
                'Telefono' => 'required|string|max:20',
                'Fecha_Nacimiento' => 'required|date',
                'Fk_Usuario' => 'required|integer|exists:Roles_Puestos,ID_rol',
                'Fk_Sucursal' => 'required|integer|exists:Sucursales,ID_SucursalC',
                'Estatus' => 'string|in:Vigente,Baja',
                'ColorEstatus' => 'string',
                'ID_H_O_D' => 'required|string',
                'Perm_Elim' => 'boolean',
                'Perm_Edit' => 'boolean',
                'avatar_url' => 'nullable|string|url'
            ]);

            // Hash del password
            $passwordHash = Hash::make($request->Password);

            // Crear el personal
            $personal = PersonalPOS::create([
                'Nombre_Apellidos' => $request->Nombre_Apellidos,
                'Correo_Electronico' => $request->Correo_Electronico,
                'Password' => $passwordHash,
                'Telefono' => $request->Telefono,
                'Fecha_Nacimiento' => $request->Fecha_Nacimiento,
                'Fk_Usuario' => $request->Fk_Usuario,
                'Fk_Sucursal' => $request->Fk_Sucursal,
                'Estatus' => $request->Estatus ?? 'Vigente',
                'ColorEstatus' => $request->ColorEstatus ?? '#28a745',
                'ID_H_O_D' => $request->ID_H_O_D,
                'AgregadoPor' => $request->AgregadoPor ?? 'Sistema',
                'AgregadoEl' => now(),
                'Perm_Elim' => $request->Perm_Elim ?? false,
                'Perm_Edit' => $request->Perm_Edit ?? false,
                'avatar_url' => $request->avatar_url,
                'Permisos' => json_encode([
                    'crear' => true,
                    'editar' => $request->Perm_Edit ?? false,
                    'eliminar' => $request->Perm_Elim ?? false,
                    'ver' => true
                ])
            ]);

            // Obtener el personal creado con sus relaciones
            $personalConRelaciones = DB::table('PersonalPOS as p')
                ->leftJoin('Sucursales as s', 'p.Fk_Sucursal', '=', 's.ID_SucursalC')
                ->leftJoin('Roles_Puestos as r', 'p.Fk_Usuario', '=', 'r.ID_rol')
                ->where('p.Pos_ID', $personal->Pos_ID)
                ->select([
                    'p.Pos_ID',
                    'p.Nombre_Apellidos',
                    'p.Correo_Electronico',
                    'p.Telefono',
                    'p.Fecha_Nacimiento',
                    'p.Estatus',
                    'p.ColorEstatus',
                    'p.avatar_url',
                    'p.Fk_Sucursal',
                    's.Nombre_Sucursal',
                    'r.ID_rol',
                    'r.Nombre_rol',
                ])
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Personal creado exitosamente',
                'data' => $personalConRelaciones
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear personal: ' . $e->getMessage()
            ], 500);
        }
    }

    // Actualizar personal
    public function update(Request $request, $id)
    {
        $personal = PersonalPOS::findOrFail($id);
        $personal->update($request->all());
        return response()->json($personal, 200);
    }

    // Eliminar personal
    public function destroy($id)
    {
        PersonalPOS::destroy($id);
        return response()->json(null, 204);
    }

    // Contar personal activo
    public function countActive()
    {
        $count = PersonalPOS::where('Estatus', 'Vigente')->count();
        return response()->json(['active' => $count]);
    }

    // Listar personal con sucursal y rol
    public function listWithSucursalAndRol()
    {
        $personal = DB::table('PersonalPOS as p')
            ->leftJoin('Sucursales as s', 'p.Fk_Sucursal', '=', 's.ID_SucursalC')
            ->leftJoin('Roles_Puestos as r', 'p.Fk_Usuario', '=', 'r.ID_rol')
            ->select([
                'p.Pos_ID',
                'p.Nombre_Apellidos',
                'p.Correo_Electronico',
                'p.Telefono',
                'p.Fecha_Nacimiento',
                'p.Estatus',
                'p.ColorEstatus',
                'p.avatar_url',
                'p.Fk_Sucursal',
                's.Nombre_Sucursal',
                's.Direccion as Sucursal_Direccion',
                's.Telefono as Sucursal_Telefono',
                's.Correo as Sucursal_Correo',
                's.Sucursal_Activa',
                'r.ID_rol',
                'r.Nombre_rol',
                'r.Estado as Rol_Estado',
            ])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $personal,
            'count' => $personal->count()
        ]);
    }

    // Listado para DataTables (con join a sucursal y rol)
    public function indexDataTable(Request $request)
    {
        if ($request->ajax() || $request->isMethod('get')) {
            $personal = DB::table('PersonalPOS as p')
                ->leftJoin('Sucursales as s', 'p.Fk_Sucursal', '=', 's.ID_SucursalC')
                ->leftJoin('Roles_Puestos as r', 'p.Fk_Usuario', '=', 'r.ID_rol')
                ->select([
                    'p.Pos_ID',
                    'p.Nombre_Apellidos',
                    'p.Correo_Electronico',
                    'p.Telefono',
                    'p.Fecha_Nacimiento',
                    'p.Estatus',
                    'p.ColorEstatus',
                    'p.avatar_url',
                    'p.Fk_Sucursal',
                    's.Nombre_Sucursal',
                    's.Direccion as Sucursal_Direccion',
                    's.Telefono as Sucursal_Telefono',
                    's.Correo as Sucursal_Correo',
                    's.Sucursal_Activa',
                    'r.ID_rol',
                    'r.Nombre_rol',
                    'r.Estado as Rol_Estado',
                ]);

            $dataTablesResponse = DataTables::of($personal)->make(true);

            return $dataTablesResponse
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept');
        }
        return response()->json(['error' => 'Solo peticiones AJAX'], 400);
    }
} 