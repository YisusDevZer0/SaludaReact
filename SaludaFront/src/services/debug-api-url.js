// Script de debug para verificar la configuración de la API URL
console.log('🔍 Debug: Configuración de API URL');
console.log('=====================================');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('=====================================');

// Verificar si la variable está definida
if (process.env.REACT_APP_API_URL) {
  console.log('✅ REACT_APP_API_URL está configurada');
  console.log('URL:', process.env.REACT_APP_API_URL);
} else {
  console.log('❌ REACT_APP_API_URL NO está configurada');
  console.log('⚠️  Se usará localhost:8000 como fallback');
}

// Verificar en diferentes servicios
const services = {
  'http.service.js': process.env.REACT_APP_API_URL 
    ? `${process.env.REACT_APP_API_URL}/api`
    : "http://localhost:8000/api",
  'http-service.js': process.env.REACT_APP_API_URL 
    ? `${process.env.REACT_APP_API_URL}/api`
    : "http://localhost:8000/api",
  'api.js': process.env.REACT_APP_API_URL || 'http://localhost:8000'
};

console.log('🔧 URLs configuradas en servicios:');
Object.entries(services).forEach(([service, url]) => {
  console.log(`${service}: ${url}`);
});

export default services; 