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
        Schema::create('procedimientos_medicos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->unique();
            $table->string('nombre', 255);
            $table->text('descripcion')->nullable();
            $table->foreignId('especialidad_id')->nullable()->constrained('especialidades_medicas')->onDelete('set null');
            
            // Clasificación
            $table->enum('tipo', ['consulta', 'procedimiento', 'cirugia', 'estudio', 'terapia'])->default('procedimiento');
            $table->enum('complejidad', ['baja', 'media', 'alta', 'critica'])->default('media');
            $table->enum('ambito', ['ambulatorio', 'hospitalario', 'emergencia', 'domiciliario'])->default('ambulatorio');
            
            // Duración y recursos
            $table->integer('duracion_estimada_minutos')->nullable();
            $table->integer('personal_requerido')->default(1);
            $table->text('equipamiento_requerido')->nullable();
            $table->text('medicamentos_requeridos')->nullable();
            
            // Costos
            $table->decimal('costo_estimado', 10, 2)->nullable();
            $table->decimal('precio_publico', 10, 2)->nullable();
            $table->decimal('precio_obra_social', 10, 2)->nullable();
            $table->decimal('precio_prepaga', 10, 2)->nullable();
            
            // Requisitos
            $table->boolean('requiere_ayuno')->default(false);
            $table->boolean('requiere_consentimiento')->default(false);
            $table->boolean('requiere_acompañante')->default(false);
            $table->text('preparacion_paciente')->nullable();
            $table->text('contraindicaciones')->nullable();
            
            // Estado
            $table->enum('estado', ['activo', 'inactivo', 'descontinuado'])->default('activo');
            $table->boolean('disponible')->default(true);
            $table->text('observaciones')->nullable();
            
            // Información adicional
            $table->json('protocolo')->nullable();
            $table->json('riesgos')->nullable();
            $table->text('instrucciones_post_procedimiento')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['codigo', 'estado']);
            $table->index(['especialidad_id', 'estado']);
            $table->index(['tipo', 'estado']);
            $table->index(['complejidad', 'estado']);
            $table->index(['ambito', 'estado']);
            $table->index('disponible');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procedimientos_medicos');
    }
}; 