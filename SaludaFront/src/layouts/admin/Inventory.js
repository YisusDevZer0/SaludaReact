/**
=========================================================
* SaludaReact - Menú de Inventario para Administrador
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

// Imágenes de productos (usando avatars con colores)
const productImages = [
  { bgColor: "info", text: "P" },
  { bgColor: "success", text: "O" },
  { bgColor: "warning", text: "L" },
  { bgColor: "error", text: "I" },
  { bgColor: "dark", text: "M" }
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function Inventory() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Datos simulados para la tabla de inventario
  const inventoryTableData = {
    columns: [
      { Header: "Producto", accessor: "product" },
      { Header: "Código", accessor: "code" },
      { Header: "Categoría", accessor: "category" },
      { Header: "Stock", accessor: "stock" },
      { Header: "Stock Mínimo", accessor: "minStock" },
      { Header: "Precio Compra", accessor: "buyPrice" },
      { Header: "Precio Venta", accessor: "sellPrice" },
      { Header: "Estatus", accessor: "status" },
      { Header: "Acciones", accessor: "actions" },
    ],
    rows: Array.from({ length: 15 }, (_, i) => {
      const imgIndex = i % productImages.length;
      const status = i % 10 === 0 ? "Crítico" : i % 5 === 0 ? "Alerta" : "Normal";
      const statusColor = status === "Crítico" ? "error" : status === "Alerta" ? "warning" : "success";
      
      return {
        product: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              bgColor={productImages[imgIndex].bgColor}
              size="sm"
              sx={{ mr: 1 }}
            >
              {productImages[imgIndex].text}
            </MDAvatar>
            <MDTypography variant="button" fontWeight="medium">
              {["Paracetamol 500mg", "Omeprazol 20mg", "Loratadina 10mg", "Ibuprofeno 400mg", "Metformina 850mg"][i % 5]}
              {i > 4 ? ` ${Math.floor(i / 5) + 1}` : ""}
            </MDTypography>
          </MDBox>
        ),
        code: `MED${(1000 + i).toString().padStart(4, '0')}`,
        category: ["Analgésicos", "Gastroenterología", "Antialérgicos", "Analgésicos", "Diabetes"][i % 5],
        stock: Math.floor(Math.random() * 100) + 1,
        minStock: 10 + (i % 10),
        buyPrice: `$${(Math.random() * 20 + 10).toFixed(2)}`,
        sellPrice: `$${(Math.random() * 30 + 15).toFixed(2)}`,
        status: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={statusColor}
              fontWeight="medium"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "5px",
                backgroundColor: `${statusColor}.light`,
              }}
            >
              {status}
            </MDTypography>
          </MDBox>
        ),
        actions: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>edit</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
          </MDBox>
        ),
      };
    })
  };

  // Datos simulados para productos de baja rotación
  const lowRotationTableData = {
    columns: [
      { Header: "Producto", accessor: "product" },
      { Header: "Código", accessor: "code" },
      { Header: "Último Movimiento", accessor: "lastMovement" },
      { Header: "Días sin Movimiento", accessor: "days" },
      { Header: "Stock Actual", accessor: "stock" },
      { Header: "Valor", accessor: "value" },
      { Header: "Acción Recomendada", accessor: "action" },
    ],
    rows: Array.from({ length: 8 }, (_, i) => {
      const imgIndex = i % productImages.length;
      return {
        product: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              bgColor={productImages[imgIndex].bgColor}
              size="sm"
              sx={{ mr: 1 }}
            >
              {productImages[imgIndex].text}
            </MDAvatar>
            <MDTypography variant="button" fontWeight="medium">
              {["Ciprofloxacino 500mg", "Aciclovir 200mg", "Naproxeno 550mg", "Clonazepam 2mg", "Risperidona 3mg"][i % 5]}
              {i > 4 ? ` ${Math.floor(i / 5) + 1}` : ""}
            </MDTypography>
          </MDBox>
        ),
        code: `MED${(2000 + i).toString().padStart(4, '0')}`,
        lastMovement: ["12/01/2023", "15/02/2023", "03/01/2023", "18/12/2022", "05/03/2023"][i % 5],
        days: 30 + i * 10,
        stock: Math.floor(Math.random() * 20) + 5,
        value: `$${((Math.random() * 20 + 10) * (Math.floor(Math.random() * 20) + 5)).toFixed(2)}`,
        action: ["Promoción", "Descuento", "Reubicar", "Revisar caducidad", "Devolución a proveedor"][i % 5],
      };
    })
  };

  // Datos simulados para productos por caducar
  const expirationTableData = {
    columns: [
      { Header: "Producto", accessor: "product" },
      { Header: "Código", accessor: "code" },
      { Header: "Lote", accessor: "batch" },
      { Header: "Fecha Caducidad", accessor: "expiration" },
      { Header: "Días Restantes", accessor: "days" },
      { Header: "Stock", accessor: "stock" },
      { Header: "Ubicación", accessor: "location" },
      { Header: "Acciones", accessor: "actions" },
    ],
    rows: Array.from({ length: 10 }, (_, i) => {
      const imgIndex = i % productImages.length;
      const days = i * 5 + 5;
      const statusColor = days < 30 ? "error" : days < 60 ? "warning" : "info";
      
      return {
        product: (
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              bgColor={productImages[imgIndex].bgColor}
              size="sm"
              sx={{ mr: 1 }}
            >
              {productImages[imgIndex].text}
            </MDAvatar>
            <MDTypography variant="button" fontWeight="medium">
              {["Amoxicilina 500mg", "Aciclovir Crema", "Diclofenaco 100mg", "Insulina NPH", "Azitromicina 500mg"][i % 5]}
              {i > 4 ? ` ${Math.floor(i / 5) + 1}` : ""}
            </MDTypography>
          </MDBox>
        ),
        code: `MED${(3000 + i).toString().padStart(4, '0')}`,
        batch: `L${(100 + i * 5).toString().padStart(3, '0')}-${23 + (i % 2)}`,
        expiration: [
          "30/06/2023", "15/07/2023", "01/08/2023", "20/08/2023", "10/09/2023",
          "25/09/2023", "05/10/2023", "20/10/2023", "15/11/2023", "01/12/2023"
        ][i],
        days: (
          <MDTypography
            variant="caption"
            color={statusColor}
            fontWeight="medium"
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: "5px",
              backgroundColor: `${statusColor}.light`,
            }}
          >
            {days} días
          </MDTypography>
        ),
        stock: Math.floor(Math.random() * 15) + 3,
        location: ["Estante A1", "Estante B2", "Estante C3", "Refrigerador 1", "Bodega"][i % 5],
        actions: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "warning.main" }}>local_offer</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "info.main" }}>swap_horiz</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
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
                Inventario
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Gestión y control de productos
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="success" startIcon={<Icon>add</Icon>}>
              Nuevo Producto
            </MDButton>
            <MDBox ml={1}>
              <MDButton variant="gradient" color="dark" startIcon={<Icon>upload</Icon>}>
                Importar
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
                  <Icon fontSize="medium">inventory_2</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Total Productos
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
                  bgColor="error"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  mr={2}
                >
                  <Icon fontSize="medium">warning</Icon>
                </MDBox>
                <MDBox>
                  <MDTypography variant="h6" fontWeight="medium">
                    Alertas Stock
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
                  bgColor="warning"
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
                  bgColor="success"
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

        {/* Área de búsqueda */}
        <Card mb={3} sx={{ overflow: "visible" }}>
          <MDBox p={3}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <MDInput 
                  label="Buscar producto" 
                  fullWidth 
                  icon={{ component: "search", direction: "left" }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <MDBox>
                  <MDTypography variant="caption" fontWeight="bold" color="text">
                    CATEGORÍA
                  </MDTypography>
                  <MDInput 
                    select
                    fullWidth
                    SelectProps={{ native: true }}
                    sx={{ mt: 1 }}
                  >
                    <option value="">Todas</option>
                    <option value="analgesicos">Analgésicos</option>
                    <option value="antibioticos">Antibióticos</option>
                    <option value="antialergicos">Antialérgicos</option>
                    <option value="gastroenterologia">Gastroenterología</option>
                    <option value="diabetes">Diabetes</option>
                  </MDInput>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={2}>
                <MDBox>
                  <MDTypography variant="caption" fontWeight="bold" color="text">
                    ESTATUS
                  </MDTypography>
                  <MDInput 
                    select
                    fullWidth
                    SelectProps={{ native: true }}
                    sx={{ mt: 1 }}
                  >
                    <option value="">Todos</option>
                    <option value="normal">Normal</option>
                    <option value="alerta">Alerta</option>
                    <option value="critico">Crítico</option>
                  </MDInput>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={2}>
                <MDButton 
                  variant="gradient" 
                  color="info" 
                  fullWidth
                  sx={{ mt: 3.5 }}
                >
                  Buscar
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>
        </Card>

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
              <Tab label="Inventario General" />
              <Tab label="Baja Rotación" />
              <Tab label="Próximos a Caducar" />
            </Tabs>
            
            {/* Tab 1: Inventario General */}
            <TabPanel value={tabValue} index={0}>
              <MDBox p={3}>
                <DataTable
                  table={inventoryTableData}
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
            
            {/* Tab 2: Productos de Baja Rotación */}
            <TabPanel value={tabValue} index={1}>
              <MDBox p={3}>
                <DataTable
                  table={lowRotationTableData}
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
            
            {/* Tab 3: Productos por Caducar */}
            <TabPanel value={tabValue} index={2}>
              <MDBox p={3}>
                <DataTable
                  table={expirationTableData}
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

export default Inventory; 