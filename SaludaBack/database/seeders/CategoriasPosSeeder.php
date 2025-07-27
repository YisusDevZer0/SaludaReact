<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoriaPos;
use Carbon\Carbon;

class CategoriasPosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Licencia de prueba (usando valor numérico)
        $licencia = 1; // Valor numérico para Id_Licencia

        $categorias = [
            [
                'nombre' => 'Medicamentos',
                'descripcion' => 'Categoría para medicamentos de venta libre y recetados',
                'codigo' => 'MED001',
                'icono' => 'medication',
                'color' => '#4CAF50',
                'orden' => 1,
                'activa' => true,
                'visible_en_pos' => true,
                'comision' => 5.00,
                'Id_Licencia' => $licencia
            ],
            [
                'nombre' => 'Insumos Médicos',
                'descripcion' => 'Material médico y de primeros auxilios',
                'codigo' => 'INS001',
                'icono' => 'medical_services',
                'color' => '#2196F3',
                'orden' => 2,
                'activa' => true,
                'visible_en_pos' => true,
                'comision' => 3.50,
                'Id_Licencia' => $licencia
            ],
            [
                'nombre' => 'Equipos Dentales',
                'descripcion' => 'Equipos y materiales para odontología',
                'codigo' => 'DEN001',
                'icono' => 'dentistry',
                'color' => '#FF9800',
                'orden' => 3,
                'activa' => true,
                'visible_en_pos' => true,
                'comision' => 4.00,
                'Id_Licencia' => $licencia
            ],
            [
                'nombre' => 'Consumibles',
                'descripcion' => 'Productos de consumo diario',
                'codigo' => 'CON001',
                'icono' => 'inventory',
                'color' => '#9C27B0',
                'orden' => 4,
                'activa' => true,
                'visible_en_pos' => true,
                'comision' => 2.50,
                'Id_Licencia' => $licencia
            ],
            [
                'nombre' => 'Material Quirúrgico',
                'descripcion' => 'Materiales para procedimientos quirúrgicos',
                'codigo' => 'QUI001',
                'icono' => 'surgery',
                'color' => '#F44336',
                'orden' => 5,
                'activa' => true,
                'visible_en_pos' => true,
                'comision' => 6.00,
                'Id_Licencia' => $licencia
            ],
            [
                'nombre' => 'Productos de Higiene',
                'descripcion' => 'Productos de higiene personal y limpieza',
                'codigo' => 'HIG001',
                'icono' => 'cleaning_services',
                'color' => '#00BCD4',
                'orden' => 6,
                'activa' => true,
                'visible_en_pos' => true,
                'comision' => 2.00,
                'Id_Licencia' => $licencia
            ],
            [
                'nombre' => 'Categoría Descontinuada',
                'descripcion' => 'Categoría de prueba descontinuada',
                'codigo' => 'DES001',
                'icono' => 'block',
                'color' => '#757575',
                'orden' => 7,
                'activa' => false,
                'visible_en_pos' => false,
                'comision' => 0.00,
                'Id_Licencia' => $licencia
            ]
        ];

        foreach ($categorias as $categoria) {
            CategoriaPos::create($categoria);
        }

        $this->command->info('✅ Categorías POS creadas exitosamente con licencia: ' . $licencia);
    }
} 