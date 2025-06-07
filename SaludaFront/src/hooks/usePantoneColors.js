import { useMaterialUIController, PreferencesService } from "context";

/**
 * Hook personalizado para obtener y usar colores Pantone
 * @returns {Object} Objeto con colores, utilidades y configuración actual
 */
export const usePantoneColors = () => {
  const [controller] = useMaterialUIController();
  const { tableHeaderColor, darkMode } = controller;

  // Obtener todos los colores Pantone disponibles
  const pantoneColors = PreferencesService.getPantoneColors();

  // Función para obtener un color específico
  const getColor = (colorKey, fallback = "azulSereno") => {
    return pantoneColors[colorKey]?.hex || pantoneColors[fallback]?.hex;
  };

  // Función para obtener el color de header actual
  const getCurrentHeaderColor = () => {
    if (darkMode) {
      return pantoneColors.blancoEsteril.hex;
    }
    return getColor(tableHeaderColor || "azulSereno");
  };

  // Función para obtener un color con transparencia
  const getColorWithAlpha = (colorKey, alpha = 1) => {
    const hex = getColor(colorKey);
    const rgb = hexToRgb(hex);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  };

  // Función para convertir hex a RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Colores preconfigurados para diferentes usos
  const themeColors = {
    primary: getColor("azulSereno"),
    secondary: getColor("verdeAmable"),
    success: getColor("verdeAmable"),
    warning: getColor("amarilloVivo"),
    error: getColor("jarabe"),
    info: getColor("azulLimpio"),
    background: darkMode ? "#1a1a1a" : pantoneColors.blancoEsteril.hex,
    surface: darkMode ? "#2c2c2c" : pantoneColors.blancoEsteril.hex,
    text: darkMode ? pantoneColors.blancoEsteril.hex : "#333333"
  };

  return {
    // Colores individuales
    colors: pantoneColors,
    
    // Configuración actual
    currentHeaderColor: getCurrentHeaderColor(),
    isDarkMode: darkMode,
    
    // Funciones utilitarias
    getColor,
    getColorWithAlpha,
    hexToRgb,
    
    // Tema completo
    theme: themeColors,
    
    // Colores específicos para diferentes elementos
    table: {
      header: getCurrentHeaderColor(),
      headerText: darkMode ? "#333333" : "#ffffff",
      border: getColorWithAlpha(tableHeaderColor || "azulSereno", 0.1),
      hover: getColorWithAlpha(tableHeaderColor || "azulSereno", 0.05)
    },
    
    // Paleta completa para Material-UI
    muiPalette: {
      primary: {
        main: getColor("azulSereno"),
        light: getColorWithAlpha("azulSereno", 0.1),
        dark: getColor("verdeCiencia")
      },
      secondary: {
        main: getColor("verdeAmable"),
        light: getColorWithAlpha("verdeAmable", 0.1),
        dark: getColor("verdeCiencia")
      },
      error: {
        main: getColor("jarabe"),
        light: getColorWithAlpha("jarabe", 0.1)
      },
      warning: {
        main: getColor("amarilloVivo"),
        light: getColorWithAlpha("amarilloVivo", 0.1)
      },
      info: {
        main: getColor("azulLimpio"),
        light: getColorWithAlpha("azulLimpio", 0.1)
      },
      success: {
        main: getColor("verdeAmable"),
        light: getColorWithAlpha("verdeAmable", 0.1)
      }
    }
  };
};

export default usePantoneColors; 