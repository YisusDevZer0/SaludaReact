/**
 * SALUDA - Centro Médico Familiar
 * Componente de Navbar para el Dashboard
 */

import { useState, useEffect, useContext } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import LogoutIcon from '@mui/icons-material/Logout';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

import AuthService from "services/auth-service";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
  setNavbarColor,
  setNavbarShadow,
  setNavbarPosition,
} from "context";
import MDButton from "components/MDButton";
import { AuthContext } from "context";

// Custom components
import ThemedModal from "components/ThemedModal";

// Defining SALUDA colors as constants
const SALUDA_COLORS = {
  primary: "#C80096",
  secondary: "#00a8E1",
  accent: "#00C7B1",
  text: "#2c3e50",
  light: "#f8f9fa",
  dark: "#344767",
  success: "#2DCE89",
  warning: "#FB6340",
  error: "#F5365C",
  info: "#11CDEF",
  darkBlue: "#0A2558",
  lightBlue: "#E3F2FD",
  gray: "#6c757d",
  lightGray: "#f8f9fa",
  darkGray: "#343a40",
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
  overlay: "rgba(0, 0, 0, 0.5)",
  shadow: "rgba(0, 0, 0, 0.1)",
  border: "#e0e0e0",
  background: "#f5f5f5",
  surface: "#ffffff",
  text: {
    primary: "#344767",
    secondary: "#67748e",
    disabled: "#adb5bd",
    inverse: "#ffffff",
  },
  status: {
    info: {
      main: "#1A73E8",
      background: "#E3F2FD",
      contrastText: "#ffffff",
    },
    success: {
      main: "#2DCE89",
      background: "#E8F5E8",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#FB6340",
      background: "#FFF3E0",
      contrastText: "#ffffff",
    },
    error: {
      main: "#F5365C",
      background: "#FFEBEE",
      contrastText: "#ffffff",
    },
  },
};

function DashboardNavbar({ absolute, light, isMini }) {
  const authContext = useContext(AuthContext);
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { 
    miniSidenav, 
    transparentNavbar, 
    fixedNavbar, 
    openConfigurator, 
    darkMode,
    navbarColor,
    navbarShadow,
    navbarPosition
  } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [currentTime, setCurrentTime] = useState("");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // Random messages for the welcome section
  const messages = [
    "¡Bienvenido a SALUDA! Tu salud es nuestra prioridad.",
    "Cuidando tu salud con profesionalismo y calidez.",
    "Tu farmacia de confianza, siempre cerca de ti.",
    "Atención médica de calidad para toda la familia.",
    "Más que una farmacia, somos tu aliado en salud.",
    "Comprometidos con tu bienestar integral.",
    "Tu salud, nuestra pasión."
  ];
  
  const [randomMessage, setRandomMessage] = useState("");

  // Obtener datos de usuario y licencia
  const { userData } = authContext;
  const licencia = userData?.licencia || "";
  const isDemo = typeof licencia === 'string' && licencia.toLowerCase().includes("demo");

  useEffect(() => {
    // Establecer un mensaje aleatorio
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomMessage(messages[randomIndex]);

    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    // Update current time
    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    // The event listener that's calling the handleTransparentNavbar function when scrolling
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener and interval on cleanup
    return () => {
      window.removeEventListener("scroll", handleTransparentNavbar);
      clearInterval(intervalId);
    };
  }, [dispatch, fixedNavbar]);

  const updateTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes} ${ampm}`);
  };

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Revisar nuevos mensajes" />
      <NotificationItem icon={<Icon>medical_services</Icon>} title="Administrar citas médicas" />
      <NotificationItem icon={<Icon>payments</Icon>} title="Pago completado exitosamente" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const handleLogOut = async () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      // Intentar hacer logout en el servidor
      await AuthService.logout();
    } catch (error) {
      console.error("Error al hacer logout en el servidor:", error);
      // Continuar con el logout local aunque falle en el servidor
    } finally {
      // Siempre hacer logout local y limpiar el estado
      authContext.logout();
      setLogoutModalOpen(false);
      navigate("/auth/login", { replace: true });
    }
  };

  const cancelLogout = () => {
    setLogoutModalOpen(false);
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarPosition}
      color="inherit"
      sx={(theme) => ({
        ...navbar(theme, { transparentNavbar, absolute, light, darkMode }),
        background: navbarColor === 'info' 
          ? `linear-gradient(135deg, ${SALUDA_COLORS.primary} 0%, ${SALUDA_COLORS.secondary} 100%)`
          : `linear-gradient(135deg, ${theme.palette[navbarColor]?.main || SALUDA_COLORS.primary} 0%, ${theme.palette[navbarColor]?.dark || SALUDA_COLORS.secondary} 100%)`,
        boxShadow: navbarShadow ? "0 5px 15px rgba(0, 0, 0, 0.2)" : "none",
        borderRadius: "0px 0px 15px 15px",
        opacity: transparentNavbar ? 0.9 : 1
      })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color={SALUDA_COLORS.light} mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <MDBox display="flex" alignItems="center">
            <LocalHospitalIcon fontSize="large" sx={{ mr: 1, color: SALUDA_COLORS.light }} /> 
            <MDBox>
              <MDTypography variant="h5" fontWeight="bold" color={SALUDA_COLORS.light}>
                SALUDA
              </MDTypography>
              <MDTypography variant="caption" color={SALUDA_COLORS.light} sx={{ opacity: 0.8 }}>
                Centro Médico Familiar
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox 
            ml={2} 
            mt={0.5} 
            display="flex" 
            flexDirection="column" 
            alignItems="center"
          >
            <MDBox display="flex" alignItems="center">
              <AccessTimeIcon sx={{ mr: 0.5, fontSize: "small", color: SALUDA_COLORS.light }} />
              <MDTypography variant="caption" color={SALUDA_COLORS.light}>
                Son las {currentTime}
              </MDTypography>
            </MDBox>
            <MDTypography 
              variant="caption" 
              color="#fff"
              sx={{ fontStyle: "italic", opacity: 1, fontWeight: 500 }}
            >
              {randomMessage}
            </MDTypography>
          </MDBox>
        </MDBox>
        
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* Mostrar el buscador solo si la licencia NO es Demo */}
            {!isDemo && (
              <MDBox 
                display="flex" 
                alignItems="center"
                pr={2} 
                sx={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", px: 1 }}
              >
                <MDInput 
                  label="Buscar" 
                  sx={{ 
                    "& .MuiInputBase-root": { color: SALUDA_COLORS.light },
                    "& .MuiInputLabel-root": { color: `${SALUDA_COLORS.light} !important` },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" }
                  }}
                />
              </MDBox>
            )}
            <MDBox display="flex" alignItems="center" color={SALUDA_COLORS.light}>
              {/* Botón de toggle del sidenav */}
              <IconButton
                size="small"
                color="inherit"
                sx={{ ...navbarIconButton, color: SALUDA_COLORS.light }}
                onClick={handleMiniSidenav}
                title={miniSidenav ? "Expandir menú" : "Comprimir menú"}
              >
                <Icon>{miniSidenav ? "menu_open" : "menu"}</Icon>
              </IconButton>
              <Link to="/profile">
                <IconButton sx={{ ...navbarIconButton, color: SALUDA_COLORS.light }} size="small">
                  <Icon>account_circle</Icon>
                </IconButton>
              </Link>
              {/* Ocultar configurador si la licencia es Demo */}
              {!isDemo && (
                <IconButton
                  size="small"
                  color="inherit"
                  sx={{ ...navbarIconButton, color: SALUDA_COLORS.light }}
                  onClick={handleConfiguratorOpen}
                >
                  <Icon>settings</Icon>
                </IconButton>
              )}
              <IconButton
                size="small"
                color="inherit"
                sx={{ ...navbarIconButton, color: SALUDA_COLORS.light }}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon>notifications</Icon>
              </IconButton>
              {renderMenu()}
              <MDBox ml={1}>
                <IconButton
                  size="small"
                  color="inherit"
                  sx={{ ...navbarIconButton, color: SALUDA_COLORS.light }}
                  onClick={handleLogOut}
                  title="Cerrar sesión"
                >
                  <LogoutIcon />
                </IconButton>
              </MDBox>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
      <ThemedModal
        open={logoutModalOpen}
        onClose={cancelLogout}
        title="¿Cerrar sesión?"
      >
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cerrar la sesión? Deberás volver a iniciar sesión para acceder nuevamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={cancelLogout} color="info" variant="text">
            Cancelar
          </MDButton>
          <MDButton onClick={confirmLogout} color="error" variant="contained">
            Cerrar Sesión
          </MDButton>
        </DialogActions>
      </ThemedModal>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
