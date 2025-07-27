<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ComponenteActivoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $licencia = 1; // Valor numérico para Id_Licencia

        $componentes = [
            [
                'nombre' => 'Paracetamol',
                'descripcion' => 'Analgésico y antipirético común',
                'codigo' => 'PARA001',
                'formula_quimica' => 'C8H9NO2',
                'concentracion_estandar' => 500.000,
                'unidad_concentracion' => 'mg',
                'indicaciones' => 'Dolor leve a moderado, fiebre',
                'contraindicaciones' => 'Hipersensibilidad al paracetamol',
                'efectos_secundarios' => 'Náuseas, vómitos, reacciones alérgicas',
                'interacciones' => 'Alcohol, anticoagulantes',
                'activo' => true,
                'Id_Licencia' => $licencia,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Ibuprofeno',
                'descripcion' => 'Antiinflamatorio no esteroideo',
                'codigo' => 'IBUP001',
                'formula_quimica' => 'C13H18O2',
                'concentracion_estandar' => 400.000,
                'unidad_concentracion' => 'mg',
                'indicaciones' => 'Dolor, inflamación, fiebre',
                'contraindicaciones' => 'Úlcera péptica, insuficiencia renal',
                'efectos_secundarios' => 'Gastritis, hemorragia digestiva',
                'interacciones' => 'Anticoagulantes, diuréticos',
                'activo' => true,
                'Id_Licencia' => $licencia,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Amoxicilina',
                'descripcion' => 'Antibiótico de amplio espectro',
                'codigo' => 'AMOX001',
                'formula_quimica' => 'C16H19N3O5S',
                'concentracion_estandar' => 500.000,
                'unidad_concentracion' => 'mg',
                'indicaciones' => 'Infecciones bacterianas',
                'contraindicaciones' => 'Alergia a penicilinas',
                'efectos_secundarios' => 'Diarrea, candidiasis',
                'interacciones' => 'Anticonceptivos orales',
                'activo' => true,
                'Id_Licencia' => $licencia,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Omeprazol',
                'descripcion' => 'Inhibidor de la bomba de protones',
                'codigo' => 'OMEP001',
                'formula_quimica' => 'C17H19N3O3S',
                'concentracion_estandar' => 20.000,
                'unidad_concentracion' => 'mg',
                'indicaciones' => 'Úlcera péptica, reflujo gastroesofágico',
                'contraindicaciones' => 'Hipersensibilidad al omeprazol',
                'efectos_secundarios' => 'Dolor de cabeza, diarrea',
                'interacciones' => 'Anticoagulantes, hierro',
                'activo' => true,
                'Id_Licencia' => $licencia,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Loratadina',
                'descripcion' => 'Antihistamínico de segunda generación',
                'codigo' => 'LORA001',
                'formula_quimica' => 'C22H23ClN2O2',
                'concentracion_estandar' => 10.000,
                'unidad_concentracion' => 'mg',
                'indicaciones' => 'Rinitis alérgica, urticaria',
                'contraindicaciones' => 'Hipersensibilidad a loratadina',
                'efectos_secundarios' => 'Somnolencia, sequedad de boca',
                'interacciones' => 'Eritromicina, ketoconazol',
                'activo' => true,
                'Id_Licencia' => $licencia,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Metformina',
                'descripcion' => 'Antidiabético oral',
                'codigo' => 'METF001',
                'formula_quimica' => 'C4H11N5',
                'concentracion_estandar' => 500.000,
                'unidad_concentracion' => 'mg',
                'indicaciones' => 'Diabetes mellitus tipo 2',
                'contraindicaciones' => 'Insuficiencia renal, acidosis láctica',
                'efectos_secundarios' => 'Náuseas, diarrea, malabsorción de B12',
                'interacciones' => 'Alcohol, contrastes yodados',
                'activo' => true,
                'Id_Licencia' => $licencia,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Losartán',
                'descripcion' => 'Antihipertensivo del grupo de los ARA II',
                'codigo' => 'LOSA001',
                'formula_quimica' => 'C22H23ClN6O',
                'concentracion_estandar' => 50.000,
                'unidad_concentracion' => 'mg',
                'indicaciones' => 'Hipertensión arterial, nefropatía diabética',
                'contraindicaciones' => 'Embarazo, estenosis bilateral de arterias renales',
                'efectos_secundarios' => 'Mareos, hiperpotasemia',
                'interacciones' => 'AINEs, diuréticos ahorradores de potasio',
                'activo' => true,
                'Id_Licencia' => $licencia,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Atorvastatina',
                'descripcion' => 'Estatinas para el control del colesterol',
                'codigo' => 'ATOR001',
                'formula_quimica' => 'C33H35FN2O5',
                'concentracion_estandar' => 20.000,
                'unidad_concentracion' => 'mg',
                'indicaciones' => 'Hipercolesterolemia, prevención cardiovascular',
                'contraindicaciones' => 'Enfermedad hepática activa, embarazo',
                'efectos_secundarios' => 'Mialgias, elevación de transaminasas',
                'interacciones' => 'Ciclosporina, gemfibrozilo',
                'activo' => true,
                'Id_Licencia' => $licencia,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Aspirina',
                'descripcion' => 'Ácido acetilsalicílico para prevención cardiovascular',
                'codigo' => 'ASPI001',
                'formula_quimica' => 'C9H8O4',
                'concentracion_estandar' => 100.000,
                'unidad_concentracion' => 'mg',
                'indicaciones' => 'Prevención de eventos cardiovasculares',
                'contraindicaciones' => 'Úlcera péptica activa, hemorragia',
                'efectos_secundarios' => 'Gastritis, hemorragia digestiva',
                'interacciones' => 'Anticoagulantes, otros AINEs',
                'activo' => true,
                'Id_Licencia' => $licencia,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nombre' => 'Diclofenaco',
                'descripcion' => 'Antiinflamatorio no esteroideo',
                'codigo' => 'DICL001',
                'formula_quimica' => 'C14H11Cl2NO2',
                'concentracion_estandar' => 50.000,
                'unidad_concentracion' => 'mg',
                'indicaciones' => 'Dolor e inflamación',
                'contraindicaciones' => 'Úlcera péptica, insuficiencia renal',
                'efectos_secundarios' => 'Gastritis, elevación de transaminasas',
                'interacciones' => 'Anticoagulantes, diuréticos',
                'activo' => true,
                'Id_Licencia' => $licencia,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($componentes as $componente) {
            DB::table('componentes_activos')->insert($componente);
        }

        $this->command->info('Componentes activos sembrados exitosamente!');
    }
} 