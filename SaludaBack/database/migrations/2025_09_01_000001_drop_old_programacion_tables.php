<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropOldProgramacionTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Eliminar tablas anteriores de programación
        Schema::dropIfExists('horarios_disponibles');
        Schema::dropIfExists('programacion_especialistas');
        Schema::dropIfExists('citas_mejoradas');
        
        // También eliminar cualquier tabla relacionada que se haya creado
        Schema::dropIfExists('programacion_especialistas_completos');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // No se puede restaurar las tablas eliminadas en el down
        // ya que no tenemos la estructura completa de las tablas anteriores
    }
}
