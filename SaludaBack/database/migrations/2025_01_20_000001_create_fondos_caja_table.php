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
        Schema::create('fondos_caja', function (Blueprint $table) {
            $table->id();
            
            // Relación con caja y sucursal
            $table->unsignedBigInteger('caja_id');
            $table->unsignedBigInteger('sucursal_id');
            
            // Información del fondo
            $table->string('codigo', 50)->unique();
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            
            // Valores monetarios
            $table->decimal('fondo_caja', 15, 2)->default(0);
            $table->decimal('saldo_actual', 15, 2)->default(0);
            $table->decimal('saldo_minimo', 15, 2)->default(0);
            $table->decimal('saldo_maximo', 15, 2)->nullable();
            
            // Estado y control
            $table->enum('estatus', ['activo', 'inactivo', 'suspendido'])->default('activo');
            $table->string('codigo_estatus', 10)->default('A');
            $table->boolean('sistema')->default(false);
            
            // Auditoría
            $table->string('agregado_por', 100)->nullable();
            $table->timestamp('agregado_el')->useCurrent();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamp('actualizado_el')->nullable();
            
            // Licencia (reemplaza ID_H_O_D)
            $table->string('Id_Licencia', 150)->nullable();
            
            // Configuración adicional
            $table->enum('tipo_fondo', ['efectivo', 'mixto', 'digital'])->default('efectivo');
            $table->json('configuracion_monedas')->nullable();
            $table->json('configuracion_denominaciones')->nullable();
            $table->text('observaciones')->nullable();
            
            // Control de apertura/cierre
            $table->boolean('permitir_sobrepasar_maximo')->default(false);
            $table->boolean('requerir_aprobacion_retiro')->default(false);
            $table->decimal('monto_maximo_retiro', 15, 2)->nullable();
            
            $table->timestamps();
            $table->softDeletes();

            // Claves foráneas
            $table->foreign('caja_id')->references('id')->on('cajas')->onDelete('cascade');
            $table->foreign('sucursal_id')->references('id')->on('sucursales')->onDelete('cascade');
            
            // Índices
            $table->index(['caja_id', 'estatus']);
            $table->index(['sucursal_id', 'estatus']);
            $table->index(['Id_Licencia', 'estatus']);
            $table->index(['codigo', 'estatus']);
            $table->index(['tipo_fondo', 'estatus']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fondos_caja');
    }
}; 