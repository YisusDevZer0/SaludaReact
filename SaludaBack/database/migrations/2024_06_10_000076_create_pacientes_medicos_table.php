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
        Schema::create('pacientes_medicos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            
            // Información médica básica
            $table->string('grupo_sanguineo', 10)->nullable();
            $table->string('factor_rh', 5)->nullable();
            $table->decimal('peso', 5, 2)->nullable(); // kg
            $table->decimal('altura', 5, 2)->nullable(); // cm
            $table->decimal('imc', 4, 2)->nullable();
            $table->enum('estado_civil', ['soltero', 'casado', 'divorciado', 'viudo', 'union_libre'])->nullable();
            
            // Información de contacto de emergencia
            $table->string('contacto_emergencia_nombre', 100)->nullable();
            $table->string('contacto_emergencia_telefono', 20)->nullable();
            $table->string('contacto_emergencia_parentesco', 50)->nullable();
            $table->string('contacto_emergencia_direccion', 255)->nullable();
            
            // Información de obra social
            $table->foreignId('obra_social_id')->nullable()->constrained('obras_sociales')->onDelete('set null');
            $table->foreignId('plan_obra_social_id')->nullable()->constrained('planes_obra_social')->onDelete('set null');
            $table->string('numero_afiliado', 50)->nullable();
            $table->string('numero_beneficiario', 50)->nullable();
            $table->date('fecha_vencimiento_cobertura')->nullable();
            
            // Información médica específica
            $table->text('alergias')->nullable();
            $table->text('medicamentos_actuales')->nullable();
            $table->text('condiciones_medicas')->nullable();
            $table->text('antecedentes_quirurgicos')->nullable();
            $table->text('antecedentes_familiares')->nullable();
            
            // Información de estilo de vida
            $table->enum('tabaquismo', ['nunca', 'ex_fumador', 'fumador_activo'])->nullable();
            $table->enum('alcoholismo', ['nunca', 'ocasional', 'moderado', 'excesivo'])->nullable();
            $table->enum('actividad_fisica', ['sedentario', 'leve', 'moderada', 'intensa'])->nullable();
            $table->text('deportes_practicados')->nullable();
            
            // Información de trabajo
            $table->string('ocupacion', 100)->nullable();
            $table->string('empresa', 100)->nullable();
            $table->string('telefono_trabajo', 20)->nullable();
            $table->text('riesgos_laborales')->nullable();
            
            // Información de seguimiento
            $table->foreignId('doctor_principal_id')->nullable()->constrained('doctores')->onDelete('set null');
            $table->date('fecha_ultima_consulta')->nullable();
            $table->date('fecha_proxima_consulta')->nullable();
            $table->text('observaciones_seguimiento')->nullable();
            
            // Estado del paciente
            $table->enum('estado', ['activo', 'inactivo', 'fallecido', 'transferido'])->default('activo');
            $table->enum('prioridad', ['baja', 'media', 'alta', 'urgente'])->default('media');
            $table->boolean('requiere_atencion_especial')->default(false);
            $table->text('necesidades_especiales')->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            $table->string('foto_perfil')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['cliente_id', 'estado']);
            $table->index(['obra_social_id', 'estado']);
            $table->index(['doctor_principal_id', 'estado']);
            $table->index(['grupo_sanguineo', 'factor_rh']);
            $table->index(['fecha_ultima_consulta', 'estado']);
            $table->index(['fecha_proxima_consulta', 'estado']);
            $table->index('prioridad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes_medicos');
    }
}; 