<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PermisosSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');
        
        $permisos = [
            'ver_usuarios', 'crear_usuarios', 'editar_usuarios', 'eliminar_usuarios',
            'ver_ventas', 'crear_ventas', 'editar_ventas', 'eliminar_ventas',
            'ver_inventario', 'crear_inventario', 'editar_inventario', 'eliminar_inventario',
            'ver_reportes', 'crear_reportes', 'editar_reportes',
            'ver_configuracion', 'editar_configuracion',
            'ver_pacientes', 'crear_pacientes', 'editar_pacientes', 'eliminar_pacientes',
            'ver_doctores', 'crear_doctores', 'editar_doctores', 'eliminar_doctores',
            'ver_citas', 'crear_citas', 'editar_citas', 'eliminar_citas',
            'ver_recetas', 'crear_recetas', 'editar_recetas', 'eliminar_recetas',
            'ver_facturas', 'crear_facturas', 'editar_facturas', 'eliminar_facturas',
            'ver_creditos', 'crear_creditos', 'editar_creditos', 'eliminar_creditos',
            'ver_almacen', 'crear_almacen', 'editar_almacen', 'eliminar_almacen',
            'ver_proveedores', 'crear_proveedores', 'editar_proveedores', 'eliminar_proveedores',
            'ver_clientes', 'crear_clientes', 'editar_clientes', 'eliminar_clientes',
            'ver_sucursales', 'crear_sucursales', 'editar_sucursales', 'eliminar_sucursales',
        ];

        foreach ($permisos as $index => $permiso) {
            DB::table('permisos')->insert([
                'id' => $index + 1,
                'nombre' => $permiso,
                'descripcion' => 'Permiso para ' . str_replace('_', ' ', $permiso),
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        echo "✅ PermisosSeeder completado: " . count($permisos) . " permisos creados\n";
    }
} 