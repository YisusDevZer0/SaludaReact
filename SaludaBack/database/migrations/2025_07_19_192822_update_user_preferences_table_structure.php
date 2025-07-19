<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_preferences', function (Blueprint $table) {
            // Eliminar columnas antiguas si existen
            if (Schema::hasColumn('user_preferences', 'ui_preferences')) {
                $table->dropColumn('ui_preferences');
            }
            if (Schema::hasColumn('user_preferences', 'theme_preferences')) {
                $table->dropColumn('theme_preferences');
            }
            
            // Agregar columnas nuevas si no existen
            if (!Schema::hasColumn('user_preferences', 'sidenav_color')) {
                $table->string('sidenav_color')->default('info');
            }
            if (!Schema::hasColumn('user_preferences', 'transparent_sidenav')) {
                $table->boolean('transparent_sidenav')->default(false);
            }
            if (!Schema::hasColumn('user_preferences', 'white_sidenav')) {
                $table->boolean('white_sidenav')->default(false);
            }
            if (!Schema::hasColumn('user_preferences', 'fixed_navbar')) {
                $table->boolean('fixed_navbar')->default(true);
            }
            if (!Schema::hasColumn('user_preferences', 'dark_mode')) {
                $table->boolean('dark_mode')->default(false);
            }
            if (!Schema::hasColumn('user_preferences', 'mini_sidenav')) {
                $table->boolean('mini_sidenav')->default(false);
            }
            
            // Asegurar que las columnas de navbar existan con valores por defecto correctos
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
            
            // Asegurar que la columna user_id tenga la restricción única
            if (Schema::hasColumn('user_preferences', 'user_id')) {
                // Verificar si ya existe la restricción única
                $indexes = DB::select("SHOW INDEX FROM user_preferences WHERE Key_name = 'user_preferences_user_id_unique'");
                if (empty($indexes)) {
                    $table->unique('user_id');
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_preferences', function (Blueprint $table) {
            // Revertir los cambios si es necesario
            $table->dropColumn([
                'sidenav_color',
                'transparent_sidenav',
                'white_sidenav',
                'fixed_navbar',
                'dark_mode',
                'mini_sidenav',
                'navbar_color',
                'transparent_navbar',
                'navbar_shadow',
                'navbar_position',
                'layout',
                'direction',
                'table_header_color'
            ]);
            
            // Restaurar columnas antiguas
            $table->longText('ui_preferences')->nullable();
            $table->longText('theme_preferences')->nullable();
        });
    }
};
