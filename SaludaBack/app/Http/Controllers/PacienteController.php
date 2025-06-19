<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PacienteController extends Controller
{
    /**
     * Obtener todos los pacientes
     */
    public function index(Request $request)
    {
        try {
            $query = Paciente::query();

            // Filtros
            if ($request->has('nombre')) {
                $query->where('Nombre', 'like', '%' . $request->nombre . '%');
            }

            if ($request->has('apellido')) {
                $query->where('Apellido', 'like', '%' . $request->apellido . '%');
            }

            if ($request->has('email')) {
                $query->where('Email', 'like', '%' . $request->email . '%');
            }

            if ($request->has('telefono')) {
                $query->where('Telefono', 'like', '%' . $request->telefono . '%');
            }

            $pacientes = $query->orderBy('Nombre', 'asc')
                              ->orderBy('Apellido', 'asc')
                              ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $pacientes,
                'message' => 'Pacientes obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los pacientes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener un paciente específico
     */
    public function show($id)
    {
        try {
            $paciente = Paciente::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $paciente,
                'message' => 'Paciente obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el paciente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear un nuevo paciente
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:100',
                'apellido' => 'required|string|max:100',
                'fecha_nacimiento' => 'required|date',
                'genero' => 'required|in:Masculino,Femenino,Otro',
                'email' => 'nullable|email|max:255|unique:pacientes,Email',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string|max:500',
                'ciudad' => 'nullable|string|max:100',
                'estado' => 'nullable|string|max:100',
                'codigo_postal' => 'nullable|string|max:10',
                'grupo_sanguineo' => 'nullable|string|max:10',
                'alergias' => 'nullable|string',
                'antecedentes_medicos' => 'nullable|string',
                'medicamentos_actuales' => 'nullable|string',
                'contacto_emergencia' => 'nullable|string|max:255',
                'telefono_emergencia' => 'nullable|string|max:20',
                'relacion_emergencia' => 'nullable|string|max:100',
                'estado_civil' => 'nullable|string|max:50',
                'ocupacion' => 'nullable|string|max:100',
                'seguro_medico' => 'nullable|string|max:255',
                'numero_seguro' => 'nullable|string|max:100',
                'notas' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $paciente = Paciente::create([
                'Nombre' => $request->nombre,
                'Apellido' => $request->apellido,
                'Fecha_Nacimiento' => $request->fecha_nacimiento,
                'Genero' => $request->genero,
                'Email' => $request->email,
                'Telefono' => $request->telefono,
                'Direccion' => $request->direccion,
                'Ciudad' => $request->ciudad,
                'Estado' => $request->estado,
                'Codigo_Postal' => $request->codigo_postal,
                'Grupo_Sanguineo' => $request->grupo_sanguineo,
                'Alergias' => $request->alergias,
                'Antecedentes_Medicos' => $request->antecedentes_medicos,
                'Medicamentos_Actuales' => $request->medicamentos_actuales,
                'Contacto_Emergencia' => $request->contacto_emergencia,
                'Telefono_Emergencia' => $request->telefono_emergencia,
                'Relacion_Emergencia' => $request->relacion_emergencia,
                'Estado_Civil' => $request->estado_civil,
                'Ocupacion' => $request->ocupacion,
                'Seguro_Medico' => $request->seguro_medico,
                'Numero_Seguro' => $request->numero_seguro,
                'Notas' => $request->notas,
                'Fecha_Registro' => now(),
                'Estado' => 'Activo'
            ]);

            return response()->json([
                'success' => true,
                'data' => $paciente,
                'message' => 'Paciente creado exitosamente'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el paciente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un paciente
     */
    public function update(Request $request, $id)
    {
        try {
            $paciente = Paciente::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nombre' => 'sometimes|required|string|max:100',
                'apellido' => 'sometimes|required|string|max:100',
                'fecha_nacimiento' => 'sometimes|required|date',
                'genero' => 'sometimes|required|in:Masculino,Femenino,Otro',
                'email' => 'nullable|email|max:255|unique:pacientes,Email,' . $id . ',Paciente_ID',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string|max:500',
                'ciudad' => 'nullable|string|max:100',
                'estado' => 'nullable|string|max:100',
                'codigo_postal' => 'nullable|string|max:10',
                'grupo_sanguineo' => 'nullable|string|max:10',
                'alergias' => 'nullable|string',
                'antecedentes_medicos' => 'nullable|string',
                'medicamentos_actuales' => 'nullable|string',
                'contacto_emergencia' => 'nullable|string|max:255',
                'telefono_emergencia' => 'nullable|string|max:20',
                'relacion_emergencia' => 'nullable|string|max:100',
                'estado_civil' => 'nullable|string|max:50',
                'ocupacion' => 'nullable|string|max:100',
                'seguro_medico' => 'nullable|string|max:255',
                'numero_seguro' => 'nullable|string|max:100',
                'notas' => 'nullable|string',
                'estado' => 'sometimes|required|in:Activo,Inactivo'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $paciente->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $paciente,
                'message' => 'Paciente actualizado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el paciente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un paciente
     */
    public function destroy($id)
    {
        try {
            $paciente = Paciente::findOrFail($id);
            $paciente->delete();

            return response()->json([
                'success' => true,
                'message' => 'Paciente eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el paciente: ' . $e->getMessage()
            ], 500);
        }
    }
} 