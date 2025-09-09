import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  LocalHospital as LocalHospitalIcon,
  AccessTime as AccessTimeIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Colores del sistema SaludaReact
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
  white: "#ffffff",
  gray: "#6c757d",
  lightGray: "#f8f9fa",
  darkGray: "#343a40"
};

const ProfessionalNavbar = ({ 
  title = "SALUDA", 
  subtitle = "Centro Médico Familiar",
  onMenuClick,
  onSearch,
  onNotifications,
  onSettings,
  onProfile,
  onLogout,
  notificationCount = 0,
  user = { name: "Usuario", role: "Administrador" }
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{
        background: `linear-gradient(135deg, ${SALUDA_COLORS.primary} 0%, ${SALUDA_COLORS.secondary} 100%)`,
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
        borderRadius: "0px 0px 15px 15px",
        minHeight: 75,
        display: "grid",
        alignItems: "center",
        paddingTop: 1,
        paddingBottom: 1,
        paddingRight: 1,
        paddingLeft: 2,
      }}
    >
      <Toolbar sx={{ 
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "auto",
        padding: "4px 16px",
      }}>
        <MDBox color={SALUDA_COLORS.light} display="flex" alignItems="center">
          <MDBox display="flex" alignItems="center">
            <LocalHospitalIcon fontSize="large" sx={{ mr: 1, color: SALUDA_COLORS.light }} /> 
            <MDBox>
              <MDTypography variant="h5" fontWeight="bold" color={SALUDA_COLORS.light}>
                {title}
              </MDTypography>
              <MDTypography variant="caption" color={SALUDA_COLORS.light} sx={{ opacity: 0.8 }}>
                {subtitle}
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox 
            ml={2} 
            mt={0.5}
            display="flex" 
            alignItems="center"
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              px: 2,
              py: 0.5,
            }}
          >
            <AccessTimeIcon sx={{ color: SALUDA_COLORS.light, mr: 1, fontSize: 20 }} />
            <MDTypography variant="body2" color={SALUDA_COLORS.light} sx={{ mr: 1 }}>
              Son las {getCurrentTime()}
            </MDTypography>
            <Chip 
              label="En línea" 
              size="small" 
              sx={{ 
                bgcolor: SALUDA_COLORS.success,
                color: SALUDA_COLORS.white,
                fontSize: '0.7rem',
                height: 20
              }} 
            />
          </MDBox>

          <MDTypography 
            variant="body2" 
            color={SALUDA_COLORS.light}
            sx={{ 
              fontStyle: 'italic',
              ml: 3,
              display: { xs: 'none', md: 'block' },
              opacity: 0.9
            }}
          >
            Más que una farmacia, somos tu aliado en salud.
          </MDTypography>
        </MDBox>

        <MDBox display="flex" alignItems="center" gap={1}>
          {/* Barra de búsqueda */}
          <MDBox
            display="flex"
            alignItems="center"
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: 3,
              px: 2,
              py: 0.5,
              minWidth: 200,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            <SearchIcon sx={{ color: SALUDA_COLORS.light, mr: 1, fontSize: 20 }} />
            <MDTypography 
              variant="body2" 
              color={SALUDA_COLORS.light}
              sx={{ 
                opacity: 0.7,
                cursor: 'pointer',
                flexGrow: 1
              }}
              onClick={onSearch}
            >
              Buscar...
            </MDTypography>
          </MDBox>

          {/* Iconos de acción */}
          <MDBox display="flex" alignItems="center" gap={0.5}>
            {/* Notificaciones */}
            <IconButton 
              color="inherit" 
              onClick={handleNotificationMenuOpen}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                color: SALUDA_COLORS.light
              }}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Configuración */}
            <IconButton 
              color="inherit" 
              onClick={onSettings}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                color: SALUDA_COLORS.light
              }}
            >
              <SettingsIcon />
            </IconButton>

            {/* Menú hamburguesa */}
            <IconButton 
              color="inherit" 
              onClick={onMenuClick}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                color: SALUDA_COLORS.light
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Perfil */}
            <IconButton 
              color="inherit" 
              onClick={handleProfileMenuOpen}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                color: SALUDA_COLORS.light
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
          </MDBox>
        </MDBox>
      </Toolbar>

      {/* Menú de perfil */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <MDBox sx={{ px: 2, py: 1 }}>
          <MDTypography variant="subtitle2" fontWeight="bold">
            {user.name}
          </MDTypography>
          <MDTypography variant="body2" color="text">
            {user.role}
          </MDTypography>
        </MDBox>
        <Divider />
        <MenuItem onClick={onProfile}>
          <AccountCircleIcon sx={{ mr: 2 }} />
          Mi Perfil
        </MenuItem>
        <MenuItem onClick={onSettings}>
          <SettingsIcon sx={{ mr: 2 }} />
          Configuración
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout} sx={{ color: 'error.main' }}>
          <ExitToAppIcon sx={{ mr: 2 }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Menú de notificaciones */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <MDBox sx={{ px: 2, py: 1 }}>
          <MDTypography variant="subtitle2" fontWeight="bold">
            Notificaciones
          </MDTypography>
        </MDBox>
        <Divider />
        <MenuItem>
          <MDTypography variant="body2">
            No hay notificaciones nuevas
          </MDTypography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default ProfessionalNavbar;
