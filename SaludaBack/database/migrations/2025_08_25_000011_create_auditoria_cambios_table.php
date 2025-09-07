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
        Schema::create('auditoria_cambios', function (Blueprint $table) {
            $table->id('Auditoria_ID');
            $table->string('Tabla', 100)->comment('Nombre de la tabla afectada');
            $table->unsignedBigInteger('Registro_ID')->comment('ID del registro afectado');
            $table->enum('Tipo_Operacion', ['INSERT', 'UPDATE', 'DELETE'])->comment('Tipo de operación realizada');
            $table->json('Valores_Anteriores')->nullable()->comment('Valores anteriores del registro (para UPDATE/DELETE)');
            $table->json('Valores_Nuevos')->nullable()->comment('Valores nuevos del registro (para INSERT/UPDATE)');
            $table->json('Campos_Modificados')->nullable()->comment('Campos que fueron modificados (para UPDATE)');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            $table->string('Usuario', 200)->nullable()->comment('Usuario que realizó la operación');
            $table->string('IP_Address', 45)->nullable()->comment('Dirección IP del usuario');
            $table->text('User_Agent')->nullable()->comment('User Agent del navegador');
            $table->timestamp('Fecha_Operacion')->useCurrent()->comment('Fecha y hora de la operación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Tabla');
            $table->index('Registro_ID');
            $table->index('Tipo_Operacion');
            $table->index('Fecha_Operacion');
            $table->index('ID_H_O_D');
            $table->index('Usuario');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditoria_cambios');
    }
};
