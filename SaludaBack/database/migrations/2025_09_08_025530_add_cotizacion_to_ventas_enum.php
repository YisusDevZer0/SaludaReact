<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modificar el ENUM de tipo_venta para incluir 'cotizacion'
        DB::statement("ALTER TABLE ventas MODIFY COLUMN tipo_venta ENUM('contado', 'credito', 'consignacion', 'mayorista', 'cotizacion') DEFAULT 'contado'");
        
        // Modificar el ENUM de tipo_documento para incluir 'cotizacion'
        DB::statement("ALTER TABLE ventas MODIFY COLUMN tipo_documento ENUM('ticket', 'factura_a', 'factura_b', 'factura_c', 'remito', 'cotizacion') DEFAULT 'ticket'");
        
        // Modificar el ENUM de metodo_pago para incluir 'pendiente'
        DB::statement("ALTER TABLE ventas MODIFY COLUMN metodo_pago ENUM('efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'cheque', 'otro', 'pendiente') DEFAULT 'efectivo'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir los cambios
        DB::statement("ALTER TABLE ventas MODIFY COLUMN tipo_venta ENUM('contado', 'credito', 'consignacion', 'mayorista') DEFAULT 'contado'");
        DB::statement("ALTER TABLE ventas MODIFY COLUMN tipo_documento ENUM('ticket', 'factura_a', 'factura_b', 'factura_c', 'remito') DEFAULT 'ticket'");
        DB::statement("ALTER TABLE ventas MODIFY COLUMN metodo_pago ENUM('efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'cheque', 'otro') DEFAULT 'efectivo'");
    }
};
