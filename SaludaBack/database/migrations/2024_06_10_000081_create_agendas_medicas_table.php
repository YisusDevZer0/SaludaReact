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
        Schema::create('agendas_medicas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agenda_id')->constrained('agendas')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('doctores')->onDelete('cascade');
            $table->foreignId('paciente_id')->nullable()->constrained('pacientes')->onDelete('set null');
            $table->foreignId('consultorio_id')->nullable()->constrained('consultorios')->onDelete('set null');
            $table->foreignId('enfermero_id')->nullable()->constrained('enfermeros')->onDelete('set null');
            
            // Información de la cita
            $table->enum('tipo_cita', ['primera_vez', 'control', 'emergencia', 'seguimiento', 'procedimiento'])->default('control');
            $table->enum('estado', ['programada', 'confirmada', 'en_proceso', 'completada', 'cancelada', 'no_show'])->default('programada');
            $table->date('fecha_cita');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->integer('duracion_minutos')->default(30);
            
            // Motivo y síntomas
            $table->text('motivo_consulta')->nullable();
            $table->text('sintomas')->nullable();
            $table->text('observaciones_paciente')->nullable();
            $table->text('observaciones_medico')->nullable();
            
            // Procedimientos
            $table->foreignId('procedimiento_id')->nullable()->constrained('procedimientos_medicos')->onDelete('set null');
            $table->text('procedimientos_adicionales')->nullable();
            $table->text('equipamiento_requerido')->nullable();
            
            // Resultados
            $table->text('diagnostico')->nullable();
            $table->text('tratamiento')->nullable();
            $table->text('indicaciones')->nullable();
            $table->date('fecha_proximo_control')->nullable();
            
            // Facturación
            $table->decimal('costo_consulta', 10, 2)->nullable();
            $table->decimal('costo_procedimientos', 10, 2)->nullable();
            $table->decimal('total_facturado', 10, 2)->nullable();
            $table->enum('metodo_pago', ['efectivo', 'tarjeta', 'obra_social', 'prepaga', 'particular'])->nullable();
            $table->boolean('facturado')->default(false);
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamp('fecha_confirmacion')->nullable();
            $table->timestamp('fecha_inicio_real')->nullable();
            $table->timestamp('fecha_fin_real')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['agenda_id', 'estado']);
            $table->index(['doctor_id', 'fecha_cita']);
            $table->index(['paciente_id', 'fecha_cita']);
            $table->index(['consultorio_id', 'fecha_cita']);
            $table->index(['tipo_cita', 'estado']);
            $table->index(['fecha_cita', 'hora_inicio']);
            $table->index('fecha_proximo_control');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agendas_medicas');
    }
}; 