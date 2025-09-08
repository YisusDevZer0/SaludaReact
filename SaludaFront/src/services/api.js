import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Aceptar todos los códigos de estado para manejar errores
  }
});

// Interceptor global para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log("API Service: Enviando Bearer token:", token.substring(0, 20) + "...");
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log("API Service: No se encontró token de autenticación");
    }
    return config;
  },
  (error) => {
    console.error("API Service: Error en request interceptor:", error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("API Service: Error de autenticación - Token inválido o expirado");
      // Opcional: limpiar el token y redirigir al login
      localStorage.removeItem('access_token');
      localStorage.removeItem('userRole');
      // window.location.href = '/authentication/sign-in';
    }
    return Promise.reject(error);
  }
);

export default api; 