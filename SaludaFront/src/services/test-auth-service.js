/**
=========================================================
* SaludaReact - Servicio de Prueba de Autenticación
=========================================================
*/

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class TestAuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Obtener token de autenticación
  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };
  }

  // Probar autenticación estándar
  async testStandardAuth() {
    try {
      const response = await fetch(`${this.baseURL}/test-auth`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en test de autenticación estándar:', error);
      throw error;
    }
  }

  // Probar autenticación PersonalPOS
  async testPersonalPOSAuth() {
    try {
      const response = await fetch(`${this.baseURL}/test-personalpos-auth`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en test de autenticación PersonalPOS:', error);
      throw error;
    }
  }

  // Probar subida de imagen
  async testImageUpload() {
    try {
      // Crear un archivo de prueba
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 100, 100);
      
      canvas.toBlob(async (blob) => {
        const testFile = new File([blob], 'test.png', { type: 'image/png' });
        
        const formData = new FormData();
        formData.append('image', testFile);

        const response = await fetch(`${this.baseURL}/profile/image/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json();
        console.log('Respuesta de subida de imagen:', data);
        return data;
      });
    } catch (error) {
      console.error('Error en test de subida de imagen:', error);
      throw error;
    }
  }
}

export default new TestAuthService(); 