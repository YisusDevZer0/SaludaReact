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
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->unique();
            $table->string('razon_social', 255);
            $table->string('nombre_comercial', 255)->nullable();
            $table->string('cuit', 20)->unique()->nullable();
            $table->string('dni', 20)->nullable();
            $table->enum('tipo_persona', ['fisica', 'juridica'])->default('juridica');
            
            // Información de contacto
            $table->string('email', 100)->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('celular', 20)->nullable();
            $table->string('fax', 20)->nullable();
            $table->string('sitio_web', 255)->nullable();
            
            // Dirección
            $table->text('direccion')->nullable();
            $table->string('ciudad', 50)->nullable();
            $table->string('provincia', 50)->nullable();
            $table->string('codigo_postal', 10)->nullable();
            $table->string('pais', 50)->default('Argentina');
            $table->decimal('latitud', 10, 8)->nullable();
            $table->decimal('longitud', 11, 8)->nullable();
            
            // Información comercial
            $table->enum('categoria', ['minorista', 'mayorista', 'fabricante', 'distribuidor', 'importador'])->default('mayorista');
            $table->enum('estado', ['activo', 'inactivo', 'suspendido', 'bloqueado'])->default('activo');
            $table->decimal('limite_credito', 12, 2)->nullable();
            $table->integer('dias_credito')->default(30);
            $table->decimal('descuento_por_defecto', 5, 2)->default(0.00); // Porcentaje
            
            // Información bancaria
            $table->string('banco', 100)->nullable();
            $table->string('tipo_cuenta', 20)->nullable();
            $table->string('numero_cuenta', 50)->nullable();
            $table->string('cbu', 22)->nullable();
            $table->string('alias_cbu', 50)->nullable();
            
            // Información fiscal
            $table->enum('condicion_iva', ['responsable_inscripto', 'monotributista', 'exento', 'consumidor_final'])->default('responsable_inscripto');
            $table->boolean('retencion_iva')->default(false);
            $table->decimal('porcentaje_retencion_iva', 5, 2)->default(0.00);
            $table->boolean('retencion_ganancias')->default(false);
            $table->decimal('porcentaje_retencion_ganancias', 5, 2)->default(0.00);
            
            // Información de contacto comercial
            $table->string('contacto_nombre', 100)->nullable();
            $table->string('contacto_cargo', 100)->nullable();
            $table->string('contacto_telefono', 20)->nullable();
            $table->string('contacto_email', 100)->nullable();
            $table->string('contacto_celular', 20)->nullable();
            
            // Horarios y disponibilidad
            $table->time('hora_apertura')->nullable();
            $table->time('hora_cierre')->nullable();
            $table->json('horarios_semana')->nullable();
            $table->integer('tiempo_entrega_promedio')->nullable(); // en días
            
            // Información adicional
            $table->text('observaciones')->nullable();
            $table->text('notas_internas')->nullable();
            $table->string('logo_url')->nullable();
            $table->json('documentos')->nullable(); // URLs de documentos
            $table->json('etiquetas')->nullable(); // Etiquetas para categorización
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['codigo', 'estado']);
            $table->index(['cuit', 'estado']);
            $table->index(['razon_social', 'estado']);
            $table->index(['categoria', 'estado']);
            $table->index(['ciudad', 'provincia']);
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
}; 