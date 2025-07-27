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
        Schema::table('productos', function (Blueprint $table) {
            // Agregar columna almacen_id si no existe
            if (!Schema::hasColumn('productos', 'almacen_id')) {
                $table->unsignedBigInteger('almacen_id')->nullable()->after('proveedor_id');
                $table->foreign('almacen_id')->references('Almacen_ID')->on('almacenes')->onDelete('set null');
                $table->index(['almacen_id', 'estado']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            // Eliminar la columna almacen_id si existe
            if (Schema::hasColumn('productos', 'almacen_id')) {
                $table->dropForeign(['almacen_id']);
                $table->dropIndex(['almacen_id', 'estado']);
                $table->dropColumn('almacen_id');
            }
        });
    }
}; 