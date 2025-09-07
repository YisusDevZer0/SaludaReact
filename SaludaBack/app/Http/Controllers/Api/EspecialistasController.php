<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Especialista;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EspecialistasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Especialista::with(['especialidad']);

            // Filtros
            if ($request->has('activo')) {
                $query->where('Activo', $request->boolean('activo'));
            }

            if ($request->has('especialidad_id')) {
                $query->where('Fk_Especialidad', $request->especialidad_id);
            }

            if ($request->has('hospital_id')) {
                $query->where('ID_H_O_D', $request->hospital_id);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where('Nombre_Completo', 'like', "%{$search}%");
            }

            // Ordenamiento
            $sortBy = $request->get('sort_by', 'Nombre_Completo');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('per_page', 15);
            $especialistas = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Especialistas obtenidos exitosamente',
                'data' => $especialistas->items(),
                'pagination' => [
                    'current_page' => $especialistas->currentPage(),
                    'last_page' => $especialistas->lastPage(),
                    'per_page' => $especialistas->perPage(),
                    'total' => $especialistas->total()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener especialistas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'Nombre_Completo' => 'required|string|max:200',
                'Cedula_Profesional' => 'required|string|max:50|unique:especialistas,Cedula_Profesional',
                'Email' => 'required|email|max:100|unique:especialistas,Email',
                'Telefono' => 'required|string|max:20',
                'Fk_Especialidad' => 'required|exists:especialidades,Especialidad_ID',
                'Activo' => 'boolean',
                'ID_H_O_D' => 'required|string|max:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $especialista = new Especialista();
            $especialista->Nombre_Completo = $request->Nombre_Completo;
            $especialista->Cedula_Profesional = $request->Cedula_Profesional;
            $especialista->Email = $request->Email;
            $especialista->Telefono = $request->Telefono;
            $especialista->Fk_Especialidad = $request->Fk_Especialidad;
            $especialista->Activo = $request->get('Activo', true);
            $especialista->ID_H_O_D = $request->ID_H_O_D;
            $especialista->Agregado_Por = Auth::id() ?? 'SISTEMA';
            $especialista->Agregado_El = now();
            $especialista->save();

            // Cargar la relación
            $especialista->load('especialidad');

            return response()->json([
                'success' => true,
                'message' => 'Especialista creado exitosamente',
                'data' => $especialista
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear especialista: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $especialista = Especialista::with(['especialidad', 'citas'])->find($id);

            if (!$especialista) {
                return response()->json([
                    'success' => false,
                    'message' => 'Especialista no encontrado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Especialista obtenido exitosamente',
                'data' => $especialista
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener especialista: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $especialista = Especialista::find($id);

            if (!$especialista) {
                return response()->json([
                    'success' => false,
                    'message' => 'Especialista no encontrado'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'Nombre_Completo' => 'sometimes|required|string|max:200',
                'Cedula_Profesional' => 'sometimes|required|string|max:50|unique:especialistas,Cedula_Profesional,' . $id . ',Especialista_ID',
                'Email' => 'sometimes|required|email|max:100|unique:especialistas,Email,' . $id . ',Especialista_ID',
                'Telefono' => 'sometimes|required|string|max:20',
                'Fk_Especialidad' => 'sometimes|required|exists:especialidades,Especialidad_ID',
                'Activo' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $especialista->fill($request->only([
                'Nombre_Completo',
                'Cedula_Profesional',
                'Email',
                'Telefono',
                'Fk_Especialidad',
                'Activo'
            ]));
            
            $especialista->Modificado_Por = Auth::id() ?? 'SISTEMA';
            $especialista->Modificado_El = now();
            $especialista->save();

            // Cargar la relación
            $especialista->load('especialidad');

            return response()->json([
                'success' => true,
                'message' => 'Especialista actualizado exitosamente',
                'data' => $especialista
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar especialista: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $especialista = Especialista::find($id);

            if (!$especialista) {
                return response()->json([
                    'success' => false,
                    'message' => 'Especialista no encontrado'
                ], 404);
            }

            // Verificar si tiene citas asociadas
            if ($especialista->citas()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el especialista porque tiene citas asociadas'
                ], 422);
            }

            $especialista->delete();

            return response()->json([
                'success' => true,
                'message' => 'Especialista eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar especialista: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener especialistas activos
     */
    public function activos(): JsonResponse
    {
        try {
            $especialistas = Especialista::activos()
                ->with('especialidad')
                ->orderBy('Nombre_Completo')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Especialistas activos obtenidos exitosamente',
                'data' => $especialistas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener especialistas activos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener especialistas por especialidad
     */
    public function porEspecialidad(string $especialidadId): JsonResponse
    {
        try {
            $especialistas = Especialista::porEspecialidad($especialidadId)
                ->activos()
                ->with('especialidad')
                ->orderBy('Nombre_Completo')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Especialistas por especialidad obtenidos exitosamente',
                'data' => $especialistas
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener especialistas por especialidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de especialistas
     */
    public function estadisticas(): JsonResponse
    {
        try {
            $stats = DB::table('especialistas')
                ->selectRaw('
                    COUNT(*) as total_especialistas,
                    SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) as especialistas_activos,
                    SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) as especialistas_inactivos
                ')
                ->first();

            $especialistasPorEspecialidad = DB::table('especialistas as e')
                ->join('especialidades as esp', 'e.Fk_Especialidad', '=', 'esp.Especialidad_ID')
                ->select('esp.Nombre_Especialidad', DB::raw('COUNT(*) as total'))
                ->groupBy('esp.Especialidad_ID', 'esp.Nombre_Especialidad')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => [
                    'resumen' => $stats,
                    'por_especialidad' => $especialistasPorEspecialidad
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }
}
