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
        Schema::create('detalles_conteo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conteo_id')->constrained('conteos_fisicos')->onDelete('cascade');
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
            $table->integer('cantidad_sistema');
            $table->integer('cantidad_fisica')->nullable();
            $table->integer('diferencia')->nullable();
            $table->string('unidad_medida', 20)->default('unidad');
            
            // Información de ubicación
            $table->string('ubicacion_estante', 50)->nullable();
            $table->string('ubicacion_pasillo', 50)->nullable();
            $table->string('ubicacion_nivel', 50)->nullable();
            $table->string('ubicacion_posicion', 50)->nullable();
            
            // Estado del conteo
            $table->enum('estado', ['pendiente', 'contado', 'verificado', 'con_diferencia'])->default('pendiente');
            $table->boolean('contado_por_scanner')->default(false);
            $table->timestamp('fecha_conteo')->nullable();
            $table->foreignId('contado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            
            // Información de costo
            $table->decimal('costo_unitario', 10, 2)->nullable();
            $table->decimal('costo_total_sistema', 12, 2)->nullable();
            $table->decimal('costo_total_fisico', 12, 2)->nullable();
            $table->decimal('valor_diferencia', 12, 2)->nullable();
            
            // Observaciones
            $table->text('observaciones_conteo')->nullable();
            $table->text('motivo_diferencia')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['conteo_id', 'estado']);
            $table->index(['producto_id', 'estado']);
            $table->index(['codigo_producto', 'estado']);
            $table->index(['numero_lote', 'fecha_vencimiento']);
            $table->index(['diferencia', 'estado']);
            $table->index('fecha_conteo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_conteo');
    }
}; 