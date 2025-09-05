<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class SeedProgramacionData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Insertar datos de ejemplo en programacion_especialistas
        $programaciones = [
            [
                'Fk_Especialista' => 1, // Dr. Juan Carlos Pérez González
                'Fk_Sucursal' => 1, // Sucursal Centro
                'Fk_Consultorio' => 1, // Consultorio 1
                'Tipo_Programacion' => 'Regular',
                'Fecha_Inicio' => '2025-08-27',
                'Fecha_Fin' => '2025-08-30',
                'Hora_Inicio' => '08:00:00',
                'Hora_Fin' => '12:00:00',
                'Intervalo_Citas' => 30,
                'Notas' => 'Programación regular de la semana',
                'Estatus' => 'Activa',
                'ID_H_O_D' => 'SALUD001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'Fk_Especialista' => 2, // Dr. Carlos Alberto Rodríguez Silva
                'Fk_Sucursal' => 2, // Sucursal Norte
                'Fk_Consultorio' => 3, // Consultorio 3
                'Tipo_Programacion' => 'Regular',
                'Fecha_Inicio' => '2025-08-27',
                'Fecha_Fin' => '2025-08-29',
                'Hora_Inicio' => '14:00:00',
                'Hora_Fin' => '18:00:00',
                'Intervalo_Citas' => 45,
                'Notas' => 'Programación de tarde',
                'Estatus' => 'Activa',
                'ID_H_O_D' => 'SALUD001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'Fk_Especialista' => 1, // Dr. Juan Carlos Pérez González
                'Fk_Sucursal' => 1, // Sucursal Centro
                'Fk_Consultorio' => 2, // Consultorio 2
                'Tipo_Programacion' => 'Especial',
                'Fecha_Inicio' => '2025-09-02',
                'Fecha_Fin' => '2025-09-05',
                'Hora_Inicio' => '09:00:00',
                'Hora_Fin' => '11:00:00',
                'Intervalo_Citas' => 20,
                'Notas' => 'Programación especial para consultas rápidas',
                'Estatus' => 'Pausada',
                'ID_H_O_D' => 'SALUD001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($programaciones as $programacion) {
            DB::table('programacion_especialistas')->insert($programacion);
        }

        // Obtener las programaciones insertadas para generar horarios disponibles
        $programacionesInsertadas = DB::table('programacion_especialistas')->get();

        foreach ($programacionesInsertadas as $programacion) {
            $this->generarHorariosDisponibles($programacion);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Eliminar horarios disponibles
        DB::table('horarios_disponibles')->truncate();
        
        // Eliminar programaciones
        DB::table('programacion_especialistas')->truncate();
    }

    /**
     * Generar horarios disponibles para una programación
     */
    private function generarHorariosDisponibles($programacion)
    {
        $fechaInicio = \Carbon\Carbon::parse($programacion->Fecha_Inicio);
        $fechaFin = \Carbon\Carbon::parse($programacion->Fecha_Fin);
        $horaInicio = \Carbon\Carbon::parse($programacion->Hora_Inicio);
        $horaFin = \Carbon\Carbon::parse($programacion->Hora_Fin);
        $intervalo = $programacion->Intervalo_Citas;

        $fechaActual = $fechaInicio->copy();
        
        while ($fechaActual->lte($fechaFin)) {
            $horaActual = $horaInicio->copy();
            
            while ($horaActual->lt($horaFin)) {
                $horario = [
                    'Fk_Programacion' => $programacion->Programacion_ID,
                    'Fecha' => $fechaActual->format('Y-m-d'),
                    'Hora' => $horaActual->format('H:i:s'),
                    'Estatus' => 'Disponible',
                    'ID_H_O_D' => 'SALUD001',
                    'Agregado_Por' => 'Sistema',
                    'Agregado_El' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                DB::table('horarios_disponibles')->insert($horario);
                
                $horaActual->addMinutes($intervalo);
            }
            
            $fechaActual->addDay();
        }
    }
}
