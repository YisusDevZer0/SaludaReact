/**
=========================================================
* SaludaReact - Menú de Inventarios para Administrador
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
      id={`inventarios-tabpanel-${index}`}
      aria-labelledby={`inventarios-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function Inventarios() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Datos simulados para la tabla de inventarios
  const inventariosTableData = {
    columns: [
      { Header: "Código", accessor: "codigo" },
      { Header: "Producto", accessor: "producto" },
      { Header: "Descripción", accessor: "descripcion" },
      { Header: "Existencia", accessor: "existencia" },
      { Header: "Unidad", accessor: "unidad" },
      { Header: "Costo", accessor: "costo" },
      { Header: "Precio", accessor: "precio" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 10 }, (_, i) => {
      return {
        codigo: `MED${(1000 + i).toString().padStart(4, '0')}`,
        producto: ["Paracetamol", "Omeprazol", "Loratadina", "Ibuprofeno", "Ultrasonido"][i % 5],
        descripcion: ["500mg", "20mg", "10mg", "400mg", "De Abdomen Completo"][i % 5],
        existencia: Math.floor(Math.random() * 100) + 10,
        unidad: ["Tableta", "Cápsula", "Tableta", "Tableta", "Servicio"][i % 5],
        costo: `$${(Math.random() * 50 + 20).toFixed(2)}`,
        precio: `$${(Math.random() * 100 + 50).toFixed(2)}`,
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

  // Datos simulados para productos sin asignar
  const productosSinAsignarData = {
    columns: [
      { Header: "Código", accessor: "codigo" },
      { Header: "Producto", accessor: "producto" },
      { Header: "Cantidad", accessor: "cantidad" },
      { Header: "Fecha Recepción", accessor: "fecha" },
      { Header: "Proveedor", accessor: "proveedor" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 5 }, (_, i) => {
      return {
        codigo: `SIN${(100 + i).toString().padStart(3, '0')}`,
        producto: ["Amoxicilina", "Losartán", "Ranitidina", "Cetirizina", "Metformina"][i % 5],
        cantidad: Math.floor(Math.random() * 50) + 5,
        fecha: ["10/05/2023", "15/05/2023", "18/05/2023", "20/05/2023", "25/05/2023"][i % 5],
        proveedor: ["FarmaPro", "MediSupplies", "PharmaDist", "MedicalStock", "HealthDist"][i % 5],
        acciones: (
          <MDBox display="flex" alignItems="center">
            <MDButton variant="text" color="info" size="small">
              Asignar
            </MDButton>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para conteo de productos
  const conteoProductosData = {
    columns: [
      { Header: "ID Conteo", accessor: "id" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Responsable", accessor: "responsable" },
      { Header: "Total Productos", accessor: "total" },
      { Header: "Diferencias", accessor: "diferencias" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 7 }, (_, i) => {
      const estados = ["Completado", "En proceso", "Pendiente"];
      const estado = estados[i % 3];
      const estadoColor = estado === "Completado" ? "success" : estado === "En proceso" ? "warning" : "info";
      
      return {
        id: `CNT${(100 + i).toString().padStart(3, '0')}`,
        fecha: ["01/05/2023", "05/05/2023", "10/05/2023", "15/05/2023", "20/05/2023", "25/05/2023", "30/05/2023"][i],
        responsable: ["Juan Pérez", "María López", "Carlos Ruiz", "Ana Díaz", "Roberto Gómez", "Laura Torres", "Pedro Sánchez"][i],
        total: 100 + i * 20,
        diferencias: i * 2,
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
            <Icon sx={{ cursor: "pointer", ml: 1, color: "success.main" }}>print</Icon>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para productos próximos a caducar
  const caducidadesData = {
    columns: [
      { Header: "Código", accessor: "codigo" },
      { Header: "Producto", accessor: "producto" },
      { Header: "Lote", accessor: "lote" },
      { Header: "Cantidad", accessor: "cantidad" },
      { Header: "Fecha Caducidad", accessor: "caducidad" },
      { Header: "Días Restantes", accessor: "dias" },
      { Header: "Acciones", accessor: "acciones" },
    ],
    rows: Array.from({ length: 8 }, (_, i) => {
      const dias = i * 15 + 5;
      const estadoColor = dias < 30 ? "error" : dias < 60 ? "warning" : "info";
      
      return {
        codigo: `MED${(2000 + i).toString().padStart(4, '0')}`,
        producto: ["Amoxicilina 500mg", "Aciclovir Crema", "Diclofenaco 100mg", "Insulina NPH", "Azitromicina 500mg"][i % 5],
        lote: `L${(100 + i * 5).toString().padStart(3, '0')}-${23 + (i % 2)}`,
        cantidad: Math.floor(Math.random() * 50) + 5,
        caducidad: ["30/06/2023", "15/07/2023", "01/08/2023", "20/08/2023", "10/09/2023", "25/09/2023", "05/10/2023", "20/10/2023"][i],
        dias: (
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
            {dias} días
          </MDTypography>
        ),
        acciones: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "warning.main" }}>local_offer</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "info.main" }}>swap_horiz</Icon>
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
                Inventarios
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Gestión y control de inventarios
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="dark" startIcon={<Icon>download</Icon>}>
              Exportar
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="info" startIcon={<Icon>print</Icon>}>
                Imprimir
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
                  bgColor="success"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">inventory_2</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Total Productos
                  </MDTypography>
                  <MDTypography variant="h4">13,582</MDTypography>
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
                  <Icon fontSize="medium">category</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Categorías
                  </MDTypography>
                  <MDTypography variant="h4">24</MDTypography>
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
                  <Icon fontSize="medium">watch_later</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Por Caducar
                  </MDTypography>
                  <MDTypography variant="h4">38</MDTypography>
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
                  bgColor="info"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">attach_money</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Valor Inventario
                  </MDTypography>
                  <MDTypography variant="h4">$567,890</MDTypography>
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
              <Tab label="Inventarios" />
              <Tab label="Productos sin asignar" />
              <Tab label="Conteo de productos" />
              <Tab label="Prontos a caducar" />
            </Tabs>
            
            {/* Tab 1: Inventarios */}
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
                      label="Categoría"
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      <option value="">Todas las categorías</option>
                      <option value="medicamentos">Medicamentos</option>
                      <option value="servicios">Servicios</option>
                      <option value="insumos">Insumos</option>
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
                  table={inventariosTableData}
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
            
            {/* Tab 2: Productos sin asignar */}
            <TabPanel value={tabValue} index={1}>
              <MDBox p={3}>
                <DataTable
                  table={productosSinAsignarData}
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
            
            {/* Tab 3: Conteo de productos */}
            <TabPanel value={tabValue} index={2}>
              <MDBox p={3}>
                <MDBox mb={3} display="flex" justifyContent="flex-end">
                  <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
                    Nuevo conteo
                  </MDButton>
                </MDBox>
                <DataTable
                  table={conteoProductosData}
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
            
            {/* Tab 4: Prontos a caducar */}
            <TabPanel value={tabValue} index={3}>
              <MDBox p={3}>
                <DataTable
                  table={caducidadesData}
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

export default Inventarios; 