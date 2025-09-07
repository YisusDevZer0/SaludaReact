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
        Schema::table('citas_mejoradas', function (Blueprint $table) {
            $table->unsignedBigInteger('Fk_Horario')->nullable()->comment('ID del horario específico de Horarios_Citas_Ext');
            $table->index('Fk_Horario');
            $table->foreign('Fk_Horario')->references('ID_Horario')->on('Horarios_Citas_Ext')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('citas_mejoradas', function (Blueprint $table) {
            $table->dropForeign(['Fk_Horario']);
            $table->dropIndex(['Fk_Horario']);
            $table->dropColumn('Fk_Horario');
        });
    }
};
