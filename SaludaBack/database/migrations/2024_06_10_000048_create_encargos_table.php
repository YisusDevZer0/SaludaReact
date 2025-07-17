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
        Schema::create('encargos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cliente_id');
            $table->unsignedBigInteger('sucursal_id');
            $table->unsignedBigInteger('usuario_id');
            $table->string('descripcion');
            $table->text('detalles')->nullable();
            $table->decimal('monto_estimado', 15, 2)->nullable();
            $table->decimal('monto_final', 15, 2)->nullable();
            $table->decimal('adelanto', 15, 2)->default(0);
            $table->enum('estado', [
                'solicitado', 'en_proceso', 'listo', 'entregado', 
                'cancelado', 'vencido'
            ])->default('solicitado');
            $table->date('fecha_solicitud');
            $table->date('fecha_entrega_estimada');
            $table->date('fecha_entrega_real')->nullable();
            $table->text('observaciones')->nullable();
            $table->text('notas_internas')->nullable();
            $table->boolean('urgente')->default(false);
            $table->enum('prioridad', ['baja', 'normal', 'alta', 'urgente'])->default('normal');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
            $table->foreign('sucursal_id')->references('id')->on('sucursales')->onDelete('cascade');
            $table->foreign('usuario_id')->references('id')->on('personal_pos')->onDelete('restrict');
            
            $table->index(['sucursal_id', 'estado']);
            $table->index(['fecha_entrega_estimada', 'estado']);
            $table->index(['cliente_id', 'fecha_solicitud']);
            $table->index(['urgente', 'prioridad']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('encargos');
    }
}; 