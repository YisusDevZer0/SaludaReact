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
        Schema::create('cuotas_credito_dental', function (Blueprint $table) {
            $table->id();
            $table->foreignId('credito_dental_id')->constrained('creditos_dentales')->onDelete('cascade');
            $table->integer('numero_cuota');
            $table->enum('estado', ['pendiente', 'pagada', 'vencida', 'parcial', 'cancelada'])->default('pendiente');
            
            // Montos
            $table->decimal('monto_cuota', 10, 2);
            $table->decimal('monto_pagado', 10, 2)->default(0.00);
            $table->decimal('saldo_pendiente', 10, 2);
            $table->decimal('interes_calculado', 10, 2)->default(0.00);
            $table->decimal('mora_calculada', 10, 2)->default(0.00);
            
            // Fechas
            $table->date('fecha_vencimiento');
            $table->date('fecha_pago')->nullable();
            $table->time('hora_pago')->nullable();
            
            // Información de pago
            $table->enum('metodo_pago', ['efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'cheque', 'otro'])->nullable();
            $table->string('numero_recibo', 50)->nullable();
            $table->string('referencia_pago', 100)->nullable();
            $table->foreignId('cobrado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->unique(['credito_dental_id', 'numero_cuota']);
            $table->index(['credito_dental_id', 'estado']);
            $table->index(['fecha_vencimiento', 'estado']);
            $table->index(['estado', 'fecha_vencimiento']);
            $table->index('fecha_pago');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuotas_credito_dental');
    }
}; 