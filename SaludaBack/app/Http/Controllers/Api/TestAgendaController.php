<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CitaMejorada;
use App\Models\Especialista;
use App\Models\PacienteMejorado;
use App\Models\SucursalMejorada;
use App\Models\ConsultorioMejorado;
use App\Models\Especialidad;
use Illuminate\Support\Facades\DB;

class TestAgendaController extends Controller
{
    public function test()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'TestAgendaController funcionando correctamente',
            'timestamp' => now()->toISOString()
        ]);
    }

    public function testCors()
    {
        return response()->json([
            'status' => 'success',
            'message' => 'CORS funcionando correctamente',
            'timestamp' => now()->toISOString()
        ]);
    }

    public function getCitas(Request $request)
    {
        try {
            $query = DB::table('citas_mejoradas');

            // Aplicar filtros
            if ($request->filled('fecha')) {
                // Log para debug
                \Log::info('Filtro de fecha aplicado:', [
                    'fecha_solicitada' => $request->fecha,
                    'fecha_formateada' => date('Y-m-d', strtotime($request->fecha))
                ]);
                
                // Convertir la fecha a formato Y-m-d y usar whereDate
                $fechaFiltro = date('Y-m-d', strtotime($request->fecha));
                $query->whereDate('Fecha_Cita', '=', $fechaFiltro);
                
                // Log adicional para debug
                \Log::info('Query SQL generada:', [
                    'fecha_filtro' => $fechaFiltro,
                    'sql' => $query->toSql(),
                    'bindings' => $query->getBindings()
                ]);
            }

            if ($request->filled('especialista')) {
                $query->where('Fk_Especialista', $request->especialista);
            }

            if ($request->filled('sucursal')) {
                $query->where('Fk_Sucursal', $request->sucursal);
            }

            if ($request->filled('estado')) {
                $query->where('Estado_Cita', $request->estado);
            }

            // Aplicar filtro de especialidad (necesita join con especialistas)
            if ($request->filled('especialidad')) {
                $query->join('especialistas', 'citas_mejoradas.Fk_Especialista', '=', 'especialistas.Especialista_ID')
                      ->where('especialistas.Fk_Especialidad', $request->especialidad)
                      ->select('citas_mejoradas.*');
            }

            // Aplicar paginación
            $perPage = $request->get('per_page', 15);
            $page = $request->get('page', 1);
            
            $citas = $query->paginate($perPage, ['*'], 'page', $page);

            // Log para debug de los resultados
            \Log::info('Resultados de la consulta:', [
                'filtros_aplicados' => [
                    'fecha' => $request->get('fecha'),
                    'especialista' => $request->get('especialista'),
                    'sucursal' => $request->get('sucursal'),
                    'estado' => $request->get('estado'),
                    'especialidad' => $request->get('especialidad')
                ],
                'total_citas' => $citas->total(),
                'citas_devueltas' => $citas->count(),
                'primeras_citas' => $citas->items() ? array_slice($citas->items(), 0, 3) : []
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $citas->items(),
                'count' => $citas->count(),
                'total' => $citas->total(),
                'current_page' => $citas->currentPage(),
                'last_page' => $citas->lastPage(),
                'per_page' => $citas->perPage(),
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener citas: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    public function getEspecialistas()
    {
        try {
            $especialistas = DB::table('especialistas')->get();

            return response()->json([
                'status' => 'success',
                'data' => $especialistas,
                'count' => $especialistas->count(),
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener especialistas: ' . $e->getMessage(),
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    public function getPacientes()
    {
        try {
            $pacientes = DB::table('pacientes_mejorados')->get();

            return response()->json([
                'status' => 'success',
                'data' => $pacientes,
                'count' => $pacientes->count(),
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener pacientes: ' . $e->getMessage(),
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    public function getSucursales()
    {
        try {
            // Usar el modelo Eloquent en lugar de consultas directas
            $sucursales = \App\Models\SucursalMejorada::select([
                'Sucursal_ID',
                'Nombre_Sucursal',
                'Direccion',
                'Telefono',
                'Email',
                'Activa',
                'ID_H_O_D'
            ])
            ->where('Activa', true) // Solo sucursales activas
            ->orderBy('Nombre_Sucursal')
            ->get();

            return response()->json([
                'status' => 'success',
                'data' => $sucursales,
                'count' => $sucursales->count(),
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al obtener sucursales', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener sucursales: ' . $e->getMessage(),
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    public function getConsultorios()
    {
        try {
            // Usar el modelo Eloquent en lugar de consultas directas
            $consultorios = \App\Models\ConsultorioMejorado::select([
                'Consultorio_ID',
                'Nombre_Consultorio',
                'Descripcion',
                'Capacidad',
                'Fk_Sucursal',
                'Estado',
                'ID_H_O_D'
            ])
            ->where('Estado', 'Activo') // Solo consultorios activos
            ->orderBy('Nombre_Consultorio')
            ->get();

            return response()->json([
                'status' => 'success',
                'data' => $consultorios,
                'count' => $consultorios->count(),
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al obtener consultorios', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener consultorios: ' . $e->getMessage(),
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }
}
