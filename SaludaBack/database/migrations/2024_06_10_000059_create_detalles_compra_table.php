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
        Schema::create('detalles_compra', function (Blueprint $table) {
            $table->id();
            $table->foreignId('compra_id')->constrained('compras')->onDelete('cascade');
            // $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->unsignedBigInteger('producto_id')->nullable();
            
            // Información del producto
            $table->string('codigo_producto', 50);
            $table->string('nombre_producto', 255);
            $table->text('descripcion_producto')->nullable();
            $table->string('codigo_barras', 100)->nullable();
            $table->string('codigo_proveedor', 50)->nullable();
            
            // Información de lote
            $table->string('numero_lote', 50)->nullable();
            $table->date('fecha_fabricacion')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->string('lote_proveedor', 50)->nullable();
            
            // Cantidades y precios
            $table->integer('cantidad_solicitada');
            $table->integer('cantidad_recibida')->default(0);
            $table->integer('cantidad_pendiente');
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('precio_total', 12, 2);
            $table->decimal('costo_unitario', 10, 2)->nullable();
            $table->decimal('costo_total', 12, 2)->nullable();
            
            // Descuentos
            $table->decimal('descuento_porcentaje', 5, 2)->default(0.00);
            $table->decimal('descuento_monto', 10, 2)->default(0.00);
            $table->decimal('subtotal_con_descuento', 12, 2);
            $table->string('motivo_descuento', 255)->nullable();
            
            // Impuestos
            $table->decimal('iva_porcentaje', 5, 2)->default(21.00);
            $table->decimal('iva_monto', 10, 2)->default(0.00);
            $table->decimal('impuestos_adicionales', 10, 2)->default(0.00);
            $table->decimal('total_linea', 12, 2);
            
            // Estado del detalle
            $table->enum('estado', ['pendiente', 'confirmado', 'recibido', 'anulado', 'devuelto'])->default('pendiente');
            $table->integer('cantidad_devuelta')->default(0);
            $table->decimal('monto_devuelto', 12, 2)->default(0.00);
            $table->text('motivo_devolucion')->nullable();
            $table->timestamp('fecha_devolucion')->nullable();
            // $table->foreignId('devolucion_autorizada_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->unsignedBigInteger('devolucion_autorizada_por')->nullable();
            
            // Información de recepción
            $table->timestamp('fecha_recepcion')->nullable();
            // $table->foreignId('recibido_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->unsignedBigInteger('recibido_por')->nullable();
            $table->text('observaciones_recepcion')->nullable();
            $table->boolean('conforme_producto')->default(true);
            $table->text('motivo_no_conforme')->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['compra_id', 'estado']);
            $table->index(['producto_id', 'created_at']);
            $table->index(['codigo_producto', 'created_at']);
            $table->index(['numero_lote', 'fecha_vencimiento']);
            $table->index(['cantidad_recibida', 'cantidad_solicitada']);
            $table->index(['cantidad_devuelta', 'estado']);
            $table->index('fecha_recepcion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_compra');
    }
}; 