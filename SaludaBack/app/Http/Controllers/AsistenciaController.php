<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AsistenciaController extends Controller
{
    /**
     * Obtener asistencia del día actual
     */
    public function getAsistenciaHoy()
    {
        try {
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
                        u155356178_SaludaHuellas.personal p
                    JOIN u155356178_SaludaHuellas.asistenciaper a
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
     * Obtener asistencia por fecha específica
     */
    public function getAsistenciaPorFecha(Request $request)
    {
        try {
            $request->validate([
                'fecha' => 'required|date_format:Y-m-d'
            ]);

            $fecha = $request->fecha;

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
                        u155356178_SaludaHuellas.personal p
                    JOIN u155356178_SaludaHuellas.asistenciaper a
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
     * Obtener asistencia por rango de fechas
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
                        u155356178_SaludaHuellas.personal p
                    JOIN u155356178_SaludaHuellas.asistenciaper a
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
     * Obtener asistencia por empleado específico
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
            $fechaInicio = $request->fecha_inicio ?? date('Y-m-01'); // Primer día del mes actual
            $fechaFin = $request->fecha_fin ?? date('Y-m-d'); // Día actual

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
                        u155356178_SaludaHuellas.personal p
                    JOIN u155356178_SaludaHuellas.asistenciaper a
                        ON a.Id_Pernl = p.Id_pernl
                    WHERE
                        p.Id_pernl = ? AND a.FechaAsis BETWEEN ? AND ?
                    ORDER BY a.FechaAsis DESC
                ", [$idPersonal, $fechaInicio, $fechaFin]);

            return response()->json([
                'success' => true,
                'data' => $asistencia,
                'count' => count($asistencia),
                'empleado' => [
                    'id' => $idPersonal,
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
     * Obtener resumen de asistencia del día
     */
    public function getResumenAsistenciaHoy()
    {
        try {
            $resumen = DB::connection('mysql_second')
                ->select("
                    SELECT
                        COUNT(*) as total_empleados,
                        SUM(CASE WHEN a.EstadoAsis = 'Presente' THEN 1 ELSE 0 END) as presentes,
                        SUM(CASE WHEN a.EstadoAsis = 'Ausente' THEN 1 ELSE 0 END) as ausentes,
                        SUM(CASE WHEN a.EstadoAsis = 'Tardanza' THEN 1 ELSE 0 END) as tardanzas,
                        SUM(CASE WHEN a.Justifacion = 'Sí' THEN 1 ELSE 0 END) as justificados,
                        AVG(a.totalhora_tr) as promedio_horas_trabajadas
                    FROM
                        u155356178_SaludaHuellas.personal p
                    LEFT JOIN u155356178_SaludaHuellas.asistenciaper a
                        ON a.Id_Pernl = p.Id_pernl AND a.FechaAsis = CURDATE()
                ");

            return response()->json([
                'success' => true,
                'data' => $resumen[0] ?? null,
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
     * Obtener empleados sin asistencia registrada hoy
     */
    public function getEmpleadosSinAsistenciaHoy()
    {
        try {
            $empleados = DB::connection('mysql_second')
                ->select("
                    SELECT
                        p.Id_pernl AS Id_Pernl,
                        p.Cedula AS Cedula,
                        p.Nombre_Completo AS Nombre_Completo,
                        p.Sexo AS Sexo,
                        p.Cargo_rol AS Cargo_rol,
                        p.Domicilio AS Domicilio
                    FROM
                        u155356178_SaludaHuellas.personal p
                    LEFT JOIN u155356178_SaludaHuellas.asistenciaper a
                        ON a.Id_Pernl = p.Id_pernl AND a.FechaAsis = CURDATE()
                    WHERE
                        a.Id_asis IS NULL
                    ORDER BY p.Nombre_Completo
                ");

            return response()->json([
                'success' => true,
                'data' => $empleados,
                'count' => count($empleados),
                'fecha' => date('Y-m-d')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener empleados sin asistencia: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar conexión a la base de datos de asistencia
     */
    public function testConnection()
    {
        try {
            $result = DB::connection('mysql_second')->select('SELECT 1 as test');
            
            // Verificar que las tablas existen
            $tablas = DB::connection('mysql_second')
                ->select("SHOW TABLES LIKE 'personal'");
            
            $tablaAsistencia = DB::connection('mysql_second')
                ->select("SHOW TABLES LIKE 'asistenciaper'");
            
            return response()->json([
                'success' => true,
                'message' => 'Conexión exitosa a la base de datos de asistencia',
                'data' => [
                    'conexion' => $result,
                    'tabla_personal_existe' => count($tablas) > 0,
                    'tabla_asistencia_existe' => count($tablaAsistencia) > 0
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de conexión: ' . $e->getMessage()
            ], 500);
        }
    }
} 