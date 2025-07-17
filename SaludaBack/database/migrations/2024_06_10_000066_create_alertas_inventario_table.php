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
        Schema::create('alertas_inventario', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('sucursal_id')->constrained('sucursales')->onDelete('cascade');
            $table->foreignId('almacen_id')->nullable()->constrained('almacenes')->onDelete('set null');
            
            // Información de la alerta
            $table->enum('tipo_alerta', [
                'stock_bajo', 'stock_critico', 'stock_cero', 'vencimiento_proximo',
                'vencimiento_critico', 'stock_excesivo', 'movimiento_inusual',
                'diferencia_conteo', 'reserva_vencida', 'lote_defectuoso'
            ]);
            
            $table->enum('nivel', ['bajo', 'medio', 'alto', 'critico'])->default('medio');
            $table->enum('estado', ['activa', 'procesada', 'resuelta', 'descartada'])->default('activa');
            $table->enum('canal_notificacion', ['email', 'sms', 'push', 'sistema', 'todos'])->default('sistema');
            
            // Información específica
            $table->integer('valor_actual')->nullable();
            $table->integer('valor_umbral')->nullable();
            $table->integer('diferencia')->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->integer('dias_vencimiento')->nullable();
            
            // Mensaje y descripción
            $table->string('titulo_alerta', 255);
            $table->text('descripcion_alerta');
            $table->text('accion_recomendada')->nullable();
            $table->text('observaciones')->nullable();
            
            // Fechas
            $table->timestamp('fecha_generacion');
            $table->timestamp('fecha_procesamiento')->nullable();
            $table->timestamp('fecha_resolucion')->nullable();
            $table->timestamp('fecha_ultima_notificacion')->nullable();
            
            // Información de procesamiento
            $table->foreignId('procesado_por')->nullable()->constrained('personal_pos')->onDelete('set null');
            $table->text('accion_tomada')->nullable();
            $table->text('comentarios_procesamiento')->nullable();
            
            // Configuración
            $table->boolean('notificacion_enviada')->default(false);
            $table->integer('intentos_notificacion')->default(0);
            $table->json('configuracion_alerta')->nullable();
            $table->json('datos_adicionales')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['producto_id', 'estado']);
            $table->index(['sucursal_id', 'estado']);
            $table->index(['almacen_id', 'estado']);
            $table->index(['tipo_alerta', 'estado']);
            $table->index(['nivel', 'estado']);
            $table->index(['fecha_generacion', 'estado']);
            $table->index('notificacion_enviada');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alertas_inventario');
    }
}; 