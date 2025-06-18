<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\SecondDatabaseModel;

class DualDatabaseController extends Controller
{
    /**
     * Ejemplo de uso de ambas conexiones de base de datos
     */
    public function index()
    {
        try {
            // Usar la conexión principal (mysql) - usuarios del sistema principal
            $usersFromPrimary = DB::connection('mysql')
                ->table('users')
                ->select('id', 'name', 'email')
                ->limit(5)
                ->get();

            // Usar la segunda conexión (mysql_second) - datos de huellas
            $huellasFromSecondary = DB::connection('mysql_second')
                ->table('huellas') // Cambia por el nombre real de tu tabla
                ->select('*')
                ->limit(5)
                ->get();

            // Usar modelos con diferentes conexiones
            $userModel = new User(); // Usa la conexión por defecto
            $usersFromModel = $userModel->limit(5)->get();

            $huellasModel = new SecondDatabaseModel(); // Usa mysql_second
            $huellasFromModel = $huellasModel->limit(5)->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'primary_database' => [
                        'users_from_query' => $usersFromPrimary,
                        'users_from_model' => $usersFromModel
                    ],
                    'secondary_database' => [
                        'huellas_from_query' => $huellasFromSecondary,
                        'huellas_from_model' => $huellasFromModel
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al conectar con las bases de datos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ejemplo de transacción en la base de datos secundaria
     */
    public function transactionExample()
    {
        try {
            DB::connection('mysql_second')->beginTransaction();

            // Realizar operaciones en la segunda base de datos (huellas)
            $result = DB::connection('mysql_second')
                ->table('huellas') // Cambia por el nombre real de tu tabla
                ->insert([
                    'id_usuario' => 1,
                    'huella_digital' => 'datos_huella_ejemplo',
                    'fecha_captura' => now(),
                    'estado' => 'activo',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

            // Si todo está bien, confirmar la transacción
            DB::connection('mysql_second')->commit();

            return response()->json([
                'success' => true,
                'message' => 'Huella registrada exitosamente en la transacción'
            ]);

        } catch (\Exception $e) {
            // Si hay error, revertir la transacción
            DB::connection('mysql_second')->rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error en la transacción: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ejemplo de consulta que combina datos de ambas bases de datos
     */
    public function combinedData()
    {
        try {
            // Obtener datos de la primera base de datos (usuarios del sistema)
            $primaryData = DB::connection('mysql')
                ->table('users')
                ->select('id', 'name', 'email')
                ->get();

            // Obtener datos de la segunda base de datos (huellas)
            $secondaryData = DB::connection('mysql_second')
                ->table('huellas') // Cambia por el nombre real de tu tabla
                ->select('*')
                ->get();

            // Combinar los datos (ejemplo)
            $combinedData = [
                'usuarios_count' => $primaryData->count(),
                'huellas_count' => $secondaryData->count(),
                'usuarios' => $primaryData,
                'huellas' => $secondaryData
            ];

            return response()->json([
                'success' => true,
                'data' => $combinedData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener datos combinados: ' . $e->getMessage()
            ], 500);
        }
    }
} 