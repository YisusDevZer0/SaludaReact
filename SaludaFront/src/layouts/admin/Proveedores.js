/**
 * Proveedores page
 * 
 * Esta página proporciona una interfaz completa para la gestión de proveedores,
 * incluyendo funcionalidades CRUD, filtros avanzados, y estadísticas.
 */

import React from 'react';

// Componentes propios
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProveedoresTable from "components/ProveedoresTable";

// Estilos
import "./Proveedores.css";

function Proveedores() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ProveedoresTable />
      <Footer />
    </DashboardLayout>
  );
}

export default Proveedores; 