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
        Schema::create('consultorios_mejorados', function (Blueprint $table) {
            $table->id('Consultorio_ID');
            $table->string('Nombre_Consultorio', 100)->comment('Nombre del consultorio');
            $table->string('Numero_Consultorio', 20)->nullable()->comment('Número del consultorio');
            $table->unsignedBigInteger('Fk_Sucursal')->comment('ID de la sucursal');
            $table->integer('Capacidad')->default(1)->comment('Capacidad del consultorio');
            $table->text('Equipamiento')->nullable()->comment('Equipamiento disponible en el consultorio');
            $table->enum('Estatus', ['Disponible', 'Ocupado', 'Mantenimiento', 'Inactivo'])->default('Disponible')->comment('Estado del consultorio');
            $table->string('ID_H_O_D', 100)->comment('Identificador de la organización/hospital');
            
            // Campos de auditoría
            $table->string('Agregado_Por', 200)->nullable()->comment('Usuario que agregó el consultorio');
            $table->timestamp('Agregado_El')->useCurrent()->comment('Fecha y hora de creación');
            $table->string('Modificado_Por', 200)->nullable()->comment('Usuario que modificó el consultorio');
            $table->timestamp('Modificado_El')->nullable()->comment('Fecha y hora de modificación');
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para mejorar el rendimiento
            $table->index('Fk_Sucursal');
            $table->index('Estatus');
            $table->index('ID_H_O_D');
            $table->index('Numero_Consultorio');
            
            // Clave foránea
            $table->foreign('Fk_Sucursal')->references('Sucursal_ID')->on('sucursales_mejoradas')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultorios_mejorados');
    }
};
