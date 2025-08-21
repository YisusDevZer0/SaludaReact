<?php
/**
 * Script para probar conexión usando IPv4 específicamente
 */

echo "=== PRUEBA DE CONEXIÓN IPv4 ===\n\n";

// Obtener IP IPv4 del servidor
echo "1. Resolviendo IP IPv4 del servidor...\n";
$host = 'srv1545.hstgr.io';
$ipv4 = gethostbyname($host);
echo "   Host: $host\n";
echo "   IPv4: $ipv4\n\n";

// Probar conexión directa por IP
echo "2. Probando conexión directa por IPv4...\n";
$connection = @fsockopen($ipv4, 3306, $errno, $errstr, 5);
if ($connection) {
    echo "   ✅ Conexión exitosa por IPv4\n";
    fclose($connection);
} else {
    echo "   ❌ No se puede conectar por IPv4 - Error: $errstr ($errno)\n";
}

echo "\n";

// Probar con PDO usando IPv4
echo "3. Probando conexión PDO con IPv4...\n";
try {
    $dsn = "mysql:host=$ipv4;port=3306;dbname=u155356178_SaludaCore";
    $pdo = new PDO($dsn, 'u155356178_SaludaCoreDevs', 'u+L0f$3?@s');
    echo "   ✅ Conexión PDO exitosa por IPv4\n";
} catch (PDOException $e) {
    echo "   ❌ Error PDO por IPv4: " . $e->getMessage() . "\n";
}

echo "\n";

// Verificar si hay restricciones de IPv6
echo "4. Verificando soporte IPv6...\n";
if (function_exists('socket_create')) {
    $socket = @socket_create(AF_INET6, SOCK_STREAM, SOL_TCP);
    if ($socket) {
        echo "   ✅ Soporte IPv6 disponible\n";
        socket_close($socket);
    } else {
        echo "   ❌ No hay soporte IPv6\n";
    }
} else {
    echo "   ⚠️ No se puede verificar soporte IPv6\n";
}

echo "\n";

echo "RECOMENDACIONES:\n";
echo "================\n\n";

echo "1. Si la conexión IPv4 funciona, actualiza tu configuración:\n";
echo "   En SaludaBack/.env, usa la IP IPv4 en lugar del hostname:\n";
echo "   DB_HOST=$ipv4\n\n";

echo "2. Si no funciona, contacta a Hostinger:\n";
echo "   - Panel: https://hpanel.hostinger.com\n";
echo "   - Soporte: https://www.hostinger.com/contact\n\n";

echo "3. Como solución temporal, usa BD local:\n";
echo "   ./configurar_bd_local.sh\n\n";

echo "=== FIN DE LA PRUEBA ===\n";
?>
