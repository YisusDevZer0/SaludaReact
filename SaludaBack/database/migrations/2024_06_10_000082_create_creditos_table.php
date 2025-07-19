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
        Schema::create('creditos', function (Blueprint $table) {
            $table->id();
            $table->string('numero_credito', 50)->unique();
            // $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            // $table->foreignId('paciente_id')->nullable()->constrained('pacientes', 'Paciente_ID')->onDelete('set null');
            // $table->foreignId('doctor_id')->nullable()->constrained('doctores')->onDelete('set null');
            $table->unsignedBigInteger('cliente_id')->nullable();
            $table->unsignedBigInteger('paciente_id')->nullable();
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            
            // Información del crédito
            $table->enum('tipo_credito', ['consulta', 'procedimiento', 'cirugia', 'tratamiento', 'medicamentos', 'estudios', 'mixto'])->default('procedimiento');
            $table->enum('estado', ['activo', 'pagado', 'vencido', 'cancelado', 'refinanciado'])->default('activo');
            $table->enum('tipo_pago', ['contado', 'credito', 'obra_social', 'prepaga'])->default('credito');
            
            // Montos
            $table->decimal('monto_total', 12, 2);
            $table->decimal('monto_pagado', 12, 2)->default(0.00);
            $table->decimal('saldo_pendiente', 12, 2);
            $table->decimal('interes_mensual', 5, 2)->default(0.00); // Porcentaje
            $table->decimal('mora_diaria', 5, 2)->default(0.00); // Porcentaje
            
            // Plazos
            $table->integer('plazo_meses')->default(1);
            $table->integer('cuotas_totales');
            $table->integer('cuotas_pagadas')->default(0);
            $table->integer('cuotas_vencidas')->default(0);
            $table->date('fecha_inicio');
            $table->date('fecha_vencimiento');
            $table->date('fecha_ultimo_pago')->nullable();
            $table->date('fecha_proximo_pago')->nullable();
            
            // Información de garantía
            $table->string('garante_nombre', 100)->nullable();
            $table->string('garante_dni', 20)->nullable();
            $table->string('garante_telefono', 20)->nullable();
            $table->text('garante_direccion')->nullable();
            
            // Información de descuentos
            $table->decimal('descuento_porcentaje', 5, 2)->default(0.00);
            $table->decimal('descuento_monto', 10, 2)->default(0.00);
            $table->string('motivo_descuento', 255)->nullable();
            // $table->foreignId('autorizado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->unsignedBigInteger('autorizado_por')->nullable();
            
            // Información médica
            $table->text('diagnostico')->nullable();
            $table->text('tratamiento')->nullable();
            $table->text('procedimientos_realizados')->nullable();
            $table->text('medicamentos_recetados')->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->text('notas_internas')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['numero_credito', 'estado']);
            $table->index(['cliente_id', 'estado']);
            $table->index(['paciente_id', 'estado']);
            $table->index(['doctor_id', 'estado']);
            $table->index(['sucursal_id', 'estado']);
            $table->index(['tipo_credito', 'estado']);
            $table->index(['fecha_vencimiento', 'estado']);
            $table->index(['saldo_pendiente', 'estado']);
            $table->index('fecha_proximo_pago');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creditos');
    }
}; 