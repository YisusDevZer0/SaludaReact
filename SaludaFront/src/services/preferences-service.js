import HttpService from "./http.service";

class PreferencesService {
  constructor() {
    this.isBlocked = false;
    this.blockUntil = 0;
  }
  
  /**
   * Obtener las preferencias del usuario autenticado
   */
  getUserPreferences = async () => {
    try {
      console.log("Obteniendo preferencias del usuario...");
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("No hay token, devolviendo preferencias por defecto");
        return this.getDefaultPreferences();
      }
      
      console.log("Token encontrado, haciendo petición...");
      const response = await HttpService.get("user/preferences");
      console.log("Preferencias obtenidas:", response);
      return response;
    } catch (error) {
      console.error("Error obteniendo preferencias:", error);
      
      // Si es error 401, el token no es válido, usar valores por defecto
      if (error.status === 401) {
        console.log("Token inválido, usando valores por defecto");
      }
      
      // Si no existen preferencias, devolver valores por defecto
      return this.getDefaultPreferences();
    }
  };

  /**
   * Guardar las preferencias del usuario
   */
  saveUserPreferences = async (preferences) => {
    try {
      const response = await HttpService.post("user/preferences", preferences);
      return response;
    } catch (error) {
      console.error("Error guardando preferencias:", error);
      throw error;
    }
  };

  /**
   * Actualizar preferencias existentes
   */
  updateUserPreferences = async (preferences) => {
    try {
      // Verificar si estamos en período de bloqueo por errores previos
      if (this.isBlocked && Date.now() < this.blockUntil) {
        console.log("Servicio de preferencias bloqueado temporalmente debido a errores de autenticación");
        return { message: "Servicio temporalmente bloqueado" };
      }
      
      console.log("Actualizando preferencias:", preferences);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("No hay token para actualizar preferencias");
        return { message: "No autenticado" };
      }
      
      const response = await HttpService.put("user/preferences", preferences);
      console.log("Preferencias actualizadas:", response);
      
      // Reset bloqueo si la operación fue exitosa
      this.isBlocked = false;
      this.blockUntil = 0;
      
      return response;
    } catch (error) {
      console.error("Error actualizando preferencias:", error);
      
      // Si es error de autenticación, bloquear temporalmente el servicio
      if (error.status === 401) {
        console.log("Token inválido al actualizar preferencias - bloqueando servicio por 1 minuto");
        this.isBlocked = true;
        this.blockUntil = Date.now() + 60000; // 1 minuto
        return { message: "No autenticado" };
      }
      
      // Si es error 500, bloquear por menos tiempo
      if (error.status === 500) {
        console.log("Error del servidor - bloqueando servicio por 30 segundos");
        this.isBlocked = true;
        this.blockUntil = Date.now() + 30000; // 30 segundos
        return { message: "Error del servidor" };
      }
      
      return { message: "Error guardando preferencias" };
    }
  };

  /**
   * Resetear las preferencias a valores por defecto
   */
  resetUserPreferences = async () => {
    try {
      const response = await HttpService.post("user/preferences/reset");
      return response;
    } catch (error) {
      console.error("Error al resetear preferencias:", error);
      throw error;
    }
  };

  /**
   * Guardar preferencias en localStorage como respaldo
   */
  savePreferencesToLocalStorage = (preferences) => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error("Error al guardar preferencias en localStorage:", error);
    }
  };

  /**
   * Cargar preferencias desde localStorage como respaldo
   */
  loadPreferencesFromLocalStorage = () => {
    try {
      const preferences = localStorage.getItem('userPreferences');
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error("Error al cargar preferencias desde localStorage:", error);
      return null;
    }
  };

  /**
   * Valores por defecto de las preferencias
   */
  getDefaultPreferences = () => {
    return {
      sidenav_color: 'info',
      transparent_sidenav: false,
      white_sidenav: false,
      fixed_navbar: true,
      dark_mode: false,
      mini_sidenav: false,
      navbar_color: 'info',
      transparent_navbar: true,
      navbar_shadow: true,
      navbar_position: 'fixed',
      layout: 'dashboard',
      direction: 'ltr',
      table_header_color: 'azulSereno'
    };
  };

  /**
   * Colores Pantone disponibles
   */
  getPantoneColors = () => {
    return {
      jarabe: {
        name: "Pantone 2395 C - Jarabe",
        hex: "#C00096",
        rgb: "rgb(192, 0, 150)",
        cmyk: "C:27 M:90 Y:0 K:0"
      },
      azulLimpio: {
        name: "Pantone 2995 C - Azul limpio",
        hex: "#00A8E1",
        rgb: "rgb(0, 168, 225)",
        cmyk: "C:85 M:11 Y:2 K:0"
      },
      azulSereno: {
        name: "Pantone 2935 C - Azul sereno",
        hex: "#0057B8",
        rgb: "rgb(0, 87, 184)",
        cmyk: "C:100 M:46 Y:0 K:0"
      },
      verdeAmable: {
        name: "Pantone 3265 C - Verde amable",
        hex: "#00C7B1",
        rgb: "rgb(0, 199, 177)",
        cmyk: "C:69 M:0 Y:37 K:0"
      },
      verdeCiencia: {
        name: "Pantone 7474 C - Verde ciencia",
        hex: "#007987",
        rgb: "rgb(0, 121, 135)",
        cmyk: "C:90 M:0 Y:28 K:22"
      },
      amarilloVivo: {
        name: "Pantone Medium Yellow C - Amarillo vivo",
        hex: "#FFDA00",
        rgb: "rgb(255, 218, 0)",
        cmyk: "C:0 M:15 Y:100 K:0"
      },
      blancoEsteril: {
        name: "Blanco estéril",
        hex: "#FFFFFF",
        rgb: "rgb(255, 255, 255)",
        cmyk: "C:0 M:0 Y:0 K:0"
      }
    };
  };

}

export default new PreferencesService(); 