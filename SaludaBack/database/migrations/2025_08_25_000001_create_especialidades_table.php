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
        Schema::create('especialidades', function (Blueprint $table) {
            $table->id('Especialidad_ID');
            $table->string('Nombre_Especialidad', 200)->comment('Nombre de la especialidad médica');
            $table->text('Descripcion')->nullable()->comment('Descripción detallada de la especialidad');
            $table->string('Color_Calendario', 7)->default('#1976d2')->comment('Color para representar en calendario');
            $table->enum('Estatus_Especialidad', ['Activa', 'Inactiva'])->default('Activa')->comment('Estado de la especialidad');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que agregó la especialidad');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 200)->nullable()->comment('Usuario que modificó la especialidad');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Nombre_Especialidad');
            $table->index('Estatus_Especialidad');
            $table->index('ID_H_O_D');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('especialidades');
    }
};
