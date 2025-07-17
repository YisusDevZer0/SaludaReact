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
        Schema::create('consultorios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('codigo', 20)->unique();
            $table->text('descripcion')->nullable();
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            
            // Ubicación
            $table->string('piso', 10)->nullable();
            $table->string('numero_sala', 20)->nullable();
            $table->text('ubicacion_detallada')->nullable();
            
            // Equipamiento
            $table->text('equipamiento')->nullable();
            $table->text('caracteristicas_especiales')->nullable();
            $table->boolean('accesible_discapacitados')->default(false);
            $table->boolean('aire_acondicionado')->default(false);
            $table->boolean('ventilacion_natural')->default(true);
            
            // Horarios
            $table->time('hora_apertura')->nullable();
            $table->time('hora_cierre')->nullable();
            $table->json('horarios_semana')->nullable();
            
            // Estado
            $table->enum('estado', ['activo', 'inactivo', 'mantenimiento'])->default('activo');
            $table->boolean('disponible')->default(true);
            $table->text('observaciones')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['codigo', 'estado']);
            $table->index(['sucursal_id', 'disponible']);
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultorios');
    }
}; 