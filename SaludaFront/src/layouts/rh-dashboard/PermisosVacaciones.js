import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

export default function PermisosVacaciones() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={4}>
        <Card sx={{ maxWidth: 500, mx: "auto", p: 4, textAlign: "center", boxShadow: 3 }}>
          <Icon sx={{ fontSize: 48, color: "#FFA000", mb: 1 }}>event_available</Icon>
          <MDTypography variant="h4" fontWeight="bold" mb={1}>
            Permisos y Vacaciones
          </MDTypography>
          <MDTypography variant="body1" color="text" mb={3}>
            Aquí podrás gestionar solicitudes de permisos y vacaciones del personal.
          </MDTypography>
          <MDTypography variant="body2" color="text" fontWeight="medium">
            (Próximamente: listado, alta y gestión de solicitudes)
          </MDTypography>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
} 