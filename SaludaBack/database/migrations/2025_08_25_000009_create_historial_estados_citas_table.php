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
        Schema::create('historial_estados_citas', function (Blueprint $table) {
            $table->id('Historial_ID');
            $table->unsignedBigInteger('Fk_Cita')->comment('ID de la cita');
            $table->enum('Estado_Anterior', ['Pendiente', 'Confirmada', 'En Proceso', 'Completada', 'Cancelada', 'No Asistió'])->nullable()->comment('Estado anterior de la cita');
            $table->enum('Estado_Nuevo', ['Pendiente', 'Confirmada', 'En Proceso', 'Completada', 'Cancelada', 'No Asistió'])->comment('Nuevo estado de la cita');
            $table->text('Motivo_Cambio')->nullable()->comment('Motivo del cambio de estado');
            $table->text('Comentarios')->nullable()->comment('Comentarios adicionales sobre el cambio');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que realizó el cambio');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora del cambio');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Fk_Cita');
            $table->index('Estado_Anterior');
            $table->index('Estado_Nuevo');
            $table->index('Agregado_El');
            $table->index('ID_H_O_D');
            
            // Clave foránea
            $table->foreign('Fk_Cita')->references('Cita_ID')->on('citas_mejoradas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_estados_citas');
    }
};
