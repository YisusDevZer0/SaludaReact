<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class SucursalesSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');
        
        $sucursales = [
            [
                'id' => 1,
                'nombre' => 'Sucursal Central',
                'codigo' => 'CENTRAL',
                'direccion' => 'Av. Principal 123, Centro',
                'telefono' => '123456789',
                'email' => 'central@saluda.com',
                'estado' => 'activo',
                'ciudad' => 'Buenos Aires',
                'provincia' => 'Buenos Aires',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'nombre' => 'Sucursal Norte',
                'codigo' => 'NORTE',
                'direccion' => 'Calle Norte 456, Zona Norte',
                'telefono' => '123456790',
                'email' => 'norte@saluda.com',
                'estado' => 'activo',
                'ciudad' => 'Buenos Aires',
                'provincia' => 'Buenos Aires',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'nombre' => 'Sucursal Sur',
                'codigo' => 'SUR',
                'direccion' => 'Av. Sur 789, Zona Sur',
                'telefono' => '123456791',
                'email' => 'sur@saluda.com',
                'estado' => 'activo',
                'ciudad' => 'Buenos Aires',
                'provincia' => 'Buenos Aires',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'nombre' => 'Sucursal Este',
                'codigo' => 'ESTE',
                'direccion' => 'Calle Este 321, Zona Este',
                'telefono' => '123456792',
                'email' => 'este@saluda.com',
                'estado' => 'activo',
                'ciudad' => 'Buenos Aires',
                'provincia' => 'Buenos Aires',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'nombre' => 'Sucursal Oeste',
                'codigo' => 'OESTE',
                'direccion' => 'Av. Oeste 654, Zona Oeste',
                'telefono' => '123456793',
                'email' => 'oeste@saluda.com',
                'estado' => 'activo',
                'ciudad' => 'Buenos Aires',
                'provincia' => 'Buenos Aires',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insertar sucursales principales
        foreach ($sucursales as $sucursal) {
            DB::table('sucursales')->insert($sucursal);
        }

        // Crear 5 sucursales adicionales (10 total)
        for ($i = 6; $i <= 10; $i++) {
            DB::table('sucursales')->insert([
                'id' => $i,
                'nombre' => 'Sucursal ' . $faker->city(),
                'codigo' => 'SUC' . $i,
                'direccion' => $faker->address(),
                'telefono' => $faker->phoneNumber(),
                'email' => $faker->safeEmail(),
                'estado' => $faker->randomElement(['activo', 'inactivo']),
                'ciudad' => $faker->city(),
                'provincia' => $faker->state(),
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'updated_at' => now(),
            ]);
        }

        echo "✅ SucursalesSeeder completado: 10 sucursales creadas\n";
    }
} 