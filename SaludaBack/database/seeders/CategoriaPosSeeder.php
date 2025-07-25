<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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
                'Nom_Cat' => 'Medicamentos',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Cat' => 'Cosméticos',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Cat' => 'Higiene Personal',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Cat' => 'Suplementos',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Cat' => 'Equipos Médicos',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'SALUD',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Cat' => 'Insumos Médicos',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'SALUD',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Cat' => 'Vitaminas',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Cat' => 'Cuidado de la Piel',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Cat' => 'Productos para Bebés',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Cat' => 'Categoría Descontinuada',
                'Estado' => 'Inactivo',
                'Cod_Estado' => 'I',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ]
        ];

        foreach ($categorias as $categoria) {
            DB::table('categorias_pos')->insert($categoria);
        }

        $this->command->info('Categorías POS sembradas exitosamente!');
    }
}
