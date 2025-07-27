<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sucursal;
use Illuminate\Support\Facades\DB;

class SucursalesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tabla primero
        DB::table('sucursales')->truncate();

        // Crear sucursales de ejemplo
        $sucursales = [
            [
                'nombre' => 'Sucursal Centro',
                'codigo' => 'CENTRO',
                'direccion' => 'Av. Principal 123',
                'ciudad' => 'Ciudad Central',
                'provincia' => 'Provincia Central',
                'codigo_postal' => '1000',
                'pais' => 'Argentina',
                'telefono' => '+54 11 1234-5678',
                'email' => 'centro@saluda.com',
                'estado' => 'activo',
                'descripcion' => 'Sucursal principal en el centro de la ciudad',
                'responsable_id' => 1,
                'fecha_apertura' => '2024-01-01',
                'capacidad' => 100,
                'tipo_sucursal' => 'principal',
                'zona_horaria' => 'America/Argentina/Buenos_Aires',
                'configuracion' => json_encode(['horario_apertura' => '08:00', 'horario_cierre' => '20:00']),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Sucursal Norte',
                'codigo' => 'NORTE',
                'direccion' => 'Calle Norte 456',
                'ciudad' => 'Ciudad Norte',
                'provincia' => 'Provincia Norte',
                'codigo_postal' => '2000',
                'pais' => 'Argentina',
                'telefono' => '+54 11 2345-6789',
                'email' => 'norte@saluda.com',
                'estado' => 'activo',
                'descripcion' => 'Sucursal en la zona norte',
                'responsable_id' => 2,
                'fecha_apertura' => '2024-02-01',
                'capacidad' => 80,
                'tipo_sucursal' => 'secundaria',
                'zona_horaria' => 'America/Argentina/Buenos_Aires',
                'configuracion' => json_encode(['horario_apertura' => '09:00', 'horario_cierre' => '19:00']),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Sucursal Sur',
                'codigo' => 'SUR',
                'direccion' => 'Av. Sur 789',
                'ciudad' => 'Ciudad Sur',
                'provincia' => 'Provincia Sur',
                'codigo_postal' => '3000',
                'pais' => 'Argentina',
                'telefono' => '+54 11 3456-7890',
                'email' => 'sur@saluda.com',
                'estado' => 'activo',
                'descripcion' => 'Sucursal en la zona sur',
                'responsable_id' => 3,
                'fecha_apertura' => '2024-03-01',
                'capacidad' => 60,
                'tipo_sucursal' => 'secundaria',
                'zona_horaria' => 'America/Argentina/Buenos_Aires',
                'configuracion' => json_encode(['horario_apertura' => '08:30', 'horario_cierre' => '18:30']),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Sucursal Este',
                'codigo' => 'ESTE',
                'direccion' => 'Calle Este 321',
                'ciudad' => 'Ciudad Este',
                'provincia' => 'Provincia Este',
                'codigo_postal' => '4000',
                'pais' => 'Argentina',
                'telefono' => '+54 11 4567-8901',
                'email' => 'este@saluda.com',
                'estado' => 'activo',
                'descripcion' => 'Sucursal en la zona este',
                'responsable_id' => 4,
                'fecha_apertura' => '2024-04-01',
                'capacidad' => 70,
                'tipo_sucursal' => 'secundaria',
                'zona_horaria' => 'America/Argentina/Buenos_Aires',
                'configuracion' => json_encode(['horario_apertura' => '09:30', 'horario_cierre' => '19:30']),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Sucursal Oeste',
                'codigo' => 'OESTE',
                'direccion' => 'Av. Oeste 654',
                'ciudad' => 'Ciudad Oeste',
                'provincia' => 'Provincia Oeste',
                'codigo_postal' => '5000',
                'pais' => 'Argentina',
                'telefono' => '+54 11 5678-9012',
                'email' => 'oeste@saluda.com',
                'estado' => 'activo',
                'descripcion' => 'Sucursal en la zona oeste',
                'responsable_id' => 5,
                'fecha_apertura' => '2024-05-01',
                'capacidad' => 90,
                'tipo_sucursal' => 'secundaria',
                'zona_horaria' => 'America/Argentina/Buenos_Aires',
                'configuracion' => json_encode(['horario_apertura' => '08:00', 'horario_cierre' => '20:00']),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        // Insertar sucursales
        foreach ($sucursales as $sucursal) {
            Sucursal::create($sucursal);
        }

        $this->command->info('Sucursales creadas exitosamente!');
    }
} 