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
        Schema::create('especialidades_medicas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('codigo', 20)->unique();
            $table->text('descripcion')->nullable();
            $table->string('icono', 50)->nullable();
            $table->string('color', 20)->nullable();
            
            // Configuración
            $table->boolean('activa')->default(true);
            $table->boolean('requiere_agenda')->default(true);
            $table->integer('duracion_consulta_minutos')->default(30);
            $table->decimal('precio_consulta', 10, 2)->nullable();
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->json('configuracion')->nullable();
            $table->integer('orden')->default(0);
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['codigo', 'activa']);
            $table->index('orden');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('especialidades_medicas');
    }
}; 