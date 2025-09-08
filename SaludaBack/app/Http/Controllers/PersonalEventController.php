<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PersonalEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PersonalEventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $userId = $request->get('user_id');
            
            \Log::info('🔍 PersonalEventController::index - Usuario ID:', ['user_id' => $userId]);
            \Log::info('📋 Parámetros recibidos:', $request->all());
            
            if (!$userId) {
                \Log::warning('❌ ID de usuario no proporcionado');
                return response()->json([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ], 400);
            }

            $query = PersonalEvent::forUser($userId)->active();
            \Log::info('🔍 Query base creada para usuario:', ['user_id' => $userId]);

            // Filtros opcionales
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->inDateRange($request->start_date, $request->end_date);
                \Log::info('📅 Filtro de fechas aplicado:', [
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date
                ]);
            }

            if ($request->has('event_type')) {
                $query->where('event_type', $request->event_type);
                \Log::info('🏷️ Filtro de tipo aplicado:', ['event_type' => $request->event_type]);
            }

            $events = $query->orderBy('event_date', 'asc')
                          ->orderBy('start_time', 'asc')
                          ->get();

            \Log::info('📊 Eventos encontrados:', [
                'count' => $events->count(),
                'events' => $events->toArray()
            ]);

            return response()->json([
                'success' => true,
                'data' => $events,
                'message' => 'Eventos obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener eventos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            \Log::info('💾 PersonalEventController::store - Datos recibidos:', $request->all());
            
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:personal_pos,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'event_date' => 'required|date',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
                'event_type' => 'nullable|string|max:50',
                'color' => 'nullable|string|max:7',
                'all_day' => 'boolean',
                'location' => 'nullable|string|max:255',
                'reminder_settings' => 'nullable|array',
                'is_recurring' => 'boolean',
                'recurrence_pattern' => 'nullable|in:daily,weekly,monthly,yearly',
                'recurrence_end_date' => 'nullable|date|after:event_date'
            ]);

            if ($validator->fails()) {
                \Log::error('❌ Error de validación:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            \Log::info('✅ Validación exitosa, creando evento...');
            $event = PersonalEvent::create($request->all());
            \Log::info('🎉 Evento creado exitosamente:', $event->toArray());

            return response()->json([
                'success' => true,
                'data' => $event,
                'message' => 'Evento creado exitosamente'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear evento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $event = PersonalEvent::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $event,
                'message' => 'Evento obtenido exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Evento no encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $event = PersonalEvent::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'event_date' => 'sometimes|required|date',
                'start_time' => 'sometimes|required|date_format:H:i',
                'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
                'event_type' => 'nullable|string|max:50',
                'color' => 'nullable|string|max:7',
                'all_day' => 'boolean',
                'location' => 'nullable|string|max:255',
                'reminder_settings' => 'nullable|array',
                'is_recurring' => 'boolean',
                'recurrence_pattern' => 'nullable|in:daily,weekly,monthly,yearly',
                'recurrence_end_date' => 'nullable|date|after:event_date',
                'status' => 'nullable|in:active,completed,cancelled'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $event->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $event,
                'message' => 'Evento actualizado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar evento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $event = PersonalEvent::findOrFail($id);
            $event->delete();

            return response()->json([
                'success' => true,
                'message' => 'Evento eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar evento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener eventos de hoy para el usuario
     */
    public function today(Request $request)
    {
        try {
            $userId = $request->get('user_id');
            
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ], 400);
            }

            $events = PersonalEvent::forUser($userId)
                                 ->active()
                                 ->today()
                                 ->orderBy('start_time', 'asc')
                                 ->get();

            return response()->json([
                'success' => true,
                'data' => $events,
                'message' => 'Eventos de hoy obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener eventos de hoy: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener estadísticas de eventos del usuario
     */
    public function stats(Request $request)
    {
        try {
            $userId = $request->get('user_id');
            
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ], 400);
            }

            $totalEvents = PersonalEvent::forUser($userId)->count();
            $activeEvents = PersonalEvent::forUser($userId)->active()->count();
            $completedEvents = PersonalEvent::forUser($userId)->where('status', 'completed')->count();
            $cancelledEvents = PersonalEvent::forUser($userId)->where('status', 'cancelled')->count();
            $todayEvents = PersonalEvent::forUser($userId)->active()->today()->count();
            $thisWeekEvents = PersonalEvent::forUser($userId)->active()->thisWeek()->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_events' => $totalEvents,
                    'active_events' => $activeEvents,
                    'completed_events' => $completedEvents,
                    'cancelled_events' => $cancelledEvents,
                    'today_events' => $todayEvents,
                    'this_week_events' => $thisWeekEvents
                ],
                'message' => 'Estadísticas obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], 500);
        }
    }
}
