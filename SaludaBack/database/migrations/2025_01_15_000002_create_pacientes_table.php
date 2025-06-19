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
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id('Paciente_ID');
            $table->string('Cedula', 20)->unique()->comment('Número de cédula del paciente');
            $table->string('Nombre_Completo', 255)->comment('Nombre completo del paciente');
            $table->date('Fecha_Nacimiento')->comment('Fecha de nacimiento');
            $table->string('Sexo', 10)->comment('Sexo: Masculino, Femenino');
            $table->string('Telefono', 20)->nullable()->comment('Número de teléfono');
            $table->string('Correo_Electronico', 255)->nullable()->comment('Correo electrónico');
            $table->text('Direccion')->nullable()->comment('Dirección del paciente');
            $table->string('Grupo_Sanguineo', 10)->nullable()->comment('Grupo sanguíneo');
            $table->text('Alergias')->nullable()->comment('Alergias conocidas');
            $table->text('Antecedentes_Medicos')->nullable()->comment('Antecedentes médicos');
            $table->string('Estado_Civil', 50)->nullable()->comment('Estado civil');
            $table->string('Ocupacion', 100)->nullable()->comment('Ocupación del paciente');
            $table->string('Emergencia_Contacto', 255)->nullable()->comment('Contacto de emergencia');
            $table->string('Emergencia_Telefono', 20)->nullable()->comment('Teléfono de emergencia');
            $table->string('Estado', 50)->default('Activo')->comment('Estado: Activo, Inactivo');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 100)->default('Sistema')->comment('Usuario que agregó el paciente');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 100)->nullable()->comment('Usuario que modificó el paciente');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            
            // Índices para mejorar el rendimiento
            $table->index('Cedula');
            $table->index('Nombre_Completo');
            $table->index('Estado');
            $table->index('ID_H_O_D');
            $table->index(['Nombre_Completo', 'Cedula']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes');
    }
}; 