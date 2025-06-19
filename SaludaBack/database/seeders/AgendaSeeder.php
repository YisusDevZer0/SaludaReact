<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AgendaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insertar doctores de prueba
        $doctores = [
            [
                'Nombre_Completo' => 'Dr. Juan Pérez',
                'Especialidad' => 'Cardiología',
                'Cedula_Profesional' => 'CARD001',
                'Correo_Electronico' => 'juan.perez@saluda.com',
                'Telefono' => '555-0101',
                'Consultorio_Asignado' => 'A-101',
                'Estado' => 'Activo',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Nombre_Completo' => 'Dra. María García',
                'Especialidad' => 'Dermatología',
                'Cedula_Profesional' => 'DERM001',
                'Correo_Electronico' => 'maria.garcia@saluda.com',
                'Telefono' => '555-0102',
                'Consultorio_Asignado' => 'A-102',
                'Estado' => 'Activo',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Nombre_Completo' => 'Dr. Carlos López',
                'Especialidad' => 'Ortopedia',
                'Cedula_Profesional' => 'ORT001',
                'Correo_Electronico' => 'carlos.lopez@saluda.com',
                'Telefono' => '555-0103',
                'Consultorio_Asignado' => 'A-103',
                'Estado' => 'Activo',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Nombre_Completo' => 'Dra. Ana Martínez',
                'Especialidad' => 'Ginecología',
                'Cedula_Profesional' => 'GIN001',
                'Correo_Electronico' => 'ana.martinez@saluda.com',
                'Telefono' => '555-0104',
                'Consultorio_Asignado' => 'A-104',
                'Estado' => 'Activo',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ]
        ];

        foreach ($doctores as $doctor) {
            DB::table('doctores')->insert($doctor);
        }

        // Insertar pacientes de prueba
        $pacientes = [
            [
                'Cedula' => '1234567890',
                'Nombre_Completo' => 'Roberto Hernández',
                'Fecha_Nacimiento' => '1985-03-15',
                'Sexo' => 'Masculino',
                'Correo_Electronico' => 'roberto.hernandez@email.com',
                'Telefono' => '555-1001',
                'Estado' => 'Activo',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Cedula' => '1234567891',
                'Nombre_Completo' => 'Laura Rodríguez',
                'Fecha_Nacimiento' => '1990-07-22',
                'Sexo' => 'Femenino',
                'Correo_Electronico' => 'laura.rodriguez@email.com',
                'Telefono' => '555-1002',
                'Estado' => 'Activo',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Cedula' => '1234567892',
                'Nombre_Completo' => 'Miguel Sánchez',
                'Fecha_Nacimiento' => '1978-11-08',
                'Sexo' => 'Masculino',
                'Correo_Electronico' => 'miguel.sanchez@email.com',
                'Telefono' => '555-1003',
                'Estado' => 'Activo',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Cedula' => '1234567893',
                'Nombre_Completo' => 'Carmen Flores',
                'Fecha_Nacimiento' => '1992-05-12',
                'Sexo' => 'Femenino',
                'Correo_Electronico' => 'carmen.flores@email.com',
                'Telefono' => '555-1004',
                'Estado' => 'Activo',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Cedula' => '1234567894',
                'Nombre_Completo' => 'Fernando Morales',
                'Fecha_Nacimiento' => '1983-09-30',
                'Sexo' => 'Masculino',
                'Correo_Electronico' => 'fernando.morales@email.com',
                'Telefono' => '555-1005',
                'Estado' => 'Activo',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ]
        ];

        foreach ($pacientes as $paciente) {
            DB::table('pacientes')->insert($paciente);
        }

        // Obtener IDs de doctores y pacientes
        $doctorIds = DB::table('doctores')->pluck('Doctor_ID')->toArray();
        $pacienteIds = DB::table('pacientes')->pluck('Paciente_ID')->toArray();
        $sucursalId = DB::table('Sucursales')->first()->ID_SucursalC ?? 1;

        // Insertar citas de prueba
        $citas = [
            // Citas para hoy
            [
                'Titulo_Cita' => 'Consulta de Cardiología',
                'Descripcion' => 'Revisión de rutina',
                'Fecha_Cita' => now()->format('Y-m-d'),
                'Hora_Inicio' => '09:00:00',
                'Hora_Fin' => '09:30:00',
                'Estado_Cita' => 'Confirmada',
                'Tipo_Cita' => 'Consulta General',
                'Consultorio' => 'A-101',
                'Costo' => 500.00,
                'Fk_Paciente' => $pacienteIds[0],
                'Fk_Doctor' => $doctorIds[0],
                'Fk_Sucursal' => $sucursalId,
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Titulo_Cita' => 'Consulta de Dermatología',
                'Descripcion' => 'Revisión de manchas en la piel',
                'Fecha_Cita' => now()->format('Y-m-d'),
                'Hora_Inicio' => '10:00:00',
                'Hora_Fin' => '10:30:00',
                'Estado_Cita' => 'Pendiente',
                'Tipo_Cita' => 'Consulta Especializada',
                'Consultorio' => 'A-102',
                'Costo' => 600.00,
                'Fk_Paciente' => $pacienteIds[1],
                'Fk_Doctor' => $doctorIds[1],
                'Fk_Sucursal' => $sucursalId,
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Titulo_Cita' => 'Consulta de Ortopedia',
                'Descripcion' => 'Dolor en rodilla',
                'Fecha_Cita' => now()->format('Y-m-d'),
                'Hora_Inicio' => '11:00:00',
                'Hora_Fin' => '11:30:00',
                'Estado_Cita' => 'En Proceso',
                'Tipo_Cita' => 'Consulta Especializada',
                'Consultorio' => 'A-103',
                'Costo' => 700.00,
                'Fk_Paciente' => $pacienteIds[2],
                'Fk_Doctor' => $doctorIds[2],
                'Fk_Sucursal' => $sucursalId,
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Titulo_Cita' => 'Consulta de Ginecología',
                'Descripcion' => 'Control prenatal',
                'Fecha_Cita' => now()->format('Y-m-d'),
                'Hora_Inicio' => '14:00:00',
                'Hora_Fin' => '14:30:00',
                'Estado_Cita' => 'Confirmada',
                'Tipo_Cita' => 'Consulta Especializada',
                'Consultorio' => 'A-104',
                'Costo' => 800.00,
                'Fk_Paciente' => $pacienteIds[3],
                'Fk_Doctor' => $doctorIds[3],
                'Fk_Sucursal' => $sucursalId,
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Titulo_Cita' => 'Consulta de Cardiología',
                'Descripcion' => 'Electrocardiograma',
                'Fecha_Cita' => now()->format('Y-m-d'),
                'Hora_Inicio' => '15:00:00',
                'Hora_Fin' => '15:30:00',
                'Estado_Cita' => 'Pendiente',
                'Tipo_Cita' => 'Examen',
                'Consultorio' => 'A-101',
                'Costo' => 900.00,
                'Fk_Paciente' => $pacienteIds[4],
                'Fk_Doctor' => $doctorIds[0],
                'Fk_Sucursal' => $sucursalId,
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            // Citas para mañana
            [
                'Titulo_Cita' => 'Consulta de Dermatología',
                'Descripcion' => 'Revisión de acné',
                'Fecha_Cita' => now()->addDay()->format('Y-m-d'),
                'Hora_Inicio' => '09:00:00',
                'Hora_Fin' => '09:30:00',
                'Estado_Cita' => 'Confirmada',
                'Tipo_Cita' => 'Consulta General',
                'Consultorio' => 'A-102',
                'Costo' => 500.00,
                'Fk_Paciente' => $pacienteIds[0],
                'Fk_Doctor' => $doctorIds[1],
                'Fk_Sucursal' => $sucursalId,
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Titulo_Cita' => 'Consulta de Ortopedia',
                'Descripcion' => 'Fractura de brazo',
                'Fecha_Cita' => now()->addDay()->format('Y-m-d'),
                'Hora_Inicio' => '10:00:00',
                'Hora_Fin' => '10:30:00',
                'Estado_Cita' => 'Pendiente',
                'Tipo_Cita' => 'Consulta Especializada',
                'Consultorio' => 'A-103',
                'Costo' => 700.00,
                'Fk_Paciente' => $pacienteIds[1],
                'Fk_Doctor' => $doctorIds[2],
                'Fk_Sucursal' => $sucursalId,
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            // Citas para pasado mañana
            [
                'Titulo_Cita' => 'Consulta de Ginecología',
                'Descripcion' => 'Papanicolaou',
                'Fecha_Cita' => now()->addDays(2)->format('Y-m-d'),
                'Hora_Inicio' => '11:00:00',
                'Hora_Fin' => '11:30:00',
                'Estado_Cita' => 'Confirmada',
                'Tipo_Cita' => 'Examen',
                'Consultorio' => 'A-104',
                'Costo' => 600.00,
                'Fk_Paciente' => $pacienteIds[2],
                'Fk_Doctor' => $doctorIds[3],
                'Fk_Sucursal' => $sucursalId,
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            // Citas completadas (ayer)
            [
                'Titulo_Cita' => 'Consulta de Cardiología',
                'Descripcion' => 'Revisión post-operatoria',
                'Fecha_Cita' => now()->subDay()->format('Y-m-d'),
                'Hora_Inicio' => '09:00:00',
                'Hora_Fin' => '09:30:00',
                'Estado_Cita' => 'Completada',
                'Tipo_Cita' => 'Consulta Especializada',
                'Consultorio' => 'A-101',
                'Costo' => 800.00,
                'Fk_Paciente' => $pacienteIds[3],
                'Fk_Doctor' => $doctorIds[0],
                'Fk_Sucursal' => $sucursalId,
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ],
            [
                'Titulo_Cita' => 'Consulta de Dermatología',
                'Descripcion' => 'Biopsia de piel',
                'Fecha_Cita' => now()->subDay()->format('Y-m-d'),
                'Hora_Inicio' => '10:00:00',
                'Hora_Fin' => '10:30:00',
                'Estado_Cita' => 'Completada',
                'Tipo_Cita' => 'Procedimiento',
                'Consultorio' => 'A-102',
                'Costo' => 1200.00,
                'Fk_Paciente' => $pacienteIds[4],
                'Fk_Doctor' => $doctorIds[1],
                'Fk_Sucursal' => $sucursalId,
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema'
            ]
        ];

        foreach ($citas as $cita) {
            DB::table('agendas')->insert($cita);
        }

        $this->command->info('Datos de agenda sembrados exitosamente!');
    }
} 