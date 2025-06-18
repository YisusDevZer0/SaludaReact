<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermisosController extends Controller
{
    public function storeMasivo(Request $request)
    {
        $permisos = $request->all();
        $insertados = [];
        $errores = [];
        foreach ($permisos as $permiso) {
            try {
                $nuevo = [
                    'nombre' => $permiso['nombre'],
                    'descripcion' => $permiso['descripcion'] ?? null,
                    'activo' => $permiso['activo'] ?? true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                DB::table('Permisos')->insert($nuevo);
                $insertados[] = $permiso['nombre'];
            } catch (\Exception $e) {
                $errores[] = [
                    'permiso' => $permiso['nombre'],
                    'error' => $e->getMessage()
                ];
            }
        }
        return response()->json([
            'insertados' => $insertados,
            'errores' => $errores
        ]);
    }

    public function index()
    {
        return response()->json(
            \DB::table('Permisos')->where('activo', true)->get()
        );
    }
} 