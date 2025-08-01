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
                'razon_social' => $faker->company() . ' S.A.',
                'nombre_comercial' => $faker->company(),
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
                'categoria' => $faker->randomElement(['minorista', 'mayorista', 'fabricante', 'distribuidor', 'importador']),
                'estado' => $faker->randomElement(['activo', 'inactivo', 'suspendido']),
                'limite_credito' => $faker->randomFloat(2, 10000, 500000),
                'observaciones' => $faker->optional(0.4)->sentence(),
                'created_at' => $faker->dateTimeBetween('-2 years', 'now'),
                'updated_at' => now(),
            ]);
        }

        echo "✅ ProveedoresSeeder completado: 500 proveedores creados\n";
    }
} 