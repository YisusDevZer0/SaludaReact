<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CategoriaPos;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CategoriaPosController extends Controller
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
            $columnName = isset($columnName_arr[$columnIndex]['data']) ? $columnName_arr[$columnIndex]['data'] : 'Nom_Cat';
            $columnSortOrder = isset($order_arr[0]['dir']) ? $order_arr[0]['dir'] : 'asc';
            $searchValue = $search_arr['value'] ?? '';

            // Total de registros
            $totalRecords = CategoriaPos::count();
            $totalRecordswithFilter = CategoriaPos::where('Nom_Cat', 'like', '%' . $searchValue . '%')
                ->orWhere('Estado', 'like', '%' . $searchValue . '%')
                ->orWhere('Sistema', 'like', '%' . $searchValue . '%')
                ->count();

            // Obtener registros
            $records = CategoriaPos::orderBy($columnName, $columnSortOrder)
                ->where(function($query) use ($searchValue) {
                    $query->where('Nom_Cat', 'like', '%' . $searchValue . '%')
                        ->orWhere('Estado', 'like', '%' . $searchValue . '%')
                        ->orWhere('Sistema', 'like', '%' . $searchValue . '%');
                })
                ->skip($start)
                ->take($rowperpage)
                ->get();

            $data_arr = array();

            foreach($records as $record){
                $data_arr[] = array(
                    "Cat_ID" => $record->Cat_ID,
                    "Nom_Cat" => $record->Nom_Cat,
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
                'message' => 'Error al obtener las categorías: ' . $e->getMessage()
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
            'message' => 'Formulario de creación de categoría'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'Nom_Cat' => 'required|string|max:255|unique:categorias_pos,Nom_Cat',
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

            $categoria = CategoriaPos::create([
                'Nom_Cat' => $request->Nom_Cat,
                'Estado' => $request->Estado ?? 'Vigente',
                'Cod_Estado' => $request->Cod_Estado ?? 'V',
                'Agregado_Por' => $request->user()->name ?? 'Sistema',
                'Agregadoel' => Carbon::now(),
                'Sistema' => $request->Sistema ?? 'POS',
                'ID_H_O_D' => $request->ID_H_O_D ?? 'Saluda',
            ]);

            return response()->json([
                'success' => true,
                'data' => $categoria,
                'message' => 'Categoría creada exitosamente'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $categoria = CategoriaPos::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $categoria,
                'message' => 'Categoría encontrada'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada'
            ], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): JsonResponse
    {
        try {
            $categoria = CategoriaPos::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $categoria,
                'message' => 'Categoría para editar'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $categoria = CategoriaPos::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'Nom_Cat' => 'required|string|max:255|unique:categorias_pos,Nom_Cat,' . $id . ',Cat_ID',
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

            $categoria->update([
                'Nom_Cat' => $request->Nom_Cat,
                'Estado' => $request->Estado ?? $categoria->Estado,
                'Cod_Estado' => $request->Cod_Estado ?? $categoria->Cod_Estado,
                'Sistema' => $request->Sistema ?? $categoria->Sistema,
                'ID_H_O_D' => $request->ID_H_O_D ?? $categoria->ID_H_O_D,
            ]);

            return response()->json([
                'success' => true,
                'data' => $categoria,
                'message' => 'Categoría actualizada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $categoria = CategoriaPos::findOrFail($id);
            
            // Soft delete - cambiar estado a inactivo
            $categoria->update([
                'Estado' => 'Inactivo',
                'Cod_Estado' => 'I'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Categoría eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la categoría: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener categorías por estado
     */
    public function getByEstado(string $estado): JsonResponse
    {
        try {
            $categorias = CategoriaPos::where('Estado', $estado)
                ->sistemaPos()
                ->orderBy('Nom_Cat', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categorias,
                'message' => "Categorías con estado: {$estado}"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las categorías: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener categorías por organización
     */
    public function getByOrganizacion(string $organizacion): JsonResponse
    {
        try {
            $categorias = CategoriaPos::porOrganizacion($organizacion)
                ->vigente()
                ->sistemaPos()
                ->orderBy('Nom_Cat', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categorias,
                'message' => "Categorías de la organización: {$organizacion}"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las categorías: ' . $e->getMessage()
            ], 500);
        }
    }
}
