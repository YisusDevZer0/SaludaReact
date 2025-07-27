import HttpService from "./http.service";

export const setupAxiosInterceptors = (onUnauthenticated) => {
  const onRequestSuccess = async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Interceptor: Token found:", token.substring(0, 20) + "...");
      console.log("Interceptor: Token length:", token.length);
    } else {
      console.log("Interceptor: No token found");
    }
    return config;
  };

  const onRequestFail = (error) => {
    console.error("Error en la petición:", error);
    return Promise.reject(error);
  };

  HttpService.addRequestInterceptor(onRequestSuccess, onRequestFail);

  const onResponseSuccess = (response) => {
    // Verificar si hay un nuevo token en los headers
    const newToken = response.headers['x-new-token'];
    const expiresAt = response.headers['x-token-expires-at'];
    
    if (newToken) {
      console.log("Interceptor: Nuevo token recibido");
      localStorage.setItem("token", newToken);
      if (expiresAt) {
        localStorage.setItem("token_expires_at", expiresAt);
      }
    }
    
    return response;
  };

  const onResponseFail = (error) => {
    console.error("Error en la respuesta:", error);
    
    // Verificar si es un error de autenticación
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.log("Interceptor: Error 401 - Token inválido o expirado");
        
        // Limpiar tokens y redirigir al login
        localStorage.removeItem("token");
        localStorage.removeItem("token_expires_at");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userPermissions");
        
        if (onUnauthenticated) {
          console.log("Interceptor: Ejecutando callback de no autenticado");
          onUnauthenticated();
        }
      }
    }
    
    return Promise.reject(error);
  };

  HttpService.addResponseInterceptor(onResponseSuccess, onResponseFail);
};
