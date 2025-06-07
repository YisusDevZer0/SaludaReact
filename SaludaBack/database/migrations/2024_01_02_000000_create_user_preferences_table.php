<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->json('ui_preferences')->nullable(); // Configuraciones de UI (sidenav, navbar, etc.)
            $table->json('theme_preferences')->nullable(); // Configuraciones de tema (colores, etc.)
            $table->timestamps();

            // Índices
            $table->unique('user_id');
            $table->index(['user_id', 'updated_at']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_preferences');
    }
}; 