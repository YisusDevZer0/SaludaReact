<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Almacen;

class AlmacenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear almacenes predefinidos por tipo
        $this->createAlmacenesPorTipo();
        
        // Crear almacenes adicionales aleatorios
        $this->createAlmacenesAleatorios();
        
        $this->command->info('✅ Almacenes creados exitosamente');
    }

    /**
     * Create predefined warehouses by type.
     */
    private function createAlmacenesPorTipo(): void
    {
        // SERVICIOS - Áreas médicas especializadas
        $servicios = [
            [
                'nombre' => 'Centro de Consulta Externa',
                'responsable' => 'Dr. María González',
                'descripcion' => 'Área destinada a consultas médicas ambulatorias y atención especializada.',
                'ubicacion' => 'Planta Baja - Ala Norte',
                'capacidad' => 25.00,
                'unidad' => 'unidades',
                'email' => 'consulta.externa@saluda.com'
            ],
            [
                'nombre' => 'Sala de Emergencias',
                'responsable' => 'Dr. Carlos Rodríguez',
                'descripcion' => 'Centro de atención médica de urgencias las 24 horas.',
                'ubicacion' => 'Planta Baja - Acceso Principal',
                'capacidad' => 15.00,
                'unidad' => 'unidades',
                'telefono' => '(555) 123-4567',
                'email' => 'emergencias@saluda.com'
            ],
            [
                'nombre' => 'Área de Cirugía',
                'responsable' => 'Dr. Ana Martínez',
                'descripcion' => 'Complejo quirúrgico con salas especializadas para diferentes procedimientos.',
                'ubicacion' => 'Segundo Piso - Zona Estéril',
                'capacidad' => 8.00,
                'unidad' => 'unidades',
                'email' => 'cirugia@saluda.com'
            ]
        ];

        foreach ($servicios as $servicio) {
            Almacen::factory()->tipo('Servicio')->create([
                'Nom_Almacen' => $servicio['nombre'],
                'Responsable' => $servicio['responsable'],
                'Descripcion' => $servicio['descripcion'],
                'Ubicacion' => $servicio['ubicacion'],
                'Capacidad_Max' => $servicio['capacidad'],
                'Unidad_Medida' => $servicio['unidad'],
                'Telefono' => $servicio['telefono'] ?? null,
                'Email' => $servicio['email'] ?? null,
                'Estado' => 'Activo'
            ]);
        }

        // MEDICAMENTOS - Farmacias y depósitos
        $medicamentos = [
            [
                'nombre' => 'Farmacia Central',
                'responsable' => 'Q.F. Patricia López',
                'descripcion' => 'Farmacia principal con control de temperatura y sistema de trazabilidad.',
                'ubicacion' => 'Planta Baja - Zona Central',
                'capacidad' => 15000.00,
                'unidad' => 'unidades',
                'telefono' => '(555) 789-0123'
            ],
            [
                'nombre' => 'Depósito Farmacéutico de Emergencia',
                'responsable' => 'Q.F. Roberto Silva',
                'descripcion' => 'Depósito especializado para medicamentos de urgencias.',
                'ubicacion' => 'Planta Baja - Emergencias',
                'capacidad' => 3000.00,
                'unidad' => 'unidades'
            ],
            [
                'nombre' => 'Bodega Médica Especializada',
                'responsable' => 'Q.F. Laura Fernández',
                'descripcion' => 'Almacén de medicamentos especializados y de alto costo.',
                'ubicacion' => 'Sótano - Área Refrigerada',
                'capacidad' => 8000.00,
                'unidad' => 'unidades'
            ]
        ];

        foreach ($medicamentos as $med) {
            Almacen::factory()->tipo('Medicamento')->create([
                'Nom_Almacen' => $med['nombre'],
                'Responsable' => $med['responsable'],
                'Descripcion' => $med['descripcion'],
                'Ubicacion' => $med['ubicacion'],
                'Capacidad_Max' => $med['capacidad'],
                'Unidad_Medida' => $med['unidad'],
                'Telefono' => $med['telefono'] ?? null,
                'Estado' => 'Activo'
            ]);
        }

        // EQUIPOS - Almacenes de equipos médicos
        $equipos = [
            [
                'nombre' => 'Almacén de Equipos Médicos',
                'responsable' => 'Ing. Miguel Torres',
                'descripcion' => 'Depósito principal de equipos biomédicos con programa de mantenimiento.',
                'ubicacion' => 'Primer Piso - Área Técnica',
                'capacidad' => 150.00,
                'unidad' => 'unidades',
                'email' => 'equipos.medicos@saluda.com'
            ],
            [
                'nombre' => 'Bodega de Instrumentos Quirúrgicos',
                'responsable' => 'Tec. Sandra Morales',
                'descripcion' => 'Almacén especializado en instrumental quirúrgico estéril.',
                'ubicacion' => 'Segundo Piso - Zona Quirúrgica',
                'capacidad' => 500.00,
                'unidad' => 'unidades'
            ]
        ];

        foreach ($equipos as $equipo) {
            Almacen::factory()->tipo('Equipo')->create([
                'Nom_Almacen' => $equipo['nombre'],
                'Responsable' => $equipo['responsable'],
                'Descripcion' => $equipo['descripcion'],
                'Ubicacion' => $equipo['ubicacion'],
                'Capacidad_Max' => $equipo['capacidad'],
                'Unidad_Medida' => $equipo['unidad'],
                'Email' => $equipo['email'] ?? null,
                'Estado' => 'Activo'
            ]);
        }

        // INSUMOS - Depósitos de insumos médicos
        $insumos = [
            [
                'nombre' => 'Depósito de Insumos Quirúrgicos',
                'responsable' => 'Enf. Carmen Delgado',
                'descripcion' => 'Almacén de material estéril para procedimientos quirúrgicos.',
                'ubicacion' => 'Primer Piso - Zona de Suministros',
                'capacidad' => 2500.00,
                'unidad' => 'cajas'
            ],
            [
                'nombre' => 'Bodega de Insumos de Enfermería',
                'responsable' => 'Enf. José Ramírez',
                'descripcion' => 'Depósito de material médico para cuidados de enfermería.',
                'ubicacion' => 'Segundo Piso - Estación de Enfermería',
                'capacidad' => 1500.00,
                'unidad' => 'paquetes'
            ]
        ];

        foreach ($insumos as $insumo) {
            Almacen::factory()->tipo('Insumo')->create([
                'Nom_Almacen' => $insumo['nombre'],
                'Responsable' => $insumo['responsable'],
                'Descripcion' => $insumo['descripcion'],
                'Ubicacion' => $insumo['ubicacion'],
                'Capacidad_Max' => $insumo['capacidad'],
                'Unidad_Medida' => $insumo['unidad'],
                'Estado' => 'Activo'
            ]);
        }

        // MATERIALES - Almacenes generales
        $materiales = [
            [
                'nombre' => 'Almacén de Materiales Médicos',
                'responsable' => 'Lic. Francisco Herrera',
                'descripcion' => 'Depósito general de materiales y suministros médicos.',
                'ubicacion' => 'Sótano - Área de Almacenamiento',
                'capacidad' => 500.00,
                'unidad' => 'kg'
            ],
            [
                'nombre' => 'Bodega de Materiales de Oficina',
                'responsable' => 'Lic. Isabel Castro',
                'descripcion' => 'Almacén de suministros administrativos y de oficina.',
                'ubicacion' => 'Primer Piso - Área Administrativa',
                'capacidad' => 200.00,
                'unidad' => 'cajas'
            ]
        ];

        foreach ($materiales as $material) {
            Almacen::factory()->tipo('Material')->create([
                'Nom_Almacen' => $material['nombre'],
                'Responsable' => $material['responsable'],
                'Descripcion' => $material['descripcion'],
                'Ubicacion' => $material['ubicacion'],
                'Capacidad_Max' => $material['capacidad'],
                'Unidad_Medida' => $material['unidad'],
                'Estado' => 'Activo'
            ]);
        }

        // CONSUMIBLES - Almacenes de material descartable
        $consumibles = [
            [
                'nombre' => 'Almacén de Consumibles Médicos',
                'responsable' => 'Tec. Andrea Vega',
                'descripcion' => 'Depósito de material descartable para procedimientos médicos.',
                'ubicacion' => 'Planta Baja - Área de Suministros',
                'capacidad' => 5000.00,
                'unidad' => 'unidades'
            ],
            [
                'nombre' => 'Bodega de Material de Laboratorio',
                'responsable' => 'Q.C. Daniel Ortiz',
                'descripcion' => 'Almacén de material consumible para análisis clínicos.',
                'ubicacion' => 'Primer Piso - Laboratorio',
                'capacidad' => 3000.00,
                'unidad' => 'paquetes'
            ]
        ];

        foreach ($consumibles as $consumible) {
            Almacen::factory()->tipo('Consumible')->create([
                'Nom_Almacen' => $consumible['nombre'],
                'Responsable' => $consumible['responsable'],
                'Descripcion' => $consumible['descripcion'],
                'Ubicacion' => $consumible['ubicacion'],
                'Capacidad_Max' => $consumible['capacidad'],
                'Unidad_Medida' => $consumible['unidad'],
                'Estado' => 'Activo'
            ]);
        }
    }

    /**
     * Create additional random warehouses.
     */
    private function createAlmacenesAleatorios(): void
    {
        // Crear almacenes adicionales por tipo para tener variedad
        $tiposConCantidad = [
            'Servicio' => 5,
            'Medicamento' => 4,
            'Equipo' => 3,
            'Insumo' => 6,
            'Material' => 4,
            'Consumible' => 5
        ];

        foreach ($tiposConCantidad as $tipo => $cantidad) {
            // 80% activos, 20% inactivos
            $activos = (int) ($cantidad * 0.8);
            $inactivos = $cantidad - $activos;

            // Crear activos
            if ($activos > 0) {
                Almacen::factory($activos)->tipo($tipo)->activo()->create();
            }

            // Crear inactivos
            if ($inactivos > 0) {
                Almacen::factory($inactivos)->tipo($tipo)->inactivo()->create();
            }
        }

        // Crear algunos almacenes especiales
        
        // Almacenes sin capacidad definida
        Almacen::factory(3)->sinCapacidad()->create();
        
        // Almacenes con contacto completo
        Almacen::factory(5)->conContacto()->create();
        
        // Almacenes para diferentes sucursales
        for ($sucursal = 1; $sucursal <= 3; $sucursal++) {
            Almacen::factory(2)->sucursal($sucursal)->create();
        }

        // Almacenes con responsables específicos comunes
        $responsablesComunes = [
            'Dr. Juan Pérez',
            'Lic. Ana García',
            'Ing. Carlos López'
        ];

        foreach ($responsablesComunes as $responsable) {
            Almacen::factory(2)->responsable($responsable)->create();
        }
    }
} 