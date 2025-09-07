<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgramacionMedicoExt;
use App\Models\FechaEspecialistaExt;
use App\Models\HorarioCitaExt;
use App\Models\EspecialistaMejorado;
use App\Models\SucursalMejorada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProgramacionController extends Controller
{
    /**
     * Crear una nueva programación de especialista
     */
    public function crearProgramacion(Request $request)
    {
        try {
            \Log::info('Creando programación:', $request->all());
            
            $request->validate([
                'FK_Especialista' => 'required|integer|exists:especialistas,Especialista_ID',
                'Fk_Sucursal' => 'required|integer|exists:sucursales_mejoradas,Sucursal_ID',
                'Tipo_Programacion' => 'required|string|in:Regular,Temporal,Especial',
                'Fecha_Inicio' => 'required|date|after_or_equal:today',
                'Fecha_Fin' => 'required|date|after_or_equal:Fecha_Inicio',
                'Hora_inicio' => 'required|date_format:H:i',
                'Hora_Fin' => 'required|date_format:H:i|after:Hora_inicio',
                'Intervalo' => 'required|integer|min:15|max:120'
            ]);

            $programacion = ProgramacionMedicoExt::create([
                'FK_Medico' => $request->FK_Especialista,
                'Fk_Sucursal' => $request->Fk_Sucursal,
                'Tipo_Programacion' => $request->Tipo_Programacion,
                'Fecha_Inicio' => $request->Fecha_Inicio,
                'Fecha_Fin' => $request->Fecha_Fin,
                'Hora_inicio' => $request->Hora_inicio,
                'Hora_Fin' => $request->Hora_Fin,
                'Intervalo' => $request->Intervalo,
                'Estatus' => 'Programada',
                'ProgramadoPor' => $request->header('X-User-ID', 'Sistema'),
                'ProgramadoEn' => now(),
                'Sistema' => 'SaludaReact',
                'ID_H_O_D' => uniqid('PROG_', true)
            ]);

            \Log::info('Programación creada:', $programacion->toArray());

            // Generar fechas y horarios disponibles automáticamente
            try {
                $programacion->generarFechasYHorarios();
                \Log::info('Fechas y horarios generados para programación ID: ' . $programacion->ID_Programacion);
            } catch (\Exception $e) {
                \Log::error('Error generando fechas y horarios:', ['error' => $e->getMessage(), 'programacion_id' => $programacion->ID_Programacion]);
                // No fallar la creación de la programación por este error
            }

            return response()->json([
                'success' => true,
                'message' => 'Programación creada exitosamente',
                'data' => $programacion->load(['especialista', 'sucursal', 'fechas', 'horarios'])
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error creando programación:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la programación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener todas las programaciones
     */
    public function obtenerProgramaciones(Request $request)
    {
        try {
            $query = ProgramacionMedicoExt::with([
                'especialista',
                'sucursal',
                'fechas',
                'horarios'
            ]);

            // Filtros
            if ($request->especialista_id) {
                $query->where('FK_Medico', $request->especialista_id);
            }

            if ($request->sucursal_id) {
                $query->where('Fk_Sucursal', $request->sucursal_id);
            }

            if ($request->estatus) {
                $query->where('Estatus', $request->estatus);
            }

            if ($request->fecha_inicio) {
                $query->where('Fecha_Inicio', '>=', $request->fecha_inicio);
            }

            if ($request->fecha_fin) {
                $query->where('Fecha_Fin', '<=', $request->fecha_fin);
            }

            $programaciones = $query->orderBy('Fecha_Inicio', 'desc')
                                   ->paginate($request->per_page ?? 15);

            return response()->json([
                'success' => true,
                'message' => 'Programaciones obtenidas exitosamente',
                'data' => $programaciones
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al obtener programaciones:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las programaciones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Gestionar fecha (aperturar, eliminar, editar)
     */
    public function gestionarFecha($id, Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'fecha' => 'required|date',
                'accion' => 'required|in:aperturar,eliminar,editar',
                'nueva_fecha' => 'nullable|date|required_if:accion,editar'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $programacion = ProgramacionMedicoExt::findOrFail($id);
            $fecha = $request->fecha;
            $accion = $request->accion;

            switch ($accion) {
                case 'aperturar':
                    // Crear fecha si no existe
                    $fechaEspecialista = FechaEspecialistaExt::firstOrCreate([
                        'Fecha_Disponibilidad' => $fecha,
                        'FK_Especialista' => $programacion->FK_Medico,
                        'Fk_Programacion' => $id
                    ], [
                        'Estado' => 'Disponible',
                        'ID_H_O_D' => $programacion->ID_H_O_D,
                        'Agrego' => $request->header('X-User-ID', 'Sistema')
                    ]);

                    if ($fechaEspecialista->wasRecentlyCreated) {
                        $fechaEspecialista->aperturar();
                    }
                    
                    $mensaje = 'Fecha aperturada correctamente';
                    break;

                case 'eliminar':
                    // Eliminar fecha y todos sus horarios
                    $fechaEspecialista = FechaEspecialistaExt::where([
                        'Fecha_Disponibilidad' => $fecha,
                        'FK_Especialista' => $programacion->FK_Medico,
                        'Fk_Programacion' => $id
                    ])->first();

                    if ($fechaEspecialista) {
                        // Eliminar horarios asociados
                        HorarioCitaExt::where('FK_Fecha', $fechaEspecialista->ID_Fecha_Esp)->delete();
                        $fechaEspecialista->delete();
                    }
                    
                    $mensaje = 'Fecha eliminada correctamente';
                    break;

                case 'editar':
                    $fechaEspecialista = FechaEspecialistaExt::where([
                        'Fecha_Disponibilidad' => $fecha,
                        'FK_Especialista' => $programacion->FK_Medico,
                        'Fk_Programacion' => $id
                    ])->first();

                    if ($fechaEspecialista) {
                        $fechaEspecialista->update([
                            'Fecha_Disponibilidad' => $request->nueva_fecha
                        ]);
                    }
                    
                    $mensaje = 'Fecha editada correctamente';
                    break;
            }

            \Log::info('Fecha gestionada', [
                'programacion_id' => $id,
                'fecha' => $fecha,
                'accion' => $accion
            ]);

            return response()->json([
                'success' => true,
                'message' => $mensaje,
                'data' => [
                    'fecha' => $fecha,
                    'accion' => $accion
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al gestionar fecha', [
                'programacion_id' => $id,
                'fecha' => $request->fecha,
                'accion' => $request->accion,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al gestionar fecha: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Agregar horarios a una fecha específica
     */
    public function agregarHorariosAFecha($id, Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'fecha' => 'required|date',
                'horarios' => 'required|array|min:1',
                'horarios.*.hora' => 'required|date_format:H:i',
                'horarios.*.estatus' => 'nullable|in:Disponible,Cerrado,Ocupado'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $programacion = ProgramacionMedicoExt::findOrFail($id);
            $fecha = $request->fecha;
            $horarios = $request->horarios;

            // Buscar la fecha
            $fechaEspecialista = FechaEspecialistaExt::where([
                'Fecha_Disponibilidad' => $fecha,
                'FK_Especialista' => $programacion->FK_Medico,
                'Fk_Programacion' => $id
            ])->first();

            if (!$fechaEspecialista) {
                return response()->json([
                    'success' => false,
                    'message' => 'La fecha especificada no está aperturada en esta programación'
                ], 400);
            }

            // Crear horarios
            $horariosCreados = [];
            foreach ($horarios as $horarioData) {
                $horario = HorarioCitaExt::create([
                    'Horario_Disponibilidad' => $horarioData['hora'],
                    'ID_H_O_D' => $programacion->ID_H_O_D,
                    'FK_Especialista' => $programacion->FK_Medico,
                    'FK_Fecha' => $fechaEspecialista->ID_Fecha_Esp,
                    'Fk_Programacion' => $id,
                    'Estado' => $horarioData['estatus'] ?? 'Disponible',
                    'AgregadoPor' => $request->header('X-User-ID', 'Sistema')
                ]);

                $horariosCreados[] = $horario;
            }

            \Log::info('Horarios agregados a fecha', [
                'programacion_id' => $id,
                'fecha' => $fecha,
                'horarios_creados' => count($horariosCreados)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Horarios agregados correctamente',
                'data' => [
                    'fecha' => $fecha,
                    'horarios_creados' => count($horariosCreados)
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al agregar horarios a fecha', [
                'programacion_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al agregar horarios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener horarios por fecha de una programación
     */
    public function obtenerHorariosPorFecha($id)
    {
        try {
            $programacion = ProgramacionMedicoExt::findOrFail($id);
            
            $fechas = $programacion->fechas()
                ->with(['horarios'])
                ->orderBy('Fecha_Disponibilidad')
                ->get();

            $fechasFormateadas = [];
            foreach ($fechas as $fecha) {
                $fechasFormateadas[] = [
                    'fecha_id' => $fecha->ID_Fecha_Esp,
                    'fecha' => $fecha->Fecha_Disponibilidad->format('Y-m-d'),
                    'fecha_formateada' => $fecha->Fecha_Disponibilidad->format('d/m/Y'),
                    'dia_semana' => $fecha->Fecha_Disponibilidad->locale('es')->dayName,
                    'estado' => $fecha->Estado,
                    'horarios' => $fecha->horarios->map(function($horario) {
                        return [
                            'horario_id' => $horario->ID_Horario,
                            'hora' => $horario->Horario_Disponibilidad->format('H:i'),
                            'estado' => $horario->Estado,
                            'disponible' => $horario->Estado === 'Disponible'
                        ];
                    })
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $fechasFormateadas
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al obtener horarios por fecha', [
                'programacion_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener horarios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Gestionar horario individual
     */
    public function gestionarHorario($id, $horarioId, Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'accion' => 'required|in:aperturar,eliminar,editar',
                'nueva_hora' => 'nullable|date_format:H:i|required_if:accion,editar'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $horario = HorarioCitaExt::findOrFail($horarioId);
            
            // Verificar que pertenezca a la programación
            if ($horario->Fk_Programacion != $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'El horario no pertenece a esta programación'
                ], 400);
            }

            $accion = $request->accion;

            switch ($accion) {
                case 'aperturar':
                    $horario->aperturar();
                    $mensaje = 'Horario aperturado correctamente';
                    break;
                case 'eliminar':
                    $horario->delete();
                    $mensaje = 'Horario eliminado correctamente';
                    break;
                case 'editar':
                    $horario->update(['Horario_Disponibilidad' => $request->nueva_hora]);
                    $mensaje = 'Horario editado correctamente';
                    break;
            }

            \Log::info('Horario gestionado', [
                'programacion_id' => $id,
                'horario_id' => $horarioId,
                'accion' => $accion
            ]);

            return response()->json([
                'success' => true,
                'message' => $mensaje,
                'data' => [
                    'horario_id' => $horarioId,
                    'accion' => $accion
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al gestionar horario', [
                'programacion_id' => $id,
                'horario_id' => $horarioId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al gestionar horario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de programaciones
     */
    public function obtenerEstadisticas()
    {
        try {
            $total = ProgramacionMedicoExt::count();
            $programadas = ProgramacionMedicoExt::where('Estatus', 'Programada')->count();
            $autorizarHoras = ProgramacionMedicoExt::where('Estatus', 'Autorizar Horas')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $total,
                    'programadas' => $programadas,
                    'autorizar_horas' => $autorizarHoras
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al obtener estadísticas', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una programación
     */
    public function eliminarProgramacion($id)
    {
        try {
            $programacion = ProgramacionMedicoExt::findOrFail($id);
            
            // Eliminar horarios y fechas asociadas
            HorarioCitaExt::where('Fk_Programacion', $id)->delete();
            FechaEspecialistaExt::where('Fk_Programacion', $id)->delete();
            $programacion->delete();

            \Log::info('Programación eliminada', [
                'programacion_id' => $id,
                'especialista_id' => $programacion->FK_Medico
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Programación eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al eliminar programación', [
                'programacion_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la programación: ' . $e->getMessage()
            ], 500);
        }
    }

    // ===== MÉTODOS PARA INTEGRACIÓN CON AGENDA DE ESPECIALISTAS =====

    /**
     * Obtener fechas disponibles para un especialista en una sucursal
     */
    public function getFechasDisponibles(Request $request)
    {
        try {
            $request->validate([
                'especialista_id' => 'required|integer|exists:especialistas,Especialista_ID',
                'sucursal_id' => 'required|integer|exists:sucursales_mejoradas,Sucursal_ID'
            ]);

            $especialistaId = $request->especialista_id;
            $sucursalId = $request->sucursal_id;

            // Obtener fechas aperturadas con horarios disponibles, filtradas por especialista y sucursal
            $fechas = FechaEspecialistaExt::where('FK_Especialista', $especialistaId)
                ->whereHas('programacion', function($query) use ($sucursalId) {
                    $query->where('Fk_Sucursal', $sucursalId);
                })
                ->whereHas('horarios', function($query) {
                    $query->where('Estado', 'Disponible');
                })
                ->with(['horarios' => function($query) {
                    $query->where('Estado', 'Disponible');
                }])
                ->get();

            $fechasFormateadas = $fechas->map(function($fecha) {
                return [
                    'fecha' => $fecha->Fecha_Disponibilidad,
                    'fecha_formateada' => \Carbon\Carbon::parse($fecha->Fecha_Disponibilidad)->format('d/m/Y'),
                    'dia_semana' => \Carbon\Carbon::parse($fecha->Fecha_Disponibilidad)->locale('es')->dayName,
                    'horarios_disponibles' => $fecha->horarios->count()
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $fechasFormateadas
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al obtener fechas disponibles', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener fechas disponibles: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener horarios disponibles para una fecha específica
     */
    public function getHorariosDisponibles(Request $request)
    {
        try {
            $request->validate([
                'especialista_id' => 'required|integer|exists:especialistas,Especialista_ID',
                'sucursal_id' => 'required|integer|exists:sucursales_mejoradas,Sucursal_ID',
                'fecha' => 'required|date'
            ]);

            $especialistaId = $request->especialista_id;
            $sucursalId = $request->sucursal_id;
            $fecha = $request->fecha;

            // Obtener horarios disponibles para la fecha, filtrados por especialista y sucursal
            $horarios = HorarioCitaExt::where('FK_Especialista', $especialistaId)
                ->whereHas('fecha', function($query) use ($fecha) {
                    $query->where('Fecha_Disponibilidad', $fecha);
                })
                ->whereHas('programacion', function($query) use ($sucursalId) {
                    $query->where('Fk_Sucursal', $sucursalId);
                })
                ->where('Estado', 'Disponible')
                ->get();

            $horariosFormateados = $horarios->map(function($horario) {
                return [
                    'id' => $horario->ID_Horario,
                    'hora' => $horario->Horario_Disponibilidad->format('H:i'), // Formatear solo la hora
                    'disponible' => true
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $horariosFormateados
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al obtener horarios disponibles', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener horarios disponibles: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar disponibilidad de un horario específico
     */
    public function verificarDisponibilidadHorario(Request $request)
    {
        try {
            $request->validate([
                'especialista_id' => 'required|integer|exists:especialistas,Especialista_ID',
                'sucursal_id' => 'required|integer|exists:sucursales_mejoradas,Sucursal_ID',
                'fecha' => 'required|date',
                'hora' => 'required|date_format:H:i'
            ]);

            $especialistaId = $request->especialista_id;
            $sucursalId = $request->sucursal_id;
            $fecha = $request->fecha;
            $hora = $request->hora;

            // Verificar si el horario está disponible, filtrado por especialista y sucursal
            $horario = HorarioCitaExt::where('FK_Especialista', $especialistaId)
                ->whereHas('fecha', function($query) use ($fecha) {
                    $query->where('Fecha_Disponibilidad', $fecha);
                })
                ->whereHas('programacion', function($query) use ($sucursalId) {
                    $query->where('Fk_Sucursal', $sucursalId);
                })
                ->where('Horario_Disponibilidad', $hora)
                ->where('Estado', 'Disponible')
                ->first();

            $disponible = $horario !== null;

            return response()->json([
                'success' => true,
                'disponible' => $disponible,
                'mensaje' => $disponible ? 'Horario disponible' : 'Horario no disponible'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al verificar disponibilidad', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'disponible' => false,
                'mensaje' => 'Error al verificar disponibilidad: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ocupar un horario al crear una cita
     */
    public function ocuparHorario(Request $request)
    {
        try {
            $request->validate([
                'especialista_id' => 'required|integer|exists:especialistas,Especialista_ID',
                'sucursal_id' => 'required|integer|exists:sucursales_mejoradas,Sucursal_ID',
                'fecha' => 'required|date',
                'hora' => 'required|date_format:H:i',
                'cita_id' => 'required|integer'
            ]);

            $especialistaId = $request->especialista_id;
            $sucursalId = $request->sucursal_id;
            $fecha = $request->fecha;
            $hora = $request->hora;
            $citaId = $request->cita_id;

            // Buscar el horario disponible, filtrado por especialista y sucursal
            $horario = HorarioCitaExt::where('FK_Especialista', $especialistaId)
                ->whereHas('fecha', function($query) use ($fecha) {
                    $query->where('Fecha_Disponibilidad', $fecha);
                })
                ->whereHas('programacion', function($query) use ($sucursalId) {
                    $query->where('Fk_Sucursal', $sucursalId);
                })
                ->where('Horario_Disponibilidad', $hora)
                ->where('Estado', 'Disponible')
                ->first();

            if (!$horario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Horario no disponible'
                ], 400);
            }

            // Ocupar el horario
            $horario->update([
                'Estado' => 'Ocupado',
                'AgregadoEl' => now()
            ]);

            \Log::info('Horario ocupado', [
                'horario_id' => $horario->ID_Horario,
                'cita_id' => $citaId,
                'especialista_id' => $especialistaId,
                'fecha' => $fecha,
                'hora' => $hora
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Horario ocupado correctamente',
                'data' => [
                    'horario_id' => $horario->ID_Horario,
                    'estado' => 'Ocupado'
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al ocupar horario', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al ocupar horario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liberar un horario al eliminar una cita
     */
    public function liberarHorario(Request $request)
    {
        try {
            $request->validate([
                'especialista_id' => 'required|integer|exists:especialistas,Especialista_ID',
                'sucursal_id' => 'required|integer|exists:sucursales_mejoradas,Sucursal_ID',
                'fecha' => 'required|date',
                'hora' => 'required|date_format:H:i'
            ]);

            $especialistaId = $request->especialista_id;
            $sucursalId = $request->sucursal_id;
            $fecha = $request->fecha;
            $hora = $request->hora;

            // Buscar el horario ocupado
            $horario = HorarioCitaExt::where('FK_Especialista', $especialistaId)
                ->whereHas('fecha', function($query) use ($fecha) {
                    $query->where('Fecha_Disponibilidad', $fecha);
                })
                ->where('Horario_Disponibilidad', $hora)
                ->where('Estado', 'Ocupado')
                ->first();

            if (!$horario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Horario no encontrado o no está ocupado'
                ], 400);
            }

            // Liberar el horario
            $horario->update([
                'Estado' => 'Disponible',
                'AgregadoEl' => now()
            ]);

            \Log::info('Horario liberado', [
                'horario_id' => $horario->ID_Horario,
                'especialista_id' => $especialistaId,
                'fecha' => $fecha,
                'hora' => $hora
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Horario liberado correctamente',
                'data' => [
                    'horario_id' => $horario->ID_Horario,
                    'estado' => 'Disponible'
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al liberar horario', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al liberar horario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liberar un horario específico por su ID
     */
    public function liberarHorarioPorId(Request $request)
    {
        try {
            $request->validate([
                'horario_id' => 'required|integer|exists:Horarios_Citas_Ext,ID_Horario'
            ]);

            $horarioId = $request->horario_id;

            // Buscar el horario por ID
            $horario = HorarioCitaExt::find($horarioId);

            if (!$horario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Horario no encontrado'
                ], 404);
            }

            if ($horario->Estado !== 'Ocupado') {
                return response()->json([
                    'success' => false,
                    'message' => 'El horario no está ocupado'
                ], 400);
            }

            // Liberar el horario
            $horario->update([
                'Estado' => 'Disponible',
                'AgregadoEl' => now()
            ]);

            \Log::info('Horario liberado por ID', [
                'horario_id' => $horarioId,
                'especialista_id' => $horario->FK_Especialista,
                'fecha' => $horario->fecha->Fecha_Disponibilidad ?? 'N/A',
                'hora' => $horario->Horario_Disponibilidad
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Horario liberado correctamente',
                'data' => [
                    'horario_id' => $horarioId,
                    'estado' => 'Disponible'
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error al liberar horario por ID', [
                'horario_id' => $request->horario_id ?? 'N/A',
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al liberar horario: ' . $e->getMessage()
            ], 500);
        }
    }
}
