<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestCitasController extends Controller
{
    /**
     * Test endpoint para verificar que las rutas de citas funcionen
     */
    public function test(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Test endpoint de citas funcionando correctamente',
            'timestamp' => now()->toISOString(),
            'data' => [
                'test' => 'OK',
                'cors' => 'Enabled',
                'routes' => 'Working',
                'endpoint' => '/api/citas'
            ]
        ]);
    }

    /**
     * Obtener citas con filtros (sin autenticación para pruebas)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Agenda::with(['paciente', 'doctor', 'sucursal']);

            // Filtros
            if ($request->has('fecha')) {
                $query->whereDate('Fecha_Cita', $request->fecha);
            }

            if ($request->has('estado')) {
                $query->where('Estado_Cita', $request->estado);
            }

            if ($request->has('doctor_id')) {
                $query->where('Fk_Doctor', $request->doctor_id);
            }

            if ($request->has('paciente_id')) {
                $query->where('Fk_Paciente', $request->paciente_id);
            }

            if ($request->has('id_hod')) {
                $query->where('ID_H_O_D', $request->id_hod);
            }

            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->whereBetween('Fecha_Cita', [$request->fecha_inicio, $request->fecha_fin]);
            }

            $citas = $query->orderBy('Fecha_Cita', 'desc')
                          ->orderBy('Hora_Inicio', 'asc')
                          ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $citas,
                'message' => 'Citas obtenidas exitosamente (ruta de prueba)'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las citas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de citas (sin autenticación para pruebas)
     */
    public function estadisticas(Request $request): JsonResponse
    {
        try {
            $query = Agenda::query();

            if ($request->has('id_hod')) {
                $query->where('ID_H_O_D', $request->id_hod);
            }

            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->whereBetween('Fecha_Cita', [$request->fecha_inicio, $request->fecha_fin]);
            }

            $totalCitas = $query->count();
            $citasHoy = $query->whereDate('Fecha_Cita', today())->count();
            $citasPendientes = $query->where('Estado_Cita', 'Pendiente')->count();
            $citasCompletadas = $query->where('Estado_Cita', 'Completada')->count();
            $citasCanceladas = $query->where('Estado_Cita', 'Cancelada')->count();

            $estadisticas = [
                'total_citas' => $totalCitas,
                'citas_hoy' => $citasHoy,
                'citas_pendientes' => $citasPendientes,
                'citas_completadas' => $citasCompletadas,
                'citas_canceladas' => $citasCanceladas,
                'porcentaje_completadas' => $totalCitas > 0 ? round(($citasCompletadas / $totalCitas) * 100, 2) : 0,
                'porcentaje_canceladas' => $totalCitas > 0 ? round(($citasCanceladas / $totalCitas) * 100, 2) : 0
            ];

            return response()->json([
                'success' => true,
                'data' => $estadisticas,
                'message' => 'Estadísticas obtenidas exitosamente (ruta de prueba)'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener citas de hoy (sin autenticación para pruebas)
     */
    public function hoy(Request $request): JsonResponse
    {
        try {
            $query = Agenda::with(['paciente', 'doctor', 'sucursal'])
                          ->whereDate('Fecha_Cita', today());

            if ($request->has('id_hod')) {
                $query->where('ID_H_O_D', $request->id_hod);
            }

            $citas = $query->orderBy('Hora_Inicio', 'asc')->get();

            return response()->json([
                'success' => true,
                'data' => $citas,
                'message' => 'Citas de hoy obtenidas exitosamente (ruta de prueba)'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las citas de hoy: ' . $e->getMessage()
            ], 500);
        }
    }
}
