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
        // Verificar si la tabla citas existe, si no, usar agendas
        if (Schema::hasTable('citas')) {
            $tableName = 'citas';
        } elseif (Schema::hasTable('agendas')) {
            $tableName = 'agendas';
        } else {
            throw new \Exception('No se encontró tabla de citas o agendas');
        }

        Schema::table($tableName, function (Blueprint $table) {
            $table->unsignedBigInteger('tipo_consulta_id')->nullable()->after('Tipo_Cita')->comment('ID del tipo de consulta');
            
            // Índice para mejorar el rendimiento
            $table->index('tipo_consulta_id');
            
            // Clave foránea
            $table->foreign('tipo_consulta_id')->references('Tipo_ID')->on('tipos_consulta')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Verificar si la tabla citas existe, si no, usar agendas
        if (Schema::hasTable('citas')) {
            $tableName = 'citas';
        } elseif (Schema::hasTable('agendas')) {
            $tableName = 'agendas';
        } else {
            return; // No hacer nada si no existe ninguna tabla
        }

        Schema::table($tableName, function (Blueprint $table) {
            $table->dropForeign(['tipo_consulta_id']);
            $table->dropIndex(['tipo_consulta_id']);
            $table->dropColumn('tipo_consulta_id');
        });
    }
};
