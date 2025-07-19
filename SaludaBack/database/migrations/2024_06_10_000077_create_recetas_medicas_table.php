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
        Schema::create('recetas_medicas', function (Blueprint $table) {
            $table->id();
            $table->string('numero_receta', 50)->unique();
            // $table->foreignId('paciente_id')->constrained('pacientes', 'Paciente_ID')->onDelete('cascade');
            // $table->foreignId('doctor_id')->constrained('doctores')->onDelete('cascade');
            // $table->foreignId('agenda_id')->nullable()->constrained('agendas')->onDelete('set null');
            $table->unsignedBigInteger('paciente_id')->nullable();
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->unsignedBigInteger('agenda_id')->nullable();
            
            // Información de la receta
            $table->enum('tipo_receta', ['medicamentos', 'estudios', 'procedimientos', 'mixta'])->default('medicamentos');
            $table->enum('estado', ['activa', 'dispensada', 'vencida', 'anulada'])->default('activa');
            $table->date('fecha_emision');
            $table->date('fecha_vencimiento');
            $table->text('diagnostico')->nullable();
            $table->text('indicaciones_generales')->nullable();
            
            // Información de dispensación
            $table->timestamp('fecha_dispensacion')->nullable();
            // $table->foreignId('dispensado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->unsignedBigInteger('dispensado_por')->nullable();
            $table->text('observaciones_dispensacion')->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['numero_receta', 'estado']);
            $table->index(['paciente_id', 'fecha_emision']);
            $table->index(['doctor_id', 'fecha_emision']);
            $table->index(['fecha_vencimiento', 'estado']);
            $table->index('tipo_receta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recetas_medicas');
    }
}; 