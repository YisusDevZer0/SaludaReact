<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Especialidad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EspecialidadesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Especialidad::query();

            // Filtros
            if ($request->has('activa')) {
                $query->where('Activa', $request->boolean('activa'));
            }

            if ($request->has('hospital_id')) {
                $query->where('ID_H_O_D', $request->hospital_id);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where('Nombre_Especialidad', 'like', "%{$search}%");
            }

            // Ordenamiento
            $sortBy = $request->get('sort_by', 'Nombre_Especialidad');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('per_page', 15);
            $especialidades = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Especialidades obtenidas exitosamente',
                'data' => $especialidades->items(),
                'pagination' => [
                    'current_page' => $especialidades->currentPage(),
                    'last_page' => $especialidades->lastPage(),
                    'per_page' => $especialidades->perPage(),
                    'total' => $especialidades->total()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener especialidades: ' . $e->getMessage()
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
                'Nombre_Especialidad' => 'required|string|max:100|unique:especialidades,Nombre_Especialidad',
                'Descripcion' => 'nullable|string|max:500',
                'Color_Calendario' => 'nullable|string|max:7',
                'Activa' => 'boolean',
                'ID_H_O_D' => 'required|string|max:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $especialidad = new Especialidad();
            $especialidad->Nombre_Especialidad = $request->Nombre_Especialidad;
            $especialidad->Descripcion = $request->Descripcion;
            $especialidad->Color_Calendario = $request->Color_Calendario ?? '#3498db';
            $especialidad->Activa = $request->get('Activa', true);
            $especialidad->ID_H_O_D = $request->ID_H_O_D;
            $especialidad->Agregado_Por = Auth::id() ?? 'SISTEMA';
            $especialidad->Agregado_El = now();
            $especialidad->save();

            return response()->json([
                'success' => true,
                'message' => 'Especialidad creada exitosamente',
                'data' => $especialidad
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear especialidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $especialidad = Especialidad::with(['especialistas'])->find($id);

            if (!$especialidad) {
                return response()->json([
                    'success' => false,
                    'message' => 'Especialidad no encontrada'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Especialidad obtenida exitosamente',
                'data' => $especialidad
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener especialidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $especialidad = Especialidad::find($id);

            if (!$especialidad) {
                return response()->json([
                    'success' => false,
                    'message' => 'Especialidad no encontrada'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'Nombre_Especialidad' => 'sometimes|required|string|max:100|unique:especialidades,Nombre_Especialidad,' . $id . ',Especialidad_ID',
                'Descripcion' => 'nullable|string|max:500',
                'Color_Calendario' => 'nullable|string|max:7',
                'Activa' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $especialidad->fill($request->only([
                'Nombre_Especialidad',
                'Descripcion',
                'Color_Calendario',
                'Activa'
            ]));
            
            $especialidad->Modificado_Por = Auth::id() ?? 'SISTEMA';
            $especialidad->Modificado_El = now();
            $especialidad->save();

            return response()->json([
                'success' => true,
                'message' => 'Especialidad actualizada exitosamente',
                'data' => $especialidad
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar especialidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $especialidad = Especialidad::find($id);

            if (!$especialidad) {
                return response()->json([
                    'success' => false,
                    'message' => 'Especialidad no encontrada'
                ], 404);
            }

            // Verificar si tiene especialistas asociados
            if ($especialidad->especialistas()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar la especialidad porque tiene especialistas asociados'
                ], 422);
            }

            $especialidad->delete();

            return response()->json([
                'success' => true,
                'message' => 'Especialidad eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar especialidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener especialidades activas
     */
    public function activas(): JsonResponse
    {
        try {
            $especialidades = Especialidad::activas()
                ->orderBy('Nombre_Especialidad')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Especialidades activas obtenidas exitosamente',
                'data' => $especialidades
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener especialidades activas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de especialidades
     */
    public function estadisticas(): JsonResponse
    {
        try {
            $stats = DB::table('especialidades')
                ->selectRaw('
                    COUNT(*) as total_especialidades,
                    SUM(CASE WHEN Activa = 1 THEN 1 ELSE 0 END) as especialidades_activas,
                    SUM(CASE WHEN Activa = 0 THEN 1 ELSE 0 END) as especialidades_inactivas
                ')
                ->first();

            $especialidadesPorHospital = DB::table('especialidades')
                ->select('ID_H_O_D', DB::raw('COUNT(*) as total'))
                ->groupBy('ID_H_O_D')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => [
                    'resumen' => $stats,
                    'por_hospital' => $especialidadesPorHospital
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
