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
        Schema::create('doctores', function (Blueprint $table) {
            $table->id('Doctor_ID');
            $table->string('Cedula_Profesional', 50)->unique()->comment('Cédula profesional del doctor');
            $table->string('Nombre_Completo', 255)->comment('Nombre completo del doctor');
            $table->string('Especialidad', 100)->comment('Especialidad médica');
            $table->string('Subespecialidad', 100)->nullable()->comment('Subespecialidad si aplica');
            $table->string('Telefono', 20)->nullable()->comment('Número de teléfono');
            $table->string('Correo_Electronico', 255)->nullable()->comment('Correo electrónico');
            $table->text('Direccion')->nullable()->comment('Dirección del doctor');
            $table->time('Hora_Inicio_Laboral')->default('08:00:00')->comment('Hora de inicio del horario laboral');
            $table->time('Hora_Fin_Laboral')->default('17:00:00')->comment('Hora de fin del horario laboral');
            $table->integer('Duracion_Cita')->default(30)->comment('Duración de cada cita en minutos');
            $table->decimal('Costo_Consulta', 10, 2)->nullable()->comment('Costo de la consulta');
            $table->string('Consultorio_Asignado', 50)->nullable()->comment('Consultorio asignado al doctor');
            $table->string('Estado', 50)->default('Activo')->comment('Estado: Activo, Inactivo, Vacaciones');
            $table->text('Notas')->nullable()->comment('Notas adicionales sobre el doctor');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 100)->default('Sistema')->comment('Usuario que agregó el doctor');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 100)->nullable()->comment('Usuario que modificó el doctor');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            
            // Índices para mejorar el rendimiento
            $table->index('Cedula_Profesional');
            $table->index('Nombre_Completo');
            $table->index('Especialidad');
            $table->index('Estado');
            $table->index('ID_H_O_D');
            $table->index(['Nombre_Completo', 'Especialidad']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctores');
    }
}; 