// Saluda React layouts
import Dashboard from "layouts/dashboard";
import AdminCalendar from "./layouts/admin/Calendar";
import Profile from "layouts/profile";
import SellerPOS from "./layouts/seller/POS";
import AdminBranches from "./layouts/admin/Branches";
import AdminConfiguracion from "./layouts/admin/Configuracion";
import AdminTimeClock from "./layouts/admin/TimeClock";
import RhDashboard from "layouts/rh-dashboard";
import RHControlPersonal from "layouts/rh-dashboard/RHControlPersonal";
import PermisosVacaciones from "layouts/rh-dashboard/PermisosVacaciones";
import AdminAlmacenes from "layouts/admin/AdminAlmacenes";
import Categorias from "layouts/admin/Categorias";
import CategoriasPos from "layouts/admin/CategoriasPos";
import ComponenteActivo from "layouts/admin/ComponenteActivo";
import Tipos from "layouts/admin/Tipos";
import Presentaciones from "layouts/admin/Presentaciones";
import Marcas from "layouts/admin/Marcas";
import Servicios from "layouts/admin/Servicios";
import Almacenes from "layouts/admin/Almacenes";
import Productos from "layouts/admin/Productos";
import BulkUploadPage from "layouts/admin/BulkUploadPage";
import Stock from "layouts/admin/Stock";
import StockDashboard from "layouts/admin/StockDashboard";
import Proveedores from "layouts/admin/Proveedores";
import Clientes from "layouts/admin/Clientes";
import AdminAgendasDashboard from "layouts/admin-agendas";
import Agendas from "layouts/admin/Agendas";
import AgendaDeEspecialistas from "layouts/admin-agendas/AgendaDeEspecialistas";
import GestionProgramaciones from "layouts/admin-agendas/GestionProgramaciones";
import Personal from "layouts/admin/Personal";
import Traspasos from "layouts/admin/Traspasos";
import Inventory from "layouts/admin/Inventory";
import Sales from "layouts/admin/Sales";
import Appointments from "layouts/admin/Appointments";
import Ventas from "layouts/admin/Ventas";
import Compras from "layouts/admin/Compras";
import Cajas from "layouts/admin/Cajas";
import FondosCaja from "layouts/admin/FondosCaja";
import Gastos from "layouts/admin/Gastos";
import Encargos from "layouts/admin/Encargos";
import Tickets from "layouts/admin/Tickets";
import Asistencia from "layouts/admin/Asistencia";
import Sugerencias from "layouts/admin/Sugerencias";
// import Inventarios from "layouts/admin/Inventarios";
// import MovimientosInventario from "layouts/admin/MovimientosInventario";
// import AjustesInventario from "layouts/admin/AjustesInventario";
import Usuarios from "layouts/admin/Usuarios";
import ReportesVentas from "layouts/admin/ReportesVentas";
import ReportesInventario from "layouts/admin/ReportesInventario";
import ReportesFinancieros from "layouts/admin/ReportesFinancieros";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  // RUTAS GENERALES (para todos los usuarios)
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
    component: <Profile />,
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
    name: "Agendas Médicas",
    key: "admin-agendas",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/admin-agendas",
    component: <Agendas />,
  },
  {
    type: "collapse",
    name: "Agenda de Especialistas",
    key: "agenda-especialistas",
    icon: <Icon fontSize="small">medical_services</Icon>,
    route: "/agenda-especialistas",
    component: <AgendaDeEspecialistas />,
  },
  {
    type: "collapse",
    name: "Gestión de Programaciones",
    key: "gestion-programaciones",
    icon: <Icon fontSize="small">schedule</Icon>,
    route: "/gestion-programaciones",
    component: <GestionProgramaciones />,
  },
  {
    type: "collapse",
    name: "Configuración",
    key: "configuracion",
    icon: <Icon fontSize="small">settings</Icon>,
    route: "/admin/configuracion",
    component: <AdminConfiguracion />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Reloj Checador",
    key: "time-clock",
    icon: <Icon fontSize="small">access_time</Icon>,
    route: "/admin/time-clock",
    component: <AdminTimeClock />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Dashboard RH",
    key: "rh-dashboard",
    icon: <Icon fontSize="small">people_alt</Icon>,
    route: "/rh-dashboard",
    component: <RhDashboard />,
    rhOnly: true,
  },
  {
    type: "collapse",
    name: "Control de Personal",
    key: "rh-control-personal",
    icon: <Icon fontSize="small">group_work</Icon>,
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
    type: "title",
    title: "Almacenes e Inventarios",
    key: "almacenes-inventarios-title",
    icon: <Icon fontSize="small">inventory</Icon>,
  },
  {
    type: "collapse",
    name: "Dashboard Stock",
    key: "stock-dashboard",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/admin/stock-dashboard",
    component: <StockDashboard />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Stock",
    key: "stock",
    icon: <Icon fontSize="small">inventory_2</Icon>,
    route: "/admin/stock",
    component: <Stock />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Productos",
    key: "productos",
    icon: <Icon fontSize="small">category</Icon>,
    route: "/admin/productos",
    component: <Productos />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Carga Masiva",
    key: "bulk-upload",
    icon: <Icon fontSize="small">upload_file</Icon>,
    route: "/admin/bulk-upload",
    component: <BulkUploadPage />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Almacenes",
    key: "almacenes",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/admin/almacenes",
    component: <AdminAlmacenes />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Categorías",
    key: "categorias",
    icon: <Icon fontSize="small">category</Icon>,
    route: "/admin/categorias",
    component: <Categorias />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Categorías POS",
    key: "categorias-pos",
    icon: <Icon fontSize="small">point_of_sale</Icon>,
    route: "/admin/categorias-pos",
    component: <CategoriasPos />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Componente Activo",
    key: "componente-activo",
    icon: <Icon fontSize="small">medication</Icon>,
    route: "/admin/componente-activo",
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

  //INICIA GESTIÓN COMERCIAL
  {
    type: "title",
    title: "Gestión comercial",
    key: "gestion-comercial-title",
    icon: <Icon fontSize="small">business</Icon>,
  },
  {
    type: "collapse",
    name: "Ventas",
    key: "sales",
    icon: <Icon fontSize="small">shopping_cart</Icon>,
    route: "/admin/sales",
    component: <Sales />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Fondos de Caja",
    key: "fondos-caja",
    icon: <Icon fontSize="small">account_balance</Icon>,
    route: "/admin/fondos-caja",
    component: <FondosCaja />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Ventas",
    key: "ventas",
    icon: <Icon fontSize="small">shopping_cart</Icon>,
    route: "/admin/ventas",
    component: <Ventas />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Compras",
    key: "compras",
    icon: <Icon fontSize="small">shopping_basket</Icon>,
    route: "/admin/compras",
    component: <Compras />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Cajas",
    key: "cajas",
    icon: <Icon fontSize="small">account_balance_wallet</Icon>,
    route: "/admin/cajas",
    component: <Cajas />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Gastos",
    key: "gastos",
    icon: <Icon fontSize="small">receipt</Icon>,
    route: "/admin/gastos",
    component: <Gastos />,
    adminOnly: true, // Solo administradores pueden acceder
  },
  {
    type: "collapse",
    name: "Encargos",
    key: "encargos",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/admin/encargos",
    component: <Encargos />,
    adminOnly: true, // Solo administradores pueden acceder
  },
  {
    type: "collapse",
    name: "Tickets y Soporte",
    key: "tickets",
    icon: <Icon fontSize="small">bug_report</Icon>,
    route: "/admin/tickets",
    component: <Tickets />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Control de Asistencia",
    key: "asistencia",
    icon: <Icon fontSize="small">access_time</Icon>,
    route: "/admin/asistencia",
    component: <Asistencia />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Sugerencias",
    key: "sugerencias",
    icon: <Icon fontSize="small">lightbulb</Icon>,
    route: "/admin/sugerencias",
    component: <Sugerencias />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Traspasos",
    key: "traspasos",
    icon: <Icon fontSize="small">swap_horiz</Icon>,
    route: "/admin/traspasos",
    component: <Traspasos />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Inventario",
    key: "inventory",
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/admin/inventory",
    component: <Inventory />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Citas",
    key: "appointments",
    icon: <Icon fontSize="small">event_note</Icon>,
    route: "/admin/appointments",
    component: <Appointments />,
    adminOnly: true,
  },
  
  //INICIA ADMINISTRACIÓN
  {
    type: "title",
    title: "Administración",
    key: "administracion-title",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "usuarios",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/admin/usuarios",
    component: <Usuarios />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Personal",
    key: "personal",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/admin/personal",
    component: <Personal />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Proveedores",
    key: "proveedores",
    icon: <Icon fontSize="small">business</Icon>,
    route: "/admin/proveedores",
    component: <Proveedores />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Clientes",
    key: "clientes",
    icon: <Icon fontSize="small">people_outline</Icon>,
    route: "/admin/clientes",
    component: <Clientes />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Reportes de Ventas",
    key: "reportes-ventas",
    icon: <Icon fontSize="small">assessment</Icon>,
    route: "/admin/reportes-ventas",
    component: <ReportesVentas />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Reportes de Inventario",
    key: "reportes-inventario",
    icon: <Icon fontSize="small">inventory_2</Icon>,
    route: "/admin/reportes-inventario",
    component: <ReportesInventario />,
    adminOnly: true,
  },
  {
    type: "collapse",
    name: "Reportes Financieros",
    key: "reportes-financieros",
    icon: <Icon fontSize="small">account_balance</Icon>,
    route: "/admin/reportes-financieros",
    component: <ReportesFinancieros />,
    adminOnly: true,
  },
];

export default routes;
