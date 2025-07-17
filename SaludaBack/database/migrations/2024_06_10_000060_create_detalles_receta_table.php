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
        Schema::create('detalles_receta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receta_id')->constrained('recetas_medicas')->onDelete('cascade');
            $table->foreignId('producto_id')->nullable()->constrained('productos')->onDelete('set null');
            
            // Información del medicamento/estudio
            $table->string('nombre_medicamento', 255);
            $table->text('descripcion')->nullable();
            $table->string('presentacion', 100)->nullable();
            $table->string('concentracion', 100)->nullable();
            $table->string('via_administracion', 50)->nullable();
            
            // Posología
            $table->string('dosis', 100);
            $table->string('frecuencia', 100);
            $table->integer('duracion_dias')->nullable();
            $table->text('indicaciones_especificas')->nullable();
            $table->text('contraindicaciones')->nullable();
            
            // Cantidades
            $table->integer('cantidad_prescrita');
            $table->integer('cantidad_dispensada')->default(0);
            $table->string('unidad_medida', 20)->default('unidad');
            
            // Estado
            $table->enum('estado', ['prescrito', 'dispensado', 'parcialmente_dispensado', 'anulado'])->default('prescrito');
            $table->timestamp('fecha_dispensacion')->nullable();
            $table->foreignId('dispensado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['receta_id', 'estado']);
            $table->index(['producto_id', 'estado']);
            $table->index(['cantidad_dispensada', 'cantidad_prescrita']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_receta');
    }
}; 