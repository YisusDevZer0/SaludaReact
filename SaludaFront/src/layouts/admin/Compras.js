/**
=========================================================
* SaludaReact - Gestión de Compras para Administrador
=========================================================
*/

import React, { useState, useEffect } from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
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
import compraService from "services/compra-service";

// Definición de columnas para la tabla
const columns = [
  {
    name: "ID",
    selector: row => row.id,
    sortable: true,
    width: "80px",
  },
  {
    name: "Proveedor",
    selector: row => row.proveedor?.nombre || row.proveedor?.razon_social || "N/A",
    sortable: true,
    width: "200px",
  },
  {
    name: "Número de Compra",
    selector: row => row.numero_compra,
    sortable: true,
    width: "150px",
  },
  {
    name: "Fecha",
    selector: row => row.fecha_compra,
    sortable: true,
    width: "120px",
    format: row => new Date(row.fecha_compra).toLocaleDateString('es-ES'),
  },
  {
    name: "Total",
    selector: row => row.total,
    sortable: true,
    width: "130px",
    format: row => `$${parseFloat(row.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
  },
  {
    name: "Estado",
    selector: row => row.estado,
    sortable: true,
    width: "120px",
    format: row => {
      const estados = {
        'pendiente': 'Pendiente',
        'aprobada': 'Aprobada',
        'en_proceso': 'En Proceso',
        'recibida': 'Recibida',
        'cancelada': 'Cancelada',
        'devuelta': 'Devuelta'
      };
      return estados[row.estado] || row.estado;
    },
  },
  {
    name: "Sucursal",
    selector: row => row.sucursal?.nombre || "N/A",
    sortable: true,
    width: "150px",
  },
  {
    name: "Método de Pago",
    selector: row => row.metodo_pago,
    sortable: true,
    width: "140px",
    format: row => {
      const metodos = {
        'efectivo': 'Efectivo',
        'transferencia': 'Transferencia',
        'cheque': 'Cheque',
        'credito': 'Crédito'
      };
      return metodos[row.metodo_pago] || row.metodo_pago;
    },
  },
  {
    name: "Observaciones",
    selector: row => row.observaciones,
    sortable: false,
    width: "200px",
    format: row => row.observaciones ? (row.observaciones.length > 30 ? row.observaciones.substring(0, 30) + '...' : row.observaciones) : "-",
  },
];

function Compras() {
  const [statistics, setStatistics] = useState({
    total_compras: 0,
    compras_pendientes: 0,
    compras_aprobadas: 0,
    total_monto: 0
  });
  const [loading, setLoading] = useState(true);

  // Cargar estadísticas
  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await compraService.getEstadisticas();
      if (response && response.success && response.data) {
        setStatistics(response.data);
      } else {
        // Si no hay datos, mantener los valores por defecto
        setStatistics({
          total_compras: 0,
          compras_pendientes: 0,
          compras_aprobadas: 0,
          total_monto: 0
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // En caso de error, mantener los valores por defecto
      setStatistics({
        total_compras: 0,
        compras_pendientes: 0,
        compras_aprobadas: 0,
        total_monto: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                {/* Encabezado */}
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <MDBox>
                    <MDTypography variant="h4" fontWeight="medium">
                      Gestión de Compras
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Administra las compras del sistema
                    </MDTypography>
                  </MDBox>
                  <MDBox>
                    <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </MDBox>
                </MDBox>

                {/* Estadísticas */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="primary">
                          {statistics.total_compras || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Total Compras
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <WarningIcon color="warning" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="warning">
                          {statistics.compras_pendientes || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Pendientes
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="success">
                          {statistics.compras_aprobadas || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Aprobadas
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <Typography variant="h6" color="info">
                          ${parseFloat(statistics.total_monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </Typography>
                        <MDTypography variant="button" color="text">
                          Total Monto
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>

                {/* Tabla */}
                <TableThemeProvider>
                  <StandardDataTable
                    service={compraService}
                    endpoint="compras"
                    columns={columns}
                    title="Compras"
                    subtitle="Gestión de compras del sistema"
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
                          { value: 'pendiente', label: 'Pendiente' },
                          { value: 'aprobada', label: 'Aprobada' },
                          { value: 'en_proceso', label: 'En Proceso' },
                          { value: 'recibida', label: 'Recibida' },
                          { value: 'cancelada', label: 'Cancelada' },
                          { value: 'devuelta', label: 'Devuelta' }
                        ]
                      },
                      {
                        type: 'select',
                        key: 'metodo_pago',
                        label: 'Método de Pago',
                        options: [
                          { value: 'efectivo', label: 'Efectivo' },
                          { value: 'transferencia', label: 'Transferencia' },
                          { value: 'cheque', label: 'Cheque' },
                          { value: 'credito', label: 'Crédito' }
                        ]
                      },
                      {
                        type: 'date',
                        key: 'fecha_compra',
                        label: 'Fecha de Compra'
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

export default Compras; 