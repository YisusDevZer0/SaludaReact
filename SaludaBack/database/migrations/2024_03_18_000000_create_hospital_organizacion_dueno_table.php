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
        Schema::create('Hospital_Organizacion_Dueño', function (Blueprint $table) {
            $table->string('H_O_D', 100)->primary();
            $table->string('nombre', 255);
            $table->string('codigo', 50)->unique();
            $table->string('direccion', 255)->nullable();
            $table->string('telefono', 50)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('responsable', 100)->nullable();
            $table->string('tipo', 50)->nullable();
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Hospital_Organizacion_Dueño');
    }
}; 