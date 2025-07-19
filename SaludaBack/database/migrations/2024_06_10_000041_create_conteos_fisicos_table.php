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
        Schema::create('conteos_fisicos', function (Blueprint $table) {
            $table->id();
            $table->string('numero_conteo', 50)->unique();
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            $table->foreignId('almacen_id')->constrained('almacenes', 'Almacen_ID')->onDelete('cascade');
            $table->foreignId('personal_id')->constrained('personal_pos')->onDelete('cascade');
            
            // Información del conteo
            $table->enum('tipo_conteo', ['completo', 'parcial', 'ciclico', 'por_categoria', 'por_ubicacion'])->default('completo');
            $table->enum('estado', ['planificado', 'en_proceso', 'completado', 'cancelado', 'revisado'])->default('planificado');
            $table->enum('metodo', ['manual', 'scanner', 'rfid', 'mixto'])->default('manual');
            
            // Fechas
            $table->date('fecha_planificada');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->time('hora_inicio')->nullable();
            $table->time('hora_fin')->nullable();
            
            // Alcance del conteo
            $table->foreignId('categoria_id')->nullable()->constrained('categorias_pos')->onDelete('set null');
            $table->string('ubicacion_especifica', 100)->nullable();
            $table->text('productos_especificos')->nullable(); // JSON con códigos de productos
            $table->integer('total_productos_contar')->nullable();
            $table->integer('productos_contados')->default(0);
            
            // Resultados
            $table->integer('productos_con_diferencia')->default(0);
            $table->integer('productos_sin_stock')->default(0);
            $table->integer('productos_sobrantes')->default(0);
            $table->decimal('valor_total_conteado', 12, 2)->nullable();
            $table->decimal('valor_diferencias', 12, 2)->nullable();
            
            // Información de revisión
            $table->foreignId('revisado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->text('observaciones_revision')->nullable();
            $table->boolean('conforme_conteo')->default(true);
            $table->text('motivo_no_conforme')->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('configuracion_conteo')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['numero_conteo', 'estado']);
            $table->index(['sucursal_id', 'estado']);
            $table->index(['almacen_id', 'estado']);
            $table->index(['personal_id', 'estado']);
            $table->index(['tipo_conteo', 'estado']);
            $table->index(['fecha_planificada', 'estado']);
            $table->index(['fecha_inicio', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conteos_fisicos');
    }
}; 