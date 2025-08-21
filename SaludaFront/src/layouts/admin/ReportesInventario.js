/**
=========================================================
* SaludaReact - Reportes de Inventario para Administrador
=========================================================
*/

import React, { useState, useEffect } from "react";
import { Grid, Card, Typography, Box, Tabs, Tab } from "@mui/material";
import {
  Inventory as InventoryIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  Assessment as AssessmentIcon,
  LocalShipping as LocalShippingIcon,
  Timeline as TimelineIcon,
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
      id={`inventario-tabpanel-${index}`}
      aria-labelledby={`inventario-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ReportesInventario() {
  const [tabValue, setTabValue] = useState(0);
  const [movimientosData, setMovimientosData] = useState([]);
  const [rotacionData, setRotacionData] = useState([]);
  const [vencimientosData, setVencimientosData] = useState([]);
  const [stockBajoData, setStockBajoData] = useState([]);
  const [valorInventarioData, setValorInventarioData] = useState([]);
  const [productosVendidosData, setProductosVendidosData] = useState({});
  const [estadisticas, setEstadisticas] = useState({
    total_productos_stock_bajo: 0,
    total_movimientos: 0,
    total_valor_inventario: 0,
    productos_vencimiento_proximo: 0
  });
  const [loading, setLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadEstadisticasGenerales();
  }, []);

  const loadEstadisticasGenerales = async () => {
    try {
      setLoading(true);
      const response = await reportesService.productosStockBajo();
      if (response && response.success && response.estadisticas) {
        setEstadisticas(response.estadisticas);
      } else {
        // Si no hay datos, mantener los valores por defecto
        setEstadisticas({
          total_productos_stock_bajo: 0,
          total_movimientos: 0,
          total_valor_inventario: 0,
          productos_vencimiento_proximo: 0
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // En caso de error, mantener los valores por defecto
      setEstadisticas({
        total_productos_stock_bajo: 0,
        total_movimientos: 0,
        total_valor_inventario: 0,
        productos_vencimiento_proximo: 0
      });
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
        case 0: // Movimientos de stock
          const movimientosResponse = await reportesService.movimientosStock();
          if (movimientosResponse.success) {
            setMovimientosData(movimientosResponse.data);
          }
          break;
          
        case 1: // Rotación de productos
          const rotacionResponse = await reportesService.rotacionProductos();
          if (rotacionResponse.success) {
            setRotacionData(rotacionResponse.data);
          }
          break;
          
        case 2: // Alertas de vencimiento
          const vencimientosResponse = await reportesService.alertasVencimiento();
          if (vencimientosResponse.success) {
            setVencimientosData(vencimientosResponse.data);
          }
          break;
          
        case 3: // Productos con stock bajo
          const stockBajoResponse = await reportesService.productosStockBajo();
          if (stockBajoResponse.success) {
            setStockBajoData(stockBajoResponse.data);
          }
          break;
          
        case 4: // Valor del inventario
          const valorInventarioResponse = await reportesService.valorInventario();
          if (valorInventarioResponse.success) {
            setValorInventarioData(valorInventarioResponse.data);
          }
          break;
          
        case 5: // Productos vendidos
          const productosVendidosResponse = await reportesService.productosVendidos();
          if (productosVendidosResponse.success) {
            setProductosVendidosData(productosVendidosResponse);
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

  // Columnas para movimientos de stock
  const movimientosColumns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Producto",
      selector: row => row.producto?.nombre || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Almacén",
      selector: row => row.almacen?.nombre || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Tipo",
      selector: row => row.tipo_movimiento,
      sortable: true,
      width: "120px",
      format: row => {
        const tipos = {
          'entrada': 'Entrada',
          'salida': 'Salida',
          'ajuste': 'Ajuste',
          'transferencia': 'Transferencia'
        };
        return tipos[row.tipo_movimiento] || row.tipo_movimiento;
      },
    },
    {
      name: "Cantidad",
      selector: row => row.cantidad,
      sortable: true,
      width: "100px",
      center: true,
    },
    {
      name: "Stock Anterior",
      selector: row => row.stock_anterior,
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Stock Actual",
      selector: row => row.stock_actual,
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Fecha",
      selector: row => row.created_at,
      sortable: true,
      width: "120px",
      format: row => new Date(row.created_at).toLocaleDateString('es-ES'),
    },
    {
      name: "Usuario",
      selector: row => row.usuario?.name || "N/A",
      sortable: true,
      width: "150px",
    },
  ];

  // Columnas para rotación de productos
  const rotacionColumns = [
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
      selector: row => row.unidades_vendidas,
      sortable: true,
      width: "150px",
      center: true,
    },
    {
      name: "Stock Promedio",
      selector: row => row.stock_promedio,
      sortable: true,
      width: "140px",
      center: true,
    },
    {
      name: "Índice Rotación",
      selector: row => row.indice_rotacion,
      sortable: true,
      width: "150px",
      center: true,
      format: row => parseFloat(row.indice_rotacion || 0).toFixed(2),
    },
  ];

  // Columnas para alertas de vencimiento
  const vencimientosColumns = [
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
      width: "200px",
    },
    {
      name: "Código",
      selector: row => row.codigo,
      sortable: true,
      width: "120px",
    },
    {
      name: "Almacén",
      selector: row => row.almacen,
      sortable: true,
      width: "150px",
    },
    {
      name: "Lote",
      selector: row => row.lote,
      sortable: true,
      width: "120px",
    },
    {
      name: "Stock Actual",
      selector: row => row.stock_actual,
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Fecha Vencimiento",
      selector: row => row.fecha_vencimiento,
      sortable: true,
      width: "150px",
      format: row => new Date(row.fecha_vencimiento).toLocaleDateString('es-ES'),
    },
    {
      name: "Días Restantes",
      selector: row => row.dias_restantes,
      sortable: true,
      width: "130px",
      center: true,
      format: row => {
        const dias = parseInt(row.dias_restantes);
        if (dias < 0) return `Vencido (${Math.abs(dias)} días)`;
        if (dias <= 7) return `Crítico (${dias} días)`;
        return `${dias} días`;
      },
    },
  ];

  // Columnas para productos con stock bajo
  const stockBajoColumns = [
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
      width: "200px",
    },
    {
      name: "Código",
      selector: row => row.codigo,
      sortable: true,
      width: "120px",
    },
    {
      name: "Almacén",
      selector: row => row.almacen,
      sortable: true,
      width: "150px",
    },
    {
      name: "Stock Actual",
      selector: row => row.stock_actual,
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Stock Mínimo",
      selector: row => row.stock_minimo,
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Stock Máximo",
      selector: row => row.stock_maximo,
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Déficit",
      selector: row => row.deficit,
      sortable: true,
      width: "100px",
      center: true,
      format: row => {
        const deficit = parseInt(row.deficit);
        return deficit < 0 ? deficit : 0;
      },
    },
  ];

  // Columnas para valor del inventario
  const valorInventarioColumns = [
    {
      name: "ID Almacén",
      selector: row => row.almacen_id,
      sortable: true,
      width: "120px",
    },
    {
      name: "Almacén",
      selector: row => row.almacen,
      sortable: true,
      width: "200px",
    },
    {
      name: "Total Productos",
      selector: row => row.total_productos,
      sortable: true,
      width: "140px",
      center: true,
    },
    {
      name: "Total Unidades",
      selector: row => row.total_unidades,
      sortable: true,
      width: "140px",
      center: true,
    },
    {
      name: "Valor Total",
      selector: row => row.valor_total,
      sortable: true,
      width: "150px",
      format: row => `$${parseFloat(row.valor_total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Valor Venta Total",
      selector: row => row.valor_venta_total,
      sortable: true,
      width: "170px",
      format: row => `$${parseFloat(row.valor_venta_total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
  ];

  // Columnas para productos más vendidos
  const productosMasVendidosColumns = [
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
    {
      name: "Precio Promedio",
      selector: row => row.precio_promedio,
      sortable: true,
      width: "140px",
      format: row => `$${parseFloat(row.precio_promedio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
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
                      Reportes de Inventario
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Análisis completo de inventario y stock
                    </MDTypography>
                  </MDBox>
                  <MDBox>
                    <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </MDBox>
                </MDBox>

                {/* Estadísticas generales */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <WarningIcon color="warning" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="warning">
                          {estadisticas.total_productos_stock_bajo || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Stock Bajo
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="error">
                          {estadisticas.productos_sin_stock || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Sin Stock
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <AssessmentIcon color="info" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="info">
                          {estadisticas.productos_criticos || 0}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Críticos
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <LocalShippingIcon color="success" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="success">
                          ${parseFloat(estadisticas.valor_total_stock_bajo || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Valor Stock Bajo
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>

                {/* Tabs de reportes */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="inventario tabs">
                    <Tab label="Movimientos Stock" icon={<TimelineIcon />} />
                    <Tab label="Rotación Productos" icon={<TrendingDownIcon />} />
                    <Tab label="Alertas Vencimiento" icon={<WarningIcon />} />
                    <Tab label="Stock Bajo" icon={<InventoryIcon />} />
                    <Tab label="Valor Inventario" icon={<AssessmentIcon />} />
                    <Tab label="Productos Vendidos" icon={<LocalShippingIcon />} />
                  </Tabs>
                </Box>

                {/* Contenido de tabs */}
                <TabPanel value={tabValue} index={0}>
                  <TableThemeProvider>
                    <StandardDataTable
                      title="Movimientos de Stock"
                      subtitle="Historial de movimientos de inventario"
                      columns={movimientosColumns}
                      data={movimientosData}
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
                      title="Rotación de Productos"
                      subtitle="Análisis de rotación de inventario"
                      columns={rotacionColumns}
                      data={rotacionData}
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
                      title="Alertas de Vencimiento"
                      subtitle="Productos próximos a vencer"
                      columns={vencimientosColumns}
                      data={vencimientosData}
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
                      title="Productos con Stock Bajo"
                      subtitle="Productos que requieren reposición"
                      columns={stockBajoColumns}
                      data={stockBajoData}
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
                      title="Valor del Inventario"
                      subtitle="Valoración por almacén"
                      columns={valorInventarioColumns}
                      data={valorInventarioData}
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

                <TabPanel value={tabValue} index={5}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TableThemeProvider>
                        <StandardDataTable
                          title="Productos Más Vendidos"
                          subtitle="Productos con mayor demanda"
                          columns={productosMasVendidosColumns}
                          data={productosVendidosData.mas_vendidos || []}
                          loading={loading}
                          enableSearch={true}
                          enableFilters={true}
                          enableExport={true}
                          serverSide={false}
                          pagination={true}
                          defaultPageSize={10}
                          cardProps={{
                            sx: { 
                              boxShadow: 3,
                              borderRadius: 2
                            }
                          }}
                        />
                      </TableThemeProvider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TableThemeProvider>
                        <StandardDataTable
                          title="Productos Menos Vendidos"
                          subtitle="Productos con menor demanda"
                          columns={productosMasVendidosColumns}
                          data={productosVendidosData.menos_vendidos || []}
                          loading={loading}
                          enableSearch={true}
                          enableFilters={true}
                          enableExport={true}
                          serverSide={false}
                          pagination={true}
                          defaultPageSize={10}
                          cardProps={{
                            sx: { 
                              boxShadow: 3,
                              borderRadius: 2
                            }
                          }}
                        />
                      </TableThemeProvider>
                    </Grid>
                  </Grid>
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

export default ReportesInventario;
