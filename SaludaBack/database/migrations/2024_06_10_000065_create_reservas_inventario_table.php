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
        Schema::create('reservas_inventario', function (Blueprint $table) {
            $table->id();
            $table->string('numero_reserva', 50)->unique();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            $table->foreignId('almacen_id')->constrained('almacenes')->onDelete('cascade');
            $table->foreignId('cliente_id')->nullable()->constrained('clientes')->onDelete('set null');
            $table->foreignId('paciente_id')->nullable()->constrained('pacientes')->onDelete('set null');
            $table->foreignId('personal_id')->constrained('personal_pos')->onDelete('cascade');
            
            // Información de la reserva
            $table->enum('tipo_reserva', ['venta', 'consulta_medica', 'procedimiento', 'mantenimiento', 'otro'])->default('venta');
            $table->enum('estado', ['activa', 'liberada', 'consumida', 'vencida', 'cancelada'])->default('activa');
            $table->enum('prioridad', ['baja', 'media', 'alta', 'urgente'])->default('media');
            
            // Cantidades
            $table->integer('cantidad_reservada');
            $table->integer('cantidad_liberada')->default(0);
            $table->integer('cantidad_consumida')->default(0);
            $table->integer('cantidad_disponible');
            $table->string('unidad_medida', 20)->default('unidad');
            
            // Fechas
            $table->date('fecha_reserva');
            $table->date('fecha_vencimiento');
            $table->date('fecha_liberacion')->nullable();
            $table->date('fecha_consumo')->nullable();
            
            // Información de lote
            $table->string('numero_lote', 50)->nullable();
            $table->date('fecha_vencimiento_lote')->nullable();
            
            // Información adicional
            $table->text('motivo_reserva')->nullable();
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['numero_reserva', 'estado']);
            $table->index(['producto_id', 'estado']);
            $table->index(['sucursal_id', 'estado']);
            $table->index(['almacen_id', 'estado']);
            $table->index(['cliente_id', 'estado']);
            $table->index(['paciente_id', 'estado']);
            $table->index(['tipo_reserva', 'estado']);
            $table->index(['fecha_vencimiento', 'estado']);
            $table->index(['prioridad', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas_inventario');
    }
}; 