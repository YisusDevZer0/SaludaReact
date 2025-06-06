import HttpService from "./htttp.service";

export const setupAxiosInterceptors = (onUnauthenticated) => {
  const onRequestSuccess = async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  const onRequestFail = (error) => {
    console.error("Error en la petición:", error);
    return Promise.reject(error);
  };

  HttpService.addRequestInterceptor(onRequestSuccess, onRequestFail);

  const onResponseSuccess = (response) => response;

  const onResponseFail = (error) => {
    console.error("Error en la respuesta:", error);
    
    // Verificar si es un error de autenticación
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        if (onUnauthenticated) {
          onUnauthenticated();
        }
      }
    }
    
    return Promise.reject(error);
  };

  HttpService.addResponseInterceptor(onResponseSuccess, onResponseFail);
};
