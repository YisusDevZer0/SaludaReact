<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

echo "🚀 Completando poblamiento de datos faltantes...\n\n";

$faker = Faker::create('es_ES');

// PROVEEDORES
echo "🏢 Creando proveedores...\n";
$proveedoresExistentes = DB::table('proveedores')->count();
if ($proveedoresExistentes == 0) {
    for ($i = 1; $i <= 500; $i++) {
        DB::table('proveedores')->insert([
            'id' => $i,
            'codigo' => 'PROV' . str_pad($i, 6, '0', STR_PAD_LEFT),
            'nombre' => $faker->company(),
            'razon_social' => $faker->company() . ' S.A.',
            'cuit' => $faker->unique()->numerify('##-########-#'),
            'telefono' => $faker->phoneNumber(),
            'email' => $faker->safeEmail(),
            'direccion' => $faker->address(),
            'ciudad' => $faker->city(),
            'provincia' => $faker->state(),
            'codigo_postal' => $faker->postcode(),
            'pais' => 'Argentina',
            'contacto_nombre' => $faker->name(),
            'contacto_telefono' => $faker->phoneNumber(),
            'contacto_email' => $faker->safeEmail(),
            'condiciones_pago' => $faker->randomElement(['contado', '30 días', '60 días', '90 días']),
            'limite_credito' => $faker->randomFloat(2, 10000, 500000),
            'saldo_credito' => $faker->randomFloat(2, 0, 100000),
            'categoria' => $faker->randomElement(['farmacéutico', 'médico', 'cosmético', 'equipamiento', 'insumos']),
            'estado' => $faker->randomElement(['activo', 'inactivo', 'suspendido']),
            'observaciones' => $faker->optional(0.4)->sentence(),
            'created_at' => $faker->dateTimeBetween('-2 years', 'now'),
            'updated_at' => now(),
        ]);
    }
    echo "✅ 500 proveedores creados\n";
} else {
    echo "✅ Proveedores ya existen (" . $proveedoresExistentes . " registros)\n";
}

// PACIENTES
echo "🏥 Creando pacientes...\n";
$pacientesExistentes = DB::table('pacientes')->count();
if ($pacientesExistentes == 0) {
    for ($i = 1; $i <= 5000; $i++) {
        $fechaNacimiento = $faker->date('Y-m-d', '-18 years');
        $edad = date_diff(date_create($fechaNacimiento), date_create('today'))->y;
        
        DB::table('pacientes')->insert([
            'Paciente_ID' => $i,
            'nombre' => $faker->firstName(),
            'apellido' => $faker->lastName(),
            'fecha_nacimiento' => $fechaNacimiento,
            'edad' => $edad,
            'genero' => $faker->randomElement(['masculino', 'femenino']),
            'dni' => $faker->unique()->numerify('########'),
            'telefono' => $faker->phoneNumber(),
            'email' => $faker->optional(0.7)->safeEmail(),
            'direccion' => $faker->address(),
            'ciudad' => $faker->city(),
            'provincia' => $faker->state(),
            'codigo_postal' => $faker->postcode(),
            'pais' => 'Argentina',
            'estado_civil' => $faker->randomElement(['soltero', 'casado', 'divorciado', 'viudo']),
            'ocupacion' => $faker->jobTitle(),
            'empresa' => $faker->optional(0.4)->company(),
            'telefono_trabajo' => $faker->optional(0.3)->phoneNumber(),
            'emergencia_contacto' => $faker->name(),
            'emergencia_telefono' => $faker->phoneNumber(),
            'emergencia_parentesco' => $faker->randomElement(['esposo', 'esposa', 'hijo', 'hija', 'padre', 'madre', 'hermano', 'hermana']),
            'grupo_sanguineo' => $faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            'alergias' => $faker->optional(0.3)->sentence(),
            'medicamentos_actuales' => $faker->optional(0.4)->sentence(),
            'antecedentes_medicos' => $faker->optional(0.5)->sentence(),
            'observaciones' => $faker->optional(0.6)->sentence(),
            'estado' => $faker->randomElement(['activo', 'inactivo']),
            'fecha_registro' => $faker->dateTimeBetween('-2 years', 'now'),
            'created_at' => $faker->dateTimeBetween('-2 years', 'now'),
            'updated_at' => now(),
        ]);
    }
    echo "✅ 5000 pacientes creados\n";
} else {
    echo "✅ Pacientes ya existen (" . $pacientesExistentes . " registros)\n";
}

// PRODUCTOS
echo "💊 Creando productos...\n";
$productosExistentes = DB::table('productos')->count();
if ($productosExistentes == 0) {
    $categorias = ['Analgésicos', 'Antibióticos', 'Antiinflamatorios', 'Antihistamínicos', 'Antipiréticos', 'Antitusivos', 'Expectorantes', 'Laxantes', 'Antieméticos', 'Antidiabéticos', 'Antihipertensivos', 'Anticoagulantes', 'Vitaminas', 'Minerales', 'Suplementos', 'Productos de higiene', 'Material médico', 'Equipos', 'Insumos', 'Cosméticos'];
    $presentaciones = ['Comprimidos', 'Cápsulas', 'Jarabe', 'Suspensión', 'Inyectable', 'Cremas', 'Ungüentos', 'Geles', 'Parches', 'Supositorios', 'Gotas', 'Spray', 'Inhalador', 'Polvo', 'Líquido'];

    for ($i = 1; $i <= 3000; $i++) {
        $categoria = $faker->randomElement($categorias);
        $presentacion = $faker->randomElement($presentaciones);
        $requiereReceta = $faker->boolean(30);
        
        DB::table('productos')->insert([
            'Producto_ID' => $i,
            'codigo' => 'PROD' . str_pad($i, 6, '0', STR_PAD_LEFT),
            'nombre' => $faker->unique()->words(3, true) . ' ' . $presentacion,
            'descripcion' => $faker->sentence(),
            'categoria' => $categoria,
            'presentacion' => $presentacion,
            'concentracion' => $faker->randomElement(['500mg', '1000mg', '250mg', '10mg', '5mg', '20mg', '50mg']),
            'laboratorio' => $faker->company(),
            'codigo_barras' => $faker->unique()->ean13(),
            'precio_venta' => $faker->randomFloat(2, 10, 5000),
            'precio_compra' => $faker->randomFloat(2, 5, 3000),
            'stock_minimo' => $faker->numberBetween(10, 100),
            'stock_maximo' => $faker->numberBetween(500, 2000),
            'stock_actual' => $faker->numberBetween(0, 1000),
            'unidad_medida' => $faker->randomElement(['unidad', 'caja', 'frasco', 'ampolla', 'tubo']),
            'requiere_receta' => $requiereReceta,
            'vencimiento' => $faker->date('Y-m-d', '+2 years'),
            'lote' => $faker->bothify('LOT-####-####'),
            'registro_sanitario' => $faker->bothify('RS-####-####'),
            'estado' => $faker->randomElement(['activo', 'inactivo', 'discontinuado']),
            'observaciones' => $faker->optional(0.4)->sentence(),
            'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ]);
    }
    echo "✅ 3000 productos creados\n";
} else {
    echo "✅ Productos ya existen (" . $productosExistentes . " registros)\n";
}

// VENTAS
echo "💰 Creando ventas...\n";
$ventasExistentes = DB::table('ventas')->count();
if ($ventasExistentes == 0) {
    for ($i = 1; $i <= 10000; $i++) {
        $fechaVenta = $faker->dateTimeBetween('-1 year', 'now');
        $clienteId = $faker->numberBetween(1, 510); // Usar el número real de clientes
        $vendedorId = $faker->numberBetween(1, 252); // Usar el número real de personal
        $sucursalId = $faker->numberBetween(1, 10);
        $metodoPago = $faker->randomElement(['efectivo', 'tarjeta', 'transferencia', 'cheque']);
        
        DB::table('ventas')->insert([
            'Venta_ID' => $i,
            'numero_venta' => 'VENT-' . str_pad($i, 8, '0', STR_PAD_LEFT),
            'cliente_id' => $clienteId,
            'vendedor_id' => $vendedorId,
            'sucursal_id' => $sucursalId,
            'fecha_venta' => $fechaVenta,
            'hora_venta' => $faker->time(),
            'subtotal' => $faker->randomFloat(2, 100, 50000),
            'descuento' => $faker->randomFloat(2, 0, 5000),
            'iva' => $faker->randomFloat(2, 0, 10000),
            'total' => $faker->randomFloat(2, 100, 60000),
            'metodo_pago' => $metodoPago,
            'estado' => $faker->randomElement(['completada', 'pendiente', 'cancelada']),
            'observaciones' => $faker->optional(0.3)->sentence(),
            'created_at' => $fechaVenta,
            'updated_at' => now(),
        ]);
    }
    echo "✅ 10000 ventas creadas\n";
} else {
    echo "✅ Ventas ya existen (" . $ventasExistentes . " registros)\n";
}

echo "\n🎉 ¡Poblamiento completado exitosamente!\n";
echo "📊 Resumen final:\n";
echo "   - Sucursales: " . DB::table('sucursales')->count() . "\n";
echo "   - Personal: " . DB::table('personal_pos')->count() . "\n";
echo "   - Clientes: " . DB::table('clientes')->count() . "\n";
echo "   - Proveedores: " . DB::table('proveedores')->count() . "\n";
echo "   - Pacientes: " . DB::table('pacientes')->count() . "\n";
echo "   - Productos: " . DB::table('productos')->count() . "\n";
echo "   - Ventas: " . DB::table('ventas')->count() . "\n";
echo "\n👤 Tu usuario administrador: jesusemutul@gmail.com / 150518Wen\n";
echo "🔑 Credenciales de acceso:\n";
echo "   Email: jesusemutul@gmail.com\n";
echo "   Contraseña: 150518Wen\n";
echo "   Sucursal: Sucursal Central (ID: 1)\n"; 