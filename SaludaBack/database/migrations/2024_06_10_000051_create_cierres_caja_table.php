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
        Schema::create('cierres_caja', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('caja_id');
            $table->unsignedBigInteger('usuario_cierre_id');
            $table->timestamp('fecha_apertura');
            $table->timestamp('fecha_cierre');
            $table->decimal('saldo_inicial', 15, 2);
            $table->decimal('saldo_final_esperado', 15, 2);
            $table->decimal('saldo_final_real', 15, 2);
            $table->decimal('diferencia', 15, 2);
            $table->decimal('total_ventas', 15, 2)->default(0);
            $table->decimal('total_gastos', 15, 2)->default(0);
            $table->decimal('total_encargos', 15, 2)->default(0);
            $table->integer('cantidad_ventas')->default(0);
            $table->integer('cantidad_gastos')->default(0);
            $table->integer('cantidad_encargos')->default(0);
            $table->text('observaciones')->nullable();
            $table->text('conteo_efectivo')->nullable();
            $table->enum('estado', ['abierto', 'cerrado', 'revisado', 'aprobado'])->default('abierto');
            $table->unsignedBigInteger('usuario_revisor_id')->nullable();
            $table->timestamp('fecha_revision')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('caja_id')->references('id')->on('cajas')->onDelete('cascade');
            $table->foreign('usuario_cierre_id')->references('id')->on('personal_pos')->onDelete('restrict');
            $table->foreign('usuario_revisor_id')->references('id')->on('personal_pos')->onDelete('set null');
            
            $table->index(['caja_id', 'fecha_cierre']);
            $table->index(['estado', 'fecha_cierre']);
            $table->index(['usuario_cierre_id', 'fecha_cierre']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cierres_caja');
    }
}; 