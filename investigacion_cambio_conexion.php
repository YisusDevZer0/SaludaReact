<?php
/**
 * Script de Investigación de Cambios en Conexión - SaludaReact
 * 
 * Este script investiga qué puede haber cambiado para causar el error de conexión
 * cuando antes funcionaba correctamente.
 */

echo "=== INVESTIGACIÓN DE CAMBIOS EN CONEXIÓN ===\n\n";

echo "ANÁLISIS DEL PROBLEMA:\n";
echo "✅ Antes: Conexión funcionaba correctamente\n";
echo "❌ Ahora: Error de acceso denegado desde IP IPv6\n\n";

echo "POSIBLES CAUSAS DEL CAMBIO:\n\n";

echo "1. 🔄 CAMBIO EN LA IP DE ORIGEN:\n";
echo "   - Tu IP pública puede haber cambiado\n";
echo "   - Cambio de proveedor de internet\n";
echo "   - Cambio de red (WiFi, cable, móvil)\n";
echo "   - Uso de VPN o proxy\n\n";

echo "2. 🔧 CAMBIO EN CONFIGURACIÓN DE HOSTING:\n";
echo "   - Hostinger actualizó políticas de seguridad\n";
echo "   - Cambio automático en permisos de usuario\n";
echo "   - Migración de servidor de base de datos\n";
echo "   - Actualización de MySQL\n\n";

echo "3. 🌐 CAMBIO EN INFRAESTRUCTURA:\n";
echo "   - Migración a IPv6\n";
echo "   - Cambio de servidor físico\n";
echo "   - Actualización de firewall\n\n";

echo "4. 📱 CAMBIO EN DISPOSITIVO/CONEXIÓN:\n";
echo "   - Cambio de dispositivo\n";
echo "   - Actualización de sistema operativo\n";
echo "   - Cambio de navegador o aplicación\n\n";

echo "INVESTIGACIÓN ACTUAL:\n";
echo "===================\n\n";

// Verificar IP actual
echo "1. VERIFICANDO IP ACTUAL:\n";
$ipv4 = file_get_contents('https://api.ipify.org');
$ipv6 = file_get_contents('https://api64.ipify.org');

echo "   IPv4: " . $ipv4 . "\n";
echo "   IPv6: " . $ipv6 . "\n";
echo "   IP del error: 2806:2f0:8041:ff75:5473:df6:5583:36f\n\n";

if ($ipv6 === '2806:2f0:8041:ff75:5473:df6:5583:36f') {
    echo "   ✅ La IP del error coincide con tu IP actual\n";
} else {
    echo "   ❌ La IP del error NO coincide con tu IP actual\n";
    echo "   💡 Esto sugiere que el error viene de otro lugar (servicio cloud, proxy, etc.)\n";
}

echo "\n";

// Verificar conectividad actual
echo "2. VERIFICANDO CONECTIVIDAD ACTUAL:\n";
$hosts = ['srv1545.hstgr.io', 'srv1264.hstgr.io'];
foreach ($hosts as $host) {
    echo "   Probando {$host}:3306...\n";
    $connection = @fsockopen($host, 3306, $errno, $errstr, 5);
    if ($connection) {
        echo "   ✅ Conexión exitosa a {$host}:3306\n";
        fclose($connection);
    } else {
        echo "   ❌ No se puede conectar a {$host}:3306 - Error: {$errstr} ({$errno})\n";
    }
}

echo "\n";

// Verificar configuración actual
echo "3. VERIFICANDO CONFIGURACIÓN ACTUAL:\n";
if (file_exists('SaludaBack/.env')) {
    $envContent = file_get_contents('SaludaBack/.env');
    preg_match('/DB_HOST=(.+)/', $envContent, $hostMatch);
    preg_match('/DB_PORT=(.+)/', $envContent, $portMatch);
    preg_match('/DB_DATABASE=(.+)/', $envContent, $dbMatch);
    preg_match('/DB_USERNAME=(.+)/', $envContent, $userMatch);
    
    if ($hostMatch && $dbMatch && $userMatch) {
        echo "   Host: " . trim($hostMatch[1]) . "\n";
        echo "   Puerto: " . (isset($portMatch[1]) ? trim($portMatch[1]) : '3306') . "\n";
        echo "   Base de datos: " . trim($dbMatch[1]) . "\n";
        echo "   Usuario: " . trim($userMatch[1]) . "\n";
    }
} else {
    echo "   ❌ Archivo .env no encontrado\n";
}

echo "\n";

echo "SOLUCIONES ESPECÍFICAS PARA TU CASO:\n";
echo "====================================\n\n";

echo "OPCIÓN 1: VERIFICAR CON HOSTINGER\n";
echo "---------------------------------\n";
echo "1. Accede al panel de Hostinger: https://hpanel.hostinger.com\n";
echo "2. Ve a 'Bases de datos MySQL'\n";
echo "3. Verifica que el usuario 'u155356178_SaludaCoreDevs' existe\n";
echo "4. Revisa los logs de acceso para ver si hay intentos fallidos\n";
echo "5. Contacta al soporte si los permisos cambiaron automáticamente\n\n";

echo "OPCIÓN 2: PROBAR CON DIFERENTE CONEXIÓN\n";
echo "---------------------------------------\n";
echo "1. Cambia de WiFi a datos móviles (o viceversa)\n";
echo "2. Desactiva VPN si estás usando una\n";
echo "3. Prueba desde otro dispositivo\n";
echo "4. Prueba desde otra red\n\n";

echo "OPCIÓN 3: VERIFICAR SI ES UN SERVICIO CLOUD\n";
echo "-------------------------------------------\n";
echo "La IP IPv6 sugiere que puede ser:\n";
echo "- Railway, Vercel, o similar\n";
echo "- Servidor de desarrollo remoto\n";
echo "- Proxy o túnel\n\n";

echo "OPCIÓN 4: SOLUCIÓN TEMPORAL\n";
echo "---------------------------\n";
echo "1. Usa la base de datos local mientras investigas\n";
echo "2. Ejecuta: ./configurar_bd_local.sh\n";
echo "3. Continúa desarrollando localmente\n\n";

echo "COMANDOS DE VERIFICACIÓN:\n";
echo "========================\n\n";

echo "Para verificar si el problema es de red:\n";
echo "ping srv1545.hstgr.io\n";
echo "telnet srv1545.hstgr.io 3306\n\n";

echo "Para verificar la configuración de Laravel:\n";
echo "cd SaludaBack && php artisan config:show database\n\n";

echo "Para probar conexión manual:\n";
echo "mysql -h srv1545.hstgr.io -P 3306 -u u155356178_SaludaCoreDevs -p u155356178_SaludaCore\n\n";

echo "Para verificar logs de Laravel:\n";
echo "cd SaludaBack && tail -f storage/logs/laravel.log\n\n";

echo "RECOMENDACIÓN INMEDIATA:\n";
echo "=======================\n";
echo "1. Contacta al soporte de Hostinger para verificar si hubo cambios\n";
echo "2. Mientras tanto, usa la base de datos local para continuar desarrollando\n";
echo "3. Ejecuta el script de configuración local: ./configurar_bd_local.sh\n\n";

echo "=== FIN DE LA INVESTIGACIÓN ===\n";
?>
