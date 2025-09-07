<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestCorsController extends Controller
{
    /**
     * Test endpoint para verificar CORS
     */
    public function testCors(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'CORS test endpoint funcionando correctamente',
            'timestamp' => now()->toISOString(),
            'origin' => $request->header('Origin'),
            'method' => $request->method(),
            'headers' => $request->headers->all()
        ]);
    }

    /**
     * Test endpoint para verificar especialidades sin autenticación
     */
    public function testEspecialidades(): JsonResponse
    {
        try {
            $especialidades = \App\Models\Especialidad::all();
            return response()->json([
                'success' => true,
                'message' => 'Especialidades obtenidas correctamente',
                'data' => $especialidades,
                'count' => $especialidades->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener especialidades: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test endpoint para verificar especialistas sin autenticación
     */
    public function testEspecialistas(): JsonResponse
    {
        try {
            $especialistas = \App\Models\Especialista::all();
            return response()->json([
                'success' => true,
                'message' => 'Especialistas obtenidos correctamente',
                'data' => $especialistas,
                'count' => $especialistas->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener especialistas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test endpoint para verificar sucursales sin autenticación
     */
    public function testSucursales(): JsonResponse
    {
        try {
            $sucursales = \App\Models\SucursalMejorada::all();
            return response()->json([
                'success' => true,
                'message' => 'Sucursales obtenidas correctamente',
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

    /**
     * Test endpoint para verificar citas sin autenticación
     */
    public function testCitas(): JsonResponse
    {
        try {
            $citas = \App\Models\CitaMejorada::all();
            return response()->json([
                'success' => true,
                'message' => 'Citas obtenidas correctamente',
                'data' => $citas,
                'count' => $citas->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener citas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test endpoint para verificar pacientes sin autenticación
     */
    public function testPacientes(): JsonResponse
    {
        try {
            $pacientes = \App\Models\PacienteMejorado::all();
            return response()->json([
                'success' => true,
                'message' => 'Pacientes obtenidos correctamente',
                'data' => $pacientes,
                'count' => $pacientes->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener pacientes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test endpoint para verificar consultorios sin autenticación
     */
    public function testConsultorios(): JsonResponse
    {
        try {
            $consultorios = \App\Models\ConsultorioMejorado::all();
            return response()->json([
                'success' => true,
                'message' => 'Consultorios obtenidos correctamente',
                'data' => $consultorios,
                'count' => $consultorios->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener consultorios: ' . $e->getMessage()
            ], 500);
        }
    }
}
