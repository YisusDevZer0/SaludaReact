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
        Schema::create('obras_sociales', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 255);
            $table->string('codigo', 20)->unique();
            $table->string('cuit', 20)->nullable()->unique();
            $table->text('descripcion')->nullable();
            
            // Información de contacto
            $table->string('direccion', 255)->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('sitio_web', 255)->nullable();
            
            // Información administrativa
            $table->enum('tipo', ['obra_social', 'prepaga', 'particular'])->default('obra_social');
            $table->enum('estado', ['activa', 'inactiva', 'suspendida'])->default('activa');
            $table->decimal('cobertura_porcentaje', 5, 2)->default(100.00);
            $table->text('planes_disponibles')->nullable();
            
            // Información de facturación
            $table->string('numero_autorizacion', 50)->nullable();
            $table->string('codigo_autorizacion', 50)->nullable();
            $table->text('observaciones_facturacion')->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('configuracion')->nullable();
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['codigo', 'estado']);
            $table->index(['tipo', 'estado']);
            $table->index('cuit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obras_sociales');
    }
}; 