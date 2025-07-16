import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import ServiciosTable from "components/ServiciosTable";

export default function Servicios() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <ServiciosTable />
      </MDBox>
    </DashboardLayout>
  );
} 