<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class PersonalPosSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');
        
        // Primero crear tu usuario administrador
        DB::table('personal_pos')->insert([
            'id' => 1,
            'codigo' => 'ADMIN001',
            'nombre' => 'Jesús Emutul',
            'apellido' => 'Administrador',
            'email' => 'jesusemutul@gmail.com',
            'password' => Hash::make('150518Wen'),
            'telefono' => '123456789',
            'direccion' => 'Dirección del Administrador',
            'fecha_nacimiento' => '1990-01-01',
            'genero' => 'masculino',
            'sucursal_id' => 1,
            'fecha_ingreso' => '2024-01-01',
            'estado_laboral' => 'activo',
            'salario' => 50000.00,
            'is_active' => true,
            'can_login' => true,
            'can_sell' => true,
            'can_refund' => true,
            'can_manage_inventory' => true,
            'can_manage_users' => true,
            'can_view_reports' => true,
            'can_manage_settings' => true,
            'notas' => 'Usuario administrador principal del sistema',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear 999 usuarios adicionales (1000 total)
        for ($i = 2; $i <= 1000; $i++) {
            $tipoUsuario = $faker->randomElement(['vendedor', 'cajero', 'almacenista', 'supervisor', 'gerente']);
            $sucursalId = $faker->numberBetween(1, 10);
            
            DB::table('personal_pos')->insert([
                'id' => $i,
                'codigo' => 'EMP' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'nombre' => $faker->firstName(),
                'apellido' => $faker->lastName(),
                'email' => $faker->unique()->safeEmail(),
                'password' => Hash::make('password123'),
                'telefono' => $faker->phoneNumber(),
                'direccion' => $faker->address(),
                'fecha_nacimiento' => $faker->date('Y-m-d', '-18 years'),
                'genero' => $faker->randomElement(['masculino', 'femenino']),
                'sucursal_id' => $sucursalId,
                'fecha_ingreso' => $faker->date('Y-m-d', '-2 years'),
                'estado_laboral' => $faker->randomElement(['activo', 'inactivo']),
                'salario' => $faker->numberBetween(20000, 80000),
                'is_active' => $faker->boolean(90), // 90% activos
                'can_login' => true,
                'can_sell' => $faker->boolean(80),
                'can_refund' => $faker->boolean(30),
                'can_manage_inventory' => $faker->boolean(20),
                'can_manage_users' => $faker->boolean(10),
                'can_view_reports' => $faker->boolean(60),
                'can_manage_settings' => $faker->boolean(5),
                'notas' => $faker->optional()->sentence(),
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'updated_at' => now(),
            ]);
        }

        echo "✅ PersonalPosSeeder completado: 1000 registros creados\n";
        echo "👤 Usuario administrador: jesusemutul@gmail.com / 150518Wen\n";
    }
} 