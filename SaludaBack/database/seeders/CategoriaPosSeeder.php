<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CategoriaPos;
use Carbon\Carbon;

class CategoriaPosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            [
                'Nom_Cat' => 'Medicamentos Genéricos',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => Carbon::now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
            ],
            [
                'Nom_Cat' => 'Medicamentos de Marca',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => Carbon::now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
            ],
            [
                'Nom_Cat' => 'Productos de Higiene Personal',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => Carbon::now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
            ],
            [
                'Nom_Cat' => 'Vitaminas y Suplementos',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => Carbon::now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
            ],
            [
                'Nom_Cat' => 'Productos para Bebés',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => Carbon::now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
            ],
            [
                'Nom_Cat' => 'Cuidado de la Piel',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => Carbon::now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
            ],
            [
                'Nom_Cat' => 'Productos para el Cabello',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => Carbon::now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
            ],
            [
                'Nom_Cat' => 'Equipos Médicos',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => Carbon::now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda',
            ],
        ];

        foreach ($categorias as $categoria) {
            CategoriaPos::create($categoria);
        }
    }
}
