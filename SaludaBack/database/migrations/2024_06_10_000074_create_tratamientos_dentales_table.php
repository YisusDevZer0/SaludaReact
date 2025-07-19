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
        Schema::create('tratamientos_dentales', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('credito_dental_id')->constrained('creditos_dentales')->onDelete('cascade');
            // $table->foreignId('doctor_id')->nullable()->constrained('doctores', 'Doctor_ID')->onDelete('set null');
            // $table->foreignId('paciente_id')->constrained('pacientes')->onDelete('cascade');
            $table->unsignedBigInteger('credito_dental_id')->nullable();
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->unsignedBigInteger('paciente_id')->nullable();
            
            // Información del tratamiento
            $table->string('nombre_tratamiento', 255);
            $table->text('descripcion')->nullable();
            $table->enum('tipo_tratamiento', [
                'limpieza', 'blanqueamiento', 'empaste', 'endodoncia', 'extraccion',
                'ortodoncia', 'protesis', 'implante', 'cirugia_oral', 'periodoncia',
                'estetica_dental', 'reparacion', 'preventivo', 'restaurativo'
            ]);
            
            // Dientes específicos
            $table->string('dientes_afectados', 100)->nullable();
            $table->string('cuadrantes', 50)->nullable();
            $table->text('ubicacion_especifica')->nullable();
            
            // Estado del tratamiento
            $table->enum('estado', ['planificado', 'en_proceso', 'completado', 'cancelado', 'pausado'])->default('planificado');
            $table->enum('prioridad', ['baja', 'media', 'alta', 'urgente'])->default('media');
            
            // Fechas
            $table->date('fecha_inicio');
            $table->date('fecha_estimada_fin')->nullable();
            $table->date('fecha_real_fin')->nullable();
            $table->date('fecha_proxima_sesion')->nullable();
            
            // Sesiones
            $table->integer('sesiones_totales')->default(1);
            $table->integer('sesiones_completadas')->default(0);
            $table->integer('duracion_estimada_minutos')->nullable();
            
            // Costos
            $table->decimal('costo_total', 10, 2);
            $table->decimal('costo_materiales', 10, 2)->nullable();
            $table->decimal('costo_laboratorio', 10, 2)->nullable();
            $table->decimal('costo_doctor', 10, 2)->nullable();
            
            // Información técnica
            $table->text('diagnostico')->nullable();
            $table->text('plan_tratamiento')->nullable();
            $table->text('procedimientos_realizados')->nullable();
            $table->text('materiales_utilizados')->nullable();
            $table->text('complicaciones')->nullable();
            
            // Resultados
            $table->text('resultados_esperados')->nullable();
            $table->text('resultados_obtenidos')->nullable();
            $table->text('observaciones_finales')->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['credito_dental_id', 'estado']);
            $table->index(['doctor_id', 'estado']);
            $table->index(['paciente_id', 'estado']);
            $table->index(['tipo_tratamiento', 'estado']);
            $table->index(['fecha_inicio', 'estado']);
            $table->index(['fecha_proxima_sesion', 'estado']);
            $table->index('prioridad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tratamientos_dentales');
    }
}; 