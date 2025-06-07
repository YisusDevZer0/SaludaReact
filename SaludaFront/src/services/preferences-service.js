import HttpService from "./htttp.service";

class PreferencesService {
  
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
      console.log("Actualizando preferencias:", preferences);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("No hay token para actualizar preferencias");
        return { message: "No autenticado" };
      }
      
      const response = await HttpService.put("user/preferences", preferences);
      console.log("Preferencias actualizadas:", response);
      return response;
    } catch (error) {
      console.error("Error actualizando preferencias:", error);
      
      // No lanzar error para que no bloquee la app
      if (error.status === 401) {
        console.log("Token inválido al actualizar preferencias");
        return { message: "No autenticado" };
      }
      
      return { message: "Error guardando preferencias" };
    }
  };

  /**
   * Valores por defecto de las preferencias
   */
  getDefaultPreferences = () => {
    return {
      ui: {
        miniSidenav: false,
        transparentSidenav: false,
        whiteSidenav: false,
        sidenavColor: "info",
        transparentNavbar: true,
        fixedNavbar: true,
        darkMode: false,
        direction: "ltr",
        layout: "dashboard"
      },
      theme: {
        primaryColor: "#0057B8", // Azul sereno por defecto
        tableHeaderColor: "primary"
      }
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