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
        Schema::create('categorias_pos', function (Blueprint $table) {
            $table->id('Cat_ID');
            $table->string('Nom_Cat', 255)->comment('Nombre de la categoría');
            $table->string('Estado', 50)->default('Vigente')->comment('Estado de la categoría');
            $table->string('Cod_Estado', 10)->default('V')->comment('Código del estado');
            $table->string('Agregado_Por', 100)->nullable()->comment('Usuario que agregó la categoría');
            $table->timestamp('Agregadoel')->nullable()->comment('Fecha y hora de agregado');
            $table->string('Sistema', 50)->default('POS')->comment('Sistema al que pertenece');
            $table->string('ID_H_O_D', 100)->default('Saluda')->comment('Nombre de la organización/hospital');
            $table->timestamps();
            
            // Índices para mejorar el rendimiento
            $table->index('Estado');
            $table->index('Sistema');
            $table->index('ID_H_O_D');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categorias_pos');
    }
};
