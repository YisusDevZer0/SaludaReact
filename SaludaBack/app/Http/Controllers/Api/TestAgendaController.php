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
            $query = DB::table('citas_mejoradas')
                ->join('pacientes_mejorados', 'citas_mejoradas.Fk_Paciente', '=', 'pacientes_mejorados.Paciente_ID')
                ->join('especialistas', 'citas_mejoradas.Fk_Especialista', '=', 'especialistas.Especialista_ID')
                ->select(
                    'citas_mejoradas.*',
                    'pacientes_mejorados.Nombre as Nombre_Paciente',
                    'pacientes_mejorados.Apellido as Apellido_Paciente',
                    'pacientes_mejorados.Telefono as Telefono_Paciente',
                    'especialistas.Nombre_Completo as Nombre_Especialista'
                );

            // Filtro por fecha
            if ($request->filled('fecha')) {
                $fechaFiltro = date('Y-m-d', strtotime($request->fecha));
                $query->whereDate('citas_mejoradas.Fecha_Cita', '=', $fechaFiltro);
            }

            // Filtro por especialista
            if ($request->filled('especialista')) {
                $query->where('citas_mejoradas.Fk_Especialista', $request->especialista);
            }

            // Filtro por sucursal
            if ($request->filled('sucursal')) {
                $query->where('citas_mejoradas.Fk_Sucursal', $request->sucursal);
            }

            // Filtro por estado
            if ($request->filled('estado')) {
                $query->where('citas_mejoradas.Estado_Cita', $request->estado);
            }

            // Filtro por especialidad
            if ($request->filled('especialidad')) {
                $query->where('especialistas.Fk_Especialidad', $request->especialidad);
            }

            // Filtro por nombre del paciente (BÚSQUEDA)
            if ($request->filled('busqueda')) {
                $query->where(function($q) use ($request) {
                    $q->where('pacientes_mejorados.Nombre', 'LIKE', '%' . $request->busqueda . '%')
                      ->orWhere('pacientes_mejorados.Apellido', 'LIKE', '%' . $request->busqueda . '%')
                      ->orWhereRaw("CONCAT(pacientes_mejorados.Nombre, ' ', pacientes_mejorados.Apellido) LIKE ?", ['%' . $request->busqueda . '%']);
                });
            }

            // Ordenar por fecha y hora de la cita
            $query->orderBy('citas_mejoradas.Fecha_Cita', 'DESC')
                  ->orderBy('citas_mejoradas.Hora_Inicio', 'ASC');

            // Paginación
            $perPage = $request->get('per_page', 15);
            $page = $request->get('page', 1);
            $citas = $query->paginate($perPage, ['*'], 'page', $page);

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
            \Log::error('Error al obtener citas', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener citas: ' . $e->getMessage(),
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
