<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Marca;

class MarcaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear marcas básicas específicas
        $marcasBasicas = [
            [
                'Nom_Marca' => 'Abbott',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
                'Descripcion' => 'Líder mundial en productos farmacéuticos y dispositivos médicos',
                'Pais_Origen' => 'Estados Unidos',
                'Sitio_Web' => 'https://www.abbott.com',
                'Logo_URL' => 'https://logos.abbott.com/logo.png',
            ],
            [
                'Nom_Marca' => 'Bayer',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => 'FARMACIA',
                'ID_H_O_D' => 'Saluda',
                'Descripcion' => 'Empresa farmacéutica alemana con más de 150 años de experiencia',
                'Pais_Origen' => 'Alemania',
                'Sitio_Web' => 'https://www.bayer.com',
                'Logo_URL' => 'https://logos.bayer.com/logo.png',
            ],
            [
                'Nom_Marca' => 'Siemens Healthineers',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => 'HOSPITALARIO',
                'ID_H_O_D' => 'Saluda',
                'Descripcion' => 'Tecnología médica avanzada para diagnóstico por imágenes',
                'Pais_Origen' => 'Alemania',
                'Sitio_Web' => 'https://www.siemens-healthineers.com',
                'Logo_URL' => 'https://logos.siemens.com/healthineers.png',
            ],
            [
                'Nom_Marca' => 'Johnson & Johnson',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
                'Descripcion' => 'Empresa líder en productos farmacéuticos y dispositivos médicos',
                'Pais_Origen' => 'Estados Unidos',
                'Sitio_Web' => 'https://www.jnj.com',
                'Logo_URL' => 'https://logos.jnj.com/logo.png',
            ],
            [
                'Nom_Marca' => 'Roche',
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
                'Agregado_Por' => 'Sistema',
                'Sistema' => 'LABORATORIO',
                'ID_H_O_D' => 'Saluda',
                'Descripcion' => 'Líder mundial en biotecnología y diagnósticos médicos',
                'Pais_Origen' => 'Suiza',
                'Sitio_Web' => 'https://www.roche.com',
                'Logo_URL' => 'https://logos.roche.com/logo.png',
            ]
        ];

        // Insertar marcas básicas
        foreach ($marcasBasicas as $marca) {
            Marca::create($marca);
        }

        // Crear marcas adicionales usando factory
        // Marcas farmacéuticas
        Marca::factory()
            ->count(8)
            ->farmaceutica()
            ->activa()
            ->conSitioWeb()
            ->create();

        // Marcas de equipos médicos
        Marca::factory()
            ->count(6)
            ->equipoMedico()
            ->activa()
            ->conSitioWeb()
            ->conLogo()
            ->create();

        // Marcas del sistema POS
        Marca::factory()
            ->count(5)
            ->activa()
            ->paraSistema('POS')
            ->create();

        // Marcas de laboratorio
        Marca::factory()
            ->count(4)
            ->activa()
            ->paraSistema('LABORATORIO')
            ->create();

        // Marcas de Estados Unidos
        Marca::factory()
            ->count(6)
            ->activa()
            ->dePais('Estados Unidos')
            ->conSitioWeb()
            ->create();

        // Marcas europeas
        Marca::factory()
            ->count(4)
            ->activa()
            ->dePais('Alemania')
            ->create();

        Marca::factory()
            ->count(3)
            ->activa()
            ->dePais('Suiza')
            ->create();

        // Algunas marcas inactivas para probar filtros
        Marca::factory()
            ->count(2)
            ->inactiva()
            ->create();

        // Crear relaciones entre servicios y marcas
        $this->createServicioMarcaRelations();

        $this->command->info('Marcas creadas exitosamente: ' . Marca::count() . ' registros');
    }

    /**
     * Create relationships between services and brands.
     */
    private function createServicioMarcaRelations(): void
    {
        $servicios = \App\Models\Servicio::all();
        $marcas = Marca::all();

        if ($servicios->count() > 0 && $marcas->count() > 0) {
            // Crear algunas relaciones aleatorias
            foreach ($servicios->take(10) as $servicio) {
                $marcasAleatorias = $marcas->random(rand(1, 3));
                
                foreach ($marcasAleatorias as $marca) {
                    $servicio->marcas()->attach($marca->Marca_ID, [
                        'precio_especial' => rand(0, 1) ? rand(100, 500) : null,
                        'notas' => 'Relación creada por seeder',
                        'agregado_por' => 'Sistema'
                    ]);
                }
            }

            $this->command->info('Relaciones servicio-marca creadas exitosamente');
        }
    }
} 