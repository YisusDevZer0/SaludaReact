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
        Schema::create('sucursales', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('codigo', 20)->unique();
            $table->text('direccion')->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('responsable', 100)->nullable();
            $table->string('telefono_responsable', 20)->nullable();
            $table->text('descripcion')->nullable();
            $table->enum('estado', ['activo', 'inactivo', 'mantenimiento'])->default('activo');
            $table->string('zona', 50)->nullable();
            $table->string('ciudad', 50)->nullable();
            $table->string('provincia', 50)->nullable();
            $table->string('codigo_postal', 10)->nullable();
            $table->decimal('latitud', 10, 8)->nullable();
            $table->decimal('longitud', 11, 8)->nullable();
            $table->time('hora_apertura')->nullable();
            $table->time('hora_cierre')->nullable();
            $table->json('horarios_semana')->nullable(); // Para horarios específicos por día
            $table->boolean('activa_ventas')->default(true);
            $table->boolean('activa_compras')->default(true);
            $table->boolean('activa_inventario')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['estado', 'activa_ventas']);
            $table->index(['ciudad', 'provincia']);
            $table->index('codigo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sucursales');
    }
}; 