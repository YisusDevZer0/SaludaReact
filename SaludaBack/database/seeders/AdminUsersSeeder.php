<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario administrativo: Diana Maria Euan
        DB::table('personal_pos')->insert([
            'codigo' => 'ADMIN002',
            'nombre' => 'Diana Maria',
            'apellido' => 'Euan',
            'email' => 'corporativolopezfacturacion@gmail.com',
            'password' => Hash::make('Deuan2025'),
            'telefono' => '123456789',
            'direccion' => 'Dirección de Diana Maria Euan',
            'fecha_nacimiento' => '1990-01-01',
            'genero' => 'femenino',
            'sucursal_id' => 1,
            'fecha_ingreso' => '2024-01-01',
            'estado_laboral' => 'activo',
            'salario' => 60000.00,
            'is_active' => true,
            'can_login' => true,
            'can_sell' => true,
            'can_refund' => true,
            'can_manage_inventory' => true,
            'can_manage_users' => true,
            'can_view_reports' => true,
            'can_manage_settings' => true,
            'notas' => 'Usuario administrativo: Diana Maria Euan',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Usuario administrativo: Fanny Lopez
        DB::table('personal_pos')->insert([
            'codigo' => 'ADMIN003',
            'nombre' => 'Fanny',
            'apellido' => 'Lopez',
            'email' => 'fanny@saluda.mx',
            'password' => Hash::make('saluda25'),
            'telefono' => '123456789',
            'direccion' => 'Dirección de Fanny Lopez',
            'fecha_nacimiento' => '1990-01-01',
            'genero' => 'femenino',
            'sucursal_id' => 1,
            'fecha_ingreso' => '2024-01-01',
            'estado_laboral' => 'activo',
            'salario' => 60000.00,
            'is_active' => true,
            'can_login' => true,
            'can_sell' => true,
            'can_refund' => true,
            'can_manage_inventory' => true,
            'can_manage_users' => true,
            'can_view_reports' => true,
            'can_manage_settings' => true,
            'notas' => 'Usuario administrativo: Fanny Lopez',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        echo "✅ AdminUsersSeeder completado: 2 usuarios administrativos creados\n";
        echo "👤 Diana Maria Euan: corporativolopezfacturacion@gmail.com / Deuan2025\n";
        echo "👤 Fanny Lopez: fanny@saluda.mx / saluda25\n";
    }
} 