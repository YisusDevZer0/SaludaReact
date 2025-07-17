<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles_puestos', function (Blueprint $table) {
            $table->id('id');
            $table->string('nombre', 100);
            $table->string('descripcion', 255)->nullable();
            $table->string('tipo', 50)->default('rol'); // rol o puesto
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['nombre', 'tipo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles_puestos');
    }
}; 