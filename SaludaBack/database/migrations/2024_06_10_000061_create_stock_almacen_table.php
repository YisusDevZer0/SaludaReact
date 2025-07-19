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
        Schema::create('stock_almacen', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('almacen_id')->constrained('almacenes', 'Almacen_ID')->onDelete('cascade');
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            
            // Información de stock
            $table->integer('stock_actual')->default(0);
            $table->integer('stock_reservado')->default(0);
            $table->integer('stock_disponible')->default(0);
            $table->integer('stock_minimo')->default(0);
            $table->integer('stock_maximo')->nullable();
            $table->integer('stock_critico')->nullable();
            
            // Información de lote (si aplica)
            $table->string('numero_lote', 50)->nullable();
            $table->date('fecha_fabricacion')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->string('lote_proveedor', 50)->nullable();
            
            // Ubicación física en el almacén
            $table->string('estante', 20)->nullable();
            $table->string('pasillo', 20)->nullable();
            $table->string('nivel', 20)->nullable();
            $table->string('posicion', 20)->nullable();
            $table->text('ubicacion_descripcion')->nullable();
            
            // Información de costo
            $table->decimal('costo_unitario', 10, 2)->nullable();
            $table->decimal('costo_total', 12, 2)->nullable();
            $table->decimal('valor_mercado', 12, 2)->nullable();
            $table->decimal('margen_ganancia', 5, 2)->nullable();
            
            // Estado del stock
            $table->enum('estado', ['disponible', 'reservado', 'en_transito', 'en_cuarentena', 'defectuoso', 'vencido'])->default('disponible');
            $table->boolean('activo')->default(true);
            $table->text('observaciones')->nullable();
            
            // Alertas
            $table->boolean('alerta_stock_bajo')->default(false);
            $table->boolean('alerta_vencimiento')->default(false);
            $table->date('fecha_alerta_vencimiento')->nullable();
            
            // Información de auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamp('ultimo_movimiento')->nullable();
            $table->string('ultimo_movimiento_tipo', 50)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->unique(['producto_id', 'almacen_id', 'numero_lote']);
            $table->index(['producto_id', 'estado']);
            $table->index(['almacen_id', 'estado']);
            $table->index(['sucursal_id', 'estado']);
            $table->index(['stock_actual', 'stock_minimo']);
            $table->index('fecha_vencimiento');
            $table->index('numero_lote');
            $table->index('ultimo_movimiento');
            $table->index('alerta_stock_bajo');
            $table->index('alerta_vencimiento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_almacen');
    }
}; 