/**
=========================================================
* SaludaReact - Reportes de Ventas para Administrador
=========================================================
*/

import React, { useState, useEffect } from "react";
import { Grid, Card, Typography, Box, Tabs, Tab } from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
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
import reportesService from "services/reportes-service";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reportes-tabpanel-${index}`}
      aria-labelledby={`reportes-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ReportesVentas() {
  const [tabValue, setTabValue] = useState(0);
  const [ventasData, setVentasData] = useState([]);
  const [productosData, setProductosData] = useState([]);
  const [vendedoresData, setVendedoresData] = useState([]);
  const [ventasPorDiaData, setVentasPorDiaData] = useState([]);
  const [metodosPagoData, setMetodosPagoData] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadEstadisticasGenerales();
  }, []);

  const loadEstadisticasGenerales = async () => {
    try {
      setLoading(true);
      const response = await reportesService.estadisticasGeneralesVentas();
      if (response.success) {
        setEstadisticas(response.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    loadDataForTab(newValue);
  };

  const loadDataForTab = async (tabIndex) => {
    try {
      setLoading(true);
      
      switch (tabIndex) {
        case 0: // Ventas por período
          const ventasResponse = await reportesService.ventasPorPeriodo();
          if (ventasResponse.success) {
            setVentasData(ventasResponse.data);
          }
          break;
          
        case 1: // Productos más vendidos
          const productosResponse = await reportesService.productosMasVendidos();
          if (productosResponse.success) {
            setProductosData(productosResponse.data);
          }
          break;
          
        case 2: // Rendimiento por vendedor
          const vendedoresResponse = await reportesService.rendimientoPorVendedor();
          if (vendedoresResponse.success) {
            setVendedoresData(vendedoresResponse.data);
          }
          break;
          
        case 3: // Ventas por día
          const ventasPorDiaResponse = await reportesService.ventasPorDia();
          if (ventasPorDiaResponse.success) {
            setVentasPorDiaData(ventasPorDiaResponse.data);
          }
          break;
          
        case 4: // Métodos de pago
          const metodosPagoResponse = await reportesService.metodosPagoUtilizados();
          if (metodosPagoResponse.success) {
            setMetodosPagoData(metodosPagoResponse.data);
          }
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error('Error al cargar datos del tab:', error);
    } finally {
      setLoading(false);
    }
  };

  // Columnas para ventas por período
  const ventasColumns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Folio",
      selector: row => row.folio || `V-${row.id}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Fecha",
      selector: row => row.created_at,
      sortable: true,
      width: "120px",
      format: row => new Date(row.created_at).toLocaleDateString('es-ES'),
    },
    {
      name: "Cliente",
      selector: row => row.cliente?.nombre || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Vendedor",
      selector: row => row.usuario?.name || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Total",
      selector: row => row.total,
      sortable: true,
      width: "130px",
      format: row => `$${parseFloat(row.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Método Pago",
      selector: row => row.metodo_pago,
      sortable: true,
      width: "140px",
      format: row => {
        const metodos = {
          'efectivo': 'Efectivo',
          'tarjeta': 'Tarjeta',
          'transferencia': 'Transferencia',
          'credito': 'Crédito'
        };
        return metodos[row.metodo_pago] || row.metodo_pago;
      },
    },
    {
      name: "Estado",
      selector: row => row.estado,
      sortable: true,
      width: "120px",
      format: row => {
        const estados = {
          'pendiente': 'Pendiente',
          'confirmada': 'Confirmada',
          'anulada': 'Anulada'
        };
        return estados[row.estado] || row.estado;
      },
    },
  ];

  // Columnas para productos más vendidos
  const productosColumns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Producto",
      selector: row => row.nombre,
      sortable: true,
      width: "250px",
    },
    {
      name: "Código",
      selector: row => row.codigo,
      sortable: true,
      width: "120px",
    },
    {
      name: "Unidades Vendidas",
      selector: row => row.total_vendido,
      sortable: true,
      width: "150px",
      center: true,
    },
    {
      name: "Total Ingresos",
      selector: row => row.total_ingresos,
      sortable: true,
      width: "150px",
      format: row => `$${parseFloat(row.total_ingresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
  ];

  // Columnas para rendimiento por vendedor
  const vendedoresColumns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Vendedor",
      selector: row => row.name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
      width: "200px",
    },
    {
      name: "Total Ventas",
      selector: row => row.total_ventas,
      sortable: true,
      width: "130px",
      center: true,
    },
    {
      name: "Total Ingresos",
      selector: row => row.total_ingresos,
      sortable: true,
      width: "150px",
      format: row => `$${parseFloat(row.total_ingresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Promedio Venta",
      selector: row => row.promedio_venta,
      sortable: true,
      width: "150px",
      format: row => `$${parseFloat(row.promedio_venta || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
  ];

  // Columnas para ventas por día
  const ventasPorDiaColumns = [
    {
      name: "Fecha",
      selector: row => row.fecha,
      sortable: true,
      width: "120px",
      format: row => new Date(row.fecha).toLocaleDateString('es-ES'),
    },
    {
      name: "Total Ventas",
      selector: row => row.total_ventas,
      sortable: true,
      width: "130px",
      center: true,
    },
    {
      name: "Total Ingresos",
      selector: row => row.total_ingresos,
      sortable: true,
      width: "150px",
      format: row => `$${parseFloat(row.total_ingresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
  ];

  // Columnas para métodos de pago
  const metodosPagoColumns = [
    {
      name: "Método de Pago",
      selector: row => row.metodo_pago,
      sortable: true,
      width: "150px",
      format: row => {
        const metodos = {
          'efectivo': 'Efectivo',
          'tarjeta': 'Tarjeta',
          'transferencia': 'Transferencia',
          'credito': 'Crédito'
        };
        return metodos[row.metodo_pago] || row.metodo_pago;
      },
    },
    {
      name: "Total Ventas",
      selector: row => row.total_ventas,
      sortable: true,
      width: "130px",
      center: true,
    },
    {
      name: "Total Ingresos",
      selector: row => row.total_ingresos,
      sortable: true,
      width: "150px",
      format: row => `$${parseFloat(row.total_ingresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
  ];

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
                      Reportes de Ventas
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Análisis completo de ventas y rendimiento
                    </MDTypography>
                  </MDBox>
                  <MDBox>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </MDBox>
                </MDBox>

                {/* Estadísticas generales */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="primary">
                          {estadisticas.ventas_hoy || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Ventas Hoy
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="success">
                          ${parseFloat(estadisticas.ingresos_hoy || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Ingresos Hoy
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <AssessmentIcon color="info" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="info">
                          {estadisticas.ventas_mes || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Ventas Mes
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <PaymentIcon color="warning" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="warning">
                          ${parseFloat(estadisticas.ingresos_mes || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Ingresos Mes
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>

                {/* Tabs de reportes */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="reportes tabs">
                    <Tab label="Ventas por Período" icon={<CalendarIcon />} />
                    <Tab label="Productos Más Vendidos" icon={<ShoppingCartIcon />} />
                    <Tab label="Rendimiento Vendedores" icon={<PeopleIcon />} />
                    <Tab label="Ventas por Día" icon={<TrendingUpIcon />} />
                    <Tab label="Métodos de Pago" icon={<PaymentIcon />} />
                  </Tabs>
                </Box>

                {/* Contenido de tabs */}
                <TabPanel value={tabValue} index={0}>
                  <TableThemeProvider>
                    <StandardDataTable
                      title="Ventas por Período"
                      subtitle="Análisis detallado de ventas"
                      columns={ventasColumns}
                      data={ventasData}
                      loading={loading}
                      enableSearch={true}
                      enableFilters={true}
                      enableExport={true}
                      serverSide={false}
                      pagination={true}
                      defaultPageSize={15}
                      cardProps={{
                        sx: { 
                          boxShadow: 3,
                          borderRadius: 2
                        }
                      }}
                    />
                  </TableThemeProvider>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <TableThemeProvider>
                    <StandardDataTable
                      title="Productos Más Vendidos"
                      subtitle="Análisis de productos con mayor demanda"
                      columns={productosColumns}
                      data={productosData}
                      loading={loading}
                      enableSearch={true}
                      enableFilters={true}
                      enableExport={true}
                      serverSide={false}
                      pagination={true}
                      defaultPageSize={15}
                      cardProps={{
                        sx: { 
                          boxShadow: 3,
                          borderRadius: 2
                        }
                      }}
                    />
                  </TableThemeProvider>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <TableThemeProvider>
                    <StandardDataTable
                      title="Rendimiento por Vendedor"
                      subtitle="Análisis de rendimiento del equipo de ventas"
                      columns={vendedoresColumns}
                      data={vendedoresData}
                      loading={loading}
                      enableSearch={true}
                      enableFilters={true}
                      enableExport={true}
                      serverSide={false}
                      pagination={true}
                      defaultPageSize={15}
                      cardProps={{
                        sx: { 
                          boxShadow: 3,
                          borderRadius: 2
                        }
                      }}
                    />
                  </TableThemeProvider>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  <TableThemeProvider>
                    <StandardDataTable
                      title="Ventas por Día"
                      subtitle="Tendencia de ventas diarias"
                      columns={ventasPorDiaColumns}
                      data={ventasPorDiaData}
                      loading={loading}
                      enableSearch={true}
                      enableFilters={true}
                      enableExport={true}
                      serverSide={false}
                      pagination={true}
                      defaultPageSize={15}
                      cardProps={{
                        sx: { 
                          boxShadow: 3,
                          borderRadius: 2
                        }
                      }}
                    />
                  </TableThemeProvider>
                </TabPanel>

                <TabPanel value={tabValue} index={4}>
                  <TableThemeProvider>
                    <StandardDataTable
                      title="Métodos de Pago"
                      subtitle="Análisis de métodos de pago utilizados"
                      columns={metodosPagoColumns}
                      data={metodosPagoData}
                      loading={loading}
                      enableSearch={true}
                      enableFilters={true}
                      enableExport={true}
                      serverSide={false}
                      pagination={true}
                      defaultPageSize={15}
                      cardProps={{
                        sx: { 
                          boxShadow: 3,
                          borderRadius: 2
                        }
                      }}
                    />
                  </TableThemeProvider>
                </TabPanel>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ReportesVentas;
