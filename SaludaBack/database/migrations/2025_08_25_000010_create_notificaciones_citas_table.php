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
        Schema::create('notificaciones_citas', function (Blueprint $table) {
            $table->id('Notificacion_ID');
            $table->unsignedBigInteger('Fk_Cita')->comment('ID de la cita');
            $table->enum('Tipo_Notificacion', ['Recordatorio', 'Confirmación', 'Cambio', 'Cancelación'])->comment('Tipo de notificación');
            $table->enum('Medio_Envio', ['SMS', 'Email', 'Push', 'WhatsApp'])->comment('Medio de envío de la notificación');
            $table->enum('Estado_Envio', ['Pendiente', 'Enviado', 'Fallido'])->default('Pendiente')->comment('Estado del envío');
            $table->timestamp('Fecha_Envio')->nullable()->comment('Fecha y hora del envío');
            $table->text('Mensaje')->nullable()->comment('Mensaje de la notificación');
            $table->string('Destinatario', 200)->comment('Destinatario de la notificación');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que agregó la notificación');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 200)->nullable()->comment('Usuario que modificó la notificación');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Fk_Cita');
            $table->index('Tipo_Notificacion');
            $table->index('Estado_Envio');
            $table->index('Fecha_Envio');
            $table->index('ID_H_O_D');
            
            // Clave foránea
            $table->foreign('Fk_Cita')->references('Cita_ID')->on('citas_mejoradas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificaciones_citas');
    }
};
