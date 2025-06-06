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
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav  .

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";

import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Profile from "layouts/profile";
import UserProfile from "layouts/user-profile";
import UserManagement from "layouts/user-management";

import Login from "auth/login";
import Register from "auth/register";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";

// Vistas de administrador
import AdminSales from "./layouts/admin/Sales";
import AdminInventory from "./layouts/admin/Inventory";
import AdminAppointments from "./layouts/admin/Appointments";
import AdminCalendar from "./layouts/admin/Calendar";
import AdminProfile from "layouts/admin/profile";
// Nuevas vistas de administrador basadas en la imagen
import AdminInventarios from "./layouts/admin/Inventarios";
import AdminAlmacen from "./layouts/admin/Almacen";
import AdminCompras from "./layouts/admin/Compras";
import AdminTraspasos from "./layouts/admin/Traspasos";
import AdminPersonal from "./layouts/admin/Personal";
import AdminConfiguracion from "./layouts/admin/Configuracion";

// Vistas de vendedor
import SellerPOS from "./layouts/seller/POS";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  // Menú principal de administrador
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
    name: "Ventas",
    key: "sales",
    icon: <Icon fontSize="small">point_of_sale</Icon>,
    route: "/sales",
    component: <AdminSales />,
  },
  {
    type: "collapse",
    name: "Inventario",
    key: "inventory",
    icon: <Icon fontSize="small">inventory</Icon>,
    route: "/inventory",
    component: <AdminInventory />,
  },
  {
    type: "collapse",
    name: "Citas",
    key: "appointments",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/appointments",
    component: <AdminAppointments />,
  },
  // Nuevas opciones para administrador
  {
    type: "collapse",
    name: "Almacén",
    key: "almacen",
    icon: <Icon fontSize="small">warehouse</Icon>,
    route: "/almacen",
    component: <AdminAlmacen />,
  },
  {
    type: "collapse",
    name: "Compras",
    key: "compras",
    icon: <Icon fontSize="small">shopping_cart</Icon>,
    route: "/compras",
    component: <AdminCompras />,
  },
  {
    type: "collapse",
    name: "Traspasos",
    key: "traspasos",
    icon: <Icon fontSize="small">swap_horiz</Icon>,
    route: "/traspasos",
    component: <AdminTraspasos />,
  },
  {
    type: "collapse",
    name: "Inventarios",
    key: "inventarios",
    icon: <Icon fontSize="small">list_alt</Icon>,
    route: "/inventarios",
    component: <AdminInventarios />,
  },
  {
    type: "collapse",
    name: "Personal",
    key: "personal",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/personal",
    component: <AdminPersonal />,
  },
  {
    type: "collapse",
    name: "Configuración",
    key: "configuracion",
    icon: <Icon fontSize="small">settings</Icon>,
    route: "/configuracion",
    component: <AdminConfiguracion />,
  },
  // Vista de vendedor
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
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <AdminProfile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "examples",
    name: "User Profile",
    key: "user-profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/user-profile",
    component: <UserProfile />,
  },
  {
    type: "examples",
    name: "User Management",
    key: "user-management",
    icon: <Icon fontSize="small">list</Icon>,
    route: "/user-management",
    component: <UserManagement />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "auth",
    name: "Login",
    key: "login",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/auth/login",
    component: <Login />,
  },
  {
    type: "auth",
    name: "Register",
    key: "register",
    icon: <Icon fontSize="small">reigster</Icon>,
    route: "/auth/register",
    component: <Register />,
  },
  {
    type: "auth",
    name: "Forgot Password",
    key: "forgot-password",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/auth/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "auth",
    name: "Reset Password",
    key: "reset-password",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/auth/reset-password",
    component: <ResetPassword />,
  },
];

export default routes;
