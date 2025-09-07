<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SucursalMejorada;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SucursalesMejoradasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = SucursalMejorada::query();

            // Filtros
            if ($request->has('activa')) {
                $query->where('Activa', $request->boolean('activa'));
            }

            if ($request->has('hospital_id')) {
                $query->where('ID_H_O_D', $request->hospital_id);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where('Nombre_Sucursal', 'like', "%{$search}%");
            }

            // Ordenamiento
            $sortBy = $request->get('sort_by', 'Nombre_Sucursal');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('per_page', 15);
            $sucursales = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Sucursales obtenidas exitosamente',
                'data' => $sucursales->items(),
                'pagination' => [
                    'current_page' => $sucursales->currentPage(),
                    'last_page' => $sucursales->lastPage(),
                    'per_page' => $sucursales->perPage(),
                    'total' => $sucursales->total()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener sucursales: ' . $e->getMessage()
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
                'Nombre_Sucursal' => 'required|string|max:200|unique:sucursales_mejoradas,Nombre_Sucursal',
                'Direccion' => 'required|string|max:500',
                'Telefono' => 'required|string|max:20',
                'Email' => 'required|email|max:100',
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

            $sucursal = new SucursalMejorada();
            $sucursal->Nombre_Sucursal = $request->Nombre_Sucursal;
            $sucursal->Direccion = $request->Direccion;
            $sucursal->Telefono = $request->Telefono;
            $sucursal->Email = $request->Email;
            $sucursal->Activa = $request->get('Activa', true);
            $sucursal->ID_H_O_D = $request->ID_H_O_D;
            $sucursal->Agregado_Por = Auth::id() ?? 'SISTEMA';
            $sucursal->Agregado_El = now();
            $sucursal->save();

            return response()->json([
                'success' => true,
                'message' => 'Sucursal creada exitosamente',
                'data' => $sucursal
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $sucursal = SucursalMejorada::with(['consultorios', 'citas'])->find($id);

            if (!$sucursal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sucursal no encontrada'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Sucursal obtenida exitosamente',
                'data' => $sucursal
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $sucursal = SucursalMejorada::find($id);

            if (!$sucursal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sucursal no encontrada'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'Nombre_Sucursal' => 'sometimes|required|string|max:200|unique:sucursales_mejoradas,Nombre_Sucursal,' . $id . ',Sucursal_ID',
                'Direccion' => 'sometimes|required|string|max:500',
                'Telefono' => 'sometimes|required|string|max:20',
                'Email' => 'sometimes|required|email|max:100',
                'Activa' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $sucursal->fill($request->only([
                'Nombre_Sucursal',
                'Direccion',
                'Telefono',
                'Email',
                'Activa'
            ]));
            
            $sucursal->Modificado_Por = Auth::id() ?? 'SISTEMA';
            $sucursal->Modificado_El = now();
            $sucursal->save();

            return response()->json([
                'success' => true,
                'message' => 'Sucursal actualizada exitosamente',
                'data' => $sucursal
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $sucursal = SucursalMejorada::find($id);

            if (!$sucursal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sucursal no encontrada'
                ], 404);
            }

            // Verificar si tiene consultorios asociados
            if ($sucursal->consultorios()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar la sucursal porque tiene consultorios asociados'
                ], 422);
            }

            // Verificar si tiene citas asociadas
            if ($sucursal->citas()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar la sucursal porque tiene citas asociadas'
                ], 422);
            }

            $sucursal->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sucursal eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar sucursal: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener sucursales activas
     */
    public function activas(): JsonResponse
    {
        try {
            $sucursales = SucursalMejorada::activas()
                ->orderBy('Nombre_Sucursal')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Sucursales activas obtenidas exitosamente',
                'data' => $sucursales
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener sucursales activas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de sucursales
     */
    public function estadisticas(): JsonResponse
    {
        try {
            $stats = DB::table('sucursales_mejoradas')
                ->selectRaw('
                    COUNT(*) as total_sucursales,
                    SUM(CASE WHEN Activa = 1 THEN 1 ELSE 0 END) as sucursales_activas,
                    SUM(CASE WHEN Activa = 0 THEN 1 ELSE 0 END) as sucursales_inactivas
                ')
                ->first();

            $sucursalesPorHospital = DB::table('sucursales_mejoradas')
                ->select('ID_H_O_D', DB::raw('COUNT(*) as total'))
                ->groupBy('ID_H_O_D')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => [
                    'resumen' => $stats,
                    'por_hospital' => $sucursalesPorHospital
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
