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
        Schema::create('agendas', function (Blueprint $table) {
            $table->id('Agenda_ID');
            $table->string('Titulo_Cita', 255)->comment('Título o motivo de la cita');
            $table->text('Descripcion')->nullable()->comment('Descripción detallada de la cita');
            $table->date('Fecha_Cita')->comment('Fecha de la cita');
            $table->time('Hora_Inicio')->comment('Hora de inicio de la cita');
            $table->time('Hora_Fin')->comment('Hora de fin de la cita');
            $table->string('Estado_Cita', 50)->default('Pendiente')->comment('Estado: Pendiente, Confirmada, En Proceso, Completada, Cancelada, No Asistió');
            $table->string('Tipo_Cita', 100)->default('Consulta')->comment('Tipo: Consulta, Control, Urgencia, Procedimiento, etc.');
            $table->string('Consultorio', 50)->nullable()->comment('Número o nombre del consultorio');
            $table->decimal('Costo', 10, 2)->nullable()->comment('Costo de la cita');
            $table->text('Notas_Adicionales')->nullable()->comment('Notas adicionales sobre la cita');
            
            // Relaciones
            $table->unsignedBigInteger('Fk_Paciente')->comment('ID del paciente');
            $table->unsignedBigInteger('Fk_Doctor')->comment('ID del doctor');
            $table->unsignedBigInteger('Fk_Sucursal')->comment('ID de la sucursal');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 100)->default('Sistema')->comment('Usuario que agregó la cita');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 100)->nullable()->comment('Usuario que modificó la cita');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            
            // Índices para mejorar el rendimiento
            $table->index('Fecha_Cita');
            $table->index('Estado_Cita');
            $table->index('Fk_Paciente');
            $table->index('Fk_Doctor');
            $table->index('Fk_Sucursal');
            $table->index('ID_H_O_D');
            $table->index(['Fecha_Cita', 'Hora_Inicio']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agendas');
    }
}; 