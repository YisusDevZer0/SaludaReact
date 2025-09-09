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
        Schema::create('tipos_consulta', function (Blueprint $table) {
            $table->id('Tipo_ID');
            $table->string('Nom_Tipo', 200)->comment('Nombre del tipo de consulta');
            $table->enum('Estado', ['Activo', 'Inactivo'])->default('Activo')->comment('Estado del tipo de consulta');
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que agregó el tipo de consulta');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Sistema', 100)->default('SaludaReact')->comment('Sistema que creó el registro');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            $table->unsignedBigInteger('Especialidad')->comment('ID de la especialidad médica');
            
            // Campos de auditoría adicionales
            $table->string('Modificado_Por', 200)->nullable()->comment('Usuario que modificó el tipo de consulta');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Nom_Tipo');
            $table->index('Estado');
            $table->index('Especialidad');
            $table->index('ID_H_O_D');
            
            // Clave foránea
            $table->foreign('Especialidad')->references('Especialidad_ID')->on('especialidades')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipos_consulta');
    }
};
