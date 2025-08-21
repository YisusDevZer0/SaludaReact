/**
=========================================================
* SaludaReact - Reportes Financieros para Administrador
=========================================================
*/

import React, { useState, useEffect } from "react";
import { Grid, Card, Typography, Box, Tabs, Tab } from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
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
      id={`financieros-tabpanel-${index}`}
      aria-labelledby={`financieros-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ReportesFinancieros() {
  const [tabValue, setTabValue] = useState(0);
  const [balanceCajaData, setBalanceCajaData] = useState([]);
  const [flujoEfectivoData, setFlujoEfectivoData] = useState([]);
  const [gastosData, setGastosData] = useState({});
  const [margenUtilidadData, setMargenUtilidadData] = useState({});
  const [rentabilidadData, setRentabilidadData] = useState([]);
  const [resumenData, setResumenData] = useState({});
  const [loading, setLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadResumenFinanciero();
  }, []);

  const loadResumenFinanciero = async () => {
    try {
      setLoading(true);
      const response = await reportesService.resumenFinanciero();
      if (response.success) {
        setResumenData(response.data);
      }
    } catch (error) {
      console.error('Error al cargar resumen financiero:', error);
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
        case 0: // Balance de caja
          const balanceResponse = await reportesService.balanceCaja();
          if (balanceResponse.success) {
            setBalanceCajaData(balanceResponse.data);
          }
          break;
          
        case 1: // Flujo de efectivo
          const flujoResponse = await reportesService.flujoEfectivo();
          if (flujoResponse.success) {
            setFlujoEfectivoData(flujoResponse.data);
          }
          break;
          
        case 2: // Análisis de gastos
          const gastosResponse = await reportesService.analisisGastos();
          if (gastosResponse.success) {
            setGastosData(gastosResponse);
          }
          break;
          
        case 3: // Margen de utilidad
          const margenResponse = await reportesService.margenUtilidad();
          if (margenResponse.success) {
            setMargenUtilidadData(margenResponse.data);
          }
          break;
          
        case 4: // Rentabilidad por producto
          const rentabilidadResponse = await reportesService.rentabilidadProductos();
          if (rentabilidadResponse.success) {
            setRentabilidadData(rentabilidadResponse.data);
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

  // Columnas para balance de caja
  const balanceCajaColumns = [
    {
      name: "ID Caja",
      selector: row => row.caja_id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Caja",
      selector: row => row.caja_nombre,
      sortable: true,
      width: "150px",
    },
    {
      name: "Sucursal",
      selector: row => row.sucursal,
      sortable: true,
      width: "150px",
    },
    {
      name: "Ingresos",
      selector: row => row.ingresos,
      sortable: true,
      width: "130px",
      format: row => `$${parseFloat(row.ingresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Egresos",
      selector: row => row.egresos,
      sortable: true,
      width: "130px",
      format: row => `$${parseFloat(row.egresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Fondos",
      selector: row => row.fondos,
      sortable: true,
      width: "130px",
      format: row => `$${parseFloat(row.fondos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Balance",
      selector: row => row.balance,
      sortable: true,
      width: "130px",
      format: row => {
        const balance = parseFloat(row.balance || 0);
        const color = balance >= 0 ? 'success' : 'error';
        return `$${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
      },
    },
    {
      name: "Estado",
      selector: row => row.estado,
      sortable: true,
      width: "120px",
      format: row => {
        const estados = {
          'abierta': 'Abierta',
          'cerrada': 'Cerrada',
          'en_proceso': 'En Proceso'
        };
        return estados[row.estado] || row.estado;
      },
    },
  ];

  // Columnas para flujo de efectivo
  const flujoEfectivoColumns = [
    {
      name: "Fecha",
      selector: row => row.fecha,
      sortable: true,
      width: "120px",
      format: row => new Date(row.fecha).toLocaleDateString('es-ES'),
    },
    {
      name: "Ingresos",
      selector: row => row.ingresos,
      sortable: true,
      width: "130px",
      format: row => `$${parseFloat(row.ingresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Egresos",
      selector: row => row.egresos,
      sortable: true,
      width: "130px",
      format: row => `$${parseFloat(row.egresos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Flujo Neto",
      selector: row => row.flujo_neto,
      sortable: true,
      width: "130px",
      format: row => {
        const flujo = parseFloat(row.flujo_neto || 0);
        const color = flujo >= 0 ? 'success' : 'error';
        return `$${flujo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
      },
    },
    {
      name: "Total Ventas",
      selector: row => row.total_ventas,
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Total Gastos",
      selector: row => row.total_gastos,
      sortable: true,
      width: "120px",
      center: true,
    },
  ];

  // Columnas para gastos
  const gastosColumns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Descripción",
      selector: row => row.descripcion,
      sortable: true,
      width: "200px",
    },
    {
      name: "Categoría",
      selector: row => row.categoria,
      sortable: true,
      width: "150px",
    },
    {
      name: "Monto",
      selector: row => row.monto,
      sortable: true,
      width: "130px",
      format: row => `$${parseFloat(row.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Fecha",
      selector: row => row.fecha_gasto,
      sortable: true,
      width: "120px",
      format: row => new Date(row.fecha_gasto).toLocaleDateString('es-ES'),
    },
    {
      name: "Estado",
      selector: row => row.estado,
      sortable: true,
      width: "120px",
      format: row => {
        const estados = {
          'pendiente': 'Pendiente',
          'pagado': 'Pagado',
          'vencido': 'Vencido'
        };
        return estados[row.estado] || row.estado;
      },
    },
    {
      name: "Método Pago",
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
  ];

  // Columnas para gastos por categoría
  const gastosPorCategoriaColumns = [
    {
      name: "Categoría",
      selector: row => row.categoria,
      sortable: true,
      width: "200px",
    },
    {
      name: "Total Monto",
      selector: row => row.total_monto,
      sortable: true,
      width: "150px",
      format: row => `$${parseFloat(row.total_monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Total Gastos",
      selector: row => row.total_gastos,
      sortable: true,
      width: "130px",
      center: true,
    },
    {
      name: "Promedio Gasto",
      selector: row => row.promedio_gasto,
      sortable: true,
      width: "150px",
      format: row => `$${parseFloat(row.promedio_gasto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Gasto Máximo",
      selector: row => row.gasto_maximo,
      sortable: true,
      width: "140px",
      format: row => `$${parseFloat(row.gasto_maximo || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Gasto Mínimo",
      selector: row => row.gasto_minimo,
      sortable: true,
      width: "140px",
      format: row => `$${parseFloat(row.gasto_minimo || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
  ];

  // Columnas para rentabilidad por producto
  const rentabilidadColumns = [
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
      name: "Ingresos Totales",
      selector: row => row.ingresos_totales,
      sortable: true,
      width: "150px",
      format: row => `$${parseFloat(row.ingresos_totales || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Costos Totales",
      selector: row => row.costos_totales,
      sortable: true,
      width: "150px",
      format: row => `$${parseFloat(row.costos_totales || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
    },
    {
      name: "Utilidad Bruta",
      selector: row => row.utilidad_bruta,
      sortable: true,
      width: "150px",
      format: row => {
        const utilidad = parseFloat(row.utilidad_bruta || 0);
        const color = utilidad >= 0 ? 'success' : 'error';
        return `$${utilidad.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
      },
    },
    {
      name: "Margen %",
      selector: row => row.margen_porcentaje,
      sortable: true,
      width: "120px",
      center: true,
      format: row => `${parseFloat(row.margen_porcentaje || 0).toFixed(2)}%`,
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
                      Reportes Financieros
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Análisis completo de finanzas y rentabilidad
                    </MDTypography>
                  </MDBox>
                  <MDBox>
                    <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </MDBox>
                </MDBox>

                {/* Estadísticas generales */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <AccountBalanceIcon color="primary" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="primary">
                          {resumenData.ventas?.ventas_hoy || 0}
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
                          ${parseFloat(resumenData.ventas?.ingresos_hoy || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
                        <PaymentIcon color="warning" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="warning">
                          ${parseFloat(resumenData.gastos?.gastos_hoy || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Gastos Hoy
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <MDBox p={2} textAlign="center">
                        <MonetizationOnIcon color="info" sx={{ fontSize: 40 }} />
                        <MDTypography variant="h6" color="info">
                          ${parseFloat(resumenData.inventario?.valor_total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </MDTypography>
                        <MDTypography variant="button" color="text">
                          Valor Inventario
                        </MDTypography>
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>

                {/* Tabs de reportes */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="financieros tabs">
                    <Tab label="Balance de Caja" icon={<AccountBalanceIcon />} />
                    <Tab label="Flujo de Efectivo" icon={<TimelineIcon />} />
                    <Tab label="Análisis de Gastos" icon={<PaymentIcon />} />
                    <Tab label="Margen de Utilidad" icon={<AssessmentIcon />} />
                    <Tab label="Rentabilidad Productos" icon={<MonetizationOnIcon />} />
                  </Tabs>
                </Box>

                {/* Contenido de tabs */}
                <TabPanel value={tabValue} index={0}>
                  <TableThemeProvider>
                    <StandardDataTable
                      title="Balance de Caja"
                      subtitle="Estado financiero por caja"
                      columns={balanceCajaColumns}
                      data={balanceCajaData}
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
                      title="Flujo de Efectivo"
                      subtitle="Análisis de ingresos y egresos diarios"
                      columns={flujoEfectivoColumns}
                      data={flujoEfectivoData}
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
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TableThemeProvider>
                        <StandardDataTable
                          title="Gastos Detallados"
                          subtitle="Lista completa de gastos"
                          columns={gastosColumns}
                          data={gastosData.gastos || []}
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
                    </Grid>
                    <Grid item xs={12}>
                      <TableThemeProvider>
                        <StandardDataTable
                          title="Gastos por Categoría"
                          subtitle="Análisis de gastos agrupados por categoría"
                          columns={gastosPorCategoriaColumns}
                          data={gastosData.por_categoria || []}
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
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <MDBox p={3}>
                          <MDTypography variant="h6" color="primary" mb={2}>
                            Resumen de Margen de Utilidad
                          </MDTypography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <MDTypography variant="body2" color="text">
                                Ingresos Totales:
                              </MDTypography>
                              <MDTypography variant="h6" color="success">
                                ${parseFloat(margenUtilidadData.ingresos_totales || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography variant="body2" color="text">
                                Costos de Ventas:
                              </MDTypography>
                              <MDTypography variant="h6" color="warning">
                                ${parseFloat(margenUtilidadData.costos_ventas || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography variant="body2" color="text">
                                Gastos Operativos:
                              </MDTypography>
                              <MDTypography variant="h6" color="error">
                                ${parseFloat(margenUtilidadData.gastos_operativos || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography variant="body2" color="text">
                                Utilidad Bruta:
                              </MDTypography>
                              <MDTypography variant="h6" color="success">
                                ${parseFloat(margenUtilidadData.utilidad_bruta || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography variant="body2" color="text">
                                Utilidad Neta:
                              </MDTypography>
                              <MDTypography variant="h6" color="info">
                                ${parseFloat(margenUtilidadData.utilidad_neta || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography variant="body2" color="text">
                                Margen Bruto:
                              </MDTypography>
                              <MDTypography variant="h6" color="success">
                                {parseFloat(margenUtilidadData.margen_bruto_porcentaje || 0).toFixed(2)}%
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography variant="body2" color="text">
                                Margen Neto:
                              </MDTypography>
                              <MDTypography variant="h6" color="info">
                                {parseFloat(margenUtilidadData.margen_neto_porcentaje || 0).toFixed(2)}%
                              </MDTypography>
                            </Grid>
                          </Grid>
                        </MDBox>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <MDBox p={3}>
                          <MDTypography variant="h6" color="primary" mb={2}>
                            Período de Análisis
                          </MDTypography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <MDTypography variant="body2" color="text">
                                Fecha Inicio:
                              </MDTypography>
                              <MDTypography variant="body1">
                                {margenUtilidadData.fecha_inicio ? new Date(margenUtilidadData.fecha_inicio).toLocaleDateString('es-ES') : 'N/A'}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography variant="body2" color="text">
                                Fecha Fin:
                              </MDTypography>
                              <MDTypography variant="body1">
                                {margenUtilidadData.fecha_fin ? new Date(margenUtilidadData.fecha_fin).toLocaleDateString('es-ES') : 'N/A'}
                              </MDTypography>
                            </Grid>
                          </Grid>
                        </MDBox>
                      </Card>
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={4}>
                  <TableThemeProvider>
                    <StandardDataTable
                      title="Rentabilidad por Producto"
                      subtitle="Análisis de rentabilidad individual por producto"
                      columns={rentabilidadColumns}
                      data={rentabilidadData}
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

export default ReportesFinancieros;
