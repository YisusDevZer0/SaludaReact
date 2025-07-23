import React from "react";
import { Card, Typography } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function MovimientosInventario() {
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Movimientos de Inventario
          </MDTypography>
          <MDTypography variant="button" color="text">
            Administra los movimientos de inventario del sistema
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={3}>
        <Typography variant="body1" color="textSecondary">
          Módulo de Movimientos de Inventario - En desarrollo
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Aquí se mostrará la tabla de movimientos de inventario con todas las funcionalidades CRUD.
        </Typography>
      </MDBox>
    </Card>
  );
}

export default MovimientosInventario; 