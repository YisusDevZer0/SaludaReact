// Saluda React layouts
import Dashboard from "layouts/dashboard";
import AdminCalendar from "./layouts/admin/Calendar";
import AdminProfile from "layouts/admin/profile";
import SellerPOS from "./layouts/seller/POS";
import AdminBranches from "./layouts/admin/Branches";
import AdminConfiguracion from "./layouts/admin/Configuracion";
import AdminTimeClock from "./layouts/admin/TimeClock";
import RhDashboard from "layouts/rh-dashboard";
import RHControlPersonal from "layouts/rh-dashboard/RHControlPersonal";
import PermisosVacaciones from "layouts/rh-dashboard/PermisosVacaciones";
import AdminAlmacenes from "layouts/admin/AdminAlmacenes";
import Categorias from "layouts/admin/Categorias";
import ComponenteActivo from "layouts/admin/ComponenteActivo";
import Tipos from "layouts/admin/Tipos";
import Presentaciones from "layouts/admin/Presentaciones";
import Marcas from "layouts/admin/Marcas";
import Servicios from "layouts/admin/Servicios";
import Almacenes from "layouts/admin/Almacenes";
import AdminAgendasDashboard from "layouts/admin-agendas";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  // RUTAS GENERALES (para administradores y otros roles)
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Perfil",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <AdminProfile />,
  },
  {
    type: "collapse",
    name: "Sucursales",
    key: "branches",
    icon: <Icon fontSize="small">store</Icon>,
    route: "/branches",
    component: <AdminBranches />,
  },
  {
    type: "collapse",
    name: "Calendario",
    key: "calendar",
    icon: <Icon fontSize="small">calendar_today</Icon>,
    route: "/calendar",
    component: <AdminCalendar />,
  },
  {
    type: "collapse",
    name: "Punto de Venta",
    key: "pos",
    icon: <Icon fontSize="small">point_of_sale</Icon>,
    route: "/pos",
    component: <SellerPOS />,
  },
  {
    type: "collapse",
    name: "Configuración",
    key: "configuracion",
    icon: <Icon fontSize="small">settings</Icon>,
    route: "/admin/configuracion",
    component: <AdminConfiguracion />,
    protected: true,
    adminOnly: true,
  },
  //INICIA ALMACENES E INVENTARIOS
  {
    type: "title",
    title: "Almacenes e inventarios",
    key: "almacenes-inventarios-title",
    icon: <Icon fontSize="small">inventory</Icon>,
  },
  {
    type: "collapse",
    name: "Configuraciones",
    key: "admin-almacenes",
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/admin/almacenes",
    component: <AdminAlmacenes />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Almacenes",
    key: "almacenes-gestion",
    icon: <Icon fontSize="small">storage</Icon>,
    route: "/admin/almacenes/gestion",
    component: <Almacenes />,
    adminOnly: true,
  },
  {
    type: "route",
    key: "almacenes-categorias",
    route: "/admin/almacenes/categorias",
    component: <Categorias />,
    adminOnly: true,
  },
  {
    type: "route",
    key: "almacenes-componente-activo",
    route: "/admin/almacenes/componentes-activos",
    component: <ComponenteActivo />,
    adminOnly: true,
  },
  {
    type: "route",
    key: "almacenes-tipos",
    route: "/admin/almacenes/tipos",
    component: <Tipos />,
    adminOnly: true,
  },
  {
    type: "route",
    key: "almacenes-presentaciones",
    route: "/admin/almacenes/presentaciones",
    component: <Presentaciones />,
    adminOnly: true,
  },
  {
    type: "route",
    key: "almacenes-marcas",
    route: "/admin/almacenes/marcas",
    component: <Marcas />,
    adminOnly: true,
  },
  {
    type: "route",
    key: "almacenes-servicios",
    route: "/admin/almacenes/servicios",
    component: <Servicios />,
    adminOnly: true,
  },
  //FIN ALMACENES E INVENTARIOS

  //INICIA CONTROL DE PERSONAL (para administradores)
  {
    type: "title",
    title: "Control de personal",
    key: "control-personal-title",
    icon: <Icon fontSize="small">person</Icon>,
  },
  {
    type: "collapse",
    name: "Reloj Checador",
    key: "timeclock",
    icon: <Icon fontSize="small">schedule</Icon>,
    route: "/time-clock",
    component: <AdminTimeClock />,
  },
  {
    type: "collapse",
    name: "Control de personal",
    key: "control-personal-rh",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/rh/control-personal",
    component: <RHControlPersonal />,
    
  },
  // RUTAS EXCLUSIVAS PARA RH
  {
    type: "title",
    title: "Recursos Humanos",
    key: "rh-title",
    icon: <Icon fontSize="small">people</Icon>,
    rhOnly: true,
  },
  {
    type: "collapse",
    name: "Dashboard RH",
    key: "rh-dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/rh-dashboard",
    component: <RhDashboard />,
    rhOnly: true,
  },
  {
    type: "collapse",
    name: "Reloj Checador RH",
    key: "timeclock-rh",
    icon: <Icon fontSize="small">schedule</Icon>,
    route: "/rh/time-clock",
    component: <AdminTimeClock />,
    rhOnly: true,
  },
  {
    type: "collapse",
    name: "Control de personal",
    key: "control-personal-rh",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/rh/control-personal",
    component: <RHControlPersonal />,
    rhOnly: true,
  },
  {
    type: "collapse",
    name: "Permisos y Vacaciones",
    key: "permisos-vacaciones",
    icon: <Icon fontSize="small">event_available</Icon>,
    route: "/permisos",
    component: <PermisosVacaciones />,
    rhOnly: true,
  },
  {
    type: "collapse",
    name: "Agendas",
    key: "admin-agendas",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/admin-agendas",
    component: <AdminAgendasDashboard />,
    protected: true,
    adminAgendasOnly: true,
  },
];

export default routes;
