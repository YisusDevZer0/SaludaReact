<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sucursal;
use Yajra\DataTables\Facades\DataTables;

class SucursalController extends Controller
{
    public function index(Request $request)
    {
        if ($request->ajax() || $request->isMethod('get')) {
            $sucursales = Sucursal::select([
                'ID_SucursalC', 'Nombre_Sucursal', 'Direccion', 'Telefono', 'Correo', 'Sucursal_Activa', 'created_at'
            ]);
            
            $dataTablesResponse = DataTables::of($sucursales)->make(true);
            
            // Añadir headers CORS a la respuesta de DataTables
            return $dataTablesResponse
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Accept');
        }
        return response()->json(['error' => 'Solo peticiones AJAX'], 400);
    }

    // Obtener todas las sucursales activas para selects
    public function getAllActive()
    {
        try {
            $sucursales = Sucursal::where('Sucursal_Activa', true)
                ->select(['ID_SucursalC', 'Nombre_Sucursal', 'Direccion', 'Telefono', 'Correo'])
                ->orderBy('Nombre_Sucursal', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $sucursales,
                'count' => $sucursales->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener sucursales: ' . $e->getMessage()
            ], 500);
        }
    }
} 