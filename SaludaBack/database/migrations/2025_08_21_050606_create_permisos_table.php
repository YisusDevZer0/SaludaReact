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
        Schema::create('permisos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100)->unique();
            $table->string('descripcion', 255)->nullable();
            $table->string('modulo', 50);
            $table->string('accion', 50);
            $table->boolean('activo')->default(true);
            $table->timestamps();

            // Índices
            $table->index(['modulo', 'accion']);
            $table->index('activo');
        });

        // Tabla pivote para relación muchos a muchos entre roles y permisos
        Schema::create('role_permisos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles_puestos')->onDelete('cascade');
            $table->foreignId('permiso_id')->constrained('permisos')->onDelete('cascade');
            $table->timestamps();

            // Índices
            $table->unique(['role_id', 'permiso_id']);
            $table->index(['role_id']);
            $table->index(['permiso_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_permisos');
        Schema::dropIfExists('permisos');
    }
};
