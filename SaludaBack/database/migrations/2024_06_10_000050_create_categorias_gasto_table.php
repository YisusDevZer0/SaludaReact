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
        Schema::create('categorias_gasto', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('categoria_padre_id')->nullable();
            $table->decimal('presupuesto_mensual', 15, 2)->nullable();
            $table->decimal('presupuesto_anual', 15, 2)->nullable();
            $table->string('codigo')->unique();
            $table->boolean('activa')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('categoria_padre_id')->references('id')->on('categorias_gasto')->onDelete('set null');
            
            $table->index(['categoria_padre_id', 'activa']);
            $table->index(['codigo', 'activa']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categorias_gasto');
    }
}; 