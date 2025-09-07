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
        Schema::create('especialistas', function (Blueprint $table) {
            $table->id('Especialista_ID');
            $table->string('Nombre_Completo', 250)->comment('Nombre completo del especialista');
            $table->string('Cedula_Profesional', 50)->unique()->nullable()->comment('Cédula profesional del especialista');
            $table->string('Correo_Electronico', 200)->unique()->nullable()->comment('Correo electrónico del especialista');
            $table->string('Telefono', 20)->nullable()->comment('Teléfono del especialista');
            $table->unsignedBigInteger('Fk_Especialidad')->comment('ID de la especialidad médica');
            $table->date('Fecha_Nacimiento')->nullable()->comment('Fecha de nacimiento del especialista');
            $table->enum('Genero', ['Masculino', 'Femenino', 'Otro'])->nullable()->comment('Género del especialista');
            $table->string('Foto_Perfil', 500)->nullable()->comment('Ruta de la foto de perfil');
            $table->enum('Estatus', ['Activo', 'Inactivo', 'Vacaciones', 'Licencia'])->default('Activo')->comment('Estado del especialista');
            $table->string('ID_Google_Calendar', 300)->nullable()->comment('ID del calendario de Google');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que agregó el especialista');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 200)->nullable()->comment('Usuario que modificó el especialista');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Fk_Especialidad');
            $table->index('Estatus');
            $table->index('ID_H_O_D');
            $table->index('Cedula_Profesional');
            $table->index('Correo_Electronico');
            
            // Clave foránea
            $table->foreign('Fk_Especialidad')->references('Especialidad_ID')->on('especialidades')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('especialistas');
    }
};
