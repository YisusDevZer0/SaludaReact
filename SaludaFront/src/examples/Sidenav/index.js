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
  const normalizedRole = (userRole || "").toLowerCase();
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
          <Avatar
            src={userData?.logo_url || defaultLogo}
            alt="Logo Empresa"
            sx={{ width: 56, height: 56, mb: 1, boxShadow: 2, bgcolor: "white" }}
          />
          <MDTypography
            component="h5"
            variant="h5"
            fontWeight="bold"
            color={textColor}
            sx={{ fontSize: "1.35rem", lineHeight: 1.2, textAlign: 'center', mt: 1 }}
          >
            {userData?.ID_H_O_D || "Licencia"}
          </MDTypography>
          <MDTypography
            component="h6"
            variant="subtitle1"
            fontWeight="medium"
            color={textColor}
            sx={{ fontSize: "1.1rem", lineHeight: 1.1, textAlign: 'center', mb: 1 }}
          >
            {userData?.sucursal?.Nombre_Sucursal || "Sucursal"}
          </MDTypography>
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
          <MDBox mb={1} display="flex" justifyContent="center">
            {/* Mostrar la URL del avatar para depuración */}
            {console.log('Avatar URL Sidenav:', userData.avatar_url)}
            <MDAvatar
              src={userData.avatar_url && userData.avatar_url !== "" ? userData.avatar_url : defaultAvatar}
              alt={userData.name}
              size="lg"
              bgColor={userData?.avatar_url ? "transparent" : "info"}
              sx={{ border: ({ borders: { borderWidth }, palette: { white } }) => `${borderWidth[2]} solid ${white.main}` }}
            />
          </MDBox>
          <MDTypography variant="h6" color={textColor} fontWeight="medium">
            {userData.name}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            {userRole === "admin" ? "Administrador" :
             userRole === "seller" ? "Vendedor" :
             userRole === "nurse" ? "Enfermero" :
             userRole === "doctor" ? "Doctor" :
             userRole === "pharmacist" ? "Farmacéutico" :
             userRole === "Administrador Agendas" ? "Administrador Agendas" : "Usuario"}
          </MDTypography>
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
