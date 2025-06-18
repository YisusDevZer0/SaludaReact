<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personal;
use App\Models\Asistencia;
use Illuminate\Support\Facades\DB;

class AsistenciaEloquentController extends Controller
{
    /**
     * Obtener asistencia del día actual usando Eloquent
     */
    public function getAsistenciaHoy()
    {
        try {
            // Usar consulta SQL raw para asegurar que los IDs se mapeen correctamente
            $asistencia = DB::connection('mysql_second')
                ->select("
                    SELECT
                        p.Id_pernl AS Id_Pernl,
                        p.Cedula AS Cedula,
                        p.Nombre_Completo AS Nombre_Completo,
                        p.Sexo AS Sexo,
                        p.Cargo_rol AS Cargo_rol,
                        p.Domicilio AS Domicilio,
                        a.Id_asis AS Id_asis,
                        a.FechaAsis AS FechaAsis,
                        a.Nombre_dia AS Nombre_dia,
                        a.HoIngreso AS HoIngreso,
                        a.HoSalida AS HoSalida,
                        a.Tardanzas AS Tardanzas,
                        a.Justifacion AS Justifacion,
                        a.tipoturno AS tipoturno,
                        a.EstadoAsis AS EstadoAsis,
                        a.totalhora_tr AS totalhora_tr
                    FROM
                        personal p
                    JOIN asistenciaper a
                        ON a.Id_Pernl = p.Id_pernl
                    WHERE
                        a.FechaAsis = CURDATE()
                    ORDER BY p.Nombre_Completo
                ");

            return response()->json([
                'success' => true,
                'data' => $asistencia,
                'count' => count($asistencia),
                'fecha' => date('Y-m-d')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener asistencia: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener asistencia por fecha específica usando Eloquent
     */
    public function getAsistenciaPorFecha(Request $request)
    {
        try {
            $request->validate([
                'fecha' => 'required|date_format:Y-m-d'
            ]);

            $fecha = $request->fecha;

            // Usar consulta SQL raw para asegurar que los IDs se mapeen correctamente
            $asistencia = DB::connection('mysql_second')
                ->select("
                    SELECT
                        p.Id_pernl AS Id_Pernl,
                        p.Cedula AS Cedula,
                        p.Nombre_Completo AS Nombre_Completo,
                        p.Sexo AS Sexo,
                        p.Cargo_rol AS Cargo_rol,
                        p.Domicilio AS Domicilio,
                        a.Id_asis AS Id_asis,
                        a.FechaAsis AS FechaAsis,
                        a.Nombre_dia AS Nombre_dia,
                        a.HoIngreso AS HoIngreso,
                        a.HoSalida AS HoSalida,
                        a.Tardanzas AS Tardanzas,
                        a.Justifacion AS Justifacion,
                        a.tipoturno AS tipoturno,
                        a.EstadoAsis AS EstadoAsis,
                        a.totalhora_tr AS totalhora_tr
                    FROM
                        personal p
                    JOIN asistenciaper a
                        ON a.Id_Pernl = p.Id_pernl
                    WHERE
                        a.FechaAsis = ?
                    ORDER BY p.Nombre_Completo
                ", [$fecha]);

            return response()->json([
                'success' => true,
                'data' => $asistencia,
                'count' => count($asistencia),
                'fecha' => $fecha
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener asistencia: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener asistencia por rango de fechas usando Eloquent
     */
    public function getAsistenciaPorRango(Request $request)
    {
        try {
            $request->validate([
                'fecha_inicio' => 'required|date_format:Y-m-d',
                'fecha_fin' => 'required|date_format:Y-m-d|after_or_equal:fecha_inicio'
            ]);

            $fechaInicio = $request->fecha_inicio;
            $fechaFin = $request->fecha_fin;

            // Usar consulta SQL raw para asegurar que los IDs se mapeen correctamente
            $asistencia = DB::connection('mysql_second')
                ->select("
                    SELECT
                        p.Id_pernl AS Id_Pernl,
                        p.Cedula AS Cedula,
                        p.Nombre_Completo AS Nombre_Completo,
                        p.Sexo AS Sexo,
                        p.Cargo_rol AS Cargo_rol,
                        p.Domicilio AS Domicilio,
                        a.Id_asis AS Id_asis,
                        a.FechaAsis AS FechaAsis,
                        a.Nombre_dia AS Nombre_dia,
                        a.HoIngreso AS HoIngreso,
                        a.HoSalida AS HoSalida,
                        a.Tardanzas AS Tardanzas,
                        a.Justifacion AS Justifacion,
                        a.tipoturno AS tipoturno,
                        a.EstadoAsis AS EstadoAsis,
                        a.totalhora_tr AS totalhora_tr
                    FROM
                        personal p
                    JOIN asistenciaper a
                        ON a.Id_Pernl = p.Id_pernl
                    WHERE
                        a.FechaAsis BETWEEN ? AND ?
                    ORDER BY a.FechaAsis DESC, p.Nombre_Completo
                ", [$fechaInicio, $fechaFin]);

            return response()->json([
                'success' => true,
                'data' => $asistencia,
                'count' => count($asistencia),
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener asistencia: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener asistencia por empleado específico usando Eloquent
     */
    public function getAsistenciaPorEmpleado(Request $request)
    {
        try {
            $request->validate([
                'id_personal' => 'required|integer',
                'fecha_inicio' => 'date_format:Y-m-d',
                'fecha_fin' => 'date_format:Y-m-d|after_or_equal:fecha_inicio'
            ]);

            $idPersonal = $request->id_personal;
            $fechaInicio = $request->fecha_inicio ?? date('Y-m-01');
            $fechaFin = $request->fecha_fin ?? date('Y-m-d');

            $personal = Personal::with(['asistenciaPorRango' => function ($query) use ($fechaInicio, $fechaFin) {
                $query->whereBetween('FechaAsis', [$fechaInicio, $fechaFin]);
            }])
            ->find($idPersonal);

            if (!$personal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Empleado no encontrado'
                ], 404);
            }

            $asistencia = $personal->asistenciaPorRango($fechaInicio, $fechaFin)->get()
                ->map(function ($asistencia) use ($personal) {
                    return [
                        'Id_Pernl' => $asistencia->Id_Pernl,
                        'Cedula' => $personal->Cedula,
                        'Nombre_Completo' => $personal->Nombre_Completo,
                        'Sexo' => $personal->Sexo,
                        'Cargo_rol' => $personal->Cargo_rol,
                        'Domicilio' => $personal->Domicilio,
                        'Id_asis' => $asistencia->Id_asis,
                        'FechaAsis' => $asistencia->FechaAsis,
                        'Nombre_dia' => $asistencia->Nombre_dia,
                        'HoIngreso' => $asistencia->HoIngreso,
                        'HoSalida' => $asistencia->HoSalida,
                        'Tardanzas' => $asistencia->Tardanzas,
                        'Justifacion' => $asistencia->Justifacion,
                        'tipoturno' => $asistencia->tipoturno,
                        'EstadoAsis' => $asistencia->EstadoAsis,
                        'totalhora_tr' => $asistencia->totalhora_tr,
                        'horas_trabajadas' => $asistencia->horas_trabajadas,
                        'tiene_tardanza' => $asistencia->tiene_tardanza,
                        'esta_justificado' => $asistencia->esta_justificado
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $asistencia,
                'count' => $asistencia->count(),
                'empleado' => [
                    'id' => $personal->Id_pernl,
                    'nombre' => $personal->Nombre_Completo,
                    'cargo' => $personal->Cargo_rol,
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener asistencia del empleado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener resumen de asistencia del día usando Eloquent
     */
    public function getResumenAsistenciaHoy()
    {
        try {
            $totalEmpleados = Personal::count();
            $presentes = Asistencia::porFecha(date('Y-m-d'))->porEstado('Presente')->count();
            $ausentes = Asistencia::porFecha(date('Y-m-d'))->porEstado('Ausente')->count();
            $tardanzas = Asistencia::porFecha(date('Y-m-d'))->porEstado('Tardanza')->count();
            $justificados = Asistencia::porFecha(date('Y-m-d'))->where('Justifacion', 'Sí')->count();
            $promedioHoras = Asistencia::porFecha(date('Y-m-d'))->avg('totalhora_tr');

            $resumen = [
                'total_empleados' => $totalEmpleados,
                'presentes' => $presentes,
                'ausentes' => $ausentes,
                'tardanzas' => $tardanzas,
                'justificados' => $justificados,
                'promedio_horas_trabajadas' => round($promedioHoras, 2)
            ];

            return response()->json([
                'success' => true,
                'data' => $resumen,
                'fecha' => date('Y-m-d')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener resumen: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener resumen de asistencia por rango de fechas usando Eloquent
     */
    public function getResumenAsistenciaPorRango(Request $request)
    {
        try {
            $request->validate([
                'fecha_inicio' => 'required|date_format:Y-m-d',
                'fecha_fin' => 'required|date_format:Y-m-d|after_or_equal:fecha_inicio'
            ]);

            $fechaInicio = $request->fecha_inicio;
            $fechaFin = $request->fecha_fin;

            $totalRegistros = Asistencia::porRangoFechas($fechaInicio, $fechaFin)->count();
            $presentes = Asistencia::porRangoFechas($fechaInicio, $fechaFin)->porEstado('Presente')->count();
            $ausentes = Asistencia::porRangoFechas($fechaInicio, $fechaFin)->porEstado('Ausente')->count();
            $tardanzas = Asistencia::porRangoFechas($fechaInicio, $fechaFin)->porEstado('Tardanza')->count();
            $justificados = Asistencia::porRangoFechas($fechaInicio, $fechaFin)->where('Justifacion', 'Sí')->count();
            $promedioHoras = Asistencia::porRangoFechas($fechaInicio, $fechaFin)->avg('totalhora_tr');
            $empleadosUnicos = Asistencia::porRangoFechas($fechaInicio, $fechaFin)->distinct('Id_Pernl')->count();
            $diasLaborados = Asistencia::porRangoFechas($fechaInicio, $fechaFin)->distinct('FechaAsis')->count();

            $resumen = [
                'total_registros' => $totalRegistros,
                'empleados_unicos' => $empleadosUnicos,
                'dias_laborados' => $diasLaborados,
                'presentes' => $presentes,
                'ausentes' => $ausentes,
                'tardanzas' => $tardanzas,
                'justificados' => $justificados,
                'promedio_horas_trabajadas' => round($promedioHoras, 2),
                'porcentaje_asistencia' => $totalRegistros > 0 ? round(($presentes / $totalRegistros) * 100, 2) : 0
            ];

            return response()->json([
                'success' => true,
                'data' => $resumen,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener resumen por rango: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener empleados sin asistencia registrada hoy usando Eloquent
     */
    public function getEmpleadosSinAsistenciaHoy()
    {
        try {
            $empleados = Personal::whereDoesntHave('asistenciaHoy')
                ->orderBy('Nombre_Completo')
                ->get()
                ->map(function ($personal) {
                    return [
                        'Id_Pernl' => $personal->Id_pernl,
                        'Cedula' => $personal->Cedula,
                        'Nombre_Completo' => $personal->Nombre_Completo,
                        'Sexo' => $personal->Sexo,
                        'Cargo_rol' => $personal->Cargo_rol,
                        'Domicilio' => $personal->Domicilio
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $empleados,
                'count' => $empleados->count(),
                'fecha' => date('Y-m-d')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener empleados sin asistencia: ' . $e->getMessage()
            ], 500);
        }
    }
} 