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
        Schema::create('programacion_especialistas', function (Blueprint $table) {
            $table->id('Programacion_ID');
            $table->unsignedBigInteger('Fk_Especialista')->comment('ID del especialista');
            $table->unsignedBigInteger('Fk_Sucursal')->comment('ID de la sucursal');
            $table->unsignedBigInteger('Fk_Consultorio')->nullable()->comment('ID del consultorio');
            $table->enum('Tipo_Programacion', ['Regular', 'Temporal', 'Especial'])->default('Regular')->comment('Tipo de programación');
            $table->date('Fecha_Inicio')->comment('Fecha de inicio de la programación');
            $table->date('Fecha_Fin')->comment('Fecha de fin de la programación');
            $table->time('Hora_Inicio')->comment('Hora de inicio de la programación');
            $table->time('Hora_Fin')->comment('Hora de fin de la programación');
            $table->integer('Intervalo_Citas')->default(30)->comment('Intervalo entre citas en minutos');
            $table->enum('Estatus', ['Programada', 'Activa', 'Pausada', 'Finalizada', 'Cancelada'])->default('Programada')->comment('Estado de la programación');
            $table->text('Notas')->nullable()->comment('Notas adicionales sobre la programación');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que agregó la programación');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 200)->nullable()->comment('Usuario que modificó la programación');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Fk_Especialista');
            $table->index('Fk_Sucursal');
            $table->index('Fk_Consultorio');
            $table->index('Fecha_Inicio');
            $table->index('Fecha_Fin');
            $table->index('Estatus');
            $table->index('ID_H_O_D');
            $table->index(['Fecha_Inicio', 'Fecha_Fin']);
            
            // Claves foráneas
            $table->foreign('Fk_Especialista')->references('Especialista_ID')->on('especialistas')->onDelete('cascade');
            $table->foreign('Fk_Sucursal')->references('Sucursal_ID')->on('sucursales_mejoradas')->onDelete('restrict');
            $table->foreign('Fk_Consultorio')->references('Consultorio_ID')->on('consultorios_mejorados')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programacion_especialistas');
    }
};
