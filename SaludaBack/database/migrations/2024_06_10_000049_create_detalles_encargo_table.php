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
        Schema::create('detalles_encargo', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('encargo_id');
            $table->unsignedBigInteger('producto_id')->nullable();
            $table->string('descripcion_producto');
            $table->integer('cantidad');
            $table->decimal('precio_unitario', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->decimal('descuento', 15, 2)->default(0);
            $table->decimal('total', 15, 2);
            $table->text('especificaciones')->nullable();
            $table->text('observaciones')->nullable();
            $table->enum('estado', ['pendiente', 'en_proceso', 'listo', 'entregado'])->default('pendiente');
            $table->timestamps();

            $table->foreign('encargo_id')->references('id')->on('encargos')->onDelete('cascade');
            $table->foreign('producto_id')->references('id')->on('productos')->onDelete('set null');
            
            $table->index(['encargo_id', 'estado']);
            $table->index(['producto_id', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_encargo');
    }
}; 