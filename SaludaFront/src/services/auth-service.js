import HttpService from "./http.service";

class AuthService {
  // authEndpoint = process.env.API_URL;

  // El endpoint ya es correcto para PersonalPOS
  login = async (payload) => {
    try {
      console.log('Intentando login con payload:', payload); // Debug log
      // Usar el endpoint correcto para PersonalPOS
      const response = await HttpService.post("pos/login", {
        email: payload.data.attributes.email,
        password: payload.data.attributes.password
      });
      
      console.log('Respuesta del servidor:', response); // Debug log
      
      if (response.access_token) {
        const userData = {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          user: response.user
        };
        console.log('Datos del usuario preparados para el contexto:', userData); // Debug log
        return userData;
      } else {
        throw {
          message: "Error de autenticación",
          errors: [{ detail: "Credenciales incorrectas" }]
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      throw {
        message: error.message || "Error de autenticación",
        errors: error.errors || [{ detail: "Credenciales incorrectas" }]
      };
    }
  };

  register = async (credentials) => {
    const registerEndpoint = 'register';
    return await HttpService.post(registerEndpoint, credentials);
  };

  logout = async () => {
    try {
      const logoutEndpoint = 'logout';
      const response = await HttpService.post(logoutEndpoint);
      console.log('Logout exitoso:', response);
      return response;
    } catch (error) {
      console.error("Error en logout:", error);
      // No lanzar el error, solo registrarlo
      // El logout local se manejará independientemente
      return { success: false, error: error.message };
    }
  };

  forgotPassword = async (payload) => {
    const forgotPassword = 'password-forgot';
    return await HttpService.post(forgotPassword, payload);
  }

  resetPassword = async (credentials) => {
    const resetPassword = 'password-reset';
    return await HttpService.post(resetPassword, credentials);
  }

  getProfile = async() => {
    const getProfile = 'me';
    return await HttpService.get(getProfile);
  }

  updateProfile = async (newInfo) => {
    const updateProfile = "me";
    return await HttpService.patch(updateProfile, newInfo);
  }
}

export default new AuthService();
