<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Servicio;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Servicio>
 */
class ServicioFactory extends Factory
{
    protected $model = Servicio::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $serviciosMedicos = [
            'Consulta General',
            'Consulta de Especialidad',
            'Laboratorio Clínico',
            'Radiología',
            'Ultrasonido',
            'Tomografía',
            'Resonancia Magnética',
            'Electrocardiograma',
            'Endoscopia',
            'Colonoscopia',
            'Ecocardiograma',
            'Mamografía',
            'Densitometría Ósea',
            'Pruebas de Esfuerzo',
            'Holter',
            'Cirugía Menor',
            'Cirugía Mayor',
            'Hospitalización',
            'Urgencias',
            'Medicina Preventiva',
            'Vacunación',
            'Fisioterapia',
            'Rehabilitación',
            'Nutrición',
            'Psicología',
            'Psiquiatría',
            'Oftalmología',
            'Dermatología',
            'Cardiología',
            'Neurología'
        ];

        $descripcionesMedicas = [
            'Evaluación médica completa y diagnóstico inicial',
            'Consulta especializada para tratamiento específico',
            'Análisis clínicos y estudios de laboratorio',
            'Estudios radiológicos para diagnóstico por imagen',
            'Evaluación no invasiva mediante ultrasonido',
            'Diagnóstico avanzado por tomografía computarizada',
            'Estudio detallado mediante resonancia magnética',
            'Evaluación de la actividad eléctrica del corazón',
            'Procedimiento endoscópico para diagnóstico interno',
            'Evaluación del colon mediante colonoscopia',
        ];

        $sistemas = ['POS', 'HOSPITALARIO', 'AMBULATORIO', 'URGENCIAS'];
        $organizaciones = ['Saluda', 'Hospital Central', 'Clínica del Norte', 'Centro Médico'];
        $agregadoPor = ['Dr. García', 'Dr. Martínez', 'Dr. López', 'Dr. Rodríguez', 'Sistema'];

        $nombreServicio = $this->faker->randomElement($serviciosMedicos);
        $requiereCita = $this->faker->boolean(70); // 70% requieren cita
        $tienePrecion = $this->faker->boolean(80); // 80% tienen precio

        return [
            'Nom_Serv' => $nombreServicio,
            'Estado' => $this->faker->randomElement(['Activo', 'Inactivo']),
            'Cod_Estado' => function (array $attributes) {
                return $attributes['Estado'] === 'Activo' ? 'A' : 'I';
            },
            'Agregado_Por' => $this->faker->randomElement($agregadoPor),
            'Agregadoel' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'Sistema' => $this->faker->randomElement($sistemas),
            'ID_H_O_D' => $this->faker->randomElement($organizaciones),
            'Descripcion' => $this->faker->randomElement($descripcionesMedicas),
            'Precio_Base' => $tienePrecion ? $this->faker->randomFloat(2, 50, 2000) : null,
            'Requiere_Cita' => $requiereCita,
        ];
    }

    /**
     * Indicate that the service is active.
     */
    public function activo(): static
    {
        return $this->state(fn (array $attributes) => [
            'Estado' => 'Activo',
            'Cod_Estado' => 'A',
        ]);
    }

    /**
     * Indicate that the service is inactive.
     */
    public function inactivo(): static
    {
        return $this->state(fn (array $attributes) => [
            'Estado' => 'Inactivo',
            'Cod_Estado' => 'I',
        ]);
    }

    /**
     * Indicate that the service requires an appointment.
     */
    public function conCita(): static
    {
        return $this->state(fn (array $attributes) => [
            'Requiere_Cita' => true,
        ]);
    }

    /**
     * Indicate that the service doesn't require an appointment.
     */
    public function sinCita(): static
    {
        return $this->state(fn (array $attributes) => [
            'Requiere_Cita' => false,
        ]);
    }

    /**
     * Indicate that the service has a high price.
     */
    public function caro(): static
    {
        return $this->state(fn (array $attributes) => [
            'Precio_Base' => $this->faker->randomFloat(2, 1000, 5000),
        ]);
    }

    /**
     * Indicate that the service is for a specific system.
     */
    public function paraSistema(string $sistema): static
    {
        return $this->state(fn (array $attributes) => [
            'Sistema' => $sistema,
        ]);
    }

    /**
     * Indicate that the service is for emergency.
     */
    public function urgencia(): static
    {
        return $this->state(fn (array $attributes) => [
            'Sistema' => 'URGENCIAS',
            'Requiere_Cita' => false,
            'Precio_Base' => $this->faker->randomFloat(2, 200, 800),
        ]);
    }
}
