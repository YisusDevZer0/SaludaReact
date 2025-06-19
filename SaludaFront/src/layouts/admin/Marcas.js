import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function Marcas() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <MDTypography variant="h4" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Marcas
        </MDTypography>
        <MDTypography variant="body1" color="text" textAlign="center">
          Aquí podrás administrar las marcas asociadas a los productos.
        </MDTypography>
      </MDBox>
    </DashboardLayout>
  );
} 