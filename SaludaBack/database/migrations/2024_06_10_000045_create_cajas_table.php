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
        Schema::create('cajas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('descripcion')->nullable();
            $table->decimal('saldo_inicial', 15, 2)->default(0);
            $table->decimal('saldo_actual', 15, 2)->default(0);
            $table->enum('estado', ['abierta', 'cerrada', 'en_uso'])->default('cerrada');
            $table->unsignedBigInteger('sucursal_id');
            $table->unsignedBigInteger('usuario_apertura_id')->nullable();
            $table->unsignedBigInteger('usuario_cierre_id')->nullable();
            $table->timestamp('fecha_apertura')->nullable();
            $table->timestamp('fecha_cierre')->nullable();
            $table->text('observaciones_apertura')->nullable();
            $table->text('observaciones_cierre')->nullable();
            $table->decimal('diferencia', 15, 2)->default(0);
            $table->boolean('activa')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('sucursal_id')->references('id')->on('sucursales')->onDelete('cascade');
            $table->foreign('usuario_apertura_id')->references('id')->on('personal_pos')->onDelete('set null');
            $table->foreign('usuario_cierre_id')->references('id')->on('personal_pos')->onDelete('set null');
            
            $table->index(['sucursal_id', 'estado']);
            $table->index(['estado', 'activa']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cajas');
    }
}; 