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
        Schema::create('estudios_medicos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes')->onDelete('cascade');
            $table->foreignId('doctor_id')->nullable()->constrained('doctores')->onDelete('set null');
            $table->foreignId('receta_id')->nullable()->constrained('recetas_medicas')->onDelete('set null');
            
            // Información del estudio
            $table->string('nombre_estudio', 255);
            $table->text('descripcion')->nullable();
            $table->enum('tipo_estudio', ['laboratorio', 'imagen', 'cardiologia', 'neurologia', 'otros'])->default('laboratorio');
            $table->enum('urgencia', ['rutina', 'urgente', 'emergencia'])->default('rutina');
            
            // Fechas
            $table->date('fecha_solicitud');
            $table->date('fecha_realizacion')->nullable();
            $table->date('fecha_resultado')->nullable();
            $table->date('fecha_entrega')->nullable();
            
            // Estado
            $table->enum('estado', ['solicitado', 'en_proceso', 'completado', 'cancelado'])->default('solicitado');
            $table->text('observaciones')->nullable();
            $table->text('resultado')->nullable();
            $table->string('archivo_resultado')->nullable();
            
            // Información adicional
            $table->text('indicaciones')->nullable();
            $table->text('preparacion')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['paciente_id', 'fecha_solicitud']);
            $table->index(['doctor_id', 'estado']);
            $table->index(['tipo_estudio', 'estado']);
            $table->index(['urgencia', 'estado']);
            $table->index('fecha_realizacion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudios_medicos');
    }
}; 