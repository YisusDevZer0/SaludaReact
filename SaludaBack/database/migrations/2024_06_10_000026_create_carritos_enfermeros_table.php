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
        Schema::create('carritos_enfermeros', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->unique();
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            
            // Asignación
            $table->foreignId('enfermero_id')->nullable()->constrained('enfermeros')->onDelete('set null');
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            $table->foreignId('consultorio_id')->nullable()->constrained('consultorios')->onDelete('set null');
            
            // Ubicación
            $table->string('ubicacion_actual', 100)->nullable();
            $table->string('piso', 10)->nullable();
            $table->string('sector', 50)->nullable();
            $table->text('observaciones_ubicacion')->nullable();
            
            // Características del carrito
            $table->enum('tipo', ['general', 'emergencia', 'especializado', 'cirugia'])->default('general');
            $table->integer('numero_gavetas')->default(10);
            $table->boolean('refrigerado')->default(false);
            $table->boolean('oxigeno')->default(false);
            $table->boolean('monitoreo')->default(false);
            
            // Estado
            $table->enum('estado', ['disponible', 'en_uso', 'mantenimiento', 'fuera_servicio'])->default('disponible');
            $table->boolean('activo')->default(true);
            $table->text('observaciones')->nullable();
            
            // Información adicional
            $table->json('equipamiento')->nullable();
            $table->json('medicamentos_estandar')->nullable();
            $table->text('instrucciones_uso')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['codigo', 'estado']);
            $table->index(['enfermero_id', 'estado']);
            $table->index(['sucursal_id', 'estado']);
            $table->index(['consultorio_id', 'estado']);
            $table->index(['tipo', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carritos_enfermeros');
    }
}; 