<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TipoConsulta;
use App\Models\Especialidad;
use Carbon\Carbon;

class TiposConsultaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener especialidades existentes
        $especialidades = Especialidad::all();
        
        if ($especialidades->isEmpty()) {
            $this->command->warn('No hay especialidades disponibles. Creando especialidades de ejemplo...');
            
            // Crear especialidades de ejemplo si no existen
            $especialidades = collect([
                Especialidad::create([
                    'Nombre_Especialidad' => 'Medicina General',
                    'Descripcion' => 'Atención médica general y preventiva',
                    'Color_Calendario' => '#1976d2',
                    'Estatus_Especialidad' => 'Activa',
                    'ID_H_O_D' => 'HOSP001',
                    'Agregado_Por' => 'Sistema',
                    'Agregado_El' => Carbon::now(),
                    'Sistema' => 'SaludaReact'
                ]),
                Especialidad::create([
                    'Nombre_Especialidad' => 'Cardiología',
                    'Descripcion' => 'Especialidad médica del corazón y sistema cardiovascular',
                    'Color_Calendario' => '#d32f2f',
                    'Estatus_Especialidad' => 'Activa',
                    'ID_H_O_D' => 'HOSP001',
                    'Agregado_Por' => 'Sistema',
                    'Agregado_El' => Carbon::now(),
                    'Sistema' => 'SaludaReact'
                ]),
                Especialidad::create([
                    'Nombre_Especialidad' => 'Pediatría',
                    'Descripcion' => 'Medicina especializada en niños y adolescentes',
                    'Color_Calendario' => '#388e3c',
                    'Estatus_Especialidad' => 'Activa',
                    'ID_H_O_D' => 'HOSP001',
                    'Agregado_Por' => 'Sistema',
                    'Agregado_El' => Carbon::now(),
                    'Sistema' => 'SaludaReact'
                ]),
                Especialidad::create([
                    'Nombre_Especialidad' => 'Ginecología',
                    'Descripcion' => 'Especialidad médica de la salud femenina',
                    'Color_Calendario' => '#7b1fa2',
                    'Estatus_Especialidad' => 'Activa',
                    'ID_H_O_D' => 'HOSP001',
                    'Agregado_Por' => 'Sistema',
                    'Agregado_El' => Carbon::now(),
                    'Sistema' => 'SaludaReact'
                ]),
                Especialidad::create([
                    'Nombre_Especialidad' => 'Ortopedia',
                    'Descripcion' => 'Especialidad médica del sistema musculoesquelético',
                    'Color_Calendario' => '#f57c00',
                    'Estatus_Especialidad' => 'Activa',
                    'ID_H_O_D' => 'HOSP001',
                    'Agregado_Por' => 'Sistema',
                    'Agregado_El' => Carbon::now(),
                    'Sistema' => 'SaludaReact'
                ])
            ]);
        }

        // Tipos de consulta por especialidad
        $tiposConsulta = [
            // Medicina General
            [
                'especialidad' => 'Medicina General',
                'tipos' => [
                    'Consulta General',
                    'Control de Presión Arterial',
                    'Control de Diabetes',
                    'Consulta Preventiva',
                    'Consulta de Urgencia',
                    'Seguimiento de Tratamiento'
                ]
            ],
            // Cardiología
            [
                'especialidad' => 'Cardiología',
                'tipos' => [
                    'Consulta Cardiológica',
                    'Electrocardiograma',
                    'Ecocardiograma',
                    'Prueba de Esfuerzo',
                    'Control de Marcapasos',
                    'Consulta de Seguimiento'
                ]
            ],
            // Pediatría
            [
                'especialidad' => 'Pediatría',
                'tipos' => [
                    'Consulta Pediátrica',
                    'Control de Crecimiento',
                    'Vacunación',
                    'Consulta de Lactancia',
                    'Control de Desarrollo',
                    'Consulta de Urgencia Pediátrica'
                ]
            ],
            // Ginecología
            [
                'especialidad' => 'Ginecología',
                'tipos' => [
                    'Consulta Ginecológica',
                    'Papanicolaou',
                    'Control Prenatal',
                    'Consulta de Fertilidad',
                    'Menopausia',
                    'Consulta de Urgencia Ginecológica'
                ]
            ],
            // Ortopedia
            [
                'especialidad' => 'Ortopedia',
                'tipos' => [
                    'Consulta Ortopédica',
                    'Evaluación de Fracturas',
                    'Control Post-operatorio',
                    'Rehabilitación',
                    'Consulta de Dolor',
                    'Evaluación Deportiva'
                ]
            ]
        ];

        foreach ($tiposConsulta as $grupo) {
            $especialidad = $especialidades->firstWhere('Nombre_Especialidad', $grupo['especialidad']);
            
            if ($especialidad) {
                foreach ($grupo['tipos'] as $tipo) {
                    TipoConsulta::create([
                        'Nom_Tipo' => $tipo,
                        'Especialidad' => $especialidad->Especialidad_ID,
                        'Estado' => 'Activo',
                        'Agregado_Por' => 'Sistema',
                        'Agregado_El' => Carbon::now(),
                        'Sistema' => 'SaludaReact',
                        'ID_H_O_D' => 'HOSP001'
                    ]);
                }
                
                $this->command->info("Tipos de consulta creados para {$grupo['especialidad']}");
            }
        }

        $this->command->info('Tipos de consulta creados exitosamente');
    }
}
