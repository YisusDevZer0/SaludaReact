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
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 50)->unique();
            $table->string('nombre', 255);
            $table->text('descripcion')->nullable();
            $table->string('codigo_barras', 100)->nullable()->unique();
            $table->string('codigo_interno', 50)->nullable();
            
            // Categorización
            $table->foreignId('categoria_id')->nullable()->constrained('categorias_pos')->onDelete('set null');
            $table->unsignedBigInteger('marca_id')->nullable();
            $table->foreign('marca_id')->references('Marca_ID')->on('marcas')->onDelete('set null');
            $table->foreignId('presentacion_id')->nullable()->constrained('presentaciones')->onDelete('set null');
            $table->foreignId('componente_activo_id')->nullable()->constrained('componentes_activos')->onDelete('set null');
            
            // Información comercial
            $table->decimal('precio_venta', 10, 2);
            $table->decimal('precio_compra', 10, 2)->nullable();
            $table->decimal('precio_por_mayor', 10, 2)->nullable();
            $table->decimal('costo_unitario', 10, 2)->nullable();
            $table->decimal('margen_ganancia', 5, 2)->nullable(); // Porcentaje
            
            // Impuestos
            $table->decimal('iva', 5, 2)->default(21.00); // Porcentaje de IVA
            $table->boolean('exento_iva')->default(false);
            $table->decimal('impuestos_adicionales', 5, 2)->default(0.00);
            
            // Inventario
            $table->boolean('inventariable')->default(true);
            $table->integer('stock_minimo')->default(0);
            $table->integer('stock_maximo')->nullable();
            $table->integer('stock_actual')->default(0);
            $table->string('unidad_medida', 20)->default('unidad');
            $table->decimal('peso', 8, 3)->nullable(); // en kg
            $table->decimal('volumen', 8, 3)->nullable(); // en litros
            $table->string('ubicacion_almacen', 100)->nullable();
            
            // Características físicas
            $table->decimal('alto', 8, 2)->nullable(); // cm
            $table->decimal('ancho', 8, 2)->nullable(); // cm
            $table->decimal('largo', 8, 2)->nullable(); // cm
            $table->string('color', 50)->nullable();
            $table->string('material', 100)->nullable();
            
            // Información de proveedor
            $table->foreignId('proveedor_id')->nullable()->constrained('proveedores')->onDelete('set null');
            $table->string('codigo_proveedor', 50)->nullable();
            $table->integer('tiempo_entrega_dias')->nullable();
            $table->decimal('precio_proveedor', 10, 2)->nullable();
            
            // Almacén
            $table->unsignedBigInteger('almacen_id')->nullable();
            $table->foreign('almacen_id')->references('Almacen_ID')->on('almacenes')->onDelete('set null');
            
            // Estado y control
            $table->enum('estado', ['activo', 'inactivo', 'descontinuado', 'agotado'])->default('activo');
            $table->boolean('visible_en_pos')->default(true);
            $table->boolean('permitir_venta_sin_stock')->default(false);
            $table->boolean('requiere_receta')->default(false);
            $table->boolean('controlado_por_lote')->default(false);
            $table->boolean('controlado_por_fecha_vencimiento')->default(false);
            
            // Fechas importantes
            $table->date('fecha_vencimiento')->nullable();
            $table->date('fecha_fabricacion')->nullable();
            $table->integer('vida_util_dias')->nullable();
            
            // Información adicional
            $table->json('caracteristicas')->nullable(); // Características específicas del producto
            $table->json('etiquetas')->nullable(); // Etiquetas para búsqueda
            $table->text('notas')->nullable();
            $table->string('imagen_url')->nullable();
            $table->string('documentacion_url')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['codigo', 'estado']);
            $table->index(['codigo_barras', 'estado']);
            $table->index(['categoria_id', 'estado']);
            $table->index(['marca_id', 'estado']);
            $table->index(['proveedor_id', 'estado']);
            $table->index(['almacen_id', 'estado']);
            $table->index(['stock_actual', 'stock_minimo']);
            $table->index(['precio_venta', 'estado']);
            $table->index('visible_en_pos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
}; 