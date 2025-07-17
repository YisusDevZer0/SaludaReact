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
        Schema::create('componentes_activos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 200);
            $table->text('descripcion')->nullable();
            $table->string('codigo', 50)->unique();
            $table->string('formula_quimica', 100)->nullable();
            $table->decimal('concentracion_estandar', 8, 3)->nullable(); // mg/ml
            $table->string('unidad_concentracion', 20)->nullable();
            $table->text('indicaciones')->nullable();
            $table->text('contraindicaciones')->nullable();
            $table->text('efectos_secundarios')->nullable();
            $table->text('interacciones')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['activo', 'nombre']);
            $table->index(['codigo', 'activo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('componentes_activos');
    }
}; 