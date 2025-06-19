<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    /**
     * Obtener todos los doctores
     */
    public function index(Request $request)
    {
        try {
            $query = Doctor::query();

            // Filtros
            if ($request->has('nombre')) {
                $query->where('Nombre', 'like', '%' . $request->nombre . '%');
            }

            if ($request->has('apellido')) {
                $query->where('Apellido', 'like', '%' . $request->apellido . '%');
            }

            if ($request->has('especialidad')) {
                $query->where('Especialidad', 'like', '%' . $request->especialidad . '%');
            }

            if ($request->has('estado')) {
                $query->where('Estado', $request->estado);
            }

            $doctores = $query->orderBy('Nombre', 'asc')
                             ->orderBy('Apellido', 'asc')
                             ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $doctores,
                'message' => 'Doctores obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los doctores: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener un doctor específico
     */
    public function show($id)
    {
        try {
            $doctor = Doctor::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $doctor,
                'message' => 'Doctor obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el doctor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear un nuevo doctor
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:100',
                'apellido' => 'required|string|max:100',
                'especialidad' => 'required|string|max:100',
                'cedula_profesional' => 'required|string|max:50|unique:doctores,Cedula_Profesional',
                'email' => 'nullable|email|max:255|unique:doctores,Email',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string|max:500',
                'ciudad' => 'nullable|string|max:100',
                'estado' => 'nullable|string|max:100',
                'codigo_postal' => 'nullable|string|max:10',
                'fecha_nacimiento' => 'nullable|date',
                'genero' => 'nullable|in:Masculino,Femenino,Otro',
                'fecha_graduacion' => 'nullable|date',
                'universidad' => 'nullable|string|max:255',
                'anios_experiencia' => 'nullable|integer|min:0',
                'horario_trabajo' => 'nullable|string',
                'dias_trabajo' => 'nullable|string',
                'consultorio' => 'nullable|string|max:100',
                'seguro_malpraxis' => 'nullable|string|max:255',
                'numero_seguro' => 'nullable|string|max:100',
                'notas' => 'nullable|string',
                'foto' => 'nullable|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $doctor = Doctor::create([
                'Nombre' => $request->nombre,
                'Apellido' => $request->apellido,
                'Especialidad' => $request->especialidad,
                'Cedula_Profesional' => $request->cedula_profesional,
                'Email' => $request->email,
                'Telefono' => $request->telefono,
                'Direccion' => $request->direccion,
                'Ciudad' => $request->ciudad,
                'Estado' => $request->estado,
                'Codigo_Postal' => $request->codigo_postal,
                'Fecha_Nacimiento' => $request->fecha_nacimiento,
                'Genero' => $request->genero,
                'Fecha_Graduacion' => $request->fecha_graduacion,
                'Universidad' => $request->universidad,
                'Anios_Experiencia' => $request->anios_experiencia,
                'Horario_Trabajo' => $request->horario_trabajo,
                'Dias_Trabajo' => $request->dias_trabajo,
                'Consultorio' => $request->consultorio,
                'Seguro_Malpraxis' => $request->seguro_malpraxis,
                'Numero_Seguro' => $request->numero_seguro,
                'Notas' => $request->notas,
                'Foto' => $request->foto,
                'Fecha_Registro' => now(),
                'Estado' => 'Activo'
            ]);

            return response()->json([
                'success' => true,
                'data' => $doctor,
                'message' => 'Doctor creado exitosamente'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el doctor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un doctor
     */
    public function update(Request $request, $id)
    {
        try {
            $doctor = Doctor::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nombre' => 'sometimes|required|string|max:100',
                'apellido' => 'sometimes|required|string|max:100',
                'especialidad' => 'sometimes|required|string|max:100',
                'cedula_profesional' => 'sometimes|required|string|max:50|unique:doctores,Cedula_Profesional,' . $id . ',Doctor_ID',
                'email' => 'nullable|email|max:255|unique:doctores,Email,' . $id . ',Doctor_ID',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string|max:500',
                'ciudad' => 'nullable|string|max:100',
                'estado' => 'nullable|string|max:100',
                'codigo_postal' => 'nullable|string|max:10',
                'fecha_nacimiento' => 'nullable|date',
                'genero' => 'nullable|in:Masculino,Femenino,Otro',
                'fecha_graduacion' => 'nullable|date',
                'universidad' => 'nullable|string|max:255',
                'anios_experiencia' => 'nullable|integer|min:0',
                'horario_trabajo' => 'nullable|string',
                'dias_trabajo' => 'nullable|string',
                'consultorio' => 'nullable|string|max:100',
                'seguro_malpraxis' => 'nullable|string|max:255',
                'numero_seguro' => 'nullable|string|max:100',
                'notas' => 'nullable|string',
                'foto' => 'nullable|string|max:500',
                'estado' => 'sometimes|required|in:Activo,Inactivo'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $doctor->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $doctor,
                'message' => 'Doctor actualizado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el doctor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un doctor
     */
    public function destroy($id)
    {
        try {
            $doctor = Doctor::findOrFail($id);
            $doctor->delete();

            return response()->json([
                'success' => true,
                'message' => 'Doctor eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el doctor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener doctores activos
     */
    public function getActivos()
    {
        try {
            $doctores = Doctor::where('Estado', 'Activo')
                             ->orderBy('Nombre', 'asc')
                             ->orderBy('Apellido', 'asc')
                             ->get(['Doctor_ID', 'Nombre', 'Apellido', 'Especialidad', 'Consultorio']);

            return response()->json([
                'success' => true,
                'data' => $doctores,
                'message' => 'Doctores activos obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los doctores activos: ' . $e->getMessage()
            ], 500);
        }
    }
} 