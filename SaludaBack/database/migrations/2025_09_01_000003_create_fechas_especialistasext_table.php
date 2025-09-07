<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFechasEspecialistasextTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Fechas_EspecialistasExt', function (Blueprint $table) {
            $table->id('ID_Fecha_Esp');
            $table->date('Fecha_Disponibilidad');
            $table->string('ID_H_O_D', 200);
            $table->bigInteger('FK_Especialista')->unsigned();
            $table->integer('Fk_Programacion');
            $table->string('Estado', 50);
            $table->string('Agrego', 200);
            $table->timestamp('Agregadoen')->useCurrent()->useCurrentOnUpdate();
            
            // Índices
            $table->index('ID_H_O_D');
            $table->index('Fecha_Disponibilidad');
            $table->index('FK_Especialista');
            $table->index('Fk_Programacion');
            $table->index('Estado');
            
            // Claves foráneas
            $table->foreign('FK_Especialista')->references('Especialista_ID')->on('especialistas')->onDelete('cascade');
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
        Schema::dropIfExists('Fechas_EspecialistasExt');
    }
}
