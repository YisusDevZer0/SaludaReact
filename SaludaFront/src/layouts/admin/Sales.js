/**
=========================================================
* SaludaReact - Menú de Ventas para Administrador
=========================================================
*/

import React, { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";

// Servicios
import salesService from "services/sales-service";
import reportesService from "services/reportes-service";

function Sales() {
  // Estados para datos reales
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    ventasHoy: 0,
    ventasSemana: 0,
    totalVentas: 0,
    clientesNuevos: 0,
    crecimientoHoy: 0,
    crecimientoSemana: 0,
    crecimientoMes: 0,
    crecimientoClientes: 0
  });
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [ventasPorDia, setVentasPorDia] = useState([]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas generales
      const statsResponse = await reportesService.estadisticasGeneralesVentas();
      if (statsResponse.success) {
        setEstadisticas({
          ventasHoy: statsResponse.data.ventas_hoy || 0,
          ventasSemana: statsResponse.data.ventas_semana || 0,
          totalVentas: statsResponse.data.total_ventas || 0,
          clientesNuevos: statsResponse.data.clientes_nuevos || 0,
          crecimientoHoy: statsResponse.data.crecimiento_hoy || 0,
          crecimientoSemana: statsResponse.data.crecimiento_semana || 0,
          crecimientoMes: statsResponse.data.crecimiento_mes || 0,
          crecimientoClientes: statsResponse.data.crecimiento_clientes || 0
        });
      }

      // Cargar ventas recientes
      const ventasResponse = await salesService.getSalesHistory({ limit: 5 });
      if (ventasResponse.success) {
        setVentasRecientes(ventasResponse.data || []);
      }

      // Cargar productos más vendidos
      const productosResponse = await reportesService.productosMasVendidos();
      if (productosResponse.success) {
        setProductosMasVendidos(productosResponse.data || []);
      }

      // Cargar ventas por día para la gráfica
      const ventasDiaResponse = await reportesService.ventasPorDia();
      if (ventasDiaResponse.success) {
        setVentasPorDia(ventasDiaResponse.data || []);
      }

    } catch (error) {
      console.error('Error cargando datos de ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Datos para la gráfica de ventas mensuales (basados en datos reales)
  const salesChartData = {
    labels: ventasPorDia.map(item => item.fecha) || ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Ventas Mensuales",
        color: "info",
        data: ventasPorDia.map(item => item.total) || [50, 60, 70, 65, 75, 90, 80, 85, 95, 100, 110, 120],
      },
    ],
  };

  // Datos reales para la tabla de ventas recientes
  const salesTableData = {
    columns: [
      { Header: "Número", accessor: "numero_venta" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Cliente", accessor: "cliente" },
      { Header: "Productos", accessor: "productos" },
      { Header: "Total", accessor: "total" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Acciones", accessor: "actions" },
    ],
    rows: ventasRecientes.map(venta => ({
      numero_venta: venta.numero_venta || `#${venta.id}`,
      fecha: venta.created_at ? new Date(venta.created_at).toLocaleDateString('es-ES') : 'N/A',
      cliente: venta.cliente?.nombre || 'Cliente General',
      productos: venta.detalles?.length || 0,
      total: `$${(parseFloat(venta.total) || 0).toFixed(2)}`,
      estado: venta.estado || 'Completada',
      actions: (
        <MDBox display="flex" alignItems="center">
          <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
          <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
        </MDBox>
      ),
    })),
  };

  // Datos reales para productos más vendidos
  const topProductsData = {
    columns: [
      { Header: "Producto", accessor: "producto" },
      { Header: "Categoría", accessor: "categoria" },
      { Header: "Precio", accessor: "precio" },
      { Header: "Cantidad Vendida", accessor: "cantidad" },
      { Header: "Total", accessor: "total" },
    ],
    rows: productosMasVendidos.map(producto => ({
      producto: producto.nombre || 'Producto',
      categoria: producto.categoria?.nombre || 'Sin categoría',
      precio: `$${(parseFloat(producto.precio_venta) || 0).toFixed(2)}`,
      cantidad: producto.cantidad_vendida || 0,
      total: `$${(parseFloat(producto.total_vendido) || 0).toFixed(2)}`,
    })),
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado y botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium">
                Ventas
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Gestión y reportes de ventas del sistema
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="info" startIcon={<Icon>add</Icon>}>
              Nueva Venta
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="outlined" color="info" startIcon={<Icon>print</Icon>}>
                Imprimir
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tarjetas de información */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="info"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">payments</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Ventas Hoy
                  </MDTypography>
                  <MDTypography variant="h4">
                    {loading ? <CircularProgress size={24} /> : `$${(estadisticas.ventasHoy || 0).toFixed(2)}`}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <Divider />
              <MDBox p={2}>
                <MDTypography component="p" variant="button" color="text" display="flex" alignItems="center">
                  <Icon color={estadisticas.crecimientoHoy >= 0 ? "success" : "error"} fontSize="small" sx={{ mr: 0.5 }}>
                    {estadisticas.crecimientoHoy >= 0 ? "arrow_upward" : "arrow_downward"}
                  </Icon>
                  <MDTypography variant="button" color={estadisticas.crecimientoHoy >= 0 ? "success" : "error"} fontWeight="medium">
                    {Math.abs(estadisticas.crecimientoHoy || 0).toFixed(1)}%
                  </MDTypography>
                  &nbsp; {estadisticas.crecimientoHoy >= 0 ? "más" : "menos"} que ayer
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="success"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">receipt_long</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Ventas Semana
                  </MDTypography>
                  <MDTypography variant="h4">
                    {loading ? <CircularProgress size={24} /> : `$${(estadisticas.ventasSemana || 0).toFixed(2)}`}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <Divider />
              <MDBox p={2}>
                <MDTypography component="p" variant="button" color="text" display="flex" alignItems="center">
                  <Icon color={estadisticas.crecimientoSemana >= 0 ? "success" : "error"} fontSize="small" sx={{ mr: 0.5 }}>
                    {estadisticas.crecimientoSemana >= 0 ? "arrow_upward" : "arrow_downward"}
                  </Icon>
                  <MDTypography variant="button" color={estadisticas.crecimientoSemana >= 0 ? "success" : "error"} fontWeight="medium">
                    {Math.abs(estadisticas.crecimientoSemana || 0).toFixed(1)}%
                  </MDTypography>
                  &nbsp; {estadisticas.crecimientoSemana >= 0 ? "más" : "menos"} que la semana anterior
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="warning"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">shopping_cart</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Total Ventas
                  </MDTypography>
                  <MDTypography variant="h4">
                    {loading ? <CircularProgress size={24} /> : estadisticas.totalVentas || 0}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <Divider />
              <MDBox p={2}>
                <MDTypography component="p" variant="button" color="text" display="flex" alignItems="center">
                  <Icon color={estadisticas.crecimientoMes >= 0 ? "success" : "error"} fontSize="small" sx={{ mr: 0.5 }}>
                    {estadisticas.crecimientoMes >= 0 ? "arrow_upward" : "arrow_downward"}
                  </Icon>
                  <MDTypography variant="button" color={estadisticas.crecimientoMes >= 0 ? "success" : "error"} fontWeight="medium">
                    {Math.abs(estadisticas.crecimientoMes || 0).toFixed(1)}%
                  </MDTypography>
                  &nbsp; {estadisticas.crecimientoMes >= 0 ? "más" : "menos"} que el mes anterior
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="error"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">person</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Clientes Nuevos
                  </MDTypography>
                  <MDTypography variant="h4">
                    {loading ? <CircularProgress size={24} /> : estadisticas.clientesNuevos || 0}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <Divider />
              <MDBox p={2}>
                <MDTypography component="p" variant="button" color="text" display="flex" alignItems="center">
                  <Icon color={estadisticas.crecimientoClientes >= 0 ? "success" : "error"} fontSize="small" sx={{ mr: 0.5 }}>
                    {estadisticas.crecimientoClientes >= 0 ? "arrow_upward" : "arrow_downward"}
                  </Icon>
                  <MDTypography variant="button" color={estadisticas.crecimientoClientes >= 0 ? "success" : "error"} fontWeight="medium">
                    {Math.abs(estadisticas.crecimientoClientes || 0).toFixed(1)}%
                  </MDTypography>
                  &nbsp; {estadisticas.crecimientoClientes >= 0 ? "más" : "menos"} que el mes anterior
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Gráfica de ventas mensuales */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6" fontWeight="medium">
                  Ventas Mensuales
                </MDTypography>
                <MDTypography variant="button" color="text">
                  Evolución de las ventas durante el último año
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <ReportsLineChart
                  color="info"
                  chart={salesChartData}
                  items={[
                    {
                      icon: { color: "info", component: "payments" },
                      label: "ventas",
                      progress: { content: "$125,230.00", percentage: 15 },
                    }
                  ]}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Tabla de ventas recientes */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Ventas Recientes
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    Listado de las últimas ventas realizadas
                  </MDTypography>
                </MDBox>
                <MDButton variant="outlined" color="info" size="small" startIcon={<Icon>filter_list</Icon>}>
                  Filtrar
                </MDButton>
              </MDBox>
              <MDBox px={3}>
                <DataTable
                  table={salesTableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Productos más vendidos */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Productos Más Vendidos
                  </MDTypography>
                  <MDTypography variant="button" color="text">
                    Los productos con mayor volumen de ventas
                  </MDTypography>
                </MDBox>
                <MDButton variant="text" color="info" startIcon={<Icon>download</Icon>}>
                  Exportar
                </MDButton>
              </MDBox>
              <MDBox px={3}>
                <DataTable
                  table={topProductsData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Sales; 