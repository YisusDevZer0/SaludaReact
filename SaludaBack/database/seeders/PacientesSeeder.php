<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PacientesSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');
        
        // Crear 5000 pacientes
        for ($i = 1; $i <= 5000; $i++) {
            $fechaNacimiento = $faker->date('Y-m-d', '-18 years');
            $edad = date_diff(date_create($fechaNacimiento), date_create('today'))->y;
            
            DB::table('pacientes')->insert([
                'Paciente_ID' => $i,
                'nombre' => $faker->firstName(),
                'apellido' => $faker->lastName(),
                'fecha_nacimiento' => $fechaNacimiento,
                'edad' => $edad,
                'genero' => $faker->randomElement(['masculino', 'femenino']),
                'dni' => $faker->unique()->numerify('########'),
                'telefono' => $faker->phoneNumber(),
                'email' => $faker->optional(0.7)->safeEmail(),
                'direccion' => $faker->address(),
                'ciudad' => $faker->city(),
                'provincia' => $faker->state(),
                'codigo_postal' => $faker->postcode(),
                'pais' => 'Argentina',
                'estado_civil' => $faker->randomElement(['soltero', 'casado', 'divorciado', 'viudo']),
                'ocupacion' => $faker->jobTitle(),
                'emergencia_contacto' => $faker->name(),
                'emergencia_telefono' => $faker->phoneNumber(),
                'emergencia_parentesco' => $faker->randomElement(['esposo', 'esposa', 'hijo', 'hija', 'padre', 'madre', 'hermano', 'hermana']),
                'grupo_sanguineo' => $faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
                'alergias' => $faker->optional(0.3)->sentence(),
                'medicamentos_actuales' => $faker->optional(0.4)->sentence(),
                'antecedentes_medicos' => $faker->optional(0.5)->sentence(),
                'observaciones' => $faker->optional(0.6)->sentence(),
                'estado' => $faker->randomElement(['activo', 'inactivo']),
                'fecha_registro' => $faker->dateTimeBetween('-2 years', 'now'),
                'created_at' => $faker->dateTimeBetween('-2 years', 'now'),
                'updated_at' => now(),
            ]);
        }

        echo "✅ PacientesSeeder completado: 5000 pacientes creados\n";
    }
} 