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
        Schema::create('citas_mejoradas', function (Blueprint $table) {
            $table->id('Cita_ID');
            $table->string('Titulo', 200)->comment('Título o motivo de la cita');
            $table->text('Descripcion')->nullable()->comment('Descripción detallada de la cita');
            $table->unsignedBigInteger('Fk_Paciente')->comment('ID del paciente');
            $table->unsignedBigInteger('Fk_Especialista')->comment('ID del especialista');
            $table->unsignedBigInteger('Fk_Sucursal')->comment('ID de la sucursal');
            $table->unsignedBigInteger('Fk_Consultorio')->nullable()->comment('ID del consultorio');
            $table->date('Fecha_Cita')->comment('Fecha de la cita');
            $table->time('Hora_Inicio')->comment('Hora de inicio de la cita');
            $table->time('Hora_Fin')->comment('Hora de fin de la cita');
            $table->enum('Tipo_Cita', ['Consulta', 'Control', 'Urgencia', 'Procedimiento', 'Cirugía', 'Rehabilitación', 'Psicología', 'Nutrición', 'Pediatría'])->default('Consulta')->comment('Tipo de cita');
            $table->enum('Estado_Cita', ['Pendiente', 'Confirmada', 'En Proceso', 'Completada', 'Cancelada', 'No Asistió'])->default('Pendiente')->comment('Estado de la cita');
            $table->decimal('Costo', 10, 2)->default(0.00)->comment('Costo de la cita');
            $table->text('Notas_Adicionales')->nullable()->comment('Notas adicionales sobre la cita');
            $table->string('Color_Calendario', 7)->default('#1976d2')->comment('Color para representar en calendario');
            $table->string('ID_Google_Event', 500)->nullable()->comment('ID del evento en Google Calendar');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que agregó la cita');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 200)->nullable()->comment('Usuario que modificó la cita');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Fk_Paciente');
            $table->index('Fk_Especialista');
            $table->index('Fk_Sucursal');
            $table->index('Fk_Consultorio');
            $table->index('Fecha_Cita');
            $table->index('Hora_Inicio');
            $table->index('Tipo_Cita');
            $table->index('Estado_Cita');
            $table->index('ID_H_O_D');
            $table->index(['Fk_Especialista', 'Fecha_Cita']);
            $table->index(['Fk_Sucursal', 'Fecha_Cita']);
            $table->index(['Estado_Cita', 'Fecha_Cita']);
            
            // Claves foráneas
            $table->foreign('Fk_Paciente')->references('Paciente_ID')->on('pacientes_mejorados')->onDelete('restrict');
            $table->foreign('Fk_Especialista')->references('Especialista_ID')->on('especialistas')->onDelete('restrict');
            $table->foreign('Fk_Sucursal')->references('Sucursal_ID')->on('sucursales_mejoradas')->onDelete('restrict');
            $table->foreign('Fk_Consultorio')->references('Consultorio_ID')->on('consultorios_mejorados')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citas_mejoradas');
    }
};
