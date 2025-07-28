import React, { useState, useEffect } from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Componentes de tabla
import StandardDataTable from "components/StandardDataTable";
import TableThemeProvider from "components/StandardDataTable/TableThemeProvider";

// Servicios
import fondosCajaService from "services/fondos-caja-service";

// Definición de columnas para la tabla
const columns = [
  {
    name: "Código",
    selector: row => row.codigo,
    sortable: true,
    width: "120px",
  },
  {
    name: "Nombre",
    selector: row => row.nombre,
    sortable: true,
    width: "200px",
  },
  {
    name: "Caja",
    selector: row => row.caja?.nombre || "N/A",
    sortable: true,
    width: "150px",
  },
  {
    name: "Sucursal",
    selector: row => row.sucursal?.nombre || "N/A",
    sortable: true,
    width: "150px",
  },
  {
    name: "Saldo Actual",
    selector: row => row.saldo_actual,
    sortable: true,
    width: "130px",
    format: row => `$${parseFloat(row.saldo_actual || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
  },
  {
    name: "Fondo de Caja",
    selector: row => row.fondo_caja,
    sortable: true,
    width: "140px",
    format: row => `$${parseFloat(row.fondo_caja || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
  },
  {
    name: "Tipo",
    selector: row => row.tipo_fondo,
    sortable: true,
    width: "100px",
    format: row => {
      const tipos = {
        'efectivo': 'Efectivo',
        'mixto': 'Mixto',
        'digital': 'Digital'
      };
      return tipos[row.tipo_fondo] || row.tipo_fondo;
    },
  },
  {
    name: "Estado",
    selector: row => row.estatus,
    sortable: true,
    width: "120px",
    format: row => {
      const estados = {
        'activo': 'Activo',
        'inactivo': 'Inactivo',
        'suspendido': 'Suspendido'
      };
      return estados[row.estatus] || row.estatus;
    },
  },
  {
    name: "Saldo Mínimo",
    selector: row => row.saldo_minimo,
    sortable: true,
    width: "130px",
    format: row => `$${parseFloat(row.saldo_minimo || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
  },
  {
    name: "Saldo Máximo",
    selector: row => row.saldo_maximo,
    sortable: true,
    width: "130px",
    format: row => row.saldo_maximo ? `$${parseFloat(row.saldo_maximo).toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : "Sin límite",
  },
];

function FondosCaja() {
  const [statistics, setStatistics] = useState({
    total_fondos: 0,
    fondos_activos: 0,
    fondos_saldo_bajo: 0,
    total_saldo_fondos: 0
  });

  // Cargar estadísticas
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const response = await fondosCajaService.getStatistics();
        if (response && response.data) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };
    loadStatistics();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Fondos de Caja
                </MDTypography>
                <MDTypography variant="body2" color="white" opacity={0.8}>
                  Gestión de fondos de caja del sistema
                </MDTypography>
              </MDBox>
              
              {/* Estadísticas */}
              <MDBox p={3}>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <AccountBalanceIcon color="primary" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="primary">
                          {statistics.total_fondos || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Total Fondos
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="success">
                          {statistics.fondos_activos || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Fondos Activos
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <WarningIcon color="warning" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="warning">
                          {statistics.fondos_saldo_bajo || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Saldo Bajo
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <Typography variant="h6" color="info">
                          ${parseFloat(statistics.total_saldo_fondos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </Typography>
                        <MDTypography variant="button" color="text">
                          Saldo Total
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>

                {/* Tabla */}
                <TableThemeProvider>
                  <StandardDataTable
                    service={fondosCajaService}
                    endpoint="fondos-caja"
                    columns={columns}
                    title="Fondos de Caja"
                    subtitle="Gestión de fondos de caja del sistema"
                    enableCreate={true}
                    enableEdit={true}
                    enableDelete={true}
                    enableBulkActions={false}
                    enableExport={true}
                    enableStats={true}
                    enableFilters={true}
                    enableSearch={true}
                    serverSide={true}
                    defaultPageSize={15}
                    defaultSortField="id"
                    defaultSortDirection="desc"
                    availableFilters={[
                      {
                        type: 'select',
                        key: 'estatus',
                        label: 'Estado',
                        options: [
                          { value: 'activo', label: 'Activo' },
                          { value: 'inactivo', label: 'Inactivo' },
                          { value: 'suspendido', label: 'Suspendido' }
                        ]
                      },
                      {
                        type: 'select',
                        key: 'tipo_fondo',
                        label: 'Tipo de Fondo',
                        options: [
                          { value: 'efectivo', label: 'Efectivo' },
                          { value: 'mixto', label: 'Mixto' },
                          { value: 'digital', label: 'Digital' }
                        ]
                      }
                    ]}
                    permissions={{
                      create: true,
                      edit: true,
                      delete: true,
                      view: true
                    }}
                    cardProps={{
                      sx: { 
                        boxShadow: 3,
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: 6,
                          transition: 'box-shadow 0.3s ease'
                        }
                      }
                    }}
                  />
                </TableThemeProvider>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default FondosCaja; 