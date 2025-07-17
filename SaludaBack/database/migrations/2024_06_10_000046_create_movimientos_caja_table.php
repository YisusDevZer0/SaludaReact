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
        Schema::create('movimientos_caja', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('caja_id');
            $table->enum('tipo', ['entrada', 'salida']);
            $table->decimal('monto', 15, 2);
            $table->string('concepto');
            $table->text('descripcion')->nullable();
            $table->enum('metodo_pago', ['efectivo', 'tarjeta', 'transferencia', 'cheque', 'otro'])->default('efectivo');
            $table->string('referencia')->nullable();
            $table->unsignedBigInteger('usuario_id');
            $table->unsignedBigInteger('venta_id')->nullable();
            $table->unsignedBigInteger('gasto_id')->nullable();
            $table->unsignedBigInteger('encargo_id')->nullable();
            $table->timestamp('fecha_movimiento');
            $table->decimal('saldo_anterior', 15, 2);
            $table->decimal('saldo_posterior', 15, 2);
            $table->boolean('confirmado')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('caja_id')->references('id')->on('cajas')->onDelete('cascade');
            $table->foreign('usuario_id')->references('id')->on('personal_pos')->onDelete('restrict');
            $table->foreign('venta_id')->references('id')->on('ventas')->onDelete('set null');
            $table->foreign('gasto_id')->references('id')->on('gastos')->onDelete('set null');
            $table->foreign('encargo_id')->references('id')->on('encargos')->onDelete('set null');
            
            $table->index(['caja_id', 'fecha_movimiento']);
            $table->index(['tipo', 'fecha_movimiento']);
            $table->index(['usuario_id', 'fecha_movimiento']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimientos_caja');
    }
}; 