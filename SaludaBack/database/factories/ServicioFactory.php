<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Servicio;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Servicio>
 */
class ServicioFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Servicio::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $serviciosSistema = [
            'Consulta Médica General',
            'Consulta Especializada',
            'Examen de Laboratorio',
            'Radiografía',
            'Ecografía',
            'Electrocardiograma',
            'Fisioterapia',
            'Odontología General',
            'Oftalmología',
            'Dermatología',
            'Ginecología',
            'Pediatría',
            'Psicología',
            'Nutrición',
            'Cardiología'
        ];

        $serviciosPersonalizados = [
            'Terapia de Rehabilitación',
            'Consulta de Emergencia',
            'Examen Preventivo',
            'Vacunación',
            'Control Prenatal',
            'Consulta Geriátrica',
            'Medicina Deportiva',
            'Alergología',
            'Endocrinología',
            'Neurología',
            'Ortopedia',
            'Urología',
            'Gastroenterología',
            'Neumología',
            'Hematología'
        ];

        $esSistema = $this->faker->boolean(30); // 30% probabilidad de ser sistema
        $servicios = $esSistema ? $serviciosSistema : $serviciosPersonalizados;
        $nombre = $this->faker->randomElement($servicios);

        return [
            'Nom_Serv' => $nombre,
            'Estado' => $this->faker->randomElement(['Activo', 'Inactivo']),
            'Cod_Estado' => function (array $attributes) {
                return $attributes['Estado'] === 'Activo' ? 'A' : 'I';
            },
            'Agregado_Por' => $this->faker->name(),
            'Agregadoel' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'Sistema' => $esSistema,
            'ID_H_O_D' => $this->faker->numberBetween(1, 5),
            'created_at' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'updated_at' => function (array $attributes) {
                return $attributes['created_at'];
            }
        ];
    }

    /**
     * Indicate that the servicio is active.
     */
    public function activo(): static
    {
        return $this->state(fn (array $attributes) => [
            'Estado' => 'Activo',
            'Cod_Estado' => 'A',
        ]);
    }

    /**
     * Indicate that the servicio is inactive.
     */
    public function inactivo(): static
    {
        return $this->state(fn (array $attributes) => [
            'Estado' => 'Inactivo',
            'Cod_Estado' => 'I',
        ]);
    }

    /**
     * Indicate that the servicio is from system.
     */
    public function sistema(): static
    {
        return $this->state(fn (array $attributes) => [
            'Sistema' => true,
        ]);
    }

    /**
     * Indicate that the servicio is custom.
     */
    public function personalizado(): static
    {
        return $this->state(fn (array $attributes) => [
            'Sistema' => false,
        ]);
    }

    /**
     * Indicate that the servicio is for a specific organization.
     */
    public function paraOrganizacion(int $organizacionId): static
    {
        return $this->state(fn (array $attributes) => [
            'ID_H_O_D' => $organizacionId,
        ]);
    }

    /**
     * Create a servicio with specific name.
     */
    public function conNombre(string $nombre): static
    {
        return $this->state(fn (array $attributes) => [
            'Nom_Serv' => $nombre,
        ]);
    }

    /**
     * Create servicios for medical specialties.
     */
    public function especialidadMedica(): static
    {
        $especialidades = [
            'Cardiología',
            'Dermatología',
            'Endocrinología',
            'Gastroenterología',
            'Ginecología',
            'Neurología',
            'Oftalmología',
            'Ortopedia',
            'Pediatría',
            'Psiquiatría',
            'Radiología',
            'Urología'
        ];

        return $this->state(fn (array $attributes) => [
            'Nom_Serv' => $this->faker->randomElement($especialidades),
            'Sistema' => true,
            'Estado' => 'Activo',
            'Cod_Estado' => 'A'
        ]);
    }

    /**
     * Create servicios for laboratory tests.
     */
    public function examenLaboratorio(): static
    {
        $examenes = [
            'Hemograma Completo',
            'Glicemia en Ayunas',
            'Perfil Lipídico',
            'Creatinina',
            'Ácido Úrico',
            'TSH',
            'T4 Libre',
            'PSA',
            'Orina Completa',
            'Cultivo de Orina',
            'Radiografía de Tórax',
            'Electrocardiograma'
        ];

        return $this->state(fn (array $attributes) => [
            'Nom_Serv' => $this->faker->randomElement($examenes),
            'Sistema' => true,
            'Estado' => 'Activo',
            'Cod_Estado' => 'A'
        ]);
    }

    /**
     * Create servicios for therapy.
     */
    public function terapia(): static
    {
        $terapias = [
            'Fisioterapia',
            'Terapia Ocupacional',
            'Terapia del Lenguaje',
            'Psicoterapia',
            'Terapia Respiratoria',
            'Hidroterapia',
            'Electroterapia',
            'Terapia Manual',
            'Punción Seca',
            'Vendaje Funcional'
        ];

        return $this->state(fn (array $attributes) => [
            'Nom_Serv' => $this->faker->randomElement($terapias),
            'Sistema' => false,
            'Estado' => 'Activo',
            'Cod_Estado' => 'A'
        ]);
    }
}
