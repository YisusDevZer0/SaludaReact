/**
=========================================================
* SaludaReact - Menú de Traspasos para Administrador
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

// React components
import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`traspasos-tabpanel-${index}`}
      aria-labelledby={`traspasos-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function Traspasos() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Datos simulados para traspasos
  const traspasosTableData = {
    columns: [
      { Header: "ID", accessor: "id" },
      { Header: "Origen", accessor: "origen" },
      { Header: "Destino", accessor: "destino" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Total Productos", accessor: "totalProductos" },
      { Header: "Progreso", accessor: "progreso" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 10 }, (_, i) => {
      const estadoOptions = ["Pendiente", "En tránsito", "Recibido", "Cancelado"];
      const estado = estadoOptions[i % 4];
      const estadoColor = estado === "Pendiente" ? "info" : estado === "En tránsito" ? "warning" : estado === "Recibido" ? "success" : "error";
      
      const progreso = estado === "Pendiente" ? 10 : estado === "En tránsito" ? 50 : estado === "Recibido" ? 100 : 0;
      
      return {
        id: `TR-${(100 + i).toString().padStart(3, '0')}`,
        origen: ["Matriz CdCaucel", "Sucursal Norte", "Almacén Central", "Sucursal Sur", "Consultorio", "Farmacia", "Bodega Principal", "Sucursal Este", "Sucursal Oeste", "Unidad Móvil"][i],
        destino: ["Sucursal Norte", "Almacén Central", "Sucursal Sur", "Consultorio", "Farmacia", "Matriz CdCaucel", "Sucursal Este", "Sucursal Oeste", "Unidad Móvil", "Bodega Principal"][i],
        fecha: ["10/05/2023", "15/05/2023", "20/05/2023", "25/05/2023", "30/05/2023", "01/06/2023", "02/06/2023", "03/06/2023", "04/06/2023", "05/06/2023"][i],
        totalProductos: Math.floor(Math.random() * 20) + 3,
        progreso: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress
              value={progreso}
              color={progreso === 100 ? "success" : progreso >= 50 ? "warning" : "info"}
              variant="gradient"
              label={false}
            />
          </MDBox>
        ),
        estado: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={estadoColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${estadoColor}.light`,
              }}
            >
              {estado}
            </MDTypography>
          </MDBox>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>check_circle</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "warning.main" }}>print</Icon>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para traspasos pendientes
  const pendientesTableData = {
    columns: [
      { Header: "ID", accessor: "id" },
      { Header: "Origen", accessor: "origen" },
      { Header: "Destino", accessor: "destino" },
      { Header: "Fecha Solicitud", accessor: "fechaSolicitud" },
      { Header: "Productos", accessor: "productos" },
      { Header: "Solicitado por", accessor: "solicitadoPor" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 5 }, (_, i) => {
      return {
        id: `TP-${(100 + i).toString().padStart(3, '0')}`,
        origen: ["Almacén Central", "Bodega Principal", "Matriz CdCaucel", "Sucursal Norte", "Farmacia"][i],
        destino: ["Sucursal Sur", "Sucursal Este", "Sucursal Oeste", "Consultorio", "Unidad Móvil"][i],
        fechaSolicitud: ["01/06/2023", "02/06/2023", "03/06/2023", "04/06/2023", "05/06/2023"][i],
        productos: Math.floor(Math.random() * 10) + 2,
        solicitadoPor: ["Juan Pérez", "María López", "Carlos Ruiz", "Ana Díaz", "Roberto Gómez"][i],
        acciones: (
          <MDBox display="flex" alignItems="center">
            <MDButton variant="text" color="info" size="small">
              Detalles
            </MDButton>
            <MDButton variant="text" color="success" size="small" sx={{ ml: 1 }}>
              Aprobar
            </MDButton>
            <MDButton variant="text" color="error" size="small" sx={{ ml: 1 }}>
              Rechazar
            </MDButton>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para histórico de traspasos
  const historicoTableData = {
    columns: [
      { Header: "ID", accessor: "id" },
      { Header: "Tipo", accessor: "tipo" },
      { Header: "Origen", accessor: "origen" },
      { Header: "Destino", accessor: "destino" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Total Productos", accessor: "totalProductos" },
      { Header: "Estado", accessor: "estado" },
    ],
    rows: Array.from({ length: 8 }, (_, i) => {
      const estadoOptions = ["Completado", "Cancelado"];
      const estado = estadoOptions[i % 2];
      const estadoColor = estado === "Completado" ? "success" : "error";
      
      const tipoOptions = ["Interno", "Externo", "Emergencia", "Programado"];
      const tipo = tipoOptions[i % 4];
      
      return {
        id: `TR-${(50 + i).toString().padStart(3, '0')}`,
        tipo,
        origen: ["Matriz CdCaucel", "Sucursal Norte", "Almacén Central", "Sucursal Sur", "Consultorio", "Farmacia", "Bodega Principal", "Sucursal Este"][i],
        destino: ["Sucursal Norte", "Almacén Central", "Sucursal Sur", "Consultorio", "Farmacia", "Matriz CdCaucel", "Sucursal Este", "Sucursal Oeste"][i],
        fecha: ["01/04/2023", "15/04/2023", "30/04/2023", "05/05/2023", "10/05/2023", "15/05/2023", "20/05/2023", "25/05/2023"][i],
        totalProductos: Math.floor(Math.random() * 20) + 3,
        estado: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={estadoColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${estadoColor}.light`,
              }}
            >
              {estado}
            </MDTypography>
          </MDBox>
        ),
      };
    })
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
                Traspasos
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Gestión de traspasos entre sucursales
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
              Nuevo Traspaso
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>sync</Icon>}>
                Solicitar Traspaso
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>

        {/* Tarjetas de resumen */}
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
                  <Icon fontSize="medium">swap_horiz</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Traspasos Activos
                  </MDTypography>
                  <MDTypography variant="h4">10</MDTypography>
                </MDBox>
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
                  <Icon fontSize="medium">pending_actions</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Pendientes
                  </MDTypography>
                  <MDTypography variant="h4">5</MDTypography>
                </MDBox>
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
                  <Icon fontSize="medium">check_circle</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Completados
                  </MDTypography>
                  <MDTypography variant="h4">126</MDTypography>
                </MDBox>
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
                  <Icon fontSize="medium">cancel</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Cancelados
                  </MDTypography>
                  <MDTypography variant="h4">8</MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Pestañas */}
        <Card>
          <MDBox p={0}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                "& .MuiTabs-indicator": {
                  backgroundColor: "info.main"
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "info.main"
                }
              }}
            >
              <Tab label="Traspasos Activos" />
              <Tab label="Pendientes de Aprobación" />
              <Tab label="Histórico" />
            </Tabs>
            
            {/* Tab 1: Traspasos Activos */}
            <TabPanel value={tabValue} index={0}>
              <MDBox p={3}>
                {/* Área de búsqueda */}
                <Grid container spacing={3} alignItems="center" mb={3}>
                  <Grid item xs={12} md={4}>
                    <MDInput 
                      label="Buscar por ID" 
                      fullWidth 
                      icon={{ component: "search", direction: "left" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MDInput 
                      select
                      label="Estado"
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      <option value="">Todos</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="en_transito">En tránsito</option>
                      <option value="recibido">Recibido</option>
                      <option value="cancelado">Cancelado</option>
                    </MDInput>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MDInput 
                      select
                      label="Sucursal"
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      <option value="">Todas</option>
                      <option value="matriz">Matriz CdCaucel</option>
                      <option value="norte">Sucursal Norte</option>
                      <option value="sur">Sucursal Sur</option>
                      <option value="central">Almacén Central</option>
                    </MDInput>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <MDButton 
                      variant="gradient" 
                      color="info" 
                      fullWidth
                    >
                      Buscar
                    </MDButton>
                  </Grid>
                </Grid>

                <DataTable
                  table={traspasosTableData}
                  isSorted={false}
                  entriesPerPage={{
                    defaultValue: 10,
                    entries: [5, 10, 15, 20, 25],
                  }}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </TabPanel>
            
            {/* Tab 2: Pendientes de Aprobación */}
            <TabPanel value={tabValue} index={1}>
              <MDBox p={3}>
                <DataTable
                  table={pendientesTableData}
                  isSorted={false}
                  entriesPerPage={{
                    defaultValue: 5,
                    entries: [5, 10, 15, 20, 25],
                  }}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </TabPanel>
            
            {/* Tab 3: Histórico */}
            <TabPanel value={tabValue} index={2}>
              <MDBox p={3}>
                {/* Área de búsqueda y filtros */}
                <Grid container spacing={3} alignItems="center" mb={3}>
                  <Grid item xs={12} md={3}>
                    <MDInput 
                      type="date"
                      label="Fecha Desde"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MDInput 
                      type="date"
                      label="Fecha Hasta"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MDInput 
                      select
                      label="Tipo"
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      <option value="">Todos</option>
                      <option value="interno">Interno</option>
                      <option value="externo">Externo</option>
                      <option value="emergencia">Emergencia</option>
                      <option value="programado">Programado</option>
                    </MDInput>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <MDButton 
                      variant="gradient" 
                      color="info" 
                      fullWidth
                    >
                      Filtrar
                    </MDButton>
                  </Grid>
                </Grid>
                <DataTable
                  table={historicoTableData}
                  isSorted={false}
                  entriesPerPage={{
                    defaultValue: 10,
                    entries: [5, 10, 15, 20, 25],
                  }}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </TabPanel>
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Traspasos; 