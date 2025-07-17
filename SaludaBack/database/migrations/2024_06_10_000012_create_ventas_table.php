<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            $table->string('numero_venta', 50)->unique();
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            $table->foreignId('personal_id')->constrained('personal_pos')->onDelete('cascade');
            $table->foreignId('cliente_id')->nullable()->constrained('clientes')->onDelete('set null');
            
            // Información de la venta
            $table->enum('tipo_venta', ['contado', 'credito', 'consignacion', 'mayorista'])->default('contado');
            $table->enum('estado', ['pendiente', 'confirmada', 'anulada', 'devuelta', 'parcialmente_devuelta'])->default('pendiente');
            $table->enum('tipo_documento', ['ticket', 'factura_a', 'factura_b', 'factura_c', 'remito'])->default('ticket');
            $table->string('numero_documento', 50)->nullable();
            $table->string('serie_documento', 10)->nullable();
            
            // Información comercial
            $table->decimal('subtotal', 12, 2)->default(0.00);
            $table->decimal('descuento_total', 12, 2)->default(0.00);
            $table->decimal('subtotal_con_descuento', 12, 2)->default(0.00);
            $table->decimal('iva_total', 12, 2)->default(0.00);
            $table->decimal('impuestos_adicionales', 12, 2)->default(0.00);
            $table->decimal('total', 12, 2)->default(0.00);
            $table->decimal('total_pagado', 12, 2)->default(0.00);
            $table->decimal('saldo_pendiente', 12, 2)->default(0.00);
            
            // Información de pago
            $table->enum('metodo_pago', ['efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'cheque', 'otro'])->nullable();
            $table->string('numero_tarjeta', 20)->nullable();
            $table->string('autorizacion_tarjeta', 50)->nullable();
            $table->string('banco_transferencia', 100)->nullable();
            $table->string('numero_cheque', 50)->nullable();
            $table->string('banco_cheque', 100)->nullable();
            $table->date('fecha_vencimiento_cheque')->nullable();
            
            // Información de entrega
            $table->enum('tipo_entrega', ['inmediata', 'programada', 'envio'])->default('inmediata');
            $table->timestamp('fecha_entrega')->nullable();
            $table->text('direccion_entrega')->nullable();
            $table->string('instrucciones_entrega', 255)->nullable();
            $table->decimal('costo_envio', 10, 2)->default(0.00);
            
            // Información de descuentos
            $table->decimal('descuento_porcentaje', 5, 2)->default(0.00);
            $table->decimal('descuento_monto', 10, 2)->default(0.00);
            $table->string('motivo_descuento', 255)->nullable();
            $table->foreignId('autorizado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            
            // Información de facturación
            $table->string('cuit_cliente', 20)->nullable();
            $table->string('razon_social_cliente', 255)->nullable();
            $table->text('direccion_facturacion')->nullable();
            $table->string('condicion_iva_cliente', 50)->nullable();
            
            // Información de receta (para farmacias)
            $table->string('numero_receta', 50)->nullable();
            $table->string('medico_receta', 100)->nullable();
            $table->string('matricula_medico', 20)->nullable();
            $table->date('fecha_receta')->nullable();
            $table->date('fecha_vencimiento_receta')->nullable();
            $table->text('indicaciones_receta')->nullable();
            
            // Información de devolución
            $table->timestamp('fecha_devolucion')->nullable();
            $table->foreignId('devolucion_autorizada_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->text('motivo_devolucion')->nullable();
            $table->decimal('monto_devolucion', 12, 2)->default(0.00);
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->text('notas_internas')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamp('fecha_confirmacion')->nullable();
            $table->foreignId('confirmado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['numero_venta', 'estado']);
            $table->index(['sucursal_id', 'created_at']);
            $table->index(['personal_id', 'created_at']);
            $table->index(['cliente_id', 'created_at']);
            $table->index(['tipo_venta', 'estado']);
            $table->index(['tipo_documento', 'numero_documento']);
            $table->index(['metodo_pago', 'created_at']);
            $table->index(['total', 'created_at']);
            $table->index('fecha_entrega');
            $table->index('numero_receta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
}; 