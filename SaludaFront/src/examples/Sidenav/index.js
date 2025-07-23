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

import { useEffect, useContext } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import Avatar from "@mui/material/Avatar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  AuthContext
} from "context";

// Mock data para menús personalizados
import { getMockDataByRole } from "services/mock-user-service";
import defaultLogo from "assets/images/logo-ct.png";
import defaultAvatar from "assets/images/zero.png";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  
  // Acceso al contexto de autenticación
  const { userRole, userData, logout } = useContext(AuthContext);

  // Función para generar iniciales del usuario
  const getInitials = (userData) => {
    if (!userData) return "U";
    
    const nombre = userData.nombre || userData.nombre_completo || "";
    const apellido = userData.apellido || "";
    
    // Si tenemos nombre completo, extraer las iniciales
    if (userData.nombre_completo) {
      const nombres = userData.nombre_completo.split(' ');
      if (nombres.length >= 2) {
        return `${nombres[0].charAt(0)}${nombres[nombres.length - 1].charAt(0)}`.toUpperCase();
      } else if (nombres.length === 1) {
        return nombres[0].charAt(0).toUpperCase();
      }
    }
    
    // Fallback a nombre y apellido separados
    if (nombre && apellido) {
      return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    } else if (nombre) {
      return nombre.charAt(0).toUpperCase();
    }
    
    return "U";
  };

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /**
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Obtener elementos de menú personalizados según el rol
  const getRoleMenuItems = () => {
    if (!userRole) return [];
    
    const mockData = getMockDataByRole(userRole);
    return mockData && mockData.menuItems ? mockData.menuItems.filter(item => item.type === "collapse") : [];
  };

  // Obtener títulos del menú según el rol
  const getRoleMenuTitles = () => {
    if (!userRole) return [];
    
    const mockData = getMockDataByRole(userRole);
    return mockData && mockData.menuItems ? mockData.menuItems.filter(item => item.type === "title") : [];
  };

  // Elementos de menú personalizados según el rol
  const roleMenuItems = getRoleMenuItems();
  const roleMenuTitles = getRoleMenuTitles();

  // Filtrar rutas según el rol RH o Administrador Agendas
          const normalizedRole = typeof userRole === 'string' ? userRole.toLowerCase() : "";
  let filteredRoutes = routes;
  
  console.log('Sidenav - Rol del usuario:', userRole);
  console.log('Sidenav - Rol normalizado:', normalizedRole);
  console.log('Sidenav - Todas las rutas:', routes);
  
  if (normalizedRole === 'rh' || normalizedRole === 'desarrollo humano') {
    filteredRoutes = routes.filter(route => route.rhOnly === true);
  } else if (userRole === 'Administrador Agendas') {
    filteredRoutes = routes.filter(route => route.adminAgendasOnly === true);
  } else {
    filteredRoutes = routes.filter(route => route.rhOnly !== true && route.adminAgendasOnly !== true);
  }
  
  // Si no hay rutas filtradas, mostrar un mensaje de depuración
  if (filteredRoutes.length === 0) {
    console.log('Sidenav - No hay rutas filtradas para mostrar');
  }

  // Renderizar secciones completas de menú específicas por rol
  const renderRoleMenuSections = () => {
    if (!roleMenuItems.length || !roleMenuTitles.length) return null;

    // Asignar colores específicos según el rol
    const getTitleColor = (titleKey) => {
      const colorMap = {
        // Admin
        "admin-title": "info.main",
        "sales-title": "success.main",
        "inventory-title": "warning.main",
        "patients-title": "primary.main",
        "administration-title": "secondary.main",
        
        // Vendedor
        "products-title": "warning.main",
        "customers-title": "primary.main",
        "personal-title": "info.main",
        
        // Enfermero
        "daily-management-title": "info.main",
        "appointments-title": "success.main",
        "resources-title": "warning.main",
        "my-profile-title": "secondary.main",
        
        // Doctor
        "consultation-title": "info.main",
        "medical-consultation-title": "success.main",
        "references-title": "warning.main",
        
        // Farmacéutico
        "pharmacy-title": "info.main",
        "prescriptions-title": "success.main",
        "purchases-title": "warning.main"
      };
      
      return colorMap[titleKey] || "info.main";
    };

    // Agrupar elementos por título
    const menuSections = [];
    
    roleMenuTitles.forEach(title => {
      const sectionItems = roleMenuItems.filter(item => {
        // Encontrar los elementos que corresponden a esta sección
        // Asumimos que los elementos siguen a su título correspondiente en el array
        const titleIndex = roleMenuTitles.findIndex(t => t.key === title.key);
        const nextTitleIndex = roleMenuTitles.findIndex((t, i) => i > titleIndex && t.type === "title");
        
        const itemIndex = roleMenuItems.findIndex(i => i.key === item.key);
        const titleItemIndex = roleMenuItems.findIndex(i => {
          const match = roleMenuTitles.find(t => t.key === i.key);
          return match !== undefined;
        });
        
        return (
          (nextTitleIndex === -1 && itemIndex > titleItemIndex) || 
          (itemIndex > titleItemIndex && itemIndex < roleMenuItems.findIndex(i => {
            const match = roleMenuTitles.find(t => t.key === i.key && t.key !== title.key);
            return match !== undefined;
          }))
        );
      });
      
      if (sectionItems.length > 0) {
        menuSections.push({
          title,
          titleColor: getTitleColor(title.key),
          items: sectionItems
        });
      }
    });
    
    return menuSections.map(section => (
      <MDBox key={section.title.key} mb={2}>
        <MDTypography
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          pt={1}
          mt={2}
          mb={1}
          ml={1}
          sx={{
            fontSize: "0.75rem",
            letterSpacing: "0.1rem",
            borderLeft: `3px solid ${section.titleColor}`,
            paddingLeft: 2
          }}
        >
          {section.title.name}
        </MDTypography>
        {section.items.map(item => (
          <NavLink key={item.key} to={item.route}>
            <SidenavCollapse 
              name={item.name} 
              icon={item.icon && <Icon>{item.icon}</Icon>} 
              active={item.key === collapseName} 
            />
          </NavLink>
        ))}
      </MDBox>
    ));
  };

  // Render role-specific menu items individually if needed
  const renderRoleMenuItems = roleMenuItems.map(({ name, icon, key, route }) => (
    <NavLink key={key} to={route}>
      <SidenavCollapse 
        name={name} 
        icon={icon && <Icon>{icon}</Icon>} 
        active={key === collapseName} 
      />
    </NavLink>
  ));

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = filteredRoutes.map(({ type, name, icon, title, noCollapse, key, href, route }) => {
    let returnValue;

    // Solo mostrar elementos de tipo "auth" cuando no hay sesión activa
    if (type === "auth" && userData) {
      return null;
    }

    if (type === "collapse") {
      returnValue = href ? (
        <Link
          href={href}
          key={key}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavCollapse
            name={name}
            icon={icon}
            active={key === collapseName}
            noCollapse={noCollapse}
          />
        </Link>
      ) : (
        <NavLink key={key} to={route}>
          <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <MDTypography
          key={key}
          color={textColor}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </MDTypography>
      );
    } else if (type === "divider") {
      returnValue = (
        <Divider
          key={key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    }

    return returnValue;
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          component={NavLink}
          to="/"
          sx={{ mb: 1 }}
        >
          {/* Debug: Mostrar datos del usuario */}
          {console.log('Sidenav - Datos del usuario:', userData)}
          {console.log('Sidenav - Sucursal:', userData?.sucursal)}
          {console.log('Sidenav - Licencia:', userData?.licencia)}
          {/* Logo de la empresa */}
          <Avatar
            src={userData?.licencia?.logo_url || userData?.logo_url || defaultLogo}
            alt="Logo Empresa"
            sx={{ 
              width: 64, 
              height: 64, 
              mb: 1, 
              boxShadow: 3, 
              bgcolor: "white",
              border: ({ borders: { borderWidth }, palette: { white } }) => `${borderWidth[1]} solid ${white.main}`,
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.2s ease-in-out"
              }
            }}
          />
          
          {/* Nombre de la empresa/licencia */}
          <MDTypography
            component="h5"
            variant="h5"
            fontWeight="bold"
            color={textColor}
            sx={{ 
              fontSize: "1.25rem", 
              lineHeight: 1.2, 
              textAlign: 'center', 
              mt: 1,
              textShadow: "0 1px 2px rgba(0,0,0,0.3)"
            }}
          >
            {userData?.licencia?.nombre || userData?.licencia?.h_o_d || "Empresa"}
          </MDTypography>
          
          {/* Sucursal */}
          <MDTypography
            component="h6"
            variant="subtitle1"
            fontWeight="medium"
            color={textColor}
            sx={{ 
              fontSize: "1rem", 
              lineHeight: 1.1, 
              textAlign: 'center', 
              mb: 1,
              opacity: 0.9
            }}
          >
            {userData?.sucursal?.nombre || userData?.sucursal?.Nombre_Sucursal || "Sucursal"}
          </MDTypography>
          
          {/* Indicador de sistema activo */}
          <MDBox 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            bgcolor="rgba(76, 175, 80, 0.2)"
            borderRadius={1}
            px={1}
            py={0.5}
            mb={1}
          >
            <MDBox
              width={6}
              height={6}
              borderRadius="50%"
              bgcolor="success.main"
              mr={0.5}
            />
           
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      
      {/* Perfil de usuario (solo si hay sesión activa) */}
      {userData && (
        <MDBox p={2} textAlign="center">
          <MDBox mb={1} display="flex" justifyContent="center" position="relative">
            {/* Mostrar la URL del avatar para depuración */}
            {console.log('Avatar URL Sidenav:', userData.foto_perfil)}
            <MDAvatar
              src={userData.foto_perfil && userData.foto_perfil !== "" ? userData.foto_perfil : defaultAvatar}
              alt={userData.nombre_completo || userData.name}
              size="lg"
              bgColor={userData?.foto_perfil ? "transparent" : "info"}
              sx={{ border: ({ borders: { borderWidth }, palette: { white } }) => `${borderWidth[2]} solid ${white.main}` }}
            >
              {!userData?.foto_perfil && getInitials(userData)}
            </MDAvatar>
            {/* Indicador de estado online */}
            <MDBox
              position="absolute"
              bottom={0}
              right={0}
              width={16}
              height={16}
              borderRadius="50%"
              bgcolor="success.main"
              border={({ borders: { borderWidth }, palette: { white } }) => `${borderWidth[2]} solid ${white.main}`}
              sx={{
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": {
                    boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)"
                  },
                  "70%": {
                    boxShadow: "0 0 0 10px rgba(76, 175, 80, 0)"
                  },
                  "100%": {
                    boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)"
                  }
                }
              }}
            />
          </MDBox>
          
          {/* Nombre del usuario */}
          <MDTypography variant="h6" color={textColor} fontWeight="medium" mb={0.5}>
            {userData.nombre_completo || userData.name}
          </MDTypography>
          
          {/* Puesto/Cargo */}
          <MDTypography variant="caption" color="text" display="block" mb={0.5}>
            {userRole === "admin" ? "Administrador" :
             userRole === "seller" ? "Vendedor" :
             userRole === "nurse" ? "Enfermero" :
             userRole === "doctor" ? "Doctor" :
             userRole === "pharmacist" ? "Farmacéutico" :
             userRole === "Administrador Agendas" ? "Administrador Agendas" :
             userRole === "user" ? "Usuario" : "Usuario"}
          </MDTypography>
          
          {/* Estado online */}
          <MDBox display="flex" alignItems="center" justifyContent="center" mb={1}>
            <MDBox
              width={8}
              height={8}
              borderRadius="50%"
              bgcolor="success.main"
              mr={1}
            />
            <MDTypography variant="caption" color="success.main" fontWeight="medium">
              En línea
            </MDTypography>
          </MDBox>
          
          {/* Sucursal actual */}
          {userData.sucursal && (
            <MDBox 
              bgcolor="rgba(255,255,255,0.1)" 
              borderRadius={1} 
              p={1} 
              mb={1}
              sx={{ backdropFilter: "blur(10px)" }}
            >
              <MDTypography variant="caption" color={textColor} fontWeight="medium" display="block">
                Sucursal: {userData.sucursal.nombre || userData.sucursal.Nombre_Sucursal}
              </MDTypography>
              {userData.sucursal.ciudad && (
                <MDTypography variant="caption" color="text" fontSize="0.7rem">
                  {userData.sucursal.ciudad}
                </MDTypography>
              )}
            </MDBox>
          )}
          
          <Divider sx={{ my: 1 }} />
        </MDBox>
      )}
      
      <List>
        {/* Menú personalizado según el rol (solo si hay sesión activa) */}
        {userData && roleMenuItems.length > 0 && (
          <>
            <MDBox>
              {renderRoleMenuSections()}
            </MDBox>
            <Divider sx={{ my: 1 }} />
          </>
        )}
        
        {renderRoutes}
      </List>
      
      
      
      
      
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
