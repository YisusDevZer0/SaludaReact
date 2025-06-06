/**
=========================================================
* SaludaReact - Menú de Almacén para Administrador
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
      id={`almacen-tabpanel-${index}`}
      aria-labelledby={`almacen-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function Almacen() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Datos simulados para la tabla de almacén
  const almacenTableData = {
    columns: [
      { Header: "Código", accessor: "codigo" },
      { Header: "Producto", accessor: "producto" },
      { Header: "Descripción", accessor: "descripcion" },
      { Header: "Cantidad", accessor: "cantidad" },
      { Header: "Ubicación", accessor: "ubicacion" },
      { Header: "Fecha Recepción", accessor: "fechaRecepcion" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 10 }, (_, i) => {
      return {
        codigo: `USG_${(100 + i).toString().padStart(3, '0')}`,
        producto: ["Ultrasonido de Abdomen", "Paracetamol", "Omeprazol", "Loratadina", "Ibuprofeno"][i % 5],
        descripcion: ["Completo", "500mg", "20mg", "10mg", "400mg"][i % 5],
        cantidad: Math.floor(Math.random() * 100) + 10,
        ubicacion: ["Consultorio 101", "Estante A-1", "Estante B-2", "Estante A-3", "Estante C-1"][i % 5],
        fechaRecepcion: ["15/05/2023", "16/05/2023", "17/05/2023", "18/05/2023", "19/05/2023"][i % 5],
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para compras
  const comprasTableData = {
    columns: [
      { Header: "Orden #", accessor: "orden" },
      { Header: "Proveedor", accessor: "proveedor" },
      { Header: "Fecha Orden", accessor: "fechaOrden" },
      { Header: "Total", accessor: "total" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Fecha Entrega", accessor: "fechaEntrega" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 7 }, (_, i) => {
      const estadoOptions = ["Pendiente", "En proceso", "Entregada", "Cancelada"];
      const estado = estadoOptions[i % 4];
      const estadoColor = estado === "Pendiente" ? "info" : estado === "En proceso" ? "warning" : estado === "Entregada" ? "success" : "error";
      
      return {
        orden: `OC-${(1000 + i).toString()}`,
        proveedor: ["FarmaPro", "MediSupplies", "PharmaDist", "MedicalStock", "HealthDist", "BioMed", "MedEquip"][i],
        fechaOrden: ["10/05/2023", "12/05/2023", "15/05/2023", "18/05/2023", "20/05/2023", "25/05/2023", "27/05/2023"][i],
        total: `$${(Math.random() * 10000 + 1000).toFixed(2)}`,
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
        fechaEntrega: estado === "Entregada" ? ["15/05/2023", "17/05/2023", "20/05/2023", "23/05/2023", "25/05/2023", "30/05/2023", "02/06/2023"][i] : "-",
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "warning.main" }}>print</Icon>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para ingresos de medicamentos
  const ingresosTableData = {
    columns: [
      { Header: "ID", accessor: "id" },
      { Header: "Orden Compra", accessor: "ordenCompra" },
      { Header: "Fecha Ingreso", accessor: "fechaIngreso" },
      { Header: "Total Productos", accessor: "totalProductos" },
      { Header: "Recibido por", accessor: "recibidoPor" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 8 }, (_, i) => {
      const estadoOptions = ["Pendiente", "Revisado", "Finalizado"];
      const estado = estadoOptions[i % 3];
      const estadoColor = estado === "Pendiente" ? "warning" : estado === "Revisado" ? "info" : "success";
      
      return {
        id: `ING-${(100 + i).toString().padStart(3, '0')}`,
        ordenCompra: `OC-${(1000 + i % 7).toString()}`,
        fechaIngreso: ["15/05/2023", "17/05/2023", "20/05/2023", "23/05/2023", "25/05/2023", "30/05/2023", "02/06/2023", "05/06/2023"][i],
        totalProductos: Math.floor(Math.random() * 30) + 5,
        recibidoPor: ["Juan Pérez", "María López", "Carlos Ruiz", "Ana Díaz", "Roberto Gómez", "Laura Torres", "Pedro Sánchez", "Elena Martínez"][i],
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
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "warning.main" }}>print</Icon>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para traspasos
  const traspasosTableData = {
    columns: [
      { Header: "ID", accessor: "id" },
      { Header: "Origen", accessor: "origen" },
      { Header: "Destino", accessor: "destino" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Total Productos", accessor: "totalProductos" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 6 }, (_, i) => {
      const estadoOptions = ["Pendiente", "En tránsito", "Recibido", "Cancelado"];
      const estado = estadoOptions[i % 4];
      const estadoColor = estado === "Pendiente" ? "info" : estado === "En tránsito" ? "warning" : estado === "Recibido" ? "success" : "error";
      
      return {
        id: `TR-${(100 + i).toString().padStart(3, '0')}`,
        origen: ["Matriz CdCaucel", "Sucursal Norte", "Almacén Central", "Sucursal Sur", "Consultorio", "Farmacia"][i],
        destino: ["Sucursal Norte", "Almacén Central", "Sucursal Sur", "Consultorio", "Farmacia", "Matriz CdCaucel"][i],
        fecha: ["10/05/2023", "15/05/2023", "20/05/2023", "25/05/2023", "30/05/2023", "05/06/2023"][i],
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Encabezado y botones de acción */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={8}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="medium">
                Almacenaje y productos
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Gestión de almacén
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
              Nuevo Ingreso
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>swap_horiz</Icon>}>
                Traspaso
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
                  <Icon fontSize="medium">warehouse</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Productos en Almacén
                  </MDTypography>
                  <MDTypography variant="h4">1,285</MDTypography>
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
                  <Icon fontSize="medium">shopping_cart</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Órdenes de Compra
                  </MDTypography>
                  <MDTypography variant="h4">7</MDTypography>
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
                  <Icon fontSize="medium">inventory</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Ingresos Recientes
                  </MDTypography>
                  <MDTypography variant="h4">8</MDTypography>
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
                  <Icon fontSize="medium">swap_horiz</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Traspasos Pendientes
                  </MDTypography>
                  <MDTypography variant="h4">3</MDTypography>
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
              <Tab label="Almacén" />
              <Tab label="Compras" />
              <Tab label="Ingreso de medicamentos" />
              <Tab label="Traspasos" />
            </Tabs>
            
            {/* Tab 1: Almacén */}
            <TabPanel value={tabValue} index={0}>
              <MDBox p={3}>
                {/* Área de búsqueda */}
                <Grid container spacing={3} alignItems="center" mb={3}>
                  <Grid item xs={12} md={6}>
                    <MDInput 
                      label="Buscar producto" 
                      fullWidth 
                      icon={{ component: "search", direction: "left" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MDInput 
                      select
                      label="Ubicación"
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      <option value="">Todas las ubicaciones</option>
                      <option value="consultorio">Consultorio</option>
                      <option value="estante_a">Estante A</option>
                      <option value="estante_b">Estante B</option>
                      <option value="estante_c">Estante C</option>
                    </MDInput>
                  </Grid>
                  <Grid item xs={12} md={3}>
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
                  table={almacenTableData}
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
            
            {/* Tab 2: Compras */}
            <TabPanel value={tabValue} index={1}>
              <MDBox p={3}>
                <MDBox mb={3} display="flex" justifyContent="flex-end">
                  <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
                    Nueva Orden de Compra
                  </MDButton>
                </MDBox>
                <DataTable
                  table={comprasTableData}
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
            
            {/* Tab 3: Ingreso de medicamentos */}
            <TabPanel value={tabValue} index={2}>
              <MDBox p={3}>
                <MDBox mb={3} display="flex" justifyContent="flex-end">
                  <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
                    Registrar Ingreso
                  </MDButton>
                </MDBox>
                <DataTable
                  table={ingresosTableData}
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
            
            {/* Tab 4: Traspasos */}
            <TabPanel value={tabValue} index={3}>
              <MDBox p={3}>
                <MDBox mb={3} display="flex" justifyContent="space-between">
                  <MDBox>
                    <MDButton variant="outlined" color="info" startIcon={<Icon>list</Icon>} sx={{ mr: 1 }}>
                      Listado de traspasos
                    </MDButton>
                    <MDButton variant="outlined" color="dark" startIcon={<Icon>local_shipping</Icon>}>
                      Traspasos Cedis
                    </MDButton>
                  </MDBox>
                  <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
                    Nuevo Traspaso
                  </MDButton>
                </MDBox>
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
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Almacen; 