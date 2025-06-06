/**
=========================================================
* SaludaReact - Vista de Calendario para Administrador
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Calendar() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado y botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium">
                Calendario
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Vista general de eventos y citas
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
              Nuevo Evento
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="outlined" color="info" startIcon={<Icon>print</Icon>}>
                Imprimir
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Contenido del calendario */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6" color="text">
                  Calendario en desarrollo...
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Esta funcionalidad estará disponible próximamente.
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Calendar; 