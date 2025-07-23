import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SucursalesTable from "components/SucursalesTable";
import TableThemeProvider from "components/StandardDataTable/TableThemeProvider";

const Branches = () => (
  <DashboardLayout>
    <DashboardNavbar />
    <MDBox py={3}>
      <MDTypography variant="h4" fontWeight="bold">
        Sucursales
      </MDTypography>
      <TableThemeProvider>
      <SucursalesTable />
      </TableThemeProvider>
    </MDBox>
    <Footer />
  </DashboardLayout>
);

export default Branches; 