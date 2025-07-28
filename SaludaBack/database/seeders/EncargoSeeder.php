<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EncargoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener IDs de clientes, sucursales y usuarios existentes
        $clientes = DB::table('clientes')->pluck('id')->toArray();
        $sucursales = DB::table('sucursales')->pluck('id')->toArray();
        $usuarios = DB::table('personal_pos')->pluck('id')->toArray();

        if (empty($clientes) || empty($sucursales) || empty($usuarios)) {
            $this->command->warn('No se pueden crear encargos sin clientes, sucursales o usuarios existentes.');
            return;
        }

        $encargos = [
            [
                'cliente_id' => $clientes[array_rand($clientes)],
                'sucursal_id' => $sucursales[array_rand($sucursales)],
                'usuario_id' => $usuarios[array_rand($usuarios)],
                'descripcion' => 'Medicamentos para diabetes',
                'detalles' => 'Necesito insulina y metformina para el tratamiento de diabetes tipo 2',
                'monto_estimado' => 1500.00,
                'monto_final' => null,
                'adelanto' => 500.00,
                'estado' => 'solicitado',
                'fecha_solicitud' => Carbon::now()->subDays(2),
                'fecha_entrega_estimada' => Carbon::now()->addDays(3),
                'fecha_entrega_real' => null,
                'observaciones' => 'Cliente requiere entrega a domicilio',
                'notas_internas' => 'Verificar stock de insulina',
                'urgente' => false,
                'prioridad' => 'normal',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'cliente_id' => $clientes[array_rand($clientes)],
                'sucursal_id' => $sucursales[array_rand($sucursales)],
                'usuario_id' => $usuarios[array_rand($usuarios)],
                'descripcion' => 'Antibióticos para infección respiratoria',
                'detalles' => 'Amoxicilina 500mg, 21 cápsulas para tratamiento de 7 días',
                'monto_estimado' => 800.00,
                'monto_final' => 750.00,
                'adelanto' => 0.00,
                'estado' => 'listo',
                'fecha_solicitud' => Carbon::now()->subDays(5),
                'fecha_entrega_estimada' => Carbon::now()->addDays(1),
                'fecha_entrega_real' => null,
                'observaciones' => 'Cliente recogerá en sucursal',
                'notas_internas' => 'Medicamento disponible en almacén',
                'urgente' => true,
                'prioridad' => 'alta',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'cliente_id' => $clientes[array_rand($clientes)],
                'sucursal_id' => $sucursales[array_rand($sucursales)],
                'usuario_id' => $usuarios[array_rand($usuarios)],
                'descripcion' => 'Vitaminas prenatales',
                'detalles' => 'Complejo vitamínico con ácido fólico para embarazo',
                'monto_estimado' => 1200.00,
                'monto_final' => 1200.00,
                'adelanto' => 600.00,
                'estado' => 'entregado',
                'fecha_solicitud' => Carbon::now()->subDays(10),
                'fecha_entrega_estimada' => Carbon::now()->subDays(3),
                'fecha_entrega_real' => Carbon::now()->subDays(3),
                'observaciones' => 'Entrega exitosa',
                'notas_internas' => 'Cliente satisfecho con el producto',
                'urgente' => false,
                'prioridad' => 'normal',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'cliente_id' => $clientes[array_rand($clientes)],
                'sucursal_id' => $sucursales[array_rand($sucursales)],
                'usuario_id' => $usuarios[array_rand($usuarios)],
                'descripcion' => 'Medicamentos para hipertensión',
                'detalles' => 'Losartán 50mg y amlodipino 5mg para control de presión arterial',
                'monto_estimado' => 2000.00,
                'monto_final' => null,
                'adelanto' => 1000.00,
                'estado' => 'en_proceso',
                'fecha_solicitud' => Carbon::now()->subDays(1),
                'fecha_entrega_estimada' => Carbon::now()->addDays(5),
                'fecha_entrega_real' => null,
                'observaciones' => 'Cliente requiere factura',
                'notas_internas' => 'Verificar disponibilidad de amlodipino',
                'urgente' => false,
                'prioridad' => 'normal',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'cliente_id' => $clientes[array_rand($clientes)],
                'sucursal_id' => $sucursales[array_rand($sucursales)],
                'usuario_id' => $usuarios[array_rand($usuarios)],
                'descripcion' => 'Analgésicos para dolor crónico',
                'detalles' => 'Tramadol 50mg y paracetamol 500mg para manejo del dolor',
                'monto_estimado' => 1800.00,
                'monto_final' => null,
                'adelanto' => 0.00,
                'estado' => 'cancelado',
                'fecha_solicitud' => Carbon::now()->subDays(15),
                'fecha_entrega_estimada' => Carbon::now()->subDays(8),
                'fecha_entrega_real' => null,
                'observaciones' => 'Cliente canceló por cambio de tratamiento',
                'notas_internas' => 'Devolver adelanto al cliente',
                'urgente' => false,
                'prioridad' => 'baja',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'cliente_id' => $clientes[array_rand($clientes)],
                'sucursal_id' => $sucursales[array_rand($sucursales)],
                'usuario_id' => $usuarios[array_rand($usuarios)],
                'descripcion' => 'Medicamentos para asma',
                'detalles' => 'Salbutamol inhalador y budesonida para control del asma',
                'monto_estimado' => 2500.00,
                'monto_final' => null,
                'adelanto' => 500.00,
                'estado' => 'vencido',
                'fecha_solicitud' => Carbon::now()->subDays(20),
                'fecha_entrega_estimada' => Carbon::now()->subDays(5),
                'fecha_entrega_real' => null,
                'observaciones' => 'Cliente no ha recogido el encargo',
                'notas_internas' => 'Contactar al cliente para confirmar entrega',
                'urgente' => true,
                'prioridad' => 'urgente',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($encargos as $encargo) {
            DB::table('encargos')->insert($encargo);
        }

        $this->command->info('Encargos creados exitosamente.');
    }
} 