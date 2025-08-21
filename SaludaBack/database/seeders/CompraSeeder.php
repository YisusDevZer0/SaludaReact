<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CompraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tabla de compras (en orden correcto por foreign keys)
        DB::table('detalles_compra')->delete();
        DB::table('compras')->delete();

        // Obtener IDs existentes
        $proveedores = DB::table('proveedores')->pluck('id')->toArray();
        $personal = DB::table('personal')->pluck('id')->toArray();
        $sucursales = DB::table('sucursales')->pluck('id')->toArray();
        $productos = DB::table('productos')->pluck('id')->toArray();

        if (empty($proveedores) || empty($personal) || empty($sucursales) || empty($productos)) {
            $this->command->warn('No hay datos suficientes para crear compras. Asegúrate de tener proveedores, personal, sucursales y productos.');
            return;
        }

        $estados = ['pendiente', 'aprobada', 'en_proceso', 'recibida', 'cancelada'];
        $metodosPago = ['efectivo', 'transferencia', 'cheque', 'credito'];
        $tiposCompra = ['contado', 'credito', 'consignacion'];

        // Crear compras
        for ($i = 1; $i <= 20; $i++) {
            $fechaDocumento = Carbon::now()->subDays(rand(1, 90));
            $estado = $estados[array_rand($estados)];
            $metodoPago = $metodosPago[array_rand($metodosPago)];
            $tipoCompra = $tiposCompra[array_rand($tiposCompra)];
            
            $subtotal = rand(1000, 50000);
            $descuentoTotal = rand(0, $subtotal * 0.1);
            $subtotalConDescuento = $subtotal - $descuentoTotal;
            $ivaTotal = $subtotalConDescuento * 0.16;
            $impuestosAdicionales = rand(0, $subtotalConDescuento * 0.05);
            $total = $subtotalConDescuento + $ivaTotal + $impuestosAdicionales;

            $compraId = DB::table('compras')->insertGetId([
                'numero_compra' => 'COMP-' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'sucursal_id' => $sucursales[array_rand($sucursales)],
                'personal_id' => $personal[array_rand($personal)],
                'proveedor_id' => $proveedores[array_rand($proveedores)],
                'tipo_compra' => $tipoCompra,
                'estado' => $estado,
                'tipo_documento' => 'Factura',
                'numero_documento' => 'FAC-' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'serie_documento' => 'A',
                'fecha_documento' => $fechaDocumento,
                'subtotal' => $subtotal,
                'descuento_total' => $descuentoTotal,
                'subtotal_con_descuento' => $subtotalConDescuento,
                'iva_total' => $ivaTotal,
                'impuestos_adicionales' => $impuestosAdicionales,
                'total' => $total,
                'total_pagado' => $estado === 'recibida' ? $total : rand(0, $total),
                'saldo_pendiente' => $estado === 'recibida' ? 0 : $total,
                'metodo_pago' => $metodoPago,
                'dias_credito' => $tipoCompra === 'credito' ? rand(15, 90) : 0,
                'fecha_vencimiento_pago' => $tipoCompra === 'credito' ? $fechaDocumento->copy()->addDays(rand(15, 90)) : null,
                'tipo_entrega' => 'directa',
                'fecha_entrega_estimada' => $fechaDocumento->copy()->addDays(rand(1, 30)),
                'fecha_entrega_real' => $estado === 'recibida' ? $fechaDocumento->copy()->addDays(rand(1, 15)) : null,
                'observaciones' => 'Compra de productos varios',
                'notas_internas' => 'Notas internas de la compra',
                'creado_por' => 'Sistema',
                'actualizado_por' => 'Sistema',
                'created_at' => $fechaDocumento,
                'updated_at' => $fechaDocumento,
            ]);

            // Crear detalles de compra
            $numDetalles = rand(1, 5);
            for ($j = 1; $j <= $numDetalles; $j++) {
                $productoId = $productos[array_rand($productos)];
                $cantidad = rand(1, 50);
                $precioUnitario = rand(10, 1000);
                $subtotalDetalle = $cantidad * $precioUnitario;
                $impuestos = $subtotalDetalle * 0.16;
                $descuentos = rand(0, $subtotalDetalle * 0.1);
                $totalDetalle = $subtotalDetalle + $impuestos - $descuentos;

                DB::table('detalles_compra')->insert([
                    'compra_id' => $compraId,
                    'producto_id' => $productoId,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'subtotal' => $subtotalDetalle,
                    'impuestos' => $impuestos,
                    'descuentos' => $descuentos,
                    'total' => $totalDetalle,
                    'observaciones' => 'Detalle de compra',
                    'created_at' => $fechaDocumento,
                    'updated_at' => $fechaDocumento,
                ]);
            }
        }

        $this->command->info('Seeder de compras ejecutado exitosamente. Se crearon 20 compras con sus detalles.');
    }
}
