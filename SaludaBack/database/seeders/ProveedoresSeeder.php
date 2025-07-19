<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ProveedoresSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');
        
        // Crear 500 proveedores
        for ($i = 1; $i <= 500; $i++) {
            DB::table('proveedores')->insert([
                'id' => $i,
                'codigo' => 'PROV' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'nombre' => $faker->company(),
                'razon_social' => $faker->company() . ' S.A.',
                'cuit' => $faker->unique()->numerify('##-########-#'),
                'telefono' => $faker->phoneNumber(),
                'email' => $faker->safeEmail(),
                'direccion' => $faker->address(),
                'ciudad' => $faker->city(),
                'provincia' => $faker->state(),
                'codigo_postal' => $faker->postcode(),
                'pais' => 'Argentina',
                'contacto_nombre' => $faker->name(),
                'contacto_telefono' => $faker->phoneNumber(),
                'contacto_email' => $faker->safeEmail(),
                'condiciones_pago' => $faker->randomElement(['contado', '30 días', '60 días', '90 días']),
                'limite_credito' => $faker->randomFloat(2, 10000, 500000),
                'saldo_credito' => $faker->randomFloat(2, 0, 100000),
                'categoria' => $faker->randomElement(['farmacéutico', 'médico', 'cosmético', 'equipamiento', 'insumos']),
                'estado' => $faker->randomElement(['activo', 'inactivo', 'suspendido']),
                'observaciones' => $faker->optional(0.4)->sentence(),
                'created_at' => $faker->dateTimeBetween('-2 years', 'now'),
                'updated_at' => now(),
            ]);
        }

        echo "✅ ProveedoresSeeder completado: 500 proveedores creados\n";
    }
} 