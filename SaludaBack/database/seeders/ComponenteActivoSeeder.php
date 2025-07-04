<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ComponenteActivoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $componentes = [
            [
                'Nom_Com' => 'Paracetamol',
                'Descripcion' => 'Analgésico y antipirético común',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Com' => 'Ibuprofeno',
                'Descripcion' => 'Antiinflamatorio no esteroideo',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Com' => 'Amoxicilina',
                'Descripcion' => 'Antibiótico de amplio espectro',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Com' => 'Omeprazol',
                'Descripcion' => 'Inhibidor de la bomba de protones',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Com' => 'Loratadina',
                'Descripcion' => 'Antihistamínico',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Com' => 'Metformina',
                'Descripcion' => 'Antidiabético oral',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Com' => 'Atorvastatina',
                'Descripcion' => 'Estatina para reducir el colesterol',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Com' => 'Losartán',
                'Descripcion' => 'Antihipertensivo',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Com' => 'Aspirina',
                'Descripcion' => 'Ácido acetilsalicílico',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ],
            [
                'Nom_Com' => 'Diclofenaco',
                'Descripcion' => 'Antiinflamatorio no esteroideo',
                'Estado' => 'Vigente',
                'Cod_Estado' => 'V',
                'Agregado_Por' => 'Sistema',
                'Agregadoel' => now(),
                'Sistema' => 'POS',
                'ID_H_O_D' => 'Saluda'
            ]
        ];

        foreach ($componentes as $componente) {
            DB::table('ComponentesActivos')->insert($componente);
        }

        $this->command->info('Componentes activos sembrados exitosamente!');
    }
} 