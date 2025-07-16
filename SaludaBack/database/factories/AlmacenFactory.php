<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Almacen;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Almacen>
 */
class AlmacenFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Almacen::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tipo = $this->faker->randomElement(array_keys(Almacen::TIPOS_PERMITIDOS));
        $estado = $this->faker->randomElement(['Activo', 'Inactivo']);
        
        return [
            'Nom_Almacen' => $this->generateNombreAlmacen($tipo),
            'Tipo' => $tipo,
            'Responsable' => $this->faker->name(),
            'Estado' => $estado,
            'Cod_Estado' => $estado === 'Activo' ? 'A' : 'I',
            'Sistema' => 'SaludaReact',
            'ID_H_O_D' => $this->faker->randomElement(['Saluda', 'Hospital-Central', 'Clinica-Norte']),
            'FkSucursal' => $this->faker->numberBetween(1, 5),
            'Agregado_Por' => $this->faker->randomElement([
                'Dr. ' . $this->faker->lastName(),
                'Lic. ' . $this->faker->firstName(),
                'Admn. ' . $this->faker->name()
            ]),
            'Agregadoel' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'Descripcion' => $this->generateDescripcion($tipo),
            'Ubicacion' => $this->generateUbicacion(),
            'Capacidad_Max' => $this->generateCapacidad($tipo),
            'Unidad_Medida' => $this->generateUnidadMedida($tipo),
            'Telefono' => $this->faker->optional(0.7)->phoneNumber(),
            'Email' => $this->generateEmail($tipo),
        ];
    }

    /**
     * Generate appropriate warehouse name based on type.
     */
    private function generateNombreAlmacen(string $tipo): string
    {
        $prefijos = [
            'Servicio' => ['Centro de', 'Sala de', 'Área de', 'Zona de'],
            'Insumo' => ['Depósito de', 'Almacén de', 'Bodega de', 'Stock de'],
            'Medicamento' => ['Farmacia', 'Depósito Farmacéutico', 'Almacén Medicinal', 'Bodega Médica'],
            'Equipo' => ['Almacén de Equipos', 'Depósito Técnico', 'Bodega de Instrumentos', 'Centro de Equipos'],
            'Material' => ['Almacén de Materiales', 'Depósito General', 'Bodega de Suministros', 'Stock General'],
            'Consumible' => ['Almacén de Consumibles', 'Depósito de Insumos', 'Bodega de Materiales', 'Stock Consumible']
        ];

        $sufijos = [
            'Servicio' => ['Consulta Externa', 'Emergencias', 'Cirugía', 'Radiología', 'Laboratorio', 'Cardiología'],
            'Insumo' => ['Quirúrgicos', 'Médicos', 'de Enfermería', 'Generales', 'Especializados'],
            'Medicamento' => ['Central', 'de Emergencia', 'Ambulatoria', 'Hospitalaria', 'Especializada'],
            'Equipo' => ['Médicos', 'Quirúrgicos', 'de Diagnóstico', 'de Terapia', 'Generales'],
            'Material' => ['Médicos', 'de Oficina', 'de Limpieza', 'Generales', 'Especializados'],
            'Consumible' => ['Médicos', 'de Laboratorio', 'Quirúrgicos', 'Generales', 'de Enfermería']
        ];

        $prefijo = $this->faker->randomElement($prefijos[$tipo] ?? ['Almacén de']);
        $sufijo = $this->faker->randomElement($sufijos[$tipo] ?? ['Generales']);
        
        return $prefijo . ' ' . $sufijo;
    }

    /**
     * Generate description based on type.
     */
    private function generateDescripcion(string $tipo): ?string
    {
        $descripciones = [
            'Servicio' => [
                'Área destinada a la atención y prestación de servicios médicos especializados.',
                'Centro de atención médica con personal calificado y equipamiento adecuado.',
                'Espacio diseñado para brindar servicios de salud de alta calidad.',
                'Zona especializada en la prestación de servicios médicos ambulatorios.'
            ],
            'Insumo' => [
                'Depósito para el almacenamiento de insumos médicos y material hospitalario.',
                'Área destinada al control y distribución de insumos médicos.',
                'Espacio acondicionado para el almacenamiento de material médico.',
                'Bodega especializada en insumos para procedimientos médicos.'
            ],
            'Medicamento' => [
                'Farmacia hospitalaria con control de temperatura y humedad.',
                'Depósito farmacéutico con sistema de trazabilidad de medicamentos.',
                'Área especializada en el almacenamiento y dispensación de fármacos.',
                'Bodega farmacéutica con protocolo de control de calidad.'
            ],
            'Equipo' => [
                'Almacén de equipos médicos con mantenimiento preventivo.',
                'Depósito de instrumental médico y equipos especializados.',
                'Área destinada al resguardo de equipos de diagnóstico.',
                'Bodega de equipos biomédicos con control de inventario.'
            ],
            'Material' => [
                'Almacén general de materiales y suministros médicos.',
                'Depósito de materiales de oficina y administrativos.',
                'Bodega de materiales de limpieza y mantenimiento.',
                'Área de almacenamiento de materiales diversos.'
            ],
            'Consumible' => [
                'Depósito de material consumible y descartable.',
                'Almacén de insumos de un solo uso para procedimientos.',
                'Bodega de material consumible para servicios médicos.',
                'Área destinada a material descartable y consumibles.'
            ]
        ];

        return $this->faker->optional(0.8)->randomElement($descripciones[$tipo] ?? ['Almacén especializado.']);
    }

    /**
     * Generate realistic location.
     */
    private function generateUbicacion(): ?string
    {
        $ubicaciones = [
            'Planta Baja - Ala Este',
            'Primer Piso - Sección Norte',
            'Segundo Piso - Zona Central',
            'Tercer Piso - Ala Oeste',
            'Sótano - Área de Almacenamiento',
            'Planta Baja - Zona Sur',
            'Primer Piso - Área Central',
            'Segundo Piso - Sección Este',
            'Edificio Anexo - Planta Baja',
            'Torre B - Primer Piso',
            'Módulo C - Segundo Nivel',
            'Área Externa - Bodega Principal'
        ];

        return $this->faker->optional(0.9)->randomElement($ubicaciones);
    }

    /**
     * Generate capacity based on type.
     */
    private function generateCapacidad(string $tipo): ?float
    {
        if ($this->faker->boolean(30)) { // 30% sin capacidad definida
            return null;
        }

        $rangos = [
            'Servicio' => [10, 50],       // Número de personas/consultorios
            'Insumo' => [500, 5000],      // Unidades
            'Medicamento' => [1000, 10000], // Unidades
            'Equipo' => [20, 200],        // Equipos
            'Material' => [100, 2000],    // Unidades/Kg
            'Consumible' => [1000, 15000] // Unidades
        ];

        $rango = $rangos[$tipo] ?? [100, 1000];
        return $this->faker->randomFloat(2, $rango[0], $rango[1]);
    }

    /**
     * Generate unit of measurement based on type.
     */
    private function generateUnidadMedida(string $tipo): ?string
    {
        $unidades = [
            'Servicio' => ['unidades', 'm²'],
            'Insumo' => ['unidades', 'cajas', 'paquetes'],
            'Medicamento' => ['unidades', 'cajas', 'frascos'],
            'Equipo' => ['unidades', 'm²'],
            'Material' => ['unidades', 'kg', 'cajas'],
            'Consumible' => ['unidades', 'paquetes', 'cajas']
        ];

        $opciones = $unidades[$tipo] ?? ['unidades'];
        return $this->faker->randomElement($opciones);
    }

    /**
     * Generate email based on type.
     */
    private function generateEmail(string $tipo): ?string
    {
        // Solo ciertos tipos tienen email
        $tiposConEmail = ['Servicio', 'Equipo'];
        
        if (!in_array($tipo, $tiposConEmail)) {
            return $this->faker->optional(0.2)->email(); // Probabilidad baja para otros tipos
        }

        return $this->faker->optional(0.8)->email();
    }

    /**
     * Estado activo.
     */
    public function activo(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'Estado' => 'Activo',
                'Cod_Estado' => 'A',
            ];
        });
    }

    /**
     * Estado inactivo.
     */
    public function inactivo(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'Estado' => 'Inactivo',
                'Cod_Estado' => 'I',
            ];
        });
    }

    /**
     * Con capacidad definida.
     */
    public function conCapacidad(): static
    {
        return $this->state(function (array $attributes) {
            $tipo = $attributes['Tipo'] ?? 'Material';
            return [
                'Capacidad_Max' => $this->generateCapacidad($tipo),
                'Unidad_Medida' => $this->generateUnidadMedida($tipo),
            ];
        });
    }

    /**
     * Sin capacidad definida.
     */
    public function sinCapacidad(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'Capacidad_Max' => null,
                'Unidad_Medida' => null,
            ];
        });
    }

    /**
     * Para un tipo específico.
     */
    public function tipo(string $tipo): static
    {
        return $this->state(function (array $attributes) use ($tipo) {
            return [
                'Tipo' => $tipo,
                'Nom_Almacen' => $this->generateNombreAlmacen($tipo),
                'Descripcion' => $this->generateDescripcion($tipo),
                'Capacidad_Max' => $this->generateCapacidad($tipo),
                'Unidad_Medida' => $this->generateUnidadMedida($tipo),
                'Email' => $this->generateEmail($tipo),
            ];
        });
    }

    /**
     * Para una sucursal específica.
     */
    public function sucursal(int $sucursalId): static
    {
        return $this->state(function (array $attributes) use ($sucursalId) {
            return [
                'FkSucursal' => $sucursalId,
            ];
        });
    }

    /**
     * Con responsable específico.
     */
    public function responsable(string $responsable): static
    {
        return $this->state(function (array $attributes) use ($responsable) {
            return [
                'Responsable' => $responsable,
            ];
        });
    }

    /**
     * Con contacto completo.
     */
    public function conContacto(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'Telefono' => $this->faker->phoneNumber(),
                'Email' => $this->faker->email(),
            ];
        });
    }
} 