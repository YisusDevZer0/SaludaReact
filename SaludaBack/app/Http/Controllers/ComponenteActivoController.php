<?php

namespace App\Http\Controllers;

use App\Models\ComponenteActivo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ComponenteActivoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = ComponenteActivo::query();

            // Si hay término de búsqueda
            if ($request->has('search') && !empty($request->search['value'])) {
                $searchValue = '%' . $request->search['value'] . '%';
                $query->where(function($q) use ($searchValue) {
                    $q->where('Nom_Com', 'LIKE', $searchValue)
                      ->orWhere('Descripcion', 'LIKE', $searchValue);
                });
            }

            // Total de registros sin filtrar
            $totalRecords = ComponenteActivo::count();

            // Aplicar ordenamiento
            if ($request->has('order')) {
                $orderColumn = $request->order[0]['column'];
                $orderDir = $request->order[0]['dir'];
                $columns = ['ID', 'Nom_Com', 'Estado', 'Cod_Estado', 'Sistema', 'ID_H_O_D', 'Agregadoel'];
                
                if (isset($columns[$orderColumn])) {
                    $query->orderBy($columns[$orderColumn], $orderDir);
                }
            } else {
                $query->orderBy('ID', 'desc');
            }

            // Aplicar paginación
            if ($request->has('start') && $request->has('length')) {
                $query->skip($request->start)->take($request->length);
            }

            $componentes = $query->get();
            $filteredRecords = $query->count();

            // Transformar los datos para que coincidan con el frontend
            $componentes = $componentes->map(function($componente) {
                return [
                    'ID_Comp' => $componente->ID,
                    'Nom_Com' => $componente->Nom_Com,
                    'Estado' => $componente->Estado,
                    'Cod_Estado' => $componente->Cod_Estado,
                    'Sistema' => $componente->Sistema,
                    'Organizacion' => $componente->ID_H_O_D,
                    'Agregadoel' => $componente->Agregadoel,
                    'Agregado_Por' => $componente->Agregado_Por
                ];
            });

            return response()->json([
                'data' => $componentes,
                'recordsTotal' => $totalRecords,
                'recordsFiltered' => $filteredRecords,
                'draw' => $request->draw
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los componentes activos: ' . $e->getMessage()
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
                'Nom_Com' => 'required|string|max:255',
                'Estado' => 'required|in:Vigente,Descontinuado',
                'Cod_Estado' => 'required|in:V,D',
                'Sistema' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Transformar los datos del frontend al formato de la base de datos
            $data = [
                'Nom_Com' => $request->Nom_Com,
                'Estado' => $request->Estado,
                'Cod_Estado' => $request->Cod_Estado,
                'Sistema' => $request->Sistema,
                'ID_H_O_D' => $request->Organizacion ?? 'Saluda',
                'Agregado_Por' => 'Sistema', // O podrías obtenerlo del usuario autenticado
                'Agregadoel' => now()
            ];

            $componente = ComponenteActivo::create($data);

            // Transformar la respuesta al formato del frontend
            $response = [
                'ID_Comp' => $componente->ID,
                'Nom_Com' => $componente->Nom_Com,
                'Estado' => $componente->Estado,
                'Cod_Estado' => $componente->Cod_Estado,
                'Sistema' => $componente->Sistema,
                'Organizacion' => $componente->ID_H_O_D,
                'Agregadoel' => $componente->Agregadoel,
                'Agregado_Por' => $componente->Agregado_Por
            ];

            return response()->json([
                'success' => true,
                'message' => 'Componente creado exitosamente',
                'data' => $response
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el componente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $componente = ComponenteActivo::findOrFail($id);
            
            // Transformar la respuesta al formato del frontend
            $response = [
                'ID_Comp' => $componente->ID,
                'Nom_Com' => $componente->Nom_Com,
                'Estado' => $componente->Estado,
                'Cod_Estado' => $componente->Cod_Estado,
                'Sistema' => $componente->Sistema,
                'Organizacion' => $componente->ID_H_O_D,
                'Agregadoel' => $componente->Agregadoel,
                'Agregado_Por' => $componente->Agregado_Por
            ];

            return response()->json([
                'success' => true,
                'data' => $response
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el componente: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'Nom_Com' => 'required|string|max:255',
                'Estado' => 'required|in:Vigente,Descontinuado',
                'Cod_Estado' => 'required|in:V,D',
                'Sistema' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $componente = ComponenteActivo::findOrFail($id);

            // Transformar los datos del frontend al formato de la base de datos
            $data = [
                'Nom_Com' => $request->Nom_Com,
                'Estado' => $request->Estado,
                'Cod_Estado' => $request->Cod_Estado,
                'Sistema' => $request->Sistema,
                'ID_H_O_D' => $request->Organizacion ?? $componente->ID_H_O_D
            ];

            $componente->update($data);

            // Transformar la respuesta al formato del frontend
            $response = [
                'ID_Comp' => $componente->ID,
                'Nom_Com' => $componente->Nom_Com,
                'Estado' => $componente->Estado,
                'Cod_Estado' => $componente->Cod_Estado,
                'Sistema' => $componente->Sistema,
                'Organizacion' => $componente->ID_H_O_D,
                'Agregadoel' => $componente->Agregadoel,
                'Agregado_Por' => $componente->Agregado_Por
            ];

            return response()->json([
                'success' => true,
                'message' => 'Componente actualizado exitosamente',
                'data' => $response
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el componente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $componente = ComponenteActivo::findOrFail($id);
            $componente->delete();

            return response()->json([
                'success' => true,
                'message' => 'Componente eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el componente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get components by status.
     */
    public function getByEstado(string $estado): JsonResponse
    {
        try {
            $componentes = ComponenteActivo::where('Estado', $estado)->get();
            
            // Transformar los datos para que coincidan con el frontend
            $componentes = $componentes->map(function($componente) {
                return [
                    'ID_Comp' => $componente->ID,
                    'Nom_Com' => $componente->Nom_Com,
                    'Estado' => $componente->Estado,
                    'Cod_Estado' => $componente->Cod_Estado,
                    'Sistema' => $componente->Sistema,
                    'Organizacion' => $componente->ID_H_O_D,
                    'Agregadoel' => $componente->Agregadoel,
                    'Agregado_Por' => $componente->Agregado_Por
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $componentes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los componentes por estado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get components by organization.
     */
    public function getByOrganizacion(string $organizacion): JsonResponse
    {
        try {
            $componentes = ComponenteActivo::where('ID_H_O_D', $organizacion)->get();
            return response()->json([
                'success' => true,
                'data' => $componentes,
                'message' => 'Componentes activos filtrados por organización'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener componentes activos: ' . $e->getMessage()
            ], 500);
        }
    }
} 