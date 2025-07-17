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
        Schema::create('detalles_transferencia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transferencia_id')->constrained('transferencias_inventario')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            
            // Información del producto
            $table->string('codigo_producto', 50);
            $table->string('nombre_producto', 255);
            $table->text('descripcion_producto')->nullable();
            $table->string('codigo_barras', 100)->nullable();
            
            // Información de lote
            $table->string('numero_lote', 50)->nullable();
            $table->date('fecha_fabricacion')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->string('lote_proveedor', 50)->nullable();
            
            // Cantidades
            $table->integer('cantidad_solicitada');
            $table->integer('cantidad_enviada')->default(0);
            $table->integer('cantidad_recibida')->default(0);
            $table->integer('cantidad_pendiente');
            $table->string('unidad_medida', 20)->default('unidad');
            
            // Información de costo
            $table->decimal('costo_unitario', 10, 2)->nullable();
            $table->decimal('costo_total', 12, 2)->nullable();
            $table->decimal('valor_mercado', 12, 2)->nullable();
            
            // Estado del detalle
            $table->enum('estado', ['pendiente', 'enviado', 'recibido', 'cancelado', 'parcial'])->default('pendiente');
            $table->text('observaciones')->nullable();
            
            // Información de empaque
            $table->string('ubicacion_caja', 50)->nullable();
            $table->text('instrucciones_especiales')->nullable();
            $table->boolean('fragil')->default(false);
            $table->boolean('refrigerado')->default(false);
            
            // Información de recepción
            $table->timestamp('fecha_recepcion')->nullable();
            $table->foreignId('recibido_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->text('observaciones_recepcion')->nullable();
            $table->boolean('conforme_producto')->default(true);
            $table->text('motivo_no_conforme')->nullable();
            
            // Información adicional
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['transferencia_id', 'estado']);
            $table->index(['producto_id', 'estado']);
            $table->index(['codigo_producto', 'estado']);
            $table->index(['numero_lote', 'fecha_vencimiento']);
            $table->index(['cantidad_enviada', 'cantidad_recibida']);
            $table->index('fecha_recepcion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_transferencia');
    }
}; 