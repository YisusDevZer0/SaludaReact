import HttpService from "./htttp.service";

export const setupAxiosInterceptors = (onUnauthenticated) => {
  const onRequestSuccess = async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Interceptor: Enviando token:", token.substring(0, 20) + "...");
      console.log("Interceptor: Token length:", token.length);
      config.headers['X-Auth-Token'] = token;
      console.log("Interceptor: X-Auth-Token header:", config.headers['X-Auth-Token'].substring(0, 30) + "...");
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
        // Verificar si el token expiró
        const tokenExpiresAt = localStorage.getItem("token_expires_at");
        if (tokenExpiresAt && parseInt(tokenExpiresAt) < Date.now() / 1000) {
          console.log("Interceptor: Token expirado, cerrando sesión");
          localStorage.removeItem("token");
          localStorage.removeItem("token_expires_at");
          localStorage.removeItem("userData");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userPermissions");
          
          if (onUnauthenticated) {
            onUnauthenticated();
          }
        }
      }
    }
    
    return Promise.reject(error);
  };

  HttpService.addResponseInterceptor(onResponseSuccess, onResponseFail);
};
