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
        Schema::create('auditorias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->comment('ID del usuario que realizó la acción');
            $table->string('accion', 100)->comment('Tipo de acción realizada');
            $table->text('descripcion')->nullable()->comment('Descripción detallada de la acción');
            $table->string('ip', 45)->nullable()->comment('Dirección IP del usuario');
            $table->string('user_agent', 255)->nullable()->comment('User Agent del navegador/dispositivo');
            $table->string('ruta', 255)->nullable()->comment('Ruta o URL accedida');
            $table->timestamps();

            $table->index('user_id');
            $table->index('accion');
            $table->index('ruta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
}; 