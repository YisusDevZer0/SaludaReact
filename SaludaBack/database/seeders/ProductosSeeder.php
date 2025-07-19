<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ProductosSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');
        
        $categorias = [
            'Analgésicos', 'Antibióticos', 'Antiinflamatorios', 'Antihistamínicos',
            'Antipiréticos', 'Antitusivos', 'Expectorantes', 'Laxantes',
            'Antieméticos', 'Antidiabéticos', 'Antihipertensivos', 'Anticoagulantes',
            'Vitaminas', 'Minerales', 'Suplementos', 'Productos de higiene',
            'Material médico', 'Equipos', 'Insumos', 'Cosméticos'
        ];
        
        $presentaciones = [
            'Comprimidos', 'Cápsulas', 'Jarabe', 'Suspensión', 'Inyectable',
            'Cremas', 'Ungüentos', 'Geles', 'Parches', 'Supositorios',
            'Gotas', 'Spray', 'Inhalador', 'Polvo', 'Líquido'
        ];
        
        // Crear 3000 productos
        for ($i = 1; $i <= 3000; $i++) {
            $categoria = $faker->randomElement($categorias);
            $presentacion = $faker->randomElement($presentaciones);
            $requiereReceta = $faker->boolean(30); // 30% requieren receta
            
            DB::table('productos')->insert([
                'Producto_ID' => $i,
                'codigo' => 'PROD' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'nombre' => $faker->unique()->words(3, true) . ' ' . $presentacion,
                'descripcion' => $faker->sentence(),
                'categoria' => $categoria,
                'presentacion' => $presentacion,
                'concentracion' => $faker->randomElement(['500mg', '1000mg', '250mg', '10mg', '5mg', '20mg', '50mg']),
                'laboratorio' => $faker->company(),
                'codigo_barras' => $faker->unique()->ean13(),
                'precio_venta' => $faker->randomFloat(2, 10, 5000),
                'precio_compra' => $faker->randomFloat(2, 5, 3000),
                'stock_minimo' => $faker->numberBetween(10, 100),
                'stock_maximo' => $faker->numberBetween(500, 2000),
                'stock_actual' => $faker->numberBetween(0, 1000),
                'unidad_medida' => $faker->randomElement(['unidad', 'caja', 'frasco', 'ampolla', 'tubo']),
                'requiere_receta' => $requiereReceta,
                'vencimiento' => $faker->date('Y-m-d', '+2 years'),
                'lote' => $faker->bothify('LOT-####-####'),
                'registro_sanitario' => $faker->bothify('RS-####-####'),
                'estado' => $faker->randomElement(['activo', 'inactivo', 'discontinuado']),
                'observaciones' => $faker->optional(0.4)->sentence(),
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'updated_at' => now(),
            ]);
        }

        echo "✅ ProductosSeeder completado: 3000 productos creados\n";
    }
} 