#!/usr/bin/env node

/**
 * Script para probar la conexión entre Frontend (Vercel) y Backend (Railway)
 * 
 * Uso:
 * node test-vercel-railway-connection.js [backend-url]
 * 
 * Ejemplo:
 * node test-vercel-railway-connection.js https://saluda-backend-production.up.railway.app
 */

const https = require('https');
const http = require('http');

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        const req = protocol.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: jsonData
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function testConnection(backendUrl) {
    log('🧪 Probando conexión entre Vercel y Railway...', 'cyan');
    log(`📍 Backend URL: ${backendUrl}`, 'blue');
    log('');
    
    const tests = [
        {
            name: 'Test de conexión básica',
            url: `${backendUrl}/api/test-connection`,
            expectedStatus: 200
        },
        {
            name: 'Test de CORS headers',
            url: `${backendUrl}/api/test-connection`,
            expectedStatus: 200,
            checkCors: true
        },
        {
            name: 'Test de endpoint de autenticación',
            url: `${backendUrl}/api/v2/login`,
            expectedStatus: 422, // Esperamos un error 422 porque no enviamos datos
            method: 'POST'
        }
    ];
    
    for (const test of tests) {
        log(`🔍 ${test.name}...`, 'yellow');
        
        try {
            const response = await makeRequest(test.url);
            
            if (response.statusCode === test.expectedStatus) {
                log(`✅ ${test.name}: OK (${response.statusCode})`, 'green');
                
                if (test.checkCors) {
                    const corsHeaders = response.headers['access-control-allow-origin'];
                    if (corsHeaders) {
                        log(`   📋 CORS Headers: ${corsHeaders}`, 'green');
                    } else {
                        log(`   ⚠️  CORS Headers: No encontrados`, 'yellow');
                    }
                }
                
                if (response.data && typeof response.data === 'object') {
                    log(`   📄 Response:`, 'cyan');
                    console.log(JSON.stringify(response.data, null, 2));
                }
            } else {
                log(`❌ ${test.name}: Error (${response.statusCode})`, 'red');
                log(`   Expected: ${test.expectedStatus}, Got: ${response.statusCode}`, 'red');
            }
        } catch (error) {
            log(`❌ ${test.name}: Error - ${error.message}`, 'red');
        }
        
        log('');
    }
    
    log('📋 Resumen de configuración para Vercel:', 'magenta');
    log('');
    log('Variables de entorno que debes configurar en Vercel:', 'cyan');
    log(`REACT_APP_API_URL=${backendUrl}`, 'green');
    log('');
    log('Variables de entorno que debes configurar en Railway:', 'cyan');
    log(`APP_URL=${backendUrl}`, 'green');
    log(`CORS_ALLOWED_ORIGINS=https://tu-app.vercel.app,https://*.vercel.app`, 'green');
    log('');
    log('🔗 Para verificar en el navegador:', 'magenta');
    log(`1. Abre: ${backendUrl}/api/test-connection`, 'blue');
    log('2. Deberías ver una respuesta JSON con status: "success"', 'blue');
    log('');
    log('🎯 Para verificar desde el frontend:', 'magenta');
    log('1. Abre las herramientas de desarrollador del navegador', 'blue');
    log('2. Ve a la pestaña Console', 'blue');
    log('3. Ejecuta: console.log(process.env.REACT_APP_API_URL)', 'blue');
    log('4. Debería mostrar la URL de tu backend', 'blue');
}

// Obtener la URL del backend desde los argumentos de línea de comandos
const backendUrl = process.argv[2];

if (!backendUrl) {
    log('❌ Error: Debes proporcionar la URL del backend', 'red');
    log('', 'reset');
    log('Uso:', 'cyan');
    log('node test-vercel-railway-connection.js [backend-url]', 'green');
    log('', 'reset');
    log('Ejemplo:', 'cyan');
    log('node test-vercel-railway-connection.js https://saluda-backend-production.up.railway.app', 'green');
    process.exit(1);
}

// Validar que la URL sea válida
if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
    log('❌ Error: La URL debe comenzar con http:// o https://', 'red');
    process.exit(1);
}

// Ejecutar las pruebas
testConnection(backendUrl).catch(error => {
    log(`❌ Error general: ${error.message}`, 'red');
    process.exit(1);
}); 