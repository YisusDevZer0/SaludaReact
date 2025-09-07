<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Vista para citas del día
        DB::statement("
            CREATE VIEW v_citas_hoy AS
            SELECT 
                c.Cita_ID,
                c.Titulo,
                c.Fecha_Cita,
                c.Hora_Inicio,
                c.Hora_Fin,
                c.Estado_Cita,
                c.Tipo_Cita,
                CONCAT(p.Nombre, ' ', p.Apellido) AS Paciente_Nombre,
                p.Telefono AS Paciente_Telefono,
                e.Nombre_Completo AS Especialista_Nombre,
                esp.Nombre_Especialidad AS Especialidad_Nombre,
                s.Nombre_Sucursal AS Sucursal_Nombre,
                co.Nombre_Consultorio AS Consultorio_Nombre,
                c.Color_Calendario
            FROM citas_mejoradas c
            JOIN pacientes_mejorados p ON c.Fk_Paciente = p.Paciente_ID
            JOIN especialistas e ON c.Fk_Especialista = e.Especialista_ID
            JOIN especialidades esp ON e.Fk_Especialidad = esp.Especialidad_ID
            JOIN sucursales_mejoradas s ON c.Fk_Sucursal = s.Sucursal_ID
            LEFT JOIN consultorios_mejorados co ON c.Fk_Consultorio = co.Consultorio_ID
            WHERE c.Fecha_Cita = CURDATE()
            AND c.Estado_Cita IN ('Pendiente', 'Confirmada', 'En Proceso')
            ORDER BY c.Hora_Inicio ASC
        ");

        // Vista para estadísticas de citas
        DB::statement("
            CREATE VIEW v_estadisticas_citas AS
            SELECT 
                COUNT(*) AS Total_Citas,
                COUNT(CASE WHEN Estado_Cita = 'Pendiente' THEN 1 END) AS Citas_Pendientes,
                COUNT(CASE WHEN Estado_Cita = 'Confirmada' THEN 1 END) AS Citas_Confirmadas,
                COUNT(CASE WHEN Estado_Cita = 'En Proceso' THEN 1 END) AS Citas_En_Proceso,
                COUNT(CASE WHEN Estado_Cita = 'Completada' THEN 1 END) AS Citas_Completadas,
                COUNT(CASE WHEN Estado_Cita = 'Cancelada' THEN 1 END) AS Citas_Canceladas,
                COUNT(CASE WHEN Estado_Cita = 'No Asistió' THEN 1 END) AS Citas_No_Asistio,
                COUNT(CASE WHEN Fecha_Cita = CURDATE() THEN 1 END) AS Citas_Hoy,
                COUNT(CASE WHEN Fecha_Cita = CURDATE() + INTERVAL 1 DAY THEN 1 END) AS Citas_Manana
            FROM citas_mejoradas
            WHERE Fecha_Cita >= CURDATE() - INTERVAL 30 DAY
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS v_citas_hoy');
        DB::statement('DROP VIEW IF EXISTS v_estadisticas_citas');
    }
};
