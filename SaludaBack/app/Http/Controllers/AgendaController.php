<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use App\Models\Paciente;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AgendaController extends Controller
{
    /**
     * Obtener todas las citas con relaciones
     */
    public function index(Request $request)
    {
        try {
            $query = Agenda::with(['paciente', 'doctor', 'sucursal']);

            // Filtros
            if ($request->has('fecha')) {
                $query->porFecha($request->fecha);
            }

            if ($request->has('doctor_id')) {
                $query->porDoctor($request->doctor_id);
            }

            if ($request->has('paciente_id')) {
                $query->porPaciente($request->paciente_id);
            }

            if ($request->has('estado')) {
                $query->porEstado($request->estado);
            }

            if ($request->has('id_hod')) {
                $query->porOrganizacion($request->id_hod);
            }

            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->porRangoFechas($request->fecha_inicio, $request->fecha_fin);
            }

            $citas = $query->orderBy('Fecha_Cita', 'desc')
                          ->orderBy('Hora_Inicio', 'asc')
                          ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $citas,
                'message' => 'Citas obtenidas exitosamente'
            ])->header('Access-Control-Allow-Origin', '*')
              ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
              ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las citas: ' . $e->getMessage()
            ], 500)->header('Access-Control-Allow-Origin', '*')
                   ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                   ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        }
    }

    /**
     * Obtener una cita específica
     */
    public function show($id)
    {
        try {
            $cita = Agenda::with(['paciente', 'doctor', 'sucursal'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $cita,
                'message' => 'Cita obtenida exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la cita: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear una nueva cita
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'titulo_cita' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'fecha_cita' => 'required|date|after_or_equal:today',
                'hora_inicio' => 'required|date_format:H:i',
                'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
                'estado_cita' => 'required|in:Pendiente,Confirmada,En Proceso,Completada,Cancelada,No Asistió',
                'tipo_cita' => 'required|string|max:100',
                'consultorio' => 'nullable|string|max:50',
                'costo' => 'nullable|numeric|min:0',
                'notas_adicionales' => 'nullable|string',
                'fk_paciente' => 'required|exists:pacientes,Paciente_ID',
                'fk_doctor' => 'required|exists:doctores,Doctor_ID',
                'fk_sucursal' => 'required|exists:sucursales,id',
                'id_h_o_d' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar disponibilidad del doctor
            if (!Agenda::verificarDisponibilidad(
                $request->fk_doctor,
                $request->fecha_cita,
                $request->hora_inicio,
                $request->hora_fin
            )) {
                return response()->json([
                    'success' => false,
                    'message' => 'El doctor no está disponible en el horario seleccionado'
                ], 409);
            }

            $cita = Agenda::create([
                'Titulo_Cita' => $request->titulo_cita,
                'Descripcion' => $request->descripcion,
                'Fecha_Cita' => $request->fecha_cita,
                'Hora_Inicio' => $request->hora_inicio,
                'Hora_Fin' => $request->hora_fin,
                'Estado_Cita' => $request->estado_cita,
                'Tipo_Cita' => $request->tipo_cita,
                'Consultorio' => $request->consultorio,
                'Costo' => $request->costo,
                'Notas_Adicionales' => $request->notas_adicionales,
                'Fk_Paciente' => $request->fk_paciente,
                'Fk_Doctor' => $request->fk_doctor,
                'Fk_Sucursal' => $request->fk_sucursal,
                'ID_H_O_D' => $request->id_h_o_d,
                'Agregado_Por' => $request->user()->name ?? 'Sistema'
            ]);

            $cita->load(['paciente', 'doctor', 'sucursal']);

            return response()->json([
                'success' => true,
                'data' => $cita,
                'message' => 'Cita creada exitosamente'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la cita: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar una cita
     */
    public function update(Request $request, $id)
    {
        try {
            $cita = Agenda::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'titulo_cita' => 'sometimes|required|string|max:255',
                'descripcion' => 'nullable|string',
                'fecha_cita' => 'sometimes|required|date',
                'hora_inicio' => 'sometimes|required|date_format:H:i',
                'hora_fin' => 'sometimes|required|date_format:H:i|after:hora_inicio',
                'estado_cita' => 'sometimes|required|in:Pendiente,Confirmada,En Proceso,Completada,Cancelada,No Asistió',
                'tipo_cita' => 'sometimes|required|string|max:100',
                'consultorio' => 'nullable|string|max:50',
                'costo' => 'nullable|numeric|min:0',
                'notas_adicionales' => 'nullable|string',
                'fk_paciente' => 'sometimes|required|exists:pacientes,Paciente_ID',
                'fk_doctor' => 'sometimes|required|exists:doctores,Doctor_ID',
                'fk_sucursal' => 'sometimes|required|exists:sucursales,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar disponibilidad si se cambia fecha, hora o doctor
            if ($request->has('fecha_cita') || $request->has('hora_inicio') || $request->has('hora_fin') || $request->has('fk_doctor')) {
                $fecha = $request->fecha_cita ?? $cita->Fecha_Cita;
                $horaInicio = $request->hora_inicio ?? $cita->Hora_Inicio;
                $horaFin = $request->hora_fin ?? $cita->Hora_Fin;
                $doctorId = $request->fk_doctor ?? $cita->Fk_Doctor;

                if (!Agenda::verificarDisponibilidad($doctorId, $fecha, $horaInicio, $horaFin, $id)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El doctor no está disponible en el horario seleccionado'
                    ], 409);
                }
            }

            $cita->update([
                'Titulo_Cita' => $request->titulo_cita ?? $cita->Titulo_Cita,
                'Descripcion' => $request->descripcion ?? $cita->Descripcion,
                'Fecha_Cita' => $request->fecha_cita ?? $cita->Fecha_Cita,
                'Hora_Inicio' => $request->hora_inicio ?? $cita->Hora_Inicio,
                'Hora_Fin' => $request->hora_fin ?? $cita->Hora_Fin,
                'Estado_Cita' => $request->estado_cita ?? $cita->Estado_Cita,
                'Tipo_Cita' => $request->tipo_cita ?? $cita->Tipo_Cita,
                'Consultorio' => $request->consultorio ?? $cita->Consultorio,
                'Costo' => $request->costo ?? $cita->Costo,
                'Notas_Adicionales' => $request->notas_adicionales ?? $cita->Notas_Adicionales,
                'Fk_Paciente' => $request->fk_paciente ?? $cita->Fk_Paciente,
                'Fk_Doctor' => $request->fk_doctor ?? $cita->Fk_Doctor,
                'Fk_Sucursal' => $request->fk_sucursal ?? $cita->Fk_Sucursal,
                'Modificado_Por' => $request->user()->name ?? 'Sistema',
                'Modificado_El' => now()
            ]);

            $cita->load(['paciente', 'doctor', 'sucursal']);

            return response()->json([
                'success' => true,
                'data' => $cita,
                'message' => 'Cita actualizada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la cita: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una cita
     */
    public function destroy($id)
    {
        try {
            $cita = Agenda::findOrFail($id);
            $cita->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cita eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la cita: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener citas de hoy
     */
    public function citasHoy(Request $request)
    {
        try {
            $query = Agenda::with(['paciente', 'doctor', 'sucursal'])->hoy();

            if ($request->has('id_hod')) {
                $query->porOrganizacion($request->id_hod);
            }

            $citas = $query->orderBy('Hora_Inicio', 'asc')->get();

            return response()->json([
                'success' => true,
                'data' => $citas,
                'message' => 'Citas de hoy obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las citas de hoy: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de citas
     */
    public function estadisticas(Request $request)
    {
        try {
            $query = Agenda::query();

            if ($request->has('id_hod')) {
                $query->porOrganizacion($request->id_hod);
            }

            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->porRangoFechas($request->fecha_inicio, $request->fecha_fin);
            }

            $totalCitas = $query->count();
            $citasHoy = $query->hoy()->count();
            $citasPendientes = $query->pendientes()->count();
            $citasCompletadas = $query->where('Estado_Cita', 'Completada')->count();
            $citasCanceladas = $query->where('Estado_Cita', 'Cancelada')->count();

            $estadisticas = [
                'total_citas' => $totalCitas,
                'citas_hoy' => $citasHoy,
                'citas_pendientes' => $citasPendientes,
                'citas_completadas' => $citasCompletadas,
                'citas_canceladas' => $citasCanceladas,
                'porcentaje_completadas' => $totalCitas > 0 ? round(($citasCompletadas / $totalCitas) * 100, 2) : 0,
                'porcentaje_canceladas' => $totalCitas > 0 ? round(($citasCanceladas / $totalCitas) * 100, 2) : 0
            ];

            return response()->json([
                'success' => true,
                'data' => $estadisticas,
                'message' => 'Estadísticas obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar disponibilidad de un doctor
     */
    public function verificarDisponibilidad(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'doctor_id' => 'required|exists:doctores,Doctor_ID',
                'fecha' => 'required|date',
                'hora_inicio' => 'required|date_format:H:i',
                'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
                'cita_id' => 'nullable|exists:agendas,Agenda_ID'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $disponible = Agenda::verificarDisponibilidad(
                $request->doctor_id,
                $request->fecha,
                $request->hora_inicio,
                $request->hora_fin,
                $request->cita_id
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'disponible' => $disponible
                ],
                'message' => $disponible ? 'Horario disponible' : 'Horario no disponible'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al verificar disponibilidad: ' . $e->getMessage()
            ], 500);
        }
    }
} 