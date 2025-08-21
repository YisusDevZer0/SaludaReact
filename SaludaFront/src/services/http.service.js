import Axios from "axios";

// Usar variable de entorno o fallback a localhost para desarrollo
const API_BASE = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api`
  : "http://localhost:8000/api";

// Para depuración
console.log("Entorno:", process.env.NODE_ENV);
console.log("API Base configurada:", API_BASE);

// Configuramos el Axios
const axiosInstance = Axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Agregar timeout y otras configuraciones
  timeout: 15000, // Aumentar timeout a 15 segundos
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Aceptar todos los códigos de estado para manejar errores
  }
});

// Interceptor global para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log("HttpService: Enviando Bearer token:", token.substring(0, 20) + "...");
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("HttpService: Error en request interceptor:", error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es error 401, no hacer nada aquí - dejarlo al interceptor principal
    if (error.response?.status === 401) {
      console.log("HttpService: Error 401 detectado, delegando al interceptor principal");
    }
    return Promise.reject(error);
  }
);

export class HttpService {
  _axios = axiosInstance;

  addRequestInterceptor = (onFulfilled, onRejected) => {
    this._axios.interceptors.request.use(onFulfilled, onRejected);
  };

  addResponseInterceptor = (onFulfilled, onRejected) => {
    this._axios.interceptors.response.use(onFulfilled, onRejected);
  };

  get = async (url) => await this.request(this.getOptionsConfig("get", url));

  post = async (url, data) => {
    console.log("Enviando petición POST a:", `${API_BASE}/${url}`);
    console.log("Datos enviados:", data);
    return await this.request(this.getOptionsConfig("post", url, data));
  };

  put = async (url, data) => await this.request(this.getOptionsConfig("put", url, data));

  patch = async (url, data) => await this.request(this.getOptionsConfig("patch", url, data));

  delete = async (url) => await this.request(this.getOptionsConfig("delete", url));

  getOptionsConfig = (method, url, data = null) => {
    const config = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    return config;
  };

  request(options) {
    return new Promise((resolve, reject) => {
      this._axios
        .request(options)
        .then((res) => {
          console.log("Respuesta del servidor:", res.data);
          resolve(res.data);
        })
        .catch((error) => {
          console.error("Error en la petición:", error);
          
          // Mejorar el manejo de errores
          if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            const errorResponse = {
              status: error.response.status,
              message: error.response.data?.message || 'Error del servidor',
              errors: error.response.data?.errors || [{ detail: 'Error desconocido' }]
            };
            
            // Para errores 401, no hacer retry automático para evitar loops infinitos
            if (error.response.status === 401) {
              console.log("HttpService: Error 401 - Usuario no autenticado");
            }
            
            reject(errorResponse);
          } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            reject({
              status: 0,
              message: 'No se pudo conectar con el servidor',
              errors: [{ detail: 'Verifica tu conexión a internet o que el servidor esté funcionando' }]
            });
          } else {
            // Algo sucedió al configurar la petición
            reject({
              status: 0,
              message: 'Error al procesar la petición',
              errors: [{ detail: error.message }]
            });
          }
        });
    });
  }
}

export default new HttpService();
