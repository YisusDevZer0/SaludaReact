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
        Schema::create('servicios', function (Blueprint $table) {
            $table->id('Servicio_ID'); // AUTO_INCREMENT PRIMARY KEY
            $table->string('Nom_Serv', 200)->comment('Nombre del servicio');
            $table->enum('Estado', ['Activo', 'Inactivo'])->default('Activo')->comment('Estado del servicio');
            $table->char('Cod_Estado', 1)->default('A')->comment('Código de estado (A=Activo, I=Inactivo)');
            $table->string('Agregado_Por', 250)->comment('Usuario que agregó el registro');
            $table->timestamp('Agregadoel')->useCurrent()->comment('Fecha de creación');
            $table->string('Sistema', 250)->default('POS')->comment('Sistema origen');
            $table->string('ID_H_O_D', 150)->default('Saluda')->comment('Identificador del hospital/organización');
            $table->text('Descripcion')->nullable()->comment('Descripción detallada del servicio');
            $table->decimal('Precio_Base', 10, 2)->nullable()->comment('Precio base del servicio');
            $table->boolean('Requiere_Cita')->default(false)->comment('Si el servicio requiere cita previa');
            $table->timestamps();
            $table->softDeletes();

            // Índices para optimización
            $table->index(['Estado', 'Sistema']);
            $table->index(['Cod_Estado']);
            $table->index(['ID_H_O_D']);
            $table->index(['Agregado_Por']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
}; 