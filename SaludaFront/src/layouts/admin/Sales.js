/**
=========================================================
* SaludaReact - Menú de Ventas para Administrador
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

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

function Sales() {
  // Datos simulados para la gráfica de ventas mensuales
  const salesChartData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Ventas Mensuales",
        color: "info",
        data: [50, 60, 70, 65, 75, 90, 80, 85, 95, 100, 110, 120],
      },
    ],
  };

  // Datos simulados para la tabla de ventas recientes
  const salesTableData = {
    columns: [
      { Header: "Número", accessor: "id" },
      { Header: "Fecha", accessor: "date" },
      { Header: "Cliente", accessor: "customer" },
      { Header: "Productos", accessor: "products" },
      { Header: "Total", accessor: "total" },
      { Header: "Estado", accessor: "status" },
      { Header: "Acciones", accessor: "actions" },
    ],
    rows: [
      {
        id: "#0001",
        date: "23/05/2023",
        customer: "Juan Pérez",
        products: "4",
        total: "$1,250.00",
        status: "Completada",
        actions: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
          </MDBox>
        ),
      },
      {
        id: "#0002",
        date: "23/05/2023",
        customer: "María López",
        products: "2",
        total: "$450.00",
        status: "Completada",
        actions: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
          </MDBox>
        ),
      },
      {
        id: "#0003",
        date: "22/05/2023",
        customer: "Carlos Ruiz",
        products: "6",
        total: "$890.00",
        status: "Completada",
        actions: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
          </MDBox>
        ),
      },
      {
        id: "#0004",
        date: "22/05/2023",
        customer: "Ana Díaz",
        products: "3",
        total: "$620.00",
        status: "Completada",
        actions: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
          </MDBox>
        ),
      },
      {
        id: "#0005",
        date: "21/05/2023",
        customer: "Roberto Gómez",
        products: "5",
        total: "$780.00",
        status: "Completada",
        actions: (
          <MDBox display="flex" alignItems="center">
            <Icon sx={{ cursor: "pointer", color: "info.main" }}>visibility</Icon>
            <Icon sx={{ cursor: "pointer", ml: 1, color: "error.main" }}>delete</Icon>
          </MDBox>
        ),
      },
    ],
  };

  // Datos simulados para productos más vendidos
  const topProductsData = {
    columns: [
      { Header: "Producto", accessor: "product" },
      { Header: "Categoría", accessor: "category" },
      { Header: "Precio", accessor: "price" },
      { Header: "Cantidad Vendida", accessor: "quantity" },
      { Header: "Total", accessor: "total" },
    ],
    rows: [
      {
        product: "Paracetamol 500mg",
        category: "Analgésicos",
        price: "$25.00",
        quantity: "128",
        total: "$3,200.00",
      },
      {
        product: "Omeprazol 20mg",
        category: "Gastroenterología",
        price: "$30.00",
        quantity: "95",
        total: "$2,850.00",
      },
      {
        product: "Loratadina 10mg",
        category: "Antialérgicos",
        price: "$20.00",
        quantity: "87",
        total: "$1,740.00",
      },
      {
        product: "Ibuprofeno 400mg",
        category: "Analgésicos",
        price: "$18.00",
        quantity: "75",
        total: "$1,350.00",
      },
      {
        product: "Metformina 850mg",
        category: "Diabetes",
        price: "$22.00",
        quantity: "68",
        total: "$1,496.00",
      },
    ],
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
                  <MDTypography variant="h4">$2,590.00</MDTypography>
                </MDBox>
              </MDBox>
              <Divider />
              <MDBox p={2}>
                <MDTypography component="p" variant="button" color="text" display="flex" alignItems="center">
                  <Icon color="success" fontSize="small" sx={{ mr: 0.5 }}>arrow_upward</Icon>
                  <MDTypography variant="button" color="success" fontWeight="medium">12%</MDTypography>
                  &nbsp; más que ayer
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
                  <MDTypography variant="h4">$15,480.00</MDTypography>
                </MDBox>
              </MDBox>
              <Divider />
              <MDBox p={2}>
                <MDTypography component="p" variant="button" color="text" display="flex" alignItems="center">
                  <Icon color="success" fontSize="small" sx={{ mr: 0.5 }}>arrow_upward</Icon>
                  <MDTypography variant="button" color="success" fontWeight="medium">8%</MDTypography>
                  &nbsp; más que la semana anterior
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
                  <MDTypography variant="h4">58</MDTypography>
                </MDBox>
              </MDBox>
              <Divider />
              <MDBox p={2}>
                <MDTypography component="p" variant="button" color="text" display="flex" alignItems="center">
                  <Icon color="success" fontSize="small" sx={{ mr: 0.5 }}>arrow_upward</Icon>
                  <MDTypography variant="button" color="success" fontWeight="medium">5%</MDTypography>
                  &nbsp; más que el mes anterior
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
                  <MDTypography variant="h4">12</MDTypography>
                </MDBox>
              </MDBox>
              <Divider />
              <MDBox p={2}>
                <MDTypography component="p" variant="button" color="text" display="flex" alignItems="center">
                  <Icon color="error" fontSize="small" sx={{ mr: 0.5 }}>arrow_downward</Icon>
                  <MDTypography variant="button" color="error" fontWeight="medium">3%</MDTypography>
                  &nbsp; menos que el mes anterior
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