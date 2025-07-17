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
        Schema::create('ajustes_inventario', function (Blueprint $table) {
            $table->id();
            $table->string('numero_ajuste', 50)->unique();
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            $table->foreignId('almacen_id')->constrained('almacenes')->onDelete('cascade');
            $table->foreignId('personal_id')->constrained('personal_pos')->onDelete('cascade');
            
            // Información del ajuste
            $table->enum('tipo_ajuste', [
                'inventario_fisico', 'merma', 'vencimiento', 'defectuoso', 
                'robo', 'perdida', 'donacion', 'devolucion_proveedor',
                'correccion_error', 'reclasificacion', 'otros'
            ])->default('inventario_fisico');
            
            $table->enum('estado', ['pendiente', 'aprobado', 'rechazado', 'ejecutado', 'cancelado'])->default('pendiente');
            $table->enum('impacto', ['positivo', 'negativo', 'neutro'])->default('neutro');
            
            // Fechas
            $table->date('fecha_ajuste');
            $table->date('fecha_aprobacion')->nullable();
            $table->date('fecha_ejecucion')->nullable();
            
            // Información de aprobación
            $table->foreignId('aprobado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->text('motivo_aprobacion')->nullable();
            $table->text('motivo_rechazo')->nullable();
            
            // Información adicional
            $table->text('motivo_ajuste')->nullable();
            $table->text('observaciones')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['numero_ajuste', 'estado']);
            $table->index(['sucursal_id', 'estado']);
            $table->index(['almacen_id', 'estado']);
            $table->index(['personal_id', 'estado']);
            $table->index(['tipo_ajuste', 'estado']);
            $table->index(['impacto', 'estado']);
            $table->index(['fecha_ajuste', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ajustes_inventario');
    }
}; 