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
        Schema::table('user_preferences', function (Blueprint $table) {
            // Agregar columnas para preferencias de navbar si no existen
            if (!Schema::hasColumn('user_preferences', 'navbar_color')) {
                $table->string('navbar_color')->default('info');
            }
            if (!Schema::hasColumn('user_preferences', 'transparent_navbar')) {
                $table->boolean('transparent_navbar')->default(true);
            }
            if (!Schema::hasColumn('user_preferences', 'navbar_shadow')) {
                $table->boolean('navbar_shadow')->default(true);
            }
            if (!Schema::hasColumn('user_preferences', 'navbar_position')) {
                $table->string('navbar_position')->default('fixed');
            }
            if (!Schema::hasColumn('user_preferences', 'layout')) {
                $table->string('layout')->default('dashboard');
            }
            if (!Schema::hasColumn('user_preferences', 'direction')) {
                $table->string('direction')->default('ltr');
            }
            if (!Schema::hasColumn('user_preferences', 'table_header_color')) {
                $table->string('table_header_color')->default('azulSereno');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_preferences', function (Blueprint $table) {
            $table->dropColumn([
                'navbar_color',
                'transparent_navbar',
                'navbar_shadow',
                'navbar_position',
                'layout',
                'direction',
                'table_header_color'
            ]);
        });
    }
};
