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
import PillLoader from "../components/PillLoader";
import "../components/PillLoader.css";
import AuthService from "services/auth-service";

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
      const rememberMe = localStorage.getItem("rememberMe") === "true";

      if (token && storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          console.log('Restaurando sesión:', parsedData);
          console.log('Recordarme activado:', rememberMe);
          
          setIsAuthenticated(true);
          setUserRole(storedRole);
          setUserData(parsedData);
          
          // Restaurar permisos
          if (parsedData.role && parsedData.role.Permisos) {
            setUserPermissions(parsedData.role.Permisos);
          } else if (storedPermissions) {
            setUserPermissions(storedPermissions);
          }
          
          // Solo redirigir si está en login y no está en proceso de login
          if ((location.pathname === '/auth/login' || location.pathname === '/') && !isLoading) {
            // Redirigir según el rol
            if (storedRole === 'Administrador') {
              navigate("/dashboard");
            } else if (storedRole === 'RH' || storedRole === 'Desarrollo Humano') {
              navigate("/rh-dashboard");
            } else if (storedRole === 'Administrador Agendas') {
              navigate("/admin-agendas");
            } else {
              navigate("/dashboard");
            }
          }
          
          // Redirigir si un administrador de agendas accede al dashboard general
          if (location.pathname === '/dashboard' && storedRole === 'Administrador Agendas') {
            navigate("/admin-agendas");
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
  }, [location.pathname, isLoading]); // Agregar isLoading como dependencia

  const login = async (token, refreshToken, user = {}) => {
    try {
      console.log('Datos del usuario recibidos en login:', user); // Debug log
      console.log('Token recibido en login:', token?.substring(0, 20) + '...'); // Debug token
      console.log('Token length:', token?.length); // Debug token length
      const userRole = user.role?.Nombre_rol || 'user';
      console.log('Rol del usuario a guardar:', userRole); // Debug log del rol

      // Guardar datos en localStorage inmediatamente
      localStorage.setItem("token", token);
      localStorage.setItem("access_token", token); // También guardar como access_token para compatibilidad
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userData", JSON.stringify(user));
      if (user.role?.Permisos) {
        localStorage.setItem("userPermissions", user.role.Permisos);
        setUserPermissions(user.role.Permisos);
      }

      // Actualizar estado inmediatamente
      setIsAuthenticated(true);
      setUserRole(userRole);
      setUserData(user);
      setIsLoading(false);

      // Obtener perfil actualizado (logo_url, licencia, etc.) en segundo plano
      try {
        console.log('Obteniendo perfil del usuario...'); // Debug log
        const profile = await AuthService.getProfile();
        console.log('Perfil obtenido:', profile); // Debug log
        
        if (profile && profile.data && profile.data.attributes) {
          const userDataProfile = { ...user, ...profile.data.attributes };
          console.log('Datos del usuario con perfil:', userDataProfile); // Debug log
          setUserData(userDataProfile);
          localStorage.setItem("userData", JSON.stringify(userDataProfile));
        }
      } catch (profileError) {
        console.error("Error al obtener perfil después de login:", profileError);
        // No fallar el login si no se puede obtener el perfil
      }

      // Verificar que el token se guardó correctamente
      const savedToken = localStorage.getItem("token");
      const savedRole = localStorage.getItem("userRole");
      console.log('Token guardado en localStorage:', savedToken?.substring(0, 20) + '...');
      console.log('Rol guardado en localStorage:', savedRole);
      console.log('Tokens coinciden:', token === savedToken);
      console.log('Roles coinciden:', userRole === savedRole);

      // Redirigir según el rol inmediatamente
      console.log('Redirigiendo según rol:', userRole);
      if (userRole === 'Administrador') {
        navigate("/dashboard");
      } else if (userRole === 'RH' || userRole === 'Desarrollo Humano') {
        navigate("/rh-dashboard");
      } else if (userRole === 'Administrador Agendas') {
        navigate("/admin-agendas");
      } else {
        navigate("/dashboard");
      }
    } catch (e) {
      console.error("Error en login:", e);
      // En caso de error, limpiar localStorage y redirigir a login
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
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
      throw e;
    }
  };

  const logout = () => {
    try {
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      
      // Si "Recordarme" está activado, solo limpiar datos de sesión pero mantener email
      if (rememberMe) {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userData");
        localStorage.removeItem("userPermissions");
        localStorage.removeItem("token_expires_at");
        // Mantener rememberMe y savedEmail
      } else {
        // Si "Recordarme" no está activado, limpiar todo
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userData");
        localStorage.removeItem("userPermissions");
        localStorage.removeItem("token_expires_at");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }
      
      // Limpiar estado
      setIsAuthenticated(false);
      setUserRole(null);
      setUserData(null);
      setUserPermissions(null);
      setIsLoading(false);
      
      console.log("Logout completado exitosamente");
      console.log("Recordarme mantenido:", rememberMe);
      
      // Redirigir a login
      navigate("/auth/login");
    } catch (error) {
      console.error("Error durante el logout:", error);
      // Asegurar que al menos se redirija al login
      navigate("/auth/login");
    }
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
        <PillLoader message="Cargando..." />
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

// Hook para usar el contexto de autenticación
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
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
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "NAVBAR_COLOR": {
      return { ...state, navbarColor: action.value };
    }
    case "NAVBAR_SHADOW": {
      return { ...state, navbarShadow: action.value };
    }
    case "NAVBAR_POSITION": {
      return { ...state, navbarPosition: action.value };
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
    transparentNavbar: true,
    navbarColor: "info",
    navbarShadow: true,
    navbarPosition: "fixed",
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
          if (preferences && preferences.data) {
            console.log("Preferencias cargadas, aplicando al contexto...");
            const uiPreferences = {
              sidenavColor: preferences.data.sidenav_color,
              transparentSidenav: preferences.data.transparent_sidenav,
              whiteSidenav: preferences.data.white_sidenav,
              fixedNavbar: preferences.data.fixed_navbar,
              darkMode: preferences.data.dark_mode,
              miniSidenav: preferences.data.mini_sidenav,
              navbarColor: preferences.data.navbar_color,
              transparentNavbar: preferences.data.transparent_navbar,
              navbarShadow: preferences.data.navbar_shadow,
              navbarPosition: preferences.data.navbar_position,
              layout: preferences.data.layout,
              direction: preferences.data.direction,
              tableHeaderColor: preferences.data.table_header_color
            };
            dispatch({ type: "LOAD_PREFERENCES", preferences: uiPreferences });
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
        // Verificar que el usuario esté autenticado en el contexto
        let authContext = null;
        try {
          authContext = JSON.parse(userData);
          console.log("AuthContext parseado:", authContext);
        } catch (error) {
          console.error("Error parsing userData in savePreferences:", error);
          return;
        }
        if (!authContext || !authContext.id) {
          console.log("Usuario no válido, saltando guardado de preferencias. AuthContext:", authContext);
          return;
        }
        
        console.log("Guardando preferencias automáticamente...");
        console.log("Estado actual:", newState);
        const preferences = {
          sidenav_color: newState.sidenavColor,
          transparent_sidenav: newState.transparentSidenav,
          white_sidenav: newState.whiteSidenav,
          fixed_navbar: newState.fixedNavbar,
          dark_mode: newState.darkMode,
          mini_sidenav: newState.miniSidenav,
          navbar_color: newState.navbarColor,
          transparent_navbar: newState.transparentNavbar,
          navbar_shadow: newState.navbarShadow,
          navbar_position: newState.navbarPosition,
          layout: newState.layout,
          direction: newState.direction,
          table_header_color: newState.tableHeaderColor
        };
        console.log("Preferencias a enviar:", preferences);
        
        const result = await PreferencesService.updateUserPreferences(preferences);
        console.log("Resultado del guardado:", result);
        
        // Si hay error de autenticación, no continuar guardando
        if (result && result.message === "No autenticado") {
          console.log("Error de autenticación al guardar preferencias, deteniendo auto-guardado");
          return;
        }
      } else {
        console.log("No se puede guardar: token=" + !!token + ", userData=" + !!userData + ", loaded=" + preferencesLoaded);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      
      // Si es error 401, no intentar más guardados por un tiempo
      if (error.status === 401) {
        console.log("Error 401 al guardar preferencias, pausando auto-guardado");
        // Pausar el auto-guardado por 30 segundos
        setTimeout(() => {
          console.log("Reanudando auto-guardado de preferencias");
        }, 30000);
        return;
      }
    }
  };

  // Auto-guardar cuando el estado cambia (con mejor control)
  useEffect(() => {
    if (preferencesLoaded) {
      // Solo auto-guardar si el usuario está realmente autenticado
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");
      
      if (token && userData) {
        const timeoutId = setTimeout(() => {
          savePreferences(controller);
        }, 2000); // Aumentar debounce a 2 segundos para reducir requests

        return () => clearTimeout(timeoutId);
      }
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
const setNavbarColor = (dispatch, value) => dispatch({ type: "NAVBAR_COLOR", value });
const setNavbarShadow = (dispatch, value) => dispatch({ type: "NAVBAR_SHADOW", value });
const setNavbarPosition = (dispatch, value) => dispatch({ type: "NAVBAR_POSITION", value });
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
  useAuth,
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
  setNavbarColor,
  setNavbarShadow,
  setNavbarPosition,
  setTableHeaderColor,
  setSucursalesTableHeaderColor,
  setSucursalesTableHeaderText,
  setSucursalesTableCellText,
  setSucursalesTableActiveIcon,
  setSucursalesTableInactiveIcon,
  PreferencesService,
};
