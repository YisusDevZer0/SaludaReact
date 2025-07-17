/**
 * Productos page
 * 
 * Esta página proporciona una interfaz completa para la gestión de productos
 * médicos, incluyendo funcionalidades CRUD, filtros avanzados, y estadísticas.
 */

import React from 'react';

// Componentes propios
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProductosTable from "components/ProductosTable";

// Estilos
import "./Productos.css";

function Productos() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ProductosTable />
      <Footer />
    </DashboardLayout>
  );
}

export default Productos; 