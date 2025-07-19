<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ClientesSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');
        
        // Crear 2000 clientes
        for ($i = 1; $i <= 2000; $i++) {
            DB::table('clientes')->insert([
                'id' => $i,
                'codigo' => 'CLI' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'nombre' => $faker->firstName(),
                'apellido' => $faker->lastName(),
                'dni' => $faker->unique()->numerify('########'),
                'telefono' => $faker->phoneNumber(),
                'email' => $faker->optional(0.7)->safeEmail(),
                'direccion' => $faker->address(),
                'ciudad' => $faker->city(),
                'provincia' => $faker->state(),
                'codigo_postal' => $faker->postcode(),
                'pais' => 'Argentina',
                'fecha_nacimiento' => $faker->date('Y-m-d', '-18 years'),
                'genero' => $faker->randomElement(['masculino', 'femenino']),
                'estado_civil' => $faker->randomElement(['soltero', 'casado', 'divorciado', 'viudo']),
                'ocupacion' => $faker->jobTitle(),
                'empresa' => $faker->optional(0.4)->company(),
                'telefono_trabajo' => $faker->optional(0.3)->phoneNumber(),
                'fecha_registro' => $faker->dateTimeBetween('-2 years', 'now'),
                'tipo_cliente' => $faker->randomElement(['regular', 'premium', 'vip']),
                'limite_credito' => $faker->randomFloat(2, 0, 50000),
                'saldo_credito' => $faker->randomFloat(2, 0, 10000),
                'puntos_fidelidad' => $faker->numberBetween(0, 10000),
                'estado' => $faker->randomElement(['activo', 'inactivo', 'suspendido']),
                'observaciones' => $faker->optional(0.3)->sentence(),
                'created_at' => $faker->dateTimeBetween('-2 years', 'now'),
                'updated_at' => now(),
            ]);
        }

        echo "✅ ClientesSeeder completado: 2000 clientes creados\n";
    }
} 