import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MarcasTable from "components/MarcasTable";

export default function Marcas() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MarcasTable />
      </MDBox>
    </DashboardLayout>
  );
} 