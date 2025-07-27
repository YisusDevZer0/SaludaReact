import React, { useState, useEffect, useMemo, useContext } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

import { setupAxiosInterceptors } from "./services/interceptor";
import ProtectedRoute from "examples/ProtectedRoute";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";
import Login from "auth/login";
import Register from "auth/register";
import { AuthContext } from "context";
import UserProfile from "layouts/user-profile";
import UserManagement from "layouts/user-management";
import { Helmet } from "react-helmet";
import MDLoader from "components/MDLoader";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por ErrorBoundary:", error);
    console.error("Error info:", errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>Algo salió mal</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Ha ocurrido un error inesperado. Por favor, recarga la página.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              marginBottom: '20px', 
              padding: '10px', 
              backgroundColor: '#fff', 
              border: '1px solid #ddd',
              borderRadius: '5px',
              maxWidth: '600px',
              overflow: 'auto'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Detalles del error (solo desarrollo)
              </summary>
              <pre style={{ fontSize: '12px', color: '#666' }}>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '12px 24px',
              backgroundColor: '#C80096',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error handler
const handleGlobalError = (event) => {
  console.error("Error global capturado:", event.error);
  console.error("Error details:", {
    message: event.error?.message,
    stack: event.error?.stack,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
  
  // Prevenir que el error se muestre como [object Object]
  event.preventDefault();
};

// Global unhandled rejection handler
const handleUnhandledRejection = (event) => {
  console.error("Promesa rechazada no manejada:", event.reason);
  event.preventDefault();
};

export default function App() {
  const authContext = useContext(AuthContext);

  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // if the token expired or other errors it logs out and goes to the login page
  const navigate = useNavigate();
  setupAxiosInterceptors(() => {
    authContext.logout();
    navigate("/auth/login");
  });

  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(process.env.REACT_APP_IS_DEMO === "true");
  }, []);

  // Manejo de errores global
  const handleGlobalError = (event) => {
    console.error("Error global capturado:", event.error);
    console.error("Error details:", {
      message: event.error?.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  };

  const handleUnhandledRejection = (event) => {
    console.error("Promesa rechazada no manejada:", event.reason);
    event.preventDefault();
  };

  const handleUncaughtException = (event) => {
    console.error("Excepción no capturada:", event.error);
    event.preventDefault();
  };

  useEffect(() => {
    // Configurar manejadores de errores globales
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('uncaughtexception', handleUncaughtException);

    // Configurar interceptores de Axios
    setupAxiosInterceptors();

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('uncaughtexception', handleUncaughtException);
    };
  }, []);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route && route.type !== "auth") {
        return (
          <Route
            exact
            path={route.route}
            element={
              <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                {route.component}
              </ProtectedRoute>
            }
            key={route.key}
          />
        );
      }
      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ErrorBoundary>
      <>
        {isDemo && (
          <Helmet>
            <meta
              name="keywords"
              content="creative tim, updivision, material, laravel json:api, html dashboard, laravel, react, api admin, react laravel, html css dashboard laravel, material dashboard laravel, laravel api, react material dashboard, material admin, react dashboard, react admin, web dashboard, bootstrap 5 dashboard laravel, bootstrap 5, css3 dashboard, bootstrap 5 admin laravel, material dashboard bootstrap 5 laravel, frontend, api dashboard, responsive bootstrap 5 dashboard, api, material dashboard, material laravel bootstrap 5 dashboard, json:api"
            />
            <meta
              name="description"
              content="A free full stack app powered by MUI component library, React and Laravel, featuring dozens of handcrafted UI elements"
            />
            <meta
              itemProp="name"
              content="React Material Dashboard Laravel by Creative Tim & UPDIVISION"
            />
            <meta
              itemProp="description"
              content="A free full stack app powered by MUI component library, React and Laravel, featuring dozens of handcrafted UI elements"
            />
            <meta
              itemProp="image"
              content="https://s3.amazonaws.com/creativetim_bucket/products/686/original/react-material-dashboard-laravel.jpg?1664783836"
            />
            <meta name="twitter:card" content="product" />
            <meta name="twitter:site" content="@creativetim" />
            <meta
              name="twitter:title"
              content="React Material Dashboard Laravel by Creative Tim & UPDIVISION"
            />
            <meta
              name="twitter:description"
              content="A free full stack app powered by MUI component library, React and Laravel, featuring dozens of handcrafted UI elements"
            />
            <meta name="twitter:creator" content="@creativetim" />
            <meta
              name="twitter:image"
              content="https://s3.amazonaws.com/creativetim_bucket/products/686/original/react-material-dashboard-laravel.jpg?1664783836"
            />
            <meta property="fb:app_id" content="655968634437471" />
            <meta
              property="og:title"
              content="React Material Dashboard Laravel by Creative Tim & UPDIVISION"
            />
            <meta property="og:type" content="article" />
            <meta
              property="og:url"
              content="https://www.creative-tim.com/live/material-dashboard-react-laravel/"
            />
            <meta
              property="og:image"
              content="https://s3.amazonaws.com/creativetim_bucket/products/686/original/react-material-dashboard-laravel.jpg?1664783836"
            />
            <meta
              property="og:description"
              content="A free full stack app powered by MUI component library, React and Laravel, featuring dozens of handcrafted UI elements"
            />
            <meta property="og:site_name" content="Creative Tim" />
          </Helmet>
        )}
        {direction === "rtl" ? (
          <CacheProvider value={rtlCache}>
            <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
              <CssBaseline />
              {layout === "dashboard" && authContext.isAuthenticated && (
                <>
                  <Sidenav
                    color={sidenavColor}
                    brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                    brandName="Material Dashboard 2"
                    routes={routes}
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                  />
                  <Configurator />
                  {configsButton}
                </>
              )}
              {layout === "vr" && <Configurator />}
              <Routes>
                <Route path="login" element={<Navigate to="/auth/login" />} />
                <Route path="register" element={<Navigate to="/auth/register" />} />
                <Route path="forgot-password" element={<Navigate to="/auth/forgot-password" />} />
                {getRoutes(routes)}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
              <MDLoader open={false} />
            </ThemeProvider>
          </CacheProvider>
        ) : (
          <ThemeProvider theme={darkMode ? themeDark : theme}>
            <CssBaseline />
            {layout === "dashboard" && authContext.isAuthenticated && (
              <>
                <Sidenav
                  color={sidenavColor}
                  brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                  brandName="Material Dashboard 2"
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
                <Configurator />
                {configsButton}
              </>
            )}
            {layout === "vr" && <Configurator />}
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route
                exact
                path="user-profile"
                element={
                  <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                    <UserProfile />
                  </ProtectedRoute>
                }
                key="user-profile"
              />
              <Route
                exact
                path="user-management"
                element={
                  <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                    <UserManagement />
                  </ProtectedRoute>
                }
                key="user-management"
              />
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
            <MDLoader open={false} />
          </ThemeProvider>
        )}
      </>
    </ErrorBoundary>
  );
}
