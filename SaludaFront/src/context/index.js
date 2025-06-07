/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/**
  This file is used for controlling the global states of the components,
  you can customize the states for the different components here.
*/

import { createContext, useContext, useReducer, useMemo, useState, useEffect } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

// Services
import PreferencesService from "services/preferences-service";

// Material Dashboard 2 React main context
const MaterialUI = createContext();

// authentication context
export const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  userData: null,
  userPermissions: null,
  isLoading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userPermissions, setUserPermissions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("userRole");
      const storedUserData = localStorage.getItem("userData");
      const storedPermissions = localStorage.getItem("userPermissions");

      if (token && storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          console.log('Restaurando sesión:', parsedData);
          
          setIsAuthenticated(true);
          setUserRole(storedRole);
          setUserData(parsedData);
          
          // Restaurar permisos
          if (parsedData.role && parsedData.role.Permisos) {
            setUserPermissions(parsedData.role.Permisos);
          } else if (storedPermissions) {
            setUserPermissions(storedPermissions);
          }
          
          // Si está en login, redirigir al dashboard
          if (location.pathname === '/auth/login' || location.pathname === '/') {
            navigate("/dashboard");
          }
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
          // Si hay error, limpiar localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userData");
          localStorage.removeItem("userPermissions");
          navigate("/auth/login");
        }
      } else {
        // No hay token válido, redirigir a login si no está ya ahí
        if (!location.pathname.startsWith('/auth/')) {
          navigate("/auth/login");
        }
      }
      
      setIsLoading(false);
    };

    checkAuthentication();
  }, []); // Solo ejecutar una vez al montar el componente

  const login = (token, refreshToken, user = {}) => {
    console.log('Datos del usuario recibidos en login:', user); // Debug log
    console.log('Token recibido en login:', token?.substring(0, 20) + '...'); // Debug token
    console.log('Token length:', token?.length); // Debug token length
    
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userRole", user.role?.Nombre_rol || 'user');
    localStorage.setItem("userData", JSON.stringify(user));
    if (user.role?.Permisos) {
      localStorage.setItem("userPermissions", user.role.Permisos);
      setUserPermissions(user.role.Permisos);
    }
    
    // Verificar que el token se guardó correctamente
    const savedToken = localStorage.getItem("token");
    console.log('Token guardado en localStorage:', savedToken?.substring(0, 20) + '...');
    console.log('Tokens coinciden:', token === savedToken);
    
    setIsAuthenticated(true);
    setUserRole(user.role?.Nombre_rol || 'user');
    setUserData(user);
    setIsLoading(false);
    
    // Redirigir según el rol
    if (user.role?.Nombre_rol === 'Administrador') {
      navigate("/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    localStorage.removeItem("userPermissions");
    
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
    setUserPermissions(null);
    setIsLoading(false);
    
    navigate("/auth/login");
  };

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column' 
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#666' }}>Cargando...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      userData, 
      userPermissions, 
      isLoading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Setting custom name for the context which is visible on react dev tools
MaterialUI.displayName = "MaterialUIContext";

// Material Dashboard 2 React reducer
function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV": {
      return { ...state, miniSidenav: action.value };
    }
    case "TRANSPARENT_SIDENAV": {
      return { ...state, transparentSidenav: action.value };
    }
    case "WHITE_SIDENAV": {
      return { ...state, whiteSidenav: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "DIRECTION": {
      return { ...state, direction: action.value };
    }
    case "LAYOUT": {
      return { ...state, layout: action.value };
    }
    case "DARKMODE": {
      return { ...state, darkMode: action.value };
    }
    case "LOAD_PREFERENCES": {
      return { ...state, ...action.preferences };
    }
    case "TABLE_HEADER_COLOR": {
      return { ...state, tableHeaderColor: action.value };
    }
    case "SUCURSALES_TABLE_HEADER_COLOR": {
      return { ...state, sucursalesTableHeaderColor: action.value };
    }
    case "SUCURSALES_TABLE_HEADER_TEXT": {
      return { ...state, sucursalesTableHeaderText: action.value };
    }
    case "SUCURSALES_TABLE_CELL_TEXT": {
      return { ...state, sucursalesTableCellText: action.value };
    }
    case "SUCURSALES_TABLE_ACTIVE_ICON": {
      return { ...state, sucursalesTableActiveIcon: action.value };
    }
    case "SUCURSALES_TABLE_INACTIVE_ICON": {
      return { ...state, sucursalesTableInactiveIcon: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Material Dashboard 2 React context provider
function MaterialUIControllerProvider({ children }) {
  const initialState = {
    miniSidenav: false,
    transparentSidenav: false,
    whiteSidenav: false,
    sidenavColor: "info",
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    direction: "ltr",
    layout: "dashboard",
    darkMode: false,
    tableHeaderColor: "azulSereno", // Color por defecto para headers de tabla
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  // Cargar preferencias del usuario al inicializar
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("userData");
        
        // Solo cargar preferencias si hay token Y datos de usuario
        if (token && userData) {
          console.log("Cargando preferencias del usuario...");
          const preferences = await PreferencesService.getUserPreferences();
          if (preferences && preferences.ui) {
            console.log("Preferencias cargadas, aplicando al contexto...");
            dispatch({ type: "LOAD_PREFERENCES", preferences: preferences.ui });
          }
        } else {
          console.log("No hay token o userData, usando valores por defecto");
        }
      } catch (error) {
        console.log("Error loading preferences, using defaults:", error);
      } finally {
        setPreferencesLoaded(true);
      }
    };

    // Esperar un poco para asegurar que el AuthContext se haya cargado
    const timeoutId = setTimeout(loadUserPreferences, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  // Función para guardar preferencias automáticamente cuando cambian
  const savePreferences = async (newState) => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");
      
      // Solo guardar si hay token, userData y las preferencias ya se cargaron
      if (token && userData && preferencesLoaded) {
        console.log("Guardando preferencias automáticamente...");
        const preferences = {
          ui: {
            miniSidenav: newState.miniSidenav,
            transparentSidenav: newState.transparentSidenav,
            whiteSidenav: newState.whiteSidenav,
            sidenavColor: newState.sidenavColor,
            transparentNavbar: newState.transparentNavbar,
            fixedNavbar: newState.fixedNavbar,
            darkMode: newState.darkMode,
            direction: newState.direction,
            layout: newState.layout,
            tableHeaderColor: newState.tableHeaderColor,
            sucursalesTableHeaderColor: newState.sucursalesTableHeaderColor,
            sucursalesTableHeaderText: newState.sucursalesTableHeaderText,
            sucursalesTableCellText: newState.sucursalesTableCellText,
            sucursalesTableActiveIcon: newState.sucursalesTableActiveIcon,
            sucursalesTableInactiveIcon: newState.sucursalesTableInactiveIcon
          }
        };
        
        const result = await PreferencesService.updateUserPreferences(preferences);
        console.log("Resultado del guardado:", result);
      } else {
        console.log("No se puede guardar: token=" + !!token + ", userData=" + !!userData + ", loaded=" + preferencesLoaded);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  // Auto-guardar cuando el estado cambia
  useEffect(() => {
    if (preferencesLoaded) {
      const timeoutId = setTimeout(() => {
        savePreferences(controller);
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(timeoutId);
    }
  }, [controller, preferencesLoaded]);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

// Material Dashboard 2 React custom hook for using context
function useMaterialUIController() {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }

  return context;
}

// Typechecking props for the MaterialUIControllerProvider
MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) => dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) => dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch, value) => dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });
const setTableHeaderColor = (dispatch, value) => dispatch({ type: "TABLE_HEADER_COLOR", value });

// Funciones para actualizar colores de la tabla de sucursales
const setSucursalesTableHeaderColor = (dispatch, value) => dispatch({ type: "SUCURSALES_TABLE_HEADER_COLOR", value });
const setSucursalesTableHeaderText = (dispatch, value) => dispatch({ type: "SUCURSALES_TABLE_HEADER_TEXT", value });
const setSucursalesTableCellText = (dispatch, value) => dispatch({ type: "SUCURSALES_TABLE_CELL_TEXT", value });
const setSucursalesTableActiveIcon = (dispatch, value) => dispatch({ type: "SUCURSALES_TABLE_ACTIVE_ICON", value });
const setSucursalesTableInactiveIcon = (dispatch, value) => dispatch({ type: "SUCURSALES_TABLE_INACTIVE_ICON", value });

export {
  AuthContextProvider,
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
  setTableHeaderColor,
  setSucursalesTableHeaderColor,
  setSucursalesTableHeaderText,
  setSucursalesTableCellText,
  setSucursalesTableActiveIcon,
  setSucursalesTableInactiveIcon,
  PreferencesService,
};
