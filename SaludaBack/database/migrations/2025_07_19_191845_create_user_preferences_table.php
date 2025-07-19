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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('personal_pos')->onDelete('cascade');
            
            // UI Preferences
            $table->string('sidenav_color')->default('info');
            $table->boolean('transparent_sidenav')->default(false);
            $table->boolean('white_sidenav')->default(false);
            $table->boolean('fixed_navbar')->default(true);
            $table->boolean('dark_mode')->default(false);
            $table->boolean('mini_sidenav')->default(false);
            
            // Navbar specific preferences
            $table->string('navbar_color')->default('info');
            $table->boolean('transparent_navbar')->default(true);
            $table->boolean('navbar_shadow')->default(true);
            $table->string('navbar_position')->default('fixed'); // fixed, static, absolute
            
            // Additional UI preferences
            $table->string('layout')->default('dashboard');
            $table->string('direction')->default('ltr');
            $table->string('table_header_color')->default('azulSereno');
            
            $table->timestamps();
            
            // Ensure one preference record per user
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
