<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\SecondDatabaseModel;

class HuellasController extends Controller
{
    /**
     * Obtener todas las huellas
     */
    public function index()
    {
        try {
            $huellas = DB::connection('mysql_second')
                ->table('huellas')
                ->select('*')
                ->orderBy('fecha_captura', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $huellas,
                'count' => $huellas->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener huellas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener huella por ID
     */
    public function show($id)
    {
        try {
            $huella = DB::connection('mysql_second')
                ->table('huellas')
                ->where('id', $id)
                ->first();

            if (!$huella) {
                return response()->json([
                    'success' => false,
                    'message' => 'Huella no encontrada'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $huella
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener huella: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Registrar nueva huella
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'id_usuario' => 'required|integer',
                'huella_digital' => 'required|string',
                'estado' => 'string|in:activo,inactivo'
            ]);

            DB::connection('mysql_second')->beginTransaction();

            $huellaId = DB::connection('mysql_second')
                ->table('huellas')
                ->insertGetId([
                    'id_usuario' => $request->id_usuario,
                    'huella_digital' => $request->huella_digital,
                    'fecha_captura' => now(),
                    'estado' => $request->estado ?? 'activo',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

            DB::connection('mysql_second')->commit();

            return response()->json([
                'success' => true,
                'message' => 'Huella registrada exitosamente',
                'data' => [
                    'id' => $huellaId,
                    'id_usuario' => $request->id_usuario,
                    'fecha_captura' => now()
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::connection('mysql_second')->rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar huella: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar huella
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'huella_digital' => 'string',
                'estado' => 'string|in:activo,inactivo'
            ]);

            DB::connection('mysql_second')->beginTransaction();

            $updated = DB::connection('mysql_second')
                ->table('huellas')
                ->where('id', $id)
                ->update([
                    'huella_digital' => $request->huella_digital,
                    'estado' => $request->estado,
                    'updated_at' => now()
                ]);

            if (!$updated) {
                DB::connection('mysql_second')->rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Huella no encontrada'
                ], 404);
            }

            DB::connection('mysql_second')->commit();

            return response()->json([
                'success' => true,
                'message' => 'Huella actualizada exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::connection('mysql_second')->rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar huella: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar huella
     */
    public function destroy($id)
    {
        try {
            DB::connection('mysql_second')->beginTransaction();

            $deleted = DB::connection('mysql_second')
                ->table('huellas')
                ->where('id', $id)
                ->delete();

            if (!$deleted) {
                DB::connection('mysql_second')->rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Huella no encontrada'
                ], 404);
            }

            DB::connection('mysql_second')->commit();

            return response()->json([
                'success' => true,
                'message' => 'Huella eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::connection('mysql_second')->rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar huella: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener huellas por usuario
     */
    public function getByUser($userId)
    {
        try {
            $huellas = DB::connection('mysql_second')
                ->table('huellas')
                ->where('id_usuario', $userId)
                ->orderBy('fecha_captura', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $huellas,
                'count' => $huellas->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener huellas del usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar conexión a la base de datos de huellas
     */
    public function testConnection()
    {
        try {
            $result = DB::connection('mysql_second')->select('SELECT 1 as test');
            
            return response()->json([
                'success' => true,
                'message' => 'Conexión exitosa a la base de datos de huellas',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de conexión: ' . $e->getMessage()
            ], 500);
        }
    }
} 