import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ComponentesTable from "components/ComponentesTable";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

function ComponenteActivo() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <MDTypography variant="h6" color="primary" component={Link} to="/admin">
                      <Icon>home</Icon>
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular" mx={1}>
                      /
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      Administrador
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular" mx={1}>
                      /
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="regular" color="text">
                      Componentes Activos
                    </MDTypography>
                  </MDBox>
                  <Card>
                    <MDBox p={3} bgcolor="white">
                      <MDTypography variant="h3" color="primary" mb={1}>
                        Gestión de Componentes Activos
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        Administra los componentes activos del sistema médico
                      </MDTypography>
                    </MDBox>
                    <MDBox px={3} pb={3}>
                      <ComponentesTable />
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ComponenteActivo; 