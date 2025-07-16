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
        Schema::create('marcas', function (Blueprint $table) {
            $table->id('Marca_ID'); // AUTO_INCREMENT PRIMARY KEY
            $table->string('Nom_Marca', 200)->comment('Nombre de la marca');
            $table->enum('Estado', ['Activo', 'Inactivo'])->default('Activo')->comment('Estado de la marca');
            $table->char('Cod_Estado', 1)->default('A')->comment('Código de estado (A=Activo, I=Inactivo)');
            $table->string('Agregado_Por', 250)->comment('Usuario que agregó el registro');
            $table->timestamp('Agregadoel')->useCurrent()->comment('Fecha de creación');
            $table->string('Sistema', 250)->default('POS')->comment('Sistema origen');
            $table->string('ID_H_O_D', 150)->default('Saluda')->comment('Identificador del hospital/organización');
            $table->text('Descripcion')->nullable()->comment('Descripción de la marca');
            $table->string('Pais_Origen', 100)->nullable()->comment('País de origen de la marca');
            $table->string('Sitio_Web', 500)->nullable()->comment('Sitio web de la marca');
            $table->string('Logo_URL', 500)->nullable()->comment('URL del logo de la marca');
            $table->timestamps();
            $table->softDeletes();

            // Índices para optimización
            $table->index(['Estado', 'Sistema']);
            $table->index(['Cod_Estado']);
            $table->index(['ID_H_O_D']);
            $table->index(['Agregado_Por']);
            $table->index(['Pais_Origen']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marcas');
    }
}; 