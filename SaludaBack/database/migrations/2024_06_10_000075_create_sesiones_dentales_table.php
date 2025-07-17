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
        Schema::create('sesiones_dentales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tratamiento_dental_id')->constrained('tratamientos_dentales')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('doctores')->onDelete('cascade');
            $table->foreignId('paciente_id')->constrained('pacientes')->onDelete('cascade');
            $table->foreignId('consultorio_id')->nullable()->constrained('consultorios')->onDelete('set null');
            
            // Información de la sesión
            $table->integer('numero_sesion');
            $table->enum('estado', ['programada', 'en_proceso', 'completada', 'cancelada', 'reprogramada'])->default('programada');
            $table->enum('tipo_sesion', ['evaluacion', 'tratamiento', 'control', 'limpieza', 'emergencia'])->default('tratamiento');
            
            // Fechas y horarios
            $table->date('fecha_sesion');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->integer('duracion_minutos')->nullable();
            $table->timestamp('fecha_inicio_real')->nullable();
            $table->timestamp('fecha_fin_real')->nullable();
            
            // Procedimientos realizados
            $table->text('procedimientos_realizados')->nullable();
            $table->text('materiales_utilizados')->nullable();
            $table->text('medicamentos_aplicados')->nullable();
            $table->text('anestesia_utilizada')->nullable();
            
            // Información clínica
            $table->text('diagnostico_sesion')->nullable();
            $table->text('observaciones_clinicas')->nullable();
            $table->text('complicaciones')->nullable();
            $table->text('recomendaciones')->nullable();
            
            // Dientes trabajados
            $table->string('dientes_trabajados', 100)->nullable();
            $table->text('detalles_dentales')->nullable();
            
            // Costos
            $table->decimal('costo_sesion', 10, 2)->nullable();
            $table->decimal('costo_materiales', 10, 2)->nullable();
            $table->decimal('costo_medicamentos', 10, 2)->nullable();
            $table->decimal('total_sesion', 10, 2)->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->unique(['tratamiento_dental_id', 'numero_sesion']);
            $table->index(['tratamiento_dental_id', 'estado']);
            $table->index(['doctor_id', 'fecha_sesion']);
            $table->index(['paciente_id', 'fecha_sesion']);
            $table->index(['consultorio_id', 'fecha_sesion']);
            $table->index(['tipo_sesion', 'estado']);
            $table->index(['fecha_sesion', 'hora_inicio']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sesiones_dentales');
    }
}; 