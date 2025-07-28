import React, { useState, useEffect } from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import {
  Assignment as AssignmentIcon,
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
import encargoService from "services/encargo-service";

// Definición de columnas para la tabla
const columns = [
  {
    name: "ID",
    selector: row => row.id,
    sortable: true,
    width: "80px",
  },
  {
    name: "Cliente",
    selector: row => row.cliente?.razon_social || `${row.cliente?.nombre} ${row.cliente?.apellido}`,
    sortable: true,
    width: "200px",
  },
  {
    name: "Descripción",
    selector: row => row.descripcion,
    sortable: true,
    width: "250px",
  },
  {
    name: "Estado",
    selector: row => row.estado,
    sortable: true,
    width: "120px",
    format: row => {
      const estados = {
        'solicitado': 'Solicitado',
        'en_proceso': 'En Proceso',
        'listo': 'Listo',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado',
        'vencido': 'Vencido'
      };
      return estados[row.estado] || row.estado;
    },
  },
  {
    name: "Prioridad",
    selector: row => row.prioridad,
    sortable: true,
    width: "100px",
    format: row => {
      const prioridades = {
        'baja': 'Baja',
        'normal': 'Normal',
        'alta': 'Alta',
        'urgente': 'Urgente'
      };
      return prioridades[row.prioridad] || row.prioridad;
    },
  },
  {
    name: "Urgente",
    selector: row => row.urgente,
    sortable: true,
    width: "100px",
    format: row => row.urgente ? "SÍ" : "NO",
  },
  {
    name: "Monto Estimado",
    selector: row => row.monto_estimado,
    sortable: true,
    width: "140px",
    format: row => row.monto_estimado ? `$${parseFloat(row.monto_estimado).toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : "-",
  },
  {
    name: "Fecha Entrega",
    selector: row => row.fecha_entrega_estimada,
    sortable: true,
    width: "130px",
    format: row => new Date(row.fecha_entrega_estimada).toLocaleDateString('es-ES'),
  },
  {
    name: "Sucursal",
    selector: row => row.sucursal?.nombre || "N/A",
    sortable: true,
    width: "150px",
  },
];

function Encargos() {
  const [statistics, setStatistics] = useState({
    total_encargos: 0,
    encargos_entregados: 0,
    encargos_urgentes: 0,
    encargos_por_vencer: 0
  });

  // Cargar estadísticas
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const response = await encargoService.getStatistics();
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
                  Encargos
                </MDTypography>
                <MDTypography variant="body2" color="white" opacity={0.8}>
                  Gestión de encargos del sistema
                </MDTypography>
              </MDBox>
              
              {/* Estadísticas */}
              <MDBox p={3}>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="primary">
                          {statistics.total_encargos || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Total Encargos
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="success">
                          {statistics.total_entregados || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Entregados
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <WarningIcon color="warning" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="warning">
                          {statistics.total_urgentes || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Urgentes
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <ErrorIcon color="error" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="error">
                          {statistics.total_por_vencer || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Por Vencer
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>

                {/* Tabla */}
                <TableThemeProvider>
                  <StandardDataTable
                    service={encargoService}
                    endpoint="encargos"
                    columns={columns}
                    title="Encargos"
                    subtitle="Gestión de encargos del sistema"
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
                        key: 'estado',
                        label: 'Estado',
                        options: [
                          { value: 'solicitado', label: 'Solicitado' },
                          { value: 'en_proceso', label: 'En Proceso' },
                          { value: 'listo', label: 'Listo' },
                          { value: 'entregado', label: 'Entregado' },
                          { value: 'cancelado', label: 'Cancelado' },
                          { value: 'vencido', label: 'Vencido' }
                        ]
                      },
                      {
                        type: 'select',
                        key: 'prioridad',
                        label: 'Prioridad',
                        options: [
                          { value: 'baja', label: 'Baja' },
                          { value: 'normal', label: 'Normal' },
                          { value: 'alta', label: 'Alta' },
                          { value: 'urgente', label: 'Urgente' }
                        ]
                      },
                      {
                        type: 'select',
                        key: 'urgente',
                        label: 'Urgente',
                        options: [
                          { value: 'true', label: 'Sí' },
                          { value: 'false', label: 'No' }
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

export default Encargos; 