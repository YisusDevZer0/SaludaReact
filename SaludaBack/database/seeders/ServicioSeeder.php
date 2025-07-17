<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Servicio;
use Illuminate\Support\Facades\DB;

class ServicioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tabla antes de sembrar
        DB::table('Servicios_POS')->truncate();

        // Servicios del sistema (predefinidos)
        $serviciosSistema = [
            [
                'Nom_Serv' => 'Consulta Médica General',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Consulta Especializada',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Examen de Laboratorio',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Radiografía',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Ecografía',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Electrocardiograma',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Fisioterapia',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Odontología General',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Oftalmología',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Dermatología',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Ginecología',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Pediatría',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Psicología',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Nutrición',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ],
            [
                'Nom_Serv' => 'Cardiología',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => true,
                'ID_H_O_D' => 1
            ]
        ];

        // Insertar servicios del sistema
        foreach ($serviciosSistema as $servicio) {
            Servicio::create($servicio);
        }

        // Crear servicios personalizados usando factory
        Servicio::factory()
            ->count(25)
            ->personalizado()
            ->activo()
            ->create();

        // Crear algunos servicios inactivos
        Servicio::factory()
            ->count(5)
            ->personalizado()
            ->inactivo()
            ->create();

        // Crear servicios para diferentes organizaciones
        for ($i = 2; $i <= 5; $i++) {
            Servicio::factory()
                ->count(8)
                ->personalizado()
                ->activo()
                ->paraOrganizacion($i)
                ->create();
        }

        // Crear servicios especializados
        Servicio::factory()
            ->count(10)
            ->especialidadMedica()
            ->create();

        Servicio::factory()
            ->count(8)
            ->examenLaboratorio()
            ->create();

        Servicio::factory()
            ->count(6)
            ->terapia()
            ->create();

        $this->command->info('Servicios sembrados exitosamente!');
        $this->command->info('Total de servicios creados: ' . Servicio::count());
        $this->command->info('Servicios del sistema: ' . Servicio::where('Sistema', true)->count());
        $this->command->info('Servicios personalizados: ' . Servicio::where('Sistema', false)->count());
        $this->command->info('Servicios activos: ' . Servicio::where('Estado', 'Activo')->count());
        $this->command->info('Servicios inactivos: ' . Servicio::where('Estado', 'Inactivo')->count());
    }
} 