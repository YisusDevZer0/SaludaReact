import Axios from "axios";

// Forzar la URL base para desarrollo
const API_BASE = "http://localhost:8000/api";

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
  timeout: 10000,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Aceptar todos los códigos de estado para manejar errores
  }
});

// Interceptor global para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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
            reject({
              status: error.response.status,
              message: error.response.data?.message || 'Error del servidor',
              errors: error.response.data?.errors || [{ detail: 'Error desconocido' }]
            });
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
