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
        Schema::create('presentaciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            $table->string('codigo', 50)->unique();
            $table->string('abreviatura', 20)->nullable();
            $table->boolean('activa')->default(true);
            $table->integer('orden')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['activa', 'orden']);
            $table->index(['codigo', 'activa']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentaciones');
    }
}; 