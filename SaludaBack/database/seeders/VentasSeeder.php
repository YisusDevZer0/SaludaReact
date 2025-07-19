<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class VentasSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');
        
        // Crear 10000 ventas
        for ($i = 1; $i <= 10000; $i++) {
            $fechaVenta = $faker->dateTimeBetween('-1 year', 'now');
            $clienteId = $faker->numberBetween(1, 2000);
            $vendedorId = $faker->numberBetween(1, 1000);
            $sucursalId = $faker->numberBetween(1, 10);
            $metodoPago = $faker->randomElement(['efectivo', 'tarjeta', 'transferencia', 'cheque']);
            
            DB::table('ventas')->insert([
                'Venta_ID' => $i,
                'numero_venta' => 'VENT-' . str_pad($i, 8, '0', STR_PAD_LEFT),
                'cliente_id' => $clienteId,
                'vendedor_id' => $vendedorId,
                'sucursal_id' => $sucursalId,
                'fecha_venta' => $fechaVenta,
                'hora_venta' => $faker->time(),
                'subtotal' => $faker->randomFloat(2, 100, 50000),
                'descuento' => $faker->randomFloat(2, 0, 5000),
                'iva' => $faker->randomFloat(2, 0, 10000),
                'total' => $faker->randomFloat(2, 100, 60000),
                'metodo_pago' => $metodoPago,
                'estado' => $faker->randomElement(['completada', 'pendiente', 'cancelada']),
                'observaciones' => $faker->optional(0.3)->sentence(),
                'created_at' => $fechaVenta,
                'updated_at' => now(),
            ]);
        }

        echo "✅ VentasSeeder completado: 10000 ventas creadas\n";
    }
} 