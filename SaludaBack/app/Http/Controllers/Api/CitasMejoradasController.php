<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CitaMejorada;
use App\Models\HorarioDisponible;
use App\Models\HorarioCitaExt;
use App\Models\ProgramacionEspecialista;
use App\Models\PacienteMejorado;
use App\Models\Especialista;
use App\Models\SucursalMejorada;
use App\Models\ConsultorioMejorado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CitasMejoradasController extends Controller
{
    /**
     * Buscar pacientes por nombre para autocompletado
     */
    public function buscarPacientes(Request $request)
    {
        try {
            $request->validate([
                'q' => 'required|string|min:2|max:255'
            ]);

            $query = $request->q;
            
            $pacientes = PacienteMejorado::where('Estatus', 'Activo')
                ->where(function($q) use ($query) {
                    $q->where('Nombre', 'like', "%{$query}%")
                      ->orWhere('Apellido', 'like', "%{$query}%")
                      ->orWhereRaw("CONCAT(Nombre, ' ', Apellido) LIKE ?", ["%{$query}%"]);
                })
                ->select([
                    'Paciente_ID',
                    'Nombre',
                    'Apellido',
                    'Correo_Electronico',
                    'Telefono',
                    'Fecha_Nacimiento',
                    'Genero',
                    'Direccion',
                    'Tipo_Sangre'
                ])
                ->limit(10)
                ->get()
                ->map(function($paciente) {
                    return [
                        'id' => $paciente->Paciente_ID,
                        'nombre_completo' => $paciente->Nombre . ' ' . $paciente->Apellido,
                        'nombre' => $paciente->Nombre,
                        'apellido' => $paciente->Apellido,
                        'email' => $paciente->Correo_Electronico,
                        'telefono' => $paciente->Telefono,
                        'fecha_nacimiento' => $paciente->Fecha_Nacimiento,
                        'genero' => $paciente->Genero,
                        'direccion' => $paciente->Direccion,
                        'tipo_sangre' => $paciente->Tipo_Sangre
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $pacientes,
                'count' => $pacientes->count()
            ]);

        } catch (\Exception $e) {
            Log::error('Error al buscar pacientes', [
                'error' => $e->getMessage(),
                'query' => $request->q
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al buscar pacientes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener citas con filtros
     */
    public function index(Request $request)
    {
        try {
            $query = CitaMejorada::with([
                'paciente',
                'especialista.especialidad',
                'sucursal',
                'consultorio'
            ]);

            // Aplicar filtros
            if ($request->filled('fecha')) {
                $query->whereDate('Fecha_Cita', $request->fecha);
            }

            if ($request->filled('especialista')) {
                $query->where('Fk_Especialista', $request->especialista);
            }

            if ($request->filled('sucursal')) {
                $query->where('Fk_Sucursal', $request->sucursal);
            }

            if ($request->filled('estado')) {
                $query->where('Estado_Cita', $request->estado);
            }

            if ($request->filled('especialidad')) {
                $query->whereHas('especialista', function($q) use ($request) {
                    $q->where('Fk_Especialidad', $request->especialidad);
                });
            }

            $citas = $query->orderBy('Fecha_Cita')
                          ->orderBy('Hora_Inicio')
                          ->paginate($request->per_page ?? 15);

            return response()->json([
                'success' => true,
                'message' => 'Citas obtenidas exitosamente',
                'data' => $citas
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener citas', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las citas',
                'error' => $e->getMessage()
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
                'titulo' => 'required|string|max:200',
                'descripcion' => 'nullable|string',
                'paciente_id' => 'nullable|exists:pacientes_mejorados,Paciente_ID',
                'nombre_paciente' => 'required_without:paciente_id|string|max:255',
                'especialista_id' => 'required|exists:especialistas,Especialista_ID',
                'sucursal_id' => 'required|exists:sucursales_mejoradas,Sucursal_ID',
                'consultorio_id' => 'nullable|exists:consultorios_mejorados,Consultorio_ID',
                'fecha_cita' => 'required|date|after_or_equal:today',
                'hora_inicio' => 'required|date_format:H:i',
                'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
                'tipo_cita' => 'required|in:Consulta,Control,Urgencia,Procedimiento,Cirugía,Rehabilitación,Psicología,Nutrición,Pediatría',
                'costo' => 'nullable|numeric|min:0',
                'notas_adicionales' => 'nullable|string',
                'color_calendario' => 'nullable|string|max:7'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Log de los datos recibidos para debug
            Log::debug('Datos recibidos para crear cita:', [
                'especialista_id' => $request->especialista_id,
                'fecha_cita' => $request->fecha_cita,
                'hora_inicio' => $request->hora_inicio,
                'hora_fin' => $request->hora_fin,
                'paciente_id' => $request->paciente_id,
                'nombre_paciente' => $request->nombre_paciente
            ]);

            // Manejar paciente: crear nuevo o usar existente
            $pacienteId = $request->paciente_id;
            
            if (!$pacienteId && $request->nombre_paciente) {
                // Crear nuevo paciente
                $nombres = explode(' ', trim($request->nombre_paciente), 2);
                $nombre = $nombres[0];
                $apellido = isset($nombres[1]) ? $nombres[1] : '';
                
                $paciente = PacienteMejorado::create([
                    'Nombre' => $nombre,
                    'Apellido' => $apellido,
                    'Correo_Electronico' => 'nuevo@paciente.com', // Email temporal
                    'Telefono' => '000-000-0000', // Teléfono temporal
                    'Fecha_Nacimiento' => '1990-01-01', // Fecha temporal
                    'Genero' => 'No especificado',
                    'Direccion' => 'Dirección por definir',
                    'Tipo_Sangre' => 'No especificado',
                    'Estatus' => 'Activo',
                    'ID_H_O_D' => $request->header('X-Hospital-ID', 'HOSP001'),
                    'Agregado_Por' => $request->header('X-User-ID', 'system')
                ]);
                
                $pacienteId = $paciente->Paciente_ID;
                
                Log::info('Nuevo paciente creado automáticamente', [
                    'paciente_id' => $pacienteId,
                    'nombre_completo' => $request->nombre_paciente
                ]);
            }

            // Verificar que el horario esté disponible usando Horarios_Citas_Ext
            $horarioDisponible = HorarioCitaExt::where('FK_Especialista', $request->especialista_id)
                ->whereHas('fecha', function($q) use ($request) {
                    $q->where('Fecha_Disponibilidad', $request->fecha_cita);
                })
                ->where('Horario_Disponibilidad', $request->hora_inicio)
                ->where('Estado', 'Disponible')
                ->first();

            // Si no encontramos el horario, buscar todos los horarios disponibles para debug
            if (!$horarioDisponible) {
                $horariosDisponibles = HorarioCitaExt::where('FK_Especialista', $request->especialista_id)
                    ->whereHas('fecha', function($q) use ($request) {
                        $q->where('Fecha_Disponibilidad', $request->fecha_cita);
                    })
                    ->where('Estado', 'Disponible')
                    ->get();

                Log::debug('Horarios disponibles encontrados:', [
                    'total_horarios' => $horariosDisponibles->count(),
                    'horarios' => $horariosDisponibles->map(function($h) {
                        return [
                            'id' => $h->ID_Horario,
                            'hora' => $h->Horario_Disponibilidad,
                            'estado' => $h->Estado
                        ];
                    })->toArray(),
                    'hora_buscada' => $request->hora_inicio
                ]);
            }

            // Log del resultado de la búsqueda
            Log::debug('Resultado de búsqueda de horario:', [
                'horario_encontrado' => $horarioDisponible ? 'SÍ' : 'NO',
                'horario_id' => $horarioDisponible ? $horarioDisponible->ID_Horario : null,
                'horario_estado' => $horarioDisponible ? $horarioDisponible->Estado : null
            ]);

            if (!$horarioDisponible) {
                return response()->json([
                    'success' => false,
                    'message' => 'El horario seleccionado no está disponible'
                ], 400);
            }

            // Crear la cita
            $cita = CitaMejorada::create([
                'Titulo' => $request->titulo,
                'Descripcion' => $request->descripcion,
                'Fk_Paciente' => $pacienteId, // Usar el ID del paciente (existente o nuevo)
                'Fk_Especialista' => $request->especialista_id,
                'Fk_Sucursal' => $request->sucursal_id,
                'Fk_Consultorio' => $request->consultorio_id,
                'Fk_Horario' => $horarioDisponible->ID_Horario, // Agregar el ID del horario específico
                'Fecha_Cita' => $request->fecha_cita,
                'Hora_Inicio' => $request->hora_inicio,
                'Hora_Fin' => $request->hora_fin,
                'Tipo_Cita' => $request->tipo_cita,
                'Estado_Cita' => 'Pendiente',
                'Costo' => $request->costo ?? 0.00,
                'Notas_Adicionales' => $request->notas_adicionales,
                'Color_Calendario' => $request->color_calendario ?? '#1976d2',
                'ID_H_O_D' => $request->header('X-Hospital-ID', 'default'),
                'Agregado_Por' => $request->header('X-User-ID', 'system')
            ]);

            // Marcar el horario como ocupado en Horarios_Citas_Ext
            $horarioDisponible->update(['Estado' => 'Ocupado']);

            DB::commit();

            Log::info('Cita creada exitosamente', [
                'cita_id' => $cita->Cita_ID,
                'paciente_id' => $pacienteId,
                'especialista_id' => $request->especialista_id,
                'fecha' => $request->fecha_cita,
                'hora' => $request->hora_inicio
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cita creada exitosamente',
                'data' => $cita->load(['paciente', 'especialista.especialidad', 'sucursal', 'consultorio'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear cita', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear la cita',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener una cita específica
     */
    public function show($id)
    {
        try {
            $cita = CitaMejorada::with([
                'paciente',
                'especialista.especialidad',
                'sucursal',
                'consultorio'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Cita obtenida exitosamente',
                'data' => $cita
            ]);

        } catch (\Exception $e) {
            Log::error('Error al obtener cita', [
                'cita_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la cita',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar una cita existente
     */
    public function update(Request $request, $id)
    {
        try {
            $cita = CitaMejorada::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'titulo' => 'sometimes|required|string|max:200',
                'descripcion' => 'nullable|string',
                'paciente_id' => 'sometimes|required|exists:pacientes_mejorados,Paciente_ID',
                'especialista_id' => 'sometimes|required|exists:especialistas,Especialista_ID',
                'sucursal_id' => 'sometimes|required|exists:sucursales_mejoradas,Sucursal_ID',
                'consultorio_id' => 'nullable|exists:consultorios_mejorados,Consultorio_ID',
                'fecha_cita' => 'sometimes|required|date|after_or_equal:today',
                'hora_inicio' => 'sometimes|required|date_format:H:i',
                'hora_fin' => 'sometimes|required|date_format:H:i|after:hora_inicio',
                'tipo_cita' => 'sometimes|required|in:Consulta,Control,Urgencia,Procedimiento,Cirugía,Rehabilitación,Psicología,Nutrición,Pediatría',
                'estado_cita' => 'sometimes|required|in:Pendiente,Confirmada,En Proceso,Completada,Cancelada,No Asistió',
                'costo' => 'nullable|numeric|min:0',
                'notas_adicionales' => 'nullable|string',
                'color_calendario' => 'nullable|string|max:7'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Si se cambia la fecha o hora, verificar disponibilidad
            if (($request->filled('fecha_cita') && $request->fecha_cita != $cita->Fecha_Cita) ||
                ($request->filled('hora_inicio') && $request->hora_inicio != $cita->Hora_Inicio)) {
                
                $nuevaFecha = $request->fecha_cita ?? $cita->Fecha_Cita;
                $nuevaHora = $request->hora_inicio ?? $cita->Hora_Inicio;

                // Verificar que el nuevo horario esté disponible
                $horarioDisponible = HorarioDisponible::whereHas('programacion', function($q) use ($cita, $request) {
                    $q->where('Fk_Especialista', $request->especialista_id ?? $cita->Fk_Especialista)
                      ->where('Fk_Sucursal', $request->sucursal_id ?? $cita->Fk_Sucursal);
                })
                ->where('Fecha', $nuevaFecha)
                ->where('Hora', $nuevaHora)
                ->disponible()
                ->activa()
                ->first();

                if (!$horarioDisponible) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El nuevo horario seleccionado no está disponible'
                    ], 400);
                }

                // Liberar el horario anterior
                $horarioAnterior = HorarioDisponible::whereHas('programacion', function($q) use ($cita) {
                    $q->where('Fk_Especialista', $cita->Fk_Especialista)
                      ->where('Fk_Sucursal', $cita->Fk_Sucursal);
                })
                ->where('Fecha', $cita->Fecha_Cita)
                ->where('Hora', $cita->Hora_Inicio)
                ->first();

                if ($horarioAnterior) {
                    $horarioAnterior->marcarComoDisponible();
                }

                // Ocupar el nuevo horario
                $horarioDisponible->marcarComoOcupado();
            }

            // Actualizar la cita
            $cita->update($request->only([
                'Titulo', 'Descripcion', 'Fk_Paciente', 'Fk_Especialista', 'Fk_Sucursal',
                'Fk_Consultorio', 'Fecha_Cita', 'Hora_Inicio', 'Hora_Fin', 'Tipo_Cita',
                'Estado_Cita', 'Costo', 'Notas_Adicionales', 'Color_Calendario'
            ]));

            // Si se cancela la cita, liberar el horario
            if ($request->filled('estado_cita') && $request->estado_cita === 'Cancelada') {
                $horario = HorarioDisponible::whereHas('programacion', function($q) use ($cita) {
                    $q->where('Fk_Especialista', $cita->Fk_Especialista)
                      ->where('Fk_Sucursal', $cita->Fk_Sucursal);
                })
                ->where('Fecha', $cita->Fecha_Cita)
                ->where('Hora', $cita->Hora_Inicio)
                ->first();

                if ($horario) {
                    $horario->marcarComoDisponible();
                }
            }

            DB::commit();

            Log::info('Cita actualizada exitosamente', [
                'cita_id' => $id,
                'estado_anterior' => $cita->getOriginal('Estado_Cita'),
                'estado_nuevo' => $cita->Estado_Cita
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cita actualizada exitosamente',
                'data' => $cita->load(['paciente', 'especialista.especialidad', 'sucursal', 'consultorio'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar cita', [
                'cita_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la cita',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una cita
     */
    public function destroy($id)
    {
        try {
            $cita = CitaMejorada::findOrFail($id);

            DB::beginTransaction();

            // Liberar el horario
            $horario = HorarioDisponible::whereHas('programacion', function($q) use ($cita) {
                $q->where('Fk_Especialista', $cita->Fk_Especialista)
                  ->where('Fk_Sucursal', $cita->Fk_Sucursal);
            })
            ->where('Fecha', $cita->Fecha_Cita)
            ->where('Hora', $cita->Hora_Inicio)
            ->first();

            if ($horario) {
                $horario->marcarComoDisponible();
            }

            $cita->delete();

            DB::commit();

            Log::info('Cita eliminada exitosamente', [
                'cita_id' => $id,
                'paciente_id' => $cita->Fk_Paciente,
                'especialista_id' => $cita->Fk_Especialista
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cita eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al eliminar cita', [
                'cita_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la cita',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cambiar estado de una cita
     */
    public function cambiarEstado(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'estado' => 'required|in:Pendiente,Confirmada,En Proceso,Completada,Cancelada,No Asistió'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $cita = CitaMejorada::findOrFail($id);
            $estadoAnterior = $cita->Estado_Cita;

            DB::beginTransaction();

            // Actualizar estado
            $cita->update(['Estado_Cita' => $request->estado]);

            // Si se cancela o no asiste, liberar el horario
            if (in_array($request->estado, ['Cancelada', 'No Asistió'])) {
                $horario = HorarioDisponible::whereHas('programacion', function($q) use ($cita) {
                    $q->where('Fk_Especialista', $cita->Fk_Especialista)
                      ->where('Fk_Sucursal', $cita->Fk_Sucursal);
                })
                ->where('Fecha', $cita->Fecha_Cita)
                ->where('Hora', $cita->Hora_Inicio)
                ->first();

                if ($horario) {
                    $horario->marcarComoDisponible();
                }
            }

            // Si se reactiva desde cancelada/no asistió, ocupar el horario
            if (in_array($estadoAnterior, ['Cancelada', 'No Asistió']) && 
                !in_array($request->estado, ['Cancelada', 'No Asistió'])) {
                
                $horario = HorarioDisponible::whereHas('programacion', function($q) use ($cita) {
                    $q->where('Fk_Especialista', $cita->Fk_Especialista)
                      ->where('Fk_Sucursal', $cita->Fk_Sucursal);
                })
                ->where('Fecha', $cita->Fecha_Cita)
                ->where('Hora', $cita->Hora_Inicio)
                ->first();

                if ($horario) {
                    $horario->marcarComoOcupado();
                }
            }

            DB::commit();

            Log::info('Estado de cita cambiado', [
                'cita_id' => $id,
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $request->estado
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Estado de cita cambiado exitosamente',
                'data' => $cita->load(['paciente', 'especialista.especialidad', 'sucursal', 'consultorio'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al cambiar estado de cita', [
                'cita_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el estado de la cita',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
