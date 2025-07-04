import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PresentacionesTable from "components/PresentacionesTable";

export default function Presentaciones() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h4" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Gestión de Presentaciones POS
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Administra las presentaciones de productos del sistema POS
        </MDTypography>
        
        {/* Tabla de presentaciones */}
        <PresentacionesTable />
      </MDBox>
    </DashboardLayout>
  );
} 