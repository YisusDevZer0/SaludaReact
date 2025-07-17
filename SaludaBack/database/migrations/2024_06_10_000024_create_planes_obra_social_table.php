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
        Schema::create('planes_obra_social', function (Blueprint $table) {
            $table->id();
            $table->foreignId('obra_social_id')->constrained('obras_sociales')->onDelete('cascade');
            $table->string('nombre', 255);
            $table->string('codigo', 50)->unique();
            $table->text('descripcion')->nullable();
            
            // Cobertura
            $table->decimal('cobertura_consulta', 5, 2)->default(100.00);
            $table->decimal('cobertura_estudios', 5, 2)->default(100.00);
            $table->decimal('cobertura_medicamentos', 5, 2)->default(100.00);
            $table->decimal('cobertura_procedimientos', 5, 2)->default(100.00);
            
            // Costos
            $table->decimal('costo_mensual', 10, 2)->nullable();
            $table->decimal('costo_anual', 10, 2)->nullable();
            $table->decimal('costo_adicional_familiar', 10, 2)->nullable();
            
            // Límites
            $table->integer('consultas_por_mes')->nullable();
            $table->integer('estudios_por_ano')->nullable();
            $table->decimal('limite_medicamentos_mensual', 10, 2)->nullable();
            
            // Estado
            $table->enum('estado', ['activo', 'inactivo', 'discontinuado'])->default('activo');
            $table->boolean('disponible_nuevos_afiliados')->default(true);
            $table->text('observaciones')->nullable();
            
            // Información adicional
            $table->json('beneficios_adicionales')->nullable();
            $table->json('restricciones')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['obra_social_id', 'estado']);
            $table->index(['codigo', 'estado']);
            $table->index('disponible_nuevos_afiliados');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('planes_obra_social');
    }
}; 