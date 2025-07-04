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
            $columnName = isset($columnName_arr[$columnIndex]['data']) ? $columnName_arr[$columnIndex]['data'] : 'Nom_Presentacion';
            $columnSortOrder = isset($order_arr[0]['dir']) ? $order_arr[0]['dir'] : 'asc';
            $searchValue = $search_arr['value'] ?? '';

            // Total de registros
            $totalRecords = Presentacion::count();
            $totalRecordswithFilter = Presentacion::where('Nom_Presentacion', 'like', '%' . $searchValue . '%')
                ->orWhere('Siglas', 'like', '%' . $searchValue . '%')
                ->orWhere('Estado', 'like', '%' . $searchValue . '%')
                ->orWhere('Sistema', 'like', '%' . $searchValue . '%')
                ->count();

            // Obtener registros
            $records = Presentacion::orderBy($columnName, $columnSortOrder)
                ->where(function($query) use ($searchValue) {
                    $query->where('Nom_Presentacion', 'like', '%' . $searchValue . '%')
                        ->orWhere('Siglas', 'like', '%' . $searchValue . '%')
                        ->orWhere('Estado', 'like', '%' . $searchValue . '%')
                        ->orWhere('Sistema', 'like', '%' . $searchValue . '%');
                })
                ->skip($start)
                ->take($rowperpage)
                ->get();

            $data_arr = array();

            foreach($records as $record){
                $data_arr[] = array(
                    "Pprod_ID" => $record->Pprod_ID,
                    "Nom_Presentacion" => $record->Nom_Presentacion,
                    "Siglas" => $record->Siglas,
                    "Estado" => $record->Estado,
                    "Cod_Estado" => $record->Cod_Estado,
                    "Sistema" => $record->Sistema,
                    "ID_H_O_D" => $record->ID_H_O_D,
                    "Agregadoel" => $record->Agregadoel,
                    "Agregado_Por" => $record->Agregado_Por
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
                'Nom_Presentacion' => 'required|string|max:255|unique:presentaciones,Nom_Presentacion',
                'Siglas' => 'nullable|string|max:50',
                'Estado' => 'string|max:50',
                'Cod_Estado' => 'string|max:10',
                'Sistema' => 'string|max:50',
                'ID_H_O_D' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $presentacion = Presentacion::create([
                'Nom_Presentacion' => $request->Nom_Presentacion,
                'Siglas' => $request->Siglas,
                'Estado' => $request->Estado ?? 'Vigente',
                'Cod_Estado' => $request->Cod_Estado ?? 'V',
                'Agregado_Por' => $request->user()->name ?? 'Sistema',
                'Agregadoel' => Carbon::now(),
                'Sistema' => $request->Sistema ?? 'POS',
                'ID_H_O_D' => $request->ID_H_O_D ?? 'Saluda',
            ]);

            return response()->json([
                'success' => true,
                'data' => $presentacion,
                'message' => 'Presentación creada exitosamente'
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
                'data' => $presentacion,
                'message' => 'Presentación encontrada'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Presentación no encontrada'
            ], 404);
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
                'data' => $presentacion,
                'message' => 'Presentación para editar'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Presentación no encontrada'
            ], 404);
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
                'Nom_Presentacion' => 'required|string|max:255|unique:presentaciones,Nom_Presentacion,' . $id . ',Pprod_ID',
                'Siglas' => 'nullable|string|max:50',
                'Estado' => 'string|max:50',
                'Cod_Estado' => 'string|max:10',
                'Sistema' => 'string|max:50',
                'ID_H_O_D' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $presentacion->update([
                'Nom_Presentacion' => $request->Nom_Presentacion,
                'Siglas' => $request->Siglas,
                'Estado' => $request->Estado,
                'Cod_Estado' => $request->Cod_Estado,
                'Sistema' => $request->Sistema,
                'ID_H_O_D' => $request->ID_H_O_D,
            ]);

            return response()->json([
                'success' => true,
                'data' => $presentacion,
                'message' => 'Presentación actualizada exitosamente'
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
     * Obtener presentaciones por estado
     */
    public function getByEstado(string $estado): JsonResponse
    {
        try {
            $presentaciones = Presentacion::where('Estado', $estado)
                ->orderBy('Nom_Presentacion')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $presentaciones,
                'message' => 'Presentaciones encontradas por estado'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener presentaciones por estado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener presentaciones por organización
     */
    public function getByOrganizacion(string $organizacion): JsonResponse
    {
        try {
            $presentaciones = Presentacion::porOrganizacion($organizacion)
                ->orderBy('Nom_Presentacion')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $presentaciones,
                'message' => 'Presentaciones encontradas por organización'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener presentaciones por organización: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener presentaciones por siglas
     */
    public function getBySiglas(string $siglas): JsonResponse
    {
        try {
            $presentaciones = Presentacion::porSiglas($siglas)
                ->orderBy('Nom_Presentacion')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $presentaciones,
                'message' => 'Presentaciones encontradas por siglas'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener presentaciones por siglas: ' . $e->getMessage()
            ], 500);
        }
    }
} 