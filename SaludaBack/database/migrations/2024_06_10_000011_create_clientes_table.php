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
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 20)->unique();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('razon_social', 255)->nullable();
            $table->string('email', 100)->nullable()->unique();
            $table->string('telefono', 20)->nullable();
            $table->string('celular', 20)->nullable();
            $table->string('dni', 20)->nullable()->unique();
            $table->string('cuit', 20)->nullable()->unique();
            $table->enum('tipo_persona', ['fisica', 'juridica'])->default('fisica');
            
            // Información de contacto
            $table->text('direccion')->nullable();
            $table->string('ciudad', 50)->nullable();
            $table->string('provincia', 50)->nullable();
            $table->string('codigo_postal', 10)->nullable();
            $table->string('pais', 50)->default('Argentina');
            $table->decimal('latitud', 10, 8)->nullable();
            $table->decimal('longitud', 11, 8)->nullable();
            
            // Información comercial
            $table->enum('categoria', ['minorista', 'mayorista', 'distribuidor', 'consumidor_final'])->default('consumidor_final');
            $table->enum('estado', ['activo', 'inactivo', 'suspendido', 'bloqueado'])->default('activo');
            $table->decimal('limite_credito', 12, 2)->nullable();
            $table->integer('dias_credito')->default(0);
            $table->decimal('descuento_por_defecto', 5, 2)->default(0.00); // Porcentaje
            $table->decimal('saldo_actual', 12, 2)->default(0.00);
            
            // Información fiscal
            $table->enum('condicion_iva', ['responsable_inscripto', 'monotributista', 'exento', 'consumidor_final'])->default('consumidor_final');
            $table->string('numero_ingresos_brutos', 50)->nullable();
            $table->boolean('exento_iva')->default(false);
            
            // Información de contacto adicional
            $table->string('contacto_alternativo', 100)->nullable();
            $table->string('telefono_alternativo', 20)->nullable();
            $table->string('email_alternativo', 100)->nullable();
            
            // Información de facturación
            $table->text('direccion_facturacion')->nullable();
            $table->string('ciudad_facturacion', 50)->nullable();
            $table->string('provincia_facturacion', 50)->nullable();
            $table->string('codigo_postal_facturacion', 10)->nullable();
            
            // Información de envío
            $table->text('direccion_envio')->nullable();
            $table->string('ciudad_envio', 50)->nullable();
            $table->string('provincia_envio', 50)->nullable();
            $table->string('codigo_postal_envio', 10)->nullable();
            $table->string('instrucciones_envio', 255)->nullable();
            
            // Información de salud (para farmacias)
            $table->string('obra_social', 100)->nullable();
            $table->string('numero_afiliado', 50)->nullable();
            $table->string('plan_obra_social', 100)->nullable();
            $table->text('alergias')->nullable();
            $table->text('medicamentos_actuales')->nullable();
            $table->text('condiciones_medicas')->nullable();
            $table->string('grupo_sanguineo', 10)->nullable();
            $table->string('factor_rh', 5)->nullable();
            
            // Información adicional
            $table->date('fecha_nacimiento')->nullable();
            $table->enum('genero', ['masculino', 'femenino', 'otro'])->nullable();
            $table->string('profesion', 100)->nullable();
            $table->string('empresa', 100)->nullable();
            $table->string('cargo', 100)->nullable();
            $table->text('observaciones')->nullable();
            $table->text('notas_internas')->nullable();
            $table->json('preferencias')->nullable();
            $table->json('etiquetas')->nullable();
            
            // Información de marketing
            $table->boolean('acepta_marketing')->default(false);
            $table->boolean('acepta_newsletter')->default(false);
            $table->date('fecha_ultima_compra')->nullable();
            $table->decimal('total_compras', 12, 2)->default(0.00);
            $table->integer('cantidad_compras')->default(0);
            $table->decimal('promedio_compra', 10, 2)->default(0.00);
            
            // Auditoría
            $table->string('creado_por', 100)->nullable();
            $table->string('actualizado_por', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['codigo', 'estado']);
            $table->index(['dni', 'estado']);
            $table->index(['cuit', 'estado']);
            $table->index(['email', 'estado']);
            $table->index(['nombre', 'apellido']);
            $table->index(['categoria', 'estado']);
            $table->index(['ciudad', 'provincia']);
            $table->index('fecha_ultima_compra');
            $table->index('total_compras');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
}; 