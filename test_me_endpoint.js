const axios = require('axios');

// Configuración
const BASE_URL = 'http://localhost:8000/api';
const TEST_TOKEN = '3|1749268737|e69585627009c42eb4d98b1d094344e42153970122229aef6a2d76e66371dc2d'; // Token del usuario 3

async function testMeEndpoint() {
    try {
        console.log('🔍 Probando endpoint /api/me...');
        
        const response = await axios.get(`${BASE_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${TEST_TOKEN}`,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        });
        
        console.log('✅ Endpoint /api/me funciona correctamente');
        console.log('📊 Status:', response.status);
        console.log('📄 Respuesta:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Error al probar endpoint /api/me');
        console.log('📊 Status:', error.response?.status);
        console.log('📄 Error:', error.response?.data || error.message);
    }
}

async function testV2MeEndpoint() {
    try {
        console.log('\n🔍 Probando endpoint /api/v2/me...');
        
        const response = await axios.get(`${BASE_URL}/v2/me`, {
            headers: {
                'Authorization': `Bearer ${TEST_TOKEN}`,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        });
        
        console.log('✅ Endpoint /api/v2/me funciona correctamente');
        console.log('📊 Status:', response.status);
        console.log('📄 Respuesta:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Error al probar endpoint /api/v2/me');
        console.log('📊 Status:', error.response?.status);
        console.log('📄 Error:', error.response?.data || error.message);
    }
}

// Ejecutar pruebas
async function runTests() {
    console.log('🚀 Iniciando pruebas de endpoints /me...\n');
    
    await testMeEndpoint();
    await testV2MeEndpoint();
    
    console.log('\n✨ Pruebas completadas');
}

runTests(); 