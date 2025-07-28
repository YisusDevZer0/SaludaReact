<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\FondoCaja;
use App\Models\Caja;
use App\Models\Sucursal;

class FondosCajaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener cajas y sucursales existentes
        $cajas = Caja::all();
        $sucursales = Sucursal::all();

        if ($cajas->isEmpty() || $sucursales->isEmpty()) {
            $this->command->warn('No hay cajas o sucursales disponibles. Creando datos de ejemplo...');
            
            // Crear una sucursal de ejemplo si no existe
            if ($sucursales->isEmpty()) {
                $sucursal = Sucursal::create([
                    'nombre' => 'Sucursal Principal',
                    'codigo' => 'SUC001',
                    'direccion' => 'Av. Principal 123',
                    'telefono' => '123-456-7890',
                    'email' => 'sucursal@ejemplo.com',
                    'estado' => 'activo',
                    'activa_ventas' => true,
                    'activa_compras' => true,
                    'activa_inventario' => true,
                ]);
                $sucursales = collect([$sucursal]);
            }

            // Crear una caja de ejemplo si no existe
            if ($cajas->isEmpty()) {
                $caja = Caja::create([
                    'nombre' => 'Caja Principal',
                    'descripcion' => 'Caja principal de la sucursal',
                    'saldo_inicial' => 10000.00,
                    'saldo_actual' => 10000.00,
                    'estado' => 'cerrada',
                    'sucursal_id' => $sucursales->first()->id,
                    'activa' => true,
                ]);
                $cajas = collect([$caja]);
            }
        }

        $fondosData = [
            [
                'codigo' => 'FC001',
                'nombre' => 'Fondo Principal Efectivo',
                'descripcion' => 'Fondo principal para operaciones en efectivo',
                'fondo_caja' => 50000.00,
                'saldo_actual' => 50000.00,
                'saldo_minimo' => 10000.00,
                'saldo_maximo' => 100000.00,
                'tipo_fondo' => 'efectivo',
                'observaciones' => 'Fondo principal para transacciones diarias',
                'permitir_sobrepasar_maximo' => false,
                'requerir_aprobacion_retiro' => true,
                'monto_maximo_retiro' => 5000.00,
                'estatus' => 'activo',
                'codigo_estatus' => 'A',
                'sistema' => true,
            ],
            [
                'codigo' => 'FC002',
                'nombre' => 'Fondo Secundario',
                'descripcion' => 'Fondo secundario para operaciones especiales',
                'fondo_caja' => 25000.00,
                'saldo_actual' => 25000.00,
                'saldo_minimo' => 5000.00,
                'saldo_maximo' => 50000.00,
                'tipo_fondo' => 'efectivo',
                'observaciones' => 'Fondo para operaciones de respaldo',
                'permitir_sobrepasar_maximo' => false,
                'requerir_aprobacion_retiro' => false,
                'monto_maximo_retiro' => 2000.00,
                'estatus' => 'activo',
                'codigo_estatus' => 'A',
                'sistema' => false,
            ],
            [
                'codigo' => 'FC003',
                'nombre' => 'Fondo Digital',
                'descripcion' => 'Fondo para operaciones digitales y transferencias',
                'fondo_caja' => 75000.00,
                'saldo_actual' => 75000.00,
                'saldo_minimo' => 15000.00,
                'saldo_maximo' => 150000.00,
                'tipo_fondo' => 'digital',
                'observaciones' => 'Fondo para pagos digitales y transferencias',
                'permitir_sobrepasar_maximo' => true,
                'requerir_aprobacion_retiro' => true,
                'monto_maximo_retiro' => 10000.00,
                'estatus' => 'activo',
                'codigo_estatus' => 'A',
                'sistema' => false,
            ],
            [
                'codigo' => 'FC004',
                'nombre' => 'Fondo Mixto',
                'descripcion' => 'Fondo que maneja efectivo y digital',
                'fondo_caja' => 40000.00,
                'saldo_actual' => 40000.00,
                'saldo_minimo' => 8000.00,
                'saldo_maximo' => 80000.00,
                'tipo_fondo' => 'mixto',
                'observaciones' => 'Fondo para operaciones mixtas',
                'permitir_sobrepasar_maximo' => false,
                'requerir_aprobacion_retiro' => true,
                'monto_maximo_retiro' => 3000.00,
                'estatus' => 'activo',
                'codigo_estatus' => 'A',
                'sistema' => false,
            ],
            [
                'codigo' => 'FC005',
                'nombre' => 'Fondo de Emergencia',
                'descripcion' => 'Fondo reservado para emergencias',
                'fondo_caja' => 100000.00,
                'saldo_actual' => 100000.00,
                'saldo_minimo' => 50000.00,
                'saldo_maximo' => 200000.00,
                'tipo_fondo' => 'efectivo',
                'observaciones' => 'Fondo de emergencia - solo usar en casos críticos',
                'permitir_sobrepasar_maximo' => false,
                'requerir_aprobacion_retiro' => true,
                'monto_maximo_retiro' => 5000.00,
                'estatus' => 'activo',
                'codigo_estatus' => 'A',
                'sistema' => true,
            ],
        ];

        foreach ($fondosData as $index => $fondoData) {
            // Asignar caja y sucursal de forma rotativa
            $caja = $cajas->get($index % $cajas->count());
            $sucursal = $sucursales->get($index % $sucursales->count());

            $fondoData['caja_id'] = $caja->id;
            $fondoData['sucursal_id'] = $sucursal->id;
            $fondoData['Id_Licencia'] = 'LIC001'; // Licencia de ejemplo

            FondoCaja::create($fondoData);
        }

        $this->command->info('Fondos de caja creados exitosamente.');
    }
} 