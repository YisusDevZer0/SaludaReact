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
        // Insertar datos de ejemplo en especialistas
        $especialistas = [
            [
                'Nombre_Completo' => 'Dr. Juan Carlos Pérez González',
                'Cedula_Profesional' => 'ESP001',
                'Fk_Especialidad' => 1, // Medicina General
                'Telefono' => '099-123-4567',
                'Correo_Electronico' => 'juan.perez.esp1@clinica.com',
                'Fecha_Nacimiento' => '1980-05-15',
                'Genero' => 'Masculino',
                'Estatus' => 'Activo',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Completo' => 'Dra. María Elena González Rodríguez',
                'Cedula_Profesional' => 'ESP002',
                'Fk_Especialidad' => 2, // Cardiología
                'Telefono' => '099-234-5678',
                'Correo_Electronico' => 'maria.gonzalez.esp2@clinica.com',
                'Fecha_Nacimiento' => '1975-08-22',
                'Genero' => 'Femenino',
                'Estatus' => 'Activo',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Completo' => 'Dr. Carlos Alberto Rodríguez Silva',
                'Cedula_Profesional' => 'ESP003',
                'Fk_Especialidad' => 3, // Pediatría
                'Telefono' => '099-345-6789',
                'Correo_Electronico' => 'carlos.rodriguez.esp3@clinica.com',
                'Fecha_Nacimiento' => '1982-03-10',
                'Genero' => 'Masculino',
                'Estatus' => 'Activo',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Completo' => 'Dra. Ana Lucía López Martínez',
                'Cedula_Profesional' => 'ESP004',
                'Fk_Especialidad' => 4, // Ginecología
                'Telefono' => '099-456-7890',
                'Correo_Electronico' => 'ana.lopez@clinica.com',
                'Fecha_Nacimiento' => '1978-11-05',
                'Genero' => 'Femenino',
                'Estatus' => 'Activo',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Completo' => 'Dr. Roberto Carlos Silva Pérez',
                'Cedula_Profesional' => 'ESP005',
                'Fk_Especialidad' => 5, // Ortopedia
                'Telefono' => '099-567-8901',
                'Correo_Electronico' => 'roberto.silva@clinica.com',
                'Fecha_Nacimiento' => '1970-07-18',
                'Genero' => 'Masculino',
                'Estatus' => 'Activo',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($especialistas as $especialista) {
            DB::table('especialistas')->insert($especialista);
        }

        // Insertar datos de ejemplo en pacientes_mejorados
        $pacientes_mejorados = [
            [
                'Nombre' => 'María Fernanda',
                'Apellido' => 'González López',
                'Fecha_Nacimiento' => '1985-03-15',
                'Genero' => 'Femenino',
                'Telefono' => '099-666-6666',
                'Correo_Electronico' => 'maria.gonzalez@email.com',
                'Direccion' => 'Av. Principal 456, Centro, Guayaquil',
                'Tipo_Sangre' => 'O+',
                'Alergias' => 'Penicilina, polen',
                'Antecedentes_Medicos' => 'Hipertensión arterial, diabetes tipo 2',
                'Estatus' => 'Activo',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre' => 'Luis Alberto',
                'Apellido' => 'Rodríguez Pérez',
                'Fecha_Nacimiento' => '1978-07-22',
                'Genero' => 'Masculino',
                'Telefono' => '099-888-8888',
                'Correo_Electronico' => 'luis.rodriguez@email.com',
                'Direccion' => 'Av. Norte 789, La Florida, Guayaquil',
                'Tipo_Sangre' => 'A+',
                'Alergias' => 'Ninguna conocida',
                'Antecedentes_Medicos' => 'Hypercolesterolemia',
                'Estatus' => 'Activo',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre' => 'Carmen Elena',
                'Apellido' => 'Silva Martínez',
                'Fecha_Nacimiento' => '1992-11-08',
                'Genero' => 'Femenino',
                'Telefono' => '099-000-0000',
                'Correo_Electronico' => 'carmen.silva@email.com',
                'Direccion' => 'Av. Sur 123, Urdesa, Guayaquil',
                'Tipo_Sangre' => 'B+',
                'Alergias' => 'Látex, mariscos',
                'Antecedentes_Medicos' => 'Asma bronquial',
                'Estatus' => 'Activo',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre' => 'Roberto Carlos',
                'Apellido' => 'Pérez Silva',
                'Fecha_Nacimiento' => '1965-05-12',
                'Genero' => 'Masculino',
                'Telefono' => '099-222-1111',
                'Correo_Electronico' => 'roberto.perez@email.com',
                'Direccion' => 'Av. Principal 789, Centro, Guayaquil',
                'Tipo_Sangre' => 'AB+',
                'Alergias' => 'Sulfamidas',
                'Antecedentes_Medicos' => 'Hipertensión arterial, enfermedad coronaria',
                'Estatus' => 'Activo',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre' => 'Ana María',
                'Apellido' => 'García López',
                'Fecha_Nacimiento' => '1990-09-25',
                'Genero' => 'Femenino',
                'Telefono' => '099-444-3333',
                'Correo_Electronico' => 'ana.garcia@email.com',
                'Direccion' => 'Av. Norte 123, La Florida, Guayaquil',
                'Tipo_Sangre' => 'O-',
                'Alergias' => 'Polvo, ácaros',
                'Antecedentes_Medicos' => 'Rinitis alérgica',
                'Estatus' => 'Activo',
                'ID_H_O_D' => 'HOSP001',
                'Agregado_Por' => 'Sistema',
                'Agregado_El' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($pacientes_mejorados as $paciente) {
            DB::table('pacientes_mejorados')->insert($paciente);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('especialistas')->truncate();
        DB::table('pacientes_mejorados')->truncate();
    }
};
