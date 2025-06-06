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

// Material Dashboard 2 React main context
const MaterialUI = createContext();

// authentication context
export const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  userData: null,
  userPermissions: null,
  login: () => {},
  register: () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userPermissions, setUserPermissions] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("userRole");
  const storedUserData = localStorage.getItem("userData");
  const storedPermissions = localStorage.getItem("userPermissions");

  useEffect(() => {
    if (!token) return;

    if (storedRole) {
      console.log('Rol almacenado:', storedRole); // Debug log
      setUserRole(storedRole);
    }
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        console.log('Datos del usuario parseados:', parsedData); // Debug log
        setUserData(parsedData);
        // Extraer permisos del rol
        if (parsedData.role && parsedData.role.Permisos) {
          setUserPermissions(parsedData.role.Permisos);
          localStorage.setItem("userPermissions", parsedData.role.Permisos);
        }
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
      }
    }

    setIsAuthenticated(true);
    navigate(location.pathname);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    setIsAuthenticated(isAuthenticated);
    navigate(location.pathname);
  }, [isAuthenticated]);

  const login = (token, refreshToken, user = {}) => {
    console.log('Datos del usuario recibidos en login:', user); // Debug log
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userRole", user.role?.Nombre_rol || 'user');
    localStorage.setItem("userData", JSON.stringify(user));
    if (user.role?.Permisos) {
      localStorage.setItem("userPermissions", user.role.Permisos);
      setUserPermissions(user.role.Permisos);
    }
    
    setIsAuthenticated(true);
    setUserRole(user.role?.Nombre_rol || 'user');
    setUserData(user);
    
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
    
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      userData, 
      userPermissions, 
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
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

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
};
