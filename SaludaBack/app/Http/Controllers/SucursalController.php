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
} 