<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Presentacion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PresentacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $draw = request()->get('draw');
            $start = request()->get("start");
            $rowperpage = request()->get("length");

            $columnIndex_arr = request()->get('order');
            $columnName_arr = request()->get('columns');
            $order_arr = request()->get('order');
            $search_arr = request()->get('search');

            $columnIndex = isset($columnIndex_arr[0]['column']) ? $columnIndex_arr[0]['column'] : 1;
            $columnName = isset($columnName_arr[$columnIndex]['data']) ? $columnName_arr[$columnIndex]['data'] : 'nombre';
            $columnSortOrder = isset($order_arr[0]['dir']) ? $order_arr[0]['dir'] : 'asc';
            $searchValue = $search_arr['value'] ?? '';

            // Total de registros
            $totalRecords = Presentacion::count();
            $totalRecordswithFilter = Presentacion::where('nombre', 'like', '%' . $searchValue . '%')
                ->orWhere('codigo', 'like', '%' . $searchValue . '%')
                ->orWhere('abreviatura', 'like', '%' . $searchValue . '%')
                ->orWhere('descripcion', 'like', '%' . $searchValue . '%')
                ->count();

            // Obtener registros
            $records = Presentacion::orderBy($columnName, $columnSortOrder)
                ->where(function($query) use ($searchValue) {
                    $query->where('nombre', 'like', '%' . $searchValue . '%')
                        ->orWhere('codigo', 'like', '%' . $searchValue . '%')
                        ->orWhere('abreviatura', 'like', '%' . $searchValue . '%')
                        ->orWhere('descripcion', 'like', '%' . $searchValue . '%');
                })
                ->skip($start)
                ->take($rowperpage)
                ->get();

            $data_arr = array();

            foreach($records as $record){
                $data_arr[] = array(
                    "id" => $record->id,
                    "nombre" => $record->nombre,
                    "descripcion" => $record->descripcion,
                    "codigo" => $record->codigo,
                    "abreviatura" => $record->abreviatura,
                    "activa" => $record->activa ? 'Sí' : 'No',
                    "orden" => $record->orden,
                    "created_at" => $record->created_at ? $record->created_at->format('Y-m-d H:i:s') : null,
                    "updated_at" => $record->updated_at ? $record->updated_at->format('Y-m-d H:i:s') : null,
                    "Id_Licencia" => $record->Id_Licencia
                );
            }

            return response()->json([
                "draw" => intval($draw),
                "recordsTotal" => $totalRecords,
                "recordsFiltered" => $totalRecordswithFilter,
                "data" => $data_arr,
                "success" => true
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las presentaciones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Formulario de creación de presentación'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:100',
                'descripcion' => 'nullable|string',
                'codigo' => 'required|string|max:50|unique:presentaciones,codigo',
                'abreviatura' => 'nullable|string|max:20',
                'activa' => 'boolean',
                'orden' => 'nullable|integer|min:0',
                'Id_Licencia' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $presentacion = Presentacion::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Presentación creada exitosamente',
                'data' => $presentacion
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la presentación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $presentacion = Presentacion::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $presentacion
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la presentación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): JsonResponse
    {
        try {
            $presentacion = Presentacion::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $presentacion
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la presentación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $presentacion = Presentacion::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:100',
                'descripcion' => 'nullable|string',
                'codigo' => 'required|string|max:50|unique:presentaciones,codigo,' . $id,
                'abreviatura' => 'nullable|string|max:20',
                'activa' => 'boolean',
                'orden' => 'nullable|integer|min:0',
                'Id_Licencia' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $presentacion->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Presentación actualizada exitosamente',
                'data' => $presentacion
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la presentación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $presentacion = Presentacion::findOrFail($id);
            $presentacion->delete();

            return response()->json([
                'success' => true,
                'message' => 'Presentación eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la presentación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get presentaciones by estado (activa/inactiva)
     */
    public function getByEstado(string $estado): JsonResponse
    {
        try {
            $activa = strtolower($estado) === 'activa' || strtolower($estado) === 'activo';
            $presentaciones = Presentacion::where('activa', $activa)->get();

            return response()->json([
                'success' => true,
                'data' => $presentaciones
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener presentaciones por estado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get presentaciones by organización
     */
    public function getByOrganizacion(string $organizacion): JsonResponse
    {
        try {
            $presentaciones = Presentacion::where('Id_Licencia', $organizacion)->get();

            return response()->json([
                'success' => true,
                'data' => $presentaciones
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener presentaciones por organización: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get presentaciones by siglas (abreviatura)
     */
    public function getBySiglas(string $siglas): JsonResponse
    {
        try {
            $presentaciones = Presentacion::where('abreviatura', 'like', '%' . $siglas . '%')->get();

            return response()->json([
                'success' => true,
                'data' => $presentaciones
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener presentaciones por siglas: ' . $e->getMessage()
            ], 500);
        }
    }
} 