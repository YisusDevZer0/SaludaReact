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
        Schema::create('historial_clinico', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('paciente_id')->constrained('pacientes', 'Paciente_ID')->onDelete('cascade');
            // $table->foreignId('doctor_id')->nullable()->constrained('doctores')->onDelete('set null');
            // $table->foreignId('agenda_id')->nullable()->constrained('agendas')->onDelete('set null');
            $table->unsignedBigInteger('paciente_id')->nullable();
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->unsignedBigInteger('agenda_id')->nullable();
            
            // Información de la consulta
            $table->enum('tipo_consulta', ['primera_vez', 'control', 'emergencia', 'seguimiento'])->default('control');
            $table->date('fecha_consulta');
            $table->time('hora_consulta')->nullable();
            $table->text('motivo_consulta')->nullable();
            $table->text('sintomas')->nullable();
            
            // Examen físico
            $table->decimal('peso', 5, 2)->nullable(); // kg
            $table->decimal('altura', 5, 2)->nullable(); // cm
            $table->decimal('imc', 4, 2)->nullable();
            $table->integer('presion_sistolica')->nullable();
            $table->integer('presion_diastolica')->nullable();
            $table->integer('frecuencia_cardiaca')->nullable();
            $table->integer('temperatura')->nullable();
            $table->text('examen_fisico')->nullable();
            
            // Diagnóstico
            $table->text('diagnostico_principal')->nullable();
            $table->text('diagnosticos_secundarios')->nullable();
            $table->text('impresion_clinica')->nullable();
            
            // Tratamiento
            $table->text('plan_tratamiento')->nullable();
            $table->text('indicaciones')->nullable();
            $table->text('recomendaciones')->nullable();
            
            // Seguimiento
            $table->date('fecha_proximo_control')->nullable();
            $table->text('observaciones_seguimiento')->nullable();
            
            // Estado
            $table->enum('estado', ['activa', 'completada', 'cancelada'])->default('activa');
            $table->text('observaciones')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['paciente_id', 'fecha_consulta']);
            $table->index(['doctor_id', 'fecha_consulta']);
            $table->index(['tipo_consulta', 'estado']);
            $table->index('fecha_proximo_control');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_clinico');
    }
}; 