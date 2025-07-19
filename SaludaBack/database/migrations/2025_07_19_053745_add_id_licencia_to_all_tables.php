<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Lista de tablas que necesitan la columna Id_Licencia
        $tables = [
            'almacenes',
            'servicios',
            'marcas',
            'servicio_marca',
            'categorias_pos',
            'productos',
            'clientes',
            'proveedores',
            'personal_pos',
            'sucursales',
            'permisos',
            'roles_puestos',
            'permission_role',
            'role_user',
            'componentes_activos',
            'presentaciones',
            'compras',
            'ventas',
            'detalles_compra',
            'detalles_venta',
            'inventario',
            'ajustes_inventario',
            'conteos_fisicos',
            'movimientos_inventario',
            'stock_almacen',
            'alertas_inventario',
            'transferencias_inventario',
            'reservas_inventario',
            'detalles_conteo',
            'detalles_ajuste',
            'detalles_transferencia',
            'cajas',
            'movimientos_caja',
            'gastos',
            'categorias_gasto',
            'encargos',
            'detalles_encargo',
            'cierres_caja',
            'agendas',
            'pacientes',
            'doctores',
            'agendas_medicas',
            'estudios_medicos',
            'antecedentes_medicos',
            'historial_clinico',
            'recetas_medicas',
            'pacientes_medicos',
            'detalles_receta',
            'procedimientos_medicos',
            'carritos_enfermeros',
            'enfermeros',
            'planes_obra_social',
            'obras_sociales',
            'consultorios',
            'especialidades_medicas',
            'creditos',
            'cuotas_credito',
            'creditos_dentales',
            'cuotas_credito_dental',
            'tratamientos_dentales',
            'sesiones_dentales',
            'auditorias',
            'user_preferences',
            'tipos'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                // Verificar si la columna ya existe
                if (!Schema::hasColumn($tableName, 'Id_Licencia')) {
                    Schema::table($tableName, function (Blueprint $table) {
                        $table->string('Id_Licencia', 100)->nullable()->comment('Identificador de licencia del sistema');
                    });
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Lista de tablas que necesitan la columna Id_Licencia
        $tables = [
            'almacenes',
            'servicios',
            'marcas',
            'servicio_marca',
            'categorias_pos',
            'productos',
            'clientes',
            'proveedores',
            'personal_pos',
            'sucursales',
            'permisos',
            'roles_puestos',
            'permission_role',
            'role_user',
            'componentes_activos',
            'presentaciones',
            'compras',
            'ventas',
            'detalles_compra',
            'detalles_venta',
            'inventario',
            'ajustes_inventario',
            'conteos_fisicos',
            'movimientos_inventario',
            'stock_almacen',
            'alertas_inventario',
            'transferencias_inventario',
            'reservas_inventario',
            'detalles_conteo',
            'detalles_ajuste',
            'detalles_transferencia',
            'cajas',
            'movimientos_caja',
            'gastos',
            'categorias_gasto',
            'encargos',
            'detalles_encargo',
            'cierres_caja',
            'agendas',
            'pacientes',
            'doctores',
            'agendas_medicas',
            'estudios_medicos',
            'antecedentes_medicos',
            'historial_clinico',
            'recetas_medicas',
            'pacientes_medicos',
            'detalles_receta',
            'procedimientos_medicos',
            'carritos_enfermeros',
            'enfermeros',
            'planes_obra_social',
            'obras_sociales',
            'consultorios',
            'especialidades_medicas',
            'creditos',
            'cuotas_credito',
            'creditos_dentales',
            'cuotas_credito_dental',
            'tratamientos_dentales',
            'sesiones_dentales',
            'auditorias',
            'user_preferences',
            'tipos'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                // Verificar si la columna existe antes de eliminarla
                if (Schema::hasColumn($tableName, 'Id_Licencia')) {
                    Schema::table($tableName, function (Blueprint $table) {
                        $table->dropColumn('Id_Licencia');
                    });
                }
            }
        }
    }
};
