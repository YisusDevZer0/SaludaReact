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
        Schema::create('almacenes', function (Blueprint $table) {
            $table->id('Almacen_ID'); // AUTO_INCREMENT PRIMARY KEY
            $table->string('Nom_Almacen', 200)->comment('Nombre del almacén');
            $table->enum('Tipo', ['Servicio', 'Insumo', 'Medicamento', 'Equipo', 'Material', 'Consumible'])
                  ->comment('Tipo de productos que maneja el almacén');
            $table->string('Responsable', 200)->comment('Nombre del responsable del almacén');
            $table->enum('Estado', ['Activo', 'Inactivo'])->default('Activo')->comment('Estado del almacén');
            $table->char('Cod_Estado', 1)->default('A')->comment('Código de estado (A=Activo, I=Inactivo)');
            $table->string('Sistema', 100)->default('SaludaReact')->comment('Sistema origen');
            $table->string('ID_H_O_D', 150)->comment('ID del hospital/organización/departamento');
            $table->unsignedBigInteger('FkSucursal')->comment('ID de la sucursal');
            $table->string('Agregado_Por', 250)->comment('Usuario que agregó el registro');
            $table->timestamp('Agregadoel')->useCurrent()->comment('Fecha de creación');
            $table->text('Descripcion')->nullable()->comment('Descripción detallada del almacén');
            $table->string('Ubicacion', 500)->nullable()->comment('Ubicación física del almacén');
            $table->decimal('Capacidad_Max', 10, 2)->nullable()->comment('Capacidad máxima en unidades');
            $table->string('Unidad_Medida', 50)->nullable()->comment('Unidad de medida (m², unidades, kg, etc.)');
            $table->string('Telefono', 20)->nullable()->comment('Teléfono de contacto del almacén');
            $table->string('Email', 200)->nullable()->comment('Email de contacto del almacén');
            $table->timestamps();
            $table->softDeletes();

            // Índices para optimización
            $table->index(['Estado', 'Tipo']);
            $table->index(['Cod_Estado']);
            $table->index(['Sistema']);
            $table->index(['ID_H_O_D']);
            $table->index(['FkSucursal']);
            $table->index(['Responsable']);
            $table->index(['Tipo']);
            
            // Índice único para evitar duplicados por sucursal
            $table->unique(['Nom_Almacen', 'FkSucursal'], 'unique_almacen_sucursal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('almacenes');
    }
}; 