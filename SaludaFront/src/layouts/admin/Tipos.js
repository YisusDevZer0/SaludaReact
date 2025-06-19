import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function Tipos() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h4" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Tipos
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center">
          Aquí podrás definir y organizar los diferentes tipos de productos.
        </MDTypography>
      </MDBox>
    </DashboardLayout>
  );
} 