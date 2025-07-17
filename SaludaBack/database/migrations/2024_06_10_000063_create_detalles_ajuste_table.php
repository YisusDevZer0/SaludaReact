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
        Schema::create('detalles_ajuste', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ajuste_id')->constrained('ajustes_inventario')->onDelete('cascade');
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
            $table->integer('cantidad_fisica');
            $table->integer('diferencia');
            $table->string('unidad_medida', 20)->default('unidad');
            
            // Información de costo
            $table->decimal('costo_unitario', 10, 2)->nullable();
            $table->decimal('costo_total_diferencia', 12, 2)->nullable();
            $table->decimal('valor_mercado_diferencia', 12, 2)->nullable();
            
            // Estado del detalle
            $table->enum('estado', ['pendiente', 'aprobado', 'rechazado', 'ejecutado'])->default('pendiente');
            $table->text('observaciones')->nullable();
            
            // Información adicional
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['ajuste_id', 'estado']);
            $table->index(['producto_id', 'estado']);
            $table->index(['codigo_producto', 'estado']);
            $table->index(['numero_lote', 'fecha_vencimiento']);
            $table->index(['diferencia', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_ajuste');
    }
}; 