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
        Schema::create('sucursales_mejoradas', function (Blueprint $table) {
            $table->id('Sucursal_ID');
            $table->string('Nombre_Sucursal', 200)->comment('Nombre de la sucursal');
            $table->text('Direccion')->nullable()->comment('Dirección de la sucursal');
            $table->string('Telefono', 20)->nullable()->comment('Teléfono de la sucursal');
            $table->string('Correo', 200)->nullable()->comment('Correo electrónico de la sucursal');
            $table->time('Horario_Apertura')->nullable()->comment('Hora de apertura de la sucursal');
            $table->time('Horario_Cierre')->nullable()->comment('Hora de cierre de la sucursal');
            $table->enum('Estatus', ['Activa', 'Inactiva'])->default('Activa')->comment('Estado de la sucursal');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que agregó la sucursal');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 200)->nullable()->comment('Usuario que modificó la sucursal');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Nombre_Sucursal');
            $table->index('Estatus');
            $table->index('ID_H_O_D');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sucursales_mejoradas');
    }
};
