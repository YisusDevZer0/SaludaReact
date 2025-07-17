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
        Schema::create('compras', function (Blueprint $table) {
            $table->id();
            $table->string('numero_compra', 50)->unique();
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            $table->foreignId('personal_id')->constrained('personal_pos')->onDelete('cascade');
            $table->foreignId('proveedor_id')->constrained('proveedores')->onDelete('cascade');
            
            // Información de la compra
            $table->enum('tipo_compra', ['directa', 'consignacion', 'importacion', 'transferencia'])->default('directa');
            $table->enum('estado', ['pendiente', 'confirmada', 'recibida', 'anulada', 'parcialmente_recibida'])->default('pendiente');
            $table->enum('tipo_documento', ['orden_compra', 'remito', 'factura', 'nota_debito', 'nota_credito'])->default('orden_compra');
            $table->string('numero_documento', 50)->nullable();
            $table->string('serie_documento', 10)->nullable();
            $table->date('fecha_documento')->nullable();
            
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
            $table->enum('metodo_pago', ['contado', 'credito', 'transferencia', 'cheque', 'otro'])->default('credito');
            $table->integer('dias_credito')->default(30);
            $table->date('fecha_vencimiento_pago')->nullable();
            $table->string('numero_cheque', 50)->nullable();
            $table->string('banco_cheque', 100)->nullable();
            $table->date('fecha_vencimiento_cheque')->nullable();
            $table->string('banco_transferencia', 100)->nullable();
            $table->string('numero_transferencia', 50)->nullable();
            
            // Información de entrega
            $table->enum('tipo_entrega', ['inmediata', 'programada', 'parcial'])->default('programada');
            $table->date('fecha_entrega_estimada')->nullable();
            $table->date('fecha_entrega_real')->nullable();
            $table->text('direccion_entrega')->nullable();
            $table->string('instrucciones_entrega', 255)->nullable();
            $table->decimal('costo_envio', 10, 2)->default(0.00);
            
            // Información de descuentos
            $table->decimal('descuento_porcentaje', 5, 2)->default(0.00);
            $table->decimal('descuento_monto', 10, 2)->default(0.00);
            $table->string('motivo_descuento', 255)->nullable();
            $table->foreignId('autorizado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            
            // Información de recepción
            $table->timestamp('fecha_recepcion')->nullable();
            $table->foreignId('recibido_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->text('observaciones_recepcion')->nullable();
            $table->boolean('conforme_entrega')->default(true);
            $table->text('motivo_no_conforme')->nullable();
            
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
            $table->index(['numero_compra', 'estado']);
            $table->index(['sucursal_id', 'created_at']);
            $table->index(['personal_id', 'created_at']);
            $table->index(['proveedor_id', 'created_at']);
            $table->index(['tipo_compra', 'estado']);
            $table->index(['tipo_documento', 'numero_documento']);
            $table->index(['metodo_pago', 'created_at']);
            $table->index(['total', 'created_at']);
            $table->index('fecha_entrega_estimada');
            $table->index('fecha_entrega_real');
            $table->index('fecha_vencimiento_pago');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compras');
    }
}; 