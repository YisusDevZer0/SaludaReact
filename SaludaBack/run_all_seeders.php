<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

echo "🚀 Iniciando poblamiento completo de la base de datos...\n\n";

$faker = Faker::create('es_ES');

// 1. SUCURSALES
echo "📋 Verificando sucursales...\n";
$sucursalesExistentes = DB::table('sucursales')->count();
if ($sucursalesExistentes == 0) {
    $sucursales = [
        ['id' => 1, 'nombre' => 'Sucursal Central', 'codigo' => 'CENTRAL', 'direccion' => 'Av. Principal 123, Centro', 'telefono' => '123456789', 'email' => 'central@saluda.com', 'estado' => 'activo', 'ciudad' => 'Buenos Aires', 'provincia' => 'Buenos Aires'],
        ['id' => 2, 'nombre' => 'Sucursal Norte', 'codigo' => 'NORTE', 'direccion' => 'Calle Norte 456, Zona Norte', 'telefono' => '123456790', 'email' => 'norte@saluda.com', 'estado' => 'activo', 'ciudad' => 'Buenos Aires', 'provincia' => 'Buenos Aires'],
        ['id' => 3, 'nombre' => 'Sucursal Sur', 'codigo' => 'SUR', 'direccion' => 'Av. Sur 789, Zona Sur', 'telefono' => '123456791', 'email' => 'sur@saluda.com', 'estado' => 'activo', 'ciudad' => 'Buenos Aires', 'provincia' => 'Buenos Aires'],
        ['id' => 4, 'nombre' => 'Sucursal Este', 'codigo' => 'ESTE', 'direccion' => 'Calle Este 321, Zona Este', 'telefono' => '123456792', 'email' => 'este@saluda.com', 'estado' => 'activo', 'ciudad' => 'Buenos Aires', 'provincia' => 'Buenos Aires'],
        ['id' => 5, 'nombre' => 'Sucursal Oeste', 'codigo' => 'OESTE', 'direccion' => 'Av. Oeste 654, Zona Oeste', 'telefono' => '123456793', 'email' => 'oeste@saluda.com', 'estado' => 'activo', 'ciudad' => 'Buenos Aires', 'provincia' => 'Buenos Aires'],
    ];

    foreach ($sucursales as $sucursal) {
        DB::table('sucursales')->insert($sucursal + ['created_at' => now(), 'updated_at' => now()]);
    }

    // Crear 5 sucursales adicionales
    for ($i = 6; $i <= 10; $i++) {
        DB::table('sucursales')->insert([
            'id' => $i,
            'nombre' => 'Sucursal ' . $faker->city(),
            'codigo' => 'SUC' . $i,
            'direccion' => $faker->address(),
            'telefono' => $faker->phoneNumber(),
            'email' => $faker->safeEmail(),
            'estado' => $faker->randomElement(['activo', 'inactivo']),
            'ciudad' => $faker->city(),
            'provincia' => $faker->state(),
            'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ]);
    }
    echo "✅ 10 sucursales creadas\n";
} else {
    echo "✅ Sucursales ya existen (" . $sucursalesExistentes . " registros)\n";
}

// 2. PERSONAL POS
echo "👥 Verificando personal...\n";
$personalExistentes = DB::table('personal_pos')->count();
if ($personalExistentes == 0) {
    // Tu usuario administrador
    DB::table('personal_pos')->insert([
        'id' => 1,
        'codigo' => 'ADMIN001',
        'nombre' => 'Jesús Emutul',
        'apellido' => 'Administrador',
        'email' => 'jesusemutul@gmail.com',
        'password' => bcrypt('150518Wen'),
        'telefono' => '123456789',
        'direccion' => 'Dirección del Administrador',
        'fecha_nacimiento' => '1990-01-01',
        'genero' => 'masculino',
        'sucursal_id' => 1,
        'fecha_ingreso' => '2024-01-01',
        'estado_laboral' => 'activo',
        'salario' => 50000.00,
        'is_active' => true,
        'can_login' => true,
        'can_sell' => true,
        'can_refund' => true,
        'can_manage_inventory' => true,
        'can_manage_users' => true,
        'can_view_reports' => true,
        'can_manage_settings' => true,
        'notas' => 'Usuario administrador principal del sistema',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Crear 999 usuarios adicionales
    for ($i = 2; $i <= 1000; $i++) {
        $sucursalId = $faker->numberBetween(1, 10);
        
        DB::table('personal_pos')->insert([
            'id' => $i,
            'codigo' => 'EMP' . str_pad($i, 6, '0', STR_PAD_LEFT),
            'nombre' => $faker->firstName(),
            'apellido' => $faker->lastName(),
            'email' => $faker->unique()->safeEmail(),
            'password' => bcrypt('password123'),
            'telefono' => $faker->phoneNumber(),
            'direccion' => $faker->address(),
            'fecha_nacimiento' => $faker->date('Y-m-d', '-18 years'),
            'genero' => $faker->randomElement(['masculino', 'femenino']),
            'sucursal_id' => $sucursalId,
            'fecha_ingreso' => $faker->date('Y-m-d', '-2 years'),
            'estado_laboral' => $faker->randomElement(['activo', 'inactivo']),
            'salario' => $faker->numberBetween(20000, 80000),
            'is_active' => $faker->boolean(90),
            'can_login' => true,
            'can_sell' => $faker->boolean(80),
            'can_refund' => $faker->boolean(30),
            'can_manage_inventory' => $faker->boolean(20),
            'can_manage_users' => $faker->boolean(10),
            'can_view_reports' => $faker->boolean(60),
            'can_manage_settings' => $faker->boolean(5),
            'notas' => $faker->optional()->sentence(),
            'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ]);
    }
    echo "✅ 1000 usuarios creados (incluyendo tu administrador)\n";
} else {
    echo "✅ Personal ya existe (" . $personalExistentes . " registros)\n";
}

// 3. CLIENTES
echo "👤 Verificando clientes...\n";
$clientesExistentes = DB::table('clientes')->count();
if ($clientesExistentes == 0) {
            for ($i = 1; $i <= 2000; $i++) {
            DB::table('clientes')->insert([
                'id' => $i,
                'codigo' => 'CLI' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'nombre' => $faker->firstName(),
                'apellido' => $faker->lastName(),
                'dni' => $faker->unique()->numerify('########'),
                'telefono' => $faker->phoneNumber(),
                'email' => $faker->optional(0.7)->safeEmail(),
                'direccion' => $faker->address(),
                'ciudad' => $faker->city(),
                'provincia' => $faker->state(),
                'codigo_postal' => $faker->postcode(),
                'pais' => 'Argentina',
                'fecha_nacimiento' => $faker->date('Y-m-d', '-18 years'),
                'genero' => $faker->randomElement(['masculino', 'femenino']),
                'categoria' => $faker->randomElement(['minorista', 'mayorista', 'distribuidor', 'consumidor_final']),
                'estado' => $faker->randomElement(['activo', 'inactivo', 'suspendido']),
                'limite_credito' => $faker->randomFloat(2, 0, 50000),
                'saldo_actual' => $faker->randomFloat(2, 0, 10000),
                'profesion' => $faker->jobTitle(),
                'empresa' => $faker->optional(0.4)->company(),
                'observaciones' => $faker->optional(0.3)->sentence(),
                'created_at' => $faker->dateTimeBetween('-2 years', 'now'),
                'updated_at' => now(),
            ]);
        }
    echo "✅ 2000 clientes creados\n";
} else {
    echo "✅ Clientes ya existen (" . $clientesExistentes . " registros)\n";
}

// 4. PROVEEDORES
echo "🏢 Verificando proveedores...\n";
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

// 5. PACIENTES
echo "🏥 Verificando pacientes...\n";
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

// 6. PRODUCTOS
echo "💊 Verificando productos...\n";
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

// 7. VENTAS
echo "💰 Verificando ventas...\n";
$ventasExistentes = DB::table('ventas')->count();
if ($ventasExistentes == 0) {
    for ($i = 1; $i <= 10000; $i++) {
        $fechaVenta = $faker->dateTimeBetween('-1 year', 'now');
        $clienteId = $faker->numberBetween(1, 2000);
        $vendedorId = $faker->numberBetween(1, 1000);
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
echo "📊 Resumen:\n";
echo "   - Sucursales: " . DB::table('sucursales')->count() . "\n";
echo "   - Personal: " . DB::table('personal_pos')->count() . "\n";
echo "   - Clientes: " . DB::table('clientes')->count() . "\n";
echo "   - Proveedores: " . DB::table('proveedores')->count() . "\n";
echo "   - Pacientes: " . DB::table('pacientes')->count() . "\n";
echo "   - Productos: " . DB::table('productos')->count() . "\n";
echo "   - Ventas: " . DB::table('ventas')->count() . "\n";
echo "\n👤 Tu usuario administrador: jesusemutul@gmail.com / 150518Wen\n"; 