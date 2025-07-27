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
        Schema::create('servicio_marca', function (Blueprint $table) {
            $table->id();
            $table->foreignId('servicio_id')->constrained('Servicios_POS', 'Servicio_ID')->onDelete('cascade');
            $table->foreignId('marca_id')->constrained('marcas', 'Marca_ID')->onDelete('cascade');
            $table->decimal('precio_especial', 10, 2)->nullable()->comment('Precio especial para esta combinación servicio-marca');
            $table->text('notas')->nullable()->comment('Notas adicionales sobre la relación');
            $table->string('agregado_por', 250)->comment('Usuario que creó la relación');
            $table->timestamps();

            // Índice único para evitar duplicados
            $table->unique(['servicio_id', 'marca_id']);
            
            // Índices para optimización
            $table->index(['servicio_id']);
            $table->index(['marca_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servicio_marca');
    }
}; 