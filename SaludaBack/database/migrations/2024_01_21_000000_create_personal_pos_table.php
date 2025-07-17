
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
        Schema::create('PersonalPOS', function (Blueprint $table) {
            $table->id('Pos_ID');
            $table->string('Nombre_Apellidos', 255);
            $table->string('Correo_Electronico', 255)->unique();
            $table->string('Contrasena', 255);
            $table->string('Telefono', 20)->nullable();
            $table->string('Direccion', 500)->nullable();
            $table->string('Cargo', 100)->nullable();
            $table->string('Departamento', 100)->nullable();
            $table->string('Estado', 50)->default('Activo');
            $table->string('Cod_Estado', 10)->default('A');
            $table->string('Agregado_Por', 250)->nullable();
            $table->timestamp('Agregadoel')->useCurrent();
            $table->string('Sistema', 200)->default('POS');
            $table->integer('ID_H_O_D')->default(1);
            $table->string('remember_token', 100)->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['Estado', 'Cod_Estado']);
            $table->index('Correo_Electronico');
            $table->index('remember_token');
            $table->index('ID_H_O_D');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('PersonalPOS');
    }
}; 