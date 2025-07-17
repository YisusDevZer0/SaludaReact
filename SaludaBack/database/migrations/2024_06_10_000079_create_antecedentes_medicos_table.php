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
        Schema::create('antecedentes_medicos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes')->onDelete('cascade');
            
            // Información personal
            $table->text('antecedentes_personales')->nullable();
            $table->text('antecedentes_familiares')->nullable();
            $table->text('antecedentes_quirurgicos')->nullable();
            $table->text('antecedentes_alergicos')->nullable();
            $table->text('antecedentes_medicamentosos')->nullable();
            
            // Hábitos
            $table->enum('tabaquismo', ['nunca', 'ex_fumador', 'fumador_activo'])->nullable();
            $table->integer('cigarrillos_por_dia')->nullable();
            $table->integer('anos_fumando')->nullable();
            $table->enum('alcoholismo', ['nunca', 'ocasional', 'moderado', 'excesivo'])->nullable();
            $table->enum('drogas', ['nunca', 'ocasional', 'habitual'])->nullable();
            $table->text('drogas_especificas')->nullable();
            
            // Actividad física
            $table->enum('actividad_fisica', ['sedentario', 'leve', 'moderada', 'intensa'])->nullable();
            $table->text('deportes_practicados')->nullable();
            $table->integer('horas_ejercicio_semana')->nullable();
            
            // Alimentación
            $table->text('habitos_alimentarios')->nullable();
            $table->text('alergias_alimentarias')->nullable();
            $table->text('intolerancias')->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index('paciente_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('antecedentes_medicos');
    }
}; 