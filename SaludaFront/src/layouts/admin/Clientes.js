/**
 * Clientes page
 * 
 * Esta página proporciona una interfaz completa para la gestión de clientes,
 * incluyendo funcionalidades CRUD, filtros avanzados, y estadísticas.
 */

import React from 'react';

// Componentes propios
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ClientesTable from "components/ClientesTable";

// Estilos
import "./Clientes.css";

function Clientes() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ClientesTable />
      <Footer />
    </DashboardLayout>
  );
}

export default Clientes; 