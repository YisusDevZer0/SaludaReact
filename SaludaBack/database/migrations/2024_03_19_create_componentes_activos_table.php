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
        Schema::create('ComponentesActivos', function (Blueprint $table) {
            $table->id('ID');
            $table->string('Nom_Com');
            $table->string('Agregado_Por')->nullable();
            $table->timestamp('Agregadoel')->nullable();
            $table->string('ID_H_O_D')->default('Saluda');
            $table->string('Estado')->default('Vigente');
            $table->string('Cod_Estado')->default('V');
            $table->string('Sistema')->default('POS');
            $table->text('Descripcion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ComponentesActivos');
    }
}; 