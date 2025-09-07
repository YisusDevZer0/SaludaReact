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
        Schema::create('pacientes_mejorados', function (Blueprint $table) {
            $table->id('Paciente_ID');
            $table->string('Nombre', 100)->comment('Nombre del paciente');
            $table->string('Apellido', 100)->comment('Apellido del paciente');
            $table->date('Fecha_Nacimiento')->nullable()->comment('Fecha de nacimiento del paciente');
            $table->enum('Genero', ['Masculino', 'Femenino', 'Otro'])->nullable()->comment('Género del paciente');
            $table->string('Telefono', 20)->nullable()->comment('Teléfono del paciente');
            $table->string('Correo_Electronico', 200)->nullable()->comment('Correo electrónico del paciente');
            $table->text('Direccion')->nullable()->comment('Dirección del paciente');
            $table->string('Tipo_Sangre', 5)->nullable()->comment('Tipo de sangre del paciente');
            $table->text('Alergias')->nullable()->comment('Alergias conocidas del paciente');
            $table->text('Antecedentes_Medicos')->nullable()->comment('Antecedentes médicos del paciente');
            $table->enum('Estatus', ['Activo', 'Inactivo'])->default('Activo')->comment('Estado del paciente');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que agregó el paciente');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 200)->nullable()->comment('Usuario que modificó el paciente');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Nombre');
            $table->index('Apellido');
            $table->index('Telefono');
            $table->index('Correo_Electronico');
            $table->index('Estatus');
            $table->index('ID_H_O_D');
            $table->index(['Nombre', 'Apellido']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes_mejorados');
    }
};
