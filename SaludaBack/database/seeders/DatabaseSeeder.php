<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(): void
    {
        // Seeders en orden de dependencias
        $this->call([
            // 1. Datos básicos del sistema
            RolesPuestosSeeder::class,
            PermisosSeeder::class,
            SucursalesSeeder::class,
            PersonalPosSeeder::class, // Incluye tu usuario administrador
            AdminUsersSeeder::class, // Usuarios administrativos adicionales
            
            // 2. Datos de servicios y productos
            ServiciosSeeder::class,
            MarcasSeeder::class,
            ServicioMarcaSeeder::class,
            CategoriasPosSeeder::class,
            ProductosSeeder::class,
            PresentacionesSeeder::class,
            ComponentesActivosSeeder::class,
            
            // 3. Datos de almacén
            AlmacenesSeeder::class,
            InventarioSeeder::class,
            StockAlmacenSeeder::class,
            
            // 4. Datos de proveedores y clientes
            ProveedoresSeeder::class,
            ClientesSeeder::class,
            
            // 5. Datos médicos
            EspecialidadesMedicasSeeder::class,
            ConsultoriosSeeder::class,
            ObrasSocialesSeeder::class,
            PlanesObraSocialSeeder::class,
            EnfermerosSeeder::class,
            CarritosEnfermerosSeeder::class,
            ProcedimientosMedicosSeeder::class,
            DoctoresSeeder::class,
            PacientesSeeder::class,
            PacientesMedicosSeeder::class,
            
            // 6. Datos de ventas y compras
            VentasSeeder::class,
            DetallesVentaSeeder::class,
            ComprasSeeder::class,
            DetallesCompraSeeder::class,
            
            // 7. Datos de caja
            CajasSeeder::class,
            GastosSeeder::class,
            CategoriasGastoSeeder::class,
            EncargosSeeder::class,
            DetallesEncargoSeeder::class,
            CierresCajaSeeder::class,
            MovimientosCajaSeeder::class,
            
            // 8. Datos de inventario
            MovimientosInventarioSeeder::class,
            ReservasInventarioSeeder::class,
            AlertasInventarioSeeder::class,
            AjustesInventarioSeeder::class,
            ConteosFisicosSeeder::class,
            TransferenciasInventarioSeeder::class,
            DetallesTransferenciaSeeder::class,
            DetallesAjusteSeeder::class,
            DetallesConteoSeeder::class,
            
            // 9. Datos médicos avanzados
            AgendasSeeder::class,
            AgendasMedicasSeeder::class,
            RecetasMedicasSeeder::class,
            DetallesRecetaSeeder::class,
            HistorialClinicoSeeder::class,
            AntecedentesMedicosSeeder::class,
            EstudiosMedicosSeeder::class,
            
            // 10. Datos de créditos
            CreditosSeeder::class,
            CuotasCreditoSeeder::class,
            CreditosDentalesSeeder::class,
            CuotasCreditoDentalSeeder::class,
            
            // 11. Datos dentales
            TratamientosDentalesSeeder::class,
            SesionesDentalesSeeder::class,
        ]);
    }
}
