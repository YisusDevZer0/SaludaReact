<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Marca;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Marca>
 */
class MarcaFactory extends Factory
{
    protected $model = Marca::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $marcasMedicas = [
            'Abbott',
            'Bayer',
            'Johnson & Johnson',
            'Pfizer',
            'Novartis',
            'Roche',
            'Merck',
            'GlaxoSmithKline',
            'Sanofi',
            'AstraZeneca',
            'Bristol Myers Squibb',
            'Eli Lilly',
            'Amgen',
            'Gilead Sciences',
            'Biogen',
            'Regeneron',
            'Moderna',
            'BioNTech',
            'Siemens Healthineers',
            'Philips Healthcare',
            'GE Healthcare',
            'Medtronic',
            'Boston Scientific',
            'Stryker',
            'Zimmer Biomet',
            'Edwards Lifesciences',
            'Danaher',
            'Thermo Fisher Scientific',
            'Becton Dickinson',
            'Cardinal Health'
        ];

        $paisesOrigen = [
            'Estados Unidos',
            'Alemania',
            'Suiza',
            'Reino Unido',
            'Francia',
            'Japón',
            'Holanda',
            'Dinamarca',
            'Bélgica',
            'Irlanda',
            'Suecia',
            'España',
            'Italia',
            'Canadá',
            'Australia'
        ];

        $sistemas = ['POS', 'HOSPITALARIO', 'FARMACIA', 'LABORATORIO'];
        $organizaciones = ['Saluda', 'Hospital Central', 'Clínica del Norte', 'Centro Médico'];
        $agregadoPor = ['Dr. García', 'Dr. Martínez', 'Dr. López', 'Lic. Rodríguez', 'Sistema'];

        $nombreMarca = $this->faker->randomElement($marcasMedicas);
        $paisOrigen = $this->faker->randomElement($paisesOrigen);
        $tieneSitioWeb = $this->faker->boolean(85); // 85% tienen sitio web
        $tieneLogo = $this->faker->boolean(70); // 70% tienen logo

        $descripciones = [
            'Líder mundial en productos farmacéuticos y dispositivos médicos',
            'Innovación en soluciones de salud y bienestar',
            'Empresa farmacéutica dedicada a mejorar la vida de los pacientes',
            'Tecnología médica avanzada para diagnóstico y tratamiento',
            'Productos de alta calidad para el cuidado de la salud',
            'Investigación y desarrollo en biotecnología médica',
            'Soluciones integrales para hospitales y clínicas',
            'Especialistas en equipos de diagnóstico por imágenes',
            'Fabricante de dispositivos médicos innovadores',
            'Empresa líder en productos farmacéuticos especializados'
        ];

        return [
            'Nom_Marca' => $nombreMarca,
            'Estado' => $this->faker->randomElement(['Activo', 'Inactivo']),
            'Cod_Estado' => function (array $attributes) {
                return $attributes['Estado'] === 'Activo' ? 'A' : 'I';
            },
            'Agregado_Por' => $this->faker->randomElement($agregadoPor),
            'Agregadoel' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'Sistema' => $this->faker->randomElement($sistemas),
            'ID_H_O_D' => $this->faker->randomElement($organizaciones),
            'Descripcion' => $this->faker->randomElement($descripciones),
            'Pais_Origen' => $paisOrigen,
            'Sitio_Web' => $tieneSitioWeb ? 
                'https://www.' . strtolower(str_replace([' ', '&'], ['', 'and'], $nombreMarca)) . '.com' : 
                null,
            'Logo_URL' => $tieneLogo ? 
                'https://ejemplo.com/logos/' . strtolower(str_replace([' ', '&'], ['-', 'and'], $nombreMarca)) . '.png' : 
                null,
        ];
    }

    /**
     * Indicate that the brand is active.
     */
    public function activa(): static
    {
        return $this->state(fn (array $attributes) => [
            'Estado' => 'Activo',
            'Cod_Estado' => 'A',
        ]);
    }

    /**
     * Indicate that the brand is inactive.
     */
    public function inactiva(): static
    {
        return $this->state(fn (array $attributes) => [
            'Estado' => 'Inactivo',
            'Cod_Estado' => 'I',
        ]);
    }

    /**
     * Indicate that the brand has a website.
     */
    public function conSitioWeb(): static
    {
        return $this->state(fn (array $attributes) => [
            'Sitio_Web' => 'https://www.' . strtolower(str_replace([' ', '&'], ['', 'and'], $attributes['Nom_Marca'])) . '.com',
        ]);
    }

    /**
     * Indicate that the brand has a logo.
     */
    public function conLogo(): static
    {
        return $this->state(fn (array $attributes) => [
            'Logo_URL' => 'https://ejemplo.com/logos/' . strtolower(str_replace([' ', '&'], ['-', 'and'], $attributes['Nom_Marca'])) . '.png',
        ]);
    }

    /**
     * Indicate that the brand is from a specific country.
     */
    public function dePais(string $pais): static
    {
        return $this->state(fn (array $attributes) => [
            'Pais_Origen' => $pais,
        ]);
    }

    /**
     * Indicate that the brand is for a specific system.
     */
    public function paraSistema(string $sistema): static
    {
        return $this->state(fn (array $attributes) => [
            'Sistema' => $sistema,
        ]);
    }

    /**
     * Indicate that the brand is pharmaceutical.
     */
    public function farmaceutica(): static
    {
        return $this->state(fn (array $attributes) => [
            'Sistema' => 'FARMACIA',
            'Descripcion' => 'Empresa farmacéutica especializada en investigación y desarrollo de medicamentos innovadores',
        ]);
    }

    /**
     * Indicate that the brand is for medical equipment.
     */
    public function equipoMedico(): static
    {
        return $this->state(fn (array $attributes) => [
            'Sistema' => 'HOSPITALARIO',
            'Descripcion' => 'Fabricante de equipos médicos y tecnología hospitalaria de vanguardia',
        ]);
    }
} 