<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipoConsulta;
use App\Models\Especialidad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TiposConsultaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = TipoConsulta::with('especialidad');

            // Filtrar por organización si se proporciona
            if ($request->has('id_hod')) {
                $query->porOrganizacion($request->id_hod);
            }

            // Filtrar por especialidad si se proporciona
            if ($request->has('especialidad_id')) {
                $query->porEspecialidad($request->especialidad_id);
            }

            // Filtrar solo activos si se solicita
            if ($request->has('solo_activos') && $request->solo_activos) {
                $query->activos();
            }

            // Búsqueda por nombre
            if ($request->has('search') && $request->search) {
                $query->where('Nom_Tipo', 'like', '%' . $request->search . '%');
            }

            $tiposConsulta = $query->orderBy('Nom_Tipo')->get();

            return response()->json([
                'success' => true,
                'data' => $tiposConsulta,
                'message' => 'Tipos de consulta obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tipos de consulta: ' . $e->getMessage()
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
                'Nom_Tipo' => 'required|string|max:200',
                'Especialidad' => 'required|exists:especialidades,Especialidad_ID',
                'Estado' => 'nullable|in:Activo,Inactivo',
                'ID_H_O_D' => 'required|string|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar que no exista un tipo con el mismo nombre para la misma especialidad
            $existeTipo = TipoConsulta::where('Nom_Tipo', $request->Nom_Tipo)
                ->where('Especialidad', $request->Especialidad)
                ->where('ID_H_O_D', $request->ID_H_O_D)
                ->first();

            if ($existeTipo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ya existe un tipo de consulta con este nombre para la especialidad seleccionada'
                ], 409);
            }

            $tipoConsulta = TipoConsulta::create([
                'Nom_Tipo' => $request->Nom_Tipo,
                'Especialidad' => $request->Especialidad,
                'Estado' => $request->Estado ?? 'Activo',
                'Agregado_Por' => Auth::user() ? Auth::user()->name : 'Sistema',
                'Agregado_El' => Carbon::now(),
                'Sistema' => 'SaludaReact',
                'ID_H_O_D' => $request->ID_H_O_D
            ]);

            $tipoConsulta->load('especialidad');

            return response()->json([
                'success' => true,
                'data' => $tipoConsulta,
                'message' => 'Tipo de consulta creado exitosamente'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear tipo de consulta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $tipoConsulta = TipoConsulta::with('especialidad')->find($id);

            if (!$tipoConsulta) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tipo de consulta no encontrado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $tipoConsulta,
                'message' => 'Tipo de consulta obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tipo de consulta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $tipoConsulta = TipoConsulta::find($id);

            if (!$tipoConsulta) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tipo de consulta no encontrado'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'Nom_Tipo' => 'sometimes|required|string|max:200',
                'Especialidad' => 'sometimes|required|exists:especialidades,Especialidad_ID',
                'Estado' => 'sometimes|in:Activo,Inactivo'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar que no exista otro tipo con el mismo nombre para la misma especialidad
            if ($request->has('Nom_Tipo') || $request->has('Especialidad')) {
                $nombreTipo = $request->Nom_Tipo ?? $tipoConsulta->Nom_Tipo;
                $especialidadId = $request->Especialidad ?? $tipoConsulta->Especialidad;

                $existeTipo = TipoConsulta::where('Nom_Tipo', $nombreTipo)
                    ->where('Especialidad', $especialidadId)
                    ->where('ID_H_O_D', $tipoConsulta->ID_H_O_D)
                    ->where('Tipo_ID', '!=', $id)
                    ->first();

                if ($existeTipo) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ya existe un tipo de consulta con este nombre para la especialidad seleccionada'
                    ], 409);
                }
            }

            $tipoConsulta->update([
                'Nom_Tipo' => $request->Nom_Tipo ?? $tipoConsulta->Nom_Tipo,
                'Especialidad' => $request->Especialidad ?? $tipoConsulta->Especialidad,
                'Estado' => $request->Estado ?? $tipoConsulta->Estado,
                'Modificado_Por' => Auth::user() ? Auth::user()->name : 'Sistema',
                'Modificado_El' => Carbon::now()
            ]);

            $tipoConsulta->load('especialidad');

            return response()->json([
                'success' => true,
                'data' => $tipoConsulta,
                'message' => 'Tipo de consulta actualizado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar tipo de consulta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $tipoConsulta = TipoConsulta::find($id);

            if (!$tipoConsulta) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tipo de consulta no encontrado'
                ], 404);
            }

            // Verificar si el tipo de consulta está siendo usado en citas
            // Aquí podrías agregar una verificación adicional si es necesario

            $tipoConsulta->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tipo de consulta eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar tipo de consulta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener tipos de consulta por especialidad para el agendamiento
     */
    public function getByEspecialidad(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'especialidad_id' => 'required|exists:especialidades,Especialidad_ID',
                'id_hod' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $tiposConsulta = TipoConsulta::activos()
                ->porEspecialidad($request->especialidad_id)
                ->porOrganizacion($request->id_hod)
                ->orderBy('Nom_Tipo')
                ->get(['Tipo_ID', 'Nom_Tipo']);

            return response()->json([
                'success' => true,
                'data' => $tiposConsulta,
                'message' => 'Tipos de consulta obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tipos de consulta: ' . $e->getMessage()
            ], 500);
        }
    }
}
