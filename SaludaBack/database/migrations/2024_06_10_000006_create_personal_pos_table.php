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
        Schema::create('personal_pos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->unique();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('email', 100)->unique();
            $table->string('password');
            $table->string('telefono', 20)->nullable();
            $table->string('dni', 20)->unique()->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->enum('genero', ['masculino', 'femenino', 'otro'])->nullable();
            $table->text('direccion')->nullable();
            $table->string('ciudad', 50)->nullable();
            $table->string('provincia', 50)->nullable();
            $table->string('codigo_postal', 10)->nullable();
            $table->string('pais', 50)->default('Argentina');
            
            // Información laboral
            $table->foreignId('sucursal_id')->nullable()->constrained('sucursales')->onDelete('set null');
            $table->foreignId('role_id')->nullable()->constrained('roles_puestos')->onDelete('set null');
            $table->date('fecha_ingreso')->nullable();
            $table->date('fecha_salida')->nullable();
            $table->enum('estado_laboral', ['activo', 'inactivo', 'suspendido', 'licencia'])->default('activo');
            $table->decimal('salario', 10, 2)->nullable();
            $table->string('tipo_contrato', 50)->nullable();
            
            // Información de autenticación
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('can_login')->default(true);
            $table->boolean('can_sell')->default(true);
            $table->boolean('can_refund')->default(false);
            $table->boolean('can_manage_inventory')->default(false);
            $table->boolean('can_manage_users')->default(false);
            $table->boolean('can_view_reports')->default(false);
            $table->boolean('can_manage_settings')->default(false);
            
            // Configuración de sesión
            $table->integer('session_timeout')->default(480); // 8 horas en minutos
            $table->json('preferences')->nullable(); // Preferencias del usuario
            
            // Información de seguridad
            $table->integer('failed_login_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();
            $table->string('password_reset_token')->nullable();
            $table->timestamp('password_reset_expires_at')->nullable();
            
            // Información adicional
            $table->text('notas')->nullable();
            $table->string('foto_perfil')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['email', 'is_active']);
            $table->index(['codigo', 'is_active']);
            $table->index(['sucursal_id', 'estado_laboral']);
            $table->index(['role_id', 'can_login']);
            $table->index('last_login_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_pos');
    }
}; 