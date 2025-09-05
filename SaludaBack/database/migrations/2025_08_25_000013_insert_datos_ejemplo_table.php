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
        // Insertar especialidades de ejemplo
        DB::table('especialidades')->insert([
            [
                'Nombre_Especialidad' => 'Cardiología',
                'Descripcion' => 'Especialidad médica que se encarga del diagnóstico y tratamiento de las enfermedades del corazón',
                'Color_Calendario' => '#e74c3c',
                'Estatus_Especialidad' => 'Activa',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Especialidad' => 'Dermatología',
                'Descripcion' => 'Especialidad médica que se encarga del diagnóstico y tratamiento de las enfermedades de la piel',
                'Color_Calendario' => '#f39c12',
                'Estatus_Especialidad' => 'Activa',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Especialidad' => 'Ginecología',
                'Descripcion' => 'Especialidad médica que se encarga de la salud reproductiva de la mujer',
                'Color_Calendario' => '#9b59b6',
                'Estatus_Especialidad' => 'Activa',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Especialidad' => 'Pediatría',
                'Descripcion' => 'Especialidad médica que se encarga del cuidado de la salud de los niños',
                'Color_Calendario' => '#3498db',
                'Estatus_Especialidad' => 'Activa',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Especialidad' => 'Ortopedia',
                'Descripcion' => 'Especialidad médica que se encarga del sistema musculoesquelético',
                'Color_Calendario' => '#2ecc71',
                'Estatus_Especialidad' => 'Activa',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);

        // Insertar sucursales de ejemplo
        DB::table('sucursales_mejoradas')->insert([
            [
                'Nombre_Sucursal' => 'Sucursal Centro',
                'Direccion' => 'Av. Principal 123, Centro',
                'Telefono' => '555-0101',
                'Correo' => 'centro@saludareact.com',
                'Horario_Apertura' => '08:00:00',
                'Horario_Cierre' => '18:00:00',
                'Estatus' => 'Activa',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Sucursal' => 'Sucursal Norte',
                'Direccion' => 'Blvd. Norte 456, Zona Norte',
                'Telefono' => '555-0202',
                'Correo' => 'norte@saludareact.com',
                'Horario_Apertura' => '08:00:00',
                'Horario_Cierre' => '18:00:00',
                'Estatus' => 'Activa',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Sucursal' => 'Sucursal Sur',
                'Direccion' => 'Calle Sur 789, Zona Sur',
                'Telefono' => '555-0303',
                'Correo' => 'sur@saludareact.com',
                'Horario_Apertura' => '08:00:00',
                'Horario_Cierre' => '18:00:00',
                'Estatus' => 'Activa',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);

        // Insertar consultorios de ejemplo
        DB::table('consultorios_mejorados')->insert([
            [
                'Nombre_Consultorio' => 'Consultorio A',
                'Numero_Consultorio' => 'A-101',
                'Fk_Sucursal' => 1,
                'Capacidad' => 1,
                'Estatus' => 'Disponible',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Consultorio' => 'Consultorio B',
                'Numero_Consultorio' => 'A-102',
                'Fk_Sucursal' => 1,
                'Capacidad' => 1,
                'Estatus' => 'Disponible',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Consultorio' => 'Consultorio C',
                'Numero_Consultorio' => 'B-201',
                'Fk_Sucursal' => 2,
                'Capacidad' => 1,
                'Estatus' => 'Disponible',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'Nombre_Consultorio' => 'Consultorio D',
                'Numero_Consultorio' => 'C-301',
                'Fk_Sucursal' => 3,
                'Capacidad' => 1,
                'Estatus' => 'Disponible',
                'ID_H_O_D' => 'HOD001',
                'Agregado_Por' => 'Sistema',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar datos de ejemplo
        DB::table('consultorios_mejorados')->where('ID_H_O_D', 'HOD001')->delete();
        DB::table('sucursales_mejoradas')->where('ID_H_O_D', 'HOD001')->delete();
        DB::table('especialidades')->where('ID_H_O_D', 'HOD001')->delete();
    }
};
