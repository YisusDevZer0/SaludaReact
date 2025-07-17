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
        Schema::create('categorias_pos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('categoria_padre_id')->nullable();
            $table->string('codigo', 50)->unique();
            $table->string('icono', 50)->nullable();
            $table->string('color', 7)->nullable(); // Código hexadecimal
            $table->integer('orden')->default(0);
            $table->boolean('activa')->default(true);
            $table->boolean('visible_en_pos')->default(true);
            $table->decimal('comision', 5, 2)->nullable(); // Porcentaje de comisión
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('categoria_padre_id')->references('id')->on('categorias_pos')->onDelete('set null');
            
            $table->index(['categoria_padre_id', 'activa']);
            $table->index(['orden', 'activa']);
            $table->index(['visible_en_pos', 'activa']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categorias_pos');
    }
}; 