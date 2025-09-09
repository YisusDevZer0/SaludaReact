import { useState, useEffect, useContext } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Custom components
import TiposConsultaTable from "components/TiposConsultaTable";

// Context
import { AuthContext } from "context";

function TiposConsulta() {
  const authContext = useContext(AuthContext);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h4" fontWeight="bold" color="text" mb={2}>
                    <Icon sx={{ mr: 1, verticalAlign: 'middle' }}>medical_information</Icon>
                    Gestión de Tipos de Consulta
                  </MDTypography>
                  <MDTypography variant="body2" color="text" mb={3}>
                    Administra los tipos de consulta disponibles para cada especialidad médica.
                    Estos tipos aparecerán como opciones al agendar citas.
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        
        <MDBox>
          <TiposConsultaTable />
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TiposConsulta;
