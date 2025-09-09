<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TipoConsulta;
use App\Models\Especialidad;
use Carbon\Carbon;

class DermatologiaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Iniciando seeder de Dermatología...');

        // Crear o encontrar la especialidad de Dermatología
        $dermatologia = Especialidad::firstOrCreate(
            ['Nombre_Especialidad' => 'Dermatología'],
            [
                'Descripcion' => 'Especialidad médica de la piel, cabello y uñas',
                'Color_Calendario' => '#ff6b35',
                'Estatus_Especialidad' => 'Activa',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => Carbon::now(),
                'Sistema' => 'SaludaReact'
            ]
        );

        $this->command->info("Especialidad Dermatología: ID {$dermatologia->Especialidad_ID}");

        // Tipos de consulta específicos para Dermatología
        $tiposDermatologia = [
            'Consulta Dermatológica General',
            'Dermatitis Atópica',
            'Acné y Tratamiento',
            'Psoriasis',
            'Melanoma y Lunares',
            'Dermatitis Seborreica',
            'Rosácea',
            'Vitíligo',
            'Alopecia',
            'Onicomicosis (Hongos en Uñas)',
            'Dermatitis de Contacto',
            'Queratosis Actínica',
            'Cáncer de Piel',
            'Dermatitis Atópica Pediátrica',
            'Tratamiento de Cicatrices',
            'Dermatitis Perioral',
            'Urticaria',
            'Dermatitis Numular',
            'Liquen Plano',
            'Dermatitis Herpetiforme',
            'Consulta de Seguimiento',
            'Biopsia de Piel',
            'Crioterapia',
            'Electrocirugía',
            'Consulta de Urgencia Dermatológica'
        ];

        $creados = 0;
        $existentes = 0;

        foreach ($tiposDermatologia as $tipo) {
            $existe = TipoConsulta::where('Nom_Tipo', $tipo)
                ->where('Especialidad', $dermatologia->Especialidad_ID)
                ->exists();

            if (!$existe) {
                TipoConsulta::create([
                    'Nom_Tipo' => $tipo,
                    'Especialidad' => $dermatologia->Especialidad_ID,
                    'Estado' => 'Activo',
                    'Agregado_Por' => 'Sistema',
                    'Agregado_El' => Carbon::now(),
                    'Sistema' => 'SaludaReact',
                    'ID_H_O_D' => 'HOSP001'
                ]);
                $creados++;
            } else {
                $existentes++;
            }
        }

        $this->command->info("✅ Tipos de consulta creados: {$creados}");
        $this->command->info("ℹ️  Tipos ya existentes: {$existentes}");
        $this->command->info("🎉 Seeder de Dermatología completado exitosamente");
    }
}
