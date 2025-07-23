import React from "react";
import { Card, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Gastos() {
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Gestión de Gastos
          </MDTypography>
          <MDTypography variant="button" color="text">
            Administra los gastos del sistema
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={3}>
        <Typography variant="body1" color="textSecondary">
          Módulo de Gastos - En desarrollo
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Aquí se mostrará la tabla de gastos con todas las funcionalidades CRUD.
        </Typography>
      </MDBox>
    </Card>
  );
}

export default Gastos; 