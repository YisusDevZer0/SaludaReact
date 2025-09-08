/**
=========================================================
* SaludaReact - Configuración del Sistema para Administrador
=========================================================
*/

import React, { useState, useEffect } from "react";
import { Grid, Card, Typography, Box, Tabs, Tab, Button, Alert } from "@mui/material";
import {
  Settings as SettingsIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  BugReport as BugReportIcon,
  Refresh as RefreshIcon,
  SystemUpdate as SystemUpdateIcon,
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
import configuracionService from "services/configuracion-service";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`configuracion-tabpanel-${index}`}
      aria-labelledby={`configuracion-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Configuracion() {
  const [tabValue, setTabValue] = useState(0);
  const [configuracionesData, setConfiguracionesData] = useState([]);
  const [systemInfoData, setSystemInfoData] = useState([]);
  const [systemStatsData, setSystemStatsData] = useState([]);
  const [systemLogsData, setSystemLogsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);


  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar configuraciones generales
      const configResponse = await configuracionService.getAll();
      if (configResponse.success) {
        setConfiguracionesData(configuracionService.formatConfiguracionesForTable(configResponse.data));
      }
      
      // Cargar información del sistema
      const infoResponse = await configuracionService.getSystemInfo();
      if (infoResponse.success) {
        setSystemInfoData(configuracionService.formatSystemInfoForTable(infoResponse.data));
      }
      
      // Cargar estadísticas del sistema
      const statsResponse = await configuracionService.getSystemStats();
      
      // Verificar si la respuesta tiene success o si los datos están directamente
      if (statsResponse && (statsResponse.success || statsResponse.usuarios)) {
        const dataToFormat = statsResponse.success ? statsResponse.data : statsResponse;
        const formattedStats = configuracionService.formatSystemStatsForTable(dataToFormat);
        setSystemStatsData(formattedStats);
      }
      
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      setError('Error al cargar los datos del sistema');
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
      setError(null);
      
      switch (tabIndex) {
        case 0: // Configuraciones
          const configResponse = await configuracionService.getAll();
          if (configResponse.success) {
            setConfiguracionesData(configuracionService.formatConfiguracionesForTable(configResponse.data));
          }
          break;
          
        case 1: // Información del Sistema
          const infoResponse = await configuracionService.getSystemInfo();
          if (infoResponse.success) {
            setSystemInfoData(configuracionService.formatSystemInfoForTable(infoResponse.data));
          }
          break;
          
        case 2: // Estadísticas del Sistema
          const statsResponse = await configuracionService.getSystemStats();
          if (statsResponse && (statsResponse.success || statsResponse.usuarios)) {
            const dataToFormat = statsResponse.success ? statsResponse.data : statsResponse;
            const formattedStats = configuracionService.formatSystemStatsForTable(dataToFormat);
            setSystemStatsData(formattedStats);
          }
          break;
          
        case 3: // Logs del Sistema
          const logsResponse = await configuracionService.getSystemLogs();
          if (logsResponse.success) {
            setSystemLogsData(logsResponse.data || []);
          }
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error('Error al cargar datos del tab:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setLoading(true);
      const response = await configuracionService.clearCache();
      if (response.success) {
        setSuccessMessage('Cache del sistema limpiado exitosamente');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error limpiando cache:', error);
      setError('Error al limpiar el cache del sistema');
    } finally {
      setLoading(false);
    }
  };

  // Columnas para configuraciones
  const configuracionesColumns = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Clave",
      selector: row => row.clave,
      sortable: true,
      width: "200px",
    },
    {
      name: "Valor",
      selector: row => row.valor,
      sortable: true,
      width: "250px",
    },
    {
      name: "Descripción",
      selector: row => row.descripcion,
      sortable: true,
      width: "300px",
    },
    {
      name: "Tipo",
      selector: row => row.tipo,
      sortable: true,
      width: "120px",
      format: row => {
        const tipos = {
          'string': 'Texto',
          'integer': 'Número',
          'boolean': 'Booleano',
          'json': 'JSON'
        };
        return tipos[row.tipo] || row.tipo;
      },
    },
    {
      name: "Categoría",
      selector: row => row.categoria,
      sortable: true,
      width: "150px",
    },
    {
      name: "Estado",
      selector: row => row.activo,
      sortable: true,
      width: "120px",
      format: row => {
        return row.activo === 'Activo' ? 'Activo' : 'Inactivo';
      },
    },
  ];

  // Columnas para información del sistema
  const systemInfoColumns = [
    {
      name: "Propiedad",
      selector: row => row.propiedad,
      sortable: true,
      width: "200px",
    },
    {
      name: "Valor",
      selector: row => row.valor,
      sortable: true,
      width: "300px",
    },
    {
      name: "Categoría",
      selector: row => row.categoria,
      sortable: true,
      width: "150px",
    },
  ];

  // Columnas para estadísticas del sistema
  const systemStatsColumns = [
    {
      name: "Categoría",
      selector: row => row.categoria,
      sortable: true,
      width: "150px",
    },
    {
      name: "Total",
      selector: row => row.total,
      sortable: true,
      width: "100px",
      center: true,
    },
    {
      name: "Activos/Abiertas",
      selector: row => row.activos || row.abiertas,
      sortable: true,
      width: "150px",
      center: true,
    },
    {
      name: "Inactivos/Cerradas",
      selector: row => row.inactivos || row.cerradas,
      sortable: true,
      width: "150px",
      center: true,
    },
    {
      name: "Tablas/Tamaño",
      selector: row => row.tablas || row.tamaño_mb,
      sortable: true,
      width: "120px",
      center: true,
      format: row => {
        if (row.tablas) return row.tablas;
        if (row.tamaño_mb) return `${row.tamaño_mb} MB`;
        return 'N/A';
      },
    },
  ];

  // Columnas para logs del sistema
  const systemLogsColumns = [
    {
      name: "Línea",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "80px",
      center: true,
    },
    {
      name: "Log",
      selector: row => row,
      sortable: false,
      width: "800px",
      format: row => {
        // Truncar logs muy largos
        return row.length > 200 ? row.substring(0, 200) + '...' : row;
      },
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
                      Configuración del Sistema
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Gestión y monitoreo del sistema
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={handleClearCache}
                      disabled={loading}
                    >
                      Limpiar Cache
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SystemUpdateIcon />}
                      onClick={loadInitialData}
                      disabled={loading}
                    >
                      Actualizar
                    </Button>
                  </MDBox>
                </MDBox>

                {/* Mensajes de estado */}
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}
                
                {successMessage && (
                  <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
                    {successMessage}
                  </Alert>
                )}

                {/* Tabs de configuración */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="configuracion tabs">
                    <Tab label="Configuraciones" icon={<SettingsIcon />} />
                    <Tab label="Información del Sistema" icon={<InfoIcon />} />
                    <Tab label="Estadísticas" icon={<StorageIcon />} />
                    <Tab label="Logs del Sistema" icon={<BugReportIcon />} />
                  </Tabs>
                </Box>

                {/* Contenido de tabs */}
                <TabPanel value={tabValue} index={0}>
                  <TableThemeProvider>
                    <StandardDataTable
                      title="Configuraciones del Sistema"
                      subtitle="Gestión de configuraciones globales"
                      columns={configuracionesColumns}
                      data={configuracionesData}
                      loading={loading}
                      enableSearch={true}
                      enableFilters={true}
                      enableExport={true}
                      enableCreate={true}
                      enableEdit={true}
                      enableDelete={true}
                      serverSide={false}
                      pagination={true}
                      defaultPageSize={15}
                      service={configuracionService}
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
                      title="Información del Sistema"
                      subtitle="Detalles técnicos del sistema"
                      columns={systemInfoColumns}
                      data={systemInfoData}
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
                      title="Estadísticas del Sistema"
                      subtitle="Métricas y estadísticas generales"
                      columns={systemStatsColumns}
                      data={systemStatsData}
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
                      title="Logs del Sistema"
                      subtitle="Registros de actividad del sistema"
                      columns={systemLogsColumns}
                      data={systemLogsData}
                      loading={loading}
                      enableSearch={true}
                      enableFilters={false}
                      enableExport={true}
                      serverSide={false}
                      pagination={true}
                      defaultPageSize={50}
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

export default Configuracion; 