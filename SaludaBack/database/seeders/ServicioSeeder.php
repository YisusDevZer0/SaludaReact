<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Servicio;

class ServicioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear servicios básicos específicos
        $serviciosBasicos = [
            [
                'Nom_Serv' => 'Consulta General',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
                'Descripcion' => 'Consulta médica general para evaluación y diagnóstico inicial',
                'Precio_Base' => 150.00,
                'Requiere_Cita' => true,
            ],
            [
                'Nom_Serv' => 'Urgencias',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => 'URGENCIAS',
                'ID_H_O_D' => 'Saluda',
                'Descripcion' => 'Atención médica de emergencia las 24 horas',
                'Precio_Base' => 300.00,
                'Requiere_Cita' => false,
            ],
            [
                'Nom_Serv' => 'Laboratorio Clínico',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => 'AMBULATORIO',
                'ID_H_O_D' => 'Saluda',
                'Descripcion' => 'Análisis clínicos y estudios de laboratorio',
                'Precio_Base' => 80.00,
                'Requiere_Cita' => true,
            ],
            [
                'Nom_Serv' => 'Radiología',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => 'HOSPITALARIO',
                'ID_H_O_D' => 'Saluda',
                'Descripcion' => 'Estudios radiológicos para diagnóstico por imagen',
                'Precio_Base' => 200.00,
                'Requiere_Cita' => true,
            ],
            [
                'Nom_Serv' => 'Hospitalización',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => 'HOSPITALARIO',
                'ID_H_O_D' => 'Saluda',
                'Descripcion' => 'Servicio de hospitalización general',
                'Precio_Base' => 1200.00,
                'Requiere_Cita' => true,
            ]
        ];

        // Insertar servicios básicos
        foreach ($serviciosBasicos as $servicio) {
            Servicio::create($servicio);
        }

        // Crear servicios adicionales usando factory
        // Servicios activos del sistema POS
        Servicio::factory()
            ->count(15)
            ->activo()
            ->paraSistema('POS')
            ->create();

        // Servicios hospitalarios
        Servicio::factory()
            ->count(10)
            ->activo()
            ->paraSistema('HOSPITALARIO')
            ->caro()
            ->create();

        // Servicios de urgencias
        Servicio::factory()
            ->count(5)
            ->urgencia()
            ->create();

        // Servicios ambulatorios
        Servicio::factory()
            ->count(8)
            ->activo()
            ->paraSistema('AMBULATORIO')
            ->conCita()
            ->create();

        // Algunos servicios inactivos para probar filtros
        Servicio::factory()
            ->count(3)
            ->inactivo()
            ->create();

        // Servicios sin cita
        Servicio::factory()
            ->count(4)
            ->activo()
            ->sinCita()
            ->create();

        $this->command->info('Servicios creados exitosamente: ' . Servicio::count() . ' registros');
    }
} 