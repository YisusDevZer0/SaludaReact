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
        Schema::create('gastos', function (Blueprint $table) {
            $table->id();
            $table->string('concepto');
            $table->text('descripcion')->nullable();
            $table->decimal('monto', 15, 2);
            $table->enum('categoria', [
                'servicios_publicos', 'alquiler', 'salarios', 'insumos', 
                'mantenimiento', 'marketing', 'seguros', 'impuestos', 
                'equipamiento', 'software', 'otros'
            ]);
            $table->enum('metodo_pago', ['efectivo', 'tarjeta', 'transferencia', 'cheque'])->default('efectivo');
            $table->unsignedBigInteger('sucursal_id');
            $table->unsignedBigInteger('caja_id')->nullable();
            $table->unsignedBigInteger('usuario_solicitante_id');
            $table->unsignedBigInteger('usuario_aprobador_id')->nullable();
            $table->unsignedBigInteger('proveedor_id')->nullable();
            $table->date('fecha_gasto');
            $table->date('fecha_vencimiento')->nullable();
            $table->enum('estado', ['pendiente', 'aprobado', 'rechazado', 'pagado', 'anulado'])->default('pendiente');
            $table->text('observaciones')->nullable();
            $table->string('numero_factura')->nullable();
            $table->string('archivo_adjunto')->nullable();
            $table->boolean('recurrente')->default(false);
            $table->enum('frecuencia', ['mensual', 'trimestral', 'semestral', 'anual'])->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('sucursal_id')->references('id')->on('sucursales')->onDelete('cascade');
            $table->foreign('caja_id')->references('id')->on('cajas')->onDelete('set null');
            $table->foreign('usuario_solicitante_id')->references('id')->on('personal_pos')->onDelete('restrict');
            $table->foreign('usuario_aprobador_id')->references('id')->on('personal_pos')->onDelete('set null');
            $table->foreign('proveedor_id')->references('id')->on('proveedores')->onDelete('set null');
            
            $table->index(['sucursal_id', 'estado']);
            $table->index(['fecha_gasto', 'estado']);
            $table->index(['categoria', 'estado']);
            $table->index(['usuario_solicitante_id', 'fecha_gasto']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastos');
    }
}; 