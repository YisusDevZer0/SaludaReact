import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function Categorias() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h4" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Categorías
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center">
          Aquí podrás gestionar las categorías de productos.
        </MDTypography>
      </MDBox>
    </DashboardLayout>
  );
} 