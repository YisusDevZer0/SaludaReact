<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHorariosCitasExtTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Horarios_Citas_Ext', function (Blueprint $table) {
            $table->id('ID_Horario');
            $table->time('Horario_Disponibilidad');
            $table->string('ID_H_O_D', 200);
            $table->bigInteger('FK_Especialista')->unsigned();
            $table->integer('FK_Fecha');
            $table->integer('Fk_Programacion');
            $table->string('Estado', 50);
            $table->string('AgregadoPor', 150);
            $table->timestamp('AgregadoEl')->useCurrent();
            
            // Índices
            $table->index('ID_H_O_D');
            $table->index('Horario_Disponibilidad');
            $table->index('FK_Especialista');
            $table->index('FK_Fecha');
            $table->index('Fk_Programacion');
            $table->index('Estado');
            
            // Claves foráneas
            $table->foreign('FK_Especialista')->references('Especialista_ID')->on('especialistas')->onDelete('cascade');
            $table->foreign('FK_Fecha')->references('ID_Fecha_Esp')->on('Fechas_EspecialistasExt')->onDelete('cascade');
            $table->foreign('Fk_Programacion')->references('ID_Programacion')->on('Programacion_MedicosExt')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('Horarios_Citas_Ext');
    }
}
