<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class RolesPuestosSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');
        
        $roles = [
            ['nombre' => 'Administrador', 'descripcion' => 'Control total del sistema'],
            ['nombre' => 'Gerente', 'descripcion' => 'Gestión de sucursal'],
            ['nombre' => 'Vendedor', 'descripcion' => 'Ventas y atención al cliente'],
            ['nombre' => 'Cajero', 'descripcion' => 'Procesamiento de pagos'],
            ['nombre' => 'Almacenista', 'descripcion' => 'Gestión de inventario'],
            ['nombre' => 'Supervisor', 'descripcion' => 'Supervisión de personal'],
            ['nombre' => 'Doctor', 'descripcion' => 'Atención médica'],
            ['nombre' => 'Enfermero', 'descripcion' => 'Atención de enfermería'],
            ['nombre' => 'Recepcionista', 'descripcion' => 'Atención de recepción'],
            ['nombre' => 'Técnico', 'descripcion' => 'Mantenimiento técnico'],
        ];

        foreach ($roles as $index => $rol) {
            DB::table('roles_puestos')->insert([
                'id' => $index + 1,
                'nombre' => $rol['nombre'],
                'descripcion' => $rol['descripcion'],
                'tipo' => 'rol',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        echo "✅ RolesPuestosSeeder completado: " . count($roles) . " roles creados\n";
    }
} 