<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProgramacionMedicosextTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Programacion_MedicosExt', function (Blueprint $table) {
            $table->id('ID_Programacion');
            $table->bigInteger('FK_Medico')->unsigned();
            $table->integer('Fk_Sucursal');
            $table->string('Tipo_Programacion', 100);
            $table->date('Fecha_Inicio');
            $table->date('Fecha_Fin');
            $table->time('Hora_inicio');
            $table->time('Hora_Fin');
            $table->integer('Intervalo');
            $table->string('Estatus', 200);
            $table->string('ProgramadoPor', 300);
            $table->timestamp('ProgramadoEn')->useCurrent()->useCurrentOnUpdate();
            $table->string('Sistema', 300);
            $table->string('ID_H_O_D', 300);
            
            // Índices
            $table->index('FK_Medico');
            $table->index('Fk_Sucursal');
            $table->index('Estatus');
            $table->index('Fecha_Inicio');
            $table->index('Fecha_Fin');
            
            // Clave foránea
            $table->foreign('FK_Medico')->references('Especialista_ID')->on('especialistas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('Programacion_MedicosExt');
    }
}
