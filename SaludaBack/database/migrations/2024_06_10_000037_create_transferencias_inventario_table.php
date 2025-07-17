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
        Schema::create('transferencias_inventario', function (Blueprint $table) {
            $table->id();
            $table->string('numero_transferencia', 50)->unique();
            $table->foreignId('sucursal_origen_id')->constrained('sucursales')->onDelete('cascade');
            $table->foreignId('sucursal_destino_id')->constrained('sucursales')->onDelete('cascade');
            $table->foreignId('almacen_origen_id')->constrained('almacenes')->onDelete('cascade');
            $table->foreignId('almacen_destino_id')->constrained('almacenes')->onDelete('cascade');
            $table->foreignId('personal_id')->constrained('personal_pos')->onDelete('cascade');
            
            // Información de la transferencia
            $table->enum('tipo_transferencia', ['normal', 'urgente', 'programada', 'devolucion'])->default('normal');
            $table->enum('estado', ['pendiente', 'en_transito', 'recibida', 'cancelada', 'parcial'])->default('pendiente');
            $table->enum('prioridad', ['baja', 'media', 'alta', 'urgente'])->default('media');
            
            // Fechas
            $table->date('fecha_solicitud');
            $table->date('fecha_envio')->nullable();
            $table->date('fecha_recepcion')->nullable();
            $table->date('fecha_estimada_llegada')->nullable();
            
            // Información de transporte
            $table->string('metodo_transporte', 50)->nullable();
            $table->string('numero_guia', 50)->nullable();
            $table->string('empresa_transporte', 100)->nullable();
            $table->decimal('costo_transporte', 10, 2)->nullable();
            
            // Información de empaque
            $table->integer('numero_cajas')->nullable();
            $table->decimal('peso_total', 8, 2)->nullable(); // kg
            $table->decimal('volumen_total', 8, 2)->nullable(); // m³
            $table->text('instrucciones_empaque')->nullable();
            
            // Información de recepción
            $table->foreignId('recibido_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->text('observaciones_recepcion')->nullable();
            $table->boolean('conforme_recepcion')->default(true);
            $table->text('motivo_no_conforme')->nullable();
            
            // Información adicional
            $table->text('motivo_transferencia')->nullable();
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['numero_transferencia', 'estado']);
            $table->index(['sucursal_origen_id', 'estado']);
            $table->index(['sucursal_destino_id', 'estado']);
            $table->index(['almacen_origen_id', 'estado']);
            $table->index(['almacen_destino_id', 'estado']);
            $table->index(['personal_id', 'estado']);
            $table->index(['tipo_transferencia', 'estado']);
            $table->index(['fecha_solicitud', 'estado']);
            $table->index(['fecha_envio', 'estado']);
            $table->index(['fecha_recepcion', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transferencias_inventario');
    }
}; 