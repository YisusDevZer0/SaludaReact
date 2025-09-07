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
        // Insertar datos de ejemplo en citas_mejoradas
        $citas_mejoradas = [
            [
                'Titulo' => 'Consulta General - Control Rutinario',
                'Descripcion' => 'Control rutinario de salud general',
                'Fk_Paciente' => 1,
                'Fk_Especialista' => 1,
                'Fk_Sucursal' => 1,
                'Fk_Consultorio' => 1,
                'Fecha_Cita' => now()->addDays(1)->format('Y-m-d'),
                'Hora_Inicio' => '09:00:00',
                'Hora_Fin' => '09:30:00',
                'Tipo_Cita' => 'Control',
                'Estado_Cita' => 'Confirmada',
                'Costo' => 45.00,
                'Notas_Adicionales' => 'Paciente solicita control de presión arterial',
                'Color_Calendario' => '#1976d2',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Titulo' => 'Consulta Cardiológica - Evaluación',
                'Descripcion' => 'Evaluación cardiológica completa',
                'Fk_Paciente' => 2,
                'Fk_Especialista' => 2,
                'Fk_Sucursal' => 1,
                'Fk_Consultorio' => 2,
                'Fecha_Cita' => now()->addDays(2)->format('Y-m-d'),
                'Hora_Inicio' => '10:00:00',
                'Hora_Fin' => '10:45:00',
                'Tipo_Cita' => 'Consulta',
                'Estado_Cita' => 'Pendiente',
                'Costo' => 80.00,
                'Notas_Adicionales' => 'Traer resultados de análisis previos',
                'Color_Calendario' => '#e74c3c',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Titulo' => 'Consulta Pediátrica - Control Niño',
                'Descripcion' => 'Control pediátrico de rutina',
                'Fk_Paciente' => 3,
                'Fk_Especialista' => 3,
                'Fk_Sucursal' => 1,
                'Fk_Consultorio' => 3,
                'Fecha_Cita' => now()->addDays(1)->format('Y-m-d'),
                'Hora_Inicio' => '14:00:00',
                'Hora_Fin' => '14:30:00',
                'Tipo_Cita' => 'Control',
                'Estado_Cita' => 'Confirmada',
                'Costo' => 55.00,
                'Notas_Adicionales' => 'Control de crecimiento y desarrollo',
                'Color_Calendario' => '#f39c12',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Titulo' => 'Consulta Ginecológica - Control',
                'Descripcion' => 'Control ginecológico anual',
                'Fk_Paciente' => 4,
                'Fk_Especialista' => 4,
                'Fk_Sucursal' => 2,
                'Fk_Consultorio' => 4,
                'Fecha_Cita' => now()->addDays(3)->format('Y-m-d'),
                'Hora_Inicio' => '08:00:00',
                'Hora_Fin' => '08:40:00',
                'Tipo_Cita' => 'Control',
                'Estado_Cita' => 'Pendiente',
                'Costo' => 70.00,
                'Notas_Adicionales' => 'Papanicolau anual',
                'Color_Calendario' => '#9b59b6',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Titulo' => 'Consulta Ortopédica - Dolor Rodilla',
                'Descripcion' => 'Evaluación por dolor en rodilla derecha',
                'Fk_Paciente' => 5,
                'Fk_Especialista' => 5,
                'Fk_Sucursal' => 3,
                'Fk_Consultorio' => 5,
                'Fecha_Cita' => now()->addDays(4)->format('Y-m-d'),
                'Hora_Inicio' => '15:00:00',
                'Hora_Fin' => '15:45:00',
                'Tipo_Cita' => 'Consulta',
                'Estado_Cita' => 'Pendiente',
                'Costo' => 75.00,
                'Notas_Adicionales' => 'Traer radiografías previas si las tiene',
                'Color_Calendario' => '#2ecc71',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($citas_mejoradas as $cita) {
            DB::table('citas_mejoradas')->insert($cita);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('citas_mejoradas')->truncate();
    }
};
