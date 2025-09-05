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
        Schema::create('horarios_disponibles', function (Blueprint $table) {
            $table->id('Horario_ID');
            $table->unsignedBigInteger('Fk_Programacion')->comment('ID de la programación del especialista');
            $table->date('Fecha')->comment('Fecha del horario');
            $table->time('Hora')->comment('Hora del horario');
            $table->enum('Estatus', ['Disponible', 'Reservado', 'Ocupado', 'Bloqueado'])->default('Disponible')->comment('Estado del horario');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que agregó el horario');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 200)->nullable()->comment('Usuario que modificó el horario');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Fk_Programacion');
            $table->index('Fecha');
            $table->index('Hora');
            $table->index('Estatus');
            $table->index('ID_H_O_D');
            $table->index(['Fk_Programacion', 'Fecha', 'Hora']);
            
            // Clave única para evitar duplicados
            $table->unique(['Fk_Programacion', 'Fecha', 'Hora'], 'uk_programacion_fecha_hora');
            
            // Clave foránea
            $table->foreign('Fk_Programacion')->references('Programacion_ID')->on('programacion_especialistas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horarios_disponibles');
    }
};
