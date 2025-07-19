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
        Schema::create('movimientos_inventario', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            $table->foreignId('almacen_id')->nullable()->constrained('almacenes', 'Almacen_ID')->onDelete('set null');
            $table->foreignId('personal_id')->nullable()->constrained('personal_pos')->onDelete('set null');
            
            // Información del movimiento
            $table->enum('tipo_movimiento', [
                'entrada_compra',
                'entrada_devolucion',
                'entrada_ajuste',
                'entrada_transferencia',
                'salida_venta',
                'salida_devolucion',
                'salida_ajuste',
                'salida_transferencia',
                'salida_merma',
                'salida_vencimiento',
                'reserva',
                'liberacion_reserva'
            ]);
            
            $table->enum('categoria_movimiento', ['entrada', 'salida', 'ajuste', 'reserva'])->index();
            $table->integer('cantidad');
            $table->integer('cantidad_anterior');
            $table->integer('cantidad_nueva');
            $table->decimal('costo_unitario', 10, 2)->nullable();
            $table->decimal('costo_total', 12, 2)->nullable();
            
            // Información de lote
            $table->string('numero_lote', 50)->nullable();
            $table->date('fecha_fabricacion')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->string('lote_proveedor', 50)->nullable();
            
            // Referencias
            $table->string('numero_documento', 50)->nullable(); // Factura, remito, etc.
            $table->string('tipo_documento', 50)->nullable(); // Factura, remito, nota de crédito, etc.
            $table->foreignId('proveedor_id')->nullable()->constrained('proveedores')->onDelete('set null');
            $table->foreignId('cliente_id')->nullable()->constrained('clientes')->onDelete('set null');
            $table->foreignId('venta_id')->nullable()->constrained('ventas')->onDelete('set null');
            $table->foreignId('compra_id')->nullable()->constrained('compras')->onDelete('set null');
            
            // Información de ubicación
            $table->string('ubicacion_origen', 100)->nullable();
            $table->string('ubicacion_destino', 100)->nullable();
            $table->text('observaciones')->nullable();
            
            // Estado del movimiento
            $table->enum('estado', ['pendiente', 'confirmado', 'anulado', 'reversado'])->default('confirmado');
            $table->timestamp('fecha_confirmacion')->nullable();
            $table->foreignId('confirmado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['producto_id', 'fecha_creacion']);
            $table->index(['sucursal_id', 'tipo_movimiento']);
            $table->index(['tipo_movimiento', 'estado']);
            $table->index(['categoria_movimiento', 'created_at']);
            $table->index(['numero_documento', 'tipo_documento']);
            $table->index(['proveedor_id', 'created_at']);
            $table->index(['cliente_id', 'created_at']);
            $table->index(['venta_id', 'created_at']);
            $table->index(['compra_id', 'created_at']);
            $table->index('numero_lote');
            $table->index('fecha_vencimiento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimientos_inventario');
    }
}; 