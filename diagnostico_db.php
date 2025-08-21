<?php
/**
 * Script de Diagnóstico de Base de Datos - SaludaReact
 * 
 * Este script verifica la configuración de conexión a la base de datos
 * y proporciona soluciones para problemas comunes.
 */

echo "=== DIAGNÓSTICO DE BASE DE DATOS - SALUDAREACT ===\n\n";

// 1. Verificar archivos .env
echo "1. VERIFICANDO ARCHIVOS DE CONFIGURACIÓN:\n";
echo "----------------------------------------\n";

$envFiles = [
    '.env' => 'Directorio raíz',
    'SaludaBack/.env' => 'Backend Laravel'
];

foreach ($envFiles as $file => $description) {
    if (file_exists($file)) {
        echo "✅ {$description}: {$file} - EXISTE\n";
        
        // Leer configuración de BD
        $envContent = file_get_contents($file);
        preg_match('/DB_HOST=(.+)/', $envContent, $hostMatch);
        preg_match('/DB_PORT=(.+)/', $envContent, $portMatch);
        preg_match('/DB_DATABASE=(.+)/', $envContent, $dbMatch);
        preg_match('/DB_USERNAME=(.+)/', $envContent, $userMatch);
        preg_match('/DB_PASSWORD=(.+)/', $envContent, $passMatch);
        
        if ($hostMatch && $dbMatch && $userMatch) {
            echo "   Host: " . trim($hostMatch[1]) . "\n";
            echo "   Puerto: " . (isset($portMatch[1]) ? trim($portMatch[1]) : '3306') . "\n";
            echo "   Base de datos: " . trim($dbMatch[1]) . "\n";
            echo "   Usuario: " . trim($userMatch[1]) . "\n";
            echo "   Contraseña: " . (isset($passMatch[1]) ? str_repeat('*', strlen(trim($passMatch[1]))) : 'NO CONFIGURADA') . "\n";
        }
    } else {
        echo "❌ {$description}: {$file} - NO EXISTE\n";
    }
    echo "\n";
}

// 2. Verificar conectividad de red
echo "2. VERIFICANDO CONECTIVIDAD DE RED:\n";
echo "-----------------------------------\n";

$hosts = ['srv1545.hstgr.io', 'srv1264.hstgr.io'];
foreach ($hosts as $host) {
    echo "Probando conectividad a {$host}...\n";
    
    // Intentar ping (simulado)
    $connection = @fsockopen($host, 3306, $errno, $errstr, 5);
    if ($connection) {
        echo "✅ Conexión exitosa a {$host}:3306\n";
        fclose($connection);
    } else {
        echo "❌ No se puede conectar a {$host}:3306 - Error: {$errstr} ({$errno})\n";
    }
}

echo "\n";

// 3. Verificar configuración de Laravel
echo "3. VERIFICANDO CONFIGURACIÓN DE LARAVEL:\n";
echo "----------------------------------------\n";

if (file_exists('SaludaBack/config/database.php')) {
    echo "✅ Archivo de configuración de BD existe\n";
    
    // Verificar configuración de conexión principal
    $config = include 'SaludaBack/config/database.php';
    $defaultConnection = $config['default'] ?? 'mysql';
    echo "Conexión por defecto: {$defaultConnection}\n";
    
    if (isset($config['connections']['mysql'])) {
        $mysqlConfig = $config['connections']['mysql'];
        echo "Configuración MySQL:\n";
        echo "  - Host: " . ($mysqlConfig['host'] ?? 'NO CONFIGURADO') . "\n";
        echo "  - Puerto: " . ($mysqlConfig['port'] ?? '3306') . "\n";
        echo "  - Base de datos: " . ($mysqlConfig['database'] ?? 'NO CONFIGURADO') . "\n";
        echo "  - Usuario: " . ($mysqlConfig['username'] ?? 'NO CONFIGURADO') . "\n";
    }
} else {
    echo "❌ Archivo de configuración de BD no encontrado\n";
}

echo "\n";

// 4. Análisis del error
echo "4. ANÁLISIS DEL ERROR REPORTADO:\n";
echo "--------------------------------\n";

echo "Error original:\n";
echo "SQLSTATE[HY000] [1045] Access denied for user 'u155356178_SaludaCoreDevs'@'2806:2f0:8041:ff75:5473:df6:5583:36f'\n\n";

echo "PROBLEMAS IDENTIFICADOS:\n";
echo "1. ❌ El usuario 'u155356178_SaludaCoreDevs' no tiene permisos desde la IP '2806:2f0:8041:ff75:5473:df6:5583:36f'\n";
echo "2. ❌ La dirección IP '2806:2f0:8041:ff75:5473:df6:5583:36f' es una IPv6, posiblemente desde un servicio cloud\n";
echo "3. ❌ El servidor de BD está configurado para rechazar conexiones desde IPs no autorizadas\n\n";

// 5. Soluciones recomendadas
echo "5. SOLUCIONES RECOMENDADAS:\n";
echo "---------------------------\n";

echo "OPCIÓN 1: Configurar permisos de IP en el servidor de BD\n";
echo "- Contactar al proveedor de hosting (Hostinger)\n";
echo "- Solicitar que agreguen la IP '2806:2f0:8041:ff75:5473:df6:5583:36f' a los permisos del usuario\n";
echo "- O configurar el usuario para aceptar conexiones desde cualquier IP (%)\n\n";

echo "OPCIÓN 2: Usar una conexión local o VPN\n";
echo "- Configurar una conexión VPN para tener una IP fija\n";
echo "- Usar un servidor proxy local\n\n";

echo "OPCIÓN 3: Cambiar a una base de datos local\n";
echo "- Instalar MySQL localmente\n";
echo "- Migrar los datos a la BD local\n";
echo "- Actualizar la configuración en .env\n\n";

echo "OPCIÓN 4: Usar un servicio de BD en la nube\n";
echo "- Configurar una BD en Railway, PlanetScale, o similar\n";
echo "- Actualizar las credenciales en .env\n\n";

// 6. Comandos de verificación
echo "6. COMANDOS DE VERIFICACIÓN:\n";
echo "----------------------------\n";

echo "Para verificar la conexión manualmente:\n";
echo "mysql -h srv1545.hstgr.io -P 3306 -u u155356178_SaludaCoreDevs -p u155356178_SaludaCore\n\n";

echo "Para probar desde PHP:\n";
echo "<?php\n";
echo "\$pdo = new PDO('mysql:host=srv1545.hstgr.io;port=3306;dbname=u155356178_SaludaCore', 'u155356178_SaludaCoreDevs', 'u+L0f\$3?@s');\n";
echo "echo 'Conexión exitosa';\n";
echo "?>\n\n";

echo "Para verificar la configuración de Laravel:\n";
echo "cd SaludaBack && php artisan config:show database\n\n";

echo "=== FIN DEL DIAGNÓSTICO ===\n";
?>
