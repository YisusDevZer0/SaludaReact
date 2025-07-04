<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('Tipos', function (Blueprint $table) {
            $table->bigIncrements('Tip_Prod_ID');
            $table->string('Nom_Tipo_Prod');
            $table->string('Estado')->default('Activo');
            $table->string('Cod_Estado')->default('A');
            $table->string('Agregado_Por')->nullable();
            $table->timestamp('Agregadoel')->nullable();
            $table->string('Sistema', 20)->default('POS');
            $table->string('ID_H_O_D', 255)->comment('Código de la organización/hospital');
            $table->foreign('ID_H_O_D')->references('H_O_D')->on('Hospital_Organizacion_Dueño');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Tipos');
    }
}; 