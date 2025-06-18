<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class RolesPuestosController extends Controller
{
    public function index(Request $request)
    {
        $id_hod = $request->query('id_hod');
        Log::info('RolesPuestosController - id_hod recibido:', ['id_hod' => $id_hod]);

        // Buscar por nombre de organización en el campo ID_H_O_D (texto)
        $roles = DB::table('Roles_Puestos')
            ->select('ID_rol', 'Nombre_rol', 'ID_H_O_D', 'Agrego', 'Estado', 'AgregadoEn', 'Sistema', 'created_at', 'updated_at')
            ->where('ID_H_O_D', $id_hod)
            ->get();

        Log::info('Roles encontrados:', ['count' => $roles->count()]);

        return response()->json($roles);
    }

    public function store(Request $request)
    {
        try {
            Log::info('RolesPuestosController - Creando nuevo rol:', $request->all());

            // Validar los datos recibidos
            $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'id_hod' => 'required|string',
                'Sistema' => 'required|string|json'
            ]);

            // Insertar el nuevo rol
            $id_rol = DB::table('Roles_Puestos')->insertGetId([
                'Nombre_rol' => $request->nombre,
                'Descripcion' => $request->descripcion,
                'ID_H_O_D' => $request->id_hod,
                'Agrego' => Auth::user()->name ?? 'Sistema',
                'Estado' => $request->Estado ?? 'Vigente',
                'AgregadoEn' => Carbon::now(),
                'Sistema' => $request->Sistema,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);

            // Obtener el rol recién creado
            $rol = DB::table('Roles_Puestos')
                ->where('ID_rol', $id_rol)
                ->first();

            Log::info('Rol creado exitosamente:', ['id_rol' => $id_rol]);

            return response()->json([
                'message' => 'Rol creado exitosamente',
                'rol' => $rol
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al crear rol:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al crear el rol',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 