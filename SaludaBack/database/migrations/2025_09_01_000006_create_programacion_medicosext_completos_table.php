<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProgramacionMedicosextCompletosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Programacion_MedicosExt_Completos', function (Blueprint $table) {
            $table->id('ID_Programacion_Completo');
            $table->integer('ID_Programacion');
            $table->integer('FK_Medico');
            $table->integer('Fk_Sucursal');
            $table->string('Tipo_Programacion', 100);
            $table->date('Fecha_Inicio');
            $table->date('Fecha_Fin');
            $table->time('Hora_inicio');
            $table->time('Hora_Fin');
            $table->integer('Intervalo');
            $table->string('Estatus', 200);
            $table->string('ProgramadoPor', 300);
            $table->timestamp('ProgramadoEn');
            $table->string('Sistema', 300);
            $table->string('ID_H_O_D', 300);
            $table->timestamp('Fecha_Eliminacion')->useCurrent();
            
            // Índices
            $table->index('ID_Programacion');
            $table->index('FK_Medico');
            $table->index('Fecha_Eliminacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('Programacion_MedicosExt_Completos');
    }
}
