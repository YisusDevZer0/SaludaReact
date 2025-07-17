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
        Schema::create('Servicios_POS', function (Blueprint $table) {
            $table->id('Servicio_ID');
            $table->string('Nom_Serv', 255);
            $table->string('Estado', 50)->default('Activo');
            $table->string('Cod_Estado', 10)->default('A');
            $table->string('Agregado_Por', 250)->nullable();
            $table->timestamp('Agregadoel')->useCurrent();
            $table->boolean('Sistema')->default(false);
            $table->integer('ID_H_O_D')->default(1);
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para optimizar consultas
            $table->index(['Estado', 'Cod_Estado']);
            $table->index('Sistema');
            $table->index('ID_H_O_D');
            $table->index('Agregadoel');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Servicios_POS');
    }
}; 