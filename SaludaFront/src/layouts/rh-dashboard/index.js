import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

export default function RhDashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={4}>
        <MDTypography variant="h3" fontWeight="bold" color="info" textAlign="center" mb={2}>
          Bienvenido al Dashboard de Recursos Humanos
        </MDTypography>
        <MDTypography variant="h6" textAlign="center" mb={4}>
          Aquí podrás gestionar personal, permisos, asistencias y más funciones específicas de RH.
        </MDTypography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Icon color="info" sx={{ fontSize: 40, mb: 1 }}>group</Icon>
              <MDTypography variant="h5" fontWeight="medium">Gestión de Personal</MDTypography>
              <MDTypography variant="body2" color="text" mb={2}>
                Consulta, edita y agrega empleados.
              </MDTypography>
              <MDButton color="info" variant="contained" href="/personal">
                Ver Personal
              </MDButton>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Icon color="success" sx={{ fontSize: 40, mb: 1 }}>schedule</Icon>
              <MDTypography variant="h5" fontWeight="medium">Asistencia</MDTypography>
              <MDTypography variant="body2" color="text" mb={2}>
                Revisa el reloj checador y reportes de asistencia.
              </MDTypography>
              <MDButton color="success" variant="contained" href="/rh/time-clock">
                Ver Asistencia
              </MDButton>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Icon color="warning" sx={{ fontSize: 40, mb: 1 }}>event_available</Icon>
              <MDTypography variant="h5" fontWeight="medium">Permisos y Vacaciones</MDTypography>
              <MDTypography variant="body2" color="text" mb={2}>
                Gestiona solicitudes de permisos y vacaciones.
              </MDTypography>
              <MDButton color="warning" variant="contained" href="/permisos">
                Ver Permisos
              </MDButton>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
} 