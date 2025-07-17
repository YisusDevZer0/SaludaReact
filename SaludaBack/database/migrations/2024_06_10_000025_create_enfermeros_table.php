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
        Schema::create('enfermeros', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->unique();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('email', 100)->unique();
            $table->string('telefono', 20)->nullable();
            $table->string('celular', 20)->nullable();
            $table->string('dni', 20)->unique()->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->enum('genero', ['masculino', 'femenino', 'otro'])->nullable();
            
            // Información profesional
            $table->string('matricula', 50)->unique();
            $table->string('especialidad', 100)->nullable();
            $table->enum('nivel', ['auxiliar', 'tecnico', 'licenciado', 'especialista'])->default('tecnico');
            $table->date('fecha_graduacion')->nullable();
            $table->string('institucion_graduacion', 255)->nullable();
            
            // Información laboral
            $table->foreignId('sucursal_id')->nullable()->constrained('sucursales')->onDelete('set null');
            $table->foreignId('consultorio_id')->nullable()->constrained('consultorios')->onDelete('set null');
            $table->enum('estado_laboral', ['activo', 'inactivo', 'licencia', 'jubilado'])->default('activo');
            $table->date('fecha_ingreso')->nullable();
            $table->date('fecha_salida')->nullable();
            
            // Permisos específicos
            $table->boolean('puede_administrar_medicamentos')->default(true);
            $table->boolean('puede_realizar_procedimientos')->default(true);
            $table->boolean('puede_tomar_signos_vitales')->default(true);
            $table->boolean('puede_asistir_cirugias')->default(false);
            $table->boolean('puede_manejar_emergencias')->default(false);
            
            // Información de contacto
            $table->text('direccion')->nullable();
            $table->string('ciudad', 50)->nullable();
            $table->string('provincia', 50)->nullable();
            $table->string('codigo_postal', 10)->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('especializaciones')->nullable();
            $table->json('certificaciones')->nullable();
            $table->string('foto_perfil')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['codigo', 'estado_laboral']);
            $table->index(['matricula', 'estado_laboral']);
            $table->index(['sucursal_id', 'estado_laboral']);
            $table->index(['consultorio_id', 'estado_laboral']);
            $table->index(['nivel', 'estado_laboral']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enfermeros');
    }
}; 