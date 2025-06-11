<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
} 