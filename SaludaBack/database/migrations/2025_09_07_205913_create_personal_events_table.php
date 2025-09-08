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
        Schema::create('personal_events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->comment('ID del usuario propietario del evento');
            $table->string('title')->comment('Título del evento');
            $table->text('description')->nullable()->comment('Descripción del evento');
            $table->date('event_date')->comment('Fecha del evento');
            $table->time('start_time')->comment('Hora de inicio');
            $table->time('end_time')->comment('Hora de fin');
            $table->string('event_type')->default('personal')->comment('Tipo de evento: personal, reminder, meeting, etc.');
            $table->string('color', 7)->default('#2196f3')->comment('Color del evento en formato hex');
            $table->boolean('all_day')->default(false)->comment('Si es un evento de todo el día');
            $table->string('location')->nullable()->comment('Ubicación del evento');
            $table->json('reminder_settings')->nullable()->comment('Configuración de recordatorios');
            $table->boolean('is_recurring')->default(false)->comment('Si el evento se repite');
            $table->string('recurrence_pattern')->nullable()->comment('Patrón de recurrencia: daily, weekly, monthly, yearly');
            $table->date('recurrence_end_date')->nullable()->comment('Fecha de fin de recurrencia');
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active')->comment('Estado del evento');
            $table->timestamps();
            
            // Índices
            $table->index(['user_id', 'event_date']);
            $table->index(['user_id', 'status']);
            $table->index('event_date');
            
            // Clave foránea
            $table->foreign('user_id')->references('id')->on('personal_pos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_events');
    }
};
